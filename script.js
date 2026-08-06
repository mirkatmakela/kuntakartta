/*
  Suomen kuntakartta - kommentoitu toiminto

  Tämä skripti lataa GeoJSON-tiedoston, piirtää Suomen kuntien rajat
  Leaflet-kartalle ja kertoo, mitkä kunnat on klikattu aiemmin.

  - `map` luo Leaflet-kartan elementtiin #map.
  - `kaydyt` hakee selaimen localStorage:sta tallennetun olion,
    jossa seurataan klikattuja kuntia, ja alustaa sen tyhjäksi
    jos tietoja ei vielä ole.
  - `kuntavarit` määrittelee kunkin kunnan tyylin: vihreä varattu
    tila on klikattujen kuntien kohdalla, punainen oletustila.
  - `alustaKunta` liittää popupin ja klikkitapahtuman jokaiselle
    kunnan polygonille. Klikkauksen jälkeen kunta merkitään käydyksi,
    tallennetaan localStorageen ja sen tyyli päivitetään.
  - Lopuksi GeoJSON-data ladataan `fetch`-kutsulla, luodaan GeoJSON-kerros
    ja sovitetaan kartan näkymä kaikkien kuntien rajojen mukaan.
*/

const map = L.map('map');
const kuntienLkm = document.getElementById("kuntienLkm");
//Tähän tallennetaan kuntien rajat, jotta voidaan myöhemmin käyttää layereita
let kunnatKartalla;
//paikallinen muisti johon tallennetaan olio, jossa käydyt kunnat
let kaydyt = JSON.parse(localStorage.getItem("kaydyt")) || {};
const tyhjennysnappi = document.getElementById("tyhjennysnappi");
tyhjennysnappi.addEventListener("click", tyhjenna);
const haku = document.getElementById("haku");
haku.addEventListener("input", etsiKuntaa);

function etsiKuntaa() {
    const hakuarvo = haku.value.toLowerCase();
    const layerit = kunnatKartalla.getLayers();

    const kuntaLoytyi = layerit.find(function(layer) {
    const kunnanNimi = layer.feature.properties.nimi.toLowerCase();
    return kunnanNimi === hakuarvo;
});
    if (kuntaLoytyi) {
        map.flyToBounds(kuntaLoytyi.getBounds());
    }
}

function kuntavarit(feature) {
    if (kaydyt[feature.properties.kunta]) {
        return {
            color: "black",
            weight: 1,
            fillColor : "green",
        };
    } else {
        return {
            color: "black",
            weight: 1,
            fillColor: "red",
            fillOpacity: 0.5
        };
    }
}

function paivitaLaskuri() {
    const laskuri = document.getElementById("laskuri");
    laskuri.textContent = Object.keys(kaydyt).length;
}

function paivitaPopup(feature, layer) {
    const koodi = feature.properties.kunta;
    if (!kaydyt[koodi]) {
        layer.bindPopup(feature.properties.nimi);
    } else {
        layer.bindPopup(feature.properties.nimi + "<br>käyty: " + kaydyt[koodi].paiva);
    }
}

function alustaKunta(feature, layer) {
    const koodi = feature.properties.kunta;
    //liittää kuntaan popupin
    //jos käyty, näytä myös pvm
    paivitaPopup(feature, layer);
    //avaa popupin kun hiiri menee päälle
    layer.on("mouseover", function() {
        layer.openPopup();
    });
    layer.on("mouseout", function() {
        layer.closePopup();
    });
    layer.on("click", function() {
            
        if (!kaydyt[koodi]) {
            if (confirm("Merkitäänkö " + feature.properties.nimi + " käydyksi?")) {
                kaydyt[koodi] = {
                paiva: new Date().toLocaleDateString("fi-FI")}
            }
        } else {
            if (confirm("Haluatko poistaa merkinnän " + feature.properties.nimi + "?")) {
                delete kaydyt[koodi];
            }
        }
        tallennaKaydyt();
        paivitaKunta(feature, layer);
        paivitaLaskuri();
    });
}

function paivitaKunta(feature, layer) {
    //paivittaa värin kartalle
    layer.setStyle(kuntavarit(feature));

    //paivittaa popupin
    paivitaPopup(feature, layer);
}

function tallennaKaydyt() {
    localStorage.setItem("kaydyt", JSON.stringify(kaydyt));
}

function tyhjenna() {
    if (confirm("Haluatko tyhjentää kaikki merkinnät?")) {
        kaydyt = {};
        tallennaKaydyt();
        paivitaLaskuri();
        kunnatKartalla.eachLayer(layer => {
            paivitaKunta(layer.feature, layer);
        });
    }
}

//ohjelma alkaa tästä
fetch("kunta4500k_wgs84.geojson")
    .then(response => response.json())
    .then(data => {
        //kuntienLkm on span-elementti, johon kirjoitetaan kuntien lukumäärä
        kuntienLkm.textContent = data.features.length;
        paivitaLaskuri();

        //luodaan kuntien rajat kartalle
        kunnatKartalla =  L.geoJSON(data, {
            style: kuntavarit, 
            onEachFeature: alustaKunta
        }).addTo(map);
        //sovitetaan kartan näkymä kuntien rajojen mukaan
        map.fitBounds(kunnatKartalla.getBounds());
    })

//testi, että ohjelma päästiin loppuun:
//console.log("paastiin loppuun");


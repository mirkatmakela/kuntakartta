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
//paikallinen muisti johon tallennetaan olio, jossa käydyt kunnat
let kaydyt = JSON.parse(localStorage.getItem("kaydyt")) || {};


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

function alustaKunta(feature, layer) {
    const koodi = feature.properties.kunta;
    layer.bindPopup(feature.properties.nimi);
    layer.on("click", function() {
            
        if (!kaydyt[koodi]) {
            if (confirm("Merkitäänkö " + feature.properties.nimi + " käydyksi?")) {
                kaydyt[koodi] = {
                paiva: new Date().toLocaleDateString("fi-FI")}
                tallennaKaydyt();
                layer.setStyle(kuntavarit(feature));
            }
        } else {
            if (confirm("Haluatko poistaa merkinnän " + feature.properties.nimi + "?")) {
                delete kaydyt[koodi];
                tallennaKaydyt();
                layer.setStyle(kuntavarit(feature));
            }
        }
    });
}

function tallennaKaydyt() {
    localStorage.setItem("kaydyt", JSON.stringify(kaydyt));
}

//ohjelma alkaa tästä
fetch("kunta4500k_wgs84.geojson")
    .then(response => response.json())
    .then(data => {
       const kunnat =  L.geoJSON(data, {
    style: kuntavarit, 
    onEachFeature: alustaKunta
}).addTo(map);
        map.fitBounds(kunnat.getBounds());
    })

//testi, että ohjelma päästiin loppuun:
//console.log("paastiin loppuun");


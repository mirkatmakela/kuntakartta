//console.log("ohjelma kaynnistyi");

const map = L.map('map');
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

fetch("kunta4500k_wgs84.geojson")
    .then(response => response.json())
    .then(data => {
       const kunnat =  L.geoJSON(data, {
    style: kuntavarit, 
    onEachFeature: function(feature, layer) {
        const koodi = feature.properties.kunta;
        layer.bindPopup(feature.properties.nimi);
        layer.on("click", function() {
            
        if (!kaydyt[koodi]) {
        kaydyt[koodi] = {
            paiva: new Date().toLocaleDateString("fi-FI")}
        layer.setStyle(kuntavarit(feature));
        }
        localStorage.setItem("kaydyt", JSON.stringify(kaydyt))

        });
    }
}).addTo(map);
        map.fitBounds(kunnat.getBounds());
    })


//console.log("paastiin loppuun");


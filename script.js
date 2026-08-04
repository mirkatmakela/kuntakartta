var map = L.map('map').setView([64.96, 27.59], 6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


fetch("kunta4500k_wgs84.geojson")
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
    style: function(feature) {
        return {
            color: "black",
            weight: 1,
            fillColor: "lightgreen",
            fillOpacity: 0.5
        };
    }, 
    onEachFeature: function(feature, layer) {
        // tähän tulee klikkaustoiminto
        layer.bindPopup(feature.properties.nimi);
    }
}).addTo(map);
    });

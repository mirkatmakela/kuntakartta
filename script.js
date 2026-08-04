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
        const koodi = feature.properties.kunta;
        layer.bindPopup(feature.properties.nimi);
        layer.on("click", function() {
        if (!kaydyt[koodi]) {
        kaydyt[koodi] = {
            paiva: new Date().toLocaleDateString("fi-FI")}
        }
        layer.setStyle({
        weight: 3,
        color: '#666',
        fillColor: "blue"});
        });
    }
}).addTo(map);
    });

//tyhjä lista onko vierailtu
const kaydyt = {};


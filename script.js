var map = L.map('map').setView([64.96, 27.59], 6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = L.marker([65.0, 25.5]).addTo(map);

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
    onEachFeature: function(feature.properties.nimi, layer) {
        // tähän tulee klikkaustoiminto
        popup
        layer.on.bindPopup("Olen kunta");
    }
}).addTo(map);
    });

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);

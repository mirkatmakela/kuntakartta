const map = L.map('map');


fetch("kunta4500k_wgs84.geojson")
    .then(response => response.json())
    .then(data => {
       const kunnat =  L.geoJSON(data, {
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
map.fitBounds(kunnat.getBounds());
//tyhjä lista onko vierailtu
const kaydyt = {};
console.log(kaydyt);

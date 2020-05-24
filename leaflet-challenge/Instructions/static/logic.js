var API_KEY = "pk.eyJ1IjoiaGVycnljbGEiLCJhIjoiY2s4cnhpMjhyMDRmbjNlbWN3YWt4dDFweCJ9.MtOKNZjR9DTyEu8NaaacTQ"
var grey_map = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

var map = L.map("map", {
    center: [40.73, -74.0059],
    zoom: 5,
    
});
grey_map.addTo (map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data){
    function style_info(feature) {
        return {
            radius: getradius(feature.properties.mag),
            fillColor: getcolor(feature.properties.mag),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };   
    };
    function getcolor(magnitude){
        switch(true){
            case magnitude >5:
                return "red";
            case magnitude >4:
                return "blue";
            case magnitude >3:
                return "brown";
            case magnitude >2:
                return "yellow";
            case magnitude >1:
                return "purple";
            default: 
                return "black";
        }
    }
function getradius (magnitude){
    return magnitude * 4;
}
    
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        }, 
        style: style_info, 
        onEachFeature:function (feature, layer){
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(map);

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0,1,2,3,4,5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getcolor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
});

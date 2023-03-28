// API endpoint 
var queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// create createMap function
function createMap(earthquakes){
    // create base layers
    var street= L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    // create a baseMaps object
    var baseMaps={
        "Street Map":street
    };

    // create an overlayMaps object
    var overlayMaps={
        "earthquakes": earthquakes
    };

    // create map object
    var myMap= L.map("map",{
        center:[39.8283, -98.5795],
        zoom: 4,
        layers:[street,earthquakes]
    });
    L.control.layers(baseMaps,overlayMaps).addTo(myMap);

    // set up legend
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
    var div = L.DomUtil.create("div", "legend");

    div.innerHTML += "<h4 style='background-color:white'>Legend by Depth(km)</h4>" +
        '<i style="background-color:yellow">-10-9 km</i><br>'+
        '<i style="background-color:red">10-29 km</i><br>' +
        '<i style="background-color:orange">30-49 km</i><br>'+
        '<i style="background-color:green">50-69 km</i><br>'+
        '<i style="background-color:violet">70-90 km</i><br>'+
        '<i style="background-color:purple">90+ km</i><br>'
        return div;
    };
    legend.addTo(myMap);
}

// create function to select color
function color(depth){
    if (depth<10){
        return "yellow";
    } else if (depth<30){
        return "red";
    } else if (depth<50){
        return "orange";
    } else if (depth<70){
        return "green";
    } else if (depth<=90){
        return "violet";
    } else{
        return "purple";
    };
}

// create function to select marker size
function markerSize(mag){
    return mag * 40000;
}

// get data using d3 and queryUrl
d3.json(queryUrl).then(function(data){
    createFeatures(data.features);
    console.log(data.features);
});

// create the createFeatures function
function createFeatures(earthquakeData){
    var earthquakes=L.geoJSON(earthquakeData,{
        onEachFeature: function(feature,layer){
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
            <h4> Date:${new Date(feature.properties.time)}</h4><hr>
            <h4>Magnitude:${feature.properties.mag}</h4>
            <h4>Depth:${feature.geometry.coordinates[2]}</h4>`)
        },
        pointToLayer: function(feature, latlng){
            return new L.circle(latlng,
                {radius:markerSize(feature.properties.mag),
                fillColor:color(feature.geometry.coordinates[2]),
                fillOpacity:0.50,
                stroke:false
            })
        }
    });
    // Add feature to createMap function
    createMap(earthquakes);
}


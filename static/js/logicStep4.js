// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});
// We create the dark view title layer that will be an option
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Create a base layer that holds both maps.
let baseMaps = {
    "Streets": streets,
    "Satellite": satelliteStreets
};

// Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();

// We define an object that contains the overlays. This overlay will be visible all the time.
let overlays = {
  "Earthquakes": earthquakes
};

// Craete the map object with center, zoom and default layer
let map = L.map('mapid', {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets]
});

// Pass our map layers into our layers control
L.control.layers(baseMaps, overlays).addTo(map);

// Accessing the Toronto neighborhoods GeoJSON URL
let usgsData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// This function returns the style data for each of the earthquakes we plot on
// the map. We pass the magnitude of the earthquake into a function
// to calculate the radius.
function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

// This function determines the color of the circle based on the magnitude of the earthquake.
function getColor(magnitude) {
  if (magnitude > 5) {
    return "#ea2c2c";
  }
  else if (magnitude > 4) {
    return "#ea822c";
  }
  else if (magnitude > 3) {
    return "#ee9c00";
  }
  else if (magnitude > 2) {
    return "#eecc00";
  }
  else if (magnitude > 1) {
    return "#d4ee00";
  }
  return "#98ee00";
}

// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

// Grabbing our GeoJSON data.
d3.json(usgsData).then(function(data) {
  // Creating a GeoJSON layer with the retrieved data.
  L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
          console.log(data);
          return L.circleMarker(latlng);
      },
      // Set the style for each marker using styleInfo function
      style: styleInfo,
      // Create a popup for each circle Marker
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place)
      }
  }).addTo(earthquakes);
  // Add earthquake layer to our map
  earthquakes.addTo(map);
});

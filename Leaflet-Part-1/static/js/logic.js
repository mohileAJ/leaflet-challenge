// GeoJSON Earthquake Data
// This loads all earthquake data for the past 7 days.
const DATA_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson" 

// Map each earthquake depth to a color, based on assignment guide.
function depthToColor(depth) {
  if (depth < 10) {
    return "lawngreen";
  }
  if (depth < 30) {
    return "greenyellow";
  }
  if (depth < 50) {
    return "gold";
  }
  if (depth < 70) {
    return "orange"
  }
  if (depth < 90) {
    return "salmon"
  }
  return "tomato";
}

// Create container to hold legend.
function createLegendContainer(map) {
 // Create empty container to hold legend.
 const legend = L.control({
   position: "bottomright",
 });
 legend.onAdd = function() {
   return L.DomUtil.create("div", "legend");
 }
 legend.addTo(map);
 // Add formatting for legend.
 document.querySelector(".legend").innerHTML = `
<div style="background:white;padding:2px">
<h3>Legend</h3>
</div>
 `;
}
// Add legend entry for color.
function addLegendEntry(color, label) {
 // Create empty div to hold the new entry.
 const div = L.DomUtil.create("div", ".legend-entry");
 document.querySelector(".legend").appendChild(div);
 // Create content for legend.
 div.innerHTML = `
<div style="background:${color};padding:2px">
     ${label}
</div>
 `;
}
// Add legend for the depth colorbars.
function addDepthLegendToMap(map) {
 // Create a container to hold all legend entries.
 createLegendContainer(map);
 // Add legend entry for each depth-color mapping used above.
 addLegendEntry("lawngreen", "<10km");
 addLegendEntry("greenyellow", "10-30km");
 addLegendEntry("gold", "30-50km");
 addLegendEntry("orange", "50-70km");
 addLegendEntry("salmon", "70-90km");
 addLegendEntry("tomato", "90+");
}

// Initialize the map with a base layer, but no features.
function createEmptyMap() {
  // Create map, and bind to the UI.
  const myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 5
  });

  // Add background to map (tiles)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  return myMap;
}

// Load earthquake dataset and add to the map.
function loadAndAddEarthquakes(map) {
  d3.json(DATA_URL).then(function (data) {
    console.log("Data loaded.");
    console.log(data);
  
    // Generate markers for each earthquake.
    const earthquakes = L.geoJSON(data, {
      // Popup content for each marker.
      // This displays basic info after a click.
      onEachFeature: function (feature, layer) {
        layer.bindPopup(`
          <h3>${feature.properties.place}</h3>
          <hr>
          <p><b>Magnitude: ${feature.properties.mag}</b></p>
          <p>Depth: ${feature.geometry.coordinates[2]} km</p>
          <p>${new Date(feature.properties.time)}</p>
        `);
      },
  
      // Formatting for each marker.
      pointToLayer: function (feature, latlng) {
        return L.circle(latlng, {
          radius: 2000 * feature.properties.mag,
          fillOpacity: 0.75,
          color: depthToColor(feature.geometry.coordinates[2]),
        });
      }
    });
  
    // Add earthquakes to the map.
    earthquakes.addTo(map);
  });
}

const map = createEmptyMap();
loadAndAddEarthquakes(map);
addDepthLegendToMap(map)
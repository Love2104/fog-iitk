<!DOCTYPE html>
   <html>
   <head>
       <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
   </head>
   <body>
       <div id="map" class="w-100"></div>
       <button id="toggleLayer">Toggle Layer</button>
   </body>
   
   <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
   <!-- <script src="your-raster-image-layer.js"></script> -->
   <script>
    var southWest = L.latLng(4.0, 65.0);
    var northEast = L.latLng(38.0, 100.0);
    var indiaBounds = L.latLngBounds(southWest, northEast);

    var map = L.map('map', {
        maxBounds: indiaBounds,
        maxBoundsViscosity: 1.0,
        minZoom: 4
    }).setView([23.0, 78.0], 5);

// Add the Carto Voyager layer
    var osmLayer = L.tileLayer('https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_3181_1_2b8dc38358d829b5538ec9d0', {
        attribution: '&copy; <a href="https://carto.com/">CartoDB</a>',
        maxZoom: 19
    }).addTo(map);

// Define your raster image layer
var rasterLayer = L.imageOverlay('./sample_fog_images/3DIMG_10DEC2021_1000_L2C_FOG_FOG.tif', [[74.0,20.0], [82, 26]]);
console.log(L)
// Toggle layer functionality
var isRasterVisible = false;
document.getElementById('toggleLayer').addEventListener('click', function() {
    if (isRasterVisible) {
        map.removeLayer(rasterLayer);
    } else {
        rasterLayer.addTo(map);
    }
    isRasterVisible = !isRasterVisible;
});
   </script>

</html>
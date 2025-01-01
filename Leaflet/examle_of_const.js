const geoServerLayer = L.tileLayer.wms('http://13.93.146.169:8080/geoserver/ows?', {
    layers: 'NorthCarolinaTest:usa_counties', // Replace with your workspace and layer name
    format: 'image/png',
    transparent: true,
    attribution: 'GeoServer Layer',
    tiled: false // Optional: For tiled requests
  });

 geoServerLayer.addTo(map);
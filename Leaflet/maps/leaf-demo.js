var map = L.map( 'map', {
    center: [35.71, -80.15],
    minZoom: 2,
    zoom: 7
});
// Regular OpenStreetMap
//L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//    subdomains: ['a','b','c']
//}).addTo( map );

// This DIDN'T work:
//L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
//  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://openstreetmap.org">OpenStreetMap</a>',
//  maxZoom: 20
//}).addTo(map);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);
L.tileLayer.wms('http://13.93.146.169:8080/geoserver/ows?', {
    layers: 'NorthCarolinaTest:nc_precincts_geo', // Replace with your workspace and layer name; This layer is from PostGIS
    format: 'image/png',
    transparent: true,
    attribution: 'GeoServer Layer',
    tiled: false // Optional: For tiled requests
  }).addTo( map );
L.tileLayer.wms('http://13.93.146.169:8080/geoserver/ows?', {
    layers: 'NorthCarolinaTest:nc_counties_geo', // Replace with your workspace and layer name; This layer is from PostGIS
    format: 'image/png',
    transparent: true,
    attribution: 'GeoServer Layer',
    tiled: false // Optional: For tiled requests
  }).addTo( map );


  
map.on('click', function (e) {
    var wmsUrl = 'http://13.93.146.169:8080/geoserver/ows?';
    var params = {
        service: 'WMS',
        version: '1.1.1',
        request: 'GetFeatureInfo',
        layers: 'NorthCarolinaTest:nc_precincts_geo,NorthCarolinaTest:nc_counties_geo',
        query_layers: 'NorthCarolinaTest:nc_precincts_geo,NorthCarolinaTest:nc_counties_geo',
        styles: '',
        bbox: map.getBounds().toBBoxString(),
        width: map.getSize().x,
        height: map.getSize().y,
        srs: 'EPSG:4326', // Adjust to match your layer's CRS
        format: 'image/png',
        info_format: 'application/json',
        buffer: 10, // Optional: Increase click tolerance
        x: Math.round(map.layerPointToContainerPoint(e.layerPoint).x),
        y: Math.round(map.layerPointToContainerPoint(e.layerPoint).y)
    };
	var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    var queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
    //var fullUrl = wmsUrl + queryString;
	var fullUrl = wmsUrl + new URLSearchParams(params).toString();

    console.log('GetFeatureInfo URL:', fullUrl);

/*     fetch(fullUrl)
        .then(response => response.json())
        .then(data => {
            if (data.features.length > 0) {
                var featureInfo = JSON.stringify(data.features, null, 2); // Customize as needed
                L.popup()
                    .setLatLng(e.latlng)
                    .setContent('<pre>' + featureInfo + '</pre>')
                    .openOn(map);
            } else {
                L.popup()
                    .setLatLng(e.latlng)
                    .setContent('No features found at this location.')
                    .openOn(map);
            }
        })
        .catch(error => console.error('Error fetching GetFeatureInfo:', error));
*/

/*		fetch(fullUrl)
		.then(response => response.json())
		.then(data => {
 			if (data.features && data.features.length > 0) {
				const feature = data.features[0];
				const props = feature.properties;

				// Extract relevant details
				const countyName = props.county;
				const state = props.state;
				const area = props["square_mil"];
				const perimeter = props.perimeter;
				
				// Construct popup content
				const popupContent = `
					<strong>County:</strong> ${countyName}<br>
					<strong>State:</strong> ${state}<br>
					<strong>Area:</strong> ${area} sq mi<br>
					<strong>Perimeter:</strong> ${perimeter} miles
				`; */

				
fetch(fullUrl)
    .then(response => response.json())
    .then(data => {
        console.log("Response data:", data); // Log the entire response
        // Proceed with your popup logic
    });

// Fetch data from the Geoserver

fetch(fullUrl)
    .then(response => response.json())
    .then(data => {
        console.log("Response data:", data);

        if (data.features && data.features.length > 0) {
            // Group features by layer
            const featuresByLayer = {};

            data.features.forEach(feature => {
                const layerName = feature.id.split('.')[0]; // Extract layer name
                if (!featuresByLayer[layerName]) {
                    featuresByLayer[layerName] = [];
                }
                featuresByLayer[layerName].push(feature);
            });

            // Generate popup content
            let popupContent = "<b>Clicked Features:</b><br>";

            for (const [layer, features] of Object.entries(featuresByLayer)) {
                popupContent += `<b>Layer:</b> ${layer}<br>`;
                features.forEach(feature => {
                    for (const [key, value] of Object.entries(feature.properties)) {
                        popupContent += `<b>${key}:</b> ${value}<br>`;
                    }
                    popupContent += "<hr>";
                });
            }

            // Show the popup at the clicked location
            L.popup()
                .setLatLng(e.latlng)
                .setContent(popupContent)
                .openOn(map);
        } else {
            // No features found
            L.popup()
                .setLatLng(e.latlng)
                .setContent("No features found.")
                .openOn(map);
        }
    })
    .catch(error => {
        console.error("Error fetching feature info:", error);
    });
	
	
			/*} else {
				console.error('No features found');
			}
		})
.catch(error => console.error('Error:', error));*/
});



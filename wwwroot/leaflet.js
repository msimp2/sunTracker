import { showGrid, hideGrid } from './Overlay/latlon.js';
import { setupBasemapSelector } from './Overlay/basemap.js';
import { addStatesLayer, removeStatesLayer, updateStatesLayerColor } from './Overlay/states.js';
import { addCountiesLayer, removeCountiesLayer, updateCountiesLayerColor, updateCountiesNamesVisibility } from './Overlay/counties.js';

function initializeMap() {
    // Add map styles dynamically
    const style = document.createElement('style');
    style.textContent = `
    #map {
        height: 500px;
        width: 100%;
    }
`;
    document.head.appendChild(style);

    // Initialize the Leaflet map
    var map = L.map('map').setView([39.5, -98.35], 4);
    setupBasemapSelector(map);
    window.map = map;

    // Listen for map clicks and update input boxes
    map.on('click', function (e) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);
        document.getElementById('latitude').value = lat;
        document.getElementById('longitude').value = lng;
        // Trigger morning time update
        if (typeof updateMorningTime === 'function') {
            updateMorningTime();
        }
        if (typeof updateEveningTime === 'function') {
            updateEveningTime();
        }
    });

    return map;
}

function pad(n) {
    return n < 10 ? '0' + n : n;
}
function updateClocks() {
    const now = new Date();

    // Local time (24-hour)
    const localHours = pad(now.getHours());
    const localMinutes = pad(now.getMinutes());
    const localSeconds = pad(now.getSeconds());
    const localTime = `${localHours}:${localMinutes}:${localSeconds}`;
    const localClockElem = document.getElementById('local-clock');
    if (localClockElem) {
        localClockElem.textContent = `Local: ${localTime}`;
    }

    // UTC time (24-hour)
    const utcHours = pad(now.getUTCHours());
    const utcMinutes = pad(now.getUTCMinutes());
    const utcSeconds = pad(now.getUTCSeconds());
    const utcTime = `${utcHours}:${utcMinutes}:${utcSeconds}`;
    const utcClockElem = document.getElementById('utc-clock');
    if (utcClockElem) {
        utcClockElem.textContent = `UTC: ${utcTime}`;
    }
}


// Start the clocks when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    updateClocks();
    setInterval(updateClocks, 1000);

    initializeMap();


    // Lat lon
    let gridVisible = false;
    let gridColor = '#888888';

    const basemapSelector = document.getElementById('basemap-selector');
    const latlonGridColorInput = document.getElementById('gridColorInput');
    const latlonGridToggleCheckbox = document.getElementById('toggleGridCheckbox');

    // Checkbox toggles lat/lon grid visibility
    latlonGridToggleCheckbox.addEventListener('change', function () {
        gridVisible = this.checked;
        if (gridVisible) {
            showGrid(map, gridColor);
        } else {
            hideGrid(map);
        }
    });

    // Update grid color and show grid if visible when color input changes
    latlonGridColorInput.addEventListener('input', () => {
        gridColor = latlonGridColorInput.value;
        if (gridVisible) {
            showGrid(map, gridColor);
        }
    });

    // Show lat/lon grid when map moves, if visible
    map.on('moveend', function () {
        if (gridVisible) {
            showGrid(map, gridColor);
        }
    });

    // States
    const statesCheckbox = document.getElementById('states-checkbox');
    const statesColorInput = document.getElementById('statesColorInput');

    statesCheckbox.addEventListener('change', function () {
        if (statesCheckbox.checked) {
            addStatesLayer(map, statesColorInput.value);
        } else {
            removeStatesLayer(map);
        }
    });

    statesColorInput.addEventListener('input', function () {
        if (statesCheckbox.checked) {
            updateStatesLayerColor(map, statesColorInput.value);
        }
    });

    // Counties
    const countiesCheckbox = document.getElementById('counties-checkbox');
    const countiesColorInput = document.getElementById('countiesColorInput');
    const countiesNamesCheckbox = document.getElementById('counties-names-checkbox');

    countiesCheckbox.addEventListener('change', function () {
        if (countiesCheckbox.checked) {
            addCountiesLayer(map, countiesColorInput.value, countiesNamesCheckbox.checked);
        } else {
            removeCountiesLayer(map);
        }
    });

    countiesColorInput.addEventListener('input', function () {
        if (countiesCheckbox.checked) {
            updateCountiesLayerColor(map, countiesColorInput.value);
        }
    });

    countiesNamesCheckbox.addEventListener('change', function () {
        if (countiesCheckbox.checked) {
            updateCountiesNamesVisibility(map, countiesNamesCheckbox.checked);
        }
    });

});
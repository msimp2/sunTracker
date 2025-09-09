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
    window.map = L.map('map').setView([39.5, -98.35], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

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
});

// --- END CLOCKS ---

document.addEventListener('DOMContentLoaded', initializeMap);
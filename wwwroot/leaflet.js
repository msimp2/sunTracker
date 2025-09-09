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

    return map;
}

document.addEventListener('DOMContentLoaded', initializeMap);
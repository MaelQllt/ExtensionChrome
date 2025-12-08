// Configuration de la carte
let map;
let currentMarker;

// Initialisation de la carte au chargement
document.addEventListener('DOMContentLoaded', initMap);

function initMap() {
    // Création de la carte centrée sur Paris
    map = L.map('map').setView([48.8566, 2.3522], 12);
    
    // Ajout de la couche IGN (WMTS - Web Map Tile Service)
    // Utilisation du fond de carte "Plan IGN"
    const ignLayer = L.tileLayer('https://wxs.ign.fr/essentiels/geoportail/wmts?' +
        '&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0' +
        '&STYLE=normal' +
        '&TILEMATRIXSET=PM' +
        '&FORMAT=image/png' +
        '&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2' +
        '&TILEMATRIX={z}' +
        '&TILEROW={y}' +
        '&TILECOL={x}',
        {
            attribution: '&copy; <a href="https://www.ign.fr/">IGN</a>',
            minZoom: 0,
            maxZoom: 18
        }
    );
    
    ignLayer.addTo(map);
    
    // Ajout d'un marqueur initial sur Paris
    addMarker([48.8566, 2.3522], "Paris - Capitale de la France");
    
    // Mise à jour des coordonnées en temps réel
    updateCoordinates();
    
    // Événements de la carte
    map.on('move', updateCoordinates);
    map.on('zoom', updateCoordinates);
    map.on('click', onMapClick);
    
    // Boutons de navigation
    document.getElementById('btnParis').addEventListener('click', () => {
        flyToCity([48.8566, 2.3522], "Paris - Capitale de la France");
    });
    
    document.getElementById('btnLyon').addEventListener('click', () => {
        flyToCity([45.7640, 4.8357], "Lyon - Ville des Lumières");
    });
    
    document.getElementById('btnMarseille').addEventListener('click', () => {
        flyToCity([43.2965, 5.3698], "Marseille - Cité Phocéenne");
    });
}

function addMarker(coords, popupText) {
    // Suppression de l'ancien marqueur
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }
    
    // Création d'un nouveau marqueur
    currentMarker = L.marker(coords).addTo(map);
    
    if (popupText) {
        currentMarker.bindPopup(popupText).openPopup();
    }
}

function flyToCity(coords, name) {
    map.flyTo(coords, 13, {
        duration: 1.5,
        easeLinearity: 0.25
    });
    
    addMarker(coords, name);
}

function updateCoordinates() {
    const center = map.getCenter();
    const zoom = map.getZoom();
    
    document.getElementById('coordinates').textContent = 
        `Lat: ${center.lat.toFixed(4)} | Lon: ${center.lng.toFixed(4)}`;
    document.getElementById('zoom').textContent = 
        `Zoom: ${zoom}`;
}

function onMapClick(e) {
    addMarker([e.latlng.lat, e.latlng.lng], 
        `📍 Position<br>Lat: ${e.latlng.lat.toFixed(4)}<br>Lon: ${e.latlng.lng.toFixed(4)}`);
}

// Message de démarrage dans la console
console.log('Extension Carte IGN chargée avec succès !');
console.log('Service IGN utilisé : GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2');
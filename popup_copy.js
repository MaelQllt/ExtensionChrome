// Configuration de la carte
let map;
let baseLayers = {};
let currentBaseLayer;
let currentMarker;
let geolocationRequested = false;

// Initialisation de la carte au chargement
document.addEventListener('DOMContentLoaded', initMap);

function initMap() {
    // Création de la carte centrée sur Paris (temporaire)
    map = L.map('map').setView([48.8566, 2.3522], 12);
    
    // Ajout de la couche IGN (WMTS - Web Map Tile Service)
    baseLayers = {
    plan: L.tileLayer(
        "https://data.geopf.fr/wmts?" +
        "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
        "&STYLE=normal&TILEMATRIXSET=PM" +
        "&FORMAT=image/png&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2" +
        "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
        { maxZoom: 18, attribution: "IGN" }
    ),

    ortho: L.tileLayer(
        "https://data.geopf.fr/wmts?" +
        "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
        "&STYLE=normal&TILEMATRIXSET=PM" +
        "&FORMAT=image/jpeg&LAYER=ORTHOIMAGERY.ORTHOPHOTOS" +
        "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
        { maxZoom: 19, attribution: "IGN" }
    ),

    cadastre: L.tileLayer(
        "https://data.geopf.fr/wmts?" +
        "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
        "&STYLE=bdparcellaire&TILEMATRIXSET=PM" +
        "&FORMAT=image/png&LAYER=CADASTRALPARCELS.PARCELS" +
        "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
        { maxZoom: 20, attribution: "IGN" }
    ),
};

    currentBaseLayer = baseLayers.plan.addTo(map);

    
    // Ajout d'un marqueur initial sur Paris
    addMarker([48.8566, 2.3522], "Paris - Capitale de la France<br><small>Cliquez sur 'Ma Position' pour vous localiser</small>");
    
    // Mise à jour des coordonnées en temps réel
    updateCoordinates();
    
    // Événements de la carte
    map.on('move', updateCoordinates);
    map.on('zoom', updateCoordinates);
    map.on('click', onMapClick);
    
    // Boutons de navigation
    const btnMyPosition = document.getElementById('btnMyPosition');
    if (btnMyPosition) {
        btnMyPosition.addEventListener('click', () => {
            geolocationRequested = true;
            getUserLocation();
        });
    }
    
    document.getElementById('btnParis').addEventListener('click', () => {
        flyToCity([48.8566, 2.3522], "Paris - Capitale de la France");
    });
    
    document.getElementById('btnLyon').addEventListener('click', () => {
        flyToCity([45.7640, 4.8357], "Lyon - Ville des Lumières");
    });
    
    document.getElementById('btnMarseille').addEventListener('click', () => {
        flyToCity([43.2965, 5.3698], "Marseille - Cité Phocéenne");
    });

    document.getElementById("basemapSelector").addEventListener("change", (e) => {
    const selected = e.target.value;

    if (currentBaseLayer) {
        map.removeLayer(currentBaseLayer);
    }

    currentBaseLayer = baseLayers[selected].addTo(map);
});

}

function getUserLocation() {
    if (!navigator.geolocation) {
        alert('❌ Votre navigateur ne supporte pas la géolocalisation');
        return;
    }
    
    console.log('🔍 Demande de géolocalisation...');
    
    // Options de géolocalisation
    const options = {
        enableHighAccuracy: false, // Plus rapide avec précision moindre
        timeout: 15000, // 15 secondes
        maximumAge: 300000 // Accepter une position de moins de 5 minutes
    };
    
    navigator.geolocation.getCurrentPosition(
        // Succès
        (position) => {
            const userCoords = [position.coords.latitude, position.coords.longitude];
            console.log('✅ Position détectée:', userCoords);
            
            map.flyTo(userCoords, 15, {
                duration: 1.5,
                easeLinearity: 0.25
            });
            
            addMarker(userCoords, 
                `Votre position<br>` +
                `Lat: ${position.coords.latitude.toFixed(4)}<br>` +
                `Lon: ${position.coords.longitude.toFixed(4)}<br>` +
                `Précision: ±${Math.round(position.coords.accuracy)}m`
            );
        },
        // Erreur
        (error) => {
            console.error('❌ Erreur de géolocalisation:', error);
            
            let message = '';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    message = '🚫 Accès à la position refusé.\n\nPour activer :\n1. Cliquez sur l\'icône 🔒 dans la barre d\'adresse\n2. Autorisez "Position"';
                    break;
                case error.POSITION_UNAVAILABLE:
                    message = '📡 Position indisponible.\nVérifiez votre connexion et les services de localisation.';
                    break;
                case error.TIMEOUT:
                    message = '⏱️ Délai dépassé.\nLa localisation prend trop de temps.';
                    break;
                default:
                    message = '❌ Erreur inconnue lors de la géolocalisation.';
            }
            
            alert(message);
        },
        options
    );
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
        `Position cliquée<br>Lat: ${e.latlng.lat.toFixed(4)}<br>Lon: ${e.latlng.lng.toFixed(4)}`);
}

// Message de démarrage dans la console
console.log('🗺️ Extension Carte IGN chargée avec succès !');
console.log('📡 Service IGN utilisé : ORTHOIMAGERY.ORTHOPHOTOS');
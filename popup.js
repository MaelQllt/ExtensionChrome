// Configuration de la carte
let map;
let baseLayers = {};
let currentBaseLayer;
let currentMarker;
let geolocationRequested = false;

// Variables pour les itinéraires
let routeLayer = null;
let alternativeRoutes = [];
let startMarker = null;
let endMarker = null;
let pickingLocation = null; // 'start' ou 'end'
let startCoords = null;
let endCoords = null;

// Initialisation de la carte au chargement
document.addEventListener('DOMContentLoaded', initMap);

// NOUVELLE FONCTION UTILITAIRE : Debounce pour limiter les appels API pendant la saisie
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

function initMap() {
    // Création de la carte centrée sur Paris
    map = L.map('map').setView([48.8566, 2.3522], 12);
    
    // Ajout de la couche IGN
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
    
    addMarker([48.8566, 2.3522], "Paris - Capitale de la France<br><small>Cliquez sur 'Itinéraire' pour calculer un trajet</small>");
    
    updateCoordinates();
    
    map.on('move', updateCoordinates);
    map.on('zoom', updateCoordinates);
    map.on('click', onMapClick);
    
    // Boutons de navigation (existants)
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

    // Événements pour le panneau d'itinéraire (existants)
    document.getElementById('btnRoute').addEventListener('click', toggleRoutePanel);
    document.getElementById('closeRoutePanel').addEventListener('click', closeRoutePanel);
    document.getElementById('btnSetStart').addEventListener('click', () => setLocationPicking('start'));
    document.getElementById('btnSetEnd').addEventListener('click', () => setLocationPicking('end'));
    document.getElementById('btnCalculate').addEventListener('click', calculateRoute);
    document.getElementById('btnClearRoute').addEventListener('click', clearRoute);

    // NOUVEAU : Configuration des écouteurs pour l'auto-complétion
    setupAutocompleteListeners();
}

// NOUVELLE FONCTION : Configure les écouteurs pour l'auto-complétion
function setupAutocompleteListeners() {
    const startInput = document.getElementById('startInput');
    const endInput = document.getElementById('endInput');

    // Debounce de 300ms pour ne pas spammer l'API Nominatim
    const debouncedStartSearch = debounce((e) => handleInput(e.target.value, 'start'), 300);
    const debouncedEndSearch = debounce((e) => handleInput(e.target.value, 'end'), 300);

    startInput.addEventListener('input', debouncedStartSearch);
    endInput.addEventListener('input', debouncedEndSearch);
    
    // Cacher les suggestions lorsqu'on clique en dehors
    document.addEventListener('click', function(e) {
        if (e.target.id !== 'startInput' && e.target.closest('.suggestions-dropdown') === null) {
            document.getElementById('startSuggestions').innerHTML = '';
        }
        if (e.target.id !== 'endInput' && e.target.closest('.suggestions-dropdown') === null) {
            document.getElementById('endSuggestions').innerHTML = '';
        }
    });
}

// NOUVELLE FONCTION : Gère l'input pour lancer la recherche
function handleInput(query, type) {
    if (query.length < 3) {
        document.getElementById(`${type}Suggestions`).innerHTML = '';
        return;
    }
    // Si l'utilisateur efface, on réinitialise les coordonnées pour forcer le géocodage à la fin
    if (type === 'start') startCoords = null;
    if (type === 'end') endCoords = null;
    
    fetchAndDisplaySuggestions(query, type);
}

// NOUVELLE FONCTION : Cherche et affiche les suggestions
async function fetchAndDisplaySuggestions(query, type) {
    const suggestionsContainer = document.getElementById(`${type}Suggestions`);
    suggestionsContainer.innerHTML = ''; // Effacer les anciennes suggestions
    
    try {
        const url = `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`;
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'IGN-Extension'
            }
        });
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            data.forEach(item => {
                const suggestionDiv = document.createElement('div');
                suggestionDiv.classList.add('suggestion-item');
                // Utiliser display_name qui est le nom complet de l'adresse
                suggestionDiv.textContent = item.display_name;
                
                // Attacher l'événement de sélection
                suggestionDiv.onclick = (e) => {
                    e.stopPropagation(); // Empêcher l'événement document de cacher immédiatement
                    selectSuggestion([parseFloat(item.lat), parseFloat(item.lon)], item.display_name, type);
                };
                suggestionsContainer.appendChild(suggestionDiv);
            });
        }
    } catch (error) {
        console.error('Erreur de recherche prédictive Nominatim:', error);
    }
}

// NOUVELLE FONCTION : Gère la sélection d'une suggestion
function selectSuggestion(coords, address, type) {
    const inputElement = document.getElementById(`${type}Input`);
    const suggestionsContainer = document.getElementById(`${type}Suggestions`);
    
    inputElement.value = address;
    suggestionsContainer.innerHTML = ''; // Cacher les suggestions
    
    if (type === 'start') {
        startCoords = coords;
        // Mettre à jour le marqueur de départ pour un retour visuel
        if (startMarker) map.removeLayer(startMarker);
        startMarker = L.marker(coords, {
            icon: L.divIcon({
                className: 'custom-marker',
                html: '<div style="background: #4CAF50; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">A</div>',
                iconSize: [30, 30]
            })
        }).addTo(map).bindPopup('🟢 Départ: ' + address).openPopup();
        map.flyTo(coords, 15);
        
    } else if (type === 'end') {
        endCoords = coords;
        // Mettre à jour le marqueur d'arrivée pour un retour visuel
        if (endMarker) map.removeLayer(endMarker);
        endMarker = L.marker(coords, {
            icon: L.divIcon({
                className: 'custom-marker',
                html: '<div style="background: #F44336; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">B</div>',
                iconSize: [30, 30]
            })
        }).addTo(map).bindPopup('🔴 Arrivée: ' + address).openPopup();
        map.flyTo(coords, 15);
    }
}

function getUserLocation() {
    if (!navigator.geolocation) {
        alert('⚠️ Votre navigateur ne supporte pas la géolocalisation');
        return;
    }
    
    const options = {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 300000
    };
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userCoords = [position.coords.latitude, position.coords.longitude];
            
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
        (error) => {
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
                    message = '⚠️ Erreur inconnue lors de la géolocalisation.';
            }
            alert(message);
        },
        options
    );
}

function addMarker(coords, popupText) {
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }
    
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
    if (pickingLocation) {
        const coords = [e.latlng.lat, e.latlng.lng];
        const coordString = `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`;
        
        if (pickingLocation === 'start') {
            startCoords = coords;
            document.getElementById('startInput').value = coordString;
            
            if (startMarker) map.removeLayer(startMarker);
            startMarker = L.marker(coords, {
                icon: L.divIcon({
                    className: 'custom-marker',
                    html: '<div style="background: #4CAF50; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">A</div>',
                    iconSize: [30, 30]
                })
            }).addTo(map).bindPopup('🟢 Départ');
            
            document.getElementById('btnSetStart').textContent = '📍 Sur carte';
            document.getElementById('btnSetStart').style.backgroundColor = '';
        } else if (pickingLocation === 'end') {
            endCoords = coords;
            document.getElementById('endInput').value = coordString;
            
            if (endMarker) map.removeLayer(endMarker);
            endMarker = L.marker(coords, {
                icon: L.divIcon({
                    className: 'custom-marker',
                    html: '<div style="background: #F44336; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">B</div>',
                    iconSize: [30, 30]
                })
            }).addTo(map).bindPopup('🔴 Arrivée');
            
            document.getElementById('btnSetEnd').textContent = '📍 Sur carte';
            document.getElementById('btnSetEnd').style.backgroundColor = '';
        }
        
        pickingLocation = null;
    } else {
        addMarker([e.latlng.lat, e.latlng.lng], 
            `Position cliquée<br>Lat: ${e.latlng.lat.toFixed(4)}<br>Lon: ${e.latlng.lng.toFixed(4)}`);
    }
}

function toggleRoutePanel() {
    const panel = document.getElementById('routePanel');
    panel.classList.toggle('hidden');
}

function closeRoutePanel() {
    document.getElementById('routePanel').classList.add('hidden');
    pickingLocation = null;
    document.getElementById('startSuggestions').innerHTML = ''; // Cacher l'autocomplete
    document.getElementById('endSuggestions').innerHTML = '';
}

function setLocationPicking(type) {
    pickingLocation = type;
    const btn = type === 'start' ? document.getElementById('btnSetStart') : document.getElementById('btnSetEnd');
    btn.textContent = '👆 Cliquez sur la carte...';
    btn.style.backgroundColor = '#ff9800';
    document.getElementById('startSuggestions').innerHTML = ''; // Cacher l'autocomplete
    document.getElementById('endSuggestions').innerHTML = '';
}

async function calculateRoute() {
    const startInput = document.getElementById('startInput').value.trim();
    const endInput = document.getElementById('endInput').value.trim();
    const travelMode = document.getElementById('travelMode').value;

    if (!startInput || !endInput) {
        alert('⚠️ Veuillez renseigner un point de départ et d\'arrivée');
        return;
    }

    try {
        // Si startCoords/endCoords n'ont pas été définis via l'auto-complétion ou le clic,
        // on lance le géocodage de l'adresse textuelle.
        let start = startCoords;
        let end = endCoords;
        
        // La condition de géocodage est maintenue : si startCoords est null OU si l'input ne ressemble pas à "lat, lon"
        if (!start || !startInput.includes(',')) {
            start = await geocodeNominatim(startInput);
            startCoords = start;
        }
        if (!end || !endInput.includes(',')) {
            end = await geocodeNominatim(endInput);
            endCoords = end;
        }

        if (!start || !end) {
            alert('❌ Impossible de localiser les adresses. Veuillez vérifier la saisie.');
            return;
        }
        
        // Cacher les suggestions restantes
        document.getElementById('startSuggestions').innerHTML = '';
        document.getElementById('endSuggestions').innerHTML = '';

        // Ajouter les marqueurs (mis à jour en cas de géocodage final)
        if (startMarker) map.removeLayer(startMarker);
        startMarker = L.marker(start, {
            icon: L.divIcon({
                className: 'custom-marker',
                html: '<div style="background: #4CAF50; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">A</div>',
                iconSize: [30, 30]
            })
        }).addTo(map).bindPopup('🟢 Départ');

        if (endMarker) map.removeLayer(endMarker);
        endMarker = L.marker(end, {
            icon: L.divIcon({
                className: 'custom-marker',
                html: '<div style="background: #F44336; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">B</div>',
                iconSize: [30, 30]
            })
        }).addTo(map).bindPopup('🔴 Arrivée');

        // Conversion du mode de transport pour OSRM
        const profile = {
            'DRIVING': 'car',
            'WALKING': 'foot',
            'BICYCLING': 'bike'
        }[travelMode] || 'car';

        // Appel à l'API OSRM
        const url = `https://router.project-osrm.org/route/v1/${profile}/` +
            `${start[1]},${start[0]};${end[1]},${end[0]}` +
            `?overview=full&geometries=geojson&alternatives=true&steps=true`;

        console.log('Appel OSRM:', url);

        const response = await fetch(url);
        const data = await response.json();

        console.log('Réponse OSRM:', data);

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            displayAllRoutes(data.routes);
        } else {
            alert('❌ Aucun itinéraire trouvé');
        }

    } catch (error) {
        console.error('Erreur complète:', error);
        console.error('Stack:', error.stack);
        alert('❌ Erreur lors du calcul de l\'itinéraire.\n' + error.message);
    }
}

async function geocodeNominatim(address) {
    // Fonction utilisée pour le géocodage final (un seul résultat)
    try {
        const url = `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(address)}&format=json&limit=1`;
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'IGN-Extension'
            }
        });
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }
        return null;
    } catch (error) {
        console.error('Erreur géocodage:', error);
        return null;
    }
}

function displayAllRoutes(routes) {
    // ... (Reste de la fonction displayAllRoutes inchangé) ...
    // Effacer les anciens itinéraires
    if (routeLayer) {
        map.removeLayer(routeLayer);
    }
    alternativeRoutes.forEach(layer => map.removeLayer(layer));
    alternativeRoutes = [];
    
    // Effacer les anciens labels
    if (window.routeLabels) {
        window.routeLabels.forEach(label => map.removeLayer(label));
        window.routeLabels = [];
    }

    let allBounds = [];
    let routesHTML = '';

    routes.forEach((route, index) => {
        const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
        const distance = (route.distance / 1000).toFixed(2);
        const duration = Math.round(route.duration / 60);

        // Style différent pour l'itinéraire principal et les alternatives
        const isMain = index === 0;
        const routeOptions = {
            color: isMain ? '#2196F3' : '#9E9E9E',
            weight: isMain ? 6 : 4,
            opacity: isMain ? 0.8 : 0.5,
            lineJoin: 'round'
        };

        const polyline = L.polyline(coords, routeOptions).addTo(map);
        
        // Ajouter un événement au survol
        polyline.on('mouseover', function() {
            this.setStyle({ weight: 8, opacity: 1 });
        });
        polyline.on('mouseout', function() {
            this.setStyle({ weight: isMain ? 6 : 4, opacity: isMain ? 0.8 : 0.5 });
        });
        polyline.on('click', function() {
            window.selectRoute(index);
        });

        if (isMain) {
            routeLayer = polyline;
        } else {
            alternativeRoutes.push(polyline);
        }

        allBounds.push(...coords);

        // Ajouter un label sur chaque itinéraire
        const midPoint = Math.floor(coords.length / 2);
        const midCoord = coords[midPoint];
        
        const routeLabel = L.marker(midCoord, {
            icon: L.divIcon({
                className: 'route-label',
                html: `
                    <div style="
                        background: white;
                        padding: 6px 10px;
                        border-radius: 4px;
                        border: 2px solid ${isMain ? '#2196F3' : '#9E9E9E'};
                        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                        font-weight: 600;
                        color: #2b2b2b;
                        white-space: nowrap;
                        font-size: 12px;
                        text-align: center;
                        cursor: ${isMain ? 'default' : 'pointer'};
                    ">
                        <div style="color: ${isMain ? '#2196F3' : '#9E9E9E'}; font-size: 11px;">
                            ${isMain ? '🔵 Principal' : '⚪ Alt. ' + index}
                        </div>
                        <div style="color: ${isMain ? '#2196F3' : '#9E9E9E'}; font-size: 13px;">
                            📏 ${distance} km · ⏱️ ${duration} min
                        </div>
                    </div>
                `,
                iconSize: [150, 50],
                iconAnchor: [75, 25]
            })
        }).addTo(map);

        if (!isMain) {
            routeLabel.on('click', function() {
                window.selectRoute(index);
            });
        }
        
        if (!window.routeLabels) window.routeLabels = [];
        window.routeLabels.push(routeLabel);

        // Créer le HTML pour le panneau
        routesHTML += `
            <div class="route-option ${isMain ? 'route-main' : 'route-alt'}" onclick="window.selectRoute(${index})">
                <div class="route-option-header">
                    ${isMain ? '🔵 Itinéraire principal' : '⚪ Alternative ' + index}
                </div>
                <div class="route-option-details">
                    <span>📏 ${distance} km</span>
                    <span>⏱️ ${duration} min</span>
                </div>
            </div>
        `;
    });

    // Ajuster la vue pour voir tous les itinéraires
    if (allBounds.length > 0) {
        map.fitBounds(L.latLngBounds(allBounds), { padding: [50, 50] });
    }

    // Afficher les options dans le panneau
    document.getElementById('routeDetails').innerHTML = routesHTML;
    document.getElementById('routeInfo').classList.remove('hidden');
    document.getElementById('btnClearRoute').classList.remove('hidden');

    // Stocker les routes globalement pour la fonction selectRoute
    window.allRoutes = routes;
    window.allRouteLayers = [routeLayer, ...alternativeRoutes];
}

// Fonction pour sélectionner un itinéraire (inchangée)
window.selectRoute = function(index) {
    if (!window.allRoutes || !window.allRouteLayers) return;

    // Réinitialiser tous les styles
    window.allRouteLayers.forEach((layer, i) => {
        if (layer) {
            const isSelected = i === index;
            layer.setStyle({
                color: isSelected ? '#2196F3' : '#9E9E9E',
                weight: isSelected ? 6 : 4,
                opacity: isSelected ? 0.8 : 0.5
            });
            // Mettre au premier plan l'itinéraire sélectionné
            if (isSelected) {
                layer.bringToFront();
            }
        }
    });

    // Mettre à jour les labels
    if (window.routeLabels) {
        window.routeLabels.forEach((label, i) => {
            const isSelected = i === index;
            const route = window.allRoutes[i];
            const distance = (route.distance / 1000).toFixed(2);
            const duration = Math.round(route.duration / 60);
            
            label.setIcon(L.divIcon({
                className: 'route-label',
                html: `
                    <div style="
                        background: white;
                        padding: 6px 10px;
                        border-radius: 4px;
                        border: 2px solid ${isSelected ? '#2196F3' : '#9E9E9E'};
                        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                        font-weight: 600;
                        color: #2b2b2b;
                        white-space: nowrap;
                        font-size: 12px;
                        text-align: center;
                        cursor: ${isSelected ? 'default' : 'pointer'};
                    ">
                        <div style="color: ${isSelected ? '#2196F3' : '#9E9E9E'}; font-size: 11px;">
                            ${isSelected ? '🔵 Principal' : '⚪ Alt. ' + i}
                        </div>
                        <div style="color: ${isSelected ? '#2196F3' : '#9E9E9E'}; font-size: 13px;">
                            📏 ${distance} km · ⏱️ ${duration} min
                        </div>
                    </div>
                `,
                iconSize: [150, 50],
                iconAnchor: [75, 25]
            }));
        });
    }

    // Mettre à jour l'affichage dans le panneau
    document.querySelectorAll('.route-option').forEach((el, i) => {
        if (i === index) {
            el.classList.add('route-main');
            el.classList.remove('route-alt');
        } else {
            el.classList.remove('route-main');
            el.classList.add('route-alt');
        }
    });
};

function displayRouteOSRM(route) {
    // Fonctions conservées pour compatibilité (l'appel se fait via displayAllRoutes maintenant)
}

function displayRoute(feature) {
    // Ancienne fonction pour compatibilité
}

function clearRoute() {
    if (routeLayer) map.removeLayer(routeLayer);
    if (startMarker) map.removeLayer(startMarker);
    if (endMarker) map.removeLayer(endMarker);
    
    // Effacer les routes alternatives
    if (alternativeRoutes) {
        alternativeRoutes.forEach(layer => map.removeLayer(layer));
        alternativeRoutes = [];
    }
    
    // Effacer les labels sur la carte
    if (window.routeLabels) {
        window.routeLabels.forEach(label => map.removeLayer(label));
        window.routeLabels = [];
    }
    
    // Nettoyer les variables globales
    window.allRoutes = null;
    window.allRouteLayers = null;
    
    routeLayer = null;
    startMarker = null;
    endMarker = null;
    startCoords = null;
    endCoords = null;
    
    document.getElementById('startInput').value = '';
    document.getElementById('endInput').value = '';
    document.getElementById('routeInfo').classList.add('hidden');
    document.getElementById('btnClearRoute').classList.add('hidden');
    document.getElementById('startSuggestions').innerHTML = '';
    document.getElementById('endSuggestions').innerHTML = '';
}

console.log('🗺️ Extension Carte IGN chargée avec succès !');
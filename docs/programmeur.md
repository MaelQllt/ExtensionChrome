# 👨‍💻 Documentation Programmeur - Extension Carte IGN Interactive

## 🏛️ Architecture de l'Extension

### Vue d'ensemble

Cette extension Chrome s'appuie sur une architecture de type **Popup**, utilisant le format **Manifest V3**. Elle intègre la bibliothèque cartographique **Leaflet.js** pour visualiser les services de tuiles cartographiques de l'**IGN Géoportail**.

**Fonctionnalité clé ajoutée :** L'extension intègre désormais un module de calcul d'itinéraire en utilisant l'API **OSRM (Open Source Routing Machine)** pour le routage et **Nominatim (OpenStreetMap)** pour le géocodage (conversion d'adresses en coordonnées).

### Structure des fichiers

L'arborescence du projet utilise un chargement local pour la bibliothèque Leaflet:

```
extension-carte-ign/
├── manifest.json          # Configuration Manifest V3
├── popup.html            # Interface utilisateur (DOM)
├── popup.js              # Logique métier, carte et itinéraires
├── styles.css            # Styles et mise en page
├── docs/                 # Documentation (installation.md, programmeur.md, etc.)
     ├── installation.md
     └── programmeur.md
            
├── icons/                # Assets visuels (3 tailles)
└── lib/
     └── leaflet/          # Contient les fichiers CSS et JS de Leaflet (Chargement local)
            ├── leaflet.css
            └── leaflet.js
```

-----

## 📄 Fichiers Détaillés et Techniques

### manifest.json

**Rôle :** Fichier de configuration principal.

| Clé | Valeur Implémentée | Note d'Adaptation |
| :--- | :--- | :--- |
| `manifest_version` | 3 | Utilise Manifest V3. |
| `permissions` | `["storage", "geolocation"]` | Inclut la permission **`geolocation`** nécessaire pour le bouton "Ma position". |
| `host_permissions` | `["https://wxs.ign.fr/*", "https://data.geopf.fr/*", "https://router.project-osrm.org/*", "https://nominatim.openstreetmap.org/*"]` | Autorise l'accès aux tuiles IGN, au service de **Routage OSRM**, et au service de **Géocodage Nominatim**. |
| `content_security_policy` |  | Sécurise l'extension et autorise les connexions aux domaines IGN, OSRM et Nominatim pour le calcul d'itinéraire (`connect-src`). |

### popup.html

**Rôle :** Structure HTML de l'interface popup.

**Architecture DOM (Mise à jour) :**
L'interface utilisateur inclut désormais un panneau pour le calcul d'itinéraire, caché par défaut.

```
.container
├── header (titre + sous-titre)
├── .controls (boutons de navigation, sélecteur de fond de carte, bouton Itinéraire)
├── #routePanel (NOUVEAU - Panneau d'itinéraire)
│   ├── .route-header (Titre et bouton de fermeture)
│   ├── .route-inputs (Champs Départ/Arrivée, Sélecteur Mode, Boutons Calculer/Effacer)
│   └── #routeInfo (Affichage du résumé du trajet)
├── #map (conteneur Leaflet)
└── footer (informations temps réel)
```

**Chargement des Ressources :** Le chargement local de Leaflet est conservé.

### popup.js

**Rôle :** Logique métier, initialisation carte, gestion événements et calcul d'itinéraires.

#### 1\. Initialisation et Couches IGN

La fonction `initMap()` gère toujours l'initialisation sur Paris et les trois couches WMTS de l'IGN : `plan`, `ortho`, `cadastre`.

#### 2\. Gestion de la Géolocalisation

La fonction **`getUserLocation()`** utilise `navigator.geolocation.getCurrentPosition()`. En cas de succès, elle utilise `map.flyTo()` avec un niveau de zoom de **15**.

#### 3\. Fonctions Utilitaire Clés

  * **`flyToCity(coords, name)`**: Navigation animée avec un zoom de **13**.
  * **`addMarker(coords, popupText)`**: Implémente le pattern **"marqueur unique"** pour la position/les clics.
  * **`updateCoordinates()`**: Met à jour les informations dans le footer.
  * **`onMapClick(e)`**: Gère désormais la sélection des points de **Départ (A)** et d'**Arrivée (B)** pour l'itinéraire si le mode `pickingLocation` est actif.

-----

## 🧭 Gestion des Itinéraires (Routing)

Cette nouvelle fonctionnalité est gérée par le panneau `#routePanel` dans `popup.html` et les fonctions associées dans `popup.js`.

### Géocodage (Recherche d'Adresse)

La fonction **`geocodeNominatim(address)`** est utilisée pour convertir une adresse textuelle en coordonnées latitude/longitude.

  * **API utilisée :** Nominatim (OpenStreetMap)
  * **URL :** `https://nominatim.openstreetmap.org/search?q=...`.

### Routage (Calcul du Trajet)

La fonction **`calculateRoute()`** orchestre le processus :

1.  **Géocodage** des adresses si nécessaire (coordonnées non fournies).
2.  **Conversion du mode de transport** (`DRIVING`/`WALKING`/`BICYCLING`) en profil OSRM (`car`/`foot`/`bike`).
3.  **Appel API OSRM :** L'extension utilise le service `router.project-osrm.org`.
      * **URL :** `https://router.project-osrm.org/route/v1/{profile}/{lon1},{lat1};{lon2},{lat2}?overview=full&geometries=geojson&alternatives=true...`.
      * L'option **`alternatives=true`** est utilisée pour récupérer et afficher plusieurs options de trajet.
4.  **Affichage des marqueurs :** Utilisation de **`L.divIcon`** personnalisés pour les points A (vert, Départ) et B (rouge, Arrivée).
5.  **Affichage des trajets :** La fonction **`displayAllRoutes(routes)`** dessine les **polylignes Leaflet** (`L.polyline`), différenciant l'itinéraire principal des alternatives, et crée des **labels interactifs** sur la carte pour le résumé (distance/durée).

### Sélection d'Itinéraire

La fonction globale **`window.selectRoute(index)`** permet de basculer l'itinéraire principal affiché, en mettant à jour le style de la polyligne sélectionnée (couleur et épaisseur) et le contenu du panneau.

-----

## 🔧 API Leaflet et Interactions (Ajouts)

| API Leaflet | Rôle | Exemple d'utilisation dans `popup.js` |
| :--- | :--- | :--- |
| `L.map('id').setView(...)` | Création de la carte. | Initialisation au centre de Paris. |
| `L.tileLayer(url, options)` | Définition d'une couche de tuiles IGN. | Configuration des trois couches (plan, ortho, cadastre). |
| `map.flyTo(coords, zoom, options)` | Animation de navigation. | Utilisé pour les boutons de ville et la géolocalisation. |
| `map.on('event', callback)` | Écouteurs d'événements Leaflet. | Utilisé pour `move`, `zoom`, `click` (pour la sélection des points d'itinéraire).|
| `L.polyline(coords, options)` | Dessin d'un trajet (itinéraire). | Utilisé dans `displayAllRoutes()` pour les routes OSRM.|
| `L.divIcon(...)` | Création d'icônes HTML personnalisées. | Utilisé pour les marqueurs Départ (A) et Arrivée (B) et les labels d'itinéraire.|

-----

## 🔐 Sécurité et Débogage

### Content Security Policy (CSP)

Le CSP est crucial pour la sécurité et a été mis à jour pour autoriser les ressources externes requises pour le routage/géocodage:

  * **Scripts (`script-src`)** : `'self'` (uniquement les scripts locaux).
  * **Images (`img-src`)** : `'self'`, `data:`, et les domaines IGN et OpenStreetMap (`https://wxs.ign.fr`, `https://data.geopf.fr`, `https://*.openstreetmap.org`).
  * **Connexions (`connect-src`)** : Doit explicitement autoriser tous les services externes contactés par `fetch` : `'self'`, `https://wxs.ign.fr`, `https://data.geopf.fr`, `https://router.project-osrm.org`, et `https://nominatim.openstreetmap.org`.
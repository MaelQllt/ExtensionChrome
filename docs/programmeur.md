# 👨‍💻 Documentation Programmeur - Extension Carte IGN Interactive

## 🏛️ Architecture de l'Extension

### Vue d'ensemble

Cette extension Chrome s'appuie sur une architecture de type **Popup**, utilisant le format **Manifest V3**. Elle intègre la bibliothèque cartographique **Leaflet.js** pour visualiser les services de tuiles cartographiques de l'**IGN Géoportail**.

### Structure des fichiers

L'arborescence du projet utilise un chargement local pour la bibliothèque Leaflet:

```

extension-carte-ign/
├── manifest.json          \# Configuration Manifest V3
├── popup.html            \# Interface utilisateur (DOM)
├── popup.js              \# Logique métier et interactions
├── styles.css            \# Styles et mise en page
├── docs/                 \# Documentation (installation.md, programmeur.md, etc.)
     ├── installation.md
     └── programmeur.md
            
├── icons/                \# Assets visuels (3 tailles)
└── lib/
     └── leaflet/          \# Contient les fichiers CSS et JS de Leaflet (Chargement local)
            ├── leaflet.css
            └── leaflet.js

```

---

## 📄 Fichiers Détaillés et Techniques

### manifest.json

**Rôle :** Fichier de configuration principal.

| Clé | Valeur Implémentée | Note d'Adaptation |
| :--- | :--- | :--- |
| `manifest_version` | 3 | Utilise Manifest V3. |
| `permissions` | `["storage", "geolocation"]` | Inclut la permission **`geolocation`** nécessaire pour le bouton "Ma position". |
| `host_permissions` | `["https://wxs.ign.fr/*", "https://data.geopf.fr/*", ""https://router.project-osrm.org/*"]` | Autorise l'accès aux deux principaux points d'accès des tuiles IGN. |
| `content_security_policy` |  | Sécurise l'extension contre les injections et autorise les images IGN ainsi que les styles inline de Leaflet (`'unsafe-inline'`). |

### popup.html

**Rôle :** Structure HTML de l'interface popup.

**Architecture DOM :**
```

.container
├── header (titre + sous-titre)
├── .controls (boutons de navigation)
├── \#map (conteneur Leaflet)
└── footer (informations temps réel)

```

**Chargement des Ressources (Local) :**
Contrairement à une implémentation CDN, cette version charge Leaflet **localement**, ce qui garantit le fonctionnement même sans connexion et offre un meilleur contrôle :

* Leaflet CSS : `<link rel="stylesheet" href="lib/leaflet/leaflet.css" />`
* Leaflet JS : `<script src="lib/leaflet/leaflet.js"></script>`

L'ordre de chargement garantit que Leaflet est disponible avant l'exécution du script `popup.js`.

### popup.js

**Rôle :** Logique métier, initialisation carte, gestion événements.

#### 1. Initialisation et Couches IGN

La fonction `initMap()` gère l'initialisation et la sélection des fonds de carte :
* **Point de départ** : La carte est centrée sur Paris avec un zoom de 12.
* **Couches WMTS** : Trois couches distinctes sont définies et gérées via un sélecteur dans l'interface:
    * `plan` : `GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2`
    * `ortho` : `ORTHOIMAGERY.ORTHOPHOTOS`
    * `cadastre` : `CADASTRALPARCELS.PARCELS`

#### 2. Gestion de la Géolocalisation

La fonction **`getUserLocation()`** utilise l'API native `navigator.geolocation.getCurrentPosition()`.
* Elle gère les permissions et les cas d'erreur (`PERMISSION_DENIED`, `TIMEOUT`).
* En cas de succès, elle utilise `map.flyTo()` avec un niveau de zoom de **15**.

#### 3. Fonctions Utilitaire Clés

* **`flyToCity(coords, name)`**: Permet une navigation animée (`duration: 1.5s`) vers les villes prédéfinies (Paris, Lyon, Marseille) avec un zoom de **13**.
* **`addMarker(coords, popupText)`**: Implémente le pattern **"marqueur unique"** en retirant l'ancien marqueur avant d'en placer un nouveau.
* **`updateCoordinates()`**: Met à jour les informations en temps réel dans le footer lors des événements Leaflet `move` et `zoom`.

---

## 🔧 API Leaflet et Interactions

### Gestion du DOM et des Événements
Les écouteurs d'événements sont attachés au chargement du DOM via `document.addEventListener('DOMContentLoaded', initMap)`.

| API Leaflet | Rôle | Exemple d'utilisation dans `popup.js` |
| :--- | :--- | :--- |
| `L.map('id').setView(...)` | Création de la carte. | Initialisation au centre de Paris. |
| `L.tileLayer(url, options)` | Définition d'une couche de tuiles IGN. | Configuration des trois couches (plan, ortho, cadastre). |
| `map.flyTo(coords, zoom, options)` | Animation de navigation. | Utilisé pour les boutons de ville et la géolocalisation. |
| `map.on('event', callback)` | Écouteurs d'événements Leaflet. | Utilisé pour `move`, `zoom`, et `click`. |

---

## 🌐 Service IGN - Spécifications WMTS

### Anatomie de l'URL WMTS

L'extension utilise l'URL **`https://data.geopf.fr/wmts?`** pour accéder au service WMTS (Web Map Tile Service) de l'IGN. Ce service est optimisé pour la rapidité grâce aux tuiles pré-générées.

**Paramètres clés :**
* **Opération :** `REQUEST=GetTile`
* **Protocole :** `SERVICE=WMTS&VERSION=1.0.0`
* **Projection :** `TILEMATRIXSET=PM` (Pseudo-Mercator)
* **Tuilage :** `TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`

---

## 🔐 Sécurité et Débogage

### Content Security Policy (CSP)

Le CSP est crucial pour la sécurité de l'extension et autorise explicitement les ressources nécessaires:
* **Scripts (`script-src`)** : `'self'` (uniquement les scripts locaux).
* **Images (`img-src`)** : `'self'` (fichiers locaux), `data:` (pour les marqueurs), et les domaines IGN (`https://wxs.ign.fr`, `https://data.geopf.fr`).


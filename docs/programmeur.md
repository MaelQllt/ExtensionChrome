# 👨‍💻 Documentation Programmeur - Extension Carte IGN

## Architecture de l'extension

### Vue d'ensemble

Cette extension Chrome utilise :
- **Manifest V3** : La dernière version du format manifest
- **Leaflet.js** : Bibliothèque JavaScript open-source pour cartes interactives
- **IGN Géoportail** : Service de tuiles cartographiques français
- **Architecture popup** : Interface déclenchée au clic sur l'icône

### Structure des fichiers

```
extension-carte-ign/
├── manifest.json          # Configuration Manifest V3
├── popup.html            # Interface utilisateur (DOM)
├── popup.js              # Logique métier et interactions
├── styles.css            # Styles et mise en page
└── icons/                # Assets visuels (3 tailles)
```

---

## 📄 Fichiers détaillés

### manifest.json

**Rôle :** Fichier de configuration principal de l'extension Chrome.

**Points clés :**

```json
"manifest_version": 3
```
- Utilise Manifest V3 (obligatoire depuis 2023)
- Différences vs V2 : content_security_policy plus strict, host_permissions séparé

```json
"permissions": ["storage"]
```
- Permission pour le stockage local (future fonctionnalité)
- Non utilisée actuellement mais prête pour sauvegarder la position

```json
"host_permissions": ["https://wxs.ign.fr/*"]
```
- Autorise les requêtes vers les serveurs IGN
- Nécessaire pour charger les tuiles cartographiques

```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; ..."
}
```
- Sécurise l'extension contre les injections XSS
- Autorise uniquement les scripts locaux et les CDN spécifiés
- `'unsafe-inline'` pour les styles Leaflet dynamiques

---

### popup.html

**Rôle :** Structure HTML de l'interface popup.

**Architecture DOM :**

```
.container
├── header (titre + sous-titre)
├── .controls (boutons de navigation)
├── #map (conteneur Leaflet)
└── footer (informations temps réel)
```

**CDN externes :**
- Leaflet CSS : `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css`
- Leaflet JS : `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js`

**Ordre de chargement :**
1. Leaflet CSS (head)
2. Styles personnalisés (head)
3. DOM complet
4. Leaflet JS
5. popup.js (attend DOMContentLoaded)

---

### styles.css

**Rôle :** Mise en page et design de l'interface.

**Méthodologie :**
- Flexbox pour layout principal
- CSS moderne (variables, transitions, gradients)
- Responsive design (même si taille fixe)

**Sections principales :**

1. **Reset & Base** : `* { margin: 0; padding: 0; }`
2. **Layout** : Container flex column, hauteur 100%
3. **Composants** : header, controls, map, footer
4. **Interactions** : transitions, hover effects
5. **Leaflet override** : customisation des contrôles

**Dimensions importantes :**
```css
body { width: 600px; height: 700px; }
#map { flex: 1; } /* Prend tout l'espace restant */
```

---

### popup.js

**Rôle :** Logique métier, initialisation carte, gestion événements.

**Structure du code :**

#### 1. Variables globales
```javascript
let map;              // Instance Leaflet
let currentMarker;    // Marqueur actif
```

#### 2. Point d'entrée
```javascript
document.addEventListener('DOMContentLoaded', initMap);
```
- Garantit que le DOM est chargé
- Leaflet nécessite que #map existe

#### 3. Fonction initMap()

**Étapes d'initialisation :**

```javascript
// 1. Création de la carte
map = L.map('map').setView([lat, lon], zoom);
```
- `setView()` : position initiale + niveau de zoom
- Coordonnées Paris : [48.8566, 2.3522]
- Zoom 12 : niveau ville

```javascript
// 2. Configuration couche IGN
const ignLayer = L.tileLayer(
  'https://wxs.ign.fr/essentiels/geoportail/wmts?...',
  options
);
```

**Anatomie de l'URL WMTS :**
- `wxs.ign.fr/essentiels` : Point d'accès service
- `/geoportail/wmts` : Type de service
- `REQUEST=GetTile` : Opération WMTS
- `SERVICE=WMTS&VERSION=1.0.0` : Protocole
- `LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2` : Couche Plan IGN
- `TILEMATRIXSET=PM` : Projection Pseudo-Mercator
- `TILEMATRIX={z}&TILEROW={y}&TILECOL={x}` : Coordonnées tuiles

**Alternatives de couches IGN :**
```javascript
// Photos aériennes
LAYER=ORTHOIMAGERY.ORTHOPHOTOS

// Carte topographique
LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS

// Parcelles cadastrales
LAYER=CADASTRALPARCELS.PARCELS
```

```javascript
// 3. Ajout à la carte
ignLayer.addTo(map);
```

```javascript
// 4. Événements
map.on('move', updateCoordinates);
map.on('zoom', updateCoordinates);
map.on('click', onMapClick);
```

#### 4. Fonctions utilitaires

**addMarker(coords, popupText)**
```javascript
function addMarker(coords, popupText) {
    if (currentMarker) {
        map.removeLayer(currentMarker); // Supprime ancien
    }
    currentMarker = L.marker(coords).addTo(map);
    if (popupText) {
        currentMarker.bindPopup(popupText).openPopup();
    }
}
```
- Pattern : un seul marqueur à la fois
- `bindPopup()` : attache le contenu
- `openPopup()` : affiche immédiatement

**flyToCity(coords, name)**
```javascript
function flyToCity(coords, name) {
    map.flyTo(coords, 13, {
        duration: 1.5,      // 1.5 secondes
        easeLinearity: 0.25 // Courbe d'animation
    });
    addMarker(coords, name);
}
```
- `flyTo()` vs `setView()` : animation fluide
- Zoom 13 : légèrement plus proche que l'initial

**updateCoordinates()**
```javascript
function updateCoordinates() {
    const center = map.getCenter();
    const zoom = map.getZoom();
    
    document.getElementById('coordinates').textContent = 
        `Lat: ${center.lat.toFixed(4)} | Lon: ${center.lng.toFixed(4)}`;
    // ...
}
```
- Appelée à chaque mouvement de carte
- `.toFixed(4)` : précision de 4 décimales

**onMapClick(e)**
```javascript
function onMapClick(e) {
    addMarker([e.latlng.lat, e.latlng.lng], 
        `📍 Position<br>Lat: ${e.latlng.lat.toFixed(4)}<br>...`);
}
```
- `e.latlng` : objet contenant lat/lng du clic

---

## 🔧 API Leaflet utilisées

### Création de carte
```javascript
L.map(id, options)
```
- `id` : ID de l'élément DOM
- Retourne : objet Map

### Couches de tuiles
```javascript
L.tileLayer(urlTemplate, options)
```
- `urlTemplate` : URL avec variables {x}, {y}, {z}
- `options.attribution` : crédits
- `options.minZoom`, `maxZoom` : limites de zoom

### Marqueurs
```javascript
L.marker([lat, lng])
  .addTo(map)
  .bindPopup(content)
  .openPopup()
```

### Navigation
```javascript
map.setView([lat, lng], zoom)  // Instantané
map.flyTo([lat, lng], zoom, options)  // Animé
```

### Événements
```javascript
map.on('eventName', callback)
```
- Events : `click`, `move`, `zoom`, `dragend`

### Méthodes de récupération
```javascript
map.getCenter()  // Retourne L.LatLng
map.getZoom()    // Retourne number
```

---

## 🌐 Service IGN - Spécifications WMTS

### Qu'est-ce que WMTS ?

**Web Map Tile Service** : standard OGC pour servir des tuiles pré-générées.

**Avantages :**
- ✅ Tuiles pré-calculées = chargement rapide
- ✅ Mise en cache efficace
- ✅ Scalabilité

**vs WMS :**
- WMS génère images à la demande (plus lent)
- WMTS sert tuiles statiques (plus rapide)

### Structure de l'URL IGN

```
https://wxs.ign.fr/{clé}/geoportail/wmts
```

**Paramètres requis :**
- `REQUEST=GetTile` : opération
- `SERVICE=WMTS` : type de service
- `VERSION=1.0.0` : version protocole
- `LAYER=` : identifiant couche
- `STYLE=normal` : style (généralement "normal")
- `TILEMATRIXSET=PM` : projection (PM = Pseudo-Mercator)
- `FORMAT=image/png` : format image
- `TILEMATRIX={z}` : niveau de zoom
- `TILEROW={y}` : ligne de tuile
- `TILECOL={x}` : colonne de tuile

### Clé API

L'extension utilise la clé `essentiels` :
- Clé publique fournie par l'IGN
- Limitations : usage raisonnable
- Pour production : obtenir clé personnelle sur https://geoservices.ign.fr/

---

## 🔐 Sécurité

### Content Security Policy (CSP)

```json
"script-src 'self';"
```
- Seuls les scripts locaux sont autorisés
- Scripts CDN chargés via `<script src="https://...">`

```json
"img-src 'self' data: https://wxs.ign.fr https://*.openstreetmap.org;"
```
- Images autorisées depuis :
  - Extension elle-même (`'self'`)
  - Data URIs (`data:`)
  - Serveurs IGN
  - Tuiles OpenStreetMap (fallback Leaflet)

```json
"style-src 'self' 'unsafe-inline' https://unpkg.com;"
```
- `'unsafe-inline'` nécessaire pour styles dynamiques Leaflet
- À améliorer : extraire styles inline

### Permissions minimales

Principe du moindre privilège :
- ❌ Pas d'accès onglets
- ❌ Pas d'accès historique
- ✅ Uniquement host_permissions pour IGN

---

## 🚀 Améliorations possibles

### Niveau facile

1. **Géolocalisation utilisateur**
```javascript
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
        map.flyTo([pos.coords.latitude, pos.coords.longitude], 13);
    });
}
```

2. **Sauvegarde position**
```javascript
// Sauvegarder
chrome.storage.local.set({ lastPosition: map.getCenter() });

// Restaurer
chrome.storage.local.get(['lastPosition'], (result) => {
    if (result.lastPosition) {
        map.setView(result.lastPosition);
    }
});
```

3. **Plus de villes**
```javascript
const cities = {
    paris: [48.8566, 2.3522],
    lyon: [45.7640, 4.8357],
    // ... ajouter ici
};
```

### Niveau intermédiaire

4. **Recherche d'adresse** (avec API Adresse.data.gouv.fr)
5. **Changement de fond de carte** (Plan / Satellite / Topo)
6. **Mesure de distances**
7. **Export image carte**

### Niveau avancé

8. **Intégration données GeoJSON**
9. **Routing (itinéraires)**
10. **Heatmaps**
11. **Mode plein écran dans onglet**

---

## 🐛 Debugging

### Console Chrome

Ouvrir DevTools dans le popup :
1. Clic droit sur l'extension → "Inspecter le popup"
2. Console accessible immédiatement

### Logs utiles
```javascript
console.log('Carte initialisée:', map);
console.log('Centre:', map.getCenter());
console.log('Zoom:', map.getZoom());
```

### Erreurs courantes

**Error: Map container not found**
- Le DOM n'est pas prêt
- Solution : DOMContentLoaded

**CORS error**
- host_permissions manquant
- Solution : ajouter domaine dans manifest.json

**Tuiles ne chargent pas**
- URL IGN incorrecte
- Clé API invalide
- Vérifier Network tab

---

## 📚 Ressources

### Documentation officielle
- [Leaflet](https://leafletjs.com/reference.html)
- [IGN Géoportail](https://geoservices.ign.fr/documentation/)
- [Chrome Extensions](https://developer.chrome.com/docs/extensions/mv3/)

### Standards
- [WMTS OGC](https://www.ogc.org/standards/wmts)
- [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)

### Outils de test
- [Chrome Extensions Manifest Validator](https://developer.chrome.com/docs/extensions/mv3/manifest/)
- [Leaflet Playground](https://leafletjs.com/examples.html)

---

## 📊 Métriques de performance

- **Temps de chargement initial** : ~1-2 secondes
- **Taille extension** : ~10-15 KB (sans icônes)
- **Requêtes réseau** : 
  - 1x Leaflet CSS (~15 KB)
  - 1x Leaflet JS (~145 KB)
  - Nx tuiles IGN (~10-30 KB chacune)
- **Mémoire utilisée** : ~30-50 MB

---

## ✅ Checklist développeur

Avant de déployer :

- [ ] Tester sur Chrome version récente
- [ ] Vérifier toutes les icônes présentes
- [ ] Valider manifest.json
- [ ] Tester toutes les interactions
- [ ] Vérifier console (pas d'erreurs)
- [ ] Tester avec connexion lente
- [ ] Documenter modifications
- [ ] Incrémenter version dans manifest.json
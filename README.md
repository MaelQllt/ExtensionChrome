# 🗺️ Extension Chrome - Carte Interactive IGN

> Projet scolaire démontrant l'intégration d'une carte interactive Leaflet consommant un service web de l'IGN dans une extension Chrome.

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue)](https://developer.chrome.com/docs/extensions/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-green)](https://leafletjs.com/)
[![IGN](https://img.shields.io/badge/IGN-Géoportail-orange)](https://www.ign.fr/)

---

## 📌 Objectif du projet

**Question de recherche :** Est-il possible d'afficher une carte interactive dans une extension Chrome ?

**Réponse :** Oui ! Ce projet démontre qu'il est tout à fait possible d'intégrer une carte interactive complète dans une extension Chrome en utilisant :
- La bibliothèque **Leaflet.js**
- Les services cartographiques de l'**IGN** (Institut national de l'information géographique et forestière)
- Le protocole **WMTS** (Web Map Tile Service)

---

## ✨ Fonctionnalités

- 🗺️ **Carte interactive** : Zoom, déplacement, navigation fluide
- 🇫🇷 **Fond de carte IGN** : Utilisation du Plan IGN V2 officiel
- 📍 **Navigation rapide** : Boutons vers Paris, Lyon, Marseille
- 🖱️ **Marqueurs interactifs** : Cliquez sur la carte pour placer un marqueur
- 📊 **Informations temps réel** : Coordonnées et niveau de zoom actualisés
- 🎨 **Interface moderne** : Design épuré avec animations

---

## 📸 Aperçu

```
┌─────────────────────────────────────┐
│  🗺️ Carte IGN Interactive           │
│  Powered by Leaflet & IGN           │
├─────────────────────────────────────┤
│ [📍 Paris] [📍 Lyon] [📍 Marseille]│
├─────────────────────────────────────┤
│                                     │
│         [Carte interactive]         │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ Lat: 48.8566 | Lon: 2.3522         │
│                       Zoom: 12      │
└─────────────────────────────────────┘
```

*(Ajouter ici vos captures d'écran réelles)*

---

## 🚀 Installation rapide

### Prérequis
- Google Chrome (version 88+)
- Connexion Internet

### Étapes

1. **Télécharger le projet**
   ```bash
   # Cloner ou télécharger le dossier complet
   ```

2. **Créer les icônes**
   - Placez 3 icônes PNG dans le dossier `icons/` :
     - `icon16.png` (16×16 pixels)
     - `icon48.png` (48×48 pixels)
     - `icon128.png` (128×128 pixels)

3. **Charger l'extension**
   - Ouvrez Chrome : `chrome://extensions/`
   - Activez le "Mode développeur"
   - Cliquez "Charger l'extension non empaquetée"
   - Sélectionnez le dossier du projet

4. **Utiliser l'extension**
   - Cliquez sur l'icône de l'extension dans la barre d'outils
   - La carte s'affiche dans un popup

📖 **Documentation complète** : Consultez [docs/installation.md](docs/installation.md)

---

## 📁 Structure du projet

```
extension-carte-ign/
│
├── manifest.json          # Configuration de l'extension (Manifest V3)
├── popup.html            # Interface utilisateur du popup
├── popup.js              # Logique JavaScript et Leaflet
├── styles.css            # Styles et mise en page
│
├── icons/                # Icônes de l'extension
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│
├── docs/                 # Documentation
│   ├── installation.md       # Guide d'installation utilisateur
│   ├── programmeur.md        # Documentation technique
│   └── screenshots/          # Captures d'écran
│
└── README.md            # Ce fichier
```

---

## 🛠️ Technologies utilisées

| Technologie | Version | Rôle |
|-------------|---------|------|
| Chrome Extension API | Manifest V3 | Framework d'extension |
| Leaflet.js | 1.9.4 | Bibliothèque cartographique |
| IGN Géoportail | WMTS | Service de tuiles |
| HTML5 / CSS3 | - | Interface utilisateur |
| JavaScript | ES6+ | Logique métier |

---

## 🔧 Configuration technique

### Service IGN
- **Endpoint** : `https://wxs.ign.fr/essentiels/geoportail/wmts`
- **Couche** : `GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2`
- **Format** : PNG
- **Projection** : Pseudo-Mercator (EPSG:3857)

### Dimensions popup
- **Largeur** : 600 pixels
- **Hauteur** : 700 pixels

### Permissions requises
- `storage` : Stockage local (prévu pour futures fonctionnalités)
- Host : `https://wxs.ign.fr/*` (accès aux tuiles IGN)

---

## 👨‍💻 Documentation programmeur

Pour comprendre le fonctionnement interne, l'architecture et les API utilisées, consultez la [documentation programmeur complète](docs/programmeur.md).

**Sujets couverts :**
- Architecture de l'extension
- Détail de chaque fichier
- API Leaflet utilisées
- Service WMTS de l'IGN
- Gestion de la sécurité (CSP)
- Guide d'amélioration
- Debugging

---

## 🧪 Tests

### Tests de base
1. ✅ La carte s'affiche correctement
2. ✅ Les boutons de navigation fonctionnent
3. ✅ Le clic place un marqueur
4. ✅ Les coordonnées se mettent à jour
5. ✅ Le zoom fonctionne (molette + boutons)

### Tests de compatibilité
- Chrome 88+ : ✅ Testé
- Edge (Chromium) : Compatible (non testé)
- Autres navigateurs : Non supportés (Manifest V3)

---

## 🐛 Dépannage

### La carte ne s'affiche pas
- Vérifiez votre connexion Internet
- Ouvrez la console Chrome (F12) pour voir les erreurs
- Rechargez l'extension dans `chrome://extensions/`

### Les tuiles IGN ne chargent pas
- Le service IGN peut être temporairement indisponible
- Vérifiez l'URL du service dans `popup.js`
- Consultez le statut : https://geoservices.ign.fr/

### L'extension n'apparaît pas
- Vérifiez que le mode développeur est activé
- Assurez-vous que toutes les icônes sont présentes
- Validez le fichier `manifest.json`

---

## 🚀 Améliorations futures

### Niveau facile
- [ ] Géolocalisation de l'utilisateur
- [ ] Sauvegarde de la dernière position
- [ ] Plus de villes prédéfinies
- [ ] Changement de thème (clair/sombre)

### Niveau intermédiaire
- [ ] Recherche d'adresse (API Adresse.data.gouv.fr)
- [ ] Sélecteur de fond de carte (Plan / Satellite / Topo)
- [ ] Mesure de distances
- [ ] Export de la carte en image

### Niveau avancé
- [ ] Import de données GeoJSON
- [ ] Calcul d'itinéraires
- [ ] Heatmaps
- [ ] Mode plein écran dans un onglet

---

## 📚 Ressources

### Documentation officielle
- [Leaflet - Documentation](https://leafletjs.com/reference.html)
- [IGN - Géoservices](https://geoservices.ign.fr/documentation/)
- [Chrome Extensions - Guide](https://developer.chrome.com/docs/extensions/mv3/)

### Standards utilisés
- [WMTS - OGC Standard](https://www.ogc.org/standards/wmts)
- [Manifest V3 - Chrome](https://developer.chrome.com/docs/extensions/mv3/intro/)

### Tutoriels
- [Leaflet Quick Start](https://leafletjs.com/examples/quick-start/)
- [Chrome Extensions Tutorial](https://developer.chrome.com/docs/extensions/mv3/getstarted/)

---

## 👤 Auteur

**[Ton nom]**  
Projet scolaire - [Année scolaire]

---

## 📄 Licence

Ce projet est réalisé dans un cadre éducatif.

**Crédits :**
- Cartes : © [IGN](https://www.ign.fr/) - Géoportail
- Bibliothèque : [Leaflet](https://leafletjs.com/) (BSD 2-Clause License)

---

## 🎓 Contexte académique

Ce projet répond à un exercice scolaire visant à :
1. Démontrer la faisabilité d'une carte interactive dans une extension
2. Consommer un service web (WMTS de l'IGN)
3. Produire une documentation complète (installation + programmeur)
4. Fournir des visuels de démonstration

**Livrables :**
- ✅ Code source complet et fonctionnel
- ✅ Documentation d'installation (pour utilisateurs)
- ✅ Documentation programmeur (technique)
- ✅ Captures d'écran et visuels
- ✅ Journal d'avancement

---

## ⭐ Remerciements

- **IGN** pour la mise à disposition gratuite des services cartographiques
- **Leaflet** pour la bibliothèque open-source
- **Chrome Team** pour la documentation claire

---

<div align="center">

**Projet réalisé avec ❤️ et 🗺️**

[⬆ Retour en haut](#-extension-chrome---carte-interactive-ign)

</div>
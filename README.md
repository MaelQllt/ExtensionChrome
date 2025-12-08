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

* 🗺️ **Carte interactive** : Zoom, déplacement, navigation fluide
* 🇫🇷 **Fonds de carte IGN sélectionnables** : Choisissez entre :
    * **Plan IGN V2** (Plan de base)
    * **Orthophotographie** (Vue satellite)
    * **Parcelles Cadastrales** (Limites de propriété)
* 📍 **Géolocalisation** : Centrage automatique sur votre position actuelle (avec autorisation de Chrome)
* 📍 **Navigation rapide** : Boutons vers Paris, Lyon, Marseille
* 🖱️ **Marqueurs interactifs** : Cliquez sur la carte pour placer un marqueur
* 📊 **Informations temps réel** : Coordonnées et niveau de zoom actualisés
* 🎨 **Interface moderne** : Design épuré avec animations

---

## 📸 Aperçu

| Vue Principale | Fond Orthophoto (Paris) | Fond Cadastre (Marseille) |
| :---: | :---: | :---: |
| ![Aperçu de l'extension](docs/screenshots/extension.png) | ![Aperçu du fond Orthophoto sur Paris](docs/screenshots/paris_ortho.png) | ![Aperçu du fond Cadastre sur Marseille](docs/screenshots/marseille_cadastre.png) |
| *L'extension lors de son ouverture.* | *Aperçu de la vue Orthophotographie.* | *Aperçu de la vue Cadastrale.* |

---

## 🚀 Installation rapide

### Prérequis
- Google Chrome (version 88+)
- Connexion Internet

### Étapes

1. **Télécharger le projet**
   ```bash
   # Cloner ou télécharger le dossier complet
2.  **Charger l'extension**

      - Ouvrez Chrome : `chrome://extensions/`
      - Activez le "**Mode développeur**"
      - Cliquez "**Charger l'extension non empaquetée**"
      - Sélectionnez le dossier du projet

3.  **Utiliser l'extension**

      - Cliquez sur l'icône de l'extension dans la barre d'outils
      - La carte s'affiche dans un popup

📖 **Documentation complète** : Consultez [docs/installation.md](https://www.google.com/search?q=docs/installation.md)

-----

## 📁 Structure du projet

```
extension-carte-ign/
│
├── manifest.json          # Configuration de l'extension (Manifest V3)
├── popup.html            # Interface utilisateur du popup (avec sélecteur de fonds)
├── popup.js              # Logique JavaScript, Leaflet et Géolocalisation
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
│   └── screenshots/          # Captures d'écran (extension.png, etc.)
│
└── README.md            # Ce fichier
```

-----

## 🛠️ Technologies utilisées

| Technologie | Version | Rôle |
|-------------|---------|------|
| Chrome Extension API | Manifest V3 | Framework d'extension |
| Leaflet.js | 1.9.4 | Bibliothèque cartographique |
| IGN Géoportail | WMTS | Service de tuiles |
| HTML5 / CSS3 | - | Interface utilisateur |
| JavaScript | ES6+ | Logique métier |

-----

## 🔧 Configuration technique

### Services IGN (WMTS)

Trois couches sont utilisées :

1.  **Plan IGN** : `GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2`
2.  **Orthophoto** : `ORTHOIMAGERY.ORTHO-HR`
3.  **Cadastre** : `CADASTRALPARCELS.PARCELS`

<!-- end list -->

  * **Endpoint commun** : `https://wxs.ign.fr/essentiels/geoportail/wmts`
  * **Projection** : Pseudo-Mercator (EPSG:3857)

### Permissions requises

  - `storage` : Stockage local (prévu pour futures fonctionnalités)
  - **`geolocation`** : Accès à la position de l'utilisateur (nécessaire pour la géolocalisation)
  - Host : `https://wxs.ign.fr/*` (accès aux tuiles IGN)

-----

## 👨‍💻 Documentation programmeur

Pour comprendre le fonctionnement interne, l'architecture et les API utilisées, consultez la [documentation programmeur complète](https://www.google.com/search?q=docs/programmeur.md).

**Sujets couverts :**

  - Architecture de l'extension (gestion des options de fond de carte)
  - Détail de chaque fichier
  - API Leaflet et gestion des couches (`L.tileLayer`)
  - Utilisation de l'API `navigator.geolocation`
  - Gestion de la sécurité (CSP)
  - Guide d'amélioration
  - Debugging

-----

## 🧪 Tests

### Tests de base

1.  ✅ La carte s'affiche correctement
2.  ✅ Les boutons de navigation fonctionnent
3.  ✅ Le clic place un marqueur
4.  ✅ Les coordonnées se mettent à jour
5.  ✅ Le zoom fonctionne (molette + boutons)

### Tests de fonctionnalités ajoutées

1.  ✅ Le **sélecteur de fond de carte** fonctionne et affiche les 3 couches IGN
2.  ✅ La **géolocalisation** centre la carte sur la position (si l'utilisateur autorise)
3.  ✅ Le fond **Cadastre** affiche les limites de parcelles
4.  ✅ Le fond **Orthophoto** affiche l'imagerie aérienne

### Tests de compatibilité

  - Chrome 88+ : ✅ Testé
  - Edge (Chromium) : Compatible (non testé)
  - Autres navigateurs : Non supportés (Manifest V3)

-----

## 🐛 Dépannage

### La carte ne s'affiche pas

  - Vérifiez votre connexion Internet
  - Ouvrez la console Chrome (F12) pour voir les erreurs
  - Rechargez l'extension dans `chrome://extensions/`

### Les tuiles IGN ne chargent pas

  - Le service IGN peut être temporairement indisponible
  - Vérifiez l'URL du service et le nom des couches dans `popup.js`
  - Consultez le statut : https://geoservices.ign.fr/

### La géolocalisation ne fonctionne pas

  - Assurez-vous d'avoir autorisé Chrome à accéder à votre position
  - Vérifiez les erreurs dans la console (rejet de permission ou timeout)
  - La géolocalisation peut être imprécise en intérieur

-----

## 🚀 Améliorations futures

### Niveau facile

  - [ ] Sauvegarde de la dernière position et du fond de carte sélectionné
  - [ ] Plus de villes prédéfinies
  - [ ] Changement de thème (clair/sombre)

### Niveau intermédiaire

  - [ ] Recherche d'adresse (API Adresse.data.gouv.fr)
  - [ ] Mesure de distances
  - [ ] Export de la carte en image

### Niveau avancé

  - [ ] Import de données GeoJSON
  - [ ] Calcul d'itinéraires
  - [ ] Heatmaps
  - [ ] Mode plein écran dans un onglet

-----

## 📚 Ressources

### Documentation officielle

  - [Leaflet - Documentation](https://leafletjs.com/reference.html)
  - [IGN - Géoservices](https://geoservices.ign.fr/documentation/)
  - [Chrome Extensions - Guide](https://developer.chrome.com/docs/extensions/mv3/)

### Standards utilisés

  - [WMTS - OGC Standard](https://www.ogc.org/standards/wmts)
  - [Manifest V3 - Chrome](https://developer.chrome.com/docs/extensions/mv3/intro/)

-----

## 👤 Auteur

**[Ton nom]** Projet scolaire - [Année scolaire]

-----

## 📄 Licence

Ce projet est réalisé dans un cadre éducatif.

**Crédits :**

  - Cartes : © [IGN](https://www.ign.fr/) - Géoportail
  - Bibliothèque : [Leaflet](https://leafletjs.com/) (BSD 2-Clause License)

-----

## 🎓 Contexte académique

Ce projet répond à un exercice scolaire visant à :

1.  Démontrer la faisabilité d'une carte interactive dans une extension
2.  Consommer plusieurs services web (WMTS de l'IGN)
3.  Intégrer la géolocalisation
4.  Produire une documentation complète (installation + programmeur)
5.  Fournir des visuels de démonstration

**Livrables :**

  - ✅ Code source complet et fonctionnel
  - ✅ Documentation d'installation (pour utilisateurs)
  - ✅ Documentation programmeur (technique)
  - ✅ Captures d'écran et visuels
  - ✅ Journal d'avancement

-----

## ⭐ Remerciements

  - **IGN** pour la mise à disposition gratuite des services cartographiques
  - **Leaflet** pour la bibliothèque open-source
  - **Chrome Team** pour la documentation claire

-----

\<div align="center"\>

**Projet réalisé avec ❤️ et 🗺️**

[⬆ Retour en haut](https://www.google.com/search?q=%23-extension-chrome---carte-interactive-ign)

\</div\>

```
```
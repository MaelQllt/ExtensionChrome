# 📦 Guide d'Installation - Extension Carte IGN Interactive

## Prérequis

- Google Chrome (version 88 ou supérieure)
- Une connexion Internet pour charger les tuiles de carte
- Aucune compétence technique requise pour l'installation

---

## 🚀 Installation pas à pas

### Étape 1 : Télécharger les fichiers

1. Téléchargez tous les fichiers du projet
2. Créez un dossier nommé `extension-carte-ign` sur votre bureau
3. Placez tous les fichiers dans ce dossier selon cette structure :

```
extension-carte-ign/
├── manifest.json
├── popup.html
├── popup.js
├── styles.css
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Étape 2 : Créer les icônes

**Important :** Vous devez créer 3 icônes aux dimensions suivantes :
- `icon16.png` : 16x16 pixels
- `icon48.png` : 48x48 pixels  
- `icon128.png` : 128x128 pixels

**Astuce :** Vous pouvez utiliser un générateur d'icônes en ligne ou créer une icône simple avec un fond coloré et une lettre "C" (pour Carte).

### Étape 3 : Charger l'extension dans Chrome

1. **Ouvrir Chrome** et accéder aux extensions :
   - Tapez dans la barre d'adresse : `chrome://extensions/`
   - Ou via Menu (⋮) → Plus d'outils → Extensions

2. **Activer le mode développeur** :
   - En haut à droite, activez le bouton "Mode développeur"

3. **Charger l'extension** :
   - Cliquez sur "Charger l'extension non empaquetée"
   - Sélectionnez le dossier `extension-carte-ign`
   - Cliquez sur "Sélectionner le dossier"

4. **Vérification** :
   - L'extension apparaît dans la liste
   - Une icône devrait s'afficher dans la barre d'outils Chrome

### Étape 4 : Épingler l'extension (optionnel)

1. Cliquez sur l'icône puzzle (🧩) dans la barre d'outils
2. Trouvez "Carte Interactive IGN"
3. Cliquez sur l'épingle (📌) pour la garder visible

---

## ✅ Test de fonctionnement

### Test 1 : Ouverture de l'extension
- Cliquez sur l'icône de l'extension
- Une fenêtre popup devrait s'ouvrir (600x700 pixels)
- Une carte centrée sur Paris devrait s'afficher

### Test 2 : Navigation
- Cliquez sur les boutons "Paris", "Lyon", "Marseille"
- La carte devrait se déplacer vers la ville sélectionnée avec une animation fluide

### Test 3 : Interaction
- Cliquez n'importe où sur la carte
- Un marqueur devrait apparaître avec les coordonnées
- Zoomez avec la molette ou les boutons +/-
- Les coordonnées en bas devraient se mettre à jour

---

## ❌ Dépannage

### Problème : La carte ne s'affiche pas
**Solution :** 
- Vérifiez votre connexion Internet
- Ouvrez la console (F12) et regardez les erreurs
- Vérifiez que le fichier `manifest.json` est correct

### Problème : L'extension n'apparaît pas
**Solution :**
- Vérifiez que le mode développeur est activé
- Rechargez l'extension (bouton 🔄 dans chrome://extensions/)
- Vérifiez que toutes les icônes sont présentes dans le dossier `icons/`

### Problème : Erreur CSP (Content Security Policy)
**Solution :**
- Vérifiez que le `manifest.json` contient bien la section `content_security_policy`
- Assurez-vous d'utiliser les CDN autorisés (unpkg.com)

### Problème : Les tuiles IGN ne chargent pas
**Solution :**
- Vérifiez l'URL du service IGN dans `popup.js`
- Testez l'URL directement dans un navigateur
- Les services IGN peuvent occasionnellement être en maintenance

---

## 🔄 Mise à jour de l'extension

Pour modifier l'extension :

1. Modifiez les fichiers sources
2. Retournez sur `chrome://extensions/`
3. Cliquez sur le bouton "Recharger" (🔄) sous votre extension
4. Testez les modifications

---

## 📊 Captures d'écran recommandées

Pour votre documentation, prenez des captures d'écran de :

1. **L'installation** : La page chrome://extensions/ avec votre extension
2. **Vue d'ensemble** : L'extension ouverte sur Paris
3. **Navigation** : Animation vers une autre ville
4. **Interaction** : Un marqueur placé sur la carte
5. **Informations** : Le footer avec les coordonnées actualisées

---

## 📝 Informations techniques

- **Taille du popup** : 600x700 pixels
- **Service cartographique** : IGN Géoportail WMTS
- **Couche utilisée** : GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2
- **Bibliothèque** : Leaflet 1.9.4
- **Format des tuiles** : PNG
- **Projection** : Web Mercator (EPSG:3857)

---

## ✨ Fonctionnalités

✅ Affichage d'une carte interactive  
✅ Fond de carte IGN officiel  
✅ Navigation vers 3 villes françaises  
✅ Placement de marqueurs au clic  
✅ Affichage des coordonnées en temps réel  
✅ Zoom et déplacement fluides  
✅ Interface moderne et responsive
# 📦 Guide d'Installation Utilisateur - Extension Carte IGN Interactive

## ℹ️ Prérequis

* **Navigateur :** Google Chrome (version 88 ou supérieure)
* **Connexion :** Internet (nécessaire pour charger les tuiles WMTS de l'IGN)
* **Compétence :** Aucune compétence technique requise pour l'installation

---

## 🚀 Étape 1 : Préparation des Fichiers et de la Structure

### 1. Télécharger et Organiser les Fichiers

Téléchargez tous les fichiers du projet et placez-les dans un nouveau dossier nommé, par exemple, `extension-carte-ign`.

### 2. Structure de Dossiers

Assurez-vous que la structure de votre dossier ressemble à ceci, en incluant le dossier de la bibliothèque Leaflet et le dossier des icônes:

```

extension-carte-ign/
├── manifest.json
├── popup.html
├── popup.js
├── styles.css
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── lib/
     └── leaflet/
     ├── leaflet.css
     └── leaflet.js

```

### 3. Création des Icônes

Les icônes sont obligatoires pour Manifest V3. Vous devez créer ou trouver les trois fichiers PNG suivants et les placer dans le dossier `icons/`:
* `icon16.png` : **16x16 pixels**
* `icon48.png` : **48x48 pixels**
* `icon128.png` : **128x128 pixels**

Par défaut il existe déjà une icône.

---

## 💻 Étape 2 : Charger l'Extension dans Chrome

Cette extension doit être chargée en mode développeur.

1.  **Ouvrez la page des extensions** :
    * Tapez `chrome://extensions/` dans la barre d'adresse.
2.  **Activez le Mode Développeur** :
    * En haut à droite de la page, basculez le bouton "**Mode développeur**" sur Activé.
3.  **Chargez le Projet** :
    * Cliquez sur le bouton "**Charger l'extension non empaquetée**".
    * Sélectionnez le dossier racine de votre projet (`extension-carte-ign`).

**Vérification :** L'extension intitulée "Carte Interactive IGN" doit apparaître dans la liste avec un statut "Activé".

### Étape 3 : Utilisation et Épinglage (Optionnel)

1.  Cliquez sur l'icône puzzle (🧩) dans la barre d'outils Chrome.
2.  Trouvez "**Carte Interactive IGN**" et cliquez sur l'icône épingle (📌) pour la rendre visible en permanence.
3.  Cliquez sur l'icône de l'extension pour ouvrir la carte interactive dans un popup.

---

## ✅ Test de Fonctionnement

Effectuez ces tests rapides pour valider l'installation :

| Test | Action | Résultat attendu |
| :--- | :--- | :--- |
| **Ouverture** | Cliquez sur l'icône de l'extension. | Une fenêtre popup (600x700 pixels) s'ouvre avec une carte centrée sur Paris. |
| **Navigation** | Cliquez sur les boutons **Paris**, **Lyon**, ou **Marseille**. | La carte se déplace vers la ville sélectionnée avec une animation fluide. |
| **Localisation** | Cliquez sur le bouton **Ma position** | Si vous avez autorisé Chrome à accéder à votre position, la couche se centre sur vos position actuelle. |
| **Interaction** | Cliquez n'importe où sur la carte. | Un marqueur apparaît, et les coordonnées du clic s'affichent. |
| **Navigation** | Utilisez l'itinéraire. | L'itinéraire le plus court apparait entre les deux points (départ et arrivée). |
| **Informations** | Déplacez et zoomez sur la carte. | Les coordonnées (Lat/Lon) et le niveau de zoom dans le footer se mettent à jour. |
| **Changement de fond** | Utilisez le sélecteur de fonds de carte. | La couche cartographique doit basculer entre Plan IGN, Orthophotos et Cadastre. |

---

## ❌ Dépannage Courant

| Problème | Cause Possible | Solution |
| :--- | :--- | :--- |
| **Carte ne s'affiche pas** | Problème de chargement des fichiers Leaflet ou IGN. | Vérifiez la console (F12) pour les erreurs. Assurez-vous que les fichiers `leaflet.css` et `leaflet.js` sont bien dans le dossier `lib/leaflet/`. |
| **Erreur CSP (Security)** | Manque d'autorisation pour les sources externes (IGN). | Vérifiez que les domaines IGN sont listés dans `host_permissions` et `content_security_policy` dans `manifest.json`. |
| **Tuiles IGN ne chargent pas** | URL du service incorrecte ou maintenance IGN. | Vérifiez l'URL WMTS dans `popup.js`. Testez une URL de tuile directement dans le navigateur. |
| **Extension n'apparaît pas** | Mode développeur désactivé ou fichiers manquants. | Activez le mode développeur et vérifiez que les icônes (`icons/`) sont présentes. |

---

## 🔄 Mise à Jour ou Modification

Pour mettre à jour le code de l'extension (par exemple, après avoir modifié `popup.js` ou `styles.css`) :

1.  Modifiez les fichiers sources.
2.  Retournez sur `chrome://extensions/`.
3.  Cliquez sur le bouton **"Recharger" (🔄)** sous votre extension.
4.  Testez les modifications dans le popup.

---

# Cas où Chrome n'est pas autorisé à utiliser votre position

## 📍 Autoriser l'Accès à la Position (Réglages Système)

Pour que l'extension **"Carte Interactive IGN"** puisse utiliser le bouton **"Ma position"**, deux niveaux d'autorisation sont requis :

1.  L'autorisation du **navigateur** (Chrome) à utiliser la géolocalisation (généralement demandée au premier clic).
2.  L'autorisation du **système d'exploitation** (Windows/macOS/Linux) à accorder l'accès à Chrome.

Si le bouton "Ma position" ne fonctionne pas et que vous recevez un message d'erreur de permission, vous devez vérifier les paramètres de votre machine.

---

### 1. Sur Windows 🖥️

1.  Ouvrez les **Paramètres** de Windows (touche Windows + `I`).
2.  Allez dans la section **Confidentialité et sécurité**.
3.  Dans le menu de gauche, sélectionnez **Localisation** (ou **Emplacement**).
4.  Assurez-vous que l'option **"Accès à la localisation"** ou **"Service de localisation"** est **Activée**.
5.  Faites défiler jusqu'à la liste **"Autoriser les applications à accéder à votre localisation"**.
6.  Vérifiez que **Google Chrome** figure dans la liste et que l'interrupteur est **Activé**.

---

### 2. Sur macOS 🍎

1.  Ouvrez les **Réglages Système** (via le menu Apple ).
2.  Cliquez sur **Confidentialité et sécurité**.
3.  Sélectionnez **Service de localisation** dans la liste de gauche.
4.  Assurez-vous que le **Service de localisation** général est **Activé**.
5.  Faites défiler la liste des applications et assurez-vous que la case à côté de **Google Chrome** est **cochée**.
6.  Redémarrez Chrome pour appliquer les changements.

---

### 3. Dans Chrome (Réglages de l'Extension) 🔒

Même si le système autorise Chrome, vous devez vous assurer que Chrome autorise l'extension :

1.  Ouvrez le **popup de l'extension** en cliquant sur son icône.
2.  Cliquez sur le bouton **"Ma position"** pour déclencher la demande.
3.  Si une petite icône **cadenas (🔒)** ou une icône **viseur (🎯)** apparaît dans la barre d'adresse de Chrome, cliquez dessus.
4.  Dans le menu contextuel, assurez-vous que le paramètre **"Position"** est réglé sur **"Autoriser"** ou **"Demander (par défaut)"**.

> **Note :** Si l'accès à la position a été refusé de manière permanente, vous pourriez devoir supprimer le marqueur de refus dans les réglages de Chrome pour que l'invite d'autorisation réapparaisse.
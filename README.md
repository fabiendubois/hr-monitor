# HR Monitor Pro

Une application web moderne pour visualiser votre fréquence cardiaque en temps réel à l'aide de l'API Web Bluetooth. Connectez votre ceinture cardio ou votre montre compatible et suivez vos performances directement dans votre navigateur.

## 🚀 Fonctionnalités

- **Connexion Bluetooth Low Energy (BLE)** : Connectez facilement vos appareils de fréquence cardiaque compatibles (ceintures Polar, Garmin, montres connectées, etc.).
- **Visualisation en Temps Réel** : Affichage instantané de la fréquence cardiaque (BPM).
- **Zones de Fréquence Cardiaque** : Indication automatique de la zone d'effort (Zone 1 à Zone 5) avec code couleur dynamique.
- **Statistiques de Session** : Suivi des valeurs Min, Max et Moyenne de la session en cours.
- **Graphique Dynamique** : Visualisation de l'évolution de la fréquence cardiaque au fil du temps (via Chart.js).
- **Interface Responsive** : Design moderne et adapté aux mobiles et ordinateurs.

## 📋 Prérequis

Pour utiliser cette application, vous avez besoin de :

1.  **Un navigateur compatible Web Bluetooth** :
    - Google Chrome (Desktop & Android)
    - Microsoft Edge
    - Opera
    - *Note : Safari et Firefox ne supportent pas encore nativement cette fonctionnalité.*
2.  **Un appareil de mesure de fréquence cardiaque** supportant le profil Bluetooth standard "Heart Rate Service" (UUID `0x180d`).
3.  **Une connexion sécurisée (HTTPS)** : L'API Web Bluetooth ne fonctionne que sur des pages servies en HTTPS (ou sur `localhost` pour le développement).

## 🛠️ Installation et Utilisation

### En local (Développement)

1.  Clonez ce dépôt ou téléchargez les fichiers.
2.  Ouvrez le dossier du projet.
3.  Lancez un serveur local (par exemple avec l'extension "Live Server" de VS Code, ou via Python `python -m http.server`).
    - *Important : Ouvrir simplement le fichier `index.html` ne fonctionnera pas pour le Bluetooth.*
4.  Accédez à l'URL locale (ex: `http://localhost:5500`).

### Utilisation

1.  Activez le Bluetooth sur votre ordinateur ou téléphone.
2.  Mettez votre ceinture cardio ou activez le mode diffusion de votre montre.
3.  Cliquez sur le bouton **"⚡ CONNECTER"**.
4.  Sélectionnez votre appareil dans la liste qui s'affiche.
5.  Les données commenceront à s'afficher automatiquement.

## 💻 Technologies Utilisées

- **HTML5 / CSS3** : Structure et design (Police Inter, Flexbox/Grid).
- **JavaScript (Vanilla)** : Logique de l'application et gestion du Bluetooth.
- **Web Bluetooth API** : Communication avec les périphériques BLE.
- **Chart.js** : Librairie pour le graphique en temps réel.

## ⚠️ Avertissement

Cette application est fournie à titre informatif et ne constitue pas un dispositif médical. Consultez toujours un professionnel de santé avant d'entreprendre un programme d'exercice physique.

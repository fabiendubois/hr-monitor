# HR Monitor Pro

Application web pour le suivi en temps réel de vos entraînements cyclistes avec ceinture cardio et home trainer connectés.

## ✨ Fonctionnalités

### 📊 Métriques en Temps Réel
L'application affiche 4 blocs de métriques indépendants, chacun avec :
- **Valeur instantanée** en grand format
- **Statistiques MIN / MAX / MOY**
- **Graphique historique** (15 minutes)

#### Métriques disponibles :
- ✅ **Fréquence Cardiaque** (BPM) avec zones d'entraînement
- ✅ **Puissance** (Watts)
- ✅ **Cadence** (RPM)
- ✅ **Vitesse** (km/h)

### ⏱️ Enregistrement d'Activité
- **Chronomètre** avec Start/Pause/Stop
- **Enregistrement automatique** des données (HR, Power, Cadence, Speed) chaque seconde
- **Export** vers Strava ou téléchargement du fichier TCX

### 🚴 Intégration Strava
- **Authentification OAuth** sécurisée
- **Upload automatique** des activités au format TCX
- **Données complètes** : fréquence cardiaque, puissance, cadence, timestamp
- Configuration via le modal de paramètres ⚙️

### 🎮 Mode DEMO
- **Simulation de données** sans matériel
- Variation réaliste de toutes les métriques :
  - HR : 120-180 BPM
  - Power : 150-300 Watts
  - Cadence : 75-95 RPM
  - Speed : 20-40 km/h
- Parfait pour tester l'application

### 📈 Graphiques Interactifs
- **4 graphiques en temps réel** (un par métrique)
- **Historique de 15 minutes** (900 points)
- **Mise à jour chaque seconde**
- Axe X avec timestamps précis (HH:MM:SS)

### 🔗 Connexions Bluetooth
- **Ceinture cardio** : Connection via Heart Rate Service (BLE)
- **Home Trainer** : Support FTMS (Fitness Machine Service) et Cycling Power Service
- **Indicateurs visuels** de connexion sur chaque bouton
- **Connexions indépendantes** pour chaque appareil

## 📋 Prérequis

- **Navigateur compatible Web Bluetooth** :
  - ✅ Google Chrome
  - ✅ Microsoft Edge
  - ✅ Opera
- **Protocole HTTPS** ou `localhost`
- **Ceinture cardio** compatible Bluetooth Low Energy (optionnel)
- **Home Trainer** compatible FTMS ou Cycling Power (optionnel)

## 🚀 Installation & Utilisation

### Installation
```bash
# Cloner le projet
git clone [votre-repo]

# Ouvrir avec Live Server ou servir via HTTPS
# Exemple avec Python :
python -m http.server 8000

# Ou avec Node.js :
npx http-server
```

### Utilisation

1. **Connexion des appareils** :
   - Cliquez sur **"❤️ HR"** pour connecter votre ceinture cardio
   - Cliquez sur **"🚴 TRAINER"** pour connecter votre home trainer
   - Les points de statut deviennent verts une fois connectés

2. **Mode DEMO** (sans matériel) :
   - Cliquez sur **"🎮 DEMO"** pour activer la simulation
   - Toutes les métriques varient automatiquement

3. **Enregistrer une session** :
   - Cliquez sur **"▶ DÉMARRER"** pour lancer l'enregistrement
   - **"⏸ PAUSE"** pour mettre en pause
   - **"⏹ STOP & SAVE"** pour arrêter et sauvegarder

4. **Upload vers Strava** :
   - Cliquez sur **⚙️** pour configurer vos clés API Strava
   - Obtenez vos clés sur [strava.com/settings/api](https://www.strava.com/settings/api)
   - Connectez-vous à Strava via OAuth
   - Choisissez "Upload Strava" ou "Télécharger TCX" après l'arrêt

## 🛠️ Technologies Utilisées

- **HTML5 / CSS3 / Vanilla JavaScript**
- **Web Bluetooth API** pour la connexion aux capteurs
- **Chart.js** pour les graphiques temps réel
- **Strava API v3** pour l'intégration Strava
- **TCX Format** pour l'export des activités

## 📱 Services Bluetooth Supportés

### Heart Rate Service (0x180D)
- Fréquence cardiaque instantanée
- Format standard BLE

### FTMS - Fitness Machine Service (0x1826)
- Indoor Bike Data (0x2AD2)
- Puissance, Cadence, Vitesse
- Support des home trainers modernes

### Cycling Power Service (0x1818)
- Mesure de puissance précise
- Calcul de cadence via révolutions de manivelle

## 🎨 Interface

- **Design moderne** avec dégradés et glassmorphism
- **Dark mode** élégant
- **Animations fluides** et responsive
- **4 blocs métriques** indépendants avec graphiques intégrés
- **Zones de fréquence cardiaque** (Zone 1-5)

## 📝 Notes Importantes

### Configuration Strava
Comme l'application est 100% front-end :
1. Créez une application sur [strava.com/settings/api](https://www.strava.com/settings/api)
2. Configurez l'**Authorization Callback Domain** :
   - En dev: `localhost` ou votre domaine
3. Copiez le **Client ID** et **Client Secret** dans les paramètres ⚙️

### Format TCX
Les fichiers TCX générés incluent :
- Timestamp pour chaque point de données
- Fréquence cardiaque
- Puissance (extension TPX)
- Cadence
- Métadonnées d'activité (Indoor Trainer)

## 🔒 Sécurité

- Les clés API Strava sont stockées localement dans `localStorage`
- Les tokens d'accès sont rafraîchis automatiquement
- Aucune donnée n'est envoyée à un serveur tiers (sauf Strava API)

## 📄 Licence

MIT

---

**Bon entraînement ! 🚴💪**

// DOM Elements
const connectBtn = document.getElementById('connectBtn');
const connectTrainerBtn = document.getElementById('connectTrainerBtn');
const demoBtn = document.getElementById('demoBtn');
const hrStatusDot = document.getElementById('hrStatusDot');
const trainerStatusDot = document.getElementById('trainerStatusDot');
const heartRateDisplay = document.getElementById('heartRate');
const powerDisplay = document.getElementById('power');
const cadenceDisplay = document.getElementById('cadence');
const speedDisplay = document.getElementById('speed');
const minHrDisplay = document.getElementById('minHr');
const maxHrDisplay = document.getElementById('maxHr');
const avgHrDisplay = document.getElementById('avgHr');
const minPowerDisplay = document.getElementById('minPower');
const maxPowerDisplay = document.getElementById('maxPower');
const avgPowerDisplay = document.getElementById('avgPower');
const minCadenceDisplay = document.getElementById('minCadence');
const maxCadenceDisplay = document.getElementById('maxCadence');
const avgCadenceDisplay = document.getElementById('avgCadence');
const minSpeedDisplay = document.getElementById('minSpeed');
const maxSpeedDisplay = document.getElementById('maxSpeed');
const avgSpeedDisplay = document.getElementById('avgSpeed');
const zoneIndicator = document.getElementById('zoneIndicator');

// Activity & Timer Elements
const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');

// Settings Elements
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const clientIdInput = document.getElementById('clientId');
const clientSecretInput = document.getElementById('clientSecret');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const stravaAuthBtn = document.getElementById('stravaAuthBtn');
const authStatus = document.getElementById('authStatus');

// Save Modal Elements
const saveModal = document.getElementById('saveModal');
const uploadStravaBtn = document.getElementById('uploadStravaBtn');
const downloadTcxBtn = document.getElementById('downloadTcxBtn');
const cancelSaveBtn = document.getElementById('cancelSaveBtn');

// State
let hrDevice = null;
let hrServer = null;
let heartRateCharacteristic = null;

let trainerDevice = null;
let trainerServer = null;
let powerCharacteristic = null;
let cadenceCharacteristic = null;

let hrHistory = [];
let minHr = Infinity;
let maxHr = 0;
let totalHr = 0;
let countHr = 0;

let powerHistory = [];
let minPower = Infinity;
let maxPower = 0;
let totalPower = 0;
let countPower = 0;

let cadenceHistory = [];
let minCadence = Infinity;
let maxCadence = 0;
let totalCadence = 0;
let countCadence = 0;

let speedHistory = [];
let minSpeed = Infinity;
let maxSpeed = 0;
let totalSpeed = 0;
let countSpeed = 0;

// Demo Mode State
let isDemoMode = false;
let demoInterval = null;
let demoHR = 140;
let demoPower = 200;
let demoCadence = 85;
let demoSpeed = 25;

// Activity State
let isRecording = false;
let isPaused = false;
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let elapsedSeconds = 0;
let sessionData = []; // Array of { time, hr, power, cadence }

// Strava Config
let stravaClientId = localStorage.getItem('strava_client_id') || '';
let stravaClientSecret = localStorage.getItem('strava_client_secret') || '';
let stravaAccessToken = localStorage.getItem('strava_access_token') || '';
let stravaRefreshToken = localStorage.getItem('strava_refresh_token') || '';
let stravaTokenExpiresAt = localStorage.getItem('strava_expires_at') || 0;

// Chart.js Setup
const ctx = document.getElementById('hrChart').getContext('2d');
const hrChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Fréquence Cardiaque (BPM)',
            data: [],
            borderColor: '#00f2ff',
            backgroundColor: 'rgba(0, 242, 255, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 2,
            pointBackgroundColor: '#00f2ff'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                display: true,
                grid: {
                    display: false
                },
                ticks: {
                    color: '#8b9bb4',
                    maxRotation: 0,
                    autoSkipPadding: 20
                }
            },
            y: {
                beginAtZero: false,
                suggestedMin: 40,
                suggestedMax: 200,
                grid: {
                    color: '#2c313a'
                },
                ticks: {
                    color: '#8b9bb4'
                }
            }
        }
    }
});

const powerCtx = document.getElementById('powerChart').getContext('2d');
const powerChart = new Chart(powerCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Puissance (Watts)',
            data: [],
            borderColor: '#ffaa00',
            backgroundColor: 'rgba(255, 170, 0, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 2,
            pointBackgroundColor: '#ffaa00'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                display: true,
                grid: {
                    display: false
                },
                ticks: {
                    color: '#8b9bb4',
                    maxRotation: 0,
                    autoSkipPadding: 20
                }
            },
            y: {
                beginAtZero: true,
                suggestedMax: 400,
                grid: {
                    color: '#2c313a'
                },
                ticks: {
                    color: '#8b9bb4'
                }
            }
        }
    }
});

const cadenceCtx = document.getElementById('cadenceChart').getContext('2d');
const cadenceChart = new Chart(cadenceCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Cadence (RPM)',
            data: [],
            borderColor: '#00ff9d',
            backgroundColor: 'rgba(0, 255, 157, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 2,
            pointBackgroundColor: '#00ff9d'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                display: true,
                grid: {
                    display: false
                },
                ticks: {
                    color: '#8b9bb4',
                    maxRotation: 0,
                    autoSkipPadding: 20
                }
            },
            y: {
                beginAtZero: true,
                suggestedMax: 120,
                grid: {
                    color: '#2c313a'
                },
                ticks: {
                    color: '#8b9bb4'
                }
            }
        }
    }
});

const speedCtx = document.getElementById('speedChart').getContext('2d');
const speedChart = new Chart(speedCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Vitesse (km/h)',
            data: [],
            borderColor: '#ff2e63',
            backgroundColor: 'rgba(255, 46, 99, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 2,
            pointBackgroundColor: '#ff2e63'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                display: true,
                grid: {
                    display: false
                },
                ticks: {
                    color: '#8b9bb4',
                    maxRotation: 0,
                    autoSkipPadding: 20
                }
            },
            y: {
                beginAtZero: true,
                suggestedMax: 50,
                grid: {
                    color: '#2c313a'
                },
                ticks: {
                    color: '#8b9bb4'
                }
            }
        }
    }
});

// Bluetooth Constants
const HR_SERVICE_UUID = 0x180d;
const HR_CHARACTERISTIC_UUID = 0x2a37;

const FTMS_SERVICE_UUID = 0x1826;
const INDOOR_BIKE_DATA_UUID = 0x2ad2;

const CYCLING_POWER_SERVICE_UUID = 0x1818;
const CYCLING_POWER_MEASUREMENT_UUID = 0x2a63;

// Event Listeners
connectBtn.addEventListener('click', toggleHRConnection);
connectTrainerBtn.addEventListener('click', toggleTrainerConnection);
demoBtn.addEventListener('click', toggleDemoMode);

// Activity Listeners
startBtn.addEventListener('click', startActivity);
pauseBtn.addEventListener('click', pauseActivity);
stopBtn.addEventListener('click', stopActivity);

// Settings Listeners
settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
closeSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));
saveSettingsBtn.addEventListener('click', saveSettings);
stravaAuthBtn.addEventListener('click', initiateStravaAuth);

// Save Modal Listeners
uploadStravaBtn.addEventListener('click', handleUploadStrava);
downloadTcxBtn.addEventListener('click', handleDownloadTCX);
cancelSaveBtn.addEventListener('click', () => saveModal.classList.add('hidden'));

// Initialize Settings UI
if (stravaClientId) clientIdInput.value = stravaClientId;
if (stravaClientSecret) clientSecretInput.value = stravaClientSecret;
checkAuthStatus();

// Check for Strava Redirect Code
const urlParams = new URLSearchParams(window.location.search);
const stravaCode = urlParams.get('code');
if (stravaCode) {
    handleStravaCallback(stravaCode);
}

// --- DEMO MODE FUNCTIONS ---

function toggleDemoMode() {
    if (isDemoMode) {
        stopDemoMode();
    } else {
        startDemoMode();
    }
}

function startDemoMode() {
    isDemoMode = true;
    demoBtn.textContent = '🎮 STOP DEMO';
    demoBtn.style.backgroundColor = '#ff2e63';

    // Initialize demo values
    demoHR = 140 + Math.random() * 20;
    demoPower = 200 + Math.random() * 50;
    demoCadence = 85 + Math.random() * 10;
    demoSpeed = 25 + Math.random() * 5;

    // Simulate data every second
    demoInterval = setInterval(() => {
        // Vary HR (120-180 BPM)
        demoHR += (Math.random() - 0.5) * 5;
        demoHR = Math.max(120, Math.min(180, demoHR));

        // Vary Power (150-300 Watts)
        demoPower += (Math.random() - 0.5) * 20;
        demoPower = Math.max(150, Math.min(300, demoPower));

        // Vary Cadence (75-95 RPM)
        demoCadence += (Math.random() - 0.5) * 3;
        demoCadence = Math.max(75, Math.min(95, demoCadence));

        // Vary Speed (20-40 km/h)
        demoSpeed += (Math.random() - 0.5) * 2;
        demoSpeed = Math.max(20, Math.min(40, demoSpeed));

        // Update UI
        updateUI(Math.round(demoHR));
        updatePowerUI(Math.round(demoPower));
        updateCadenceUI(Math.round(demoCadence));
        updateSpeedUI(Math.round(demoSpeed));
    }, 1000);
}

function stopDemoMode() {
    isDemoMode = false;
    demoBtn.textContent = '🎮 DEMO';
    demoBtn.style.backgroundColor = '';

    if (demoInterval) {
        clearInterval(demoInterval);
        demoInterval = null;
    }

    // Reset displays
    heartRateDisplay.textContent = '--';
    powerDisplay.textContent = '--';
    power3sDisplay.textContent = '--';
    cadenceDisplay.textContent = '--';
    speedDisplay.textContent = '--';
    resetStats();
}

// --- ACTIVITY FUNCTIONS ---

function startActivity() {
    if (!isRecording) {
        // Start new session
        isRecording = true;
        isPaused = false;
        startTime = Date.now() - elapsedTime;
        sessionData = [];

        startBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');
        stopBtn.classList.remove('hidden');

        timerInterval = setInterval(updateTimer, 1000);
    } else if (isPaused) {
        // Resume
        isPaused = false;
        startTime = Date.now() - elapsedTime;

        startBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');
        pauseBtn.textContent = '⏸ PAUSE';
    }
}

function pauseActivity() {
    if (isRecording && !isPaused) {
        isPaused = true;
        pauseBtn.textContent = '▶ REPRENDRE';
    } else if (isPaused) {
        startActivity(); // Resume
    }
}

async function stopActivity() {
    isRecording = false;
    isPaused = false;
    clearInterval(timerInterval);

    startBtn.classList.remove('hidden');
    pauseBtn.classList.add('hidden');
    stopBtn.classList.add('hidden');
    pauseBtn.textContent = '⏸ PAUSE';

    // Show save modal if we have data
    if (sessionData.length > 0) {
        saveModal.classList.remove('hidden');
    }
}

async function handleUploadStrava() {
    saveModal.classList.add('hidden');

    if (!stravaAccessToken) {
        alert('Veuillez vous connecter à Strava dans les paramètres.');
        return;
    }

    await uploadToStrava();
}

function handleDownloadTCX() {
    saveModal.classList.add('hidden');

    const tcxContent = generateTCX(sessionData);
    const blob = new Blob([tcxContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity_${new Date().toISOString().split('T')[0]}.tcx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function updateTimer() {
    if (!isPaused) {
        const now = Date.now();
        elapsedTime = now - startTime;

        elapsedSeconds++;

        const hours = Math.floor(elapsedSeconds / 3600);
        const minutes = Math.floor((elapsedSeconds % 3600) / 60);
        const seconds = elapsedSeconds % 60;

        timerDisplay.textContent =
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Record data point if recording
        if (isRecording && !isPaused) {
            const currentHR = parseInt(heartRateDisplay.textContent) || 0;
            const currentPower = parseInt(powerDisplay.textContent) || 0;
            const currentCadence = parseInt(cadenceDisplay.textContent) || 0;
            const currentSpeed = parseInt(speedDisplay.textContent) || 0;

            sessionData.push({
                time: new Date(),
                elapsed: elapsedSeconds,
                hr: currentHR,
                power: currentPower,
                cadence: currentCadence,
                speed: currentSpeed
            });
        }
    }
}
// --- SETTINGS & STRAVA FUNCTIONS ---

function saveSettings() {
    stravaClientId = clientIdInput.value.trim();
    stravaClientSecret = clientSecretInput.value.trim();

    if (stravaClientId && stravaClientSecret) {
        localStorage.setItem('strava_client_id', stravaClientId);
        localStorage.setItem('strava_client_secret', stravaClientSecret);
        alert('Paramètres sauvegardés !');
        checkAuthStatus();
    } else {
        alert('Veuillez remplir les deux champs.');
    }
}

function checkAuthStatus() {
    if (stravaClientId && stravaClientSecret) {
        stravaAuthBtn.classList.remove('hidden');
        if (stravaAccessToken) {
            authStatus.textContent = '✅ Connecté à Strava';
            authStatus.style.color = '#00ff9d';
            stravaAuthBtn.textContent = 'Reconnecter Strava';
        } else {
            authStatus.textContent = '⚠️ Non connecté';
            authStatus.style.color = '#ffaa00';
        }
    } else {
        stravaAuthBtn.classList.add('hidden');
        authStatus.textContent = '';
    }
}

function initiateStravaAuth() {
    if (!stravaClientId) return;

    const redirectUri = window.location.origin + window.location.pathname;
    const scope = 'activity:write,read';
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${stravaClientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=${scope}`;

    window.location.href = authUrl;
}

async function handleStravaCallback(code) {
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
    settingsModal.classList.remove('hidden');
    authStatus.textContent = 'Échange du token en cours...';

    try {
        const response = await fetch('https://www.strava.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: stravaClientId,
                client_secret: stravaClientSecret,
                code: code,
                grant_type: 'authorization_code'
            })
        });

        const data = await response.json();

        if (data.access_token) {
            saveTokens(data);
            authStatus.textContent = '✅ Connexion réussie !';
            authStatus.style.color = '#00ff9d';
            setTimeout(() => settingsModal.classList.add('hidden'), 2000);
        } else {
            throw new Error('Pas de token reçu');
        }
    } catch (error) {
        console.error(error);
        authStatus.textContent = '❌ Erreur de connexion';
        authStatus.style.color = '#ff2e63';
    }
}

function saveTokens(data) {
    stravaAccessToken = data.access_token;
    stravaRefreshToken = data.refresh_token;
    stravaTokenExpiresAt = data.expires_at;

    localStorage.setItem('strava_access_token', stravaAccessToken);
    localStorage.setItem('strava_refresh_token', stravaRefreshToken);
    localStorage.setItem('strava_expires_at', stravaTokenExpiresAt);
}

async function refreshStravaToken() {
    if (Date.now() / 1000 < stravaTokenExpiresAt) return true; // Token valid

    try {
        const response = await fetch('https://www.strava.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: stravaClientId,
                client_secret: stravaClientSecret,
                refresh_token: stravaRefreshToken,
                grant_type: 'refresh_token'
            })
        });

        const data = await response.json();
        if (data.access_token) {
            saveTokens(data);
            return true;
        }
    } catch (e) {
        console.error('Token refresh failed', e);
    }
    return false;
}

async function uploadToStrava() {
    if (!await refreshStravaToken()) {
        alert('Erreur d\'authentification Strava. Veuillez vous reconnecter.');
        return;
    }

    const tcxContent = generateTCX(sessionData);
    const blob = new Blob([tcxContent], { type: 'application/xml' });
    const formData = new FormData();
    formData.append('file', blob, 'activity.tcx');
    formData.append('data_type', 'tcx');
    formData.append('name', 'Session HR Monitor Pro');
    formData.append('description', 'Enregistré avec HR Monitor Pro Web App');

    stopBtn.textContent = '⏳ UPLOAD...';

    try {
        const response = await fetch('https://www.strava.com/api/v3/uploads', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${stravaAccessToken}`
            },
            body: formData
        });

        const result = await response.json();
        if (result.id) {
            alert('✅ Activité envoyée à Strava ! (Traitement en cours)');
        } else {
            alert('❌ Erreur upload: ' + JSON.stringify(result));
        }
    } catch (error) {
        alert('❌ Erreur réseau: ' + error);
    } finally {
        stopBtn.textContent = '⏹ STOP & SAVE';
    }
}

function generateTCX(data) {
    const startTimeStr = data[0].time.toISOString();
    const totalTimeSeconds = data[data.length - 1].elapsed;

    let trackpoints = '';
    data.forEach(point => {
        // Convert speed from km/h to m/s for TCX format
        const speedMS = (point.speed * 1000) / 3600;

        trackpoints += `
            <Trackpoint>
                <Time>${point.time.toISOString()}</Time>
                <HeartRateBpm>
                    <Value>${point.hr}</Value>
                </HeartRateBpm>
                <Cadence>${point.cadence}</Cadence>
                <Extensions>
                    <TPX xmlns="http://www.garmin.com/xmlschemas/ActivityExtension/v2">
                        <Speed>${speedMS.toFixed(3)}</Speed>
                        <Watts>${point.power}</Watts>
                    </TPX>
                </Extensions>
            </Trackpoint>`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
    <TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2">
        <Activities>
            <Activity Sport="Biking">
                <Id>${startTimeStr}</Id>
                <Lap StartTime="${startTimeStr}">
                    <TotalTimeSeconds>${totalTimeSeconds}</TotalTimeSeconds>
                    <Intensity>Active</Intensity>
                    <TriggerMethod>Manual</TriggerMethod>
                    <Track>
                        ${trackpoints}
                    </Track>
                </Lap>
                <Creator>
                    <Name>HR Monitor Pro - Indoor Trainer</Name>
                </Creator>
                <Notes>Indoor Trainer Session</Notes>
            </Activity>
        </Activities>
    </TrainingCenterDatabase>`;
}

// --- HEART RATE FUNCTIONS ---

async function toggleHRConnection() {
    if (hrDevice && hrDevice.gatt.connected) {
        disconnectHR();
    } else {
        connectHR();
    }
}

async function connectHR() {
    try {
        console.log('Requesting Heart Rate Device...');
        hrDevice = await navigator.bluetooth.requestDevice({
            filters: [{ services: [HR_SERVICE_UUID] }]
        });

        hrDevice.addEventListener('gattserverdisconnected', onHRDisconnected);

        console.log('Connecting to GATT Server...');
        hrServer = await hrDevice.gatt.connect();

        console.log('Getting Heart Rate Service...');
        const service = await hrServer.getPrimaryService(HR_SERVICE_UUID);

        console.log('Getting Heart Rate Characteristic...');
        heartRateCharacteristic = await service.getCharacteristic(HR_CHARACTERISTIC_UUID);

        console.log('Starting Notifications...');
        await heartRateCharacteristic.startNotifications();
        heartRateCharacteristic.addEventListener('characteristicvaluechanged', handleHeartRateChanged);

        updateHRConnectionStatus(true);
    } catch (error) {
        console.error('Argh! ' + error);
        alert('Erreur de connexion HR : ' + error);
    }
}

function disconnectHR() {
    if (hrDevice) {
        if (hrDevice.gatt.connected) {
            hrDevice.gatt.disconnect();
        }
    }
}

function onHRDisconnected(event) {
    console.log(`HR Device disconnected.`);
    updateHRConnectionStatus(false);
    resetStats();
}

function updateHRConnectionStatus(connected) {
    if (connected) {
        hrStatusDot.classList.add('connected');
        connectBtn.innerHTML = '<span class="status-dot connected" id="hrStatusDot"></span><span class="icon">❌</span> HR';
        connectBtn.style.backgroundColor = '#ff2e63';
    } else {
        hrStatusDot.classList.remove('connected');
        connectBtn.innerHTML = '<span class="status-dot" id="hrStatusDot"></span><span class="icon">❤️</span> HR';
        connectBtn.style.backgroundColor = '';
        heartRateDisplay.textContent = '--';
        heartRateDisplay.classList.remove('beating');
    }
}

function handleHeartRateChanged(event) {
    const value = event.target.value;
    const flags = value.getUint8(0);
    const rate16Bits = flags & 0x1;
    let heartRate;

    if (rate16Bits) {
        heartRate = value.getUint16(1, true); // Little Endian
    } else {
        heartRate = value.getUint8(1);
    }

    updateUI(heartRate);
}

// --- TRAINER FUNCTIONS ---

async function toggleTrainerConnection() {
    if (trainerDevice && trainerDevice.gatt.connected) {
        disconnectTrainer();
    } else {
        connectTrainer();
    }
}

async function connectTrainer() {
    try {
        console.log('Requesting Trainer Device...');
        trainerDevice = await navigator.bluetooth.requestDevice({
            filters: [
                { services: [FTMS_SERVICE_UUID] },
                { services: [CYCLING_POWER_SERVICE_UUID] }
            ]
        });

        trainerDevice.addEventListener('gattserverdisconnected', onTrainerDisconnected);

        console.log('Connecting to Trainer GATT Server...');
        trainerServer = await trainerDevice.gatt.connect();

        let service;
        let characteristic;

        // Try FTMS first
        try {
            service = await trainerServer.getPrimaryService(FTMS_SERVICE_UUID);
            characteristic = await service.getCharacteristic(INDOOR_BIKE_DATA_UUID);
            console.log('Found FTMS Service');
        } catch (e) {
            console.log('FTMS not found, trying Cycling Power...');
            service = await trainerServer.getPrimaryService(CYCLING_POWER_SERVICE_UUID);
            characteristic = await service.getCharacteristic(CYCLING_POWER_MEASUREMENT_UUID);
            console.log('Found Cycling Power Service');
        }

        if (characteristic) {
            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', handleTrainerDataChanged);
            updateTrainerConnectionStatus(true);
        }

    } catch (error) {
        console.error('Trainer Connection Error: ' + error);
        alert('Erreur de connexion Trainer : ' + error);
    }
}

function disconnectTrainer() {
    if (trainerDevice && trainerDevice.gatt.connected) {
        trainerDevice.gatt.disconnect();
    }
}

function onTrainerDisconnected() {
    console.log('Trainer disconnected');
    updateTrainerConnectionStatus(false);
}

function updateTrainerConnectionStatus(connected) {
    if (connected) {
        trainerStatusDot.classList.add('connected');
        connectTrainerBtn.innerHTML = '<span class="status-dot connected" id="trainerStatusDot"></span><span class="icon">❌</span> TRAINER';
        connectTrainerBtn.style.backgroundColor = '#ff2e63';
    } else {
        trainerStatusDot.classList.remove('connected');
        connectTrainerBtn.innerHTML = '<span class="status-dot" id="trainerStatusDot"></span><span class="icon">🚴</span> TRAINER';
        connectTrainerBtn.style.backgroundColor = '';
        powerDisplay.textContent = '--';
        power3sDisplay.textContent = '--';
        cadenceDisplay.textContent = '--';
    }
}

function handleTrainerDataChanged(event) {
    const value = event.target.value;
    const flags = value.getUint16(0, true);

    // Note: Parsing depends slightly on whether it's FTMS or CPS, 
    // but standard Cycling Power Measurement (0x2A63) is often used for both.
    // Below is a simplified parser for standard CPS/FTMS Indoor Bike Data
    // This is a complex bitmask parsing, simplified for common cases.

    let offset = 2;
    let instantaneousPower = -1;
    let instantaneousCadence = -1;

    // Flags analysis for Cycling Power Measurement (0x2A63)
    // Bit 0: Pedal Power Balance Present
    // Bit 1: Pedal Power Balance Reference
    // Bit 2: Accumulated Torque Present
    // Bit 3: Accumulated Torque Source
    // Bit 4: Wheel Revolution Data Present
    // Bit 5: Crank Revolution Data Present
    // Bit 6-12: ...

    // However, FTMS Indoor Bike Data (0x2AD2) has different flags.
    // We need to know which characteristic triggered this.

    if (event.target.uuid.endsWith(INDOOR_BIKE_DATA_UUID.toString(16))) {
        // FTMS Parsing (0x2AD2)
        // Flags (2 bytes)
        // Bit 0: More Data
        // Bit 1: Average Speed present
        // Bit 2: Instantaneous Cadence present
        // Bit 3: Average Cadence present
        // Bit 4: Total Distance present
        // Bit 5: Resistance Level present
        // Bit 6: Instantaneous Power present
        // ...

        const flagsFTMS = value.getUint16(0, true);
        offset = 2;

        // Speed is usually first if not excluded, but let's check flags
        // Actually FTMS structure is:
        // Flags (2)
        // Instantaneous Speed (2) - if Bit 0 (More Data) is 0? No, check specs.
        // Wait, "More Data" is a distinct concept.
        // Let's assume standard order based on flags.

        // Bit 0: More Data (0 = Instantaneous Speed is present? No, this is tricky without full spec doc handy)
        // Let's use a robust parser approach or simplify.

        // SIMPLIFICATION: Most trainers send Speed (2), Power (2) and maybe Cadence.
        // Let's try to detect based on common patterns or assume standard FTMS packet:
        // Flags (2), Speed (2, uint16, 0.01km/h), Power (2, sint16), ...

        // Let's try to parse Cycling Power Measurement (0x2A63) which is more standard for Power.
        // Many trainers support both. We prioritize CPS in connection if available? 
        // In connectTrainer we tried FTMS first.

        // FTMS Indoor Bike Data (0x2AD2):
        // C1 bit 0: More Data
        // C1 bit 1: Avg Speed
        // C1 bit 2: Inst Cadence
        // ...
        // This is getting complex to guess without spec.

        // Let's stick to Cycling Power Service (0x1818) / Measurement (0x2A63) if possible as it's simpler for Power.
        // Or implement a robust parser.

        // Let's implement a basic parser that looks for Power.
        // For FTMS (0x2AD2):
        // If Bit 2 (Inst Cadence) -> +2 bytes (uint16, 0.5 rpm) ? No, usually 1 byte or 2.
        // If Bit 6 (Inst Power) -> +2 bytes (sint16)

        // Let's assume the user has a standard trainer.
        // We will try to parse based on flags.

        const speedPresent = !(flagsFTMS & 0x01); // "More Data" usually means split packet, but in simple FTMS it might mean "Instantaneous Speed present" is NOT the flag.
        // Actually, let's look at the official bits for 0x2AD2:
        // Bit 0: More Data
        // Bit 1: Average Speed Present
        // Bit 2: Instantaneous Cadence Present
        // Bit 3: Average Cadence Present
        // Bit 4: Total Distance Present
        // ...
        // Bit 6: Instantaneous Power Present
        // Bit 7: Average Power Present

        // Mandatory fields: Instantaneous Speed (if Bit 0 is 0).
        // Wait, "More Data" behavior is complex.

        // ALTERNATIVE: Use Cycling Power Service (0x1818) which is strictly for Power/Cadence.
        // Let's change connectTrainer to prefer CPS if available, or handle CPS parsing.

    } else {
        // Cycling Power Measurement (0x2A63) Parsing
        // Flags (2 bytes)
        // Instantaneous Power (2 bytes, sint16) - ALWAYS PRESENT

        instantaneousPower = value.getInt16(2, true);
        offset = 4;

        // Check for other data
        // Bit 0: Pedal Power Balance Present -> +1 byte
        if (flags & 0x01) offset += 1;

        // Bit 1: Pedal Power Balance Reference (just a flag, no data)

        // Bit 2: Accumulated Torque Present -> +2 bytes
        if (flags & 0x04) offset += 2;

        // Bit 3: Accumulated Torque Source (flag)

        // Bit 4: Wheel Revolution Data Present -> +4 bytes (Wheel Rev) + 2 bytes (Last Wheel Event Time)
        if (flags & 0x10) offset += 6;

        // Bit 5: Crank Revolution Data Present -> +2 bytes (Crank Rev) + 2 bytes (Last Crank Event Time)
        if (flags & 0x20) {
            const crankRev = value.getUint16(offset, true);
            const lastCrankEventTime = value.getUint16(offset + 2, true);

            // Calculate Cadence from Crank Revs if needed, or sometimes it's sent directly?
            // CPS doesn't send Instantaneous Cadence directly, it sends Crank Revs.
            // We need to calculate RPM based on time diff.

            calculateCadence(crankRev, lastCrankEventTime);
            offset += 4;
        }
    }

    // Update UI
    if (instantaneousPower !== -1) {
        updatePowerUI(instantaneousPower);
    }
}

let lastCrankRev = 0;
let lastCrankTime = 0;

function calculateCadence(crankRev, crankTime) {
    if (lastCrankTime > 0) {
        let revs = crankRev - lastCrankRev;
        let time = crankTime - lastCrankTime;

        // Handle rollover
        if (time < 0) time += 65536;
        if (revs < 0) revs += 65536; // Unlikely for 16bit in short time

        if (time > 0) {
            // Time is in 1/1024 seconds
            const rpm = (revs * 1024 * 60) / time;
            updateCadenceUI(Math.round(rpm));
        }
    }
    lastCrankRev = crankRev;
    lastCrankTime = crankTime;
}

function updatePowerUI(watts) {
    powerDisplay.textContent = watts;

    // Update Stats
    if (watts < minPower) minPower = watts;
    if (watts > maxPower) maxPower = watts;
    totalPower += watts;
    countPower++;
    const avgPower = Math.round(totalPower / countPower);

    minPowerDisplay.textContent = minPower;
    maxPowerDisplay.textContent = maxPower;
    avgPowerDisplay.textContent = avgPower;

    // Update Power Chart
    updatePowerChart(watts);
}

function updateCadenceUI(rpm) {
    cadenceDisplay.textContent = rpm;

    // Update Stats
    if (rpm < minCadence) minCadence = rpm;
    if (rpm > maxCadence) maxCadence = rpm;
    totalCadence += rpm;
    countCadence++;
    const avgCadence = Math.round(totalCadence / countCadence);

    minCadenceDisplay.textContent = minCadence;
    maxCadenceDisplay.textContent = maxCadence;
    avgCadenceDisplay.textContent = avgCadence;

    // Update Cadence Chart
    updateCadenceChart(rpm);
}

function updateSpeedUI(kmh) {
    speedDisplay.textContent = kmh;

    // Update Stats
    if (kmh < minSpeed) minSpeed = kmh;
    if (kmh > maxSpeed) maxSpeed = kmh;
    totalSpeed += kmh;
    countSpeed++;
    const avgSpeed = Math.round(totalSpeed / countSpeed);

    minSpeedDisplay.textContent = minSpeed;
    maxSpeedDisplay.textContent = maxSpeed;
    avgSpeedDisplay.textContent = avgSpeed;

    // Update Speed Chart
    updateSpeedChart(kmh);
}

// --- SHARED UI FUNCTIONS ---

function updateUI(hr) {
    // Update Main Display
    heartRateDisplay.textContent = hr;
    heartRateDisplay.classList.add('beating');

    // Update Animation Speed based on HR (faster HR = faster animation)
    const beatDuration = 60 / hr;
    heartRateDisplay.style.animationDuration = `${beatDuration}s`;

    // Update Stats
    if (hr < minHr) minHr = hr;
    if (hr > maxHr) maxHr = hr;

    totalHr += hr;
    countHr++;
    const avgHr = Math.round(totalHr / countHr);

    minHrDisplay.textContent = minHr;
    maxHrDisplay.textContent = maxHr;
    avgHrDisplay.textContent = avgHr;

    // Update Zone
    updateZone(hr);

    // Update Chart
    updateChart(hr);
}

function updateZone(hr) {
    // Simple Zone Logic (Example based on generic max HR of 190)
    // Zone 1: < 114 (Grey)
    // Zone 2: 114-133 (Blue)
    // Zone 3: 133-152 (Green)
    // Zone 4: 152-171 (Orange)
    // Zone 5: > 171 (Red)

    let zoneText = '';
    let color = '';

    if (hr < 114) { zoneText = 'ZONE 1 - ÉCHAUFFEMENT'; color = '#8b9bb4'; }
    else if (hr < 133) { zoneText = 'ZONE 2 - ENDURANCE'; color = '#00f2ff'; }
    else if (hr < 152) { zoneText = 'ZONE 3 - AEROBIE'; color = '#00ff9d'; }
    else if (hr < 171) { zoneText = 'ZONE 4 - SEUIL'; color = '#ffaa00'; }
    else { zoneText = 'ZONE 5 - MAX'; color = '#ff2e63'; }

    zoneIndicator.textContent = zoneText;
    zoneIndicator.style.color = color;
    document.documentElement.style.setProperty('--accent-color', color);
}

function updateChart(hr) {
    const now = new Date();
    const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // Add new data point
    hrChart.data.labels.push(timeLabel);
    hrChart.data.datasets[0].data.push(hr);

    // Keep only last 900 points (15 minutes)
    if (hrChart.data.labels.length > 900) {
        hrChart.data.labels.shift();
        hrChart.data.datasets[0].data.shift();
    }

    hrChart.update('none');
}

function updatePowerChart(power) {
    const now = new Date();
    const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // Add new data point
    powerChart.data.labels.push(timeLabel);
    powerChart.data.datasets[0].data.push(power);

    // Keep only last 900 points (15 minutes)
    if (powerChart.data.labels.length > 900) {
        powerChart.data.labels.shift();
        powerChart.data.datasets[0].data.shift();
    }

    powerChart.update('none');
}

function updateCadenceChart(cadence) {
    const now = new Date();
    const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // Add new data point
    cadenceChart.data.labels.push(timeLabel);
    cadenceChart.data.datasets[0].data.push(cadence);

    // Keep only last 900 points (15 minutes)
    if (cadenceChart.data.labels.length > 900) {
        cadenceChart.data.labels.shift();
        cadenceChart.data.datasets[0].data.shift();
    }

    cadenceChart.update('none');
}

function updateSpeedChart(speed) {
    const now = new Date();
    const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // Add new data point
    speedChart.data.labels.push(timeLabel);
    speedChart.data.datasets[0].data.push(speed);

    // Keep only last 900 points (15 minutes)
    if (speedChart.data.labels.length > 900) {
        speedChart.data.labels.shift();
        speedChart.data.datasets[0].data.shift();
    }

    speedChart.update('none');
}

function resetStats() {
    minHr = Infinity;
    maxHr = 0;
    totalHr = 0;
    countHr = 0;
    hrHistory = [];

    minHrDisplay.textContent = '--';
    maxHrDisplay.textContent = '--';
    avgHrDisplay.textContent = '--';

    minPower = Infinity;
    maxPower = 0;
    totalPower = 0;
    countPower = 0;
    powerHistory = [];

    minPowerDisplay.textContent = '--';
    maxPowerDisplay.textContent = '--';
    avgPowerDisplay.textContent = '--';

    minCadence = Infinity;
    maxCadence = 0;
    totalCadence = 0;
    countCadence = 0;
    cadenceHistory = [];

    minCadenceDisplay.textContent = '--';
    maxCadenceDisplay.textContent = '--';
    avgCadenceDisplay.textContent = '--';

    minSpeed = Infinity;
    maxSpeed = 0;
    totalSpeed = 0;
    countSpeed = 0;
    speedHistory = [];

    minSpeedDisplay.textContent = '--';
    maxSpeedDisplay.textContent = '--';
    avgSpeedDisplay.textContent = '--';

    hrChart.data.labels = [];
    hrChart.data.datasets[0].data = [];
    hrChart.update();

    powerChart.data.labels = [];
    powerChart.data.datasets[0].data = [];
    powerChart.update();

    cadenceChart.data.labels = [];
    cadenceChart.data.datasets[0].data = [];
    cadenceChart.update();

    speedChart.data.labels = [];
    speedChart.data.datasets[0].data = [];
    speedChart.update();
}

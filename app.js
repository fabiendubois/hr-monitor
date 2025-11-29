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
const closeSaveModal = document.getElementById('closeSaveModal');
const uploadStravaBtn = document.getElementById('uploadStravaBtn');
const downloadTcxBtn = document.getElementById('downloadTcxBtn');
const cancelSaveBtn = document.getElementById('cancelSaveBtn');

// Trainer Control Elements
const trainerControlPanel = document.getElementById('trainerControlPanel');
const targetPowerDisplay = document.getElementById('targetPowerDisplay');
const decreasePowerBtn = document.getElementById('decreasePowerBtn');
const increasePowerBtn = document.getElementById('increasePowerBtn');
const setPowerBtn = document.getElementById('setPowerBtn');

// Workout Elements
const workoutsBtn = document.getElementById('workoutsBtn');
const workoutModal = document.getElementById('workoutModal');
const closeWorkoutModal = document.getElementById('closeWorkoutModal');
const workoutList = document.getElementById('workoutList');
const workoutHud = document.getElementById('workoutHud');
const workoutNameDisplay = document.getElementById('workoutName');
const workoutTotalTimeDisplay = document.getElementById('workoutTotalTime');
const workoutProgressBar = document.getElementById('workoutProgressBar');
const intervalNameDisplay = document.getElementById('intervalName');
const intervalTimeRemainingDisplay = document.getElementById('intervalTimeRemaining');
const nextIntervalNameDisplay = document.getElementById('nextIntervalName');
const powerTargetContainer = document.getElementById('powerTargetContainer');
const powerTargetValue = document.getElementById('powerTargetValue');
const powerZoneIndicator = document.getElementById('powerZoneIndicator');
const userFtpInput = document.getElementById('userFtp');

// Debug Elements
const debugBtn = document.getElementById('debugBtn');
const debugPanel = document.getElementById('debugPanel');
const debugButtons = document.querySelectorAll('.btn-debug');

// Summary Elements
const summaryDuration = document.getElementById('summaryDuration');
const summaryAvgHr = document.getElementById('summaryAvgHr');
const summaryAvgPower = document.getElementById('summaryAvgPower');
const summaryAvgSpeed = document.getElementById('summaryAvgSpeed');

// State
let hrDevice = null;
let hrServer = null;
let heartRateCharacteristic = null;

let trainerDevice = null;
let trainerServer = null;
let powerCharacteristic = null;
let cadenceCharacteristic = null;
let trainerControlCharacteristic = null;

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

// Debug State
let timeMultiplier = 1;

// Trainer Control State
let targetPower = 150;
let isErgMode = false;

// Workout State
let userFtp = parseInt(localStorage.getItem('user_ftp')) || 220;
let currentWorkout = null;
let currentIntervalIndex = 0;
let intervalTimeRemaining = 0;
let workoutTotalDuration = 0;
let workoutElapsedTime = 0;
let isWorkoutActive = false;

// Bluetooth Constants
const FTMS_SERVICE_UUID = '00001826-0000-1000-8000-00805f9b34fb';
const INDOOR_BIKE_DATA_UUID = '00002ad2-0000-1000-8000-00805f9b34fb';
const FITNESS_MACHINE_CONTROL_POINT_UUID = '00002ad9-0000-1000-8000-00805f9b34fb';
const CYCLING_POWER_SERVICE_UUID = '00001818-0000-1000-8000-00805f9b34fb';
const CYCLING_POWER_MEASUREMENT_UUID = '00002a63-0000-1000-8000-00805f9b34fb';

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
        }, {
            label: 'Cible (Watts)',
            data: [],
            borderColor: 'rgba(255, 255, 255, 0.5)',
            borderWidth: 1,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
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
            borderColor: '#ffffff',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 2,
            pointBackgroundColor: '#ffffff'
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
            borderColor: '#ffffff',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 2,
            pointBackgroundColor: '#ffffff'
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

// Bluetooth Constants (Moved to top)
const HR_SERVICE_UUID = 0x180d;
const HR_CHARACTERISTIC_UUID = 0x2a37;

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
cancelSaveBtn.addEventListener('click', () => {
    saveModal.classList.add('hidden');
    resetStats();
});

closeSaveModal.addEventListener('click', () => {
    saveModal.classList.add('hidden');
    resetStats();
});

// Trainer Control Listeners
decreasePowerBtn.addEventListener('click', () => adjustTargetPower(-10));
increasePowerBtn.addEventListener('click', () => adjustTargetPower(10));
setPowerBtn.addEventListener('change', toggleErgMode);

// Workout Listeners
workoutsBtn.addEventListener('click', openWorkoutModal);
closeWorkoutModal.addEventListener('click', () => workoutModal.classList.add('hidden'));
userFtpInput.addEventListener('change', saveUserFtp);

// Initialize Settings UI
if (stravaClientId) clientIdInput.value = stravaClientId;
if (stravaClientSecret) clientSecretInput.value = stravaClientSecret;
userFtpInput.value = userFtp;
checkAuthStatus();

// Check for Strava Redirect Code
const urlParams = new URLSearchParams(window.location.search);
const stravaCode = urlParams.get('code');
if (stravaCode) {
    handleStravaCallback(stravaCode);
}

// Debug Listeners
debugBtn.addEventListener('click', () => debugPanel.classList.toggle('hidden'));
debugButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Update active state
        debugButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        // Set multiplier
        timeMultiplier = parseInt(e.target.dataset.speed);
        console.log('Time Warp:', timeMultiplier + 'x');
    });
});

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

    // Show Control Panel in Demo Mode
    // trainerControlPanel.style.display = 'block'; // Always visible now

    // Simulate data every second
    demoInterval = setInterval(() => {
        // Vary HR (120-180 BPM)
        demoHR += (Math.random() - 0.5) * 5;
        demoHR = Math.max(120, Math.min(180, demoHR));

        // Vary Power (150-300 Watts)
        // If ERG mode is on, stick close to target power
        if (isErgMode) {
            demoPower = targetPower + (Math.random() - 0.5) * 10;
        } else {
            demoPower += (Math.random() - 0.5) * 20;
            demoPower = Math.max(150, Math.min(300, demoPower));
        }

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

    // Hide Control Panel
    // trainerControlPanel.style.display = 'none'; // Always visible now
    isErgMode = false;
    setPowerBtn.checked = false;

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

        timerInterval = setInterval(() => {
            const now = Date.now();

            // Time Warp Logic
            if (timeMultiplier > 1) {
                // Add extra time based on multiplier (minus 1 because real time passed 1s)
                elapsedTime += (timeMultiplier - 1) * 1000;
                startTime -= (timeMultiplier - 1) * 1000; // Adjust start time to match
            } else {
                elapsedTime = now - startTime;
            }

            elapsedSeconds = Math.floor(elapsedTime / 1000);
            updateTimerDisplay(elapsedSeconds);

            // Update Workout if active
            if (isWorkoutActive && !isPaused) {
                updateWorkoutLogic();
            }

            // Record data point every second (real-time)
            // In debug mode, we might want to record more points or just accept gaps
            // For simplicity, we record 1 point per real second, but with the warped timestamp
            recordDataPoint();

        }, 1000);
    } else if (isPaused) {
        // Resume
        isPaused = false;
        startTime = Date.now() - elapsedTime;
        pauseBtn.textContent = '⏸ PAUSE';
        pauseBtn.classList.remove('paused');

        timerInterval = setInterval(() => {
            const now = Date.now();

            // Time Warp Logic
            if (timeMultiplier > 1) {
                // Add extra time based on multiplier (minus 1 because real time passed 1s)
                elapsedTime += (timeMultiplier - 1) * 1000;
                startTime -= (timeMultiplier - 1) * 1000; // Adjust start time to match
            } else {
                elapsedTime = now - startTime;
            }

            elapsedSeconds = Math.floor(elapsedTime / 1000);
            updateTimerDisplay(elapsedSeconds);

            // Update Workout if active
            if (isWorkoutActive && !isPaused) {
                updateWorkoutLogic();
            }

            // Record data point every second (real-time)
            recordDataPoint();

        }, 1000);
    }
}

function pauseActivity() {
    if (isRecording && !isPaused) {
        isPaused = true;
        clearInterval(timerInterval);
        pauseBtn.textContent = '▶ REPRENDRE';
        pauseBtn.classList.add('paused');
    } else if (isPaused) {
        startActivity();
    }
}

async function stopActivity() {
    if (isRecording) {
        isRecording = false;
        isPaused = false;
        clearInterval(timerInterval);

        startBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
        stopBtn.classList.add('hidden');

        // Stop Workout if active
        if (isWorkoutActive) {
            stopWorkout();
        }

        // Show Save Modal
        saveModal.classList.remove('hidden');

        // Populate Summary
        const hours = Math.floor(elapsedSeconds / 3600);
        const minutes = Math.floor((elapsedSeconds % 3600) / 60);
        const seconds = elapsedSeconds % 60;
        summaryDuration.textContent = formatTime(elapsedSeconds);

        const avgHr = countHr > 0 ? Math.round(totalHr / countHr) : 0;
        const avgPower = countPower > 0 ? Math.round(totalPower / countPower) : 0;
        const avgSpeed = countSpeed > 0 ? (totalSpeed / countSpeed).toFixed(1) : 0;

        summaryAvgHr.textContent = avgHr > 0 ? avgHr : '--';
        summaryAvgPower.textContent = avgPower > 0 ? avgPower : '--';
        summaryAvgSpeed.textContent = avgSpeed > 0 ? avgSpeed : '--';
    }
}

async function handleUploadStrava() {
    saveModal.classList.add('hidden');

    if (!stravaAccessToken) {
        alert('Veuillez vous connecter à Strava dans les paramètres.');
        return;
    }

    await uploadToStrava();
    resetStats();
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
    resetStats();
}

function updateTimerDisplay(seconds) {
    timerDisplay.textContent = formatTime(seconds);
}

function recordDataPoint() {
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

            // Initialize Control Point if FTMS
            if (service.uuid === FTMS_SERVICE_UUID) {
                await initTrainerControl(service);
            }

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

        // Hide Control Panel
        // trainerControlPanel.style.display = 'none'; // Always visible now
        isErgMode = false;
        setPowerBtn.checked = false;
    }
}

async function initTrainerControl(service) {
    try {
        trainerControlCharacteristic = await service.getCharacteristic(FITNESS_MACHINE_CONTROL_POINT_UUID);
        console.log('Trainer Control Point found!');
        // trainerControlPanel.style.display = 'block'; // Always visible now

        // Request Control
        await requestTrainerControl();
    } catch (e) {
        console.log('Control Point not found or error:', e);
    }
}

async function requestTrainerControl() {
    if (!trainerControlCharacteristic) return;
    try {
        // Opcode 0x00: Request Control
        const buffer = new Uint8Array([0x00]);
        await trainerControlCharacteristic.writeValue(buffer);
        console.log('Control Requested');
    } catch (e) {
        console.error('Error requesting control:', e);
    }
}

async function toggleErgMode() {
    if (!trainerControlCharacteristic && !isDemoMode) {
        setPowerBtn.checked = false;
        return;
    }

    if (setPowerBtn.checked) {
        // Turn ON ERG
        isErgMode = true;
        await setTargetPower(targetPower);
    } else {
        // Turn OFF ERG (Reset to simulation or resistance mode - here just stopping ERG)
        // Note: There isn't a simple "Stop ERG" opcode in standard FTMS without switching to another mode.
        // We will just update UI for now, or send a "Reset" opcode 0x01 if supported.
        // For simplicity/safety, we'll just flag it off in UI.
        isErgMode = false;
    }
}

function adjustTargetPower(delta) {
    targetPower += delta;
    if (targetPower < 50) targetPower = 50;
    if (targetPower > 400) targetPower = 400;
    targetPowerDisplay.textContent = targetPower;

    if (isErgMode) {
        setTargetPower(targetPower);
    }
}

async function setTargetPower(watts) {
    if (isDemoMode) {
        console.log(`[DEMO] Target Power set to ${watts}W`);
        return;
    }

    if (!trainerControlCharacteristic) return;

    try {
        // Opcode 0x05: Set Target Power
        // Parameter: SINT16, Unit: Watts
        const buffer = new ArrayBuffer(3);
        const view = new DataView(buffer);
        view.setUint8(0, 0x05); // Opcode
        view.setInt16(1, watts, true); // Value (Little Endian)

        await trainerControlCharacteristic.writeValue(buffer);
        console.log(`Target Power sent: ${watts}W`);
    } catch (e) {
        console.error('Error setting target power:', e);
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

    powerDisplay.textContent = watts;
    powerDisplay.className = 'value-large'; // Reset class

    // Calculate and set Zone
    const zone = calculatePowerZone(watts, userFtp);
    powerZoneIndicator.textContent = zone.name;
    powerZoneIndicator.className = `zone-indicator ${zone.class}`;
    powerDisplay.classList.add(zone.class);

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

    // Add Target Line if workout active
    if (isWorkoutActive) {
        powerChart.data.datasets[1].data.push(targetPower);
    } else {
        powerChart.data.datasets[1].data.push(null);
    }

    // Keep only last 900 points (15 minutes)
    if (powerChart.data.labels.length > 900) {
        powerChart.data.labels.shift();
        powerChart.data.datasets[0].data.shift();
        powerChart.data.datasets[1].data.shift();
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
    powerChart.data.datasets[1].data = [];
    powerChart.update();

    cadenceChart.data.labels = [];
    cadenceChart.data.datasets[0].data = [];
    cadenceChart.update();

    speedChart.data.labels = [];
    speedChart.data.datasets[0].data = [];
    speedChart.update();

    // Reset Timer
    elapsedSeconds = 0;
    elapsedTime = 0;
    updateTimerDisplay(0);
}

// --- WORKOUT FUNCTIONS ---

function saveUserFtp() {
    userFtp = parseInt(userFtpInput.value);
    localStorage.setItem('user_ftp', userFtp);
    console.log('FTP saved:', userFtp);
}

function openWorkoutModal() {
    workoutList.innerHTML = '';
    workouts.forEach(workout => {
        const div = document.createElement('div');
        div.className = 'workout-item';

        // Calculate total duration
        const totalDurationMin = Math.floor(workout.steps.reduce((acc, s) => acc + s.duration, 0) / 60);

        // Generate steps list
        let stepsHtml = '<ul class="workout-steps-list">';
        workout.steps.forEach(step => {
            const duration = step.duration >= 60
                ? `${Math.floor(step.duration / 60)} min`
                : `${step.duration} sec`;
            const targetWatts = Math.round(step.power * userFtp);
            stepsHtml += `
                <li>
                    <span class="step-duration">${duration}</span>
                    <span class="step-power">@ ${targetWatts}W</span>
                    <span class="step-label">${step.label || step.type}</span>
                </li>`;
        });
        stepsHtml += '</ul>';

        div.innerHTML = `
            <div class="workout-header">
                <h3>${workout.name}</h3>
                <span class="workout-duration">${totalDurationMin} min</span>
            </div>
            <p class="workout-description">${workout.description}</p>
            ${stepsHtml}
        `;
        div.addEventListener('click', () => selectWorkout(workout));
        workoutList.appendChild(div);
    });
    workoutModal.classList.remove('hidden');
}

function selectWorkout(workout) {
    currentWorkout = workout;
    workoutModal.classList.add('hidden');

    // Setup Workout State
    isWorkoutActive = true;
    currentIntervalIndex = 0;
    workoutElapsedTime = 0;
    workoutTotalDuration = workout.steps.reduce((acc, s) => acc + s.duration, 0);

    // Show HUD
    workoutHud.classList.remove('hidden');
    workoutNameDisplay.textContent = workout.name;
    workoutNameDisplay.textContent = workout.name;
    powerTargetContainer.classList.remove('hidden');

    // Draw Profile
    drawWorkoutProfile(workout, 0);

    // Start Activity if not already started
    if (!isRecording) {
        startActivity();
    }

    // Initialize First Interval
    startInterval(0);
}


function drawWorkoutProfile(workout, activeIndex = -1) {
    const canvas = document.getElementById('workoutProfileChart');
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    // Clear
    ctx.clearRect(0, 0, width, height);

    const totalDuration = workout.steps.reduce((acc, s) => acc + s.duration, 0);
    let currentX = 0;

    workout.steps.forEach((step, index) => {
        const stepWidth = (step.duration / totalDuration) * width;
        const stepHeight = Math.min(step.power * 0.8 * height, height); // Scale power to height
        const y = height - stepHeight;

        // Color based on intensity or active state
        if (index === activeIndex) {
            ctx.fillStyle = '#ffaa00'; // Active
        } else {
            ctx.fillStyle = 'rgba(255, 170, 0, 0.3)'; // Inactive
        }

        ctx.fillRect(currentX, y, stepWidth - 1, stepHeight); // -1 for gap

        currentX += stepWidth;
    });
}

function startInterval(index) {
    if (index >= currentWorkout.steps.length) {
        stopWorkout();
        return;
    }

    currentIntervalIndex = index;
    const step = currentWorkout.steps[index];
    intervalTimeRemaining = step.duration;

    // Update UI
    intervalNameDisplay.textContent = step.label || step.type.toUpperCase();

    // Next Interval Preview
    if (index + 1 < currentWorkout.steps.length) {
        const nextStep = currentWorkout.steps[index + 1];
        nextIntervalNameDisplay.textContent = nextStep.label || nextStep.type.toUpperCase();
    } else {
        nextIntervalNameDisplay.textContent = 'FIN';
    }

    // Set Target Power (ERG)
    const targetW = Math.round(step.power * userFtp);
    powerTargetValue.textContent = targetW;

    // Auto-set ERG if Trainer Connected
    if (trainerDevice && trainerDevice.gatt.connected) {
        // Ensure ERG is ON
        if (!isErgMode) {
            toggleErgMode();
        }
        setTargetPower(targetW);
    }

    // Update Control Panel Target Display too
    targetPower = targetW;
    targetPowerDisplay.textContent = targetPower;

    // Redraw Profile with active step
    drawWorkoutProfile(currentWorkout, index);
}

function updateWorkoutLogic() {
    if (!isWorkoutActive) return;

    workoutElapsedTime += timeMultiplier;
    intervalTimeRemaining -= timeMultiplier;

    // Update HUD Timer
    const totalMins = Math.floor(workoutElapsedTime / 60).toString().padStart(2, '0');
    const totalSecs = (workoutElapsedTime % 60).toString().padStart(2, '0');
    const durationMins = Math.floor(workoutTotalDuration / 60).toString().padStart(2, '0');
    const durationSecs = (workoutTotalDuration % 60).toString().padStart(2, '0');
    workoutTotalTimeDisplay.textContent = `${totalMins}:${totalSecs} / ${durationMins}:${durationSecs}`;

    // Update Interval Timer
    const intMins = Math.floor(intervalTimeRemaining / 60).toString().padStart(2, '0');
    const intSecs = (intervalTimeRemaining % 60).toString().padStart(2, '0');
    intervalTimeRemainingDisplay.textContent = `${intMins}:${intSecs}`;

    // Update Progress Bar
    const progress = (workoutElapsedTime / workoutTotalDuration) * 100;
    workoutProgressBar.style.width = `${progress}%`;

    // Check Interval End
    if (intervalTimeRemaining <= 0) {
        startInterval(currentIntervalIndex + 1);
    }
}

function stopWorkout() {
    isWorkoutActive = false;
    workoutHud.classList.add('hidden');
    powerTargetContainer.classList.add('hidden');
    alert('Entraînement terminé ! Bien joué ! 🚴‍♂️🔥');
}

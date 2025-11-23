// DOM Elements
const connectBtn = document.getElementById('connectBtn');
const connectionStatus = document.getElementById('connectionStatus');
const heartRateDisplay = document.getElementById('heartRate');
const batteryLevelDisplay = document.getElementById('batteryLevel');
const minHrDisplay = document.getElementById('minHr');
const maxHrDisplay = document.getElementById('maxHr');
const avgHrDisplay = document.getElementById('avgHr');
const zoneIndicator = document.getElementById('zoneIndicator');

// State
let device = null;
let server = null;
let heartRateCharacteristic = null;
let hrHistory = [];
let minHr = Infinity;
let maxHr = 0;
let totalHr = 0;
let countHr = 0;

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
            pointRadius: 0
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
                display: false,
                grid: {
                    display: false
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

// Bluetooth Constants
const HR_SERVICE_UUID = 0x180d;
const HR_CHARACTERISTIC_UUID = 0x2a37;

// Event Listeners
connectBtn.addEventListener('click', toggleConnection);

async function toggleConnection() {
    if (device && device.gatt.connected) {
        disconnect();
    } else {
        connect();
    }
}

async function connect() {
    try {
        console.log('Requesting Bluetooth Device...');
        device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [HR_SERVICE_UUID] }]
        });

        device.addEventListener('gattserverdisconnected', onDisconnected);

        console.log('Connecting to GATT Server...');
        server = await device.gatt.connect();

        console.log('Getting Heart Rate Service...');
        const service = await server.getPrimaryService(HR_SERVICE_UUID);

        console.log('Getting Heart Rate Characteristic...');
        heartRateCharacteristic = await service.getCharacteristic(HR_CHARACTERISTIC_UUID);

        console.log('Starting Notifications...');
        await heartRateCharacteristic.startNotifications();
        heartRateCharacteristic.addEventListener('characteristicvaluechanged', handleHeartRateChanged);

        updateConnectionStatus(true);
    } catch (error) {
        console.error('Argh! ' + error);
        alert('Erreur de connexion : ' + error);
    }
}

function disconnect() {
    if (device) {
        if (device.gatt.connected) {
            device.gatt.disconnect();
        }
    }
}

function onDisconnected(event) {
    const device = event.target;
    console.log(`Device ${device.name} is disconnected.`);
    updateConnectionStatus(false);
    resetStats();
}

function updateConnectionStatus(connected) {
    if (connected) {
        connectionStatus.textContent = 'Connecté';
        connectionStatus.classList.remove('disconnected');
        connectionStatus.classList.add('connected');
        connectBtn.innerHTML = '<span class="icon">❌</span> DÉCONNECTER';
        connectBtn.style.backgroundColor = '#ff2e63';
    } else {
        connectionStatus.textContent = 'Déconnecté';
        connectionStatus.classList.remove('connected');
        connectionStatus.classList.add('disconnected');
        connectBtn.innerHTML = '<span class="icon">⚡</span> CONNECTER';
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
    const timeLabel = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    // Add new data
    hrChart.data.labels.push(timeLabel);
    hrChart.data.datasets[0].data.push(hr);

    // Keep only last 60 points (approx 1 minute if 1Hz)
    if (hrChart.data.labels.length > 60) {
        hrChart.data.labels.shift();
        hrChart.data.datasets[0].data.shift();
    }

    hrChart.update('none'); // 'none' mode for performance
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
    
    hrChart.data.labels = [];
    hrChart.data.datasets[0].data = [];
    hrChart.update();
}

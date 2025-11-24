let queue = [];      // holds durations
let current = null;  // currently active timer
let remaining = 0;   // seconds left
let interval = null; // interval ID
let paused = true;
let repeat = false;

function addTimer() {
    const sec = parseInt(document.getElementById("duration").value);
    if (!sec || sec <= 0) return;

    queue.push(sec);
    // Clear input
    document.getElementById("duration").value = "";
    renderQueue();

    // if (!current) startNextTimer();
}

function startNextTimer() {
    if (queue.length === 0) {
        current = null;
        document.getElementById("current").innerText = "No timers left";
        return;
    }

    current = queue.shift();
    remaining = current;

    document.getElementById("current").innerText = "Timer Started: " + remaining + "s";

    renderQueue();
    startInterval();
}

function startInterval() {
    clearInterval(interval);

    interval = setInterval(() => {
        if (paused) return;

        remaining--;

        document.getElementById("current").innerText =
            "Current Timer: " + remaining + "s";

        if (remaining == 2 || remaining == 1) {
            playDot();
        } else if (remaining == 0) {
            playDash();
        }

        // Repeat feature
        if (remaining <= 0 && repeat) {
            remaining = current;
            document.getElementById("current").innerText =
            "Current Timer: " + remaining + "s" + " (Repeating)";
            return
        }

        if (remaining <= 0) {
            clearInterval(interval);
            // alert("Timer expired!");
            startNextTimer();
        }
    }, 1000);
}

function togglePause() {
    paused = !paused;

    const btn = document.getElementById("toggleBtn");
    if (!paused) {
        if (!current && queue.length > 0) {
            startNextTimer();
        }

        // btn.innerText = "Pause";
        btn.innerText = "❚❚";
    } else {
        // btn.innerText = "Start";
        btn.innerText = "►";
    }
}

function toggleRepeat() {
    repeat = !repeat;

    const btn = document.getElementById("repeatBtn");
    if (repeat) {
        btn.innerText = "Repeat ON";
        btn.classList.add("active");
    } else {
        btn.innerText = "Repeat OFF";
        btn.classList.remove("active");
    }
}

function renderQueue() {
    let html = "";

    // Display newest timer at bottom without modifying actual queue
    queue.slice().forEach((t, i) => {
        html += `<div class="timer-box">Timer ${i + 1}: ${t}s</div>`;
    });

    document.getElementById("timers").innerHTML = html;
}

function clearQueue() {
    queue = [];
    current = null;
    remaining = 0;
    renderQueue();
}

// Save all settings under one key
function saveSequence() {
    if (queue.length === 0) return;

    let allSequences = JSON.parse(localStorage.getItem("allSequences")) || [];

    allSequences.push([...queue]); // save a copy
    localStorage.setItem("allSequences", JSON.stringify(allSequences));

    renderSavedSequences();
}

// Clear all saved sequences
function clearSavedSequences() {
    localStorage.removeItem("allSequences");
    renderSavedSequences();
}

// Load a saved sequence when clicked
function loadSequence(index) {
    let allSequences = JSON.parse(localStorage.getItem("allSequences")) || [];
    queue = [...allSequences[index]];

    current = null;
    paused = true;

    renderQueue();
    // startNextTimer();
}


function renderSavedSequences() {
    let container = document.getElementById("savedSequences");
    let allSequences = JSON.parse(localStorage.getItem("allSequences")) || [];

    if (allSequences.length === 0) {
        container.innerHTML = "<i>No saved sequences</i>";
        return;
    }

    let html = "";
    allSequences.forEach((seq, idx) => {
        html += `
            <div class="timer-box" style="cursor:pointer;"
                 onclick="loadSequence(${idx})">
                <strong>Setting ${idx + 1}:</strong> [${seq.join(", ")}]
            </div>
        `;
    });

    container.innerHTML = html;
}

// Load saved sequences on page load
window.onload = () => {
    // Load saved queue (optional – you can remove this if unwanted)
    // const saved = localStorage.getItem("timerSequence");
    // if (saved) {
    //     queue = JSON.parse(saved);
    //     renderQueue();
    //     if (!current && queue.length > 0) startNextTimer();
    // }

    renderSavedSequences(); // ALWAYS load saved lists
};


// Sound
// Audio context for beeps
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playDot() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800; // Frequency in Hz
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1); // Dot = 0.1s
}

function playDash() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.8); // Dash = 0.3s
}

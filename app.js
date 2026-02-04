// ============================================
// ALIEN MUSK - Quantum Mining Platform v5.0
// Professional Edition - CLEAN & OPTIMIZED 2025
// ============================================

// Telegram WebApp Initialization
const tg = window.Telegram.WebApp;

// Security: Must run inside Telegram Mini App
if (!tg || !tg.initDataUnsafe || !tg.initDataUnsafe.user) {
    document.body.innerHTML = '<div style="padding:50px; text-align:center; color:white; font-family:sans-serif; background:#000;">This application works only inside Telegram Mini App</div>';
    throw new Error('Not running inside Telegram WebApp');
}

tg.ready();
tg.expand();
tg.enableClosingConfirmation();

// Firebase Configuration (your keys from previous code)
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCklv_zMfndK4-xUHECyD5XA7p_-20e1t8",
    authDomain: "tatbi9-681bf.firebaseapp.com",
    projectId: "tatbi9-681bf",
    storageBucket: "tatbi9-681bf.firebasestorage.app",
    messagingSenderId: "863237064748",
    appId: "1:863237064748:web:134de1e01d2639ef5fa989"
};

// Initialize Firebase
firebase.initializeApp(FIREBASE_CONFIG);
const db = firebase.firestore();

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    PRICES: {
        AMSK: 0.0002,
        USDT: 1.00,
        BNB: 752.00,
        TON: 1.32
    },
    MIN_DEPOSIT: {
        USDT: 10,
        BNB: 0.02,
        TON: 10
    },
    WITHDRAWAL: {
        MIN_USDT: 100,
        FEE_BNB: 0.0002,
        FEE_USD: 0.15
    },
    ADDRESSES: {
        TON: "UQBCqpsPGRG3BalS10iF5U8-PSXkbE5ZlpQRqPVJaGglvQDJ",
        BNB_USDT: "0x790CAB511055F63db2F30AD227f7086bA3B6376a"
    },
    MINING: {
        BASE_REWARD: 2500,
        DURATION: 3600000, // 1 hour
        LEVELS: {
            1: { name: "Beginner", cost: 0, reward: 2500, hashrate: 2500 },
            2: { name: "Advanced", cost: 5, reward: 5000, hashrate: 5000 },
            3: { name: "Pro", cost: 20, reward: 10000, hashrate: 10000 },
            4: { name: "Expert", cost: 100, reward: 25000, hashrate: 25000 }
        },
        BOOSTERS: {
            "2x": { multiplier: 2, duration: 86400000, price: 10000 },
            "3x": { multiplier: 3, duration: 43200000, price: 15000 },
            "5x": { multiplier: 5, duration: 21600000, price: 25000 }
        }
    },
    STAKING: {
        PLANS: {
            1: { name: "Silver", amount: 10, duration: 7, apr: 40, daily: 40 },
            2: { name: "Gold", amount: 50, duration: 15, apr: 50, daily: 250 },
            3: { name: "Diamond", amount: 100, duration: 30, apr: 60, daily: 600 }
        }
    },
    ADMIN: {
        TELEGRAM_ID: "1653918641",
        PASSWORD: "Ali97$"
    },
    UI: {
        NOTIFICATION_DURATION: 4500,
        ANIMATION_DURATION: 350
    }
};

// ============================================
// GLOBAL STATE
// ============================================
let userData = {
    id: null,
    telegramId: null,
    username: 'Alien',
    firstName: 'Alien',
    photoUrl: null,
    referralCode: null,
    joinedAt: null,
    lastActive: null,
    isInitialized: false
};

let walletData = {
    balances: { AMSK: 0, USDT: 0, BNB: 0, TON: 0 },
    mining: {
        level: 1,
        active: false,
        lastReward: Date.now(),
        nextReward: Date.now() + CONFIG.MINING.DURATION,
        totalMined: 0,
        minedToday: 0,
        activeBoosters: []
    },
    staking: {
        activeStakes: [],
        totalEarned: 0,
        totalStaked: 0
    },
    referrals: {
        count: 0,
        earned: 0,
        referrals: [],
        claimedMilestones: []
    },
    pendingDeposits: [],
    pendingWithdrawals: [],
    depositHistory: [],
    withdrawalHistory: [],
    usedTransactions: [],
    lastUpdate: Date.now()
};

let adminAccess = false;
let gemClickCount = 0;
let lastGemClickTime = 0;

// DOM Cache
const elements = {};

// ============================================
// INITIALIZATION
// ============================================
async function initApp() {
    console.log("🚀 Alien Musk v5.0 - Initializing...");

    cacheElements();
    await setupUser();
    await loadUserData();
    setupEventListeners();
    initAdminSystem();
    setupRealTimeListeners();
    refreshAllUI();
    checkForReferral();
    startBackgroundServices();

    hideLoading();
    showMessage("👽 Welcome to Alien Musk Quantum Platform!", "success");

    userData.isInitialized = true;
}

// Cache DOM Elements
function cacheElements() {
    elements.loadingScreen = document.getElementById('loading-screen');
    elements.usernameMini = document.getElementById('username-mini');
    elements.userIdMini = document.getElementById('user-id-mini');
    elements.userAvatarMini = document.getElementById('user-avatar-mini');
    elements.totalBalanceAmsk = document.getElementById('total-balance-amsk');
    elements.totalBalanceUsd = document.getElementById('total-balance-usd');

    elements.currentMiningLevel = document.getElementById('current-mining-level');
    elements.currentHashrateDisplay = document.getElementById('current-hashrate-display');
    elements.miningTimerDisplay = document.getElementById('mining-timer-display');
    elements.nextRewardAmount = document.getElementById('next-reward-amount');
    elements.startMiningBtn = document.getElementById('start-mining-btn');
    elements.totalMined = document.getElementById('total-mined');
    elements.minedToday = document.getElementById('mined-today');

    elements.upgradeButtons = document.querySelectorAll('.upgrade-btn');
    elements.boosterButtons = document.querySelectorAll('.booster-btn');

    elements.stakeButtons = document.querySelectorAll('.stake-plan-btn');
    elements.activeStakesList = document.getElementById('active-stakes-list');

    elements.walletTotalAmsk = document.getElementById('wallet-total-amsk');
    elements.walletTotalUsd = document.getElementById('wallet-total-usd');
    elements.assetAmskBalance = document.getElementById('asset-amsk-balance');
    elements.assetAmskUsd = document.getElementById('asset-amsk-usd');
    elements.assetUsdtBalance = document.getElementById('asset-usdt-balance');
    elements.assetUsdtUsd = document.getElementById('asset-usdt-usd');
    elements.assetBnbBalance = document.getElementById('asset-bnb-balance');
    elements.assetBnbUsd = document.getElementById('asset-bnb-usd');
    elements.assetTonBalance = document.getElementById('asset-ton-balance');
    elements.assetTonUsd = document.getElementById('asset-ton-usd');

    elements.navButtons = document.querySelectorAll('.nav-btn');
    elements.pages = document.querySelectorAll('.page');

    elements.modalOverlay = document.getElementById('modal-overlay');
    elements.depositModal = document.getElementById('deposit-modal');
    elements.withdrawModal = document.getElementById('withdraw-modal');
    elements.swapModal = document.getElementById('swap-modal');
    elements.stakeModal = document.getElementById('stake-modal');
    elements.historyModal = document.getElementById('history-modal');
    elements.adminLoginModal = document.getElementById('admin-login-modal');
    elements.adminPanelModal = document.getElementById('admin-panel-modal');

    elements.refCount = document.getElementById('ref-count');
    elements.refEarned = document.getElementById('ref-earned');
    elements.referralCodeDisplay = document.getElementById('referral-code-display');
    elements.referralLinkInput = document.getElementById('referral-link-input');
    elements.milestonesList = document.getElementById('milestones-list');
}

// ============================================
// USER & DATA MANAGEMENT
// ============================================
async function setupUser() {
    const tgUser = tg.initDataUnsafe.user;
    userData.id = tgUser.id.toString();
    userData.telegramId = tgUser.id;
    userData.username = tgUser.username ? `@${tgUser.username}` : tgUser.first_name || 'Alien';
    userData.firstName = tgUser.first_name || 'Alien';
    userData.photoUrl = tgUser.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tgUser.id}`;

    userData.referralCode = generateReferralCode(userData.id);
    userData.joinedAt = new Date().toISOString();
    userData.lastActive = new Date().toISOString();

    updateUserUI();
    await syncUserWithFirebase();
}

function generateReferralCode(id) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomPart = Array.from({length: 6}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `ALIEN-\( {id.slice(-3)} \){randomPart}`;
}

function updateUserUI() {
    elements.usernameMini.textContent = userData.firstName;
    elements.userIdMini.textContent = `ID: ${userData.id.slice(-8)}`;
    elements.userAvatarMini.src = userData.photoUrl;
}

async function loadUserData() {
    const storageKey = `alien_musk_${userData.id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) Object.assign(walletData, JSON.parse(saved));

    await loadUserFromFirebase();
    refreshAllUI();
}

function saveUserData() {
    const storageKey = `alien_musk_${userData.id}`;
    localStorage.setItem(storageKey, JSON.stringify(walletData));
    saveUserToFirebase();
}

async function syncUserWithFirebase() {
    const ref = db.collection('users').doc(userData.id);
    const snap = await ref.get();

    if (!snap.exists) {
        await ref.set({
            ...userData,
            ...walletData,
            lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
}

async function loadUserFromFirebase() {
    const ref = db.collection('users').doc(userData.id);
    const snap = await ref.get();
    if (snap.exists) {
        Object.assign(walletData, snap.data());
    }
}

async function saveUserToFirebase() {
    const ref = db.collection('users').doc(userData.id);
    await ref.set({
        ...userData,
        ...walletData,
        lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
}

// ============================================
// UI REFRESH CENTRAL FUNCTION
// ============================================
function refreshAllUI() {
    updateUserUI();
    updateMiningDisplay();
    updateWalletUI();
    updateStakingDisplay();
    updateReferralUI();
}

// ============================================
// MINING SYSTEM
// ============================================
function updateMiningDisplay() {
    const m = walletData.mining;
    const lvl = CONFIG.MINING.LEVELS[m.level];

    let hashrate = lvl.hashrate;
    let reward = lvl.reward;

    m.activeBoosters.forEach(b => {
        const cfg = CONFIG.MINING.BOOSTERS[b.type];
        if (cfg && b.expiresAt > Date.now()) {
            hashrate *= cfg.multiplier;
            reward *= cfg.multiplier;
        }
    });

    elements.currentMiningLevel.textContent = m.level;
    elements.currentHashrateDisplay.textContent = formatNumber(hashrate);
    elements.nextRewardAmount.textContent = formatNumber(reward);
    elements.totalMined.textContent = formatNumber(m.totalMined);
    elements.minedToday.textContent = formatNumber(m.minedToday);

    updateMiningTimer();
    updateUpgradeCards();
    updateBoosterCards();
}

function updateMiningTimer() {
    const now = Date.now();
    const left = walletData.mining.nextReward - now;

    if (left <= 0) {
        elements.miningTimerDisplay.textContent = "READY!";
        elements.miningTimerDisplay.style.color = 'var(--alien-green)';
        elements.startMiningBtn.innerHTML = '<i class="fas fa-gift"></i><span>Claim Reward</span>';
        elements.startMiningBtn.classList.add('claim-mode');
    } else {
        const h = Math.floor(left / 3600000).toString().padStart(2,'0');
        const m = Math.floor((left % 3600000) / 60000).toString().padStart(2,'0');
        const s = Math.floor((left % 60000) / 1000).toString().padStart(2,'0');
        elements.miningTimerDisplay.textContent = `\( {h}: \){m}:${s}`;
        elements.miningTimerDisplay.style.color = 'var(--alien-text)';
        elements.startMiningBtn.innerHTML = '<i class="fas fa-play"></i><span>Mining...</span>';
        elements.startMiningBtn.classList.remove('claim-mode');
    }
}

async function handleMiningAction() {
    const now = Date.now();
    if (now >= walletData.mining.nextReward) {
        await claimMiningReward();
    } else {
        showMessage("Reward not ready yet.", "info");
    }
}

async function claimMiningReward() {
    const lvl = CONFIG.MINING.LEVELS[walletData.mining.level];
    let reward = lvl.reward;

    walletData.mining.activeBoosters.forEach(b => {
        const cfg = CONFIG.MINING.BOOSTERS[b.type];
        if (cfg && b.expiresAt > Date.now()) reward *= cfg.multiplier;
    });

    walletData.balances.AMSK += reward;
    walletData.mining.totalMined += reward;
    walletData.mining.minedToday += reward;
    walletData.mining.lastReward = Date.now();
    walletData.mining.nextReward = Date.now() + CONFIG.MINING.DURATION;

    saveUserData();
    refreshAllUI();
    showMessage(`+${formatNumber(reward)} AMSK claimed!`, "success");
}

async function upgradeMiningLevel(level) {
    level = parseInt(level);
    const data = CONFIG.MINING.LEVELS[level];
    if (!data || level <= walletData.mining.level) return;

    if (walletData.balances.USDT < data.cost) {
        showMessage(`Need ${data.cost} USDT to upgrade`, "error");
        return;
    }

    walletData.balances.USDT -= data.cost;
    walletData.mining.level = level;

    saveUserData();
    refreshAllUI();
    showMessage(`Upgraded to ${data.name} level!`, "success");
}

async function activateBooster(type) {
    const cfg = CONFIG.MINING.BOOSTERS[type];
    if (!cfg) return;

    if (walletData.balances.AMSK < cfg.price) {
        showMessage(`Need ${formatNumber(cfg.price)} AMSK`, "error");
        return;
    }

    walletData.balances.AMSK -= cfg.price;
    walletData.mining.activeBoosters.push({
        type,
        expiresAt: Date.now() + cfg.duration
    });

    saveUserData();
    refreshAllUI();
    showMessage(`${type} Booster activated!`, "success");
}

function updateUpgradeCards() {
    elements.upgradeButtons.forEach(btn => {
        const card = btn.closest('.upgrade-card');
        const lvl = parseInt(card.dataset.level);
        const data = CONFIG.MINING.LEVELS[lvl];

        if (lvl === walletData.mining.level) {
            btn.textContent = 'Active';
            btn.classList.add('active-btn');
            btn.disabled = true;
            card.classList.add('active');
        } else if (lvl < walletData.mining.level) {
            btn.textContent = 'Upgraded';
            btn.classList.add('active-btn');
            btn.disabled = true;
        } else {
            const can = walletData.balances.USDT >= data.cost;
            btn.textContent = can ? 'Upgrade' : `${data.cost} USDT`;
            btn.disabled = !can;
        }
    });
}

function updateBoosterCards() {
    elements.boosterButtons.forEach(btn => {
        const card = btn.closest('.booster-card');
        const type = card.dataset.booster;
        const cfg = CONFIG.MINING.BOOSTERS[type];

        const active = walletData.mining.activeBoosters.some(b => b.type === type && b.expiresAt > Date.now());
        const can = walletData.balances.AMSK >= cfg.price;

        if (active) {
            btn.textContent = 'Active';
            btn.disabled = true;
            btn.classList.add('active-btn');
            card.classList.add('active');
        } else {
            btn.textContent = can ? 'Activate' : `${formatNumber(cfg.price)} AMSK`;
            btn.disabled = !can;
        }
    });
}

// ============================================
// STAKING SYSTEM
// ============================================
function updateStakingDisplay() {
    elements.activeStakesList.innerHTML = '';

    if (!walletData.staking.activeStakes.length) {
        elements.activeStakesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No active stakes yet</p>
                <small>Start staking to earn daily rewards</small>
            </div>`;
        return;
    }

    walletData.staking.activeStakes.forEach((stake, i) => {
        const plan = CONFIG.STAKING.PLANS[stake.planId];
        const now = Date.now();
        const end = stake.startTime + plan.duration * 86400000;
        const progress = Math.min(100, ((now - stake.startTime) / (end - stake.startTime)) * 100);
        const daysLeft = Math.ceil((end - now) / 86400000);

        const html = `
            <div class="stake-item">
                <div class="stake-header">
                    <h5>${plan.name}</h5>
                    <span class="status-badge active">Active</span>
                </div>
                <div class="stake-progress">
                    <div class="progress-info">
                        <span>${Math.round(progress)}%</span>
                        <span>${daysLeft > 0 ? daysLeft + ' days left' : 'Completed'}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
                <div class="stake-details">
                    <div class="detail"><i class="fas fa-calendar"></i><span>${plan.duration} Days</span></div>
                    <div class="detail"><i class="fas fa-percentage"></i><span>${plan.apr}% APR</span></div>
                    <div class="detail"><i class="fas fa-gift"></i><span>${plan.daily} AMSK/Day</span></div>
                </div>
                <div class="stake-actions">
                    <button class="btn-cancel" onclick="cancelStake(${i})" ${progress < 50 ? '' : 'disabled'}>Cancel</button>
                    <button class="btn-claim" onclick="claimStakeReward(${i})" ${progress >= 100 ? '' : 'disabled'}>Claim</button>
                </div>
            </div>`;
        elements.activeStakesList.innerHTML += html;
    });
}

function openStakeModal(planId) {
    const plan = CONFIG.STAKING.PLANS[planId];
    const html = `
        <div class="modal-header">
            <h3><i class="fas fa-gem"></i> Stake ${plan.name}</h3>
            <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <div class="modal-body">
            <div class="stake-plan-info">
                <div class="plan-icon"><i class="fas fa-gem"></i></div>
                <div>
                    <div class="plan-amount">${plan.amount} USDT</div>
                    <div>${plan.duration} Days • ${plan.apr}% APR</div>
                </div>
            </div>
            <div class="stake-preview">
                <div class="preview-item"><span>Daily Reward</span><span>${plan.daily} AMSK</span></div>
                <div class="preview-item"><span>Total Reward</span><span>${plan.daily * plan.duration} AMSK</span></div>
                <div class="preview-item total"><span>Total Return</span><span>${plan.amount + plan.daily * plan.duration} value</span></div>
            </div>
            <div class="stake-warning">
                <i class="fas fa-exclamation-triangle"></i>
                Funds locked for ${plan.duration} days. Early cancel has penalty.
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn-primary" onclick="confirmStaking(${planId})" ${walletData.balances.USDT >= plan.amount ? '' : 'disabled'}>Confirm Stake</button>
            </div>
        </div>`;
    elements.stakeModal.innerHTML = html;
    showModal('stake');
}

async function confirmStaking(planId) {
    const plan = CONFIG.STAKING.PLANS[planId];
    if (walletData.balances.USDT < plan.amount) return;

    walletData.balances.USDT -= plan.amount;
    walletData.staking.activeStakes.push({
        planId,
        amount: plan.amount,
        startTime: Date.now(),
        dailyReward: plan.daily
    });
    walletData.staking.totalStaked += plan.amount;

    saveUserData();
    closeModal();
    refreshAllUI();
    showMessage(`Successfully staked ${plan.amount} USDT in ${plan.name}`, "success");
}

async function claimStakeReward(index) {
    const stake = walletData.staking.activeStakes[index];
    const plan = CONFIG.STAKING.PLANS[stake.planId];
    const now = Date.now();
    const end = stake.startTime + plan.duration * 86400000;

    if (now < end) {
        showMessage("Staking period not finished yet", "warning");
        return;
    }

    const reward = stake.dailyReward * plan.duration;
    walletData.balances.AMSK += reward;
    walletData.balances.USDT += stake.amount;
    walletData.staking.totalEarned += reward;
    walletData.staking.activeStakes.splice(index, 1);

    saveUserData();
    refreshAllUI();
    showMessage(`Claimed ${formatNumber(reward)} AMSK from staking`, "success");
}

function cancelStake(index) {
    const stake = walletData.staking.activeStakes[index];
    const plan = CONFIG.STAKING.PLANS[stake.planId];
    const now = Date.now();
    const progress = ((now - stake.startTime) / (plan.duration * 86400000)) * 100;

    if (progress >= 50) {
        showMessage("Cannot cancel after 50% progress", "warning");
        return;
    }

    const returned = stake.amount * 0.5;
    walletData.balances.USDT += returned;
    walletData.staking.activeStakes.splice(index, 1);
    walletData.staking.totalStaked -= stake.amount;

    saveUserData();
    refreshAllUI();
    showMessage(`Stake canceled. Returned ${returned.toFixed(2)} USDT (50% penalty)`, "warning");
}

// ============================================
// WALLET & TRANSACTIONS
// ============================================
function updateWalletUI() {
    const p = CONFIG.PRICES;
    const b = walletData.balances;

    const totalA = b.AMSK;
    const totalU = b.AMSK * p.AMSK + b.USDT + b.BNB * p.BNB + b.TON * p.TON;

    elements.walletTotalAmsk.textContent = formatNumber(totalA);
    elements.walletTotalUsd.textContent = totalU.toFixed(2);

    elements.assetAmskBalance.textContent = formatNumber(b.AMSK);
    elements.assetAmskUsd.textContent = (b.AMSK * p.AMSK).toFixed(2);
    elements.assetUsdtBalance.textContent = b.USDT.toFixed(2);
    elements.assetUsdtUsd.textContent = b.USDT.toFixed(2);
    elements.assetBnbBalance.textContent = b.BNB.toFixed(4);
    elements.assetBnbUsd.textContent = (b.BNB * p.BNB).toFixed(2);
    elements.assetTonBalance.textContent = formatNumber(b.TON);
    elements.assetTonUsd.textContent = (b.TON * p.TON).toFixed(2);
}

function openDepositModal(currency = 'USDT') {
    const min = CONFIG.MIN_DEPOSIT[currency];
    const addr = currency === 'TON' ? CONFIG.ADDRESSES.TON : CONFIG.ADDRESSES.BNB_USDT;

    const html = `
        <div class="modal-header">
            <h3><i class="fas fa-download"></i> Deposit ${currency}</h3>
            <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <div class="modal-body">
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle"></i>
                Send only ${currency}. Minimum: ${min}
            </div>
            <div class="form-group">
                <label>Deposit Address</label>
                <div class="input-with-max">
                    <input type="text" value="${addr}" readonly id="deposit-addr">
                    <button class="btn-max" onclick="copyToClipboard('${addr}')">Copy</button>
                </div>
            </div>
            <div class="form-group">
                <label>Amount (${currency})</label>
                <input type="number" id="deposit-amount" min="${min}" step="0.01" placeholder="0.00">
            </div>
            <div class="form-group">
                <label>Transaction ID / Hash</label>
                <input type="text" id="deposit-txid" placeholder="Enter TxID">
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn-primary" onclick="submitDepositRequest('${currency}')">Submit Request</button>
            </div>
        </div>`;
    elements.depositModal.innerHTML = html;
    showModal('deposit');
}

async function submitDepositRequest(currency) {
    const amount = parseFloat(document.getElementById('deposit-amount').value);
    const txid = document.getElementById('deposit-txid').value.trim();

    if (isNaN(amount) || amount < CONFIG.MIN_DEPOSIT[currency] || !txid) {
        showMessage("Invalid amount or missing TxID", "error");
        return;
    }

    if (walletData.usedTransactions.includes(txid.toLowerCase())) {
        showMessage("This TxID already used", "error");
        return;
    }

    const req = {
        id: 'dep_' + Date.now(),
        userId: userData.id,
        username: userData.username,
        currency,
        amount,
        txid,
        status: 'pending',
        timestamp: Date.now()
    };

    walletData.pendingDeposits.push(req);
    walletData.usedTransactions.push(txid.toLowerCase());

    await db.collection('deposit_requests').add({
        ...req,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    saveUserData();
    closeModal();
    showMessage("Deposit request sent. Waiting for admin review.", "success");
}

function openWithdrawModal() {
    const usdt = walletData.balances.USDT;
    const bnb = walletData.balances.BNB;
    const min = CONFIG.WITHDRAWAL.MIN_USDT;
    const fee = CONFIG.WITHDRAWAL.FEE_BNB;

    const html = `
        <div class="modal-header">
            <h3><i class="fas fa-upload"></i> Withdraw USDT</h3>
            <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Amount (USDT)</label>
                <input type="number" id="withdraw-amount" value="\( {Math.min(usdt, 100).toFixed(2)}" min=" \){min}" max="${usdt}" step="0.01">
            </div>
            <div class="form-group">
                <label>BEP20 Address</label>
                <input type="text" id="withdraw-address" placeholder="0x..." maxlength="42">
            </div>
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                Min: ${min} USDT • Fee: ${fee} BNB (available: ${bnb.toFixed(4)})
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn-primary" onclick="submitWithdrawRequest()" ${usdt >= min && bnb >= fee ? '' : 'disabled'}>Submit Request</button>
            </div>
        </div>`;
    elements.withdrawModal.innerHTML = html;
    showModal('withdraw');
}

async function submitWithdrawRequest() {
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    const addr = document.getElementById('withdraw-address').value.trim();

    if (isNaN(amount) || amount < CONFIG.WITHDRAWAL.MIN_USDT || !addr.startsWith('0x') || addr.length !== 42) {
        showMessage("Invalid amount or address", "error");
        return;
    }

    const req = {
        id: 'wd_' + Date.now(),
        userId: userData.id,
        username: userData.username,
        amount,
        address: addr,
        status: 'pending',
        timestamp: Date.now()
    };

    walletData.pendingWithdrawals.push(req);

    await db.collection('withdrawal_requests').add({
        ...req,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    saveUserData();
    closeModal();
    showMessage("Withdrawal request sent. Awaiting admin approval.", "success");
}

// ============================================
// REFERRAL SYSTEM
// ============================================
function checkForReferral() {
    const param = tg.initDataUnsafe.start_param || new URLSearchParams(location.search).get('start');
    if (param && param !== userData.referralCode) processReferral(param);
}

async function processReferral(code) {
    if (walletData.referrals.referredBy) return;

    const q = await db.collection('users').where('referralCode', '==', code).get();
    if (q.empty) return;

    const doc = q.docs[0];
    if (doc.id === userData.id) return;

    await doc.ref.update({
        'referrals.count': firebase.firestore.FieldValue.increment(1),
        'referrals.earned': firebase.firestore.FieldValue.increment(10000),
        'balances.AMSK': firebase.firestore.FieldValue.increment(10000)
    });

    walletData.balances.AMSK += 5000;
    walletData.referrals.referredBy = code;
    walletData.referrals.earned += 5000;

    saveUserData();
    refreshAllUI();
    showMessage("Welcome bonus: +5,000 AMSK", "success");
}

function updateReferralUI() {
    elements.refCount.textContent = walletData.referrals.count;
    elements.refEarned.textContent = formatNumber(walletData.referrals.earned);
    elements.referralCodeDisplay.textContent = userData.referralCode;
    elements.referralLinkInput.value = `https://t.me/AlienMuskbot/Musk?start=${userData.referralCode}`;
}

// ============================================
// ADMIN PANEL
// ============================================
function initAdminSystem() {
    document.querySelector('.logo').addEventListener('click', handleLogoClick);
}

function handleLogoClick() {
    const now = Date.now();
    if (now - lastGemClickTime > 2000) gemClickCount = 0;
    gemClickCount++;
    lastGemClickTime = now;

    if (gemClickCount >= 5) {
        showAdminLogin();
        gemClickCount = 0;
    }
}

function showAdminLogin() {
    const html = `
        <div class="modal-header">
            <h3><i class="fas fa-lock"></i> Admin Access</h3>
            <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="admin-pass">
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn-primary" onclick="verifyAdmin()">Login</button>
            </div>
        </div>`;
    elements.adminLoginModal.innerHTML = html;
    showModal('admin-login');
}

function verifyAdmin() {
    const pass = document.getElementById('admin-pass').value;
    if (pass !== CONFIG.ADMIN.PASSWORD || userData.telegramId !== CONFIG.ADMIN.TELEGRAM_ID) {
        showMessage("Access denied", "error");
        return;
    }

    adminAccess = true;
    closeModal();
    showAdminPanel();
    showMessage("Admin access granted", "success");
}

async function showAdminPanel() {
    const html = `
        <div class="modal-header">
            <h3><i class="fas fa-user-shield"></i> Admin Panel</h3>
            <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <div class="modal-body">
            <div class="admin-tabs">
                <button class="tab-btn active" data-tab="deposits">Pending Deposits</button>
                <button class="tab-btn" data-tab="withdrawals">Pending Withdrawals</button>
            </div>
            <div id="admin-content">
                <div id="deposits-tab" class="admin-tab active">
                    <h4>Pending Deposit Requests</h4>
                    <div id="pending-deposits-list"></div>
                </div>
                <div id="withdrawals-tab" class="admin-tab" style="display:none;">
                    <h4>Pending Withdrawal Requests</h4>
                    <div id="pending-withdrawals-list"></div>
                </div>
            </div>
        </div>`;
    elements.adminPanelModal.innerHTML = html;
    showModal('admin-panel');

    // Load pending requests
    loadPendingRequests('deposits');
    loadPendingRequests('withdrawals');

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.admin-tab').forEach(t => t.style.display = 'none');
            document.getElementById(btn.dataset.tab + '-tab').style.display = 'block';
        });
    });
}

async function loadPendingRequests(type) {
    const col = type === 'deposits' ? 'deposit_requests' : 'withdrawal_requests';
    const list = document.getElementById(`pending-${type}-list`);

    const q = await db.collection(col)
        .where('status', '==', 'pending')
        .orderBy('timestamp', 'desc')
        .limit(50)
        .get();

    list.innerHTML = '';

    if (q.empty) {
        list.innerHTML = '<div class="empty-state"><p>No pending requests</p></div>';
        return;
    }

    q.forEach(doc => {
        const d = doc.data();
        const date = new Date(d.timestamp?.toMillis() || d.timestamp).toLocaleString();

        const html = `
            <div class="transaction-card">
                <div class="transaction-header">
                    <div>\( {d.username || 'User'} ( \){d.userId.slice(-6)})</div>
                    <span class="status-badge pending">Pending</span>
                </div>
                <div class="transaction-details">
                    <div><strong>${d.amount} ${d.currency}</strong></div>
                    <div>${type === 'deposits' ? 'TxID: ' + d.txid.slice(0,12) + '...' : 'Address: ' + d.address.slice(0,12) + '...'}</div>
                    <div>${date}</div>
                </div>
                <div class="admin-actions">
                    <button class="btn-success" onclick="adminApprove('\( {doc.id}', ' \){type}')">Approve</button>
                    <button class="btn-danger" onclick="adminReject('\( {doc.id}', ' \){type}')">Reject</button>
                </div>
            </div>`;
        list.innerHTML += html;
    });
}

async function adminApprove(id, type) {
    if (!confirm("Approve this request?")) return;

    const col = type === 'deposits' ? 'deposit_requests' : 'withdrawal_requests';
    const docRef = db.collection(col).doc(id);
    const snap = await docRef.get();
    const data = snap.data();

    await docRef.update({ status: 'approved', approvedAt: firebase.firestore.FieldValue.serverTimestamp() });

    if (type === 'deposits') {
        const userRef = db.collection('users').doc(data.userId);
        await userRef.update({
            [`balances.${data.currency}`]: firebase.firestore.FieldValue.increment(data.amount)
        });
    }

    showMessage(`${type.slice(0,-1)} approved`, "success");
    loadPendingRequests(type);
}

async function adminReject(id, type) {
    const reason = prompt("Rejection reason:", "Invalid transaction");
    if (!reason) return;

    const col = type === 'deposits' ? 'deposit_requests' : 'withdrawal_requests';
    await db.collection(col).doc(id).update({
        status: 'rejected',
        rejectionReason: reason,
        rejectedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    showMessage(`${type.slice(0,-1)} rejected`, "warning");
    loadPendingRequests(type);
}

// ============================================
// UTILITIES
// ============================================
function formatNumber(num, decimals = 0) {
    if (isNaN(num)) return '0';
    if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'K';
    return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => showMessage("Copied to clipboard", "success"))
        .catch(() => showMessage("Copy failed", "error"));
}

function showMessage(text, type = 'info') {
    const container = document.getElementById('notification-container');
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.innerHTML = `<i class="fas \( {type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i><span> \){text}</span>`;
    container.appendChild(msg);

    setTimeout(() => {
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 500);
    }, CONFIG.UI.NOTIFICATION_DURATION);
}

function showModal(id) {
    elements.modalOverlay.classList.add('active');
    document.getElementById(id + '-modal').classList.add('active');
}

function closeModal() {
    elements.modalOverlay.classList.remove('active');
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

function hideLoading() {
    elements.loadingScreen.classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Navigation
    elements.navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            elements.pages.forEach(p => p.classList.remove('active'));
            document.getElementById(page + '-page').classList.add('active');
            elements.navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Mining button
    elements.startMiningBtn.addEventListener('click', handleMiningAction);

    // Upgrade buttons
    elements.upgradeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.upgrade-card');
            if (card) upgradeMiningLevel(card.dataset.level);
        });
    });

    // Booster buttons
    elements.boosterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.booster-card');
            if (card) activateBooster(card.dataset.booster);
        });
    });

    // Stake buttons
    elements.stakeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            openStakeModal(btn.closest('.plan-item').dataset.plan);
        });
    });

    // Wallet actions
    document.querySelectorAll('.wallet-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'deposit') openDepositModal();
            if (action === 'withdraw') openWithdrawModal();
            if (action === 'swap') openSwapModal();
            if (action === 'history') openHistoryModal();
        });
    });
}

// ============================================
// REAL-TIME LISTENERS
// ============================================
function setupRealTimeListeners() {
    if (!userData.id) return;

    db.collection('deposit_requests')
        .where('userId', '==', userData.id)
        .onSnapshot(snap => {
            walletData.pendingDeposits = [];
            snap.forEach(doc => {
                const d = doc.data();
                if (d.status === 'pending') walletData.pendingDeposits.push(d);
            });
            // Refresh wallet UI if needed
        });

    db.collection('withdrawal_requests')
        .where('userId', '==', userData.id)
        .onSnapshot(snap => {
            walletData.pendingWithdrawals = [];
            snap.forEach(doc => {
                const d = doc.data();
                if (d.status === 'pending') walletData.pendingWithdrawals.push(d);
            });
        });

    db.collection('users').doc(userData.id)
        .onSnapshot(snap => {
            if (snap.exists) {
                Object.assign(walletData, snap.data());
                refreshAllUI();
            }
        });
}

// ============================================
// BACKGROUND TASKS
// ============================================
function startBackgroundServices() {
    setInterval(() => {
        checkExpiredBoosters();
        updateMiningTimer();
    }, 1000);

    setInterval(saveUserData, 30000);
}

// ============================================
// START THE APP
// ============================================
document.addEventListener('DOMContentLoaded', initApp);

console.log("👽 Alien Musk Quantum Platform v5.0 - Ready");

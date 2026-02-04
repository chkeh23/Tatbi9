// ============================================
// ALIEN MUSK - Quantum Mining Platform v4.1
// Professional Edition - REFACTORED VIP STYLE
// ============================================

// Telegram WebApp
let tg = null;
try {
    tg = window.Telegram.WebApp;
    if (tg) {
        tg.ready();
        tg.expand();
        console.log("✅ Telegram WebApp initialized");
    }
} catch (e) {
    console.log("⚠️ Not in Telegram environment");
}

// Firebase Configuration
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCklv_zMfndK4-xUHECyD5XA7p_-20e1t8",
    authDomain: "tatbi9-681bf.firebaseapp.com",
    projectId: "tatbi9-681bf",
    storageBucket: "tatbi9-681bf.firebasestorage.app",
    messagingSenderId: "863237064748",
    appId: "1:863237064748:web:134de1e01d2639ef5fa989"
};

// Initialize Firebase
let firebaseApp, db;
if (typeof firebase !== 'undefined') {
    try {
        firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
        db = firebase.firestore();
        console.log("✅ Firebase initialized");
    } catch (error) {
        console.error("❌ Firebase error:", error);
    }
}

// ============================================
// CONFIGURATION - نفس إعدادات Alien Musk
// ============================================
const CONFIG = {
    // Token Prices (USD)
    PRICES: {
        AMSK: 0.0002,
        USDT: 1.00,
        BNB: 752.00,
        TON: 1.32
    },
    
    // Deposit Minimums
    MIN_DEPOSIT: {
        USDT: 10,
        BNB: 0.02,
        TON: 10
    },
    
    // Withdrawal Settings
    WITHDRAWAL: {
        MIN_USDT: 100,
        FEE_BNB: 0.0002,
        FEE_USD: 0.15
    },
    
    // Deposit Addresses
    ADDRESSES: {
        TON: "UQBCqpsPGRG3BalS10iF5U8-PSXkbE5ZlpQRqPVJaGglvQDJ",
        BNB_USDT: "0x790CAB511055F63db2F30AD227f7086bA3B6376a"
    },
    
    // Mining Configuration
    MINING: {
        BASE_REWARD: 2500,
        DURATION: 3600000, // 1 hour in ms
        
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
    
    // Staking Configuration
    STAKING: {
        PLANS: {
            1: { name: "Silver", amount: 10, duration: 7, apr: 40, daily: 40 },
            2: { name: "Gold", amount: 50, duration: 15, apr: 50, daily: 250 },
            3: { name: "Diamond", amount: 100, duration: 30, apr: 60, daily: 600 }
        }
    },
    
    // Admin Configuration
    ADMIN: {
        TELEGRAM_ID: "1653918641",
        PASSWORD: "Ali97$",
        SECRET_CODE: "ALIEN2024"
    },
    
    // UI Configuration
    UI: {
        ANIMATION_DURATION: 300,
        NOTIFICATION_DURATION: 4000
    }
};

// ============================================
// USER DATA MANAGEMENT - VIP STYLE
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

// WALLET DATA - مثل VIP Mining
let walletData = {
    balances: {
        AMSK: 2500,    // بداية واقعية بدل 100 USDT
        USDT: 0,       // صفر بدل 100
        BNB: 0,
        TON: 0
    },
    mining: {
        level: 1,
        active: true,
        lastReward: Date.now(),
        nextReward: Date.now() + CONFIG.MINING.DURATION,
        totalMined: 2500,
        minedToday: 2500,
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

// ADMIN SYSTEM
let adminAccess = false;
let gemClickCount = 0;
let lastGemClickTime = 0;

// DAILY STATS
let dailyStats = {
    lastReset: Date.now()
};

// ELEMENTS CACHE
const elements = {};

// ============================================
// INITIALIZATION - VIP STYLE
// ============================================
async function initApp() {
    console.log("🚀 Initializing Alien Musk Platform v4.1...");
    
    try {
        // 1. Cache DOM Elements
        cacheElements();
        
        // 2. Setup User
        await setupUser();
        
        // 3. Load Data
        await loadUserData();
        
        // 4. Setup Event Listeners
        setupEventListeners();
        
        // 5. Initialize Admin System
        initAdminSystem();
        
        // 6. Setup Real-time Listeners
        setupRealTimeListeners();
        
        // 7. Update UI
        updateUI();
        updateMiningDisplay();
        updateWalletUI();
        updateStakingDisplay();
        
        // 8. Check for Referral
        checkForReferral();
        
        // 9. Start Background Services
        startBackgroundServices();
        
        // 10. Hide Loading
        setTimeout(() => {
            hideLoading();
            showMessage("👽 Welcome to Alien Musk Quantum Platform!", "success");
        }, 1500);
        
        userData.isInitialized = true;
        console.log("✅ Platform initialized successfully");
        
    } catch (error) {
        console.error("❌ Initialization failed:", error);
        showMessage("Failed to initialize platform", "error");
        hideLoading();
    }
}

// ============================================
// DOM ELEMENTS CACHE - VIP STYLE
// ============================================
function cacheElements() {
    console.log("🔍 Caching DOM elements...");
    
    // Loading screen
    elements.loadingScreen = document.getElementById('loading-screen');
    elements.loadingProgress = document.getElementById('loading-progress');
    
    // Header elements
    elements.usernameMini = document.getElementById('username-mini');
    elements.userIdMini = document.getElementById('user-id-mini');
    elements.userAvatarMini = document.getElementById('user-avatar-mini');
    elements.totalBalanceAmsk = document.getElementById('total-balance-amsk');
    elements.totalBalanceUsd = document.getElementById('total-balance-usd');
    
    // Mining status
    elements.currentMiningLevel = document.getElementById('current-mining-level');
    elements.currentHashrateDisplay = document.getElementById('current-hashrate-display');
    elements.miningTimerDisplay = document.getElementById('mining-timer-display');
    
    // Mining controls
    elements.startMiningBtn = document.getElementById('start-mining-btn');
    elements.nextRewardAmount = document.getElementById('next-reward-amount');
    
    // Upgrade cards
    elements.upgradeCards = document.querySelectorAll('.upgrade-card');
    elements.upgradeButtons = document.querySelectorAll('.upgrade-btn');
    
    // Booster cards
    elements.boosterCards = document.querySelectorAll('.booster-card');
    elements.boosterButtons = document.querySelectorAll('.booster-btn');
    
    // Staking calculator
    elements.calcAmount = document.getElementById('calc-amount');
    elements.calcDuration = document.getElementById('calc-duration');
    elements.calcTotalProfit = document.getElementById('calc-total-profit');
    elements.calcDailyProfit = document.getElementById('calc-daily-profit');
    elements.calcTotalReturn = document.getElementById('calc-total-return');
    
    // Staking buttons
    elements.stakeButtons = document.querySelectorAll('.stake-btn');
    elements.activeStakesList = document.getElementById('active-stakes-list');
    
    // Wallet elements
    elements.walletTotalAmsk = document.getElementById('wallet-total-amsk');
    elements.walletTotalUsd = document.getElementById('wallet-total-usd');
    
    // Asset balances
    elements.assetAmskBalance = document.getElementById('asset-amsk-balance');
    elements.assetAmskUsd = document.getElementById('asset-amsk-usd');
    elements.assetUsdtBalance = document.getElementById('asset-usdt-balance');
    elements.assetUsdtUsd = document.getElementById('asset-usdt-usd');
    elements.assetBnbBalance = document.getElementById('asset-bnb-balance');
    elements.assetBnbUsd = document.getElementById('asset-bnb-usd');
    elements.assetTonBalance = document.getElementById('asset-ton-balance');
    elements.assetTonUsd = document.getElementById('asset-ton-usd');
    
    // Quick actions
    elements.quickActions = document.querySelectorAll('.quick-action-btn');
    elements.assetButtons = document.querySelectorAll('.asset-btn');
    
    // Navigation
    elements.navButtons = document.querySelectorAll('.nav-btn');
    elements.pages = document.querySelectorAll('.page');
    
    // Modals
    elements.modalOverlay = document.getElementById('modal-overlay');
    elements.modals = {
        deposit: document.getElementById('deposit-modal'),
        withdraw: document.getElementById('withdraw-modal'),
        swap: document.getElementById('swap-modal'),
        stake: document.getElementById('stake-modal'),
        history: document.getElementById('history-modal'),
        admin: document.getElementById('admin-modal')
    };
    
    elements.modalCloseButtons = document.querySelectorAll('.modal-close');
    
    console.log(`✅ Cached ${Object.keys(elements).length} elements`);
}

// ============================================
// USER MANAGEMENT - VIP STYLE
// ============================================
async function setupUser() {
    console.log("👤 Setting up user...");
    
    let telegramUser = null;
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        telegramUser = tg.initDataUnsafe.user;
        console.log("📱 Telegram user found:", telegramUser.id);
    }
    
    if (telegramUser) {
        userData.id = telegramUser.id.toString();
        userData.telegramId = telegramUser.id;
        userData.username = telegramUser.username ? `@${telegramUser.username}` : 
                           telegramUser.first_name ? telegramUser.first_name : 
                           `User${telegramUser.id.toString().slice(-4)}`;
        userData.firstName = telegramUser.first_name || 'Alien';
        userData.photoUrl = telegramUser.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${telegramUser.id}`;
    } else {
        const savedUserId = localStorage.getItem('alien_musk_user_id');
        userData.id = savedUserId || Date.now().toString() + Math.random().toString(36).substr(2, 4);
        userData.username = 'Alien';
        userData.firstName = 'Alien';
        userData.photoUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.id}`;
        
        if (!savedUserId) {
            localStorage.setItem('alien_musk_user_id', userData.id);
        }
    }
    
    // Generate referral code
    userData.referralCode = generateReferralCode(userData.id);
    userData.joinedAt = new Date().toISOString();
    userData.lastActive = new Date().toISOString();
    
    console.log("👤 User initialized:", userData.id, "Ref code:", userData.referralCode);
    
    updateUserUI();
    
    if (db) {
        await syncUserWithFirebase();
    }
}

function generateReferralCode(userId) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const timestamp = Date.now().toString(36);
    const randomPart = Array.from({length: 4}, () => 
        chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
    
    return `ALIEN-${userId.slice(-3)}${randomPart}`.toUpperCase();
}

function updateUserUI() {
    if (elements.usernameMini) {
        elements.usernameMini.textContent = userData.firstName;
    }
    
    if (elements.userIdMini) {
        elements.userIdMini.textContent = `ID: ${userData.id.slice(-8)}`;
    }
    
    if (elements.userAvatarMini) {
        elements.userAvatarMini.src = userData.photoUrl;
    }
}

// ============================================
// DATA LOADING/SAVING - VIP STYLE
// ============================================
async function loadUserData() {
    console.log("📂 Loading user data for:", userData.id);
    
    try {
        // First try localStorage
        const storageKey = `alien_musk_${userData.id}`;
        const savedData = localStorage.getItem(storageKey);
        
        if (savedData) {
            const parsed = JSON.parse(savedData);
            walletData.balances.AMSK = parsed.balances?.AMSK || 2500;
            walletData.balances.USDT = parsed.balances?.USDT || 0; // صفر بدل 100
            walletData.balances.BNB = parsed.balances?.BNB || 0;
            walletData.balances.TON = parsed.balances?.TON || 0;
            walletData.mining = parsed.mining || walletData.mining;
            walletData.staking = parsed.staking || walletData.staking;
            walletData.referrals = parsed.referrals || walletData.referrals;
            walletData.pendingDeposits = parsed.pendingDeposits || [];
            walletData.pendingWithdrawals = parsed.pendingWithdrawals || [];
            walletData.depositHistory = parsed.depositHistory || [];
            walletData.withdrawalHistory = parsed.withdrawalHistory || [];
            walletData.usedTransactions = parsed.usedTransactions || [];
            
            console.log("✅ Data loaded from localStorage");
        }
        
        // Then sync with Firebase if available
        if (db) {
            await loadUserFromFirebase();
        }
        
    } catch (error) {
        console.error("❌ Error loading user data:", error);
    }
}

function saveUserData() {
    if (!userData.id) {
        console.error("❌ Cannot save: No user ID");
        return;
    }
    
    try {
        const storageKey = `alien_musk_${userData.id}`;
        
        const dataToSave = {
            balances: walletData.balances,
            mining: walletData.mining,
            staking: walletData.staking,
            referrals: walletData.referrals,
            pendingDeposits: walletData.pendingDeposits,
            pendingWithdrawals: walletData.pendingWithdrawals,
            depositHistory: walletData.depositHistory,
            withdrawalHistory: walletData.withdrawalHistory,
            usedTransactions: walletData.usedTransactions,
            lastUpdate: Date.now(),
            version: '4.1'
        };
        
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        console.log("💾 User data saved to localStorage");
        
        if (db) {
            saveUserToFirebase();
        }
        
    } catch (error) {
        console.error("❌ Save error:", error);
    }
}

// ============================================
// FIREBASE FUNCTIONS - VIP STYLE
// ============================================
async function syncUserWithFirebase() {
    if (!db || !userData.id) return;
    
    try {
        const userRef = db.collection('users').doc(userData.id);
        const userSnap = await userRef.get();
        
        if (userSnap.exists) {
            const firebaseData = userSnap.data();
            
            // Merge data intelligently
            if (firebaseData.lastUpdate && firebaseData.lastUpdate.toDate) {
                const firebaseTime = firebaseData.lastUpdate.toDate().getTime();
                const localTime = walletData.lastUpdate;
                
                if (firebaseTime > localTime) {
                    // Firebase has newer data
                    walletData.balances = firebaseData.balances || walletData.balances;
                    walletData.mining = firebaseData.mining || walletData.mining;
                    walletData.staking = firebaseData.staking || walletData.staking;
                    walletData.referrals = firebaseData.referrals || walletData.referrals;
                    console.log("✅ Synced from Firebase");
                } else {
                    // Local has newer data
                    await saveUserToFirebase();
                }
            }
        } else {
            // Create new user in Firebase
            await userRef.set({
                id: userData.id,
                telegramId: userData.telegramId,
                username: userData.username,
                firstName: userData.firstName,
                photoUrl: userData.photoUrl,
                referralCode: userData.referralCode,
                joinedAt: userData.joinedAt,
                lastActive: userData.lastActive,
                ...walletData,
                lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("✅ Created new user in Firebase");
        }
        
    } catch (error) {
        console.error("❌ Firebase sync error:", error);
    }
}

async function loadUserFromFirebase() {
    if (!db || !userData.id) return;
    
    try {
        const userRef = db.collection('users').doc(userData.id);
        const userSnap = await userRef.get();
        
        if (userSnap.exists) {
            const firebaseData = userSnap.data();
            
            if (firebaseData.balances) {
                walletData.balances = firebaseData.balances;
                walletData.mining = firebaseData.mining || walletData.mining;
                walletData.staking = firebaseData.staking || walletData.staking;
                walletData.referrals = firebaseData.referrals || walletData.referrals;
                console.log("✅ Loaded from Firebase");
                return true;
            }
        }
    } catch (error) {
        console.error("❌ Firebase load error:", error);
    }
    return false;
}

function saveUserToFirebase() {
    if (!db || !userData.id) return;
    
    try {
        const userRef = db.collection('users').doc(userData.id);
        
        userRef.set({
            id: userData.id,
            telegramId: userData.telegramId,
            username: userData.username,
            firstName: userData.firstName,
            photoUrl: userData.photoUrl,
            referralCode: userData.referralCode,
            lastActive: userData.lastActive,
            balances: walletData.balances,
            mining: walletData.mining,
            staking: walletData.staking,
            referrals: walletData.referrals,
            lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).then(() => {
            console.log("✅ User saved to Firebase");
        }).catch(error => {
            console.error("❌ User Firebase save error:", error);
        });
        
    } catch (error) {
        console.error("❌ User Firebase save error:", error);
    }
}

// ============================================
// MINING SYSTEM - VIP STYLE
// ============================================
function updateMiningDisplay() {
    if (!walletData.mining) return;
    
    const mining = walletData.mining;
    const level = CONFIG.MINING.LEVELS[mining.level];
    
    // Update mining level
    if (elements.currentMiningLevel) {
        elements.currentMiningLevel.textContent = mining.level;
    }
    
    // Calculate hashrate with boosters
    let hashrate = level.hashrate;
    walletData.mining.activeBoosters.forEach(booster => {
        const config = CONFIG.MINING.BOOSTERS[booster.type];
        if (config) {
            hashrate *= config.multiplier;
        }
    });
    
    if (elements.currentHashrateDisplay) {
        elements.currentHashrateDisplay.textContent = formatNumber(hashrate);
    }
    
    // Update mining timer
    updateMiningTimer();
    
    // Update next reward
    let nextReward = level.reward;
    walletData.mining.activeBoosters.forEach(booster => {
        const config = CONFIG.MINING.BOOSTERS[booster.type];
        if (config) {
            nextReward *= config.multiplier;
        }
    });
    
    if (elements.nextRewardAmount) {
        elements.nextRewardAmount.textContent = formatNumber(nextReward);
    }
    
    // Update upgrade cards
    updateUpgradeCards();
    
    // Update booster cards
    updateBoosterCards();
}

function updateMiningTimer() {
    if (!walletData.mining || !elements.miningTimerDisplay) return;
    
    const now = Date.now();
    const nextRewardTime = walletData.mining.nextReward;
    const timeLeft = nextRewardTime - now;
    
    if (timeLeft <= 0) {
        elements.miningTimerDisplay.textContent = "READY!";
        elements.miningTimerDisplay.style.color = "#00ff88";
        
        if (elements.startMiningBtn) {
            elements.startMiningBtn.innerHTML = '<i class="fas fa-gift"></i><span>Claim Reward</span>';
            elements.startMiningBtn.classList.add('claim-mode');
        }
    } else {
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        elements.miningTimerDisplay.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        elements.miningTimerDisplay.style.color = "#ffffff";
        
        if (elements.startMiningBtn) {
            elements.startMiningBtn.innerHTML = '<i class="fas fa-play"></i><span>Mining...</span>';
            elements.startMiningBtn.classList.remove('claim-mode');
        }
    }
}

function updateUpgradeCards() {
    if (!elements.upgradeCards || !walletData) return;
    
    const currentLevel = walletData.mining.level;
    const usdtBalance = walletData.balances.USDT || 0;
    
    elements.upgradeCards.forEach(card => {
        const level = parseInt(card.dataset.level);
        const levelData = CONFIG.MINING.LEVELS[level];
        const button = card.querySelector('.upgrade-btn');
        
        if (!button) return;
        
        if (level === currentLevel) {
            // Current level
            button.textContent = 'Active';
            button.classList.add('active-btn');
            button.disabled = true;
            card.classList.add('active');
        } else if (level < currentLevel) {
            // Lower level
            button.textContent = 'Upgraded';
            button.classList.add('active-btn');
            button.disabled = true;
            card.classList.remove('active');
        } else {
            // Higher level
            const canAfford = usdtBalance >= levelData.cost;
            button.textContent = canAfford ? 'Upgrade' : `${levelData.cost} USDT`;
            button.disabled = !canAfford;
            button.classList.remove('active-btn');
            card.classList.remove('active');
        }
    });
}

function updateBoosterCards() {
    if (!elements.boosterCards || !walletData) return;
    
    const amskBalance = walletData.balances.AMSK || 0;
    
    elements.boosterCards.forEach(card => {
        const boosterType = card.dataset.booster;
        const boosterConfig = CONFIG.MINING.BOOSTERS[boosterType];
        const button = card.querySelector('.booster-btn');
        
        if (!button || !boosterConfig) return;
        
        // Check if booster is active
        const isActive = walletData.mining.activeBoosters.some(b => b.type === boosterType);
        const canAfford = amskBalance >= boosterConfig.price;
        
        if (isActive) {
            button.textContent = 'Active';
            button.disabled = true;
            button.classList.add('active-btn');
            card.classList.add('active');
        } else {
            button.textContent = canAfford ? 'Activate' : `${formatNumber(boosterConfig.price)} AMSK`;
            button.disabled = !canAfford;
            button.classList.remove('active-btn');
            card.classList.remove('active');
        }
    });
}

async function handleMiningAction() {
    if (!walletData.mining) return;
    
    const mining = walletData.mining;
    const now = Date.now();
    
    if (!mining.active) {
        // Start mining
        await startMining();
    } else if (now >= mining.nextReward) {
        // Claim reward
        await claimMiningReward();
    } else {
        showMessage("⏳ Mining in progress. Reward not ready yet.", "info");
    }
}

async function startMining() {
    try {
        walletData.mining.active = true;
        walletData.mining.lastReward = Date.now();
        walletData.mining.nextReward = Date.now() + CONFIG.MINING.DURATION;
        
        // Update UI
        updateMiningDisplay();
        
        // Save data
        saveUserData();
        
        showMessage("⚡ Quantum mining started!", "success");
        
    } catch (error) {
        console.error("❌ Error starting mining:", error);
        showMessage("Failed to start mining", "error");
    }
}

async function claimMiningReward() {
    try {
        const level = CONFIG.MINING.LEVELS[walletData.mining.level];
        let reward = level.reward;
        
        // Apply booster multipliers
        walletData.mining.activeBoosters.forEach(booster => {
            const boosterConfig = CONFIG.MINING.BOOSTERS[booster.type];
            if (boosterConfig) {
                reward *= boosterConfig.multiplier;
            }
        });
        
        // Update balances
        walletData.balances.AMSK = (walletData.balances.AMSK || 0) + reward;
        walletData.mining.totalMined = (walletData.mining.totalMined || 0) + reward;
        walletData.mining.minedToday = (walletData.mining.minedToday || 0) + reward;
        walletData.mining.lastReward = Date.now();
        walletData.mining.nextReward = Date.now() + CONFIG.MINING.DURATION;
        
        // Update UI
        updateMiningDisplay();
        updateWalletUI();
        updateTotalBalance();
        
        // Save data
        saveUserData();
        
        // Show notification
        showMessage(`💰 +${formatNumber(reward)} AMSK mined!`, "success");
        
    } catch (error) {
        console.error("❌ Error claiming mining reward:", error);
        showMessage("Failed to claim reward", "error");
    }
}

async function upgradeMiningLevel(level) {
    try {
        level = parseInt(level);
        const levelData = CONFIG.MINING.LEVELS[level];
        
        if (!levelData) {
            throw new Error("Invalid mining level");
        }
        
        // Check if already at this level
        if (level <= walletData.mining.level) {
            showMessage("Already at or above this level!", "warning");
            return;
        }
        
        // Check USDT balance
        if (walletData.balances.USDT < levelData.cost) {
            showMessage(`Insufficient USDT. Need ${levelData.cost} USDT.`, "error");
            return;
        }
        
        // Deduct USDT and upgrade
        walletData.balances.USDT -= levelData.cost;
        walletData.mining.level = level;
        
        // Update UI
        updateMiningDisplay();
        updateWalletUI();
        updateTotalBalance();
        updateUpgradeCards();
        
        // Save data
        saveUserData();
        
        // Show success
        showMessage(`⚡ Upgraded to ${levelData.name} level!`, "success");
        
    } catch (error) {
        console.error("❌ Error upgrading mining level:", error);
        showMessage("Failed to upgrade mining level", "error");
    }
}

async function activateBooster(boosterType) {
    try {
        const boosterConfig = CONFIG.MINING.BOOSTERS[boosterType];
        
        if (!boosterConfig) {
            throw new Error("Booster not found");
        }
        
        // Check if already active
        const isActive = walletData.mining.activeBoosters.some(b => b.type === boosterType);
        if (isActive) {
            showMessage("This booster is already active!", "warning");
            return;
        }
        
        // Check AMSK balance
        if (walletData.balances.AMSK < boosterConfig.price) {
            showMessage(`Insufficient AMSK. Need ${boosterConfig.price} AMSK.`, "error");
            return;
        }
        
        // Deduct AMSK
        walletData.balances.AMSK -= boosterConfig.price;
        
        // Add booster
        walletData.mining.activeBoosters.push({
            type: boosterType,
            multiplier: boosterConfig.multiplier,
            activatedAt: Date.now(),
            expiresAt: Date.now() + boosterConfig.duration
        });
        
        // Update UI
        updateMiningDisplay();
        updateWalletUI();
        updateTotalBalance();
        updateBoosterCards();
        
        // Save data
        saveUserData();
        
        // Show success
        showMessage(`⚡ ${boosterType} Booster activated! Mining speed ×${boosterConfig.multiplier}`, "success");
        
    } catch (error) {
        console.error("❌ Error activating booster:", error);
        showMessage("Failed to activate booster", "error");
    }
}

// ============================================
// STAKING SYSTEM - VIP STYLE
// ============================================
function updateStakingDisplay() {
    updateStakingCalculator();
    updateActiveStakes();
}

function updateStakingCalculator() {
    if (!elements.calcAmount || !elements.calcDuration) return;
    
    const amount = parseFloat(elements.calcAmount.value) || 100;
    const duration = parseInt(elements.calcDuration.value) || 7;
    
    // Calculate APR based on duration
    let apr = 40; // Default for 7 days
    let dailyReward = 0;
    
    if (duration === 15) {
        apr = 50;
        dailyReward = (amount * 0.5) / 15;
    } else if (duration === 30) {
        apr = 60;
        dailyReward = (amount * 0.6) / 30;
    } else {
        dailyReward = (amount * 0.4) / 7;
    }
    
    const totalProfit = dailyReward * duration;
    const totalReturn = amount + totalProfit;
    
    // Update display
    if (elements.calcTotalProfit) {
        elements.calcTotalProfit.textContent = `${formatNumber(totalProfit)} AMSK`;
    }
    
    if (elements.calcDailyProfit) {
        elements.calcDailyProfit.textContent = `${dailyReward.toFixed(2)} AMSK`;
    }
    
    if (elements.calcTotalReturn) {
        elements.calcTotalReturn.textContent = `${formatNumber(totalReturn)} AMSK`;
    }
}

function updateActiveStakes() {
    if (!elements.activeStakesList) return;
    
    const activeStakes = walletData.staking.activeStakes || [];
    
    if (!activeStakes.length) {
        elements.activeStakesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No active stakes</p>
                <small>Start staking to earn rewards</small>
            </div>
        `;
        return;
    }
    
    let html = '';
    activeStakes.forEach((stake, index) => {
        const plan = CONFIG.STAKING.PLANS[stake.planId];
        if (!plan) return;
        
        const now = Date.now();
        const startTime = stake.startTime || now;
        const durationMs = plan.duration * 24 * 60 * 60 * 1000;
        const endTime = startTime + durationMs;
        const progress = Math.min(((now - startTime) / durationMs) * 100, 100);
        const daysLeft = Math.ceil((endTime - now) / (24 * 60 * 60 * 1000));
        
        html += `
            <div class="stake-item">
                <div class="stake-header">
                    <div class="stake-info">
                        <h5>${plan.name}</h5>
                        <span class="stake-amount">${plan.amount} USDT</span>
                    </div>
                    <span class="status-badge active">Active</span>
                </div>
                
                <div class="stake-progress">
                    <div class="progress-info">
                        <span>${Math.round(progress)}%</span>
                        <span>${daysLeft} days left</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
                
                <div class="stake-details">
                    <div class="detail">
                        <i class="fas fa-calendar"></i>
                        <span>${plan.duration} Days</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-percentage"></i>
                        <span>${plan.apr}% APR</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-gift"></i>
                        <span>${plan.daily} AMSK/Day</span>
                    </div>
                </div>
                
                <div class="stake-actions">
                    <button class="btn-secondary" onclick="cancelStake(${index})" ${progress < 50 ? '' : 'disabled'}>
                        Cancel
                    </button>
                    <button class="btn-primary" onclick="claimStakeReward(${index})" ${progress >= 100 ? '' : 'disabled'}>
                        Claim
                    </button>
                </div>
            </div>
        `;
    });
    
    elements.activeStakesList.innerHTML = html;
}

async function openStakeModal(planId) {
    const plan = CONFIG.STAKING.PLANS[planId];
    if (!plan) return;
    
    const modalContent = `
        <div class="modal-overlay" id="stakeModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-gem"></i> ${plan.name} Staking</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="selected-plan">
                        <div class="plan-icon">
                            <i class="fas fa-gem"></i>
                        </div>
                        <div class="plan-details">
                            <h4>${plan.name}</h4>
                            <div class="plan-amount">${plan.amount} USDT</div>
                        </div>
                    </div>
                    
                    <div class="stake-info">
                        <div class="info-item">
                            <span>Duration:</span>
                            <span>${plan.duration} Days</span>
                        </div>
                        <div class="info-item">
                            <span>APR:</span>
                            <span>${plan.apr}%</span>
                        </div>
                        <div class="info-item">
                            <span>Daily Reward:</span>
                            <span>${plan.daily} AMSK</span>
                        </div>
                        <div class="info-item total">
                            <span>Total Reward:</span>
                            <span>${plan.daily * plan.duration} AMSK</span>
                        </div>
                    </div>
                    
                    <div class="stake-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>USDT will be locked for ${plan.duration} days</span>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="closeModal()">
                            Cancel
                        </button>
                        <button class="btn-primary" onclick="confirmStaking(${planId})">
                            Confirm Stake
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

async function confirmStaking(planId) {
    try {
        const plan = CONFIG.STAKING.PLANS[planId];
        if (!plan) {
            throw new Error("Plan not found");
        }
        
        // Check USDT balance
        if (walletData.balances.USDT < plan.amount) {
            showMessage("Insufficient USDT balance", "error");
            return;
        }
        
        // Deduct USDT
        walletData.balances.USDT -= plan.amount;
        
        // Create stake object
        const stake = {
            planId: planId,
            amount: plan.amount,
            startTime: Date.now(),
            duration: plan.duration,
            dailyReward: plan.daily,
            claimed: false
        };
        
        // Add to active stakes
        if (!walletData.staking.activeStakes) {
            walletData.staking.activeStakes = [];
        }
        walletData.staking.activeStakes.push(stake);
        walletData.staking.totalStaked = (walletData.staking.totalStaked || 0) + plan.amount;
        
        // Update UI
        updateWalletUI();
        updateTotalBalance();
        updateActiveStakes();
        
        // Close modal
        closeModal();
        
        // Show success
        showMessage(`✅ Staked ${plan.amount} USDT for ${plan.duration} days!`, "success");
        
        // Save data
        saveUserData();
        
        // Create transaction record
        await createTransaction({
            type: 'stake',
            amount: plan.amount,
            currency: 'USDT',
            details: `${plan.name} - ${plan.duration} days`
        });
        
    } catch (error) {
        console.error("❌ Error confirming stake:", error);
        showMessage("Failed to process stake", "error");
    }
}

async function claimStakeReward(stakeIndex) {
    try {
        const activeStakes = walletData.staking.activeStakes || [];
        const stake = activeStakes[stakeIndex];
        if (!stake) {
            throw new Error("Stake not found");
        }
        
        const plan = CONFIG.STAKING.PLANS[stake.planId];
        if (!plan) {
            throw new Error("Plan not found");
        }
        
        const now = Date.now();
        const endTime = stake.startTime + (plan.duration * 24 * 60 * 60 * 1000);
        
        // Check if stake period is complete
        if (now < endTime) {
            showMessage("Stake period not completed yet", "warning");
            return;
        }
        
        // Calculate total reward
        const totalReward = plan.daily * plan.duration;
        
        // Add reward to AMSK balance
        walletData.balances.AMSK += totalReward;
        
        // Return staked USDT
        walletData.balances.USDT += stake.amount;
        
        // Update staking stats
        walletData.staking.totalEarned = (walletData.staking.totalEarned || 0) + totalReward;
        
        // Remove from active stakes
        activeStakes.splice(stakeIndex, 1);
        
        // Update UI
        updateWalletUI();
        updateTotalBalance();
        updateActiveStakes();
        
        // Show success
        showMessage(`💰 Claimed ${totalReward} AMSK from staking!`, "success");
        
        // Save data
        saveUserData();
        
        // Create transaction record
        await createTransaction({
            type: 'stake_reward',
            amount: totalReward,
            currency: 'AMSK',
            details: `${plan.name} completion`
        });
        
    } catch (error) {
        console.error("❌ Error claiming stake reward:", error);
        showMessage("Failed to claim stake reward", "error");
    }
}

function cancelStake(stakeIndex) {
    const activeStakes = walletData.staking.activeStakes || [];
    const stake = activeStakes[stakeIndex];
    
    if (!stake) return;
    
    const plan = CONFIG.STAKING.PLANS[stake.planId];
    if (!plan) return;
    
    // Check if can cancel (less than 50% progress)
    const now = Date.now();
    const startTime = stake.startTime || now;
    const durationMs = plan.duration * 24 * 60 * 60 * 1000;
    const progress = ((now - startTime) / durationMs) * 100;
    
    if (progress >= 50) {
        showMessage("Cannot cancel stake after 50% completion", "warning");
        return;
    }
    
    // Return 50% of staked amount
    const returnedAmount = stake.amount * 0.5;
    walletData.balances.USDT += returnedAmount;
    
    // Remove from active stakes
    activeStakes.splice(stakeIndex, 1);
    
    // Update UI
    updateWalletUI();
    updateTotalBalance();
    updateActiveStakes();
    
    showMessage(`⚠️ Stake canceled. ${returnedAmount.toFixed(2)} USDT returned (50% penalty)`, "warning");
    saveUserData();
}

// ============================================
// WALLET SYSTEM - VIP STYLE
// ============================================
function updateWalletUI() {
    if (!walletData.balances) return;
    
    const { AMSK, USDT, BNB, TON } = walletData.balances;
    const { PRICES } = CONFIG;
    
    // Update AMSK
    if (elements.assetAmskBalance) {
        elements.assetAmskBalance.textContent = formatNumber(AMSK);
    }
    if (elements.assetAmskUsd) {
        elements.assetAmskUsd.textContent = (AMSK * PRICES.AMSK).toFixed(2);
    }
    
    // Update USDT
    if (elements.assetUsdtBalance) {
        elements.assetUsdtBalance.textContent = USDT.toFixed(2);
    }
    if (elements.assetUsdtUsd) {
        elements.assetUsdtUsd.textContent = USDT.toFixed(2);
    }
    
    // Update BNB
    if (elements.assetBnbBalance) {
        elements.assetBnbBalance.textContent = BNB.toFixed(4);
    }
    if (elements.assetBnbUsd) {
        elements.assetBnbUsd.textContent = (BNB * PRICES.BNB).toFixed(2);
    }
    
    // Update TON
    if (elements.assetTonBalance) {
        elements.assetTonBalance.textContent = formatNumber(TON);
    }
    if (elements.assetTonUsd) {
        elements.assetTonUsd.textContent = (TON * PRICES.TON).toFixed(2);
    }
    
    updateTotalBalance();
}

function updateTotalBalance() {
    if (!walletData.balances) return;
    
    const { AMSK, USDT, BNB, TON } = walletData.balances;
    const { PRICES } = CONFIG;
    
    const totalAMSK = AMSK || 0;
    const totalUSD = (AMSK * PRICES.AMSK) + (USDT * PRICES.USDT) + (BNB * PRICES.BNB) + (TON * PRICES.TON);
    
    if (elements.totalBalanceAmsk) {
        elements.totalBalanceAmsk.textContent = formatNumber(totalAMSK);
    }
    
    if (elements.totalBalanceUsd) {
        elements.totalBalanceUsd.textContent = totalUSD.toFixed(2);
    }
    
    if (elements.walletTotalAmsk) {
        elements.walletTotalAmsk.textContent = formatNumber(totalAMSK);
    }
    
    if (elements.walletTotalUsd) {
        elements.walletTotalUsd.textContent = totalUSD.toFixed(2);
    }
}

function openDepositModal(currency = 'USDT') {
    const minDeposit = CONFIG.MIN_DEPOSIT[currency] || 10;
    const address = currency === 'TON' ? CONFIG.ADDRESSES.TON : CONFIG.ADDRESSES.BNB_USDT;
    
    const modalContent = `
        <div class="modal-overlay" id="depositModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-arrow-down"></i> Deposit ${currency}</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="deposit-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Send only <strong>${currency}</strong> to this address</span>
                    </div>
                    
                    <div class="address-card">
                        <div class="address-label">Deposit Address:</div>
                        <div class="address-value">${address}</div>
                        <button class="copy-btn" onclick="copyToClipboard('${address}')">
                            <i class="fas fa-copy"></i> Copy Address
                        </button>
                    </div>
                    
                    <div class="deposit-form">
                        <div class="form-group">
                            <label>Amount (${currency})</label>
                            <input type="number" id="deposit-amount" 
                                   min="${minDeposit}" 
                                   step="${currency === 'BNB' ? '0.001' : '1'}"
                                   placeholder="Enter amount">
                        </div>
                        
                        <div class="form-group">
                            <label>Transaction ID</label>
                            <input type="text" id="deposit-txid" 
                                   placeholder="Enter transaction hash">
                        </div>
                        
                        <div class="min-deposit">
                            <i class="fas fa-info-circle"></i>
                            Minimum deposit: ${minDeposit} ${currency}
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="closeModal()">
                            Cancel
                        </button>
                        <button class="btn-primary" onclick="submitDeposit('${currency}')">
                            Submit Deposit Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

async function submitDeposit(currency) {
    try {
        const amount = parseFloat(document.getElementById('deposit-amount')?.value);
        const txid = document.getElementById('deposit-txid')?.value.trim();
        
        const minDeposit = CONFIG.MIN_DEPOSIT[currency];
        
        // Validation
        if (!amount || amount < minDeposit) {
            showMessage(`Minimum deposit is ${minDeposit} ${currency}`, "error");
            return;
        }
        
        if (!txid) {
            showMessage("Please enter transaction ID", "error");
            return;
        }
        
        // Check if transaction already used
        if (walletData.usedTransactions.includes(txid.toLowerCase())) {
            showMessage("This transaction ID has already been used", "error");
            return;
        }
        
        // Create deposit request
        const depositRequest = {
            id: 'deposit_' + Date.now(),
            userId: userData.id,
            username: userData.username,
            currency: currency,
            amount: amount,
            txid: txid,
            status: 'pending',
            timestamp: Date.now()
        };
        
        // Add to pending deposits
        walletData.pendingDeposits.push(depositRequest);
        walletData.usedTransactions.push(txid.toLowerCase());
        
        // Save to Firebase if available
        if (db) {
            await db.collection('deposit_requests').add({
                ...depositRequest,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Save local data
        saveUserData();
        
        // Close modal
        closeModal();
        
        // Show success
        showMessage(`✅ Deposit request submitted for ${amount} ${currency}`, "success");
        showMessage("⏳ Your deposit is pending admin review", "info");
        
        // Create transaction record
        await createTransaction({
            type: 'deposit_request',
            amount: amount,
            currency: currency,
            details: 'Pending admin approval'
        });
        
    } catch (error) {
        console.error("❌ Error submitting deposit:", error);
        showMessage("Failed to submit deposit request", "error");
    }
}

function openWithdrawModal() {
    const usdtBalance = walletData.balances?.USDT || 0;
    const bnbBalance = walletData.balances?.BNB || 0;
    const minWithdraw = CONFIG.WITHDRAWAL.MIN_USDT;
    const feeBNB = CONFIG.WITHDRAWAL.FEE_BNB;
    
    const canWithdraw = usdtBalance >= minWithdraw && bnbBalance >= feeBNB;
    
    const modalContent = `
        <div class="modal-overlay" id="withdrawModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-arrow-up"></i> Withdraw USDT</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="balance-info">
                        <div class="balance-item">
                            <span>Available USDT:</span>
                            <span class="amount">${usdtBalance.toFixed(2)} USDT</span>
                        </div>
                        <div class="balance-item">
                            <span>Available BNB (for fee):</span>
                            <span class="amount ${bnbBalance >= feeBNB ? 'success' : 'error'}">
                                ${bnbBalance.toFixed(6)} BNB
                            </span>
                        </div>
                    </div>
                    
                    <div class="withdraw-form">
                        <div class="form-group">
                            <label>Amount (USDT)</label>
                            <input type="number" id="withdraw-amount" 
                                   value="${Math.max(minWithdraw, Math.min(100, usdtBalance)).toFixed(2)}"
                                   min="${minWithdraw}"
                                   max="${usdtBalance}"
                                   step="0.01"
                                   placeholder="Enter amount">
                        </div>
                        
                        <div class="form-group">
                            <label>Wallet Address (BEP20)</label>
                            <input type="text" id="withdraw-address" 
                                   placeholder="0x..."
                                   maxlength="42">
                        </div>
                        
                        <div class="fee-info">
                            <div class="fee-item">
                                <i class="fas fa-gas-pump"></i>
                                <span>Network fee: ${feeBNB} BNB (≈ $${CONFIG.WITHDRAWAL.FEE_USD})</span>
                            </div>
                            <div class="fee-item">
                                <i class="fas fa-exclamation-circle"></i>
                                <span>Minimum withdrawal: ${minWithdraw} USDT</span>
                            </div>
                        </div>
                        
                        <div class="requirements">
                            <div class="requirement ${usdtBalance >= minWithdraw ? 'met' : 'not-met'}">
                                <i class="fas ${usdtBalance >= minWithdraw ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                                <span>Minimum ${minWithdraw} USDT</span>
                            </div>
                            <div class="requirement ${bnbBalance >= feeBNB ? 'met' : 'not-met'}">
                                <i class="fas ${bnbBalance >= feeBNB ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                                <span>${feeBNB} BNB fee available</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="closeModal()">
                            Cancel
                        </button>
                        <button class="btn-primary" onclick="submitWithdrawal()" ${canWithdraw ? '' : 'disabled'}>
                            Submit Withdrawal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

async function submitWithdrawal() {
    try {
        const amount = parseFloat(document.getElementById('withdraw-amount')?.value);
        const address = document.getElementById('withdraw-address')?.value.trim();
        
        const minWithdraw = CONFIG.WITHDRAWAL.MIN_USDT;
        const feeBNB = CONFIG.WITHDRAWAL.FEE_BNB;
        const usdtBalance = walletData.balances?.USDT || 0;
        const bnbBalance = walletData.balances?.BNB || 0;
        
        // Validation
        if (!amount || amount < minWithdraw) {
            showMessage(`Minimum withdrawal is ${minWithdraw} USDT`, "error");
            return;
        }
        
        if (amount > usdtBalance) {
            showMessage("Insufficient USDT balance", "error");
            return;
        }
        
        if (!address || !address.startsWith('0x') || address.length !== 42) {
            showMessage("Please enter valid BEP20 address", "error");
            return;
        }
        
        if (bnbBalance < feeBNB) {
            showMessage(`Insufficient BNB for fee. Need ${feeBNB} BNB`, "error");
            return;
        }
        
        // Create withdrawal request
        const withdrawalRequest = {
            id: 'withdrawal_' + Date.now(),
            userId: userData.id,
            username: userData.username,
            amount: amount,
            address: address,
            currency: 'USDT',
            fee: feeBNB,
            status: 'pending',
            timestamp: Date.now(),
            note: 'Awaiting manual processing'
        };
        
        // Deduct balances immediately
        walletData.balances.USDT -= amount;
        walletData.balances.BNB -= feeBNB;
        
        // Add to pending withdrawals
        walletData.pendingWithdrawals.push(withdrawalRequest);
        
        // Save to Firebase if available
        if (db) {
            await db.collection('withdrawal_requests').add({
                ...withdrawalRequest,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Update UI
        updateWalletUI();
        
        // Close modal
        closeModal();
        
        // Show success
        showMessage(`✅ Withdrawal request submitted for ${amount} USDT`, "success");
        showMessage("⏳ Your withdrawal is pending admin review", "info");
        
        // Save user data
        saveUserData();
        
        // Create transaction record
        await createTransaction({
            type: 'withdrawal_request',
            amount: amount,
            currency: 'USDT',
            details: 'Pending admin approval'
        });
        
    } catch (error) {
        console.error("❌ Error submitting withdrawal:", error);
        showMessage("Failed to submit withdrawal request", "error");
    }
}

function openSwapModal() {
    const modalContent = `
        <div class="modal-overlay" id="swapModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-exchange-alt"></i> Swap Tokens</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="swap-container">
                        <div class="swap-from">
                            <div class="swap-label">
                                <span>From</span>
                                <select id="swap-from-currency" onchange="updateSwapCalculation()">
                                    <option value="AMSK">AMSK</option>
                                    <option value="USDT">USDT</option>
                                    <option value="BNB">BNB</option>
                                    <option value="TON">TON</option>
                                </select>
                            </div>
                            <div class="swap-input">
                                <input type="number" 
                                       id="swap-from-amount" 
                                       value="1000"
                                       min="1"
                                       oninput="updateSwapCalculation()"
                                       placeholder="0">
                                <div class="balance-label">
                                    Balance: <span id="swap-from-balance">0</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="swap-arrow">
                            <i class="fas fa-exchange-alt"></i>
                        </div>
                        
                        <div class="swap-to">
                            <div class="swap-label">
                                <span>To</span>
                                <select id="swap-to-currency" onchange="updateSwapCalculation()">
                                    <option value="USDT">USDT</option>
                                    <option value="AMSK">AMSK</option>
                                    <option value="BNB" disabled>BNB</option>
                                    <option value="TON" disabled>TON</option>
                                </select>
                            </div>
                            <div class="swap-output">
                                <div id="swap-to-amount">0.00</div>
                                <div class="balance-label">
                                    Balance: <span id="swap-to-balance">0</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="swap-info">
                            <div class="info-item">
                                <i class="fas fa-chart-line"></i>
                                <span>Rate: 1 AMSK = ${CONFIG.PRICES.AMSK} USDT</span>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-percentage"></i>
                                <span>Fee: 0%</span>
                            </div>
                        </div>
                        
                        <div class="swap-preview">
                            <div class="preview-item">
                                <span>You Send:</span>
                                <span id="preview-send">0</span>
                            </div>
                            <div class="preview-item">
                                <span>You Receive:</span>
                                <span id="preview-receive">0.00</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="closeModal()">
                            Cancel
                        </button>
                        <button class="btn-primary" onclick="executeSwap()">
                            Confirm Swap
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
    updateSwapCalculation();
}

function updateSwapCalculation() {
    const fromCurrency = document.getElementById('swap-from-currency')?.value;
    const toCurrency = document.getElementById('swap-to-currency')?.value;
    const fromAmount = parseFloat(document.getElementById('swap-from-amount')?.value) || 0;
    
    if (!fromCurrency || !toCurrency || fromAmount <= 0) return;
    
    // Get balances
    const balances = walletData.balances || {};
    const fromBalance = balances[fromCurrency] || 0;
    const toBalance = balances[toCurrency] || 0;
    
    // Update balance displays
    if (document.getElementById('swap-from-balance')) {
        document.getElementById('swap-from-balance').textContent = 
            fromCurrency === 'BNB' ? fromBalance.toFixed(4) : formatNumber(fromBalance);
    }
    
    if (document.getElementById('swap-to-balance')) {
        document.getElementById('swap-to-balance').textContent = 
            toCurrency === 'BNB' ? toBalance.toFixed(4) : formatNumber(toBalance);
    }
    
    // Calculate conversion
    let toAmount = 0;
    
    if (fromCurrency === 'AMSK' && toCurrency === 'USDT') {
        toAmount = fromAmount * CONFIG.PRICES.AMSK;
    } else if (fromCurrency === 'USDT' && toCurrency === 'AMSK') {
        toAmount = fromAmount / CONFIG.PRICES.AMSK;
    } else if (fromCurrency === 'BNB' && toCurrency === 'AMSK') {
        toAmount = (fromAmount * CONFIG.PRICES.BNB) / CONFIG.PRICES.AMSK;
    } else if (fromCurrency === 'TON' && toCurrency === 'AMSK') {
        toAmount = (fromAmount * CONFIG.PRICES.TON) / CONFIG.PRICES.AMSK;
    }
    
    // Update display
    if (document.getElementById('swap-to-amount')) {
        document.getElementById('swap-to-amount').textContent = 
            toCurrency === 'USDT' ? toAmount.toFixed(2) : formatNumber(toAmount);
    }
    
    if (document.getElementById('preview-send')) {
        document.getElementById('preview-send').textContent = 
            `${formatNumber(fromAmount)} ${fromCurrency}`;
    }
    
    if (document.getElementById('preview-receive')) {
        document.getElementById('preview-receive').textContent = 
            `${toCurrency === 'USDT' ? toAmount.toFixed(2) : formatNumber(toAmount)} ${toCurrency}`;
    }
}

async function executeSwap() {
    try {
        const fromCurrency = document.getElementById('swap-from-currency')?.value;
        const toCurrency = document.getElementById('swap-to-currency')?.value;
        const fromAmount = parseFloat(document.getElementById('swap-from-amount')?.value) || 0;
        
        if (!fromCurrency || !toCurrency || fromAmount <= 0) {
            showMessage("Please enter valid amount", "error");
            return;
        }
        
        // Get current balances
        const fromBalance = walletData.balances[fromCurrency] || 0;
        const toBalance = walletData.balances[toCurrency] || 0;
        
        // Check balance
        if (fromAmount > fromBalance) {
            showMessage("Insufficient balance", "error");
            return;
        }
        
        // Calculate conversion
        let toAmount = 0;
        
        if (fromCurrency === 'AMSK' && toCurrency === 'USDT') {
            toAmount = fromAmount * CONFIG.PRICES.AMSK;
        } else if (fromCurrency === 'USDT' && toCurrency === 'AMSK') {
            toAmount = fromAmount / CONFIG.PRICES.AMSK;
        } else if (fromCurrency === 'BNB' && toCurrency === 'AMSK') {
            toAmount = (fromAmount * CONFIG.PRICES.BNB) / CONFIG.PRICES.AMSK;
        } else if (fromCurrency === 'TON' && toCurrency === 'AMSK') {
            toAmount = (fromAmount * CONFIG.PRICES.TON) / CONFIG.PRICES.AMSK;
        } else {
            showMessage("Invalid swap pair", "error");
            return;
        }
        
        // Minimum swap amounts
        if (fromCurrency === 'AMSK' && fromAmount < 1000) {
            showMessage("Minimum swap is 1,000 AMSK", "error");
            return;
        }
        
        if (fromCurrency === 'USDT' && fromAmount < 10) {
            showMessage("Minimum swap is 10 USDT", "error");
            return;
        }
        
        if (fromCurrency === 'BNB' && fromAmount < 0.001) {
            showMessage("Minimum swap is 0.001 BNB", "error");
            return;
        }
        
        if (fromCurrency === 'TON' && fromAmount < 1) {
            showMessage("Minimum swap is 1 TON", "error");
            return;
        }
        
        // Execute swap
        walletData.balances[fromCurrency] -= fromAmount;
        walletData.balances[toCurrency] = (toBalance || 0) + toAmount;
        
        // Update UI
        updateWalletUI();
        
        // Close modal
        closeModal();
        
        // Show success
        showMessage(
            `✅ Swapped ${formatNumber(fromAmount)} ${fromCurrency} to ${toCurrency === 'USDT' ? toAmount.toFixed(2) : formatNumber(toAmount)} ${toCurrency}`, 
            "success"
        );
        
        // Save data
        saveUserData();
        
        // Create transaction record
        await createTransaction({
            type: 'swap',
            fromAmount: fromAmount,
            fromCurrency: fromCurrency,
            toAmount: toAmount,
            toCurrency: toCurrency,
            details: `${fromCurrency} → ${toCurrency}`
        });
        
    } catch (error) {
        console.error("❌ Error executing swap:", error);
        showMessage("Failed to execute swap", "error");
    }
}

// ============================================
// TRANSACTION HISTORY - VIP STYLE
// ============================================
function showTransactionHistory() {
    const hasTransactions = 
        walletData.pendingDeposits.length > 0 ||
        walletData.pendingWithdrawals.length > 0 ||
        walletData.depositHistory.length > 0 ||
        walletData.withdrawalHistory.length > 0;
    
    if (!hasTransactions) {
        const modalHTML = `
            <div class="modal-overlay" id="historyModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-history"></i> Transaction History</h3>
                        <button class="modal-close" onclick="closeModal()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="empty-state">
                            <i class="fas fa-inbox"></i>
                            <p>No transactions yet</p>
                            <small>Your transaction history will appear here</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        return;
    }
    
    const modalHTML = `
        <div class="modal-overlay" id="historyModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-history"></i> Transaction History</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="history-tabs">
                        <button class="tab-btn active" onclick="switchHistoryTab('all')">All</button>
                        <button class="tab-btn" onclick="switchHistoryTab('deposits')">Deposits</button>
                        <button class="tab-btn" onclick="switchHistoryTab('withdrawals')">Withdrawals</button>
                        <button class="tab-btn" onclick="switchHistoryTab('pending')">Pending</button>
                    </div>
                    
                    <div class="history-list" id="historyList">
                        ${renderTransactionHistory('all')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function renderTransactionHistory(filter = 'all') {
    let allTransactions = [];
    
    // Add pending deposits
    walletData.pendingDeposits.forEach(deposit => {
        allTransactions.push({
            ...deposit,
            type: 'deposit_request',
            status: 'pending'
        });
    });
    
    // Add pending withdrawals
    walletData.pendingWithdrawals.forEach(withdrawal => {
        allTransactions.push({
            ...withdrawal,
            type: 'withdrawal_request',
            status: 'pending'
        });
    });
    
    // Add deposit history
    walletData.depositHistory.forEach(deposit => {
        allTransactions.push({
            ...deposit,
            type: deposit.status === 'approved' ? 'deposit' : 'deposit_reject',
            status: deposit.status
        });
    });
    
    // Add withdrawal history
    walletData.withdrawalHistory.forEach(withdrawal => {
        allTransactions.push({
            ...withdrawal,
            type: withdrawal.status === 'completed' ? 'withdraw' : 'withdraw_reject',
            status: withdrawal.status
        });
    });
    
    // Add staking transactions
    // (You can add staking transactions here if you track them separately)
    
    // Filter transactions
    if (filter !== 'all') {
        allTransactions = allTransactions.filter(tx => {
            if (filter === 'pending') {
                return tx.status === 'pending';
            } else if (filter === 'deposits') {
                return tx.type.includes('deposit');
            } else if (filter === 'withdrawals') {
                return tx.type.includes('withdraw');
            }
            return true;
        });
    }
    
    // Sort by timestamp (newest first)
    allTransactions.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    if (allTransactions.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No transactions found</p>
            </div>
        `;
    }
    
    let html = '';
    allTransactions.forEach(tx => {
        const date = new Date(tx.timestamp).toLocaleString();
        let icon = 'fa-exchange-alt';
        let color = '#3b82f6';
        let statusText = tx.status || 'completed';
        
        switch (tx.type) {
            case 'deposit_request':
            case 'deposit':
                icon = 'fa-arrow-down';
                color = tx.status === 'approved' ? '#22c55e' : 
                       tx.status === 'rejected' ? '#ef4444' : '#f59e0b';
                break;
            case 'withdrawal_request':
            case 'withdraw':
                icon = 'fa-arrow-up';
                color = tx.status === 'completed' ? '#22c55e' : 
                       tx.status === 'rejected' ? '#ef4444' : '#f59e0b';
                break;
            case 'swap':
                icon = 'fa-exchange-alt';
                color = '#8b5cf6';
                break;
            case 'stake':
            case 'stake_reward':
                icon = 'fa-gem';
                color = '#ec4899';
                break;
        }
        
        html += `
            <div class="history-item">
                <div class="tx-icon" style="background: ${color}20; color: ${color}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="tx-details">
                    <div class="tx-type">${formatTransactionType(tx.type)}</div>
                    <div class="tx-date">${date}</div>
                    ${tx.details ? `<div class="tx-note">${tx.details}</div>` : ''}
                    ${tx.status === 'rejected' && tx.rejectionReason ? 
                      `<div class="tx-note" style="color: #ef4444;">Reason: ${tx.rejectionReason}</div>` : ''}
                </div>
                <div class="tx-amount" style="color: ${color}">
                    ${tx.type === 'swap' ? 
                      `${formatNumber(tx.fromAmount)} ${tx.fromCurrency} → ${tx.toCurrency === 'USDT' ? tx.toAmount.toFixed(2) : formatNumber(tx.toAmount)} ${tx.toCurrency}` :
                      `${tx.type.includes('withdraw') || tx.type.includes('reject') ? '-' : '+'}${formatNumber(tx.amount)} ${tx.currency || 'USDT'}`}
                </div>
                <div class="tx-status ${tx.status || 'completed'}">
                    ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}
                </div>
            </div>
        `;
    });
    
    return html;
}

function switchHistoryTab(tabName) {
    const historyList = document.getElementById('historyList');
    if (historyList) {
        historyList.innerHTML = renderTransactionHistory(tabName);
    }
}

function formatTransactionType(type) {
    const types = {
        'deposit_request': 'Deposit Request',
        'deposit': 'Deposit',
        'withdrawal_request': 'Withdrawal Request',
        'withdraw': 'Withdrawal',
        'swap': 'Token Swap',
        'stake': 'Staking',
        'stake_reward': 'Staking Reward',
        'deposit_reject': 'Deposit Rejected',
        'withdraw_reject': 'Withdrawal Rejected'
    };
    
    return types[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

async function createTransaction(transactionData) {
    if (!db) return;
    
    try {
        const transaction = {
            userId: userData.id,
            username: userData.username,
            ...transactionData,
            timestamp: Date.now(),
            status: transactionData.status || 'completed'
        };
        
        await db.collection('transactions').add({
            ...transaction,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
    } catch (error) {
        console.error("❌ Error creating transaction:", error);
    }
}

// ============================================
// REFERRAL SYSTEM - VIP STYLE
// ============================================
function checkForReferral() {
    console.log("🔍 Checking for referral...");
    
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) {
        const telegramRef = tg.initDataUnsafe.start_param;
        if (telegramRef && telegramRef !== userData.referralCode) {
            console.log("📱 Telegram referral detected:", telegramRef);
            processReferral(telegramRef);
            return;
        }
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const referrerCode = urlParams.get('startapp') || urlParams.get('ref') || urlParams.get('start');
    
    if (referrerCode && referrerCode !== userData.referralCode) {
        console.log("🔗 URL referral detected:", referrerCode);
        processReferral(referrerCode);
    }
}

async function processReferral(referralCode) {
    if (!referralCode || referralCode === userData.referralCode) {
        console.log("⚠️ Invalid or self-referral");
        return;
    }
    
    if (walletData.referrals.referredBy) {
        console.log("⚠️ User already referred by:", walletData.referrals.referredBy);
        return;
    }
    
    console.log("🎯 Processing referral:", referralCode);
    
    try {
        if (db) {
            const usersRef = db.collection('users');
            const querySnapshot = await usersRef.where('referralCode', '==', referralCode).get();
            
            if (!querySnapshot.empty) {
                const referrerDoc = querySnapshot.docs[0];
                const referrerData = referrerDoc.data();
                
                if (referrerData.id === userData.id) {
                    console.log("⚠️ Cannot refer yourself");
                    return;
                }
                
                // Update referrer's data
                await referrerDoc.ref.update({
                    'referrals.count': firebase.firestore.FieldValue.increment(1),
                    'referrals.earned': firebase.firestore.FieldValue.increment(10000),
                    'balances.AMSK': firebase.firestore.FieldValue.increment(10000)
                });
                
                // Update current user
                walletData.referrals.referredBy = referralCode;
                walletData.balances.AMSK += 5000; // Welcome bonus
                walletData.referrals.earned += 5000;
                
                // Update UI
                updateWalletUI();
                
                showMessage(`🎉 Welcome bonus received! +5,000 AMSK`, "success");
                
                // Save data
                saveUserData();
                
                console.log("✅ Referral processed successfully");
                return true;
            }
        }
        
        // Local fallback
        walletData.referrals.referredBy = referralCode;
        walletData.balances.AMSK += 5000;
        walletData.referrals.earned += 5000;
        
        updateWalletUI();
        saveUserData();
        
        showMessage(`🎉 Welcome bonus received! +5,000 AMSK`, "success");
        
        console.log("📝 Referral recorded (local storage)");
        return true;
        
    } catch (error) {
        console.error("❌ Referral processing error:", error);
        return false;
    }
}

// ============================================
// ADMIN SYSTEM - VIP STYLE
// ============================================
function initAdminSystem() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', handleLogoClick);
        console.log("💎 Admin system initialized");
    }
}

function handleLogoClick() {
    const now = Date.now();
    
    if (now - lastGemClickTime > 2000) {
        gemClickCount = 0;
    }
    
    gemClickCount++;
    lastGemClickTime = now;
    
    console.log(`💎 Logo click ${gemClickCount}/5`);
    
    if (gemClickCount >= 5) {
        showAdminLogin();
        gemClickCount = 0;
    }
}

function showAdminLogin() {
    const modalContent = `
        <div class="modal-overlay" id="adminLoginModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-lock"></i> Admin Access</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; padding: 20px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">🔒</div>
                        <h3 style="color: #f8fafc; margin-bottom: 20px;">Administrator Access</h3>
                        <p style="color: #94a3b8; margin-bottom: 30px;">Enter administrator password</p>
                        
                        <div style="margin-bottom: 20px;">
                            <input type="password" 
                                   id="adminPasswordInput" 
                                   style="width: 100%; padding: 12px 15px; background: rgba(0,0,0,0.3); border: 1px solid rgba(59,130,246,0.3); border-radius: 8px; color: white; font-size: 16px;"
                                   placeholder="Enter password">
                        </div>
                        
                        <button onclick="checkAdminPassword()" 
                                style="width: 100%; padding: 12px; background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                        
                        <div id="adminError" style="color: #ef4444; margin-top: 15px; display: none;">
                            <i class="fas fa-exclamation-circle"></i> <span id="adminErrorText"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

function checkAdminPassword() {
    const passwordInput = document.getElementById('adminPasswordInput');
    const errorDiv = document.getElementById('adminError');
    const errorText = document.getElementById('adminErrorText');
    
    if (!passwordInput) return;
    
    if (passwordInput.value !== CONFIG.ADMIN.PASSWORD) {
        if (errorDiv && errorText) {
            errorText.textContent = "Incorrect password";
            errorDiv.style.display = 'block';
        }
        return;
    }
    
    let telegramUserId = null;
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        telegramUserId = tg.initDataUnsafe.user.id.toString();
    }
    
    if (!telegramUserId || telegramUserId !== CONFIG.ADMIN.TELEGRAM_ID) {
        if (errorDiv && errorText) {
            errorText.textContent = "Access denied: Invalid Telegram ID";
            errorDiv.style.display = 'block';
        }
        return;
    }
    
    adminAccess = true;
    closeModal();
    showAdminPanel();
    showMessage("✅ Admin access granted", "success");
}

function showAdminPanel() {
    const modalContent = `
        <div class="modal-overlay" id="adminPanel">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-user-shield"></i> Admin Panel</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                
                <div class="modal-body">
                    <div style="display: flex; gap: 10px; margin-bottom: 25px;">
                        <button class="tab-btn active" onclick="switchAdminTab('deposits')">
                            <i class="fas fa-download"></i> Pending Deposits
                        </button>
                        <button class="tab-btn" onclick="switchAdminTab('withdrawals')">
                            <i class="fas fa-upload"></i> Pending Withdrawals
                        </button>
                        <button class="tab-btn" onclick="switchAdminTab('users')">
                            <i class="fas fa-users"></i> User Management
                        </button>
                    </div>
                    
                    <div id="adminDepositsTab">
                        <div class="section-title">
                            <i class="fas fa-download"></i>
                            <span>Pending Deposit Requests</span>
                        </div>
                        <div id="adminDepositsList" style="max-height: 300px; overflow-y: auto; margin-bottom: 20px;">
                            <div class="empty-state">
                                <i class="fas fa-clock"></i>
                                <p>Loading pending deposits...</p>
                            </div>
                        </div>
                    </div>
                    
                    <div id="adminWithdrawalsTab" style="display: none;">
                        <div class="section-title">
                            <i class="fas fa-upload"></i>
                            <span>Pending Withdrawal Requests</span>
                        </div>
                        <div id="adminWithdrawalsList" style="max-height: 300px; overflow-y: auto; margin-bottom: 20px;">
                            <div class="empty-state">
                                <i class="fas fa-clock"></i>
                                <p>Loading pending withdrawals...</p>
                            </div>
                        </div>
                    </div>
                    
                    <div id="adminUsersTab" style="display: none;">
                        <div class="section-title">
                            <i class="fas fa-user-cog"></i>
                            <span>User Balance Management</span>
                        </div>
                        
                        <div style="background: rgba(15,23,42,0.8); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                            <div style="margin-bottom: 15px;">
                                <div style="font-size: 14px; color: #94a3b8; margin-bottom: 10px;">Add Balance to Specific User</div>
                                
                                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                                    <input type="text" 
                                           id="adminUserId" 
                                           style="flex: 1; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(59,130,246,0.3); border-radius: 8px; color: white;"
                                           placeholder="Enter user ID">
                                    <input type="number" 
                                           id="adminUserAmount" 
                                           style="flex: 1; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(59,130,246,0.3); border-radius: 8px; color: white;"
                                           placeholder="Amount (AMSK)" 
                                           min="1">
                                </div>
                                
                                <button onclick="addBalanceToSpecificUser()" 
                                        style="width: 100%; padding: 12px; background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; border: none; border-radius: 8px; font-weight: 600;">
                                    <i class="fas fa-plus-circle"></i> Add Balance to User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
    loadAdminPendingRequests('deposits');
}

async function loadAdminPendingRequests(type) {
    if (!adminAccess || !db) return;
    
    try {
        let collection, listId;
        
        if (type === 'deposits') {
            collection = 'deposit_requests';
            listId = 'adminDepositsList';
        } else {
            collection = 'withdrawal_requests';
            listId = 'adminWithdrawalsList';
        }
        
        const query = await db.collection(collection)
            .where('status', '==', 'pending')
            .orderBy('timestamp', 'desc')
            .limit(50)
            .get();
        
        const listElement = document.getElementById(listId);
        if (!listElement) return;
        
        if (query.empty) {
            listElement.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <p>No pending ${type}</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        query.forEach(doc => {
            const data = doc.data();
            const date = data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp || Date.now());
            
            html += `
                <div class="transaction-card" style="margin-bottom: 10px;">
                    <div class="transaction-header">
                        <div class="transaction-type">
                            <div class="type-icon ${type === 'deposits' ? 'deposit' : 'withdrawal'}">
                                <i class="fas fa-${type === 'deposits' ? 'download' : 'upload'}"></i>
                            </div>
                            <div class="type-info">
                                <div class="type-title">${data.username || 'User'}</div>
                                <div class="type-subtitle">ID: ${data.userId || 'Unknown'}</div>
                            </div>
                        </div>
                        <div class="transaction-status pending-badge">
                            <i class="fas fa-clock"></i>
                            <span>Pending</span>
                        </div>
                    </div>
                    <div class="transaction-details">
                        <div class="detail-row">
                            <span>Amount:</span>
                            <span class="detail-value">${data.amount || 0} ${data.currency || 'USDT'}</span>
                        </div>
                        ${type === 'deposits' ? `
                        <div class="detail-row">
                            <span>Transaction:</span>
                            <span class="detail-value">${data.txid ? data.txid.substring(0, 12) + '...' : 'None'}</span>
                        </div>
                        ` : `
                        <div class="detail-row">
                            <span>Address:</span>
                            <span class="detail-value">${data.address ? data.address.substring(0, 12) + '...' : 'None'}</span>
                        </div>
                        `}
                        <div class="detail-row">
                            <span>Date:</span>
                            <span class="detail-value">${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button onclick="adminApproveRequest('${doc.id}', '${type}', '${data.userId}', ${data.amount}, '${data.currency || 'USDT'}')" 
                                style="flex: 1; padding: 8px; background: linear-gradient(135deg, #22c55e, #10b981); color: white; border: none; border-radius: 6px; font-weight: 600;">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button onclick="adminRejectRequest('${doc.id}', '${type}')" 
                                style="flex: 1; padding: 8px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; border-radius: 6px; font-weight: 600;">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    </div>
                </div>
            `;
        });
        
        listElement.innerHTML = html;
        
    } catch (error) {
        console.error(`❌ Error loading pending ${type}:`, error);
        const listElement = document.getElementById(type === 'deposits' ? 'adminDepositsList' : 'adminWithdrawalsList');
        if (listElement) {
            listElement.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load ${type}</p>
                </div>
            `;
        }
    }
}

async function adminApproveRequest(docId, type, userId, amount, currency) {
    if (!adminAccess || !db) return;
    
    if (!confirm(`Approve ${type.slice(0, -1)} of ${amount} ${currency} for user ${userId}?`)) return;
    
    try {
        let collection = type === 'deposits' ? 'deposit_requests' : 'withdrawal_requests';
        
        // Update request status
        await db.collection(collection).doc(docId).update({
            status: 'approved',
            approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
            approvedBy: 'admin'
        });
        
        // If deposit, add balance to user
        if (type === 'deposits') {
            const userRef = db.collection('users').doc(userId);
            await userRef.update({
                [`balances.${currency}`]: firebase.firestore.FieldValue.increment(amount)
            });
        }
        
        showMessage(`✅ ${type.slice(0, -1)} approved!`, "success");
        
        // Reload the list
        loadAdminPendingRequests(type);
        
    } catch (error) {
        console.error(`❌ Error approving ${type} request:`, error);
        showMessage(`Failed to approve ${type.slice(0, -1)}`, "error");
    }
}

async function adminRejectRequest(docId, type) {
    if (!adminAccess || !db) return;
    
    const reason = prompt("Enter rejection reason:", "Invalid information");
    if (!reason) return;
    
    try {
        let collection = type === 'deposits' ? 'deposit_requests' : 'withdrawal_requests';
        
        await db.collection(collection).doc(docId).update({
            status: 'rejected',
            rejectedAt: firebase.firestore.FieldValue.serverTimestamp(),
            rejectedBy: 'admin',
            rejectionReason: reason
        });
        
        showMessage(`❌ ${type.slice(0, -1)} request rejected.`, "warning");
        
        loadAdminPendingRequests(type);
        
    } catch (error) {
        console.error(`❌ Error rejecting ${type} request:`, error);
        showMessage(`Failed to reject ${type.slice(0, -1)}`, "error");
    }
}

async function addBalanceToSpecificUser() {
    if (!adminAccess || !db) return;
    
    const userIdInput = document.getElementById('adminUserId');
    const amountInput = document.getElementById('adminUserAmount');
    
    if (!userIdInput || !amountInput) return;
    
    const userId = userIdInput.value.trim();
    const amount = parseFloat(amountInput.value);
    
    if (!userId) {
        showMessage('Please enter user ID', 'error');
        return;
    }
    
    if (!amount || amount <= 0) {
        showMessage('Please enter a valid amount', 'error');
        return;
    }
    
    if (!confirm(`Add ${amount} AMSK to user ${userId}?`)) return;
    
    try {
        const userRef = db.collection('users').doc(userId);
        
        await userRef.update({
            'balances.AMSK': firebase.firestore.FieldValue.increment(amount),
            lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showMessage(`✅ Added ${amount} AMSK to user ${userId}`, "success");
        
        userIdInput.value = '';
        amountInput.value = '';
        
    } catch (error) {
        console.error("❌ Error adding balance to user:", error);
        showMessage("Failed to add balance to user", "error");
    }
}

function switchAdminTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById('adminDepositsTab').style.display = tabName === 'deposits' ? 'block' : 'none';
    document.getElementById('adminWithdrawalsTab').style.display = tabName === 'withdrawals' ? 'block' : 'none';
    document.getElementById('adminUsersTab').style.display = tabName === 'users' ? 'block' : 'none';
    
    const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(btn => 
        btn.textContent.includes(tabName === 'deposits' ? 'Deposits' : 
                                tabName === 'withdrawals' ? 'Withdrawals' : 'Users')
    );
    if (activeBtn) activeBtn.classList.add('active');
    
    if (tabName !== 'users') {
        loadAdminPendingRequests(tabName);
    }
}

// ============================================
// REAL-TIME LISTENERS - VIP STYLE
// ============================================
function setupRealTimeListeners() {
    if (!db || !userData.id) return;
    
    console.log("👂 Setting up real-time listeners...");
    
    // Listen for deposit updates
    db.collection('deposit_requests')
        .where('userId', '==', userData.id)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const data = change.doc.data();
                if (change.type === 'modified') {
                    updateUserLocalDeposit(change.doc.id, data);
                }
            });
        });
    
    // Listen for withdrawal updates
    db.collection('withdrawal_requests')
        .where('userId', '==', userData.id)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const data = change.doc.data();
                if (change.type === 'modified') {
                    updateUserLocalWithdrawal(change.doc.id, data);
                }
            });
        });
}

function updateUserLocalDeposit(firebaseId, depositData) {
    const status = depositData.status ? depositData.status.toLowerCase() : '';
    
    if (status === 'approved') {
        // Find and update pending deposit
        const pendingIndex = walletData.pendingDeposits.findIndex(d => 
            d.txid === depositData.txid || d.id === depositData.id
        );
        
        if (pendingIndex !== -1) {
            const approvedDeposit = {
                ...walletData.pendingDeposits[pendingIndex],
                status: 'approved',
                approvedAt: depositData.approvedAt || Date.now()
            };
            
            // Move to history
            walletData.depositHistory.unshift(approvedDeposit);
            walletData.pendingDeposits.splice(pendingIndex, 1);
            
            // Add balance
            if (depositData.currency === 'AMSK') {
                walletData.balances.AMSK += depositData.amount;
            } else if (depositData.currency === 'USDT') {
                walletData.balances.USDT += depositData.amount;
            } else if (depositData.currency === 'BNB') {
                walletData.balances.BNB += depositData.amount;
            } else if (depositData.currency === 'TON') {
                walletData.balances.TON += depositData.amount;
            }
            
            showMessage(`✅ Deposit approved! +${depositData.amount} ${depositData.currency} added`, "success");
        }
        
    } else if (status === 'rejected') {
        const pendingIndex = walletData.pendingDeposits.findIndex(d => 
            d.txid === depositData.txid || d.id === depositData.id
        );
        
        if (pendingIndex !== -1) {
            const rejectedDeposit = {
                ...walletData.pendingDeposits[pendingIndex],
                status: 'rejected',
                rejectedAt: depositData.rejectedAt || Date.now(),
                rejectionReason: depositData.rejectionReason
            };
            
            walletData.depositHistory.unshift(rejectedDeposit);
            walletData.pendingDeposits.splice(pendingIndex, 1);
            
            showMessage(`❌ Deposit rejected. Reason: ${depositData.rejectionReason || 'Not specified'}`, "warning");
        }
    }
    
    saveUserData();
    updateWalletUI();
}

function updateUserLocalWithdrawal(firebaseId, withdrawalData) {
    const status = withdrawalData.status ? withdrawalData.status.toLowerCase() : '';
    
    if (status === 'completed') {
        const pendingIndex = walletData.pendingWithdrawals.findIndex(w => 
            w.address === withdrawalData.address && Math.abs(w.amount - withdrawalData.amount) < 0.01
        );
        
        if (pendingIndex !== -1) {
            const completedWithdrawal = {
                ...walletData.pendingWithdrawals[pendingIndex],
                status: 'completed',
                completedAt: withdrawalData.completedAt || Date.now()
            };
            
            walletData.withdrawalHistory.unshift(completedWithdrawal);
            walletData.pendingWithdrawals.splice(pendingIndex, 1);
            
            showMessage(`✅ Withdrawal completed! ${withdrawalData.amount} USDT sent`, "success");
        }
        
    } else if (status === 'rejected') {
        const pendingIndex = walletData.pendingWithdrawals.findIndex(w => 
            w.address === withdrawalData.address && Math.abs(w.amount - withdrawalData.amount) < 0.01
        );
        
        if (pendingIndex !== -1) {
            const rejectedWithdrawal = {
                ...walletData.pendingWithdrawals[pendingIndex],
                status: 'rejected',
                rejectedAt: withdrawalData.rejectedAt || Date.now(),
                rejectionReason: withdrawalData.rejectionReason
            };
            
            walletData.withdrawalHistory.unshift(rejectedWithdrawal);
            walletData.pendingWithdrawals.splice(pendingIndex, 1);
            
            // Return balance
            walletData.balances.USDT += withdrawalData.amount;
            walletData.balances.BNB += withdrawalData.fee || 0;
            
            showMessage(`❌ Withdrawal rejected. Balance returned.`, "warning");
        }
    }
    
    saveUserData();
    updateWalletUI();
}

// ============================================
// UI FUNCTIONS - VIP STYLE
// ============================================
function updateUI() {
    updateUserUI();
    updateMiningDisplay();
    updateWalletUI();
    updateTotalBalance();
}

function showPage(pageName) {
    // Hide all pages
    elements.pages.forEach(page => {
        page.style.display = 'none';
        page.classList.remove('active');
    });
    
    // Update navigation buttons
    elements.navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === pageName) {
            btn.classList.add('active');
        }
    });
    
    // Show selected page
    const pageElement = document.getElementById(`${pageName}-page`);
    if (pageElement) {
        pageElement.style.display = 'block';
        setTimeout(() => {
            pageElement.classList.add('active');
        }, 10);
    }
    
    // Update page-specific content
    switch (pageName) {
        case 'home':
            updateMiningDisplay();
            break;
        case 'staking':
            updateStakingDisplay();
            break;
        case 'wallet':
            updateWalletUI();
            break;
    }
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function hideLoading() {
    if (elements.loadingScreen) {
        elements.loadingScreen.classList.remove('active');
    }
    
    if (document.getElementById('app-container')) {
        document.getElementById('app-container').style.display = 'block';
    }
}

// ============================================
// EVENT LISTENERS SETUP - VIP STYLE
// ============================================
function setupEventListeners() {
    console.log("🎯 Setting up event listeners...");
    
    // Navigation buttons
    elements.navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const page = btn.dataset.page;
            showPage(page);
        });
    });
    
    // Mining button
    if (elements.startMiningBtn) {
        elements.startMiningBtn.addEventListener('click', handleMiningAction);
    }
    
    // Upgrade buttons
    elements.upgradeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.upgrade-card');
            if (card) {
                upgradeMiningLevel(card.dataset.level);
            }
        });
    });
    
    // Booster buttons
    elements.boosterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.booster-card');
            if (card) {
                activateBooster(card.dataset.booster);
            }
        });
    });
    
    // Staking calculator
    if (elements.calcAmount && elements.calcDuration) {
        elements.calcAmount.addEventListener('input', updateStakingCalculator);
        elements.calcDuration.addEventListener('change', updateStakingCalculator);
    }
    
    // Stake buttons
    elements.stakeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const planId = btn.dataset.plan;
            openStakeModal(planId);
        });
    });
    
    // Quick actions
    elements.quickActions.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.dataset.action;
            handleQuickAction(action);
        });
    });
    
    // Asset buttons
    elements.assetButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.dataset.action;
            const currency = btn.dataset.currency;
            handleAssetAction(action, currency);
        });
    });
    
    // Modal close buttons
    elements.modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Modal overlay
    if (elements.modalOverlay) {
        elements.modalOverlay.addEventListener('click', (e) => {
            if (e.target === elements.modalOverlay) {
                closeModal();
            }
        });
    }
    
    console.log("✅ Event listeners setup complete");
}

function handleQuickAction(action) {
    switch (action) {
        case 'swap':
            openSwapModal();
            break;
        case 'deposit':
            openDepositModal();
            break;
        case 'withdraw':
            openWithdrawModal();
            break;
        case 'history':
            showTransactionHistory();
            break;
    }
}

function handleAssetAction(action, currency) {
    switch (action) {
        case 'send':
            showMessage('Send functionality coming soon!', 'info');
            break;
        case 'receive':
            openDepositModal(currency);
            break;
        case 'swap':
            openSwapModal();
            break;
        case 'deposit':
            openDepositModal(currency);
            break;
        case 'withdraw':
            if (currency === 'USDT') {
                openWithdrawModal();
            } else {
                showMessage('Withdrawals available only for USDT', 'info');
            }
            break;
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatNumber(num, decimals = 0) {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    
    if (num >= 1000000) {
        return (num / 1000000).toFixed(decimals) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(decimals) + 'K';
    }
    
    return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showMessage('✅ Copied to clipboard!', 'success');
        })
        .catch(err => {
            console.error('Copy error:', err);
            showMessage('❌ Failed to copy', 'error');
        });
}

function showMessage(text, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    let icon = 'fa-info-circle';
    switch (type) {
        case 'success': icon = 'fa-check-circle'; break;
        case 'error': icon = 'fa-exclamation-circle'; break;
        case 'warning': icon = 'fa-exclamation-triangle'; break;
    }
    
    messageDiv.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${text}</span>
    `;
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: ${type === 'success' ? '#10b981' : 
                     type === 'error' ? '#ef4444' : 
                     type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 12px 24px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 2000;
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        font-weight: 500;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateX(-50%) translateY(-100px)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// ============================================
// BACKGROUND SERVICES
// ============================================
function startBackgroundServices() {
    // Start mining timer
    const miningTimer = setInterval(() => {
        updateMiningTimer();
    }, 1000);
    
    // Check for expired boosters every minute
    const boosterChecker = setInterval(() => {
        checkExpiredBoosters();
    }, 60000);
    
    // Auto-save every 30 seconds
    const autoSave = setInterval(() => {
        if (userData.id && userData.isInitialized) {
            saveUserData();
        }
    }, 30000);
    
    // Update user last active every minute
    const lastActiveUpdater = setInterval(() => {
        if (userData) {
            userData.lastActive = new Date().toISOString();
        }
    }, 60000);
    
    console.log("⏱️ Background services started");
    
    // Store interval IDs for cleanup
    window.intervals = {
        miningTimer,
        boosterChecker,
        autoSave,
        lastActiveUpdater
    };
}

function checkExpiredBoosters() {
    if (!walletData.mining.activeBoosters || !walletData.mining.activeBoosters.length) return;
    
    const now = Date.now();
    const validBoosters = walletData.mining.activeBoosters.filter(booster => {
        if (!booster.expiresAt) return false;
        return booster.expiresAt > now;
    });
    
    if (validBoosters.length !== walletData.mining.activeBoosters.length) {
        walletData.mining.activeBoosters = validBoosters;
        updateMiningDisplay();
        saveUserData();
    }
}

// ============================================
// WINDOW EVENT LISTENERS
// ============================================
window.addEventListener('beforeunload', function() {
    if (userData.id && userData.isInitialized) {
        console.log("💾 Saving data before page unload...");
        saveUserData();
        
        // Clean up intervals
        if (window.intervals) {
            Object.values(window.intervals).forEach(interval => {
                clearInterval(interval);
            });
        }
    }
});

// ============================================
// EXPORT FUNCTIONS TO WINDOW
// ============================================
window.handleMiningAction = handleMiningAction;
window.upgradeMiningLevel = upgradeMiningLevel;
window.activateBooster = activateBooster;
window.openStakeModal = openStakeModal;
window.confirmStaking = confirmStaking;
window.claimStakeReward = claimStakeReward;
window.cancelStake = cancelStake;
window.openDepositModal = openDepositModal;
window.submitDeposit = submitDeposit;
window.openWithdrawModal = openWithdrawModal;
window.submitWithdrawal = submitWithdrawal;
window.openSwapModal = openSwapModal;
window.updateSwapCalculation = updateSwapCalculation;
window.executeSwap = executeSwap;
window.showTransactionHistory = showTransactionHistory;
window.switchHistoryTab = switchHistoryTab;
window.closeModal = closeModal;
window.copyToClipboard = copyToClipboard;
window.showMessage = showMessage;
window.showPage = showPage;

// Admin functions
window.checkAdminPassword = checkAdminPassword;
window.switchAdminTab = switchAdminTab;
window.adminApproveRequest = adminApproveRequest;
window.adminRejectRequest = adminRejectRequest;
window.addBalanceToSpecificUser = addBalanceToSpecificUser;
window.loadAdminPendingRequests = loadAdminPendingRequests;

// ============================================
// START APPLICATION
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

console.log("👽 Alien Musk Quantum Platform v4.1 - VIP Style Refactored!");

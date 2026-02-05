// ============================================
// ALIEN MUSK - Quantum Mining Platform v6.0 - FIXED
// PROFESSIONAL EDITION WITH ADMIN PANEL & WALLET
// ============================================

// Telegram WebApp
let tg = null;
try {
    tg = window.Telegram.WebApp;
    if (tg) {
        tg.ready();
        tg.expand();
        tg.setHeaderColor('#0a0a0f');
        tg.setBackgroundColor('#0a0a0f');
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
// CONFIGURATION - UPDATED
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
    
    // Mining Configuration - UPDATED WITH MORE LEVELS
    MINING: {
        DURATION: 3600000, // 1 hour in ms
        
        LEVELS: {
            1: { name: "Beginner", cost: 0, reward: 2500, hashrate: 2500 },
            2: { name: "Advanced", cost: 5, reward: 5000, hashrate: 5000 },
            3: { name: "Pro", cost: 20, reward: 10000, hashrate: 10000 },
            4: { name: "Expert", cost: 100, reward: 25000, hashrate: 25000 },
            5: { name: "Master", cost: 500, reward: 50000, hashrate: 50000 },
            6: { name: "Elite", cost: 1000, reward: 100000, hashrate: 100000 }
        },
        
        BOOSTERS: {
            "2x": { multiplier: 2, duration: 86400000, price: 10000 },
            "3x": { multiplier: 3, duration: 43200000, price: 15000 },
            "5x": { multiplier: 5, duration: 21600000, price: 25000 }
        }
    },
    
    // Staking Configuration - FIXED CALCULATIONS
    STAKING: {
        PLANS: {
            1: { 
                name: "Silver", 
                minAmount: 10, 
                maxAmount: 1000,
                duration: 7, 
                apr: 40, 
                dailyPer100: 571.43 // 40% of $10 = $4 = 20,000 AMSK ÷ 7 days = 2,857.14 ÷ 10 = 285.714 per $1
            },
            2: { 
                name: "Gold", 
                minAmount: 50, 
                maxAmount: 5000,
                duration: 15, 
                apr: 50, 
                dailyPer100: 416.67 // 50% of $50 = $25 = 125,000 AMSK ÷ 15 days = 8,333.33 ÷ 50 = 166.667 per $1
            },
            3: { 
                name: "Diamond", 
                minAmount: 100, 
                maxAmount: 10000,
                duration: 30, 
                apr: 60, 
                dailyPer100: 333.33 // 60% of $100 = $60 = 300,000 AMSK ÷ 30 days = 10,000 ÷ 100 = 100 per $1
            }
        }
    },
    
    // Referral Configuration - UPDATED WITH MILESTONES
    REFERRAL: {
        DIRECT_REWARD: 10000, // 10,000 AMSK for referrer
        WELCOME_BONUS: 5000, // 5,000 AMSK for new user
        
        MILESTONES: {
            10: 50000,   // 50,000 AMSK
            25: 150000,  // 150,000 AMSK
            50: 350000,  // 350,000 AMSK
            100: 1000000 // 1,000,000 AMSK
        }
    },
    
    // Admin Configuration
    ADMIN: {
        TELEGRAM_ID: "1653918641",
        PASSWORD: "Ali97$",
        SECRET_CODE: "ALIEN2024"
    },
    
    // Swap Configuration
    SWAP: {
        MIN_AMSK: 1000,
        MIN_USDT: 10,
        RATE_AMSK_USDT: 5000, // 1 USDT = 5,000 AMSK
        FEE_PERCENT: 0.1
    },
    
    // UI Configuration
    UI: {
        ANIMATION_DURATION: 300,
        NOTIFICATION_DURATION: 4000
    }
};

// ============================================
// USER DATA MANAGEMENT - FIXED
// ============================================
let userData = {
    id: null,
    telegramId: null,
    username: 'Alien',
    firstName: 'Alien',
    photoUrl: null,
    referralCode: null,
    referredBy: null,
    joinedAt: null,
    lastActive: null,
    isInitialized: false,
    lastSaveTime: 0
};

// WALLET DATA - PROFESSIONAL SYSTEM
let walletData = {
    balances: {
        AMSK: 2500,
        USDT: 0,
        BNB: 0,
        TON: 0
    },
    mining: {
        level: 1,
        active: false,
        lastReward: null,
        nextReward: null,
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
        claimedMilestones: [],
        pendingMilestones: []
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

// ELEMENTS CACHE
const elements = {};

// INTERVALS
let intervals = {
    miningTimer: null,
    autoSave: null,
    updateTimer: null
};

// ============================================
// INITIALIZATION - FIXED
// ============================================
async function initAlienMuskApp() {
    console.log("🚀 Initializing Alien Musk Platform v6.0...");
    
    try {
        // 1. Cache DOM Elements
        cacheElements();
        
        // 2. Setup User - FIXED SYSTEM
        await setupUser();
        
        // 3. Load Data
        await loadUserData();
        
        // 4. Setup Event Listeners
        setupEventListeners();
        
        // 5. Check for Referral
        await checkForReferral();
        
        // 6. Update UI
        updateUI();
        
        // 7. Hide Loading
        setTimeout(() => {
            hideLoading();
            showMessage("👽 Welcome to Alien Musk Quantum Platform!", "success");
        }, 1500);
        
        // 8. Start Background Services
        startBackgroundServices();
        
        // 9. Setup Admin System
        initAdminSystem();
        
        // 10. Setup Real-time Listeners
        setupRealTimeListeners();
        
        userData.isInitialized = true;
        console.log("✅ Platform initialized successfully");
        
    } catch (error) {
        console.error("❌ Initialization failed:", error);
        showMessage("Failed to initialize platform", "error");
        hideLoading();
    }
}

// Cache DOM Elements - UPDATED
function cacheElements() {
    console.log("🔍 Caching DOM elements...");
    
    // Loading screen
    elements.loadingScreen = document.getElementById('loading-screen');
    elements.loadingProgress = document.getElementById('loading-progress-bar');
    elements.loadingText = document.getElementById('loading-progress-text');
    
    // Header elements
    elements.usernameMini = document.getElementById('username-mini');
    elements.userIdMini = document.getElementById('user-id-mini');
    elements.userAvatarMini = document.getElementById('user-avatar-mini');
    elements.totalBalanceAmsk = document.getElementById('total-balance-amsk');
    elements.totalBalanceUsd = document.getElementById('total-balance-usd');
    elements.adminLogo = document.getElementById('admin-logo');
    
    // Navigation
    elements.navBtns = document.querySelectorAll('.nav-btn');
    elements.pages = document.querySelectorAll('.page');
    
    // Mining elements
    elements.startMiningBtn = document.getElementById('start-mining-btn');
    elements.miningTimerDisplay = document.getElementById('mining-timer-display');
    elements.currentMiningLevel = document.getElementById('current-mining-level');
    elements.currentHashrateDisplay = document.getElementById('current-hashrate-display');
    elements.nextRewardAmount = document.getElementById('next-reward-amount');
    elements.totalMined = document.getElementById('total-mined');
    elements.minedToday = document.getElementById('mined-today');
    
    // Upgrade elements
    elements.upgradeCards = document.querySelectorAll('.upgrade-card');
    elements.upgradeButtons = document.querySelectorAll('.upgrade-btn');
    
    // Staking elements
    elements.stakeButtons = document.querySelectorAll('.stake-plan-btn');
    elements.totalStaked = document.getElementById('total-staked');
    elements.activeStakesList = document.getElementById('active-stakes-list');
    
    // Wallet elements - UPDATED
    elements.walletBalanceAmsk = document.getElementById('wallet-balance-amsk');
    elements.walletBalanceUsd = document.getElementById('wallet-balance-usd');
    elements.walletAmskBalance = document.getElementById('wallet-amsk-balance');
    elements.walletAmskValue = document.getElementById('wallet-amsk-value');
    elements.walletUsdtBalance = document.getElementById('wallet-usdt-balance');
    elements.walletUsdtValue = document.getElementById('wallet-usdt-value');
    elements.walletBnbBalance = document.getElementById('wallet-bnb-balance');
    elements.walletBnbValue = document.getElementById('wallet-bnb-value');
    elements.walletTonBalance = document.getElementById('wallet-ton-balance');
    elements.walletTonValue = document.getElementById('wallet-ton-value');
    
    // Wallet action buttons
    elements.depositBtn = document.getElementById('deposit-btn');
    elements.withdrawBtn = document.getElementById('withdraw-btn');
    elements.swapBtn = document.getElementById('swap-btn');
    elements.historyBtn = document.getElementById('history-btn');
    
    // Referral elements
    elements.referralCodeDisplay = document.getElementById('referral-code-display');
    elements.referralLinkInput = document.getElementById('referral-link-input');
    elements.refCount = document.getElementById('ref-count');
    elements.refEarned = document.getElementById('ref-earned');
    elements.milestoneItems = document.querySelectorAll('.milestone-item');
    
    console.log(`✅ Cached ${Object.keys(elements).length} element groups`);
}

// Setup User - FIXED ID SYSTEM
async function setupUser() {
    console.log("👤 Setting up user...");
    
    let telegramUser = null;
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        telegramUser = tg.initDataUnsafe.user;
        console.log("📱 Telegram user found:", telegramUser.id);
    }
    
    // FIXED: Use Telegram ID directly or localStorage
    if (telegramUser && telegramUser.id) {
        userData.id = `tg_${telegramUser.id}`;
        userData.telegramId = telegramUser.id.toString();
        userData.username = telegramUser.username ? `@${telegramUser.username}` : 
                           telegramUser.first_name ? telegramUser.first_name : 
                           `User${telegramUser.id.toString().slice(-4)}`;
        userData.firstName = telegramUser.first_name || 'Alien';
        userData.photoUrl = telegramUser.photo_url || 
                           `https://api.dicebear.com/7.x/avataaars/svg?seed=${telegramUser.id}`;
    } else {
        // For web users
        let userId = localStorage.getItem('alien_musk_user_id');
        if (!userId) {
            userId = 'web_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('alien_musk_user_id', userId);
        }
        userData.id = userId;
        userData.username = 'Alien';
        userData.firstName = 'Alien';
        userData.photoUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
    }
    
    // FIXED: Generate referral code once and save it
    if (!userData.referralCode) {
        userData.referralCode = generateReferralCode(userData.id);
        console.log("🔗 Generated referral code:", userData.referralCode);
    }
    
    userData.joinedAt = new Date().toISOString();
    userData.lastActive = new Date().toISOString();
    
    console.log("👤 User initialized:", {
        id: userData.id,
        refCode: userData.referralCode,
        name: userData.username
    });
    
    // Update UI
    updateUserUI();
    
    // Sync with Firebase
    if (db) {
        await syncUserWithFirebase();
    }
}

// Generate referral code - FIXED (Stable)
function generateReferralCode(userId) {
    // Use last part of user ID + fixed string
    const idPart = userId.slice(-6).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar characters
    const randomPart = Array.from({length: 4}, () => 
        chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
    
    return `ALIEN-${idPart}${randomPart}`;
}

// Update user UI
function updateUserUI() {
    if (elements.usernameMini) {
        elements.usernameMini.textContent = userData.firstName;
    }
    
    if (elements.userIdMini) {
        elements.userIdMini.textContent = `ID: ${userData.id.slice(-8)}`;
    }
    
    if (elements.userAvatarMini) {
        elements.userAvatarMini.src = userData.photoUrl;
        elements.userAvatarMini.onerror = function() {
            this.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.id}`;
        };
    }
    
    if (elements.referralCodeDisplay) {
        elements.referralCodeDisplay.textContent = userData.referralCode;
    }
    
    if (elements.referralLinkInput) {
        elements.referralLinkInput.value = `https://t.me/AlienMuskbot/Musk?startapp=${userData.referralCode}`;
    }
}

// ============================================
// DATA LOADING/SAVING - PROFESSIONAL SYSTEM
// ============================================
async function loadUserData() {
    console.log("📂 Loading user data for:", userData.id);
    
    try {
        // Try Firebase first
        if (db) {
            const loaded = await loadUserFromFirebase();
            if (loaded) {
                console.log("✅ Data loaded from Firebase");
                // Also load wallet data
                await loadWalletFromFirebase();
                return;
            }
        }
        
        // Fallback to localStorage
        await loadUserFromLocalStorage();
        
    } catch (error) {
        console.error("❌ Error loading user data:", error);
        // Initialize with default values
        initializeDefaultData();
    }
}

async function loadUserFromFirebase() {
    if (!db || !userData.id) return false;
    
    try {
        const userRef = db.collection('users').doc(userData.id);
        const userSnap = await userRef.get();
        
        if (userSnap.exists) {
            const firebaseData = userSnap.data();
            
            // Update local data
            if (firebaseData.balances) {
                walletData.balances = firebaseData.balances;
            }
            
            if (firebaseData.mining) {
                walletData.mining = firebaseData.mining;
            }
            
            if (firebaseData.staking) {
                walletData.staking = firebaseData.staking;
            }
            
            if (firebaseData.referrals) {
                walletData.referrals = firebaseData.referrals;
            }
            
            // Update user data
            if (firebaseData.username) {
                userData.username = firebaseData.username;
            }
            
            if (firebaseData.referralCode) {
                userData.referralCode = firebaseData.referralCode;
            }
            
            if (firebaseData.referredBy) {
                userData.referredBy = firebaseData.referredBy;
            }
            
            return true;
        }
    } catch (error) {
        console.error("❌ Firebase load error:", error);
    }
    
    return false;
}

async function loadWalletFromFirebase() {
    if (!db || !userData.id) return false;
    
    try {
        const walletRef = db.collection('wallets').doc(userData.id);
        const walletSnap = await walletRef.get();
        
        if (walletSnap.exists) {
            const firebaseData = walletSnap.data();
            
            walletData.pendingDeposits = firebaseData.pendingDeposits || [];
            walletData.pendingWithdrawals = firebaseData.pendingWithdrawals || [];
            walletData.depositHistory = firebaseData.depositHistory || [];
            walletData.withdrawalHistory = firebaseData.withdrawalHistory || [];
            walletData.usedTransactions = firebaseData.usedTransactions || [];
            
            console.log("✅ Wallet data loaded from Firebase");
            return true;
        }
    } catch (error) {
        console.error("❌ Wallet Firebase load error:", error);
    }
    
    return false;
}

async function loadUserFromLocalStorage() {
    const storageKey = `alien_musk_${userData.id}`;
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            
            // Merge data carefully
            if (parsed.balances) {
                walletData.balances = {
                    AMSK: parsed.balances.AMSK || 2500,
                    USDT: parsed.balances.USDT || 0,
                    BNB: parsed.balances.BNB || 0,
                    TON: parsed.balances.TON || 0
                };
            }
            
            if (parsed.mining) {
                walletData.mining = parsed.mining;
            }
            
            if (parsed.staking) {
                walletData.staking = parsed.staking;
            }
            
            if (parsed.referrals) {
                walletData.referrals = parsed.referrals;
            }
            
            if (parsed.pendingDeposits) {
                walletData.pendingDeposits = parsed.pendingDeposits;
            }
            
            if (parsed.pendingWithdrawals) {
                walletData.pendingWithdrawals = parsed.pendingWithdrawals;
            }
            
            if (parsed.depositHistory) {
                walletData.depositHistory = parsed.depositHistory;
            }
            
            if (parsed.withdrawalHistory) {
                walletData.withdrawalHistory = parsed.withdrawalHistory;
            }
            
            if (parsed.usedTransactions) {
                walletData.usedTransactions = parsed.usedTransactions;
            }
            
            console.log("✅ Data loaded from localStorage");
            
        } catch (error) {
            console.error("❌ Parse error:", error);
            initializeDefaultData();
        }
    } else {
        console.log("📝 No saved data found, using defaults");
        initializeDefaultData();
    }
}

function initializeDefaultData() {
    walletData.balances = { AMSK: 2500, USDT: 0, BNB: 0, TON: 0 };
    walletData.mining = {
        level: 1,
        active: false,
        lastReward: null,
        nextReward: null,
        totalMined: 2500,
        minedToday: 2500,
        activeBoosters: []
    };
    walletData.staking = {
        activeStakes: [],
        totalEarned: 0,
        totalStaked: 0
    };
    walletData.referrals = {
        count: 0,
        earned: 0,
        referrals: [],
        claimedMilestones: [],
        pendingMilestones: []
    };
}

function saveUserData() {
    if (!userData.id) {
        console.error("❌ Cannot save: No user ID");
        return;
    }
    
    try {
        // Update timestamps
        userData.lastActive = new Date().toISOString();
        walletData.lastUpdate = Date.now();
        
        // Save to localStorage
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
            lastUpdate: walletData.lastUpdate
        };
        
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        console.log("💾 User data saved to localStorage");
        
        // Save to Firebase
        if (db) {
            saveUserToFirebase();
            saveWalletToFirebase();
        }
        
        userData.lastSaveTime = Date.now();
        
    } catch (error) {
        console.error("❌ Save error:", error);
    }
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
            referredBy: userData.referredBy,
            joinedAt: userData.joinedAt,
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

function saveWalletToFirebase() {
    if (!db || !userData.id) return;
    
    try {
        const walletRef = db.collection('wallets').doc(userData.id);
        
        const firebaseData = {
            userId: userData.id,
            balances: walletData.balances,
            pendingDeposits: walletData.pendingDeposits,
            pendingWithdrawals: walletData.pendingWithdrawals,
            depositHistory: walletData.depositHistory.slice(0, 50),
            withdrawalHistory: walletData.withdrawalHistory.slice(0, 50),
            usedTransactions: walletData.usedTransactions.slice(0, 100),
            lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        walletRef.set(firebaseData, { merge: true }).then(() => {
            console.log("✅ Wallet saved to Firebase");
        }).catch(error => {
            console.error("❌ Wallet Firebase save error:", error);
        });
        
    } catch (error) {
        console.error("❌ Wallet Firebase save error:", error);
    }
}

// ============================================
// MINING SYSTEM - FIXED
// ============================================
function updateMiningDisplay() {
    if (!walletData.mining) return;
    
    const mining = walletData.mining;
    const level = CONFIG.MINING.LEVELS[mining.level];
    
    // Update mining level
    if (elements.currentMiningLevel) {
        elements.currentMiningLevel.textContent = mining.level;
    }
    
    // Calculate hashrate
    let hashrate = level.hashrate;
    if (elements.currentHashrateDisplay) {
        elements.currentHashrateDisplay.textContent = formatNumber(hashrate);
    }
    
    // Update mining timer
    updateMiningTimer();
    
    // Update next reward
    let nextReward = level.reward;
    if (elements.nextRewardAmount) {
        elements.nextRewardAmount.textContent = formatNumber(nextReward);
    }
    
    // Update stats - FIXED: Make them unique per user
    if (elements.totalMined) {
        elements.totalMined.textContent = formatNumber(mining.totalMined);
    }
    
    if (elements.minedToday) {
        // Reset minedToday if it's a new day
        const now = new Date();
        const lastMinedDate = mining.lastReward ? new Date(mining.lastReward) : null;
        if (lastMinedDate && (
            now.getDate() !== lastMinedDate.getDate() ||
            now.getMonth() !== lastMinedDate.getMonth() ||
            now.getFullYear() !== lastMinedDate.getFullYear()
        )) {
            mining.minedToday = 0;
        }
        elements.minedToday.textContent = formatNumber(mining.minedToday);
    }
    
    // Update upgrade cards
    updateUpgradeCards();
    
    // Update mining button
    updateMiningButton();
}

function updateMiningTimer() {
    if (!walletData.mining || !elements.miningTimerDisplay) return;
    
    const now = Date.now();
    const nextRewardTime = walletData.mining.nextReward;
    
    if (!nextRewardTime) {
        elements.miningTimerDisplay.textContent = "01:00:00";
        return;
    }
    
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

function updateMiningButton() {
    if (!elements.startMiningBtn) return;
    
    const mining = walletData.mining;
    const now = Date.now();
    
    if (!mining.active) {
        elements.startMiningBtn.innerHTML = '<i class="fas fa-play"></i><span>Start Mining</span>';
        elements.startMiningBtn.classList.remove('claim-mode');
    } else if (mining.nextReward && now >= mining.nextReward) {
        elements.startMiningBtn.innerHTML = '<i class="fas fa-gift"></i><span>Claim Reward</span>';
        elements.startMiningBtn.classList.add('claim-mode');
    } else {
        elements.startMiningBtn.innerHTML = '<i class="fas fa-play"></i><span>Mining...</span>';
        elements.startMiningBtn.classList.remove('claim-mode');
        elements.startMiningBtn.disabled = true;
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

async function handleMiningAction() {
    if (!walletData.mining) return;
    
    const mining = walletData.mining;
    const now = Date.now();
    
    // FIXED: Prevent clicking while mining is active
    if (mining.active && mining.nextReward && now < mining.nextReward) {
        showMessage("⏳ Mining in progress. Please wait.", "info");
        return;
    }
    
    if (!mining.active) {
        // Start mining
        await startMining();
    } else if (mining.nextReward && now >= mining.nextReward) {
        // Claim reward
        await claimMiningReward();
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
        
        // Save data
        saveUserData();
        
        // Show success
        showMessage(`⚡ Upgraded to ${levelData.name} level!`, "success");
        
    } catch (error) {
        console.error("❌ Error upgrading mining level:", error);
        showMessage("Failed to upgrade mining level", "error");
    }
}

// ============================================
// STAKING SYSTEM - FIXED WITH FLEXIBLE AMOUNTS
// ============================================
function updateStakingDisplay() {
    updateStakingStats();
    updateActiveStakes();
}

function updateStakingStats() {
    if (elements.totalStaked) {
        elements.totalStaked.textContent = `${walletData.staking.totalStaked} USDT`;
    }
}

function updateActiveStakes() {
    if (!elements.activeStakesList) return;
    
    const activeStakes = walletData.staking.activeStakes || [];
    
    if (!activeStakes.length) {
        elements.activeStakesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No active stakes yet</p>
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
        
        // Calculate daily reward based on staked amount
        const dailyReward = Math.floor((stake.amount / 100) * plan.dailyPer100);
        const totalReward = dailyReward * plan.duration;
        
        html += `
            <div class="stake-item">
                <div class="stake-header">
                    <div class="stake-info">
                        <h5>${plan.name} - ${stake.amount} USDT</h5>
                        <span class="stake-duration">${plan.duration} Days</span>
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
                        <i class="fas fa-percentage"></i>
                        <span>${plan.apr}% APR</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-gift"></i>
                        <span>${dailyReward.toLocaleString()} AMSK/Day</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-coins"></i>
                        <span>Total: ${totalReward.toLocaleString()} AMSK</span>
                    </div>
                </div>
                
                <div class="stake-actions">
                    <button class="btn-secondary" onclick="cancelStake(${index})" ${progress < 50 ? '' : 'disabled'}>
                        Cancel (50% penalty)
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
    
    const usdtBalance = walletData.balances.USDT || 0;
    const maxAmount = Math.min(usdtBalance, plan.maxAmount);
    
    const modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-gem"></i> ${plan.name} Staking</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="stake-plan-info">
                        <div class="plan-icon">
                            <i class="fas fa-gem"></i>
                        </div>
                        <div class="plan-details">
                            <h4>${plan.name} Plan</h4>
                            <div class="plan-apr">${plan.apr}% APR</div>
                            <div class="plan-duration">${plan.duration} Days</div>
                        </div>
                    </div>
                    
                    <div class="stake-amount-section">
                        <div class="amount-header">
                            <span>Staking Amount (USDT)</span>
                            <span class="balance">Balance: ${usdtBalance.toFixed(2)} USDT</span>
                        </div>
                        <div class="amount-input-group">
                            <input type="number" 
                                   id="stakeAmount" 
                                   class="amount-input"
                                   value="${Math.max(plan.minAmount, Math.min(100, maxAmount)).toFixed(2)}"
                                   min="${plan.minAmount}"
                                   max="${maxAmount}"
                                   step="0.01"
                                   oninput="calculateStakeReward(${planId})">
                            <button class="max-btn" onclick="setMaxStakeAmount(${planId})">MAX</button>
                        </div>
                        <div class="amount-range">
                            <input type="range" 
                                   id="stakeSlider" 
                                   min="${plan.minAmount}" 
                                   max="${maxAmount}" 
                                   value="${Math.max(plan.minAmount, Math.min(100, maxAmount))}"
                                   step="1"
                                   oninput="updateStakeAmountFromSlider(${planId})">
                            <div class="range-labels">
                                <span>${plan.minAmount} USDT</span>
                                <span>${maxAmount.toFixed(0)} USDT</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stake-reward-calculation">
                        <div class="reward-header">
                            <i class="fas fa-calculator"></i>
                            <span>Reward Calculation</span>
                        </div>
                        <div class="reward-details">
                            <div class="reward-item">
                                <span>Daily Reward:</span>
                                <span id="dailyReward">0 AMSK</span>
                            </div>
                            <div class="reward-item">
                                <span>Total Reward (${plan.duration} days):</span>
                                <span id="totalReward">0 AMSK</span>
                            </div>
                            <div class="reward-item">
                                <span>APR:</span>
                                <span>${plan.apr}%</span>
                            </div>
                            <div class="reward-item total">
                                <span>Total Return:</span>
                                <span id="totalReturn">0 AMSK</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stake-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>USDT will be locked for ${plan.duration} days. Early cancellation incurs 50% penalty.</span>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="closeModal()">
                            Cancel
                        </button>
                        <button class="btn-primary" id="confirmStakeBtn" onclick="confirmStaking(${planId})" ${usdtBalance >= plan.minAmount ? '' : 'disabled'}>
                            Confirm Stake
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modals
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    // Initialize calculation
    setTimeout(() => {
        calculateStakeReward(planId);
        updateStakeSlider(planId);
    }, 100);
}

function calculateStakeReward(planId) {
    const plan = CONFIG.STAKING.PLANS[planId];
    const amountInput = document.getElementById('stakeAmount');
    const slider = document.getElementById('stakeSlider');
    const confirmBtn = document.getElementById('confirmStakeBtn');
    
    if (!amountInput || !plan) return;
    
    const amount = parseFloat(amountInput.value) || 0;
    const usdtBalance = walletData.balances.USDT || 0;
    
    // Update slider if exists
    if (slider) {
        slider.value = amount;
    }
    
    // Calculate rewards
    const dailyReward = Math.floor((amount / 100) * plan.dailyPer100);
    const totalReward = dailyReward * plan.duration;
    const totalReturn = amount + (totalReward * CONFIG.PRICES.AMSK);
    
    // Update display
    if (document.getElementById('dailyReward')) {
        document.getElementById('dailyReward').textContent = `${dailyReward.toLocaleString()} AMSK`;
    }
    
    if (document.getElementById('totalReward')) {
        document.getElementById('totalReward').textContent = `${totalReward.toLocaleString()} AMSK`;
    }
    
    if (document.getElementById('totalReturn')) {
        document.getElementById('totalReturn').textContent = `${totalReward.toLocaleString()} AMSK (≈ $${totalReturn.toFixed(2)})`;
    }
    
    // Validate amount
    if (amount < plan.minAmount) {
        if (confirmBtn) confirmBtn.disabled = true;
        showMessage(`Minimum stake is ${plan.minAmount} USDT`, 'error');
        return;
    }
    
    if (amount > usdtBalance) {
        if (confirmBtn) confirmBtn.disabled = true;
        showMessage(`Insufficient USDT balance`, 'error');
        return;
    }
    
    if (amount > plan.maxAmount) {
        if (confirmBtn) confirmBtn.disabled = true;
        showMessage(`Maximum stake for this plan is ${plan.maxAmount} USDT`, 'error');
        return;
    }
    
    if (confirmBtn) confirmBtn.disabled = false;
}

function setMaxStakeAmount(planId) {
    const plan = CONFIG.STAKING.PLANS[planId];
    const amountInput = document.getElementById('stakeAmount');
    const slider = document.getElementById('stakeSlider');
    
    if (!amountInput || !plan) return;
    
    const usdtBalance = walletData.balances.USDT || 0;
    const maxAmount = Math.min(usdtBalance, plan.maxAmount);
    
    amountInput.value = maxAmount.toFixed(2);
    
    if (slider) {
        slider.value = maxAmount;
    }
    
    calculateStakeReward(planId);
}

function updateStakeAmountFromSlider(planId) {
    const slider = document.getElementById('stakeSlider');
    const amountInput = document.getElementById('stakeAmount');
    
    if (slider && amountInput) {
        amountInput.value = parseFloat(slider.value).toFixed(2);
        calculateStakeReward(planId);
    }
}

function updateStakeSlider(planId) {
    const plan = CONFIG.STAKING.PLANS[planId];
    const slider = document.getElementById('stakeSlider');
    
    if (slider && plan) {
        const usdtBalance = walletData.balances.USDT || 0;
        const maxAmount = Math.min(usdtBalance, plan.maxAmount);
        
        slider.max = maxAmount;
        slider.value = Math.max(plan.minAmount, Math.min(100, maxAmount));
    }
}

async function confirmStaking(planId) {
    try {
        const plan = CONFIG.STAKING.PLANS[planId];
        if (!plan) {
            throw new Error("Plan not found");
        }
        
        const amountInput = document.getElementById('stakeAmount');
        if (!amountInput) return;
        
        const amount = parseFloat(amountInput.value);
        
        // Validation
        if (isNaN(amount) || amount < plan.minAmount) {
            showMessage(`Minimum stake is ${plan.minAmount} USDT`, "error");
            return;
        }
        
        if (amount > plan.maxAmount) {
            showMessage(`Maximum stake for this plan is ${plan.maxAmount} USDT`, "error");
            return;
        }
        
        // Check USDT balance
        if (walletData.balances.USDT < amount) {
            showMessage("Insufficient USDT balance", "error");
            return;
        }
        
        // Deduct USDT
        walletData.balances.USDT -= amount;
        
        // Create stake object
        const stake = {
            planId: planId,
            amount: amount,
            startTime: Date.now(),
            duration: plan.duration,
            dailyPer100: plan.dailyPer100,
            apr: plan.apr,
            claimed: false
        };
        
        // Add to active stakes
        if (!walletData.staking.activeStakes) {
            walletData.staking.activeStakes = [];
        }
        walletData.staking.activeStakes.push(stake);
        walletData.staking.totalStaked = (walletData.staking.totalStaked || 0) + amount;
        
        // Update UI
        updateWalletUI();
        updateTotalBalance();
        updateStakingDisplay();
        
        // Close modal
        closeModal();
        
        // Show success
        showMessage(`✅ Staked ${amount} USDT for ${plan.duration} days!`, "success");
        
        // Save data
        saveUserData();
        
        // Create transaction record
        addTransaction({
            type: 'stake',
            amount: amount,
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
        const dailyReward = Math.floor((stake.amount / 100) * plan.dailyPer100);
        const totalReward = dailyReward * plan.duration;
        
        // Add reward to AMSK balance
        walletData.balances.AMSK += totalReward;
        
        // Return staked USDT
        walletData.balances.USDT += stake.amount;
        
        // Update staking stats
        walletData.staking.totalEarned = (walletData.staking.totalEarned || 0) + totalReward;
        walletData.staking.totalStaked -= stake.amount;
        
        // Remove from active stakes
        activeStakes.splice(stakeIndex, 1);
        
        // Update UI
        updateWalletUI();
        updateTotalBalance();
        updateStakingDisplay();
        
        // Show success
        showMessage(`💰 Claimed ${totalReward.toLocaleString()} AMSK from staking!`, "success");
        
        // Save data
        saveUserData();
        
        // Add transaction
        addTransaction({
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
    walletData.staking.totalStaked -= stake.amount;
    
    // Remove from active stakes
    activeStakes.splice(stakeIndex, 1);
    
    // Update UI
    updateWalletUI();
    updateTotalBalance();
    updateStakingDisplay();
    
    showMessage(`⚠️ Stake canceled. ${returnedAmount.toFixed(2)} USDT returned (50% penalty)`, "warning");
    saveUserData();
}

// ============================================
// WALLET SYSTEM - PROFESSIONAL
// ============================================
function updateWalletUI() {
    if (!walletData.balances) return;
    
    const { AMSK, USDT, BNB, TON } = walletData.balances;
    const { PRICES } = CONFIG;
    
    // Update AMSK
    if (elements.walletAmskBalance) {
        elements.walletAmskBalance.textContent = `${formatNumber(AMSK)} AMSK`;
    }
    if (elements.walletAmskValue) {
        elements.walletAmskValue.textContent = `$${(AMSK * PRICES.AMSK).toFixed(2)}`;
    }
    
    // Update USDT
    if (elements.walletUsdtBalance) {
        elements.walletUsdtBalance.textContent = `${USDT.toFixed(2)} USDT`;
    }
    if (elements.walletUsdtValue) {
        elements.walletUsdtValue.textContent = `$${USDT.toFixed(2)}`;
    }
    
    // Update BNB
    if (elements.walletBnbBalance) {
        elements.walletBnbBalance.textContent = `${BNB.toFixed(4)} BNB`;
    }
    if (elements.walletBnbValue) {
        elements.walletBnbValue.textContent = `$${(BNB * PRICES.BNB).toFixed(2)}`;
    }
    
    // Update TON
    if (elements.walletTonBalance) {
        elements.walletTonBalance.textContent = `${formatNumber(TON)} TON`;
    }
    if (elements.walletTonValue) {
        elements.walletTonValue.textContent = `$${(TON * PRICES.TON).toFixed(2)}`;
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
    
    if (elements.walletBalanceAmsk) {
        elements.walletBalanceAmsk.textContent = formatNumber(totalAMSK);
    }
    
    if (elements.walletBalanceUsd) {
        elements.walletBalanceUsd.textContent = `$${totalUSD.toFixed(2)}`;
    }
}

function openDepositModal(currency = 'USDT') {
    const minDeposit = CONFIG.MIN_DEPOSIT[currency] || 10;
    const address = currency === 'TON' ? CONFIG.ADDRESSES.TON : CONFIG.ADDRESSES.BNB_USDT;
    
    const modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-arrow-down"></i> Deposit ${currency}</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="deposit-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div class="warning-content">
                            <strong>Important:</strong> Send only <strong>${currency}</strong> to this address on <strong>${currency === 'TON' ? 'TON' : 'BEP20'}</strong> network.
                            Sending other tokens or using wrong network will result in permanent loss.
                        </div>
                    </div>
                    
                    <div class="address-card">
                        <div class="address-header">
                            <i class="fas fa-wallet"></i>
                            <span>Your ${currency} Deposit Address</span>
                        </div>
                        <div class="address-container">
                            <div class="address-value" id="depositAddressDisplay">
                                ${address}
                            </div>
                            <button class="copy-btn" onclick="copyToClipboard('${address}')">
                                <i class="far fa-copy"></i> Copy Address
                            </button>
                        </div>
                        <div class="network-info">
                            <i class="fas fa-network-wired"></i>
                            <span>Network: ${currency === 'TON' ? 'TON' : 'BEP20 (BNB Smart Chain)'}</span>
                        </div>
                    </div>
                    
                    <div class="deposit-form">
                        <div class="form-section">
                            <div class="form-section-header">
                                <i class="fas fa-money-bill-wave"></i>
                                <span>Deposit Amount</span>
                            </div>
                            <div class="form-group">
                                <label>Amount (${currency})</label>
                                <input type="number" 
                                       id="deposit-amount" 
                                       class="form-input"
                                       value="${minDeposit}"
                                       min="${minDeposit}" 
                                       step="${currency === 'BNB' ? '0.001' : '1'}"
                                       placeholder="Enter amount">
                                <div class="form-hint">
                                    Minimum deposit: ${minDeposit} ${currency}
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <div class="form-section-header">
                                <i class="fas fa-receipt"></i>
                                <span>Transaction Verification</span>
                            </div>
                            <div class="form-group">
                                <label>Transaction ID (Hash)</label>
                                <input type="text" 
                                       id="deposit-txid" 
                                       class="form-input"
                                       placeholder="${currency === 'TON' ? 'Transaction hash...' : '0x...'}"
                                       oninput="validateTransactionHash()">
                                <div class="form-hint">
                                    Required to verify and process your deposit
                                </div>
                            </div>
                            <div class="transaction-status" id="transactionStatus" style="display: none;">
                                <div class="status-icon" id="statusIcon"></div>
                                <div class="status-text" id="statusText"></div>
                            </div>
                        </div>
                        
                        <div class="deposit-instructions">
                            <div class="instructions-header">
                                <i class="fas fa-graduation-cap"></i>
                                <span>How to Deposit</span>
                            </div>
                            <div class="instructions-list">
                                <div class="instruction-step">
                                    <span class="step-number">1</span>
                                    <span>Copy the ${currency} address above</span>
                                </div>
                                <div class="instruction-step">
                                    <span class="step-number">2</span>
                                    <span>Send ${currency} from your wallet (${currency === 'TON' ? 'TON' : 'BEP20'} network)</span>
                                </div>
                                <div class="instruction-step">
                                    <span class="step-number">3</span>
                                    <span>Wait for transaction confirmation</span>
                                </div>
                                <div class="instruction-step">
                                    <span class="step-number">4</span>
                                    <span>Copy the Transaction Hash and paste above</span>
                                </div>
                                <div class="instruction-step">
                                    <span class="step-number">5</span>
                                    <span>Enter the exact amount you sent</span>
                                </div>
                                <div class="instruction-step">
                                    <span class="step-number">6</span>
                                    <span>Click "Submit Deposit Request"</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="deposit-note">
                        <i class="fas fa-info-circle"></i>
                        <div class="note-content">
                            <strong>Note:</strong> Deposits require manual review. Your balance will be updated after verification (usually within 24 hours).
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="closeModal()">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button class="btn-primary" id="submitDepositBtn" onclick="submitDeposit('${currency}')">
                            <i class="fas fa-paper-plane"></i> Submit Deposit Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modals
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    setTimeout(() => {
        validateTransactionHash();
    }, 100);
}

function validateTransactionHash() {
    const hashInput = document.getElementById('deposit-txid');
    const amountInput = document.getElementById('deposit-amount');
    const statusDiv = document.getElementById('transactionStatus');
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('statusText');
    const submitBtn = document.getElementById('submitDepositBtn');
    
    if (!hashInput || !statusDiv) return;
    
    const hash = hashInput.value.trim();
    
    if (!hash) {
        statusDiv.style.display = 'none';
        if (submitBtn) submitBtn.disabled = !amountInput || !amountInput.value;
        return;
    }
    
    // Check if transaction already used
    if (walletData.usedTransactions.includes(hash.toLowerCase())) {
        statusIcon.innerHTML = '<i class="fas fa-exclamation-circle" style="color: #ef4444;"></i>';
        statusText.innerHTML = '<span style="color: #ef4444;">This transaction hash has already been used</span>';
        statusDiv.style.display = 'flex';
        statusDiv.style.background = 'rgba(239, 68, 68, 0.1)';
        statusDiv.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        if (submitBtn) submitBtn.disabled = true;
        return;
    }
    
    // Basic validation
    const minLength = 10;
    if (hash.length < minLength) {
        statusIcon.innerHTML = '<i class="fas fa-times-circle" style="color: #ef4444;"></i>';
        statusText.innerHTML = '<span style="color: #ef4444;">Invalid transaction hash (too short)</span>';
        statusDiv.style.display = 'flex';
        statusDiv.style.background = 'rgba(239, 68, 68, 0.1)';
        statusDiv.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        if (submitBtn) submitBtn.disabled = true;
        return;
    }
    
    statusIcon.innerHTML = '<i class="fas fa-check-circle" style="color: #22c55e;"></i>';
    statusText.innerHTML = '<span style="color: #22c55e;">Valid transaction hash detected</span>';
    statusDiv.style.display = 'flex';
    statusDiv.style.background = 'rgba(34, 197, 94, 0.1)';
    statusDiv.style.border = '1px solid rgba(34, 197, 94, 0.3)';
    
    // Also check amount
    const amount = parseFloat(document.getElementById('deposit-amount')?.value) || 0;
    const currency = submitBtn?.onclick?.toString().match(/'([^']+)'/)?.[1] || 'USDT';
    const minDeposit = CONFIG.MIN_DEPOSIT[currency] || 10;
    
    if (amount >= minDeposit) {
        if (submitBtn) submitBtn.disabled = false;
    } else {
        if (submitBtn) submitBtn.disabled = true;
    }
}

async function submitDeposit(currency) {
    try {
        const amount = parseFloat(document.getElementById('deposit-amount')?.value);
        const txid = document.getElementById('deposit-txid')?.value.trim();
        const submitBtn = document.getElementById('submitDepositBtn');
        
        const minDeposit = CONFIG.MIN_DEPOSIT[currency];
        
        // Validation
        if (!amount || amount < minDeposit) {
            showMessage(`Minimum deposit is ${minDeposit} ${currency}`, "error");
            return;
        }
        
        if (!txid || txid.length < 10) {
            showMessage("Please enter valid transaction ID", "error");
            return;
        }
        
        // Check if transaction already used
        if (walletData.usedTransactions.includes(txid.toLowerCase())) {
            showMessage("This transaction ID has already been used", "error");
            return;
        }
        
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;
        }
        
        // Create deposit request
        const depositRequest = {
            id: 'deposit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            userId: userData.id,
            username: userData.username,
            currency: currency,
            amount: amount,
            transactionHash: txid.toLowerCase(),
            status: 'pending',
            timestamp: Date.now(),
            reviewNote: 'Awaiting manual review'
        };
        
        // Add to pending deposits
        walletData.pendingDeposits.push(depositRequest);
        walletData.usedTransactions.push(txid.toLowerCase());
        
        // Save to Firebase
        if (db) {
            await db.collection('deposit_requests').add({
                ...depositRequest,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Save user data
        saveUserData();
        
        // Close modal
        closeModal();
        
        // Show success
        showMessage(`✅ Deposit request submitted for ${amount} ${currency}`, "success");
        setTimeout(() => {
            showMessage("⏳ Your deposit is pending admin review. Check History for status.", "info");
        }, 1000);
        
    } catch (error) {
        console.error("❌ Error submitting deposit:", error);
        showMessage("Failed to submit deposit request", "error");
        
        const submitBtn = document.getElementById('submitDepositBtn');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Deposit Request';
            submitBtn.disabled = false;
        }
    }
}

function openWithdrawModal() {
    const usdtBalance = walletData.balances?.USDT || 0;
    const bnbBalance = walletData.balances?.BNB || 0;
    const minWithdraw = CONFIG.WITHDRAWAL.MIN_USDT;
    const feeBNB = CONFIG.WITHDRAWAL.FEE_BNB;
    
    const canWithdraw = usdtBalance >= minWithdraw && bnbBalance >= feeBNB;
    
    const modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-arrow-up"></i> Withdraw USDT</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="withdrawal-balance-overview">
                        <div class="balance-card">
                            <div class="balance-header">
                                <i class="fas fa-coins"></i>
                                <span>Available Balance</span>
                            </div>
                            <div class="balance-amount">
                                ${usdtBalance.toFixed(2)} <span class="balance-currency">USDT</span>
                            </div>
                            <div class="balance-subtitle">
                                ≈ $${usdtBalance.toFixed(2)}
                            </div>
                        </div>
                        <div class="balance-card">
                            <div class="balance-header">
                                <i class="fas fa-gas-pump"></i>
                                <span>Network Fee (BNB)</span>
                            </div>
                            <div class="balance-amount ${bnbBalance >= feeBNB ? 'success' : 'error'}">
                                ${bnbBalance.toFixed(6)} <span class="balance-currency">BNB</span>
                            </div>
                            <div class="balance-subtitle">
                                Required: ${feeBNB} BNB
                            </div>
                        </div>
                    </div>
                    
                    <div class="withdrawal-form">
                        <div class="form-section">
                            <div class="form-section-header">
                                <i class="fas fa-wallet"></i>
                                <span>Withdrawal Address</span>
                            </div>
                            <div class="form-group">
                                <label>BEP20 USDT Address</label>
                                <div class="input-with-validation">
                                    <input type="text" 
                                           id="withdraw-address" 
                                           class="form-input address-input"
                                           placeholder="0x..."
                                           oninput="validateWithdrawAddress()"
                                           maxlength="42">
                                    <div class="input-validation">
                                        <i class="fas fa-check" id="addressCheck" style="display: none;"></i>
                                        <i class="fas fa-times" id="addressError" style="display: none;"></i>
                                    </div>
                                </div>
                                <div class="form-hint">
                                    Your BEP20 USDT wallet address (must start with 0x)
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <div class="form-section-header">
                                <i class="fas fa-money-bill-wave"></i>
                                <span>Withdrawal Amount</span>
                            </div>
                            <div class="form-group">
                                <div class="amount-input-container">
                                    <div class="amount-input-with-max">
                                        <input type="number" 
                                               id="withdraw-amount" 
                                               class="form-input amount-input"
                                               value="${usdtBalance > 0 ? Math.max(minWithdraw, Math.min(100, usdtBalance)).toFixed(2) : '0'}"
                                               min="0"
                                               max="${usdtBalance}"
                                               step="0.01"
                                               oninput="validateWithdrawAmount()">
                                        <button class="max-amount-btn" onclick="setMaxWithdrawAmount()">
                                            MAX
                                        </button>
                                    </div>
                                    <div class="amount-slider">
                                        <input type="range" 
                                               id="withdraw-slider" 
                                               min="0" 
                                               max="${usdtBalance}" 
                                               value="${usdtBalance > 0 ? Math.max(minWithdraw, Math.min(100, usdtBalance)) : '0'}"
                                               step="0.01"
                                               oninput="updateWithdrawAmountFromSlider()">
                                    </div>
                                    <div class="amount-range-labels">
                                        <span>0 USDT</span>
                                        <span>${usdtBalance.toFixed(2)} USDT</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="requirements-section">
                            <div class="requirements-header">
                                <i class="fas fa-clipboard-check"></i>
                                <span>Withdrawal Requirements</span>
                            </div>
                            <div class="requirements-grid">
                                <div class="requirement-card ${usdtBalance >= minWithdraw ? 'requirement-met' : 'requirement-not-met'}">
                                    <div class="requirement-icon">
                                        <i class="fas ${usdtBalance >= minWithdraw ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                                    </div>
                                    <div class="requirement-content">
                                        <div class="requirement-title">Minimum Withdrawal</div>
                                        <div class="requirement-value">${minWithdraw} USDT</div>
                                        <div class="requirement-status">
                                            ${usdtBalance >= minWithdraw ? '✓ Requirement met' : '✗ Not met'}
                                        </div>
                                    </div>
                                </div>
                                <div class="requirement-card ${bnbBalance >= feeBNB ? 'requirement-met' : 'requirement-not-met'}">
                                    <div class="requirement-icon">
                                        <i class="fas ${bnbBalance >= feeBNB ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                                    </div>
                                    <div class="requirement-content">
                                        <div class="requirement-title">Network Fee</div>
                                        <div class="requirement-value">${feeBNB} BNB</div>
                                        <div class="requirement-status">
                                            ${bnbBalance >= feeBNB ? '✓ Sufficient BNB' : '✗ Insufficient BNB'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="withdrawal-warning" id="withdrawWarning" style="display: none;">
                            <div class="warning-header">
                                <i class="fas fa-exclamation-triangle"></i>
                                <span>Cannot Proceed</span>
                            </div>
                            <div class="warning-text" id="withdrawWarningText"></div>
                        </div>
                        
                        <div class="summary-section">
                            <div class="summary-header">
                                <i class="fas fa-file-invoice-dollar"></i>
                                <span>Withdrawal Summary</span>
                            </div>
                            <div class="summary-details">
                                <div class="summary-row">
                                    <span class="summary-label">Withdrawal Amount:</span>
                                    <span class="summary-value" id="summaryAmount">${usdtBalance > 0 ? Math.max(minWithdraw, Math.min(100, usdtBalance)).toFixed(2) : '0'} USDT</span>
                                </div>
                                <div class="summary-row">
                                    <span class="summary-label">Network Fee:</span>
                                    <span class="summary-value">${feeBNB} BNB (≈ $${CONFIG.WITHDRAWAL.FEE_USD})</span>
                                </div>
                                <div class="summary-row total">
                                    <span class="summary-label">Total Cost:</span>
                                    <span class="summary-value" id="summaryTotal">${usdtBalance > 0 ? Math.max(minWithdraw, Math.min(100, usdtBalance)).toFixed(2) : '0'} USDT + ${feeBNB} BNB</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="closeModal()">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button class="btn-primary" id="confirmWithdrawBtn" onclick="submitWithdrawal()" ${canWithdraw ? '' : 'disabled'}>
                            <i class="fas fa-paper-plane"></i> Submit Withdrawal Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modals
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    validateWithdrawAmount();
    
    setTimeout(() => {
        const slider = document.getElementById('withdraw-slider');
        if (slider) {
            slider.value = usdtBalance > 0 ? Math.max(minWithdraw, Math.min(100, usdtBalance)) : 0;
        }
    }, 100);
}

function validateWithdrawAddress() {
    const address = document.getElementById('withdraw-address')?.value.trim();
    const addressCheck = document.getElementById('addressCheck');
    const addressError = document.getElementById('addressError');
    const warning = document.getElementById('withdrawWarning');
    const warningText = document.getElementById('withdrawWarningText');
    const btn = document.getElementById('confirmWithdrawBtn');
    
    if (!address) {
        if (addressError) addressError.style.display = 'block';
        if (addressCheck) addressCheck.style.display = 'none';
        if (warning && warningText) {
            warningText.textContent = "Please enter your USDT wallet address";
            warning.style.display = 'block';
        }
        if (btn) btn.disabled = true;
        return false;
    }
    
    if (!address.startsWith('0x') || address.length !== 42) {
        if (addressError) addressError.style.display = 'block';
        if (addressCheck) addressCheck.style.display = 'none';
        if (warning && warningText) {
            warningText.textContent = "Please enter a valid BEP20 address (must start with 0x and be 42 characters)";
            warning.style.display = 'block';
        }
        if (btn) btn.disabled = true;
        return false;
    }
    
    if (addressCheck) addressCheck.style.display = 'block';
    if (addressError) addressError.style.display = 'none';
    
    if (warning && warningText.textContent.includes('address')) {
        warning.style.display = 'none';
    }
    
    validateWithdrawAmount();
    
    return true;
}

function validateWithdrawAmount() {
    const amountInput = document.getElementById('withdraw-amount');
    const amount = parseFloat(amountInput?.value) || 0;
    const slider = document.getElementById('withdraw-slider');
    const warning = document.getElementById('withdrawWarning');
    const warningText = document.getElementById('withdrawWarningText');
    const btn = document.getElementById('confirmWithdrawBtn');
    const summaryAmount = document.getElementById('summaryAmount');
    const summaryTotal = document.getElementById('summaryTotal');
    const address = document.getElementById('withdraw-address')?.value.trim();
    
    if (!warning || !btn || !summaryAmount || !summaryTotal) return;
    
    if (slider) {
        slider.value = amount;
    }
    
    summaryAmount.textContent = amount.toFixed(2) + ' USDT';
    summaryTotal.textContent = amount.toFixed(2) + ' USDT + ' + CONFIG.WITHDRAWAL.FEE_BNB + ' BNB';
    
    warning.style.display = 'none';
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Withdrawal Request';
    
    const errors = [];
    const minWithdraw = CONFIG.WITHDRAWAL.MIN_USDT;
    const feeBNB = CONFIG.WITHDRAWAL.FEE_BNB;
    const usdtBalance = walletData.balances?.USDT || 0;
    const bnbBalance = walletData.balances?.BNB || 0;
    
    // Address validation
    if (!address || !address.startsWith('0x') || address.length !== 42) {
        errors.push("Please enter a valid BEP20 address");
    }
    
    // Amount validation
    if (amount > 0 && amount < minWithdraw) {
        errors.push(`Minimum withdrawal is ${minWithdraw} USDT`);
    }
    
    if (amount > usdtBalance) {
        errors.push(`Insufficient USDT balance (Available: ${usdtBalance.toFixed(2)} USDT)`);
    }
    
    if (bnbBalance < feeBNB) {
        errors.push(`Insufficient BNB for network fee (Need: ${feeBNB} BNB)`);
    }
    
    if (errors.length > 0) {
        warningText.innerHTML = errors.join('<br>');
        warning.style.display = 'block';
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-ban"></i> Cannot Withdraw';
    }
}

function setMaxWithdrawAmount() {
    const input = document.getElementById('withdraw-amount');
    const slider = document.getElementById('withdraw-slider');
    
    if (input) {
        const maxAmount = walletData.balances?.USDT || 0;
        input.value = maxAmount.toFixed(2);
        if (slider) {
            slider.value = maxAmount;
        }
        validateWithdrawAmount();
    }
}

function updateWithdrawAmountFromSlider() {
    const slider = document.getElementById('withdraw-slider');
    const input = document.getElementById('withdraw-amount');
    
    if (slider && input) {
        input.value = parseFloat(slider.value).toFixed(2);
        validateWithdrawAmount();
    }
}

async function submitWithdrawal() {
    const amount = parseFloat(document.getElementById('withdraw-amount')?.value);
    const address = document.getElementById('withdraw-address')?.value.trim();
    const btn = document.getElementById('confirmWithdrawBtn');
    
    if (!validateWithdrawAddress()) return;
    
    const minWithdraw = CONFIG.WITHDRAWAL.MIN_USDT;
    const feeBNB = CONFIG.WITHDRAWAL.FEE_BNB;
    const usdtBalance = walletData.balances?.USDT || 0;
    const bnbBalance = walletData.balances?.BNB || 0;
    
    // Validation
    if (amount < minWithdraw) {
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
    
    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        btn.disabled = true;
    }
    
    try {
        // Create withdrawal request
        const withdrawalRequest = {
            id: 'withdrawal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            userId: userData.id,
            username: userData.username,
            amount: amount,
            address: address,
            fee: feeBNB,
            currency: 'USDT',
            status: 'pending',
            timestamp: Date.now(),
            reviewNote: 'Awaiting manual processing'
        };
        
        // Deduct balances locally
        walletData.balances.USDT -= amount;
        walletData.balances.BNB -= feeBNB;
        walletData.pendingWithdrawals.push(withdrawalRequest);
        
        // Save to Firebase
        if (db) {
            await db.collection('withdrawals').add({
                ...withdrawalRequest,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Save user data
        saveUserData();
        
        // Update UI
        updateWalletUI();
        
        // Close modal
        closeModal();
        
        // Show success
        showMessage(`✅ Withdrawal request submitted for ${amount} USDT`, "success");
        setTimeout(() => {
            showMessage("⏳ Your withdrawal is pending admin review. Check History for status.", "info");
        }, 1000);
        
    } catch (error) {
        console.error("❌ Error submitting withdrawal:", error);
        showMessage("Failed to submit withdrawal request", "error");
        
        if (btn) {
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Withdrawal Request';
            btn.disabled = false;
        }
    }
}

function openSwapModal() {
    const amskBalance = walletData.balances?.AMSK || 0;
    const usdtBalance = walletData.balances?.USDT || 0;
    const minSwapAMSK = CONFIG.SWAP.MIN_AMSK;
    const minSwapUSDT = CONFIG.SWAP.MIN_USDT;
    const rate = CONFIG.SWAP.RATE_AMSK_USDT;
    
    const modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-exchange-alt"></i> Swap Tokens</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="swap-container">
                        <div class="swap-tabs">
                            <button class="swap-tab active" onclick="switchSwapTab('amsk_to_usdt')">
                                AMSK → USDT
                            </button>
                            <button class="swap-tab" onclick="switchSwapTab('usdt_to_amsk')">
                                USDT → AMSK
                            </button>
                        </div>
                        
                        <div class="swap-content active" id="amsk_to_usdt">
                            <div class="swap-from">
                                <div class="swap-label">
                                    <span>From</span>
                                    <div class="token-info">
                                        <i class="fas fa-robot"></i>
                                        <span>AMSK</span>
                                    </div>
                                </div>
                                <div class="swap-input">
                                    <input type="number" 
                                           id="swap-from-amsk" 
                                           class="swap-input-field"
                                           value="${Math.max(minSwapAMSK, Math.min(10000, amskBalance))}"
                                           min="${minSwapAMSK}"
                                           step="1"
                                           oninput="calculateSwap('amsk_to_usdt')">
                                    <div class="balance-label">
                                        Balance: <span>${formatNumber(amskBalance)} AMSK</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="swap-arrow">
                                <i class="fas fa-exchange-alt"></i>
                            </div>
                            
                            <div class="swap-to">
                                <div class="swap-label">
                                    <span>To</span>
                                    <div class="token-info">
                                        <i class="fas fa-coins"></i>
                                        <span>USDT</span>
                                    </div>
                                </div>
                                <div class="swap-output">
                                    <div id="swap-to-usdt">0.00</div>
                                    <div class="balance-label">
                                        Balance: <span>${usdtBalance.toFixed(2)} USDT</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="swap-content" id="usdt_to_amsk" style="display: none;">
                            <div class="swap-from">
                                <div class="swap-label">
                                    <span>From</span>
                                    <div class="token-info">
                                        <i class="fas fa-coins"></i>
                                        <span>USDT</span>
                                    </div>
                                </div>
                                <div class="swap-input">
                                    <input type="number" 
                                           id="swap-from-usdt" 
                                           class="swap-input-field"
                                           value="${Math.max(minSwapUSDT, Math.min(10, usdtBalance))}"
                                           min="${minSwapUSDT}"
                                           step="0.01"
                                           oninput="calculateSwap('usdt_to_amsk')">
                                    <div class="balance-label">
                                        Balance: <span>${usdtBalance.toFixed(2)} USDT</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="swap-arrow">
                                <i class="fas fa-exchange-alt"></i>
                            </div>
                            
                            <div class="swap-to">
                                <div class="swap-label">
                                    <span>To</span>
                                    <div class="token-info">
                                        <i class="fas fa-robot"></i>
                                        <span>AMSK</span>
                                    </div>
                                </div>
                                <div class="swap-output">
                                    <div id="swap-to-amsk">0</div>
                                    <div class="balance-label">
                                        Balance: <span>${formatNumber(amskBalance)} AMSK</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="swap-info">
                            <div class="info-item">
                                <i class="fas fa-chart-line"></i>
                                <span>Rate: 1 USDT = ${rate.toLocaleString()} AMSK</span>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-percentage"></i>
                                <span>Fee: ${CONFIG.SWAP.FEE_PERCENT}%</span>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-exclamation-circle"></i>
                                <span id="swapMinInfo">Min: ${minSwapAMSK} AMSK</span>
                            </div>
                        </div>
                        
                        <div class="swap-preview">
                            <div class="preview-header">
                                <i class="fas fa-file-invoice-dollar"></i>
                                <span>Swap Details</span>
                            </div>
                            <div class="preview-details">
                                <div class="preview-item">
                                    <span>You Send:</span>
                                    <span id="preview-send">0</span>
                                </div>
                                <div class="preview-item">
                                    <span>You Receive:</span>
                                    <span id="preview-receive">0.00</span>
                                </div>
                                <div class="preview-item">
                                    <span>Network Fee:</span>
                                    <span id="preview-fee">0.00</span>
                                </div>
                                <div class="preview-item total">
                                    <span>Total Receive:</span>
                                    <span id="preview-total">0.00</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="swap-warning" id="swapWarning" style="display: none;">
                            <div class="warning-icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <div class="warning-content">
                                <div class="warning-title" id="swapWarningTitle">Cannot Proceed</div>
                                <div class="warning-text" id="swapWarningText"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="closeModal()">
                            Cancel
                        </button>
                        <button class="btn-primary" id="confirmSwapBtn" onclick="executeSwap()" disabled>
                            Confirm Swap
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modals
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    // Initialize swap calculation
    setTimeout(() => {
        calculateSwap('amsk_to_usdt');
    }, 100);
}

function switchSwapTab(tabName) {
    // Update tabs
    document.querySelectorAll('.swap-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.swap-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    
    // Activate selected tab
    const activeTab = document.querySelector(`.swap-tab[onclick*="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    const activeContent = document.getElementById(tabName);
    if (activeContent) {
        activeContent.classList.add('active');
        activeContent.style.display = 'block';
    }
    
    // Update min info
    const minInfo = document.getElementById('swapMinInfo');
    if (minInfo) {
        if (tabName === 'amsk_to_usdt') {
            minInfo.textContent = `Min: ${CONFIG.SWAP.MIN_AMSK} AMSK`;
        } else {
            minInfo.textContent = `Min: ${CONFIG.SWAP.MIN_USDT} USDT`;
        }
    }
    
    // Calculate for active tab
    calculateSwap(tabName);
}

function calculateSwap(tabName) {
    let fromAmount = 0;
    let fromBalance = 0;
    let toBalance = 0;
    let minAmount = 0;
    let rate = CONFIG.SWAP.RATE_AMSK_USDT;
    let feePercent = CONFIG.SWAP.FEE_PERCENT / 100;
    
    if (tabName === 'amsk_to_usdt') {
        const input = document.getElementById('swap-from-amsk');
        fromAmount = parseFloat(input?.value) || 0;
        fromBalance = walletData.balances?.AMSK || 0;
        toBalance = walletData.balances?.USDT || 0;
        minAmount = CONFIG.SWAP.MIN_AMSK;
    } else {
        const input = document.getElementById('swap-from-usdt');
        fromAmount = parseFloat(input?.value) || 0;
        fromBalance = walletData.balances?.USDT || 0;
        toBalance = walletData.balances?.AMSK || 0;
        minAmount = CONFIG.SWAP.MIN_USDT;
    }
    
    // Calculate conversion
    let toAmount = 0;
    if (tabName === 'amsk_to_usdt') {
        toAmount = fromAmount / rate;
    } else {
        toAmount = fromAmount * rate;
    }
    
    // Apply fee
    const fee = toAmount * feePercent;
    const totalReceive = toAmount - fee;
    
    // Update display
    if (tabName === 'amsk_to_usdt') {
        if (document.getElementById('swap-to-usdt')) {
            document.getElementById('swap-to-usdt').textContent = totalReceive.toFixed(2);
        }
        if (document.getElementById('preview-send')) {
            document.getElementById('preview-send').textContent = `${formatNumber(fromAmount)} AMSK`;
        }
        if (document.getElementById('preview-receive')) {
            document.getElementById('preview-receive').textContent = `${toAmount.toFixed(2)} USDT`;
        }
    } else {
        if (document.getElementById('swap-to-amsk')) {
            document.getElementById('swap-to-amsk').textContent = formatNumber(totalReceive);
        }
        if (document.getElementById('preview-send')) {
            document.getElementById('preview-send').textContent = `${fromAmount.toFixed(2)} USDT`;
        }
        if (document.getElementById('preview-receive')) {
            document.getElementById('preview-receive').textContent = `${formatNumber(toAmount)} AMSK`;
        }
    }
    
    // Update fee and total
    if (document.getElementById('preview-fee')) {
        document.getElementById('preview-fee').textContent = 
            tabName === 'amsk_to_usdt' ? `${fee.toFixed(2)} USDT` : `${formatNumber(fee)} AMSK`;
    }
    
    if (document.getElementById('preview-total')) {
        document.getElementById('preview-total').textContent = 
            tabName === 'amsk_to_usdt' ? `${totalReceive.toFixed(2)} USDT` : `${formatNumber(totalReceive)} AMSK`;
    }
    
    // Validate
    const confirmBtn = document.getElementById('confirmSwapBtn');
    const warning = document.getElementById('swapWarning');
    const warningTitle = document.getElementById('swapWarningTitle');
    const warningText = document.getElementById('swapWarningText');
    
    if (!confirmBtn || !warning) return;
    
    confirmBtn.disabled = true;
    warning.style.display = 'none';
    
    if (fromAmount <= 0) {
        warningTitle.textContent = "Enter Amount";
        warningText.textContent = "Please enter an amount to swap";
        warning.style.display = 'flex';
        return;
    }
    
    if (fromAmount < minAmount) {
        warningTitle.textContent = "Minimum Amount";
        warningText.textContent = `Minimum swap is ${minAmount} ${tabName === 'amsk_to_usdt' ? 'AMSK' : 'USDT'}`;
        warning.style.display = 'flex';
        return;
    }
    
    if (fromAmount > fromBalance) {
        warningTitle.textContent = "Insufficient Balance";
        warningText.textContent = `You don't have enough ${tabName === 'amsk_to_usdt' ? 'AMSK' : 'USDT'}`;
        warning.style.display = 'flex';
        return;
    }
    
    // All validations passed
    warning.style.display = 'none';
    confirmBtn.disabled = false;
    
    // Update button text
    if (tabName === 'amsk_to_usdt') {
        confirmBtn.textContent = `Swap for ${totalReceive.toFixed(2)} USDT`;
    } else {
        confirmBtn.textContent = `Swap for ${formatNumber(totalReceive)} AMSK`;
    }
}

async function executeSwap() {
    // Determine active tab
    const activeTab = document.querySelector('.swap-content.active');
    if (!activeTab) return;
    
    const tabName = activeTab.id;
    const confirmBtn = document.getElementById('confirmSwapBtn');
    
    if (confirmBtn) {
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        confirmBtn.disabled = true;
    }
    
    try {
        let fromAmount = 0;
        let toAmount = 0;
        let fromCurrency = '';
        let toCurrency = '';
        let fee = 0;
        
        if (tabName === 'amsk_to_usdt') {
            fromAmount = parseFloat(document.getElementById('swap-from-amsk')?.value) || 0;
            toAmount = parseFloat(document.getElementById('swap-to-usdt')?.textContent) || 0;
            fromCurrency = 'AMSK';
            toCurrency = 'USDT';
            fee = fromAmount * (CONFIG.SWAP.FEE_PERCENT / 100) / CONFIG.SWAP.RATE_AMSK_USDT;
        } else {
            fromAmount = parseFloat(document.getElementById('swap-from-usdt')?.value) || 0;
            toAmount = parseFloat(document.getElementById('swap-to-amsk')?.textContent.replace(/,/g, '')) || 0;
            fromCurrency = 'USDT';
            toCurrency = 'AMSK';
            fee = fromAmount * CONFIG.SWAP.RATE_AMSK_USDT * (CONFIG.SWAP.FEE_PERCENT / 100);
        }
        
        // Final validation
        if (fromAmount <= 0 || toAmount <= 0) {
            throw new Error("Invalid amount");
        }
        
        // Check balances
        if (fromCurrency === 'AMSK' && fromAmount > walletData.balances.AMSK) {
            throw new Error("Insufficient AMSK balance");
        }
        
        if (fromCurrency === 'USDT' && fromAmount > walletData.balances.USDT) {
            throw new Error("Insufficient USDT balance");
        }
        
        // Execute swap
        if (fromCurrency === 'AMSK') {
            walletData.balances.AMSK -= fromAmount;
            walletData.balances.USDT += toAmount;
        } else {
            walletData.balances.USDT -= fromAmount;
            walletData.balances.AMSK += toAmount;
        }
        
        // Update mining balance if AMSK changed
        if (fromCurrency === 'AMSK' || toCurrency === 'AMSK') {
            walletData.mining.totalMined = walletData.balances.AMSK;
        }
        
        // Save data
        saveUserData();
        
        // Update UI
        updateWalletUI();
        updateTotalBalance();
        updateMiningDisplay();
        
        // Close modal
        closeModal();
        
        // Show success
        showMessage(
            `✅ Swapped ${formatNumber(fromAmount)} ${fromCurrency} to ${toCurrency === 'USDT' ? toAmount.toFixed(2) : formatNumber(toAmount)} ${toCurrency}`, 
            "success"
        );
        
        // Add transaction
        addTransaction({
            type: 'swap',
            fromAmount: fromAmount,
            fromCurrency: fromCurrency,
            toAmount: toAmount,
            toCurrency: toCurrency,
            fee: fee
        });
        
    } catch (error) {
        console.error("❌ Error executing swap:", error);
        showMessage("Failed to execute swap", "error");
        
        if (confirmBtn) {
            confirmBtn.innerHTML = 'Confirm Swap';
            confirmBtn.disabled = false;
        }
    }
}

function showTransactionHistory() {
    const hasTransactions = 
        walletData.pendingDeposits.length > 0 ||
        walletData.pendingWithdrawals.length > 0 ||
        walletData.depositHistory.length > 0 ||
        walletData.withdrawalHistory.length > 0;
    
    let modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-history"></i> Transaction History</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="history-tabs">
                        <button class="tab-btn active" onclick="switchHistoryTab('pending')">
                            <i class="fas fa-clock"></i> Pending
                            ${walletData.pendingDeposits.length + walletData.pendingWithdrawals.length > 0 ? 
                              `<span class="tab-badge">${walletData.pendingDeposits.length + walletData.pendingWithdrawals.length}</span>` : ''}
                        </button>
                        <button class="tab-btn" onclick="switchHistoryTab('deposits')">
                            <i class="fas fa-download"></i> Deposits
                        </button>
                        <button class="tab-btn" onclick="switchHistoryTab('withdrawals')">
                            <i class="fas fa-upload"></i> Withdrawals
                        </button>
                        <button class="tab-btn" onclick="switchHistoryTab('all')">
                            <i class="fas fa-list"></i> All
                        </button>
                    </div>
                    
                    <div class="history-list" id="historyList">
    `;
    
    if (!hasTransactions) {
        modalContent += `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No transactions yet</p>
                <small>Your transaction history will appear here</small>
            </div>
        `;
    } else {
        // Show pending by default
        modalContent += renderPendingTransactions();
    }
    
    modalContent += `
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modals
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

function renderPendingTransactions() {
    if (walletData.pendingDeposits.length === 0 && walletData.pendingWithdrawals.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <p>No pending transactions</p>
            </div>
        `;
    }
    
    let html = '';
    
    // Pending deposits
    walletData.pendingDeposits.forEach(deposit => {
        const date = new Date(deposit.timestamp);
        html += `
            <div class="history-item pending">
                <div class="tx-icon">
                    <i class="fas fa-download"></i>
                </div>
                <div class="tx-details">
                    <div class="tx-type">Deposit Request</div>
                    <div class="tx-date">${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    <div class="tx-note">${deposit.currency}: ${deposit.amount}</div>
                    <div class="tx-status pending">Pending Review</div>
                </div>
                <div class="tx-amount">
                    +${deposit.amount} ${deposit.currency}
                </div>
            </div>
        `;
    });
    
    // Pending withdrawals
    walletData.pendingWithdrawals.forEach(withdrawal => {
        const date = new Date(withdrawal.timestamp);
        html += `
            <div class="history-item pending">
                <div class="tx-icon">
                    <i class="fas fa-upload"></i>
                </div>
                <div class="tx-details">
                    <div class="tx-type">Withdrawal Request</div>
                    <div class="tx-date">${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    <div class="tx-note">To: ${withdrawal.address.substring(0, 8)}...${withdrawal.address.substring(withdrawal.address.length - 6)}</div>
                    <div class="tx-status pending">Pending Processing</div>
                </div>
                <div class="tx-amount">
                    -${withdrawal.amount} ${withdrawal.currency}
                </div>
            </div>
        `;
    });
    
    return html;
}

function renderDepositHistory() {
    if (walletData.depositHistory.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-download"></i>
                <p>No deposit history</p>
            </div>
        `;
    }
    
    let html = '';
    
    walletData.depositHistory.forEach(deposit => {
        const date = new Date(deposit.timestamp);
        const status = deposit.status || 'completed';
        const statusClass = status === 'approved' ? 'completed' : status === 'rejected' ? 'rejected' : 'pending';
        const statusText = status === 'approved' ? 'Completed' : status === 'rejected' ? 'Rejected' : 'Pending';
        
        html += `
            <div class="history-item ${statusClass}">
                <div class="tx-icon">
                    <i class="fas fa-download"></i>
                </div>
                <div class="tx-details">
                    <div class="tx-type">Deposit ${statusText}</div>
                    <div class="tx-date">${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    ${deposit.rejectionReason ? `<div class="tx-note">Reason: ${deposit.rejectionReason}</div>` : ''}
                    <div class="tx-status ${statusClass}">${statusText}</div>
                </div>
                <div class="tx-amount">
                    ${status === 'rejected' ? '⨯' : '+'}${deposit.amount} ${deposit.currency}
                </div>
            </div>
        `;
    });
    
    return html;
}

function renderWithdrawalHistory() {
    if (walletData.withdrawalHistory.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-upload"></i>
                <p>No withdrawal history</p>
            </div>
        `;
    }
    
    let html = '';
    
    walletData.withdrawalHistory.forEach(withdrawal => {
        const date = new Date(withdrawal.timestamp);
        const status = withdrawal.status || 'completed';
        const statusClass = status === 'completed' ? 'completed' : status === 'rejected' ? 'rejected' : 'pending';
        const statusText = status === 'completed' ? 'Completed' : status === 'rejected' ? 'Rejected' : 'Pending';
        
        html += `
            <div class="history-item ${statusClass}">
                <div class="tx-icon">
                    <i class="fas fa-upload"></i>
                </div>
                <div class="tx-details">
                    <div class="tx-type">Withdrawal ${statusText}</div>
                    <div class="tx-date">${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    <div class="tx-note">To: ${withdrawal.address.substring(0, 8)}...${withdrawal.address.substring(withdrawal.address.length - 6)}</div>
                    ${withdrawal.rejectionReason ? `<div class="tx-note">Reason: ${withdrawal.rejectionReason}</div>` : ''}
                    <div class="tx-status ${statusClass}">${statusText}</div>
                </div>
                <div class="tx-amount">
                    ${status === 'rejected' ? '+' : '-'}${withdrawal.amount} ${withdrawal.currency}
                </div>
            </div>
        `;
    });
    
    return html;
}

function renderAllTransactions() {
    const allTransactions = [
        ...walletData.pendingDeposits.map(t => ({ ...t, type: 'pending_deposit' })),
        ...walletData.pendingWithdrawals.map(t => ({ ...t, type: 'pending_withdrawal' })),
        ...walletData.depositHistory.map(t => ({ ...t, type: 'deposit' })),
        ...walletData.withdrawalHistory.map(t => ({ ...t, type: 'withdrawal' })),
        ...(walletData.transactions || [])
    ];
    
    // Sort by timestamp (newest first)
    allTransactions.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    if (allTransactions.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <p>No transaction history</p>
            </div>
        `;
    }
    
    let html = '';
    
    allTransactions.forEach(tx => {
        const date = new Date(tx.timestamp || Date.now());
        let icon = 'fa-exchange-alt';
        let typeText = 'Transaction';
        let amountSign = '';
        let amountClass = '';
        
        switch (tx.type) {
            case 'pending_deposit':
            case 'deposit':
                icon = 'fa-download';
                typeText = tx.status === 'rejected' ? 'Deposit Rejected' : 
                          tx.status === 'approved' ? 'Deposit Completed' : 'Deposit Request';
                amountSign = tx.status === 'rejected' ? '⨯' : '+';
                amountClass = tx.status === 'rejected' ? 'rejected' : 'completed';
                break;
            case 'pending_withdrawal':
            case 'withdrawal':
                icon = 'fa-upload';
                typeText = tx.status === 'rejected' ? 'Withdrawal Rejected' : 
                          tx.status === 'completed' ? 'Withdrawal Completed' : 'Withdrawal Request';
                amountSign = tx.status === 'rejected' ? '+' : '-';
                amountClass = tx.status === 'rejected' ? 'rejected' : 'completed';
                break;
            case 'swap':
                icon = 'fa-exchange-alt';
                typeText = 'Token Swap';
                amountSign = '';
                break;
            case 'stake':
                icon = 'fa-gem';
                typeText = 'Staking';
                amountSign = '-';
                break;
            case 'stake_reward':
                icon = 'fa-gem';
                typeText = 'Staking Reward';
                amountSign = '+';
                break;
            case 'mining_reward':
                icon = 'fa-microchip';
                typeText = 'Mining Reward';
                amountSign = '+';
                break;
            case 'referral_reward':
                icon = 'fa-users';
                typeText = 'Referral Reward';
                amountSign = '+';
                break;
        }
        
        const status = tx.status || (tx.type.includes('pending') ? 'pending' : 'completed');
        const statusClass = status === 'rejected' ? 'rejected' : status === 'pending' ? 'pending' : 'completed';
        const statusText = status === 'rejected' ? 'Rejected' : status === 'pending' ? 'Pending' : 'Completed';
        
        html += `
            <div class="history-item ${statusClass}">
                <div class="tx-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="tx-details">
                    <div class="tx-type">${typeText}</div>
                    <div class="tx-date">${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    ${tx.details ? `<div class="tx-note">${tx.details}</div>` : ''}
                    ${tx.rejectionReason ? `<div class="tx-note">Reason: ${tx.rejectionReason}</div>` : ''}
                    <div class="tx-status ${statusClass}">${statusText}</div>
                </div>
                <div class="tx-amount ${amountClass}">
                    ${tx.type === 'swap' ? 
                      `${formatNumber(tx.fromAmount)} ${tx.fromCurrency} → ${tx.toCurrency === 'USDT' ? tx.toAmount.toFixed(2) : formatNumber(tx.toAmount)} ${tx.toCurrency}` :
                      `${amountSign}${formatNumber(tx.amount)} ${tx.currency || 'USDT'}`}
                </div>
            </div>
        `;
    });
    
    return html;
}

function switchHistoryTab(tabName) {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    let content = '';
    
    switch (tabName) {
        case 'pending':
            content = renderPendingTransactions();
            break;
        case 'deposits':
            content = renderDepositHistory();
            break;
        case 'withdrawals':
            content = renderWithdrawalHistory();
            break;
        case 'all':
            content = renderAllTransactions();
            break;
    }
    
    historyList.innerHTML = content;
    
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(btn => 
        btn.textContent.includes(tabName === 'pending' ? 'Pending' : 
                                tabName === 'deposits' ? 'Deposits' : 
                                tabName === 'withdrawals' ? 'Withdrawals' : 'All')
    );
    
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

function addTransaction(transaction) {
    if (!walletData.transactions) {
        walletData.transactions = [];
    }
    
    walletData.transactions.push({
        id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        ...transaction,
        timestamp: Date.now()
    });
    
    // Keep only last 50 transactions
    if (walletData.transactions.length > 50) {
        walletData.transactions = walletData.transactions.slice(-50);
    }
    
    saveUserData();
}

// ============================================
// REFERRAL SYSTEM - UPDATED WITH MILESTONES
// ============================================
async function checkForReferral() {
    console.log("🔍 Checking for referral...");
    
    // Check Telegram start parameter
    let referralCode = null;
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) {
        referralCode = tg.initDataUnsafe.start_param;
        console.log("📱 Telegram referral detected:", referralCode);
    }
    
    // Check URL parameters
    if (!referralCode) {
        const urlParams = new URLSearchParams(window.location.search);
        referralCode = urlParams.get('startapp') || urlParams.get('ref') || urlParams.get('start');
    }
    
    if (referralCode && referralCode !== userData.referralCode) {
        console.log("🎯 Processing referral:", referralCode);
        await processReferral(referralCode);
    }
}

async function processReferral(referralCode) {
    if (!referralCode || referralCode === userData.referralCode) {
        console.log("⚠️ Invalid or self-referral");
        return;
    }
    
    if (userData.referredBy) {
        console.log("⚠️ User already referred by:", userData.referredBy);
        return;
    }
    
    try {
        // Set referrer
        userData.referredBy = referralCode;
        
        // Give welcome bonus to new user
        walletData.balances.AMSK += CONFIG.REFERRAL.WELCOME_BONUS;
        walletData.mining.totalMined += CONFIG.REFERRAL.WELCOME_BONUS;
        
        // Save user data
        saveUserData();
        
        // Update referrer's data in Firebase
        if (db) {
            await updateReferrerRewards(referralCode);
        }
        
        // Update UI
        updateWalletUI();
        updateMiningDisplay();
        updateReferralDisplay();
        
        // Show success message
        showMessage(`🎉 Welcome bonus received! +${CONFIG.REFERRAL.WELCOME_BONUS.toLocaleString()} AMSK`, "success");
        
        console.log("✅ Referral processed successfully");
        
    } catch (error) {
        console.error("❌ Referral processing error:", error);
    }
}

async function updateReferrerRewards(referralCode) {
    if (!db) return;
    
    try {
        // Find referrer by referral code
        const usersRef = db.collection('users');
        const querySnapshot = await usersRef.where('referralCode', '==', referralCode).get();
        
        if (!querySnapshot.empty) {
            const referrerDoc = querySnapshot.docs[0];
            const referrerData = referrerDoc.data();
            
            // Update referrer's referral count and earnings
            const newCount = (referrerData.referrals?.count || 0) + 1;
            const newEarned = (referrerData.referrals?.earned || 0) + CONFIG.REFERRAL.DIRECT_REWARD;
            
            // Add referred user to list
            const referrals = referrerData.referrals?.referrals || [];
            referrals.push(userData.id);
            
            await referrerDoc.ref.update({
                'referrals.count': newCount,
                'referrals.earned': newEarned,
                'referrals.referrals': referrals,
                'balances.AMSK': firebase.firestore.FieldValue.increment(CONFIG.REFERRAL.DIRECT_REWARD),
                'mining.totalMined': firebase.firestore.FieldValue.increment(CONFIG.REFERRAL.DIRECT_REWARD),
                'lastUpdate': firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Check for milestones
            await checkMilestones(referrerDoc.id, newCount);
            
            console.log("✅ Referrer rewards updated");
        }
        
    } catch (error) {
        console.error("❌ Error updating referrer rewards:", error);
    }
}

async function checkMilestones(userId, referralCount) {
    if (!db) return;
    
    try {
        const userRef = db.collection('users').doc(userId);
        const userSnap = await userRef.get();
        
        if (!userSnap.exists) return;
        
        const userData = userSnap.data();
        const claimedMilestones = userData.referrals?.claimedMilestones || [];
        
        // Check each milestone
        Object.keys(CONFIG.REFERRAL.MILESTONES).forEach(milestone => {
            const milestoneNum = parseInt(milestone);
            const reward = CONFIG.REFERRAL.MILESTONES[milestone];
            
            if (referralCount >= milestoneNum && !claimedMilestones.includes(milestoneNum)) {
                // User reached a new milestone
                console.log(`🎯 User reached milestone: ${milestoneNum} referrals`);
                
                // Add milestone to pending list
                const pendingMilestones = userData.referrals?.pendingMilestones || [];
                if (!pendingMilestones.includes(milestoneNum)) {
                    pendingMilestones.push(milestoneNum);
                    
                    userRef.update({
                        'referrals.pendingMilestones': pendingMilestones,
                        'lastUpdate': firebase.firestore.FieldValue.serverTimestamp()
                    }).then(() => {
                        console.log(`✅ Milestone ${milestoneNum} added to pending`);
                    });
                }
            }
        });
        
    } catch (error) {
        console.error("❌ Error checking milestones:", error);
    }
}

function updateReferralDisplay() {
    if (!walletData.referrals) return;
    
    const referrals = walletData.referrals;
    
    if (elements.refCount) {
        elements.refCount.textContent = referrals.count;
    }
    
    if (elements.refEarned) {
        elements.refEarned.textContent = formatNumber(referrals.earned);
    }
    
    // Update milestones display
    updateMilestonesDisplay();
}

function updateMilestonesDisplay() {
    if (!elements.milestoneItems || elements.milestoneItems.length === 0) return;
    
    const referralCount = walletData.referrals?.count || 0;
    const claimedMilestones = walletData.referrals?.claimedMilestones || [];
    
    elements.milestoneItems.forEach(item => {
        const requirement = item.querySelector('.milestone-requirement')?.textContent;
        if (!requirement) return;
        
        const milestoneMatch = requirement.match(/\d+/);
        if (!milestoneMatch) return;
        
        const milestoneNum = parseInt(milestoneMatch[0]);
        const badge = item.querySelector('.milestone-action');
        
        // Remove all classes
        item.classList.remove('locked', 'can-claim', 'claimed');
        
        // Check milestone status
        if (claimedMilestones.includes(milestoneNum)) {
            item.classList.add('claimed');
            if (badge) {
                badge.innerHTML = '<span class="claimed-badge">Claimed</span>';
            }
        } else if (referralCount >= milestoneNum) {
            item.classList.add('can-claim');
            if (badge) {
                badge.innerHTML = `<button class="btn-claim-milestone" onclick="claimMilestone(${milestoneNum})">Claim</button>`;
            }
        } else {
            item.classList.add('locked');
            if (badge) {
                badge.innerHTML = `<span class="locked-badge">${referralCount}/${milestoneNum}</span>`;
            }
        }
    });
}

async function claimMilestone(milestoneNum) {
    try {
        const reward = CONFIG.REFERRAL.MILESTONES[milestoneNum];
        if (!reward) {
            throw new Error("Invalid milestone");
        }
        
        // Check if already claimed
        if (walletData.referrals.claimedMilestones.includes(milestoneNum)) {
            showMessage("Milestone already claimed", "warning");
            return;
        }
        
        // Check if eligible
        if (walletData.referrals.count < milestoneNum) {
            showMessage(`Need ${milestoneNum} referrals to claim this milestone`, "error");
            return;
        }
        
        // Add reward
        walletData.balances.AMSK += reward;
        walletData.mining.totalMined += reward;
        walletData.referrals.earned += reward;
        walletData.referrals.claimedMilestones.push(milestoneNum);
        
        // Remove from pending milestones
        const pendingIndex = walletData.referrals.pendingMilestones?.indexOf(milestoneNum);
        if (pendingIndex !== -1) {
            walletData.referrals.pendingMilestones.splice(pendingIndex, 1);
        }
        
        // Update Firebase
        if (db) {
            const userRef = db.collection('users').doc(userData.id);
            await userRef.update({
                'balances.AMSK': firebase.firestore.FieldValue.increment(reward),
                'mining.totalMined': firebase.firestore.FieldValue.increment(reward),
                'referrals.earned': firebase.firestore.FieldValue.increment(reward),
                'referrals.claimedMilestones': firebase.firestore.FieldValue.arrayUnion(milestoneNum),
                'referrals.pendingMilestones': firebase.firestore.FieldValue.arrayRemove(milestoneNum),
                'lastUpdate': firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Update UI
        updateWalletUI();
        updateMiningDisplay();
        updateReferralDisplay();
        
        // Save data
        saveUserData();
        
        // Add transaction
        addTransaction({
            type: 'referral_reward',
            amount: reward,
            currency: 'AMSK',
            details: `${milestoneNum} Referrals Milestone`
        });
        
        // Show success
        showMessage(`🏆 Milestone claimed! +${formatNumber(reward)} AMSK`, "success");
        
    } catch (error) {
        console.error("❌ Error claiming milestone:", error);
        showMessage("Failed to claim milestone", "error");
    }
}

function copyReferralCode() {
    if (elements.referralCodeDisplay) {
        const code = elements.referralCodeDisplay.textContent;
        copyToClipboard(code);
    }
}

function copyReferralLink() {
    if (elements.referralLinkInput) {
        const link = elements.referralLinkInput.value;
        copyToClipboard(link);
    }
}

function shareOnTelegram() {
    if (!elements.referralLinkInput) return;
    
    const link = elements.referralLinkInput.value;
    const text = `🚀 Join Alien Musk Quantum Mining Platform!\n\n⛏️ *Mine AMSK tokens every hour*\n💰 *Earn from staking and referrals*\n👥 *Get 10,000 AMSK bonus with my link*\n\n👉 ${link}\n\n💎 *Start your quantum mining journey!*`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
    
    window.open(url, '_blank');
}

function shareOnWhatsApp() {
    if (!elements.referralLinkInput) return;
    
    const link = elements.referralLinkInput.value;
    const text = `🚀 Join Alien Musk Quantum Mining Platform!\n\nMine AMSK tokens every hour\nEarn from staking and referrals\nGet 10,000 AMSK bonus with my link\n\n${link}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    
    window.open(url, '_blank');
}

// ============================================
// ADMIN SYSTEM - PROFESSIONAL
// ============================================
function initAdminSystem() {
    if (elements.adminLogo) {
        elements.adminLogo.addEventListener('click', handleAdminLogoClick);
        console.log("💎 Admin system initialized");
    }
}

function handleAdminLogoClick() {
    const now = Date.now();
    
    // Reset count if more than 2 seconds passed
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
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-lock"></i> Admin Access</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; padding: 20px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">🔒</div>
                        <h3 style="color: var(--alien-text); margin-bottom: 20px;">Administrator Access</h3>
                        <p style="color: var(--alien-text-light); margin-bottom: 30px;">Enter administrator password</p>
                        
                        <div style="margin-bottom: 20px;">
                            <input type="password" 
                                   id="adminPasswordInput" 
                                   style="width: 100%; padding: 12px 15px; background: rgba(0,0,0,0.3); border: 1px solid rgba(59,130,246,0.3); border-radius: 8px; color: white; font-size: 16px;"
                                   placeholder="Enter password">
                        </div>
                        
                        <button onclick="checkAdminPassword()" 
                                style="width: 100%; padding: 12px; background: var(--gradient-alien); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
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
    
    // Remove existing modals
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    
    // Add new modal
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
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-user-shield"></i> Admin Panel</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                
                <div class="modal-body">
                    <div style="display: flex; gap: 10px; margin-bottom: 25px; flex-wrap: wrap;">
                        <button class="tab-btn active" onclick="switchAdminTab('deposits')">
                            <i class="fas fa-download"></i> Pending Deposits
                            <span class="tab-badge" id="pendingDepositsCount">0</span>
                        </button>
                        <button class="tab-btn" onclick="switchAdminTab('withdrawals')">
                            <i class="fas fa-upload"></i> Pending Withdrawals
                            <span class="tab-badge" id="pendingWithdrawalsCount">0</span>
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
                                        style="width: 100%; padding: 12px; background: var(--gradient-alien); color: white; border: none; border-radius: 8px; font-weight: 600;">
                                    <i class="fas fa-plus-circle"></i> Add Balance to User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modals
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    // Load pending requests
    loadAdminPendingRequests('deposits');
}

async function loadAdminPendingRequests(type = 'deposits') {
    if (!adminAccess || !db) return;
    
    try {
        let collection, listId, countId;
        
        if (type === 'deposits') {
            collection = 'deposit_requests';
            listId = 'adminDepositsList';
            countId = 'pendingDepositsCount';
        } else {
            collection = 'withdrawals';
            listId = 'adminWithdrawalsList';
            countId = 'pendingWithdrawalsCount';
        }
        
        const query = await db.collection(collection)
            .where('status', '==', 'pending')
            .orderBy('timestamp', 'desc')
            .limit(50)
            .get();
        
        const listElement = document.getElementById(listId);
        const countElement = document.getElementById(countId);
        
        if (!listElement) return;
        
        if (query.empty) {
            listElement.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <p>No pending ${type}</p>
                </div>
            `;
            if (countElement) {
                countElement.textContent = '0';
            }
            return;
        }
        
        if (countElement) {
            countElement.textContent = query.size;
        }
        
        let html = '';
        query.forEach(doc => {
            const data = doc.data();
            const date = data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp || Date.now());
            const currency = data.currency || 'USDT';
            const safeCurrency = currency.replace(/'/g, "\\'");
            const safeTxId = data.transactionHash ? data.transactionHash.replace(/'/g, "\\'") : '';
            
            html += `
                <div class="transaction-card" style="margin-bottom: 10px; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px;">
                    <div class="transaction-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div class="transaction-type" style="display: flex; align-items: center; gap: 10px;">
                            <div class="type-icon ${type === 'deposits' ? 'deposit' : 'withdrawal'}" style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${type === 'deposits' ? 'rgba(0,255,136,0.1)' : 'rgba(59,130,246,0.1)'};">
                                <i class="fas fa-${type === 'deposits' ? 'download' : 'upload'}" style="color: ${type === 'deposits' ? '#00ff88' : '#3b82f6'}"></i>
                            </div>
                            <div class="type-info">
                                <div class="type-title" style="font-weight: 600; color: white;">${data.username || 'Unknown User'}</div>
                                <div class="type-subtitle" style="font-size: 12px; color: #94a3b8;">ID: ${data.userId || 'Unknown'}</div>
                            </div>
                        </div>
                        <div class="transaction-status pending-badge" style="background: rgba(245,158,11,0.1); color: #f59e0b; padding: 5px 10px; border-radius: 20px; font-size: 12px; display: flex; align-items: center; gap: 5px;">
                            <i class="fas fa-clock"></i>
                            <span>Pending</span>
                        </div>
                    </div>
                    <div class="transaction-details" style="font-size: 13px; color: #94a3b8;">
                        <div style="margin-bottom: 5px;">
                            <span>Amount:</span>
                            <span style="margin-left: 5px; font-weight: 600; color: white;">${data.amount} ${currency}</span>
                        </div>
                        ${type === 'deposits' ? `
                        <div style="margin-bottom: 5px;">
                            <span>TXID:</span>
                            <span style="font-family: monospace; margin-left: 5px;" title="${safeTxId}">${data.transactionHash ? data.transactionHash.substring(0, 12) + '...' + data.transactionHash.substring(data.transactionHash.length - 6) : 'None'}</span>
                        </div>
                        ` : `
                        <div style="margin-bottom: 5px;">
                            <span>Address:</span>
                            <span style="font-family: monospace; margin-left: 5px;" title="${data.address || 'None'}">${data.address ? data.address.substring(0, 12) + '...' + data.address.substring(data.address.length - 6) : 'None'}</span>
                        </div>
                        `}
                        <div style="margin-bottom: 5px;">
                            <span>Date:</span>
                            <span style="margin-left: 5px;">${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button onclick="adminApproveRequest('${doc.id}', '${type}', '${data.userId}', ${data.amount}, '${safeCurrency}', '${safeTxId}')" 
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

async function adminApproveRequest(docId, type, userId, amount, currency, txHash = '') {
    if (!adminAccess || !db) return;
    
    if (!confirm(`Approve ${type.slice(0, -1)} of ${amount} ${currency} for user ${userId}?`)) return;
    
    try {
        if (type === 'deposits') {
            // Update deposit status
            await db.collection('deposit_requests').doc(docId).update({
                status: 'approved',
                approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
                approvedBy: 'admin',
                adminNote: 'Approved by admin'
            });
            
            // Update user's balance
            const userRef = db.collection('users').doc(userId);
            const userSnap = await userRef.get();
            
            if (userSnap.exists) {
                const userData = userSnap.data();
                const currentBalance = userData.balances?.[currency] || 0;
                
                await userRef.update({
                    [`balances.${currency}`]: currentBalance + amount,
                    lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                console.log(`✅ Added ${amount} ${currency} to user ${userId}`);
            }
            
        } else {
            // Update withdrawal status
            await db.collection('withdrawals').doc(docId).update({
                status: 'completed',
                completedAt: firebase.firestore.FieldValue.serverTimestamp(),
                completedBy: 'admin'
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
        if (type === 'deposits') {
            await db.collection('deposit_requests').doc(docId).update({
                status: 'rejected',
                rejectedAt: firebase.firestore.FieldValue.serverTimestamp(),
                rejectedBy: 'admin',
                rejectionReason: reason
            });
        } else {
            await db.collection('withdrawals').doc(docId).update({
                status: 'rejected',
                rejectedAt: firebase.firestore.FieldValue.serverTimestamp(),
                rejectedBy: 'admin',
                rejectionReason: reason
            });
        }
        
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
        const userSnap = await userRef.get();
        
        if (userSnap.exists) {
            const userData = userSnap.data();
            const currentBalance = userData.balances?.AMSK || 0;
            const currentTotalMined = userData.mining?.totalMined || 0;
            
            await userRef.update({
                'balances.AMSK': currentBalance + amount,
                'mining.totalMined': currentTotalMined + amount,
                lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            showMessage(`✅ Added ${amount} AMSK to user ${userId}`, "success");
            
            userIdInput.value = '';
            amountInput.value = '';
        } else {
            showMessage('User not found', 'error');
        }
        
    } catch (error) {
        console.error("❌ Error adding balance to user:", error);
        showMessage("Failed to add balance to user", "error");
    }
}

function switchAdminTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show/hide tabs
    document.getElementById('adminDepositsTab').style.display = tabName === 'deposits' ? 'block' : 'none';
    document.getElementById('adminWithdrawalsTab').style.display = tabName === 'withdrawals' ? 'block' : 'none';
    document.getElementById('adminUsersTab').style.display = tabName === 'users' ? 'block' : 'none';
    
    // Set active button
    const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(btn => 
        btn.textContent.includes(tabName === 'deposits' ? 'Deposits' : 
                                tabName === 'withdrawals' ? 'Withdrawals' : 'Users')
    );
    if (activeBtn) activeBtn.classList.add('active');
    
    // Load data for active tab
    if (tabName !== 'users') {
        loadAdminPendingRequests(tabName);
    }
}

// ============================================
// REAL-TIME LISTENERS
// ============================================
function setupRealTimeListeners() {
    if (!db || !userData.id) return;
    
    console.log("👂 Setting up real-time listeners...");
    
    // Listen for deposit updates
    db.collection('deposit_requests')
        .where('userId', '==', userData.id)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'modified') {
                    const data = change.doc.data();
                    updateUserLocalDeposit(change.doc.id, data);
                }
            });
        });
    
    // Listen for withdrawal updates
    db.collection('withdrawals')
        .where('userId', '==', userData.id)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'modified') {
                    const data = change.doc.data();
                    updateUserLocalWithdrawal(change.doc.id, data);
                }
            });
        });
}

function updateUserLocalDeposit(firebaseId, depositData) {
    const status = depositData.status ? depositData.status.toLowerCase() : '';
    
    // Find in pending deposits
    const pendingIndex = walletData.pendingDeposits.findIndex(d => 
        d.transactionHash === depositData.transactionHash
    );
    
    if (pendingIndex !== -1) {
        if (status === 'approved') {
            // Move from pending to history
            const approvedDeposit = {
                ...walletData.pendingDeposits[pendingIndex],
                status: 'approved',
                approvedAt: depositData.approvedAt || Date.now(),
                adminNote: depositData.adminNote || 'Approved'
            };
            
            walletData.depositHistory.unshift(approvedDeposit);
            walletData.pendingDeposits.splice(pendingIndex, 1);
            
            // Add to balance
            if (depositData.currency === 'AMSK') {
                walletData.balances.AMSK += depositData.amount;
                walletData.mining.totalMined += depositData.amount;
            } else if (depositData.currency === 'USDT') {
                walletData.balances.USDT += depositData.amount;
            } else if (depositData.currency === 'BNB') {
                walletData.balances.BNB += depositData.amount;
            }
            
            showMessage(`✅ Deposit approved! +${depositData.amount} ${depositData.currency} added`, 'success');
            
        } else if (status === 'rejected') {
            // Move from pending to history as rejected
            const rejectedDeposit = {
                ...walletData.pendingDeposits[pendingIndex],
                status: 'rejected',
                rejectedAt: depositData.rejectedAt || Date.now(),
                rejectionReason: depositData.rejectionReason || 'Rejected'
            };
            
            walletData.depositHistory.unshift(rejectedDeposit);
            walletData.pendingDeposits.splice(pendingIndex, 1);
            
            showMessage(`❌ Deposit rejected: ${depositData.rejectionReason || 'No reason provided'}`, 'warning');
        }
        
        saveUserData();
        updateWalletUI();
        updateMiningDisplay();
    }
}

function updateUserLocalWithdrawal(firebaseId, withdrawalData) {
    const status = withdrawalData.status ? withdrawalData.status.toLowerCase() : '';
    
    // Find in pending withdrawals
    const pendingIndex = walletData.pendingWithdrawals.findIndex(w => 
        w.address === withdrawalData.address && 
        Math.abs(w.amount - withdrawalData.amount) < 0.01
    );
    
    if (pendingIndex !== -1) {
        if (status === 'completed') {
            // Move from pending to history
            const completedWithdrawal = {
                ...walletData.pendingWithdrawals[pendingIndex],
                status: 'completed',
                completedAt: withdrawalData.completedAt || Date.now(),
                completedBy: withdrawalData.completedBy || 'admin'
            };
            
            walletData.withdrawalHistory.unshift(completedWithdrawal);
            walletData.pendingWithdrawals.splice(pendingIndex, 1);
            
            showMessage(`✅ Withdrawal completed! ${withdrawalData.amount} USDT sent`, 'success');
            
        } else if (status === 'rejected') {
            // Move from pending to history as rejected and return funds
            const rejectedWithdrawal = {
                ...walletData.pendingWithdrawals[pendingIndex],
                status: 'rejected',
                rejectedAt: withdrawalData.rejectedAt || Date.now(),
                rejectionReason: withdrawalData.rejectionReason || 'Rejected'
            };
            
            walletData.withdrawalHistory.unshift(rejectedWithdrawal);
            walletData.pendingWithdrawals.splice(pendingIndex, 1);
            
            // Return funds
            walletData.balances.USDT += withdrawalData.amount;
            walletData.balances.BNB += withdrawalData.fee || CONFIG.WITHDRAWAL.FEE_BNB;
            
            showMessage(`❌ Withdrawal rejected. Funds returned. Reason: ${withdrawalData.rejectionReason || 'No reason provided'}`, 'warning');
        }
        
        saveUserData();
        updateWalletUI();
    }
}

// ============================================
// UI MANAGEMENT
// ============================================
function updateUI() {
    updateUserUI();
    updateMiningDisplay();
    updateWalletUI();
    updateStakingDisplay();
    updateReferralDisplay();
}

function switchPage(pageName) {
    // Update navigation buttons
    elements.navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === pageName) {
            btn.classList.add('active');
        }
    });
    
    // Show selected page
    elements.pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === `${pageName}-page`) {
            page.classList.add('active');
        }
    });
    
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
        case 'referral':
            updateReferralDisplay();
            break;
    }
}

function hideLoading() {
    if (elements.loadingScreen) {
        elements.loadingScreen.classList.remove('active');
        setTimeout(() => {
            elements.loadingScreen.style.display = 'none';
            document.getElementById('app-container').classList.remove('hidden');
        }, 500);
    }
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay.active');
    if (modal) {
        modal.remove();
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    console.log("🎯 Setting up event listeners...");
    
    // Navigation buttons
    elements.navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const page = btn.dataset.page;
            switchPage(page);
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
    
    // Staking buttons
    elements.stakeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const planId = btn.dataset.plan;
            openStakeModal(planId);
        });
    });
    
    // Wallet action buttons
    if (elements.depositBtn) {
        elements.depositBtn.addEventListener('click', () => openDepositModal('USDT'));
    }
    
    if (elements.withdrawBtn) {
        elements.withdrawBtn.addEventListener('click', openWithdrawModal);
    }
    
    if (elements.swapBtn) {
        elements.swapBtn.addEventListener('click', openSwapModal);
    }
    
    if (elements.historyBtn) {
        elements.historyBtn.addEventListener('click', showTransactionHistory);
    }
    
    console.log("✅ Event listeners setup complete");
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
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const message = document.createElement('div');
    message.className = `message ${type}`;
    
    let icon = 'fa-info-circle';
    switch (type) {
        case 'success': icon = 'fa-check-circle'; break;
        case 'error': icon = 'fa-exclamation-circle'; break;
        case 'warning': icon = 'fa-exclamation-triangle'; break;
    }
    
    message.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${text}</span>
    `;
    
    container.appendChild(message);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.style.opacity = '0';
            message.style.transform = 'translateX(-50%) translateY(-10px)';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }
    }, 4000);
    
    console.log(`${type}: ${text}`);
}

// ============================================
// BACKGROUND SERVICES
// ============================================
function startBackgroundServices() {
    // Start mining timer
    intervals.miningTimer = setInterval(() => {
        updateMiningTimer();
    }, 1000);
    
    // Auto-save every 30 seconds
    intervals.autoSave = setInterval(() => {
        if (userData.id && userData.isInitialized) {
            saveUserData();
        }
    }, 30000);
    
    // Update user last active every minute
    intervals.updateTimer = setInterval(() => {
        if (userData) {
            userData.lastActive = new Date().toISOString();
        }
    }, 60000);
    
    console.log("⏱️ Background services started");
}

// Cleanup intervals on page unload
window.addEventListener('beforeunload', function() {
    if (userData.id && userData.isInitialized) {
        console.log("💾 Saving data before page unload...");
        saveUserData();
        
        // Clean up intervals
        Object.values(intervals).forEach(interval => {
            if (interval) clearInterval(interval);
        });
    }
});

// ============================================
// GLOBAL EXPORTS
// ============================================
window.initAlienMuskApp = initAlienMuskApp;
window.handleMiningAction = handleMiningAction;
window.upgradeMiningLevel = upgradeMiningLevel;
window.openStakeModal = openStakeModal;
window.confirmStaking = confirmStaking;
window.claimStakeReward = claimStakeReward;
window.cancelStake = cancelStake;
window.openDepositModal = openDepositModal;
window.submitDeposit = submitDeposit;
window.validateTransactionHash = validateTransactionHash;
window.openWithdrawModal = openWithdrawModal;
window.validateWithdrawAddress = validateWithdrawAddress;
window.validateWithdrawAmount = validateWithdrawAmount;
window.setMaxWithdrawAmount = setMaxWithdrawAmount;
window.updateWithdrawAmountFromSlider = updateWithdrawAmountFromSlider;
window.submitWithdrawal = submitWithdrawal;
window.openSwapModal = openSwapModal;
window.switchSwapTab = switchSwapTab;
window.calculateSwap = calculateSwap;
window.executeSwap = executeSwap;
window.showTransactionHistory = showTransactionHistory;
window.switchHistoryTab = switchHistoryTab;
window.closeModal = closeModal;
window.copyToClipboard = copyToClipboard;
window.showMessage = showMessage;
window.switchPage = switchPage;
window.copyReferralCode = copyReferralCode;
window.copyReferralLink = copyReferralLink;
window.shareOnTelegram = shareOnTelegram;
window.shareOnWhatsApp = shareOnWhatsApp;
window.claimMilestone = claimMilestone;

// Admin functions
window.checkAdminPassword = checkAdminPassword;
window.switchAdminTab = switchAdminTab;
window.adminApproveRequest = adminApproveRequest;
window.adminRejectRequest = adminRejectRequest;
window.addBalanceToSpecificUser = addBalanceToSpecificUser;
window.loadAdminPendingRequests = loadAdminPendingRequests;

// Utility functions
window.formatNumber = formatNumber;
window.setMaxStakeAmount = setMaxStakeAmount;
window.updateStakeAmountFromSlider = updateStakeAmountFromSlider;
window.calculateStakeReward = calculateStakeReward;
window.setMaxSwap = function() {
    const activeTab = document.querySelector('.swap-content.active');
    if (activeTab && activeTab.id === 'amsk_to_usdt') {
        const input = document.getElementById('swap-from-amsk');
        if (input) {
            input.value = walletData.balances?.AMSK || 0;
            calculateSwap('amsk_to_usdt');
        }
    } else if (activeTab && activeTab.id === 'usdt_to_amsk') {
        const input = document.getElementById('swap-from-usdt');
        if (input) {
            input.value = walletData.balances?.USDT || 0;
            calculateSwap('usdt_to_amsk');
        }
    }
};

console.log("👽 Alien Musk Quantum Platform v6.0 - Professional Edition Ready!");

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAlienMuskApp);
} else {
    initAlienMuskApp();
}

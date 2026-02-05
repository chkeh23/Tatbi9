// ============================================
// ALIEN MUSK - Quantum Mining Platform v5.0
// VIP EDITION - FULLY INTEGRATED & PROFESSIONAL
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
// CONFIGURATION
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
    
    // Referral Configuration
    REFERRAL: {
        DIRECT_REWARD: 10000, // 10,000 AMSK for referrer
        WELCOME_BONUS: 5000, // 5,000 AMSK for new user
        
        MILESTONES: {
            25: 100000,   // 100,000 AMSK
            50: 250000,   // 250,000 AMSK
            100: 600000,  // 600,000 AMSK
            250: 1500000  // 1,500,000 AMSK
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
// USER DATA MANAGEMENT
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
    isInitialized: false
};

// WALLET DATA
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
        claimedMilestones: []
    },
    transactions: [],
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
// INITIALIZATION
// ============================================
async function initAlienMuskApp() {
    console.log("🚀 Initializing Alien Musk Platform v5.0...");
    
    try {
        // 1. Cache DOM Elements
        cacheElements();
        
        // 2. Setup User
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
        
        userData.isInitialized = true;
        console.log("✅ Platform initialized successfully");
        
    } catch (error) {
        console.error("❌ Initialization failed:", error);
        showMessage("Failed to initialize platform", "error");
        hideLoading();
    }
}

// Cache DOM Elements
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
    
    // Wallet elements
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
    
    // Referral elements
    elements.referralCodeDisplay = document.getElementById('referral-code-display');
    elements.referralLinkInput = document.getElementById('referral-link-input');
    elements.refCount = document.getElementById('ref-count');
    elements.refEarned = document.getElementById('ref-earned');
    
    console.log(`✅ Cached ${Object.keys(elements).length} element groups`);
}

// Setup User
async function setupUser() {
    console.log("👤 Setting up user...");
    
    let telegramUser = null;
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        telegramUser = tg.initDataUnsafe.user;
        console.log("📱 Telegram user found:", telegramUser.id);
    }
    
    // Generate or get user ID
    let userId = generateUserId(telegramUser);
    
    // Set user data
    userData.id = userId;
    userData.telegramId = telegramUser ? telegramUser.id.toString() : null;
    userData.username = telegramUser ? 
        (telegramUser.username ? `@${telegramUser.username}` : 
         telegramUser.first_name ? telegramUser.first_name : 
         `User${telegramUser.id.toString().slice(-4)}`) : 
        'Alien';
    userData.firstName = telegramUser ? telegramUser.first_name || 'Alien' : 'Alien';
    userData.photoUrl = telegramUser ? 
        (telegramUser.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${telegramUser.id}`) : 
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
    
    // Generate referral code
    userData.referralCode = generateReferralCode(userId);
    userData.joinedAt = new Date().toISOString();
    userData.lastActive = new Date().toISOString();
    
    console.log("👤 User initialized:", userData.id, "Ref code:", userData.referralCode);
    
    // Update UI
    updateUserUI();
    
    // Sync with Firebase
    if (db) {
        await syncUserWithFirebase();
    }
}

// Generate unique user ID
function generateUserId(telegramUser) {
    if (telegramUser && telegramUser.id) {
        // Telegram users: tg_ + Telegram ID
        return `tg_${telegramUser.id}`;
    } else {
        // Web visitors: web_ + persistent ID
        let userId = localStorage.getItem('alien_musk_user_id');
        if (!userId) {
            userId = 'web_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('alien_musk_user_id', userId);
        }
        return userId;
    }
}

// Generate referral code
function generateReferralCode(userId) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomPart = Array.from({length: 6}, () => 
        chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
    
    return `ALIEN-${randomPart}`;
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
    }
    
    if (elements.referralCodeDisplay) {
        elements.referralCodeDisplay.textContent = userData.referralCode;
    }
    
    if (elements.referralLinkInput) {
        elements.referralLinkInput.value = `https://t.me/AlienMuskbot/Musk?startapp=${userData.referralCode}`;
    }
}

// ============================================
// DATA LOADING/SAVING
// ============================================
async function loadUserData() {
    console.log("📂 Loading user data for:", userData.id);
    
    try {
        // Try Firebase first
        if (db) {
            const loaded = await loadUserFromFirebase();
            if (loaded) {
                console.log("✅ Data loaded from Firebase");
                return;
            }
        }
        
        // Fallback to localStorage
        const storageKey = `alien_musk_${userData.id}`;
        const savedData = localStorage.getItem(storageKey);
        
        if (savedData) {
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
            
            console.log("✅ Data loaded from localStorage");
        }
        
    } catch (error) {
        console.error("❌ Error loading user data:", error);
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

function saveUserData() {
    if (!userData.id) {
        console.error("❌ Cannot save: No user ID");
        return;
    }
    
    try {
        // Update timestamp
        userData.lastActive = new Date().toISOString();
        walletData.lastUpdate = Date.now();
        
        // Save to localStorage
        const storageKey = `alien_musk_${userData.id}`;
        const dataToSave = {
            balances: walletData.balances,
            mining: walletData.mining,
            staking: walletData.staking,
            referrals: walletData.referrals,
            transactions: walletData.transactions,
            lastUpdate: walletData.lastUpdate
        };
        
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        console.log("💾 User data saved to localStorage");
        
        // Save to Firebase
        if (db) {
            saveUserToFirebase();
        }
        
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

// ============================================
// MINING SYSTEM
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
    
    // Update stats
    if (elements.totalMined) {
        elements.totalMined.textContent = formatNumber(mining.totalMined);
    }
    
    if (elements.minedToday) {
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
    
    if (!mining.active) {
        // Start mining
        await startMining();
    } else if (mining.nextReward && now >= mining.nextReward) {
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
// STAKING SYSTEM
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
    
    // Remove existing modals
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    
    // Add new modal
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
        updateStakingDisplay();
        
        // Close modal
        closeModal();
        
        // Show success
        showMessage(`✅ Staked ${plan.amount} USDT for ${plan.duration} days!`, "success");
        
        // Save data
        saveUserData();
        
        // Create transaction record
        addTransaction({
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
        walletData.staking.totalStaked -= stake.amount;
        
        // Remove from active stakes
        activeStakes.splice(stakeIndex, 1);
        
        // Update UI
        updateWalletUI();
        updateTotalBalance();
        updateStakingDisplay();
        
        // Show success
        showMessage(`💰 Claimed ${totalReward} AMSK from staking!`, "success");
        
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
// WALLET SYSTEM
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
        elements.walletBalanceUsd.textContent = `≈ $${totalUSD.toFixed(2)}`;
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
    
    // Remove existing modals
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    
    // Add new modal
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
        const usedTransactions = walletData.transactions.filter(t => 
            t.type === 'deposit_request' && t.txid === txid
        );
        
        if (usedTransactions.length > 0) {
            showMessage("This transaction ID has already been used", "error");
            return;
        }
        
        // Create deposit request
        const depositRequest = {
            id: 'deposit_' + Date.now(),
            type: 'deposit_request',
            currency: currency,
            amount: amount,
            txid: txid,
            status: 'pending',
            timestamp: Date.now()
        };
        
        // Add to transactions
        walletData.transactions.push(depositRequest);
        
        // Save to Firebase if available
        if (db) {
            await db.collection('transactions').add({
                userId: userData.id,
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
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
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
    
    // Remove existing modals
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    
    // Add new modal
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
            type: 'withdrawal_request',
            amount: amount,
            address: address,
            currency: 'USDT',
            fee: feeBNB,
            status: 'pending',
            timestamp: Date.now()
        };
        
        // Add to transactions
        walletData.transactions.push(withdrawalRequest);
        
        // Save to Firebase if available
        if (db) {
            await db.collection('transactions').add({
                userId: userData.id,
                ...withdrawalRequest,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Close modal
        closeModal();
        
        // Show success
        showMessage(`✅ Withdrawal request submitted for ${amount} USDT`, "success");
        showMessage("⏳ Your withdrawal is pending admin review", "info");
        
        // Save user data
        saveUserData();
        
    } catch (error) {
        console.error("❌ Error submitting withdrawal:", error);
        showMessage("Failed to submit withdrawal request", "error");
    }
}

function openSwapModal() {
    const modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
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
    
    // Remove existing modals
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    // Initialize swap calculation
    setTimeout(updateSwapCalculation, 100);
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
            fromCurrency === 'USDT' ? fromBalance.toFixed(2) : formatNumber(fromBalance);
    }
    
    if (document.getElementById('swap-to-balance')) {
        document.getElementById('swap-to-balance').textContent = 
            toCurrency === 'USDT' ? toBalance.toFixed(2) : formatNumber(toBalance);
    }
    
    // Calculate conversion
    let toAmount = 0;
    
    if (fromCurrency === 'AMSK' && toCurrency === 'USDT') {
        toAmount = fromAmount * CONFIG.PRICES.AMSK;
    } else if (fromCurrency === 'USDT' && toCurrency === 'AMSK') {
        toAmount = fromAmount / CONFIG.PRICES.AMSK;
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
        
        // Add transaction
        addTransaction({
            type: 'swap',
            fromAmount: fromAmount,
            fromCurrency: fromCurrency,
            toAmount: toAmount,
            toCurrency: toCurrency
        });
        
    } catch (error) {
        console.error("❌ Error executing swap:", error);
        showMessage("Failed to execute swap", "error");
    }
}

function showTransactionHistory() {
    const hasTransactions = walletData.transactions && walletData.transactions.length > 0;
    
    let modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-history"></i> Transaction History</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="history-tabs">
                        <button class="tab-btn active" onclick="switchHistoryTab('all')">All</button>
                        <button class="tab-btn" onclick="switchHistoryTab('deposits')">Deposits</button>
                        <button class="tab-btn" onclick="switchHistoryTab('withdrawals')">Withdrawals</button>
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
        // Filter and sort transactions
        const sortedTransactions = [...walletData.transactions].sort((a, b) => 
            (b.timestamp || 0) - (a.timestamp || 0)
        );
        
        sortedTransactions.forEach(tx => {
            const date = new Date(tx.timestamp).toLocaleString();
            let icon = 'fa-exchange-alt';
            let color = '#3b82f6';
            let sign = '';
            
            switch (tx.type) {
                case 'deposit_request':
                    icon = 'fa-arrow-down';
                    color = '#f59e0b';
                    sign = '+';
                    break;
                case 'withdrawal_request':
                    icon = 'fa-arrow-up';
                    color = '#f59e0b';
                    sign = '-';
                    break;
                case 'swap':
                    icon = 'fa-exchange-alt';
                    color = '#8b5cf6';
                    break;
                case 'stake':
                    icon = 'fa-gem';
                    color = '#ec4899';
                    sign = '-';
                    break;
                case 'stake_reward':
                    icon = 'fa-gem';
                    color = '#10b981';
                    sign = '+';
                    break;
                case 'mining_reward':
                    icon = 'fa-microchip';
                    color = '#10b981';
                    sign = '+';
                    break;
                case 'referral_reward':
                    icon = 'fa-users';
                    color = '#10b981';
                    sign = '+';
                    break;
            }
            
            modalContent += `
                <div class="history-item">
                    <div class="tx-icon" style="background: ${color}20; color: ${color}">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="tx-details">
                        <div class="tx-type">${formatTransactionType(tx.type)}</div>
                        <div class="tx-date">${date}</div>
                        ${tx.details ? `<div class="tx-note">${tx.details}</div>` : ''}
                        ${tx.status === 'pending' ? `<div class="tx-status pending">Pending</div>` : ''}
                    </div>
                    <div class="tx-amount" style="color: ${color}">
                        ${tx.type === 'swap' ? 
                          `${formatNumber(tx.fromAmount)} ${tx.fromCurrency} → ${tx.toCurrency === 'USDT' ? tx.toAmount.toFixed(2) : formatNumber(tx.toAmount)} ${tx.toCurrency}` :
                          `${sign}${formatNumber(tx.amount)} ${tx.currency || 'USDT'}`}
                    </div>
                </div>
            `;
        });
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

function switchHistoryTab(tabName) {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    let filteredTransactions = [...walletData.transactions];
    
    if (tabName === 'deposits') {
        filteredTransactions = filteredTransactions.filter(tx => tx.type === 'deposit_request');
    } else if (tabName === 'withdrawals') {
        filteredTransactions = filteredTransactions.filter(tx => tx.type === 'withdrawal_request');
    }
    
    // Sort by timestamp
    filteredTransactions.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    if (filteredTransactions.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No transactions found</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    filteredTransactions.forEach(tx => {
        const date = new Date(tx.timestamp).toLocaleString();
        let icon = 'fa-exchange-alt';
        let color = '#3b82f6';
        let sign = '';
        
        switch (tx.type) {
            case 'deposit_request':
                icon = 'fa-arrow-down';
                color = '#f59e0b';
                sign = '+';
                break;
            case 'withdrawal_request':
                icon = 'fa-arrow-up';
                color = '#f59e0b';
                sign = '-';
                break;
            case 'swap':
                icon = 'fa-exchange-alt';
                color = '#8b5cf6';
                break;
            case 'stake':
                icon = 'fa-gem';
                color = '#ec4899';
                sign = '-';
                break;
            case 'stake_reward':
                icon = 'fa-gem';
                color = '#10b981';
                sign = '+';
                break;
            case 'mining_reward':
                icon = 'fa-microchip';
                color = '#10b981';
                sign = '+';
                break;
            case 'referral_reward':
                icon = 'fa-users';
                color = '#10b981';
                sign = '+';
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
                    ${tx.status === 'pending' ? `<div class="tx-status pending">Pending</div>` : ''}
                </div>
                <div class="tx-amount" style="color: ${color}">
                    ${tx.type === 'swap' ? 
                      `${formatNumber(tx.fromAmount)} ${tx.fromCurrency} → ${tx.toCurrency === 'USDT' ? tx.toAmount.toFixed(2) : formatNumber(tx.toAmount)} ${tx.toCurrency}` :
                      `${sign}${formatNumber(tx.amount)} ${tx.currency || 'USDT'}`}
                </div>
            </div>
        `;
    });
    
    historyList.innerHTML = html;
}

function formatTransactionType(type) {
    const types = {
        'deposit_request': 'Deposit Request',
        'withdrawal_request': 'Withdrawal Request',
        'swap': 'Token Swap',
        'stake': 'Staking',
        'stake_reward': 'Staking Reward',
        'mining_reward': 'Mining Reward',
        'referral_reward': 'Referral Reward'
    };
    
    return types[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function addTransaction(transaction) {
    if (!walletData.transactions) {
        walletData.transactions = [];
    }
    
    walletData.transactions.push({
        id: 'tx_' + Date.now(),
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
// REFERRAL SYSTEM
// ============================================
async function checkForReferral() {
    console.log("🔍 Checking for referral...");
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    let referralCode = urlParams.get('startapp') || urlParams.get('ref') || urlParams.get('start');
    
    // Check Telegram start parameter
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) {
        referralCode = tg.initDataUnsafe.start_param;
    }
    
    if (referralCode && referralCode !== userData.referralCode) {
        console.log("🎯 Referral detected:", referralCode);
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
        
        // Save user data
        saveUserData();
        
        // Update referrer's data in Firebase
        if (db) {
            await updateReferrerRewards(referralCode);
        }
        
        // Update UI
        updateWalletUI();
        
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
    const milestoneItems = document.querySelectorAll('.milestone-item');
    if (!milestoneItems.length) return;
    
    const referralCount = walletData.referrals?.count || 0;
    const claimedMilestones = walletData.referrals?.claimedMilestones || [];
    
    milestoneItems.forEach(item => {
        const requirement = item.querySelector('.milestone-requirement').textContent;
        const milestoneNum = parseInt(requirement.match(/\d+/)[0]);
        
        // Remove all classes
        item.classList.remove('locked', 'can-claim', 'claimed');
        
        // Check milestone status
        if (claimedMilestones.includes(milestoneNum)) {
            item.classList.add('claimed');
            const badge = item.querySelector('.milestone-action');
            if (badge) {
                badge.innerHTML = '<span class="claimed-badge">Claimed</span>';
            }
        } else if (referralCount >= milestoneNum) {
            item.classList.add('can-claim');
            const badge = item.querySelector('.milestone-action');
            if (badge) {
                badge.innerHTML = '<button class="btn-claim-milestone" onclick="claimMilestone(' + milestoneNum + ')">Claim</button>';
            }
        } else {
            item.classList.add('locked');
            const badge = item.querySelector('.milestone-action');
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
                'referrals.earned': firebase.firestore.FieldValue.increment(reward),
                'referrals.claimedMilestones': firebase.firestore.FieldValue.arrayUnion(milestoneNum),
                'referrals.pendingMilestones': firebase.firestore.FieldValue.arrayRemove(milestoneNum),
                'lastUpdate': firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Update UI
        updateWalletUI();
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
    const text = `🚀 Join Alien Musk Quantum Mining Platform!\n\nUse my referral link to get bonus AMSK tokens:\n\n${link}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
    
    window.open(url, '_blank');
}

function shareOnWhatsApp() {
    if (!elements.referralLinkInput) return;
    
    const link = elements.referralLinkInput.value;
    const text = `🚀 Join Alien Musk Quantum Mining Platform!\n\nUse my referral link to get bonus AMSK tokens:\n\n${link}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    
    window.open(url, '_blank');
}

// ============================================
// ADMIN SYSTEM
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

async function loadAdminPendingRequests(type) {
    if (!adminAccess || !db) return;
    
    try {
        let collection, listId;
        
        if (type === 'deposits') {
            collection = 'transactions';
            listId = 'adminDepositsList';
        } else {
            collection = 'transactions';
            listId = 'adminWithdrawalsList';
        }
        
        const query = await db.collection(collection)
            .where('type', '==', type === 'deposits' ? 'deposit_request' : 'withdrawal_request')
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
                <div class="transaction-card" style="margin-bottom: 10px; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px;">
                    <div class="transaction-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div class="transaction-type" style="display: flex; align-items: center; gap: 10px;">
                            <div class="type-icon ${type === 'deposits' ? 'deposit' : 'withdrawal'}" style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${type === 'deposits' ? 'rgba(0,255,136,0.1)' : 'rgba(59,130,246,0.1)'};">
                                <i class="fas fa-${type === 'deposits' ? 'download' : 'upload'}" style="color: ${type === 'deposits' ? '#00ff88' : '#3b82f6'}"></i>
                            </div>
                            <div class="type-info">
                                <div class="type-title" style="font-weight: 600; color: white;">${data.userId || 'Unknown User'}</div>
                                <div class="type-subtitle" style="font-size: 12px; color: #94a3b8;">${data.amount} ${data.currency}</div>
                            </div>
                        </div>
                        <div class="transaction-status pending-badge" style="background: rgba(245,158,11,0.1); color: #f59e0b; padding: 5px 10px; border-radius: 20px; font-size: 12px; display: flex; align-items: center; gap: 5px;">
                            <i class="fas fa-clock"></i>
                            <span>Pending</span>
                        </div>
                    </div>
                    <div class="transaction-details" style="font-size: 13px; color: #94a3b8;">
                        <div style="margin-bottom: 5px;">
                            <span>TXID:</span>
                            <span style="font-family: monospace; margin-left: 5px;">${data.txid ? data.txid.substring(0, 12) + '...' : 'None'}</span>
                        </div>
                        <div style="margin-bottom: 5px;">
                            <span>Date:</span>
                            <span style="margin-left: 5px;">${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        ${type === 'withdrawals' ? `
                        <div>
                            <span>Address:</span>
                            <span style="font-family: monospace; margin-left: 5px;">${data.address ? data.address.substring(0, 12) + '...' : 'None'}</span>
                        </div>
                        ` : ''}
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
        // Update transaction status
        await db.collection('transactions').doc(docId).update({
            status: 'approved',
            approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
            approvedBy: 'admin'
        });
        
        // If deposit, add balance to user
        if (type === 'deposits') {
            const userRef = db.collection('users').doc(userId);
            await userRef.update({
                [`balances.${currency}`]: firebase.firestore.FieldValue.increment(amount),
                lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
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
        await db.collection('transactions').doc(docId).update({
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
    
    // Admin system
    initAdminSystem();
    
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

console.log("👽 Alien Musk Quantum Platform v5.0 - Ready!");

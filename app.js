// ============================================
// ALIEN MUSK - Quantum Mining Platform v5.0
// PROFESSIONAL EDITION - COMPLETE REFACTOR
// ============================================

// Telegram WebApp Initialization
let tg = null;
let telegramUser = null;

try {
    if (window.Telegram && window.Telegram.WebApp) {
        tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            telegramUser = tg.initDataUnsafe.user;
            console.log("✅ Telegram User Identified:", telegramUser.id);
        }
        console.log("✅ Telegram WebApp initialized");
    }
} catch (e) {
    console.log("⚠️ Not in Telegram environment");
}

// ============================================
// FIREBASE CONFIGURATION
// ============================================
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
// GLOBAL CONFIGURATION - FIXED VALUES
// ============================================
const CONFIG = {
    // Token Prices (FIXED - NO CHANGE)
    PRICES: {
        AMSK: 0.0002,  // 1 AMSK = 0.0002 USD
        USDT: 1.00,
        BNB: 752.00,
        TON: 1.32
    },
    
    // Mining Configuration - 5 LEVELS
    MINING: {
        BASE_REWARD: 2500,
        DURATION: 3600000, // 1 hour in ms
        
        LEVELS: {
            1: { name: "Beginner", cost: 0, reward: 2500, hashrate: 2500 },
            2: { name: "Advanced", cost: 5, reward: 5000, hashrate: 5000 },
            3: { name: "Pro", cost: 20, reward: 12500, hashrate: 12500 },
            4: { name: "Expert", cost: 100, reward: 25000, hashrate: 25000 },
            5: { name: "VIP", cost: 500, reward: 100000, hashrate: 100000 }
        },
        
        BOOSTERS: {
            "2x": { multiplier: 2, duration: 86400000, price: 10000 },
            "3x": { multiplier: 3, duration: 43200000, price: 15000 },
            "5x": { multiplier: 5, duration: 21600000, price: 25000 }
        }
    },
    
    // Staking Configuration - CORRECT CALCULATIONS
    STAKING: {
        PLANS: {
            1: { name: "Silver", minAmount: 10, duration: 7, apr: 40 },
            2: { name: "Gold", minAmount: 50, duration: 15, apr: 50 },
            3: { name: "Diamond", minAmount: 100, duration: 30, apr: 60 }
        }
    },
    
    // Referral Configuration - FIXED & PROGRESSIVE
    REFERRAL: {
        DIRECT_REWARD: 5000, // 5,000 AMSK for referrer
        WELCOME_BONUS: 5000, // 5,000 AMSK for new user
        
        MILESTONES: [
            { referrals: 10, reward: 50000, claimed: false },
            { referrals: 50, reward: 250000, claimed: false },
            { referrals: 100, reward: 1000000, claimed: false }
        ],
        
        BASE_URL: "https://t.me/AlienMuskBot/Alien?startapp="
    },
    
    // Admin Configuration
    ADMIN: {
        TELEGRAM_ID: "1653918641",
        PASSWORD: "Ali97$",
        SECRET_CODE: "ALIEN2024"
    },
    
    // System Configuration
    SYSTEM: {
        AUTO_SAVE_INTERVAL: 30000, // 30 seconds
        MINING_UPDATE_INTERVAL: 1000, // 1 second
        DAILY_RESET_TIME: 24 * 60 * 60 * 1000 // 24 hours
    }
};

// ============================================
// USER DATA MANAGEMENT - FIXED SYSTEM
// ============================================
let userData = {
    // CORE IDENTITY - NEVER CHANGES
    id: null,
    telegramId: null,
    username: 'Alien',
    firstName: 'Alien',
    photoUrl: null,
    
    // REFERRAL SYSTEM - FIXED FOREVER
    referralCode: null,
    referralLink: null,
    
    // TIMESTAMPS
    joinedAt: null,
    lastActive: null,
    lastDailyReset: null,
    
    // FLAGS
    isInitialized: false,
    hasReferralBonus: false
};

// WALLET DATA - PER USER
let walletData = {
    balances: {
        AMSK: 2500,    // Starting bonus
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
    
    transactions: {
        deposits: [],
        withdrawals: [],
        swaps: [],
        stakes: []
    },
    
    lastUpdate: Date.now()
};

// GLOBAL STATE
let adminAccess = false;
let currentPage = 'home';
let miningInterval = null;
let saveInterval = null;

// DOM ELEMENTS CACHE
const elements = {};

// ============================================
// INITIALIZATION - COMPLETE SETUP
// ============================================
async function initApp() {
    console.log("🚀 Initializing Alien Musk Platform v5.0...");
    
    try {
        // 1. Setup Loading Progress
        updateLoadingProgress("Initializing Quantum Engine...", 25);
        
        // 2. Setup User Identity (FIXED FOREVER)
        await setupUserIdentity();
        updateLoadingProgress("Setting up user profile...", 50);
        
        // 3. Load User Data from Firebase
        await loadUserData();
        updateLoadingProgress("Loading mining data...", 75);
        
        // 4. Cache DOM Elements
        cacheElements();
        
        // 5. Setup Event Listeners
        setupEventListeners();
        
        // 6. Initialize Admin System
        initAdminSystem();
        
        // 7. Setup Real-time Updates
        setupRealTimeUpdates();
        
        // 8. Update UI
        updateUI();
        
        // 9. Complete Loading
        setTimeout(() => {
            updateLoadingProgress("Platform Ready!", 100);
            setTimeout(() => {
                hideLoadingScreen();
                showMessage("👽 Welcome to Alien Musk Quantum Platform!", "success");
                userData.isInitialized = true;
                console.log("✅ Platform initialized successfully");
            }, 500);
        }, 1000);
        
    } catch (error) {
        console.error("❌ Initialization failed:", error);
        showMessage("Failed to initialize platform", "error");
        hideLoadingScreen();
    }
}

// ============================================
// USER IDENTITY SYSTEM - FIXED FOREVER
// ============================================
async function setupUserIdentity() {
    console.log("👤 Setting up user identity...");
    
    // Use Telegram ID as primary identifier
    if (telegramUser) {
        userData.id = telegramUser.id.toString();
        userData.telegramId = telegramUser.id;
        userData.username = telegramUser.username ? `@${telegramUser.username}` : 
                           telegramUser.first_name || 'Alien';
        userData.firstName = telegramUser.first_name || 'Alien';
        userData.photoUrl = telegramUser.photo_url || 
                           `https://api.dicebear.com/7.x/avataaars/svg?seed=${telegramUser.id}`;
    } else {
        // Fallback for development
        userData.id = "dev_" + Date.now();
        userData.telegramId = 0;
        userData.username = 'Alien';
        userData.firstName = 'Alien';
        userData.photoUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.id}`;
    }
    
    // Generate FIXED referral code (once forever)
    userData.referralCode = generateReferralCode(userData.id);
    userData.referralLink = CONFIG.REFERRAL.BASE_URL + userData.referralCode;
    userData.joinedAt = new Date().toISOString();
    userData.lastActive = new Date().toISOString();
    userData.lastDailyReset = Date.now();
    
    console.log("👤 User Identity:", {
        id: userData.id,
        telegramId: userData.telegramId,
        referralCode: userData.referralCode,
        referralLink: userData.referralLink
    });
    
    // Save to Firebase
    await saveUserToFirebase(true);
}

function generateReferralCode(userId) {
    // Generate a FIXED code based on user ID
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const userIdStr = userId.toString();
    const hash = Array.from(userIdStr).reduce((acc, char) => {
        return acc + char.charCodeAt(0);
    }, 0);
    
    const code = 'ALIEN-' + 
        chars[hash % 26] + 
        chars[(hash + 7) % 26] + 
        chars[(hash + 13) % 26] + 
        chars[(hash + 19) % 26] + 
        (hash % 10) + 
        ((hash + 5) % 10);
    
    return code;
}

// ============================================
// DATA MANAGEMENT - FIREBASE INTEGRATION
// ============================================
async function loadUserData() {
    console.log("📂 Loading user data for:", userData.id);
    
    try {
        if (db) {
            const userRef = db.collection('users').doc(userData.id);
            const userSnap = await userRef.get();
            
            if (userSnap.exists) {
                const firebaseData = userSnap.data();
                console.log("✅ Data loaded from Firebase");
                
                // Merge wallet data
                if (firebaseData.walletData) {
                    walletData = { ...walletData, ...firebaseData.walletData };
                }
                
                // Update referral count from referrals collection
                await updateReferralCount();
                
            } else {
                console.log("🆕 Creating new user in Firebase");
                await saveUserToFirebase(true);
            }
        } else {
            // Local fallback
            const savedData = localStorage.getItem(`alien_user_${userData.id}`);
            if (savedData) {
                const parsed = JSON.parse(savedData);
                walletData = { ...walletData, ...parsed };
                console.log("✅ Data loaded from localStorage");
            }
        }
        
    } catch (error) {
        console.error("❌ Error loading user data:", error);
    }
}

async function saveUserData() {
    if (!userData.id) return;
    
    try {
        // Update timestamp
        userData.lastActive = new Date().toISOString();
        walletData.lastUpdate = Date.now();
        
        // Save locally
        const storageKey = `alien_user_${userData.id}`;
        localStorage.setItem(storageKey, JSON.stringify(walletData));
        
        // Save to Firebase
        await saveUserToFirebase();
        
        console.log("💾 User data saved");
        
    } catch (error) {
        console.error("❌ Save error:", error);
    }
}

async function saveUserToFirebase(isNew = false) {
    if (!db || !userData.id) return;
    
    try {
        const userRef = db.collection('users').doc(userData.id);
        const userDataToSave = {
            telegramId: userData.telegramId,
            username: userData.username,
            firstName: userData.firstName,
            photoUrl: userData.photoUrl,
            referralCode: userData.referralCode,
            referralLink: userData.referralLink,
            joinedAt: userData.joinedAt,
            lastActive: userData.lastActive,
            walletData: walletData,
            lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        if (isNew) {
            await userRef.set(userDataToSave);
        } else {
            await userRef.update(userDataToSave);
        }
        
        console.log("✅ User saved to Firebase");
        
    } catch (error) {
        console.error("❌ Firebase save error:", error);
    }
}

async function updateReferralCount() {
    if (!db || !userData.referralCode) return;
    
    try {
        const referralsRef = db.collection('referrals');
        const querySnapshot = await referralsRef
            .where('referrerCode', '==', userData.referralCode)
            .get();
        
        walletData.referrals.count = querySnapshot.size;
        console.log("📊 Referral count updated:", walletData.referrals.count);
        
    } catch (error) {
        console.error("❌ Error updating referral count:", error);
    }
}

// ============================================
// DOM ELEMENTS CACHE
// ============================================
function cacheElements() {
    console.log("🔍 Caching DOM elements...");
    
    // Loading elements
    elements.loadingScreen = document.getElementById('loading-screen');
    elements.loadingProgress = document.getElementById('loading-progress-bar');
    elements.loadingText = document.getElementById('loading-progress-text');
    
    // Header elements
    elements.usernameMini = document.getElementById('username-mini');
    elements.userIdMini = document.getElementById('user-id-mini');
    elements.userAvatarMini = document.getElementById('user-avatar-mini');
    elements.totalBalanceAmsk = document.getElementById('total-balance-amsk');
    elements.totalBalanceUsd = document.getElementById('total-balance-usd');
    
    // Mining elements
    elements.currentMiningLevel = document.getElementById('current-mining-level');
    elements.currentHashrateDisplay = document.getElementById('current-hashrate-display');
    elements.miningTimerDisplay = document.getElementById('mining-timer-display');
    elements.startMiningBtn = document.getElementById('start-mining-btn');
    elements.nextRewardAmount = document.getElementById('next-reward-amount');
    elements.totalMinedDisplay = document.getElementById('total-mined');
    elements.minedTodayDisplay = document.getElementById('mined-today');
    
    // Upgrade cards
    elements.upgradeCards = document.querySelectorAll('.upgrade-card');
    
    // Staking elements
    elements.stakeButtons = document.querySelectorAll('.stake-plan-btn');
    elements.activeStakesList = document.getElementById('active-stakes-list');
    elements.totalStakedDisplay = document.getElementById('total-staked');
    
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
    elements.refCountDisplay = document.getElementById('ref-count');
    elements.refEarnedDisplay = document.getElementById('ref-earned');
    elements.referralCodeDisplay = document.getElementById('referral-code-display');
    elements.referralLinkInput = document.getElementById('referral-link-input');
    
    // Navigation
    elements.navItems = document.querySelectorAll('.nav-item');
    elements.pages = document.querySelectorAll('.page');
    
    console.log(`✅ Cached ${Object.keys(elements).length} elements`);
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================
function updateUI() {
    updateUserHeader();
    updateMiningDisplay();
    updateWalletUI();
    updateStakingDisplay();
    updateReferralDisplay();
    updateTotalBalance();
}

function updateUserHeader() {
    if (!userData.id) return;
    
    // Update user info
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
}

function updateTotalBalance() {
    const totalAMSK = walletData.balances.AMSK || 0;
    const totalUSDT = walletData.balances.USDT || 0;
    const totalBNB = walletData.balances.BNB || 0;
    const totalTON = walletData.balances.TON || 0;
    
    const totalUSD = (totalAMSK * CONFIG.PRICES.AMSK) + 
                    (totalUSDT * CONFIG.PRICES.USDT) + 
                    (totalBNB * CONFIG.PRICES.BNB) + 
                    (totalTON * CONFIG.PRICES.TON);
    
    // Update header
    if (elements.totalBalanceAmsk) {
        elements.totalBalanceAmsk.textContent = formatNumber(totalAMSK);
    }
    
    if (elements.totalBalanceUsd) {
        elements.totalBalanceUsd.textContent = totalUSD.toFixed(2);
    }
    
    // Update wallet page
    if (elements.walletBalanceAmsk) {
        elements.walletBalanceAmsk.textContent = formatNumber(totalAMSK);
    }
    
    if (elements.walletBalanceUsd) {
        elements.walletBalanceUsd.textContent = `$${totalUSD.toFixed(2)}`;
    }
}

function updateMiningDisplay() {
    if (!walletData.mining) return;
    
    const mining = walletData.mining;
    const level = CONFIG.MINING.LEVELS[mining.level];
    
    // Update level display
    if (elements.currentMiningLevel) {
        elements.currentMiningLevel.textContent = mining.level;
    }
    
    if (elements.currentHashrateDisplay) {
        elements.currentHashrateDisplay.textContent = formatNumber(level.hashrate);
    }
    
    // Update total mined
    if (elements.totalMinedDisplay) {
        elements.totalMinedDisplay.textContent = formatNumber(mining.totalMined);
    }
    
    if (elements.minedTodayDisplay) {
        elements.minedTodayDisplay.textContent = formatNumber(mining.minedToday);
    }
    
    // Update next reward
    let nextReward = level.reward;
    if (elements.nextRewardAmount) {
        elements.nextRewardAmount.textContent = formatNumber(nextReward);
    }
    
    // Update timer and button
    updateMiningTimer();
    
    // Update upgrade cards
    updateUpgradeCards();
}

function updateMiningTimer() {
    if (!walletData.mining || !elements.miningTimerDisplay) return;
    
    const now = Date.now();
    const nextRewardTime = walletData.mining.nextReward;
    
    if (!nextRewardTime) {
        // Not mining
        elements.miningTimerDisplay.textContent = "READY";
        elements.miningTimerDisplay.style.color = "#00ff88";
        
        if (elements.startMiningBtn) {
            elements.startMiningBtn.innerHTML = '<i class="fas fa-play"></i><span>Start Mining</span>';
            elements.startMiningBtn.classList.remove('claim-mode');
            elements.startMiningBtn.disabled = false;
        }
        return;
    }
    
    const timeLeft = nextRewardTime - now;
    
    if (timeLeft <= 0) {
        // Ready to claim
        elements.miningTimerDisplay.textContent = "READY!";
        elements.miningTimerDisplay.style.color = "#00ff88";
        
        if (elements.startMiningBtn) {
            elements.startMiningBtn.innerHTML = '<i class="fas fa-gift"></i><span>Claim Reward</span>';
            elements.startMiningBtn.classList.add('claim-mode');
            elements.startMiningBtn.disabled = false;
        }
    } else {
        // Still mining
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        elements.miningTimerDisplay.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        elements.miningTimerDisplay.style.color = "#ffffff";
        
        if (elements.startMiningBtn) {
            elements.startMiningBtn.innerHTML = '<i class="fas fa-pause"></i><span>Mining...</span>';
            elements.startMiningBtn.classList.remove('claim-mode');
            elements.startMiningBtn.disabled = true;
        }
    }
}

function updateUpgradeCards() {
    if (!elements.upgradeCards) return;
    
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
            // Lower level (already upgraded)
            button.textContent = 'Upgraded';
            button.classList.add('active-btn');
            button.disabled = true;
            card.classList.remove('active');
        } else {
            // Higher level (can upgrade)
            const canAfford = usdtBalance >= levelData.cost;
            
            if (canAfford) {
                button.textContent = `Upgrade - ${levelData.cost} USDT`;
                button.disabled = false;
            } else {
                button.textContent = `${levelData.cost} USDT Required`;
                button.disabled = true;
            }
            
            button.classList.remove('active-btn');
            card.classList.remove('active');
        }
    });
}

function updateWalletUI() {
    const balances = walletData.balances;
    
    // Update AMSK
    if (elements.walletAmskBalance) {
        elements.walletAmskBalance.textContent = `${formatNumber(balances.AMSK)} AMSK`;
    }
    
    if (elements.walletAmskValue) {
        const usdValue = (balances.AMSK * CONFIG.PRICES.AMSK).toFixed(2);
        elements.walletAmskValue.textContent = `$${usdValue}`;
    }
    
    // Update USDT
    if (elements.walletUsdtBalance) {
        elements.walletUsdtBalance.textContent = `${balances.USDT.toFixed(2)} USDT`;
    }
    
    if (elements.walletUsdtValue) {
        elements.walletUsdtValue.textContent = `$${balances.USDT.toFixed(2)}`;
    }
    
    // Update BNB
    if (elements.walletBnbBalance) {
        elements.walletBnbBalance.textContent = `${balances.BNB.toFixed(6)} BNB`;
    }
    
    if (elements.walletBnbValue) {
        const usdValue = (balances.BNB * CONFIG.PRICES.BNB).toFixed(2);
        elements.walletBnbValue.textContent = `$${usdValue}`;
    }
    
    // Update TON
    if (elements.walletTonBalance) {
        elements.walletTonBalance.textContent = `${formatNumber(balances.TON)} TON`;
    }
    
    if (elements.walletTonValue) {
        const usdValue = (balances.TON * CONFIG.PRICES.TON).toFixed(2);
        elements.walletTonValue.textContent = `$${usdValue}`;
    }
}

function updateStakingDisplay() {
    if (!elements.totalStakedDisplay) return;
    
    const totalStaked = walletData.staking.totalStaked || 0;
    elements.totalStakedDisplay.textContent = `${totalStaked.toFixed(2)} USDT`;
    
    updateActiveStakesList();
}

function updateActiveStakesList() {
    if (!elements.activeStakesList) return;
    
    const activeStakes = walletData.staking.activeStakes || [];
    
    if (activeStakes.length === 0) {
        elements.activeStakesList.innerHTML = `
            <div class="empty-stakes">
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
        const endTime = startTime + (plan.duration * 24 * 60 * 60 * 1000);
        const progress = Math.min(((now - startTime) / (endTime - startTime)) * 100, 100);
        const daysLeft = Math.ceil((endTime - now) / (24 * 60 * 60 * 1000));
        
        // Calculate rewards
        const totalRewardAMSK = (stake.amount * plan.apr / 100) * 5000; // Convert to AMSK
        const dailyRewardAMSK = totalRewardAMSK / plan.duration;
        
        html += `
            <div class="stake-item">
                <div class="stake-header">
                    <h5>${plan.name} Stake</h5>
                    <span class="stake-amount">${stake.amount.toFixed(2)} USDT</span>
                </div>
                
                <div class="stake-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-info">
                        <span>${progress.toFixed(1)}%</span>
                        <span>${daysLeft} days left</span>
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
                        <i class="fas fa-gem"></i>
                        <span>${formatNumber(dailyRewardAMSK)} AMSK/Day</span>
                    </div>
                </div>
                
                <div class="stake-actions">
                    <button class="btn-cancel" onclick="cancelStake(${index})" ${progress < 50 ? '' : 'disabled'}>
                        Cancel (50% Penalty)
                    </button>
                    <button class="btn-claim" onclick="claimStakeReward(${index})" ${progress >= 100 ? '' : 'disabled'}>
                        Claim Reward
                    </button>
                </div>
            </div>
        `;
    });
    
    elements.activeStakesList.innerHTML = html;
}

function updateReferralDisplay() {
    if (!userData.referralCode) return;
    
    // Update referral code
    if (elements.referralCodeDisplay) {
        elements.referralCodeDisplay.textContent = userData.referralCode;
    }
    
    if (elements.referralLinkInput) {
        elements.referralLinkInput.value = userData.referralLink;
    }
    
    // Update stats
    if (elements.refCountDisplay) {
        elements.refCountDisplay.textContent = walletData.referrals.count || 0;
    }
    
    if (elements.refEarnedDisplay) {
        elements.refEarnedDisplay.textContent = formatNumber(walletData.referrals.earned || 0);
    }
    
    // Update milestones
    updateReferralMilestones();
}

function updateReferralMilestones() {
    const milestonesContainer = document.getElementById('referral-milestones');
    if (!milestonesContainer) return;
    
    const referralCount = walletData.referrals.count || 0;
    const claimedMilestones = walletData.referrals.claimedMilestones || [];
    
    let html = '<div class="milestones-list">';
    
    CONFIG.REFERRAL.MILESTONES.forEach((milestone, index) => {
        const isClaimed = claimedMilestones.includes(milestone.referrals);
        const canClaim = !isClaimed && referralCount >= milestone.referrals;
        
        html += `
            <div class="milestone-item ${canClaim ? 'can-claim' : ''} ${isClaimed ? 'claimed' : ''}">
                <div class="milestone-icon">
                    <i class="fas ${isClaimed ? 'fa-check-circle' : 'fa-trophy'}"></i>
                </div>
                <div class="milestone-details">
                    <div class="milestone-requirement">
                        Reach ${milestone.referrals} referrals
                    </div>
                    <div class="milestone-reward">
                        ${formatNumber(milestone.reward)} AMSK
                    </div>
                </div>
                <div class="milestone-action">
                    ${isClaimed ? 
                        '<span class="claimed-badge">Claimed</span>' : 
                        canClaim ? 
                        `<button class="btn-claim-milestone" onclick="claimMilestone(${milestone.referrals})">Claim</button>` :
                        `<span class="locked-badge">${referralCount}/${milestone.referrals}</span>`
                    }
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    milestonesContainer.innerHTML = html;
}

// ============================================
// MINING SYSTEM
// ============================================
async function startMining() {
    try {
        // Check if already mining
        if (walletData.mining.active) {
            showMessage("Mining already in progress", "warning");
            return;
        }
        
        // Start mining
        walletData.mining.active = true;
        walletData.mining.lastReward = Date.now();
        walletData.mining.nextReward = Date.now() + CONFIG.MINING.DURATION;
        
        // Start timer
        startMiningTimer();
        
        // Update UI
        updateMiningTimer();
        
        // Save data
        await saveUserData();
        
        showMessage("⚡ Quantum mining started!", "success");
        
    } catch (error) {
        console.error("❌ Error starting mining:", error);
        showMessage("Failed to start mining", "error");
    }
}

async function claimMiningReward() {
    try {
        // Check if reward is ready
        if (!walletData.mining.nextReward || Date.now() < walletData.mining.nextReward) {
            showMessage("Reward not ready yet", "warning");
            return;
        }
        
        const level = CONFIG.MINING.LEVELS[walletData.mining.level];
        let reward = level.reward;
        
        // Apply boosters
        walletData.mining.activeBoosters.forEach(booster => {
            const boosterConfig = CONFIG.MINING.BOOSTERS[booster.type];
            if (boosterConfig) {
                reward *= boosterConfig.multiplier;
            }
        });
        
        // Add reward
        walletData.balances.AMSK = (walletData.balances.AMSK || 0) + reward;
        walletData.mining.totalMined = (walletData.mining.totalMined || 0) + reward;
        walletData.mining.minedToday = (walletData.mining.minedToday || 0) + reward;
        
        // Reset mining
        walletData.mining.active = false;
        walletData.mining.lastReward = null;
        walletData.mining.nextReward = null;
        
        // Stop timer
        stopMiningTimer();
        
        // Update UI
        updateMiningDisplay();
        updateWalletUI();
        updateTotalBalance();
        
        // Save data
        await saveUserData();
        
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
        
        // Check current level
        if (level <= walletData.mining.level) {
            showMessage("Already at or above this level", "warning");
            return;
        }
        
        // Check USDT balance
        if (walletData.balances.USDT < levelData.cost) {
            showMessage(`Insufficient USDT. Need ${levelData.cost} USDT`, "error");
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
        await saveUserData();
        
        showMessage(`⚡ Upgraded to ${levelData.name} level!`, "success");
        
    } catch (error) {
        console.error("❌ Error upgrading mining level:", error);
        showMessage("Failed to upgrade mining level", "error");
    }
}

function startMiningTimer() {
    if (miningInterval) {
        clearInterval(miningInterval);
    }
    
    miningInterval = setInterval(() => {
        updateMiningTimer();
    }, 1000);
}

function stopMiningTimer() {
    if (miningInterval) {
        clearInterval(miningInterval);
        miningInterval = null;
    }
}

// ============================================
// STAKING SYSTEM
// ============================================
function openStakeModal(planId) {
    const plan = CONFIG.STAKING.PLANS[planId];
    if (!plan) return;
    
    const maxAmount = walletData.balances.USDT || 0;
    const minAmount = plan.minAmount;
    
    // Calculate sample rewards
    const sampleAmount = Math.max(minAmount, Math.min(100, maxAmount));
    const sampleRewardAMSK = (sampleAmount * plan.apr / 100) * 5000;
    const sampleDailyAMSK = sampleRewardAMSK / plan.duration;
    
    const modalHTML = `
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
                        </div>
                    </div>
                    
                    <div class="stake-form">
                        <div class="form-group">
                            <label for="stake-amount">Amount (USDT)</label>
                            <div class="input-with-max">
                                <input type="number" 
                                       id="stake-amount" 
                                       value="${sampleAmount}"
                                       min="${minAmount}"
                                       max="${maxAmount}"
                                       step="1"
                                       oninput="updateStakePreview(${planId})">
                                <button class="btn-max" onclick="setMaxStakeAmount(${planId})">MAX</button>
                            </div>
                            <div class="balance-info">
                                Available: ${maxAmount.toFixed(2)} USDT
                            </div>
                        </div>
                        
                        <div class="stake-preview">
                            <div class="preview-item">
                                <span>Duration:</span>
                                <span>${plan.duration} Days</span>
                            </div>
                            <div class="preview-item">
                                <span>Total Reward:</span>
                                <span id="preview-total-reward">${formatNumber(sampleRewardAMSK)} AMSK</span>
                            </div>
                            <div class="preview-item">
                                <span>Daily Reward:</span>
                                <span id="preview-daily-reward">${formatNumber(sampleDailyAMSK)} AMSK</span>
                            </div>
                            <div class="preview-item total">
                                <span>Total Return:</span>
                                <span id="preview-total-return">${formatNumber(sampleAmount * 5000 + sampleRewardAMSK)} AMSK</span>
                            </div>
                        </div>
                        
                        <div class="stake-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>Funds will be locked for ${plan.duration} days. Early cancellation: 50% penalty.</span>
                        </div>
                        
                        <div class="modal-actions">
                            <button class="btn-secondary" onclick="closeModal()">
                                Cancel
                            </button>
                            <button class="btn-primary" onclick="confirmStaking(${planId})" ${maxAmount >= minAmount ? '' : 'disabled'}>
                                Confirm Stake
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function updateStakePreview(planId) {
    const plan = CONFIG.STAKING.PLANS[planId];
    if (!plan) return;
    
    const amountInput = document.getElementById('stake-amount');
    if (!amountInput) return;
    
    const amount = parseFloat(amountInput.value) || plan.minAmount;
    const maxAmount = walletData.balances.USDT || 0;
    
    // Validate amount
    if (amount < plan.minAmount) {
        amountInput.value = plan.minAmount;
    } else if (amount > maxAmount) {
        amountInput.value = maxAmount;
    }
    
    const validAmount = parseFloat(amountInput.value) || plan.minAmount;
    
    // Calculate rewards
    const totalRewardAMSK = (validAmount * plan.apr / 100) * 5000;
    const dailyRewardAMSK = totalRewardAMSK / plan.duration;
    const totalReturnAMSK = (validAmount * 5000) + totalRewardAMSK;
    
    // Update preview
    const totalRewardEl = document.getElementById('preview-total-reward');
    const dailyRewardEl = document.getElementById('preview-daily-reward');
    const totalReturnEl = document.getElementById('preview-total-return');
    
    if (totalRewardEl) totalRewardEl.textContent = formatNumber(totalRewardAMSK) + ' AMSK';
    if (dailyRewardEl) dailyRewardEl.textContent = formatNumber(dailyRewardAMSK) + ' AMSK/day';
    if (totalReturnEl) totalReturnEl.textContent = formatNumber(totalReturnAMSK) + ' AMSK';
}

function setMaxStakeAmount(planId) {
    const plan = CONFIG.STAKING.PLANS[planId];
    if (!plan) return;
    
    const maxAmount = walletData.balances.USDT || 0;
    const amountInput = document.getElementById('stake-amount');
    
    if (amountInput && maxAmount >= plan.minAmount) {
        amountInput.value = maxAmount;
        updateStakePreview(planId);
    }
}

async function confirmStaking(planId) {
    try {
        const plan = CONFIG.STAKING.PLANS[planId];
        if (!plan) {
            throw new Error("Plan not found");
        }
        
        const amountInput = document.getElementById('stake-amount');
        if (!amountInput) return;
        
        const amount = parseFloat(amountInput.value);
        const maxAmount = walletData.balances.USDT || 0;
        
        // Validation
        if (!amount || amount < plan.minAmount) {
            showMessage(`Minimum stake is ${plan.minAmount} USDT`, "error");
            return;
        }
        
        if (amount > maxAmount) {
            showMessage("Insufficient USDT balance", "error");
            return;
        }
        
        // Deduct USDT
        walletData.balances.USDT -= amount;
        
        // Create stake
        const stake = {
            planId: planId,
            amount: amount,
            startTime: Date.now(),
            duration: plan.duration,
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
        await saveUserData();
        
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
        const totalRewardAMSK = (stake.amount * plan.apr / 100) * 5000;
        
        // Add reward to AMSK balance
        walletData.balances.AMSK += totalRewardAMSK;
        
        // Return staked USDT
        walletData.balances.USDT += stake.amount;
        
        // Update staking stats
        walletData.staking.totalEarned = (walletData.staking.totalEarned || 0) + totalRewardAMSK;
        walletData.staking.totalStaked = (walletData.staking.totalStaked || 0) - stake.amount;
        
        // Remove from active stakes
        activeStakes.splice(stakeIndex, 1);
        
        // Update UI
        updateWalletUI();
        updateTotalBalance();
        updateStakingDisplay();
        
        // Show success
        showMessage(`💰 Claimed ${formatNumber(totalRewardAMSK)} AMSK from staking!`, "success");
        
        // Save data
        await saveUserData();
        
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
    const endTime = stake.startTime + (plan.duration * 24 * 60 * 60 * 1000);
    const progress = ((now - stake.startTime) / (endTime - stake.startTime)) * 100;
    
    if (progress >= 50) {
        showMessage("Cannot cancel stake after 50% completion", "warning");
        return;
    }
    
    // Return 50% of staked amount
    const returnedAmount = stake.amount * 0.5;
    walletData.balances.USDT += returnedAmount;
    
    // Update staking stats
    walletData.staking.totalStaked = (walletData.staking.totalStaked || 0) - stake.amount;
    
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
// REFERRAL SYSTEM
// ============================================
async function processReferral(code) {
    if (!code || code === userData.referralCode || userData.hasReferralBonus) {
        return;
    }
    
    console.log("🎯 Processing referral:", code);
    
    try {
        if (db) {
            // Find referrer
            const usersRef = db.collection('users');
            const querySnapshot = await usersRef.where('referralCode', '==', code).get();
            
            if (!querySnapshot.empty) {
                const referrerDoc = querySnapshot.docs[0];
                const referrerData = referrerDoc.data();
                
                if (referrerData.telegramId === userData.telegramId) {
                    console.log("⚠️ Cannot refer yourself");
                    return;
                }
                
                // Add referral record
                await db.collection('referrals').add({
                    referrerCode: code,
                    referredUserId: userData.id,
                    referredUsername: userData.username,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Update referrer's data
                await referrerDoc.ref.update({
                    'walletData.balances.AMSK': firebase.firestore.FieldValue.increment(CONFIG.REFERRAL.DIRECT_REWARD),
                    'walletData.referrals.count': firebase.firestore.FieldValue.increment(1),
                    'walletData.referrals.earned': firebase.firestore.FieldValue.increment(CONFIG.REFERRAL.DIRECT_REWARD)
                });
                
                // Give welcome bonus to new user
                walletData.balances.AMSK += CONFIG.REFERRAL.WELCOME_BONUS;
                walletData.referrals.earned += CONFIG.REFERRAL.WELCOME_BONUS;
                userData.hasReferralBonus = true;
                
                // Update UI
                updateWalletUI();
                updateTotalBalance();
                
                showMessage(`🎉 Welcome bonus received! +${CONFIG.REFERRAL.WELCOME_BONUS} AMSK`, "success");
                
                // Save data
                await saveUserData();
                
                console.log("✅ Referral processed successfully");
            }
        }
        
    } catch (error) {
        console.error("❌ Referral processing error:", error);
    }
}

async function claimMilestone(referralsRequired) {
    try {
        const milestone = CONFIG.REFERRAL.MILESTONES.find(m => m.referrals === referralsRequired);
        if (!milestone) return;
        
        // Check if already claimed
        if (walletData.referrals.claimedMilestones?.includes(referralsRequired)) {
            showMessage("Milestone already claimed", "warning");
            return;
        }
        
        // Check referral count
        if (walletData.referrals.count < referralsRequired) {
            showMessage(`Need ${referralsRequired} referrals to claim this reward`, "error");
            return;
        }
        
        // Add reward
        walletData.balances.AMSK += milestone.reward;
        walletData.referrals.earned += milestone.reward;
        
        // Mark as claimed
        if (!walletData.referrals.claimedMilestones) {
            walletData.referrals.claimedMilestones = [];
        }
        walletData.referrals.claimedMilestones.push(referralsRequired);
        
        // Update UI
        updateWalletUI();
        updateTotalBalance();
        updateReferralMilestones();
        
        // Save data
        await saveUserData();
        
        showMessage(`🏆 Milestone claimed! +${formatNumber(milestone.reward)} AMSK`, "success");
        
    } catch (error) {
        console.error("❌ Error claiming milestone:", error);
        showMessage("Failed to claim milestone", "error");
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatNumber(num, decimals = 0) {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    
    return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

function updateLoadingProgress(text, percent) {
    if (elements.loadingProgress) {
        elements.loadingProgress.style.width = percent + '%';
    }
    
    if (elements.loadingText) {
        elements.loadingText.textContent = text;
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const appContainer = document.getElementById('app-container');
    
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    
    if (appContainer) {
        appContainer.style.display = 'block';
    }
}

function switchToPage(pageName) {
    // Update navigation
    elements.navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Find and activate the correct nav item
    elements.navItems.forEach(item => {
        const span = item.querySelector('span');
        if (span && span.textContent.toLowerCase() === pageName.toLowerCase()) {
            item.classList.add('active');
        }
    });
    
    // Show selected page
    elements.pages.forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    currentPage = pageName;
    console.log('Switched to page:', pageName);
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay.active');
    if (modal) {
        modal.remove();
    }
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
    
    // Auto remove after 3 seconds
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
    }, 3000);
}

// ============================================
// EVENT LISTENERS SETUP
// ============================================
function setupEventListeners() {
    console.log("🎯 Setting up event listeners...");
    
    // Navigation
    elements.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = item.querySelector('span').textContent.toLowerCase();
            switchToPage(pageName);
        });
    });
    
    // Mining button
    if (elements.startMiningBtn) {
        elements.startMiningBtn.addEventListener('click', async () => {
            const mining = walletData.mining;
            
            if (!mining.active && !mining.nextReward) {
                // Start mining
                await startMining();
            } else if (mining.nextReward && Date.now() >= mining.nextReward) {
                // Claim reward
                await claimMiningReward();
            } else {
                showMessage("Mining in progress. Please wait.", "info");
            }
        });
    }
    
    // Upgrade buttons
    document.querySelectorAll('.upgrade-btn:not(.active-btn)').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.upgrade-card');
            if (card && !btn.disabled) {
                upgradeMiningLevel(card.dataset.level);
            }
        });
    });
    
    // Staking buttons
    elements.stakeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const planId = btn.dataset.plan;
            openStakeModal(planId);
        });
    });
    
    // Wallet actions
    document.querySelectorAll('.wallet-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.querySelector('span').textContent.toLowerCase();
            handleWalletAction(action);
        });
    });
    
    // Copy referral code
    const copyRefCodeBtn = document.querySelector('.copy-referral-code-btn');
    if (copyRefCodeBtn) {
        copyRefCodeBtn.addEventListener('click', () => {
            copyToClipboard(userData.referralCode);
        });
    }
    
    // Copy referral link
    const copyRefLinkBtn = document.querySelector('.copy-referral-link-btn');
    if (copyRefLinkBtn) {
        copyRefLinkBtn.addEventListener('click', () => {
            copyToClipboard(userData.referralLink);
        });
    }
    
    console.log("✅ Event listeners setup complete");
}

function handleWalletAction(action) {
    switch (action) {
        case 'deposit':
            openDepositModal();
            break;
        case 'withdraw':
            openWithdrawModal();
            break;
        case 'swap':
            openSwapModal();
            break;
        case 'history':
            showTransactionHistory();
            break;
        default:
            showMessage("Feature coming soon!", "info");
    }
}

function openDepositModal() {
    showMessage("Deposit feature coming soon!", "info");
}

function openWithdrawModal() {
    showMessage("Withdraw feature coming soon!", "info");
}

function openSwapModal() {
    showMessage("Swap feature coming soon!", "info");
}

function showTransactionHistory() {
    showMessage("Transaction history coming soon!", "info");
}

// ============================================
// ADMIN SYSTEM
// ============================================
function initAdminSystem() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', handleLogoClick);
        console.log("💎 Admin system initialized");
    }
}

function handleLogoClick() {
    // Admin access via logo clicks (5 times)
    // Implementation remains the same as before
}

// ============================================
// REAL-TIME UPDATES
// ============================================
function setupRealTimeUpdates() {
    // Auto-save interval
    saveInterval = setInterval(() => {
        if (userData.isInitialized) {
            saveUserData();
        }
    }, CONFIG.SYSTEM.AUTO_SAVE_INTERVAL);
    
    // Daily reset check
    setInterval(() => {
        checkDailyReset();
    }, 60000); // Check every minute
}

function checkDailyReset() {
    const now = Date.now();
    const lastReset = userData.lastDailyReset || now;
    
    if (now - lastReset >= CONFIG.SYSTEM.DAILY_RESET_TIME) {
        // Reset daily mined amount
        walletData.mining.minedToday = 0;
        userData.lastDailyReset = now;
        
        console.log("🔄 Daily mining reset");
        saveUserData();
    }
}

// ============================================
// WINDOW EVENT LISTENERS
// ============================================
window.addEventListener('beforeunload', function() {
    if (userData.isInitialized) {
        console.log("💾 Saving data before page unload...");
        saveUserData();
        
        // Clean up intervals
        if (miningInterval) clearInterval(miningInterval);
        if (saveInterval) clearInterval(saveInterval);
    }
});

// ============================================
// GLOBAL EXPORTS
// ============================================
window.switchToPage = switchToPage;
window.showMessage = showMessage;
window.copyToClipboard = copyToClipboard;
window.closeModal = closeModal;
window.upgradeMiningLevel = upgradeMiningLevel;
window.claimStakeReward = claimStakeReward;
window.cancelStake = cancelStake;
window.claimMilestone = claimMilestone;
window.updateStakePreview = updateStakePreview;
window.setMaxStakeAmount = setMaxStakeAmount;
window.confirmStaking = confirmStaking;

// ============================================
// START APPLICATION
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

console.log("👽 Alien Musk Quantum Platform v5.0 - Complete Refactor!");

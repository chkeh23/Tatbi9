// ============================================
// 👽 ALIEN MUSK - Quantum Mining Platform v6.0
// APP.JS - UPDATED TO MATCH NEW HTML STRUCTURE
// ============================================

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
    
    // Mining Configuration
    MINING: {
        DURATION: 3600000, // 1 hour in ms
        
        LEVELS: {
            1: { name: "Beginner", cost: 0, reward: 2500, hashrate: 2500 },
            2: { name: "Advanced", cost: 5, reward: 5000, hashrate: 5000 },
            3: { name: "Pro", cost: 20, reward: 10000, hashrate: 10000 }
        }
    },
    
    // Staking Configuration - FIXED CORRECT CALCULATIONS
    STAKING: {
        PLANS: {
            1: { 
                name: "Silver", 
                minAmount: 10, 
                duration: 7, 
                apr: 40,
                dailyPer10: 571, // 4000 ÷ 7
                totalPer10: 4000
            },
            2: { 
                name: "Gold", 
                minAmount: 50, 
                duration: 15, 
                apr: 50,
                dailyPer50: 1667, // 25000 ÷ 15
                totalPer50: 25000
            },
            3: { 
                name: "Diamond", 
                minAmount: 100, 
                duration: 30, 
                apr: 60,
                dailyPer100: 2000, // 60000 ÷ 30
                totalPer100: 60000
            }
        }
    },
    
    // Referral Configuration
    REFERRAL: {
        DIRECT_REWARD: 10000,
        WELCOME_BONUS: 5000,
        
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
        PASSWORD: "Ali97$"
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
    isInitialized: false,
    lastSaveTime: 0
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
        minedToday: 2500
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
    lastUpdate: Date.now()
};

// ELEMENTS CACHE
const elements = {};

// INTERVALS
let intervals = {
    miningTimer: null,
    autoSave: null
};

// ============================================
// INITIALIZATION
// ============================================
async function initAlienMuskApp() {
    console.log("🚀 Initializing Alien Musk Platform v6.0...");
    
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
        
        // 7. Start Background Services
        startBackgroundServices();
        
        // 8. Setup Admin System
        initAdminSystem();
        
        userData.isInitialized = true;
        console.log("✅ Platform initialized successfully");
        
        // Show welcome message
        setTimeout(() => {
            showMessage("👽 Welcome to Alien Musk Quantum Platform!", "success");
        }, 1000);
        
    } catch (error) {
        console.error("❌ Initialization failed:", error);
        showMessage("Failed to initialize platform", "error");
    }
}

// Cache DOM Elements - UPDATED FOR NEW HTML
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
    
    // Navigation - FIXED: Using querySelectorAll from HTML
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
    
    // Wallet action buttons
    elements.depositBtn = document.getElementById('deposit-btn');
    elements.withdrawBtn = document.getElementById('withdraw-btn');
    elements.swapBtn = document.getElementById('swap-btn');
    elements.historyBtn = document.getElementById('history-btn');
    
    // Referral elements - UPDATED: Only elements that exist in new HTML
    elements.referralLinkInput = document.getElementById('referral-link-input');
    elements.copyLinkBtn = document.getElementById('copy-link-btn');
    elements.telegramShareBtn = document.getElementById('telegram-share-btn');
    elements.whatsappShareBtn = document.getElementById('whatsapp-share-btn');
    elements.refCount = document.getElementById('ref-count');
    elements.refEarned = document.getElementById('ref-earned');
    elements.milestonesList = document.getElementById('milestones-list');
    
    console.log(`✅ Cached ${Object.keys(elements).length} element groups`);
}

// Setup User
async function setupUser() {
    console.log("👤 Setting up user...");
    
    let telegramUser = null;
    if (window.tg && window.tg.initDataUnsafe && window.tg.initDataUnsafe.user) {
        telegramUser = window.tg.initDataUnsafe.user;
        console.log("📱 Telegram user found:", telegramUser.id);
    }
    
    // FIXED: Use Telegram ID or localStorage
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
    
    // Generate referral code
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
}

// Generate referral code
function generateReferralCode(userId) {
    const idPart = userId.slice(-6).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
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
        await loadUserFromLocalStorage();
        
    } catch (error) {
        console.error("❌ Error loading user data:", error);
        initializeDefaultData();
    }
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
        minedToday: 2500
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
            lastUpdate: walletData.lastUpdate
        };
        
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        console.log("💾 User data saved to localStorage");
        
        userData.lastSaveTime = Date.now();
        
    } catch (error) {
        console.error("❌ Save error:", error);
    }
}

// ============================================
// MINING SYSTEM - UPDATED
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
        elements.startMiningBtn.disabled = false;
    } else if (mining.nextReward && now >= mining.nextReward) {
        elements.startMiningBtn.innerHTML = '<i class="fas fa-gift"></i><span>Claim Reward</span>';
        elements.startMiningBtn.classList.add('claim-mode');
        elements.startMiningBtn.disabled = false;
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

function handleMiningAction() {
    if (!walletData.mining) return;
    
    const mining = walletData.mining;
    const now = Date.now();
    
    // Prevent clicking while mining is active
    if (mining.active && mining.nextReward && now < mining.nextReward) {
        showMessage("⏳ Mining in progress. Please wait.", "info");
        return;
    }
    
    if (!mining.active) {
        // Start mining
        startMining();
    } else if (mining.nextReward && now >= mining.nextReward) {
        // Claim reward
        claimMiningReward();
    }
}

function startMining() {
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

function claimMiningReward() {
    try {
        const level = CONFIG.MINING.LEVELS[walletData.mining.level];
        let reward = level.reward;
        
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

function upgradeMiningLevel(level) {
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
        elements.walletBalanceUsd.textContent = `$${totalUSD.toFixed(2)}`;
    }
}

// ============================================
// STAKING SYSTEM - FIXED CALCULATIONS
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
            <div class="empty-stakes">
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
        let dailyReward = 0;
        let totalReward = 0;
        
        if (plan.name === "Silver") {
            dailyReward = (stake.amount / 10) * plan.dailyPer10;
            totalReward = dailyReward * plan.duration;
        } else if (plan.name === "Gold") {
            dailyReward = (stake.amount / 50) * plan.dailyPer50;
            totalReward = dailyReward * plan.duration;
        } else if (plan.name === "Diamond") {
            dailyReward = (stake.amount / 100) * plan.dailyPer100;
            totalReward = dailyReward * plan.duration;
        }
        
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

function openStakeModal(planId) {
    const plan = CONFIG.STAKING.PLANS[planId];
    if (!plan) return;
    
    const usdtBalance = walletData.balances.USDT || 0;
    const maxAmount = Math.min(usdtBalance, plan.minAmount * 10);
    
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
                                   value="${Math.max(plan.minAmount, Math.min(plan.minAmount * 2, maxAmount)).toFixed(2)}"
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
                                   value="${Math.max(plan.minAmount, Math.min(plan.minAmount * 2, maxAmount))}"
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
    let dailyReward = 0;
    let totalReward = 0;
    
    if (plan.name === "Silver") {
        dailyReward = (amount / 10) * plan.dailyPer10;
        totalReward = dailyReward * plan.duration;
    } else if (plan.name === "Gold") {
        dailyReward = (amount / 50) * plan.dailyPer50;
        totalReward = dailyReward * plan.duration;
    } else if (plan.name === "Diamond") {
        dailyReward = (amount / 100) * plan.dailyPer100;
        totalReward = dailyReward * plan.duration;
    }
    
    // Update display
    if (document.getElementById('dailyReward')) {
        document.getElementById('dailyReward').textContent = `${dailyReward.toLocaleString()} AMSK`;
    }
    
    if (document.getElementById('totalReward')) {
        document.getElementById('totalReward').textContent = `${totalReward.toLocaleString()} AMSK`;
    }
    
    if (document.getElementById('totalReturn')) {
        document.getElementById('totalReturn').textContent = `${totalReward.toLocaleString()} AMSK (≈ $${(totalReward * CONFIG.PRICES.AMSK).toFixed(2)})`;
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
    
    if (confirmBtn) confirmBtn.disabled = false;
}

function setMaxStakeAmount(planId) {
    const plan = CONFIG.STAKING.PLANS[planId];
    const amountInput = document.getElementById('stakeAmount');
    const slider = document.getElementById('stakeSlider');
    
    if (!amountInput || !plan) return;
    
    const usdtBalance = walletData.balances.USDT || 0;
    const maxAmount = Math.min(usdtBalance, plan.minAmount * 10);
    
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

function confirmStaking(planId) {
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
        
    } catch (error) {
        console.error("❌ Error confirming stake:", error);
        showMessage("Failed to process stake", "error");
    }
}

function claimStakeReward(stakeIndex) {
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
        let totalReward = 0;
        
        if (plan.name === "Silver") {
            totalReward = (stake.amount / 10) * plan.totalPer10;
        } else if (plan.name === "Gold") {
            totalReward = (stake.amount / 50) * plan.totalPer50;
        } else if (plan.name === "Diamond") {
            totalReward = (stake.amount / 100) * plan.totalPer100;
        }
        
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
// REFERRAL SYSTEM - UPDATED FOR NEW HTML
// ============================================
async function checkForReferral() {
    console.log("🔍 Checking for referral...");
    
    // Check Telegram start parameter
    let referralCode = null;
    if (window.tg && window.tg.initDataUnsafe && window.tg.initDataUnsafe.start_param) {
        referralCode = window.tg.initDataUnsafe.start_param;
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
    if (!elements.milestonesList) return;
    
    const referralCount = walletData.referrals?.count || 0;
    const claimedMilestones = walletData.referrals?.claimedMilestones || [];
    
    const milestones = elements.milestonesList.querySelectorAll('.milestone-item');
    milestones.forEach(item => {
        const milestoneNum = parseInt(item.dataset.milestone);
        const progressElement = item.querySelector('.milestone-progress');
        const actionElement = item.querySelector('.milestone-action');
        
        if (!milestoneNum) return;
        
        // Remove all classes
        item.classList.remove('locked', 'can-claim', 'claimed');
        
        // Update progress text
        if (progressElement) {
            progressElement.textContent = `${referralCount}/${milestoneNum}`;
        }
        
        // Check milestone status
        if (claimedMilestones.includes(milestoneNum)) {
            item.classList.add('claimed');
            if (actionElement) {
                actionElement.innerHTML = '<span class="claimed-badge">Claimed</span>';
            }
        } else if (referralCount >= milestoneNum) {
            item.classList.add('can-claim');
            if (actionElement) {
                actionElement.innerHTML = `<button class="btn-claim-milestone" onclick="claimMilestone(${milestoneNum})">Claim</button>`;
            }
        } else {
            item.classList.add('locked');
            if (actionElement) {
                actionElement.innerHTML = `<span class="locked-badge">${referralCount}/${milestoneNum}</span>`;
            }
        }
    });
}

function claimMilestone(milestoneNum) {
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
        
        // Update UI
        updateWalletUI();
        updateMiningDisplay();
        updateReferralDisplay();
        
        // Save data
        saveUserData();
        
        // Show success
        showMessage(`🏆 Milestone claimed! +${formatNumber(reward)} AMSK`, "success");
        
    } catch (error) {
        console.error("❌ Error claiming milestone:", error);
        showMessage("Failed to claim milestone", "error");
    }
}

// ============================================
// ADMIN SYSTEM
// ============================================
function initAdminSystem() {
    if (elements.adminLogo) {
        let gemClickCount = 0;
        let lastGemClickTime = 0;
        
        elements.adminLogo.addEventListener('click', () => {
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
        });
        
        console.log("💎 Admin system initialized");
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
                        <h3 style="color: var(--quantum-text); margin-bottom: 20px;">Administrator Access</h3>
                        <p style="color: var(--quantum-text-light); margin-bottom: 30px;">Enter administrator password</p>
                        
                        <div style="margin-bottom: 20px;">
                            <input type="password" 
                                   id="adminPasswordInput" 
                                   style="width: 100%; padding: 12px 15px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: white; font-size: 16px;"
                                   placeholder="Enter password">
                        </div>
                        
                        <button onclick="checkAdminPassword()" 
                                style="width: 100%; padding: 12px; background: var(--gradient-quantum); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                        
                        <div id="adminError" style="color: #ff4444; margin-top: 15px; display: none;">
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
    if (window.tg && window.tg.initDataUnsafe && window.tg.initDataUnsafe.user) {
        telegramUserId = window.tg.initDataUnsafe.user.id.toString();
    }
    
    if (!telegramUserId || telegramUserId !== CONFIG.ADMIN.TELEGRAM_ID) {
        if (errorDiv && errorText) {
            errorText.textContent = "Access denied: Invalid Telegram ID";
            errorDiv.style.display = 'block';
        }
        return;
    }
    
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
                    <div style="text-align: center; padding: 20px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">👑</div>
                        <h3 style="color: var(--quantum-text); margin-bottom: 20px;">Admin Dashboard</h3>
                        <p style="color: var(--quantum-text-light); margin-bottom: 30px;">Welcome to the admin panel</p>
                        
                        <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                            <div style="margin-bottom: 15px;">
                                <div style="font-size: 14px; color: #94a3b8; margin-bottom: 10px;">Add Balance to User</div>
                                
                                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                                    <input type="text" 
                                           id="adminUserId" 
                                           style="flex: 1; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: white;"
                                           placeholder="User ID">
                                    <input type="number" 
                                           id="adminUserAmount" 
                                           style="flex: 1; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: white;"
                                           placeholder="AMSK Amount" 
                                           min="1">
                                </div>
                                
                                <button onclick="addBalanceToUser()" 
                                        style="width: 100%; padding: 12px; background: var(--gradient-quantum); color: white; border: none; border-radius: 8px; font-weight: 600;">
                                    <i class="fas fa-plus-circle"></i> Add Balance
                                </button>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 10px;">
                            <button onclick="resetUserData()" 
                                    style="flex: 1; padding: 12px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; border-radius: 8px; font-weight: 600;">
                                <i class="fas fa-trash"></i> Reset User
                            </button>
                            <button onclick="closeModal()" 
                                    style="flex: 1; padding: 12px; background: linear-gradient(135deg, #6b7280, #4b5563); color: white; border: none; border-radius: 8px; font-weight: 600;">
                                <i class="fas fa-times"></i> Close
                            </button>
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

function addBalanceToUser() {
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
    
    // For demo, just add to current user
    walletData.balances.AMSK += amount;
    walletData.mining.totalMined += amount;
    
    updateWalletUI();
    updateMiningDisplay();
    
    showMessage(`✅ Added ${amount} AMSK to user`, "success");
    
    userIdInput.value = '';
    amountInput.value = '';
    saveUserData();
}

function resetUserData() {
    if (!confirm("Are you sure you want to reset all user data?")) return;
    
    initializeDefaultData();
    updateUI();
    saveUserData();
    
    showMessage("✅ User data reset successfully", "success");
    closeModal();
}

// ============================================
// EVENT LISTENERS - UPDATED FOR NEW HTML
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
            const planId = parseInt(btn.dataset.plan);
            openStakeModal(planId);
        });
    });
    
    // Wallet action buttons
    if (elements.depositBtn) {
        elements.depositBtn.addEventListener('click', () => {
            showMessage("💰 Deposit feature coming soon!", "info");
        });
    }
    
    if (elements.withdrawBtn) {
        elements.withdrawBtn.addEventListener('click', () => {
            showMessage("💸 Withdrawal feature coming soon!", "info");
        });
    }
    
    if (elements.swapBtn) {
        elements.swapBtn.addEventListener('click', () => {
            showMessage("🔄 Swap feature coming soon!", "info");
        });
    }
    
    if (elements.historyBtn) {
        elements.historyBtn.addEventListener('click', () => {
            showTransactionHistory();
        });
    }
    
    // Referral actions
    if (elements.copyLinkBtn) {
        elements.copyLinkBtn.addEventListener('click', () => {
            if (elements.referralLinkInput) {
                copyToClipboard(elements.referralLinkInput.value);
            }
        });
    }
    
    if (elements.telegramShareBtn) {
        elements.telegramShareBtn.addEventListener('click', () => {
            if (elements.referralLinkInput) {
                const text = `🚀 Join Alien Musk Quantum Mining Platform!\n\n⛏️ Mine AMSK tokens every hour\n💰 Earn from staking and referrals\n👥 Get 10,000 AMSK bonus with my link\n\n👉 ${elements.referralLinkInput.value}\n\n💎 Start your quantum mining journey!`;
                const url = `https://t.me/share/url?url=${encodeURIComponent(elements.referralLinkInput.value)}&text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
            }
        });
    }
    
    if (elements.whatsappShareBtn) {
        elements.whatsappShareBtn.addEventListener('click', () => {
            if (elements.referralLinkInput) {
                const text = `🚀 Join Alien Musk Quantum Mining Platform!\n\nMine AMSK tokens every hour\nEarn from staking and referrals\nGet 10,000 AMSK bonus with my link\n\n${elements.referralLinkInput.value}`;
                const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
            }
        });
    }
    
    console.log("✅ Event listeners setup complete");
}

function showTransactionHistory() {
    const modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-history"></i> Transaction History</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; padding: 20px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">📊</div>
                        <h3 style="color: var(--quantum-text); margin-bottom: 10px;">Transaction History</h3>
                        <p style="color: var(--quantum-text-light); margin-bottom: 30px;">Coming soon in the next update!</p>
                        
                        <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="color: var(--quantum-text-light);">Mining Rewards:</span>
                                <span style="color: var(--quantum-green); font-weight: 600;">${formatNumber(walletData.mining.totalMined)} AMSK</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="color: var(--quantum-text-light);">Staking Earnings:</span>
                                <span style="color: var(--quantum-purple); font-weight: 600;">${formatNumber(walletData.staking.totalEarned)} AMSK</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--quantum-text-light);">Referral Earnings:</span>
                                <span style="color: var(--quantum-pink); font-weight: 600;">${formatNumber(walletData.referrals.earned)} AMSK</span>
                            </div>
                        </div>
                        
                        <button onclick="closeModal()" 
                                style="width: 100%; padding: 12px; background: var(--gradient-quantum); color: white; border: none; border-radius: 8px; font-weight: 600;">
                            <i class="fas fa-times"></i> Close
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

function closeModal() {
    const modal = document.querySelector('.modal-overlay.active');
    if (modal) {
        modal.remove();
    }
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
// GLOBAL EXPORTS
// ============================================
window.initAlienMuskApp = initAlienMuskApp;
window.switchPage = switchPage;
window.closeModal = closeModal;
window.showMessage = showMessage;
window.copyToClipboard = copyToClipboard;

// Mining functions
window.handleMiningAction = handleMiningAction;
window.upgradeMiningLevel = upgradeMiningLevel;

// Staking functions
window.openStakeModal = openStakeModal;
window.confirmStaking = confirmStaking;
window.claimStakeReward = claimStakeReward;
window.cancelStake = cancelStake;
window.calculateStakeReward = calculateStakeReward;
window.setMaxStakeAmount = setMaxStakeAmount;
window.updateStakeAmountFromSlider = updateStakeAmountFromSlider;

// Referral functions
window.claimMilestone = claimMilestone;

// Admin functions
window.checkAdminPassword = checkAdminPassword;
window.addBalanceToUser = addBalanceToUser;
window.resetUserData = resetUserData;

// Utility functions
window.formatNumber = formatNumber;

console.log("👽 Alien Musk Quantum Platform v6.0 - App.js Ready!");

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAlienMuskApp);
} else {
    initAlienMuskApp();
}

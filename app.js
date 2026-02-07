// ============================================
// 👽 ALIEN MUSK - Quantum Mining Platform v6.2
// PROFESSIONAL EDITION WITH ALL FEATURES
// ============================================

// ============================================
// CONFIGURATION - UPDATED FOR v6.2
// ============================================
const CONFIG = {
    // Token Prices (USD) - FIXED
    PRICES: {
        AMSK: 0.0002,      // $0.0002 per AMSK
        USDT: 1.00,        // $1.00 per USDT
        BNB: 640.00,       // $640.00 per BNB
        TON: 1.40          // $1.40 per TON
    },
    
    // Mining Configuration - EXPANDED
    MINING: {
        DURATION: 3600000, // 1 hour in ms
        
        LEVELS: {
            1: { name: "Beginner", cost: 0, reward: 2500, hashrate: 2500 },
            2: { name: "Advanced", cost: 5, reward: 5000, hashrate: 5000 },
            3: { name: "Pro", cost: 20, reward: 10000, hashrate: 10000 },
            4: { name: "Quantum", cost: 50, reward: 25000, hashrate: 25000 },
            5: { name: "Master", cost: 100, reward: 50000, hashrate: 50000 },
            6: { name: "Alien", cost: 200, reward: 100000, hashrate: 100000 }
        }
    },
    
    // Staking Configuration - CORRECT CALCULATIONS
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
    
    // Referral Configuration - UPDATED FOR PROFESSIONAL LINKS
    REFERRAL: {
        DIRECT_REWARD: 10000,
        WELCOME_BONUS: 5000,
        
        MILESTONES: {
            10: { amsk: 50000, bnb: 0 },
            25: { amsk: 150000, bnb: 0 },
            50: { amsk: 350000, bnb: 0.01 },
            100: { amsk: 1000000, bnb: 0.025 }
        },
        
        // Professional referral code format
        CODE_LENGTH: 10,
        CODE_CHARS: '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'
    },
    
    // Deposit Configuration - ADDED
    DEPOSIT: {
        ADDRESSES: {
            USDT_BNB: '0xbe7D6b0910d1019100c5CD32b4160cA30A8EB5D4',
            TON: 'UQDZBsZgsaTeVr4EdzmrpC_D6Jcb_SJtDZxhjoYjYc9OKjpN'
        },
        MIN_AMOUNTS: {
            USDT: 10,
            BNB: 0.02,
            TON: 5
        }
    },
    
    // Withdraw Configuration - ADDED
    WITHDRAW: {
        MIN_AMOUNT: 100, // USDT
        FEE_BNB: 0.00025, // BNB fee per withdrawal
        ALLOWED_CURRENCIES: ['USDT'] // Only USDT can be withdrawn
    },
    
    // Swap Configuration - ADDED
    SWAP: {
        RATES: {
            // USDT to AMSK: 1 USDT = 5000 AMSK (1/0.0002)
            USDT_TO_AMSK: 5000,
            // AMSK to USDT: 1 AMSK = 0.0002 USDT
            AMSK_TO_USDT: 0.0002,
            // BNB to AMSK: 1 BNB = 3,200,000 AMSK (640/0.0002)
            BNB_TO_AMSK: 3200000,
            // TON to AMSK: 1 TON = 7,000 AMSK (1.4/0.0002)
            TON_TO_AMSK: 7000
        },
        
        // Allowed swap directions
        ALLOWED_SWAPS: {
            'USDT': ['AMSK'],
            'AMSK': ['USDT'],
            'BNB': ['AMSK'],
            'TON': ['AMSK']
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

// WALLET DATA - ENHANCED
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
        earned: { amsk: 0, bnb: 0, usd: 0 },
        referrals: [],
        claimedMilestones: []
    },
    // NEW: Transactions history
    transactions: [],
    // NEW: Deposit/Withdraw requests
    depositRequests: [],
    withdrawRequests: [],
    // NEW: Used TXIDs to prevent reuse
    usedTxIds: [],
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
    console.log("🚀 Initializing Alien Musk Platform v6.2...");
    
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
        
        userData.isInitialized = true;
        console.log("✅ Platform initialized successfully");
        
        // Show welcome message
        setTimeout(() => {
            showMessage("👽 Welcome to Alien Musk Quantum Platform v6.2!", "success");
        }, 1000);
        
    } catch (error) {
        console.error("❌ Initialization failed:", error);
        showMessage("Failed to initialize platform", "error");
    }
}

// Cache DOM Elements - ENHANCED
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
    
    // Wallet action buttons
    elements.depositBtn = document.getElementById('deposit-btn');
    elements.withdrawBtn = document.getElementById('withdraw-btn');
    elements.swapBtn = document.getElementById('swap-btn');
    elements.historyBtn = document.getElementById('history-btn');
    
    // Referral elements
    elements.referralLinkInput = document.getElementById('referral-link-input');
    elements.copyLinkBtn = document.getElementById('copy-link-btn');
    elements.telegramShareBtn = document.getElementById('telegram-share-btn');
    elements.whatsappShareBtn = document.getElementById('whatsapp-share-btn');
    elements.refCount = document.getElementById('ref-count');
    elements.refEarned = document.getElementById('ref-earned');
    elements.milestonesList = document.getElementById('milestones-list');
    
    console.log(`✅ Cached ${Object.keys(elements).length} element groups`);
}

// Setup User with professional referral code
async function setupUser() {
    console.log("👤 Setting up user...");
    
    let telegramUser = null;
    if (window.tg && window.tg.initDataUnsafe && window.tg.initDataUnsafe.user) {
        telegramUser = window.tg.initDataUnsafe.user;
        console.log("📱 Telegram user found:", telegramUser.id);
    }
    
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
    
    // Generate professional referral code (ONCE)
    if (!userData.referralCode) {
        userData.referralCode = generateProfessionalReferralCode();
        console.log("🔗 Generated professional referral code:", userData.referralCode);
    }
    
    userData.joinedAt = new Date().toISOString();
    userData.lastActive = new Date().toISOString();
    
    console.log("👤 User initialized:", {
        id: userData.id,
        refCode: userData.referralCode,
        name: userData.username
    });
    
    updateUserUI();
}

// Generate professional referral code (10 chars, numbers + uppercase)
function generateProfessionalReferralCode() {
    const chars = CONFIG.REFERRAL.CODE_CHARS;
    let code = '';
    
    for (let i = 0; i < CONFIG.REFERRAL.CODE_LENGTH; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }
    
    // Save to localStorage to ensure it doesn't change
    const savedCode = localStorage.getItem(`alien_ref_${userData.id}`);
    if (savedCode) {
        return savedCode;
    }
    
    localStorage.setItem(`alien_ref_${userData.id}`, code);
    return code;
}

// Update user UI with professional referral link
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
        // Professional referral link format
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
            
            if (parsed.transactions) {
                walletData.transactions = parsed.transactions;
            }
            
            if (parsed.depositRequests) {
                walletData.depositRequests = parsed.depositRequests;
            }
            
            if (parsed.withdrawRequests) {
                walletData.withdrawRequests = parsed.withdrawRequests;
            }
            
            if (parsed.usedTxIds) {
                walletData.usedTxIds = parsed.usedTxIds;
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
        earned: { amsk: 0, bnb: 0, usd: 0 },
        referrals: [],
        claimedMilestones: []
    };
    walletData.transactions = [];
    walletData.depositRequests = [];
    walletData.withdrawRequests = [];
    walletData.usedTxIds = [];
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
            transactions: walletData.transactions,
            depositRequests: walletData.depositRequests,
            withdrawRequests: walletData.withdrawRequests,
            usedTxIds: walletData.usedTxIds,
            lastUpdate: walletData.lastUpdate
        };
        
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        console.log("💾 User data saved to localStorage");
        
        userData.lastSaveTime = Date.now();
        
        // Save to Firebase if available
        if (window.db && userData.telegramId) {
            try {
                const userRef = window.db.collection('users').doc(userData.telegramId);
                userRef.set({
                    ...dataToSave,
                    userInfo: {
                        id: userData.id,
                        username: userData.username,
                        firstName: userData.firstName,
                        referralCode: userData.referralCode,
                        referredBy: userData.referredBy,
                        joinedAt: userData.joinedAt,
                        lastActive: userData.lastActive
                    }
                }, { merge: true });
                console.log("🔥 Data saved to Firebase");
            } catch (firebaseError) {
                console.warn("⚠️ Could not save to Firebase:", firebaseError);
            }
        }
        
    } catch (error) {
        console.error("❌ Save error:", error);
    }
}

// ============================================
// MINING SYSTEM
// ============================================
function updateMiningDisplay() {
    if (!walletData.mining) return;
    
    const mining = walletData.mining;
    const level = CONFIG.MINING.LEVELS[mining.level];
    
    if (elements.currentMiningLevel) {
        elements.currentMiningLevel.textContent = mining.level;
    }
    
    if (elements.currentHashrateDisplay) {
        elements.currentHashrateDisplay.textContent = formatNumber(level.hashrate);
    }
    
    updateMiningTimer();
    
    if (elements.nextRewardAmount) {
        elements.nextRewardAmount.textContent = formatNumber(level.reward);
    }
    
    if (elements.totalMined) {
        elements.totalMined.textContent = formatNumber(mining.totalMined);
    }
    
    if (elements.minedToday) {
        elements.minedToday.textContent = formatNumber(mining.minedToday);
    }
    
    updateUpgradeCards();
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
        
        if (!button || !levelData) return;
        
        if (level === currentLevel) {
            button.textContent = 'Active';
            button.classList.add('active-btn');
            button.disabled = true;
            card.classList.add('active');
        } else if (level < currentLevel) {
            button.textContent = 'Upgraded';
            button.classList.add('active-btn');
            button.disabled = true;
            card.classList.remove('active');
        } else {
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
    
    if (mining.active && mining.nextReward && now < mining.nextReward) {
        showMessage("⏳ Mining in progress. Please wait.", "info");
        return;
    }
    
    if (!mining.active) {
        startMining();
    } else if (mining.nextReward && now >= mining.nextReward) {
        claimMiningReward();
    }
}

function startMining() {
    try {
        walletData.mining.active = true;
        walletData.mining.lastReward = Date.now();
        walletData.mining.nextReward = Date.now() + CONFIG.MINING.DURATION;
        
        updateMiningDisplay();
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
        
        walletData.balances.AMSK = (walletData.balances.AMSK || 0) + reward;
        walletData.mining.totalMined = (walletData.mining.totalMined || 0) + reward;
        walletData.mining.minedToday = (walletData.mining.minedToday || 0) + reward;
        walletData.mining.lastReward = Date.now();
        walletData.mining.nextReward = Date.now() + CONFIG.MINING.DURATION;
        
        addTransaction('mining_reward', reward, 'AMSK');
        
        updateMiningDisplay();
        updateWalletUI();
        saveUserData();
        
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
        
        if (level <= walletData.mining.level) {
            showMessage("Already at or above this level!", "warning");
            return;
        }
        
        if (walletData.balances.USDT < levelData.cost) {
            showMessage(`Insufficient USDT. Need ${levelData.cost} USDT.`, "error");
            return;
        }
        
        walletData.balances.USDT -= levelData.cost;
        walletData.mining.level = level;
        
        addTransaction('mining_upgrade', -levelData.cost, 'USDT');
        
        updateMiningDisplay();
        updateWalletUI();
        saveUserData();
        
        showMessage(`⚡ Upgraded to ${levelData.name} level!`, "success");
        
    } catch (error) {
        console.error("❌ Error upgrading mining level:", error);
        showMessage("Failed to upgrade mining level", "error");
    }
}

// ============================================
// WALLET SYSTEM - ENHANCED
// ============================================
function updateWalletUI() {
    if (!walletData.balances) return;
    
    const { AMSK, USDT, BNB, TON } = walletData.balances;
    const { PRICES } = CONFIG;
    
    const totalUSD = (AMSK * PRICES.AMSK) + 
                    (USDT * PRICES.USDT) + 
                    (BNB * PRICES.BNB) + 
                    (TON * PRICES.TON);
    
    if (elements.walletBalanceUsd) {
        elements.walletBalanceUsd.textContent = `$${totalUSD.toFixed(2)}`;
    }
    
    if (elements.walletBalanceAmsk) {
        elements.walletBalanceAmsk.textContent = `${formatNumber(AMSK)} AMSK`;
    }
    
    if (elements.totalBalanceUsd) {
        elements.totalBalanceUsd.textContent = totalUSD.toFixed(2);
    }
    
    if (elements.totalBalanceAmsk) {
        elements.totalBalanceAmsk.textContent = formatNumber(AMSK);
    }
    
    if (elements.walletAmskBalance) {
        elements.walletAmskBalance.textContent = `${formatNumber(AMSK)} AMSK`;
    }
    if (elements.walletAmskValue) {
        elements.walletAmskValue.textContent = `$${(AMSK * PRICES.AMSK).toFixed(2)}`;
    }
    
    if (elements.walletUsdtBalance) {
        elements.walletUsdtBalance.textContent = `${USDT.toFixed(2)} USDT`;
    }
    if (elements.walletUsdtValue) {
        elements.walletUsdtValue.textContent = `$${USDT.toFixed(2)}`;
    }
    
    if (elements.walletBnbBalance) {
        elements.walletBnbBalance.textContent = `${BNB.toFixed(4)} BNB`;
    }
    if (elements.walletBnbValue) {
        elements.walletBnbValue.textContent = `$${(BNB * PRICES.BNB).toFixed(2)}`;
    }
    
    if (elements.walletTonBalance) {
        elements.walletTonBalance.textContent = `${formatNumber(TON)} TON`;
    }
    if (elements.walletTonValue) {
        elements.walletTonValue.textContent = `$${(TON * PRICES.TON).toFixed(2)}`;
    }
}

// ============================================
// DEPOSIT SYSTEM - NEW
// ============================================
function openDepositModal() {
    const modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-download"></i> Deposit Funds</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h4 style="color: var(--quantum-text); margin-bottom: 10px;">Deposit Funds</h4>
                        <p style="color: var(--quantum-text-light);">Send funds to our address and submit the transaction ID</p>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; color: var(--quantum-text-light); font-size: 12px; margin-bottom: 5px;">Select Currency</label>
                        <select id="depositCurrency" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: var(--quantum-text);">
                            <option value="USDT">USDT (BEP20/ERC20)</option>
                            <option value="BNB">BNB</option>
                            <option value="TON">TON</option>
                        </select>
                    </div>
                    
                    <div id="depositAddressInfo" style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 15px; margin-bottom: 15px;">
                        <div style="margin-bottom: 10px;">
                            <div style="font-size: 12px; color: var(--quantum-text-light); margin-bottom: 5px;">Deposit Address:</div>
                            <div style="display: flex; gap: 10px;">
                                <input type="text" 
                                       id="depositAddressDisplay" 
                                       value="${CONFIG.DEPOSIT.ADDRESSES.USDT_BNB}"
                                       readonly
                                       style="flex: 1; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: var(--quantum-text); font-family: monospace; font-size: 12px;">
                                <button onclick="copyToClipboard(document.getElementById('depositAddressDisplay').value)" 
                                        style="padding: 0 15px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: var(--quantum-blue);">
                                    <i class="far fa-copy"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div style="font-size: 11px; color: var(--quantum-text-light);">
                            <i class="fas fa-info-circle" style="color: var(--quantum-blue); margin-right: 5px;"></i>
                            <span id="depositMinAmount">Minimum deposit: 10 USDT</span>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; color: var(--quantum-text-light); font-size: 12px; margin-bottom: 5px;">Amount</label>
                        <input type="number" 
                               id="depositAmount" 
                               placeholder="Enter amount"
                               min="10"
                               step="0.01"
                               style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: var(--quantum-text);">
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; color: var(--quantum-text-light); font-size: 12px; margin-bottom: 5px;">Transaction ID (TXID) *</label>
                        <input type="text" 
                               id="depositTxId" 
                               placeholder="Enter transaction ID from your wallet"
                               style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: var(--quantum-text); font-family: monospace; font-size: 12px;">
                        <div style="font-size: 11px; color: var(--quantum-text-light); margin-top: 5px;">
                            <i class="fas fa-exclamation-circle" style="color: #ffc107; margin-right: 5px;"></i>
                            TXID is required for verification
                        </div>
                    </div>
                    
                    <div id="depositError" style="background: rgba(255,68,68,0.1); border: 1px solid rgba(255,68,68,0.3); border-radius: 8px; padding: 10px; margin-bottom: 15px; display: none;">
                        <i class="fas fa-exclamation-circle" style="color: #ff4444; margin-right: 8px;"></i>
                        <span id="depositErrorText" style="color: #ff4444; font-size: 12px;"></span>
                    </div>
                    
                    <div class="modal-actions" style="margin-top: 20px;">
                        <button class="btn-secondary" onclick="closeModal()">
                            Cancel
                        </button>
                        <button class="btn-primary" onclick="submitDepositRequest()">
                            Submit Deposit Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    // Setup currency change listener
    const currencySelect = document.getElementById('depositCurrency');
    if (currencySelect) {
        currencySelect.addEventListener('change', updateDepositInfo);
    }
    
    // Initial update
    updateDepositInfo();
}

function updateDepositInfo() {
    const currencySelect = document.getElementById('depositCurrency');
    const addressDisplay = document.getElementById('depositAddressDisplay');
    const minAmountText = document.getElementById('depositMinAmount');
    const amountInput = document.getElementById('depositAmount');
    
    if (!currencySelect || !addressDisplay || !minAmountText || !amountInput) return;
    
    const currency = currencySelect.value;
    
    // Update address
    if (currency === 'TON') {
        addressDisplay.value = CONFIG.DEPOSIT.ADDRESSES.TON;
    } else {
        addressDisplay.value = CONFIG.DEPOSIT.ADDRESSES.USDT_BNB;
    }
    
    // Update minimum amount
    let minAmount = 10;
    if (currency === 'BNB') minAmount = CONFIG.DEPOSIT.MIN_AMOUNTS.BNB;
    if (currency === 'TON') minAmount = CONFIG.DEPOSIT.MIN_AMOUNTS.TON;
    
    minAmountText.textContent = `Minimum deposit: ${minAmount} ${currency}`;
    
    // Update amount input
    amountInput.min = minAmount;
    amountInput.placeholder = `Enter amount (min: ${minAmount})`;
    amountInput.step = currency === 'BNB' ? '0.0001' : '0.01';
}

function validateTxId(txId, currency) {
    if (!txId || txId.trim().length < 10) {
        return { valid: false, error: "Invalid TXID" };
    }
    
    // Check if TXID already used
    if (walletData.usedTxIds.includes(txId)) {
        return { valid: false, error: "TXID already used" };
    }
    
    // Basic format validation
    if (currency !== 'TON' && !txId.startsWith('0x')) {
        return { valid: false, error: "Invalid TXID format for this currency" };
    }
    
    return { valid: true, error: "" };
}

function submitDepositRequest() {
    const currencySelect = document.getElementById('depositCurrency');
    const amountInput = document.getElementById('depositAmount');
    const txIdInput = document.getElementById('depositTxId');
    const errorDiv = document.getElementById('depositError');
    const errorText = document.getElementById('depositErrorText');
    
    if (!currencySelect || !amountInput || !txIdInput) return;
    
    const currency = currencySelect.value;
    const amount = parseFloat(amountInput.value);
    const txId = txIdInput.value.trim();
    
    // Validation
    let minAmount = CONFIG.DEPOSIT.MIN_AMOUNTS.USDT;
    if (currency === 'BNB') minAmount = CONFIG.DEPOSIT.MIN_AMOUNTS.BNB;
    if (currency === 'TON') minAmount = CONFIG.DEPOSIT.MIN_AMOUNTS.TON;
    
    if (!amount || amount < minAmount) {
        showError(errorDiv, errorText, `Minimum deposit is ${minAmount} ${currency}`);
        return;
    }
    
    if (!txId) {
        showError(errorDiv, errorText, "Please enter Transaction ID");
        return;
    }
    
    // Validate TXID
    const txValidation = validateTxId(txId, currency);
    if (!txValidation.valid) {
        showError(errorDiv, errorText, txValidation.error);
        return;
    }
    
    // Create deposit request
    const depositRequest = {
        id: 'dep_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        currency: currency,
        amount: amount,
        txId: txId,
        status: 'pending',
        timestamp: Date.now(),
        userId: userData.id
    };
    
    // Add to requests
    walletData.depositRequests.push(depositRequest);
    walletData.usedTxIds.push(txId);
    
    // Add to transactions
    addTransaction('deposit_request', amount, currency, `TXID: ${txId.substring(0, 20)}...`);
    
    // Save data
    saveUserData();
    
    // Close modal
    closeModal();
    
    // Show success message
    showMessage(`✅ Deposit request submitted for ${amount} ${currency}. Awaiting admin approval.`, "success");
}

function showError(errorDiv, errorText, message) {
    if (errorDiv && errorText) {
        errorText.textContent = message;
        errorDiv.style.display = 'block';
    }
}

// ============================================
// WITHDRAW SYSTEM - NEW
// ============================================
function openWithdrawModal() {
    // Check minimum amount
    if (walletData.balances.USDT < CONFIG.WITHDRAW.MIN_AMOUNT) {
        showMessage(`Minimum withdrawal is ${CONFIG.WITHDRAW.MIN_AMOUNT} USDT`, "error");
        return;
    }
    
    // Check BNB balance for fees
    if (walletData.balances.BNB < CONFIG.WITHDRAW.FEE_BNB) {
        showMessage(`Insufficient BNB for network fee. Required: ${CONFIG.WITHDRAW.FEE_BNB} BNB`, "error");
        return;
    }
    
    const modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-upload"></i> Withdraw USDT</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h4 style="color: var(--quantum-text); margin-bottom: 10px;">Withdraw USDT</h4>
                        <p style="color: var(--quantum-text-light);">Withdraw USDT to your external wallet</p>
                    </div>
                    
                    <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 15px; margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: var(--quantum-text-light);">Available Balance:</span>
                            <span style="color: var(--quantum-green); font-weight: 600;">${walletData.balances.USDT.toFixed(2)} USDT</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: var(--quantum-text-light);">Minimum Withdrawal:</span>
                            <span style="color: var(--quantum-text); font-weight: 600;">${CONFIG.WITHDRAW.MIN_AMOUNT} USDT</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--quantum-text-light);">Network Fee:</span>
                            <span style="color: var(--quantum-gold); font-weight: 600;">${CONFIG.WITHDRAW.FEE_BNB} BNB</span>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; color: var(--quantum-text-light); font-size: 12px; margin-bottom: 5px;">Amount (USDT)</label>
                        <input type="number" 
                               id="withdrawAmount" 
                               value="${CONFIG.WITHDRAW.MIN_AMOUNT}"
                               min="${CONFIG.WITHDRAW.MIN_AMOUNT}"
                               max="${walletData.balances.USDT}"
                               step="0.01"
                               style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: var(--quantum-text);">
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; color: var(--quantum-text-light); font-size: 12px; margin-bottom: 5px;">Wallet Address</label>
                        <input type="text" 
                               id="withdrawAddress" 
                               placeholder="Enter your USDT wallet address (BEP20/ERC20)"
                               style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: var(--quantum-text); font-family: monospace; font-size: 12px;">
                    </div>
                    
                    <div style="background: rgba(255,193,7,0.1); border: 1px solid rgba(255,193,7,0.3); border-radius: 8px; padding: 10px; margin-bottom: 15px;">
                        <p style="color: #ffc107; font-size: 11px; text-align: center; margin: 0;">
                            <i class="fas fa-exclamation-triangle"></i> 
                            ${CONFIG.WITHDRAW.FEE_BNB} BNB will be deducted for network fee. Withdrawal requires admin approval.
                        </p>
                    </div>
                    
                    <div id="withdrawError" style="background: rgba(255,68,68,0.1); border: 1px solid rgba(255,68,68,0.3); border-radius: 8px; padding: 10px; margin-bottom: 15px; display: none;">
                        <i class="fas fa-exclamation-circle" style="color: #ff4444; margin-right: 8px;"></i>
                        <span id="withdrawErrorText" style="color: #ff4444; font-size: 12px;"></span>
                    </div>
                    
                    <div class="modal-actions" style="margin-top: 20px;">
                        <button class="btn-secondary" onclick="closeModal()">
                            Cancel
                        </button>
                        <button class="btn-primary" onclick="submitWithdrawRequest()">
                            Submit Withdrawal Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

function submitWithdrawRequest() {
    const amountInput = document.getElementById('withdrawAmount');
    const addressInput = document.getElementById('withdrawAddress');
    const errorDiv = document.getElementById('withdrawError');
    const errorText = document.getElementById('withdrawErrorText');
    
    if (!amountInput || !addressInput) return;
    
    const amount = parseFloat(amountInput.value);
    const address = addressInput.value.trim();
    
    // Validation
    if (!amount || amount < CONFIG.WITHDRAW.MIN_AMOUNT) {
        showError(errorDiv, errorText, `Minimum withdrawal is ${CONFIG.WITHDRAW.MIN_AMOUNT} USDT`);
        return;
    }
    
    if (amount > walletData.balances.USDT) {
        showError(errorDiv, errorText, "Insufficient USDT balance");
        return;
    }
    
    if (walletData.balances.BNB < CONFIG.WITHDRAW.FEE_BNB) {
        showError(errorDiv, errorText, `Insufficient BNB for network fee. Required: ${CONFIG.WITHDRAW.FEE_BNB} BNB`);
        return;
    }
    
    if (!address || address.length < 20) {
        showError(errorDiv, errorText, "Please enter a valid wallet address");
        return;
    }
    
    // Confirm withdrawal
    const confirmMessage = `Withdraw ${amount} USDT?\nNetwork Fee: ${CONFIG.WITHDRAW.FEE_BNB} BNB\nTo: ${address.substring(0, 20)}...`;
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    // Deduct amounts immediately
    walletData.balances.USDT -= amount;
    walletData.balances.BNB -= CONFIG.WITHDRAW.FEE_BNB;
    
    // Create withdraw request
    const withdrawRequest = {
        id: 'withdraw_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        currency: 'USDT',
        amount: amount,
        fee: CONFIG.WITHDRAW.FEE_BNB,
        address: address,
        status: 'pending',
        timestamp: Date.now(),
        userId: userData.id
    };
    
    // Add to requests
    walletData.withdrawRequests.push(withdrawRequest);
    
    // Add to transactions
    addTransaction('withdraw_request', -amount, 'USDT', `To: ${address.substring(0, 10)}...`);
    addTransaction('withdraw_fee', -CONFIG.WITHDRAW.FEE_BNB, 'BNB', 'Network fee');
    
    // Save data
    saveUserData();
    
    // Close modal
    closeModal();
    
    // Show success message
    showMessage(`✅ Withdrawal request submitted for ${amount} USDT. Awaiting admin approval.`, "success");
    
    // Update UI
    updateWalletUI();
}

// ============================================
// SWAP SYSTEM - NEW
// ============================================
function openSwapModal() {
    const modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-exchange-alt"></i> Swap Tokens</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h4 style="color: var(--quantum-text); margin-bottom: 10px;">Swap Tokens</h4>
                        <p style="color: var(--quantum-text-light);">Instant token exchange at fixed rates</p>
                    </div>
                    
                    <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 15px; margin-bottom: 15px;">
                        <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 10px; align-items: center;">
                            <!-- From -->
                            <div>
                                <label style="display: block; color: var(--quantum-text-light); font-size: 12px; margin-bottom: 5px;">From</label>
                                <select id="swapFromCurrency" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: var(--quantum-text);" onchange="updateSwapCalculation()">
                                    <option value="USDT">USDT</option>
                                    <option value="AMSK">AMSK</option>
                                    <option value="BNB">BNB</option>
                                    <option value="TON">TON</option>
                                </select>
                            </div>
                            
                            <!-- Swap Icon -->
                            <div style="text-align: center;">
                                <button onclick="swapDirection()" style="background: var(--gradient-quantum); border: none; border-radius: 50%; width: 40px; height: 40px; color: white; cursor: pointer; font-size: 18px;">
                                    <i class="fas fa-exchange-alt"></i>
                                </button>
                            </div>
                            
                            <!-- To -->
                            <div>
                                <label style="display: block; color: var(--quantum-text-light); font-size: 12px; margin-bottom: 5px;">To</label>
                                <select id="swapToCurrency" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: var(--quantum-text);" onchange="updateSwapCalculation()">
                                    <option value="AMSK">AMSK</option>
                                    <option value="USDT">USDT</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <label style="color: var(--quantum-text-light); font-size: 12px;">Amount</label>
                            <span style="color: var(--quantum-text-light); font-size: 11px;">
                                Balance: <span id="swapBalance">0</span>
                            </span>
                        </div>
                        <input type="number" 
                               id="swapAmount" 
                               placeholder="Enter amount"
                               min="0.01"
                               step="0.01"
                               style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: var(--quantum-text);"
                               oninput="updateSwapCalculation()">
                    </div>
                    
                    <!-- Swap Details -->
                    <div id="swapDetails" style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 15px; margin-bottom: 15px; display: none;">
                        <div style="text-align: center; margin-bottom: 10px;">
                            <div style="font-size: 14px; color: var(--quantum-text-light);">You Will Receive</div>
                            <div style="font-size: 24px; font-weight: 700; color: var(--quantum-green);" id="swapReceiveAmount">0</div>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <span style="color: var(--quantum-text-light); font-size: 12px;">Rate:</span>
                            <span style="color: var(--quantum-text); font-size: 12px;" id="swapRate">1 USDT = 5,000 AMSK</span>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                            <span style="color: var(--quantum-text-light); font-size: 12px;">Fee:</span>
                            <span style="color: var(--quantum-text); font-size: 12px;">No Fees</span>
                        </div>
                    </div>
                    
                    <div id="swapError" style="background: rgba(255,68,68,0.1); border: 1px solid rgba(255,68,68,0.3); border-radius: 8px; padding: 10px; margin-bottom: 15px; display: none;">
                        <i class="fas fa-exclamation-circle" style="color: #ff4444; margin-right: 8px;"></i>
                        <span id="swapErrorText" style="color: #ff4444; font-size: 12px;"></span>
                    </div>
                    
                    <div class="modal-actions" style="margin-top: 20px;">
                        <button class="btn-secondary" onclick="closeModal()">
                            Cancel
                        </button>
                        <button class="btn-primary" id="swapConfirmBtn" onclick="executeSwap()" disabled>
                            Confirm Swap
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    // Initial calculation
    setTimeout(() => {
        updateSwapCalculation();
    }, 100);
}

function swapDirection() {
    const fromSelect = document.getElementById('swapFromCurrency');
    const toSelect = document.getElementById('swapToCurrency');
    
    if (!fromSelect || !toSelect) return;
    
    const fromValue = fromSelect.value;
    const toValue = toSelect.value;
    
    // Swap values
    fromSelect.value = toValue;
    toSelect.value = fromValue;
    
    // Update calculation
    updateSwapCalculation();
}

function updateSwapCalculation() {
    const fromCurrency = document.getElementById('swapFromCurrency')?.value;
    const toCurrency = document.getElementById('swapToCurrency')?.value;
    const amountInput = document.getElementById('swapAmount');
    const balanceSpan = document.getElementById('swapBalance');
    const detailsDiv = document.getElementById('swapDetails');
    const receiveAmount = document.getElementById('swapReceiveAmount');
    const rateSpan = document.getElementById('swapRate');
    const confirmBtn = document.getElementById('swapConfirmBtn');
    const errorDiv = document.getElementById('swapError');
    
    if (!fromCurrency || !toCurrency || !amountInput) return;
    
    // Get available balance
    const balance = walletData.balances[fromCurrency] || 0;
    if (balanceSpan) {
        balanceSpan.textContent = balance.toFixed(fromCurrency === 'BNB' ? 4 : 2) + ' ' + fromCurrency;
    }
    
    // Get amount
    const amount = parseFloat(amountInput.value) || 0;
    
    // Hide details if no amount
    if (detailsDiv) {
        detailsDiv.style.display = amount > 0 ? 'block' : 'none';
    }
    
    if (amount <= 0) {
        if (confirmBtn) confirmBtn.disabled = true;
        return;
    }
    
    // Check if swap is allowed
    const allowedSwaps = CONFIG.SWAP.ALLOWED_SWAPS[fromCurrency];
    if (!allowedSwaps || !allowedSwaps.includes(toCurrency)) {
        if (errorDiv) {
            errorDiv.style.display = 'block';
            document.getElementById('swapErrorText').textContent = `Swap from ${fromCurrency} to ${toCurrency} is not allowed`;
        }
        if (confirmBtn) confirmBtn.disabled = true;
        return;
    }
    
    // Hide error if valid
    if (errorDiv) errorDiv.style.display = 'none';
    
    // Calculate swap amount
    let receive = 0;
    let rateText = '';
    
    if (fromCurrency === 'USDT' && toCurrency === 'AMSK') {
        receive = amount * CONFIG.SWAP.RATES.USDT_TO_AMSK;
        rateText = `1 USDT = ${CONFIG.SWAP.RATES.USDT_TO_AMSK.toLocaleString()} AMSK`;
    } else if (fromCurrency === 'AMSK' && toCurrency === 'USDT') {
        receive = amount * CONFIG.SWAP.RATES.AMSK_TO_USDT;
        rateText = `1 AMSK = ${CONFIG.SWAP.RATES.AMSK_TO_USDT} USDT`;
    } else if (fromCurrency === 'BNB' && toCurrency === 'AMSK') {
        receive = amount * CONFIG.SWAP.RATES.BNB_TO_AMSK;
        rateText = `1 BNB = ${CONFIG.SWAP.RATES.BNB_TO_AMSK.toLocaleString()} AMSK`;
    } else if (fromCurrency === 'TON' && toCurrency === 'AMSK') {
        receive = amount * CONFIG.SWAP.RATES.TON_TO_AMSK;
        rateText = `1 TON = ${CONFIG.SWAP.RATES.TON_TO_AMSK.toLocaleString()} AMSK`;
    }
    
    // Update display
    if (receiveAmount) {
        receiveAmount.textContent = receive.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + ' ' + toCurrency;
    }
    
    if (rateSpan) {
        rateSpan.textContent = rateText;
    }
    
    // Check balance
    if (amount > balance) {
        if (confirmBtn) confirmBtn.disabled = true;
        return;
    }
    
    // Enable confirm button
    if (confirmBtn) confirmBtn.disabled = false;
}

function executeSwap() {
    const fromCurrency = document.getElementById('swapFromCurrency')?.value;
    const toCurrency = document.getElementById('swapToCurrency')?.value;
    const amountInput = document.getElementById('swapAmount');
    
    if (!fromCurrency || !toCurrency || !amountInput) return;
    
    const amount = parseFloat(amountInput.value) || 0;
    
    // Validation
    if (amount <= 0) {
        showMessage("Please enter a valid amount", "error");
        return;
    }
    
    if (amount > walletData.balances[fromCurrency]) {
        showMessage(`Insufficient ${fromCurrency} balance`, "error");
        return;
    }
    
    // Check if swap is allowed
    const allowedSwaps = CONFIG.SWAP.ALLOWED_SWAPS[fromCurrency];
    if (!allowedSwaps || !allowedSwaps.includes(toCurrency)) {
        showMessage(`Swap from ${fromCurrency} to ${toCurrency} is not allowed`, "error");
        return;
    }
    
    // Calculate receive amount
    let receive = 0;
    
    if (fromCurrency === 'USDT' && toCurrency === 'AMSK') {
        receive = amount * CONFIG.SWAP.RATES.USDT_TO_AMSK;
    } else if (fromCurrency === 'AMSK' && toCurrency === 'USDT') {
        receive = amount * CONFIG.SWAP.RATES.AMSK_TO_USDT;
    } else if (fromCurrency === 'BNB' && toCurrency === 'AMSK') {
        receive = amount * CONFIG.SWAP.RATES.BNB_TO_AMSK;
    } else if (fromCurrency === 'TON' && toCurrency === 'AMSK') {
        receive = amount * CONFIG.SWAP.RATES.TON_TO_AMSK;
    }
    
    // Confirm swap
    if (!confirm(`Swap ${amount} ${fromCurrency} for ${receive.toLocaleString()} ${toCurrency}?`)) {
        return;
    }
    
    // Execute swap
    walletData.balances[fromCurrency] -= amount;
    walletData.balances[toCurrency] += receive;
    
    // Add transaction
    addTransaction('swap', -amount, fromCurrency, `Swapped to ${receive.toLocaleString()} ${toCurrency}`);
    addTransaction('swap', receive, toCurrency, `Received from ${amount} ${fromCurrency}`);
    
    // Save data
    saveUserData();
    
    // Close modal
    closeModal();
    
    // Show success message
    showMessage(`✅ Successfully swapped ${amount} ${fromCurrency} for ${receive.toLocaleString()} ${toCurrency}`, "success");
    
    // Update UI
    updateWalletUI();
}

// ============================================
// HISTORY SYSTEM - ENHANCED
// ============================================
function showTransactionHistory() {
    const transactions = walletData.transactions || [];
    const depositRequests = walletData.depositRequests || [];
    const withdrawRequests = walletData.withdrawRequests || [];
    
    let historyHTML = '';
    
    // Combine all transactions
    const allTransactions = [
        ...transactions.map(tx => ({ ...tx, type: 'transaction' })),
        ...depositRequests.map(req => ({ 
            ...req, 
            type: 'deposit_request',
            amount: req.amount,
            currency: req.currency
        })),
        ...withdrawRequests.map(req => ({ 
            ...req, 
            type: 'withdraw_request',
            amount: -req.amount, // Negative for withdrawal
            currency: req.currency
        }))
    ];
    
    // Sort by timestamp (newest first)
    allTransactions.sort((a, b) => b.timestamp - a.timestamp);
    
    if (allTransactions.length === 0) {
        historyHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <div style="font-size: 48px; color: var(--quantum-text-muted); opacity: 0.5; margin-bottom: 20px;">
                    <i class="fas fa-history"></i>
                </div>
                <h4 style="color: var(--quantum-text); margin-bottom: 10px;">No Transactions Yet</h4>
                <p style="color: var(--quantum-text-light);">Your transaction history will appear here</p>
            </div>
        `;
    } else {
        allTransactions.slice(0, 50).forEach(item => {
            const date = new Date(item.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            let amount = item.amount;
            let amountColor = amount > 0 ? 'var(--quantum-green)' : '#ff4444';
            let amountSign = amount > 0 ? '+' : '';
            let icon = 'fa-exchange-alt';
            let typeText = 'Transaction';
            
            // Determine icon and type based on transaction type
            if (item.type === 'mining_reward') {
                icon = 'fa-microchip';
                typeText = 'Mining Reward';
            } else if (item.type === 'staking_reward') {
                icon = 'fa-gem';
                typeText = 'Staking Reward';
            } else if (item.type === 'referral_bonus') {
                icon = 'fa-users';
                typeText = 'Referral Bonus';
            } else if (item.type === 'deposit_request') {
                icon = 'fa-download';
                typeText = 'Deposit Request';
                amountColor = 'var(--quantum-blue)';
            } else if (item.type === 'withdraw_request') {
                icon = 'fa-upload';
                typeText = 'Withdrawal Request';
                amountColor = 'var(--quantum-purple)';
            } else if (item.type === 'swap') {
                icon = 'fa-exchange-alt';
                typeText = 'Token Swap';
            }
            
            // For requests, show status
            let statusBadge = '';
            if (item.type.includes('_request')) {
                let statusColor = 'var(--quantum-text-light)';
                let statusText = 'Pending';
                
                if (item.status === 'approved') {
                    statusColor = 'var(--quantum-green)';
                    statusText = 'Approved';
                } else if (item.status === 'rejected') {
                    statusColor = '#ff4444';
                    statusText = 'Rejected';
                }
                
                statusBadge = `<div style="font-size: 10px; color: ${statusColor}; background: ${statusColor.replace(')', ', 0.1)').replace('var(', 'rgba(')}; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-left: 8px;">${statusText}</div>`;
            }
            
            historyHTML += `
                <div style="display: flex; align-items: center; padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                        <i class="fas ${icon}" style="color: ${amountColor};"></i>
                    </div>
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; margin-bottom: 4px;">
                            <div style="font-size: 14px; font-weight: 600; color: var(--quantum-text);">${typeText}</div>
                            ${statusBadge}
                        </div>
                        <div style="font-size: 12px; color: var(--quantum-text-light);">${date}</div>
                        ${item.description ? `<div style="font-size: 11px; color: var(--quantum-text-muted);">${item.description}</div>` : ''}
                        ${item.txId ? `<div style="font-size: 10px; color: var(--quantum-text-muted); font-family: monospace;">TX: ${item.txId.substring(0, 15)}...</div>` : ''}
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 16px; font-weight: 700; color: ${amountColor};">${amountSign}${Math.abs(amount).toLocaleString()} ${item.currency}</div>
                        <div style="font-size: 11px; color: var(--quantum-text-light);">≈ $${(Math.abs(amount) * CONFIG.PRICES[item.currency]).toFixed(2)}</div>
                    </div>
                </div>
            `;
        });
    }
    
    const modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-history"></i> Transaction History</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body" style="padding: 0;">
                    <div style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h4 style="color: var(--quantum-text); margin: 0;">All Transactions</h4>
                            <span style="font-size: 12px; color: var(--quantum-text-light);">Total: ${allTransactions.length}</span>
                        </div>
                    </div>
                    
                    <div style="max-height: 400px; overflow-y: auto;">
                        ${historyHTML}
                    </div>
                    
                    <div style="padding: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                        <button class="btn-secondary" onclick="closeModal()" style="width: 100%;">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

// ============================================
// TRANSACTION MANAGEMENT
// ============================================
function addTransaction(type, amount, currency, description = '') {
    const transaction = {
        id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        type: type,
        amount: amount,
        currency: currency,
        description: description,
        timestamp: Date.now()
    };
    
    if (!walletData.transactions) {
        walletData.transactions = [];
    }
    
    walletData.transactions.unshift(transaction);
    
    // Keep only last 100 transactions
    if (walletData.transactions.length > 100) {
        walletData.transactions = walletData.transactions.slice(0, 100);
    }
    
    console.log(`📝 Transaction added: ${type} ${amount} ${currency}`);
}

// ============================================
// REFERRAL SYSTEM - UPDATED
// ============================================
async function checkForReferral() {
    console.log("🔍 Checking for referral...");
    
    let referralCode = null;
    if (window.tg && window.tg.initDataUnsafe && window.tg.initDataUnsafe.start_param) {
        referralCode = window.tg.initDataUnsafe.start_param;
        console.log("📱 Telegram referral detected:", referralCode);
    }
    
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
        userData.referredBy = referralCode;
        walletData.balances.AMSK += CONFIG.REFERRAL.WELCOME_BONUS;
        
        addTransaction('referral_welcome', CONFIG.REFERRAL.WELCOME_BONUS, 'AMSK');
        
        saveUserData();
        
        updateWalletUI();
        updateReferralDisplay();
        
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
        elements.refEarned.textContent = formatNumber(referrals.earned.amsk);
    }
    
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
        
        item.classList.remove('locked', 'can-claim', 'claimed');
        
        if (progressElement) {
            progressElement.textContent = `${referralCount}/${milestoneNum}`;
        }
        
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
        const milestoneReward = CONFIG.REFERRAL.MILESTONES[milestoneNum];
        if (!milestoneReward) {
            throw new Error("Invalid milestone");
        }
        
        if (walletData.referrals.claimedMilestones.includes(milestoneNum)) {
            showMessage("Milestone already claimed", "warning");
            return;
        }
        
        if (walletData.referrals.count < milestoneNum) {
            showMessage(`Need ${milestoneNum} referrals to claim this milestone`, "error");
            return;
        }
        
        if (milestoneReward.amsk > 0) {
            walletData.balances.AMSK += milestoneReward.amsk;
            walletData.referrals.earned.amsk += milestoneReward.amsk;
            addTransaction('referral_milestone', milestoneReward.amsk, 'AMSK', `Milestone ${milestoneNum}`);
        }
        
        if (milestoneReward.bnb > 0) {
            walletData.balances.BNB += milestoneReward.bnb;
            walletData.referrals.earned.bnb += milestoneReward.bnb;
            addTransaction('referral_milestone', milestoneReward.bnb, 'BNB', `Milestone ${milestoneNum}`);
        }
        
        walletData.referrals.earned.usd = 
            (walletData.referrals.earned.amsk * CONFIG.PRICES.AMSK) + 
            (walletData.referrals.earned.bnb * CONFIG.PRICES.BNB);
        
        walletData.referrals.claimedMilestones.push(milestoneNum);
        
        updateWalletUI();
        updateReferralDisplay();
        saveUserData();
        
        let rewardText = `+${formatNumber(milestoneReward.amsk)} AMSK`;
        if (milestoneReward.bnb > 0) {
            rewardText += ` + ${milestoneReward.bnb} BNB`;
        }
        showMessage(`🏆 Milestone claimed! ${rewardText}`, "success");
        
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
    
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
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
                        
                        <!-- Deposit Requests -->
                        <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                            <div style="margin-bottom: 15px;">
                                <div style="font-size: 14px; color: #94a3b8; margin-bottom: 10px;">Pending Deposit Requests</div>
                                <div id="adminDepositRequests" style="max-height: 200px; overflow-y: auto;">
                                    ${renderAdminDepositRequests()}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Withdraw Requests -->
                        <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                            <div style="margin-bottom: 15px;">
                                <div style="font-size: 14px; color: #94a3b8; margin-bottom: 10px;">Pending Withdraw Requests</div>
                                <div id="adminWithdrawRequests" style="max-height: 200px; overflow-y: auto;">
                                    ${renderAdminWithdrawRequests()}
                                </div>
                            </div>
                        </div>
                        
                        <!-- User Management -->
                        <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                            <div style="margin-bottom: 15px;">
                                <div style="font-size: 14px; color: #94a3b8; margin-bottom: 10px;">User Balance Management</div>
                                
                                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                                    <input type="text" 
                                           id="adminUserId" 
                                           style="flex: 1; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: white;"
                                           placeholder="User ID">
                                    <select id="adminCurrency" style="flex: 1; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: white;">
                                        <option value="AMSK">AMSK</option>
                                        <option value="USDT">USDT</option>
                                        <option value="BNB">BNB</option>
                                        <option value="TON">TON</option>
                                    </select>
                                    <input type="number" 
                                           id="adminUserAmount" 
                                           style="flex: 1; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: white;"
                                           placeholder="Amount" 
                                           min="0.01"
                                           step="0.01">
                                </div>
                                
                                <div style="display: flex; gap: 10px;">
                                    <button onclick="adminAddBalance()" 
                                            style="flex: 1; padding: 12px; background: var(--gradient-quantum); color: white; border: none; border-radius: 8px; font-weight: 600;">
                                        <i class="fas fa-plus-circle"></i> Add
                                    </button>
                                    <button onclick="adminDeductBalance()" 
                                            style="flex: 1; padding: 12px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; border-radius: 8px; font-weight: 600;">
                                        <i class="fas fa-minus-circle"></i> Deduct
                                    </button>
                                </div>
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
    
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

function renderAdminDepositRequests() {
    const pendingDeposits = (walletData.depositRequests || []).filter(d => d.status === 'pending');
    
    if (pendingDeposits.length === 0) {
        return '<div style="text-align: center; color: var(--quantum-text-light); padding: 20px;">No pending deposits</div>';
    }
    
    let html = '';
    pendingDeposits.forEach((deposit, index) => {
        const date = new Date(deposit.timestamp).toLocaleTimeString();
        html += `
            <div style="background: rgba(0,0,0,0.5); border-radius: 8px; padding: 10px; margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="color: var(--quantum-text); font-size: 12px;">${deposit.amount} ${deposit.currency}</span>
                    <span style="color: var(--quantum-text-light); font-size: 11px;">${date}</span>
                </div>
                <div style="font-size: 10px; color: var(--quantum-text-light); font-family: monospace; margin-bottom: 5px;">
                    TXID: ${deposit.txId.substring(0, 15)}...
                </div>
                <div style="display: flex; gap: 5px;">
                    <button onclick="adminApproveDeposit('${deposit.id}')" 
                            style="flex: 1; padding: 6px; background: var(--gradient-quantum); color: white; border: none; border-radius: 4px; font-size: 11px;">
                        Approve
                    </button>
                    <button onclick="adminRejectDeposit('${deposit.id}')" 
                            style="flex: 1; padding: 6px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; border-radius: 4px; font-size: 11px;">
                        Reject
                    </button>
                </div>
            </div>
        `;
    });
    
    return html;
}

function renderAdminWithdrawRequests() {
    const pendingWithdraws = (walletData.withdrawRequests || []).filter(w => w.status === 'pending');
    
    if (pendingWithdraws.length === 0) {
        return '<div style="text-align: center; color: var(--quantum-text-light); padding: 20px;">No pending withdrawals</div>';
    }
    
    let html = '';
    pendingWithdraws.forEach((withdraw, index) => {
        const date = new Date(withdraw.timestamp).toLocaleTimeString();
        html += `
            <div style="background: rgba(0,0,0,0.5); border-radius: 8px; padding: 10px; margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="color: var(--quantum-text); font-size: 12px;">${withdraw.amount} ${withdraw.currency}</span>
                    <span style="color: var(--quantum-text-light); font-size: 11px;">${date}</span>
                </div>
                <div style="font-size: 10px; color: var(--quantum-text-light); font-family: monospace; margin-bottom: 5px;">
                    To: ${withdraw.address.substring(0, 15)}...
                </div>
                <div style="display: flex; gap: 5px;">
                    <button onclick="adminApproveWithdraw('${withdraw.id}')" 
                            style="flex: 1; padding: 6px; background: var(--gradient-quantum); color: white; border: none; border-radius: 4px; font-size: 11px;">
                        Approve
                    </button>
                    <button onclick="adminRejectWithdraw('${withdraw.id}')" 
                            style="flex: 1; padding: 6px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; border-radius: 4px; font-size: 11px;">
                        Reject
                    </button>
                </div>
            </div>
        `;
    });
    
    return html;
}

function adminApproveDeposit(depositId) {
    const deposit = walletData.depositRequests.find(d => d.id === depositId);
    if (!deposit) return;
    
    // Add balance to user
    walletData.balances[deposit.currency] = (walletData.balances[deposit.currency] || 0) + deposit.amount;
    
    // Update deposit status
    deposit.status = 'approved';
    deposit.approvedAt = Date.now();
    
    // Add transaction
    addTransaction('deposit_approved', deposit.amount, deposit.currency, `Deposit approved`);
    
    // Save and update
    saveUserData();
    updateWalletUI();
    
    // Refresh admin panel
    setTimeout(() => {
        const depositRequestsDiv = document.getElementById('adminDepositRequests');
        if (depositRequestsDiv) {
            depositRequestsDiv.innerHTML = renderAdminDepositRequests();
        }
    }, 100);
    
    showMessage(`✅ Deposit approved: ${deposit.amount} ${deposit.currency} added`, "success");
}

function adminRejectDeposit(depositId) {
    const deposit = walletData.depositRequests.find(d => d.id === depositId);
    if (!deposit) return;
    
    // Update deposit status
    deposit.status = 'rejected';
    deposit.rejectedAt = Date.now();
    
    // Add transaction
    addTransaction('deposit_rejected', 0, deposit.currency, `Deposit rejected`);
    
    // Save and update
    saveUserData();
    
    // Refresh admin panel
    setTimeout(() => {
        const depositRequestsDiv = document.getElementById('adminDepositRequests');
        if (depositRequestsDiv) {
            depositRequestsDiv.innerHTML = renderAdminDepositRequests();
        }
    }, 100);
    
    showMessage(`❌ Deposit rejected`, "success");
}

function adminApproveWithdraw(withdrawId) {
    const withdraw = walletData.withdrawRequests.find(w => w.id === withdrawId);
    if (!withdraw) return;
    
    // Update withdraw status (balance already deducted)
    withdraw.status = 'approved';
    withdraw.approvedAt = Date.now();
    
    // Add transaction
    addTransaction('withdraw_approved', -withdraw.amount, withdraw.currency, `Withdrawal approved`);
    
    // Save and update
    saveUserData();
    
    // Refresh admin panel
    setTimeout(() => {
        const withdrawRequestsDiv = document.getElementById('adminWithdrawRequests');
        if (withdrawRequestsDiv) {
            withdrawRequestsDiv.innerHTML = renderAdminWithdrawRequests();
        }
    }, 100);
    
    showMessage(`✅ Withdrawal approved: ${withdraw.amount} ${withdraw.currency} sent`, "success");
}

function adminRejectWithdraw(withdrawId) {
    const withdraw = walletData.withdrawRequests.find(w => w.id === withdrawId);
    if (!withdraw) return;
    
    // Return balance to user
    walletData.balances[withdraw.currency] = (walletData.balances[withdraw.currency] || 0) + withdraw.amount;
    walletData.balances.BNB = (walletData.balances.BNB || 0) + withdraw.fee;
    
    // Update withdraw status
    withdraw.status = 'rejected';
    withdraw.rejectedAt = Date.now();
    
    // Add transactions
    addTransaction('withdraw_rejected', withdraw.amount, withdraw.currency, `Withdrawal refunded`);
    addTransaction('withdraw_fee_refund', withdraw.fee, 'BNB', `Fee refunded`);
    
    // Save and update
    saveUserData();
    updateWalletUI();
    
    // Refresh admin panel
    setTimeout(() => {
        const withdrawRequestsDiv = document.getElementById('adminWithdrawRequests');
        if (withdrawRequestsDiv) {
            withdrawRequestsDiv.innerHTML = renderAdminWithdrawRequests();
        }
    }, 100);
    
    showMessage(`❌ Withdrawal rejected. Balance refunded.`, "success");
}

function adminAddBalance() {
    const userId = document.getElementById('adminUserId')?.value;
    const currency = document.getElementById('adminCurrency')?.value;
    const amountInput = document.getElementById('adminUserAmount');
    
    if (!userId || !currency || !amountInput) return;
    
    const amount = parseFloat(amountInput.value);
    
    if (!amount || amount <= 0) {
        showMessage('Please enter a valid amount', 'error');
        return;
    }
    
    // For demo, add to current user
    walletData.balances[currency] = (walletData.balances[currency] || 0) + amount;
    
    // If adding AMSK, also add to total mined
    if (currency === 'AMSK') {
        walletData.mining.totalMined += amount;
    }
    
    // Add transaction
    addTransaction('admin_add', amount, currency, 'Admin addition');
    
    // Update UI
    updateWalletUI();
    updateMiningDisplay();
    
    showMessage(`✅ Added ${amount} ${currency} to user`, "success");
    
    // Clear input
    amountInput.value = '';
    
    // Save data
    saveUserData();
}

function adminDeductBalance() {
    const userId = document.getElementById('adminUserId')?.value;
    const currency = document.getElementById('adminCurrency')?.value;
    const amountInput = document.getElementById('adminUserAmount');
    
    if (!userId || !currency || !amountInput) return;
    
    const amount = parseFloat(amountInput.value);
    
    if (!amount || amount <= 0) {
        showMessage('Please enter a valid amount', 'error');
        return;
    }
    
    // Check balance
    if (walletData.balances[currency] < amount) {
        showMessage(`Insufficient ${currency} balance`, 'error');
        return;
    }
    
    // Deduct from current user
    walletData.balances[currency] -= amount;
    
    // Add transaction
    addTransaction('admin_deduct', -amount, currency, 'Admin deduction');
    
    // Update UI
    updateWalletUI();
    
    showMessage(`✅ Deducted ${amount} ${currency} from user`, "success");
    
    // Clear input
    amountInput.value = '';
    
    // Save data
    saveUserData();
}

function resetUserData() {
    if (!confirm("⚠️ Are you sure you want to reset ALL user data?\n\nThis will delete:\n• All balances\n• Mining progress\n• Staking data\n• Transaction history\n\nThis action cannot be undone!")) return;
    
    initializeDefaultData();
    updateUI();
    saveUserData();
    
    showMessage("✅ User data reset successfully", "success");
    closeModal();
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
            const planId = parseInt(btn.dataset.plan);
            openStakeModal(planId);
        });
    });
    
    // Wallet action buttons
    if (elements.depositBtn) {
        elements.depositBtn.addEventListener('click', openDepositModal);
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
    
    // Initialize admin system
    initAdminSystem();
    
    console.log("✅ Event listeners setup complete");
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
    closeModal();
    
    elements.navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === pageName) {
            btn.classList.add('active');
        }
    });
    
    elements.pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === `${pageName}-page`) {
            page.classList.add('active');
        }
    });
    
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

// ============================================
// BACKGROUND SERVICES
// ============================================
function startBackgroundServices() {
    intervals.miningTimer = setInterval(() => {
        updateMiningTimer();
    }, 1000);
    
    intervals.autoSave = setInterval(() => {
        if (userData.id && userData.isInitialized) {
            saveUserData();
        }
    }, 30000);
    
    console.log("⏱️ Background services started");
}

window.addEventListener('beforeunload', function() {
    if (userData.id && userData.isInitialized) {
        console.log("💾 Saving data before page unload...");
        saveUserData();
        
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

// New system functions
window.submitDepositRequest = submitDepositRequest;
window.submitWithdrawRequest = submitWithdrawRequest;
window.openSwapModal = openSwapModal;
window.swapDirection = swapDirection;
window.updateSwapCalculation = updateSwapCalculation;
window.executeSwap = executeSwap;

// Referral functions
window.claimMilestone = claimMilestone;

// Admin functions
window.checkAdminPassword = checkAdminPassword;
window.adminApproveDeposit = adminApproveDeposit;
window.adminRejectDeposit = adminRejectDeposit;
window.adminApproveWithdraw = adminApproveWithdraw;
window.adminRejectWithdraw = adminRejectWithdraw;
window.adminAddBalance = adminAddBalance;
window.adminDeductBalance = adminDeductBalance;
window.resetUserData = resetUserData;

// Utility functions
window.formatNumber = formatNumber;

console.log("👽 Alien Musk Quantum Platform v6.2 - App.js Ready!");

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAlienMuskApp);
} else {
    initAlienMuskApp();
}

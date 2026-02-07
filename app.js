// ============================================
// 👽 ALIEN MUSK - Quantum Mining Platform v7.0
// PROFESSIONAL MODALS EDITION - CENTERED POPUPS
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
    
    // Swap Configuration - NEW
    SWAP: {
        RATES: {
            USDT_TO_AMSK: 5000,    // 1 USDT = 5000 AMSK
            BNB_TO_AMSK: 3760000,  // 1 BNB = 3,760,000 AMSK
            TON_TO_AMSK: 6600      // 1 TON = 6600 AMSK
        },
        FEE: 0.01 // 1% swap fee
    },
    
    // Withdraw Configuration - NEW
    WITHDRAW: {
        MIN_AMSK: 100000, // 100,000 AMSK minimum
        MIN_USDT: 50,     // 50 USDT minimum
        FEE: 0.05,        // 5% withdrawal fee
        FEE_BNB: 0.0005   // BNB fee for network
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
        minedToday: 2500,
        lastResetDate: new Date().toDateString()
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
    transactions: [],
    lastUpdate: Date.now()
};

// ELEMENTS CACHE
const elements = {};

// INTERVALS
let intervals = {
    miningTimer: null,
    autoSave: null
};

// ACTIVE MODAL TRACKING
let activeModal = null;

// ============================================
// INITIALIZATION
// ============================================
async function initAlienMuskApp() {
    console.log("🚀 Initializing Alien Musk Platform v7.0...");
    
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
            showMessage("👽 Welcome to Alien Musk Quantum Platform v7.0!", "success");
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

// Setup User
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
        resetDailyMiningIfNeeded();
        
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

function resetDailyMiningIfNeeded() {
    const today = new Date().toDateString();
    if (walletData.mining.lastResetDate !== today) {
        walletData.mining.minedToday = 0;
        walletData.mining.lastResetDate = today;
        console.log("📅 Reset daily mining counter");
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
        lastResetDate: new Date().toDateString()
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
    walletData.transactions = [];
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
// PROFESSIONAL MODAL SYSTEM - NEW
// ============================================

// Add modal styles dynamically
function addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* PROFESSIONAL MODAL STYLES - CENTERED */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            animation: modalFadeIn 0.3s ease;
            padding: 20px;
        }
        
        @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal {
            background: linear-gradient(145deg, #1a1a2e, #16213e);
            border-radius: 20px;
            width: 100%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
            border: 1px solid rgba(0, 255, 136, 0.3);
            animation: modalSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
        }
        
        @keyframes modalSlideUp {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .modal-header {
            padding: 20px 25px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 20px 20px 0 0;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        
        .modal-header h3 {
            font-size: 18px;
            font-weight: 700;
            color: white;
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0;
        }
        
        .modal-header h3 i {
            color: var(--quantum-green);
        }
        
        .modal-close {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        
        .modal-close:hover {
            background: rgba(255, 68, 68, 0.2);
            border-color: #ff4444;
            color: #ff4444;
            transform: rotate(90deg);
        }
        
        .modal-body {
            padding: 25px;
        }
        
        /* Form Elements */
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-label {
            display: block;
            color: var(--quantum-text-light);
            font-size: 14px;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        .form-input {
            width: 100%;
            padding: 14px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: 12px;
            color: white;
            font-size: 16px;
            transition: all 0.2s;
        }
        
        .form-input:focus {
            outline: none;
            border-color: var(--quantum-blue);
            box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
        }
        
        .form-input::placeholder {
            color: rgba(255, 255, 255, 0.3);
        }
        
        /* Buttons */
        .modal-actions {
            display: flex;
            gap: 15px;
            margin-top: 25px;
        }
        
        .btn-primary {
            flex: 1;
            padding: 16px;
            background: var(--gradient-quantum);
            border: none;
            border-radius: 12px;
            color: white;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 255, 136, 0.4);
        }
        
        .btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .btn-secondary {
            flex: 1;
            padding: 16px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            color: white;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.3);
        }
        
        /* Balance Display */
        .balance-display {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(0, 255, 136, 0.2);
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 20px;
        }
        
        .balance-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .balance-label {
            color: var(--quantum-text-light);
            font-size: 14px;
        }
        
        .balance-amount {
            color: var(--quantum-green);
            font-size: 20px;
            font-weight: 700;
            font-family: monospace;
        }
        
        /* Currency Selector */
        .currency-selector {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .currency-option {
            padding: 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(0, 212, 255, 0.2);
            border-radius: 12px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .currency-option:hover {
            background: rgba(0, 212, 255, 0.1);
            border-color: var(--quantum-blue);
        }
        
        .currency-option.active {
            background: rgba(0, 212, 255, 0.2);
            border-color: var(--quantum-blue);
            box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
        }
        
        .currency-icon {
            font-size: 24px;
            margin-bottom: 8px;
            display: block;
        }
        
        .currency-name {
            font-size: 12px;
            font-weight: 600;
            color: white;
        }
        
        /* Swap Interface */
        .swap-container {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
            border: 1px solid rgba(157, 78, 221, 0.3);
        }
        
        .swap-direction {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
        }
        
        .swap-box {
            flex: 1;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 15px;
            border: 1px solid rgba(0, 212, 255, 0.2);
        }
        
        .swap-arrow {
            font-size: 24px;
            color: var(--quantum-purple);
        }
        
        /* History Table */
        .history-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .history-table th {
            text-align: left;
            padding: 12px 15px;
            color: var(--quantum-text-light);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .history-table td {
            padding: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .history-table tr:hover {
            background: rgba(255, 255, 255, 0.03);
        }
        
        /* Admin Panel */
        .admin-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        
        .admin-card {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 68, 68, 0.3);
            border-radius: 12px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .admin-card:hover {
            border-color: #ff4444;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 68, 68, 0.2);
        }
        
        .admin-card i {
            font-size: 24px;
            margin-bottom: 10px;
            display: block;
        }
        
        .admin-card-title {
            font-size: 14px;
            font-weight: 600;
            color: white;
            margin-bottom: 5px;
        }
        
        .admin-card-desc {
            font-size: 12px;
            color: var(--quantum-text-light);
        }
        
        /* Responsive */
        @media (max-width: 480px) {
            .modal {
                max-width: 100%;
                margin: 10px;
            }
            
            .modal-actions {
                flex-direction: column;
            }
            
            .currency-selector {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .swap-direction {
                flex-direction: column;
            }
            
            .admin-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
    
    document.head.appendChild(style);
    console.log("🎨 Professional modal styles added");
}

// Modal management functions
function showModal(content) {
    closeModal(); // Close any existing modal
    
    const modalHTML = `
        <div class="modal-overlay" id="active-modal-overlay">
            ${content}
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    activeModal = document.getElementById('active-modal-overlay');
    
    // Add ESC key listener
    document.addEventListener('keydown', handleEscKey);
    
    // Add click outside to close
    if (activeModal) {
        activeModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
}

function closeModal() {
    if (activeModal) {
        activeModal.remove();
        activeModal = null;
    }
    
    // Remove ESC key listener
    document.removeEventListener('keydown', handleEscKey);
}

function handleEscKey(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

// ============================================
// DEPOSIT MODAL - NEW PROFESSIONAL
// ============================================
function openDepositModal() {
    const modalContent = `
        <div class="modal">
            <div class="modal-header">
                <h3><i class="fas fa-download"></i> Deposit Funds</h3>
                <button class="modal-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin-bottom: 25px;">
                    <div style="font-size: 48px; color: var(--quantum-green); margin-bottom: 15px;">
                        <i class="fas fa-wallet"></i>
                    </div>
                    <h3 style="color: white; margin-bottom: 10px;">Deposit Crypto</h3>
                    <p style="color: var(--quantum-text-light);">Choose cryptocurrency to deposit</p>
                </div>
                
                <div class="currency-selector">
                    <div class="currency-option active" data-currency="USDT" onclick="selectDepositCurrency('USDT')">
                        <i class="fas fa-coins currency-icon" style="color: var(--quantum-blue);"></i>
                        <div class="currency-name">USDT</div>
                    </div>
                    <div class="currency-option" data-currency="BNB" onclick="selectDepositCurrency('BNB')">
                        <i class="fab fa-btc currency-icon" style="color: var(--quantum-gold);"></i>
                        <div class="currency-name">BNB</div>
                    </div>
                    <div class="currency-option" data-currency="TON" onclick="selectDepositCurrency('TON')">
                        <i class="fas fa-bolt currency-icon" style="color: var(--quantum-purple);"></i>
                        <div class="currency-name">TON</div>
                    </div>
                    <div class="currency-option" data-currency="AMSK" onclick="selectDepositCurrency('AMSK')">
                        <i class="fas fa-robot currency-icon" style="color: var(--quantum-green);"></i>
                        <div class="currency-name">AMSK</div>
                    </div>
                </div>
                
                <div id="depositInfo" style="background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <h4 style="color: var(--quantum-green); margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-info-circle"></i> USDT Deposit
                    </h4>
                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="color: var(--quantum-text-light);">Network:</span>
                            <span style="color: white; font-weight: 600;">BEP-20 (BSC)</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="color: var(--quantum-text-light);">Min Deposit:</span>
                            <span style="color: white; font-weight: 600;">10 USDT</span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Wallet Address</label>
                        <div style="display: flex; gap: 10px;">
                            <input type="text" 
                                   class="form-input" 
                                   id="depositAddress" 
                                   value="0xbe7D6b0910d1019100c5CD32b4160cA30A8EB5D4" 
                                   readonly
                                   style="font-family: monospace; font-size: 14px;">
                            <button onclick="copyDepositAddress()" 
                                    style="padding: 0 20px; background: rgba(0,212,255,0.2); border: 1px solid rgba(0,212,255,0.3); border-radius: 12px; color: var(--quantum-blue); cursor: pointer;">
                                <i class="far fa-copy"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Deposit Amount</label>
                        <input type="number" 
                               class="form-input" 
                               id="depositAmount" 
                               placeholder="Enter amount" 
                               min="10" 
                               step="0.01">
                    </div>
                    
                    <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 15px; margin-top: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: var(--quantum-text-light);">You will receive:</span>
                            <span style="color: var(--quantum-green); font-weight: 700;" id="depositReceiveAmount">0 AMSK</span>
                        </div>
                        <div style="font-size: 12px; color: var(--quantum-text-light);">
                            Rate: 1 USDT = ${CONFIG.SWAP.RATES.USDT_TO_AMSK.toLocaleString()} AMSK
                        </div>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button class="btn-primary" onclick="processDeposit()">
                        <i class="fas fa-paper-plane"></i> Confirm Deposit
                    </button>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: rgba(255,193,7,0.1); border: 1px solid rgba(255,193,7,0.3); border-radius: 12px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <i class="fas fa-exclamation-triangle" style="color: #ffc107;"></i>
                        <span style="color: #ffc107; font-weight: 600;">Important Notice</span>
                    </div>
                    <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 0; line-height: 1.4;">
                        Send only USDT (BEP-20) to this address. Sending other tokens may result in permanent loss. Deposits usually take 5-15 minutes to confirm.
                    </p>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalContent);
    updateDepositReceiveAmount();
    
    // Add event listeners
    setTimeout(() => {
        const amountInput = document.getElementById('depositAmount');
        if (amountInput) {
            amountInput.addEventListener('input', updateDepositReceiveAmount);
        }
    }, 100);
}

function selectDepositCurrency(currency) {
    // Update active currency
    document.querySelectorAll('.currency-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.currency === currency) {
            option.classList.add('active');
        }
    });
    
    // Update deposit info
    const depositInfo = document.getElementById('depositInfo');
    if (!depositInfo) return;
    
    let minDeposit = 10;
    let address = '0xbe7D6b0910d1019100c5CD32b4160cA30A8EB5D4';
    let network = 'BEP-20 (BSC)';
    let rateText = '';
    
    switch (currency) {
        case 'BNB':
            minDeposit = 0.01;
            address = '0xbe7D6b0910d1019100c5CD32b4160cA30A8EB5D4';
            network = 'BEP-20 (BSC)';
            rateText = `1 BNB = ${CONFIG.SWAP.RATES.BNB_TO_AMSK.toLocaleString()} AMSK`;
            break;
        case 'TON':
            minDeposit = 5;
            address = 'UQDZBsZgsaTeVr4EdzmrpC_D6Jcb_SJtDZxhjoYjYc9OKjpN';
            network = 'TON';
            rateText = `1 TON = ${CONFIG.SWAP.RATES.TON_TO_AMSK.toLocaleString()} AMSK`;
            break;
        case 'AMSK':
            minDeposit = 1000;
            address = 'Not available - AMSK is platform token';
            network = 'Internal';
            rateText = 'AMSK is native platform token';
            break;
        default: // USDT
            minDeposit = 10;
            address = '0xbe7D6b0910d1019100c5CD32b4160cA30A8EB5D4';
            network = 'BEP-20 (BSC)';
            rateText = `1 USDT = ${CONFIG.SWAP.RATES.USDT_TO_AMSK.toLocaleString()} AMSK`;
    }
    
    depositInfo.innerHTML = `
        <h4 style="color: var(--quantum-green); margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-info-circle"></i> ${currency} Deposit
        </h4>
        <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: var(--quantum-text-light);">Network:</span>
                <span style="color: white; font-weight: 600;">${network}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: var(--quantum-text-light);">Min Deposit:</span>
                <span style="color: white; font-weight: 600;">${minDeposit} ${currency}</span>
            </div>
        </div>
        
        <div class="form-group">
            <label class="form-label">Wallet Address</label>
            <div style="display: flex; gap: 10px;">
                <input type="text" 
                       class="form-input" 
                       id="depositAddress" 
                       value="${address}" 
                       readonly
                       style="font-family: monospace; font-size: 14px;">
                <button onclick="copyDepositAddress()" 
                        style="padding: 0 20px; background: rgba(0,212,255,0.2); border: 1px solid rgba(0,212,255,0.3); border-radius: 12px; color: var(--quantum-blue); cursor: pointer;">
                    <i class="far fa-copy"></i>
                </button>
            </div>
        </div>
        
        <div class="form-group">
            <label class="form-label">Deposit Amount</label>
            <input type="number" 
                   class="form-input" 
                   id="depositAmount" 
                   placeholder="Enter amount" 
                   min="${minDeposit}" 
                   step="${currency === 'BNB' ? '0.001' : '0.01'}">
        </div>
        
        <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 15px; margin-top: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: var(--quantum-text-light);">You will receive:</span>
                <span style="color: var(--quantum-green); font-weight: 700;" id="depositReceiveAmount">0 ${currency === 'AMSK' ? 'AMSK' : 'AMSK'}</span>
            </div>
            <div style="font-size: 12px; color: var(--quantum-text-light);">
                ${rateText}
            </div>
        </div>
    `;
    
    // Update event listener
    const amountInput = document.getElementById('depositAmount');
    if (amountInput) {
        amountInput.addEventListener('input', updateDepositReceiveAmount);
        amountInput.value = '';
    }
    
    updateDepositReceiveAmount();
}

function copyDepositAddress() {
    const addressInput = document.getElementById('depositAddress');
    if (addressInput) {
        navigator.clipboard.writeText(addressInput.value)
            .then(() => showMessage('✅ Address copied to clipboard!', 'success'))
            .catch(() => showMessage('❌ Failed to copy address', 'error'));
    }
}

function updateDepositReceiveAmount() {
    const amountInput = document.getElementById('depositAmount');
    const receiveSpan = document.getElementById('depositReceiveAmount');
    const activeCurrency = document.querySelector('.currency-option.active')?.dataset.currency || 'USDT';
    
    if (!amountInput || !receiveSpan) return;
    
    const amount = parseFloat(amountInput.value) || 0;
    let receiveAmount = 0;
    
    if (activeCurrency === 'USDT') {
        receiveAmount = amount * CONFIG.SWAP.RATES.USDT_TO_AMSK;
    } else if (activeCurrency === 'BNB') {
        receiveAmount = amount * CONFIG.SWAP.RATES.BNB_TO_AMSK;
    } else if (activeCurrency === 'TON') {
        receiveAmount = amount * CONFIG.SWAP.RATES.TON_TO_AMSK;
    } else if (activeCurrency === 'AMSK') {
        receiveAmount = amount; // 1:1 for AMSK
    }
    
    receiveSpan.textContent = `${Math.floor(receiveAmount).toLocaleString()} AMSK`;
}

function processDeposit() {
    const amountInput = document.getElementById('depositAmount');
    const activeCurrency = document.querySelector('.currency-option.active')?.dataset.currency || 'USDT';
    
    if (!amountInput) return;
    
    const amount = parseFloat(amountInput.value);
    let minAmount = 10;
    
    switch (activeCurrency) {
        case 'BNB': minAmount = 0.01; break;
        case 'TON': minAmount = 5; break;
        case 'AMSK': minAmount = 1000; break;
    }
    
    if (!amount || amount < minAmount) {
        showMessage(`Minimum deposit is ${minAmount} ${activeCurrency}`, 'error');
        return;
    }
    
    // Simulate deposit processing
    showMessage(`📥 Deposit request submitted for ${amount} ${activeCurrency}`, 'success');
    
    // In real app, you would send this to backend
    addTransaction('deposit_request', amount, activeCurrency, 'Deposit initiated');
    
    setTimeout(() => {
        showMessage(`✅ Deposit processed! Check your balance in a few minutes.`, 'success');
        closeModal();
    }, 2000);
}

// ============================================
// WITHDRAW MODAL - NEW PROFESSIONAL
// ============================================
function openWithdrawModal() {
    const modalContent = `
        <div class="modal">
            <div class="modal-header">
                <h3><i class="fas fa-upload"></i> Withdraw Funds</h3>
                <button class="modal-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin-bottom: 25px;">
                    <div style="font-size: 48px; color: var(--quantum-blue); margin-bottom: 15px;">
                        <i class="fas fa-money-bill-wave"></i>
                    </div>
                    <h3 style="color: white; margin-bottom: 10px;">Withdraw Funds</h3>
                    <p style="color: var(--quantum-text-light);">Withdraw your earnings to external wallet</p>
                </div>
                
                <div class="balance-display">
                    <div class="balance-info">
                        <div class="balance-label">Available Balance</div>
                        <div class="balance-amount">${walletData.balances.AMSK.toLocaleString()} AMSK</div>
                    </div>
                    <div style="font-size: 12px; color: var(--quantum-text-light); text-align: center;">
                        ≈ $${(walletData.balances.AMSK * CONFIG.PRICES.AMSK).toFixed(2)}
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Withdrawal Amount (AMSK)</label>
                    <div style="display: flex; gap: 10px;">
                        <input type="number" 
                               class="form-input" 
                               id="withdrawAmount" 
                               placeholder="Enter amount" 
                               min="${CONFIG.WITHDRAW.MIN_AMSK}" 
                               max="${walletData.balances.AMSK}"
                               step="1000"
                               oninput="updateWithdrawDetails()">
                        <button onclick="setMaxWithdraw()" 
                                style="padding: 0 20px; background: rgba(0,212,255,0.2); border: 1px solid rgba(0,212,255,0.3); border-radius: 12px; color: var(--quantum-blue); cursor: pointer; white-space: nowrap;">
                            Max
                        </button>
                    </div>
                    <div style="font-size: 12px; color: var(--quantum-text-light); margin-top: 8px;">
                        Minimum: ${CONFIG.WITHDRAW.MIN_AMSK.toLocaleString()} AMSK
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Withdrawal Method</label>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                        <div class="currency-option active" data-method="USDT" onclick="selectWithdrawMethod('USDT')">
                            <i class="fas fa-coins currency-icon" style="color: var(--quantum-blue);"></i>
                            <div class="currency-name">USDT</div>
                        </div>
                        <div class="currency-option" data-method="BNB" onclick="selectWithdrawMethod('BNB')">
                            <i class="fab fa-btc currency-icon" style="color: var(--quantum-gold);"></i>
                            <div class="currency-name">BNB</div>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Recipient Wallet Address</label>
                    <input type="text" 
                           class="form-input" 
                           id="withdrawAddress" 
                           placeholder="Enter wallet address (0x...)"
                           style="font-family: monospace;">
                </div>
                
                <div id="withdrawDetails" style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid rgba(255,193,7,0.3);">
                    <h4 style="color: #ffc107; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-calculator"></i> Withdrawal Details
                    </h4>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: var(--quantum-text-light);">Withdrawal Amount:</span>
                        <span style="color: white; font-weight: 600;" id="withdrawAmountDisplay">0 AMSK</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: var(--quantum-text-light);">Fee (${CONFIG.WITHDRAW.FEE * 100}%):</span>
                        <span style="color: #ff4444; font-weight: 600;" id="withdrawFeeDisplay">0 AMSK</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: var(--quantum-text-light);">Network Fee:</span>
                        <span style="color: #ff4444; font-weight: 600;" id="networkFeeDisplay">0 BNB</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);">
                        <span style="color: var(--quantum-text-light); font-weight: 600;">You will receive:</span>
                        <span style="color: var(--quantum-green); font-weight: 700; font-size: 18px;" id="withdrawReceiveDisplay">0 USDT</span>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button class="btn-primary" id="confirmWithdrawBtn" onclick="processWithdrawal()" disabled>
                        <i class="fas fa-paper-plane"></i> Confirm Withdrawal
                    </button>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: rgba(255,68,68,0.1); border: 1px solid rgba(255,68,68,0.3); border-radius: 12px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <i class="fas fa-exclamation-circle" style="color: #ff4444;"></i>
                        <span style="color: #ff4444; font-weight: 600;">Important Notice</span>
                    </div>
                    <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 0; line-height: 1.4;">
                        • Withdrawals take 1-3 business days to process<br>
                        • Ensure wallet address is correct<br>
                        • Fees are non-refundable<br>
                        • Minimum withdrawal: ${CONFIG.WITHDRAW.MIN_AMSK.toLocaleString()} AMSK
                    </p>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalContent);
    updateWithdrawDetails();
}

function selectWithdrawMethod(method) {
    document.querySelectorAll('.currency-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.method === method) {
            option.classList.add('active');
        }
    });
    updateWithdrawDetails();
}

function setMaxWithdraw() {
    const maxAmount = walletData.balances.AMSK;
    const amountInput = document.getElementById('withdrawAmount');
    if (amountInput) {
        amountInput.value = maxAmount;
        updateWithdrawDetails();
    }
}

function updateWithdrawDetails() {
    const amountInput = document.getElementById('withdrawAmount');
    const confirmBtn = document.getElementById('confirmWithdrawBtn');
    
    if (!amountInput || !confirmBtn) return;
    
    const amount = parseFloat(amountInput.value) || 0;
    const method = document.querySelector('.currency-option.active')?.dataset.method || 'USDT';
    
    // Calculate fees
    const fee = amount * CONFIG.WITHDRAW.FEE;
    const netAmount = amount - fee;
    
    // Calculate received amount
    let receivedAmount = 0;
    let receivedCurrency = 'USDT';
    
    if (method === 'USDT') {
        receivedAmount = netAmount / CONFIG.SWAP.RATES.USDT_TO_AMSK;
        receivedCurrency = 'USDT';
    } else if (method === 'BNB') {
        receivedAmount = netAmount / CONFIG.SWAP.RATES.BNB_TO_AMSK;
        receivedCurrency = 'BNB';
    }
    
    // Update displays
    const amountDisplay = document.getElementById('withdrawAmountDisplay');
    const feeDisplay = document.getElementById('withdrawFeeDisplay');
    const networkFeeDisplay = document.getElementById('networkFeeDisplay');
    const receiveDisplay = document.getElementById('withdrawReceiveDisplay');
    
    if (amountDisplay) amountDisplay.textContent = `${amount.toLocaleString()} AMSK`;
    if (feeDisplay) feeDisplay.textContent = `${fee.toLocaleString()} AMSK`;
    if (networkFeeDisplay) networkFeeDisplay.textContent = `${CONFIG.WITHDRAW.FEE_BNB} BNB`;
    if (receiveDisplay) receiveDisplay.textContent = `${receivedAmount.toFixed(method === 'BNB' ? 4 : 2)} ${receivedCurrency}`;
    
    // Validate amount
    const isValid = amount >= CONFIG.WITHDRAW.MIN_AMSK && 
                    amount <= walletData.balances.AMSK && 
                    amountInput.value !== '';
    
    confirmBtn.disabled = !isValid;
    
    if (amount > walletData.balances.AMSK) {
        showMessage('Insufficient balance', 'error');
    }
}

function processWithdrawal() {
    const amountInput = document.getElementById('withdrawAmount');
    const addressInput = document.getElementById('withdrawAddress');
    
    if (!amountInput || !addressInput) return;
    
    const amount = parseFloat(amountInput.value);
    const address = addressInput.value.trim();
    const method = document.querySelector('.currency-option.active')?.dataset.method || 'USDT';
    
    // Validation
    if (amount < CONFIG.WITHDRAW.MIN_AMSK) {
        showMessage(`Minimum withdrawal is ${CONFIG.WITHDRAW.MIN_AMSK} AMSK`, 'error');
        return;
    }
    
    if (amount > walletData.balances.AMSK) {
        showMessage('Insufficient AMSK balance', 'error');
        return;
    }
    
    if (!address || address.length < 20) {
        showMessage('Please enter a valid wallet address', 'error');
        return;
    }
    
    // Process withdrawal
    const fee = amount * CONFIG.WITHDRAW.FEE;
    const netAmount = amount - fee;
    
    // Deduct from balance
    walletData.balances.AMSK -= amount;
    
    // Add transaction
    addTransaction('withdrawal', -amount, 'AMSK', `Withdrawal to ${address.slice(0, 8)}...`);
    
    // Update UI
    updateWalletUI();
    updateTotalBalance();
    
    // Show success message
    showMessage(`✅ Withdrawal request submitted for ${amount.toLocaleString()} AMSK`, 'success');
    
    // Simulate processing
    setTimeout(() => {
        showMessage(`📋 Withdrawal is being processed. You will receive ${netAmount.toLocaleString()} AMSK (after fees)`, 'info');
        closeModal();
        saveUserData();
    }, 1500);
}

// ============================================
// SWAP MODAL - NEW PROFESSIONAL
// ============================================
function openSwapModal() {
    const modalContent = `
        <div class="modal">
            <div class="modal-header">
                <h3><i class="fas fa-exchange-alt"></i> Swap Tokens</h3>
                <button class="modal-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin-bottom: 25px;">
                    <div style="font-size: 48px; color: var(--quantum-purple); margin-bottom: 15px;">
                        <i class="fas fa-random"></i>
                    </div>
                    <h3 style="color: white; margin-bottom: 10px;">Swap Tokens</h3>
                    <p style="color: var(--quantum-text-light);">Instantly convert between tokens</p>
                </div>
                
                <div class="swap-container">
                    <div class="swap-direction">
                        <div class="swap-box">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="color: var(--quantum-text-light); font-size: 14px;">From</span>
                                <span style="color: var(--quantum-text-light); font-size: 12px;">
                                    Balance: <span id="fromBalance">0</span>
                                </span>
                            </div>
                            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                                <select id="swapFrom" class="form-input" style="flex: 1;" onchange="updateSwap()">
                                    <option value="USDT">USDT</option>
                                    <option value="BNB">BNB</option>
                                    <option value="TON">TON</option>
                                    <option value="AMSK">AMSK</option>
                                </select>
                                <input type="number" 
                                       class="form-input" 
                                       id="swapFromAmount" 
                                       placeholder="0.00"
                                       min="0.01"
                                       step="0.01"
                                       oninput="updateSwap()"
                                       style="flex: 2; text-align: right;">
                            </div>
                        </div>
                        
                        <div class="swap-arrow">
                            <i class="fas fa-exchange-alt"></i>
                        </div>
                        
                        <div class="swap-box">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="color: var(--quantum-text-light); font-size: 14px;">To</span>
                                <span style="color: var(--quantum-text-light); font-size: 12px;">
                                    Balance: <span id="toBalance">0</span>
                                </span>
                            </div>
                            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                                <select id="swapTo" class="form-input" style="flex: 1;" onchange="updateSwap()">
                                    <option value="AMSK">AMSK</option>
                                    <option value="USDT">USDT</option>
                                    <option value="BNB">BNB</option>
                                    <option value="TON">TON</option>
                                </select>
                                <input type="number" 
                                       class="form-input" 
                                       id="swapToAmount" 
                                       placeholder="0.00"
                                       readonly
                                       style="flex: 2; text-align: right; background: rgba(0,0,0,0.3);">
                            </div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <div style="color: var(--quantum-text-light); font-size: 14px; margin-bottom: 5px;">
                            Exchange Rate
                        </div>
                        <div style="color: white; font-weight: 600; font-size: 16px;" id="swapRate">
                            1 USDT = ${CONFIG.SWAP.RATES.USDT_TO_AMSK.toLocaleString()} AMSK
                        </div>
                        <div style="color: var(--quantum-text-light); font-size: 12px; margin-top: 5px;">
                            Fee: ${(CONFIG.SWAP.FEE * 100)}%
                        </div>
                    </div>
                </div>
                
                <div id="swapDetails" style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 15px; margin: 20px 0; display: none;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: var(--quantum-text-light);">You pay:</span>
                        <span style="color: white; font-weight: 600;" id="swapPayAmount">0</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: var(--quantum-text-light);">Fee:</span>
                        <span style="color: #ff4444; font-weight: 600;" id="swapFeeAmount">0</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);">
                        <span style="color: var(--quantum-text-light); font-weight: 600;">You receive:</span>
                        <span style="color: var(--quantum-green); font-weight: 700;" id="swapReceiveAmount">0</span>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button class="btn-primary" id="confirmSwapBtn" onclick="confirmSwap()" disabled>
                        <i class="fas fa-exchange-alt"></i> Confirm Swap
                    </button>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalContent);
    updateSwap();
}

function updateSwap() {
    const fromCurrency = document.getElementById('swapFrom')?.value || 'USDT';
    const toCurrency = document.getElementById('swapTo')?.value || 'AMSK';
    const fromAmount = parseFloat(document.getElementById('swapFromAmount')?.value) || 0;
    const confirmBtn = document.getElementById('confirmSwapBtn');
    const detailsDiv = document.getElementById('swapDetails');
    
    // Update balances
    const fromBalance = document.getElementById('fromBalance');
    const toBalance = document.getElementById('toBalance');
    
    if (fromBalance) fromBalance.textContent = walletData.balances[fromCurrency] || 0;
    if (toBalance) toBalance.textContent = walletData.balances[toCurrency] || 0;
    
    // Calculate exchange rate
    let rate = 0;
    let rateText = '';
    
    if (fromCurrency === 'USDT' && toCurrency === 'AMSK') {
        rate = CONFIG.SWAP.RATES.USDT_TO_AMSK;
        rateText = `1 USDT = ${rate.toLocaleString()} AMSK`;
    } else if (fromCurrency === 'BNB' && toCurrency === 'AMSK') {
        rate = CONFIG.SWAP.RATES.BNB_TO_AMSK;
        rateText = `1 BNB = ${rate.toLocaleString()} AMSK`;
    } else if (fromCurrency === 'TON' && toCurrency === 'AMSK') {
        rate = CONFIG.SWAP.RATES.TON_TO_AMSK;
        rateText = `1 TON = ${rate.toLocaleString()} AMSK`;
    } else if (fromCurrency === 'AMSK' && toCurrency === 'USDT') {
        rate = 1 / CONFIG.SWAP.RATES.USDT_TO_AMSK;
        rateText = `1 AMSK = $${rate.toFixed(6)}`;
    } else {
        // Default 1:1 for same currency or unsupported pairs
        rate = 1;
        rateText = `1 ${fromCurrency} = 1 ${toCurrency}`;
    }
    
    // Update rate display
    const rateDisplay = document.getElementById('swapRate');
    if (rateDisplay) rateDisplay.textContent = rateText;
    
    // Calculate swap
    if (fromAmount > 0) {
        const fee = fromAmount * CONFIG.SWAP.FEE;
        const amountAfterFee = fromAmount - fee;
        const receivedAmount = amountAfterFee * rate;
        
        // Update swap details
        document.getElementById('swapToAmount').value = receivedAmount.toFixed(toCurrency === 'AMSK' ? 0 : 4);
        
        if (detailsDiv) {
            detailsDiv.style.display = 'block';
            document.getElementById('swapPayAmount').textContent = `${fromAmount} ${fromCurrency}`;
            document.getElementById('swapFeeAmount').textContent = `${fee} ${fromCurrency}`;
            document.getElementById('swapReceiveAmount').textContent = `${receivedAmount.toFixed(toCurrency === 'AMSK' ? 0 : 4)} ${toCurrency}`;
        }
        
        // Validate swap
        const isValid = fromAmount <= (walletData.balances[fromCurrency] || 0) && fromAmount > 0;
        
        if (confirmBtn) {
            confirmBtn.disabled = !isValid;
            if (fromAmount > (walletData.balances[fromCurrency] || 0)) {
                showMessage('Insufficient balance', 'error');
            }
        }
    } else {
        if (detailsDiv) detailsDiv.style.display = 'none';
        document.getElementById('swapToAmount').value = '';
        if (confirmBtn) confirmBtn.disabled = true;
    }
}

function confirmSwap() {
    const fromCurrency = document.getElementById('swapFrom')?.value || 'USDT';
    const toCurrency = document.getElementById('swapTo')?.value || 'AMSK';
    const fromAmount = parseFloat(document.getElementById('swapFromAmount')?.value) || 0;
    
    if (fromAmount <= 0) {
        showMessage('Please enter a valid amount', 'error');
        return;
    }
    
    if (fromAmount > (walletData.balances[fromCurrency] || 0)) {
        showMessage('Insufficient balance', 'error');
        return;
    }
    
    // Calculate swap
    let rate = 0;
    
    if (fromCurrency === 'USDT' && toCurrency === 'AMSK') {
        rate = CONFIG.SWAP.RATES.USDT_TO_AMSK;
    } else if (fromCurrency === 'BNB' && toCurrency === 'AMSK') {
        rate = CONFIG.SWAP.RATES.BNB_TO_AMSK;
    } else if (fromCurrency === 'TON' && toCurrency === 'AMSK') {
        rate = CONFIG.SWAP.RATES.TON_TO_AMSK;
    } else if (fromCurrency === 'AMSK' && toCurrency === 'USDT') {
        rate = 1 / CONFIG.SWAP.RATES.USDT_TO_AMSK;
    } else {
        rate = 1;
    }
    
    const fee = fromAmount * CONFIG.SWAP.FEE;
    const amountAfterFee = fromAmount - fee;
    const receivedAmount = amountAfterFee * rate;
    
    // Update balances
    walletData.balances[fromCurrency] -= fromAmount;
    walletData.balances[toCurrency] += receivedAmount;
    
    // Add transactions
    addTransaction('swap_out', -fromAmount, fromCurrency, `Swapped to ${toCurrency}`);
    addTransaction('swap_in', receivedAmount, toCurrency, `Swapped from ${fromCurrency}`);
    
    // Update UI
    updateWalletUI();
    updateTotalBalance();
    
    // Show success
    showMessage(`✅ Swapped ${fromAmount} ${fromCurrency} to ${receivedAmount.toFixed(2)} ${toCurrency}`, 'success');
    
    closeModal();
    saveUserData();
}

// ============================================
// HISTORY MODAL - NEW PROFESSIONAL
// ============================================
function showTransactionHistory() {
    const transactions = walletData.transactions || [];
    
    let historyHTML = '';
    
    if (transactions.length === 0) {
        historyHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <div style="font-size: 64px; color: var(--quantum-text-muted); opacity: 0.5; margin-bottom: 20px;">
                    <i class="fas fa-history"></i>
                </div>
                <h4 style="color: var(--quantum-text); margin-bottom: 10px;">No Transactions Yet</h4>
                <p style="color: var(--quantum-text-light);">Your transaction history will appear here</p>
            </div>
        `;
    } else {
        historyHTML = `
            <div style="max-height: 400px; overflow-y: auto;">
                <table class="history-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        transactions.forEach((tx, index) => {
            const date = new Date(tx.timestamp || Date.now()).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            let typeIcon = 'fa-exchange-alt';
            let typeColor = 'var(--quantum-blue)';
            let typeText = 'Swap';
            
            if (tx.type?.includes('mining')) {
                typeIcon = 'fa-microchip';
                typeColor = 'var(--quantum-green)';
                typeText = 'Mining';
            } else if (tx.type?.includes('staking')) {
                typeIcon = 'fa-gem';
                typeColor = 'var(--quantum-purple)';
                typeText = 'Staking';
            } else if (tx.type?.includes('referral')) {
                typeIcon = 'fa-users';
                typeColor = 'var(--quantum-pink)';
                typeText = 'Referral';
            } else if (tx.type?.includes('deposit')) {
                typeIcon = 'fa-download';
                typeColor = 'var(--quantum-green)';
                typeText = 'Deposit';
            } else if (tx.type?.includes('withdrawal')) {
                typeIcon = 'fa-upload';
                typeColor = 'var(--quantum-orange)';
                typeText = 'Withdrawal';
            }
            
            const amountColor = tx.amount > 0 ? 'var(--quantum-green)' : '#ff4444';
            const amountSign = tx.amount > 0 ? '+' : '';
            
            historyHTML += `
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 36px; height: 36px; border-radius: 8px; background: ${typeColor}20; display: flex; align-items: center; justify-content: center;">
                                <i class="fas ${typeIcon}" style="color: ${typeColor};"></i>
                            </div>
                            <div>
                                <div style="font-size: 14px; font-weight: 600; color: white;">${typeText}</div>
                                <div style="font-size: 12px; color: var(--quantum-text-light);">${tx.description || ''}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div style="color: ${amountColor}; font-weight: 700; font-size: 16px;">
                            ${amountSign}${Math.abs(tx.amount).toLocaleString()} ${tx.currency}
                        </div>
                    </td>
                    <td>
                        <span style="padding: 4px 8px; background: rgba(0,255,136,0.1); color: var(--quantum-green); border-radius: 6px; font-size: 12px; font-weight: 600;">
                            Completed
                        </span>
                    </td>
                    <td>
                        <div style="font-size: 12px; color: var(--quantum-text);">${date}</div>
                    </td>
                </tr>
            `;
        });
        
        historyHTML += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    const modalContent = `
        <div class="modal">
            <div class="modal-header">
                <h3><i class="fas fa-history"></i> Transaction History</h3>
                <button class="modal-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h4 style="color: white; margin: 0;">Recent Transactions</h4>
                        <span style="font-size: 12px; color: var(--quantum-text-light);">
                            Total: ${transactions.length}
                        </span>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
                        <div style="background: rgba(0,255,136,0.1); padding: 10px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 11px; color: var(--quantum-text-light);">Mining</div>
                            <div style="font-size: 16px; font-weight: 700; color: var(--quantum-green);">
                                ${walletData.mining.totalMined.toLocaleString()}
                            </div>
                        </div>
                        <div style="background: rgba(157,78,221,0.1); padding: 10px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 11px; color: var(--quantum-text-light);">Staking</div>
                            <div style="font-size: 16px; font-weight: 700; color: var(--quantum-purple);">
                                ${walletData.staking.totalEarned.toLocaleString()}
                            </div>
                        </div>
                        <div style="background: rgba(255,0,128,0.1); padding: 10px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 11px; color: var(--quantum-text-light);">Referrals</div>
                            <div style="font-size: 16px; font-weight: 700; color: var(--quantum-pink);">
                                ${walletData.referrals.earned.toLocaleString()}
                            </div>
                        </div>
                        <div style="background: rgba(0,212,255,0.1); padding: 10px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 11px; color: var(--quantum-text-light);">Total</div>
                            <div style="font-size: 16px; font-weight: 700; color: var(--quantum-blue);">
                                ${(walletData.mining.totalMined + walletData.staking.totalEarned + walletData.referrals.earned).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
                
                ${historyHTML}
                
                <div style="margin-top: 20px;">
                    <button class="btn-secondary" onclick="closeModal()" style="width: 100%;">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalContent);
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
        
        if (!button || !levelData) return;
        
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
        
        // Add transaction
        addTransaction('mining_reward', reward, 'AMSK', `Mining Level ${walletData.mining.level}`);
        
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
        
        // Add transaction
        addTransaction('mining_upgrade', -levelData.cost, 'USDT', `Upgrade to ${levelData.name}`);
        
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
// TRANSACTION SYSTEM - NEW
// ============================================
function addTransaction(type, amount, currency, description = '') {
    try {
        const transaction = {
            id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            type: type,
            amount: amount,
            currency: currency,
            description: description,
            timestamp: Date.now(),
            status: 'completed'
        };
        
        if (!walletData.transactions) {
            walletData.transactions = [];
        }
        
        walletData.transactions.unshift(transaction);
        
        // Keep only last 100 transactions
        if (walletData.transactions.length > 100) {
            walletData.transactions = walletData.transactions.slice(0, 100);
        }
        
        console.log(`📝 Transaction added: ${type} ${amount} ${currency} - ${description}`);
        
        return transaction.id;
        
    } catch (error) {
        console.error("❌ Error adding transaction:", error);
        return null;
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
        <div class="modal">
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
    `;
    
    showModal(modalContent);
    
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
        
        // Add transaction
        addTransaction('staking_start', -amount, 'USDT', `${plan.name} Plan`);
        
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
        
        // Add transactions
        addTransaction('staking_reward', totalReward, 'AMSK', `${plan.name} Plan Reward`);
        addTransaction('staking_return', stake.amount, 'USDT', `${plan.name} Plan Return`);
        
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
    
    // Add transaction
    addTransaction('staking_cancel', returnedAmount, 'USDT', `${plan.name} Plan Cancel`);
    
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
        
        // Add transaction
        addTransaction('referral_welcome', CONFIG.REFERRAL.WELCOME_BONUS, 'AMSK', 'Welcome Bonus');
        
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
        
        // Add transaction
        addTransaction('referral_milestone', reward, 'AMSK', `Milestone ${milestoneNum}`);
        
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
// ADMIN SYSTEM - ENHANCED
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
        <div class="modal">
            <div class="modal-header">
                <h3><i class="fas fa-lock"></i> Admin Access</h3>
                <button class="modal-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 48px; margin-bottom: 20px;">🔒</div>
                    <h3 style="color: white; margin-bottom: 20px;">Administrator Access</h3>
                    <p style="color: var(--quantum-text-light); margin-bottom: 30px;">Enter administrator password</p>
                    
                    <div style="margin-bottom: 20px;">
                        <input type="password" 
                               id="adminPasswordInput" 
                               class="form-input"
                               placeholder="Enter password">
                    </div>
                    
                    <button onclick="checkAdminPassword()" 
                            class="btn-primary">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                    
                    <div id="adminError" style="color: #ff4444; margin-top: 15px; display: none;">
                        <i class="fas fa-exclamation-circle"></i> <span id="adminErrorText"></span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalContent);
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
        <div class="modal">
            <div class="modal-header">
                <h3><i class="fas fa-user-shield"></i> Admin Panel v7.0</h3>
                <button class="modal-close" onclick="closeModal()">×</button>
            </div>
            
            <div class="modal-body">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 48px; margin-bottom: 10px;">👑</div>
                    <h3 style="color: white; margin-bottom: 10px;">Admin Dashboard</h3>
                    <p style="color: var(--quantum-text-light); margin-bottom: 20px;">Advanced User Management System</p>
                </div>
                
                <div class="admin-grid">
                    <div class="admin-card" onclick="adminManageUsers()">
                        <i class="fas fa-users" style="color: var(--quantum-blue);"></i>
                        <div class="admin-card-title">Manage Users</div>
                        <div class="admin-card-desc">View and manage all users</div>
                    </div>
                    
                    <div class="admin-card" onclick="adminAddBalance()">
                        <i class="fas fa-plus-circle" style="color: var(--quantum-green);"></i>
                        <div class="admin-card-title">Add Balance</div>
                        <div class="admin-card-desc">Add tokens to any user</div>
                    </div>
                    
                    <div class="admin-card" onclick="adminWithdrawalRequests()">
                        <i class="fas fa-upload" style="color: var(--quantum-orange);"></i>
                        <div class="admin-card-title">Withdrawals</div>
                        <div class="admin-card-desc">Process withdrawal requests</div>
                    </div>
                    
                    <div class="admin-card" onclick="adminSystemStats()">
                        <i class="fas fa-chart-bar" style="color: var(--quantum-purple);"></i>
                        <div class="admin-card-title">Statistics</div>
                        <div class="admin-card-desc">View platform statistics</div>
                    </div>
                </div>
                
                <div style="margin: 30px 0; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 12px; border: 1px solid rgba(255,68,68,0.3);">
                    <h4 style="color: white; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-user-cog"></i> Current User Management
                    </h4>
                    
                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: var(--quantum-text-light);">User ID:</span>
                            <span style="color: white; font-family: monospace;">${userData.id?.slice(-8)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: var(--quantum-text-light);">Telegram ID:</span>
                            <span style="color: white;">${userData.telegramId || 'N/A'}</span>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                        <button onclick="adminAddToCurrentUser('AMSK', 10000)" 
                                style="padding: 10px; background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.3); border-radius: 8px; color: var(--quantum-green); cursor: pointer;">
                            +10K AMSK
                        </button>
                        <button onclick="adminAddToCurrentUser('USDT', 50)" 
                                style="padding: 10px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: var(--quantum-blue); cursor: pointer;">
                            +50 USDT
                        </button>
                        <button onclick="adminResetCurrentUser()" 
                                style="padding: 10px; background: rgba(255,68,68,0.1); border: 1px solid rgba(255,68,68,0.3); border-radius: 8px; color: #ff4444; cursor: pointer;">
                            Reset User
                        </button>
                        <button onclick="adminPromoteCurrentUser()" 
                                style="padding: 10px; background: rgba(157,78,221,0.1); border: 1px solid rgba(157,78,221,0.3); border-radius: 8px; color: var(--quantum-purple); cursor: pointer;">
                            Promo Code
                        </button>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i> Close
                    </button>
                    <button class="btn-primary" onclick="adminExportData()">
                        <i class="fas fa-download"></i> Export Data
                    </button>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalContent);
}

function adminAddToCurrentUser(currency, amount) {
    walletData.balances[currency] = (walletData.balances[currency] || 0) + amount;
    
    // Add transaction
    addTransaction('admin_add', amount, currency, 'Admin bonus');
    
    // Update UI
    updateWalletUI();
    updateTotalBalance();
    
    showMessage(`✅ Added ${amount} ${currency} to current user`, 'success');
    saveUserData();
}

function adminResetCurrentUser() {
    if (!confirm("⚠️ Are you sure you want to reset ALL data for current user?\n\nThis will delete all balances, mining progress, staking data, and transaction history.\n\nThis action cannot be undone!")) return;
    
    initializeDefaultData();
    updateUI();
    saveUserData();
    
    showMessage("✅ User data reset successfully", "success");
}

function adminManageUsers() {
    showMessage("👥 User Management - Coming in next update", "info");
}

function adminAddBalance() {
    showMessage("💰 Add Balance - Coming in next update", "info");
}

function adminWithdrawalRequests() {
    showMessage("💸 Withdrawal Requests - Coming in next update", "info");
}

function adminSystemStats() {
    showMessage("📊 System Statistics - Coming in next update", "info");
}

function adminPromoteCurrentUser() {
    showMessage("🎟️ Promo Code - Coming in next update", "info");
}

function adminExportData() {
    const dataStr = JSON.stringify({
        userData: userData,
        walletData: walletData
    }, null, 2);
    
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `alien_musk_data_${userData.id}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showMessage("📥 Data exported successfully", "success");
}

// ============================================
// EVENT LISTENERS - UPDATED FOR NEW HTML
// ============================================
function setupEventListeners() {
    console.log("🎯 Setting up event listeners...");
    
    // Add modal styles
    addModalStyles();
    
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
    
    // Wallet action buttons - UPDATED: Now open professional modals
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
                navigator.clipboard.writeText(elements.referralLinkInput.value)
                    .then(() => showMessage('✅ Copied to clipboard!', 'success'))
                    .catch(() => showMessage('❌ Failed to copy', 'error'));
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

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => showMessage('✅ Copied to clipboard!', 'success'))
        .catch(() => showMessage('❌ Failed to copy', 'error'));
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

// Modal functions
window.selectDepositCurrency = selectDepositCurrency;
window.copyDepositAddress = copyDepositAddress;
window.updateDepositReceiveAmount = updateDepositReceiveAmount;
window.processDeposit = processDeposit;
window.selectWithdrawMethod = selectWithdrawMethod;
window.setMaxWithdraw = setMaxWithdraw;
window.updateWithdrawDetails = updateWithdrawDetails;
window.processWithdrawal = processWithdrawal;
window.updateSwap = updateSwap;
window.confirmSwap = confirmSwap;

// Admin functions
window.checkAdminPassword = checkAdminPassword;
window.adminAddToCurrentUser = adminAddToCurrentUser;
window.adminResetCurrentUser = adminResetCurrentUser;
window.adminManageUsers = adminManageUsers;
window.adminAddBalance = adminAddBalance;
window.adminWithdrawalRequests = adminWithdrawalRequests;
window.adminSystemStats = adminSystemStats;
window.adminPromoteCurrentUser = adminPromoteCurrentUser;
window.adminExportData = adminExportData;

// Utility functions
window.formatNumber = formatNumber;

console.log("👽 Alien Musk Quantum Platform v7.0 - Professional Edition Ready!");

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAlienMuskApp);
} else {
    setTimeout(initAlienMuskApp, 100);
}

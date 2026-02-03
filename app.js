// ============================================
// ALIEN MUSK - Quantum Mining Platform
// Professional Firebase Integrated Version
// ============================================

// Telegram WebApp Initialization
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
const firebaseConfig = {
    apiKey: "AIzaSyDummyKeyForDemoPurposesOnly",
    authDomain: "alien-musk-platform.firebaseapp.com",
    projectId: "alien-musk-platform",
    storageBucket: "alien-musk-platform.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef1234567890"
};

// Firebase Initialization
let db = null;
let firebaseApp = null;

// Initialize Firebase
try {
    if (typeof firebase !== 'undefined') {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        
        // Enable offline persistence
        db.enablePersistence().catch((err) => {
            console.warn('Firebase persistence error:', err);
        });
        
        console.log("✅ Firebase initialized successfully");
    } else {
        console.warn("⚠️ Firebase not available, using localStorage");
    }
} catch (error) {
    console.error("❌ Firebase initialization error:", error);
}

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // Mining Configuration
    MINING: {
        DURATION: 3600000, // 1 hour in milliseconds
        LEVELS: {
            1: { name: 'Beginner', reward: 2500, hashrate: 2500, cost: 0, multiplier: 1 },
            2: { name: 'Advanced', reward: 5000, hashrate: 5000, cost: 5, multiplier: 2 },
            3: { name: 'Pro', reward: 10000, hashrate: 10000, cost: 20, multiplier: 4 },
            4: { name: 'Expert', reward: 25000, hashrate: 25000, cost: 100, multiplier: 10 }
        }
    },
    
    // Booster Configuration
    BOOSTERS: {
        '2x': { name: 'Quantum Boost', multiplier: 2, duration: 86400000, price: 10000 },
        '3x': { name: 'Hyper Boost', multiplier: 3, duration: 43200000, price: 15000 },
        '5x': { name: 'Alien Boost', multiplier: 5, duration: 21600000, price: 25000 }
    },
    
    // Staking Configuration
    STAKING: {
        PLANS: {
            1: { id: 1, name: 'Silver Plan', amount: 10, duration: 7, apr: 40, dailyReward: 40 },
            2: { id: 2, name: 'Gold Plan', amount: 50, duration: 15, apr: 50, dailyReward: 250 },
            3: { id: 3, name: 'Diamond Plan', amount: 100, duration: 30, apr: 60, dailyReward: 600 }
        }
    },
    
    // Token Prices (USD)
    PRICES: {
        AMSK: 0.0002,
        USDT: 1.00,
        BNB: 300.00,
        TON: 2.00
    },
    
    // Referral System
    REFERRAL: {
        BASE_REWARD: 10000,
        MILESTONES: [
            { referrals: 10, reward: 250000 },
            { referrals: 25, reward: 1000000 },
            { referrals: 50, reward: 5000000 },
            { referrals: 100, reward: 25000000 }
        ]
    },
    
    // Wallet Configuration
    WALLET: {
        MIN_DEPOSIT_USDT: 10,
        MIN_WITHDRAWAL: 50,
        WITHDRAWAL_FEE: 0.0005,
        DEPOSIT_ADDRESS: "0x790CAB511055F63db2F30AD227f7086bA3B6376a"
    },
    
    // Admin Configuration
    ADMIN: {
        TELEGRAM_ID: "1653918641",
        PASSWORD: "Ali97$",
        SECRET_CODE: "ALIEN2024"
    },
    
    // UI Configuration
    UI: {
        NOTIFICATION_DURATION: 4000,
        ANIMATION_DURATION: 300
    }
};

// ============================================
// MAIN APPLICATION CLASS
// ============================================
class AlienMuskApp {
    constructor() {
        this.userData = null;
        this.walletData = null;
        this.miningData = null;
        this.stakingData = null;
        this.referralData = null;
        
        this.elements = {};
        this.timers = {};
        this.modals = {};
        this.isProcessing = false;
        this.isAdmin = false;
        this.adminClickCount = 0;
        this.lastAdminClick = 0;
        
        this.currentPage = 'home';
        this.currentModal = null;
        
        this.init();
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    async init() {
        console.log('🚀 Initializing Alien Musk Platform...');
        
        try {
            // 1. Show loading screen
            this.showLoading();
            
            // 2. Initialize Telegram WebApp
            await this.initTelegramUser();
            
            // 3. Cache DOM elements
            this.cacheElements();
            
            // 4. Setup event listeners
            this.setupEventListeners();
            
            // 5. Setup admin access
            this.setupAdminAccess();
            
            // 6. Load user data from Firebase
            await this.loadUserData();
            
            // 7. Initialize UI
            this.initUI();
            
            // 8. Start background services
            this.startServices();
            
            // 9. Hide loading screen
            setTimeout(() => {
                this.hideLoading();
                this.showNotification('👽 Welcome to Alien Musk Quantum Platform!', 'success');
                console.log('✅ Platform initialized successfully');
            }, 1500);
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showNotification('Failed to initialize platform. Please refresh.', 'error');
            this.hideLoading();
        }
    }
    
    // Initialize Telegram user
    async initTelegramUser() {
        return new Promise((resolve) => {
            try {
                let telegramUser = null;
                
                if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
                    telegramUser = tg.initDataUnsafe.user;
                    console.log("📱 Telegram user found:", telegramUser.id);
                }
                
                // Create initial user data structure
                this.userData = {
                    id: telegramUser ? telegramUser.id.toString() : `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                    telegramId: telegramUser ? telegramUser.id.toString() : null,
                    username: telegramUser ? (telegramUser.username || `user_${telegramUser.id}`) : 'Alien Explorer',
                    firstName: telegramUser ? telegramUser.first_name : 'Alien',
                    lastName: telegramUser ? telegramUser.last_name : '',
                    photoUrl: telegramUser ? telegramUser.photo_url : 'https://api.dicebear.com/7.x/avataaars/svg?seed=alien',
                    language: telegramUser ? telegramUser.language_code : 'en',
                    isPremium: telegramUser ? telegramUser.is_premium : false,
                    joinedAt: new Date().toISOString(),
                    lastActive: new Date().toISOString(),
                    isInitialized: false
                };
                
                // Generate referral code
                this.userData.referralCode = this.generateReferralCode(this.userData.id);
                
                resolve();
                
            } catch (error) {
                console.error('Telegram user init error:', error);
                resolve();
            }
        });
    }
    
    // Cache DOM elements
    cacheElements() {
        console.log('🔍 Caching DOM elements...');
        
        // Loading screen
        this.elements.loadingScreen = document.getElementById('loading-screen');
        this.elements.loadingProgress = document.getElementById('loading-progress');
        
        // Header elements
        this.elements.headerBalance = document.getElementById('header-balance');
        this.elements.notificationCount = document.getElementById('notification-count');
        this.elements.userAvatar = document.getElementById('user-avatar');
        this.elements.homeAvatar = document.getElementById('home-avatar');
        
        // Navigation
        this.elements.navButtons = document.querySelectorAll('.nav-btn');
        this.elements.bottomNav = document.querySelector('.bottom-nav');
        
        // Pages
        this.elements.pages = document.querySelectorAll('.page');
        
        // Home page elements
        this.elements.username = document.getElementById('username');
        this.elements.userId = document.getElementById('user-id');
        this.elements.totalAmsk = document.getElementById('total-amsk');
        this.elements.usdEquivalent = document.getElementById('usd-equivalent');
        this.elements.currentHashrate = document.getElementById('current-hashrate');
        this.elements.miningTimer = document.getElementById('mining-timer');
        this.elements.nextReward = document.getElementById('next-reward');
        this.elements.startMiningBtn = document.getElementById('start-mining');
        this.elements.minedToday = document.getElementById('mined-today');
        this.elements.totalMined = document.getElementById('total-mined');
        this.elements.stakingEarned = document.getElementById('staking-earned');
        this.elements.miningLevel = document.getElementById('mining-level');
        
        // Upgrade cards
        this.elements.upgradeCards = document.querySelectorAll('.upgrade-card');
        this.elements.upgradeButtons = document.querySelectorAll('.upgrade-btn');
        
        // Booster cards
        this.elements.boosterCards = document.querySelectorAll('.booster-card');
        this.elements.boosterButtons = document.querySelectorAll('.booster-btn');
        
        // Referral elements
        this.elements.refCount = document.getElementById('ref-count');
        this.elements.totalRefs = document.getElementById('total-refs');
        this.elements.refEarned = document.getElementById('ref-earned');
        this.elements.nextGoal = document.getElementById('next-goal');
        this.elements.progressText = document.getElementById('progress-text');
        this.elements.progressFill = document.getElementById('progress-fill');
        this.elements.goalReward = document.getElementById('goal-reward');
        this.elements.refCode = document.getElementById('ref-code');
        this.elements.copyRefCode = document.getElementById('copy-ref-code');
        this.elements.shareRef = document.getElementById('share-ref');
        
        // Staking page elements
        this.elements.activeStakesList = document.getElementById('active-stakes-list');
        this.elements.stakeButtons = document.querySelectorAll('.stake-btn');
        this.elements.planCards = document.querySelectorAll('.plan-card');
        
        // Wallet page elements
        this.elements.walletTotalAmsk = document.getElementById('wallet-total-amsk');
        this.elements.walletTotalUsd = document.getElementById('wallet-total-usd');
        this.elements.walletAmsk = document.getElementById('wallet-amsk');
        this.elements.walletAmskValue = document.getElementById('wallet-amsk-value');
        this.elements.walletUsdt = document.getElementById('wallet-usdt');
        this.elements.walletUsdtValue = document.getElementById('wallet-usdt-value');
        this.elements.quickButtons = document.querySelectorAll('.quick-btn');
        this.elements.assetActionButtons = document.querySelectorAll('.asset-action-btn');
        
        // Modals
        this.elements.modalOverlay = document.getElementById('modal-overlay');
        this.elements.depositModal = document.getElementById('deposit-modal');
        this.elements.withdrawModal = document.getElementById('withdraw-modal');
        this.elements.swapModal = document.getElementById('swap-modal');
        this.elements.stakeModal = document.getElementById('stake-modal');
        this.elements.boosterModal = document.getElementById('booster-modal');
        this.elements.closeModalButtons = document.querySelectorAll('.close-modal');
        
        console.log(`✅ Cached ${Object.keys(this.elements).length} elements`);
    }
    
    // ============================================
    // FIREBASE DATA MANAGEMENT
    // ============================================
    async loadUserData() {
        if (!db) {
            console.warn('⚠️ Firebase not available, using localStorage');
            await this.loadFromLocalStorage();
            return;
        }
        
        try {
            console.log('📥 Loading user data from Firebase...');
            
            const userRef = db.collection('users').doc(this.userData.id);
            const userDoc = await userRef.get();
            
            if (userDoc.exists) {
                // User exists in Firebase, load data
                const firebaseData = userDoc.data();
                
                // Initialize user data structure
                this.userData = {
                    ...this.userData,
                    ...firebaseData,
                    isInitialized: true
                };
                
                // Load wallet data
                await this.loadWalletData();
                
                // Load mining data
                await this.loadMiningData();
                
                // Load staking data
                await this.loadStakingData();
                
                // Load referral data
                await this.loadReferralData();
                
                console.log('✅ User data loaded from Firebase');
                
            } else {
                // New user, create document in Firebase
                await this.createNewUser();
            }
            
        } catch (error) {
            console.error('❌ Error loading user data:', error);
            await this.loadFromLocalStorage();
        }
    }
    
    async createNewUser() {
        try {
            const initialData = {
                // User information
                id: this.userData.id,
                telegramId: this.userData.telegramId,
                username: this.userData.username,
                firstName: this.userData.firstName,
                photoUrl: this.userData.photoUrl,
                joinedAt: this.userData.joinedAt,
                lastActive: new Date().toISOString(),
                
                // Wallet balances
                balance: 2500, // Initial AMSK balance
                totalEarned: 2500,
                usdtBalance: 100,
                bnbBalance: 0.5,
                tonBalance: 50,
                
                // Mining data
                miningLevel: 1,
                miningActive: true,
                lastMineTime: Date.now(),
                nextMineTime: Date.now() + CONFIG.MINING.DURATION,
                totalMined: 2500,
                minedToday: 2500,
                
                // Referral data
                referralCode: this.userData.referralCode,
                referralCount: 0,
                referralEarnings: 0,
                referrals: [],
                claimedMilestones: [],
                
                // Staking data
                activeStakes: [],
                stakingEarnings: 0,
                totalStaked: 0,
                
                // System data
                version: '2.0.0',
                settings: {
                    notifications: true,
                    sound: true,
                    theme: 'dark'
                }
            };
            
            // Save to Firebase
            await db.collection('users').doc(this.userData.id).set(initialData);
            
            // Update local data
            this.userData = { ...this.userData, ...initialData, isInitialized: true };
            this.walletData = {
                AMSK: initialData.balance,
                USDT: initialData.usdtBalance,
                BNB: initialData.bnbBalance,
                TON: initialData.tonBalance
            };
            
            console.log('✅ New user created in Firebase');
            
        } catch (error) {
            console.error('❌ Error creating new user:', error);
            throw error;
        }
    }
    
    async loadWalletData() {
        if (!db) return;
        
        try {
            const walletRef = db.collection('wallets').doc(this.userData.id);
            const walletDoc = await walletRef.get();
            
            if (walletDoc.exists) {
                this.walletData = walletDoc.data();
            } else {
                // Create wallet if doesn't exist
                this.walletData = {
                    userId: this.userData.id,
                    AMSK: this.userData.balance || 2500,
                    USDT: this.userData.usdtBalance || 100,
                    BNB: this.userData.bnbBalance || 0.5,
                    TON: this.userData.tonBalance || 50,
                    totalWithdrawn: 0,
                    pendingDeposits: [],
                    pendingWithdrawals: [],
                    transactionHistory: [],
                    lastUpdate: new Date().toISOString()
                };
                
                await walletRef.set(this.walletData);
            }
        } catch (error) {
            console.error('❌ Error loading wallet data:', error);
        }
    }
    
    async loadMiningData() {
        if (!db) return;
        
        try {
            const miningRef = db.collection('mining').doc(this.userData.id);
            const miningDoc = await miningRef.get();
            
            if (miningDoc.exists) {
                this.miningData = miningDoc.data();
            } else {
                this.miningData = {
                    userId: this.userData.id,
                    level: this.userData.miningLevel || 1,
                    isActive: true,
                    lastReward: Date.now(),
                    nextReward: Date.now() + CONFIG.MINING.DURATION,
                    totalMined: this.userData.totalMined || 2500,
                    minedToday: this.userData.minedToday || 2500,
                    activeBoosters: [],
                    efficiency: 1.0,
                    lastUpgrade: Date.now()
                };
                
                await miningRef.set(this.miningData);
            }
        } catch (error) {
            console.error('❌ Error loading mining data:', error);
        }
    }
    
    async loadStakingData() {
        if (!db) return;
        
        try {
            const stakingRef = db.collection('staking').doc(this.userData.id);
            const stakingDoc = await stakingRef.get();
            
            if (stakingDoc.exists) {
                this.stakingData = stakingDoc.data();
            } else {
                this.stakingData = {
                    userId: this.userData.id,
                    activeStakes: [],
                    completedStakes: [],
                    totalEarned: 0,
                    totalStaked: 0,
                    totalProfit: 0
                };
                
                await stakingRef.set(this.stakingData);
            }
        } catch (error) {
            console.error('❌ Error loading staking data:', error);
        }
    }
    
    async loadReferralData() {
        if (!db) return;
        
        try {
            const referralRef = db.collection('referrals').doc(this.userData.id);
            const referralDoc = await referralRef.get();
            
            if (referralDoc.exists) {
                this.referralData = referralDoc.data();
            } else {
                this.referralData = {
                    userId: this.userData.id,
                    code: this.userData.referralCode,
                    referrals: [],
                    totalCount: 0,
                    earned: 0,
                    claimedMilestones: [],
                    lastReferral: null
                };
                
                await referralRef.set(this.referralData);
            }
        } catch (error) {
            console.error('❌ Error loading referral data:', error);
        }
    }
    
    async saveUserData() {
        if (this.isProcessing || !this.userData.isInitialized) return;
        
        this.isProcessing = true;
        
        try {
            // Update last active timestamp
            this.userData.lastActive = new Date().toISOString();
            
            if (db) {
                // Save to Firebase
                await db.collection('users').doc(this.userData.id).update({
                    balance: this.userData.balance,
                    totalEarned: this.userData.totalEarned,
                    miningLevel: this.userData.miningLevel,
                    referralCount: this.userData.referralCount,
                    referralEarnings: this.userData.referralEarnings,
                    lastActive: this.userData.lastActive
                });
                
                // Save wallet data
                if (this.walletData) {
                    await db.collection('wallets').doc(this.userData.id).update({
                        AMSK: this.walletData.AMSK,
                        USDT: this.walletData.USDT,
                        BNB: this.walletData.BNB,
                        TON: this.walletData.TON,
                        lastUpdate: new Date().toISOString()
                    });
                }
                
                // Save mining data
                if (this.miningData) {
                    await db.collection('mining').doc(this.userData.id).update({
                        ...this.miningData,
                        lastUpdate: new Date().toISOString()
                    });
                }
                
                console.log('💾 Data saved to Firebase');
            }
            
            // Also save to localStorage as backup
            this.saveToLocalStorage();
            
        } catch (error) {
            console.error('❌ Error saving user data:', error);
        } finally {
            this.isProcessing = false;
        }
    }
    
    async loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem(`alien_musk_${this.userData.id}`);
            
            if (savedData) {
                const parsed = JSON.parse(savedData);
                this.userData = { ...this.userData, ...parsed.userData, isInitialized: true };
                this.walletData = parsed.walletData;
                this.miningData = parsed.miningData;
                this.stakingData = parsed.stakingData;
                this.referralData = parsed.referralData;
                
                console.log('📂 Data loaded from localStorage');
            } else {
                // Initialize with default data
                this.initializeDefaultData();
            }
        } catch (error) {
            console.error('❌ Error loading from localStorage:', error);
            this.initializeDefaultData();
        }
    }
    
    saveToLocalStorage() {
        try {
            const dataToSave = {
                userData: this.userData,
                walletData: this.walletData,
                miningData: this.miningData,
                stakingData: this.stakingData,
                referralData: this.referralData,
                saveTime: Date.now()
            };
            
            localStorage.setItem(`alien_musk_${this.userData.id}`, JSON.stringify(dataToSave));
        } catch (error) {
            console.error('❌ Error saving to localStorage:', error);
        }
    }
    
    initializeDefaultData() {
        this.userData.balance = 2500;
        this.userData.totalEarned = 2500;
        this.userData.miningLevel = 1;
        this.userData.referralCount = 0;
        this.userData.referralEarnings = 0;
        this.userData.isInitialized = true;
        
        this.walletData = {
            AMSK: 2500,
            USDT: 100,
            BNB: 0.5,
            TON: 50
        };
        
        this.miningData = {
            level: 1,
            isActive: true,
            lastReward: Date.now(),
            nextReward: Date.now() + CONFIG.MINING.DURATION,
            totalMined: 2500,
            minedToday: 2500,
            activeBoosters: []
        };
        
        this.stakingData = {
            activeStakes: [],
            totalEarned: 0
        };
        
        this.referralData = {
            code: this.userData.referralCode,
            referrals: [],
            totalCount: 0,
            earned: 0
        };
    }
    
    // ============================================
    // UI UPDATES
    // ============================================
    initUI() {
        // Update user information
        this.updateUserInfo();
        
        // Update all pages
        this.updateHeader();
        this.updateHomePage();
        this.updateStakingPage();
        this.updateWalletPage();
        
        // Show home page
        this.showPage('home');
        
        // Update loading progress
        this.updateLoadingProgress(100);
    }
    
    updateUserInfo() {
        if (this.elements.username) {
            this.elements.username.textContent = this.userData.firstName;
        }
        
        if (this.elements.userId) {
            this.elements.userId.textContent = `ID: ${this.userData.id.substring(0, 8)}`;
        }
        
        if (this.elements.refCode) {
            this.elements.refCode.textContent = this.userData.referralCode;
        }
        
        // Update avatars
        [this.elements.userAvatar, this.elements.homeAvatar].forEach(avatar => {
            if (avatar) {
                avatar.src = this.userData.photoUrl;
                avatar.alt = this.userData.firstName;
            }
        });
    }
    
    updateHeader() {
        // Update total balance in USD
        if (this.elements.headerBalance) {
            const totalUSD = this.calculateTotalBalanceUSD();
            this.elements.headerBalance.textContent = `$${this.formatNumber(totalUSD, 2)}`;
        }
    }
    
    updateHomePage() {
        // Update total AMSK balance
        if (this.elements.totalAmsk) {
            this.elements.totalAmsk.textContent = this.formatNumber(this.userData.balance);
        }
        
        if (this.elements.usdEquivalent) {
            const usdValue = this.userData.balance * CONFIG.PRICES.AMSK;
            this.elements.usdEquivalent.textContent = this.formatNumber(usdValue, 2);
        }
        
        // Update mining information
        const miningLevel = CONFIG.MINING.LEVELS[this.userData.miningLevel];
        if (this.elements.currentHashrate) {
            let hashrate = miningLevel.hashrate;
            
            // Apply booster multipliers
            if (this.miningData && this.miningData.activeBoosters) {
                this.miningData.activeBoosters.forEach(booster => {
                    const boosterConfig = CONFIG.BOOSTERS[booster.type];
                    if (boosterConfig) {
                        hashrate *= boosterConfig.multiplier;
                    }
                });
            }
            
            this.elements.currentHashrate.textContent = this.formatNumber(hashrate);
        }
        
        if (this.elements.nextReward) {
            let reward = miningLevel.reward;
            
            // Apply booster multipliers
            if (this.miningData && this.miningData.activeBoosters) {
                this.miningData.activeBoosters.forEach(booster => {
                    const boosterConfig = CONFIG.BOOSTERS[booster.type];
                    if (boosterConfig) {
                        reward *= boosterConfig.multiplier;
                    }
                });
            }
            
            this.elements.nextReward.textContent = this.formatNumber(reward);
        }
        
        // Update mining stats
        if (this.elements.minedToday) {
            this.elements.minedToday.textContent = this.formatNumber(this.userData.minedToday || 0);
        }
        
        if (this.elements.totalMined) {
            this.elements.totalMined.textContent = this.formatNumber(this.userData.totalEarned || 0);
        }
        
        if (this.elements.stakingEarned) {
            this.elements.stakingEarned.textContent = this.formatNumber(this.stakingData?.totalEarned || 0);
        }
        
        if (this.elements.miningLevel) {
            this.elements.miningLevel.textContent = this.userData.miningLevel;
        }
        
        // Update mining button
        this.updateMiningButton();
        
        // Update referral information
        this.updateReferralInfo();
        
        // Update mining levels display
        this.updateMiningLevels();
        
        // Update boosters display
        this.updateBoostersDisplay();
    }
    
    updateMiningButton() {
        const button = this.elements.startMiningBtn;
        if (!button || !this.miningData) return;
        
        const now = Date.now();
        const isRewardReady = now >= this.miningData.nextReward;
        
        if (!this.miningData.isActive) {
            button.innerHTML = '<i class="fas fa-play"></i><span>Activate Quantum Core</span>';
            button.disabled = false;
            button.classList.remove('claim-mode');
        } else if (isRewardReady) {
            button.innerHTML = '<i class="fas fa-gift"></i><span>Claim Reward</span>';
            button.disabled = false;
            button.classList.add('claim-mode');
        } else {
            button.innerHTML = '<i class="fas fa-clock"></i><span>Mining...</span>';
            button.disabled = true;
            button.classList.remove('claim-mode');
        }
    }
    
    updateMiningLevels() {
        if (!this.elements.upgradeCards) return;
        
        this.elements.upgradeCards.forEach(card => {
            const level = parseInt(card.dataset.level);
            const levelData = CONFIG.MINING.LEVELS[level];
            const isCurrentLevel = level === this.userData.miningLevel;
            const canAfford = this.walletData?.USDT >= levelData.cost;
            
            const button = card.querySelector('.upgrade-btn');
            if (!button) return;
            
            if (isCurrentLevel) {
                button.textContent = 'Active';
                button.classList.add('active-btn');
                button.disabled = true;
                card.classList.add('active');
            } else if (level < this.userData.miningLevel) {
                button.textContent = 'Upgraded';
                button.classList.add('active-btn');
                button.disabled = true;
                card.classList.remove('active');
            } else {
                button.textContent = canAfford ? 'Upgrade' : `${levelData.cost} USDT`;
                button.disabled = !canAfford;
                button.classList.remove('active-btn');
                card.classList.remove('active');
            }
        });
    }
    
    updateBoostersDisplay() {
        if (!this.elements.boosterCards) return;
        
        this.elements.boosterCards.forEach(card => {
            const boosterType = card.dataset.booster;
            const booster = CONFIG.BOOSTERS[boosterType];
            
            if (!booster) return;
            
            const button = card.querySelector('.booster-btn');
            if (!button) return;
            
            // Check if booster is already active
            const isActive = this.miningData?.activeBoosters?.some(b => b.type === boosterType) || false;
            const canAfford = this.walletData?.AMSK >= booster.price;
            
            if (isActive) {
                button.textContent = 'Active';
                button.disabled = true;
                button.classList.add('active-btn');
                card.classList.add('active');
            } else {
                button.textContent = canAfford ? 'Activate' : `${this.formatNumber(booster.price)} AMSK`;
                button.disabled = !canAfford;
                button.classList.remove('active-btn');
                card.classList.remove('active');
            }
        });
    }
    
    updateReferralInfo() {
        if (!this.referralData) return;
        
        if (this.elements.refCount) {
            this.elements.refCount.textContent = this.referralData.totalCount || 0;
        }
        
        if (this.elements.totalRefs) {
            this.elements.totalRefs.textContent = this.referralData.totalCount || 0;
        }
        
        if (this.elements.refEarned) {
            this.elements.refEarned.textContent = `${this.formatNumber(this.referralData.earned || 0)} AMSK`;
        }
        
        // Find next milestone
        let nextMilestone = null;
        for (const milestone of CONFIG.REFERRAL.MILESTONES) {
            if ((this.referralData.totalCount || 0) < milestone.referrals) {
                nextMilestone = milestone;
                break;
            }
        }
        
        if (nextMilestone && this.elements.nextGoal && this.elements.goalReward) {
            this.elements.nextGoal.textContent = `${nextMilestone.referrals} Referrals`;
            this.elements.goalReward.textContent = `${this.formatNumber(nextMilestone.reward)} AMSK`;
            
            // Update progress
            const progress = Math.min(((this.referralData.totalCount || 0) / nextMilestone.referrals) * 100, 100);
            
            if (this.elements.progressText) {
                this.elements.progressText.textContent = `${Math.round(progress)}%`;
            }
            
            if (this.elements.progressFill) {
                this.elements.progressFill.style.width = `${progress}%`;
            }
        }
    }
    
    updateStakingPage() {
        if (!this.elements.activeStakesList || !this.stakingData) return;
        
        const stakes = this.stakingData.activeStakes || [];
        
        if (stakes.length === 0) {
            this.elements.activeStakesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No active stakes</p>
                    <small class="empty-sub">Start staking to earn rewards</small>
                </div>
            `;
            return;
        }
        
        let html = '';
        stakes.forEach((stake, index) => {
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
                        <div class="stake-plan">
                            <div class="plan-icon">
                                <i class="fas fa-gem"></i>
                            </div>
                            <div class="plan-info">
                                <h5>${plan.name}</h5>
                                <span class="stake-amount">${plan.amount} USDT</span>
                            </div>
                        </div>
                        <div class="stake-status">
                            <span class="status-badge active">Active</span>
                        </div>
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
                    
                    <div class="stake-reward-info">
                        <div class="reward-item">
                            <i class="fas fa-coins"></i>
                            <span>Daily: ${plan.dailyReward} AMSK</span>
                        </div>
                        <div class="reward-item">
                            <i class="fas fa-percentage"></i>
                            <span>APR: ${plan.apr}%</span>
                        </div>
                    </div>
                    
                    <div class="stake-actions">
                        <button class="claim-btn" onclick="app.claimStakeReward(${index})" ${progress < 100 ? 'disabled' : ''}>
                            <i class="fas fa-gift"></i>
                            Claim Rewards
                        </button>
                    </div>
                </div>
            `;
        });
        
        this.elements.activeStakesList.innerHTML = html;
    }
    
    updateWalletPage() {
        if (!this.walletData) return;
        
        // Update AMSK balance
        if (this.elements.walletAmsk) {
            this.elements.walletAmsk.textContent = this.formatNumber(this.walletData.AMSK);
        }
        
        if (this.elements.walletAmskValue) {
            const usdValue = this.walletData.AMSK * CONFIG.PRICES.AMSK;
            this.elements.walletAmskValue.textContent = this.formatNumber(usdValue, 2);
        }
        
        // Update USDT balance
        if (this.elements.walletUsdt) {
            this.elements.walletUsdt.textContent = this.formatNumber(this.walletData.USDT, 2);
        }
        
        if (this.elements.walletUsdtValue) {
            this.elements.walletUsdtValue.textContent = this.formatNumber(this.walletData.USDT, 2);
        }
        
        // Update total portfolio
        if (this.elements.walletTotalAmsk) {
            this.elements.walletTotalAmsk.textContent = this.formatNumber(this.userData.balance);
        }
        
        if (this.elements.walletTotalUsd) {
            const totalUSD = this.calculateTotalBalanceUSD();
            this.elements.walletTotalUsd.textContent = this.formatNumber(totalUSD, 2);
        }
    }
    
    // ============================================
    // PAGE MANAGEMENT
    // ============================================
    showPage(pageName) {
        if (this.currentPage === pageName) return;
        
        console.log(`📱 Switching to page: ${pageName}`);
        
        // Hide all pages
        this.elements.pages.forEach(page => {
            page.style.display = 'none';
            page.classList.remove('active');
        });
        
        // Update navigation buttons
        this.elements.navButtons.forEach(btn => {
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
        
        this.currentPage = pageName;
        
        // Update page-specific content
        switch (pageName) {
            case 'home':
                this.updateHomePage();
                break;
            case 'staking':
                this.updateStakingPage();
                break;
            case 'wallet':
                this.updateWalletPage();
                break;
        }
    }
    
    // ============================================
    // MINING SYSTEM
    // ============================================
    handleMining() {
        if (!this.miningData || !this.miningData.isActive) {
            this.startMining();
            return;
        }
        
        const now = Date.now();
        if (now >= this.miningData.nextReward) {
            this.claimMiningReward();
        } else {
            this.showNotification('⏳ Mining in progress. Reward not ready yet.', 'info');
        }
    }
    
    startMining() {
        if (!this.miningData) return;
        
        this.miningData.isActive = true;
        this.miningData.lastReward = Date.now();
        this.miningData.nextReward = Date.now() + CONFIG.MINING.DURATION;
        
        this.updateMiningButton();
        this.updateHomePage();
        
        this.showNotification('⚡ Quantum mining started!', 'success');
        this.saveUserData();
    }
    
    claimMiningReward() {
        if (!this.miningData || !this.userData || !this.walletData) return;
        
        const miningLevel = CONFIG.MINING.LEVELS[this.userData.miningLevel];
        let reward = miningLevel.reward;
        
        // Apply active boosters
        if (this.miningData.activeBoosters) {
            this.miningData.activeBoosters.forEach(booster => {
                const boosterConfig = CONFIG.BOOSTERS[booster.type];
                if (boosterConfig) {
                    reward *= boosterConfig.multiplier;
                }
            });
        }
        
        // Update balances
        this.userData.balance += reward;
        this.userData.totalEarned += reward;
        this.userData.minedToday = (this.userData.minedToday || 0) + reward;
        
        this.walletData.AMSK = this.userData.balance;
        
        if (this.miningData) {
            this.miningData.totalMined += reward;
            this.miningData.lastReward = Date.now();
            this.miningData.nextReward = Date.now() + CONFIG.MINING.DURATION;
        }
        
        // Update UI
        this.updateHomePage();
        this.updateWalletPage();
        this.updateHeader();
        
        // Show success message
        this.showNotification(`💰 +${this.formatNumber(reward)} AMSK mined!`, 'success');
        
        // Save data
        this.saveUserData();
    }
    
    upgradeMining(level) {
        level = parseInt(level);
        const levelData = CONFIG.MINING.LEVELS[level];
        
        if (!levelData) {
            this.showNotification('Invalid mining level', 'error');
            return;
        }
        
        if (level <= this.userData.miningLevel) {
            this.showNotification('Already at or above this level!', 'warning');
            return;
        }
        
        if (this.walletData.USDT < levelData.cost) {
            this.showNotification(`Insufficient USDT. Need ${levelData.cost} USDT.`, 'error');
            return;
        }
        
        // Deduct cost and upgrade
        this.walletData.USDT -= levelData.cost;
        this.userData.miningLevel = level;
        
        // Update UI
        this.updateHomePage();
        this.updateWalletPage();
        this.updateHeader();
        this.updateMiningLevels();
        
        // Show success
        this.showNotification(`⚡ Upgraded to ${levelData.name} level!`, 'success');
        
        // Save data
        this.saveUserData();
    }
    
    activateBooster(boosterType) {
        const booster = CONFIG.BOOSTERS[boosterType];
        
        if (!booster) {
            this.showNotification('Booster not found!', 'error');
            return;
        }
        
        // Check if already has this booster active
        const hasBooster = this.miningData?.activeBoosters?.some(b => b.type === boosterType);
        if (hasBooster) {
            this.showNotification('This booster is already active!', 'warning');
            return;
        }
        
        // Check balance
        if (this.walletData.AMSK < booster.price) {
            this.showNotification(`Insufficient AMSK. Need ${booster.price} AMSK.`, 'error');
            return;
        }
        
        // Deduct price
        this.walletData.AMSK -= booster.price;
        this.userData.balance = this.walletData.AMSK;
        
        // Add booster
        if (!this.miningData.activeBoosters) {
            this.miningData.activeBoosters = [];
        }
        
        this.miningData.activeBoosters.push({
            type: boosterType,
            multiplier: booster.multiplier,
            activatedAt: Date.now(),
            expiresAt: Date.now() + booster.duration
        });
        
        // Update UI
        this.updateHomePage();
        this.updateWalletPage();
        this.updateHeader();
        this.updateBoostersDisplay();
        
        // Show success
        this.showNotification(`⚡ ${booster.name} activated! Mining speed ×${booster.multiplier}`, 'success');
        
        // Save data
        this.saveUserData();
    }
    
    // ============================================
    // STAKING SYSTEM
    // ============================================
    async openStakeModal(planId) {
        const plan = CONFIG.STAKING.PLANS[planId];
        if (!plan) return;
        
        const modalContent = `
            <div class="stake-modal-content">
                <div class="selected-plan">
                    <div class="plan-header">
                        <div class="plan-icon">
                            <i class="fas fa-gem"></i>
                        </div>
                        <div class="plan-info">
                            <h4>${plan.name}</h4>
                            <div class="plan-minimum">Minimum: ${plan.amount} USDT</div>
                        </div>
                    </div>
                </div>
                
                <div class="stake-details">
                    <div class="detail-item">
                        <span>Stake Amount:</span>
                        <span>${plan.amount} USDT</span>
                    </div>
                    <div class="detail-item">
                        <span>Duration:</span>
                        <span>${plan.duration} Days</span>
                    </div>
                    <div class="detail-item">
                        <span>APR:</span>
                        <span>${plan.apr}%</span>
                    </div>
                    <div class="detail-item">
                        <span>Daily Reward:</span>
                        <span>${plan.dailyReward} AMSK</span>
                    </div>
                    <div class="detail-item total">
                        <span>Total Reward:</span>
                        <span>${plan.dailyReward * plan.duration} AMSK</span>
                    </div>
                </div>
                
                <div class="stake-warning">
                    <i class="fas fa-info-circle"></i>
                    <span>Your USDT will be locked for ${plan.duration} days</span>
                </div>
                
                <div class="modal-actions">
                    <button class="modal-btn secondary" onclick="app.closeModal()">
                        Cancel
                    </button>
                    <button class="modal-btn primary" onclick="app.confirmStaking(${planId})">
                        Confirm Stake
                    </button>
                </div>
            </div>
        `;
        
        this.openModal('stake-modal', modalContent);
    }
    
    async confirmStaking(planId) {
        const plan = CONFIG.STAKING.PLANS[planId];
        if (!plan || !this.walletData || !this.stakingData) return;
        
        // Check balance
        if (this.walletData.USDT < plan.amount) {
            this.showNotification('Insufficient USDT balance', 'error');
            return;
        }
        
        try {
            // Deduct USDT from wallet
            this.walletData.USDT -= plan.amount;
            
            // Create stake object
            const stake = {
                planId: planId,
                amount: plan.amount,
                startTime: Date.now(),
                duration: plan.duration,
                dailyReward: plan.dailyReward,
                claimedRewards: 0,
                status: 'active'
            };
            
            // Add to active stakes
            if (!this.stakingData.activeStakes) {
                this.stakingData.activeStakes = [];
            }
            this.stakingData.activeStakes.push(stake);
            
            // Update total staked amount
            this.stakingData.totalStaked = (this.stakingData.totalStaked || 0) + plan.amount;
            
            // Update UI
            this.updateWalletPage();
            this.updateStakingPage();
            this.updateHeader();
            
            // Close modal
            this.closeModal();
            
            // Show success message
            this.showNotification(`✅ Staked ${plan.amount} USDT for ${plan.duration} days!`, 'success');
            
            // Save to Firebase
            if (db) {
                await db.collection('staking').doc(this.userData.id).update({
                    activeStakes: this.stakingData.activeStakes,
                    totalStaked: this.stakingData.totalStaked,
                    lastUpdate: new Date().toISOString()
                });
                
                await db.collection('users').doc(this.userData.id).update({
                    usdtBalance: this.walletData.USDT
                });
            }
            
            // Save local data
            this.saveUserData();
            
        } catch (error) {
            console.error('❌ Error confirming stake:', error);
            this.showNotification('Error processing stake. Please try again.', 'error');
        }
    }
    
    async claimStakeReward(stakeIndex) {
        if (!this.stakingData || !this.stakingData.activeStakes || !this.stakingData.activeStakes[stakeIndex]) {
            this.showNotification('Stake not found', 'error');
            return;
        }
        
        const stake = this.stakingData.activeStakes[stakeIndex];
        const plan = CONFIG.STAKING.PLANS[stake.planId];
        
        if (!plan) {
            this.showNotification('Plan not found', 'error');
            return;
        }
        
        const now = Date.now();
        const startTime = stake.startTime;
        const durationMs = plan.duration * 24 * 60 * 60 * 1000;
        const endTime = startTime + durationMs;
        
        // Check if stake period is over
        if (now < endTime) {
            this.showNotification('Stake period not completed yet', 'warning');
            return;
        }
        
        // Calculate total reward
        const totalReward = plan.dailyReward * plan.duration;
        
        // Update balances
        this.userData.balance += totalReward;
        this.walletData.AMSK = this.userData.balance;
        this.stakingData.totalEarned = (this.stakingData.totalEarned || 0) + totalReward;
        
        // Return staked amount
        this.walletData.USDT += stake.amount;
        
        // Remove from active stakes
        this.stakingData.activeStakes.splice(stakeIndex, 1);
        
        // Add to completed stakes
        if (!this.stakingData.completedStakes) {
            this.stakingData.completedStakes = [];
        }
        this.stakingData.completedStakes.push({
            ...stake,
            completedAt: now,
            totalReward: totalReward
        });
        
        // Update UI
        this.updateWalletPage();
        this.updateStakingPage();
        this.updateHomePage();
        this.updateHeader();
        
        // Show success
        this.showNotification(`💰 Claimed ${totalReward} AMSK from staking! +${stake.amount} USDT returned`, 'success');
        
        // Save data
        await this.saveUserData();
    }
    
    // ============================================
    // WALLET SYSTEM
    // ============================================
    openDepositModal(currency = 'USDT') {
        const minDeposit = currency === 'USDT' ? CONFIG.WALLET.MIN_DEPOSIT_USDT : 
                          currency === 'BNB' ? 0.02 : 1;
        
        const modalContent = `
            <div class="deposit-modal-content">
                <div class="deposit-info">
                    <h4><i class="fas fa-download"></i> Deposit ${currency}</h4>
                    <p class="deposit-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        Send only <strong>${currency}</strong> to this address on <strong>BEP20</strong> network
                    </p>
                    
                    <div class="address-card">
                        <div class="address-header">
                            <i class="fas fa-wallet"></i>
                            <span>Your ${currency} Deposit Address</span>
                        </div>
                        <div class="address-display">
                            <code id="depositAddress">${CONFIG.WALLET.DEPOSIT_ADDRESS}</code>
                            <button class="copy-btn" onclick="app.copyToClipboard('${CONFIG.WALLET.DEPOSIT_ADDRESS}')">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                        </div>
                        <div class="network-info">
                            <i class="fas fa-network-wired"></i>
                            <span>Minimum deposit: ${minDeposit} ${currency}</span>
                        </div>
                    </div>
                    
                    <div class="deposit-instructions">
                        <h5><i class="fas fa-graduation-cap"></i> How to Deposit:</h5>
                        <ol>
                            <li>Copy the ${currency} address above</li>
                            <li>Send ${currency} from your wallet (BEP20 network only)</li>
                            <li>Wait for transaction confirmation</li>
                            <li>Your balance will update automatically</li>
                        </ol>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="modal-btn" onclick="app.closeModal()">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.openModal('deposit-modal', modalContent);
    }
    
    openWithdrawModal() {
        const modalContent = `
            <div class="withdraw-modal-content">
                <div class="withdraw-info">
                    <h4><i class="fas fa-upload"></i> Withdraw USDT</h4>
                    
                    <div class="balance-display">
                        <div class="balance-item">
                            <i class="fas fa-wallet"></i>
                            <div class="balance-details">
                                <span>Available Balance</span>
                                <span class="balance-amount">${this.formatNumber(this.walletData.USDT, 2)} USDT</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="withdraw-form">
                        <div class="form-group">
                            <label for="withdrawAmount">Amount (USDT)</label>
                            <input type="number" 
                                   id="withdrawAmount" 
                                   value="${Math.max(CONFIG.WALLET.MIN_WITHDRAWAL, Math.min(50, this.walletData.USDT)).toFixed(2)}"
                                   min="${CONFIG.WALLET.MIN_WITHDRAWAL}"
                                   max="${this.walletData.USDT}"
                                   step="0.01">
                        </div>
                        
                        <div class="form-group">
                            <label for="withdrawAddress">Wallet Address (BEP20)</label>
                            <input type="text" 
                                   id="withdrawAddress" 
                                   placeholder="0x..."
                                   maxlength="42">
                        </div>
                        
                        <div class="fee-info">
                            <i class="fas fa-info-circle"></i>
                            <span>Network fee: ${CONFIG.WALLET.WITHDRAWAL_FEE} BNB will be deducted</span>
                        </div>
                        
                        <div class="requirements">
                            <div class="requirement ${this.walletData.USDT >= CONFIG.WALLET.MIN_WITHDRAWAL ? 'met' : 'not-met'}">
                                <i class="fas ${this.walletData.USDT >= CONFIG.WALLET.MIN_WITHDRAWAL ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                                <span>Minimum: ${CONFIG.WALLET.MIN_WITHDRAWAL} USDT</span>
                            </div>
                            <div class="requirement ${this.walletData.BNB >= CONFIG.WALLET.WITHDRAWAL_FEE ? 'met' : 'not-met'}">
                                <i class="fas ${this.walletData.BNB >= CONFIG.WALLET.WITHDRAWAL_FEE ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                                <span>BNB fee: ${CONFIG.WALLET.WITHDRAWAL_FEE} BNB available</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="modal-btn secondary" onclick="app.closeModal()">
                            Cancel
                        </button>
                        <button class="modal-btn primary" onclick="app.submitWithdrawal()">
                            Submit Withdrawal
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.openModal('withdraw-modal', modalContent);
    }
    
    async submitWithdrawal() {
        const amount = parseFloat(document.getElementById('withdrawAmount')?.value);
        const address = document.getElementById('withdrawAddress')?.value.trim();
        
        // Validation
        if (!amount || amount < CONFIG.WALLET.MIN_WITHDRAWAL) {
            this.showNotification(`Minimum withdrawal is ${CONFIG.WALLET.MIN_WITHDRAWAL} USDT`, 'error');
            return;
        }
        
        if (amount > this.walletData.USDT) {
            this.showNotification('Insufficient USDT balance', 'error');
            return;
        }
        
        if (!address || !address.startsWith('0x') || address.length !== 42) {
            this.showNotification('Please enter a valid BEP20 wallet address', 'error');
            return;
        }
        
        if (this.walletData.BNB < CONFIG.WALLET.WITHDRAWAL_FEE) {
            this.showNotification(`Insufficient BNB for network fee. Need ${CONFIG.WALLET.WITHDRAWAL_FEE} BNB`, 'error');
            return;
        }
        
        try {
            // Create withdrawal request
            const withdrawal = {
                id: `withdraw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId: this.userData.id,
                username: this.userData.username,
                amount: amount,
                address: address,
                currency: 'USDT',
                fee: CONFIG.WALLET.WITHDRAWAL_FEE,
                status: 'pending',
                timestamp: Date.now(),
                note: 'Awaiting manual processing'
            };
            
            // Save to Firebase
            if (db) {
                await db.collection('withdrawals').add({
                    ...withdrawal,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Update user balance immediately
                this.walletData.USDT -= amount;
                this.walletData.BNB -= CONFIG.WALLET.WITHDRAWAL_FEE;
                
                await db.collection('users').doc(this.userData.id).update({
                    usdtBalance: this.walletData.USDT,
                    bnbBalance: this.walletData.BNB
                });
            }
            
            // Update local state
            this.walletData.totalWithdrawn = (this.walletData.totalWithdrawn || 0) + amount;
            
            // Update UI
            this.updateWalletPage();
            this.updateHeader();
            
            // Close modal
            this.closeModal();
            
            // Show success
            this.showNotification(`✅ Withdrawal request submitted for ${amount} USDT`, 'success');
            this.showNotification('⏳ Your withdrawal is pending manual review', 'info');
            
            // Save data
            this.saveUserData();
            
        } catch (error) {
            console.error('❌ Error submitting withdrawal:', error);
            this.showNotification('Error processing withdrawal. Please try again.', 'error');
        }
    }
    
    openSwapModal() {
        const modalContent = `
            <div class="swap-modal-content">
                <div class="swap-header">
                    <h4><i class="fas fa-exchange-alt"></i> Swap Tokens</h4>
                </div>
                
                <div class="swap-form">
                    <div class="swap-from">
                        <div class="swap-label">
                            <span>From</span>
                            <span class="balance">Balance: ${this.formatNumber(this.walletData.AMSK)} AMSK</span>
                        </div>
                        <div class="swap-input-group">
                            <select id="swapFromCurrency">
                                <option value="AMSK">AMSK</option>
                                <option value="USDT">USDT</option>
                            </select>
                            <input type="number" 
                                   id="swapFromAmount" 
                                   placeholder="0"
                                   min="1000"
                                   oninput="app.calculateSwap()">
                        </div>
                    </div>
                    
                    <div class="swap-arrow">
                        <i class="fas fa-exchange-alt"></i>
                    </div>
                    
                    <div class="swap-to">
                        <div class="swap-label">
                            <span>To</span>
                            <span class="balance">Balance: ${this.formatNumber(this.walletData.USDT, 2)} USDT</span>
                        </div>
                        <div class="swap-input-group">
                            <select id="swapToCurrency">
                                <option value="USDT">USDT</option>
                                <option value="AMSK">AMSK</option>
                            </select>
                            <div id="swapResult">0.00</div>
                        </div>
                    </div>
                    
                    <div class="swap-info">
                        <div class="swap-rate">
                            <i class="fas fa-chart-line"></i>
                            <span>Rate: 1 AMSK = ${CONFIG.PRICES.AMSK} USDT</span>
                        </div>
                        <div class="swap-fee">
                            <i class="fas fa-percentage"></i>
                            <span>Fee: 1%</span>
                        </div>
                    </div>
                    
                    <div class="swap-preview">
                        <div class="preview-item">
                            <span>You Send:</span>
                            <span id="previewSend">0 AMSK</span>
                        </div>
                        <div class="preview-item">
                            <span>You Receive:</span>
                            <span id="previewReceive">0.00 USDT</span>
                        </div>
                        <div class="preview-item total">
                            <span>Total Receive:</span>
                            <span id="previewTotal">0.00 USDT</span>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="modal-btn secondary" onclick="app.closeModal()">
                            Cancel
                        </button>
                        <button class="modal-btn primary" onclick="app.executeSwap()">
                            Confirm Swap
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.openModal('swap-modal', modalContent);
    }
    
    calculateSwap() {
        const fromCurrency = document.getElementById('swapFromCurrency')?.value;
        const toCurrency = document.getElementById('swapToCurrency')?.value;
        const amount = parseFloat(document.getElementById('swapFromAmount')?.value) || 0;
        
        if (!fromCurrency || !toCurrency || amount <= 0) return;
        
        let result = 0;
        
        if (fromCurrency === 'AMSK' && toCurrency === 'USDT') {
            result = amount * CONFIG.PRICES.AMSK * 0.99; // 1% fee
        } else if (fromCurrency === 'USDT' && toCurrency === 'AMSK') {
            result = amount / CONFIG.PRICES.AMSK * 0.99; // 1% fee
        }
        
        // Update display
        if (document.getElementById('swapResult')) {
            document.getElementById('swapResult').textContent = result.toFixed(toCurrency === 'USDT' ? 2 : 0);
        }
        
        if (document.getElementById('previewSend')) {
            document.getElementById('previewSend').textContent = `${this.formatNumber(amount)} ${fromCurrency}`;
        }
        
        if (document.getElementById('previewReceive')) {
            document.getElementById('previewReceive').textContent = `${result.toFixed(toCurrency === 'USDT' ? 2 : 0)} ${toCurrency}`;
        }
        
        if (document.getElementById('previewTotal')) {
            document.getElementById('previewTotal').textContent = `${result.toFixed(toCurrency === 'USDT' ? 2 : 0)} ${toCurrency}`;
        }
    }
    
    async executeSwap() {
        const fromCurrency = document.getElementById('swapFromCurrency')?.value;
        const toCurrency = document.getElementById('swapToCurrency')?.value;
        const amount = parseFloat(document.getElementById('swapFromAmount')?.value) || 0;
        
        if (!fromCurrency || !toCurrency || amount <= 0) {
            this.showNotification('Please enter valid amount', 'error');
            return;
        }
        
        // Calculate swap
        let fromBalance = this.walletData[fromCurrency];
        let toReceive = 0;
        
        if (fromCurrency === 'AMSK' && toCurrency === 'USDT') {
            toReceive = amount * CONFIG.PRICES.AMSK * 0.99; // 1% fee
            fromBalance = this.walletData.AMSK;
        } else if (fromCurrency === 'USDT' && toCurrency === 'AMSK') {
            toReceive = amount / CONFIG.PRICES.AMSK * 0.99; // 1% fee
            fromBalance = this.walletData.USDT;
        }
        
        // Check balance
        if (amount > fromBalance) {
            this.showNotification('Insufficient balance', 'error');
            return;
        }
        
        // Minimum swap amount for AMSK
        if (fromCurrency === 'AMSK' && amount < 250000) {
            this.showNotification('Minimum swap is 250,000 AMSK', 'error');
            return;
        }
        
        try {
            // Execute swap
            this.walletData[fromCurrency] -= amount;
            this.walletData[toCurrency] += toReceive;
            
            // Update user balance if swapping AMSK
            if (fromCurrency === 'AMSK') {
                this.userData.balance = this.walletData.AMSK;
            }
            
            // Update UI
            this.updateWalletPage();
            this.updateHomePage();
            this.updateHeader();
            
            // Close modal
            this.closeModal();
            
            // Show success
            this.showNotification(`✅ Swapped ${this.formatNumber(amount)} ${fromCurrency} to ${toReceive.toFixed(2)} ${toCurrency}`, 'success');
            
            // Save to Firebase
            if (db) {
                await db.collection('users').doc(this.userData.id).update({
                    balance: this.userData.balance,
                    usdtBalance: this.walletData.USDT
                });
            }
            
            // Save data
            this.saveUserData();
            
        } catch (error) {
            console.error('❌ Error executing swap:', error);
            this.showNotification('Error processing swap. Please try again.', 'error');
        }
    }
    
    // ============================================
    // REFERRAL SYSTEM
    // ============================================
    checkReferral() {
        if (!tg || !tg.initDataUnsafe) return;
        
        // Check Telegram start parameter
        if (tg.initDataUnsafe.start_param) {
            const refCode = tg.initDataUnsafe.start_param;
            if (refCode && refCode !== this.userData.referralCode) {
                this.processReferral(refCode);
            }
        }
        
        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const urlRef = urlParams.get('ref') || urlParams.get('start');
        if (urlRef && urlRef !== this.userData.referralCode) {
            this.processReferral(urlRef);
        }
    }
    
    async processReferral(refCode) {
        if (!refCode || refCode === this.userData.referralCode || !this.referralData) return;
        
        // Check if already referred by this code
        if (this.referralData.referrals && this.referralData.referrals.includes(refCode)) {
            return;
        }
        
        try {
            // Add referral
            if (!this.referralData.referrals) {
                this.referralData.referrals = [];
            }
            this.referralData.referrals.push(refCode);
            this.referralData.totalCount = (this.referralData.totalCount || 0) + 1;
            this.referralData.earned = (this.referralData.earned || 0) + CONFIG.REFERRAL.BASE_REWARD;
            this.referralData.lastReferral = Date.now();
            
            // Add referral reward to user
            this.userData.balance += CONFIG.REFERRAL.BASE_REWARD;
            this.userData.totalEarned += CONFIG.REFERRAL.BASE_REWARD;
            this.userData.referralEarnings = (this.userData.referralEarnings || 0) + CONFIG.REFERRAL.BASE_REWARD;
            this.userData.referralCount = (this.userData.referralCount || 0) + 1;
            
            this.walletData.AMSK = this.userData.balance;
            
            // Check for milestone rewards
            this.checkReferralMilestones();
            
            // Update UI
            this.updateHomePage();
            this.updateWalletPage();
            this.updateHeader();
            
            // Show notification
            this.showNotification(`🎉 New referral! +${CONFIG.REFERRAL.BASE_REWARD} AMSK bonus`, 'success');
            
            // Save to Firebase
            if (db) {
                await db.collection('referrals').doc(this.userData.id).update({
                    referrals: this.referralData.referrals,
                    totalCount: this.referralData.totalCount,
                    earned: this.referralData.earned,
                    lastReferral: this.referralData.lastReferral
                });
                
                await db.collection('users').doc(this.userData.id).update({
                    balance: this.userData.balance,
                    totalEarned: this.userData.totalEarned,
                    referralCount: this.userData.referralCount,
                    referralEarnings: this.userData.referralEarnings
                });
            }
            
            // Save data
            this.saveUserData();
            
        } catch (error) {
            console.error('❌ Error processing referral:', error);
        }
    }
    
    checkReferralMilestones() {
        if (!this.referralData || !this.referralData.totalCount) return;
        
        const currentCount = this.referralData.totalCount;
        const claimedMilestones = this.referralData.claimedMilestones || [];
        
        CONFIG.REFERRAL.MILESTONES.forEach(milestone => {
            if (currentCount >= milestone.referrals && !claimedMilestones.includes(milestone.referrals)) {
                this.claimMilestoneReward(milestone);
            }
        });
    }
    
    async claimMilestoneReward(milestone) {
        if (!this.referralData) return;
        
        try {
            // Add milestone reward
            this.userData.balance += milestone.reward;
            this.userData.totalEarned += milestone.reward;
            this.referralData.earned += milestone.reward;
            
            if (!this.referralData.claimedMilestones) {
                this.referralData.claimedMilestones = [];
            }
            this.referralData.claimedMilestones.push(milestone.referrals);
            
            this.walletData.AMSK = this.userData.balance;
            
            // Update UI
            this.updateHomePage();
            this.updateWalletPage();
            this.updateHeader();
            
            // Show notification
            this.showNotification(`🏆 Reached ${milestone.referrals} referrals! +${this.formatNumber(milestone.reward)} AMSK`, 'success');
            
            // Save to Firebase
            if (db) {
                await db.collection('referrals').doc(this.userData.id).update({
                    earned: this.referralData.earned,
                    claimedMilestones: this.referralData.claimedMilestones
                });
                
                await db.collection('users').doc(this.userData.id).update({
                    balance: this.userData.balance,
                    totalEarned: this.userData.totalEarned
                });
            }
            
            // Save data
            this.saveUserData();
            
        } catch (error) {
            console.error('❌ Error claiming milestone:', error);
        }
    }
    
    copyReferralCode() {
        this.copyToClipboard(this.userData.referralCode);
        this.showNotification('✅ Referral code copied to clipboard!', 'success');
    }
    
    shareReferral() {
        const link = `https://t.me/AlienMuskBot?start=${this.userData.referralCode}`;
        const message = `🚀 Join Alien Musk Quantum Mining Platform!\n\n⛏️ Mine AMSK tokens with quantum technology\n💰 High staking rewards up to 60% APR\n👥 Use my referral code for bonus: ${this.userData.referralCode}\n\n${link}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Alien Musk - Quantum Mining',
                text: message,
                url: link
            });
        } else {
            this.copyToClipboard(message);
            this.showNotification('✅ Referral message copied! Share it anywhere.', 'info');
        }
    }
    
    // ============================================
    // ADMIN SYSTEM
    // ============================================
    setupAdminAccess() {
        const brandLogo = document.querySelector('.brand-logo');
        if (brandLogo) {
            brandLogo.addEventListener('click', (e) => this.handleAdminClick(e));
        }
    }
    
    handleAdminClick(e) {
        const now = Date.now();
        
        // Reset count if more than 2 seconds passed
        if (now - this.lastAdminClick > 2000) {
            this.adminClickCount = 0;
        }
        
        this.adminClickCount++;
        this.lastAdminClick = now;
        
        // Visual feedback
        if (this.adminClickCount >= 5) {
            e.currentTarget.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.currentTarget.style.transform = 'scale(1)';
            }, 100);
        }
        
        // Show admin login after required clicks
        if (this.adminClickCount >= 10) {
            this.showAdminLogin();
            this.adminClickCount = 0;
        }
    }
    
    showAdminLogin() {
        const modalContent = `
            <div class="admin-login-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-lock"></i> Admin Access</h3>
                    <button class="modal-close" onclick="app.closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="admin-login-form">
                        <div class="login-icon">
                            <i class="fas fa-user-shield"></i>
                        </div>
                        <h4>Administrator Access</h4>
                        <p class="login-subtitle">Enter administrator password</p>
                        
                        <div class="form-group">
                            <input type="password" 
                                   id="adminPassword" 
                                   class="form-input"
                                   placeholder="Enter password">
                        </div>
                        
                        <button class="btn-primary" onclick="app.checkAdminPassword()">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                        
                        <div id="adminError" class="error-message" style="display: none;">
                            <i class="fas fa-exclamation-circle"></i>
                            <span id="adminErrorText"></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.openModal('admin-login', modalContent);
    }
    
    async checkAdminPassword() {
        const password = document.getElementById('adminPassword')?.value;
        const errorDiv = document.getElementById('adminError');
        const errorText = document.getElementById('adminErrorText');
        
        if (!password) {
            if (errorDiv && errorText) {
                errorText.textContent = 'Please enter password';
                errorDiv.style.display = 'block';
            }
            return;
        }
        
        if (password !== CONFIG.ADMIN.PASSWORD) {
            if (errorDiv && errorText) {
                errorText.textContent = 'Incorrect password';
                errorDiv.style.display = 'block';
            }
            return;
        }
        
        // Check Telegram ID
        let telegramUserId = null;
        if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
            telegramUserId = tg.initDataUnsafe.user.id.toString();
        }
        
        if (!telegramUserId || telegramUserId !== CONFIG.ADMIN.TELEGRAM_ID) {
            if (errorDiv && errorText) {
                errorText.textContent = 'Access denied: Invalid Telegram ID';
                errorDiv.style.display = 'block';
            }
            return;
        }
        
        // Grant admin access
        this.isAdmin = true;
        this.closeModal();
        this.showAdminPanel();
        this.showNotification('👑 Admin access granted', 'success');
    }
    
    showAdminPanel() {
        const modalContent = `
            <div class="admin-panel-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-user-shield"></i> Admin Panel</h3>
                    <button class="modal-close" onclick="app.closeModal()">×</button>
                </div>
                
                <div class="modal-body">
                    <div class="admin-tabs">
                        <button class="tab-btn active" onclick="app.switchAdminTab('users')">
                            <i class="fas fa-users"></i> Users
                        </button>
                        <button class="tab-btn" onclick="app.switchAdminTab('deposits')">
                            <i class="fas fa-download"></i> Deposits
                        </button>
                        <button class="tab-btn" onclick="app.switchAdminTab('withdrawals')">
                            <i class="fas fa-upload"></i> Withdrawals
                        </button>
                    </div>
                    
                    <div class="admin-content" id="adminUsersTab">
                        <h4>User Management</h4>
                        <div class="admin-form">
                            <div class="form-group">
                                <input type="text" 
                                       id="adminUserId" 
                                       class="form-input"
                                       placeholder="User ID or Username">
                            </div>
                            <div class="form-group">
                                <input type="number" 
                                       id="adminAmount" 
                                       class="form-input"
                                       placeholder="Amount (AMSK)"
                                       min="1"
                                       step="1">
                            </div>
                            <button class="btn-primary" onclick="app.addUserBalance()">
                                <i class="fas fa-plus-circle"></i> Add Balance to User
                            </button>
                        </div>
                    </div>
                    
                    <div class="admin-content" id="adminDepositsTab" style="display: none;">
                        <h4>Pending Deposits</h4>
                        <div id="pendingDepositsList">
                            <div class="empty-state">
                                <i class="fas fa-inbox"></i>
                                <p>Loading pending deposits...</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="admin-content" id="adminWithdrawalsTab" style="display: none;">
                        <h4>Pending Withdrawals</h4>
                        <div id="pendingWithdrawalsList">
                            <div class="empty-state">
                                <i class="fas fa-inbox"></i>
                                <p>Loading pending withdrawals...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.openModal('admin-panel', modalContent);
        this.loadAdminPendingRequests();
    }
    
    switchAdminTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.admin-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Remove active class from all buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        const tabElement = document.getElementById(`admin${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Tab`);
        if (tabElement) {
            tabElement.style.display = 'block';
        }
        
        // Add active class to clicked button
        const activeButton = Array.from(document.querySelectorAll('.tab-btn')).find(btn => 
            btn.textContent.toLowerCase().includes(tabName)
        );
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        // Load data for the tab
        if (tabName === 'deposits' || tabName === 'withdrawals') {
            this.loadAdminPendingRequests();
        }
    }
    
    async loadAdminPendingRequests() {
        if (!db || !this.isAdmin) return;
        
        try {
            // Load pending deposits
            const depositsQuery = await db.collection('deposit_requests')
                .where('status', '==', 'pending')
                .orderBy('timestamp', 'desc')
                .limit(50)
                .get();
            
            const depositsList = document.getElementById('pendingDepositsList');
            if (depositsList) {
                if (depositsQuery.empty) {
                    depositsList.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-check-circle"></i>
                            <p>No pending deposits</p>
                        </div>
                    `;
                } else {
                    let html = '';
                    depositsQuery.forEach(doc => {
                        const data = doc.data();
                        html += this.createPendingDepositItem(doc.id, data);
                    });
                    depositsList.innerHTML = html;
                }
            }
            
            // Load pending withdrawals
            const withdrawalsQuery = await db.collection('withdrawals')
                .where('status', '==', 'pending')
                .orderBy('timestamp', 'desc')
                .limit(50)
                .get();
            
            const withdrawalsList = document.getElementById('pendingWithdrawalsList');
            if (withdrawalsList) {
                if (withdrawalsQuery.empty) {
                    withdrawalsList.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-check-circle"></i>
                            <p>No pending withdrawals</p>
                        </div>
                    `;
                } else {
                    let html = '';
                    withdrawalsQuery.forEach(doc => {
                        const data = doc.data();
                        html += this.createPendingWithdrawalItem(doc.id, data);
                    });
                    withdrawalsList.innerHTML = html;
                }
            }
            
        } catch (error) {
            console.error('❌ Error loading admin requests:', error);
        }
    }
    
    createPendingDepositItem(docId, data) {
        return `
            <div class="pending-item">
                <div class="pending-info">
                    <div class="pending-user">${data.username || 'User'}</div>
                    <div class="pending-amount">${data.amount} ${data.currency}</div>
                    <div class="pending-tx">TX: ${data.transactionHash?.substring(0, 12)}...</div>
                </div>
                <div class="pending-actions">
                    <button class="btn-success" onclick="app.approveDeposit('${docId}', '${data.userId}', ${data.amount}, '${data.currency}')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn-error" onclick="app.rejectDeposit('${docId}')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            </div>
        `;
    }
    
    createPendingWithdrawalItem(docId, data) {
        return `
            <div class="pending-item">
                <div class="pending-info">
                    <div class="pending-user">${data.username || 'User'}</div>
                    <div class="pending-amount">${data.amount} ${data.currency}</div>
                    <div class="pending-address">To: ${data.address?.substring(0, 12)}...</div>
                </div>
                <div class="pending-actions">
                    <button class="btn-success" onclick="app.approveWithdrawal('${docId}')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn-error" onclick="app.rejectWithdrawal('${docId}')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            </div>
        `;
    }
    
    async addUserBalance() {
        if (!db || !this.isAdmin) return;
        
        const userId = document.getElementById('adminUserId')?.value;
        const amount = parseFloat(document.getElementById('adminAmount')?.value);
        
        if (!userId || !amount || amount <= 0) {
            this.showNotification('Please enter valid user ID and amount', 'error');
            return;
        }
        
        try {
            // Find user by ID or username
            let userRef;
            let userDoc = await db.collection('users').doc(userId).get();
            
            if (userDoc.exists) {
                userRef = db.collection('users').doc(userId);
            } else {
                // Try to find by username
                const querySnapshot = await db.collection('users')
                    .where('username', '==', userId)
                    .limit(1)
                    .get();
                
                if (!querySnapshot.empty) {
                    userRef = db.collection('users').doc(querySnapshot.docs[0].id);
                }
            }
            
            if (!userRef) {
                this.showNotification('User not found', 'error');
                return;
            }
            
            // Add balance to user
            await userRef.update({
                balance: firebase.firestore.FieldValue.increment(amount),
                totalEarned: firebase.firestore.FieldValue.increment(amount)
            });
            
            // Clear inputs
            document.getElementById('adminUserId').value = '';
            document.getElementById('adminAmount').value = '';
            
            this.showNotification(`✅ Added ${amount} AMSK to user`, 'success');
            
        } catch (error) {
            console.error('❌ Error adding user balance:', error);
            this.showNotification('Error adding balance', 'error');
        }
    }
    
    async approveDeposit(docId, userId, amount, currency) {
        if (!db || !this.isAdmin) return;
        
        try {
            // Update deposit status
            await db.collection('deposit_requests').doc(docId).update({
                status: 'approved',
                approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
                approvedBy: 'admin'
            });
            
            // Add balance to user
            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get();
            
            if (userDoc.exists) {
                const updateData = {};
                if (currency === 'USDT') {
                    updateData.usdtBalance = firebase.firestore.FieldValue.increment(amount);
                } else if (currency === 'BNB') {
                    updateData.bnbBalance = firebase.firestore.FieldValue.increment(amount);
                } else if (currency === 'AMSK') {
                    updateData.balance = firebase.firestore.FieldValue.increment(amount);
                    updateData.totalEarned = firebase.firestore.FieldValue.increment(amount);
                }
                
                await userRef.update(updateData);
            }
            
            // Update UI
            this.loadAdminPendingRequests();
            this.showNotification(`✅ Deposit approved: ${amount} ${currency}`, 'success');
            
        } catch (error) {
            console.error('❌ Error approving deposit:', error);
            this.showNotification('Error approving deposit', 'error');
        }
    }
    
    async rejectDeposit(docId) {
        if (!db || !this.isAdmin) return;
        
        const reason = prompt('Enter rejection reason:', 'Invalid transaction');
        if (!reason) return;
        
        try {
            await db.collection('deposit_requests').doc(docId).update({
                status: 'rejected',
                rejectedAt: firebase.firestore.FieldValue.serverTimestamp(),
                rejectedBy: 'admin',
                rejectionReason: reason
            });
            
            this.loadAdminPendingRequests();
            this.showNotification('❌ Deposit rejected', 'warning');
            
        } catch (error) {
            console.error('❌ Error rejecting deposit:', error);
            this.showNotification('Error rejecting deposit', 'error');
        }
    }
    
    async approveWithdrawal(docId) {
        if (!db || !this.isAdmin) return;
        
        try {
            await db.collection('withdrawals').doc(docId).update({
                status: 'completed',
                completedAt: firebase.firestore.FieldValue.serverTimestamp(),
                completedBy: 'admin'
            });
            
            this.loadAdminPendingRequests();
            this.showNotification('✅ Withdrawal approved and marked as paid', 'success');
            
        } catch (error) {
            console.error('❌ Error approving withdrawal:', error);
            this.showNotification('Error approving withdrawal', 'error');
        }
    }
    
    async rejectWithdrawal(docId) {
        if (!db || !this.isAdmin) return;
        
        try {
            const withdrawalDoc = await db.collection('withdrawals').doc(docId).get();
            const withdrawalData = withdrawalDoc.data();
            
            // Refund user
            const userRef = db.collection('users').doc(withdrawalData.userId);
            await userRef.update({
                usdtBalance: firebase.firestore.FieldValue.increment(withdrawalData.amount),
                bnbBalance: firebase.firestore.FieldValue.increment(withdrawalData.fee || 0)
            });
            
            // Update withdrawal status
            await db.collection('withdrawals').doc(docId).update({
                status: 'rejected',
                rejectedAt: firebase.firestore.FieldValue.serverTimestamp(),
                rejectedBy: 'admin',
                rejectionReason: 'Refunded to user'
            });
            
            this.loadAdminPendingRequests();
            this.showNotification('❌ Withdrawal rejected and refunded', 'warning');
            
        } catch (error) {
            console.error('❌ Error rejecting withdrawal:', error);
            this.showNotification('Error rejecting withdrawal', 'error');
        }
    }
    
    // ============================================
    // UI UTILITIES
    // ============================================
    openModal(modalId, content = null) {
        // Close any open modal first
        this.closeModal();
        
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        // Set content if provided
        if (content) {
            const modalBody = modal.querySelector('.modal-body');
            if (modalBody) {
                modalBody.innerHTML = content;
            }
        }
        
        // Show modal and overlay
        this.elements.modalOverlay.classList.add('active');
        modal.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        this.currentModal = modalId;
    }
    
    closeModal() {
        // Hide all modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        
        // Hide overlay
        if (this.elements.modalOverlay) {
            this.elements.modalOverlay.classList.remove('active');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        this.currentModal = null;
    }
    
    showNotification(message, type = 'info') {
        const notificationCenter = document.getElementById('notification-center');
        if (!notificationCenter) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 
                                 type === 'error' ? 'exclamation-circle' : 
                                 type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            </div>
            <div class="notification-content">${message}</div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notificationCenter.appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, CONFIG.UI.NOTIFICATION_DURATION);
    }
    
    showLoading() {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.classList.add('active');
        }
    }
    
    hideLoading() {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.classList.remove('active');
        }
    }
    
    updateLoadingProgress(progress) {
        if (this.elements.loadingProgress) {
            this.elements.loadingProgress.style.width = `${progress}%`;
        }
    }
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    generateReferralCode(userId) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'ALIEN-';
        
        // Add user ID segment
        const idSegment = userId.slice(-3).toUpperCase();
        code += idSegment;
        
        // Add random characters
        for (let i = 0; i < 3; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return code;
    }
    
    formatNumber(num, decimals = 0) {
        if (typeof num !== 'number' || isNaN(num)) return '0';
        
        // Handle large numbers
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
    
    calculateTotalBalanceUSD() {
        if (!this.walletData) return 0;
        
        const amskValue = this.walletData.AMSK * CONFIG.PRICES.AMSK;
        const usdtValue = this.walletData.USDT * CONFIG.PRICES.USDT;
        const bnbValue = this.walletData.BNB * CONFIG.PRICES.BNB;
        const tonValue = this.walletData.TON * CONFIG.PRICES.TON;
        
        return amskValue + usdtValue + bnbValue + tonValue;
    }
    
    copyToClipboard(text) {
        if (!navigator.clipboard) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return;
        }
        
        navigator.clipboard.writeText(text).then(() => {
            // Success handled by caller
        }).catch(err => {
            console.error('Copy error:', err);
        });
    }
    
    // ============================================
    // EVENT LISTENERS
    // ============================================
    setupEventListeners() {
        console.log('🎯 Setting up event listeners...');
        
        // Navigation buttons
        this.elements.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const page = btn.dataset.page;
                this.showPage(page);
            });
        });
        
        // Mining button
        if (this.elements.startMiningBtn) {
            this.elements.startMiningBtn.addEventListener('click', () => this.handleMining());
        }
        
        // Upgrade buttons
        this.elements.upgradeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.upgrade-card');
                if (card) {
                    this.upgradeMining(card.dataset.level);
                }
            });
        });
        
        // Booster buttons
        this.elements.boosterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.booster-card');
                if (card) {
                    this.activateBooster(card.dataset.booster);
                }
            });
        });
        
        // Staking buttons
        this.elements.stakeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const planId = btn.dataset.plan;
                this.openStakeModal(planId);
            });
        });
        
        // Quick action buttons
        this.elements.quickButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });
        
        // Asset action buttons
        this.elements.assetActionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                const currency = btn.dataset.currency;
                this.handleAssetAction(action, currency);
            });
        });
        
        // Referral buttons
        if (this.elements.copyRefCode) {
            this.elements.copyRefCode.addEventListener('click', () => this.copyReferralCode());
        }
        
        if (this.elements.shareRef) {
            this.elements.shareRef.addEventListener('click', () => this.shareReferral());
        }
        
        // Modal close buttons
        this.elements.closeModalButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        
        // Modal overlay
        if (this.elements.modalOverlay) {
            this.elements.modalOverlay.addEventListener('click', (e) => {
                if (e.target === this.elements.modalOverlay) {
                    this.closeModal();
                }
            });
        }
        
        // Window events
        window.addEventListener('beforeunload', () => {
            this.saveUserData();
        });
        
        console.log('✅ Event listeners setup complete');
    }
    
    handleQuickAction(action) {
        switch (action) {
            case 'swap':
                this.openSwapModal();
                break;
            case 'deposit':
                this.openDepositModal();
                break;
            case 'withdraw':
                this.openWithdrawModal();
                break;
            case 'history':
                this.showNotification('Transaction history coming soon!', 'info');
                break;
        }
    }
    
    handleAssetAction(action, currency) {
        switch (action) {
            case 'send':
                this.showNotification('Send functionality coming soon!', 'info');
                break;
            case 'receive':
                this.openDepositModal(currency);
                break;
            case 'swap':
                this.openSwapModal();
                break;
            case 'deposit':
                this.openDepositModal(currency);
                break;
            case 'withdraw':
                if (currency === 'USDT') {
                    this.openWithdrawModal();
                } else {
                    this.showNotification('Withdrawals available only for USDT', 'info');
                }
                break;
        }
    }
    
    // ============================================
    // BACKGROUND SERVICES
    // ============================================
    startServices() {
        // Mining timer
        this.timers.mining = setInterval(() => {
            this.updateMiningTimer();
        }, 1000);
        
        // Auto-save every 30 seconds
        this.timers.autosave = setInterval(() => {
            this.saveUserData();
        }, 30000);
        
        // Check for expired boosters every minute
        this.timers.boosters = setInterval(() => {
            this.checkExpiredBoosters();
        }, 60000);
        
        // Update user last active every minute
        this.timers.activity = setInterval(() => {
            if (this.userData) {
                this.userData.lastActive = new Date().toISOString();
            }
        }, 60000);
        
        console.log('⏱️ Background services started');
    }
    
    updateMiningTimer() {
        if (!this.miningData || !this.miningData.isActive || !this.elements.miningTimer) return;
        
        const now = Date.now();
        const timeLeft = this.miningData.nextReward - now;
        
        if (timeLeft <= 0) {
            this.elements.miningTimer.textContent = 'READY!';
            this.elements.miningTimer.style.color = '#00ff88';
            this.updateMiningButton();
        } else {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            this.elements.miningTimer.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            this.elements.miningTimer.style.color = '#ffffff';
        }
    }
    
    checkExpiredBoosters() {
        if (!this.miningData || !this.miningData.activeBoosters) return;
        
        const now = Date.now();
        const activeBoosters = this.miningData.activeBoosters.filter(booster => {
            return booster.expiresAt > now;
        });
        
        if (activeBoosters.length !== this.miningData.activeBoosters.length) {
            this.miningData.activeBoosters = activeBoosters;
            this.updateHomePage();
            this.saveUserData();
        }
    }
}

// ============================================
// GLOBAL INITIALIZATION
// ============================================

// Create global app instance
let app = null;

document.addEventListener('DOMContentLoaded', () => {
    app = new AlienMuskApp();
    
    // Make app accessible globally
    window.app = app;
    
    // Global helper functions
    window.formatNumber = (num, decimals = 0) => {
        return app ? app.formatNumber(num, decimals) : num.toString();
    };
    
    window.copyToClipboard = (text) => {
        if (app) app.copyToClipboard(text);
    };
    
    window.showNotification = (message, type) => {
        if (app) app.showNotification(message, type);
    };
});

console.log('👽 Alien Musk Platform v2.0 - Professional Edition loaded!');

// ============================================
// END OF FILE
// ============================================

// ============================================
// ALIEN MUSK - Quantum Mining Platform
// Professional Edition v4.0
// Complete Production Ready
// ============================================

// Telegram WebApp Initialization
let tg = window.Telegram?.WebApp;
let telegramUser = tg?.initDataUnsafe?.user;

// Firebase Configuration
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCklv_zMfndK4-xUHECyD5XA7p_-20e1t8",
    authDomain: "tatbi9-681bf.firebaseapp.com",
    projectId: "tatbi9-681bf",
    storageBucket: "tatbi9-681bf.firebasestorage.app",
    messagingSenderId: "863237064748",
    appId: "1:863237064748:web:134de1e01d2639ef5fa989"
};

// App Configuration
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
        FEE_BNB: 0.0002, // Withdrawal fee in BNB
        FEE_USD: 0.15 // Approx $0.15
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
            "2x": { multiplier: 2, duration: 86400000, price: 10000 }, // 24h
            "3x": { multiplier: 3, duration: 43200000, price: 15000 }, // 12h
            "5x": { multiplier: 5, duration: 21600000, price: 25000 }  // 6h
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

// Global Variables
let db = null;
let firebaseApp = null;
let currentUser = null;
let userData = null;
let activeBoosters = [];
let activeStakes = [];
let miningInterval = null;
let miningEndTime = null;

// DOM Elements Cache
const elements = {};

// ============================================
// MAIN APPLICATION CLASS
// ============================================
class AlienMuskApp {
    constructor() {
        this.initializeApp();
    }
    
    async initializeApp() {
        console.log("🚀 Initializing Alien Musk Platform...");
        
        try {
            // 1. Initialize Firebase
            await this.initializeFirebase();
            
            // 2. Initialize Telegram User
            await this.initializeTelegramUser();
            
            // 3. Cache DOM Elements
            this.cacheElements();
            
            // 4. Setup Event Listeners
            this.setupEventListeners();
            
            // 5. Load User Data
            await this.loadUserData();
            
            // 6. Initialize UI
            this.initializeUI();
            
            // 7. Check for Referral
            this.checkReferral();
            
            // 8. Start Services
            this.startBackgroundServices();
            
            // 9. Hide Loading Screen
            setTimeout(() => {
                this.hideLoading();
                this.showNotification("👽 Welcome to Alien Musk Quantum Platform!", "success");
            }, 1500);
            
            console.log("✅ Platform initialized successfully");
            
        } catch (error) {
            console.error("❌ Initialization failed:", error);
            this.showNotification("Failed to initialize platform", "error");
            this.hideLoading();
        }
    }
    
    // ============================================
    // FIREBASE INITIALIZATION
    // ============================================
    async initializeFirebase() {
        try {
            // Check if Firebase is available
            if (typeof firebase === 'undefined') {
                throw new Error('Firebase SDK not loaded');
            }
            
            // Initialize Firebase
            firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
            db = firebase.firestore();
            
            // Enable offline persistence
            await db.enablePersistence({
                synchronizeTabs: true
            }).catch(err => {
                console.warn('Persistence error:', err);
            });
            
            console.log("✅ Firebase initialized");
            return true;
            
        } catch (error) {
            console.error("❌ Firebase initialization failed:", error);
            throw error;
        }
    }
    
    // ============================================
    // USER MANAGEMENT
    // ============================================
    async initializeTelegramUser() {
        try {
            // Generate user ID
            const userId = telegramUser ? 
                `tg_${telegramUser.id}` : 
                `guest_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
            
            // Create user object
            currentUser = {
                id: userId,
                telegramId: telegramUser?.id || null,
                username: telegramUser?.username || `User_${userId.substr(0, 6)}`,
                firstName: telegramUser?.first_name || 'Alien',
                lastName: telegramUser?.last_name || '',
                photoUrl: telegramUser?.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
                language: telegramUser?.language_code || 'en',
                joinedAt: new Date().toISOString()
            };
            
            // Generate referral code
            currentUser.referralCode = this.generateReferralCode(currentUser.id);
            
            console.log("👤 User initialized:", currentUser.id);
            
        } catch (error) {
            console.error("❌ User initialization failed:", error);
            throw error;
        }
    }
    
    async loadUserData() {
        try {
            if (!db) {
                await this.loadFromLocalStorage();
                return;
            }
            
            const userRef = db.collection('users').doc(currentUser.id);
            const userDoc = await userRef.get();
            
            if (userDoc.exists) {
                // Existing user
                userData = userDoc.data();
                console.log("📥 User data loaded from Firebase");
            } else {
                // New user - create initial data
                await this.createNewUser(userRef);
            }
            
            // Load additional data
            await this.loadAdditionalData();
            
        } catch (error) {
            console.error("❌ Error loading user data:", error);
            await this.loadFromLocalStorage();
        }
    }
    
    async createNewUser(userRef) {
        const initialData = {
            id: currentUser.id,
            telegramId: currentUser.telegramId,
            username: currentUser.username,
            firstName: currentUser.firstName,
            photoUrl: currentUser.photoUrl,
            referralCode: currentUser.referralCode,
            joinedAt: currentUser.joinedAt,
            lastActive: new Date().toISOString(),
            
            // Balances
            balances: {
                AMSK: 2500,
                USDT: 100,
                BNB: 0.5,
                TON: 50
            },
            
            // Mining
            mining: {
                level: 1,
                active: true,
                lastReward: Date.now(),
                nextReward: Date.now() + CONFIG.MINING.DURATION,
                totalMined: 2500,
                minedToday: 2500,
                activeBoosters: []
            },
            
            // Staking
            staking: {
                activeStakes: [],
                totalEarned: 0,
                totalStaked: 0
            },
            
            // Referrals
            referrals: {
                count: 0,
                earned: 0,
                referrals: [],
                claimedMilestones: []
            },
            
            // Settings
            settings: {
                notifications: true,
                sound: true,
                theme: 'dark'
            }
        };
        
        await userRef.set(initialData);
        userData = initialData;
        
        console.log("👤 New user created in Firebase");
    }
    
    async loadAdditionalData() {
        if (!db) return;
        
        try {
            // Load active stakes
            if (userData.staking?.activeStakes) {
                activeStakes = userData.staking.activeStakes;
            }
            
            // Load active boosters
            if (userData.mining?.activeBoosters) {
                activeBoosters = userData.mining.activeBoosters;
            }
            
        } catch (error) {
            console.error("❌ Error loading additional data:", error);
        }
    }
    
    async saveUserData() {
        if (!userData || !db) return;
        
        try {
            // Update last active timestamp
            userData.lastActive = new Date().toISOString();
            
            // Save to Firebase
            await db.collection('users').doc(currentUser.id).update({
                balances: userData.balances,
                mining: userData.mining,
                staking: userData.staking,
                referrals: userData.referrals,
                lastActive: userData.lastActive
            });
            
            // Save to localStorage as backup
            this.saveToLocalStorage();
            
            console.log("💾 User data saved");
            
        } catch (error) {
            console.error("❌ Error saving user data:", error);
        }
    }
    
    // ============================================
    // DOM & UI MANAGEMENT
    // ============================================
    cacheElements() {
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
    
    initializeUI() {
        // Update user info
        this.updateUserInfo();
        
        // Update mining display
        this.updateMiningDisplay();
        
        // Update wallet
        this.updateWalletDisplay();
        
        // Update staking calculator
        this.updateStakingCalculator();
        
        // Update active stakes
        this.updateActiveStakes();
        
        // Show home page
        this.showPage('home');
    }
    
    updateUserInfo() {
        if (!currentUser || !userData) return;
        
        // Update header
        if (elements.usernameMini) {
            elements.usernameMini.textContent = currentUser.firstName;
        }
        
        if (elements.userIdMini) {
            elements.userIdMini.textContent = `ID: ${currentUser.id.substring(0, 8)}`;
        }
        
        if (elements.userAvatarMini) {
            elements.userAvatarMini.src = currentUser.photoUrl;
        }
        
        // Update total balance
        this.updateTotalBalance();
    }
    
    updateTotalBalance() {
        if (!userData?.balances) return;
        
        const totalAMSK = userData.balances.AMSK || 0;
        const totalUSD = this.calculateTotalUSD();
        
        if (elements.totalBalanceAmsk) {
            elements.totalBalanceAmsk.textContent = this.formatNumber(totalAMSK);
        }
        
        if (elements.totalBalanceUsd) {
            elements.totalBalanceUsd.textContent = totalUSD.toFixed(2);
        }
        
        // Update wallet total
        if (elements.walletTotalAmsk) {
            elements.walletTotalAmsk.textContent = this.formatNumber(totalAMSK);
        }
        
        if (elements.walletTotalUsd) {
            elements.walletTotalUsd.textContent = totalUSD.toFixed(2);
        }
    }
    
    calculateTotalUSD() {
        if (!userData?.balances) return 0;
        
        const { AMSK, USDT, BNB, TON } = userData.balances;
        const { PRICES } = CONFIG;
        
        return (
            (AMSK * PRICES.AMSK) +
            (USDT * PRICES.USDT) +
            (BNB * PRICES.BNB) +
            (TON * PRICES.TON)
        );
    }
    
    // ============================================
    // MINING SYSTEM
    // ============================================
    updateMiningDisplay() {
        if (!userData?.mining) return;
        
        const mining = userData.mining;
        const level = CONFIG.MINING.LEVELS[mining.level];
        
        // Update mining level
        if (elements.currentMiningLevel) {
            elements.currentMiningLevel.textContent = mining.level;
        }
        
        // Calculate hashrate with boosters
        let hashrate = level.hashrate;
        activeBoosters.forEach(booster => {
            const config = CONFIG.MINING.BOOSTERS[booster.type];
            if (config) {
                hashrate *= config.multiplier;
            }
        });
        
        if (elements.currentHashrateDisplay) {
            elements.currentHashrateDisplay.textContent = this.formatNumber(hashrate);
        }
        
        // Update mining timer
        this.updateMiningTimer();
        
        // Update next reward
        let nextReward = level.reward;
        activeBoosters.forEach(booster => {
            const config = CONFIG.MINING.BOOSTERS[booster.type];
            if (config) {
                nextReward *= config.multiplier;
            }
        });
        
        if (elements.nextRewardAmount) {
            elements.nextRewardAmount.textContent = this.formatNumber(nextReward);
        }
        
        // Update upgrade cards
        this.updateUpgradeCards();
        
        // Update booster cards
        this.updateBoosterCards();
    }
    
    updateMiningTimer() {
        if (!userData?.mining || !elements.miningTimerDisplay) return;
        
        const now = Date.now();
        const nextRewardTime = userData.mining.nextReward;
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
    
    updateUpgradeCards() {
        if (!elements.upgradeCards || !userData) return;
        
        const currentLevel = userData.mining.level;
        const usdtBalance = userData.balances.USDT || 0;
        
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
    
    updateBoosterCards() {
        if (!elements.boosterCards || !userData) return;
        
        const amskBalance = userData.balances.AMSK || 0;
        
        elements.boosterCards.forEach(card => {
            const boosterType = card.dataset.booster;
            const boosterConfig = CONFIG.MINING.BOOSTERS[boosterType];
            const button = card.querySelector('.booster-btn');
            
            if (!button || !boosterConfig) return;
            
            // Check if booster is active
            const isActive = activeBoosters.some(b => b.type === boosterType);
            const canAfford = amskBalance >= boosterConfig.price;
            
            if (isActive) {
                button.textContent = 'Active';
                button.disabled = true;
                button.classList.add('active-btn');
                card.classList.add('active');
            } else {
                button.textContent = canAfford ? 'Activate' : `${this.formatNumber(boosterConfig.price)} AMSK`;
                button.disabled = !canAfford;
                button.classList.remove('active-btn');
                card.classList.remove('active');
            }
        });
    }
    
    async handleMiningAction() {
        if (!userData?.mining) return;
        
        const mining = userData.mining;
        const now = Date.now();
        
        if (!mining.active) {
            // Start mining
            await this.startMining();
        } else if (now >= mining.nextReward) {
            // Claim reward
            await this.claimMiningReward();
        } else {
            this.showNotification("⏳ Mining in progress. Reward not ready yet.", "info");
        }
    }
    
    async startMining() {
        try {
            userData.mining.active = true;
            userData.mining.lastReward = Date.now();
            userData.mining.nextReward = Date.now() + CONFIG.MINING.DURATION;
            
            // Start timer
            this.startMiningTimer();
            
            // Update UI
            this.updateMiningDisplay();
            
            // Save to Firebase
            await this.saveUserData();
            
            this.showNotification("⚡ Quantum mining started!", "success");
            
        } catch (error) {
            console.error("❌ Error starting mining:", error);
            this.showNotification("Failed to start mining", "error");
        }
    }
    
    async claimMiningReward() {
        try {
            const level = CONFIG.MINING.LEVELS[userData.mining.level];
            let reward = level.reward;
            
            // Apply booster multipliers
            activeBoosters.forEach(booster => {
                const boosterConfig = CONFIG.MINING.BOOSTERS[booster.type];
                if (boosterConfig) {
                    reward *= boosterConfig.multiplier;
                }
            });
            
            // Update balances
            userData.balances.AMSK = (userData.balances.AMSK || 0) + reward;
            userData.mining.totalMined = (userData.mining.totalMined || 0) + reward;
            userData.mining.minedToday = (userData.mining.minedToday || 0) + reward;
            userData.mining.lastReward = Date.now();
            userData.mining.nextReward = Date.now() + CONFIG.MINING.DURATION;
            
            // Update UI
            this.updateMiningDisplay();
            this.updateWalletDisplay();
            this.updateTotalBalance();
            
            // Save to Firebase
            await this.saveUserData();
            
            // Show notification
            this.showNotification(`💰 +${this.formatNumber(reward)} AMSK mined!`, "success");
            
        } catch (error) {
            console.error("❌ Error claiming mining reward:", error);
            this.showNotification("Failed to claim reward", "error");
        }
    }
    
    startMiningTimer() {
        // Clear existing interval
        if (miningInterval) {
            clearInterval(miningInterval);
        }
        
        // Update every second
        miningInterval = setInterval(() => {
            this.updateMiningTimer();
        }, 1000);
    }
    
    async upgradeMiningLevel(level) {
        try {
            level = parseInt(level);
            const levelData = CONFIG.MINING.LEVELS[level];
            
            if (!levelData) {
                throw new Error("Invalid mining level");
            }
            
            // Check if already at this level
            if (level <= userData.mining.level) {
                this.showNotification("Already at or above this level!", "warning");
                return;
            }
            
            // Check USDT balance
            if (userData.balances.USDT < levelData.cost) {
                this.showNotification(`Insufficient USDT. Need ${levelData.cost} USDT.`, "error");
                return;
            }
            
            // Deduct USDT and upgrade
            userData.balances.USDT -= levelData.cost;
            userData.mining.level = level;
            
            // Update UI
            this.updateMiningDisplay();
            this.updateWalletDisplay();
            this.updateTotalBalance();
            this.updateUpgradeCards();
            
            // Save to Firebase
            await this.saveUserData();
            
            // Show success
            this.showNotification(`⚡ Upgraded to ${levelData.name} level!`, "success");
            
        } catch (error) {
            console.error("❌ Error upgrading mining level:", error);
            this.showNotification("Failed to upgrade mining level", "error");
        }
    }
    
    async activateBooster(boosterType) {
        try {
            const boosterConfig = CONFIG.MINING.BOOSTERS[boosterType];
            
            if (!boosterConfig) {
                throw new Error("Booster not found");
            }
            
            // Check if already active
            const isActive = activeBoosters.some(b => b.type === boosterType);
            if (isActive) {
                this.showNotification("This booster is already active!", "warning");
                return;
            }
            
            // Check AMSK balance
            if (userData.balances.AMSK < boosterConfig.price) {
                this.showNotification(`Insufficient AMSK. Need ${boosterConfig.price} AMSK.`, "error");
                return;
            }
            
            // Deduct AMSK
            userData.balances.AMSK -= boosterConfig.price;
            
            // Add booster
            activeBoosters.push({
                type: boosterType,
                multiplier: boosterConfig.multiplier,
                activatedAt: Date.now(),
                expiresAt: Date.now() + boosterConfig.duration
            });
            
            // Update user data
            userData.mining.activeBoosters = activeBoosters;
            
            // Update UI
            this.updateMiningDisplay();
            this.updateWalletDisplay();
            this.updateTotalBalance();
            this.updateBoosterCards();
            
            // Save to Firebase
            await this.saveUserData();
            
            // Show success
            this.showNotification(`⚡ ${boosterType} Booster activated! Mining speed ×${boosterConfig.multiplier}`, "success");
            
        } catch (error) {
            console.error("❌ Error activating booster:", error);
            this.showNotification("Failed to activate booster", "error");
        }
    }
    
    // ============================================
    // STAKING SYSTEM
    // ============================================
    updateStakingCalculator() {
        if (!elements.calcAmount || !elements.calcDuration) return;
        
        const amount = parseFloat(elements.calcAmount.value) || 100;
        const duration = parseInt(elements.calcDuration.value) || 7;
        
        // Calculate APR based on duration
        let apr = 40; // Default for 7 days
        let dailyReward = 0;
        
        if (duration === 15) {
            apr = 50;
            dailyReward = (amount * 0.5) / 15; // 50% APR
        } else if (duration === 30) {
            apr = 60;
            dailyReward = (amount * 0.6) / 30; // 60% APR
        } else {
            dailyReward = (amount * 0.4) / 7; // 40% APR
        }
        
        const totalProfit = dailyReward * duration;
        const totalReturn = amount + totalProfit;
        
        // Update display
        if (elements.calcTotalProfit) {
            elements.calcTotalProfit.textContent = `${this.formatNumber(totalProfit)} AMSK`;
        }
        
        if (elements.calcDailyProfit) {
            elements.calcDailyProfit.textContent = `${dailyReward.toFixed(2)} AMSK`;
        }
        
        if (elements.calcTotalReturn) {
            elements.calcTotalReturn.textContent = `${this.formatNumber(totalReturn)} AMSK`;
        }
    }
    
    updateActiveStakes() {
        if (!elements.activeStakesList || !activeStakes.length) {
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
                        <button class="btn-secondary" onclick="app.cancelStake(${index})" ${progress < 50 ? '' : 'disabled'}>
                            Cancel
                        </button>
                        <button class="btn-primary" onclick="app.claimStakeReward(${index})" ${progress >= 100 ? '' : 'disabled'}>
                            Claim
                        </button>
                    </div>
                </div>
            `;
        });
        
        elements.activeStakesList.innerHTML = html;
    }
    
    async openStakeModal(planId) {
        const plan = CONFIG.STAKING.PLANS[planId];
        if (!plan) return;
        
        const modalContent = `
            <div class="stake-modal-content">
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
                    <button class="btn-secondary" onclick="app.closeModal()">
                        Cancel
                    </button>
                    <button class="btn-primary" onclick="app.confirmStaking(${planId})">
                        Confirm Stake
                    </button>
                </div>
            </div>
        `;
        
        this.openModal('stake', modalContent);
    }
    
    async confirmStaking(planId) {
        try {
            const plan = CONFIG.STAKING.PLANS[planId];
            if (!plan) {
                throw new Error("Plan not found");
            }
            
            // Check USDT balance
            if (userData.balances.USDT < plan.amount) {
                this.showNotification("Insufficient USDT balance", "error");
                return;
            }
            
            // Deduct USDT
            userData.balances.USDT -= plan.amount;
            
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
            activeStakes.push(stake);
            userData.staking.activeStakes = activeStakes;
            userData.staking.totalStaked = (userData.staking.totalStaked || 0) + plan.amount;
            
            // Update UI
            this.updateWalletDisplay();
            this.updateTotalBalance();
            this.updateActiveStakes();
            
            // Close modal
            this.closeModal();
            
            // Show success
            this.showNotification(`✅ Staked ${plan.amount} USDT for ${plan.duration} days!`, "success");
            
            // Save to Firebase
            await this.saveUserData();
            
            // Create transaction record
            await this.createTransaction({
                type: 'stake',
                amount: plan.amount,
                currency: 'USDT',
                details: `${plan.name} - ${plan.duration} days`
            });
            
        } catch (error) {
            console.error("❌ Error confirming stake:", error);
            this.showNotification("Failed to process stake", "error");
        }
    }
    
    async claimStakeReward(stakeIndex) {
        try {
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
                this.showNotification("Stake period not completed yet", "warning");
                return;
            }
            
            // Calculate total reward
            const totalReward = plan.daily * plan.duration;
            
            // Add reward to AMSK balance
            userData.balances.AMSK += totalReward;
            
            // Return staked USDT
            userData.balances.USDT += stake.amount;
            
            // Update staking stats
            userData.staking.totalEarned = (userData.staking.totalEarned || 0) + totalReward;
            
            // Remove from active stakes
            activeStakes.splice(stakeIndex, 1);
            userData.staking.activeStakes = activeStakes;
            
            // Update UI
            this.updateWalletDisplay();
            this.updateTotalBalance();
            this.updateActiveStakes();
            
            // Show success
            this.showNotification(`💰 Claimed ${totalReward} AMSK from staking!`, "success");
            
            // Save to Firebase
            await this.saveUserData();
            
            // Create transaction record
            await this.createTransaction({
                type: 'stake_reward',
                amount: totalReward,
                currency: 'AMSK',
                details: `${plan.name} completion`
            });
            
        } catch (error) {
            console.error("❌ Error claiming stake reward:", error);
            this.showNotification("Failed to claim stake reward", "error");
        }
    }
    
    // ============================================
    // WALLET SYSTEM
    // ============================================
    updateWalletDisplay() {
        if (!userData?.balances) return;
        
        const { AMSK, USDT, BNB, TON } = userData.balances;
        const { PRICES } = CONFIG;
        
        // Update AMSK
        if (elements.assetAmskBalance) {
            elements.assetAmskBalance.textContent = this.formatNumber(AMSK);
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
            elements.assetTonBalance.textContent = this.formatNumber(TON);
        }
        if (elements.assetTonUsd) {
            elements.assetTonUsd.textContent = (TON * PRICES.TON).toFixed(2);
        }
    }
    
    openDepositModal(currency = 'USDT') {
        const minDeposit = CONFIG.MIN_DEPOSIT[currency] || 10;
        const address = currency === 'TON' ? CONFIG.ADDRESSES.TON : CONFIG.ADDRESSES.BNB_USDT;
        
        const modalContent = `
            <div class="deposit-modal-content">
                <div class="deposit-header">
                    <h4><i class="fas fa-arrow-down"></i> Deposit ${currency}</h4>
                </div>
                
                <div class="deposit-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Send only <strong>${currency}</strong> to this address</span>
                </div>
                
                <div class="address-card">
                    <div class="address-label">Deposit Address:</div>
                    <div class="address-value">${address}</div>
                    <button class="copy-btn" onclick="app.copyToClipboard('${address}')">
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
                    <button class="btn-secondary" onclick="app.closeModal()">
                        Cancel
                    </button>
                    <button class="btn-primary" onclick="app.submitDeposit('${currency}')">
                        Submit Deposit Request
                    </button>
                </div>
            </div>
        `;
        
        this.openModal('deposit', modalContent);
    }
    
    async submitDeposit(currency) {
        try {
            const amount = parseFloat(document.getElementById('deposit-amount')?.value);
            const txid = document.getElementById('deposit-txid')?.value.trim();
            
            const minDeposit = CONFIG.MIN_DEPOSIT[currency];
            
            // Validation
            if (!amount || amount < minDeposit) {
                this.showNotification(`Minimum deposit is ${minDeposit} ${currency}`, "error");
                return;
            }
            
            if (!txid) {
                this.showNotification("Please enter transaction ID", "error");
                return;
            }
            
            // Create deposit request
            const depositRequest = {
                userId: currentUser.id,
                username: currentUser.username,
                currency: currency,
                amount: amount,
                txid: txid,
                status: 'pending',
                timestamp: Date.now(),
                address: currency === 'TON' ? CONFIG.ADDRESSES.TON : CONFIG.ADDRESSES.BNB_USDT
            };
            
            // Save to Firebase
            if (db) {
                await db.collection('deposit_requests').add(depositRequest);
            }
            
            // Close modal
            this.closeModal();
            
            // Show success
            this.showNotification(`✅ Deposit request submitted for ${amount} ${currency}`, "success");
            this.showNotification("⏳ Your deposit is pending admin review", "info");
            
            // Create transaction record
            await this.createTransaction({
                type: 'deposit_request',
                amount: amount,
                currency: currency,
                details: 'Pending admin approval'
            });
            
        } catch (error) {
            console.error("❌ Error submitting deposit:", error);
            this.showNotification("Failed to submit deposit request", "error");
        }
    }
    
    openWithdrawModal() {
        const usdtBalance = userData?.balances?.USDT || 0;
        const bnbBalance = userData?.balances?.BNB || 0;
        const minWithdraw = CONFIG.WITHDRAWAL.MIN_USDT;
        const feeBNB = CONFIG.WITHDRAWAL.FEE_BNB;
        
        const canWithdraw = usdtBalance >= minWithdraw && bnbBalance >= feeBNB;
        
        const modalContent = `
            <div class="withdraw-modal-content">
                <div class="withdraw-header">
                    <h4><i class="fas fa-arrow-up"></i> Withdraw USDT</h4>
                </div>
                
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
                    <button class="btn-secondary" onclick="app.closeModal()">
                        Cancel
                    </button>
                    <button class="btn-primary" onclick="app.submitWithdrawal()" ${canWithdraw ? '' : 'disabled'}>
                        Submit Withdrawal
                    </button>
                </div>
            </div>
        `;
        
        this.openModal('withdraw', modalContent);
    }
    
    async submitWithdrawal() {
        try {
            const amount = parseFloat(document.getElementById('withdraw-amount')?.value);
            const address = document.getElementById('withdraw-address')?.value.trim();
            
            const minWithdraw = CONFIG.WITHDRAWAL.MIN_USDT;
            const feeBNB = CONFIG.WITHDRAWAL.FEE_BNB;
            const usdtBalance = userData?.balances?.USDT || 0;
            const bnbBalance = userData?.balances?.BNB || 0;
            
            // Validation
            if (!amount || amount < minWithdraw) {
                this.showNotification(`Minimum withdrawal is ${minWithdraw} USDT`, "error");
                return;
            }
            
            if (amount > usdtBalance) {
                this.showNotification("Insufficient USDT balance", "error");
                return;
            }
            
            if (!address || !address.startsWith('0x') || address.length !== 42) {
                this.showNotification("Please enter valid BEP20 address", "error");
                return;
            }
            
            if (bnbBalance < feeBNB) {
                this.showNotification(`Insufficient BNB for fee. Need ${feeBNB} BNB`, "error");
                return;
            }
            
            // Create withdrawal request
            const withdrawalRequest = {
                userId: currentUser.id,
                username: currentUser.username,
                amount: amount,
                address: address,
                currency: 'USDT',
                fee: feeBNB,
                status: 'pending',
                timestamp: Date.now(),
                note: 'Awaiting manual processing'
            };
            
            // Deduct balances immediately
            userData.balances.USDT -= amount;
            userData.balances.BNB -= feeBNB;
            
            // Save to Firebase
            if (db) {
                await db.collection('withdrawal_requests').add(withdrawalRequest);
                
                // Update user balances in Firebase
                await db.collection('users').doc(currentUser.id).update({
                    'balances.USDT': userData.balances.USDT,
                    'balances.BNB': userData.balances.BNB
                });
            }
            
            // Update UI
            this.updateWalletDisplay();
            this.updateTotalBalance();
            
            // Close modal
            this.closeModal();
            
            // Show success
            this.showNotification(`✅ Withdrawal request submitted for ${amount} USDT`, "success");
            this.showNotification("⏳ Your withdrawal is pending admin review", "info");
            
            // Save user data
            await this.saveUserData();
            
            // Create transaction record
            await this.createTransaction({
                type: 'withdrawal_request',
                amount: amount,
                currency: 'USDT',
                details: 'Pending admin approval'
            });
            
        } catch (error) {
            console.error("❌ Error submitting withdrawal:", error);
            this.showNotification("Failed to submit withdrawal request", "error");
        }
    }
    
    openSwapModal() {
        const modalContent = `
            <div class="swap-modal-content">
                <div class="swap-header">
                    <h4><i class="fas fa-exchange-alt"></i> Swap Tokens</h4>
                </div>
                
                <div class="swap-container">
                    <div class="swap-from">
                        <div class="swap-label">
                            <span>From</span>
                            <select id="swap-from-currency" onchange="app.updateSwapCalculation()">
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
                                   oninput="app.updateSwapCalculation()"
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
                            <select id="swap-to-currency" onchange="app.updateSwapCalculation()">
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
                    <button class="btn-secondary" onclick="app.closeModal()">
                        Cancel
                    </button>
                    <button class="btn-primary" onclick="app.executeSwap()">
                        Confirm Swap
                    </button>
                </div>
            </div>
        `;
        
        this.openModal('swap', modalContent);
        this.updateSwapCalculation();
    }
    
    updateSwapCalculation() {
        const fromCurrency = document.getElementById('swap-from-currency')?.value;
        const toCurrency = document.getElementById('swap-to-currency')?.value;
        const fromAmount = parseFloat(document.getElementById('swap-from-amount')?.value) || 0;
        
        if (!fromCurrency || !toCurrency || fromAmount <= 0) return;
        
        // Get balances
        const balances = userData?.balances || {};
        const fromBalance = balances[fromCurrency] || 0;
        const toBalance = balances[toCurrency] || 0;
        
        // Update balance displays
        if (document.getElementById('swap-from-balance')) {
            document.getElementById('swap-from-balance').textContent = 
                fromCurrency === 'BNB' ? fromBalance.toFixed(4) : this.formatNumber(fromBalance);
        }
        
        if (document.getElementById('swap-to-balance')) {
            document.getElementById('swap-to-balance').textContent = 
                toCurrency === 'BNB' ? toBalance.toFixed(4) : this.formatNumber(toBalance);
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
                toCurrency === 'USDT' ? toAmount.toFixed(2) : this.formatNumber(toAmount);
        }
        
        if (document.getElementById('preview-send')) {
            document.getElementById('preview-send').textContent = 
                `${this.formatNumber(fromAmount)} ${fromCurrency}`;
        }
        
        if (document.getElementById('preview-receive')) {
            document.getElementById('preview-receive').textContent = 
                `${toCurrency === 'USDT' ? toAmount.toFixed(2) : this.formatNumber(toAmount)} ${toCurrency}`;
        }
    }
    
    async executeSwap() {
        try {
            const fromCurrency = document.getElementById('swap-from-currency')?.value;
            const toCurrency = document.getElementById('swap-to-currency')?.value;
            const fromAmount = parseFloat(document.getElementById('swap-from-amount')?.value) || 0;
            
            if (!fromCurrency || !toCurrency || fromAmount <= 0) {
                this.showNotification("Please enter valid amount", "error");
                return;
            }
            
            // Get current balances
            const fromBalance = userData.balances[fromCurrency] || 0;
            const toBalance = userData.balances[toCurrency] || 0;
            
            // Check balance
            if (fromAmount > fromBalance) {
                this.showNotification("Insufficient balance", "error");
                return;
            }
            
            // Calculate conversion
            let toAmount = 0;
            let conversionDetails = "";
            
            if (fromCurrency === 'AMSK' && toCurrency === 'USDT') {
                toAmount = fromAmount * CONFIG.PRICES.AMSK;
                conversionDetails = `AMSK → USDT @ ${CONFIG.PRICES.AMSK}`;
            } else if (fromCurrency === 'USDT' && toCurrency === 'AMSK') {
                toAmount = fromAmount / CONFIG.PRICES.AMSK;
                conversionDetails = `USDT → AMSK @ ${(1/CONFIG.PRICES.AMSK).toFixed(0)} AMSK/USDT`;
            } else if (fromCurrency === 'BNB' && toCurrency === 'AMSK') {
                toAmount = (fromAmount * CONFIG.PRICES.BNB) / CONFIG.PRICES.AMSK;
                conversionDetails = `BNB → AMSK @ ${CONFIG.PRICES.BNB} USD/BNB`;
            } else if (fromCurrency === 'TON' && toCurrency === 'AMSK') {
                toAmount = (fromAmount * CONFIG.PRICES.TON) / CONFIG.PRICES.AMSK;
                conversionDetails = `TON → AMSK @ ${CONFIG.PRICES.TON} USD/TON`;
            } else {
                this.showNotification("Invalid swap pair", "error");
                return;
            }
            
            // Minimum swap amounts
            if (fromCurrency === 'AMSK' && fromAmount < 1000) {
                this.showNotification("Minimum swap is 1,000 AMSK", "error");
                return;
            }
            
            if (fromCurrency === 'USDT' && fromAmount < 10) {
                this.showNotification("Minimum swap is 10 USDT", "error");
                return;
            }
            
            if (fromCurrency === 'BNB' && fromAmount < 0.001) {
                this.showNotification("Minimum swap is 0.001 BNB", "error");
                return;
            }
            
            if (fromCurrency === 'TON' && fromAmount < 1) {
                this.showNotification("Minimum swap is 1 TON", "error");
                return;
            }
            
            // Execute swap
            userData.balances[fromCurrency] -= fromAmount;
            userData.balances[toCurrency] = (toBalance || 0) + toAmount;
            
            // Update UI
            this.updateWalletDisplay();
            this.updateTotalBalance();
            
            // Close modal
            this.closeModal();
            
            // Show success
            this.showNotification(
                `✅ Swapped ${this.formatNumber(fromAmount)} ${fromCurrency} to ${toCurrency === 'USDT' ? toAmount.toFixed(2) : this.formatNumber(toAmount)} ${toCurrency}`, 
                "success"
            );
            
            // Save to Firebase
            await this.saveUserData();
            
            // Create transaction record
            await this.createTransaction({
                type: 'swap',
                fromAmount: fromAmount,
                fromCurrency: fromCurrency,
                toAmount: toAmount,
                toCurrency: toCurrency,
                details: conversionDetails
            });
            
        } catch (error) {
            console.error("❌ Error executing swap:", error);
            this.showNotification("Failed to execute swap", "error");
        }
    }
    
    openHistoryModal() {
        const modalContent = `
            <div class="history-modal-content">
                <div class="history-header">
                    <h4><i class="fas fa-history"></i> Transaction History</h4>
                    <div class="history-tabs">
                        <button class="tab-btn active" data-tab="all">All</button>
                        <button class="tab-btn" data-tab="deposits">Deposits</button>
                        <button class="tab-btn" data-tab="withdrawals">Withdrawals</button>
                        <button class="tab-btn" data-tab="swaps">Swaps</button>
                        <button class="tab-btn" data-tab="staking">Staking</button>
                    </div>
                </div>
                
                <div class="history-list" id="history-list">
                    <div class="empty-state">
                        <i class="fas fa-clock"></i>
                        <p>Loading transactions...</p>
                    </div>
                </div>
            </div>
        `;
        
        this.openModal('history', modalContent);
        this.loadTransactionHistory('all');
        
        // Setup tab switching
        setTimeout(() => {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const tab = btn.dataset.tab;
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.loadTransactionHistory(tab);
                });
            });
        }, 100);
    }
    
    async loadTransactionHistory(tab = 'all') {
        if (!db) return;
        
        try {
            let query = db.collection('transactions')
                .where('userId', '==', currentUser.id)
                .orderBy('timestamp', 'desc')
                .limit(50);
            
            // Apply filter if not 'all'
            if (tab !== 'all') {
                query = query.where('type', '==', tab);
            }
            
            const snapshot = await query.get();
            const historyList = document.getElementById('history-list');
            
            if (snapshot.empty) {
                historyList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>No transactions found</p>
                    </div>
                `;
                return;
            }
            
            let html = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                html += this.createHistoryItem(data);
            });
            
            historyList.innerHTML = html;
            
        } catch (error) {
            console.error("❌ Error loading transaction history:", error);
            document.getElementById('history-list').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load transactions</p>
                </div>
            `;
        }
    }
    
    createHistoryItem(data) {
        const date = new Date(data.timestamp).toLocaleString();
        let icon = 'fa-exchange-alt';
        let color = 'var(--info-color)';
        
        switch (data.type) {
            case 'deposit_request':
            case 'deposit':
                icon = 'fa-arrow-down';
                color = 'var(--success-color)';
                break;
            case 'withdrawal_request':
            case 'withdraw':
                icon = 'fa-arrow-up';
                color = 'var(--warning-color)';
                break;
            case 'swap':
                icon = 'fa-exchange-alt';
                color = 'var(--primary-color)';
                break;
            case 'stake':
            case 'stake_reward':
                icon = 'fa-gem';
                color = 'var(--secondary-color)';
                break;
        }
        
        let amountText = '';
        if (data.type === 'swap') {
            amountText = `
                <div class="tx-amount">
                    ${this.formatNumber(data.fromAmount)} ${data.fromCurrency} → 
                    ${data.toCurrency === 'USDT' ? data.toAmount.toFixed(2) : this.formatNumber(data.toAmount)} ${data.toCurrency}
                </div>
            `;
        } else {
            amountText = `
                <div class="tx-amount" style="color: ${color}">
                    ${data.type.includes('withdrawal') ? '-' : '+'}${this.formatNumber(data.amount)} ${data.currency}
                </div>
            `;
        }
        
        return `
            <div class="history-item">
                <div class="tx-icon" style="background: ${color}20; color: ${color}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="tx-details">
                    <div class="tx-type">${this.formatTransactionType(data.type)}</div>
                    <div class="tx-date">${date}</div>
                    ${data.details ? `<div class="tx-note">${data.details}</div>` : ''}
                </div>
                ${amountText}
                <div class="tx-status ${data.status || 'completed'}">
                    ${data.status ? data.status.charAt(0).toUpperCase() + data.status.slice(1) : 'Completed'}
                </div>
            </div>
        `;
    }
    
    // ============================================
    // REFERRAL SYSTEM
    // ============================================
    checkReferral() {
        if (!tg?.initDataUnsafe) return;
        
        // Check Telegram start parameter
        if (tg.initDataUnsafe.start_param) {
            const refCode = tg.initDataUnsafe.start_param;
            if (refCode && refCode !== currentUser.referralCode) {
                this.processReferral(refCode);
            }
        }
        
        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const urlRef = urlParams.get('ref') || urlParams.get('start');
        if (urlRef && urlRef !== currentUser.referralCode) {
            this.processReferral(urlRef);
        }
    }
    
    async processReferral(refCode) {
        try {
            if (!refCode || refCode === currentUser.referralCode || !db) return;
            
            // Check if already referred
            if (userData.referrals?.referrals?.includes(refCode)) {
                return;
            }
            
            // Find referrer
            const referrerQuery = await db.collection('users')
                .where('referralCode', '==', refCode)
                .limit(1)
                .get();
            
            if (referrerQuery.empty) {
                console.log("Referrer not found:", refCode);
                return;
            }
            
            const referrerDoc = referrerQuery.docs[0];
            const referrerData = referrerDoc.data();
            
            // Update referrer's data
            const referrerUpdate = {
                'referrals.count': (referrerData.referrals?.count || 0) + 1,
                'referrals.earned': (referrerData.referrals?.earned || 0) + 10000, // 10K AMSK bonus
                'referrals.referrals': firebase.firestore.FieldValue.arrayUnion(currentUser.id)
            };
            
            // Add referral bonus to referrer's balance
            referrerUpdate['balances.AMSK'] = (referrerData.balances?.AMSK || 0) + 10000;
            
            await referrerDoc.ref.update(referrerUpdate);
            
            // Update current user's referral data
            if (!userData.referrals) {
                userData.referrals = {
                    count: 0,
                    earned: 0,
                    referrals: [],
                    claimedMilestones: []
                };
            }
            
            userData.referrals.referredBy = refCode;
            
            // Add referral bonus to current user
            userData.balances.AMSK += 5000; // 5K AMSK welcome bonus
            userData.referrals.earned += 5000;
            
            // Update UI
            this.updateWalletDisplay();
            this.updateTotalBalance();
            
            // Save data
            await this.saveUserData();
            
            // Show notification
            this.showNotification("🎉 Welcome bonus received for using referral code!", "success");
            
        } catch (error) {
            console.error("❌ Error processing referral:", error);
        }
    }
    
    // ============================================
    // ADMIN SYSTEM
    // ============================================
    setupAdminAccess() {
        // Add click listener to logo for admin access
        const logo = document.querySelector('.brand-logo');
        if (logo) {
            let clickCount = 0;
            let lastClick = 0;
            
            logo.addEventListener('click', (e) => {
                const now = Date.now();
                if (now - lastClick > 2000) clickCount = 0;
                
                clickCount++;
                lastClick = now;
                
                if (clickCount >= 10) {
                    this.showAdminLogin();
                    clickCount = 0;
                }
            });
        }
    }
    
    showAdminLogin() {
        const modalContent = `
            <div class="admin-login-modal">
                <div class="login-header">
                    <h4><i class="fas fa-user-shield"></i> Admin Access</h4>
                </div>
                
                <div class="login-form">
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="admin-password" placeholder="Enter admin password">
                    </div>
                    
                    <div id="admin-error" class="error-message" style="display: none;">
                        <i class="fas fa-exclamation-circle"></i>
                        <span id="admin-error-text"></span>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="app.closeModal()">
                            Cancel
                        </button>
                        <button class="btn-primary" onclick="app.checkAdminPassword()">
                            Login
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.openModal('admin', modalContent);
    }
    
    async checkAdminPassword() {
        const password = document.getElementById('admin-password')?.value;
        const errorDiv = document.getElementById('admin-error');
        const errorText = document.getElementById('admin-error-text');
        
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
        const telegramId = telegramUser?.id?.toString();
        if (!telegramId || telegramId !== CONFIG.ADMIN.TELEGRAM_ID) {
            if (errorDiv && errorText) {
                errorText.textContent = 'Access denied: Invalid Telegram ID';
                errorDiv.style.display = 'block';
            }
            return;
        }
        
        // Grant admin access
        this.showAdminPanel();
        this.showNotification("👑 Admin access granted", "success");
    }
    
    showAdminPanel() {
        const modalContent = `
            <div class="admin-panel-modal">
                <div class="admin-header">
                    <h4><i class="fas fa-user-shield"></i> Admin Panel</h4>
                </div>
                
                <div class="admin-tabs">
                    <button class="tab-btn active" data-tab="deposits">
                        <i class="fas fa-download"></i> Deposits
                    </button>
                    <button class="tab-btn" data-tab="withdrawals">
                        <i class="fas fa-upload"></i> Withdrawals
                    </button>
                    <button class="tab-btn" data-tab="users">
                        <i class="fas fa-users"></i> Users
                    </button>
                </div>
                
                <div class="admin-content">
                    <div id="admin-deposits-tab" class="admin-tab active">
                        <h5>Pending Deposits</h5>
                        <div id="pending-deposits-list" class="admin-list">
                            <div class="loading-state">
                                <i class="fas fa-spinner fa-spin"></i>
                                <span>Loading...</span>
                            </div>
                        </div>
                    </div>
                    
                    <div id="admin-withdrawals-tab" class="admin-tab">
                        <h5>Pending Withdrawals</h5>
                        <div id="pending-withdrawals-list" class="admin-list">
                            <div class="loading-state">
                                <i class="fas fa-spinner fa-spin"></i>
                                <span>Loading...</span>
                            </div>
                        </div>
                    </div>
                    
                    <div id="admin-users-tab" class="admin-tab">
                        <h5>User Management</h5>
                        <div class="admin-form">
                            <div class="form-group">
                                <input type="text" id="admin-user-id" placeholder="User ID or Username">
                            </div>
                            <div class="form-group">
                                <input type="number" id="admin-amount" placeholder="Amount (AMSK)" min="1">
                            </div>
                            <button class="btn-primary" onclick="app.addUserBalance()">
                                <i class="fas fa-plus-circle"></i> Add Balance
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.openModal('admin', modalContent);
        this.loadAdminPendingRequests('deposits');
        
        // Setup tab switching
        setTimeout(() => {
            document.querySelectorAll('.admin-tabs .tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const tab = btn.dataset.tab;
                    document.querySelectorAll('.admin-tabs .tab-btn').forEach(b => b.classList.remove('active'));
                    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
                    
                    btn.classList.add('active');
                    document.getElementById(`admin-${tab}-tab`).classList.add('active');
                    
                    this.loadAdminPendingRequests(tab);
                });
            });
        }, 100);
    }
    
    async loadAdminPendingRequests(type) {
        if (!db) return;
        
        try {
            let collection = type === 'deposits' ? 'deposit_requests' : 'withdrawal_requests';
            let listId = `pending-${type}-list`;
            
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
                html += this.createAdminRequestItem(doc.id, data, type);
            });
            
            listElement.innerHTML = html;
            
        } catch (error) {
            console.error(`❌ Error loading pending ${type}:`, error);
            document.getElementById(`pending-${type}-list`).innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load ${type}</p>
                </div>
            `;
        }
    }
    
    createAdminRequestItem(docId, data, type) {
        const isDeposit = type === 'deposits';
        const date = new Date(data.timestamp).toLocaleString();
        
        return `
            <div class="admin-request-item">
                <div class="request-info">
                    <div class="request-user">${data.username || 'User'}</div>
                    <div class="request-amount">
                        ${data.amount} ${data.currency}
                        ${isDeposit ? `<small>TX: ${data.txid?.substring(0, 12)}...</small>` : ''}
                    </div>
                    <div class="request-date">${date}</div>
                    ${!isDeposit ? `<div class="request-address">${data.address?.substring(0, 16)}...</div>` : ''}
                </div>
                <div class="request-actions">
                    <button class="btn-success" onclick="app.approveRequest('${docId}', '${type}')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn-error" onclick="app.rejectRequest('${docId}', '${type}')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            </div>
        `;
    }
    
    async approveRequest(docId, type) {
        try {
            const isDeposit = type === 'deposits';
            const collection = isDeposit ? 'deposit_requests' : 'withdrawal_requests';
            
            const docRef = db.collection(collection).doc(docId);
            const docSnap = await docRef.get();
            
            if (!docSnap.exists) {
                this.showNotification("Request not found", "error");
                return;
            }
            
            const data = docSnap.data();
            const userRef = db.collection('users').doc(data.userId);
            
            if (isDeposit) {
                // For deposits: add balance to user
                const updateData = {};
                updateData[`balances.${data.currency}`] = firebase.firestore.FieldValue.increment(data.amount);
                
                await userRef.update(updateData);
                
                // Update deposit status
                await docRef.update({
                    status: 'approved',
                    approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    approvedBy: 'admin'
                });
                
                // Create transaction record
                await this.createTransactionRecord(data.userId, {
                    type: 'deposit',
                    amount: data.amount,
                    currency: data.currency,
                    details: 'Admin approved deposit'
                });
                
                this.showNotification(`✅ Deposit approved: ${data.amount} ${data.currency}`, "success");
                
            } else {
                // For withdrawals: mark as completed
                await docRef.update({
                    status: 'completed',
                    completedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    completedBy: 'admin'
                });
                
                // Create transaction record
                await this.createTransactionRecord(data.userId, {
                    type: 'withdraw',
                    amount: data.amount,
                    currency: data.currency,
                    details: 'Admin processed withdrawal'
                });
                
                this.showNotification(`✅ Withdrawal approved: ${data.amount} ${data.currency}`, "success");
            }
            
            // Reload the list
            this.loadAdminPendingRequests(type);
            
        } catch (error) {
            console.error(`❌ Error approving ${type} request:`, error);
            this.showNotification(`Failed to approve ${type}`, "error");
        }
    }
    
    async rejectRequest(docId, type) {
        const reason = prompt('Enter rejection reason:', 'Invalid information');
        if (!reason) return;
        
        try {
            const isDeposit = type === 'deposits';
            const collection = isDeposit ? 'deposit_requests' : 'withdrawal_requests';
            
            const docRef = db.collection(collection).doc(docId);
            const docSnap = await docRef.get();
            
            if (!docSnap.exists) {
                this.showNotification("Request not found", "error");
                return;
            }
            
            const data = docSnap.data();
            
            // For withdrawals: refund the fee
            if (!isDeposit) {
                const userRef = db.collection('users').doc(data.userId);
                await userRef.update({
                    'balances.USDT': firebase.firestore.FieldValue.increment(data.amount),
                    'balances.BNB': firebase.firestore.FieldValue.increment(data.fee || 0)
                });
            }
            
            // Update request status
            await docRef.update({
                status: 'rejected',
                rejectedAt: firebase.firestore.FieldValue.serverTimestamp(),
                rejectedBy: 'admin',
                rejectionReason: reason
            });
            
            // Create transaction record
            await this.createTransactionRecord(data.userId, {
                type: isDeposit ? 'deposit_reject' : 'withdraw_reject',
                amount: data.amount,
                currency: data.currency,
                details: `Rejected: ${reason}`
            });
            
            this.showNotification(`❌ ${type.slice(0, -1)} rejected`, "warning");
            
            // Reload the list
            this.loadAdminPendingRequests(type);
            
        } catch (error) {
            console.error(`❌ Error rejecting ${type} request:`, error);
            this.showNotification(`Failed to reject ${type}`, "error");
        }
    }
    
    async addUserBalance() {
        try {
            const userId = document.getElementById('admin-user-id')?.value;
            const amount = parseFloat(document.getElementById('admin-amount')?.value);
            
            if (!userId || !amount || amount <= 0) {
                this.showNotification("Please enter valid user ID and amount", "error");
                return;
            }
            
            // Find user
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
                this.showNotification("User not found", "error");
                return;
            }
            
            // Add balance
            await userRef.update({
                'balances.AMSK': firebase.firestore.FieldValue.increment(amount),
                'totalEarned': firebase.firestore.FieldValue.increment(amount)
            });
            
            // Clear inputs
            document.getElementById('admin-user-id').value = '';
            document.getElementById('admin-amount').value = '';
            
            // Show success
            this.showNotification(`✅ Added ${amount} AMSK to user`, "success");
            
            // Create transaction record
            await this.createTransactionRecord(userId, {
                type: 'admin_bonus',
                amount: amount,
                currency: 'AMSK',
                details: 'Admin added balance'
            });
            
        } catch (error) {
            console.error("❌ Error adding user balance:", error);
            this.showNotification("Failed to add balance", "error");
        }
    }
    
    // ============================================
    // TRANSACTION MANAGEMENT
    // ============================================
    async createTransaction(transactionData) {
        if (!db) return;
        
        try {
            const transaction = {
                userId: currentUser.id,
                username: currentUser.username,
                ...transactionData,
                timestamp: Date.now(),
                status: transactionData.status || 'completed'
            };
            
            await db.collection('transactions').add(transaction);
            
        } catch (error) {
            console.error("❌ Error creating transaction:", error);
        }
    }
    
    async createTransactionRecord(userId, transactionData) {
        if (!db) return;
        
        try {
            const transaction = {
                userId: userId,
                ...transactionData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'completed'
            };
            
            await db.collection('transactions').add(transaction);
            
        } catch (error) {
            console.error("❌ Error creating transaction record:", error);
        }
    }
    
    // ============================================
    // LOCAL STORAGE
    // ============================================
    async loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem(`alien_musk_${currentUser.id}`);
            
            if (savedData) {
                const parsed = JSON.parse(savedData);
                userData = parsed.userData;
                activeBoosters = parsed.activeBoosters || [];
                activeStakes = parsed.activeStakes || [];
                
                console.log("📂 Data loaded from localStorage");
            } else {
                // Create default data
                this.createDefaultData();
            }
        } catch (error) {
            console.error("❌ Error loading from localStorage:", error);
            this.createDefaultData();
        }
    }
    
    createDefaultData() {
        userData = {
            id: currentUser.id,
            balances: {
                AMSK: 2500,
                USDT: 100,
                BNB: 0.5,
                TON: 50
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
            }
        };
        
        activeBoosters = [];
        activeStakes = [];
    }
    
    saveToLocalStorage() {
        try {
            const dataToSave = {
                userData: userData,
                activeBoosters: activeBoosters,
                activeStakes: activeStakes,
                saveTime: Date.now()
            };
            
            localStorage.setItem(`alien_musk_${currentUser.id}`, JSON.stringify(dataToSave));
        } catch (error) {
            console.error("❌ Error saving to localStorage:", error);
        }
    }
    
    // ============================================
    // PAGE NAVIGATION
    // ============================================
    showPage(pageName) {
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
                this.updateMiningDisplay();
                break;
            case 'staking':
                this.updateStakingCalculator();
                this.updateActiveStakes();
                break;
            case 'wallet':
                this.updateWalletDisplay();
                break;
        }
    }
    
    // ============================================
    // MODAL MANAGEMENT
    // ============================================
    openModal(modalName, content = null) {
        // Close any open modal first
        this.closeModal();
        
        const modal = elements.modals[modalName];
        if (!modal) return;
        
        // Set content if provided
        if (content) {
            const modalBody = modal.querySelector('.modal-body');
            if (modalBody) {
                modalBody.innerHTML = content;
            }
        }
        
        // Show modal and overlay
        elements.modalOverlay.classList.add('active');
        modal.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        // Hide all modals
        Object.values(elements.modals).forEach(modal => {
            if (modal) modal.classList.remove('active');
        });
        
        // Hide overlay
        if (elements.modalOverlay) {
            elements.modalOverlay.classList.remove('active');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    // ============================================
    // NOTIFICATION SYSTEM
    // ============================================
    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = 'fa-info-circle';
        switch (type) {
            case 'success': icon = 'fa-check-circle'; break;
            case 'error': icon = 'fa-exclamation-circle'; break;
            case 'warning': icon = 'fa-exclamation-triangle'; break;
        }
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="notification-content">${message}</div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, CONFIG.UI.NOTIFICATION_DURATION);
    }
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
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
    
    formatTransactionType(type) {
        const types = {
            'deposit_request': 'Deposit Request',
            'deposit': 'Deposit',
            'withdrawal_request': 'Withdrawal Request',
            'withdraw': 'Withdrawal',
            'swap': 'Token Swap',
            'stake': 'Staking',
            'stake_reward': 'Staking Reward',
            'admin_bonus': 'Admin Bonus',
            'deposit_reject': 'Deposit Rejected',
            'withdraw_reject': 'Withdrawal Rejected'
        };
        
        return types[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
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
            this.showNotification('✅ Copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Copy error:', err);
            this.showNotification('Failed to copy', 'error');
        });
    }
    
    // ============================================
    // EVENT LISTENERS SETUP
    // ============================================
    setupEventListeners() {
        console.log("🎯 Setting up event listeners...");
        
        // Navigation buttons
        elements.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const page = btn.dataset.page;
                this.showPage(page);
            });
        });
        
        // Mining button
        if (elements.startMiningBtn) {
            elements.startMiningBtn.addEventListener('click', () => this.handleMiningAction());
        }
        
        // Upgrade buttons
        elements.upgradeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.upgrade-card');
                if (card) {
                    this.upgradeMiningLevel(card.dataset.level);
                }
            });
        });
        
        // Booster buttons
        elements.boosterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.booster-card');
                if (card) {
                    this.activateBooster(card.dataset.booster);
                }
            });
        });
        
        // Staking calculator
        if (elements.calcAmount && elements.calcDuration) {
            elements.calcAmount.addEventListener('input', () => this.updateStakingCalculator());
            elements.calcDuration.addEventListener('change', () => this.updateStakingCalculator());
        }
        
        // Stake buttons
        elements.stakeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const planId = btn.dataset.plan;
                this.openStakeModal(planId);
            });
        });
        
        // Quick actions
        elements.quickActions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });
        
        // Asset buttons
        elements.assetButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                const currency = btn.dataset.currency;
                this.handleAssetAction(action, currency);
            });
        });
        
        // Modal close buttons
        elements.modalCloseButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        
        // Modal overlay
        if (elements.modalOverlay) {
            elements.modalOverlay.addEventListener('click', (e) => {
                if (e.target === elements.modalOverlay) {
                    this.closeModal();
                }
            });
        }
        
        // Window events
        window.addEventListener('beforeunload', () => {
            this.saveUserData();
        });
        
        console.log("✅ Event listeners setup complete");
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
                this.openHistoryModal();
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
            case 'convert':
                if (currency === 'BNB' || currency === 'TON') {
                    // For BNB/TON, open swap modal with preset values
                    this.openSwapModal();
                    // Set the from currency to BNB/TON
                    setTimeout(() => {
                        document.getElementById('swap-from-currency').value = currency;
                        document.getElementById('swap-to-currency').value = 'AMSK';
                        this.updateSwapCalculation();
                    }, 100);
                }
                break;
        }
    }
    
    // ============================================
    // BACKGROUND SERVICES
    // ============================================
    startBackgroundServices() {
        // Start mining timer
        this.startMiningTimer();
        
        // Check for expired boosters every minute
        setInterval(() => {
            this.checkExpiredBoosters();
        }, 60000);
        
        // Auto-save every 30 seconds
        setInterval(() => {
            this.saveUserData();
        }, 30000);
        
        // Update user last active every minute
        setInterval(() => {
            if (userData) {
                userData.lastActive = new Date().toISOString();
            }
        }, 60000);
        
        console.log("⏱️ Background services started");
    }
    
    checkExpiredBoosters() {
        if (!activeBoosters.length) return;
        
        const now = Date.now();
        const validBoosters = activeBoosters.filter(booster => booster.expiresAt > now);
        
        if (validBoosters.length !== activeBoosters.length) {
            activeBoosters = validBoosters;
            userData.mining.activeBoosters = activeBoosters;
            this.updateMiningDisplay();
            this.saveUserData();
        }
    }
    
    // ============================================
    // LOADING SCREEN
    // ============================================
    hideLoading() {
        if (elements.loadingScreen) {
            elements.loadingScreen.classList.remove('active');
        }
        
        if (document.getElementById('app-container')) {
            document.getElementById('app-container').style.display = 'block';
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

console.log("👽 Alien Musk Platform v4.0 - Production Ready loaded!");

// ============================================
// END OF FILE
// ============================================

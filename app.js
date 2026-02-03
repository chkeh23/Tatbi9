/* ===========================================
   ALIEN MUSK - Ultimate Quantum Mining Platform
   Main Application JavaScript
   Version: 5.0.0 | Professional Edition
   =========================================== */

// Global Configuration
const CONFIG = {
    // Token Configuration
    TOKEN: {
        AMSK: {
            SYMBOL: 'AMSK',
            PRICE: 0.0002,
            DECIMALS: 0
        },
        USDT: {
            SYMBOL: 'USDT',
            PRICE: 1,
            DECIMALS: 2
        },
        BNB: {
            SYMBOL: 'BNB',
            PRICE: 300,
            DECIMALS: 4
        },
        TON: {
            SYMBOL: 'TON',
            PRICE: 2,
            DECIMALS: 2
        }
    },

    // Mining Configuration
    MINING: {
        BASE_REWARD: 2500,
        BASE_HASHRATE: 2500,
        DURATION: 3600000, // 1 hour
        COOLDOWN: 1000,
        
        LEVELS: {
            1: { name: 'Beginner', cost: 0, reward: 2500, hashrate: 2500, multiplier: 1 },
            2: { name: 'Advanced', cost: 5, reward: 5000, hashrate: 5000, multiplier: 2 },
            3: { name: 'Pro', cost: 20, reward: 10000, hashrate: 10000, multiplier: 4 },
            4: { name: 'Expert', cost: 100, reward: 25000, hashrate: 25000, multiplier: 10 }
        }
    },

    // Booster Configuration
    BOOSTERS: {
        '2x': { 
            name: 'Energy Booster', 
            multiplier: 2, 
            duration: 86400000, // 24 hours
            price: 10000,
            color: '#4CAF50'
        },
        '3x': { 
            name: 'Productivity Booster', 
            multiplier: 3, 
            duration: 43200000, // 12 hours
            price: 15000,
            color: '#2196F3'
        },
        '5x': { 
            name: 'VIP Booster', 
            multiplier: 5, 
            duration: 21600000, // 6 hours
            price: 25000,
            color: '#FF9800'
        }
    },

    // Staking Configuration
    STAKING: {
        MIN_AMOUNT: 10,
        
        PLANS: {
            1: { 
                id: 'silver',
                name: 'Silver Plan', 
                amount: 10, 
                duration: 7, 
                apr: 40, 
                dailyReward: 40,
                color: '#C0C0C0'
            },
            2: { 
                id: 'gold',
                name: 'Gold Plan', 
                amount: 50, 
                duration: 15, 
                apr: 50, 
                dailyReward: 250,
                color: '#FFD700'
            },
            3: { 
                id: 'diamond',
                name: 'Diamond Plan', 
                amount: 100, 
                duration: 30, 
                apr: 60, 
                dailyReward: 600,
                color: '#B9F2FF'
            }
        }
    },

    // Referral Configuration
    REFERRAL: {
        BASE_REWARD: 20000,
        
        MILESTONES: {
            10: { reward: 250000, bonus: 50000 },
            25: { reward: 1000000, bonus: 200000 },
            50: { reward: 5000000, bonus: 1000000 },
            100: { reward: 25000000, bonus: 5000000 }
        }
    },

    // Swap Configuration
    SWAP: {
        RATES: {
            AMSK_TO_USDT: 0.0002,
            USDT_TO_AMSK: 5000,
            BNB_TO_AMSK: 300000,
            TON_TO_AMSK: 2000
        },
        FEE: 0.01,
        MIN_AMSK_SWAP: 250000
    },

    // Wallet Configuration
    WALLET: {
        MIN_DEPOSIT: {
            USDT: 10,
            BNB: 0.02,
            TON: 10
        },
        MIN_WITHDRAWAL: 100,
        WITHDRAWAL_FEE: 0.0005,
        
        ADDRESSES: {
            USDT: '0x6870fA28376C86974f1Dc8F469d58D10d2EA4F58',
            BNB: '0x6870fA28376C86974f1Dc8F469d58D10d2EA4F58',
            TON: 'UQCJhJZ0VDm3ei6sljWtV5JO3dAGwca8mPGJ9yVPBtPJlier'
        }
    },

    // Admin Configuration
    ADMIN: {
        SECRET: 'ALIENMUSK2024',
        USER_ID: '1653918641',
        REQUESTS_PER_PAGE: 10
    },

    // UI Configuration
    UI: {
        ANIMATION_DURATION: 300,
        NOTIFICATION_DURATION: 4000,
        LOADING_DELAY: 1000
    }
};

/* ===========================================
   CORE APPLICATION CLASS
   =========================================== */

class AlienMuskApp {
    constructor() {
        this.app = null;
        this.isInitialized = false;
        this.currentPage = 'home';
        this.currentModal = null;
        this.timers = new Map();
        this.state = this.getInitialState();
        this.elements = new Map();
        this.transactions = [];
        this.activeBoosters = new Set();
        this.pendingRequests = new Map();
        this.notificationQueue = [];
        this.isProcessing = false;
        
        // Performance monitoring
        this.performance = {
            startTime: Date.now(),
            requests: 0,
            errors: 0,
            miningClicks: 0
        };
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    /* ===========================================
       INITIALIZATION
       =========================================== */

    async initialize() {
        console.log('🚀 Initializing Alien Musk Platform...');
        this.performance.startTime = Date.now();
        
        try {
            // Show loading screen
            this.showLoading();
            
            // Step 1: Initialize Telegram WebApp
            await this.initTelegramWebApp();
            
            // Step 2: Initialize Firebase (if available)
            await this.initFirebase();
            
            // Step 3: Cache DOM elements
            this.cacheElements();
            
            // Step 4: Load saved state
            await this.loadState();
            
            // Step 5: Initialize UI components
            this.initUI();
            
            // Step 6: Setup event listeners
            this.setupEventListeners();
            
            // Step 7: Start background services
            this.startServices();
            
            // Step 8: Setup admin access
            this.setupAdminAccess();
            
            // Mark as initialized
            this.isInitialized = true;
            
            // Hide loading with delay
            setTimeout(() => {
                this.hideLoading();
                this.showNotification('👽 Welcome to Alien Musk!', 'success');
                console.log('✅ Platform initialized successfully');
                this.logPerformance();
            }, CONFIG.UI.LOADING_DELAY);
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showNotification('Failed to initialize platform. Please refresh.', 'error');
            this.hideLoading();
        }
    }

    async initTelegramWebApp() {
        return new Promise((resolve) => {
            try {
                if (window.Telegram && window.Telegram.WebApp) {
                    this.tg = window.Telegram.WebApp;
                    
                    // Configure WebApp
                    this.tg.expand();
                    this.tg.enableClosingConfirmation();
                    this.tg.setHeaderColor('#0A0F1C');
                    this.tg.setBackgroundColor('#0A0F1C');
                    
                    // Initialize WebApp
                    this.tg.ready();
                    
                    // Get user data
                    const user = this.tg.initDataUnsafe?.user;
                    if (user) {
                        this.state.user = {
                            id: user.id.toString(),
                            username: user.username || `user_${user.id}`,
                            firstName: user.first_name || 'User',
                            lastName: user.last_name || '',
                            photoUrl: user.photo_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=alien',
                            language: user.language_code || 'en',
                            isPremium: user.is_premium || false
                        };
                        
                        // Generate referral code from username
                        this.state.referral.code = this.generateReferralCode(user.username || user.id);
                    }
                    
                    console.log('✅ Telegram WebApp initialized:', this.state.user);
                } else {
                    console.warn('⚠️ Telegram WebApp not detected, using mock data');
                    this.tg = {
                        initDataUnsafe: {
                            user: {
                                id: '1653918641',
                                username: 'alien_musk_user',
                                first_name: 'Alien',
                                last_name: 'Musk',
                                photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alien'
                            }
                        },
                        expand: () => {},
                        ready: () => {},
                        enableClosingConfirmation: () => {},
                        setHeaderColor: () => {},
                        setBackgroundColor: () => {}
                    };
                    
                    this.state.user = {
                        id: '1653918641',
                        username: 'alien_musk_user',
                        firstName: 'Alien',
                        lastName: 'Musk',
                        photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alien',
                        language: 'en',
                        isPremium: true
                    };
                    
                    this.state.referral.code = 'ALIEN-M7B9X2';
                }
                
                resolve();
            } catch (error) {
                console.error('Telegram WebApp init error:', error);
                resolve(); // Continue even if Telegram fails
            }
        });
    }

    async initFirebase() {
        return new Promise((resolve) => {
            try {
                // Check if Firebase is available
                if (typeof firebase === 'undefined') {
                    console.log('ℹ️ Firebase not loaded, using localStorage');
                    this.useLocalStorage = true;
                    resolve();
                    return;
                }
                
                // Firebase configuration
                const firebaseConfig = {
                    apiKey: "AIzaSyDummyKeyForDemoOnly",
                    authDomain: "alien-musk.firebaseapp.com",
                    projectId: "alien-musk",
                    storageBucket: "alien-musk.appspot.com",
                    messagingSenderId: "1234567890",
                    appId: "1:1234567890:web:abcdef1234567890"
                };
                
                // Initialize Firebase
                firebase.initializeApp(firebaseConfig);
                this.db = firebase.firestore();
                
                // Enable offline persistence
                this.db.enablePersistence()
                    .catch((err) => {
                        console.warn('Firebase persistence error:', err);
                    });
                
                console.log('✅ Firebase initialized');
                this.useLocalStorage = false;
                resolve();
                
            } catch (error) {
                console.warn('⚠️ Firebase initialization failed, using localStorage:', error);
                this.useLocalStorage = true;
                resolve();
            }
        });
    }

    getInitialState() {
        return {
            // User Information
            user: {
                id: '',
                username: '',
                firstName: '',
                lastName: '',
                photoUrl: '',
                language: 'en',
                isPremium: false,
                joinedAt: new Date().toISOString(),
                lastActive: new Date().toISOString()
            },
            
            // Wallet Balances
            balances: {
                AMSK: 2500,
                USDT: 100.00,
                BNB: 0.5,
                TON: 50
            },
            
            // Mining State
            mining: {
                level: 1,
                isActive: true,
                lastReward: Date.now(),
                nextReward: Date.now() + CONFIG.MINING.DURATION,
                totalMined: 2500,
                minedToday: 2500,
                totalTime: 0,
                efficiency: 1.0,
                activeBoosters: [],
                lastUpgrade: Date.now()
            },
            
            // Staking State
            staking: {
                activeStakes: [],
                completedStakes: [],
                totalEarned: 0,
                totalStaked: 0,
                totalProfit: 0
            },
            
            // Referral State
            referral: {
                code: '',
                referrals: [],
                totalCount: 0,
                earned: 0,
                claimedMilestones: [],
                lastReferral: null
            },
            
            // Transaction History
            transactions: {
                deposits: [],
                withdrawals: [],
                swaps: [],
                stakes: [],
                claims: []
            },
            
            // System State
            system: {
                version: '5.0.0',
                lastSync: null,
                notifications: 0,
                settings: {
                    sound: true,
                    vibration: true,
                    autoClaim: false,
                    theme: 'dark'
                }
            },
            
            // Admin State
            admin: {
                isLoggedIn: false,
                pendingDeposits: [],
                pendingWithdrawals: [],
                userManagement: [],
                systemStats: {
                    totalUsers: 1,
                    totalVolume: 0,
                    totalProfit: 0,
                    activeMining: 1
                }
            }
        };
    }

    cacheElements() {
        console.log('🔍 Caching DOM elements...');
        
        const cache = (id) => document.getElementById(id);
        const cacheAll = (selector) => document.querySelectorAll(selector);
        
        // Loading Screen
        this.elements.set('loadingScreen', cache('loading-screen'));
        this.elements.set('loadingProgress', cache('loading-progress'));
        
        // Header Elements
        this.elements.set('headerBalance', cache('header-balance'));
        this.elements.set('notificationCount', cache('notification-count'));
        this.elements.set('userAvatar', cache('user-avatar'));
        this.elements.set('homeAvatar', cache('home-avatar'));
        
        // Navigation
        this.elements.set('navButtons', cacheAll('.nav-btn'));
        this.elements.set('bottomNav', document.querySelector('.bottom-nav'));
        
        // Pages
        this.elements.set('pages', cacheAll('.page'));
        this.elements.set('homePage', cache('home-page'));
        this.elements.set('stakingPage', cache('staking-page'));
        this.elements.set('walletPage', cache('wallet-page'));
        
        // Home Page Elements
        this.elements.set('username', cache('username'));
        this.elements.set('userId', cache('user-id'));
        this.elements.set('totalAmsk', cache('total-amsk'));
        this.elements.set('usdEquivalent', cache('usd-equivalent'));
        this.elements.set('currentHashrate', cache('current-hashrate'));
        this.elements.set('miningTimer', cache('mining-timer'));
        this.elements.set('nextReward', cache('next-reward'));
        this.elements.set('startMiningBtn', cache('start-mining'));
        this.elements.set('minedToday', cache('mined-today'));
        this.elements.set('totalMined', cache('total-mined'));
        this.elements.set('stakingEarned', cache('staking-earned'));
        this.elements.set('miningLevel', cache('mining-level'));
        
        // Upgrade Cards
        this.elements.set('upgradeCards', cacheAll('.upgrade-card'));
        this.elements.set('upgradeButtons', cacheAll('.upgrade-btn'));
        
        // Booster Cards
        this.elements.set('boosterCards', cacheAll('.booster-card'));
        this.elements.set('boosterButtons', cacheAll('.booster-btn'));
        
        // Referral Elements
        this.elements.set('refCount', cache('ref-count'));
        this.elements.set('totalRefs', cache('total-refs'));
        this.elements.set('refEarned', cache('ref-earned'));
        this.elements.set('nextGoal', cache('next-goal'));
        this.elements.set('progressText', cache('progress-text'));
        this.elements.set('progressFill', cache('progress-fill'));
        this.elements.set('goalReward', cache('goal-reward'));
        this.elements.set('refCode', cache('ref-code'));
        this.elements.set('copyRefCode', cache('copy-ref-code'));
        this.elements.set('shareRef', cache('share-ref'));
        
        // Staking Page Elements
        this.elements.set('activeStakesList', cache('active-stakes-list'));
        this.elements.set('stakeButtons', cacheAll('.stake-btn'));
        this.elements.set('planCards', cacheAll('.plan-card'));
        
        // Wallet Page Elements
        this.elements.set('walletTotalAmsk', cache('wallet-total-amsk'));
        this.elements.set('walletTotalUsd', cache('wallet-total-usd'));
        this.elements.set('walletAmsk', cache('wallet-amsk'));
        this.elements.set('walletAmskValue', cache('wallet-amsk-value'));
        this.elements.set('walletUsdt', cache('wallet-usdt'));
        this.elements.set('walletUsdtValue', cache('wallet-usdt-value'));
        this.elements.set('quickButtons', cacheAll('.quick-btn'));
        this.elements.set('assetActionButtons', cacheAll('.asset-action-btn'));
        
        // Modals
        this.elements.set('modalOverlay', cache('modal-overlay'));
        this.elements.set('depositModal', cache('deposit-modal'));
        this.elements.set('withdrawModal', cache('withdraw-modal'));
        this.elements.set('swapModal', cache('swap-modal'));
        this.elements.set('stakeModal', cache('stake-modal'));
        this.elements.set('boosterModal', cache('booster-modal'));
        this.elements.set('closeModalButtons', cacheAll('.close-modal'));
        
        // Admin Panel
        this.elements.set('adminPanel', cache('admin-panel'));
        
        // Notification Center
        this.elements.set('notificationCenter', cache('notification-center'));
        
        console.log(`✅ Cached ${this.elements.size} elements`);
    }

    initUI() {
        console.log('🎨 Initializing UI...');
        
        // Initialize AOS animations
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 400,
                once: true,
                offset: 100,
                delay: 50
            });
        }
        
        // Set user information
        this.updateUserInfo();
        
        // Update all UI components
        this.updateHeader();
        this.updateHomePage();
        this.updateStakingPage();
        this.updateWalletPage();
        
        // Show home page initially
        this.showPage('home');
        
        // Update loading progress
        this.updateLoadingProgress(100);
        
        console.log('✅ UI initialized');
    }

    updateUserInfo() {
        const user = this.state.user;
        
        // Update username
        if (this.elements.get('username')) {
            this.elements.get('username').textContent = user.firstName;
        }
        
        // Update user ID
        if (this.elements.get('userId')) {
            this.elements.get('userId').textContent = user.id.substring(0, 8);
        }
        
        // Update avatars
        [this.elements.get('userAvatar'), this.elements.get('homeAvatar')].forEach(avatar => {
            if (avatar) {
                avatar.src = user.photoUrl;
                avatar.alt = user.firstName;
            }
        });
    }

    /* ===========================================
       PAGE MANAGEMENT
       =========================================== */

    showPage(pageName) {
        if (this.currentPage === pageName && this.isInitialized) return;
        
        console.log(`📱 Switching to page: ${pageName}`);
        
        // Hide all pages
        this.elements.get('pages').forEach(page => {
            page.style.display = 'none';
            page.classList.remove('active');
        });
        
        // Update navigation buttons
        this.elements.get('navButtons').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.page === pageName) {
                btn.classList.add('active');
            }
        });
        
        // Show selected page
        const pageElement = this.elements.get(`${pageName}Page`);
        if (pageElement) {
            pageElement.style.display = 'block';
            pageElement.classList.add('active');
            
            // Add fade-in animation
            pageElement.style.opacity = '0';
            pageElement.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                pageElement.style.transition = 'all 0.3s ease';
                pageElement.style.opacity = '1';
                pageElement.style.transform = 'translateY(0)';
            }, 10);
        }
        
        // Update current page
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
        
        // Log page view
        this.logEvent('page_view', { page: pageName });
    }

    /* ===========================================
       HEADER UPDATES
       =========================================== */

    updateHeader() {
        // Update total balance
        const totalBalance = this.calculateTotalBalance();
        if (this.elements.get('headerBalance')) {
            this.elements.get('headerBalance').textContent = `$${this.formatNumber(totalBalance, 2)}`;
        }
        
        // Update notification count
        const pendingCount = this.state.admin.pendingDeposits.length + 
                           this.state.admin.pendingWithdrawals.length;
        if (this.elements.get('notificationCount')) {
            this.elements.get('notificationCount').textContent = pendingCount > 0 ? pendingCount : '';
            this.elements.get('notificationCount').style.display = pendingCount > 0 ? 'flex' : 'none';
        }
    }

    calculateTotalBalance() {
        const { AMSK, USDT, BNB, TON } = this.state.balances;
        
        const amskValue = AMSK * CONFIG.TOKEN.AMSK.PRICE;
        const usdtValue = USDT * CONFIG.TOKEN.USDT.PRICE;
        const bnbValue = BNB * CONFIG.TOKEN.BNB.PRICE;
        const tonValue = TON * CONFIG.TOKEN.TON.PRICE;
        
        return amskValue + usdtValue + bnbValue + tonValue;
    }

    /* ===========================================
       HOME PAGE UPDATES
       =========================================== */

    updateHomePage() {
        // Update total balance
        const totalAMSK = this.state.balances.AMSK;
        if (this.elements.get('totalAmsk')) {
            this.elements.get('totalAmsk').textContent = this.formatNumber(totalAMSK);
        }
        
        if (this.elements.get('usdEquivalent')) {
            this.elements.get('usdEquivalent').textContent = this.formatNumber(totalAMSK * CONFIG.TOKEN.AMSK.PRICE, 2);
        }
        
        // Update mining information
        const miningLevel = CONFIG.MINING.LEVELS[this.state.mining.level];
        if (this.elements.get('currentHashrate')) {
            this.elements.get('currentHashrate').textContent = this.formatNumber(this.calculateCurrentHashrate());
        }
        
        if (this.elements.get('nextReward')) {
            const reward = this.calculateNextReward();
            this.elements.get('nextReward').textContent = this.formatNumber(reward);
        }
        
        // Update mining stats
        if (this.elements.get('minedToday')) {
            this.elements.get('minedToday').textContent = this.formatNumber(this.state.mining.minedToday);
        }
        
        if (this.elements.get('totalMined')) {
            this.elements.get('totalMined').textContent = this.formatNumber(this.state.mining.totalMined);
        }
        
        if (this.elements.get('stakingEarned')) {
            this.elements.get('stakingEarned').textContent = this.formatNumber(this.state.staking.totalEarned);
        }
        
        if (this.elements.get('miningLevel')) {
            this.elements.get('miningLevel').textContent = this.state.mining.level;
        }
        
        // Update mining levels
        this.updateMiningLevels();
        
        // Update mining button
        this.updateMiningButton();
        
        // Update referral information
        this.updateReferralInfo();
        
        // Update boosters
        this.updateBoostersDisplay();
    }

    calculateCurrentHashrate() {
        const baseHashrate = CONFIG.MINING.LEVELS[this.state.mining.level].hashrate;
        let multiplier = 1;
        
        // Apply active boosters
        this.state.mining.activeBoosters.forEach(booster => {
            multiplier *= booster.multiplier;
        });
        
        return baseHashrate * multiplier;
    }

    calculateNextReward() {
        const baseReward = CONFIG.MINING.LEVELS[this.state.mining.level].reward;
        let multiplier = 1;
        
        // Apply active boosters
        this.state.mining.activeBoosters.forEach(booster => {
            multiplier *= booster.multiplier;
        });
        
        return baseReward * multiplier;
    }

    updateMiningLevels() {
        this.elements.get('upgradeCards').forEach(card => {
            const level = parseInt(card.dataset.level);
            const levelData = CONFIG.MINING.LEVELS[level];
            const isCurrentLevel = level === this.state.mining.level;
            const canAfford = this.state.balances.USDT >= levelData.cost;
            
            const button = card.querySelector('.upgrade-btn');
            if (!button) return;
            
            if (isCurrentLevel) {
                button.textContent = 'Active';
                button.classList.add('active-btn');
                button.disabled = true;
                card.classList.add('active');
            } else if (level < this.state.mining.level) {
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

    updateMiningButton() {
        const button = this.elements.get('startMiningBtn');
        if (!button) return;
        
        const now = Date.now();
        const isRewardReady = now >= this.state.mining.nextReward;
        
        if (!this.state.mining.isActive) {
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

    updateBoostersDisplay() {
        this.elements.get('boosterCards').forEach(card => {
            const boosterType = card.dataset.booster;
            const booster = CONFIG.BOOSTERS[boosterType];
            
            if (!booster) return;
            
            const button = card.querySelector('.booster-btn');
            if (!button) return;
            
            // Check if booster is already active
            const isActive = this.state.mining.activeBoosters.some(b => b.type === boosterType);
            const canAfford = this.state.balances.AMSK >= booster.price;
            
            if (isActive) {
                button.textContent = 'Active';
                button.disabled = true;
                button.classList.add('active-btn');
                card.classList.add('active');
            } else {
                button.textContent = canAfford ? 'Activate' : `${booster.price} AMSK`;
                button.disabled = !canAfford;
                button.classList.remove('active-btn');
                card.classList.remove('active');
            }
        });
    }

    /* ===========================================
       STAKING PAGE UPDATES
       =========================================== */

    updateStakingPage() {
        // Update active stakes list
        this.updateActiveStakesList();
        
        // Update staking plans
        this.updateStakingPlans();
        
        // Update staking calculator if exists
        this.updateStakingCalculator();
    }

    updateActiveStakesList() {
        const listElement = this.elements.get('activeStakesList');
        if (!listElement) return;
        
        const stakes = this.state.staking.activeStakes;
        
        if (stakes.length === 0) {
            listElement.innerHTML = `
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
            
            const startDate = new Date(stake.startTime);
            const endDate = new Date(stake.endTime);
            const now = Date.now();
            
            // Calculate progress
            const totalDuration = stake.endTime - stake.startTime;
            const elapsed = now - stake.startTime;
            const progress = Math.min((elapsed / totalDuration) * 100, 100);
            
            // Calculate earned rewards
            const daysPassed = Math.floor(elapsed / (1000 * 60 * 60 * 24));
            const earned = daysPassed * plan.dailyReward;
            
            html += `
                <div class="stake-item" data-index="${index}">
                    <div class="stake-header">
                        <div class="stake-plan">
                            <div class="plan-icon ${plan.id}">
                                <i class="fas fa-gem"></i>
                            </div>
                            <div class="plan-info">
                                <h5>${plan.name}</h5>
                                <span class="plan-amount">${plan.amount} USDT</span>
                            </div>
                        </div>
                        <div class="stake-status">
                            <span class="status-badge active">Active</span>
                        </div>
                    </div>
                    
                    <div class="stake-progress">
                        <div class="progress-info">
                            <span>${Math.round(progress)}%</span>
                            <span>${this.formatDate(endDate)}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                    
                    <div class="stake-details">
                        <div class="detail">
                            <span class="label">Duration:</span>
                            <span class="value">${plan.duration} Days</span>
                        </div>
                        <div class="detail">
                            <span class="label">APR:</span>
                            <span class="value">${plan.apr}%</span>
                        </div>
                        <div class="detail">
                            <span class="label">Earned:</span>
                            <span class="value">${this.formatNumber(earned)} AMSK</span>
                        </div>
                        <div class="detail">
                            <span class="label">Ends in:</span>
                            <span class="value">${Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))} Days</span>
                        </div>
                    </div>
                    
                    <div class="stake-actions">
                        <button class="claim-btn" data-index="${index}" ${earned === 0 ? 'disabled' : ''}>
                            <i class="fas fa-gift"></i>
                            Claim Rewards
                        </button>
                    </div>
                </div>
            `;
        });
        
        listElement.innerHTML = html;
        
        // Add event listeners to claim buttons
        listElement.querySelectorAll('.claim-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.claimStakingReward(index);
            });
        });
    }

    updateStakingPlans() {
        this.elements.get('planCards').forEach(card => {
            const planId = parseInt(card.dataset.plan);
            const plan = CONFIG.STAKING.PLANS[planId];
            
            if (!plan) return;
            
            const button = card.querySelector('.stake-btn');
            if (!button) return;
            
            // Check if user has enough balance
            const canAfford = this.state.balances.USDT >= plan.amount;
            
            button.disabled = !canAfford;
            button.textContent = canAfford ? 'Stake Now' : `${plan.amount} USDT Required`;
        });
    }

    updateStakingCalculator() {
        // This would update a staking calculator if present
        // For now, we'll just log that it's being updated
        console.log('Updating staking calculator...');
    }

    /* ===========================================
       WALLET PAGE UPDATES
       =========================================== */

    updateWalletPage() {
        // Update total portfolio
        const totalAMSK = this.state.balances.AMSK;
        if (this.elements.get('walletTotalAmsk')) {
            this.elements.get('walletTotalAmsk').textContent = this.formatNumber(totalAMSK);
        }
        
        if (this.elements.get('walletTotalUsd')) {
            this.elements.get('walletTotalUsd').textContent = this.formatNumber(totalAMSK * CONFIG.TOKEN.AMSK.PRICE, 2);
        }
        
        // Update AMSK balance
        if (this.elements.get('walletAmsk')) {
            this.elements.get('walletAmsk').textContent = this.formatNumber(this.state.balances.AMSK);
        }
        
        if (this.elements.get('walletAmskValue')) {
            this.elements.get('walletAmskValue').textContent = this.formatNumber(this.state.balances.AMSK * CONFIG.TOKEN.AMSK.PRICE, 2);
        }
        
        // Update USDT balance
        if (this.elements.get('walletUsdt')) {
            this.elements.get('walletUsdt').textContent = this.formatNumber(this.state.balances.USDT, 2);
        }
        
        if (this.elements.get('walletUsdtValue')) {
            this.elements.get('walletUsdtValue').textContent = this.formatNumber(this.state.balances.USDT, 2);
        }
        
        // Update quick actions
        this.updateQuickActions();
        
        // Update transaction history if exists
        this.updateTransactionHistory();
    }

    updateQuickActions() {
        this.elements.get('quickButtons').forEach(button => {
            const action = button.dataset.action;
            
            // Disable withdraw if balance is insufficient
            if (action === 'withdraw' && this.state.balances.USDT < CONFIG.WALLET.MIN_WITHDRAWAL) {
                button.classList.add('disabled');
                button.title = `Minimum ${CONFIG.WALLET.MIN_WITHDRAWAL} USDT required`;
            } else {
                button.classList.remove('disabled');
                button.title = '';
            }
        });
    }

    updateTransactionHistory() {
        // This would update the transaction history section
        // For now, we'll just log that it's being updated
        console.log('Updating transaction history...');
    }

    /* ===========================================
       REFERRAL SYSTEM
       =========================================== */

    updateReferralInfo() {
        const refData = this.state.referral;
        
        // Update referral counts
        if (this.elements.get('refCount')) {
            this.elements.get('refCount').textContent = refData.totalCount;
        }
        
        if (this.elements.get('totalRefs')) {
            this.elements.get('totalRefs').textContent = refData.totalCount;
        }
        
        if (this.elements.get('refEarned')) {
            this.elements.get('refEarned').textContent = `${this.formatNumber(refData.earned)} AMSK`;
        }
        
        // Update referral code
        if (this.elements.get('refCode')) {
            this.elements.get('refCode').textContent = refData.code;
        }
        
        // Find next milestone
        let nextMilestone = 10;
        let milestoneReward = 250000;
        
        const milestones = Object.keys(CONFIG.REFERRAL.MILESTONES).map(Number).sort((a, b) => a - b);
        for (const milestone of milestones) {
            if (refData.totalCount < milestone) {
                nextMilestone = milestone;
                milestoneReward = CONFIG.REFERRAL.MILESTONES[milestone].reward;
                break;
            }
        }
        
        // Update progress
        const progress = Math.min((refData.totalCount / nextMilestone) * 100, 100);
        
        if (this.elements.get('nextGoal')) {
            this.elements.get('nextGoal').textContent = `${nextMilestone} Referrals`;
        }
        
        if (this.elements.get('progressText')) {
            this.elements.get('progressText').textContent = `${Math.round(progress)}%`;
        }
        
        if (this.elements.get('progressFill')) {
            this.elements.get('progressFill').style.width = `${progress}%`;
        }
        
        if (this.elements.get('goalReward')) {
            this.elements.get('goalReward').textContent = `${this.formatNumber(milestoneReward)} AMSK`;
        }
    }

    /* ===========================================
       MINING SYSTEM
       =========================================== */

    handleMining() {
        this.performance.miningClicks++;
        
        if (!this.state.mining.isActive) {
            this.startMining();
            return;
        }
        
        const now = Date.now();
        if (now >= this.state.mining.nextReward) {
            this.claimMiningReward();
        } else {
            this.showNotification('⏳ Mining in progress. Reward not ready yet.', 'info');
        }
    }

    startMining() {
        this.state.mining.isActive = true;
        this.state.mining.lastReward = Date.now();
        this.state.mining.nextReward = Date.now() + CONFIG.MINING.DURATION;
        
        this.updateMiningButton();
        this.updateHomePage();
        
        // Start mining animation
        this.startMiningAnimation();
        
        this.showNotification('⚡ Mining started successfully!', 'success');
        this.logEvent('mining_started', { level: this.state.mining.level });
        
        this.saveState();
    }

    claimMiningReward() {
        const reward = this.calculateNextReward();
        
        // Add reward to balance
        this.state.balances.AMSK += reward;
        this.state.mining.totalMined += reward;
        this.state.mining.minedToday += reward;
        
        // Calculate time difference
        const timeDiff = Date.now() - this.state.mining.lastReward;
        this.state.mining.totalTime += timeDiff;
        
        // Update efficiency
        this.state.mining.efficiency = (this.state.mining.totalMined / this.state.mining.totalTime) * 1000;
        
        // Reset timer
        this.state.mining.lastReward = Date.now();
        this.state.mining.nextReward = Date.now() + CONFIG.MINING.DURATION;
        
        // Update UI
        this.updateHomePage();
        this.updateWalletPage();
        this.updateHeader();
        
        // Show reward animation
        this.showRewardAnimation(reward);
        
        // Show notification
        this.showNotification(`💰 Claimed ${this.formatNumber(reward)} AMSK from mining!`, 'success');
        
        // Log event
        this.logEvent('mining_reward_claimed', { 
            amount: reward, 
            level: this.state.mining.level,
            efficiency: this.state.mining.efficiency 
        });
        
        // Save state
        this.saveState();
    }

    upgradeMining(level) {
        level = parseInt(level);
        const levelData = CONFIG.MINING.LEVELS[level];
        
        if (!levelData) {
            this.showNotification('Invalid mining level', 'error');
            return;
        }
        
        if (level <= this.state.mining.level) {
            this.showNotification('Already at or above this level!', 'warning');
            return;
        }
        
        if (this.state.balances.USDT < levelData.cost) {
            this.showNotification(`Insufficient USDT. Need ${levelData.cost} USDT.`, 'error');
            return;
        }
        
        // Deduct cost
        this.state.balances.USDT -= levelData.cost;
        this.state.mining.level = level;
        this.state.mining.lastUpgrade = Date.now();
        
        // Update UI
        this.updateHomePage();
        this.updateWalletPage();
        this.updateHeader();
        
        // Show upgrade animation
        this.showUpgradeAnimation(levelData.name);
        
        // Show notification
        this.showNotification(`⚡ Upgraded to ${levelData.name} level!`, 'success');
        
        // Log event
        this.logEvent('mining_upgraded', { 
            from: this.state.mining.level - 1, 
            to: level, 
            cost: levelData.cost 
        });
        
        // Save state
        this.saveState();
    }

    /* ===========================================
       BOOSTER SYSTEM
       =========================================== */

    activateBooster(boosterType) {
        const booster = CONFIG.BOOSTERS[boosterType];
        
        if (!booster) {
            this.showNotification('Booster not found!', 'error');
            return;
        }
        
        // Check if already has this booster active
        const hasBooster = this.state.mining.activeBoosters.some(b => b.type === boosterType);
        if (hasBooster) {
            this.showNotification('This booster is already active!', 'warning');
            return;
        }
        
        // Check balance
        if (this.state.balances.AMSK < booster.price) {
            this.showNotification(`Insufficient AMSK. Need ${booster.price} AMSK.`, 'error');
            return;
        }
        
        // Deduct price
        this.state.balances.AMSK -= booster.price;
        
        // Add booster
        this.state.mining.activeBoosters.push({
            type: boosterType,
            multiplier: booster.multiplier,
            activatedAt: Date.now(),
            expiresAt: Date.now() + booster.duration
        });
        
        // Update UI
        this.updateHomePage();
        this.updateWalletPage();
        this.updateHeader();
        
        // Show booster animation
        this.showBoosterAnimation(boosterType);
        
        // Show notification
        this.showNotification(`⚡ ${booster.name} activated! Mining speed ×${booster.multiplier}`, 'success');
        
        // Log event
        this.logEvent('booster_activated', { 
            type: boosterType, 
            multiplier: booster.multiplier,
            price: booster.price 
        });
        
        // Save state
        this.saveState();
    }

    updateActiveBoosters() {
        const now = Date.now();
        const activeBoosters = this.state.mining.activeBoosters.filter(booster => {
            if (booster.expiresAt <= now) {
                // Booster expired
                this.showNotification(`⏰ ${CONFIG.BOOSTERS[booster.type]?.name || 'Booster'} expired`, 'info');
                return false;
            }
            return true;
        });
        
        if (activeBoosters.length !== this.state.mining.activeBoosters.length) {
            this.state.mining.activeBoosters = activeBoosters;
            this.updateHomePage();
            this.saveState();
        }
    }

    /* ===========================================
       STAKING SYSTEM
       =========================================== */

    openStakeModal(planId) {
        const plan = CONFIG.STAKING.PLANS[planId];
        if (!plan) return;
        
        this.currentPlan = plan;
        
        // Create modal content
        const modalContent = `
            <div class="stake-modal-content">
                <div class="selected-plan">
                    <div class="plan-header">
                        <div class="plan-icon ${plan.id}">
                            <i class="fas fa-gem"></i>
                        </div>
                        <div class="plan-info">
                            <h4>${plan.name}</h4>
                            <div class="plan-minimum">Minimum: ${plan.amount} USDT</div>
                        </div>
                    </div>
                </div>
                
                <div class="stake-form">
                    <div class="form-group">
                        <label for="stake-amount">Amount to Stake (USDT)</label>
                        <div class="input-with-max">
                            <input type="number" 
                                   id="stake-amount" 
                                   value="${plan.amount}" 
                                   min="${plan.amount}" 
                                   step="1"
                                   placeholder="Enter amount">
                            <button class="max-btn" id="max-stake">MAX</button>
                        </div>
                        <div class="balance-info">
                            Available: <span id="available-usdt">${this.formatNumber(this.state.balances.USDT, 2)}</span> USDT
                        </div>
                    </div>
                    
                    <div class="stake-preview">
                        <div class="preview-header">Staking Preview</div>
                        <div class="preview-item">
                            <span>Duration:</span>
                            <span id="stake-duration">${plan.duration} Days</span>
                        </div>
                        <div class="preview-item">
                            <span>APR:</span>
                            <span id="stake-apr">${plan.apr}%</span>
                        </div>
                        <div class="preview-item">
                            <span>Daily Reward:</span>
                            <span id="stake-daily">${plan.dailyReward} AMSK</span>
                        </div>
                        <div class="preview-item">
                            <span>Total Reward:</span>
                            <span id="stake-total">${this.formatNumber(plan.dailyReward * plan.duration)} AMSK</span>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="modal-btn secondary" id="cancel-stake">Cancel</button>
                        <button class="modal-btn primary" id="confirm-stake">Confirm & Stake</button>
                    </div>
                </div>
            </div>
        `;
        
        // Set modal content
        const modalBody = this.elements.get('stakeModal').querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = modalContent;
        }
        
        // Open modal
        this.openModal('stake-modal');
        
        // Setup modal event listeners
        this.setupStakeModalEvents(plan);
    }

    setupStakeModalEvents(plan) {
        const stakeAmountInput = document.getElementById('stake-amount');
        const maxButton = document.getElementById('max-stake');
        const cancelButton = document.getElementById('cancel-stake');
        const confirmButton = document.getElementById('confirm-stake');
        
        if (!stakeAmountInput || !maxButton || !cancelButton || !confirmButton) return;
        
        // Set max value
        maxButton.addEventListener('click', () => {
            stakeAmountInput.value = this.state.balances.USDT;
            this.updateStakePreview();
        });
        
        // Update preview on input
        stakeAmountInput.addEventListener('input', () => {
            this.updateStakePreview();
        });
        
        // Cancel button
        cancelButton.addEventListener('click', () => {
            this.closeModal();
        });
        
        // Confirm button
        confirmButton.addEventListener('click', () => {
            this.confirmStaking(plan);
        });
        
        // Initial preview update
        this.updateStakePreview();
    }

    updateStakePreview() {
        const stakeAmountInput = document.getElementById('stake-amount');
        if (!stakeAmountInput || !this.currentPlan) return;
        
        const amount = parseFloat(stakeAmountInput.value) || this.currentPlan.amount;
        const plan = this.currentPlan;
        
        // Calculate daily reward based on amount
        const dailyReward = (amount / plan.amount) * plan.dailyReward;
        const totalReward = dailyReward * plan.duration;
        
        // Update preview elements
        const stakeDaily = document.getElementById('stake-daily');
        const stakeTotal = document.getElementById('stake-total');
        
        if (stakeDaily) {
            stakeDaily.textContent = `${this.formatNumber(dailyReward)} AMSK`;
        }
        
        if (stakeTotal) {
            stakeTotal.textContent = `${this.formatNumber(totalReward)} AMSK`;
        }
        
        // Update confirm button state
        const confirmButton = document.getElementById('confirm-stake');
        if (confirmButton) {
            const hasBalance = this.state.balances.USDT >= amount;
            const isMinimum = amount >= plan.amount;
            
            confirmButton.disabled = !(hasBalance && isMinimum);
            
            if (!hasBalance) {
                confirmButton.textContent = 'Insufficient USDT';
            } else if (!isMinimum) {
                confirmButton.textContent = `Minimum ${plan.amount} USDT`;
            } else {
                confirmButton.textContent = 'Confirm & Stake';
            }
        }
    }

    confirmStaking(plan) {
        const stakeAmountInput = document.getElementById('stake-amount');
        if (!stakeAmountInput) return;
        
        const amount = parseFloat(stakeAmountInput.value);
        
        // Validations
        if (amount < plan.amount) {
            this.showNotification(`Minimum stake amount is ${plan.amount} USDT`, 'error');
            return;
        }
        
        if (this.state.balances.USDT < amount) {
            this.showNotification('Insufficient USDT balance', 'error');
            return;
        }
        
        // Create stake
        const stake = {
            planId: Object.keys(CONFIG.STAKING.PLANS).find(key => CONFIG.STAKING.PLANS[key].id === plan.id),
            amount: amount,
            startTime: Date.now(),
            endTime: Date.now() + (plan.duration * 24 * 60 * 60 * 1000),
            claimedRewards: 0,
            status: 'active'
        };
        
        // Deduct USDT
        this.state.balances.USDT -= amount;
        this.state.staking.totalStaked += amount;
        
        // Add to active stakes
        this.state.staking.activeStakes.push(stake);
        
        // Add transaction
        this.addTransaction('stake', {
            type: 'stake',
            plan: plan.name,
            amount: amount,
            currency: 'USDT',
            date: new Date().toISOString(),
            status: 'completed'
        });
        
        // Close modal
        this.closeModal();
        
        // Update UI
        this.updateStakingPage();
        this.updateWalletPage();
        this.updateHeader();
        
        // Show notification
        this.showNotification(`✅ Staked ${amount} USDT for ${plan.duration} days!`, 'success');
        
        // Log event
        this.logEvent('staking_started', { 
            plan: plan.name, 
            amount: amount, 
            duration: plan.duration 
        });
        
        // Save state
        this.saveState();
    }

    claimStakingReward(index) {
        const stake = this.state.staking.activeStakes[index];
        if (!stake) return;
        
        const plan = CONFIG.STAKING.PLANS[stake.planId];
        if (!plan) return;
        
        const now = Date.now();
        const daysPassed = Math.floor((now - stake.startTime) / (1000 * 60 * 60 * 24));
        const reward = daysPassed * plan.dailyReward - stake.claimedRewards;
        
        if (reward <= 0) {
            this.showNotification('No rewards available to claim yet', 'info');
            return;
        }
        
        // Add reward
        this.state.balances.AMSK += reward;
        this.state.staking.totalEarned += reward;
        this.state.staking.totalProfit += reward;
        stake.claimedRewards += reward;
        
        // If stake period is over, complete it
        if (now >= stake.endTime) {
            // Return staked amount
            this.state.balances.USDT += stake.amount;
            this.state.staking.activeStakes.splice(index, 1);
            
            // Move to completed stakes
            this.state.staking.completedStakes.push({
                ...stake,
                status: 'completed',
                completedAt: now
            });
            
            // Add transaction
            this.addTransaction('unstake', {
                type: 'unstake',
                amount: stake.amount,
                currency: 'USDT',
                date: new Date().toISOString(),
                status: 'completed'
            });
        }
        
        // Add claim transaction
        this.addTransaction('claim', {
            type: 'staking_reward',
            amount: reward,
            currency: 'AMSK',
            date: new Date().toISOString(),
            status: 'completed'
        });
        
        // Update UI
        this.updateStakingPage();
        this.updateWalletPage();
        this.updateHeader();
        
        // Show notification
        this.showNotification(`💰 Claimed ${this.formatNumber(reward)} AMSK from staking!`, 'success');
        
        // Log event
        this.logEvent('staking_reward_claimed', { 
            amount: reward, 
            plan: plan.name 
        });
        
        // Save state
        this.saveState();
    }

    /* ===========================================
       WALLET ACTIONS
       =========================================== */

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
                this.showTransactionHistory();
                break;
            default:
                this.showNotification(`Action "${action}" not implemented yet`, 'info');
        }
    }

    openDepositModal(currency = 'USDT') {
        const modalContent = `
            <div class="deposit-modal-content">
                <div class="currency-selector">
                    <div class="currency-option ${currency === 'USDT' ? 'active' : ''}" data-currency="USDT">
                        <i class="fab fa-usd"></i>
                        <span>USDT</span>
                    </div>
                    <div class="currency-option ${currency === 'BNB' ? 'active' : ''}" data-currency="BNB">
                        <i class="fab fa-btc"></i>
                        <span>BNB</span>
                    </div>
                    <div class="currency-option ${currency === 'TON' ? 'active' : ''}" data-currency="TON">
                        <i class="fas fa-rocket"></i>
                        <span>TON</span>
                    </div>
                </div>
                
                <div class="deposit-info">
                    <div class="info-box">
                        <h5>Deposit <span id="deposit-currency-text">${currency}</span></h5>
                        <p>Send only <strong>${currency}</strong> to this address</p>
                        <div class="minimum-deposit">
                            <i class="fas fa-info-circle"></i>
                            Minimum deposit: <span id="min-deposit-amount">${CONFIG.WALLET.MIN_DEPOSIT[currency]}</span> ${currency}
                        </div>
                    </div>
                    
                    <div class="address-display">
                        <div class="address-label">Deposit Address:</div>
                        <div class="address-box">
                            <code id="deposit-address">${CONFIG.WALLET.ADDRESSES[currency]}</code>
                            <button class="copy-btn" id="copy-address">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="deposit-form">
                        <div class="form-group">
                            <label for="deposit-amount">Amount Deposited (${currency})</label>
                            <input type="number" 
                                   id="deposit-amount-input" 
                                   min="${CONFIG.WALLET.MIN_DEPOSIT[currency]}"
                                   step="0.01"
                                   placeholder="Enter amount">
                        </div>
                        
                        <div class="form-group">
                            <label for="tx-id-input">Transaction ID (TX ID)</label>
                            <input type="text" 
                                   id="tx-id-input" 
                                   placeholder="Enter transaction hash">
                            <small class="form-hint">Find this in your wallet transaction history</small>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="modal-btn secondary" id="cancel-deposit">Cancel</button>
                        <button class="modal-btn primary" id="submit-deposit">Submit Deposit Request</button>
                    </div>
                </div>
            </div>
        `;
        
        // Set modal content
        const modalBody = this.elements.get('depositModal').querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = modalContent;
        }
        
        // Open modal
        this.openModal('deposit-modal');
        
        // Setup event listeners
        this.setupDepositModalEvents();
    }

    setupDepositModalEvents() {
        // Currency selector
        document.querySelectorAll('.currency-option').forEach(option => {
            option.addEventListener('click', () => {
                const currency = option.dataset.currency;
                this.openDepositModal(currency);
            });
        });
        
        // Copy address button
        const copyButton = document.getElementById('copy-address');
        if (copyButton) {
            copyButton.addEventListener('click', () => {
                const address = document.getElementById('deposit-address').textContent;
                this.copyToClipboard(address);
                this.showNotification('Address copied to clipboard!', 'success');
            });
        }
        
        // Cancel button
        const cancelButton = document.getElementById('cancel-deposit');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        // Submit button
        const submitButton = document.getElementById('submit-deposit');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                this.submitDepositRequest();
            });
        }
    }

    submitDepositRequest() {
        const currency = document.querySelector('.currency-option.active').dataset.currency;
        const amountInput = document.getElementById('deposit-amount-input');
        const txIdInput = document.getElementById('tx-id-input');
        
        if (!amountInput || !txIdInput) return;
        
        const amount = parseFloat(amountInput.value);
        const txId = txIdInput.value.trim();
        
        // Validations
        if (!amount || amount < CONFIG.WALLET.MIN_DEPOSIT[currency]) {
            this.showNotification(`Minimum deposit is ${CONFIG.WALLET.MIN_DEPOSIT[currency]} ${currency}`, 'error');
            return;
        }
        
        if (!txId) {
            this.showNotification('Please enter Transaction ID', 'error');
            return;
        }
        
        // Create deposit request
        const deposit = {
            id: Date.now().toString(),
            userId: this.state.user.id,
            currency: currency,
            amount: amount,
            txId: txId,
            address: CONFIG.WALLET.ADDRESSES[currency],
            status: 'pending',
            date: new Date().toISOString(),
            timestamp: Date.now()
        };
        
        // Add to pending deposits
        this.state.admin.pendingDeposits.push(deposit);
        
        // Add to user transactions
        this.addTransaction('deposit', {
            type: 'deposit',
            currency: currency,
            amount: amount,
            status: 'pending',
            date: new Date().toISOString(),
            txId: txId
        });
        
        // Close modal
        this.closeModal();
        
        // Update UI
        this.updateHeader();
        
        // Show notification
        this.showNotification(`⏳ Deposit request submitted for ${amount} ${currency}!`, 'success');
        
        // Log event
        this.logEvent('deposit_requested', { 
            currency: currency, 
            amount: amount 
        });
        
        // Save state
        this.saveState();
    }

    openWithdrawModal() {
        const modalContent = `
            <div class="withdraw-modal-content">
                <div class="withdraw-info">
                    <div class="info-box">
                        <h5>Withdraw USDT</h5>
                        <div class="available-balance">
                            <i class="fas fa-wallet"></i>
                            Available Balance: <span id="withdraw-balance">${this.formatNumber(this.state.balances.USDT, 2)}</span> USDT
                        </div>
                        <div class="minimum-withdraw">
                            <i class="fas fa-info-circle"></i>
                            Minimum withdrawal: ${CONFIG.WALLET.MIN_WITHDRAWAL} USDT
                        </div>
                    </div>
                    
                    <div class="withdraw-form">
                        <div class="form-group">
                            <label for="withdraw-address">Wallet Address</label>
                            <input type="text" 
                                   id="withdraw-address" 
                                   placeholder="Enter your wallet address">
                        </div>
                        
                        <div class="form-group">
                            <label for="withdraw-amount">Amount (USDT)</label>
                            <input type="number" 
                                   id="withdraw-amount" 
                                   value="${CONFIG.WALLET.MIN_WITHDRAWAL}"
                                   min="${CONFIG.WALLET.MIN_WITHDRAWAL}"
                                   step="1"
                                   placeholder="Enter amount">
                            <div class="amount-options">
                                <button class="amount-option" data-amount="100">100</button>
                                <button class="amount-option" data-amount="500">500</button>
                                <button class="amount-option" data-amount="1000">1000</button>
                                <button class="amount-option" data-amount="5000">5000</button>
                            </div>
                        </div>
                        
                        <div class="fee-info">
                            <div class="fee-item">
                                <span>Network Fee:</span>
                                <span>${CONFIG.WALLET.WITHDRAWAL_FEE} BNB</span>
                            </div>
                            <div class="fee-item">
                                <span>Your BNB Balance:</span>
                                <span id="bnb-fee-balance">${this.formatNumber(this.state.balances.BNB, 4)}</span>
                            </div>
                            <div class="fee-warning ${this.state.balances.BNB >= CONFIG.WALLET.WITHDRAWAL_FEE ? 'hidden' : ''}" id="fee-warning">
                                <i class="fas fa-exclamation-triangle"></i>
                                Insufficient BNB for network fee
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="modal-btn secondary" id="cancel-withdraw">Cancel</button>
                        <button class="modal-btn primary" id="submit-withdraw" disabled>Submit Withdrawal Request</button>
                    </div>
                </div>
            </div>
        `;
        
        // Set modal content
        const modalBody = this.elements.get('withdrawModal').querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = modalContent;
        }
        
        // Open modal
        this.openModal('withdraw-modal');
        
        // Setup event listeners
        this.setupWithdrawModalEvents();
    }

    setupWithdrawModalEvents() {
        // Amount options
        document.querySelectorAll('.amount-option').forEach(option => {
            option.addEventListener('click', () => {
                const amount = option.dataset.amount;
                const amountInput = document.getElementById('withdraw-amount');
                if (amountInput) {
                    amountInput.value = amount;
                    this.validateWithdrawal();
                }
            });
        });
        
        // Amount input
        const amountInput = document.getElementById('withdraw-amount');
        if (amountInput) {
            amountInput.addEventListener('input', () => {
                this.validateWithdrawal();
            });
        }
        
        // Cancel button
        const cancelButton = document.getElementById('cancel-withdraw');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        // Submit button
        const submitButton = document.getElementById('submit-withdraw');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                this.submitWithdrawalRequest();
            });
        }
        
        // Initial validation
        this.validateWithdrawal();
    }

    validateWithdrawal() {
        const amountInput = document.getElementById('withdraw-amount');
        const addressInput = document.getElementById('withdraw-address');
        const submitButton = document.getElementById('submit-withdraw');
        const feeWarning = document.getElementById('fee-warning');
        
        if (!amountInput || !addressInput || !submitButton || !feeWarning) return;
        
        const amount = parseFloat(amountInput.value) || 0;
        const address = addressInput.value.trim();
        
        // Check conditions
        const hasEnoughUsdt = this.state.balances.USDT >= amount;
        const hasEnoughBnb = this.state.balances.BNB >= CONFIG.WALLET.WITHDRAWAL_FEE;
        const isValidAmount = amount >= CONFIG.WALLET.MIN_WITHDRAWAL;
        const isValidAddress = address.length > 10;
        
        // Update fee warning
        if (!hasEnoughBnb) {
            feeWarning.classList.remove('hidden');
        } else {
            feeWarning.classList.add('hidden');
        }
        
        // Enable/disable submit button
        const isValid = hasEnoughUsdt && hasEnoughBnb && isValidAmount && isValidAddress;
        submitButton.disabled = !isValid;
        
        // Update button text
        if (!hasEnoughUsdt) {
            submitButton.textContent = 'Insufficient USDT';
        } else if (!hasEnoughBnb) {
            submitButton.textContent = 'Insufficient BNB for fee';
        } else if (!isValidAmount) {
            submitButton.textContent = `Minimum ${CONFIG.WALLET.MIN_WITHDRAWAL} USDT`;
        } else if (!isValidAddress) {
            submitButton.textContent = 'Enter valid address';
        } else {
            submitButton.textContent = 'Submit Withdrawal Request';
        }
    }

    submitWithdrawalRequest() {
        const addressInput = document.getElementById('withdraw-address');
        const amountInput = document.getElementById('withdraw-amount');
        
        if (!addressInput || !amountInput) return;
        
        const address = addressInput.value.trim();
        const amount = parseFloat(amountInput.value);
        
        // Validations
        if (!address) {
            this.showNotification('Please enter wallet address', 'error');
            return;
        }
        
        if (amount < CONFIG.WALLET.MIN_WITHDRAWAL) {
            this.showNotification(`Minimum withdrawal is ${CONFIG.WALLET.MIN_WITHDRAWAL} USDT`, 'error');
            return;
        }
        
        if (this.state.balances.USDT < amount) {
            this.showNotification('Insufficient USDT balance', 'error');
            return;
        }
        
        if (this.state.balances.BNB < CONFIG.WALLET.WITHDRAWAL_FEE) {
            this.showNotification(`Insufficient BNB for network fee (${CONFIG.WALLET.WITHDRAWAL_FEE} BNB required)`, 'error');
            return;
        }
        
        // Create withdrawal request
        const withdrawal = {
            id: Date.now().toString(),
            userId: this.state.user.id,
            currency: 'USDT',
            amount: amount,
            address: address,
            status: 'pending',
            date: new Date().toISOString(),
            timestamp: Date.now(),
            fee: CONFIG.WALLET.WITHDRAWAL_FEE
        };
        
        // Deduct from balance immediately
        this.state.balances.USDT -= amount;
        this.state.balances.BNB -= CONFIG.WALLET.WITHDRAWAL_FEE;
        
        // Add to pending withdrawals
        this.state.admin.pendingWithdrawals.push(withdrawal);
        
        // Add to user transactions
        this.addTransaction('withdrawal', {
            type: 'withdrawal',
            currency: 'USDT',
            amount: amount,
            status: 'pending',
            date: new Date().toISOString(),
            address: address
        });
        
        // Close modal
        this.closeModal();
        
        // Update UI
        this.updateWalletPage();
        this.updateHeader();
        
        // Show notification
        this.showNotification(`⏳ Withdrawal request submitted for ${amount} USDT!`, 'success');
        
        // Log event
        this.logEvent('withdrawal_requested', { 
            amount: amount, 
            fee: CONFIG.WALLET.WITHDRAWAL_FEE 
        });
        
        // Save state
        this.saveState();
    }

    openSwapModal() {
        const modalContent = `
            <div class="swap-modal-content">
                <div class="swap-form">
                    <div class="swap-from">
                        <div class="swap-header">
                            <span>From</span>
                            <span class="balance">Balance: <span id="swap-from-balance">${this.formatNumber(this.state.balances.AMSK)}</span></span>
                        </div>
                        <div class="swap-input">
                            <select id="swap-from-currency">
                                <option value="AMSK" selected>AMSK</option>
                                <option value="USDT">USDT</option>
                                <option value="BNB">BNB</option>
                                <option value="TON">TON</option>
                            </select>
                            <input type="number" 
                                   id="swap-from-amount" 
                                   placeholder="0"
                                   min="0"
                                   step="1">
                        </div>
                    </div>
                    
                    <div class="swap-arrow">
                        <i class="fas fa-exchange-alt"></i>
                    </div>
                    
                    <div class="swap-to">
                        <div class="swap-header">
                            <span>To</span>
                            <span class="balance">Balance: <span id="swap-to-balance">${this.formatNumber(this.state.balances.USDT, 2)}</span></span>
                        </div>
                        <div class="swap-input">
                            <select id="swap-to-currency">
                                <option value="USDT" selected>USDT</option>
                                <option value="AMSK">AMSK</option>
                                <option value="BNB">BNB</option>
                                <option value="TON">TON</option>
                            </select>
                            <div class="swap-result" id="swap-to-amount">0.00</div>
                        </div>
                    </div>
                    
                    <div class="swap-info">
                        <div class="swap-rate">
                            Rate: <span id="swap-rate">1 AMSK = 0.0002 USDT</span>
                        </div>
                        <div class="swap-fee">
                            Fee: ${(CONFIG.SWAP.FEE * 100)}%
                        </div>
                        ${this.state.balances.AMSK < CONFIG.SWAP.MIN_AMSK_SWAP ? `
                            <div class="swap-warning">
                                <i class="fas fa-exclamation-triangle"></i>
                                Minimum swap: ${this.formatNumber(CONFIG.SWAP.MIN_AMSK_SWAP)} AMSK
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="modal-actions">
                        <button class="modal-btn secondary" id="cancel-swap">Cancel</button>
                        <button class="modal-btn primary" id="submit-swap" disabled>Confirm Swap</button>
                    </div>
                </div>
            </div>
        `;
        
        // Set modal content
        const modalBody = this.elements.get('swapModal').querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = modalContent;
        }
        
        // Open modal
        this.openModal('swap-modal');
        
        // Setup event listeners
        this.setupSwapModalEvents();
    }

    setupSwapModalEvents() {
        // Currency selectors
        const fromCurrency = document.getElementById('swap-from-currency');
        const toCurrency = document.getElementById('swap-to-currency');
        const fromAmount = document.getElementById('swap-from-amount');
        
        if (!fromCurrency || !toCurrency || !fromAmount) return;
        
        // Update balances when currency changes
        const updateBalances = () => {
            const from = fromCurrency.value;
            const to = toCurrency.value;
            
            const fromBalance = document.getElementById('swap-from-balance');
            const toBalance = document.getElementById('swap-to-balance');
            
            if (fromBalance) {
                fromBalance.textContent = this.formatNumber(this.state.balances[from], 
                    from === 'BNB' ? 4 : from === 'USDT' ? 2 : 0);
            }
            
            if (toBalance) {
                toBalance.textContent = this.formatNumber(this.state.balances[to], 
                    to === 'BNB' ? 4 : to === 'USDT' ? 2 : 0);
            }
            
            // Update swap calculation
            this.updateSwapCalculation();
        };
        
        fromCurrency.addEventListener('change', updateBalances);
        toCurrency.addEventListener('change', updateBalances);
        fromAmount.addEventListener('input', () => this.updateSwapCalculation());
        
        // Cancel button
        const cancelButton = document.getElementById('cancel-swap');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        // Submit button
        const submitButton = document.getElementById('submit-swap');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                this.executeSwap();
            });
        }
        
        // Initial update
        updateBalances();
    }

    updateSwapCalculation() {
        const fromCurrency = document.getElementById('swap-from-currency')?.value;
        const toCurrency = document.getElementById('swap-to-currency')?.value;
        const fromAmount = parseFloat(document.getElementById('swap-from-amount')?.value) || 0;
        const submitButton = document.getElementById('submit-swap');
        const swapRate = document.getElementById('swap-rate');
        const swapToAmount = document.getElementById('swap-to-amount');
        
        if (!fromCurrency || !toCurrency || !submitButton || !swapRate || !swapToAmount) return;
        
        // Calculate swap rate
        let rate = 0;
        let result = 0;
        
        if (fromCurrency === 'AMSK' && toCurrency === 'USDT') {
            rate = CONFIG.SWAP.RATES.AMSK_TO_USDT;
            result = fromAmount * rate;
        } else if (fromCurrency === 'USDT' && toCurrency === 'AMSK') {
            rate = CONFIG.SWAP.RATES.USDT_TO_AMSK;
            result = fromAmount * rate;
        } else if (fromCurrency === 'BNB' && toCurrency === 'AMSK') {
            rate = CONFIG.SWAP.RATES.BNB_TO_AMSK;
            result = fromAmount * rate;
        } else if (fromCurrency === 'TON' && toCurrency === 'AMSK') {
            rate = CONFIG.SWAP.RATES.TON_TO_AMSK;
            result = fromAmount * rate;
        }
        
        // Apply fee
        result = result * (1 - CONFIG.SWAP.FEE);
        
        // Update display
        swapRate.textContent = `1 ${fromCurrency} = ${rate} ${toCurrency}`;
        swapToAmount.textContent = this.formatNumber(result, 
            toCurrency === 'BNB' ? 4 : toCurrency === 'USDT' ? 2 : 0);
        
        // Validate swap
        const hasEnoughBalance = this.state.balances[fromCurrency] >= fromAmount;
        const isValidAmount = fromAmount > 0;
        const isDifferentCurrency = fromCurrency !== toCurrency;
        
        // Special validation for AMSK to USDT
        const isMinAMSK = fromCurrency !== 'AMSK' || fromAmount >= CONFIG.SWAP.MIN_AMSK_SWAP;
        
        submitButton.disabled = !(hasEnoughBalance && isValidAmount && isDifferentCurrency && isMinAMSK);
        
        // Update button text
        if (!hasEnoughBalance) {
            submitButton.textContent = 'Insufficient balance';
        } else if (!isMinAMSK && fromCurrency === 'AMSK') {
            submitButton.textContent = `Minimum ${CONFIG.SWAP.MIN_AMSK_SWAP} AMSK`;
        } else if (!isValidAmount) {
            submitButton.textContent = 'Enter amount';
        } else if (!isDifferentCurrency) {
            submitButton.textContent = 'Select different currency';
        } else {
            submitButton.textContent = 'Confirm Swap';
        }
    }

    executeSwap() {
        const fromCurrency = document.getElementById('swap-from-currency')?.value;
        const toCurrency = document.getElementById('swap-to-currency')?.value;
        const fromAmount = parseFloat(document.getElementById('swap-from-amount')?.value) || 0;
        
        if (!fromCurrency || !toCurrency) return;
        
        // Calculate result
        let rate = 0;
        if (fromCurrency === 'AMSK' && toCurrency === 'USDT') {
            rate = CONFIG.SWAP.RATES.AMSK_TO_USDT;
        } else if (fromCurrency === 'USDT' && toCurrency === 'AMSK') {
            rate = CONFIG.SWAP.RATES.USDT_TO_AMSK;
        } else if (fromCurrency === 'BNB' && toCurrency === 'AMSK') {
            rate = CONFIG.SWAP.RATES.BNB_TO_AMSK;
        } else if (fromCurrency === 'TON' && toCurrency === 'AMSK') {
            rate = CONFIG.SWAP.RATES.TON_TO_AMSK;
        }
        
        let result = fromAmount * rate;
        result = result * (1 - CONFIG.SWAP.FEE); // Apply fee
        
        // Update balances
        this.state.balances[fromCurrency] -= fromAmount;
        this.state.balances[toCurrency] += result;
        
        // Add transaction
        this.addTransaction('swap', {
            type: 'swap',
            from: fromCurrency,
            to: toCurrency,
            amount: fromAmount,
            result: result,
            rate: rate,
            fee: CONFIG.SWAP.FEE,
            date: new Date().toISOString(),
            status: 'completed'
        });
        
        // Close modal
        this.closeModal();
        
        // Update UI
        this.updateWalletPage();
        this.updateHeader();
        this.updateHomePage();
        
        // Show notification
        this.showNotification(`🔄 Swapped ${this.formatNumber(fromAmount)} ${fromCurrency} to ${this.formatNumber(result)} ${toCurrency}!`, 'success');
        
        // Log event
        this.logEvent('swap_executed', { 
            from: fromCurrency, 
            to: toCurrency, 
            amount: fromAmount, 
            result: result 
        });
        
        // Save state
        this.saveState();
    }

    showTransactionHistory() {
        // This would show transaction history modal
        // For now, switch to wallet page
        this.showPage('wallet');
        this.showNotification('Transaction history will be available soon!', 'info');
    }

    /* ===========================================
       REFERRAL SYSTEM
       =========================================== */

    copyReferralCode() {
        this.copyToClipboard(this.state.referral.code);
        this.showNotification('✅ Referral code copied to clipboard!', 'success');
        
        // Log event
        this.logEvent('referral_code_copied', { code: this.state.referral.code });
    }

    shareReferralLink() {
        const link = `https://t.me/AlienMuskBot?start=ref-${this.state.referral.code}`;
        const message = `🚀 Join Alien Musk and earn free AMSK tokens!\n\nUse my referral code: ${this.state.referral.code}\n\n${link}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Alien Musk - Quantum Mining Platform',
                text: message,
                url: link
            }).then(() => {
                this.logEvent('referral_shared', { method: 'native_share' });
            }).catch(() => {
                this.copyToClipboard(message);
                this.showNotification('✅ Referral link copied! Share it with friends.', 'info');
                this.logEvent('referral_shared', { method: 'clipboard' });
            });
        } else {
            this.copyToClipboard(message);
            this.showNotification('✅ Referral link copied! Share it with friends.', 'info');
            this.logEvent('referral_shared', { method: 'clipboard' });
        }
    }

    addReferral(referredUserId) {
        // Check if already referred
        if (this.state.referral.referrals.includes(referredUserId)) {
            return;
        }
        
        // Add referral
        this.state.referral.referrals.push(referredUserId);
        this.state.referral.totalCount++;
        this.state.referral.lastReferral = Date.now();
        
        // Add referral reward (20,000 AMSK)
        this.state.balances.AMSK += CONFIG.REFERRAL.BASE_REWARD;
        this.state.referral.earned += CONFIG.REFERRAL.BASE_REWARD;
        
        // Check for milestone rewards
        this.checkReferralMilestones();
        
        // Update UI
        this.updateHomePage();
        this.updateWalletPage();
        this.updateHeader();
        
        // Show notification
        this.showNotification(`🎉 New referral! +${CONFIG.REFERRAL.BASE_REWARD} AMSK`, 'success');
        
        // Log event
        this.logEvent('referral_added', { 
            referredUser: referredUserId, 
            reward: CONFIG.REFERRAL.BASE_REWARD 
        });
        
        // Save state
        this.saveState();
    }

    checkReferralMilestones() {
        const refCount = this.state.referral.totalCount;
        
        for (const [milestone, data] of Object.entries(CONFIG.REFERRAL.MILESTONES)) {
            const milestoneNum = parseInt(milestone);
            if (refCount >= milestoneNum && !this.state.referral.claimedMilestones.includes(milestoneNum)) {
                this.claimMilestoneReward(milestoneNum, data.reward);
            }
        }
    }

    claimMilestoneReward(milestone, reward) {
        // Add milestone reward
        this.state.balances.AMSK += reward;
        this.state.referral.earned += reward;
        this.state.referral.claimedMilestones.push(milestone);
        
        // Add bonus if available
        const bonus = CONFIG.REFERRAL.MILESTONES[milestone]?.bonus || 0;
        if (bonus > 0) {
            this.state.balances.AMSK += bonus;
            this.state.referral.earned += bonus;
        }
        
        // Update UI
        this.updateHomePage();
        this.updateWalletPage();
        this.updateHeader();
        
        // Show notification
        const totalReward = reward + bonus;
        this.showNotification(`🏆 Reached ${milestone} referrals! +${this.formatNumber(totalReward)} AMSK`, 'success');
        
        // Log event
        this.logEvent('referral_milestone_reached', { 
            milestone: milestone, 
            reward: reward, 
            bonus: bonus 
        });
        
        // Save state
        this.saveState();
    }

    /* ===========================================
       MODAL MANAGEMENT
       =========================================== */

    openModal(modalId) {
        // Close any open modal first
        this.closeModal();
        
        const modal = this.elements.get(modalId);
        const overlay = this.elements.get('modalOverlay');
        
        if (!modal || !overlay) return;
        
        // Store current modal
        this.currentModal = modalId;
        
        // Show modal and overlay
        overlay.classList.add('active');
        modal.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Add escape key listener
        this.escapeKeyHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        };
        document.addEventListener('keydown', this.escapeKeyHandler);
        
        // Log event
        this.logEvent('modal_opened', { modal: modalId });
    }

    closeModal() {
        const overlay = this.elements.get('modalOverlay');
        
        // Hide all modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        
        // Hide overlay
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Remove escape key listener
        if (this.escapeKeyHandler) {
            document.removeEventListener('keydown', this.escapeKeyHandler);
            this.escapeKeyHandler = null;
        }
        
        // Clear current modal
        this.currentModal = null;
    }

    /* ===========================================
       NOTIFICATION SYSTEM
       =========================================== */

    showNotification(message, type = 'info') {
        const notificationCenter = this.elements.get('notificationCenter');
        if (!notificationCenter) return;
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.setAttribute('role', 'alert');
        
        // Set icon based on type
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
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to notification center
        notificationCenter.appendChild(notification);
        
        // Add close button event
        const closeButton = notification.querySelector('.notification-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.removeNotification(notification);
            });
        }
        
        // Auto-remove after duration
        setTimeout(() => {
            this.removeNotification(notification);
        }, CONFIG.UI.NOTIFICATION_DURATION);
        
        // Increment notification count
        this.state.system.notifications++;
        
        // Log event
        this.logEvent('notification_shown', { type: type, message: message.substring(0, 50) });
    }

    removeNotification(notification) {
        if (!notification || !notification.parentNode) return;
        
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    /* ===========================================
       ADMIN SYSTEM
       =========================================== */

    setupAdminAccess() {
        let clickCount = 0;
        let lastClickTime = 0;
        const brandSection = document.querySelector('.brand');
        
        if (!brandSection) return;
        
        brandSection.addEventListener('click', () => {
            const now = Date.now();
            
            // Reset count if more than 2 seconds passed
            if (now - lastClickTime > 2000) {
                clickCount = 0;
            }
            
            lastClickTime = now;
            clickCount++;
            
            // Show click feedback
            if (clickCount >= 5) {
                brandSection.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    brandSection.style.transform = 'scale(1)';
                }, 100);
            }
            
            // Show admin login after 10 clicks
            if (clickCount >= 10) {
                this.showAdminLogin();
                clickCount = 0;
            }
        });
    }

    showAdminLogin() {
        const password = prompt('Enter admin password:');
        
        if (password === CONFIG.ADMIN.SECRET && this.state.user.id === CONFIG.ADMIN.USER_ID) {
            this.state.admin.isLoggedIn = true;
            this.showAdminPanel();
            this.showNotification('👑 Welcome, Admin!', 'success');
            
            // Log event
            this.logEvent('admin_login', { success: true });
        } else {
            this.showNotification('❌ Access denied!', 'error');
            
            // Log event
            this.logEvent('admin_login', { success: false });
        }
    }

    showAdminPanel() {
        const adminPanel = this.elements.get('adminPanel');
        if (!adminPanel) return;
        
        const deposits = this.state.admin.pendingDeposits;
        const withdrawals = this.state.admin.pendingWithdrawals;
        
        adminPanel.innerHTML = `
            <div class="admin-content">
                <div class="admin-header">
                    <h2><i class="fas fa-user-shield"></i> Admin Dashboard</h2>
                    <button id="close-admin" class="close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="admin-stats">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">${this.state.admin.systemStats.totalUsers}</div>
                            <div class="stat-label">Total Users</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-coins"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">${this.formatNumber(this.state.admin.systemStats.totalVolume)}</div>
                            <div class="stat-label">Total Volume</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">${this.state.admin.systemStats.activeMining}</div>
                            <div class="stat-label">Active Mining</div>
                        </div>
                    </div>
                </div>
                
                <div class="admin-section">
                    <h3><i class="fas fa-download"></i> Pending Deposits (${deposits.length})</h3>
                    <div class="pending-list" id="admin-deposits-list">
                        ${deposits.length === 0 ? 
                            '<p class="empty-state">No pending deposits</p>' : 
                            deposits.map(deposit => `
                                <div class="pending-item">
                                    <div class="pending-info">
                                        <div class="user">User: ${deposit.userId.substring(0, 8)}...</div>
                                        <div class="amount">${deposit.amount} ${deposit.currency}</div>
                                        <div class="txid">TX: ${deposit.txId.substring(0, 20)}...</div>
                                    </div>
                                    <div class="pending-actions">
                                        <button class="admin-btn approve" data-id="${deposit.id}" data-type="deposit">
                                            <i class="fas fa-check"></i> Approve
                                        </button>
                                        <button class="admin-btn reject" data-id="${deposit.id}" data-type="deposit">
                                            <i class="fas fa-times"></i> Reject
                                        </button>
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
                
                <div class="admin-section">
                    <h3><i class="fas fa-upload"></i> Pending Withdrawals (${withdrawals.length})</h3>
                    <div class="pending-list" id="admin-withdrawals-list">
                        ${withdrawals.length === 0 ? 
                            '<p class="empty-state">No pending withdrawals</p>' : 
                            withdrawals.map(withdrawal => `
                                <div class="pending-item">
                                    <div class="pending-info">
                                        <div class="user">User: ${withdrawal.userId.substring(0, 8)}...</div>
                                        <div class="amount">${withdrawal.amount} ${withdrawal.currency}</div>
                                        <div class="address">To: ${withdrawal.address.substring(0, 20)}...</div>
                                    </div>
                                    <div class="pending-actions">
                                        <button class="admin-btn pay" data-id="${withdrawal.id}" data-type="withdrawal">
                                            <i class="fas fa-money-bill-wave"></i> Pay
                                        </button>
                                        <button class="admin-btn reject" data-id="${withdrawal.id}" data-type="withdrawal">
                                            <i class="fas fa-times"></i> Reject
                                        </button>
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
                
                <div class="admin-actions">
                    <button id="refresh-admin" class="admin-btn">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                    <button id="logout-admin" class="admin-btn logout">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>
        `;
        
        // Show admin panel
        adminPanel.classList.add('active');
        
        // Add event listeners
        this.setupAdminPanelEvents();
    }

    setupAdminPanelEvents() {
        // Close button
        const closeButton = document.getElementById('close-admin');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.elements.get('adminPanel').classList.remove('active');
            });
        }
        
        // Refresh button
        const refreshButton = document.getElementById('refresh-admin');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                this.showAdminPanel();
                this.showNotification('Admin panel refreshed', 'info');
            });
        }
        
        // Logout button
        const logoutButton = document.getElementById('logout-admin');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                this.state.admin.isLoggedIn = false;
                this.elements.get('adminPanel').classList.remove('active');
                this.showNotification('Admin logged out', 'info');
                this.logEvent('admin_logout');
            });
        }
        
        // Admin action buttons
        document.querySelectorAll('.admin-btn.approve, .admin-btn.reject, .admin-btn.pay').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const type = e.currentTarget.dataset.type;
                const action = e.currentTarget.classList.contains('approve') ? 'approve' : 
                              e.currentTarget.classList.contains('pay') ? 'pay' : 'reject';
                
                this.handleAdminAction(id, type, action);
            });
        });
    }

    handleAdminAction(id, type, action) {
        console.log(`Admin action: ${action} on ${type} ${id}`);
        
        if (type === 'deposit') {
            this.processDepositAction(id, action);
        } else if (type === 'withdrawal') {
            this.processWithdrawalAction(id, action);
        }
    }

    processDepositAction(depositId, action) {
        const depositIndex = this.state.admin.pendingDeposits.findIndex(d => d.id === depositId);
        if (depositIndex === -1) return;
        
        const deposit = this.state.admin.pendingDeposits[depositIndex];
        
        if (action === 'approve') {
            // Credit user's balance
            this.state.balances[deposit.currency] += deposit.amount;
            
            // Update transaction status
            const txIndex = this.state.transactions.deposits.findIndex(tx => tx.txId === deposit.txId);
            if (txIndex !== -1) {
                this.state.transactions.deposits[txIndex].status = 'completed';
            }
            
            this.showNotification(`✅ Deposit approved: ${deposit.amount} ${deposit.currency}`, 'success');
        } else {
            // Update transaction status
            const txIndex = this.state.transactions.deposits.findIndex(tx => tx.txId === deposit.txId);
            if (txIndex !== -1) {
                this.state.transactions.deposits[txIndex].status = 'rejected';
            }
            
            this.showNotification(`❌ Deposit rejected: ${deposit.amount} ${deposit.currency}`, 'error');
        }
        
        // Remove from pending
        this.state.admin.pendingDeposits.splice(depositIndex, 1);
        
        // Update UI
        this.showAdminPanel();
        this.updateWalletPage();
        this.updateHeader();
        
        // Log event
        this.logEvent('admin_deposit_action', { 
            action: action, 
            amount: deposit.amount, 
            currency: deposit.currency 
        });
        
        // Save state
        this.saveState();
    }

    processWithdrawalAction(withdrawalId, action) {
        const withdrawalIndex = this.state.admin.pendingWithdrawals.findIndex(w => w.id === withdrawalId);
        if (withdrawalIndex === -1) return;
        
        const withdrawal = this.state.admin.pendingWithdrawals[withdrawalIndex];
        
        if (action === 'pay') {
            // Update transaction status
            const txIndex = this.state.transactions.withdrawals.findIndex(tx => 
                tx.amount === withdrawal.amount && tx.address === withdrawal.address);
            if (txIndex !== -1) {
                this.state.transactions.withdrawals[txIndex].status = 'completed';
            }
            
            this.showNotification(`✅ Withdrawal paid: ${withdrawal.amount} ${withdrawal.currency}`, 'success');
        } else {
            // Refund user if rejected
            this.state.balances.USDT += withdrawal.amount;
            this.state.balances.BNB += withdrawal.fee;
            
            // Update transaction status
            const txIndex = this.state.transactions.withdrawals.findIndex(tx => 
                tx.amount === withdrawal.amount && tx.address === withdrawal.address);
            if (txIndex !== -1) {
                this.state.transactions.withdrawals[txIndex].status = 'rejected';
            }
            
            this.showNotification(`❌ Withdrawal rejected: ${withdrawal.amount} ${withdrawal.currency}`, 'error');
        }
        
        // Remove from pending
        this.state.admin.pendingWithdrawals.splice(withdrawalIndex, 1);
        
        // Update UI
        this.showAdminPanel();
        this.updateWalletPage();
        this.updateHeader();
        
        // Log event
        this.logEvent('admin_withdrawal_action', { 
            action: action, 
            amount: withdrawal.amount, 
            currency: withdrawal.currency 
        });
        
        // Save state
        this.saveState();
    }

    /* ===========================================
       EVENT LISTENERS SETUP
       =========================================== */

    setupEventListeners() {
        console.log('🔗 Setting up event listeners...');
        
        // Navigation buttons
        this.elements.get('navButtons').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const page = button.dataset.page;
                this.showPage(page);
            });
        });
        
        // Mining action button
        if (this.elements.get('startMiningBtn')) {
            this.elements.get('startMiningBtn').addEventListener('click', () => {
                this.handleMining();
            });
        }
        
        // Upgrade buttons
        this.elements.get('upgradeButtons').forEach(button => {
            button.addEventListener('click', (e) => {
                if (button.disabled) return;
                const card = e.target.closest('.upgrade-card');
                if (card) {
                    this.upgradeMining(card.dataset.level);
                }
            });
        });
        
        // Booster buttons
        this.elements.get('boosterButtons').forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.booster-card');
                if (card) {
                    this.activateBooster(card.dataset.booster);
                }
            });
        });
        
        // Stake buttons
        this.elements.get('stakeButtons').forEach(button => {
            button.addEventListener('click', (e) => {
                const planId = button.dataset.plan;
                this.openStakeModal(planId);
            });
        });
        
        // Referral actions
        if (this.elements.get('copyRefCode')) {
            this.elements.get('copyRefCode').addEventListener('click', () => {
                this.copyReferralCode();
            });
        }
        
        if (this.elements.get('shareRef')) {
            this.elements.get('shareRef').addEventListener('click', () => {
                this.shareReferralLink();
            });
        }
        
        // Quick action buttons
        this.elements.get('quickButtons').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = button.dataset.action;
                this.handleQuickAction(action);
            });
        });
        
        // Asset action buttons
        this.elements.get('assetActionButtons').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = button.dataset.action;
                const currency = button.dataset.currency;
                this.handleAssetAction(action, currency);
            });
        });
        
        // Modal close buttons
        this.elements.get('closeModalButtons').forEach(button => {
            button.addEventListener('click', () => {
                this.closeModal();
            });
        });
        
        // Modal overlay
        if (this.elements.get('modalOverlay')) {
            this.elements.get('modalOverlay').addEventListener('click', (e) => {
                if (e.target === this.elements.get('modalOverlay')) {
                    this.closeModal();
                }
            });
        }
        
        // Window events
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });
        
        window.addEventListener('online', () => {
            this.showNotification('✅ Back online', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('⚠️ You are offline', 'warning');
        });
        
        console.log('✅ Event listeners setup complete');
    }

    handleAssetAction(action, currency) {
        switch (action) {
            case 'send':
                this.showNotification('Send functionality coming soon!', 'info');
                break;
            case 'receive':
                if (currency === 'USDT') {
                    this.openDepositModal('USDT');
                } else {
                    this.showNotification('Receive functionality coming soon!', 'info');
                }
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
            default:
                this.showNotification(`Action "${action}" not implemented yet`, 'info');
        }
    }

    /* ===========================================
       ANIMATIONS & EFFECTS
       =========================================== */

    startMiningAnimation() {
        const quantumCircle = document.querySelector('.quantum-circle');
        if (quantumCircle) {
            quantumCircle.classList.add('active');
        }
    }

    showRewardAnimation(amount) {
        // Create floating reward element
        const rewardElement = document.createElement('div');
        rewardElement.className = 'floating-reward';
        rewardElement.innerHTML = `+${this.formatNumber(amount)} AMSK`;
        rewardElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: var(--secondary);
            font-size: 24px;
            font-weight: 900;
            z-index: 9999;
            animation: floatUp 2s ease-out forwards;
            text-shadow: 0 0 20px var(--secondary);
        `;
        
        document.body.appendChild(rewardElement);
        
        // Remove after animation
        setTimeout(() => {
            if (rewardElement.parentNode) {
                rewardElement.parentNode.removeChild(rewardElement);
            }
        }, 2000);
    }

    showUpgradeAnimation(levelName) {
        const animation = document.createElement('div');
        animation.className = 'upgrade-animation';
        animation.innerHTML = `
            <div class="animation-content">
                <i class="fas fa-rocket"></i>
                <div class="animation-text">Level Up!</div>
                <div class="animation-sub">${levelName}</div>
            </div>
        `;
        
        document.body.appendChild(animation);
        
        // Remove after animation
        setTimeout(() => {
            if (animation.parentNode) {
                animation.parentNode.removeChild(animation);
            }
        }, 3000);
    }

    showBoosterAnimation(boosterType) {
        const booster = CONFIG.BOOSTERS[boosterType];
        if (!booster) return;
        
        const animation = document.createElement('div');
        animation.className = 'booster-animation';
        animation.innerHTML = `
            <div class="animation-content">
                <i class="fas fa-bolt"></i>
                <div class="animation-text">${booster.name}</div>
                <div class="animation-sub">×${booster.multiplier} Speed</div>
            </div>
        `;
        
        document.body.appendChild(animation);
        
        // Remove after animation
        setTimeout(() => {
            if (animation.parentNode) {
                animation.parentNode.removeChild(animation);
            }
        }, 3000);
    }

    /* ===========================================
       STATE MANAGEMENT
       =========================================== */

    async saveState() {
        if (!this.state || this.isProcessing) return;
        
        this.isProcessing = true;
        
        try {
            // Update last active timestamp
            this.state.user.lastActive = new Date().toISOString();
            this.state.system.lastSync = new Date().toISOString();
            
            // Prepare state for saving
            const stateToSave = {
                ...this.state,
                // Don't save pending admin requests in user's localStorage
                admin: {
                    ...this.state.admin,
                    pendingDeposits: [],
                    pendingWithdrawals: []
                }
            };
            
            // Save to localStorage
            localStorage.setItem('alien_musk_state', JSON.stringify(stateToSave));
            
            // Save to Firebase if available
            if (this.db && this.state.user.id) {
                await this.db.collection('users').doc(this.state.user.id).set(stateToSave, { merge: true });
            }
            
            console.log('💾 State saved successfully');
            
        } catch (error) {
            console.error('Failed to save state:', error);
        } finally {
            this.isProcessing = false;
        }
    }

    async loadState() {
        try {
            // Try to load from localStorage first
            const savedState = localStorage.getItem('alien_musk_state');
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                
                // Merge with initial state (preserve defaults for new fields)
                this.state = {
                    ...this.getInitialState(),
                    ...parsedState,
                    // Don't merge arrays that should be preserved
                    mining: {
                        ...this.getInitialState().mining,
                        ...parsedState.mining
                    },
                    staking: {
                        ...this.getInitialState().staking,
                        ...parsedState.staking
                    },
                    referral: {
                        ...this.getInitialState().referral,
                        ...parsedState.referral
                    }
                };
                
                console.log('📂 State loaded from localStorage');
                return true;
            }
            
            // Try to load from Firebase
            if (this.db && this.state.user.id) {
                const doc = await this.db.collection('users').doc(this.state.user.id).get();
                if (doc.exists) {
                    const data = doc.data();
                    this.state = { ...this.getInitialState(), ...data };
                    console.log('📂 State loaded from Firebase');
                    return true;
                }
            }
            
        } catch (error) {
            console.warn('Failed to load state:', error);
        }
        
        return false;
    }

    /* ===========================================
       UTILITY FUNCTIONS
       =========================================== */

    formatNumber(num, decimals = 0) {
        if (typeof num !== 'number' || isNaN(num)) return '0';
        
        // Handle large numbers with abbreviations
        if (num >= 1000000) {
            return (num / 1000000).toFixed(decimals) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(decimals) + 'K';
        }
        
        if (decimals > 0) {
            return num.toLocaleString('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
        }
        
        return num.toLocaleString('en-US');
    }

    formatDate(date) {
        if (!date) return '';
        
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    generateReferralCode(base = '') {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'ALIEN-';
        
        // Use base if provided
        if (base && base.length >= 3) {
            code += base.toUpperCase().substring(0, 3);
        }
        
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
        
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Failed to copy:', err);
        });
    }

    addTransaction(type, data) {
        const transaction = {
            id: Date.now().toString(),
            ...data,
            timestamp: Date.now()
        };
        
        switch (type) {
            case 'deposit':
                this.state.transactions.deposits.unshift(transaction);
                break;
            case 'withdrawal':
                this.state.transactions.withdrawals.unshift(transaction);
                break;
            case 'swap':
                this.state.transactions.swaps.unshift(transaction);
                break;
            case 'stake':
                this.state.transactions.stakes.unshift(transaction);
                break;
            case 'claim':
                this.state.transactions.claims.unshift(transaction);
                break;
        }
        
        // Keep only last 100 transactions
        Object.keys(this.state.transactions).forEach(key => {
            if (this.state.transactions[key].length > 100) {
                this.state.transactions[key] = this.state.transactions[key].slice(0, 100);
            }
        });
    }

    logEvent(eventName, data = {}) {
        const eventData = {
            event: eventName,
            timestamp: Date.now(),
            userId: this.state.user.id,
            page: this.currentPage,
            ...data
        };
        
        // Store locally
        if (!this.events) this.events = [];
        this.events.push(eventData);
        
        // Keep only last 100 events
        if (this.events.length > 100) {
            this.events = this.events.slice(-100);
        }
        
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`📊 Event: ${eventName}`, eventData);
        }
        
        // Send to analytics if available
        this.sendAnalytics(eventName, eventData);
    }

    sendAnalytics(eventName, data) {
        // This would send analytics data to your backend
        // For now, just increment request count
        this.performance.requests++;
    }

    /* ===========================================
       LOADING & INITIALIZATION
       =========================================== */

    showLoading() {
        const loadingScreen = this.elements.get('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('active');
            this.updateLoadingProgress(0);
        }
    }

    hideLoading() {
        const loadingScreen = this.elements.get('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.remove('active');
        }
    }

    updateLoadingProgress(progress) {
        const progressBar = this.elements.get('loadingProgress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    startServices() {
        // Mining timer
        this.timers.set('mining', setInterval(() => {
            this.updateMiningTimer();
        }, 1000));
        
        // Booster checker
        this.timers.set('booster', setInterval(() => {
            this.updateActiveBoosters();
        }, 60000));
        
        // Auto-save
        this.timers.set('autosave', setInterval(() => {
            this.saveState();
        }, 30000));
        
        // Session timer (update every minute)
        this.timers.set('session', setInterval(() => {
            this.state.user.lastActive = new Date().toISOString();
        }, 60000));
        
        console.log('⏱️ Background services started');
    }

    updateMiningTimer() {
        if (!this.state.mining.isActive) return;
        
        const now = Date.now();
        const timeLeft = this.state.mining.nextReward - now;
        
        const timerElement = this.elements.get('miningTimer');
        if (!timerElement) return;
        
        if (timeLeft <= 0) {
            timerElement.textContent = 'READY!';
            timerElement.style.color = 'var(--secondary)';
            this.updateMiningButton();
        } else {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            timerElement.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerElement.style.color = 'var(--text-primary)';
        }
    }

    logPerformance() {
        const duration = Date.now() - this.performance.startTime;
        console.log(`📊 Performance Report:`);
        console.log(`   Initialization time: ${duration}ms`);
        console.log(`   Total requests: ${this.performance.requests}`);
        console.log(`   Mining clicks: ${this.performance.miningClicks}`);
        console.log(`   Errors: ${this.performance.errors}`);
        console.log(`   State size: ${JSON.stringify(this.state).length} bytes`);
    }
}

/* ===========================================
   GLOBAL INITIALIZATION
   =========================================== */

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 400,
            once: true,
            offset: 100
        });
    }
    
    // Create and initialize the app
    window.alienMuskApp = new AlienMuskApp();
    
    // Make app accessible globally
    window.AlienMusk = window.alienMuskApp;
});

// Global helper functions
window.formatNumber = (num, decimals = 0) => {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
};

window.copyToClipboard = (text) => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
            .then(() => {
                if (window.alienMuskApp) {
                    window.alienMuskApp.showNotification('📋 Copied to clipboard!', 'success');
                }
            })
            .catch(() => {
                if (window.alienMuskApp) {
                    window.alienMuskApp.showNotification('Failed to copy', 'error');
                }
            });
    }
};

console.log('👽 Alien Musk Platform loaded successfully!');

// ============================================
// ALIEN MUSK - Quantum Mining Platform
// Professional JavaScript v2.0
// ============================================

// Telegram WebApp
let tg = null;
try {
    if (window.Telegram && window.Telegram.WebApp) {
        tg = window.Telegram.WebApp;
        tg.expand();
        tg.ready();
        console.log("✅ Telegram WebApp initialized");
    }
} catch (e) {
    console.log("⚠️ Not in Telegram environment");
}

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCuzWYapa7LBRg40OzcHLWFBpfSrjEVQoU",
    authDomain: "alien-musk-platform.firebaseapp.com",
    projectId: "alien-musk-platform",
    storageBucket: "alien-musk-platform.firebasestorage.app",
    messagingSenderId: "205041694428",
    appId: "1:205041694428:web:5b9a0ab2cc31b118d8be619"
};

// Initialize Firebase
let db = null;
if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log("✅ Firebase initialized");
    } catch (error) {
        console.error("❌ Firebase error:", error);
    }
}

// ============================================
// APP CONFIGURATION
// ============================================
const CONFIG = {
    // Mining Configuration
    MINING: {
        DURATION: 3600000, // 1 hour
        LEVELS: {
            1: { name: 'Beginner', reward: 2500, hashrate: 2500, cost: 0 },
            2: { name: 'Advanced', reward: 5000, hashrate: 5000, cost: 5 },
            3: { name: 'Pro', reward: 10000, hashrate: 10000, cost: 20 },
            4: { name: 'Expert', reward: 25000, hashrate: 25000, cost: 100 }
        }
    },
    
    // Staking Configuration
    STAKING: {
        PLANS: {
            1: { name: 'Silver Plan', amount: 10, duration: 7, apr: 40, dailyReward: 40 },
            2: { name: 'Gold Plan', amount: 50, duration: 15, apr: 50, dailyReward: 250 },
            3: { name: 'Diamond Plan', amount: 100, duration: 30, apr: 60, dailyReward: 600 }
        }
    },
    
    // Token Prices
    PRICES: {
        AMSK: 0.0002,
        USDT: 1,
        BNB: 300,
        TON: 2
    },
    
    // Referral System
    REFERRAL: {
        REWARD: 10000,
        MILESTONES: {
            10: 250000,
            25: 1000000,
            50: 5000000,
            100: 25000000
        }
    },
    
    // Wallet Limits
    WALLET: {
        MIN_DEPOSIT_USDT: 10,
        MIN_WITHDRAWAL: 50,
        DEPOSIT_ADDRESS: "0x790CAB511055F63db2F30AD227f7086bA3B6376a"
    },
    
    // Admin Configuration
    ADMIN: {
        TELEGRAM_ID: "1653918641",
        PASSWORD: "Ali97$"
    }
};

// ============================================
// APP STATE MANAGEMENT
// ============================================
class AppState {
    constructor() {
        this.user = {
            id: null,
            username: '',
            firstName: 'Alien',
            balance: 2500,
            totalEarned: 2500,
            miningLevel: 1,
            referralCode: '',
            referrals: [],
            referralCount: 0,
            referralEarnings: 0,
            lastMine: 0,
            isInitialized: false
        };
        
        this.wallet = {
            AMSK: 2500,
            USDT: 100,
            BNB: 0.5,
            TON: 50,
            totalWithdrawn: 0,
            pendingDeposits: [],
            pendingWithdrawals: [],
            transactions: []
        };
        
        this.mining = {
            active: true,
            lastReward: Date.now(),
            nextReward: Date.now() + CONFIG.MINING.DURATION,
            activeBoosters: [],
            totalMined: 2500
        };
        
        this.staking = {
            activeStakes: [],
            completedStakes: [],
            totalEarned: 0
        };
    }
    
    // Generate unique referral code
    generateReferralCode(userId) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'ALIEN-';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    
    // Calculate total balance in USD
    calculateTotalBalance() {
        return (
            this.wallet.AMSK * CONFIG.PRICES.AMSK +
            this.wallet.USDT * CONFIG.PRICES.USDT +
            this.wallet.BNB * CONFIG.PRICES.BNB +
            this.wallet.TON * CONFIG.PRICES.TON
        ).toFixed(2);
    }
    
    // Calculate next mining reward
    calculateNextReward() {
        const level = CONFIG.MINING.LEVELS[this.user.miningLevel];
        let reward = level.reward;
        
        // Apply boosters
        this.mining.activeBoosters.forEach(booster => {
            reward *= booster.multiplier;
        });
        
        return reward;
    }
}

// ============================================
// MAIN APP CLASS
// ============================================
class AlienMuskApp {
    constructor() {
        this.state = new AppState();
        this.elements = {};
        this.adminClicks = 0;
        this.lastAdminClick = 0;
        this.isProcessing = false;
        this.timers = {};
        this.init();
    }
    
    // Initialize the application
    async init() {
        console.log('👽 Initializing Alien Musk Platform...');
        
        try {
            // 1. Setup Telegram user
            await this.setupUser();
            
            // 2. Cache DOM elements
            this.cacheElements();
            
            // 3. Load saved data
            await this.loadData();
            
            // 4. Initialize UI
            this.initUI();
            
            // 5. Setup event listeners
            this.setupEventListeners();
            
            // 6. Setup admin access
            this.setupAdminAccess();
            
            // 7. Start background services
            this.startServices();
            
            // Mark as initialized
            this.state.user.isInitialized = true;
            
            // Show welcome message
            setTimeout(() => {
                this.hideLoading();
                this.showNotification('👽 Welcome to Alien Musk Quantum Platform!', 'success');
                console.log('✅ Platform initialized successfully');
            }, 1000);
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showNotification('Failed to initialize. Please refresh.', 'error');
            this.hideLoading();
        }
    }
    
    // Setup Telegram user
    async setupUser() {
        let telegramUser = null;
        
        if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
            telegramUser = tg.initDataUnsafe.user;
            console.log("📱 Telegram user found:", telegramUser.id);
        }
        
        if (telegramUser) {
            this.state.user.id = telegramUser.id.toString();
            this.state.user.username = telegramUser.username ? `@${telegramUser.username}` : 
                                     telegramUser.first_name || `User${telegramUser.id.toString().slice(-4)}`;
            this.state.user.firstName = telegramUser.first_name || 'Alien';
        } else {
            const savedId = localStorage.getItem('alien_musk_user_id');
            this.state.user.id = savedId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
            this.state.user.username = 'Alien Explorer';
            
            if (!savedId) {
                localStorage.setItem('alien_musk_user_id', this.state.user.id);
            }
        }
        
        // Generate referral code if not exists
        if (!this.state.user.referralCode) {
            this.state.user.referralCode = this.state.generateReferralCode(this.state.user.id);
        }
        
        // Check for referral parameter
        this.checkReferral();
    }
    
    // Cache DOM elements
    cacheElements() {
        const cache = (id) => document.getElementById(id);
        
        // Loading
        this.elements.loadingScreen = cache('loading-screen');
        this.elements.loadingProgress = cache('loading-progress');
        
        // Header
        this.elements.headerBalance = cache('header-balance');
        this.elements.username = cache('username');
        this.elements.userId = cache('user-id');
        this.elements.userAvatar = cache('user-avatar');
        this.elements.homeAvatar = cache('home-avatar');
        
        // Navigation
        this.elements.navButtons = document.querySelectorAll('.nav-btn');
        
        // Home Page
        this.elements.totalAmsk = cache('total-amsk');
        this.elements.usdEquivalent = cache('usd-equivalent');
        this.elements.currentHashrate = cache('current-hashrate');
        this.elements.miningTimer = cache('mining-timer');
        this.elements.nextReward = cache('next-reward');
        this.elements.startMiningBtn = cache('start-mining');
        this.elements.minedToday = cache('mined-today');
        this.elements.totalMined = cache('total-mined');
        this.elements.miningLevel = cache('mining-level');
        
        // Upgrades & Boosters
        this.elements.upgradeButtons = document.querySelectorAll('.upgrade-btn');
        this.elements.boosterButtons = document.querySelectorAll('.booster-btn');
        
        // Referral
        this.elements.refCode = cache('ref-code');
        this.elements.copyRefCode = cache('copy-ref-code');
        this.elements.shareRef = cache('share-ref');
        this.elements.refCount = cache('ref-count');
        this.elements.refEarned = cache('ref-earned');
        
        // Staking
        this.elements.stakeButtons = document.querySelectorAll('.stake-btn');
        this.elements.activeStakesList = cache('active-stakes-list');
        
        // Wallet
        this.elements.walletAmsk = cache('wallet-amsk');
        this.elements.walletUsdt = cache('wallet-usdt');
        this.elements.quickButtons = document.querySelectorAll('.quick-btn');
        
        // Modals
        this.elements.modalOverlay = cache('modal-overlay');
        this.elements.closeModalButtons = document.querySelectorAll('.close-modal');
        
        console.log('✅ DOM elements cached');
    }
    
    // Load data from storage
    async loadData() {
        try {
            const savedData = localStorage.getItem(`alien_musk_data_${this.state.user.id}`);
            
            if (savedData) {
                const parsed = JSON.parse(savedData);
                
                // Merge with current state
                Object.keys(parsed.user || {}).forEach(key => {
                    if (this.state.user[key] !== undefined) {
                        this.state.user[key] = parsed.user[key];
                    }
                });
                
                Object.keys(parsed.wallet || {}).forEach(key => {
                    if (this.state.wallet[key] !== undefined) {
                        this.state.wallet[key] = parsed.wallet[key];
                    }
                });
                
                console.log('📂 Data loaded from localStorage');
            }
            
            // Try to load from Firebase
            if (db) {
                await this.loadFromFirebase();
            }
            
        } catch (error) {
            console.warn('Failed to load data:', error);
        }
    }
    
    // Load from Firebase
    async loadFromFirebase() {
        if (!db || !this.state.user.id) return;
        
        try {
            const userDoc = await db.collection('users').doc(this.state.user.id).get();
            
            if (userDoc.exists) {
                const data = userDoc.data();
                
                // Update balances if Firebase has newer data
                if (data.lastUpdate && data.balance !== undefined) {
                    const firebaseTime = data.lastUpdate.toDate().getTime();
                    const localTime = this.state.user.lastMine || 0;
                    
                    if (firebaseTime > localTime) {
                        this.state.user.balance = data.balance || this.state.user.balance;
                        this.state.wallet.AMSK = this.state.user.balance;
                    }
                }
                
                console.log('🔥 Data loaded from Firebase');
            }
        } catch (error) {
            console.error('Firebase load error:', error);
        }
    }
    
    // Initialize UI
    initUI() {
        // Update user info
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
    
    // Update user information
    updateUserInfo() {
        if (this.elements.username) {
            this.elements.username.textContent = this.state.user.firstName;
        }
        
        if (this.elements.userId) {
            this.elements.userId.textContent = `ID: ${this.state.user.id.substring(0, 8)}...`;
        }
        
        if (this.elements.refCode) {
            this.elements.refCode.textContent = this.state.user.referralCode;
        }
    }
    
    // Update header
    updateHeader() {
        if (this.elements.headerBalance) {
            const total = this.state.calculateTotalBalance();
            this.elements.headerBalance.textContent = `$${total}`;
        }
    }
    
    // Update home page
    updateHomePage() {
        // Update balances
        if (this.elements.totalAmsk) {
            this.elements.totalAmsk.textContent = this.formatNumber(this.state.user.balance);
        }
        
        if (this.elements.usdEquivalent) {
            const usdValue = (this.state.user.balance * CONFIG.PRICES.AMSK).toFixed(2);
            this.elements.usdEquivalent.textContent = usdValue;
        }
        
        // Update mining info
        if (this.elements.currentHashrate) {
            const level = CONFIG.MINING.LEVELS[this.state.user.miningLevel];
            this.elements.currentHashrate.textContent = this.formatNumber(level.hashrate);
        }
        
        if (this.elements.nextReward) {
            const reward = this.state.calculateNextReward();
            this.elements.nextReward.textContent = this.formatNumber(reward);
        }
        
        if (this.elements.minedToday) {
            this.elements.minedToday.textContent = this.formatNumber(this.state.mining.totalMined);
        }
        
        if (this.elements.miningLevel) {
            this.elements.miningLevel.textContent = this.state.user.miningLevel;
        }
        
        // Update mining button
        this.updateMiningButton();
        
        // Update referral info
        if (this.elements.refCount) {
            this.elements.refCount.textContent = this.state.user.referralCount;
        }
        
        if (this.elements.refEarned) {
            this.elements.refEarned.textContent = `${this.formatNumber(this.state.user.referralEarnings)} AMSK`;
        }
    }
    
    // Update mining button state
    updateMiningButton() {
        const button = this.elements.startMiningBtn;
        if (!button) return;
        
        const now = Date.now();
        const isReady = now >= this.state.mining.nextReward;
        
        if (!this.state.mining.active) {
            button.innerHTML = '<i class="fas fa-play"></i><span>Activate Quantum Core</span>';
            button.disabled = false;
        } else if (isReady) {
            button.innerHTML = '<i class="fas fa-gift"></i><span>Claim Reward</span>';
            button.disabled = false;
        } else {
            button.innerHTML = '<i class="fas fa-clock"></i><span>Mining...</span>';
            button.disabled = true;
        }
    }
    
    // Update staking page
    updateStakingPage() {
        const listElement = this.elements.activeStakesList;
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
        
        // Render stakes list
        let html = '';
        stakes.forEach((stake, index) => {
            const plan = CONFIG.STAKING.PLANS[stake.planId];
            if (!plan) return;
            
            const progress = Math.min((Date.now() - stake.startTime) / (stake.duration * 24 * 60 * 60 * 1000) * 100, 100);
            
            html += `
                <div class="stake-item">
                    <div class="stake-header">
                        <div class="stake-plan">
                            <div class="plan-icon">
                                <i class="fas fa-gem"></i>
                            </div>
                            <div class="plan-info">
                                <h5>${plan.name}</h5>
                                <span>${plan.amount} USDT</span>
                            </div>
                        </div>
                        <span class="status-badge active">Active</span>
                    </div>
                    <div class="stake-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="progress-text">${Math.round(progress)}% Complete</div>
                    </div>
                    <div class="stake-reward">
                        <i class="fas fa-coins"></i>
                        <span>Daily: ${plan.dailyReward} AMSK</span>
                    </div>
                </div>
            `;
        });
        
        listElement.innerHTML = html;
    }
    
    // Update wallet page
    updateWalletPage() {
        if (this.elements.walletAmsk) {
            this.elements.walletAmsk.textContent = this.formatNumber(this.state.wallet.AMSK);
        }
        
        if (this.elements.walletUsdt) {
            this.elements.walletUsdt.textContent = this.formatNumber(this.state.wallet.USDT, 2);
        }
    }
    
    // ============================================
    // MINING SYSTEM
    // ============================================
    handleMining() {
        if (!this.state.mining.active) {
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
        this.state.mining.active = true;
        this.state.mining.lastReward = Date.now();
        this.state.mining.nextReward = Date.now() + CONFIG.MINING.DURATION;
        
        this.updateMiningButton();
        this.showNotification('⚡ Quantum Core activated! Mining started.', 'success');
        this.saveData();
    }
    
    claimMiningReward() {
        const reward = this.state.calculateNextReward();
        
        // Add reward to balance
        this.state.user.balance += reward;
        this.state.wallet.AMSK = this.state.user.balance;
        this.state.mining.totalMined += reward;
        
        // Reset timer
        this.state.mining.lastReward = Date.now();
        this.state.mining.nextReward = Date.now() + CONFIG.MINING.DURATION;
        
        // Update UI
        this.updateHomePage();
        this.updateWalletPage();
        this.updateHeader();
        
        // Show reward
        this.showNotification(`💰 +${this.formatNumber(reward)} AMSK mined!`, 'success');
        
        // Save data
        this.saveData();
    }
    
    upgradeMining(level) {
        level = parseInt(level);
        const levelData = CONFIG.MINING.LEVELS[level];
        
        if (!levelData) {
            this.showNotification('Invalid mining level', 'error');
            return;
        }
        
        if (level <= this.state.user.miningLevel) {
            this.showNotification('Already at or above this level!', 'warning');
            return;
        }
        
        if (this.state.wallet.USDT < levelData.cost) {
            this.showNotification(`Insufficient USDT. Need ${levelData.cost} USDT.`, 'error');
            return;
        }
        
        // Deduct cost and upgrade
        this.state.wallet.USDT -= levelData.cost;
        this.state.user.miningLevel = level;
        
        // Update UI
        this.updateHomePage();
        this.updateWalletPage();
        this.updateHeader();
        
        // Show success
        this.showNotification(`⚡ Upgraded to ${levelData.name} level!`, 'success');
        
        // Save data
        this.saveData();
    }
    
    activateBooster(boosterType) {
        const boosters = {
            '2x': { multiplier: 2, price: 10000 },
            '3x': { multiplier: 3, price: 15000 },
            '5x': { multiplier: 5, price: 25000 }
        };
        
        const booster = boosters[boosterType];
        if (!booster) return;
        
        // Check if already active
        const isActive = this.state.mining.activeBoosters.some(b => b.type === boosterType);
        if (isActive) {
            this.showNotification('Booster already active!', 'warning');
            return;
        }
        
        // Check balance
        if (this.state.wallet.AMSK < booster.price) {
            this.showNotification(`Need ${booster.price} AMSK to activate`, 'error');
            return;
        }
        
        // Activate booster
        this.state.wallet.AMSK -= booster.price;
        this.state.mining.activeBoosters.push({
            type: boosterType,
            multiplier: booster.multiplier,
            activatedAt: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        });
        
        // Update UI
        this.updateHomePage();
        this.updateWalletPage();
        
        // Show success
        this.showNotification(`⚡ ${boosterType} Booster activated for 24 hours!`, 'success');
        
        // Save data
        this.saveData();
    }
    
    // ============================================
    // STAKING SYSTEM
    // ============================================
    openStakeModal(planId) {
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
                            <div class="plan-minimum">Stake: ${plan.amount} USDT</div>
                        </div>
                    </div>
                </div>
                
                <div class="stake-details">
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
    
    confirmStaking(planId) {
        const plan = CONFIG.STAKING.PLANS[planId];
        if (!plan) return;
        
        // Check balance
        if (this.state.wallet.USDT < plan.amount) {
            this.showNotification('Insufficient USDT balance', 'error');
            return;
        }
        
        // Create stake
        const stake = {
            planId: planId,
            amount: plan.amount,
            startTime: Date.now(),
            duration: plan.duration,
            dailyReward: plan.dailyReward,
            claimed: 0
        };
        
        // Deduct USDT
        this.state.wallet.USDT -= plan.amount;
        this.state.staking.activeStakes.push(stake);
        
        // Update UI
        this.updateStakingPage();
        this.updateWalletPage();
        this.updateHeader();
        
        // Close modal
        this.closeModal();
        
        // Show success
        this.showNotification(`✅ Staked ${plan.amount} USDT for ${plan.duration} days!`, 'success');
        
        // Save data
        this.saveData();
    }
    
    // ============================================
    // WALLET SYSTEM
    // ============================================
    openDepositModal(currency = 'USDT') {
        const modalContent = `
            <div class="deposit-modal-content">
                <div class="deposit-info">
                    <div class="info-box">
                        <h5>Deposit ${currency}</h5>
                        <p>Send only <strong>${currency}</strong> to this address</p>
                        <div class="address-display">
                            <div class="address-label">Your Address:</div>
                            <div class="address-box">
                                <code>${CONFIG.WALLET.DEPOSIT_ADDRESS}</code>
                                <button class="copy-btn" onclick="app.copyToClipboard('${CONFIG.WALLET.DEPOSIT_ADDRESS}')">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="deposit-instructions">
                        <h6><i class="fas fa-graduation-cap"></i> How to Deposit:</h6>
                        <ol>
                            <li>Copy the ${currency} address above</li>
                            <li>Send ${currency} from your wallet (BEP20 network only)</li>
                            <li>Wait for transaction confirmation</li>
                            <li>Your balance will update automatically</li>
                        </ol>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="modal-btn secondary" onclick="app.closeModal()">
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
                    <div class="balance-info">
                        <i class="fas fa-wallet"></i>
                        <span>Available: ${this.formatNumber(this.state.wallet.USDT, 2)} USDT</span>
                    </div>
                    
                    <div class="withdraw-form">
                        <div class="form-group">
                            <label>Amount (USDT)</label>
                            <input type="number" id="withdrawAmount" 
                                   value="${this.state.wallet.USDT > 50 ? '50' : this.state.wallet.USDT.toFixed(2)}"
                                   min="50" max="${this.state.wallet.USDT}" step="0.01">
                        </div>
                        
                        <div class="form-group">
                            <label>Wallet Address</label>
                            <input type="text" id="withdrawAddress" 
                                   placeholder="Enter your USDT wallet address">
                        </div>
                        
                        <div class="fee-info">
                            <i class="fas fa-info-circle"></i>
                            <span>Network fee: 0.0005 BNB (included)</span>
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
    
    submitWithdrawal() {
        const amount = parseFloat(document.getElementById('withdrawAmount')?.value);
        const address = document.getElementById('withdrawAddress')?.value.trim();
        
        if (!amount || amount < CONFIG.WALLET.MIN_WITHDRAWAL) {
            this.showNotification(`Minimum withdrawal is ${CONFIG.WALLET.MIN_WITHDRAWAL} USDT`, 'error');
            return;
        }
        
        if (amount > this.state.wallet.USDT) {
            this.showNotification('Insufficient USDT balance', 'error');
            return;
        }
        
        if (!address || address.length < 10) {
            this.showNotification('Please enter valid wallet address', 'error');
            return;
        }
        
        // Create withdrawal request
        const withdrawal = {
            id: 'withdraw_' + Date.now(),
            userId: this.state.user.id,
            amount: amount,
            address: address,
            timestamp: Date.now(),
            status: 'pending'
        };
        
        // Add to pending
        this.state.wallet.pendingWithdrawals.push(withdrawal);
        
        // Save to Firebase if available
        if (db) {
            db.collection('withdrawals').add({
                ...withdrawal,
                username: this.state.user.username,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Close modal
        this.closeModal();
        
        // Show success
        this.showNotification(`✅ Withdrawal request submitted for ${amount} USDT`, 'success');
        
        // Save data
        this.saveData();
    }
    
    openSwapModal() {
        const modalContent = `
            <div class="swap-modal-content">
                <div class="swap-form">
                    <div class="swap-from">
                        <div class="swap-header">
                            <span>From</span>
                            <span>Balance: ${this.formatNumber(this.state.wallet.AMSK)} AMSK</span>
                        </div>
                        <div class="swap-input">
                            <select id="swapFrom">
                                <option value="AMSK" selected>AMSK</option>
                                <option value="USDT">USDT</option>
                            </select>
                            <input type="number" id="swapAmount" placeholder="0" min="1000">
                        </div>
                    </div>
                    
                    <div class="swap-arrow">
                        <i class="fas fa-exchange-alt"></i>
                    </div>
                    
                    <div class="swap-to">
                        <div class="swap-header">
                            <span>To</span>
                            <span>Balance: ${this.formatNumber(this.state.wallet.USDT, 2)} USDT</span>
                        </div>
                        <div class="swap-input">
                            <select id="swapTo">
                                <option value="USDT" selected>USDT</option>
                                <option value="AMSK">AMSK</option>
                            </select>
                            <div id="swapResult">0.00</div>
                        </div>
                    </div>
                    
                    <div class="swap-info">
                        <div class="swap-rate">
                            Rate: 1 AMSK = ${CONFIG.PRICES.AMSK} USDT
                        </div>
                        <div class="swap-fee">
                            Fee: 1%
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
    
    executeSwap() {
        const fromCurrency = document.getElementById('swapFrom')?.value;
        const toCurrency = document.getElementById('swapTo')?.value;
        const amount = parseFloat(document.getElementById('swapAmount')?.value) || 0;
        
        if (amount <= 0) {
            this.showNotification('Please enter amount', 'error');
            return;
        }
        
        if (fromCurrency === toCurrency) {
            this.showNotification('Cannot swap same currency', 'error');
            return;
        }
        
        // Calculate swap
        let fromBalance = this.state.wallet[fromCurrency];
        let toReceive = 0;
        
        if (fromCurrency === 'AMSK' && toCurrency === 'USDT') {
            toReceive = amount * CONFIG.PRICES.AMSK * 0.99; // 1% fee
            fromBalance = this.state.wallet.AMSK;
        } else if (fromCurrency === 'USDT' && toCurrency === 'AMSK') {
            toReceive = amount / CONFIG.PRICES.AMSK * 0.99; // 1% fee
            fromBalance = this.state.wallet.USDT;
        }
        
        // Check balance
        if (amount > fromBalance) {
            this.showNotification('Insufficient balance', 'error');
            return;
        }
        
        // Execute swap
        this.state.wallet[fromCurrency] -= amount;
        this.state.wallet[toCurrency] += toReceive;
        
        // Update UI
        this.updateWalletPage();
        this.updateHomePage();
        this.updateHeader();
        
        // Close modal
        this.closeModal();
        
        // Show success
        this.showNotification(`✅ Swapped ${amount} ${fromCurrency} to ${toReceive.toFixed(2)} ${toCurrency}`, 'success');
        
        // Save data
        this.saveData();
    }
    
    // ============================================
    // REFERRAL SYSTEM
    // ============================================
    checkReferral() {
        // Check Telegram start parameter
        if (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) {
            const refCode = tg.initDataUnsafe.start_param;
            if (refCode && refCode !== this.state.user.referralCode) {
                this.processReferral(refCode);
            }
        }
        
        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const urlRef = urlParams.get('ref') || urlParams.get('startapp');
        if (urlRef && urlRef !== this.state.user.referralCode) {
            this.processReferral(urlRef);
        }
    }
    
    processReferral(refCode) {
        if (!refCode || refCode === this.state.user.referralCode) return;
        
        // Add to referrals
        if (!this.state.user.referrals.includes(refCode)) {
            this.state.user.referrals.push(refCode);
            this.state.user.referralCount++;
            this.state.user.referralEarnings += CONFIG.REFERRAL.REWARD;
            this.state.user.balance += CONFIG.REFERRAL.REWARD;
            this.state.wallet.AMSK = this.state.user.balance;
            
            // Update UI
            this.updateHomePage();
            this.updateWalletPage();
            
            // Show notification
            this.showNotification(`🎉 Referral bonus: +${CONFIG.REFERRAL.REWARD} AMSK!`, 'success');
            
            // Save data
            this.saveData();
        }
    }
    
    copyReferralCode() {
        this.copyToClipboard(this.state.user.referralCode);
        this.showNotification('✅ Referral code copied!', 'success');
    }
    
    shareReferral() {
        const link = `https://t.me/AlienMuskBot?start=${this.state.user.referralCode}`;
        const message = `🚀 Join Alien Musk Quantum Mining Platform!\n\n⛏️ Mine AMSK tokens\n💰 High staking rewards\n👥 Use my code: ${this.state.user.referralCode}\n\n${link}`;
        
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
        const logo = document.querySelector('.brand-logo');
        if (logo) {
            logo.addEventListener('click', () => this.handleAdminClick());
        }
    }
    
    handleAdminClick() {
        const now = Date.now();
        
        // Reset if more than 2 seconds passed
        if (now - this.lastAdminClick > 2000) {
            this.adminClicks = 0;
        }
        
        this.adminClicks++;
        this.lastAdminClick = now;
        
        // Show admin login after required clicks
        if (this.adminClicks >= CONFIG.ADMIN.CLICKS_REQUIRED) {
            this.showAdminLogin();
            this.adminClicks = 0;
        }
    }
    
    showAdminLogin() {
        const modalContent = `
            <div class="admin-login-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-lock"></i> Admin Access</h3>
                </div>
                <div class="modal-body">
                    <div class="admin-form">
                        <input type="password" id="adminPassword" 
                               placeholder="Enter admin password" 
                               style="width: 100%; padding: 10px; margin-bottom: 15px;">
                        <button class="btn-primary" onclick="app.checkAdminPassword()">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.openModal('admin-login', modalContent);
    }
    
    checkAdminPassword() {
        const password = document.getElementById('adminPassword')?.value;
        const userTelegramId = this.state.user.id;
        
        if (password === CONFIG.ADMIN.PASSWORD && userTelegramId === CONFIG.ADMIN.TELEGRAM_ID) {
            this.state.admin = { isLoggedIn: true };
            this.closeModal();
            this.showAdminPanel();
            this.showNotification('👑 Admin access granted', 'success');
        } else {
            this.showNotification('❌ Access denied', 'error');
        }
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
                            <input type="text" id="adminUserId" placeholder="User ID">
                            <input type="number" id="adminAmount" placeholder="Amount (AMSK)">
                            <button class="btn-primary" onclick="app.addUserBalance()">
                                <i class="fas fa-plus-circle"></i> Add Balance
                            </button>
                        </div>
                    </div>
                    
                    <div class="admin-content" id="adminDepositsTab" style="display: none;">
                        <h4>Pending Deposits</h4>
                        <div class="empty-state">
                            <i class="fas fa-inbox"></i>
                            <p>No pending deposits</p>
                        </div>
                    </div>
                    
                    <div class="admin-content" id="adminWithdrawalsTab" style="display: none;">
                        <h4>Pending Withdrawals</h4>
                        <div class="empty-state">
                            <i class="fas fa-inbox"></i>
                            <p>No pending withdrawals</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.openModal('admin-panel', modalContent);
    }
    
    switchAdminTab(tabName) {
        // Tab switching logic
        document.querySelectorAll('.admin-content').forEach(content => {
            content.style.display = 'none';
        });
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeTab = document.getElementById(`admin${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Tab`);
        const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(btn => 
            btn.textContent.toLowerCase().includes(tabName)
        );
        
        if (activeTab) activeTab.style.display = 'block';
        if (activeBtn) activeBtn.classList.add('active');
    }
    
    addUserBalance() {
        const userId = document.getElementById('adminUserId')?.value;
        const amount = parseFloat(document.getElementById('adminAmount')?.value);
        
        if (!userId || !amount) {
            this.showNotification('Please enter user ID and amount', 'error');
            return;
        }
        
        // In a real app, this would update the user in Firebase
        this.showNotification(`Balance added to user ${userId}`, 'success');
        
        // Clear inputs
        document.getElementById('adminUserId').value = '';
        document.getElementById('adminAmount').value = '';
    }
    
    // ============================================
    // UI UTILITIES
    // ============================================
    showPage(pageName) {
        if (this.currentPage === pageName) return;
        
        // Hide all pages
        this.elements.pages.forEach(page => {
            page.style.display = 'none';
            page.classList.remove('active');
        });
        
        // Update navigation
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
    }
    
    openModal(modalType, content) {
        // Close any open modal first
        this.closeModal();
        
        const modal = document.getElementById(`${modalType}`);
        if (!modal) return;
        
        // Set content
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody && content) {
            modalBody.innerHTML = content;
        }
        
        // Show modal
        this.elements.modalOverlay.classList.add('active');
        modal.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        this.currentModal = modalType;
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
        
        // Restore scroll
        document.body.style.overflow = '';
        
        this.currentModal = null;
    }
    
    showNotification(message, type = 'info') {
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
        
        const center = this.elements.notificationCenter;
        if (center) {
            center.appendChild(notification);
            
            // Auto-remove after 4 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 4000);
        }
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
    // DATA MANAGEMENT
    // ============================================
    saveData() {
        if (!this.state.user.id || this.isProcessing) return;
        
        this.isProcessing = true;
        
        try {
            // Prepare data
            const dataToSave = {
                user: this.state.user,
                wallet: this.state.wallet,
                mining: this.state.mining,
                staking: this.state.staking,
                lastSave: Date.now()
            };
            
            // Save to localStorage
            localStorage.setItem(`alien_musk_data_${this.state.user.id}`, JSON.stringify(dataToSave));
            
            // Save to Firebase if available
            if (db) {
                this.saveToFirebase();
            }
            
            console.log('💾 Data saved');
            
        } catch (error) {
            console.error('Save error:', error);
        } finally {
            this.isProcessing = false;
        }
    }
    
    async saveToFirebase() {
        if (!db || !this.state.user.id) return;
        
        try {
            await db.collection('users').doc(this.state.user.id).set({
                userId: this.state.user.id,
                username: this.state.user.username,
                balance: this.state.user.balance,
                miningLevel: this.state.user.miningLevel,
                referralCode: this.state.user.referralCode,
                referralCount: this.state.user.referralCount,
                lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            
        } catch (error) {
            console.error('Firebase save error:', error);
        }
    }
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    formatNumber(num, decimals = 0) {
        if (typeof num !== 'number' || isNaN(num)) return '0';
        
        // Format large numbers
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
            console.error('Copy error:', err);
        });
    }
    
    // ============================================
    // EVENT LISTENERS
    // ============================================
    setupEventListeners() {
        console.log('🎯 Setting up event listeners...');
        
        // Navigation
        if (this.elements.navButtons) {
            this.elements.navButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const page = btn.dataset.page;
                    this.showPage(page);
                });
            });
        }
        
        // Mining button
        if (this.elements.startMiningBtn) {
            this.elements.startMiningBtn.addEventListener('click', () => this.handleMining());
        }
        
        // Upgrade buttons
        if (this.elements.upgradeButtons) {
            this.elements.upgradeButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const card = e.target.closest('.upgrade-card');
                    if (card) {
                        this.upgradeMining(card.dataset.level);
                    }
                });
            });
        }
        
        // Booster buttons
        if (this.elements.boosterButtons) {
            this.elements.boosterButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const card = e.target.closest('.booster-card');
                    if (card) {
                        this.activateBooster(card.dataset.booster);
                    }
                });
            });
        }
        
        // Staking buttons
        if (this.elements.stakeButtons) {
            this.elements.stakeButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const planId = btn.dataset.plan;
                    this.openStakeModal(planId);
                });
            });
        }
        
        // Quick action buttons
        if (this.elements.quickButtons) {
            this.elements.quickButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = btn.dataset.action;
                    this.handleQuickAction(action);
                });
            });
        }
        
        // Referral buttons
        if (this.elements.copyRefCode) {
            this.elements.copyRefCode.addEventListener('click', () => this.copyReferralCode());
        }
        
        if (this.elements.shareRef) {
            this.elements.shareRef.addEventListener('click', () => this.shareReferral());
        }
        
        // Modal close buttons
        if (this.elements.closeModalButtons) {
            this.elements.closeModalButtons.forEach(btn => {
                btn.addEventListener('click', () => this.closeModal());
            });
        }
        
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
            this.saveData();
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
            this.saveData();
        }, 30000);
        
        // Check for expired boosters
        this.timers.boosters = setInterval(() => {
            this.checkExpiredBoosters();
        }, 60000);
        
        console.log('⏱️ Background services started');
    }
    
    updateMiningTimer() {
        if (!this.state.mining.active) return;
        
        const now = Date.now();
        const timeLeft = this.state.mining.nextReward - now;
        
        const timerElement = this.elements.miningTimer;
        if (!timerElement) return;
        
        if (timeLeft <= 0) {
            timerElement.textContent = 'READY!';
            timerElement.style.color = '#00ff88';
            this.updateMiningButton();
        } else {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            timerElement.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerElement.style.color = '#ffffff';
        }
    }
    
    checkExpiredBoosters() {
        const now = Date.now();
        const activeBoosters = this.state.mining.activeBoosters.filter(booster => {
            return booster.expiresAt > now;
        });
        
        if (activeBoosters.length !== this.state.mining.activeBoosters.length) {
            this.state.mining.activeBoosters = activeBoosters;
            this.updateHomePage();
            this.saveData();
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
});

console.log('👽 Alien Musk Platform v2.0 loaded!');

// ============================================
// END OF FILE
// ============================================

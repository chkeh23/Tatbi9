/* ===========================================
   ALIEN MUSK - Ultimate Crypto Platform
   Main Application JavaScript
   Version: 4.0.0 (Professional & Complete)
   =========================================== */

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
const APP_CONFIG = {
    AMSK_PRICE: 0.0002,
    
    // Mining Configuration - Updated to 2,500/hour
    MINING_LEVELS: {
        1: { 
            name: "Beginner", 
            cost: 0, 
            reward: 2500,  // 2,500 AMSK per hour
            hashrate: "2,500",
            duration: 1 // 1 hour
        },
        2: { 
            name: "Advanced", 
            cost: 5, 
            reward: 5000,  // 5,000 AMSK per hour
            hashrate: "5,000",
            duration: 1
        },
        3: { 
            name: "Pro", 
            cost: 20, 
            reward: 10000, // 10,000 AMSK per hour
            hashrate: "10,000",
            duration: 1
        },
        4: { 
            name: "Expert", 
            cost: 100, 
            reward: 25000, // 25,000 AMSK per hour
            hashrate: "25,000",
            duration: 1
        }
    },
    
    // Staking Plans
    STAKING_PLANS: {
        1: { 
            name: "Silver", 
            amount: 10, 
            duration: 7, 
            apr: 40, 
            dailyReward: 40,
            color: "silver"
        },
        2: { 
            name: "Gold", 
            amount: 50, 
            duration: 15, 
            apr: 50, 
            dailyReward: 250,
            color: "gold"
        },
        3: { 
            name: "Diamond", 
            amount: 100, 
            duration: 30, 
            apr: 60, 
            dailyReward: 600,
            color: "#B9F2FF"
        }
    },
    
    // Referral Rewards
    REFERRAL_REWARDS: {
        10: { reward: 250000 }
    },
    
    // Swap Rates
    SWAP_RATES: {
        AMSK_TO_USDT: 0.0002,
        USDT_TO_AMSK: 5000
    },
    
    // Minimum Limits
    MIN_DEPOSIT: 10,
    MIN_WITHDRAWAL: 100,
    MIN_SWAP_AMSK: 250000
};

class AlienMuskApp {
    constructor() {
        this.init();
    }

    async init() {
        console.log('👽 Alien Musk App Initializing...');
        this.showLoading();
        
        try {
            // Initialize Firebase
            await this.initFirebase();
            
            // Initialize Telegram
            await this.initTelegram();
            
            // Setup initial state
            this.setupInitialState();
            
            // Cache DOM elements
            this.cacheElements();
            
            // Initialize UI
            this.initUI();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load user data
            await this.loadUserData();
            
            // Start background timers
            this.startTimers();
            
            // Hide loading
            this.hideLoading();
            
            // Show welcome notification
            this.showNotification('Welcome to Alien Musk! 🚀', 'success');
            
            console.log('✅ App initialized successfully');
            
        } catch (error) {
            console.error('❌ App initialization failed:', error);
            this.showNotification('Failed to initialize app. Please refresh.', 'error');
            this.hideLoading();
        }
    }

    /* ===========================================
       INITIALIZATION METHODS
       =========================================== */

    async initFirebase() {
        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(FIREBASE_CONFIG);
            }
            this.db = firebase.firestore();
            console.log('🔥 Firebase initialized');
        } catch (error) {
            console.error('Firebase init error:', error);
            // Fallback to localStorage
            this.useLocalStorage = true;
        }
    }

    async initTelegram() {
        if (window.Telegram?.WebApp) {
            this.tg = window.Telegram.WebApp;
            this.tg.expand();
            this.tg.ready();
            console.log('📱 Telegram WebApp initialized');
        } else {
            console.warn('⚠️ Running in browser mode');
            this.tg = {
                initDataUnsafe: {
                    user: {
                        id: Date.now(),
                        username: 'alien_user',
                        first_name: 'Alien',
                        photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alien'
                    }
                }
            };
        }
    }

    setupInitialState() {
        const user = this.tg.initDataUnsafe?.user || {};
        
        this.state = {
            user: {
                id: user.id || Date.now().toString(),
                name: user.first_name || 'Alien',
                username: user.username || 'alien_user',
                photoUrl: user.photo_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=alien'
            },
            mining: {
                level: 1,
                isActive: true,
                nextReward: Date.now() + (60 * 60 * 1000), // 1 hour
                minedToday: 0,
                totalMined: 2500, // Starting balance
                lastClaim: Date.now()
            },
            staking: {
                activeStakes: [],
                totalEarned: 0
            },
            balances: {
                AMSK: 2500, // Starting with 2,500 AMSK
                USDT: 100   // Starting with 100 USDT
            },
            referral: {
                code: 'ALIEN-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                referrals: 0,
                earned: 0
            },
            transactions: {
                deposits: [],
                withdrawals: [],
                swaps: []
            }
        };
    }

    cacheElements() {
        // Navigation
        this.navBtns = document.querySelectorAll('.nav-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // Home Tab Elements
        this.welcomeText = document.getElementById('welcome-text');
        this.userId = document.getElementById('user-id');
        this.totalAmsk = document.getElementById('total-amsk');
        this.usdEquivalent = document.getElementById('usd-equivalent');
        this.userAvatar = document.getElementById('user-avatar');
        
        // Mining Elements
        this.currentHashrate = document.getElementById('current-hashrate');
        this.miningTimer = document.getElementById('mining-timer');
        this.nextReward = document.getElementById('next-reward');
        this.startMiningBtn = document.getElementById('start-mining');
        
        // Stats Elements
        this.minedToday = document.getElementById('mined-today');
        this.totalMined = document.getElementById('total-mined');
        this.stakingEarned = document.getElementById('staking-earned');
        this.miningLevel = document.getElementById('mining-level');
        
        // Referral Elements
        this.refCount = document.getElementById('ref-count');
        this.totalRefs = document.getElementById('total-refs');
        this.refEarned = document.getElementById('ref-earned');
        this.nextGoal = document.getElementById('next-goal');
        this.progressText = document.getElementById('progress-text');
        this.progressFill = document.getElementById('progress-fill');
        this.goalReward = document.getElementById('goal-reward');
        this.refCode = document.getElementById('ref-code');
        this.copyRefCode = document.getElementById('copy-ref-code');
        this.shareRef = document.getElementById('share-ref');
        
        // Staking Elements
        this.activeStakesList = document.getElementById('active-stakes-list');
        this.stakeBtns = document.querySelectorAll('.stake-btn');
        
        // Calculator Elements
        this.calcAmount = document.getElementById('calc-amount');
        this.calcDuration = document.getElementById('calc-duration');
        this.calcDaily = document.getElementById('calc-daily');
        this.calcTotal = document.getElementById('calc-total');
        this.calcApr = document.getElementById('calc-apr');
        
        // Wallet Elements
        this.walletTotalAmsk = document.getElementById('wallet-total-amsk');
        this.walletTotalUsd = document.getElementById('wallet-total-usd');
        this.walletAmsk = document.getElementById('wallet-amsk');
        this.walletAmskValue = document.getElementById('wallet-amsk-value');
        this.walletUsdt = document.getElementById('wallet-usdt');
        this.walletUsdtValue = document.getElementById('wallet-usdt-value');
        this.usdtAddress = document.getElementById('usdt-address');
        
        // Quick Actions
        this.quickBtns = document.querySelectorAll('.quick-btn');
        
        // Asset Actions
        this.assetActionBtns = document.querySelectorAll('.asset-action-btn');
        
        // Modal Elements
        this.modalOverlay = document.getElementById('modal-overlay');
        this.closeModalBtns = document.querySelectorAll('.close-modal');
        
        // Deposit Modal
        this.currencyOptions = document.querySelectorAll('.currency-option');
        this.depositAddress = document.getElementById('deposit-address');
        this.submitDeposit = document.getElementById('submit-deposit');
        
        // Withdraw Modal
        this.withdrawBalance = document.getElementById('withdraw-balance');
        this.submitWithdraw = document.getElementById('submit-withdraw');
        
        // Swap Modal
        this.swapFromAmount = document.getElementById('swap-from-amount');
        this.swapToAmount = document.getElementById('swap-to-amount');
        this.submitSwap = document.getElementById('submit-swap');
        
        // Stake Modal
        this.stakeAmount = document.getElementById('stake-amount');
        this.confirmStake = document.getElementById('confirm-stake');
        
        // Loading
        this.loadingSpinner = document.getElementById('loading-spinner');
        
        // Header
        this.headerBalance = document.getElementById('header-balance');
    }

    initUI() {
        // Set user info
        this.welcomeText.textContent = `Welcome, ${this.state.user.name}!`;
        this.userId.textContent = this.state.user.id.substring(0, 8);
        this.userAvatar.src = this.state.user.photoUrl;
        
        // Update all UI
        this.updateHeader();
        this.updateHomeTab();
        this.updateStakingTab();
        this.updateWalletTab();
        
        // Show home tab by default
        this.switchTab('home');
    }

    setupEventListeners() {
        // Navigation - This is the most important part!
        this.navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Mining
        this.startMiningBtn.addEventListener('click', () => this.handleMining());
        
        // Mining Levels
        document.querySelectorAll('.upgrade-btn:not(.active-btn)').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.disabled) return;
                const card = e.target.closest('.level-card');
                if (card) {
                    this.upgradeMining(card.dataset.level);
                }
            });
        });

        // Referral
        this.copyRefCode.addEventListener('click', () => this.copyReferralCode());
        this.shareRef.addEventListener('click', () => this.shareReferralLink());

        // Staking
        this.stakeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const planId = e.currentTarget.dataset.plan;
                this.openStakeModal(planId);
            });
        });

        // Calculator
        this.calcAmount.addEventListener('input', () => this.updateCalculator());
        this.calcDuration.addEventListener('change', () => this.updateCalculator());

        // Quick Actions
        this.quickBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Asset Actions
        this.assetActionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                const currency = e.currentTarget.dataset.currency;
                this.handleAssetAction(action, currency);
            });
        });

        // Copy Address
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.copyToClipboard(this.usdtAddress.textContent);
            });
        });

        // Modal Controls
        this.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });
        
        this.modalOverlay.addEventListener('click', () => this.closeAllModals());

        // Deposit Modal
        this.currencyOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                this.currencyOptions.forEach(opt => opt.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        this.submitDeposit.addEventListener('click', () => this.submitDeposit());

        // Withdraw Modal
        this.submitWithdraw.addEventListener('click', () => this.submitWithdrawal());

        // Swap Modal
        this.swapFromAmount.addEventListener('input', () => this.updateSwap());
        this.submitSwap.addEventListener('click', () => this.executeSwap());

        // Stake Modal
        this.stakeAmount.addEventListener('input', () => this.updateStakePreview());
        this.confirmStake.addEventListener('click', () => this.confirmStaking());

        // Admin access (5 clicks on logo)
        let clickCount = 0;
        let lastClickTime = 0;
        
        document.querySelector('.brand-section').addEventListener('click', () => {
            const now = Date.now();
            if (now - lastClickTime > 2000) clickCount = 0;
            
            lastClickTime = now;
            clickCount++;
            
            if (clickCount >= 5) {
                this.showAdminPanel();
                clickCount = 0;
            }
        });
    }

    /* ===========================================
       TAB NAVIGATION - NOW WORKING!
       =========================================== */

    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        
        // Update active nav button
        this.navBtns.forEach(btn => {
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Hide all tabs
        this.tabContents.forEach(content => {
            content.classList.remove('active');
        });

        // Show selected tab
        const selectedTab = document.getElementById(`${tabName}-tab`);
        if (selectedTab) {
            selectedTab.classList.add('active');
            
            // Update tab-specific data
            switch (tabName) {
                case 'home':
                    this.updateHomeTab();
                    break;
                case 'staking':
                    this.updateStakingTab();
                    break;
                case 'wallet':
                    this.updateWalletTab();
                    break;
            }
        }
    }

    /* ===========================================
       DATA MANAGEMENT
       =========================================== */

    async loadUserData() {
        try {
            if (this.useLocalStorage) {
                this.loadFromLocalStorage();
            } else {
                const userId = this.state.user.id.toString();
                const userRef = this.db.collection('users').doc(userId);
                const userDoc = await userRef.get();
                
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    this.state = { ...this.state, ...userData };
                } else {
                    await userRef.set(this.state);
                }
            }
            
            this.updateUI();
            
        } catch (error) {
            console.error('Error loading user data:', error);
            this.loadFromLocalStorage();
        }
    }

    async saveUserData() {
        try {
            if (this.useLocalStorage) {
                this.saveToLocalStorage();
            } else {
                const userId = this.state.user.id.toString();
                const userRef = this.db.collection('users').doc(userId);
                await userRef.set(this.state, { merge: true });
            }
        } catch (error) {
            console.error('Error saving user data:', error);
            this.saveToLocalStorage();
        }
    }

    loadFromLocalStorage() {
        const savedData = localStorage.getItem('alien_musk_data');
        if (savedData) {
            this.state = JSON.parse(savedData);
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('alien_musk_data', JSON.stringify(this.state));
    }

    /* ===========================================
       UI UPDATE METHODS
       =========================================== */

    updateHeader() {
        const totalValue = (this.state.balances.AMSK * APP_CONFIG.AMSK_PRICE) + this.state.balances.USDT;
        this.headerBalance.textContent = `$${this.formatNumber(totalValue, 2)}`;
    }

    updateHomeTab() {
        // Welcome message
        this.welcomeText.textContent = `Welcome, ${this.state.user.name}!`;
        this.userId.textContent = this.state.user.id.substring(0, 8);
        
        // Balance
        const totalAMSK = this.state.balances.AMSK;
        this.totalAmsk.textContent = this.formatNumber(totalAMSK);
        this.usdEquivalent.textContent = this.formatNumber(totalAMSK * APP_CONFIG.AMSK_PRICE, 2);
        
        // Mining info
        const miningLevel = APP_CONFIG.MINING_LEVELS[this.state.mining.level];
        this.currentHashrate.textContent = miningLevel.hashrate;
        this.nextReward.textContent = `${this.formatNumber(miningLevel.reward)} AMSK`;
        
        // Update mining button
        if (this.state.mining.isActive && Date.now() >= this.state.mining.nextReward) {
            this.startMiningBtn.innerHTML = '<i class="fas fa-gift"></i><span>Claim Reward</span>';
        } else if (this.state.mining.isActive) {
            this.startMiningBtn.innerHTML = '<i class="fas fa-clock"></i><span>Mining...</span>';
            this.startMiningBtn.disabled = true;
        } else {
            this.startMiningBtn.innerHTML = '<i class="fas fa-play"></i><span>Start Mining</span>';
            this.startMiningBtn.disabled = false;
        }
        
        // Stats
        this.minedToday.textContent = this.formatNumber(this.state.mining.minedToday);
        this.totalMined.textContent = this.formatNumber(this.state.mining.totalMined);
        this.stakingEarned.textContent = this.formatNumber(this.state.staking.totalEarned);
        this.miningLevel.textContent = this.state.mining.level;
        
        // Referral info
        this.refCount.textContent = this.state.referral.referrals;
        this.totalRefs.textContent = this.state.referral.referrals;
        this.refEarned.textContent = `${this.formatNumber(this.state.referral.earned)} AMSK`;
        this.refCode.textContent = this.state.referral.code;
        
        // Update progress
        const progress = (this.state.referral.referrals / 10) * 100;
        this.progressText.textContent = `${Math.min(progress, 100)}%`;
        this.progressFill.style.width = `${Math.min(progress, 100)}%`;
        
        // Update mining levels
        this.updateMiningLevels();
    }

    updateStakingTab() {
        // Update stakes list
        this.updateStakesList();
        
        // Update calculator
        this.updateCalculator();
    }

    updateWalletTab() {
        const totalAMSK = this.state.balances.AMSK;
        const usdtBalance = this.state.balances.USDT;
        
        // Total balance
        this.walletTotalAmsk.textContent = this.formatNumber(totalAMSK);
        this.walletTotalUsd.textContent = this.formatNumber(totalAMSK * APP_CONFIG.AMSK_PRICE, 2);
        
        // AMSK balance
        this.walletAmsk.textContent = this.formatNumber(totalAMSK);
        this.walletAmskValue.textContent = this.formatNumber(totalAMSK * APP_CONFIG.AMSK_PRICE, 2);
        
        // USDT balance
        this.walletUsdt.textContent = this.formatNumber(usdtBalance, 2);
        this.walletUsdtValue.textContent = this.formatNumber(usdtBalance, 2);
        
        // Update withdraw balance
        this.withdrawBalance.textContent = this.formatNumber(usdtBalance, 2);
    }

    updateMiningLevels() {
        document.querySelectorAll('.level-card').forEach(card => {
            const level = parseInt(card.dataset.level);
            const levelData = APP_CONFIG.MINING_LEVELS[level];
            const isCurrentLevel = level === this.state.mining.level;
            const canAfford = this.state.balances.USDT >= levelData.cost;
            
            const btn = card.querySelector('.upgrade-btn');
            if (isCurrentLevel) {
                btn.textContent = 'Active';
                btn.disabled = true;
                btn.classList.add('active-btn');
                card.classList.add('active');
            } else if (level < this.state.mining.level) {
                btn.textContent = 'Upgraded';
                btn.disabled = true;
                btn.classList.add('active-btn');
            } else {
                btn.textContent = canAfford ? 'Upgrade' : `Need ${levelData.cost} USDT`;
                btn.disabled = !canAfford;
                btn.classList.remove('active-btn');
                card.classList.remove('active');
            }
        });
    }

    updateStakesList() {
        const stakesList = this.activeStakesList;
        stakesList.innerHTML = '';
        
        if (this.state.staking.activeStakes.length === 0) {
            stakesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No active stakes</p>
                </div>
            `;
            return;
        }
        
        this.state.staking.activeStakes.forEach((stake, index) => {
            const plan = APP_CONFIG.STAKING_PLANS[stake.planId];
            const stakeElement = document.createElement('div');
            stakeElement.className = 'stake-item';
            stakeElement.innerHTML = `
                <div class="stake-item-header">
                    <div class="stake-plan">${plan.name} Plan</div>
                    <div class="stake-amount">${stake.amount} USDT</div>
                </div>
                <div class="stake-item-details">
                    <div class="detail">
                        <span class="label">Duration:</span>
                        <span class="value">${plan.duration} Days</span>
                    </div>
                    <div class="detail">
                        <span class="label">Ends:</span>
                        <span class="value">${new Date(stake.endTime).toLocaleDateString()}</span>
                    </div>
                    <div class="detail">
                        <span class="label">Daily Reward:</span>
                        <span class="value">${plan.dailyReward} AMSK</span>
                    </div>
                </div>
                <button class="claim-btn" data-index="${index}">Claim</button>
            `;
            
            stakesList.appendChild(stakeElement);
        });
        
        // Add claim button listeners
        stakesList.querySelectorAll('.claim-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.claimStakingReward(index);
            });
        });
    }

    updateCalculator() {
        const amount = parseFloat(this.calcAmount.value) || 10;
        const duration = parseInt(this.calcDuration.value) || 7;
        
        // Find appropriate APR
        let apr = 40;
        let dailyReward = 40;
        
        if (amount >= 100) {
            apr = 60;
            dailyReward = 600;
        } else if (amount >= 50) {
            apr = 50;
            dailyReward = 250;
        }
        
        const totalReward = dailyReward * duration;
        
        this.calcDaily.textContent = `${this.formatNumber(dailyReward)} AMSK`;
        this.calcTotal.textContent = `${this.formatNumber(totalReward)} AMSK`;
        this.calcApr.textContent = `${apr}%`;
    }

    /* ===========================================
       MINING SYSTEM
       =========================================== */

    handleMining() {
        if (!this.state.mining.isActive) {
            this.startMining();
            return;
        }
        
        if (Date.now() >= this.state.mining.nextReward) {
            this.claimMiningReward();
        } else {
            this.showNotification('Mining in progress... ⏳', 'info');
        }
    }

    startMining() {
        this.state.mining.isActive = true;
        this.state.mining.nextReward = Date.now() + (60 * 60 * 1000); // 1 hour
        this.state.mining.lastClaim = Date.now();
        
        this.updateHomeTab();
        this.saveUserData();
        
        this.showNotification('Mining started! ⛏️', 'success');
    }

    claimMiningReward() {
        if (!this.state.mining.isActive || Date.now() < this.state.mining.nextReward) {
            return;
        }
        
        const miningLevel = APP_CONFIG.MINING_LEVELS[this.state.mining.level];
        const reward = miningLevel.reward;
        
        // Add reward
        this.state.balances.AMSK += reward;
        this.state.mining.minedToday += reward;
        this.state.mining.totalMined += reward;
        
        // Reset timer
        this.state.mining.nextReward = Date.now() + (60 * 60 * 1000);
        this.state.mining.lastClaim = Date.now();
        
        this.updateUI();
        this.saveUserData();
        
        this.showNotification(`💰 Claimed ${this.formatNumber(reward)} AMSK!`, 'success');
    }

    upgradeMining(level) {
        level = parseInt(level);
        const levelData = APP_CONFIG.MINING_LEVELS[level];
        
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
        
        this.updateUI();
        this.saveUserData();
        
        this.showNotification(`⚡ Upgraded to ${levelData.name} level!`, 'success');
    }

    /* ===========================================
       STAKING SYSTEM
       =========================================== */

    openStakeModal(planId) {
        const modal = document.getElementById('stake-modal');
        const plan = APP_CONFIG.STAKING_PLANS[planId];
        
        if (!plan) return;
        
        // Update modal content
        document.getElementById('stake-plan-display').innerHTML = `
            <div class="selected-plan">
                <div class="plan-header">
                    <div class="plan-icon ${plan.color}">
                        <i class="fas fa-gem"></i>
                    </div>
                    <div class="plan-info">
                        <h4>${plan.name} Plan</h4>
                        <div class="plan-amount">${plan.amount} USDT Minimum</div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('available-usdt').textContent = this.formatNumber(this.state.balances.USDT, 2);
        document.getElementById('stake-duration').textContent = `${plan.duration} Days`;
        document.getElementById('stake-apr').textContent = `${plan.apr}%`;
        document.getElementById('stake-daily').textContent = `${plan.dailyReward} AMSK`;
        document.getElementById('stake-total').textContent = `${plan.dailyReward * plan.duration} AMSK`;
        
        // Set amount
        const stakeAmountInput = document.getElementById('stake-amount');
        stakeAmountInput.value = plan.amount;
        stakeAmountInput.min = plan.amount;
        
        // Store current plan
        this.currentStakePlan = planId;
        
        // Show modal
        this.openModal('stake-modal');
    }

    updateStakePreview() {
        const plan = APP_CONFIG.STAKING_PLANS[this.currentStakePlan];
        const amount = parseFloat(document.getElementById('stake-amount').value) || plan.amount;
        
        const dailyReward = (amount / plan.amount) * plan.dailyReward;
        const totalReward = dailyReward * plan.duration;
        
        document.getElementById('stake-daily').textContent = `${this.formatNumber(dailyReward)} AMSK`;
        document.getElementById('stake-total').textContent = `${this.formatNumber(totalReward)} AMSK`;
    }

    confirmStaking() {
        const plan = APP_CONFIG.STAKING_PLANS[this.currentStakePlan];
        const amount = parseFloat(document.getElementById('stake-amount').value);
        
        if (amount < plan.amount) {
            this.showNotification(`Minimum stake is ${plan.amount} USDT`, 'error');
            return;
        }
        
        if (this.state.balances.USDT < amount) {
            this.showNotification('Insufficient USDT balance', 'error');
            return;
        }
        
        // Create stake
        const stake = {
            planId: this.currentStakePlan,
            amount: amount,
            startTime: Date.now(),
            endTime: Date.now() + (plan.duration * 24 * 60 * 60 * 1000),
            claimed: 0
        };
        
        // Deduct USDT
        this.state.balances.USDT -= amount;
        
        // Add to active stakes
        this.state.staking.activeStakes.push(stake);
        
        this.closeAllModals();
        this.updateUI();
        this.saveUserData();
        
        this.showNotification(`✅ Staked ${amount} USDT successfully!`, 'success');
    }

    claimStakingReward(index) {
        const stake = this.state.staking.activeStakes[index];
        if (!stake) return;
        
        const plan = APP_CONFIG.STAKING_PLANS[stake.planId];
        const daysPassed = Math.floor((Date.now() - stake.startTime) / (1000 * 60 * 60 * 24));
        const reward = (daysPassed * plan.dailyReward) - stake.claimed;
        
        if (reward <= 0) {
            this.showNotification('No rewards available yet', 'info');
            return;
        }
        
        // Add reward
        this.state.balances.AMSK += reward;
        this.state.staking.totalEarned += reward;
        stake.claimed += reward;
        
        // If stake ended, remove it
        if (Date.now() >= stake.endTime) {
            // Return staked amount
            this.state.balances.USDT += stake.amount;
            this.state.staking.activeStakes.splice(index, 1);
        }
        
        this.updateUI();
        this.saveUserData();
        
        this.showNotification(`💰 Claimed ${this.formatNumber(reward)} AMSK from staking!`, 'success');
    }

    /* ===========================================
       REFERRAL SYSTEM
       =========================================== */

    copyReferralCode() {
        this.copyToClipboard(this.state.referral.code);
        this.showNotification('Referral code copied! 📋', 'success');
    }

    shareReferralLink() {
        const link = `https://t.me/alien_musk_bot?start=ref_${this.state.referral.code}`;
        const message = `🚀 Join Alien Musk and earn 2,500 AMSK per hour!\n\nUse my referral code: ${this.state.referral.code}\n\n${link}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Alien Musk - Quantum Mining Platform',
                text: message,
                url: link
            }).catch(() => {
                this.copyToClipboard(message);
                this.showNotification('Link copied! Share with friends.', 'info');
            });
        } else {
            this.copyToClipboard(message);
            this.showNotification('Link copied! Share with friends.', 'info');
        }
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
                // Show transaction history
                this.showNotification('Transaction history coming soon!', 'info');
                break;
        }
    }

    handleAssetAction(action, currency) {
        switch (action) {
            case 'deposit':
                this.openDepositModal();
                break;
            case 'withdraw':
                this.openWithdrawModal();
                break;
            case 'swap':
                this.openSwapModal();
                break;
            case 'send':
                this.showNotification('Send feature coming soon!', 'info');
                break;
            case 'receive':
                this.showNotification('Your address: ' + this.usdtAddress.textContent, 'info');
                break;
        }
    }

    openDepositModal() {
        this.openModal('deposit-modal');
    }

    openWithdrawModal() {
        this.openModal('withdraw-modal');
    }

    openSwapModal() {
        this.openModal('swap-modal');
    }

    submitDeposit() {
        const amount = parseFloat(document.getElementById('deposit-amount-input').value);
        const txId = document.getElementById('tx-id-input').value;
        
        if (!amount || amount < APP_CONFIG.MIN_DEPOSIT) {
            this.showNotification(`Minimum deposit is ${APP_CONFIG.MIN_DEPOSIT} USDT`, 'error');
            return;
        }
        
        if (!txId) {
            this.showNotification('Please enter Transaction ID', 'error');
            return;
        }
        
        this.showNotification('Deposit request submitted! ⏳', 'success');
        this.closeAllModals();
    }

    submitWithdrawal() {
        const amount = parseFloat(document.getElementById('withdraw-amount').value);
        const address = document.getElementById('withdraw-address').value;
        
        if (!amount || amount < APP_CONFIG.MIN_WITHDRAWAL) {
            this.showNotification(`Minimum withdrawal is ${APP_CONFIG.MIN_WITHDRAWAL} USDT`, 'error');
            return;
        }
        
        if (!address) {
            this.showNotification('Please enter wallet address', 'error');
            return;
        }
        
        if (this.state.balances.USDT < amount) {
            this.showNotification('Insufficient USDT balance', 'error');
            return;
        }
        
        this.showNotification('Withdrawal request submitted! ⏳', 'success');
        this.closeAllModals();
    }

    updateSwap() {
        const amount = parseFloat(this.swapFromAmount.value) || 0;
        const fromCurrency = document.getElementById('swap-from-currency').value;
        const toCurrency = document.getElementById('swap-to-currency').value;
        
        let result = 0;
        if (fromCurrency === 'AMSK' && toCurrency === 'USDT') {
            result = amount * APP_CONFIG.SWAP_RATES.AMSK_TO_USDT;
        } else if (fromCurrency === 'USDT' && toCurrency === 'AMSK') {
            result = amount * APP_CONFIG.SWAP_RATES.USDT_TO_AMSK;
        }
        
        this.swapToAmount.textContent = this.formatNumber(result, 2);
        
        // Validate
        const isValid = amount > 0 && 
                       ((fromCurrency === 'AMSK' && amount >= APP_CONFIG.MIN_SWAP_AMSK) || 
                        (fromCurrency === 'USDT' && amount >= 50));
        
        this.submitSwap.disabled = !isValid;
    }

    executeSwap() {
        const amount = parseFloat(this.swapFromAmount.value);
        const fromCurrency = document.getElementById('swap-from-currency').value;
        const toCurrency = document.getElementById('swap-to-currency').value;
        
        let result = 0;
        if (fromCurrency === 'AMSK' && toCurrency === 'USDT') {
            if (amount < APP_CONFIG.MIN_SWAP_AMSK) {
                this.showNotification(`Minimum swap is ${APP_CONFIG.MIN_SWAP_AMSK} AMSK`, 'error');
                return;
            }
            if (this.state.balances.AMSK < amount) {
                this.showNotification('Insufficient AMSK balance', 'error');
                return;
            }
            result = amount * APP_CONFIG.SWAP_RATES.AMSK_TO_USDT;
            this.state.balances.AMSK -= amount;
            this.state.balances.USDT += result;
        } else if (fromCurrency === 'USDT' && toCurrency === 'AMSK') {
            if (amount < 50) {
                this.showNotification('Minimum swap is 50 USDT', 'error');
                return;
            }
            if (this.state.balances.USDT < amount) {
                this.showNotification('Insufficient USDT balance', 'error');
                return;
            }
            result = amount * APP_CONFIG.SWAP_RATES.USDT_TO_AMSK;
            this.state.balances.USDT -= amount;
            this.state.balances.AMSK += result;
        }
        
        this.closeAllModals();
        this.updateUI();
        this.saveUserData();
        
        this.showNotification(`🔄 Swapped ${amount} ${fromCurrency} to ${this.formatNumber(result)} ${toCurrency}!`, 'success');
    }

    /* ===========================================
       MODAL MANAGEMENT
       =========================================== */

    openModal(modalId) {
        this.modalOverlay.classList.add('active');
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeAllModals() {
        this.modalOverlay.classList.remove('active');
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    /* ===========================================
       UTILITY METHODS
       =========================================== */

    formatNumber(num, decimals = 0) {
        if (typeof num !== 'number' || isNaN(num)) return '0';
        
        if (decimals > 0) {
            return num.toLocaleString('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
        }
        
        return num.toLocaleString('en-US');
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => this.showNotification('📋 Copied to clipboard!', 'success'))
            .catch(() => this.showNotification('Failed to copy', 'error'));
    }

    showNotification(message, type = 'info') {
        const notificationCenter = document.getElementById('notification-center');
        
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
            <div class="notification-content">
                ${message}
            </div>
        `;
        
        notificationCenter.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    showLoading() {
        this.loadingSpinner.classList.add('active');
    }

    hideLoading() {
        this.loadingSpinner.classList.remove('active');
    }

    showAdminPanel() {
        const adminPanel = document.getElementById('admin-panel');
        adminPanel.innerHTML = `
            <div class="admin-content">
                <h2><i class="fas fa-user-shield"></i> Admin Panel</h2>
                <p>Total Users: 1</p>
                <p>Total AMSK in Circulation: ${this.formatNumber(this.state.balances.AMSK)}</p>
                <button onclick="alienMuskApp.closeAdminPanel()" class="action-btn primary-btn">Close</button>
            </div>
        `;
        adminPanel.classList.add('active');
    }

    closeAdminPanel() {
        document.getElementById('admin-panel').classList.remove('active');
    }

    updateUI() {
        this.updateHeader();
        this.updateHomeTab();
        this.updateStakingTab();
        this.updateWalletTab();
    }

    /* ===========================================
       TIMERS
       =========================================== */

    startTimers() {
        // Update mining timer every second
        setInterval(() => {
            this.updateMiningTimer();
        }, 1000);
        
        // Auto-save every 30 seconds
        setInterval(() => {
            this.saveUserData();
        }, 30000);
        
        // Check for mining rewards
        setInterval(() => {
            if (this.state.mining.isActive && Date.now() >= this.state.mining.nextReward) {
                this.updateHomeTab();
            }
        }, 1000);
    }

    updateMiningTimer() {
        if (!this.state.mining.isActive) {
            this.miningTimer.textContent = '00:00:00';
            return;
        }
        
        const now = Date.now();
        const timeLeft = this.state.mining.nextReward - now;
        
        if (timeLeft <= 0) {
            this.miningTimer.textContent = 'READY!';
            this.miningTimer.style.color = '#00D4AA';
            return;
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        this.miningTimer.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.miningTimer.style.color = '#FFFFFF';
    }
}

/* ===========================================
   APP INITIALIZATION
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {
    window.alienMuskApp = new AlienMuskApp();
    window.AlienMusk = window.alienMuskApp;
});

console.log('👽 Alien Musk Platform loaded successfully!');

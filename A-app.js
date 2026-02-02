/* ===========================================
   ALIEN MUSK - Ultimate Crypto Platform
   Main Application JavaScript
   Version: 1.0.0
   =========================================== */

// Firebase Configuration
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyC4R4p7v6QmX9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q",
    authDomain: "alien-musk-app.firebaseapp.com",
    projectId: "alien-musk-app",
    storageBucket: "alien-musk.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// App Constants
const APP_CONFIG = {
    // Token Prices
    AMSK_PRICE: 0.0002,
    
    // Mining Configuration
    MINING_LEVELS: {
        1: { name: "Beginner", cost: 0, reward: 25000, hashrate: 20, duration: 6 },
        2: { name: "Advanced", cost: 5, reward: 50000, hashrate: 50, duration: 6 },
        3: { name: "Pro", cost: 20, reward: 100000, hashrate: 100, duration: 6 },
        4: { name: "Expert", cost: 100, reward: 250000, hashrate: 250, duration: 6 },
        5: { name: "Master", cost: 500, reward: 500000, hashrate: 500, duration: 6 },
        6: { name: "Alien", cost: 1000, reward: 1000000, hashrate: 1000, duration: 6 }
    },
    
    // Staking Plans
    STAKING_PLANS: {
        1: { name: "Silver", amount: 10, duration: 7, apr: 40, dailyReward: 40 },
        2: { name: "Gold", amount: 50, duration: 15, apr: 50, dailyReward: 250 },
        3: { name: "Diamond", amount: 100, duration: 30, apr: 60, dailyReward: 600 },
        4: { name: "Platinum", amount: 500, duration: 60, apr: 100, dailyReward: 5000 },
        5: { name: "Titanium", amount: 1000, duration: 75, apr: 125, dailyReward: 12500 },
        6: { name: "Cosmic", amount: 2500, duration: 90, apr: 150, dailyReward: 37500 },
        7: { name: "Galactic", amount: 5000, duration: 90, apr: 200, dailyReward: 100000 }
    },
    
    // Referral Rewards
    REFERRAL_REWARDS: {
        1: { reward: 20000 },
        5: { reward: 100000, total: 100000 },
        10: { reward: 250000, total: 250000 },
        25: { reward: 750000, total: 750000 },
        50: { reward: 2000000, total: 2000000 },
        100: { reward: 5000000, total: 5000000 }
    },
    
    // Swap Rates
    SWAP_RATES: {
        AMSK_TO_USDT: 0.0002,
        BNB_TO_AMSK: 300000, // 1 BNB = 300,000 AMSK
        TON_TO_AMSK: 2000    // 1 TON = 2,000 AMSK
    },
    
    // Minimum Limits
    MIN_DEPOSIT: {
        USDT: 10,
        BNB: 0.02,
        TON: 10
    },
    MIN_WITHDRAWAL: 100,
    MIN_SWAP_AMSK: 250000,
    WITHDRAWAL_FEE: 0.0005,
    
    // Deposit Addresses (Static)
    DEPOSIT_ADDRESSES: {
        USDT: "0x6870fA28376C86974f1Dc8F469d58D10d2EA4F58",
        BNB: "0x6870fA28376C86974f1Dc8F469d58D10d2EA4F58",
        TON: "UQCJhJZ0VDm3ei6sljWtV5JO3dAGwca8mPGJ9yVPBtPJlier"
    },
    
    // Admin Settings
    ADMIN_SECRET: "ALIENMUSK2024",
    ADMIN_USER_ID: "1653918641"
};

/* ===========================================
   MAIN APPLICATION CLASS
   =========================================== */

class AlienMuskApp {
    constructor() {
        this.init();
    }
    
    async init() {
        console.log('👽 Alien Musk App Initializing...');
        
        try {
            // Initialize Telegram WebApp
            await this.initTelegramWebApp();
            
            // Initialize Firebase
            await this.initFirebase();
            
            // Initialize State
            this.state = this.getInitialState();
            
            // Cache DOM Elements
            this.elements = this.cacheDOM();
            
            // Initialize UI
            await this.initUI();
            
            // Setup Event Listeners
            this.setupEventListeners();
            
            // Start Timers
            this.startTimers();
            
            // Show Welcome
            this.showNotification('Welcome to Alien Musk Platform! 👽', 'success');
            
            console.log('✅ App initialized successfully');
            
        } catch (error) {
            console.error('❌ App initialization failed:', error);
            this.showNotification('Failed to initialize app. Please refresh.', 'error');
        }
    }
    
    /* ===========================================
       INITIALIZATION METHODS
       =========================================== */
    
    initTelegramWebApp() {
        return new Promise((resolve) => {
            if (window.Telegram && window.Telegram.WebApp) {
                this.tg = window.Telegram.WebApp;
                this.tg.expand();
                this.tg.enableClosingConfirmation();
                this.tg.ready();
                resolve();
            } else {
                console.warn('Telegram WebApp not found, using mock data');
                this.tg = {
                    initDataUnsafe: {
                        user: {
                            id: APP_CONFIG.ADMIN_USER_ID,
                            username: 'alien_musk_user',
                            first_name: 'Alien',
                            last_name: 'Musk',
                            photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alien'
                        }
                    }
                };
                resolve();
            }
        });
    }
    
    async initFirebase() {
        return new Promise((resolve) => {
            // Mock Firebase for demo (replace with real Firebase)
            console.log('Firebase initialized (mock mode)');
            this.db = {
                collection: () => ({
                    doc: () => ({
                        get: () => Promise.resolve({ exists: false, data: () => null }),
                        set: () => Promise.resolve(),
                        update: () => Promise.resolve()
                    })
                })
            };
            this.useLocalStorage = true;
            resolve();
        });
    }
    
    getInitialState() {
        const user = this.tg.initDataUnsafe.user || {};
        
        return {
            // User Info
            user: {
                id: user.id || Date.now().toString(),
                username: user.username || 'alien_user',
                firstName: user.first_name || 'Alien',
                lastName: user.last_name || 'User',
                photoUrl: user.photo_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=alien'
            },
            
            // Balances
            balances: {
                AMSK: 100000,
                USDT: 100,
                BNB: 0.5,
                TON: 50
            },
            
            // Mining
            mining: {
                level: 1,
                isActive: true,
                lastReward: Date.now(),
                nextReward: Date.now() + (6 * 60 * 60 * 1000),
                totalMined: 0,
                minedToday: 0
            },
            
            // Staking
            staking: {
                activeStakes: [],
                totalEarned: 0
            },
            
            // Referral
            referral: {
                code: this.generateReferralCode(),
                referrals: [],
                totalCount: 0,
                totalEarned: 0,
                claimedRewards: []
            },
            
            // Transactions
            transactions: {
                deposits: [],
                withdrawals: [],
                swaps: []
            },
            
            // Admin
            admin: {
                isLoggedIn: false,
                pendingDeposits: [],
                pendingWithdrawals: []
            }
        };
    }
    
    cacheDOM() {
        return {
            // Header Elements
            headerBalance: document.getElementById('header-balance'),
            notificationCount: document.getElementById('notification-count'),
            userAvatar: document.getElementById('user-avatar'),
            
            // Navigation
            navBtns: document.querySelectorAll('.nav-btn'),
            
            // Home Tab
            welcomeText: document.getElementById('welcome-text'),
            userIdDisplay: document.getElementById('user-id-display'),
            totalAmsk: document.getElementById('total-amsk'),
            totalUsd: document.getElementById('total-usd'),
            
            // Mining Elements
            currentHashrate: document.getElementById('current-hashrate'),
            miningTimer: document.getElementById('mining-timer'),
            nextReward: document.getElementById('next-reward'),
            startMiningBtn: document.getElementById('start-mining'),
            
            // Mining Levels
            levelCards: document.querySelectorAll('.level-card'),
            upgradeBtns: document.querySelectorAll('.upgrade-btn'),
            
            // Stats
            minedToday: document.getElementById('mined-today'),
            totalMined: document.getElementById('total-mined'),
            stakingEarned: document.getElementById('staking-earned'),
            miningLevel: document.getElementById('mining-level'),
            
            // Referral Elements
            refCount: document.getElementById('ref-count'),
            totalRefs: document.getElementById('total-refs'),
            refEarned: document.getElementById('ref-earned'),
            nextGoal: document.getElementById('next-goal'),
            progressText: document.getElementById('progress-text'),
            progressFill: document.getElementById('progress-fill'),
            goalReward: document.getElementById('goal-reward'),
            refCode: document.getElementById('ref-code'),
            copyRefCode: document.getElementById('copy-ref-code'),
            shareRef: document.getElementById('share-ref'),
            
            // Staking Elements
            activeStakesCount: document.getElementById('active-stakes-count'),
            stakesList: document.getElementById('stakes-list'),
            stakeBtns: document.querySelectorAll('.stake-btn'),
            morePlansToggle: document.getElementById('more-plans-toggle'),
            morePlans: document.getElementById('more-plans'),
            
            // Calculator
            calcAmount: document.getElementById('calc-amount'),
            calcDuration: document.getElementById('calc-duration'),
            calcDaily: document.getElementById('calc-daily'),
            calcTotal: document.getElementById('calc-total'),
            calcApr: document.getElementById('calc-apr'),
            
            // Wallet Elements
            walletTotalAmsk: document.getElementById('wallet-total-amsk'),
            walletTotalUsd: document.getElementById('wallet-total-usd'),
            
            // Quick Actions
            quickBtns: document.querySelectorAll('.quick-btn'),
            
            // Asset Balances
            walletAmsk: document.getElementById('wallet-amsk'),
            walletAmskValue: document.getElementById('wallet-amsk-value'),
            walletUsdt: document.getElementById('wallet-usdt'),
            walletUsdtValue: document.getElementById('wallet-usdt-value'),
            walletBnb: document.getElementById('wallet-bnb'),
            walletBnbValue: document.getElementById('wallet-bnb-value'),
            walletTon: document.getElementById('wallet-ton'),
            walletTonValue: document.getElementById('wallet-ton-value'),
            
            // Addresses
            usdtAddress: document.getElementById('usdt-address'),
            bnbAddress: document.getElementById('bnb-address'),
            tonAddress: document.getElementById('ton-address'),
            copyBtns: document.querySelectorAll('.copy-btn'),
            
            // Asset Actions
            assetActionBtns: document.querySelectorAll('.asset-action-btn'),
            
            // Transaction History
            filterBtns: document.querySelectorAll('.filter-btn'),
            transactionHistory: document.getElementById('transaction-history'),
            
            // Modals
            modalOverlay: document.getElementById('modal-overlay'),
            depositModal: document.getElementById('deposit-modal'),
            withdrawModal: document.getElementById('withdraw-modal'),
            swapModal: document.getElementById('swap-modal'),
            stakeModal: document.getElementById('stake-modal'),
            closeModalBtns: document.querySelectorAll('.close-modal'),
            
            // Deposit Modal Elements
            currencyOptions: document.querySelectorAll('.currency-option'),
            depositAddress: document.getElementById('deposit-address'),
            depositAmount: document.getElementById('deposit-amount'),
            minDepositAmount: document.getElementById('min-deposit-amount'),
            depositCurrency: document.getElementById('deposit-currency'),
            txId: document.getElementById('tx-id'),
            submitDeposit: document.getElementById('submit-deposit'),
            copyAddressBtn: document.querySelector('.copy-address-btn'),
            
            // Withdraw Modal Elements
            withdrawBalance: document.getElementById('withdraw-balance'),
            withdrawAddress: document.getElementById('withdraw-address'),
            withdrawAmount: document.getElementById('withdraw-amount'),
            bnbFeeBalance: document.getElementById('bnb-fee-balance'),
            feeWarning: document.getElementById('fee-warning'),
            submitWithdraw: document.getElementById('submit-withdraw'),
            
            // Swap Modal Elements
            swapFromCurrency: document.getElementById('swap-from-currency'),
            swapFromAmount: document.getElementById('swap-from-amount'),
            swapFromBalance: document.getElementById('swap-from-balance'),
            swapToCurrency: document.getElementById('swap-to-currency'),
            swapToAmount: document.getElementById('swap-to-amount'),
            swapToBalance: document.getElementById('swap-to-balance'),
            swapRate: document.getElementById('swap-rate'),
            submitSwap: document.getElementById('submit-swap'),
            
            // Stake Modal Elements
            stakePlanDisplay: document.getElementById('stake-plan-display'),
            stakeAmount: document.getElementById('stake-amount'),
            availableUsdt: document.getElementById('available-usdt'),
            stakeDuration: document.getElementById('stake-duration'),
            stakeApr: document.getElementById('stake-apr'),
            stakeDaily: document.getElementById('stake-daily'),
            stakeTotal: document.getElementById('stake-total'),
            confirmStake: document.getElementById('confirm-stake'),
            
            // Admin Panel
            adminPanel: document.getElementById('admin-panel'),
            
            // Loading Spinner
            loadingSpinner: document.getElementById('loading-spinner')
        };
    }
    
    async initUI() {
        // Set user info
        this.elements.welcomeText.textContent = `Welcome, ${this.state.user.firstName}!`;
        this.elements.userIdDisplay.textContent = this.state.user.id;
        this.elements.userAvatar.src = this.state.user.photoUrl;
        
        // Update all UI
        this.updateHeader();
        this.updateHomeTab();
        this.updateStakingTab();
        this.updateWalletTab();
        
        // Show initial tab
        this.switchTab('home');
    }
    
    /* ===========================================
       UI UPDATE METHODS
       =========================================== */
    
    updateHeader() {
        const totalBalance = this.calculateTotalBalance();
        this.elements.headerBalance.textContent = `$${this.formatNumber(totalBalance * APP_CONFIG.AMSK_PRICE, 2)}`;
        
        // Update notification count (simulated)
        const pendingCount = this.state.admin.pendingDeposits.length + 
                           this.state.admin.pendingWithdrawals.length;
        this.elements.notificationCount.textContent = pendingCount;
    }
    
    updateHomeTab() {
        // Update balance
        const totalAMSK = this.calculateTotalAMSK();
        this.elements.totalAmsk.textContent = this.formatNumber(totalAMSK);
        this.elements.totalUsd.textContent = this.formatNumber(totalAMSK * APP_CONFIG.AMSK_PRICE, 2);
        
        // Update mining info
        const miningLevel = APP_CONFIG.MINING_LEVELS[this.state.mining.level];
        this.elements.currentHashrate.textContent = miningLevel.hashrate;
        this.elements.nextReward.textContent = `${this.formatNumber(miningLevel.reward)} AMSK`;
        
        // Update mining level cards
        this.updateMiningLevels();
        
        // Update stats
        this.elements.minedToday.textContent = this.formatNumber(this.state.mining.minedToday);
        this.elements.totalMined.textContent = this.formatNumber(this.state.mining.totalMined);
        this.elements.stakingEarned.textContent = this.formatNumber(this.state.staking.totalEarned);
        this.elements.miningLevel.textContent = this.state.mining.level;
        
        // Update referral info
        this.updateReferralInfo();
    }
    
    updateMiningLevels() {
        this.elements.levelCards.forEach(card => {
            const level = parseInt(card.dataset.level);
            const levelData = APP_CONFIG.MINING_LEVELS[level];
            const isCurrentLevel = level === this.state.mining.level;
            const canAfford = this.state.balances.USDT >= levelData.cost;
            
            const btn = card.querySelector('.upgrade-btn');
            if (isCurrentLevel) {
                btn.textContent = 'Active';
                btn.disabled = true;
                card.classList.add('active');
            } else if (level < this.state.mining.level) {
                btn.textContent = 'Upgraded';
                btn.disabled = true;
            } else {
                btn.textContent = canAfford ? 'Upgrade' : 'Insufficient USDT';
                btn.disabled = !canAfford;
                card.classList.remove('active');
            }
        });
    }
    
    updateReferralInfo() {
        const refCount = this.state.referral.totalCount;
        this.elements.refCount.textContent = refCount;
        this.elements.totalRefs.textContent = refCount;
        this.elements.refEarned.textContent = `${this.formatNumber(this.state.referral.totalEarned)} AMSK`;
        this.elements.refCode.textContent = this.state.referral.code;
        
        // Find next goal
        let nextGoal = 100;
        let goalReward = 5000000;
        
        for (const [count, data] of Object.entries(APP_CONFIG.REFERRAL_REWARDS).sort((a, b) => a[0] - b[0])) {
            if (refCount < parseInt(count)) {
                nextGoal = parseInt(count);
                goalReward = data.total || data.reward;
                break;
            }
        }
        
        // Update progress
        const progress = Math.min((refCount / nextGoal) * 100, 100);
        this.elements.nextGoal.textContent = `${nextGoal} Referrals`;
        this.elements.progressText.textContent = `${Math.round(progress)}%`;
        this.elements.progressFill.style.width = `${progress}%`;
        this.elements.goalReward.textContent = `${this.formatNumber(goalReward)} AMSK`;
    }
    
    updateStakingTab() {
        const activeStakes = this.state.staking.activeStakes.length;
        this.elements.activeStakesCount.textContent = activeStakes;
        
        // Update stakes list
        this.updateStakesList();
        
        // Update calculator
        this.updateCalculator();
    }
    
    updateStakesList() {
        const stakesList = this.elements.stakesList;
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
            const daysLeft = Math.ceil((stake.endTime - Date.now()) / (1000 * 60 * 60 * 24));
            const earned = Math.floor((Date.now() - stake.startTime) / (1000 * 60 * 60 * 24)) * plan.dailyReward;
            
            const stakeElement = document.createElement('div');
            stakeElement.className = 'stake-item';
            stakeElement.innerHTML = `
                <div class="stake-item-header">
                    <div class="stake-plan">${plan.name} Plan</div>
                    <div class="stake-amount">${plan.amount} USDT</div>
                </div>
                <div class="stake-item-details">
                    <div class="detail">
                        <span class="label">Duration:</span>
                        <span class="value">${plan.duration} Days</span>
                    </div>
                    <div class="detail">
                        <span class="label">Days Left:</span>
                        <span class="value">${daysLeft}</span>
                    </div>
                    <div class="detail">
                        <span class="label">Earned:</span>
                        <span class="value">${this.formatNumber(earned)} AMSK</span>
                    </div>
                    <div class="detail">
                        <span class="label">APR:</span>
                        <span class="value">${plan.apr}%</span>
                    </div>
                </div>
                <div class="stake-item-actions">
                    <button class="claim-btn" data-index="${index}">
                        <i class="fas fa-gift"></i> Claim Reward
                    </button>
                </div>
            `;
            
            stakesList.appendChild(stakeElement);
        });
        
        // Add event listeners to claim buttons
        stakesList.querySelectorAll('.claim-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.claim-btn').dataset.index);
                this.claimStakingReward(index);
            });
        });
    }
    
    updateCalculator() {
        const amount = parseFloat(this.elements.calcAmount.value) || 100;
        const duration = parseInt(this.elements.calcDuration.value) || 30;
        
        // Find appropriate APR based on amount
        let apr = 40;
        for (const [id, plan] of Object.entries(APP_CONFIG.STAKING_PLANS)) {
            if (amount >= plan.amount) {
                apr = plan.apr;
            }
        }
        
        const dailyReward = (amount * (apr / 100)) / 365;
        const totalReward = dailyReward * duration;
        
        this.elements.calcDaily.textContent = `${this.formatNumber(dailyReward, 2)} AMSK`;
        this.elements.calcTotal.textContent = `${this.formatNumber(totalReward, 2)} AMSK`;
        this.elements.calcApr.textContent = `${apr}%`;
    }
    
    updateWalletTab() {
        // Update total balance
        const totalAMSK = this.calculateTotalAMSK();
        this.elements.walletTotalAmsk.textContent = this.formatNumber(totalAMSK);
        this.elements.walletTotalUsd.textContent = this.formatNumber(totalAMSK * APP_CONFIG.AMSK_PRICE, 2);
        
        // Update individual balances
        this.elements.walletAmsk.textContent = this.formatNumber(this.state.balances.AMSK);
        this.elements.walletAmskValue.textContent = this.formatNumber(this.state.balances.AMSK * APP_CONFIG.AMSK_PRICE, 2);
        
        this.elements.walletUsdt.textContent = this.formatNumber(this.state.balances.USDT, 2);
        this.elements.walletUsdtValue.textContent = this.formatNumber(this.state.balances.USDT, 2);
        
        this.elements.walletBnb.textContent = this.formatNumber(this.state.balances.BNB, 4);
        this.elements.walletBnbValue.textContent = this.formatNumber(this.state.balances.BNB * 300, 2); // Assuming 1 BNB = $300
        
        this.elements.walletTon.textContent = this.formatNumber(this.state.balances.TON, 2);
        this.elements.walletTonValue.textContent = this.formatNumber(this.state.balances.TON * 2, 2); // Assuming 1 TON = $2
        
        // Update addresses
        this.elements.usdtAddress.textContent = APP_CONFIG.DEPOSIT_ADDRESSES.USDT;
        this.elements.bnbAddress.textContent = APP_CONFIG.DEPOSIT_ADDRESSES.BNB;
        this.elements.tonAddress.textContent = APP_CONFIG.DEPOSIT_ADDRESSES.TON;
        
        // Update transaction history
        this.updateTransactionHistory();
    }
    
    updateTransactionHistory(filter = 'all') {
        const historyList = this.elements.transactionHistory;
        historyList.innerHTML = '';
        
        let transactions = [];
        
        switch (filter) {
            case 'deposit':
                transactions = this.state.transactions.deposits;
                break;
            case 'withdraw':
                transactions = this.state.transactions.withdrawals;
                break;
            case 'swap':
                transactions = this.state.transactions.swaps;
                break;
            default:
                transactions = [
                    ...this.state.transactions.deposits,
                    ...this.state.transactions.withdrawals,
                    ...this.state.transactions.swaps
                ].sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        
        if (transactions.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <p>No transactions found</p>
                </div>
            `;
            return;
        }
        
        transactions.forEach(tx => {
            const txElement = document.createElement('div');
            txElement.className = 'history-item';
            
            let icon, color, statusClass;
            
            switch (tx.type) {
                case 'deposit':
                    icon = 'fa-arrow-down';
                    color = 'success';
                    statusClass = tx.status === 'pending' ? 'warning' : 'success';
                    break;
                case 'withdrawal':
                    icon = 'fa-arrow-up';
                    color = tx.status === 'pending' ? 'warning' : 'danger';
                    statusClass = tx.status === 'pending' ? 'warning' : 'success';
                    break;
                case 'swap':
                    icon = 'fa-exchange-alt';
                    color = 'info';
                    statusClass = 'success';
                    break;
            }
            
            txElement.innerHTML = `
                <div class="history-item-icon ${color}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="history-item-details">
                    <div class="history-item-header">
                        <span class="type">${tx.type.toUpperCase()}</span>
                        <span class="amount">${tx.amount} ${tx.currency}</span>
                    </div>
                    <div class="history-item-footer">
                        <span class="date">${new Date(tx.date).toLocaleDateString()}</span>
                        <span class="status ${statusClass}">${tx.status || 'completed'}</span>
                    </div>
                </div>
            `;
            
            historyList.appendChild(txElement);
        });
    }
    
    /* ===========================================
       EVENT LISTENERS SETUP
       =========================================== */
    
    setupEventListeners() {
        // Navigation
        this.elements.navBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        
        // Mining
        this.elements.startMiningBtn.addEventListener('click', () => this.handleMining());
        this.elements.upgradeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.level-card');
                this.upgradeMining(card.dataset.level);
            });
        });
        
        // Referral
        this.elements.copyRefCode.addEventListener('click', () => this.copyReferralCode());
        this.elements.shareRef.addEventListener('click', () => this.shareReferralLink());
        
        // Staking
        this.elements.stakeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const planId = e.target.dataset.plan;
                this.openStakeModal(planId);
            });
        });
        
        // Calculator
        this.elements.calcAmount.addEventListener('input', () => this.updateCalculator());
        this.elements.calcDuration.addEventListener('change', () => this.updateCalculator());
        
        // Quick Actions
        this.elements.quickBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });
        
        // Asset Actions
        this.elements.assetActionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                const currency = e.currentTarget.dataset.currency;
                this.handleAssetAction(action, currency);
            });
        });
        
        // Copy Address Buttons
        this.elements.copyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const addressType = e.currentTarget.dataset.address;
                this.copyAddress(addressType);
            });
        });
        
        // Transaction History Filters
        this.elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                this.elements.filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.currentTarget.classList.add('active');
                // Update history with filter
                this.updateTransactionHistory(e.currentTarget.dataset.filter);
            });
        });
        
        // Modal Controls
        this.setupModalListeners();
        
        // Admin Access (Secret click sequence)
        this.setupAdminAccess();
    }
    
    setupModalListeners() {
        // Close modals
        this.elements.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });
        
        this.elements.modalOverlay.addEventListener('click', () => this.closeAllModals());
        
        // Deposit Modal
        this.elements.currencyOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                this.elements.currencyOptions.forEach(opt => opt.classList.remove('active'));
                // Add active class to clicked option
                option.classList.add('active');
                
                const currency = option.dataset.currency;
                this.updateDepositModal(currency);
            });
        });
        
        this.elements.copyAddressBtn.addEventListener('click', () => {
            this.copyToClipboard(this.elements.depositAddress.textContent);
        });
        
        this.elements.submitDeposit.addEventListener('click', () => this.submitDepositRequest());
        
        // Withdraw Modal
        this.elements.withdrawAmount.addEventListener('input', () => this.validateWithdrawal());
        this.elements.submitWithdraw.addEventListener('click', () => this.submitWithdrawalRequest());
        
        // Swap Modal
        this.elements.swapFromCurrency.addEventListener('change', () => this.updateSwapForm());
        this.elements.swapFromAmount.addEventListener('input', () => this.updateSwapForm());
        this.elements.swapToCurrency.addEventListener('change', () => this.updateSwapForm());
        this.elements.submitSwap.addEventListener('click', () => this.executeSwap());
        
        // Stake Modal
        this.elements.stakeAmount.addEventListener('input', () => this.updateStakePreview());
        this.elements.confirmStake.addEventListener('click', () => this.confirmStaking());
    }
    
    setupAdminAccess() {
        let clickCount = 0;
        let lastClickTime = 0;
        const logo = document.querySelector('.brand-section');
        
        logo.addEventListener('click', () => {
            const now = Date.now();
            if (now - lastClickTime > 2000) clickCount = 0;
            
            lastClickTime = now;
            clickCount++;
            
            if (clickCount >= 5) {
                this.showAdminLogin();
                clickCount = 0;
            }
        });
    }
    
    /* ===========================================
       TAB NAVIGATION
       =========================================== */
    
    switchTab(tabName) {
        // Update active nav button
        this.elements.navBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Show selected tab
        const selectedTab = document.getElementById(`${tabName}-tab`);
        if (selectedTab) {
            selectedTab.classList.add('active');
            selectedTab.classList.add('animate__animated');
            selectedTab.classList.add('animate__fadeIn');
        }
        
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
    
    /* ===========================================
       MINING SYSTEM
       =========================================== */
    
    handleMining() {
        if (!this.state.mining.isActive) {
            this.startMining();
            return;
        }
        
        // Check if reward is ready
        if (Date.now() >= this.state.mining.nextReward) {
            this.claimMiningReward();
        } else {
            this.showNotification('Mining in progress. Reward not ready yet.', 'info');
        }
    }
    
    startMining() {
        this.state.mining.isActive = true;
        this.state.mining.lastReward = Date.now();
        this.state.mining.nextReward = Date.now() + (6 * 60 * 60 * 1000);
        
        this.elements.startMiningBtn.innerHTML = `
            <i class="fas fa-clock"></i>
            <span>Mining in Progress</span>
        `;
        
        this.showNotification('Mining started successfully! 🚀', 'success');
        this.updateHomeTab();
    }
    
    claimMiningReward() {
        const miningLevel = APP_CONFIG.MINING_LEVELS[this.state.mining.level];
        const reward = miningLevel.reward;
        
        // Add reward to balance
        this.state.balances.AMSK += reward;
        this.state.mining.totalMined += reward;
        this.state.mining.minedToday += reward;
        
        // Reset timer
        this.state.mining.lastReward = Date.now();
        this.state.mining.nextReward = Date.now() + (6 * 60 * 60 * 1000);
        
        // Update UI
        this.updateHomeTab();
        this.updateWalletTab();
        
        // Show notification
        this.showNotification(`Claimed ${this.formatNumber(reward)} AMSK from mining! ⛏️`, 'success');
        
        // Save state
        this.saveState();
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
        
        // Update UI
        this.updateHomeTab();
        this.updateWalletTab();
        
        // Show notification
        this.showNotification(`Upgraded to ${levelData.name} level! 🚀`, 'success');
        
        // Save state
        this.saveState();
    }
    
    /* ===========================================
       REFERRAL SYSTEM
       =========================================== */
    
    copyReferralCode() {
        this.copyToClipboard(this.state.referral.code);
        this.showNotification('Referral code copied to clipboard! 📋', 'success');
    }
    
    shareReferralLink() {
        const link = `https://t.me/alien_musk_bot?start=ref-${this.state.referral.code}`;
        const message = `Join Alien Musk and earn free AMSK tokens! Use my referral code: ${this.state.referral.code}\n\n${link}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Alien Musk - Crypto Platform',
                text: message,
                url: link
            }).catch(() => {
                this.copyToClipboard(message);
                this.showNotification('Referral link copied! Share it with friends.', 'info');
            });
        } else {
            this.copyToClipboard(message);
            this.showNotification('Referral link copied! Share it with friends.', 'info');
        }
    }
    
    addReferral(userId) {
        // Check if already referred
        if (this.state.referral.referrals.includes(userId)) {
            return;
        }
        
        // Add referral
        this.state.referral.referrals.push(userId);
        this.state.referral.totalCount++;
        
        // Check for rewards
        this.checkReferralRewards();
        
        // Update UI
        this.updateHomeTab();
        
        // Save state
        this.saveState();
    }
    
    checkReferralRewards() {
        const refCount = this.state.referral.totalCount;
        
        for (const [count, data] of Object.entries(APP_CONFIG.REFERRAL_REWARDS)) {
            const countNum = parseInt(count);
            if (refCount >= countNum && !this.state.referral.claimedRewards.includes(countNum)) {
                this.claimReferralReward(countNum, data.reward);
            }
        }
    }
    
    claimReferralReward(count, reward) {
        // Add reward
        this.state.balances.AMSK += reward;
        this.state.referral.totalEarned += reward;
        this.state.referral.claimedRewards.push(count);
        
        // Show notification
        this.showNotification(`Referral reward claimed! +${this.formatNumber(reward)} AMSK 🎉`, 'success');
        
        // Update UI
        this.updateHomeTab();
        this.updateWalletTab();
        
        // Save state
        this.saveState();
    }
    
    /* ===========================================
       STAKING SYSTEM
       =========================================== */
    
    openStakeModal(planId) {
        const plan = APP_CONFIG.STAKING_PLANS[planId];
        if (!plan) return;
        
        // Update modal content
        this.elements.stakePlanDisplay.innerHTML = `
            <div class="selected-plan">
                <div class="plan-header">
                    <div class="plan-icon ${plan.name.toLowerCase()}">
                        <i class="fas fa-gem"></i>
                    </div>
                    <div class="plan-info">
                        <h4>${plan.name} Plan</h4>
                        <div class="plan-amount">${plan.amount} USDT Minimum</div>
                    </div>
                </div>
                <div class="plan-details">
                    <div class="detail">
                        <i class="fas fa-calendar"></i>
                        <span>${plan.duration} Days</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-percentage"></i>
                        <span>${plan.apr}% APR</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-coins"></i>
                        <span>${plan.dailyReward} AMSK Daily</span>
                    </div>
                </div>
            </div>
        `;
        
        // Set plan data
        this.currentStakePlan = planId;
        
        // Update available balance
        this.elements.availableUsdt.textContent = this.formatNumber(this.state.balances.USDT, 2);
        
        // Set default amount
        this.elements.stakeAmount.value = plan.amount;
        this.elements.stakeAmount.min = plan.amount;
        
        // Update preview
        this.updateStakePreview();
        
        // Show modal
        this.openModal('stake-modal');
    }
    
    updateStakePreview() {
        const plan = APP_CONFIG.STAKING_PLANS[this.currentStakePlan];
        const amount = parseFloat(this.elements.stakeAmount.value) || plan.amount;
        
        // Validate amount
        if (amount < plan.amount) {
            amount = plan.amount;
            this.elements.stakeAmount.value = plan.amount;
        }
        
        // Calculate rewards
        const dailyReward = (amount * (plan.apr / 100)) / 365;
        const totalReward = dailyReward * plan.duration;
        
        // Update preview
        this.elements.stakeDuration.textContent = `${plan.duration} Days`;
        this.elements.stakeApr.textContent = `${plan.apr}%`;
        this.elements.stakeDaily.textContent = `${this.formatNumber(dailyReward, 2)} AMSK`;
        this.elements.stakeTotal.textContent = `${this.formatNumber(totalReward, 2)} AMSK`;
    }
    
    confirmStaking() {
        const plan = APP_CONFIG.STAKING_PLANS[this.currentStakePlan];
        const amount = parseFloat(this.elements.stakeAmount.value);
        
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
            planId: this.currentStakePlan,
            amount: amount,
            startTime: Date.now(),
            endTime: Date.now() + (plan.duration * 24 * 60 * 60 * 1000),
            claimedRewards: 0
        };
        
        // Deduct USDT
        this.state.balances.USDT -= amount;
        
        // Add to active stakes
        this.state.staking.activeStakes.push(stake);
        
        // Add transaction
        this.state.transactions.swaps.push({
            type: 'stake',
            amount: amount,
            currency: 'USDT',
            date: new Date().toISOString(),
            status: 'completed'
        });
        
        // Close modal
        this.closeAllModals();
        
        // Update UI
        this.updateStakingTab();
        this.updateWalletTab();
        
        // Show notification
        this.showNotification(`Staked ${amount} USDT for ${plan.duration} days! 📈`, 'success');
        
        // Save state
        this.saveState();
    }
    
    claimStakingReward(index) {
        const stake = this.state.staking.activeStakes[index];
        if (!stake) return;
        
        const plan = APP_CONFIG.STAKING_PLANS[stake.planId];
        const daysPassed = Math.floor((Date.now() - stake.startTime) / (1000 * 60 * 60 * 24));
        const reward = daysPassed * plan.dailyReward - stake.claimedRewards;
        
        if (reward <= 0) {
            this.showNotification('No rewards available to claim yet', 'info');
            return;
        }
        
        // Add reward
        this.state.balances.AMSK += reward;
        this.state.staking.totalEarned += reward;
        stake.claimedRewards += reward;
        
        // If stake period is over, remove it
        if (Date.now() >= stake.endTime) {
            // Return staked amount
            this.state.balances.USDT += stake.amount;
            this.state.staking.activeStakes.splice(index, 1);
            
            // Add transaction
            this.state.transactions.swaps.push({
                type: 'unstake',
                amount: stake.amount,
                currency: 'USDT',
                date: new Date().toISOString(),
                status: 'completed'
            });
        }
        
        // Update UI
        this.updateStakingTab();
        this.updateWalletTab();
        
        // Show notification
        this.showNotification(`Claimed ${this.formatNumber(reward)} AMSK from staking! 💰`, 'success');
        
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
                this.updateTransactionHistory();
                break;
        }
    }
    
    handleAssetAction(action, currency) {
        switch (action) {
            case 'send':
                this.showNotification('Send functionality coming soon!', 'info');
                break;
            case 'receive':
                this.showNotification('Receive functionality coming soon!', 'info');
                break;
            case 'swap':
                if (currency === 'AMSK') {
                    this.openSwapModal();
                } else {
                    this.showNotification(`Swap ${currency} to AMSK coming soon!`, 'info');
                }
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
    
    /* ===========================================
       DEPOSIT SYSTEM
       =========================================== */
    
    openDepositModal(currency = 'USDT') {
        // Set active currency
        this.elements.currencyOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.currency === currency);
        });
        
        this.updateDepositModal(currency);
        this.openModal('deposit-modal');
    }
    
    updateDepositModal(currency) {
        // Update address
        this.elements.depositAddress.textContent = APP_CONFIG.DEPOSIT_ADDRESSES[currency];
        
        // Update labels
        this.elements.depositCurrency.textContent = currency;
        this.elements.minDepositAmount.textContent = APP_CONFIG.MIN_DEPOSIT[currency];
        
        // Reset form
        this.elements.depositAmount.value = '';
        this.elements.txId.value = '';
    }
    
    submitDepositRequest() {
        const currency = document.querySelector('.currency-option.active').dataset.currency;
        const amount = parseFloat(this.elements.depositAmount.value);
        const txId = this.elements.txId.value.trim();
        
        // Validations
        if (!amount || amount < APP_CONFIG.MIN_DEPOSIT[currency]) {
            this.showNotification(`Minimum deposit is ${APP_CONFIG.MIN_DEPOSIT[currency]} ${currency}`, 'error');
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
            status: 'pending',
            date: new Date().toISOString(),
            address: APP_CONFIG.DEPOSIT_ADDRESSES[currency]
        };
        
        // Add to pending deposits
        this.state.admin.pendingDeposits.push(deposit);
        
        // Add to user transactions
        this.state.transactions.deposits.push({
            type: 'deposit',
            currency: currency,
            amount: amount,
            status: 'pending',
            date: new Date().toISOString(),
            txId: txId
        });
        
        // Close modal
        this.closeAllModals();
        
        // Update UI
        this.updateTransactionHistory();
        this.updateHeader();
        
        // Show notification
        this.showNotification(`Deposit request submitted for ${amount} ${currency}! ⏳`, 'success');
        
        // Save state
        this.saveState();
    }
    
    /* ===========================================
       WITHDRAWAL SYSTEM
       =========================================== */
    
    openWithdrawModal() {
        // Update available balance
        this.elements.withdrawBalance.textContent = `${this.formatNumber(this.state.balances.USDT, 2)} USDT`;
        this.elements.bnbFeeBalance.textContent = `${this.formatNumber(this.state.balances.BNB, 4)} BNB`;
        
        // Reset form
        this.elements.withdrawAddress.value = '';
        this.elements.withdrawAmount.value = APP_CONFIG.MIN_WITHDRAWAL;
        
        // Validate
        this.validateWithdrawal();
        
        // Show modal
        this.openModal('withdraw-modal');
    }
    
    validateWithdrawal() {
        const amount = parseFloat(this.elements.withdrawAmount.value) || 0;
        const hasEnoughUsdt = this.state.balances.USDT >= amount;
        const hasEnoughBnb = this.state.balances.BNB >= APP_CONFIG.WITHDRAWAL_FEE;
        const isValidAmount = amount >= APP_CONFIG.MIN_WITHDRAWAL;
        
        // Update fee warning
        if (!hasEnoughBnb) {
            this.elements.feeWarning.classList.remove('hidden');
        } else {
            this.elements.feeWarning.classList.add('hidden');
        }
        
        // Enable/disable submit button
        this.elements.submitWithdraw.disabled = !(hasEnoughUsdt && hasEnoughBnb && isValidAmount);
        
        // Update button text
        if (!hasEnoughUsdt) {
            this.elements.submitWithdraw.textContent = 'Insufficient USDT';
        } else if (!hasEnoughBnb) {
            this.elements.submitWithdraw.textContent = 'Insufficient BNB for fee';
        } else if (!isValidAmount) {
            this.elements.submitWithdraw.textContent = `Minimum ${APP_CONFIG.MIN_WITHDRAWAL} USDT`;
        } else {
            this.elements.submitWithdraw.textContent = 'Submit Withdrawal Request';
        }
    }
    
    submitWithdrawalRequest() {
        const address = this.elements.withdrawAddress.value.trim();
        const amount = parseFloat(this.elements.withdrawAmount.value);
        
        // Validations
        if (!address) {
            this.showNotification('Please enter wallet address', 'error');
            return;
        }
        
        if (amount < APP_CONFIG.MIN_WITHDRAWAL) {
            this.showNotification(`Minimum withdrawal is ${APP_CONFIG.MIN_WITHDRAWAL} USDT`, 'error');
            return;
        }
        
        if (this.state.balances.USDT < amount) {
            this.showNotification('Insufficient USDT balance', 'error');
            return;
        }
        
        if (this.state.balances.BNB < APP_CONFIG.WITHDRAWAL_FEE) {
            this.showNotification(`Insufficient BNB for network fee (${APP_CONFIG.WITHDRAWAL_FEE} BNB required)`, 'error');
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
            fee: APP_CONFIG.WITHDRAWAL_FEE
        };
        
        // Deduct from balance immediately
        this.state.balances.USDT -= amount;
        this.state.balances.BNB -= APP_CONFIG.WITHDRAWAL_FEE;
        
        // Add to pending withdrawals
        this.state.admin.pendingWithdrawals.push(withdrawal);
        
        // Add to user transactions
        this.state.transactions.withdrawals.push({
            type: 'withdrawal',
            currency: 'USDT',
            amount: amount,
            status: 'pending',
            date: new Date().toISOString(),
            address: address
        });
        
        // Close modal
        this.closeAllModals();
        
        // Update UI
        this.updateWalletTab();
        this.updateTransactionHistory();
        this.updateHeader();
        
        // Show notification
        this.showNotification(`Withdrawal request submitted for ${amount} USDT! ⏳`, 'success');
        
        // Save state
        this.saveState();
    }
    
    /* ===========================================
       SWAP SYSTEM
       =========================================== */
    
    openSwapModal() {
        // Reset form
        this.elements.swapFromCurrency.value = 'AMSK';
        this.elements.swapToCurrency.value = 'USDT';
        this.elements.swapFromAmount.value = '';
        this.elements.swapToAmount.textContent = '0';
        
        // Update balances
        this.updateSwapForm();
        
        // Show modal
        this.openModal('swap-modal');
    }
    
    updateSwapForm() {
        const fromCurrency = this.elements.swapFromCurrency.value;
        const toCurrency = this.elements.swapToCurrency.value;
        const amount = parseFloat(this.elements.swapFromAmount.value) || 0;
        
        // Update balance displays
        this.elements.swapFromBalance.textContent = this.formatNumber(this.state.balances[fromCurrency], 
            fromCurrency === 'BNB' ? 4 : fromCurrency === 'USDT' ? 2 : 0);
        this.elements.swapToBalance.textContent = this.formatNumber(this.state.balances[toCurrency], 
            toCurrency === 'BNB' ? 4 : toCurrency === 'USDT' ? 2 : 0);
        
        // Calculate conversion
        let result = 0;
        let rateText = '';
        
        if (fromCurrency === 'AMSK' && toCurrency === 'USDT') {
            result = amount * APP_CONFIG.SWAP_RATES.AMSK_TO_USDT;
            rateText = `1 AMSK = ${APP_CONFIG.SWAP_RATES.AMSK_TO_USDT} USDT`;
        } else if (fromCurrency === 'BNB' && toCurrency === 'AMSK') {
            result = amount * APP_CONFIG.SWAP_RATES.BNB_TO_AMSK;
            rateText = `1 BNB = ${this.formatNumber(APP_CONFIG.SWAP_RATES.BNB_TO_AMSK)} AMSK`;
        } else if (fromCurrency === 'TON' && toCurrency === 'AMSK') {
            result = amount * APP_CONFIG.SWAP_RATES.TON_TO_AMSK;
            rateText = `1 TON = ${this.formatNumber(APP_CONFIG.SWAP_RATES.TON_TO_AMSK)} AMSK`;
        } else if (fromCurrency === 'USDT' && toCurrency === 'AMSK') {
            result = amount / APP_CONFIG.AMSK_PRICE;
            rateText = `1 USDT = ${this.formatNumber(1 / APP_CONFIG.AMSK_PRICE)} AMSK`;
        }
        
        // Update display
        this.elements.swapToAmount.textContent = this.formatNumber(result, 
            toCurrency === 'BNB' ? 4 : toCurrency === 'USDT' ? 2 : 0);
        this.elements.swapRate.textContent = rateText;
        
        // Validate
        this.validateSwap(fromCurrency, amount, result);
    }
    
    validateSwap(fromCurrency, amount, result) {
        // Check minimum for AMSK to USDT
        if (fromCurrency === 'AMSK' && amount < APP_CONFIG.MIN_SWAP_AMSK) {
            this.elements.submitSwap.disabled = true;
            this.elements.submitSwap.textContent = `Minimum ${this.formatNumber(APP_CONFIG.MIN_SWAP_AMSK)} AMSK`;
            return;
        }
        
        // Check balance
        if (amount > this.state.balances[fromCurrency]) {
            this.elements.submitSwap.disabled = true;
            this.elements.submitSwap.textContent = 'Insufficient balance';
            return;
        }
        
        // Check if amount is valid
        if (amount <= 0 || isNaN(amount)) {
            this.elements.submitSwap.disabled = true;
            this.elements.submitSwap.textContent = 'Enter valid amount';
            return;
        }
        
        // Enable button
        this.elements.submitSwap.disabled = false;
        this.elements.submitSwap.textContent = 'Confirm Swap';
    }
    
    executeSwap() {
        const fromCurrency = this.elements.swapFromCurrency.value;
        const toCurrency = this.elements.swapToCurrency.value;
        const amount = parseFloat(this.elements.swapFromAmount.value);
        
        // Calculate result
        let result = 0;
        if (fromCurrency === 'AMSK' && toCurrency === 'USDT') {
            result = amount * APP_CONFIG.SWAP_RATES.AMSK_TO_USDT;
        } else if (fromCurrency === 'BNB' && toCurrency === 'AMSK') {
            result = amount * APP_CONFIG.SWAP_RATES.BNB_TO_AMSK;
        } else if (fromCurrency === 'TON' && toCurrency === 'AMSK') {
            result = amount * APP_CONFIG.SWAP_RATES.TON_TO_AMSK;
        } else if (fromCurrency === 'USDT' && toCurrency === 'AMSK') {
            result = amount / APP_CONFIG.AMSK_PRICE;
        }
        
        // Update balances
        this.state.balances[fromCurrency] -= amount;
        this.state.balances[toCurrency] += result;
        
        // Add transaction
        this.state.transactions.swaps.push({
            type: 'swap',
            from: fromCurrency,
            to: toCurrency,
            amount: amount,
            result: result,
            date: new Date().toISOString(),
            status: 'completed'
        });
        
        // Close modal
        this.closeAllModals();
        
        // Update UI
        this.updateWalletTab();
        this.updateTransactionHistory();
        
        // Show notification
        this.showNotification(`Swapped ${this.formatNumber(amount)} ${fromCurrency} to ${this.formatNumber(result)} ${toCurrency}! 🔄`, 'success');
        
        // Save state
        this.saveState();
    }
    
    /* ===========================================
       MODAL MANAGEMENT
       =========================================== */
    
    openModal(modalId) {
        // Close any open modals
        this.closeAllModals();
        
        // Show overlay and modal
        this.elements.modalOverlay.classList.add('active');
        document.getElementById(modalId).classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    closeAllModals() {
        // Hide all modals and overlay
        this.elements.modalOverlay.classList.remove('active');
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    /* ===========================================
       ADMIN SYSTEM
       =========================================== */
    
    showAdminLogin() {
        const password = prompt('Enter admin password:');
        
        if (password === APP_CONFIG.ADMIN_SECRET && this.state.user.id === APP_CONFIG.ADMIN_USER_ID) {
            this.state.admin.isLoggedIn = true;
            this.showAdminPanel();
            this.showNotification('Welcome, Admin! 👑', 'success');
        } else {
            this.showNotification('Access denied! ❌', 'error');
        }
    }
    
    showAdminPanel() {
        this.elements.adminPanel.innerHTML = `
            <div class="admin-dashboard">
                <h2><i class="fas fa-user-shield"></i> Admin Dashboard</h2>
                
                <div class="admin-section">
                    <h3><i class="fas fa-arrow-down"></i> Pending Deposits (${this.state.admin.pendingDeposits.length})</h3>
                    <div class="pending-list" id="admin-deposits-list">
                        ${this.state.admin.pendingDeposits.map(deposit => `
                            <div class="pending-item">
                                <div class="pending-info">
                                    <div class="user">User ID: ${deposit.userId}</div>
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
                        `).join('') || '<p>No pending deposits</p>'}
                    </div>
                </div>
                
                <div class="admin-section">
                    <h3><i class="fas fa-arrow-up"></i> Pending Withdrawals (${this.state.admin.pendingWithdrawals.length})</h3>
                    <div class="pending-list" id="admin-withdrawals-list">
                        ${this.state.admin.pendingWithdrawals.map(withdrawal => `
                            <div class="pending-item">
                                <div class="pending-info">
                                    <div class="user">User ID: ${withdrawal.userId}</div>
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
                        `).join('') || '<p>No pending withdrawals</p>'}
                    </div>
                </div>
                
                <div class="admin-section">
                    <h3><i class="fas fa-users-cog"></i> User Management</h3>
                    <div class="admin-stats">
                        <div class="stat">
                            <div class="value">1</div>
                            <div class="label">Active Users</div>
                        </div>
                        <div class="stat">
                            <div class="value">${this.state.admin.pendingDeposits.length + this.state.admin.pendingWithdrawals.length}</div>
                            <div class="label">Pending Requests</div>
                        </div>
                    </div>
                </div>
                
                <button id="close-admin" class="admin-btn close">
                    <i class="fas fa-times"></i> Close Admin Panel
                </button>
            </div>
        `;
        
        // Show admin panel
        this.elements.adminPanel.classList.add('active');
        
        // Add event listeners
        document.getElementById('close-admin').addEventListener('click', () => {
            this.elements.adminPanel.classList.remove('active');
        });
        
        // Add admin button listeners
        document.querySelectorAll('.admin-btn.approve, .admin-btn.reject, .admin-btn.pay').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').dataset.id;
                const type = e.target.closest('button').dataset.type;
                const action = e.target.closest('button').classList.contains('approve') ? 'approve' : 
                              e.target.closest('button').classList.contains('pay') ? 'pay' : 'reject';
                
                this.handleAdminAction(id, type, action);
            });
        });
    }
    
    handleAdminAction(id, type, action) {
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
            
            this.showNotification(`Deposit approved: ${deposit.amount} ${deposit.currency}`, 'success');
        } else {
            // Update transaction status
            const txIndex = this.state.transactions.deposits.findIndex(tx => tx.txId === deposit.txId);
            if (txIndex !== -1) {
                this.state.transactions.deposits[txIndex].status = 'rejected';
            }
            
            this.showNotification(`Deposit rejected: ${deposit.amount} ${deposit.currency}`, 'error');
        }
        
        // Remove from pending
        this.state.admin.pendingDeposits.splice(depositIndex, 1);
        
        // Update UI
        this.showAdminPanel();
        this.updateWalletTab();
        this.updateTransactionHistory();
        this.updateHeader();
        
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
            
            this.showNotification(`Withdrawal paid: ${withdrawal.amount} ${withdrawal.currency}`, 'success');
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
            
            this.showNotification(`Withdrawal rejected: ${withdrawal.amount} ${withdrawal.currency}`, 'error');
        }
        
        // Remove from pending
        this.state.admin.pendingWithdrawals.splice(withdrawalIndex, 1);
        
        // Update UI
        this.showAdminPanel();
        this.updateWalletTab();
        this.updateTransactionHistory();
        
        // Save state
        this.saveState();
    }
    
    /* ===========================================
       UTILITY METHODS
       =========================================== */
    
    calculateTotalAMSK() {
        return this.state.balances.AMSK + this.state.mining.minedToday;
    }
    
    calculateTotalBalance() {
        const amskValue = this.calculateTotalAMSK() * APP_CONFIG.AMSK_PRICE;
        const usdtValue = this.state.balances.USDT;
        const bnbValue = this.state.balances.BNB * 300; // Assuming 1 BNB = $300
        const tonValue = this.state.balances.TON * 2; // Assuming 1 TON = $2
        
        return amskValue + usdtValue + bnbValue + tonValue;
    }
    
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
    
    generateReferralCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'ALIEN-';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    
    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => this.showNotification('Copied to clipboard! 📋', 'success'))
            .catch(() => this.showNotification('Failed to copy', 'error'));
    }
    
    copyAddress(addressType) {
        const address = APP_CONFIG.DEPOSIT_ADDRESSES[addressType.toUpperCase()];
        this.copyToClipboard(address);
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
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    showLoading() {
        this.elements.loadingSpinner.classList.add('active');
    }
    
    hideLoading() {
        this.elements.loadingSpinner.classList.remove('active');
    }
    
    /* ===========================================
       TIMERS
       =========================================== */
    
    startTimers() {
        // Mining Timer
        this.miningTimer = setInterval(() => {
            this.updateMiningTimer();
        }, 1000);
        
        // Auto-save every minute
        this.autoSaveTimer = setInterval(() => {
            this.saveState();
        }, 60000);
    }
    
    updateMiningTimer() {
        if (!this.state.mining.isActive) return;
        
        const now = Date.now();
        const timeLeft = this.state.mining.nextReward - now;
        
        if (timeLeft <= 0) {
            // Reward is ready
            this.elements.miningTimer.textContent = 'READY!';
            this.elements.miningTimer.style.color = 'var(--secondary)';
            
            this.elements.startMiningBtn.innerHTML = `
                <i class="fas fa-gift"></i>
                <span>Claim Reward</span>
            `;
        } else {
            // Update timer
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            this.elements.miningTimer.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            this.elements.miningTimer.style.color = 'var(--text-primary)';
            
            this.elements.startMiningBtn.innerHTML = `
                <i class="fas fa-clock"></i>
                <span>Mining in Progress</span>
            `;
        }
    }
    
    /* ===========================================
       STATE MANAGEMENT
       =========================================== */
    
    saveState() {
        if (this.useLocalStorage) {
            try {
                localStorage.setItem('alien_musk_state', JSON.stringify(this.state));
            } catch (error) {
                console.error('Failed to save state:', error);
            }
        } else {
            // Save to Firebase
            // Implementation for Firebase would go here
        }
    }
    
    loadState() {
        if (this.useLocalStorage) {
            try {
                const savedState = localStorage.getItem('alien_musk_state');
                if (savedState) {
                    const parsedState = JSON.parse(savedState);
                    this.state = { ...this.state, ...parsedState };
                    return true;
                }
            } catch (error) {
                console.error('Failed to load state:', error);
            }
        }
        return false;
    }
    
    /* ===========================================
       EVENT HANDLERS
       =========================================== */
    
    handleBeforeUnload() {
        this.saveState();
    }
    
    handleVisibilityChange() {
        if (!document.hidden) {
            // App became visible, refresh data
            this.updateHomeTab();
            this.updateWalletTab();
        }
    }
}

/* ===========================================
   GLOBAL CSS ANIMATIONS
   =========================================== */

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .stake-item {
        background: rgba(255, 255, 255, 0.05);
        border-radius: var(--border-radius-md);
        padding: 16px;
        margin-bottom: 12px;
        border: 1px solid var(--border-secondary);
    }
    
    .stake-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }
    
    .stake-plan {
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .stake-amount {
        color: var(--secondary);
        font-weight: 600;
    }
    
    .stake-item-details {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        margin-bottom: 12px;
    }
    
    .stake-item-details .detail {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
    }
    
    .stake-item-details .label {
        color: var(--text-secondary);
    }
    
    .stake-item-details .value {
        color: var(--text-primary);
        font-weight: 500;
    }
    
    .claim-btn {
        width: 100%;
        padding: 10px;
        background: var(--gradient-primary);
        color: white;
        border: none;
        border-radius: var(--border-radius-md);
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    
    .history-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: var(--border-radius-md);
        margin-bottom: 8px;
        border: 1px solid var(--border-secondary);
    }
    
    .history-item-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
    }
    
    .history-item-icon.success {
        background: rgba(16, 185, 129, 0.1);
        color: var(--text-success);
    }
    
    .history-item-icon.warning {
        background: rgba(245, 158, 11, 0.1);
        color: var(--text-warning);
    }
    
    .history-item-icon.danger {
        background: rgba(239, 68, 68, 0.1);
        color: var(--text-danger);
    }
    
    .history-item-icon.info {
        background: rgba(59, 130, 246, 0.1);
        color: var(--text-info);
    }
    
    .history-item-details {
        flex: 1;
    }
    
    .history-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
    }
    
    .history-item-header .type {
        font-size: 12px;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .history-item-header .amount {
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .history-item-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 11px;
    }
    
    .history-item-footer .date {
        color: var(--text-muted);
    }
    
    .history-item-footer .status {
        padding: 2px 8px;
        border-radius: 10px;
        font-weight: 500;
    }
    
    .history-item-footer .status.success {
        background: rgba(16, 185, 129, 0.1);
        color: var(--text-success);
    }
    
    .history-item-footer .status.warning {
        background: rgba(245, 158, 11, 0.1);
        color: var(--text-warning);
    }
    
    .history-item-footer .status.danger {
        background: rgba(239, 68, 68, 0.1);
        color: var(--text-danger);
    }
    
    .admin-dashboard {
        color: var(--text-primary);
    }
    
    .admin-section {
        margin-bottom: 24px;
    }
    
    .admin-section h3 {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 16px;
        color: var(--text-primary);
    }
    
    .pending-list {
        max-height: 300px;
        overflow-y: auto;
    }
    
    .pending-item {
        background: rgba(255, 255, 255, 0.05);
        border-radius: var(--border-radius-md);
        padding: 16px;
        margin-bottom: 12px;
        border: 1px solid var(--border-secondary);
    }
    
    .pending-info {
        margin-bottom: 12px;
    }
    
    .pending-info .user {
        font-size: 12px;
        color: var(--text-muted);
        margin-bottom: 4px;
    }
    
    .pending-info .amount {
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 4px;
    }
    
    .pending-info .txid,
    .pending-info .address {
        font-family: monospace;
        font-size: 10px;
        color: var(--text-secondary);
        word-break: break-all;
    }
    
    .pending-actions {
        display: flex;
        gap: 8px;
    }
    
    .admin-btn {
        flex: 1;
        padding: 8px 12px;
        border: none;
        border-radius: var(--border-radius-md);
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: var(--transition-normal);
    }
    
    .admin-btn.approve {
        background: rgba(16, 185, 129, 0.1);
        color: var(--text-success);
        border: 1px solid var(--border-success);
    }
    
    .admin-btn.approve:hover {
        background: rgba(16, 185, 129, 0.2);
    }
    
    .admin-btn.reject {
        background: rgba(239, 68, 68, 0.1);
        color: var(--text-danger);
        border: 1px solid var(--border-danger);
    }
    
    .admin-btn.reject:hover {
        background: rgba(239, 68, 68, 0.2);
    }
    
    .admin-btn.pay {
        background: rgba(245, 158, 11, 0.1);
        color: var(--text-warning);
        border: 1px solid var(--border-warning);
    }
    
    .admin-btn.pay:hover {
        background: rgba(245, 158, 11, 0.2);
    }
    
    .admin-btn.close {
        width: 100%;
        background: rgba(239, 68, 68, 0.1);
        color: var(--text-danger);
        border: 1px solid var(--border-danger);
        margin-top: 24px;
    }
    
    .admin-btn.close:hover {
        background: rgba(239, 68, 68, 0.2);
    }
    
    .admin-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }
    
    .admin-stats .stat {
        background: rgba(255, 255, 255, 0.05);
        border-radius: var(--border-radius-md);
        padding: 20px;
        text-align: center;
        border: 1px solid var(--border-secondary);
    }
    
    .admin-stats .value {
        font-family: 'Orbitron', monospace;
        font-size: 24px;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 4px;
    }
    
    .admin-stats .label {
        font-size: 12px;
        color: var(--text-secondary);
    }
`;
document.head.appendChild(style);

/* ===========================================
   APP INITIALIZATION
   =========================================== */

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create and initialize the app
    window.alienMuskApp = new AlienMuskApp();
    
    // Add global event listeners
    window.addEventListener('beforeunload', () => {
        window.alienMuskApp.handleBeforeUnload();
    });
    
    document.addEventListener('visibilitychange', () => {
        window.alienMuskApp.handleVisibilityChange();
    });
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
    navigator.clipboard.writeText(text)
        .then(() => {
            if (window.alienMuskApp) {
                window.alienMuskApp.showNotification('Copied to clipboard! 📋', 'success');
            }
        })
        .catch(() => {
            if (window.alienMuskApp) {
                window.alienMuskApp.showNotification('Failed to copy', 'error');
            }
        });
};

console.log('👽 Alien Musk Platform loaded successfully!');

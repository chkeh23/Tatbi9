/* ===========================================
   ALIEN MUSK - Ultimate Crypto Platform
   Main Application JavaScript
   Version: 3.0.0 (Professional & Organized)
   =========================================== */

// App Configuration
const APP_CONFIG = {
    AMSK_PRICE: 0.0002,
    
    // Mining Configuration
    MINING_LEVELS: {
        1: { name: "Beginner", cost: 0, reward: 25000, hashrate: 100 },
        2: { name: "Advanced", cost: 5, reward: 50000, hashrate: 200 },
        3: { name: "Pro", cost: 20, reward: 100000, hashrate: 400 },
        4: { name: "Expert", cost: 100, reward: 250000, hashrate: 800 }
    },
    
    // Staking Plans
    STAKING_PLANS: {
        1: { name: "Silver", amount: 10, duration: 7, apr: 40, dailyReward: 40 },
        2: { name: "Gold", amount: 50, duration: 15, apr: 50, dailyReward: 250 },
        3: { name: "Diamond", amount: 100, duration: 30, apr: 60, dailyReward: 600 }
    },
    
    // Referral Rewards
    REFERRAL_REWARDS: {
        10: { reward: 250000 }
    },
    
    // Swap Rates
    SWAP_RATES: {
        AMSK_TO_USDT: 0.0002,
        USDT_TO_AMSK: 5000
    }
};

// Firebase Configuration
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCklv_zMfndK4-xUHECyD5XA7p_-20e1t8",
    authDomain: "tatbi9-681bf.firebaseapp.com",
    projectId: "tatbi9-681bf",
    storageBucket: "tatbi9-681bf.firebasestorage.app",
    messagingSenderId: "863237064748",
    appId: "1:863237064748:web:134de1e01d2639ef5fa989"
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
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load user data
            await this.loadUserData();
            
            // Start background timers
            this.startTimers();
            
            // Hide loading
            this.hideLoading();
            
            console.log('✅ App initialized successfully');
            
        } catch (error) {
            console.error('❌ App initialization failed:', error);
            this.hideLoading();
        }
    }

    /* ===========================================
       INITIALIZATION METHODS
       =========================================== */

    async initFirebase() {
        try {
            firebase.initializeApp(FIREBASE_CONFIG);
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
                        first_name: 'Alien'
                    }
                }
            };
        }
    }

    setupInitialState() {
        this.state = {
            user: {
                id: this.tg?.initDataUnsafe?.user?.id || Date.now(),
                name: this.tg?.initDataUnsafe?.user?.first_name || 'Alien',
                username: this.tg?.initDataUnsafe?.user?.username || 'alien_user'
            },
            mining: {
                level: 1,
                isActive: true,
                nextReward: Date.now() + (4 * 60 * 60 * 1000), // 4 hours
                minedToday: 0,
                totalMined: 0
            },
            staking: {
                activeStakes: []
            },
            balances: {
                AMSK: 0,
                USDT: 0
            },
            referral: {
                code: 'ALIEN-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                referrals: 0,
                earned: 0
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
        
        // Quick Actions
        this.quickBtns = document.querySelectorAll('.quick-btn');
        
        // Modal Elements
        this.modalOverlay = document.getElementById('modal-overlay');
        this.closeModalBtns = document.querySelectorAll('.close-modal');
        
        // Loading
        this.loadingSpinner = document.getElementById('loading-spinner');
    }

    /* ===========================================
       EVENT LISTENERS SETUP
       =========================================== */

    setupEventListeners() {
        // Navigation
        this.navBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Mining
        this.startMiningBtn.addEventListener('click', () => this.handleMining());
        
        // Mining Levels
        document.querySelectorAll('.upgrade-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
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
                const planId = e.target.dataset.plan;
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

        // Modal Controls
        this.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });
        
        this.modalOverlay.addEventListener('click', () => this.closeAllModals());

        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const address = document.getElementById('usdt-address').textContent;
                this.copyToClipboard(address);
            });
        });

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
       TAB NAVIGATION - IMPROVED
       =========================================== */

    switchTab(tabName) {
        // Update active nav button
        this.navBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
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
       USER DATA MANAGEMENT
       =========================================== */

    async loadUserData() {
        try {
            const userId = this.state.user.id.toString();
            const userRef = this.db.collection('users').doc(userId);
            const userDoc = await userRef.get();
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                this.state = { ...this.state, ...userData };
            } else {
                // Create new user
                await userRef.set(this.state);
            }
            
            this.updateUI();
            
        } catch (error) {
            console.error('Error loading user data:', error);
            // Load from localStorage as fallback
            this.loadFromLocalStorage();
        }
    }

    async saveUserData() {
        try {
            const userId = this.state.user.id.toString();
            const userRef = this.db.collection('users').doc(userId);
            await userRef.set(this.state, { merge: true });
        } catch (error) {
            console.error('Error saving user data:', error);
            // Save to localStorage as fallback
            this.saveToLocalStorage();
        }
    }

    loadFromLocalStorage() {
        const savedData = localStorage.getItem('alien_musk_user_data');
        if (savedData) {
            this.state = JSON.parse(savedData);
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('alien_musk_user_data', JSON.stringify(this.state));
    }

    /* ===========================================
       UI UPDATE METHODS
       =========================================== */

    updateUI() {
        this.updateHomeTab();
        this.updateStakingTab();
        this.updateWalletTab();
    }

    updateHomeTab() {
        // Welcome message
        this.welcomeText.textContent = `Welcome, ${this.state.user.name}!`;
        this.userId.textContent = this.state.user.id.toString().substr(0, 8);
        
        // Balance
        const totalAMSK = this.state.balances.AMSK || 0;
        this.totalAmsk.textContent = this.formatNumber(totalAMSK);
        this.usdEquivalent.textContent = this.formatNumber(totalAMSK * APP_CONFIG.AMSK_PRICE, 2);
        
        // Mining info
        const miningLevel = APP_CONFIG.MINING_LEVELS[this.state.mining.level];
        this.currentHashrate.textContent = miningLevel.hashrate;
        this.nextReward.textContent = `${this.formatNumber(miningLevel.reward)} AMSK`;
        
        // Stats
        this.minedToday.textContent = this.formatNumber(this.state.mining.minedToday);
        this.totalMined.textContent = this.formatNumber(this.state.mining.totalMined);
        this.stakingEarned.textContent = this.formatNumber(this.state.staking.totalEarned || 0);
        this.miningLevel.textContent = this.state.mining.level;
        
        // Referral info
        this.refCount.textContent = this.state.referral.referrals;
        this.totalRefs.textContent = this.state.referral.referrals;
        this.refEarned.textContent = `${this.formatNumber(this.state.referral.earned)} AMSK`;
        this.refCode.textContent = this.state.referral.code;
        
        // Update mining timer
        this.updateMiningTimer();
        
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
        const totalAMSK = this.state.balances.AMSK || 0;
        const usdtBalance = this.state.balances.USDT || 0;
        
        // Total balance
        this.walletTotalAmsk.textContent = this.formatNumber(totalAMSK);
        this.walletTotalUsd.textContent = this.formatNumber(totalAMSK * APP_CONFIG.AMSK_PRICE, 2);
        
        // AMSK balance
        this.walletAmsk.textContent = this.formatNumber(totalAMSK);
        this.walletAmskValue.textContent = this.formatNumber(totalAMSK * APP_CONFIG.AMSK_PRICE, 2);
        
        // USDT balance
        this.walletUsdt.textContent = this.formatNumber(usdtBalance, 2);
        this.walletUsdtValue.textContent = this.formatNumber(usdtBalance, 2);
    }

    updateMiningTimer() {
        const now = Date.now();
        const timeLeft = this.state.mining.nextReward - now;
        
        if (timeLeft <= 0) {
            this.miningTimer.textContent = 'READY!';
            this.miningTimer.style.color = '#00D4AA';
        } else {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            this.miningTimer.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            this.miningTimer.style.color = '#FFFFFF';
        }
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
                card.classList.add('active');
            } else if (level < this.state.mining.level) {
                btn.textContent = 'Upgraded';
                btn.disabled = true;
            } else {
                btn.textContent = canAfford ? 'Upgrade' : `Need ${levelData.cost} USDT`;
                btn.disabled = !canAfford;
                card.classList.remove('active');
            }
        });
    }

    updateStakesList() {
        const stakesList = this.activeStakesList;
        stakesList.innerHTML = '';
        
        if (!this.state.staking.activeStakes || this.state.staking.activeStakes.length === 0) {
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
            `;
            
            stakesList.appendChild(stakeElement);
        });
    }

    updateCalculator() {
        const amount = parseFloat(this.calcAmount.value) || 100;
        const duration = parseInt(this.calcDuration.value) || 30;
        
        // Find appropriate APR
        let apr = 40;
        for (const [id, plan] of Object.entries(APP_CONFIG.STAKING_PLANS)) {
            if (amount >= plan.amount) {
                apr = plan.apr;
            }
        }
        
        const dailyReward = (amount * (apr / 100)) / 365;
        const totalReward = dailyReward * duration;
        
        this.calcDaily.textContent = `${this.formatNumber(dailyReward, 2)} AMSK`;
        this.calcTotal.textContent = `${this.formatNumber(totalReward, 2)} AMSK`;
        this.calcApr.textContent = `${apr}%`;
    }

    /* ===========================================
       MINING SYSTEM
       =========================================== */

    handleMining() {
        if (this.state.mining.isActive) {
            this.claimMiningReward();
        } else {
            this.startMining();
        }
    }

    startMining() {
        this.state.mining.isActive = true;
        this.state.mining.nextReward = Date.now() + (4 * 60 * 60 * 1000);
        
        this.updateHomeTab();
        this.saveUserData();
        
        this.showNotification('Mining started! ⛏️', 'success');
    }

    claimMiningReward() {
        if (!this.state.mining.isActive || Date.now() < this.state.mining.nextReward) {
            this.showNotification('Mining in progress...', 'info');
            return;
        }
        
        const miningLevel = APP_CONFIG.MINING_LEVELS[this.state.mining.level];
        const reward = miningLevel.reward;
        
        // Add reward
        this.state.balances.AMSK = (this.state.balances.AMSK || 0) + reward;
        this.state.mining.minedToday += reward;
        this.state.mining.totalMined += reward;
        
        // Reset timer
        this.state.mining.nextReward = Date.now() + (4 * 60 * 60 * 1000);
        
        this.updateUI();
        this.saveUserData();
        
        this.showNotification(`Claimed ${this.formatNumber(reward)} AMSK! 💎`, 'success');
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
        
        this.showNotification(`Upgraded to ${levelData.name} level! 🚀`, 'success');
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
                    <div class="plan-icon ${plan.name.toLowerCase()}">
                        <i class="fas fa-gem"></i>
                    </div>
                    <div class="plan-info">
                        <h4>${plan.name} Plan</h4>
                        <div class="plan-amount">${plan.amount} USDT Minimum</div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('available-usdt').textContent = this.formatNumber(this.state.balances.USDT || 0, 2);
        document.getElementById('stake-duration').textContent = `${plan.duration} Days`;
        document.getElementById('stake-apr').textContent = `${plan.apr}%`;
        document.getElementById('stake-daily').textContent = `${plan.dailyReward} AMSK`;
        document.getElementById('stake-total').textContent = `${plan.dailyReward * plan.duration} AMSK`;
        
        // Set minimum amount
        const stakeAmountInput = document.getElementById('stake-amount');
        stakeAmountInput.value = plan.amount;
        stakeAmountInput.min = plan.amount;
        
        // Store current plan
        this.currentStakePlan = planId;
        
        // Show modal
        this.openModal('stake-modal');
    }

    /* ===========================================
       REFERRAL SYSTEM
       =========================================== */

    copyReferralCode() {
        this.copyToClipboard(this.state.referral.code);
        this.showNotification('Referral code copied! 📋', 'success');
    }

    shareReferralLink() {
        const message = `🚀 Join Alien Musk and earn free AMSK tokens!\n\nUse my referral code: ${this.state.referral.code}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Alien Musk - Ultimate Crypto Platform',
                text: message
            }).catch(() => {
                this.copyToClipboard(message);
                this.showNotification('Referral link copied!', 'info');
            });
        } else {
            this.copyToClipboard(message);
            this.showNotification('Referral link copied! Share it with friends.', 'info');
        }
    }

    /* ===========================================
       QUICK ACTIONS
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
                this.switchTab('wallet');
                break;
        }
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
            notification.style.animation = 'slideOutRight 0.3s ease';
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
        // This would show admin panel
        console.log('Admin panel requested');
        this.showNotification('Admin panel access granted', 'success');
    }

    /* ===========================================
       TIMERS
       =========================================== */

    startTimers() {
        // Mining timer
        setInterval(() => {
            this.updateMiningTimer();
        }, 1000);
        
        // Auto-save every 30 seconds
        setInterval(() => {
            this.saveUserData();
        }, 30000);
    }
}

/* ===========================================
   APP INITIALIZATION
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {
    window.alienMuskApp = new AlienMuskApp();
    window.AlienMusk = window.alienMuskApp;
});

console.log('👽 Alien Musk Platform loaded!');

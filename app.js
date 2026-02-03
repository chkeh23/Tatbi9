/* ===========================================
   ALIEN MUSK - Ultimate Crypto Platform
   Main Application JavaScript
   Version: 7.0.0 (Perfect & Professional)
   Created with ❤️ for the best partner
   =========================================== */

'use strict';

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================
const CONFIG = {
    // Token Economics
    TOKEN: {
        PRICE: 0.0002,
        SYMBOL: 'AMSK',
        DECIMALS: 2
    },
    
    // Mining Configuration
    MINING: {
        LEVELS: {
            1: { name: 'Beginner', cost: 0, reward: 2500, hashrate: '2,500', duration: 3600000 },
            2: { name: 'Advanced', cost: 5, reward: 5000, hashrate: '5,000', duration: 3600000 },
            3: { name: 'Pro', cost: 20, reward: 10000, hashrate: '10,000', duration: 3600000 },
            4: { name: 'Expert', cost: 100, reward: 25000, hashrate: '25,000', duration: 3600000 }
        },
        INITIAL_LEVEL: 1
    },
    
    // Staking Configuration
    STAKING: {
        PLANS: {
            1: { id: 'silver', name: 'Silver Plan', amount: 10, duration: 7, apr: 40, dailyReward: 40 },
            2: { id: 'gold', name: 'Gold Plan', amount: 50, duration: 15, apr: 50, dailyReward: 250 },
            3: { id: 'diamond', name: 'Diamond Plan', amount: 100, duration: 30, apr: 60, dailyReward: 600 }
        },
        MIN_AMOUNT: 10
    },
    
    // Swap Configuration
    SWAP: {
        RATES: {
            AMSK_TO_USDT: 0.0002,
            USDT_TO_AMSK: 5000
        },
        MIN_AMSK: 250000,
        FEE: 0.01
    },
    
    // Wallet Configuration
    WALLET: {
        MIN_DEPOSIT: 10,
        MIN_WITHDRAWAL: 100,
        NETWORK_FEE: 0.0005
    },
    
    // Referral Configuration
    REFERRAL: {
        GOALS: [10, 25, 50, 100],
        REWARDS: {
            10: 250000,
            25: 1000000,
            50: 5000000,
            100: 25000000
        }
    }
};

// ============================================================================
// MAIN APPLICATION CLASS
// ============================================================================
class AlienMuskApp {
    constructor() {
        this.initialized = false;
        this.timers = {};
        this.currentPlan = null;
        
        // Initialize immediately
        this.initialize();
    }
    
    // ============================================================================
    // INITIALIZATION
    // ============================================================================
    async initialize() {
        try {
            console.group('🚀 Alien Musk App Initialization');
            
            // Show loading state
            this.showLoading();
            
            // Initialize core systems
            await this.initializeCore();
            
            // Initialize UI
            await this.initializeUI();
            
            // Start background services
            this.startServices();
            
            // Hide loading and show app
            setTimeout(() => {
                this.hideLoading();
                this.initialized = true;
                this.showWelcome();
                
                console.log('✅ Application initialized successfully');
                console.groupEnd();
            }, 800);
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showError('Failed to initialize application');
            this.hideLoading();
        }
    }
    
    async initializeCore() {
        // Initialize application state
        this.state = {
            user: this.getUserData(),
            mining: this.getMiningState(),
            staking: this.getStakingState(),
            wallet: this.getWalletState(),
            referral: this.getReferralState()
        };
        
        console.log('💾 Core state initialized:', this.state);
    }
    
    async initializeUI() {
        // Cache DOM elements
        this.elements = this.cacheElements();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize UI components
        this.initializeComponents();
        
        // Render initial state
        this.render();
        
        console.log('🎨 UI initialized successfully');
    }
    
    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================
    getUserData() {
        return {
            id: 'ALIEN001',
            name: 'Alien',
            username: 'alien_musk',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alien',
            joined: new Date().toISOString()
        };
    }
    
    getMiningState() {
        return {
            level: 1,
            active: true,
            nextReward: Date.now() + CONFIG.MINING.LEVELS[1].duration,
            minedToday: 2500,
            totalMined: 2500,
            lastClaim: Date.now(),
            efficiency: 1.0
        };
    }
    
    getStakingState() {
        return {
            active: [],
            completed: [],
            totalEarned: 0,
            totalStaked: 0
        };
    }
    
    getWalletState() {
        return {
            balances: {
                AMSK: 2500,
                USDT: 100.00,
                BNB: 0.00
            },
            addresses: {
                USDT: '0x6870fA28376C86974f1Dc8F469d58D10d2EA4F58',
                BNB: '0x6870fA28376C86974f1Dc8F469d58D10d2EA4F58'
            },
            transactions: []
        };
    }
    
    getReferralState() {
        return {
            code: 'ALIEN-M7B9X2',
            total: 0,
            active: [],
            earned: 0,
            claimed: []
        };
    }
    
    // ============================================================================
    // DOM MANAGEMENT
    // ============================================================================
    cacheElements() {
        const elements = {};
        
        // Cache by category for better organization
        const categories = {
            navigation: ['nav-buttons', 'tab-contents'],
            header: ['header-balance', 'user-avatar', 'notification-count'],
            home: [
                'welcome-text', 'user-id', 'total-amsk', 'usd-equivalent',
                'current-hashrate', 'mining-timer', 'next-reward', 'start-mining',
                'mined-today', 'total-mined', 'staking-earned', 'mining-level'
            ],
            referral: [
                'ref-count', 'total-refs', 'ref-earned', 'next-goal',
                'progress-text', 'progress-fill', 'goal-reward', 'ref-code'
            ],
            wallet: [
                'wallet-total-amsk', 'wallet-total-usd', 'wallet-amsk',
                'wallet-amsk-value', 'wallet-usdt', 'wallet-usdt-value'
            ],
            modals: ['modal-overlay', 'deposit-modal', 'withdraw-modal', 'swap-modal', 'stake-modal']
        };
        
        // Cache all elements
        Object.values(categories).flat().forEach(id => {
            elements[id] = document.getElementById(id);
        });
        
        // Cache element groups
        elements.navButtons = document.querySelectorAll('.nav-btn');
        elements.tabContents = document.querySelectorAll('.tab-content');
        elements.levelCards = document.querySelectorAll('.level-card');
        elements.stakeButtons = document.querySelectorAll('.stake-btn');
        elements.quickButtons = document.querySelectorAll('.quick-btn');
        elements.modalClosers = document.querySelectorAll('.close-modal');
        
        return elements;
    }
    
    setupEventListeners() {
        console.log('🔗 Setting up event listeners...');
        
        // Navigation
        this.elements.navButtons?.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // Mining Actions
        this.elements['start-mining']?.addEventListener('click', () => this.handleMining());
        
        // Level Upgrades
        this.elements.levelCards?.forEach(card => {
            const btn = card.querySelector('.upgrade-btn:not(.active-btn)');
            btn?.addEventListener('click', () => this.upgradeMining(card.dataset.level));
        });
        
        // Referral Actions
        document.getElementById('copy-ref-code')?.addEventListener('click', () => this.copyReferralCode());
        document.getElementById('share-ref')?.addEventListener('click', () => this.shareReferralLink());
        
        // Staking Actions
        this.elements.stakeButtons?.forEach(btn => {
            btn.addEventListener('click', (e) => this.openStakeModal(e.target.dataset.plan));
        });
        
        // Quick Actions
        this.elements.quickButtons?.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickAction(e.target.dataset.action));
        });
        
        // Modal Controls
        this.elements.modalClosers?.forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        this.elements['modal-overlay']?.addEventListener('click', () => this.closeModal());
        
        // Calculator
        document.getElementById('calc-amount')?.addEventListener('input', () => this.updateCalculator());
        document.getElementById('calc-duration')?.addEventListener('change', () => this.updateCalculator());
        
        console.log('✅ Event listeners setup complete');
    }
    
    initializeComponents() {
        // Set user information
        this.elements['welcome-text'].textContent = `Welcome, ${this.state.user.name}!`;
        this.elements['user-id'].textContent = this.state.user.id;
        this.elements['user-avatar'].src = this.state.user.avatar;
        this.elements['ref-code'].textContent = this.state.referral.code;
    }
    
    // ============================================================================
    // RENDER ENGINE
    // ============================================================================
    render() {
        this.renderHeader();
        this.renderHomeTab();
        this.renderStakingTab();
        this.renderWalletTab();
        this.renderMiningTimer();
    }
    
    renderHeader() {
        const totalValue = this.calculateTotalPortfolio();
        this.elements['header-balance'].textContent = `$${this.formatNumber(totalValue, 2)}`;
    }
    
    renderHomeTab() {
        const { mining, wallet, staking, referral } = this.state;
        const level = CONFIG.MINING.LEVELS[mining.level];
        
        // Balance
        this.elements['total-amsk'].textContent = this.formatNumber(wallet.balances.AMSK);
        this.elements['usd-equivalent'].textContent = this.formatNumber(
            wallet.balances.AMSK * CONFIG.TOKEN.PRICE, 2
        );
        
        // Mining Info
        this.elements['current-hashrate'].textContent = level.hashrate;
        this.elements['next-reward'].textContent = `${this.formatNumber(level.reward)} AMSK`;
        
        // Statistics
        this.elements['mined-today'].textContent = this.formatNumber(mining.minedToday);
        this.elements['total-mined'].textContent = this.formatNumber(mining.totalMined);
        this.elements['staking-earned'].textContent = this.formatNumber(staking.totalEarned);
        this.elements['mining-level'].textContent = mining.level;
        
        // Referral Info
        this.elements['ref-count'].textContent = referral.total;
        this.elements['total-refs'].textContent = referral.total;
        this.elements['ref-earned'].textContent = `${this.formatNumber(referral.earned)} AMSK`;
        
        // Update referral progress
        this.updateReferralProgress();
        
        // Update mining button state
        this.updateMiningButton();
        
        // Update mining levels
        this.updateMiningLevels();
    }
    
    renderStakingTab() {
        this.updateStakesList();
        this.updateCalculator();
    }
    
    renderWalletTab() {
        const { wallet } = this.state;
        
        // Total Portfolio
        this.elements['wallet-total-amsk'].textContent = this.formatNumber(wallet.balances.AMSK);
        this.elements['wallet-total-usd'].textContent = this.formatNumber(
            wallet.balances.AMSK * CONFIG.TOKEN.PRICE, 2
        );
        
        // AMSK Balance
        this.elements['wallet-amsk'].textContent = this.formatNumber(wallet.balances.AMSK);
        this.elements['wallet-amsk-value'].textContent = this.formatNumber(
            wallet.balances.AMSK * CONFIG.TOKEN.PRICE, 2
        );
        
        // USDT Balance
        this.elements['wallet-usdt'].textContent = this.formatNumber(wallet.balances.USDT, 2);
        this.elements['wallet-usdt-value'].textContent = this.formatNumber(wallet.balances.USDT, 2);
    }
    
    // ============================================================================
    // MINING SYSTEM
    // ============================================================================
    handleMining() {
        if (!this.state.mining.active) {
            this.startMining();
        } else if (Date.now() >= this.state.mining.nextReward) {
            this.claimMiningReward();
        } else {
            this.showNotification('⏳ Mining in progress...', 'info');
        }
    }
    
    startMining() {
        this.state.mining.active = true;
        this.state.mining.nextReward = Date.now() + CONFIG.MINING.LEVELS[this.state.mining.level].duration;
        
        this.render();
        this.saveState();
        this.showNotification('⛏️ Mining started successfully!', 'success');
    }
    
    claimMiningReward() {
        const level = CONFIG.MINING.LEVELS[this.state.mining.level];
        const reward = level.reward;
        
        // Update balances
        this.state.wallet.balances.AMSK += reward;
        this.state.mining.minedToday += reward;
        this.state.mining.totalMined += reward;
        this.state.mining.lastClaim = Date.now();
        
        // Reset timer
        this.state.mining.nextReward = Date.now() + level.duration;
        
        this.render();
        this.saveState();
        this.showNotification(`💰 Claimed ${this.formatNumber(reward)} AMSK!`, 'success');
    }
    
    upgradeMining(targetLevel) {
        targetLevel = parseInt(targetLevel);
        const currentLevel = this.state.mining.level;
        const targetData = CONFIG.MINING.LEVELS[targetLevel];
        
        // Validations
        if (targetLevel <= currentLevel) {
            this.showNotification('⚠️ Already at or above this level', 'warning');
            return;
        }
        
        if (this.state.wallet.balances.USDT < targetData.cost) {
            this.showNotification(`❌ Need ${targetData.cost} USDT to upgrade`, 'error');
            return;
        }
        
        // Process upgrade
        this.state.wallet.balances.USDT -= targetData.cost;
        this.state.mining.level = targetLevel;
        
        this.render();
        this.saveState();
        this.showNotification(`⚡ Upgraded to ${targetData.name}!`, 'success');
    }
    
    updateMiningButton() {
        const btn = this.elements['start-mining'];
        if (!btn) return;
        
        if (!this.state.mining.active) {
            btn.innerHTML = '<i class="fas fa-play"></i><span>Start Mining</span>';
            btn.disabled = false;
        } else if (Date.now() >= this.state.mining.nextReward) {
            btn.innerHTML = '<i class="fas fa-gift"></i><span>Claim Reward</span>';
            btn.disabled = false;
        } else {
            btn.innerHTML = '<i class="fas fa-clock"></i><span>Mining...</span>';
            btn.disabled = true;
        }
    }
    
    updateMiningLevels() {
        this.elements.levelCards?.forEach(card => {
            const level = parseInt(card.dataset.level);
            const levelData = CONFIG.MINING.LEVELS[level];
            const isCurrent = level === this.state.mining.level;
            const canAfford = this.state.wallet.balances.USDT >= levelData.cost;
            
            const btn = card.querySelector('.upgrade-btn');
            if (!btn) return;
            
            if (isCurrent) {
                btn.textContent = 'Active';
                btn.disabled = true;
                btn.classList.add('active-btn');
                card.classList.add('active-level');
            } else if (level < this.state.mining.level) {
                btn.textContent = 'Upgraded';
                btn.disabled = true;
                btn.classList.add('active-btn');
            } else {
                btn.textContent = canAfford ? 'Upgrade' : `${levelData.cost} USDT`;
                btn.disabled = !canAfford;
                card.classList.remove('active-level');
            }
        });
    }
    
    // ============================================================================
    // STAKING SYSTEM
    // ============================================================================
    openStakeModal(planId) {
        const plan = CONFIG.STAKING.PLANS[planId];
        if (!plan) return;
        
        this.currentPlan = plan;
        
        // Update modal content
        const planDisplay = document.getElementById('stake-plan-display');
        if (planDisplay) {
            planDisplay.innerHTML = `
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
            `;
        }
        
        // Update preview
        document.getElementById('available-usdt').textContent = 
            this.formatNumber(this.state.wallet.balances.USDT, 2);
        document.getElementById('stake-duration').textContent = `${plan.duration} Days`;
        document.getElementById('stake-apr').textContent = `${plan.apr}%`;
        document.getElementById('stake-daily').textContent = `${plan.dailyReward} AMSK`;
        document.getElementById('stake-total').textContent = 
            `${this.formatNumber(plan.dailyReward * plan.duration)} AMSK`;
        
        // Set amount input
        const amountInput = document.getElementById('stake-amount');
        if (amountInput) {
            amountInput.value = plan.amount;
            amountInput.min = plan.amount;
        }
        
        this.openModal('stake-modal');
    }
    
    updateStakesList() {
        const container = document.getElementById('active-stakes-list');
        if (!container) return;
        
        if (this.state.staking.active.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No active stakes</p>
                </div>
            `;
            return;
        }
        
        // Render stakes list
        container.innerHTML = this.state.staking.active.map(stake => `
            <div class="stake-item">
                <div class="stake-header">
                    <div class="stake-name">${stake.plan.name} Plan</div>
                    <div class="stake-amount">${this.formatNumber(stake.amount, 2)} USDT</div>
                </div>
                <div class="stake-details">
                    <div class="detail">
                        <span>Started:</span>
                        <span>${new Date(stake.startTime).toLocaleDateString()}</span>
                    </div>
                    <div class="detail">
                        <span>Ends:</span>
                        <span>${new Date(stake.endTime).toLocaleDateString()}</span>
                    </div>
                    <div class="detail">
                        <span>Earned:</span>
                        <span>${this.formatNumber(stake.earned)} AMSK</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    updateCalculator() {
        const amount = parseFloat(document.getElementById('calc-amount')?.value) || 10;
        const duration = parseInt(document.getElementById('calc-duration')?.value) || 30;
        
        // Find appropriate plan
        let plan = CONFIG.STAKING.PLANS[1];
        if (amount >= 100) plan = CONFIG.STAKING.PLANS[3];
        else if (amount >= 50) plan = CONFIG.STAKING.PLANS[2];
        
        const dailyReward = (amount / plan.amount) * plan.dailyReward;
        const totalReward = dailyReward * duration;
        
        document.getElementById('calc-daily').textContent = `${this.formatNumber(dailyReward)} AMSK`;
        document.getElementById('calc-total').textContent = `${this.formatNumber(totalReward)} AMSK`;
        document.getElementById('calc-apr').textContent = `${plan.apr}%`;
    }
    
    // ============================================================================
    // WALLET SYSTEM
    // ============================================================================
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
                this.showNotification('📊 Transaction history coming soon!', 'info');
                break;
        }
    }
    
    openDepositModal() {
        this.openModal('deposit-modal');
    }
    
    openWithdrawModal() {
        document.getElementById('withdraw-balance').textContent = 
            this.formatNumber(this.state.wallet.balances.USDT, 2);
        this.openModal('withdraw-modal');
    }
    
    openSwapModal() {
        document.getElementById('swap-from-balance').textContent = 
            this.formatNumber(this.state.wallet.balances.AMSK);
        document.getElementById('swap-to-balance').textContent = 
            this.formatNumber(this.state.wallet.balances.USDT, 2);
        this.openModal('swap-modal');
    }
    
    // ============================================================================
    // REFERRAL SYSTEM
    // ============================================================================
    copyReferralCode() {
        navigator.clipboard.writeText(this.state.referral.code)
            .then(() => this.showNotification('📋 Referral code copied!', 'success'))
            .catch(() => this.showNotification('Failed to copy', 'error'));
    }
    
    shareReferralLink() {
        const message = `🚀 Join Alien Musk - Earn 2,500 AMSK/hour!\n\nUse my code: ${this.state.referral.code}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Alien Musk - Quantum Mining',
                text: message
            });
        } else {
            navigator.clipboard.writeText(message);
            this.showNotification('📤 Link copied! Share with friends.', 'info');
        }
    }
    
    updateReferralProgress() {
        const progress = (this.state.referral.total / 10) * 100;
        const progressFill = this.elements['progress-fill'];
        const progressText = this.elements['progress-text'];
        
        if (progressFill) progressFill.style.width = `${Math.min(progress, 100)}%`;
        if (progressText) progressText.textContent = `${Math.min(Math.round(progress), 100)}%`;
    }
    
    // ============================================================================
    // NAVIGATION & MODALS
    // ============================================================================
    handleNavigation(event) {
        event.preventDefault();
        const tab = event.currentTarget.dataset.tab;
        
        // Update navigation
        this.elements.navButtons?.forEach(btn => btn.classList.remove('active'));
        event.currentTarget.classList.add('active');
        
        // Update content
        this.elements.tabContents?.forEach(content => content.classList.remove('active'));
        document.getElementById(`${tab}-tab`)?.classList.add('active');
        
        // Update tab-specific content
        switch (tab) {
            case 'home':
                this.renderHomeTab();
                break;
            case 'staking':
                this.renderStakingTab();
                break;
            case 'wallet':
                this.renderWalletTab();
                break;
        }
    }
    
    openModal(modalId) {
        this.elements['modal-overlay']?.classList.add('active');
        document.getElementById(modalId)?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.elements['modal-overlay']?.classList.remove('active');
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
    
    // ============================================================================
    // SERVICES & TIMERS
    // ============================================================================
    startServices() {
        // Mining timer
        this.timers.mining = setInterval(() => this.updateMiningTimer(), 1000);
        
        // Auto-save every 30 seconds
        this.timers.autosave = setInterval(() => this.saveState(), 30000);
        
        // Background updates
        this.timers.background = setInterval(() => this.backgroundUpdate(), 5000);
    }
    
    updateMiningTimer() {
        const timerElement = this.elements['mining-timer'];
        if (!timerElement || !this.state.mining.active) return;
        
        const now = Date.now();
        const timeLeft = this.state.mining.nextReward - now;
        
        if (timeLeft <= 0) {
            timerElement.textContent = 'READY!';
            timerElement.style.color = '#00D4AA';
            this.updateMiningButton();
            return;
        }
        
        const hours = Math.floor(timeLeft / 3600000);
        const minutes = Math.floor((timeLeft % 3600000) / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        
        timerElement.textContent = 
            `${hours.toString().padStart(2, '0')}:` +
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}`;
        
        timerElement.style.color = '#FFFFFF';
    }
    
    backgroundUpdate() {
        // Update mining button if reward is ready
        if (this.state.mining.active && Date.now() >= this.state.mining.nextReward) {
            this.updateMiningButton();
        }
    }
    
    // ============================================================================
    // UTILITIES
    // ============================================================================
    calculateTotalPortfolio() {
        const { wallet } = this.state;
        return (wallet.balances.AMSK * CONFIG.TOKEN.PRICE) + wallet.balances.USDT;
    }
    
    formatNumber(num, decimals = 0) {
        if (typeof num !== 'number' || isNaN(num)) return '0';
        return num.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }
    
    saveState() {
        try {
            localStorage.setItem('alien_musk_state', JSON.stringify(this.state));
        } catch (error) {
            console.warn('Could not save state:', error);
        }
    }
    
    loadState() {
        try {
            const saved = localStorage.getItem('alien_musk_state');
            if (saved) {
                this.state = JSON.parse(saved);
                this.render();
            }
        } catch (error) {
            console.warn('Could not load state:', error);
        }
    }
    
    showLoading() {
        document.getElementById('loading-spinner')?.classList.add('active');
    }
    
    hideLoading() {
        document.getElementById('loading-spinner')?.classList.remove('active');
    }
    
    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-center');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            </div>
            <div class="notification-content">${message}</div>
        `;
        
        container.appendChild(notification);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    showWelcome() {
        this.showNotification('🚀 Welcome to Alien Musk! Start mining now!', 'success');
    }
    
    showError(message) {
        this.showNotification(`❌ ${message}`, 'error');
    }
}

// ============================================================================
// APPLICATION BOOTSTRAP
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance
    window.AlienMusk = new AlienMuskApp();
    
    // Force UI update after full load
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (window.AlienMusk && window.AlienMusk.initialized) {
                window.AlienMusk.render();
            }
        }, 1000);
    });
    
    console.log('👽 Alien Musk Platform is ready!');
});

// ============================================================================
// GLOBAL HELPER FUNCTIONS
// ============================================================================
window.formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

window.copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
        .then(() => console.log('Copied to clipboard:', text))
        .catch(err => console.error('Copy failed:', err));
};

/* ===========================================
   END OF ALIEN MUSK APPLICATION
   =========================================== */

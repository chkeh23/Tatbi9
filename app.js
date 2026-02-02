// Alien Mask - Professional Crypto Mining App
// Main Application Logic

class AlienMaskApp {
    constructor() {
        this.init();
    }

    async init() {
        console.log('👽 Alien Mask App Initializing...');
        
        // Initialize Telegram WebApp
        this.tg = window.Telegram.WebApp;
        this.tg.expand();
        this.tg.enableClosingConfirmation();
        
        // App State
        this.state = {
            user: this.getUserData(),
            mining: {
                power: 100,
                baseReward: 5000,
                nextReward: Date.now() + (4 * 60 * 60 * 1000),
                isActive: false,
                minedToday: 0,
                totalMined: 0,
                boosters: []
            },
            balance: {
                amsk: 0,
                usdt: 0,
                bnb: 0,
                ton: 0
            },
            staking: {
                activeStakes: [],
                plans: this.getStakingPlans()
            },
            referral: {
                code: this.generateReferralCode(),
                totalRefs: 0,
                earnings: 0
            },
            admin: {
                isLoggedIn: false,
                secret: 'Tnru97'
            }
        };

        // DOM Elements
        this.elements = this.cacheDOM();
        
        // Initialize Firebase
        await this.initFirebase();
        
        // Setup Event Listeners
        this.setupEventListeners();
        
        // Start Mining Timer
        this.startMiningTimer();
        
        // Load User Data
        await this.loadUserData();
        
        // Update UI
        this.updateUI();
        
        // Welcome Notification
        this.showNotification('Welcome to Alien Mask Mining! 👽', 'success');
    }

    getUserData() {
        const user = this.tg.initDataUnsafe.user;
        return {
            id: user?.id || 1653918641,
            username: user?.username || 'alien_miner',
            firstName: user?.first_name || 'Alien',
            lastName: user?.last_name || 'Miner',
            photoUrl: user?.photo_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=alien'
        };
    }

    cacheDOM() {
        return {
            // User Info
            username: document.getElementById('username'),
            userId: document.getElementById('user-id'),
            
            // Balance
            totalBalance: document.getElementById('total-balance'),
            usdEquivalent: document.getElementById('usd-equivalent'),
            
            // Mining
            miningPower: document.getElementById('mining-power'),
            minedToday: document.getElementById('mined-today'),
            totalMined: document.getElementById('total-mined'),
            mineBtn: document.getElementById('mine-btn'),
            miningTimer: document.getElementById('mining-timer'),
            claimReward: document.getElementById('claim-reward'),
            
            // Boosters
            buyBoosters: document.querySelectorAll('.buy-booster'),
            
            // Referral
            referralCode: document.getElementById('referral-code'),
            copyCode: document.getElementById('copy-code'),
            totalRefs: document.getElementById('total-refs'),
            refEarnings: document.getElementById('ref-earnings'),
            
            // Tabs
            tabBtns: document.querySelectorAll('.tab-btn'),
            tabContents: document.querySelectorAll('.tab-content'),
            
            // Staking
            stakeBtns: document.querySelectorAll('.stake-btn'),
            
            // Wallet
            amskBalance: document.getElementById('amsk-balance'),
            amskValue: document.getElementById('amsk-value'),
            usdtBalance: document.getElementById('usdt-balance'),
            usdtValue: document.getElementById('usdt-value'),
            
            // Deposit Modal
            depositModal: document.getElementById('deposit-modal'),
            depositAddress: document.getElementById('deposit-address'),
            copyAddress: document.querySelector('.copy-address'),
            
            // Buttons
            refreshBtn: document.querySelector('.refresh-btn'),
            shareBtn: document.querySelector('.share-btn'),
            
            // Admin
            adminPanel: document.getElementById('admin-panel')
        };
    }

    async initFirebase() {
        try {
            if (typeof firebase !== 'undefined') {
                this.db = firebase.firestore();
                console.log('Firebase initialized');
            } else {
                console.warn('Firebase not available, using local storage');
                this.useLocalStorage = true;
            }
        } catch (error) {
            console.error('Firebase initialization error:', error);
            this.useLocalStorage = true;
        }
    }

    setupEventListeners() {
        // Tab Navigation
        this.elements.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Mining Button
        this.elements.mineBtn.addEventListener('click', () => this.handleMiningClick());

        // Claim Reward Button
        this.elements.claimReward.addEventListener('click', () => this.claimMiningReward());

        // Boosters
        this.elements.buyBoosters.forEach(btn => {
            btn.addEventListener('click', (e) => this.buyBooster(e.target.closest('.booster-card')));
        });

        // Copy Referral Code
        this.elements.copyCode.addEventListener('click', () => this.copyToClipboard(this.state.referral.code));

        // Share Button
        this.elements.shareBtn.addEventListener('click', () => this.shareReferralLink());

        // Refresh Button
        this.elements.refreshBtn.addEventListener('click', () => this.refreshData());

        // Staking Buttons
        this.elements.stakeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.openStakingModal(e.target.dataset.plan));
        });

        // Admin Access (10 clicks on logo)
        let adminClickCount = 0;
        let lastClickTime = 0;
        document.querySelector('.logo').addEventListener('click', (e) => {
            const now = Date.now();
            if (now - lastClickTime > 2000) adminClickCount = 0;
            
            lastClickTime = now;
            adminClickCount++;
            
            if (adminClickCount >= 10) {
                this.showAdminLogin();
                adminClickCount = 0;
            }
        });

        // Copy Deposit Address
        this.elements.copyAddress?.addEventListener('click', () => 
            this.copyToClipboard(this.elements.depositAddress.textContent));
    }

    async loadUserData() {
        if (this.useLocalStorage) {
            // Load from localStorage
            const savedData = localStorage.getItem('alien_mask_user');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.state = { ...this.state, ...data };
            }
        } else {
            // Load from Firebase
            try {
                const doc = await this.db.collection('users').doc(this.state.user.id.toString()).get();
                if (doc.exists) {
                    const data = doc.data();
                    this.state = { ...this.state, ...data };
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        }
    }

    async saveUserData() {
        if (this.useLocalStorage) {
            localStorage.setItem('alien_mask_user', JSON.stringify(this.state));
        } else {
            try {
                await this.db.collection('users').doc(this.state.user.id.toString()).set(this.state, { merge: true });
            } catch (error) {
                console.error('Error saving user data:', error);
            }
        }
    }

    updateUI() {
        // User Info
        this.elements.username.textContent = `@${this.state.user.username}`;
        this.elements.userId.textContent = this.state.user.id;

        // Balance
        const totalAMSK = this.state.balance.amsk + this.state.mining.minedToday;
        this.elements.totalBalance.textContent = this.formatNumber(totalAMSK);
        this.elements.usdEquivalent.textContent = (totalAMSK * 0.0002).toFixed(2);

        // Mining Stats
        this.elements.miningPower.textContent = this.calculateTotalPower();
        this.elements.minedToday.textContent = this.formatNumber(this.state.mining.minedToday);
        this.elements.totalMined.textContent = this.formatNumber(this.state.mining.totalMined);

        // Referral
        this.elements.referralCode.textContent = this.state.referral.code;
        this.elements.totalRefs.textContent = this.state.referral.totalRefs;
        this.elements.refEarnings.textContent = this.formatNumber(this.state.referral.earnings);

        // Wallet Balances
        this.elements.amskBalance.textContent = this.formatNumber(this.state.balance.amsk);
        this.elements.amskValue.textContent = (this.state.balance.amsk * 0.0002).toFixed(2);
        this.elements.usdtBalance.textContent = this.state.balance.usdt.toFixed(2);
        this.elements.usdtValue.textContent = this.state.balance.usdt.toFixed(2);
    }

    switchTab(tabName) {
        // Update active tab button
        this.elements.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Show selected tab content
        this.elements.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });

        // Special initialization for each tab
        if (tabName === 'staking') {
            this.loadStakingPlans();
        } else if (tabName === 'wallet') {
            this.loadTransactionHistory();
        }
    }

    handleMiningClick() {
        // Calculate mined amount
        const minedAmount = this.calculateClickReward();
        this.state.mining.minedToday += minedAmount;
        
        // Update UI
        this.updateUI();
        
        // Save data
        this.saveUserData();
        
        // Show visual feedback
        this.showMiningEffect(minedAmount);
        
        // Play sound
        this.playSound('click');
    }

    calculateClickReward() {
        const baseReward = 1;
        const powerMultiplier = this.calculateTotalPower() / 100;
        const boosterMultiplier = this.calculateBoosterMultiplier();
        
        return Math.round(baseReward * powerMultiplier * boosterMultiplier);
    }

    calculateTotalPower() {
        let power = this.state.mining.power;
        
        // Apply booster multipliers
        this.state.mining.boosters.forEach(booster => {
            power *= booster.multiplier;
        });
        
        return Math.round(power);
    }

    calculateBoosterMultiplier() {
        let multiplier = 1;
        this.state.mining.boosters.forEach(booster => {
            multiplier *= booster.multiplier;
        });
        return multiplier;
    }

    startMiningTimer() {
        setInterval(() => {
            const now = Date.now();
            const timeLeft = this.state.mining.nextReward - now;
            
            if (timeLeft <= 0) {
                // Reward is ready
                this.elements.claimReward.disabled = false;
                this.elements.miningTimer.textContent = 'READY!';
                this.elements.miningTimer.style.color = '#00D4AA';
            } else {
                // Update timer display
                const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                
                this.elements.miningTimer.textContent = 
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    claimMiningReward() {
        if (this.elements.claimReward.disabled) return;
        
        const reward = this.state.mining.baseReward * (this.calculateTotalPower() / 100);
        this.state.balance.amsk += reward;
        this.state.mining.totalMined += reward;
        
        // Reset timer for next 4 hours
        this.state.mining.nextReward = Date.now() + (4 * 60 * 60 * 1000);
        this.elements.claimReward.disabled = true;
        this.elements.miningTimer.style.color = '#F8FAFC';
        
        // Update UI
        this.updateUI();
        this.saveUserData();
        
        // Show notification
        this.showNotification(`Claimed ${this.formatNumber(reward)} AMSK! 🎉`, 'success');
        this.playSound('success');
    }

    buyBooster(card) {
        const boostValue = parseFloat(card.dataset.boost);
        const priceText = card.querySelector('.booster-price span').textContent;
        const price = parseInt(priceText.replace(/,/g, ''));
        
        if (this.state.balance.amsk < price) {
            this.showNotification('Insufficient AMSK balance!', 'error');
            return;
        }
        
        // Deduct price
        this.state.balance.amsk -= price;
        
        // Add booster
        this.state.mining.boosters.push({
            id: this.state.mining.boosters.length + 1,
            multiplier: boostValue,
            purchasedAt: Date.now(),
            duration: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        // Update UI
        this.updateUI();
        this.saveUserData();
        
        // Show notification
        this.showNotification(`Booster activated! +${(boostValue - 1) * 100}% mining power`, 'success');
        this.playSound('success');
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => this.showNotification('Copied to clipboard! ✅', 'success'))
            .catch(() => this.showNotification('Failed to copy', 'error'));
    }

    shareReferralLink() {
        const link = `t.me/AlienMuskbot/Musk?start=ref-${this.state.referral.code}`;
        const message = `Join Alien Mask Mining and earn free AMSK tokens! Use my referral code: ${this.state.referral.code}\n\n${link}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Alien Mask Mining',
                text: message,
                url: link
            });
        } else {
            this.copyToClipboard(message);
            this.showNotification('Referral link copied! Share it with friends.', 'info');
        }
    }

    refreshData() {
        this.updateUI();
        this.showNotification('Data refreshed! 🔄', 'info');
        
        // Animation
        this.elements.refreshBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.elements.refreshBtn.style.transform = 'rotate(0deg)';
        }, 300);
    }

    openStakingModal(planId) {
        this.showNotification(`Opening ${planId} staking plan...`, 'info');
        // Implement staking modal logic
    }

    showAdminLogin() {
        const password = prompt('Enter admin password:');
        
        if (password === this.state.admin.secret && this.state.user.id === 1653918641) {
            this.state.admin.isLoggedIn = true;
            this.showAdminPanel();
            this.showNotification('Welcome, Admin! 👑', 'success');
        } else {
            this.showNotification('Access denied! ❌', 'error');
        }
    }

    showAdminPanel() {
        // Create admin panel content
        const adminHTML = `
            <div class="admin-panel-content">
                <h2><i class="fas fa-user-shield"></i> Admin Dashboard</h2>
                
                <div class="admin-section">
                    <h3><i class="fas fa-download"></i> Pending Deposits</h3>
                    <div id="pending-deposits">Loading...</div>
                </div>
                
                <div class="admin-section">
                    <h3><i class="fas fa-upload"></i> Pending Withdrawals</h3>
                    <div id="pending-withdrawals">Loading...</div>
                </div>
                
                <div class="admin-section">
                    <h3><i class="fas fa-users-cog"></i> User Management</h3>
                    <input type="text" placeholder="Search user..." id="user-search">
                    <button id="add-balance">Add Balance</button>
                </div>
                
                <button id="close-admin" class="close-btn">Close</button>
            </div>
        `;
        
        this.elements.adminPanel.innerHTML = adminHTML;
        this.elements.adminPanel.style.display = 'block';
        
        // Close button
        document.getElementById('close-admin').addEventListener('click', () => {
            this.elements.adminPanel.style.display = 'none';
        });
    }

    showMiningEffect(amount) {
        const effect = document.createElement('div');
        effect.className = 'mining-effect';
        effect.textContent = `+${this.formatNumber(amount)} AMSK`;
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #00D4AA;
            font-weight: bold;
            font-size: 24px;
            pointer-events: none;
            z-index: 1000;
            text-shadow: 0 0 10px #00D4AA;
            animation: miningFloat 1s ease-out forwards;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            document.body.removeChild(effect);
        }, 1000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                ${message}
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 2000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#6C63FF'
        };
        return colors[type] || colors.info;
    }

    playSound(type) {
        // Implement sound effects
        console.log(`Playing ${type} sound`);
    }

    formatNumber(num) {
        return num.toLocaleString('en-US');
    }

    generateReferralCode() {
        return `ALIEN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    }

    getStakingPlans() {
        return {
            weekly: [
                { id: 'weekly-10', amount: 10, reward: 5000, duration: 7 },
                { id: 'weekly-50', amount: 50, reward: 25000, duration: 7 },
                { id: 'weekly-100', amount: 100, reward: 50000, duration: 7 }
            ],
            monthly: [
                { id: 'monthly-100', amount: 100, reward: 100000, duration: 30 },
                { id: 'monthly-500', amount: 500, reward: 500000, duration: 30 },
                { id: 'monthly-1000', amount: 1000, reward: 1000000, duration: 30 }
            ],
            '90-day': [
                { id: '90day-500', amount: 500, reward: 2500000, duration: 90 },
                { id: '90day-1000', amount: 1000, reward: 5000000, duration: 90 },
                { id: '90day-5000', amount: 5000, reward: 25000000, duration: 90 }
            ]
        };
    }

    loadStakingPlans() {
        // Implement staking plans loading
    }

    loadTransactionHistory() {
        // Implement transaction history loading
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes miningFloat {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -100px) scale(0.5); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.alienMaskApp = new AlienMaskApp();
});

/* ===========================================
   ALIEN MUSK - Ultimate Quantum Mining Platform
   Main Application JavaScript
   Version: 4.0.0
   =========================================== */

// App Configuration
const APP_CONFIG = {
    // Token Prices
    AMSK_PRICE: 0.0002,
    BNB_PRICE: 300,
    TON_PRICE: 2,
    
    // Mining Configuration
    MINING_LEVELS: {
        1: { name: "مبتدئ", cost: 0, reward: 2500, hashrate: 2500, duration: 3600000 },
        2: { name: "متقدم", cost: 5, reward: 5000, hashrate: 5000, duration: 3600000 },
        3: { name: "محترف", cost: 20, reward: 10000, hashrate: 10000, duration: 3600000 },
        4: { name: "خبير", cost: 100, reward: 25000, hashrate: 25000, duration: 3600000 }
    },
    
    // Booster Configuration
    BOOSTERS: {
        "2x": { multiplier: 2, duration: 24 * 60 * 60 * 1000, price: 10000 },
        "3x": { multiplier: 3, duration: 12 * 60 * 60 * 1000, price: 15000 },
        "5x": { multiplier: 5, duration: 6 * 60 * 60 * 1000, price: 25000 }
    },
    
    // Staking Plans
    STAKING_PLANS: {
        1: { name: "فضة", amount: 10, duration: 7, apr: 40, dailyReward: 40 },
        2: { name: "ذهب", amount: 50, duration: 15, apr: 50, dailyReward: 250 },
        3: { name: "ماس", amount: 100, duration: 30, apr: 60, dailyReward: 600 }
    },
    
    // Referral Rewards
    REFERRAL_REWARDS: {
        10: { reward: 250000, title: "10 محالين" },
        25: { reward: 1000000, title: "25 محالين" },
        50: { reward: 5000000, title: "50 محالين" },
        100: { reward: 25000000, title: "100 محالين" }
    },
    
    // Swap Rates
    SWAP_RATES: {
        AMSK_TO_USDT: 0.0002,
        USDT_TO_AMSK: 5000,
        BNB_TO_AMSK: 300000,
        TON_TO_AMSK: 2000
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
    
    // Deposit Addresses
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
        this.isInitialized = false;
        this.timers = {};
        this.currentPlan = null;
        this.currentBooster = null;
        this.init();
    }
    
    async init() {
        if (this.isInitialized) return;
        
        console.log('👽 جارٍ تنشيط منصة ALIEN MUSK...');
        this.showLoading();
        
        try {
            // Initialize Telegram WebApp
            await this.initTelegramWebApp();
            
            // Initialize State
            this.state = this.getInitialState();
            
            // Load saved state
            this.loadState();
            
            // Cache DOM Elements
            this.cacheDOM();
            
            // Initialize UI
            this.initUI();
            
            // Setup Event Listeners
            this.setupEventListeners();
            
            // Start Timers
            this.startTimers();
            
            // Setup Admin Access
            this.setupAdminAccess();
            
            this.isInitialized = true;
            
            // Hide loading after 1 second
            setTimeout(() => {
                this.hideLoading();
                this.showNotification('🚀 تم تنشيط المنصة الكمومية بنجاح!', 'success');
                console.log('✅ تم تهيئة التطبيق بنجاح');
            }, 1000);
            
        } catch (error) {
            console.error('❌ فشل تهيئة التطبيق:', error);
            this.showNotification('فشل تحميل التطبيق. يرجى تحديث الصفحة.', 'error');
            this.hideLoading();
        }
    }
    
    /* ===========================================
       INITIALIZATION METHODS
       =========================================== */
    
    async initTelegramWebApp() {
        return new Promise((resolve) => {
            if (window.Telegram?.WebApp) {
                this.tg = window.Telegram.WebApp;
                this.tg.expand();
                this.tg.enableClosingConfirmation();
                this.tg.ready();
                console.log('✅ تم تهيئة Telegram WebApp');
            } else {
                console.warn('⚠️ Telegram WebApp غير موجود، استخدام بيانات تجريبية');
                this.tg = {
                    initDataUnsafe: {
                        user: {
                            id: APP_CONFIG.ADMIN_USER_ID,
                            username: 'alien_musk_user',
                            first_name: 'Alien',
                            last_name: 'Musk',
                            photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alien'
                        }
                    },
                    expand: () => {},
                    ready: () => {},
                    enableClosingConfirmation: () => {}
                };
            }
            resolve();
        });
    }
    
    getInitialState() {
        const user = this.tg?.initDataUnsafe?.user || {};
        
        return {
            // User Info
            user: {
                id: user.id || Date.now().toString(),
                username: user.username || 'alien_user',
                firstName: user.first_name || 'Alien',
                lastName: user.last_name || 'Musk',
                photoUrl: user.photo_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=alien'
            },
            
            // Balances
            balances: {
                AMSK: 2500,
                USDT: 100.00,
                BNB: 0.5,
                TON: 50
            },
            
            // Mining
            mining: {
                level: 1,
                isActive: true,
                lastReward: Date.now(),
                nextReward: Date.now() + APP_CONFIG.MINING_LEVELS[1].duration,
                totalMined: 2500,
                minedToday: 2500,
                efficiency: 1.0,
                activeBoosters: []
            },
            
            // Staking
            staking: {
                activeStakes: [],
                completedStakes: [],
                totalEarned: 0,
                totalStaked: 0
            },
            
            // Referral
            referral: {
                code: 'ALIEN-M7B9X2',
                referrals: [],
                totalCount: 0,
                earned: 0,
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
        this.elements = {
            // Loading Screen
            loadingScreen: document.getElementById('loading-screen'),
            
            // Header Elements
            totalBalance: document.getElementById('total-balance'),
            notificationCount: document.getElementById('notification-count'),
            userAvatar: document.getElementById('user-avatar'),
            
            // Navigation
            navItems: document.querySelectorAll('.nav-item'),
            
            // Home Page
            homePage: document.getElementById('home-page'),
            welcomeText: document.getElementById('welcome-text'),
            userId: document.getElementById('user-id'),
            
            // Balance
            totalAmsk: document.getElementById('total-amsk'),
            usdEquivalent: document.getElementById('usd-equivalent'),
            
            // Mining
            currentHashrate: document.getElementById('current-hashrate'),
            miningTimer: document.getElementById('mining-timer'),
            nextReward: document.getElementById('next-reward'),
            startMiningBtn: document.getElementById('start-mining'),
            
            // Mining Stats
            minedToday: document.getElementById('mined-today'),
            totalMined: document.getElementById('total-mined'),
            stakingEarned: document.getElementById('staking-earned'),
            miningLevel: document.getElementById('mining-level'),
            
            // Upgrade Cards
            upgradeCards: document.querySelectorAll('.upgrade-card'),
            upgradeBtns: document.querySelectorAll('.upgrade-btn'),
            
            // Boosters
            boosterCards: document.querySelectorAll('.booster-card'),
            boosterBtns: document.querySelectorAll('.booster-btn'),
            
            // Referral
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
            
            // Other Pages
            miningPage: document.getElementById('mining-page'),
            stakingPage: document.getElementById('staking-page'),
            walletPage: document.getElementById('wallet-page'),
            
            // Modals
            modalOverlay: document.getElementById('modal-overlay'),
            depositModal: document.getElementById('deposit-modal'),
            withdrawModal: document.getElementById('withdraw-modal'),
            swapModal: document.getElementById('swap-modal'),
            stakeModal: document.getElementById('stake-modal'),
            boosterModal: document.getElementById('booster-modal'),
            closeModalBtns: document.querySelectorAll('.close-modal'),
            
            // Admin Panel
            adminPanel: document.getElementById('admin-panel'),
            
            // Notification Center
            notificationCenter: document.getElementById('notification-center')
        };
    }
    
    initUI() {
        // Set user information
        this.elements.welcomeText.textContent = `مرحبًا، ${this.state.user.firstName}!`;
        this.elements.userId.textContent = this.state.user.id.substring(0, 8);
        this.elements.userAvatar.src = this.state.user.photoUrl;
        
        // Update all UI components
        this.updateHeader();
        this.updateHomePage();
        
        // Show home page
        this.showPage('home');
    }
    
    /* ===========================================
       UI UPDATE METHODS
       =========================================== */
    
    updateHeader() {
        const totalBalance = this.calculateTotalBalance();
        this.elements.totalBalance.textContent = `$${this.formatNumber(totalBalance, 2)}`;
        
        // Update notification count
        const pendingCount = this.state.admin.pendingDeposits.length + 
                           this.state.admin.pendingWithdrawals.length;
        this.elements.notificationCount.textContent = pendingCount > 0 ? pendingCount : '';
    }
    
    updateHomePage() {
        // Update balance
        const totalAMSK = this.state.balances.AMSK;
        this.elements.totalAmsk.textContent = this.formatNumber(totalAMSK);
        this.elements.usdEquivalent.textContent = this.formatNumber(totalAMSK * APP_CONFIG.AMSK_PRICE, 2);
        
        // Update mining info
        const miningLevel = APP_CONFIG.MINING_LEVELS[this.state.mining.level];
        this.elements.currentHashrate.textContent = this.formatNumber(miningLevel.hashrate);
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
        
        // Update mining button
        this.updateMiningButton();
    }
    
    updateMiningLevels() {
        this.elements.upgradeCards.forEach(card => {
            const level = parseInt(card.dataset.level);
            const levelData = APP_CONFIG.MINING_LEVELS[level];
            const isCurrentLevel = level === this.state.mining.level;
            const canAfford = this.state.balances.USDT >= levelData.cost;
            
            const btn = card.querySelector('.upgrade-btn');
            if (isCurrentLevel) {
                btn.textContent = 'نشط';
                btn.classList.add('active-btn');
                btn.disabled = true;
                card.classList.add('active');
            } else if (level < this.state.mining.level) {
                btn.textContent = 'تم الترقية';
                btn.classList.add('active-btn');
                btn.disabled = true;
            } else {
                btn.textContent = canAfford ? 'ترقية' : `${levelData.cost} USDT`;
                btn.disabled = !canAfford;
                btn.classList.remove('active-btn');
                card.classList.remove('active');
            }
        });
    }
    
    updateMiningButton() {
        const btn = this.elements.startMiningBtn;
        
        if (!this.state.mining.isActive) {
            btn.innerHTML = '<i class="fas fa-play"></i><span>تشغيل المحرك الكمومي</span>';
            btn.disabled = false;
        } else if (Date.now() >= this.state.mining.nextReward) {
            btn.innerHTML = '<i class="fas fa-gift"></i><span>مطالبة بالمكافأة</span>';
            btn.disabled = false;
        } else {
            btn.innerHTML = '<i class="fas fa-clock"></i><span>جاري التعدين...</span>';
            btn.disabled = true;
        }
    }
    
    updateReferralInfo() {
        const refCount = this.state.referral.totalCount;
        this.elements.refCount.textContent = refCount;
        this.elements.totalRefs.textContent = refCount;
        this.elements.refEarned.textContent = `${this.formatNumber(this.state.referral.earned)} AMSK`;
        this.elements.refCode.textContent = this.state.referral.code;
        
        // Find next goal
        let nextGoal = 10;
        let goalReward = 250000;
        
        const goals = Object.keys(APP_CONFIG.REFERRAL_REWARDS).map(Number).sort((a, b) => a - b);
        for (const goal of goals) {
            if (refCount < goal) {
                nextGoal = goal;
                goalReward = APP_CONFIG.REFERRAL_REWARDS[goal].reward;
                break;
            }
        }
        
        // Update progress
        const progress = Math.min((refCount / nextGoal) * 100, 100);
        this.elements.nextGoal.textContent = `${nextGoal} محالين`;
        this.elements.progressText.textContent = `${Math.round(progress)}%`;
        this.elements.progressFill.style.width = `${progress}%`;
        this.elements.goalReward.textContent = `${this.formatNumber(goalReward)} AMSK`;
    }
    
    /* ===========================================
       PAGE NAVIGATION
       =========================================== */
    
    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Remove active class from all nav items
        this.elements.navItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Show selected page
        const pageElement = document.getElementById(`${pageName}-page`);
        if (pageElement) {
            pageElement.classList.add('active');
        }
        
        // Activate corresponding nav item
        const navItem = document.querySelector(`.nav-item[data-page="${pageName}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }
        
        // Update page content
        switch (pageName) {
            case 'home':
                this.updateHomePage();
                break;
            case 'mining':
                this.updateMiningPage();
                break;
            case 'staking':
                this.updateStakingPage();
                break;
            case 'wallet':
                this.updateWalletPage();
                break;
        }
    }
    
    updateMiningPage() {
        // سيتم إضافة محتوى صفحة التعدين هنا
        console.log('Updating mining page...');
    }
    
    updateStakingPage() {
        // سيتم إضافة محتوى صفحة الستيكينغ هنا
        console.log('Updating staking page...');
    }
    
    updateWalletPage() {
        // سيتم إضافة محتوى صفحة المحفظة هنا
        console.log('Updating wallet page...');
    }
    
    /* ===========================================
       EVENT LISTENERS SETUP
       =========================================== */
    
    setupEventListeners() {
        // Navigation
        this.elements.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.showPage(page);
            });
        });
        
        // Mining Actions
        this.elements.startMiningBtn.addEventListener('click', () => this.handleMining());
        
        // Level Upgrades
        this.elements.upgradeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.disabled) return;
                const card = e.target.closest('.upgrade-card');
                this.upgradeMining(card.dataset.level);
            });
        });
        
        // Boosters
        this.elements.boosterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.booster-card');
                this.activateBooster(card.dataset.booster);
            });
        });
        
        // Referral Actions
        this.elements.copyRefCode.addEventListener('click', () => this.copyReferralCode());
        this.elements.shareRef.addEventListener('click', () => this.shareReferralLink());
        
        // Modal Controls
        this.setupModalListeners();
        
        // Save state on unload
        window.addEventListener('beforeunload', () => this.saveState());
        window.addEventListener('pagehide', () => this.saveState());
    }
    
    setupModalListeners() {
        // Close modals
        this.elements.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });
        
        this.elements.modalOverlay.addEventListener('click', () => this.closeAllModals());
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
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
            
            if (clickCount >= 10) {
                this.showAdminLogin();
                clickCount = 0;
            }
        });
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
            this.showNotification('جاري التعدين... المكافأة غير جاهزة بعد.', 'info');
        }
    }
    
    startMining() {
        this.state.mining.isActive = true;
        this.state.mining.lastReward = Date.now();
        this.state.mining.nextReward = Date.now() + APP_CONFIG.MINING_LEVELS[this.state.mining.level].duration;
        
        this.updateMiningButton();
        this.showNotification('✅ تم تشغيل التعدين بنجاح!', 'success');
        this.updateHomePage();
        this.saveState();
    }
    
    claimMiningReward() {
        const miningLevel = APP_CONFIG.MINING_LEVELS[this.state.mining.level];
        let reward = miningLevel.reward;
        
        // Apply booster multiplier
        if (this.state.mining.activeBoosters.length > 0) {
            const activeBooster = this.state.mining.activeBoosters[0];
            reward *= activeBooster.multiplier;
        }
        
        // Add reward to balance
        this.state.balances.AMSK += reward;
        this.state.mining.totalMined += reward;
        this.state.mining.minedToday += reward;
        
        // Reset timer
        this.state.mining.lastReward = Date.now();
        this.state.mining.nextReward = Date.now() + miningLevel.duration;
        
        // Update UI
        this.updateHomePage();
        this.updateHeader();
        
        // Show notification
        this.showNotification(`💰 تمت المطالبة بـ ${this.formatNumber(reward)} AMSK من التعدين!`, 'success');
        
        // Save state
        this.saveState();
    }
    
    upgradeMining(level) {
        level = parseInt(level);
        const levelData = APP_CONFIG.MINING_LEVELS[level];
        
        if (level <= this.state.mining.level) {
            this.showNotification('أنت بالفعل في هذا المستوى أو أعلى!', 'warning');
            return;
        }
        
        if (this.state.balances.USDT < levelData.cost) {
            this.showNotification(`رصيد USDT غير كافي. تحتاج إلى ${levelData.cost} USDT.`, 'error');
            return;
        }
        
        // Deduct cost
        this.state.balances.USDT -= levelData.cost;
        this.state.mining.level = level;
        
        // Update UI
        this.updateHomePage();
        this.updateHeader();
        
        // Show notification
        this.showNotification(`⚡ تم الترقية إلى مستوى ${levelData.name}!`, 'success');
        
        // Save state
        this.saveState();
    }
    
    /* ===========================================
       BOOSTER SYSTEM
       =========================================== */
    
    activateBooster(boosterType) {
        const booster = APP_CONFIG.BOOSTERS[boosterType];
        
        if (!booster) {
            this.showNotification('المعزز غير موجود!', 'error');
            return;
        }
        
        if (this.state.balances.AMSK < booster.price) {
            this.showNotification(`رصيد AMSK غير كافي. تحتاج إلى ${booster.price} AMSK.`, 'error');
            return;
        }
        
        // Check if already has active booster
        if (this.state.mining.activeBoosters.length > 0) {
            this.showNotification('لديك معزز نشط بالفعل!', 'warning');
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
        this.updateHeader();
        
        // Show notification
        this.showNotification(`⚡ تم تفعيل معزز ${boosterType}! الإنتاج ×${booster.multiplier}`, 'success');
        
        // Save state
        this.saveState();
    }
    
    updateBoosters() {
        // Remove expired boosters
        const now = Date.now();
        this.state.mining.activeBoosters = this.state.mining.activeBoosters.filter(booster => {
            return booster.expiresAt > now;
        });
    }
    
    /* ===========================================
       REFERRAL SYSTEM
       =========================================== */
    
    copyReferralCode() {
        this.copyToClipboard(this.state.referral.code);
        this.showNotification('✅ تم نسخ كود الإحالة!', 'success');
    }
    
    shareReferralLink() {
        const link = `https://t.me/AlienMuskBot?start=ref-${this.state.referral.code}`;
        const message = `🚀 انضم إلى ALIEN MUSK واحصل على AMSK مجانًا!\n\nاستخدم كود الإحالة الخاص بي: ${this.state.referral.code}\n\n${link}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'ALIEN MUSK - منصة التعدين الكمومية',
                text: message,
                url: link
            }).catch(() => {
                this.copyToClipboard(message);
                this.showNotification('✅ تم نسخ رابط الإحالة! شاركه مع أصدقائك.', 'info');
            });
        } else {
            this.copyToClipboard(message);
            this.showNotification('✅ تم نسخ رابط الإحالة! شاركه مع أصدقائك.', 'info');
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
        
        // Add reward (20,000 AMSK per referral)
        this.state.balances.AMSK += 20000;
        this.state.referral.earned += 20000;
        
        // Check for milestone rewards
        this.checkReferralMilestones();
        
        // Update UI
        this.updateHomePage();
        this.updateHeader();
        
        // Show notification
        this.showNotification(`🎉 تمت إضافة محال جديد! +20,000 AMSK`, 'success');
        
        // Save state
        this.saveState();
    }
    
    checkReferralMilestones() {
        const refCount = this.state.referral.totalCount;
        
        for (const [count, data] of Object.entries(APP_CONFIG.REFERRAL_REWARDS)) {
            const countNum = parseInt(count);
            if (refCount >= countNum && !this.state.referral.claimedRewards.includes(countNum)) {
                this.claimMilestoneReward(countNum, data.reward);
            }
        }
    }
    
    claimMilestoneReward(milestone, reward) {
        // Add reward
        this.state.balances.AMSK += reward;
        this.state.referral.earned += reward;
        this.state.referral.claimedRewards.push(milestone);
        
        // Show notification
        this.showNotification(`🏆 وصلت إلى ${milestone} محالين! +${this.formatNumber(reward)} AMSK`, 'success');
        
        // Update UI
        this.updateHomePage();
        this.updateHeader();
        
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
        const password = prompt('أدخل كلمة مرور المشرف:');
        
        if (password === APP_CONFIG.ADMIN_SECRET && this.state.user.id === APP_CONFIG.ADMIN_USER_ID) {
            this.state.admin.isLoggedIn = true;
            this.showAdminPanel();
            this.showNotification('👑 مرحبًا بك أيها المشرف!', 'success');
        } else {
            this.showNotification('❌ الوصول مرفوض!', 'error');
        }
    }
    
    showAdminPanel() {
        this.elements.adminPanel.innerHTML = `
            <div class="admin-content">
                <div class="admin-header">
                    <h2><i class="fas fa-user-shield"></i> لوحة تحكم المشرف</h2>
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
                            <div class="stat-value">1</div>
                            <div class="stat-label">المستخدمين النشطين</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-coins"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">${this.formatNumber(this.state.balances.AMSK)}</div>
                            <div class="stat-label">AMSK الموزعة</div>
                        </div>
                    </div>
                </div>
                
                <div class="admin-section">
                    <h3><i class="fas fa-download"></i> طلبات الإيداع المعلقة</h3>
                    <div class="pending-list" id="admin-deposits-list">
                        ${this.state.admin.pendingDeposits.length === 0 ? 
                            '<p class="empty-state">لا توجد طلبات إيداع معلقة</p>' : 
                            this.state.admin.pendingDeposits.map(deposit => `
                                <div class="pending-item">
                                    <div class="pending-info">
                                        <div class="user">المستخدم: ${deposit.userId}</div>
                                        <div class="amount">${deposit.amount} ${deposit.currency}</div>
                                    </div>
                                    <div class="pending-actions">
                                        <button class="admin-btn approve" data-id="${deposit.id}">
                                            <i class="fas fa-check"></i> قبول
                                        </button>
                                        <button class="admin-btn reject" data-id="${deposit.id}">
                                            <i class="fas fa-times"></i> رفض
                                        </button>
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
                
                <div class="admin-section">
                    <h3><i class="fas fa-upload"></i> طلبات السحب المعلقة</h3>
                    <div class="pending-list" id="admin-withdrawals-list">
                        ${this.state.admin.pendingWithdrawals.length === 0 ? 
                            '<p class="empty-state">لا توجد طلبات سحب معلقة</p>' : 
                            this.state.admin.pendingWithdrawals.map(withdrawal => `
                                <div class="pending-item">
                                    <div class="pending-info">
                                        <div class="user">المستخدم: ${withdrawal.userId}</div>
                                        <div class="amount">${withdrawal.amount} ${withdrawal.currency}</div>
                                    </div>
                                    <div class="pending-actions">
                                        <button class="admin-btn pay" data-id="${withdrawal.id}">
                                            <i class="fas fa-money-bill-wave"></i> دفع
                                        </button>
                                        <button class="admin-btn reject" data-id="${withdrawal.id}">
                                            <i class="fas fa-times"></i> رفض
                                        </button>
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
                
                <div class="admin-actions">
                    <button id="refresh-admin" class="admin-btn">
                        <i class="fas fa-sync-alt"></i> تحديث
                    </button>
                    <button id="logout-admin" class="admin-btn logout">
                        <i class="fas fa-sign-out-alt"></i> خروج
                    </button>
                </div>
            </div>
        `;
        
        // Show admin panel
        this.elements.adminPanel.classList.add('active');
        
        // Add event listeners
        document.getElementById('close-admin').addEventListener('click', () => {
            this.elements.adminPanel.classList.remove('active');
        });
        
        document.getElementById('logout-admin').addEventListener('click', () => {
            this.state.admin.isLoggedIn = false;
            this.elements.adminPanel.classList.remove('active');
            this.showNotification('تم تسجيل خروج المشرف', 'info');
        });
        
        document.getElementById('refresh-admin').addEventListener('click', () => {
            this.showAdminPanel();
            this.showNotification('تم تحديث البيانات', 'success');
        });
        
        // Admin button listeners
        document.querySelectorAll('.admin-btn.approve, .admin-btn.reject, .admin-btn.pay').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').dataset.id;
                const action = e.target.closest('button').classList.contains('approve') ? 'approve' : 
                              e.target.closest('button').classList.contains('pay') ? 'pay' : 'reject';
                
                this.handleAdminAction(id, action);
            });
        });
    }
    
    handleAdminAction(id, action) {
        // Find and process the request
        console.log(`Admin action: ${action} on request ${id}`);
        this.showNotification(`تم ${action === 'approve' ? 'قبول' : action === 'pay' ? 'دفع' : 'رفض'} الطلب`, 'success');
        
        // Update admin panel
        setTimeout(() => {
            this.showAdminPanel();
        }, 500);
    }
    
    /* ===========================================
       UTILITY METHODS
       =========================================== */
    
    calculateTotalBalance() {
        const amskValue = this.state.balances.AMSK * APP_CONFIG.AMSK_PRICE;
        const usdtValue = this.state.balances.USDT;
        const bnbValue = this.state.balances.BNB * APP_CONFIG.BNB_PRICE;
        const tonValue = this.state.balances.TON * APP_CONFIG.TON_PRICE;
        
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
    
    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => this.showNotification('📋 تم النسخ إلى الحافظة!', 'success'))
            .catch(() => this.showNotification('فشل النسخ', 'error'));
    }
    
    showNotification(message, type = 'info') {
        const notificationCenter = this.elements.notificationCenter;
        
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
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    showLoading() {
        this.elements.loadingScreen.classList.add('active');
    }
    
    hideLoading() {
        this.elements.loadingScreen.classList.remove('active');
    }
    
    /* ===========================================
       TIMERS
       =========================================== */
    
    startTimers() {
        // Mining Timer
        this.timers.mining = setInterval(() => {
            this.updateMiningTimer();
        }, 1000);
        
        // Booster Checker
        this.timers.booster = setInterval(() => {
            this.updateBoosters();
        }, 60000);
        
        // Auto-save every 30 seconds
        this.timers.autosave = setInterval(() => {
            this.saveState();
        }, 30000);
    }
    
    updateMiningTimer() {
        if (!this.state.mining.isActive) return;
        
        const now = Date.now();
        const timeLeft = this.state.mining.nextReward - now;
        
        if (timeLeft <= 0) {
            // Reward is ready
            this.elements.miningTimer.textContent = 'جاهز!';
            this.elements.miningTimer.style.color = 'var(--secondary)';
            
            this.updateMiningButton();
        } else {
            // Update timer
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            this.elements.miningTimer.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            this.elements.miningTimer.style.color = 'var(--text-primary)';
        }
    }
    
    /* ===========================================
       STATE MANAGEMENT
       =========================================== */
    
    saveState() {
        if (!this.state) return;
        
        try {
            const stateString = JSON.stringify(this.state);
            localStorage.setItem('alien_musk_state', stateString);
        } catch (error) {
            console.error('Failed to save state:', error);
        }
    }
    
    loadState() {
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
        return false;
    }
}

/* ===========================================
   APP INITIALIZATION
   =========================================== */

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
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
    navigator.clipboard.writeText(text)
        .then(() => {
            if (window.alienMuskApp) {
                window.alienMuskApp.showNotification('📋 تم النسخ إلى الحافظة!', 'success');
            }
        })
        .catch(() => {
            if (window.alienMuskApp) {
                window.alienMuskApp.showNotification('فشل النسخ', 'error');
            }
        });
};

console.log('👽 تم تحميل منصة ALIEN MUSK بنجاح!');

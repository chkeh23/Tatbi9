// ============================================
// ALIEN MUSK - Quantum Mining Platform
// FIXED VERSION 5.0 - COMPLETE EVENT DELEGATION
// ============================================

// Global State
let tg = window.Telegram?.WebApp || null;
let telegramUser = tg?.initDataUnsafe?.user;
let db = null;
let firebaseApp = null;
let currentUser = null;
let userData = null;
let activeBoosters = [];
let activeStakes = [];
let miningInterval = null;

// Simple Configuration
const CONFIG = {
    PRICES: {
        AMSK: 0.0002,
        USDT: 1.00,
        BNB: 752.00,
        TON: 1.32
    },
    MIN_DEPOSIT: {
        USDT: 10,
        BNB: 0.02,
        TON: 10
    },
    WITHDRAWAL: {
        MIN_USDT: 100,
        FEE_BNB: 0.0002
    },
    ADDRESSES: {
        TON: "UQBCqpsPGRG3BalS10iF5U8-PSXkbE5ZlpQRqPVJaGglvQDJ",
        BNB_USDT: "0x790CAB511055F63db2F30AD227f7086bA3B6376a"
    },
    MINING: {
        BASE_REWARD: 2500,
        DURATION: 3600000,
        LEVELS: {
            1: { name: "Beginner", cost: 0, reward: 2500, hashrate: 2500 },
            2: { name: "Advanced", cost: 5, reward: 5000, hashrate: 5000 },
            3: { name: "Pro", cost: 20, reward: 10000, hashrate: 10000 },
            4: { name: "Expert", cost: 100, reward: 25000, hashrate: 25000 }
        },
        BOOSTERS: {
            "2x": { multiplier: 2, duration: 86400000, price: 10000 },
            "3x": { multiplier: 3, duration: 43200000, price: 15000 },
            "5x": { multiplier: 5, duration: 21600000, price: 25000 }
        }
    },
    STAKING: {
        PLANS: {
            1: { name: "Silver", amount: 10, duration: 7, apr: 40, daily: 40 },
            2: { name: "Gold", amount: 50, duration: 15, apr: 50, daily: 250 },
            3: { name: "Diamond", amount: 100, duration: 30, apr: 60, daily: 600 }
        }
    }
};

// DOM Elements Cache
const elements = {};

// ============================================
// MAIN APP CLASS - FIXED VERSION
// ============================================
class AlienMuskApp {
    constructor() {
        console.log("🚀 إنشاء تطبيق Alien Musk...");
        this.init();
    }
    
    async init() {
        console.log("🔧 بدء التهيئة...");
        
        try {
            // 1. Initialize basic user
            await this.initBasicUser();
            
            // 2. Cache DOM elements
            this.cacheElements();
            
            // 3. Setup GLOBAL event delegation (FIXED)
            this.setupGlobalEventDelegation();
            
            // 4. Initialize UI with sample data
            this.initWithSampleData();
            
            // 5. Hide loading screen
            setTimeout(() => {
                this.hideLoading();
                this.showNotification("👽 مرحبًا في منصة Alien Musk!", "success");
                console.log("✅ التطبيق جاهز!");
            }, 1000);
            
        } catch (error) {
            console.error("❌ خطأ في التهيئة:", error);
            this.hideLoading();
            this.showNotification("تم تحميل التطبيق بنمط العرض فقط", "info");
        }
    }
    
    // ============================================
    // USER INITIALIZATION
    // ============================================
    async initBasicUser() {
        const userId = telegramUser?.id ? `tg_${telegramUser.id}` : `user_${Date.now()}`;
        
        currentUser = {
            id: userId,
            telegramId: telegramUser?.id,
            username: telegramUser?.username || `Alien_${userId.substr(0, 6)}`,
            firstName: telegramUser?.first_name || "Alien",
            photoUrl: telegramUser?.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
            referralCode: `ALIEN-${userId.substr(-6).toUpperCase()}`
        };
        
        console.log("👤 مستخدم مهيأ:", currentUser.username);
    }
    
    // ============================================
    // DOM CACHING - FIXED
    // ============================================
    cacheElements() {
        console.log("🔍 جاري حفظ عناصر الواجهة...");
        
        // Loading
        elements.loadingScreen = document.getElementById('loading-screen');
        
        // Header
        elements.usernameMini = document.getElementById('username-mini');
        elements.userIdMini = document.getElementById('user-id-mini');
        elements.userAvatarMini = document.getElementById('user-avatar-mini');
        elements.totalBalanceAmsk = document.getElementById('total-balance-amsk');
        elements.totalBalanceUsd = document.getElementById('total-balance-usd');
        
        // Mining
        elements.currentMiningLevel = document.getElementById('current-mining-level');
        elements.currentHashrateDisplay = document.getElementById('current-hashrate-display');
        elements.miningTimerDisplay = document.getElementById('mining-timer-display');
        elements.startMiningBtn = document.getElementById('start-mining-btn');
        elements.nextRewardAmount = document.getElementById('next-reward-amount');
        
        // Staking Calculator
        elements.calcAmount = document.getElementById('calc-amount');
        elements.calcDuration = document.getElementById('calc-duration');
        elements.calcTotalProfit = document.getElementById('calc-total-profit');
        elements.calcDailyProfit = document.getElementById('calc-daily-profit');
        elements.calcTotalReturn = document.getElementById('calc-total-return');
        
        // Lists
        elements.activeStakesList = document.getElementById('active-stakes-list');
        
        // Wallet
        elements.walletTotalAmsk = document.getElementById('wallet-total-amsk');
        elements.walletTotalUsd = document.getElementById('wallet-total-usd');
        elements.assetAmskBalance = document.getElementById('asset-amsk-balance');
        elements.assetAmskUsd = document.getElementById('asset-amsk-usd');
        elements.assetUsdtBalance = document.getElementById('asset-usdt-balance');
        elements.assetUsdtUsd = document.getElementById('asset-usdt-usd');
        elements.assetBnbBalance = document.getElementById('asset-bnb-balance');
        elements.assetBnbUsd = document.getElementById('asset-bnb-usd');
        elements.assetTonBalance = document.getElementById('asset-ton-balance');
        elements.assetTonUsd = document.getElementById('asset-ton-usd');
        
        console.log(`✅ تم حفظ ${Object.keys(elements).length} عنصر`);
    }
    
    // ============================================
    // GLOBAL EVENT DELEGATION - FIXED & WORKING
    // ============================================
    setupGlobalEventDelegation() {
        console.log("🔗 جاري ربط جميع الأزرار...");
        
        // ONE SINGLE EVENT LISTENER FOR ENTIRE APP
        document.addEventListener('click', (event) => {
            const target = event.target;
            
            // Debug
            console.log("🖱️ تم النقر على:", target.tagName, target.className);
            
            // 1. NAVIGATION BUTTONS
            if (target.closest('.nav-btn')) {
                const btn = target.closest('.nav-btn');
                const page = btn.dataset.page;
                console.log("📱 تبديل إلى صفحة:", page);
                this.showPage(page);
                return;
            }
            
            // 2. MINING BUTTON
            if (target.closest('#start-mining-btn')) {
                console.log("⛏️ زر التعدين مضغوط");
                this.handleMiningAction();
                return;
            }
            
            // 3. UPGRADE BUTTONS
            if (target.closest('.upgrade-btn')) {
                const card = target.closest('.upgrade-card');
                if (card && !target.disabled) {
                    const level = parseInt(card.dataset.level);
                    console.log("⚡ ترقية مستوى:", level);
                    this.upgradeMiningLevel(level);
                }
                return;
            }
            
            // 4. BOOSTER BUTTONS
            if (target.closest('.booster-btn')) {
                const card = target.closest('.booster-card');
                if (card && !target.disabled) {
                    const booster = card.dataset.booster;
                    console.log("🚀 تفعيل معزز:", booster);
                    this.activateBooster(booster);
                }
                return;
            }
            
            // 5. STAKE BUTTONS
            if (target.closest('.stake-btn')) {
                const plan = target.closest('[data-plan]');
                if (plan) {
                    const planId = parseInt(plan.dataset.plan);
                    console.log("💰 فتح نافذة الرهان:", planId);
                    this.openStakeModal(planId);
                }
                return;
            }
            
            // 6. QUICK ACTION BUTTONS (Wallet)
            if (target.closest('.quick-action-btn')) {
                const btn = target.closest('.quick-action-btn');
                const action = btn.dataset.action;
                console.log("⚡ إجراء سريع:", action);
                this.handleQuickAction(action);
                return;
            }
            
            // 7. ASSET ACTION BUTTONS
            if (target.closest('.asset-btn')) {
                const btn = target.closest('.asset-btn');
                const action = btn.dataset.action;
                const currency = btn.dataset.currency;
                console.log("💎 إجراء أصل:", action, currency);
                this.handleAssetAction(action, currency);
                return;
            }
            
            // 8. MODAL CLOSE BUTTONS
            if (target.closest('.modal-close') || target.closest('.btn-secondary')) {
                console.log("❌ إغلاق النافذة");
                this.closeModal();
                return;
            }
            
            // 9. COPY BUTTONS
            if (target.closest('.copy-btn')) {
                const address = CONFIG.ADDRESSES[target.closest('[data-currency]')?.dataset.currency] || CONFIG.ADDRESSES.BNB_USDT;
                console.log("📋 نسخ العنوان:", address);
                this.copyToClipboard(address);
                return;
            }
            
            // 10. MODAL OVERLAY CLICK
            if (target.id === 'modal-overlay') {
                console.log("🌌 النقر خارج النافذة");
                this.closeModal();
                return;
            }
            
            // 11. CALCULATOR INPUTS
            if (target.id === 'calc-amount' || target.id === 'calc-duration') {
                setTimeout(() => this.updateStakingCalculator(), 100);
            }
        });
        
        // Additional event listeners
        document.addEventListener('input', (event) => {
            if (event.target.id === 'calc-amount' || event.target.id === 'calc-duration') {
                this.updateStakingCalculator();
            }
        });
        
        console.log("✅ تم ربط جميع الأحداث بنجاح!");
    }
    
    // ============================================
    // SAMPLE DATA INITIALIZATION
    // ============================================
    initWithSampleData() {
        console.log("📊 تحميل بيانات تجريبية...");
        
        // Sample user data
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
                lastReward: Date.now() - 1800000, // 30 minutes ago
                nextReward: Date.now() + 1800000, // 30 minutes from now
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
                earned: 0
            }
        };
        
        // Initialize UI with sample data
        this.updateUserInfo();
        this.updateMiningDisplay();
        this.updateWalletDisplay();
        this.updateStakingCalculator();
        this.updateActiveStakes();
        this.showPage('home');
        
        // Start mining timer
        this.startMiningTimer();
        
        console.log("✅ تم تحميل البيانات التجريبية");
    }
    
    // ============================================
    // PAGE NAVIGATION
    // ============================================
    showPage(pageName) {
        console.log("📄 التبديل إلى:", pageName);
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
            page.classList.remove('active');
        });
        
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.page === pageName) {
                btn.classList.add('active');
            }
        });
        
        // Show selected page
        const pageElement = document.getElementById(`${pageName}-page`);
        if (pageElement) {
            pageElement.style.display = 'block';
            setTimeout(() => pageElement.classList.add('active'), 10);
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
    // MINING SYSTEM - WORKING
    // ============================================
    updateMiningDisplay() {
        if (!userData?.mining) return;
        
        const mining = userData.mining;
        const level = CONFIG.MINING.LEVELS[mining.level];
        
        // Update mining level
        if (elements.currentMiningLevel) {
            elements.currentMiningLevel.textContent = mining.level;
        }
        
        // Calculate hashrate
        let hashrate = level.hashrate;
        activeBoosters.forEach(booster => {
            const config = CONFIG.MINING.BOOSTERS[booster.type];
            if (config) hashrate *= config.multiplier;
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
            if (config) nextReward *= config.multiplier;
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
            elements.miningTimerDisplay.textContent = "جاهز!";
            elements.miningTimerDisplay.style.color = "#00ff88";
            
            if (elements.startMiningBtn) {
                elements.startMiningBtn.innerHTML = '<i class="fas fa-gift"></i><span>استلام المكافأة</span>';
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
                elements.startMiningBtn.innerHTML = '<i class="fas fa-play"></i><span>جاري التعدين...</span>';
                elements.startMiningBtn.classList.remove('claim-mode');
            }
        }
    }
    
    startMiningTimer() {
        if (miningInterval) clearInterval(miningInterval);
        
        miningInterval = setInterval(() => {
            this.updateMiningTimer();
        }, 1000);
    }
    
    handleMiningAction() {
        console.log("🔄 معالجة زر التعدين...");
        
        if (!userData?.mining) return;
        
        const mining = userData.mining;
        const now = Date.now();
        
        if (!mining.active) {
            this.startMining();
        } else if (now >= mining.nextReward) {
            this.claimMiningReward();
        } else {
            this.showNotification("⏳ جاري التعدين... المكافأة غير جاهزة بعد", "info");
        }
    }
    
    startMining() {
        console.log("🚀 بدء التعدين...");
        
        userData.mining.active = true;
        userData.mining.lastReward = Date.now();
        userData.mining.nextReward = Date.now() + CONFIG.MINING.DURATION;
        
        this.updateMiningDisplay();
        this.showNotification("⚡ تم بدء التعدين الكمي!", "success");
    }
    
    claimMiningReward() {
        console.log("💰 استلام مكافأة التعدين...");
        
        const level = CONFIG.MINING.LEVELS[userData.mining.level];
        let reward = level.reward;
        
        // Apply booster multipliers
        activeBoosters.forEach(booster => {
            const config = CONFIG.MINING.BOOSTERS[booster.type];
            if (config) reward *= config.multiplier;
        });
        
        // Update balances
        userData.balances.AMSK += reward;
        userData.mining.totalMined += reward;
        userData.mining.minedToday += reward;
        userData.mining.lastReward = Date.now();
        userData.mining.nextReward = Date.now() + CONFIG.MINING.DURATION;
        
        // Update UI
        this.updateMiningDisplay();
        this.updateWalletDisplay();
        this.updateTotalBalance();
        
        // Show notification
        this.showNotification(`💰 +${this.formatNumber(reward)} AMSK تم تعدينها!`, "success");
        
        // Update upgrade cards (balance changed)
        this.updateUpgradeCards();
        this.updateBoosterCards();
    }
    
    updateUpgradeCards() {
        if (!document.querySelector('.upgrade-card')) return;
        
        const currentLevel = userData.mining.level;
        const usdtBalance = userData.balances.USDT || 0;
        
        document.querySelectorAll('.upgrade-card').forEach(card => {
            const level = parseInt(card.dataset.level);
            const levelData = CONFIG.MINING.LEVELS[level];
            const button = card.querySelector('.upgrade-btn');
            
            if (!button) return;
            
            if (level === currentLevel) {
                button.textContent = 'مفعل';
                button.classList.add('active-btn');
                button.disabled = true;
                card.classList.add('active');
            } else if (level < currentLevel) {
                button.textContent = 'محدث';
                button.classList.add('active-btn');
                button.disabled = true;
                card.classList.remove('active');
            } else {
                const canAfford = usdtBalance >= levelData.cost;
                button.textContent = canAfford ? 'ترقية' : `${levelData.cost} USDT`;
                button.disabled = !canAfford;
                button.classList.remove('active-btn');
                card.classList.remove('active');
            }
        });
    }
    
    updateBoosterCards() {
        if (!document.querySelector('.booster-card')) return;
        
        const amskBalance = userData.balances.AMSK || 0;
        
        document.querySelectorAll('.booster-card').forEach(card => {
            const boosterType = card.dataset.booster;
            const boosterConfig = CONFIG.MINING.BOOSTERS[boosterType];
            const button = card.querySelector('.booster-btn');
            
            if (!button || !boosterConfig) return;
            
            const isActive = activeBoosters.some(b => b.type === boosterType);
            const canAfford = amskBalance >= boosterConfig.price;
            
            if (isActive) {
                button.textContent = 'مفعل';
                button.disabled = true;
                button.classList.add('active-btn');
                card.classList.add('active');
            } else {
                button.textContent = canAfford ? 'تفعيل' : `${this.formatNumber(boosterConfig.price)} AMSK`;
                button.disabled = !canAfford;
                button.classList.remove('active-btn');
                card.classList.remove('active');
            }
        });
    }
    
    async upgradeMiningLevel(level) {
        console.log("⚡ ترقية مستوى التعدين:", level);
        
        const levelData = CONFIG.MINING.LEVELS[level];
        if (!levelData) {
            this.showNotification("مستوى غير صحيح", "error");
            return;
        }
        
        if (level <= userData.mining.level) {
            this.showNotification("أنت بالفعل في هذا المستوى أو أعلى!", "warning");
            return;
        }
        
        if (userData.balances.USDT < levelData.cost) {
            this.showNotification(`رصيد USDT غير كاف. تحتاج ${levelData.cost} USDT.`, "error");
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
        
        // Show success
        this.showNotification(`⚡ تم الترقية إلى مستوى ${levelData.name}!`, "success");
    }
    
    async activateBooster(boosterType) {
        console.log("🚀 تفعيل معزز:", boosterType);
        
        const boosterConfig = CONFIG.MINING.BOOSTERS[boosterType];
        if (!boosterConfig) {
            this.showNotification("المعزز غير موجود!", "error");
            return;
        }
        
        // Check if already active
        const isActive = activeBoosters.some(b => b.type === boosterType);
        if (isActive) {
            this.showNotification("هذا المعزز مفعل بالفعل!", "warning");
            return;
        }
        
        // Check AMSK balance
        if (userData.balances.AMSK < boosterConfig.price) {
            this.showNotification(`رصيد AMSK غير كاف. تحتاج ${boosterConfig.price} AMSK.`, "error");
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
        
        // Show success
        this.showNotification(`⚡ تم تفعيل معزز ${boosterType}! سرعة التعدين ×${boosterConfig.multiplier}`, "success");
    }
    
    // ============================================
    // STAKING SYSTEM - WORKING
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
        if (!elements.activeStakesList) return;
        
        if (!activeStakes.length) {
            elements.activeStakesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>لا توجد رهانات نشطة</p>
                    <small>ابدأ الرهان لربح المكافآت</small>
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
                        <span class="status-badge active">نشط</span>
                    </div>
                    
                    <div class="stake-progress">
                        <div class="progress-info">
                            <span>${Math.round(progress)}%</span>
                            <span>${daysLeft} يوم متبقي</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                    
                    <div class="stake-details">
                        <div class="detail">
                            <i class="fas fa-calendar"></i>
                            <span>${plan.duration} يوم</span>
                        </div>
                        <div class="detail">
                            <i class="fas fa-percentage"></i>
                            <span>${plan.apr}% معدل سنوي</span>
                        </div>
                        <div class="detail">
                            <i class="fas fa-gift"></i>
                            <span>${plan.daily} AMSK/يوم</span>
                        </div>
                    </div>
                    
                    <div class="stake-actions">
                        <button class="btn-secondary" onclick="window.app?.cancelStake(${index})" ${progress < 50 ? '' : 'disabled'}>
                            إلغاء
                        </button>
                        <button class="btn-primary" onclick="window.app?.claimStakeReward(${index})" ${progress >= 100 ? '' : 'disabled'}>
                            استلام
                        </button>
                    </div>
                </div>
            `;
        });
        
        elements.activeStakesList.innerHTML = html;
    }
    
    openStakeModal(planId) {
        console.log("💎 فتح نافذة الرهان:", planId);
        
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
                        <span>المدة:</span>
                        <span>${plan.duration} يوم</span>
                    </div>
                    <div class="info-item">
                        <span>معدل سنوي:</span>
                        <span>${plan.apr}%</span>
                    </div>
                    <div class="info-item">
                        <span>المكافأة اليومية:</span>
                        <span>${plan.daily} AMSK</span>
                    </div>
                    <div class="info-item total">
                        <span>إجمالي المكافأة:</span>
                        <span>${plan.daily * plan.duration} AMSK</span>
                    </div>
                </div>
                
                <div class="stake-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>سيتم تجميد USDT لمدة ${plan.duration} يوم</span>
                </div>
                
                <div class="modal-actions">
                    <button class="btn-secondary">
                        إلغاء
                    </button>
                    <button class="btn-primary" onclick="window.app?.confirmStaking(${planId})">
                        تأكيد الرهان
                    </button>
                </div>
            </div>
        `;
        
        this.openModal('stake', modalContent);
    }
    
    async confirmStaking(planId) {
        console.log("✅ تأكيد الرهان:", planId);
        
        const plan = CONFIG.STAKING.PLANS[planId];
        if (!plan) {
            this.showNotification("الخطة غير موجودة", "error");
            return;
        }
        
        // Check USDT balance
        if (userData.balances.USDT < plan.amount) {
            this.showNotification("رصيد USDT غير كاف", "error");
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
        this.showNotification(`✅ تم الرهان بـ ${plan.amount} USDT لمدة ${plan.duration} يوم!`, "success");
    }
    
    async claimStakeReward(stakeIndex) {
        console.log("💰 استلام مكافأة الرهان:", stakeIndex);
        
        const stake = activeStakes[stakeIndex];
        if (!stake) {
            this.showNotification("الرهان غير موجود", "error");
            return;
        }
        
        const plan = CONFIG.STAKING.PLANS[stake.planId];
        if (!plan) {
            this.showNotification("الخطة غير موجودة", "error");
            return;
        }
        
        const now = Date.now();
        const endTime = stake.startTime + (plan.duration * 24 * 60 * 60 * 1000);
        
        // Check if stake period is complete
        if (now < endTime) {
            this.showNotification("مدة الرهان لم تكتمل بعد", "warning");
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
        this.showNotification(`💰 تم استلام ${totalReward} AMSK من الرهان!`, "success");
    }
    
    // ============================================
    // WALLET SYSTEM - WORKING
    // ============================================
    updateUserInfo() {
        if (!currentUser) return;
        
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
    
    handleQuickAction(action) {
        console.log("⚡ إجراء سريع:", action);
        
        switch (action) {
            case 'swap':
                this.openSwapModal();
                break;
            case 'withdraw':
                this.openWithdrawModal();
                break;
            case 'deposit':
                this.openDepositModal();
                break;
            case 'history':
                this.openHistoryModal();
                break;
        }
    }
    
    handleAssetAction(action, currency) {
        console.log("💎 إجراء أصل:", action, currency);
        
        switch (action) {
            case 'send':
                this.showNotification('ميزة الإرسال قريبًا!', 'info');
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
                    this.showNotification('السحب متاح فقط لـ USDT', 'info');
                }
                break;
            case 'convert':
                if (currency === 'BNB' || currency === 'TON') {
                    this.openSwapModal();
                    setTimeout(() => {
                        const fromSelect = document.getElementById('swap-from-currency');
                        const toSelect = document.getElementById('swap-to-currency');
                        if (fromSelect && toSelect) {
                            fromSelect.value = currency;
                            toSelect.value = 'AMSK';
                            // Trigger calculation
                            fromSelect.dispatchEvent(new Event('change'));
                        }
                    }, 100);
                }
                break;
        }
    }
    
    // ============================================
    // MODAL SYSTEM - WORKING
    // ============================================
    openDepositModal(currency = 'USDT') {
        console.log("💰 فتح نافذة الإيداع:", currency);
        
        const minDeposit = CONFIG.MIN_DEPOSIT[currency] || 10;
        const address = currency === 'TON' ? CONFIG.ADDRESSES.TON : CONFIG.ADDRESSES.BNB_USDT;
        
        const modalContent = `
            <div class="deposit-modal-content">
                <div class="deposit-header">
                    <h4><i class="fas fa-arrow-down"></i> إيداع ${currency}</h4>
                </div>
                
                <div class="deposit-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>أرسل فقط <strong>${currency}</strong> لهذا العنوان</span>
                </div>
                
                <div class="address-card">
                    <div class="address-label">عنوان الإيداع:</div>
                    <div class="address-value">${address}</div>
                    <button class="copy-btn">
                        <i class="fas fa-copy"></i> نسخ العنوان
                    </button>
                </div>
                
                <div class="deposit-form">
                    <div class="form-group">
                        <label>المبلغ (${currency})</label>
                        <input type="number" id="deposit-amount" 
                               min="${minDeposit}" 
                               step="${currency === 'BNB' ? '0.001' : '1'}"
                               placeholder="أدخل المبلغ">
                    </div>
                    
                    <div class="form-group">
                        <label>رقم المعاملة</label>
                        <input type="text" id="deposit-txid" 
                               placeholder="أدخل رقم المعاملة">
                    </div>
                    
                    <div class="min-deposit">
                        <i class="fas fa-info-circle"></i>
                        الحد الأدنى للإيداع: ${minDeposit} ${currency}
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn-secondary">
                        إلغاء
                    </button>
                    <button class="btn-primary" onclick="window.app?.submitDeposit('${currency}')">
                        تقديم طلب الإيداع
                    </button>
                </div>
            </div>
        `;
        
        this.openModal('deposit', modalContent);
    }
    
    openWithdrawModal() {
        console.log("💰 فتح نافذة السحب");
        
        const usdtBalance = userData?.balances?.USDT || 0;
        const bnbBalance = userData?.balances?.BNB || 0;
        const minWithdraw = CONFIG.WITHDRAWAL.MIN_USDT;
        const feeBNB = CONFIG.WITHDRAWAL.FEE_BNB;
        
        const canWithdraw = usdtBalance >= minWithdraw && bnbBalance >= feeBNB;
        
        const modalContent = `
            <div class="withdraw-modal-content">
                <div class="withdraw-header">
                    <h4><i class="fas fa-arrow-up"></i> سحب USDT</h4>
                </div>
                
                <div class="balance-info">
                    <div class="balance-item">
                        <span>USDT المتاح:</span>
                        <span class="amount">${usdtBalance.toFixed(2)} USDT</span>
                    </div>
                    <div class="balance-item">
                        <span>BNB المتاح (للرسوم):</span>
                        <span class="amount ${bnbBalance >= feeBNB ? 'success' : 'error'}">
                            ${bnbBalance.toFixed(6)} BNB
                        </span>
                    </div>
                </div>
                
                <div class="withdraw-form">
                    <div class="form-group">
                        <label>المبلغ (USDT)</label>
                        <input type="number" id="withdraw-amount" 
                               value="${Math.max(minWithdraw, Math.min(100, usdtBalance)).toFixed(2)}"
                               min="${minWithdraw}"
                               max="${usdtBalance}"
                               step="0.01"
                               placeholder="أدخل المبلغ">
                    </div>
                    
                    <div class="form-group">
                        <label>عنوان المحفظة (BEP20)</label>
                        <input type="text" id="withdraw-address" 
                               placeholder="0x..."
                               maxlength="42">
                    </div>
                    
                    <div class="fee-info">
                        <div class="fee-item">
                            <i class="fas fa-gas-pump"></i>
                            <span>رسوم الشبكة: ${feeBNB} BNB</span>
                        </div>
                        <div class="fee-item">
                            <i class="fas fa-exclamation-circle"></i>
                            <span>الحد الأدنى للسحب: ${minWithdraw} USDT</span>
                        </div>
                    </div>
                    
                    <div class="requirements">
                        <div class="requirement ${usdtBalance >= minWithdraw ? 'met' : 'not-met'}">
                            <i class="fas ${usdtBalance >= minWithdraw ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                            <span>الحد الأدنى ${minWithdraw} USDT</span>
                        </div>
                        <div class="requirement ${bnbBalance >= feeBNB ? 'met' : 'not-met'}">
                            <i class="fas ${bnbBalance >= feeBNB ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                            <span>${feeBNB} BNB للرسوم متاح</span>
                        </div>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn-secondary">
                        إلغاء
                    </button>
                    <button class="btn-primary" ${canWithdraw ? '' : 'disabled'}>
                        تقديم طلب السحب
                    </button>
                </div>
            </div>
        `;
        
        this.openModal('withdraw', modalContent);
    }
    
    openSwapModal() {
        console.log("🔄 فتح نافذة المبادلة");
        
        const modalContent = `
            <div class="swap-modal-content">
                <div class="swap-header">
                    <h4><i class="fas fa-exchange-alt"></i> مبادلة العملات</h4>
                </div>
                
                <div class="swap-container">
                    <div class="swap-from">
                        <div class="swap-label">
                            <span>من</span>
                            <select id="swap-from-currency">
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
                                   placeholder="0">
                            <div class="balance-label">
                                الرصيد: <span id="swap-from-balance">0</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="swap-arrow">
                        <i class="fas fa-exchange-alt"></i>
                    </div>
                    
                    <div class="swap-to">
                        <div class="swap-label">
                            <span>إلى</span>
                            <select id="swap-to-currency">
                                <option value="USDT">USDT</option>
                                <option value="AMSK">AMSK</option>
                                <option value="BNB" disabled>BNB</option>
                                <option value="TON" disabled>TON</option>
                            </select>
                        </div>
                        <div class="swap-output">
                            <div id="swap-to-amount">0.00</div>
                            <div class="balance-label">
                                الرصيد: <span id="swap-to-balance">0</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="swap-info">
                        <div class="info-item">
                            <i class="fas fa-chart-line"></i>
                            <span>السعر: 1 AMSK = ${CONFIG.PRICES.AMSK} USDT</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-percentage"></i>
                            <span>الرسوم: 0%</span>
                        </div>
                    </div>
                    
                    <div class="swap-preview">
                        <div class="preview-item">
                            <span>ترسل:</span>
                            <span id="preview-send">0</span>
                        </div>
                        <div class="preview-item">
                            <span>تستلم:</span>
                            <span id="preview-receive">0.00</span>
                        </div>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn-secondary">
                        إلغاء
                    </button>
                    <button class="btn-primary" onclick="window.app?.executeSwap()">
                        تأكيد المبادلة
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
    
    openHistoryModal() {
        console.log("📜 فتح سجل المعاملات");
        
        const modalContent = `
            <div class="history-modal-content">
                <div class="history-header">
                    <h4><i class="fas fa-history"></i> سجل المعاملات</h4>
                    <div class="history-tabs">
                        <button class="tab-btn active" data-tab="all">الكل</button>
                        <button class="tab-btn" data-tab="deposits">الإيداعات</button>
                        <button class="tab-btn" data-tab="withdrawals">السحوبات</button>
                        <button class="tab-btn" data-tab="swaps">المبادلات</button>
                        <button class="tab-btn" data-tab="staking">الرهانات</button>
                    </div>
                </div>
                
                <div class="history-list" id="history-list">
                    <div class="empty-state">
                        <i class="fas fa-clock"></i>
                        <p>لا توجد معاملات</p>
                        <small>سيظهر السجل هنا عند قيامك بمعاملات</small>
                    </div>
                </div>
            </div>
        `;
        
        this.openModal('history', modalContent);
    }
    
    openModal(modalName, content = null) {
        console.log("📂 فتح نافذة:", modalName);
        
        // Close any open modal first
        this.closeModal();
        
        const modal = document.getElementById(`${modalName}-modal`);
        if (!modal) return;
        
        // Set content if provided
        if (content) {
            const modalBody = modal.querySelector('.modal-body');
            if (modalBody) {
                modalBody.innerHTML = content;
            }
        }
        
        // Show modal and overlay
        document.getElementById('modal-overlay').classList.add('active');
        modal.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        console.log("❌ إغلاق جميع النوافذ");
        
        // Hide all modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        
        // Hide overlay
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    hideLoading() {
        console.log("👋 إخفاء شاشة التحميل");
        
        if (elements.loadingScreen) {
            elements.loadingScreen.classList.remove('active');
        }
        
        if (document.getElementById('app-container')) {
            document.getElementById('app-container').style.display = 'block';
        }
    }
    
    showNotification(message, type = 'info') {
        console.log("📢 إشعار:", message);
        
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
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
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
    
    copyToClipboard(text) {
        console.log("📋 نسخ:", text);
        
        if (!navigator.clipboard) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        } else {
            navigator.clipboard.writeText(text);
        }
        
        this.showNotification('✅ تم النسخ إلى الحافظة!', 'success');
    }
}

// ============================================
// GLOBAL INITIALIZATION - SIMPLIFIED
// ============================================

// Create global app instance
let app = null;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("📄 DOM محمل بالكامل!");
    
    try {
        // Create app instance
        app = new AlienMuskApp();
        window.app = app;
        
        console.log("✅ App instance created and attached to window");
        
        // Make utility functions globally available
        window.formatNumber = (num, decimals = 0) => {
            return app ? app.formatNumber(num, decimals) : num.toString();
        };
        
        window.copyToClipboard = (text) => {
            if (app) app.copyToClipboard(text);
        };
        
        window.showNotification = (message, type) => {
            if (app) app.showNotification(message, type);
        };
        
    } catch (error) {
        console.error("❌ فشل إنشاء التطبيق:", error);
        
        // Fallback: Show the app anyway
        document.getElementById('loading-screen')?.remove();
        document.getElementById('app-container').style.display = 'block';
        
        alert("تم تحميل التطبيق في وضع العرض فقط. بعض الميزات قد لا تعمل.");
    }
});

// Fallback in case DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if (!window.app) {
            console.log("🔄 محاولة تحميل متأخرة...");
            app = new AlienMuskApp();
            window.app = app;
        }
    }, 1000);
}

console.log("👽 Alien Musk Platform v5.0 - Event Delegation Edition loaded!");

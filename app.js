// ===========================================
// ALIEN MUSK QUANTUM v8.0 - ULTIMATE ECONOMY EDITION
// ===========================================
// نسخة اقتصادية 100% مطابقة لنظام REFI
// Zero Cost Architecture - On-Demand Listeners - Smart Caching
// ===========================================

// ===== 1. TELEGRAM WEBAPP INITIALIZATION =====
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
    tg.enableClosingConfirmation?.();
    tg.setHeaderColor('#0a0a0f');
    tg.setBackgroundColor('#0a0a0f');
    console.log("✅ Telegram WebApp initialized");
}

// ===== 2. FIREBASE CONFIGURATION =====
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCklv_zMfndK4-xUHECyD5XA7p_-20e1t8",
    authDomain: "tatbi9-681bf.firebaseapp.com",
    projectId: "tatbi9-681bf",
    storageBucket: "tatbi9-681bf.firebasestorage.app",
    messagingSenderId: "863237064748",
    appId: "1:863237064748:web:134de1e01d2639ef5fa989"
};

// Initialize Firebase
let firebaseApp, db;
try {
    if (typeof firebase !== 'undefined') {
        firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
        db = firebase.firestore();
        console.log("🔥 Firebase initialized successfully");
    }
} catch (error) {
    console.error("❌ Firebase initialization error:", error);
}

// ===== 3. ADMIN CONFIGURATION =====
const ADMIN_TELEGRAM_IDS = ["1653918641"]; // Only Telegram IDs - no password needed
const ADMIN_ID = "1653918641";

// ===== 4. CONFIGURATION - الإعدادات الأساسية =====
const CONFIG = {
    PRICES: {
        AMSK: 0.0002,
        USDT: 1.00,
        BNB: 640.00,
        TON: 1.4
    },
    
    MINING: {
        DURATION: 9000000, // 2.5 hours
        LEVELS: {
            1: { name: "⚡ Beginner", cost: 0, reward: 1000, hashrate: 1000, apy: "∞" },
            2: { name: "🚀 Advanced", cost: 5, reward: 5000, hashrate: 5000, apy: "200%" },
            3: { name: "💎 Pro", cost: 20, reward: 10000, hashrate: 10000, apy: "250%" },
            4: { name: "👑 Legend", cost: 50, reward: 50000, hashrate: 50000, apy: "300%" },
            5: { name: "🌌 Mythic", cost: 100, reward: 100000, hashrate: 100000, apy: "400%" }
        }
    },
    
    STAKING: {
        PLANS: {
            1: { name: "Silver", minAmount: 10, duration: 7, apr: 40, dailyPer10: 2857, totalPer10: 20000 },
            2: { name: "Gold", minAmount: 50, duration: 15, apr: 50, dailyPer50: 8333, totalPer50: 125000 },
            3: { name: "Diamond", minAmount: 100, duration: 30, apr: 60, dailyPer100: 10000, totalPer100: 300000 }
        }
    },
    
    TASKS: {
        1: { name: "Join Telegram Channel", url: "https://t.me/alienmusk", icon: "fab fa-telegram", reward: 5000 },
        2: { name: "Subscribe on YouTube", url: "https://youtube.com/@alienmusk", icon: "fab fa-youtube", reward: 5000 },
        3: { name: "Follow on TikTok", url: "https://tiktok.com/@alienmusk", icon: "fab fa-tiktok", reward: 5000 },
        4: { name: "Like & Share", url: "https://t.me/alienmusk/1", icon: "fas fa-heart", reward: 5000 }
    },
    
    VIP_TASKS: {
        MINING: {
            2: { reward: 20000, name: "Level 2 Master", icon: "fas fa-rocket" },
            3: { reward: 40000, name: "Level 3 Pro", icon: "fas fa-crown" },
            4: { reward: 80000, name: "Level 4 Legend", icon: "fas fa-star" },
            5: { reward: 200000, name: "Level 5 Mythic", icon: "fas fa-sun" }
        },
        STAKING: {
            silver: { reward: 20000, name: "Silver Staker", icon: "fas fa-gem", planId: 1 },
            gold: { reward: 40000, name: "Gold Staker", icon: "fas fa-gem", planId: 2 },
            diamond: { reward: 100000, name: "Diamond Staker", icon: "fas fa-gem", planId: 3 }
        }
    },
    
    REFERRAL: {
        BONUS: {
            REFERRER: 10000,
            REFERRED: 5000
        },
        MILESTONES: {
            10: { amsk: 50000, bnb: 0 },
            25: { amsk: 150000, bnb: 0 },
            50: { amsk: 350000, bnb: 0.01 },
            100: { amsk: 1000000, bnb: 0.025 },
            250: { amsk: 3000000, bnb: 0.075 }
        }
    },
    
    DEPOSIT: {
        ADDRESSES: {
            USDT: "0xbe7D6b0910d1019100c5CD32b4160cA30A8EB5D4",
            BNB: "0xbe7D6b0910d1019100c5CD32b4160cA30A8EB5D4",
            TON: "UQDZBsZgsaTeVr4EdzmrpC_D6Jcb_SJtDZxhjoYjYc9OKjpN"
        },
        MIN_AMOUNTS: {
            USDT: 5,
            BNB: 0.02,
            TON: 5
        }
    },
    
    WITHDRAW: {
        MIN_USDT: 100,
        FEE_BNB: 0.00025
    },
    
    SWAP: {
        RATES: {
            USDT_TO_AMSK: 5000,
            AMSK_TO_USDT: 0.0002,
            BNB_TO_AMSK: 3200000,
            TON_TO_AMSK: 7000
        },
        ALLOWED_PAIRS: ['USDT_to_AMSK', 'BNB_to_AMSK', 'TON_to_AMSK', 'AMSK_to_USDT']
    },
    
    // ===== ECONOMY SETTINGS (مثل REFI) =====
    CACHE: {
        USER: 5 * 60 * 1000,        // 5 دقائق
        PRICES: 3 * 60 * 60 * 1000,  // 3 ساعات
        HISTORY: 10 * 60 * 1000,      // 10 دقائق
        REFERRALS: 60 * 60 * 1000     // ساعة كاملة
    },
    
    LISTENER_LIFETIME: 30000, // 30 ثانية فقط (مثل REFI)
    
    BOT_LINK: "https://t.me/AlienMuskbot/Musk"
};

// ===== 5. ON-DEMAND LISTENERS SYSTEM - مثل REFI تماماً =====
let activeListeners = new Map();
let listenerTimeouts = new Map();

function startOnDemandListener(collection, docId, callback, timeoutMs = CONFIG.LISTENER_LIFETIME) {
    const listenerId = `${collection}_${docId}`;
    
    if (activeListeners.has(listenerId)) {
        console.log(`🛑 Stopping previous listener for ${listenerId}`);
        activeListeners.get(listenerId)();
        activeListeners.delete(listenerId);
    }
    
    if (listenerTimeouts.has(listenerId)) {
        clearTimeout(listenerTimeouts.get(listenerId));
        listenerTimeouts.delete(listenerId);
    }
    
    console.log(`👂 Starting on-demand listener for ${collection}/${docId} (${timeoutMs/1000} seconds)`);
    
    const unsubscribe = db.collection(collection).doc(docId).onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            console.log(`📡 Listener update for ${collection}/${docId}:`, data.status);
            callback(data);
            
            if (data.status === 'approved' || data.status === 'rejected') {
                console.log(`✅ Final status reached, stopping listener for ${collection}/${docId}`);
                stopOnDemandListener(listenerId);
            }
        }
    }, (error) => {
        console.error(`❌ Listener error for ${collection}/${docId}:`, error);
        stopOnDemandListener(listenerId);
    });
    
    activeListeners.set(listenerId, unsubscribe);
    
    const timeout = setTimeout(() => {
        console.log(`⏰ Listener timeout (${timeoutMs/1000} seconds) for ${collection}/${docId}`);
        stopOnDemandListener(listenerId);
    }, timeoutMs);
    
    listenerTimeouts.set(listenerId, timeout);
}

function stopOnDemandListener(listenerId) {
    if (activeListeners.has(listenerId)) {
        activeListeners.get(listenerId)();
        activeListeners.delete(listenerId);
    }
    
    if (listenerTimeouts.has(listenerId)) {
        clearTimeout(listenerTimeouts.get(listenerId));
        listenerTimeouts.delete(listenerId);
    }
    
    console.log(`🛑 On-demand listener stopped: ${listenerId}`);
}

function stopAllListeners() {
    console.log(`🛑 Stopping all active listeners (${activeListeners.size} listeners)`);
    
    activeListeners.forEach((unsubscribe) => unsubscribe());
    listenerTimeouts.forEach((timeout) => clearTimeout(timeout));
    
    activeListeners.clear();
    listenerTimeouts.clear();
}

// ===== 6. STATE MANAGEMENT =====
let userData = null;
let walletData = null;
let livePrices = {};
let currentLanguage = localStorage.getItem('preferred_language') || 'en';
let isAdmin = false;
let appInitialized = false;

// متغيرات تتبع وقت آخر تحميل (للتخزين المؤقت)
let lastUserLoadTime = 0;
let lastPricesLoadTime = 0;
let lastHistoryCheckTime = 0;

// ===== 7. USER IDENTIFICATION =====
const userId = tg?.initDataUnsafe?.user?.id?.toString() || 
               localStorage.getItem('alien_musk_user_id') || 
               'guest_' + Math.random().toString(36).substr(2, 9);

const userName = tg?.initDataUnsafe?.user?.first_name || 'Alien';

localStorage.setItem('alien_musk_user_id', userId);

// التحقق من الأدمن
isAdmin = ADMIN_TELEGRAM_IDS.includes(tg?.initDataUnsafe?.user?.id?.toString());

// ===== 8. DICTIONARY للترجمات =====
const DICTIONARY = {
    en: {
        'app.name': 'Alien Musk Quantum',
        'nav.home': 'Home',
        'nav.staking': 'Staking',
        'nav.wallet': 'Wallet',
        'nav.referral': 'Referral',
        'mining.start': 'Start Mining',
        'mining.claim': 'Claim Reward',
        'mining.level': 'Level',
        'mining.hashrate': 'Hashrate',
        'mining.next': 'Next Reward',
        'mining.total': 'Total Mined',
        'mining.today': 'Today',
        'tasks.completed': 'Completed',
        'staking.total': 'Total Staked',
        'wallet.balance': 'Total Balance',
        'wallet.assets': 'My Assets',
        'referral.count': 'Referrals',
        'referral.earned': 'AMSK Earned',
        'actions.deposit': 'Deposit',
        'actions.withdraw': 'Withdraw',
        'actions.swap': 'Swap',
        'actions.history': 'History',
        'messages.success': 'Success',
        'messages.error': 'Error',
        'messages.warning': 'Warning',
        'messages.info': 'Info',
        'notif.depositApproved': '✅ Your deposit of {amount} {currency} has been approved!',
        'notif.depositRejected': '❌ Your deposit was rejected. Reason: {reason}',
        'notif.withdrawApproved': '✅ Your withdrawal of {amount} USDT has been approved!',
        'notif.withdrawRejected': '❌ Your withdrawal was rejected. Reason: {reason}',
        'notif.referralBonus': '🎉 Someone joined with your link! You got {amount} AMSK!',
        'notif.welcomeBonus': '🎉 Welcome! You got 5,000 AMSK bonus!'
    },
    ar: {
        'app.name': 'أليون ماسك كوانتوم',
        'nav.home': 'الرئيسية',
        'nav.staking': 'الإيداع',
        'nav.wallet': 'المحفظة',
        'nav.referral': 'الدعوات',
        'mining.start': 'بدء التعدين',
        'mining.claim': 'استلام المكافأة',
        'mining.level': 'المستوى',
        'mining.hashrate': 'قوة التعدين',
        'mining.next': 'المكافأة التالية',
        'mining.total': 'الإجمالي الملغوم',
        'mining.today': 'اليوم',
        'tasks.completed': 'مكتمل',
        'staking.total': 'إجمالي الإيداع',
        'wallet.balance': 'الرصيد الإجمالي',
        'wallet.assets': 'أصولي',
        'referral.count': 'الدعوات',
        'referral.earned': 'AMSK المكتسب',
        'actions.deposit': 'إيداع',
        'actions.withdraw': 'سحب',
        'actions.swap': 'تبديل',
        'actions.history': 'السجل',
        'messages.success': 'نجاح',
        'messages.error': 'خطأ',
        'messages.warning': 'تحذير',
        'messages.info': 'معلومات',
        'notif.depositApproved': '✅ تمت الموافقة على إيداعك {amount} {currency}!',
        'notif.depositRejected': '❌ تم رفض إيداعك. السبب: {reason}',
        'notif.withdrawApproved': '✅ تمت الموافقة على سحبك {amount} USDT!',
        'notif.withdrawRejected': '❌ تم رفض سحبك. السبب: {reason}',
        'notif.referralBonus': '🎉 شخص ما انضم عبر رابطك! حصلت على {amount} AMSK!',
        'notif.welcomeBonus': '🎉 مرحباً! حصلت على 5,000 AMSK كمكافأة!'
    }
};

// ===== 9. TRANSLATION FUNCTION =====
function t(key, params = {}) {
    let text = DICTIONARY[currentLanguage]?.[key] || DICTIONARY.en[key] || key;
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    return text;
}

// ===== 10. LANGUAGE SYSTEM =====
function setLanguage(lang) {
    if (!DICTIONARY[lang]) return;
    
    currentLanguage = lang;
    localStorage.setItem('preferred_language', lang);
    
    const flagMap = { en: '🇬🇧', ar: '🇸🇦', ru: '🇷🇺', hi: '🇮🇳' };
    const langIcon = document.getElementById('languageSelectorBtn');
    if (langIcon) langIcon.textContent = flagMap[lang] || '🇬🇧';
    
    if (lang === 'ar') {
        document.body.setAttribute('lang', 'ar');
        document.documentElement.dir = 'rtl';
    } else {
        document.body.setAttribute('lang', 'en');
        document.documentElement.dir = 'ltr';
    }
    
    updateAllTexts();
    showMessage(t('messages.success'), 'success');
}

function toggleLanguage() {
    const newLang = currentLanguage === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
}

function updateAllTexts() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
}

// ===== 11. ELEMENTS CACHE =====
const elements = {};

function cacheElements() {
    elements.loadingScreen = document.getElementById('loading-screen');
    elements.loadingProgress = document.getElementById('loading-progress-bar');
    elements.loadingText = document.getElementById('loading-progress-text');
    elements.usernameMini = document.getElementById('username-mini');
    elements.userIdMini = document.getElementById('user-id-mini');
    elements.totalBalanceAmsk = document.getElementById('total-balance-amsk');
    elements.totalBalanceUsd = document.getElementById('total-balance-usd');
    elements.adminLogo = document.getElementById('admin-logo');
    elements.navBtns = document.querySelectorAll('.nav-btn');
    elements.startMiningBtn = document.getElementById('mining-action-btn');
    elements.miningTimer = document.getElementById('mining-timer');
    elements.currentMiningLevel = document.getElementById('current-mining-level');
    elements.currentHashrate = document.getElementById('current-hashrate');
    elements.nextReward = document.getElementById('next-reward');
    elements.totalMined = document.getElementById('total-mined');
    elements.minedToday = document.getElementById('mined-today');
    elements.upgradeCards = document.getElementById('upgrade-cards');
    elements.tasksGrid = document.getElementById('tasks-grid');
    elements.vipTasksGrid = document.getElementById('vip-tasks-grid');
    elements.tasksProgress = document.getElementById('tasks-progress');
    elements.tasksTabs = document.querySelectorAll('.tasks-tab');
    elements.stakingPlans = document.getElementById('staking-plans');
    elements.totalStaked = document.getElementById('total-staked');
    elements.activeStakesList = document.getElementById('active-stakes-list');
    elements.walletBalanceUsd = document.getElementById('wallet-balance-usd');
    elements.walletBalanceAmsk = document.getElementById('wallet-balance-amsk');
    elements.assetsList = document.getElementById('assets-list');
    elements.memesList = document.getElementById('memes-list');
    elements.depositBtn = document.getElementById('deposit-btn');
    elements.withdrawBtn = document.getElementById('withdraw-btn');
    elements.swapBtn = document.getElementById('swap-btn');
    elements.historyBtn = document.getElementById('history-btn');
    elements.referralLink = document.getElementById('referral-link');
    elements.copyLinkBtn = document.getElementById('copy-link-btn');
    elements.telegramShare = document.getElementById('telegram-share');
    elements.whatsappShare = document.getElementById('whatsapp-share');
    elements.refCount = document.getElementById('ref-count');
    elements.refEarned = document.getElementById('ref-earned');
    elements.milestonesList = document.getElementById('milestones-list');
    elements.scrollToTasks = document.getElementById('scroll-to-tasks');
    elements.boosterBtn = document.getElementById('booster-btn');
    elements.supportIcon = document.getElementById('support-icon');
    elements.langIcon = document.getElementById('languageSelectorBtn');
    elements.langDropdown = document.getElementById('languageDropdown');
}

// ===== 12. LOCAL STORAGE MANAGEMENT =====
const STORAGE_KEYS = {
    USER: `user_${userId}`,
    WALLET: `wallet_${userId}`,
    TRANSACTIONS: `transactions_${userId}`,
    PRICES: 'live_prices'
};

function loadLocalData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`❌ Error loading ${key}:`, error);
        return null;
    }
}

function saveLocalData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`❌ Error saving ${key}:`, error);
        return false;
    }
}

// ===== 13. INITIALIZE DEFAULT WALLET DATA =====
function initializeWalletData() {
    const today = new Date().setHours(0,0,0,0);
    
    return {
        balances: {
            AMSK: 1000,
            USDT: 0,
            BNB: 0,
            TON: 0
        },
        mining: {
            level: 1,
            active: false,
            lastReward: null,
            nextReward: null,
            totalMined: 1000,
            minedToday: 0,
            lastResetDate: today
        },
        staking: {
            activeStakes: [],
            totalEarned: 0,
            totalStaked: 0
        },
        referrals: {
            count: 0,
            earned: { amsk: 0, bnb: 0 },
            referrals: [],
            claimedMilestones: []
        },
        tasks: {
            completed: []
        },
        vipTasks: {
            claimedMiningRewards: [],
            claimedStakingRewards: []
        },
        transactionHistory: [],
        usedTxIds: [],
        pendingWithdrawals: [],
        lastUpdate: Date.now()
    };
}

// ===== 14. LOAD USER DATA - مع التخزين المؤقت (مثل REFI) =====
async function loadUserData(force = false) {
    try {
        console.log("📂 Loading user data for:", userId);
        
        const now = Date.now();
        const localData = loadLocalData(STORAGE_KEYS.USER);
        
        if (!force && localData && (now - lastUserLoadTime) < CONFIG.CACHE.USER) {
            userData = localData;
            walletData = localData.wallet || initializeWalletData();
            console.log("✅ Using cached user data (less than 5 min old)");
            updateUI();
            return;
        }
        
        if (localData) {
            userData = localData;
            walletData = localData.wallet || initializeWalletData();
            console.log("📦 Using localStorage data while fetching fresh data");
        }
        
        if (db) {
            console.log("🔥 Loading from Firebase...");
            
            const userDoc = await db.collection('users').doc(userId).get();
            
            if (userDoc.exists) {
                const fbData = userDoc.data();
                
                userData = {
                    ...userData,
                    ...fbData,
                    wallet: { ...walletData, ...fbData.wallet }
                };
                
                walletData = userData.wallet || walletData;
            } else {
                console.log("📝 Creating new user");
                walletData = initializeWalletData();
                userData = {
                    userId: userId,
                    userName: userName,
                    referralCode: generateReferralCode(),
                    referredBy: null,
                    wallet: walletData,
                    createdAt: new Date().toISOString()
                };
                
                await db.collection('users').doc(userId).set(userData);
            }
            
            lastUserLoadTime = now;
            saveLocalData(STORAGE_KEYS.USER, userData);
        }
        
        // تحميل المعاملات المحلية
        const transactions = loadLocalData(STORAGE_KEYS.TRANSACTIONS) || [];
        walletData.transactionHistory = transactions;
        
        updateUI();
        checkAdminAndAddCrown();
        
        if (hasReferralCode()) {
            await processReferral();
        }
        
    } catch (error) {
        console.error("❌ Error loading user data:", error);
    }
}

// ===== 15. SAVE USER DATA - حفظ ذكي =====
async function saveUserData(important = false) {
    if (!userData) return false;
    
    userData.wallet = walletData;
    userData.lastUpdate = Date.now();
    
    saveLocalData(STORAGE_KEYS.USER, userData);
    saveLocalData(STORAGE_KEYS.WALLET, walletData);
    saveLocalData(STORAGE_KEYS.TRANSACTIONS, walletData.transactionHistory);
    
    if (important && db) {
        try {
            await db.collection('users').doc(userId).set(userData, { merge: true });
            console.log("💾 Important data saved to Firebase");
        } catch (error) {
            console.error("❌ Error saving to Firebase:", error);
        }
    }
    
    return true;
}

// ===== 16. CHECK FOR IMPORTANT CHANGES =====
function hasImportantChanges() {
    if (!walletData) return false;
    
    return (
        walletData.balances.USDT > 0 ||
        walletData.balances.BNB > 0 ||
        walletData.balances.TON > 0 ||
        walletData.mining.level > 1 ||
        walletData.staking.activeStakes.length > 0 ||
        walletData.pendingWithdrawals.length > 0 ||
        walletData.referrals.count > 0 ||
        walletData.transactionHistory.some(tx => tx.status === 'pending')
    );
}

// ===== 17. GENERATE REFERRAL CODE =====
function generateReferralCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code + userId.slice(-4).toUpperCase();
}

function getReferralLink() {
    return `${CONFIG.BOT_LINK}?startapp=${userData?.referralCode || ''}`;
}

function hasReferralCode() {
    const urlParams = new URLSearchParams(window.location.search);
    return !!(urlParams.get('startapp') || urlParams.get('ref') || tg?.initDataUnsafe?.start_param);
}

// ===== 18. PROCESS REFERRAL - مثل REFI (يتحقق فقط عند وجود كود) =====
async function processReferral() {
    try {
        console.log("🔍 Checking for referral...");
        
        const urlParams = new URLSearchParams(window.location.search);
        let referralCode = urlParams.get('startapp') || urlParams.get('ref');
        
        if (!referralCode && tg?.initDataUnsafe?.start_param) {
            referralCode = tg.initDataUnsafe.start_param;
        }
        
        if (!referralCode) {
            console.log("ℹ️ No referral code detected");
            return;
        }
        
        if (!userData) {
            console.log("⏳ User data not loaded yet, waiting...");
            setTimeout(processReferral, 1000);
            return;
        }
        
        if (referralCode === userData.referralCode) {
            console.log("⚠️ Cannot refer yourself");
            return;
        }
        
        if (userData.referredBy) {
            console.log("✅ User already referred by:", userData.referredBy);
            return;
        }
        
        console.log("🎯 Processing referral code:", referralCode);
        
        if (!db) {
            console.log("📦 Firebase not available, saving pending referral");
            localStorage.setItem('pending_referral', referralCode);
            return;
        }
        
        const referrerQuery = await db.collection('users')
            .where('referralCode', '==', referralCode)
            .limit(1)
            .get();
        
        if (referrerQuery.empty) {
            console.log("❌ No referrer found with code:", referralCode);
            return;
        }
        
        const referrerDoc = referrerQuery.docs[0];
        const referrerId = referrerDoc.id;
        const referrerData = referrerDoc.data();
        
        if (referrerId === userId) {
            console.log("⚠️ Self-referral detected and blocked");
            return;
        }
        
        console.log("✅ Valid referrer found:", referrerId);
        
        // تحديث المحيل
        const updatedReferrals = [...(referrerData.wallet?.referrals?.referrals || []), userId];
        const updatedCount = (referrerData.wallet?.referrals?.count || 0) + 1;
        const updatedAmsk = (referrerData.wallet?.balances?.AMSK || 0) + CONFIG.REFERRAL.BONUS.REFERRER;
        
        await db.collection('users').doc(referrerId).update({
            'wallet.balances.AMSK': updatedAmsk,
            'wallet.referrals.count': updatedCount,
            'wallet.referrals.referrals': updatedReferrals,
            'wallet.referrals.earned.amsk': (referrerData.wallet?.referrals?.earned?.amsk || 0) + CONFIG.REFERRAL.BONUS.REFERRER
        });
        
        // تحديث المستخدم الجديد
        userData.referredBy = referralCode;
        walletData.balances.AMSK += CONFIG.REFERRAL.BONUS.REFERRED;
        
        await saveUserData(true);
        
        addTransactionToHistory('referral_bonus', CONFIG.REFERRAL.BONUS.REFERRED, 'AMSK', 
            'Welcome bonus from referral', 'completed', t('notif.welcomeBonus'));
        
        showMessage(t('notif.welcomeBonus'), 'success');
        updateUI();
        
    } catch (error) {
        console.error("❌ Error processing referral:", error);
    }
}

// ===== 19. ADD TRANSACTION TO HISTORY =====
function addTransactionToHistory(type, amount, currency, description = '', status = 'completed', message = '', txId = '') {
    const transactionId = 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    let iconClass = 'swap';
    let icon = 'fa-exchange-alt';
    
    if (type.includes('mining')) {
        iconClass = 'mining';
        icon = 'fa-microchip';
    } else if (type.includes('staking')) {
        iconClass = 'staking';
        icon = 'fa-gem';
    } else if (type.includes('deposit')) {
        iconClass = 'deposit';
        icon = 'fa-download';
    } else if (type.includes('withdraw')) {
        iconClass = 'withdraw';
        icon = 'fa-upload';
    } else if (type.includes('referral')) {
        iconClass = 'referral';
        icon = 'fa-users';
    }
    
    const transaction = {
        id: transactionId,
        type: type,
        amount: amount,
        currency: currency,
        description: description,
        status: status,
        message: message,
        txId: txId,
        iconClass: iconClass,
        icon: icon,
        timestamp: Date.now(),
        dateFormatted: new Date().toLocaleDateString()
    };
    
    if (!walletData.transactionHistory) {
        walletData.transactionHistory = [];
    }
    
    const isDuplicate = walletData.transactionHistory.some(tx => 
        tx.type === type && 
        tx.amount === amount && 
        tx.txId === txId &&
        Math.abs(tx.timestamp - transaction.timestamp) < 5000
    );
    
    if (!isDuplicate) {
        walletData.transactionHistory.unshift(transaction);
        
        if (walletData.transactionHistory.length > 100) {
            walletData.transactionHistory = walletData.transactionHistory.slice(0, 100);
        }
        
        saveUserData(status === 'pending');
    }
    
    return transaction;
}

// ===== 20. CHECK PENDING TRANSACTIONS - مثل REFI (يتحقق فقط عند فتح التاريخ) =====
async function checkPendingTransactions() {
    if (!db || !userData) return;
    
    const now = Date.now();
    if (now - lastHistoryCheckTime < CONFIG.CACHE.HISTORY) {
        console.log("📦 Using cached history (less than 10 minutes old)");
        return;
    }
    lastHistoryCheckTime = now;
    
    console.log("🔍 Checking for updated pending transactions...");
    
    const pendingTxs = walletData.transactionHistory?.filter(tx => 
        (tx.type === 'deposit' || tx.type === 'withdraw') && 
        tx.status === 'pending' &&
        tx.txId && !tx.txId.startsWith('temp_')
    ) || [];
    
    if (pendingTxs.length === 0) {
        console.log("✅ No pending transactions to check");
        return;
    }
    
    console.log(`⏳ Found ${pendingTxs.length} pending transactions, checking status...`);
    let updated = false;
    
    for (const tx of pendingTxs) {
        try {
            const collection = tx.type === 'deposit' ? 'deposit_requests' : 'withdrawals';
            const docRef = db.collection(collection).doc(tx.txId);
            const docSnap = await docRef.get();
            
            if (!docSnap.exists) continue;
            
            const data = docSnap.data();
            
            if (data.status !== tx.status) {
                console.log(`🔄 Transaction ${tx.txId} status changed: ${tx.status} → ${data.status}`);
                
                const index = walletData.transactionHistory.findIndex(t => t.txId === tx.txId);
                if (index !== -1) {
                    walletData.transactionHistory[index] = { 
                        ...walletData.transactionHistory[index], 
                        ...data, 
                        status: data.status 
                    };
                }
                
                if (data.status === 'approved' && tx.type === 'deposit') {
                    walletData.balances[tx.currency] += tx.amount;
                    showMessage(t('notif.depositApproved', { amount: tx.amount, currency: tx.currency }), 'success');
                }
                
                if (data.status === 'rejected' && tx.type === 'withdraw') {
                    walletData.balances[tx.currency] += tx.amount;
                    showMessage(t('notif.withdrawRejected', { reason: data.reason || 'Unknown reason' }), 'error');
                }
                
                updated = true;
            }
        } catch (error) {
            console.error(`❌ Error checking transaction ${tx.txId}:`, error);
        }
    }
    
    if (updated) {
        await saveUserData(true);
        updateUI();
        
        if (document.getElementById('historyModal')?.classList.contains('show')) {
            renderHistory();
        }
    }
}

// ===== 21. ADMIN SYSTEM =====
function checkAdminAndAddCrown() {
    if (!isAdmin) return;
    
    const addCrown = () => {
        const header = document.querySelector('.header-icons-row');
        if (!header) return false;
        
        const existingCrown = document.getElementById('adminCrownBtn');
        if (existingCrown) existingCrown.remove();
        
        const adminBtn = document.createElement('button');
        adminBtn.id = 'adminCrownBtn';
        adminBtn.className = 'support-icon';
        adminBtn.innerHTML = '<i class="fa-solid fa-crown" style="color: gold;"></i>';
        adminBtn.onclick = showAdminPanel;
        adminBtn.title = 'Admin Panel';
        
        header.insertBefore(adminBtn, document.getElementById('support-icon'));
        return true;
    };
    
    if (!addCrown()) {
        setTimeout(addCrown, 500);
    }
}

// ===== 22. SHOW ADMIN PANEL - يدوي بالكامل (مثل REFI) =====
function showAdminPanel() {
    if (!isAdmin) {
        showMessage('Access denied', 'error');
        return;
    }
    
    const modalContent = `
        <div class="modal-overlay show" id="adminModal">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fa-solid fa-crown" style="color: gold;"></i> Admin Panel</h3>
                    <button class="modal-close" onclick="closeModal('adminModal')">×</button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <button onclick="refreshAdminPanel()" class="btn-primary" style="padding: 12px 30px;">
                            <i class="fa-solid fa-rotate-right"></i> Refresh
                        </button>
                    </div>
                    
                    <div class="admin-tabs" style="display: flex; gap: 10px; margin-bottom: 20px;">
                        <button class="history-filter active" onclick="switchAdminTab('deposits')">Deposits</button>
                        <button class="history-filter" onclick="switchAdminTab('withdrawals')">Withdrawals</button>
                    </div>
                    
                    <div id="adminContent" style="max-height: 400px; overflow-y: auto;">
                        <div class="empty-stakes">
                            <i class="fa-solid fa-hand-pointer"></i>
                            <p>Click Refresh to load pending requests</p>
                        </div>
                    </div>
                    
                    <div style="margin-top: 20px;">
                        <button class="btn-secondary" style="width: 100%;" onclick="closeModal('adminModal')">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

let currentAdminTab = 'deposits';

function switchAdminTab(tab) {
    currentAdminTab = tab;
    document.querySelectorAll('.admin-tabs .history-filter').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(tab)) {
            btn.classList.add('active');
        }
    });
}

async function refreshAdminPanel() {
    if (!isAdmin || !db) return;
    
    const adminContent = document.getElementById('adminContent');
    if (!adminContent) return;
    
    adminContent.innerHTML = '<div style="text-align: center; padding: 30px;"><i class="fa-solid fa-spinner fa-spin"></i> Loading...</div>';
    
    try {
        const collection = currentAdminTab === 'deposits' ? 'deposit_requests' : 'withdrawals';
        const snapshot = await db.collection(collection).where('status', '==', 'pending').get();
        
        if (snapshot.empty) {
            adminContent.innerHTML = '<div class="empty-stakes">No pending requests found</div>';
            return;
        }
        
        let html = '';
        snapshot.forEach(doc => {
            const data = { firebaseId: doc.id, ...doc.data() };
            
            html += `
                <div class="admin-item" style="background: linear-gradient(145deg,#1e1e35,#15152a); border-radius: 12px; padding: 15px; margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: var(--quantum-green); font-weight: 600;">${data.userName || 'User'}</span>
                        <span style="color: var(--quantum-gold); font-weight: 700;">${data.amount} ${data.currency}</span>
                    </div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">
                        <div>User ID: ${data.userId?.substring(0, 10)}...</div>
                        ${data.txnId ? `<div>TX: ${data.txnId.substring(0, 16)}...</div>` : ''}
                        ${data.address ? `<div>Address: ${data.address.substring(0, 16)}...</div>` : ''}
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="approveTransaction('${data.firebaseId}', '${currentAdminTab}')" 
                                style="flex: 1; padding: 8px; background: var(--gradient-quantum); border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer;">
                            Approve
                        </button>
                        <button onclick="rejectTransaction('${data.firebaseId}', '${currentAdminTab}')" 
                                style="flex: 1; padding: 8px; background: linear-gradient(135deg, #ff4444, #cc0000); border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer;">
                            Reject
                        </button>
                    </div>
                </div>
            `;
        });
        
        adminContent.innerHTML = html;
        
    } catch (error) {
        console.error("❌ Error refreshing admin panel:", error);
        adminContent.innerHTML = '<div class="empty-stakes">Error loading data</div>';
    }
}

async function approveTransaction(firebaseId, type) {
    if (!isAdmin || !db) return;
    
    try {
        const collection = type === 'deposits' ? 'deposit_requests' : 'withdrawals';
        await db.collection(collection).doc(firebaseId).update({
            status: 'approved',
            approvedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showMessage('✅ Transaction approved', 'success');
        refreshAdminPanel();
        
    } catch (error) {
        console.error("❌ Error approving transaction:", error);
        showMessage('Error approving transaction', 'error');
    }
}

async function rejectTransaction(firebaseId, type) {
    if (!isAdmin || !db) return;
    
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    
    try {
        const collection = type === 'deposits' ? 'deposit_requests' : 'withdrawals';
        await db.collection(collection).doc(firebaseId).update({
            status: 'rejected',
            rejectionReason: reason,
            rejectedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showMessage('❌ Transaction rejected', 'warning');
        refreshAdminPanel();
        
    } catch (error) {
        console.error("❌ Error rejecting transaction:", error);
        showMessage('Error rejecting transaction', 'error');
    }
}

// ===== 23. MINING SYSTEM =====
let miningInterval = null;
let lastMiningCheck = 0;
const MINING_CHECK_INTERVAL = 60000; // دقيقة واحدة

function startMiningTimer() {
    if (miningInterval) clearInterval(miningInterval);
    
    miningInterval = setInterval(() => {
        updateMiningTimer();
    }, 1000);
}

function updateMiningTimer() {
    if (!walletData?.mining || !elements.miningTimer) return;
    
    const now = Date.now();
    
    // تحديث كل دقيقة فقط (economy mode)
    if (now - lastMiningCheck < MINING_CHECK_INTERVAL && walletData.mining.active) {
        return;
    }
    lastMiningCheck = now;
    
    const nextRewardTime = walletData.mining.nextReward;
    
    if (!nextRewardTime) {
        elements.miningTimer.textContent = "02:30:00";
        return;
    }
    
    const timeLeft = nextRewardTime - now;
    
    if (timeLeft <= 0) {
        elements.miningTimer.textContent = "READY!";
        elements.miningTimer.style.color = "var(--quantum-green)";
        
        if (elements.startMiningBtn) {
            elements.startMiningBtn.innerHTML = '<i class="fas fa-gift"></i><span>' + t('mining.claim') + '</span>';
            elements.startMiningBtn.classList.add('claim-mode');
        }
    } else {
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        elements.miningTimer.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        elements.miningTimer.style.color = "var(--text-primary)";
        
        if (elements.startMiningBtn) {
            elements.startMiningBtn.innerHTML = '<i class="fas fa-play"></i><span>' + t('mining.start') + '</span>';
            elements.startMiningBtn.classList.remove('claim-mode');
        }
    }
}

function handleMiningAction() {
    if (!walletData?.mining) return;
    
    const now = Date.now();
    
    if (!walletData.mining.active) {
        startMining();
    } else if (walletData.mining.nextReward && now >= walletData.mining.nextReward) {
        claimMiningReward();
    } else {
        showMessage("⏳ Mining in progress...", "info");
    }
}

async function startMining() {
    walletData.mining.active = true;
    walletData.mining.lastReward = Date.now();
    walletData.mining.nextReward = Date.now() + CONFIG.MINING.DURATION;
    
    updateMiningTimer();
    await saveUserData();
    showMessage("⚡ Mining started!", "success");
}

async function claimMiningReward() {
    const level = CONFIG.MINING.LEVELS[walletData.mining.level];
    const reward = level.reward;
    
    const now = new Date();
    const today = now.setHours(0,0,0,0);
    
    if (!walletData.mining.lastResetDate || walletData.mining.lastResetDate < today) {
        walletData.mining.minedToday = 0;
        walletData.mining.lastResetDate = today;
    }
    
    walletData.balances.AMSK += reward;
    walletData.mining.totalMined += reward;
    walletData.mining.minedToday += reward;
    walletData.mining.lastReward = Date.now();
    walletData.mining.nextReward = Date.now() + CONFIG.MINING.DURATION;
    
    addTransactionToHistory('mining_reward', reward, 'AMSK', 'Mining reward', 'completed');
    
    updateMiningTimer();
    updateWalletUI();
    await saveUserData();
    
    showMessage(`💰 +${reward.toLocaleString()} AMSK mined!`, "success");
}

async function upgradeMiningLevel(level) {
    const levelData = CONFIG.MINING.LEVELS[level];
    
    if (level <= walletData.mining.level) {
        showMessage("Already at this level!", "warning");
        return;
    }
    
    if (walletData.balances.USDT < levelData.cost) {
        showMessage(`⚠️ Need ${levelData.cost} USDT`, "warning");
        return;
    }
    
    walletData.balances.USDT -= levelData.cost;
    walletData.mining.level = level;
    
    addTransactionToHistory('mining_upgrade', -levelData.cost, 'USDT', `Upgrade to Level ${level}`, 'completed');
    
    checkMiningVipReward(level);
    updateMiningDisplay();
    updateWalletUI();
    await saveUserData(true);
    
    showMessage(`⚡ Upgraded to Level ${level}!`, "success");
}

function checkMiningVipReward(newLevel) {
    if (!walletData.vipTasks) {
        walletData.vipTasks = { claimedMiningRewards: [], claimedStakingRewards: [] };
    }
    
    for (let level = 2; level <= newLevel; level++) {
        const vipTask = CONFIG.VIP_TASKS.MINING[level];
        if (!vipTask) continue;
        
        if (!walletData.vipTasks.claimedMiningRewards.includes(level)) {
            showMessage(`🏆 VIP Task available: Claim ${vipTask.reward.toLocaleString()} AMSK for Level ${level}!`, "success");
        }
    }
    
    updateVipTasksDisplay();
}

function updateMiningDisplay() {
    if (!walletData?.mining) return;
    
    const level = CONFIG.MINING.LEVELS[walletData.mining.level];
    
    if (elements.currentMiningLevel) {
        elements.currentMiningLevel.textContent = walletData.mining.level;
    }
    
    if (elements.currentHashrate) {
        elements.currentHashrate.textContent = level.hashrate.toLocaleString();
    }
    
    if (elements.nextReward) {
        elements.nextReward.textContent = level.reward.toLocaleString();
    }
    
    if (elements.totalMined) {
        elements.totalMined.textContent = walletData.mining.totalMined.toLocaleString();
    }
    
    if (elements.minedToday) {
        elements.minedToday.textContent = walletData.mining.minedToday.toLocaleString();
    }
    
    updateUpgradeCards();
}

function updateUpgradeCards() {
    if (!elements.upgradeCards) return;
    
    const currentLevel = walletData.mining.level;
    const usdtBalance = walletData.balances.USDT;

    let html = '';
    
    for (let level = 1; level <= 5; level++) {
        const levelData = CONFIG.MINING.LEVELS[level];
        if (!levelData) continue;
        
        const isActive = level === currentLevel;
        const isLocked = level > currentLevel;
        
        let buttonText = '';
        let buttonClass = '';
        let disabled = false;

        if (isActive) {
            buttonText = 'Active';
            buttonClass = 'active-btn';
            disabled = true;
        } else if (!isLocked) {
            buttonText = 'Upgraded';
            buttonClass = 'active-btn';
            disabled = true;
        } else {
            buttonText = `Upgrade (${levelData.cost} USDT)`;
            disabled = usdtBalance < levelData.cost;
        }

        html += `
            <div class="upgrade-card ${isActive ? 'active' : ''}" data-level="${level}">
                <div class="upgrade-header">
                    <span class="upgrade-level">Level ${level}</span>
                    <span class="upgrade-name">${levelData.name}</span>
                </div>
                <div class="upgrade-price-tag">💰 ${levelData.cost > 0 ? levelData.cost + ' USDT' : 'Free'}</div>
                <div class="upgrade-stats">
                    <div class="upgrade-stat">
                        <i class="fas fa-microchip"></i>
                        <span>${levelData.hashrate.toLocaleString()} Hash/s</span>
                    </div>
                    <div class="upgrade-stat">
                        <i class="fas fa-gift"></i>
                        <span>${levelData.reward.toLocaleString()} AMSK/2.5h</span>
                    </div>
                </div>
                <button class="upgrade-btn ${buttonClass}" 
                        data-level="${level}" 
                        ${disabled ? 'disabled' : ''}
                        onclick="upgradeMiningLevel(${level})">
                    ${buttonText}
                </button>
            </div>
        `;
    }
    
    elements.upgradeCards.innerHTML = html;
}

// ===== 24. TASKS SYSTEM =====
function updateTasksDisplay() {
    if (!elements.tasksGrid || !elements.tasksProgress) return;
    
    if (!walletData.tasks) {
        walletData.tasks = { completed: [] };
    }
    
    const completed = walletData.tasks.completed || [];
    const totalTasks = Object.keys(CONFIG.TASKS).length;
    
    elements.tasksProgress.textContent = `${completed.length}/${totalTasks} ${t('tasks.completed')}`;

    let html = '';
    for (let i = 1; i <= totalTasks; i++) {
        const task = CONFIG.TASKS[i];
        const isCompleted = completed.includes(i);
        
        html += `
            <div class="task-item ${isCompleted ? 'completed' : ''}" data-task-id="${i}">
                <div class="task-icon"><i class="${task.icon}"></i></div>
                <div class="task-name">${task.name}</div>
                <div class="task-reward">+${task.reward.toLocaleString()} AMSK</div>
                <button class="task-btn ${isCompleted ? 'done' : 'start'}" 
                        ${isCompleted ? 'disabled' : ''} 
                        onclick="handleTaskClick(${i})">
                    ${isCompleted ? '✓ Done' : 'Start'}
                </button>
            </div>
        `;
    }
    elements.tasksGrid.innerHTML = html;
    
    updateVipTasksDisplay();
}

window.handleTaskClick = function(taskId) {
    const task = CONFIG.TASKS[taskId];
    if (!task) return;
    
    if (walletData.tasks.completed.includes(taskId)) {
        showMessage("Task already completed", "info");
        return;
    }
    
    window.open(task.url, '_blank');
    
    setTimeout(() => {
        if (confirm(`Did you complete "${task.name}"?`)) {
            markTaskCompleted(taskId);
        }
    }, 1000);
};

async function markTaskCompleted(taskId) {
    if (walletData.tasks.completed.includes(taskId)) return;
    
    walletData.tasks.completed.push(taskId);
    walletData.balances.AMSK += CONFIG.TASKS[taskId].reward;
    
    addTransactionToHistory('task_reward', CONFIG.TASKS[taskId].reward, 'AMSK', `Task: ${CONFIG.TASKS[taskId].name}`, 'completed');
    
    updateTasksDisplay();
    updateWalletUI();
    await saveUserData();
    
    showMessage(`✅ +${CONFIG.TASKS[taskId].reward.toLocaleString()} AMSK earned!`, "success");
}

function updateVipTasksDisplay() {
    if (!elements.vipTasksGrid) return;
    
    if (!walletData.vipTasks) {
        walletData.vipTasks = { claimedMiningRewards: [], claimedStakingRewards: [] };
    }
    
    const currentLevel = walletData.mining.level;
    
    let html = '';
    
    // Mining VIP Tasks
    html += `
        <div class="vip-task-category">
            <h5><i class="fas fa-rocket"></i> Mining Level Rewards</h5>
    `;
    
    for (let level = 2; level <= 5; level++) {
        const task = CONFIG.VIP_TASKS.MINING[level];
        if (!task) continue;
        
        const isClaimed = walletData.vipTasks.claimedMiningRewards.includes(level);
        const isAvailable = currentLevel >= level && !isClaimed;
        
        let statusButton = '';
        if (isClaimed) {
            statusButton = `<button class="vip-task-btn claimed" disabled>✓ Claimed</button>`;
        } else if (isAvailable) {
            statusButton = `<button class="vip-task-btn claim" onclick="claimVipTask('mining', ${level}, ${task.reward}, '${task.name}')">Claim</button>`;
        } else {
            statusButton = `<button class="vip-task-btn locked" disabled>🔒 Level ${level}</button>`;
        }
        
        html += `
            <div class="vip-task-item ${isClaimed ? 'completed' : ''}">
                <div class="vip-task-icon"><i class="${task.icon}"></i></div>
                <div class="vip-task-details">
                    <div class="vip-task-name">${task.name}</div>
                    <div class="vip-task-reward">+${task.reward.toLocaleString()} AMSK</div>
                </div>
                <div class="vip-task-status">${statusButton}</div>
            </div>
        `;
    }
    
    html += `</div>`;
    
    // Staking VIP Tasks
    html += `
        <div class="vip-task-category">
            <h5><i class="fas fa-gem"></i> First Staking Rewards</h5>
    `;
    
    for (let [planKey, task] of Object.entries(CONFIG.VIP_TASKS.STAKING)) {
        const isClaimed = walletData.vipTasks.claimedStakingRewards.includes(planKey);
        
        const hasActiveStake = walletData.staking.activeStakes.some(stake => {
            const plan = CONFIG.STAKING.PLANS[stake.planId];
            return plan?.name.toLowerCase() === planKey;
        });
        
        let statusButton = '';
        if (isClaimed) {
            statusButton = `<button class="vip-task-btn claimed" disabled>✓ Claimed</button>`;
        } else if (hasActiveStake) {
            statusButton = `<button class="vip-task-btn claim" onclick="claimVipTask('staking', '${planKey}', ${task.reward}, '${task.name}')">Claim</button>`;
        } else {
            statusButton = `<button class="vip-task-btn locked" disabled>🔒 Need Stake</button>`;
        }
        
        html += `
            <div class="vip-task-item ${isClaimed ? 'completed' : ''}">
                <div class="vip-task-icon"><i class="${task.icon}"></i></div>
                <div class="vip-task-details">
                    <div class="vip-task-name">${task.name}</div>
                    <div class="vip-task-reward">+${task.reward.toLocaleString()} AMSK</div>
                </div>
                <div class="vip-task-status">${statusButton}</div>
            </div>
        `;
    }
    
    html += `</div>`;
    
    elements.vipTasksGrid.innerHTML = html;
}

window.claimVipTask = async function(type, id, reward, taskName) {
    if (type === 'mining') {
        if (walletData.vipTasks.claimedMiningRewards.includes(id)) {
            showMessage("Already claimed!", "warning");
            return;
        }
        walletData.vipTasks.claimedMiningRewards.push(id);
    } else {
        if (walletData.vipTasks.claimedStakingRewards.includes(id)) {
            showMessage("Already claimed!", "warning");
            return;
        }
        walletData.vipTasks.claimedStakingRewards.push(id);
    }
    
    walletData.balances.AMSK += reward;
    
    addTransactionToHistory('vip_task_reward', reward, 'AMSK', `VIP Task: ${taskName}`, 'completed');
    
    updateVipTasksDisplay();
    updateWalletUI();
    await saveUserData();
    
    showMessage(`✅ Claimed ${reward.toLocaleString()} AMSK!`, "success");
};

// ===== 25. WALLET UI UPDATE =====
function updateWalletUI() {
    if (!walletData?.balances) return;
    
    const AMSK = walletData.balances.AMSK || 0;
    const USDT = walletData.balances.USDT || 0;
    const BNB = walletData.balances.BNB || 0;
    const TON = walletData.balances.TON || 0;
    
    const totalUSD = (AMSK * CONFIG.PRICES.AMSK) + USDT + (BNB * livePrices.BNB || CONFIG.PRICES.BNB) + (TON * livePrices.TON || CONFIG.PRICES.TON);
    
    if (elements.totalBalanceAmsk) {
        elements.totalBalanceAmsk.textContent = AMSK.toLocaleString();
    }
    
    if (elements.totalBalanceUsd) {
        elements.totalBalanceUsd.textContent = totalUSD.toFixed(2);
    }
    
    if (elements.walletBalanceUsd) {
        elements.walletBalanceUsd.textContent = `$${totalUSD.toFixed(2)}`;
    }
    
    if (elements.walletBalanceAmsk) {
        elements.walletBalanceAmsk.textContent = `${AMSK.toLocaleString()} AMSK`;
    }
    
    renderAssets();
}

function renderAssets() {
    if (!elements.assetsList || !walletData?.balances) return;
    
    const assets = [
        { symbol: 'AMSK', name: 'AMSK Token', balance: walletData.balances.AMSK, icon: 'fa-coins', color: 'amsk' },
        { symbol: 'USDT', name: 'Tether', balance: walletData.balances.USDT, icon: 'fa-dollar-sign', color: 'usdt' },
        { symbol: 'BNB', name: 'BNB', balance: walletData.balances.BNB, icon: 'fa-btc', color: 'bnb' },
        { symbol: 'TON', name: 'TON', balance: walletData.balances.TON, icon: 'fa-bolt', color: 'ton' }
    ];
    
    let html = '';
    assets.forEach(asset => {
        const usdValue = asset.symbol === 'AMSK' ? asset.balance * CONFIG.PRICES.AMSK :
                        asset.symbol === 'USDT' ? asset.balance :
                        asset.balance * (livePrices[asset.symbol] || CONFIG.PRICES[asset.symbol] || 0);
        
        html += `
            <div class="asset-item">
                <div class="asset-icon ${asset.color}">
                    <i class="fas ${asset.icon}"></i>
                </div>
                <div class="asset-details">
                    <div class="asset-name">${asset.name}</div>
                    <div class="asset-balance">${asset.balance.toLocaleString()} ${asset.symbol}</div>
                </div>
                <div class="asset-value">$${usdValue.toFixed(2)}</div>
            </div>
        `;
    });
    
    elements.assetsList.innerHTML = html;
}

// ===== 26. STAKING SYSTEM =====
function renderStakingPlans() {
    if (!elements.stakingPlans) return;
    
    let html = '';
    for (let [id, plan] of Object.entries(CONFIG.STAKING.PLANS)) {
        html += `
            <div class="plan-item">
                <div class="plan-name">${plan.name}</div>
                <div class="plan-amount">${plan.minAmount}+ USDT</div>
                <div class="plan-duration">${plan.duration} Days</div>
                <div class="plan-apr">${plan.apr}% APR</div>
                <div class="plan-reward">
                    Daily: ${plan.dailyPer10?.toLocaleString() || plan.dailyPer50?.toLocaleString() || plan.dailyPer100?.toLocaleString()} AMSK
                </div>
                <button class="stake-plan-btn" onclick="openStakeModal(${id})">Stake Now</button>
            </div>
        `;
    }
    
    elements.stakingPlans.innerHTML = html;
    
    if (elements.totalStaked) {
        elements.totalStaked.textContent = `${walletData.staking.totalStaked} USDT`;
    }
}

function openStakeModal(planId) {
    const plan = CONFIG.STAKING.PLANS[planId];
    if (!plan) return;
    
    const usdtBalance = walletData.balances.USDT || 0;
    
    const modalContent = `
        <div class="modal-overlay show" id="stakeModal">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-gem"></i> ${plan.name} Staking</h3>
                    <button class="modal-close" onclick="closeModal('stakeModal')">×</button>
                </div>
                <div class="modal-body">
                    <div style="background: rgba(0,0,0,0.3); border-radius: 16px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span>Plan:</span>
                            <span style="color: var(--quantum-purple); font-weight: 600;">${plan.name}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span>Duration:</span>
                            <span>${plan.duration} Days</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span>APR:</span>
                            <span style="color: var(--quantum-green); font-weight: 600;">${plan.apr}%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Your Balance:</span>
                            <span>$${usdtBalance.toFixed(2)} USDT</span>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px;">Amount (USDT)</label>
                        <input type="number" id="stakeAmount" class="link-input" 
                               placeholder="Enter amount" min="${plan.minAmount}" value="${plan.minAmount}" step="0.01">
                        <button onclick="setMaxStakeAmount(${planId})" 
                                style="width: 100%; margin-top: 8px; padding: 8px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: var(--quantum-blue);">
                            MAX
                        </button>
                    </div>
                    
                    <div style="background: rgba(0,255,136,0.1); border-radius: 12px; padding: 15px; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span>Daily Reward:</span>
                            <span id="dailyReward" style="color: var(--quantum-green);">0 AMSK</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Total Reward:</span>
                            <span id="totalReward" style="color: var(--quantum-green);">0 AMSK</span>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-secondary" style="flex: 1;" onclick="closeModal('stakeModal')">Cancel</button>
                        <button class="btn-primary" style="flex: 1;" onclick="confirmStaking(${planId})">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    setTimeout(() => {
        calculateStakeReward(planId);
        document.getElementById('stakeAmount').addEventListener('input', () => calculateStakeReward(planId));
    }, 100);
}

function setMaxStakeAmount(planId) {
    const plan = CONFIG.STAKING.PLANS[planId];
    const amountInput = document.getElementById('stakeAmount');
    if (amountInput) {
        amountInput.value = walletData.balances.USDT.toFixed(2);
        calculateStakeReward(planId);
    }
}

function calculateStakeReward(planId) {
    const plan = CONFIG.STAKING.PLANS[planId];
    const amountInput = document.getElementById('stakeAmount');
    if (!amountInput) return;
    
    const amount = parseFloat(amountInput.value) || 0;
    
    let dailyReward = 0;
    let totalReward = 0;
    
    if (plan.name === "Silver") {
        dailyReward = (amount / 10) * plan.dailyPer10;
        totalReward = (amount / 10) * plan.totalPer10;
    } else if (plan.name === "Gold") {
        dailyReward = (amount / 50) * plan.dailyPer50;
        totalReward = (amount / 50) * plan.totalPer50;
    } else if (plan.name === "Diamond") {
        dailyReward = (amount / 100) * plan.dailyPer100;
        totalReward = (amount / 100) * plan.totalPer100;
    }
    
    const dailyEl = document.getElementById('dailyReward');
    const totalEl = document.getElementById('totalReward');
    
    if (dailyEl) dailyEl.textContent = `${Math.floor(dailyReward).toLocaleString()} AMSK`;
    if (totalEl) totalEl.textContent = `${Math.floor(totalReward).toLocaleString()} AMSK`;
}

async function confirmStaking(planId) {
    const plan = CONFIG.STAKING.PLANS[planId];
    const amountInput = document.getElementById('stakeAmount');
    
    if (!amountInput) return;
    
    const amount = parseFloat(amountInput.value);
    
    if (isNaN(amount) || amount < plan.minAmount) {
        showMessage(`Minimum stake is ${plan.minAmount} USDT`, "error");
        return;
    }
    
    if (walletData.balances.USDT < amount) {
        showMessage("Insufficient USDT balance", "error");
        return;
    }
    
    walletData.balances.USDT -= amount;
    
    const stake = {
        planId: planId,
        amount: amount,
        startTime: Date.now(),
        duration: plan.duration
    };
    
    walletData.staking.activeStakes.push(stake);
    walletData.staking.totalStaked += amount;
    
    addTransactionToHistory('staking_start', -amount, 'USDT', `${plan.name} Plan`, 'completed');
    
    checkStakingVipReward(planId, plan.name);
    
    closeModal('stakeModal');
    updateWalletUI();
    updateStakingDisplay();
    await saveUserData(true);
    
    showMessage(`✅ Staked ${amount} USDT!`, "success");
}

function checkStakingVipReward(planId, planName) {
    if (!walletData.vipTasks) {
        walletData.vipTasks = { claimedMiningRewards: [], claimedStakingRewards: [] };
    }
    
    let planKey = '';
    if (planName.toLowerCase().includes('silver')) planKey = 'silver';
    else if (planName.toLowerCase().includes('gold')) planKey = 'gold';
    else if (planName.toLowerCase().includes('diamond')) planKey = 'diamond';
    else return;
    
    const vipTask = CONFIG.VIP_TASKS.STAKING[planKey];
    if (!vipTask) return;
    
    if (!walletData.vipTasks.claimedStakingRewards.includes(planKey)) {
        showMessage(`🏆 VIP Task available: Claim ${vipTask.reward.toLocaleString()} AMSK for ${planName} Staking!`, "success");
    }
}

function updateStakingDisplay() {
    if (!walletData?.staking) return;
    
    if (elements.totalStaked) {
        elements.totalStaked.textContent = `${walletData.staking.totalStaked} USDT`;
    }
    
    if (!elements.activeStakesList) return;
    
    const activeStakes = walletData.staking.activeStakes || [];
    
    if (activeStakes.length === 0) {
        elements.activeStakesList.innerHTML = `
            <div class="empty-stakes">
                <i class="fas fa-inbox"></i>
                <p>No active stakes yet</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    activeStakes.forEach((stake, index) => {
        const plan = CONFIG.STAKING.PLANS[stake.planId];
        if (!plan) return;
        
        const now = Date.now();
        const endTime = stake.startTime + (plan.duration * 24 * 60 * 60 * 1000);
        const daysLeft = Math.ceil((endTime - now) / (24 * 60 * 60 * 1000));
        
        html += `
            <div class="stake-item" style="background: linear-gradient(145deg,#1e1e35,#15152a); border-radius: 12px; padding: 15px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: var(--quantum-purple); font-weight: 600;">${plan.name}</span>
                    <span style="color: var(--quantum-green);">${stake.amount} USDT</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--text-secondary);">
                    <span>${daysLeft} days left</span>
                    <span>${plan.apr}% APR</span>
                </div>
            </div>
        `;
    });
    
    elements.activeStakesList.innerHTML = html;
}

// ===== 27. DEPOSIT SYSTEM - مع On-Demand Listener (مثل REFI) =====
function openDepositModal() {
    const modalContent = `
        <div class="modal-overlay show" id="depositModal">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-download"></i> Deposit Funds</h3>
                    <button class="modal-close" onclick="closeModal('depositModal')">×</button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px;">Currency</label>
                        <select id="depositCurrency" class="link-input" onchange="updateDepositInfo()">
                            <option value="USDT">USDT (BEP20)</option>
                            <option value="BNB">BNB (BEP20)</option>
                            <option value="TON">TON</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px;">Amount</label>
                        <input type="number" id="depositAmount" class="link-input" placeholder="Enter amount" min="5" step="0.01">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px;">Transaction ID (TXID)</label>
                        <input type="text" id="depositTxId" class="link-input" placeholder="0x... (66 characters)" oninput="validateTxId()">
                        <div id="txIdValidation" style="font-size: 11px; margin-top: 5px; display: none;"></div>
                    </div>
                    
                    <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 15px; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span>Send to:</span>
                            <button onclick="copyToClipboard('${CONFIG.DEPOSIT.ADDRESSES.USDT}')" 
                                    style="background: none; border: none; color: var(--quantum-blue); cursor: pointer;">
                                <i class="far fa-copy"></i> Copy
                            </button>
                        </div>
                        <code style="word-break: break-all; font-size: 12px;" id="depositAddress">${CONFIG.DEPOSIT.ADDRESSES.USDT}</code>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-secondary" style="flex: 1;" onclick="closeModal('depositModal')">Cancel</button>
                        <button class="btn-primary" style="flex: 1;" id="submitDepositBtn" onclick="submitDeposit()" disabled>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

function updateDepositInfo() {
    const currency = document.getElementById('depositCurrency')?.value || 'USDT';
    const addressEl = document.getElementById('depositAddress');
    if (addressEl) {
        addressEl.textContent = CONFIG.DEPOSIT.ADDRESSES[currency] || CONFIG.DEPOSIT.ADDRESSES.USDT;
    }
}

function validateTxId() {
    const txId = document.getElementById('depositTxId')?.value.trim() || '';
    const validationDiv = document.getElementById('txIdValidation');
    const submitBtn = document.getElementById('submitDepositBtn');
    const currency = document.getElementById('depositCurrency')?.value || 'USDT';
    
    if (!validationDiv || !submitBtn) return;
    
    if (!txId) {
        validationDiv.style.display = 'none';
        submitBtn.disabled = true;
        return;
    }
    
    if (walletData.usedTxIds?.includes(txId)) {
        validationDiv.innerHTML = '⚠️ This TX ID has already been used';
        validationDiv.style.color = '#ff4444';
        validationDiv.style.display = 'block';
        submitBtn.disabled = true;
        return;
    }
    
    let isValid = false;
    
    if (currency === 'USDT' || currency === 'BNB') {
        isValid = txId.startsWith('0x') && txId.length === 66;
    } else if (currency === 'TON') {
        isValid = txId.length >= 40 && txId.length <= 70;
    }
    
    if (isValid) {
        validationDiv.innerHTML = '✅ Valid transaction hash';
        validationDiv.style.color = 'var(--quantum-green)';
        validationDiv.style.display = 'block';
        submitBtn.disabled = false;
    } else {
        validationDiv.innerHTML = '❌ Invalid transaction hash';
        validationDiv.style.color = '#ff4444';
        validationDiv.style.display = 'block';
        submitBtn.disabled = true;
    }
}

async function submitDeposit() {
    const currency = document.getElementById('depositCurrency')?.value || 'USDT';
    const amount = parseFloat(document.getElementById('depositAmount')?.value);
    const txId = document.getElementById('depositTxId')?.value.trim();
    
    if (!amount || amount < CONFIG.DEPOSIT.MIN_AMOUNTS[currency]) {
        showMessage(`Minimum deposit is ${CONFIG.DEPOSIT.MIN_AMOUNTS[currency]} ${currency}`, "error");
        return;
    }
    
    if (!txId) {
        showMessage("Please enter transaction ID", "error");
        return;
    }
    
    if (!walletData.usedTxIds) walletData.usedTxIds = [];
    if (walletData.usedTxIds.includes(txId)) {
        showMessage("This TX ID has already been used", "error");
        return;
    }
    
    walletData.usedTxIds.push(txId);
    
    const depositRequest = {
        userId: userId,
        userName: userName,
        currency: currency,
        amount: amount,
        txnId: txId,
        status: 'pending',
        timestamp: new Date().toISOString(),
        type: 'deposit'
    };
    
    const submitBtn = document.getElementById('submitDepositBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }
    
    try {
        let firebaseId = null;
        
        if (db) {
            const docRef = await db.collection('deposit_requests').add(depositRequest);
            firebaseId = docRef.id;
            
            // On-Demand Listener - 30 ثانية فقط (مثل REFI)
            startOnDemandListener('deposit_requests', docRef.id, (data) => {
                if (data.status === 'approved') {
                    walletData.balances[currency] += amount;
                    saveUserData(true);
                    updateWalletUI();
                    showMessage(t('notif.depositApproved', { amount, currency }), 'success');
                    
                } else if (data.status === 'rejected') {
                    showMessage(t('notif.depositRejected', { reason: data.reason || 'Unknown' }), 'error');
                }
            });
        }
        
        addTransactionToHistory('deposit_request', amount, currency, `TX: ${txId.slice(0, 10)}...`, 'pending', 'Waiting for approval', firebaseId || txId);
        
        closeModal('depositModal');
        showMessage(t('success.depositSubmitted', { amount, currency }), 'success');
        await saveUserData(true);
        
    } catch (error) {
        console.error("❌ Deposit error:", error);
        showMessage("Failed to submit deposit", "error");
        walletData.usedTxIds = walletData.usedTxIds.filter(id => id !== txId);
    }
}

// ===== 28. WITHDRAW SYSTEM - مع On-Demand Listener (مثل REFI) =====
function openWithdrawModal() {
    if (walletData.balances.USDT < CONFIG.WITHDRAW.MIN_USDT) {
        showMessage(`Minimum withdrawal is ${CONFIG.WITHDRAW.MIN_USDT} USDT`, "warning");
        return;
    }
    
    if (walletData.balances.BNB < CONFIG.WITHDRAW.FEE_BNB) {
        showMessage(`You need ${CONFIG.WITHDRAW.FEE_BNB} BNB for fee`, "error");
        return;
    }
    
    const modalContent = `
        <div class="modal-overlay show" id="withdrawModal">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-upload"></i> Withdraw USDT</h3>
                    <button class="modal-close" onclick="closeModal('withdrawModal')">×</button>
                </div>
                <div class="modal-body">
                    <div style="background: rgba(0,0,0,0.3); border-radius: 16px; padding: 15px; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>Balance:</span>
                            <span style="color: var(--quantum-green);">${walletData.balances.USDT.toFixed(2)} USDT</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>BNB for Fee:</span>
                            <span style="color: ${walletData.balances.BNB >= CONFIG.WITHDRAW.FEE_BNB ? 'var(--quantum-green)' : '#ff4444'};">
                                ${walletData.balances.BNB.toFixed(4)} BNB
                            </span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Network Fee:</span>
                            <span style="color: var(--quantum-gold);">${CONFIG.WITHDRAW.FEE_BNB} BNB</span>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px;">Amount (USDT)</label>
                        <input type="number" id="withdrawAmount" class="link-input" 
                               placeholder="Enter amount" min="${CONFIG.WITHDRAW.MIN_USDT}" max="${walletData.balances.USDT}" step="0.01">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px;">Wallet Address (BEP20)</label>
                        <input type="text" id="withdrawAddress" class="link-input" placeholder="0x... (42 characters)" oninput="validateAddress()">
                        <div id="addressValidation" style="font-size: 11px; margin-top: 5px; display: none;"></div>
                    </div>
                    
                    <div style="background: rgba(255,193,7,0.1); border-radius: 8px; padding: 10px; margin-bottom: 20px;">
                        <p style="color: #ffc107; font-size: 12px; text-align: center;">
                            <i class="fas fa-info-circle"></i> Funds will be deducted immediately upon request
                        </p>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-secondary" style="flex: 1;" onclick="closeModal('withdrawModal')">Cancel</button>
                        <button class="btn-primary" style="flex: 1;" id="submitWithdrawBtn" onclick="submitWithdraw()" disabled>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

function validateAddress() {
    const address = document.getElementById('withdrawAddress')?.value.trim() || '';
    const validationDiv = document.getElementById('addressValidation');
    const submitBtn = document.getElementById('submitWithdrawBtn');
    
    if (!validationDiv || !submitBtn) return;
    
    if (!address) {
        validationDiv.style.display = 'none';
        submitBtn.disabled = true;
        return;
    }
    
    const isValid = address.startsWith('0x') && address.length === 42;
    
    if (isValid) {
        validationDiv.innerHTML = '✅ Valid address';
        validationDiv.style.color = 'var(--quantum-green)';
        validationDiv.style.display = 'block';
        submitBtn.disabled = false;
    } else {
        validationDiv.innerHTML = '❌ Invalid address (must start with 0x and be 42 characters)';
        validationDiv.style.color = '#ff4444';
        validationDiv.style.display = 'block';
        submitBtn.disabled = true;
    }
}

async function submitWithdraw() {
    const amount = parseFloat(document.getElementById('withdrawAmount')?.value);
    const address = document.getElementById('withdrawAddress')?.value.trim();
    
    if (!amount || amount < CONFIG.WITHDRAW.MIN_USDT) {
        showMessage(`Minimum withdrawal is ${CONFIG.WITHDRAW.MIN_USDT} USDT`, "error");
        return;
    }
    
    if (amount > walletData.balances.USDT) {
        showMessage("Insufficient balance", "error");
        return;
    }
    
    if (!address || !address.startsWith('0x') || address.length !== 42) {
        showMessage("Invalid wallet address", "error");
        return;
    }
    
    if (walletData.balances.BNB < CONFIG.WITHDRAW.FEE_BNB) {
        showMessage(`You need ${CONFIG.WITHDRAW.FEE_BNB} BNB for fee`, "error");
        return;
    }
    
    walletData.balances.USDT -= amount;
    walletData.balances.BNB -= CONFIG.WITHDRAW.FEE_BNB;
    
    const withdrawRequest = {
        userId: userId,
        userName: userName,
        amount: amount,
        address: address,
        fee: CONFIG.WITHDRAW.FEE_BNB,
        feeCurrency: 'BNB',
        status: 'pending',
        timestamp: new Date().toISOString(),
        type: 'withdraw'
    };
    
    const submitBtn = document.getElementById('submitWithdrawBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }
    
    try {
        let firebaseId = null;
        
        if (db) {
            const docRef = await db.collection('withdrawals').add(withdrawRequest);
            firebaseId = docRef.id;
            
            // On-Demand Listener - 30 ثانية فقط (مثل REFI)
            startOnDemandListener('withdrawals', docRef.id, (data) => {
                if (data.status === 'approved') {
                    showMessage(t('notif.withdrawApproved', { amount }), 'success');
                    
                } else if (data.status === 'rejected') {
                    walletData.balances.USDT += amount;
                    walletData.balances.BNB += CONFIG.WITHDRAW.FEE_BNB;
                    saveUserData(true);
                    updateWalletUI();
                    showMessage(t('notif.withdrawRejected', { reason: data.reason || 'Unknown' }), 'error');
                }
            });
        }
        
        if (!walletData.pendingWithdrawals) walletData.pendingWithdrawals = [];
        walletData.pendingWithdrawals.push({
            id: firebaseId || 'temp_' + Date.now(),
            amount: amount,
            address: address
        });
        
        addTransactionToHistory('withdrawal_request', -amount, 'USDT', `To: ${address.slice(0, 10)}...`, 'pending', 'Funds deducted, waiting for approval', firebaseId);
        
        closeModal('withdrawModal');
        updateWalletUI();
        await saveUserData(true);
        
        showMessage(`✅ Withdrawal request submitted for ${amount} USDT`, "success");
        
    } catch (error) {
        console.error("❌ Withdraw error:", error);
        walletData.balances.USDT += amount;
        walletData.balances.BNB += CONFIG.WITHDRAW.FEE_BNB;
        updateWalletUI();
        showMessage("Failed to submit withdrawal", "error");
    }
}

// ===== 29. SWAP SYSTEM =====
function openSwapModal() {
    const modalContent = `
        <div class="modal-overlay show" id="swapModal">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-exchange-alt"></i> Swap Tokens</h3>
                    <button class="modal-close" onclick="closeModal('swapModal')">×</button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 20px;">
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="flex: 1;">
                                <label style="display: block; margin-bottom: 5px;">From</label>
                                <select id="swapFrom" class="link-input" onchange="updateSwapRates()">
                                    <option value="USDT">USDT</option>
                                    <option value="BNB">BNB</option>
                                    <option value="TON">TON</option>
                                    <option value="AMSK">AMSK</option>
                                </select>
                            </div>
                            <div style="font-size: 20px; cursor: pointer;" onclick="swapCurrencies()">
                                <i class="fas fa-exchange-alt"></i>
                            </div>
                            <div style="flex: 1;">
                                <label style="display: block; margin-bottom: 5px;">To</label>
                                <select id="swapTo" class="link-input" onchange="updateSwapRates()">
                                    <option value="AMSK">AMSK</option>
                                    <option value="USDT">USDT</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <input type="number" id="swapFromAmount" class="link-input" placeholder="Amount" oninput="updateSwapCalculation()">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <div style="display: flex; gap: 5px;">
                            <button class="swap-quick-btn" onclick="setSwapPercentage(25)">25%</button>
                            <button class="swap-quick-btn" onclick="setSwapPercentage(50)">50%</button>
                            <button class="swap-quick-btn" onclick="setSwapPercentage(75)">75%</button>
                            <button class="swap-quick-btn" onclick="setSwapPercentage(100)">MAX</button>
                        </div>
                    </div>
                    
                    <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 15px; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span>You receive:</span>
                            <span id="swapToAmount" style="color: var(--quantum-green); font-weight: 600;">0</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 12px;">
                            <span id="swapRateText">1 USDT = 5,000 AMSK</span>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-secondary" style="flex: 1;" onclick="closeModal('swapModal')">Cancel</button>
                        <button class="btn-primary" style="flex: 1;" id="confirmSwapBtn" onclick="confirmSwap()" disabled>Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
    updateSwapRates();
}

function swapCurrencies() {
    const from = document.getElementById('swapFrom');
    const to = document.getElementById('swapTo');
    if (from && to) {
        const fromVal = from.value;
        const toVal = to.value;
        from.value = toVal;
        to.value = fromVal;
        updateSwapRates();
    }
}

function setSwapPercentage(percentage) {
    const from = document.getElementById('swapFrom')?.value;
    const fromInput = document.getElementById('swapFromAmount');
    if (!fromInput || !from) return;
    
    const balance = walletData.balances[from] || 0;
    fromInput.value = (balance * percentage / 100).toFixed(from === 'BNB' ? 4 : 2);
    updateSwapCalculation();
}

function updateSwapRates() {
    const from = document.getElementById('swapFrom')?.value;
    const to = document.getElementById('swapTo')?.value;
    const rateEl = document.getElementById('swapRateText');
    const confirmBtn = document.getElementById('confirmSwapBtn');
    
    if (!rateEl || !confirmBtn) return;
    
    const pair = `${from}_to_${to}`;
    const isAllowed = CONFIG.SWAP.ALLOWED_PAIRS.includes(pair);
    
    if (!isAllowed) {
        rateEl.textContent = "Swap not allowed";
        confirmBtn.disabled = true;
        return;
    }
    
    if (from === 'USDT' && to === 'AMSK') {
        rateEl.textContent = `1 USDT = ${CONFIG.SWAP.RATES.USDT_TO_AMSK.toLocaleString()} AMSK`;
    } else if (from === 'BNB' && to === 'AMSK') {
        const rate = (livePrices.BNB || CONFIG.PRICES.BNB) * CONFIG.SWAP.RATES.USDT_TO_AMSK;
        rateEl.textContent = `1 BNB = ${Math.floor(rate).toLocaleString()} AMSK`;
    } else if (from === 'TON' && to === 'AMSK') {
        const rate = (livePrices.TON || CONFIG.PRICES.TON) * CONFIG.SWAP.RATES.USDT_TO_AMSK;
        rateEl.textContent = `1 TON = ${Math.floor(rate).toLocaleString()} AMSK`;
    } else if (from === 'AMSK' && to === 'USDT') {
        rateEl.textContent = `1 AMSK = $${CONFIG.SWAP.RATES.AMSK_TO_USDT}`;
    }
    
    confirmBtn.disabled = false;
}

function updateSwapCalculation() {
    const from = document.getElementById('swapFrom')?.value;
    const to = document.getElementById('swapTo')?.value;
    const fromAmount = parseFloat(document.getElementById('swapFromAmount')?.value) || 0;
    const toAmountEl = document.getElementById('swapToAmount');
    
    if (!toAmountEl || !from) return;
    
    let toAmount = 0;
    
    if (from === 'USDT' && to === 'AMSK') {
        toAmount = fromAmount * CONFIG.SWAP.RATES.USDT_TO_AMSK;
    } else if (from === 'BNB' && to === 'AMSK') {
        const rate = (livePrices.BNB || CONFIG.PRICES.BNB) * CONFIG.SWAP.RATES.USDT_TO_AMSK;
        toAmount = fromAmount * rate;
    } else if (from === 'TON' && to === 'AMSK') {
        const rate = (livePrices.TON || CONFIG.PRICES.TON) * CONFIG.SWAP.RATES.USDT_TO_AMSK;
        toAmount = fromAmount * rate;
    } else if (from === 'AMSK' && to === 'USDT') {
        toAmount = fromAmount * CONFIG.SWAP.RATES.AMSK_TO_USDT;
    }
    
    toAmountEl.textContent = Math.floor(toAmount).toLocaleString();
}

async function confirmSwap() {
    const from = document.getElementById('swapFrom')?.value;
    const to = document.getElementById('swapTo')?.value;
    const fromAmount = parseFloat(document.getElementById('swapFromAmount')?.value) || 0;
    const toAmount = parseInt(document.getElementById('swapToAmount')?.textContent.replace(/,/g, '')) || 0;
    
    if (fromAmount <= 0 || toAmount <= 0) {
        showMessage("Invalid amount", "error");
        return;
    }
    
    if (walletData.balances[from] < fromAmount) {
        showMessage(`Insufficient ${from} balance`, "error");
        return;
    }
    
    walletData.balances[from] -= fromAmount;
    walletData.balances[to] += toAmount;
    
    addTransactionToHistory('swap', -fromAmount, from, `Swapped to ${toAmount.toLocaleString()} ${to}`, 'completed');
    addTransactionToHistory('swap', toAmount, to, `Swapped from ${fromAmount} ${from}`, 'completed');
    
    closeModal('swapModal');
    updateWalletUI();
    await saveUserData(true);
    
    showMessage(`✅ Swapped ${fromAmount} ${from} to ${toAmount.toLocaleString()} ${to}!`, "success");
}

// ===== 30. HISTORY SYSTEM - مع التخزين المؤقت (مثل REFI) =====
function showHistory() {
    const modalContent = `
        <div class="modal-overlay show" id="historyModal">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-history"></i> Transaction History</h3>
                    <button class="modal-close" onclick="closeModal('historyModal')">×</button>
                </div>
                <div class="modal-body">
                    <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                        <button class="history-filter active" onclick="filterHistory('all')">All</button>
                        <button class="history-filter" onclick="filterHistory('deposit')">Deposits</button>
                        <button class="history-filter" onclick="filterHistory('withdraw')">Withdrawals</button>
                        <button class="history-filter" onclick="filterHistory('swap')">Swaps</button>
                        <button class="history-filter" onclick="filterHistory('mining')">Mining</button>
                    </div>
                    
                    <div id="historyList" class="history-list"></div>
                    
                    <div style="margin-top: 20px;">
                        <button class="btn-secondary" style="width: 100%;" onclick="closeModal('historyModal')">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    // التحقق من الطلبات المعلقة عند فتح التاريخ (مرة كل 10 دقائق)
    setTimeout(() => {
        checkPendingTransactions();
    }, 500);
    
    renderHistory();
}

let currentHistoryFilter = 'all';

function filterHistory(filter) {
    currentHistoryFilter = filter;
    document.querySelectorAll('.history-filter').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(filter) || 
            (filter === 'all' && btn.textContent === 'All')) {
            btn.classList.add('active');
        }
    });
    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    let transactions = walletData.transactionHistory || [];
    
    if (currentHistoryFilter !== 'all') {
        transactions = transactions.filter(tx => tx.type.includes(currentHistoryFilter));
    }
    
    if (transactions.length === 0) {
        historyList.innerHTML = `
            <div class="empty-stakes">
                <i class="fas fa-history"></i>
                <p>No transactions yet</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    transactions.slice(0, 50).forEach(tx => {
        const amountClass = tx.amount > 0 ? 'positive' : 'negative';
        const amountSign = tx.amount > 0 ? '+' : '';
        const date = new Date(tx.timestamp).toLocaleString();
        
        let statusClass = '';
        if (tx.status === 'pending') statusClass = 'pending';
        else if (tx.status === 'approved' || tx.status === 'completed') statusClass = 'completed';
        else if (tx.status === 'rejected') statusClass = 'rejected';
        
        html += `
            <div class="history-item">
                <div class="history-item-header">
                    <div class="history-type ${tx.type.includes('deposit') ? 'deposit' : 
                                               tx.type.includes('withdraw') ? 'withdraw' : 
                                               tx.type.includes('swap') ? 'swap' : 'mining'}">
                        <i class="fas ${tx.icon || 'fa-history'}"></i>
                        <span>${tx.type.replace('_', ' ').toUpperCase()}</span>
                    </div>
                    <span class="history-status ${statusClass}">${tx.status}</span>
                </div>
                <div class="history-details">
                    <span class="history-amount ${amountClass}">${amountSign}${Math.abs(tx.amount).toLocaleString()} ${tx.currency}</span>
                    <span class="history-date">${date}</span>
                </div>
                ${tx.description ? `<div style="font-size: 11px; color: var(--text-muted); margin-top: 5px;">${tx.description}</div>` : ''}
            </div>
        `;
    });
    
    historyList.innerHTML = html;
}

// ===== 31. REFERRAL SYSTEM =====
function updateReferralDisplay() {
    if (!walletData?.referrals) return;
    
    if (elements.refCount) {
        elements.refCount.textContent = walletData.referrals.count || 0;
    }
    
    if (elements.refEarned) {
        elements.refEarned.textContent = (walletData.referrals.earned?.amsk || 0).toLocaleString();
    }
    
    if (elements.referralLink) {
        elements.referralLink.value = getReferralLink();
    }
    
    updateMilestonesDisplay();
}

function updateMilestonesDisplay() {
    if (!elements.milestonesList || !walletData?.referrals) return;
    
    const count = walletData.referrals.count || 0;
    const claimed = walletData.referrals.claimedMilestones || [];
    
    let html = '';
    for (let [num, reward] of Object.entries(CONFIG.REFERRAL.MILESTONES)) {
        const isClaimed = claimed.includes(parseInt(num));
        const canClaim = count >= parseInt(num) && !isClaimed;
        
        let statusHtml = '';
        if (isClaimed) {
            statusHtml = '<span class="claimed-badge">Claimed</span>';
        } else if (canClaim) {
            statusHtml = `<button class="btn-claim-milestone" onclick="claimMilestone(${num})">Claim</button>`;
        } else {
            statusHtml = `<span class="locked-badge">${count}/${num}</span>`;
        }
        
        let rewardText = `${reward.amsk.toLocaleString()} AMSK`;
        if (reward.bnb > 0) {
            rewardText += ` + ${reward.bnb} BNB`;
        }
        
        html += `
            <div class="milestone-item ${isClaimed ? 'claimed' : (canClaim ? 'can-claim' : 'locked')}">
                <div class="milestone-icon">
                    <i class="fas ${parseInt(num) >= 100 ? 'fa-crown' : 'fa-users'}"></i>
                </div>
                <div class="milestone-details">
                    <div class="milestone-requirement">${num} Referrals</div>
                    <div class="milestone-progress">${count}/${num}</div>
                    <div class="milestone-reward">${rewardText}</div>
                </div>
                <div class="milestone-action">${statusHtml}</div>
            </div>
        `;
    }
    
    elements.milestonesList.innerHTML = html;
}

async function claimMilestone(num) {
    const milestone = CONFIG.REFERRAL.MILESTONES[num];
    if (!milestone) return;
    
    if (walletData.referrals.claimedMilestones.includes(num)) {
        showMessage("Already claimed", "warning");
        return;
    }
    
    if (walletData.referrals.count < num) {
        showMessage(`Need ${num} referrals`, "error");
        return;
    }
    
    walletData.balances.AMSK += milestone.amsk;
    if (milestone.bnb > 0) {
        walletData.balances.BNB += milestone.bnb;
    }
    
    walletData.referrals.earned.amsk += milestone.amsk;
    walletData.referrals.earned.bnb += milestone.bnb;
    walletData.referrals.claimedMilestones.push(num);
    
    addTransactionToHistory('referral_milestone', milestone.amsk, 'AMSK', `Milestone ${num} referrals`, 'completed');
    if (milestone.bnb > 0) {
        addTransactionToHistory('referral_milestone', milestone.bnb, 'BNB', `Milestone ${num} referrals`, 'completed');
    }
    
    updateReferralDisplay();
    updateWalletUI();
    await saveUserData(true);
    
    showMessage(`🏆 Claimed milestone ${num}!`, "success");
}

function copyReferralLink() {
    const link = getReferralLink();
    navigator.clipboard.writeText(link);
    showMessage("✅ Referral link copied!", "success");
}

function shareTelegram() {
    const link = getReferralLink();
    const text = `🚀 Join Alien Musk Quantum Mining!\n\nEarn AMSK tokens every 2.5h\nGet 10,000 AMSK bonus with my link\n\n${link}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`, '_blank');
}

function shareWhatsApp() {
    const link = getReferralLink();
    const text = `🚀 Join Alien Musk Quantum Mining! Earn AMSK tokens every 2.5h. Get 10,000 AMSK bonus with my link: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// ===== 32. PRICES SYSTEM - مع تخزين مؤقت 3 ساعات (مثل REFI) =====
async function fetchLivePrices(force = false) {
    const now = Date.now();
    const cached = loadLocalData(STORAGE_KEYS.PRICES);
    
    if (!force && cached && (now - (cached.timestamp || 0)) < CONFIG.CACHE.PRICES) {
        livePrices = cached.prices || {};
        console.log("📦 Using cached prices (less than 3 hours old)");
        return;
    }
    
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin,the-open-network&vs_currencies=usd&include_24hr_change=true'
        );
        const data = await response.json();
        
        livePrices = {
            BNB: data.binancecoin?.usd || CONFIG.PRICES.BNB,
            TON: data['the-open-network']?.usd || CONFIG.PRICES.TON,
            BNB_24h: data.binancecoin?.usd_24h_change || 0,
            TON_24h: data['the-open-network']?.usd_24h_change || 0
        };
        
        saveLocalData(STORAGE_KEYS.PRICES, {
            prices: livePrices,
            timestamp: now
        });
        
        lastPricesLoadTime = now;
        
    } catch (error) {
        console.error("❌ Error fetching prices:", error);
    }
}

// ===== 33. FLOATING NOTIFICATIONS SYSTEM (مثل REFI) =====
const FLOATING_NOTIFICATIONS = [
    "👽 Mining • Level 5 • +100,000 AMSK",
    "🛸 Staking • Diamond Plan • +50 USDT",
    "💫 Referral • New user • +10,000 AMSK",
    "🚀 Withdrawal • 0x7d...f1b3 • 250 USDT",
    "💰 Deposit • 0x2a...e7f8 • 1,000 USDT",
    "⚡ Mining • Level 3 • +10,000 AMSK",
    "💎 Staking • Gold Plan • +8,333 AMSK/day",
    "👥 Referral • 10 referrals • +50,000 AMSK"
];

let floatingInterval = null;
let floatingIndex = 0;
const FLOATING_SCHEDULES = [8000, 12000, 45000, 130000, 10000, 15000, 240000, 7000];

function startFloatingNotifications() {
    if (floatingInterval) clearInterval(floatingInterval);
    
    function showNext() {
        const random = FLOATING_NOTIFICATIONS[Math.floor(Math.random() * FLOATING_NOTIFICATIONS.length)];
        showFloatingToast(random);
        
        const nextDelay = FLOATING_SCHEDULES[floatingIndex % FLOATING_SCHEDULES.length];
        floatingIndex++;
        setTimeout(showNext, nextDelay);
    }
    
    setTimeout(showNext, 5000);
}

function showFloatingToast(message) {
    const toast = document.getElementById('floatingToast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// ===== 34. UTILITY FUNCTIONS =====
function showMessage(text, type = 'info', duration = 3000) {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const id = 'msg_' + Date.now();
    const msg = document.createElement('div');
    msg.id = id;
    msg.className = `message ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    else if (type === 'error') icon = 'fa-times-circle';
    else if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    msg.innerHTML = `<i class="fas ${icon}"></i><span>${text}</span>`;
    container.appendChild(msg);
    
    setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 300);
        }
    }, duration);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    showMessage("✅ Copied!", "success");
}

function formatNumber(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toLocaleString();
}

function updateUI() {
    updateMiningDisplay();
    updateWalletUI();
    updateStakingDisplay();
    updateReferralDisplay();
    updateTasksDisplay();
    
    if (elements.usernameMini) {
        elements.usernameMini.textContent = userName;
    }
    
    if (elements.userIdMini) {
        elements.userIdMini.textContent = userId;
    }
}

// ===== 35. BOOSTER FUNCTION =====
async function boosterUpgrade() {
    const targetLevel = 5;
    const currentLevel = walletData.mining.level;
    
    if (currentLevel >= targetLevel) {
        showMessage("Already at maximum level!", "info");
        return;
    }
    
    const levelData = CONFIG.MINING.LEVELS[targetLevel];
    const totalCost = levelData.cost;
    
    if (walletData.balances.USDT < totalCost) {
        showMessage(`⚠️ Need ${totalCost} USDT for Level 5!`, "warning");
        return;
    }
    
    if (!confirm(`Upgrade directly to Level 5 for ${totalCost} USDT?`)) {
        return;
    }
    
    walletData.balances.USDT -= totalCost;
    walletData.mining.level = targetLevel;
    
    addTransactionToHistory('mining_upgrade', -totalCost, 'USDT', 'Booster upgrade to Level 5', 'completed');
    
    checkMiningVipReward(targetLevel);
    updateMiningDisplay();
    updateWalletUI();
    await saveUserData(true);
    
    showMessage(`🚀 BOOSTER ACTIVATED! Upgraded to Level 5 Mythic!`, "success");
}

function scrollToTasks() {
    const tasksSection = document.getElementById('tasks-section');
    if (tasksSection) {
        tasksSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function initSupportIcon() {
    if (elements.supportIcon) {
        elements.supportIcon.addEventListener('click', () => {
            window.open('https://t.me/AlienMusk_support', '_blank');
        });
    }
}

function initLanguageSelector() {
    if (elements.langIcon && elements.langDropdown) {
        elements.langIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.langDropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', (e) => {
            if (!elements.langIcon.contains(e.target) && !elements.langDropdown.contains(e.target)) {
                elements.langDropdown.classList.remove('show');
            }
        });
        
        document.querySelectorAll('.language-option').forEach(opt => {
            opt.addEventListener('click', () => {
                const lang = opt.dataset.lang;
                setLanguage(lang);
                elements.langDropdown.classList.remove('show');
            });
        });
    }
}

// ===== 36. NAVIGATION =====
function switchPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`${page}-page`).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === page) {
            btn.classList.add('active');
        }
    });
    
    if (page === 'wallet') {
        showRandomSticker();
    }
}

// ===== 37. STICKER SYSTEM (مثل REFI) =====
const ALIEN_STICKERS = ['👽', '🛸', '👾', '🤖', '💫', '⭐', '🚀', '🌌', '✨', '💎'];
let lastStickerTime = 0;
const STICKER_COOLDOWN = 10 * 60 * 1000; // 10 دقائق

function showRandomSticker() {
    const now = Date.now();
    if (now - lastStickerTime < STICKER_COOLDOWN) return;
    
    const sticker = ALIEN_STICKERS[Math.floor(Math.random() * ALIEN_STICKERS.length)];
    showFloatingToast(sticker + " Alien Musk welcomes you!");
    lastStickerTime = now;
}

// ===== 38. EVENT LISTENERS =====
function setupEventListeners() {
    elements.navBtns.forEach(btn => {
        btn.addEventListener('click', () => switchPage(btn.dataset.page));
    });
    
    if (elements.startMiningBtn) {
        elements.startMiningBtn.addEventListener('click', handleMiningAction);
    }
    
    if (elements.depositBtn) {
        elements.depositBtn.addEventListener('click', openDepositModal);
    }
    
    if (elements.withdrawBtn) {
        elements.withdrawBtn.addEventListener('click', openWithdrawModal);
    }
    
    if (elements.swapBtn) {
        elements.swapBtn.addEventListener('click', openSwapModal);
    }
    
    if (elements.historyBtn) {
        elements.historyBtn.addEventListener('click', showHistory);
    }
    
    if (elements.copyLinkBtn) {
        elements.copyLinkBtn.addEventListener('click', copyReferralLink);
    }
    
    if (elements.telegramShare) {
        elements.telegramShare.addEventListener('click', shareTelegram);
    }
    
    if (elements.whatsappShare) {
        elements.whatsappShare.addEventListener('click', shareWhatsApp);
    }
    
    if (elements.scrollToTasks) {
        elements.scrollToTasks.addEventListener('click', scrollToTasks);
    }
    
    if (elements.boosterBtn) {
        elements.boosterBtn.addEventListener('click', boosterUpgrade);
    }
    
    elements.tasksTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            elements.tasksTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabType = tab.dataset.tab;
            document.querySelector('[data-tab-content="basic"]').style.display = tabType === 'basic' ? 'grid' : 'none';
            document.querySelector('[data-tab-content="vip"]').style.display = tabType === 'vip' ? 'grid' : 'none';
        });
    });
    
    // Admin logo click (5 times)
    if (elements.adminLogo) {
        let clickCount = 0;
        elements.adminLogo.addEventListener('click', () => {
            clickCount++;
            if (clickCount >= 5) {
                if (isAdmin) {
                    showAdminPanel();
                } else {
                    showMessage("Admin access required", "error");
                }
                clickCount = 0;
            }
            setTimeout(() => { clickCount = 0; }, 2000);
        });
    }
    
    initSupportIcon();
    initLanguageSelector();
}

// ===== 39. INITIALIZATION =====
async function initApp() {
    if (appInitialized) return;
    
    console.log("🚀 Initializing Alien Musk Quantum v8.0 - ULTIMATE ECONOMY EDITION");
    console.log("✅ On-Demand Listeners: 30 seconds only");
    console.log("✅ Smart Caching: User(5min), Prices(3h), History(10min)");
    console.log("✅ Admin: Manual refresh only");
    console.log("✅ Floating Notifications: Active");
    
    cacheElements();
    
    // Progress bar animation
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 10;
        if (elements.loadingProgress) {
            elements.loadingProgress.style.width = progress + '%';
        }
        if (elements.loadingText) {
            elements.loadingText.textContent = `Loading... ${progress}%`;
        }
        if (progress >= 100) {
            clearInterval(progressInterval);
        }
    }, 200);
    
    // Load data
    await loadUserData();
    await fetchLivePrices();
    
    // Update UI
    renderStakingPlans();
    updateUI();
    
    // Start services
    startMiningTimer();
    startFloatingNotifications();
    
    // Hide loading screen
    setTimeout(() => {
        if (elements.loadingScreen) {
            elements.loadingScreen.style.opacity = '0';
            setTimeout(() => {
                elements.loadingScreen.style.display = 'none';
                document.getElementById('app-container').classList.remove('hidden');
            }, 500);
        }
    }, 2500);
    
    setupEventListeners();
    
    appInitialized = true;
    console.log("✅ App initialized successfully with ZERO COST architecture");
}

// ===== 40. START =====
document.addEventListener('DOMContentLoaded', initApp);

// ===== 41. EXPORT GLOBAL FUNCTIONS =====
window.switchPage = switchPage;
window.closeModal = closeModal;
window.upgradeMiningLevel = upgradeMiningLevel;
window.handleMiningAction = handleMiningAction;
window.handleTaskClick = handleTaskClick;
window.claimVipTask = claimVipTask;
window.openStakeModal = openStakeModal;
window.setMaxStakeAmount = setMaxStakeAmount;
window.confirmStaking = confirmStaking;
window.openDepositModal = openDepositModal;
window.openWithdrawModal = openWithdrawModal;
window.openSwapModal = openSwapModal;
window.showHistory = showHistory;
window.filterHistory = filterHistory;
window.validateTxId = validateTxId;
window.validateAddress = validateAddress;
window.submitDeposit = submitDeposit;
window.submitWithdraw = submitWithdraw;
window.updateSwapRates = updateSwapRates;
window.swapCurrencies = swapCurrencies;
window.setSwapPercentage = setSwapPercentage;
window.updateSwapCalculation = updateSwapCalculation;
window.confirmSwap = confirmSwap;
window.copyReferralLink = copyReferralLink;
window.shareTelegram = shareTelegram;
window.shareWhatsApp = shareWhatsApp;
window.claimMilestone = claimMilestone;
window.boosterUpgrade = boosterUpgrade;
window.scrollToTasks = scrollToTasks;
window.toggleLanguage = toggleLanguage;
window.setLanguage = setLanguage;
window.showAdminPanel = showAdminPanel;
window.refreshAdminPanel = refreshAdminPanel;
window.switchAdminTab = switchAdminTab;
window.approveTransaction = approveTransaction;
window.rejectTransaction = rejectTransaction;
window.copyToClipboard = copyToClipboard;

console.log("👽 Alien Musk Quantum v8.0 - READY");
console.log("💰 ECONOMY MODE: ZERO unnecessary reads");
console.log("📊 Ready for 1,000,000+ users with minimal cost");

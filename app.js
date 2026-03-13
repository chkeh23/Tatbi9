// ===========================================
// ALIEN MUSK QUANTUM v7.3 - ULTIMATE ZERO WASTE EDITION
// ===========================================

// ====== 1. TELEGRAM WEBAPP INITIALIZATION ======
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
    console.log("✅ Telegram WebApp initialized");
}

// ====== 2. FIREBASE CONFIGURATION ======
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCklv_zMfndK4-xUHECyD5XA7p_-20e1t8",
    authDomain: "tatbi9-681bf.firebaseapp.com",
    projectId: "tatbi9-681bf",
    storageBucket: "tatbi9-681bf.firebasestorage.app",
    messagingSenderId: "863237064748",
    appId: "1:863237064748:web:134de1e01d2639ef5fa989"
};

// Initialize Firebase
let firebaseApp, db, auth;
try {
    if (typeof firebase !== 'undefined') {
        firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
        db = firebase.firestore();
        auth = firebase.auth();
        console.log("🔥 Firebase initialized successfully");
    }
} catch (error) {
    console.error("❌ Firebase initialization error:", error);
}

// ====== 3. ON-DEMAND LISTENERS SYSTEM - مستمعين عند الطلب فقط (30 ثانية) ======
let activeListeners = new Map();
let listenerTimeouts = new Map();

function startOnDemandListener(collection, docId, callback, timeoutMs = 30000) {
    const listenerId = `${collection}_${docId}`;
    
    // إذا كان هناك مستمع نشط لهذا المستند، أوقفه أولاً
    if (activeListeners.has(listenerId)) {
        console.log(`🛑 Stopping previous listener for ${listenerId}`);
        activeListeners.get(listenerId)();
        activeListeners.delete(listenerId);
    }
    
    if (listenerTimeouts.has(listenerId)) {
        clearTimeout(listenerTimeouts.get(listenerId));
        listenerTimeouts.delete(listenerId);
    }
    
    console.log(`👂 بدء مستمع عند الطلب لـ ${collection}/${docId} (${timeoutMs/1000} ثانية)`);
    
    const unsubscribe = db.collection(collection).doc(docId).onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            console.log(`📡 مستمع تحديث لـ ${collection}/${docId}:`, data.status);
            callback(data);
            
            // إذا كانت الحالة نهائية، أوقف المستمع فوراً
            if (data.status === 'approved' || data.status === 'rejected') {
                console.log(`✅ حالة نهائية، إيقاف مستمع ${collection}/${docId}`);
                stopOnDemandListener(listenerId);
            }
        }
    }, (error) => {
        console.error(`❌ خطأ في المستمع ${collection}/${docId}:`, error);
        stopOnDemandListener(listenerId);
    });
    
    activeListeners.set(listenerId, unsubscribe);
    
    const timeout = setTimeout(() => {
        console.log(`⏰ انتهاء وقت المستمع لـ ${collection}/${docId}`);
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
}

function stopAllListeners() {
    console.log(`🛑 إيقاف جميع المستمعين النشطين (${activeListeners.size} مستمع)`);
    activeListeners.forEach((unsubscribe) => unsubscribe());
    activeListeners.clear();
    listenerTimeouts.clear();
}

// ====== 4. CACHE SYSTEM - نظام التخزين المؤقت ======
const CACHE_TIME = {
    USER: 5 * 60 * 1000,        // 5 دقائق
    PRICES: 3 * 60 * 60 * 1000,  // 3 ساعات
    HISTORY: 10 * 60 * 1000,     // 10 دقائق
    MINING: 60 * 1000            // دقيقة واحدة (للتعدين)
};

let lastCacheTime = {
    user: 0,
    prices: 0,
    history: 0,
    mining: 0
};

// ====== 5. CONFIGURATION ======
const CONFIG = {
    PRICES: {
        AMSK: 0.0002,
        USDT: 1.00,
        BNB: 640.00,
        TON: 1.4
    },
    
    CMC_ICONS: {
        AMSK: "https://s2.coinmarketcap.com/static/img/coins/64x64/33598.png",
        TON: "https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png",
        USDT: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
        BNB: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
        DOGE: "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png",
        SHIB: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
        PEPE: "https://s2.coinmarketcap.com/static/img/coins/64x64/24478.png",
        TRUMP: "https://s2.coinmarketcap.com/static/img/coins/64x64/35336.png",
        BONK: "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png",
        PENGU: "https://s2.coinmarketcap.com/static/img/coins/64x64/34466.png",
        FLOKI: "https://s2.coinmarketcap.com/static/img/coins/64x64/10804.png",
        WIF: "https://s2.coinmarketcap.com/static/img/coins/64x64/28752.png"
    },
    
    COINGECKO_IDS: {
        BNB: "binancecoin",
        TON: "the-open-network",
        DOGE: "dogecoin",
        SHIB: "shiba-inu",
        PEPE: "pepe",
        TRUMP: "official-trump",
        BONK: "bonk",
        PENGU: "pudgy-penguins",
        FLOKI: "floki",
        WIF: "dogwifcoin"
    },
    
    TOP_MEMES: [
        { symbol: "DOGE", name: "Dogecoin", id: "dogecoin", iconKey: "DOGE" },
        { symbol: "SHIB", name: "Shiba Inu", id: "shiba-inu", iconKey: "SHIB" },
        { symbol: "PEPE", name: "Pepe", id: "pepe", iconKey: "PEPE" },
        { symbol: "TRUMP", name: "Official Trump", id: "official-trump", iconKey: "TRUMP" },
        { symbol: "BONK", name: "Bonk", id: "bonk", iconKey: "BONK" },
        { symbol: "PENGU", name: "Pudgy Penguins", id: "pudgy-penguins", iconKey: "PENGU" },
        { symbol: "FLOKI", name: "Floki", id: "floki", iconKey: "FLOKI" },
        { symbol: "WIF", name: "Dogwifhat", id: "dogwifcoin", iconKey: "WIF" }
    ],
    
    MINING: {
        DURATION: 9000000, // 2.5 ساعة
        
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
            1: { 
                name: "Silver", 
                minAmount: 10, 
                duration: 7, 
                apr: 40,
                dailyPer10: 2857,
                totalPer10: 20000
            },
            2: { 
                name: "Gold", 
                minAmount: 50, 
                duration: 15, 
                apr: 50,
                dailyPer50: 8333,
                totalPer50: 125000
            },
            3: { 
                name: "Diamond", 
                minAmount: 100, 
                duration: 30, 
                apr: 60,
                dailyPer100: 10000,
                totalPer100: 300000
            }
        }
    },
    
    TASKS: {
        1: { name: "Join Telegram Channel", url: "https://t.me/your_channel", icon: "fab fa-telegram", reward: 5000 },
        2: { name: "Subscribe on YouTube", url: "https://youtube.com/your_channel", icon: "fab fa-youtube", reward: 5000 },
        3: { name: "Follow on TikTok", url: "https://tiktok.com/@your_account", icon: "fab fa-tiktok", reward: 5000 },
        4: { name: "Like & Share Latest Post", url: "https://t.me/your_channel/123", icon: "fas fa-heart", reward: 5000 }
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
            BNB_USDT: "0xbe7D6b0910d1019100c5CD32b4160cA30A8EB5D4",
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
        ALLOWED_PAIRS: [
            'USDT_to_AMSK',
            'BNB_to_AMSK', 
            'TON_to_AMSK',
            'AMSK_to_USDT'
        ]
    },
    
    ADMIN: {
        TELEGRAM_ID: "1653918641",
        PASSWORD: "Ali97$"
    }
};

// ====== 6. LIVE PRICES ======
let livePrices = {
    BNB: CONFIG.PRICES.BNB,
    TON: CONFIG.PRICES.TON,
    DOGE: 0,
    SHIB: 0,
    PEPE: 0,
    TRUMP: 0,
    BONK: 0,
    PENGU: 0,
    FLOKI: 0,
    WIF: 0
};

// ====== 7. WALLET DATA ======
let walletData = {
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
        lastResetDate: null
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

// ====== 8. USER DATA ======
let userData = {
    id: null,
    telegramId: null,
    username: 'Alien',
    firstName: 'Alien',
    photoUrl: null,
    referralCode: null,
    referredBy: null,
    joinedAt: null,
    lastActive: null,
    isInitialized: false,
    lastSaveTime: 0,
    lastFirebaseSave: 0,
    referralBonusClaimed: false,
    language: 'en',
    isNewUser: true,
    processedReferrals: []
};

const DB_COLLECTIONS = {
    USERS: 'users',
    DEPOSITS: 'deposit_requests',
    WITHDRAWALS: 'withdrawal_requests',
    TRANSACTIONS: 'transactions',
    ADMIN_LOGS: 'admin_logs'
};

const elements = {};

let intervals = {
    miningTimer: null,
    localSaveTimer: null
};

let appInitialized = false;
let isAdmin = false;

// ====== 9. LANGUAGE SYSTEM ======
const LANGUAGES = {
    en: {
        code: 'en',
        flag: '🇬🇧',
        name: 'English',
        nativeName: 'English',
        dir: 'ltr',
        translations: {
            app_name: "Alien Musk Quantum",
            app_name_short: "Alien Musk",
            loading: "Loading...",
            loading_subtitle: "Initializing Quantum Systems...",
            nav_home: "Home",
            nav_staking: "Staking",
            nav_wallet: "Wallet",
            nav_referral: "Referral",
            mining_title: "Quantum Mining Station",
            mining_level: "Level",
            mining_hashrate: "Hashrate",
            mining_next_reward: "Next Reward:",
            mining_start: "Start Quantum Mining",
            mining_claim: "Claim Reward",
            mining_in_progress: "Mining...",
            mining_total: "Total Mined:",
            mining_today: "Today:",
            mining_quick_tasks: "Tasks",
            mining_quick_booster: "Booster 🚀",
            upgrade_title: "Upgrade Mining Level",
            tasks_title: "Tasks & Rewards",
            tasks_completed: "Completed",
            tasks_basic: "Basic",
            tasks_vip: "VIP 🏆",
            tasks_start: "Start",
            tasks_done: "Done ✓",
            staking_title: "Quantum Staking",
            staking_description: "Stake your USDT to earn AMSK tokens.",
            staking_total: "Total Staked",
            staking_active: "Active Earnings",
            staking_plans: "Staking Plans",
            staking_plan_silver: "Silver Plan",
            staking_plan_gold: "Gold Plan",
            staking_plan_diamond: "Diamond Plan",
            staking_duration_7: "7 Days",
            staking_duration_15: "15 Days",
            staking_duration_30: "30 Days",
            staking_stake_now: "Stake Now",
            staking_active_stakes: "Active Stakes",
            staking_no_active: "No active stakes yet",
            staking_start_hint: "Start staking to earn rewards",
            wallet_total_balance: "Total Balance",
            wallet_total_usd: "Total Value in USD",
            wallet_quick_actions: "Quick Actions",
            wallet_deposit: "Deposit",
            wallet_withdraw: "Withdraw",
            wallet_swap: "Swap",
            wallet_history: "History",
            wallet_assets: "Assets",
            referral_stats: "Referral Stats",
            referral_count: "Referrals",
            referral_earned: "AMSK Earned",
            referral_your_link: "Your Referral Link",
            referral_invite: "🚀 Invite friends and earn big!",
            referral_milestones: "Referral Milestones",
            share_telegram: "Telegram",
            share_whatsapp: "WhatsApp",
            language_welcome_title: "👽 Welcome to Alien Musk!",
            language_welcome_subtitle: "Please select your preferred language",
            language_continue: "Continue",
            cancel: "Cancel",
            confirm: "Confirm",
            close: "Close",
            save: "Save",
            copy: "Copy",
            copied: "Copied!",
            success: "Success",
            error: "Error",
            warning: "Warning",
            info: "Info",
            free: "Free",
            history_title: "Transaction History",
            history_all: "All",
            history_pending: "Pending",
            history_completed: "Completed",
            history_rejected: "Rejected",
            history_all_types: "All Types",
            history_deposits: "Deposits",
            history_withdrawals: "Withdrawals",
            history_mining: "Mining",
            history_staking: "Staking",
            history_swap: "Swap",
            history_referral: "Referral",
            history_tasks: "Tasks",
            history_vip: "VIP Tasks",
            history_no_transactions: "No Transactions Found",
            history_no_transactions_desc: "No transactions match your current filters"
        }
    },
    ar: {
        code: 'ar',
        flag: '🇸🇦',
        name: 'Arabic',
        nativeName: 'العربية',
        dir: 'rtl',
        translations: {
            app_name: "أليون ماسك كوانتوم",
            app_name_short: "أليون ماسك",
            loading: "جاري التحميل...",
            loading_subtitle: "تشغيل الأنظمة الكمومية...",
            nav_home: "الرئيسية",
            nav_staking: "الإيداع",
            nav_wallet: "المحفظة",
            nav_referral: "الدعوات",
            mining_title: "محطة التعدين الكمومي",
            mining_level: "المستوى",
            mining_hashrate: "قوة التعدين",
            mining_next_reward: "المكافأة التالية:",
            mining_start: "بدء التعدين الكمومي",
            mining_claim: "استلام المكافأة",
            mining_in_progress: "جاري التعدين...",
            mining_total: "الإجمالي الملغوم:",
            mining_today: "اليوم:",
            mining_quick_tasks: "المهام",
            mining_quick_booster: "معزز 🚀",
            upgrade_title: "تطوير مستوى التعدين",
            tasks_title: "المهام والمكافآت",
            tasks_completed: "مكتمل",
            tasks_basic: "أساسية",
            tasks_vip: "VIP 🏆",
            tasks_start: "ابدأ",
            tasks_done: "تم ✓",
            staking_title: "الإيداع الكمومي",
            staking_description: "قم بإيداع USDT لكسب رموز AMSK.",
            staking_total: "إجمالي الإيداع",
            staking_active: "الأرباح النشطة",
            staking_plans: "خطط الإيداع",
            staking_plan_silver: "الفضة",
            staking_plan_gold: "الذهب",
            staking_plan_diamond: "الألماس",
            staking_duration_7: "7 أيام",
            staking_duration_15: "15 يوم",
            staking_duration_30: "30 يوم",
            staking_stake_now: "إيداع الآن",
            staking_active_stakes: "الإيداعات النشطة",
            staking_no_active: "لا توجد إيداعات نشطة",
            staking_start_hint: "ابدأ الإيداع لكسب المكافآت",
            wallet_total_balance: "الرصيد الإجمالي",
            wallet_total_usd: "القيمة الإجمالية بالدولار",
            wallet_quick_actions: "إجراءات سريعة",
            wallet_deposit: "إيداع",
            wallet_withdraw: "سحب",
            wallet_swap: "تبديل",
            wallet_history: "السجل",
            wallet_assets: "الأصول",
            referral_stats: "إحصائيات الدعوات",
            referral_count: "الدعوات",
            referral_earned: "AMSK المكتسب",
            referral_your_link: "رابط الدعوة الخاص بك",
            referral_invite: "🚀 ادعُ أصدقائك واربح الكثير!",
            referral_milestones: "مراحل الدعوات",
            share_telegram: "تليجرام",
            share_whatsapp: "واتساب",
            language_welcome_title: "👽 مرحباً بك في أليون ماسك!",
            language_welcome_subtitle: "الرجاء اختيار لغتك المفضلة",
            language_continue: "متابعة",
            cancel: "إلغاء",
            confirm: "تأكيد",
            close: "إغلاق",
            save: "حفظ",
            copy: "نسخ",
            copied: "تم النسخ!",
            success: "نجاح",
            error: "خطأ",
            warning: "تحذير",
            info: "معلومة",
            free: "مجاني",
            history_title: "سجل المعاملات",
            history_all: "الكل",
            history_pending: "معلقة",
            history_completed: "مكتملة",
            history_rejected: "مرفوضة",
            history_all_types: "جميع الأنواع",
            history_deposits: "إيداعات",
            history_withdrawals: "سحوبات",
            history_mining: "تعدين",
            history_staking: "إيداع",
            history_swap: "تبديل",
            history_referral: "دعوات",
            history_tasks: "مهام",
            history_vip: "VIP مهام",
            history_no_transactions: "لا توجد معاملات",
            history_no_transactions_desc: "لا توجد معاملات تطابق عوامل التصفية الخاصة بك"
        }
    }
};

let currentLanguage = 'en';
let isLanguageChanging = false;

function setLanguage(langCode) {
    if (isLanguageChanging || !LANGUAGES[langCode]) return;
    
    isLanguageChanging = true;
    
    try {
        currentLanguage = langCode;
        localStorage.setItem('user_language', langCode);
        
        document.documentElement.lang = langCode;
        document.body.lang = langCode;
        
        const langIcon = document.getElementById('languageSelectorBtn');
        if (langIcon) {
            langIcon.textContent = LANGUAGES[langCode].flag;
        }
        
        updateUITexts();
        
        if (userData && userData.id && db) {
            db.collection(DB_COLLECTIONS.USERS)
                .doc(userData.id)
                .update({
                    'userInfo.language': langCode
                }).catch(console.error);
        }
    } finally {
        isLanguageChanging = false;
    }
}

function getTranslation(key, params = {}) {
    const lang = LANGUAGES[currentLanguage] || LANGUAGES.en;
    let text = lang.translations[key] || LANGUAGES.en.translations[key] || key;
    
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
}

function updateUITexts() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const text = getTranslation(key);
        
        if (element.classList.contains('allow-html') || (text.includes('<') && text.includes('>'))) {
            element.innerHTML = text;
        } else {
            element.textContent = text;
        }
    });
}

function showLanguageWelcomeModal() {
    if (localStorage.getItem('user_language')) return;
    
    const modal = document.createElement('div');
    modal.className = 'language-welcome-modal';
    modal.innerHTML = `
        <div class="language-welcome-content">
            <div class="welcome-icon">👽</div>
            <h2 class="welcome-title" data-translate="language_welcome_title"></h2>
            <p class="welcome-subtitle" data-translate="language_welcome_subtitle"></p>
            
            <div class="language-grid">
                <div class="language-grid-item" onclick="window.selectWelcomeLanguage('en')">
                    <span class="flag">🇬🇧</span>
                    <span class="lang-name">English</span>
                    <span class="native-name">English</span>
                </div>
                <div class="language-grid-item" onclick="window.selectWelcomeLanguage('ar')">
                    <span class="flag">🇸🇦</span>
                    <span class="lang-name">العربية</span>
                    <span class="native-name">العربية</span>
                </div>
            </div>
            
            <button class="continue-btn" onclick="window.closeLanguageWelcome()" data-translate="language_continue"></button>
        </div>
    `;
    
    document.body.appendChild(modal);
    updateUITexts();
}

function selectWelcomeLanguage(langCode) {
    setLanguage(langCode);
    closeLanguageWelcome();
}

function closeLanguageWelcome() {
    const modal = document.querySelector('.language-welcome-modal');
    if (modal) modal.remove();
}

function initLanguageSystem() {
    const savedLang = localStorage.getItem('user_language');
    if (savedLang && LANGUAGES[savedLang]) {
        setLanguage(savedLang);
    } else {
        showLanguageWelcomeModal();
    }
    
    const langIcon = document.getElementById('languageSelectorBtn');
    const dropdown = document.getElementById('languageDropdown');
    
    if (langIcon && dropdown) {
        langIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', (e) => {
            if (!langIcon.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
        
        const options = dropdown.querySelectorAll('.language-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = option.dataset.lang;
                setLanguage(lang);
                
                options.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                dropdown.classList.remove('show');
            });
        });
    }
}

// ====== 10. SUPPORT ICON ======
function initSupportIcon() {
    const supportIcon = document.getElementById('support-icon');
    if (supportIcon) {
        supportIcon.addEventListener('click', function() {
            const supportUsername = 'AlienMusk_support';
            
            if (tg && tg.openTelegramLink) {
                tg.openTelegramLink(`https://t.me/${supportUsername}`);
            } else {
                window.open(`https://t.me/${supportUsername}`, '_blank');
            }
            
            showMessage("Opening support chat...", "info");
        });
    }
}

// ====== 11. UTILITY FUNCTIONS ======
function generateReferralCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function cacheElements() {
    console.log("🔍 Caching DOM elements...");
    
    elements.loadingScreen = document.getElementById('loading-screen');
    elements.loadingProgress = document.getElementById('loading-progress-bar');
    elements.loadingText = document.getElementById('loading-progress-text');
    elements.usernameMini = document.getElementById('username-mini');
    elements.userIdMini = document.getElementById('user-id-mini');
    elements.totalBalanceAmsk = document.getElementById('total-balance-amsk');
    elements.totalBalanceUsd = document.getElementById('total-balance-usd');
    elements.adminLogo = document.getElementById('admin-logo');
    elements.navBtns = document.querySelectorAll('.nav-btn');
    elements.pages = document.querySelectorAll('.page');
    elements.startMiningBtn = document.getElementById('start-mining-btn');
    elements.miningTimerDisplay = document.getElementById('mining-timer-display');
    elements.currentMiningLevel = document.getElementById('current-mining-level');
    elements.currentHashrateDisplay = document.getElementById('current-hashrate-display');
    elements.nextRewardAmount = document.getElementById('next-reward-amount');
    elements.totalMined = document.getElementById('total-mined');
    elements.minedToday = document.getElementById('mined-today');
    elements.upgradeCards = document.querySelectorAll('.upgrade-card');
    elements.upgradeButtons = document.querySelectorAll('.upgrade-btn');
    elements.upgradeCardsContainer = document.getElementById('upgrade-cards');
    elements.stakeButtons = document.querySelectorAll('.stake-plan-btn');
    elements.totalStaked = document.getElementById('total-staked');
    elements.activeStakesList = document.getElementById('active-stakes-list');
    elements.walletBalanceAmsk = document.getElementById('wallet-balance-amsk');
    elements.walletBalanceUsd = document.getElementById('wallet-balance-usd');
    elements.walletAmskBalance = document.getElementById('wallet-amsk-balance');
    elements.walletAmskValue = document.getElementById('wallet-amsk-value');
    elements.walletUsdtBalance = document.getElementById('wallet-usdt-balance');
    elements.walletUsdtValue = document.getElementById('wallet-usdt-value');
    elements.walletBnbBalance = document.getElementById('wallet-bnb-balance');
    elements.walletBnbValue = document.getElementById('wallet-bnb-value');
    elements.walletTonBalance = document.getElementById('wallet-ton-balance');
    elements.walletTonValue = document.getElementById('wallet-ton-value');
    elements.depositBtn = document.getElementById('deposit-btn');
    elements.withdrawBtn = document.getElementById('withdraw-btn');
    elements.swapBtn = document.getElementById('swap-btn');
    elements.historyBtn = document.getElementById('history-btn');
    elements.referralLinkInput = document.getElementById('referral-link-input');
    elements.copyLinkBtn = document.getElementById('copy-link-btn');
    elements.telegramShareBtn = document.getElementById('telegram-share-btn');
    elements.whatsappShareBtn = document.getElementById('whatsapp-share-btn');
    elements.refCount = document.getElementById('ref-count');
    elements.refEarned = document.getElementById('ref-earned');
    elements.milestonesList = document.getElementById('milestones-list');
    elements.tasksGrid = document.getElementById('tasks-grid');
    elements.vipTasksGrid = document.getElementById('vip-tasks-grid');
    elements.tasksProgress = document.getElementById('tasks-progress');
    elements.tasksTabs = document.querySelectorAll('.tasks-tab');
    elements.scrollToTasksBtn = document.getElementById('scroll-to-tasks-btn');
    elements.boosterBtn = document.getElementById('booster-btn');
    elements.supportIcon = document.getElementById('support-icon');
    
    console.log(`✅ Cached ${Object.keys(elements).length} element groups`);
}

function formatNumber(num, decimals = 0) {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    
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

function showMessage(text, type = 'info', duration = 3000) {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    if (duration === 3000) {
        if (type === 'warning' || type === 'error') {
            duration = 4500;
        } else if (type === 'success') {
            duration = 3000;
        } else {
            duration = 3500;
        }
    }
    
    const messageId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const messageDiv = document.createElement('div');
    messageDiv.id = messageId;
    messageDiv.className = `message ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    else if (type === 'error') icon = 'fa-times-circle';
    else if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    messageDiv.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${text}</span>
    `;
    
    container.appendChild(messageDiv);
    
    setTimeout(() => {
        const msgElement = document.getElementById(messageId);
        if (msgElement) {
            msgElement.style.opacity = '0';
            msgElement.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                if (msgElement.parentNode) msgElement.remove();
            }, 300);
        }
    }, duration);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => showMessage(getTranslation('copied'), 'success'))
        .catch(() => showMessage(getTranslation('error'), 'error'));
}

function closeModal() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.remove();
    });
}

function switchPage(pageName) {
    console.log(`🔀 Switching to page: ${pageName}`);
    
    try {
        closeModal();
        
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            if (page.id === `${pageName}-page`) {
                page.classList.add('active');
            }
        });
        
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.page === pageName) {
                btn.classList.add('active');
            }
        });
        
        // إذا فتح المحفظة، نتحقق من المعاملات المعلقة
        if (pageName === 'wallet') {
            checkPendingTransactions();
        }
        
    } catch (error) {
        console.error("❌ Page switch error:", error);
    }
}

// ====== 12. PRICES FUNCTIONS ======
async function fetchLivePrices(force = false) {
    const now = Date.now();
    const cachedPrices = localStorage.getItem('live_prices');
    
    if (!force && cachedPrices && (now - lastCacheTime.prices) < CACHE_TIME.PRICES) {
        try {
            const { prices, timestamp } = JSON.parse(cachedPrices);
            livePrices = prices;
            lastCacheTime.prices = timestamp;
            console.log("📦 Using cached prices (less than 3 hours old)");
            updateWalletUI();
            renderTopMemes();
            return;
        } catch (e) {}
    }
    
    try {
        const ids = Object.values(CONFIG.COINGECKO_IDS).join(',');
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
        const data = await response.json();
        
        livePrices.BNB = data.binancecoin?.usd || CONFIG.PRICES.BNB;
        livePrices.TON = data['the-open-network']?.usd || CONFIG.PRICES.TON;
        livePrices.BNB_24h_change = data.binancecoin?.usd_24h_change || 0;
        livePrices.TON_24h_change = data['the-open-network']?.usd_24h_change || 0;
        
        CONFIG.TOP_MEMES.forEach(meme => {
            const id = CONFIG.COINGECKO_IDS[meme.symbol];
            if (data[id]) {
                livePrices[meme.symbol] = data[id].usd || 0;
                livePrices[`${meme.symbol}_24h_change`] = data[id].usd_24h_change || 0;
            }
        });
        
        lastCacheTime.prices = now;
        localStorage.setItem('live_prices', JSON.stringify({
            prices: livePrices,
            timestamp: now
        }));
        
        updateWalletUI();
        renderTopMemes();
        console.log("✅ Live prices updated");
        
    } catch (error) {
        console.error("❌ Error fetching live prices:", error);
    }
}

function renderTopMemes() {
    const memesList = document.getElementById('memes-list');
    if (!memesList) return;
    
    let html = '';
    CONFIG.TOP_MEMES.forEach(meme => {
        const price = livePrices[meme.symbol] || 0;
        const priceFormatted = price < 0.01 ? price.toFixed(8) : price.toFixed(4);
        const change = livePrices[`${meme.symbol}_24h_change`] || 0;
        const changeSymbol = change >= 0 ? '▲' : '▼';
        
        html += `
            <div class="asset-item-compact" style="cursor: default;">
                <div class="asset-icon-compact" style="border-color: #ff6b6b; background: transparent;">
                    <img src="${CONFIG.CMC_ICONS[meme.iconKey]}" width="24" height="24" style="border-radius: 50%;" 
                         onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-coins\\' style=\\'color: #ff6b6b;\\'></i>'">
                </div>
                <div class="asset-details-compact">
                    <div class="asset-name-compact">${meme.name}</div>
                    <div class="asset-balance-compact">${meme.symbol}</div>
                </div>
                <div class="asset-value-compact" style="color: #ff6b6b; display: flex; align-items: center;">
                    $${priceFormatted}
                    <span style="color: ${change >= 0 ? '#00ff88' : '#ff4444'}; font-size: 10px; margin-left: 5px;">
                        ${changeSymbol} ${Math.abs(change).toFixed(1)}%
                    </span>
                </div>
            </div>
        `;
    });
    
    memesList.innerHTML = html;
}

function updateAssetsIcons() {
    const assetsContainer = document.querySelector('.asset-list-compact');
    if (!assetsContainer) return;
    
    const assets = ['AMSK', 'USDT', 'BNB', 'TON'];
    assets.forEach((asset, index) => {
        const item = assetsContainer.querySelector(`.asset-item-compact:nth-child(${index + 1})`);
        if (item) {
            const iconDiv = item.querySelector('.asset-icon-compact');
            iconDiv.innerHTML = `<img src="${CONFIG.CMC_ICONS[asset]}" width="24" height="24" style="border-radius: 50%;">`;
            iconDiv.style.background = 'transparent';
            iconDiv.style.border = `2px solid ${asset === 'AMSK' ? '#00ff88' : asset === 'USDT' ? '#00d4ff' : asset === 'BNB' ? '#ffd700' : '#9d4edd'}`;
        }
    });
}

function addMemesSection() {
    const walletPage = document.getElementById('wallet-page');
    if (!walletPage) return;
    
    if (document.getElementById('memes-section')) return;
    
    const memesSection = document.createElement('div');
    memesSection.className = 'wallet-assets-card';
    memesSection.id = 'memes-section';
    memesSection.innerHTML = `
        <h4><i class="fas fa-fire" style="color: #ff6b6b;"></i> Top Meme Coins 🔥</h4>
        <div class="asset-list-compact" id="memes-list"></div>
    `;
    
    const lastElement = walletPage.querySelector('.wallet-assets-card:last-child');
    if (lastElement) {
        lastElement.insertAdjacentElement('afterend', memesSection);
    } else {
        walletPage.appendChild(memesSection);
    }
}

// ====== 13. USER SETUP ======
async function setupUser() {
    console.log("👤 Setting up user...");
    
    let telegramUser = null;
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        telegramUser = tg.initDataUnsafe.user;
        console.log("📱 Telegram user found:", telegramUser.id);
    }
    
    if (telegramUser && telegramUser.id) {
        userData.id = `tg_${telegramUser.id}`;
        userData.telegramId = telegramUser.id.toString();
        userData.username = telegramUser.username ? `@${telegramUser.username}` : 
                           telegramUser.first_name ? telegramUser.first_name : 
                           `User${telegramUser.id.toString().slice(-4)}`;
        userData.firstName = telegramUser.first_name || 'Alien';
        userData.photoUrl = telegramUser.photo_url || 
                           `https://api.dicebear.com/7.x/avataaars/svg?seed=${telegramUser.id}`;
    } else {
        let userId = localStorage.getItem('alien_musk_user_id');
        if (!userId) {
            userId = 'web_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('alien_musk_user_id', userId);
        }
        userData.id = userId;
        userData.username = 'Alien';
        userData.firstName = 'Alien';
        userData.photoUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
    }
    
    if (!userData.referralCode) {
        let savedCode = localStorage.getItem(`refcode_${userData.id}`);
        if (savedCode) {
            userData.referralCode = savedCode;
        } else {
            userData.referralCode = generateReferralCode();
            localStorage.setItem(`refcode_${userData.id}`, userData.referralCode);
        }
        console.log("🔗 Generated unique referral code:", userData.referralCode);
    }
    
    const savedLang = localStorage.getItem('user_language');
    if (savedLang && LANGUAGES[savedLang]) {
        userData.language = savedLang;
        setLanguage(savedLang);
    }
    
    userData.joinedAt = new Date().toISOString();
    userData.lastActive = new Date().toISOString();
    
    if (!walletData.referrals) {
        walletData.referrals = {
            count: 0,
            earned: { amsk: 0, bnb: 0 },
            referrals: [],
            claimedMilestones: []
        };
    }
    
    if (!walletData.tasks) {
        walletData.tasks = { completed: [] };
    }
    
    if (!walletData.vipTasks) {
        walletData.vipTasks = {
            claimedMiningRewards: [],
            claimedStakingRewards: []
        };
    }
    
    if (!walletData.transactionHistory) {
        walletData.transactionHistory = [];
    }
    
    if (!walletData.usedTxIds) {
        walletData.usedTxIds = [];
    }
    
    if (!walletData.pendingWithdrawals) {
        walletData.pendingWithdrawals = [];
    }
    
    if (!userData.processedReferrals) {
        userData.processedReferrals = [];
    }
    
    isAdmin = userData.telegramId === CONFIG.ADMIN.TELEGRAM_ID;
    
    updateUserUI();
}

function updateUserUI() {
    if (elements.usernameMini) {
        elements.usernameMini.textContent = userData.firstName;
    }
    
    if (elements.userIdMini) {
        const fullId = userData.telegramId ? userData.telegramId : userData.id;
        elements.userIdMini.textContent = fullId;
    }
    
    if (elements.referralLinkInput) {
        elements.referralLinkInput.value = `https://t.me/AlienMuskbot/Musk?startapp=${userData.referralCode}`;
    }
}

// ====== 14. CHECK PENDING TRANSACTIONS - فحص المعاملات المعلقة ======
async function checkPendingTransactions(force = false) {
    if (!db || !userData) return;
    
    const now = Date.now();
    if (!force && (now - lastCacheTime.history) < CACHE_TIME.HISTORY) {
        console.log("📦 Using cached history (less than 10 minutes old)");
        return;
    }
    
    console.log("🔍 Checking for updated pending transactions...");
    lastCacheTime.history = now;
    
    const pendingTxs = walletData.transactionHistory.filter(tx => 
        (tx.type.includes('deposit') || tx.type.includes('withdrawal')) && 
        tx.status === 'pending' &&
        tx.txId
    );
    
    if (pendingTxs.length === 0) {
        console.log("✅ No pending transactions to check");
        return;
    }
    
    console.log(`⏳ Found ${pendingTxs.length} pending transactions, checking status...`);
    let updated = false;
    
    for (const tx of pendingTxs) {
        try {
            const collection = tx.type.includes('deposit') ? 'deposit_requests' : 'withdrawal_requests';
            const docRef = db.collection(collection).doc(tx.txId);
            const docSnap = await docRef.get();
            
            if (!docSnap.exists) continue;
            
            const data = docSnap.data();
            
            if (data.status !== tx.status) {
                console.log(`🔄 Transaction ${tx.txId} status changed: ${tx.status} → ${data.status}`);
                
                tx.status = data.status;
                tx.message = data.status === 'approved' ? 
                    (tx.type.includes('deposit') ? 'Deposit approved' : 'Withdrawal approved') : 
                    `Rejected: ${data.reason || 'Unknown reason'}`;
                
                if (data.status === 'approved' && tx.type.includes('deposit')) {
                    walletData.balances[tx.currency] = (walletData.balances[tx.currency] || 0) + Math.abs(tx.amount);
                }
                
                if (data.status === 'rejected' && tx.type.includes('withdrawal')) {
                    walletData.balances[tx.currency] = (walletData.balances[tx.currency] || 0) + Math.abs(tx.amount);
                }
                
                updated = true;
            }
        } catch (error) {
            console.error(`❌ Error checking transaction ${tx.txId}:`, error);
        }
    }
    
    if (updated) {
        saveUserDataToLocalStorage();
        updateWalletUI();
        
        if (document.getElementById('historyModal')?.classList.contains('show')) {
            loadHistoryContent('all', 'all');
        }
    }
}

// ====== 15. LOAD USER DATA ======
async function loadUserDataOptimized(force = false) {
    const now = Date.now();
    const localData = localStorage.getItem(`alien_musk_${userData.id}`);
    
    if (!force && localData && (now - lastCacheTime.user) < CACHE_TIME.USER) {
        try {
            const parsed = JSON.parse(localData);
            if (parsed.balances) {
                console.log("📦 Using cached user data (less than 5 minutes old)");
                walletData = parsed;
                lastCacheTime.user = now;
                return;
            }
        } catch (e) {}
    }
    
    await loadUserDataFromFirebase();
    lastCacheTime.user = now;
}

async function loadUserDataFromFirebase(force = false) {
    console.log("🔥 Loading user data from Firebase...");
    
    try {
        if (!db || !userData.id) {
            console.log("⚠️ Firebase or user ID not available, using localStorage");
            await loadUserFromLocalStorage();
            return;
        }
        
        const userDoc = await db.collection(DB_COLLECTIONS.USERS)
            .doc(userData.id)
            .get();
        
        if (userDoc.exists) {
            const firebaseData = userDoc.data();
            
            if (firebaseData.balances) {
                walletData.balances = firebaseData.balances;
            }
            if (firebaseData.mining) {
                walletData.mining = firebaseData.mining;
            }
            if (firebaseData.staking) {
                walletData.staking = firebaseData.staking;
            }
            if (firebaseData.referrals) {
                walletData.referrals = firebaseData.referrals;
            }
            if (firebaseData.tasks) {
                walletData.tasks = firebaseData.tasks;
            }
            if (firebaseData.vipTasks) {
                walletData.vipTasks = firebaseData.vipTasks;
            }
            if (firebaseData.transactionHistory) {
                walletData.transactionHistory = firebaseData.transactionHistory;
            }
            if (firebaseData.pendingWithdrawals) {
                walletData.pendingWithdrawals = firebaseData.pendingWithdrawals;
            }
            
            if (firebaseData.userInfo && firebaseData.userInfo.referralBonusClaimed !== undefined) {
                userData.referralBonusClaimed = firebaseData.userInfo.referralBonusClaimed;
            }
            
            if (firebaseData.userInfo && firebaseData.userInfo.language) {
                userData.language = firebaseData.userInfo.language;
                setLanguage(userData.language);
            }
            
            if (firebaseData.userInfo && firebaseData.userInfo.processedReferrals) {
                userData.processedReferrals = firebaseData.userInfo.processedReferrals;
            }
            
            userData.isNewUser = false;
            console.log("✅ Data loaded from Firebase");
            
            cleanDuplicateTransactions();
            
        } else {
            console.log("📝 New user, saving to Firebase...");
            userData.isNewUser = true;
            await saveUserDataToFirebase(true);
        }
        
        saveUserDataToLocalStorage();
        
    } catch (error) {
        console.error("❌ Error loading from Firebase, falling back to localStorage:", error);
        showMessage("Using offline mode", "info");
        await loadUserFromLocalStorage();
    }
}

function hasImportantChanges() {
    const importantEvents = [
        walletData.balances.AMSK !== 1000 || 
        walletData.balances.USDT !== 0 || 
        walletData.balances.BNB !== 0 || 
        walletData.balances.TON !== 0,
        
        walletData.mining.level !== 1,
        
        walletData.staking.activeStakes.length > 0,
        
        walletData.transactionHistory.some(tx => tx.status === 'pending'),
        
        walletData.pendingWithdrawals.length > 0,
        
        walletData.referrals.count > 0,
        
        walletData.tasks.completed.length > 0,
        
        userData.referredBy !== null
    ];
    
    return importantEvents.some(event => event === true);
}

async function saveUserDataToFirebase(force = false) {
    if (!db || !userData.id) {
        console.log("⚠️ Cannot save to Firebase: No DB connection or user ID");
        return false;
    }
    
    if (!force && !hasImportantChanges()) {
        console.log("⏭️ No important changes, skipping Firebase save");
        return true;
    }
    
    try {
        userData.lastActive = new Date().toISOString();
        walletData.lastUpdate = Date.now();
        
        const firebaseData = {
            balances: walletData.balances,
            mining: walletData.mining,
            staking: walletData.staking,
            referrals: walletData.referrals,
            tasks: walletData.tasks,
            vipTasks: walletData.vipTasks,
            transactionHistory: walletData.transactionHistory?.slice(0, 50) || [],
            pendingWithdrawals: walletData.pendingWithdrawals,
            userInfo: {
                id: userData.id,
                telegramId: userData.telegramId,
                username: userData.username,
                firstName: userData.firstName,
                referralCode: userData.referralCode,
                referredBy: userData.referredBy,
                joinedAt: userData.joinedAt,
                lastActive: userData.lastActive,
                referralBonusClaimed: userData.referralBonusClaimed,
                language: userData.language || currentLanguage,
                processedReferrals: userData.processedReferrals || []
            },
            lastUpdate: walletData.lastUpdate
        };
        
        await db.collection(DB_COLLECTIONS.USERS)
            .doc(userData.id)
            .set(firebaseData, { merge: true });
        
        console.log("💾 User data saved to Firebase");
        userData.lastFirebaseSave = Date.now();
        userData.lastSaveTime = Date.now();
        
        if (userData.isNewUser) {
            userData.isNewUser = false;
        }
        
        return true;
        
    } catch (error) {
        console.error("❌ Error saving to Firebase:", error);
        return false;
    }
}

function saveUserDataToLocalStorage() {
    try {
        const storageKey = `alien_musk_${userData.id}`;
        const dataToSave = {
            balances: walletData.balances,
            mining: walletData.mining,
            staking: walletData.staking,
            referrals: walletData.referrals,
            tasks: walletData.tasks,
            vipTasks: walletData.vipTasks,
            transactionHistory: walletData.transactionHistory,
            usedTxIds: walletData.usedTxIds,
            pendingWithdrawals: walletData.pendingWithdrawals,
            lastUpdate: walletData.lastUpdate,
            language: currentLanguage,
            version: '7.3-zero-waste'
        };
        
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        console.log("💾 Data backed up to localStorage");
        
    } catch (error) {
        console.error("❌ Error saving to localStorage:", error);
    }
}

async function loadUserFromLocalStorage() {
    const storageKey = `alien_musk_${userData.id}`;
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            
            if (parsed.balances) {
                walletData.balances = {
                    AMSK: parsed.balances.AMSK || 1000,
                    USDT: parsed.balances.USDT || 0,
                    BNB: parsed.balances.BNB || 0,
                    TON: parsed.balances.TON || 0
                };
            }
            
            if (parsed.mining) {
                walletData.mining = parsed.mining;
            }
            
            if (parsed.staking) {
                walletData.staking = parsed.staking;
            }
            
            if (parsed.referrals) {
                walletData.referrals = parsed.referrals;
            }
            
            if (parsed.tasks) {
                walletData.tasks = parsed.tasks;
            } else {
                walletData.tasks = { completed: [] };
            }
            
            if (parsed.vipTasks) {
                walletData.vipTasks = parsed.vipTasks;
            } else {
                walletData.vipTasks = {
                    claimedMiningRewards: [],
                    claimedStakingRewards: []
                };
            }
            
            if (parsed.transactionHistory) {
                walletData.transactionHistory = parsed.transactionHistory;
            } else {
                walletData.transactionHistory = [];
            }
            
            if (parsed.usedTxIds) {
                walletData.usedTxIds = parsed.usedTxIds;
            } else {
                walletData.usedTxIds = [];
            }
            
            if (parsed.pendingWithdrawals) {
                walletData.pendingWithdrawals = parsed.pendingWithdrawals;
            } else {
                walletData.pendingWithdrawals = [];
            }
            
            if (parsed.language && LANGUAGES[parsed.language]) {
                setLanguage(parsed.language);
            }
            
            console.log("✅ Data loaded from localStorage");
            cleanDuplicateTransactions();
            
        } catch (error) {
            console.error("❌ Parse error:", error);
            initializeDefaultData();
        }
    } else {
        console.log("📝 No saved data found, using defaults");
        initializeDefaultData();
    }
}

function initializeDefaultData() {
    const today = new Date().setHours(0,0,0,0);
    
    walletData.balances = { AMSK: 1000, USDT: 0, BNB: 0, TON: 0 };
    walletData.mining = {
        level: 1,
        active: false,
        lastReward: null,
        nextReward: null,
        totalMined: 1000,
        minedToday: 0,
        lastResetDate: today
    };
    walletData.staking = {
        activeStakes: [],
        totalEarned: 0,
        totalStaked: 0
    };
    walletData.referrals = {
        count: 0,
        earned: { amsk: 0, bnb: 0 },
        referrals: [],
        claimedMilestones: []
    };
    walletData.tasks = {
        completed: []
    };
    walletData.vipTasks = {
        claimedMiningRewards: [],
        claimedStakingRewards: []
    };
    walletData.transactionHistory = [];
    walletData.usedTxIds = [];
    walletData.pendingWithdrawals = [];
}

function cleanDuplicateTransactions() {
    if (!walletData.transactionHistory) {
        walletData.transactionHistory = [];
        return;
    }
    
    const uniqueMap = new Map();
    walletData.transactionHistory.forEach(tx => {
        uniqueMap.set(tx.id, tx);
    });
    
    walletData.transactionHistory = Array.from(uniqueMap.values());
    walletData.transactionHistory.sort((a, b) => b.timestamp - a.timestamp);
    
    console.log(`🔄 Cleaned transactions: ${walletData.transactionHistory.length} unique transactions`);
}

async function saveUserData() {
    saveUserDataToLocalStorage();
    
    if (hasImportantChanges()) {
        await saveUserDataToFirebase();
    }
}

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
    } else if (type.includes('withdrawal')) {
        iconClass = 'withdraw';
        icon = 'fa-upload';
    } else if (type.includes('referral') || type.includes('milestone')) {
        iconClass = 'referral';
        icon = 'fa-users';
    } else if (type.includes('task')) {
        iconClass = 'task';
        icon = 'fa-tasks';
    } else if (type.includes('vip')) {
        iconClass = 'milestone';
        icon = 'fa-crown';
    } else if (type.includes('swap')) {
        iconClass = 'swap';
        icon = 'fa-exchange-alt';
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
        dateFormatted: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    if (!walletData.transactionHistory) {
        walletData.transactionHistory = [];
    }
    
    const isDuplicate = walletData.transactionHistory.some(tx => 
        tx.type === type && 
        tx.amount === amount && 
        tx.currency === currency && 
        tx.txId === txId &&
        Math.abs(tx.timestamp - transaction.timestamp) < 5000
    );
    
    if (!isDuplicate) {
        walletData.transactionHistory.unshift(transaction);
        
        if (walletData.transactionHistory.length > 100) {
            walletData.transactionHistory = walletData.transactionHistory.slice(0, 100);
        }
        
        console.log(`📝 Transaction added to history: ${type} ${amount} ${currency} (${status})`);
        
        saveUserDataToLocalStorage();
        
        if (status === 'pending' || type.includes('approved') || type.includes('rejected') || type.includes('deposit') || type.includes('withdrawal')) {
            saveUserDataToFirebase();
        }
    }
    
    return transaction;
}

// ====== 16. TRANSACTION HISTORY (مع زر تحديث يدوي) ======
function showTransactionHistory() {
    const modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-history"></i> ${getTranslation('history_title')}</h3>
                    <div style="display: flex; gap: 10px;">
                        <button class="refresh-history-btn" onclick="refreshHistory()" style="background: transparent; border: none; color: var(--quantum-blue); font-size: 18px; cursor: pointer;">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="modal-close" onclick="closeModal()">×</button>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="history-tabs" id="historyTabs">
                        <button class="history-tab active" data-tab="all">${getTranslation('history_all')}</button>
                        <button class="history-tab" data-tab="pending">${getTranslation('history_pending')}</button>
                        <button class="history-tab" data-tab="completed">${getTranslation('history_completed')}</button>
                        <button class="history-tab" data-tab="rejected">${getTranslation('history_rejected')}</button>
                    </div>
                    
                    <div class="history-filters" id="historyFilters">
                        <button class="history-filter-btn active" data-filter="all">${getTranslation('history_all_types')}</button>
                        <button class="history-filter-btn" data-filter="deposit">${getTranslation('history_deposits')}</button>
                        <button class="history-filter-btn" data-filter="withdrawal">${getTranslation('history_withdrawals')}</button>
                        <button class="history-filter-btn" data-filter="mining">${getTranslation('history_mining')}</button>
                        <button class="history-filter-btn" data-filter="staking">${getTranslation('history_staking')}</button>
                        <button class="history-filter-btn" data-filter="swap">${getTranslation('history_swap')}</button>
                        <button class="history-filter-btn" data-filter="referral">${getTranslation('history_referral')}</button>
                        <button class="history-filter-btn" data-filter="task">${getTranslation('history_tasks')}</button>
                        <button class="history-filter-btn" data-filter="vip">${getTranslation('history_vip')}</button>
                    </div>
                    
                    <div id="historyContent" style="max-height: 400px; overflow-y: auto;"></div>
                    
                    <div class="modal-actions mt-20">
                        <button class="btn-secondary" onclick="closeModal()" style="width: 100%;">${getTranslation('close')}</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    loadHistoryContent('all', 'all');
    
    setTimeout(() => {
        const tabs = document.querySelectorAll('#historyTabs .history-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const tabType = tab.dataset.tab;
                const activeFilter = document.querySelector('#historyFilters .history-filter-btn.active')?.dataset.filter || 'all';
                loadHistoryContent(tabType, activeFilter);
            });
        });
        
        const filters = document.querySelectorAll('#historyFilters .history-filter-btn');
        filters.forEach(filter => {
            filter.addEventListener('click', () => {
                filters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                const filterType = filter.dataset.filter;
                const activeTab = document.querySelector('#historyTabs .history-tab.active')?.dataset.tab || 'all';
                loadHistoryContent(activeTab, filterType);
            });
        });
    }, 100);
}

function refreshHistory() {
    const refreshBtn = document.querySelector('.refresh-history-btn i');
    if (refreshBtn) refreshBtn.classList.add('fa-spin');
    
    checkPendingTransactions(true).finally(() => {
        const activeTab = document.querySelector('#historyTabs .history-tab.active')?.dataset.tab || 'all';
        const activeFilter = document.querySelector('#historyFilters .history-filter-btn.active')?.dataset.filter || 'all';
        loadHistoryContent(activeTab, activeFilter);
        
        setTimeout(() => {
            if (refreshBtn) refreshBtn.classList.remove('fa-spin');
        }, 500);
    });
}

function loadHistoryContent(tabType = 'all', filterType = 'all') {
    const historyContent = document.getElementById('historyContent');
    if (!historyContent) return;
    
    let allTransactions = [...(walletData.transactionHistory || [])];
    
    if (walletData.pendingWithdrawals) {
        walletData.pendingWithdrawals.forEach(pending => {
            if (pending.status === 'pending') {
                allTransactions.push({
                    id: pending.id,
                    type: 'withdrawal',
                    amount: -pending.amount,
                    currency: 'USDT',
                    description: `To: ${pending.address?.slice(0, 10)}...`,
                    status: 'pending',
                    message: 'Withdrawal requested - Funds deducted and held for approval',
                    timestamp: pending.createdAt,
                    dateFormatted: new Date(pending.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                });
            }
        });
    }
    
    allTransactions.sort((a, b) => b.timestamp - a.timestamp);
    
    let filteredTransactions = allTransactions;
    
    if (tabType === 'pending') {
        filteredTransactions = allTransactions.filter(tx => tx.status === 'pending');
    } else if (tabType === 'completed') {
        filteredTransactions = allTransactions.filter(tx => tx.status === 'completed' || tx.status === 'approved');
    } else if (tabType === 'rejected') {
        filteredTransactions = allTransactions.filter(tx => tx.status === 'rejected');
    }
    
    if (filterType !== 'all') {
        if (filterType === 'deposit') {
            filteredTransactions = filteredTransactions.filter(tx => tx.type.includes('deposit'));
        } else if (filterType === 'withdrawal') {
            filteredTransactions = filteredTransactions.filter(tx => tx.type.includes('withdrawal'));
        } else if (filterType === 'mining') {
            filteredTransactions = filteredTransactions.filter(tx => tx.type.includes('mining'));
        } else if (filterType === 'staking') {
            filteredTransactions = filteredTransactions.filter(tx => tx.type.includes('staking'));
        } else if (filterType === 'swap') {
            filteredTransactions = filteredTransactions.filter(tx => tx.type.includes('swap'));
        } else if (filterType === 'referral') {
            filteredTransactions = filteredTransactions.filter(tx => tx.type.includes('referral') || tx.type.includes('milestone'));
        } else if (filterType === 'task') {
            filteredTransactions = filteredTransactions.filter(tx => tx.type.includes('task') && !tx.type.includes('vip'));
        } else if (filterType === 'vip') {
            filteredTransactions = filteredTransactions.filter(tx => tx.type.includes('vip'));
        }
    }
    
    if (filteredTransactions.length === 0) {
        historyContent.innerHTML = `
            <div class="history-empty">
                <i class="fas fa-history"></i>
                <p>${getTranslation('history_no_transactions')}</p>
                <small>${getTranslation('history_no_transactions_desc')}</small>
            </div>
        `;
        return;
    }
    
    let html = '<div class="history-list">';
    
    filteredTransactions.slice(0, 50).forEach(tx => {
        const amountColor = tx.amount > 0 ? 'positive' : 'negative';
        const amountSign = tx.amount > 0 ? '+' : '';
        const absAmount = Math.abs(tx.amount);
        
        let iconClass = tx.iconClass || 'swap';
        let icon = tx.icon || 'fa-exchange-alt';
        let typeText = 'Transaction';
        
        if (tx.type.includes('mining')) typeText = 'Mining';
        else if (tx.type.includes('staking')) typeText = 'Staking';
        else if (tx.type.includes('deposit')) typeText = 'Deposit';
        else if (tx.type.includes('withdrawal')) typeText = 'Withdrawal';
        else if (tx.type.includes('referral')) typeText = 'Referral';
        else if (tx.type.includes('milestone')) typeText = 'Milestone';
        else if (tx.type.includes('task')) typeText = 'Task';
        else if (tx.type.includes('vip')) typeText = 'VIP Task';
        else if (tx.type.includes('swap')) typeText = 'Swap';
        
        let statusClass = '';
        let statusText = '';
        if (tx.status === 'pending') {
            statusClass = 'pending';
            statusText = 'Pending';
        } else if (tx.status === 'completed' || tx.status === 'approved') {
            statusClass = 'completed';
            statusText = 'Completed';
        } else if (tx.status === 'rejected') {
            statusClass = 'rejected';
            statusText = 'Rejected';
        }
        
        let displayAmount = `${amountSign}${absAmount.toLocaleString()} ${tx.currency}`;
        if (tx.currency === 'AMSK' && absAmount >= 1000) {
            displayAmount = `${amountSign}${formatNumber(absAmount)} ${tx.currency}`;
        }
        
        html += `
            <div class="history-card">
                <div class="history-card-header">
                    <div class="history-card-icon ${iconClass}">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="history-card-details">
                        <div class="history-card-title">
                            <span class="history-card-type">${typeText}</span>
                            <span class="history-card-amount ${amountColor}">${displayAmount}</span>
                        </div>
                        <div class="history-card-description">
                            ${tx.description || ''}
                            ${tx.message ? `<br><small style="color: ${tx.status === 'approved' ? '#00ff88' : tx.status === 'rejected' ? '#ff4444' : '#ff9900'};">${tx.message}</small>` : ''}
                        </div>
                        <div class="history-card-footer">
                            <span class="history-card-date">${tx.dateFormatted || new Date(tx.timestamp).toLocaleDateString()}</span>
                            <span class="history-card-status ${statusClass}">${statusText}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    if (filteredTransactions.length > 50) {
        html += `<div style="text-align: center; padding: 10px; color: var(--quantum-text-light); font-size: 12px;">
            Showing 50 of ${filteredTransactions.length} transactions
        </div>`;
    }
    
    historyContent.innerHTML = html;
}

// ====== 17. DEPOSIT FUNCTIONS (مع مستمع عند الطلب) ======
async function submitDepositRequest() {
    const activeCurrency = document.querySelector('.deposit-option.active')?.dataset.currency || 'USDT';
    const amountInput = document.getElementById('depositAmount');
    const txIdInput = document.getElementById('depositTxId');
    
    if (!amountInput || !txIdInput) return;
    
    const amount = parseFloat(amountInput.value);
    const txId = txIdInput.value.trim();
    const minAmount = CONFIG.DEPOSIT.MIN_AMOUNTS[activeCurrency];
    
    if (!amount || amount < minAmount) {
        showMessage(`Minimum deposit is ${minAmount} ${activeCurrency}`, "error");
        return;
    }
    
    if (!txId) {
        showMessage("Please enter Transaction ID", "error");
        return;
    }
    
    if (!walletData.usedTxIds) walletData.usedTxIds = [];
    if (walletData.usedTxIds.includes(txId)) {
        showMessage("⚠️ This TX ID has already been used", "warning", 4500);
        return;
    }
    
    // تعطيل الزر لمنع التكرار
    const submitBtn = document.getElementById('submitDepositBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }
    
    try {
        const depositRequest = {
            userId: userData.id,
            telegramId: userData.telegramId,
            username: userData.username,
            currency: activeCurrency,
            amount: amount,
            txId: txId,
            status: 'pending',
            createdAt: Date.now(),
            createdAtFormatted: new Date().toISOString()
        };
        
        let depositId = '';
        
        if (db) {
            const depositRef = await db.collection(DB_COLLECTIONS.DEPOSITS).add(depositRequest);
            depositId = depositRef.id;
            depositRequest.id = depositId;
            
            // مستمع ذكي لمدة 30 ثانية فقط
            startOnDemandListener(DB_COLLECTIONS.DEPOSITS, depositId, (data) => {
                console.log("📥 Deposit update received:", data);
                
                // البحث عن المعاملة الموجودة وتحديثها (بدون إضافة جديدة)
                const existingTx = walletData.transactionHistory.find(t => t.txId === txId);
                if (existingTx) {
                    existingTx.status = data.status;
                    existingTx.message = data.status === 'approved' ? 'Deposit approved' : `Rejected: ${data.reason || 'Unknown'}`;
                    
                    if (data.status === 'approved') {
                        walletData.balances[activeCurrency] = (walletData.balances[activeCurrency] || 0) + amount;
                        showMessage(`✅ Your deposit of ${amount} ${activeCurrency} has been approved!`, 'success');
                        updateWalletUI();
                    } else if (data.status === 'rejected') {
                        showMessage(`❌ Your deposit was rejected: ${data.reason || 'Unknown'}`, 'error');
                    }
                    
                    saveUserDataToLocalStorage();
                }
            });
        } else {
            depositId = 'dep_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            depositRequest.id = depositId;
        }
        
        addTransactionToHistory('deposit_request', amount, activeCurrency, `TX: ${txId.slice(0, 10)}...`, 'pending', 'Deposit request submitted', depositId);
        
        walletData.usedTxIds.push(txId);
        
        await saveUserData();
        closeModal();
        
        showMessage(`✅ Deposit request submitted for ${amount} ${activeCurrency}. Waiting for admin approval.`, "success");
        
    } catch (error) {
        console.error("❌ Error submitting deposit:", error);
        showMessage("Failed to submit deposit request", "error");
    } finally {
        if (submitBtn) {
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Deposit';
            }, 1000);
        }
    }
}

// ====== 18. WITHDRAW FUNCTIONS (مع مستمع عند الطلب) ======
async function submitWithdrawRequest() {
    const amountInput = document.getElementById('withdrawAmount');
    const addressInput = document.getElementById('withdrawAddress');
    
    if (!amountInput || !addressInput) return;
    
    const amount = parseFloat(amountInput.value);
    const address = addressInput.value.trim();
    
    if (!amount || amount < CONFIG.WITHDRAW.MIN_USDT) {
        showMessage(`Minimum withdrawal is ${CONFIG.WITHDRAW.MIN_USDT} USDT`, "error");
        return;
    }
    
    if (!walletData || !walletData.balances) return;
    
    if (amount > walletData.balances.USDT) {
        showMessage(`⚠️ Insufficient balance. You have ${walletData.balances.USDT.toFixed(2)} USDT`, "warning", 4500);
        return;
    }
    
    if (walletData.balances.BNB < CONFIG.WITHDRAW.FEE_BNB) {
        showMessage(`You need at least ${CONFIG.WITHDRAW.FEE_BNB} BNB for withdrawal fee`, "error");
        return;
    }
    
    if (!address || address.length < 20) {
        showMessage(`Please enter a valid wallet address`, "error");
        return;
    }
    
    // تعطيل الزر لمنع التكرار
    const submitBtn = document.getElementById('submitWithdrawBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }
    
    try {
        walletData.balances.USDT -= amount;
        
        const withdrawalId = 'wd_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const withdrawRequest = {
            id: withdrawalId,
            userId: userData.id,
            telegramId: userData.telegramId,
            username: userData.username,
            currency: 'USDT',
            amount: amount,
            address: address,
            fee: CONFIG.WITHDRAW.FEE_BNB,
            status: 'pending',
            createdAt: Date.now(),
            createdAtFormatted: new Date().toISOString()
        };
        
        if (!walletData.pendingWithdrawals) {
            walletData.pendingWithdrawals = [];
        }
        walletData.pendingWithdrawals.push(withdrawRequest);
        
        addTransactionToHistory('withdrawal_request', -amount, 'USDT', 
            `To: ${address.slice(0, 10)}...`, 'pending', 
            'Withdrawal requested - Funds deducted and held for approval', 
            withdrawalId);
        
        if (db) {
            await db.collection(DB_COLLECTIONS.WITHDRAWALS).doc(withdrawalId).set(withdrawRequest);
            
            // مستمع ذكي لمدة 30 ثانية فقط
            startOnDemandListener(DB_COLLECTIONS.WITHDRAWALS, withdrawalId, (data) => {
                console.log("📤 Withdrawal update received:", data);
                
                // البحث عن المعاملة الموجودة وتحديثها
                const pendingIndex = walletData.pendingWithdrawals.findIndex(w => w.id === withdrawalId);
                const existingTx = walletData.transactionHistory.find(t => t.txId === withdrawalId);
                
                if (data.status === 'approved') {
                    if (pendingIndex !== -1) {
                        walletData.pendingWithdrawals.splice(pendingIndex, 1);
                    }
                    
                    if (walletData.balances.BNB >= CONFIG.WITHDRAW.FEE_BNB) {
                        walletData.balances.BNB -= CONFIG.WITHDRAW.FEE_BNB;
                    }
                    
                    if (existingTx) {
                        existingTx.status = 'approved';
                        existingTx.message = 'Withdrawal approved and processed';
                    }
                    
                    showMessage(`✅ Your withdrawal of ${amount} USDT has been approved!`, 'success');
                    
                } else if (data.status === 'rejected') {
                    walletData.balances.USDT += amount;
                    
                    if (pendingIndex !== -1) {
                        walletData.pendingWithdrawals.splice(pendingIndex, 1);
                    }
                    
                    if (existingTx) {
                        existingTx.status = 'rejected';
                        existingTx.message = `Rejected: ${data.reason || 'Unknown'}`;
                    }
                    
                    showMessage(`❌ Your withdrawal was rejected: ${data.reason || 'Unknown'}`, 'error');
                }
                
                saveUserDataToLocalStorage();
                updateWalletUI();
            });
        }
        
        updateWalletUI();
        await saveUserData();
        
        closeModal();
        
        showMessage(`✅ Withdrawal request submitted for ${amount} USDT. Funds deducted and held for approval.`, "success");
        
    } catch (error) {
        console.error("❌ Error submitting withdrawal:", error);
        showMessage("Failed to submit withdrawal request", "error");
        
        if (amount) {
            walletData.balances.USDT += amount;
            updateWalletUI();
        }
    } finally {
        if (submitBtn) {
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Request Withdrawal';
            }, 1000);
        }
    }
}

// ====== 19. ADMIN FUNCTIONS (مع بحث مستخدم واحد وعرض بياناته) ======
function initAdminSystem() {
    if (elements.adminLogo) {
        let clickCount = 0;
        let lastClickTime = 0;
        
        elements.adminLogo.addEventListener('click', () => {
            const now = Date.now();
            
            if (now - lastClickTime > 2000) {
                clickCount = 0;
            }
            
            clickCount++;
            lastClickTime = now;
            
            console.log(`👑 Logo click ${clickCount}/5`);
            
            if (clickCount >= 5) {
                showAdminLogin();
                clickCount = 0;
            }
        });
        
        console.log("👑 Admin system initialized");
    }
}

function showAdminLogin() {
    const modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-lock"></i> Admin Access</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; padding: 20px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">🔒</div>
                        <h3 style="color: var(--quantum-text); margin-bottom: 20px;">Administrator Access</h3>
                        <p style="color: var(--quantum-text-light); margin-bottom: 30px;">Enter administrator password</p>
                        
                        <div style="margin-bottom: 20px;">
                            <input type="password" 
                                   id="adminPasswordInput" 
                                   style="width: 100%; padding: 12px 15px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.2); border-radius: 8px; color: white; font-size: 16px;"
                                   placeholder="Enter password">
                        </div>
                        
                        <button onclick="checkAdminPassword()" 
                                style="width: 100%; padding: 12px; background: var(--gradient-quantum); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                        
                        <div id="adminError" style="color: #ff4444; margin-top: 15px; display: none;">
                            <i class="fas fa-exclamation-circle"></i> <span id="adminErrorText"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

function checkAdminPassword() {
    const passwordInput = document.getElementById('adminPasswordInput');
    const errorDiv = document.getElementById('adminError');
    const errorText = document.getElementById('adminErrorText');
    
    if (!passwordInput) return;
    
    if (passwordInput.value !== CONFIG.ADMIN.PASSWORD) {
        if (errorDiv && errorText) {
            errorText.textContent = "Incorrect password";
            errorDiv.style.display = 'block';
        }
        return;
    }
    
    if (!userData.telegramId || userData.telegramId !== CONFIG.ADMIN.TELEGRAM_ID) {
        if (errorDiv && errorText) {
            errorText.textContent = "Access denied: Invalid Telegram ID";
            errorDiv.style.display = 'block';
        }
        return;
    }
    
    isAdmin = true;
    closeModal();
    showAdminPanel();
    showMessage("✅ Admin access granted", "success");
}

async function showAdminPanel() {
    if (!isAdmin) return;
    
    const modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()" style="max-width: 800px;">
                <div class="modal-header">
                    <h3><i class="fas fa-user-shield"></i> Admin Panel</h3>
                    <div style="display: flex; gap: 10px;">
                        <button class="refresh-admin-btn" onclick="refreshAdminData()" style="background: transparent; border: none; color: var(--quantum-green); font-size: 18px; cursor: pointer;">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="modal-close" onclick="closeModal()">×</button>
                    </div>
                </div>
                
                <div class="modal-body">
                    <div class="admin-tabs" style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                        <button class="admin-tab active" data-admin-tab="deposits" onclick="switchAdminTab('deposits')">Pending Deposits</button>
                        <button class="admin-tab" data-admin-tab="withdrawals" onclick="switchAdminTab('withdrawals')">Pending Withdrawals</button>
                        <button class="admin-tab" data-admin-tab="users" onclick="switchAdminTab('users')">User Management</button>
                    </div>
                    
                    <div id="adminContent" style="min-height: 300px;">
                        <div style="text-align: center; padding: 50px;">
                            <i class="fas fa-hand-pointer" style="font-size: 48px; color: var(--quantum-blue); opacity: 0.5;"></i>
                            <p style="margin-top: 20px; color: var(--quantum-text-light);">Click the refresh button to load data</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

async function refreshAdminData() {
    if (!isAdmin || !db) return;
    
    const refreshBtn = document.querySelector('.refresh-admin-btn i');
    if (refreshBtn) refreshBtn.classList.add('fa-spin');
    
    const activeTab = document.querySelector('.admin-tab.active')?.dataset.adminTab || 'deposits';
    
    try {
        let html = '';
        
        if (activeTab === 'deposits') {
            const snapshot = await db.collection(DB_COLLECTIONS.DEPOSITS)
                .where('status', '==', 'pending')
                .get();
            
            if (snapshot.empty) {
                html = '<div class="empty-state">No pending deposits</div>';
            } else {
                html = '<div class="admin-requests-list">';
                snapshot.forEach(doc => {
                    const data = doc.data();
                    html += `
                        <div class="request-item" data-id="${doc.id}">
                            <div class="request-header">
                                <div class="request-user">${data.username || 'User'}</div>
                                <div class="request-amount">+${data.amount} ${data.currency}</div>
                            </div>
                            <div class="request-details">
                                <div>TX: ${data.txId?.slice(0, 20)}...</div>
                                <div>User ID: ${data.userId?.replace('tg_', '')}</div>
                                <div>Time: ${new Date(data.createdAt).toLocaleString()}</div>
                            </div>
                            <div class="request-actions">
                                <button class="btn-approve" onclick="adminApproveDeposit('${doc.id}', '${data.userId}', '${data.currency}', ${data.amount}, '${data.txId}')">Approve</button>
                                <button class="btn-reject" onclick="adminRejectDeposit('${doc.id}', '${data.userId}', '${data.txId}')">Reject</button>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
            }
        } else if (activeTab === 'withdrawals') {
            const snapshot = await db.collection(DB_COLLECTIONS.WITHDRAWALS)
                .where('status', '==', 'pending')
                .get();
            
            if (snapshot.empty) {
                html = '<div class="empty-state">No pending withdrawals</div>';
            } else {
                html = '<div class="admin-requests-list">';
                snapshot.forEach(doc => {
                    const data = doc.data();
                    html += `
                        <div class="request-item" data-id="${doc.id}">
                            <div class="request-header">
                                <div class="request-user">${data.username || 'User'}</div>
                                <div class="request-amount">-${data.amount} ${data.currency}</div>
                            </div>
                            <div class="request-details">
                                <div>Address: ${data.address?.slice(0, 20)}...</div>
                                <div>User ID: ${data.userId?.replace('tg_', '')}</div>
                                <div>Time: ${new Date(data.createdAt).toLocaleString()}</div>
                            </div>
                            <div class="request-actions">
                                <button class="btn-approve" onclick="adminApproveWithdrawal('${doc.id}', '${data.userId}', ${data.amount})">Approve</button>
                                <button class="btn-reject" onclick="adminRejectWithdrawal('${doc.id}', '${data.userId}', ${data.amount})">Reject</button>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
            }
        } else if (activeTab === 'users') {
            html = `
                <div class="admin-user-search-section">
                    <div class="admin-search-box">
                        <input type="text" 
                               id="adminSearchUserId" 
                               class="admin-search-input" 
                               placeholder="Enter user ID (tg_... or web_...)"
                               style="width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.2); border-radius: 8px; color: white;">
                        <button onclick="adminSearchUser()" 
                                style="width: 100%; margin-top: 10px; padding: 10px; background: var(--gradient-quantum); border: none; border-radius: 8px; color: white; font-weight: 600;">
                            <i class="fas fa-search"></i> Search User
                        </button>
                    </div>
                    <div id="adminUserResult" style="margin-top: 20px;"></div>
                </div>
            `;
        }
        
        document.getElementById('adminContent').innerHTML = html;
        
    } catch (error) {
        console.error("❌ Error refreshing admin data:", error);
        document.getElementById('adminContent').innerHTML = '<div class="empty-state">Error loading data</div>';
    } finally {
        setTimeout(() => {
            if (refreshBtn) refreshBtn.classList.remove('fa-spin');
        }, 500);
    }
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-admin-tab="${tab}"]`).classList.add('active');
    refreshAdminData();
}

// دالة البحث عن مستخدم واحد وعرض بياناته
async function adminSearchUser() {
    const targetId = document.getElementById('adminSearchUserId')?.value.trim();
    if (!targetId) {
        showMessage("Please enter a user ID", "warning");
        return;
    }
    
    const resultDiv = document.getElementById('adminUserResult');
    resultDiv.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';
    
    try {
        // قراءة واحدة فقط من Firebase
        const userDoc = await db.collection(DB_COLLECTIONS.USERS).doc(targetId).get();
        
        if (!userDoc.exists) {
            resultDiv.innerHTML = `
                <div class="admin-error" style="text-align: center; padding: 20px; color: #ff4444;">
                    <i class="fas fa-exclamation-circle" style="font-size: 36px; margin-bottom: 10px;"></i>
                    <p>User not found with ID: ${targetId}</p>
                </div>
            `;
            return;
        }
        
        const userData_ = userDoc.data();
        
        // حساب الإحصائيات
        const referralCount = userData_.referrals?.count || 0;
        const earnedAMSK = userData_.referrals?.earned?.amsk || 0;
        const earnedBNB = userData_.referrals?.earned?.bnb || 0;
        
        // عرض بطاقة المستخدم
        resultDiv.innerHTML = `
            <div class="admin-user-profile" style="background: linear-gradient(145deg, #1e1e35, #15152a); border-radius: 16px; padding: 20px; border: 1px solid rgba(0,255,136,0.2);">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, var(--quantum-green), var(--quantum-blue)); display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-user-astronaut" style="font-size: 24px; color: white;"></i>
                    </div>
                    <div>
                        <h3 style="color: var(--quantum-text); margin-bottom: 5px;">${userData_.userInfo?.firstName || 'User'}</h3>
                        <p style="color: var(--quantum-text-light); font-family: monospace; font-size: 12px;">${targetId}</p>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
                    <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 12px; text-align: center;">
                        <div style="font-size: 20px; font-weight: 800; color: var(--quantum-blue);">${referralCount}</div>
                        <div style="font-size: 11px; color: var(--quantum-text-light);">Referrals</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 12px; text-align: center;">
                        <div style="font-size: 20px; font-weight: 800; color: var(--quantum-green);">${formatNumber(earnedAMSK)}</div>
                        <div style="font-size: 11px; color: var(--quantum-text-light);">AMSK Earned</div>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="color: var(--quantum-text); margin-bottom: 10px; font-size: 14px;">Current Balances</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                        <div style="display: flex; align-items: center; gap: 8px; background: rgba(0,255,136,0.05); border: 1px solid rgba(0,255,136,0.2); border-radius: 8px; padding: 8px;">
                            <img src="${CONFIG.CMC_ICONS.AMSK}" width="20" height="20" style="border-radius: 50%;">
                            <span style="color: var(--quantum-text); font-size: 12px;">${formatNumber(userData_.balances?.AMSK || 0)}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; background: rgba(0,212,255,0.05); border: 1px solid rgba(0,212,255,0.2); border-radius: 8px; padding: 8px;">
                            <img src="${CONFIG.CMC_ICONS.USDT}" width="20" height="20" style="border-radius: 50%;">
                            <span style="color: var(--quantum-text); font-size: 12px;">${(userData_.balances?.USDT || 0).toFixed(2)}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; background: rgba(255,215,0,0.05); border: 1px solid rgba(255,215,0,0.2); border-radius: 8px; padding: 8px;">
                            <img src="${CONFIG.CMC_ICONS.BNB}" width="20" height="20" style="border-radius: 50%;">
                            <span style="color: var(--quantum-text); font-size: 12px;">${(userData_.balances?.BNB || 0).toFixed(4)}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; background: rgba(157,78,221,0.05); border: 1px solid rgba(157,78,221,0.2); border-radius: 8px; padding: 8px;">
                            <img src="${CONFIG.CMC_ICONS.TON}" width="20" height="20" style="border-radius: 50%;">
                            <span style="color: var(--quantum-text); font-size: 12px;">${(userData_.balances?.TON || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <select id="adminBalanceCurrency" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.2); border-radius: 8px; color: white; margin-bottom: 10px;">
                        <option value="AMSK">AMSK</option>
                        <option value="USDT">USDT</option>
                        <option value="BNB">BNB</option>
                        <option value="TON">TON</option>
                    </select>
                    <input type="number" 
                           id="adminBalanceAmount" 
                           placeholder="Amount"
                           step="any"
                           style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.2); border-radius: 8px; color: white; margin-bottom: 10px;">
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button onclick="adminAddToUser('${targetId}')" 
                            style="flex: 1; padding: 10px; background: var(--gradient-quantum); border: none; border-radius: 8px; color: white; font-weight: 600;">
                        <i class="fas fa-plus-circle"></i> Add
                    </button>
                    <button onclick="adminSubtractFromUser('${targetId}')" 
                            style="flex: 1; padding: 10px; background: linear-gradient(135deg, #ff4444, #cc0000); border: none; border-radius: 8px; color: white; font-weight: 600;">
                        <i class="fas fa-minus-circle"></i> Subtract
                    </button>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error("❌ Error searching user:", error);
        resultDiv.innerHTML = `
            <div class="admin-error" style="text-align: center; padding: 20px; color: #ff4444;">
                <i class="fas fa-exclamation-circle" style="font-size: 36px; margin-bottom: 10px;"></i>
                <p>Error searching user: ${error.message}</p>
            </div>
        `;
    }
}

async function adminAddToUser(targetId) {
    const amount = document.getElementById('adminBalanceAmount')?.value;
    const currency = document.getElementById('adminBalanceCurrency')?.value;
    
    if (!amount || !currency) {
        showMessage("Please enter amount and select currency", "warning");
        return;
    }
    
    if (!db) {
        showMessage("Firebase not available", "error");
        return;
    }
    
    try {
        // كتابة واحدة فقط في Firebase
        await db.collection(DB_COLLECTIONS.USERS).doc(targetId).update({
            [`balances.${currency}`]: firebase.firestore.FieldValue.increment(parseFloat(amount))
        });
        
        showMessage(`✅ Added ${amount} ${currency} to ${targetId}`, 'success');
        
        // تحديث العرض
        adminSearchUser();
        
    } catch (error) {
        console.error("❌ Error adding balance:", error);
        showMessage("Failed to add balance: " + error.message, "error");
    }
}

async function adminSubtractFromUser(targetId) {
    const amount = document.getElementById('adminBalanceAmount')?.value;
    const currency = document.getElementById('adminBalanceCurrency')?.value;
    
    if (!amount || !currency) {
        showMessage("Please enter amount and select currency", "warning");
        return;
    }
    
    if (!db) {
        showMessage("Firebase not available", "error");
        return;
    }
    
    try {
        // كتابة واحدة فقط في Firebase
        await db.collection(DB_COLLECTIONS.USERS).doc(targetId).update({
            [`balances.${currency}`]: firebase.firestore.FieldValue.increment(-parseFloat(amount))
        });
        
        showMessage(`✅ Subtracted ${amount} ${currency} from ${targetId}`, 'success');
        
        // تحديث العرض
        adminSearchUser();
        
    } catch (error) {
        console.error("❌ Error subtracting balance:", error);
        showMessage("Failed to subtract balance: " + error.message, "error");
    }
}

async function adminApproveDeposit(docId, targetUserId, currency, amount, txId) {
    if (!isAdmin || !db) return;
    
    try {
        await db.collection(DB_COLLECTIONS.DEPOSITS).doc(docId).update({
            status: 'approved',
            approvedAt: Date.now(),
            approvedBy: userData.id
        });
        
        await db.collection(DB_COLLECTIONS.USERS).doc(targetUserId).update({
            [`balances.${currency}`]: firebase.firestore.FieldValue.increment(amount)
        });
        
        // تحديث المعاملة الموجودة في localStorage (بدون إضافة جديدة)
        const existingTx = walletData.transactionHistory.find(t => t.txId === txId || t.txId === docId);
        if (existingTx) {
            existingTx.status = 'approved';
            existingTx.message = 'Deposit approved';
            saveUserDataToLocalStorage();
        }
        
        showMessage(`✅ Deposit approved: +${amount} ${currency}`, 'success');
        refreshAdminData();
        
    } catch (error) {
        console.error("❌ Error approving deposit:", error);
        showMessage("Failed to approve deposit", "error");
    }
}

async function adminRejectDeposit(docId, targetUserId, txId) {
    if (!isAdmin || !db) return;
    
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    
    try {
        await db.collection(DB_COLLECTIONS.DEPOSITS).doc(docId).update({
            status: 'rejected',
            reason: reason,
            rejectedAt: Date.now(),
            rejectedBy: userData.id
        });
        
        // تحديث المعاملة الموجودة في localStorage
        const existingTx = walletData.transactionHistory.find(t => t.txId === txId || t.txId === docId);
        if (existingTx) {
            existingTx.status = 'rejected';
            existingTx.message = `Rejected: ${reason}`;
            saveUserDataToLocalStorage();
        }
        
        showMessage(`✅ Deposit rejected`, 'success');
        refreshAdminData();
        
    } catch (error) {
        console.error("❌ Error rejecting deposit:", error);
        showMessage("Failed to reject deposit", "error");
    }
}

async function adminApproveWithdrawal(docId, targetUserId, amount) {
    if (!isAdmin || !db) return;
    
    try {
        await db.collection(DB_COLLECTIONS.WITHDRAWALS).doc(docId).update({
            status: 'approved',
            approvedAt: Date.now(),
            approvedBy: userData.id
        });
        
        // تحديث المعاملة الموجودة في localStorage
        const existingTx = walletData.transactionHistory.find(t => t.txId === docId);
        if (existingTx) {
            existingTx.status = 'approved';
            existingTx.message = 'Withdrawal approved';
            saveUserDataToLocalStorage();
        }
        
        showMessage(`✅ Withdrawal approved: -${amount} USDT`, 'success');
        refreshAdminData();
        
    } catch (error) {
        console.error("❌ Error approving withdrawal:", error);
        showMessage("Failed to approve withdrawal", "error");
    }
}

async function adminRejectWithdrawal(docId, targetUserId, amount) {
    if (!isAdmin || !db) return;
    
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    
    try {
        await db.collection(DB_COLLECTIONS.WITHDRAWALS).doc(docId).update({
            status: 'rejected',
            reason: reason,
            rejectedAt: Date.now(),
            rejectedBy: userData.id
        });
        
        await db.collection(DB_COLLECTIONS.USERS).doc(targetUserId).update({
            'balances.USDT': firebase.firestore.FieldValue.increment(amount)
        });
        
        // تحديث المعاملة الموجودة في localStorage
        const existingTx = walletData.transactionHistory.find(t => t.txId === docId);
        if (existingTx) {
            existingTx.status = 'rejected';
            existingTx.message = `Rejected: ${reason}`;
            saveUserDataToLocalStorage();
        }
        
        showMessage(`✅ Withdrawal rejected, funds returned`, 'success');
        refreshAdminData();
        
    } catch (error) {
        console.error("❌ Error rejecting withdrawal:", error);
        showMessage("Failed to reject withdrawal", "error");
    }
}

// ====== 20. MINING FUNCTIONS ======
function handleMiningAction() {
    if (!walletData.mining) return;
    
    const mining = walletData.mining;
    const now = Date.now();
    
    if (mining.active && mining.nextReward && now < mining.nextReward) {
        showMessage("⏳ Mining in progress. Please wait.", "info");
        return;
    }
    
    if (!mining.active) {
        startMining();
    } else if (mining.nextReward && now >= mining.nextReward) {
        claimMiningReward();
    }
}

async function startMining() {
    try {
        walletData.mining.active = true;
        walletData.mining.lastReward = Date.now();
        walletData.mining.nextReward = Date.now() + CONFIG.MINING.DURATION;
        
        updateMiningDisplay();
        await saveUserData();
        
        showMessage("⚡ Quantum mining started!", "success");
        
    } catch (error) {
        console.error("❌ Error starting mining:", error);
        showMessage("Failed to start mining", "error");
    }
}

async function claimMiningReward() {
    try {
        const level = CONFIG.MINING.LEVELS[walletData.mining.level];
        let reward = level.reward;
        
        const now = new Date();
        const today = now.setHours(0,0,0,0);
        
        if (!walletData.mining.lastResetDate || walletData.mining.lastResetDate < today) {
            walletData.mining.minedToday = 0;
            walletData.mining.lastResetDate = today;
        }
        
        walletData.balances.AMSK = (walletData.balances.AMSK || 0) + reward;
        walletData.mining.totalMined = (walletData.mining.totalMined || 0) + reward;
        walletData.mining.minedToday = (walletData.mining.minedToday || 0) + reward;
        walletData.mining.lastReward = Date.now();
        walletData.mining.nextReward = Date.now() + CONFIG.MINING.DURATION;
        
        addTransactionToHistory('mining_reward', reward, 'AMSK', 'Mining reward', 'completed', 'Mining reward claimed');
        
        updateMiningDisplay();
        updateWalletUI();
        await saveUserData();
        
        showMessage(`💰 +${formatNumber(reward)} AMSK mined!`, "success");
        
    } catch (error) {
        console.error("❌ Error claiming mining reward:", error);
        showMessage("Failed to claim reward", "error");
    }
}

function updateMiningDisplay() {
    if (!walletData.mining) return;
    
    const mining = walletData.mining;
    const level = CONFIG.MINING.LEVELS[mining.level] || CONFIG.MINING.LEVELS[1];
    
    const now = new Date();
    const today = now.setHours(0,0,0,0);
    
    if (!mining.lastResetDate || mining.lastResetDate < today) {
        mining.minedToday = 0;
        mining.lastResetDate = today;
    }
    
    if (elements.currentMiningLevel) {
        elements.currentMiningLevel.textContent = mining.level;
    }
    
    if (elements.currentHashrateDisplay) {
        elements.currentHashrateDisplay.textContent = formatNumber(level.hashrate);
    }
    
    updateMiningTimer();
    
    if (elements.nextRewardAmount) {
        elements.nextRewardAmount.textContent = formatNumber(level.reward);
    }
    
    if (elements.totalMined) {
        elements.totalMined.textContent = formatNumber(mining.totalMined);
    }
    
    if (elements.minedToday) {
        elements.minedToday.textContent = formatNumber(mining.minedToday);
    }
    
    updateUpgradeCards();
    updateMiningButton();
}

function updateMiningTimer() {
    if (!walletData.mining || !elements.miningTimerDisplay) return;
    
    const now = Date.now();
    const nextRewardTime = walletData.mining.nextReward;
    
    if (!nextRewardTime) {
        elements.miningTimerDisplay.textContent = "02:30:00";
        return;
    }
    
    const timeLeft = nextRewardTime - now;
    
    if (timeLeft <= 0) {
        elements.miningTimerDisplay.textContent = "READY!";
        elements.miningTimerDisplay.style.color = "#00ff88";
        
        if (elements.startMiningBtn) {
            elements.startMiningBtn.innerHTML = '<i class="fas fa-gift"></i><span>Claim Reward</span>';
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
            elements.startMiningBtn.innerHTML = '<i class="fas fa-play"></i><span>Mining...</span>';
            elements.startMiningBtn.classList.remove('claim-mode');
        }
    }
}

function updateMiningButton() {
    if (!elements.startMiningBtn) return;
    
    const mining = walletData.mining;
    const now = Date.now();
    
    if (!mining.active) {
        elements.startMiningBtn.innerHTML = '<i class="fas fa-play"></i><span>Start Mining</span>';
        elements.startMiningBtn.classList.remove('claim-mode');
        elements.startMiningBtn.disabled = false;
    } else if (mining.nextReward && now >= mining.nextReward) {
        elements.startMiningBtn.innerHTML = '<i class="fas fa-gift"></i><span>Claim Reward</span>';
        elements.startMiningBtn.classList.add('claim-mode');
        elements.startMiningBtn.disabled = false;
    } else {
        elements.startMiningBtn.innerHTML = '<i class="fas fa-play"></i><span>Mining...</span>';
        elements.startMiningBtn.classList.remove('claim-mode');
        elements.startMiningBtn.disabled = true;
    }
}

function updateUpgradeCards() {
    if (!elements.upgradeCardsContainer) return;
    
    const currentLevel = walletData.mining.level;
    const usdtBalance = walletData.balances.USDT || 0;

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
            buttonClass = '';
            disabled = false;
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
                    <div class="upgrade-stat roi">
                        <i class="fas fa-chart-line"></i>
                        <span>ROI: ${levelData.apy}</span>
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
    
    elements.upgradeCardsContainer.innerHTML = html;
}

async function upgradeMiningLevel(level) {
    try {
        level = parseInt(level);
        const levelData = CONFIG.MINING.LEVELS[level];
        
        if (!levelData) {
            throw new Error("Invalid mining level");
        }
        
        if (level <= walletData.mining.level) {
            showMessage("Already at or above this level!", "warning");
            return;
        }
        
        if (walletData.balances.USDT < levelData.cost) {
            showMessage(`⚠️ Insufficient balance! Need ${levelData.cost} USDT for ${levelData.name} upgrade.`, "warning", 4500);
            return;
        }
        
        walletData.balances.USDT -= levelData.cost;
        walletData.mining.level = level;
        
        addTransactionToHistory('mining_upgrade', -levelData.cost, 'USDT', `Upgrade to ${levelData.name} level`, 'completed', 'Mining level upgraded');
        
        checkMiningVipReward(level);
        
        updateMiningDisplay();
        updateWalletUI();
        await saveUserData();
        
        showMessage(`⚡ Upgraded to ${levelData.name} level! Hashrate: ${levelData.hashrate.toLocaleString()}/s`, "success");
        
    } catch (error) {
        console.error("❌ Error upgrading mining level:", error);
        showMessage("Failed to upgrade mining level", "error");
    }
}

// ====== 21. STAKING FUNCTIONS ======
function openStakeModal(planId) {
    const plan = CONFIG.STAKING.PLANS[planId];
    if (!plan) return;
    
    const usdtBalance = walletData.balances.USDT || 0;
    const maxAmount = Math.max(plan.minAmount, Math.min(usdtBalance, plan.minAmount * 10));
    const initialAmount = Math.max(plan.minAmount, Math.min(plan.minAmount * 2, maxAmount));
    
    const modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-gem"></i> ${plan.name} Staking</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="stake-plan-info">
                        <div class="plan-icon">
                            <i class="fas fa-gem"></i>
                        </div>
                        <div class="plan-details">
                            <h4>${plan.name} Plan</h4>
                            <div class="plan-apr">${plan.apr}% APR</div>
                            <div class="plan-duration">${plan.duration} Days</div>
                        </div>
                    </div>
                    
                    <div class="stake-amount-section">
                        <div class="amount-header">
                            <span>Staking Amount (USDT)</span>
                            <span class="balance">Balance: ${usdtBalance.toFixed(2)} USDT</span>
                        </div>
                        <div class="amount-input-group">
                            <input type="number" 
                                   id="stakeAmount" 
                                   class="amount-input"
                                   value="${initialAmount.toFixed(2)}"
                                   min="${plan.minAmount}"
                                   max="${maxAmount}"
                                   step="0.01"
                                   oninput="calculateStakeReward(${planId})">
                            <button class="max-btn" onclick="setMaxStakeAmount(${planId})">MAX</button>
                        </div>
                        <div class="amount-range">
                            <input type="range" 
                                   id="stakeSlider" 
                                   min="${plan.minAmount}" 
                                   max="${maxAmount}" 
                                   value="${initialAmount}"
                                   step="1"
                                   oninput="updateStakeAmountFromSlider(${planId})">
                            <div class="range-labels">
                                <span>${plan.minAmount} USDT</span>
                                <span>${maxAmount.toFixed(0)} USDT</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stake-reward-calculation">
                        <div class="reward-header">
                            <i class="fas fa-calculator"></i>
                            <span>Reward Calculation</span>
                        </div>
                        <div class="reward-details">
                            <div class="reward-item">
                                <span>Daily Reward:</span>
                                <span id="dailyReward">0 AMSK</span>
                            </div>
                            <div class="reward-item">
                                <span>Total Reward (${plan.duration} days):</span>
                                <span id="totalReward">0 AMSK</span>
                            </div>
                            <div class="reward-item">
                                <span>APR:</span>
                                <span>${plan.apr}%</span>
                            </div>
                            <div class="reward-item total">
                                <span>Total Return:</span>
                                <span id="totalReturn">0 AMSK</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="closeModal()">
                            Cancel
                        </button>
                        <button class="btn-primary" id="confirmStakeBtn" onclick="confirmStaking(${planId})" ${usdtBalance >= plan.minAmount ? '' : 'disabled'}>
                            Confirm Stake
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    setTimeout(() => {
        calculateStakeReward(planId);
    }, 100);
}

function calculateStakeReward(planId) {
    const plan = CONFIG.STAKING.PLANS[planId];
    const amountInput = document.getElementById('stakeAmount');
    const slider = document.getElementById('stakeSlider');
    const confirmBtn = document.getElementById('confirmStakeBtn');
    
    if (!amountInput || !plan) return;
    
    const amount = parseFloat(amountInput.value) || 0;
    const usdtBalance = walletData.balances.USDT || 0;
    
    if (slider) {
        slider.value = amount;
    }
    
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
    
    if (document.getElementById('dailyReward')) {
        document.getElementById('dailyReward').textContent = `${dailyReward.toLocaleString()} AMSK`;
    }
    
    if (document.getElementById('totalReward')) {
        document.getElementById('totalReward').textContent = `${totalReward.toLocaleString()} AMSK`;
    }
    
    if (document.getElementById('totalReturn')) {
        const usdValue = (totalReward * CONFIG.PRICES.AMSK).toFixed(2);
        document.getElementById('totalReturn').textContent = `${totalReward.toLocaleString()} AMSK (≈ $${usdValue})`;
    }
    
    if (amount < plan.minAmount || amount > usdtBalance) {
        if (confirmBtn) confirmBtn.disabled = true;
        return;
    }
    
    if (confirmBtn) confirmBtn.disabled = false;
}

function setMaxStakeAmount(planId) {
    const plan = CONFIG.STAKING.PLANS[planId];
    const amountInput = document.getElementById('stakeAmount');
    const slider = document.getElementById('stakeSlider');
    
    if (!amountInput || !plan) return;
    
    const usdtBalance = walletData.balances.USDT || 0;
    const maxAmount = Math.max(plan.minAmount, Math.min(usdtBalance, plan.minAmount * 10));
    
    amountInput.value = maxAmount.toFixed(2);
    
    if (slider) {
        slider.value = maxAmount;
    }
    
    calculateStakeReward(planId);
}

function updateStakeAmountFromSlider(planId) {
    const slider = document.getElementById('stakeSlider');
    const amountInput = document.getElementById('stakeAmount');
    
    if (slider && amountInput) {
        amountInput.value = parseFloat(slider.value).toFixed(2);
        calculateStakeReward(planId);
    }
}

async function confirmStaking(planId) {
    try {
        const plan = CONFIG.STAKING.PLANS[planId];
        if (!plan) {
            throw new Error("Plan not found");
        }
        
        const amountInput = document.getElementById('stakeAmount');
        if (!amountInput) return;
        
        const amount = parseFloat(amountInput.value);
        
        if (isNaN(amount) || amount < plan.minAmount) {
            showMessage(`Minimum stake is ${plan.minAmount} USDT`, "error");
            return;
        }
        
        if (walletData.balances.USDT < amount) {
            showMessage(`⚠️ Insufficient USDT balance. Need ${(amount - walletData.balances.USDT).toFixed(2)} to stake.`, "warning", 4500);
            return;
        }
        
        walletData.balances.USDT -= amount;
        
        const stake = {
            planId: planId,
            amount: amount,
            startTime: Date.now(),
            duration: plan.duration,
            claimed: false
        };
        
        if (!walletData.staking.activeStakes) {
            walletData.staking.activeStakes = [];
        }
        walletData.staking.activeStakes.push(stake);
        walletData.staking.totalStaked = (walletData.staking.totalStaked || 0) + amount;
        
        addTransactionToHistory('staking_start', -amount, 'USDT', `${plan.name} Plan - ${plan.duration} days`, 'completed', 'Staking started');
        
        checkStakingVipReward(planId, plan.name);
        
        updateWalletUI();
        updateStakingDisplay();
        
        closeModal();
        showMessage(`✅ Staked ${amount} USDT for ${plan.duration} days!`, "success");
        await saveUserData();
        
    } catch (error) {
        console.error("❌ Error confirming stake:", error);
        showMessage("Failed to process stake", "error");
    }
}

function updateStakingDisplay() {
    if (!walletData.staking) {
        console.log("⚠️ Staking data not ready");
        return;
    }
    updateStakingStats();
    if (Array.isArray(walletData.staking.activeStakes)) {
        updateActiveStakes();
    } else {
        console.warn("Staking stakes not ready");
        if (elements.activeStakesList) {
            elements.activeStakesList.innerHTML = '<div class="empty-stakes">No stakes available</div>';
        }
    }
}

function updateStakingStats() {
    if (elements.totalStaked) {
        elements.totalStaked.textContent = `${walletData.staking.totalStaked} USDT`;
    }
}

function updateActiveStakes() {
    if (!elements.activeStakesList) return;
    
    const activeStakes = walletData.staking.activeStakes || [];
    
    if (!activeStakes.length) {
        elements.activeStakesList.innerHTML = `
            <div class="empty-stakes">
                <i class="fas fa-inbox"></i>
                <p>No active stakes yet</p>
                <small>Start staking to earn rewards</small>
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
        
        let dailyReward = 0;
        let totalReward = 0;
        
        if (plan.name === "Silver") {
            dailyReward = (stake.amount / 10) * plan.dailyPer10;
            totalReward = (stake.amount / 10) * plan.totalPer10;
        } else if (plan.name === "Gold") {
            dailyReward = (stake.amount / 50) * plan.dailyPer50;
            totalReward = (stake.amount / 50) * plan.totalPer50;
        } else if (plan.name === "Diamond") {
            dailyReward = (stake.amount / 100) * plan.dailyPer100;
            totalReward = (stake.amount / 100) * plan.totalPer100;
        }
        
        html += `
            <div class="stake-item">
                <div class="stake-header">
                    <div class="stake-info">
                        <h5>${plan.name} - ${stake.amount} USDT</h5>
                        <span class="stake-duration">${plan.duration} Days</span>
                    </div>
                    <span class="status-badge active">Active</span>
                </div>
                
                <div class="stake-progress">
                    <div class="progress-info">
                        <span>${Math.round(progress)}%</span>
                        <span>${daysLeft} days left</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
                
                <div class="stake-details">
                    <div class="detail">
                        <i class="fas fa-percentage"></i>
                        <span>${plan.apr}% APR</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-gift"></i>
                        <span>${dailyReward.toLocaleString()} AMSK/Day</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-coins"></i>
                        <span>Total: ${totalReward.toLocaleString()} AMSK</span>
                    </div>
                </div>
                
                <div class="stake-actions">
                    <button class="btn-secondary" onclick="cancelStake(${index})" ${progress < 50 ? '' : 'disabled'}>
                        Cancel (50% penalty)
                    </button>
                    <button class="btn-primary" onclick="claimStakeReward(${index})" ${progress >= 100 ? '' : 'disabled'}>
                        Claim
                    </button>
                </div>
            </div>
        `;
    });
    
    elements.activeStakesList.innerHTML = html;
}

async function claimStakeReward(stakeIndex) {
    try {
        const activeStakes = walletData.staking.activeStakes || [];
        const stake = activeStakes[stakeIndex];
        if (!stake) {
            throw new Error("Stake not found");
        }
        
        const plan = CONFIG.STAKING.PLANS[stake.planId];
        if (!plan) {
            throw new Error("Plan not found");
        }
        
        const now = Date.now();
        const endTime = stake.startTime + (plan.duration * 24 * 60 * 60 * 1000);
        
        if (now < endTime) {
            showMessage("Stake period not completed yet", "warning");
            return;
        }
        
        let totalReward = 0;
        
        if (plan.name === "Silver") {
            totalReward = (stake.amount / 10) * plan.totalPer10;
        } else if (plan.name === "Gold") {
            totalReward = (stake.amount / 50) * plan.totalPer50;
        } else if (plan.name === "Diamond") {
            totalReward = (stake.amount / 100) * plan.totalPer100;
        }
        
        walletData.balances.AMSK += totalReward;
        walletData.balances.USDT += stake.amount;
        
        walletData.staking.totalEarned = (walletData.staking.totalEarned || 0) + totalReward;
        walletData.staking.totalStaked -= stake.amount;
        
        addTransactionToHistory('staking_reward', totalReward, 'AMSK', `${plan.name} Plan reward`, 'completed', 'Staking reward claimed');
        addTransactionToHistory('staking_return', stake.amount, 'USDT', 'Principal returned', 'completed', 'Staking principal returned');
        
        activeStakes.splice(stakeIndex, 1);
        
        updateWalletUI();
        updateStakingDisplay();
        
        showMessage(`💰 Claimed ${totalReward.toLocaleString()} AMSK from ${plan.name} Plan staking!`, "success");
        await saveUserData();
        
    } catch (error) {
        console.error("❌ Error claiming stake reward:", error);
        showMessage("Failed to claim stake reward", "error");
    }
}

async function cancelStake(stakeIndex) {
    const activeStakes = walletData.staking.activeStakes || [];
    const stake = activeStakes[stakeIndex];
    
    if (!stake) return;
    
    const plan = CONFIG.STAKING.PLANS[stake.planId];
    if (!plan) return;
    
    const now = Date.now();
    const startTime = stake.startTime || now;
    const durationMs = plan.duration * 24 * 60 * 60 * 1000;
    const progress = ((now - startTime) / durationMs) * 100;
    
    if (progress >= 50) {
        showMessage("Cannot cancel stake after 50% completion", "warning");
        return;
    }
    
    const returnedAmount = stake.amount * 0.5;
    walletData.balances.USDT += returnedAmount;
    walletData.staking.totalStaked -= stake.amount;
    
    addTransactionToHistory('staking_cancel', returnedAmount, 'USDT', 'Staking cancelled (50% penalty)', 'completed', 'Staking cancelled with penalty');
    
    activeStakes.splice(stakeIndex, 1);
    
    updateWalletUI();
    updateStakingDisplay();
    
    showMessage(`⚠️ Stake canceled. ${returnedAmount.toFixed(2)} USDT returned (50% penalty)`, "warning", 4500);
    await saveUserData();
}

function checkStakingVipReward(planId, planName) {
    if (!walletData.vipTasks) {
        walletData.vipTasks = {
            claimedMiningRewards: [],
            claimedStakingRewards: []
        };
    }
    
    let planKey = '';
    if (planName.toLowerCase().includes('silver')) planKey = 'silver';
    else if (planName.toLowerCase().includes('gold')) planKey = 'gold';
    else if (planName.toLowerCase().includes('diamond')) planKey = 'diamond';
    else return;
    
    const vipTask = CONFIG.VIP_TASKS.STAKING[planKey];
    if (!vipTask) return;
    
    if (!walletData.vipTasks.claimedStakingRewards.includes(planKey)) {
        showMessage(`🏆 VIP Task available: Claim ${vipTask.reward.toLocaleString()} AMSK for your first ${planName} Staking!`, "success", 5000);
    }
    
    updateVipTasksDisplay();
}

// ====== 22. WALLET FUNCTIONS ======
function updateWalletUI() {
    if (!walletData || !walletData.balances) {
        console.log("⚠️ Wallet data not ready yet");
        return;
    }
    
    const AMSK = walletData.balances.AMSK ?? 0;
    const USDT = walletData.balances.USDT ?? 0;
    const BNB = walletData.balances.BNB ?? 0;
    const TON = walletData.balances.TON ?? 0;
    
    const amskPrice = CONFIG.PRICES.AMSK;
    const usdtPrice = CONFIG.PRICES.USDT;
    const bnbPrice = livePrices.BNB || CONFIG.PRICES.BNB;
    const tonPrice = livePrices.TON || CONFIG.PRICES.TON;
    
    const totalUSD = (AMSK * amskPrice) + (USDT * usdtPrice) + (BNB * bnbPrice) + (TON * tonPrice);
    
    if (elements.walletBalanceUsd) {
        elements.walletBalanceUsd.textContent = `$${totalUSD.toFixed(2)}`;
    }
    
    if (elements.walletBalanceAmsk) {
        elements.walletBalanceAmsk.textContent = `${formatNumber(AMSK)} AMSK`;
    }
    
    if (elements.totalBalanceUsd) {
        elements.totalBalanceUsd.textContent = totalUSD.toFixed(2);
    }
    
    if (elements.totalBalanceAmsk) {
        elements.totalBalanceAmsk.textContent = formatNumber(AMSK);
    }
    
    if (elements.walletAmskBalance) {
        elements.walletAmskBalance.textContent = `${formatNumber(AMSK)} AMSK`;
    }
    if (elements.walletAmskValue) {
        elements.walletAmskValue.textContent = `$${(AMSK * amskPrice).toFixed(2)}`;
    }
    
    if (elements.walletUsdtBalance) {
        elements.walletUsdtBalance.textContent = `${USDT.toFixed(2)} USDT`;
    }
    if (elements.walletUsdtValue) {
        elements.walletUsdtValue.textContent = `$${USDT.toFixed(2)}`;
    }
    
    if (elements.walletBnbBalance) {
        elements.walletBnbBalance.textContent = `${BNB.toFixed(4)} BNB`;
    }
    if (elements.walletBnbValue) {
        const bnbValue = BNB * bnbPrice;
        elements.walletBnbValue.textContent = `$${bnbValue.toFixed(2)}`;
        
        if (livePrices.BNB_24h_change) {
            const change = livePrices.BNB_24h_change;
            const changeSymbol = change >= 0 ? '▲' : '▼';
            elements.walletBnbValue.innerHTML += ` <span style="color: ${change >= 0 ? '#00ff88' : '#ff4444'}; font-size: 10px;">${changeSymbol} ${Math.abs(change).toFixed(1)}%</span>`;
        }
    }
    
    if (elements.walletTonBalance) {
        elements.walletTonBalance.textContent = `${formatNumber(TON)} TON`;
    }
    if (elements.walletTonValue) {
        const tonValue = TON * tonPrice;
        elements.walletTonValue.textContent = `$${tonValue.toFixed(2)}`;
        
        if (livePrices.TON_24h_change) {
            const change = livePrices.TON_24h_change;
            const changeSymbol = change >= 0 ? '▲' : '▼';
            elements.walletTonValue.innerHTML += ` <span style="color: ${change >= 0 ? '#00ff88' : '#ff4444'}; font-size: 10px;">${changeSymbol} ${Math.abs(change).toFixed(1)}%</span>`;
        }
    }
}

// ====== 23. REFERRAL FUNCTIONS ======
async function checkForReferral() {
    console.log("🔍 Checking for referral...");
    
    if (userData.referredBy || userData.referralBonusClaimed) {
        console.log("✅ User already referred or bonus claimed");
        return;
    }
    
    let referralCode = null;
    
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) {
        referralCode = tg.initDataUnsafe.start_param;
        console.log("📱 Telegram referral detected:", referralCode);
    }
    
    if (!referralCode) {
        const urlParams = new URLSearchParams(window.location.search);
        referralCode = urlParams.get('startapp') || urlParams.get('ref') || urlParams.get('start');
    }
    
    if (!referralCode) {
        console.log("ℹ️ No referral code detected");
        return;
    }
    
    if (referralCode === userData.referralCode) {
        console.log("⚠️ Cannot refer yourself");
        return;
    }
    
    await processReferral(referralCode);
}

async function processReferral(referralCode) {
    console.log("🎯 Processing referral with code:", referralCode);
    
    try {
        let referrerId = null;
        
        if (db) {
            const usersRef = db.collection(DB_COLLECTIONS.USERS);
            const querySnapshot = await usersRef.where('userInfo.referralCode', '==', referralCode).get();
            
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                referrerId = doc.id;
            }
        } else {
            console.log("⚠️ Firebase not available, referral may not be saved permanently");
        }
        
        if (!referrerId || referrerId === userData.id) {
            console.log("❌ Referrer not found or self-referral");
            return;
        }
        
        if (userData.referredBy) {
            console.log("❌ User already referred by:", userData.referredBy);
            return;
        }
        
        if (userData.processedReferrals && userData.processedReferrals.includes(referrerId)) {
            console.log("❌ This referral has already been processed for this user");
            return;
        }
        
        userData.referredBy = referrerId;
        userData.referralBonusClaimed = true;
        
        if (!userData.processedReferrals) {
            userData.processedReferrals = [];
        }
        userData.processedReferrals.push(referrerId);
        
        if (referrerId !== userData.id) {
            if (db) {
                const referrerRef = db.collection(DB_COLLECTIONS.USERS).doc(referrerId);
                
                const referrerDoc = await referrerRef.get();
                if (referrerDoc.exists) {
                    const referrerWallet = referrerDoc.data();
                    
                    const newCount = (referrerWallet.referrals?.count || 0) + 1;
                    const newReferrals = referrerWallet.referrals?.referrals || [];
                    newReferrals.push({
                        userId: userData.id,
                        username: userData.username,
                        joinedAt: Date.now()
                    });
                    
                    const newBalance = (referrerWallet.balances?.AMSK || 0) + CONFIG.REFERRAL.BONUS.REFERRER;
                    
                    await referrerRef.update({
                        'balances.AMSK': newBalance,
                        'referrals.count': newCount,
                        'referrals.referrals': newReferrals,
                        'referrals.earned.amsk': (referrerWallet.referrals?.earned?.amsk || 0) + CONFIG.REFERRAL.BONUS.REFERRER
                    });
                    
                    console.log(`✅ Referrer ${referrerId} updated with +10000 AMSK`);
                }
            }
            
            walletData.balances.AMSK += CONFIG.REFERRAL.BONUS.REFERRED;
            
            addTransactionToHistory('referral_bonus', CONFIG.REFERRAL.BONUS.REFERRED, 'AMSK', 'Welcome bonus from referral', 'completed', 'Welcome bonus for joining via referral');
            
            showMessage(`🎉 Welcome! You received ${CONFIG.REFERRAL.BONUS.REFERRED.toLocaleString()} AMSK bonus!`, "success");
            
            await saveUserData();
        }
        
    } catch (error) {
        console.error("❌ Error processing referral:", error);
    }
}

function updateReferralDisplay() {
    if (!walletData.referrals) {
        walletData.referrals = {
            count: 0,
            earned: { amsk: 0, bnb: 0 },
            referrals: [],
            claimedMilestones: []
        };
        return;
    }
    
    const referrals = walletData.referrals;
    
    if (elements.refCount) {
        elements.refCount.textContent = referrals.count || 0;
    }
    
    if (elements.refEarned) {
        const earnedAmsk = referrals.earned?.amsk || 0;
        elements.refEarned.textContent = formatNumber(earnedAmsk);
    }
    
    updateMilestonesDisplay();
}

function updateMilestonesDisplay() {
    if (!elements.milestonesList) return;
    
    const referralCount = walletData.referrals?.count || 0;
    const claimedMilestones = walletData.referrals?.claimedMilestones || [];
    
    const milestones = elements.milestonesList.querySelectorAll('.milestone-item');
    milestones.forEach(item => {
        const milestoneNum = parseInt(item.dataset.milestone);
        const progressElement = item.querySelector('.milestone-progress');
        const actionElement = item.querySelector('.milestone-action');
        
        if (!milestoneNum) return;
        
        item.classList.remove('locked', 'can-claim', 'claimed');
        
        if (progressElement) {
            progressElement.textContent = `${referralCount}/${milestoneNum}`;
        }
        
        if (claimedMilestones.includes(milestoneNum)) {
            item.classList.add('claimed');
            if (actionElement) {
                actionElement.innerHTML = '<span class="claimed-badge">Claimed</span>';
            }
        } else if (referralCount >= milestoneNum) {
            item.classList.add('can-claim');
            if (actionElement) {
                actionElement.innerHTML = `<button class="btn-claim-milestone" onclick="claimMilestone(${milestoneNum})">Claim</button>`;
            }
        } else {
            item.classList.add('locked');
            if (actionElement) {
                actionElement.innerHTML = `<span class="locked-badge">${referralCount}/${milestoneNum}</span>`;
            }
        }
    });
}

async function claimMilestone(milestoneNum) {
    try {
        const milestoneReward = CONFIG.REFERRAL.MILESTONES[milestoneNum];
        if (!milestoneReward) {
            throw new Error("Invalid milestone");
        }
        
        if (!walletData.referrals) {
            walletData.referrals = {
                count: 0,
                earned: { amsk: 0, bnb: 0 },
                referrals: [],
                claimedMilestones: []
            };
        }
        
        if (walletData.referrals.claimedMilestones.includes(milestoneNum)) {
            showMessage("Milestone already claimed", "warning");
            return;
        }
        
        if (walletData.referrals.count < milestoneNum) {
            showMessage(`Need ${milestoneNum} referrals to claim this milestone`, "error");
            return;
        }
        
        if (milestoneReward.amsk > 0) {
            walletData.balances.AMSK += milestoneReward.amsk;
            if (!walletData.referrals.earned) walletData.referrals.earned = { amsk: 0, bnb: 0 };
            walletData.referrals.earned.amsk += milestoneReward.amsk;
            addTransactionToHistory('referral_milestone', milestoneReward.amsk, 'AMSK', `Milestone ${milestoneNum} referrals`, 'completed', 'Referral milestone reward claimed');
        }
        
        if (milestoneReward.bnb > 0) {
            walletData.balances.BNB += milestoneReward.bnb;
            if (!walletData.referrals.earned) walletData.referrals.earned = { amsk: 0, bnb: 0 };
            walletData.referrals.earned.bnb += milestoneReward.bnb;
            addTransactionToHistory('referral_milestone', milestoneReward.bnb, 'BNB', `Milestone ${milestoneNum} referrals`, 'completed', 'Referral milestone reward claimed');
        }
        
        walletData.referrals.claimedMilestones.push(milestoneNum);
        
        updateWalletUI();
        updateReferralDisplay();
        await saveUserData();
        
        let rewardText = `+${formatNumber(milestoneReward.amsk)} AMSK`;
        if (milestoneReward.bnb > 0) {
            rewardText += ` + ${milestoneReward.bnb} BNB`;
        }
        showMessage(`🏆 Milestone claimed! ${rewardText}`, "success");
        
    } catch (error) {
        console.error("❌ Error claiming milestone:", error);
        showMessage("Failed to claim milestone", "error");
    }
}

// ====== 24. TASKS FUNCTIONS ======
function updateTasksDisplay() {
    if (!elements.tasksGrid || !elements.tasksProgress) return;
    
    if (!walletData.tasks) {
        walletData.tasks = { completed: [] };
    }
    
    const completed = walletData.tasks?.completed || [];
    const totalTasks = Object.keys(CONFIG.TASKS).length;
    const completedCount = completed.length;
    
    elements.tasksProgress.textContent = `${completedCount}/${totalTasks} Completed`;

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
                    ${isCompleted ? 'Done ✓' : 'Start'}
                </button>
            </div>
        `;
    }
    elements.tasksGrid.innerHTML = html;
    
    updateVipTasksDisplay();
}

window.handleTaskClick = async function(taskId) {
    const task = CONFIG.TASKS[taskId];
    if (!task) return;
    
    if (!walletData.tasks) {
        walletData.tasks = { completed: [] };
    }
    
    const completed = walletData.tasks?.completed || [];
    if (completed.includes(taskId)) {
        showMessage("⏳ Task already completed", "info", 3000);
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
    if (!walletData.tasks) walletData.tasks = { completed: [] };
    if (walletData.tasks.completed.includes(taskId)) return;
    
    walletData.tasks.completed.push(taskId);
    walletData.balances.AMSK += CONFIG.TASKS[taskId].reward;
    
    addTransactionToHistory('task_reward', CONFIG.TASKS[taskId].reward, 'AMSK', `Task: ${CONFIG.TASKS[taskId].name}`, 'completed', 'Task completed');
    
    updateTasksDisplay();
    updateWalletUI();
    await saveUserData();
    
    showMessage(`✅ +${CONFIG.TASKS[taskId].reward.toLocaleString()} AMSK earned from ${CONFIG.TASKS[taskId].name}!`, "success");
}

function updateVipTasksDisplay() {
    if (!elements.vipTasksGrid) return;
    
    if (!walletData.vipTasks) {
        walletData.vipTasks = {
            claimedMiningRewards: [],
            claimedStakingRewards: []
        };
    }
    
    const miningTasks = CONFIG.VIP_TASKS.MINING;
    const stakingTasks = CONFIG.VIP_TASKS.STAKING;
    const currentLevel = walletData.mining.level;
    
    let html = '';
    
    html += `
        <div class="vip-task-category">
            <h5><i class="fas fa-rocket"></i> Mining Level Rewards</h5>
    `;
    
    for (let level = 2; level <= 5; level++) {
        const task = miningTasks[level];
        if (!task) continue;
        
        const isClaimed = walletData.vipTasks?.claimedMiningRewards?.includes(level) || false;
        const isAvailable = currentLevel >= level && !isClaimed;
        const isLocked = currentLevel < level;
        
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
                <div class="vip-task-icon">
                    <i class="${task.icon}"></i>
                </div>
                <div class="vip-task-details">
                    <div class="vip-task-name">${task.name}</div>
                    <div class="vip-task-reward">+${task.reward.toLocaleString()} AMSK</div>
                </div>
                <div class="vip-task-status">
                    ${statusButton}
                </div>
            </div>
        `;
    }
    
    html += `</div>`;
    
    html += `
        <div class="vip-task-category">
            <h5><i class="fas fa-gem"></i> First Staking Rewards</h5>
    `;
    
    for (let [planKey, task] of Object.entries(stakingTasks)) {
        const isClaimed = walletData.vipTasks?.claimedStakingRewards?.includes(planKey) || false;
        
        const hasActiveStake = walletData.staking.activeStakes.some(stake => {
            const plan = CONFIG.STAKING.PLANS[stake.planId];
            if (!plan) return false;
            const stakePlanKey = plan.name.toLowerCase();
            return stakePlanKey === planKey;
        });
        
        let statusButton = '';
        
        if (isClaimed) {
            statusButton = `<button class="vip-task-btn claimed" disabled>✓ Claimed</button>`;
        } else if (hasActiveStake) {
            statusButton = `<button class="vip-task-btn claim" onclick="claimVipTask('staking', '${planKey}', ${task.reward}, '${task.name}')">Claim</button>`;
        } else {
            statusButton = `<button class="vip-task-btn locked" disabled>🔒 Need Active Stake</button>`;
        }
        
        html += `
            <div class="vip-task-item ${isClaimed ? 'completed' : ''}">
                <div class="vip-task-icon">
                    <i class="${task.icon}"></i>
                </div>
                <div class="vip-task-details">
                    <div class="vip-task-name">${task.name}</div>
                    <div class="vip-task-reward">+${task.reward.toLocaleString()} AMSK</div>
                </div>
                <div class="vip-task-status">
                    ${statusButton}
                </div>
            </div>
        `;
    }
    
    html += `</div>`;
    
    elements.vipTasksGrid.innerHTML = html;
}

function claimVipTask(type, id, reward, taskName) {
    try {
        if (!walletData.vipTasks) {
            walletData.vipTasks = {
                claimedMiningRewards: [],
                claimedStakingRewards: []
            };
        }
        
        if (type === 'mining') {
            if (walletData.vipTasks.claimedMiningRewards.includes(id)) {
                showMessage("Task already claimed!", "warning");
                return false;
            }
            
            walletData.balances.AMSK += reward;
            walletData.vipTasks.claimedMiningRewards.push(id);
            
            addTransactionToHistory('vip_task_reward', reward, 'AMSK', `VIP Mining Task: ${taskName}`, 'completed', 'VIP task reward claimed');
            
        } else if (type === 'staking') {
            if (walletData.vipTasks.claimedStakingRewards.includes(id)) {
                showMessage("Task already claimed!", "warning");
                return false;
            }
            
            const hasActiveStake = walletData.staking.activeStakes.some(stake => {
                const plan = CONFIG.STAKING.PLANS[stake.planId];
                if (!plan) return false;
                const stakePlanKey = plan.name.toLowerCase();
                return stakePlanKey === id;
            });
            
            if (!hasActiveStake) {
                showMessage("You need an active stake in this plan to claim the reward!", "warning", 4500);
                return false;
            }
            
            walletData.balances.AMSK += reward;
            walletData.vipTasks.claimedStakingRewards.push(id);
            
            addTransactionToHistory('vip_task_reward', reward, 'AMSK', `VIP Staking Task: ${taskName}`, 'completed', 'VIP task reward claimed');
        }
        
        updateVipTasksDisplay();
        updateWalletUI();
        saveUserData();
        
        showMessage(`✅ Claimed ${reward.toLocaleString()} AMSK from ${taskName}!`, "success");
        return true;
        
    } catch (error) {
        console.error("❌ Error claiming VIP task:", error);
        showMessage("Failed to claim VIP task", "error");
        return false;
    }
}

function checkMiningVipReward(newLevel) {
    if (!walletData.vipTasks) {
        walletData.vipTasks = {
            claimedMiningRewards: [],
            claimedStakingRewards: []
        };
    }
    
    for (let level = 2; level <= newLevel; level++) {
        const vipTask = CONFIG.VIP_TASKS.MINING[level];
        if (!vipTask) continue;
        
        if (!walletData.vipTasks.claimedMiningRewards.includes(level)) {
            showMessage(`🏆 VIP Task available: Claim ${vipTask.reward.toLocaleString()} AMSK for reaching Level ${level}!`, "success", 5000);
        }
    }
    
    updateVipTasksDisplay();
}

// ====== 25. SWAP FUNCTIONS (مع أسعار حية لـ BNB/TON) ======
function openSwapModal() {
    const modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-exchange-alt"></i> Swap Tokens</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-20">
                        <h4 style="color: var(--quantum-text); margin-bottom: 10px;">Swap Tokens</h4>
                        <p style="color: var(--quantum-text-light);">Convert between different tokens</p>
                    </div>
                    
                    <div class="swap-direction">
                        <div class="swap-from">
                            <select id="swapFrom" class="swap-currency-select" onchange="updateSwapRates()">
                                <option value="USDT">USDT</option>
                                <option value="BNB">BNB</option>
                                <option value="TON">TON</option>
                                <option value="AMSK">AMSK</option>
                            </select>
                            <input type="number" 
                                   id="swapFromAmount" 
                                   class="swap-amount-input"
                                   placeholder="0.00"
                                   min="0.01"
                                   step="0.01"
                                   oninput="updateSwapCalculation('from')">
                            <div style="font-size: 12px; color: var(--quantum-text-light); margin-top: 5px;">
                                Balance: <span id="swapFromBalance">0.00</span>
                            </div>
                        </div>
                        
                        <div class="swap-arrow" onclick="swapCurrencies()">
                            <i class="fas fa-exchange-alt"></i>
                        </div>
                        
                        <div class="swap-to">
                            <select id="swapTo" class="swap-currency-select" onchange="updateSwapRates()">
                                <option value="AMSK">AMSK</option>
                                <option value="USDT">USDT</option>
                            </select>
                            <input type="number" 
                                   id="swapToAmount" 
                                   class="swap-amount-input"
                                   placeholder="0.00"
                                   readonly>
                            <div style="font-size: 12px; color: var(--quantum-text-light); margin-top: 5px;">
                                Balance: <span id="swapToBalance">0.00</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="swap-quick-actions">
                        <button class="swap-quick-btn" onclick="setSwapPercentage(25)">25%</button>
                        <button class="swap-quick-btn" onclick="setSwapPercentage(50)">50%</button>
                        <button class="swap-quick-btn" onclick="setSwapPercentage(75)">75%</button>
                        <button class="swap-quick-btn" onclick="setSwapPercentage(100)">MAX</button>
                    </div>
                    
                    <div class="swap-rate text-center mt-20">
                        <p id="swapRateText" style="color: var(--quantum-text-light);">1 USDT = 5,000 AMSK</p>
                    </div>
                    
                    <div id="swapRules" style="background: rgba(255,193,7,0.1); border: 1px solid rgba(255,193,7,0.2); border-radius: 8px; padding: 10px; margin: 20px 0;">
                        <p style="color: #ffc107; font-size: 11px; text-align: center; margin: 0;">
                            <i class="fas fa-info-circle"></i> 
                            <span id="swapRulesText">USDT, BNB, TON → AMSK | AMSK → USDT only</span>
                        </p>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="closeModal()">
                            Cancel
                        </button>
                        <button class="btn-primary" id="confirmSwapBtn" onclick="confirmSwap()" disabled>
                            Confirm Swap
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    setTimeout(() => {
        updateSwapRates();
    }, 100);
}

// دالة تحديث أسعار السواب (معدلة بأسعار حية)
function updateSwapRates() {
    const fromCurrency = document.getElementById('swapFrom')?.value || 'USDT';
    const toCurrency = document.getElementById('swapTo')?.value || 'AMSK';
    
    if (document.getElementById('swapFromBalance')) {
        document.getElementById('swapFromBalance').textContent = getBalanceText(fromCurrency);
    }
    
    if (document.getElementById('swapToBalance')) {
        document.getElementById('swapToBalance').textContent = getBalanceText(toCurrency);
    }
    
    const rateText = document.getElementById('swapRateText');
    const rulesText = document.getElementById('swapRulesText');
    
    if (rateText) {
        if (fromCurrency === 'USDT' && toCurrency === 'AMSK') {
            rateText.textContent = `1 USDT = ${CONFIG.SWAP.RATES.USDT_TO_AMSK.toLocaleString()} AMSK`;
            rulesText.textContent = "USDT → AMSK allowed";
        } else if (fromCurrency === 'BNB' && toCurrency === 'AMSK') {
            // استخدام السعر الحي لـ BNB
            const bnbPrice = livePrices.BNB || CONFIG.PRICES.BNB;
            // تقدير سعر BNB إلى AMSK (بناءً على سعر USDT)
            const rate = (bnbPrice / CONFIG.PRICES.USDT) * CONFIG.SWAP.RATES.USDT_TO_AMSK;
            rateText.textContent = `1 BNB = ${rate.toLocaleString()} AMSK ($${bnbPrice.toFixed(2)})`;
            rulesText.textContent = "BNB → AMSK allowed (live price)";
        } else if (fromCurrency === 'TON' && toCurrency === 'AMSK') {
            // استخدام السعر الحي لـ TON
            const tonPrice = livePrices.TON || CONFIG.PRICES.TON;
            const rate = (tonPrice / CONFIG.PRICES.USDT) * CONFIG.SWAP.RATES.USDT_TO_AMSK;
            rateText.textContent = `1 TON = ${rate.toLocaleString()} AMSK ($${tonPrice.toFixed(2)})`;
            rulesText.textContent = "TON → AMSK allowed (live price)";
        } else if (fromCurrency === 'AMSK' && toCurrency === 'USDT') {
            rateText.textContent = `1 AMSK = $${CONFIG.SWAP.RATES.AMSK_TO_USDT}`;
            rulesText.textContent = "AMSK → USDT allowed";
        } else {
            rateText.textContent = "Swap not allowed";
            rulesText.textContent = "This swap pair is not allowed";
        }
    }
    
    const swapPair = `${fromCurrency}_to_${toCurrency}`;
    const isAllowed = CONFIG.SWAP.ALLOWED_PAIRS.includes(swapPair);
    
    const confirmBtn = document.getElementById('confirmSwapBtn');
    if (confirmBtn) {
        confirmBtn.disabled = !isAllowed;
    }
    
    if (document.getElementById('swapFromAmount')) {
        document.getElementById('swapFromAmount').value = '';
    }
    if (document.getElementById('swapToAmount')) {
        document.getElementById('swapToAmount').value = '';
    }
}

function updateSwapCalculation(source) {
    const fromCurrency = document.getElementById('swapFrom')?.value || 'USDT';
    const toCurrency = document.getElementById('swapTo')?.value || 'AMSK';
    const fromAmountInput = document.getElementById('swapFromAmount');
    const toAmountInput = document.getElementById('swapToAmount');
    const confirmBtn = document.getElementById('confirmSwapBtn');
    
    if (!fromAmountInput || !toAmountInput || !confirmBtn) return;
    
    let fromAmount = parseFloat(fromAmountInput.value) || 0;
    
    if (fromAmount <= 0) {
        toAmountInput.value = '';
        confirmBtn.disabled = true;
        return;
    }
    
    if (!walletData || !walletData.balances) return;
    const fromBalance = walletData.balances[fromCurrency] || 0;
    if (fromAmount > fromBalance) {
        showMessage(`⚠️ Insufficient ${fromCurrency} balance. Need ${(fromAmount - fromBalance).toFixed(2)}.`, "warning", 4500);
        fromAmountInput.value = fromBalance;
        fromAmount = fromBalance;
    }
    
    let toAmount = 0;
    
    if (fromCurrency === 'USDT' && toCurrency === 'AMSK') {
        toAmount = fromAmount * CONFIG.SWAP.RATES.USDT_TO_AMSK;
    } else if (fromCurrency === 'BNB' && toCurrency === 'AMSK') {
        const bnbPrice = livePrices.BNB || CONFIG.PRICES.BNB;
        toAmount = fromAmount * (bnbPrice / CONFIG.PRICES.USDT) * CONFIG.SWAP.RATES.USDT_TO_AMSK;
    } else if (fromCurrency === 'TON' && toCurrency === 'AMSK') {
        const tonPrice = livePrices.TON || CONFIG.PRICES.TON;
        toAmount = fromAmount * (tonPrice / CONFIG.PRICES.USDT) * CONFIG.SWAP.RATES.USDT_TO_AMSK;
    } else if (fromCurrency === 'AMSK' && toCurrency === 'USDT') {
        toAmount = fromAmount * CONFIG.SWAP.RATES.AMSK_TO_USDT;
    }
    
    toAmountInput.value = toAmount.toFixed(
        (fromCurrency === 'AMSK' && toCurrency === 'USDT') ? 2 : 
        (fromCurrency === 'USDT' || fromCurrency === 'TON') ? 0 : 
        (fromCurrency === 'BNB') ? 0 : 2
    );
    
    const swapPair = `${fromCurrency}_to_${toCurrency}`;
    const isAllowed = CONFIG.SWAP.ALLOWED_PAIRS.includes(swapPair);
    
    confirmBtn.disabled = !isAllowed || fromAmount <= 0 || toAmount <= 0;
}

function getBalanceText(currency) {
    if (!walletData || !walletData.balances) return '0.00';
    const balance = walletData.balances[currency] || 0;
    switch(currency) {
        case 'USDT': return `${balance.toFixed(2)} USDT`;
        case 'BNB': return `${balance.toFixed(4)} BNB`;
        case 'TON': return `${balance.toFixed(2)} TON`;
        case 'AMSK': return `${formatNumber(balance)} AMSK`;
        default: return '0.00';
    }
}

function swapCurrencies() {
    const fromSelect = document.getElementById('swapFrom');
    const toSelect = document.getElementById('swapTo');
    
    if (!fromSelect || !toSelect) return;
    
    const fromValue = fromSelect.value;
    const toValue = toSelect.value;
    
    const reversePair = `${toValue}_to_${fromValue}`;
    if (CONFIG.SWAP.ALLOWED_PAIRS.includes(reversePair)) {
        fromSelect.value = toValue;
        toSelect.value = fromValue;
        updateSwapRates();
    } else {
        showMessage("⚠️ This swap pair is not allowed. Only USDT/BNB/TON → AMSK and AMSK → USDT", "warning", 4500);
    }
}

function setSwapPercentage(percentage) {
    const fromCurrency = document.getElementById('swapFrom')?.value || 'USDT';
    const fromAmountInput = document.getElementById('swapFromAmount');
    
    if (!fromAmountInput) return;
    
    if (!walletData || !walletData.balances) return;
    const balance = walletData.balances[fromCurrency] || 0;
    const amount = (balance * percentage) / 100;
    
    fromAmountInput.value = amount.toFixed(fromCurrency === 'BNB' ? 4 : 2);
    updateSwapCalculation('from');
}

async function confirmSwap() {
    const fromCurrency = document.getElementById('swapFrom')?.value || 'USDT';
    const toCurrency = document.getElementById('swapTo')?.value || 'AMSK';
    const fromAmountInput = document.getElementById('swapFromAmount');
    const toAmountInput = document.getElementById('swapToAmount');
    
    if (!fromAmountInput || !toAmountInput) return;
    
    const fromAmount = parseFloat(fromAmountInput.value) || 0;
    const toAmount = parseFloat(toAmountInput.value) || 0;
    
    if (fromAmount <= 0 || toAmount <= 0) {
        showMessage("Invalid swap amount", "error");
        return;
    }
    
    const swapPair = `${fromCurrency}_to_${toCurrency}`;
    if (!CONFIG.SWAP.ALLOWED_PAIRS.includes(swapPair)) {
        showMessage("⚠️ This swap pair is not allowed. Only USDT/BNB/TON → AMSK and AMSK → USDT", "warning", 4500);
        return;
    }
    
    if (!walletData || !walletData.balances) return;
    if (fromAmount > (walletData.balances[fromCurrency] || 0)) {
        showMessage(`⚠️ Insufficient ${fromCurrency} balance. Need ${(fromAmount - (walletData.balances[fromCurrency] || 0)).toFixed(2)}.`, "warning", 4500);
        return;
    }
    
    walletData.balances[fromCurrency] -= fromAmount;
    walletData.balances[toCurrency] += toAmount;
    
    addTransactionToHistory('swap', -fromAmount, fromCurrency, `Swapped to ${toAmount.toLocaleString()} ${toCurrency}`, 'completed', 'Swap completed');
    addTransactionToHistory('swap', toAmount, toCurrency, `Swapped from ${fromAmount} ${fromCurrency}`, 'completed', 'Swap completed');
    
    updateWalletUI();
    closeModal();
    
    showMessage(`✅ Swapped ${fromAmount} ${fromCurrency} to ${toAmount.toLocaleString()} ${toCurrency}!`, "success");
    await saveUserData();
}

// ====== 26. DEPOSIT MODAL FUNCTIONS ======
async function openDepositModal() {
    const modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-download"></i> Deposit Funds</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-20">
                        <h4 style="color: var(--quantum-text); margin-bottom: 10px;">Select Currency</h4>
                        <p style="color: var(--quantum-text-light);">Choose which currency you want to deposit</p>
                    </div>
                    
                    <div class="deposit-options">
                        <div class="deposit-option active" data-currency="USDT">
                            <i class="fas fa-coins" style="color: var(--quantum-blue);"></i>
                            <span>USDT</span>
                        </div>
                        <div class="deposit-option" data-currency="BNB">
                            <i class="fab fa-btc" style="color: var(--quantum-gold);"></i>
                            <span>BNB</span>
                        </div>
                        <div class="deposit-option" data-currency="TON">
                            <i class="fas fa-bolt" style="color: var(--quantum-purple);"></i>
                            <span>TON</span>
                        </div>
                    </div>
                    
                    <div id="deposit-details" class="mt-20">
                        <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 15px;">
                            <div class="text-center mb-15">
                                <h5 style="color: var(--quantum-text); margin-bottom: 5px;">Deposit USDT</h5>
                                <p style="color: var(--quantum-text-light); font-size: 12px;">Send USDT to the address below</p>
                            </div>
                            
                            <div class="mb-15">
                                <label style="display: block; color: var(--quantum-text-light); font-size: 12px; margin-bottom: 5px;">Amount (USDT)</label>
                                <input type="number" 
                                       id="depositAmount" 
                                       class="amount-input"
                                       placeholder="Enter amount"
                                       min="5"
                                       step="0.01"
                                       style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.2); border-radius: 8px; color: white;">
                            </div>
                            
                            <div class="mb-15">
                                <label style="display: block; color: var(--quantum-text-light); font-size: 12px; margin-bottom: 5px;">Transaction ID (TX ID)</label>
                                <input type="text" 
                                       id="depositTxId" 
                                       class="tx-id-input"
                                       placeholder="Enter transaction hash (0x...)"
                                       style="width: 100%;">
                                <div id="txIdValidation" class="validation-message" style="display: none;"></div>
                            </div>
                            
                            <div class="mb-15">
                                <label style="display: block; color: var(--quantum-text-light); font-size: 12px; margin-bottom: 5px;">Wallet Address</label>
                                <div style="display: flex; gap: 10px;">
                                    <input type="text" 
                                           id="depositAddress" 
                                           value="${CONFIG.DEPOSIT.ADDRESSES.BNB_USDT}"
                                           readonly
                                           style="flex: 1; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.2); border-radius: 8px; color: var(--quantum-text); font-family: monospace; font-size: 12px;">
                                    <button onclick="copyToClipboard('${CONFIG.DEPOSIT.ADDRESSES.BNB_USDT}')" 
                                            style="padding: 0 15px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.2); border-radius: 8px; color: var(--quantum-blue);">
                                        <i class="far fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div style="background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.2); border-radius: 8px; padding: 10px; margin-top: 15px;">
                                <p style="color: var(--quantum-green); font-size: 11px; text-align: center; margin: 0;">
                                    <i class="fas fa-info-circle"></i> Minimum deposit: ${CONFIG.DEPOSIT.MIN_AMOUNTS.USDT} USDT. TX ID will be verified by admin.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions mt-20">
                        <button class="btn-secondary" onclick="closeModal()">
                            Cancel
                        </button>
                        <button class="btn-primary" id="submitDepositBtn" onclick="submitDepositRequest()">
                            Submit Deposit Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    setTimeout(() => {
        const options = document.querySelectorAll('.deposit-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                const currency = option.dataset.currency;
                updateDepositDetails(currency);
            });
        });
        
        const txIdInput = document.getElementById('depositTxId');
        if (txIdInput) {
            txIdInput.addEventListener('input', validateTxId);
        }
    }, 100);
}

function updateDepositDetails(currency) {
    const details = document.getElementById('deposit-details');
    if (!details) return;
    
    let address = '';
    let minDeposit = '';
    let color = '';
    let icon = '';
    
    switch(currency) {
        case 'USDT':
            address = CONFIG.DEPOSIT.ADDRESSES.BNB_USDT;
            minDeposit = `${CONFIG.DEPOSIT.MIN_AMOUNTS.USDT} USDT`;
            color = 'var(--quantum-blue)';
            icon = 'fas fa-coins';
            break;
        case 'BNB':
            address = CONFIG.DEPOSIT.ADDRESSES.BNB_USDT;
            minDeposit = `${CONFIG.DEPOSIT.MIN_AMOUNTS.BNB} BNB`;
            color = 'var(--quantum-gold)';
            icon = 'fab fa-btc';
            break;
        case 'TON':
            address = CONFIG.DEPOSIT.ADDRESSES.TON;
            minDeposit = `${CONFIG.DEPOSIT.MIN_AMOUNTS.TON} TON`;
            color = 'var(--quantum-purple)';
            icon = 'fas fa-bolt';
            break;
    }
    
    details.innerHTML = `
        <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 15px;">
            <div class="text-center mb-15">
                <h5 style="color: var(--quantum-text); margin-bottom: 5px;">Deposit ${currency}</h5>
                <p style="color: var(--quantum-text-light); font-size: 12px;">Send ${currency} to the address below</p>
            </div>
            
            <div class="mb-15">
                <label style="display: block; color: var(--quantum-text-light); font-size: 12px; margin-bottom: 5px;">Amount (${currency})</label>
                <input type="number" 
                       id="depositAmount" 
                       class="amount-input"
                       placeholder="Enter amount"
                       min="${currency === 'USDT' ? CONFIG.DEPOSIT.MIN_AMOUNTS.USDT : currency === 'BNB' ? CONFIG.DEPOSIT.MIN_AMOUNTS.BNB : CONFIG.DEPOSIT.MIN_AMOUNTS.TON}"
                       step="${currency === 'USDT' ? '0.01' : '0.0001'}"
                       style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid ${color}; border-radius: 8px; color: white;">
            </div>
            
            <div class="mb-15">
                <label style="display: block; color: var(--quantum-text-light); font-size: 12px; margin-bottom: 5px;">Transaction ID (TX ID)</label>
                <input type="text" 
                       id="depositTxId" 
                       class="tx-id-input"
                       placeholder="${currency === 'TON' ? 'Enter TON transaction hash' : 'Enter transaction hash (0x...)'}"
                       style="width: 100%;">
                <div id="txIdValidation" class="validation-message" style="display: none;"></div>
            </div>
            
            <div class="mb-15">
                <label style="display: block; color: var(--quantum-text-light); font-size: 12px; margin-bottom: 5px;">Wallet Address</label>
                <div style="display: flex; gap: 10px;">
                    <input type="text" 
                           id="depositAddress" 
                           value="${address}"
                           readonly
                           style="flex: 1; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid ${color}; border-radius: 8px; color: var(--quantum-text); font-family: monospace; font-size: 12px;">
                    <button onclick="copyToClipboard('${address}')" 
                            style="padding: 0 15px; background: ${color.replace(')', ', 0.1)').replace('var(', 'rgba(')}; border: 1px solid ${color}; border-radius: 8px; color: ${color};">
                        <i class="far fa-copy"></i>
                    </button>
                </div>
            </div>
            
            <div style="background: ${color.replace(')', ', 0.1)').replace('var(', 'rgba(')}; border: 1px solid ${color}; border-radius: 8px; padding: 10px; margin-top: 15px;">
                <p style="color: ${color}; font-size: 11px; text-align: center; margin: 0;">
                    <i class="${icon}"></i> Minimum deposit: ${minDeposit}. TX ID will be verified by admin.
                </p>
            </div>
        </div>
    `;
    
    const txIdInput = document.getElementById('depositTxId');
    if (txIdInput) {
        txIdInput.addEventListener('input', validateTxId);
    }
}

function validateTxId() {
    const txIdInput = document.getElementById('depositTxId');
    const validationDiv = document.getElementById('txIdValidation');
    const currency = document.querySelector('.deposit-option.active')?.dataset.currency || 'USDT';
    
    if (!txIdInput || !validationDiv) return;
    
    const txId = txIdInput.value.trim();
    
    if (!txId) {
        validationDiv.style.display = 'none';
        return;
    }
    
    if (walletData.usedTxIds && walletData.usedTxIds.includes(txId)) {
        validationDiv.innerHTML = `<i class="fas fa-times-circle"></i> ⚠️ This TX ID has already been used`;
        validationDiv.className = 'validation-message validation-error';
        validationDiv.style.display = 'block';
        return;
    }
    
    let isValid = false;
    let message = '';
    
    if (currency === 'USDT' || currency === 'BNB') {
        isValid = txId.startsWith('0x') && txId.length === 66;
        message = isValid ? 
            '<i class="fas fa-check-circle"></i> ✅ Valid BSC/ERC20 transaction hash' :
            '<i class="fas fa-times-circle"></i> ⚠️ Invalid TX ID format. Should start with 0x and be 66 characters.';
    } else if (currency === 'TON') {
        isValid = txId.length >= 40 && txId.length <= 70;
        message = isValid ? 
            '<i class="fas fa-check-circle"></i> ✅ Valid TON transaction hash' :
            '<i class="fas fa-times-circle"></i> ⚠️ Invalid TON transaction hash. Should be 40-70 characters.';
    }
    
    validationDiv.innerHTML = message;
    validationDiv.className = `validation-message ${isValid ? 'validation-success' : 'validation-error'}`;
    validationDiv.style.display = 'block';
}

// ====== 27. WITHDRAW MODAL FUNCTIONS ======
function openWithdrawModal() {
    if (!walletData || !walletData.balances) return;
    
    const pendingTotal = getPendingWithdrawalsTotal();
    
    if (walletData.balances.USDT < CONFIG.WITHDRAW.MIN_USDT) {
        const motivationalMessage = `⚠️ Minimum withdrawal is 100 USDT.
        
📊 Your Balance: ${walletData.balances.USDT.toFixed(2)} USDT
⏳ Pending Withdrawals: ${pendingTotal.toFixed(2)} USDT

📈 Your Path to 100 USDT:

⛏️ Mining: 
   • 1,000 AMSK/2.5h = 9,600 AMSK/day = 1.92 USDT/day

👥 Referrals: 
   • You get 10,000 AMSK per friend

💱 Swap Rate: 
   • 5,000 AMSK = 1 USDT

✨ Quick Math:
   • 1 referral = 10,000 AMSK = 2 USDT
   • 50 referrals = 100 USDT 🎯

🚀 Keep going!`;
        
        showMessage(motivationalMessage, "warning", 5000);
        return;
    }
    
    if (walletData.balances.BNB < CONFIG.WITHDRAW.FEE_BNB) {
        showMessage(`You need at least ${CONFIG.WITHDRAW.FEE_BNB} BNB for withdrawal fee`, "error");
        return;
    }
    
    const modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-upload"></i> Withdraw USDT</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-20">
                        <h4 style="color: var(--quantum-text); margin-bottom: 10px;">Professional Withdrawal</h4>
                        <p style="color: var(--quantum-text-light);">Funds are deducted immediately upon request and held securely until admin approval.</p>
                    </div>
                    
                    <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 15px;">
                        <div class="mb-15">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="color: var(--quantum-text-light);">Current Balance:</span>
                                <span style="color: var(--quantum-text); font-weight: 600;">${walletData.balances.USDT.toFixed(2)} USDT</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="color: var(--quantum-text-light);">Pending Withdrawals:</span>
                                <span style="color: #ff9900; font-weight: 600;">${pendingTotal.toFixed(2)} USDT</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="color: var(--quantum-text-light);">BNB for Fees:</span>
                                <span style="color: ${walletData.balances.BNB >= CONFIG.WITHDRAW.FEE_BNB ? 'var(--quantum-green)' : '#ff4444'}; font-weight: 600;">
                                    ${walletData.balances.BNB.toFixed(4)} BNB
                                </span>
                            </div>
                            <div style="background: rgba(255,193,7,0.1); border: 1px solid rgba(255,193,7,0.2); border-radius: 8px; padding: 10px; margin-top: 10px;">
                                <p style="color: #ffc107; font-size: 12px; margin: 0;">
                                    <i class="fas fa-info-circle"></i> 
                                    Amount will be deducted immediately upon request and held until approval.
                                </p>
                            </div>
                        </div>
                        
                        <div class="mb-15">
                            <label style="display: block; color: var(--quantum-text-light); font-size: 12px; margin-bottom: 5px;">Amount (USDT)</label>
                            <input type="number" 
                                   id="withdrawAmount" 
                                   placeholder="Enter amount"
                                   min="${CONFIG.WITHDRAW.MIN_USDT}"
                                   max="${walletData.balances.USDT}"
                                   step="0.01"
                                   value="${Math.min(CONFIG.WITHDRAW.MIN_USDT, walletData.balances.USDT)}"
                                   style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.2); border-radius: 8px; color: var(--quantum-text);">
                        </div>
                        
                        <div class="mb-15">
                            <label style="display: block; color: var(--quantum-text-light); font-size: 12px; margin-bottom: 5px;">Wallet Address</label>
                            <input type="text" 
                                   id="withdrawAddress" 
                                   placeholder="Enter your USDT wallet address (BEP20)"
                                   style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.2); border-radius: 8px; color: var(--quantum-text); font-family: monospace; font-size: 12px;">
                        </div>
                        
                        <div style="background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.2); border-radius: 8px; padding: 10px; margin-top: 15px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <span style="color: var(--quantum-green); font-size: 12px;">Network Fee:</span>
                                <span style="color: var(--quantum-green); font-size: 12px; font-weight: 600;">${CONFIG.WITHDRAW.FEE_BNB} BNB</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--quantum-green); font-size: 12px;">Processing:</span>
                                <span style="color: var(--quantum-green); font-size: 12px; font-weight: 600;">Manual review (1-24h)</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 5px; border-top: 1px solid rgba(0,255,136,0.2); padding-top: 5px;">
                                <span style="color: var(--quantum-green); font-size: 12px;">Funds Status:</span>
                                <span style="color: var(--quantum-green); font-size: 12px; font-weight: 600;">Deducted & Held</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions mt-20">
                        <button class="btn-secondary" onclick="closeModal()">
                            Cancel
                        </button>
                        <button class="btn-primary" id="submitWithdrawBtn" onclick="submitWithdrawRequest()">
                            Request Withdrawal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

function getPendingWithdrawalsTotal() {
    if (!walletData.pendingWithdrawals) return 0;
    
    return walletData.pendingWithdrawals
        .filter(w => w.status === 'pending')
        .reduce((total, w) => total + w.amount, 0);
}

// ====== 28. BACKGROUND SERVICES ======
function startBackgroundServices() {
    intervals.miningTimer = setInterval(() => {
        updateMiningTimer();
        checkAndNotifyRewards();
    }, 1000);
    
    intervals.localSaveTimer = setInterval(() => {
        if (userData.id && userData.isInitialized) {
            saveUserDataToLocalStorage();
            console.log("💾 Periodic local save completed");
        }
    }, 300000); // 5 دقائق
    
    console.log("⏱️ Background services started");
}

function checkAndNotifyRewards() {
    const now = Date.now();
    
    if (walletData.mining.active && walletData.mining.nextReward) {
        const timeLeft = walletData.mining.nextReward - now;
        
        if (timeLeft > 0 && timeLeft < 5000 && !window.rewardNotified) {
            showMessage("⚡ Mining reward ready! Click Claim now!", "success", 4000);
            window.rewardNotified = true;
            
            if (tg && tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('medium');
            }
        }
        
        if (timeLeft > 10000) {
            window.rewardNotified = false;
        }
    }
}

// ====== 29. BOOSTER FUNCTIONS ======
function boosterUpgrade() {
    const targetLevel = 5;
    const currentLevel = walletData.mining.level;
    
    if (currentLevel >= targetLevel) {
        showMessage("You are already at maximum level!", "info");
        return;
    }
    
    const levelData = CONFIG.MINING.LEVELS[targetLevel];
    const totalCost = levelData.cost;
    
    if (walletData.balances.USDT < totalCost) {
        showMessage(`⚠️ You need ${totalCost} USDT for Level 5 upgrade!`, "warning", 4500);
        return;
    }
    
    if (!confirm(`Upgrade directly to Level 5 (Mythic) for ${totalCost} USDT?`)) {
        return;
    }
    
    try {
        walletData.balances.USDT -= totalCost;
        walletData.mining.level = targetLevel;
        
        addTransactionToHistory('mining_upgrade', -totalCost, 'USDT', 'Booster upgrade to Level 5', 'completed', 'Mining level upgraded via Booster');
        
        checkMiningVipReward(targetLevel);
        
        updateMiningDisplay();
        updateWalletUI();
        saveUserData();
        
        showMessage(`🚀 BOOSTER ACTIVATED! Upgraded to Level 5 Mythic!`, "success");
        
    } catch (error) {
        console.error("❌ Error in booster upgrade:", error);
        showMessage("Failed to upgrade via Booster", "error");
    }
}

function scrollToTasks() {
    const tasksSection = document.getElementById('tasks-section');
    if (tasksSection) {
        tasksSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ====== 30. EVENT LISTENERS ======
function setupEventListeners() {
    console.log("🎯 Setting up event listeners...");
    
    elements.navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const page = btn.dataset.page;
            switchPage(page);
        });
    });
    
    if (elements.startMiningBtn) {
        elements.startMiningBtn.addEventListener('click', handleMiningAction);
    }
    
    elements.upgradeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.upgrade-card');
            if (card) {
                upgradeMiningLevel(card.dataset.level);
            }
        });
    });
    
    elements.stakeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const planId = parseInt(btn.dataset.plan);
            openStakeModal(planId);
        });
    });
    
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
        elements.historyBtn.addEventListener('click', showTransactionHistory);
    }
    
    if (elements.copyLinkBtn) {
        elements.copyLinkBtn.addEventListener('click', () => {
            if (elements.referralLinkInput) {
                copyToClipboard(elements.referralLinkInput.value);
            }
        });
    }
    
    if (elements.telegramShareBtn) {
        elements.telegramShareBtn.addEventListener('click', () => {
            if (elements.referralLinkInput) {
                const text = `🚀 Join Alien Musk Quantum Mining Platform!\n\n⛏️ Mine AMSK tokens every hour\n💰 Earn from staking and referrals\n👥 Get 10,000 AMSK bonus with my link\n\n👉 ${elements.referralLinkInput.value}\n\n💎 Start your quantum mining journey!`;
                const url = `https://t.me/share/url?url=${encodeURIComponent(elements.referralLinkInput.value)}&text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
            }
        });
    }
    
    if (elements.whatsappShareBtn) {
        elements.whatsappShareBtn.addEventListener('click', () => {
            if (elements.referralLinkInput) {
                const text = `🚀 Join Alien Musk Quantum Mining Platform!\n\nMine AMSK tokens every hour\nEarn from staking and referrals\nGet 10,000 AMSK bonus with my link\n\n${elements.referralLinkInput.value}`;
                const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
            }
        });
    }
    
    elements.tasksTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            elements.tasksTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabType = tab.dataset.tab;
            document.querySelectorAll('[data-tab-content]').forEach(content => {
                content.style.display = 'none';
            });
            
            if (tabType === 'basic') {
                document.getElementById('tasks-grid').style.display = 'grid';
            } else {
                document.getElementById('vip-tasks-grid').style.display = 'grid';
            }
        });
    });
    
    if (elements.scrollToTasksBtn) {
        elements.scrollToTasksBtn.addEventListener('click', scrollToTasks);
    }
    
    if (elements.boosterBtn) {
        elements.boosterBtn.addEventListener('click', boosterUpgrade);
    }
    
    initAdminSystem();
    
    console.log("✅ Event listeners setup complete");
}

function updateUI() {
    updateUserUI();
    updateMiningDisplay();
    updateWalletUI();
    updateStakingDisplay();
    updateReferralDisplay();
    updateTasksDisplay();
    updateUITexts();
    
    if (document.querySelector('.modal-overlay.active') && 
        document.querySelector('#historyContent')) {
        console.log("📜 History modal open - refreshing content");
        const activeTab = document.querySelector('#historyTabs .history-tab.active')?.dataset.tab || 'all';
        const activeFilter = document.querySelector('#historyFilters .history-filter-btn.active')?.dataset.filter || 'all';
        loadHistoryContent(activeTab, activeFilter);
    }
}

// ====== 31. INITIALIZATION ======
async function initAlienMuskApp() {
    const hideLoadingScreen = () => {
        try {
            const loadingScreen = document.getElementById('loading-screen');
            const appContainer = document.getElementById('app-container');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
            if (appContainer) {
                appContainer.classList.remove('hidden');
            }
        } catch (e) {
            console.error("Error hiding loading screen:", e);
        }
    };

    console.log("🚀 Alien Musk Quantum v7.3 - ULTIMATE ZERO WASTE EDITION");
    
    if (appInitialized) {
        console.log("⚠️ Already initialized, skipping...");
        return;
    }
    appInitialized = true;
    
    try {
        cacheElements();
        initLanguageSystem();
        await setupUser();
        
        await loadUserDataOptimized();
        
        setTimeout(() => {
            loadUserDataFromFirebase();
        }, 500);
        
        setupEventListeners();
        await checkForReferral();
        
        updateAssetsIcons();
        addMemesSection();
        await fetchLivePrices();
        
        updateUI();
        startBackgroundServices();
        
        initSupportIcon();
        
        userData.isInitialized = true;
        console.log("✅ Platform initialized successfully");
        console.log("✅ Zero Waste Features:");
        console.log("   - On-demand listeners (30 seconds only)");
        console.log("   - User data cached (5 minutes)");
        console.log("   - Prices cached (3 hours)");
        console.log("   - History checks when opened (cached 10 min)");
        console.log("   - Admin manual refresh only");
        console.log("   - No duplicate transactions");
        console.log("   - Live prices in swap (BNB/TON)");
        
        setTimeout(() => {
            showMessage("👽 Welcome to Alien Musk Quantum v7.3 - Zero Waste Edition!", "success");
        }, 800);
        
        hideLoadingScreen();
        
    } catch (error) {
        console.error("❌ Initialization failed:", error);
        hideLoadingScreen();
        showMessage("Failed to initialize platform", "error");
    }
}

// ====== 32. WINDOW LOAD ======
document.addEventListener('DOMContentLoaded', function() {
    console.log("📱 DOM Content Loaded - Starting initialization...");
    
    if (tg) {
        console.log("✅ Telegram WebApp ready");
    }
    
    let progress = 25;
    const progressInterval = setInterval(() => {
        progress += 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
        }
        
        const progressBar = document.getElementById('loading-progress-bar');
        const progressText = document.getElementById('loading-progress-text');
        
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${getTranslation('loading')} ${progress}%`;
    }, 300);
    
    setTimeout(() => {
        clearInterval(progressInterval);
        initAlienMuskApp();
    }, 2500);
});

// ====== 33. EXPORT GLOBAL FUNCTIONS ======
window.initAlienMuskApp = initAlienMuskApp;
window.switchPage = switchPage;
window.closeModal = closeModal;
window.showMessage = showMessage;
window.copyToClipboard = copyToClipboard;
window.handleMiningAction = handleMiningAction;
window.upgradeMiningLevel = upgradeMiningLevel;
window.openStakeModal = openStakeModal;
window.confirmStaking = confirmStaking;
window.claimStakeReward = claimStakeReward;
window.cancelStake = cancelStake;
window.calculateStakeReward = calculateStakeReward;
window.setMaxStakeAmount = setMaxStakeAmount;
window.updateStakeAmountFromSlider = updateStakeAmountFromSlider;
window.swapCurrencies = swapCurrencies;
window.setSwapPercentage = setSwapPercentage;
window.claimMilestone = claimMilestone;
window.handleTaskClick = handleTaskClick;
window.checkAdminPassword = checkAdminPassword;
window.claimVipTask = claimVipTask;
window.boosterUpgrade = boosterUpgrade;
window.scrollToTasks = scrollToTasks;
window.setLanguage = setLanguage;
window.getTranslation = getTranslation;
window.selectWelcomeLanguage = selectWelcomeLanguage;
window.closeLanguageWelcome = closeLanguageWelcome;
window.formatNumber = formatNumber;
window.refreshHistory = refreshHistory;
window.refreshAdminData = refreshAdminData;
window.switchAdminTab = switchAdminTab;
window.adminApproveDeposit = adminApproveDeposit;
window.adminRejectDeposit = adminRejectDeposit;
window.adminApproveWithdrawal = adminApproveWithdrawal;
window.adminRejectWithdrawal = adminRejectWithdrawal;
window.adminSearchUser = adminSearchUser;
window.adminAddToUser = adminAddToUser;
window.adminSubtractFromUser = adminSubtractFromUser;

console.log("👽 Alien Musk Quantum v7.3 - ULTIMATE ZERO WASTE EDITION loaded successfully!");
console.log("✅ All features preserved, only improvements added!");

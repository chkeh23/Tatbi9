// ===========================================
// ALIEN MUSK QUANTUM v7.1 - ULTIMATE ECONOMY EDITION (FIXED)
// ===========================================
// تمت الإضافة: نظام Zero Cost (مثل REFI)
// مع الحفاظ على كل دوال Alien Musk الأصلية (بدون حذف)
// تم إصلاح مشكلة STORAGE_KEYS
// ===========================================

// ===========================================
// تأكيد وضع التشغيل المستقل
// ===========================================
console.log("🔗 Loading Alien Musk Quantum Platform v7.1 - ULTIMATE ECONOMY EDITION");

if (window.appJsLoaded) {
    console.warn("⚠️ app.js detected but ignored - using standalone HTML mode");
}

window.tg = null;
window.firebaseApp = null;
window.db = null;
window.auth = null;
let appInitialized = false;

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCklv_zMfndK4-xUHECyD5XA7p_-20e1t8",
    authDomain: "tatbi9-681bf.firebaseapp.com",
    projectId: "tatbi9-681bf",
    storageBucket: "tatbi9-681bf.firebasestorage.app",
    messagingSenderId: "863237064748",
    appId: "1:863237064748:web:134de1e01d2639ef5fa989"
};

// ===========================================
// 🌐 نظام اللغات المتعددة - كامل كما كان
// ===========================================
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
            staking_description: "Stake your USDT to earn AMSK tokens. Higher stakes and longer durations yield better rewards.",
            staking_total: "Total Staked",
            staking_active: "Active Earnings",
            staking_plans: "Staking Plans",
            staking_plan_silver: "Silver Plan",
            staking_plan_gold: "Gold Plan",
            staking_plan_diamond: "Diamond Plan",
            staking_duration_7: "7 Days",
            staking_duration_15: "15 Days",
            staking_duration_30: "30 Days",
            staking_silver_reward: "Daily: 2,857 AMSK per $10",
            staking_gold_reward: "Daily: 8,333 AMSK per $50",
            staking_diamond_reward: "Daily: 10,000 AMSK per $100",
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
            referral_bonus_1: "Get <strong>10,000 AMSK ($2)</strong> per referral who starts mining",
            referral_bonus_2: "Earn <strong>16% commission</strong> on their deposits forever",
            referral_bonus_3: "Unlimited referrals, instant rewards!",
            referral_milestones: "Referral Milestones",
            referral_milestones_desc: "Earn bonus rewards for reaching referral milestones!",
            referral_milestone_10: "10 Referrals",
            referral_milestone_25: "25 Referrals",
            referral_milestone_50: "50 Referrals",
            referral_milestone_100: "100 Referrals",
            referral_milestone_250: "250 Referrals",
            share_telegram: "Telegram",
            share_whatsapp: "WhatsApp",
            language_welcome_title: "👽 Welcome to Alien Musk!",
            language_welcome_subtitle: "Please select your preferred language",
            language_continue: "Continue",
            cancel: "Cancel",
            confirm: "Confirm",
            close: "Close",
            save: "Save",
            edit: "Edit",
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
            staking_description: "قم بإيداع USDT لكسب رموز AMSK. الإيداعات الأكبر والمدة الأطول تمنح مكافآت أفضل.",
            staking_total: "إجمالي الإيداع",
            staking_active: "الأرباح النشطة",
            staking_plans: "خطط الإيداع",
            staking_plan_silver: "الفضة",
            staking_plan_gold: "الذهب",
            staking_plan_diamond: "الألماس",
            staking_duration_7: "7 أيام",
            staking_duration_15: "15 يوم",
            staking_duration_30: "30 يوم",
            staking_silver_reward: "يومياً: 2,857 AMSK لكل $10",
            staking_gold_reward: "يومياً: 8,333 AMSK لكل $50",
            staking_diamond_reward: "يومياً: 10,000 AMSK لكل $100",
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
            referral_bonus_1: "احصل على <strong>10,000 AMSK ($2)</strong> عن كل صديق يبدأ التعدين",
            referral_bonus_2: "اربح <strong>عمولة 16%</strong> من إيداعاتهم مدى الحياة",
            referral_bonus_3: "دعوات غير محدودة، مكافآت فورية!",
            referral_milestones: "مراحل الدعوات",
            referral_milestones_desc: "احصل على مكافآت إضافية عند الوصول لمراحل محددة!",
            referral_milestone_10: "10 دعوات",
            referral_milestone_25: "25 دعوة",
            referral_milestone_50: "50 دعوة",
            referral_milestone_100: "100 دعوة",
            referral_milestone_250: "250 دعوة",
            share_telegram: "تليجرام",
            share_whatsapp: "واتساب",
            language_welcome_title: "👽 مرحباً بك في أليون ماسك!",
            language_welcome_subtitle: "الرجاء اختيار لغتك المفضلة",
            language_continue: "متابعة",
            cancel: "إلغاء",
            confirm: "تأكيد",
            close: "إغلاق",
            save: "حفظ",
            edit: "تعديل",
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
    },
    hi: {
        code: 'hi',
        flag: '🇮🇳',
        name: 'Hindi',
        nativeName: 'हिन्दी',
        dir: 'ltr',
        translations: {
            app_name: "एलियन मस्क क्वांटम",
            app_name_short: "एलियन मस्क",
            loading: "लोड हो रहा है...",
            loading_subtitle: "क्वांटम सिस्टम शुरू हो रहे हैं...",
            nav_home: "होम",
            nav_staking: "स्टेकिंग",
            nav_wallet: "वॉलेट",
            nav_referral: "रेफरल",
            mining_title: "क्वांटम माइनिंग स्टेशन",
            mining_level: "स्तर",
            mining_hashrate: "हैशरेट",
            mining_next_reward: "अगला इनाम:",
            mining_start: "क्वांटम माइनिंग शुरू करें",
            mining_claim: "इनाम प्राप्त करें",
            mining_in_progress: "माइनिंग जारी...",
            mining_total: "कुल माइन किया गया:",
            mining_today: "आज:",
            mining_quick_tasks: "कार्य",
            mining_quick_booster: "बूस्टर 🚀",
            upgrade_title: "माइनिंग स्तर अपग्रेड करें",
            tasks_title: "कार्य और इनाम",
            tasks_completed: "पूर्ण",
            tasks_basic: "बेसिक",
            tasks_vip: "वीआईपी 🏆",
            tasks_start: "शुरू करें",
            tasks_done: "पूर्ण ✓",
            staking_title: "क्वांटम स्टेकिंग",
            staking_description: "AMSK टोकन कमाने के लिए अपना USDT स्टेक करें। अधिक स्टेक और लंबी अवधि बेहतर इनाम देती है।",
            staking_total: "कुल स्टेक",
            staking_active: "सक्रिय कमाई",
            staking_plans: "स्टेकिंग योजनाएं",
            staking_plan_silver: "सिल्वर प्लान",
            staking_plan_gold: "गोल्ड प्लान",
            staking_plan_diamond: "डायमंड प्लान",
            staking_duration_7: "7 दिन",
            staking_duration_15: "15 दिन",
            staking_duration_30: "30 दिन",
            staking_silver_reward: "दैनिक: 2,857 AMSK प्रति $10",
            staking_gold_reward: "दैनिक: 8,333 AMSK प्रति $50",
            staking_diamond_reward: "दैनिक: 10,000 AMSK प्रति $100",
            staking_stake_now: "अभी स्टेक करें",
            staking_active_stakes: "सक्रिय स्टेक",
            staking_no_active: "अभी तक कोई सक्रिय स्टेक नहीं",
            staking_start_hint: "इनाम कमाने के लिए स्टेकिंग शुरू करें",
            wallet_total_balance: "कुल बैलेंस",
            wallet_total_usd: "डॉलर में कुल मूल्य",
            wallet_quick_actions: "त्वरित कार्रवाई",
            wallet_deposit: "जमा करें",
            wallet_withdraw: "निकासी",
            wallet_swap: "स्वैप",
            wallet_history: "इतिहास",
            wallet_assets: "संपत्ति",
            referral_stats: "रेफरल आँकड़े",
            referral_count: "रेफरल",
            referral_earned: "AMSK कमाया",
            referral_your_link: "आपका रेफरल लिंक",
            referral_invite: "🚀 दोस्तों को आमंत्रित करें और बड़ा कमाएं!",
            referral_bonus_1: "<strong>10,000 AMSK ($2)</strong> प्रति रेफरल जो माइनिंग शुरू करता है",
            referral_bonus_2: "उनकी जमा पर <strong>16% कमीशन</strong> हमेशा के लिए कमाएं",
            referral_bonus_3: "असीमित रेफरल, तत्काल इनाम!",
            referral_milestones: "रेफरल मील के पत्थर",
            referral_milestones_desc: "रेफरल मील के पत्थर तक पहुंचने पर बोनस इनाम अर्जित करें!",
            referral_milestone_10: "10 रेफरल",
            referral_milestone_25: "25 रेफरल",
            referral_milestone_50: "50 रेफरल",
            referral_milestone_100: "100 रेफरल",
            referral_milestone_250: "250 रेफरल",
            share_telegram: "टेलीग्राम",
            share_whatsapp: "व्हाट्सएप",
            language_welcome_title: "👽 एलियन मस्क में आपका स्वागत है!",
            language_welcome_subtitle: "कृपया अपनी पसंदीदा भाषा चुनें",
            language_continue: "जारी रखें",
            cancel: "रद्द करें",
            confirm: "पुष्टि करें",
            close: "बंद करें",
            save: "सहेजें",
            edit: "संपादित करें",
            copy: "कॉपी करें",
            copied: "कॉपी हो गया!",
            success: "सफलता",
            error: "त्रुटि",
            warning: "चेतावनी",
            info: "जानकारी",
            free: "मुफ्त",
            history_title: "लेनदेन इतिहास",
            history_all: "सभी",
            history_pending: "लंबित",
            history_completed: "पूर्ण",
            history_rejected: "अस्वीकृत",
            history_all_types: "सभी प्रकार",
            history_deposits: "जमा",
            history_withdrawals: "निकासी",
            history_mining: "माइनिंग",
            history_staking: "स्टेकिंग",
            history_swap: "स्वैप",
            history_referral: "रेफरल",
            history_tasks: "कार्य",
            history_vip: "वीआईपी कार्य",
            history_no_transactions: "कोई लेनदेन नहीं मिला",
            history_no_transactions_desc: "आपके वर्तमान फ़िल्टर से कोई लेनदेन मेल नहीं खाता"
        }
    },
    bn: {
        code: 'bn',
        flag: '🇧🇩',
        name: 'Bengali',
        nativeName: 'বাংলা',
        dir: 'ltr',
        translations: {
            app_name: "এলিয়েন মাস্ক কোয়ান্টাম",
            app_name_short: "এলিয়েন মাস্ক",
            loading: "লোড হচ্ছে...",
            loading_subtitle: "কোয়ান্টাম সিস্টেম চালু হচ্ছে...",
            nav_home: "হোম",
            nav_staking: "স্টেকিং",
            nav_wallet: "ওয়ালেট",
            nav_referral: "রেফারেল",
            mining_title: "কোয়ান্টাম মাইনিং স্টেশন",
            mining_level: "স্তর",
            mining_hashrate: "হ্যাশরেট",
            mining_next_reward: "পরবর্তী পুরস্কার:",
            mining_start: "কোয়ান্টাম মাইনিং শুরু করুন",
            mining_claim: "পুরস্কার দাবি করুন",
            mining_in_progress: "মাইনিং চলছে...",
            mining_total: "মোট মাইন করা:",
            mining_today: "আজ:",
            mining_quick_tasks: "কাজ",
            mining_quick_booster: "বুস্টার 🚀",
            upgrade_title: "মাইনিং স্তর আপগ্রেড করুন",
            tasks_title: "কাজ এবং পুরস্কার",
            tasks_completed: "সম্পন্ন",
            tasks_basic: "মৌলিক",
            tasks_vip: "ভিআইপি 🏆",
            tasks_start: "শুরু করুন",
            tasks_done: "সম্পন্ন ✓",
            staking_title: "কোয়ান্টাম স্টেকিং",
            staking_description: "AMSK টোকেন অর্জনের জন্য আপনার USDT স্টেক করুন। বেশি স্টেক এবং দীর্ঘ সময়কাল আরও ভাল পুরস্কার দেয়।",
            staking_total: "মোট স্টেক",
            staking_active: "সক্রিয় আয়",
            staking_plans: "স্টেকিং পরিকল্পনা",
            staking_plan_silver: "সিলভার প্ল্যান",
            staking_plan_gold: "গোল্ড প্ল্যান",
            staking_plan_diamond: "ডায়মন্ড প্ল্যান",
            staking_duration_7: "৭ দিন",
            staking_duration_15: "১৫ দিন",
            staking_duration_30: "৩০ দিন",
            staking_silver_reward: "দৈনিক: $10 প্রতি 2,857 AMSK",
            staking_gold_reward: "দৈনিক: $50 প্রতি 8,333 AMSK",
            staking_diamond_reward: "দৈনিক: $100 প্রতি 10,000 AMSK",
            staking_stake_now: "এখনই স্টেক করুন",
            staking_active_stakes: "সক্রিয় স্টেক",
            staking_no_active: "এখনও কোন সক্রিয় স্টেক নেই",
            staking_start_hint: "পুরস্কার অর্জনের জন্য স্টেকিং শুরু করুন",
            wallet_total_balance: "মোট ব্যালেন্স",
            wallet_total_usd: "ডলারে মোট মূল্য",
            wallet_quick_actions: "দ্রুত কর্ম",
            wallet_deposit: "জমা",
            wallet_withdraw: "উত্তোলন",
            wallet_swap: "অদলবদল",
            wallet_history: "ইতিহাস",
            wallet_assets: "সম্পদ",
            referral_stats: "রেফারেল পরিসংখ্যান",
            referral_count: "রেফারেল",
            referral_earned: "AMSK অর্জিত",
            referral_your_link: "আপনার রেফারেল লিঙ্ক",
            referral_invite: "🚀 বন্ধুদের আমন্ত্রণ জানান এবং বড় অর্জন করুন!",
            referral_bonus_1: "প্রতি রেফারেলের জন্য <strong>১০,০০০ AMSK ($২)</strong> পান যারা মাইনিং শুরু করে",
            referral_bonus_2: "তাদের জমার উপর <strong>১৬% কমিশন</strong> চিরকাল অর্জন করুন",
            referral_bonus_3: "সীমাহীন রেফারেল, তাৎক্ষণিক পুরস্কার!",
            referral_milestones: "রেফারেল মাইলফলক",
            referral_milestones_desc: "রেফারেল মাইলফলকে পৌঁছানোর জন্য বোনাস পুরস্কার অর্জন করুন!",
            referral_milestone_10: "১০ রেফারেল",
            referral_milestone_25: "২৫ রেফারেল",
            referral_milestone_50: "৫০ রেফারেল",
            referral_milestone_100: "১০০ রেফারেল",
            referral_milestone_250: "২৫০ রেফারেল",
            share_telegram: "টেলিগ্রাম",
            share_whatsapp: "হোয়াটসঅ্যাপ",
            language_welcome_title: "👽 এলিয়েন মাস্কে স্বাগতম!",
            language_welcome_subtitle: "অনুগ্রহ করে আপনার পছন্দের ভাষা নির্বাচন করুন",
            language_continue: "চালিয়ে যান",
            cancel: "বাতিল",
            confirm: "নিশ্চিত করুন",
            close: "বন্ধ করুন",
            save: "সংরক্ষণ করুন",
            edit: "সম্পাদনা করুন",
            copy: "কপি করুন",
            copied: "কপি হয়েছে!",
            success: "সফল",
            error: "ত্রুটি",
            warning: "সতর্কতা",
            info: "তথ্য",
            free: "বিনামূল্যে",
            history_title: "লেনদেনের ইতিহাস",
            history_all: "সব",
            history_pending: "বিচারাধীন",
            history_completed: "সম্পন্ন",
            history_rejected: "প্রত্যাখ্যাত",
            history_all_types: "সব ধরনের",
            history_deposits: "জমা",
            history_withdrawals: "উত্তোলন",
            history_mining: "মাইনিং",
            history_staking: "স্টেকিং",
            history_swap: "অদলবদল",
            history_referral: "রেফারেল",
            history_tasks: "কাজ",
            history_vip: "ভিআইপি কাজ",
            history_no_transactions: "কোন লেনদেন পাওয়া যায়নি",
            history_no_transactions_desc: "আপনার বর্তমান ফিল্টারের সাথে কোন লেনদেন মেলে না"
        }
    },
    ru: {
        code: 'ru',
        flag: '🇷🇺',
        name: 'Russian',
        nativeName: 'Русский',
        dir: 'ltr',
        translations: {
            app_name: "Alien Musk Quantum",
            app_name_short: "Alien Musk",
            loading: "Загрузка...",
            loading_subtitle: "Инициализация квантовых систем...",
            nav_home: "Главная",
            nav_staking: "Стейкинг",
            nav_wallet: "Кошелек",
            nav_referral: "Рефералы",
            mining_title: "Квантовая майнинг-станция",
            mining_level: "Уровень",
            mining_hashrate: "Хешрейт",
            mining_next_reward: "Следующая награда:",
            mining_start: "Начать квантовый майнинг",
            mining_claim: "Получить награду",
            mining_in_progress: "Майнинг...",
            mining_total: "Всего добыто:",
            mining_today: "Сегодня:",
            mining_quick_tasks: "Задания",
            mining_quick_booster: "Бустер 🚀",
            upgrade_title: "Улучшить уровень майнинга",
            tasks_title: "Задания и награды",
            tasks_completed: "Выполнено",
            tasks_basic: "Базовые",
            tasks_vip: "VIP 🏆",
            tasks_start: "Начать",
            tasks_done: "Готово ✓",
            staking_title: "Квантовый стейкинг",
            staking_description: "Стейкайте свои USDT, чтобы зарабатывать токены AMSK. Большие стейки и более длительные сроки дают лучшие награды.",
            staking_total: "Всего в стейкинге",
            staking_active: "Активный доход",
            staking_plans: "Планы стейкинга",
            staking_plan_silver: "Silver",
            staking_plan_gold: "Gold",
            staking_plan_diamond: "Diamond",
            staking_duration_7: "7 дней",
            staking_duration_15: "15 дней",
            staking_duration_30: "30 дней",
            staking_silver_reward: "Ежедневно: 2,857 AMSK за $10",
            staking_gold_reward: "Ежедневно: 8,333 AMSK за $50",
            staking_diamond_reward: "Ежедневно: 10,000 AMSK за $100",
            staking_stake_now: "Начать стейкинг",
            staking_active_stakes: "Активные стейки",
            staking_no_active: "Нет активных стейков",
            staking_start_hint: "Начните стейкинг, чтобы зарабатывать награды",
            wallet_total_balance: "Общий баланс",
            wallet_total_usd: "Общая стоимость в USD",
            wallet_quick_actions: "Быстрые действия",
            wallet_deposit: "Депозит",
            wallet_withdraw: "Вывод",
            wallet_swap: "Обмен",
            wallet_history: "История",
            wallet_assets: "Активы",
            referral_stats: "Реферальная статистика",
            referral_count: "Рефералы",
            referral_earned: "Заработано AMSK",
            referral_your_link: "Ваша реферальная ссылка",
            referral_invite: "🚀 Приглашайте друзей и зарабатывайте!",
            referral_bonus_1: "Получите <strong>10,000 AMSK ($2)</strong> за каждого реферала, начавшего майнинг",
            referral_bonus_2: "Зарабатывайте <strong>16% комиссии</strong> с их депозитов навсегда",
            referral_bonus_3: "Неограниченное количество рефералов, мгновенные награды!",
            referral_milestones: "Реферальные этапы",
            referral_milestones_desc: "Зарабатывайте бонусные награды за достижение реферальных этапов!",
            referral_milestone_10: "10 рефералов",
            referral_milestone_25: "25 рефералов",
            referral_milestone_50: "50 рефералов",
            referral_milestone_100: "100 рефералов",
            referral_milestone_250: "250 рефералов",
            share_telegram: "Telegram",
            share_whatsapp: "WhatsApp",
            language_welcome_title: "👽 Добро пожаловать в Alien Musk!",
            language_welcome_subtitle: "Пожалуйста, выберите предпочитаемый язык",
            language_continue: "Продолжить",
            cancel: "Отмена",
            confirm: "Подтвердить",
            close: "Закрыть",
            save: "Сохранить",
            edit: "Редактировать",
            copy: "Копировать",
            copied: "Скопировано!",
            success: "Успешно",
            error: "Ошибка",
            warning: "Предупреждение",
            info: "Информация",
            free: "Бесплатно",
            history_title: "История транзакций",
            history_all: "Все",
            history_pending: "В ожидании",
            history_completed: "Завершено",
            history_rejected: "Отклонено",
            history_all_types: "Все типы",
            history_deposits: "Депозиты",
            history_withdrawals: "Выводы",
            history_mining: "Майнинг",
            history_staking: "Стейкинг",
            history_swap: "Обмен",
            history_referral: "Рефералы",
            history_tasks: "Задания",
            history_vip: "VIP задания",
            history_no_transactions: "Транзакции не найдены",
            history_no_transactions_desc: "Нет транзакций, соответствующих текущим фильтрам"
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
        
        if (userData && userData.id && window.db) {
            window.db.collection('users')
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
                <div class="language-grid-item" onclick="selectWelcomeLanguage('en')">
                    <span class="flag">🇬🇧</span>
                    <span class="lang-name">English</span>
                    <span class="native-name">English</span>
                </div>
                <div class="language-grid-item" onclick="selectWelcomeLanguage('ar')">
                    <span class="flag">🇸🇦</span>
                    <span class="lang-name">العربية</span>
                    <span class="native-name">العربية</span>
                </div>
                <div class="language-grid-item" onclick="selectWelcomeLanguage('hi')">
                    <span class="flag">🇮🇳</span>
                    <span class="lang-name">हिन्दी</span>
                    <span class="native-name">हिन्दी</span>
                </div>
                <div class="language-grid-item" onclick="selectWelcomeLanguage('bn')">
                    <span class="flag">🇧🇩</span>
                    <span class="lang-name">বাংলা</span>
                    <span class="native-name">বাংলা</span>
                </div>
                <div class="language-grid-item" onclick="selectWelcomeLanguage('ru')">
                    <span class="flag">🇷🇺</span>
                    <span class="lang-name">Русский</span>
                    <span class="native-name">Русский</span>
                </div>
            </div>
            
            <button class="continue-btn" onclick="closeLanguageWelcome()" data-translate="language_continue"></button>
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

// ===========================================
// 🆘 أيقونة الدعم الفني
// ===========================================
function initSupportIcon() {
    const supportIcon = document.getElementById('support-icon');
    if (supportIcon) {
        supportIcon.addEventListener('click', function() {
            const supportUsername = 'AlienMusk_support';
            
            if (window.tg && window.tg.openTelegramLink) {
                window.tg.openTelegramLink(`https://t.me/${supportUsername}`);
            } else {
                window.open(`https://t.me/${supportUsername}`, '_blank');
            }
            
            showMessage("Opening support chat...", "info");
        });
    }
}

function initTelegram() {
    try {
        if (window.Telegram && window.Telegram.WebApp) {
            window.tg = Telegram.WebApp;
            window.tg.ready();
            window.tg.expand();
            window.tg.setHeaderColor('#0a0a0f');
            window.tg.setBackgroundColor('#0a0a0f');
            console.log("✅ Telegram WebApp initialized");
            return true;
        }
    } catch (e) {
        console.log("⚠️ Not in Telegram environment");
    }
    return false;
}

function initFirebase() {
    if (typeof firebase !== 'undefined') {
        try {
            window.firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
            window.db = firebase.firestore();
            window.auth = firebase.auth();
            console.log("✅ Firebase initialized");
            return true;
        } catch (error) {
            console.error("❌ Firebase error:", error);
        }
    }
    return false;
}

window.switchPage = function(pageName) {
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
        
    } catch (error) {
        console.error("❌ Page switch error:", error);
    }
};

window.closeModal = function() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.remove();
    });
};

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text)
        .then(() => showMessage('✅ Copied to clipboard!', 'success'))
        .catch(() => showMessage('❌ Failed to copy', 'error'));
};

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
    
    let displayText = text;
    if (text.startsWith('msg_')) {
        displayText = getTranslation(text);
    }
    
    messageDiv.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${displayText}</span>
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

document.addEventListener('DOMContentLoaded', function() {
    console.log("📱 DOM Content Loaded - Starting initialization...");
    
    initTelegram();
    initFirebase();
    initLanguageSystem();
    
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
        
        if (typeof initAlienMuskApp === 'function') {
            console.log("🚀 Starting main application...");
            initAlienMuskApp();
        } else {
            console.error("❌ Main app function not found!");
            showMessage("Welcome to Alien Musk Quantum!", "success");
        }
    }, 2500);
});

setTimeout(() => {
    if (!window.tg && !window.firebaseApp) {
        console.log("⚠️ Using fallback initialization...");
        const loadingScreen = document.getElementById('loading-screen');
        const appContainer = document.getElementById('app-container');
        
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        if (appContainer) {
            appContainer.classList.remove('hidden');
        }
        
        showMessage("Running in standalone mode", "info");
    }
}, 10000);

console.log("✅ Alien Musk Connector Loaded Successfully - STANDALONE MODE");

// ===========================================
// ⚙️ CONFIGURATION - الإعدادات الأساسية
// ===========================================
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
        DURATION: 9000000,
        
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
        1: { name: "Join Telegram Channel", url: "https://t.me/alienmusk", icon: "fab fa-telegram", reward: 5000 },
        2: { name: "Subscribe on YouTube", url: "https://youtube.com/@alienmusk", icon: "fab fa-youtube", reward: 5000 },
        3: { name: "Follow on TikTok", url: "https://tiktok.com/@alienmusk", icon: "fab fa-tiktok", reward: 5000 },
        4: { name: "Like & Share Post", url: "https://t.me/alienmusk/1", icon: "fas fa-heart", reward: 5000 }
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
    },
    
    // ===== ZERO COST SETTINGS (مثل REFI) =====
    CACHE: {
        USER: 5 * 60 * 1000,        // 5 دقائق
        PRICES: 3 * 60 * 60 * 1000,  // 3 ساعات
        HISTORY: 10 * 60 * 1000,     // 10 دقائق
        ADMIN: 30 * 1000             // 30 ثانية بين تحديثات الأدمن
    },
    
    LISTENER_LIFETIME: 30000, // 30 ثانية
    
    FIREBASE: {
        SAVE_INTERVAL: 3600000, // ساعة واحدة
        LOCAL_SAVE_INTERVAL: 300000 // 5 دقائق
    }
};

// ===========================================
// 📊 LIVE PRICES - متغير منفصل للأسعار الحية
// ===========================================
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

// ===========================================
// 💰 WALLET DATA - بيانات المحفظة
// ===========================================
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

// ===========================================
// 👤 USER DATA - بيانات المستخدم
// ===========================================
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

// ===========================================
// 👤 USER IDENTIFICATION - يجب أن يكون هنا
// ===========================================
const userId = tg?.initDataUnsafe?.user?.id?.toString() || 
               localStorage.getItem('alien_musk_user_id') || 
               'guest_' + Math.random().toString(36).substr(2, 9);

const userName = tg?.initDataUnsafe?.user?.first_name || 'Alien';

localStorage.setItem('alien_musk_user_id', userId);

// ===========================================
// 🔥 ON-DEMAND LISTENERS SYSTEM (جديد - مثل REFI)
// ===========================================
const activeListeners = new Map();
const listenerTimeouts = new Map();

function startOnDemandListener(collection, docId, callback, timeoutMs = CONFIG.LISTENER_LIFETIME) {
    const listenerId = `${collection}_${docId}`;
    
    if (activeListeners.has(listenerId)) {
        activeListeners.get(listenerId)();
        activeListeners.delete(listenerId);
        clearTimeout(listenerTimeouts.get(listenerId));
    }
    
    const unsubscribe = db?.collection(collection).doc(docId).onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            console.log(`📡 Listener update for ${collection}/${docId}:`, data.status);
            callback(data);
            
            if (data.status === 'approved' || data.status === 'rejected') {
                stopOnDemandListener(listenerId);
            }
        }
    });
    
    if (unsubscribe) {
        activeListeners.set(listenerId, unsubscribe);
        
        const timeout = setTimeout(() => {
            stopOnDemandListener(listenerId);
        }, timeoutMs);
        
        listenerTimeouts.set(listenerId, timeout);
    }
}

function stopOnDemandListener(listenerId) {
    if (activeListeners.has(listenerId)) {
        activeListeners.get(listenerId)();
        activeListeners.delete(listenerId);
        clearTimeout(listenerTimeouts.get(listenerId));
        listenerTimeouts.delete(listenerId);
    }
}

function stopAllListeners() {
    activeListeners.forEach((unsubscribe) => unsubscribe());
    listenerTimeouts.forEach((timeout) => clearTimeout(timeout));
    activeListeners.clear();
    listenerTimeouts.clear();
}

// ===========================================
// 🕒 CACHE TIMERS (جديد - مثل REFI)
// ===========================================
let lastUserLoadTime = 0;
let lastPricesLoadTime = 0;
let lastHistoryCheckTime = 0;
let lastAdminRefreshTime = 0;

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
    localSaveTimer: null,
    firebaseSaveTimer: null
};

let unsubscribeTransactionsListener = null;
let pendingFirebaseSave = null;
let lastImportantChange = 0;

// ===========================================
// 🔥 STORAGE KEYS (يجب أن يكون بعد تعريف userId)
// ===========================================
const STORAGE_KEYS = {
    USER: `user_${userId}`,
    WALLET: `wallet_${userId}`,
    TRANSACTIONS: `transactions_${userId}`,
    PRICES: 'live_prices'
};

function loadLocalData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || null;
    } catch {
        return null;
    }
}

function saveLocalData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch {
        return false;
    }
}

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

async function setupUser() {
    console.log("👤 Setting up user...");
    
    let telegramUser = null;
    if (window.tg && window.tg.initDataUnsafe && window.tg.initDataUnsafe.user) {
        telegramUser = window.tg.initDataUnsafe.user;
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

// ===========================================
// 📂 LOAD USER DATA (مع التخزين المؤقت)
// ===========================================
async function loadUserData(force = false) {
    console.log("📂 Loading user data for:", userData.id);
    
    const now = Date.now();
    const localData = loadLocalData(STORAGE_KEYS.USER);
    
    if (!force && localData && (now - lastUserLoadTime) < CONFIG.CACHE.USER) {
        userData = { ...userData, ...localData };
        walletData = localData.wallet || walletData;
        console.log("✅ Using cached user data (less than 5 min old)");
        updateUI();
        return;
    }
    
    if (localData) {
        userData = { ...userData, ...localData };
        walletData = localData.wallet || walletData;
        console.log("📦 Using localStorage data while fetching fresh data");
    }
    
    if (db) {
        try {
            console.log("🔥 Loading from Firebase...");
            
            const userDoc = await db.collection('users').doc(userData.id).get();
            
            if (userDoc.exists) {
                const fbData = userDoc.data();
                
                userData = { ...userData, ...fbData };
                walletData = fbData.wallet || walletData;
                
                lastUserLoadTime = now;
                saveLocalData(STORAGE_KEYS.USER, { ...userData, wallet: walletData });
            }
        } catch (error) {
            console.error("❌ Error loading from Firebase:", error);
        }
    }
    
    const txs = loadLocalData(STORAGE_KEYS.TRANSACTIONS) || [];
    walletData.transactionHistory = txs;
    
    updateUI();
    checkAdminAndAddCrown();
}

async function saveUserData(important = false) {
    if (!userData.id) return;
    
    userData.lastActive = new Date().toISOString();
    walletData.lastUpdate = Date.now();
    
    const data = { ...userData, wallet: walletData };
    saveLocalData(STORAGE_KEYS.USER, data);
    saveLocalData(STORAGE_KEYS.WALLET, walletData);
    saveLocalData(STORAGE_KEYS.TRANSACTIONS, walletData.transactionHistory);
    
    if (important && db && hasImportantChanges()) {
        try {
            await db.collection('users').doc(userData.id).set(data, { merge: true });
            console.log("💾 Important data saved to Firebase");
        } catch (error) {
            console.error("❌ Error saving to Firebase:", error);
        }
    }
}

function hasImportantChanges() {
    return (
        walletData.balances.USDT > 0 ||
        walletData.balances.BNB > 0 ||
        walletData.staking.activeStakes.length > 0 ||
        walletData.pendingWithdrawals.length > 0 ||
        walletData.referrals.count > 0 ||
        walletData.tasks.completed.length > 0
    );
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

function setupTransactionListener() {
    if (!window.db || !userData.id) {
        console.log("⚠️ Cannot setup transaction listener: Firebase not available");
        return;
    }

    if (unsubscribeTransactionsListener) {
        unsubscribeTransactionsListener();
    }

    console.log("👂 Setting up transaction listener for financial operations only");

    unsubscribeTransactionsListener = window.db.collection(DB_COLLECTIONS.WITHDRAWALS)
        .where('userId', '==', userData.id)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'modified' || change.type === 'added') {
                    const withdrawalData = change.doc.data();
                    console.log("🔄 Withdrawal update received:", withdrawalData.status);
                    
                    const pendingIndex = walletData.pendingWithdrawals.findIndex(w => w.id === change.doc.id);
                    
                    if (pendingIndex !== -1) {
                        if (withdrawalData.status === 'approved') {
                            const approvedWithdrawal = walletData.pendingWithdrawals[pendingIndex];
                            approvedWithdrawal.status = 'approved';
                            approvedWithdrawal.approvedAt = Date.now();
                            
                            addTransactionToHistory('withdrawal_approved', -approvedWithdrawal.amount, 'USDT', 
                                `To: ${approvedWithdrawal.address.slice(0, 10)}...`, 'completed', 
                                'Withdrawal approved and processed');
                            
                            walletData.pendingWithdrawals.splice(pendingIndex, 1);
                            showMessage(`✅ Withdrawal of ${approvedWithdrawal.amount} USDT approved and sent!`, 'success');
                            
                        } else if (withdrawalData.status === 'rejected') {
                            const rejectedWithdrawal = walletData.pendingWithdrawals[pendingIndex];
                            
                            walletData.balances.USDT += rejectedWithdrawal.amount;
                            
                            addTransactionToHistory('withdrawal_rejected', -rejectedWithdrawal.amount, 'USDT', 
                                `Rejected: ${withdrawalData.rejectionReason || 'No reason'}`, 'rejected', 
                                'Withdrawal rejected and funds returned');
                            
                            walletData.pendingWithdrawals.splice(pendingIndex, 1);
                            showMessage(`❌ Withdrawal rejected: ${withdrawalData.rejectionReason || 'No reason provided'}`, 'warning');
                        }
                        
                        saveUserDataToLocalStorage();
                        updateWalletUI();
                    }
                }
            });
        }, (error) => {
            console.error("❌ Transaction listener error:", error);
            setTimeout(setupTransactionListener, 5000);
        });
}

function setupDepositListener() {
    if (!window.db || !userData.id) return;
    
    window.db.collection(DB_COLLECTIONS.DEPOSITS)
        .where('userId', '==', userData.id)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'modified') {
                    const depositData = change.doc.data();
                    console.log("💰 Deposit update received:", depositData.status);
                    
                    if (depositData.status === 'approved') {
                        walletData.balances[depositData.currency] = (walletData.balances[depositData.currency] || 0) + depositData.amount;
                        
                        addTransactionToHistory('deposit_approved', depositData.amount, depositData.currency, 
                            `TX: ${depositData.txId.slice(0, 10)}...`, 'completed', 
                            'Deposit approved and credited');
                        
                        showMessage(`✅ Deposit of ${depositData.amount} ${depositData.currency} approved and credited!`, 'success');
                        updateWalletUI();
                        saveUserDataToLocalStorage();
                        
                    } else if (depositData.status === 'rejected') {
                        addTransactionToHistory('deposit_rejected', depositData.amount, depositData.currency, 
                            `Rejected: ${depositData.rejectionReason || 'No reason'}`, 'rejected', 
                            'Deposit rejected');
                        
                        showMessage(`❌ Deposit rejected: ${depositData.rejectionReason || 'No reason provided'}`, 'warning');
                    }
                }
            });
        });
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
            version: '7.1-ultimate-economy'
        };
        
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        console.log("💾 Data backed up to localStorage");
        
    } catch (error) {
        console.error("❌ Error saving to localStorage:", error);
    }
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
            saveUserData();
        }
    } else {
        console.log(`⚠️ Skipped duplicate transaction: ${type} ${amount} ${currency}`);
    }
    
    return transaction;
}

// ===========================================
// 🖼️ تحديث HTML لإضافة أيقونات العملات وقسم الميمات
// ===========================================
function updateAssetsIcons() {
    const assetsContainer = document.querySelector('.asset-list-compact');
    if (!assetsContainer) return;
    
    const amskItem = assetsContainer.querySelector('.asset-item-compact:first-child');
    if (amskItem) {
        const iconDiv = amskItem.querySelector('.asset-icon-compact');
        iconDiv.innerHTML = `<img src="${CONFIG.CMC_ICONS.AMSK}" width="24" height="24" style="border-radius: 50%;">`;
        iconDiv.style.background = 'transparent';
        iconDiv.style.border = '2px solid #00ff88';
    }
    
    const usdtItem = assetsContainer.querySelector('.asset-item-compact:nth-child(2)');
    if (usdtItem) {
        const iconDiv = usdtItem.querySelector('.asset-icon-compact');
        iconDiv.innerHTML = `<img src="${CONFIG.CMC_ICONS.USDT}" width="24" height="24" style="border-radius: 50%;">`;
        iconDiv.style.background = 'transparent';
        iconDiv.style.border = '2px solid #00d4ff';
    }
    
    const bnbItem = assetsContainer.querySelector('.asset-item-compact:nth-child(3)');
    if (bnbItem) {
        const iconDiv = bnbItem.querySelector('.asset-icon-compact');
        iconDiv.innerHTML = `<img src="${CONFIG.CMC_ICONS.BNB}" width="24" height="24" style="border-radius: 50%;">`;
        iconDiv.style.background = 'transparent';
        iconDiv.style.border = '2px solid #ffd700';
    }
    
    const tonItem = assetsContainer.querySelector('.asset-item-compact:nth-child(4)');
    if (tonItem) {
        const iconDiv = tonItem.querySelector('.asset-icon-compact');
        iconDiv.innerHTML = `<img src="${CONFIG.CMC_ICONS.TON}" width="24" height="24" style="border-radius: 50%;">`;
        iconDiv.style.background = 'transparent';
        iconDiv.style.border = '2px solid #9d4edd';
    }
}

// ===========================================
// 🔥 إضافة قسم أفضل 10 ميمات
// ===========================================
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

function renderTopMemes() {
    const memesList = document.getElementById('memes-list');
    if (!memesList) return;
    
    const memes = [
        { symbol: "DOGE", name: "Dogecoin", iconKey: "DOGE" },
        { symbol: "SHIB", name: "Shiba Inu", iconKey: "SHIB" },
        { symbol: "PEPE", name: "Pepe", iconKey: "PEPE" },
        { symbol: "TRUMP", name: "Official Trump", iconKey: "TRUMP" },
        { symbol: "BONK", name: "Bonk", iconKey: "BONK" },
        { symbol: "PENGU", name: "Pudgy Penguins", iconKey: "PENGU" },
        { symbol: "FLOKI", name: "Floki", iconKey: "FLOKI" },
        { symbol: "WIF", name: "Dogwifhat", iconKey: "WIF" }
    ];
    
    let html = '';
    memes.forEach(meme => {
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

// ===========================================
// 🔄 جلب الأسعار الحية من CoinGecko
// ===========================================
async function fetchLivePrices(force = false) {
    const now = Date.now();
    const cached = loadLocalData(STORAGE_KEYS.PRICES);
    
    if (!force && cached && (now - cached.timestamp) < CONFIG.CACHE.PRICES) {
        livePrices = cached.prices || livePrices;
        console.log("📦 Using cached prices (less than 3 hours old)");
        updateWalletUI();
        renderTopMemes();
        return;
    }
    
    try {
        const ids = Object.values(CONFIG.COINGECKO_IDS).join(',');
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
        const data = await response.json();
        
        livePrices.BNB = data.binancecoin?.usd || CONFIG.PRICES.BNB;
        livePrices.TON = data['the-open-network']?.usd || CONFIG.PRICES.TON;
        
        livePrices.DOGE = data.dogecoin?.usd || 0;
        livePrices.DOGE_24h_change = data.dogecoin?.usd_24h_change || 0;
        
        livePrices.SHIB = data['shiba-inu']?.usd || 0;
        livePrices.SHIB_24h_change = data['shiba-inu']?.usd_24h_change || 0;
        
        livePrices.PEPE = data.pepe?.usd || 0;
        livePrices.PEPE_24h_change = data.pepe?.usd_24h_change || 0;
        
        livePrices.TRUMP = data['official-trump']?.usd || 0;
        livePrices.TRUMP_24h_change = data['official-trump']?.usd_24h_change || 0;
        
        livePrices.BONK = data.bonk?.usd || 0;
        livePrices.BONK_24h_change = data.bonk?.usd_24h_change || 0;
        
        livePrices.PENGU = data['pudgy-penguins']?.usd || 0;
        livePrices.PENGU_24h_change = data['pudgy-penguins']?.usd_24h_change || 0;
        
        livePrices.FLOKI = data.floki?.usd || 0;
        livePrices.FLOKI_24h_change = data.floki?.usd_24h_change || 0;
        
        livePrices.WIF = data.dogwifcoin?.usd || 0;
        livePrices.WIF_24h_change = data.dogwifcoin?.usd_24h_change || 0;
        
        livePrices.BNB_24h_change = data.binancecoin?.usd_24h_change || 0;
        livePrices.TON_24h_change = data['the-open-network']?.usd_24h_change || 0;
        
        saveLocalData(STORAGE_KEYS.PRICES, { prices: livePrices, timestamp: now });
        lastPricesLoadTime = now;
        
        updateWalletUI();
        renderTopMemes();
        
        console.log("✅ Live prices updated");
        
    } catch (error) {
        console.error("❌ Error fetching live prices:", error);
    }
}

// ===========================================
// 💰 تحديث دالة updateWalletUI
// ===========================================
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

// ===========================================
// MINING SYSTEM (بدون تغيير)
// ===========================================
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
        
        addTransactionToHistory('mining_reward', reward, 'AMSK', 'Mining reward', 'completed', 'Mining reward claimed successfully');
        
        updateMiningDisplay();
        updateWalletUI();
        await saveUserData();
        
        showMessage(`💰 +${formatNumber(reward)} AMSK mined today! Total: ${formatNumber(walletData.mining.totalMined)} AMSK`, "success");
        
    } catch (error) {
        console.error("❌ Error claiming mining reward:", error);
        showMessage("Failed to claim reward", "error");
    }
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

async function boosterUpgrade() {
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
        await saveUserData();
        
        showMessage(`🚀 BOOSTER ACTIVATED! Upgraded to Level 5 Mythic! Hashrate: ${levelData.hashrate.toLocaleString()}/s`, "success");
        
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

// ===========================================
// STAKING SYSTEM (بدون تغيير)
// ===========================================
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
        
        addTransactionToHistory('staking_start', -amount, 'USDT', `${plan.name} Plan - ${plan.duration} days`, 'completed', 'Staking started successfully');
        
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

// ===========================================
// REFERRAL SYSTEM (بدون تغيير)
// ===========================================
async function checkForReferral() {
    console.log("🔍 Checking for referral...");
    
    if (userData.referredBy || userData.referralBonusClaimed) {
        console.log("✅ User already referred or bonus claimed");
        return;
    }
    
    let referralCode = null;
    
    if (window.tg && window.tg.initDataUnsafe && window.tg.initDataUnsafe.start_param) {
        referralCode = window.tg.initDataUnsafe.start_param;
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
        
        if (window.db) {
            const usersRef = window.db.collection(DB_COLLECTIONS.USERS);
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
            if (window.db) {
                const referrerRef = window.db.collection(DB_COLLECTIONS.USERS).doc(referrerId);
                
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

// ===========================================
// TASKS SYSTEM (بدون تغيير)
// ===========================================
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

// ===========================================
// SWAP SYSTEM (بدون تغيير)
// ===========================================
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
    
    addTransactionToHistory('swap', -fromAmount, fromCurrency, `Swapped to ${toAmount.toLocaleString()} ${toCurrency}`, 'completed', 'Swap completed successfully');
    addTransactionToHistory('swap', toAmount, toCurrency, `Swapped from ${fromAmount} ${fromCurrency}`, 'completed', 'Swap completed successfully');
    
    updateWalletUI();
    closeModal();
    
    showMessage(`✅ Swapped ${fromAmount} ${fromCurrency} to ${toAmount.toLocaleString()} ${toCurrency}! New balance: ${walletData.balances[toCurrency].toLocaleString()} ${toCurrency}`, "success");
    await saveUserData();
}

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
            const bnbPrice = livePrices.BNB || CONFIG.PRICES.BNB;
            const rate = bnbPrice * 5000;
            rateText.textContent = `1 BNB = ${rate.toLocaleString()} AMSK ($${bnbPrice.toFixed(2)})`;
            rulesText.textContent = "BNB → AMSK allowed (live price)";
        } else if (fromCurrency === 'TON' && toCurrency === 'AMSK') {
            const tonPrice = livePrices.TON || CONFIG.PRICES.TON;
            const rate = tonPrice * 5000;
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
        toAmount = fromAmount * (bnbPrice * 5000);
    } else if (fromCurrency === 'TON' && toCurrency === 'AMSK') {
        const tonPrice = livePrices.TON || CONFIG.PRICES.TON;
        toAmount = fromAmount * (tonPrice * 5000);
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

// ===========================================
// 💳 DEPOSIT SYSTEM (مع On-Demand Listener)
// ===========================================
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
                        <button class="btn-primary" onclick="submitDepositRequest()">
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
    
    if (activeCurrency === 'USDT' || activeCurrency === 'BNB') {
        if (!txId.startsWith('0x') || txId.length !== 66) {
            showMessage("⚠️ Invalid TX ID format. Should start with 0x and be 66 characters.", "warning", 4500);
            return;
        }
    } else if (activeCurrency === 'TON') {
        if (txId.length < 40 || txId.length > 70) {
            showMessage("⚠️ Invalid TX ID format. Should be 40-70 characters.", "warning", 4500);
            return;
        }
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
        
        if (window.db) {
            const depositRef = await window.db.collection(DB_COLLECTIONS.DEPOSITS).add(depositRequest);
            depositId = depositRef.id;
            depositRequest.id = depositId;
            
            // 🔥 On-Demand Listener - 30 ثانية فقط
            startOnDemandListener('deposit_requests', depositId, (data) => {
                console.log("📥 Deposit update received:", data);
                
                if (data.status === 'approved') {
                    walletData.balances[activeCurrency] = (walletData.balances[activeCurrency] || 0) + amount;
                    saveUserData(true);
                    updateWalletUI();
                    showMessage(`✅ Deposit of ${amount} ${activeCurrency} approved!`, 'success');
                    
                } else if (data.status === 'rejected') {
                    showMessage(`❌ Deposit rejected: ${data.reason || 'Unknown reason'}`, 'error');
                }
            }, 30000);
        } else {
            depositId = 'dep_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            depositRequest.id = depositId;
        }
        
        addTransactionToHistory('deposit_request', amount, activeCurrency, `TX: ${txId.slice(0, 10)}...`, 'pending', 'Deposit request submitted. Waiting for admin approval.', txId);
        
        walletData.usedTxIds.push(txId);
        
        await saveUserData();
        closeModal();
        
        showMessage(`✅ Deposit request submitted for ${amount} ${activeCurrency}. Waiting for admin approval.`, "success");
        
    } catch (error) {
        console.error("❌ Error submitting deposit:", error);
        showMessage("Failed to submit deposit request", "error");
    }
}

// ===========================================
// 💸 WITHDRAW SYSTEM (مع On-Demand Listener)
// ===========================================
async function openWithdrawModal() {
    if (!walletData || !walletData.balances) return;
    
    const pendingTotal = getPendingWithdrawalsTotal();
    
    if (walletData.balances.USDT < CONFIG.WITHDRAW.MIN_USDT) {
        const motivationalMessage = `⚠️ Minimum withdrawal is 100 USDT.
        
📊 **Your Balance:** ${walletData.balances.USDT.toFixed(2)} USDT
⏳ **Pending Withdrawals:** ${pendingTotal.toFixed(2)} USDT

📈 **Your Path to 100 USDT:**

⛏️ **Mining:** 
   • 1,000 AMSK/2.5h = 9,600 AMSK/day = 1.92 USDT/day

👥 **Referrals:** 
   • You get 10,000 AMSK per friend
   • Your friend gets 5,000 AMSK bonus

💱 **Swap Rate:** 
   • 5,000 AMSK = 1 USDT

✨ **Quick Math:**
   • 1 referral = 10,000 AMSK = 2 USDT
   • 50 referrals = 100 USDT 🎯

🚀 Keep going! Every referral brings you closer!`;
        
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
                        <button class="btn-primary" onclick="submitWithdrawRequest()">
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
        
        if (window.db) {
            await window.db.collection(DB_COLLECTIONS.WITHDRAWALS).doc(withdrawalId).set(withdrawRequest);
            
            // 🔥 On-Demand Listener - 30 ثانية فقط
            startOnDemandListener('withdrawals', withdrawalId, (data) => {
                console.log("📤 Withdrawal update received:", data);
                
                if (data.status === 'approved') {
                    showMessage(`✅ Withdrawal of ${amount} USDT approved!`, 'success');
                    
                } else if (data.status === 'rejected') {
                    walletData.balances.USDT += amount;
                    walletData.balances.BNB += CONFIG.WITHDRAW.FEE_BNB;
                    saveUserData(true);
                    updateWalletUI();
                    showMessage(`❌ Withdrawal rejected: ${data.reason || 'Unknown reason'}`, 'error');
                }
            }, 30000);
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
    }
}

// ===========================================
// 👑 ADMIN SYSTEM - إضافة تاج المشرف
// ===========================================
let isAdmin = userData.telegramId === CONFIG.ADMIN.TELEGRAM_ID;

function checkAdminAndAddCrown() {
    if (!isAdmin) return;
    
    const addCrown = () => {
        const header = document.querySelector('.header-icons-row');
        if (!header) return false;
        
        const existingCrown = document.getElementById('adminCrownBtn');
        if (existingCrown) return true;
        
        const adminBtn = document.createElement('button');
        adminBtn.id = 'adminCrownBtn';
        adminBtn.className = 'support-icon';
        adminBtn.innerHTML = '<i class="fa-solid fa-crown" style="color: gold;"></i>';
        adminBtn.onclick = showAdminPanel;
        adminBtn.title = 'Admin Panel';
        
        header.insertBefore(adminBtn, elements.supportIcon);
        return true;
    };
    
    if (!addCrown()) {
        setTimeout(addCrown, 500);
    }
}

function showAdminPanel() {
    if (!isAdmin) {
        showMessage("Access denied", "error");
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3><i class="fa-solid fa-crown" style="color:gold;"></i> Admin Panel</h3>
                <button class="modal-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-body" style="max-height:70vh;overflow-y:auto;">
                <div style="text-align:center;margin-bottom:15px;">
                    <button class="btn-primary" onclick="refreshAdminPanel()" id="adminRefreshBtn">
                        <i class="fas fa-sync-alt"></i> Refresh Data
                    </button>
                </div>
                <div id="adminContent">
                    <p style="text-align:center;color:#b0b0d0;">Click Refresh to load data</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

let adminData = {
    pendingDeposits: [],
    pendingWithdrawals: [],
    lastRefresh: 0
};

window.refreshAdminPanel = async function() {
    if (!db) {
        showMessage("Firebase not available", "error");
        return;
    }
    
    const now = Date.now();
    if (now - adminData.lastRefresh < CONFIG.CACHE.ADMIN) {
        showMessage("Please wait 30 seconds", "warning");
        return;
    }
    
    const btn = document.getElementById('adminRefreshBtn');
    if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    
    try {
        const deposits = await db.collection('deposit_requests').where('status', '==', 'pending').get();
        const withdrawals = await db.collection('withdrawals').where('status', '==', 'pending').get();
        
        adminData.pendingDeposits = deposits.docs.map(d => ({ id: d.id, ...d.data() }));
        adminData.pendingWithdrawals = withdrawals.docs.map(w => ({ id: w.id, ...w.data() }));
        adminData.lastRefresh = now;
        
        renderAdminContent();
        
    } catch (e) {
        console.error(e);
        showMessage("Error loading data", "error");
    } finally {
        if (btn) btn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
    }
};

function renderAdminContent() {
    const content = document.getElementById('adminContent');
    if (!content) return;
    
    let html = '<h4 style="color:#00ff88;margin-bottom:10px;">Pending Deposits</h4>';
    
    if (adminData.pendingDeposits.length === 0) {
        html += '<p style="color:#b0b0d0;">No pending deposits</p>';
    } else {
        adminData.pendingDeposits.forEach(d => {
            html += `
                <div style="background:linear-gradient(145deg,#1e1e35,#15152a);border-radius:12px;padding:15px;margin-bottom:10px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                        <span style="color:#00ff88;">${d.userName || 'User'}</span>
                        <span style="color:#ffd700;">${d.amount} ${d.currency}</span>
                    </div>
                    <div style="font-size:12px;color:#b0b0d0;margin-bottom:10px;">
                        <div>TX: ${d.txId?.substring(0,16)}...</div>
                        <div>User ID: ${d.userId?.substring(0,10)}...</div>
                    </div>
                    <div style="display:flex;gap:8px;">
                        <button class="btn-approve" style="flex:1;padding:8px;background:#00ff88;border:none;border-radius:8px;color:#000;font-weight:600;" onclick="approveDeposit('${d.id}')">Approve</button>
                        <button class="btn-reject" style="flex:1;padding:8px;background:#ff4444;border:none;border-radius:8px;color:white;font-weight:600;" onclick="rejectDeposit('${d.id}')">Reject</button>
                    </div>
                </div>
            `;
        });
    }
    
    html += '<h4 style="color:#00ff88;margin:15px 0 10px;">Pending Withdrawals</h4>';
    
    if (adminData.pendingWithdrawals.length === 0) {
        html += '<p style="color:#b0b0d0;">No pending withdrawals</p>';
    } else {
        adminData.pendingWithdrawals.forEach(w => {
            html += `
                <div style="background:linear-gradient(145deg,#1e1e35,#15152a);border-radius:12px;padding:15px;margin-bottom:10px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                        <span style="color:#00ff88;">${w.userName || 'User'}</span>
                        <span style="color:#ffd700;">${w.amount} USDT</span>
                    </div>
                    <div style="font-size:12px;color:#b0b0d0;margin-bottom:10px;">
                        <div>Address: ${w.address?.substring(0,16)}...</div>
                        <div>User ID: ${w.userId?.substring(0,10)}...</div>
                    </div>
                    <div style="display:flex;gap:8px;">
                        <button class="btn-approve" style="flex:1;padding:8px;background:#00ff88;border:none;border-radius:8px;color:#000;font-weight:600;" onclick="approveWithdrawal('${w.id}')">Approve</button>
                        <button class="btn-reject" style="flex:1;padding:8px;background:#ff4444;border:none;border-radius:8px;color:white;font-weight:600;" onclick="rejectWithdrawal('${w.id}')">Reject</button>
                    </div>
                </div>
            `;
        });
    }
    
    content.innerHTML = html;
}

window.approveDeposit = async function(id) {
    if (!db) return;
    try {
        await db.collection('deposit_requests').doc(id).update({
            status: 'approved',
            approvedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showMessage("✅ Deposit approved", "success");
        refreshAdminPanel();
    } catch (e) {
        console.error(e);
        showMessage("Error approving", "error");
    }
};

window.rejectDeposit = async function(id) {
    if (!db) return;
    const reason = prompt("Reason for rejection:");
    if (!reason) return;
    
    try {
        await db.collection('deposit_requests').doc(id).update({
            status: 'rejected',
            rejectionReason: reason,
            rejectedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showMessage("❌ Deposit rejected", "warning");
        refreshAdminPanel();
    } catch (e) {
        console.error(e);
        showMessage("Error rejecting", "error");
    }
};

window.approveWithdrawal = async function(id) {
    if (!db) return;
    try {
        await db.collection('withdrawals').doc(id).update({
            status: 'approved',
            approvedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showMessage("✅ Withdrawal approved", "success");
        refreshAdminPanel();
    } catch (e) {
        console.error(e);
        showMessage("Error approving", "error");
    }
};

window.rejectWithdrawal = async function(id) {
    if (!db) return;
    const reason = prompt("Reason for rejection:");
    if (!reason) return;
    
    try {
        const doc = await db.collection('withdrawals').doc(id).get();
        const data = doc.data();
        
        await db.collection('users').doc(data.userId).update({
            'wallet.balances.USDT': firebase.firestore.FieldValue.increment(data.amount),
            'wallet.balances.BNB': firebase.firestore.FieldValue.increment(data.fee || 0)
        });
        
        await db.collection('withdrawals').doc(id).update({
            status: 'rejected',
            rejectionReason: reason,
            rejectedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showMessage("❌ Withdrawal rejected", "warning");
        refreshAdminPanel();
    } catch (e) {
        console.error(e);
        showMessage("Error rejecting", "error");
    }
};

// ===========================================
// 🕒 HISTORY MODAL مع زر تحديث يدوي
// ===========================================
function showTransactionHistory() {
    const modalContent = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal active" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-history"></i> ${getTranslation('history_title') || 'Transaction History'}</h3>
                    <div style="display:flex;gap:10px;">
                        <button class="refresh-history-btn" id="historyRefreshBtn" style="background:none;border:none;color:var(--quantum-blue);font-size:18px;cursor:pointer;">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="modal-close" onclick="closeModal()">×</button>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="history-tabs" id="historyTabs">
                        <button class="history-tab active" data-tab="all">${getTranslation('history_all') || 'All'}</button>
                        <button class="history-tab" data-tab="pending">${getTranslation('history_pending') || 'Pending'}</button>
                        <button class="history-tab" data-tab="completed">${getTranslation('history_completed') || 'Completed'}</button>
                        <button class="history-tab" data-tab="rejected">${getTranslation('history_rejected') || 'Rejected'}</button>
                    </div>
                    
                    <div id="historyContent" style="max-height: 400px; overflow-y: auto;"></div>
                    
                    <button class="btn-secondary" onclick="closeModal()" style="width: 100%; margin-top: 15px;">${getTranslation('close') || 'Close'}</button>
                </div>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    loadHistoryContent('all', 'all');
    
    document.getElementById('historyRefreshBtn').addEventListener('click', async function() {
        const btn = this.querySelector('i');
        btn.classList.add('fa-spin');
        lastHistoryCheckTime = 0;
        await checkPendingTransactions();
        const activeTab = document.querySelector('#historyTabs .history-tab.active')?.dataset.tab || 'all';
        const activeFilter = document.querySelector('#historyFilters .history-filter-btn.active')?.dataset.filter || 'all';
        loadHistoryContent(activeTab, activeFilter);
        btn.classList.remove('fa-spin');
        showMessage("History updated", "success");
    });
    
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
    
    setTimeout(() => {
        checkPendingTransactions();
    }, 500);
}

async function checkPendingTransactions() {
    if (!db || !walletData.transactionHistory) return;
    
    const now = Date.now();
    if (now - lastHistoryCheckTime < CONFIG.CACHE.HISTORY) {
        console.log("📦 Using cached history");
        return;
    }
    lastHistoryCheckTime = now;
    
    const pendingTxs = walletData.transactionHistory.filter(tx => 
        (tx.type === 'deposit' || tx.type === 'withdraw') && 
        tx.status === 'pending' &&
        tx.txId && !tx.txId.startsWith('temp_')
    );
    
    if (pendingTxs.length === 0) return;
    
    for (const tx of pendingTxs) {
        try {
            const collection = tx.type === 'deposit' ? 'deposit_requests' : 'withdrawals';
            const doc = await db.collection(collection).doc(tx.txId).get();
            
            if (doc.exists) {
                const data = doc.data();
                if (data.status !== tx.status) {
                    const index = walletData.transactionHistory.findIndex(t => t.txId === tx.txId);
                    if (index >= 0) {
                        walletData.transactionHistory[index].status = data.status;
                    }
                }
            }
        } catch (error) {
            console.error(`Error checking transaction ${tx.txId}:`, error);
        }
    }
}

function loadHistoryContent(tabType = 'all', filterType = 'all') {
    const historyContent = document.getElementById('historyContent');
    if (!historyContent) return;
    
    let transactions = walletData.transactionHistory || [];
    
    if (tabType === 'pending') {
        transactions = transactions.filter(tx => tx.status === 'pending');
    } else if (tabType === 'completed') {
        transactions = transactions.filter(tx => tx.status === 'completed' || tx.status === 'approved');
    } else if (tabType === 'rejected') {
        transactions = transactions.filter(tx => tx.status === 'rejected');
    }
    
    if (filterType !== 'all') {
        transactions = transactions.filter(tx => tx.type.includes(filterType));
    }
    
    if (transactions.length === 0) {
        historyContent.innerHTML = '<div class="history-empty"><i class="fas fa-history"></i><p>No transactions</p></div>';
        return;
    }
    
    let html = '';
    transactions.slice(0, 30).forEach(tx => {
        const sign = tx.amount > 0 ? '+' : '';
        const cls = tx.amount > 0 ? 'positive' : 'negative';
        const date = new Date(tx.timestamp).toLocaleString();
        
        html += `
            <div class="history-card">
                <div class="history-card-header">
                    <div class="history-card-icon ${tx.iconClass || 'swap'}">
                        <i class="fas ${tx.icon || 'fa-exchange-alt'}"></i>
                    </div>
                    <div class="history-card-details">
                        <div class="history-card-title">
                            <span class="history-card-type">${tx.type.replace('_',' ').toUpperCase()}</span>
                            <span class="history-card-amount ${cls}">${sign}${Math.abs(tx.amount).toLocaleString()} ${tx.currency}</span>
                        </div>
                        <div class="history-card-description">${tx.description || ''}</div>
                        <div class="history-card-footer">
                            <span class="history-card-date">${date}</span>
                            <span class="history-card-status ${tx.status}">${tx.status}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    historyContent.innerHTML = html;
}

// ===========================================
// ⏱️ BACKGROUND SERVICES
// ===========================================
function startBackgroundServices() {
    intervals.miningTimer = setInterval(() => {
        updateMiningTimer();
        checkAndNotifyRewards();
    }, 1000);
    
    intervals.localSaveTimer = setInterval(() => {
        if (userData.id && userData.isInitialized) {
            saveUserDataToLocalStorage();
        }
    }, CONFIG.FIREBASE.LOCAL_SAVE_INTERVAL);
    
    intervals.firebaseSaveTimer = setInterval(async () => {
        if (userData.id && userData.isInitialized && hasImportantChanges()) {
            await saveUserData();
        }
    }, CONFIG.FIREBASE.SAVE_INTERVAL);
}

function checkAndNotifyRewards() {
    const now = Date.now();
    
    if (walletData.mining.active && walletData.mining.nextReward) {
        const timeLeft = walletData.mining.nextReward - now;
        
        if (timeLeft > 0 && timeLeft < 5000 && !window.rewardNotified) {
            showMessage("⚡ Mining reward ready! Click Claim now!", "success", 4000);
            window.rewardNotified = true;
        }
        if (timeLeft > 10000) {
            window.rewardNotified = false;
        }
    }
}

// ===========================================
// 🎯 EVENT LISTENERS
// ===========================================
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
                const text = `🚀 Join Alien Musk Quantum Mining Platform!\n\n${elements.referralLinkInput.value}`;
                window.open(`https://t.me/share/url?url=${encodeURIComponent(elements.referralLinkInput.value)}&text=${encodeURIComponent(text)}`);
            }
        });
    }
    
    if (elements.whatsappShareBtn) {
        elements.whatsappShareBtn.addEventListener('click', () => {
            if (elements.referralLinkInput) {
                const text = `🚀 Join Alien Musk Quantum Mining Platform!\n\n${elements.referralLinkInput.value}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
            }
        });
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
    
    if (elements.scrollToTasksBtn) {
        elements.scrollToTasksBtn.addEventListener('click', scrollToTasks);
    }
    
    if (elements.boosterBtn) {
        elements.boosterBtn.addEventListener('click', boosterUpgrade);
    }
    
    if (elements.adminLogo) {
        let clickCount = 0;
        elements.adminLogo.addEventListener('click', () => {
            clickCount++;
            if (clickCount >= 5) {
                showAdminPanel();
                clickCount = 0;
            }
            setTimeout(() => clickCount = 0, 2000);
        });
    }
    
    initSupportIcon();
}

// ===========================================
// 🔄 UPDATE UI
// ===========================================
function updateUI() {
    updateUserUI();
    updateMiningDisplay();
    updateWalletUI();
    updateStakingDisplay();
    updateReferralDisplay();
    updateTasksDisplay();
    updateUITexts();
}

// ===========================================
// 📏 UTILITY FUNCTIONS
// ===========================================
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

// ===========================================
// 🚀 INITIALIZATION
// ===========================================
async function initAlienMuskApp() {
    console.log("🚀 Initializing Alien Musk Quantum v7.1 - ULTIMATE ECONOMY EDITION");
    
    if (appInitialized) {
        console.log("⚠️ Already initialized, skipping...");
        return;
    }
    appInitialized = true;
    
    try {
        cacheElements();
        await setupUser();
        await loadUserData();
        await fetchLivePrices();
        
        setupTransactionListener();
        setupDepositListener();
        setupEventListeners();
        await checkForReferral();
        
        updateAssetsIcons();
        addMemesSection();
        
        updateUI();
        startBackgroundServices();
        
        userData.isInitialized = true;
        console.log("✅ Platform initialized successfully");
        
        setTimeout(() => {
            showMessage("👽 Welcome to Alien Musk Quantum v7.1 - Ultimate Economy Edition!", "success");
        }, 800);
        
    } catch (error) {
        console.error("❌ Initialization failed:", error);
        showMessage("Failed to initialize platform", "error");
    }
}

// ===========================================
// 🎯 GLOBAL EXPORTS
// ===========================================
window.initAlienMuskApp = initAlienMuskApp;
window.switchPage = switchPage;
window.closeModal = closeModal;
window.showMessage = showMessage;
window.copyToClipboard = copyToClipboard;
window.handleMiningAction = handleMiningAction;
window.upgradeMiningLevel = upgradeMiningLevel;
window.handleTaskClick = handleTaskClick;
window.claimVipTask = claimVipTask;
window.boosterUpgrade = boosterUpgrade;
window.scrollToTasks = scrollToTasks;
window.openStakeModal = openStakeModal;
window.setMaxStakeAmount = setMaxStakeAmount;
window.confirmStaking = confirmStaking;
window.claimStakeReward = claimStakeReward;
window.cancelStake = cancelStake;
window.calculateStakeReward = calculateStakeReward;
window.updateStakeAmountFromSlider = updateStakeAmountFromSlider;
window.swapCurrencies = swapCurrencies;
window.setSwapPercentage = setSwapPercentage;
window.confirmSwap = confirmSwap;
window.updateSwapRates = updateSwapRates;
window.updateSwapCalculation = updateSwapCalculation;
window.openDepositModal = openDepositModal;
window.validateTxId = validateTxId;
window.submitDepositRequest = submitDepositRequest;
window.openWithdrawModal = openWithdrawModal;
window.submitWithdrawRequest = submitWithdrawRequest;
window.getPendingWithdrawalsTotal = getPendingWithdrawalsTotal;
window.showTransactionHistory = showTransactionHistory;
window.checkPendingTransactions = checkPendingTransactions;
window.loadHistoryContent = loadHistoryContent;
window.refreshAdminPanel = refreshAdminPanel;
window.approveDeposit = approveDeposit;
window.rejectDeposit = rejectDeposit;
window.approveWithdrawal = approveWithdrawal;
window.rejectWithdrawal = rejectWithdrawal;
window.setLanguage = setLanguage;
window.getTranslation = getTranslation;
window.selectWelcomeLanguage = selectWelcomeLanguage;
window.closeLanguageWelcome = closeLanguageWelcome;
window.formatNumber = formatNumber;

console.log("👽 Alien Musk Quantum v7.1 - ULTIMATE ECONOMY EDITION Ready!");
console.log("✅ On-Demand Listeners: 30 seconds");
console.log("✅ Smart Caching: User(5min), Prices(3h), History(10min)");
console.log("✅ Admin: Manual refresh with 30s cooldown");
console.log("✅ History: Manual refresh button");

// ===========================================
// 🏁 AUTO-START
// ===========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAlienMuskApp);
} else {
    initAlienMuskApp();
}

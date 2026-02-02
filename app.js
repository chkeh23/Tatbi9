// ملف app.js - المنطق الكامل للتطبيق

document.addEventListener('DOMContentLoaded', async function() {
    console.log('👽 Alien Mask App Loading...');
    
    // تهيئة Telegram WebApp
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.enableClosingConfirmation();
    
    // عناصر DOM الرئيسية
    const elements = {
        userName: document.getElementById('user-name'),
        userId: document.getElementById('user-id'),
        userAvatar: document.getElementById('user-avatar'),
        miningPower: document.getElementById('mining-power'),
        minedTokens: document.getElementById('mined-tokens'),
        mineBtn: document.getElementById('mine-btn'),
        referralLink: document.getElementById('referral-link'),
        copyLinkBtn: document.getElementById('copy-link'),
        adminTrigger: document.getElementById('admin-trigger-area'),
        adminModal: document.getElementById('admin-modal'),
        adminPassword: document.getElementById('admin-password'),
        adminLogin: document.getElementById('admin-login'),
        closePortal: document.querySelector('.close-portal'),
        boosterCards: document.querySelectorAll('.booster-card'),
        activateBoosters: document.querySelectorAll('.activate-booster'),
        missionClaims: document.querySelectorAll('.mission-claim'),
        navItems: document.querySelectorAll('.nav-item'),
        notifications: document.getElementById('notifications')
    };
    
    // بيانات المستخدم
    let userData = {
        telegramId: tg.initDataUnsafe.user?.id || 1653918641,
        username: tg.initDataUnsafe.user?.username || 'test_user',
        firstName: tg.initDataUnsafe.user?.first_name || 'مستخدم',
        lastName: tg.initDataUnsafe.user?.last_name || 'تيليجرام',
        photoUrl: tg.initDataUnsafe.user?.photo_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        balanceAMSK: 0,
        balanceUSDT: 0,
        miningPower: 100,
        totalMined: 0,
        referralCode: '',
        invitedBy: '',
        vipLevel: 0,
        activeBoosters: [],
        lastMineTime: null,
        dailyClicks: 0
    };
    
    // إعدادات النظام
    const config = {
        amskPrice: 0.0002,
        baseMiningPower: 100,
        tokensPer4Hours: 5000,
        referralReward: 20000,
        adminTelegramId: 1653918641,
        adminPassword: 'Tnru97',
        miningCooldown: 100 // مللي ثانية بين النقرات
    };
    
    // متغيرات التعدين
    let miningInterval = null;
    let isMining = false;
    let clickCount = 0;
    let lastClickTime = 0;
    let totalMined = 0;
    
    // أصوات
    const sounds = {
        mine: document.getElementById('mine-sound'),
        click: document.getElementById('click-sound'),
        success: document.getElementById('success-sound')
    };
    
    // ======================
    // 1. تهيئة التطبيق
    // ======================
    async function initApp() {
        console.log('🚀 تهيئة التطبيق...');
        
        // تحديث واجهة المستخدم
        updateUserUI();
        
        // توليد كود الإحالة
        generateReferralCode();
        
        // التحقق من الإحالة من رابط URL
        checkReferralFromUrl();
        
        // إعداد معالج الأحداث
        setupEventListeners();
        
        // بدء التعدين التلقائي
        startAutoMining();
        
        // تحميل بيانات المستخدم من Firebase
        await loadUserData();
        
        // تحديث الإحصائيات
        updateStats();
        
        // إظهار إشعار ترحيبي
        showNotification('مرحباً بك في أسطول Alien Mask! 👽', 'success');
    }
    
    // ======================
    // 2. تحديث واجهة المستخدم
    // ======================
    function updateUserUI() {
        // معلومات المستخدم
        elements.userName.textContent = `${userData.firstName} ${userData.lastName}`;
        elements.userId.textContent = `@${userData.username}`;
        elements.userAvatar.src = userData.photoUrl;
        
        // قوة التعدين
        const totalPower = calculateTotalMiningPower();
        elements.miningPower.textContent = `⚡ ${totalPower} طاقة/ثانية`;
        
        // الرصيد
        elements.minedTokens.textContent = formatNumber(userData.balanceAMSK + totalMined);
        
        // رابط الإحالة
        const referralUrl = `t.me/AlienMuskbot/Musk?start=ref-${userData.referralCode}`;
        elements.referralLink.textContent = referralUrl;
        
        // تحديث حالة VIP
        const vipElement = document.getElementById('vip-level');
        if (vipElement) {
            vipElement.textContent = getVipLevelName(userData.vipLevel);
        }
    }
    
    // ======================
    // 3. توليد كود الإحالة
    // ======================
    function generateReferralCode() {
        if (!userData.referralCode) {
            const code = `${userData.username.toUpperCase().substring(0, 3)}${Math.floor(100 + Math.random() * 900)}`;
            userData.referralCode = code;
            
            // حفظ في Firebase
            saveUserData();
        }
    }
    
    // ======================
    // 4. التحقق من رابط الإحالة
    // ======================
    function checkReferralFromUrl() {
        const startParam = tg.initDataUnsafe.start_param;
        if (startParam && startParam.startsWith('ref-')) {
            const referrerCode = startParam.replace('ref-', '');
            userData.invitedBy = referrerCode;
            
            // مكافأة المحيل
            rewardReferrer(referrerCode);
            
            showNotification('🎉 تم تسجيل دخولك عبر دعوة! +20,000 AMSK', 'success');
        }
    }
    
    // ======================
    // 5. مكافأة المحيل
    // ======================
    async function rewardReferrer(referrerCode) {
        try {
            // البحث عن المحيل في Firebase
            const usersRef = collection(window.db, 'users');
            const q = query(usersRef, where('referralCode', '==', referrerCode));
            // ... كود البحث في Firebase
            
            // إضافة مكافأة 20,000 AMSK للمحيل
            // ... كود إضافة المكافأة
            
            // تسجيل الإحالة
            await saveReferral(referrerCode);
            
        } catch (error) {
            console.error('خطأ في مكافأة المحيل:', error);
        }
    }
    
    // ======================
    // 6. نظام التعدين
    // ======================
    function setupMining() {
        elements.mineBtn.addEventListener('click', handleMiningClick);
    }
    
    function handleMiningClick() {
        const now = Date.now();
        
        // التحقق من التبريد
        if (now - lastClickTime < config.miningCooldown) {
            return;
        }
        
        lastClickTime = now;
        clickCount++;
        
        // تشغيل الصوت
        playSound(sounds.click);
        
        // تأثير زر التعدين
        elements.mineBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            elements.mineBtn.style.transform = 'scale(1)';
        }, 100);
        
        // إضافة التعدين
        const minedThisClick = calculateMinedPerClick();
        totalMined += minedThisClick;
        
        // تحديث العداد
        updateMiningDisplay();
        
        // تحديث المهام اليومية
        updateDailyTasks();
        
        // إظهار تأثير مرئي
        createMiningEffect();
        
        // حفظ البيانات كل 10 نقرات
        if (clickCount % 10 === 0) {
            saveMiningProgress();
        }
    }
    
    function calculateMinedPerClick() {
        const base = 1; // AMSK لكل نقرة
        const powerMultiplier = calculateTotalMiningPower() / 100;
        const boosterMultiplier = calculateBoosterMultiplier();
        
        return base * powerMultiplier * boosterMultiplier;
    }
    
    function calculateTotalMiningPower() {
        let power = config.baseMiningPower;
        
        // إضافة قوة المعززات النشطة
        userData.activeBoosters.forEach(booster => {
            power *= booster.multiplier;
        });
        
        // إضافة قوة VIP
        power *= (1 + (userData.vipLevel * 0.1));
        
        return Math.round(power);
    }
    
    function calculateBoosterMultiplier() {
        let multiplier = 1;
        userData.activeBoosters.forEach(booster => {
            multiplier *= booster.multiplier;
        });
        return multiplier;
    }
    
    function updateMiningDisplay() {
        elements.minedTokens.textContent = formatNumber(userData.balanceAMSK + totalMined);
        
        // تحديث معدل الإنتاج
        const hourlyRate = (calculateMinedPerClick() * 3600) / (config.miningCooldown || 100);
        document.querySelector('.rate-value').textContent = formatNumber(hourlyRate * 4);
    }
    
    function createMiningEffect() {
        const effect = document.createElement('div');
        effect.className = 'mining-effect';
        effect.innerHTML = `+${formatNumber(calculateMinedPerClick())} AMSK`;
        effect.style.cssText = `
            position: fixed;
            top: ${event.clientY}px;
            left: ${event.clientX}px;
            color: var(--energy-green);
            font-weight: bold;
            font-size: 14px;
            pointer-events: none;
            z-index: 1000;
            text-shadow: 0 0 10px var(--alien-green);
            animation: floatUp 1s ease-out forwards;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            document.body.removeChild(effect);
        }, 1000);
        
        // إضافة CSS للـanimation
        if (!document.querySelector('#mining-effect-style')) {
            const style = document.createElement('style');
            style.id = 'mining-effect-style';
            style.textContent = `
                @keyframes floatUp {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(-50px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // ======================
    // 7. التعدين التلقائي
    // ======================
    function startAutoMining() {
        // إضافة AMSK كل 4 ساعات
        miningInterval = setInterval(() => {
            const autoMined = config.tokensPer4Hours * (calculateTotalMiningPower() / 100);
            totalMined += autoMined;
            
            // تحديث الواجهة
            updateMiningDisplay();
            
            // إشعار بالمكافأة
            showNotification(`🕒 تم تعدين ${formatNumber(autoMined)} AMSK تلقائياً!`, 'info');
            
            // حفظ التقدم
            saveMiningProgress();
            
        }, 4 * 60 * 60 * 1000); // كل 4 ساعات
    }
    
    // ======================
    // 8. نظام المعززات
    // ======================
    function setupBoosters() {
        elements.activateBoosters.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                const card = this.closest('.booster-card');
                const boostValue = parseFloat(card.dataset.boost);
                const priceText = card.querySelector('.booster-price').textContent;
                const price = parseInt(priceText.match(/\d+/)[0]);
                
                activateBooster(index, boostValue, price);
            });
        });
    }
    
    function activateBooster(boosterId, multiplier, cost) {
        // التحقق من الرصيد
        if (userData.balanceAMSK + totalMined < cost) {
            showNotification('رصيدك غير كافي لشراء هذا المعزز!', 'error');
            return;
        }
        
        // خصم التكلفة
        totalMined -= cost;
        if (totalMined < 0) {
            userData.balanceAMSK += totalMined;
            totalMined = 0;
        }
        
        // إضافة المعزز
        userData.activeBoosters.push({
            id: boosterId,
            multiplier: multiplier,
            activatedAt: Date.now(),
            duration: 24 * 60 * 60 * 1000 // 24 ساعة
        });
        
        // تحديث الواجهة
        updateUserUI();
        
        // إشعار النجاح
        showNotification(`✅ تم تفعيل معزز الطاقة! القوة ×${multiplier}`, 'success');
        
        // تشغيل الصوت
        playSound(sounds.success);
        
        // حفظ البيانات
        saveUserData();
    }
    
    // ======================
    // 9. المهام اليومية
    // ======================
    function updateDailyTasks() {
        // تحديث عداد النقرات
        const miningTask = document.querySelector('.mission-mining .progress-text');
        if (miningTask) {
            const current = parseInt(miningTask.textContent.split('/')[0]) || 0;
            miningTask.textContent = `${current + 1}/50`;
            
            const progress = ((current + 1) / 50) * 100;
            const progressFill = document.querySelector('.mission-mining .progress-fill');
            if (progressFill) {
                progressFill.style.width = `${progress}%`;
            }
            
            // إذا اكتملت المهمة
            if (current + 1 >= 50) {
                const claimBtn = document.querySelector('.mission-mining .mission-claim');
                if (claimBtn) {
                    claimBtn.disabled = false;
                    claimBtn.innerHTML = '<i class="fas fa-gift"></i> ادعي المكافأة';
                }
            }
        }
    }
    
    function setupMissionClaims() {
        elements.missionClaims.forEach(btn => {
            btn.addEventListener('click', function() {
                if (!this.disabled) {
                    claimMissionReward(this);
                }
            });
        });
    }
    
    function claimMissionReward(button) {
        const rewardText = button.closest('.mission-card').querySelector('.mission-reward span').textContent;
        const rewardAmount = parseInt(rewardText.match(/\d+/)[0]);
        
        // إضافة المكافأة
        totalMined += rewardAmount;
        
        // تحديث الواجهة
        updateUserUI();
        
        // تعطيل الزر
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-check"></i> مكتمل';
        
        // إشعار النجاح
        showNotification(`🎁 حصلت على ${rewardAmount} AMSK من المهمة!`, 'success');
        
        // تشغيل الصوت
        playSound(sounds.success);
        
        // حفظ البيانات
        saveMiningProgress();
    }
    
    // ======================
    // 10. نظام النسخ
    // ======================
    function setupCopyLink() {
        elements.copyLinkBtn.addEventListener('click', function() {
            const text = elements.referralLink.textContent;
            
            // استخدام Clipboard API إذا متوفر
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text)
                    .then(() => {
                        showNotification('✅ تم نسخ رابط الدعوة!', 'success');
                        this.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
                        setTimeout(() => {
                            this.innerHTML = '<i class="fas fa-copy"></i> نسخ';
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('خطأ في النسخ:', err);
                        fallbackCopy(text);
                    });
            } else {
                fallbackCopy(text);
            }
        });
    }
    
    function fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showNotification('✅ تم نسخ رابط الدعوة!', 'success');
            elements.copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
            setTimeout(() => {
                elements.copyLinkBtn.innerHTML = '<i class="fas fa-copy"></i> نسخ';
            }, 2000);
        } catch (err) {
            console.error('خطأ في النسخ:', err);
            showNotification('❌ فشل نسخ الرابط', 'error');
        }
        
        document.body.removeChild(textArea);
    }
    
    // ======================
    // 11. لوحة المشرف
    // ======================
    function setupAdminPanel() {
        let clickCount = 0;
        let lastClickTime = 0;
        
        elements.adminTrigger.addEventListener('click', function(e) {
            const now = Date.now();
            
            // إعادة التعيين إذا مر أكثر من ثانيتين
            if (now - lastClickTime > 2000) {
                clickCount = 0;
            }
            
            lastClickTime = now;
            clickCount++;
            
            // إذا وصل لـ10 نقرات
            if (clickCount >= 10) {
                elements.adminModal.style.display = 'block';
                clickCount = 0;
                
                // تأثير دخول
                showNotification('🔐 تم فتح بوابة القيادة العليا', 'info');
            }
        });
        
        // زر الدخول للمشرف
        elements.adminLogin.addEventListener('click', function() {
            const password = elements.adminPassword.value;
            
            if (password === config.adminPassword && userData.telegramId === config.adminTelegramId) {
                // دخول ناجح
                showAdminDashboard();
                showNotification('👑 مرحباً بك أيها القائد الأعلى!', 'success');
            } else {
                showNotification('❌ كلمة المرور أو الهوية غير صحيحة!', 'error');
            }
        });
        
        // إغلاق البوابة
        elements.closePortal.addEventListener('click', function() {
            elements.adminModal.style.display = 'none';
            elements.adminPassword.value = '';
        });
        
        // إغلاق بالنقر خارج الصندوق
        elements.adminModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                elements.adminPassword.value = '';
            }
        });
    }
    
    function showAdminDashboard() {
        const form = document.querySelector('.access-form');
        const dashboard = document.querySelector('.admin-dashboard');
        
        form.style.display = 'none';
        dashboard.style.display = 'block';
        
        // تحميل لوحة التحكم
        loadAdminDashboard();
    }
    
    async function loadAdminDashboard() {
        const dashboard = document.querySelector('.admin-dashboard');
        
        dashboard.innerHTML = `
            <div class="admin-sections">
                <div class="admin-section">
                    <h4><i class="fas fa-download"></i> طلبات الإيداع المعلقة</h4>
                    <div class="pending-deposits" id="pending-deposits">
                        <div class="loading-spinner">
                            <div class="spinner"></div>
                            جاري تحميل البيانات...
                        </div>
                    </div>
                </div>
                
                <div class="admin-section">
                    <h4><i class="fas fa-upload"></i> طلبات السحب المعلقة</h4>
                    <div class="pending-withdrawals" id="pending-withdrawals">
                        <div class="loading-spinner">
                            <div class="spinner"></div>
                            جاري تحميل البيانات...
                        </div>
                    </div>
                </div>
                
                <div class="admin-section">
                    <h4><i class="fas fa-users-cog"></i> إدارة المستخدمين</h4>
                    <div class="user-management">
                        <div class="search-box">
                            <input type="text" id="search-user" placeholder="ابحث باسم المستخدم أو المعرف" class="search-input">
                            <button id="search-btn" class="search-btn">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                        <div class="user-actions">
                            <button class="action-btn add-balance">
                                <i class="fas fa-plus-circle"></i> إضافة رصيد
                            </button>
                            <button class="action-btn remove-balance">
                                <i class="fas fa-minus-circle"></i> خصم رصيد
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="admin-section stats-section">
                    <h4><i class="fas fa-chart-bar"></i> إحصائيات النظام</h4>
                    <div class="system-stats">
                        <div class="stat-item">
                            <span class="stat-label">إجمالي المستخدمين:</span>
                            <span class="stat-value" id="total-users">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">إجمالي الإيداعات:</span>
                            <span class="stat-value" id="total-deposits">0 USDT</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">إجمالي السحوبات:</span>
                            <span class="stat-value" id="total-withdrawals">0 USDT</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">إجمالي AMSK الموزعة:</span>
                            <span class="stat-value" id="total-amsk">0</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="admin-actions">
                <button id="refresh-data" class="admin-btn refresh-btn">
                    <i class="fas fa-sync-alt"></i> تحديث البيانات
                </button>
                <button id="export-data" class="admin-btn export-btn">
                    <i class="fas fa-file-export"></i> تصدير البيانات
                </button>
                <button id="send-notification" class="admin-btn notify-btn">
                    <i class="fas fa-bell"></i> إرسان إشعار
                </button>
            </div>
        `;
        
        // إضافة CSS للوحة التحكم
        const adminCSS = `
            <style>
                .admin-sections {
                    display: grid;
                    gap: 20px;
                    margin-bottom: 20px;
                }
                
                .admin-section {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 23, 68, 0.3);
                    border-radius: 10px;
                    padding: 15px;
                }
                
                .admin-section h4 {
                    color: var(--danger-red);
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .loading-spinner {
                    text-align: center;
                    padding: 20px;
                    color: var(--quantum-cyan);
                }
                
                .spinner {
                    width: 30px;
                    height: 30px;
                    border: 3px solid rgba(255, 23, 68, 0.3);
                    border-top-color: var(--danger-red);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 10px;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .search-box {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 15px;
                }
                
                .search-input {
                    flex: 1;
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid var(--danger-red);
                    border-radius: 5px;
                    color: white;
                }
                
                .search-btn {
                    background: var(--danger-red);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                }
                
                .user-actions {
                    display: flex;
                    gap: 10px;
                }
                
                .action-btn {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    border-radius: 5px;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                }
                
                .add-balance { background: var(--energy-green); }
                .remove-balance { background: var(--danger-red); }
                
                .system-stats {
                    display: grid;
                    gap: 10px;
                }
                
                .stat-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 5px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .stat-label {
                    color: var(--star-white);
                }
                
                .stat-value {
                    color: var(--hologram-teal);
                    font-weight: bold;
                }
                
                .admin-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }
                
                .admin-btn {
                    flex: 1;
                    padding: 12px;
                    border: none;
                    border-radius: 5px;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-weight: bold;
                }
                
                .refresh-btn { background: var(--quantum-cyan); }
                .export-btn { background: var(--plasma-purple); }
                .notify-btn { background: var(--warp-yellow); color: black; }
            </style>
        `;
        
        dashboard.insertAdjacentHTML('beforeend', adminCSS);
    }
    
    // ======================
    // 12. التنقل بين الصفحات
    // ======================
    function setupNavigation() {
        elements.navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // إزالة النشاط من جميع العناصر
                elements.navItems.forEach(el => el.classList.remove('active'));
                
                // إضافة النشاط للعنصر الحالي
                this.classList.add('active');
                
                // تحميل الصفحة المطلوبة
                const page = this.dataset.page;
                loadPage(page);
            });
        });
    }
    
    function loadPage(page) {
        // إخفاء كل المحتوى
        document.querySelectorAll('.page-content').forEach(el => {
            el.style.display = 'none';
        });
        
        // إظهار المحتوى المطلوب
        const contentId = `${page}-content`;
        const content = document.getElementById(contentId);
        
        if (!content) {
            // إنشاء المحتوى الديناميكي
            createPageContent(page);
        } else {
            content.style.display = 'block';
        }
        
        // تحديث عنوان الصفحة
        updatePageTitle(page);
    }
    
    function createPageContent(page) {
        // سيتم إضافة محتوى صفحات Staking و Wallet هنا
        console.log(`تحميل صفحة: ${page}`);
        
        // مثال لصفحة Staking
        if (page === 'staking') {
            // إنشاء محتوى الستاكنج
        }
        
        if (page === 'wallet') {
            // إنشاء محتوى المحفظة
        }
    }
    
    // ======================
    // 13. Firebase Functions
    // ======================
    async function loadUserData() {
        try {
            // التحقق من اتصال Firebase
            if (!window.db) {
                console.warn('Firebase غير متصل، استخدام البيانات المحلية');
                return;
            }
            
            const userRef = doc(collection(window.db, 'users'), userData.telegramId.toString());
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                const data = userSnap.data();
                userData = { ...userData, ...data };
                console.log('✅ تم تحميل بيانات المستخدم:', userData);
            } else {
                // إنشاء مستخدم جديد
                await saveUserData();
                console.log('🆕 تم إنشاء مستخدم جديد');
            }
            
        } catch (error) {
            console.error('❌ خطأ في تحميل بيانات المستخدم:', error);
        }
    }
    
    async function saveUserData() {
        try {
            if (!window.db) return;
            
            const userRef = doc(collection(window.db, 'users'), userData.telegramId.toString());
            await setDoc(userRef, {
                ...userData,
                lastLogin: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }, { merge: true });
            
            console.log('💾 تم حفظ بيانات المستخدم');
            
        } catch (error) {
            console.error('❌ خطأ في حفظ بيانات المستخدم:', error);
        }
    }
    
    async function saveMiningProgress() {
        try {
            if (!window.db) return;
            
            const userRef = doc(collection(window.db, 'users'), userData.telegramId.toString());
            await updateDoc(userRef, {
                balanceAMSK: userData.balanceAMSK + totalMined,
                totalMined: (userData.totalMined || 0) + totalMined,
                lastMineTime: new Date().toISOString(),
                dailyClicks: clickCount
            });
            
            // إعادة تعيين المؤقتات المحلية
            userData.balanceAMSK += totalMined;
            userData.totalMined += totalMined;
            totalMined = 0;
            clickCount = 0;
            
        } catch (error) {
            console.error('❌ خطأ في حفظ تقدم التعدين:', error);
        }
    }
    
    async function saveReferral(referrerCode) {
        try {
            if (!window.db) return;
            
            const referralRef = doc(collection(window.db, 'referrals'));
            await setDoc(referralRef, {
                inviterCode: referrerCode,
                invitedCode: userData.referralCode,
                invitedId: userData.telegramId,
                rewardGiven: false,
                createdAt: new Date().toISOString()
            });
            
        } catch (error) {
            console.error('❌ خطأ في حفظ الإحالة:', error);
        }
    }
    
    // ======================
    // 14. وظائف مساعدة
    // ======================
    function formatNumber(num) {
        return Math.round(num).toLocaleString('ar-EG');
    }
    
    function getVipLevelName(level) {
        const levels = ['مبتدئ', 'فضائي', 'قائد', 'إمبراطور', 'أسطورة'];
        return levels[level] || levels[0];
    }
    
    function updateStats() {
        // تحديث إحصائيات المستخدم
        const rankElement = document.querySelector('.rank-card .stat-value');
        if (rankElement) {
            const rank = Math.floor(Math.random() * 1000) + 1;
            rankElement.textContent = `#${rank}`;
        }
        
        const invitesElement = document.querySelector('.invites-card .stat-value');
        if (invitesElement) {
            const invites = Math.floor(Math.random() * 20);
            invitesElement.textContent = `${invites} قادة`;
        }
        
        const rewardsElement = document.querySelector('.rewards-card .stat-value');
        if (rewardsElement) {
            const rewards = invitesElement ? parseInt(invitesElement.textContent) * 20000 : 0;
            rewardsElement.textContent = `${formatNumber(rewards)} AMSK`;
        }
    }
    
    function playSound(sound) {
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log('لا يمكن تشغيل الصوت:', e));
        }
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                ${message}
            </div>
        `;
        
        elements.notifications.appendChild(notification);
        
        // إزالة الإشعار بعد 3 ثواني
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
        // إضافة animation للخروج
        if (!document.querySelector('#notification-out-style')) {
            const style = document.createElement('style');
            style.id = 'notification-out-style';
            style.textContent = `
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function setupEventListeners() {
        setupMining();
        setupBoosters();
        setupMissionClaims();
        setupCopyLink();
        setupAdminPanel();
        setupNavigation();
        
        // حفظ البيانات عند إغلاق الصفحة
        window.addEventListener('beforeunload', saveMiningProgress);
        
        // تحديث البيانات كل دقيقة
        setInterval(updateStats, 60000);
    }
    
    // ======================
    // 15. بدء التطبيق
    // ======================
    initApp();
});

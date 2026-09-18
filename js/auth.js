/**
 * Sumair Tools — Authentication & Instant Download Delivery Engine
 * Engineered by Sumair Ali Siddiqui
 * All Rights Reserved (c) 2026
 */

(function () {
    'use strict';

    var currentUser = null;

    function showToast(message, isError) {
        var toast = document.getElementById('st-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'st-toast';
            toast.className = 'fixed bottom-6 right-6 z-[9999] px-5 py-3.5 rounded-2xl font-mono text-xs font-bold transition-all transform duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)] border';
            document.body.appendChild(toast);
        }

        if (isError) {
            toast.className = 'fixed bottom-6 right-6 z-[9999] px-5 py-3.5 rounded-2xl font-mono text-xs font-bold transition-all transform duration-300 shadow-[0_10px_30px_rgba(255,0,60,0.4)] border border-crimson bg-[#150508] text-white translate-y-0 opacity-100 max-w-sm';
            toast.innerHTML = '<span class="text-crimson mr-2">✕</span> ' + message;
            if (window.AudioFX && typeof AudioFX.error === 'function') AudioFX.error();
        } else {
            toast.className = 'fixed bottom-6 right-6 z-[9999] px-5 py-3.5 rounded-2xl font-mono text-xs font-bold transition-all transform duration-300 shadow-[0_10px_30px_rgba(34,197,94,0.4)] border border-emerald-500/50 bg-[#05150a] text-white translate-y-0 opacity-100 max-w-sm';
            toast.innerHTML = '<span class="text-emerald-400 mr-2">✓</span> ' + message;
            if (window.AudioFX && typeof AudioFX.success === 'function') AudioFX.success();
        }

        clearTimeout(toast._timer);
        toast._timer = setTimeout(function () {
            toast.classList.add('opacity-0', 'translate-y-4');
        }, 5000);
    }

    // --- Modal Controls ---
    window.openAuthModal = function (defaultTab) {
        // If user is already logged in, show their download vault directly!
        if (currentUser) {
            showLicenseDeliveryScreen(currentUser);
            return;
        }

        var modal = document.getElementById('st-auth-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            switchAuthTab(defaultTab || 'signin');
            if (window.AudioFX) AudioFX.click();
        }
    };

    window.closeAuthModal = function () {
        var modal = document.getElementById('st-auth-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    };

    window.switchAuthTab = function (tab) {
        var tabSignIn = document.getElementById('auth-tab-signin');
        var tabSignUp = document.getElementById('auth-tab-signup');
        var tabForgot = document.getElementById('auth-tab-forgot');
        var tabDelivery = document.getElementById('auth-tab-delivery');

        var btnSignIn = document.getElementById('tab-btn-signin');
        var btnSignUp = document.getElementById('tab-btn-signup');

        if (tabSignIn) tabSignIn.classList.add('hidden');
        if (tabSignUp) tabSignUp.classList.add('hidden');
        if (tabForgot) tabForgot.classList.add('hidden');
        if (tabDelivery) tabDelivery.classList.add('hidden');

        if (btnSignIn) btnSignIn.className = 'flex-1 py-2.5 text-xs font-bold font-mono transition-all text-neutral-400 hover:text-white border-b-2 border-transparent';
        if (btnSignUp) btnSignUp.className = 'flex-1 py-2.5 text-xs font-bold font-mono transition-all text-neutral-400 hover:text-white border-b-2 border-transparent';

        if (tab === 'signin') {
            if (tabSignIn) tabSignIn.classList.remove('hidden');
            if (btnSignIn) btnSignIn.className = 'flex-1 py-2.5 text-xs font-bold font-mono transition-all text-white border-b-2 border-crimson bg-white/5';
        } else if (tab === 'signup') {
            if (tabSignUp) tabSignUp.classList.remove('hidden');
            if (btnSignUp) btnSignUp.className = 'flex-1 py-2.5 text-xs font-bold font-mono transition-all text-white border-b-2 border-crimson bg-white/5';
        } else if (tab === 'forgot') {
            if (tabForgot) tabForgot.classList.remove('hidden');
        } else if (tab === 'delivery') {
            if (tabDelivery) tabDelivery.classList.remove('hidden');
        }
    };

    // --- Show Download & Discord Key Screen ---
    function showLicenseDeliveryScreen(user) {
        var modal = document.getElementById('st-auth-modal');
        if (!modal) return;
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        // Show delivery / download tab
        switchAuthTab('delivery');

        var nameDisplay = document.getElementById('delivery-user-name');
        var emailDisplay = document.getElementById('delivery-user-email');

        if (nameDisplay) nameDisplay.innerText = (user.user_metadata && user.user_metadata.full_name) || user.email.split('@')[0];
        if (emailDisplay) emailDisplay.innerText = user.email;
    }

    // --- Operating System Detection & Tab Switcher ---
    window.getOperatingSystem = function () {
        var userAgent = window.navigator.userAgent || '';
        var platform = window.navigator.platform || '';
        if (/Mac|iPhone|iPod|iPad/i.test(platform) || /Macintosh|Mac OS X/i.test(userAgent)) {
            return 'mac';
        }
        return 'windows';
    };

    window.switchOsDownloadTab = function (os) {
        var winBtn = document.getElementById('os-tab-win-btn');
        var macBtn = document.getElementById('os-tab-mac-btn');
        var univBtn = document.getElementById('os-tab-univ-btn');

        var winCard = document.getElementById('os-card-windows');
        var macCard = document.getElementById('os-card-mac');
        var univCard = document.getElementById('os-card-universal');

        var winSteps = document.getElementById('os-steps-windows');
        var macSteps = document.getElementById('os-steps-mac');

        var activeClass = "px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-mono font-bold transition-all flex items-center gap-2 cursor-pointer border bg-crimson text-white shadow-[0_0_20px_rgba(255,0,60,0.5)] border-crimson";
        var inactiveClass = "px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-mono font-bold transition-all flex items-center gap-2 cursor-pointer border bg-white/5 text-neutral-400 hover:text-white border-white/10 hover:bg-white/10";

        if (os === 'mac') {
            if (macBtn) macBtn.className = activeClass;
            if (winBtn) winBtn.className = inactiveClass;
            if (univBtn) univBtn.className = inactiveClass;

            if (winCard) { winCard.style.setProperty('display', 'none', 'important'); winCard.classList.add('hidden'); }
            if (macCard) { macCard.style.setProperty('display', 'flex', 'important'); macCard.classList.remove('hidden'); }
            if (univCard) { univCard.style.setProperty('display', 'none', 'important'); univCard.classList.add('hidden'); }

            if (winSteps) { winSteps.style.setProperty('display', 'none', 'important'); winSteps.classList.add('hidden'); }
            if (macSteps) { macSteps.style.setProperty('display', 'block', 'important'); macSteps.classList.remove('hidden'); }
        } else if (os === 'universal') {
            if (univBtn) univBtn.className = activeClass;
            if (winBtn) winBtn.className = inactiveClass;
            if (macBtn) macBtn.className = inactiveClass;

            if (winCard) { winCard.style.setProperty('display', 'none', 'important'); winCard.classList.add('hidden'); }
            if (macCard) { macCard.style.setProperty('display', 'none', 'important'); macCard.classList.add('hidden'); }
            if (univCard) { univCard.style.setProperty('display', 'flex', 'important'); univCard.classList.remove('hidden'); }

            if (winSteps) { winSteps.style.setProperty('display', 'block', 'important'); winSteps.classList.remove('hidden'); }
            if (macSteps) { macSteps.style.setProperty('display', 'none', 'important'); macSteps.classList.add('hidden'); }
        } else {
            if (winBtn) winBtn.className = activeClass;
            if (macBtn) macBtn.className = inactiveClass;
            if (univBtn) univBtn.className = inactiveClass;

            if (winCard) { winCard.style.setProperty('display', 'flex', 'important'); winCard.classList.remove('hidden'); }
            if (macCard) { macCard.style.setProperty('display', 'none', 'important'); macCard.classList.add('hidden'); }
            if (univCard) { univCard.style.setProperty('display', 'none', 'important'); univCard.classList.add('hidden'); }

            if (winSteps) { winSteps.style.setProperty('display', 'block', 'important'); winSteps.classList.remove('hidden'); }
            if (macSteps) { macSteps.style.setProperty('display', 'none', 'important'); macSteps.classList.add('hidden'); }
        }

        if (typeof AudioFX !== 'undefined' && AudioFX && typeof AudioFX.click === 'function') {
            AudioFX.click();
        }
    };


    // --- Centralized Download Button Click Handler ---
    window.handleDownloadClick = function (fileUrl, fileName) {
        if (!currentUser) {
            showToast('Please sign in or create an account to download.', false);
            openAuthModal('signin');
            return false;
        }

        var os = window.getOperatingSystem();
        var defaultUrl = (os === 'mac') ? 'SumairTools_v8.0_Mac.zip?v=8.0.0' : 'SumairTools_v8.0_Windows.zip?v=8.0.0';
        var defaultName = (os === 'mac') ? 'SumairTools_v8.0_Mac.zip' : 'SumairTools_v8.0_Windows.zip';
        var targetUrl = fileUrl || defaultUrl;
        var targetName = fileName || defaultName;

        var a = document.createElement('a');
        a.href = targetUrl;
        a.download = targetName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        if (window.AudioFX && typeof AudioFX.success === 'function') AudioFX.success();
        showToast('Download started for ' + targetName + '! Check your Downloads folder.', false);
        return true;
    };

    // --- Dynamically Update Verified Package Cards on Site ---
    function updateDownloadButtonsState(user) {
        var isAuth = Boolean(user);

        // Download Hub Section Cards (Direct Verified Packages)
        var cardWinText = document.getElementById('card-download-win-text');
        if (cardWinText) cardWinText.innerText = isAuth ? 'DOWNLOAD FOR WINDOWS (1-CLICK)' : 'DOWNLOAD FOR WINDOWS (1-CLICK)';

        var cardMacText = document.getElementById('card-download-mac-text');
        if (cardMacText) cardMacText.innerText = isAuth ? 'DOWNLOAD FOR macOS (1-CLICK)' : 'DOWNLOAD FOR macOS (1-CLICK)';

        var cardUniversalText = document.getElementById('card-download-universal-text');
        if (cardUniversalText) cardUniversalText.innerText = isAuth ? 'DOWNLOAD UNIVERSAL BUNDLE' : 'DOWNLOAD UNIVERSAL BUNDLE';

        var cardZxpText = document.getElementById('card-download-zxp-text');
        if (cardZxpText) cardZxpText.innerText = isAuth ? 'DOWNLOAD NOW (.ZXP)' : 'DOWNLOAD NOW (.ZXP)';
    }

    // --- Sign In Action ---
    window.handleSignIn = async function (e) {
        if (e) e.preventDefault();
        var emailInput = document.getElementById('signin-email');
        var passInput = document.getElementById('signin-password');
        var submitBtn = document.getElementById('signin-submit-btn');

        if (!emailInput || !passInput) return;
        var email = emailInput.value.trim();
        var password = passInput.value;

        if (!email || !password) {
            showToast('Please enter both email and password.', true);
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Verifying...</span>';
        }

        // 1. If Supabase configured, use live Supabase
        if (window.sbClient && window.ST_CONFIG && window.ST_CONFIG.isConfigured()) {
            try {
                var res = await window.sbClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (res.error) {
                    if (res.error.message.toLowerCase().includes('invalid login credentials')) {
                        showToast('Account not found or password incorrect. Click CREATE ACCOUNT above to register!', true);
                    } else {
                        showToast(res.error.message, true);
                    }
                    return;
                }

                currentUser = res.data.user;
                localStorage.setItem('ST_CURRENT_USER', JSON.stringify(currentUser));
                updateNavbarState(currentUser);
                showToast('Welcome back, ' + ((currentUser.user_metadata && currentUser.user_metadata.full_name) || currentUser.email) + '! Starting download...', false);
                closeAuthModal();
                handleDownloadClick();
                setTimeout(function () {
                    window.location.reload();
                }, 700);
                return;
            } catch (err) {
                showToast(err.message || 'Authentication error.', true);
                return;
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>SIGN IN</span>';
                }
            }
        }

        // 2. Standalone Mode (Zero-Server instant fallback)
        setTimeout(function () {
            var localUser = {
                id: 'usr_' + Math.abs(email.split('').reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)),
                email: email,
                user_metadata: { full_name: email.split('@')[0] }
            };
            localStorage.setItem('ST_CURRENT_USER', JSON.stringify(localUser));
            currentUser = localUser;
            updateNavbarState(localUser);
            showToast('Welcome back! Starting download...', false);
            closeAuthModal();
            handleDownloadClick();
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>SIGN IN</span>';
            }
            setTimeout(function () {
                window.location.reload();
            }, 700);
        }, 300);
    };

    // --- Sign Up Action ---
    window.handleSignUp = async function (e) {
        if (e) e.preventDefault();
        var nameInput = document.getElementById('signup-name');
        var emailInput = document.getElementById('signup-email');
        var passInput = document.getElementById('signup-password');
        var submitBtn = document.getElementById('signup-submit-btn');

        if (!emailInput || !passInput) return;
        var name = nameInput ? nameInput.value.trim() : '';
        var email = emailInput.value.trim();
        var password = passInput.value;

        if (!email || !password) {
            showToast('Please enter an email and password.', true);
            return;
        }

        if (password.length < 6) {
            showToast('Password must be at least 6 characters.', true);
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Creating Account...</span>';
        }

        // 1. If Supabase configured, use live Supabase
        if (window.sbClient && window.ST_CONFIG && window.ST_CONFIG.isConfigured()) {
            try {
                var res = await window.sbClient.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: { full_name: name || email.split('@')[0] },
                        emailRedirectTo: window.location.origin
                    }
                });

                if (res.error) {
                    showToast(res.error.message, true);
                    return;
                }

                if (res.data.user) {
                    currentUser = res.data.user;
                    localStorage.setItem('ST_CURRENT_USER', JSON.stringify(currentUser));
                    updateNavbarState(currentUser);

                    showToast('Account registered! Starting download...', false);
                    closeAuthModal();
                    handleDownloadClick();
                    setTimeout(function () {
                        window.location.reload();
                    }, 700);
                }
                return;
            } catch (err) {
                showToast(err.message || 'Sign up error.', true);
                return;
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>CREATE ACCOUNT & DOWNLOAD</span>';
                }
            }
        }

        // 2. Standalone Mode (Instant fallback)
        setTimeout(function () {
            var localUser = {
                id: 'usr_' + Math.abs(email.split('').reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)),
                email: email,
                user_metadata: { full_name: name || email.split('@')[0] }
            };
            localStorage.setItem('ST_CURRENT_USER', JSON.stringify(localUser));
            currentUser = localUser;
            updateNavbarState(localUser);
            showToast('Account registered! Starting download...', false);
            closeAuthModal();
            handleDownloadClick();
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>CREATE ACCOUNT & DOWNLOAD</span>';
            }
            setTimeout(function () {
                window.location.reload();
            }, 700);
        }, 400);
    };

    // --- Google OAuth (Official Direct Supabase Authentication) ---
    window.handleGoogleAuth = async function () {
        var activeBtn = (typeof event !== 'undefined' && event && event.currentTarget) 
            ? event.currentTarget 
            : document.querySelector('button[onclick*="handleGoogleAuth"]');
        var originalText = activeBtn ? activeBtn.innerHTML : '';
        if (activeBtn) {
            activeBtn.disabled = true;
            activeBtn.style.opacity = '0.7';
            activeBtn.innerHTML = '<span class="inline-block animate-spin mr-2">⏳</span> Redirecting to Google...';
        }

        function restoreBtn() {
            if (activeBtn) {
                activeBtn.disabled = false;
                activeBtn.style.opacity = '1';
                activeBtn.innerHTML = originalText;
            }
        }

        var redirectUrl = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
            ? (window.location.origin + window.location.pathname)
            : 'https://sumairtools.online/';

        if (window.sbClient && window.ST_CONFIG && window.ST_CONFIG.isConfigured()) {
            try {
                var res = await window.sbClient.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: redirectUrl
                    }
                });

                if (res.error) {
                    restoreBtn();
                    showToast(res.error.message, true);
                    return;
                }

                if (res.data && res.data.url) {
                    window.location.href = res.data.url;
                    return;
                }
            } catch (err) {
                restoreBtn();
                showToast(err.message || 'Google Auth connection error.', true);
                return;
            }
        } else {
            restoreBtn();
            // Standalone / Offline fallback
            var simEmail = prompt('Enter your Google email address to sign in:', 'sumairalisiddiqui@gmail.com');
            if (simEmail) {
                var localUser = {
                    id: 'usr_g_' + Math.abs(simEmail.split('').reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)),
                    email: simEmail,
                    user_metadata: { full_name: simEmail.split('@')[0] }
                };
                localStorage.setItem('ST_CURRENT_USER', JSON.stringify(localUser));
                currentUser = localUser;
                updateNavbarState(localUser);
                showToast('Welcome, ' + localUser.user_metadata.full_name + '!', false);
                showLicenseDeliveryScreen(localUser);
            }
        }
    };

    // --- Sign Out Action ---
    window.handleSignOut = async function () {
        if (window.sbClient && window.ST_CONFIG && window.ST_CONFIG.isConfigured()) {
            try { await window.sbClient.auth.signOut(); } catch (e) {}
        }
        localStorage.removeItem('ST_CURRENT_USER');
        currentUser = null;
        updateNavbarState(null);
        showToast('Signed out successfully.', false);
        closeAuthModal();
        if (window.closeDashboardModal) window.closeDashboardModal();
        setTimeout(function () {
            window.location.reload();
        }, 400);
    };

    // --- Update Navbar & Download Buttons State ---
    // --- Update Navbar & Download Buttons State ---
    function updateNavbarState(user) {
        currentUser = user;
        updateDownloadButtonsState(user);

        var navBtn = document.getElementById('nav-auth-btn');
        var container = document.getElementById('nav-user-container');
        var targetEl = container || navBtn;
        var mobileNavBtn = document.getElementById('mobile-nav-auth-btn');

        if (!targetEl) return;

        var isMasterAdmin = Boolean(user && user.email && user.email.trim().toLowerCase() === 'sumairalisiddiqui@gmail.com');

        if (user) {
            var displayName = (user.user_metadata && user.user_metadata.full_name) || user.email.split('@')[0];
            var initials = displayName.substring(0, 2).toUpperCase();

            targetEl.outerHTML = `
                <div id="nav-user-container" class="relative flex items-center gap-2 flex-shrink-0">
                    <div class="relative">
                        <button onclick="toggleUserDropdown(event)" class="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-display font-semibold text-white transition-all shadow-sm whitespace-nowrap flex-shrink-0 cursor-pointer">
                            <span class="w-5 h-5 rounded-full bg-crimson flex items-center justify-center text-[10px] text-white font-black">${initials}</span>
                            <span class="max-w-[80px] sm:max-w-[100px] truncate">${displayName}</span>
                            <svg class="w-3 h-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                        </button>
                        <div id="nav-user-dropdown" class="hidden absolute right-0 mt-2 w-56 rounded-2xl glass-panel border border-crimson/40 shadow-[0_15px_40px_rgba(0,0,0,0.95)] p-2 z-[999] backdrop-blur-2xl">
                            <div class="px-3 py-2 border-b border-white/10 mb-1">
                                <div class="text-[9px] text-neutral-500 font-mono">LOGGED IN AS</div>
                                <div class="text-xs text-white font-bold truncate">${user.email}</div>
                            </div>
                            ${isMasterAdmin ? `
                            <a href="admin.html" class="w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-bold text-crimson hover:bg-crimson/10 transition-all flex items-center gap-2 mb-1">
                                <span>🛡️</span> Admin Command Center
                            </a>` : ''}
                            <button onclick="openAuthModal(); hideUserDropdown();" class="w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-bold text-emerald-400 hover:bg-emerald-500/10 transition-all flex items-center gap-2 cursor-pointer">
                                <span>📦</span> Downloads & Setup
                            </button>
                            <button onclick="openDashboardModal(); hideUserDropdown();" class="w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-bold text-neutral-200 hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer">
                                <span>⚡</span> Full Dashboard
                            </button>
                            <button onclick="handleSignOut(); hideUserDropdown();" class="w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-bold text-neutral-400 hover:text-crimson hover:bg-crimson/10 transition-all flex items-center gap-2 mt-1 cursor-pointer">
                                <span>➔</span> Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            `;

            if (mobileNavBtn) {
                if (isMasterAdmin) {
                    mobileNavBtn.outerHTML = `
                        <div id="mobile-nav-user-container" class="flex flex-col gap-2">
                            <a href="admin.html" class="px-4 py-3 rounded-xl bg-crimson/30 hover:bg-crimson border border-crimson text-white flex items-center justify-between transition-all font-mono font-bold shadow-[0_0_20px_rgba(255,0,60,0.5)]">
                                <span class="flex items-center gap-2"><span>🛡️</span> Admin Command Center</span>
                                <span class="text-xs text-white">➔</span>
                            </a>
                            <a href="javascript:void(0)" id="mobile-nav-auth-btn" onclick="toggleMobileMenu(); openAuthModal();" class="px-4 py-3 rounded-xl bg-white/5 hover:bg-crimson/20 border border-white/5 hover:border-crimson/40 text-neutral-200 hover:text-white flex items-center justify-between transition-all font-mono font-bold">
                                <span>📦 Downloads (${displayName})</span>
                                <span class="text-xs text-crimson">➔</span>
                            </a>
                        </div>
                    `;
                } else {
                    mobileNavBtn.innerHTML = `<span>📦 Downloads (${displayName})</span><span class="text-xs text-crimson">➔</span>`;
                    mobileNavBtn.onclick = function () {
                        toggleMobileMenu();
                        openAuthModal();
                    };
                }
            }
        } else {
            var mobileUserContainer = document.getElementById('mobile-nav-user-container');
            if (mobileUserContainer) {
                mobileUserContainer.outerHTML = `
                    <div id="mobile-nav-user-container" class="flex flex-col gap-2 pt-2 border-t border-white/10">
                        <button onclick="toggleMobileMenu(); openAuthModal('signin');" class="w-full text-left px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-medium flex items-center justify-between cursor-pointer">
                            <span>🔑 Sign In</span>
                            <span class="text-neutral-400">➔</span>
                        </button>
                        <button onclick="toggleMobileMenu(); openAuthModal('signup');" class="w-full text-left px-4 py-2.5 rounded-xl bg-crimson/20 border border-crimson/40 text-white text-xs font-bold flex items-center justify-between cursor-pointer">
                            <span>✨ Create Account</span>
                            <span class="text-crimson">➔</span>
                        </button>
                    </div>
                `;
            }
            targetEl.outerHTML = `
                <div id="nav-user-container" class="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <button id="nav-signin-btn" onclick="openAuthModal('signin')" class="text-xs font-medium text-neutral-400 hover:text-white transition-colors px-2.5 py-1.5 cursor-pointer">
                        Sign In
                    </button>
                    <button id="nav-signup-btn" onclick="openAuthModal('signup')" class="text-xs font-semibold text-neutral-200 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 px-3.5 py-1.5 rounded-full transition-all shadow-sm cursor-pointer">
                        Create Account
                    </button>
                </div>
            `;
        }

        if (typeof window.detectAndRevealAdmin === 'function') {
            window.detectAndRevealAdmin();
        }
    }

    window.toggleUserDropdown = function (e) {
        if (e) e.stopPropagation();
        var dd = document.getElementById('nav-user-dropdown');
        if (dd) dd.classList.toggle('hidden');
    };

    window.hideUserDropdown = function () {
        var dd = document.getElementById('nav-user-dropdown');
        if (dd) dd.classList.add('hidden');
    };

    window.addEventListener('click', function () {
        hideUserDropdown();
    });

    // --- Init Session Check ---
    document.addEventListener('DOMContentLoaded', async function () {
        // 1. Synchronous local session restore (Prevents any flash of wrong state)
        var savedLocalUser = localStorage.getItem('ST_CURRENT_USER');
        if (savedLocalUser) {
            try {
                currentUser = JSON.parse(savedLocalUser);
                updateNavbarState(currentUser);
            } catch (e) {
                updateDownloadButtonsState(null);
            }
        } else {
            updateDownloadButtonsState(null);
        }

        // Auto-detect visitor's OS and activate the matching tab
        try {
            if (typeof window.switchOsDownloadTab === 'function' && typeof window.getOperatingSystem === 'function') {
                window.switchOsDownloadTab(window.getOperatingSystem());
            }
        } catch (e) {}

        // 2. Supabase Live Session Check & Listener
        if (window.sbClient && window.ST_CONFIG && window.ST_CONFIG.isConfigured()) {
            try {
                var sessionRes = await window.sbClient.auth.getSession();
                if (sessionRes.data && sessionRes.data.session && sessionRes.data.session.user) {
                    currentUser = sessionRes.data.session.user;
                    localStorage.setItem('ST_CURRENT_USER', JSON.stringify(currentUser));
                    updateNavbarState(currentUser);
                }

                // Attach real-time auth change listener
                window.sbClient.auth.onAuthStateChange(function (event, session) {
                    if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session && session.user) {
                        currentUser = session.user;
                        localStorage.setItem('ST_CURRENT_USER', JSON.stringify(currentUser));
                        updateNavbarState(currentUser);
                        if (window.location.hash && (window.location.hash.indexOf('access_token') !== -1 || window.location.search.indexOf('code=') !== -1)) {
                            var uName = (session.user.user_metadata && session.user.user_metadata.full_name) || session.user.email.split('@')[0];
                            showToast('Signed in successfully with Google! Welcome ' + uName, false);
                            if (window.history && window.history.replaceState) {
                                window.history.replaceState(null, '', window.location.pathname);
                            }
                        }
                    } else if (event === 'SIGNED_OUT') {
                        currentUser = null;
                        localStorage.removeItem('ST_CURRENT_USER');
                        updateNavbarState(null);
                    }
                });
            } catch (err) {
                console.warn('[ST Auth] Supabase session check notice:', err);
            }
        }
    });

    window.getCurrentUser = function () {
        return currentUser;
    };

})();

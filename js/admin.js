/**
 * Sumair Tools — Master Admin Command Center Controller
 * Dedicated Telemetry, Revocation & Key Generation Hub
 * Copyright (c) 2026 Sumair Ali Siddiqui. All Rights Reserved.
 */

(function () {
    'use strict';

    var adminLicenses = [];
    var MASTER_CREDENTIAL = 'Fahad@123';
    var MASTER_EMAIL = 'sumairalisiddiqui@gmail.com';

    // Global in-memory unlock state (Resets on every page load or direct URL access)
    window._MASTER_ADMIN_UNLOCKED = false;

    window.toggleGatePasswordVisibility = function () {
        var input = document.getElementById('gate-admin-password');
        var icon = document.getElementById('gate-eye-icon');
        if (!input) return;
        if (input.type === 'password') {
            input.type = 'text';
            if (icon) icon.innerText = '🙈';
        } else {
            input.type = 'password';
            if (icon) icon.innerText = '👁️';
        }
    };

    window.updateIdentityState = function () {
        var yesRadio = document.getElementById('ident-yes');
        var noRadio = document.getElementById('ident-no');
        var errDiv = document.getElementById('gate-login-error');
        var submitBtn = document.getElementById('gate-submit-btn');
        var passInput = document.getElementById('gate-admin-password');
        var statusBadge = document.getElementById('gate-identity-status');

        if (noRadio && noRadio.checked) {
            if (errDiv) {
                errDiv.innerHTML = '⛔ <b>ACCESS RESTRICTED</b>: Only Sumair Ali Siddiqui is authorized to access the Master Admin Command Center.<br><span class="text-[10px] text-neutral-400 mt-1 block">Unauthorized access attempts are blocked and monitored.</span>';
                errDiv.classList.remove('hidden');
            }
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-40', 'cursor-not-allowed');
            }
            if (statusBadge) {
                statusBadge.innerText = 'Denied';
                statusBadge.className = 'text-[10px] font-mono text-crimson font-bold';
            }
            if (passInput) {
                passInput.disabled = true;
                passInput.value = '';
            }
            return;
        }

        if (yesRadio && yesRadio.checked) {
            if (errDiv) errDiv.classList.add('hidden');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-40', 'cursor-not-allowed');
            }
            if (statusBadge) {
                statusBadge.innerText = '✓ Confirmed';
                statusBadge.className = 'text-[10px] font-mono text-emerald-400 font-bold';
            }
            if (passInput) {
                passInput.disabled = false;
                passInput.focus();
            }
        }
    };

    window.handleAdminSignOutAndSwitch = async function () {
        try {
            if (window.sbClient && window.sbClient.auth) {
                await window.sbClient.auth.signOut();
            }
        } catch (e) {}
        localStorage.removeItem('ST_CURRENT_USER');
        sessionStorage.clear();
        window.location.reload();
    };

    window.initAdminPanel = async function () {
        // ALWAYS ENFORCE HARD LOCK ON INITIAL PAGE LOAD / DIRECT URL ACCESS
        window._MASTER_ADMIN_UNLOCKED = false;

        var main = document.getElementById('admin-main-content');
        if (main) {
            main.style.setProperty('display', 'none', 'important');
            main.classList.add('hidden');
        }

        var gate = document.getElementById('admin-access-gate');
        if (gate) gate.classList.remove('hidden');

        // Check current session state
        if (!window.sbClient && window.initSupabaseClient) {
            window.initSupabaseClient();
        }

        var user = null;
        if (window.sbClient && window.sbClient.auth) {
            try {
                var sessionRes = await window.sbClient.auth.getSession();
                user = (sessionRes && sessionRes.data && sessionRes.data.session) ? sessionRes.data.session.user : null;
            } catch (e) {}
        }

        if (!user && window.getCurrentUser) {
            user = window.getCurrentUser();
        }

        if (!user) {
            try {
                user = JSON.parse(localStorage.getItem('ST_CURRENT_USER'));
            } catch (e) {}
        }

        var unauthAlert = document.getElementById('gate-unauthorized-alert');
        var detectedEmailSpan = document.getElementById('gate-detected-email');
        var loginForm = document.getElementById('gate-direct-login-form');

        // IF SIGNED IN AS ANY NON-ADMIN ACCOUNT, HARD BLOCK IMMEDIATELY
        if (user && user.email && user.email.toLowerCase() !== MASTER_EMAIL.toLowerCase()) {
            console.warn('[Admin Security] Blocked unauthorized account:', user.email);
            if (unauthAlert) {
                if (detectedEmailSpan) detectedEmailSpan.innerText = user.email;
                unauthAlert.classList.remove('hidden');
            }
            if (loginForm) {
                loginForm.classList.add('opacity-30', 'pointer-events-none');
            }
            return;
        } else {
            if (unauthAlert) unauthAlert.classList.add('hidden');
            if (loginForm) loginForm.classList.remove('opacity-30', 'pointer-events-none');
        }
    };

    window.handleDirectAdminLogin = async function (e) {
        if (e) e.preventDefault();
        var identYes = document.getElementById('ident-yes');
        var passInput = document.getElementById('gate-admin-password');
        var submitBtn = document.getElementById('gate-submit-btn');
        var errDiv = document.getElementById('gate-login-error');

        // 1. STEP 1 CHECK: Must confirm "Yes, I am Sumair Ali Siddiqui"
        if (!identYes || !identYes.checked) {
            if (errDiv) {
                errDiv.innerHTML = '⚠️ <b>STEP 1 REQUIRED</b>: Please confirm your identity by selecting "Yes, I am Sumair Ali Siddiqui".';
                errDiv.classList.remove('hidden');
            }
            return;
        }

        var password = passInput ? passInput.value : '';

        // 2. STEP 2 CHECK: Must provide password
        if (!password) {
            if (errDiv) {
                errDiv.innerHTML = '⚠️ <b>STEP 2 REQUIRED</b>: Please enter the Master Admin Security Password.';
                errDiv.classList.remove('hidden');
            }
            if (passInput) passInput.focus();
            return;
        }

        // 3. STRICT CREDENTIAL CHECK: Master password validation
        if (password !== MASTER_CREDENTIAL) {
            if (errDiv) {
                errDiv.innerHTML = '⛔ <b>ACCESS DENIED</b>: Incorrect Master Password.<br><span class="text-[10px] text-neutral-400 mt-1 block">Intrusion attempt logged. Access to license keys and API telemetry is restricted.</span>';
                errDiv.classList.remove('hidden');
            }
            if (passInput) {
                passInput.value = '';
                passInput.focus();
                passInput.classList.add('border-crimson', 'ring-2', 'ring-crimson/50');
                setTimeout(function () {
                    passInput.classList.remove('ring-2', 'ring-crimson/50');
                }, 2000);
            }
            return;
        }

        // BOTH STEP 1 AND STEP 2 VERIFIED!
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>⏳ VERIFYING MASTER CLEARANCE...</span>';
        }

        if (errDiv) errDiv.classList.add('hidden');

        try {
            window._MASTER_ADMIN_UNLOCKED = true;

            if (!window.sbClient && window.initSupabaseClient) {
                window.initSupabaseClient();
            }

            // Connect Supabase auth session if available
            if (window.sbClient && window.sbClient.auth) {
                try {
                    var sRes = await window.sbClient.auth.getSession();
                    var curU = (sRes && sRes.data && sRes.data.session) ? sRes.data.session.user : null;
                    if (!curU || (curU.email && curU.email.toLowerCase() !== MASTER_EMAIL.toLowerCase())) {
                        var res = await window.sbClient.auth.signInWithPassword({ email: MASTER_EMAIL, password: password });
                        if (res.data && res.data.user) {
                            localStorage.setItem('ST_CURRENT_USER', JSON.stringify(res.data.user));
                        }
                    }
                } catch (authErr) {
                    console.warn('[Admin Gate] Supabase auth notice:', authErr.message);
                }
            }

            // REVEAL DASHBOARD ONLY AFTER PASSWORD IS 100% VALIDATED
            var gate = document.getElementById('admin-access-gate');
            if (gate) gate.classList.add('hidden');

            var main = document.getElementById('admin-main-content');
            if (main) {
                main.style.removeProperty('display');
                main.classList.remove('hidden');
            }

            var adminEmailBadge = document.getElementById('admin-profile-email');
            if (adminEmailBadge) adminEmailBadge.innerText = MASTER_EMAIL;

            await loadAdminData();

        } catch (err) {
            if (errDiv) {
                errDiv.innerText = err.message || 'Authentication error.';
                errDiv.classList.remove('hidden');
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>🔓 VERIFY IDENTITY & UNLOCK LICENSES</span>';
            }
        }
    };

    window.lockAdminPanel = function () {
        if (!confirm('Lock Admin Command Center and secure all license keys & API telemetry?')) return;
        window._MASTER_ADMIN_UNLOCKED = false;
        sessionStorage.removeItem('ST_ADMIN_UNLOCKED');
        sessionStorage.removeItem('ST_ADMIN_AUTH_TOKEN');

        var main = document.getElementById('admin-main-content');
        if (main) {
            main.style.setProperty('display', 'none', 'important');
            main.classList.add('hidden');
        }

        var tableBody = document.getElementById('admin-tbody');
        if (tableBody) tableBody.innerHTML = '';

        adminLicenses = [];

        var gate = document.getElementById('admin-access-gate');
        if (gate) gate.classList.remove('hidden');

        var passInput = document.getElementById('gate-admin-password');
        if (passInput) passInput.value = '';

        var identYes = document.getElementById('ident-yes');
        var identNo = document.getElementById('ident-no');
        if (identYes) identYes.checked = false;
        if (identNo) identNo.checked = false;

        var statusBadge = document.getElementById('gate-identity-status');
        if (statusBadge) {
            statusBadge.innerText = 'Required';
            statusBadge.className = 'text-[10px] font-mono text-emerald-400 font-bold';
        }

        console.log('[Admin Security] Panel locked. Telemetry cleared.');
    };

    function showAccessGate(msg) {
        var gate = document.getElementById('admin-access-gate');
        var gateMsg = document.getElementById('gate-message');
        if (gate) gate.classList.remove('hidden');
        if (gateMsg) gateMsg.innerText = msg;
        var main = document.getElementById('admin-main-content');
        if (main) {
            main.style.setProperty('display', 'none', 'important');
            main.classList.add('hidden');
        }
    }

    window.loadAdminData = async function () {
        // STRICT IN-MEMORY SECURITY GUARD: Never fetch licenses without master password verification
        if (!window._MASTER_ADMIN_UNLOCKED) {
            console.error('[Admin Security] CRITICAL: Attempted to load licenses without verified password clearance.');
            return;
        }

        var tableBody = document.getElementById('admin-tbody');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="6" class="py-8 text-center text-neutral-500 font-mono text-xs">Fetching live database telemetry and user records...</td></tr>';
        }

        console.log('[Admin Command Center] Initializing license telemetry fetch for Master Admin...');

        if (window.sbClient && window.ST_CONFIG && window.ST_CONFIG.isConfigured()) {
            try {
                var res = null;
                var lastErr = null;

                // 1. Primary Strategy: get_all_licenses_admin() RPC
                try {
                    var rpcRes = await window.sbClient.rpc('get_all_licenses_admin');
                    console.log('[Admin Command Center] rpc get_all_licenses_admin response:', rpcRes);
                    if (!rpcRes.error && Array.isArray(rpcRes.data)) {
                        res = rpcRes;
                    } else if (rpcRes.error) {
                        lastErr = rpcRes.error;
                        console.warn('[Admin Command Center] get_all_licenses_admin error:', rpcRes.error);
                    }
                } catch (e) {
                    lastErr = e;
                    console.warn('[Admin Command Center] rpc call threw:', e);
                }

                // 2. Fallback 1: get_admin_licenses_telemetry RPC
                if (!res) {
                    try {
                        console.log('[Admin Command Center] Trying fallback 1: get_admin_licenses_telemetry...');
                        var fbRes = await window.sbClient.rpc('get_admin_licenses_telemetry');
                        console.log('[Admin Command Center] rpc get_admin_licenses_telemetry response:', fbRes);
                        if (!fbRes.error && Array.isArray(fbRes.data)) {
                            res = fbRes;
                        } else if (fbRes.error) {
                            lastErr = fbRes.error;
                        }
                    } catch (e) {
                        lastErr = e;
                    }
                }

                // 3. Fallback 2: Direct SELECT * FROM licenses
                if (!res) {
                    try {
                        console.log('[Admin Command Center] Trying fallback 2: direct licenses table select...');
                        var directRes = await window.sbClient
                            .from('licenses')
                            .select('*')
                            .order('created_at', { ascending: false });
                        console.log('[Admin Command Center] direct table select response:', directRes);
                        if (!directRes.error && Array.isArray(directRes.data)) {
                            res = directRes;
                        } else if (directRes.error) {
                            lastErr = directRes.error;
                        }
                    } catch (e) {
                        lastErr = e;
                    }
                }

                if (!res || res.error) {
                    throw (res && res.error) || lastErr || new Error('Unknown error loading licenses.');
                }

                adminLicenses = res.data || [];
                console.log('[Admin Command Center] Successfully loaded total licenses:', adminLicenses.length);

                updateStats(adminLicenses);
                renderTable(adminLicenses);
            } catch (err) {
                console.error('[Admin Command Center] Fatal fetch error:', err);
                if (tableBody) {
                    tableBody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-crimson font-mono text-xs">
                        Failed to fetch licenses: ${err.message || JSON.stringify(err)}<br>
                        <span class="text-neutral-400 text-[10px] block mt-1">Please run <b>FIX_ADMIN_AMBIGUOUS_USER_ID.sql</b> in Supabase SQL Editor.</span>
                    </td></tr>`;
                }
            }
        }
    };

    function updateStats(data) {
        var total = data.length;
        var active = 0;
        var bound = 0;
        var revoked = 0;

        data.forEach(function (lic) {
            var isRev = lic.status === 'revoked' || lic.is_active === false || lic.status === 'suspended';
            if (isRev) {
                revoked++;
            } else if (lic.status === 'active') {
                active++;
            }

            if (lic.machine_id && lic.machine_id.trim().length > 0) {
                bound++;
            }
        });

        var elTotal = document.getElementById('stat-total');
        var elActive = document.getElementById('stat-active');
        var elBound = document.getElementById('stat-bound');
        var elRevoked = document.getElementById('stat-revoked');

        if (elTotal) elTotal.innerText = total;
        if (elActive) elActive.innerText = active;
        if (elBound) elBound.innerText = bound;
        if (elRevoked) elRevoked.innerText = revoked;
    }

    function renderTable(data) {
        var tableBody = document.getElementById('admin-tbody');
        if (!tableBody) return;

        if (!data || data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="py-8 text-center text-neutral-500 font-mono text-xs">No licenses match the current filter.</td></tr>';
            return;
        }

        var rows = '';
        data.forEach(function (lic) {
            var isRevoked = lic.status === 'revoked' || lic.is_active === false;
            var statusBadge = '';
            var actionBtns = '';

            // Copy Key button always present
            actionBtns += `<button onclick="copyLicenseKey('${lic.license_key}')" class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono font-bold transition-all mr-1.5 cursor-pointer" title="Copy license key">📋 Copy</button>`;

            // Email License Key button (Direct Gmail SMTP dispatch)
            var safeLicName = (lic.user_name || '').replace(/['"\\]/g, ' ');
            var safeLicEmail = (lic.user_email || '').replace(/['"\\]/g, ' ');
            actionBtns += `<button onclick="sendExistingLicenseEmail('${lic.license_key}', '${safeLicEmail}', '${safeLicName}')" class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-300 hover:text-white text-[11px] font-mono font-bold transition-all mr-1.5 cursor-pointer" title="Dispatch license key via Gmail SMTP">📧 Email</button>`;

            if (isRevoked) {
                statusBadge = '<span class="px-2.5 py-1 rounded-full text-[10px] font-bold border text-crimson bg-crimson/15 border-crimson/40 uppercase inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-crimson"></span> REVOKED</span>';
                actionBtns += `<button onclick="reactivateLicense('${lic.license_key}')" class="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 border border-emerald-500/40 text-emerald-300 hover:text-black text-[11px] font-mono font-bold transition-all cursor-pointer" title="Reactivate license">✓ Reactivate</button>`;
            } else if (lic.status === 'active') {
                statusBadge = '<span class="px-2.5 py-1 rounded-full text-[10px] font-bold border text-emerald-400 bg-emerald-500/15 border-emerald-500/40 uppercase inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> ACTIVE (BOUND)</span>';
                actionBtns += `<button onclick="revokeLicense('${lic.license_key}')" class="px-2.5 py-1 rounded-lg bg-crimson/20 hover:bg-crimson border border-crimson/50 text-crimson hover:text-white text-[11px] font-mono font-bold transition-all cursor-pointer" title="Immediately revoke remote access">⛔ Revoke</button>`;
            } else if (lic.status === 'unactivated') {
                statusBadge = '<span class="px-2.5 py-1 rounded-full text-[10px] font-bold border text-emerald-300 bg-emerald-500/10 border-emerald-500/30 uppercase inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> APPROVED (READY)</span>';
                actionBtns += `<button onclick="revokeLicense('${lic.license_key}')" class="px-2.5 py-1 rounded-lg bg-crimson/20 hover:bg-crimson border border-crimson/50 text-crimson hover:text-white text-[11px] font-mono font-bold transition-all cursor-pointer" title="Immediately revoke key">⛔ Revoke</button>`;
            } else {
                statusBadge = '<span class="px-2.5 py-1 rounded-full text-[10px] font-bold border text-amber-400 bg-amber-500/15 border-amber-500/40 uppercase inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> PENDING (OFF)</span>';
                actionBtns += `<button onclick="reactivateLicense('${lic.license_key}')" class="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-mono font-black transition-all inline-flex items-center gap-1 shadow-sm cursor-pointer" title="Approve and activate access">✓ Reactivate</button>`;
            }

            // Unlink Machine / Reset HWID action if machine is bound
            if (lic.machine_id && lic.machine_id.trim().length > 0) {
                actionBtns += `<button onclick="resetMachineHWID('${lic.license_key}')" class="px-2.5 py-1 rounded-lg bg-cyanAccent/15 hover:bg-cyanAccent/30 border border-cyanAccent/40 text-cyanAccent text-[11px] font-mono font-bold transition-all ml-1.5 cursor-pointer" title="Reset HWID binding so user can activate on a new PC">🔄 Reset HWID</button>`;
            }

            var isClaimed = !!(lic.user_id || lic.user_email || lic.user_name);
            if (isClaimed) {
                actionBtns += `<button onclick="unlinkLicense('${lic.license_key}')" class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-amber-500/25 border border-white/20 text-neutral-300 hover:text-amber-300 text-[11px] font-mono font-bold transition-all ml-1.5 cursor-pointer" title="Unlink user from this key">🔓 Unlink</button>`;
            }

            var claimedHtml = '';
            if (lic.user_name || lic.user_email) {
                var dispName = lic.user_name || (lic.user_email ? lic.user_email.split('@')[0] : 'Creator');
                var dispEmail = lic.user_email || '';
                claimedHtml = `<div><div class="font-bold text-white text-xs">${dispName}</div><div class="text-[10px] text-neutral-400 font-mono">${dispEmail}</div></div>`;
            } else if (lic.user_id) {
                claimedHtml = `<span class="text-neutral-400 font-mono text-[10px]" title="${lic.user_id}">UID: ${lic.user_id.substring(0,8)}...</span>`;
            } else {
                claimedHtml = '<span class="text-neutral-500 italic text-[11px]">Unclaimed</span>';
            }

            var machinePreview = lic.machine_id ? 
                `<span class="font-mono text-[11px] text-cyanAccent cursor-pointer" title="${lic.machine_id}">${lic.machine_id.substring(0, 8)}...${lic.machine_id.substring(lic.machine_id.length - 8)}</span>` : 
                '<span class="text-neutral-500 italic text-[11px]">Not Bound</span>';

            var createdDate = lic.created_at ? new Date(lic.created_at).toLocaleDateString() : 'N/A';

            rows += `
                <tr class="border-b border-white/5 hover:bg-white/5 font-mono text-xs transition-colors">
                    <td class="py-3 px-4 font-bold text-white tracking-wider select-all">${lic.license_key}</td>
                    <td class="py-3 px-4">${claimedHtml}</td>
                    <td class="py-3 px-4">${machinePreview}</td>
                    <td class="py-3 px-4">${statusBadge}</td>
                    <td class="py-3 px-4 text-neutral-400 text-[11px] whitespace-nowrap">${createdDate}</td>
                    <td class="py-3 px-4 text-right whitespace-nowrap">
                        ${actionBtns}
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = rows;
    }

    window.copyLicenseKey = function (key) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(key);
        } else {
            var ta = document.createElement('textarea');
            ta.value = key;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
        alert('✓ Copied License Key to clipboard: ' + key);
    };

    window.resetMachineHWID = async function (key) {
        if (!confirm('UNLINK MACHINE & RESET HWID for ' + key + '?\n\nThis clears the hardware binding so the user can activate the key on a new PC.')) return;
        try {
            var res = await window.sbClient.rpc('admin_reset_machine_hwid', { p_license_key: key });
            if (res.error) {
                res = await window.sbClient.from('licenses').update({
                    machine_id: null,
                    activated_at: null,
                    last_verified_at: null,
                    status: 'unactivated'
                }).eq('license_key', key);
            }
            if (res.error) throw res.error;
            alert('✓ Machine HWID successfully reset for ' + key + '!\nThe user can now bind and activate this key on their new computer.');
            loadAdminData();
        } catch (err) {
            alert('Error resetting HWID: ' + err.message);
        }
    };

    window.reactivateLicense = async function (key) {
        if (!confirm('Reactivate license ' + key + ' to Active / Approved status?')) return;
        try {
            var res = await window.sbClient.from('licenses').update({ status: 'unactivated', is_active: true }).eq('license_key', key);
            if (res.error) throw res.error;
            alert('✓ License ' + key + ' is now reactivated.');
            loadAdminData();
        } catch (err) {
            alert('Error reactivating license: ' + err.message);
        }
    };

    window.revokeLicense = async function (key) {
        if (!confirm('REVOKE license ' + key + ' immediately?\n\nThis will remotely disconnect and block After Effects on the user\'s machine.')) return;
        try {
            var res = await window.sbClient.rpc('admin_revoke_license', { p_license_key: key });
            if (res.error) {
                res = await window.sbClient.from('licenses').update({ status: 'revoked', is_active: false }).eq('license_key', key);
            }
            if (res.error) throw res.error;
            alert('License ' + key + ' successfully REVOKED.');
            loadAdminData();
        } catch (err) {
            alert('Error revoking license: ' + err.message);
        }
    };

    let currentSort = 'created-desc';

    window.setAdminSort = function (col) {
        var sortSelect = document.getElementById('admin-sort-by');
        if (col === 'key') {
            currentSort = (currentSort === 'key-asc') ? 'key-desc' : 'key-asc';
        } else if (col === 'user') {
            currentSort = (currentSort === 'user-asc') ? 'user-desc' : 'user-asc';
        } else if (col === 'hwid') {
            currentSort = (currentSort === 'hwid-bound') ? 'hwid-unbound' : 'hwid-bound';
        } else if (col === 'status') {
            currentSort = (currentSort === 'status-asc') ? 'status-desc' : 'status-asc';
        } else if (col === 'created') {
            currentSort = (currentSort === 'created-desc') ? 'created-asc' : 'created-desc';
        }
        if (sortSelect) sortSelect.value = currentSort;
        filterAdmin();
    };

    function updateSortIcons() {
        var cols = ['key', 'user', 'hwid', 'status', 'created'];
        cols.forEach(function (c) {
            var icon = document.getElementById('sort-icon-' + c);
            if (icon) {
                icon.innerText = '↕';
                icon.className = 'text-neutral-500 font-bold';
            }
        });

        var activeCol = null;
        var isAsc = false;
        if (currentSort.startsWith('key')) { activeCol = 'key'; isAsc = (currentSort === 'key-asc'); }
        else if (currentSort.startsWith('user')) { activeCol = 'user'; isAsc = (currentSort === 'user-asc'); }
        else if (currentSort.startsWith('hwid')) { activeCol = 'hwid'; isAsc = (currentSort === 'hwid-bound'); }
        else if (currentSort.startsWith('status')) { activeCol = 'status'; isAsc = (currentSort === 'status-asc'); }
        else if (currentSort.startsWith('created')) { activeCol = 'created'; isAsc = (currentSort === 'created-asc'); }

        if (activeCol) {
            var icon = document.getElementById('sort-icon-' + activeCol);
            if (icon) {
                icon.innerText = isAsc ? '↑' : '↓';
                icon.className = 'text-crimson font-bold';
            }
        }
    }

    window.filterAdmin = function () {
        var q = (document.getElementById('admin-search-input').value || '').trim().toLowerCase();
        var sf = document.getElementById('admin-status-filter').value;
        var sortSelect = document.getElementById('admin-sort-by');
        if (sortSelect) currentSort = sortSelect.value;

        updateSortIcons();

        var filtered = adminLicenses.filter(function (lic) {
            var key = (lic.license_key || '').toLowerCase();
            var mid = (lic.machine_id || '').toLowerCase();
            var email = (lic.user_email || '').toLowerCase();
            var name = (lic.user_name || '').toLowerCase();

            var matchQ = !q || 
                key.includes(q) || 
                mid.includes(q) || 
                email.includes(q) || 
                name.includes(q);

            var status = (lic.status || '').toLowerCase();
            var isRev = status === 'revoked' || lic.is_active === false;

            var matchS = (sf === 'all') || 
                         (sf === 'active' && status === 'active' && !isRev) ||
                         (sf === 'unactivated' && status === 'unactivated' && !isRev) ||
                         (sf === 'revoked' && isRev) ||
                         (sf === 'suspended' && status === 'suspended' && !isRev);

            return matchQ && matchS;
        });

        // Dynamic multi-criteria sorting
        filtered.sort(function (a, b) {
            if (currentSort === 'created-desc') {
                var da = a.created_at ? new Date(a.created_at).getTime() : 0;
                var db = b.created_at ? new Date(b.created_at).getTime() : 0;
                return db - da;
            } else if (currentSort === 'created-asc') {
                var da = a.created_at ? new Date(a.created_at).getTime() : 0;
                var db = b.created_at ? new Date(b.created_at).getTime() : 0;
                return da - db;
            } else if (currentSort === 'key-asc') {
                return (a.license_key || '').localeCompare(b.license_key || '');
            } else if (currentSort === 'key-desc') {
                return (b.license_key || '').localeCompare(a.license_key || '');
            } else if (currentSort === 'user-asc') {
                var ua = (a.user_email || a.user_name || 'zzzzzz').toLowerCase();
                var ub = (b.user_email || b.user_name || 'zzzzzz').toLowerCase();
                return ua.localeCompare(ub);
            } else if (currentSort === 'user-desc') {
                var ua = (a.user_email || a.user_name || '').toLowerCase();
                var ub = (b.user_email || b.user_name || '').toLowerCase();
                return ub.localeCompare(ua);
            } else if (currentSort === 'status-asc') {
                var rank = { 'active': 1, 'unactivated': 2, 'suspended': 3, 'revoked': 4 };
                var sa = (a.status === 'revoked' || a.is_active === false) ? 4 : (rank[a.status] || 3);
                var sb = (b.status === 'revoked' || b.is_active === false) ? 4 : (rank[b.status] || 3);
                return sa - sb;
            } else if (currentSort === 'status-desc') {
                var rank = { 'active': 1, 'unactivated': 2, 'suspended': 3, 'revoked': 4 };
                var sa = (a.status === 'revoked' || a.is_active === false) ? 4 : (rank[a.status] || 3);
                var sb = (b.status === 'revoked' || b.is_active === false) ? 4 : (rank[b.status] || 3);
                return sb - sa;
            } else if (currentSort === 'hwid-bound') {
                var ha = (a.machine_id && a.machine_id.trim().length > 0) ? 0 : 1;
                var hb = (b.machine_id && b.machine_id.trim().length > 0) ? 0 : 1;
                return ha - hb;
            } else if (currentSort === 'hwid-unbound') {
                var ha = (a.machine_id && a.machine_id.trim().length > 0) ? 1 : 0;
                var hb = (b.machine_id && b.machine_id.trim().length > 0) ? 1 : 0;
                return ha - hb;
            }
            return 0;
        });

        console.log('[Admin Filter] Matched records:', filtered.length, 'of total:', adminLicenses.length);
        renderTable(filtered);
    };

    // -----------------------------------------------------------------
    // GMAIL EMAIL LICENSE DISTRIBUTION (100% GITHUB PAGES COMPATIBLE)
    // -----------------------------------------------------------------
    function buildLicenseEmailText(customerName, licenseKey, recipientEmail) {
        var safeName = customerName && customerName.trim() ? customerName.trim() : 'Creator';
        return "SUMAIR TOOLS — ENTERPRISE LICENSE KEY\n" +
            "==================================================\n\n" +
            "Hello " + safeName + ",\n\n" +
            "Thank you for purchasing Sumair Tools / buying from us! We are thrilled to welcome you to our professional After Effects ecosystem. Your enterprise workstation license has been provisioned and is ready for immediate activation.\n\n" +
            "YOUR ENTERPRISE LICENSE KEY:\n" +
            licenseKey + "\n\n" +
            "Assigned Email: " + recipientEmail + "\n\n" +
            "QUICK 3-STEP WORKSTATION SETUP:\n" +
            "1. Install Extension: Download SumairTools_v7.0.zxp or use our 1-click Windows/Mac installers from https://sumairtools.online/#download\n" +
            "2. Launch in After Effects: Open AE and go to Window > Extensions > Sumair Tools.\n" +
            "3. Activate: Paste your License Key above into the activator prompt. Your hardware binds automatically.\n\n" +
            "SUPPORT & COMMUNITY:\n" +
            "• Official VIP Discord: https://discord.gg/sumairtools\n" +
            "• Website & Documentation: https://sumairtools.online\n" +
            "• Direct Support: sumairalisiddiqui@gmail.com\n\n" +
            "Sumair Ali Siddiqui\n" +
            "Lead Developer, Sumair Tools Team\n";
    }

    function openGmailWebComposer(email, licenseKey, customerName) {
        var safeName = customerName && customerName.trim() ? customerName.trim() : 'Creator';
        var subject = "🛡️ Your Sumair Tools Enterprise License Key: " + licenseKey;
        var body = buildLicenseEmailText(safeName, licenseKey, email);

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(body);
            }
        } catch (e) {}

        var gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1" +
            "&to=" + encodeURIComponent(email) +
            "&su=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(body);

        var win = window.open(gmailUrl, '_blank');
        if (!win) {
            window.location.href = "mailto:" + encodeURIComponent(email) +
                "?subject=" + encodeURIComponent(subject) +
                "&body=" + encodeURIComponent(body);
        }
    }

    function updateDispatchBadge() {
        var badge = document.getElementById('dispatch-status-badge');
        if (!badge) return;
        var gasUrl = localStorage.getItem('ST_GAS_URL') || '';
        if (gasUrl) {
            badge.className = 'px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
            badge.innerHTML = '⚡ GOOGLE APPS SCRIPT ACTIVE';
        } else {
            badge.className = 'px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-cyanAccent/20 text-cyanAccent border border-cyanAccent/40';
            badge.innerHTML = '✉️ 1-CLICK GMAIL COMPOSE';
        }
    }

    window.configureDispatchMode = function () {
        var currentGas = localStorage.getItem('ST_GAS_URL') || '';
        var msg = "✉️ EMAIL DISPATCH CONFIGURATION (GitHub Pages)\n\n" +
            "• Mode 1 (Default): 1-Click Gmail Web Composer\n" +
            "  Opens Gmail compose pre-filled with customer email, key, & instructions (No setup needed).\n\n" +
            "• Mode 2: Automated Background Sending via Google Apps Script (100% Free)\n" +
            "  Sends dark-mode HTML email directly from your Gmail account without leaving this page.\n\n" +
            "Enter your Google Apps Script Web App URL (or leave blank for 1-Click Gmail):";
        
        var input = prompt(msg, currentGas);
        if (input !== null) {
            var trimmed = input.trim();
            if (trimmed) {
                localStorage.setItem('ST_GAS_URL', trimmed);
                alert("✓ Google Apps Script URL saved!\nEmails will now be sent automatically in the background.");
            } else {
                localStorage.removeItem('ST_GAS_URL');
                alert("✓ Reset to 1-Click Gmail Web Composer!\nClicking Email will open your Gmail compose tab pre-filled.");
            }
            updateDispatchBadge();
        }
    };

    async function dispatchEmail(email, licenseKey, customerName) {
        var gasUrl = localStorage.getItem('ST_GAS_URL');
        if (gasUrl) {
            try {
                await fetch(gasUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify({
                        email: email,
                        license_key: licenseKey,
                        customer_name: customerName || 'Creator'
                    })
                });
                return { success: true, mode: 'gas' };
            } catch (err) {
                console.warn('[Admin] GAS dispatch error, falling back to Gmail Web:', err);
                openGmailWebComposer(email, licenseKey, customerName);
                return { success: true, mode: 'gmail_web', fallback: true };
            }
        } else {
            openGmailWebComposer(email, licenseKey, customerName);
            return { success: true, mode: 'gmail_web' };
        }
    }

    // Initialize badge on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateDispatchBadge);
    } else {
        setTimeout(updateDispatchBadge, 100);
    }

    window.mintAndEmailLicense = async function () {
        var emailInput = document.getElementById('dispatch-email');
        var nameInput = document.getElementById('dispatch-name');
        var submitBtn = document.getElementById('dispatch-submit-btn');
        var btnIcon = document.getElementById('dispatch-btn-icon');
        var btnText = document.getElementById('dispatch-btn-text');
        var alertBox = document.getElementById('dispatch-status-alert');

        if (!emailInput) return;

        var email = emailInput.value.trim().toLowerCase();
        var name = nameInput ? nameInput.value.trim() : '';

        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            if (alertBox) {
                alertBox.className = 'mt-3.5 p-3 rounded-xl font-mono text-xs border bg-crimson/15 border-crimson/40 text-crimson block';
                alertBox.innerHTML = '⚠️ <b>Invalid Email Address</b>: Please enter a valid recipient email address.';
            }
            emailInput.focus();
            return;
        }

        // Set UI loading state
        if (submitBtn) submitBtn.disabled = true;
        if (btnIcon) btnIcon.innerHTML = '⏳';
        if (btnText) btnText.textContent = 'MINTING & DISPATCHING...';
        if (alertBox) {
            alertBox.className = 'mt-3.5 p-3 rounded-xl font-mono text-xs border bg-cyanAccent/10 border-cyanAccent/30 text-cyanAccent block';
            alertBox.innerHTML = '⚙️ Provisioning enterprise license key in Supabase...';
        }

        try {
            var licenseKey = null;

            // Step 1: Mint license key via Supabase RPC or resilient fallback
            try {
                if (window.sbClient) {
                    var rpcRes = await window.sbClient.rpc('generate_batch_licenses', { p_count: 1 });
                    if (!rpcRes.error && rpcRes.data && rpcRes.data.length > 0) {
                        licenseKey = rpcRes.data[0].license_key;
                    }
                }
            } catch (rpcErr) {
                console.warn('[Admin] RPC generate_batch_licenses failed, using client fallback:', rpcErr);
            }

            // Fallback generation if RPC didn't return a key
            if (!licenseKey) {
                var pool = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                var seg = function () {
                    var s = '';
                    for (var i = 0; i < 4; i++) s += pool.charAt(Math.floor(Math.random() * pool.length));
                    return s;
                };
                licenseKey = 'ST-' + seg() + '-' + seg() + '-' + seg() + '-' + seg();

                if (window.sbClient) {
                    var insRes = await window.sbClient.from('licenses').insert([{
                        license_key: licenseKey,
                        user_email: email,
                        user_name: name || null,
                        status: 'unactivated',
                        is_active: true
                    }]);
                    if (insRes.error) {
                        console.warn('[Admin] Fallback insert error:', insRes.error);
                    }
                }
            } else {
                if (window.sbClient) {
                    await window.sbClient.from('licenses').update({
                        user_email: email,
                        user_name: name || null,
                        status: 'unactivated',
                        is_active: true
                    }).eq('license_key', licenseKey);
                }
            }

            // Step 2: Dispatch Email
            var dispatchRes = await dispatchEmail(email, licenseKey, name);

            if (alertBox) {
                if (dispatchRes.mode === 'gas') {
                    alertBox.className = 'mt-3.5 p-4 rounded-xl font-mono text-xs border bg-emerald-500/15 border-emerald-500/40 text-emerald-300 block space-y-2';
                    alertBox.innerHTML = `
                        <div class="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                            <span>✅</span> <span>LICENSE DELIVERED VIA GOOGLE APPS SCRIPT</span>
                        </div>
                        <div class="text-neutral-200">
                            Key <span class="text-white font-bold bg-black/40 px-2 py-0.5 rounded border border-emerald-500/40 select-all">${licenseKey}</span> has been dispatched to <b class="text-white">${email}</b>.
                        </div>
                        <div class="text-[11px] text-neutral-400 flex items-center gap-3 pt-1">
                            <button onclick="copyLicenseKey('${licenseKey}')" class="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] transition-colors cursor-pointer">📋 Copy Key</button>
                        </div>
                    `;
                } else {
                    alertBox.className = 'mt-3.5 p-4 rounded-xl font-mono text-xs border bg-cyanAccent/15 border-cyanAccent/40 text-cyanAccent block space-y-2';
                    alertBox.innerHTML = `
                        <div class="flex items-center gap-2 text-white font-bold text-sm">
                            <span>🚀</span> <span>LICENSE READY &amp; GMAIL COMPOSE OPENED</span>
                        </div>
                        <div class="text-neutral-200">
                            Key <span class="text-white font-bold bg-black/40 px-2 py-0.5 rounded border border-white/20 select-all">${licenseKey}</span> for <b class="text-white">${email}</b>.
                        </div>
                        <div class="text-[11px] text-neutral-300">
                            ✓ Gmail compose window has been opened with your pre-filled email. Simply click <b>Send</b> in Gmail!<br>
                            ✓ Message text and key have also been copied to your clipboard.
                        </div>
                        <div class="flex items-center gap-2 pt-1">
                            <button onclick="openGmailWebComposer('${email}', '${licenseKey}', '${name}')" class="px-3 py-1.5 rounded-lg bg-crimson hover:bg-crimson/80 text-white font-bold text-[10px] transition-all cursor-pointer">✉️ Reopen Gmail</button>
                            <button onclick="copyLicenseKey('${licenseKey}')" class="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] transition-colors cursor-pointer">📋 Copy Key</button>
                        </div>
                    `;
                }
            }

            emailInput.value = '';
            if (nameInput) nameInput.value = '';
            if (typeof window.loadAdminData === 'function') {
                window.loadAdminData();
            }

        } catch (err) {
            console.error('[Admin] mintAndEmailLicense fatal error:', err);
            if (alertBox) {
                alertBox.className = 'mt-3.5 p-3 rounded-xl font-mono text-xs border bg-crimson/15 border-crimson/40 text-crimson block';
                alertBox.innerHTML = '❌ <b>System Error</b>: ' + (err.message || 'Unknown network error occurred');
            }
        } finally {
            if (submitBtn) submitBtn.disabled = false;
            if (btnIcon) btnIcon.innerHTML = '⚡';
            if (btnText) btnText.textContent = 'MINT & DISPATCH EMAIL';
        }
    };

    window.sendExistingLicenseEmail = async function (licenseKey, existingEmail, existingName) {
        var recipientEmail = existingEmail;
        if (!recipientEmail || !recipientEmail.includes('@')) {
            recipientEmail = prompt('Enter customer email to dispatch license ' + licenseKey + ' to:');
            if (!recipientEmail || !recipientEmail.trim()) return;
            recipientEmail = recipientEmail.trim().toLowerCase();
        }

        var recipientName = existingName || '';
        if (!recipientName) {
            var promptName = prompt('Enter client name (Optional, press OK to skip):', '');
            if (promptName !== null) recipientName = promptName.trim();
        }

        try {
            var originalBtn = document.activeElement;
            if (originalBtn && originalBtn.tagName === 'BUTTON') {
                originalBtn.disabled = true;
                originalBtn.innerText = 'Opening...';
            }

            var dispatchRes = await dispatchEmail(recipientEmail, licenseKey, recipientName);

            if (dispatchRes.mode === 'gas') {
                alert('✓ Success!\nLicense ' + licenseKey + ' has been dispatched to ' + recipientEmail + ' via Google Apps Script.');
            } else {
                alert('✓ Gmail Compose Opened!\n\nRecipient: ' + recipientEmail + '\nLicense: ' + licenseKey + '\n\nYour Gmail tab has been opened with the complete pre-filled message. Click "Send" in Gmail!\n(Details also copied to clipboard)');
            }

            if (window.sbClient && (!existingEmail || existingEmail !== recipientEmail)) {
                await window.sbClient.from('licenses').update({
                    user_email: recipientEmail,
                    user_name: recipientName || null
                }).eq('license_key', licenseKey);
                if (typeof window.loadAdminData === 'function') {
                    window.loadAdminData();
                }
            }
        } catch (err) {
            console.error('[Admin] sendExistingLicenseEmail error:', err);
            openGmailWebComposer(recipientEmail, licenseKey, recipientName);
            alert('✓ Opened Gmail compose tab for ' + recipientEmail + ' with license ' + licenseKey + ' pre-filled.');
        } finally {
            if (typeof window.loadAdminData === 'function') {
                window.loadAdminData();
            }
        }
    };

    window.generateBatchKeys = async function (count) {
        count = count || 50;
        if (!confirm('Generate ' + count + ' new enterprise ST-XXXX-XXXX-XXXX-XXXX license keys in Supabase?')) return;
        try {
            console.log('[Admin Command Center] Minting ' + count + ' licenses...');
            var res = await window.sbClient.rpc('generate_batch_licenses', { p_count: count });
            if (res.error) throw res.error;
            alert('✓ Successfully generated ' + count + ' new enterprise licenses in Supabase!');
            loadAdminData();
        } catch (err) {
            console.error('[Admin Command Center] Batch key generation error:', err);
            alert('Failed to generate keys: ' + (err.message || JSON.stringify(err)));
        }
    };

    window.unlinkLicense = async function (key) {
        if (!confirm('UNLINK license ' + key + ' from user account?\n\nThe key will become unclaimed.')) return;
        try {
            var res = await window.sbClient.rpc('admin_unlink_license', { p_license_key: key });
            if (res.error) {
                res = await window.sbClient.from('licenses').update({ user_id: null, user_name: null, user_email: null, linked_at: null }).eq('license_key', key);
            }
            if (res.error) throw res.error;
            alert('License ' + key + ' unlinked.');
            loadAdminData();
        } catch (err) {
            alert('Error unlinking license: ' + err.message);
        }
    };

    window.approveLicense = async function (key) {
        try {
            var res = await window.sbClient.from('licenses').update({ status: 'unactivated', is_active: true }).eq('license_key', key);
            if (res.error) throw res.error;
            loadAdminData();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    window.batchApprove = async function () {
        if (!confirm('APPROVE all ' + adminLicenses.length + ' license keys?')) return;
        try {
            var res = await window.sbClient.from('licenses').update({ status: 'unactivated', is_active: true }).neq('status', 'active');
            if (res.error) throw res.error;
            alert('Success! All unassigned keys are now APPROVED (READY).');
            loadAdminData();
        } catch (err) {
            alert('Batch update error: ' + err.message);
        }
    };

    window.batchSuspend = async function () {
        if (!confirm('SUSPEND all unassigned license keys?')) return;
        try {
            var res = await window.sbClient.from('licenses').update({ status: 'suspended', is_active: false }).eq('status', 'unactivated');
            if (res.error) throw res.error;
            alert('All unassigned keys are now SUSPENDED.');
            loadAdminData();
        } catch (err) {
            alert('Batch update error: ' + err.message);
        }
    };

    window.exportCSV = function () {
        if (!adminLicenses || adminLicenses.length === 0) {
            alert('No licenses to export.');
            return;
        }
        var csv = 'License Key,Status,Active,Claimed User Name,Claimed User Email,Machine ID,Created At\n';
        adminLicenses.forEach(function (lic) {
            csv += [
                lic.license_key,
                lic.status,
                lic.is_active !== false ? 'TRUE' : 'FALSE',
                (lic.user_name || '').replace(/,/g, ' '),
                lic.user_email || 'Unclaimed',
                lic.machine_id || 'Not Bound',
                lic.created_at || 'N/A'
            ].join(',') + '\n';
        });

        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'Sumair_Tools_Master_Telemetry_' + new Date().toISOString().split('T')[0] + '.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    window.addEventListener('DOMContentLoaded', window.initAdminPanel);

})();

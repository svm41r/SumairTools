/**
 * Sumair Tools — Enterprise License Email Distribution API
 * Endpoint: /api/send-license
 * -----------------------------------------------------------------
 * Direct Gmail SMTP Transport via nodemailer with retry logic,
 * professional dark-themed responsive HTML template, and full status telemetry.
 * Copyright (c) 2026 Sumair Ali Siddiqui. All Rights Reserved.
 */

const nodemailer = require('nodemailer');

// -----------------------------------------------------------------
// 1. SMTP Transport Configuration (Gmail App Password / Custom SMTP)
// -----------------------------------------------------------------
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SMTP_SECURE = process.env.SMTP_SECURE !== 'false'; // true for 465, false for 587
const GMAIL_USER = process.env.GMAIL_USER || process.env.SMTP_USER || 'sumairalisiddiqui@gmail.com';
const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '';

const SENDER_NAME = process.env.SENDER_NAME || 'Sumair Tools Official';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'sumairalisiddiqui@gmail.com';
const DISCORD_URL = process.env.DISCORD_URL || 'https://discord.gg/sumairtools';
const WEBSITE_URL = process.env.WEBSITE_URL || 'https://sumairtools.com';
const DOWNLOAD_URL = process.env.DOWNLOAD_URL || 'https://sumairtools.com/#download';

// Reusable transporter instance
let transporter = null;

function getTransporter() {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_SECURE,
            auth: {
                user: GMAIL_USER,
                pass: GMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
            pool: true,
            maxConnections: 5,
            maxMessages: 100,
        });
    }
    return transporter;
}

// -----------------------------------------------------------------
// 2. Email Validation & Retry Logic
// -----------------------------------------------------------------
function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email.trim());
}

async function sendMailWithRetry(mailOptions, maxRetries = 3, baseDelayMs = 1000) {
    let lastError = null;
    const transport = getTransporter();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const info = await transport.sendMail(mailOptions);
            return { success: true, info, attempt };
        } catch (err) {
            lastError = err;
            console.warn(`[Gmail SMTP Warning] Attempt ${attempt}/${maxRetries} failed:`, err.message);
            if (attempt < maxRetries) {
                const delay = baseDelayMs * Math.pow(2, attempt - 1);
                await new Promise((res) => setTimeout(res, delay));
            }
        }
    }
    return { success: false, error: lastError };
}

// -----------------------------------------------------------------
// 3. Responsive Dark-Themed HTML Email Template
// -----------------------------------------------------------------
function buildLicenseEmailHTML({ customerName, licenseKey, recipientEmail }) {
    const formattedDate = new Date().toUTCString();
    const safeName = customerName && customerName.trim() ? customerName.trim() : 'Creator';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Your Sumair Tools Enterprise License Key</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        body { margin: 0; padding: 0; background-color: #09090d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        table { border-collapse: collapse; }
        img { border: 0; outline: none; text-decoration: none; }
        a { text-decoration: none; color: #ff003c; }
        .copy-box { background: #000000; border: 2px solid #ff003c; border-radius: 12px; padding: 18px 24px; text-align: center; }
        .key-text { font-family: 'JetBrains Mono', 'Courier New', Courier, monospace; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: 3px; }
        .btn-action { background: linear-gradient(135deg, #ff003c, #b00029); color: #ffffff !important; font-weight: 700; border-radius: 10px; padding: 14px 28px; display: inline-block; text-align: center; }
        @media only screen and (max-width: 600px) {
            .key-text { font-size: 18px !important; letter-spacing: 1.5px !important; }
            .container-table { width: 100% !important; }
            .content-padding { padding: 24px 16px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #09090d; color: #f4f4f5;">
    <center style="width: 100%; background-color: #09090d; padding: 30px 0;">
        <!-- Preheader text (preview snippet in inbox) -->
        <div style="display: none; font-size: 1px; color: #09090d; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
            Your Sumair Tools License Key is ready: ${licenseKey} — Workstation Activation Details inside.
        </div>

        <table class="container-table" role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; margin: 0 auto; background: #111118; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
            
            <!-- HEADER BANNER -->
            <tr>
                <td style="background: linear-gradient(180deg, #181824 0%, #111118 100%); padding: 36px 30px 24px 30px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); position: relative;">
                    <!-- Top Crimson Accent Bar -->
                    <div style="height: 4px; background: linear-gradient(90deg, #ff003c, #ff3366, #ff003c); border-radius: 4px; margin-bottom: 24px;"></div>
                    
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td align="center">
                                <div style="display: inline-block; background: rgba(255, 0, 60, 0.15); border: 1px solid rgba(255, 0, 60, 0.4); border-radius: 16px; padding: 12px 18px; margin-bottom: 14px;">
                                    <span style="font-size: 30px; line-height: 1;">🛡️</span>
                                </div>
                                <h1 style="margin: 0; font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: 1.5px; text-transform: uppercase;">
                                    SUMAIR TOOLS
                                </h1>
                                <p style="margin: 6px 0 0 0; font-size: 11px; font-family: 'Courier New', Courier, monospace; color: #ff003c; letter-spacing: 2px; text-transform: uppercase; font-weight: 700;">
                                    ENTERPRISE MOTION GRAPHICS SUITE
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- MAIN CONTENT BODY -->
            <tr>
                <td class="content-padding" style="padding: 36px 36px 24px 36px;">
                    <!-- Formal Thank-You Message -->
                    <h2 style="margin: 0 0 14px 0; font-size: 20px; font-weight: 700; color: #ffffff;">
                        Hello, ${safeName}! 👋
                    </h2>
                    <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #d4d4d8;">
                        <strong style="color: #ffffff;">Thank you for purchasing Sumair Tools / buying from us!</strong> We are thrilled to welcome you to our professional After Effects ecosystem. Your enterprise workstation license has been provisioned and is ready for immediate activation.
                    </p>

                    <!-- HIGHLIGHTED LICENSE KEY BLOCK -->
                    <div style="margin: 28px 0; background: #000000; border: 2px solid #ff003c; border-radius: 14px; padding: 22px 20px; text-align: center; box-shadow: 0 0 30px rgba(255, 0, 60, 0.25);">
                        <div style="font-size: 10px; font-family: 'Courier New', Courier, monospace; color: #a1a1aa; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; font-weight: 700;">
                            YOUR ENTERPRISE LICENSE KEY (COPY & PASTE)
                        </div>
                        <div class="key-text" style="font-family: 'JetBrains Mono', 'Courier New', Courier, monospace; font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 2.5px; text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);">
                            ${licenseKey}
                        </div>
                        <div style="margin-top: 10px; font-size: 11px; color: #71717a;">
                            Assigned to: <span style="color: #a1a1aa; font-family: 'Courier New', Courier, monospace;">${recipientEmail}</span>
                        </div>
                    </div>

                    <!-- QUICK ACTIVATION & USAGE GUIDE -->
                    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 20px 22px; margin-bottom: 28px;">
                        <h3 style="margin: 0 0 14px 0; font-size: 13px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center;">
                            ⚡ Quick 3-Step Workstation Setup:
                        </h3>
                        <ol style="margin: 0; padding-left: 20px; color: #a1a1aa; font-size: 13px; line-height: 1.8;">
                            <li style="margin-bottom: 8px;">
                                <strong style="color: #ffffff;">Install Extension:</strong> Use <a href="${DOWNLOAD_URL}" style="color: #ff003c; font-weight: 700;">ZXP Installer</a> or our 1-Click Windows/Mac installers.
                            </li>
                            <li style="margin-bottom: 8px;">
                                <strong style="color: #ffffff;">Launch in After Effects:</strong> Open AE and go to <code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; color: #ffffff;">Window &gt; Extensions &gt; Sumair Tools</code>.
                            </li>
                            <li>
                                <strong style="color: #ffffff;">Activate:</strong> Paste your License Key above into the activator. Your machine hardware binds automatically.
                            </li>
                        </ol>
                    </div>

                    <!-- COMMUNITY & CTA BUTTONS -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                        <tr>
                            <td align="center">
                                <a href="${DISCORD_URL}" class="btn-action" style="background: linear-gradient(135deg, #ff003c, #b00029); color: #ffffff; font-weight: 700; border-radius: 10px; padding: 14px 28px; display: inline-block; text-align: center; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(255, 0, 60, 0.4);">
                                    💬 Join VIP Discord Community & Support
                                </a>
                            </td>
                        </tr>
                    </table>

                    <p style="margin: 0; font-size: 12px; color: #71717a; text-align: center;">
                        Need help or looking for video tutorials? Visit our <a href="${WEBSITE_URL}" style="color: #ff003c; font-weight: 600;">Documentation Portal</a> anytime.
                    </p>
                </td>
            </tr>

            <!-- FOOTER -->
            <tr>
                <td style="background: #0d0d12; padding: 26px 36px; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
                    <p style="margin: 0 0 6px 0; font-size: 11px; color: #71717a; font-family: 'Courier New', Courier, monospace;">
                        🔒 HARDWARE LOCKED • 1 WORKSTATION PER LICENSE • REVERSIBLE RE-BINDING
                    </p>
                    <p style="margin: 0 0 12px 0; font-size: 11px; color: #52525b;">
                        Generated on ${formattedDate} &bull; Security Hash: Verified
                    </p>
                    <div style="height: 1px; background: rgba(255, 255, 255, 0.05); margin: 12px auto; max-width: 300px;"></div>
                    <p style="margin: 0; font-size: 12px; color: #a1a1aa; line-height: 1.5;">
                        <strong style="color: #ffffff;">Sumair Ali Siddiqui</strong><br>
                        Lead Developer, Sumair Tools Team<br>
                        <a href="mailto:${SUPPORT_EMAIL}" style="color: #ff003c;">${SUPPORT_EMAIL}</a> &bull; <a href="${WEBSITE_URL}" style="color: #a1a1aa;">sumairtools.com</a>
                    </p>
                </td>
            </tr>

        </table>
    </center>
</body>
</html>`;
}

function buildLicenseEmailText({ customerName, licenseKey, recipientEmail }) {
    const safeName = customerName && customerName.trim() ? customerName.trim() : 'Creator';
    return `SUMAIR TOOLS — ENTERPRISE LICENSE KEY
==================================================

Hello ${safeName},

Thank you for purchasing Sumair Tools / buying from us! Your enterprise license key is ready for immediate workstation activation.

YOUR LICENSE KEY:
${licenseKey}

Assigned Email: ${recipientEmail}

QUICK 3-STEP ACTIVATION GUIDE:
1. Install Extension: Download SumairTools_v7.0.zxp or use our 1-click Windows/Mac bundles from ${DOWNLOAD_URL}.
2. Launch in After Effects: Go to Window > Extensions > Sumair Tools.
3. Activate: Paste your License Key above into the activator prompt. Your hardware binds automatically.

SUPPORT & COMMUNITY:
• Official VIP Discord: ${DISCORD_URL}
• Website & Docs: ${WEBSITE_URL}
• Direct Email Support: ${SUPPORT_EMAIL}

Issued on: ${new Date().toUTCString()}
Sumair Ali Siddiqui — Lead Developer, Sumair Tools Team
`;
}

// -----------------------------------------------------------------
// 4. Serverless Handler Endpoint
// -----------------------------------------------------------------
export default async function handler(req, res) {
    // CORS headers for admin panel calls
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Secret');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method Not Allowed. Use POST.',
        });
    }

    try {
        const body = req.body || {};
        const { email, license_key, customer_name } = body;

        // 1. Validation
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                error: 'Valid recipient email address is required.',
            });
        }

        if (!license_key || typeof license_key !== 'string' || license_key.trim().length < 5) {
            return res.status(400).json({
                success: false,
                error: 'Valid license key is required (e.g. ST-XXXX-XXXX-XXXX-XXXX).',
            });
        }

        const cleanKey = license_key.trim().toUpperCase();
        const cleanEmail = email.trim().toLowerCase();
        const cleanName = (customer_name && typeof customer_name === 'string') ? customer_name.trim() : '';

        // 2. Check SMTP credentials configuration
        if (!GMAIL_PASS) {
            console.error('[Gmail SMTP Error] GMAIL_APP_PASSWORD is not configured in environment variables.');
            return res.status(500).json({
                success: false,
                error: 'Gmail SMTP credentials missing. Please configure GMAIL_APP_PASSWORD in your .env file.',
            });
        }

        // 3. Compose Email
        const mailOptions = {
            from: `"${SENDER_NAME}" <${GMAIL_USER}>`,
            to: cleanEmail,
            replyTo: SUPPORT_EMAIL,
            subject: `🛡️ Your Sumair Tools Enterprise License Key: ${cleanKey}`,
            text: buildLicenseEmailText({
                customerName: cleanName,
                licenseKey: cleanKey,
                recipientEmail: cleanEmail,
            }),
            html: buildLicenseEmailHTML({
                customerName: cleanName,
                licenseKey: cleanKey,
                recipientEmail: cleanEmail,
            }),
        };

        // 4. Send with retry logic
        console.log(`[Gmail SMTP] Dispatching license ${cleanKey} to ${cleanEmail}...`);
        const result = await sendMailWithRetry(mailOptions, 3, 1000);

        if (!result.success) {
            console.error('[Gmail SMTP Error] All send attempts failed:', result.error);
            return res.status(500).json({
                success: false,
                error: 'SMTP dispatch failed: ' + (result.error.message || result.error.toString()),
            });
        }

        console.log(`[Gmail SMTP Success] Message sent to ${cleanEmail} (ID: ${result.info.messageId}) on attempt ${result.attempt}`);

        return res.status(200).json({
            success: true,
            message: `License successfully emailed to ${cleanEmail}!`,
            recipient: cleanEmail,
            license_key: cleanKey,
            messageId: result.info.messageId,
            attempt: result.attempt,
            timestamp: new Date().toISOString(),
        });

    } catch (err) {
        console.error('[Send License API Error]:', err);
        return res.status(500).json({
            success: false,
            error: 'Server error while sending license: ' + (err.message || err.toString()),
        });
    }
}

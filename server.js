/**
 * Sumair Tools — Standalone Local Admin & SMTP Mail Server
 * Run: node server.js
 * Default Port: 3000
 * -----------------------------------------------------------------
 * Serves website & admin panel files, and provides automated /api/send-license
 * dispatch via Gmail SMTP with the dark-mode HTML email template.
 * Copyright (c) 2026 Sumair Ali Siddiqui.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// 1. Auto-load .env
(function loadEnv() {
    try {
        const envCandidates = [
            path.resolve(__dirname, '.env'),
            path.resolve(process.cwd(), '.env')
        ];
        for (const envPath of envCandidates) {
            if (fs.existsSync(envPath)) {
                const lines = fs.readFileSync(envPath, 'utf8').split('\n');
                for (let line of lines) {
                    line = line.trim();
                    if (!line || line.startsWith('#')) continue;
                    const eqIdx = line.indexOf('=');
                    if (eqIdx > 0) {
                        const k = line.substring(0, eqIdx).trim();
                        let v = line.substring(eqIdx + 1).trim();
                        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
                            v = v.substring(1, v.length - 1);
                        }
                        if (!process.env[k]) process.env[k] = v;
                    }
                }
                break;
            }
        }
    } catch (e) {}
})();

// 2. Load nodemailer
let nodemailer;
try {
    nodemailer = require('nodemailer');
} catch (e) {
    try {
        nodemailer = require(path.resolve(__dirname, 'node_modules/nodemailer'));
    } catch (err) {
        console.warn('[Server Warning] nodemailer package not found in current folder.');
    }
}

const PORT = parseInt(process.env.PORT || '3000', 10);
const GMAIL_USER = process.env.GMAIL_USER || 'sumairalisiddiqui@gmail.com';
const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD || 'mgck ogmb bfod libp';
const SENDER_NAME = process.env.SENDER_NAME || 'Sumair Tools Official';

function getTransporter() {
    if (!nodemailer) return null;
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '465', 10),
        secure: true,
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_PASS
        }
    });
}

function buildHtmlEmail(name, key, email) {
    const safeName = name && name.trim() ? name.trim() : 'Creator';
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#09090d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f4f4f5;">
  <center style="width:100%;background-color:#09090d;padding:30px 0;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;margin:0 auto;background:#111118;border-radius:20px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.8);">
      <tr>
        <td style="background:linear-gradient(180deg,#181824 0%,#111118 100%);padding:36px 30px 24px 30px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.08);">
          <div style="height:4px;background:linear-gradient(90deg,#ff003c,#ff3366,#ff003c);border-radius:4px;margin-bottom:24px;"></div>
          <div style="display:inline-block;background:rgba(255,0,60,0.15);border:1px solid rgba(255,0,60,0.4);border-radius:16px;padding:12px 18px;margin-bottom:14px;font-size:28px;">🛡️</div>
          <h1 style="margin:0;font-size:26px;font-weight:900;color:#ffffff;letter-spacing:1.5px;text-transform:uppercase;">SUMAIR TOOLS</h1>
          <p style="margin:6px 0 0 0;font-size:11px;font-family:Courier,monospace;color:#ff003c;letter-spacing:2px;text-transform:uppercase;font-weight:700;">ENTERPRISE MOTION GRAPHICS SUITE</p>
        </td>
      </tr>
      <tr>
        <td style="padding:36px 36px 24px 36px;">
          <h2 style="margin:0 0 14px 0;font-size:20px;font-weight:700;color:#ffffff;">Hello, ${safeName}! 👋</h2>
          <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#d4d4d8;"><strong style="color:#ffffff;">Thank you for purchasing Sumair Tools / buying from us!</strong> We are thrilled to welcome you to our professional After Effects ecosystem. Your enterprise workstation license has been provisioned and is ready for immediate activation.</p>
          <div style="margin:28px 0;background:#000000;border:2px solid #ff003c;border-radius:14px;padding:22px 20px;text-align:center;box-shadow:0 0 30px rgba(255,0,60,0.25);">
            <div style="font-size:10px;font-family:Courier,monospace;color:#a1a1aa;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;font-weight:700;">YOUR ENTERPRISE LICENSE KEY (COPY & PASTE)</div>
            <div style="font-family:Courier,monospace;font-size:24px;font-weight:900;color:#ffffff;letter-spacing:2.5px;">${key}</div>
            <div style="margin-top:10px;font-size:11px;color:#71717a;">Assigned to: <span style="color:#a1a1aa;font-family:Courier,monospace;">${email}</span></div>
          </div>
          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:20px 22px;margin-bottom:28px;">
            <h3 style="margin:0 0 14px 0;font-size:13px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:1px;">⚡ Quick 3-Step Workstation Setup:</h3>
            <ol style="margin:0;padding-left:20px;color:#a1a1aa;font-size:13px;line-height:1.8;">
              <li style="margin-bottom:8px;"><strong style="color:#ffffff;">Install Extension:</strong> Use <a href="https://sumairtools.online/#download" style="color:#ff003c;font-weight:700;">ZXP Installer</a> or our 1-Click Windows/Mac installers.</li>
              <li style="margin-bottom:8px;"><strong style="color:#ffffff;">Launch in After Effects:</strong> Open AE and go to <code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px;color:#ffffff;">Window &gt; Extensions &gt; Sumair Tools</code>.</li>
              <li><strong style="color:#ffffff;">Activate:</strong> Paste your License Key above into the activator. Your machine hardware binds automatically.</li>
            </ol>
          </div>
          <div style="text-align:center;margin-bottom:24px;">
            <a href="https://discord.gg/639znDw2tU" style="background:linear-gradient(135deg,#ff003c,#b00029);color:#ffffff;font-weight:700;border-radius:10px;padding:14px 28px;display:inline-block;text-align:center;font-size:13px;text-transform:uppercase;letter-spacing:1px;text-decoration:none;">💬 Join VIP Discord Community & Support</a>
          </div>
          <p style="margin:0;font-size:12px;color:#71717a;text-align:center;">Need help or looking for video tutorials? Visit <a href="https://sumairtools.online" style="color:#ff003c;text-decoration:none;">sumairtools.online</a> anytime.</p>
        </td>
      </tr>
      <tr>
        <td style="background:#0d0d12;padding:26px 36px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
          <p style="margin:0 0 6px 0;font-size:11px;color:#71717a;font-family:Courier,monospace;">🔒 HARDWARE LOCKED • 1 WORKSTATION PER LICENSE</p>
          <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.5;"><strong style="color:#ffffff;">Sumair Ali Siddiqui</strong><br>Lead Developer, Sumair Tools Team<br><a href="mailto:sumairalisiddiqui@gmail.com" style="color:#ff003c;text-decoration:none;">sumairalisiddiqui@gmail.com</a> &bull; sumairtools.online</p>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
}

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.zip': 'application/zip',
    '.zxp': 'application/octet-stream',
    '.mp3': 'audio/mpeg'
};

const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // API Route: Send License Email
    if (pathname === '/api/send-license') {
        if (req.method !== 'POST') {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
            return;
        }

        let bodyRaw = '';
        req.on('data', chunk => { bodyRaw += chunk; });
        req.on('end', async () => {
            try {
                const data = JSON.parse(bodyRaw || '{}');
                const { email, license_key, customer_name } = data;

                if (!email || !license_key) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Missing email or license_key' }));
                    return;
                }

                const transporter = getTransporter();
                if (!transporter) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'nodemailer is not available on this server' }));
                    return;
                }

                const info = await transporter.sendMail({
                    from: `"${SENDER_NAME}" <${GMAIL_USER}>`,
                    to: email,
                    replyTo: GMAIL_USER,
                    subject: `🛡️ Your Sumair Tools Enterprise License Key: ${license_key}`,
                    html: buildHtmlEmail(customer_name, license_key, email)
                });

                console.log(`[SMTP Sent] License ${license_key} delivered to ${email} (ID: ${info.messageId})`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: `License successfully emailed to ${email}`,
                    messageId: info.messageId
                }));
            } catch (err) {
                console.error('[SMTP Error]', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message || 'SMTP dispatch failed' }));
            }
        });
        return;
    }

    // Static File Serving
    let safePath = pathname === '/' ? '/index.html' : pathname;
    let filePath = path.join(__dirname, safePath);

    // Prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Access Denied');
        return;
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        const htmlTry = filePath + '.html';
        if (fs.existsSync(htmlTry)) {
            filePath = htmlTry;
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Sumair Tools Server Running on http://localhost:${PORT}`);
    console.log(`✉️  Admin Panel: http://localhost:${PORT}/admin.html`);
    console.log(`📧 Gmail SMTP: Configured for ${GMAIL_USER}`);
    console.log(`==================================================\n`);
});

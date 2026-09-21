/**
 * ==============================================================================
 * SUMAIR TOOLS — GOOGLE APPS SCRIPT LICENSE DISPATCHER (100% FREE FOR GITHUB PAGES)
 * ==============================================================================
 * 
 * INSTRUCTIONS (Takes only 60 seconds):
 * 1. Go to https://script.google.com/ and click "New project"
 * 2. Delete any code there, paste this ENTIRE file into the editor, and click "Save" (Ctrl+S)
 * 3. Click "Deploy" (top right) > "New deployment"
 * 4. Click the gear icon next to "Select type" and choose "Web app"
 * 5. Set:
 *    - Description: "Sumair Tools License Mailer"
 *    - Execute as: "Me (sumairalisiddiqui@gmail.com)"
 *    - Who has access: "Anyone"
 * 6. Click "Deploy", authorize access with your Google account.
 * 7. Copy the "Web app URL" (looks like https://script.google.com/macros/s/.../exec)
 * 8. In your Admin Panel on sumairtools.online, click "⚙️ Configure Dispatch Mode" 
 *    and paste your Web App URL!
 * 
 * Done! Your GitHub Pages site can now send automated emails via your Gmail!
 */

function doPost(e) {
  try {
    var rawData = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    var data = JSON.parse(rawData);
    
    var email = data.email;
    var licenseKey = data.license_key;
    var customerName = data.customer_name || "Creator";
    
    if (!email || !licenseKey) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Missing required fields: email and license_key"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var subject = "🛡️ Your Sumair Tools Enterprise License Key: " + licenseKey;
    var htmlContent = buildHtmlEmail(customerName, licenseKey, email);
    var textContent = buildTextEmail(customerName, licenseKey, email);

    GmailApp.sendEmail(email, subject, textContent, {
      htmlBody: htmlContent,
      name: "Sumair Tools Official",
      replyTo: "sumairalisiddiqui@gmail.com"
    });

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "License email delivered to " + email,
      license_key: licenseKey
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    service: "Sumair Tools Google Apps Script Email Engine",
    sender: "sumairalisiddiqui@gmail.com"
  })).setMimeType(ContentService.MimeType.JSON);
}

function buildHtmlEmail(name, key, email) {
  return '<!DOCTYPE html>' +
  '<html>' +
  '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
  '<body style="margin:0;padding:0;background-color:#09090d;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;color:#f4f4f5;">' +
  '  <center style="width:100%;background-color:#09090d;padding:30px 0;">' +
  '    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;margin:0 auto;background:#111118;border-radius:20px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.8);">' +
  '      <tr>' +
  '        <td style="background:linear-gradient(180deg,#181824 0%,#111118 100%);padding:36px 30px 24px 30px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.08);">' +
  '          <div style="height:4px;background:linear-gradient(90deg,#ff003c,#ff3366,#ff003c);border-radius:4px;margin-bottom:24px;"></div>' +
  '          <div style="display:inline-block;background:rgba(255,0,60,0.15);border:1px solid rgba(255,0,60,0.4);border-radius:16px;padding:12px 18px;margin-bottom:14px;font-size:28px;">🛡️</div>' +
  '          <h1 style="margin:0;font-size:26px;font-weight:900;color:#ffffff;letter-spacing:1.5px;text-transform:uppercase;">SUMAIR TOOLS</h1>' +
  '          <p style="margin:6px 0 0 0;font-size:11px;font-family:Courier,monospace;color:#ff003c;letter-spacing:2px;text-transform:uppercase;font-weight:700;">ENTERPRISE MOTION GRAPHICS SUITE</p>' +
  '        </td>' +
  '      </tr>' +
  '      <tr>' +
  '        <td style="padding:36px 36px 24px 36px;">' +
  '          <h2 style="margin:0 0 14px 0;font-size:20px;font-weight:700;color:#ffffff;">Hello, ' + name + '! 👋</h2>' +
  '          <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#d4d4d8;"><strong style="color:#ffffff;">Thank you for purchasing Sumair Tools / buying from us!</strong> We are thrilled to welcome you to our professional After Effects ecosystem. Your enterprise workstation license has been provisioned and is ready for immediate activation.</p>' +
  '          <div style="margin:28px 0;background:#000000;border:2px solid #ff003c;border-radius:14px;padding:22px 20px;text-align:center;box-shadow:0 0 30px rgba(255,0,60,0.25);">' +
  '            <div style="font-size:10px;font-family:Courier,monospace;color:#a1a1aa;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;font-weight:700;">YOUR ENTERPRISE LICENSE KEY (COPY & PASTE)</div>' +
  '            <div style="font-family:Courier,monospace;font-size:24px;font-weight:900;color:#ffffff;letter-spacing:2.5px;">' + key + '</div>' +
  '            <div style="margin-top:10px;font-size:11px;color:#71717a;">Assigned to: <span style="color:#a1a1aa;font-family:Courier,monospace;">' + email + '</span></div>' +
  '          </div>' +
  '          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:20px 22px;margin-bottom:28px;">' +
  '            <h3 style="margin:0 0 14px 0;font-size:13px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:1px;">⚡ Quick 3-Step Workstation Setup:</h3>' +
  '            <ol style="margin:0;padding-left:20px;color:#a1a1aa;font-size:13px;line-height:1.8;">' +
  '              <li style="margin-bottom:8px;"><strong style="color:#ffffff;">Install Extension:</strong> Use <a href="https://sumairtools.online/#download" style="color:#ff003c;font-weight:700;">ZXP Installer</a> or our 1-Click Windows/Mac installers.</li>' +
  '              <li style="margin-bottom:8px;"><strong style="color:#ffffff;">Launch in After Effects:</strong> Open AE and go to <code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px;color:#ffffff;">Window &gt; Extensions &gt; Sumair Tools</code>.</li>' +
  '              <li><strong style="color:#ffffff;">Activate:</strong> Paste your License Key above into the activator. Your machine hardware binds automatically.</li>' +
  '            </ol>' +
  '          </div>' +
  '          <div style="text-align:center;margin-bottom:24px;">' +
  '            <a href="https://discord.gg/639znDw2tU" style="background:linear-gradient(135deg,#ff003c,#b00029);color:#ffffff;font-weight:700;border-radius:10px;padding:14px 28px;display:inline-block;text-align:center;font-size:13px;text-transform:uppercase;letter-spacing:1px;text-decoration:none;">💬 Join VIP Discord Community & Support</a>' +
  '          </div>' +
  '          <p style="margin:0;font-size:12px;color:#71717a;text-align:center;">Need help or looking for video tutorials? Visit <a href="https://sumairtools.online" style="color:#ff003c;text-decoration:none;">sumairtools.online</a> anytime.</p>' +
  '        </td>' +
  '      </tr>' +
  '      <tr>' +
  '        <td style="background:#0d0d12;padding:26px 36px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">' +
  '          <p style="margin:0 0 6px 0;font-size:11px;color:#71717a;font-family:Courier,monospace;">🔒 HARDWARE LOCKED • 1 WORKSTATION PER LICENSE</p>' +
  '          <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.5;"><strong style="color:#ffffff;">Sumair Ali Siddiqui</strong><br>Lead Developer, Sumair Tools Team<br><a href="mailto:sumairalisiddiqui@gmail.com" style="color:#ff003c;text-decoration:none;">sumairalisiddiqui@gmail.com</a> &bull; sumairtools.online</p>' +
  '        </td>' +
  '      </tr>' +
  '    </table>' +
  '  </center>' +
  '</body>' +
  '</html>';
}

function buildTextEmail(name, key, email) {
  return "SUMAIR TOOLS — ENTERPRISE LICENSE KEY\n" +
  "==================================================\n\n" +
  "Hello " + name + ",\n\n" +
  "Thank you for purchasing Sumair Tools / buying from us! Your enterprise license key is ready for immediate workstation activation.\n\n" +
  "YOUR LICENSE KEY:\n" + key + "\n\n" +
  "Assigned Email: " + email + "\n\n" +
  "QUICK 3-STEP ACTIVATION GUIDE:\n" +
  "1. Install Extension: Download SumairTools_v9.0.zxp or use our 1-click Windows/Mac bundles from https://sumairtools.online/#download\n" +
  "2. Launch in After Effects: Go to Window > Extensions > Sumair Tools\n" +
  "3. Activate: Paste your License Key into the activator prompt. Your hardware binds automatically.\n\n" +
  "SUPPORT & COMMUNITY:\n" +
  "• Official VIP Discord: https://discord.gg/639znDw2tU\n" +
  "• Website: https://sumairtools.online\n" +
  "• Direct Support: sumairalisiddiqui@gmail.com\n\n" +
  "Sumair Ali Siddiqui — Lead Developer, Sumair Tools Team\n";
}

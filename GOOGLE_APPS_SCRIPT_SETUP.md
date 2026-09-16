# 🚀 Free 60-Second Setup: Automated Email Sending on GitHub Pages

Since GitHub Pages is a static host, you can send automated emails through your Gmail account for **100% free** using **Google Apps Script** (built directly into your Google account, no Vercel or external servers needed).

---

### Step 1: Open Google Apps Script
1. Go to **[https://script.google.com/](https://script.google.com/)**
2. Make sure you are signed into your Gmail account (`sumairalisiddiqui@gmail.com`).
3. Click **"New project"** (top-left).

---

### Step 2: Paste the Script
1. Delete everything inside the editor.
2. Open `google-apps-script.js` (in this folder), copy all of its contents, and paste it into the editor.
3. Click the **💾 Save** icon (or press `Ctrl + S`). Name the project **"Sumair Tools Mailer"**.

---

### Step 3: Deploy as Web App
1. Click the blue **"Deploy"** button (top-right) > **"New deployment"**.
2. Click the gear icon ⚙️ next to "Select type" and choose **"Web app"**.
3. Configure the 3 fields:
   - **Description**: `Sumair Tools License Mailer`
   - **Execute as**: `Me (sumairalisiddiqui@gmail.com)`
   - **Who has access**: `Anyone` *(Crucial so your GitHub Pages admin panel can trigger it)*
4. Click **"Deploy"**.
5. Click **"Authorize access"**, choose your Google account, click **"Advanced"** > **"Go to Sumair Tools Mailer (unsafe)"**, and click **"Allow"**.
6. Google will give you a **Web app URL** that looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`
7. Copy this URL!

---

### Step 4: Paste into your Admin Panel
1. Open your admin panel on `https://sumairtools.online/admin.html`.
2. In the **Instant License Mint & Gmail Dispatch** section, click **"⚙️ Configure Dispatch Mode"**.
3. Paste your Web App URL and click **Save**.

🎉 **Done!** Whenever you mint a key or click `📧 Email` on `sumairtools.online`, the email will automatically be sent from your Gmail account (`sumairalisiddiqui@gmail.com`) with the sleek dark-mode HTML template!

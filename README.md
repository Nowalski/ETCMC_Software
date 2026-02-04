# ETCMC_Software

ETCMC_Software for **Windows / Linux**

📦 **Preview on GitHub:**  
👉 [ETCMC 2.0 on GitHub](https://nowalski.github.io/ETCMC_Software/)

---

## Step-by-Step Guide for Setting Up ETCMC 3.0.0

### **Step 1: Download and Installation**
Visit the official GitHub page to download **ETCMC 3.0.0**.  
🔗 [ETCMC 2.7.1 on GitHub](https://nowalski.github.io/ETCMC_Software/)  
Download the latest release to your computer.

---

### **Step 2: Run the Application**
- Locate the downloaded **ETCMC 3.0.0** executable file.  
- Right-click the file and select **“Run as administrator”** to ensure proper installation and permissions.

---

### **Step 3: Configure Port Settings**
1. Launch the ETCMC Client.  
2. Go to **Port Settings**.  
3. Set your web port to a number **above 4000** to ensure proper node communication.  
4. Click **Save** to apply changes.

---

### **Step 4: Start the Script**
Click **“Start Script”** — this will automatically open your default web browser and load the interface.

---

### **Step 5: Node Registration**
Once the interface loads in your browser, click **“Open Registration.”**

**Username Update:**  
Your username = **NFT Token ID Number**

**Email Verification:**  
- If you bought your license directly → use the same email used for purchase.  
- If you purchased your NFT license from the marketplace → any valid email works.

**ETC Wallet Confirmation:**  
Enter the same ETC wallet address used for purchasing your license.

---

### **Step 6: Configure Geth Ports**
Click the ⚙️ **gear icon** in the top-left corner to configure your Geth ports.  
🚫 **Do not use port 30304** to avoid conflicts.

---

### **Step 7: Start Your Node**
Once all configurations are saved, click **“Start Node.”**  
Your node will begin operations automatically.

> 🪙 **Note:** You only earn with a valid license obtained from the marketplace.

---

## 🧩 Compatibility

### **Windows Support**
- **OS:** Windows 7 or newer  
- ❌ No support for TinyOS or other modified Windows builds.  
  Using those is **at your own risk**.

---

### **Special Pre-Release for Linux**
- **Version:** `ETCMC_Linux.zip`  
- ⚠️ **Warning:** Pre-release only. No official support for Linux yet.  
  Intended for developers or experienced users. Proceed with caution.  
- 🧠 Requires knowledge of Linux systems — no setup assistance provided.

---

## 🧾 Changelog

### **2.7.1 – Stable (2025-10-27)**
✅ **Official Stable Release of 2.7.x Series**

- Fixed registration sync issue during NFT validation.  
- Improved balance sync on startup (faster and more reliable).  
- Added **“Reconnect”** option to re-establish lost connections automatically.  
- Updated Linux binary for better compatibility with Ubuntu 22+ and Debian 12+.  
- Fixed minor UI flickering when switching between tabs.  
- Minor API endpoint cleanup and optimization.  
- Updated migration handler for smoother transition from 2.5.x versions.  
- Minor performance optimizations and internal code cleanup.

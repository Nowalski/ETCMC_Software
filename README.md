# ETCMC_Software

Official ETCMC Node & Client Software  
**Platforms:** Windows & Linux  
**Latest Stable Release:** `3.0.6`  

🌐 Project Preview:  
https://github.com/Nowalski/ETCMC_Software

---

# 🚀 ETCMC 3.0.6

Version **3.0.6** introduces:

- ✅ Full official Linux support
- ⚡ Improved startup reliability
- 🔄 Better reconnection handling
- 🧠 Improved NFT validation logic
- 🔐 Enhanced license verification
- 🛠️ Performance & internal optimizations
- 🌐 Web dashboard stability improvements

---

# 📘 Running a Node on ETCMCv2 (Windows)

This tutorial explains how to:

- Install the Windows client
- Start it as Administrator
- Log in to the local dashboard
- Register your node with a License NFT
- Start your node

---

## ⚠️ Before You Start

You **must own a valid License NFT** before registering a node.

License tutorial:  
https://status.etcmc-monitor.org/tutorials/howto-get-a-license-nft

---

# 📑 Table of Contents

1. Requirements & Download  
2. Install the Windows Software  
3. Start the ETCMC Client as Administrator  
4. Log in to the Local Dashboard  
5. Open Registration (Manual Input)  
6. Select License NFT & Register Node  
7. Start the Node  

---

# 1️⃣ Requirements & Download

## Required First

- Windows PC  
- Valid ETCMCv2 License NFT  
- Wallet address holding the License NFT  
- Email address for registration  

---

## Download Windows Installer

Official download (.msi):

https://github.com/Nowalski/ETCMC_Software/releases/download/Setup%2FWindows/ETCMC.msi

⚠️ Important:

If your browser or antivirus blocks the file:
- Allow/Keep the file manually  
- Only proceed if downloaded from the official ETCMC GitHub release  

---

# 2️⃣ Install the Windows Software

1. Run `ETCMC.msi`
2. Complete the installation wizard
3. Finish setup

---

# 3️⃣ Start the ETCMC Client as Administrator

⚠️ This step is required.

1. Right-click the ETCMC desktop shortcut  
2. Select **Run as Administrator**
3. When the client opens, click:

```
Start
```

You should see a success popup such as:

```
The script has been started on port 5001.
```

(Default Port: **5001**)

Click **OK** to continue.

---

# 4️⃣ Log in to the Local Dashboard

After startup, your browser should open automatically.

If it does not:
- Open the local address shown in the client manually

## Default Login Credentials

Username:
```
admin
```

Password:
```
password
```

⚠️ It is recommended to change credentials after first login.

---

# 5️⃣ Open Registration (Manual Input)

1. Scroll down in the dashboard  
2. Click:

```
Open Registration
```

The Register Node dialog opens.

You will see two options:

- Connect MetaMask (automatic)
- Manual Input (manual wallet entry)

For this tutorial, use:

```
Manual Input
```

---

# 6️⃣ Select License NFT & Register Node

## 6.1 Enter Wallet Address

Paste the wallet address that holds your License NFT.

---

## 6.2 Select Available License NFT

The system will:

- Detect License NFTs in your wallet
- Show available unused licenses

Select:

- An unused License NFT  
- Enter your email address  
- Click:

```
Register Node
```

⚠️ Important:
Make sure the License NFT is **not already used by another node**.

---

# 7️⃣ Start the Node

After successful registration:

1. Return to the dashboard  
2. Click:

```
Start Node
```

Your node will now begin operation.

You can monitor:

- Node status
- Balance progress
- Sync state
- Network connectivity

---

# 🐧 Linux Installation (Fully Supported in 3.0.6)

Linux is officially supported starting from version **3.0.6**.

---

## One-Line Installer

Run:

```bash
bash <(wget -qO- https://github.com/Nowalski/ETCMC_Software/releases/download/Setup%2FWindows/etcmc_installer.sh)
```

This script will:

- Download the latest Linux build
- Install dependencies
- Configure environment
- Start ETCMC client

---

## Supported Distributions

- Ubuntu 20.04+
- Ubuntu 22.04+
- Debian 11+
- Debian 12+
- Most modern Debian-based systems

---

## Linux Requirements

- Minimum 6GB RAM
- Stable internet connection
- Open required ports
- Basic terminal knowledge recommended

Default dashboard port: **5001**

---

# 🧩 System Compatibility

## Windows

- Windows 7+
- Windows 10
- Windows 11
- Windows Server supported

❌ Modified Windows builds (TinyOS etc.) are not supported.

---

## Linux

Fully supported as of 3.0.6.

---

# 🆕 Changelog

## 3.0.0 – Major Release

- Official Linux Support
- Improved Node Startup Reliability
- Improved License Validation Logic
- Enhanced Network Stability
- Faster Balance Sync
- Web Interface Improvements
- Internal Code Cleanup
- Reconnection Stability Improvements

---

# 📌 Notes

- Always use the latest stable release
- Ensure ports are properly configured
- License NFT ownership is verified automatically
- Earnings require a valid active license

---

# 📄 Official Release

Windows Installer:
https://github.com/Nowalski/ETCMC_Software/releases/download/Setup%2FWindows/ETCMC.msi

Linux Installer Script:
https://github.com/Nowalski/ETCMC_Software/releases

---

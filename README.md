# EnergyChain Project

Deployed on: [🔗]((https://bushhhhhh-ffyxzx6p5-muskans-projects-da81f34d.vercel.app/)) [[bush-amber.vercel.app](https://bushhhhhh-ffyxzx6p5-muskans-projects-da81f34d.vercel.app/)


## 🚀 Overview

This project leverages blockchain technology integrated with real-time data processors such as IoT devices to create a platform for carbon credit and electricity trading. By utilizing **privacy-preserving technologies like zk-SNARKs, the platform ensures transparent transactions while maintaining user privacy. The system facilitates **secure, traceable, and privacy-preserving trading to promote sustainability and efficient energy markets.

---

## ⚡ Problem Statement

The project addresses three key challenges in the energy sector:

- 🔒 Energy Security
- ⚖ Energy Equity
- 🌱 Environmental Sustainability

### 🎯 Objectives

- Enable transparent smart grid systems with direct prosumer participation.
- Automate carbon credit trading with real-time verification.
- Implement privacy-preserving mechanisms using zk-SNARKs.
- Integrate IoT devices and smart meters to track energy consumption.
- Ensure scalability for both small-scale and large energy producers.

---

## 📦 Deliverables

- System Architecture showcasing blockchain-based trading.
- Smart Contracts and IoT integration modules.
- ZK-SNARK circuits for privacy protection.
- Peer-to-Peer Energy Trading Demonstration.
- Complete Source Code for deployment.

---

## 🛠 Approach

- Blockchain ensures secure and transparent transactions.
- Smart contracts automate peer-to-peer trading.
- zk-SNARKs protect sensitive user data.
- IoT integration tracks and validates trades in real-time.
- Decentralized storage ensures secure and immutable records.
- Focus on energy equity and market efficiency by reducing intermediaries.

---

## 🧰 Tech Stack

### 🌐 Frontend

- TypeScript
- React
- Tailwind CSS
- Vite

### 🔐 Backend (Blockchain)

- Solidity
- Remix
- zk-SNARKs

### 📂 Storage

- IPFS
- Pinata
- Alchemy

### 🛠 Development Tools

- Node.js
- npm
- Git
- ESLint

### ⚙ Configuration

- TypeScript Config (tsconfig)
- PostCSS

---

## 📋 Setup Instructions

Follow these steps to deploy the project on your local machine:

### 1️⃣ Clone the Repository

bash
git clone https://github.com/sristivats/bush.git


### 2️⃣ Install Dependencies

Navigate to the project directory and install required modules:

bash``
cd bush
npm install
``


### 3️⃣ Run the Application

Start the development server:

bash``
npm run dev
``
## dApp demo

### Watch the Video

You can view the Demo video on Google Drive by clicking the link below:

[Watch the Video](https://drive.google.com/file/d/1_VHosx_xXTjfTaL9j64KoBBqjLDv1vQB/view?usp=drive_link)

## dApp flow Screenshots

![image](https://github.com/user-attachments/assets/35d8d65a-3c65-4299-99c3-142695aeaf73)
![image](https://github.com/user-attachments/assets/6ccb4de6-c5ae-4eb4-8de4-320fd1e69d42)
![image](https://github.com/user-attachments/assets/65adee1e-e323-4361-b9d7-d812f7e7f11b)
![image](https://github.com/user-attachments/assets/d11ff12c-678e-471a-9511-2795c5cd902c)
![image](https://github.com/user-attachments/assets/1d60a98c-2338-4cee-92f8-c8f6a642e764)


# 📡 IoT Integration Flow Documentation

## 📄 Overview
This application is currently running with mock data and real-time updates to simulate the full integration process. The actual IoT integration will follow the structured workflow detailed below.

---

## 🛠 Integration Plan

### 1️⃣ Data Collection from IoT Devices and Smart Meters
   - IoT devices and smart meters continuously monitor and collect data.
   - This data is formatted and saved into a JSON file.

---

### 2️⃣ Storing Data on IPFS
   - The JSON file is uploaded to the InterPlanetary File System (IPFS).
   - A unique Content Identifier (CID) or hash is generated after successful storage.

---

### 3️⃣ Storing the Hash on Blockchain
   - The generated CID is stored on the blockchain.
   - We utilize Alchemy to handle blockchain transactions and storage operations.

---

### 4️⃣ Data Retrieval Process
   To retrieve and access the data:
   1. Fetch the CID: Retrieve the hash stored on the blockchain.
   2. Retrieve Data: Use the CID to fetch the actual JSON data file from **IPFS.

---

## 🧩 Key Components

| Component            | Description                                        |
|--------------------------|---------------------------------------------------------|
| 🌐 IoT Devices & Smart Meters | Real-time data sources that collect and monitor system metrics. |
| 📦 IPFS (InterPlanetary File System) | Decentralized, peer-to-peer storage system for large-scale data. |
| 🔒 Blockchain         | Immutable ledger for securely storing IPFS CIDs (hashes).  |
| ⚡ Alchemy             | Blockchain infrastructure provider for managing transactions. |

---

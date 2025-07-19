# BudgetMind

# 💰 BudgetMind - Smart Personal Finance Manager

BudgetMind is an **intelligent personal finance management system** that combines **automation** with **user flexibility**. It helps users manage their salary, budgets, bills, and wishlist items in a way that guarantees financial stability while offering full manual control.

---

## 🚀 Features

### 🎯 Salary & Wallet Management
- Automatically distributes salary across multiple wallets:
  - **Secure Saving (Main Wallet):** Long-term savings.
  - **Spending Wallet (Temporary):** Day-to-day expenses.
  - **Wishlist Saving:** Funds allocated for wishlist items.
  - **Bill Saving (Fixed Wallet):** Reserved for monthly bills.
- Dynamically adjusts daily budget based on user’s salary cycle.

### 🛒 Wishlist
- Add products with cost, priority, and purchase timeline.
- Gradual saving based on months left and priority.
- Allows buying wishlist items even if unfunded, using fallback options.
- Avoids deducting from the same product while processing purchases.

### 🧾 Bill Management
- Permanent bills (recurring monthly) and non-permanent bills (e.g., EMI for limited months).
- Automatically checks whether bills are funded and paid.

### 📊 Insights & Previews
- **Bar Charts:** Visualize current month’s expenses across categories.
- **Tips Box:** Advises on how much to spend to avoid unpaid bills or wishlist delays.
- Risk indicators for overspending.

### ⚙️ Advanced Logic
- Secure Saving thresholds ensure critical savings aren’t accidentally drained.
- Midnight jobs for:
  - Distributing salary
  - Refilling Secure Saving

### 🛒 Priority-based Wishlist Management

BudgetMind introduces **smart priority handling** for wishlist items to ensure important goals are always on track.

✅ **Distribution (Adding Money):**
- Higher priority items receive funds first.
- This guarantees **top-priority products** can be purchased within the user’s target month.

✅ **Gradual Deduction (Taking Money Out):**
- When the user requests extra funds from wishlist savings:
  - Low-priority items are used first.
  - But funds are **deducted gradually across multiple items** to avoid draining any single item too quickly.
  - Timeline (months left) is adjusted for each item as funds are deducted.


---

## 📸 Screenshots

### 📝 Sign Up
<img src="./asset/sign-up-budget-mind.png" alt="SignUp" />

### 🔑 Sign In
<img src="./asset/sign-in-budget-mind.png" alt="SignIn" />

### 📊 Dashboard Overview
<img src="./asset/overview-budget-mind.png" alt="Dashboard" />

### 💵 Expenses Tracking
<img src="./asset/expenses-budget-mind.png" alt="Expenses" />

### 🛍️ Wishlist Management
<img src="./asset/wishlist-budget-mind.png" alt="Wishlist" />

### 🧾 Bills Management
<img src="./asset/bills-budget-mind.png" alt="Bills" />

### 👤 Account Settings
<img src="./asset/account-budget-mind.png" alt="Account" />

### ➕ Add Expense (Before Filling)
<img src="./asset/add-expense-budget-mind.png" alt="Add Expense Before" />

### ✅ Add Expense (After Filling)
<img src="./asset/add-expense-filled-budget-mind.png" alt="Add Expense After" />


---

## 🛠 Tech Stack

- **Frontend:** React.js (with Material UI)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Authentication:** JWT (with refresh tokens)
- **Caching:** NodeCache for faster user context retrieval
- **Export:** Excel export for expense history

---

## 📂 Project Structure

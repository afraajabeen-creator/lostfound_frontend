# 📦 Git Commands for Frontend Repository

Follow these exact steps to push this frontend folder to its own GitHub repository.

---

## 1. Create an Empty Repository on GitHub First

1. Log into your GitHub account at [https://github.com](https://github.com).
2. Click the **+** icon in the top-right corner and choose **New repository**.
3. Set the Repository name to: `lostfound-frontend`.
4. Choose **Public** (or Private).
5. ⚠️ **IMPORTANT**: Leave the following checkboxes **UNCHECKED**:
   - ❌ Do NOT check "Add a README file"
   - ❌ Do NOT check "Add .gitignore"
   - ❌ Do NOT check "Choose a license"
   *(This ensures you create a completely empty repository).*
6. Click **Create repository**.
7. Copy the repository URL (e.g., `https://github.com/<your-username>/lostfound-frontend.git`).

---

## 2. Push Your Local Code from Terminal / CMD

Open Command Prompt (`cmd`) or PowerShell, navigate directly inside this frontend directory:
```cmd
cd %USERPROFILE%\Desktop\tt\lostfound_frontend
```

Run the following commands in order:

### 1. Initialize Git
```cmd
git init
```

### 2. Stage All Files
```cmd
git add .
```

### 3. Check Git Status
```cmd
git status
```
> Confirm that `node_modules` and `.env` are NOT listed (they are excluded by `.gitignore`).

### 4. Create Initial Commit
```cmd
git commit -m "Initial lost and found frontend"
```

### 5. Rename Default Branch to main
```cmd
git branch -M main
```

### 6. Link Remote GitHub Repository
*(Replace `<your-username>` with your actual GitHub username)*
```cmd
git remote add origin https://github.com/<your-username>/lostfound-frontend.git
```

### 7. Push to GitHub
```cmd
git push -u origin main
```

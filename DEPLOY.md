# 🚀 Frontend Deployment Guide (Step-by-Step for Beginners)

This guide walks you through deploying your React frontend to **Vercel** or **Netlify** for free in under 5 minutes.

---

## ⚡ Option A: Deploy on Vercel (Recommended)

1. Push your `lostfound_frontend` code to your GitHub repository (see [GIT_COMMANDS.md](file:///c:/Users/Afraa/Desktop/TT/lostfound_frontend/GIT_COMMANDS.md)).
2. Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account.
3. Click **Add New...** > **Project**.
4. Import your `lostfound-frontend` repository from the list.
5. In the **Configure Project** screen:
   - **Framework Preset**: Vite (detected automatically).
   - **Root Directory**: `./` (leave default).
   - **Build Command**: `npm run build` (leave default).
   - **Output Directory**: `dist` (leave default).
6. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_URL`
   - **Value**: Your live Render backend URL (e.g. `https://lostfound-backend-xyz.onrender.com`).
     *(If testing locally first, you can use your ngrok or local URL).*
7. Click **Deploy**.
8. In about 45 seconds, your app will be live! Vercel provides a custom URL like `https://lostfound-frontend.vercel.app`.
   > **Note:** The `vercel.json` file in this repository is already configured to handle React Router client-side routing rewrites so page reloads work seamlessly without 404 errors.

---

## 🌐 Option B: Deploy on Netlify

1. Go to [https://www.netlify.com](https://www.netlify.com) and log in with GitHub.
2. Click **Add new site** > **Import an existing project**.
3. Select GitHub and choose your `lostfound-frontend` repository.
4. Set the build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Add environment variables**:
   - `VITE_API_URL`: Your live backend URL (e.g. `https://lostfound-backend-xyz.onrender.com`).
6. Click **Deploy lostfound-frontend**.
   > **Note:** The `public/_redirects` file in this repository ensures that all routes redirect properly to `index.html 200` on Netlify.

---

## 🔄 Final Step: Update CORS Origins on Backend

Once your frontend is deployed:
1. Copy your frontend URL (e.g., `https://lostfound-frontend.vercel.app`).
2. Go to your **Render** dashboard for `lostfound-backend`.
3. Open **Environment Variables** and edit `CORS_ORIGINS` to include your new domain:
   ```
   http://localhost:5173,https://lostfound-frontend.vercel.app
   ```
4. Save changes. Render will automatically redeploy the backend with the new allowed CORS origin.

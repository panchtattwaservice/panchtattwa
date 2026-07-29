# Deploying PanchTattwa to Railway

## Prerequisites
- A [Railway](https://railway.app) account
- Your code pushed to GitHub (use Emergent's "Save to GitHub" button)

---

## Step 1: Create a Railway Project

1. Go to [railway.app/dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Empty Project"**

---

## Step 2: Add PostgreSQL Database

1. In your project, click **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Railway will provision a PostgreSQL instance automatically
3. Click on the PostgreSQL service → **"Variables"** tab
4. Copy the `DATABASE_URL` value (you'll need it for the backend)

> **Note:** Railway's `DATABASE_URL` uses `postgresql://` prefix. Your backend expects `postgresql+asyncpg://`. You'll set this as a variable in Step 3.

---

## Step 3: Deploy the Backend

1. In your project, click **"+ New"** → **"GitHub Repo"**
2. Select your repository
3. Railway will auto-detect the repo. Click **"Settings"** and set:
   - **Root Directory:** `backend`
   - **Builder:** Dockerfile
4. Go to the **"Variables"** tab and add:

```
DATABASE_URL=postgresql+asyncpg://<user>:<password>@<host>:<port>/<dbname>
```
> Replace the values from Railway's PostgreSQL connection string. Change `postgresql://` to `postgresql+asyncpg://`

```
ADMIN_EMAIL=rahulsingh2k10@gmail.com
CORS_ORIGINS=https://<your-frontend-domain>.up.railway.app
PORT=8001
```

5. Go to **"Settings"** → **"Networking"** → **"Generate Domain"** to get a public URL
6. Note down the backend URL (e.g., `https://panchtattwa-backend.up.railway.app`)

---

## Step 4: Deploy the Frontend

1. In your project, click **"+ New"** → **"GitHub Repo"**
2. Select the same repository again
3. Click **"Settings"** and set:
   - **Root Directory:** `frontend`
   - **Builder:** Dockerfile
4. Go to the **"Variables"** tab and add:

```
REACT_APP_BACKEND_URL=https://<your-backend-domain>.up.railway.app
```
> Use the backend URL from Step 3

5. Go to **"Settings"** → **"Networking"** → **"Generate Domain"**

---

## Step 5: Update CORS

After both services are deployed, go back to the **backend service** → **Variables** and update:

```
CORS_ORIGINS=https://<your-frontend-domain>.up.railway.app
```

Redeploy the backend for changes to take effect.

---

## Step 6: Configure Custom Domain (Optional)

1. Go to either service → **Settings** → **Networking** → **Custom Domain**
2. Add your domain and configure DNS as instructed by Railway

---

## Environment Variables Summary

### Backend
| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql+asyncpg://<from-railway-postgres>` |
| `ADMIN_EMAIL` | `rahulsingh2k10@gmail.com` |
| `CORS_ORIGINS` | `https://<frontend-domain>.up.railway.app` |

### Frontend
| Variable | Value |
|----------|-------|
| `REACT_APP_BACKEND_URL` | `https://<backend-domain>.up.railway.app` |

---

## Troubleshooting

- **Database connection fails:** Ensure you changed `postgresql://` to `postgresql+asyncpg://` in the DATABASE_URL
- **CORS errors:** Update `CORS_ORIGINS` in the backend to match your frontend's exact domain
- **Auth not working:** Google OAuth redirects back to the frontend URL. Make sure the frontend is accessible at the URL you expect
- **502 errors:** Check Railway logs for the backend service. Common issue is missing environment variables

---

## Cost Estimate (Railway)
- **Hobby Plan:** $5/month (includes $5 of usage credits)
- **PostgreSQL:** ~$0.000231/hr (~$5/month)
- **Backend + Frontend:** ~$0.000231/hr each
- **Total estimate:** ~$10-15/month for light usage

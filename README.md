# Full-Stack Project - Setup Guide

This document explains how to run the full-stack project (React frontend, Laravel backend, MySQL database accessed via phpMyAdmin). Follow the steps below to set up the environment, run development servers, import the database, and connect the frontend to the backend.

---

## Overview

- Frontend: React (Vite)
- Backend: Laravel (PHP)
- Database: MySQL (use phpMyAdmin for imports)

---

## System Requirements

- Git
- Node.js (recommended >= 16.x) and npm (or Yarn)
- PHP (recommended >= 8.0)
- Composer (latest stable)
- MySQL (recommended >= 5.7 / 8.x)
- phpMyAdmin (or any MySQL client)
- Optional: Docker/Docker Compose (if you prefer containers)

Make sure the PHP extensions required by Laravel are installed: `pdo`, `pdo_mysql`, `mbstring`, `openssl`, `json`, `tokenizer`, `xml`, `gd` (if using image processing).

---

## Backend (Laravel) — Setup and Run

1. Clone the repository and open a terminal:

```powershell
git clone https://github.com/elshourbagi97/arabic-web.git
cd arabic-web\backend

2. Install PHP dependencies with Composer:
composer install

3. Create the environment file:

Windows PowerShell:
copy .env.example .env

macOS / Linux:
cp .env.example .env

4. Edit .env to set your database credentials and other settings.

Option 1 – Use remote Railway DB:

DB_CONNECTION=mysql
DB_HOST="crossover.proxy.rlwy.net:43371"
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=vHFzsyGAueEHcvXTSVbgqDgCDhQENOIU
Option 2 – Use local MySQL DB:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=arabic_web
DB_USERNAME=root
DB_PASSWORD=your_local_password
⚠️ If using local DB, import the database dump first (see section below).

Generate the application key:

php artisan key:generate
Run database migrations (creates tables). If you have seeders, run them too:

php artisan migrate
# optional: php artisan db:seed
Start the Laravel development server:

php artisan serve --host=127.0.0.1 --port=8000
Your API will be available at http://127.0.0.1:8000 (API endpoints often start with /api).

Notes:

If you run into Composer memory issues on Windows, try increasing memory or use COMPOSER_MEMORY_LIMIT=-1 composer install.

If you use Docker, follow the repository Docker instructions (if provided) or run a MySQL container and configure .env accordingly.

Database Import via phpMyAdmin
If you have a SQL dump file (.sql) provided by the project, use phpMyAdmin to import it:

Open phpMyAdmin in your browser (example: http://localhost:8080/phpmyadmin or http://localhost/phpmyadmin depending on your setup).

Login with your MySQL username/password.

Create a new database with the name you set in .env (for example arabic_web).

Select the new database in phpMyAdmin, go to the Import tab.

Click Choose file, select the .sql file, leave default options, and click Go.

If the import is large, you may need to import via the MySQL CLI:

mysql -u root -p arabic_web < path\to\dump.sql
After importing, verify tables are present and then run php artisan migrate only if migrations are required.

Frontend (React / Vite) — Setup and Run
Open a new terminal and navigate to the frontend folder:

cd arabic-web\frontend
Install dependencies:

# npm (recommended)
npm install

# or yarn
yarn install
Configure the API base URL used by the frontend.

This project uses Vite environment variables. Edit the development value in frontend/API_CONFIG.ts or set VITE_API_URL in the frontend .env file.

Example in frontend/API_CONFIG.ts (development):

VITE_API_URL: "http://127.0.0.1:8000/api";
Or create frontend/.env with:

VITE_API_URL=http://127.0.0.1:8000/api
Start the development server (Vite):

npm run dev
# or
yarn dev
This should open the frontend at something like http://localhost:5173.

Build for production:

npm run build
# then preview or deploy the `dist` folder
npm run preview
Connecting Frontend to Backend (API URL)
The frontend reads VITE_API_URL (see frontend/API_CONFIG.ts). Set it to the backend URL plus /api if endpoints are under that prefix. Example:

VITE_API_URL=http://127.0.0.1:8000/api
If you use the Laravel server above, point to http://127.0.0.1:8000 or http://localhost:8000.

If the frontend is served on a different origin (port), ensure CORS is enabled in Laravel (config/cors.php) and allowed origins include your frontend origin (e.g., http://localhost:5173).

Common Troubleshooting
Laravel returns 500 or 503:

Check storage/logs/laravel.log for details.

Ensure required PHP extensions are installed.

Database connection errors:

Verify .env DB credentials and that MySQL is running.

Ensure the database name exists (create via phpMyAdmin).

Migrations fail with missing tables/columns:

Run php artisan migrate after setting .env correctly.

If you imported a dump, avoid re-running migrations that duplicate tables. Use php artisan migrate:fresh --seed only if you want to reset the DB.

Composer install fails with memory issues (Windows):

Run: php -d memory_limit=-1 composer install or set COMPOSER_MEMORY_LIMIT=-1.

npm install / build issues:

Delete node_modules and reinstall: Remove-Item -Recurse node_modules (PowerShell).

CORS issues (blocked requests):

Make sure config/cors.php allows your frontend origin or use the proxy in vite.config.ts.

Laravel environment changes not reflected:

Run php artisan config:clear and php artisan cache:clear.

Permission issues storing files:

Run php artisan storage:link and ensure storage and bootstrap/cache are writable by the webserver user.

Useful Commands Summary
Backend (from /backend):

composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
Frontend (from /frontend):

npm install
npm run dev
npm run build
Database (import via CLI):

mysql -u root -p arabic_web < path\to\dump.sql

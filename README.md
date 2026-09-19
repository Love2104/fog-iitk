# Fog Prediction Web Application

This repository contains the Fog Prediction web application for IIT Kanpur.

## Local Development Setup

To run this website locally on Linux, a standalone PHP engine has been configured so that it runs out of the box without needing a complex Apache/Nginx setup.

### Starting the Server
1. Open your terminal in this project directory.
2. Run the included startup script:
   ```bash
   ./run_server.sh
   ```
3. Open your web browser and navigate to:
   **http://localhost:8000**

## Database Requirements (Important)

Your mentor correctly pointed out that this application originally required a PostgreSQL database connection to function. 

**Do you need the database backup to run it locally?**
**No and Yes.**

* **No, you do not need it just to run and view the website.** The PHP code has been heavily modified to be "offline-safe". If the database is not found, the website will automatically:
  - Fall back to reading station locations from local CSV files (`location_with_row&col.csv`) so the interactive map works.
  - Fail gracefully (returning empty datasets) instead of throwing fatal PHP errors, so the website's layout and JavaScript won't crash.
  - Skip visitor logging smoothly.

* **Yes, you do need it if you want to view real historical sensor data, forecasts, and charts.** The CSV fallback only covers the map locations. The actual prediction charts and meteorological data (from tables like `public.meteorological_data`, `public.visdata`, `public.three_hour_fog_prediction`) are stored entirely in the database.

### How to set up the Database (If you receive the backup)

If your mentor provides you with the PostgreSQL database backup (`.sql` or `.dump` file), follow these steps to restore it:

1. **Install PostgreSQL**
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```

2. **Start PostgreSQL**
   ```bash
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

3. **Create the Database and User**
   The application expects a specific user and database. Run the following commands:
   ```bash
   sudo -u postgres psql -c "CREATE USER chaman WITH PASSWORD 'chaman123';"
   sudo -u postgres psql -c "CREATE DATABASE fogprediction OWNER chaman;"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE fogprediction TO chaman;"
   ```

4. **Restore the Backup**
   Assuming you receive a file named `fogprediction_backup.sql`:
   ```bash
   sudo -u postgres psql -d fogprediction -f /path/to/fogprediction_backup.sql
   ```

Once restored, the PHP scripts will automatically detect that the database is online and start fetching real sensor data and forecasts for the charts.

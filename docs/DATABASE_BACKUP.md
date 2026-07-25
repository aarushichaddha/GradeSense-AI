# GradeSense AI — PostgreSQL Backup & Restore Strategy

This guide details the automated backup schedule, retention policy, and emergency restore procedures for the **GradeSense AI** PostgreSQL database.

---

## Backup Strategy Overview

- **Daily Automated Backup**: Compressed `pg_dump` SQL custom archive format (`.dump`).
- **Retention Period**: 30 days locally, 365 days on offsite S3/Azure cold storage.
- **Partition Isolation**: Time-series sensor data partitions backed up incrementally.

---

## 1. Automated Cron Backup Script (`scripts/backup_db.sh`)

Create `/usr/local/bin/backup_gradesense_db.sh`:

```bash
#!/bin/bash
set -e

BACKUP_DIR="/var/backups/gradesense_db"
TIMESTAMP=$(date +%Y%m%m_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/gradesense_db_${TIMESTAMP}.dump"

mkdir -p ${BACKUP_DIR}

echo "[$(date)] Starting PostgreSQL backup for gradesense_db..."

docker exec -t gradesense_postgres pg_dump -U gradesense_user -F c -b -v -f /tmp/backup.dump gradesense_db
docker cp gradesense_postgres:/tmp/backup.dump ${BACKUP_FILE}

# Remove old backups older than 30 days
find ${BACKUP_DIR} -type f -name "*.dump" -mtime +30 -delete

echo "[$(date)] Backup completed successfully: ${BACKUP_FILE}"
```

Make executable and add to crontab:
```bash
chmod +x /usr/local/bin/backup_gradesense_db.sh
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup_gradesense_db.sh >> /var/log/db_backup.log 2>&1") | crontab -
```

---

## 2. Emergency Restore Procedure

To restore the database from a backup file:

1. **Stop Application Backend to prevent active writes:**
   ```bash
   docker-compose stop backend
   ```

2. **Restore Database via `pg_restore`:**
   ```bash
   docker cp /var/backups/gradesense_db/gradesense_db_20260725_100000.dump gradesense_postgres:/tmp/restore.dump
   docker exec -t gradesense_postgres pg_restore -U gradesense_user -d gradesense_db --clean --if-exists /tmp/restore.dump
   ```

3. **Restart Backend Service:**
   ```bash
   docker-compose start backend
   ```

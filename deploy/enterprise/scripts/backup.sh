#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# Universal Crypto MCP - Database Backup Script
# ═══════════════════════════════════════════════════════════════════════════════
#
# Automated PostgreSQL backup with rotation and optional S3 upload
#
# @author nirholas
# @license Apache-2.0
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${BACKUP_DIR:-$DEPLOY_DIR/backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"; }

# Load environment
if [ -f "$DEPLOY_DIR/.env" ]; then
    set -a
    source "$DEPLOY_DIR/.env"
    set +a
fi

POSTGRES_USER="${POSTGRES_USER:-ucm}"
POSTGRES_DB="${POSTGRES_DB:-ucm_payments}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="ucm_backup_${TIMESTAMP}"

usage() {
    echo "Usage: $0 [OPTIONS] COMMAND"
    echo ""
    echo "Commands:"
    echo "  backup     Create a new backup"
    echo "  restore    Restore from a backup"
    echo "  list       List available backups"
    echo "  cleanup    Remove old backups"
    echo ""
    echo "Options:"
    echo "  --file FILE    Specify backup file for restore"
    echo "  --s3           Upload backup to S3"
    echo "  --days N       Retention days (default: 30)"
    echo "  -h, --help     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 backup"
    echo "  $0 backup --s3"
    echo "  $0 restore --file ucm_backup_20240101_120000.sql.gz"
    echo "  $0 cleanup --days 7"
}

create_backup() {
    log_info "Starting database backup..."
    
    mkdir -p "$BACKUP_DIR"
    
    local backup_file="$BACKUP_DIR/${BACKUP_NAME}.sql.gz"
    
    # Check if database is running
    if ! docker compose -f "$DEPLOY_DIR/docker-compose.enterprise.yml" ps postgres 2>/dev/null | grep -q "running"; then
        log_error "PostgreSQL container is not running!"
        exit 1
    fi
    
    # Create backup
    log_info "Dumping database..."
    docker compose -f "$DEPLOY_DIR/docker-compose.enterprise.yml" exec -T postgres \
        pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists | gzip > "$backup_file"
    
    local size
    size=$(du -h "$backup_file" | cut -f1)
    log_success "Backup created: $backup_file ($size)"
    
    # Create latest symlink
    ln -sf "$backup_file" "$BACKUP_DIR/latest.sql.gz"
    
    # Upload to S3 if requested
    if [ "${UPLOAD_S3:-false}" = "true" ]; then
        upload_to_s3 "$backup_file"
    fi
    
    # Log backup metadata
    echo "$TIMESTAMP,$backup_file,$size" >> "$BACKUP_DIR/backup_log.csv"
    
    return 0
}

restore_backup() {
    local restore_file="$1"
    
    if [ -z "$restore_file" ]; then
        log_error "Please specify a backup file with --file"
        exit 1
    fi
    
    # Handle relative paths
    if [[ ! "$restore_file" = /* ]]; then
        restore_file="$BACKUP_DIR/$restore_file"
    fi
    
    if [ ! -f "$restore_file" ]; then
        log_error "Backup file not found: $restore_file"
        exit 1
    fi
    
    log_warning "This will overwrite the current database!"
    read -p "Are you sure you want to continue? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        log_info "Restore cancelled."
        exit 0
    fi
    
    log_info "Restoring from: $restore_file"
    
    # Create a backup of current state first
    log_info "Creating backup of current state..."
    local safety_backup="$BACKUP_DIR/pre_restore_${TIMESTAMP}.sql.gz"
    docker compose -f "$DEPLOY_DIR/docker-compose.enterprise.yml" exec -T postgres \
        pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" | gzip > "$safety_backup"
    log_info "Safety backup created: $safety_backup"
    
    # Restore
    log_info "Restoring database..."
    
    if [[ "$restore_file" == *.gz ]]; then
        gunzip -c "$restore_file" | docker compose -f "$DEPLOY_DIR/docker-compose.enterprise.yml" exec -T postgres \
            psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
    else
        docker compose -f "$DEPLOY_DIR/docker-compose.enterprise.yml" exec -T postgres \
            psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < "$restore_file"
    fi
    
    log_success "Database restored successfully!"
}

list_backups() {
    log_info "Available backups in $BACKUP_DIR:"
    echo ""
    
    if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]; then
        log_warning "No backups found"
        return
    fi
    
    echo "┌──────────────────────────────────────────────────────────────┐"
    printf "│ %-40s │ %-8s │ %-8s │\n" "Filename" "Size" "Age"
    echo "├──────────────────────────────────────────────────────────────┤"
    
    for f in "$BACKUP_DIR"/*.sql.gz; do
        if [ -f "$f" ]; then
            local filename
            filename=$(basename "$f")
            local size
            size=$(du -h "$f" | cut -f1)
            local age
            age=$(( ($(date +%s) - $(stat -c %Y "$f")) / 86400 ))
            printf "│ %-40s │ %-8s │ %3d days │\n" "$filename" "$size" "$age"
        fi
    done
    
    echo "└──────────────────────────────────────────────────────────────┘"
    
    # Show total size
    local total_size
    total_size=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
    echo ""
    log_info "Total backup size: $total_size"
}

cleanup_backups() {
    log_info "Cleaning up backups older than $RETENTION_DAYS days..."
    
    if [ ! -d "$BACKUP_DIR" ]; then
        log_warning "No backup directory found"
        return
    fi
    
    local deleted=0
    
    find "$BACKUP_DIR" -name "*.sql.gz" -type f -mtime +$RETENTION_DAYS | while read -r file; do
        log_info "Deleting: $(basename "$file")"
        rm -f "$file"
        deleted=$((deleted + 1))
    done
    
    if [ $deleted -eq 0 ]; then
        log_info "No old backups to delete"
    else
        log_success "Deleted $deleted old backup(s)"
    fi
}

upload_to_s3() {
    local file="$1"
    
    if [ -z "${S3_BUCKET:-}" ]; then
        log_warning "S3_BUCKET not set, skipping S3 upload"
        return
    fi
    
    if ! command -v aws &> /dev/null; then
        log_warning "AWS CLI not installed, skipping S3 upload"
        return
    fi
    
    log_info "Uploading to S3: s3://$S3_BUCKET/backups/"
    
    aws s3 cp "$file" "s3://$S3_BUCKET/backups/$(basename "$file")" \
        --storage-class "${S3_STORAGE_CLASS:-STANDARD_IA}"
    
    log_success "Uploaded to S3"
}

# Parse arguments
COMMAND=""
RESTORE_FILE=""
UPLOAD_S3=false

while [[ $# -gt 0 ]]; do
    case $1 in
        backup|restore|list|cleanup)
            COMMAND="$1"
            shift
            ;;
        --file)
            RESTORE_FILE="$2"
            shift 2
            ;;
        --s3)
            UPLOAD_S3=true
            shift
            ;;
        --days)
            RETENTION_DAYS="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            ;;
    esac
done

# Main
case "${COMMAND:-backup}" in
    backup)
        create_backup
        ;;
    restore)
        restore_backup "$RESTORE_FILE"
        ;;
    list)
        list_backups
        ;;
    cleanup)
        cleanup_backups
        ;;
    *)
        log_error "Unknown command: $COMMAND"
        usage
        exit 1
        ;;
esac


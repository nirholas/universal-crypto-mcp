# Database Setup Guide

This guide provides detailed instructions for setting up the PostgreSQL database required by the MCP Blockchain Server.

## Prerequisites

- PostgreSQL 14 or higher
- Database management permissions

## Installation

### macOS

```bash
# Install PostgreSQL using Homebrew
brew install postgresql

# Start the PostgreSQL service
brew services start postgresql
```

### Linux (Ubuntu/Debian)

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start the PostgreSQL service
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### Windows

1. Download the PostgreSQL installer from the [official website](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the instructions
3. Make sure the PostgreSQL service is running

## Database Creation

After installing PostgreSQL, create the database for the project:

```bash
# Create the database
createdb mcp_blockchain

# Verify the database was created
psql -l
```

If you need to specify a user or host:

```bash
createdb -U postgres -h localhost mcp_blockchain
```

## Environment Configuration

Update your `.env` file with the correct database connection string:

```
# For default macOS Homebrew installation (no password)
DATABASE_URL=postgres://your_username@localhost:5432/mcp_blockchain

# For installations with password
DATABASE_URL=postgres://username:password@localhost:5432/mcp_blockchain

# For custom port
DATABASE_URL=postgres://username:password@localhost:custom_port/mcp_blockchain
```

Replace `username`, `password`, and `custom_port` with your actual PostgreSQL credentials.

## Running Migrations

Initialize your database schema using Prisma migrations:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

This will create all the necessary tables according to the schema defined in `prisma/schema.prisma`.

## Verifying Setup

You can verify your database setup using Prisma Studio:

```bash
npx prisma studio
```

This will open a web interface at http://localhost:5555 where you can browse and manage your database.

## Troubleshooting

### Connection Issues

If you encounter connection issues:

1. Verify PostgreSQL is running:
   ```bash
   # macOS
   brew services list | grep postgresql
   
   # Linux
   sudo systemctl status postgresql
   
   # Windows (PowerShell)
   Get-Service *postgres*
   ```

2. Check your connection parameters:
   ```bash
   # Test direct connection
   psql -h localhost -p 5432 -U username -d mcp_blockchain
   ```

3. Ensure your firewall allows connections to port 5432

### Permission Issues

If you encounter permission issues:

```bash
# Create a role with appropriate permissions
psql -c "CREATE ROLE your_username WITH LOGIN PASSWORD 'your_password' CREATEDB;"

# Grant necessary permissions
psql -c "GRANT ALL PRIVILEGES ON DATABASE mcp_blockchain TO your_username;"
```

### Database Reset

If you need to reset your database during development:

```bash
# Reset Prisma migrations and database
npx prisma migrate reset
```

This will drop all tables and reapply migrations.

## Using Docker

If you prefer using Docker for PostgreSQL:

```bash
# Run PostgreSQL in Docker
docker run --name mcp-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=mcp_blockchain -p 5432:5432 -d postgres:15

# Update your .env file
# DATABASE_URL=postgres://postgres:postgres@localhost:5432/mcp_blockchain
```

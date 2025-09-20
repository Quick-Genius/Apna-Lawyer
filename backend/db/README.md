# Database Management

This folder contains all database-related utilities and Supabase integration files.

## Files Overview

### Core Files
- `supabase_client.py` - Supabase client configuration and connection
- `schema.sql` - Complete database schema for Supabase setup

### Setup & Management
- `setup_database.py` - Initial Supabase database setup script
- `rls_bypass.py` - Row Level Security testing and bypass utilities

### Data Synchronization
- `sync_lawyers.py` - Sync lawyer data between Django and Supabase
- `direct_sync.py` - Direct HTTP-based Supabase synchronization

## Usage

### Initial Setup
```bash
# Set up Supabase database structure
python backend/db/setup_database.py

# Test RLS and connection
python backend/db/rls_bypass.py
```

### Data Synchronization
```bash
# Sync lawyers using Supabase client
python backend/db/sync_lawyers.py

# Direct HTTP sync (alternative method)
python backend/db/direct_sync.py
```

### Manual Schema Setup
If automated setup fails, manually run the SQL commands from `schema.sql` in your Supabase dashboard.

## Configuration

Ensure your `.env` file contains:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## Import Usage

In your Django code, import the Supabase client:
```python
from db.supabase_client import supabase
```

## Troubleshooting

1. **RLS Issues**: Use `rls_bypass.py` to test and resolve Row Level Security problems
2. **Connection Issues**: Verify credentials in `.env` file
3. **Sync Failures**: Check `setup_database.py` output for table structure issues
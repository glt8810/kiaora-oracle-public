# Supabase Integration for KiaOra Oracle

This folder contains the Supabase configuration and migrations for the KiaOra Oracle project.

## Getting Started

### Prerequisites

1. Make sure you have the Supabase CLI installed:
   ```
   npm install supabase --save-dev
   ```

2. You need Docker installed on your machine to run Supabase locally.

### Setup Supabase Locally

1. Initialize Supabase (if not already done):
   ```
   npx supabase init
   ```

2. Start Supabase locally:
   ```
   npm run supabase:start
   ```
   
   This will start a local Supabase instance with PostgreSQL, API, and Studio.

3. Access the Supabase Studio at: http://localhost:54323

### Database Migrations

Migrations are stored in the `supabase/migrations` directory.

1. To apply migrations to your local database:
   ```
   npm run supabase:migrate
   ```

2. To reset the database and reapply all migrations:
   ```
   npm run supabase:reset
   ```

3. To create a new migration, create a numbered SQL file in the migrations directory:
   ```
   touch supabase/migrations/0002_your_migration_name.sql
   ```

### Connecting to Remote Supabase Project

1. Login to Supabase:
   ```
   npx supabase login
   ```

2. Link your project:
   ```
   npx supabase link --project-ref your-project-ref
   ```

3. Deploy your migrations:
   ```
   npx supabase db push
   ```

## Database Schema

### Consultations Table

The `consultations` table stores all oracle consultation data including:

- Question asked
- Oracle response
- User ID (if logged in)
- Card information (name, meaning, image)
- Creation timestamp

## Row-Level Security Policies

The following RLS policies are implemented:

1. Users can only view their own consultations
2. Users can insert their own consultations
3. Anonymous consultations are allowed but not linked to any user

## Troubleshooting

- If you encounter issues with Supabase, try restarting the local instance:
  ```
  npm run supabase:stop
  npm run supabase:start
  ```

- For more detailed error logs, check the Docker container logs. 
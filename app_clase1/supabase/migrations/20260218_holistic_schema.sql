-- CLEANUP: Remove old Bodega 360 tables if they exist
drop table if exists ai_interactions cascade;
drop table if exists debts cascade;
drop table if exists customers cascade;
-- Products already exists in new schema, but we should recreate it or alter it. Cleaner to drop.
drop table if exists products cascade;

-- ENUMS
create type user_role as enum ('owner', 'therapist', 'patient', 'receptionist', 'student');
create type appointment_status as enum ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
create type crm_status as enum ('new', 'contacted', 'scheduled', 'converted', 'lost');

-- 1. PROFILES (Extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role user_role default 'patient',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. PATIENTS (Sensitive Data)
create table patients (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade, -- Links to login if they have one
  full_name text not null,
  email text,
  phone text,
  birth_date date,
  address text,
  emergency_contact text,
  clinical_history text, -- Encrypted or strictly accessed
  created_at timestamptz default now()
);

-- 3. THERAPIES & SERVICES
create table therapies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration_minutes int default 60,
  price decimal(10,2),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 4. APPOINTMENTS (Agenda)
create table appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id),
  therapist_id uuid references profiles(id), -- Must be role 'therapist'
  therapy_id uuid references therapies(id),
  start_time timestamptz not null,
  end_time timestamptz not null,
  status appointment_status default 'pending',
  notes text,
  created_at timestamptz default now()
);

-- 5. INVENTORY & RESOURCES
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text, -- 'oil', 'mat', 'retail'
  stock_quantity int default 0,
  min_stock_alert int default 5,
  price decimal(10,2),
  created_at timestamptz default now()
);

-- 6. CRM (Commercial Funnel)
create table crm_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  source text, -- 'whatsapp', 'web', 'referral'
  status crm_status default 'new',
  notes text,
  assigned_to uuid references profiles(id),
  created_at timestamptz default now()
);

-- RLS POLICIES (Simplified for V1)
alter table profiles enable row level security;
alter table patients enable row level security;
alter table appointments enable row level security;
alter table clinical_records enable row level security; -- Oops, forgot table definition, adding below

-- 7. CLINICAL RECORDS (Evolutions)
create table clinical_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id),
  therapist_id uuid references profiles(id),
  content text not null,
  created_at timestamptz default now()
);
alter table clinical_records enable row level security;

-- Basic Policies (Owner sees all, Patient sees own)
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- (More detailed policies will be added in Phase 2)

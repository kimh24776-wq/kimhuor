-- Kimmy PC Shop Database Schema
-- Production Ready for Supabase / PostgreSQL

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Core Tables
-- 1. Categories
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Products
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  description text,
  price decimal(12, 2) not null default 0.00,
  stock_quantity integer not null default 0,
  sku text unique,
  image_url text,
  specs jsonb default '{}'::jsonb,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. Customers
create table if not exists customers (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text unique not null,
  phone text,
  address text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 4. Employees / Users
-- Profile table extending Supabase Auth
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null check (role in ('admin', 'manager', 'staff', 'customer')) default 'staff',
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 5. Orders
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customers(id) on delete set null,
  employee_id uuid references profiles(id) on delete set null,
  total_amount decimal(12, 2) not null default 0.00,
  status text not null check (status in ('pending', 'processing', 'completed', 'cancelled')) default 'pending',
  payment_status text not null check (payment_status in ('unpaid', 'paid', 'refunded')) default 'unpaid',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 6. Order Items
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  unit_price decimal(12, 2) not null,
  total_price decimal(12, 2) not null,
  created_at timestamp with time zone default now()
);

-- 7. Inventory Logs
create table if not exists inventory_logs (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  change_amount integer not null,
  reason text,
  created_at timestamp with time zone default now()
);

-- 8. Activity Logs
create table if not exists activity_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete set null,
  action text not null,
  details jsonb,
  created_at timestamp with time zone default now()
);

-- Row Level Security (RLS) Policies
alter table profiles enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table customers enable row level security;

-- Example Policies (Simplify for production-ready template)
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

create policy "Products viewable by all." on products for select using (true);
create policy "Only admins/staff can modify products." on products all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'manager', 'staff'))
);

create policy "Staff can view all orders." on orders for select using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'manager', 'staff'))
);

-- Indexes for performance
create index idx_products_category on products(category_id);
create index idx_orders_customer on orders(customer_id);
create index idx_order_items_order on order_items(order_id);

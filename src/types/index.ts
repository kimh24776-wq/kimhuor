export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  sku: string | null;
  image_url: string | null;
  specs: any;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string | null;
  employee_id: string | null;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  created_at: string;
}

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  role: 'admin' | 'manager' | 'staff' | 'customer';
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

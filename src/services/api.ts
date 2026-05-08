import { supabase } from '@/lib/supabase';

// Generic CRUD service factory
export const createService = <T>(tableName: string) => ({
  getAll: async () => {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as T[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as T;
  },

  create: async (item: Partial<T>) => {
    const { data, error } = await supabase
      .from(tableName)
      .insert(item as any)
      .select()
      .single();
    if (error) throw error;
    return data as T;
  },

  update: async (id: string, updates: Partial<T>) => {
    const { data, error } = await supabase
      .from(tableName)
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as T;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
});

// Specific Services
export const productService = createService('products');
export const categoryService = createService('categories');
export const customerService = createService('customers');
export const orderService = {
  ...createService('orders'),
  getItems: async (orderId: string) => {
    const { data, error } = await supabase
      .from('order_items')
      .select('*, products(*)')
      .eq('order_id', orderId);
    if (error) throw error;
    return data;
  },
};
export const profileService = createService('profiles');

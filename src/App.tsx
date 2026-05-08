import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/AppLayout';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Database, Key, Settings, AlertCircle, ExternalLink } from 'lucide-react';

// Pages
import { Dashboard } from '@/pages/Dashboard';
import { Products } from '@/pages/Products';
import { Login } from '@/pages/Login';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const InventoryPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full text-slate-500">
    <div className="text-xl font-bold">Inventory Management</div>
    <p>Detailed inventory logs and stock adjustments module.</p>
  </div>
);

const OrdersPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full text-slate-500">
    <div className="text-xl font-bold">Orders Management</div>
    <p>View and manage client orders, invoices, and shipping.</p>
  </div>
);

const CustomersPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full text-slate-500">
    <div className="text-xl font-bold">Customer Directory</div>
    <p>Manage customer profiles and purchase history.</p>
  </div>
);

const Unauthorized = () => (
  <div className="flex flex-col items-center justify-center h-screen space-y-4">
    <h1 className="text-4xl font-bold text-rose-600">403</h1>
    <p className="text-slate-500">You do not have permission to access this page.</p>
    <Navigate to="/" replace />
  </div>
);

const SetupGuide = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
    <Card className="max-w-2xl w-full border border-slate-200 shadow-2xl rounded-3xl overflow-hidden bg-white">
      <div className="bg-blue-600 p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md font-bold">
            <Database className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Database Required</h1>
        </div>
        <p className="text-blue-100 leading-relaxed text-sm">
          Please connect your Supabase project to proceed.
        </p>
      </div>
      <CardContent className="p-8 space-y-6">
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Settings className="h-4 w-4 text-blue-500" />
            Add Secrets to AI Studio
          </h2>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <code className="text-xs font-bold text-slate-700">VITE_SUPABASE_URL</code>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <code className="text-xs font-bold text-slate-700">VITE_SUPABASE_ANON_KEY</code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

function App() {
  if (!isSupabaseConfigured) {
    return <SetupGuide />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<OrdersPlaceholder />} />
                <Route path="customers" element={<CustomersPlaceholder />} />
                <Route path="inventory" element={<InventoryPlaceholder />} />
                <Route path="employees" element={<Unauthorized />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

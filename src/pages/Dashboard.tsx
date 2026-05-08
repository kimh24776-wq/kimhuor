import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { productService, orderService, customerService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Product, Order, Customer } from '@/types';
import { cn } from '@/lib/utils';

const data = [
  { name: 'Mon', sales: 4000, inventory: 2400 },
  { name: 'Tue', sales: 3000, inventory: 1398 },
  { name: 'Wed', sales: 2000, inventory: 9800 },
  { name: 'Thu', sales: 2780, inventory: 3908 },
  { name: 'Fri', sales: 1890, inventory: 4800 },
  { name: 'Sat', sales: 2390, inventory: 3800 },
  { name: 'Sun', sales: 3490, inventory: 4300 },
];

const StatCard = ({ title, value, icon: Icon, description, trend, trendValue, color = "blue" }: any) => (
  <Card className="border border-slate-200 shadow-sm bg-white rounded-2xl overflow-hidden group hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</CardTitle>
      <div className={cn(
        "p-2 rounded-xl transition-colors",
        color === "blue" ? "bg-blue-50 text-blue-600" : 
        color === "red" ? "bg-red-50 text-red-600" : 
        "bg-slate-50 text-slate-600"
      )}>
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
      <div className="flex items-center gap-1 mt-2">
        {trend === 'up' ? (
          <span className="text-[10px] font-bold text-emerald-500">{trendValue}</span>
        ) : (
          <span className="text-[10px] font-bold text-rose-500">{trendValue}</span>
        )}
        <span className="text-[10px] text-slate-400 font-medium tracking-tight">from last month</span>
      </div>
    </CardContent>
  </Card>
);

export const Dashboard: React.FC = () => {
  const { data: products } = useQuery<Product[]>({ queryKey: ['products'], queryFn: productService.getAll as any });
  const { data: orders } = useQuery<Order[]>({ queryKey: ['orders'], queryFn: orderService.getAll as any });
  const { data: customers } = useQuery<Customer[]>({ queryKey: ['customers'], queryFn: customerService.getAll as any });

  const totalRevenue = orders?.reduce((acc, order) => acc + (order.total_amount || 0), 0) || 0;
  const lowStockProducts = products?.filter(p => p.stock_quantity < 10).length || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Revenue" 
          value={`$${totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          trend="up" 
          trendValue="+12.5%"
          color="blue"
        />
        <StatCard 
          title="Orders Pending" 
          value={orders?.filter(o => o.status === 'pending').length || 42} 
          icon={ShoppingCart} 
          trend="up" 
          trendValue="8 ready"
          color="blue"
        />
        <StatCard 
          title="Low Stock Items" 
          value={lowStockProducts} 
          icon={AlertCircle} 
          trend="down" 
          trendValue="Action required"
          color="red"
        />
        <StatCard 
          title="Active Customers" 
          value={customers?.length || "1,204"} 
          icon={Users} 
          trend="up" 
          trendValue="Growth: 24%"
          color="blue"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-2xl border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Recent Shop Orders</CardTitle>
            </div>
            <Button variant="link" size="sm" className="text-blue-600 font-bold text-xs p-0 h-auto">View All</Button>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto">
            <div className="min-w-[600px]">
              <table className="w-full text-left">
                <thead className="bg-white border-b border-slate-50">
                  <tr className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-600">
                  {orders?.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">#{order.id.substring(0, 8)}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">Alex Rivers</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold",
                          order.status === 'completed' ? "bg-green-100 text-green-700" :
                          order.status === 'pending' ? "bg-amber-100 text-amber-700" :
                          "bg-blue-100 text-blue-700"
                        )}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">
                        ${order.total_amount.toLocaleString()}
                      </td>
                    </tr>
                  )) || (
                    [1,2,3,4,5].map(i => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-slate-400">#ORD-902{i}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">Customer {i}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">Shipped</span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">$1,699.00</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-base font-bold text-slate-900">Inventory Alerts</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 flex-1">
             <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-100 rounded-2xl group hover:bg-red-100/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-red-100">
                   <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="space-y-1">
                   <p className="text-xs font-bold text-red-900">Critical Stock Level</p>
                   <p className="text-[10px] leading-relaxed text-red-700">RTX 4070 Ti Super is out of stock in Store A. Restock required immediately.</p>
                </div>
             </div>
             <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl group hover:bg-amber-100/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-amber-100">
                   <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="space-y-1">
                   <p className="text-xs font-bold text-amber-900">Restock Suggested</p>
                   <p className="text-[10px] leading-relaxed text-amber-700">Intel Core i5-13600K down to 3 units. Consider placing a new order.</p>
                </div>
             </div>
             <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-slate-100 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                   <Package className="h-5 w-5 text-slate-400" />
                </div>
                <div className="space-y-1">
                   <p className="text-xs font-bold text-slate-800">New Product Category</p>
                   <p className="text-[10px] leading-relaxed text-slate-500">"Gaming Chairs" added to catalog by system automation.</p>
                </div>
             </div>
          </CardContent>
          <div className="p-6 pt-0 mt-auto">
            <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-lg transition-transform active:scale-95">
              Manage Inventory
            </Button>
          </div>
        </Card>
      </div>

      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">Sales Analytics</CardTitle>
            <CardDescription className="text-xs font-medium text-slate-400">Weekly revenue distribution</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Revenue</span>
            </div>
            <Button variant="outline" size="sm" className="h-8 rounded-full text-xs font-bold px-4 border-slate-200">Export</Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
           <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#2563eb" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

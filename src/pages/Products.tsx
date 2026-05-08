import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink,
  PackageCheck,
  AlertTriangle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/api';
import { Product } from '@/types';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export const Products: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useQuery<Product[]>({ 
    queryKey: ['products'], 
    queryFn: productService.getAll as any
  });

  const deleteMutation = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search products..." className="pl-9 bg-white rounded-xl border-slate-200 h-10 text-sm focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-white rounded-xl h-10 border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl h-10 px-5 text-xs font-bold shadow-lg shadow-blue-600/20 uppercase tracking-wider">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 bg-white p-6">
           <CardTitle className="text-base font-bold text-slate-900">Product Catalog</CardTitle>
           <CardDescription className="text-xs font-medium text-slate-400">Inventory levels and pricing for all active listings.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-100">
                <TableHead className="px-6 py-4 text-[10px] uppercase text-slate-400 font-bold tracking-widest">Image</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase text-slate-400 font-bold tracking-widest">Product Details</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase text-slate-400 font-bold tracking-widest">Category</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase text-slate-400 font-bold tracking-widest">Price</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase text-slate-400 font-bold tracking-widest">In Stock</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase text-slate-400 font-bold tracking-widest text-center">Status</TableHead>
                <TableHead className="px-6 py-4 text-right text-[10px] uppercase text-slate-400 font-bold tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 opacity-50">
                      <PackageCheck className="h-10 w-10 text-slate-300" />
                      <p className="text-sm font-medium text-slate-500">Inventory is empty.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products?.map((product) => (
                  <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                    <TableCell className="px-6 py-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-white transition-colors shadow-sm">
                        <PackageCheck className="h-5 w-5 text-slate-400" />
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="font-bold text-slate-900">{product.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono tracking-tight uppercase mt-0.5">{product.sku || 'SKU-PENDING'}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md capitalize">
                        {product.category_id || 'Hardware'}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 font-bold text-slate-900">
                      ${product.price.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-bold text-sm",
                            product.stock_quantity < 10 ? "text-rose-600" : "text-slate-900"
                          )}>
                            {product.stock_quantity}
                          </span>
                          {product.stock_quantity < 10 && <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />}
                       </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        product.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
                      )}>
                        {product.is_active ? 'Active' : 'Archived'}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-100">
                            <MoreVertical className="h-4 w-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl">
                          <DropdownMenuItem className="flex items-center gap-2 text-xs font-bold p-2.5">
                            <Edit className="h-3.5 w-3.5" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-xs font-bold p-2.5">
                            <ExternalLink className="h-3.5 w-3.5" /> Specifications
                          </DropdownMenuItem>
                          <div className="h-px bg-slate-100 my-1" />
                          <DropdownMenuItem 
                            className="flex items-center gap-2 text-xs font-bold text-rose-600 focus:text-rose-600 p-2.5"
                            onClick={() => deleteMutation.mutate(product.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                   </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// Removed helper as it's now imported from utils

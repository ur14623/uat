import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Mail, Home, Eye, Trash2, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

interface MasterNotification {
  id: string;
  businessUnits: string[];
  resourceType: string;
  validity: string;
  bundleType: string;
  notificationType: string;
  dynamicPrice?: boolean;
}

const BU_OPTIONS = ['CBU','EBU','M-PESA'] as const;
const RESOURCE_TYPES = ['DATA','VOICE','SMS'] as const;
const VALIDITY = ['DAILY','WEEKLY','MONTHLY','UNLIMITED','MEGA'] as const;

export default function MasterNotificationList() {
  const [filters, setFilters] = useState({
    bu: '',
    resourceType: '',
    validity: '',
    bundleType: '',
    notificationType: '',
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<MasterNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const query = useMemo(() => {
    const q = new URLSearchParams();
    if (filters.bu) q.set('bu', filters.bu);
    if (filters.resourceType) q.set('resourceType', filters.resourceType);
    if (filters.validity) q.set('validity', filters.validity);
    if (filters.bundleType) q.set('bundleType', filters.bundleType);
    if (filters.notificationType) q.set('notificationType', filters.notificationType);
    q.set('page', String(page));
    q.set('pageSize', String(pageSize));
    return q.toString();
  }, [filters, page, pageSize]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/master-notifications?${query}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load');
        setItems(data.items);
        setTotal(data.total);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const remove = async (id: string) => {
    const res = await fetch(`/api/master-notifications/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setTotal((t) => Math.max(0, t - 1));
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Notification Templates</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Master Notification List</h1>
            <p className="text-muted-foreground">Filter, view, and manage templates</p>
          </div>
          <Link to="/master_notification_add">
            <Button className="bg-brand hover:bg-brand-600">
              <Plus className="h-4 w-4 mr-2" /> Add New Master Notification
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="flex items-start gap-4 overflow-x-auto whitespace-nowrap">
              <div className="inline-flex flex-col min-w-[180px] shrink-0">
                <Label>Business Unit</Label>
                <Select value={filters.bu || "__all__"} onValueChange={(v) => setFilters((f) => ({ ...f, bu: v === "__all__" ? "" : v }))}>
                  <SelectTrigger className="mt-2"><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All</SelectItem>
                    {BU_OPTIONS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="inline-flex flex-col min-w-[180px] shrink-0">
                <Label>Resource Type</Label>
                <Select value={filters.resourceType || "__all__"} onValueChange={(v) => setFilters((f) => ({ ...f, resourceType: v === "__all__" ? "" : v }))}>
                  <SelectTrigger className="mt-2"><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All</SelectItem>
                    {RESOURCE_TYPES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="inline-flex flex-col min-w-[180px] shrink-0">
                <Label>Validity</Label>
                <Select value={filters.validity || "__all__"} onValueChange={(v) => setFilters((f) => ({ ...f, validity: v === "__all__" ? "" : v }))}>
                  <SelectTrigger className="mt-2"><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All</SelectItem>
                    {VALIDITY.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="inline-flex flex-col min-w-[200px] shrink-0">
                <Label>Bundle Type</Label>
                <Input className="mt-2" value={filters.bundleType} onChange={(e) => setFilters((f) => ({ ...f, bundleType: e.target.value }))} placeholder="Bundle Type" />
              </div>
              <div className="inline-flex flex-col min-w-[200px] shrink-0">
                <Label>Notification Type</Label>
                <Input className="mt-2" value={filters.notificationType} onChange={(e) => setFilters((f) => ({ ...f, notificationType: e.target.value }))} placeholder="Notification Type" />
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Unit</TableHead>
                    <TableHead>Resource Type</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead>Dynamic Price</TableHead>
                    <TableHead>Bundle Type</TableHead>
                    <TableHead>Notification Type</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((it) => (
                    <TableRow key={it.id}>
                      <TableCell>{it.businessUnits.join(', ')}</TableCell>
                      <TableCell>{it.resourceType}</TableCell>
                      <TableCell>{it.validity}</TableCell>
                      <TableCell>{it.dynamicPrice ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{it.bundleType}</TableCell>
                      <TableCell>{it.notificationType}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link to={`/master_notification/${it.id}`} className="inline-flex"><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete template?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => remove(it.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-6">{loading ? 'Loading...' : 'No templates found.'}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

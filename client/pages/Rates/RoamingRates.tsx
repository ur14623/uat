import Layout from '@/components/Layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

interface RateRow {
  country: string;
  callToEthiopia: number;
  callToLocal: number;
  callToOther: number;
  receivingCall: number;
  dataMb: number;
  sendingSms: number;
  receivingSms: number;
}

export default function RoamingRates() {
  const [items, setItems] = useState<RateRow[]>([]);
  const [versions, setVersions] = useState<{ id: string; createdAt: string }[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    const loadVersions = async () => {
      const res = await fetch('/api/rates/roaming/versions');
      const data = await res.json();
      if (res.ok && Array.isArray(data.versions)) {
        setVersions(data.versions);
        if (data.versions[0]?.id) setSelectedVersion((prev) => prev || data.versions[0].id);
      }
    };
    loadVersions();
  }, []);

  useEffect(() => {
    const loadRates = async () => {
      if (!selectedVersion) return;
      const res = await fetch(`/api/rates/roaming?version=${encodeURIComponent(selectedVersion)}`);
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
        setPage(1);
      }
    };
    loadRates();
  }, [selectedVersion]);

  useEffect(() => {
    setPage(1);
  }, [search]);

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
              <BreadcrumbPage>Roaming Rates</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Roaming Rates</h1>
            <p className="text-muted-foreground">Select a version to view its roaming rates</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-72">
              <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  {versions.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.id} — {new Date(v.createdAt).toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Link to="/roaming_rate_upload">
              <Button className="bg-brand hover:bg-brand-600">Create New Rate</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardContent>
            <div className="text-lg font-semibold mb-2">Roaming Rate Table</div>
            <div className="flex items-center justify-between mb-3 gap-3">
              <div className="w-72">
                <Input
                  id="search"
                  placeholder="Type a country name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Rows per page</Label>
                <Select value={String(pageSize)} onValueChange={(v) => setPageSize(parseInt(v))}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Countries</TableHead>
                    <TableHead>Call to Ethiopia (Birr/min)</TableHead>
                    <TableHead>Call to Local (Birr/min)</TableHead>
                    <TableHead>Call to Other Countries (Birr/min)</TableHead>
                    <TableHead>Receiving Call (Birr/min)</TableHead>
                    <TableHead>Data (Birr/MB)</TableHead>
                    <TableHead>Sending SMS (Birr/SMS)</TableHead>
                    <TableHead>Receiving SMS (Birr/SMS)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items
                    .filter((r) => r.country.toLowerCase().includes(search.trim().toLowerCase()))
                    .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
                    .map((r, idx) => (
                      <TableRow key={`${r.country}-${idx}`}>
                        <TableCell className="font-medium">{r.country}</TableCell>
                        <TableCell>{r.callToEthiopia}</TableCell>
                        <TableCell>{r.callToLocal}</TableCell>
                        <TableCell>{r.callToOther}</TableCell>
                        <TableCell>{r.receivingCall}</TableCell>
                        <TableCell>{r.dataMb}</TableCell>
                        <TableCell>{r.sendingSms}</TableCell>
                        <TableCell>{r.receivingSms}</TableCell>
                      </TableRow>
                    ))}
                  {items.filter((r) => r.country.toLowerCase().includes(search.trim().toLowerCase())).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-6">No data available.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <div>
                {(() => {
                  const total = items.filter((r) => r.country.toLowerCase().includes(search.trim().toLowerCase())).length;
                  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
                  const end = Math.min(page * pageSize, total);
                  return `Showing ${start}-${end} of ${total}`;
                })()}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
                <Button
                  variant="outline"
                  disabled={items.filter((r) => r.country.toLowerCase().includes(search.trim().toLowerCase())).length <= page * pageSize}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

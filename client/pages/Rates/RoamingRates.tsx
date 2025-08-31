import Layout from '@/components/Layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
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
      }
    };
    loadRates();
  }, [selectedVersion]);

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
          <div className="flex items-end gap-3">
            <div className="w-64">
              <Label className="text-sm mb-1 block">Version</Label>
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
          <CardHeader>
            <CardTitle>Roaming Rate Table</CardTitle>
          </CardHeader>
          <CardContent>
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
                  {items.map((r, idx) => (
                    <TableRow key={idx}>
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
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-6">No data available.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

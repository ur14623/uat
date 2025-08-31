import Layout from '@/components/Layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Home, Settings as SettingsIcon, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const theme = localStorage.getItem('pref_theme');
    setDarkMode(theme === 'dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('pref_theme', darkMode ? 'dark' : 'light');
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [darkMode]);


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
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">Dark Mode</Label>
              <Switch id="darkMode" checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Password Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {message && (<div className="mb-3 text-green-700 bg-green-50 border border-green-200 rounded p-2">{message}</div>)}
            {error && (<div className="mb-3 text-red-700 bg-red-50 border border-red-200 rounded p-2">{error}</div>)}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setMessage(null);
                setError(null);
                if (!currentPassword || !newPassword || !confirmPassword) {
                  setError('Please fill all fields');
                  return;
                }
                if (newPassword !== confirmPassword) {
                  setError('New passwords do not match');
                  return;
                }
                if (newPassword.length < 6) {
                  setError('Password must be at least 6 characters');
                  return;
                }
                setSaving(true);
                try {
                  const res = await fetch('/api/users/password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: 'self', currentPassword, newPassword, confirmPassword }),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data?.error || 'Failed');
                  setMessage(data?.message || 'Password updated successfully');
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                } catch (e: any) {
                  setError(e.message || 'Error');
                } finally {
                  setSaving(false);
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <input id="currentPassword" type="password" className="mt-2 w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <input id="newPassword" type="password" className="mt-2 w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <input id="confirmPassword" type="password" className="mt-2 w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={saving} className="w-full h-10 rounded-md bg-brand text-white hover:bg-brand-600 disabled:opacity-50">
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

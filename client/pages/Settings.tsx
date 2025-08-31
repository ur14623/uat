import Layout from '@/components/Layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, Settings as SettingsIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [emailNotif, setEmailNotif] = useState<boolean>(true);
  const [smsNotif, setSmsNotif] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en');

  useEffect(() => {
    const theme = localStorage.getItem('pref_theme');
    const email = localStorage.getItem('pref_email_notif');
    const sms = localStorage.getItem('pref_sms_notif');
    const lang = localStorage.getItem('pref_lang');
    setDarkMode(theme === 'dark');
    setEmailNotif(email !== 'false');
    setSmsNotif(sms === 'true');
    setLanguage(lang || 'en');
  }, []);

  useEffect(() => {
    localStorage.setItem('pref_theme', darkMode ? 'dark' : 'light');
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('pref_email_notif', String(emailNotif));
  }, [emailNotif]);

  useEffect(() => {
    localStorage.setItem('pref_sms_notif', String(smsNotif));
  }, [smsNotif]);

  useEffect(() => {
    localStorage.setItem('pref_lang', language);
  }, [language]);

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
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotif">Email Notifications</Label>
              <Switch id="emailNotif" checked={emailNotif} onCheckedChange={setEmailNotif} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="smsNotif">SMS Notifications</Label>
              <Switch id="smsNotif" checked={smsNotif} onCheckedChange={setSmsNotif} />
            </div>
            <div>
              <Label className="mb-2 block">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

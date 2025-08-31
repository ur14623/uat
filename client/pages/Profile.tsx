import Layout from '@/components/Layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Home, User as UserIcon, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

interface UserRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin'|'QA'|'Business'|'User';
  status: 'Active'|'Inactive';
  lastLogin: string;
  phoneNumber?: string;
  department?: string;
  lineManager?: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [details, setDetails] = useState<UserRow | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      const res = await fetch(`/api/users/${user.id}`);
      const data = await res.json();
      if (res.ok) setDetails(data);
    };
    load();
  }, [user?.id]);

  const initials = (user?.name || 'User')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

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
              <BreadcrumbPage>Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">User Profile</h1>
          <p className="text-muted-foreground">View your account information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="text-lg font-semibold">{user?.name || (details ? `${details.firstName} ${details.lastName}` : 'Unknown User')}</div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email || details?.email || 'unknown@example.com'}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(user?.groups || []).map((g) => (
                    <Badge key={g} variant="secondary">{g}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <div className="text-sm text-muted-foreground">First Name</div>
                <div className="font-medium">{details?.firstName || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Last Name</div>
                <div className="font-medium">{details?.lastName || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Role</div>
                <div className="font-medium">{details?.role || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="font-medium">{details?.status || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Phone Number</div>
                <div className="font-medium">{details?.phoneNumber || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Department</div>
                <div className="font-medium">{details?.department || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Line Manager</div>
                <div className="font-medium">{details?.lineManager || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Last Login</div>
                <div className="font-medium">{details?.lastLogin ? new Date(details.lastLogin).toLocaleString() : '-'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

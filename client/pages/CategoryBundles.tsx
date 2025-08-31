import Layout from '@/components/Layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import GenericProductsTable from '@/components/GenericProductsTable';
import { productsByCategory } from '@/lib/mockProducts';

export default function CategoryBundles() {
  const { category } = useParams();
  const nav = useNavigate();
  const cat = category || '';
  const items = productsByCategory(cat, 12);

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
              <BreadcrumbPage>Category: {cat}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <GenericProductsTable
          title={`Category: ${cat}`}
          items={items}
          includeCategory={false}
          showAddButton
          onAdd={() => nav('/bundle_list_new')}
        />
      </div>
    </Layout>
  );
}

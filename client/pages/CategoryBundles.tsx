import Layout from "@/components/Layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import GenericProductsTable from "@/components/GenericProductsTable";
import { productsByCategory } from "@/lib/mockProducts";

export default function CategoryBundles() {
  const { category } = useParams();
  const nav = useNavigate();
  const cat = category || "";
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

        <div className="flex justify-end">
          <button
            onClick={() => nav("/bundle_list_new")}
            className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Add New Product
          </button>
        </div>
        <GenericProductsTable
          title={`${cat} Products`}
          items={items}
          includeCategory={false}
        />
      </div>
    </Layout>
  );
}

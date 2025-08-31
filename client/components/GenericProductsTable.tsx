import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ProductItem } from "@/lib/mockProducts";

interface Props {
  title: string;
  items: ProductItem[];
  includeCategory?: boolean;
  showAddButton?: boolean;
  onAdd?: () => void;
  showActions?: boolean;
}

export default function GenericProductsTable({
  title,
  items,
  includeCategory = true,
  showAddButton = false,
  onAdd,
  showActions = true,
}: Props) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {showAddButton && (
          <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700">
            Add New Product
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                {includeCategory && <TableHead>Category</TableHead>}
                <TableHead>Description</TableHead>
                <TableHead>Price / Bundle Info</TableHead>
                <TableHead>Status</TableHead>
                {showActions && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it) => (
                <TableRow key={it.id}>
                  <TableCell className="font-medium">{it.name}</TableCell>
                  {includeCategory && <TableCell>{it.category}</TableCell>}
                  <TableCell>{it.description}</TableCell>
                  <TableCell>{it.priceInfo}</TableCell>
                  <TableCell>
                    <span
                      className={
                        it.status === "Active"
                          ? "text-green-600"
                          : it.status === "Draft"
                            ? "text-yellow-700"
                            : "text-gray-600"
                      }
                    >
                      {it.status}
                    </span>
                  </TableCell>
                  {showActions && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive">
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={(includeCategory ? 5 : 4) + (showActions ? 1 : 0)}
                    className="text-center text-sm text-muted-foreground py-6"
                  >
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

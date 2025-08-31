export interface ProductItem {
  id: string;
  name: string;
  category: string;
  description: string;
  priceInfo: string;
  status: 'Active' | 'Inactive' | 'Draft';
}

const categoriesList = ['CBU','EBU','M-PESA','CVM','Loan','ROAMING','S&D','J4U'] as const;

export function generateMockProducts(countPerCategory = 12): ProductItem[] {
  const items: ProductItem[] = [];
  let idSeq = 1;
  for (const cat of categoriesList) {
    for (let i = 0; i < countPerCategory; i++) {
      const days = [1, 7, 14, 30][i % 4];
      const price = 50 + (i * 10);
      items.push({
        id: `p-${idSeq++}`,
        name: `${cat}-PROD-${String(i + 1).padStart(3, '0')}`,
        category: cat,
        description: `Includes ${days} day${days > 1 ? 's' : ''} of service`;
        priceInfo: `KES ${price}`,
        status: (i % 5 === 0) ? 'Draft' : 'Active',
      });
    }
  }
  return items;
}

export function productsByCategory(category: string, countPerCategory = 12) {
  return generateMockProducts(countPerCategory).filter(p => p.category === category);
}
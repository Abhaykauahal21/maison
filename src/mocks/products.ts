import { Product } from "@/types/product";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod_01",
    name: "Architectural Studio Monitor",
    description:
      "Ultra-accurate acoustic clarity with calibrated DSP for demanding studio environments.",
    price: 849.0,
    category: "Electronics",
    inStock: true,
    rating: 4.9,
    imageUrl:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80",
    tags: ["Audio", "Studio", "Hardware"],
  },
  {
    id: "prod_02",
    name: "Minimalist Oak Workstation",
    description:
      "Sustainably harvested solid oak desk featuring integrated cable routing channels.",
    price: 1120.0,
    category: "Furniture",
    inStock: true,
    rating: 4.8,
    imageUrl:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&auto=format&fit=crop&q=80",
    tags: ["Workspace", "Oak", "Ergonomic"],
  },
  {
    id: "prod_03",
    name: "Precision Mechanical Keyboard",
    description: "Hot-swappable switches encased in anodized aerospace-grade aluminum chassis.",
    price: 240.0,
    category: "Electronics",
    inStock: false,
    rating: 4.7,
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
    tags: ["Keyboard", "Custom", "Peripherals"],
  },
  {
    id: "prod_04",
    name: "Graphite Wool Overshirt",
    description: "Structured double-face Merino wool overshirt tailored for versatile layering.",
    price: 195.0,
    category: "Apparel",
    inStock: true,
    rating: 4.6,
    imageUrl:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=80",
    tags: ["Merino", "Apparel", "Minimal"],
  },
];

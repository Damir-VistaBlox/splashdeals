export type HomeDeal = {
  id: string;
  title: string;
  price: number;
  originalPrice: number | null;
  currency: "RSD";
  discountPercent: number;
  absoluteSave: number;
  pitch: string;
  imageUrl: string | null;
  validityType: string;
  requiresIdentity: boolean;
  requiresPhoto: boolean;
  minPeople: number;
  maxPeople: number | null;
  facility: {
    id: string;
    name: string;
    slug: string;
    category: string | null;
    city: string | null;
    openToday: boolean;
  };
};

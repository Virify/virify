export interface MarketContext {
  reference_year: number;
  area_average: number | null;
  property_type_average: number | null;
  percentile: number | null;
  yearly_trend: number | null;
  sample_size: number;
  property_type_sample_size: number;
}

export interface PricePaidSale {
  price: number;
  transfer_date: Date;
  transaction_id: string;
  old_new: string | null;
  duration: string | null;
  property_type: string | null;
  postcode?: string | null;
  paon?: string | null;
  saon?: string | null;
  street?: string | null;
  town_city?: string | null;
}

export interface ProcessedPricePaidSale {
  price: number;
  transfer_date: string;
  transaction_id: string;
  old_new: string | null;
  duration: string | null;
  property_type: string | null;
  percentage_change: number | null;
}

export interface PricePaidAddressInput {
  number?: string | null;
  flat?: string | null;
  street: string;
  fullAddress?: string | null;
}

export interface PricePaidAddressParts {
  number: string | null;
  flat: string | null;
}

export interface PricePaidResolvedAddress {
  postcode: string;
  street: string;
  city: string;
  number: string;
  flat: string | null;
}

export interface PricePaidAddressMatch {
  paon: string;
  saon?: string;
}

export interface PricePaidGroupedSale {
  price: number;
  transfer_date: Date | string;
  transaction_id: string;
}

export interface PricePaidGroup {
  full_address: string;
  property_type_display: string | null;
  duration_display: string | null;
  sales: PricePaidGroupedSale[];
}

export interface PricePaidMarketStats {
  areaStats: {
    _avg: { price: number | null };
    _count: { price: number };
  };
  propertyTypeStats: {
    _avg: { price: number | null };
    _count: { price: number };
  };
  allAreaPrices: Array<{ price: number }>;
  previousYearStats: {
    _avg: { price: number | null };
  };
}

export interface PricePaidSubject {
  postcode: string;
  paon: string;
  saon?: string | null;
}

export interface PricePaidYearRange {
  start: Date;
  end: Date;
}

export interface PricePaidListingAddress {
  number?: string | null;
  flat?: string | null;
  fullAddress?: string | null;
  street: string;
  city: string;
  postcode: string;
  county?: string | null;
}

export interface PricePaidStreetSummary {
  avg: number;
  min: number;
  max: number;
  recentCount: number;
  period: string;
  lastSales: Array<PricePaidGroupedSale & { formattedDate: string; full_address: string }>;
}

export interface PricePaidResponse {
  data: {
    sales: ProcessedPricePaidSale[];
    total_sales: number;
    latest_sale: ProcessedPricePaidSale | undefined;
    price_range: {
      min: number;
      max: number;
    } | null;
    market_context: MarketContext;
  } | null;
}

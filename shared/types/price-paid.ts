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

export interface PricePaidResponse {
  data: {
    sales: ProcessedPricePaidSale[];
    total_sales: number;
    latest_sale: ProcessedPricePaidSale;
    price_range: {
      min: number;
      max: number;
    } | null;
    market_context: MarketContext;
  } | null;
}
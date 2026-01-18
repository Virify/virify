export type TierOption = {
  tier: "premium" | "featured" | "basic";
  price: number;
  rank: number;
};

export interface CreateListingStep {
  id: number
  title: string
  content: string
  slot: string
  value: string
  completed: boolean
  locked: boolean
  icon: string
}
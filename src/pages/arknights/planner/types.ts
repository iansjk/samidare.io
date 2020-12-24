export interface ItemProps {
  name: string;
  tier: number;
  ingredients?: Ingredient[];
}

export interface Ingredient {
  name: string;
  quantity: number;
}

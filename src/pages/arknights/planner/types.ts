export interface Item {
  name: string;
  tier: number;
  ingredients?: Ingredient[];
}

export interface Ingredient {
  name: string;
  quantity: number;
}

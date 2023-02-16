export interface FilterItemType {
  name: string;
  id: string;
  hint: string;
  expand: boolean;
  children: FilterItemChildType[];
}

export interface FilterItemChildType {
  id: number;
  name: string;
  order: number;
}

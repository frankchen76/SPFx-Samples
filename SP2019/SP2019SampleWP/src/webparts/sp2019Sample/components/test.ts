// Generated by https://quicktype.io

export interface Order {
  "@odata.context": string;
  value: Value[];
}

export interface Value {
  id: number;
  name: string;
  amount: number;
  productType: string;
}

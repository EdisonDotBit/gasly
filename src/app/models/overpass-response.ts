export interface OverpassResponse {
  version: number;
  generator: string;
  elements: OverpassElement[];
}

export interface OverpassElement {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags?: {
    name?: string;
    [key: string]: string | undefined;
  };
}
export interface SearchFilters {
  address: {
    street: string | null;
    location: {
      lat: number;
      lng: number;
    } | null;
  };
  filterWord: string;
  allowedApps: string[];
}

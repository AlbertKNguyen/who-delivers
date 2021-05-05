export interface SearchFilters {
  address: {
    street: string,
    location: {
      lat: number,
      lng: number
    },
  }
  filterWord: string,
  allowedApps: string[]
}
interface Location {
  lat: number;
  lng: number;
}

export interface SelectedRestaurantInfo {
  open: boolean;
  name: string;
  urls: string[];
  imageURL: string;
  location: Location;
  index: number;
}

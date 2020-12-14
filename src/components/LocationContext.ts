import { createContext, Dispatch, SetStateAction } from "react";

interface Location {
  lat: number,
  lng: number
}

export const LocationContext = createContext<Dispatch<SetStateAction<Location>> | null>(null);
import { createContext, Dispatch, SetStateAction } from 'react';
import { SearchFilters } from '../models/SearchFilters.model';

export const SearchFiltersContext = createContext<[SearchFilters, Dispatch<SetStateAction<SearchFilters>>] | [null, null]>([null, null]);
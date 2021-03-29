import { SearchFilters } from './../models/SearchFilters.model';
import { createContext, Dispatch, SetStateAction } from 'react';

export const AddressSearchContext = createContext<[SearchFilters, Dispatch<SetStateAction<SearchFilters>>] | [null, null]>([null, null]);
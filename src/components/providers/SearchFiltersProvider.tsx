import React, { useContext, useState } from 'react';
import { SearchFilters } from '../../models/SearchFilters.model';

interface SearchFiltersContextType {
  searchFilters: SearchFilters;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
}

const SearchFiltersContext = React.createContext<SearchFiltersContextType | undefined>(undefined);

export const useSearchFiltersContext = () => {
  const context = useContext(SearchFiltersContext);
  if (!context) {
    throw new Error('useSearchFilters must be within SearchFiltersProvider');
  }

  return context;
};

export const SearchFiltersProvider = (props): React.ReactElement => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    address: {
      street: null,
      location: null,
    },
    filterWord: '',
    allowedApps: [],
  });

  return (
    <SearchFiltersContext.Provider value={{ searchFilters, setSearchFilters }}>
      {props.children}
    </SearchFiltersContext.Provider>
  );
};

export default SearchFiltersProvider;

import React, { useContext, useState } from 'react';
import { SearchFilters } from '../../models/SearchFilters.model';

interface TempSearchFiltersContextType {
  tempSearchFilters: SearchFilters;
  setTempSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
}

const TempSearchFiltersContext = React.createContext<TempSearchFiltersContextType | undefined>(undefined);

export const useTempSearchFiltersContext = () => {
  const context = useContext(TempSearchFiltersContext);
  if (!context) {
    throw new Error('useTempSearchFilters must be within TempSearchFiltersProvider');
  }

  return context;
};

const TempSearchFiltersProvider = (props): React.ReactElement => {
  const [tempSearchFilters, setTempSearchFilters] = useState<SearchFilters>({
    address: {
      street: null,
      location: null,
    },
    filterWord: '',
    allowedApps: [],
  });

  return (
    <TempSearchFiltersContext.Provider value={{ tempSearchFilters, setTempSearchFilters }}>
      {props.children}
    </TempSearchFiltersContext.Provider>
  );
};

export default TempSearchFiltersProvider;

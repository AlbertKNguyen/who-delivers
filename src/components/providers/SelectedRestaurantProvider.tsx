import React, { useContext, useState } from 'react';
import { SelectedRestaurantInfo } from '../../models/SelectedRestaurantInfo.model';

interface SelectedRestaurantInfoContextType {
  selectedRestaurantInfo: SelectedRestaurantInfo;
  setSelectedRestaurantInfo: React.Dispatch<React.SetStateAction<SelectedRestaurantInfo>>;
}

const SelectedRestaurantInfoContext = React.createContext<SelectedRestaurantInfoContextType | undefined>(undefined);

export const useSelectedRestaurantInfoContext = () => {
  const context = useContext(SelectedRestaurantInfoContext);
  if (!context) {
    throw new Error('useSelectedRestaurantInfo must be within SelectedRestaurantInfoProvider');
  }

  return context;
};

export const SelectedRestaurantInfoProvider = (props): React.ReactElement => {
  const [selectedRestaurantInfo, setSelectedRestaurantInfo] = useState<SelectedRestaurantInfo>({
    open: false,
    name: '',
    urls: [],
    imageURL: '',
    location: null,
    index: 0,
  });

  return (
    <SelectedRestaurantInfoContext.Provider value={{ selectedRestaurantInfo, setSelectedRestaurantInfo }}>
      {props.children}
    </SelectedRestaurantInfoContext.Provider>
  );
};

export default SelectedRestaurantInfoProvider;

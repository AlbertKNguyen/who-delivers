import { useCallback, useContext, useEffect } from 'react';
import Autocomplete from 'react-google-autocomplete';
import { Place } from '../../models/Place.model';

import { AddressSearchContext } from '../../contexts/AddressSearchContext';

export const AddressSearch = () => {
  const [tempSearchFilters, setTempSearchFilters] = useContext(AddressSearchContext);

  // Autofill address on modal open
  useEffect(() => {
    const localStorage = window.localStorage;
    try {
      const address = JSON.parse(localStorage.getItem('address'));
      if (address) {
        const location = {
          lat: Number(address.location.lat),
          lng: Number(address.location.lng),
        };
        setTempSearchFilters((prevTempSearchFilters) => {
          return {
            ...prevTempSearchFilters,
            address: { location, street: address.street },
          };
        });
      }
    } catch (error) {
      console.log(error);
      localStorage.clear();
    }
  }, []);

  const onPlaceSelected = useCallback((place: Place) => {
    if (place.geometry) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setTempSearchFilters((prevTempSearchFilters) => {
        return {
          ...prevTempSearchFilters,
          address: { location, street: place.formatted_address },
        };
      });
    }
  }, []);

  return (
    <Autocomplete
      apiKey={process.env.GOOGLE_KEY}
      style={{ width: '100%', height: '40px' }}
      placeholder='Enter your address'
      defaultValue={tempSearchFilters.address.street}
      onPlaceSelected={onPlaceSelected}
      types={['address']}
      componentRestrictions={{ country: 'us' }}
    />
  );
};

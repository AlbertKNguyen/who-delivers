import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import Autocomplete from 'react-google-autocomplete';
import { Place } from '../../models/Place.model';
import { useTempSearchFiltersContext } from '../providers/TempSearchFiltersProvider';

export const AddressSearch = () => {
  const { tempSearchFilters, setTempSearchFilters } = useTempSearchFiltersContext();

  // Autofill address on first modal open
  useEffect(() => {
    const localStorage = window.localStorage;
    try {
      const address = JSON.parse(localStorage.getItem('address'));
      if (address && JSON.stringify(address) !== JSON.stringify(tempSearchFilters.address)) {
        const location = {
          lat: Number(address.location.lat),
          lng: Number(address.location.lng),
        };
        setTempSearchFilters((prevTempSearchFilters) => {
          return {
            ...prevTempSearchFilters,
            address: { street: address.street, location },
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

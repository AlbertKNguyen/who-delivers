import { useContext, useEffect } from 'react';
import Autocomplete from 'react-google-autocomplete';
import { Place } from '../../models/Place.model';

import { AddressSearchContext } from '../../contexts/AddressSearchContext';
import { SearchFiltersContext } from '../../contexts/SearchFiltersContext';

export const AddressSearch = () => {
  const [tempSearchFilters, setTempSearchFilters] = useContext(AddressSearchContext);
  const [searchFilters, setSearchFilters] = useContext(SearchFiltersContext);

  // use localStorage to autofill address and initiate search
  useEffect(() => {
    const localStorage = window.localStorage;
    try {
      const address = JSON.parse(localStorage.getItem('address'));
      if (address) {
        // set search filters through useContext
        const location = {
          lat: Number(address.location.lat),
          lng: Number(address.location.lng),
        };
        searchFilters.address.location = location;
        searchFilters.address.street = address.street;
        setSearchFilters(searchFilters);
      }
    } catch (error) {
      console.log(error);
      localStorage.clear();
    }
  }, []);

  const onPlaceSelected = (place: Place) => {
    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    tempSearchFilters.address.location = location;
    tempSearchFilters.address.street = place.formatted_address;
    setTempSearchFilters(tempSearchFilters);
  };

  return (
    <Autocomplete
      apiKey={process.env.GOOGLE_KEY}
      style={{ width: '100%', height: '40px' }}
      placeholder='Enter your address'
      defaultValue={searchFilters.address.street}
      onPlaceSelected={onPlaceSelected}
      types={['address']}
      componentRestrictions={{ country: 'us' }}
    />
  );
};

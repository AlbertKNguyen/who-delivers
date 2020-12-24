import { useContext, useEffect, useState } from 'react';
import Autocomplete from 'react-google-autocomplete';
import { Checkbox } from 'semantic-ui-react';
import { LocationContext } from './LocationContext';

interface Place {
  formatted_address: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
}

export const AddressSearch = () => {
  const [currentAddress, setCurrentAddress] = useState<string>();
  const [saveAddress, setSaveAddress] = useState<boolean>(true);

  const setAddressLocation = useContext(LocationContext)

  // use localStorage to autofill address and initiate search
  useEffect(() => {
    const localStorage = window.localStorage;
    try {
      const address = JSON.parse(localStorage.getItem('address'));
      if (address) {
        setCurrentAddress(address.name);
  
        // Pass geolocation to Map through useContext
        const location = {
          lat: Number(address.location.lat),
          lng: Number(address.location.lng),
        };
        setAddressLocation(location);
      }
    } catch (error) {
      console.log(error);
      localStorage.clear();
    }
  }, []);

  const onPlaceSelected = (place: Place) => {
    // Pass geolocation to Map through useContext
    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setAddressLocation(location);

    // Save address and geolocation in localStorage
    if (saveAddress) {
      const address = {
        name: place.formatted_address,
        location: location
      }
      const localStorage = window.localStorage;
      localStorage.setItem('address', JSON.stringify(address));
    }
  };

  return (
    <>
      <Autocomplete
        apiKey={process.env.GOOGLE_KEY}
        style={{ width: '350px', minWidth: '40%', maxWidth: '80%' }}
        placeholder='Enter your address'
        defaultValue={currentAddress}
        onPlaceSelected={onPlaceSelected}
        types={['address']}
        componentRestrictions={{ country: 'us' }}
      />
      <Checkbox
        defaultChecked
        style={{ marginLeft: '10px' }}
        label='Save as current address'
        onClick={() => setSaveAddress(!saveAddress)}
      />
    </>
  );
};

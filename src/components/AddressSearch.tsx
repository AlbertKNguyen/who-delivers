import { useEffect, useState } from 'react';
import Autocomplete from 'react-google-autocomplete';
import { Checkbox } from 'semantic-ui-react';

interface Place {
  formatted_address: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
}

interface Location {
  lat: number;
  lng: number;
}

interface Props {
  setLocation: (location: Location) => void;
}

export const AddressSearch = ({ setLocation }: Props) => {
  const [currentAddress, setCurrentAddress] = useState<string>();
  const [saveAddress, setSaveAddress] = useState<boolean>(true);

  // use localStorage to autofill address and initiate search
  useEffect(() => {
    const localStorage = window.localStorage;
    const address = localStorage.getItem('address');
    const lat = localStorage.getItem('lat');
    const lng = localStorage.getItem('lng');
    if (address && lat && lng) {
      setCurrentAddress(address);
      const location = {
        lat: Number(lat),
        lng: Number(lng),
      };
      setLocation(location);
    }
  });

  const onPlaceSelected = (place: Place) => {
    // Pass geolocation to parent component (Home)
    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setLocation(location);

    // Save address and geolocation in localStorage
    if (saveAddress) {
      const localStorage = window.localStorage;
      localStorage.setItem('address', place.formatted_address);
      localStorage.setItem('lat', location.lat.toString());
      localStorage.setItem('lng', location.lng.toString());
    }
  };

  return (
    <div>
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
    </div>
  );
};

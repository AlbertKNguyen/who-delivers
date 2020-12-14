import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '600px',
  height: '1000px',
  maxWidth: '100vw',
  maxHeight: 'calc(100vh - 44px)',
};

const mapOptions: google.maps.MapOptions = {
  mapTypeControl: false,
  streetViewControl: false,
};

interface Location {
  lat: number;
  lng: number;
}

interface Props {
  addressLocation: Location;
}

export const Map = ({ addressLocation }: Props) => {
  const [zoom, setZoom] = useState<number>(13);
  const isLoading = false;

  useEffect(() => {
    if (addressLocation !== null) {
      const getNearbyRestaurants = async () => {
        const request = new Request(`https://api.yelp.com/v3/businesses/search?latitude=${addressLocation.lat}&longitude=${addressLocation.lng}&radius=10000&limit=50`, {
          method: 'GET',
          mode: 'no-cors',
          headers: new Headers({
            Authorization: `Bearer ${process.env.YELP_KEY}`,
            Host: '<calculated when request is sent></calculated>',
          }),
        })

        const response = await fetch(request);
        console.log(response);
      };

      getNearbyRestaurants();
    }
  }, [addressLocation]);

  const renderMap = () => {
    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={addressLocation}
        zoom={zoom}
        options={mapOptions}
      >
        <Marker position={addressLocation}></Marker>
      </GoogleMap>
    );
  };

  return renderMap();
};

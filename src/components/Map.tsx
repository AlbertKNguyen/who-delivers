import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  Marker,
  StreetViewService,
  useJsApiLoader,
} from '@react-google-maps/api';
import { Dimmer, Loader } from 'semantic-ui-react';

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
        const res = await fetch(
          `https://api.yelp.com/v3/businesses/search?latitude=${addressLocation.lat}&longitude=${addressLocation.lng}&radius=10000&limit=50`,
          {
            headers: new Headers({
              Authorization: `Bearer ${process.env.YELP_KEY}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }),
            mode: "no-cors"
          }
        );
        const data = await res.json();
        console.log(data)
      }

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

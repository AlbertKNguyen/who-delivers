import React, { useEffect, useState } from 'react';
import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api';
const axios = require('axios').default;

const containerStyle = {
  width: '1280px',
  height: 'calc(100vh - 47px)',
  maxWidth: '100vw',
  maxHeight: 'calc(100vh - 47px)',
};

const mapOptions: google.maps.MapOptions = {
  mapTypeControl: false,
  streetViewControl: false,
};

interface Location {
  lat: number;
  lng: number;
}

interface infoWindow {
  open: boolean;
  name: string;
  urls: string[];
  imageURL: string;
  location: Location;
}

interface Props {
  addressLocation: Location;
  restaurantList: any[];
  isLoading: boolean;
}

export const RestaurantsMap = ({
  addressLocation,
  restaurantList,
  isLoading,
}: Props) => {
  const [center, setCenter] = useState<Location>(addressLocation);
  const [infoWindow, setInfoWindow] = useState<infoWindow>({
    open: false,
    name: '',
    urls: [],
    imageURL: '',
    location: null,
  });

  useEffect(() => {
    if (addressLocation !== null) {
      setCenter(addressLocation);

      setInfoWindow({
        open: false,
        name: '',
        urls: [],
        imageURL: '',
        location: null,
      });
    }
  }, [restaurantList]);

  const renderMap = () => {
    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        options={mapOptions}
      >
        <Marker position={addressLocation} title='Home' />

        {restaurantList.map((restaurant) => {
          return (
            <Marker
              key={restaurant.place_id}
              position={restaurant.geometry.location}
              label={{ text: restaurant.name, fontSize: '12px' }}
              icon='https://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png'
              onClick={() => {
                setInfoWindow({
                  open: true,
                  name: restaurant.name,
                  urls: restaurant.urls,
                  imageURL: '',
                  location: restaurant.geometry.location,
                });
              }}
            />
          );
        })}
        {infoWindow.open && (
          <InfoWindow
            position={infoWindow.location}
            onCloseClick={() => {
              setInfoWindow({
                open: false,
                name: '',
                urls: [],
                imageURL: '',
                location: null,
              });
            }}
          >
            <div>
              {/* <Image src={infoWindow.imageURL} width={300} height={300} /> */}
              {infoWindow.name}
              {infoWindow.urls.map((url, index) => {
                return (
                  <div style={{ overflow: 'hidden' }}>
                    <br />
                    {index === 0 && (
                      <p style={{ display: 'inline', float: 'left' }}>*</p>
                    )}
                    <a
                      style={{ display: 'inline', float: 'right' }}
                      target='_blank'
                      rel='noopener noreferrer'
                      href={url}
                    >
                      {url}
                    </a>
                  </div>
                );
              })}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    );
  };

  return renderMap();
};

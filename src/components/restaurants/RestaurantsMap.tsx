import React, { useEffect, useState } from 'react';
import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api';
import { RestaurantInfoWindow } from '../../models/RestaurantInfoWindow.model';
const axios = require('axios').default;

const mapOptions: google.maps.MapOptions = {
  mapTypeControl: false,
  streetViewControl: false,
};

interface Location {
  lat: number;
  lng: number;
}

interface Props {
  style: React.CSSProperties;
  addressLocation: Location;
  restaurantList: any[];
  infoWindow: RestaurantInfoWindow;
  updateInfoWindow: (infoWindow: RestaurantInfoWindow) => void;
}

export const RestaurantsMap = ({
  style,
  addressLocation,
  restaurantList,
  infoWindow,
  updateInfoWindow,
}: Props) => {
  const [center, setCenter] = useState<Location>(addressLocation);

  useEffect(() => {
    if (addressLocation !== null) {
      setCenter(addressLocation);
    }
  }, [restaurantList]);

  const renderMap = () => {
    return (
      <GoogleMap
        mapContainerStyle={style}
        center={center}
        zoom={14}
        options={mapOptions}
      >
        <Marker position={addressLocation} title='Home' />

        {restaurantList.map((restaurant, index) => {
          return (
            <div key={restaurant.place_id}>
              <Marker
                position={restaurant.geometry.location}
                label={{ text: restaurant.name, fontSize: '12px' }}
                icon='https://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png'
                onClick={() => {
                  let infoWindowLocation = Object.assign(
                    {},
                    restaurant.geometry.location
                  );
                  infoWindowLocation.lat += 0.002;
                  updateInfoWindow({
                    open: true,
                    name: restaurant.name,
                    urls: restaurant.urls,
                    imageURL: '',
                    location: infoWindowLocation,
                    index: index,
                  });
                }}
              />
            </div>
          );
        })}
        {infoWindow.open && (
          <InfoWindow
            position={infoWindow.location}
            onCloseClick={() => {
              updateInfoWindow({
                open: false,
                name: '',
                urls: [],
                imageURL: '',
                location: null,
                index: 0,
              });
            }}
          >
            <div>
              {infoWindow.name}
              {infoWindow.urls.map((url, index) => {
                return (
                  <li
                    style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                    key={index}
                  >
                    <a
                      style={{ display: 'inline' }}
                      target='_blank'
                      rel='noopener noreferrer'
                      href={url}
                    >
                      {url}
                    </a>
                  </li>
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

import React, { useEffect, useState } from 'react';
import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api';
import { RestaurantInfoWindow } from '../../models/RestaurantInfoWindow.model';
const axios = require('axios').default;

const containerStyle = {
  width: '65vw',
  height: 'calc(100vh - 47px)',
  maxWidth: '65vw',
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

interface Props {
  addressLocation: Location;
  restaurantList: any[];
  infoWindow: RestaurantInfoWindow;
  updateInfoWindow: (infoWindow: RestaurantInfoWindow) => void;
}

export const RestaurantsMap = ({
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
        mapContainerStyle={containerStyle}
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
              {/* <Image src={infoWindow.imageURL} width={300} height={300} /> */}
              {infoWindow.name}
              {infoWindow.urls.map((url, index) => {
                return (
                  <li
                    style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                    key={index}
                  >
                    {/* <br />
                    {index === 0 && (
                      <p style={{ display: 'inline', float: 'left' }}>*</p>
                    )} */}

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

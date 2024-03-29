import React, { useEffect, useState } from 'react';
import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api';
import { SelectedRestaurantInfo } from '../../models/SelectedRestaurantInfo.model';

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
  selectedRestaurant: SelectedRestaurantInfo;
  updateSelectedRestaurant: (selectedRestaurant: SelectedRestaurantInfo) => void;
  resetSelectedRestaurant: () => void;
}

export const RestaurantsMap = ({
  style,
  addressLocation,
  restaurantList,
  selectedRestaurant,
  updateSelectedRestaurant,
  resetSelectedRestaurant,
}: Props) => {
  const [center, setCenter] = useState<Location>(addressLocation);

  // Center onto address on every search
  useEffect(() => {
    if (addressLocation !== null) {
      setCenter(addressLocation);
    }
  }, [restaurantList]);

  const renderMap = () => {
    return (
      <GoogleMap mapContainerStyle={style} center={center} zoom={14} options={mapOptions}>
        <Marker position={addressLocation} title='Home' />

        {restaurantList.map((restaurant, index) => {
          return (
            <div key={restaurant.place_id}>
              <Marker
                position={restaurant.geometry.location}
                label={{ text: restaurant.name, fontSize: '12px' }}
                icon='https://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png'
                onClick={() => {
                  let selectedRestaurantLocation = Object.assign({}, restaurant.geometry.location);
                  selectedRestaurantLocation.lat += 0.002;
                  updateSelectedRestaurant({
                    open: true,
                    name: restaurant.name,
                    urls: restaurant.urls,
                    imageURL: '',
                    location: selectedRestaurantLocation,
                    index: index,
                  });
                }}
              />
            </div>
          );
        })}
        {selectedRestaurant.open && (
          <InfoWindow
            position={selectedRestaurant.location}
            onCloseClick={resetSelectedRestaurant}
          >
            <div>
              {selectedRestaurant.name}
              {selectedRestaurant.urls.map((url, index) => {
                return (
                  <li style={{ overflow: 'hidden', whiteSpace: 'nowrap' }} key={index}>
                    <a style={{ display: 'inline' }} target='_blank' rel='noopener noreferrer' href={url}>
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

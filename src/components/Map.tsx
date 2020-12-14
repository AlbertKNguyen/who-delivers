import React, { useEffect, useState } from 'react';
import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api';
import { Dimmer, Loader } from 'semantic-ui-react';
import { render } from 'react-dom';
const axios = require('axios').default;

const containerStyle = {
  width: '1100px',
  height: '1200px',
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
  website: string;
  location: Location;
}

interface Props {
  addressLocation: Location;
}

export const Map = ({ addressLocation }: Props) => {
  const [center, setCenter] = useState<Location>(addressLocation);
  const [restaurantList, setRestaurantList] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [infoWindow, setInfoWindow] = useState<infoWindow>({
    open: false,
    name: '',
    website: '',
    location: null,
  });
  let tempRestaurantList = [];

  useEffect(() => {
    if (addressLocation !== null) {
      setCenter(addressLocation);

      const getNearbyRestaurants = async () => {
        setIsLoading(true);
        const searchResponse = await axios.get(
          `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?key=${process.env.GOOGLE_KEY}&type=restaurant&query=online%20delivery&radius=5000&location=${addressLocation.lat},${addressLocation.lng}&opennow`
        );

        for (const place of searchResponse.data.results) {
          const placeData = await axios.get(
            `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GOOGLE_KEY}&place_id=${place.place_id}&fields=formatted_address,geometry,name,photo,place_id,type,url,website`
          );
          
          const restaurant = placeData.data.result;
          tempRestaurantList.push(restaurant);
          console.log(restaurant)
        }
        setIsLoading(false);
        setRestaurantList(tempRestaurantList);
      };

      getNearbyRestaurants();
    }
  }, [addressLocation]);

  const renderMap = () => {
    return (
      <div>
        {!isLoading ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
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
                      website: restaurant.website,
                      location: restaurant.geometry.location,
                    });
                  }}
                />
              );
            })}
            {infoWindow.open && (
              <InfoWindow position={infoWindow.location}>
                <div>
                  {infoWindow.name}:{' '}
                  <a href={infoWindow.website}>{infoWindow.website}</a>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <Loader active> </Loader>
        )}
      </div>
    );
  };

  return renderMap();
};

import React, { useEffect, useState } from 'react';
import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api';
import { Loader } from 'semantic-ui-react';
const axios = require('axios').default;

const containerStyle = {
  width: '1280px',
  height: '2160px',
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
  let errorOccured = false;

  useEffect(() => {
    if (addressLocation !== null) {
      setCenter(addressLocation);

      (async () => {
        const response = await axios.get('/api/urls', {
          params: {
            url:
              'https://www.google.com/search?hl=en&q=hella%20halal%20daly%20city',
          },
        });
      })();

      const getNearbyRestaurants = async () => {
        setIsLoading(true);

        let searchResponse;
        let pageToken = 'pagetoken';
        let pages = 1;

        while (pageToken && pages <= 3) {
          try {
            if (pages === 1) {
              searchResponse = await axios.get(
                `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?key=${process.env.GOOGLE_KEY}&type=restaurant&query=order%20online&radius=5000&location=${addressLocation.lat},${addressLocation.lng}&opennow`
              );
            } else {
              searchResponse = await axios.get(
                `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?key=${process.env.GOOGLE_KEY}&pagetoken${pageToken}`
              );
            }

            for (const place of searchResponse.data.results) {
              const placeData = await axios.get(
                `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GOOGLE_KEY}&place_id=${place.place_id}&fields=formatted_address,geometry,name,photo,place_id,type,url,website`
              );

              const restaurant = placeData.data.result;
              tempRestaurantList.push(restaurant);
            }

            pageToken = searchResponse.data.next_page_token;
            pages++;
          } catch (error) {
            errorOccured = false;
            console.log(error.response);
          }
        }

        setIsLoading(false);
        setRestaurantList(tempRestaurantList);
      };

      getNearbyRestaurants();
    }
  }, [addressLocation]);

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
                  website: restaurant.website,
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
                website: '',
                location: null,
              });
            }}
          >
            <div>
              {infoWindow.name}
              <br />
              <a href={infoWindow.website}>{infoWindow.website}</a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    );
  };

  return (
    <div>
      {addressLocation !== null ? (
        <div>
          {!isLoading ? (
            <div>
              {restaurantList.length > 0 ? (
                renderMap()
              ) : (
                <div style={{ marginTop: '40vh' }}>
                  {errorOccured ? (
                    <h1>
                      Error occured.
                      <br />
                      Try refreshing the page.
                    </h1>
                  ) : (
                    <h1>No restaurants found.</h1>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Loader active>Finding restaurants...</Loader>
          )}
        </div>
      ) : (
        <h1 style={{ marginTop: '40vh' }}>
          Enter your address to start searching.
        </h1>
      )}
    </div>
  );
};

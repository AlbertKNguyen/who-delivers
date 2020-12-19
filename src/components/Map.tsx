import React, { useEffect, useState } from 'react';
import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api';
import { Loader } from 'semantic-ui-react';
import Image from 'next/image';
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
}

export const Map = ({ addressLocation }: Props) => {
  const [center, setCenter] = useState<Location>(addressLocation);
  const [restaurantList, setRestaurantList] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [infoWindow, setInfoWindow] = useState<infoWindow>({
    open: false,
    name: '',
    urls: [],
    imageURL: '',
    location: null,
  });
  const [errorOccured, setErrorOccured] = useState<boolean>(false);

  const getRestaurantsURLs = async (place_id, searchTerm) => {
    const { data } = await axios.get('/api/urls', {
      params: {
        place_id: place_id,
        search: searchTerm,
        key: process.env.SECRET_KEY,
      },
    });
    return data.urls;
  };

  const getRestaurantsDetails = async (searchResults) => {
    const promisedDetails = searchResults.map(async (place) => {
      if (!place.name.includes('pizza')) {
        const placeData = await axios.get(
          `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GOOGLE_KEY}&place_id=${place.place_id}&fields=formatted_address,geometry,name,photos,place_id,type,url,website`
        );
        const placeDetail = placeData.data.result;
        placeDetail.urls = place.urls;
        return placeDetail;
      }
    });
    return Promise.all(promisedDetails);
  };

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

      const getNearbyRestaurants = async () => {
        setIsLoading(true);

        let searchResponse;
        let pages = 1;
        let pageToken = 'pagetoken';
        let tempRestaurantList = [];
        while (pageToken && pages <= 3) {
          try {
            if (pages === 1) {
              searchResponse = await axios.get(
                `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?key=${process.env.GOOGLE_KEY}&type=restaurant&query=delivery&radius=5000&location=${addressLocation.lat},${addressLocation.lng}&opennow`
              );
            } else {
              searchResponse = await axios.get(
                `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?key=${process.env.GOOGLE_KEY}&pagetoken=${pageToken}`
              );
            }

            let searchResults = searchResponse.data.results;
            // Get urls
            searchResults = await searchResults.reduce(
              async (promisedResults, place) => {
                await new Promise((r) =>
                  setTimeout(r, Math.floor(Math.random() * 5000))
                );
                const urlList = await getRestaurantsURLs(
                  place.place_id,
                  `${place.name} ${place.formatted_address}`
                );

                if (urlList.length > 0) {
                  place.urls = urlList;
                  (await promisedResults).push(place);
                }
                return promisedResults;
              },
              Promise.resolve([])
            );

            // Add to list
            tempRestaurantList = [...tempRestaurantList, ...searchResults];

            pageToken = searchResponse.data.next_page_token;
            pages++;
          } catch (error) {
            setErrorOccured(true);
            console.log(error);
            pages++;
          }
        }

        return tempRestaurantList;
      };

      (async () => {
        setRestaurantList(await getNearbyRestaurants());
        setIsLoading(false);
      })();
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
                  <div>
                    <br />
                    <a target='_blank' rel='noopener noreferrer' href={url}>
                      {index === 0 ? <div>*{url}</div> : <div>{url}</div>}
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

  return (
    <div>
      {addressLocation !== null ? (
        <div>
          {!isLoading ? (
            <div>
              {restaurantList.length > 0 ? (
                renderMap()
              ) : (
                <div>
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
        <h1>Enter your address to start searching.</h1>
      )}
    </div>
  );
};

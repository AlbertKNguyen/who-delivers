import React, { useCallback, useEffect, useState } from 'react';
import { RestaurantsMap } from './RestaurantsMap';
import { RestaurantsList } from './RestaurantsList';
import { Loader } from 'semantic-ui-react';
import { SearchFilters } from '../../models/SearchFilters.model';
import { RestaurantInfoWindow } from '../../models/RestaurantInfoWindow.model';
import { useMediaQuery } from 'react-responsive';
import Image from 'next/image';
import { useSpring, animated } from '@react-spring/web';
import { useSearchFiltersContext } from '../providers/SearchFiltersProvider';
const axios = require('axios').default;

const centerStyle = {
  transform: 'translateY(min(calc(50vh - 100px), 60vw))',
  textAlign: 'center',
} as React.CSSProperties;

const listStyle = {
  float: 'right',
  width: '35vw',
  height: 'calc(100vh - 48px)',
  overflow: 'auto',
  paddingLeft: '5px',
  borderLeft: '1px solid black',
} as React.CSSProperties;

export const RestaurantsContainer = () => {
  const { searchFilters } = useSearchFiltersContext();
  const [restaurantList, setRestaurantList] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorOccured, setErrorOccured] = useState<boolean>(false);
  const isNotMobile = useMediaQuery({ query: '(min-width: 768px)' });

  const mapStyle = {
    float: 'left',
    width: isNotMobile ? '65vw' : '100vw',
    height: 'calc(100vh - 48px)',
  } as React.CSSProperties;

  // Current selected restaurant
  const [infoWindow, setInfoWindow] = useState<RestaurantInfoWindow>({
    open: false,
    name: '',
    urls: [],
    imageURL: '',
    location: null,
    index: 0,
  });

  const resetInfoWindow = useCallback(() => {
    setInfoWindow({
      open: false,
      name: '',
      urls: [],
      imageURL: '',
      location: null,
      index: 0,
    });
  }, []);

  const updateRestaurantInfoWindow = useCallback((infoWindow: RestaurantInfoWindow) => {
    setInfoWindow(infoWindow);
  }, []);

  const getRestaurantsURLs = useCallback(async (place_id: string, searchTerm: string) => {
    const { data } = await axios.get('/api/urls', {
      params: {
        place_id: place_id,
        search: searchTerm,
        allowed_apps: searchFilters.allowedApps,
        key: process.env.SECRET_KEY,
      },
    });
    return data.urls;
  }, []);

  // Update restaurants on new search
  useEffect(() => {
    if (searchFilters.address.location !== null) {
      const getNearbyRestaurants = async () => {
        setIsLoading(true);

        let searchResponse;
        let pages = 1;
        let pageToken = 'pagetoken';
        let tempRestaurantList = [];
        while (pageToken && pages <= 3) {
          try {
            if (pages === 1) {
              const { data } = await axios.get('/api/search', {
                params: {
                  input: `key=${process.env.GOOGLE_KEY}&type=restaurant&query=${searchFilters.filterWord}+delivery&radius=5000&location=${searchFilters.address.location.lat},${searchFilters.address.location.lng}&opennow`,
                  key: process.env.SECRET_KEY,
                },
              });
              searchResponse = data.result;
            } else {
              const { data } = await axios.get('/api/search', {
                params: {
                  input: `key=${process.env.GOOGLE_KEY}&pagetoken=${pageToken}`,
                  key: process.env.SECRET_KEY,
                },
              });
              searchResponse = data.result;
            }

            let searchResults = searchResponse.results;
            // Get urls
            searchResults = await searchResults.reduce(async (promisedResults, place) => {
              if (!errorOccured) {
                await new Promise((r) => setTimeout(r, Math.floor(Math.random() * 3000)));

                try {
                  const urlList = await getRestaurantsURLs(place.place_id, `${place.name} ${place.formatted_address}`);

                  if (urlList.length > 0) {
                    place.urls = urlList;
                    (await promisedResults).push(place);
                  }
                  return promisedResults;
                } catch (error) {
                  setErrorOccured(true);
                  return promisedResults;
                }
              }
            }, Promise.resolve([]));

            if (searchResults?.length) {
              // Add to list
              tempRestaurantList = [...tempRestaurantList, ...searchResults];
            }

            pageToken = searchResponse.next_page_token;
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
        resetInfoWindow();
        setRestaurantList(await getNearbyRestaurants());
        setIsLoading(false);
      })();
    }
  }, [searchFilters]);

  const UpArrow = useCallback(() => {
    const styles = useSpring({
      loop: true,
      to: [{ translateY: '10px' }, { translateY: '0px' }],
      from: { translateY: '0px' },
    });

    return (
      <animated.div style={styles}>
        <Image src='/arrow-up-sharp.svg' height={100} width={100} />
      </animated.div>
    );
  }, []);

  if (isLoading) {
    return <Loader active>Finding restaurants...</Loader>;
  }

  if (errorOccured && !restaurantList.length) {
    return (
      <div style={centerStyle}>
        <h1>
          Error occured
          <br />
          Try refreshing the page
        </h1>
      </div>
    );
  }

  return (
    <>
      {searchFilters.address.location !== null ? (
        <>
          {restaurantList.length > 0 ? (
            <>
              <RestaurantsMap
                style={mapStyle}
                infoWindow={infoWindow}
                updateInfoWindow={updateRestaurantInfoWindow}
                addressLocation={searchFilters.address.location}
                restaurantList={restaurantList}
              />
              {isNotMobile && (
                <RestaurantsList
                  style={listStyle}
                  infoWindow={infoWindow}
                  updateInfoWindow={updateRestaurantInfoWindow}
                  addressLocation={searchFilters.address.location}
                  restaurantList={restaurantList}
                />
              )}
            </>
          ) : (
            <div style={centerStyle}>
              <h1>No restaurants found</h1>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <UpArrow />
          <h1>Click Here to Start Your Search</h1>
        </div>
      )}
    </>
  );
};

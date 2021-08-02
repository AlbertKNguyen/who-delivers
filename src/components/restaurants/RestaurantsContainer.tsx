import React, { useContext, useEffect, useRef, useState } from 'react';
import { RestaurantsMap } from './RestaurantsMap';
import { RestaurantsList } from './RestaurantsList';
import { Loader } from 'semantic-ui-react';
import { SearchFilters } from '../../models/SearchFilters.model';
import { RestaurantInfoWindow } from '../../models/RestaurantInfoWindow.model';
import { useMediaQuery } from 'react-responsive';
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

interface Props {
  searchFilters: SearchFilters;
}

export const RestaurantsContainer = ({ searchFilters }: Props) => {
  const [restaurantList, setRestaurantList] = useState([]);
  const [infoWindow, setInfoWindow] = useState<RestaurantInfoWindow>({
    open: false,
    name: '',
    urls: [],
    imageURL: '',
    location: null,
    index: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorOccured, setErrorOccured] = useState<boolean>(false);
  const isNotMobile = useMediaQuery({ query: '(min-width: 768px)' });
  const mapStyle = {
    float: 'left',
    width: isNotMobile ? '65vw' : '100vw',
    height: 'calc(100vh - 48px)',
  } as React.CSSProperties;

  const getRestaurantsURLs = async (place_id: string, searchTerm: string) => {
    const { data } = await axios.get('/api/urls', {
      params: {
        place_id: place_id,
        search: searchTerm,
        allowed_apps: searchFilters.allowedApps,
        key: process.env.SECRET_KEY,
      },
    });
    return data.urls;
  };

  const updateRestaurantInfoWindow = (infoWindow: RestaurantInfoWindow) => {
    setInfoWindow(infoWindow);
  };

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
            searchResults = await searchResults.reduce(
              async (promisedResults, place) => {
                if (!errorOccured) {
                  await new Promise((r) =>
                    setTimeout(r, Math.floor(Math.random() * 3000))
                  );

                  try {
                    const urlList = await getRestaurantsURLs(
                      place.place_id,
                      `${place.name} ${place.formatted_address}`
                    );

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
              },
              Promise.resolve([])
            );

            // Add to list
            tempRestaurantList = [...tempRestaurantList, ...searchResults];

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
        setRestaurantList(await getNearbyRestaurants());
        setIsLoading(false);
      })();
    }
  }, [searchFilters]);

  if (isLoading) {
    return (
      <Loader style={{ marginLeft: '9px' }} active>
        Finding restaurants...
      </Loader>
    );
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
        <h1 style={centerStyle}>
          Click the 'Search Restaurants' button above to start your search
        </h1>
      )}
    </>
  );
};

// const getRestaurantsDetails = async (searchResults) => {
//   const promisedDetails = searchResults.map(async (place) => {
//     if (!place.name.includes('pizza')) {
//       const placeData = await axios.get('/api/search', {
//         params: {
//           url: `https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GOOGLE_KEY}&place_id=${place.place_id}&fields=formatted_address,geometry,name,photos,place_id,type,url,website`,
//           key: process.env.SECRET_KEY,
//         },
//       });
//       const placeDetail = placeData.data.result;
//       placeDetail.urls = place.urls;
//       return placeDetail;
//     }
//   });
//   return Promise.all(promisedDetails);
// };

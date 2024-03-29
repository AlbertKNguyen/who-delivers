import { MutableRefObject, useEffect, useRef } from 'react';
import { Card } from 'semantic-ui-react';
import { SelectedRestaurantInfo } from '../../models/SelectedRestaurantInfo.model';

const CardStyle = {
  marginLeft: '1px',
  width: '99%',
  marginTop: '5px',
} as React.CSSProperties;

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
}

export const RestaurantsList = ({ style, addressLocation, restaurantList, selectedRestaurant, updateSelectedRestaurant }: Props) => {
  const cardRefList: MutableRefObject<any>[] = [];

  // Scrolls list card into full view on restaurant select
  useEffect(() => {
    if (selectedRestaurant.open) {
      cardRefList[selectedRestaurant.index].current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedRestaurant]);

  const distanceInMiles = (lat1: number, lng1: number, lat2: number, lng2: number): string => {
    const p = 0.017453292519943295; // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lng2 - lng1) * p))) / 2;

    return (7917 * Math.asin(Math.sqrt(a))).toFixed(1) + ' mi'; // 2 * R; R = 7917 mi
  };

  const CardComponent = (restaurant, index: number) => {
    const cardRef = useRef(null);
    cardRefList[index] = cardRef;

    let selectedStyle = {} as React.CSSProperties;
    if (selectedRestaurant.open && index === selectedRestaurant.index) {
      selectedStyle.borderLeft = '5px solid red';
    }

    let lastCardStyle = {} as React.CSSProperties;
    if (index === restaurantList.length - 1) {
      lastCardStyle.marginBottom = '5px';
    }

    return (
      <div ref={cardRef} key={restaurant.place_id}>
        <Card
          style={{ ...CardStyle, ...selectedStyle, ...lastCardStyle }}
          header={restaurant.name}
          meta={distanceInMiles(
            addressLocation.lat,
            addressLocation.lng,
            restaurant.geometry.location.lat,
            restaurant.geometry.location.lng
          )}
          description={restaurant.urls.map((url, index) => {
            return (
              <li style={{ overflow: 'hidden', whiteSpace: 'nowrap' }} key={index}>
                <a style={{ display: 'inline' }} target='_blank' rel='noopener noreferrer' href={url}>
                  {url}
                </a>
              </li>
            );
          })}
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
  };

  return (
    <div style={style}>
      {restaurantList.map((restaurant, index) => {
        return CardComponent(restaurant, index);
      })}
    </div>
  );
};

import { InfoWindow } from '@react-google-maps/api';
import { createRef, MutableRefObject, useEffect, useMemo, useRef } from 'react';
import { Card } from 'semantic-ui-react';
import { RestaurantInfoWindow } from '../../models/RestaurantInfoWindow.model';

const containerStyle = {
  width: 'calc(35vw - 6px)',
  height: 'calc(100vh - 47px)',
  overflow: 'auto',
  marginLeft: '5px',
};

interface Props {
  restaurantList: any[];
  infoWindow: RestaurantInfoWindow;
  updateInfoWindow: (infoWindow: RestaurantInfoWindow) => void;
}

export const RestaurantsList = ({
  restaurantList,
  infoWindow,
  updateInfoWindow,
}: Props) => {
  const cardRefList: MutableRefObject<any>[] = [];

  useEffect(() => {
    if (infoWindow.open === true) {
      //cardRefList[infoWindow.index].current.scrollIntoView();
    }
  }, [infoWindow]);

  const CardComponent = (restaurant, index: number) => {
    const cardRef = useRef(null);
    cardRefList[index] = cardRef;

    return (
      <Card
        style={{ marginLeft: '1px', width: '99%' }}
        key={restaurant.place_id}
        ref={cardRef}
        header={restaurant.name}
        description={restaurant.urls.map((url, index) => {
          return (
            <li style={{ overflow: 'hidden' }} key={index}>
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
    );
  };

  return (
    <div style={containerStyle}>
      {restaurantList.map((restaurant, index) => {
        return CardComponent(restaurant, index);
      })}
    </div>
  );
};

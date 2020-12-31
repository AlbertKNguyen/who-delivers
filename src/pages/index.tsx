import { NextPage } from 'next';
import Head from 'next/head';
import { Grid } from 'semantic-ui-react';
import { NavBar } from '../components/NavBar';
import { RestaurantsContainer } from '../components/RestaurantsContainer';
import React, { useState } from 'react';
import { LocationContext } from '../components/LocationContext';

interface Location {
  lat: number;
  lng: number;
}

const Home: NextPage = () => {
  const [addressLocation, setAddressLocation] = useState<Location | null>(null);

  return (
    <>
      <Head>
        <title>WhoDelivers | Delivery Search</title>
        <meta name='description' content='Local restaurants that deliver' />
        <meta
          name='keywords'
          content='who delivers, whodelivers, who delivers near me, delivery near me, delivery search, local restaurant delivery, restaurant delivery'
        />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_KEY}&libraries=places`}
          key='google'
        ></script>
      </Head>

      <LocationContext.Provider value={setAddressLocation}>
        <NavBar />
      </LocationContext.Provider>
      <RestaurantsContainer addressLocation={addressLocation} />
    </>
  );
};

export default Home;

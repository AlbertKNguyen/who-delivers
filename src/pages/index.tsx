import { NextPage } from 'next';
import Head from 'next/head';
import { Grid } from 'semantic-ui-react';
import { NavBar } from '../components/NavBar';
import { Map } from '../components/Map';
import React, { useState } from 'react';
import { LocationContext } from '../components/LocationContext';

interface Location {
  lat: number;
  lng: number;
}

const Home: NextPage = () => {
  const [addressLocation, setAddressLocation] = useState<Location | null>(null);

  return (
    <div style={{ display: 'flex' }}>
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
      <div
        style={{  
        position: 'absolute',
        left: '50%',
        top: 'calc(50% + 23px)',
        WebkitTransform: 'translate(-50%, -50%)',
        transform: 'translate(-50%, -50%)' }}
      >
        <Map addressLocation={addressLocation} />
      </div>
      <p
        style={{
          position: 'absolute',
          marginTop: 'calc(100vh - 25px)',
          marginLeft: '5px',
        }}
      >
        *Pizza not included
      </p>
    </div>
  );
};

export default Home;

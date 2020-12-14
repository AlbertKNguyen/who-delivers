import { NextPage } from 'next';
import Head from 'next/head';
import { Container } from 'semantic-ui-react';
import { NavBar } from '../components/NavBar';
import { Map } from '../components/Map';
import { useState } from 'react';
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
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <script
          src='https://maps.googleapis.com/maps/api/js?key=AIzaSyAVquZnRTQVCiNYRzDz6-sujvARlhHzSc0&libraries=places'
          key='google'
        ></script>
      </Head>

      <LocationContext.Provider value={setAddressLocation}>
        <NavBar />
      </LocationContext.Provider>
      <Container style={{ marginTop: '44px' }}>
        <Map addressLocation={addressLocation} />
      </Container>
    </div>
  );
};

export default Home;

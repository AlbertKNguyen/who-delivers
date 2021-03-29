import { NextPage } from 'next';
import Head from 'next/head';
import { Grid } from 'semantic-ui-react';
import { NavBar } from '../components/navbar/NavBar';
import { RestaurantsContainer } from '../components/restaurants/RestaurantsContainer';
import React, { useState } from 'react';
import { SearchFiltersContext } from '../contexts/SearchFiltersContext';
import { SearchFilters } from '../models/SearchFilters.model';

const Home: NextPage = () => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>({
    address: {
      street: null,
      location: null,
    },
    filterWord: '',
  });

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

      <SearchFiltersContext.Provider value={[searchFilters, setSearchFilters]}>
        <NavBar />
        <RestaurantsContainer />
      </SearchFiltersContext.Provider>
    </>
  );
};

export default Home;

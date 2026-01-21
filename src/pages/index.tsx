import { NextPage } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { NavBar } from '../components/navbar/NavBar';
import { RestaurantsContainer } from '../components/restaurants/RestaurantsContainer';
import React from 'react';
import SearchFiltersProvider from '../components/providers/SearchFiltersProvider';
import TempSearchFiltersProvider from '../components/providers/TempSearchFiltersProvider';
import SelectedRestaurantInfoProvider from '../components/providers/SelectedRestaurantProvider';

const Home: NextPage = () => {
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
      </Head>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_KEY}&libraries=places`}
        strategy='beforeInteractive'
      />

      <SearchFiltersProvider>
        <TempSearchFiltersProvider>
          <NavBar />
        </TempSearchFiltersProvider>
        <SelectedRestaurantInfoProvider>
          <RestaurantsContainer />
        </SelectedRestaurantInfoProvider>
      </SearchFiltersProvider>
    </>
  );
};

export default Home;

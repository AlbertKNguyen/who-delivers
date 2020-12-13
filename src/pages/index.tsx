import { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { NavBar } from '../components/NavBar';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>WhoDelivers | Delivery Search</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>

      <NavBar />
    </div>
  );
};

export default Home;

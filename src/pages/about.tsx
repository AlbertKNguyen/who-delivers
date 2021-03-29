import { NextPage } from "next";
import Head from "next/head";
import { NavBar } from "../components/navbar/NavBar";

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>WhoDelivers | About</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <NavBar />
    </>
  );
};

export default About;

import { useRouter } from 'next/router';
import Link from 'next/link';
import { AppLogo } from './AppLogo';
import { Menu } from 'semantic-ui-react';
import React, { useState } from 'react';
import { SearchModal } from './SearchModal';

export const NavBar = () => {
  const locationPath = useRouter().pathname;
  const [activeItem] = useState<string>(locationPath);

  return (
    <>
      <Menu fixed='top' pointing secondary style={{ background: 'white', position: 'static' }}>
        <Menu.Item as='a' href='/' header position='left'>
          <AppLogo />
        </Menu.Item>

        {locationPath === '/' && (
          <Menu.Item>
            {/* <AddressSearch /> */}
            <SearchModal />
          </Menu.Item>
        )}

        <Menu.Item position='right' active={activeItem === '/'}>
          <Link href='/'>
            <a style={{ color: 'black' }}>Delivery Search</a>
          </Link>
        </Menu.Item>

        {/* <Menu.Item active={activeItem === '/about'}>
          <Link href='/about'>
            <a style={{ color: 'black' }}>About</a>
          </Link>
        </Menu.Item> */}
      </Menu>
    </>
  );
};

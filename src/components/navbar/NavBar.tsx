import { useRouter } from 'next/router';
import Link from 'next/link';
import { AppLogo } from './AppLogo';
import { Menu } from 'semantic-ui-react';
import React, { useState } from 'react';
import { SearchModal } from './SearchModal';
import { useMediaQuery } from 'react-responsive';

export const NavBar = () => {
  const locationPath = useRouter().pathname;
  const [activeItem] = useState<string>(locationPath);

  const Default = ({ children }) => {
    const isNotMobile = useMediaQuery({ minWidth: 768 });
    return isNotMobile ? children : null;
  };

  return (
    <>
      <Menu fixed='top' pointing secondary style={{ background: 'white', position: 'static', height: '48px' }}>
        <Default>
          <Menu.Item as='a' href='/' header position='left'>
            <AppLogo />
          </Menu.Item>
        </Default>

        {locationPath === '/' && (
          <Menu.Item style={{ margin: 'auto' }}>
            <SearchModal />
          </Menu.Item>
        )}

        <Default>
          <Menu.Item position='right' active={activeItem === '/'}>
            <Link href='/'>
              <a style={{ color: 'black' }}>Delivery Search</a>
            </Link>
          </Menu.Item>
        </Default>

        {/* <Menu.Item active={activeItem === '/about'}>
          <Link href='/about'>
            <a style={{ color: 'black' }}>About</a>
          </Link>
        </Menu.Item> */}
      </Menu>
    </>
  );
};

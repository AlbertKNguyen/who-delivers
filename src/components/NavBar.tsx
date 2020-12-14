import { useRouter } from 'next/router';
import Link from 'next/link';
import { AppLogo } from './AppLogo';
import { AddressSearch } from './AddressSearch';
import { Menu, Button } from 'semantic-ui-react';
import { useState } from 'react';

export const NavBar = () => {
  const locationPath = useRouter().pathname;
  const [activeItem] = useState<string>(locationPath);

  return (
    <div>
      <Menu fixed='top' pointing secondary>
        <Menu.Item as='a' href='/' header position='left'>
          <AppLogo />
        </Menu.Item>

        {locationPath === '/' && (
          <Menu.Item>
            <AddressSearch />
          </Menu.Item>
        )}

        <Menu.Item position='right' active={activeItem === '/'}>
          <Link href='/'>
            <a style={{ color: 'black' }}>Delivery Search</a>
          </Link>
        </Menu.Item>

        <Menu.Item active={activeItem === '/about'}>
          <Link href='/about'>
            <a style={{ color: 'black' }}>About</a>
          </Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

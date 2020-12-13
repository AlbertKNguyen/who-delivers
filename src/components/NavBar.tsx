
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AppLogo } from './AppLogo';
import { AddressSearch } from './AddressSearch';
import { Menu, Input, Container } from 'semantic-ui-react';
import { useState, useEffect } from 'react';

interface Location {
    lat: number,
    lng: number
}

export const NavBar = () => {
  const locationPath = useRouter().pathname;
  const [activeItem] = useState<string>(locationPath);
  const [addressLocation, setAddressLocation] = useState<Location | null>(null);

  return (
    <div>
      <Menu fixed='top' pointing secondary>
        <Menu.Item header>
          <AppLogo />
        </Menu.Item>

        <Menu.Item active={activeItem === '/'}>
          <Link href='/'>
            <a style={{ color: 'black' }}>Delivery Search</a>
          </Link>
        </Menu.Item>

        <Menu.Item active={activeItem === '/about'}>
          <Link href='/about'>
            <a style={{ color: 'black' }}>About</a>
          </Link>
        </Menu.Item>

        <Menu.Item>
          <AddressSearch setLocation={(location: Location) => console.log(location)}/>
        </Menu.Item>
      </Menu>
    </div>
  );
};

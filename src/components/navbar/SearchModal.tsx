import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  Modal,
  Popup,
} from 'semantic-ui-react';
import { SearchFilters } from '../../models/SearchFilters.model';
import { AddressSearch } from './AddressSearch';
import { AddressSearchContext } from '../../contexts/AddressSearchContext';
import { SearchFiltersContext } from '../../contexts/SearchFiltersContext';
import { useMediaQuery } from 'react-responsive';

export const SearchModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [saveAddress, setSaveAddress] = useState<boolean>(true);
  const [tempSearchFilters, setTempSearchFilters] = useState<SearchFilters>({
    address: {
      street: null,
      location: null,
    },
    filterWord: '',
    allowedApps: [],
  });
  const [searchFilters, setSearchFilters] = useContext(SearchFiltersContext);
  const allowedAppsOptions = [
    { key: 'doordash', text: 'DoorDash', value: 'doordash' },
    { key: 'grubhub', text: 'Grubhub', value: 'grubhub' },
    { key: 'ubereats', text: 'Uber Eats', value: 'ubereats' },
    { key: 'postmates', text: 'Postmates', value: 'postmates' },
    { key: 'caviar', text: 'Caviar', value: 'caviar' },
    { key: 'seamless', text: 'Seamless', value: 'seamless' },
    { key: 'delivery.com', text: 'Delivery.com', value: 'delivery.com' },
  ];
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  const handleFilterWordChange = (e, { name, value }) => {
    let tempFilters = tempSearchFilters;
    tempFilters.filterWord = value;
    setTempSearchFilters(tempFilters);
  };

  const handleAllowedAppsChange = (e, { name, value }) => {
    let tempFilters = tempSearchFilters;
    tempFilters.allowedApps = value;
    setTempSearchFilters(tempFilters);
  };

  const handleSubmit = () => {
    if (tempSearchFilters.address.street) {
      setOpen(false);
      if (JSON.stringify(tempSearchFilters) != JSON.stringify(searchFilters)) {
        setSearchFilters(tempSearchFilters);
      }

      // Save address and geolocation in localStorage
      if (saveAddress) {
        const address = {
          street: tempSearchFilters.address.street,
          location: tempSearchFilters.address.location,
        };
        const localStorage = window.localStorage;
        localStorage.setItem('address', JSON.stringify(address));
      } else {
        localStorage.clear();
      }
    }
  };

  // Get old filters
  useEffect(() => {
    if (searchFilters.address.street) {
      setTempSearchFilters(searchFilters);
    }
  }, []);

  return (
    <Modal
      style={{ maxHeight: '100vw', maxWidth: '100vw' }}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <div style={{ transform: 'translateY(7px)'}}>
          {isMobile ? (
            <Button style={{ marginLeft: 'calc(50vw - 100px)' }}>Search Restaurants</Button>
          ) : (
            <Button style={{ marginLeft: '-33px' }}>Search Restaurants</Button>
          )}
        </div>
      }
    >
      <Modal.Header>Search for Restaurants</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Input
            label='Address'
            required
            onChange={handleFilterWordChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          >
            <AddressSearchContext.Provider
              value={[tempSearchFilters, setTempSearchFilters]}
            >
              <AddressSearch />
            </AddressSearchContext.Provider>
          </Form.Input>
          <Form.Field>
            <Checkbox
              checked={saveAddress}
              style={{ marginTop: '-5px', float: 'right' }}
              label='Save as current address'
              onClick={() => setSaveAddress(!saveAddress)}
            />
          </Form.Field>

          <Form.Input
            label='Filter'
            placeholder='Filter by word (food/cuisine)'
            name='filterWord'
            defaultValue={searchFilters.filterWord}
            onChange={handleFilterWordChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />

          <Form.Field>
            <label>Third-party Apps</label>
            <Dropdown
              placeholder='Delivery apps allowed as result'
              fluid
              multiple
              selection
              defaultValue={searchFilters.allowedApps}
              options={allowedAppsOptions}
              onChange={handleAllowedAppsChange}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Popup
          trigger={
            <Button
              onClick={() => {
                handleSubmit();
              }}
              positive
            >
              Start Search
            </Button>
          }
          disabled={tempSearchFilters.address.street !== null}
          content={'Address is required'}
          on='click'
        />
      </Modal.Actions>
    </Modal>
  );
};

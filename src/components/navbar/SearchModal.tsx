import React, { useCallback, useState } from 'react';
import { Button, Checkbox, Dropdown, Form, Modal, Popup } from 'semantic-ui-react';
import { useSearchFiltersContext } from '../providers/SearchFiltersProvider';
import { useTempSearchFiltersContext } from '../providers/TempSearchFiltersProvider';
import { AddressSearch } from './AddressSearch';
import styles from './SearchModal.module.css';

const allowedAppsOptions = [
  { key: 'doordash', text: 'DoorDash', value: 'doordash' },
  { key: 'grubhub', text: 'Grubhub', value: 'grubhub' },
  { key: 'ubereats', text: 'Uber Eats', value: 'ubereats' },
  { key: 'postmates', text: 'Postmates', value: 'postmates' },
  { key: 'caviar', text: 'Caviar', value: 'caviar' },
  { key: 'seamless', text: 'Seamless', value: 'seamless' },
  { key: 'delivery.com', text: 'Delivery.com', value: 'delivery.com' },
];

export const SearchModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [saveAddress, setSaveAddress] = useState<boolean>(false);
  const { searchFilters, setSearchFilters } = useSearchFiltersContext();
  const { tempSearchFilters, setTempSearchFilters } = useTempSearchFiltersContext();

  const handleFilterWordChange = useCallback(
    (e, { value }) => {
      setTempSearchFilters((prevTempSearchFilters) => {
        return {
          ...prevTempSearchFilters,
          filterWord: value,
        };
      });
    },
    [tempSearchFilters]
  );

  const handleAllowedAppsChange = useCallback(
    (e, { value }) => {
      setTempSearchFilters((prevTempSearchFilters) => {
        return {
          ...prevTempSearchFilters,
          allowedApps: value,
        };
      });
    },
    [tempSearchFilters]
  );

  const handleSubmit = () => {
    if (tempSearchFilters.address.street) {
      setOpen(false);
      if (JSON.stringify(tempSearchFilters) !== JSON.stringify(searchFilters)) {
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

  const SearchButton = (
    <div style={{ marginTop: '-7px' }}>
      <Button className={styles['search-button']}>Search Restaurants</Button>
    </div>
  );

  return (
    <Modal
      style={{ maxHeight: '100vh', maxWidth: '100vw' }}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={SearchButton}
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
            <AddressSearch />
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
            label='Filter Word'
            placeholder='Filter by word(s) (food/cuisine)'
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

import React, { useContext, useEffect, useState } from 'react';
import { Button, Checkbox, Form, Modal, Popup } from 'semantic-ui-react';
import { SearchFilters } from '../../models/SearchFilters.model';
import { AddressSearch } from './AddressSearch';
import { AddressSearchContext } from '../../contexts/AddressSearchContext';
import { SearchFiltersContext } from '../../contexts/SearchFiltersContext';

export const SearchModal = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [saveAddress, setSaveAddress] = useState<boolean>(true);
  const [tempSearchFilters, setTempSearchFilters] = useState<SearchFilters>({
    address: {
      street: null,
      location: null,
    },
    filterWord: '',
  });

  const [searchFilters, setSearchFilters] = useContext(SearchFiltersContext);

  const handleFilterWordChange = (e, { name, value }) => {
    let tempFilters = tempSearchFilters;
    tempFilters.filterWord = value;
    setTempSearchFilters(tempFilters);
  };

  const handleSubmit = () => {
    if (tempSearchFilters.address.street) {
      setOpen(false);
      setSearchFilters(tempSearchFilters);

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
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button style={{ marginLeft: '-36px' }}>Search</Button>}
    >
      <Modal.Header>Search for Restaurants</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Input
            label='Address'
            required
            onChange={handleFilterWordChange}
          >
            <AddressSearchContext.Provider
              value={[tempSearchFilters, setTempSearchFilters]}
            >
              <AddressSearch />
            </AddressSearchContext.Provider>
          </Form.Input>
          <Form.Field>
            <Checkbox
              defaultChecked
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
          />
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
          position='top right'
        />
      </Modal.Actions>
    </Modal>
  );
};

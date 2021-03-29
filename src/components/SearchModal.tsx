import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Form,
  FormInput,
  Header,
  Modal,
} from 'semantic-ui-react';
import { Place } from '../models/Place.model';
import { SearchFilters } from '../models/SearchFilters.model';
import { AddressSearch } from './AddressSearch';
import { AddressSearchContext } from './AddressSearchContext';
import { SearchFiltersContext } from './SearchFiltersContext';

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
    tempSearchFilters.filterWord = value;
    setTempSearchFilters(tempSearchFilters);
    console.log(tempSearchFilters);
  };

  const handleSubmit = () => {
    setSearchFilters(tempSearchFilters);

    // Save address and geolocation in localStorage
    if (saveAddress) {
      const address = {
        street: tempSearchFilters.address.street,
        location: tempSearchFilters.address.location,
      };
      const localStorage = window.localStorage;
      localStorage.setItem('address', JSON.stringify(address));
    }
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Search</Button>}
    >
      <Modal.Header>Search for Restaurants</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Input label='Address' required>
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
            onChange={handleFilterWordChange}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button
          onClick={() => {
            setOpen(false);
            handleSubmit();
          }}
          positive
        >
          Start Search
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

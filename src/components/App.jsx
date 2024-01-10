import { useEffect, useState } from 'react';
import ContactForm from 'components/contactForm/ContactForm';
import ContactList from 'components/contactList/ContactList';
import Filter from 'components/filter/Filter';
import css from './App.module.css';
import { nanoid } from 'nanoid';
import { useDispatch, useSelector } from 'react-redux';
import {
  saveContact,
  deleteContacts,
  updateFilter,
} from '../redux/contactsSlice';

export function App() {
  // const [contacts, setContacts] = useState([]);
  // const [filter, setFilter] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const dispatch = useDispatch();
  const contacts = useSelector(state => state.contacts.contacts);
  const filter = useSelector(state => state.contacts.filter);

  useEffect(() => {
    const storedContacts = JSON.parse(localStorage.getItem('contacts'));
    if (storedContacts) {
      dispatch(saveContact(storedContacts));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.clear();
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleChange = event => {
    switch (event.target.name) {
      case 'name':
        setName(event.target.value);
        break;
      case 'number':
        setNumber(event.target.value);
        break;
      default:
        return;
    }
  };

  const onSubmit = evt => {
    evt.preventDefault();

    const newContact = {
      id: nanoid(),
      name,
      number,
    };

    if (
      contacts.some(
        contact => contact.name.toLowerCase() === newContact.name.toLowerCase()
      )
    ) {
      alert(`${newContact.name} is already in contacts`);
    } else {
      dispatch(saveContact(newContact));
      setName('');
      setNumber('');
    }
  };

  const deleteContact = id => {
    dispatch(deleteContacts(id));
  };

  const changeFilter = e => {
    dispatch(updateFilter(e.target.value.toLowerCase()));
  };

  const findContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'rgb(59, 55, 55)',
      }}
    >
      <div className={css.container}>
        <h1 className={css.titlePage}>Phonebook</h1>
        <ContactForm
          name={name}
          number={number}
          onChange={handleChange}
          onSubmit={onSubmit}
        />

        <h2 className={css.titleList}>Contacts:</h2>

        <ContactList contacts={findContacts} deleteContact={deleteContact} />

        <Filter changeFilter={changeFilter} filter={filter} />
      </div>
    </div>
  );
}

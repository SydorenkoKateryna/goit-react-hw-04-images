import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { FiSearch } from 'react-icons/fi';
import css from './Searchbar.module.css';

const Searchbar = ({ onSubmit, isLoading }) => {
  const [value, setValue] = useState('');

  const handleChange = ({ target: { value } }) => {
    setValue(value.toLowerCase());
  };

  const handleSubmit = e => {
    e.preventDefault();

    const normalizedValue = value.trim();

    if (normalizedValue === '') {
      toast.info('Please enter keywords to find images.');
      return;
    }

    onSubmit(normalizedValue);
  };

  return (
    <header className={css.searchbar}>
      <form className={css.form} onSubmit={handleSubmit}>
        <button disabled={isLoading} type="submit" className={css.button}>
          <FiSearch size={24} />
        </button>

        <input
          className={css.input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={value}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default Searchbar;

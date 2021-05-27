import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import useHttp from '../../hooks/http';
import ErrorModal from '../UI/ErrorModal';
import '../../styles/Search.css';

const Search = React.memo(props => {
  const [enteredFilter, setEnteredFilter] = useState('');
  const { onLoadPurchases } = props;
  const inputRef = useRef();
  const { isLoading, data, error, sendRequest, clear } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0
          // ? '?orderBy="status"&equalTo=true'
          ? ""
          : `?orderBy="title"&startAt="${enteredFilter}"&endAt="${enteredFilter}\uf8ff"`;
        sendRequest(
          'https://react-hooks-ea382-default-rtdb.firebaseio.com/purchases.json' + query,
          'GET'
        );
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error) {
      const loadedPurchases = [];
      for (const key in data) {
        loadedPurchases.push({
          id: key,
          status: data[key].status,
          title: data[key].title,
          amount: data[key].amount,
        })
      }
      onLoadPurchases(loadedPurchases)
    }
  }, [data, error, isLoading, onLoadPurchases])

  return (
    <section className="search">
      <Card>
        {error && <ErrorModal onClose={clear} >{error}</ErrorModal>}
        <div className="search-input">
          <label>{isLoading ? 'Loading...' : 'Filter by Title'}</label>
          {/* {isLoading && <span>Loading...</span>} */}
          <input type="text"
            ref={inputRef}
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;

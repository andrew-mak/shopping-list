import React, { useCallback, useEffect, useReducer, useState } from 'react';

import Card from '../UI/Card';
import LoadingIndicator from '../UI/LoadingIndicator';
import useHttp from '../../hooks/http';
import purchaseReducer from '../../reducer';
import '../../styles/PurchaseForm.css';

const PurchaseForm = React.memo(props => {
  const [, dispatchPurchases] = useReducer(purchaseReducer, '');

  const [inputTitleState, setTitleState] = useState('');
  const [inputAmountState, setAmountState] = useState('');
  const { isLoading, error, data, delItemId, reqIdentifier, sendRequest } = useHttp();

  const addPurchaseHandler = useCallback(purchase => {
    sendRequest(
      'https://react-hooks-ea382-default-rtdb.firebaseio.com/purchases.json',
      'POST',
      JSON.stringify(purchase),
      purchase,
      'ADD_PURCHASE'
    );
  }, [sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'ADD_PURCHASE') {
      dispatchPurchases({
        type: 'ADD',
        purchase: { id: data.name, ...delItemId }
      })
    }
  }, [data, delItemId, reqIdentifier, isLoading, error]);

  const submitHandler = event => {
    event.preventDefault();

    if (inputTitleState.trim().length > 0 && inputAmountState !== '') {
      addPurchaseHandler({ title: inputTitleState, amount: inputAmountState, status: true });
      setTitleState('');
      setAmountState('');
    }
    else {
      alert('Invalid input values!')
    }
  };

  return (
    <div className="purchase-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Purchase</label>
            <input type="text" id="title" value={inputTitleState}
              onChange={event => setTitleState(event.target.value)}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={inputAmountState}
              onChange={event => setAmountState(event.target.value)}
            />
          </div>
          <div className="purchase-form__actions">
            <button type="submit">Add Purchase</button>
            {isLoading && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </div>
  );
});

export default PurchaseForm;

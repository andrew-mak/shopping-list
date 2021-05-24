import React, { useState } from 'react';

import Card from '../UI/Card';
import LoadingIndicator from '../UI/LoadingIndicator';
import '../../styles/PurchaseForm.css';

const PurchaseForm = React.memo(props => {
  const [inputTitleState, setTitleState] = useState('');
  const [inputAmountState, setAmountState] = useState('');

  const submitHandler = event => {
    event.preventDefault();

    if (inputTitleState.trim().length > 0 && inputAmountState !== '') {
      props.onAddPurchase({ title: inputTitleState, amount: inputAmountState });
      setTitleState('');
      setAmountState('');
    }
    else {
      alert('Invalid input values!')
    }
  };

  return (
    <section className="purchase-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
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
            {props.loading && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default PurchaseForm;

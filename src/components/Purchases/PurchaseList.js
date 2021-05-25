import React from 'react';

import LoadingIndicator from '../UI/LoadingIndicator';
import '../../styles/PurchaseList.css';

const PurchaseList = React.memo(props => {
  return (
    <section className="purchase-list">
      <h2>Already in list</h2>
      { props.purchases ?
        <ul>
          {props.purchases.map(ig => (
            <li key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
              <span>{ig.title}</span>
              <span>{ig.amount}x</span>
            </li>
          ))}
        </ul>
        : <LoadingIndicator />
      }
    </section>
  );
});

export default PurchaseList;

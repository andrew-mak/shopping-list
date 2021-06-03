import React from 'react';

import LoadingIndicator from '../UI/LoadingIndicator';
import '../../styles/PurchaseList.css';
import delIcon from '../../assets/del-icon-128.png';
import doneIcon from '../../assets/done-icon-128.png';

const PurchaseList = React.memo(props => {
  const { header, purchases, onToggleItem, onRemoveItem } = props;
  let purchasesElements = null;
  if (purchases && purchases !== 'initial' && purchases.length > 0) {
    purchases.sort((p1, p2) => (p1.active < p2.active) ? 1 : -1);
    purchasesElements = purchases.map(p =>
      <li key={p.id}>
        <input
          type={p.active ? "button" : "image"}
          className="check"
          alt="check as done"
          src={p.active ? "unset" : doneIcon}
          onClick={onToggleItem.bind(this, p.id, p.active)}
        />
        <div className={p.active ? "item" : "item done"}>
          <span>{p.title}</span>
          <span>{p.amount}</span>
        </div>
        <input
          type="image"
          alt="delete item"
          src={delIcon}
          onClick={onRemoveItem.bind(this, p.id)}
        />
      </li>
    )
  }
  return (
    <section className="purchase-list">
      <h2>{header || 'Purchases'}</h2>
      { purchases ?
        (purchases.length === 0 || purchases === 'initial') ?
          <LoadingIndicator />
          : < ul >{purchasesElements}</ul>
        : <p>The list is empty</p>
      }
    </section >
  );
});

export default PurchaseList;

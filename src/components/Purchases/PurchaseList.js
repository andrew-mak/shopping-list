import React from 'react';

import LoadingIndicator from '../UI/LoadingIndicator';
import '../../styles/PurchaseList.css';
import delIcon from '../../assets/del-icon-32.png';
import doneIcon from '../../assets/done-icon-32.png';
import makeDoneIcon from '../../assets/makedone-32.png';

const PurchaseList = React.memo(props => {
  const { header, purchases, onToggleItem, onRemoveItem } = props;
  console.log('[PurchaseList] RENDER, purchases:', purchases);
  return (
    <section className="purchase-list">
      <h2>{header || 'Purchases'}</h2>
      { purchases ?
        purchases.length < 1 ?
          // <p>The list is empty</p>
          <LoadingIndicator />
          : < ul >
            {
              purchases.map(p =>
                <li key={p.id}>
                  <input
                    type="image"
                    alt="check as done"
                    src={p.status ? makeDoneIcon : doneIcon}
                    onClick={onToggleItem.bind(this, p.id)}
                  />
                  <div className={Boolean(p.status) ? "item" : "item done"}>
                    <span>{p.title}</span>
                    <span>{p.amount}x</span>
                  </div>
                  <input
                    type="image"
                    alt="check as done"
                    src={delIcon}
                    onClick={onRemoveItem.bind(this, p.id)}
                  />
                </li>
              )
            }
          </ul> : <LoadingIndicator />
      }
    </section >
  );
});

export default PurchaseList;

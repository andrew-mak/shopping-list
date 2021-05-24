import React, { useReducer, useCallback, useMemo, useEffect } from 'react';

import PurchaseForm from './PurchaseForm';
import PurchaseList from './PurchaseList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

const purchaseReducer = (currentPurchState, action) => {
  switch (action.type) {
    case 'SET': return action.purchases;
    case 'ADD': return [...currentPurchState, action.purchase];
    case 'DELETE': return currentPurchState.filter(purch => purch.id !== action.id);
    default:
      throw new Error('Should not be there');
  }
};

function Purchases() {
  const [purchases, dispatchPurchases] = useReducer(purchaseReducer, '');
  const { isLoading, error, data, delItemId, reqIdentifier, sendRequest, clear } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_PURCHASE') {
      dispatchPurchases({ type: 'DELETE', id: delItemId })
    }
    else if (!isLoading && !error && reqIdentifier === 'ADD_PURCHASE') {
      dispatchPurchases({
        type: 'ADD',
        purchase: { id: data.name, ...delItemId }
      })
    }
  }, [data, delItemId, reqIdentifier, isLoading, error]);

  const filtredPurchasesHandler = useCallback(filtredPurchases => {
    dispatchPurchases({ type: 'SET', purchases: filtredPurchases });
  }, []);

  const addPurchaseHandler = useCallback(purchase => {
    sendRequest(
      'https://react-hooks-ea382-default-rtdb.firebaseio.com/purchases.json',
      'POST',
      JSON.stringify(purchase),
      purchase,
      'ADD_PURCHASE'
    );
  }, [sendRequest]);

  const removePurchaseHandler = useCallback(itemId => {
    sendRequest(
      `https://react-hooks-ea382-default-rtdb.firebaseio.com/purchases/${itemId}.json`,
      'DELETE',
      null,
      itemId,
      'REMOVE_PURCHASE'
    );
  }, [sendRequest]);

  const purchaseList = useMemo(() => {
    return <PurchaseList
      purchases={purchases}
      onRemoveItem={removePurchaseHandler}
    />
  }, [purchases, removePurchaseHandler])

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear} >{error}</ErrorModal>}
      <PurchaseForm
        onAddPurchase={addPurchaseHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadPurchases={filtredPurchasesHandler} />
        {purchaseList}
      </section>
    </div>
  );
}

export default Purchases;

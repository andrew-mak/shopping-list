import React, { useReducer, useCallback, useMemo, useEffect } from 'react';

import PurchaseList from './PurchaseList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';
import purchaseReducer from '../../reducer';



function Purchases() {
  const [purchases, dispatchPurchases] = useReducer(purchaseReducer, '');
  const { isLoading, error, data, delItemId, reqIdentifier, sendRequest, clear } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_PURCHASE') {
      dispatchPurchases({ type: 'DELETE', id: delItemId })
    }
  }, [data, delItemId, reqIdentifier, isLoading, error]);

  const filtredPurchasesHandler = useCallback(filtredPurchases => {
    dispatchPurchases({ type: 'SET', purchases: filtredPurchases });
  }, []);

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
      <Search onLoadPurchases={filtredPurchasesHandler} />
      {purchaseList}
    </div>
  );
}

export default Purchases;

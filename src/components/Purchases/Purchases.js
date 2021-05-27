import React, { useReducer, useCallback, useMemo, useEffect } from 'react';

import PurchaseList from './PurchaseList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';
import purchaseReducer from '../../reducer';



function Purchases() {
  const [purchases, dispatchPurchases] = useReducer(purchaseReducer, '');
  const { isLoading, error, data, itemId, reqIdentifier, sendRequest, clear } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'PATCH_PURCHASE') {
      dispatchPurchases({ type: 'PATCH', id: itemId })
    }
  }, [data, itemId, reqIdentifier, isLoading, error]);

  const filtredPurchasesHandler = useCallback(filtredPurchases => {
    dispatchPurchases({ type: 'SET', purchases: filtredPurchases });
  }, []);

  const togglePurchaseHandler = useCallback(itemId => {
    sendRequest(
      `https://react-hooks-ea382-default-rtdb.firebaseio.com/purchases/${itemId}.json`,
      'PATCH',
      JSON.stringify({ status: false }),
      itemId,
      'PATCH_PURCHASE'
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
      onToggleItem={togglePurchaseHandler}
      onRemoveItem={removePurchaseHandler}
    />
  }, [purchases, togglePurchaseHandler, removePurchaseHandler]);

  return (
    <>
      {error && <ErrorModal onClose={clear} >{error}</ErrorModal>}
      <Search onLoadPurchases={filtredPurchasesHandler} />
      {purchaseList}
    </>
  );
}

export default Purchases;

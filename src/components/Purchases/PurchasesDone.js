import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import useHttp from '../../hooks/http';
import purchaseReducer from '../../reducer';
import ErrorModal from '../UI/ErrorModal';
import PurchaseList from './PurchaseList';

const PurchasesDone = () => {
  console.log('[PurchasesDone] RENDER');
  const [purchases, dispatchPurchases] = useReducer(purchaseReducer, '');
  const { isLoading, data, error, itemId, sendRequest, clear } = useHttp();

  const loadedPurchasesHandler = useCallback(loadedPurchases => {
    console.log('[usecallback] loadedPurchases: ', loadedPurchases);
    dispatchPurchases({ type: "SET", purchases: loadedPurchases });
  }, []);

  const patchPurchaseHandler = useCallback(id => {
    console.log('[usecallback patch] id/purchases: ', id);
    dispatchPurchases({ type: "PATCH", id: id });
  }, []);

  const deletePurchaseHandler = useCallback(id => {
    console.log('[usecallback patch] id/purchases: ', id);
    dispatchPurchases({ type: "DELETE", id: id });
  }, []);

  useEffect(() => {
    sendRequest(
      'https://react-hooks-ea382-default-rtdb.firebaseio.com/purchases.json?orderBy="status"&equalTo=false',
      'GET'
    )
  }, [sendRequest]);

  useEffect(() => {
    console.log('------- 2-nd useEffect -----\n data: ', data);
    console.log('------- 2-nd useEffect -----\n purchases: ', purchases);
    if (!isLoading && !error) {
      if (itemId) {
        // patchPurchaseHandler(itemId);
        dispatchPurchases({ type: "PATCH", id: itemId });

      }
      else {
        let loadedPurchases = [];
        for (const key in data) {
          loadedPurchases.push({
            id: key,
            status: data[key].status,
            title: data[key].title,
            amount: data[key].amount,
          })
        }
        loadedPurchasesHandler(loadedPurchases);
      }
    }
  }, [data, error, isLoading, itemId, patchPurchaseHandler, loadedPurchasesHandler]);

  const removePurchaseHandler = useCallback(itemId => {
    sendRequest(
      `https://react-hooks-ea382-default-rtdb.firebaseio.com/purchases/${itemId}.json`,
      'DELETE',
      null,
      itemId,
      'REMOVE_PURCHASE'
    );
  }, [sendRequest]);

  const togglePurchaseHandler = useCallback(itemId => {
    sendRequest(
      `https://react-hooks-ea382-default-rtdb.firebaseio.com/purchases/${itemId}.json`,
      'PATCH',
      JSON.stringify({ status: true }),
      itemId,
      'PATCH_PURCHASE'
    );
  }, [sendRequest]);

  const purchaseList = useMemo(() => {
    return <PurchaseList
      header="Done"
      purchases={purchases}
      onToggleItem={togglePurchaseHandler}
      onRemoveItem={removePurchaseHandler}
    />
  }, [purchases, removePurchaseHandler, togglePurchaseHandler])

  return (
    <>
      {error && <ErrorModal onClose={clear} >{error}</ErrorModal>}
      {purchaseList}
    </>
  )
}

export default PurchasesDone;
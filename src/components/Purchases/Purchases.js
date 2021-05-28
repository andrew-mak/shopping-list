import React, { useReducer, useCallback, useMemo, useEffect } from 'react';

import PurchaseList from './PurchaseList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';
import purchaseReducer from '../../reducer';
import LoadingIndicator from '../UI/LoadingIndicator';
import "../../styles/Purchases.css";


function Purchases(props) {
  const [purchases, dispatchPurchases] = useReducer(purchaseReducer, '');
  const { isLoading, error, data, itemId, reqIdentifier, sendRequest, clear } = useHttp();

  useEffect(() => {
    if (props.type === "done") {
      sendRequest(
        'https://react-hooks-ea382-default-rtdb.firebaseio.com/purchases.json?orderBy="status"&equalTo=false',
        'GET',
        undefined,
        undefined,
        "GET_DONE"
      )
    }
  }, [props.type, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error) {
      if (reqIdentifier === 'PATCH_PURCHASE') {
        dispatchPurchases({ type: 'PATCH', id: itemId })
      }
      if (reqIdentifier === 'GET_DONE') {
        let loadedPurchases = [];
        for (const key in data) {
          loadedPurchases.push({
            id: key,
            status: data[key].status,
            title: data[key].title,
            amount: data[key].amount,
          })
        }
        dispatchPurchases({ type: 'SET', purchases: loadedPurchases });
      }
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

  const loadingDone = <div className="container"><h2>Done</h2><LoadingIndicator /></div>;

  const purchaseList = useMemo(() => {
    return <PurchaseList
      header={props.type==="all" ? "Purchases" : "Done"}
      purchases={purchases}
      onToggleItem={togglePurchaseHandler}
      onRemoveItem={removePurchaseHandler}
    />
  }, [purchases, props.type, togglePurchaseHandler, removePurchaseHandler]);

  return (
    <>
      {error && <ErrorModal onClose={clear} >{error}</ErrorModal>}
      {props.type === "all" ? <Search onLoadPurchases={filtredPurchasesHandler} /> : null}
      {(isLoading && reqIdentifier === 'GET_DONE') ? loadingDone : purchaseList}
    </>
  );
}

export default Purchases;

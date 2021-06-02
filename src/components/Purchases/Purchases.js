import React, { useReducer, useCallback, useMemo, useEffect } from 'react';

import PurchaseList from './PurchaseList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';
import purchaseReducer from '../../reducer';
import LoadingIndicator from '../UI/LoadingIndicator';
import "../../styles/Purchases.css";


const Purchases = props => {
  const { isLoading, error, data, itemId, reqIdentifier, sendRequest, clear } = useHttp();
  const [purchases, dispatchPurchases] = useReducer(purchaseReducer, 'initial');

  useEffect(() => {
    if (props.type === "done") {
      dispatchPurchases({ type: 'SET', data: [] });
      sendRequest(
        'https://react-hooks-ea382-default-rtdb.firebaseio.com/purchases.json?orderBy="active"&equalTo=false',
        'GET',
        undefined,
        undefined,
        "GET_DONE"
      )
    }
    else {
      dispatchPurchases({ type: 'SET', data: [] });
    }
  }, [props.type, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error) {
      if (reqIdentifier === 'PATCH_PURCHASE') {
        dispatchPurchases({ type: 'PATCH', id: itemId });
      }
      else if (reqIdentifier === 'REMOVE_PURCHASE') {
        dispatchPurchases({ type: 'DELETE', id: itemId })
      }
      else if (reqIdentifier === 'GET_DONE') {
        if (data.length === 0) dispatchPurchases({ type: 'SET', data: [] });
        else if (Object.keys(data).length === 0 && data.constructor === Object) dispatchPurchases({ type: 'SET', data: null });
        else dispatchPurchases({ type: 'SET', data: data });
      }
    }
  }, [data, itemId, reqIdentifier, isLoading, error]);

  const filtredPurchasesHandler = useCallback(filtredPurchases => {
    if (filtredPurchases && Object.keys(filtredPurchases).length === 0 && filtredPurchases.constructor === Object) dispatchPurchases({ type: 'SET', data: null });
    else dispatchPurchases({ type: 'SET', data: filtredPurchases });
  }, []);

  const togglePurchaseHandler = useCallback((itemId, active) => {
    sendRequest(
      `https://react-hooks-ea382-default-rtdb.firebaseio.com/purchases/${itemId}.json`,
      'PATCH',
      JSON.stringify({ active: !active }),
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

  const purchaseList = useMemo(() => <PurchaseList
    header={props.type === "all" ? "Purchases" : "Done"}
    purchases={purchases}
    onToggleItem={togglePurchaseHandler}
    onRemoveItem={removePurchaseHandler}
  />, [purchases, props.type, togglePurchaseHandler, removePurchaseHandler]);

 return (
    <>
      {error && <ErrorModal onClose={clear} >{error}</ErrorModal>}
      {props.type === "all" ? <Search onLoadPurchases={filtredPurchasesHandler} /> : null}
      {(isLoading && reqIdentifier === 'GET_DONE') ? loadingDone : purchaseList}
    </>
  );
}

export default Purchases;

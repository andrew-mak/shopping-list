import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier
      };
    case 'RESPONSE':
      return {
        ...curHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra
      };
    case 'ERROR':
      return {
        loading: false,
        error: action.errorMessage
      };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('Should not be there');
  }
}

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

  const sendRequest = useCallback((url, method, body, delItemId, reqIdentifier) => {
    dispatchHttp({ type: 'SEND', identifier: reqIdentifier });
    fetch(url, {
      method: method,
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(responseData => dispatchHttp({ type: 'RESPONSE', responseData: responseData, extra: delItemId }))
      .catch(error => {
        dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong :(\n' + error.message });
      });
  }, []);

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    delItemId: httpState.extra,
    reqIdentifier: httpState.identifier,
    sendRequest: sendRequest,
    clear: clear
  };
};

export default useHttp;
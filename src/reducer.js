export default function purchaseReducer(currentPurchState, action) {
  console.log('[reducer] action: ', action);
  console.log('[reducer] state: ', currentPurchState);
  switch (action.type) {
    case 'SET': return action.purchases;
    case 'ADD': return [...currentPurchState, action.purchase];
    case 'PATCH':
      {
        const i = currentPurchState.findIndex(purch => purch.id === action.id);
        console.log('[REDUCER] action.id: ', action.id);
        console.log('[REDUCER] target: ', i);
        // if (target) {
        if(typeof i ==="number"){
          // console.log('[REDUCER] currentPurchState[target].staus: ', currentPurchState[i].status);
          // let value = !currentPurchState[i].status;
          // console.log('[REDUCER] !currentPurchState[target].staus: ', value);
          // target.status = !target.status;
          // const newState = currentPurchState.filter(purch => purch.id !== action.id);
          // newState.push(target);
          // console.log('[REDUCER] newState: ', newState);
          // return newState
          currentPurchState[i].status = !currentPurchState[i].status;
          return currentPurchState;
        }
        else return currentPurchState
      }
    case 'DELETE': return currentPurchState.filter(purch => purch.id !== action.id);
    default:
      throw new Error('Should not be there');
  }
};
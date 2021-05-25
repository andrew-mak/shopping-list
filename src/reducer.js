export default function purchaseReducer (currentPurchState, action) {
  switch (action.type) {
    case 'SET': return action.purchases;
    case 'ADD': return [...currentPurchState, action.purchase];
    case 'DELETE': return currentPurchState.filter(purch => purch.id !== action.id);
    default:
      throw new Error('Should not be there');
  }
};
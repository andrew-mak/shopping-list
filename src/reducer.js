export default function purchaseReducer(currentState, action) {
  switch (action.type) {
    case 'SET':
      if (action.data) {
        let loadedPurchases = [];
        for (const key in action.data) {
          loadedPurchases.push({
            id: key,
            active: action.data[key].active,
            title: action.data[key].title,
            amount: action.data[key].amount,
          })
        }
        return loadedPurchases
      }
      else if (action.data === null && currentState === 'initial') return []
      else return action.data
    case 'ADD': return [...currentState, action.purchase];
    case 'PATCH':
      const target = currentState.find(purch => purch.id === action.id);
      const state = currentState.filter(purch => purch.id !== action.id);
      if (target) {
        const changed = { ...target };
        changed.active = !changed.active;
        state.push(changed);
        return state;
      }
      return currentState
    case 'DELETE':
      const updState = currentState.filter(purch => purch.id !== action.id);
      if (updState.length) return updState
      else return null
    default:
      throw new Error('Should not be there');
  }
};
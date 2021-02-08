import React, { useReducer, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (currentIngrState, action) => {
  switch (action.type) {
    case 'SET': return action.ingredients;
    case 'ADD': return [...currentIngrState, action.ingredient];
    case 'DELETE': return currentIngrState.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not be there');
  }
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND': return { loading: true, error: null };
    case 'RESPONSE': return { ...curHttpState, loading: false };
    case 'ERROR': return { loading: false, error: action.errorMessage };
    case 'CLEAR': return { ...curHttpState, error: null }
    default:
      throw new Error('Should not be there');
  }
}

function Ingredients() {
  const [ingredients, dispatchIngredients] = useReducer(ingredientReducer, '');
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null });

  const filtredIngredientsHandler = useCallback(filtredIngredients => {
    dispatchIngredients({ type: 'SET', ingredients: filtredIngredients });
  }, []);

  const addIngredientHandler = ingredient => {
    dispatchHttp({ type: 'SEND' });
    fetch('https://react-hooks-ea382-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json()).then(responseData => {
      dispatchHttp({ type: 'RESPONSE' });
      dispatchIngredients({
        type: 'ADD',
        ingredient: { id: responseData.name, ...ingredient }
      })
    })
  };

  const removeIngredientHandler = itemId => {
    dispatchHttp({ type: 'SEND' });
    fetch(`https://react-hooks-ea382-default-rtdb.firebaseio.com/ingredients/${itemId}.json`, {
      method: 'DELETE'
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE' });
      dispatchIngredients({
        type: 'DELETE',
        id: itemId
      })
    }).catch(error => {
      dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong :(\n' + error.message });
    });
  };

  const clearError = () => {
    dispatchEvent({ type: 'CLEAR' });
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError} >{httpState.error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filtredIngredientsHandler} />
        <IngredientList ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;

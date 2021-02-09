import React, { useReducer, useCallback, useMemo, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngrState, action) => {
  switch (action.type) {
    case 'SET': return action.ingredients;
    case 'ADD': return [...currentIngrState, action.ingredient];
    case 'DELETE': return currentIngrState.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not be there');
  }
};

function Ingredients() {
  const [ingredients, dispatchIngredients] = useReducer(ingredientReducer, '');
  const { isLoading, error, data, delItemId, reqIdentifier, sendRequest, clear } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatchIngredients({ type: 'DELETE', id: delItemId })
    }
    else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatchIngredients({
        type: 'ADD',
        ingredient: { id: data.name, ...delItemId }
      })
    }
  }, [data, delItemId, reqIdentifier, isLoading, error]);

  const filtredIngredientsHandler = useCallback(filtredIngredients => {
    dispatchIngredients({ type: 'SET', ingredients: filtredIngredients });
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      'https://react-hooks-ea382-default-rtdb.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(itemId => {
    sendRequest(
      `https://react-hooks-ea382-default-rtdb.firebaseio.com/ingredients/${itemId}.json`,
      'DELETE',
      null,
      itemId,
      'REMOVE_INGREDIENT'
    );
  }, [sendRequest]);

  const ingredientList = useMemo(() => {
    return <IngredientList
      ingredients={ingredients}
      onRemoveItem={removeIngredientHandler}
    />
  }, [ingredients, removeIngredientHandler])

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear} >{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filtredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;

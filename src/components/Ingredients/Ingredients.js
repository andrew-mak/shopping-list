import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

function Ingredients() {
  const [ingredients, setIngredientsState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const filtredIngredientsHandler = useCallback(filtredIngredients => {
    setIngredientsState(filtredIngredients);
  }, [setIngredientsState]);

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://react-hooks-ea382-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json()).then(responseData => {
      setIsLoading(false);
      setIngredientsState(prevIngredients => [
        ...prevIngredients,
        { id: responseData.name, ...ingredient }
      ]);
    })
  };

  const removeIngredientHandler = itemId => {
    setIsLoading(true);
    fetch(`https://react-hooks-ea382-default-rtdb.firebaseio.com/ingredients/${itemId}.json`, {
      method: 'DELETE'
    }).then(response => {
      setIsLoading(false);
      setIngredientsState(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== itemId));
    }).catch(error => {
      setIsLoading(false);
      setError('Something went wrong :(');
    });
  };

  const clearError = () => {
    setError(null);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError} >{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
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

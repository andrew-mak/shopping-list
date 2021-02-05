import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {
  const [ingredients, setIngredientsState] = useState([]);

  const filtredIngredientsHandler = useCallback(filtredIngredients => {
    setIngredientsState(filtredIngredients);
  }, [setIngredientsState]);

  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-ea382-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json()).then(responseData => {
      setIngredientsState(prevIngredients => [
        ...prevIngredients,
        { id: responseData.name, ...ingredient }
      ]);
    })
  };

  const removeIngredientHandler = itemId => {
    fetch(`https://react-hooks-ea382-default-rtdb.firebaseio.com/ingredients/${itemId}.json`, {
      method: 'DELETE'
    }).then(response => {
      setIngredientsState(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== itemId));
    });
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

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

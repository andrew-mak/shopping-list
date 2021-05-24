import React from 'react';

import LoadingIndicator from '../UI/LoadingIndicator';
import '../../styles/IngredientList.css';

const IngredientList = React.memo(props => {
  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      { props.ingredients ?
        <ul>
          {props.ingredients.map(ig => (
            <li key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
              <span>{ig.title}</span>
              <span>{ig.amount}x</span>
            </li>
          ))}
        </ul>
        : <LoadingIndicator />
      }
    </section>
  );
});

export default IngredientList;

import React from 'react';

import '../../styles/Card.css';

const Card = props => {
  return <div className="card">{props.children}</div>;
};

export default Card;

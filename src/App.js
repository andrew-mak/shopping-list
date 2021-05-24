import React, { useContext } from 'react';

import Purchases from './components/Purchases/Purchases';
import Auth from './components/Auth';
import { AuthContext } from './context/auth-context';

const App = props => {
  const authContext = useContext(AuthContext);

  let content = <Auth />;
  if (authContext.isAuth) content = <Purchases />

    return content;
};

export default App;

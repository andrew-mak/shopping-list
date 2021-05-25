import React, { useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import Purchases from './components/Purchases/Purchases';
import Auth from './components/Auth';
import { AuthContext } from './context/auth-context';
import Layout from './components/UI/Layout';
import PurchaseForm from './components/Purchases/PurchaseForm';

const App = props => {
  const authContext = useContext(AuthContext);

  const routs = <Switch>
    <Route path="/add" component={PurchaseForm} />
    <Route path="/purchases" component={Purchases} />
    <Route path="/" component={Purchases} />
  </Switch>;

  return (
    <>
      <Layout />
      {authContext.isAuth ? routs : <Auth />}
    </>
  )
};

export default App;

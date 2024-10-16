import React, { useEffect } from 'react';
import Navbar from './NavBar';
import { Container} from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import 'semantic-ui-css/semantic.min.css';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';

function App() {
  const location = useLocation();

  return (
    <>
      {location.pathname === '/' ? <HomePage/> : (
        <>
        <Navbar/>
        <Container style={{marginTop:'7em'}}>
          <Outlet />
        </Container>
        </>
      )}
      

    </>
  );
}

export default observer(App);

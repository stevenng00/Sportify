import React, { useEffect } from 'react';
import Navbar from './NavBar';
import { Container} from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import 'semantic-ui-css/semantic.min.css';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  const {activityStore} = useStore();

  useEffect(() => {
   activityStore.loadActivities();
  }, [activityStore])


  if(activityStore.loadingInitial)return <LoadingComponent content='Loading app'/>

  return (
    <>
      <Navbar/>
      <Container style={{marginTop:'7em'}}>
        <ActivityDashboard/>
      </Container>

    </>
  );
}

export default observer(App);

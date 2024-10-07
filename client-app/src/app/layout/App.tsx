import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Activity } from '../models/activity';
import Navbar from './NavBar';
import { List ,Container} from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import 'semantic-ui-css/semantic.min.css';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Activity[]>("http://localhost:5000/api/activities")
    .then(response =>{
      setActivities(response.data);
    })
  }, [])

  function handleSelectActivity(id:string)
  {
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handleCancelSetActivity(){
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string)
  {
    id ? handleSelectActivity(id) : handleCancelSetActivity();
    setEditMode(true);
  }

  function handleFormClose(){
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity){
    activity.id ? setActivities([...activities.filter(x => x.id !== activity.id),activity])
    : setActivities([...activities, activity]);

    setEditMode(false);
    setSelectedActivity(activity);

  }

  return (
    <>
      <Navbar openForm={handleFormOpen}/>
      <Container style={{marginTop:'7em'}}>
        <ActivityDashboard 
        activities={activities}
        selectedActivity={selectedActivity}
        selectActivity={handleSelectActivity}
        cancelSelectActivity={handleCancelSetActivity}
        editMode={editMode}
        openForm={handleFormOpen}
        closeForm={handleFormClose}
        createOrEdit={handleCreateOrEditActivity}
        />
      </Container>

    </>
  );
}

export default App;

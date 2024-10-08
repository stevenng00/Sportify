import React, { useEffect, useState } from 'react';
import { Activity } from '../models/activity';
import Navbar from './NavBar';
import { Container} from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import 'semantic-ui-css/semantic.min.css';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    agent.Activities.list()
    .then(response =>{
      setActivities(response);
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
    : setActivities([...activities, {...activity,id:uuid()}]);

    setEditMode(false);
    setSelectedActivity(activity);

  }

  function handleDeleteActivity(id:string){
    setActivities([...activities.filter(x=>x.id !==id)])
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
        deleteActivity={handleDeleteActivity}
        />
      </Container>

    </>
  );
}

export default App;
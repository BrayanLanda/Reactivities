import { useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import NavBar from "./NavBar";
import { ActivityDashboard } from "../../features/activities/dashboard/ActivityDashboard";
import {v4 as uuid} from 'uuid';
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/store";

function App() {
  const {activityStore} = useStore();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editModel, setEditModel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list().then(response => {
        let activities: Activity[] = [];
        response.forEach(activity => {
          activity.date = activity.date.split('T')[0];
          activities.push(activity);
        })
        setActivities(activities);
        setLoading(false);
      });
  }, []);

  function handleSelectActivity(id: string){
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handleCancelSelectAcitivity(){
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string){
    id ? handleSelectActivity(id) : handleCancelSelectAcitivity();
    setEditModel(true);
  }

  function handleFormClose(){
    setEditModel(false);
  }

  function handleCreateOrEditActivity(activity: Activity){
    setSubmitting(true);
    if(activity.id){
      agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter(x => x.id !== activity.id), activity]);
        setSelectedActivity(activity);
        setEditModel(false);
        setSubmitting(false);
      })
    }else{
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditModel(false);
        setSubmitting(false);
      })
    }
  }

  function handleDeleteActivity(id: string){
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    });
  }

  if(loading) return <LoadingComponent content="Loading App" />

  return (
    <div>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{ marginTop: "7em" }}>
        <h2>{activityStore.title}</h2>
        <ActivityDashboard 
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectAcitivity}
          editModel={editModel}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </div>
  );
}

export default App;

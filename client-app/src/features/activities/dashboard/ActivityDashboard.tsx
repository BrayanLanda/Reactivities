import { Grid, GridColumn } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from "../form/ActivityForm";

interface Props {
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: (id: string) => void;
    cancelSelectActivity: () => void;
    editModel: boolean;
    openForm: (id: string) => void;
    closeForm: () => void;
}

export const ActivityDashboard = ({activities, selectedActivity, selectActivity, cancelSelectActivity, editModel, openForm, closeForm }:Props) => {
  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList 
          activities={activities}
          selectActivity={selectActivity}
        />
      </Grid.Column>
      <GridColumn width={6}>
        {selectedActivity && !editModel &&
        <ActivityDetails 
          activity={selectedActivity} 
          cancelSelectActivity={cancelSelectActivity}
          openForm={openForm}
        />}
        {editModel &&
        <ActivityForm
          closeForm={closeForm}
          activity={selectedActivity}
        />}
      </GridColumn>
    </Grid>
  );
};

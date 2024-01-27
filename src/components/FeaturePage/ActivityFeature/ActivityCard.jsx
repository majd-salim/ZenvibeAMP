import { useState } from "react";
import PropTypes from "prop-types";

export default function ActivityCard({
  activities,
  setActivities,
  selectedActivityType,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedActivityName, setUpdatedActivityName] = useState("");
  const [updatedSets, setUpdatedSets] = useState(0);
  const [updatedReps, setUpdatedReps] = useState(0);
  const [updatedLiftWeight, setUpdatedLiftWeight] = useState(0);
  const [updatedDuration, setUpdatedDuration] = useState(0);

  const deleteActivity = async (activityEntryId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/activity/${activityEntryId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      ) .then(() => {setActivities((prevActivities) =>
        prevActivities.filter((activity) => activity.id !== activityEntryId)
      );});

  
      console.log("Delete response:", response);
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorMessage}`
        );
      }
  
      // Update the state by filtering out the deleted entry
      // setActivities((prevActivities) =>
      //   prevActivities.filter((activity) => activity.id !== activityEntryId)
      // );
     

    } catch (error) {
      console.error("Error deleting activity entry:", error);
    }
  };
  
  

  const editActivity = async (
    activityEntryId,
    updatedActivityName,
    updatedSets,
    updatedReps,
    updatedLiftWeight,
    updatedDuration
  ) => {
    console.log(activities, "all activity entries");

    try {
      if (!activityEntryId) {
        console.error("Activity entry ID is undefined.");
        return;
      }
      const payload = {
        activity_name: updatedActivityName,
        sets: parseFloat(updatedSets),
        reps: parseFloat(updatedReps),
        lift_weight: parseFloat(updatedLiftWeight),
        duration: parseFloat(updatedDuration),
      };

      const response = await fetch(
        `http://localhost:3000/activity/${activityEntryId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setActivities((prevActivity) =>
        prevActivity.map((activityEntry) =>
          activityEntry.entry_id === activityEntryId
            ? { ...activityEntry, ...payload } // Update only the relevant fields
            : activityEntry
        )
      );
      //   fetchActivities();
      //   setIsEditing(false);
    } catch (error) {
      console.log("Error updating activity entry:", error);
    }
  };

  return (
    <div>
      {/* <h3>Activities List</h3> */}

      {activities.map((activity) => (
        <div key={activity.entry_id}>
          {!isEditing ? (
            <div>
              {activity.activity_name && (
                <p>Activity Name: {activity.activity_name}</p>
              )}
              {activity.sets && <p>Sets: {activity.sets}</p>}
              {activity.reps && <p>Reps: {activity.reps}</p>}
              {activity.lift_weight && (
                <p>Weight Lifted: {activity.lift_weight}</p>
              )}
              {activity.duration && (
                <p>Duration: {activity.duration}</p>
              )}
              {selectedActivityType && (
                <div>Activity Type: {selectedActivityType}</div>
              )}
              {/* Additional details can be displayed here */}
            </div>
          ) : (
            <div>
              {/* Editing form */}
              <input
                placeholder="Enter Activity"
                onChange={(e) => {
                  setUpdatedActivityName(e.target.value);
                }}
              />
              <input
                placeholder="Enter Sets"
                onChange={(e) => {
                  setUpdatedSets(e.target.value);
                }}
              />
              <input
                placeholder="Enter Reps"
                onChange={(e) => {
                  setUpdatedReps(e.target.value);
                }}
              />
              <input
                placeholder="Enter Weight Lifted"
                onChange={(e) => {
                  setUpdatedLiftWeight(e.target.value);
                }}
              />
              <input
                placeholder="Enter Duration"
                onChange={(e) => {
                  setUpdatedDuration(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  editActivity(
                    activity.entry_id,
                    updatedActivityName,
                    updatedSets,
                    updatedReps,
                    updatedLiftWeight,
                    updatedDuration
                  );
                  setIsEditing(!isEditing);
                }}
              >
                Update Activity
              </button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          )}

          <button
            onClick={() => {
              setIsEditing(!isEditing);
            }}
          >
            ✎
          </button>
          <button
            onClick={() => {
              deleteActivity(activity.entry_id);
            }}
          >
            ❌
          </button>
        </div>
      ))}
    </div>
  );
}

ActivityCard.propTypes = {
  activities: PropTypes.array.isRequired,
  setActivities: PropTypes.func.isRequired,
  selectedActivityType: PropTypes.string.isRequired,
};

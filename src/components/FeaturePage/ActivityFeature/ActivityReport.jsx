import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import ActivityCard from "./ActivityCard";
import ActivityLog from "./ActivityLog";
import { Pie } from "react-chartjs-2";
import SideNav from "../../../components/dashboard/sidebar/SideNav";
import UserProfile from "../../dashboard/UserProfile/UserProfile";
import "../ActivityFeature/ActivityReport.css";

function ActivityTrack() {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    activity_name: "",
    sets: 0,
    reps: 0,
    lift_weight: 0,
    duration: 0,

    //entry_date: "",
  });
 
  //console.log(activities, "this one")

    entry_date: "",
  });

  const [activityStreak, setActivityStreak] = useState(0);
  const [pieChartData, setPieChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],

        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", // Example colors
        ],
        hoverBackgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", // Example hover colors
        ],

        backgroundColor: ["red", "gray", "blue"], // Colors for Weights, Other, and Cardio respectively
        hoverBackgroundColor: ["red", "gray", "blue"], // Hover colors

      },
    ],
  });
  const { id: userId } = useParams();

  const fetchActivities = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/activity/${userId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch activities");
      const data = await response.json();
      setActivities(data);
      preparePieChartData(data); // Call to prepare pie chart data
    } catch (error) {
      console.error("Fetch Activities Error:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  //console.log(fetchActivities)

  // const handleCreateActivity = async (event) => {
  //   event.preventDefault();
  //   const activityData = {
  //     ...newActivity,
  //     sets: newActivity.sets || null,
  //     reps: newActivity.reps || null,
  //     lift_weight: newActivity.lift_weight || null,
  //     duration: newActivity.duration || null,
  //     entry_date:
  //       newActivity.entry_date || new Date().toISOString().split("T")[0], // default to current date if not provided
  //   };

  //   try {
  //     const response = await fetch(`http://localhost:3000/activity/${userId}`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(activityData),
  //       credentials: "include",
  //     });
  //     if (!response.ok) {
  //       const errorResponse = await response.json();
  //       throw new Error(errorResponse.error || "Failed to create activity");
  //     }
  //     setNewActivity({
  //       activity_name: "",
  //       sets: 0,
  //       reps: 0,
  //       lift_weight: 0,
  //       duration: 0,
  //       entry_date: "",
  //     });
  //     await fetchActivities();
  //   } catch (error) {
  //     console.error("Create Activity Error:", error);
  //   }
  // };

  const preparePieChartData = (activities) => {
    const activityTypes = activities.reduce((acc, activity) => {
      const type = activity.activity_name || "Other"; // Use activity_name as category, default to 'Other'
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const chartData = {
      labels: Object.keys(activityTypes),
      datasets: [
        {
          label: "Activity Types",
          data: Object.values(activityTypes),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ], // Example colors
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ], // Example hover colors

  const handleCreateActivity = async (event) => {
    event.preventDefault();
    const activityData = {
      ...newActivity,
      sets: newActivity.sets || null,
      reps: newActivity.reps || null,
      lift_weight: newActivity.lift_weight || null,
      duration: newActivity.duration || null,
      entry_date:
        newActivity.entry_date || new Date().toISOString().split("T")[0], // default to current date if not provided
    };

    try {
      const response = await fetch(`http://localhost:3000/activity/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData),
        credentials: "include",
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to create activity");
      }
      setNewActivity({
        activity_name: "",
        sets: 0,
        reps: 0,
        lift_weight: 0,
        duration: 0,
        entry_date: "",
      });
      await fetchActivities();
    } catch (error) {
      console.error("Create Activity Error:", error);
    }
  };

  const preparePieChartData = (activities) => {
    const activityCategories = {
      Weights: 0,
      Cardio: 0,
      Other: 0,
    };

    activities.forEach((activity) => {
      const activityName = activity.activity_name || "Other"; // Default to 'Other' if no name is provided
      const lowercaseActivityName = activityName.toLowerCase();

      // Categorize activities based on keywords in the name
      if (lowercaseActivityName.includes("weight")) {
        activityCategories.Weights++;
      } else if (
        lowercaseActivityName.includes("cardio") ||
        lowercaseActivityName.includes("running")
      ) {
        activityCategories.Cardio++;
      } else {
        activityCategories.Other++;
      }
    });

    const chartData = {
      labels: Object.keys(activityCategories),
      datasets: [
        {
          label: "Activity Types",
          data: Object.values(activityCategories),
          backgroundColor: ["red", "gray", "blue"], // Colors for Weights, Other, and Cardio respectively
          hoverBackgroundColor: ["red", "gray", "blue"], // Hover colors
        },
      ],
    };

    setPieChartData(chartData);
  };

  useEffect(() => {
    preparePieChartData(activities);
  }, [activities]);

  // Calculate Activity Streak
  useEffect(() => {
    if (activities.length === 0) {
      setActivityStreak(0);
      return;
    }

    const sortedActivities = [...activities].sort(
      (a, b) => new Date(b.entry_date) - new Date(a.entry_date)
    );
    let streak = 1;
    let previousDate = new Date(sortedActivities[0].entry_date);

    for (let i = 1; i < sortedActivities.length; i++) {
      const currentDate = new Date(sortedActivities[i].entry_date);
      const diffTime = Math.abs(currentDate - previousDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else if (diffDays > 1) {
        break;
      }
      previousDate = currentDate;
    }

    setActivityStreak(streak);
  }, [activities]);

//   console.log("Activities:", activities);
// console.log("Pie Chart Data:", pieChartData);

  return (
    <div className="App">
      <SideNav userId={userId} />
      <UserProfile userId={userId} />
      {/* <ActivityCard /> */}
      
      <div className="activity-content">
        
      <h2>Activities</h2>
        <div>Activity Streak: {activityStreak} days</div>
        {pieChartData && pieChartData.labels.length > 0 ? (
          <Pie data={pieChartData} />
        ) : (
          <p>Loading chart data...</p>
        )}
        
        
      <ActivityLog activities={activities} setActivities = {setActivities}fetchActivities={fetchActivities}  />
      <div className="activity-content">
        <h2>Activities</h2>
        <div>Activity Streak: {activityStreak} days</div>
        {pieChartData && pieChartData.labels.length > 0 ? (
          <div className="activity-spacing">
            {" "}
            {/* Added this div with the class */}
            <Pie data={pieChartData} />
          </div>
        ) : (
          <p>Loading chart data...</p>
        )}
        <form onSubmit={handleCreateActivity}>
          <input
            type="text"
            placeholder="Activity Name"
            value={newActivity.activity_name}
            onChange={(e) =>
              setNewActivity({ ...newActivity, activity_name: e.target.value })
            }
            className="activity-input"
          />
          {/* Add other input fields for sets, reps, etc. */}
          <button type="submit" className="activity-button">
            Add Activity
          </button>
        </form>
      </div>
    </div>
  );
}

export default ActivityTrack;
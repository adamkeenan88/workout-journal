import React, { useState, useEffect } from "react";
import axios from "axios";
import WorkoutForm from "./WorkoutForm";
import WorkoutHistory from "./WorkoutHistory";

// Predefined exercises for each category
const predefinedExercises = {
  Push: ["Bench Press", "Overhead Press", "Incline Dumbbell Press"],
  Pull: ["Deadlift", "Pull-Up", "Barbell Row"],
  Legs: ["Squat", "Leg Press", "Lunges", "Leg Curls"],
  Abs: ["Hanging Leg Raises", "Mountain Climbers/Dead Bug/Leg Raises", "Planks", "Decline Sit-Ups", "Cable Wood Chops"],
};

const App = () => {
  const [workouts, setWorkouts] = useState([]);
  const [categories] = useState(Object.keys(predefinedExercises)); // Get the categories from the predefined exercises

    // Fetch workouts from the backend
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get("http://localhost:5001/workouts");
        setWorkouts(response.data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

  // Load workouts from the backend when the component mounts
  useEffect(() => {
    fetchWorkouts();
  }, []);


  // Add a new workout entry
  const addWorkout = (workout) => {
    axios.post("http://localhost:5001/workouts", workout)
      .then((response) => setWorkouts([...workouts, response.data]))
      .catch((error) => console.error("Error adding workout:", error));
  };

  // Sort workouts by date (oldest to newest)
  const sortedWorkouts = workouts.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="App">
      <h1>Workout Journal</h1>
      <WorkoutForm
        categories={categories}
        predefinedExercises={predefinedExercises}
        addWorkout={addWorkout}
      />
      <WorkoutHistory workouts={sortedWorkouts} fetchWorkouts={fetchWorkouts} />
    </div>
  );
};

export default App;

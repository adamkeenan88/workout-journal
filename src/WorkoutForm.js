import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const WorkoutForm = ({ categories, predefinedExercises, addWorkout }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [exercisesData, setExercisesData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    // Reset exercises data when category changes
    if (category) {
      const exercises = predefinedExercises[category];
      const initialExercisesData = exercises.reduce((acc, exercise) => {
        acc[exercise] = { weight: "", reps: "", sets: "" };
        return acc;
      }, {});
      setExercisesData(initialExercisesData);
    } else {
      setExercisesData({});
    }
  };

  const handleInputChange = (exercise, field, value) => {
    setExercisesData({
      ...exercisesData,
      [exercise]: { ...exercisesData[exercise], [field]: value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct the workout object
    const workout = {
      date: selectedDate.toLocaleDateString(), // Save the selected date
      category: selectedCategory,
      exercises: Object.entries(exercisesData).map(([exercise, { weight, reps, sets }]) => ({
        exercise,
        weight,
        reps,
        sets,
      })),
    };

    // Add the new workout
    addWorkout(workout);

    // Reset the form
    setSelectedCategory("");
    setExercisesData({});
    setSelectedDate(new Date()); // Reset the date picker
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Workout Category</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && (
        <div>
          <h3>Exercises for {selectedCategory}</h3>
          {predefinedExercises[selectedCategory].map((exercise) => (
            <div key={exercise}>
              <h4>{exercise}</h4>
              <label>Weight (lbs)</label>
              <input
                type="number"
                value={exercisesData[exercise]?.weight || ""}
                onChange={(e) =>
                  handleInputChange(exercise, "weight", e.target.value)
                }
                required
              />
              <label>Reps</label>
              <input
                type="number"
                value={exercisesData[exercise]?.reps || ""}
                onChange={(e) =>
                  handleInputChange(exercise, "reps", e.target.value)
                }
                required
              />
              <label>Sets</label>
              <input
                type="number"
                value={exercisesData[exercise]?.sets || ""}
                onChange={(e) =>
                  handleInputChange(exercise, "sets", e.target.value)
                }
                required
              />
            </div>
          ))}
        </div>
      )}

      <div>
        <label>Workout Date</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="MM/dd/yyyy"
        />
      </div>

      <button type="submit">Add Workout</button>
    </form>
  );
};

export default WorkoutForm;

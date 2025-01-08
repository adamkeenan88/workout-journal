import React, { useState } from "react";
import axios from "axios";

const WorkoutHistory = ({ workouts, fetchWorkouts }) => {
  const [expandedIndex, setExpandedIndex] = useState(null); // To track which workout's details are expanded
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    category: "",
    exercises: [],
  });

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index); // Toggle the selected workout's expansion
  };

  const handleEditClick = (workout) => {
    setEditingWorkout(workout);
    setFormData(workout);
  };

  const handleFormChange = (e, exerciseIndex, field) => {
    const updatedExercises = [...formData.exercises];
    updatedExercises[exerciseIndex][field] = e.target.value;
    setFormData({ ...formData, exercises: updatedExercises });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5001/workouts/${editingWorkout._id}`, formData);
      setEditingWorkout(null);
      fetchWorkouts(); // Refresh the workouts list after editing
    } catch (error) {
      console.error("Error editing workout:", error);
    }
  };

  const handleDelete = async (workoutId) => {
    try {
      // Send DELETE request to the backend to remove the workout
      await axios.delete(`http://localhost:5001/workouts/${workoutId}`);
      fetchWorkouts(); // Fetch the updated list of workouts to reflect the deletion
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };
  

  return (
    <div>
      <h2>Workout History</h2>
      {workouts.length === 0 ? (
        <p>No workouts saved yet!</p>
      ) : (
        <div className="accordion">
          {workouts.map((workout, index) => (
            <div key={workout._id} className="workout-item">
              <div
                className="workout-header"
                onClick={() => toggleExpand(index)} // Toggle expansion on click
              >
                <p>
                  <strong>Date:</strong> {workout.date}
                </p>
                <span>{expandedIndex === index ? "▼" : "►"}</span>
              </div>

              {expandedIndex === index && (
                <div className="workout-details">
                  <p><strong>Category:</strong> {workout.category}</p>
                  <ul>
                    {workout.exercises.map((exercise, idx) => (
                      <li key={idx}>
                        <p><strong>Exercise:</strong> {exercise.exercise}</p>
                        <p><strong>Weight:</strong> {exercise.weight} lbs</p>
                        <p><strong>Reps:</strong> {exercise.reps}</p>
                        <p><strong>Sets:</strong> {exercise.sets}</p>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => handleEditClick(workout)}>Edit</button>
                  <button onClick={() => handleDelete(workout._id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editingWorkout && (
        <div className="edit-workout-form">
          <h3>Edit Workout</h3>
          <form onSubmit={handleSubmitEdit}>
            <div>
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            <h4>Exercises</h4>
            {formData.exercises.map((exercise, index) => (
              <div key={index}>
                <label>Exercise</label>
                <input
                  type="text"
                  value={exercise.exercise}
                  onChange={(e) => handleFormChange(e, index, "exercise")}
                  required
                />
                <label>Weight</label>
                <input
                  type="number"
                  value={exercise.weight}
                  onChange={(e) => handleFormChange(e, index, "weight")}
                  required
                />
                <label>Reps</label>
                <input
                  type="number"
                  value={exercise.reps}
                  onChange={(e) => handleFormChange(e, index, "reps")}
                  required
                />
                <label>Sets</label>
                <input
                  type="number"
                  value={exercise.sets}
                  onChange={(e) => handleFormChange(e, index, "sets")}
                  required
                />
              </div>
            ))}
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditingWorkout(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;

import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null);
 
  const fetchStudents = async () => {
    try {
      const response = await axios.get(`https://localhost:5000/students`);
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };
 
  useEffect(() => {
    fetchStudents();
  }, []);
 
  const handleAddStudent = async (event) => {
    event.preventDefault();
 
    try {
      await axios.post(`https://localhost:5000/students`, {
        name,
        course,
        age: Number(age),
      });
 
      setName("");
      setCourse("");
      setAge("");
 
      fetchStudents();
    } catch (error) {
      console.error("Failed to add student:", error);
    }
  };
 
  const handleDeleteStudent = async (id) => {
    try {
      await axios.delete(`https://localhost:5000/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };
 
  const handleEditStudent = (student) => {
    setEditingId(student._id);
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
  };
 
  const handleUpdateStudent = async (event) => {
    event.preventDefault();
 
    try {
      await axios.put(`https://localhost:5000/students/${editingId}`, {
        name,
        course,
        age: Number(age),
      });
 
      setEditingId(null);
      setName("");
      setCourse("");
      setAge("");
 
      fetchStudents();
    } catch (error) {
      console.error("Failed to update student:", error);
    }
  };

 return (
    <main>
      <h1>Student Management System</h1>
      <p>Welcome to our MERN application.</p>
 
      <form onSubmit={editingId ? handleUpdateStudent : handleAddStudent}>
        <br />
        <h2>{editingId ? "Edit Student" : "Add Student"}</h2>
 
        <label htmlFor="name">Name: </label>
        <input type="text" id="name" value={name} onChange={(event) => setName(event.target.value)} required />
        <br />
 
        <label htmlFor="course">Course: </label>
        <input type="text" id="course" value={course} onChange={(event) => setCourse(event.target.value)} required />
        <br />
 
        <label htmlFor="age">Age: </label>
        <input type="number" id="age" value={age} onChange={(event) => setAge(event.target.value)} required />
        <br />
        
        <button type="submit">{editingId ? "Update Student" : "Add Student"}</button>
      </form>
 
      <section>
        <br />
        <hr />
        <h2>Students</h2>
 
        {students.length === 0 ? (
          <p>No students yet.</p>
        ) : (
          students.map((student) => (
            <div key={student._id}>
              <p>Name: {student.name}</p>
              <p>Course: {student.course}</p>
              <p>Age: {student.age}</p>
              <button type="button" onClick={() => handleEditStudent(student)}>Edit</button>
              <button button type="button" onClick={() => handleDeleteStudent(student._id)}>Delete</button>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
 
export default App;
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
 
const Student = require("./models/Student");
 
const app = express();
const PORT = 5000;
 
app.use(cors());
app.use(express.json());
 
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
 
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch students",
      error: error.message,
    });
  }
});
 
app.post("/students", async (req, res) => {
  try {
    const { name, course, age } = req.body;
 
    const student = new Student({ name, course, age });
 
    const savedStudent = await student.save();
 
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add student",
      error: error.message,
    });
  }
});
 
app.delete("/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
 
    if (!deletedStudent) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete student",
      error: error.message,
    });
  }
});
 
app.put("/students/:id", async (req, res) => {
  try {
    const { name, course, age } = req.body;
 
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name,
        course,
        age,
      },
    );
 
    if (!updatedStudent) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
 
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update student",
      error: error.message,
    });
  }
});
 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'students.json');

app.use(cors());
app.use(express.json());

// Helper function to read students data
async function readStudentsData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading students database file:', error);
    return [];
  }
}

// Helper function to write students data
async function writeStudentsData(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to students database file:', error);
    return false;
  }
}

// API endpoint to fetch all students
app.get('/api/students', async (req, res) => {
  const students = await readStudentsData();
  res.json(students);
});

// API endpoint to delete a student by hall ticket number
app.delete('/api/students/:htno', async (req, res) => {
  const { htno } = req.params;
  const students = await readStudentsData();
  
  const initialLength = students.length;
  const updatedStudents = students.filter(student => student.htno !== htno);

  if (updatedStudents.length === initialLength) {
    return res.status(404).json({ error: 'Student not found' });
  }

  // Renumber the sno (sno field) sequentially after deletion to keep it tidy
  const renumberedStudents = updatedStudents.map((student, index) => ({
    ...student,
    sno: index + 1
  }));

  const success = await writeStudentsData(renumberedStudents);
  
  if (success) {
    res.json({ success: true, message: `Student with HTNO ${htno} has been deleted successfully.` });
  } else {
    res.status(500).json({ error: 'Failed to write updated data to file' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
});

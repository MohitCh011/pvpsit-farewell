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
const MESSAGES_FILE = path.join(__dirname, 'messages.json');
const HIDDEN_MEDIA_FILE = path.join(__dirname, 'hidden_media.json');

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

// Helper function to read messages data
async function readMessagesData() {
  try {
    const data = await fs.readFile(MESSAGES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading messages database file:', error);
    return [];
  }
}

// Helper function to write messages data
async function writeMessagesData(data) {
  try {
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to messages database file:', error);
    return false;
  }
}

// Helper function to read hidden media
async function readHiddenMedia() {
  try {
    const data = await fs.readFile(HIDDEN_MEDIA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading hidden media file:', error);
    return [];
  }
}

// Helper function to write hidden media
async function writeHiddenMedia(data) {
  try {
    await fs.writeFile(HIDDEN_MEDIA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing hidden media file:', error);
    return false;
  }
}

// ────────────────────────────────────────────────────────────────
//  STUDENTS ENDPOINTS
// ────────────────────────────────────────────────────────────────

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

// ────────────────────────────────────────────────────────────────
//  MESSAGES ENDPOINTS
// ────────────────────────────────────────────────────────────────

// API endpoint to fetch all yearbook messages
app.get('/api/messages', async (req, res) => {
  const messages = await readMessagesData();
  res.json(messages);
});

// API endpoint to post a new yearbook message
app.post('/api/messages', async (req, res) => {
  const { name, message, theme } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  const messages = await readMessagesData();
  const newMessage = {
    id: Date.now().toString(),
    name: name.trim(),
    message: message.trim(),
    theme: theme || 'purple',
    timestamp: Date.now()
  };

  messages.unshift(newMessage); // Newest messages at the top
  const success = await writeMessagesData(messages);

  if (success) {
    res.status(201).json(newMessage);
  } else {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// API endpoint to delete a message by ID
app.delete('/api/messages/:id', async (req, res) => {
  const { id } = req.params;
  const messages = await readMessagesData();
  const filtered = messages.filter(msg => msg.id !== id);

  if (messages.length === filtered.length) {
    return res.status(404).json({ error: 'Message not found' });
  }

  const success = await writeMessagesData(filtered);
  if (success) {
    res.json({ success: true, message: 'Message deleted successfully.' });
  } else {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// ────────────────────────────────────────────────────────────────
//  HIDDEN MEDIA ENDPOINTS
// ────────────────────────────────────────────────────────────────

// API endpoint to fetch all hidden media paths
app.get('/api/hidden-media', async (req, res) => {
  const list = await readHiddenMedia();
  res.json(list);
});

// API endpoint to add a path to hidden media
app.post('/api/hidden-media', async (req, res) => {
  const { src } = req.body;
  if (!src) {
    return res.status(400).json({ error: 'src path is required' });
  }

  const list = await readHiddenMedia();
  if (!list.includes(src)) {
    list.push(src);
    const success = await writeHiddenMedia(list);
    if (!success) {
      return res.status(500).json({ error: 'Failed to save hidden media list' });
    }
  }

  res.status(201).json({ success: true, list });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
});

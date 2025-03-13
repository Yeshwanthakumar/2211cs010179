
// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Blog = mongoose.model('Blog', BlogSchema);

// Create
app.post('/api/blogs', async (req, res) => {
  const blog = new Blog(req.body);
  await blog.save();
  res.status(201).send(blog);
});

// Read
app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.find();
  res.send(blogs);
});

// Update
app.put('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(blog);
});

// Delete
app.delete('/api/blogs/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.listen(5000, () => console.log('Server running on port 5000'));

// client/App.js
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const response = await axios.get('http://localhost:5000/api/blogs');
    setBlogs(response.data);
  };

  const createBlog = async () => {
    await axios.post('http://localhost:5000/api/blogs', { title, content });
    fetchBlogs();
    setTitle('');
    setContent('');
  };

  const updateBlog = async (id, newTitle, newContent) => {
    await axios http://localhost:5000/api/blogs/${id}, { title: newTitle, content: newContent });
    fetchBlogs();
  };

  const deleteBlog = async (id) => {
    await axios.delete http://localhost:5000/api/blogs/${id});
    fetchBlogs();
  };

  return (
    <div>
      <h1>Blog Platform</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
      <button onClick={createBlog}>Create</button>
      <ul>
        {blogs.map(blog => (
          <li key={blog._id}>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
            <button onClick={() => updateBlog(blog._id, title, content)}>Update</button>
            <button onClick={() => deleteBlog(blog._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
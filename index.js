const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const MenuItem = require('./menuItem');
const dotenv = require('dotenv');



const app = express();
const port = 3010;

app.use(bodyParser.json());
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Database'))
  .catch((err) => console.log('Failed to connect to MongoDB Database:', err));

app.post('/menu', async (req, res) => {
  const { name, description, price } = req.body;

  try {
    const newMenuItem = new MenuItem({ name, description, price });

    await newMenuItem.save();

    res.status(201).json({ message: 'Menu item added successfully', item: newMenuItem });
  } catch (error) {
    res.status(400).json({ message: 'Error adding menu item', error: error.message });
  }
});

app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving menu items', error: error.message });
  }
});

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

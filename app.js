const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

mongoose.connect(process.env.DB_URL).then(() => {
    app.listen(process.env.port, () => {
        console.log(`Server running on the port ${process.env.port}`)
    })
    console.log('MongoDb Connected!')
})
    .catch((err) => console.log(err))


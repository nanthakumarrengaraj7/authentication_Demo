const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const { name, mail, password } = req.body;

        const existingUser = await userModel.findOne({ mail });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists!' })
        }

        const hasedPossword = await bcrypt.hash(password, 10);

        const newUser = new userModel({ name, mail, password: hasedPossword })

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!' })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { mail, password } = req.body;

        const user = await userModel.findOne({ mail });
        if (!user) {
            res.status(400).json({ message: 'User Not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.status(200).json({ message: 'Login Successful', token })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


exports.getAllUsers = async (req, res) => {
    const users = await userModel.find();
    if (users.length === 0) {
        return res.status(400).json({ message: 'No one user in your database!' })
    }
    res.status(200).json(users);
}
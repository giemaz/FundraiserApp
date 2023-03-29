// server/utils/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateJWT } = require('./middleware');
const connection = require('../db');
const router = express.Router();

const SALT_ROUNDS = 10;
const JWT_SECRET = 'your-jwt-secret';

// POST /register
router.post('/register', (req, res) => {
	const { email, username, password } = req.body;
	if (!email || !username || !password) {
		res.status(400).send('Invalid request');
		return;
	}

	connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
		if (err) {
			console.error(err);
			res.status(500).send('Server error');
			return;
		}

		if (results.length > 0) {
			res.status(409).send('Email already exists');
			return;
		}

		// Hash password and create new user
		bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
			if (err) {
				console.error(err);
				res.status(500).send('Server error');
				return;
			}

			const newUser = { email, username, password: hash };
			connection.query('INSERT INTO users SET ?', newUser, (err, results) => {
				if (err) {
					console.error(err);
					res.status(500).send('Server error');
					return;
				}

				res.status(201).send('User created successfully');
			});
		});
	});
});

// POST /login
router.post('/login', (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(400).send('Invalid request');
		return;
	}

	connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
		if (err) {
			console.error(err);
			res.status(500).send('Server error');
			return;
		}

		if (results.length === 0) {
			res.status(401).send('Invalid email or password');
			return;
		}

		const user = results[0];
		bcrypt.compare(password, user.password, (err, result) => {
			if (err) {
				console.error(err);
				res.status(500).send('Server error');
				return;
			}

			if (!result) {
				res.status(401).send('Invalid email or password');
				return;
			}

			const token = jwt.sign(
				{ userId: user.id, email: user.email, username: user.username, user_type: user.user_type },
				JWT_SECRET,
				{
					expiresIn: '1h',
				}
			);

			res.status(200).send({ token });
		});
	});
});

// POST /logout
router.post('/logout', authenticateJWT, (req, res) => {
	res.status(200).send('Logged out successfully');
});

module.exports = { router };

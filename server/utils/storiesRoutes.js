// server/utils/storiesRoutes.js
const express = require('express');
const connection = require('../db');
const { v4: uuidv4 } = require('uuid');
const { upload } = require('./multerConfig');
const { authenticateJWT } = require('./middleware');
const fs = require('fs');
const router = express.Router();

module.exports = (authenticateJWT) => {
	// GET /stories
	router.get('/stories', (req, res) => {
		connection.query('SELECT * FROM stories WHERE is_approved = TRUE', (err, results) => {
			if (err) {
				console.error(err);
				res.status(500).send('Server error');
				return;
			}

			res.send(results);
		});
	});

	// POST /stories
	router.post('/stories', authenticateJWT, upload.single('storyImage'), (req, res) => {
		const { title, description, goal_amount } = req.body;
		const user_id = req.user.userId;
		if (!title || !description || !goal_amount || !user_id) {
			res.status(400).send('Invalid request');
			return;
		}

		const image_url = req.file ? req.file.path.replace(/\\/g, '/') : null;
		const newStory = {
			user_id,
			title,
			description,
			image_url,
			goal_amount,
			current_amount: 0,
			status: 'in_progress',
			is_approved: false,
		};

		connection.query('INSERT INTO stories SET ?', newStory, (err, results) => {
			if (err) {
				console.error(err);
				res.status(500).send('Server error');
				return;
			}

			newStory.id = results.insertId;
			res.status(201).send(newStory);
		});
	});

	// PUT /stories/:id
	router.put('/stories/:id', upload.single('storyImage'), (req, res) => {
		const id = req.params.id;
		const { title, description, goal_amount } = req.body;

		connection.query('SELECT * FROM stories WHERE id = ?', [id], (err, results) => {
			if (err) {
				console.error(err);
				res.status(500).send('Server error');
				return;
			}

			if (results.length === 0) {
				res.status(404).send('Story not found');
				return;
			}

			const story = results[0];
			const oldImage = story.image_url;
			const newImage = req.file ? req.file.path.replace(/\\/g, '/') : oldImage;

			connection.query(
				'UPDATE stories SET title = ?, description = ?, goal_amount = ?, image_url = ? WHERE id = ?',
				[title, description, isNaN(goal_amount) ? story.goal_amount : goal_amount, newImage, id],
				(err, results) => {
					if (err) {
						console.error(err);
						res.status(500).send('Server error');
						return;
					}

					if (results.affectedRows === 0) {
						res.status(404).send('Story not found');
						return;
					}

					if (newImage !== oldImage && oldImage) {
						fs.unlink(oldImage, (err) => {
							if (err) console.error(err);
						});
					}

					const updatedStory = {
						id,
						title,
						description,
						goal_amount: parseFloat(goal_amount),
						image_url: newImage,
					};
					res.send(updatedStory);
				}
			);
		});
	});

	// DELETE /stories/:id
	router.delete('/stories/:id', authenticateJWT, (req, res) => {
		const storyId = req.params.id;

		connection.query('SELECT * FROM stories WHERE id = ?', [storyId], (err, results) => {
			if (err) {
				console.error(err);
				res.status(500).send('Server error');
				return;
			}

			if (results.length === 0) {
				res.status(404).send('Story not found');
				return;
			}

			connection.query('DELETE FROM donations WHERE story_id = ?', [storyId], (err, results) => {
				if (err) {
					console.error(err);
					res.status(500).send('Server error');
					return;
				}

				const storyToDelete = results[0];
				const imageToDelete = storyToDelete.image_url;

				connection.query('DELETE FROM stories WHERE id = ?', [storyId], (err, results) => {
					if (err) {
						console.error(err);
						res.status(500).send('Server error');
						return;
					}

					if (imageToDelete) {
						fs.unlink(imageToDelete, (err) => {
							if (err) console.error(err);
						});
					}

					res.status(200).send('Story and associated donations deleted successfully');
				});
			});
		});
	});

	// PUT /stories/:id/block
	router.put('/stories/:id/block', authenticateJWT, (req, res) => {
		const accountId = req.params.id;

		connection.query('SELECT * FROM stories WHERE id = ?', [accountId], (err, results) => {
			if (err) {
				console.error(err);
				res.status(500).send('Server error');
				return;
			}

			if (results.length === 0) {
				res.status(404).send('Account not found');
				return;
			}

			const account = results[0];

			connection.query(
				'UPDATE stories SET blocked = ? WHERE id = ?',
				[!account.blocked, accountId],
				(err, results) => {
					if (err) {
						console.error(err);
						res.status(500).send('Server error');
						return;
					}

					res.status(200).send(`Account ${!account.blocked ? 'blocked' : 'unblocked'} successfully`);
				}
			);
		});
	});

	return router;
};

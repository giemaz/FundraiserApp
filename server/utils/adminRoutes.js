// server\utils\adminRoutes.js
const express = require('express');
const { authenticateJWT } = require('./middleware');
const connection = require('../db');
const router = express.Router();
const fs = require('fs');

module.exports = (authenticateJWT) => {
	//GET
	router.get('/stories', authenticateJWT, (req, res) => {
		if (req.user.user_type !== 'admin') {
			res.status(403).json({ message: 'Forbidden' });
			return;
		}

		connection.query('SELECT * FROM stories', (err, results) => {
			if (err) {
				console.error(err);
				res.status(500).json({ message: 'Server error' });
				return;
			}

			res.send(results);
		});
	});

	//PUT
	router.put('/stories/:id/approve', authenticateJWT, (req, res) => {
		const storyId = req.params.id;
		const { is_approved } = req.body;

		if (req.user.user_type !== 'admin') {
			res.status(404).json({ message: 'Forbidden' });

			return;
		}

		connection.query('UPDATE stories SET is_approved = ? WHERE id = ?', [is_approved, storyId], (err, results) => {
			if (err) {
				console.error(err);
				res.status(500).json({ message: 'Server error' });

				return;
			}

			if (results.affectedRows === 0) {
				res.status(404).json({ message: 'Story not found' });
				return;
			}
			res.status(200).json({ message: `Story approval status updated to ${is_approved}` });
		});
	});

	// DELETE /stories/:id
	router.delete('/stories/:id', authenticateJWT, (req, res) => {
		const storyId = req.params.id;
		if (req.user.user_type !== 'admin') {
			res.status(403).json({ message: 'Forbidden' });
			return;
		}

		connection.query('SELECT * FROM stories WHERE id = ?', [storyId], (err, results) => {
			if (err) {
				console.error(err);
				res.status(500).json({ message: 'Server Error' });
				return;
			}

			if (results.length === 0) {
				res.status(404).json({ message: 'Story not found' });
				return;
			}

			const storyToDelete = results[0];
			const imageToDelete = storyToDelete.image_url;

			connection.query('DELETE FROM donations WHERE story_id = ?', [storyId], (err, results) => {
				if (err) {
					console.error(err);
					res.status(500).json({ message: 'Server error' });
					return;
				}

				connection.query('DELETE FROM stories WHERE id = ?', [storyId], (err, results) => {
					if (err) {
						console.error(err);
						res.status(500).json({ message: 'Server error' });
						return;
					}

					if (imageToDelete) {
						fs.unlink(imageToDelete, (err) => {
							if (err) console.error(err);
						});
					}
					res.status(200).json({ message: 'Story and associated donations deleted successfully' });
				});
			});
		});
	});

	return router;
};

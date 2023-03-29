const express = require('express');
const { authenticateJWT } = require('./middleware');
const connection = require('../db');
const router = express.Router();

module.exports = (authenticateJWT) => {
	//GET
	router.get('/stories/unapproved', authenticateJWT, (req, res) => {
		if (req.user.user_type !== 'admin') {
			res.status(403).send('Forbidden');
			return;
		}

		connection.query('SELECT * FROM stories WHERE is_approved = FALSE', (err, results) => {
			if (err) {
				console.error(err);
				res.status(500).send('Server error');
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
			res.status(403).send('Forbidden');
			return;
		}

		connection.query('UPDATE stories SET is_approved = ? WHERE id = ?', [is_approved, storyId], (err, results) => {
			if (err) {
				console.error(err);
				res.status(500).send('Server error');
				return;
			}

			if (results.affectedRows === 0) {
				res.status(404).send('Story not found');
				return;
			}

			res.status(200).send(`Story approval status updated to ${is_approved}`);
		});
	});

	return router;
};

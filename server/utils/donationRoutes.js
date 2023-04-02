// server\utils\donationRoutes.js
const express = require('express');
const connection = require('../db');
const router = express.Router();

//GET
router.get('/stories/:story_id/donations', (req, res) => {
	const { story_id } = req.params;

	connection.query('SELECT * FROM donations WHERE story_id = ?', [story_id], (err, results) => {
		if (err) {
			console.error(err);
			res.status(500).json({ message: 'Server error' });
			return;
		}

		res.send(results);
	});
});

// POST
router.post('/stories/:story_id/donations', (req, res) => {
	const { story_id } = req.params;
	const { donor_name } = req.body;
	const donation_amount = parseFloat(req.body.donation_amount);

	if (!donor_name || !donation_amount) {
		res.status(400).json({ message: 'Invalid request' });
		return;
	}

	const newDonation = { story_id, donor_name, donation_amount };
	connection.query('INSERT INTO donations SET ?', newDonation, (err, results) => {
		if (err) {
			console.error(err);
			res.status(500).json({ message: 'Server error!' });
			return;
		}

		connection.query(
			'UPDATE stories SET current_amount = current_amount + ? WHERE id = ?',
			[donation_amount, story_id],
			(err, updateResults) => {
				if (err) {
					console.error(err);
					res.status(500).json({ message: 'Server error!' });
					return;
				}

				newDonation.id = results.insertId;
				res.status(201).send(newDonation);
			}
		);
	});
});

module.exports = { router };

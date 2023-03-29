// server\app.js
const express = require('express');
const cors = require('cors');
const { authenticateJWT } = require('./utils/middleware');
const app = express();
const path = require('path');

app.use(cors());
app.use(express.json());
const port = 3003;

const { router: authRoutes } = require('./utils/authRoutes');
const storiesRoutes = require('./utils/storiesRoutes')(authenticateJWT);
const adminRoutes = require('./utils/adminRoutes')(authenticateJWT);
const { router: donationRoutes } = require('./utils/donationRoutes');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(authRoutes);
app.use(storiesRoutes);
app.use(donationRoutes);

app.listen(port, () => {
	console.log(`LN is on port number: ${port}`);
});

module.exports = { authenticateJWT };

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const sparqlRoutes = require('./routes/sparql');
const publisherRoutes = require('./routes/publisher');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(morgan('combined'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/sparql', sparqlRoutes);
app.use('/api/publish', publisherRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

app.listen(PORT, () => {
  console.log(`CampusCrib SPARQL Proxy Server running on port ${PORT}`);
  console.log(`CampusCrib RDF server on http://localhost:${PORT}/api/publish`);
  console.log(`→ Todos os cribs:  http://localhost:${PORT}/api/publish/data/cribs`);
  console.log(`→ Crib por id:     http://localhost:${PORT}/api/publish/data/cribs/1`);
});

module.exports = app;

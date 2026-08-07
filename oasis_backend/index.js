const express = require('express');
const cors = require('cors');
require('dotenv').config();

const assetsRoutes = require('./routes/assets.routes');
const telemetryRoutes = require('./routes/telemetry.routes');
const alertsRoutes = require('./routes/alerts.routes');
const sitesRoutes = require('./routes/sites.routes');
const maintenanceRoutes = require('./routes/maintenance.routes');
const financeRoutes = require('./routes/finance.routes');
const productionRoutes = require('./routes/production.routes');
const incidentsRoutes = require('./routes/incidents.routes');
const plansRoutes = require('./routes/plans.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the OASIS backend API' });
});

// Feature routes
app.use('/api/assets', assetsRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/sites', sitesRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/incidents', incidentsRoutes);
app.use('/api/plans', plansRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

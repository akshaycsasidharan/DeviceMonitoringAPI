import express from 'express';
import productRoute from './routes/product.route.js';
import { connectToMongoDB } from './connection/connection.js';
import authRoutes from './routes/auth.js';
import dotenv from 'dotenv';
import helmet from 'helmet';

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectToMongoDB()
  .then(() => {
    console.log('Successfully connected to the database');

    app.use('/api/auth', authRoutes);
    app.use('/api', productRoute);

    app.use((req, res, next) => {
      const error = new Error('Not Found');
      error.status = 404;
      next(error);
    });

    app.use((err, req, res, next) => {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      res.status(err.status || 500);
      res.json({ error: err.message });
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

export default app;

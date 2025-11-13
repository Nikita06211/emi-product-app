import dotenv from 'dotenv';
import { AppDataSource } from './config/data-source';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 4000;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Data Source initialization error:', err));

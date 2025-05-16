import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes.js'; // Import the auth routes 
import adminRoutes from './src/routes/adminRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import cors from 'cors';

dotenv.config({ path: './server/.env' });

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

// Mount the authentication routes under the /api/auth path
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
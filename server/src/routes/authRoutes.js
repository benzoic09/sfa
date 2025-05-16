import express from 'express';
import { login, register } from '../controllers/authController.js';
import { body } from 'express-validator'; 

const router = express.Router();

// Define the /api/auth/login route and associate it with the login controller function
router.post('/login', login);

// Define the /api/auth/register route with validation
router.post(
    '/register',
    [
      body('username').notEmpty().withMessage('Username is required').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
      body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
      body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
      //body('role_id').notEmpty().withMessage('Role ID is required').isInt().withMessage('Role ID must be an integer'),
      //body('branch_id').notEmpty().withMessage('Branch ID is required').isInt().withMessage('Branch ID must be an integer'),
    ],
    register
  );


  // Route to get all customers 
// router.get(
//   "/clients",
//   authenticateToken,
//   authorizeRole(["Administrator"]),
//   getSupervisors
// );

export default router;
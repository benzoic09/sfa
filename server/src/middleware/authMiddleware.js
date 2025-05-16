import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { connectionToDatabase } from '../config/database.js';

dotenv.config();

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  //console.log("token :", token); 

  if (token == null) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  //console.log("token :", token);
  //console.log("jwt :", process.env.JWT_KEY);

  jwt.verify(token, process.env.JWT_KEY, async (err, userPayload) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden - Invalid token' });
    }

    try {
      const connection = await connectionToDatabase();
      const [users] = await connection.execute(
        'SELECT id, username, role_id FROM users WHERE id = ?', // Fetch user details, including role_id
        [userPayload.id] // Assuming you stored userId in the token during login
      );

      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found for this token' });
      }

      req.user = {
        id: users[0].id,
        username: users[0].username,
        role: await getRoleName(users[0].role_id, connection), // Fetch role name
      };

      next(); // Proceed to the next middleware or route handler

    } catch (error) {
      console.error('Error fetching user from token:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
};

// Helper function to get role name from role_id
async function getRoleName(roleId, connection) {
  if (!roleId || !connection) {
    return null;
  }
  try {
    const [roles] = await connection.execute(
      'SELECT name FROM roles WHERE id = ?',
      [roleId]
    );
    return roles.length > 0 ? roles[0].name : null;
  } catch (error) {
    console.error('Error fetching role name:', error);
    return null;
  }
}

export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Unauthorized - User role not available' });
    }
    if (roles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({ message: 'Forbidden - Insufficient privileges' });
    }
  };
};
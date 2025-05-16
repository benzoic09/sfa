import { connectionToDatabase } from '../config/database.js'; 

const preventAdminEdit = async (req, res, next) => {
  try {
    const roleId = req.params.id;
    const connection = await connectionToDatabase();
    const [roles] = await connection.execute(
      'SELECT name FROM roles WHERE id = ?',
      [roleId]
    );

    if (roles.length > 0 && roles[0].name === 'Administrator') {
      return res.status(403).json({ message: 'The Administrator role cannot be edited.' });
    }

    next();
  } catch (error) {
    console.error('Error checking admin role:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export default preventAdminEdit;
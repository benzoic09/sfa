import { connectionToDatabase } from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { v4 as uuidv4 } from 'uuid';

export const login = async (req, res) => {
  try {
    //console.log("Backend received login request with body:", req.body); // Log the request body

    const connection = await connectionToDatabase();
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both username and password" });
    }

    // Query the database to find the user by username
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [username]
    );

    //console.log("SQL Query Results (rows):", rows); // Log the results of the SQL query

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    //console.log("Plain text password from request:", password);
    //console.log("Hashed password from database:", user.password);

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role_id: user.role_id,
        branch_id: user.branch_id,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" } // You can adjust the expiration time as needed
    );

    //console.log(token, user.username, user.role_id);

    res.status(200).json({ token, username: user.username, roleId: user.role_id  });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req, res) => {
  try {
    const connection = await connectionToDatabase();
    //const { username, email, password, role_id, branch_id } = req.body;
    const { username, email, password } = req.body; //Removed role_id and branch_id for now

    // Check for validation errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if username or email is already taken
    const [existingUsers] = await connection.execute(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ message: "Username or email is already taken" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Get the default role_id.  You might want to make this configurable.
    const [defaultRole] = await connection.execute(
      "SELECT id FROM roles WHERE name = 'user' LIMIT 1"
    );
    const role_id = defaultRole[0]?.id; // Use optional chaining in case default role doesn't exist

    // Get the first branch_id.  You might want to make this configurable.
    const [defaultBranch] = await connection.execute(
      "SELECT id FROM branches LIMIT 1"
    );
    const branch_id = defaultBranch[0]?.id; // Use optional chaining

    // Insert the new user into the database
    const [result] = await connection.execute(
      "INSERT INTO users (username, email, password, role_id, branch_id) VALUES (?, ?, ?, ?, ?)", // Added role_id and branch_id
      [username, email, hashedPassword, 1, 1]
    );

    //res.status(201).json({ token, message: 'User registered successfully' });
    res.status(201).json({ message: "User registered successfully" }); //Simplifed the response
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error 1 " });
  }
};


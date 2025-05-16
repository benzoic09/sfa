import { connectionToDatabase } from "../config/database.js";

export const getOrganizations = async (req, res) => {
  try {
    const connection = await connectionToDatabase();
    const [rows] = await connection.execute("SELECT * FROM organisation");

    if (rows.length === 0) {
      return res.status(404).json({ message: "Organizations not found" });
    }

    res.status(200).json({ rows });
  } catch (error) {
    console.error("Organization:", error);
    res.status(500).json({ message: "Internal server error" });  }
};

export const createOrganization = async (req, res) => {
  const connection = await connectionToDatabase();
  const { name, code, country, status, description } = req.body;

  if (!name || !code || !country) {
    return res
      .status(400)
      .json({ error: "Name, code, and country are required" });
  }

  //check if the organisation exists
  const [existingOrg] = await connection.execute(
    "SELECT * FROM organisation WHERE name = ?",
    [name]
  );

  if (existingOrg.length > 0) {
    return res
      .status(409)
      .json({ message: "Organisation name already exists" });
  }

  const [result] = await connection.execute(
    "INSERT INTO organisation (code, name, country, description, status) VALUES (?, ?, ?, ?, ?)", // Include description and status in the insert
    [code, name, country, description, status]
  );

  // Fetch the newly created organisation to send back in the response (optional but good practice)
  const [newlyCreatedOrg] = await connection.execute(
    "SELECT code, name, country, description, status FROM organisation WHERE id = ?",
    [result.insertId]
  );

  res
    .status(201)
    .json({
      message: "Organisation created successfully",
      organisation: newlyCreatedOrg[0],
    }); // Send back the full organisation data
};



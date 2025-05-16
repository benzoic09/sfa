import { connectionToDatabase } from "../config/database.js";

export const getCountries = async (req, res) => {
  const connection = await connectionToDatabase();

  const [rows] = await connection.execute("SELECT id, name FROM country");
  

  if (rows.length === 0) {
    return res.status(404).json({ message: "Countries not found" });
  }

  res.status(200).json({ country: rows });
};

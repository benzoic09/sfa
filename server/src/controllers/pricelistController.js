import { connectionToDatabase } from "../config/database.js";

export const getPricelistname = async (req, res) => {
    const connection = await connectionToDatabase();
  
    const [rows] = await connection.execute("SELECT id, name, description, is_default, status  FROM pricelist");
  
    if (rows.length === 0) {
      return res.status(404).json({ message: "Price lists not found" });
    }
  
    res.status(200).json({pricelistname: rows });
  };
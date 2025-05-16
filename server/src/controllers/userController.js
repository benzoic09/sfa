import { connectionToDatabase } from "../config/database.js";

export const getRoleNameById = async (req, res) => {
  try {
    const connection = await connectionToDatabase();
    const { roleId } = req.params;
    
    if (!roleId) {
      return res.status(400).json({ message: "Role ID is required" });
    }

    const [roles] = await connection.execute( "SELECT description FROM roles WHERE id = ?", [roleId] );

    console.log("roles : " [roles]);

    if (roles.length === 0) {
      return res.status(404).json({ message: "Role not found" });
    }    

    res.status(200).json({ roleName: roles[0].description });


  } catch (error) {
    console.error("Error fetching role name:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


import { connectionToDatabase } from "../config/database.js";

export const createBranch = async (req, res) => {
  const connection = await connectionToDatabase();
  const { code, name, company, country, status } = req.body;

  if (!name || !code || !country || !company) {
    return res
      .status(400)
      .json({ error: "Name, code, company, and country are required" });
  }

  //check if the organisation exists
  const [existingBranch] = await connection.execute(
    "SELECT * FROM branches WHERE name = ?",
    [name]
  );

  if (existingBranch.length > 0) {
    return res.status(409).json({ message: "Branch name already exists" });
  }

  const [result] = await connection.execute(
    "INSERT INTO branches (code, name, company, country, status) VALUES (?, ?, ?, ?, ?)", // Include description and status in the insert
    [code, name, company, country, status]
  );

  // Fetch the newly created organisation to send back in the response (optional but good practice)
  const [newlyCreatedBranch] = await connection.execute(
    "SELECT code, name, company, country, status FROM branches WHERE id = ?",
    [result.insertId]
  );

  res.status(201).json({
    message: "Branch created successfully",
    branch: newlyCreatedBranch[0],
  }); // Send back the full branch data
};

export const getBranch = async (req, res) => {
  const connection = await connectionToDatabase();

  const [rows] = await connection.execute(
    "SELECT id, code, name, company, country, status, created_at  FROM branches"
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Branches not found" });
  }

  res.status(200).json({ branch: rows });
};

export const updateBranch = async (req, res) => {
  const branchId = req.params.id;
  const { name, code, country, status, company } = req.body;

  try {
    const connection = await connectionToDatabase();

    // Check if the organization exists
    const [existingBranch] = await connection.execute(
      "SELECT * FROM branches WHERE id = ?",
      [branchId]
    );

    if (existingBranch.length === 0) {
      return res.status(404).json({ message: "Branch not found" });
    }

    //check if code already exists and is not the same as the organization to be updated
    const [existingCodeBrch] = await connection.execute(
      "SELECT * FROM branches WHERE code = ? AND id != ?",
      [code, branchId]
    );
    if (existingCodeBrch.length > 0) {
      return res.status(409).json({ message: "Branch code already exists" });
    }

    const [result] = await connection.execute(
      "UPDATE branches SET name = ?, code = ?, country = ?, status = ?, company = ? WHERE id = ?",
      [name, code, country, status, company, branchId]
    );

    if (result.affectedRows > 0) {
      const [updatedBranch] = await connection.execute(
        "SELECT id, code, name, company, country, status, created_at FROM branches WHERE id = ?",
        [branchId]
      );
      return res.status(200).json({
        message: "Branch updated successfully",
        branch: updatedBranch[0],
      });
    } else {
      return res
        .status(200)
        .json({ message: "No changes were applied to the branch" });
    }
  } catch (error) {
    console.error("Error updating branch:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

import { connectionToDatabase } from "../config/database.js";
import bcrypt from "bcrypt";

export const createRole = async (req, res) => {
  try {
    const connection = await connectionToDatabase();
    const { name, description, status } = req.body; // Extract description and status

    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    // Check if the role name already exists (optional)
    const [existingRole] = await connection.execute(
      "SELECT * FROM roles WHERE name = ?",
      [name]
    );

    if (existingRole.length > 0) {
      return res.status(409).json({ message: "Role name already exists" });
    }

    const [result] = await connection.execute(
      "INSERT INTO roles (name, description, status) VALUES (?, ?, ?)", // Include description and status in the insert
      [name, description, status]
    );

    // Fetch the newly created role to send back in the response (optional but good practice)
    const [newlyCreatedRole] = await connection.execute(
      "SELECT id, name, description, status FROM roles WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      message: "Role created successfully",
      role: newlyCreatedRole[0],
    }); // Send back the full role data
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const connection = await connectionToDatabase();
    const [rows] = await connection.execute(
      "SELECT id, name, description, status FROM roles"
    );
    res.status(200).json({ userrole: rows });
  } catch (error) {
    console.error("Error fetching all roles:", error);
    res.status(500).json({ message: "Failed to fetch roles" });
  }
};

export const updateRole = async (req, res) => {
  const roleId = req.params.id;
  const { name, description, status } = req.body;

  try {
    const connection = await connectionToDatabase();

    // Check if the role exists
    const [existingRole] = await connection.execute(
      "SELECT * FROM roles WHERE id = ?",
      [roleId]
    );

    if (existingRole.length === 0) {
      return res.status(404).json({ message: "Role not found." });
    }

    const [result] = await connection.execute(
      "UPDATE roles SET name = ?, description = ?, status = ? WHERE id = ?",
      [name, description, status, roleId]
    );

    if (result.affectedRows > 0) {
      // Fetch the updated role to send back
      const [updatedRole] = await connection.execute(
        "SELECT id, name, description, status FROM roles WHERE id = ?",
        [roleId]
      );
      if (updatedRole.length > 0) {
        return res.json({
          message: "Role updated successfully!",
          role: updatedRole[0],
        });
      } else {
        return res.status(200).json({ message: "Role updated successfully!" }); // Should ideally fetch the updated role
      }
    } else {
      return res
        .status(200)
        .json({ message: "No changes were applied to the role." }); // If no rows were affected
    }
  } catch (error) {
    console.error("Error updating role:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrganization = async (req, res) => {
  const organizationId = req.params.id;
  const { name, code, country, status, description } = req.body;

  try {
    const connection = await connectionToDatabase();

    // Check if the organization exists
    const [existingOrganization] = await connection.execute(
      "SELECT * FROM organisation WHERE id = ?",
      [organizationId]
    );

    if (existingOrganization.length === 0) {
      return res.status(404).json({ message: "Organization not found" });
    }

    //check if code already exists and is not the same as the organization to be updated
    const [existingCodeOrg] = await connection.execute(
      "SELECT * FROM organisation WHERE code = ? AND id != ?",
      [code, organizationId]
    );
    if (existingCodeOrg.length > 0) {
      return res
        .status(409)
        .json({ message: "Organization code already exists" });
    }

    const [result] = await connection.execute(
      "UPDATE organisation SET name = ?, code = ?, country = ?, status = ?, description = ? WHERE id = ?",
      [name, code, country, status, description, organizationId]
    );

    if (result.affectedRows > 0) {
      const [updatedOrganization] = await connection.execute(
        "SELECT id, code, name, description, country, status, created_at FROM organisation WHERE id = ?",
        [organizationId]
      );
      return res.status(200).json({
        message: "Organization updated successfully",
        organization: updatedOrganization[0],
      });
    } else {
      return res
        .status(200)
        .json({ message: "No changes were applied to the organization" });
    }
  } catch (error) {
    console.error("Error updating organization:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const connection = await connectionToDatabase();
    const [rows] = await connection.execute(
      "SELECT u.id, u.fullname, u.email, u.mobile, u.status, u.created_at, b.name AS branch, c.name AS country, uc.name AS usercategory, ch.name AS channel, ug.name AS usergroup, r.name AS userrole, s.fullname AS supervisor, p.name AS pricelistname FROM users u LEFT JOIN branches b ON u.branch_id = b.id LEFT JOIN country c ON u.country_id = c.id LEFT JOIN usercategory uc ON u.usercategory_id = uc.id LEFT JOIN channel ch ON u.channel_id = ch.id LEFT JOIN usergroups ug ON u.usergroup_id = ug.id LEFT JOIN roles r ON u.role_id = r.id LEFT JOIN users s ON u.supervisor_id = s.id LEFT JOIN pricelist p ON u.pricelist_id = p.id"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const createUser = async (req, res) => {
 
  try {
    const connection = await connectionToDatabase();
    const {
      branch_id,
      user_role_id,
      username,
      email,
      password,
      mobile,
      fullname,
      country_id,     
      user_category_id,
      channel_id,
      user_group_id,
      supervisor_id,
      pricelist_id,
      status,
    } = req.body; 

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!username) {
      return res.status(400).json({ message: "User Name is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!fullname) {
      return res.status(400).json({ message: "Full Name is required" });
    }

    // Check if the user email already exists (optional)
    const [existingUser] = await connection.execute(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //handle nulls
    const cleanedSupervisorId = supervisor_id && supervisor_id !== '' ? supervisor_id : 0;
    const cleaneduser_category_id = user_category_id && user_category_id !== '' ? user_category_id : 0;
    const cleanedchannel_id = channel_id && channel_id !== '' ? channel_id : 0;
    const cleaneduser_group_id = user_group_id && user_group_id !== '' ? user_group_id : 0;
    const cleanedpricelist_id = pricelist_id && pricelist_id !== '' ? pricelist_id : 0;
    const cleaneduser_role_id = user_role_id && user_role_id !== '' ? user_role_id : 0;
    const cleanedbranch_id = branch_id && branch_id !== '' ? branch_id : 0;



    const [result] = await connection.execute(
      "INSERT INTO users (branch_id, role_id, username, email, password, mobile, fullname, country_id, usercategory_id, channel_id, usergroup_id, supervisor_id, pricelist_id, status) VALUES (?, ?, ?,?, ?, ?,?, ?, ?,?,  ?,?, ?, ?)",
      [
        cleanedbranch_id,
        cleaneduser_role_id,
        username,
        email,
        hashedPassword,
        mobile,
        fullname,
        country_id,
        cleaneduser_category_id,
        cleanedchannel_id,
        cleaneduser_group_id,
        cleanedSupervisorId,
        cleanedpricelist_id,
        status,
      ]
    );

    // Fetch the newly created role to send back in the response (optional but good practice)
    const [newlyCreatedUser] = await connection.execute(
      "SELECT id, username, email, status FROM users WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      message: "User created successfully",
      role: newlyCreatedUser[0],
    }); // Send back the full role data
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

import { connectionToDatabase } from "../config/database.js";

export const createUserGroup = async (req, res) => {
  const connection = await connectionToDatabase();
  const {name, description, target_value, callage_target, status } = req.body;

  if (!name ) {
    return res
      .status(400)
      .json({ error: "User Group Name is required" });
  }

  //check if the organisation exists
  const [existingUserGroup] = await connection.execute(
    "SELECT * FROM usergroups WHERE name = ?",
    [name]
  );

  if (existingUserGroup.length > 0) {
    return res.status(409).json({ message: "User Group name already exists" });
  }

  const [result] = await connection.execute(
    "INSERT INTO usergroups (name, description, target_value, callage_target, status) VALUES (?, ?, ?, ?, ?)", // Include description and status in the insert
    [name, description, target_value, callage_target, status]
  );

  // Fetch the newly created user group to send back in the response (optional but good practice)
  const [newlyCreatedUserGroup] = await connection.execute(
    "SELECT name, description, target_value, callage_target, status FROM usergroups WHERE id = ?",
    [result.insertId]
  );

  res.status(201).json({
    message: "UserGroup created successfully",
    branch: newlyCreatedUserGroup[0],
  }); // Send back the full user group data
};

export const getUserGroups = async (req, res) => {
  const connection = await connectionToDatabase();

  const [rows] = await connection.execute("SELECT id, name, description, target_value, callage_target, status  FROM usergroups");

  if (rows.length === 0) {
    return res.status(404).json({ message: "User Groups not found" });
  }

  res.status(200).json({usergroup: rows });
};

export const updateUserGroup = async (req, res) => {
  const usergroupId = req.params.id;
  const { name, description, target_value, callage_target, status } = req.body;

  try {
    const connection = await connectionToDatabase();

    // Check if the organization exists
    const [existingUserGroup] = await connection.execute(
      "SELECT * FROM usergroups WHERE id = ?",
      [usergroupId]
    );

    if (existingUserGroup.length === 0) {
      return res.status(404).json({ message: "User Group not found" });
    }

    //check if code already exists and is not the same as the user group to be updated
    const [existingCodeusrgrp] = await connection.execute(
      "SELECT * FROM usergroups WHERE name = ? AND id != ?",
      [name, usergroupId]
    );
    if (existingCodeusrgrp.length > 0) {
      return res
        .status(409)
        .json({ message: "User Group name already exists" });
    }

    const [result] = await connection.execute(
      "UPDATE usergroups SET name = ?, description = ?, target_value = ?, status = ?, callage_target = ? WHERE id = ?",
      [name, description, target_value, status, callage_target, usergroupId]
    );

    if (result.affectedRows > 0) {
      const [updatedUserGroup] = await connection.execute(
        "SELECT  name, description, target_value, callage_target, status FROM usergroups WHERE id = ?",
        [usergroupId]
      );
      return res
        .status(200)
        .json({
          message: "User group updated successfully",
          usergroup: updateUserGroup[0],
        });
    } else {
      return res
        .status(200)
        .json({ message: "No changes were applied to the user group" });
    }
  } catch (error) {
    console.error("Error updating user group:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserChannels = async (req, res) => {
  const connection = await connectionToDatabase();

  const [rows] = await connection.execute("SELECT id, name, status  FROM channel");

  if (rows.length === 0) {
    return res.status(404).json({ message: "User channels not found" });
  }

  res.status(200).json({channel: rows });
};

export const getUserCategories = async (req, res) => {
  const connection = await connectionToDatabase();

  const [rows] = await connection.execute("SELECT id, name, status  FROM usercategory");

  if (rows.length === 0) {
    return res.status(404).json({ message: "User categories not found" });
  }

  res.status(200).json({usercategory: rows });
};

export const getSupervisors = async (req, res) => {
  const connection = await connectionToDatabase();

  const [rows] = await connection.execute("SELECT Id, fullname FROM users where usercategory_id='2'");

  if (rows.length === 0) {
    return res.status(404).json({ message: "Supervisors not found" });
  }

  res.status(200).json({supervisor: rows });
};
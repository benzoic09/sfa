import { connectionToDatabase } from "../config/database.js";

export const getClients = async (req, res) => {
  try {
    const connection = await connectionToDatabase();
    const [rows] = await connection.execute(
      "SELECT c.code, c.name, c.contact_person, c.mobile, c.mobile, c.physical_address, c.banner, c.suppliername, cc.name as category, cs.name as subcategory, cl.name as location, cr.name as relationship, ct.name as customertype, sr.name as salesrep, c.verification_status, u.username as verifiedby, c.verification_date, c.latitude, c.longitude, c.firstsaledate, c.lastsaledate, c.lastvisitdate, c.created_at FROM `fly-teck`.client c LEFT JOIN client_category cc on cc.id = c.category_id LEFT JOIN client_location cl on cl.id = c.location_id LEFT JOIN client_subcategory cs on cs.id = c.subcategory_id LEFT JOIN client_relationship cr on cr.id = c.relationship_id LEFT JOIN client_type ct on ct.id = c.customer_type_id LEFT JOIN users u on u.id = c.verified_by LEFT JOIN sales_reps sr on sr.id = c.salesrep_id"
    );
    res.status(200).json({ clients: rows });
  } catch (error) {
    console.error("Error fetching all clients:", error);
    res.status(500).json({ message: "Failed to fetch clients" });
  }
};
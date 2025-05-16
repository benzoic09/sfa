import express from "express";
import {
  createRole,
  createUser,
  getAllRoles,
  //getAllRolesdd,
  getUser,
  updateOrganization,
  updateRole,
} from "../controllers/adminController.js";
import {
  authenticateToken,
  authorizeRole,
} from "../middleware/authMiddleware.js";
import preventAdminEdit from "../middleware/preventAdminEdit.js";
import {
  createOrganization,
  getOrganizations,
} from "../controllers/organizationController.js";
import { getCountries } from "../controllers/countryController.js";
import {
  createBranch,
  getBranch,
  updateBranch,
} from "../controllers/branchController.js";
import {
  createUserGroup,
  getSupervisors,
  getUserCategories,
  getUserChannels,
  getUserGroups,
  updateUserGroup,
} from "../controllers/userGroupController.js";
import { getPricelistname } from "../controllers/pricelistController.js";

const router = express.Router();

// Route to create a new role (protected for Administrators)
router.post(
  "/roles",
  authenticateToken,
  authorizeRole(["Administrator"]),
  createRole
);

// Route to get all roles (protected for Administrators)
router.get(
  "/roles",
  authenticateToken,
  authorizeRole(["Administrator"]),
  getAllRoles
);

// Route to update all roles except Administrator role (protected for Administrators)
router.put(
  "/roles/:id",
  authenticateToken,
  authorizeRole(["Administrator"]),
  preventAdminEdit,
  updateRole
);

// Route to get all countries (protected for Administrators)
router.get(
  "/countries",
  authenticateToken,
  authorizeRole(["Administrator"]),
  getCountries
);

// Route to create a organisation (protected for Administrators)
router.post(
  "/organizations",
  authenticateToken,
  authorizeRole(["Administrator"]),
  createOrganization
);

// Route to get all organizations (protected for Administrators)
router.get(
  "/organizations",
  authenticateToken,
  authorizeRole(["Administrator"]),
  getOrganizations
);

// Route to update organization details (protected for Administrators)
router.put(
  "/organizations/:id",
  authenticateToken,
  authorizeRole(["Administrator"]),
  updateOrganization
);

// Route to create a branch (protected for Administrators)
router.post(
  "/branch",
  authenticateToken,
  authorizeRole(["Administrator"]),
  createBranch
);

// Route to get all branches (protected for Administrators)
router.get(
  "/branch",
  authenticateToken,
  authorizeRole(["Administrator"]),
  getBranch
);

// Route to update branch details (protected for Administrators)
router.put(
  "/branch/:id",
  authenticateToken,
  authorizeRole(["Administrator"]),
  updateBranch
);

// Route to create user group (protected for Administrators)
router.post(
  "/usergroup",
  authenticateToken,
  authorizeRole(["Administrator"]),
  createUserGroup
);

// Route to get all user groups (protected for Administrators)
router.get(
  "/usergroups",
  authenticateToken,
  authorizeRole(["Administrator"]),
  getUserGroups
);

// Route to update user group details (protected for Administrators)
router.put(
  "/usergroup/:id",
  authenticateToken,
  authorizeRole(["Administrator"]),
  updateUserGroup
);

// Route to create user (protected for Administrators)
router.post(
  "/users",
  authenticateToken,
  authorizeRole(["Administrator"]),
  createUser
);

// Route to get all users  (protected for Administrators)
router.get(
  "/user",
  authenticateToken,
  authorizeRole(["Administrator"]),
  getUser
);

// // Route to create user category (protected for Administrators)
// router.post(
//   "/usercategory",
//   authenticateToken,
//   authorizeRole(["Administrator"]),
//   createUserCategory
// );

// Route to get all user categories (protected for Administrators)
router.get(
  "/usercategory",
  authenticateToken,
  authorizeRole(["Administrator"]),
  getUserCategories
);

// // Route to update user group details (protected for Administrators)
// router.put(
//   "/usercategory/:id",
//   authenticateToken,
//   authorizeRole(["Administrator"]),
//   updateUserCategory
// );

// // Route to create user channels (protected for Administrators)
// router.post(
//   "/channel",
//   authenticateToken,
//   authorizeRole(["Administrator"]),
//   createUserChannel
// );

// Route to get all user channels (protected for Administrators)
router.get(
  "/channels",
  authenticateToken,
  authorizeRole(["Administrator"]),
  getUserChannels
);

// // Route to update user channels details (protected for Administrators)
// router.put(
//   "/channel/:id",
//   authenticateToken,
//   authorizeRole(["Administrator"]),
//   updateUserChannels
// );

// // Route to create supervisors (protected for Administrators)
// router.post(
//   "/supervisor",
//   authenticateToken,
//   authorizeRole(["Administrator"]),
//   createSupervisor
// );

// Route to get all supervisors (protected for Administrators)
router.get(
  "/supervisors",
  authenticateToken,
  authorizeRole(["Administrator"]),
  getSupervisors
);

// // Route to update supervisors details (protected for Administrators)
// router.put(
//   "/supervisor/:id",
//   authenticateToken,
//   authorizeRole(["Administrator"]),
//   updateSupervisor
// );

// // Route to create pricelist (protected for Administrators)
// router.post(
//   "/pricelist",
//   authenticateToken,
//   authorizeRole(["Administrator"]),
//   createPricelist
// );

// Route to get all Pricelist (protected for Administrators)
router.get(
  "/pricelists",
  authenticateToken,
  authorizeRole(["Administrator"]),
  getPricelistname
);

// // Route to update Pricelist details (protected for Administrators)
// router.put(
//   "/pricelist/:id",
//   authenticateToken,
//   authorizeRole(["Administrator"]),
//   updatePricelist
// );

export default router;

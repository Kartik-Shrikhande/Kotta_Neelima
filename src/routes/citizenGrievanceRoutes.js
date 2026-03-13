const express = require("express");
const router = express.Router();
const multer = require("multer");

const grievanceController = require("../controllers/citizenGrievanceController");
const authenticationMiddleware = require("../middleware/authenticationMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage });


// Public route
router.post("/submit", upload.single("document"), grievanceController.createGrievance);


// Admin routes
router.use(
  authenticationMiddleware.authenticateUser,
  authenticationMiddleware.authorizeRoles(["admin"])
);

router.get("/all", grievanceController.getAllGrievances);
router.get("/:id", grievanceController.getGrievanceById);
router.put("/update/:id", upload.single("document"), grievanceController.updateGrievance);
router.delete("/delete/:id", grievanceController.deleteGrievance);

module.exports = router;
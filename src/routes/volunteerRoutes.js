const express = require("express");
const router = express.Router();
const volunteerController = require("../controllers/volunteerController");
const authenticationMiddleware = require("../middleware/authenticationMiddleware");


// Public route (Volunteer registration)
router.post("/register", volunteerController.createVolunteer);


// Admin routes
router.use(
  authenticationMiddleware.authenticateUser,
  authenticationMiddleware.authorizeRoles(["admin"])
);

router.get("/all", volunteerController.getAllVolunteers);
router.get("/:id", volunteerController.getVolunteerById);
router.put("/update/:id", volunteerController.updateVolunteer);
router.delete("/delete/:id", volunteerController.deleteVolunteer);


module.exports = router;
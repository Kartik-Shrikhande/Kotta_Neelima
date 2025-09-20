const express = require("express");
const router = express.Router();
const podcastController = require("../controllers/podcastController");
const authenticationMiddleware = require('../middleware/authenticationMiddleware');


router.get("/all", podcastController.getAllPodcasts);

router.use(authenticationMiddleware.authenticateUser,authenticationMiddleware.authorizeRoles(['admin']))

router.post("/create", podcastController.createPodcast);
router.put("/:id", podcastController.updatePodcast);
router.delete("/:id", podcastController.deletePodcast);

module.exports = router;

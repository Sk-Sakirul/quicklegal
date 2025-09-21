const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');
const { getBookingStats, getAdvocateStats, getPopularCases, getAllUsers } = require('../controllers/admin.controller');

const router = express.Router();

router.use(authenticate);
router.use(roleMiddleware("admin"));

router.get("/bookings", getBookingStats);   //sees weekly bookings & revenue
router.get("/advocates", getAdvocateStats);  //sees which advocates are busy or idle
router.get("/cases/popular", getPopularCases);  //knows which legal services are in demand.
router.get("/users", getAllUsers);  //manage platform users

module.exports = router;
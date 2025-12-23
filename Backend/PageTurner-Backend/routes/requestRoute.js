const express = require("express");
const router = express.Router();
const Request = require("../models/requestModel");
const { protect, adminOnly } = require("../middleware/auth");

// POST /api/requests - Create a book request (User)
router.post("/", protect, async (req, res) => {
    const { title, author } = req.body;
    try {
        const request = await Request.create({
            user: req.user._id,
            title,
            author,
        });
        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: "Error submitting request" });
    }
});

// GET /api/requests - Get all requests (Admin)
router.get("/", protect, adminOnly, async (req, res) => {
    try {
        const requests = await Request.find().populate("user", "name email").sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching requests" });
    }
});

// PUT /api/requests/:id - Update status (Admin)
router.put("/:id", protect, adminOnly, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (request) {
            request.status = req.body.status || request.status;
            const updatedRequest = await request.save();
            res.json(updatedRequest);
        } else {
            res.status(404).json({ message: "Request not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating request" });
    }
});

module.exports = router;

// Get all join requests for a project owner
exports.getJoinRequests = async (req, res) => {
  try {
    const [requests] = await req.db.query(`
      SELECT jr.*, u.username
      FROM join_requests jr
      JOIN projects p ON jr.project_id = p.id
      JOIN users u ON jr.user_id = u.id
      WHERE p.user_id = ? ORDER BY jr.requested_at DESC
    `, [req.user.id]);

    res.json({ requests });
  } catch (err) {
    console.error("Error fetching join requests:", err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

// Accept or reject a request
exports.updateJoinRequestStatus = async (req, res) => {
  const { id } = req.params; // request ID
  const { status } = req.body;

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const [result] = await req.db.query(`
      UPDATE join_requests SET status = ? WHERE id = ?
    `, [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Join request not found" });
    }

    res.json({ message: `Request ${status}` });
  } catch (err) {
    console.error("Error updating request:", err);
    res.status(500).json({ error: "Failed to update request" });
  }
};

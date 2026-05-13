import Notification from '../models/Notification.js';
import Registration from '../models/Registration.js';

// POST /api/notifications  (admin only)
export const createNotification = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Notification text is required' });
    }

    const recipientCount = await Registration.countDocuments();
    const notification = await Notification.create({
      text: text.trim(),
      recipientCount,
      sentBy: req.admin?.username || 'admin',
    });

    res.status(201).json({ success: true, data: notification });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/notifications  (admin only)
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

import Registration from '../models/Registration.js';

// Generate ticket ID: CGA2018-XXXXXX (6 char alphanumeric)
const generateTicketId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'CGA2018-';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

// POST /api/registrations
export const createRegistration = async (req, res) => {
  try {
    const { fullName, employeeId, designation, district, mobile, email, attendance, message } = req.body;

    if (!fullName || !mobile) {
      return res.status(400).json({ success: false, message: 'Full name and mobile number are required' });
    }

    // Generate unique ticket ID
    let ticketId;
    let isUnique = false;
    while (!isUnique) {
      ticketId = generateTicketId();
      const existing = await Registration.findOne({ ticketId });
      if (!existing) isUnique = true;
    }

    const registration = await Registration.create({
      ticketId,
      fullName,
      employeeId,
      designation,
      district,
      mobile,
      email,
      attendance,
      message,
    });

    res.status(201).json({ success: true, data: registration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/registrations  (admin only)
export const getAllRegistrations = async (req, res) => {
  try {
    const { search, attendance, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (attendance && attendance !== 'all') filter.attendance = attendance;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [registrations, total] = await Promise.all([
      Registration.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Registration.countDocuments(filter),
    ]);

    res.json({ success: true, data: registrations, total, page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/registrations/stats  (admin only)
export const getStats = async (req, res) => {
  try {
    const [total, confirmed, districts] = await Promise.all([
      Registration.countDocuments(),
      Registration.countDocuments({ attendance: 'yes' }),
      Registration.distinct('district'),
    ]);

    res.json({
      success: true,
      data: {
        total,
        confirmed,
        districts: districts.filter(Boolean).length,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/registrations/export  (admin only)
export const exportCSV = async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });

    const headers = ['Name', 'Employee ID', 'Designation', 'District', 'Phone', 'Email', 'Status', 'Ticket ID', 'Registered At'];
    const rows = registrations.map((r) => [
      r.fullName,
      r.employeeId || '',
      r.designation || '',
      r.district || '',
      r.mobile,
      r.email || '',
      r.attendance,
      r.ticketId,
      r.createdAt.toLocaleString(),
    ]);

    const escapeCSV = (val) => `"${(val || '').toString().replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((row) => row.map(escapeCSV).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="CGA_2018_Reunion_Attendees.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

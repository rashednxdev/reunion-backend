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
    const { name, fullName, phone, mobile, employeeId, designation, bloodGroup, gender, officeType, division, district, upazila, email, message, members = [], paymentMethod, transactionId, amountPaid, tshirtSize } = req.body;

    const finalName = fullName || name;
    const finalMobile = mobile || phone;

    if (!finalName || !finalMobile) {
      return res.status(400).json({ success: false, message: 'Full name and mobile number are required' });
    }

    // Check if mobile already exists
    const existingMobile = await Registration.findOne({ mobile: finalMobile });
    if (existingMobile) {
      return res.status(400).json({ success: false, message: 'This mobile number is already registered' });
    }

    // Calculate Fee
    let calculatedFee = 1200; // Base fee
    if (Array.isArray(members)) {
      members.forEach(member => {
        if (member.ageGroup && member.ageGroup !== 'Below 6') {
          calculatedFee += 600;
        }
      });
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
      fullName: finalName,
      employeeId,
      designation,
      bloodGroup,
      gender,
      officeType,
      division,
      district,
      upazila,
      mobile: finalMobile,
      email,
      tshirtSize,
      message,
      members,
      totalFee: calculatedFee,
      paymentMethod,
      transactionId,
      amountPaid: Number(amountPaid) || calculatedFee,
      status: 'pending' // default
    });

    res.status(201).json({ success: true, data: registration, registration });
  } catch (err) {
    if (err.code === 11000) {
       return res.status(400).json({ success: false, message: 'This mobile number is already registered' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/registrations/check/:mobile
export const checkRegistration = async (req, res) => {
  try {
    const { mobile } = req.params;
    if (!mobile) return res.status(400).json({ success: false, message: 'Mobile number is required' });

    const registration = await Registration.findOne({ mobile });
    if (!registration) {
      return res.json({ success: true, isRegistered: false });
    }

    res.json({ success: true, isRegistered: true, data: registration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/registrations/:id/status (admin only)
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const registration = await Registration.findById(id);
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });

    registration.status = status;
    if (status === 'rejected') {
      registration.rejectionReason = rejectionReason;
    } else {
      registration.rejectionReason = undefined; // clear reason if approved/pending
    }

    await registration.save();
    res.json({ success: true, data: registration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/registrations  (admin only)
export const getAllRegistrations = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (status && status !== 'all') filter.status = status;
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
    const [total, pending, approved, rejected] = await Promise.all([
      Registration.countDocuments(),
      Registration.countDocuments({ status: 'pending' }),
      Registration.countDocuments({ status: 'approved' }),
      Registration.countDocuments({ status: 'rejected' }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
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

    const headers = ['Name', 'Employee ID', 'Designation', 'Blood Group', 'Gender', 'Office Type', 'Division', 'District', 'Upazila', 'Phone', 'Email', 'Status', 'Total Fee', 'Payment Method', 'TrxID', 'Members Count', 'Ticket ID', 'Registered At'];
    const rows = registrations.map((r) => [
      r.fullName,
      r.employeeId || '',
      r.designation || '',
      r.bloodGroup || '',
      r.gender || '',
      r.officeType || '',
      r.division || '',
      r.district || '',
      r.upazila || '',
      r.mobile,
      r.email || '',
      r.status,
      r.totalFee,
      r.paymentMethod || '',
      r.transactionId || '',
      r.members?.length || 0,
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

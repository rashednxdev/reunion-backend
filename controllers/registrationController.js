import Registration from '../models/Registration.js';
import UserOffice from '../models/UserOffice.js';

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
    const { name, fullName, phone, mobile, employeeId, designation, bloodGroup, gender, officeType, division, district, upazila, email, message, members = [], paymentMethod, transactionId, amountPaid, tshirtSize, officeName } = req.body;

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
      calculatedFee += members.length * 600;
    }

    // Generate unique ticket ID
    let ticketId;
    let isUnique = false;
    while (!isUnique) {
      ticketId = generateTicketId();
      const existing = await Registration.findOne({ ticketId });
      if (!existing) isUnique = true;
    }

    // Compute unified office name
    let computedOfficeName = officeType || '';
    if (officeType === 'Office of the Controller General of Accounts' || officeType === 'CGA') {
      computedOfficeName = 'CGA';
    } else if (officeType === 'Chief Accounts and Finance Office' || officeType === 'CAFO') {
      computedOfficeName = officeName || district || 'CAFO';
    } else if (officeType === 'Divisional Controller General of Accounts' || officeType === 'DCA') {
      computedOfficeName = `DCA - ${division || ''}`;
    } else if (officeType === 'District Accounts and Finance Office' || officeType === 'DAFO') {
      computedOfficeName = `DAFO - ${district || ''}`;
    } else if (officeType === 'Upazila Accounts Office' || officeType === 'UAO') {
      computedOfficeName = `UAO - ${upazila || ''}`;
    }

    const registration = await Registration.create({
      ticketId,
      fullName: finalName,
      employeeId,
      designation,
      bloodGroup,
      gender,
      officeType,
      officeName: computedOfficeName,
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

    // Create UserOffice tracking entry
    try {
      await UserOffice.create({
        registrationId: registration._id,
        fullName: finalName,
        mobile: finalMobile,
        officeType,
        officeName: computedOfficeName,
        division: division || 'N/A',
        district: district || 'N/A',
        upazila: upazila || 'N/A',
      });
    } catch (err) {
      console.error('Failed to create UserOffice entry:', err);
    }

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

    const headers = ['Name', 'Employee ID', 'Designation', 'Blood Group', 'Gender', 'Office Type', 'Office Name', 'Division', 'District', 'Upazila', 'Phone', 'Email', 'Status', 'Total Fee', 'Payment Method', 'TrxID', 'Members Count', 'Ticket ID', 'Registered At'];
    const rows = registrations.map((r) => [
      r.fullName,
      r.employeeId || '',
      r.designation || '',
      r.bloodGroup || '',
      r.gender || '',
      r.officeType || '',
      r.officeName || '',
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

// GET /api/registrations/public-stats  (public)
export const getPublicStats = async (req, res) => {
  try {
    const filter = { status: { $in: ['pending', 'approved'] } };

    const officeTypeStats = await Registration.aggregate([
      { $match: filter },
      {
        $project: {
          officeType: 1,
          totalPersons: { $add: [1, { $size: { $ifNull: ['$members', []] } }] }
        }
      },
      {
        $group: {
          _id: '$officeType',
          count: { $sum: '$totalPersons' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Query registrations to compute other stats
    const registrations = await Registration.find(filter, { gender: 1, members: 1 });

    let totalRegistrations = registrations.length;
    let totalGuests = 0;

    const userGenderCount = { Male: 0, Female: 0, Other: 0 };
    const guestGenderCount = { Male: 0, Female: 0, Other: 0 };
    const totalGenderCount = { Male: 0, Female: 0, Other: 0 };

    registrations.forEach(r => {
      // Standardize gender keys to start uppercase
      let g = r.gender || 'Male';
      g = g.charAt(0).toUpperCase() + g.slice(1).toLowerCase();
      if (!['Male', 'Female', 'Other'].includes(g)) g = 'Other';

      userGenderCount[g] = (userGenderCount[g] || 0) + 1;
      totalGenderCount[g] = (totalGenderCount[g] || 0) + 1;

      if (r.members && r.members.length > 0) {
        r.members.forEach(m => {
          let mg = m.gender || 'Male';
          mg = mg.charAt(0).toUpperCase() + mg.slice(1).toLowerCase();
          if (!['Male', 'Female', 'Other'].includes(mg)) mg = 'Other';

          guestGenderCount[mg] = (guestGenderCount[mg] || 0) + 1;
          totalGenderCount[mg] = (totalGenderCount[mg] || 0) + 1;
          totalGuests += 1;
        });
      }
    });

    const formatGender = (obj) => Object.keys(obj).map(key => ({ _id: key, count: obj[key] }));

    res.json({
      success: true,
      data: {
        officeTypeStats,
        totalRegistrations,
        totalGuests,
        totalAttendees: totalRegistrations + totalGuests,
        userGenderStats: formatGender(userGenderCount),
        guestGenderStats: formatGender(guestGenderCount),
        totalGenderStats: formatGender(totalGenderCount)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/registrations/assign-serials  (admin only)
// Bulk-assigns sequential serial numbers to ALL approved registrations that don't have one yet
export const assignSerialNumbers = async (req, res) => {
  try {
    // Get all approved registrations without a serial number, oldest first
    const unassigned = await Registration.find({
      status: 'approved',
      serialNumber: { $exists: false }
    }).sort({ createdAt: 1 });

    if (unassigned.length === 0) {
      return res.json({ success: true, message: 'All approved registrations already have serial numbers.', assigned: 0 });
    }

    // Find the current highest serial number for Male
    const highestMale = await Registration.findOne({
      gender: 'Male',
      serialNumber: { $exists: true }
    }).sort({ serialNumber: -1 });
    let nextMaleSerial = highestMale ? highestMale.serialNumber + 1 : 100;

    // Find the current highest serial number for Female
    const highestFemale = await Registration.findOne({
      gender: 'Female',
      serialNumber: { $exists: true }
    }).sort({ serialNumber: -1 });
    let nextFemaleSerial = highestFemale ? highestFemale.serialNumber + 1 : 600;

    let assignedCount = 0;
    const updates = [];

    for (const reg of unassigned) {
      const isFemale = (reg.gender || '').toLowerCase() === 'female';
      let serial;
      if (isFemale) {
        serial = nextFemaleSerial++;
      } else {
        serial = nextMaleSerial++;
      }

      // Generate ticketId based on: first letter of gender + tshirt size + '-' + serial
      const genderLetter = (reg.gender || 'Male').charAt(0).toUpperCase();
      const tshirtSize = (reg.tshirtSize || 'M').toUpperCase();
      const ticketId = `${genderLetter}${tshirtSize}-${serial}`;

      updates.push({
        updateOne: {
          filter: { _id: reg._id },
          update: { 
            $set: { 
              serialNumber: serial,
              ticketId: ticketId
            } 
          }
        }
      });
      assignedCount++;
    }

    await Registration.bulkWrite(updates);

    res.json({
      success: true,
      message: `Successfully assigned ${assignedCount} serial numbers and formatted tickets.`,
      assigned: assignedCount
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/registrations/draw-candidates  (public – only reveals name, district, office, serialNumber)
export const getDrawCandidates = async (req, res) => {
  try {
    const candidates = await Registration.find(
      { status: 'approved', serialNumber: { $exists: true } },
      { serialNumber: 1, fullName: 1, district: 1, officeType: 1 }
    ).sort({ serialNumber: 1 });

    res.json({ success: true, data: candidates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/registrations/sync-user-offices (admin only)
export const syncUserOffices = async (req, res) => {
  try {
    const registrations = await Registration.find();
    let syncedCount = 0;

    for (const reg of registrations) {
      // Determine computed office name
      let computedOfficeName = reg.officeType || '';
      const oType = reg.officeType || '';

      if (oType === 'Office of the Controller General of Accounts' || oType === 'CGA') {
        computedOfficeName = 'CGA';
      } else if (oType === 'Chief Accounts and Finance Office' || oType === 'CAFO') {
        computedOfficeName = reg.officeName || reg.district || 'CAFO';
      } else if (oType === 'Divisional Controller General of Accounts' || oType === 'DCA') {
        computedOfficeName = `DCA - ${reg.division || ''}`;
      } else if (oType === 'District Accounts and Finance Office' || oType === 'DAFO') {
        computedOfficeName = `DAFO - ${reg.district || ''}`;
      } else if (oType === 'Upazila Accounts Office' || oType === 'UAO') {
        computedOfficeName = `UAO - ${reg.upazila || ''}`;
      }

      // Update registration document
      reg.officeName = computedOfficeName;
      await reg.save({ validateBeforeSave: false });

      // Create or update UserOffice entry
      await UserOffice.findOneAndUpdate(
        { registrationId: reg._id },
        {
          fullName: reg.fullName,
          mobile: reg.mobile,
          officeType: oType,
          officeName: computedOfficeName,
          division: reg.division || 'N/A',
          district: reg.district || 'N/A',
          upazila: reg.upazila || 'N/A',
        },
        { upsert: true, new: true }
      );

      syncedCount++;
    }

    res.json({ success: true, message: `Successfully synced ${syncedCount} registrations with UserOffice table.`, syncedCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

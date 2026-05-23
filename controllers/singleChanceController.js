import SingleChanceConfig from '../models/SingleChanceConfig.js';
import SingleChanceBooking from '../models/SingleChanceBooking.js';
import Registration from '../models/Registration.js';

// GET /api/single-chance
export const getConfig = async (req, res) => {
  try {
    let config = await SingleChanceConfig.findOne();
    if (!config) {
      // Create a default config if it doesn't exist
      config = await SingleChanceConfig.create({
        title: 'Single Chance Games',
        time: '02:30 PM - 04:00 PM',
        policy: '1. Only registered and approved members can book and participate.\n2. Each member can book only once per game.\n3. Ticket verification is required at the venue.',
        games: ['Hari Bhanga', 'Drop a ball in a basket'],
      });
    }
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/single-chance/setup (Admin only)
export const saveConfig = async (req, res) => {
  try {
    const { title, time, policy, games } = req.body;

    if (!title || !time || !policy || !Array.isArray(games) || games.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'All fields (title, time, policy, and a non-empty games list) are required.',
      });
    }

    let config = await SingleChanceConfig.findOne();
    if (config) {
      config.title = title.trim();
      config.time = time.trim();
      config.policy = policy.trim();
      config.games = games.map(g => g.trim()).filter(Boolean);
      await config.save();
    } else {
      config = await SingleChanceConfig.create({
        title: title.trim(),
        time: time.trim(),
        policy: policy.trim(),
        games: games.map(g => g.trim()).filter(Boolean),
      });
    }

    res.json({ success: true, data: config, message: 'Configuration saved successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/single-chance/book
export const createBooking = async (req, res) => {
  try {
    const { mobile, email, ticketId, gameName } = req.body;

    if (!mobile || !email || !ticketId || !gameName) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number, email address, Ticket ID, and game selection are all required.',
      });
    }

    const queryMobile = mobile.trim();
    const queryEmail = email.trim().toLowerCase();
    const queryTicketId = ticketId.trim().toUpperCase();
    const queryGame = gameName.trim();

    // Verify registration exists and is approved
    const registration = await Registration.findOne({
      status: 'approved',
      mobile: queryMobile,
      email: queryEmail,
      ticketId: queryTicketId,
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'No approved registration found matching these credentials and Ticket ID. Please verify your details.',
      });
    }

    // Verify game exists in the configuration
    const config = await SingleChanceConfig.findOne();
    const activeGames = config ? config.games : ['Hari Bhanga', 'Drop a ball in a basket'];
    if (!activeGames.includes(queryGame)) {
      return res.status(400).json({
        success: false,
        message: `The game "${queryGame}" is not available for booking.`,
      });
    }

    // Check for double booking
    const existingBooking = await SingleChanceBooking.findOne({
      registrationId: registration._id,
      gameName: queryGame,
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: `You have already booked your spot for "${queryGame}"!`,
      });
    }

    // Create booking
    const booking = await SingleChanceBooking.create({
      registrationId: registration._id,
      fullName: registration.fullName,
      mobile: queryMobile,
      email: queryEmail,
      ticketId: queryTicketId,
      gameName: queryGame,
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: `Successfully booked for "${queryGame}"!`,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already booked your spot for this game!',
      });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/single-chance/bookings (Admin only)
export const getBookings = async (req, res) => {
  try {
    const bookings = await SingleChanceBooking.find().sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

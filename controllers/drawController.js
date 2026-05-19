import DrawConfig from '../models/DrawConfig.js';
import Registration from '../models/Registration.js';

// Helper – get or create the single draw config document
const getOrCreate = async () => {
  let config = await DrawConfig.findOne();
  if (!config) config = await DrawConfig.create({ ranges: [], prizes: [] });
  return config;
};

// GET /api/draw  (public – draw page needs this)
export const getDrawConfig = async (req, res) => {
  try {
    const config = await getOrCreate();
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── RANGES ──────────────────────────────────────────────────

// POST /api/draw/ranges  (admin)
export const addRange = async (req, res) => {
  try {
    const { from, to } = req.body;
    if (!from || !to || Number(from) > Number(to)) {
      return res.status(400).json({ success: false, message: 'Invalid range. "from" must be ≤ "to".' });
    }
    const config = await getOrCreate();
    config.ranges.push({ from: Number(from), to: Number(to) });
    await config.save();
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/draw/ranges/:rangeId  (admin)
export const deleteRange = async (req, res) => {
  try {
    const config = await getOrCreate();
    config.ranges = config.ranges.filter(r => r._id.toString() !== req.params.rangeId);
    await config.save();
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/draw/ranges/:rangeId  (admin)
export const updateRange = async (req, res) => {
  try {
    const { from, to } = req.body;
    if (!from || !to || Number(from) > Number(to)) {
      return res.status(400).json({ success: false, message: 'Invalid range. "from" must be ≤ "to".' });
    }
    const config = await getOrCreate();
    const range = config.ranges.id(req.params.rangeId);
    if (!range) return res.status(404).json({ success: false, message: 'Range not found.' });
    range.from = Number(from);
    range.to = Number(to);
    await config.save();
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PRIZES ──────────────────────────────────────────────────

// POST /api/draw/prizes  (admin)
export const addPrize = async (req, res) => {
  try {
    const { position, label } = req.body;
    if (!position || !label) {
      return res.status(400).json({ success: false, message: 'Position and label are required.' });
    }
    const config = await getOrCreate();
    // Prevent duplicate positions
    if (config.prizes.find(p => p.position === Number(position))) {
      return res.status(400).json({ success: false, message: `Position ${position} already exists.` });
    }
    config.prizes.push({ position: Number(position), label: label.trim() });
    config.prizes.sort((a, b) => a.position - b.position);
    await config.save();
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/draw/prizes/:prizeId  (admin)
export const deletePrize = async (req, res) => {
  try {
    const config = await getOrCreate();
    config.prizes = config.prizes.filter(p => p._id.toString() !== req.params.prizeId);
    await config.save();
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/draw/prizes/:prizeId  (admin)
export const updatePrize = async (req, res) => {
  try {
    const { position, label } = req.body;
    if (!position || !label) {
      return res.status(400).json({ success: false, message: 'Position and label are required.' });
    }
    const config = await getOrCreate();
    const prize = config.prizes.id(req.params.prizeId);
    if (!prize) return res.status(404).json({ success: false, message: 'Prize not found.' });
    // Check no other prize has that position
    const conflict = config.prizes.find(p => p.position === Number(position) && p._id.toString() !== req.params.prizeId);
    if (conflict) return res.status(400).json({ success: false, message: `Position ${position} is already used by another prize.` });
    prize.position = Number(position);
    prize.label = label.trim();
    config.prizes.sort((a, b) => a.position - b.position);
    await config.save();
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ── DRAW RESULT ─────────────────────────────────────────────

// POST /api/draw/record-winner  (admin – called from draw page after each draw)
export const recordWinner = async (req, res) => {
  try {
    const { prizeId, winnerSerial } = req.body;
    if (!prizeId || winnerSerial == null) {
      return res.status(400).json({ success: false, message: 'prizeId and winnerSerial are required.' });
    }

    const config = await getOrCreate();
    const prize = config.prizes.id(prizeId);
    if (!prize) return res.status(404).json({ success: false, message: 'Prize not found.' });

    // Check serial not already won
    const alreadyWon = config.prizes.some(p => p.winnerSerial === Number(winnerSerial));
    if (alreadyWon) return res.status(400).json({ success: false, message: 'This serial has already won a prize.' });

    // Look up the winner's name from registrations
    const reg = await Registration.findOne({ serialNumber: Number(winnerSerial) });
    prize.winnerSerial = Number(winnerSerial);
    prize.winnerName = reg ? reg.fullName : `Serial #${winnerSerial}`;
    await config.save();

    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/draw/reset  (admin)
export const resetDraw = async (req, res) => {
  try {
    const config = await getOrCreate();
    config.prizes.forEach(p => { p.winnerSerial = null; p.winnerName = null; });
    config.isLocked = false;
    await config.save();
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

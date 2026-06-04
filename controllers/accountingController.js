import ExpenditureType from '../models/ExpenditureType.js';
import Expenditure from '../models/Expenditure.js';
import Registration from '../models/Registration.js';

// ── Expenditure Types ──────────────────────────────────────

// GET /api/accounting/types
export const getExpenditureTypes = async (req, res) => {
  try {
    const types = await ExpenditureType.find().sort({ name: 1 });
    res.json({ success: true, data: types });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/accounting/types
export const createExpenditureType = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Type name is required' });
    }
    const type = await ExpenditureType.create({ name: name.trim() });
    res.status(201).json({ success: true, data: type });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'This expenditure type already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/accounting/types/:id
export const deleteExpenditureType = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if any expenditure uses this type
    const inUse = await Expenditure.exists({ type: id });
    if (inUse) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete this type — it is used in existing expenditure records.',
      });
    }
    await ExpenditureType.findByIdAndDelete(id);
    res.json({ success: true, message: 'Expenditure type deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Expenditures ───────────────────────────────────────────

// GET /api/accounting/expenditures
export const getExpenditures = async (req, res) => {
  try {
    const expenditures = await Expenditure.find()
      .populate('type', 'name')
      .sort({ date: -1, createdAt: -1 });
    res.json({ success: true, data: expenditures });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/accounting/expenditures
export const createExpenditure = async (req, res) => {
  try {
    const { type, date, amount, note } = req.body;
    if (!type || !date || amount === undefined || amount === null) {
      return res.status(400).json({ success: false, message: 'Type, date, and amount are required' });
    }

    const typeExists = await ExpenditureType.findById(type);
    if (!typeExists) {
      return res.status(400).json({ success: false, message: 'Invalid expenditure type' });
    }

    const expenditure = await Expenditure.create({
      type,
      date: new Date(date),
      amount: Number(amount),
      note: note?.trim() || '',
    });

    const populated = await expenditure.populate('type', 'name');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/accounting/expenditures/:id
export const deleteExpenditure = async (req, res) => {
  try {
    const { id } = req.params;
    await Expenditure.findByIdAndDelete(id);
    res.json({ success: true, message: 'Expenditure deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Summary ────────────────────────────────────────────────

// GET /api/accounting/summary
export const getAccountingSummary = async (req, res) => {
  try {
    // Total received = sum of amountPaid for approved registrations
    const receivedAgg = await Registration.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } },
    ]);
    const totalReceived = receivedAgg[0]?.total || 0;

    // Total expenditure
    const expendAgg = await Expenditure.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalExpenditure = expendAgg[0]?.total || 0;

    const balance = totalReceived - totalExpenditure;

    res.json({
      success: true,
      data: {
        totalReceived,
        totalExpenditure,
        balance,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

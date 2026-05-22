import Opinion from '../models/Opinion.js';

// GET /api/opinions
export const getOpinions = async (req, res) => {
  try {
    const opinions = await Opinion.find().sort({ createdAt: -1 });
    res.json({ success: true, data: opinions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/opinions
export const createOpinion = async (req, res) => {
  try {
    const { name, designation, officeName, opinion } = req.body;
    if (!name || !opinion) {
      return res.status(400).json({ success: false, message: 'Name and opinion are required.' });
    }

    const newOpinion = await Opinion.create({
      name: name.trim(),
      designation: designation ? designation.trim() : '',
      officeName: officeName ? officeName.trim() : '',
      opinion: opinion.trim(),
    });

    res.status(201).json({ success: true, data: newOpinion });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

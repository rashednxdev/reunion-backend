import OfficeType from '../models/OfficeType.js';
import Division from '../models/Division.js';
import District from '../models/District.js';
import Upazila from '../models/Upazila.js';

// --- Office Types ---
export const getOfficeTypes = async (req, res) => {
  try {
    const data = await OfficeType.find().sort({ createdAt: 1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOfficeType = async (req, res) => {
  try {
    const { title, short } = req.body;
    const newData = await OfficeType.create({ title, short });
    res.status(201).json({ success: true, data: newData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteOfficeType = async (req, res) => {
  try {
    await OfficeType.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Divisions ---
export const getDivisions = async (req, res) => {
  try {
    const data = await Division.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDivision = async (req, res) => {
  try {
    const { title, short } = req.body;
    const newData = await Division.create({ title, short });
    res.status(201).json({ success: true, data: newData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDivision = async (req, res) => {
  try {
    await Division.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Districts ---
export const getDistricts = async (req, res) => {
  try {
    const data = await District.find().populate('divisionId', 'title short').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDistrict = async (req, res) => {
  try {
    const { title, short, divisionId } = req.body;
    if (!divisionId) return res.status(400).json({ success: false, message: 'divisionId is required' });
    const newData = await District.create({ title, short, divisionId });
    // Populate division before sending back
    const populated = await District.findById(newData._id).populate('divisionId', 'title short');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDistrict = async (req, res) => {
  try {
    await District.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Upazilas ---
export const getUpazilas = async (req, res) => {
  try {
    const data = await Upazila.find().populate({
      path: 'districtId',
      select: 'title short',
      populate: { path: 'divisionId', select: 'title short' }
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createUpazila = async (req, res) => {
  try {
    const { title, short, districtId } = req.body;
    if (!districtId) return res.status(400).json({ success: false, message: 'districtId is required' });
    const newData = await Upazila.create({ title, short, districtId });
    const populated = await Upazila.findById(newData._id).populate({
      path: 'districtId',
      select: 'title short',
      populate: { path: 'divisionId', select: 'title short' }
    });
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUpazila = async (req, res) => {
  try {
    await Upazila.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

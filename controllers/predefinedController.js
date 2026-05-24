import OfficeType from '../models/OfficeType.js';
import Division from '../models/Division.js';
import District from '../models/District.js';
import Upazila from '../models/Upazila.js';
import OfficeName from '../models/OfficeName.js';
import Designation from '../models/Designation.js';

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

// --- Office Names (DCA / DAFO / UAO) ---
export const getOfficeNames = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { officeTypeKey: type.toUpperCase() } : {};
    const data = await OfficeName.find(filter)
      .populate('divisionId', 'title short')
      .populate('districtId', 'title short')
      .populate('upazilaId', 'title short')
      .sort({ officeTypeKey: 1, title: 1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createOfficeName = async (req, res) => {
  try {
    const { title, short, officeTypeKey, divisionId, districtId, upazilaId } = req.body;
    if (!officeTypeKey || (officeTypeKey !== 'CAFO' && !divisionId)) {
      return res.status(400).json({ success: false, message: 'officeTypeKey and divisionId are required' });
    }
    const doc = await OfficeName.create({ title, short, officeTypeKey, divisionId: divisionId || undefined, districtId, upazilaId });
    const populated = await OfficeName.findById(doc._id)
      .populate('divisionId', 'title short')
      .populate('districtId', 'title short')
      .populate('upazilaId', 'title short');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteOfficeName = async (req, res) => {
  try {
    await OfficeName.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateOfficeName = async (req, res) => {
  try {
    const { title, short, divisionId, districtId, upazilaId } = req.body;
    const doc = await OfficeName.findByIdAndUpdate(
      req.params.id,
      {
        title,
        short: short ? short.trim() : undefined,
        divisionId: divisionId || undefined,
        districtId: districtId || undefined,
        upazilaId: upazilaId || undefined
      },
      { new: true }
    )
      .populate('divisionId', 'title short')
      .populate('districtId', 'title short')
      .populate('upazilaId', 'title short');

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Office not found' });
    }
    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Designations ---
export const getDesignations = async (req, res) => {
  try {
    const data = await Designation.find().sort({ title: 1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDesignation = async (req, res) => {
  try {
    const { title, short } = req.body;
    const newData = await Designation.create({ title, short });
    res.status(201).json({ success: true, data: newData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDesignation = async (req, res) => {
  try {
    await Designation.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

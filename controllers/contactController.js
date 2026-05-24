import ContactType from '../models/ContactType.js';

// Get all contact types (public)
export const getContactTypes = async (req, res) => {
  try {
    const data = await ContactType.find().sort({ createdAt: 1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new contact type (admin auth)
export const createContactType = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    const newType = await ContactType.create({ title, description, contacts: [] });
    res.status(201).json({ success: true, data: newType });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update contact type (admin auth)
export const updateContactType = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;
    const contactType = await ContactType.findById(id);
    if (!contactType) {
      return res.status(404).json({ success: false, message: 'Contact type not found' });
    }
    if (title !== undefined) contactType.title = title;
    if (description !== undefined) contactType.description = description;

    const updated = await contactType.save();
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete contact type (admin auth)
export const deleteContactType = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ContactType.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Contact type not found' });
    }
    res.status(200).json({ success: true, message: 'Contact type deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add contact entry to type (admin auth)
export const addContactEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, number, note } = req.body;
    if (!name || !number) {
      return res.status(400).json({ success: false, message: 'Name and number are required' });
    }
    const contactType = await ContactType.findById(id);
    if (!contactType) {
      return res.status(404).json({ success: false, message: 'Contact type not found' });
    }
    contactType.contacts.push({ name, number, note });
    const updated = await contactType.save();
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update contact entry (admin auth)
export const updateContactEntry = async (req, res) => {
  try {
    const { id, entryId } = req.params;
    const { name, number, note } = req.body;
    const contactType = await ContactType.findById(id);
    if (!contactType) {
      return res.status(404).json({ success: false, message: 'Contact type not found' });
    }
    const entry = contactType.contacts.id(entryId);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Contact entry not found' });
    }
    if (name !== undefined) entry.name = name;
    if (number !== undefined) entry.number = number;
    if (note !== undefined) entry.note = note;

    const updated = await contactType.save();
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete contact entry (admin auth)
export const deleteContactEntry = async (req, res) => {
  try {
    const { id, entryId } = req.params;
    const contactType = await ContactType.findById(id);
    if (!contactType) {
      return res.status(404).json({ success: false, message: 'Contact type not found' });
    }
    contactType.contacts.pull(entryId);
    const updated = await contactType.save();
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

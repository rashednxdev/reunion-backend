import PaymentMethod from '../models/PaymentMethod.js';

// Get all payment methods (public)
export const getPaymentMethods = async (req, res) => {
  try {
    const data = await PaymentMethod.find().sort({ createdAt: 1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new payment method (admin auth)
export const createPaymentMethod = async (req, res) => {
  try {
    const { name, number, instructions, isActive } = req.body;
    if (!name || !number) {
      return res.status(400).json({ success: false, message: 'Name and number are required' });
    }
    const newData = await PaymentMethod.create({ name, number, instructions, isActive });
    res.status(201).json({ success: true, data: newData });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Payment method name already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing payment method (admin auth)
export const updatePaymentMethod = async (req, res) => {
  try {
    const { name, number, instructions, isActive } = req.body;
    const paymentMethod = await PaymentMethod.findById(req.params.id);
    if (!paymentMethod) {
      return res.status(404).json({ success: false, message: 'Payment method not found' });
    }

    if (name) paymentMethod.name = name;
    if (number) paymentMethod.number = number;
    if (instructions !== undefined) paymentMethod.instructions = instructions;
    if (isActive !== undefined) paymentMethod.isActive = isActive;

    const updatedData = await paymentMethod.save();
    res.status(200).json({ success: true, data: updatedData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a payment method (admin auth)
export const deletePaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findByIdAndDelete(req.params.id);
    if (!paymentMethod) {
      return res.status(404).json({ success: false, message: 'Payment method not found' });
    }
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

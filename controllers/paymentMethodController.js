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
    const { name, type, number, bankName, accountName, accountNumber, routingNumber, instructions, isActive } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Payment method name is required' });
    }

    const payType = type || 'Mobile Banking';

    if (payType === 'Mobile Banking') {
      if (!number) {
        return res.status(400).json({ success: false, message: 'Account number is required for Mobile Banking' });
      }
    } else if (payType === 'Bank Account') {
      if (!bankName || !accountName || !accountNumber || !routingNumber) {
        return res.status(400).json({ success: false, message: 'Bank Name, Account Name, A/C Number, and Routing Number are required for Bank Accounts' });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Invalid payment method type' });
    }

    const newData = await PaymentMethod.create({
      name,
      type: payType,
      number: payType === 'Mobile Banking' ? number : '',
      bankName: payType === 'Bank Account' ? bankName : '',
      accountName: payType === 'Bank Account' ? accountName : '',
      accountNumber: payType === 'Bank Account' ? accountNumber : '',
      routingNumber: payType === 'Bank Account' ? routingNumber : '',
      instructions,
      isActive
    });
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
    const { name, type, number, bankName, accountName, accountNumber, routingNumber, instructions, isActive } = req.body;
    const paymentMethod = await PaymentMethod.findById(req.params.id);
    if (!paymentMethod) {
      return res.status(404).json({ success: false, message: 'Payment method not found' });
    }

    const payType = type !== undefined ? type : paymentMethod.type;

    if (payType === 'Mobile Banking') {
      const numVal = number !== undefined ? number : paymentMethod.number;
      if (!numVal) {
        return res.status(400).json({ success: false, message: 'Account number is required for Mobile Banking' });
      }
      paymentMethod.number = numVal;
      paymentMethod.bankName = '';
      paymentMethod.accountName = '';
      paymentMethod.accountNumber = '';
      paymentMethod.routingNumber = '';
    } else if (payType === 'Bank Account') {
      const bName = bankName !== undefined ? bankName : paymentMethod.bankName;
      const aName = accountName !== undefined ? accountName : paymentMethod.accountName;
      const aNum = accountNumber !== undefined ? accountNumber : paymentMethod.accountNumber;
      const rNum = routingNumber !== undefined ? routingNumber : paymentMethod.routingNumber;

      if (!bName || !aName || !aNum || !rNum) {
        return res.status(400).json({ success: false, message: 'Bank Name, Account Name, A/C Number, and Routing Number are required for Bank Accounts' });
      }
      paymentMethod.number = '';
      paymentMethod.bankName = bName;
      paymentMethod.accountName = aName;
      paymentMethod.accountNumber = aNum;
      paymentMethod.routingNumber = rNum;
    }

    if (name) paymentMethod.name = name;
    if (type !== undefined) paymentMethod.type = type;
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

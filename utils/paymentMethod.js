import PaymentMethod from '../models/PaymentMethod.js';

export const CASH_PAYMENT_TYPE = 'Cash Payment';

const BASE_REGISTRATION_FEE = 1400;
const FAMILY_MEMBER_FEE = 900;

export function calculateRegistrationFee(members = []) {
  const count = Array.isArray(members) ? members.length : 0;
  return BASE_REGISTRATION_FEE + count * FAMILY_MEMBER_FEE;
}

export async function getPaymentMethodByName(name) {
  if (!name) return null;
  return PaymentMethod.findOne({ name });
}

export async function isCashPaymentMethodName(name) {
  const pm = await getPaymentMethodByName(name);
  return pm?.type === CASH_PAYMENT_TYPE;
}

export async function resolveRegistrationPayment(paymentMethodName, members, amountPaidFromClient) {
  const calculatedFee = calculateRegistrationFee(members);
  const isCash = await isCashPaymentMethodName(paymentMethodName);

  if (isCash) {
    return { calculatedFee, amountPaid: 0, isCash: true };
  }

  const amountPaid = Number(amountPaidFromClient);
  return {
    calculatedFee,
    amountPaid: amountPaid > 0 ? amountPaid : calculatedFee,
    isCash: false,
  };
}

export async function ensureDefaultCashPaymentMethod() {
  const exists = await PaymentMethod.findOne({ type: CASH_PAYMENT_TYPE });
  if (exists) return exists;

  return PaymentMethod.create({
    name: 'Cash Payment',
    type: CASH_PAYMENT_TYPE,
    instructions:
      'Pay in cash at the reunion venue. Your registration stays pending until an admin confirms your payment.',
    isActive: true,
  });
}

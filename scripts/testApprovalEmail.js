import dotenv from 'dotenv';
import { sendApprovalConfirmationEmail } from '../services/emailService.js';

dotenv.config();

const testRegistration = {
  fullName: 'Email Test User',
  email: process.env.SMTP_USER,
  mobile: '01700000000',
  ticketId: 'M L-999',
  tshirtSize: 'L',
  gender: 'Male',
  officeType: 'CGA',
  officeName: 'CGA',
  division: 'N/A',
  district: 'N/A',
  upazila: 'N/A',
  members: [{ name: 'Test Guest', relation: 'Spouse', gender: 'Female', ageGroup: '' }],
};

async function main() {
  console.log('Testing approval email...');
  console.log('SMTP_HOST:', process.env.SMTP_HOST || '(not set)');
  console.log('SMTP_USER:', process.env.SMTP_USER || '(not set)');
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL || '(not set)');
  console.log('Sending to:', testRegistration.email);

  try {
    const result = await sendApprovalConfirmationEmail(testRegistration);
    if (result.sent) {
      console.log('SUCCESS: Email sent to', result.to);
      process.exit(0);
    }
    console.log('SKIPPED:', result.reason);
    process.exit(1);
  } catch (err) {
    console.error('FAILED:', err.message);
    if (err.response) console.error('SMTP response:', err.response);
    process.exit(1);
  }
}

main();

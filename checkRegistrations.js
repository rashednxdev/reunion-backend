import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Registration from './models/Registration.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const count = await Registration.countDocuments();
  console.log("Total registrations:", count);
  const sample = await Registration.find().limit(5);
  console.log("Sample registrations:", sample.map(s => ({
    fullName: s.fullName,
    officeType: s.officeType,
    division: s.division,
    district: s.district,
    upazila: s.upazila,
    mobile: s.mobile
  })));
  process.exit(0);
}).catch(console.error);

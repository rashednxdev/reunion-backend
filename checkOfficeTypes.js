import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OfficeType from './models/OfficeType.js';
import OfficeName from './models/OfficeName.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const types = await OfficeType.find();
  console.log("DB OfficeTypes:", types.map(t => ({ id: t._id, title: t.title, short: t.short })));
  
  const names = await OfficeName.find();
  console.log("DB OfficeNames (first 10):", names.slice(0, 10).map(n => ({ id: n._id, title: n.title, short: n.short, officeTypeKey: n.officeTypeKey })));
  
  process.exit(0);
}).catch(console.error);

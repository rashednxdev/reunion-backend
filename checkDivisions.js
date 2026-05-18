import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Division from './models/Division.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const divs = await Division.find();
  console.log("DB Divisions:", divs.map(d => ({ id: d._id, title: d.title })));
  process.exit(0);
}).catch(console.error);

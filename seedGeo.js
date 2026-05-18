import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Division from './models/Division.js';
import District from './models/District.js';
import Upazila from './models/Upazila.js';

dotenv.config();

const DIVISIONS_URL = 'https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/divisions/divisions.json';
const DISTRICTS_URL = 'https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/districts/districts.json';
const UPAZILAS_URL = 'https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/upazilas/upazilas.json';

const fetchJson = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  // Extract the data array from the PHPMyAdmin JSON export format
  return data[2].data;
};

const normalize = (str) => str.toLowerCase().replace(/[^a-z]/g, '');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const dbDivisions = await Division.find();
    if (dbDivisions.length === 0) {
      console.log('No divisions found in DB! Please add divisions first.');
      process.exit(1);
    }

    console.log('Fetching Github JSONs...');
    const ghDivisions = await fetchJson(DIVISIONS_URL);
    const ghDistricts = await fetchJson(DISTRICTS_URL);
    const ghUpazilas = await fetchJson(UPAZILAS_URL);

    console.log('Clearing existing Districts and Upazilas...');
    await District.deleteMany({});
    await Upazila.deleteMany({});

    // 1. Map Github Division ID -> DB Division ObjectId
    const divIdMap = {};
    for (const ghDiv of ghDivisions) {
      const match = dbDivisions.find(dbDiv => 
        normalize(dbDiv.title) === normalize(ghDiv.name) || 
        normalize(dbDiv.title) === 'chattogram' && normalize(ghDiv.name) === 'chattagram'
      );
      if (match) {
        divIdMap[ghDiv.id] = match._id;
      } else {
        console.warn(`Could not find DB match for division: ${ghDiv.name}`);
      }
    }

    // 2. Insert Districts
    console.log(`Inserting ${ghDistricts.length} districts...`);
    const distIdMap = {};
    const districtDocs = ghDistricts.map(ghDist => {
      const dbDivId = divIdMap[ghDist.division_id];
      if (!dbDivId) throw new Error(`Missing Division mapping for District ${ghDist.name}`);
      return {
        title: ghDist.name,
        short: ghDist.name.substring(0, 3).toUpperCase(),
        divisionId: dbDivId,
        _ghId: ghDist.id // Temporary to map upazilas
      };
    });

    const insertedDistricts = await District.insertMany(districtDocs);
    for (let i = 0; i < insertedDistricts.length; i++) {
      distIdMap[ghDistricts[i].id] = insertedDistricts[i]._id;
    }

    // 3. Insert Upazilas
    console.log(`Inserting ${ghUpazilas.length} upazilas...`);
    const upazilaDocs = ghUpazilas.map(ghUpaz => {
      const dbDistId = distIdMap[ghUpaz.district_id];
      if (!dbDistId) throw new Error(`Missing District mapping for Upazila ${ghUpaz.name}`);
      return {
        title: ghUpaz.name,
        short: ghUpaz.name.substring(0, 3).toUpperCase(),
        districtId: dbDistId
      };
    });

    await Upazila.insertMany(upazilaDocs);

    console.log('✅ Successfully seeded Districts and Upazilas!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seed();

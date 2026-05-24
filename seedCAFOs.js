import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OfficeName from './models/OfficeName.js';

dotenv.config();

const cafoList = [
  { title: "Chief Accounts and Finance Officer, Cabinet Division", short: "CAFO-Cabinet" },
  { title: "Chief Accounts and Finance Officer, Prime Minister's Office", short: "CAFO-PMO" },
  { title: "Chief Accounts and Finance Officer, Ministry of Education", short: "CAFO-Education" },
  { title: "Chief Accounts and Finance Officer, Ministry of Science and Technology", short: "CAFO-MST" },
  { title: "Chief Accounts and Finance Officer, Information and Communication Technology Division", short: "CAFO-ICT" },
  { title: "Chief Accounts and Finance Officer, Ministry of Foreign Affairs", short: "CAFO-MOFA" },
  { title: "Chief Accounts and Finance Officer, Ministry of Agriculture", short: "CAFO-Agriculture" },
  { title: "Chief Accounts and Finance Officer, Ministry of Law, Justice and Parliamentary Affairs", short: "CAFO-Law" },
  { title: "Chief Accounts and Finance Officer, Ministry of Food", short: "CAFO-Food" },
  { title: "Chief Accounts and Finance Officer, Ministry of Disaster Management and Relief", short: "CAFO-Disaster" },
  { title: "Chief Accounts and Finance Officer, Energy and Mineral Resources Division", short: "CAFO-Energy" },
  { title: "Chief Accounts and Finance Officer, Power Division", short: "CAFO-Power" },
  { title: "Chief Accounts and Finance Officer, Rural Development and Cooperatives Division", short: "CAFO-RDCD" },
  { title: "Chief Accounts and Finance Officer, Local Government Division", short: "CAFO-LGD" },
  { title: "Chief Accounts and Finance Officer, Ministry of Public Administration", short: "CAFO-MOPA" },
  { title: "Chief Accounts and Finance Officer, Ministry of Shipping", short: "CAFO-Shipping" },
  { title: "Chief Accounts and Finance Officer, Ministry of Civil Aviation and Tourism", short: "CAFO-Tourism" },
  { title: "Chief Accounts and Finance Officer, Ministry of Environment, Forest and Climate Change", short: "CAFO-Environment" },
  { title: "Chief Accounts and Finance Officer, Ministry of Housing and Public Works", short: "CAFO-Works" },
  { title: "Chief Accounts and Finance Officer, Ministry of Industries", short: "CAFO-Industries" },
  { title: "Chief Accounts and Finance Officer, Ministry of Commerce", short: "CAFO-Commerce" },
  { title: "Chief Accounts and Finance Officer, Ministry of Cultural Affairs", short: "CAFO-Culture" },
  { title: "Chief Accounts and Finance Officer, Ministry of Youth and Sports", short: "CAFO-Sports" },
  { title: "Chief Accounts and Finance Officer, Ministry of Social Welfare", short: "CAFO-Welfare" },
  { title: "Chief Accounts and Finance Officer, Ministry of Women and Children Affairs", short: "CAFO-Women" },
  { title: "Chief Accounts and Finance Officer, Ministry of Water Resources", short: "CAFO-Water" },
  { title: "Chief Accounts and Finance Officer, Ministry of Fisheries and Livestock", short: "CAFO-Fisheries" },
  { title: "Chief Accounts and Finance Officer, Ministry of Chittagong Hill Tracts Affairs", short: "CAFO-CHTA" },
  { title: "Chief Accounts and Finance Officer, Ministry of Expatriates' Welfare and Overseas Employment", short: "CAFO-Expat" },
  { title: "Chief Accounts and Finance Officer, Ministry of Liberation War Affairs", short: "CAFO-War" },
  { title: "Chief Accounts and Finance Officer, Ministry of Textiles and Jute", short: "CAFO-Jute" },
  { title: "Chief Accounts and Finance Officer, Ministry of Land", short: "CAFO-Land" },
  { title: "Chief Accounts and Finance Officer, Ministry of Information and Broadcasting", short: "CAFO-Information" },
  { title: "Chief Accounts and Finance Officer, Ministry of Religious Affairs", short: "CAFO-Religion" },
  { title: "Chief Accounts and Finance Officer, Ministry of Railways", short: "CAFO-Railways" },
  { title: "Chief Accounts and Finance Officer, Bridges Division", short: "CAFO-Bridges" },
  { title: "Chief Accounts and Finance Officer, Road Transport and Highways Division", short: "CAFO-Roads" },
  { title: "Chief Accounts and Finance Officer, Posts and Telecommunications Division", short: "CAFO-PTD" },
  { title: "Chief Accounts and Finance Officer, Supreme Court of Bangladesh", short: "CAFO-SupremeCourt" },
  { title: "Chief Accounts and Finance Officer, Bangladesh Parliament Secretariat", short: "CAFO-Parliament" },
  { title: "Chief Accounts and Finance Officer, Election Commission Secretariat", short: "CAFO-Election" },
  { title: "Chief Accounts and Finance Officer, Bangladesh Public Service Commission", short: "CAFO-BPSC" },
  { title: "Chief Accounts and Finance Officer, Pension and Fund Management", short: "CAFO-Pension" }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB.');

    // Delete existing CAFO records
    const deleteResult = await OfficeName.deleteMany({ officeTypeKey: 'CAFO' });
    console.log(`Deleted ${deleteResult.deletedCount} existing CAFO offices.`);

    // Insert new CAFO records
    const documents = cafoList.map(item => ({
      title: item.title,
      short: item.short,
      officeTypeKey: 'CAFO'
    }));

    const insertResult = await OfficeName.insertMany(documents);
    console.log(`Inserted ${insertResult.length} CAFO offices successfully!`);

    process.exit(0);
  })
  .catch(err => {
    console.error('Error seeding CAFO offices:', err);
    process.exit(1);
  });

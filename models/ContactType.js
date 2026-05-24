import mongoose from 'mongoose';

const contactEntrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    default: '',
  }
}, { _id: true }); // Enable _id for easy updates and deletions of individual contacts

const contactTypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  contacts: {
    type: [contactEntrySchema],
    default: [],
  }
}, {
  timestamps: true,
});

const ContactType = mongoose.model('ContactType', contactTypeSchema);
export default ContactType;

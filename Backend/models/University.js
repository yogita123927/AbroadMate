import mongoose from 'mongoose';
const universitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true, index: true },
  country: { type: String, required: true, index: true },
  city: { type: String, required: true },
  description: { type: String, default: '' },
  courses: { type: [String], default: [] },
  degreeLevels: { type: [String], default: ['Bachelor','Master'] },
  tuitionAmount: { type: Number, default: null, min: 0 },
  tuitionCurrency: { type: String, default: 'USD' },
  scholarshipAvailable: { type: Boolean, default: false },
  website: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  imageAttribution: { type: String, default: '' },
  dataNote: { type: String, default: 'Verify tuition and admissions details with the university.' }
}, { timestamps: true });
universitySchema.index({ name: 'text', country: 'text', city: 'text', courses: 'text' });
export default mongoose.model('University', universitySchema);

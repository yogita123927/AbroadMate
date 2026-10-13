import mongoose from 'mongoose';
const preferenceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  countries: { type: [String], default: [] },
  course: { type: String, default: 'Computer Science', trim: true },
  degreeLevel: { type: String, enum: ['Bachelor','Master','PhD'], default: 'Master' },
  budget: { type: Number, min: 0, default: 25000 },
  currency: { type: String, enum: ['USD','CAD','GBP','EUR','AUD','INR','NZD'], default: 'USD' },
  scholarshipRequired: { type: Boolean, default: false },
  intake: { type: String, default: 'Fall 2027' }
}, { timestamps: true });
export default mongoose.model('Preference', preferenceSchema);

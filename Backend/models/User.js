import mongoose from 'mongoose';
const preferenceSchema = new mongoose.Schema({
  countries: { type: [String], default: [] },
  course: { type: String, default: 'Computer Science', trim: true },
  degreeLevel: { type: String, enum: ['Bachelor','Master','PhD'], default: 'Master' },
  budget: { type: Number, min: 0, default: 25000 },
  currency: { type: String, enum: ['USD','CAD','GBP','EUR','AUD','INR','NZD'], default: 'USD' },
  scholarshipRequired: { type: Boolean, default: false },
  intake: { type: String, default: 'Fall 2027' }
}, { _id: false });
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  preferences: { type: preferenceSchema, default: () => ({}) }
}, { timestamps: true });
userSchema.set('toJSON', { transform: (_doc, ret) => { delete ret.passwordHash; delete ret.__v; return ret; } });
export default mongoose.model('User', userSchema);

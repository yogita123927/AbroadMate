import mongoose from 'mongoose';
const shortlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  university: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  status: { type: String, enum: ['Considering','Preparing','Applied','Accepted','Rejected','Withdrawn'], default: 'Considering' },
  deadline: { type: Date, default: null },
  applicationDate: { type: Date, default: null },
  notes: { type: String, default: '', maxlength: 2000 }
}, { timestamps: true });
shortlistSchema.index({ user: 1, university: 1 }, { unique: true });
export default mongoose.model('Shortlist', shortlistSchema);

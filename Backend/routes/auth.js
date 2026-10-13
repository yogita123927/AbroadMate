import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Shortlist from '../models/Shortlist.js';
import Preference from '../models/Preference.js';
import { requireAuth, cookieOptions } from '../middleware/auth.js';
const router = Router();
function publicUser(user) { return { id: user._id, name: user.name, email: user.email, preferences: user.preferences, createdAt: user.createdAt }; }
function issueCookie(res, user) {
  const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('abroadmate_token', token, cookieOptions());
}
router.post('/register', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim(); const email = String(req.body.email || '').trim().toLowerCase(); const password = String(req.body.password || '');
    if (name.length < 2 || name.length > 80) return res.status(400).json({ message: 'Name must be between 2 and 80 characters.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' });
    if (password.length < 8 || password.length > 128) return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    if (await User.exists({ email })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });
    issueCookie(res, user); res.status(201).json({ user: publicUser(user) });
  } catch (e) { next(e); }
});
router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase(); const password = String(req.body.password || '');
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Email or password is incorrect.' });
    issueCookie(res, user); res.json({ user: publicUser(user) });
  } catch (e) { next(e); }
});
router.post('/logout', (_req, res) => { res.clearCookie('abroadmate_token', { ...cookieOptions(), maxAge: undefined }); res.json({ message: 'Signed out successfully.' }); });
router.get('/me', requireAuth, async (req, res, next) => { try { const user = await User.findById(req.userId); if (!user) return res.status(401).json({ message: 'Account not found.' }); res.json({ user: publicUser(user) }); } catch (e) { next(e); } });
router.patch('/profile', requireAuth, async (req, res, next) => { try { const name = String(req.body.name || '').trim(); if (name.length < 2 || name.length > 80) return res.status(400).json({ message: 'Name must be between 2 and 80 characters.' }); const user = await User.findByIdAndUpdate(req.userId, { name }, { new: true, runValidators: true }); res.json({ user: publicUser(user) }); } catch (e) { next(e); } });
router.delete('/account', requireAuth, async (req, res, next) => { try { await Promise.all([Shortlist.deleteMany({ user: req.userId }), Preference.deleteOne({ user: req.userId }), User.deleteOne({ _id: req.userId })]); res.clearCookie('abroadmate_token', { ...cookieOptions(), maxAge: undefined }); res.json({ message: 'Account and associated saved data deleted.' }); } catch (e) { next(e); } });
export default router;

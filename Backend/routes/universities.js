import { Router } from 'express';
import mongoose from 'mongoose';
import University from '../models/University.js';
const router = Router();
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1); const limit = Math.min(24, Math.max(1, parseInt(req.query.limit, 10) || 9));
    const filter = {};
    if (req.query.country) filter.country = req.query.country;
    if (req.query.course) filter.courses = req.query.course;
    if (req.query.degreeLevel) filter.degreeLevels = req.query.degreeLevel;
    if (req.query.maxTuition !== undefined && req.query.maxTuition !== '') { const n = Number(req.query.maxTuition); if (Number.isFinite(n) && n >= 0) filter.tuitionAmount = { $lte: n }; }
    if (req.query.q) { const safe = String(req.query.q).trim().slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); if (safe) filter.$or = [{ name: new RegExp(safe, 'i') }, { country: new RegExp(safe, 'i') }, { city: new RegExp(safe, 'i') }, { courses: new RegExp(safe, 'i') }]; }
    const [items, total, countryDocs] = await Promise.all([University.find(filter).sort({ name: 1 }).skip((page-1)*limit).limit(limit).lean(), University.countDocuments(filter), University.distinct('country')]);
    res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total/limit) }, filters: { countries: countryDocs.sort() } });
  } catch (e) { next(e); }
});
router.get('/compare', async (req, res, next) => { try { const ids = String(req.query.ids || '').split(',').filter(mongoose.isValidObjectId).slice(0,4); const items = await University.find({ _id: { $in: ids } }).lean(); res.json({ items }); } catch (e) { next(e); } });
router.get('/:id', async (req, res, next) => { try { if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid university ID.' }); const university = await University.findById(req.params.id).lean(); if (!university) return res.status(404).json({ message: 'University not found.' }); res.json({ university }); } catch (e) { next(e); } });
export default router;

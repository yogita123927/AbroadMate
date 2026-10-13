import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import Preference from '../models/Preference.js';
import User from '../models/User.js';
import University from '../models/University.js';
import { recommend } from '../services/recommendationService.js';
const router=Router();router.post('/',requireAuth,async(req,res,next)=>{try{const [saved,user,universities]=await Promise.all([Preference.findOne({user:req.userId}).lean(),User.findById(req.userId).lean(),University.find({}).lean()]);const preferences=saved||user?.preferences||{};if(!preferences.course&&!preferences.countries?.length)return res.status(400).json({message:'Save your preferences before generating recommendations.'});const recommendations=recommend(universities,preferences,5);res.json({recommendations,disclaimer:'Scores represent catalogue-based preference fit, not admission probability or a guarantee of satisfaction.'});}catch(e){next(e);}});export default router;

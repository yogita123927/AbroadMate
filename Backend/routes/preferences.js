import { Router } from 'express';
import Preference from '../models/Preference.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router(); router.use(requireAuth);
const fields = ['countries','course','degreeLevel','budget','currency','scholarshipRequired','intake'];
function sanitize(body) { const out={}; for(const k of fields) if(Object.hasOwn(body,k)) out[k]=body[k]; if(out.countries!==undefined && (!Array.isArray(out.countries)||out.countries.length>20||out.countries.some(c=>typeof c!=='string'||c.length>80))) throw Object.assign(new Error('Choose valid destination countries.'),{status:400}); if(out.budget!==undefined && (!Number.isFinite(Number(out.budget))||Number(out.budget)<0||Number(out.budget)>1000000)) throw Object.assign(new Error('Budget must be between 0 and 1,000,000.'),{status:400}); if(out.budget!==undefined) out.budget=Number(out.budget); return out; }
router.get('/', async (req,res,next)=>{try{let preferences=await Preference.findOne({user:req.userId}).lean();if(!preferences){const user=await User.findById(req.userId).lean();preferences=user?.preferences||null;}res.json({preferences});}catch(e){next(e);}});
router.put('/', async (req,res,next)=>{try{const data=sanitize(req.body);const preferences=await Preference.findOneAndUpdate({user:req.userId},{$set:data,$setOnInsert:{user:req.userId}},{new:true,upsert:true,runValidators:true,setDefaultsOnInsert:true});await User.findByIdAndUpdate(req.userId,{$set:{preferences:{...preferences.toObject()}}});res.json({preferences});}catch(e){next(e);}});
export default router;

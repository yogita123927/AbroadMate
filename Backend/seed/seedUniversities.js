import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import University from '../models/University.js';
import universities from './universities.js';

function metaAttributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g)].map((match) => [match[1].toLowerCase(), match[3].replaceAll('&amp;', '&')]));
}

async function officialImageFor(website) {
  try {
    const response = await fetch(website, {
      headers: { 'user-agent': 'AbroadMateUniversityCatalog/1.0 (+official-site image metadata)' },
      signal: AbortSignal.timeout(7000)
    });
    if (!response.ok) return '';
    const html = (await response.text()).slice(0, 1_500_000);
    const tags = html.match(/<meta\b[^>]*>/gi) || [];
    for (const tag of tags) {
      const attrs = metaAttributes(tag);
      const key = (attrs.property || attrs.name || attrs.itemprop || '').toLowerCase();
      if (!['og:image', 'og:image:url', 'twitter:image', 'twitter:image:src'].includes(key)) continue;
      if (!attrs.content) continue;
      const image = new URL(attrs.content, response.url || website);
      if (image.protocol === 'https:') return image.href;
    }
    const pictures = html.match(/<img\b[^>]*>/gi) || [];
    for (const tag of pictures) {
      const attrs = metaAttributes(tag);
      const src = attrs.src || attrs['data-src'] || attrs['data-lazy-src'] || attrs.srcset?.split(',').at(-1)?.trim().split(/\s+/)[0];
      if (!src || /logo|icon|avatar|flag|pixel|badge/i.test(`${src} ${attrs.alt || ''}`) || /\.svg(?:[?#]|$)/i.test(src)) continue;
      const image = new URL(src, response.url || website);
      if (image.protocol === 'https:') return image.href;
    }
  } catch {
    // Keep the card's designed fallback when an official site blocks metadata requests.
  }
  return '';
}

try {
  await connectDB();
  for (let i = 0; i < universities.length; i += 4) {
    const batch = universities.slice(i, i + 4);
    const enriched = await Promise.all(batch.map(async (university) => ({
      ...university,
      imageUrl: (await officialImageFor(university.website)) || university.imageUrl
    })));
    for (const university of enriched) {
      await University.updateOne(
        { name: university.name },
        { $set: { ...university, imageUrl: university.imageUrl, imageAttribution: university.website } },
        { upsert: true, runValidators: true }
      );
    }
  }
  const catalogueNames = universities.map(({ name }) => name);
  const extraRecords = await University.find({ name: { $nin: catalogueNames }, website: /^https:\/\//i }).select('website').lean();
  for (let i = 0; i < extraRecords.length; i += 4) {
    const batch = extraRecords.slice(i, i + 4);
    const enriched = await Promise.all(batch.map(async (record) => ({
      ...record,
      imageUrl: await officialImageFor(record.website)
    })));
    for (const record of enriched) {
      await University.updateOne(
        { _id: record._id },
        { $set: { imageUrl: record.imageUrl, imageAttribution: record.website } }
      );
    }
  }
  console.log(`Seeded/updated ${universities.length} university records with official website links and available official images.`);
  console.log('Program, tuition, scholarship and admissions data is left unverified until confirmed on each university site.');
}
catch(error){console.error(`Seed failed: ${error.message}`);process.exitCode=1;}
finally{await mongoose.disconnect();}

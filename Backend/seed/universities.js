// Official sites are the source of truth for programs, fees, scholarships and admissions.
const rows=[
['University of Toronto','Canada','Toronto','https://www.utoronto.ca'],['University of British Columbia','Canada','Vancouver','https://www.ubc.ca'],['McGill University','Canada','Montreal','https://www.mcgill.ca'],['University of Waterloo','Canada','Waterloo','https://uwaterloo.ca'],['University of Alberta','Canada','Edmonton','https://www.ualberta.ca'],
['Massachusetts Institute of Technology','United States','Cambridge','https://www.mit.edu'],['Stanford University','United States','Stanford','https://www.stanford.edu'],['University of California, Berkeley','United States','Berkeley','https://www.berkeley.edu'],['Carnegie Mellon University','United States','Pittsburgh','https://www.cmu.edu'],['University of Illinois Urbana-Champaign','United States','Urbana','https://illinois.edu'],
['University of Oxford','United Kingdom','Oxford','https://www.ox.ac.uk'],['University of Cambridge','United Kingdom','Cambridge','https://www.cam.ac.uk'],['Imperial College London','United Kingdom','London','https://www.imperial.ac.uk'],['University College London','United Kingdom','London','https://www.ucl.ac.uk'],['University of Manchester','United Kingdom','Manchester','https://www.manchester.ac.uk'],
['Technical University of Munich','Germany','Munich','https://www.tum.de'],['Ludwig Maximilian University of Munich','Germany','Munich','https://www.lmu.de'],['RWTH Aachen University','Germany','Aachen','https://www.rwth-aachen.de'],
['University of Melbourne','Australia','Melbourne','https://www.unimelb.edu.au'],['University of Sydney','Australia','Sydney','https://www.sydney.edu.au'],['Australian National University','Australia','Canberra','https://www.anu.edu.au'],['Monash University','Australia','Melbourne','https://www.monash.edu'],
['Trinity College Dublin','Ireland','Dublin','https://www.tcd.ie'],['University College Dublin','Ireland','Dublin','https://www.ucd.ie'],['University of Amsterdam','Netherlands','Amsterdam','https://www.uva.nl'],['Delft University of Technology','Netherlands','Delft','https://www.tudelft.nl'],['ETH Zurich','Switzerland','Zurich','https://ethz.ch'],['National University of Singapore','Singapore','Singapore','https://nus.edu.sg'],['Nanyang Technological University','Singapore','Singapore','https://www.ntu.edu.sg'],['University of Auckland','New Zealand','Auckland','https://www.auckland.ac.nz']
];
const officialImageFallbacks={
  'https://www.utoronto.ca':'https://www.utoronto.ca/sites/default/files/styles/scale_image_750_width_/public/2026-09/utogether-f26-01.png?itok=__cIxnvA',
  'https://www.ox.ac.uk':'https://assets-oxweb.admin.ox.ac.uk/styles/hero_sm_288x192/s3/2026-04/UG-Exeter-Banner2-OUImages-John%20Cairns.jpg.avif?itok=4cKq1FN5',
  'https://nus.edu.sg':'https://www.nus.edu.sg/oam/images/default-source/virtual-tours/utown.png?sfvrsn=652ff404_2',
  'https://www.ualberta.ca':'https://www.ualberta.ca/en/media-library/new-brand/homepage/edmonton-north-campus.jpeg',
  'https://www.ucl.ac.uk':'https://www.ucl.ac.uk/home/sites/home/files/styles/homepage_hero_mobile/public/2026-02/200hero-wide.jpg.jpg?itok=WTFAkUIM',
  'https://www.unimelb.edu.au':'https://www.unimelb.edu.au/__data/assets/image/0011/2232020/SouthLawn_Looking-North.jpg',
  'https://www.monash.edu':'https://www.monash.edu/__data/assets/image/0004/4237654/clayton-campus-student-accomodation-holman-hall-inside-courtyard-2016.jpg',
  'https://www.ucd.ie':'https://www.ucd.ie/t4media/Mobile_Dec%204-12.jpg',
  'https://ethz.ch':'https://ethz.ch/en/campus/access/zentrum/_jcr_content/par/fullwidthimage/image.imageformat.1286.152068286.jpg'
};
export default rows.map(([name,country,city,website])=>({
  name,country,city,website,
  description:`Explore ${name} in ${city}, ${country}. Visit its official website for current programs, fees, scholarships and admissions information.`,
  courses:[],degreeLevels:[],tuitionAmount:null,tuitionCurrency:'USD',scholarshipAvailable:null,
  imageUrl:officialImageFallbacks[website]||'',imageAttribution:website,
  dataNote:'Program availability, tuition, scholarships and admissions requirements can change. Confirm details on the official university website.'
}));

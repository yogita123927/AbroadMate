export function recommend(universities, preferences, limit = 5) {
  const selectedCountries = preferences?.countries || [];
  const scored = universities
    .filter((university) => selectedCountries.length === 0 || selectedCountries.includes(university.country))
    .map((university) => ({
      university,
      score: selectedCountries.length ? 70 : 40,
      reasons: [
        selectedCountries.length ? 'Destination matches your saved preferences' : 'Explore this destination',
        'Check programs, tuition and scholarships on the official site'
      ]
    }));
  return scored.sort((a,b)=>b.score-a.score || a.university.name.localeCompare(b.university.name)).slice(0,limit);
}

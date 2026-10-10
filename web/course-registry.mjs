import c from './courses/c/manifest.mjs';
import csharp from './courses/csharp/manifest.mjs';
import french from './courses/french-a1/manifest.mjs';
import english from './courses/english-nce/manifest.mjs';
import physics from './courses/physics/manifest.mjs';
import olympiad from './courses/olympiad/manifest.mjs';

// Only trusted, bundled modules may provide a player. Save files never name code to load.
export const courses = [c, csharp, french, english, physics, olympiad];

export function getCourse(id) {
  return courses.find(course => course.id === id);
}

export function localized(value, language) {
  return value[language] ?? value.en;
}

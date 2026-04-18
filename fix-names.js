const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) { 
        results = results.concat(walk(file));
      } else { 
        if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          results.push(file);
        }
      }
    });
  } catch (e) {
    console.error('Error reading dir:', e);
  }
  return results;
}

const files = walk('./src');
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // First normalize everything to "Step Wears"
  // Turn "Step Wearss" into "Step Wears"
  content = content.replace(/Step Wearss/gi, 'Step Wears');
  
  // Turn "Step Wear" into "Step Wears" but be careful not to turn "Step Wears" into "Step Wearss"
  // Negative lookahead: only match "Step Wear" if it's NOT followed by "s", "ss", or "ing"
  content = content.replace(/Step Wear(?!s)/gi, '$&s');
  
  // The above $&s means it will append 's' to whatever case was matched (Step Wear -> Step Wears, step wear -> step wears)
  // Wait, if it matched 'Step Wears' by accident? The negative lookahead (?!s) prevents it if there is already an 's'.

  // Wait, let's just do a simpler pass to make sure no double S happens
  content = content.replace(/Step Wearss/gi, 'Step Wears'); // Just in case Step Wearss -> Step Wearss
  content = content.replace(/Step Wearsss/gi, 'Step Wears'); 

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log('Updated:', file);
  }
});

console.log('Total files updated:', changedFiles);

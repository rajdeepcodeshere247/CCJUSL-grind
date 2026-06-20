import fs from 'fs';
import path from 'path';

const teamsFile = 'd:/pqrst/Website/data/teams.ts';
const oldDir = 'd:/pqrst/Website/public/member photos';
const newDir = 'd:/pqrst/Website/public/member_photos';

if (!fs.existsSync(newDir)) {
  fs.mkdirSync(newDir, { recursive: true });
}

let content = fs.readFileSync(teamsFile, 'utf8');

const regex = /\/member photos\/([^"']+)/g;
let match;
const replacements = [];

while ((match = regex.exec(content)) !== null) {
  const originalFileName = match[1];
  
  const actualFiles = fs.readdirSync(oldDir);
  // Match filename precisely or loosely by base name
  const actualFileName = actualFiles.find(f => f === originalFileName) || 
                         actualFiles.find(f => path.basename(f, path.extname(f)).toLowerCase() === path.basename(originalFileName, path.extname(originalFileName)).toLowerCase());
  
  if (actualFileName) {
    const ext = path.extname(actualFileName).toLowerCase();
    const base = path.basename(actualFileName, path.extname(actualFileName));
    let normBase = base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const newName = `${normBase}${ext}`;
    
    fs.copyFileSync(path.join(oldDir, actualFileName), path.join(newDir, newName));
    replacements.push({
      oldStr: `/member photos/${originalFileName}`,
      newStr: `/member_photos/${newName}`
    });
  } else {
    console.log("Could not find file for:", originalFileName);
  }
}

for (const rep of replacements) {
  content = content.replace(rep.oldStr, rep.newStr);
}

fs.writeFileSync(teamsFile, content);
console.log("Updated teams.ts and copied files.");

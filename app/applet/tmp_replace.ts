import fs from 'fs';
const files = ['src/components/FeedbackEffects.tsx', 'src/components/FeedbackNotification.tsx'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/will-change-transform will-change-opacity/g, '');
  content = content.replace(/will-change-transform/g, '');
  content = content.replace(/will-change-opacity/g, '');
  content = content.replace(/className="absolute\s+"/g, 'className="absolute"');
  content = content.replace(/className="\s+"/g, 'className=""');
  fs.writeFileSync(file, content);
});
console.log('Done');

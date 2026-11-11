// Makes Arabic copies (*-ar.svg) of the graphics that contain English text.
// Run from the repo root:  node tools/build-ar-art.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const DIR = 'assets/img/aya/';
const ARABIC_FONT = "'Segoe UI', Tahoma, 'Noto Sans Arabic', Arial, sans-serif";

const files = {
   'video-cover': [['YOUTUBE · @AyaZidanPlasticSurgery', 'يوتيوب · @AyaZidanPlasticSurgery'],
                   ['Surgical techniques,', 'التقنيات الجراحية'],
                   ['explained.', 'بشرح مبسّط']],
   'faq-portrait': [['Ask Dr. Aya', 'اسألي د. آية'], ['HONEST ANSWERS · NO PRESSURE', 'إجابات صادقة · دون ضغط']],
   'tile-body': [['Body Contouring', 'نحت القوام']],
   'tile-threads': [['Thread Lifts', 'شد الوجه بالخيوط'], ['@DR.AYAZIDAN · TIKTOK', 'تيك توك · @DR.AYAZIDAN']],
   'tile-injectables': [['Injectables', 'الحقن التجميلي']],
   'tile-youtube': [['Surgery Explained', 'شرح العمليات'], ['>YOUTUBE<', '>يوتيوب<']],
   'tile-women': [["Women's Cosmetic", 'تجميل المرأة']],
   'tile-face': [['Facial Harmony', 'تناسق الوجه'], ['SNAPCHAT · @DR.AYAZIDAN', 'سناب شات · @DR.AYAZIDAN']],
};

for (const [name, pairs] of Object.entries(files)) {
   let svg = readFileSync(DIR + name + '.svg', 'utf8');
   for (const [en, ar] of pairs) {
      if (!svg.includes(en)) throw new Error(`${name}.svg: "${en}" not found`);
      svg = svg.split(en).join(ar);
   }
   svg = svg
      // Letter spacing breaks Arabic letter joining; italics don't exist in Arabic type.
      .replace(/ letter-spacing="[^"]*"/g, '')
      .replace(/ font-style="italic"/g, '')
      .replace(/font-family="[^"]*"/g, `font-family="${ARABIC_FONT}"`);
   writeFileSync(DIR + name + '-ar.svg', svg);
}
console.log('Arabic graphics written');

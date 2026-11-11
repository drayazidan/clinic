// Builds the Arabic (RTL) home page at ar/index.html from the English index.html.
//
// Run from the repo root after changing index.html:
//   node tools/build-ar.mjs
//
// Every English string below must still exist in index.html; if one has been
// edited, the script stops and names it so the translation can be updated.
// Do not edit ar/index.html by hand: it is overwritten on each build.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SITE = 'https://drayazidan.github.io/clinic/';
const AR_URL = SITE + 'ar/';

let html = readFileSync('index.html', 'utf8');
const missing = [];

// [english, arabic] — replaced everywhere they occur. Longer/more specific strings first.
const T = [
   // ---- <head> ----
   ['<html class="no-js" lang="en">', '<html class="no-js" lang="ar" dir="rtl">'],
   ['<title>Dr. Aya Zidan | Plastic &amp; Cosmetic Surgeon in Cairo, Riyadh &amp; Dammam</title>',
    '<title>د. آية زيدان | جراحة التجميل في القاهرة والرياض والدمام</title>'],
   ['content="Dr. Aya Zidan is a plastic and cosmetic surgeon in Cairo, Riyadh and Dammam with 12 years of experience in body contouring, women\'s cosmetic surgery, injectables and thread lifts."',
    'content="د. آية زيدان طبيبة جراحة تجميل في القاهرة والرياض والدمام، بخبرة 12 عامًا في نحت القوام وجراحات تجميل المرأة والحقن التجميلي وشد الوجه بالخيوط."'],
   ['<meta name="author" content="Dr. Aya Zidan">', '<meta name="author" content="د. آية زيدان">'],
   [`<link rel="canonical" href="${SITE}">`, `<link rel="canonical" href="${AR_URL}">`],
   ['<meta property="og:site_name" content="Dr. Aya Zidan">', '<meta property="og:site_name" content="د. آية زيدان">'],
   ['<meta property="og:locale" content="en_US">\n      <meta property="og:locale:alternate" content="ar_AR">',
    '<meta property="og:locale" content="ar_AR">\n      <meta property="og:locale:alternate" content="en_US">'],
   [`<meta property="og:url" content="${SITE}">`, `<meta property="og:url" content="${AR_URL}">`],
   ['content="Dr. Aya Zidan | Plastic &amp; Cosmetic Surgeon"', 'content="د. آية زيدان | جراحة التجميل"'],
   ['content="12+ years of experience in body contouring, women\'s cosmetic surgery, injectables and thread lifts. Cairo, Riyadh &amp; Dammam."',
    'content="خبرة أكثر من 12 عامًا في نحت القوام وتجميل المرأة والحقن التجميلي والخيوط. القاهرة والرياض والدمام."'],
   ['assets/img/aya/og-share.jpg', 'assets/img/aya/og-share-ar.jpg'],
   ['content="Dr. Aya Zidan, plastic and cosmetic surgeon in Cairo, Riyadh and Dammam"',
    'content="د. آية زيدان، طبيبة جراحة التجميل في القاهرة والرياض والدمام"'],
   [`"url": "${SITE}",`, `"url": "${AR_URL}",\n         "inLanguage": "ar",`],

   // ---- header / menu ----
   ['<a class="aya-lang" href="ar/" lang="ar" hreflang="ar">العربية</a>',
    '<a class="aya-lang" href="../" lang="en" hreflang="en">English</a>'],
   ['Plastic &amp; Cosmetic Surgeon &middot; Cairo, Riyadh &amp; Dammam', 'جراحة التجميل &middot; القاهرة والرياض والدمام'],
   ['>Treatments</a>', '>العلاجات</a>'],
   ['>Results</a>', '>النتائج</a>'],
   ['<a href="#videos">Videos</a>', '<a href="#videos">الفيديوهات</a>'],
   ['<a href="#faq">FAQ</a>', '<a href="#faq">الأسئلة الشائعة</a>'],
   ['>Contact</a>', '>تواصل</a>'],
   ['Book via Instagram', 'الحجز عبر إنستغرام'],
   ['fa-chevron-right', 'fa-chevron-left'],
   ['alt="logo"', 'alt="د. آية زيدان"'],
   ['<span>we are here</span>', '<span>أماكن تواجدنا</span>'],
   ['<p>Cairo, Egypt <br> Riyadh &amp; Dammam, Saudi Arabia</p>', '<p>القاهرة، مصر <br> الرياض والدمام، السعودية</p>'],
   ['aria-label="Instagram"', 'aria-label="إنستغرام"'],
   ['aria-label="TikTok"', 'aria-label="تيك توك"'],
   ['aria-label="YouTube"', 'aria-label="يوتيوب"'],
   ['aria-label="Snapchat"', 'aria-label="سناب شات"'],
   ['aria-label="Threads"', 'aria-label="ثريدز"'],
   ['aria-label="Facebook"', 'aria-label="فيسبوك"'],

   // ---- hero ----
   ['Dr. Aya Zidan <br /> Plastic Surgeon', 'د. آية زيدان <br /> جراحة التجميل'],
   ['<span>12+ Years of Experience</span>', '<span>خبرة أكثر من 12 عامًا</span>'],
   ["Body contouring, women's cosmetic surgery, injectables and thread lifts, in Cairo, Riyadh and Dammam.",
    'نحت القوام، وجراحات تجميل المرأة، والحقن التجميلي، وشد الوجه بالخيوط، في القاهرة والرياض والدمام.'],
   ['alt="Dr. Aya Zidan"', 'alt="د. آية زيدان"'],
   ['aria-label="Book a consultation via Instagram"', 'aria-label="احجزي استشارة عبر إنستغرام"'],
   ['assets/img/banner/banner-3/banner-3-shape-1.png', 'assets/img/aya/badge-consult-ar.svg'],

   // ---- treatments ----
   ['What Dr. Aya Treats', 'تخصصات د. آية'],
   ['alt="Body contouring"', 'alt="نحت القوام"'],
   ['alt="Women\'s cosmetic surgery"', 'alt="جراحات تجميل المرأة"'],
   ['alt="Injectables and thread lifts"', 'alt="الحقن التجميلي والخيوط"'],
   ['href="service-details.html"', 'href="#services"'],
   ['Liposculpture, fat transfer and skin tightening to restore shape after weight loss, pregnancy or time.',
    'شفط الدهون ونحتها، وحقن الدهون الذاتية، وشد الجلد لاستعادة تناسق الجسم بعد فقدان الوزن أو الحمل أو مع التقدم في العمر.'],
   ['Breast lift and augmentation with implants or your own fat, planned around your body and goals.',
    'رفع الثدي وتكبيره بالحشوات أو بالدهون الذاتية، بخطة تناسب جسمك وأهدافك.'],
   ['Fillers, fat injection and thread lifts for natural facial lifting, with no or minimal downtime.',
    'الفيلر وحقن الدهون وشد الوجه بالخيوط لرفع طبيعي للوجه، دون فترة نقاهة أو بفترة قصيرة جدًا.'],
   ["Women's Cosmetic Surgery", 'جراحات تجميل المرأة'],
   ['Injectables &amp; Threads', 'الحقن التجميلي والخيوط'],
   ['Body Contouring', 'نحت القوام'],

   // ---- counters ----
   ['<p>Years of Experience</p>', '<p>سنوات الخبرة</p>'],
   ['<p>Cities: Cairo, Riyadh, Dammam</p>', '<p>مدن: القاهرة، الرياض، الدمام</p>'],
   ['<p>Instagram Followers</p>', '<p>متابع على إنستغرام</p>'],
   ['<p>Educational Posts</p>', '<p>منشور توعوي</p>'],

   // ---- steps + video ----
   ['<h2 class="tpsection-title">Natural <span>', '<h2 class="tpsection-title">نتائج <span>'],
   ['</span> Results, Honest Advice</h2>', '</span> طبيعية ونصيحة صادقة</h2>'],
   ['assets/img/aya/video-cover.svg', 'assets/img/aya/video-cover-ar.svg'],
   ['alt="Dr. Aya Zidan explains surgical techniques on YouTube"', 'alt="د. آية زيدان تشرح التقنيات الجراحية على يوتيوب"'],
   ['aria-label="Play video: breast augmentation with fat or implants"', 'aria-label="تشغيل الفيديو: تكبير الثدي بالدهون أو بالحشوات"'],
   ['Understand Your Options', 'تعرّفي على خياراتك'],
   ["Watch Dr. Aya's free videos to learn what each procedure can and can't do before you decide.",
    'شاهدي فيديوهات د. آية المجانية لتعرفي ما يمكن لكل إجراء أن يحققه وما لا يمكنه، قبل أن تتخذي قرارك.'],
   ['Book a Consultation', 'احجزي استشارتك'],
   ['Meet Dr. Aya in Cairo, Riyadh or Dammam for an honest assessment and a plan made for you.',
    'قابلي د. آية في القاهرة أو الرياض أو الدمام لتقييم صادق وخطة مصممة لكِ.'],
   ['Treatment &amp; Follow-Up', 'العلاج والمتابعة'],
   ['Your procedure is done safely, and Dr. Aya follows up with you through recovery.',
    'يُجرى الإجراء بأمان، وتتابع د. آية حالتك حتى التعافي.'],

   // ---- results ----
   ['alt="Before (top) and after (bottom) photo of a real patient of Dr. Aya Zidan"',
    'alt="صورة قبل (أعلى) وبعد (أسفل) لمريضة حقيقية لدى د. آية زيدان"'],
   ['aya-tag-before">Before</span>', 'aya-tag-before">قبل</span>'],
   ['aya-tag-after">After</span>', 'aya-tag-after">بعد</span>'],
   ['<span class="aya-eyebrow">Real results</span>', '<span class="aya-eyebrow">نتائج حقيقية</span>'],
   ['Subtle Changes That Still Look Like You', 'تغييرات بسيطة تحافظ على ملامحك'],
   ["Dr. Aya's approach is simple: change only what bothers you, and keep your features natural. Every plan starts with an honest consultation about what's realistic for your face and body.",
    'نهج د. آية بسيط: تغيير ما يزعجك فقط، مع الحفاظ على ملامحك الطبيعية. تبدأ كل خطة باستشارة صادقة حول ما هو واقعي لوجهك وجسمك.'],
   ["Master's degree in plastic &amp; cosmetic surgery", 'ماجستير في جراحة التجميل'],
   ['12 years of surgical and aesthetic experience', '12 عامًا من الخبرة الجراحية والتجميلية'],
   ['Clinics in Cairo, Riyadh and Dammam', 'عيادات في القاهرة والرياض والدمام'],
   ['Free medical education on YouTube, Instagram &amp; TikTok', 'محتوى طبي توعوي مجاني على يوتيوب وإنستغرام وتيك توك'],
   ['See More Results on Instagram', 'شاهدي المزيد من النتائج على إنستغرام'],
   ["Results vary from person to person. Photos are shared from Dr. Aya's own practice.",
    'تختلف النتائج من شخص لآخر. الصور من عيادة د. آية.'],

   // ---- shorts (titles follow her own Arabic video titles) ----
   ['<span class="aya-eyebrow">Learn with Dr. Aya</span>', '<span class="aya-eyebrow">تعلّمي مع د. آية</span>'],
   ['Short Answers to Big Questions', 'إجابات قصيرة لأسئلة كبيرة'],
   ['&nbsp; Watch on YouTube', '&nbsp; شاهدي على يوتيوب'],
   ['Breast augmentation: your own fat or silicone implants?', 'تكبير الثدي بالدهون أو بحشوات السيليكون؟'],
   ['Face sagging after weight loss or with age? The fix', 'ترهّل الوجه بعد خسارة الوزن أو مع الزمن… ما الحل؟'],
   ['Filler or fat injection: which one is right for you?', 'فيلر أم حقن دهون؟ أيهما يناسبك؟'],
   ['Cellulite or loose skin? How to tell, and what helps', 'سيلوليت أم ترهّل؟ كيف تفرّقين بينهما وما الحل؟'],
   ['Why fat transfer results can change after a few months', 'لماذا قد تتغير نتيجة حقن الدهون بعد بضعة أشهر؟'],
   ['Sagging breasts: do you need a lift?', 'ترهّل الثدي: هل تحتاجين إلى رفع؟'],
   ['Videos are in Arabic.', 'فيديوهات قصيرة من قناة د. آية على يوتيوب.'],

   // ---- FAQ ----
   ['Questions Patients Ask', 'أسئلة شائعة'],
   ['Where can I see Dr. Aya for a consultation?', 'أين يمكنني مقابلة د. آية للاستشارة؟'],
   ['Dr. Aya consults in Cairo, Egypt, and in Riyadh and Dammam, Saudi Arabia. Send a message on Instagram to ask about dates and book your visit.',
    'تستقبل د. آية الاستشارات في القاهرة بمصر، وفي الرياض والدمام بالسعودية. أرسلي رسالة على إنستغرام للسؤال عن المواعيد وحجز زيارتك.'],
   ['Fat transfer or implants for breast augmentation?', 'تكبير الثدي: بالدهون أم بالحشوات؟'],
   ['Fat transfer uses your own fat for a modest, natural-feeling increase. Implants give more volume and a more predictable size. The right choice depends on your body and the result you want, which Dr. Aya discusses with you at your consultation.',
    'حقن الدهون يستخدم دهونك الذاتية لزيادة معتدلة بملمس طبيعي، أما الحشوات فتمنح حجمًا أكبر ومقاسًا أدق. الاختيار المناسب يعتمد على جسمك والنتيجة التي تريدينها، وتناقشه معكِ د. آية خلال الاستشارة.'],
   ['Should I choose filler or fat injection for my face?', 'فيلر أم حقن دهون للوجه؟'],
   ['Filler is quick, needs almost no downtime and wears off over time. Fat injection uses your own tissue and can last longer, but involves a small procedure to collect the fat. Dr. Aya will recommend what suits your face and lifestyle.',
    'الفيلر سريع ولا يحتاج تقريبًا إلى فترة نقاهة، ويزول تدريجيًا مع الوقت. أما حقن الدهون فيستخدم أنسجتك الذاتية وقد يدوم لفترة أطول، لكنه يتطلب إجراءً بسيطًا لسحب الدهون. ستنصحك د. آية بما يناسب وجهك ونمط حياتك.'],
   ['Why can fat transfer results change after a few months?', 'لماذا قد تتغير نتيجة حقن الدهون بعد بضعة أشهر؟'],
   ['Part of the transferred fat is naturally absorbed by the body in the first months, so the final result is judged after healing settles. Good technique and aftercare help more of the fat survive.',
    'يمتص الجسم جزءًا من الدهون المحقونة بشكل طبيعي خلال الأشهر الأولى، لذلك يُقيَّم الشكل النهائي بعد استقرار التعافي. التقنية الجيدة والعناية بعد الإجراء تساعدان على بقاء نسبة أكبر من الدهون.'],
   ['This information is for general education and does not replace a medical consultation.',
    'هذه المعلومات للتثقيف العام ولا تغني عن الاستشارة الطبية.'],
   ['assets/img/aya/faq-portrait.svg', 'assets/img/aya/faq-portrait-ar.svg'],
   ['alt="Ask Dr. Aya: honest answers, no pressure"', 'alt="اسألي د. آية: إجابات صادقة دون ضغط"'],

   // ---- social ----
   ['Latest From Instagram &amp; TikTok', 'أحدث المنشورات على إنستغرام وتيك توك'],
   ['View this reel on Instagram', 'شاهدي هذا الريل على إنستغرام'],
   ['@dr.ayazidan on TikTok', '@dr.ayazidan على تيك توك'],
   ['aria-label="Dr. Aya Zidan on social media"', 'aria-label="د. آية زيدان على وسائل التواصل" data-splide=\'{"direction":"rtl"}\''],
   ['<div class="brand-slide-active splide pb-50">', '<div class="brand-slide-active splide pb-50" data-splide=\'{"direction":"rtl"}\'>'],
   ['tile-body.svg" alt="Body contouring on Instagram"', 'tile-body-ar.svg" alt="نحت القوام على إنستغرام"'],
   ['tile-threads.svg" alt="Thread lifts on TikTok"', 'tile-threads-ar.svg" alt="شد الوجه بالخيوط على تيك توك"'],
   ['tile-injectables.svg" alt="Injectables on Instagram"', 'tile-injectables-ar.svg" alt="الحقن التجميلي على إنستغرام"'],
   ['tile-youtube.svg" alt="Surgery explained on YouTube"', 'tile-youtube-ar.svg" alt="شرح العمليات على يوتيوب"'],
   ['tile-women.svg" alt="Women\'s cosmetic surgery on Instagram"', 'tile-women-ar.svg" alt="تجميل المرأة على إنستغرام"'],
   ['tile-face.svg" alt="Facial harmony on Snapchat"', 'tile-face-ar.svg" alt="تناسق الوجه على سناب شات"'],
   ['Have a question? Message Dr. Aya on Instagram', 'لديكِ سؤال؟ راسلي د. آية على إنستغرام'],

   // ---- footer ----
   ["Plastic &amp; cosmetic surgeon with 12 years of experience in body contouring, women's cosmetic surgery, injectables and thread lifts.",
    'طبيبة جراحة تجميل بخبرة 12 عامًا في نحت القوام وجراحات تجميل المرأة والحقن التجميلي وشد الوجه بالخيوط.'],
   ['Cairo, Egypt &middot; Riyadh &amp; Dammam, Saudi Arabia', 'القاهرة، مصر &middot; الرياض والدمام، السعودية'],
   ['Message on Instagram', 'راسلينا على إنستغرام'],
   ['<span class="footer-title">Services</span>', '<span class="footer-title">الخدمات</span>'],
   ['Breast Lift &amp; Augmentation', 'رفع الثدي وتكبيره'],
   ['<a href="#services">Fat Transfer</a>', '<a href="#services">حقن الدهون</a>'],
   ['Fillers &amp; Fat Injection', 'الفيلر وحقن الدهون'],
   ['<a href="#services">Thread Lifts</a>', '<a href="#services">شد الوجه بالخيوط</a>'],
   ['<span class="footer-title">Useful Links</span>', '<span class="footer-title">روابط مفيدة</span>'],
   ['<a href="#results">Real Results</a>', '<a href="#results">نتائج حقيقية</a>'],
   ['<a href="#social">Social Media</a>', '<a href="#social">وسائل التواصل</a>'],
   ['>All Links</a>', '>جميع الروابط</a>'],
   ['<span class="footer-title">Latest Videos</span>', '<span class="footer-title">أحدث الفيديوهات</span>'],
   ['Breast augmentation: <br> fat or implants?', 'تكبير الثدي: <br> بالدهون أم بالحشوات؟'],
   ['Face sagging after <br> weight loss? The fix', 'ترهّل الوجه بعد <br> خسارة الوزن؟ الحل'],
   ['21 Feb, 2024', '21 فبراير 2024'],
   ['8 Feb, 2024', '8 فبراير 2024'],
   ['Copyright © 2026 Dr. Aya Zidan. All rights reserved. Content is for medical education and does not replace an in-person consultation.',
    '© 2026 د. آية زيدان. جميع الحقوق محفوظة. المحتوى للتثقيف الطبي ولا يغني عن الاستشارة الطبية المباشرة.'],

   // ---- Arabic fonts + RTL stylesheet ----
   ['<link rel="stylesheet" href="assets/css/bootstrap.css">',
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;500;600&family=Tajawal:wght@400;500;700&display=swap">\n      <link rel="stylesheet" href="assets/css/bootstrap-rtl.css">'],
   ['<link rel="stylesheet" href="assets/css/aya.css">',
    '<link rel="stylesheet" href="assets/css/aya.css">\n      <link rel="stylesheet" href="assets/css/aya-rtl.css">'],
];

for (const [en, ar] of T) {
   if (!html.includes(en)) { missing.push(en); continue; }
   html = html.split(en).join(ar);
}

// The Arabic page lives one folder down: point local files back to the root.
html = html
   .replace(/(src|href)="assets\//g, '$1="../assets/')
   .replace(/href="site\.webmanifest"/g, 'href="../site.webmanifest"')
   .replace(/href="index\.html"/g, 'href="./"');

if (missing.length) {
   console.error('These English strings were not found in index.html. Update tools/build-ar.mjs:\n');
   for (const m of missing) console.error('  - ' + m.slice(0, 120));
   process.exit(1);
}

// Fail if obvious English copy slipped through (ignores brand names, URLs and code).
const leftovers = html
   .replace(/<script[\s\S]*?<\/script>/g, '')
   .replace(/<svg[\s\S]*?<\/svg>/g, '')
   .replace(/<!--[\s\S]*?-->/g, '')
   .replace(/<[^>]+>/g, '\n')
   .split('\n')
   .map(s => s.replace(/&\w+;/g, ' ').replace(/@[\w.]+/g, ' ').trim())
   .filter(s => /[A-Za-z]{4,}/.test(s) && s !== 'English');
if (leftovers.length) {
   console.error('Untranslated text left on the Arabic page:\n');
   for (const l of leftovers) console.error('  - ' + l.slice(0, 120));
   process.exit(1);
}

mkdirSync('ar', { recursive: true });
writeFileSync('ar/index.html', html);
console.log('ar/index.html built (' + T.length + ' strings translated)');

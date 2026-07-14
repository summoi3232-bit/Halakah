/* ===== حلقة — منطق التطبيق ===== */

const SURAHS = ["الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس",
"هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه",
"الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم",
"لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر",
"فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق",
"الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة",
"الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج",
"نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس",
"التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد",
"الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات",
"القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر",
"المسد","الإخلاص","الفلق","الناس"];

// عدد آيات كل سورة برواية ورش عن نافع (العدّ المدني الأخير المعتمد في مصحف مجمع الملك فهد لطباعة المصحف الشريف برواية ورش)
// الترتيب مطابق لمصفوفة SURAHS أعلاه (من الفاتحة إلى الناس) — الإجمالي 6214 آية
const AYAH_COUNTS = [
  7,285,200,175,122,167,206,76,130,109,
  121,111,44,54,99,128,110,105,99,134,
  111,76,119,62,77,226,95,88,69,59,
  33,30,73,54,46,82,182,86,72,84,
  53,50,89,56,36,34,39,29,18,45,
  60,47,61,55,77,99,28,21,24,13,
  14,11,11,18,12,12,31,52,52,44,
  30,28,18,55,39,31,50,40,45,42,
  29,19,36,25,22,17,19,26,32,20,
  15,21,11,8,8,20,5,8,9,11,
  10,8,3,9,5,5,6,3,6,3,
  5,4,5,6
];

function ayahCountForSurah(surahName){
  const idx = SURAHS.indexOf(surahName);
  return idx>=0 ? AYAH_COUNTS[idx] : 286;
}
function ayahOptions(surahName, selected){
  const max = ayahCountForSurah(surahName);
  let opts = "";
  const sel = String(selected||"1");
  for(let i=1;i<=max;i++){
    opts += `<option value="${i}" ${String(i)===sel?'selected':''}>${i}</option>`;
  }
  return opts;
}
function getByPath(path){
  const parts = path.split(".");
  let o = sessionDraft;
  for(const p of parts) o = o[p];
  return o;
}
function updSurahRange(prefix, which, value){
  const o = getByPath(prefix);
  o["surah"+which] = value;
  o["ayah"+which] = 1;
  render();
}

// ===================== الأربعون النووية =====================
// نص متن الأربعين النووية (٤٢ حديثًا) كما هو مستقر في أشهر طبعاته المعتمدة على أصول الإمام النووي
const HADITH40 = [
  {n:1, narrator:"عن أمير المؤمنين أبي حفص عمر بن الخطاب رضي الله عنه", text:"قال: سمعت رسول الله صلى الله عليه وسلم يقول: «إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى، فمن كانت هجرته إلى الله ورسوله فهجرته إلى الله ورسوله، ومن كانت هجرته لدنيا يصيبها أو امرأة ينكحها فهجرته إلى ما هاجر إليه».", takhrij:"رواه البخاري ومسلم"},
  {n:2, narrator:"عن عمر بن الخطاب رضي الله عنه", text:"قال: بينما نحن جلوس عند رسول الله صلى الله عليه وسلم ذات يوم، إذ طلع علينا رجل شديد بياض الثياب، شديد سواد الشعر، لا يرى عليه أثر السفر ولا يعرفه منا أحد، حتى جلس إلى النبي صلى الله عليه وسلم، فأسند ركبتيه إلى ركبتيه، ووضع كفيه على فخذيه، وقال: يا محمد أخبرني عن الإسلام. فقال رسول الله صلى الله عليه وسلم: «الإسلام أن تشهد أن لا إله إلا الله وأن محمدًا رسول الله، وتقيم الصلاة، وتؤتي الزكاة، وتصوم رمضان، وتحج البيت إن استطعت إليه سبيلًا»... ثم سأله عن الإيمان والإحسان وأمارات الساعة، ثم انطلق، فقال النبي صلى الله عليه وسلم: «هذا جبريل أتاكم يعلمكم دينكم».", takhrij:"رواه مسلم"},
  {n:3, narrator:"عن أبي عبد الرحمن عبد الله بن عمر بن الخطاب رضي الله عنهما", text:"قال: سمعت رسول الله صلى الله عليه وسلم يقول: «بُني الإسلام على خمس: شهادة أن لا إله إلا الله وأن محمدًا رسول الله، وإقام الصلاة، وإيتاء الزكاة، وحج البيت، وصوم رمضان».", takhrij:"رواه البخاري ومسلم"},
  {n:4, narrator:"عن أبي عبد الرحمن عبد الله بن مسعود رضي الله عنه", text:"قال: حدثنا رسول الله صلى الله عليه وسلم، وهو الصادق المصدوق: «إن أحدكم يجمع خلقه في بطن أمه أربعين يومًا نطفة، ثم يكون علقة مثل ذلك، ثم يكون مضغة مثل ذلك، ثم يرسل إليه الملك فينفخ فيه الروح، ويؤمر بأربع كلمات: بكتب رزقه، وأجله، وعمله، وشقي أو سعيد...».", takhrij:"رواه البخاري ومسلم"},
  {n:5, narrator:"عن أم المؤمنين أم عبد الله عائشة رضي الله عنها", text:"قالت: قال رسول الله صلى الله عليه وسلم: «من أحدث في أمرنا هذا ما ليس منه فهو رد». وفي رواية لمسلم: «من عمل عملًا ليس عليه أمرنا فهو رد».", takhrij:"رواه البخاري ومسلم"},
  {n:6, narrator:"عن أبي عبد الله النعمان بن بشير رضي الله عنهما", text:"قال: سمعت رسول الله صلى الله عليه وسلم يقول: «إن الحلال بيّن وإن الحرام بيّن، وبينهما أمور مشتبهات لا يعلمهن كثير من الناس، فمن اتقى الشبهات فقد استبرأ لدينه وعرضه، ومن وقع في الشبهات وقع في الحرام... ألا وإن لكل ملك حمى، ألا وإن حمى الله محارمه، ألا وإن في الجسد مضغة إذا صلحت صلح الجسد كله، وإذا فسدت فسد الجسد كله، ألا وهي القلب».", takhrij:"رواه البخاري ومسلم"},
  {n:7, narrator:"عن أبي رقية تميم بن أوس الداري رضي الله عنه", text:"أن النبي صلى الله عليه وسلم قال: «الدين النصيحة». قلنا: لمن؟ قال: «لله، ولكتابه، ولرسوله، ولأئمة المسلمين وعامتهم».", takhrij:"رواه مسلم"},
  {n:8, narrator:"عن ابن عمر رضي الله عنهما", text:"أن رسول الله صلى الله عليه وسلم قال: «أُمرت أن أقاتل الناس حتى يشهدوا أن لا إله إلا الله وأن محمدًا رسول الله، ويقيموا الصلاة، ويؤتوا الزكاة، فإذا فعلوا ذلك عصموا مني دماءهم وأموالهم إلا بحق الإسلام، وحسابهم على الله تعالى».", takhrij:"رواه البخاري ومسلم"},
  {n:9, narrator:"عن أبي هريرة عبد الرحمن بن صخر رضي الله عنه", text:"قال: سمعت رسول الله صلى الله عليه وسلم يقول: «ما نهيتكم عنه فاجتنبوه، وما أمرتكم به فأتوا منه ما استطعتم؛ فإنما أهلك الذين من قبلكم كثرة مسائلهم واختلافهم على أنبيائهم».", takhrij:"رواه البخاري ومسلم"},
  {n:10, narrator:"عن أبي هريرة رضي الله عنه", text:"قال: قال رسول الله صلى الله عليه وسلم: «إن الله تعالى طيب لا يقبل إلا طيبًا، وإن الله أمر المؤمنين بما أمر به المرسلين، فقال: {يَا أَيُّهَا الرُّسُلُ كُلُوا مِنَ الطَّيِّبَاتِ وَاعْمَلُوا صَالِحًا}، وقال: {يَا أَيُّهَا الَّذِينَ آمَنُوا كُلُوا مِنْ طَيِّبَاتِ مَا رَزَقْنَاكُمْ}. ثم ذكر الرجل يطيل السفر أشعث أغبر، يمد يديه إلى السماء: يا رب، يا رب! ومطعمه حرام، ومشربه حرام، وملبسه حرام، وغذي بالحرام، فأنى يستجاب لذلك؟».", takhrij:"رواه مسلم"},
  {n:11, narrator:"عن أبي محمد الحسن بن علي بن أبي طالب رضي الله عنهما سبط رسول الله صلى الله عليه وسلم وريحانته", text:"قال: حفظت من رسول الله صلى الله عليه وسلم: «دع ما يريبك إلى ما لا يريبك».", takhrij:"رواه الترمذي والنسائي، وقال الترمذي: حديث حسن صحيح"},
  {n:12, narrator:"عن أبي هريرة رضي الله عنه", text:"قال: قال رسول الله صلى الله عليه وسلم: «من حسن إسلام المرء تركه ما لا يعنيه».", takhrij:"حديث حسن، رواه الترمذي وغيره"},
  {n:13, narrator:"عن أبي حمزة أنس بن مالك رضي الله عنه خادم رسول الله صلى الله عليه وسلم", text:"عن النبي صلى الله عليه وسلم قال: «لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه».", takhrij:"رواه البخاري ومسلم"},
  {n:14, narrator:"عن ابن مسعود رضي الله عنه", text:"قال: قال رسول الله صلى الله عليه وسلم: «لا يحل دم امرئ مسلم يشهد أن لا إله إلا الله وأني رسول الله إلا بإحدى ثلاث: الثيب الزاني، والنفس بالنفس، والتارك لدينه المفارق للجماعة».", takhrij:"رواه البخاري ومسلم"},
  {n:15, narrator:"عن أبي هريرة رضي الله عنه", text:"أن رسول الله صلى الله عليه وسلم قال: «من كان يؤمن بالله واليوم الآخر فليقل خيرًا أو ليصمت، ومن كان يؤمن بالله واليوم الآخر فليكرم جاره، ومن كان يؤمن بالله واليوم الآخر فليكرم ضيفه».", takhrij:"رواه البخاري ومسلم"},
  {n:16, narrator:"عن أبي هريرة رضي الله عنه", text:"أن رجلًا قال للنبي صلى الله عليه وسلم: أوصني. قال: «لا تغضب». فردد مرارًا، قال: «لا تغضب».", takhrij:"رواه البخاري"},
  {n:17, narrator:"عن أبي يعلى شداد بن أوس رضي الله عنه", text:"عن رسول الله صلى الله عليه وسلم قال: «إن الله كتب الإحسان على كل شيء، فإذا قتلتم فأحسنوا القتلة، وإذا ذبحتم فأحسنوا الذبح، وليحد أحدكم شفرته، وليرح ذبيحته».", takhrij:"رواه مسلم"},
  {n:18, narrator:"عن أبي ذر جندب بن جنادة، وأبي عبد الرحمن معاذ بن جبل رضي الله عنهما", text:"عن رسول الله صلى الله عليه وسلم قال: «اتق الله حيثما كنت، وأتبع السيئة الحسنة تمحها، وخالق الناس بخلق حسن».", takhrij:"رواه الترمذي وقال: حديث حسن، وفي بعض النسخ: حسن صحيح"},
  {n:19, narrator:"عن أبي العباس عبد الله بن عباس رضي الله عنهما", text:"قال: كنت خلف النبي صلى الله عليه وسلم يومًا فقال: «يا غلام إني أعلمك كلمات: احفظ الله يحفظك، احفظ الله تجده تجاهك، إذا سألت فاسأل الله، وإذا استعنت فاستعن بالله، واعلم أن الأمة لو اجتمعت على أن ينفعوك بشيء لم ينفعوك إلا بشيء قد كتبه الله لك، وإن اجتمعوا على أن يضروك بشيء لم يضروك إلا بشيء قد كتبه الله عليك، رفعت الأقلام وجفت الصحف».", takhrij:"رواه الترمذي وقال: حديث حسن صحيح"},
  {n:20, narrator:"عن أبي مسعود عقبة بن عمرو الأنصاري البدري رضي الله عنه", text:"قال: قال النبي صلى الله عليه وسلم: «إن مما أدرك الناس من كلام النبوة الأولى: إذا لم تستحِ فاصنع ما شئت».", takhrij:"رواه البخاري"},
  {n:21, narrator:"عن أبي عمرو، وقيل أبي عمرة سفيان بن عبد الله رضي الله عنه", text:"قال: قلت: يا رسول الله، قل لي في الإسلام قولًا لا أسأل عنه أحدًا غيرك. قال: «قل: آمنت بالله، ثم استقم».", takhrij:"رواه مسلم"},
  {n:22, narrator:"عن أبي عبد الله جابر بن عبد الله الأنصاري رضي الله عنهما", text:"أن رجلًا سأل رسول الله صلى الله عليه وسلم: أرأيت إذا صليت المكتوبات، وصمت رمضان، وأحللت الحلال، وحرمت الحرام، ولم أزد على ذلك شيئًا، أأدخل الجنة؟ قال: «نعم».", takhrij:"رواه مسلم"},
  {n:23, narrator:"عن أبي مالك الحارث بن عاصم الأشعري رضي الله عنه", text:"قال: قال رسول الله صلى الله عليه وسلم: «الطهور شطر الإيمان، والحمد لله تملأ الميزان، وسبحان الله والحمد لله تملآن -أو: تملأ- ما بين السماوات والأرض، والصلاة نور، والصدقة برهان، والصبر ضياء، والقرآن حجة لك أو عليك، كل الناس يغدو، فبائع نفسه فمعتقها أو موبقها».", takhrij:"رواه مسلم"},
  {n:24, narrator:"عن أبي ذر رضي الله عنه", text:"عن النبي صلى الله عليه وسلم فيما روى عن الله تبارك وتعالى أنه قال: «يا عبادي إني حرمت الظلم على نفسي وجعلته بينكم محرمًا فلا تظالموا... يا عبادي إنما هي أعمالكم أحصيها لكم ثم أوفيكم إياها، فمن وجد خيرًا فليحمد الله، ومن وجد غير ذلك فلا يلومن إلا نفسه».", takhrij:"رواه مسلم"},
  {n:25, narrator:"عن أبي ذر رضي الله عنه", text:"أن ناسًا من أصحاب النبي صلى الله عليه وسلم قالوا للنبي صلى الله عليه وسلم: يا رسول الله، ذهب أهل الدثور بالأجور... فقال: «أوليس قد جعل الله لكم ما تصدقون؟ إن بكل تسبيحة صدقة، وكل تكبيرة صدقة، وكل تحميدة صدقة، وكل تهليلة صدقة، وأمر بالمعروف صدقة، ونهي عن منكر صدقة، وفي بضع أحدكم صدقة».", takhrij:"رواه مسلم"},
  {n:26, narrator:"عن أبي هريرة رضي الله عنه", text:"عن النبي صلى الله عليه وسلم قال: «كل سلامى من الناس عليه صدقة، كل يوم تطلع فيه الشمس: تعدل بين اثنين صدقة، وتعين الرجل في دابته فتحمله عليها أو ترفع له عليها متاعه صدقة، والكلمة الطيبة صدقة، وبكل خطوة تمشيها إلى الصلاة صدقة، وتميط الأذى عن الطريق صدقة».", takhrij:"رواه البخاري ومسلم"},
  {n:27, narrator:"عن النواس بن سمعان رضي الله عنه", text:"عن النبي صلى الله عليه وسلم قال: «البر حسن الخلق، والإثم ما حاك في صدرك وكرهت أن يطلع عليه الناس».", takhrij:"رواه مسلم"},
  {n:28, narrator:"عن أبي نجيح العرباض بن سارية رضي الله عنه", text:"قال: وعظنا رسول الله صلى الله عليه وسلم موعظة وجلت منها القلوب وذرفت منها العيون، فقلنا: يا رسول الله كأن هذه موعظة مودع فأوصنا. قال: «أوصيكم بتقوى الله والسمع والطاعة وإن تأمر عليكم عبد، فإنه من يعش منكم فسيرى اختلافًا كثيرًا، فعليكم بسنتي وسنة الخلفاء الراشدين المهديين، عضوا عليها بالنواجذ، وإياكم ومحدثات الأمور فإن كل بدعة ضلالة».", takhrij:"رواه أبو داود والترمذي وقال: حديث حسن صحيح"},
  {n:29, narrator:"عن معاذ بن جبل رضي الله عنه", text:"قال: قلت: يا رسول الله أخبرني بعمل يدخلني الجنة ويباعدني من النار. قال: «رأس الأمر الإسلام، وعموده الصلاة، وذروة سنامه الجهاد في سبيل الله»، ثم قال: «ألا أخبرك بملاك ذلك كله؟» قلت: بلى يا رسول الله. فأخذ بلسانه وقال: «كف عليك هذا». قلت: يا نبي الله وإنا لمؤاخذون بما نتكلم به؟ فقال: «ثكلتك أمك، وهل يكب الناس في النار على وجوههم -أو على مناخرهم- إلا حصائد ألسنتهم».", takhrij:"رواه الترمذي وقال: حديث حسن صحيح"},
  {n:30, narrator:"عن أبي ثعلبة الخشني رضي الله عنه", text:"عن رسول الله صلى الله عليه وسلم قال: «إن الله تعالى فرض فرائض فلا تضيعوها، وحد حدودًا فلا تعتدوها، وحرم أشياء فلا تنتهكوها، وسكت عن أشياء رحمة لكم غير نسيان فلا تبحثوا عنها».", takhrij:"حديث حسن رواه الدارقطني وغيره"},
  {n:31, narrator:"عن أبي العباس سهل بن سعد الساعدي رضي الله عنه", text:"قال: جاء رجل إلى النبي صلى الله عليه وسلم فقال: يا رسول الله، دلني على عمل إذا عملته أحبني الله وأحبني الناس. فقال: «ازهد في الدنيا يحبك الله، وازهد فيما عند الناس يحبك الناس».", takhrij:"حديث حسن رواه ابن ماجه وغيره"},
  {n:32, narrator:"عن أبي سعيد سعد بن مالك بن سنان الخدري رضي الله عنه", text:"أن رسول الله صلى الله عليه وسلم قال: «لا ضرر ولا ضرار».", takhrij:"حديث حسن رواه ابن ماجه والدارقطني وغيرهما"},
  {n:33, narrator:"عن ابن عباس رضي الله عنهما", text:"أن رسول الله صلى الله عليه وسلم قال: «لو يعطى الناس بدعواهم لادعى رجال أموال قوم ودماءهم، لكن البينة على المدعي واليمين على من أنكر».", takhrij:"حديث حسن رواه البيهقي وغيره"},
  {n:34, narrator:"عن أبي سعيد الخدري رضي الله عنه", text:"قال: سمعت رسول الله صلى الله عليه وسلم يقول: «من رأى منكم منكرًا فليغيره بيده، فإن لم يستطع فبلسانه، فإن لم يستطع فبقلبه، وذلك أضعف الإيمان».", takhrij:"رواه مسلم"},
  {n:35, narrator:"عن أبي هريرة رضي الله عنه", text:"قال: قال رسول الله صلى الله عليه وسلم: «لا تحاسدوا، ولا تناجشوا، ولا تباغضوا، ولا تدابروا، ولا يبع بعضكم على بيع بعض، وكونوا عباد الله إخوانًا، المسلم أخو المسلم، لا يظلمه، ولا يخذله، ولا يكذبه، ولا يحقره... التقوى هاهنا -ويشير إلى صدره ثلاث مرات- بحسب امرئ من الشر أن يحقر أخاه المسلم، كل المسلم على المسلم حرام: دمه وماله وعرضه».", takhrij:"رواه مسلم"},
  {n:36, narrator:"عن أبي هريرة رضي الله عنه", text:"عن النبي صلى الله عليه وسلم قال: «من نفس عن مؤمن كربة من كرب الدنيا نفس الله عنه كربة من كرب يوم القيامة، ومن يسر على معسر يسر الله عليه في الدنيا والآخرة، ومن ستر مسلمًا ستره الله في الدنيا والآخرة، والله في عون العبد ما كان العبد في عون أخيه...».", takhrij:"رواه مسلم"},
  {n:37, narrator:"عن ابن عباس رضي الله عنهما", text:"عن رسول الله صلى الله عليه وسلم فيما يرويه عن ربه تبارك وتعالى قال: «إن الله كتب الحسنات والسيئات، ثم بين ذلك: فمن هم بحسنة فلم يعملها كتبها الله له عنده حسنة كاملة، فإن هم بها فعملها كتبها الله له عشر حسنات... ومن هم بسيئة فلم يعملها كتبها الله له عنده حسنة كاملة، فإن هم بها فعملها كتبها الله سيئة واحدة».", takhrij:"رواه البخاري ومسلم"},
  {n:38, narrator:"عن أبي هريرة رضي الله عنه", text:"عن النبي صلى الله عليه وسلم قال: «إن الله قال: من عادى لي وليًا فقد آذنته بالحرب، وما تقرب إلي عبدي بشيء أحب إلي مما افترضته عليه، ولا يزال عبدي يتقرب إلي بالنوافل حتى أحبه، فإذا أحببته كنت سمعه الذي يسمع به، وبصره الذي يبصر به، ويده التي يبطش بها، ورجله التي يمشي بها، وإن سألني لأعطينه، ولئن استعاذني لأعيذنه».", takhrij:"رواه البخاري"},
  {n:39, narrator:"عن ابن عباس رضي الله عنهما", text:"أن رسول الله صلى الله عليه وسلم قال: «إن الله تجاوز لي عن أمتي الخطأ والنسيان وما استكرهوا عليه».", takhrij:"حديث حسن رواه ابن ماجه والبيهقي وغيرهما"},
  {n:40, narrator:"عن ابن عمر رضي الله عنهما", text:"قال: أخذ رسول الله صلى الله عليه وسلم بمنكبي فقال: «كن في الدنيا كأنك غريب أو عابر سبيل». وكان ابن عمر يقول: إذا أمسيت فلا تنتظر الصباح، وإذا أصبحت فلا تنتظر المساء، وخذ من صحتك لمرضك، ومن حياتك لموتك.", takhrij:"رواه البخاري"},
  {n:41, narrator:"عن أبي محمد عبد الله بن عمرو بن العاص رضي الله عنهما", text:"قال: قال رسول الله صلى الله عليه وسلم: «لا يؤمن أحدكم حتى يكون هواه تبعًا لما جئت به».", takhrij:"حديث حسن صحيح، رويناه في كتاب الحجة بإسناد صحيح"},
  {n:42, narrator:"عن أنس بن مالك رضي الله عنه", text:"قال: سمعت رسول الله صلى الله عليه وسلم يقول: قال الله تعالى: «يا ابن آدم، إنك ما دعوتني ورجوتني غفرت لك على ما كان منك ولا أبالي، يا ابن آدم لو بلغت ذنوبك عنان السماء ثم استغفرتني غفرت لك، يا ابن آدم إنك لو أتيتني بقراب الأرض خطايا ثم لقيتني لا تشرك بي شيئًا لأتيتك بقرابها مغفرة».", takhrij:"رواه الترمذي وقال: حديث حسن صحيح"}
];
function hadithByNumber(n){ return HADITH40.find(h=>h.n===Number(n)) || HADITH40[0]; }

// ===================== الأذكار (أبواب الأذكار مع دليل كل ذكر) =====================
// منسوخة حرفيًا من كتاب "مختصر الأذكار والآداب" - المستوى الأول
// جمع وترتيب: د. عبدالمحسن بن محمد القاسم، إمام وخطيب المسجد النبوي الشريف
// رقم الباب [n] هو ترقيم الشيخ نفسه داخل "قسم الأذكار" من الكتاب.
// ملاحظة: الأبواب [1]-[4] و[21] فما بعدها لم تُدرج بعد (بانتظار صور الصفحات المتبقية من المستخدم).
const ADHKAR = [
  {n:5, bab:"دخول الخلاء", dhikr:"كان النبي ﷺ إذا دخل الخلاء قال: «اللهم إني أعوذ بك من الخبث والخبائث».", daleel:"متفق عليه. (الخُبث: ذكران الشياطين، والخبائث: إناثهم)."},
  {n:6, bab:"الخروج من الخلاء", dhikr:"كان النبي ﷺ إذا خرج من الغائط قال: «غفرانك».", daleel:"رواه أحمد. (أي: اللهم اغفر لي)."},
  {n:7, bab:"إذا فرغ من الوضوء", dhikr:"قال النبي ﷺ: «ما منكم من أحد يتوضأ، فيبلغ - أو: فيسبغ - الوضوء، ثم يقول: أشهد أن لا إله إلا الله، وأن محمدًا عبد الله ورسوله. إلا فُتحت له أبواب الجنة الثمانية، يدخل من أيها شاء».", daleel:"رواه مسلم."},
  {n:8, bab:"الأذان", dhikr:"قال النبي ﷺ: «إذا سمعتم المؤذن؛ فقولوا مثل ما يقول، ثم صلّوا عليّ».", daleel:"رواه مسلم."},
  {n:9, bab:"دخول المسجد والخروج منه", dhikr:"قال النبي ﷺ: «إذا دخل أحدكم المسجد فليقل: اللهم افتح لي أبواب رحمتك. وإذا خرج فليقل: اللهم إني أسألك من فضلك».", daleel:"رواه مسلم."},
  {n:10, bab:"دعاء الاستفتاح", dhikr:"كان عمر بن الخطاب رضي الله عنه إذا استفتح الصلاة قال: «سبحانك اللهم وبحمدك، وتبارك اسمك، وتعالى جدُّك، ولا إله غيرك».", daleel:"رواه مسلم والدارقطني."},
  {n:11, bab:"الركوع", dhikr:"كان النبي ﷺ يقول في ركوعه: «سبحان ربي العظيم».", daleel:"رواه مسلم."},
  {n:12, bab:"الرفع من الركوع", dhikr:"رفع النبي ﷺ رأسه من الركعة وقال: «سمع الله لمن حمده». فقال رجل وراءه: ربنا ولك الحمد، حمدًا كثيرًا، طيبًا، مباركًا فيه. فلما انصرف قال: «من المتكلم؟» قال: أنا. قال: «رأيت بضعة وثلاثين ملَكًا يبتدرونها، أيهم يكتبها أول».", daleel:"رواه البخاري."},
  {n:13, bab:"السجود", dhikr:"كان النبي ﷺ يقول في سجوده: «سبحان ربي الأعلى».", daleel:"رواه مسلم."},
  {n:14, bab:"التشهد", dhikr:"قال النبي ﷺ: «قولوا: التحيات لله، والصلوات، والطيبات. السلام عليك أيها النبي ورحمة الله وبركاته. السلام علينا وعلى عباد الله الصالحين. أشهد أن لا إله إلا الله، وأشهد أن محمدًا عبده ورسوله». وقال ﷺ: «قولوا: اللهم صلِّ على محمد وعلى آل محمد، كما صليت على إبراهيم وعلى آل إبراهيم؛ إنك حميد مجيد. اللهم بارك على محمد وعلى آل محمد، كما باركت على إبراهيم وعلى آل إبراهيم؛ إنك حميد مجيد».", daleel:"متفق عليه."},
  {n:15, bab:"الدعاء قبل السلام", dhikr:"قال النبي ﷺ: «إذا تشهد أحدكم؛ فليستعذ بالله من أربع، يقول: اللهم إني أعوذ بك من عذاب جهنم، ومن عذاب القبر، ومن فتنة المحيا والممات، ومن شر فتنة المسيح الدجال».", daleel:"رواه مسلم."},
  {n:16, bab:"الأذكار بعد السلام", dhikr:"كان النبي ﷺ إذا انصرف من صلاته استغفر ثلاثًا، وقال: «اللهم أنت السلام، ومنك السلام، تباركت يا ذا الجلال والإكرام». وقال ﷺ: «من سبّح الله في دبر كل صلاة ثلاثًا وثلاثين، وحمد الله ثلاثًا وثلاثين، وكبّر الله ثلاثًا وثلاثين، فتلك تسعة وتسعون، وقال تمام المئة: لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير؛ غُفرت خطاياه، وإن كانت مثل زبد البحر». وقال ﷺ: «من قرأ آية الكرسي في دبر كل صلاة مكتوبة؛ لم يمنعه من دخول الجنة إلا أن يموت». وعن عقبة بن عامر رضي الله عنه قال: «أمرني رسول الله ﷺ أن أقرأ بالمعوذات دبر كل صلاة».", daleel:"رواه مسلم، والنسائي في السنن الكبرى، وأحمد."},
  {n:17, bab:"من أحسّ بوجع", dhikr:"كان النبي ﷺ إذا اشتكى يقرأ على نفسه بالمعوذات، وينفث.", daleel:"متفق عليه. (النفث: النفخ مع ريق يسير)."},
  {n:18, bab:"الدعاء للمريض عند عيادته", dhikr:"كان النبي ﷺ إذا دخل على مريض يعوده قال له: «لا بأس، طَهور إن شاء الله».", daleel:"رواه البخاري. (أي: المرض مطهِّر لذنوبك)."},
  {n:19, bab:"إذا أصيب بمصيبة", dhikr:"قال النبي ﷺ: «وإن أصابك شيء، فلا تقل: لو أني فعلت؛ كان كذا وكذا. ولكن قل: قدر الله، وما شاء فعل؛ فإن لو تفتح عمل الشيطان». وقال ﷺ: «ما من عبد تصيبه مصيبة، فيقول: إنا لله وإنا إليه راجعون. اللهم أْجرني في مصيبتي، وأخلف لي خيرًا منها. إلا أجره الله في مصيبته، وأخلف له خيرًا منها».", daleel:"رواه مسلم."},
  {n:20, bab:"ما يقال للمسافر عند الوداع", dhikr:"كان النبي ﷺ إذا ودّع أحدًا قال له: «أستودع الله دينك، وأمانتك، وخواتيم عملك».", daleel:"رواه أحمد."},
  {n:21, bab:"دعاء السفر", dhikr:"كان النبي ﷺ إذا استوى على بعيره خارجًا إلى سفر: كبّر (ثلاثًا)، ثم قال: ﴿سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ * وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ﴾. اللهم إنا نسألك في سفرنا هذا البرَّ والتقوى، ومن العمل ما ترضى. اللهم هوّن علينا سفرنا هذا، واطوِ عنّا بُعده. اللهم أنت الصاحب في السفر، والخليفة في الأهل. اللهم إني أعوذ بك من وعثاء السفر، وكآبة المنظر، وسوء المنقلب في المال والأهل. وإذا رجع قالهن، وزاد فيهن: آيبون، تائبون، عابدون، لربنا حامدون.", daleel:"رواه مسلم."},
  {n:22, bab:"دخول البيت", dhikr:"قال النبي ﷺ: «إذا دخل الرجل بيته، فذكر الله عند دخوله وعند طعامه، قال الشيطان (لأعوانه): لا مبيت لكم، ولا عشاء».", daleel:"رواه مسلم."},
  {n:23, bab:"لبس الثوب الجديد", dhikr:"كان النبي ﷺ إذا استجدَّ ثوبًا، سمّاه باسمه - عمامة، أو قميصًا، أو رداءً -، ثم يقول: «اللهم لك الحمد أنت كسوتَنِيه، أسألك خيره وخير ما صُنع له، وأعوذ بك من شرِّه وشرِّ ما صُنع له».", daleel:"رواه الترمذي."},
  {n:24, bab:"التسمية أول الطعام", dhikr:"قال النبي ﷺ: «إذا أكل أحدكم طعامًا فليقل: باسم الله. فإن نسي في أوّله فليقل: باسم الله في أوّله وآخره».", daleel:"رواه الترمذي."},
  {n:25, bab:"الحمد عند الفراغ من الطعام", dhikr:"كان النبي ﷺ إذا رفع مائدته قال: «الحمد لله كثيرًا طيبًا مباركًا فيه، غير مكفيٍّ، ولا مودَّع، ولا مستغنى عنه ربَّنا».", daleel:"رواه البخاري."},
  {n:26, bab:"الدعاء إذا أكل عند أحد", dhikr:"أكل النبي ﷺ عند رجل وشرب، فلما فرغ قال: «اللهم بارك لهم فيما رزقتهم، واغفر لهم، وارحمهم».", daleel:"رواه مسلم."},
  {n:27, bab:"إذا أقبل الليل", dhikr:"قال النبي ﷺ: «الآيتان من آخر سورة البقرة، من قرأهما في ليلة كفتاه».", daleel:"متفق عليه."},
  {n:28, bab:"أذكار النوم", dhikr:"عن أبي هريرة رضي الله عنه في قصته مع الشيطان أنه قال له: «إذا أويت إلى فراشك فاقرأ آية الكرسي: ﴿اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ﴾ حتى تختم الآية؛ فإنه لن يزال عليك من الله حافظ، ولا يقربك شيطان حتى تصبح». فقال النبي ﷺ: «أما إنه كذوب، وقد صدقك». وكان النبي ﷺ إذا أخذ مضجعه من الليل؛ جمع كفّيه، ثم نفث فيهما، فقرأ فيهما: ﴿قُلْ هُوَ اللَّهُ أَحَدٌ﴾، و﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ﴾، و﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ﴾، ثم يمسح بهما ما استطاع من جسده، يبدأ بهما على رأسه ووجهه وما أقبل من جسده، يفعل ذلك ثلاث مرات. وكان إذا أخذ مضجعه من الليل؛ وضع يده تحت خدّه، ثم يقول: «اللهم باسمك أموت وأحيا».", daleel:"رواه النسائي في السنن الكبرى، والبخاري."},
  {n:29, bab:"الاستيقاظ من النوم (عنوان الباب بحاجة لتأكيد من صفحة ٥٤)", dhikr:"كان النبي ﷺ إذا استيقظ من نومه قال: «الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور».", daleel:"رواه البخاري."},
  {n:30, bab:"أذكار الصباح والمساء", dhikr:"قال النبي ﷺ: «قُلْ هُوَ اللَّهُ أَحَدٌ، والمعوذتين، حين تمسي وحين تصبح - ثلاث مرات -؛ تكفيك من كل شيء». وقال ﷺ: «من قال إذا أمسى - ثلاث مرات -: أعوذ بكلمات الله التامّات من شرّ ما خلق؛ لم تضرّه حُمَةٌ تلك الليلة». وقال ﷺ: «ما من عبد يقول في صباح كل يوم ومساء كل ليلة: باسم الله الذي لا يضرّ مع اسمه شيء في الأرض ولا في السماء، وهو السميع العليم - ثلاث مرات -؛ لم يضرّه شيء». وقال ﷺ: «سيّد الاستغفار أن تقول: اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شرّ ما صنعت، أبوء لك بنعمتك عليّ، وأبوء لك بذنبي فاغفر لي؛ فإنه لا يغفر الذنوب إلا أنت. ومن قالها من النهار موقنًا بها، فمات من يومه قبل أن يمسي؛ فهو من أهل الجنة. ومن قالها من الليل وهو موقن بها، فمات قبل أن يصبح؛ فهو من أهل الجنة».", daleel:"رواه أبو داود، وأحمد، والترمذي، والبخاري."},
  {n:31, bab:"التسبيح والتحميد", dhikr:"قال النبي ﷺ: «من قال: سبحان الله وبحمده، في يوم مئة مرة؛ حُطّت خطاياه، وإن كانت مثل زبد البحر». وقال ﷺ: «كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن: سبحان الله وبحمده، سبحان الله العظيم».", daleel:"متفق عليه."},
  {n:32, bab:"التهليل", dhikr:"قال النبي ﷺ: «من قال: لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير، في يوم مئة مرة؛ كانت له عدل عشر رقاب، وكُتبت له مئة حسنة، ومُحيت عنه مئة سيئة، وكانت له حرزًا من الشيطان يومه ذلك حتى يمسي، ولم يأت أحد بأفضل مما جاء به؛ إلا رجل عمل أكثر من ذلك».", daleel:"متفق عليه."},
  {n:33, bab:"الحوقلة", dhikr:"قال النبي ﷺ: «ألا أدلّك على كلمة هي كنز من كنوز الجنة؟! لا حول ولا قوة إلا بالله».", daleel:"متفق عليه."},
];
function adhkarByBab(babName){ return ADHKAR.find(a=>a.bab===babName) || ADHKAR[0]; }

const TAJWEED_DETAILS = [
  {key:"makharij", label:"نقص في المخارج والصفات"},
  {key:"ikhtilas", label:"اختلاس في الحركات"},
  {key:"mudud", label:"نقص في المدود"},
  {key:"ghunnah", label:"نقص في الغنة"},
  {key:"nunSakinah", label:"أحكام النون الساكنة والتنوين"},
  {key:"mimSakinah", label:"أحكام الميم الساكنة"},
];

const DB_KEY = "halaqa_db_v1";

function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
function todayStr(){ return new Date().toISOString().slice(0,10); }

function loadDB(){
  try{
    const raw = localStorage.getItem(DB_KEY);
    if(!raw) return {students:[], sessions:[], groups:[], activeStudent:null};
    const db = JSON.parse(raw);
    if(!db.groups) db.groups = [];
    return db;
  }catch(e){ return {students:[], sessions:[], groups:[], activeStudent:null}; }
}
function saveDB(){
  localStorage.setItem(DB_KEY, JSON.stringify(DB));
  autoBackupPing();
}
let DB = loadDB();

// ---- نسخة احتياطية تلقائية دورية في localStorage (طبقة إضافية) ----
function autoBackupPing(){
  localStorage.setItem(DB_KEY+"_backup_"+ (new Date().getDay()), JSON.stringify(DB));
}

function toast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>t.classList.remove("show"), 2200);
}

// ===================== الطلاب =====================
function addStudent(name, age, level, birthDate, birthPlace, groupId){
  const s = {id:uid(), name, age, level, birthDate, birthPlace, groupId: groupId||null, createdAt: todayStr()};
  DB.students.push(s);
  DB.activeStudent = s.id;
  saveDB();
  return s;
}
function updateStudent(id, patch){
  const s = DB.students.find(s=>s.id===id);
  if(!s) return;
  Object.assign(s, patch);
  saveDB();
}
function deleteStudent(id){
  DB.students = DB.students.filter(s=>s.id!==id);
  DB.sessions = DB.sessions.filter(s=>s.studentId!==id);
  if(DB.activeStudent===id) DB.activeStudent = DB.students[0]?.id || null;
  saveDB();
}
function activeStudent(){
  return DB.students.find(s=>s.id===DB.activeStudent) || null;
}
function studentSessions(id){
  return DB.sessions.filter(s=>s.studentId===id).sort((a,b)=> a.date < b.date ? 1 : -1);
}

// ===================== الأفواج =====================
function addGroup(name){
  const g = {id:uid(), name};
  DB.groups.push(g);
  saveDB();
  return g;
}
function updateGroup(id, name){
  const g = DB.groups.find(g=>g.id===id);
  if(!g) return;
  g.name = name;
  saveDB();
}
function deleteGroup(id){
  DB.groups = DB.groups.filter(g=>g.id!==id);
  DB.students.forEach(s=>{ if(s.groupId===id) s.groupId = null; });
  saveDB();
}
function groupName(id){
  if(!id) return "بدون فوج";
  const g = DB.groups.find(g=>g.id===id);
  return g ? g.name : "بدون فوج";
}

// ===================== الجلسات =====================
function surahRangeLabel(o){
  if(!o || !o.surahFrom) return "—";
  const a = `${o.surahFrom} (${o.ayahFrom||'?'})`;
  const b = (o.surahTo && o.surahTo!==o.surahFrom) ? ` إلى ${o.surahTo} (${o.ayahTo||'?'})` : (o.ayahTo? ` - ${o.ayahTo}`:'');
  return a+b;
}

function evalChip(val, kind){
  if(!val) return '<span class="chip chip-mid">—</span>';
  const map = {
    "جيد":"chip-good", "جيدة":"chip-good",
    "متوسط":"chip-mid", "متوسطة":"chip-mid",
    "ضعيف":"chip-bad", "ضعيفة":"chip-bad", "يعاد":"chip-bad", "يحتاج إعادة":"chip-bad", "يحتاج إلى إعادة":"chip-bad"
  };
  return `<span class="chip ${map[val]||'chip-mid'}">${val}</span>`;
}

// ===================== التصدير / الاستيراد =====================
function exportBackup(){
  const blob = new Blob([JSON.stringify(DB, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const d = new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");
  a.href = url; a.download = `halaqa-backup-${d}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast("تم تنزيل النسخة الاحتياطية");
}
function importBackup(file){
  const reader = new FileReader();
  reader.onload = (e)=>{
    try{
      const data = JSON.parse(e.target.result);
      if(!data.students || !data.sessions) throw new Error("bad file");
      DB = data;
      saveDB();
      toast("تم استرجاع النسخة الاحتياطية بنجاح");
      render();
    }catch(err){
      toast("تعذّرت قراءة الملف، تأكد أنه نسخة احتياطية صحيحة");
    }
  };
  reader.readAsText(file);
}

// ===================== الإحصائيات =====================
function computeStats(studentId, range){
  const sess = studentSessions(studentId);
  const now = new Date();
  let from = new Date(0);
  if(range==="week"){ from = new Date(now); from.setDate(now.getDate()-7); }
  if(range==="month"){ from = new Date(now); from.setMonth(now.getMonth()-1); }
  if(range==="day"){ from = new Date(now); from.setHours(0,0,0,0); }
  const filtered = sess.filter(s=> new Date(s.date) >= from);

  const evalCount = {hifz:{}, murajaa:{}, talawah:{}, arbaeen:{}, adhkar:{}};
  let present=0, absent=0, late=0;
  filtered.forEach(s=>{
    if(s.attendance==="حاضر") present++;
    else if(s.attendance==="غائب") absent++;
    else if(s.attendance==="متأخر") late++;
    if(s.hifz?.evaluation) evalCount.hifz[s.hifz.evaluation] = (evalCount.hifz[s.hifz.evaluation]||0)+1;
    if(s.murajaa?.qareeb?.evaluation) evalCount.murajaa[s.murajaa.qareeb.evaluation] = (evalCount.murajaa[s.murajaa.qareeb.evaluation]||0)+1;
    if(s.murajaa?.baeed?.evaluation) evalCount.murajaa[s.murajaa.baeed.evaluation] = (evalCount.murajaa[s.murajaa.baeed.evaluation]||0)+1;
    if(s.talawah?.evaluation) evalCount.talawah[s.talawah.evaluation] = (evalCount.talawah[s.talawah.evaluation]||0)+1;
    if(s.arbaeen?.evaluation) evalCount.arbaeen[s.arbaeen.evaluation] = (evalCount.arbaeen[s.arbaeen.evaluation]||0)+1;
    if(s.adhkar?.evaluation) evalCount.adhkar[s.adhkar.evaluation] = (evalCount.adhkar[s.adhkar.evaluation]||0)+1;
  });
  return {count:filtered.length, present, absent, late, evalCount, sessions:filtered};
}

// ===================== العرض (Rendering) =====================
let currentView = "dashboard";
let sessionDraft = null; // كائن الجلسة قيد التسجيل
let sessionTab = "hifz";

function switchView(v){
  currentView = v;
  document.querySelectorAll(".nav-btn").forEach(b=> b.classList.toggle("active", b.dataset.view===v));
  render();
}

function el(html){
  const d = document.createElement("div");
  d.innerHTML = html.trim();
  return d.firstChild;
}

function surahOptions(selected){
  return SURAHS.map(s=>`<option value="${s}" ${s===selected?'selected':''}>${s}</option>`).join('');
}

function render(){
  const root = document.getElementById("view-root");
  const student = activeStudent();
  document.getElementById("student-select").innerHTML =
    DB.students.map(s=>`<option value="${s.id}" ${s.id===DB.activeStudent?'selected':''}>${s.name}</option>`).join('')
    || `<option>لا يوجد متعلمون</option>`;
  document.getElementById("avatar-letter").textContent = student? student.name.trim()[0] : "؟";

  if(!student && currentView!=="students" && currentView!=="groups" && currentView!=="backup"){
    root.innerHTML = `<div class="card empty"><div class="big">📖</div>
      <h3>لا يوجد متعلم بعد</h3>
      <p>أضف أول متعلم في الحلقة للبدء بتسجيل الحفظ والمراجعة والتلاوة.</p>
      <button class="btn btn-primary" onclick="switchView('students')">إضافة متعلم</button>
      </div>`;
    return;
  }

  if(currentView==="dashboard") return renderDashboard(root, student);
  if(currentView==="students") return renderStudents(root);
  if(currentView==="groups") return renderGroups(root);
  if(currentView==="session") return renderSession(root, student);
  if(currentView==="history") return renderHistory(root, student);
  if(currentView==="reports") return renderReports(root, student);
  if(currentView==="stats") return renderStats(root, student);
  if(currentView==="backup") return renderBackup(root);
}

// ---------- لوحة المتابعة ----------
function renderDashboard(root, student){
  const sess = studentSessions(student.id);
  const last = sess[0];
  const st7 = computeStats(student.id, "week");
  root.innerHTML = `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <h3 style="margin:0"><span class="dot"></span> بطاقة المتعلم</h3>
        <button class="btn btn-sm btn-gold no-print" onclick="editingStudentId='${student.id}'; switchView('students')">✎ تعديل البيانات</button>
      </div>
      <div class="grid g3">
        <div><label>الاسم</label><div>${student.name}</div></div>
        <div><label>السن</label><div>${student.age||'—'}</div></div>
        <div><label>المستوى الدراسي</label><div>${student.level||'—'}</div></div>
        <div><label>الفوج</label><div>${groupName(student.groupId)}</div></div>
        <div><label>تاريخ الميلاد</label><div>${student.birthDate||'—'}</div></div>
        <div><label>مكان الميلاد</label><div>${student.birthPlace||'—'}</div></div>
        <div><label>تاريخ الالتحاق</label><div>${student.createdAt}</div></div>
      </div>
    </div>

    <div class="grid g4">
      <div class="card stat-card"><div class="stat-num">${sess.length}</div><div class="stat-lbl">مجموع الجلسات</div></div>
      <div class="card stat-card"><div class="stat-num">${st7.present}</div><div class="stat-lbl">حضور آخر ٧ أيام</div></div>
      <div class="card stat-card"><div class="stat-num">${st7.absent}</div><div class="stat-lbl">غياب آخر ٧ أيام</div></div>
      <div class="card stat-card"><div class="stat-num">${last? last.date : '—'}</div><div class="stat-lbl">آخر جلسة</div></div>
    </div>

    <div class="card">
      <h3><span class="dot"></span> آخر جلسة مسجّلة</h3>
      ${ last ? renderSessionSummary(last) : `<div class="empty">لا توجد جلسات مسجّلة بعد.</div>` }
    </div>

    <button class="btn btn-primary" onclick="startNewSession()">+ تسجيل جلسة اليوم</button>
  `;
}

function trackBadges(s){
  const items = [];
  if(s.hifz) items.push(['الحفظ','var(--good)']);
  if(s.murajaa && (s.murajaa.qareeb?.surahFrom || s.murajaa.baeed?.surahFrom || s.murajaa.qareeb?.evaluation || s.murajaa.baeed?.evaluation)) items.push(['المراجعة','var(--gold)']);
  if(s.talawahNazariyyah) items.push(['التلاوة النظرية','var(--palm)']);
  if(s.talawah) items.push(['التلاوة','var(--bad)']);
  if(s.arbaeen) items.push(['الأربعون النووية','#8a5a44']);
  if(s.adhkar) items.push(['الأذكار','#5a7a8a']);
  if(!items.length) return '';
  return `<div style="margin-bottom:10px">${items.map(([l,c])=>`<span class="chip" style="background:${c}22;color:${c};margin-left:6px">${l}</span>`).join('')}</div>`;
}

function renderSessionSummary(s){
  return `
    ${trackBadges(s)}
    <div class="grid g2">
      <div><span class="subhead"><span class="dot"></span>الحفظ</span>
        ${s.hifz?.surahFrom? `<p>${surahRangeLabel(s.hifz)} ${evalChip(s.hifz.evaluation)}</p><p class="small-note">الدرس القادم: ${s.hifz.next?.surahFrom? surahRangeLabel(s.hifz.next) : '—'}</p>` : '<p class="small-note">لم يسجَّل</p>'}
      </div>
      <div><span class="subhead"><span class="dot"></span>المراجعة</span>
        ${s.murajaa?.qareeb?.surahFrom? `<p>قريب: ${surahRangeLabel(s.murajaa.qareeb)} ${evalChip(s.murajaa.qareeb.evaluation)}</p>`:''}
        ${s.murajaa?.baeed?.surahFrom? `<p>بعيد: ${surahRangeLabel(s.murajaa.baeed)} ${evalChip(s.murajaa.baeed.evaluation)}</p>`:''}
        ${(!s.murajaa?.qareeb?.surahFrom && !s.murajaa?.baeed?.surahFrom) ? '<p class="small-note">لم يسجَّل</p>':''}
      </div>
      <div><span class="subhead"><span class="dot"></span>التلاوة النظرية</span>
        ${s.talawahNazariyyah?.matn ? `<p>${s.talawahNazariyyah.matn} — الأبيات ${s.talawahNazariyyah.baytFrom||'?'} إلى ${s.talawahNazariyyah.baytTo||'?'}</p><p class="small-note">${s.talawahNazariyyah.tajweedNoteTitle||''}</p>` : '<p class="small-note">لم يسجَّل</p>'}
      </div>
      <div><span class="subhead"><span class="dot"></span>التلاوة</span>
        ${s.talawah?.surahFrom? `<p>${surahRangeLabel(s.talawah)} ${evalChip(s.talawah.evaluation)}</p>`:'<p class="small-note">لم يسجَّل</p>'}
      </div>
      <div><span class="subhead"><span class="dot"></span>الأربعون النووية</span>
        ${s.arbaeen?.number? `<p>الحديث ${s.arbaeen.number} ${evalChip(s.arbaeen.evaluation)}</p><p class="small-note">القادم: ${s.arbaeen.next?.number? 'الحديث '+s.arbaeen.next.number : '—'}</p>` : '<p class="small-note">لم يسجَّل</p>'}
      </div>
      <div><span class="subhead"><span class="dot"></span>الأذكار</span>
        ${s.adhkar?.bab? `<p>${s.adhkar.bab} ${evalChip(s.adhkar.evaluation)}</p><p class="small-note">القادم: ${s.adhkar.next?.bab||'—'}</p>` : '<p class="small-note">لم يسجَّل</p>'}
      </div>
    </div>
    <div class="small-note">الحضور: ${s.attendance||'—'} · التاريخ: ${s.date}</div>
  `;
}

// ---------- المتعلمون ----------
let editingStudentId = null;

function renderStudents(root){
  const editing = editingStudentId ? DB.students.find(s=>s.id===editingStudentId) : null;
  root.innerHTML = `
    <div class="card">
      <h3><span class="dot"></span> ${editing? 'تعديل بيانات المتعلم: '+editing.name : 'إضافة متعلم جديد'}</h3>
      <div class="grid g3">
        <div class="field"><label>الاسم الكامل</label><input id="ns-name" placeholder="مثال: عبد الله محمد" value="${editing?.name||''}"></div>
        <div class="field"><label>السن</label><input id="ns-age" type="number" min="3" max="90" value="${editing?.age||''}"></div>
        <div class="field"><label>المستوى الدراسي</label><input id="ns-level" placeholder="مثال: السنة الثالثة ابتدائي" value="${editing?.level||''}"></div>
        <div class="field"><label>تاريخ الميلاد</label><input id="ns-bdate" type="date" value="${editing?.birthDate||''}"></div>
        <div class="field"><label>مكان الميلاد</label><input id="ns-bplace" placeholder="مثال: الرباط" value="${editing?.birthPlace||''}"></div>
        <div class="field"><label>الفوج</label>
          <select id="ns-group">
            <option value="">بدون فوج</option>
            ${DB.groups.map(g=>`<option value="${g.id}" ${editing?.groupId===g.id?'selected':''}>${g.name}</option>`).join('')}
          </select>
        </div>
      </div>
      <div style="display:flex;gap:10px;margin-top:12px">
        <button class="btn btn-primary" onclick="onSaveStudent()">${editing? '💾 حفظ التعديلات' : 'إضافة المتعلم'}</button>
        ${editing? `<button class="btn btn-line" onclick="editingStudentId=null; render()">إلغاء التعديل</button>` : ''}
      </div>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px">
        <h3 style="margin:0"><span class="dot"></span> قائمة المتعلمين (${DB.students.length})</h3>
        <div style="display:flex;gap:8px;align-items:center" class="no-print">
          <label class="small-note">تصفية حسب الفوج:</label>
          <select onchange="groupFilter=this.value; render()">
            <option value="" ${groupFilter===''?'selected':''}>الكل</option>
            ${DB.groups.map(g=>`<option value="${g.id}" ${groupFilter===g.id?'selected':''}>${g.name}</option>`).join('')}
          </select>
        </div>
      </div>
      ${(()=>{ const list = groupFilter? DB.students.filter(s=>s.groupId===groupFilter) : DB.students;
        return list.length? `<table><thead><tr><th>الاسم</th><th>السن</th><th>المستوى</th><th>الفوج</th><th>تاريخ الميلاد</th><th>مكان الميلاد</th><th>الجلسات</th><th></th></tr></thead>
      <tbody>${list.map(s=>`
        <tr>
          <td>${s.name}</td><td>${s.age||'—'}</td><td>${s.level||'—'}</td>
          <td>${groupName(s.groupId)}</td>
          <td>${s.birthDate||'—'}</td><td>${s.birthPlace||'—'}</td>
          <td>${studentSessions(s.id).length}</td>
          <td style="display:flex;gap:6px">
            <button class="btn btn-sm btn-line" onclick="DB.activeStudent='${s.id}'; saveDB(); switchView('dashboard')">فتح</button>
            <button class="btn btn-sm btn-gold" onclick="editingStudentId='${s.id}'; render(); window.scrollTo(0,0)">تعديل</button>
            <button class="btn btn-sm btn-danger" onclick="onDeleteStudent('${s.id}')">حذف</button>
          </td>
        </tr>`).join('')}</tbody></table>` : `<div class="empty">لا يوجد متعلمون في هذه التصفية.</div>`; })()}
    </div>
  `;
}
function onSaveStudent(){
  const name = document.getElementById("ns-name").value.trim();
  if(!name) return toast("أدخل اسم المتعلم أولاً");
  const age = document.getElementById("ns-age").value;
  const level = document.getElementById("ns-level").value.trim();
  const birthDate = document.getElementById("ns-bdate").value;
  const birthPlace = document.getElementById("ns-bplace").value.trim();
  const groupId = document.getElementById("ns-group").value || null;
  if(editingStudentId){
    updateStudent(editingStudentId, {name, age, level, birthDate, birthPlace, groupId});
    toast("تم حفظ تعديلات المتعلم");
    editingStudentId = null;
    render();
  }else{
    addStudent(name, age, level, birthDate, birthPlace, groupId);
    toast("تمت إضافة المتعلم");
    switchView("dashboard");
  }
}
function onDeleteStudent(id){
  if(confirm("هل تريد حذف هذا المتعلم وجميع سجلاته؟ لا يمكن التراجع.")){
    if(editingStudentId===id) editingStudentId = null;
    deleteStudent(id);
    render();
  }
}

// ---------- الأفواج ----------
let editingGroupId = null;
let groupFilter = "";

function renderGroups(root){
  const editing = editingGroupId ? DB.groups.find(g=>g.id===editingGroupId) : null;
  root.innerHTML = `
    <div class="card">
      <h3><span class="dot"></span> ${editing? 'تعديل الفوج: '+editing.name : 'إضافة فوج جديد'}</h3>
      <div class="grid g3">
        <div class="field"><label>اسم الفوج</label><input id="ng-name" placeholder="مثال: الفوج الأول" value="${editing?.name||''}"></div>
      </div>
      <div style="display:flex;gap:10px;margin-top:12px">
        <button class="btn btn-primary" onclick="onSaveGroup()">${editing? '💾 حفظ التعديلات' : 'إضافة الفوج'}</button>
        ${editing? `<button class="btn btn-line" onclick="editingGroupId=null; render()">إلغاء التعديل</button>` : ''}
      </div>
    </div>
    <div class="card">
      <h3><span class="dot"></span> الأفواج (${DB.groups.length})</h3>
      ${DB.groups.length? `<table><thead><tr><th>اسم الفوج</th><th>عدد المتعلمين</th><th></th></tr></thead>
      <tbody>${DB.groups.map(g=>`
        <tr>
          <td>${g.name}</td>
          <td>${DB.students.filter(s=>s.groupId===g.id).length}</td>
          <td style="display:flex;gap:6px">
            <button class="btn btn-sm btn-gold" onclick="editingGroupId='${g.id}'; render(); window.scrollTo(0,0)">تعديل</button>
            <button class="btn btn-sm btn-danger" onclick="onDeleteGroup('${g.id}')">حذف</button>
          </td>
        </tr>`).join('')}</tbody></table>` : `<div class="empty">لا توجد أفواج بعد. أضف فوجًا ثم اربط المتعلمين به من صفحة "المتعلّمون".</div>`}
    </div>
  `;
}
function onSaveGroup(){
  const name = document.getElementById("ng-name").value.trim();
  if(!name) return toast("أدخل اسم الفوج أولاً");
  if(editingGroupId){
    updateGroup(editingGroupId, name);
    toast("تم حفظ تعديلات الفوج");
    editingGroupId = null;
  }else{
    addGroup(name);
    toast("تمت إضافة الفوج");
  }
  render();
}
function onDeleteGroup(id){
  if(confirm("حذف هذا الفوج؟ سيبقى المتعلمون المرتبطون به بدون فوج.")){
    if(editingGroupId===id) editingGroupId = null;
    deleteGroup(id);
    render();
  }
}

// ---------- تسجيل جلسة ----------
// المسارات مستقلة: يمكن أن تحتوي الجلسة على مسار واحد أو أكثر حسب اختيار المُحفِّظ
const TRACK_META = {
  hifz:      {label:"مسار الحفظ",       field:"hifz"},
  murajaa:   {label:"مسار المراجعة",    field:"murajaa"},
  nazariyyah:{label:"التلاوة النظرية",  field:"talawahNazariyyah"},
  talawah:   {label:"مسار التلاوة",     field:"talawah"},
  arbaeen:   {label:"الأربعون النووية", field:"arbaeen"},
  adhkar:    {label:"مسار الأذكار",     field:"adhkar"},
};

function startNewSession(){
  const student = activeStudent();
  sessionDraft = {
    id: uid(), studentId: student.id, date: todayStr(), attendance: "حاضر",
    tracks: {hifz:true, murajaa:true, nazariyyah:true, talawah:true, arbaeen:false, adhkar:false},
    hifz: {surahFrom:SURAHS[0], ayahFrom:1, surahTo:SURAHS[0], ayahTo:1, evaluation:"",
      next: {surahFrom:SURAHS[0], ayahFrom:1, surahTo:SURAHS[0], ayahTo:1}},
    murajaa: {
      qareeb: {surahFrom:SURAHS[0], ayahFrom:1, surahTo:SURAHS[0], ayahTo:1, evaluation:""},
      baeed: {surahFrom:SURAHS[0], ayahFrom:1, surahTo:SURAHS[0], ayahTo:1, evaluation:""}
    },
    talawahNazariyyah: {matn:"تحفة الأطفال", baytFrom:"", baytTo:"", tajweedNoteTitle:""},
    talawah: {surahFrom:SURAHS[0], ayahFrom:1, surahTo:SURAHS[0], ayahTo:1, evaluation:"", details:{}},
    arbaeen: {number:1, evaluation:"", next:{number:2}},
    adhkar: {bab:ADHKAR[0].bab, evaluation:"", next:{bab:ADHKAR[0].bab}}
  };
  sessionTab = "hifz";
  switchView("session");
}

function toggleTrack(key, val){
  sessionDraft.tracks[key] = val;
  render();
}

function renderSession(root, student){
  if(!sessionDraft) startNewSession();
  const d = sessionDraft;
  const includedCount = Object.values(d.tracks).filter(Boolean).length;
  root.innerHTML = `
    <div class="card">
      <div class="grid g3">
        <div class="field"><label>التاريخ</label><input type="date" id="sd-date" value="${d.date}"></div>
        <div class="field">
          <label>الحضور</label>
          <div class="attendance-row">
            <div class="att-opt ${d.attendance==='حاضر'?'sel-present':''}" onclick="setAttendance('حاضر')">حاضر</div>
            <div class="att-opt ${d.attendance==='متأخر'?'sel-late':''}" onclick="setAttendance('متأخر')">متأخر</div>
            <div class="att-opt ${d.attendance==='غائب'?'sel-absent':''}" onclick="setAttendance('غائب')">غائب</div>
          </div>
        </div>
      </div>
      <p class="small-note" style="margin-top:12px">اختر مسارًا واحدًا أو أكثر لهذه الجلسة عبر مفتاح "تضمين" أعلى كل مسار — لا يشترط تسجيل المسارات الستة معًا.</p>
    </div>

    <div class="tabs no-print">
      ${Object.keys(TRACK_META).map(k=>tabBtn(k)).join('')}
    </div>

    <div class="card">${ sessionTab==='hifz' ? hifzForm(d) : sessionTab==='murajaa' ? murajaaForm(d) : sessionTab==='nazariyyah' ? nazariyyahForm(d) : sessionTab==='talawah' ? talawahForm(d) : sessionTab==='arbaeen' ? arbaeenForm(d) : adhkarForm(d) }</div>

    <div style="display:flex; gap:10px; align-items:center">
      <button class="btn btn-primary" onclick="saveSession()">💾 حفظ الجلسة</button>
      <button class="btn btn-line" onclick="sessionDraft=null; switchView('dashboard')">إلغاء</button>
      <span class="small-note">${includedCount} من ${Object.keys(TRACK_META).length} مسارات مُضمَّنة</span>
    </div>
  `;
}
function tabBtn(key){
  const meta = TRACK_META[key];
  const included = sessionDraft.tracks[key];
  return `<div class="tab-btn ${sessionTab===key?'active':''}" onclick="sessionTab='${key}'; render()">
    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;margin-left:6px;background:${included?'var(--good)':'#c9c1af'}"></span>${meta.label}
  </div>`;
}
function setAttendance(v){ sessionDraft.attendance = v; render(); }

function trackToggleHeader(key, title){
  const included = sessionDraft.tracks[key];
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">
      <h3 style="margin:0"><span class="dot"></span> ${title}</h3>
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13.5px;font-weight:700;color:${included?'var(--good)':'var(--ink-soft)'}">
        <input type="checkbox" ${included?'checked':''} onchange="toggleTrack('${key}', this.checked)" style="width:17px;height:17px;">
        تضمين هذا المسار في الجلسة
      </label>
    </div>`;
}

function rangeFields(prefix, obj){
  return `
    <div class="grid g4">
      <div class="field"><label>من سورة</label><select onchange="updSurahRange('${prefix}','From', this.value)">${surahOptions(obj.surahFrom)}</select></div>
      <div class="field"><label>من آية</label><select onchange="upd('${prefix}.ayahFrom', this.value)">${ayahOptions(obj.surahFrom, obj.ayahFrom)}</select></div>
      <div class="field"><label>إلى سورة</label><select onchange="updSurahRange('${prefix}','To', this.value)">${surahOptions(obj.surahTo)}</select></div>
      <div class="field"><label>إلى آية</label><select onchange="upd('${prefix}.ayahTo', this.value)">${ayahOptions(obj.surahTo, obj.ayahTo)}</select></div>
    </div>`;
}
function evalGroup(prefix, options, current){
  const cls = {"جيد":"sel-good","جيدة":"sel-good","متوسط":"sel-mid","متوسطة":"sel-mid","ضعيف":"sel-bad","ضعيفة":"sel-bad","يعاد":"sel-bad","يحتاج إعادة":"sel-bad","يحتاج إلى إعادة":"sel-bad"};
  return `<div class="eval-group">${options.map(o=>`<div class="eval-opt ${current===o?cls[o]:''}" onclick="upd('${prefix}', '${o}')">${o}</div>`).join('')}</div>`;
}

function hifzForm(d){
  const on = d.tracks.hifz;
  return `
    ${trackToggleHeader('hifz','مقدار الحفظ (الاستظهار)')}
    <div class="${on?'':'track-off'}">
      <div class="subhead"><span class="dot"></span>الدرس المقرر (حفظ اليوم)</div>
      ${rangeFields('hifz', d.hifz)}
      <div class="subhead"><span class="dot"></span>تقييم الحفظ</div>
      ${evalGroup('hifz.evaluation', ["جيد","متوسط","ضعيف يعاد"], d.hifz.evaluation)}
      <hr class="sep">
      <div class="subhead"><span class="dot"></span>الدرس القادم (مقدار الحفظ للدرس المقبل)</div>
      ${rangeFields('hifz.next', d.hifz.next)}
    </div>
  `;
}
function murajaaForm(d){
  const on = d.tracks.murajaa;
  return `
    ${trackToggleHeader('murajaa','مسار المراجعة')}
    <div class="${on?'':'track-off'}">
      <div class="subhead"><span class="dot"></span>مراجعة القريب</div>
      ${rangeFields('murajaa.qareeb', d.murajaa.qareeb)}
      ${evalGroup('murajaa.qareeb.evaluation', ["جيد","متوسط","ضعيف يحتاج إعادة"], d.murajaa.qareeb.evaluation)}
      <hr class="sep">
      <div class="subhead"><span class="dot"></span>مراجعة البعيد</div>
      ${rangeFields('murajaa.baeed', d.murajaa.baeed)}
      ${evalGroup('murajaa.baeed.evaluation', ["جيد","متوسط","ضعيف يحتاج إعادة"], d.murajaa.baeed.evaluation)}
    </div>
  `;
}
function nazariyyahForm(d){
  const on = d.tracks.nazariyyah;
  return `
    ${trackToggleHeader('nazariyyah','التلاوة النظرية')}
    <div class="${on?'':'track-off'}">
      <div class="grid g2">
        <div class="field"><label>المتن</label>
          <select onchange="upd('talawahNazariyyah.matn', this.value)">
            ${['تحفة الأطفال','الجزرية (المقدمة الجزرية)'].map(m=>`<option ${d.talawahNazariyyah.matn===m?'selected':''}>${m}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="grid g2">
        <div class="field"><label>من بيت</label><input value="${d.talawahNazariyyah.baytFrom||''}" oninput="upd('talawahNazariyyah.baytFrom', this.value)"></div>
        <div class="field"><label>إلى بيت</label><input value="${d.talawahNazariyyah.baytTo||''}" oninput="upd('talawahNazariyyah.baytTo', this.value)"></div>
      </div>
      <div class="field"><label>عنوان مذكرة التجويد</label>
        <input value="${d.talawahNazariyyah.tajweedNoteTitle||''}" oninput="upd('talawahNazariyyah.tajweedNoteTitle', this.value)" placeholder="مثال: أحكام الميم الساكنة">
      </div>
    </div>
  `;
}
function talawahForm(d){
  const on = d.tracks.talawah;
  const det = d.talawah.details||{};
  return `
    ${trackToggleHeader('talawah','مقدار التلاوة')}
    <div class="${on?'':'track-off'}">
      ${rangeFields('talawah', d.talawah)}
      <div class="subhead"><span class="dot"></span>تقييم التلاوة</div>
      ${evalGroup('talawah.evaluation', ["جيدة","متوسطة","ضعيفة"], d.talawah.evaluation)}
      <hr class="sep">
      <div class="subhead"><span class="dot"></span>تفصيل الملاحظات</div>
      <div class="checks">
        ${TAJWEED_DETAILS.map(t=>`
          <label class="check-item">
            <input type="checkbox" ${det[t.key]?'checked':''} onchange="upd('talawah.details.${t.key}', this.checked)">
            ${t.label}
          </label>`).join('')}
      </div>
    </div>
  `;
}

function hadithOptions(selected){
  return HADITH40.map(h=>`<option value="${h.n}" ${Number(selected)===h.n?'selected':''}>الحديث ${h.n}</option>`).join('');
}
function arbaeenForm(d){
  const on = d.tracks.arbaeen;
  const current = hadithByNumber(d.arbaeen.number);
  const next = hadithByNumber(d.arbaeen.next?.number);
  return `
    ${trackToggleHeader('arbaeen','مسار حفظ الأربعين النووية')}
    <div class="${on?'':'track-off'}">
      <div class="subhead"><span class="dot"></span>حديث اليوم</div>
      <div class="grid g3">
        <div class="field"><label>رقم الحديث</label>
          <select onchange="upd('arbaeen.number', this.value)">${hadithOptions(d.arbaeen.number)}</select>
        </div>
      </div>
      <div class="hadith-box" style="background:var(--bg-soft,#faf8f2);border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin:10px 0">
        <div class="small-note" style="font-weight:700;margin-bottom:6px">${current.narrator}</div>
        <div style="line-height:1.9">${current.text}</div>
        <div class="small-note" style="margin-top:6px">${current.takhrij}</div>
      </div>
      <div class="subhead"><span class="dot"></span>تقييم الحفظ</div>
      ${evalGroup('arbaeen.evaluation', ["جيد","متوسط","يحتاج إلى إعادة"], d.arbaeen.evaluation)}
      <hr class="sep">
      <div class="subhead"><span class="dot"></span>حديث الدرس القادم</div>
      <div class="grid g3">
        <div class="field"><label>رقم الحديث القادم</label>
          <select onchange="upd('arbaeen.next.number', this.value)">${hadithOptions(d.arbaeen.next?.number)}</select>
        </div>
      </div>
      <div class="hadith-box" style="background:var(--bg-soft,#faf8f2);border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin-top:10px">
        <div class="small-note" style="font-weight:700;margin-bottom:6px">${next.narrator}</div>
        <div style="line-height:1.9">${next.text}</div>
        <div class="small-note" style="margin-top:6px">${next.takhrij}</div>
      </div>
    </div>
  `;
}

function adhkarOptions(selected){
  return ADHKAR.map(a=>`<option value="${a.bab.replace(/"/g,'&quot;')}" ${selected===a.bab?'selected':''}>${a.bab}</option>`).join('');
}
function adhkarForm(d){
  const on = d.tracks.adhkar;
  const current = adhkarByBab(d.adhkar.bab);
  const next = adhkarByBab(d.adhkar.next?.bab);
  return `
    ${trackToggleHeader('adhkar','مسار حفظ الأذكار')}
    <div class="${on?'':'track-off'}">
      <div class="subhead"><span class="dot"></span>باب اليوم</div>
      <div class="grid g3">
        <div class="field"><label>الباب</label>
          <select onchange="upd('adhkar.bab', this.value)">${adhkarOptions(d.adhkar.bab)}</select>
        </div>
      </div>
      <div class="hadith-box" style="background:var(--bg-soft,#faf8f2);border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin:10px 0">
        <div class="small-note" style="font-weight:700;margin-bottom:6px">الذكر</div>
        <div style="line-height:1.9">${current.dhikr}</div>
        <div class="small-note" style="font-weight:700;margin-top:10px">الدليل</div>
        <div class="small-note" style="line-height:1.8">${current.daleel}</div>
      </div>
      <div class="subhead"><span class="dot"></span>تقييم الحفظ</div>
      ${evalGroup('adhkar.evaluation', ["جيد","متوسط","يحتاج إلى إعادة"], d.adhkar.evaluation)}
      <hr class="sep">
      <div class="subhead"><span class="dot"></span>باب الدرس القادم</div>
      <div class="grid g3">
        <div class="field"><label>الباب القادم</label>
          <select onchange="upd('adhkar.next.bab', this.value)">${adhkarOptions(d.adhkar.next?.bab)}</select>
        </div>
      </div>
      <div class="hadith-box" style="background:var(--bg-soft,#faf8f2);border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin-top:10px">
        <div class="small-note" style="font-weight:700;margin-bottom:6px">الذكر</div>
        <div style="line-height:1.9">${next.dhikr}</div>
        <div class="small-note" style="font-weight:700;margin-top:10px">الدليل</div>
        <div class="small-note" style="line-height:1.8">${next.daleel}</div>
      </div>
    </div>
  `;
}

function upd(path, value){
  const parts = path.split(".");
  let o = sessionDraft;
  for(let i=0;i<parts.length-1;i++) o = o[parts[i]];
  o[parts[parts.length-1]] = value;
  render();
}

function saveSession(){
  const included = Object.entries(sessionDraft.tracks).filter(([,v])=>v).map(([k])=>k);
  if(included.length===0) return toast("فعّل مسارًا واحدًا على الأقل قبل الحفظ");
  sessionDraft.date = document.getElementById("sd-date")?.value || sessionDraft.date;
  // إفراغ بيانات أي مسار غير مُضمَّن حتى تبقى المسارات مستقلة تمامًا في السجل والتقارير
  Object.keys(TRACK_META).forEach(key=>{
    const field = TRACK_META[key].field;
    if(!sessionDraft.tracks[key]) sessionDraft[field] = null;
  });
  DB.sessions.push(sessionDraft);
  saveDB();
  toast("تم حفظ الجلسة");
  sessionDraft = null;
  switchView("history");
}

// ---------- السجل ----------
function renderHistory(root, student){
  const sess = studentSessions(student.id);
  root.innerHTML = `
    <div class="card">
      <h3><span class="dot"></span> سجل جلسات: ${student.name}</h3>
      ${sess.length? sess.map(s=>`
        <div style="border:1px solid var(--line); border-radius:10px; padding:12px 14px; margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong>${s.date}</strong>
            <div style="display:flex; gap:8px; align-items:center;">
              <span class="chip ${s.attendance==='حاضر'?'chip-good': s.attendance==='متأخر'?'chip-mid':'chip-bad'}">${s.attendance}</span>
              <button class="btn btn-sm btn-danger no-print" onclick="onDeleteSession('${s.id}')">حذف</button>
            </div>
          </div>
          <div style="margin-top:10px">${renderSessionSummary(s)}</div>
        </div>
      `).join('') : `<div class="empty">لا توجد جلسات مسجّلة بعد.</div>`}
    </div>
  `;
}
function onDeleteSession(id){
  if(confirm("حذف هذه الجلسة نهائياً؟")){
    DB.sessions = DB.sessions.filter(s=>s.id!==id);
    saveDB();
    render();
  }
}

// ---------- التقارير ----------
let reportRange = "day";
function renderReports(root, student){
  const st = computeStats(student.id, reportRange);
  const label = {day:"يومي", week:"أسبوعي", month:"شهري"}[reportRange];
  root.innerHTML = `
    <div class="print-header">
      <div>
      <div class="small-note" style="font-weight:700">المدرسة النموذجية النهضة بالقرآن الكريم</div>
      <h2 style="margin:4px 0 0">تقرير ${label} — حلقة تحفيظ القرآن الكريم</h2>
      <div class="small-note">المتعلم: ${student.name} · السن: ${student.age||'—'} · المستوى: ${student.level||'—'} · الفوج: ${groupName(student.groupId)}</div></div>
      <div class="small-note">تاريخ الإصدار: ${todayStr()}</div>
    </div>
    <div class="tabs no-print">
      <div class="tab-btn ${reportRange==='day'?'active':''}" onclick="reportRange='day'; render()">يومي</div>
      <div class="tab-btn ${reportRange==='week'?'active':''}" onclick="reportRange='week'; render()">أسبوعي</div>
      <div class="tab-btn ${reportRange==='month'?'active':''}" onclick="reportRange='month'; render()">شهري</div>
      <button class="btn btn-gold btn-sm" style="margin-right:auto" onclick="window.print()">🖨️ طباعة</button>
    </div>

    <div class="grid g4">
      <div class="card stat-card"><div class="stat-num">${st.count}</div><div class="stat-lbl">عدد الجلسات</div></div>
      <div class="card stat-card"><div class="stat-num">${st.present}</div><div class="stat-lbl">حضور</div></div>
      <div class="card stat-card"><div class="stat-num">${st.late}</div><div class="stat-lbl">تأخر</div></div>
      <div class="card stat-card"><div class="stat-num">${st.absent}</div><div class="stat-lbl">غياب</div></div>
    </div>

    <div class="card">
      <h3><span class="dot"></span>تفصيل الجلسات ضمن الفترة</h3>
      ${st.sessions.length? `<table><thead><tr><th>التاريخ</th><th>الحضور</th><th>الحفظ</th><th>المراجعة (قريب/بعيد)</th><th>التلاوة</th><th>الأربعون النووية</th><th>الأذكار</th></tr></thead>
      <tbody>${st.sessions.map(s=>`
        <tr>
          <td>${s.date}</td>
          <td>${s.attendance}</td>
          <td>${s.hifz?.surahFrom? surahRangeLabel(s.hifz)+' '+evalChip(s.hifz.evaluation): '—'}</td>
          <td>${(s.murajaa?.qareeb?.surahFrom? evalChip(s.murajaa.qareeb.evaluation):'')} ${(s.murajaa?.baeed?.surahFrom? evalChip(s.murajaa.baeed.evaluation):'')}</td>
          <td>${s.talawah?.surahFrom? evalChip(s.talawah.evaluation): '—'}</td>
          <td>${s.arbaeen?.number? 'ح'+s.arbaeen.number+' '+evalChip(s.arbaeen.evaluation): '—'}</td>
          <td>${s.adhkar?.bab? evalChip(s.adhkar.evaluation): '—'}</td>
        </tr>`).join('')}</tbody></table>` : `<div class="empty">لا توجد جلسات ضمن هذه الفترة.</div>`}
    </div>
  `;
}

// ---------- الإحصائيات ----------
function renderStats(root, student){
  const st = computeStats(student.id, "all");
  function bars(obj, colorMap){
    const total = Object.values(obj).reduce((a,b)=>a+b,0) || 1;
    return Object.entries(obj).map(([k,v])=>`
      <div class="bar-row">
        <div class="bar-label">${k}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${(v/total*100).toFixed(0)}%; background:${colorMap[k]||'var(--palm)'}"></div></div>
        <div class="bar-val">${v}</div>
      </div>`).join('') || '<div class="small-note">لا بيانات</div>';
  }
  const colors = {"جيد":"var(--good)","جيدة":"var(--good)","متوسط":"var(--gold)","متوسطة":"var(--gold)","ضعيف":"var(--bad)","ضعيفة":"var(--bad)","ضعيف يعاد":"var(--bad)","ضعيف يحتاج إعادة":"var(--bad)","يحتاج إلى إعادة":"var(--bad)"};
  root.innerHTML = `
    <div class="grid g3">
      <div class="card"><h3><span class="dot"></span>الحفظ</h3>${bars(st.evalCount.hifz, colors)}</div>
      <div class="card"><h3><span class="dot"></span>المراجعة</h3>${bars(st.evalCount.murajaa, colors)}</div>
      <div class="card"><h3><span class="dot"></span>التلاوة</h3>${bars(st.evalCount.talawah, colors)}</div>
      <div class="card"><h3><span class="dot"></span>الأربعون النووية</h3>${bars(st.evalCount.arbaeen, colors)}</div>
      <div class="card"><h3><span class="dot"></span>الأذكار</h3>${bars(st.evalCount.adhkar, colors)}</div>
    </div>
    <div class="card">
      <h3><span class="dot"></span>الحضور الإجمالي</h3>
      ${bars({"حاضر":st.present, "متأخر":st.late, "غائب":st.absent}, {"حاضر":"var(--good)","متأخر":"var(--gold)","غائب":"var(--bad)"})}
    </div>
  `;
}

// ---------- النسخ الاحتياطي ----------
function renderBackup(root){
  root.innerHTML = `
    <div class="card">
      <h3><span class="dot"></span> النسخ الاحتياطي والاستعادة</h3>
      <p class="small-note">يقوم التطبيق بالحفظ التلقائي لكل تعديل في ذاكرة الجهاز. يمكنك أيضاً تنزيل نسخة احتياطية كاملة بصيغة JSON، أو استرجاع نسخة سابقة.</p>
      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:14px">
        <button class="btn btn-primary" onclick="exportBackup()">⬇️ تنزيل نسخة احتياطية</button>
        <label class="btn btn-line" style="cursor:pointer">
          ⬆️ استرجاع نسخة احتياطية
          <input type="file" accept="application/json" style="display:none" onchange="importBackup(this.files[0])">
        </label>
        <button class="btn btn-danger" onclick="onResetAll()">🗑️ مسح جميع البيانات</button>
      </div>
    </div>
    <div class="card">
      <h3><span class="dot"></span>معلومات القاعدة</h3>
      <div class="grid g3">
        <div class="stat-card"><div class="stat-num">${DB.students.length}</div><div class="stat-lbl">متعلمون</div></div>
        <div class="stat-card"><div class="stat-num">${DB.sessions.length}</div><div class="stat-lbl">جلسات</div></div>
        <div class="stat-card"><div class="stat-num">${(JSON.stringify(DB).length/1024).toFixed(1)} kb</div><div class="stat-lbl">حجم البيانات</div></div>
      </div>
    </div>
  `;
}
function onResetAll(){
  if(confirm("سيتم مسح جميع المتعلمين والجلسات نهائياً. هل أنت متأكد؟")){
    DB = {students:[], sessions:[], groups:[], activeStudent:null};
    saveDB();
    render();
  }
}

// ===================== التهيئة =====================
document.addEventListener("DOMContentLoaded", ()=>{
  document.getElementById("student-select").addEventListener("change", (e)=>{
    DB.activeStudent = e.target.value; saveDB(); render();
  });
  document.querySelectorAll(".nav-btn").forEach(b=>{
    b.addEventListener("click", ()=> switchView(b.dataset.view));
  });
  if(!DB.activeStudent && DB.students.length) DB.activeStudent = DB.students[0].id;
  render();

  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js").catch(()=>{});
  }
});

// حفظ احتياطي دوري كل دقيقتين تحسبا لأي تعطل
setInterval(()=>{ saveDB(); }, 120000);

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
    "ضعيف":"chip-bad", "ضعيفة":"chip-bad", "يعاد":"chip-bad", "يحتاج إعادة":"chip-bad"
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

  const evalCount = {hifz:{}, murajaa:{}, talawah:{}};
  let present=0, absent=0, late=0;
  filtered.forEach(s=>{
    if(s.attendance==="حاضر") present++;
    else if(s.attendance==="غائب") absent++;
    else if(s.attendance==="متأخر") late++;
    if(s.hifz?.evaluation) evalCount.hifz[s.hifz.evaluation] = (evalCount.hifz[s.hifz.evaluation]||0)+1;
    if(s.murajaa?.qareeb?.evaluation) evalCount.murajaa[s.murajaa.qareeb.evaluation] = (evalCount.murajaa[s.murajaa.qareeb.evaluation]||0)+1;
    if(s.murajaa?.baeed?.evaluation) evalCount.murajaa[s.murajaa.baeed.evaluation] = (evalCount.murajaa[s.murajaa.baeed.evaluation]||0)+1;
    if(s.talawah?.evaluation) evalCount.talawah[s.talawah.evaluation] = (evalCount.talawah[s.talawah.evaluation]||0)+1;
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
};

function startNewSession(){
  const student = activeStudent();
  sessionDraft = {
    id: uid(), studentId: student.id, date: todayStr(), attendance: "حاضر",
    tracks: {hifz:true, murajaa:true, nazariyyah:true, talawah:true},
    hifz: {surahFrom:SURAHS[0], ayahFrom:1, surahTo:SURAHS[0], ayahTo:1, evaluation:"",
      next: {surahFrom:SURAHS[0], ayahFrom:1, surahTo:SURAHS[0], ayahTo:1}},
    murajaa: {
      qareeb: {surahFrom:SURAHS[0], ayahFrom:1, surahTo:SURAHS[0], ayahTo:1, evaluation:""},
      baeed: {surahFrom:SURAHS[0], ayahFrom:1, surahTo:SURAHS[0], ayahTo:1, evaluation:""}
    },
    talawahNazariyyah: {matn:"تحفة الأطفال", baytFrom:"", baytTo:"", tajweedNoteTitle:""},
    talawah: {surahFrom:SURAHS[0], ayahFrom:1, surahTo:SURAHS[0], ayahTo:1, evaluation:"", details:{}}
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
      <p class="small-note" style="margin-top:12px">اختر مسارًا واحدًا أو أكثر لهذه الجلسة عبر مفتاح "تضمين" أعلى كل مسار — لا يشترط تسجيل الأربعة معًا.</p>
    </div>

    <div class="tabs no-print">
      ${Object.keys(TRACK_META).map(k=>tabBtn(k)).join('')}
    </div>

    <div class="card">${ sessionTab==='hifz' ? hifzForm(d) : sessionTab==='murajaa' ? murajaaForm(d) : sessionTab==='nazariyyah' ? nazariyyahForm(d) : talawahForm(d) }</div>

    <div style="display:flex; gap:10px; align-items:center">
      <button class="btn btn-primary" onclick="saveSession()">💾 حفظ الجلسة</button>
      <button class="btn btn-line" onclick="sessionDraft=null; switchView('dashboard')">إلغاء</button>
      <span class="small-note">${includedCount} من ٤ مسارات مُضمَّنة</span>
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
  const cls = {"جيد":"sel-good","جيدة":"sel-good","متوسط":"sel-mid","متوسطة":"sel-mid","ضعيف":"sel-bad","ضعيفة":"sel-bad","يعاد":"sel-bad","يحتاج إعادة":"sel-bad"};
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
      ${st.sessions.length? `<table><thead><tr><th>التاريخ</th><th>الحضور</th><th>الحفظ</th><th>المراجعة (قريب/بعيد)</th><th>التلاوة</th></tr></thead>
      <tbody>${st.sessions.map(s=>`
        <tr>
          <td>${s.date}</td>
          <td>${s.attendance}</td>
          <td>${s.hifz?.surahFrom? surahRangeLabel(s.hifz)+' '+evalChip(s.hifz.evaluation): '—'}</td>
          <td>${(s.murajaa?.qareeb?.surahFrom? evalChip(s.murajaa.qareeb.evaluation):'')} ${(s.murajaa?.baeed?.surahFrom? evalChip(s.murajaa.baeed.evaluation):'')}</td>
          <td>${s.talawah?.surahFrom? evalChip(s.talawah.evaluation): '—'}</td>
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
  const colors = {"جيد":"var(--good)","جيدة":"var(--good)","متوسط":"var(--gold)","متوسطة":"var(--gold)","ضعيف":"var(--bad)","ضعيفة":"var(--bad)","ضعيف يعاد":"var(--bad)","ضعيف يحتاج إعادة":"var(--bad)"};
  root.innerHTML = `
    <div class="grid g3">
      <div class="card"><h3><span class="dot"></span>الحفظ</h3>${bars(st.evalCount.hifz, colors)}</div>
      <div class="card"><h3><span class="dot"></span>المراجعة</h3>${bars(st.evalCount.murajaa, colors)}</div>
      <div class="card"><h3><span class="dot"></span>التلاوة</h3>${bars(st.evalCount.talawah, colors)}</div>
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
    DB = {students:[], sessions:[], activeStudent:null};
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

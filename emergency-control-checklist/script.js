/* =========================================================
   Emergency Control & Checklist System
   GitHub-ready frontend prototype
   No framework / no CDN / no backend
========================================================= */

/*
  IMPORTANT:
  HTS CUG numbers below are DEMO/SAMPLE placeholders.
  Replace the "0000000000" values with your authorized
  official CUG numbers before real-world use.
*/
const CONTACTS = {
  "Fire Station": { label: "Fire Station", number: "101" },
  "Ambulance": { label: "Ambulance", number: "108" },
  "UP Police": { label: "UP Police", number: "100" },

  "संबंधित थाना": { label: "संबंधित थाना", number: "05722-000001" },
  "CO": { label: "CO", number: "05722-000002" },
  "ASP / वरिष्ठ अधिकारी": { label: "ASP / वरिष्ठ अधिकारी", number: "05722-000003" },
  "नजदीकी अतिरिक्त पुलिस बल": { label: "नजदीकी अतिरिक्त पुलिस बल", number: "05722-000004" },
  "नजदीकी पुलिस बल": { label: "नजदीकी पुलिस बल", number: "05722-000005" },

  "HTS CUG Control Room": { label: "HTS CUG Control Room", number: "0000000000" },
  "HTS CUG Officer": { label: "HTS CUG Officer", number: "0000000000" }
};

const CHECKLISTS = {
  "आग लगने की घटना": [
    ["fire_station","Fire Station को सूचना","Fire Station"],
    ["ambulance","Ambulance को सूचना","Ambulance"],
    ["police","संबंधित थाने को सूचना","संबंधित थाना"],
    ["co","CO को सूचना","CO"],
    ["asp","ASP / वरिष्ठ अधिकारी को सूचना","ASP / वरिष्ठ अधिकारी"],
    ["location","घटना की Location दर्ज",null],
    ["info_time","सूचना का समय दर्ज",null],
    ["fire_arrival","Fire Service/दमकल की पहुँच की पुष्टि","Fire Station"]
  ],
  "दुर्घटना": [
    ["acc_ambulance","Ambulance / Medical सहायता को सूचना","Ambulance"],
    ["acc_police","संबंधित थाने को सूचना","संबंधित थाना"],
    ["acc_co","CO को सूचना","CO"],
    ["acc_asp","ASP / वरिष्ठ अधिकारी को सूचना","ASP / वरिष्ठ अधिकारी"],
    ["acc_location","Location दर्ज",null],
    ["acc_time","सूचना का समय दर्ज",null],
    ["traffic","Traffic / रास्ता सुरक्षित कराने की कार्रवाई",null],
    ["acc_followup","घटना की Follow-up सूचना",null]
  ],
  "भगदड़": [
    ["stampede_police","संबंधित थाने को सूचना","संबंधित थाना"],
    ["extra_force","नजदीकी अतिरिक्त पुलिस बल को सूचना","नजदीकी अतिरिक्त पुलिस बल"],
    ["stampede_ambulance","Ambulance / Medical सहायता को सूचना","Ambulance"],
    ["stampede_co","CO को सूचना","CO"],
    ["stampede_asp","ASP / वरिष्ठ अधिकारी को सूचना","ASP / वरिष्ठ अधिकारी"],
    ["stampede_location","Location दर्ज",null],
    ["crowd_control","भीड़ को सुरक्षित दिशा में नियंत्रित करने की कार्रवाई",null],
    ["entry_exit","प्रवेश/निकास मार्ग सुरक्षित कराने की कार्रवाई",null],
    ["stampede_time","सूचना एवं कार्रवाई का समय दर्ज",null]
  ],
  "मेडिकल Emergency": [
    ["medical_ambulance","Ambulance / Medical सहायता","Ambulance"],
    ["medical_police","संबंधित थाना","संबंधित थाना"],
    ["medical_co","CO","CO"],
    ["medical_location","Location",null],
    ["medical_time","सूचना का समय",null],
    ["medical_confirmation","Medical सहायता पहुँचने की पुष्टि","Ambulance"]
  ],
  "कानून-व्यवस्था": [
    ["law_police","संबंधित थाना","संबंधित थाना"],
    ["law_force","नजदीकी पुलिस बल","नजदीकी पुलिस बल"],
    ["law_co","CO","CO"],
    ["law_asp","ASP / वरिष्ठ अधिकारी","ASP / वरिष्ठ अधिकारी"],
    ["law_location","Location",null],
    ["law_time","सूचना का समय",null],
    ["law_followup","Follow-up सूचना",null]
  ],
  "अन्य": [
    ["other_police","संबंधित थाना","संबंधित थाना"],
    ["other_co","CO","CO"],
    ["other_asp","ASP / वरिष्ठ अधिकारी","ASP / वरिष्ठ अधिकारी"],
    ["other_location","Location",null],
    ["other_time","सूचना का समय",null],
    ["other_followup","Follow-up सूचना",null]
  ]
};

function createEmergencyObject(number,type,location,isDemo=false){
  const checklist={};
  CHECKLISTS[type].forEach(item=>{
    checklist[item[0]]={complete:false,callLogs:[]};
  });
  return {
    id:number, number, type, location,
    createdAt:new Date().toISOString(),
    isDemo, checklist
  };
}

let emergencies=[
  createEmergencyObject("ER-2026-001","आग लगने की घटना","Naya Ganj, Hathras",true),
  createEmergencyObject("ER-2026-002","दुर्घटना","Aligarh Road, Hathras",true),
  createEmergencyObject("ER-2026-003","भगदड़","Talab Chauraha, Hathras",true)
];

let selectedEmergencyId="ER-2026-001";
let audioContext=null;
let beepTimer=null;

const $ = id => document.getElementById(id);
const getChecklist = e => CHECKLISTS[e.type] || [];
const getPendingCount = e => getChecklist(e).filter(x=>!e.checklist[x[0]]?.complete).length;
const getCompleteCount = e => getChecklist(e).length-getPendingCount(e);
const isComplete = e => getPendingCount(e)===0;

function getCurrentTime(){
  return new Date().toLocaleString("hi-IN",{
    day:"2-digit",month:"2-digit",year:"numeric",
    hour:"2-digit",minute:"2-digit",second:"2-digit"
  });
}

function escapeHtml(v){
  return String(v)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function inlineArg(v){
  return escapeHtml(JSON.stringify(String(v)));
}

function generateEmergencyNumber(){
  let max=0;
  emergencies.forEach(e=>{
    const m=e.number.match(/^ER-2026-(\d+)$/);
    if(m) max=Math.max(max,Number(m[1]));
  });
  return `ER-2026-${String(max+1).padStart(3,"0")}`;
}

function getContactNumber(item){
  return item[2] ? CONTACTS[item[2]]?.number || null : null;
}

function renderEmergencyList(){
  const list=$("emergencyList");
  const search=$("searchInput").value.trim().toLowerCase();

  const filtered=emergencies.filter(e=>
    e.number.toLowerCase().includes(search) ||
    e.location.toLowerCase().includes(search)
  );

  $("emergencyCount").textContent=filtered.length;

  if(!filtered.length){
    list.innerHTML='<div class="no-results">कोई Emergency नहीं मिली।</div>';
    return;
  }

  list.innerHTML=filtered.map(e=>{
    const pending=getPendingCount(e);
    const complete=isComplete(e);

    return `
      <div class="emergency-card ${complete?"complete":"pending"} ${selectedEmergencyId===e.id?"selected":""}"
           onclick="selectEmergency(${inlineArg(e.id)})">
        <div class="emergency-number">${escapeHtml(e.number)}</div>
        <div class="emergency-type">${escapeHtml(e.type)}</div>
        <div class="emergency-location">📍 ${escapeHtml(e.location)}</div>
        ${e.isDemo?'<span class="demo-tag">DEMO DATA</span>':""}
        <div class="card-bottom">
          <span class="status-pill ${complete?"complete":"pending"}">
            ${complete?"✓ Complete":`⚠ ${pending} Pending`}
          </span>
          <span>${getCompleteCount(e)}/${getChecklist(e).length}</span>
        </div>
      </div>`;
  }).join("");
}

function selectEmergency(id){
  selectedEmergencyId=id;
  initializeAudio();
  renderEmergencyList();
  renderDetail();
  updateAlertAndSound();
}

function renderDetail(){
  const detail=$("detailContent");
  const e=emergencies.find(x=>x.id===selectedEmergencyId);

  if(!e){
    detail.innerHTML='<div class="empty">कोई Emergency select करें।</div>';
    return;
  }

  const checklist=getChecklist(e);
  const pending=getPendingCount(e);
  const complete=isComplete(e);
  const completeCount=getCompleteCount(e);
  const percent=checklist.length?Math.round(completeCount/checklist.length*100):100;

  detail.innerHTML=`
    <div class="detail-summary">
      <div class="summary-item">
        <div class="summary-label">Emergency Number</div>
        <div class="summary-value">${escapeHtml(e.number)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">घटना का प्रकार</div>
        <div class="summary-value">${escapeHtml(e.type)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">Location</div>
        <div class="summary-value">📍 ${escapeHtml(e.location)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">Checklist Status</div>
        <div class="summary-value">${complete?"🟢 Complete":`🔴 ${pending} Pending`}</div>
      </div>
    </div>

    <div class="checklist-header">
      <h2>Emergency Checklist</h2>
      <div class="header-actions">
        <span class="status-pill ${complete?"complete":"pending"}">${completeCount}/${checklist.length}</span>
        <button class="reset-btn" onclick="resetChecklist(${inlineArg(e.id)})">↻ Reset Checklist</button>
      </div>
    </div>

    <div class="cug-panel">
      <strong>📞 HTS CUG Quick Contacts</strong>
      <div class="cug-buttons">
        <button class="call-btn" onclick="quickCall('HTS CUG Control Room')">HTS CUG Control Room</button>
        <button class="call-btn" onclick="quickCall('HTS CUG Officer')">HTS CUG Officer</button>
      </div>
      <span class="cug-note">CUG नंबर CONTACTS object में Demo/Sample हैं; वास्तविक अधिकृत नंबर वहाँ बदलें।</span>
    </div>

    <div class="progress-container">
      <div class="progress-bar" style="width:${percent}%"></div>
    </div>

    <div class="checklist">
      ${checklist.map(item=>renderChecklistItem(e,item)).join("")}
    </div>`;
}

function renderChecklistItem(e,item){
  const [id,text]=item;
  const state=e.checklist[id]||{complete:false,callLogs:[]};
  const number=getContactNumber(item);
  const logs=state.callLogs||[];

  return `
    <div class="check-item ${state.complete?"completed":""}">
      <div class="check-main">
        <div class="check-title">${state.complete?"☑":"☐"} ${escapeHtml(text)}</div>

        <div class="check-actions">
          ${number
            ? `<span class="call-number">📞 ${escapeHtml(number)}</span>
               <button class="call-btn" onclick="callChecklistItem(${inlineArg(e.id)},${inlineArg(id)})">📞 Call</button>`
            : `<span class="call-number">ℹ️ Manual Action</span>`
          }

          <button class="complete-btn ${state.complete?"is-complete":""}"
                  onclick="toggleChecklist(${inlineArg(e.id)},${inlineArg(id)})">
            ${state.complete?"☑ Complete":"☐ Pending"}
          </button>
        </div>
      </div>

      ${logs.length?`
        <div class="call-log">
          <div class="call-log-title">📋 Call Log</div>
          ${logs.map(log=>`
            <div class="log-row">
              <span class="log-status">${log.called?"✓ Call किया":"✗ Call नहीं किया"}</span>
              <span>🕒 ${escapeHtml(log.time)}</span>
              <span>📞 ${escapeHtml(log.number)}</span>
              <span>Status: ${escapeHtml(log.status)}</span>
            </div>
          `).join("")}
        </div>`:""}
    </div>`;
}

function toggleChecklist(eid,iid){
  const e=emergencies.find(x=>x.id===eid);
  if(!e)return;

  if(!e.checklist[iid]){
    e.checklist[iid]={complete:false,callLogs:[]};
  }

  e.checklist[iid].complete=!e.checklist[iid].complete;
  initializeAudio();
  renderEmergencyList();
  renderDetail();
  updateAlertAndSound();
}

function callChecklistItem(eid,iid){
  const e=emergencies.find(x=>x.id===eid);
  if(!e)return;

  const item=getChecklist(e).find(x=>x[0]===iid);
  const number=getContactNumber(item);
  if(!number)return;

  initializeAudio();

  if(!e.checklist[iid]){
    e.checklist[iid]={complete:false,callLogs:[]};
  }

  e.checklist[iid].callLogs.push({
    called:true,
    time:getCurrentTime(),
    number,
    status:"Call Initiated"
  });

  renderDetail();
  window.location.href="tel:"+encodeURIComponent(number);
}

function quickCall(contactKey){
  const c=CONTACTS[contactKey];

  if(!c || !c.number || c.number==="0000000000"){
    alert("इस CUG का वास्तविक नंबर अभी CONTACTS object में दर्ज नहीं है।");
    return;
  }

  initializeAudio();
  window.location.href="tel:"+encodeURIComponent(c.number);
}

function resetChecklist(eid){
  const e=emergencies.find(x=>x.id===eid);
  if(!e)return;

  const ok=confirm(
    "क्या इस Emergency की पूरी checklist और सभी Call Logs reset करने हैं?\n\n" +
    "यह कार्रवाई वापस नहीं की जा सकती।"
  );

  if(!ok)return;

  getChecklist(e).forEach(item=>{
    e.checklist[item[0]]={
      complete:false,
      callLogs:[]
    };
  });

  initializeAudio();
  renderEmergencyList();
  renderDetail();
  updateAlertAndSound();
}

function initializeAudio(){
  try{
    if(!audioContext){
      const AC=window.AudioContext||window.webkitAudioContext;
      if(AC) audioContext=new AC();
    }
    if(audioContext && audioContext.state==="suspended"){
      audioContext.resume();
    }
  }catch(error){
    console.warn("Audio initialization failed",error);
  }
}

function playBeep(){
  try{
    if(!audioContext)return;
    if(audioContext.state==="suspended")audioContext.resume();

    const oscillator=audioContext.createOscillator();
    const gain=audioContext.createGain();

    oscillator.type="square";
    oscillator.frequency.value=880;

    gain.gain.setValueAtTime(.0001,audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.09,audioContext.currentTime+.01);
    gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+.16);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime+.17);
  }catch(error){
    console.warn("Beep failed",error);
  }
}

function startBeep(){
  if(beepTimer)return;
  playBeep();
  beepTimer=setInterval(playBeep,1000);
}

function stopBeep(){
  if(beepTimer){
    clearInterval(beepTimer);
    beepTimer=null;
  }
}

function updateAlertAndSound(){
  const e=emergencies.find(x=>x.id===selectedEmergencyId);
  const alert=$("emergencyAlert");
  const banner=$("completeBanner");

  if(!e){
    alert.classList.remove("active");
    banner.classList.remove("active");
    stopBeep();
    return;
  }

  const pending=getPendingCount(e);

  if(pending>0){
    alert.classList.add("active");
    banner.classList.remove("active");

    $("alertEmergency").textContent=e.number;
    $("alertLocation").textContent=e.location;
    $("alertPending").textContent=pending;

    if(audioContext)startBeep();
  }else{
    alert.classList.remove("active");
    stopBeep();
    banner.classList.add("active");
  }
}

function createEmergency(){
  let number=$("newEmergencyNumber").value.trim();
  const type=$("newEmergencyType").value;
  let location=$("newEmergencyLocation").value;

  if(!number)number=generateEmergencyNumber();

  if(location==="__custom__"){
    location=$("customLocation").value.trim();
  }

  if(!location){
    alert("कृपया Location चुनें या Custom Location दर्ज करें।");
    return;
  }

  if(emergencies.some(e=>e.number.toLowerCase()===number.toLowerCase())){
    alert("यह Emergency Number पहले से मौजूद है।");
    return;
  }

  const e=createEmergencyObject(number,type,location,false);
  emergencies.push(e);
  selectedEmergencyId=e.id;

  $("newEmergencyNumber").value="";
  $("newEmergencyLocation").value="";
  $("customLocation").value="";
  $("customLocation").classList.remove("show");

  initializeAudio();
  renderEmergencyList();
  renderDetail();
  updateAlertAndSound();
}

function handleSearch(){
  renderEmergencyList();

  const q=$("searchInput").value.trim().toLowerCase();
  const filtered=emergencies.filter(e=>
    e.number.toLowerCase().includes(q) ||
    e.location.toLowerCase().includes(q)
  );

  if(filtered.length && !filtered.some(e=>e.id===selectedEmergencyId)){
    selectedEmergencyId=filtered[0].id;
    initializeAudio();
    renderEmergencyList();
    renderDetail();
    updateAlertAndSound();
  }
}

$("createEmergencyBtn").addEventListener("click",createEmergency);
$("searchInput").addEventListener("input",handleSearch);

$("newEmergencyLocation").addEventListener("change",function(){
  const custom=$("customLocation");

  if(this.value==="__custom__"){
    custom.classList.add("show");
    custom.focus();
  }else{
    custom.classList.remove("show");
    custom.value="";
  }
});

/*
  Browser autoplay restriction:
  AudioContext is created/resumed only after a user gesture.
*/
document.addEventListener("click",event=>{
  if(event.target.closest(
    ".call-btn,.complete-btn,.reset-btn,.emergency-card,#createEmergencyBtn,#searchInput"
  )){
    initializeAudio();
  }
},{passive:true});

renderEmergencyList();
renderDetail();
updateAlertAndSound();

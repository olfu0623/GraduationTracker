let gradConditions = JSON.parse(localStorage.getItem('gradConditions')||'[]');
let records = JSON.parse(localStorage.getItem('records')||'[]');

function saveData(){
  localStorage.setItem('gradConditions', JSON.stringify(gradConditions));
  localStorage.setItem('records', JSON.stringify(records));
}

function addGraduationCondition(){
  const name=document.getElementById('gradConditionName').value.trim();
  const type=document.getElementById('gradConditionType').value;
  const qty=parseFloat(document.getElementById('gradConditionQty').value);
  if(!name||isNaN(qty)) return alert('請填寫完整條件');
  gradConditions.push({name,type,qty});
  saveData();
  updateGradTable();
  updateRecordOptions();
  updateStatus();
  document.getElementById('gradConditionName').value='';
  document.getElementById('gradConditionQty').value='';
}

function updateGradTable(){
  const tbody=document.querySelector('#gradConditionsTable tbody');
  tbody.innerHTML='';
  gradConditions.forEach((c,i)=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${c.name}</td><td>${c.type==='credit'?'學分':'次數'}</td><td>${c.qty}</td>
      <td><button onclick="editGradCondition(${i})">修改</button> <button onclick="deleteGradCondition(${i})">刪除</button></td>`;
    tbody.appendChild(tr);
  });
}

function editGradCondition(index){
  const c=gradConditions[index];
  const newName=prompt('修改條件名稱',c.name); if(!newName) return;
  const newType=prompt('修改類型(credit=學分,count=次數)',c.type); if(!newType) return;
  const newQty=parseFloat(prompt('修改數量',c.qty)); if(isNaN(newQty)) return;
  gradConditions[index]={name:newName,type:newType,qty:newQty};
  saveData();
  updateGradTable();
  updateRecordOptions();
  updateStatus();
}

function deleteGradCondition(index){
  if(!confirm('確定要刪除嗎？')) return;
  gradConditions.splice(index,1);
  saveData();
  updateGradTable();
  updateRecordOptions();
  updateStatus();
}

function updateRecordOptions(){
  const select=document.getElementById('recordType');
  select.innerHTML='';
  gradConditions.forEach(c=>{
    const opt=document.createElement('option');
    opt.value=c.name;
    opt.textContent=c.name;
    select.appendChild(opt);
  });
}

function addRecord(){
  const name=document.getElementById('recordName').value.trim();
  const type=document.getElementById('recordType').value;
  const qty=parseFloat(document.getElementById('recordQty').value);
  const semester=document.getElementById('recordSemester').value.trim();
  if(!name||!type||isNaN(qty)||!semester) return alert('請填寫完整紀錄');
  records.push({name,type,qty,semester});
  saveData();
  updateRecordsTable();
  updateStatus();
  document.getElementById('recordName').value='';
  document.getElementById('recordQty').value='';
  document.getElementById('recordSemester').value='';
}

function updateRecordsTable(){
  const tbody=document.querySelector('#recordsTable tbody');
  tbody.innerHTML='';
  records.sort((a,b)=>a.semester.localeCompare(b.semester));
  records.forEach((r,i)=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${r.semester}</td><td>${r.name}</td><td>${r.type==='credit'?'學分':'次數'}</td>
      <td>${r.qty}</td><td><button onclick="editRecord(${i})">修改</button> <button onclick="deleteRecord(${i})">刪除</button></td>`;
    tbody.appendChild(tr);
  });
}

function editRecord(index){
  const r=records[index];
  const newName=prompt('修改名稱',r.name); if(!newName) return;
  const newType=prompt('修改類型(對應條件名稱)',r.type); if(!newType) return;
  const newQty=parseFloat(prompt('修改數量',r.qty)); if(isNaN(newQty)) return;
  const newSemester=prompt('修改學期',r.semester); if(!newSemester) return;
  records[index]={name:newName,type:newType,qty:newQty,semester:newSemester};
  saveData();
  updateRecordsTable();
  updateStatus();
}

function deleteRecord(index){
  if(!confirm('確定要刪除嗎？')) return;
  records.splice(index,1);
  saveData();
  updateRecordsTable();
  updateStatus();
}

function getColor(percent){
  if(percent<40) return '#d9534f';
  if(percent<70) return '#f0ad4e';
  return '#5cb85c';
}

function updateStatus(){
  const tbody=document.querySelector('#statusTable tbody');
  tbody.innerHTML='';
  gradConditions.forEach(cond=>{
    const total=records.filter(r=>r.type===cond.name).reduce((s,r)=>s+r.qty,0);
    const percent=Math.min(total/cond.qty*100,100);
    const color=getColor(percent);
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${cond.name}</td>
      <td><div class='progress-bar'><div class='progress-fill' style='width:${percent}%;background:${color}'>${Math.round(percent)}%</div></div></td>
      <td>${total} / ${cond.qty}</td>`;
    tbody.appendChild(tr);
  });
}

// 使用 html2canvas + jsPDF 匯出 PDF
function exportPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p','pt','a4');
  html2canvas(document.body,{scale:2}).then(canvas=>{
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    doc.addImage(imgData,'PNG',0,0,pdfWidth,pdfHeight);
    doc.save('學生修課紀錄.pdf');
  });
}

updateGradTable();
updateRecordOptions();
updateRecordsTable();
updateStatus();

let gradConditions = [], records = [];

// 載入 Firebase 畢業條件
async function loadGradConditions() {
  const { collection, getDocs } = window.firebaseFunctions;
  const db = window.firebaseDB;
  const snapshot = await getDocs(collection(db, "gradConditions"));
  gradConditions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  updateGradTable();
  updateRecordOptions();
  updateStatus();
}

// 載入 Firebase 修課/活動紀錄
async function loadRecords() {
  const { collection, getDocs } = window.firebaseFunctions;
  const db = window.firebaseDB;
  const snapshot = await getDocs(collection(db, "records"));
  records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  records.sort((a, b) => a.semester.localeCompare(b.semester));
  updateRecordsTable();
  updateStatus();
}

// 新增畢業條件
async function addGraduationCondition() {
  const name = document.getElementById('gradConditionName').value.trim();
  const type = document.getElementById('gradConditionType').value;
  const qty = parseFloat(document.getElementById('gradConditionQty').value);
  if (!name || isNaN(qty)) return alert("請填寫完整條件");

  const { collection, addDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  const docRef = await addDoc(collection(db, "gradConditions"), { name, type, qty });
  gradConditions.push({ id: docRef.id, name, type, qty });
  updateGradTable();
  updateRecordOptions();
  updateStatus();
  document.getElementById('gradConditionName').value = '';
  document.getElementById('gradConditionQty').value = '';
}

// 新增修課/活動紀錄
async function addRecord() {
  const name = document.getElementById('recordName').value.trim();
  const type = document.getElementById('recordType').value;
  const qty = parseFloat(document.getElementById('recordQty').value);
  const semester = document.getElementById('recordSemester').value.trim();
  if (!name || !type || isNaN(qty) || !semester) return alert('請填寫完整紀錄');

  const { collection, addDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  const docRef = await addDoc(collection(db, "records"), { name, type, qty, semester });
  records.push({ id: docRef.id, name, type, qty, semester });
  records.sort((a, b) => a.semester.localeCompare(b.semester));
  updateRecordsTable();
  updateStatus();
  document.getElementById('recordName').value = '';
  document.getElementById('recordQty').value = '';
  document.getElementById('recordSemester').value = '';
}

// TODO: 保留原本 updateGradTable(), updateRecordsTable(), updateRecordOptions(), updateStatus(), exportPDF()
// 只需將資料來源改為 gradConditions / records

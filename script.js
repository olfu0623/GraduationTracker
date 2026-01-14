let gradConditions = [], records = [];

// 監聽畢業條件（即時同步）
function listenGradConditions() {
  const { collection, onSnapshot } = window.firebaseFunctions;
  const db = window.firebaseDB;
  const gradCol = collection(db, "gradConditions");

  onSnapshot(gradCol, (snapshot) => {
    gradConditions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    updateGradTable();
    updateRecordOptions();
    updateStatus();
  });
}

// 監聽修課/活動紀錄（即時同步）
function listenRecords() {
  const { collection, onSnapshot } = window.firebaseFunctions;
  const db = window.firebaseDB;
  const recCol = collection(db, "records");

  onSnapshot(recCol, (snapshot) => {
    records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    records.sort((a, b) => a.semester.localeCompare(b.semester));
    updateRecordsTable();
    updateStatus();
  });
}

// 新增畢業條件
async function addGraduationCondition() {
  const name = document.getElementById('gradConditionName').value.trim();
  const type = document.getElementById('gradConditionType').value;
  const qty = parseFloat(document.getElementById('gradConditionQty').value);
  if (!name || isNaN(qty)) return alert("請填寫完整條件");

  const { collection, addDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  await addDoc(collection(db, "gradConditions"), { name, type, qty });
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
  await addDoc(collection(db, "records"), { name, type, qty, semester });
  document.getElementById('recordName').value = '';
  document.getElementById('recordQty').value = '';
  document.getElementById('recordSemester').value = '';
}

// 初始化即時監聽
listenGradConditions();
listenRecords();

// TODO: 保留 updateGradTable(), updateRecordsTable(), updateRecordOptions(), updateStatus(), exportPDF()
// 只需將資料來源換成 gradConditions / records

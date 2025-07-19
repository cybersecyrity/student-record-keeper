// admin.js

// Select DOM elements
const studentForm = document.getElementById('studentForm');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const uploadForm = document.getElementById('uploadForm');
const uploadStudentId = document.getElementById('uploadStudentId');
const resultFileInput = document.getElementById('resultFile');
const studentTableBody = document.getElementById('studentTableBody');

let students = [];
let editIndex = -1; // -1 means no edit mode

// Load students from localStorage on page load
window.onload = () => {
  const saved = localStorage.getItem('students');
  if (saved) {
    students = JSON.parse(saved);
  }
  renderStudentTable();
  populateUploadStudentDropdown();
};

// Save students to localStorage
function saveStudents() {
  localStorage.setItem('students', JSON.stringify(students));
}

// Render student table
function renderStudentTable() {
  studentTableBody.innerHTML = '';

  students.forEach((s, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.age}</td>
      <td>${s.gender}</td>
      <td>${s.department}</td>
      <td>${s.dob}</td>
      <td>${s.address}</td>
      <td>${s.email}</td>
      <td>${s.phone}</td>
      <td>${s.guardian}</td>
      <td>${s.guardianPhone}</td>
      <td>${s.state}</td>
      <td>${s.yearAdmitted}</td>
      <td>${s.studentType}</td>
      <td>${s.status}</td>
      <td>
        <button class="edit-btn" data-index="${i}">Edit</button>
        <button class="delete-btn" data-index="${i}">Delete</button>
        <button class="view-result-btn" data-index="${i}" ${s.resultFileData ? '' : 'disabled'}>View Result</button>
      </td>
    `;
    studentTableBody.appendChild(tr);
  });

  attachTableButtonListeners();
  populateUploadStudentDropdown();
}

// Populate student dropdown for result upload
function populateUploadStudentDropdown() {
  uploadStudentId.innerHTML = '<option value="">Select Student ID</option>';
  students.forEach(s => {
    const option = document.createElement('option');
    option.value = s.id;
    option.textContent = '${s.id} - ${s.name}';
    uploadStudentId.appendChild(option);
  });
}

// Attach event listeners to buttons in table
function attachTableButtonListeners() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.onclick = e => {
      const i = e.target.dataset.index;
      startEdit(i);
    };
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = e => {
      const i = e.target.dataset.index;
      if (confirm('Are you sure you want to delete this student?')) {
        students.splice(i, 1);
        saveStudents();
        renderStudentTable();
        if (editIndex == i) cancelEdit();
      }
    };
  });

  document.querySelectorAll('.view-result-btn').forEach(btn => {
    btn.onclick = e => {
      const i = e.target.dataset.index;
      const s = students[i];
      if (s.resultFileData && s.resultFileType && s.resultFileName) {
        const blob = b64toBlob(s.resultFileData, s.resultFileType);
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        alert('No result file found for this student.');
      }
    };
  });
}

// Convert base64 string to Blob
function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i=0; i<slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

// Handle add/edit student form submission
studentForm.addEventListener('submit', e => {
  e.preventDefault();

  const newStudent = {
    id: studentForm.id.value.trim(),
    name: studentForm.name.value.trim(),
    age: studentForm.age.value.trim(),
    gender: studentForm.gender.value,
    department: studentForm.department.value.trim(),
    dob: studentForm.dob.value,
    address: studentForm.address.value.trim(),
    email: studentForm.email.value.trim(),
    phone: studentForm.phone.value.trim(),
    guardian: studentForm.guardian.value.trim(),
    guardianPhone: studentForm.guardianPhone.value.trim(),
    state: studentForm.state.value.trim(),
    yearAdmitted: studentForm.yearAdmitted.value.trim(),
    studentType: studentForm.studentType.value,
    status: studentForm.status.value,
  };

  if (!newStudent.id || !newStudent.email) {
    alert('Student ID and Email are required.');
    return;
  }

  if (editIndex === -1) {
    // Add new student
    if (students.some(s => s.id === newStudent.id)) {
      alert('Student ID must be unique.');
      return;
    }
    if (students.some(s => s.email === newStudent.email)) {
      alert('Email must be unique.');
      return;
    }
    students.push(newStudent);
  } else {
    // Update existing student
    // Ensure uniqueness except current editing record
    if (students.some((s, idx) => s.id === newStudent.id && idx != editIndex)) {
      alert('Student ID must be unique.');
      return;
    }
    if (students.some((s, idx) => s.email === newStudent.email && idx != editIndex)) {
      alert('Email must be unique.');
      return;
    }

    // Preserve result data if any
    newStudent.resultFileData = students[editIndex].resultFileData || null;
    newStudent.resultFileName = students[editIndex].resultFileName || null;
    newStudent.resultFileType = students[editIndex].resultFileType || null;

    students[editIndex] = newStudent;
    editIndex = -1;
    cancelEditBtn.style.display = 'none';
    studentForm.querySelector('button[type="submit"]').textContent = 'Add Student';
  }

  saveStudents();
  renderStudentTable();
  studentForm.reset();
});

// Start editing student
function startEdit(i) {
  const s = students[i];
  editIndex = i;

  studentForm.id.value = s.id;
  studentForm.name.value = s.name;
  studentForm.age.value = s.age;
  studentForm.gender.value = s.gender;
  studentForm.department.value = s.department;
  studentForm.dob.value = s.dob;
  studentForm.address.value = s.address;
  studentForm.email.value = s.email;
  studentForm.phone.value = s.phone;
  studentForm.guardian.value = s.guardian;
  studentForm.guardianPhone.value = s.guardianPhone;
  studentForm.state.value = s.state;
  studentForm.yearAdmitted.value = s.yearAdmitted;
  studentForm.studentType.value = s.studentType;
  studentForm.status.value = s.status;

  cancelEditBtn.style.display = 'inline-block';
  studentForm.querySelector('button[type="submit"]').textContent = 'Save Changes';
}

// Cancel edit button click
cancelEditBtn.addEventListener('click', () => {
  cancelEdit();
});

function cancelEdit() {
  editIndex = -1;
  studentForm.reset();
  cancelEditBtn.style.display = 'none';
  studentForm.querySelector('button[type="submit"]').textContent = 'Add Student';
}

// Handle result upload form submission
uploadForm.addEventListener('submit', e => {
  e.preventDefault();

  const studentId = uploadStudentId.value;
  const file = resultFileInput.files[0];

  if (!studentId) {
    alert('Please select a student ID.');
    return;
  }
  if (!file) {
    alert('Please select a result file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(evt) {
    const base64Data = evt.target.result.split(',')[1]; // remove prefix

    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) {
      alert('Student not found.');
      return;
    }

    students[studentIndex].resultFileName = file.name;
    students[studentIndex].resultFileType = file.type;
    students[studentIndex].resultFileData = base64Data;

    saveStudents();
    alert('Result uploaded successfully!');
    uploadForm.reset();
    renderStudentTable();
  };
  reader.readAsDataURL(file);
});

// Logout function (redirects to login page but keeps data saved)
function logout() {
  alert('Logging out...');
  window.location.href = 'login.html'; // Update if your login page URL is different
}
// Load data and render table
document.addEventListener("DOMContentLoaded", () => {
  renderStudentTable();
});

document.getElementById("studentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const student = {
    id: document.getElementById("id").value,
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    department: document.getElementById("department").value,
    dob: document.getElementById("dob").value,
    address: document.getElementById("address").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    guardianName: document.getElementById("guardianName").value,
    guardianPhone: document.getElementById("guardianPhone").value,
    state: document.getElementById("state").value,
    yearAdmitted: document.getElementById("yearAdmitted").value,
    studentType: document.getElementById("studentType").value,
    status: document.getElementById("status").value,
    username: document.getElementById("email").value,
    password: document.getElementById("phone").value
  };

  const students = JSON.parse(localStorage.getItem("students")) || [];
  const exists = students.some(s => s.id === student.id);

  if (exists) {
    alert("Student ID already exists.");
    return;
  }

  students.push(student);
  localStorage.setItem("students", JSON.stringify(students));
  this.reset();
  renderStudentTable();
  alert("Student added successfully!");
});

function renderStudentTable() {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  const tbody = document.querySelector("#studentTable tbody");
  tbody.innerHTML = "";

  students.forEach(s => {
    const row = `
      <tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.age}</td>
        <td>${s.gender}</td>
        <td>${s.department}</td>
        <td>${s.dob}</td>
        <td>${s.address}</td>
        <td>${s.email}</td>
        <td>${s.phone}</td>
        <td>${s.guardianName}</td>
        <td>${s.guardianPhone}</td>
        <td>${s.state}</td>
        <td>${s.yearAdmitted}</td>
        <td>${s.studentType}</td>
        <td>${s.status}</td>
      </tr>`;
    tbody.innerHTML += row;
  });
}

function uploadResult() {
  const studentID = document.getElementById("uploadStudentID").value;
  const file = document.getElementById("resultFile").files[0];
  if (!studentID || !file) {
    alert("Please enter student ID and select a file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const base64Result = e.target.result;
    const results = JSON.parse(localStorage.getItem("results")) || {};
    results[studentID] = base64Result;
    localStorage.setItem("results", JSON.stringify(results));
    alert("Result uploaded!");
  };
  reader.readAsDataURL(file);
}

function logout() {
  localStorage.removeItem("role");
  localStorage.removeItem("studentID");
  window.location.href = "login.html";
}
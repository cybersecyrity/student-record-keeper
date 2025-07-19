document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (!username || !password || !role) {
    alert("Please fill in all fields.");
    return;
  }

  if (role === "admin") {
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("role", "admin");
      window.location.href = "admin.html";
    } else {
      alert("Invalid admin credentials.");
    }
  }

  if (role === "student") {
    const students = JSON.parse(localStorage.getItem("students")) || [];

    const student = students.find(
      (s) => s.username === username && s.password === password
    );

    if (student) {
      localStorage.setItem("role", "student");
      localStorage.setItem("studentID", student.id);
      window.location.href = "student.html";
    } else {
      alert("Invalid student credentials.");
    }
  }
});
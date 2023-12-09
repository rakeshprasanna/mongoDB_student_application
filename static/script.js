// Get all students
function getStudents() {
    fetch("/")
      .then((response) => response.json())
      .then((data) => {
        const tableBody = document.getElementById("student-table").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = "";
        for (const student of data) {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${student.SRN}</td>
            <td>${student.Sname}</td>
            <td>${student.Degree}</td>
            <td>${student.Sem}</td>
            <td>${student.CGPA}</td>
            <td>
              <button onclick="editStudent('${student.SRN}')">Edit</button>
              <button onclick="deleteStudent('${student.SRN}')">Delete</button>
            </td>
          `;
          tableBody.appendChild(row);
        }
      });
  }
  
  // Add student
  const studentForm = document.getElementById("student-form");
  studentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = {
      SRN: document.getElementById("srn").value,
      Sname: document.getElementById("sname").value,
      Degree: document.getElementById("degree").value,
      Sem: parseInt(document.getElementById("sem").value),
      CGPA: parseFloat(document.getElementById("cgpa").value),
    };
    fetch("/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        getStudents();
      });
  });
  
  // Edit student
  function editStudent(srn) {
    fetch(`/student/${srn}`)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("srn").value = data.SRN;
        document.getElementById("sname").value = data.Sname;
        document.getElementById("degree").value = data.Degree;
        document.getElementById("sem").value = data.Sem;
        document.getElementById("cgpa").value = data.CGPA;
      });
  }
  
  // Delete student
  function deleteStudent(srn) {
    if (confirm(`Are you sure you want to delete student with SRN ${srn}?`)) {
      fetch(`/student/${srn}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          getStudents();
        });
    }
  }
  
  // Get students on page load
  getStudents();
  
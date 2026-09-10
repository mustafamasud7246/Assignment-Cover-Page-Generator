document.addEventListener('DOMContentLoaded', () => {
    // Basic Fields Binding
    const bindings = [
        { inputId: 'assignmentTopic', previewId: 'preview-topic' },
        { inputId: 'courseName', previewId: 'preview-course-name' },
        { inputId: 'courseCode', previewId: 'preview-course-code' },
        { inputId: 'profName', previewId: 'preview-prof-name' },
        { inputId: 'profTitle', previewId: 'preview-prof-title' },
        { inputId: 'profDept', previewId: 'preview-prof-dept' },
        { inputId: 'groupNumber', previewId: 'preview-group' },
        { inputId: 'semesterInfo', previewId: 'preview-semester' },
        { inputId: 'studentDept', previewId: 'preview-student-dept' },
        { inputId: 'submissionDate', previewId: 'preview-date' }
    ];

    bindings.forEach(binding => {
        const inputEl = document.getElementById(binding.inputId);
        const previewEl = document.getElementById(binding.previewId);

        if (inputEl && previewEl) {
            // Initial sync
            previewEl.innerHTML = inputEl.value;

            // Listen for changes
            inputEl.addEventListener('input', (e) => {
                previewEl.innerHTML = e.target.value;
            });
        }
    });

    // Dynamic Students List
    let students = [
        { name: 'Mustafa Masud Towhid', reg: '2023234175' },
        { name: 'Akash', reg: '2024234172' },
        { name: 'MD. Abu Bakkor Rony', reg: '2024234166' },
        { name: 'Nahidul Hasan', reg: '2024234167' },
        { name: 'Israt Ara Islam Nourin', reg: '2024234169' },
        { name: 'MST. Jakiya Akter Jeni', reg: '2024234171' },
        { name: 'Paplu Das', reg: '2024234174' },
        { name: 'MD. Ach Aziz Remon', reg: '2024234165' },
        { name: 'Shamik Chakraborty', reg: '2023234050' }
    ];

    const studentsListDiv = document.getElementById('studentsList');
    const previewStudentsBody = document.getElementById('preview-students-body');
    const addStudentBtn = document.getElementById('addStudentBtn');

    function renderStudents() {
        // Clear both lists
        studentsListDiv.innerHTML = '';
        previewStudentsBody.innerHTML = '';

        students.forEach((student, index) => {
            // Render Editor Row
            const rowDiv = document.createElement('div');
            rowDiv.className = 'student-row';
            
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.value = student.name;
            nameInput.placeholder = 'Name';
            nameInput.addEventListener('input', (e) => {
                students[index].name = e.target.value;
                updatePreviewTable();
            });

            const regInput = document.createElement('input');
            regInput.type = 'text';
            regInput.value = student.reg;
            regInput.placeholder = 'Reg No';
            regInput.addEventListener('input', (e) => {
                students[index].reg = e.target.value;
                updatePreviewTable();
            });

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            removeBtn.title = 'Remove Student';
            removeBtn.onclick = () => {
                students.splice(index, 1);
                renderStudents(); // Re-render everything
            };

            rowDiv.appendChild(nameInput);
            rowDiv.appendChild(regInput);
            rowDiv.appendChild(removeBtn);
            studentsListDiv.appendChild(rowDiv);
        });

        updatePreviewTable();
    }

    function updatePreviewTable() {
        previewStudentsBody.innerHTML = '';
        students.forEach(student => {
            const tr = document.createElement('tr');
            
            const tdName = document.createElement('td');
            tdName.innerText = student.name;
            
            const tdReg = document.createElement('td');
            tdReg.innerText = student.reg;
            
            tr.appendChild(tdName);
            tr.appendChild(tdReg);
            previewStudentsBody.appendChild(tr);
        });
    }

    addStudentBtn.addEventListener('click', () => {
        students.push({ name: '', reg: '' });
        renderStudents();
        // Focus on the new input
        const rows = studentsListDiv.querySelectorAll('.student-row');
        if (rows.length > 0) {
            rows[rows.length - 1].querySelector('input').focus();
        }
    });

    // Initial render
    renderStudents();

    // Print Functionality
    const triggerPrint = () => window.print();
    const printBtn = document.getElementById('printBtn');
    const topPrintBtn = document.getElementById('topPrintBtn');

    if (printBtn) printBtn.addEventListener('click', triggerPrint);
    if (topPrintBtn) topPrintBtn.addEventListener('click', triggerPrint);
});

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

    async function getLogoDataUrl() {
        const logo = document.querySelector('#printArea .uni-logo');
        if (!logo || !logo.src) return '';

        try {
            const response = await fetch(logo.src);
            const blob = await response.blob();
            return await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            return logo.src;
        }
    }

    async function downloadDoc() {
        const printArea = document.getElementById('printArea');
        if (!printArea) return;

        const clone = printArea.cloneNode(true);
        const logo = clone.querySelector('.uni-logo');
        const sourceLogo = document.querySelector('#printArea .uni-logo');
        const logoWidth = 155;
        const logoRatio = (sourceLogo?.naturalWidth && sourceLogo?.naturalHeight)
            ? sourceLogo.naturalHeight / sourceLogo.naturalWidth
            : 272 / 250;
        const logoHeight = Math.round(logoWidth * logoRatio);
        if (logo) {
            const dataUrl = await getLogoDataUrl();
            if (dataUrl) logo.src = dataUrl;
            logo.setAttribute('width', String(logoWidth));
            logo.setAttribute('height', String(logoHeight));
            logo.setAttribute('border', '0');
            logo.style.width = `${logoWidth}px`;
            logo.style.height = `${logoHeight}px`;
            logo.style.border = '0';
            // Add spacer after logo for Word DOC (Word ignores CSS margin on images)
            const spacer = document.createElement('p');
            spacer.style.fontSize = '10pt';
            spacer.style.lineHeight = '10pt';
            spacer.innerHTML = '&nbsp;';
            logo.insertAdjacentElement('afterend', spacer);
        }

        clone.querySelectorAll('h1, h2, h3').forEach(heading => {
            const p = document.createElement('p');
            p.className = heading.className;
            p.innerHTML = heading.innerHTML;
            heading.replaceWith(p);
        });

        const dateSection = clone.querySelector('.date-section');
        const dateHtml = dateSection ? dateSection.outerHTML : '';
        if (dateSection) dateSection.remove();

        const topic = document.getElementById('assignmentTopic')?.value.trim() || 'assignment-cover';
        const safeName = topic.replace(/[\\/:*?"<>|]/g, '').slice(0, 80) || 'assignment-cover';

        const html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>${safeName}</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml>
<![endif]-->
<style>
@page WordSection1 {
    size: 21cm 29.7cm;
    margin: 10mm 20mm 18mm 20mm;
    mso-header-margin: 0;
    mso-footer-margin: 0;
    mso-paper-source: 0;
}
div.WordSection1 { page: WordSection1; }
body, p, div, td, th {
    font-family: Arial, Helvetica, sans-serif;
    color: #000;
    mso-margin-top-alt: 0;
    mso-margin-bottom-alt: 0;
}
p {
    margin: 0;
    padding: 0;
    line-height: 130%;
}
.page-fill {
    width: 100%;
    height: 253mm;
    border: none;
    border-collapse: collapse;
}
.page-fill td {
    border: none;
    padding: 0;
}
.cover-header, .assignment-info, .submitted-to, .submitted-by, .date-section {
    text-align: center;
    page-break-after: avoid;
    page-break-inside: avoid;
}
.cover-header { margin-bottom: 15px; }
.uni-logo { width: 155px; height: 169px; margin: 0 auto 22px; border: 0; }
.uni-name { font-size: 20px; font-weight: normal; font-style: italic; margin: 0 0 18px; }
.assignment-info { margin-bottom: 18px; }
.label-text { font-size: 18px; font-style: italic; margin: 0 0 8px; }
.course-text { font-size: 18px; font-style: italic; margin: 0 0 6px; }
.topic-title { font-size: 22px; font-weight: bold; font-style: italic; margin: 0 0 12px; }
.submitted-to, .submitted-by { font-size: 18px; margin-bottom: 18px; }
.section-title { font-weight: bold; font-style: italic; margin: 0 0 10px; }
.submitted-to .name, .submitted-to .title { margin: 0 0 4px; }
.submitted-to .dept, .submitted-by .group, .submitted-by .semester, .submitted-by .dept, .date-section {
    font-style: italic;
}
.submitted-by .group, .submitted-by .semester { margin: 0 0 6px; }
.students-table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0 16px;
    font-size: 16px;
    page-break-before: avoid;
    page-break-inside: avoid;
}
.students-table th, .students-table td {
    border: 1px solid #000;
    padding: 4px 10px;
    text-align: left;
    font-style: italic;
}
.students-table th { font-weight: normal; text-align: center; }
.date-section { font-size: 18px; margin: 0; }
</style>
</head>
<body>
<div class="WordSection1">
<table class="page-fill" width="100%" cellspacing="0" cellpadding="0">
<tr>
<td valign="top" style="vertical-align:top; border:none;">
${clone.innerHTML}
</td>
</tr>
<tr>
<td valign="bottom" style="vertical-align:bottom; border:none;">
${dateHtml}
</td>
</tr>
</table>
</div>
</body>
</html>`;

        const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${safeName}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    const docBtn = document.getElementById('docBtn');
    const topDocBtn = document.getElementById('topDocBtn');
    if (docBtn) docBtn.addEventListener('click', downloadDoc);
    if (topDocBtn) topDocBtn.addEventListener('click', downloadDoc);
});

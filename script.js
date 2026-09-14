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

    function escapeRtf(value) {
        return String(value ?? '')
            .replace(/\\/g, '\\\\')
            .replace(/{/g, '\\{')
            .replace(/}/g, '\\}')
            .replace(/\r?\n/g, '\\line ')
            .replace(/[^\x00-\x7f]/g, character => `\\u${character.charCodeAt(0)}?`);
    }

    function rtfParagraph(text, { center = true, italic = true, bold = false, size = 18, spaceAfter = 120, spaceBefore = 0 } = {}) {
        const alignment = center ? '\\qc' : '\\ql';
        const styles = `${bold ? '\\b' : ''}${italic ? '\\i' : ''}`;
        const reset = `${bold ? '\\b0' : ''}${italic ? '\\i0' : ''}`;
        return `\\pard${alignment}\\sb${spaceBefore}\\sa${spaceAfter}${styles}\\fs${size * 2} ${escapeRtf(text)}${reset}\\par`;
    }

    function rtfImage(dataUrl, width, height) {
        const match = String(dataUrl).match(/^data:image\/(png|jpe?g);base64,(.+)$/i);
        if (!match) return '';

        const imageType = match[1].toLowerCase() === 'png' ? '\\pngblip' : '\\jpegblip';
        const bytes = atob(match[2]);
        let hex = '';
        for (let index = 0; index < bytes.length; index++) {
            hex += bytes.charCodeAt(index).toString(16).padStart(2, '0');
        }

        const widthTwips = Math.round(width * 15);
        const heightTwips = Math.round(height * 15);
        return `{\\pict${imageType}\\picwgoal${widthTwips}\\pichgoal${heightTwips}\n${hex}}`;
    }

    function rtfTableRow(name, reg, header = false) {
        const style = header ? '\\i0' : '\\i';
        return `\\trowd\\trrh260\\trgaph80\\trleft0\\clbrdrt\\brdrs\\brdrw10\\clbrdrl\\brdrs\\brdrw10\\clbrdrb\\brdrs\\brdrw10\\clbrdrr\\brdrs\\brdrw10\\cellx4500\\clbrdrt\\brdrs\\brdrw10\\clbrdrl\\brdrs\\brdrw10\\clbrdrb\\brdrs\\brdrw10\\clbrdrr\\brdrs\\brdrw10\\cellx9000\\intbl\\qc${style}\\fs24 ${escapeRtf(name)}\\cell\\intbl\\qc${style}\\fs24 ${escapeRtf(reg)}\\cell\\row`;
    }

    async function downloadDoc() {
        const printArea = document.getElementById('printArea');
        if (!printArea) return;

        const clone = printArea.cloneNode(true);
        const logo = clone.querySelector('.uni-logo');
        const sourceLogo = document.querySelector('#printArea .uni-logo');
        const logoWidth = 140;
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

        // Add a small spacer before date section to push it down slightly
        const dateSection = clone.querySelector('.date-section');
        if (dateSection) {
            const sp = document.createElement('p');
            sp.style.fontSize = '25px';
            sp.style.lineHeight = '25px';
            sp.innerHTML = '&nbsp;';
            dateSection.insertAdjacentElement('beforebegin', sp);
        }

        const topic = document.getElementById('assignmentTopic')?.value.trim() || 'assignment-cover';
        const safeName = topic.replace(/[\\/:*?"<>|]/g, '').slice(0, 80) || 'assignment-cover';

        const logoDataUrl = logo?.src || '';
        const rtfParts = [
            '{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Arial;}}\\paperw11906\\paperh16838\\margl1134\\margr1134\\margt567\\margb1020',
            logoDataUrl ? `\\pard\\qc${rtfImage(logoDataUrl, logoWidth, logoHeight)}\\par` : '',
            rtfParagraph('Shahjalal University of Science and Technology, Sylhet', { size: 18, spaceAfter: 280 }),
            rtfParagraph('Assignment on:', { size: 16, spaceAfter: 80 }),
            rtfParagraph(document.getElementById('assignmentTopic')?.value || '', { size: 20, bold: true, spaceAfter: 120 }),
            rtfParagraph(`Course name: ${document.getElementById('courseName')?.value || ''}`, { size: 16, spaceAfter: 40 }),
            rtfParagraph(`Course code: ${document.getElementById('courseCode')?.value || ''}`, { size: 16, spaceAfter: 160 }),
            rtfParagraph('Submitted to -', { size: 16, bold: true, spaceAfter: 80 }),
            rtfParagraph(document.getElementById('profName')?.value || '', { size: 16, spaceAfter: 40 }),
            rtfParagraph(document.getElementById('profTitle')?.value || '', { size: 16, spaceAfter: 40 }),
            rtfParagraph(document.getElementById('profDept')?.value || '', { size: 16, spaceAfter: 280 }),
            rtfParagraph('Submitted by -', { size: 16, bold: true, spaceAfter: 80 }),
            rtfParagraph(document.getElementById('groupNumber')?.value || '', { size: 16, spaceAfter: 40 }),
            rtfParagraph(document.getElementById('semesterInfo')?.value || '', { size: 16, spaceAfter: 40 }),
            rtfParagraph(document.getElementById('studentDept')?.value || '', { size: 16, spaceAfter: 280 }),
            rtfTableRow('Name', 'Reg No', true),
            ...students.map(student => rtfTableRow(student.name, student.reg)),
            rtfParagraph(`Date: ${document.getElementById('submissionDate')?.value || ''}`, { size: 16, spaceBefore: 220, spaceAfter: 0 }),
            '}'
        ];

        const blob = new Blob([rtfParts.join('')], { type: 'application/rtf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${safeName}.rtf`;
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
// Subjects Mapping based on Level and Term
const subjectsMap = {
    level1: {
        term1: [
            { id: 'math1', name: 'رياضيات 1' },
            { id: 'physics1', name: 'فيزياء 1' },
            { id: 'cs1', name: 'مقدمة حاسبات' },
            { id: 'it1', name: 'تكنولوجيا المعلومات' }
        ],
        term2: [
            { id: 'math2', name: 'رياضيات 2 (جبر خطي وهندسة)' },
            { id: 'physics2', name: 'فيزياء 2' },
            { id: 'discrete_math', name: 'تراكيب محددة' },
            { id: 'statistics', name: 'احتمالات وإحصاء' },
            { id: 'programming1', name: 'برمجة مهيكلة' },
            { id: 'electronics', name: 'أساسيات إلكترونيات' }
        ]
    },
    level2: {
        term1: [
            { id: 'data_structures', name: 'هياكل بيانات' },
            { id: 'oop', name: 'برمجة شيئية' }
        ],
        term2: [
            { id: 'algorithms', name: 'خوارزميات' },
            { id: 'databases', name: 'قواعد بيانات' }
        ]
    }
};

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const logoutBtn = document.getElementById('logout-btn');
const loginForm = document.getElementById('login-form');
const addContentForm = document.getElementById('add-content-form');

const levelSelect = document.getElementById('level');
const termSelect = document.getElementById('term');
const subjectSelect = document.getElementById('subject');

// Update Subjects Dropdown
function updateSubjects() {
    const level = levelSelect.value;
    const term = termSelect.value;

    subjectSelect.innerHTML = '<option value="" disabled selected>اختر المادة</option>';

    if (level && term && subjectsMap[level] && subjectsMap[level][term]) {
        subjectSelect.disabled = false;
        subjectsMap[level][term].forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = subject.name;
            subjectSelect.appendChild(option);
        });
    } else {
        subjectSelect.disabled = true;
        subjectSelect.innerHTML = '<option value="" disabled selected>برجاء اختيار الفرقة والترم أولاً</option>';
    }
}

levelSelect.addEventListener('change', updateSubjects);
termSelect.addEventListener('change', updateSubjects);

// Mock Login (To be replaced with Firebase Auth)
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');

    // MOCK LOGIN FOR NOW
    if (email === 'admin@obour.edu.eg' && password === '123456') {
        errorMsg.style.display = 'none';
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        logoutBtn.style.display = 'block';
        
        // Save session locally for testing
        localStorage.setItem('admin_logged_in', 'true');
    } else {
        errorMsg.textContent = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
        errorMsg.style.display = 'block';
    }
});

// Check Session on load
window.addEventListener('load', () => {
    if (localStorage.getItem('admin_logged_in') === 'true') {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        logoutBtn.style.display = 'block';
    }
});

// Logout
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('admin_logged_in');
    dashboardSection.style.display = 'none';
    logoutBtn.style.display = 'none';
    loginSection.style.display = 'block';
});

// Mock Add Content (To be replaced with Firebase Firestore)
addContentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const subject = subjectSelect.value;
    const category = document.getElementById('category').value;
    const title = document.getElementById('title').value;
    const link = document.getElementById('link').value;
    const successMsg = document.getElementById('add-success');

    // Simulate Network Request
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.textContent = 'جاري الإضافة...';
    submitBtn.disabled = true;

    setTimeout(() => {
        console.log(`Added: ${title} (${link}) to ${category} of ${subject}`);
        
        successMsg.innerHTML = '✅ تم إضافة الملف بنجاح! <br> <span style="font-size:0.85rem; color:var(--text-muted);">ملاحظة: هذا مجرد تجربة (Mock) بانتظار ربط قاعدة البيانات الحقيقية.</span>';
        successMsg.style.display = 'block';
        
        submitBtn.textContent = 'رفع وإضافة للموقع';
        submitBtn.disabled = false;
        
        // Reset form except level and term
        document.getElementById('title').value = '';
        document.getElementById('link').value = '';
        
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 5000);
    }, 1500);
});

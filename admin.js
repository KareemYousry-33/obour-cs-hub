document.addEventListener('DOMContentLoaded', () => {
    let supabase = window.supabaseClient;
    if (!supabase) {
        if (window.supabase) {
            supabase = window.supabase.createClient('https://iyggxbxvjhsnhszfpijv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5Z2d4Ynh2amhzbmhzemZwaWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNTM5ODIsImV4cCI6MjA5ODkyOTk4Mn0.54nO2KVzo9me_X8EvnMpv8oDyxRAwa7l8lfR7S4Ka7A');
            window.supabaseClient = supabase;
        } else {
            alert('مكتبة قاعدة البيانات لم تحمل بعد. يرجى عمل Refresh قوي (Ctrl + F5).');
            return;
        }
    }
    
    // UI Elements
    const dashboardSection = document.getElementById('dashboard-section');
    const authOverlay = document.getElementById('auth-overlay');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    
    // Auth Logic
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // بيانات الدخول الموحدة لكريم وجنة
            if (email === 'jannah&kareem@obour.com' && password === 'admin123') {
                authOverlay.style.display = 'none';
                loginError.style.display = 'none';
                // حفظ حالة تسجيل الدخول مؤقتاً في الجلسة الحالية
                sessionStorage.setItem('isAdminLoggedIn', 'true');
            } else {
                loginError.style.display = 'block';
            }
        });

        // التحقق مما إذا كان قد سجل الدخول بالفعل في الجلسة الحالية
        if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
            authOverlay.style.display = 'none';
        }
    }
    
    const uploadForm = document.getElementById('upload-form');
    const levelTermSelect = document.getElementById('level-term');
    const subjectSelect = document.getElementById('subject');
    const fileTypeSelect = document.getElementById('file-type');
    const customFileNameInput = document.getElementById('custom-file-name');
    const fileNameGroup = document.getElementById('file-name-group');
    const pdfFileInput = document.getElementById('pdf-file');
    const uploadBtn = document.getElementById('upload-btn');
    
    const filesListSection = document.getElementById('files-list-section');
    const uploadedFilesContainer = document.getElementById('uploaded-files-container');
    
    const progressContainer = document.getElementById('progress-container');
    const uploadStatus = document.getElementById('upload-status');
    
    // News UI
    const newsForm = document.getElementById('news-form');
    const newsTitleInput = document.getElementById('news-title');
    const newsContentInput = document.getElementById('news-content');
    const newsAuthorInput = document.getElementById('news-author');
    const newsStatus = document.getElementById('news-status');
    const publishNewsBtn = document.getElementById('publish-news-btn');
    const newsItemsContainer = document.getElementById('news-items-container');
    
    // Subjects Data Mapping
    const subjectsMap = {
        'level1-term1': [
            { id: 'intro_cs', name: 'مقدمة في علوم الحاسب' },
            { id: 'math1', name: 'رياضيات 1' },
            { id: 'physics', name: 'فيزياء' },
            { id: 'english', name: 'لغة إنجليزية' }
        ],
        'level1-term2': [
            { id: 'linear_algebra', name: 'الجبر الخطي' },
            { id: 'oop', name: 'البرمجة الشيئية (OOP)' },
            { id: 'business_ethics', name: 'أخلاقيات العمل' },
            { id: 'discrete_math', name: 'الرياضيات المتقطعة' },
            { id: 'statistics', name: 'الإحصاء والاحتمالات' },
            { id: 'economics', name: 'مقدمة في الاقتصاد' }
        ],
        'level2-term1': [
            { id: 'data_structures', name: 'هياكل البيانات (Data Structures)' },
            { id: 'operational_research', name: 'بحوث العمليات (OR)' },
            { id: 'human_rights', name: 'حقوق الإنسان' },
            { id: 'electronics', name: 'إلكترونيات' },
            { id: 'system_analysis', name: 'تحليل وتصميم النظم' },
            { id: 'business_administration', name: 'إدارة أعمال' }
        ],
        'level2-term2': [
            { id: 'file_processing', name: 'معالجة الملفات (File Processing)' },
            { id: 'media_principles', name: 'أساسيات الميديا' },
            { id: 'assembly_language', name: 'لغة التجميع (Assembly)' },
            { id: 'web_programming', name: 'برمجة الويب' },
            { id: 'quality_control', name: 'ضبط وتوكيد الجودة' },
            { id: 'logic_design', name: 'التصميم المنطقي' }
        ]
    };

    // Helper to get folder path based on selection
    function getFolderPath() {
        const subject = subjectSelect.value;
        const type = fileTypeSelect.value;
        if (!subject || !type) return null;
        
        // Use "exams/subject", "summaries/subject", or "voices/subject"
        const root = type === 'exam' ? 'exams' : (type === 'voice' ? 'voices' : 'summaries');
        return `${root}/${subject}`;
    }

    // Load Files List
    async function loadFilesList() {
        const folderPath = getFolderPath();
        
        if (!folderPath) {
            filesListSection.style.display = 'none';
            fileNameGroup.style.display = 'none';
            pdfFileInput.disabled = true;
            uploadBtn.disabled = true;
            return;
        }

        filesListSection.style.display = 'block';
        fileNameGroup.style.display = 'block';
        pdfFileInput.disabled = false;
        uploadBtn.disabled = false;
        
        // Update section title dynamically
        const subjectName = subjectSelect.options[subjectSelect.selectedIndex].text;
        const typeName = fileTypeSelect.options[fileTypeSelect.selectedIndex].text.split(' ')[0]; // Gets "ملخص" or "امتحان"
        
        const listTitle = filesListSection.querySelector('h3');
        if (listTitle) {
            listTitle.innerHTML = `الملفات المرفوعة <span style="color: var(--secondary); font-size: 0.9rem;">(${typeName} ${subjectName})</span>`;
        }

        uploadedFilesContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">جاري جلب الملفات...</p>';

        try {
            const { data, error } = await supabase.storage.from('pdfs').list(folderPath);
            
            if (error) {
                uploadedFilesContainer.innerHTML = `<p style="color: #ef4444; font-size: 0.9rem;">خطأ: ${error.message}</p>`;
                return;
            }

            const files = data.filter(f => f.name !== '.emptyFolderPlaceholder');

            if (files.length === 0) {
                uploadedFilesContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">لا توجد ملفات مرفوعة في هذا القسم.</p>';
            } else {
                uploadedFilesContainer.innerHTML = '';
                
                // Sort files newest first
                files.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                files.forEach(file => {
                    const fullPath = `${folderPath}/${file.name}`;
                    const sizeKB = Math.round(file.metadata.size / 1024);
                    let sizeText = sizeKB > 1024 ? `${(sizeKB/1024).toFixed(2)} MB` : `${sizeKB} KB`;
                    const date = new Date(file.created_at).toLocaleDateString('ar-EG');
                    
                    const div = document.createElement('div');
                    div.style.cssText = 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;';
                    div.innerHTML = `
                        <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 70%;">
                            <h4 style="color: var(--text-main); margin: 0 0 0.3rem 0; font-size: 1rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;" dir="auto">
                                ${file.name}
                                <span style="background: rgba(76, 201, 240, 0.15); color: var(--secondary); padding: 0.1rem 0.5rem; border-radius: 4px; font-size: 0.7rem; white-space: nowrap; border: 1px solid rgba(76, 201, 240, 0.3);">${typeName} ${subjectName}</span>
                            </h4>
                            <span style="color: var(--text-muted); font-size: 0.8rem;">${sizeText} • ${date}</span>
                        </div>
                        <button class="btn delete-file-btn" data-path="${fullPath}" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 0.4rem 0.8rem; font-size: 0.85rem;">حذف</button>
                    `;
                    uploadedFilesContainer.appendChild(div);
                });

                // Attach delete events
                document.querySelectorAll('.delete-file-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const pathToDelete = e.target.getAttribute('data-path');
                        if (confirm(`هل أنت متأكد من حذف الملف "${pathToDelete.split('/').pop()}" نهائياً؟`)) {
                            e.target.innerText = 'جاري...';
                            const { error: deleteError } = await supabase.storage.from('pdfs').remove([pathToDelete]);
                            if (deleteError) {
                                alert('فشل الحذف: ' + deleteError.message);
                                loadFilesList();
                            } else {
                                uploadStatus.className = 'status-message success';
                                uploadStatus.innerText = 'تم الحذف بنجاح!';
                                loadFilesList();
                            }
                        }
                    });
                });
            }

        } catch (e) {
            uploadedFilesContainer.innerHTML = '<p style="color: #ef4444; font-size: 0.9rem;">خطأ في تحميل الملفات</p>';
        }
    }

    // Populate Subjects dynamically based on Level & Term
    levelTermSelect.addEventListener('change', (e) => {
        const selectedValue = e.target.value;
        subjectSelect.innerHTML = '<option value="" disabled selected>اختر المادة...</option>';
        
        if (subjectsMap[selectedValue]) {
            subjectsMap[selectedValue].forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.id;
                option.textContent = subject.name;
                subjectSelect.appendChild(option);
            });
            subjectSelect.disabled = false;
        } else {
            subjectSelect.disabled = true;
        }
        loadFilesList();
    });

    subjectSelect.addEventListener('change', () => {
        fileTypeSelect.disabled = false;
        loadFilesList();
    });

    fileTypeSelect.addEventListener('change', () => {
        loadFilesList();
    });

    // Handle Upload
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const folderPath = getFolderPath();
        const file = pdfFileInput.files[0];
        
        if (!file) {
            uploadStatus.className = 'status-message error';
            uploadStatus.innerText = 'برجاء اختيار ملف!';
            return;
        }
        
        if (!folderPath) {
            return;
        }

        // Determine file name
        let finalFileName = file.name;
        if (customFileNameInput.value.trim() !== '') {
            let customName = customFileNameInput.value.trim();
            // Get original extension
            const originalExt = file.name.substring(file.name.lastIndexOf('.'));
            if (!customName.toLowerCase().endsWith(originalExt.toLowerCase())) {
                customName += originalExt;
            }
            finalFileName = customName;
        }

        const filePath = `${folderPath}/${finalFileName}`;
        
        // Show progress UI
        progressContainer.style.display = 'block';
        uploadStatus.className = 'status-message';
        uploadStatus.innerText = 'جاري الرفع... برجاء الانتظار.';
        uploadBtn.disabled = true;
        
        // Use Supabase Storage API
        const { data, error } = await supabase.storage
            .from('pdfs')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true // Overwrite if exists
            });
            
        progressContainer.style.display = 'none';
        uploadBtn.disabled = false;
        
        if (error) {
            console.error("Upload error:", error);
            uploadStatus.className = 'status-message error';
            uploadStatus.innerText = 'حدث خطأ أثناء الرفع: ' + error.message;
        } else {
            uploadStatus.className = 'status-message success';
            uploadStatus.innerText = 'تم الرفع بنجاح! الملف متاح الآن للطلاب.';
            
            // Clear only the file and custom name, keep the subject/type selected
            pdfFileInput.value = '';
            customFileNameInput.value = '';
            
            // Reload list to show the new file
            const currentFolder = getFolderPath();
            if(currentFolder) {
                loadFilesList();
            }
        }
    });

    // Handle News Submission
    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = newsTitleInput.value;
        const content = newsContentInput.value;
        const author = newsAuthorInput.value || 'الأدمن';
        
        newsStatus.className = 'status-message';
        newsStatus.innerText = 'جاري النشر...';
        publishNewsBtn.disabled = true;
        
        const newsItem = {
            id: Date.now(),
            title,
            content,
            author,
            date: new Date().toISOString()
        };
        
        try {
            let existingNews = [];
            const { data: downloadData, error: downloadError } = await supabase.storage.from('pdfs').download('data/bulletin.json');
            if (!downloadError && downloadData) {
                try { existingNews = JSON.parse(await downloadData.text()); } catch(e) {}
            }
            
            existingNews.unshift(newsItem);
            
            const jsonBlob = new Blob([JSON.stringify(existingNews)], { type: 'application/json' });
            const { error: uploadError } = await supabase.storage.from('pdfs').upload('data/bulletin.json', jsonBlob, { upsert: true });
            if (uploadError) throw uploadError;
            
            newsStatus.className = 'status-message success';
            newsStatus.innerText = 'تم نشر الخبر بنجاح!';
            newsForm.reset();
            loadAdminNews();
        } catch (error) {
            console.error('News error:', error);
            newsStatus.className = 'status-message error';
            newsStatus.innerText = 'حدث خطأ: ' + (error.message || 'فشل النشر');
        } finally {
            publishNewsBtn.disabled = false;
        }
    });

    // Load and Display News in Admin Panel
    async function loadAdminNews() {
        if (!newsItemsContainer) return;
        
        try {
            const { data, error } = await supabase.storage.from('pdfs').download('data/bulletin.json');
            if (error) {
                newsItemsContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">لا توجد أخبار منشورة حالياً.</p>';
                return;
            }
            
            const newsArray = JSON.parse(await data.text());
            if (!newsArray || newsArray.length === 0) {
                newsItemsContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">لا توجد أخبار منشورة حالياً.</p>';
                return;
            }
            
            newsItemsContainer.innerHTML = '';
            newsArray.forEach(news => {
                const dateString = new Date(news.date).toLocaleDateString('ar-EG');
                const div = document.createElement('div');
                div.style.cssText = 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;';
                div.innerHTML = `
                    <div>
                        <h4 style="color: var(--text-main); margin: 0 0 0.3rem 0; font-size: 1rem;">${news.title}</h4>
                        <span style="color: var(--text-muted); font-size: 0.8rem;">${dateString} • ${news.author}</span>
                    </div>
                    <button onclick="deleteNews(${news.id})" class="btn" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 0.4rem 0.8rem; font-size: 0.85rem;">حذف</button>
                `;
                newsItemsContainer.appendChild(div);
            });
        } catch(e) {
            newsItemsContainer.innerHTML = '<p style="color: #ef4444; font-size: 0.9rem;">خطأ في تحميل الأخبار</p>';
        }
    }

    // Delete Specific News
    window.deleteNews = async function(newsId) {
        if (!confirm('هل أنت متأكد من حذف هذا الخبر؟ سيتم مسحه فوراً من الموقع.')) return;
        
        try {
            newsItemsContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">جاري الحذف...</p>';
            
            let existingNews = [];
            const { data, error } = await supabase.storage.from('pdfs').download('data/bulletin.json');
            if (!error && data) {
                existingNews = JSON.parse(await data.text());
            }
            
            // Filter out the deleted news
            const updatedNews = existingNews.filter(n => n.id !== newsId);
            
            const jsonBlob = new Blob([JSON.stringify(updatedNews)], { type: 'application/json' });
            await supabase.storage.from('pdfs').upload('data/bulletin.json', jsonBlob, { upsert: true });
            
            loadAdminNews();
        } catch(e) {
            console.error(e);
            alert('حدث خطأ أثناء الحذف');
            loadAdminNews();
        }
    };

    // Initialize list on load
    loadAdminNews();
});

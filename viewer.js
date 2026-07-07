document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const folderPath = urlParams.get('path'); // e.g. "exams/data_structures"
    const subjectTitle = urlParams.get('title') || 'مادة غير معروفة';
    
    if (!folderPath) {
        window.location.href = 'index.html';
        return;
    }

    const isExam = folderPath.startsWith('exams/');
    const typeLabel = isExam ? 'امتحانات' : 'ملخصات';

    document.getElementById('page-title').innerText = `${typeLabel} ${subjectTitle}`;
    document.getElementById('page-subtitle').innerText = 'تصفح وحمل الملفات الخاصة بهذه المادة.';
    
    const loadingEl = document.getElementById('loading');
    const fileListEl = document.getElementById('file-list');
    const emptyStateEl = document.getElementById('empty-state');

    let supabase = window.supabaseClient;
    if (!supabase) {
        if (window.supabase) {
            supabase = window.supabase.createClient('https://iyggxbxvjhsnhszfpijv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5Z2d4Ynh2amhzbmhzemZwaWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNTM5ODIsImV4cCI6MjA5ODkyOTk4Mn0.54nO2KVzo9me_X8EvnMpv8oDyxRAwa7l8lfR7S4Ka7A');
            window.supabaseClient = supabase;
        } else {
            document.getElementById('page-title').innerText = 'خطأ في التحميل';
            document.getElementById('page-subtitle').innerText = 'مكتبة قاعدة البيانات لم تحمل بعد. يرجى عمل Refresh قوي (Ctrl + F5).';
            loadingEl.style.display = 'none';
            return;
        }
    }

    try {
        const { data, error } = await supabase.storage.from('pdfs').list(folderPath);

        loadingEl.style.display = 'none';

        if (error) {
            console.error("Error fetching files:", error);
            emptyStateEl.innerHTML = `<h3>حدث خطأ!</h3><p style="color: #ef4444;">${error.message}</p>`;
            emptyStateEl.style.display = 'block';
            return;
        }

        if (!data) {
            emptyStateEl.style.display = 'block';
            return;
        }

        // Filter out any hidden files or empty placeholders if needed
        const files = data.filter(f => f.name !== '.emptyFolderPlaceholder' && f.name.endsWith('.pdf'));

        if (files.length === 0) {
            emptyStateEl.style.display = 'block';
        } else {
            fileListEl.style.display = 'flex';
            
            // Sort files by created_at or name
            files.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            files.forEach(file => {
                const fullPath = `${folderPath}/${file.name}`;
                
                // Get public URL for direct downloading/viewing
                const { data: urlData } = window.supabaseClient.storage.from('pdfs').getPublicUrl(fullPath);
                const fileUrl = urlData.publicUrl;

                const card = document.createElement('div');
                card.className = 'file-card';
                
                // Format file size
                const sizeKB = Math.round(file.metadata.size / 1024);
                let sizeText = sizeKB > 1024 ? `${(sizeKB/1024).toFixed(2)} MB` : `${sizeKB} KB`;

                // Try to prettify the name
                let prettyName = file.name.replace('.pdf', '');
                prettyName = prettyName.replace(/-/g, ' ').replace(/_/g, ' ');
                
                // Capitalize first letters of English names
                prettyName = prettyName.replace(/\b\w/g, c => c.toUpperCase());

                card.innerHTML = `
                    <div class="file-info">
                        <div class="file-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                        </div>
                        <div class="file-details">
                            <h3 dir="auto">${prettyName}</h3>
                            <p>${sizeText} • PDF Document</p>
                        </div>
                    </div>
                    <div class="file-actions">
                        <a href="${fileUrl}" target="_blank" class="action-btn view-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            عرض
                        </a>
                        <a href="${fileUrl}" target="_blank" download class="action-btn download-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            تحميل
                        </a>
                    </div>
                `;
                fileListEl.appendChild(card);
            });
        }
    } catch (err) {
        console.error("Fetch error:", err);
        loadingEl.style.display = 'none';
        emptyStateEl.style.display = 'block';
    }
});

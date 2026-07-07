document.addEventListener('DOMContentLoaded', async () => {
    let supabase = window.supabaseClient;
    if (!supabase) {
        if (window.supabase) {
            supabase = window.supabase.createClient('https://iyggxbxvjhsnhszfpijv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5Z2d4Ynh2amhzbmhzemZwaWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNTM5ODIsImV4cCI6MjA5ODkyOTk4Mn0.54nO2KVzo9me_X8EvnMpv8oDyxRAwa7l8lfR7S4Ka7A');
            window.supabaseClient = supabase;
        } else {
            console.error('Supabase not loaded');
        }
    }
    const newsFeed = document.getElementById('news-feed');
    
    try {
        // Download announcements.json from Supabase Storage
        const { data, error } = await supabase.storage.from('pdfs').download('data/bulletin.json');
        
        if (error) {
            throw error;
        }
        
        const text = await data.text();
        const newsArray = JSON.parse(text);
        
        if (!newsArray || newsArray.length === 0) {
            newsFeed.innerHTML = `
                <div class="no-news">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; opacity: 0.5;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                    <h3>لا توجد أخبار حالياً</h3>
                    <p>تابعنا لمعرفة أحدث الإعلانات والأخبار.</p>
                </div>
            `;
            return;
        }
        
        // Render news
        newsFeed.innerHTML = '';
        
        newsArray.forEach(news => {
            const dateObj = new Date(news.date);
            const dateString = dateObj.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            
            const card = document.createElement('div');
            card.className = 'news-card';
            card.innerHTML = `
                <div class="news-header">
                    <h2 class="news-title">${news.title}</h2>
                    <span class="news-date">${dateString}</span>
                </div>
                <div class="news-content">${news.content}</div>
                <div class="news-author">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    بقلم: ${news.author}
                </div>
            `;
            
            newsFeed.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error fetching news:', error);
        newsFeed.innerHTML = `
            <div class="no-news" style="border-color: rgba(239, 68, 68, 0.3);">
                <h3 style="color: #ef4444;">عذراً، حدث خطأ أثناء جلب الأخبار.</h3>
                <p>يرجى المحاولة مرة أخرى لاحقاً.</p>
            </div>
        `;
    }
});

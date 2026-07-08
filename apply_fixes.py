import os
import re

files = ['level1-term2.html', 'level2-term1.html', 'level2-term2.html']

banner_html = '''
                <div class="students-notice" style="
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(247, 37, 133, 0.15) 100%);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-right: 4px solid var(--primary);
                    border-radius: 12px;
                    padding: 1rem 1.5rem;
                    margin: 1.5rem 0;
                    display: inline-flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.3rem;
                ">
                    <div style="display: flex; align-items: center; gap: 0.5rem; color: #fff; font-size: 1.2rem; font-family: 'Cairo', sans-serif; font-weight: 800;">
                        <span>من الطلاب للطلاب</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <span style="font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 0.85rem; color: #a6c1ee; letter-spacing: 2px;">FROM STUDENTS TO STUDENTS</span>
                </div>
'''

for f in files:
    if not os.path.exists(f): continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # 1. Clean the subject-actions inline style
    content = content.replace('style="display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap;"', '')
    content = content.replace('style="display: flex; gap: 10px; margin-top: 20px;"', '')
    
    # 2. Clean first button flex inline style
    content = content.replace('style="flex: 1; padding: 0.7rem 0.5rem; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; justify-content: center;"', 'style="padding: 0.7rem 0.5rem; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; justify-content: center;"')
    
    # 3. Clean second button flex inline style
    content = content.replace('style="flex: 1; padding: 0.7rem 0.5rem; font-size: 0.9rem; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; justify-content: center;"', 'style="padding: 0.7rem 0.5rem; font-size: 0.9rem; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; justify-content: center;"')
    
    # 4. Clean third button (voice) flex inline style and add voice-btn class
    content = content.replace('class="btn w-100" style="flex: 1 1 100%;', 'class="btn w-100 voice-btn" style="')
    content = content.replace('class="btn w-100" style="flex: 1;', 'class="btn w-100 voice-btn" style="')

    # 5. Insert banner if not present
    if "students-notice" not in content:
        content = content.replace('</h1>', '</h1>\n' + banner_html)
        
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

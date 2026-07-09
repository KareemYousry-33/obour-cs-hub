import os
import re

css_to_add = """
/* Unified Back Button */
.back-btn-wrapper {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    margin-bottom: 1.5rem;
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-main);
    text-decoration: none;
    transition: all 0.3s ease;
    font-weight: 700;
    font-size: 1.1rem;
    font-family: 'Tajawal', sans-serif;
    cursor: pointer;
    padding: 0.5rem 1.2rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
}

.back-link:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
}
"""

with open('d:/.android/obour-cs-hub/index.css', 'a', encoding='utf-8') as f:
    f.write(css_to_add)

# Fix HTML files
def fix_html_files(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                original_content = content
                
                # Remove inline styles from .back-link
                # e.g. class="back-link" style="..."
                content = re.sub(r'class="back-link"\s+style="[^"]*"', 'class="back-link"', content)
                content = re.sub(r'class="([^"]*)\bback-link\b([^"]*)"\s+style="[^"]*"', r'class="\1back-link\2"', content)
                
                # In viewer.html and profile.html, we had justify-content: flex-end
                content = content.replace('justify-content: flex-end;', 'justify-content: flex-start;')
                
                # Wrap isolated .back-link if it's not already in a wrapper or hero-content
                # Actually, simply ensuring justify-content: flex-start works for flex parents.
                # If it's isolated like in exams/oop/index.html, it's already left-aligned because there's no flex container!
                # Wait, in RTL, normal block elements align text to the right. So inline-flex aligns right!
                # The only reason it was on the left in viewer.html was `justify-content: flex-end`.
                # Let's just fix the flex-end to flex-start!
                
                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Fixed: {filepath}")

fix_html_files('d:/.android/obour-cs-hub/')

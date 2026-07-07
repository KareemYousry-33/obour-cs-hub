document.addEventListener('DOMContentLoaded', async () => {
    // Check if we are on a level page
    const path = window.location.pathname.toLowerCase();
    let currentFolder = '';
    
    if (path.includes('level1-term1')) {
        currentFolder = 'level1-term1';
    } else if (path.includes('level1-term2')) {
        currentFolder = 'level1-term2';
    } else if (path.includes('level2-term1')) {
        currentFolder = 'level2-term1';
    } else if (path.includes('level2-term2')) {
        currentFolder = 'level2-term2';
    }
    
    if (!currentFolder) return;
    
    // Supabase client should be loaded from supabase-config.js
    let supabase = window.supabaseClient;
    if (!supabase) {
        if (window.supabase) {
            supabase = window.supabase.createClient('https://iyggxbxvjhsnhszfpijv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5Z2d4Ynh2amhzbmhzemZwaWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNTM5ODIsImV4cCI6MjA5ODkyOTk4Mn0.54nO2KVzo9me_X8EvnMpv8oDyxRAwa7l8lfR7S4Ka7A');
            window.supabaseClient = supabase;
        } else {
            console.error('Supabase not loaded');
            return;
        }
    }
    
    try {
        // List all files in the current folder (e.g. 'level2-term1')
        const { data, error } = await supabase.storage.from('pdfs').list(currentFolder);
        
        if (error) {
            console.error("Error fetching files:", error);
            return;
        }
        
        if (data && data.length > 0) {
            const supabaseUrl = 'https://iyggxbxvjhsnhszfpijv.supabase.co';
            const publicUrlBase = `${supabaseUrl}/storage/v1/object/public/pdfs/${currentFolder}/`;
            
            // Loop through uploaded files
            data.forEach(file => {
                // file.name will be like 'data-structures-summary.pdf'
                if (file.name.endsWith('.pdf')) {
                    // Extract subject and type without the '.pdf'
                    const baseName = file.name.replace('.pdf', ''); 
                    
                    // The button IDs should match this baseName!
                    // Example: btn-data-structures-summary
                    const btnId = `btn-${baseName}`;
                    const button = document.getElementById(btnId);
                    
                    if (button) {
                        // Activate the button
                        button.href = publicUrlBase + file.name;
                        button.target = "_blank"; // Open in new tab
                        button.classList.remove('disabled');
                        button.style.opacity = '1';
                        button.style.cursor = 'pointer';
                        
                        // Change text based on type if it was "قريباً"
                        // But since we pre-set the text to "ملخص" or "امتحان", we don't need to change text.
                    }
                }
            });
        }
        
    } catch (err) {
        console.error("Failed to load PDFs:", err);
    }
});

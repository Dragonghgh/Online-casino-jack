// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    const sessionId = localStorage.getItem('sessionId');
    const currentPage = window.location.pathname.split('/').pop();
    
    if (sessionId) {
        const session = getSession(sessionId);
        if (session) {
            // If on menu page, redirect to game hub
            if (currentPage === 'menu.html') {
                window.location.href = 'game.html';
            }
            return;
        } else {
            localStorage.removeItem('sessionId');
        }
    }
    
    // If not logged in and not on menu page, redirect to menu
    if (currentPage !== 'menu.html') {
        window.location.href = 'menu.html';
    }
});

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorElement = document.getElementById('login-error');
    
    if (!username || !password) {
        errorElement.textContent = 'Please enter both username and password';
        return;
    }
    
    const user = getUser(username);
    
    if (!user || user.password !== password) {
        errorElement.textContent = 'Invalid username or password';
        return;
    }
    
    // Check for chip bonus
    const twelveHours = 12 * 60 * 60 * 1000;
    if (Date.now() - user.lastChipBonus >= twelveHours) {
        const newChips = user.chips + 100;
        updateUser(username, { 
            chips: newChips,
            lastChipBonus: Date.now() 
        });
    }
    
    // Create session
    const sessionId = createSession(username);
    localStorage.setItem('sessionId', sessionId);
    
    window.location.href = 'game.html';
}

function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const errorElement = document.getElementById('register-error');
    
    if (!username || !password) {
        errorElement.textContent = 'Please enter both username and password';
        return;
    }
    
    if (username.length < 4) {
        errorElement.textContent = 'Username must be at least 4 characters';
        return;
    }
    
    if (password.length < 6) {
        errorElement.textContent = 'Password must be at least 6 characters';
        return;
    }
    
    const result = createUser(username, password);
    
    if (result.error) {
        errorElement.textContent = result.error;
        return;
    }
    
    // Create session
    const sessionId = createSession(username);
    localStorage.setItem('sessionId', sessionId);
    
    window.location.href = 'game.html';
}

function logout() {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
        const db = getDatabase();
        delete db.sessions[sessionId];
        saveDatabase(db);
        localStorage.removeItem('sessionId');
    }
    window.location.href = 'menu.html';
}

// Attach logout button if it exists
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Settings menu toggle
    const settingsBtn = document.getElementById('settings-btn');
    const settingsMenu = document.getElementById('settings-menu');
    
    if (settingsBtn && settingsMenu) {
        settingsBtn.addEventListener('click', function() {
            settingsMenu.classList.toggle('hidden');
        });
    }
    
    // Display current user info
    const usernameDisplay = document.getElementById('username-display');
    const chipCount = document.getElementById('chip-count');
    
    if (usernameDisplay && chipCount) {
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
            const session = getSession(sessionId);
            if (session) {
                const user = getUser(session.username);
                if (user) {
                    usernameDisplay.textContent = user.username;
                    chipCount.textContent = user.chips;
                }
            }
        }
    }
});

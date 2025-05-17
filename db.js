// Simple database using localStorage
const DB_NAME = 'fakeMoneyCasino';

function getDatabase() {
    const db = localStorage.getItem(DB_NAME);
    return db ? JSON.parse(db) : { users: [], sessions: {} };
}

function saveDatabase(db) {
    localStorage.setItem(DB_NAME, JSON.stringify(db));
}

function getUser(username) {
    const db = getDatabase();
    return db.users.find(u => u.username === username);
}

function createUser(username, password) {
    const db = getDatabase();
    
    if (db.users.some(u => u.username === username)) {
        return { error: 'Username already exists' };
    }
    
    const newUser = {
        username,
        password, // Note: In a real app, you would hash the password
        chips: 100,
        lastChipBonus: Date.now(),
        gameStats: {
            slots: { wins: 0, losses: 0 },
            blackjack: { wins: 0, losses: 0 }
        }
    };
    
    db.users.push(newUser);
    saveDatabase(db);
    return newUser;
}

function updateUser(username, updates) {
    const db = getDatabase();
    const userIndex = db.users.findIndex(u => u.username === username);
    
    if (userIndex === -1) return false;
    
    db.users[userIndex] = { ...db.users[userIndex], ...updates };
    saveDatabase(db);
    return true;
}

function createSession(username) {
    const db = getDatabase();
    const sessionId = 'session-' + Math.random().toString(36).substr(2, 9);
    db.sessions[sessionId] = { username, expires: Date.now() + 7 * 24 * 60 * 60 * 1000 };
    saveDatabase(db);
    return sessionId;
}

function getSession(sessionId) {
    const db = getDatabase();
    const session = db.sessions[sessionId];
    
    if (!session || session.expires < Date.now()) {
        delete db.sessions[sessionId];
        saveDatabase(db);
        return null;
    }
    
    return session;
}

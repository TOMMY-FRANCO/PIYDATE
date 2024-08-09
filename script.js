// @ts-nocheck

// Login form handling
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    alert(`Login attempted with Username: ${username} and Password: ${password}`);
    // In a real app, you'd send this data to a server for authentication
});

// Match finder
document.getElementById('findMatchBtn').addEventListener('click', function() {
    const matches = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan'];
    const randomMatch = matches[Math.floor(Math.random() * matches.length)];
    document.getElementById('matchResult').textContent = `Your match is ${randomMatch}!`;
});

// Simple animation for welcome message
const welcomeMessage = document.querySelector('#welcome h2');
welcomeMessage.style.opacity = '0';
let opacity = 0;
const fadeIn = setInterval(() => {
    if (opacity < 1) {
        opacity += 0.1;
        welcomeMessage.style.opacity = opacity.toString();
    } else {
        clearInterval(fadeIn);
    }
}, 100);

/* Existing CSS rules... */

#loginForm input, #loginForm button {
    display: block;
    margin: 10px 0;
    padding: 5px;
}

#findMatchBtn {
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
}

#matchResult {
    margin-top: 10px;
    font-weight: bold;
}

// Registration form handling
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }

    // In a real app, you'd send this data to a server to create a new user
    alert(`Registration attempted with Username: ${username}, Email: ${email}`);
    console.log("New user registered:", { username, email, password });
});

// Simulated user authentication
function simulateAuth(username, password) {
    // In a real app, this would be handled server-side
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(user => user.username === username && user.password === password);
}

// Update login form handling
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = simulateAuth(username, password);
    if (user) {
        alert(`Welcome back, ${username}!`);
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUIForLoggedInUser(user);
    } else {
        alert('Invalid username or password.');
    }
});

// Function to update UI for logged in user
function updateUIForLoggedInUser(user) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registrationForm').style.display = 'none';
    
    const profileSection = document.createElement('section');
    profileSection.id = 'profile';
    profileSection.innerHTML = `
        <h2>Welcome, ${user.username}!</h2>
        <p>Email: ${user.email}</p>
        <button id="logoutBtn">Logout</button>
    `;
    document.querySelector('main').appendChild(profileSection);

    document.getElementById('logoutBtn').addEventListener('click', logout);
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    location.reload(); // Reload the page to reset the UI
}

// Check if user is already logged in on page load
window.addEventListener('load', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateUIForLoggedInUser(currentUser);
    }
});

function showEditProfileForm(user) {
    const profileSection = document.getElementById('profile');
    profileSection.innerHTML = `
        <h2>Edit Profile</h2>
        <form id="editProfileForm">
            <input type="text" id="editUsername" value="${user.username}" readonly>
            <input type="email" id="editEmail" value="${user.email}">
            <input type="text" id="editBio" value="${user.bio || ''}" placeholder="Add a bio">
            <button type="submit">Save Changes</button>
        </form>
    `;

    document.getElementById('editProfileForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const updatedUser = {
            ...user,
            email: document.getElementById('editEmail').value,
            bio: document.getElementById('editBio').value
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        updateUIForLoggedInUser(updatedUser);
    });
}

function addPhotoUploadToProfile() {
    const profileSection = document.getElementById('profile');
    const photoUploadHTML = `
        <input type="file" id="photoUpload" accept="image/*">
        <img id="profilePhoto" src="${JSON.parse(localStorage.getItem('currentUser')).photo || ''}" style="max-width: 200px; display: none;">
    `;
    profileSection.insertAdjacentHTML('beforeend', photoUploadHTML);

    document.getElementById('photoUpload').addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = function() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            currentUser.photo = reader.result;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            document.getElementById('profilePhoto').src = reader.result;
            document.getElementById('profilePhoto').style.display = 'block';
        }
        if (file) {
            reader.readAsDataURL(file);
        }
    });
}

function updateUIForLoggedInUser(user) {
    // ... (previous code)
    const profileSection = document.createElement('section');
    profileSection.id = 'profile';
    profileSection.innerHTML = `
        <h2>Welcome, ${user.username}!</h2>
        <p>Email: ${user.email}</p>
        <p>Bio: ${user.bio || 'No bio yet'}</p>
        <button id="editProfileBtn">Edit Profile</button>
        <button id="logoutBtn">Logout</button>
    `;
    document.querySelector('main').appendChild(profileSection);

    document.getElementById('editProfileBtn').addEventListener('click', () => showEditProfileForm(user));
    document.getElementById('logoutBtn').addEventListener('click', logout);

    addPhotoUploadToProfile();
}

// Function to show preferences form
function showPreferencesForm(user) {
    document.getElementById('preferences').style.display = 'block';
    
    // Pre-fill the form if user has existing preferences
    if (user.preferences) {
        document.getElementById('ageRange').value = user.preferences.ageRange;
        document.getElementById('lookingFor').value = user.preferences.lookingFor;
        
        // For multiple select, we need to loop through the options
        const interestsSelect = document.getElementById('interests');
        for (let option of interestsSelect.options) {
            if (user.preferences.interests.includes(option.value)) {
                option.selected = true;
            }
        }
    }

    document.getElementById('preferencesForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const preferences = {
            ageRange: document.getElementById('ageRange').value,
            interests: Array.from(document.getElementById('interests').selectedOptions).map(option => option.value),
            lookingFor: document.getElementById('lookingFor').value
        };
        
        // Update user preferences
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        currentUser.preferences = preferences;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        alert('Preferences saved!');
    });
}

// Update updateUIForLoggedInUser function to include preferences
function updateUIForLoggedInUser(user) {
    // ... (previous code)
    
    const preferencesBtn = document.createElement('button');
    preferencesBtn.textContent = 'Update Preferences';
    preferencesBtn.addEventListener('click', () => showPreferencesForm(user));
    profileSection.appendChild(preferencesBtn);

    // ... (rest of the function)
}

function calculateCompatibility(user1, user2) {
    let score = 0;
    
    // Age range compatibility
    if (user1.preferences.ageRange === user2.preferences.ageRange) {
        score += 2;
    }
    
    // Interests compatibility
    const commonInterests = user1.preferences.interests.filter(interest => 
        user2.preferences.interests.includes(interest)
    );
    score += commonInterests.length;
    
    // "Looking for" compatibility
    if (user1.preferences.lookingFor === user2.preferences.lookingFor) {
        score += 3;
    }
    
    return score;
}

function findMatches(currentUser) {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const potentialMatches = allUsers
        .filter(user => user.username !== currentUser.username)
        .map(user => ({
            ...user,
            compatibilityScore: calculateCompatibility(currentUser, user)
        }))
        .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return potentialMatches;
}

function displayMatches(matches) {
    const matchesSection = document.createElement('section');
    matchesSection.id = 'matches';
    matchesSection.innerHTML = '<h2>Your Matches</h2>';

    matches.forEach(match => {
        const matchElement = document.createElement('div');
        matchElement.innerHTML = `
            <h3>${match.username}</h3>
            <p>Compatibility Score: ${match.compatibilityScore}</p>
            <p>Interests: ${match.preferences.interests.join(', ')}</p>
        `;
        matchesSection.appendChild(matchElement);
    });

    document.querySelector('main').appendChild(matchesSection);
}

// Add a button to find matches in the updateUIForLoggedInUser function
function updateUIForLoggedInUser(user) {
    // ... (previous code)

    const findMatchesBtn = document.createElement('button');
    findMatchesBtn.textContent = 'Find Matches';
    findMatchesBtn.addEventListener('click', () => {
        const matches = findMatches(user);
        displayMatches(matches);
    });
    profileSection.appendChild(findMatchesBtn);

    // ... (rest of the function)
}

// Registration form handling
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }

    const newUser = { username, email, password, preferences: {} };

    // Save the new user
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Log in the new user
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    updateUIForLoggedInUser(newUser);

    // Show preferences form for the new user
    showPreferencesForm(newUser);
});

// Messaging system
function initializeMessaging(currentUser) {
    const messagingSection = document.getElementById('messaging');
    messagingSection.style.display = 'block';

    updateConversationList(currentUser);

    // Set up message sending
    document.getElementById('messageForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value;
        const recipient = document.getElementById('chatPartner').textContent;
        
        sendMessage(currentUser.username, recipient, message);
        messageInput.value = '';
    });
}

function updateConversationList(currentUser) {
    const conversationList = document.getElementById('conversationList');
    conversationList.innerHTML = '<h3>Your Conversations</h3>';

    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    allUsers.forEach(user => {
        if (user.username !== currentUser.username) {
            const conversationBtn = document.createElement('button');
            conversationBtn.textContent = user.username;
            conversationBtn.addEventListener('click', () => openChat(currentUser.username, user.username));
            conversationList.appendChild(conversationBtn);
        }
    });
}

function openChat(currentUsername, partnerUsername) {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.style.display = 'block';

    const chatPartner = document.getElementById('chatPartner');
    chatPartner.textContent = partnerUsername;

    updateMessageList(currentUsername, partnerUsername);

    // Set up periodic updates to simulate real-time
    if (window.chatUpdateInterval) {
        clearInterval(window.chatUpdateInterval);
    }
    window.chatUpdateInterval = setInterval(() => updateMessageList(currentUsername, partnerUsername), 1000);
}

function updateMessageList(currentUsername, partnerUsername) {
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = '';

    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    const relevantMessages = allMessages.filter(msg => 
        (msg.sender === currentUsername && msg.recipient === partnerUsername) ||
        (msg.sender === partnerUsername && msg.recipient === currentUsername)
    );

    relevantMessages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${msg.sender}: ${msg.content}`;
        messageElement.classList.add(msg.sender === currentUsername ? 'sent' : 'received');
        messageList.appendChild(messageElement);
    });

    messageList.scrollTop = messageList.scrollHeight;
}

function sendMessage(sender, recipient, content) {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push({ sender, recipient, content, timestamp: new Date().getTime() });
    localStorage.setItem('messages', JSON.stringify(messages));

    updateMessageList(sender, recipient);
}

// Update updateUIForLoggedInUser function to include messaging
function updateUIForLoggedInUser(user) {
    // ... (previous code)

    const messagingBtn = document.createElement('button');
    messagingBtn.textContent = 'Messages';
    messagingBtn.addEventListener('click', () => initializeMessaging(user));
    profileSection.appendChild(messagingBtn);

    // ... (rest of the function)
}
// In-memory storage for pastes (in a real app, this would be a database)
const pastes = new Map();

// Function to generate a random unique code
function generateUniqueCode(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code;
    do {
        code = '';
        for (let i = 0; i < length; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    } while (pastes.has(code)); // Ensure code is unique
    return code;
}

// Function to show a message
function showMessage(message, isError = false) {
    // Remove any existing message
    const existingMessage = document.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = isError ? 'error-message' : 'success-message';
    messageElement.textContent = message;

    // Insert message after the button that was clicked
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(messageElement, mainContent.firstChild);

    // Remove message after 3 seconds
    setTimeout(() => messageElement.remove(), 3000);
}

// Function to save paste
document.getElementById('saveButton').addEventListener('click', () => {
    const content = document.getElementById('pasteContent').value.trim();
    
    if (!content) {
        showMessage('Please enter some content to save', true);
        return;
    }

    const code = generateUniqueCode();
    pastes.set(code, content);

    // Show success message with the code
    showMessage(`Paste saved! Your code is: ${code}`);
    
    // Clear the textarea
    document.getElementById('pasteContent').value = '';
    
    // Auto-fill the code input
    document.getElementById('pasteCodeInput').value = code;
});

// Function to load paste
document.getElementById('loadButton').addEventListener('click', () => {
    const code = document.getElementById('pasteCodeInput').value.trim();
    
    if (!code) {
        showMessage('Please enter a paste code', true);
        return;
    }

    const content = pastes.get(code);
    
    if (!content) {
        showMessage('Paste not found. Please check the code and try again.', true);
        return;
    }

    // Display the paste
    document.getElementById('pasteDisplay').textContent = content;
    
    // Show view section and hide new paste section
    document.getElementById('newPasteSection').classList.add('hidden');
    document.getElementById('viewPasteSection').classList.remove('hidden');
});

// Function to copy paste content
document.getElementById('copyButton').addEventListener('click', () => {
    const content = document.getElementById('pasteDisplay').textContent;
    navigator.clipboard.writeText(content)
        .then(() => showMessage('Content copied to clipboard!'))
        .catch(() => showMessage('Failed to copy content', true));
});

// Function to create new paste
document.getElementById('newPasteButton').addEventListener('click', () => {
    // Show new paste section and hide view section
    document.getElementById('newPasteSection').classList.remove('hidden');
    document.getElementById('viewPasteSection').classList.add('hidden');
    
    // Clear inputs
    document.getElementById('pasteContent').value = '';
    document.getElementById('pasteCodeInput').value = '';
});

// Handle Enter key in paste code input
document.getElementById('pasteCodeInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('loadButton').click();
    }
});

// Register functionality
document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('register-form');
  
  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Basic validation
    if (!email || !password || !confirmPassword) {
      showMessage('Please fill in all fields', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return;
    }
    
    if (password.length < 6) {
      showMessage('Password must be at least 6 characters long', 'error');
      return;
    }
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showMessage('Account created successfully! Redirecting to login...', 'success');
        
        // Clear form
        registerForm.reset();
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
        
      } else {
        showMessage(data.error || 'Registration failed', 'error');
      }
      
    } catch (error) {
      showMessage('Network error. Please try again.', 'error');
    }
  });
});

function showMessage(message, type = 'info') {
  // Remove existing messages
  const existingMessage = document.querySelector('.message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create new message
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${type}`;
  messageDiv.textContent = message;
  
  // Insert after the form
  const form = document.getElementById('register-form');
  form.parentNode.insertBefore(messageDiv, form.nextSibling);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 5000);
} 
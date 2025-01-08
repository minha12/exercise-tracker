const BASE_URL = window.location.origin;

// Helper function to show results
function showResult(elementId, message) {
  const resultElement = document.getElementById(elementId);
  resultElement.textContent = JSON.stringify(message, null, 2);
  resultElement.classList.add('show');
}

async function handleNewUser(event) {
  event.preventDefault();
  const username = document.getElementById('uname').value;
  const userResult = document.getElementById('user-result');
  
  try {
    const response = await fetch(`${BASE_URL}/api/exercise/new-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${encodeURIComponent(username)}`
    });
    const data = await response.json();
    showResult('user-result', data);
  } catch (error) {
    showResult('user-result', { error: error.message });
  }
}

async function handleExercise(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const body = new URLSearchParams(formData);
  
  try {
    const response = await fetch(`${BASE_URL}/api/exercise/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body
    });
    const data = await response.json();
    showResult('exercise-result', data);
  } catch (error) {
    showResult('exercise-result', { error: error.message });
  }
}

// Add event listeners after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  const newUserForm = document.getElementById('new-user-form');
  const exerciseForm = document.getElementById('exercise-form');
  
  if (newUserForm) newUserForm.addEventListener('submit', handleNewUser);
  if (exerciseForm) exerciseForm.addEventListener('submit', handleExercise);
});

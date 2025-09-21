// THIS IS USED FOR THE EYE ICON TO WORK
document.addEventListener('DOMContentLoaded', () => {
  // Toggle password visibility
  const toggles = document.querySelectorAll('.toggle-password');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', function () {
      const targetSelector = this.getAttribute('data-toggle');
      const input = document.querySelector(targetSelector);

      // It checks the current type (password or text).

      // Then it switches the type:

      // If it's "password" → change to "text" (show the password).

      // If it's "text" → change to "password" (hide the password).
      if (input) {
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;

        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
      }
    });
  });




  // THIS IS THE WHOLE CONNECTION WITH THE BACKEND (SERVER SIDE)
  const loginButton = document.querySelector('.login-button');
  const usernameInput = document.getElementById('signupUsername');
  const passwordInput = document.getElementById('floatingPassword');
  const errorElem = document.getElementById('loginError');

  loginButton.addEventListener('click', async function (e) {
    e.preventDefault();

    //get the username and the password that the user typed
    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        //send to server the username and the password
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      //if there was aproblem show the error message
      if (!response.ok) {
        errorElem.textContent = data.message || "Login failed.";
        errorElem.style.display = "block";
      } else {
        //if there was no problem open the create_note page
        errorElem.style.display = "none";
        window.location.href = "/create_note";
      }
    } catch (err) {
      console.error(err);
      errorElem.textContent = "❌ Network error, please try again.";
      errorElem.style.display = "block";
    }
  });
});
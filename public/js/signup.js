//THIS IS THE CODE WHERE THE SIGN UP PAGE CHECKS IF THE PASSWORD IS VALID

//this is the first input about password
var myInput = document.getElementById("signupPassword");

//this are used to change the style of the each line of the messagebox depending on if they are valid or not
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");

// When the user clicks on the password field, show the message box that tells the user what should be included to their password
myInput.onfocus = function() {
  document.getElementById("message").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
myInput.onblur = function() {
  document.getElementById("message").style.display = "none";
}

// When the user starts to type something inside the password field
myInput.onkeyup = function() {
  // Validate lowercase letters
  var lowerCaseLetters = /[a-z]/g;
  if(myInput.value.match(lowerCaseLetters)) {  
    letter.classList.remove("invalid");
    letter.classList.add("valid");
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
  }
  
  // Validate capital letters
  var upperCaseLetters = /[A-Z]/g;
  if(myInput.value.match(upperCaseLetters)) {  
    capital.classList.remove("invalid");
    capital.classList.add("valid");
  } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
  }

  // Validate numbers
  var numbers = /[0-9]/g;
  if(myInput.value.match(numbers)) {  
    number.classList.remove("invalid");
    number.classList.add("valid");
  } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
  }
  
  // Validate length
  if(myInput.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }
}




//THIS IS FOR THE SIGN UP BUTTON 
$('.signup-button').on('click', async function (e) {

  e.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const errorElem = document.getElementById('signupError');


 //THIS CHECKS IF PASSWORD AND CONFIRM PASSWORD ARE THE SAME 
  if (password !== confirmPassword) {
    errorElem.textContent = "❌ Passwords do not match.";
    errorElem.style.display = 'block';
    $('#confirmPassword').focus();
    return; // stop here
  } else {
    errorElem.textContent = "";
    errorElem.style.display = 'none';
  }

  //this is used to connect the frontend signup button with the backend code about the signup
  try {
    //this is used to send to the backend the username and the password that was received
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      //sends this back   const username = document.getElementById('signupUsername').value; const password = document.getElementById('signupPassword').value;
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    //if there was a problem on the backend show the error message to the user
    if (!response.ok) {
      errorElem.textContent = data.message || "Username already exists.";
      errorElem.style.display = 'block';
    } else {
      //if everything worked fine show the create_note page
      errorElem.style.display = 'none';
      window.location.href = "/create_note"; // proceed normally

    }
  } catch (err) {
    console.error(err);
    errorElem.textContent = "❌ Network error, please try again.";
    errorElem.style.display = 'block';
  }
});



//THIS IS USED FOR THE EYE SHOW
  document.querySelectorAll(".toggle-password").forEach(icon => {
    icon.addEventListener("click", () => {
      const input = document.getElementById(icon.getAttribute("data-target"));
      const type = input.getAttribute("type") === "password" ? "text" : "password";
      input.setAttribute("type", type);
      icon.classList.toggle("fa-eye-slash");
      icon.classList.toggle("fa-eye");
      
    });
  });


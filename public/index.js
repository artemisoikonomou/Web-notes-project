//THIS IS THE CODE WHERE THE SIGN UP PAGE CHECKS IF THE PASSWORD IS VALID

var myInput = document.getElementById("signupPassword");
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");

// When the user clicks on the password field, show the message box
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

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      errorElem.textContent = data.message || "Username already exists.";
      errorElem.style.display = 'block';
    } else {
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




// //THIS CODE IS USED FOR MAKING THE  GO TO TOP BUTTON WHEN I SCROLL DOWN 
//     // Show/hide the button on scroll
//     $(window).on("scroll", function () {
//       if ($(this).scrollTop() > 20) {
//         $("#myBtn").addClass("show");
//       } else {
//         $("#myBtn").removeClass("show");
//       }
//     });

//     // Smooth scroll to top when button is clicked
//     $("#myBtn").on("click", function () {
//       $("html, body").animate({
//         scrollTop: 0
//       }, 600, "linear");
//     });



//SUBMIT BUTTON THIS IS USED ON THE MAIN PAGE (THE CREATE_NOTE PAGE)
// document.addEventListener('DOMContentLoaded', () => {
//   const form = document.getElementById('newWriteForm');
//   if (!form) {
//     console.error("❌ Form element with id 'newWriteForm' not found.");
//     return;
//   }

//   form.addEventListener('submit', async function (event) {
//     event.preventDefault(); // Prevent default form behavior

//     const thought = document.querySelector('textarea[name="thought"]').value.trim();
//     const realization = document.querySelector('textarea[name="realization"]').value.trim();

//     console.log("📝 Form submitted with:");
//     console.log("🧠 Thought:", thought);
//     console.log("💡 Realization:", realization);

//     // Show temp feedback
//     showTempStatus("Sending your thought...");

//     try {
//       const response = await fetch('/submit_thought', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include', // ✅ include cookies/session
//         body: JSON.stringify({ thought, realization }),
//       });

//       console.log("📬 Response received with status:", response.status);

//       if (response.ok) {
//         localStorage.setItem('actionStatus', 'success');
//         localStorage.setItem(
//           'actionMessage',
//           `<img 
//             src="/pictures/check-green.gif" 
//             style="width:50px; height:50px; margin-right:8px; vertical-align:middle; border-radius:6px;" 
//             alt="Success icon"
//           /> <br> <br>Everything is saved successfully!`
//         );
//         location.reload();
//       } else {
//         const errText = await response.text();
//         console.warn("❗ Server responded with an error:", errText);
//         localStorage.setItem('actionStatus', 'error');
//         localStorage.setItem(
//           'actionMessage',
//           `<img 
//             src="/pictures/error.gif" 
//             style="width:50px; height:50px; margin-right:8px; vertical-align:middle; border-radius:6px;" 
//             alt="Error icon"
//           /> <br> <br>Failed to save the post. Server said: ${errText}`
//         );
//         location.reload();
//       }
//     } catch (err) {
//       console.error("🚨 Fetch failed:", err);
//       localStorage.setItem('actionStatus', 'error');
//       localStorage.setItem(
//         'actionMessage',
//         '❌ An error occurred. Please check the console and try again.'
//       );
//       location.reload();
//     }
//   });

//   function showTempStatus(msg) {
//     const alert = document.getElementById('globalAlert');
//     const content = alert?.querySelector('.alert-content');
//     if (alert && content) {
//       content.innerHTML = `⏳ ${msg}`;
//       alert.style.display = 'block';
//     }
//   }
// });



// //THIS CODE IS USED FOR THE EDIT AND SAVE BUTTON IN THE REVIEW_NOTE.EJS

// // document.querySelectorAll(".seperation-border"):
// // Purpose: This selects all elements in the document that have the class .seperation-border.
// // It returns a NodeList (similar to an array) of all the elements that match the class .seperation-border.

// document.querySelectorAll(".seperation-border").forEach(container => {
//   const textarea_thought = container.querySelector(".thought_review");
//   const editBtnT = container.querySelector(".edit-button-thought");
//   const saveBtnT = container.querySelector(".save-button-thought");


//   const textarea_realization = container.querySelector(".realization_review");
//   const editBtnR = container.querySelector(".edit-button-realization");
//   const saveBtnR = container.querySelector(".save-button-realization");

//   // This checks if both editBtnT (the edit button) and textarea_thought (the textarea) exist in the current container.
//   if (editBtnT && textarea_thought) {
//     //THIS MAKES THE TEXTAREA EDITABLE
//     editBtnT.addEventListener("click", () => {
//       textarea_thought.removeAttribute("readonly");
//       textarea_thought.focus();
//     });
//   }

//   if (saveBtnT && textarea_thought) {
//     //WHEN I CLICK THE SAVE BUTTON AFTER THE CHANGES
//     saveBtnT.addEventListener("click", async () => {
//       //MAKE AGAIN THE TEXTAREA NOT EDITABLE AGAIN
//       textarea_thought.setAttribute("readonly", "");

//       //GET THE VALUES OF THE TEXTAREA AND THE ID 
//       const updatedThought = textarea_thought.value;
//       //You typically use this to pass data from HTML to JavaScript—like record IDs, 
//       // user identifiers, or other metadata—without embedding it in the DOM in a more complex way.

//       //THIS WAY IS USED IN VANILLA JS AND NOT JQUERY
//       const id = saveBtnT.dataset.id;

//       try {
//         //USE THE ROUTE THAT WE NEED TO CONNECT WITH THE BACKEND 
//         const response = await fetch(`/update_thought/${id}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           //SEND BACK THE NEW CHANGES
//           body: JSON.stringify({ thought: updatedThought }),
//         });

//         //CHECKS IF EVERYTHING IS FINE WITH THE BACKEND

//         if (response.ok) {
//           //I USE LOCALSTORAGE SO I CAN TEMPORALLY SAVE THE MESSAGES THAT ARE NEEDED FOR THE ALERT MESSAGE
//             localStorage.setItem('actionStatus', 'success');
//             localStorage.setItem(
//               'actionMessage',
//               `<img 
//                 src="/pictures/check-green.gif" 
//                 style="width:50px; height:50px; margin-right:8px; vertical-align:middle; border-radius:6px;" 
//                 alt="Success icon"
//               /> <br> <br>Everything was saved successfully!`
//             );

//         } else {
//             localStorage.setItem('actionStatus', 'error');
//             localStorage.setItem(
//               'actionMessage',
//               `<img 
//                 src="/pictures/error.gif" 
//                 style="width:50px; height:50px; margin-right:8px; vertical-align:middle; border-radius:6px;" 
//                 alt="Success icon"
//               /> <br> <br>Failed to save the changes.`
//             );
//     }
//             location.reload();
//       } catch (err) {
//           console.error(err);
//           localStorage.setItem('actionStatus', 'error');
//           localStorage.setItem('actionMessage', '❌ An error occurred. Please try again.');
//           location.reload();
//       }
//     });
//   }

//   // Realization edit/save
//   if (editBtnR && textarea_realization) {
//     editBtnR.addEventListener("click", () => {
//       textarea_realization.removeAttribute("readonly");
//       textarea_realization.focus();
//     });
//   }

//   if (saveBtnR && textarea_realization) {
//     saveBtnR.addEventListener("click", async () => {
//       textarea_realization.setAttribute("readonly", "");
//       const updatedRealization = textarea_realization.value;
//       const id = saveBtnR.dataset.id;

//       try {
//         const response = await fetch(`/update_realization/${id}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ realization: updatedRealization }), 
//         });

//        if (response.ok) {
//             localStorage.setItem('actionStatus', 'success');
//             localStorage.setItem(
//               'actionMessage',
//               `<img 
//                 src="/pictures/check-green.gif" 
//                 style="width:50px; height:50px; margin-right:8px; vertical-align:middle; border-radius:6px;" 
//                 alt="Success icon"
//               /> <br> <br>Everything was saved successfully!`
//             );

//         } else {
//             localStorage.setItem('actionStatus', 'error');
//             localStorage.setItem(
//               'actionMessage',
//               `<img 
//                 src="/pictures/error.gif" 
//                 style="width:50px; height:50px; margin-right:8px; vertical-align:middle; border-radius:6px;" 
//                 alt="Success icon"
//               /> <br> <br>Failed to save the changes.`
//             );
//           }
//             location.reload();
//       } catch (err) {
//           console.error(err);
//           localStorage.setItem('actionStatus', 'error');
//           localStorage.setItem('actionMessage', '❌ An error occurred. Please try again.');
//           location.reload();
//       }
//     });
//   }
// });


// // DELETE HANDLER
// $('.delete-post-button').on('click', async function () {
//   const id = $(this).data('id');

//   const confirmed = confirm("Are you sure you want to delete this entire post?");
//   if (!confirmed) return;

//   try {
//     const response = await fetch(`/delete_thought/${id}`, {
//       method: 'DELETE'
//     });
//     if (response.ok) {
//       //SET THE ACTION IT CAN BE EITHER SUCCESS OR ERROR SO THAT WE CAN KNOW THE MESSAGE THAT FOLLOWS,IS MORE FOR A BACKEND USE
//       localStorage.setItem('actionStatus', 'success');
//       //SET THE MESSAGE THAT WILL BE SHOWN TO THE FRONTEND
//       localStorage.setItem(
//         'actionMessage',
//         `<img 
//           src="/pictures/check-green.gif" 
//           style="width:50px; height:50px; margin-right:8px; vertical-align:middle; border-radius:6px;" 
//           alt="Success icon"
//         /> <br> <br>Post deleted successfully!`
//       );
//       location.reload();
//     } else {
//       localStorage.setItem('actionStatus', 'error');
//       localStorage.setItem(
//         'actionMessage',
//         `<img 
//           src="/pictures/error.gif" 
//           style="width:50px; height:50px; margin-right:8px; vertical-align:middle; border-radius:6px;" 
//           alt="Success icon"
//         /> <br> <br>Failed to delete the post.`
//       );
//       location.reload();
//     }

//     location.reload(); // reload in both cases
//   } catch (err) {
//     console.error(err);
//     localStorage.setItem('actionStatus', 'error');
//     localStorage.setItem('actionMessage', '❌ An error occurred. Please try again.');
//     location.reload();
//   }
// });


//THIS IS USED WHEN I SAVE OR DELETE OR EDIT SOMETHING IN THE MAIN PAGE 
// ALERT HANDLER ON PAGE LOAD
// window.addEventListener('DOMContentLoaded', () => {
//   //THIS IS THE ALERT BOX FROM THE FRONTEND CODE
//   const alertBox = document.querySelector("#globalAlert");
//   //THIS ARE THE actionStatus AND THE actionMessage THAT I CREATED ON THE FETCH
//   const status = localStorage.getItem('actionStatus');
//   const message = localStorage.getItem('actionMessage');
// //CHECK IF EVERYTHING EXISTS AND THEN SHOW THE ALERT BOX
//   if (status && message && alertBox) {
//     alertBox.classList.add("show");
//     alertBox.querySelector(".alert-content").innerHTML = message;
//     alertBox.style.visibility = 'visible';
//     alertBox.style.opacity = '1';

//     // Clear the flags after showing
//     localStorage.removeItem('actionStatus');
//     localStorage.removeItem('actionMessage');

//     // X button functionality
//     const closeButton = alertBox.querySelector('.closebtn');
//     if (closeButton) {
//       closeButton.addEventListener('click', () => {
//         alertBox.style.opacity = '0';
//         setTimeout(() => {
//           alertBox.style.visibility = 'hidden';
//         }, 600);
//       });
//     }
//   }
// });





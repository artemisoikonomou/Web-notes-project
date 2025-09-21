
  //THIS IS USED WHEN I SAVE OR DELETE OR EDIT SOMETHING IN THE MAIN PAGE , IT POPS UP A MESSAGE OF SUCCESS OR ERROR
  // ALERT HANDLER ON PAGE LOAD


  window.addEventListener('DOMContentLoaded', () => {
    
    //THIS IS THE ALERT BOX FROM THE FRONTEND CODE
    const alertBox = document.querySelector("#globalAlert");
    //THIS ARE THE actionStatus AND THE actionMessage THAT I CREATED ON THE FETCH
    const status = localStorage.getItem('actionStatus');
    const message = localStorage.getItem('actionMessage');
  //CHECK IF EVERYTHING EXISTS AND THEN SHOW THE ALERT BOX
    if (status && message && alertBox) {
      alertBox.classList.add("show");
      alertBox.querySelector(".alert-content").innerHTML = message;
      alertBox.style.visibility = 'visible';
      alertBox.style.opacity = '1';

      // Clear the flags after showing
      localStorage.removeItem('actionStatus');
      localStorage.removeItem('actionMessage');

      // X button functionality
      const closeButton = alertBox.querySelector('.closebtn');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          alertBox.style.opacity = '0';
          setTimeout(() => {
            alertBox.style.visibility = 'hidden';
          }, 600);
        });
      }
    }
  });

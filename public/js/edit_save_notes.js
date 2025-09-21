
//THIS CODE IS USED FOR THE EDIT AND SAVE BUTTON IN THE REVIEW_NOTE.EJS

// document.querySelectorAll(".seperation-border"):
// Purpose: This selects all elements in the document that have the class .seperation-border.
// It returns a NodeList (similar to an array) of all the elements that match the class .seperation-border.

document.querySelectorAll(".seperation-border").forEach(container => {
  const textarea_thought = container.querySelector(".thought_review");
  const editBtnT = container.querySelector(".edit-button-thought");
  const saveBtnT = container.querySelector(".save-button-thought");


  const textarea_realization = container.querySelector(".realization_review");
  const editBtnR = container.querySelector(".edit-button-realization");
  const saveBtnR = container.querySelector(".save-button-realization");

  // This checks if both editBtnT (the edit button) and textarea_thought (the textarea) exist in the current container.
  if (editBtnT && textarea_thought) {
    //THIS MAKES THE TEXTAREA EDITABLE
    editBtnT.addEventListener("click", () => {
      textarea_thought.removeAttribute("readonly");
      textarea_thought.focus();
    });
  }

  // This checks if both editBtnT (the edit button) and textarea_realization (the textarea) exist in the current container.
  if (editBtnR && textarea_realization) {
    editBtnR.addEventListener("click", () => {
      textarea_realization.removeAttribute("readonly");
      textarea_realization.focus();
    });
  }

  if (saveBtnT && textarea_thought) {
    //WHEN I CLICK THE SAVE BUTTON AFTER THE CHANGES
    saveBtnT.addEventListener("click", async () => {
      //MAKE AGAIN THE TEXTAREA NOT EDITABLE AGAIN
      textarea_thought.setAttribute("readonly", "");

      //GET THE VALUES OF THE TEXTAREA AND THE ID 
      const updatedThought = textarea_thought.value;
      //You typically use this to pass data from HTML to JavaScript—like record IDs, 
      // user identifiers, or other metadata—without embedding it in the DOM in a more complex way.

      //THIS WAY IS USED IN VANILLA JS AND NOT JQUERY
      const id = saveBtnT.dataset.id;

      try {
        //USE THE ROUTE THAT WE NEED TO CONNECT WITH THE BACKEND 
        const response = await fetch(`/update_thought/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          //SEND BACK THE NEW CHANGES
          body: JSON.stringify({ thought: updatedThought }),
        });

        //CHECKS IF EVERYTHING IS FINE WITH THE BACKEND

        if (response.ok) {
          //I USE LOCALSTORAGE SO I CAN TEMPORALLY SAVE THE MESSAGES THAT ARE NEEDED FOR THE ALERT MESSAGE
            localStorage.setItem('actionStatus', 'success');
            localStorage.setItem(
              'actionMessage',
              `<img 
                src="/pictures/check-green.gif" 
                style="width:50px; height:50px; margin-right:8px; vertical-align:middle; border-radius:6px;" 
                alt="Success icon"
              /> <br> <br>Everything was saved successfully!`
            );

        } else {
            localStorage.setItem('actionStatus', 'error');
            localStorage.setItem(
              'actionMessage',
              `<img 
                src="/pictures/error.gif" 
                style="width:50px; height:50px; margin-right:8px; vertical-align:middle; border-radius:6px;" 
                alt="Success icon"
              /> <br> <br>Failed to save the changes.`
            );
    }
            location.reload();
      } catch (err) {
          console.error(err);
          localStorage.setItem('actionStatus', 'error');
          localStorage.setItem('actionMessage', '❌ An error occurred. Please try again.');
          location.reload();
      }
    });
  }



  if (saveBtnR && textarea_realization) {
    saveBtnR.addEventListener("click", async () => {
      textarea_realization.setAttribute("readonly", "");
      const updatedRealization = textarea_realization.value;
      const id = saveBtnR.dataset.id;

      try {
        const response = await fetch(`/update_realization/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ realization: updatedRealization }), 
        });

       if (response.ok) {
            localStorage.setItem('actionStatus', 'success');
            localStorage.setItem(
              'actionMessage',
              `<img 
                src="/pictures/check-green.gif" 
                style="width:50px; height:50px; margin-right:8px; vertical-align:middle; border-radius:6px;" 
                alt="Success icon"
              /> <br> <br>Everything was saved successfully!`
            );

        } else {
            localStorage.setItem('actionStatus', 'error');
            localStorage.setItem(
              'actionMessage',
              `<img 
                src="/pictures/error.gif" 
                style="width:50px; height:50px; margin-right:8px; vertical-align:middle; border-radius:6px;" 
                alt="Success icon"
              /> <br> <br>Failed to save the changes.`
            );
          }
            location.reload();
      } catch (err) {
          console.error(err);
          localStorage.setItem('actionStatus', 'error');
          localStorage.setItem('actionMessage', '❌ An error occurred. Please try again.');
          location.reload();
      }
    });
  }
});

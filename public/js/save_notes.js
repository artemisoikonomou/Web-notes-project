document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('newWriteForm');
    // if (!form) {
    //     console.error("❌ Form element with id 'newWriteForm' not found.");
    //     return;
    // }

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form behavior

        //this gets the thought and/or the realization of the users input
        const thought = document.querySelector('textarea[name="thought"]').value.trim();
        const realization = document.querySelector('textarea[name="realization"]').value.trim();


        try {
            //this sends to server the thought and/or the realization of the user
            const response = await fetch('/submit_thought', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include', // ✅ include cookies/session
                body: JSON.stringify({ thought, realization }),
            });

            //if everything went well on the backend show the message box
            if (response.ok) {
                localStorage.setItem('actionStatus', 'success');
                localStorage.setItem(
                'actionMessage',
                `<img 
                    src="/pictures/check-green.gif" 
                    style="width:50px; height:50px; margin-right:8px; vertical-align:middle; border-radius:6px;" 
                    alt="Success icon"
                /> <br> <br>Everything is saved successfully!`
                );
                location.reload();
            } else {
                const errorData = await response.json();
                console.warn("Server responded with an error:", errorData);
                localStorage.setItem('actionStatus', 'error');
                localStorage.setItem(
                'actionMessage',
                `<img 
                    src="/pictures/error.gif" 
                    style="width:50px; height:50px; margin-right:8px; vertical-align:middle; border-radius:6px;" 
                    alt="Error icon"
                /> <br> <br>Failed to save the post. Server said: ${errorData.error || "Unknown error"}`
                );
                location.reload();
            }
        } catch (err) {
            console.error("Fetch failed:", err);
            localStorage.setItem('actionStatus', 'error');
            localStorage.setItem(
                'actionMessage',
                'An error occurred. Please check the console and try again.'
            );
            location.reload();
        }
    });

});
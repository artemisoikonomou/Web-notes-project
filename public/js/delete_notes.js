// DELETE HANDLER
$('.delete-post-button').on('click', async function () {
  const id = $(this).data('id');

  const confirmed = confirm("Are you sure you want to delete this entire post?");
  if (!confirmed) return;

  try {
    const response = await fetch(`/delete_thought/${id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      //SET THE ACTION IT CAN BE EITHER SUCCESS OR ERROR SO THAT WE CAN KNOW THE MESSAGE THAT FOLLOWS,IS MORE FOR A BACKEND USE
      localStorage.setItem('actionStatus', 'success');
      //SET THE MESSAGE THAT WILL BE SHOWN TO THE FRONTEND
      localStorage.setItem(
        'actionMessage',
        `<img 
          src="/pictures/check-green.gif" 
          style="width:50px; height:50px; margin-right:8px; vertical-align:middle; border-radius:6px;" 
          alt="Success icon"
        /> <br> <br>Post deleted successfully!`
      );
      location.reload();
    } else {
      localStorage.setItem('actionStatus', 'error');
      localStorage.setItem(
        'actionMessage',
        `<img 
          src="/pictures/error.gif" 
          style="width:50px; height:50px; margin-right:8px; vertical-align:middle; border-radius:6px;" 
          alt="Success icon"
        /> <br> <br>Failed to delete the post.`
      );
      location.reload();
    }

    location.reload(); // reload in both cases
  } catch (err) {
    console.error(err);
    localStorage.setItem('actionStatus', 'error');
    localStorage.setItem('actionMessage', '❌ An error occurred. Please try again.');
    location.reload();
  }
});


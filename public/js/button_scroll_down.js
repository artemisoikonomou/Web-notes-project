     //THIS CODE IS USED FOR MAKING THE  GO TO TOP BUTTON WHEN I SCROLL DOWN 
    // Show/hide the button on scroll
    $(window).on("scroll", function () {
      if ($(this).scrollTop() > 20) {
        $("#myBtn").addClass("show");
      } else {
        $("#myBtn").removeClass("show");
      }
    });

    // Smooth scroll to top when button is clicked
    $("#myBtn").on("click", function () {
      $("html, body").animate({
        scrollTop: 0
      }, 600, "linear");
    });


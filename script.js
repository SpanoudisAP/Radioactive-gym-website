// Form starts
$(document).ready(function(){
    $(`#Contactform`).on("submit", function(event) {
        event.preventDefault(); // Prevents form from submitting to a server

        var name = document.querySelector("#name").value;
        var email = document.querySelector("#email").value;
        var subject = document.querySelector("#subject").value;
        var message = document.querySelector("#message").value;

        var formDetails = `
        Name: ${name}
        Email: ${email} 
        Subject: ${subject}
        Message: ${message}`;
        
        alert(formDetails); // Aletrt faction for the Form
    }); //Form ends
});

$(document).ready(function() {
    // Check if dark mode is set in cookies
    const darkModeEnabled = Cookies.get('darkMode') === 'true';

    // Function to toggle dark mode
    function setDarkMode(isDarkMode) {
        $('body').toggleClass('dark-mode', isDarkMode);

        // Update aria-label for accessibility
        const button = $('#toggleButton');
        button.attr('aria-label', isDarkMode ? 'Disable dark mode' : 'Enable dark mode');

        // Toggle navbar, modal, and footer classes
        $('.navbar').toggleClass('navbar-light bg-light', !isDarkMode).toggleClass('navbar-dark bg-dark', isDarkMode);
        $('.modal-content').toggleClass('modal-dark', isDarkMode);
        $('footer').toggleClass('bg-light', !isDarkMode).toggleClass('bg-dark text-white', isDarkMode);

        // Save the user's dark mode preference
        Cookies.set('darkMode', isDarkMode, { expires: 7 });
    }

    // Initialize dark mode on page load
    setDarkMode(darkModeEnabled);

    // Toggle dark mode on button click
    $('#toggleButton').click(function() {
        const isDarkMode = !$('body').hasClass('dark-mode');
        setDarkMode(isDarkMode);
    });
});
// Form starts
document.querySelector("#Contactform").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevents form from submitting to a server

    var name = document.querySelector("#name").value;
    var email = document.querySelector("#email").value;
    var subject = document.querySelector("#subject").value;
    var message = document.querySelector("#message").value;

    var formDetails = `
	name: ${name}
    Email: ${email} 
    Subject: ${subject}
    Message: ${message}`;
    
    alert(formDetails); // Aletr faction for the Form
}); //Form ends


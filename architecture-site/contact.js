
const form = document.getElementById('form');
const name = document.getElementById('name');
const email = document.getElementById('email');
const checkbox = document.getElementById('checkbox')
const error_messages = document.getElementById('error-messages');

form.addEventListener('submit', function(event) {
    
    event.preventDefault();
    error_messages.innerHTML = "";

    validate_form();
});

function validate_form() {
    let valid = true;
    let messages = [];

    if (/\d/.test(name.value)) {
        messages.push('Please enter a name without numbers.');
        valid = false;
    }

    if (email.value === "" || !email.value.includes('@') || !email.value.includes('.')) {
        messages.push('Please enter a valid email.');
        valid = false;
    }

    if (!checkbox.checked) {
        messages.push('You need to confirm send.')
        valid = false;
    }


    if (!valid) {
        error_messages.innerHTML = messages.join('<br>');
    } else {
        form.submit();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('userForm');
    const submitButton = document.querySelector('.submit-button');
    const inputs = document.querySelectorAll('#userForm input');
    const labels = document.querySelectorAll('#userForm label');

    // Function to check if all fields are filled and valid
    function checkFields() {
        let allFilled = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                allFilled = false;
            }
        });
        return allFilled;
    }

    // Function to enable/disable submit button
    function toggleSubmitButton() {
        if (checkFields()) {
            submitButton.classList.add('enabled');
            submitButton.disabled = false;
        } else {
            submitButton.classList.remove('enabled');
            submitButton.disabled = true;
        }
    }

    // Attach event listeners to all inputs
    inputs.forEach(input => {
        input.addEventListener('input', toggleSubmitButton);
    });

    labels.forEach(label => {
        label.addEventListener('input', toggleSubmitButton);
    });

    // Initial check to set the correct button state
    toggleSubmitButton();

    // Form submission event
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!checkFields()) {
            console.log('Form has errors.');
            return;
        }

        // Process form submission
        console.log('Form is valid and ready to submit.');
        // Add further processing logic here...
    });
});

document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const country = document.getElementById('country').value.trim();
    const city = document.getElementById('city').value.trim();
    const email = document.getElementById('email').value.trim();
    const website = document.getElementById('website').value.trim();

    // Clear previous error states
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.label-error').forEach(el => el.classList.remove('label-error'));
    document.querySelectorAll('.error-text').forEach(el => el.style.display = 'none');

    // Validate form values
    let isValid = true;

    if (!isNameValid(name)) {
        setError(document.getElementById('name'), 'Name must contain at least 2 words and be 4-60 characters long.');
        isValid = false;
    }

    if (!isCountryOrCityValid(country)) {
        setError(document.getElementById('country'), 'Country must be 2-40 characters long and contain only letters and spaces.');
        isValid = false;
    }

    if (!isCountryOrCityValid(city)) {
        setError(document.getElementById('city'), 'City must be 2-40 characters long and contain only letters and spaces.');
        isValid = false;
    }

    if (!isEmailValid(email)) {
        setError(document.getElementById('email'), 'Please enter a valid email address.');
        isValid = false;
    }

    if (!isWebsiteValid(website)) {
        setError(document.getElementById('website'), 'Please enter a valid website URL.');
        isValid = false;
    }

    if (isValid) {
        // Create new record
        const newRecord = {
            id: Date.now(), // Unique ID
            nameSurname: name,
            company: '', // Company field is not available in the form
            email: email,
            phone: '', // Phone field is not available in the form
            website: website,
            country: country,
            city: city,
            date: new Date().toLocaleDateString() // Current date
        };

        // Fetch existing data from localStorage (simulating the JSON file)
        const existingData = JSON.parse(localStorage.getItem('mockData')) || [];

        // Add new record to existing data
        existingData.push(newRecord);

        // Save updated data back to localStorage
        localStorage.setItem('mockData', JSON.stringify(existingData));

        // Redirect to the list page
        window.location.href = 'Search.html';
    }
});

function setError(element, message) {
    element.classList.add('input-error');
    element.classList.add('label-error');
    element.nextElementSibling.textContent = message;
    element.nextElementSibling.style.display = 'block';
}

function isNameValid(name) {
    const words = name.trim().split(/\s+/);
    return words.length >= 2 && /^[a-zA-Z\s]{4,60}$/.test(name);
}

function isCountryOrCityValid(text) {
    return /^[a-zA-Z\s]{2,40}$/.test(text);
}

function isEmailValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isWebsiteValid(website) {
    return /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[^\s]*)?$/.test(website);
}

// Additional code for disabling/enabling the submit button based on form validity
function toggleAddButton() {
    document.querySelector('.submit-button').disabled = !areAllFieldsValid();
}

function areAllFieldsValid() {
    const name = document.getElementById('name').value.trim();
    const country = document.getElementById('country').value.trim();
    const city = document.getElementById('city').value.trim();
    const email = document.getElementById('email').value.trim();
    const website = document.getElementById('website').value.trim();

    return (
        isNameValid(name) &&
        isCountryOrCityValid(country) &&
        isCountryOrCityValid(city) &&
        isEmailValid(email) &&
        isWebsiteValid(website)
    );
}

document.getElementById('name').addEventListener('input', toggleAddButton);
document.getElementById('country').addEventListener('input', toggleAddButton);
document.getElementById('city').addEventListener('input', toggleAddButton);
document.getElementById('email').addEventListener('input', toggleAddButton);
document.getElementById('website').addEventListener('input', toggleAddButton);
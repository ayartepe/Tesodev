// Hide error messages initially
document.querySelectorAll('.error-text').forEach(el => el.style.display = 'none');
document.querySelectorAll('.error-label').forEach(el => el.style.display = 'none');

// Validation functions
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

function setError(element, message) {
    element.classList.add('input-error');
    element.nextElementSibling.textContent = message;
    element.nextElementSibling.style.display = 'block';

    const label = element.previousElementSibling;
    if (label) {
        label.classList.add('label-error'); 
    }
}

function clearError(element) {
    element.classList.remove('input-error');
    element.nextElementSibling.style.display = 'none';

    const label = element.previousElementSibling;
    if (label) {
        label.classList.remove('label-error'); 
    }
}

// Check if all fields are valid
function areAllFieldsValid() {
    const name = document.getElementById('name').value.trim();
    const country = document.getElementById('country').value.trim();
    const city = document.getElementById('city').value.trim();
    const email = document.getElementById('email').value.trim();
    const website = document.getElementById('website').value.trim();

    let isValid = true;

    if (!isNameValid(name)) {
        setError(document.getElementById('name'), 'Name must contain at least 2 words and be 4-60 characters long.');
        isValid = false;
    } else {
        clearError(document.getElementById('name'));
    }

    if (!isCountryOrCityValid(country)) {
        setError(document.getElementById('country'), 'Country must be 2-40 characters long and contain only letters and spaces.');
        isValid = false;
    } else {
        clearError(document.getElementById('country'));
    }

    if (!isCountryOrCityValid(city)) {
        setError(document.getElementById('city'), 'City must be 2-40 characters long and contain only letters and spaces.');
        isValid = false;
    } else {
        clearError(document.getElementById('city'));
    }

    if (!isEmailValid(email)) {
        setError(document.getElementById('email'), 'Please enter a valid email address.');
        isValid = false;
    } else {
        clearError(document.getElementById('email'));
    }

    if (!isWebsiteValid(website)) {
        setError(document.getElementById('website'), 'Please enter a valid website URL.');
        isValid = false;
    } else {
        clearError(document.getElementById('website'));
    }

    return isValid;
}

// Enable or disable the submit button based on form validity
function toggleAddButton() {
    document.querySelector('.submit-button').disabled = !areAllFieldsValid();
}

// Event listeners for form fields
document.getElementById('name').addEventListener('input', toggleAddButton);
document.getElementById('country').addEventListener('input', toggleAddButton);
document.getElementById('city').addEventListener('input', toggleAddButton);
document.getElementById('email').addEventListener('input', toggleAddButton);
document.getElementById('website').addEventListener('input', toggleAddButton);

document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();

    if (areAllFieldsValid()) {
        // Get form values
        const name = document.getElementById('name').value.trim();
        const country = document.getElementById('country').value.trim();
        const city = document.getElementById('city').value.trim();
        const email = document.getElementById('email').value.trim();
        const website = document.getElementById('website').value.trim();

        // Create new record
        const newRecord = {
            id: Date.now(), // Unique ID
            nameSurname: name,
            company: '', 
            email: email,
            phone: '', 
            website: website,
            country: country,
            city: city,
            date: new Date().toLocaleDateString() 
        };

        // Fetch existing data from localStorage (simulating the JSON file)
        let existingData = JSON.parse(localStorage.getItem('mockData')) || [];

        // Add new record to existing data
        existingData.push(newRecord);

        // Save updated data back to localStorage
        localStorage.setItem('mockData', JSON.stringify(existingData));

        // Redirect to the list page
        window.location.href = 'Search.html';
    } else {
        console.log('Form has errors.');
    }
});
let data = [];
let currentPage = 1;
const resultsPerPage = 5;

// Fetch data on page load
async function fetchData() {
    const response = await fetch('mock-data.json');
    const jsonData = await response.json();
    const localData = JSON.parse(localStorage.getItem('mockData')) || [];

    data = jsonData.data.map(item => {
        return {
            id: item[0],
            nameSurname: item[1],
            company: item[2],
            email: item[3],
            phone: item[4],
            website: item[5],
            country: item[6],
            city: item[7],
            date: item[8]
        };
    });

    data = data.concat(localData);

    // Perform initial search with URL query parameter
    const params = getQueryParams();
    const searchQuery = params.query || '';
    document.getElementById('searchInput').value = searchQuery;
    performSearch();
}

// Get query parameters from URL
function getQueryParams() {
    const params = {};
    const queryString = window.location.search.slice(1);
    const parts = queryString.split('&');
    parts.forEach(part => {
        const [key, value] = part.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return params;
}

// Perform the search based on the input
function performSearch() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const order = document.getElementById('order').value;

    let filteredData = data.filter(item => 
        item.nameSurname.toLowerCase().includes(searchInput) ||
        item.company.toLowerCase().includes(searchInput) ||
        item.email.toLowerCase().includes(searchInput) ||
        item.phone.toLowerCase().includes(searchInput) ||
        item.website.toLowerCase().includes(searchInput) ||
        item.country.toLowerCase().includes(searchInput) ||
        item.city.toLowerCase().includes(searchInput) ||
        item.date.includes(searchInput)
    );

    if (order === 'name_asc') {
        filteredData.sort((a, b) => a.nameSurname.localeCompare(b.nameSurname));
    } else if (order === 'name_desc') {
        filteredData.sort((a, b) => b.nameSurname.localeCompare(a.nameSurname));
    } else if (order === 'year_asc') {
        filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (order === 'year_desc') {
        filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    displayResults(filteredData);
}

// Display search results
function displayResults(filteredData) {
    const results = document.getElementById('results');
    results.innerHTML = '';

    const start = (currentPage - 1) * resultsPerPage;
    const end = start + resultsPerPage;
    const paginatedData = filteredData.slice(start, end);

    paginatedData.forEach(item => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result';
        resultDiv.innerHTML = `
            <div class="result-info">
                <p class="address"> <img src="location symbol.png" alt="Location symbol" class="location-icon"> ${item.city}, ${item.country}</p>
                <p class="email">${item.email}</p>
                <p class="phone">${item.phone}</p>
                <p class="website"><a href="${item.website}" target="_blank">${item.website}</a></p>
            </div>
            <div class="result-meta">
                <p class="name">${item.nameSurname}</p>
                <p class="date">${item.date}</p>
            </div>
        `;
        results.appendChild(resultDiv);
    });

    updatePagination(filteredData.length);
}

function updatePagination(totalResults) {
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const paginationContainer = document.getElementById('pagination');

    const prevButton = paginationContainer.querySelector('#prevPage');
    const nextButton = paginationContainer.querySelector('#nextPage');

    paginationContainer.querySelectorAll('.page-number, .ellipsis').forEach(button => button.remove());

    if (totalPages <= 1) {
        prevButton.disabled = true;
        nextButton.disabled = true;
        return;
    }

    // Helper function to create a page button
    const createPageButton = (pageNumber) => {
        const button = document.createElement('button');
        button.textContent = pageNumber;
        button.className = 'page-number';
        button.onclick = () => goToPage(pageNumber);
        if (pageNumber === currentPage) {
            button.classList.add('active');
        }
        paginationContainer.insertBefore(button, nextButton);
    };

    if (currentPage > 2) {
        createPageButton(1); // Always show the first page

        if (currentPage > 3) {
            // Add ellipsis if current page is greater than 3
            const ellipsisStart = document.createElement('span');
            ellipsisStart.className = 'ellipsis';
            ellipsisStart.textContent = '...';
            paginationContainer.insertBefore(ellipsisStart, nextButton);
        }
    }

    // Add page buttons around the current page
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
        createPageButton(i);
    }

    if (currentPage < totalPages - 1) {
        if (currentPage < totalPages - 2) {
            // Add ellipsis if current page is less than total pages - 2
            const ellipsisEnd = document.createElement('span');
            ellipsisEnd.className = 'ellipsis';
            ellipsisEnd.textContent = '...';
            paginationContainer.insertBefore(ellipsisEnd, nextButton);
        }

        createPageButton(totalPages); // Always show the last page
    }

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

function changePage(direction) {
    currentPage += direction;
    performSearch();
}

function goToPage(pageNumber) {
    currentPage = pageNumber;
    performSearch();
}

fetchData();

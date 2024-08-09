document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    if (name.split(' ').length < 2) {
        document.querySelector('.error-message').style.display = 'block';
    } else {
        document.querySelector('.error-message').style.display = 'none';
    }
});

function performSearch() {

}

function addNewRecord() {

}

const data = {
    "cols": [
      "id",
      "nameSurname",
      "company",
      "email",
      "phone",
      "website",
      "country",
      "city",
      "date"
    ],
    "data": [
      [
        1,
        "Barris Dusting",
        "Pixonyx",
        "bdusting0@tamu.edu",
        "499-866-1927",
        "https://loc.gov/ultricies/eu/nibh/quisque/id/justo.jsp",
        "China",
        "Yanshi",
        "5/10/2021"
      ]
    ]
  };
  
  // Arama sonuçlarını render etmek için fonksiyon
  function renderResults() {
    const resultsContainer = document.querySelector('.results');
    resultsContainer.innerHTML = ''; // Önceki sonuçları temizle
  
    data.data.forEach(record => {
      const resultItem = document.createElement('div');
      resultItem.classList.add('result-item');
  
      const nameSurname = document.createElement('div');
      nameSurname.textContent = `Name: ${record[1]}`;
  
      const company = document.createElement('div');
      company.textContent = `Company: ${record[2]}`;
  
      const email = document.createElement('div');
      email.textContent = `Email: ${record[3]}`;
  
      const phone = document.createElement('div');
      phone.textContent = `Phone: ${record[4]}`;
  
      const website = document.createElement('div');
      website.innerHTML = `Website: <a href="${record[5]}" target="_blank">${record[5]}</a>`;
  
      const location = document.createElement('div');
      location.textContent = `Location: ${record[7]}, ${record[6]}`;
  
      const date = document.createElement('div');
      date.textContent = `Date: ${record[8]}`;
  
      resultItem.appendChild(nameSurname);
      resultItem.appendChild(company);
      resultItem.appendChild(email);
      resultItem.appendChild(phone);
      resultItem.appendChild(website);
      resultItem.appendChild(location);
      resultItem.appendChild(date);
  
      resultsContainer.appendChild(resultItem);
    });
  }
  
  // Sayfa yüklendiğinde sonuçları render etme fonksiyonunu çağır
  renderResults();

  document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Varsayılan form gönderimini engelle
  
    // Arama sorgusunu al
    var searchQuery = document.getElementById('searchQuery').value.trim();
  
    // Arama sorgusunu query parametresi olarak Search.html sayfasına yönlendir
    if (searchQuery) {
      window.location.href = 'Search.html?query=' + encodeURIComponent(searchQuery);
    }
  });

  function getQueryParams() {
    var params = {};
    var queryString = window.location.search.slice(1);
    var parts = queryString.split('&');
    parts.forEach(function(part) {
      var pair = part.split('=');
      params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    });
    return params;
  }
  
  // Search.html sayfası yüklendiğinde, arama sonuçlarını göster
  if (window.location.pathname.endsWith('Search.html')) {
    var params = getQueryParams();
    var searchQuery = params.query || '';
  
    // Arama sorgusunu göster
    document.getElementById('results').innerText = 'Results for: ' + searchQuery;
  
    // TODO: Arama sorgusuna dayalı gerçek arama sonuçlarını al ve göster
  }

// Hata mesajlarını başlangıçta gizle
document.getElementById('nameSurnameError').style.display = 'none';

// Doğrulama fonksiyonları
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

// Tüm alanların geçerli olup olmadığını kontrol et
function areAllFieldsValid() {
  const name = document.getElementById('nameSurname').value;
  const country = document.getElementById('country').value;
  const city = document.getElementById('city').value;
  const email = document.getElementById('email').value;
  const website = document.getElementById('website').value;

  return (
    isNameValid(name) &&
    isCountryOrCityValid(country) &&
    isCountryOrCityValid(city) &&
    isEmailValid(email) &&
    isWebsiteValid(website)
  );
}

// Ekle düğmesini form geçerliliğine göre etkinleştir veya devre dışı bırak
function toggleAddButton() {
  document.getElementById('addButton').disabled = !areAllFieldsValid();
}

// Form alanları için olay dinleyicileri
document.getElementById('nameSurname').addEventListener('input', toggleAddButton);
document.getElementById('country').addEventListener('input', toggleAddButton);
document.getElementById('city').addEventListener('input', toggleAddButton);
document.getElementById('email').addEventListener('input', toggleAddButton);
document.getElementById('website').addEventListener('input', toggleAddButton);

// Form gönderimini işleme
document.getElementById('addRecordForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Varsayılan form gönderimini engelle

  // Göndermeden önce tüm alanları tekrar doğrula
  if (areAllFieldsValid()) {
    // Form verilerini topla
    const record = {
      nameSurname: document.getElementById('nameSurname').value,
      country: document.getElementById('country').value,
      city: document.getElementById('city').value,
      email: document.getElementById('email').value,
      website: document.getElementById('website').value,
      date: new Date().toLocaleDateString() // İsteğe bağlı: Mevcut tarihi ekle
    };

    // Verileri sunucuya gönder
    fetch('/add-record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(record)
    })
    .then(response => {
      if (response.ok) {
        // Search.html sayfasına yönlendir
        window.location.href = 'Search.html';
      } else {
        console.error('Kayıt eklenemedi');
      }
    })
    .catch(error => {
      console.error('Hata:', error);
    });
  } else {
    // Doğrulama başarısız olursa hata mesajlarını göster
    if (!isNameValid(document.getElementById('nameSurname').value)) {
      document.getElementById('nameSurnameError').style.display = 'block';
    } else {
      document.getElementById('nameSurnameError').style.display = 'none';
    }
  }
});

document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Form değerlerini al
    const name = document.getElementById('name').value;
    const country = document.getElementById('country').value;
    const city = document.getElementById('city').value;
    const email = document.getElementById('email').value;
    const website = document.getElementById('website').value;

    // Form değerlerini doğrula
    if (name.split(' ').length < 2) {
        alert('Ad ve soyad en az 2 kelime içermelidir');
        return;
    }

    // Yeni kayıt oluştur
    const newRecord = {
        id: Date.now(), 
        nameSurname: name,
        company: '', 
        email: email,
        phone: '', 
        website: website,
        country: country,
        city: city,
        date: new Date().toLocaleDateString() // Mevcut tarih
    };

    // Mevcut verileri localstorage'dan al 
    const existingData = JSON.parse(localStorage.getItem('mockData')) || [];

    // Mevcut verilere yeni kayıt ekle
    existingData.push(newRecord);

    // Güncellenmiş verileri tekrar localStorage'a kaydet
    localStorage.setItem('mockData', JSON.stringify(existingData));

    // Liste sayfasına yönlendir
    window.location.href = 'Search.html';
});
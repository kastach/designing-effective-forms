let clickCount = 0;

const countryInput = document.getElementById('country');
const myForm = document.getElementById("form");
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');
const phoneCodeInput = document.getElementById('phoneCode');
const vatCheckbox = document.getElementById('vatUE');
const invoiceFields = document.getElementById('invoiceFields');
const vatNumberInput = document.getElementById('vatNumber');
const invoiceNameInput = document.getElementById('invoiceName');


function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        const countries = data.map(country => country.name.common).sort();
        countryInput.innerHTML = countries.map(country => `<option value="${country}">${country}</option>`).join('');
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Błąd pobierania danych');
            return response.json();
        })
        .then(data => {
            const countryCode = data[0].idd.root + data[0].idd.suffixes[0];
            phoneCodeInput.value = countryCode;

            const codeSelect = document.getElementById('countryCode');
            const option = Array.from(codeSelect.options).find(opt => opt.value.includes(countryCode));

            if (option) {
                option.selected = true;
            } else {
                const newOption = new Option(`${countryCode} (${countryName})`, countryCode);
                codeSelect.add(newOption);
                newOption.selected = true;
            }
            
        })
        .catch(error => {
            console.error('Błąd przy pobieraniu kodu kraju:', error);
        });
}


function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            const countryInput = document.getElementById('country');
            const options = Array.from(countryInput.options);
            const match = options.find(option => option.value.toLowerCase() === country.toLowerCase());

            if (match) {
                match.selected = true;
                getCountryCode(country);
                document.getElementById('country').dispatchEvent(new Event('change'));
            }
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

async function fetchPhoneCodes() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) throw new Error('Błąd pobierania kodów');

        const data = await response.json();

        const codes = data
            .filter(c => c.idd?.root && c.idd?.suffixes)
            .map(c => ({
                name: c.name.common,
                code: c.idd.root + c.idd.suffixes[0]
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

        const phoneCodeSelect = document.getElementById('phoneCode');
        phoneCodeSelect.innerHTML = codes.map(c =>
            `<option value="${c.code}">${c.name} (${c.code})</option>`
        ).join('');
    } catch (err) {
        console.error('Nie udało się pobrać kodów:', err);
    }
}

function handleGroupedSelection(optionClass) {
    const options = document.querySelectorAll(`.${optionClass}`);
    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
}

handleGroupedSelection('shipping-option');
handleGroupedSelection('payment-option');

countryInput.addEventListener('change', function () {
    const selectedCountry = this.value;
    if (selectedCountry) {
        getCountryCode(selectedCountry); 
    }
});

document.getElementById('vatUE').addEventListener('change', function () {
    const invoiceSection = document.getElementById('invoiceFields');
    invoiceSection.style.display = this.checked ? 'block' : 'none';
});


vatCheckbox.addEventListener('change', function () {
    const showFields = this.checked;
    invoiceFields.style.display = showFields ? 'block' : 'none';

    vatNumberInput.required = showFields;
    invoiceNameInput.required = showFields;
});


document.querySelector('button[type="submit"]').addEventListener('click', function(event) {
    event.preventDefault(); // Zatrzymuje wysłanie formularza, żeby kontrolować modal
    setTimeout(() => {
    }, 5000);
});


function validateForm() {
    let isValid = true;

    // Sprawdzamy imię
    const firstName = document.getElementById("firstName").value;
    const nameRegex = /^[A-Za-ząćęłńóśźżĄĘŁŃÓŚŹŻ]+$/;
    if (!firstName || !nameRegex.test(firstName)) {
        document.getElementById('firstNameError').style.display = "block";
        isValid = false;
    } else {
        document.getElementById('firstNameError').style.display = "none";
    }

    // Sprawdzamy nazwisko
    const lastName = document.getElementById("lastName").value;
    if (!lastName || !nameRegex.test(lastName)) {
        document.getElementById('lastNameError').style.display = "block";
        isValid = false;
    } else {
        document.getElementById('lastNameError').style.display = "none";
    }

    // Sprawdzamy ulicę
    const street = document.getElementById("street").value;
    if (!street) {
        document.getElementById('streetError').style.display = "block";
        isValid = false;
    } else {
        document.getElementById('streetError').style.display = "none";
    }

    // Sprawdzamy miasto
    const city = document.getElementById("city").value;
    if (!city) {
        document.getElementById('cityError').style.display = "block";
        isValid = false;
    } else {
        document.getElementById('cityError').style.display = "none";
    }

    // Sprawdzamy kod pocztowy
    const zipCode = document.getElementById("zipCode").value;
    const zipCodeRegex = /^\d{2}-\d{3}$/;
    if (!zipCode || !zipCodeRegex.test(zipCode)) {
        document.getElementById('zipCodeError').style.display = "block";
        isValid = false;
    } else {
        document.getElementById('zipCodeError').style.display = "none";
    }

    // Sprawdzamy numer telefonu
    const phoneNumber = document.getElementById("phoneNumber").value;
    const phoneRegex = /^\+?\d+$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
        document.getElementById('phoneNumberError').style.display = "block";
        isValid = false;
    } else {
        document.getElementById('phoneNumberError').style.display = "none";
    }

    // Sprawdzamy e-mail
    const email = document.getElementById("exampleInputEmail1").value;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailRegex.test(email)) {
        document.getElementById('emailError').style.display = "block";
        isValid = false;
    } else {
        document.getElementById('emailError').style.display = "none";
    }

    // Jeżeli formularz jest poprawny, odblokowujemy przycisk
    const submitBtn = document.querySelector('button[type="submit"]');
    if (isValid) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }

    return isValid;
}

document.addEventListener("input", validateForm);

(() => {
    // nasłuchiwania na zdarzenie kliknięcia myszką
    document.addEventListener('click', handleClick);
    fetchAndFillCountries();
    fetchPhoneCodes(); 
    getCountryByIP();
})()


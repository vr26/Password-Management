// Password Manager Functionality
const passwordManager = {
    getPasswords: () => {
        // Retrieve passwords from local storage or your preferred data source
        const data = localStorage.getItem("passwords");
        const passwords = JSON.parse(data) || [];

        // Update the password manager table with retrieved passwords
        const table = document.querySelector("table");
        if (passwords.length === 0) {
            table.innerHTML = "No Data To Show";
        } else {
            table.innerHTML = `<tr>
                <th>Website</th>
                <th>Username</th>
                <th>Password</th>
                <th>Delete</th>
            </tr>`;
            for (let index = 0; index < passwords.length; index++) {
                const element = passwords[index];

                table.innerHTML += `<tr>
                    <td>${element.website} <img onclick="copyText('${element.website}')" src="./copy.svg" alt="Copy Button" width="10" height="10"></td>
                    <td>${element.username} <img onclick="copyText('${element.username}')" src="./copy.svg" alt="Copy Button" width="10" height="10"></td>
                    <td>${maskPassword(element.password)} <img onclick="copyText('${element.password}')" src="./copy.svg" alt="Copy Button" width="10" height="10"></td>
                    <td><button class="btnsm" onclick="deletePassword('${element.website}')">Delete</button></td>
                </tr>`;
            }
        }
    },
    addPassword: (website, username, password) => {
        // Add a new password entry to the data source
        const data = localStorage.getItem("passwords");
        const passwords = JSON.parse(data) || [];
        passwords.push({ website, username, password });
        localStorage.setItem("passwords", JSON.stringify(passwords));

        // Call getPasswords() to update the table with the new password
        passwordManager.getPasswords();
    },
    deletePassword: (website) => {
        // Delete a password entry from the data source
        const data = localStorage.getItem("passwords");
        const passwords = JSON.parse(data) || [];
        const updatedPasswords = passwords.filter((e) => e.website !== website);
        localStorage.setItem("passwords", JSON.stringify(updatedPasswords));

        // Call getPasswords() to update the table after deletion
        passwordManager.getPasswords();
    },
};

// Password Generator Logic

const uCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lCase = "abcdefghijklmnopqrstuvwxyz";
const number = "0123456789";
const symbol = "!@#$%^&*=-_";

const pLength = document.getElementById('plength');
const upperCase = document.getElementById('puppercase');
const lowerCase = document.getElementById('plowercase');
const pNumber = document.getElementById('pnumber');
const pSymbol = document.getElementById('psymbol');
const generateBtn = document.getElementById('generateBtn');
const generatedPassword = document.getElementById('generatedPassword');

generateBtn.addEventListener('click', () => {
    const length = parseInt(pLength.value);
    let initPwd = '';

    if (getCheckedCount([upperCase, lowerCase, pNumber, pSymbol]) < 2) {
        alert("Please select at least two options.");
        return;
    }

    if (upperCase.checked) initPwd += uCase;
    if (lowerCase.checked) initPwd += lCase;
    if (pNumber.checked) initPwd += number;
    if (pSymbol.checked) initPwd += symbol;

    generatedPassword.value = generatePwd(length, initPwd);
});

function generatePwd(length, initPwd) {
    let pass = '';
    const initPwdLength = initPwd.length;
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * initPwdLength);
        pass += initPwd.charAt(randomIndex);
    }
    return pass;
}

function getCheckedCount(checkboxes) {
    return checkboxes.filter(checkbox => checkbox.checked).length;
}

// Event Listener for Submit Button (Password Manager)
document.querySelector(".btn").addEventListener("click", (e) => {
    e.preventDefault();
    const website = document.getElementById("website").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Call the addPassword function to add a new password
    passwordManager.addPassword(website, username, password);
});

// Event Listener for Delete Button (Password Manager)
function deletePassword(website) {
    // Call the deletePassword function to delete a password
    passwordManager.deletePassword(website);
}

// Event Listener for Generate Button (Password Generator)
document.getElementById("generateBtn").addEventListener("click", () => {
    const generatedPassword = passwordGenerator.generatePassword();
    document.getElementById("generatedPassword").value = generatedPassword;
});

// Function to mask the password
function maskPassword(pass) {
    let str = "";
    for (let index = 0; index < pass.length; index++) {
        str += "*";
    }
    return str;
}

// Function to copy text to clipboard
function copyText(txt) {
    navigator.clipboard.writeText(txt).then(
        () => {
            document.getElementById("alert").style.display = "inline";
            setTimeout(() => {
                document.getElementById("alert").style.display = "none";
            }, 2000);
        },
        () => {
            alert("Clipboard copying failed");
        }
    );
}

// Password Strength Checker Logic

const passwordBar = document.getElementById('password-bar');
const passwordStrengthText = document.getElementById('password-strength-text');
const password = document.getElementById('password');

password.addEventListener('input', () => {
    const passwordValue = password.value;
    const strength = calculatePasswordStrength(passwordValue);
    updatePasswordStrengthMeter(strength);
});

function calculatePasswordStrength(password) {
    // You can implement your own password strength algorithm here.
    // For simplicity, we'll just check the length in this example.
    const length = password.length;
    if (length < 8) return 0;
    if (length < 12) return 1;
    if (length < 16) return 2;
    return 3; // Strong password
}

// Calculate the password strength and set the appropriate text and class
function setPasswordStrength(strength) {
    const passwordStrengthText = document.getElementById("password-strength-text");

    if (strength === "Weak") {
        passwordStrengthText.textContent = "Password Strength: Weak";
        passwordStrengthText.classList.remove("password-moderate", "password-strong");
        passwordStrengthText.classList.add("password-weak");
    } else if (strength === "Moderate") {
        passwordStrengthText.textContent = "Password Strength: Moderate";
        passwordStrengthText.classList.remove("password-weak", "password-strong");
        passwordStrengthText.classList.add("password-moderate");
    } else if (strength === "Strong") {
        passwordStrengthText.textContent = "Password Strength: Strong";
        passwordStrengthText.classList.remove("password-weak", "password-moderate");
        passwordStrengthText.classList.add("password-strong");
    }
}

// Example usage:
// Call this function with the calculated password strength (e.g., "Weak", "Moderate", "Strong")
setPasswordStrength("Moderate");

function updatePasswordStrengthMeter(strength) {
    const colors = ['#FF0000', '#FF5733', '#FFA500', '#00FF00'];
    passwordBar.style.backgroundColor = colors[strength];
    passwordBar.style.width = `${(strength + 1) * 25}%`;

    const strengthText = ['Weak', 'Moderate', 'Good', 'Strong'];
    passwordStrengthText.innerText = `Password Strength: ${strengthText[strength]}`;
}



// Initial setup for Password Manager and Password Strength Checker
console.log("Working");
showPasswords();
updatePasswordStrengthMeter(0); // Set initial strength to "Weak"

// Initial load of passwords
passwordManager.getPasswords();

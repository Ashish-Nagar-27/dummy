
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex =
    /^\+?\d{1,4}?[-.\s]?(\(?\d{1,4}?\))?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
const nameRegex = /^[\p{L}\p{M}'\s.-]+$/u;


const emailKeywords = [
    "Email",
    "email",
    "invitee_email",
    "hemail",
    "cemail",
    "payer_email",
    "checkoutemail",
    "customer_email",
    "email-address-lead",
    "email-lead",
    "buyer_email",
    "billing_email",
    "inf_field_Email",
    "EMAIL",
    "email_address",
    "emailAddress",
    "email-address",
    "he",
    "cf-email",
    "mailid",
    "mail",
];
const nameKeywords = [
    "billing_first_name",
    "billing_last_name",
    "name",
    "enter your name",
    "fullname",
    "full-name",
    "full name",
    "first name",
    "last name",
    "first-name",
    "f-name",
    "first_name",
    "f_name",
    "f name",
    "firstname",
    "First Name",
    "firstName",
    "FirstName",
    "fname",
    "fname-lead",
    "fname_lead",
    "last-name",
    "l-name",
    "last_name",
    "l_name",
    "l name",
    "lastname",
    "Last Name",
    "lastName",
    "LastName",
    "lname",
    "lname-lead",
    "lname_lead",
    "surname",
    "Surname",
    "sur_name",
    "full_name",
    "complete-name",
    "complete_name",
    "complete name",
    "completename",
    "Full Name",
    "fullName",
    "FullName",
    "name-lead",
    "name_lead",
];
const phoneKeywords = [
    "billing_phone",
    "text_reminder_number",
    "sms_number",
    "answer_",
    "inf_custom_PhonenumberorSkypeID",
    "inf_field_Phone1",
    "Phone1",
    "phone",
    "mobile",
    "customer_valid_phone",
    "Phone Number",
    "Phone",
    "tel",
    "phone-lead",
    "phone_lead",
    "phone_number",
    "phoneNumber",
    "phone-number",
    "phone_number_lead",
    "phone_number-lead",
    "ph",
    "cellPhoneNumber",
    "phonenumber",
    "phone number",
    "Enter your phone number",
];



let lastInputValues = {};
const isEqual = (obj) => {
    const keys1 = Object.keys(obj);
    const keys2 = Object.keys(lastInputValues);
    if (keys1.length !== keys2.length) {
        lastInputValues = { ...obj };
        return false;
    }

    for (let key of keys1) {
        if (obj[key] !== lastInputValues[key]) {
            lastInputValues = { ...obj };
            return false;
        }
    }
    return true;
};

const handleEvent = () => {
    console.log('called')
    const inputValues = {};
    const processedInputs = new Set();

    // Select input elements in the main document
    const inputElements = Array.from(document.querySelectorAll("input"));

    let inputTypeList = ["text", "email", "tel"];

    inputElements.forEach((input) => {
        if (inputTypeList.includes(input.type)) {
            const inputValue = input.value.trim();
            const inputName = input.name.toLowerCase();
            const inputType = input.type.toLowerCase();
            const inputPlaceholder = input.placeholder.toLowerCase();
            const inputClass = input.className.toLowerCase();

            const fields = [inputName, inputType, inputPlaceholder, inputClass];


            // Function to check if any field contains keywords from a given list
            const containsKeywordInFields = (fields, keywords) => {
                return fields.some((field) => inputContainsKeyword(field, keywords));
            };

            // Check for presence of phone, email, and name keywords
            const containsPhoneKeyword = containsKeywordInFields(
                fields,
                phoneKeywords
            );
            const containsEmailKeyword = containsKeywordInFields(
                fields,
                emailKeywords
            );
            const containsNameKeyword = containsKeywordInFields(
                fields,
                nameKeywords
            );


            // Clean and trim the input value for phone number format
            const cleanedValue = inputValue.replace(/[-,()_]/g, "");
            const trimmedVal = cleanedValue.split(" ").join("");

            // Check for phone number, email, and name formats
            const isPhoneNumber = phoneRegex.test(trimmedVal);
            const isEmailAddress = emailRegex.test(inputValue);
            const isName = nameRegex.test(inputValue);

            if (containsPhoneKeyword && isPhoneNumber) {
                inputValues["phone"] = trimmedVal;
                processedInputs.add(inputValue);
                // console.log(`Phone value stored: ${trimmedVal}`);
            }

            if (containsEmailKeyword && isEmailAddress) {
                inputValues["email"] = inputValue;
                processedInputs.add(inputValue);
            }

            if (containsNameKeyword && isName) {
                inputValues["name"] =
                    inputValues.name && inputValues.name !== ("" || null)
                        ? inputValues.name + " " + inputValue
                        : inputValue;
                processedInputs.add(inputValue);
            }

            // Additional logic to handle ambiguous cases
            if (
                containsPhoneKeyword &&
                containsEmailKeyword &&
                !processedInputs.has(inputValue)
            ) {
                if (isEmailAddress) {
                    inputValues["email"] = inputValue;
                } else if (isPhoneNumber) {
                    inputValues["phone"] = trimmedVal;
                }
                processedInputs.add(inputValue);
            }

            if (
                containsPhoneKeyword &&
                containsNameKeyword &&
                !processedInputs.has(inputValue)
            ) {
                if (isName) {
                    inputValues["name"] =
                        inputValues.name && inputValues.name !== ("" || null)
                            ? inputValues.name + " " + inputValue
                            : inputValue;
                } else if (isPhoneNumber) {
                    inputValues["phone"] = trimmedVal;
                }
                processedInputs.add(inputValue);
            }

            if (
                containsEmailKeyword &&
                containsNameKeyword &&
                !processedInputs.has(inputValue)
            ) {
                if (isEmailAddress) {
                    inputValues["email"] = inputValue;
                } else if (isName) {
                    inputValues["name"] =
                        inputValues.name && inputValues.name !== ("" || null)
                            ? inputValues.name + " " + inputValue
                            : inputValue;
                    // console.log(`Ambiguous case resolved as name: ${inputValue}`);
                }
                processedInputs.add(inputValue);
            }

            // Handling all three cases where keywords for phone, email, and name are present
            if (
                containsPhoneKeyword &&
                containsEmailKeyword &&
                containsNameKeyword &&
                !processedInputs.has(inputValue)
            ) {
                if (isEmailAddress) {
                    inputValues["email"] = inputValue;
                } else if (isName) {
                    inputValues["name"] =
                        inputValues.name && inputValues.name !== ("" || null)
                            ? inputValues.name + " " + inputValue
                            : inputValue;
                } else if (isPhoneNumber) {
                    inputValues["phone"] = trimmedVal;
                }
                processedInputs.add(inputValue);
            }
        }
    });

    if (isEqual(inputValues)) {
        return
    }
    const message = {
        type: '__trackocity-iframe_',
        data: inputValues
    };

    window.parent.postMessage(message, '*')
};

const inputContainsKeyword = (val, keywordList) => {
    return keywordList.some((keyword) => {
        const contains = val.toLowerCase().includes(keyword.toLowerCase())
            ? true
            : false;
        return contains;
    });
};



document.addEventListener("focusout", handleEvent)
document.addEventListener("blur", handleEvent);
document.addEventListener("change", handleEvent);
document.addEventListener("submit", handleEvent);
document.addEventListener("click", (e) => {
    const target = e.target;
    if (target.tagName === 'BUTTON') {
        handleEvent()
    }
});

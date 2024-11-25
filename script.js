// Selecting all dropdown containers and the specific input and output language dropdowns
const dropdowns = document.querySelectorAll(".dropdown-container"),
  inputLanguageDropdown = document.querySelector("#input-language"),
  outputLanguageDropdown = document.querySelector("#output-language");

// Function to populate the language dropdown with language options
function populateDropdown(dropdown, options) {
  dropdown.querySelector("ul").innerHTML = ""; // Clear any existing list items in the dropdown
  options.forEach((option) => {
    const li = document.createElement("li"); // Create a new list item
    const title = option.name + " (" + option.native + ")"; // Set the title of the option (e.g., English (English))
    li.innerHTML = title; // Set the content of the list item
    li.dataset.value = option.code; // Store the language code as a data attribute for easy access
    li.classList.add("option"); // Add 'option' class for styling
    dropdown.querySelector("ul").appendChild(li); // Append the list item to the dropdown's unordered list
  });
}

// Populating both the input and output language dropdowns with the provided languages array
populateDropdown(inputLanguageDropdown, languages);
populateDropdown(outputLanguageDropdown, languages);

// Adding click event listener to handle opening/closing of dropdown menus
dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", (e) => {
    dropdown.classList.toggle("active"); // Toggle the 'active' class to open or close the dropdown
  });

  // Adding event listener to each option within the dropdown to handle language selection
  dropdown.querySelectorAll(".option").forEach((item) => {
    item.addEventListener("click", (e) => {
      // Remove active class from all options in the dropdown
      dropdown.querySelectorAll(".option").forEach((item) => {
        item.classList.remove("active");
      });
      item.classList.add("active"); // Mark the selected option as active
      const selected = dropdown.querySelector(".selected");
      selected.innerHTML = item.innerHTML; // Update the selected language text
      selected.dataset.value = item.dataset.value; // Update the selected language code
      translate(); // Call translate function after a new language is selected
    });
  });
});

// Adding a global click listener to close dropdown if clicked outside
document.addEventListener("click", (e) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active"); // Close dropdown if clicked outside
    }
  });
});

// Selecting elements for the language swap button, input and output language containers, and text areas
const swapBtn = document.querySelector(".swap-position"),
  inputLanguage = inputLanguageDropdown.querySelector(".selected"),
  outputLanguage = outputLanguageDropdown.querySelector(".selected"),
  inputTextElem = document.querySelector("#input-text"),
  outputTextElem = document.querySelector("#output-text");

// Adding click event listener to swap the languages when the swap button is clicked
swapBtn.addEventListener("click", (e) => {
  const temp = inputLanguage.innerHTML; // Store input language in a temporary variable
  inputLanguage.innerHTML = outputLanguage.innerHTML; // Swap input language with output language
  outputLanguage.innerHTML = temp; // Swap output language with input language

  const tempValue = inputLanguage.dataset.value; // Swap the language codes as well
  inputLanguage.dataset.value = outputLanguage.dataset.value;
  outputLanguage.dataset.value = tempValue;

  // Swap the text content between input and output text areas
  const tempInputText = inputTextElem.value;
  inputTextElem.value = outputTextElem.value;
  outputTextElem.value = tempInputText;

  translate(); // Trigger translation after swapping
});

// Function to handle translation using Google Translate API
function translate() {
  const inputText = inputTextElem.value; // Get the input text
  const inputLanguage = inputLanguageDropdown.querySelector(".selected").dataset.value; // Get the selected input language code
  const outputLanguage = outputLanguageDropdown.querySelector(".selected").dataset.value; // Get the selected output language code

  // Construct the URL for the Google Translate API
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(inputText)}`;

  // Fetch translation data from Google Translate API
  fetch(url)
    .then((response) => response.json()) // Convert response to JSON format
    .then((json) => {
      console.log(json); // Log the response for debugging
      outputTextElem.value = json[0].map((item) => item[0]).join(""); // Extract and display the translated text
    })
    .catch((error) => {
      console.log(error); // Log any errors
    });
}

// Adding event listener to limit the input text to 5000 characters and trigger translation
inputTextElem.addEventListener("input", (e) => {
  if (inputTextElem.value.length > 5000) {
    inputTextElem.value = inputTextElem.value.slice(0, 5000); // Limit input length to 5000 characters
  }
  translate(); // Trigger translation whenever the input text changes
});

// Selecting file upload and upload title elements
const uploadDocument = document.querySelector("#upload-document"),
  uploadTitle = document.querySelector("#upload-title");

// Adding event listener to handle file upload
uploadDocument.addEventListener("change", (e) => {
  const file = e.target.files[0]; // Get the uploaded file
  if (
    file.type === "application/pdf" ||
    file.type === "text/plain" ||
    file.type === "application/msword" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    uploadTitle.innerHTML = file.name; // Display the file name in the upload title area
    const reader = new FileReader(); // Create a new FileReader instance
    reader.readAsText(file); // Read the file as text
    reader.onload = (e) => {
      inputTextElem.value = e.target.result; // Set the input text to the file's content
      translate(); // Trigger translation after the file content is loaded
    };
  } else {
    alert("Please upload a valid file"); // Alert user if the file type is not supported
  }
});

// Selecting the download button
const downloadBtn = document.querySelector("#download-btn");

// Adding event listener to handle file download of the translated text
downloadBtn.addEventListener("click", (e) => {
  const outputText = outputTextElem.value; // Get the translated text
  const outputLanguage = outputLanguageDropdown.querySelector(".selected").dataset.value; // Get the output language code
  if (outputText) {
    const blob = new Blob([outputText], { type: "text/plain" }); // Create a Blob from the translated text
    const url = URL.createObjectURL(blob); // Create a URL for the Blob
    const a = document.createElement("a"); // Create a temporary link element
    a.download = `translated-to-${outputLanguage}.txt`; // Set the filename for the downloaded file
    a.href = url; // Set the link URL to the Blob URL
    a.click(); // Simulate a click to download the file
  }
});

// Selecting the dark mode checkbox
const darkModeCheckbox = document.getElementById("dark-mode-btn");

// Adding event listener to toggle dark mode on or off when the checkbox is changed
darkModeCheckbox.addEventListener("change", () => {
  document.body.classList.toggle("dark"); // Toggle the 'dark' class on the body to enable dark mode styling
});

// Selecting the input characters counter element
const inputChars = document.querySelector("#input-chars");

// Adding event listener to update the character count as the input text changes
inputTextElem.addEventListener("input", (e) => {
  inputChars.innerHTML = inputTextElem.value.length; // Update the character count displayed
});

// Voice Assistant Functionality

const micBtn = document.getElementById("mic-btn");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  micBtn.addEventListener("click", () => {
    const inputLangCode = inputLanguage.dataset.value || "en-US"; // Get the selected input language code
    recognition.lang = mapLanguageCodeToSpeech(inputLangCode); // Set recognition language dynamically
    recognition.start();
  });

  recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript; // Extract recognized speech text
    inputTextElem.value = spokenText; // Set the input text to the recognized speech
    translate();
  };

  recognition.onerror = (event) => {
    alert("Voice Recognition Error: " + event.error);
  };
}

// Helper function to map language codes to supported SpeechRecognition languages
function mapLanguageCodeToSpeech(code) {
  const supportedLanguages = {
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    zh: "zh-CN",
    ar: "ar-SA",
    hi: "hi-IN",
    bn: "bn-IN",
    te: "te-IN",
    ta: "ta-IN",
    ml: "ml-IN",
    kn: "kn-IN",
    gu: "gu-IN",
    mr: "mr-IN",
    pa: "pa-IN",
    ur: "ur-IN",
    or: "or-IN",
    as: "as-IN",
  };
  return supportedLanguages[code] || code; // Use the mapped code or fallback to the provided code
}

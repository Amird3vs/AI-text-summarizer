const themeToggle = document.getElementById("theme-toggle");
const deleteBtn = document.getElementById("delete-btn");
const copyBtn = document.getElementById("copy-btn");
const pasteBtn = document.getElementById("pasteBtn");
const btnsHolder = document.getElementById("btns-holder");
const textArea = document.getElementById("text_to_summarize");
const textArea1 = document.getElementById("summary");
const submitButton = document.getElementById("submit-button");
const summarizedTextArea = document.getElementById("summary");

submitButton.disabled = true;
textArea.value = "";
textArea1.value = "";

textArea.addEventListener("input", initialTextLengthVerification);
textArea1.addEventListener("input", summarizeTextLengthVerification);
textArea.addEventListener("input", verifyTextLength);
pasteBtn.addEventListener("click", pasteFromClipboard);
copyBtn.addEventListener("click", copyContent);
deleteBtn.addEventListener("click", clearTextArea);
themeToggle.addEventListener("click", toggleTheme);
submitButton.addEventListener("click", submitData);

function initialTextLengthVerification() {
  if (textArea.value.length > 0 && textArea.value.length < 100000) {
    btnsHolder.style.display = "none";
    deleteBtn.style.display = "inline-block";
  } else {
    btnsHolder.style.display = "flex";
    deleteBtn.style.display = "none";
  }
}

function summarizeTextLengthVerification() {
  if (textArea1.value.length > 0 && textArea1.value.length < 100000) {
    copyBtn.style.display = "inline-block";
  } else {
    copyBtn.style.display = "none";
  }
}

function verifyTextLength() {
  if (textArea.value.length > 200 && textArea.value.length < 100000) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

function pasteSampleText() {
  const sampleText = `Servers play a vital role in modern digital infrastructure. They are specialized computers designed to store, manage, and process data, applications, and services. Acting as central repositories, servers respond to requests from client devices like computers, smartphones, or other servers over a network, such as the internet.\n\nThese robust machines handle a diverse range of tasks. Web servers host websites, serving web pages to users who access them through browsers. Application servers manage and run software applications, facilitating their execution and ensuring smooth performance. Database servers store and organize data, allowing efficient retrieval and manipulation of information for various applications.`;

  textArea.value = sampleText;
  initialTextLengthVerification();
  verifyTextLength();
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    textArea.value = text;
    initialTextLengthVerification();
    verifyTextLength();
  } catch (err) {
    console.error("Failed to read clipboard contents: ", err);
  }
}

function clearTextArea() {
  Swal.fire({
    title: "Are you sure?",
    text: "This will clear the text areas. Are you sure you want to proceed?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, clear it!",
    cancelButtonText: "No, cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      textArea.value = "";
      textArea1.value = "";
      initialTextLengthVerification();
      verifyTextLength();
      summarizeTextLengthVerification();
      Swal.fire({
        icon: "success",
        title: "Text areas cleared!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}

function copyContent() {
  textArea1.select();
  document.execCommand("copy");
  textArea1.blur();
  window.getSelection().removeAllRanges();

  Swal.fire({
    icon: "success",
    title: "Copied to clipboard!",
    showConfirmButton: false,
    timer: 1500,
  });
}

function setInitialTheme() {
  if (document.body.classList.contains("dark-theme")) {
    themeToggle.innerHTML =
      '<span class="material-symbols-outlined"> light_mode </span>';
  } else {
    themeToggle.innerHTML =
      '<span class="material-symbols-outlined"> dark_mode </span>';
  }
}


function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  setInitialTheme();
}

document.addEventListener("DOMContentLoaded", setInitialTheme);

function submitData(e) {
  submitButton.classList.add("submit-button--loading");

  const textToSummarize = textArea.value;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({ text_to_summarize: textToSummarize }),
    redirect: "follow",
  };

  fetch("/summarize", requestOptions)
    .then((response) => response.text())
    .then((summary) => {
      summarizedTextArea.value = summary;
      submitButton.classList.remove("submit-button--loading");
      summarizeTextLengthVerification();
    })
    .catch((error) => {
      console.error("Error summarizing text:", error);
      summarizedTextArea.value = "Error summarizing text. Please try again.";
      submitButton.classList.remove("submit-button--loading");
    });
}

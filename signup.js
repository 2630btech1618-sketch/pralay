const signupForm = document.querySelector("#signup-form");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");
const formMessage = document.querySelector("#form-message");

// Display a message below the form.
function showMessage(message) {
  formMessage.textContent = message;
  formMessage.classList.add("visible");
}

// Hide the message when the user changes the form.
function hideMessage() {
  formMessage.textContent = "";
  formMessage.classList.remove("visible");
}

// Show or hide passwords.
document.querySelectorAll("[data-toggle-password]").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(
      button.dataset.togglePassword
    );

    const willShow = input.type === "password";

    input.type = willShow ? "text" : "password";
    button.textContent = willShow ? "Hide" : "Show";

    button.setAttribute(
      "aria-label",
      `${willShow ? "Hide" : "Show"} ${
        input.id === "password"
          ? "password"
          : "confirm password"
      }`
    );
  });
});

// Check whether both passwords match.
function validatePasswordMatch() {
  if (
    confirmPasswordInput.value &&
    confirmPasswordInput.value !== passwordInput.value
  ) {
    confirmPasswordInput.setCustomValidity(
      "Your passwords do not match."
    );
  } else {
    confirmPasswordInput.setCustomValidity("");
  }
}

// Validate passwords while the user types.
passwordInput.addEventListener(
  "input",
  validatePasswordMatch
);

confirmPasswordInput.addEventListener(
  "input",
  validatePasswordMatch
);

// Hide old messages when the form changes.
signupForm.addEventListener("input", hideMessage);
signupForm.addEventListener("change", hideMessage);

// Send signup details to the backend
signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  hideMessage();
  validatePasswordMatch();

  if (!signupForm.checkValidity()) {
    signupForm.reportValidity();
    return;
  }

  const formData = new FormData(signupForm);
  const signupData = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(signupData)
    });

    const result = await response.json();

    if (!response.ok) {
      showMessage(result.message || "Signup failed. Please try again.");
      return;
    }

    alert("🎉 Account created successfully!");
    signupForm.reset();

  } catch (error) {
    showMessage(
      "Could not connect to the server. Please check your backend."
    );
  }
});

// Handle the login and Google buttons.
document.querySelectorAll("[data-demo-action]").forEach((control) => {
  control.addEventListener("click", (event) => {
    event.preventDefault();

    if (control.dataset.demoAction === "google") {
      showMessage(
        "Google sign-up is a design placeholder. Connect Google OAuth and your backend to enable it."
      );
    } else {
      showMessage(
        "Add your login page URL to this link when your login screen is ready."
      );
    }

    formMessage.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  });
});
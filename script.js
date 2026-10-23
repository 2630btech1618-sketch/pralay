// ===============================================
// SkillSwap Campus — Login Page JavaScript
// ===============================================

"use strict";

// 1. Select HTML elements
const loginForm = document.querySelector("#login-container form");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const showPasswordButton = document.querySelector(".show-password");

const loginButton = loginForm
    ? loginForm.querySelector('button[type="submit"]')
    : null;


// Stop if the login form is not present
if (loginForm && emailInput && passwordInput) {

    // Store the original login button text
    const originalButtonText = loginButton
        ? loginButton.textContent.trim()
        : "Log In →";


    // -----------------------------------------------
    // 2. Set up custom validation messages
    // -----------------------------------------------

    // We will display our own messages instead of
    // relying only on the browser's default messages.
    loginForm.noValidate = true;


    // Create an error message element for each field
    function getErrorElement(input) {

        const group = input.closest(".form-group");

        if (!group) {
            return null;
        }

        let errorElement = group.querySelector(".field-error");

        if (!errorElement) {

            errorElement = document.createElement("p");

            errorElement.className = "field-error";
            errorElement.id = input.id + "-error";

            errorElement.setAttribute("aria-live", "polite");

            const inputBox = group.querySelector(".input-box");

            if (inputBox) {
                inputBox.insertAdjacentElement(
                    "afterend",
                    errorElement
                );
            } else {
                input.insertAdjacentElement(
                    "afterend",
                    errorElement
                );
            }
        }

        return errorElement;
    }


    // Display an error below an input
    function showError(input, message) {

        const errorElement = getErrorElement(input);

        if (errorElement) {

            errorElement.textContent = message;

            // Help screen readers identify the error
            const descriptions = new Set(
                (input.getAttribute("aria-describedby") || "")
                    .split(/\s+/)
                    .filter(Boolean)
            );

            descriptions.add(errorElement.id);

            input.setAttribute(
                "aria-describedby",
                [...descriptions].join(" ")
            );
        }

        input.setAttribute("aria-invalid", "true");

        const inputBox = input.closest(".input-box");

        if (inputBox) {
            inputBox.classList.add("has-error");
        }
    }


    // Remove an error when the user corrects the input
    function clearError(input) {

        const group = input.closest(".form-group");

        const errorElement = group
            ? group.querySelector(".field-error")
            : null;

        if (errorElement) {

            errorElement.textContent = "";

            const descriptions = (
                input.getAttribute("aria-describedby") || ""
            )
                .split(/\s+/)
                .filter(id => id && id !== errorElement.id);

            if (descriptions.length > 0) {
                input.setAttribute(
                    "aria-describedby",
                    descriptions.join(" ")
                );
            } else {
                input.removeAttribute("aria-describedby");
            }
        }

        input.removeAttribute("aria-invalid");

        const inputBox = input.closest(".input-box");

        if (inputBox) {
            inputBox.classList.remove("has-error");
        }
    }


    // -----------------------------------------------
    // 3. Validate the email address
    // -----------------------------------------------

    function validateEmail() {

        // Remove unnecessary spaces before/after the email
        emailInput.value = emailInput.value.trim();

        // Check for an empty email
        if (emailInput.value === "") {

            showError(
                emailInput,
                "Please enter your email address."
            );

            return false;
        }

        // Check the format using the HTML email input
        if (emailInput.validity.typeMismatch) {

            showError(
                emailInput,
                "Please enter a valid email address."
            );

            return false;
        }

        // Email format is valid
        clearError(emailInput);

        return true;
    }


    // -----------------------------------------------
    // 4. Validate the password field
    // -----------------------------------------------

    function validatePassword() {

        // A login form only needs to check that
        // the password has been entered here.
        if (passwordInput.value.length === 0) {

            showError(
                passwordInput,
                "Please enter your password."
            );

            return false;
        }

        // Do not apply new password-strength rules
        // to existing accounts during login.
        clearError(passwordInput);

        return true;
    }


    // -----------------------------------------------
    // 5. Validate email while typing
    // -----------------------------------------------

    emailInput.addEventListener("input", function () {

        // Display errors after the user has interacted
        // with the field, rather than immediately.
        if (
            emailInput.dataset.touched === "true" ||
            emailInput.getAttribute("aria-invalid") === "true"
        ) {
            validateEmail();
        }
    });


    // Validate the email when the user leaves the field
    emailInput.addEventListener("blur", function () {

        emailInput.dataset.touched = "true";

        validateEmail();
    });


    // -----------------------------------------------
    // 6. Validate password while typing
    // -----------------------------------------------

    passwordInput.addEventListener("input", function () {

        if (
            passwordInput.dataset.touched === "true" ||
            passwordInput.getAttribute("aria-invalid") === "true"
        ) {
            validatePassword();
        }
    });


    passwordInput.addEventListener("blur", function () {

        passwordInput.dataset.touched = "true";

        validatePassword();
    });


    // -----------------------------------------------
    // 7. Show / Hide password
    // -----------------------------------------------

    if (showPasswordButton) {

        showPasswordButton.addEventListener("click", function () {

            const passwordIsHidden =
                passwordInput.type === "password";

            if (passwordIsHidden) {

                // Show password
                passwordInput.type = "text";

                showPasswordButton.setAttribute(
                    "aria-label",
                    "Hide password"
                );

                showPasswordButton.title = "Hide password";

                showPasswordButton.setAttribute(
                    "aria-pressed",
                    "true"
                );

            } else {

                // Hide password
                passwordInput.type = "password";

                showPasswordButton.setAttribute(
                    "aria-label",
                    "Show password"
                );

                showPasswordButton.title = "Show password";

                showPasswordButton.setAttribute(
                    "aria-pressed",
                    "false"
                );
            }
        });
    }


    // -----------------------------------------------
    // 8. Validate the complete form before login
    // -----------------------------------------------

    loginForm.addEventListener("submit", function (event) {

        // Prevent accidental duplicate submissions
        if (
            loginButton &&
            loginButton.dataset.submitting === "true"
        ) {
            event.preventDefault();
            return;
        }

        // Validate both fields
        const emailIsValid = validateEmail();

        const passwordIsValid = validatePassword();

        // If either field is invalid, stop submission
        if (!emailIsValid || !passwordIsValid) {

            event.preventDefault();

            // Focus the first invalid field
            if (!emailIsValid) {
                emailInput.focus();
            } else {
                passwordInput.focus();
            }

            return;
        }


        // -------------------------------------------
        // 9. Show the loading state
        // -------------------------------------------

        // The form is now allowed to submit to:
        // POST /login
        // Your backend must process that request.

        if (loginButton) {

            loginButton.dataset.submitting = "true";

            loginButton.disabled = true;

            loginButton.textContent = "Logging in…";

            loginButton.setAttribute("aria-busy", "true");
        }

        // IMPORTANT:
        // Do not preventDefault() here.
        // The valid form should submit to the backend.
    });


    // -----------------------------------------------
    // 10. Restore button after browser back navigation
    // -----------------------------------------------

    window.addEventListener("pageshow", function () {

        if (loginButton) {

            loginButton.disabled = false;

            loginButton.textContent = originalButtonText;

            loginButton.removeAttribute("aria-busy");

            delete loginButton.dataset.submitting;
        }
    });
}
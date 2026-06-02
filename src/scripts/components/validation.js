const showInputError = (formElement, inputElement, errorMessage, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
};

const hideInputError = (formElement, inputElement, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(settings.errorClass);
};

const checkInputValidity = (formElement, inputElement, settings) => {
  const namePattern = /^[А-Яа-яA-Za-zёЁ\-\s]+$/;
  const isNameField =
    inputElement.classList.contains("popup__input_type_name") ||
    inputElement.classList.contains("popup__input_type_card-name");

  if (isNameField && inputElement.value && !namePattern.test(inputElement.value)) {
    showInputError(
      formElement,
      inputElement,
      "Разрешены только латинские и кириллические буквы, пробелы и дефисы",
      settings
    );
    return;
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, settings);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
};

const hasInvalidInput = (formElement, settings) => {
  return Array.from(formElement.querySelectorAll(settings.inputSelector)).some(
    (inputElement) => {
      const namePattern = /^[А-Яа-яA-Za-zёЁ\-\s]+$/;
      const isNameField =
        inputElement.classList.contains("popup__input_type_name") ||
        inputElement.classList.contains("popup__input_type_card-name");

      if (isNameField && inputElement.value && !namePattern.test(inputElement.value)) {
        return true;
      }

      return !inputElement.validity.valid;
    }
  );
};

const disableSubmitButton = (buttonElement, settings) => {
  buttonElement.classList.add(settings.inactiveButtonClass);
  buttonElement.disabled = true;
};

const enableSubmitButton = (buttonElement, settings) => {
  buttonElement.classList.remove(settings.inactiveButtonClass);
  buttonElement.disabled = false;
};

const toggleButtonState = (formElement, settings) => {
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  if (hasInvalidInput(formElement, settings)) {
    disableSubmitButton(buttonElement, settings);
  } else {
    enableSubmitButton(buttonElement, settings);
  }
};

const setEventListeners = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(formElement, settings);
    });
  });
};

export const clearValidation = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
  });

  disableSubmitButton(buttonElement, settings);
};

export const enableValidation = (settings) => {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));

  formList.forEach((formElement) => {
    if (formElement.name === "remove-card") {
      return;
    }

    setEventListeners(formElement, settings);
    toggleButtonState(formElement, settings);
  });
};

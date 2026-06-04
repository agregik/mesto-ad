import { createCardElement, updateLikeUI, removeCardElement } from "./components/card.js";
import {
  openModalWindow,
  closeModalWindow,
  setCloseModalWindowEventListeners,
} from "./components/modal.js";
import {
  getUserInfo,
  getCardList,
  setUserInfo,
  setUserAvatar,
  createCard,
  deleteCard,
  changeLikeCardStatus,
} from "./components/api.js";
import { enableValidation, clearValidation } from "./components/validation.js";

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const placesWrap = document.querySelector(".places__list");

const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");
const profileSubmitButton = profileForm.querySelector(".popup__button");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");
const cardSubmitButton = cardForm.querySelector(".popup__button");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input_type_avatar");
const avatarSubmitButton = avatarForm.querySelector(".popup__button");

const removeCardModalWindow = document.querySelector(".popup_type_remove-card");
const removeCardForm = removeCardModalWindow.querySelector(".popup__form");
const removeCardSubmitButton = removeCardForm.querySelector(".popup__button");

const infoModalWindow = document.querySelector(".popup_type_info");
const infoModalDescriptionList = infoModalWindow.querySelector(".popup__info");
const infoModalUsersTitle = infoModalWindow.querySelector(".popup__text");
const infoModalUsersList = infoModalWindow.querySelector(".popup__list");

const infoDefinitionTemplate = document.querySelector("#popup-info-definition-template").content;
const infoUserPreviewTemplate = document.querySelector("#popup-info-user-preview-template").content;

let currentUserId = "";
let cardToDelete = { id: "", element: null };

const renderLoading = (isLoading, buttonElement, initialText, loadingText) => {
  buttonElement.textContent = isLoading ? loadingText : initialText;
};

const updateUserInfo = (userData) => {
  profileTitle.textContent = userData.name;
  profileDescription.textContent = userData.about;
  profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
};

const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const createInfoString = (term, description) => {
  const infoItem = infoDefinitionTemplate.querySelector(".popup__info-item").cloneNode(true);
  infoItem.querySelector(".popup__info-term").textContent = term;
  infoItem.querySelector(".popup__info-description").textContent = description;
  return infoItem;
};

const createUserBadge = (user) => {
  const userItem = infoUserPreviewTemplate.querySelector(".popup__list-item").cloneNode(true);
  userItem.textContent = user.name;
  return userItem;
};

const renderCard = (cardData, appendMode = "append") => {
  const cardElement = createCardElement(cardData, {
    currentUserId,
    onPreviewPicture: handlePreviewPicture,
    onLikeIcon: handleLikeClick,
    onDeleteCard: handleDeleteCardClick,
    onInfoClick: handleInfoClick,
  });

  if (appendMode === "prepend") {
    placesWrap.prepend(cardElement);
    return;
  }
  placesWrap.append(cardElement);
};

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

function handleLikeClick(cardData, likeButton, likeCounter, isLiked) {
  changeLikeCardStatus(cardData._id, isLiked)
    .then((updatedCard) => {
      updateLikeUI(likeButton, likeCounter, updatedCard, currentUserId);
    })
    .catch((err) => {
      console.log(err);
    });
}

function handleDeleteCardClick(cardData, cardElement) {
  cardToDelete = { id: cardData._id, element: cardElement };
  openModalWindow(removeCardModalWindow);
}

function handleInfoClick(cardId) {
  getCardList()
    .then((cards) => {
      const cardData = cards.find((card) => card._id === cardId);
      if (!cardData) return;

      infoModalDescriptionList.replaceChildren();
      infoModalUsersList.replaceChildren();

      infoModalDescriptionList.append(
        createInfoString("Описание:", cardData.name),
        createInfoString("Дата создания:", formatDate(new Date(cardData.createdAt))),
        createInfoString("Владелец:", cardData.owner.name),
        createInfoString("Количество лайков:", String(cardData.likes.length))
      );

      infoModalUsersTitle.textContent = "Лайкнули:";
      if (cardData.likes.length === 0) {
        infoModalUsersList.append(createUserBadge({ name: "Пока нет лайков" }));
      } else {
        cardData.likes.forEach((user) => {
          infoModalUsersList.append(createUserBadge(user));
        });
      }

      openModalWindow(infoModalWindow);
    })
    .catch((err) => {
      console.log(err);
    });
}

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  renderLoading(true, profileSubmitButton, "Сохранить", "Сохранение...");

  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      updateUserInfo(userData);
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, profileSubmitButton, "Сохранить", "Сохранение...");
    });
};

const handleAvatarFormSubmit = (evt) => {
  evt.preventDefault();
  renderLoading(true, avatarSubmitButton, "Сохранить", "Сохранение...");

  setUserAvatar({ avatar: avatarInput.value })
    .then((userData) => {
      updateUserInfo(userData);
      closeModalWindow(avatarFormModalWindow);
      avatarForm.reset();
      clearValidation(avatarForm, validationConfig);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, avatarSubmitButton, "Сохранить", "Сохранение...");
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  renderLoading(true, cardSubmitButton, "Создать", "Создание...");

  createCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((newCard) => {
      renderCard(newCard, "prepend");
      closeModalWindow(cardFormModalWindow);
      cardForm.reset();
      clearValidation(cardForm, validationConfig);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, cardSubmitButton, "Создать", "Создание...");
    });
};

const handleRemoveCardSubmit = (evt) => {
  evt.preventDefault();
  if (!cardToDelete.id || !cardToDelete.element) return;

  renderLoading(true, removeCardSubmitButton, "Да", "Удаление...");

  deleteCard(cardToDelete.id)
    .then(() => {
      removeCardElement(cardToDelete.element);
      cardToDelete = { id: "", element: null };
      closeModalWindow(removeCardModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, removeCardSubmitButton, "Да", "Удаление...");
    });
};

profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);
removeCardForm.addEventListener("submit", handleRemoveCardSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(cardForm, validationConfig);
  openModalWindow(cardFormModalWindow);
});

const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

enableValidation(validationConfig);

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    currentUserId = userData._id;
    updateUserInfo(userData);
    cards.forEach((cardData) => renderCard(cardData));
  })
  .catch((err) => {
    console.log(err);
  });
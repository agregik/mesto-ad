const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCardElement = (
  cardData,
  { onPreviewPicture, onLikeIcon, onDeleteCard, onInfoClick, currentUserId }
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const infoButton = cardElement.querySelector(".card__control-button_type_info");
  const cardImage = cardElement.querySelector(".card__image");
  const likeCounter = cardElement.querySelector(".card__like-count");

  const isOwnCard = cardData.owner._id === currentUserId;
  const isLikedByUser = cardData.likes.some((user) => user._id === currentUserId);

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardElement.querySelector(".card__title").textContent = cardData.name;
  likeCounter.textContent = cardData.likes.length;

  if (isLikedByUser) {
    likeButton.classList.add("card__like-button_is-active");
  }

  if (onLikeIcon) {
    likeButton.addEventListener("click", () => onLikeIcon(cardData, likeButton, likeCounter));
  }

  if (!isOwnCard) {
    deleteButton.remove();
  } else if (onDeleteCard) {
    deleteButton.addEventListener("click", () => onDeleteCard(cardData, cardElement));
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () =>
      onPreviewPicture({ name: cardData.name, link: cardData.link })
    );
  }

  if (infoButton && onInfoClick) {
    infoButton.addEventListener("click", () => onInfoClick(cardData._id));
  }

  return cardElement;
};

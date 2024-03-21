// index.js

// Global variables
const ramenMenu = document.getElementById("ramen-menu")
const ramenDetail = document.getElementById("ramen-detail")
const rating = document.getElementById("rating-display")
const comment = document.getElementById("comment-display")
const submit = document.getElementById("new-ramen")

const ramenDataBase = []

let mouseOver = false
let keyDown = false

// Callbacks
const handleClick = () => {
  // Listens for click events in the ramen menu div
  ramenMenu.addEventListener("click", event => {
    const ramenId = event.target.getAttribute("id")
    const foundRamen = ramenDataBase.find(element => element.id == ramenId)
    displayReview(foundRamen)
  })
};

const addSubmitListener = () => {
  // Listens for submit events in the ramen form
  submit.addEventListener("submit", event => {
    event.preventDefault()
    const newName = event.target["new-name"].value
    const newRestaurant = event.target["new-restaurant"].value
    const newImage = event.target["new-image"].value
    const newRating = event.target["new-rating"].value
    const newComment = event.target["new-comment"].value
    const newRamen = {
      name: newName,
      restaurant: newRestaurant,
      image: newImage,
      rating: newRating,
      comment: newComment
    }
    // POSTs the new ramen object in the json.db file
    fetch("http://localhost:3000/ramens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(newRamen)
    })
    .then(response => response.json())
    .then(promise => {
      addDisplay(promise)
      ramenDataBase.push(promise)
      handleClick(promise)
    })
  })
}

document.getElementById("edit-ramen").addEventListener("submit", event => {
  event.preventDefault()
  const newRating = event.target.rating.value
  const newComment = event.target["new-comment"].value
  rating.textContent = newRating
  comment.textContent = newComment
})

const displayRamens = () => {
  // Displays Ramen from the database to the ramen-menu div
  fetch("http://localhost:3000/ramens")
  .then(response => response.json())
  .then(promise => {
    // Iterates through the ramen array creating an image for each ramen, giving the img tag an unique ID of the name of the ramen.
    for (const element of promise) {
      addDisplay(element)
      ramenDataBase.push(element)
    }
    handleClick(promise)
    displayReview(promise[0])
  })
  .catch(error => console.log(error))
}

/**
 * Updates the ramen-detail div with information of the selected ramen
 * @param {object} foundRamen 
 */
function displayReview(foundRamen){
  ramenDetail.querySelector(".detail-image").setAttribute("src", foundRamen.image)
  ramenDetail.querySelector(".name").textContent = foundRamen.name
  ramenDetail.querySelector(".restaurant").textContent = foundRamen.restaurant
  rating.textContent = foundRamen.rating
  comment.textContent = foundRamen.comment
}

/**
 * Adds new ramen onto the menu and displays the provided image
 * @param {object} ramen 
 */
function addDisplay(ramen){
  const ramenImage = document.createElement("img")
  ramenImage.setAttribute("src", ramen.image)
  ramenImage.setAttribute("id", ramen.id)
  ramenMenu.append(ramenImage)
}

const main = () => {
  displayRamens()
  addSubmitListener()
}

main()

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};


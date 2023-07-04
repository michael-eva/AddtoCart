//these modules need to be imported in order for the firebase DB to work
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// This is the URL for the firebase database we've created
const appSettings = {
    databaseURL: "https://realtime-database-d8ed3-default-rtdb.asia-southeast1.firebasedatabase.app/"
}


//spin up the db
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")


const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")



addButtonEl.addEventListener("click", function () {
    let inputValue = inputFieldEl.value
    if (inputValue) {
        push(shoppingListInDB, inputValue)

        clearInputFieldEl()
    }
})


//accessing and processing data from db

// converting DB object into an array
onValue(shoppingListInDB, function (snapshot) {
    if (snapshot.exists()) {
        //creates an array called shoppingList with the key & value pairs (Object.entries)
        let itemsArray = Object.entries(snapshot.val())
        //need to add this so that all array items aren't rendered twice
        clearShoppingListEl()

        // iterating through array and passing the individualItem through the render function to render it 
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]

            appendItemToShoppingListEl(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})



function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")

    newEl.textContent = itemValue

    newEl.addEventListener("click", function () {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)

        remove(exactLocationOfItemInDB)
    })

    shoppingListEl.append(newEl)
}
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}
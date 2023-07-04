//these modules need to be imported in order for the firebase DB to work
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// This is the URL for the firebase database we've created
const appSettings = {
    databaseURL: "https://realtime-database-d8ed3-default-rtdb.asia-southeast1.firebasedatabase.app/"
}


//spin up the db
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputEl = document.getElementById("input-field")
const addBtn = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addBtn.addEventListener("click", function () {
    let inputField = inputEl.value
    if (inputField) {

        // Push to the db
        push(shoppingListInDB, inputField)

        clearInput()
    }

})

//accessing and processing data from db

// converting DB object into an array
onValue(shoppingListInDB, function (snapshot) {

    if (snapshot.exists()) {

        //creates an array called shoppingList with the key & value pairs (Object.entries)
        let shoppingList = Object.entries(snapshot.val())

        //need to add this so that all array items aren't rendered twice
        clearShoppingListEl()

        // iterating through array and passing the individualItem through the render function to render it 
        for (let i = 0; i < shoppingList.length; i++) {
            let currentItem = shoppingList[i]
            let currentItemId = currentItem[0]
            let currentItemValue = currentItem[1]
            // console.log(currentItem)
            render(currentItem)
        }

    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }

})

function render(item) {
    let itemId = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li")
    newEl.textContent = itemValue


    newEl.addEventListener("click", function () {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemValue}`)

        this.remove(exactLocationOfItemInDB)
        // console.log(itemValue)
        // console.log(shoppingList)

    })
    shoppingListEl.append(newEl)
}

function clearInput() {
    inputEl.value = null
}
function clearShoppingListEl() {
    shoppingListEl.innerHTML = null
}
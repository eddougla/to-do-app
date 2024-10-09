// ****** select items **********

const form = document.querySelector("#task_form");
const error = document.querySelector("#error");
const task = document.querySelector("#task");
const addToDo = document.querySelector("#add_task");
const container = document.querySelector("#task_container");
const listItem = document.querySelector("#task_list");
const clearTasks = document.querySelector("#clear_tasks");
const filterBtns = document.querySelectorAll(".filter_btn");


// edit option
let editElement;
let editFlag = false;
let editID = "";
let sel = "list_item incomplete";

// ****** event listeners **********

// submit form
form.addEventListener("submit", addTask);
// clear list
clearTasks.addEventListener("click", clearItems);
// display items onload
window.addEventListener("DOMContentLoaded", setupItems);


// ****** functions **********



// add task

function addTask(e) {
    e.preventDefault();
    const value = task.value;
    const id = new Date().getTime().toString();

    if (value && !editFlag) {
        const element = document.createElement("article");
        let attr = document.createAttribute("data-id");
        attr.value = id;
        element.setAttributeNode(attr);
        element.className = sel;
        element.innerHTML = `<p class="title">${value}</p>
        <div class="btn_container">
        <!-- checkbox -->
        <span class="checkbox_container"><input id="status" type="checkbox" name="status"
                        value="status"><span class="checkbox"></span></span>
          <!-- edit btn -->
          <button type="button" id="edit_btn" class="edit_btn">
            <i class="fa-regular fa-pen-to-square fa-xl"></i>
          </button>
          <!-- delete btn -->
          <button type="button" id="delete_btn" class="delete_btn">
            <i class="fa-regular fa-trash-can fa-xl"></i>
          </button>
        </div>
      `;
        const deleteToDo = element.querySelector(".delete_btn");
        deleteToDo.addEventListener("click", deleteTask);
        const editToDO = element.querySelector(".edit_btn");
        editToDO.addEventListener("click", editTask);
        const status = element.querySelector("#status");
        status.addEventListener("change", changeStatus)
        // append child
        listItem.appendChild(element);
        // display alert
        displayError("Item added to the list.");
        // show container
        container.classList.add("show_container");
        // set local storage
        addToLocalStorage(id, value, sel);
        // set back to default
        setBackToDefault();
    } else if (value && editFlag) {
        editElement.innerHTML = value;
        displayError("Value changed.");
        // edit local storage
        editLocalStorage(editID, value);
        setBackToDefault();
    } else {
        displayError("Please enter a value.");

    }
}

// display error
function displayError(text) {
    error.textContent = text;

    // remove alert
    setTimeout(function () {
        error.textContent = "";
    }, 1000);
}

// clear items
function clearItems() {
    const items = document.querySelectorAll(".list_item");
    if (items.length > 0) {
        items.forEach(function (item) {
            listItem.removeChild(item);
        });
    }
    container.classList.remove("show_container");
    displayError("Empty list.");
    setBackToDefault();
    localStorage.removeItem("listItem");
}

// delete item
function deleteTask(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    listItem.removeChild(element);

    if (listItem.children.length === 0) {
        container.classList.remove("show_container");
    }
    displayError("Item removed.");

    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}

// edit item
function editTask(e) {
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    task.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    addToDo.textContent = "Edit Task";
}


// set back to defaults
function setBackToDefault() {
    task.value = "";
    editFlag = false;
    editID = "";
    addToDo.textContent = "Add Task";
}


// ****** local storage **********


// add to local storage
function addToLocalStorage(id, value, sel) {
    const task = { id, value, sel };
    let listItems = getLocalStorage();
    listItems.push(task);
    localStorage.setItem("listItem", JSON.stringify(listItems));
}

function getLocalStorage() {
    return localStorage.getItem("listItem") ? JSON.parse(localStorage.getItem("listItem")) : [];
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter(function (item) {
        if (item.id !== id) {
            return item;
        }
    });

    localStorage.setItem("listItem", JSON.stringify(items));
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();

    items = items.map(function (item) {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("listItem", JSON.stringify(items));
}

// change status
function changeStatus(e) {
    const element = e.currentTarget.parentElement.parentElement.parentElement;
    let items = getLocalStorage();


    if (e.currentTarget.checked) {
        element.classList.remove("incomplete");
        element.classList.add("complete");
    } else {
        element.classList.remove("complete");
        element.classList.add("incomplete");
    }

    const id = element.dataset.id;
    const name = element.className;

    items = items.map(function (item) {
        if (item.id === id) {
            item.sel = name;
        }
        return item;
    });
    localStorage.setItem("listItem", JSON.stringify(items));

}

// ****** setup items **********

function setupItems() {
    let items = getLocalStorage();

    if (items.length > 0) {
        items.forEach(function (item) {
            createListItem(item.id, item.value, item.sel);
        });
        container.classList.add("show_container");
    }
}

function createListItem(id, value, sel) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.className = sel;
    element.innerHTML = `<p class="title">${value}</p>
        <div class="btn_container">
        <!-- checkbox -->
        <span class="checkbox_container"><input id="status" type="checkbox" name="status"
                        value="status"><span class="checkbox"></span></span>
          <!-- edit btn -->
          <button type="button" id="edit_btn" class="edit_btn">
            <i class="fa-regular fa-pen-to-square fa-xl"></i>
          </button>
          <!-- delete btn -->
          <button type="button" id="delete_btn" class="delete_btn">
            <i class="fa-regular fa-trash-can fa-xl"></i>
          </button>
        </div>
      `;
    const deleteToDo = element.querySelector(".delete_btn");
    deleteToDo.addEventListener("click", deleteTask);
    const editToDO = element.querySelector(".edit_btn");
    editToDO.addEventListener("click", editTask);
    const status = element.querySelector("#status");
    status.addEventListener("change", changeStatus);
    if (sel === "list_item complete") {
        status.checked = true;
    } else {
        status.checked = false;
    }

    // append child
    listItem.appendChild(element);
}

//filter items
filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
        const status = e.currentTarget.dataset.id;
        let completed = Array.from(document.querySelectorAll(".list_item.complete"))
        let incompleted = Array.from(document.querySelectorAll(".list_item.incomplete"))
        let all = Array.from(document.querySelectorAll(".list_item"))

        if (status === "list_item complete") {
            if (completed.length > 0) {
                completed.forEach(function (complete) {
                    complete.classList.remove("hide_list_item")
                })
            }
            if (incompleted.length > 0) {
                incompleted.forEach(function (incomplete) {
                    incomplete.classList.add("hide_list_item")
                })
            }
        } else if (status === "list_item incomplete") {
            if (completed.length > 0) {
                completed.forEach(function (complete) {
                    complete.classList.add("hide_list_item")
                })
            }
            if (incompleted.length > 0) {
                incompleted.forEach(function (incomplete) {
                    incomplete.classList.remove("hide_list_item")
                })
            }
        } else if (status === "list_item all") {
            if (completed.length > 0) {
                completed.forEach(function (complete) {
                    complete.classList.remove("hide_list_item")
                })
            }
            if (incompleted.length > 0) {
                incompleted.forEach(function (incomplete) {
                    incomplete.classList.remove("hide_list_item")
                })
            }
        }

    })
})
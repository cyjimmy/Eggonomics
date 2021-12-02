var favos;
var favosStored;


// Check if page is ready! Makes sure that favos initiates when coming in from a different page or directly from link
if (document.readyState != "loading"){
    ready()
} else {
    document.addEventListener("DOMContentLoaded", ready())
}

// async get() gets called on page load so that you don't have to get favorites over and over
function ready(){
    let uid = localStorage.getItem("ID");
    favos = db.collection("favorite").doc(uid);
    favos.get().then(doc => {
        favosStored = doc.data().favorites;
    })
}

function populatePage (products, templateElement, targetElement){
    products.forEach(doc => {
        // get all item data
        let id = doc.data().id;

        let name = doc.data().name;
        let price = doc.data().price;
        let image = '/img/sampleAPIimgs/' + doc.data().image;
        let manufacturer = doc.data().manufacturer;
        let retail = doc.data().retailer;
        let stock = doc.data().in_stock;

        let product_card = templateElement.content.cloneNode(true);
        // change all texts
        product_card.querySelector(".item_name").innerText = name;
        product_card.querySelector(".item_price").innerText = `$${Number(price).toFixed(2)}`;
        product_card.querySelector(".img1").src = image;
        product_card.querySelector(".img2").src = image;

        product_card.querySelector(".item_figcap-name").innerText = name;
        product_card.querySelector(".item_price2").innerText = `$${Number(price).toFixed(2)}`;
        product_card.querySelector(".item_retail").innerText = retail;
        product_card.querySelector(".item_manu").innerText = manufacturer;
        product_card.querySelector(".item_quant").innerText = stock;
        let toggle = product_card.querySelector(".fav2");
        
        // change all IDs
        product_card.querySelector(".item_card").id = id + "_card";
        product_card.querySelector(".item_name").id = id + "_name";
        product_card.querySelector(".item_price").id = id + "_price";

        product_card.querySelector(".item_modal-body").id = id + "_modal-body";
        // product_card.querySelector(".item_modal-name").id = "item" + id + "_modal-name";
        
        product_card.querySelector(".item_modal").id = id + "_modal";
        product_card.querySelector(".item_card").setAttribute("data-bs-target", "#" + id + "_modal");

        // check for button states
        if (favosStored.includes(id)){
            toggle.classList.add("active");
            toggle.setAttribute("aria-pressed", true);
        }

        // event listeners
        product_card.querySelectorAll(".favorites").forEach(button => {
            button.addEventListener("click", () => {
                if (favosStored.includes(id)){
                    console.log("DELETE: " + id)
                    favosStored.splice(favosStored.indexOf(id), 1);
                    favos.update({
                        favorites: favosStored
                    })

                    // check for button states
                    toggle.classList.remove("active");
                    toggle.setAttribute("aria-pressed", false);

                    if (document.URL.includes("index.html")){
                        $(`#${id}_modal`).modal('hide');
                        document.querySelector(`#${id}_modal`).remove();
                        document.querySelector(`#${id}_card`).remove();
                    }
                } else {
                    console.log("ADD: " + id)
                    favos.update({
                        favorites: firebase.firestore.FieldValue.arrayUnion(id)
                    })

                    // check for button states
                    toggle.classList.add("active");
                    toggle.setAttribute("aria-pressed", true);

                    favosStored.push(id)
                }     
            });
        });

        // append to target_div
        targetElement.appendChild(product_card);
    })
}

function displayErrorMessage(targetElement, error_message){
    console.log(error_message);
            
    // make error div message element
    let error_div = document.createElement("figure");
    error_div.setAttribute("id", "error-message");

    let img = document.createElement("img");
    img.setAttribute("src", "/img/logo.png");
    img.setAttribute("id", "error-img");

    let message = document.createElement("figcaption");
    message.setAttribute("id", "error-message-text")
    message.innerText = error_message;

    error_div.appendChild(img);
    error_div.appendChild(message);

    // append to target_div
    targetElement.appendChild(error_div);
}
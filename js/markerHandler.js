var tableNumber = null
AFRAME.registerComponent("marker-handler", {
    init: async function () {

        if (tableNumber === null) {
            this.askUID()
        }
        this.el.addEventListener("markerFound", () => {
            this.handleMarkerFound()
            //console.log("marker found")

        })
        var toys = await this.getToys();
        this.el.addEventListener("markerLost", () => {
            console.log("marker poof")
            this.handleMarkerLost()
        })

    },
    askUID: function () {
        var iconUrl = "https://img.freepik.com/free-vector/toys-shop-vector-icon-illustration-building-landmark-icon-concept-white-isolated_138676-431.jpg";
        swal({
            title: "Welcome to THE TOY SHOP",
            icon: iconUrl,
            content: {
                element: "input",
                attributes: {
                    placeholder: "Type your uid. (Ex : U01)",
                    
                }
            },
            closeOnClickOutside: false,
        }).then(inputValue => {
            tableNumber = inputValue;
        });
    },

    handleMarkerFound: function () {
        var todaysDate = new Date();
        var todaysDay = todaysDate.getDay();

        // sunday - saturday : 0 - 6
        var days = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday"
        ];

        //Get the dish based on ID
        var dish = toys.filter(dish => dish.id === markerId)[0];

        //Check if the dish is available today
        if (dish.out_of_stock.includes(days[todaysDay])) {
            swal({
                icon: "warning",
                title: dish.dish_name.toUpperCase(),
                text: "Oops! This toy is out of stock today!!",
                timer: 2500,
                buttons: false
            });
        } else {
            //Changing Model scale to initial scale
            var model = document.querySelector(`#model-${dish.id}`);
            model.setAttribute("position", dish.position);
            model.setAttribute("rotation", dish.rotation);
            model.setAttribute("scale", dish.scale);

            //Update UI conent VISIBILITY of AR scene(MODEL , INGREDIENTS & PRICE)      
            model.setAttribute("visible", true);

            var ingredientsContainer = document.querySelector(`#main-plane-${dish.id}`);
            ingredientsContainer.setAttribute("visible", true);

            var priceplane = document.querySelector(`#price-plane-${dish.id}`);
            priceplane.setAttribute("visible", true)

            //Changing button div visibility
            var buttonDiv = document.getElementById("button-div");
            buttonDiv.style.display = "flex";

            var ratingButton = document.getElementById("order-summary-button");
            var orderButtton = document.getElementById("order-button");

            if (tableNumber != null) {
                //Handling Click Events
                ratingButton.addEventListener("click", function () {
                    swal({
                        icon: "warning",
                        title: "Order Summary",
                        text: "Work In Progress!"
                    });
                });

                orderButtton.addEventListener("click", () => {
                    var tNumber;
                    tableNumber = tableNumber.toUpperCase();
                    this.handleOrder(tableNumber, dish);

                    swal({
                        icon: "https://i.imgur.com/4NZ6uLY.jpg",
                        title: "Thanks For Ordering !",
                        text: "Your order will be delivered soon!!",
                        timer: 2000,
                        buttons: false
                    });
                });
            }
        }
    },

    handleOrder: function (uid, toy) {
        // Reading current UID order details
        firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then(doc => {
                var details = doc.data();

                if (details["current_orders"][toy.id]) {
                    // Increasing Current Quantity
                    details["current_orders"][toy.id]["quantity"] += 1;

                    //Calculating Subtotal of item
                    var currentQuantity = details["current_orders"][toy.id]["quantity"];

                    details["current_orders"][toy.id]["subtotal"] =
                        currentQuantity * toy.price;
                } else {
                    details["current_orders"][toy.id] = {
                        item: toy.toy_name,
                        price: toy.price,
                        quantity: 1,
                        subtotal: toy.price * 1
                    };
                }

                details.total_bill += toy.price;

                // Updating Db
                firebase
                    .firestore()
                    .collection("users")
                    .doc(doc.id)
                    .update(details);
            });
    },
    handleMarkerLost: function () {
        var buttonDiv = document.getElementById("button-div")
        buttonDiv.style.display = "none"
    },
    getToys: async function () {
        return await firebase
            .firestore()
            .collection("toys")
            .get()
            .then(snap => {
                return snap.docs.map(doc => doc.data());
            });
    }
})


AFRAME.registerComponent("add-marker", {
  init: async function () {

    var mainScene = document.querySelector("#main-scene");

    //get the dishes collection from firestore database
    var toys = await this.getToys();

    toys.map(dish => {
      var marker = document.createElement("a-marker");
      marker.setAttribute("id", dish.id);
      marker.setAttribute("type", "pattern");
      marker.setAttribute("url", dish.marker_pattern_url);
      marker.setAttribute("cursor", {
        rayOrigin: "mouse"
      });
      marker.setAttribute("marker-handler", {});
      mainScene.appendChild(marker);

      var todaysDate = new Date();
      var todaysDay = todaysDate.getDay();
      // Sunday - Saturday : 0 - 6
      var days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
      ];

      if (!dish.out_of_stock.includes(days[todaysDay])) {

        var model = document.createElement("a-entity");

        model.setAttribute("id", `model-${dish.id}`);
        model.setAttribute("position", dish.position);
        model.setAttribute("rotation", dish.rotation);
        model.setAttribute("scale", dish.scale);
        model.setAttribute("gltf-model", `url(${dish.model_url})`);
        model.setAttribute("gesture-handler", {});
        model.setAttribute("visible", false)
        marker.appendChild(model);

        var mainPlane = document.createElement("a-plane");
        mainPlane.setAttribute("id", `main-plane-${dish.id}`);
        mainPlane.setAttribute("position", { x: 0, y: 0, z: 0 });
        mainPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
        mainPlane.setAttribute("width", 2.3);
        mainPlane.setAttribute("height", 2.5);
        mainPlane.setAttribute("material", { color: "#ffd880" })
        mainPlane.setAttribute("visible", false)
        marker.appendChild(mainPlane);

        // Dish title background plane
        var titlePlane = document.createElement("a-plane");
        titlePlane.setAttribute("id", `title-plane-${dish.id}`);
        titlePlane.setAttribute("position", { x: 0, y: 1.1, z: 0.1 });
        titlePlane.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        titlePlane.setAttribute("width", 2.31);
        titlePlane.setAttribute("height", 0.4);
        titlePlane.setAttribute("material", { color: "#f14668" });
        mainPlane.appendChild(titlePlane);

        // Dish title
        var dishTitle = document.createElement("a-entity");
        dishTitle.setAttribute("id", `toy-title-${dish.id}`);
        dishTitle.setAttribute("position", { x: 0, y: 0, z: 0.1 });
        dishTitle.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        dishTitle.setAttribute("text", {
          font: "monoid",
          color: "#290149",
          width: 1.8,
          height: 1,
          align: "center",
          value: dish.name.toUpperCase()
        });
        titlePlane.appendChild(dishTitle);

        // Ingredients List
        var ingredients = document.createElement("a-entity");
        ingredients.setAttribute("id", `toy-${dish.id}`);
        ingredients.setAttribute("position", { x: 0, y: 0, z: 0.1 });
        ingredients.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        ingredients.setAttribute("text", {
          font: "monoid",
          color: "#6b011f",
          width: 2,
          align: "center",
          value: dish.description
        });
        mainPlane.appendChild(ingredients);


        var age = document.createElement("a-entity");
        age.setAttribute("id", `age-group-${dish.id}`);
        age.setAttribute("position", { x: 0, y: -1, z: 0.1 });
        age.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        age.setAttribute("text", {
          font: "monoid",
          color: "#290149",
          width: 2,
          align: "center",
          value: dish.age_group
        });
        mainPlane.appendChild(age);

        var pricePlane = document.createElement("a-image")
        pricePlane.setAttribute("id", `price-plane-${dish.id}`)
        pricePlane.setAttribute("src", "https://raw.githubusercontent.com/VishmayaGithub/web-ar-assets/main/black-circle.png")
        pricePlane.setAttribute("position", { x: -1.8, y: 0, z: 0.5 })
        pricePlane.setAttribute("rotation", { x: -90, y: 0, z: 1 });
        pricePlane.setAttribute("visible", false);

        var price = document.createElement("a-entity");
        price.setAttribute("id", `price-${dish.id}`);
        price.setAttribute("position", { x: 0.03, y: 0.05, z: 0.1 });
        price.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        price.setAttribute("text", {
          font: "mozillavr",
          color: "white",
          width: 3,
          align: "center",
          value: `Only\n $${dish.price}`
        });


        pricePlane.appendChild(price);
        marker.appendChild(pricePlane);
      }

    })




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
});


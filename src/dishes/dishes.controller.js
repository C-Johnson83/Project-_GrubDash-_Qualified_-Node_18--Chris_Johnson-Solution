const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function create(req, res) {
    const { data: { name, description, price, image_url } } = req.body;
    const newDish = {
        id: nextId(),
        name: name,
        description: description,
        price: price,
        image_url: image_url
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}
function hasDescription(req, res, next) {
    const { data: { description } = {} } = req.body;
  
    if (description) {
      return next();
    }
    next({ status: 404, message: "A 'description' property is required." });
  }

function list(req, res) {
    res.json({ data: dishes });
}
function dishExists(req, res, next) {
    const dishId = (req.params.dishId);
    const foundDish = dishes.find((dish) => dish.id === dishId)
    console.log(dishId, foundDish);
    if (foundDish) {
        res.locals.dish = foundDish
    return next();
}
next({
    status: 404,
    message: `Dish not found: ${req.params.dishId}`
});

}


function read(req, res) {
    res.json({ data: res.locals.dish });
}





module.exports = {
    create:[hasDescription, create],
    list,
    read:[dishExists, read]
}
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

function hasParams(propertyName){
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
      next({ status: 400, message: `Must include a ${propertyName}` });
  }
  }

function checkPrice(req, res, next) {
  const { data: { price } = {} } = req.body;
  const expPrice = 0
  if(price < expPrice){
    console.log(price)
    console.log(expPrice)
     return next({status:400, message: `Must include a price value greater than 0`} )
  }
   next()
   
  }


function list(req, res) {
    res.json({ data: dishes });
}
function dishExists(req, res, next) {
    const dishId = (req.params.dishId);
    const foundDish = dishes.find((dish) => dish.id === dishId)
 
    if (foundDish) {
        res.locals.dish = foundDish
    return next();
}
next({
    status: 404,
    message: `Dish does not exist: ${req.params.dishId}`
});

}

function read(req, res) {
    res.json({ data: res.locals.dish });
}
function idsMatch(req,res,next){
  console.log(res.locals.dish)
  res.json({ data: res.locals.dish });
}
function update(req, res) {
  const dish = res.locals.dish;
  const { data: { id, name, description, price, image_url }={} } = req.body;
  dish.name = name,
  dish.description = description,
  dish.price = price,
  dish.image_url = image_url;
  
  res.json({data: dish})
  }

module.exports = {
    // create:[hasName, create],
    create:[hasParams("name"),
    hasParams("description"),
    hasParams("price"),
    hasParams("image_url"),
    checkPrice, create],
    list,
    read:[dishExists, read],
    update:[dishExists,hasParams("name"),
    hasParams("description"),
    hasParams("price"),
    hasParams("image_url"), idsMatch, update]
}
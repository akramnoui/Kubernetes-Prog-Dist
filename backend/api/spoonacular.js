const axios = require('axios');
const config = require('../config/config');

const getNutrientsByDishName = async (dishName) => {
  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/guessNutrition?title=${dishName}&apiKey=${config.spoonacular}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching dish nutrients', error);
  }
};

module.exports = {getNutrientsByDishName};
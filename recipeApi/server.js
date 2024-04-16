const express = require('express');
const axios = require('axios');
const cors = require("cors")



const app = express();
const port = 4000;


app.use(cors({
    origin: 'http://localhost:3000', // Replace with your client URL
    credentials: true // Allow cookies to be sent
  }));


const API_KEY = 'a33be9b8bfmsh3d6d5e115f3ac2bp108e50jsn754e73a2dcdb'; // Replace 'YOUR_API_KEY' with your actual Spoonacular API key

// Middleware to parse JSON bodies
app.use(express.json());

// Function to search recipes based on specific criteria
async function searchRecipes(criteria) {
    try {
        const response = await axios.get('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch', {
            params: criteria,
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to search recipes');
    }
}

// Function to get recipe information by ID
async function getRecipeInformation(recipeId) {
    try {
        const response = await axios.get(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information`, {
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get recipe information');
    }
}

// Function to find recipes by ingredients
async function findRecipesByIngredients(ingredients) {
    try {
        const response = await axios.get('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients', {
            params: {
                ingredients: ingredients.join(','),
                number: 5,
                ignorePantry: true,
                ranking: 1
            },
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to find recipes by ingredients');
    }
}

// Function to get price breakdown by recipe ID
async function getPriceBreakdown(recipeId) {
    try {
        const response = await axios.get(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/priceBreakdownWidget.json`, {
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get price breakdown');
    }
}

// API endpoint to search recipes
app.post('/api/search-recipes', async (req, res) => {
    try {
        console.log("body ",req.body)
        const recipes = await searchRecipes(req.body);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to get recipe information by ID
app.get('/api/recipe-information/:id', async (req, res) => {
    try {
        const recipeInfo = await getRecipeInformation(req.params.id);
        res.json(recipeInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to find recipes by ingredients
app.post('/api/find-recipes-by-ingredients', async (req, res) => {
    try {
        const recipes = await findRecipesByIngredients(req.body.ingredients);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to get price breakdown by recipe ID
app.get('/api/price-breakdown/:id', async (req, res) => {
    try {
        const priceBreakdown = await getPriceBreakdown(req.params.id);
        res.json(priceBreakdown);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



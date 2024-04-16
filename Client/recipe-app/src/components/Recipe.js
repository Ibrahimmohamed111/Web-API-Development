import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./recipe.css"
import AuthHOC from './AuthHOC';

function RecipeDetails({ recipe, onClose }) {
  return (
    <div className="recipe-details">
      <button className="back-button" onClick={onClose}>Back to Recipes</button>
      <div className="recipe-info">
        <h2>{recipe.title}</h2>
        <img src={recipe.image} alt={recipe.title} />
        <p><strong>Ready in:</strong> {recipe.readyInMinutes} minutes</p>
        <p><strong>Servings:</strong> {recipe.servings}</p>
        <p><strong>Price per Serving:</strong> ${recipe.pricePerServing}</p>
        <p><strong>Health Score:</strong> {recipe.healthScore}</p>
        <h3>Extended Ingredients:</h3>
        <ul>
          {recipe.extendedIngredients.map(ingredient => (
            <li key={ingredient.id}>{ingredient.name}: {ingredient.original}</li>
          ))}
        </ul>
        <h3>Instructions:</h3>
        <ol>
          {recipe.analyzedInstructions[0].steps.map(step => (
            <li key={step.number}>{step.step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Recipe() {
  const [searchCriteria, setSearchCriteria] = useState({
    includeIngredients: '',
    cuisine: '',
    dish: '',
    dietaryPreferences: '',
    cookingMethod: ''
  });
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };

  const handleSearchRecipes = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/search-recipes', searchCriteria);
      console.log("search res: ", response.data.results)
      setRecipes(response.data.results);
    } catch (error) {
      console.error('Error searching recipes:', error);
    }
  };

  useEffect(() => {
    handleSearchRecipes();
  }, []);

  const fetchRecipeDetails = async (id) => {
    try {
      const [recipeInformation, priceBreakdown] = await Promise.all([
        axios.get(`http://localhost:4000/api/recipe-information/${id}`),
        axios.get(`http://localhost:4000/api/price-breakdown/${id}`)
      ]);
      console.log('Recipe Information:', recipeInformation.data);
      console.log('Price Breakdown:', priceBreakdown.data);
      setSelectedRecipe({ ...recipeInformation.data, priceBreakdown: priceBreakdown.data });
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  const handleBackToRecipes = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="App">
      <h1>Recipe Search</h1>
      <div className="search-form">
        <label>Include Ingredients:</label>
        <input type="text" name="includeIngredients" value={searchCriteria.includeIngredients} onChange={handleInputChange} />
        <label>Cuisine:</label>
        <input type="text" name="cuisine" value={searchCriteria.cuisine} onChange={handleInputChange} />
        <label>Dish:</label>
        <input type="text" name="dish" value={searchCriteria.dish} onChange={handleInputChange} />
        <label>Dietary Preferences:</label>
        <input type="text" name="dietaryPreferences" value={searchCriteria.dietaryPreferences} onChange={handleInputChange} />
        <label>Cooking Method:</label>
        <input type="text" name="cookingMethod" value={searchCriteria.cookingMethod} onChange={handleInputChange} />
        <button onClick={handleSearchRecipes}>Search Recipes</button>
      </div>
      <div className="recipes">

        {!selectedRecipe && recipes.map(recipe => (
          <div key={recipe.id} className="recipe-card">
            <h3>{recipe.title}</h3>
            <img src={recipe.image} alt={recipe.title} />
            <button className='details-button' onClick={() => fetchRecipeDetails(recipe.id)}>View Details</button>
          </div>
        ))}
        {selectedRecipe && <RecipeDetails recipe={selectedRecipe} onClose={handleBackToRecipes} />}
      </div>
    </div>

  );
}

export default AuthHOC(Recipe);

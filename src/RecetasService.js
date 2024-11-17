// src/RecetasService.js
import axios from 'axios';

const API_URL = 'https://www.themealdb.com/api/json/v1/1';

export const buscarRecetasPorIngredientes = async (ingredientes) => {
  try {
    const recetasUnicas = new Set();

    for (const ingrediente of ingredientes) {
      const response = await axios.get(`${API_URL}/filter.php`, {
        params: { i: ingrediente }
      });
      
      const recetas = response.data.meals || [];
      recetas.forEach((receta) => recetasUnicas.add(JSON.stringify(receta)));
    }

    return Array.from(recetasUnicas).map((receta) => JSON.parse(receta));
  } catch (error) {
    console.error("Error al buscar recetas:", error);
    return [];
  }
};

export const buscarRecetaPorID = async (idMeal) => {
  try {
    const response = await axios.get(`${API_URL}/lookup.php`, {
      params: { i: idMeal }
    });
    return response.data.meals[0];
  } catch (error) {
    console.error("Error al obtener los detalles de la receta:", error);
    return null;
  }
};

// Nueva función para obtener todos los ingredientes
export const obtenerListaDeIngredientes = async () => {
  try {
    const response = await axios.get(`${API_URL}/list.php?i=list`);
    return response.data.meals.map((meal) => meal.strIngredient);
  } catch (error) {
    console.error("Error al obtener la lista de ingredientes:", error);
    return [];
  }
};

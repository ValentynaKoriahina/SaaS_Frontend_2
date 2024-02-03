import { fetchWithRefreshAuth } from "./fetchWithRefreshAuth";

/**
 * Retrieves the user data set for rendering the Dashboard from the server.
 * @async
 * @function
 * @returns {Promise<Object>} The user data object obtained from the server.
 * @throws {Error} If an error occurs while requesting the server.
 */



async function getUserDataForDashboard() {
  try {
    const response = await fetchWithRefreshAuth("/api/getUserDataForDashboard");

    // Extracts data from the response in JSON format.
    const data = await response.json();

    console.log('data', data);
    if (data.status == "fail") {
      alert("Please log in.");
      console.log(data.message);
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error while requesting the server:", error);
    throw error;
  }
}

// Exports the function for use in other parts of the code.
export { getUserDataForDashboard };

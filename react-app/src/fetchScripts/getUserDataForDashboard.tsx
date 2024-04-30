import { fetchWithRefreshAuth } from "./fetchWithRefreshAuth";

/**
 * Retrieves the user data set for rendering the Dashboard from the server.
 * @async
 * @function
 * @returns {Promise<Object>} The user data object obtained from the server.
 * @throws {Error} If an error occurs while requesting the server.
 */



async function getRegistredUserData() {
  try {
    const response = await fetchWithRefreshAuth("/api/getRegistredUserData");

    // Extracts data from the response in JSON format.
    const data = await response.json();

    if (data.status == "fail") {
      alert("Please log in.");

    } else {
      return data;
    }
  } catch (error) {
    console.error("Error while requesting the server:", error);
    throw error;
  }
}


async function getTempUserData(orderId: string | null) {
  try {
    const response = await fetch("/api/getTempUserData/" + orderId);

    // Extracts data from the response in JSON format.
    const data = await response.json();

    if (data.status == "fail") {
      alert("Please log in.");
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error while requesting the server:", error);
    throw error;
  }
}

async function getMessages(orderId: string | null) {
  try {
    const response = await fetch("/api/getMessages/" + orderId);

    // Extracts data from the response in JSON format.
    const data = await response.json();

    if (data.status == "fail") {
      alert("Error");
    } else {
      console.log(data)
      return data;
    }
  } catch (error) {
    console.error("Error while requesting the server:", error);
    throw error;
  }
}

async function saveMessage(messageId: number) {
  try {
    const response = await fetch("/api/saveMessage/", {
      method: "POST", // Метод запроса POST
      headers: {
        "Content-Type": "application/json", // Устанавливаем заголовок Content-Type для отправки данных в формате JSON
      },
      body: JSON.stringify({ messageId }), // Преобразуем параметры запроса в формат JSON и передаем в теле запроса
    });

    // Извлекаем данные из ответа в формате JSON.
    const data = await response.json();

    if (data.status === "fail") {
      alert("Error");
    } else {
      console.log(data);
      return data;
    }
  } catch (error) {
    console.error("Error while requesting the server:", error);
    throw error;
  }
}

// Exports the function for use in other parts of the code.
export { getRegistredUserData, getTempUserData, getMessages, saveMessage };

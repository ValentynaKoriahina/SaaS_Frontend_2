
async function fetchWithRefreshAuth(url: string, options: RequestInit = {}): Promise<Response> {
  console.log("###################");

  // const accessToken = localStorage.getItem('accessToken');
  
  // if (accessToken) {
  //   options.headers = {
  //     ...options.headers,
  //     'Authorization': `Bearer ${accessToken}`
  //   };
  // }

  let response = await fetch(url, options);
  console.log("response", response.status);
  // Проверка на статус 401 и условия для повторного запроса
  if (response.status == 401) {
    const isRefreshSuccess = await refreshToken();
    console.log("isRetrySuccess", isRefreshSuccess);
    if (isRefreshSuccess) {
      response = await fetch(url, options); // Повторный запрос с обновленным токеном
      console.log("response");
      console.log(response);
    }
  }

  return response;
}

// Функция для обновления токена
async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch(`/api/refresh`, {
      method: 'GET',
      credentials: 'include', // withCredentials: true Axios
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log('!!!!!!');
      console.log(data);

      localStorage.setItem('accessToken', data.accessToken); // Обновление токена в хранилище
      
      return true;
    }
    console.log('НЕ АВТОРИЗОВАН');
    return false;
  } catch (error) {
    console.error('Ошибка при обновлении токена', error);
    return false;
  }
}

// Exports the function for use in other parts of the code.
export { fetchWithRefreshAuth };

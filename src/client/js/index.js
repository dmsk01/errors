const getData = async (requestsCount = 0) => {
  showLoader();
  const response = await fetch("http://localhost:3000/api/products?status=500");
  if (response.ok) {
    try {
      return await response.json();
    } catch (error) {
      addToast("Произошла ошибка, попробуйте обновить страницу позже");
      console.error(error);
    } finally {
      hideLoader();
    }
  } else {
    switch (response.status) {
      case 404:
        hideLoader();
        addToast("Список товаров пуст");
        break;
      case 500:
        if (requestsCount < 2) {
          getData(++requestsCount);
        } else {
          hideLoader();
          addToast("Произошла ошибка, попробуйте обновить страницу позже");
        }
        break;

      default:
        throw new Error(response.statusText);
    }
  }
};

try {
  const products = getData();
  console.log(products);
} catch (error) {
  console.log(error);
}

window.addEventListener("offline", () => {
  console.log("offline");
  addToast("Произошла ошибка, пожалуйста, проверьте подключение к интернету");
});

window.addEventListener("online", () => {
  console.log("online");
  addToast("Подключение к сети восстановлено");
});

function addToast(message) {
  const toastTemplate = document.createElement("div");
  const errorContainer = document.getElementById("error-container");

  toastTemplate.innerText = message;
  toastTemplate.classList.add("toast-block");
  errorContainer.append(toastTemplate);

  delay(100)
    .then(() => {
      toastTemplate.classList.add("active");
      return delay(3000);
    })
    .then(() => {
      toastTemplate.remove();
      return delay(3000);
    });
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function showLoader() {
  const loader = document.getElementById("loader");
  loader.hidden = false;
}

function hideLoader() {
  const loader = document.getElementById("loader");
  loader.hidden = true;
}

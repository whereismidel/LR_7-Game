function fill(cell, duration) {
  // функція відновення стану після програшу звуку
  setTimeout(() => {
    cell.setAttribute("style", "background-color:aliceblue");
  }, duration * 1000);
}
// Запуск звуку
function play(instrument, callback) {
  var audio = new Audio(); // створення об'єкту класу Аудіо
  // прогрузка пісень під час загрузки сторінки
  audio.preload = "auto";
  // шлях звуку
  audio.src = `sound/${instrument}.mp3`;
  // отримання клітинки по назві інструменту
  cell = document.getElementById(instrument);
  // встановлення фону на час тривання звуку
  cell.setAttribute("style", "background-color:aquamarine");
  // щоб прогрузити метаданні звуку, а саме тривалість
  audio.addEventListener("loadedmetadata", function () {
    audio.play(); // відтворення звуку
    // callback функція, яка виконається в любому випадку і
    // відновить фон у клітинки
    callback(cell, audio.duration);
  });
}

// надаю обробники всім інструментам
document.querySelectorAll(".cell").forEach(function (instrument) {
  instrument.addEventListener("click", function (event) {
    play(event.target.id, fill);
  });
});

// обробник натискання клавіш
document.addEventListener("keydown", function (event) {
  switch (event.code) {
    case "KeyA":
      play("drum", fill);
      break;
    case "KeyB":
      play("flageolet", fill);
      break;
    case "KeyC":
      play("garmonic", fill);
      break;
    case "KeyD":
      play("guitar", fill);
      break;
    case "KeyE":
      play("piano", fill);
      break;
    case "KeyF":
      play("trumpet", fill);
      break;
  }
});

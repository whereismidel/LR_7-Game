$(document).ready(() => {
  let colorList = ["purple", "blue", "yellow", "orange"]; // список кольорів
  let seq = []; // послідовність, в яку записується гра
  let userSeq = []; // послідовність, в яку записуються ходи гравця
  counter = 0; // лічильник вдалих циклів повтору

  audioChoose = new Audio("sound/choose.mp3"); // звук вибору
  audioLose = new Audio("sound/fail.mp3"); // звук програшу
  audioShow = new Audio("sound/show.mp3"); // звук відображення кольору

  function start() {
    // початок гри
    $(".cell").css("border-color", "transparent"); // онулення всіх рамок
    showColor(); // вибір першого кольору
  }

  function showColor() {
    // функція відображення кольору
    audioShow.play(); // відтворення звуку відображення
    // випадкове число від 0 до 3
    let color = Math.floor(Math.random() * colorList.length);

    // функція приховання і відображення кольорів
    toggleColor = (c) => {
      let click = "none";
      if ($(`#${c}`).css("pointer-events") === "none") {
        // якщо колір вже показаний
        click = "auto"; // то дозволити натискати на нього
      } else {
        // інакше, показати колір з анімацією розширення
        $(`#${c}`)
          .animate(
            {
              width: "440px", // зміна розміру спочатку до таких
              height: "440px",
            },
            500 // тривалість анімації
          )
          .animate(
            {
              width: "200px", // потім зменшення до почтакових
              height: "200px",
            },
            500 // тривалість анімації
          );
      }

      for (let i = 0; i < colorList.length; i++) {
        if (i !== c) $(`#${i}`).toggle(); // переключення видимості решти кнопок
      }
      $(`#${c}`).css("pointer-events", click); // встановлення дозволу на натискання
    };

    $(".instruction").text("Запам'ятай колір :)"); // зміна тексту
    toggleColor(color); // приховання всіх кольорів, окрім обраного
    setTimeout(() => {
      // таймер на 1 секунду
      toggleColor(color); // після 1 секунди відобразити всі кольори
      seq.push(color); // добавити обраний колір в послідовність гри
      $(".instruction").text("Відтвори всю послідовність");
    }, 1000);
  }

  function play(color) {
    // функція ходу
    if (color == seq[userSeq.length]) {
      // якщо обрані гравцем кольори відповідають послідовно
      audioChoose.play(); // то звук вибору правильного кольору
      $(`#${color}`).css("border-color", "green"); // рамка навкого правильного
      setTimeout(() => {
        // таймер на приховання рамки
        $(`#${color}`).css("border-color", "transparent");
      }, 750);
      userSeq.push(color); // додавання цього кольору в послідовність гравця для подальшого порівняння

      // якщо гравець повторив всі кольори, то показати наступний
      if (userSeq.length === seq.length) {
        counter++; // додати очко гравцеві
        $(".counter").text(`Ваш рахунок: ${counter}`); // зміна тексту
        userSeq.splice(0, userSeq.length); // очистка масиву гравця для майбутнього відтворення
        showColor(); // відображення нового кольору
      }
    } else {
      // інакше якщо гравець помилився при виборі
      $(`#${color}`).css("border-color", "red"); // червона рамка на його виборі
      $(`#${seq[userSeq.length]}`).css("border-color", "green"); // зелена на правильному
      gameOver(); // виклик функції завершення гри
    }
  }

  function gameOver() {
    // функція завершення гри
    audioLose.play(); // звук програшу
    counter = 0; // онулення лічильника
    $(".counter").text(`Ваш рахунок: ${counter}`); // зміна тексту
    userSeq.splice(0, userSeq.length); // очистка масивів гравця і гри
    seq.splice(0, seq.length);
    for (let i = 0; i <= 1; i++) {
      // подвійне блимання напису при програші
      $(".instruction")
        .text("Ви програли :( Натисніть на квадрат, щоб начати заново")
        .fadeOut(1000) // потухає за 1 секунду
        .fadeIn(1000); // назад з'являється за 1 секунду
    }
    console.log("Game over"); // Лог, що гра завершена
  }

  $(".cell").on("click", (cell) => {
    // основний обробник події кліка на блок
    if (seq.length === 0) {
      // якщо послідовність гри порожня, то почати гру
      start();
    } else {
      // інакше продовжити
      play(cell.target.id);
    }
  });
});

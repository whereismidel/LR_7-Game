/* Отримую всі блоки з клітинками */
let cells = document.querySelectorAll(".cell");

/* Ігрове поле, щоб кожен раз не звертатись до веб-елементів */
let field = [
  ["-", "-", "-"],
  ["-", "-", "-"],
  ["-", "-", "-"],
];
/* 
    Номера вільних клітинок для ходу
    Необхідно для того, щоб не зациклювати пошук пустої клітинки комп'ютером.
*/
let free_cell = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let end = false; // Прапор який повідомляє про закінчення гри, та не дає зроибити хід

/*
    Отримання блоку з тегом зображення та заповненими:
    класом та конкретним шляхом до вказаного елемента.
    Або Х або О.
*/
function getImg(char) {
  let e = document.createElement("img"); // створюється елемент
  e.className = "move"; // присвоюється клас
  e.src = `${char}.png`; // вказується шлях

  return e; // повертається готовий блок
}

function doPlayer(target, botMove) {
  // хід гравця
  if (!end) {
    //  якщо гра не завершена
    let id = parseInt(target.id); // отримує значення клітинки по якій натиснуто
    let ind = free_cell.indexOf(id); // перевіряється чи ця клітинки не зайнята
    if (ind !== -1) {
      // якщо не зайнята, то виконуються наступні дії
      free_cell.splice(ind, 1); // клітинка стає недоступною(видаляється зі списку)

      cells[id].appendChild(getImg("X")); // на місце кліку встановлюється Х
      // в змінну поля на відповідне місце ставиться Х
      field[Math.floor(id / 3)][id % 3] = "X";

      // Перевіряється чи зроблений хід не завершив гру
      end = checkWinner();
      if (!end) {
        // Якщо гра ще не завершена
        botMove(target); // callback виклик функції ходу комп'ютера
      }
    }
  }
}

function doBot(target) {
  // Випадковий індекс елемента в пустих клітинках
  let ind = Math.floor(Math.random() * free_cell.length);
  // Номер пустої клітинки по цьому індексу
  let id = free_cell[ind];

  // Видалення цього елемента, оскільки він вже зайнятий
  free_cell.splice(ind, 1);

  // На місце обраної клітинки ставиться О
  cells[id].appendChild(getImg("O"));
  // в змінну поля на відповідне місце ставиться О
  field[Math.floor(id / 3)][id % 3] = "O";

  end = checkWinner(); // перевірка чи хід не заверший гру
}

function checkWinner() {
  // функція перевірки кінця гри
  for (let i = 0; i < 3; i++) {
    // перевірка всіх горизонтальних ліній
    if (
      field[i][0] !== "-" &&
      field[i][0] === field[i][1] &&
      field[i][0] === field[i][2]
    ) {
      // Отримую приховану горизонтальну лінію
      let line = document.querySelector(".horizontal");
      // Відображаю її та міняю положення відносно переможної
      line.setAttribute("style", `visibility:visible; top:${70 + i * 160}px`);
      // Відоражає переможця
      showWinner(field[i][0]);
      return true; // повертається результат що гра завершена
    }

    // Перевірка всіх вертикальних ліній
    if (
      field[0][i] !== "-" &&
      field[0][i] === field[1][i] &&
      field[0][i] === field[2][i]
    ) {
      // аналогічно до горизонтальних, але отримується прихована вертикальна лінія
      let line = document.querySelector(".vertical");
      line.setAttribute(
        "style",
        `visibility:visible; left:${-160 + i * 160}px`
      );
      showWinner(field[0][i]);
      return true;
    }
  }
  // Перевірка головної діагоналі з аналогічними діями
  if (
    field[0][0] !== "-" &&
    field[0][0] === field[1][1] &&
    field[0][0] === field[2][2]
  ) {
    let line = document.querySelector(".diagonal");
    line.setAttribute("style", `visibility:visible;`);
    showWinner(field[0][0]);
    return true;
  }
  // Перевірка побічної діагоналі з аналогічними діями
  if (
    field[0][2] !== "-" &&
    field[0][2] === field[1][1] &&
    field[0][2] === field[2][0]
  ) {
    let line = document.querySelector(".diagonal");
    line.setAttribute("style", "visibility:visible; transform: rotate(135deg)");
    showWinner(field[0][2]);
    return true;
  }

  // Перевірка на наявність пустих клітинок на полі
  if (free_cell.length === 0) {
    showWinner("-");
    return true;
  }

  return false;
}

function showWinner(winner) {
  // Інформація про переможця
  // Отримується елемент з написом "Результат"
  let win_elem = document.getElementById("winner-text");

  if (winner === "X") {
    // якщо передано символ "Х"
    win_elem.innerText = "ВИ ПЕРЕМОГЛИ!";
  } else if (winner === "O") {
    // якщо передано символ "О"
    win_elem.innerText = "ПЕРЕМІГ КОМП'ЮТЕР :(";
  } else {
    // якщо передано символ "-" (або будь-який інший)
    win_elem.innerText = "НІЧИЯ";
  }
}

// обробка кожної клітинки та присвоєня їй обробника подій
cells.forEach(function (cell) {
  // якщо був виконаний клік по відповідній клітинці, відбувається виклик
  // другий аргумент - callback функція, яка оголошена анонімно
  cell.addEventListener("click", function (event) {
    target = event.currentTarget; // обирається саме блок
    doPlayer(target, doBot); // передається керування функції ходу для гравця
  });
});

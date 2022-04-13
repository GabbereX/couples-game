(() => {
  // создаем титл игры
  function createTitleGame() {
    const title = document.createElement('h1');

    title.textContent = 'Играем в пары';
    title.classList.add('title', 'text')

    return {
      title,
    }
  };

  // создаем стартовую страницу с правилами и настройками для игры
  function createStartPageGame() {
    const container = document.createElement('div');
    const description = document.createElement('p');
    const form = document.createElement('form');
    const input = document.createElement('input');
    const button = document.createElement('button');

    description.textContent = 'Игрок видит квадратное поле из карточек, расположенных "рубашкой" вверх, и находит пары одинаковых карточек, открывая их в произвольном порядке. На открытых карточках цифры. Игрок открывает сначала одну карточку, затем вторую. Если обе открытые карточки одинаковы, они остаются открытыми до конца партии. В противном случае они переворачиваются обратно.';
    button.textContent = 'Начать игру'
    input.placeholder = 'Введите чётное число от 2 до 10';
    input.type = 'number';

    description.classList.add('text');
    form.classList.add('flex-direction')
    input.classList.add('input');
    button.classList.add('button');

    button.disabled = true;

    form.append(input, button);
    container.append(description, form);

    // корректировка значения в input
    input.addEventListener('input', (e) => {
      e.preventDefault();
      button.disabled = false;
      if (input.value < 2) {
        input.value = 2;
        // button.disabled = false;
      } else if (input.value > 10) {
        input.value = 10;
      } else if (input.value % 2) {
        input.value++;
      };
    });

    return {
      form,
      input,
      button,
      container,
    }
  };

  // создаем игровую площадку и таймер
  function createGameList() {
    const list = document.createElement('ul');
    const timer = document.createElement('div');

    list.classList.add('list');
    timer.classList.add('text', 'timer');

    return {
      timer,
      list,
    };
  };

  // создаем элемент на игровой площадке
  function createGameElement(value) {
    const item = document.createElement('li');
    const number = document.createElement('div');

    item.classList.add('item', 'question');
    number.classList.add('disabled');

    number.textContent = value;

    item.append(number);

    return {
      item,
      number,
    };
  };

  // выполнение разметки и запуск игры
  function getGame() {
    const gameTitle = createTitleGame(); // титл игры
    const gameRules = createStartPageGame(); // стартовая страница
    const gameList = createGameList(); // игровая площадка

    const elementsValues = []; // массив со значениями элементов
    let inputValue = null; // далее тут будет значение в инпуте
    let interval = null; // интервал для таймера

    gameList.timer.innerHTML = 60; // количество секунд на партию

    const WAIT_TIME_MS = 1000; // значение для интервала = 1секунда

    // получаем результат по добавлению через форму отправки
    gameRules.form.addEventListener('submit', (e) => {
      e.preventDefault();
      inputValue = parseInt(gameRules.input.value); // исходя из значения в форме для заполнения получаем результат в переменную
      gameRules.container.remove(); // удаляем стартовую страницу
      createGameWithRules(); // вызываем функцию с готовым результатом
      document.body.append(gameList.list); // отображаем площадку с готовым результатом
      document.body.append(gameList.timer); // отображаем таймер
    });

    // исходя из значения в инпуте определенным количество элементов и задаем каждому элементу свое значение
    function createGameWithRules() {
      // формируем массив чисел
      for (let i = 1; i < (Math.pow(inputValue, 2) / 2) + 1; i++) {
        elementsValues.push(i, i);
      };

      // перемешиваем значения в массиве в хаотичном порядке
      for (let i = elementsValues.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [elementsValues[i], elementsValues[j]] = [elementsValues[j], elementsValues[i]];
      }

      // заполняем площадку элементами со значениям
      for (let i = 0; i < elementsValues.length; i++) {
        let gameElement = createGameElement(elementsValues[i]); // каждому элементу придаем значение из массива

        // исходя из значения в input создаем сетку с определенным количеством элементов
        if (inputValue === 2) {
          gameElement.item.classList.add('item-2x');
        } else if (inputValue === 4) {
          gameElement.item.classList.add('item-4x');
        } else if (inputValue === 6) {
          gameElement.item.classList.add('item-6x');
        } else if (inputValue === 8) {
          gameElement.item.classList.add('item-8x');
        } else if (inputValue === 10) {
          gameElement.item.classList.add('item-10x');
        };

        // отправляем готовый элемент на игровую площадку
        gameList.list.append(gameElement.item);
      };

      // получаем поведение по клику на элементы
      getClickEvent(gameList);

      // в случае, если есть неоткрытые элементы, и количество игровых секунд закончилось, тогда Game Over
      if (gameList.list.querySelectorAll('.question').length > 0) {
        getPageEndGame('Game Over');
      };
    };

    // описываем поведение по клику на элементы
    function getClickEvent(gameList) {
      const valueOpen = []; // массив для заполнения и дальнейшего сравнения значений в последних открытых элементах

      // вызываем делегирование событий по клику
      gameList.list.addEventListener('click', (e) => {
        e.preventDefault();

        // если клик не по элементу li, то пропустить
        if (!e.target.closest('li')) return;

        // значение div в li всплывает к ближайшему предку
        const number = e.target.closest('li').querySelector('div');

        // если элемент по которому совершен клик не содержит класса open-bg, тогда он закрытый и далее применяем меры для открытия
        if (!e.target.classList.contains('open-bg')) {
          // открываем элемент
          e.target.closest('li').classList.add('open-bg');
          e.target.classList.remove('question');
          number.classList.remove('disabled');

          // записываем значение в массив
          valueOpen.push(number);
        };

        // когда в массиве 3 элемента, производим сравнение открытых первых двух и применяем меры
        if (valueOpen.length === 3) {
          // если значение первого элемента не равно значению второго элемента
          if (valueOpen[0].innerText !== valueOpen[1].innerText) {
            // закрываем первый элемент
            valueOpen[0].parentElement.classList.remove('open-bg');
            valueOpen[0].parentElement.classList.add('question');
            valueOpen[0].classList.add('disabled');
            // закрываем второй элемент
            valueOpen[1].parentElement.classList.remove('open-bg');
            valueOpen[1].parentElement.classList.add('question');
            valueOpen[1].classList.add('disabled');
            // очищаем эти значения из массива
            valueOpen.splice(0, 2);
          } else {
            // если они равны, то классы не меняем, но 1 и 2 элемент удаляем, а третье значение становится первым
            valueOpen.splice(0, 2);
          };
        };

        // когда открыты все элементы
        if (gameList.list.querySelectorAll('.question').length === 0) {
          // устанавливаем значение в таймер знаменующее его остановку
          gameList.timer.innerHTML = 'ОП!';
          // Победа - Конец игры
          getPageEndGame('Победа!')
        };
      });
    };

    // получаем конечный результ. поражение или победа
    function getPageEndGame(titleText) {
      // таймер
      let counter = () => {
        // каждую секунду значение 60 уменьшается на 1
        if (gameList.timer.innerHTML > 0) {
          gameList.timer.innerHTML--
        } else if (gameList.timer.innerHTML === '0' || gameList.timer.innerHTML === 'ОП!') { // если значение 0 или 'ОП'
          clearInterval(interval); // секундомер останавливается
          // удаляем все элементы игры
          gameList.list.remove();
          gameList.timer.remove();
          gameTitle.title.remove();

          // создаем конечный результат
          const gameOver = document.createElement('h1');
          const gameAgainButton = document.createElement('button')
          gameOver.classList.add('text', 'title', 'game-over')
          gameAgainButton.classList.add('button');
          gameOver.innerText = titleText; // если 0, то Game Over, если ОП! тогда победа

          gameAgainButton.innerHTML = 'Сыграть еще';

          // отправляем его в разметку
          document.body.append(gameOver);
          document.body.append(gameAgainButton)

          // событие по клику "сыграть еще"
          gameAgainButton.addEventListener('click', (e) => {
            e.preventDefault();
            // удаляем из разметки элементы конечного результата игры
            gameOver.remove();
            gameAgainButton.remove();
            // вызываем игру с самого начала
            getGame();
          });
        };
      };

      clearInterval(interval); // таймер стоит
      interval = setInterval(counter, WAIT_TIME_MS); // вызываем таймер
    };

    document.body.append(gameTitle.title);
    document.body.append(gameRules.container);
  };

  document.addEventListener('DOMContentLoaded', () => {
    getGame()
  })
})();



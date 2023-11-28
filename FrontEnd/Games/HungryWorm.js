// HungryWorm.js
document.addEventListener('DOMContentLoaded', () => {
  const snakeElement = document.getElementById('snake');
  const foodElement = document.getElementById('food');

  let snake = [{ x: 100, y: 100 }];
  let direction = 'right';
  let food = getRandomPosition();

  function getRandomPosition() {
    const x = Math.floor(Math.random() * 15) * 20;
    const y = Math.floor(Math.random() * 15) * 20;
    return { x, y };
  }

  function updateGame() {
    moveSnake();
    checkCollision();
    checkFood();
    render();
  }

  function moveSnake() {
    const head = { ...snake[0] };

    switch (direction) {
      case 'up':
        head.y -= 20;
        break;
      case 'down':
        head.y += 20;
        break;
      case 'left':
        head.x -= 20;
        break;
      case 'right':
        head.x += 20;
        break;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      food = getRandomPosition();
    } else {
      snake.pop();
    }
  }

  function checkCollision() {
    const head = snake[0];

    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= 300 ||
      head.y >= 300 ||
      checkSelfCollision()
    ) {
      alert('Game Over!');
      snake = [{ x: 100, y: 100 }];
      direction = 'right';
      food = getRandomPosition();
    }
  }

  function checkSelfCollision() {
    const head = snake[0];
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
  }

  function checkFood() {
    const head = snake[0];

    if (head.x === food.x && head.y === food.y) {
      food = getRandomPosition();
      // Add a new segment to the snake's tail
      snake.push({});
    }
  }

  function render() {
    snakeElement.innerHTML = ''; // Clear the previous content

    snake.forEach((segment, index) => {
      const segmentElement = document.createElement('div');
      segmentElement.className = 'snake-segment';
      segmentElement.style.left = `${segment.x}px`;
      segmentElement.style.top = `${segment.y}px`;

      if (index === 0) {
        // Head of the snake
        segmentElement.classList.add('snake-head');
      }

      snakeElement.appendChild(segmentElement);
    });

    foodElement.style.left = `${food.x}px`;
    foodElement.style.top = `${food.y}px`;
  }

  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
    }
  });

  setInterval(updateGame, 150); // Adjust the interval time for desired speed
});

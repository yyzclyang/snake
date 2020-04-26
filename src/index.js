class Snake {
  constructor({ row, column }) {
    this.row = row;
    this.column = column;
    this.mountNode = document.getElementById("snake");
    this.init();
  }

  /**
   * 挂载节点
   */
  mountNode;
  /**
   * 地图行数
   */
  row;
  /**
   * 地图列数
   */
  column;
  /**
   * 宝石坐标
   */
  gemPosition = [6, 8];
  /**
   * 贪吃蛇数据
   */
  snakeData = [];
  /**
   * 贪吃蛇的方向
   */
  direction;
  /**
   * 游戏状态
   */
  status = "pause";
  /**
   * 自动前进的定时器
   */
  moveSetTimeout;

  /**
   * 初始化
   */
  init() {
    this.snakeData = [
      [6, 7],
      [6, 6]
    ];
    this.direction = "right";
    this.status = "play";
    this.renderMap();
    this.generateGem();
    this.renderSnake();
    this.bindKeyboardClick();
  }
  /**
   * 开始
   */
  play() {
    this.moveSetTimeout = setTimeout(() => {
      this.move();
      this.play();
    }, 500);
  }
  /**
   * 暂停
   */
  pause() {}
  /**
   * 移动
   */
  move() {
    const snakeHead = this.snakeData[0];
    const snakeNewHead = ((direction) => {
      switch (direction) {
        case "top": {
          return [(snakeHead[0] - 1 + this.row) % this.row, snakeHead[1]];
        }
        case "down": {
          return [(snakeHead[0] + 1 + this.row) % this.row, snakeHead[1]];
        }
        case "left": {
          return [snakeHead[0], (snakeHead[1] - 1 + this.column) % this.column];
        }
        case "right": {
          return [snakeHead[0], (snakeHead[1] + 1 + this.column) % this.column];
        }
      }
    })(this.direction);
    this.snakeData.unshift(snakeNewHead);
    document
      .querySelector(`.row-${snakeNewHead[0]} > .column-${snakeNewHead[1]}`)
      .classList.add("map-snake");

    if (
      snakeNewHead[0] === this.gemPosition[0] &&
      snakeNewHead[1] === this.gemPosition[1]
    ) {
      const [gemRow, gemColumn] = this.gemPosition;
      document
        .querySelector(`.row-${gemRow} > .column-${gemColumn}`)
        .classList.remove("map-gem");
      this.generateGem();
    } else {
      const snakeEnd = this.snakeData.pop();
      document
        .querySelector(`.row-${snakeEnd[0]} > .column-${snakeEnd[1]}`)
        .classList.remove("map-snake");
    }
  }
  bindKeyboardClick() {
    document.addEventListener("keyup", (e) => {
      switch (e.keyCode) {
        // 空格
        case 32: {
          if (this.status === "play") {
            clearTimeout(this.moveSetTimeout);
            this.status = "pause";
          } else {
            this.play();
            this.status = "play";
          }
          break;
        }
        // 左箭头
        case 37: {
          if (this.direction === "right") {
            break;
          }
          clearTimeout(this.moveSetTimeout);
          this.direction = "left";
          this.move();
          this.play();
          break;
        }
        // 向上箭头
        case 38: {
          if (this.direction === "down") {
            break;
          }
          clearTimeout(this.moveSetTimeout);
          this.direction = "top";
          this.move();
          this.play();
          break;
        }
        // 右箭头
        case 39: {
          if (this.direction === "left") {
            break;
          }
          clearTimeout(this.moveSetTimeout);
          this.direction = "right";
          this.move();
          this.play();
          break;
        }
        // 向下箭头
        case 40: {
          if (this.direction === "top") {
            break;
          }
          clearTimeout(this.moveSetTimeout);
          this.direction = "down";
          this.move();
          this.play();
          break;
        }
        default: {
        }
      }
    });
  }
  /**
   * 改变方向
   * @param {新方向} direction
   */
  changeDirection(direction) {
    this.direction = direction;
  }
  /**
   * 生成宝石
   */
  generateGem() {
    const canGenerateGemPosition = [];
    const mapSnakePosition = [];
    for (let r = 0; r < this.row; r++) {
      mapSnakePosition[r] = [];
    }
    this.snakeData.forEach(([row, column]) => {
      mapSnakePosition[row][column] = true;
    });
    for (let r = 0; r < this.row; r++) {
      for (let c = 0; c < this.column; c++) {
        if (!mapSnakePosition[r][c]) {
          canGenerateGemPosition.push([r, c]);
        }
      }
    }
    this.gemPosition =
      canGenerateGemPosition[
        Math.ceil(Math.random() * canGenerateGemPosition.length)
      ];
    const [row, column] = this.gemPosition;
    document
      .querySelector(`.row-${row} > .column-${column}`)
      .classList.add("map-gem");
  }
  /**
   * 渲染地图
   */
  renderMap() {
    const mapFragment = document.createDocumentFragment();
    for (let r = 0; r < this.row; r++) {
      const mapRow = document.createElement("div");
      mapRow.classList.add("map-row");
      mapRow.classList.add(`row-${r}`);
      for (let c = 0; c < this.column; c++) {
        const mapSquare = document.createElement("div");
        mapSquare.classList.add("map-square");
        mapSquare.classList.add(`column-${c}`);
        mapRow.appendChild(mapSquare);
      }
      mapFragment.appendChild(mapRow);
    }
    this.mountNode.appendChild(mapFragment);
  }
  /**
   * 渲染 snake
   * @param {贪吃蛇数据} snakeData
   */
  renderSnake() {
    this.snakeData.forEach(([row, column]) => {
      const snakeBody = document.querySelector(
        `.row-${row} > .column-${column}`
      );
      snakeBody.classList.add("map-snake");
    });
  }
}

const snake = new Snake({ row: 10, column: 20 });

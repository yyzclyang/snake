class Snake {
  constructor({ row, column, initSnake }) {
    this.row = row;
    this.column = column;
    this.snakeData = initSnake;
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
    this.direction = "right";
    this.status = "pause";
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
      this.move() && this.play();
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
    const snakeHeadPosition = this.snakeData[0];
    const snakeNewHeadPosition = ((direction) => {
      switch (direction) {
        case "top": {
          return [
            (snakeHeadPosition[0] - 1 + this.row) % this.row,
            snakeHeadPosition[1]
          ];
        }
        case "down": {
          return [
            (snakeHeadPosition[0] + 1 + this.row) % this.row,
            snakeHeadPosition[1]
          ];
        }
        case "left": {
          return [
            snakeHeadPosition[0],
            (snakeHeadPosition[1] - 1 + this.column) % this.column
          ];
        }
        case "right": {
          return [
            snakeHeadPosition[0],
            (snakeHeadPosition[1] + 1 + this.column) % this.column
          ];
        }
      }
    })(this.direction);
    this.snakeData.unshift(snakeNewHeadPosition);

    // 前方有宝石，尾巴不缩减
    if (
      snakeNewHeadPosition[0] === this.gemPosition[0] &&
      snakeNewHeadPosition[1] === this.gemPosition[1]
    ) {
      const [gemRow, gemColumn] = this.gemPosition;
      document
        .querySelector(`.row-${gemRow} > .column-${gemColumn}`)
        .classList.remove("map-gem");
      this.generateGem();
    } else {
      // 前方无宝石，尾巴缩减一格
      const snakeEndPosition = this.snakeData.pop();
      document
        .querySelector(
          `.row-${snakeEndPosition[0]} > .column-${snakeEndPosition[1]}`
        )
        .classList.remove("map-snake");
    }
    // 旧蛇头变蛇身，蛇头前进
    const snakeOldHead = document.querySelector(
      `.row-${snakeHeadPosition[0]} > .column-${snakeHeadPosition[1]}`
    );
    snakeOldHead.classList.remove("map-snake-head");
    snakeOldHead.classList.add("map-snake");
    document
      .querySelector(
        `.row-${snakeNewHeadPosition[0]} > .column-${snakeNewHeadPosition[1]}`
      )
      .classList.add("map-snake-head");

    // 检查蛇头的位置是否合法
    if (!this.checkSnakeHeadIsValidate()) {
      clearTimeout(this.moveSetTimeout);
      this.status = "end";
      return false;
    }
    return true;
  }
  bindKeyboardClick() {
    document.addEventListener("keyup", (e) => {
      if (this.status === "end") {
        return;
      }
      if (this.status === "pause") {
        this.play();
        this.status = "play";
      }
      switch (e.keyCode) {
        // 空格
        case 32: {
          if (this.status === "play") {
            clearTimeout(this.moveSetTimeout);
            this.status = "pause";
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
          this.move() && this.play();
          break;
        }
        // 向上箭头
        case 38: {
          if (this.direction === "down") {
            break;
          }
          clearTimeout(this.moveSetTimeout);
          this.direction = "top";
          this.move() && this.play();
          break;
        }
        // 右箭头
        case 39: {
          if (this.direction === "left") {
            break;
          }
          clearTimeout(this.moveSetTimeout);
          this.direction = "right";
          this.move() && this.play();
          break;
        }
        // 向下箭头
        case 40: {
          if (this.direction === "top") {
            break;
          }
          clearTimeout(this.moveSetTimeout);
          this.direction = "down";
          this.move() && this.play();
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
   * 检查蛇头的位置是否合法
   */
  checkSnakeHeadIsValidate() {
    const [headRow, headColumn] = this.snakeData[0];
    // 如果蛇头的位置数据有两个，说明蛇头与别的地方重合了，发生了碰撞
    return (
      this.snakeData.filter(([row, column]) => {
        return row === headRow && column === headColumn;
      }).length < 2
    );
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
    this.snakeData.forEach(([row, column], index) => {
      const snakeBody = document.querySelector(
        `.row-${row} > .column-${column}`
      );
      snakeBody.classList.add(index === 0 ? "map-snake-head" : "map-snake");
    });
  }
}

const snake = new Snake({
  row: 10,
  column: 10,
  initSnake: [
    [6, 7],
    [6, 6]
  ]
});

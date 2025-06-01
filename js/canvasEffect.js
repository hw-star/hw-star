(function () {
  let canvas, ctx, LineArr = [], intervalId = null;
  let isRunning = false;
  const mouse = { x: 0, y: 0 };

  function Line() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = 2.5;
    this.color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
      Math.random() * 255
    )},${Math.floor(Math.random() * 255)})`;
    this.dx = Math.random() * 3 - 1.5;
    this.dy = Math.random() * 3 - 1.5;
    LineArr.push(this);
    this.index = LineArr.length - 1;
  }

  Line.prototype.update = function () {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x < 0.5 || this.x > canvas.width - this.r) this.dx = -this.dx;
    if (this.y < 0.5 || this.y > canvas.height - this.r) this.dy = -this.dy;
  };

  Line.prototype.render = function () {
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    for (let i = this.index; i < LineArr.length; i++) {
      if (
        Math.abs(LineArr[i].x - this.x) < 80 &&
        Math.abs(LineArr[i].y - this.y) < 80
      ) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.globalAlpha =
          12 /
          Math.sqrt(
            Math.pow(LineArr[i].x - this.x, 2) +
              Math.pow(LineArr[i].y - this.y, 2)
          );
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(LineArr[i].x, LineArr[i].y);
        ctx.stroke();
      }
    }

    if (mouse.x > 2 && mouse.y > 2) {
      for (let i = this.index; i < LineArr.length; i++) {
        if (
          Math.abs(mouse.x - this.x) < 90 &&
          Math.abs(mouse.y - this.y) < 90
        ) {
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.globalAlpha =
            42 /
            Math.sqrt(
              Math.pow(LineArr[i].x - this.x, 2) +
                Math.pow(LineArr[i].y - this.y, 2)
            );
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  };

  function startCanvasLine() {
    if (isRunning) return;
    isRunning = true;
    canvas = document.getElementById("line");
    ctx = canvas.getContext("2d");
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    LineArr = [];
    for (let i = 0; i < 128; i++) new Line();

    intervalId = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < LineArr.length; i++) {
        LineArr[i].update();
        LineArr[i].render();
      }
    }, 20);

    window.onmousemove = function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.onmouseout = function () {
      mouse.x = 0;
      mouse.y = 0;
    };
  }

  function stopCanvasLine() {
    isRunning = false;
    clearInterval(intervalId);
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    LineArr = [];
  }

  window.CanvasEffect = {
    start: startCanvasLine,
    stop: stopCanvasLine,
    isRunning: () => isRunning,
  };
})();

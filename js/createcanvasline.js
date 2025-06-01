// function createcanvasline() {
//   let canvas = document.getElementById("line");
//       canvas.width = document.documentElement.clientWidth;
//       canvas.height = document.documentElement.clientHeight;
//       let ctx = canvas.getContext("2d");
//       let LineArr = [];
//       var mouse = {
//         x: 0,
//         y: 0,
//       };
//       window.onmousemove = function (i) {
//         i = i || window.event;
//         mouse.x = i.clientX;
//         mouse.y = i.clientY;
//       };
//       //鼠标移出窗口后，消除鼠标
//       window.onmouseout = function () {
//         mouse.x = 0;
//         mouse.y = 0;
//       };
//       function Line() {
//         // 随机位置
//         this.x = parseInt(Math.random() * canvas.width) - 1;
//         this.y = parseInt(Math.random() * canvas.height) - 1;
//         this.r = 2.5;
//         this.color =
//           "rgb(" +
//           parseInt(Math.random() * 255) +
//           "," +
//           parseInt(Math.random() * 255) +
//           "," +
//           parseInt(Math.random() * 255) +
//           ")";
//         // this.color = `rgb(${60 + Math.random()*30}, ${150 + Math.random()*80}, ${180 + Math.random()*60})`; // 柔和蓝绿
//         // this.color = "#222222";
//         // x上前进距离
//         this.dx = parseInt(Math.random() * 3) - 1.5;
//         // y上前进距离
//         this.dy = parseInt(Math.random() * 3) - 1.5;
//         LineArr.push(this);
//         this.index = LineArr.length - 1;
//       }
//       Line.prototype.update = function () {
//         this.x += this.dx;
//         this.y += this.dy;
//         if (this.x < 0.5 || this.x > canvas.width - this.r) {
//           this.dx = -this.dx;
//         }
//         if (this.y < 0.5 || this.y > canvas.height - this.r) {
//           this.dy = -this.dy;
//         }
//       };
//       Line.prototype.render = function () {
//         ctx.beginPath();
//         ctx.globalAlpha = 1; //透明度
//         ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
//         ctx.fillStyle = this.color;
//         ctx.fill();

//         //画线
//         for (let i = this.index; i < LineArr.length; i++) {
//           if (
//             Math.abs(LineArr[i].x - this.x) < 80 &&
//             Math.abs(LineArr[i].y - this.y) < 80
//           ) {
//             ctx.strokeStyle = this.color; //"rgb(192,192,192)";
//             ctx.lineWidth = 2;
//             ctx.beginPath();
//             ctx.globalAlpha =
//               12 /
//               Math.sqrt(
//                 Math.pow(LineArr[i].x - this.x, 2) +
//                   Math.pow(LineArr[i].y - this.y, 2)
//               );
//             ctx.moveTo(this.x, this.y);
//             ctx.lineTo(LineArr[i].x, LineArr[i].y);
//             ctx.closePath();
//             ctx.stroke();
//           }
//         }
//         if (mouse.x > 2 && mouse.y > 2) {
//           for (let i = this.index; i < LineArr.length; i++) {
//             if (
//               Math.abs(mouse.x - this.x) < 90 &&
//               Math.abs(mouse.y - this.y) < 90
//             ) {
//               ctx.strokeStyle = this.color; //"rgb(192,192,192)";
//               ctx.lineWidth = 2.5;
//               ctx.beginPath();
//               ctx.globalAlpha =
//                 42 /
//                 Math.sqrt(
//                   Math.pow(LineArr[i].x - this.x, 2) +
//                     Math.pow(LineArr[i].y - this.y, 2)
//                 );
//               ctx.moveTo(this.x, this.y);
//               ctx.lineTo(mouse.x, mouse.y);
//               ctx.closePath();
//               ctx.stroke();
//             }
//           }
//         }
//       };
//       for (let i = 0; i < 128; i++) {
//         new Line();
//       }
//       setInterval(() => {
//         //清除画布
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         for (let i = 0; i < LineArr.length; i++) {
//           LineArr[i].update();
//           LineArr[i].render();
//         }
//       }, 20);
// }

// createcanvasline();

(function () {
  const canvas = document.getElementById('line');
  const ctx = canvas.getContext('2d');
  let meteors = [];
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  function createMeteor() {
    const degToRad = Math.PI / 180;
    const centerAngle = 135 * degToRad; // 135°
    const range = 15 * degToRad;         // ±15°

    const angle = Math.random() * (range * 2) + (centerAngle - range);
    const speed = Math.random() * 1.5 + 0.7; // 0.7 ~ 2.2
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      length: Math.random() * 100 + 50,
      speedX: speed * Math.cos(angle),
      speedY: speed * Math.sin(angle),
      opacity: 1,
      size: Math.random() * 2 + 1,
    };
  }

  function drawMeteor(m) {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = m.size;
    ctx.lineCap = 'round';

    // 设置尾光
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'white';

    const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.speedX * 10, m.y - m.speedY * 10);
    grad.addColorStop(0, `rgba(255,255,255,${m.opacity})`);
    grad.addColorStop(1, `rgba(255,255,255,0)`);
    ctx.strokeStyle = grad;

    ctx.moveTo(m.x, m.y);
    ctx.lineTo(m.x - m.speedX * 10, m.y - m.speedY * 10);
    ctx.stroke();
    ctx.restore();
  }

  function updateMeteors() {
    // 用半透明黑色遮罩制造拖尾残影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    meteors.forEach((m, i) => {
      m.x += m.speedX;
      m.y += m.speedY;
      m.opacity -= 0.001;  // 透明度减少得更慢
      drawMeteor(m);
      // 放宽重置条件，延长流星生命周期
      if (m.y > canvas.height + 35 || m.x > canvas.width + 35 || m.opacity <= 0.1) {
        meteors[i] = createMeteor();
      }
    });
  }

  function animate() {
    updateMeteors();
    animationId = requestAnimationFrame(animate);
  }

  window.startMeteor = function () {
    if (animationId) cancelAnimationFrame(animationId);
    meteors = new Array(50).fill().map(createMeteor);
    animate();
  };

  window.stopMeteor = function () {
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
})();

startMeteor();

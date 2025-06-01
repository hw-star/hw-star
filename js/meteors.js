(function () {
  const canvas = document.getElementById('meteor-canvas');
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

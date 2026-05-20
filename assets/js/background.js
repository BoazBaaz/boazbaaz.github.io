(function() {
  var canvas, ctx, w, h, particles = [], mouse = { x: -9999, y: -9999 };

  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

  var particleColor = [25, 45, 110];

  var config = {
    count: isMobile ? 32 : 64,
    lineDistance: isMobile ? 128 : 256,
    lineOpacity: 0.35,
    lineColor: particleColor,
    shapeStroke: 'rgba(' + particleColor.join(',') + ', 0.5)',
    minSize: isMobile ? 6 : 8,
    maxSize: isMobile ? 8 : 16,
    speed: 0.35,
    rotSpeed: 0.3,
    repulseDistance: isMobile ? 32 : 64,
    repulseStrength: 0.5,
    thickness: 1.8
  };

  function Particle() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * config.speed;
    this.vy = (Math.random() - 0.5) * config.speed;
    this.size = config.minSize + Math.random() * (config.maxSize - config.minSize);
    this.sides = Math.floor(Math.random() * 5);
    this.angle = Math.random() * 360;
    this.rotDir = Math.random() < 0.5 ? 1 : -1;
  }

  Particle.prototype.update = function() {
    var dx = this.x - mouse.x;
    var dy = this.y - mouse.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < config.repulseDistance && dist > 0) {
      var force = (config.repulseDistance - dist) / config.repulseDistance * config.repulseStrength;
      this.vx += (dx / dist) * force;
      this.vy += (dy / dist) * force;
    }

    this.vx *= 0.99;
    this.vy *= 0.99;

    var speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed < config.speed * 0.3) {
      this.vx += (Math.random() - 0.5) * 0.1;
      this.vy += (Math.random() - 0.5) * 0.1;
    }

    this.x += this.vx;
    this.y += this.vy;
    this.angle += config.rotSpeed * this.rotDir;

    if (this.x < -this.size) this.x = w + this.size;
    if (this.x > w + this.size) this.x = -this.size;
    if (this.y < -this.size) this.y = h + this.size;
    if (this.y > h + this.size) this.y = -this.size;
  };

  Particle.prototype.draw = function() {
    var rad = this.angle * Math.PI / 180;
    ctx.beginPath();
    if (this.sides < 1) {
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    } else {
      var sides = this.sides + 2;
      for (var i = 0; i < sides; i++) {
        var a = (Math.PI * 2 / sides) * i + rad;
        var px = Math.cos(a) * this.size + this.x;
        var py = Math.sin(a) * this.size + this.y;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }
    ctx.lineWidth = config.thickness;
    ctx.strokeStyle = config.shapeStroke;
    ctx.stroke();
  };

  function drawLines() {
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.lineDistance) {
          var opacity = (1 - dist / config.lineDistance) * config.lineOpacity;
          var c = config.lineColor;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + opacity + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function populate() {
    particles = [];
    for (var i = 0; i < config.count; i++) {
      particles.push(new Particle());
    }
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);
    drawLines();
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(loop);
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function init() {
    canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // Hide canvas if page has a custom background
    if (document.body.classList.contains('has-page-bg')) {
      canvas.style.display = 'none';
      return;
    }

    ctx = canvas.getContext('2d');
    resize();
    populate();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', function(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', function() {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

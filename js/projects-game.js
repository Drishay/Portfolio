/* =========================================================
   Projects Hero Mini-Game
   Retro Crossy Road / Frogger-inspired portfolio game.
   No external dependencies.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".projects-game-hero");
  const canvas = document.querySelector("#projectsGameCanvas");

  if (!hero || !canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const startButton = document.querySelector("#projectsGameStart");
  const pauseOverlay = document.querySelector("#projectsGamePause");
  const restartButton = document.querySelector("#projectsGameRestart");
  const pauseTitle = document.querySelector("#projectsGamePauseTitle");
  const pauseText = document.querySelector("#projectsGamePauseText");
  const scoreEl = document.querySelector("#projectsGameScore");
  const levelEl = document.querySelector("#projectsGameLevel");
  const stateEl = document.querySelector("#projectsGameState");
  const controls = document.querySelector("#projectsGameControls");

  const state = {
    mode: "idle",
    score: 0,
    level: 1,
    lastTime: 0,
    animationId: 0,
    width: 900,
    height: 500,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    laneHeight: 46,
    roadStart: 90,
    player: { x: 0, y: 0, size: 22 },
    lanes: [],
    particles: [],
  };

  const keys = new Set();

  function isNight() {
    return document.documentElement.dataset.theme === "night";
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    state.width = Math.max(320, rect.width);
    state.height = Math.max(300, rect.height);
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);

    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    state.laneHeight = Math.max(36, Math.min(52, state.height * 0.095));
    state.roadStart = state.height * 0.19;

    resetPlayer();
    buildLanes();
    draw();
  }

  function resetPlayer() {
    const laneCount = 7;
    const bottom = state.height - state.laneHeight * 0.7;
    state.player.size = Math.max(17, Math.min(25, state.width * 0.024));
    state.player.x = state.width / 2;
    state.player.y = bottom - state.player.size;
    state.player.startY = state.player.y;
    state.player.progress = 0;
  }

  function buildLanes() {
    const laneCount = 7;
    state.lanes = [];

    for (let i = 0; i < laneCount; i += 1) {
      const y = state.roadStart + i * state.laneHeight;
      const direction = i % 2 === 0 ? 1 : -1;
      const speed = (42 + i * 7) * (1 + (state.level - 1) * 0.14);
      const cars = [];

      for (let j = 0; j < 2; j += 1) {
        cars.push({
          x: (j * state.width * 0.55 + i * 31) % state.width,
          y: y + state.laneHeight * 0.19,
          width: 44 + (i % 3) * 8,
          height: state.laneHeight * 0.58,
          speed: speed * direction,
        });
      }

      state.lanes.push({ y, direction, cars });
    }
  }

  function resetGame() {
    state.score = 0;
    state.level = 1;
    state.particles = [];
    resetPlayer();
    buildLanes();
    updateHud();
  }

  function updateHud() {
    scoreEl.textContent = String(state.score).padStart(2, "0");
    levelEl.textContent = String(state.level);
    stateEl.textContent =
      state.mode === "playing" ? "Playing" :
      state.mode === "paused" ? "Paused" :
      state.mode === "won" ? "Complete" :
      state.mode === "gameover" ? "Game Over" : "Ready";
  }

  function setMode(mode) {
    state.mode = mode;
    hero.classList.toggle("is-playing", mode === "playing");
    hero.classList.toggle("is-paused", mode === "paused");

    if (pauseOverlay) {
      const shouldShow = mode === "paused" || mode === "won" || mode === "gameover";
      pauseOverlay.hidden = !shouldShow;
    }

    if (pauseTitle && pauseText && restartButton) {
      if (mode === "paused") {
        pauseTitle.textContent = "Game Paused";
        pauseText.textContent = "Click the game area to continue.";
        restartButton.hidden = true;
      } else if (mode === "won") {
        pauseTitle.textContent = "You made it!";
        pauseText.textContent = "Nice run. Start another round whenever you want.";
        restartButton.hidden = false;
      } else if (mode === "gameover") {
        pauseTitle.textContent = "Run ended";
        pauseText.textContent = "You hit an obstacle. Try again.";
        restartButton.hidden = false;
      }
    }

    updateHud();
  }

  function startGame() {
    resetGame();
    setMode("playing");
    state.lastTime = performance.now();
    cancelAnimationFrame(state.animationId);
    state.animationId = requestAnimationFrame(loop);
  }

  function pauseGame() {
    if (state.mode !== "playing") return;
    setMode("paused");
  }

  function resumeGame() {
    if (state.mode !== "paused") return;
    setMode("playing");
    state.lastTime = performance.now();
    state.animationId = requestAnimationFrame(loop);
  }

  function finishGame(mode) {
    setMode(mode);
    cancelAnimationFrame(state.animationId);
  }

  function movePlayer(dx, dy) {
    if (state.mode !== "playing") return;

    const stepX = Math.max(28, state.width * 0.055);
    const stepY = state.laneHeight * 0.88;

    state.player.x += dx * stepX;
    state.player.y -= dy * stepY;

    state.player.x = Math.max(state.player.size, Math.min(state.width - state.player.size, state.player.x));

    const topLimit = state.roadStart - state.laneHeight * 0.65;
    const bottomLimit = state.height - state.laneHeight * 0.35;

    state.player.y = Math.max(topLimit, Math.min(bottomLimit, state.player.y));

    if (dy > 0) {
      state.score += 1;
      if (state.score > 0 && state.score % 5 === 0) {
        state.level = Math.min(5, 1 + Math.floor(state.score / 5));
        buildLanes();
      }
    }

    if (state.player.y <= topLimit + 3) {
      spawnWinParticles();
      finishGame("won");
    }

    updateHud();
  }

  function checkCollision() {
    const p = {
      left: state.player.x - state.player.size * 0.42,
      right: state.player.x + state.player.size * 0.42,
      top: state.player.y - state.player.size * 0.42,
      bottom: state.player.y + state.player.size * 0.42,
    };

    for (const lane of state.lanes) {
      for (const car of lane.cars) {
        const c = {
          left: car.x - car.width / 2,
          right: car.x + car.width / 2,
          top: car.y,
          bottom: car.y + car.height,
        };

        if (p.left < c.right && p.right > c.left && p.top < c.bottom && p.bottom > c.top) {
          return true;
        }
      }
    }

    return false;
  }

  function update(dt) {
    for (const lane of state.lanes) {
      for (const car of lane.cars) {
        car.x += car.speed * dt;

        if (lane.direction > 0 && car.x - car.width > state.width) {
          car.x = -car.width;
        }

        if (lane.direction < 0 && car.x + car.width < 0) {
          car.x = state.width + car.width;
        }
      }
    }

    for (const particle of state.particles) {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.life -= dt;
    }

    state.particles = state.particles.filter((particle) => particle.life > 0);

    if (checkCollision()) {
      finishGame("gameover");
    }
  }

  function drawBackground() {
    const night = isNight();

    ctx.fillStyle = night ? "#071019" : "#d8e5d0";
    ctx.fillRect(0, 0, state.width, state.height);

    const horizon = state.roadStart;

    ctx.fillStyle = night ? "#102536" : "#b8d3ad";
    ctx.fillRect(0, 0, state.width, horizon);

    ctx.fillStyle = night ? "#0c1b29" : "#8da77f";
    ctx.fillRect(0, horizon, state.width, state.height - horizon);

    // distant pixel buildings / trees
    for (let x = 0; x < state.width; x += 58) {
      const h = 18 + ((x * 17) % 28);
      ctx.fillStyle = night ? "#17344a" : "#6f9270";
      ctx.fillRect(x, horizon - h, 30, h);
      ctx.fillStyle = night ? "#7da4c5" : "#e9c16f";
      ctx.fillRect(x + 7, horizon - h + 8, 4, 4);
      ctx.fillRect(x + 18, horizon - h + 17, 4, 4);
    }

    // goal
    ctx.fillStyle = night ? "#18394d" : "#d5dfbd";
    ctx.fillRect(0, state.roadStart - 2, state.width, state.laneHeight * 0.7);

    ctx.fillStyle = night ? "#4d78a3" : "#d9821b";
    ctx.fillRect(0, state.roadStart - 3, state.width, 3);

    // road
    for (let i = 0; i < state.lanes.length; i += 1) {
      const lane = state.lanes[i];
      ctx.fillStyle = night ? (i % 2 ? "#162a39" : "#142433") : (i % 2 ? "#69736f" : "#747d78");
      ctx.fillRect(0, lane.y, state.width, state.laneHeight);

      ctx.strokeStyle = night ? "rgba(171,205,226,.15)" : "rgba(255,255,255,.25)";
      ctx.setLineDash([12, 14]);
      ctx.beginPath();
      ctx.moveTo(0, lane.y + state.laneHeight - 4);
      ctx.lineTo(state.width, lane.y + state.laneHeight - 4);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  function drawCars() {
    const night = isNight();

    state.lanes.forEach((lane, laneIndex) => {
      lane.cars.forEach((car, carIndex) => {
        const body = (laneIndex + carIndex) % 2 === 0
          ? (night ? "#4d78a3" : "#d9821b")
          : (night ? "#6e8eaa" : "#c66f0a");

        ctx.fillStyle = body;
        ctx.fillRect(car.x - car.width / 2, car.y + 4, car.width, car.height - 7);

        ctx.fillStyle = night ? "#dbeaf4" : "#f4ead8";
        ctx.fillRect(car.x - car.width * 0.24, car.y + 8, car.width * 0.48, car.height * 0.3);

        ctx.fillStyle = "#18232b";
        ctx.fillRect(car.x - car.width * 0.34, car.y + car.height - 5, 8, 5);
        ctx.fillRect(car.x + car.width * 0.19, car.y + car.height - 5, 8, 5);
      });
    });
  }

  function drawPlayer() {
    const s = state.player.size;
    const x = state.player.x;
    const y = state.player.y;

    ctx.fillStyle = "rgba(0,0,0,.2)";
    ctx.fillRect(x - s * 0.55, y + s * 0.45, s * 1.1, 4);

    ctx.fillStyle = isNight() ? "#d8e8f3" : "#fff4d7";
    ctx.fillRect(x - s * 0.43, y - s * 0.43, s * 0.86, s * 0.86);

    ctx.fillStyle = isNight() ? "#4d78a3" : "#d9821b";
    ctx.fillRect(x - s * 0.25, y - s * 0.7, s * 0.5, s * 0.22);

    ctx.fillStyle = "#17232d";
    ctx.fillRect(x - s * 0.25, y - s * 0.12, 4, 4);
    ctx.fillRect(x + s * 0.08, y - s * 0.12, 4, 4);

    ctx.fillStyle = isNight() ? "#6e8eaa" : "#b96812";
    ctx.fillRect(x - s * 0.52, y + s * 0.24, s * 1.04, 5);
  }

  function drawParticles() {
    state.particles.forEach((particle) => {
      ctx.globalAlpha = Math.max(0, particle.life);
      ctx.fillStyle = isNight() ? "#7da4c5" : "#f0b24e";
      ctx.fillRect(particle.x, particle.y, 4, 4);
    });
    ctx.globalAlpha = 1;
  }

  function draw() {
    drawBackground();
    drawCars();
    drawPlayer();
    drawParticles();
  }

  function loop(time) {
    if (state.mode !== "playing") return;

    const dt = Math.min((time - state.lastTime) / 1000, 0.05);
    state.lastTime = time;

    update(dt);
    draw();

    if (state.mode === "playing") {
      state.animationId = requestAnimationFrame(loop);
    }
  }

  function spawnWinParticles() {
    for (let i = 0; i < 26; i += 1) {
      state.particles.push({
        x: state.player.x,
        y: state.player.y,
        vx: (Math.random() - 0.5) * 140,
        vy: (Math.random() - 0.5) * 140,
        life: 1,
      });
    }
    draw();
  }

  function handleDirection(direction) {
    if (direction === "up") movePlayer(0, 1);
    if (direction === "down") movePlayer(0, -1);
    if (direction === "left") movePlayer(-1, 0);
    if (direction === "right") movePlayer(1, 0);
  }

  function handleKeydown(event) {
    const key = event.key.toLowerCase();
    const directionMap = {
      arrowup: "up",
      w: "up",
      arrowdown: "down",
      s: "down",
      arrowleft: "left",
      a: "left",
      arrowright: "right",
      d: "right",
    };

    const direction = directionMap[key];
    if (!direction) return;

    event.preventDefault();
    if (keys.has(key)) return;
    keys.add(key);
    handleDirection(direction);
  }

  function handleKeyup(event) {
    keys.delete(event.key.toLowerCase());
  }

  startButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    startGame();
  });

  restartButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    startGame();
  });

  controls?.querySelectorAll("button").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      event.preventDefault();
      handleDirection(button.dataset.direction);
    });
  });

  hero.addEventListener("click", (event) => {
    if (state.mode === "paused" && !event.target.closest("button")) {
      resumeGame();
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (state.mode !== "playing") return;
    if (!hero.contains(event.target)) {
      pauseGame();
    }
  });

  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("keyup", handleKeyup);

  document.addEventListener("themechange", () => {
    draw();
  });

  window.addEventListener("resize", resizeCanvas);

  resetGame();
  resizeCanvas();
  setMode("idle");
});

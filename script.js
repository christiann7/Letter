(function () {
  // 1. Initialize Syntax Highlighting
  hljs.highlightAll();

  // 2. Confetti Engine (Optimized)
  var Confetti = function (options) {
    var t = this;
    t.o = options || {};
    t.doms = {};
    t.vars = {
      confettiFrequency: 3,
      confettiColors: ['#fce18a', '#ff726d', '#b48def', '#f4306d'],
      confettiSpeed: ['slow', 'medium', 'fast'],
      confetiCount: 0,
      confetiLimit: 100,
      confettiDestroyTime: 3000,
      confettiRenderTime: 60,
      confettiSizeRange: [3, 7]
    };
    t.classes = { 'confettiContainer': 'confetti-container' };
    t.callbacks = {};

    if (t.handleOptions()) { t.init(); }
  };

  Confetti.prototype.handleOptions = function () {
    var t = this;
    if (t.o.target) { t.doms.target = t.o.target; } 
    else { return false; }
    if (!!t.o.onstart) t.callbacks.onstart = t.o.onstart;
    if (!!t.o.ondone) t.callbacks.ondone = t.o.ondone;
    return true;
  };

  Confetti.prototype.setupElements = function () {
    var t = this, containerDOM = document.createElement('div');
    containerDOM.className = t.classes['confettiContainer'];
    t.doms.target.appendChild(containerDOM);
    t.doms.containerDOM = containerDOM;
  };

  Confetti.prototype.getContainerSize = function () {
    return Math.floor(Math.random() * this.vars.confettiSizeRange[0]) + this.vars.confettiSizeRange[1] + 'px';
  };

  Confetti.prototype.getConfettiColor = function () {
    return this.vars.confettiColors[Math.floor(Math.random() * this.vars.confettiColors.length)];
  };

  Confetti.prototype.getConfettiSpeed = function () {
    return this.vars.confettiSpeed[Math.floor(Math.random() * this.vars.confettiSpeed.length)];
  };

  Confetti.prototype.generateConfetti = function () {
    var t = this, confettiDOM = document.createElement('div');
    confettiDOM.classList.add('confetti');
    confettiDOM.classList.add('confetti-animation-' + t.getConfettiSpeed());
    confettiDOM.style.left = Math.floor(Math.random() * t.doms.target.offsetWidth) + 'px';
    confettiDOM.style.width = t.getContainerSize();
    confettiDOM.style.height = confettiDOM.style.width;
    confettiDOM.style.backgroundColor = t.getConfettiColor();

    setTimeout(function () {
      if (confettiDOM.parentNode) confettiDOM.parentNode.removeChild(confettiDOM);
    }, t.vars.confettiDestroyTime);

    t.doms.containerDOM.appendChild(confettiDOM);
  };

  Confetti.prototype.renderConfetti = function () {
    var t = this;
    t.confettiInterval = setInterval(function () {
      t.vars.confetiCount++;
      if (t.vars.confetiCount > t.vars.confetiLimit) {
        clearInterval(t.confettiInterval);
      } else {
        t.generateConfetti();
      }
    }, t.vars.confettiRenderTime);
  };

  Confetti.prototype.start = function () {
    this.vars.confetiCount = 0;
    this.renderConfetti();
  };

  Confetti.prototype.stop = function () {
    this.vars.confetiCount = this.vars.confetiLimit;
  };

  Confetti.prototype.init = function () { this.setupElements(); };

  // 3. UI Interactions
  const content = document.querySelector('.content');
  const gradient = document.querySelector('#background');
  const cardWrapper = document.querySelector('.card-wrapper');
  const audio = document.querySelector('audio');
  const confetti = new Confetti({ target: content });

  // Toggle Flip, Music, and Background
  cardWrapper.addEventListener('click', () => {
    cardWrapper.classList.toggle('active');
    const isActive = cardWrapper.classList.contains('active');

    if (isActive) {
      audio.play();
      confetti.start();
      if(gradient) gradient.style.opacity = 1;
    } else {
      audio.pause();
      confetti.stop();
      if(gradient) gradient.style.opacity = 0;
    }
  });

  // 4. 3D Tilt Effect (Only when NOT active/flipped)
  const THRESHOLD = 15;
  function handleHover(e) {
    if (cardWrapper.classList.contains('active')) return; // Disable tilt when card is open

    const { clientX, clientY, currentTarget } = e;
    const { clientWidth, clientHeight, offsetLeft, offsetTop } = currentTarget;

    const horizontal = (clientX - offsetLeft) / clientWidth;
    const vertical = (clientY - offsetTop) / clientHeight;
    const rotateX = (THRESHOLD / 2 - horizontal * THRESHOLD).toFixed(2);
    const rotateY = (vertical * THRESHOLD - THRESHOLD / 2).toFixed(2);

    cardWrapper.style.transform = `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1.05, 1.05, 1.05)`;
  }

  function resetStyles() {
    if (cardWrapper.classList.contains('active')) return;
    cardWrapper.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  }

  cardWrapper.addEventListener("mousemove", handleHover);
  cardWrapper.addEventListener("mouseleave", resetStyles);

  // 5. Background Gradient state
  if (document.querySelector('#background')) {
      new Granim({
        element: '#background',
        direction: 'radial',
        isPausedWhenNotInView: true,
        states: {
          "default-state": {
            gradients: [
              ['#ff8faf', '#ffe5ed'],
              ['#f38fff', '#ffe5ed'],
              ['#ff8f8f', '#ffe5ed']
            ]
          }
        }
      });
  }
})();
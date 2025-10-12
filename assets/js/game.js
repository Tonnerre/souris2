// Jeu de la souris - version décor urbain, arrivée irrégulière des chats, avions/nuages dans le ciel
// Aucune logique de score/fin de partie pour l'instant (focus décor et rythmes)

(function () {
  const game = document.getElementById('game');
  const souris = document.getElementById('souris');

  // Assure une valeur initiale utile
  if (!souris.style.bottom) souris.style.bottom = '0px';

  // ----- Paramètres généraux -----
  const WIDTH = 600; // doit correspondre au CSS
  const FRAME_MS = 20;

  // ----- Apparition irrégulière des chats (distribution exponentielle) -----
  // Intervalles ~exponentiels pour des arrivées irrégulières, moyenne ~4.5s
  function nextCatDelayMs() {
    const mean = 4500; // moyenne en ms
    const u = Math.random();
    return Math.max(1200, Math.floor(-Math.log(1 - u) * mean));
  }

  function createCat() {
    const chat = document.createElement('div');
    chat.className = 'chat';

    // Position de départ à droite, légèrement hors écran
    chat.style.left = WIDTH + 'px';

    // Vitesse horizontale aléatoire (px par tick de FRAME_MS)
    const speed = 2 + Math.random() * 2.5; // ~2.0 à 4.5 px/tick

    game.appendChild(chat);

    const move = setInterval(() => {
      const chatLeft = parseFloat(chat.style.left || '0');
      const newLeft = chatLeft - speed;
      chat.style.left = newLeft + 'px';

      // Sortie de l'écran à gauche
      if (newLeft < -60) {
        clearInterval(move);
        chat.remove();
      }
    }, FRAME_MS);
  }

  function scheduleNextCat() {
    setTimeout(() => {
      createCat();
      scheduleNextCat();
    }, nextCatDelayMs());
  }

  // ----- Saut de la souris (optionnel, pour l'animation) -----
  let jumping = false;
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !jumping) jump();
  });

  function jump() {
    jumping = true;
    let position = parseFloat(souris.style.bottom || '0');

    const up = setInterval(() => {
      if (position >= 100) {
        clearInterval(up);
        const down = setInterval(() => {
          if (position <= 0) {
            clearInterval(down);
            jumping = false;
            position = 0;
          }
          position -= 5;
          souris.style.bottom = position + 'px';
        }, FRAME_MS);
      }
      position += 5;
      souris.style.bottom = position + 'px';
    }, FRAME_MS);
  }

  // ----- Objets du ciel (avion / nuage) -----
  function createSkyObject() {
    const el = document.createElement('div');
    el.className = 'sky-object';

    const isPlane = Math.random() < 0.35; // ~35% avions, sinon nuages
    const directionRight = Math.random() < 0.5; // true: gauche->droite, false: droite->gauche

    const top = 6 + Math.random() * 45; // position verticale aléatoire dans le ciel

    el.style.top = top + 'px';
    el.style.backgroundImage = isPlane
      ? 'url(assets/img/plane.svg)'
      : 'url(assets/img/cloud.svg)';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.backgroundSize = 'contain';

    // dimension visuelle (un peu plus large pour les nuages)
    el.style.width = isPlane ? '64px' : '72px';
    el.style.height = isPlane ? '24px' : '32px';

    // Position de départ
    const startX = directionRight ? -90 : WIDTH + 90;
    el.style.left = startX + 'px';

    // Vitesse
    const speed = isPlane
      ? (2.4 + Math.random() * 2.1) // avions plus rapides
      : (1 + Math.random() * 1.2);   // nuages plus lents

    game.appendChild(el);

    const move = setInterval(() => {
      const x = parseFloat(el.style.left || '0');
      const nx = directionRight ? (x + speed) : (x - speed);
      el.style.left = nx + 'px';

      if (directionRight ? nx > WIDTH + 120 : nx < -120) {
        clearInterval(move);
        el.remove();
      }
    }, FRAME_MS);
  }

  function nextSkyDelayMs() {
    // Intervalles plus longs et irréguliers (5s à 14s environ)
    const min = 5000;
    const meanExtra = 6000; // moyenne additionnelle
    const u = Math.random();
    return min + Math.floor(-Math.log(1 - u) * meanExtra);
  }

  function scheduleNextSkyObject() {
    setTimeout(() => {
      createSkyObject();
      scheduleNextSkyObject();
    }, nextSkyDelayMs());
  }

  // Démarrage
  scheduleNextCat();
  scheduleNextSkyObject();
})();

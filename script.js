(() => {
  // Плавные переходы к якорям с учётом фиксированного хедера.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      document.querySelector('.site-header')?.classList.remove('menu-open');
      document.querySelector('.burger')?.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });
  });

  // Мобильное меню.
  const header = document.querySelector('.site-header');
  const burger = document.querySelector('.burger');

  burger?.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });

  // Кастомный видеоплеер.
  const player = document.querySelector('[data-video-player]');

  if (player) {
    const video = player.querySelector('.video');
    const empty = player.querySelector('.video-empty');
    const bigPlay = player.querySelector('.play-button');
    const playToggle = player.querySelector('.play-toggle');
    const muteToggle = player.querySelector('.mute-toggle');
    const fullscreenToggle = player.querySelector('.fullscreen-toggle');
    const progress = player.querySelector('.progress');
    const time = player.querySelector('.time');

    const formatTime = seconds => {
      if (!Number.isFinite(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
    };

    const updateTime = () => {
      progress.value = video.duration ? (video.currentTime / video.duration) * 100 : 0;
      time.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    };

    const togglePlay = () => {
      // Пока source не подключён — кнопка ничего не ломает.
      if (!video.querySelector('source') && !video.currentSrc) return;

      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    };

    bigPlay?.addEventListener('click', togglePlay);
    playToggle?.addEventListener('click', togglePlay);

    video.addEventListener('play', () => {
      player.classList.add('is-playing');
      empty.style.display = 'none';
    });

    video.addEventListener('pause', () => {
      player.classList.remove('is-playing');
    });

    video.addEventListener('loadedmetadata', updateTime);
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('ended', () => {
      player.classList.remove('is-playing');
      progress.value = 0;
    });

    progress.addEventListener('input', () => {
      if (video.duration) {
        video.currentTime = (progress.value / 100) * video.duration;
      }
    });

    muteToggle?.addEventListener('click', () => {
      video.muted = !video.muted;
      muteToggle.setAttribute('aria-label', video.muted ? 'Включить звук' : 'Выключить звук');
    });

    fullscreenToggle?.addEventListener('click', async () => {
      try {
        if (!document.fullscreenElement) {
          await player.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      } catch (error) {
        console.warn('Fullscreen недоступен:', error);
      }
    });
  }

  // Форма без backend: показываем состояние вместо отправки.
  const form = document.querySelector('#applicationForm');
  const status = document.querySelector('.form-status');

  form?.addEventListener('submit', event => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    status.textContent = 'Спасибо! Форма заполнена. Подключение отправки добавим позже.';
    form.reset();
  });
})();

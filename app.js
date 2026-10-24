(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  function closeMenu() {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    if(open) navigation.querySelector('a').focus();
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.querySelector('.header-contact').addEventListener('click', closeMenu);
  document.addEventListener('keydown', event => {
    if(event.key === 'Escape' && navigation.classList.contains('is-open')) { closeMenu(); menuButton.focus(); }
  });
  const demoDialog = document.querySelector('#demo-dialog');
  document.querySelector('[data-demo]').addEventListener('click', () => demoDialog.showModal());
  demoDialog.querySelector('.dialog-close').addEventListener('click', () => demoDialog.close());
  demoDialog.addEventListener('click', event => {
    if(event.target !== demoDialog) return;
    const box = demoDialog.getBoundingClientRect();
    if(event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) demoDialog.close();
  });

  const appointmentForm = document.querySelector('#appointment-form');
  const clientName = document.querySelector('#client-name');
  const clientPhone = document.querySelector('#client-phone');
  const clientIssue = document.querySelector('#client-issue');
  const formSuccess = document.querySelector('#form-success');
  function refreshScroll() { if(window.ScrollTrigger) ScrollTrigger.refresh(); }
  function validateName() {
    clientName.setCustomValidity(clientName.value.trim().length < 2 ? 'Введите имя: не менее двух символов.' : '');
  }
  function validatePhone() {
    const phone = clientPhone.value.trim();
    const digits = phone.replace(/\D/g, '');
    const valid = /^\+?[\d\s()\-]+$/.test(phone) && digits.length >= 10 && digits.length <= 15 && !/^(\d)\1+$/.test(digits);
    clientPhone.setCustomValidity(valid ? '' : 'Введите телефон: от 10 до 15 цифр. Можно использовать +, пробелы, дефисы и скобки.');
  }
  clientName.addEventListener('input', validateName);
  clientPhone.addEventListener('input', validatePhone);
  clientIssue.addEventListener('input', () => { clientIssue.value = clientIssue.value.slice(0, 400); });
  appointmentForm.addEventListener('submit', event => {
    event.preventDefault();
    validateName(); validatePhone();
    if(!appointmentForm.reportValidity()) return;
    const request = appointmentForm.querySelector('input[name="request"]:checked').value;
    document.querySelector('#form-success-copy').textContent = request === 'callback' ? 'Вы выбрали обратный звонок. Демозаявка никуда не отправлена.' : 'Вы хотите обсудить визит. Демозаявка никуда не отправлена, встреча не назначена.';
    appointmentForm.reset(); clientName.setCustomValidity(''); clientPhone.setCustomValidity('');
    appointmentForm.hidden = true; formSuccess.hidden = false;
    formSuccess.focus({preventScroll:true});
    formSuccess.scrollIntoView({block:'nearest',behavior:'instant'});
    refreshScroll();
  });
  appointmentForm.querySelector('[type="submit"]').disabled = false;
  document.querySelector('#form-reset').addEventListener('click', () => {
    formSuccess.hidden = true; appointmentForm.hidden = false;
    appointmentForm.reset(); clientName.setCustomValidity(''); clientPhone.setCustomValidity('');
    clientName.focus(); refreshScroll();
  });

  const topics = {
    stopped: {advice:'Вспомните, когда часы остановились и что происходило перед этим. Назовите марку и модель, если они известны.', brief:'Здравствуйте! Часы остановились. Хочу обсудить возможность ремонта.'},
    accuracy: {advice:'Расскажите, часы спешат или отстают и давно ли это началось. Мастер уточнит детали и подскажет, что обсудить дальше.', brief:'Здравствуйте! Часы изменили ход. Хочу обсудить это с мастером.'},
    damage: {advice:'Опишите, что произошло и что изменилось после этого. Возможность ремонта конкретного повреждения уточните у мастера.', brief:'Здравствуйте! У часов есть повреждение. Хочу обсудить возможность ремонта.'},
    other: {advice:'Опишите вопрос своими словами. Название модели или фотография часов помогут начать предметный разговор с мастером.', brief:'Здравствуйте! Хочу обсудить вопрос по моим часам.'}
  };
  let selectedTopic = 'stopped', lastSuggestedIssue = '';
  document.querySelectorAll('[data-topic]').forEach(button => button.addEventListener('click', () => {
    selectedTopic = button.dataset.topic;
    document.querySelectorAll('[data-topic]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelector('#topic-advice').textContent = topics[selectedTopic].advice;
  }));
  document.querySelector('#topic-contact').addEventListener('click', () => {
    if(appointmentForm.hidden) {
      formSuccess.hidden = true; appointmentForm.hidden = false; appointmentForm.reset();
      clientName.setCustomValidity(''); clientPhone.setCustomValidity('');
    }
    if(!clientIssue.value || clientIssue.value === lastSuggestedIssue) {
      lastSuggestedIssue = topics[selectedTopic].brief;
      clientIssue.value = lastSuggestedIssue;
    }
    refreshScroll();
  });

  const tasks = [{hour:10,minute:10},{hour:6,minute:30},{hour:8,minute:45}];
  const gameStart = document.querySelector('#game-start');
  const gameControls = document.querySelector('#game-controls');
  const gameCheck = document.querySelector('#game-check');
  const gameNext = document.querySelector('#game-next');
  const gameReset = document.querySelector('#game-reset');
  const gameStatus = document.querySelector('#game-status');
  const gameVictory = document.querySelector('#game-victory');
  const hourNumber = document.querySelector('#hours-number');
  const minuteNumber = document.querySelector('#minutes-number');
  const hourRange = document.querySelector('#hours-range');
  const minuteRange = document.querySelector('#minutes-range');
  const hourHand = document.querySelector('#hour-hand');
  const minuteHand = document.querySelector('#minute-hand');
  const progress = document.querySelector('.game-progress');
  let phase = 'ready', taskIndex = 0, completed = 0, hour = 12, minute = 0;
  hourNumber.required = true; minuteNumber.required = true;
  function timeText(h,m) { return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`; }
  function updateClock() {
    hourHand.setAttribute('transform', `rotate(${(hour % 12) * 30 + minute / 2} 250 250)`);
    minuteHand.setAttribute('transform', `rotate(${minute * 6} 250 250)`);
    const current = timeText(hour, minute);
    document.querySelector('#current-time').value = current;
    document.querySelector('#control-current').value = current;
    document.querySelector('#game-dial').setAttribute('aria-label', `Игровые часы показывают ${current}`);
    hourNumber.value = hour; minuteNumber.value = minute;
    hourRange.value = hour; minuteRange.value = minute;
    hourRange.setAttribute('aria-valuetext', `${hour} часов`);
    minuteRange.setAttribute('aria-valuetext', `${minute} минут`);
  }
  function showMessage(message, tone = '') {
    gameStatus.textContent = message;
    gameStatus.dataset.tone = tone;
  }
  function focusGame(target) {
    target.focus({preventScroll:true});
    target.scrollIntoView({block:'nearest',behavior:'instant'});
  }
  function paintGame() {
    document.querySelector('#game-round').textContent = phase === 'won' ? 'Все задания выполнены' : `Задание ${taskIndex + 1} из 3`;
    document.querySelector('#game-score').textContent = `${completed} / 3 готово`;
    document.querySelector('#target-time').textContent = timeText(tasks[taskIndex].hour,tasks[taskIndex].minute);
    document.querySelector('#control-target').textContent = timeText(tasks[taskIndex].hour,tasks[taskIndex].minute);
    progress.setAttribute('aria-valuenow', completed);
    progress.setAttribute('aria-valuetext', `${completed} из 3 заданий`);
    progress.firstElementChild.style.transform = `scaleX(${completed / 3})`;
    gameStart.hidden = phase !== 'ready';
    gameControls.hidden = phase !== 'playing';
    gameNext.hidden = phase !== 'solved';
    gameReset.hidden = phase === 'ready';
    gameVictory.hidden = phase !== 'won';
    document.querySelector('#game-help').textContent = phase === 'ready' ? 'Нажмите «Начать настройку». Двигайте ползунки или введите часы и минуты цифрами.' : phase === 'won' ? 'Вы точно выставили время во всех трёх заданиях.' : 'Двигайте ползунки или введите часы и минуты цифрами. Затем проверьте время.';
    refreshScroll();
  }
  gameStart.addEventListener('click', event => {
    if(phase !== 'ready') return;
    phase = 'playing'; paintGame();
    showMessage('Настройте часы на 10:10 и нажмите «Проверить время».');
    if(event.detail === 0) focusGame(hourNumber);
  });
  gameStart.disabled = false;
  function changeTime(control, part) {
    if(phase !== 'playing') return;
    const value = control.valueAsNumber;
    if(!Number.isFinite(value) || !Number.isInteger(value) || value < Number(control.min) || value > Number(control.max)) return;
    if(part === 'hour') hour = value; else minute = value;
    updateClock();
    if(gameStatus.dataset.tone === 'error') showMessage('Стрелки переместились. Проверьте время, когда будете готовы.');
  }
  [[hourRange,'hour'],[minuteRange,'minute'],[hourNumber,'hour'],[minuteNumber,'minute']].forEach(([control,part]) => {
    control.addEventListener('input', () => changeTime(control,part));
  });
  gameCheck.addEventListener('click', event => {
    if(phase !== 'playing') return;
    if(!hourNumber.reportValidity() || !minuteNumber.reportValidity()) return;
    hour = hourNumber.valueAsNumber; minute = minuteNumber.valueAsNumber; updateClock();
    const target = tasks[taskIndex];
    if(hour !== target.hour || minute !== target.minute) {
      showMessage(`Сейчас ${timeText(hour,minute)}, а нужно ${timeText(target.hour,target.minute)}. Попробуйте ещё раз — время у вас есть.`, 'error');
      return;
    }
    completed = taskIndex + 1;
    phase = completed === tasks.length ? 'won' : 'solved';
    paintGame();
    showMessage(phase === 'won' ? 'Точно! Все три задания выполнены. Можно начать заново.' : `Верно! ${timeText(target.hour,target.minute)}. ${completed} из 3 заданий выполнено.`, 'success');
    if(event.detail === 0) focusGame(phase === 'won' ? gameReset : gameNext);
  });
  gameNext.addEventListener('click', event => {
    if(phase !== 'solved') return;
    taskIndex += 1; phase = 'playing'; hour = 12; minute = 0;
    updateClock(); paintGame();
    showMessage(`Следующий момент — ${timeText(tasks[taskIndex].hour,tasks[taskIndex].minute)}. Настройте стрелки.`);
    if(event.detail === 0) focusGame(hourNumber);
  });
  gameReset.addEventListener('click', event => {
    phase = 'ready'; taskIndex = 0; completed = 0; hour = 12; minute = 0;
    updateClock(); paintGame();
    showMessage('Начнём с чистого циферблата. Нажмите «Начать настройку».');
    if(event.detail === 0) focusGame(gameStart);
  });
  updateClock();

  function setupPointerMotion() {
    const scene = document.querySelector('.hero-visual');
    const watch = scene.querySelector('.watch-float');
    const light = scene.querySelector('.light-glide');
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    let x = 0, y = 0, targetX = 0, targetY = 0, frame = 0, lastTime = 0, bounds = null, visible = false;
    const allowed = () => finePointer.matches && !reducedMotion.matches && !document.hidden;
    function render() {
      watch.style.transform = `translate3d(${x*9}px,${y*7}px,0) rotateX(${-y*6}deg) rotateY(${x*8}deg) rotateZ(${-12+x*3}deg)`;
      light.style.transform = `translate(${x*55}px,${y*45}px)`;
    }
    function reset() {
      if(frame) cancelAnimationFrame(frame);
      frame = 0; lastTime = 0; x = y = targetX = targetY = 0;
      watch.classList.remove('is-moving'); render();
    }
    function tick(time) {
      frame = 0;
      if(!allowed() || !visible) { reset(); return; }
      const delta = lastTime ? Math.min(3,(time-lastTime)/16.67) : 1;
      lastTime = time;
      const blend = 1-Math.pow(.82,delta);
      x += (targetX-x)*blend; y += (targetY-y)*blend; render();
      if(Math.abs(targetX-x)+Math.abs(targetY-y)>.002) frame = requestAnimationFrame(tick);
      else { x = targetX; y = targetY; render(); watch.classList.remove('is-moving'); lastTime=0; }
    }
    function schedule() {
      if(!frame && visible && allowed()) { watch.classList.add('is-moving'); frame=requestAnimationFrame(tick); }
    }
    function move(event) {
      if(!allowed() || !visible || event.pointerType==='touch') return;
      if(!bounds) bounds=scene.getBoundingClientRect();
      targetX=Math.max(-1,Math.min(1,(event.clientX-bounds.left)/bounds.width*2-1));
      targetY=Math.max(-1,Math.min(1,(event.clientY-bounds.top)/bounds.height*2-1));
      schedule();
    }
    scene.addEventListener('pointerenter', event => { bounds=scene.getBoundingClientRect(); move(event); });
    scene.addEventListener('pointermove',move,{passive:true});
    scene.addEventListener('pointerleave',()=>{targetX=targetY=0;schedule();});
    scene.addEventListener('pointercancel',reset);
    window.addEventListener('scroll',()=>{bounds=null;},{passive:true});
    window.addEventListener('resize',()=>{bounds=null;reset();},{passive:true});
    window.addEventListener('blur',reset);window.addEventListener('pagehide',reset);
    document.addEventListener('visibilitychange',reset);
    reducedMotion.addEventListener('change',reset);finePointer.addEventListener('change',reset);
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)reset();}).observe(scene);
  }
  if(window.IntersectionObserver) setupPointerMotion();
  if(window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to('.turn-arrow',{rotation:540,transformOrigin:'50% 50%',ease:'none',scrollTrigger:{trigger:document.documentElement,start:0,end:'max',scrub:true}});
      gsap.to('.hero .gear-a',{rotation:105,transformOrigin:'50% 50%',ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
      gsap.to('.hero .gear-b',{rotation:-140,transformOrigin:'50% 50%',ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
      const mechanism = document.querySelector('.mechanism-scene');
      const split = gsap.timeline({scrollTrigger:{trigger:'#mechanism',start:'top 75%',end:'bottom 35%',scrub:.35}});
      split.to(mechanism.querySelector('.layer-back'),{y:76,x:-25,ease:'none',duration:1},0)
        .to(mechanism.querySelector('.layer-gears'),{y:26,x:-8,ease:'none',duration:1},0)
        .to(mechanism.querySelector('.layer-face'),{y:-76,x:28,ease:'none',duration:1},0)
        .to(mechanism.querySelector('.layer-glass'),{y:-135,x:48,ease:'none',duration:1},0)
        .to(mechanism.querySelector('.gear-a'),{rotation:245,transformOrigin:'50% 50%',ease:'none',duration:1},0)
        .to(mechanism.querySelector('.gear-b'),{rotation:-310,transformOrigin:'50% 50%',ease:'none',duration:1},0)
        .to(mechanism.querySelector('.gear-c'),{rotation:360,transformOrigin:'50% 50%',ease:'none',duration:1},0)
        .to(mechanism.querySelector('.gear-d'),{rotation:-420,transformOrigin:'50% 50%',ease:'none',duration:1},0)
        .to(mechanism.querySelector('.watch-second'),{rotation:220,svgOrigin:'380 390',ease:'none',duration:1},0);
    });
    if(document.fonts) document.fonts.ready.then(refreshScroll);
    window.addEventListener('load',refreshScroll,{once:true});
  }
})();

"use strict";
(() => {
  // src/js/utils.ts
  function reMap(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
  }
  function log(...args) {
    const prefix = "SML:";
    console.log(prefix, ...args);
  }

  // src/js/card.ts
  var mutationHandlerCard = () => {
    const cardFullSelector = ".Card.full";
    const overlayClass = "image-headline-overlay";
    const cards = document.querySelectorAll(cardFullSelector);
    cards.forEach((card) => {
      if (card.querySelector(`.${overlayClass}`)) {
        return;
      }
      const image = card.querySelector(".Card__image");
      if (!image) {
        return;
      }
      const headline = card.querySelector(".CardHeader__Headline");
      if (!headline) {
        return;
      }
      const headlineText = headline.textContent?.trim();
      if (!headlineText) {
        return;
      }
      const overlay = document.createElement("div");
      overlay.classList.add(overlayClass);
      overlay.textContent = headlineText;
      card.insertBefore(overlay, card.firstChild);
    });
  };

  // src/js/scroll.ts
  var classInView = "in-view";
  var className = "intersection-observer";
  var containers = [
    ".ScrollContainer",
    ".SectionShell",
    ".DataList"
  ];
  var selector = containers.map((c) => `${c} > *`).join(", ");
  var cb = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(classInView);
        observer.unobserve(entry.target);
      }
    });
  };
  var initScrolling = () => {
    log("init scrolling...");
    const observer = new IntersectionObserver(cb);
    const elems = document.querySelectorAll(selector);
    elems.forEach((elem) => {
      if (elem.classList.contains(className)) {
        return;
      }
      elem.classList.remove(classInView);
      elem.classList.add(className);
      observer.observe(elem);
    });
  };

  // src/global.ts
  console.info("S/M/L theme");
  (() => {
    const appElement = document.querySelector("#Theming");
    if (!appElement) {
      return;
    }
    const barMinimizedId = "playerBarOverlayMinimized";
    const barExpandedId = "playerBarOverlayExpanded";
    let audioElem = null;
    let videoContainerElem = null;
    let rangeInput = null;
    let barMinimized = null;
    let barExpanded = null;
    const updateBar = (currentTime, duration) => {
      const f = currentTime / duration;
      const percent = f * 100;
      if (barMinimized) {
        barMinimized.style.width = `${percent}%`;
      }
      if (barExpanded) {
        barExpanded.style.width = `calc(${percent}% - ${reMap(f, 0, 1, 0, 32)}px)`;
      }
    };
    const handleProgress = (event) => {
      const { duration, currentTime } = event.target;
      updateBar(currentTime, duration);
    };
    const handlePlay = (event) => {
      const mediaElem = event.target;
      mediaElem.addEventListener("timeupdate", handleProgress);
      const loop = () => {
        if (mediaElem.paused || mediaElem.ended || mediaElem.error) {
          mediaElem.removeEventListener("timeupdate", handleProgress);
          return;
        }
        handleProgress({ target: mediaElem });
        requestAnimationFrame(loop);
      };
      loop();
    };
    const handleRangeChange = (event) => {
      const rangeInput2 = event.target;
      const currentTime = rangeInput2.valueAsNumber;
      const duration = parseFloat(rangeInput2.max);
      updateBar(currentTime, duration);
    };
    const handleVimeoTimeUpdate = (event) => {
      if (event.data.event === "timeupdate") {
        const { seconds: currentTime, duration } = event.data.data;
        updateBar(currentTime, duration);
      }
    };
    const initAudio = (audioPlayerMinimized, audioPlayerExpanded) => {
      if (audioPlayerMinimized) {
        barMinimized = document.querySelector(`#${barMinimizedId}`);
        if (!barMinimized) {
          barMinimized = document.createElement("div");
          barMinimized.id = barMinimizedId;
          audioPlayerMinimized.parentNode.insertBefore(barMinimized, audioPlayerMinimized);
        } else {
          audioPlayerMinimized.parentNode.insertBefore(barMinimized, audioPlayerMinimized);
        }
      }
      if (audioPlayerExpanded) {
        const bottomBar = document.querySelector(".AudioPlayer__BottomBar");
        rangeInput = document.querySelector(".AudioPlayer__BottomBar .AudioPlayer__Range__Input");
        barExpanded = document.querySelector(`#${barExpandedId}`);
        if (!barExpanded) {
          barExpanded = document.createElement("div");
          barExpanded.id = barExpandedId;
          barExpanded.style.height = bottomBar.getBoundingClientRect().height + "px";
          rangeInput.parentNode.insertBefore(barExpanded, rangeInput);
        }
        if (audioElem) {
          const currentTime = rangeInput.valueAsNumber;
          updateBar(currentTime, audioElem.duration);
        }
      }
    };
    const initVideo = (videoPlayerBottomBar) => {
      if (!videoPlayerBottomBar) {
        return;
      }
      rangeInput = document.querySelector(".VideoPlayer__Range__Input");
      barExpanded = document.querySelector(`#${barExpandedId}`);
      if (!barExpanded) {
        barExpanded = document.createElement("div");
        barExpanded.id = barExpandedId;
        barExpanded.style.height = videoPlayerBottomBar.getBoundingClientRect().height + "px";
        rangeInput.parentNode.insertBefore(barExpanded, rangeInput);
      }
      const currentTime = rangeInput.valueAsNumber;
      const duration = parseFloat(rangeInput.max);
      updateBar(currentTime, duration);
    };
    const mutationHandlerMediaPlayer = () => {
      audioElem = document.querySelector(".AppBase__audioplayer audio");
      videoContainerElem = document.querySelector(".VideoPlayer");
      if (!audioElem && !videoContainerElem) {
        log("no media player found");
        return;
      } else {
        log("media player found!");
      }
      const audioPlayerMinimized = document.querySelector(".AudioPlayer--minimised");
      const audioPlayerExpanded = document.querySelector(".AudioPlayer--expanded");
      initAudio(audioPlayerMinimized, audioPlayerExpanded);
      const videoPlayerBottomBar = videoContainerElem.querySelector(".VideoPlayer__BottomBar");
      initVideo(videoPlayerBottomBar);
      if (rangeInput) {
        rangeInput.step = "0.01";
      }
      [
        audioElem
        /* , videoElem */
      ].forEach((mediaElem) => {
        if (!mediaElem) {
          return;
        }
        mediaElem.removeEventListener("timeupdate", handleProgress);
        mediaElem.removeEventListener("play", handlePlay);
        if (rangeInput) {
          rangeInput.removeEventListener("input", handleRangeChange);
        }
        mediaElem.addEventListener("play", handlePlay);
        if (mediaElem.autoplay) {
          handlePlay({ target: mediaElem });
        }
        if (rangeInput) {
          rangeInput.addEventListener("input", handleRangeChange);
        }
      });
      if (videoPlayerBottomBar) {
        window.removeEventListener("message", handleVimeoTimeUpdate);
        if (rangeInput) {
          rangeInput.removeEventListener("input", handleRangeChange);
        }
        window.addEventListener("message", handleVimeoTimeUpdate);
        if (rangeInput) {
          rangeInput.addEventListener("input", handleRangeChange);
        }
      }
    };
    log("observing...");
    const observer = new MutationObserver((mutations_) => {
      const mutations = mutations_.filter((m) => {
        const elem = m.target;
        if (elem.className.includes("leaflet")) {
          return false;
        }
        if (elem.className.includes("LayoutShellAudio__AudioPlayer")) {
          return false;
        }
        return true;
      });
      if (!mutations.length) {
        return;
      }
      log("---- mutation ----");
      mutationHandlerCard();
      mutationHandlerMediaPlayer();
      initScrolling();
    });
    observer.observe(appElement, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });
  })();
})();
//# sourceMappingURL=global.js.map
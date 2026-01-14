
// ===================================================
// SINGLE PHOTO SLIDING GALLERY (ONE AT A TIME, FADE EFFECT)
// ===================================================
function setupSimpleGallery() {
  const gallery = document.querySelector('.photo-gallery');
  const slides = document.querySelectorAll('.slide');
  
  if (!gallery || slides.length === 0) {
    console.log('Gallery not found, skipping');
    return null;
  }
  
  let currentIndex = 0;
  let autoSlideInterval = null;
  const totalSlides = slides.length;
  const slideDuration = 3000; // 3 seconds per photo
  
  // Initialize: show first slide
  slides[0].classList.add('active');
  
  // Simple fade transition to next slide
  function nextSlide() {
    // Hide current slide
    slides[currentIndex].classList.remove('active');
    
    // Move to next slide
    currentIndex = (currentIndex + 1) % totalSlides;
    
    // Show next slide
    slides[currentIndex].classList.add('active');
  }
  
  // Start auto-sliding
  function startAutoSlide() {
    if (autoSlideInterval) return;
    
    autoSlideInterval = setInterval(nextSlide, slideDuration);
  }
  
  // Stop auto-sliding
  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }
  
  // Reset gallery to initial state
  function resetGallery() {
    stopAutoSlide();
    
    // Hide all slides
    slides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // Show first slide
    currentIndex = 0;
    slides[0].classList.add('active');
    
    // Restart auto slide
    setTimeout(() => {
      startAutoSlide();
    }, 1000);
  }
  
  // Start the gallery
  startAutoSlide();
  
  return {
    reset: resetGallery,
    startAutoSlide: startAutoSlide,
    stopAutoSlide: stopAutoSlide
  };
}

// ===================================================
// CONFETTI SYSTEM (STABLE + CONTINUOUS)
// ===================================================
let sideCannonInterval = null;
let fallingConfettiInterval = null;

const startSideCannons = () => {
  if (sideCannonInterval) return;

  sideCannonInterval = setInterval(() => {
    const colors = ["#ff0a54", "#ff477e", "#ff7096", "#ff85a1"];

    confetti({
      particleCount: 22,
      angle: 60,
      spread: 60,
      startVelocity: 50,
      gravity: 0.9,
      ticks: 300,
      origin: { x: 0, y: 0.65 },
      colors
    });

    confetti({
      particleCount: 22,
      angle: 120,
      spread: 60,
      startVelocity: 50,
      gravity: 0.9,
      ticks: 300,
      origin: { x: 1, y: 0.65 },
      colors
    });
  }, 200);
};

const startFallingConfetti = () => {
  if (fallingConfettiInterval) return;

  fallingConfettiInterval = setInterval(() => {
    confetti({
      particleCount: 10,
      angle: 90,
      spread: 60,
      startVelocity: 25,
      gravity: 0.6,
      ticks: 250,
      origin: { x: Math.random(), y: 0 },
      colors: ["#ff0a54", "#ff477e", "#ff7096", "#ff85a1"]
    });
  }, 300);
};

const stopAllConfetti = () => {
  clearInterval(sideCannonInterval);
  clearInterval(fallingConfettiInterval);
  sideCannonInterval = null;
  fallingConfettiInterval = null;
};

// ===================================================
// SECRET EASTER EGG MUSIC PLAYER
// ===================================================
const setupMusicPlayer = () => {
  const audio = document.getElementById('birthday-music');
  const musicBtn = document.getElementById('music-btn');
  const musicContainer = document.querySelector('.music-container');
  const slidingWall = document.querySelector('.sliding-wall');
  const hintText = document.querySelector('.hint-text');
  
  // If elements don't exist, return null
  if (!audio || !musicBtn || !slidingWall || !musicContainer) {
    console.log('Music player elements not found');
    return null;
  }
  
  // Variables for sliding interaction
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let revealThreshold = 50; // pixels to slide for reveal
  let isRevealed = false;
  
  // Initialize - ensure wall is in correct position
  slidingWall.style.transform = 'translateX(0)';
  slidingWall.classList.remove('revealed');
  
  // Add shake animation to CSS if not already present
  if (!document.querySelector('#shake-animation')) {
    const style = document.createElement('style');
    style.id = 'shake-animation';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(var(--current-x, 0)); }
        25% { transform: translateX(calc(var(--current-x, 0) - 8px)); }
        75% { transform: translateX(calc(var(--current-x, 0) + 8px)); }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Mouse event handlers for sliding wall
  const startDrag = (clientX) => {
    isDragging = true;
    startX = clientX;
    currentX = 0;
    slidingWall.classList.add('dragging');
  };
  
  const duringDrag = (clientX) => {
    if (!isDragging) return;
    
    currentX = clientX - startX;
    // Only allow sliding to the left (negative X)
    if (currentX > 0) currentX = 0;
    
    // Apply transform with max limit
    const translateX = Math.max(currentX, -100);
    slidingWall.style.transform = `translateX(${translateX}px)`;
    slidingWall.style.setProperty('--current-x', `${translateX}px`);
    
    // Check if revealed enough
    if (Math.abs(currentX) >= revealThreshold && !isRevealed) {
      isRevealed = true;
      slidingWall.classList.add('revealed');
      if (hintText) {
        hintText.classList.add('visible');
        hintText.textContent = 'ada rahasia';
      }
      // Enable button
      musicBtn.style.cursor = 'pointer';
    } else if (Math.abs(currentX) < revealThreshold && isRevealed) {
      isRevealed = false;
      slidingWall.classList.remove('revealed');
      if (hintText) {
        hintText.classList.remove('visible');
        hintText.textContent = '👆';
      }
      // Disable button
      musicBtn.style.cursor = 'default';
    }
  };
  
  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    slidingWall.classList.remove('dragging');
    
    // Snap to position
    if (isRevealed) {
      slidingWall.style.transform = 'translateX(-100%)';
      slidingWall.style.setProperty('--current-x', '-100px');
    } else {
      slidingWall.style.transform = 'translateX(0)';
      slidingWall.style.setProperty('--current-x', '0');
    }
  };
  
  // Mouse events for desktop
  slidingWall.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startDrag(e.clientX);
  });
  
  document.addEventListener('mousemove', (e) => {
    duringDrag(e.clientX);
  });
  
  document.addEventListener('mouseup', endDrag);
  
  // Touch events for mobile
  slidingWall.addEventListener('touchstart', (e) => {
    startDrag(e.touches[0].clientX);
  }, { passive: true });
  
  slidingWall.addEventListener('touchmove', (e) => {
    duringDrag(e.touches[0].clientX);
  }, { passive: true });
  
  slidingWall.addEventListener('touchend', endDrag);
  
  // Prevent button click when wall is covering it
  musicBtn.addEventListener('click', (e) => {
    if (!isRevealed) {
      e.preventDefault();
      e.stopPropagation();
      
      // Shake animation to hint user
      slidingWall.style.animation = 'shake 0.5s ease';
      setTimeout(() => {
        slidingWall.style.animation = '';
      }, 500);
      
      // Temporary hint
      if (hintText) {
        const originalText = hintText.textContent;
        hintText.textContent = '👉';
        hintText.classList.add('visible');
        setTimeout(() => {
          hintText.textContent = originalText;
          if (!isRevealed) hintText.classList.remove('visible');
        }, 1500);
      }
      return;
    }
    
    // Only play if wall is revealed
    if (audio.paused) {
      audio.play().then(() => {
        musicBtn.textContent = '⏸️';
        musicBtn.style.background = '#ffffff';
        if (hintText) {
          hintText.textContent = 'Music playing...';
        }
      }).catch(error => {
        console.log('Audio play failed:', error);
        // Fallback: show error message
        musicBtn.textContent = '🔇';
        if (hintText) {
          hintText.textContent = 'Click to allow audio';
        }
        setTimeout(() => {
          musicBtn.textContent = '🎵';
          if (hintText) {
            hintText.textContent = 'ada rahasia';
          }
        }, 1500);
      });
    } else {
      audio.pause();
      musicBtn.textContent = '🎵';
      musicBtn.style.background = '#ffffff';
      if (hintText) {
        hintText.textContent = 'ada rahasia';
      }
    }
  });
  
  // Reset music on replay
  const resetMusicPlayer = () => {
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
    musicBtn.textContent = '🎵';
    musicBtn.style.background = '#ffffff';
    slidingWall.style.transform = 'translateX(0)';
    slidingWall.classList.remove('revealed');
    slidingWall.style.animation = '';
    if (hintText) {
      hintText.textContent = '👆';
      hintText.classList.remove('visible');
    }
    isRevealed = false;
    musicBtn.style.cursor = 'default';
  };
  
  return { musicContainer, resetMusicPlayer };
};

// ===================================================
// FETCH CUSTOM DATA
// ===================================================
const fetchData = () => {
  fetch("customize.json")
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      const keys = Object.keys(data);

      keys.forEach((key, index) => {
        if (data[key] !== "") {
          if (key === "imagePath") {
            document
              .querySelector(`[data-node-name*="${key}"]`)
              .setAttribute("src", data[key]);
          } else {
            const element = document.querySelector(`[data-node-name*="${key}"]`);
            if (element) {
              element.innerText = data[key];
            }
          }
        }

        if (index === keys.length - 1) {
          // Initialize music player, gallery, and start animation
          const musicPlayer = setupMusicPlayer();
          const gallery = setupSimpleGallery();
          animationTimeline(musicPlayer, gallery);
        }
      });
    })
    .catch(error => {
      console.error('Error loading customize.json:', error);
      // Start animation even if JSON fails
      const musicPlayer = setupMusicPlayer();
      const gallery = setupSimpleGallery();
      animationTimeline(musicPlayer, gallery);
    });
};

// ===================================================
// ANIMATION TIMELINE
// ===================================================
const animationTimeline = (musicPlayer, gallery) => {
  // If musicPlayer is null, create a dummy container
  let musicContainer;
  let resetMusicPlayerFn;
  
  if (musicPlayer) {
    musicContainer = musicPlayer.musicContainer;
    resetMusicPlayerFn = musicPlayer.resetMusicPlayer;
  } else {
    // Create dummy container if music player not initialized
    musicContainer = document.querySelector('.music-container') || { style: {} };
    resetMusicPlayerFn = () => {};
  }
  
  // Get gallery element
  const galleryElement = document.querySelector('.photo-gallery') || { style: {} };
  
  const textBoxChars = document.querySelector(".hbd-chatbox");
  const hbd = document.querySelector(".wish-hbd");

  // Prepare text for character-by-character animation
  if (textBoxChars) {
    textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
      .split("")
      .join("</span><span>")}</span>`;
  }

  if (hbd) {
    hbd.innerHTML = `<span>${hbd.innerHTML
      .split("")
      .join("</span><span>")}</span>`;
  }

  const ideaTextTrans = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg"
  };

  const ideaTextTransLeave = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewX: "-15deg"
  };

  const tl = new TimelineMax();

  tl
    .to(".container", 0.1, { visibility: "visible" })
    .from(".one", 0.7, { opacity: 0, y: 10 })
    .from(".two", 0.4, { opacity: 0, y: 10 }, "+=2")
    .to(".one", 0.7, { opacity: 0, y: 10 }, "+=3.5")
    .to(".two", 0.7, { opacity: 0, y: 10 }, "-=1")
    .from(".three", 0.7, { opacity: 0, y: 10 })
    .to(".three", 0.7, { opacity: 0, y: 10 }, "+=3.5")
    .from(".four", 0.7, { scale: 0.2, opacity: 0 })
    .from(".fake-btn", 0.3, { scale: 0.2, opacity: 0 })
    .staggerTo(".hbd-chatbox span", 0.5, { visibility: "visible" }, 0.05)
    .to(".fake-btn", 0.1, { backgroundColor: "rgb(127, 206, 248)" })
    .to(".four", 0.5, { scale: 0.2, opacity: 0, y: -150 }, "+=7")
    .from(".idea-1", 0.7, ideaTextTrans)
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=6")
    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=6")
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
      scale: 1.1,
      backgroundColor: "rgb(21,161,237)",
      color: "#fff"
    },"+=2")
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=6")
    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=6")
    .from(".idea-5", 0.7, {
      rotationX: 15,
      rotationZ: -10,
      skewY: "-5deg",
      y: 50,
      z: 10,
      opacity: 0
    })
    .to(".idea-5 .smiley", 0.7, { rotation: 90, x: 8 }, "+=0.4")
    .to(".idea-5", 0.7, { scale: 0.2, opacity: 0 }, "+=5")
    .staggerFrom(".idea-6 span", 0.8, {
      scale: 3,
      opacity: 0,
      rotation: 15,
      ease: Expo.easeOut
    }, 0.2)
    .staggerTo(".idea-6 span", 0.8, {
      scale: 3,
      opacity: 0,
      rotation: -15,
      ease: Expo.easeOut
    }, 0.2, "+=3")
    .staggerFromTo(".baloons img", 2.5, {
      opacity: 0.9,
      y: 1400
    }, {
      opacity: 1,
      y: -1000
    }, 0.2)
    .from(".maria-dp", 0.5, {
      scale: 3.5,
      opacity: 0,
      x: 25,
      y: -25,
      rotationZ: -45
    }, "-=2")
    .from(".hat", 0.5, {
      x: -100,
      y: 350,
      rotation: -180,
      opacity: 0
    })

    // 🎉 PARTY MOMENT — CONFETTI ONLY
    .add(() => {
      startSideCannons();
      startFallingConfetti();
    }, "party")

    .staggerFrom(".wish-hbd span", 0.7, {
      opacity: 0,
      y: -50,
      rotation: 150,
      skewX: "30deg",
      ease: Elastic.easeOut.config(1, 0.5)
    }, 0.1)
    .staggerFromTo(".wish-hbd span", 0.7, {
      scale: 1.4,
      rotationY: 150
    }, {
      scale: 1,
      rotationY: 0,
      color: "#15a1ed",
      ease: Expo.easeOut
    }, 0.1, "party")
    .from(".wish h5", 0.5, {
      opacity: 0,
      y: 10,
      skewX: "-15deg"
    }, "party")
    .staggerTo(".eight svg", 1.5, {
      visibility: "visible",
      opacity: 0,
      scale: 80,
      repeat: 3,
      repeatDelay: 1.4
    }, 0.3)
    .to(".six", 0.5, { opacity: 0, y: 30, zIndex: "-1" })
    .add(() => {
      stopAllConfetti();
    }, "-=0.5")
    
    // PHASE 9: SINGLE PHOTO GALLERY FIRST
    .to(galleryElement, 1, { 
      opacity: 1, 
      y: 0,
      ease: Power2.easeOut
    }, "phase9")
    
    // Then show the outro text
    .staggerFrom(".nine p", 1, { 
      opacity: 0, 
      y: -10,
      rotationX: 3,
      skewX: "10deg"
    }, 1.0, "phase9+=0.3")
    .to(".last-smile", 0.5, { rotation: 90 }, "+=0.5")
    
    // Finally show the music player
    .to(musicContainer, 1.0, {
      opacity: 1, 
      y: 0,
      ease: Power2.easeOut
    }, "-=0.3");

  // Replay functionality
  const replayBtn = document.getElementById("replay");
  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      stopAllConfetti();
      
      // Reset music player
      resetMusicPlayerFn();
      
      // Reset gallery
      if (gallery && typeof gallery.reset === 'function') {
        gallery.reset();
      }
      
      // Hide gallery
      if (galleryElement && galleryElement.style) {
        galleryElement.style.opacity = '0';
        galleryElement.style.transform = 'translateY(20px)';
      }
      
      // Hide music player
      if (musicContainer && musicContainer.style) {
        musicContainer.style.opacity = '0';
        musicContainer.style.transform = 'translateY(20px)';
      }
      
      // Restart timeline
      tl.restart();
      
      // Re-initialize after restart
      setTimeout(() => {
        const musicPlayer = setupMusicPlayer();
        const gallery = setupSimpleGallery();
        
        if (musicPlayer && musicPlayer.musicContainer) {
          TweenMax.to(musicPlayer.musicContainer, 1.0, {
            opacity: 1,
            y: 0,
            ease: Power2.easeOut,
            delay: tl.duration() - 2
          });
        }
        
        if (gallery && galleryElement) {
          TweenMax.to(galleryElement, 1, {
            opacity: 1,
            y: 0,
            ease: Power2.easeOut,
            delay: tl.duration() - 3
          });
        }
      }, 100);
    });
  }
};

// ===================================================
// START THE APPLICATION
// ===================================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fetchData);
} else {
  fetchData();
}

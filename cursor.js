document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.querySelector(".cursor");

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  const speed = 1;

  document.body.style.cursor = "none";

  setTimeout(() => {
    cursor.style.opacity = 1;
  }, 300);

  let freezeCursor = false;
  let hasDetectedMouse = false;

  function setCursorToCenter() {
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
    cursorX = mouseX;
    cursorY = mouseY;
    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";
  }

  setCursorToCenter();

  document.addEventListener("mousemove", (e) => {
    if (freezeCursor) return;
    hasDetectedMouse = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener("pointermove", (e) => {
    if (freezeCursor) return;
    hasDetectedMouse = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  window.addEventListener("resize", () => {
    if (!hasDetectedMouse) setCursorToCenter();
  });

  function animate() {
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;

    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  const interactive = document.querySelectorAll("a, button, .clickable");

  let isHovered = false;
  let isPressed = false;

  function applyCursorScale() {
    if (isPressed) {
      cursor.style.transform = "translate(-50%, -50%) scale(0.6)";
    } else if (isHovered) {
      cursor.style.transform = "translate(-50%, -50%) scale(2)";
    } else {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
    }
  }

  interactive.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      isHovered = true;
      applyCursorScale();
    });

    el.addEventListener("mouseleave", () => {
      isHovered = false;
      applyCursorScale();
    });

    el.addEventListener("pointerdown", (ev) => {
      if (ev.button !== undefined && ev.button !== 0) return;
      isPressed = true;
      applyCursorScale();
    });

    el.addEventListener("pointerup", () => {
      isPressed = false;
      applyCursorScale();
    });
  });

  document.addEventListener("pointerup", () => {
    if (isPressed) {
      isPressed = false;
      applyCursorScale();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const active = document.activeElement;
      if (active && active.matches?.("a, button, .clickable")) {
        isPressed = true;
        applyCursorScale();
      }
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      if (isPressed) {
        isPressed = false;
        applyCursorScale();
      }
    }
  });

  // --- Transizione full-fill per button.container_box ---
  const projectButtons = document.querySelectorAll("button.container_box");
  let isButtonAnimating = false;

  projectButtons.forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      if (isButtonAnimating) return;

      const parentA = btn.closest("a");
      const targetHref = parentA?.href || btn.dataset.href || null;
      if (!targetHref) return;

      isButtonAnimating = true;
      document.body.style.pointerEvents = "none";
      freezeCursor = true;
      mouseX = cursorX;
      mouseY = cursorY;

      const comp = getComputedStyle(cursor);
      const origWidth = comp.width || "50px";
      const origHeight = comp.height || "50px";

      const expandDuration = 900;
      const shrinkDuration = 700;

      cursor.style.transition =
        "width 0.9s cubic-bezier(.86,0,.07,1), height 0.9s cubic-bezier(.86,0,.07,1), transform 0.25s ease";

      requestAnimationFrame(() => {
        cursor.style.width = "300vh";
        cursor.style.height = "300vh";
      });

      const expandTimeout = setTimeout(() => {
        cursor.style.transition =
          "width 0.6s cubic-bezier(.2,.9,.3,1), height 0.6s cubic-bezier(.2,.9,.3,1), transform 0.2s ease";
        cursor.style.width = origWidth;
        cursor.style.height = origHeight;

        const finalTimeout = setTimeout(() => {
          location.href = targetHref;
        }, shrinkDuration - 100);
      }, expandDuration);

      const safetyTimeout = setTimeout(() => {
        if (isButtonAnimating) {
          freezeCursor = false;
          document.body.style.pointerEvents = "";
          isButtonAnimating = false;
          location.href = targetHref;
        }
      }, 3000);
    });
  });
});

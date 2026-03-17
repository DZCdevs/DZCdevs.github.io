// Scroll reveal for .reveal elements (soldan sağa yumuşak giriş)
// Reveal elementleri viewport'a girdiğinde otomatik olarak görünür hale getirir.

document.addEventListener("DOMContentLoaded", () => {
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  if (!reveals.length) return;

  reveals.forEach((el, idx) => {
    const delay = idx * 70;
    el.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  reveals.forEach((el) => observer.observe(el));
});

(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clips = document.querySelectorAll("video[autoplay]");

  // Autoplaying clips: respect reduced motion, and pause while off screen.
  Array.prototype.forEach.call(clips, function (video) {
    if (reduceMotion) {
      video.removeAttribute("autoplay");
      video.pause();
      video.controls = true;
    }
  });

  if (!reduceMotion && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (entry.isIntersecting) {
          var p = video.play();
          if (p && p.catch) p.catch(function () { video.controls = true; });
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.15 });
    Array.prototype.forEach.call(clips, function (video) { observer.observe(video); });
  }

  // BibTeX copy.
  Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"), function (btn) {
    btn.addEventListener("click", function () {
      var text = document.querySelector(btn.dataset.copy).textContent;
      var done = function () {
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = "Copy"; }, 1600);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });
})();

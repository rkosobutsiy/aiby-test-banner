document.addEventListener("DOMContentLoaded", () => {
  function setVh() {
    document.documentElement.style.setProperty("--vh", window.innerHeight + "px");
  }
  setVh();
  window.addEventListener("resize", setVh);

  document.body.classList.add("banner-open");

  const radioInputs = document.querySelectorAll('input[name="subscription"]');
  radioInputs.forEach((input) => {
    input.addEventListener("change", () => {
      document.querySelectorAll(".option").forEach((opt) => opt.classList.remove("selected"));
      input.closest(".option").classList.add("selected");
    });
  });

  document.querySelector(".continue-btn")?.addEventListener("click", () => {
    const selected = document.querySelector(".option.selected");
    const plan = selected?.classList.contains("yearly") ? "yearly" : "weekly";

    if (plan === "yearly") {
      window.location.href = "https://apple.com/";
    } else {
      window.location.href = "https://google.com/";
    }
  });

  document.querySelector(".banner__close")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(".banner").style.display = "none";
    document.body.classList.remove("banner-open");
  });

  document.querySelectorAll(".banner__links a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const langKey = link.dataset.lang;
      if (langKey === "terms") {
        window.location.href = "https://apple.com/";
      } else if (langKey === "privacy") {
        window.location.href = "https://google.com/";
      } else if (langKey === "restore") {
        window.location.href = "#restore";
      }
    });
  });

  (async function handleLanguage() {
    const params = new URLSearchParams(location.search);
    const langParam = params.get("lang")?.toLowerCase();
    const supported = ["de", "en", "es", "fr", "ja", "pt"];
    const lang = supported.includes(langParam)
      ? langParam
      : supported.includes(navigator.language.slice(0, 2))
        ? navigator.language.slice(0, 2)
        : "en";

    try {
      const res = await fetch(`./i18n/${lang}.json`);
      if (!res.ok) throw new Error(res.statusText);
      const t = await res.json();

      document.querySelectorAll("[data-lang]").forEach((el) => {
        const key = el.dataset.lang;
        let text = t[key];

        if (!text) return;

        if (key === "yearly_price") {
          text = text.replace("{{price}}", "$39.99");
        } else if (key === "weekly_price") {
          text = text.replace("{{price}}", "$0.48");
        } else if (key === "weekly_price_single") {
          text = text.replace("{{price}}", "$6.99");
        }

        el.innerHTML = text;
      });

      document.documentElement.lang = lang;
    } catch (err) {
      console.error("Translation error:", err);
    }
  })();
});

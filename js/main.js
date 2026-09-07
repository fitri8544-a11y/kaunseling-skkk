/* =========================================================
   PORTAL BIMBINGAN & KAUNSELING
   SK KUALA KETIL
   MAIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


  /* =====================================================
     LUCIDE ICONS
  ===================================================== */

  if (window.lucide) {
    lucide.createIcons();
  }


  /* =====================================================
     MOBILE MENU
  ===================================================== */

  const mobileToggle =
    document.getElementById("mobile-toggle");

  const mobileMenu =
    document.getElementById("mobile-menu");


  if (mobileToggle && mobileMenu) {

    mobileToggle.addEventListener("click", () => {

      const isOpen =
        mobileMenu.classList.toggle("open");


      mobileToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );


      /* ================= ICON ================= */

      mobileToggle.innerHTML =
        isOpen
          ? '<i data-lucide="x"></i>'
          : '<i data-lucide="menu"></i>';


      if (window.lucide) {
        lucide.createIcons();
      }

    });


    /* =================================================
       CLOSE MOBILE MENU AFTER LINK CLICK
    ================================================= */

    mobileMenu
      .querySelectorAll("a")
      .forEach((link) => {

        link.addEventListener("click", () => {

          mobileMenu.classList.remove("open");

          mobileToggle.setAttribute(
            "aria-expanded",
            "false"
          );

          mobileToggle.innerHTML =
            '<i data-lucide="menu"></i>';


          if (window.lucide) {
            lucide.createIcons();
          }

        });

      });

  }


  /* =====================================================
     SCROLL REVEAL
  ===================================================== */

  const revealItems =
    document.querySelectorAll(".reveal");


  if (revealItems.length > 0) {

    const revealObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target
                .classList
                .add("visible");

              revealObserver
                .unobserve(entry.target);

            }

          });

        },
        {
          threshold: 0.12
        }
      );


    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });

  }

  /* =====================================================
   EMOTION CHECK-IN
===================================================== */

const emotionButtons =
  document.querySelectorAll(".emotion-btn");

const emotionResponse =
  document.getElementById("emotion-response");

const emotionTitle =
  document.getElementById("emotion-response-title");

const emotionText =
  document.getElementById("emotion-response-text");

const emotionSupport =
  document.getElementById("emotion-support");


const emotionMessages = {

  gembira: {
    title: "Seronok mendengarnya! 😊",
    text:
      "Teruskan menikmati perkara-perkara positif hari ini. Kongsikan juga kegembiraan anda dengan orang di sekeliling.",
    support: false
  },

  tenang: {
    title: "Bagus, anda sedang berasa tenang. 😌",
    text:
      "Gunakan ruang yang tenang ini untuk berehat, fokus dan menghargai perkara-perkara baik dalam hari anda.",
    support: false
  },

  sedih: {
    title: "Tidak mengapa untuk berasa sedih. 💜",
    text:
      "Perasaan sedih boleh berlaku kepada sesiapa sahaja. Berikan diri anda sedikit ruang dan pertimbangkan untuk bercakap dengan seseorang yang anda percayai.",
    support: true
  },

  risau: {
    title: "Terima kasih kerana mengenali perasaan anda. 🌿",
    text:
      "Cuba tarik nafas perlahan dan fokus kepada perkara yang boleh anda lakukan satu demi satu. Anda juga boleh mendapatkan sokongan jika rasa risau berterusan.",
    support: true
  },

  marah: {
    title: "Mari beri diri sedikit ruang. 🌱",
    text:
      "Berhenti sebentar sebelum bertindak. Cuba tarik nafas, bertenang dan fikirkan cara yang selamat untuk menyatakan apa yang anda rasa.",
    support: true
  }

};


emotionButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const emotion =
      button.dataset.emotion;

    const message =
      emotionMessages[emotion];


    if (!message) return;


    /* RESET BUTTON */

    emotionButtons.forEach((item) => {

      item.classList.remove(
        "ring-2",
        "ring-[#075e4c]",
        "ring-offset-2"
      );

      item.setAttribute(
        "aria-pressed",
        "false"
      );

    });


    /* ACTIVE BUTTON */

    button.classList.add(
      "ring-2",
      "ring-[#075e4c]",
      "ring-offset-2"
    );

    button.setAttribute(
      "aria-pressed",
      "true"
    );


    /* SHOW MESSAGE */

    emotionTitle.textContent =
      message.title;

    emotionText.textContent =
      message.text;


    emotionResponse.classList.add(
      "active"
    );


    /* SUPPORT BUTTON */

    if (message.support) {

      emotionSupport.classList.remove(
        "hidden"
      );

    } else {

      emotionSupport.classList.add(
        "hidden"
      );

    }

  });

});

});

/* =========================================================
   PORTAL BIMBINGAN & KAUNSELING
   MAKLUMAN TERKINI - FIRESTORE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    // ==============================================
    // ELEMENTS
    // ==============================================

    const maklumanLoading =
      document.getElementById("makluman-loading");

    const maklumanList =
      document.getElementById("makluman-list");

    const maklumanEmpty =
      document.getElementById("makluman-empty");


    // Jika bukan halaman yang mempunyai seksyen makluman
    if (
      !maklumanLoading ||
      !maklumanList ||
      !maklumanEmpty
    ) {
      return;
    }


    // ==============================================
    // FIREBASE
    // ==============================================

    const firebaseConfig = {

      apiKey:
        "AIzaSyA9R5jKqeJNvBHD-SIOuseAqyb_x909R3Q",

      authDomain:
        "bimbingankaunselingskkk.firebaseapp.com",

      projectId:
        "bimbingankaunselingskkk"

    };


    // Elakkan initialize dua kali
    if (!firebase.apps.length) {

      firebase.initializeApp(
        firebaseConfig
      );

    }


    const db =
      firebase.firestore();


    // ==============================================
    // ESCAPE HTML
    // ==============================================

    function escapeHTML(value) {

      return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    }


    // ==============================================
    // FORMAT TARIKH
    // ==============================================

    function formatTarikh(value) {

      if (!value) {
        return "";
      }


      const tarikh =
        new Date(
          value + "T00:00:00"
        );


      if (
        Number.isNaN(
          tarikh.getTime()
        )
      ) {
        return "";
      }


      return tarikh.toLocaleDateString(
        "ms-MY",
        {
          day: "numeric",
          month: "long",
          year: "numeric"
        }
      );

    }


    // ==============================================
    // LOAD MAKLUMAN
    // ==============================================

    db.collection("makluman")

      .where(
        "status",
        "==",
        "aktif"
      )

      .orderBy(
        "createdAt",
        "desc"
      )

      .limit(3)

      .onSnapshot(

        snapshot => {

          maklumanLoading
            .classList.add("hidden");


          maklumanList.innerHTML = "";


          // ==========================================
          // TIADA MAKLUMAN
          // ==========================================

          if (snapshot.empty) {

            maklumanList
              .classList.add("hidden");

            maklumanEmpty
              .classList.remove("hidden");

            lucide.createIcons();

            return;

          }


          // ==========================================
          // ADA MAKLUMAN
          // ==========================================

          maklumanEmpty
            .classList.add("hidden");

          maklumanList
            .classList.remove("hidden");


          snapshot.forEach(
            doc => {

              const data =
                doc.data();


              const tarikh =
                formatTarikh(
                  data.tarikh
                );


              const penting =
                data.penting === true;


              const card =
                document.createElement(
                  "article"
                );


              card.className = `
                visible
                relative
                overflow-hidden
                rounded-[1.75rem]
                bg-white
                p-6
                soft-card
                transition
                hover:-translate-y-1
              `;


              card.innerHTML = `

                ${
                  penting
                    ? `
                      <div
                        class="
                          absolute
                          right-0
                          top-0
                          rounded-bl-2xl
                          bg-[#d99a26]
                          px-4
                          py-2
                          text-xs
                          font-bold
                          text-white
                        "
                      >
                        ★ PENTING
                      </div>
                    `
                    : ""
                }


                <div
                  class="
                    flex
                    items-center
                    gap-2
                    ${
                      penting
                        ? "pr-20"
                        : ""
                    }
                  "
                >

                  <span
                    class="
                      inline-flex
                      rounded-full
                      bg-[#eff8f3]
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      text-[#075e4c]
                    "
                  >
                    ${escapeHTML(
                      data.kategori ||
                      "Makluman"
                    )}
                  </span>

                </div>


                <h3
                  class="
                    mt-5
                    text-xl
                    font-bold
                    leading-snug
                    text-[#16332d]
                  "
                >
                  ${escapeHTML(
                    data.tajuk
                  )}
                </h3>


                <p
                  class="
                    mt-3
                    text-sm
                    leading-6
                    text-[#617a73]
                  "
                >
                  ${escapeHTML(
                    data.kandungan
                  )}
                </p>


                ${
                  tarikh
                    ? `
                      <div
                        class="
                          mt-5
                          flex
                          items-center
                          gap-2
                          border-t
                          border-[#e5eee9]
                          pt-4
                          text-xs
                          font-semibold
                          text-[#789089]
                        "
                      >

                        <i
                          data-lucide="calendar-days"
                          class="h-4 w-4"
                        ></i>

                        ${escapeHTML(
                          tarikh
                        )}

                      </div>
                    `
                    : ""
                }

              `;


              maklumanList
                .appendChild(card);

            }
          );


          // Render icon dalam card baharu
          lucide.createIcons();

        },


        // ==========================================
        // ERROR
        // ==========================================

        error => {

          console.error(
            "Load makluman portal error:",
            error
          );


          maklumanLoading
            .classList.add("hidden");

          maklumanList
            .classList.add("hidden");

          maklumanEmpty
            .classList.remove("hidden");


          maklumanEmpty.innerHTML = `

            <div
              class="
                mx-auto
                grid
                h-12
                w-12
                place-items-center
                rounded-2xl
                bg-red-50
                text-red-500
              "
            >

              <i
                data-lucide="triangle-alert"
                class="h-5 w-5"
              ></i>

            </div>


            <p
              class="
                mt-4
                font-bold
                text-[#16332d]
              "
            >
              Makluman tidak dapat dimuatkan.
            </p>


            <p
              class="
                mt-2
                text-sm
                text-[#617a73]
              "
            >
              Sila cuba semula sebentar lagi.
            </p>

          `;


          lucide.createIcons();

        }

      );

  }
);

// ==================================================
// MOTIVASI MINGGUAN
// LOAD MOTIVASI AKTIF DARI FIRESTORE
// ==================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const motivasiText =
      document.getElementById(
        "motivasi-text"
      );

    const motivasiDescription =
      document.getElementById(
        "motivasi-description"
      );

    const motivasiMinggu =
      document.getElementById(
        "motivasi-minggu"
      );


    // Jika bukan halaman yang mempunyai
    // seksyen Motivasi Mingguan
    if (
      !motivasiText ||
      !motivasiDescription ||
      !motivasiMinggu
    ) {

      return;

    }


    // ==============================================
    // FIREBASE
    // ==============================================

    const firebaseConfig = {

      apiKey:
        "AIzaSyA9R5jKqeJNvBHD-SIOuseAqyb_x909R3Q",

      authDomain:
        "bimbingankaunselingskkk.firebaseapp.com",

      projectId:
        "bimbingankaunselingskkk"

    };


    // Elakkan initialize dua kali
    if (!firebase.apps.length) {

      firebase.initializeApp(
        firebaseConfig
      );

    }


    const motivasiDb =
      firebase.firestore();


    // ==============================================
    // LOAD MOTIVASI AKTIF
    // ==============================================

    motivasiDb
      .collection("motivasi")
      .where(
        "status",
        "==",
        "aktif"
      )
      .limit(1)
      .onSnapshot(

        snapshot => {

          // Tiada motivasi aktif:
          // kekalkan teks asal sebagai fallback
          if (snapshot.empty) {

            console.log(
              "Tiada motivasi aktif."
            );

            return;

          }


          const data =
            snapshot.docs[0].data();


          // ==========================================
          // UPDATE HOMEPAGE
          // ==========================================

          if (data.teks) {

            motivasiText.textContent =
              `“${data.teks}”`;

          }


          if (data.penerangan) {

            motivasiDescription.textContent =
              data.penerangan;

          }


          if (data.minggu) {

            motivasiMinggu.textContent =
              data.minggu;

          }


          console.log(
            "Motivasi homepage berjaya dimuatkan:",
            data
          );

        },


        error => {

          console.error(
            "Load motivasi homepage error:",
            error
          );

        }

      );

  }
);

/* =========================================================
   PORTAL VISITOR COUNTER
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  try {

    if (typeof firebase === "undefined") {
      console.warn("Firebase belum tersedia untuk visitor counter.");
      return;
    }

    const visitorDb = firebase.firestore();

    const visitorRef =
      visitorDb.collection("stats").doc("visitors");

    visitorRef.set(
      {
        count: firebase.firestore.FieldValue.increment(1)
      },
      {
        merge: true
      }
    )
    .then(() => {
      console.log("Portal visitor count updated.");
    })
    .catch((error) => {
      console.error(
        "Gagal mengemaskini visitor counter:",
        error
      );
    });

  } catch (error) {

    console.error(
      "Visitor counter error:",
      error
    );

  }

});

/* =========================================================
   HEADER DATE & TIME
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  // ================= DESKTOP =================

  const desktopDate =
    document.getElementById("header-date");

  const desktopTime =
    document.getElementById("header-time");


  // ================= MOBILE =================

  const mobileDate =
    document.getElementById("mobile-header-date");

  const mobileTime =
    document.getElementById("mobile-header-time");


  // ================= UPDATE DATE & TIME =================

  function updateDateTime() {

    const now = new Date();


    // TARIKH MALAYSIA

    const formattedDate =
      new Intl.DateTimeFormat("ms-MY", {
        timeZone: "Asia/Kuala_Lumpur",
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).format(now);


    // MASA MALAYSIA

    const formattedTime =
      new Intl.DateTimeFormat("ms-MY", {
        timeZone: "Asia/Kuala_Lumpur",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).format(now);


    // ================= DESKTOP =================

    if (desktopDate) {
      desktopDate.textContent = formattedDate;
    }

    if (desktopTime) {
      desktopTime.textContent = formattedTime;
    }


    // ================= MOBILE =================

    if (mobileDate) {
      mobileDate.textContent = formattedDate;
    }

    if (mobileTime) {
      mobileTime.textContent = formattedTime;
    }

  }


  // PAPARKAN TERUS

  updateDateTime();


  // KEMASKINI SETIAP 1 SAAT

  setInterval(updateDateTime, 1000);

});

/* =========================================================
   MOBILE MENU ACCORDION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const accordionButtons =
    document.querySelectorAll(".mobile-accordion-btn");


  if (!accordionButtons.length) return;


  /* =====================================================
     CLOSE ALL ACCORDIONS
  ===================================================== */

  function closeAllAccordions(exceptButton = null) {

    accordionButtons.forEach((button) => {

      if (button === exceptButton) return;

      const targetName =
        button.dataset.mobileAccordion;

      const content =
        document.getElementById(
          `mobile-accordion-${targetName}`
        );

      const icon =
        button.querySelector(
          '[data-lucide="chevron-down"]'
        );


      // Tutup submenu

      if (content) {
        content.classList.add("hidden");
      }


      // Reset aria

      button.setAttribute(
        "aria-expanded",
        "false"
      );


      // Reset icon

      if (icon) {
        icon.classList.remove("rotate-180");
      }

    });

  }


  /* =====================================================
     ACCORDION CLICK
  ===================================================== */

  accordionButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const targetName =
        button.dataset.mobileAccordion;

      const content =
        document.getElementById(
          `mobile-accordion-${targetName}`
        );

      if (!content) return;


      const icon =
        button.querySelector(
          '[data-lucide="chevron-down"]'
        );


      const isOpen =
        button.getAttribute("aria-expanded") === "true";


      /* Tutup accordion lain */

      closeAllAccordions(button);


      /* ================= TUTUP ================= */

      if (isOpen) {

        content.classList.add("hidden");

        button.setAttribute(
          "aria-expanded",
          "false"
        );

        if (icon) {
          icon.classList.remove("rotate-180");
        }

        return;

      }


      /* ================= BUKA ================= */

      content.classList.remove("hidden");

      button.setAttribute(
        "aria-expanded",
        "true"
      );

      if (icon) {
        icon.classList.add("rotate-180");
      }

    });

  });

});
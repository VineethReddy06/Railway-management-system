function showPage(pageId) {
    document.querySelectorAll(".container > div").forEach((div) => {
      div.classList.add("hidden");
    });
    document.getElementById(pageId).classList.remove("hidden");
  }
  
  function generateCaptcha() {
    const captcha = Math.floor(1000 + Math.random() * 9000);
    document.getElementById("captchaText").textContent = captcha;
  }
  
  function register() {
    const username = document.getElementById("regUserId").value;
    const password = document.getElementById("regPassword").value;
    const email = document.getElementById("regEmail").value;
  
    fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        if (data.success) showPage("loginPage");
      });
  }
  
  function login() {
    const username = document.getElementById("loginUserId").value;
    const password = document.getElementById("loginPassword").value;
    const captchaInput = document.getElementById("captchaInput").value;
    const captchaText = document.getElementById("captchaText").textContent;
  
    if (captchaInput !== captchaText) {
      alert("CAPTCHA mismatch!");
      return;
    }
  
    fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          sessionStorage.setItem("user_id", data.user_id);
          showPage("stationSection");
        } else {
          alert(data.message);
        }
      });
  }
  
  function showTrainSelection() {
    showPage("trainSelectionSection");
  }
  
  function showCustomerDetails() {
    showPage("customerDetailsSection");
  }
  
  function showPaymentSection() {
    showPage("paymentSection");
    document.getElementById("ticketPrice").textContent = 500;
  }
  
  function processPayment() {
    const name = document.getElementById("customerName").value;
    const contact = document.getElementById("customerContact").value;
    const age = document.getElementById("customerAge").value;
    const trainId = document.getElementById("trainSelect").value;
  
    if (!name || !contact || !age || !trainId) {
      alert("Please fill in all details.");
      return;
    }
  
    fetch("/book_ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        contact,
        age,
        trainId
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementById("paymentSection").classList.add("hidden");
        document.getElementById("successMessage").classList.remove("hidden");
      } else {
        alert("Booking failed: " + data.message);
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Something went wrong.");
    });
  }
  
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("errorMessage");

  // login simples só para exemplo
  if (username === "ZTRCOMPANY" && password === "BANCOS") {
    localStorage.setItem("user", username);
    window.location.href = "dashboard.html";
  } else {
    errorMessage.textContent = "Usuário ou senha inválidos.";
  }
});

async function loadUsers() {
  try {
    const res = await fetch("https://6kg44fpj10.execute-api.eu-central-1.amazonaws.com/prod/users");
    const data = await res.json();
    document.getElementById("output").textContent = JSON.stringify(
      data,
      null,
      2
    );
  } catch (err) {
    document.getElementById("output").textContent = "Fehler: " + err.message;
  }
}

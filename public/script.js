async function loadUsers() {
  try {
    const res = await fetch("http://3.64.214.105:3000/users");
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

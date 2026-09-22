document.getElementById("health-btn").addEventListener("click", async () => {
  const result = document.getElementById("result");
  result.textContent = "Checking...";

  try {
    const res = await fetch("/api/health");
    const data = await res.json();
    result.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    result.textContent = "Error: " + err.message;
  }
});
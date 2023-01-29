const queryString = window.location.search
// Crée un objet URLSearchParams avec tous les paramètres de l'URL (ici orderId)
const urlParams = new URLSearchParams(queryString)
const orderId = urlParams.get("orderId")

document.getElementById("orderId").innerHTML = orderId
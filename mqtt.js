// mqtt.js
// ===============================
// Fonction d'affichage des logs
// ===============================
function addLog(message, type = "info") {
    const debugDiv = document.getElementById("debug-logs");
    if (!debugDiv) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const color = type === "error" ? "red" : type === "success" ? "green" : "black";
    const emoji = type === "error" ? "❌" : type === "success" ? "✅" : "ℹ️";
    
    const logLine = document.createElement("div");
    logLine.style.color = color;
    logLine.innerHTML = `${emoji} [${timestamp}] ${message}`;
    debugDiv.appendChild(logLine);
    
    // Scroll vers le bas
    debugDiv.parentElement.scrollTop = debugDiv.parentElement.scrollHeight;
}

// ===============================
// Vérification de la CDN MQTT
// ===============================
if (typeof mqtt === "undefined") {
    addLog("ERREUR: La librairie MQTT n'a pas été chargée!", "error");
    console.error("❌ ERREUR: La librairie MQTT n'a pas été chargée!");
    alert("❌ ERREUR: La librairie MQTT n'a pas été chargée!\nVérifiez votre connexion Internet.");
} else {
    addLog("Librairie MQTT chargée correctement", "success");
    console.log("✅ Librairie MQTT chargée correctement");
}

// ===============================
// Connexion au broker HiveMQ
// ===============================

const broker = "wss://cd379a37302e44a395cfcdec341addf8.s1.eu.hivemq.cloud:8884/mqtt";
const client = mqtt.connect(broker);

// ===============================
// Connexion
// ===============================
client.on("connect", () => {
    addLog("Connecté au broker MQTT", "success");
    console.log("✅ Connecté au broker MQTT");
    if (document.getElementById("status")) {
        document.getElementById("status").innerText = "✅ Connecté au broker";
    }

    client.subscribe("reservoir/cmd");
    client.subscribe("reservoir/notify");
    client.subscribe("reservoir/status"); 
    client.subscribe("reservoir/lwt");
});

// Gestion des erreurs
client.on("error", (err) => {
    addLog("Erreur MQTT: " + err.message, "error");
    console.error("❌ Erreur MQTT:", err);
    if (document.getElementById("status")) {
        document.getElementById("status").innerText = "❌ Erreur connexion: " + err.message;
    }
});

client.on("disconnect", () => {
    addLog("Déconnecté du broker MQTT", "error");
    console.log("⚠️ Déconnecté du broker MQTT");
    if (document.getElementById("status")) {
        document.getElementById("status").innerText = "⚠️ Déconnecté";
    }
});

// ===============================
// Réception des messages
// ===============================
client.on("message", (topic, message) => {
    const msg = message.toString();
    // console.log(topic + " : " + msg);

    // Mise à jour UI (si éléments présents)
    let el1 = document.getElementById("status");
    if (topic === "reservoir/status" && el1) {
        el1.innerText = msg + " %";
    }

    let notif = document.getElementById("notify");
    if (topic === "reservoir/notify" && notif) {
        notif.innerText = msg;
    }

    // Historique (localStorage)
    let historique = JSON.parse(localStorage.getItem("historique")) || [];
    historique.push({
        date: new Date().toLocaleString(),
        topic: topic,
        valeur: msg
    });
    localStorage.setItem("historique", JSON.stringify(historique));
});
// ===============================
// Envoi de commande
// ==============================
function sendCommande(cmd) {
    if (!client.connected) {
        addLog("Non connecté au broker MQTT!", "error");
        console.error("❌ Non connecté au broker MQTT!");
        alert("Erreur: Non connecté au broker MQTT");
        return;
    }
    
    client.publish("reservoir/cmd", cmd, (err) => {
        if (err) {
            addLog("Erreur d'envoi: " + err.message, "error");
            console.error("❌ Erreur d'envoi:", err);
            alert("Erreur d'envoi: " + err.message);
        } else {
            addLog("Commande envoyée: " + cmd, "success");
            console.log("✅ Commande envoyée avec succès:", cmd);
        }
    });
}
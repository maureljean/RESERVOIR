// mqtt.js
// ===============================
// Connexion au broker HiveMQ
// ===============================

const broker = "wss://broker.hivemq.com:8884/mqtt";
const client = mqtt.connect(broker);

// ===============================
// Connexion
// ===============================
client.on("connect", () => {
    console.log("✅ Connecté au broker MQTT");

    client.subscribe("reservoir/cmd");
    client.subscribe("reservoir/notify");
    client.subscribe("reservoir/status");
    client.subscribe("reservoir/lwt");

});

// ===============================
// Réception des messages
// ===============================
client.on("message", (topic, message) => {
    const msg = message.toString();
    // console.log(topic + " : " + msg);
    let texte = " ";
});
// ===============================
// Envoi de commande
// ===============================
function sendCommande(topic, valeur) {
    client.publish(topic, valeur);
    console.log("Commande envoyée :", topic, valeur);}

    
    // Mise à jour UI (si éléments présents)
    // let el1 = document.getElementById("niveau1");
    // if (topic === "reservoir/niveau1" && el1) {
    //     el1.innerText = msg + " %";
    // }

    // let el2 = document.getElementById("niveau2");
    // if (topic === "reservoir/niveau2" && el2) {
    //     el2.innerText = msg + " %";
    // }

    // let notif = document.getElementById("notification");
    // if (topic === "reservoir/notification" && notif) {
    //     notif.innerText = msg;
    if (msg === "V1") texte = " EV1 ouvert";
    else if (msg ==="V2") texte = " EV1 fermé";
    else if( msg === "F1") texte = " EV2 ouvert";
    else if (msg === "F2") texte = " EV2 fermé ";

    document.getElementById(status).innerText = texte;

    // ===============================
    // Historique (localStorage)
    // ===============================
    let historique = JSON.parse(localStorage.getItem("historique")) || [];

    historique.push({
        date: new Date().toLocaleString(),
        topic: topic,
        valeur: msg
    });

    localStorage.setItem("historique", JSON.stringify(historique));

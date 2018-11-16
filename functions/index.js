//Cloud Functions: firebase deploy --only functions

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firestore);

const firestoreDB = admin.firestore();

function getStatusDescription(status) {
    let statusDescription = "";

    switch (status) {
        case "detached":
            statusDescription = "Sem inquilino associado";
            break;
        case "rejected":
            statusDescription = "Inquilino rejeitou o contrato";
            break;
        case "pending":
            statusDescription = "Possui inquilino associado mas não confirmou contrato";
            break;
        case "confirmed":
            statusDescription = "Possui inquilino associado e confirmado";
            break;
        case "ended":
            statusDescription = "Prazo concluído";
            break;
        case "revoked":
            statusDescription = "Contrato revogado";
            break;
        default:
            statusDescription = "Sem status";
            break;
    }
    return statusDescription;
}


exports.createRealEstateHistory = functions.firestore.document('RealEstate/{wildcard}')
    .onCreate((snap, context) => {
        if (snap.data() === null) return null;

        const newValue = snap.data();
        const dateTime = Number(new Date());
        let json = `{"${dateTime}":{
                    "title": "Novo imóvel adicionado",
                    "description": "${newValue.name}",
                    "datetime": ${dateTime},
                    "type": "RealEstate",
                    "action": null 
                }}`;

        let newData = JSON.parse(json);

        let historyCollectionRef = firestoreDB.collection('History').doc(newValue.ownerId);

        return historyCollectionRef.set(newData, { merge: true }).then(() => {
            return console.log('Novo imóvel adicionado ao histórico.', newValue.ownerId)
        });

    });

exports.createContractHistory = functions.firestore.document('Contract/{wildcard}')
    .onCreate((snap, context) => {
        if (snap.data() === null) return null;

        const newValue = snap.data();

        const dateTime = Number(new Date());
        let json = `{"${dateTime}":{
                    "title": "Novo contrato adicionado",
                    "description": "Data inicio ${ (new Date(newValue.beginDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })) } - Data final ${(new Date(newValue.endDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }))} - ${getStatusDescription(newValue.status)}",
                    "datetime": ${dateTime},
                    "type": "Contract",
                    "action": null 
                }}`;
        let newData = JSON.parse(json);

        let historyCollectionRef = firestoreDB.collection('History').doc(newValue.ownerId);

        return historyCollectionRef.set(newData, { merge: true }).then(() => {
            if (newValue.tenantId) {
                let notificationsCollectionRef2 = firestoreDB.collection('Notification').doc(newValue.tenantId);
                
                let json = `{"${dateTime}":{
                    "active": true,
                    "datetime": ${dateTime},
                    "type": "Contract",
                    "action": { "id": "${context.params.wildcard}", "show": "contractConfirmation", "title": "Confirme os dados do contrato" }
                }}`;
                newData = JSON.parse(json);

                return notificationsCollectionRef2.set(newData, { merge: true }).then(() => {
                    return console.log('Novo contrato adicionado ao histórico do dono e notificacao ao inquilino.', newValue.ownerId);
                })

            } else {
                return console.log('Novo contrato adicionado ao histórico do dono.', newValue.ownerId);
            }
        });
    });

exports.createContractHistoryUpdate = functions.firestore.document('Contract/{wildcard}')
    .onUpdate((change, context) => {
        if (change.after.data() === null) return null;

        let newData;
        const previousValue = change.before.data();
        const newValue = change.after.data();

        if (previousValue.status !== newValue.status) {
            
            const dateTime = Number(new Date());
            let json = `{"${dateTime}":{
                        "title": "Status de contrato atualizado",
                        "description": "Mudança de status, de ${getStatusDescription(previousValue.status)} para ${getStatusDescription(newValue.status)}",
                        "datetime": ${dateTime},
                        "type": "Contract",
                        "action": null 
                    }}`;
            newData = JSON.parse(json);

        } else {
            return null;
        }

        let historyCollectionRef = firestoreDB.collection('History').doc(newValue.ownerId);

        return historyCollectionRef.set(newData, { merge: true }).then(() => {
            if (newValue.tenantId) {
                let historyCollectionRef2 = firestoreDB.collection('History').doc(newValue.tenantId);

                return historyCollectionRef2.set(newData, { merge: true }).then(() => {
                    return console.log('Contrato atualizado ao histórico do dono e inquilino.', newValue.ownerId);
                })

            } else {
                return console.log('Contrato atualizado ao histórico do dono.', newValue.ownerId);
            }
        });

    });

exports.createNewUserHistory = functions.auth.user().onCreate((user) => {

    const dateTime = Number(new Date());
    let json = `{"${dateTime}":{
                "title": "Seja bem-vindo!",
                "description": "Você se cadastrou no Inquilio App",
                "datetime": ${dateTime},
                "type": "User",
                "action": null 
            }}`;

    let newData = JSON.parse(json);            

    let historyCollectionRef = firestoreDB.collection('History').doc(user.uid);

    return historyCollectionRef.set(newData, { merge: true }).then(() => {
        return console.log('Novo usuário cadastrado.', user.uid)
    });
});    
//Cloud Functions: firebase deploy --only functions

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firestore);

const firestoreDB = admin.firestore();

function getStatusDescription(status) {
    switch (status) {
        case "detached": return "Sem inquilino associado";
        case "rejected": return "Rejeitado pelo inquilino";
        case "pending": return "Inquilino associado, mas não confirmado";
        case "confirmed": return "Inquilino associado e confirmado";
        case "ended": return "Prazo concluído";
        case "revoked": return "Rescindido";
        default: return "Sem status";
    }
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
        let json = 
`{"${dateTime}":{"title": "Novo contrato adicionado","description": "Início: ${ (new Date(newValue.beginDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }))}\\nFim: ${(new Date(newValue.endDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }))}\\n\\nSituação atual:\\n${getStatusDescription(newValue.status)}",
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
                    "action": { "id": "${context.params.wildcard}", "show": "contractConfirmation", "title": "Confirmar contrato" }
                }}`;
                newData = JSON.parse(json);

                return notificationsCollectionRef2.set(newData, { merge: true }).then(() => {
                    return console.log('Novo contrato adicionado ao histórico do dono e notificação ao inquilino.', newValue.ownerId);
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
                        "title": "Contrato atualizado",
                        "description": "Situação anterior:\\n${getStatusDescription(previousValue.status)}\\n\\nSituação atual:\\n${getStatusDescription(newValue.status)}",
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
                "title": "Seja bem-vind@!",
                "description": "Você se cadastrou no Inquilio",
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

// https://cron-job.org - Scheduled execution
exports.checkContractsForEvaluation = functions.https.onRequest((req, res) => {

    var contractsRef = firestoreDB.collection('Contract');
    var query = contractsRef
        .where('tenantId', '>', '')
        .where('status', '==', 'confirmed')
        .where('active', '==', true).get()
        .then(snapshot => {
            const dateTime = Number(new Date());
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());

                let notificationsCollectionRef2 = firestoreDB.collection('Notification').doc(doc.data().ownerId);

                let json = `{"${dateTime}":{
                        "active": true,
                        "datetime": ${dateTime},
                        "type": "EvaluationPending",
                        "action": { "id": "${doc.data().tenantId}", "show": "tenantEvaluation", "title": "Avaliar Inquilino" }
                    }}`;
                newData = JSON.parse(json);

                notificationsCollectionRef2.set(newData, { merge: true }).then(() => {
                    return console.log('Nova notificação inserida ao inquilino.', doc.data().ownerId);
                }).catch(err => {
                    console.log('Error inserindo notificacao', err);
                    throw new Error("Error inserindo notificacao");
                });
            });
            res.redirect(200);
            return true;
        })
        .catch(err => {
            console.log('Error buscando contrato', err);
            throw new Error("Error buscando contrato");
        });
});


exports.createScoreHistory = functions.firestore.document('Score/{wildcard}')
    .onCreate((snap, context) => {
        if (snap.data() === null) return null;

        const newValue = snap.data();
        const dateTime = Number(new Date());
        let tenant;

        let tenantRef = firestoreDB.collection('tenantAccount').doc(newValue.tenantId);
        return tenantRef.get()
            .then(doc => {
                if (doc.exists) {
                    tenant = doc.data();
                    let json = `{"${dateTime}":{
                        "title": "Avaliação realizada",
                        "description": "Inquilino avaliado:\\n${tenant.name}",
                        "datetime": ${dateTime},
                        "type": "EvaluationDone",
                        "action": null 
                    }}`;

                    let newData = JSON.parse(json);

                    let historyCollectionRef = firestoreDB.collection('History').doc(newValue.ownerId);

                    return historyCollectionRef.set(newData, { merge: true }).then(() => {
                        return console.log('Novo score adicionado ao histórico.', newValue.ownerId)
                    });

                } 
                return true;
            })
            .catch(err => {
                console.log('Error tenant:', err);
            });
    });
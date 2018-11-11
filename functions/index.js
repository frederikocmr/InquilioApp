//Cloud Functions: firebase deploy --only functions

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firestore);

const firestoreDB = admin.firestore();

function getStatusDescription(status) {
    let statusDescription = "";

    switch (status) {
        case "detached":
            statusDescription = "Sem inquilino associado.";
            break;
        case "pending":
            statusDescription = "Possui inquilino associado mas não confirmou contrato.";
            break;
        case "confirmed":
            statusDescription = "Possui inquilino associado e confirmado.";
            break;
        case "ended":
            statusDescription = "Prazo concluído.";
            break;
        case "revoked":
            statusDescription = "sem inquilino associado";
            break;
        default:
            statusDescription = "sem status";
            break;
    }
    return statusDescription;
}


exports.createRealEstateHistory = functions.firestore.document('RealEstate/{wildcard}')
    .onCreate((snap, context) => {
        if (snap.data() === null) return null;

        const newValue = snap.data();
        let newData = {
            title: 'Novo imóvel adicionado',
            description: newValue.name,
            datetime: Number(new Date()),
            type: 'RealEstate'
        };

        let historyCollectionRef = firestoreDB.collection('History').doc(newValue.ownerId);

        return historyCollectionRef.update({
            HistoryArray: admin.firestore.FieldValue.arrayUnion(newData)
        }).then(() => {
            return console.log('Novo imóvel adicionado ao histórico.', newValue.ownerId)
        })

    });

exports.createContractHistory = functions.firestore.document('Contract/{wildcard}')
    .onCreate((snap, context) => {
        if (snap.data() === null) return null;

        const newValue = snap.data();

        let newData = {
            title: 'Novo contrato adicionado',
            description: ('Duração de ' + newValue.duration +
                "\n" + getStatusDescription(newValue.status)),
            datetime: Number(new Date()),
            type: 'Contract',
            action: null
        };

        let historyCollectionRef = firestoreDB.collection('History').doc(newValue.ownerId);

        return historyCollectionRef.update({
            HistoryArray: admin.firestore.FieldValue.arrayUnion(newData)
        }).then(() => {
            if (newValue.tenantId) {
                let historyCollectionRef2 = firestoreDB.collection('History').doc(newValue.tenantId);

                newData.title = 'Contrato com confirmação pendente';
                newData.description = 'Vá até seus contratos para confirmar o vínculo';
                newData.action = {id: context.params.wildcard, show: 'contractConfirmation', title:'Confirme os dados do contrato'};

                return historyCollectionRef2.update({
                    HistoryArray: admin.firestore.FieldValue.arrayUnion(newData)
                }).then(() => {
                    return console.log('Novo contrato adicionado ao histórico do dono e inquilino.', newValue.ownerId);
                })
            } else {
                return console.log('Novo contrato adicionado ao histórico do dono.', newValue.ownerId);
            }
        })

    });

exports.createNewUserHistory = functions.auth.user().onCreate((user) => {

    let newData = {
        title: 'Seja bem-vindo!',
        description: 'Você se cadastrou no app',
        datetime: Number(new Date()),
        type: 'User'
    };

    let historyCollectionRef = firestoreDB.collection('History').doc(user.uid);

    return historyCollectionRef.get()
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
                return historyCollectionRef.update(
                    {
                        HistoryArray: admin.firestore.FieldValue.arrayUnion(newData)
                    }
                ).then(() => {
                    return console.log('Novo usuário cadastrado.', user.uid)
                })
            } else {
                return historyCollectionRef.set(
                    {
                        HistoryArray: admin.firestore.FieldValue.arrayUnion(newData)
                    }
                ).then(() => {
                    return console.log('Novo usuário cadastrado.', user.uid)
                })
            }
        });
});    
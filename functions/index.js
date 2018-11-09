//Cloud Functions: firebase deploy --only functions

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firestore);

const firestoreDB = admin.firestore();

exports.createRealEstateHistory = functions.firestore.document('RealEstate/{wildcard}')
    .onCreate((snap, context) => {
        if (snap.data() === null) return null;

        const newValue = snap.data();
        let newData = {
            title: 'Novo imóvel adicionado',
            description: newValue.name,
            datetime: + new Date(),
            type: 'RealEstate'
        };

        let historyCollectionRef = firestoreDB.collection('History').doc(newValue.ownerId);

        return historyCollectionRef.update({
            HistoryArray: admin.firestore.FieldValue.arrayUnion(newData)
        }).then(() => {
            return console.log('Novo imóvel adicionado ao histórico', newValue.ownerId)
        })

    });

exports.createContractHistory = functions.firestore.document('Contract/{wildcard}')
    .onCreate((snap, context) => {
        if (snap.data() === null) return null;

        const newValue = snap.data();
        let newData = {
            title: 'Novo contrato adicionado',
            description: 'Duração de ' + newValue.duration,
            datetime: + new Date(),
            type: 'Contract'
        };

        let historyCollectionRef = firestoreDB.collection('History').doc(newValue.ownerId);

        return historyCollectionRef.update({
            HistoryArray: admin.firestore.FieldValue.arrayUnion(newData)
        }).then(() => {
            return console.log('Novo contrato adicionado ao histórico', newValue.ownerId)
        })

    });

exports.createNewUserHistory = functions.auth.user().onCreate((user) => {

    let newData = {
        title: 'Seja bem-vindo!',
        description: 'Você se cadastrou no app',
        datetime: + new Date(),
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
                    return console.log('Novo usuário cadastrado', user.uid)
                })
            } else {
                return historyCollectionRef.set(
                    {
                        HistoryArray: admin.firestore.FieldValue.arrayUnion(newData)
                    }
                ).then(() => {
                    return console.log('Novo usuário cadastrado', user.uid)
                })
            }
        });
});    
//firebase deploy --only functions
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firestore);

const firestoreDB = admin.firestore();

exports.createRealEstateHistory = functions.firestore.document('RealEstate/{wildcard}')
    .onCreate((snap, context) => {
        if (snap.data() === null) return null;

        const newValue = snap.data();
        let newData = {
            title: 'Adicionado novo imóvel',
            description: 'Nome:' + newValue.name,
            datetime: + new Date(),
            type: 'RealEstate'
        };
        
        let historyCollectionRef = firestoreDB.collection('History').doc(newValue.ownerId);
        

        return historyCollectionRef.get()
            .then((docSnapshot) => {
                if (docSnapshot.exists) {
                    // TODO: Ao invés de criar nesting promises, fazer um cadastro inicial ao criar conta, e aqui só fazer update...
                    return historyCollectionRef.update(
                        {
                            HistoryArray: admin.firestore.FieldValue.arrayUnion(newData)
                        }
                    ).then(() => {
                        return console.log('Adicionado novo imóvel ao histórico', newValue.ownerId)
                    })
                    // ...
                } else {
                    return historyCollectionRef.set(
                        {
                            HistoryArray: admin.firestore.FieldValue.arrayUnion(newData)
                        }
                    ).then(() => {
                        return console.log('Adicionado novo imóvel ao histórico', newValue.ownerId)
                    })
                }
            });

    });

exports.createContractHistory = functions.firestore.document('Contract/{wildcard}')
    .onCreate((snap, context) => {
        if (snap.data() === null) return null;

        const newValue = snap.data();
        let newData = {
            title: 'Adicionado novo contrato',
            description: 'Duração: '  + newValue.duration,
            datetime: + new Date(),
            type: 'Contract'
        };

        let historyCollectionRef = firestoreDB.collection('History').doc(newValue.ownerId);

        return historyCollectionRef.get()
            .then((docSnapshot) => {
                if (docSnapshot.exists) {
                    return historyCollectionRef.update(
                        {
                            HistoryArray: admin.firestore.FieldValue.arrayUnion(newData)
                        }
                    ).then(() => {
                        return console.log('Adicionado novo contrato ao histórico', newValue.ownerId)
                    })
                } else {
                    return historyCollectionRef.set(
                        {
                            HistoryArray: admin.firestore.FieldValue.arrayUnion(newData)
                        }
                    ).then(() => {
                        return console.log('Adicionado novo contrato ao histórico', newValue.ownerId)
                    })
                }
            });

    });    
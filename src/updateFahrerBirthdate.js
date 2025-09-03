const { db } = require('./firebase-config');
const { collection, getDocs, updateDoc, doc, writeBatch } = require('firebase/firestore');

const updateFahrerBirthdate = async () => {
  const fahrerCollection = collection(db, 'fahrer');
  const fahrerSnapshot = await getDocs(fahrerCollection);

  const batch = writeBatch(db);

  fahrerSnapshot.forEach((docSnapshot) => {
    const data = docSnapshot.data();
    if (data.geburtsort) {
      const fahrerDoc = doc(db, 'fahrer', docSnapshot.id);
      batch.update(fahrerDoc, {
        birthdate: data.geburtsort,
        geburtsort: null, // Optionally remove the old field
      });
    }
  });

  await batch.commit();
  console.log('Updated all documents in the fahrer collection.');
};

updateFahrerBirthdate().catch(console.error);

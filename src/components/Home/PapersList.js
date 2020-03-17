import React from 'react'
import { firestoreDB } from '../Firebase/firebase';

function PapersList() {

    const papersDB = firestoreDB.collection('papers').get().then((snapshot) => {
        snapshot.docs.forEach(doc =>{
            console.log(doc)
        })
    })

    // firestoreDB.collection("papers")
    // .get()
    // .then(querySnapshot => {
    // const data = querySnapshot.docs.map(doc => doc.data());
    // console.log(data); // array of cities objects
    // });

    // const names = ['Bruce', 'Clark']
    // const nameList = names.map(name => <h3>{name}</h3>)

    return (
        <div>
            {/* {nameList} */}
        </div>
    )
}

export default PapersList;
  
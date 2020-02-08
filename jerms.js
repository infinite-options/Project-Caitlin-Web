const admin = require('firebase-admin');
const functions = require('firebase-functions');

let serviceAccount = require('./ServiceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
let db = admin.firestore();

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.SetUserInfo = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const UserId = req.get('UserId').toString()
  const UserFirstName = req.get('UserFirstName').toString()
  const UserLastName = req.get('UserLastName').toString()

  let data = {
    first_name: UserFirstName,
    last_name: UserLastName
    }
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  let snapshot = db.collection('users').doc(UserId).set(data)
  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  res.redirect(303, "success");
});

exports.CompleteTaskStep = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const userId = req.get('userId').toString()
  const routineId = req.get('routineId').toString()
  const taskId = req.get('taskId').toString()
  const stepNumber = parseInt(req.get('stepNumber'))

  let task = db.collection('users').doc(userId).collection('routines').doc(routineId).collection('tasks').doc(taskId);
  let getTaskDoc = task.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        var steps = doc.data();
        steps.steps[stepNumber].status = 'Complete'

        let setStepComplete = task.set(steps);
      }
      return routineId;
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
  // let user = db.collection('user').doc(userId);
  // let getUserDoc = user.get()
  //   .then(doc => {
  //     if (!doc.exists) {
  //       console.log('No such document!');
  //     } else {
  //       var userFields = doc.data();
  //       routineId = userFields.routine_ids['Get Ready']
  //     }
  //     return routineId;
  //   })
  //   .catch(err => {
  //     console.log('Error getting document', err);
  //   });
  //
  // let routine = user.collection('Routines').doc('YuLBjqCty4aHNA29f8f0')
  // let getRoutineDoc = routine.get()
  //   .then(doc => {
  //     if (!doc.exists) {
  //       console.log('No such document!');
  //     } else {
  //       var routineFields = doc.data();
  //       taskId = userFields.task_ids['Brush Teeth']
  //     }
  //     return;
  //   })
  //   .catch(err => {
  //     console.log('Error getting document', err);
  //   });
  //
  // let task = routine.collection('tasks').doc('elmSynKLyGpU9XxhE8Vp')
  // let getTaskDoc = task.get()
  //   .then(doc => {
  //     if (!doc.exists) {
  //       console.log('No such document!');
  //     } else {
  //       var steps = doc.data();
  //       steps[stepNumber].status = 'Complete'
  //       console.log('steps: ', steps);
  //
  //       let setStepComplete = task.set(steps);
  //     }
  //     return;
  //   })
  //   .catch(err => {
  //     console.log('Error getting document', err);
  //   });
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  res.redirect(303, "success");
});

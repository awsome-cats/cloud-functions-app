const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();



// auth trigger (new user signup)
// functionsはログに残せる
// ユーザーアカウントが作成されたログを残す
// exports.newUserSignup = functions.auth.user().onCreate((user) => {
//   console.log('user created', user.email, user.uid)
// })

// exports.userDeleted = functions.auth.user().onDelete((user) => {
//   console.log('user deleted', user.email, user.uid)
// })


exports.newUserSignup = functions.auth.user().onCreate((user) => {
  return admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    upvotedOn: []
  })
})

exports.userDeleted = functions.auth.user().onDelete((user) => {
  const doc = admin.firestore().collection('users').doc(user.uid)
  return doc.delete()
})

// http callable function (adding request)
exports.addRequest = functions.https.onCall((data, context) => {
  // not login
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated',
    '認証されたアカウントのみの機能です')
  }
  if (data.text.length > 10) {
    throw new functions.https.HttpsError('invalid-argument',
    'リクエストは10文字までにしてください')
  }
  return admin.firestore().collection('requests').add({
    text: data.text,
    upvotes:0,
  })
})

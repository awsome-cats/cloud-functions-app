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
// context: 認証状態をチェックできる
// frontからデータを受け取れる
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

// await asyncに変更する
// 最初のコードはコメントアウトする

exports.upvote = functions.https.onCall(async (data, context) => {
  // check auth state
  if(!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      '認証されたアカウントのみの機能です'
    )
  }
  // get refs for user doc & request doc
  const user = admin.firestore().collection('users').doc(context.auth.uid);
  const request = admin.firestore().collection('requests').doc(data.id)
  const doc = await user.get();
    if (doc.data().upvotedOn.includes(data.id)) {
      throw new functions.https.HttpsError(
        'failed-precondition', '投票できるのは一回です'
      )
    }
    // userのupdateとrequestのupdate
    //data.idを含めたい -vue.js側でidを取得したい
    // eslint-disable-next-line promise/no-nesting
    await user.update({upvotedOn: [...doc.data().upvotedOn, data.id]})
    return request.update({upvotes: admin.firestore.FieldValue.increment(1)})
   
})

// exports.upvote = functions.https.onCall((data, context) => {
//   // check auth state
//   if(!context.auth) {
//     throw new functions.https.HttpsError(
//       'unauthenticated',
//       '認証されたアカウントのみの機能です'
//     )
//   }
//   // get refs for user doc & request doc
//   const user = admin.firestore().collection('users').doc(context.auth.uid);
//   const request = admin.firestore().collection('requests').doc(data.id)
//   return user.get().then((doc) => {
//     if (doc.data().upvotedOn.includes(data.id)) {
//       throw new functions.https.HttpsError(
//         'failed-precondition', '投票できるのは一回です'
//       )
//     }
//     // userのupdateとrequestのupdate
//     //data.idを含めたい -vue.js側でidを取得したい
//     // eslint-disable-next-line promise/no-nesting
//     return user.update({upvotedOn: [...doc.data().upvotedOn, data.id]})
//     .then(() => {
//       return request.update({upvotes: admin.firestore.FieldValue.increment(1)})
//     });
//   })
// })

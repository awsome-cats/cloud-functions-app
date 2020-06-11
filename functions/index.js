const functions = require('firebase-functions');

// 1.http request

exports.randomNumber = functions.https.onRequest((request, response) => {
  const number = Math.round(Math.random() * 100);
  console.log(number)
  response.send(number.toString())

});

exports.toTheDojo = functions.https.onRequest((request, response) => {
  response.redirect('https://www.thenetninja.co.uk')

});

// 2.http callable function
// 応答を返すだけ
exports.sayHello = functions.https.onCall((data, context) => {
  const name = data.name
  return `hello, ${name}`;
})


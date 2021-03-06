
const authSwitchLinks = document.querySelectorAll('.switch');
const authModals = document.querySelectorAll('.auth .modal');
const authWrapper = document.querySelector('.auth');
const registerForm = document.querySelector('.register')
const loginForm = document.querySelector('.login')
const signOut = document.querySelector('.sign-out')

// toggle auth modals
authSwitchLinks.forEach((link) => {
  link.addEventListener('click', () => {
    authModals.forEach((modal) => {
      modal.classList.toggle('active')
    });
  });
});

// registerForm: formタグのclass


registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = registerForm.email.value
  const password = registerForm.password.value
  // console.log(email, password)
  // firebase auth
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((user) => {
    console.log('result',user)
    registerForm.reset();
  })
  .catch(error => {
    console.log(error)
    registerForm.querySelector('.error').textContent = error.message
  })
})


// LoginForm: formタグのclass

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginForm.email.value
  const password = loginForm.password.value
  
  // firebase auth
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((user) => {
    console.log('loggedIn',user)
    loginForm.reset();
  })
  .catch(error => {
    console.log(error)
    loginForm.querySelector('.error').textContent = error.message
  })
})

signOut.addEventListener('click', () => {
  firebase.auth().signOut()
  .then(() => {
    console.log('sign out')
  })
})


// auth listener userがtrue/false
// 1.open classを削除して、displayをnoneにする
// 2.最初のmodalからactiveを削除
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log(user)
    authWrapper.classList.remove('open');
    authModals.forEach(modal => modal.classList.remove('active'));
  } else {
    authWrapper.classList.add('open');
    authModals[0].classList.add('active');
   }
});

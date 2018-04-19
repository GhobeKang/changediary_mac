<template>
  <f7-login-screen>
    <f7-view>
      <f7-page login-screen>
        <f7-login-screen-title>Log-in</f7-login-screen-title>
        <f7-list form>
          <f7-list-item>
            <f7-label>Username</f7-label>
            <f7-input type="text" id="email_login" placeholder="write your e-mail address"></f7-input>
          </f7-list-item>
          <f7-list-item>
            <f7-label>Password</f7-label>
            <f7-input type="password" id="passwd_login" placeholder="write your password"></f7-input>
          </f7-list-item>
        </f7-list>
        <f7-list>
          <f7-list-button @click="chkAccount" back href="">Sign In</f7-list-button>
          <f7-list-button href="/register/">Register Account</f7-list-button>
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-login-screen>
</template>

<script>
  import firebase from '../../assets/js/firebaseInit'
  var $$ = window.Dom7
  var myApp = new window.Framework7()

  export default {
    methods: {
      chkAccount: function () {
        var auth = firebase.initNode.auth()
        var email = $$('#email_login').val()
        var pass = $$('#passwd_login').val()
        auth.signInWithEmailAndPassword(email, pass)
          .then((user) => {
            if (user) {
              window.userId = user.email
              myApp.alert('welcome ' + user.email, 'success!', function () {
                window.f7.mainView.router.back(window.f7.mainView, {url: '/'})
              })
            }
          })
          .catch(function (error) {
            if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password') {
              myApp.alert('wrong entered a e-mail or password, please check it out again')
            }
          })
      }
    }
  }
</script>

<template>
  <f7-login-screen>
    <f7-view>
      <f7-page login-screen>
        <f7-login-screen-title>My App</f7-login-screen-title>
        <f7-list form>
          <f7-list-item>
            <f7-label>E-mail Address</f7-label>
            <f7-input id="emailAddr" type="text" placeholder="Your username"></f7-input>
          </f7-list-item>
          <f7-list-item>
            <f7-label>Password</f7-label>
            <f7-input id="paswd" type="password" placeholder="Your password"></f7-input>
          </f7-list-item>
          <f7-list-item>
            <f7-label>Password check</f7-label>
            <f7-input id="paswdchk" type="password" placeholder="Your password again"></f7-input>
          </f7-list-item>
        </f7-list>
        <f7-list>
          <f7-list-button @click="registerAccount">Register</f7-list-button>
          <f7-list-button @click="returnPrivious">Cancel</f7-list-button>
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-login-screen>
</template>

<script>
  import firebase from '../../assets/js/firebaseInit'
  var $$ = window.Dom7

  export default {
    methods: {
      returnPrivious: function (ev) {
        window.f7.mainView.router.back()
      },
      registerAccount: function (ev) {
        var auth = firebase.initNode.auth()
        auth.onAuthStateChanged((user) => {
          if (user) {
            auth.setPersistence(auth.Auth.Persistence.LOCAL)
          }
        })
        var email = $$('#emailAddr').val()
        var passwd = $$('#paswd').val() === $$('#paswdchk').val() ? $$('#paswd').val() : null
        auth.createUserWithEmailAndPassword(email, passwd)
          .then(function (user) {
            window.userId = user.email
            firebase.initNode.database().ref('/users/' + user.uid).set({email: user.email})
              .then(function () {
                window.f7.alert('Account is created successfully!', 'Done', function () {
                  window.f7.mainView.router.loadPage('#initpage')
                })
              })
          })
      }
    }
  }
</script>

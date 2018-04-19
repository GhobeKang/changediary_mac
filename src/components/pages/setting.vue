<template>
  <f7-page>
    <f7-list>
      <f7-list-group>
        <f7-list-item>
          <div class="imageOverlay">
            <img id="profilePhoto" src="../../assets/img/cherry-blossom.png" class="img-circle img-responsive center-block" @click="changeProfile">
            <img id="overlayImg" src="../../assets/img/profile_change.png">
          </div>
        </f7-list-item>
        <f7-list-item :after="userId" title="Your Id"></f7-list-item>
        <f7-list-item smart-select :smart-select-params="smartSelectObj" title="Languages">
          <select name="language" v-model="lan">
            <option value="kr" selected>KOREAN</option>
            <option value="en">ENGLISH</option>
            <option value="jp">JAPANESE</option>
          </select>
        </f7-list-item>
        <f7-list-item>
          <span>Random Mode</span>
          <label class="toggle">
            <input type="checkbox" v-model="randomMode">
            <span class="toggle-icon"></span>
          </label>
        </f7-list-item>
        <f7-list-item title="Delete Account"></f7-list-item>
      </f7-list-group>

      <f7-list-group id="savebtn_wrap">
        <f7-list-button @click="saveSetting">Save Setting</f7-list-button>
      </f7-list-group>
    </f7-list>
  </f7-page>
</template>

<script>
  import firebase from '../../assets/js/firebaseInit'
  import 'vue-croppa/dist/vue-croppa.css'

  export default {
    data: function () {
      return {
        userId: window.userId,
        lan: 'en',
        randomMode: false,
        smartSelectObj: {
          closeOnSelect: true
        }
      }
    },
    methods: {
      saveSetting: function () {
        var _this = this
        var setting = {
          language: _this.lan,
          isRandom: _this.randomMode
        }
        _this.changeSetting(setting)
      },
      changeSetting: function (setting) {
        var auth = firebase.initNode.auth()
        var database = firebase.initNode.database().ref('/users/' + auth.currentUser.uid)
        if (typeof setting === 'object') {
          database.child('setting').set(setting)
        }
      },
      changeProfile: function () {
        var preloader = window.f7.mainView.router.loadPage('/popup/photoEdit/')
        if (!preloader) window.f7.mainView.router.load({url: '/popup/photoEdit/'})
      }
    },
    created: function () {
      var $$ = window.Dom7
      var firebaseRef = firebase.initNode.database().ref('/users')
      var auth = firebase.initNode.auth()
      firebaseRef.orderByKey().on('value', function (snap) {
        snap.forEach(function (data) {
          if (data.val().email === auth.currentUser.email) {
            if (data.hasChild('profilePhoto')) {
              $$('#profilePhoto').attr('src', data.val().profilePhoto)
            }
          }
        })
      })
    }
  }
</script>

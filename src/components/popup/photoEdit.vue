<template>
  <f7-popup tablet-fullscreen theme="white" layout="white" id="registerPhoto_P">
    <f7-view>
      <f7-page theme="lightblue" layout="white">
        <f7-list>
          <f7-list-item>
            <croppa class="photoEditRec" v-model="myCroppa"
                    :auto-sizing="true"
                    :image-border-radius="50"
                    :prevent-white-space="true"
                    @init="onInit"></croppa>
          </f7-list-item>
        </f7-list>
        <f7-button id="confirmBtn_Edit" text="Confirm" theme="lightblue" :round="true" @click="profileSave"></f7-button>
      </f7-page>
    </f7-view>
  </f7-popup>
</template>

<script>
  import firebase from '../../assets/js/firebaseInit'

  export default {
    data: function () {
      return {
        myCroppa: {}
      }
    },
    methods: {
      onInit: function () {
        this.myCroppa.addClipPlugin(function (ctx, x, y, w, h) {
          /*
           * ctx: canvas context
           * x: start point (top-left corner) x coordination
           * y: start point (top-left corner) y coordination
           * w: croppa width
           * h: croppa height
           */
          ctx.beginPath()
          ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, true)
          ctx.closePath()
        })
      },
      profileSave: function () {
        var _this = this
        var metadata = JSON.stringify(this.myCroppa.getMetadata())
        var firebaseRef = firebase.initNode.database().ref('/users')
        var auth = firebase.initNode.auth()
        firebaseRef.once('value')
          .then(function (snap) {
            snap.forEach(function (data) {
              auth.onAuthStateChanged((user) => {
                if (data.val().email === user.email) {
                  data.ref.update({profilePhoto: _this.myCroppa.generateDataUrl(), metadata: metadata})
                  window.f7.alert('registered a profile photo', 'done', function () {
                    window.f7.mainView.router.back()
                  })
                }
              })
            })
          })
      }
    }
  }
</script>

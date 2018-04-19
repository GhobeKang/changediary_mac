<template>
  <f7-page name="connectionPg">
    <f7-list form>
      <f7-list-item>
        <img id="targetImage" class="img-circle img-responsive center-block" src="../../assets/img/best-hd-unknown-clipart-pictures.jpg" onerror="this.src = '../../assets/img/best-hd-unknown-clipart-pictures.jpg'">
      </f7-list-item>
      <f7-list-item>
        <f7-input type="text" placeholder="Enter a target ID" :autofocus="true" id="targetID" style="text-align: center"></f7-input>
      </f7-list-item>
      <button type="button" class="btn default-btn" id="searchBtn" @click="searchTarget">search</button>
      <button type="button" class="btn default-btn" id="confirmBtn" @click="confirmConnection">confirm</button>
    </f7-list>
  </f7-page>
</template>

<script>
  import firebaseInit from '../../assets/js/firebaseInit'
  var $$ = window.Dom7

  export default {
    data: function () {
      return {
        targetEmail: '',
        profilePhoto: ''
      }
    },
    methods: {
      searchTarget: function (ev) {
        var _this = this
        var databaseRef = firebaseInit.initNode.database().ref('/')
        var targetId = $$('#targetID').val()
        databaseRef.orderByKey().once('child_added')
          .then(function (snap) {
            var isTarget = false
            snap.forEach(function (data) {
              if (data.val().email === targetId && !isTarget) {
                _this.targetEmail = data.val().email
                if (data.val().profilePhoto) {
                  _this.profilePhoto = data.val().profilePhoto
                }
                isTarget = true
              }
            })
            if (!isTarget) {
              window.f7.alert('there is not a target')
            } else {
              window.f7.alert('find the user', function () {
                if (_this.profilePhoto.length !== 0) {
                  $$('#targetImage').attr('src', _this.profilePhoto)
                }
              })
            }
          })
      },
      confirmConnection: function (ev) {
        var target = this.targetEmail
        var firebaseRef = firebaseInit.initNode.database().ref('/users')
        var auth = firebaseInit.initNode.auth()
        firebaseRef.once('value')
          .then(function (snap) {
            snap.forEach(function (data) {
              if (data.val().email === target) {
                data.child('requestFrom').ref.transaction(function (targetInfo) {
                  if (targetInfo === null) {
                    return [{email: auth.currentUser.email, timestamp: Date.now()}]
                  } else {
                    var arr = []
                    for (var i in targetInfo) {
                      arr.push(targetInfo[i])
                    }
                    arr.push({email: auth.currentUser.email, timestamp: Date.now()})
                    return arr
                  }
                })
              } else if (data.val().email === auth.currentUser.email) {
                data.child('requestTo').ref.transaction(function (requesting) {
                  if (requesting === null) {
                    return [{email: target, timestamp: Date.now()}]
                  } else {
                    var arr = []
                    for (var i in requesting) {
                      arr.push(requesting[i])
                    }
                    arr.push({email: target, timestamp: Date.now()})
                    return arr
                  }
                })
              }
            })
            window.f7.alert('request is sent', 'Done!', function () {
              window.f7.mainView.router.back()
            })
          })
      }
    }
  }
</script>


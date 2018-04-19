<template>
  <f7-page>
    <f7-block-title>
      Requested Friends List
    </f7-block-title>
    <f7-list>
      <template v-for="title in requestedList">
        <f7-list-item swipeout :title="title.email" @swipeout:deleted="deleteFromDB(title.email)">
          <f7-swipeout-actions>
            <f7-swipeout-button color="green" @click="sendReply(title.email)">Accept</f7-swipeout-button>
            <f7-swipeout-button close color="blue">Close</f7-swipeout-button>
            <f7-swipeout-button delete>Delete</f7-swipeout-button>
          </f7-swipeout-actions>
        </f7-list-item>
      </template>
    </f7-list>
  </f7-page>
</template>

<script>
  import firebase from '../../assets/js/firebaseInit'
  var databaseRef = firebase.initNode.database().ref('/users')

  export default {
    data: function () {
      return {
        requestedList: []
      }
    },
    methods: {
      sendReply: function (target) {
        var auth = firebase.initNode.auth()
        databaseRef.once('value')
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
            window.f7.alert('reply is sent', 'Done!', function () {
              window.f7.mainView.router.back()
            })
          })
      },
      deleteFromDB: function (title) {
        var auth = firebase.initNode.auth()
        if (window.requestFrom.length === 1) {
          window.requestFrom.pop()
        } else {
          for (var i in window.requestFrom) {
            if (window.requestFrom[i] === title) {
              var tempArr = window.requestFrom.slice(0, i)
              var tempArr2 = window.requestFrom.slice(i + 1, window.requestFrom.length)
              window.requestFrom = tempArr.concat(tempArr2)
            }
          }
        }
        databaseRef.child(auth.currentUser.uid + '/requestFrom').on('value', function (snap) {
          snap.forEach(function (data) {
            if (data.child('email').val() === title) {
              data.ref.remove()
            }
          })
        })
      }
    },
    created: function () {
      this.requestedList = window.requestFrom
    }
  }
</script>

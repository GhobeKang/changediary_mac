<template>
  <f7-page>
    <f7-block-title>
      Requested Friends List
    </f7-block-title>
    <f7-list>
      <template v-for="title in requestList">
        <f7-list-item swipeout :title="title.email" @swipeout:deleted="deleteFromDB(title)">
          <f7-swipeout-actions>
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

  export default {
    data: function () {
      return {
        requestList: []
      }
    },
    methods: {
      deleteFromDB: function (title) {
        var databaseRef = firebase.initNode.database().ref('/users')
        var auth = firebase.initNode.auth()
        if (window.requestTo.length === 1) {
          window.requestTo.pop()
        } else {
          for (var i in window.requestTo) {
            if (window.requestTo[i] === title) {
              var tempArr = window.requestTo.slice(0, i)
              var tempArr2 = window.requestTo.slice(i + 1, window.requestTo.length)
              window.requestTo = tempArr.concat(tempArr2)
            }
          }
        }
        databaseRef.child(auth.currentUser.uid + '/requestTo').on('value', function (snap) {
          snap.forEach(function (data) {
            if (data.child('email').val() === title) {
              data.ref.remove()
            }
          })
        })
      }
    },
    created: function () {
      this.requestList = window.requestTo
    }
  }
</script>

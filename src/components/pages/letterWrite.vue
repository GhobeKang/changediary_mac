<template>
  <f7-page id="letterPage">
    <f7-block-title>To. {{target}}</f7-block-title>
    <froala :tag="'textarea'" :config="config" v-model="contents"></froala>
    <f7-button id="letterSkinBtn" href="/popup/choice/">Change Letter Skin</f7-button>
    <f7-button id="letterSendBtn" @click="letterSend">Send</f7-button>
  </f7-page>
</template>

<script>
  import 'vue-froala-wysiwyg'
  import firebase from '../../assets/js/firebaseInit'
  require('froala-editor/css/themes/dark.css')

  var database = firebase.initNode.database()

  export default {
    data: function () {
      return {
        config: {
          events: {
            'froalaEditor.initialized': function () {
              console.log('initialized')
            }
          },
          height: 450,
          heightMax: 800,
          placeholderText: 'Enter your mind into here',
          theme: 'dark',
          toolbarButtonsXS: ['bold', 'italic', 'underline', 'strikeThrough', '|', 'fontFamily', 'fontSize', 'color', 'paragraphStyle', '|', 'align', 'formatUL', 'indent', 'quote', '|', 'insertLink', 'insertImage', 'insertVideo', 'insertTable', '|', 'emoti cons', 'undo', 'redo']
        },
        target: '',
        sender: '',
        contents: ''
      }
    },
    methods: {
      letterSend: function (ev) {
        var _this = this
        var sendObj = {
          target: _this.target,
          sender: _this.sender,
          contents: _this.contents,
          sendTime: Date.now()
        }
        var ref = database.ref('/users/')
        ref.once('value')
          .then(function (snap) {
            snap.forEach(function (data) {
              if (data.val().email === _this.target || data.val().email === _this.sender) {
                data.child('contents').ref.transaction(function (data) {
                  if (!data) {
                    return [sendObj]
                  } else {
                    var arr = []
                    for (var i in data) {
                      arr.push(data[i])
                    }
                    arr.push(sendObj)
                    return arr
                  }
                })
              }
            })
          })
        window.f7.alert('letter is sent', 'Success!', function () {
          window.f7.mainView.router.back()
        })
      }
    },
    mounted: function () {
      var $$ = window.Dom7
      var _this = this
      $$(document).on('page:init', '.page[id="letterPage"]', function (ev) {
        var page = window.f7.mainView.activePage
        _this.target = page.query.target
        _this.sender = page.query.sender
      })
    }
  }
</script>

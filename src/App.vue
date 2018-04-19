<template>
  <!-- App -->
  <div id="app">

    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>

    <!-- Main Views -->
    <f7-views>
      <f7-view id="main-view" pushState navbar-through main>
        <!-- Navbar -->
        <f7-navbar>
          <f7-nav-left>
            <f7-link icon="icon-back" :back="true"></f7-link>
          </f7-nav-left>
          <f7-nav-center sliding>testapp</f7-nav-center>
          <f7-nav-right>
            <f7-link icon="icon-bars" open-panel="right"></f7-link>
          </f7-nav-right>
        </f7-navbar>
        <!-- Pages -->
        <f7-pages>
          <f7-page :name="'initpage'" noConents v-if="connections.length === 0">
            <f7-link icon-f7="add_round" icon-size="400px" id="addIcon" @click="transPage('/connection/')"></f7-link>
          </f7-page>
          <f7-page :name="'conpage'" yesContens v-if="connections.length !== 0">
            <!-- show the contents on this page -->
            <swiper :options="swiperOption" ref="slider" @transitionEnd="slideChange">
              <template v-for="item in imageSlideList">
                <swiper-slide>
                  <img :src="item" class="sliderImages" @click="chkContents" :alt="sliderTarget">
                </swiper-slide>
              </template>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
            <f7-block id="sliderTarget" class="fadeOutUp">{{sliderTarget}}</f7-block>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-views>

    <!-- right Panel -->
    <f7-panel right reveal layout="dark">
      <f7-view id="left-panel-view" navbar-through :dynamic-navbar="true">
        <f7-navbar title="Menu"></f7-navbar>
        <f7-pages>
          <f7-page>
            <f7-block id="userInfo_leftPanel">
              <!-- login information -->
              <p v-if="currentUserInfo !== null">Hello! {{currentUserInfo}}</p>
              <p v-else-if="currentUserInfo === null">Please login first</p>
            </f7-block>
            <f7-list>
              <f7-list-item title="Logout" @click="logout" v-if="currentUserInfo !== null" id="logout_btn_left_p"></f7-list-item>
              <f7-list-item title="LogIn" @click="transPage('/login/')" v-if="currentUserInfo === null" id="login_btn_left_p"></f7-list-item>
              <f7-list-item title="Setting" @click="transPage('/setting/')" id="setting"></f7-list-item>
              <f7-list-item title="New Connection" @click="transPage('/connection/')" id="con_btn_left_p"></f7-list-item>
            </f7-list>
            <f7-block-title>Request Status</f7-block-title>
            <f7-list>
              <f7-list-item link="/request/" title="Request" link-view="#main-view" link-close-panel id="request"></f7-list-item>
              <f7-list-item link="/requested/" title="Received" link-view="#main-view" link-close-panel id="requested"></f7-list-item>
            </f7-list>
            <f7-block-title>Connections</f7-block-title>
            <f7-list id="connectionItems">
              <template v-for="item in connections">
                <f7-list-item class="connection_item" :title="item" link-view="#main-view" @click="chkContents"></f7-list-item>
              </template>
            </f7-list>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-panel>

    <div class="initLoading" style="display:none">
      <div class="wrap_backgroundImg">
        <img src="">
      </div>
      <div class="loadingTitle">
        <p>testapp</p>
      </div>
      <span class="preloader color-orange" style="width:40px;height:40px"></span>
    </div>
  </div>
</template>

<script>
  import firebase from './assets/js/firebaseInit'
  import connection from './assets/js/connection'

  var auth = firebase.initNode.auth()
  var $$ = window.Dom7

  export default {
    data: function () {
      return {
        haveContents: false,
        currentUserInfo: '',
        connectionRequests: [],
        connectionRecieves: [],
        connections: [],
        requestIsNew: false,
        receiveIsNew: false,
        isFirstLoading: true,
        imageSlideList: [],
        sliderTarget: '',
        swiperOption: {
          effect: 'coverflow',
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true
          },
          pagination: {
            el: '.swiper-pagination'
          }
        }
      }
    },
    computed: {
      swiper () {
        return this.$refs.slider.swiper
      }
    },
    methods: {
      slideChange: function () {
        var activeindex = this.swiper.activeIndex
        this.sliderTarget = this.connections[activeindex]
      },
      getSlideImg: function (userid) {
        var _this = this
        var ref = firebase.initNode.database().ref('/users/')
        ref.once('value')
          .then(function (snap) {
            snap.forEach(function (user) {
              if (user.val().email === userid) {
                if (user.hasChild('profilePhoto')) {
                  _this.imageSlideList.push(user.val().profilePhoto ? user.val().profilePhoto : undefined)
                } else {
                  _this.imageSlideList.push('data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMi4wMDEgNTEyLjAwMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyLjAwMSA1MTIuMDAxOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPHBhdGggc3R5bGU9ImZpbGw6I0YwQkRENTsiIGQ9Ik0xNjYuODEzLDE0NS41MjhsODkuMTg4LDEyMi43NTZsODkuMTg3LTEyMi43NTZjMTUuOTg0LTIyLjAwMSwxNS45ODQtNTEuNzkyLDAtNzMuNzkzbC0zNy41NS01MS42ODQgIGMtNy42MzctMTAuNTEyLTIyLjk1OC0xMS40NzMtMzEuODQ5LTEuOTk3bC0xMC4yNTcsMTAuOTMxYy01LjE2Myw1LjUwMy0xMy45LDUuNTAyLTE5LjA2MywwbC0xMC4yNTYtMTAuOTMxICBjLTguODkxLTkuNDc2LTI0LjIxMS04LjUxNS0zMS44NDksMS45OTdsLTM3LjU1MSw1MS42ODRDMTUwLjgyOSw5My43MzYsMTUwLjgyOSwxMjMuNTI3LDE2Ni44MTMsMTQ1LjUyOHoiLz4KPHBhdGggc3R5bGU9Im9wYWNpdHk6MC4zO2ZpbGw6I0ZGRkZGRjtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgOyIgZD0iTTIyMi4zNDgsMTkyLjM0M2wzMy42NTMsNzUuOTQxbDMzLjY1My03NS45NDEgIGM1LjQ2MS0xMi4zMjQsNS42OTQtMjYuMzM2LDAuNjQ0LTM4LjgzNWwtMTMuNzU4LTM0LjA1MWMtMS45NTEtNC44My04LjUtNS41MzEtMTEuNDMtMS4yMjVsLTQuMDk2LDYuMDIgIGMtMi40MDYsMy41MzUtNy42MTcsMy41MzUtMTAuMDIzLDBsLTQuMDk2LTYuMDJjLTIuOTMtNC4zMDctOS40NzktMy42MDUtMTEuNDMsMS4yMjVsLTEzLjc1OCwzNC4wNTIgIEMyMTYuNjU0LDE2Ni4wMDcsMjE2Ljg4NywxODAuMDE5LDIyMi4zNDgsMTkyLjM0M3oiLz4KPHBhdGggc3R5bGU9ImZpbGw6I0YwQkRENTsiIGQ9Ik0xMTEuNjkzLDMxNS4xNzNsMTQ0LjMwOC00Ni44ODlsLTg5LjE4OC0xMjIuNzU2Yy0xNS45ODUtMjIuMDAxLTQ0LjMxOC0zMS4yMDctNzAuMTgxLTIyLjgwMyAgbC02MC43NTgsMTkuNzQxYy0xMi4zNTgsNC4wMTUtMTguMDA2LDE4LjI4OS0xMS43NDIsMjkuNjczbDcuMjI2LDEzLjEzM2MzLjYzOCw2LjYxMSwwLjkzOCwxNC45Mi01Ljg5MSwxOC4xM2wtMTMuNTY1LDYuMzc2ICBjLTExLjc1OSw1LjUyOC0xNS41OCwyMC4zOTUtNy45NDIsMzAuOTA4bDM3LjU1MSw1MS42ODRDNTcuNDk2LDMxNC4zNyw4NS44MjksMzIzLjU3NiwxMTEuNjkzLDMxNS4xNzN6Ii8+CjxnPgoJPHBhdGggc3R5bGU9Im9wYWNpdHk6MC4yO2ZpbGw6I0ZGRkZGRjtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgOyIgZD0iTTExMS42OTMsMzE1LjE3M2wxNDQuMzA4LTQ2Ljg4OWwtODkuMTg4LTEyMi43NTYgICBjLTE1Ljk4NS0yMi4wMDEtNDQuMzE4LTMxLjIwNy03MC4xODEtMjIuODAzbC02MC43NTgsMTkuNzQxYy0xMi4zNTgsNC4wMTUtMTguMDA2LDE4LjI4OS0xMS43NDIsMjkuNjczbDcuMjI2LDEzLjEzMyAgIGMzLjYzOCw2LjYxMSwwLjkzOCwxNC45Mi01Ljg5MSwxOC4xM2wtMTMuNTY1LDYuMzc2Yy0xMS43NTksNS41MjgtMTUuNTgsMjAuMzk1LTcuOTQyLDMwLjkwOGwzNy41NTEsNTEuNjg0ICAgQzU3LjQ5NiwzMTQuMzcsODUuODI5LDMyMy41NzYsMTExLjY5MywzMTUuMTczeiIvPgoJPHBhdGggc3R5bGU9Im9wYWNpdHk6MC4zO2ZpbGw6I0ZGRkZGRjtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgOyIgZD0iTTE3My4zNzgsMjc2LjgyM2w4Mi42MjMtOC41MzlsLTYxLjgyNS01NS40NzMgICBjLTEwLjAzMy05LjAwMy0yMy4yODgtMTMuNTUzLTM2LjczNS0xMi42MTNsLTM2LjYzNiwyLjU2MmMtNS4xOTYsMC4zNjMtNy44ODcsNi4zNzQtNC42OTcsMTAuNDkybDQuNDU5LDUuNzU2ICAgYzIuNjE5LDMuMzgxLDEuMDA4LDguMzM3LTMuMDk3LDkuNTMzbC02Ljk5MSwyLjAzNmMtNS4wMDEsMS40NTYtNi4zNTcsNy45MDEtMi4zNjcsMTEuMjQ5bDI4LjEzMywyMy42MDcgICBDMTQ2LjU3MSwyNzQuMSwxNTkuOTY5LDI3OC4yMDksMTczLjM3OCwyNzYuODIzeiIvPgo8L2c+CjxwYXRoIHN0eWxlPSJmaWxsOiNGMEJERDU7IiBkPSJNMjU2LjAwMSw0MjAuMDE5VjI2OC4yODRsLTE0NC4zMDgsNDYuODg5Yy0yNS44NjQsOC40MDQtNDMuMzc0LDMyLjUwNS00My4zNzQsNTkuN3Y2My44ODUgIGMwLDEyLjk5NCwxMS44MjksMjIuNzc2LDI0LjU5MiwyMC4zMzZsMTQuNzIzLTIuODE1YzcuNDExLTEuNDE3LDE0LjQ3OSwzLjcxOSwxNS40MjIsMTEuMjA1bDEuODczLDE0Ljg3MiAgYzEuNjIzLDEyLjg5MiwxNC41ODIsMjEuMTIsMjYuOTQsMTcuMTA1bDYwLjc1OC0xOS43NDJDMjM4LjQ5LDQ3MS4zMTUsMjU2LjAwMSw0NDcuMjEzLDI1Ni4wMDEsNDIwLjAxOXoiLz4KPHBhdGggc3R5bGU9Im9wYWNpdHk6MC4xNTtmaWxsOiNFOTc4QTA7ZW5hYmxlLWJhY2tncm91bmQ6bmV3ICAgIDsiIGQ9Ik0yNTYuMDAxLDQyMC4wMTlWMjY4LjI4NGwtMTQ0LjMwOCw0Ni44ODkgIGMtMjUuODY0LDguNDA0LTQzLjM3NCwzMi41MDUtNDMuMzc0LDU5Ljd2NjMuODg1YzAsMTIuOTk0LDExLjgyOSwyMi43NzYsMjQuNTkyLDIwLjMzNmwxNC43MjMtMi44MTUgIGM3LjQxMS0xLjQxNywxNC40NzksMy43MTksMTUuNDIyLDExLjIwNWwxLjg3MywxNC44NzJjMS42MjMsMTIuODkyLDE0LjU4MiwyMS4xMiwyNi45NCwxNy4xMDVsNjAuNzU4LTE5Ljc0MiAgQzIzOC40OSw0NzEuMzE1LDI1Ni4wMDEsNDQ3LjIxMywyNTYuMDAxLDQyMC4wMTl6Ii8+CjxwYXRoIHN0eWxlPSJvcGFjaXR5OjAuMztmaWxsOiNGRkZGRkY7ZW5hYmxlLWJhY2tncm91bmQ6bmV3ICAgIDsiIGQ9Ik0yMzguNTksMzQ5LjUwMmwxNy40MTEtODEuMjE4bC03MS44NjMsNDEuNjU3ICBjLTExLjY2Miw2Ljc2LTIwLjA4NiwxNy45Ni0yMy4zNDcsMzEuMDRsLTguODg0LDM1LjYzNWMtMS4yNiw1LjA1NCwzLjYyNSw5LjQ3MSw4LjUyNyw3LjcxbDYuODUzLTIuNDYyICBjNC4wMjQtMS40NDYsOC4yNDEsMS42MTcsOC4xMDksNS44OTJsLTAuMjI0LDcuMjc4Yy0wLjE2MSw1LjIwNiw1LjU1LDguNDg4LDkuOTY3LDUuNzI4bDMxLjE0Ni0xOS40NjEgIEMyMjcuNzE2LDM3NC4xNTUsMjM1Ljc2NCwzNjIuNjgzLDIzOC41OSwzNDkuNTAyeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRjBCREQ1OyIgZD0iTTQwMC4zMDksMzE1LjE3M2wtMTQ0LjMwOC00Ni44ODlsODkuMTg3LTEyMi43NTZjMTUuOTg0LTIyLjAwMSw0NC4zMTgtMzEuMjA3LDcwLjE4MS0yMi44MDMgIGw2MC43NTgsMTkuNzQxYzEyLjM1OCw0LjAxNSwxOC4wMDYsMTguMjg5LDExLjc0MiwyOS42NzNsLTcuMjI2LDEzLjEzM2MtMy42MzgsNi42MTEtMC45MzgsMTQuOTIsNS44OTEsMTguMTNsMTMuNTY1LDYuMzc2ICBjMTEuNzU5LDUuNTI4LDE1LjU4LDIwLjM5NSw3Ljk0MiwzMC45MDhMNDcwLjQ5LDI5Mi4zN0M0NTQuNTA2LDMxNC4zNyw0MjYuMTczLDMyMy41NzYsNDAwLjMwOSwzMTUuMTczeiIvPgo8cGF0aCBzdHlsZT0ib3BhY2l0eTowLjE1O2ZpbGw6I0U5NzhBMDtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgOyIgZD0iTTQwMC4zMDksMzE1LjE3M2wtMTQ0LjMwOC00Ni44ODlsODkuMTg3LTEyMi43NTYgIGMxNS45ODQtMjIuMDAxLDQ0LjMxOC0zMS4yMDcsNzAuMTgxLTIyLjgwM2w2MC43NTgsMTkuNzQxYzEyLjM1OCw0LjAxNSwxOC4wMDYsMTguMjg5LDExLjc0MiwyOS42NzNsLTcuMjI2LDEzLjEzMyAgYy0zLjYzOCw2LjYxMS0wLjkzOCwxNC45Miw1Ljg5MSwxOC4xM2wxMy41NjUsNi4zNzZjMTEuNzU5LDUuNTI4LDE1LjU4LDIwLjM5NSw3Ljk0MiwzMC45MDhMNDcwLjQ5LDI5Mi4zNyAgQzQ1NC41MDYsMzE0LjM3LDQyNi4xNzMsMzIzLjU3Niw0MDAuMzA5LDMxNS4xNzN6Ii8+CjxwYXRoIHN0eWxlPSJvcGFjaXR5OjAuMztmaWxsOiNGRkZGRkY7ZW5hYmxlLWJhY2tncm91bmQ6bmV3ICAgIDsiIGQ9Ik0zMzguNjI0LDI3Ni44MjNsLTgyLjYyMy04LjUzOWw2MS44MjUtNTUuNDczICBjMTAuMDMzLTkuMDAzLDIzLjI4OC0xMy41NTMsMzYuNzM1LTEyLjYxM2wzNi42MzYsMi41NjJjNS4xOTYsMC4zNjMsNy44ODcsNi4zNzQsNC42OTcsMTAuNDkybC00LjQ1OSw1Ljc1NiAgYy0yLjYxOSwzLjM4MS0xLjAwOCw4LjMzNywzLjA5Nyw5LjUzM2w2Ljk5MSwyLjAzNmM1LjAwMSwxLjQ1Niw2LjM1OCw3LjkwMSwyLjM2NywxMS4yNDlsLTI4LjEzMywyMy42MDcgIEMzNjUuNDMxLDI3NC4xLDM1Mi4wMzMsMjc4LjIwOSwzMzguNjI0LDI3Ni44MjN6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNGMEJERDU7IiBkPSJNMjU2LjAwMSw0MjAuMDE5VjI2OC4yODRsMTQ0LjMwOCw0Ni44ODljMjUuODYzLDguNDA0LDQzLjM3NCwzMi41MDUsNDMuMzc0LDU5Ljd2NjMuODg1ICBjMCwxMi45OTQtMTEuODI5LDIyLjc3Ni0yNC41OTIsMjAuMzM2bC0xNC43MjMtMi44MTVjLTcuNDExLTEuNDE3LTE0LjQ3OSwzLjcxOS0xNS40MjIsMTEuMjA1bC0xLjg3MiwxNC44NzIgIGMtMS42MjMsMTIuODkyLTE0LjU4MiwyMS4xMi0yNi45NCwxNy4xMDVsLTYwLjc1OC0xOS43NDJDMjczLjUxMiw0NzEuMzE1LDI1Ni4wMDEsNDQ3LjIxMywyNTYuMDAxLDQyMC4wMTl6Ii8+CjxwYXRoIHN0eWxlPSJvcGFjaXR5OjAuMztmaWxsOiNGRkZGRkY7ZW5hYmxlLWJhY2tncm91bmQ6bmV3ICAgIDsiIGQ9Ik0yNzMuNDEyLDM0OS41MDJsLTE3LjQxMS04MS4yMThsNzEuODYzLDQxLjY1NyAgYzExLjY2Myw2Ljc2LDIwLjA4NiwxNy45NiwyMy4zNDcsMzEuMDRsOC44ODQsMzUuNjM1YzEuMjYsNS4wNTQtMy42MjUsOS40NzEtOC41MjcsNy43MWwtNi44NTMtMi40NjIgIGMtNC4wMjQtMS40NDYtOC4yNDEsMS42MTctOC4xMDksNS44OTJsMC4yMjQsNy4yNzhjMC4xNjEsNS4yMDYtNS41NSw4LjQ4OC05Ljk2Nyw1LjcyOGwtMzEuMTQ2LTE5LjQ2MSAgQzI4NC4yODYsMzc0LjE1NSwyNzYuMjM4LDM2Mi42ODMsMjczLjQxMiwzNDkuNTAyeiIvPgo8ZyBzdHlsZT0ib3BhY2l0eTowLjA1OyI+Cgk8cGF0aCBkPSJNMjU2LjAwMSw5My4yNDhjLTQuMTQyLDAtNy41LTMuMzU4LTcuNS03LjVWNjIuNDY1YzAtNC4xNDIsMy4zNTgtNy41LDcuNS03LjVzNy41LDMuMzU4LDcuNSw3LjV2MjMuMjgzICAgQzI2My41MDEsODkuODkxLDI2MC4xNDMsOTMuMjQ4LDI1Ni4wMDEsOTMuMjQ4eiIvPgoJPHBhdGggZD0iTTgyLjQwMSwyMTkuMzc5Yy0wLjc2OCwwLTEuNTQ5LTAuMTE5LTIuMzE5LTAuMzY5bC0yMi4xNDQtNy4xOTVjLTMuOTM5LTEuMjgtNi4wOTYtNS41MTEtNC44MTUtOS40NSAgIGMxLjI4LTMuOTQsNS41MTEtNi4wOTcsOS40NS00LjgxNWwyMi4xNDQsNy4xOTVjMy45MzksMS4yOCw2LjA5Niw1LjUxMSw0LjgxNSw5LjQ1Qzg4LjUwMiwyMTcuMzY0LDg1LjU2MiwyMTkuMzc5LDgyLjQwMSwyMTkuMzc5eiAgICIvPgoJPHBhdGggZD0iTTEzNS4wMTgsNDQyLjI5NWMtMS41MjgsMC0zLjA3MS0wLjQ2Ni00LjQwMi0xLjQzM2MtMy4zNTEtMi40MzUtNC4wOTQtNy4xMjQtMS42NTktMTAuNDc2bDEzLjY4Ni0xOC44MzYgICBjMi40MzQtMy4zNTIsNy4xMjQtNC4wOTUsMTAuNDc2LTEuNjU5YzMuMzUxLDIuNDM1LDQuMDk0LDcuMTI1LDEuNjU5LDEwLjQ3NmwtMTMuNjg2LDE4LjgzNiAgIEMxMzkuNjI0LDQ0MS4yMjMsMTM3LjMzNyw0NDIuMjk1LDEzNS4wMTgsNDQyLjI5NXoiLz4KCTxwYXRoIGQ9Ik0zNzYuOTg0LDQ0Mi4yOTVjLTIuMzE5LDAtNC42MDYtMS4wNzItNi4wNzQtMy4wOTJsLTEzLjY4Ni0xOC44MzZjLTIuNDM1LTMuMzUxLTEuNjkyLTguMDQxLDEuNjU5LTEwLjQ3NiAgIGMzLjM1Mi0yLjQzNSw4LjA0Mi0xLjY5MSwxMC40NzYsMS42NTlsMTMuNjg2LDE4LjgzNmMyLjQzNSwzLjM1MSwxLjY5Miw4LjA0MS0xLjY1OSwxMC40NzYgICBDMzgwLjA1NSw0NDEuODMsMzc4LjUxMyw0NDIuMjk1LDM3Ni45ODQsNDQyLjI5NXoiLz4KCTxwYXRoIGQ9Ik00MjkuNjAxLDIxOS4zNzljLTMuMTYyLDAtNi4xMDItMi4wMTUtNy4xMzEtNS4xODVjLTEuMjgtMy45MzksMC44NzYtOC4xNyw0LjgxNS05LjQ1bDIyLjE0My03LjE5NSAgIGMzLjkzOC0xLjI4Miw4LjE3LDAuODc1LDkuNDUsNC44MTVjMS4yOCwzLjkzOS0wLjg3Niw4LjE3LTQuODE1LDkuNDVsLTIyLjE0NCw3LjE5NSAgIEM0MzEuMTUsMjE5LjI2MSw0MzAuMzY5LDIxOS4zNzksNDI5LjYwMSwyMTkuMzc5eiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=')
                }
              }
            })
          })
      },
      loginChk: function () {
        if (auth.currentUser !== null) {
          return true
        } else {
          return false
        }
      },
      logout: function (ev) {
        auth.signOut()
        window.setTimeout(window.location.reload(), 1000)
      },
      transPage: function (targetPage) {
        var mainView = window.f7.mainView
        if (this.loginChk()) {
          this.$f7.closePanel(true)
          var preloaded = mainView.router.load({url: targetPage})
          if (!preloaded) { mainView.router.reloadPage(targetPage) }
        } else {
          this.$f7.closePanel(true)
          mainView.router.loadPage('/login/')
        }
      },
      letterWritePage: function (target) {
        var curUser = auth.currentUser.email
        this.$f7.closePanel(true)
        window.f7.mainView.router.loadPage('/letter_W/?target=' + target + '&sender=' + curUser)
      },
      showContentPage: function (contents) {
        var data = JSON.stringify(contents)
        window.f7.mainView.router.loadPage({url: '/letter_R/?data=' + data, force: true})
      },
      chkContents: function (ev) {
        var _this = this
        var target = ev.target.innerText.trim()
        var hasContent = false
        if (target.length === 0) {
          target = ev.target.alt
        }
        var databaseRef = firebase.initNode.database().ref('/users/' + auth.currentUser.uid)
        databaseRef.once('value', function (snap) {
          if (snap.hasChild('contents')) {
            if (snap.child('contents').numChildren() !== 0) {
              snap.child('contents').forEach(function (data) {
                // show contents
                var contents = []
                if (data.val().target === target) {
                  contents.push(data.val())
                  _this.showContentPage(contents)
                }
                if (contents.length !== 0) {
                  hasContent = true
                }
              })
            }
          }
          if (!hasContent) {
            _this.letterWritePage(target)
          }
        })
      }
    },
    mounted: function () {
      var _this = this
      var width = window.innerWidth
      var height = window.innerHeight
      $$('.initLoading').css({
        display: 'block',
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        'z-index': 10000,
        background: 'white'
      })
      $$('.initLoading>.preloader').css({
        position: 'fixed',
        left: width / 2 - 20 + 'px',
        top: height / 2 - 20 + 'px'
      })
      auth.onAuthStateChanged((user) => {
        if (user) {
          _this.currentUserInfo = user.email.split('@')[0]
          var email = user.email
          window.userId = user.email
          firebase.initNode.database().ref('/users').on('value', function (snap) {
            snap.forEach(function (data) {
              if (data.val().email === email) {
                window.requestFrom = data.val().requestFrom ? data.val().requestFrom : null
                _this.connectionRecieves = window.requestFrom
                window.requestTo = data.val().requestTo ? data.val().requestTo : null
                _this.connectionRequests = window.requestTo
                var connectedTarget = connection.connection.requestCompare(window.requestFrom, window.requestTo)
                if (connectedTarget && _this.isFirstLoading) {
                  for (var i in connectedTarget) {
                    window.requestFrom = connection.connection.targetRemove(connectedTarget[i], window.requestFrom)
                    window.requestTo = connection.connection.targetRemove(connectedTarget[i], window.requestTo)
                    _this.connections.push(connectedTarget[i])
                    _this.getSlideImg(connectedTarget[i])
                  }
                  _this.sliderTarget = _this.connections[0]
                  _this.isFirstLoading = false
                }
                if (data.hasChild('requestFrom') && window.requestFrom) {
                  if (Date.now() - window.requestFrom[window.requestFrom.length - 1].timestamp < 259200000 && !_this.receiveIsNew) {
                    $$('#requested>a>div>div').append('<span class="badge color-orange">new</span>')
                    _this.receiveIsNew = true
                  }
                } else if (data.hasChild('requestTo') && window.requestTo) {
                  if (Date.now() - window.requestTo[window.requestTo.length - 1].timestamp < 259200000 && !_this.requestIsNew) {
                    $$('#request>a>div>div').append('<span class="badge color-orange">new</span>')
                    _this.requestIsNew = true
                  }
                }
              }
            })
            $$('.initLoading').css('display', 'none')
          })
        } else {
          _this.currentUserInfo = null
          $$('.initLoading').css('display', 'none')
        }
      })
    }
  }
</script>

<style>@import '../node_modules/framework7-icons/css/framework7-icons.css';@import './assets/css/default.css';</style>

<template>
  <div class="tabs is-centered">
    <ul>
      <li class="tab">
        <router-link to="/in" @click="toggleActiveTab">オペラ内</router-link>
      </li>
      <li class="tab">
        <router-link to="/out" @click="toggleActiveTab">オペラ外</router-link>
      </li>
      <li class="tab">
        <router-link to="/register" @click="toggleActiveTab">店登録</router-link>
      </li>
      <li class="tab">
        <router-link to="/ranking" @click="toggleActiveTab">ランキング</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data () {
    return {
      currentActiveLinkElm: null
    }
  },
  methods: {
    toggleActiveTab (e) {
      this.currentActiveLinkElm.classList.remove('is-active')
      let clickedLinkElm = e.srcElement.parentNode
      clickedLinkElm.classList.toggle('is-active')
      this.currentActiveLinkElm = clickedLinkElm
    }
  },
  mounted () {
    let tabs = document.getElementsByClassName('tab')

    Array.from(tabs).forEach(el => {
      if (el.getElementsByTagName('a')[0].getAttribute('href') === location.pathname) {
        this.currentActiveLinkElm = el
        el.classList.toggle('is-active')
      }
    })
  }
};
</script>

<style scoped>
.tab a {
  font-size: 0.8rem;
}

div.tabs:not(:last-child) {
  margin-bottom: 0;
}
</style>

<template>
  <div class="tabs is-centered">
    <ul>
      <li class="tab">
        <a href="/in" @click="toggleActiveTab">オペラ内</a>
      </li>
      <li class="tab">
        <a href="/out" @click="toggleActiveTab">オペラ外</a>
      </li>
      <li class="tab">
        <a href="/register" @click="toggleActiveTab">店登録</a>
      </li>
      <li class="tab">
        <a href="/ranking" @click="toggleActiveTab">ランキング</a>
      </li>
    </ul>
  </div>
</nav>

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

<style>
.tab a {
  font-size: 0.8rem;
}
</style>

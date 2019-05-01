<template>
  <div class="container">
    <div class="box">
      <div class="field">
        <div class="control">
          <input v-model="restaurantName" class="input" type="text" placeholder="店名">
        </div>
      </div>
      <div class="field">
        <label class="checkbox">
          <input v-model="restaurantIsOut" type="checkbox">
          外の店である
        </label>
      </div>
      <div class="button" @click="add">追加</div>
    </div>
    <div id="registerModal" class="modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">
            <span class="is-size-6">店が追加されました</span>
          </p>
          <button class="delete" aria-label="close" @click="closeModal"></button>
        </header>
        <section class="modal-card-body">
          <p>
            <span class="is-size-5 has-text-weight-semibold">{{restaurantName}}</span>
          </p>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="closeModal">OK</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "~/plugins/firebase.js";

export default {
  data() {
    return {
      restaurantName: '',
      restaurantId: '',
      restaurantIsOut: false
    };
  },
  methods: {
    add () {
      if (!this.restaurantName) {
        return;
      }
      db.collection("restaurants")
        .add({
          name: this.restaurantName,
          isOut: this.restaurantIsOut
        })
        .then(docRef => {
          this.restaurantId = docRef.id
          console.log("Document written with ID: ", docRef.id);
          document.getElementById('registerModal').classList.add('is-active')
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        });
    },
    closeModal () {
      document.getElementById('registerModal').classList.remove('is-active')
    }
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  /* min-height: 100vh; */
  display: flex;
  justify-content: center;
  /* align-items: center; */
  text-align: center;
}

.box {
  background: palevioletred;
}
</style>
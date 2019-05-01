<template>
  <div class="container">
    <section class="section">
      <div class="columns">
        <div class="column">
          <p>
            <span class="is-size-3 has-text-weight-bold has-text-dark">
              昼飯スロット
            </span>
          </p>
        </div>
      </div>
      <div class="columns is-centered">
        <div v-for="st in this.slots" :key="st.slotPos" class="column is-one-third">
          <p class="tag is-rounded">
            <span class="is-size-5">
              {{st.txt}}
            </span>
          </p>
        </div>
      </div>
      <div class="columns is-centered is-mobile">
        <div class="column">
          <div class="button is-primary" @click="runSlot">START</div>
        </div>
        <div class="column">
          <div class="button is-danger" @click="stopSlot">STOP</div>
        </div>
      </div>
      <div class="modal" :class="{'is-active': resultRestaurantName !== ''}">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">
              <span class="is-size-6">
                結果
              </span>
            </p>
            <button class="delete" aria-label="close" @click="closeModal"></button>
          </header>
          <section class="modal-card-body">
            <p>
              <span class="is-size-5 has-text-weight-semibold">
                {{resultRestaurantName}}
              </span>
            </p>
          </section>
          <footer class="modal-card-foot">
            <button class="button is-success" @click="restaurantIsDecided">決定</button>
            <button v-if="restaurants.length > 1" class="button" @click="replay">他の店にする</button>
          </footer>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { db } from '~/plugins/firebase.js'

export default {
  data() {
    return {
      slots: [],
      timers: [],
      restaurants: [],
      running: false,
      decided: false,
      resultRestaurantName: ""
    };
  },
  methods: {
    initialize () {
      let slots = [];

      for (let i = 0; i < 3; i++) {
        let startRestaurantIdx = Math.floor(Math.random() * this.restaurants.length);
        slots[i] = {
          slotPos: i,
          currentRestaurantIdx: startRestaurantIdx,
          txt: this.restaurants[startRestaurantIdx]
        };
      }
      this.slots = slots;
      this.timers = []; // スロット
    },
    runSlot () {
      if (this.running || this.restaurants.length <= 1 || this.decided) {
        return
      }

      this.running = true;
      this.resultRestaurantName = "";

      for (let slotObj of this.slots) {
        this.reel(slotObj);
      }
    },
    reel(slotObj) {
      let slotPos = slotObj.slotPos;
      let currentRestaurantIdx = slotObj.currentRestaurantIdx;
      let nextRestaurantIdx = currentRestaurantIdx + 1;

      if (nextRestaurantIdx > this.restaurants.length - 1) {
        nextRestaurantIdx = 0;
      }

      slotObj.currentRestaurantIdx = nextRestaurantIdx;
      slotObj.txt = this.restaurants[currentRestaurantIdx];

      // this.slots[slotPos] = slotObj;

      this.timers[slotPos] = setTimeout(() => {
        this.reel(slotObj);
      }, 100);
    },
    async stopSlot() {
      if (!this.running) {
        return;
      }

      let slotStoppedFirst = null;

      for (let i = 0; i < this.timers.length; i++) {
        let slot = this.slots[i];

        if (i === 0) {
          slotStoppedFirst = slot;
          await this.sleep(1000);
          clearTimeout(this.timers[i]);
        } else {
          await this.makeSlotTxtSameAsFirstStopped(slotStoppedFirst, slot);
        }
      }

      this.resultRestaurantName = this.slots[0].txt;
      this.running = false;
    },
    async sleep(ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    },
    makeSlotTxtSameAsFirstStopped(obj1, obj2) {
      let timerPos = obj2.slotPos;

      return new Promise(resolve => {
        setTimeout(() => {
          if (obj1.txt === obj2.txt) {
            clearTimeout(this.timers[timerPos]);
            resolve();
          } else {
            resolve(this.makeSlotTxtSameAsFirstStopped(obj1, obj2));
          }
        }, 100);
      });
    },
    closeModal () {
      this.resultRestaurantName = ''
    },
    restaurantIsDecided () {
      this.decided = true
      this.closeModal()
    },
    replay () {
      this.restaurants = this.restaurants.filter(r => r !== this.resultRestaurantName)
      this.initialize()
      this.closeModal()
    }
  },
  created() {
    let restaurants = []
    db.collection("restaurants").get()
      .then((querySnapshot) => {
        querySnapshot.forEach(doc => {
          let data = doc.data()
          if (data.name) {
            restaurants.push(data.name)
          }
        })
      })
      .then(() => {
        this.restaurants = restaurants
        this.initialize()
      })
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
  background: palevioletred;
}

section {
  width: 100%;
  height: auto;
}

#result-area {
  margin-top: 20px;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.columns {
  width: 100%;
  margin: 0 auto;
  text-align: center;
}

p.tag {
  width: 80%;
  height: 3rem;
  /* font-size: 1.2rem; */
  background: white;
}

div.button {
  width: 80%;
  height: auto;
}

div.modal-card {
  max-width: 80%;
}

p.modal-card-title {
  font-size: 1.2rem;
}
</style>

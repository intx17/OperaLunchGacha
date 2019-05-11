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
        <div v-for="r in this.reels" :key="r.reelIdx" class="column is-one-third">
          <p class="tag is-rounded">
            <span class="is-size-5">
              {{r.txt}}
            </span>
          </p>
        </div>
      </div>
      <div class="columns is-centered is-mobile">
        <div class="column">
          <div class="button is-primary" @click="start">START</div>
        </div>
        <div class="column">
          <div class="button is-danger" @click="stop">STOP</div>
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
import moment from 'moment'

export default {
  data() {
    return {
      reels: [],
      timers: [],
      restaurants: [],
      running: false,
      decided: false,
      resultRestaurantName: ''
    };
  },
  methods: {
    closeModal () {
      this.resultRestaurantName = ''
    },
    async getRestaurantsByCurrentUrl (restaurants) {
      let path = this.$route.path
      let excludeOutsideRestaurant = path == "/" || path.includes("in")

      if (excludeOutsideRestaurant) {
        return await restaurants.filter(r => !r.isOut)
      }

      return restaurants
    },
    // リスタート時などに、タイマーとリールの初期化を行う
    initialize () {
      this.running = false
      this.decided = false
      this.resultRestaurantName = '' 
      let reels = [];

      for (let i = 0; i < 3; i++) {
        let startRestaurantIdx = Math.floor(Math.random() * this.restaurants.length)
        reels[i] = {
          reelIdx: i, // スロット
          currentRestaurantIdx: startRestaurantIdx,
          txt: this.restaurants[startRestaurantIdx].name
        }
      }

      this.reels = reels;
      this.timers = []; // スロット
    },
    makeReelHit (stoppedReel, rotatingReel) {
      let timerIdx = rotatingReel.reelIdx;

      // 出目が同じになるまで再起呼び出しを行う
      return new Promise(resolve => {
        setTimeout(() => {
          if (stoppedReel.txt === rotatingReel.txt) {
            clearTimeout(this.timers[timerIdx])
            resolve();
          } else {
            resolve(this.makeReelHit(stoppedReel, rotatingReel))
          }
        }, 100)
      })
    },
    // プレイ後のモーダルで店を選び直した場合に呼ばれる
    replay () {
      // リプレイの場合、拒否された店を出目から消しておく
      this.restaurants = this.restaurants.filter(r => r.name !== this.resultRestaurantName)
      this.initialize()
      this.closeModal()
    },
    // プレイ後のモーダルで店を確定した場合に呼ばれる
    restaurantIsDecided () {
      this.decided = true
      this.saveLog(this.resultRestaurantName)
      this.closeModal()
    },
    // 個々のリールを回転させる
    rotate (reel) {
      let reelIdx = reel.reelIdx;
      let currentRestaurantIdx = reel.currentRestaurantIdx
      let nextRestaurantIdx = currentRestaurantIdx + 1

      // 一周してはじめに戻る
      if (nextRestaurantIdx > this.restaurants.length - 1) {
        nextRestaurantIdx = 0
      }

      // 次の店に出目を変える
      reel.currentRestaurantIdx = nextRestaurantIdx
      reel.txt = this.restaurants[currentRestaurantIdx].name

      // タイマー格納
      this.timers[reelIdx] = setTimeout(() => {
        this.rotate(reel)
      }, 100)
    },
    saveLog (restaurantName) {
      if (!restaurantName) {
        return;
      }

      console.log("start save")
      console.log(moment().format('YYYY/MM/DD'))
      db.collection("logs")
        .add({
          name: restaurantName,
          date: moment().format('YYYY/MM/DD')
        })
        .then(docRef => {
          console.log("Document written with ID: ", docRef.id)
        })
        .catch(error => {
          console.error("Error adding document: ", error)
        });
    },
    async sleep (ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, ms)
      })
    },
    start () {
      // プレイ中・店の候補が一つしかなくなった時・すでに決定したときはプレイできない
      if (this.running || this.restaurants.length <= 1 || this.decided) {
        return
      }

      this.running = true

      for (let reel of this.reels) {
        this.rotate(reel)
      }
    },
    async stop () {
      if (!this.running) {
        // 再生状態だった場合早期return
        return
      }

      // 他のリールとのテキスト比較に使用する
      let reelStoppedFirst = null
      console.log(this.timers)

      for (let i = 0; i < this.timers.length; i++) {
        let reel = this.reels[i]

        // リールを徐々に止めていく
        if (i === 0) {
          reelStoppedFirst = reel
          await this.sleep(1000)
          clearTimeout(this.timers[i])
        } else {
          await this.makeReelHit(reelStoppedFirst, reel)
        }
      }

      this.resultRestaurantName = reelStoppedFirst.txt
      this.running = false
    }
  },
  // in, outが切り替わったタイミングで呼ばれる
  // async beforeMount () {
  //   console.log("mount ")
  //   this.restaurants = await this.getRestaurantsByCurrentUrl(this.allRestaurants)
  //   this.initialize()
  // },
  created () {
    let allRestaurants = []
    console.log("first")
    
    db.collection("restaurants").get()
      .then((querySnapshot) => {
        querySnapshot.forEach(doc => {
          let data = doc.data()
          if (data.name) {
            allRestaurants.push(data)
          }
        })
      })
      .then(async () => {
        this.restaurants = await this.getRestaurantsByCurrentUrl(allRestaurants)
        this.initialize()
      })
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
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

div.tabs:not(:last-child) {
  margin-bottom: 0;
}
</style>

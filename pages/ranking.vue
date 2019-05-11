<template>
    <div class="container">
        <section class="section">
            <table class="table is-striped">
                <thead>
                    <tr>
                        <th>店名</th>
                        <th>今月行った回数</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="[key, val] in Array.from(this.thisMonthLogRankMap)" :key="key">
                        <td>{{key}}</td>
                        <td>{{val}}</td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div> 
</template>

<script>
import { db } from "~/plugins/firebase.js"
import moment from 'moment'

export default {
    data () {
        return {
            thisMonthLogRankMap: new Map(),
            yearNum: 0,
            monthNum: 0,
            today: null
        }
    },
    methods: {
        setThisMonthLogs () {
            this.thisMonthLogRankMap = this.logs.filter(d => {
                let dateMoment = moment(d.date, 'YYYY/MM/DD')
                return (dateMoment.year() === this.yearNum)
                    && (dateMoment.month === this.monthNum)
            })
        }
    },
    created () {
        let today = moment()
        this.yearNum = today.year()
        this.monthNum = today.month()

        let logs = []
        db.collection("logs").get()
            .then((querySnapshot) => {
                querySnapshot.forEach(doc => {
                    let data = doc.data()
                    console.log(data)
                // if (!data.isOut && data.name) {
                    logs.push(data)
                // }
                })
        })
        .then(() => {
            let tmpMap = new Map()
            this.logs = logs
            this.logs.filter(l => {
                // 今月のログを取得する
                let dateMoment = moment(l.date, 'YYYY/MM/DD')
                return (dateMoment.year() === this.yearNum)
                    && (dateMoment.month() === this.monthNum)
            }).forEach(l => {
                // 選ばれた回数を取得
                let currentCount = tmpMap.get(l.name) || 0
                tmpMap.set(l.name, currentCount + 1)
            })

            this.thisMonthLogRankMap = new Map([...tmpMap.entries()]
                .sort((a, b) => a[1] === b[1] ? 0 : a[1] < b[1] ? 1 : -1));
            console.log(thisMonthLogRankMap)
        })
    }
}
    
</script>

<style scoped>
.container {
  margin: 0 auto;
  /* min-height: 100vh; */
  display: flex;
  justify-content: center;
  /* align-items: center; */
  text-align: center;
}
</style>
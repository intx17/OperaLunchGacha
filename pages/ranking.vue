<template>
    <div class="container">
        <section class="section">
            <div class="column">
                <li v-for="[key, val] in Array.from(this.thisMonthLogRankMap)" :key="key">
                    {{key}}
                    {{val}}
                </li>
            </div>
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
            let thisMonthLogRankMap = new Map()
            this.logs = logs
            this.logs.filter(l => {
                let dateMoment = moment(l.date, 'YYYY/MM/DD')
                return (dateMoment.year() === this.yearNum)
                    && (dateMoment.month() === this.monthNum)
            }).forEach(l => {
                let currentCount = thisMonthLogRankMap.get(l.name) || 0
                thisMonthLogRankMap.set(l.name, currentCount + 1)
            })
            this.thisMonthLogRankMap = thisMonthLogRankMap
            console.log(thisMonthLogRankMap)
        })
    }
}
    
</script>

(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{448:function(t,e,r){var content=r(459);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(32).default)("2c72109b",content,!0,{sourceMap:!1})},458:function(t,e,r){"use strict";var n=r(448);r.n(n).a},459:function(t,e,r){(t.exports=r(31)(!1)).push([t.i,".container[data-v-33d6c084]{margin:0 auto;display:flex;justify-content:center;text-align:center}.box[data-v-33d6c084]{background:#db7093}",""])},463:function(t,e,r){"use strict";r.r(e);var n=r(86),c={data:function(){return{restaurantName:"",restaurantId:"",restaurantIsOut:!1}},methods:{add:function(){var t=this;this.restaurantName&&n.a.collection("restaurants").add({name:this.restaurantName,isOut:this.restaurantIsOut}).then(function(e){t.restaurantId=e.id,console.log("Document written with ID: ",e.id),document.getElementById("registerModal").classList.add("is-active")}).catch(function(t){console.error("Error adding document: ",t)})},closeModal:function(){document.getElementById("registerModal").classList.remove("is-active")}}},o=(r(458),r(26)),component=Object(o.a)(c,function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"container"},[r("div",{staticClass:"box"},[r("div",{staticClass:"field"},[r("div",{staticClass:"control"},[r("input",{directives:[{name:"model",rawName:"v-model",value:t.restaurantName,expression:"restaurantName"}],staticClass:"input",attrs:{type:"text",placeholder:"店名"},domProps:{value:t.restaurantName},on:{input:function(e){e.target.composing||(t.restaurantName=e.target.value)}}})])]),t._v(" "),r("div",{staticClass:"field"},[r("label",{staticClass:"checkbox"},[r("input",{directives:[{name:"model",rawName:"v-model",value:t.restaurantIsOut,expression:"restaurantIsOut"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.restaurantIsOut)?t._i(t.restaurantIsOut,null)>-1:t.restaurantIsOut},on:{change:function(e){var r=t.restaurantIsOut,n=e.target,c=!!n.checked;if(Array.isArray(r)){var o=t._i(r,null);n.checked?o<0&&(t.restaurantIsOut=r.concat([null])):o>-1&&(t.restaurantIsOut=r.slice(0,o).concat(r.slice(o+1)))}else t.restaurantIsOut=c}}}),t._v("\n        外の店である\n      ")])]),t._v(" "),r("div",{staticClass:"button",on:{click:t.add}},[t._v("追加")])]),t._v(" "),r("div",{staticClass:"modal",attrs:{id:"registerModal"}},[r("div",{staticClass:"modal-background"}),t._v(" "),r("div",{staticClass:"modal-card"},[r("header",{staticClass:"modal-card-head"},[t._m(0),t._v(" "),r("button",{staticClass:"delete",attrs:{"aria-label":"close"},on:{click:t.closeModal}})]),t._v(" "),r("section",{staticClass:"modal-card-body"},[r("p",[r("span",{staticClass:"is-size-5 has-text-weight-semibold"},[t._v(t._s(t.restaurantName))])])]),t._v(" "),r("footer",{staticClass:"modal-card-foot"},[r("button",{staticClass:"button is-success",on:{click:t.closeModal}},[t._v("OK")])])])])])},[function(){var t=this.$createElement,e=this._self._c||t;return e("p",{staticClass:"modal-card-title"},[e("span",{staticClass:"is-size-6"},[this._v("店が追加されました")])])}],!1,null,"33d6c084",null);e.default=component.exports}}]);
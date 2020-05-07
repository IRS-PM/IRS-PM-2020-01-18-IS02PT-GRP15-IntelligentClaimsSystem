(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{102:function(e,t){},103:function(e,t){},108:function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),r=a(10),l=a.n(r),c=a(14),i={defaultIntent:"WELCOME",title:"ClaimBot",agentId:window.DIALOGFLOW_AGENT_ID||"ce617fac-032a-442b-8976-36b110b58133"},s={host:window.API_HOST||"http://"+window.location.hostname+":5000"},u=a(13),d=a(23),p="SET_DIALOG_FLOW_SESSION_ID",f="ADD_TO_DIALOG_FLOW_MESSAGE_QUEUE",m="ADD_TOAST_MESSAGE",g="CLEAR_TOAST_MESSAGES",h=a(31),E=a.n(h),b={dialogFlowSessionId:"",dialogFlowMessageQueue:[],toastMessages:[]},v=Object(n.createContext)(b),y=v.Provider,w=function(e){var t=e.children,a=Object(n.useReducer)((function(e,t){switch(t.type){case g:return Object(d.a)({},e,{toastMessages:[]});case m:return Object(d.a)({},e,{toastMessages:[].concat(Object(u.a)(e.toastMessages),[t.payload])});case f:return Object(d.a)({},e,{dialogFlowMessageQueue:[].concat(Object(u.a)(e.dialogFlowMessageQueue),Object(u.a)(t.payload))});case p:if(e.dialogFlowSessionId!==t.payload)return E.a.interceptors.request.use((function(e){return e.headers=Object(d.a)({},e.headers,{Dfsessionid:t.payload}),e}),(function(e){return Promise.reject(e)})),Object(d.a)({},e,{dialogFlowSessionId:t.payload});break;default:return e}}),b),r=Object(c.a)(a,2),l=r[0],i=r[1];return o.a.createElement(y,{value:{state:l,dispatch:i}},t)};function O(e){var t=e.handleUploadTriggered,a=void 0===t?function(){}:t,n=e.handleLoadFailed,r=void 0===n?function(){}:n,l=o.a.useContext(v),c=l.state,s=l.dispatch,u=o.a.useRef(null),d=o.a.useRef(null),f=c.dialogFlowMessageQueue;o.a.useEffect((function(){if(!d.current){var e=document.createElement("df-messenger");e.setAttribute("intent",i.defaultIntent),e.setAttribute("chat-title",i.title),e.setAttribute("agent-id",i.agentId),e.setAttribute("language-code","en"),d.current=e}if(!u.current){var t=document.createElement("script");t.onerror=r,t.setAttribute("src","https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"),u.current=t}document.body.appendChild(d.current),document.head.appendChild(u.current),d.current.addEventListener("df-response-received",(function(e){e.detail.response.queryResult.fulfillmentMessages.forEach((function(e){m(e)}))}))}),[]),o.a.useEffect((function(){d.current&&d.current.sessionId&&s({type:p,payload:d.current.sessionId})}),[d.current?d.current.sessionId:null]),o.a.useEffect((function(){f.forEach((function(e){d.current.renderCustomText(e)}))}),[f.join(",")]);var m=function(e){var t=e.payload,n=void 0===t?null:t;if(n)switch(n.action){case"fileUpload":a(n.parameters.type)}};return null}var j=a(43),C=a.n(j),S=a(63),I=a(131),A=a(144),F=a(133),M=a(134),T=a(143),k=a(111),_=a(145),D=a(137),x=a(139),L=a(140),R=a(141),U=a(65),W=a(135),G=a(138);function N(e,t){var a=new FormData;return a.append("file",t),a.append("type",e),E.a.post("".concat(s.host,"/claim/uploadfile"),a,{headers:{"Content-Type":"multipart/form-data"}})}var B=Object(I.a)((function(e){return{fileContainer:{height:200,backgroundColor:e.palette.grey[100]},dropZone:{height:"100%","& h4":Object(d.a)({},e.typography.body1)},uploadedFile:{height:"100%",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center","& > *":{marginRight:e.spacing(1),"&:last-child":{marginRight:0}}},loading:{marginLeft:e.spacing(1)}}}));function Q(e){var t=e.open,a=void 0!==t&&t,n=e.uploadFileType,r=void 0===n?"hospitalBill":n,l=e.handleClose,i=void 0===l?function(){}:l,s=e.handleUploadComplete,u=void 0===s?function(e){}:s,d=B({}),p=o.a.useState(null),f=Object(c.a)(p,2),g=f[0],h=f[1],E=o.a.useState(!1),b=Object(c.a)(E,2),y=b[0],w=b[1],O=o.a.useContext(v).dispatch;o.a.useEffect((function(){a&&h(null)}),[a]);var j=function(){var e=Object(S.a)(C.a.mark((function e(){var t,a;return C.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(g){e.next=2;break}return e.abrupt("return");case 2:return e.prev=2,w(!0),e.next=6,N(r,g);case 6:t=e.sent,a=t.data,u(a),e.next=15;break;case 11:e.prev=11,e.t0=e.catch(2),O({type:m,payload:"Error uploading file"}),console.error(e.t0);case 15:return e.prev=15,w(!1),e.finish(15);case 18:case"end":return e.stop()}}),e,null,[[2,11,15,18]])})));return function(){return e.apply(this,arguments)}}();return o.a.createElement(A.a,{open:a,onClose:i,fullWidth:!0},o.a.createElement(F.a,null,"Upload Bill"),o.a.createElement(M.a,null,o.a.createElement(T.a,{className:d.fileContainer},g?o.a.createElement(T.a,{className:d.uploadedFile},o.a.createElement(W.a,null),o.a.createElement(k.a,null,g.name),o.a.createElement(_.a,{title:"Remove"},o.a.createElement(D.a,{color:"secondary",onClick:function(){return h(null)}},o.a.createElement(G.a,null)))):o.a.createElement(U.a,{acceptedMimeTypes:["image/png","image/jpg","image/jpeg","image/gif","image/bmp"],onFilesAdded:function(e){e[0]?h(e[0]):h(null)},onFilesRejected:function(e){h(null),O({type:m,payload:"This file type is not allowed"})},blockOtherDrops:!0,className:d.dropZone})),o.a.createElement("br",null),o.a.createElement(k.a,{variant:"caption"},"*Supported file formats: png, jpg, gif, and bmp")),o.a.createElement(x.a,null,o.a.createElement(L.a,{color:"secondary",onClick:i},"Cancel"),o.a.createElement(L.a,{color:"primary",variant:"contained",disabled:!g||y,onClick:j},"Submit",y&&o.a.createElement(R.a,{color:"",size:10,className:d.loading}))))}var P=a(146),q=a(142);function H(){var e=o.a.useContext(v),t=e.state,a=e.dispatch,n=o.a.useState(!1),r=Object(c.a)(n,2),l=r[0],i=r[1],s=t.toastMessages;o.a.useEffect((function(){i(!0)}),[s.join(",")]);var u=function(){i(!1),a({type:g})};return o.a.createElement(o.a.Fragment,null,s.map((function(e,t){return o.a.createElement(P.a,{open:l,autoHideDuration:6e3,onClose:u,key:t},o.a.createElement(q.a,{style:{backgroundColor:"rgb(220, 0, 78)"},message:e}))})))}var J=function(){var e=o.a.useContext(v),t=(e.state,e.dispatch),a=o.a.useState(!1),n=Object(c.a)(a,2),r=n[0],l=n[1],i=o.a.useState(),s=Object(c.a)(i,2),u=s[0],d=s[1];return o.a.createElement("div",{className:"App"},o.a.createElement(H,null),o.a.createElement("div",{style:{width:"100%",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}},o.a.createElement(k.a,{variant:"h5",style:{color:"#aaa",fontWeight:100}},r?"Dialogflow failed to load. If you are currently offline, please use the dashboard to submit claims instead.":"To start, please talk to the chatbot at the bottom right of the screen.")),o.a.createElement(O,{handleUploadTriggered:function(e){d(e)},handleLoadFailed:function(){l(!0)}}),o.a.createElement(Q,{open:!!u,uploadFileType:u,handleClose:function(){d("")},handleUploadComplete:function(e){d(""),t({type:f,payload:[e.fulfillmentMessages]})}}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(w,null,o.a.createElement(J,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},59:function(e,t){},76:function(e,t,a){e.exports=a(108)}},[[76,1,2]]]);
//# sourceMappingURL=main.a1b2437d.chunk.js.map
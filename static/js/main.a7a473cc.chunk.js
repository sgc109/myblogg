(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{143:function(e,t,a){e.exports=a(286)},148:function(e,t,a){},149:function(e,t,a){},286:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(28),o=a.n(c),l=(a(148),a(149),a(117)),m=a(118),i=a(132),u=a(119),s=a(133),h=a(291),b=a(34),v=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(a=Object(i.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).state={},a.handleItemClick=function(e,t){var n=t.name;return a.setState({activeItem:n})},a}return Object(s.a)(t,e),Object(m.a)(t,[{key:"render",value:function(){var e=this.state.activeItem;return r.a.createElement(h.a,null,r.a.createElement(h.a.Item,{header:!0,as:b.b,to:"/"},"Sungho"),r.a.createElement(h.a.Item,{name:"aboutme",as:b.b,to:"/aboutme/",active:"aboutme"===e,onClick:this.handleItemClick}),r.a.createElement(h.a.Item,{name:"resume",active:"resume"===e,onClick:this.handleItemClick,href:"/resume.html"}),r.a.createElement(h.a.Item,{name:"game",href:"/game.html",active:"game"===e,onClick:this.handleItemClick}))}}]),t}(n.Component),d=a(290),p=a(29);a(276);function f(){return r.a.createElement("b",null,"Home")}function E(){return r.a.createElement("b",null,"About Me")}var g=function(){return r.a.createElement("div",{className:"App"},r.a.createElement(v,null),r.a.createElement(d.a,{src:"/public/images/background2.jpeg"}),r.a.createElement(p.a,{path:"/",exact:!0,component:f}),r.a.createElement(p.a,{path:"/aboutme/",exact:!0,component:E}))};var k=function(){return r.a.createElement(b.a,{basename:"/myblog"},r.a.createElement(g,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(k,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[143,1,2]]]);
//# sourceMappingURL=main.a7a473cc.chunk.js.map
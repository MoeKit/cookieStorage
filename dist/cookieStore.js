define("moe/cookieStore/0.0.8/cookieStore",[],function(a,b,c){var d=Object.prototype,e=d.hasOwnProperty,f=function(a){return a===Object(a)},g=function(a,b){return e.call(a,b)},h=Object.keys,i=function(a){if(!f(a))return[];if(h)return h(a);var b=[];for(var c in a)g(a,c)&&b.push(c);return b},j=function(a,b,c){var d=Array.prototype,e=d.forEach,f={};if(null==a)return a;if(e&&a.forEach===e)a.forEach(b,c);else if(a.length===+a.length){for(var g=0,h=a.length;h>g;g++)if(b.call(c,a[g],g,a)===f)return}else for(var j=i(a),g=0,h=j.length;h>g;g++)if(b.call(c,a[j[g]],j[g],a)===f)return;return a},k=k||function(){var a;return a=function(){var a,b,c,d,e;return e=function(a){return a=a.replace(/,/g,"%2C"),a=a.replace(/;/g,"%3B"),a=a.replace(/\s/g,"%20"),a=a.replace(/\|/g,"%7C")},d=function(a){return new RegExp("(?:^|;\\s*)"+encodeURI(a).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=").test(document.cookie)},a=function(a,b,c){c=c||{};var d=encodeURI(a)+"="+b+";path=/";if(c.domain&&(d+=";domain="+c.domain),c.expires){var e=new Date(+new Date+24*c.expires*60*60*1e3).toGMTString();d+=";expires="+e}document.cookie=d},b=function(a){return d(a)?decodeURIComponent(document.cookie.replace(new RegExp("(?:^|.*;\\s*)"+encodeURI(a).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"),"$1")):null},c=function(a){var b=new Date;b.setDate(b.getDate()-1),document.cookie=encodeURI(a)+"=expired;expires="+b.toGMTString()+";path=/"},{set:a,get:b,remove:c,isSet:d,encode:e}}(),{CookieManager:a}}(),l=l||function(){function a(a,b){this.prefix=a,this.cookieOption=b,this.loadStores()}var b,c;return c=4096,b=k.CookieManager,a.prototype.persist=function(){var a,d,e=0,f={},g=this;j(this.kvstore,function(h,i){a=g.prefix+e,d=f[a]||"",g.cookieSize(d)+g.entrySize(i)>c&&(e+=1),d+=i+"="+b.encode(h)+"|",f[a]=d}),g.clearStores(),j(f,function(a,c){b.set(c,a,g.cookieOption)})},a.prototype.listStores=function(){var a=new RegExp(this.prefix+"\\d+","g");return document.cookie.match(a)||[]},a.prototype.clearStores=function(){j(this.listStores(),function(a){b.remove(a)})},a.prototype.loadStores=function(){var a,c,d={};j(this.listStores(),function(e){a=b.get(e),j(a.split("|"),function(a){c=a.split("="),c[0]&&(d[c[0]]=c[1])})}),this.kvstore=d},a.prototype.entrySize=function(a){return a.length+1+(this.kvstore[a]?b.encode(this.kvstore[a]).length:0)},a.prototype.cookieSize=function(a){return this.prefix.length+2+(a?b.encode(a).length:0)},a.prototype.put=function(a,b){this.kvstore[a]=b,this.persist()},a.prototype.get=function(a){return this.kvstore[a]},a.prototype.remove=function(a){delete this.kvstore[a],this.persist()},a}();c.exports=l});

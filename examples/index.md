# 演示文档

---

````javascript
seajs.use('index', function(cookieStore){
     var test = new cookieStore('cskv_');
     console.log(test);
     test.remove('aa');
     console.log(test.get('aa'));
     test.put('aa','bb');
     console.log(test.get('aa'));
});
````

# cookieStore

---

避免浪费多个cookie名，多个前端`cookie`值保存到一个cookie里

---

## 使用说明

站内使用，请手动设置cookie保存域名，全域为 `seedit.com`

````javascript
var test = new cookieStore('fe_',{
    domain: 'seedit.com'
});
// 删除
test.remove('aa');
// 获取
console.log(test.get('aa'));
// 保存
test.put('aa','bb');
console.log(test.get('aa'));
````

## API

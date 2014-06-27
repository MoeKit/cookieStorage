# cookieStore

---

[![Build Status](https://travis-ci.org/MoeKit/cookieStorage.svg?branch=moe)](https://travis-ci.org/MoeKit/cookieStorage)
[![Coverage Status](https://coveralls.io/repos/MoeKit/cookieStorage/badge.png?branch=moe)](https://coveralls.io/r/MoeKit/cookieStorage?branch=moe)

---

避免浪费多个cookie名，多个前端`cookie`值保存到一个cookie里

当命名空间为`fe_`时，所有cookie保存在`fe_0`为名的cookie里，为`fe_0`保存的值达到浏览器允许字符数时，会自动创建`fe_1`的cookie.

## 使用说明

站内使用，请手动设置cookie保存域名，全域为 `seedit.com`

````javascript
var test = new cookieStore('fe_',{
    domain: 'seedit.com',
    expires: 365
});
// 删除
test.remove('aa');
// 获取
console.log(test.get('aa'));
// 保存
test.put('aa','bb');
console.log(test.get('aa'));
````

## 注意

+ 能不用cookie就不用cookie
+ 能不设置到全域就不设置到全域
+ 可以设置到特定path就不要设置到'/'
+ 前端cookie命名空间为 `fe_`
+ 尽量在需求下线时清除掉已经设定的cookie

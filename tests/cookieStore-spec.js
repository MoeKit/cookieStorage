var ObjProto = Object.prototype ,
    hasOwnProperty = ObjProto.hasOwnProperty,
    isObject = function (obj) {
        return obj === Object(obj);
    },
    has = function (obj, key) {
        return hasOwnProperty.call(obj, key);
    },
    nativeKeys = Object.keys,
    getKeys = function (obj) {
        if (!isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj) if (has(obj, key)) keys.push(key);
        return keys;
    };


var each = function (obj, iterator, context) {
    var ArrayProto = Array.prototype;
    var nativeForEach = ArrayProto.forEach;
    var breaker = {};
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
        for (var i = 0, length = obj.length; i < length; i++) {
            if (iterator.call(context, obj[i], i, obj) === breaker) return;
        }
    } else {
        var keys = getKeys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
        }
    }
    return obj;
};

var CookieStorage =(function () {
    var CookieManager;

    CookieManager = (function () {
        var set, get, remove, isSet, encode;

        encode = function (s) {
            s = s.replace(/,/g, '%2C');
            s = s.replace(/;/g, '%3B');
            s = s.replace(/\s/g, '%20');
            s = s.replace(/\|/g, '%7C');

            return s;
        };

        isSet = function (name) {
            return (new RegExp("(?:^|;\\s*)" + encodeURI(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        };

        set = function (name, value, option) {
            option = option || {};
            var cookie = encodeURI(name) + "=" + value + ";path=/";
            if (option.domain) {
                cookie += ';domain=' + option.domain;
            }
            if (option.expires) {
                var expires = new Date((+new Date()) + option.expires * 24 * 60 * 60 * 1000).toGMTString();
                cookie += ';expires=' + expires;
            }
            document.cookie = cookie;
        };

        get = function (name) {
            if (!isSet(name)) {
                return null;
            }
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + encodeURI(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
        };

        remove = function (name) {
            var oExpDate = new Date();
            oExpDate.setDate(oExpDate.getDate() - 1);
            document.cookie = encodeURI(name) + "=expired;expires=" + oExpDate.toGMTString() + ";path=/";
        };

        return {
            set: set,
            get: get,
            remove: remove,
            isSet: isSet,
            encode: encode
        };

    }());


     return CookieManager

}());

define(function(require) {

  var CookieStore = require('cookieStore');
  var expect = require('expect');
  var _ = require('gallery/underscore/1.6.0/underscore');
    describe('cookie-storage', function () {
        var cs = new CookieStore('cskv_'),
            cm = CookieStorage,
            clearCookies,
            getRandomArbitary,
            randomWords;

        clearCookies = function () {
            each(document.cookie.split(';'), function (cookie) {
                var name = cookie.split('='),
                    oExpDate = new Date();

                oExpDate.setDate(oExpDate.getDate() - 1);
                document.cookie = escape(name[0]) + "=; expires=" + oExpDate.toGMTString() + "; path=/";
            });
        };

        getRandomArbitary = function (min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        };

        randomWords = function (count) {
            var letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
                minSize = 3,
                maxSize = 16,
                result = '';

            _(count).times(function (n) {
                _(getRandomArbitary(minSize, maxSize)).times(function () {
                    result += letters[getRandomArbitary(0, letters.length)];
                });

                if (n < count - 1) {
                    result += ' ';
                }
            });

            return result;
        };

        beforeEach(function () {
            clearCookies();
        });

        afterEach(function(){
            clearCookies();
        });

        /*
         * CookieStorage.CookieManger
         */
        describe('cookie-manager', function () {
            it('should return null', function () {
                expect(cm.get('does_not_exist')).to.be(null);
            });

            it('should get what was just set', function () {
                var varName = 'shouldEquals',
                    varValue = 'a test string ? ; = ,';
                cm.set(varName, cm.encode(varValue));

                expect(cm.get(varName)).to.be(varValue);
            });

            it('should remove the cookie', function () {
                var name = "cookieName",
                    value = "value";

                cm.set(name, value);
                expect(cm.get(name)).to.be(value);

                cm.remove(name);
                expect(cm.get(name)).to.be(null);
            });

            it('should pass when set, fail when not set', function () {
                var name = "cookieName",
                    value = "value";

                cm.set(name, value);
                expect(cm.isSet(name)).to.be(true);

                cm.remove(name);
                expect(cm.isSet(name)).to.be(false);
            });
        });

        /*
         * CookieStorage
         */
        it('should have a cookie size of 0', function () {
            expect(document.cookie.length).to.be(0);
        });

        it('should "get" same data that was "put"', function () {
            var name = "cookieName",
                value = "value";

            cs.put(name, value);
            expect(cs.get(name)).to.be(value);
        });

        it('should have an expected length', function () {
            var name = "name",
                value = "her royal majesty queen elizabeth ii";
            cs.put(name, value);
            expect(cs.entrySize('name')).to.be(51);
        });

        it('should have a no cookie stores', function () {
            cs.clearStores();
            cs.loadStores();
            expect(cs.listStores().length).to.be(0);
        });

        it('should have a single cookie store', function () {
            var name = "cookieName",
                value = "value";
            cs.loadStores();
            expect(cs.listStores().length).to.be(0);
            cs.put(name, value);
            expect(cs.listStores().length).to.be(1);
        });

        it('should remove the specified cookie', function () {
            cs.put('test', 'testvalue');
            expect(cs.get('test')).to.be('testvalue');
            cs.remove('test');
            expect(cs.get('test')).to.be(undefined);
        });

        it('should span multiple cookie stores', function () {
            var numEntries = 80;

            cs.loadStores();

            _(numEntries).times(function () {
                cs.put(randomWords(1), randomWords(getRandomArbitary(1, 11)));
            });

            expect(cs.listStores().length > 1).to.be(true);
        });
    });

});

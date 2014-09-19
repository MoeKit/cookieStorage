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


var CookieStorage = CookieStorage || (function () {
    var CookieManager;

    CookieManager = (function () {
        var set, get, remove, isSet, encode;

        encode = function (s) {
            s = s +''; // convert to string
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

    return {
        CookieManager: CookieManager
    };
}());

var CookieStore = CookieStore || (function () {
    var CookieManager, MAX_COOKIE_LENGTH;

    MAX_COOKIE_LENGTH = 4096;
    CookieManager = CookieStorage.CookieManager;

    function CookieStore(namespace, cookieOption) {
        this.prefix = namespace;
        this.cookieOption = cookieOption;
        this.loadStores();
    }

    CookieStore.prototype.persist = function () {
        var vCookieKey,
            vCookieVal,
            index = 0,
            vCookie = {},
            store = this;

        each(this.kvstore, function (value, key) {
            vCookieKey = store.prefix + index;
            vCookieVal = vCookie[vCookieKey] || '';

            if (store.cookieSize(vCookieVal) + store.entrySize(key) > MAX_COOKIE_LENGTH) {
                index += 1;
            }

            vCookieVal += key + '=' + CookieManager.encode(value) + '|';
            vCookie[vCookieKey] = vCookieVal;
        });

        store.clearStores();

        each(vCookie, function (value, key) {
            CookieManager.set(key, value, store.cookieOption);
        });
    };

    CookieStore.prototype.listStores = function () {
        var regEx = new RegExp(this.prefix + "\\d+", "g");
        return document.cookie.match(regEx) || [];
    };

    CookieStore.prototype.clearStores = function () {
        each(this.listStores(), function (storeKey) {
            CookieManager.remove(storeKey);
        });
    };

    CookieStore.prototype.loadStores = function () {
        var cookieVal, parts,
            kvo = {};

        each(this.listStores(), function (storeKey) {
            cookieVal = CookieManager.get(storeKey);
            each(cookieVal.split('|'), function (pair) {
                parts = pair.split("=");
                if (parts[0]) {
                    kvo[parts[0]] = parts[1];
                }
            });
        });

        this.kvstore = kvo;
    };

    /**
     * k=val
     * k.length + '='.length + kvstore[k].length
     */
    CookieStore.prototype.entrySize = function (k) {
        return k.length + 1 + (this.kvstore[k] ? CookieManager.encode(this.kvstore[k]).length : 0);
    };

    CookieStore.prototype.cookieSize = function (value) {
        return this.prefix.length + 2 + (value ? CookieManager.encode(value).length : 0);
    };

    CookieStore.prototype.put = function (k, v) {
        this.kvstore[k] = v;
        this.persist();
    };

    CookieStore.prototype.get = function (k) {
        return this.kvstore[k];
    };

    CookieStore.prototype.remove = function (k) {
        delete(this.kvstore[k]);
        this.persist();
    };

    return CookieStore;
})();

module.exports = CookieStore;

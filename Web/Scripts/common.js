function timeSpan(time) {
    this.hour;
    this.minute;
    this.second;
    
    if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
        this.hour = parseInt(time.split(":")[0]);
        this.minute = parseInt(time.split(":")[1]);
        this.second = parseInt(time.split(":")[2]);
    }
    else {
        var minutes = parseInt(time);
        this.hour = parseInt(minutes / 60);
        this.minute = minutes % 60;        
        this.second = 0;
    }

    this.add = function (t) {
        var second = 0;
        var minute = 0;
        var hour = 0;

        second = this.second + t.second;
        if (second > 59) {
            minute++;
            second = second - 60;
        }

        minute = this.minute + t.minute + minute;
        if (minute > 59) {
            hour++;
            minute = minute - 60;
        }

        hour = this.hour + t.hour + hour;

        return new timeSpan(hour + ":" + minute + ":" + second);
    };

    this.lessThan = function (t) {
        if (this.hour < t.hour)
            return true;

        if (this.minute < t.minute)
            return true;

        if (this.second < t.second)
            return true;

        return false;
    };

    this.equal = function (t) {
        return this.hour == t.hour && this.minute == t.minute && this.second == t.second;
    }

    this.toString = function () {
        var h = this.hour.toStringWithPrefix(2);
        var m = this.minute.toStringWithPrefix(2);
        var s = this.second.toStringWithPrefix(2);

        return h + ":" + m + ":" + s;
    }
}

String.prototype.toDateString = function () {
    return this.split("T")[0];
};

String.prototype.toTimeString = function () {
    return this.split("T")[1];
};

String.prototype.toDateTimeString = function () {
    return this.replace("T", " ");
};

Date.prototype.format = function (f) {
    var str = f;

    str = str.replace("YYYY", this.getFullYear());
    str = str.replace("MM", this.getMonth() + 1);
    return str;
};

Number.prototype.toStringWithPrefix = function (n) {
    return (Array(n).join('0') + this).slice(-n);
}

String.prototype.format = function (f) {
    var date;
    if (/^\d{2}:\d{2}:\d{2}$/.test(this)) {
        date = new Date("0000-01-01T" + this);
    }
    else
        date = new Date(this);

    var str = f;
    str = str.replace("YYYY", date.getFullYear());
    str = str.replace("MM", (date.getMonth() + 1).toStringWithPrefix(2));
    str = str.replace("dd", date.getDate().toStringWithPrefix(2));
    str = str.replace("hh", date.getHours().toStringWithPrefix(2));
    str = str.replace("mm", date.getMinutes().toStringWithPrefix(2));
    return str;
};

String.prototype.toMinutes = function () {
    var time = this.split(':');
    return time[0] * 60 + parseInt(time[1]);
};



function clone(obj) {
    var o;
    if (typeof obj == "object") {
        if (obj === null) {
            o = null;
        } else {
            if (obj instanceof Array) {
                o = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    o.push(clone(obj[i]));
                }
            } else {
                o = {};
                for (var j in obj) {
                    o[j] = clone(obj[j]);
                }
            }
        }
    } else {
        o = obj;
    }
    return o;
}
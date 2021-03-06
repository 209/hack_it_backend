const Stream = require("./Stream");

class MemoryStream extends Stream 
{
    constructor(ini = null) {
		super();
        this.arr = null;
        if(typeof ini == 'number')
            this.arr = new Uint8Array(ini);
        else if(ini instanceof Uint8Array) {
            this.arr = new Uint8Array(ini.length);
            this.arr.set(ini, 0);
            this.len = ini.length;
        }
    }
    write(buf, pos, len) {
        if(this.arr == null)
            this.arr = new Uint8Array(len);
        else 
            if(this.position + len > this.arr.length) {
                let maxlen = this.position + len; maxlen += maxlen / 4;
                let arr2 = new Uint8Array(maxlen);
                arr2.set(this.arr, 0);
                this.arr = arr2;
            }
        let p = this.position;
        for(let i = 0; i < len; i++)
            this.arr[p++] = buf[pos + i];
        this.position = p; if(p > this.len) this.len = p;
    }
    read(buf, pos, len) {
        if(len > this.length - this.position)
            len = this.length - this.position;
        if(len <= 0) return len;

        let p = this.position;
        for(let i = 0; i < len; i++)
            buf[pos + i] = this.arr[p++];
        this.position = p;
        return len;
    }
    toByteArray() {
        if(this.arr == null || this.len == 0) return new Uint8Array();
        let res = new Uint8Array(this.len);
        for(let i = 0; i < res.length; i++) res[i] = this.arr[i];
        return res;
    }

}
module.exports = MemoryStream

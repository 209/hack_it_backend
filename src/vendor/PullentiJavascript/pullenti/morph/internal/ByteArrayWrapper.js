/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Stream = require("./../../unisharp/Stream");
const MemoryStream = require("./../../unisharp/MemoryStream");

/**
 * Сделан специально для Питона - а то стандартым способом через MemoryStream 
 *  жутко тормозит, придётся делать самим
 */
class ByteArrayWrapper {
    
    constructor(arr) {
        this.m_array = null;
        this.m_len = 0;
        this.m_array = arr;
        this.m_len = this.m_array.length;
    }
    
    iseof(pos) {
        return pos >= this.m_len;
    }
    
    deserialize_byte(pos) {
        if (pos.value >= this.m_len) 
            return 0;
        return this.m_array[pos.value++];
    }
    
    deserialize_short(pos) {
        if ((pos.value + 1) >= this.m_len) 
            return 0;
        let b0 = this.m_array[pos.value++];
        let b1 = this.m_array[pos.value++];
        let res = b1;
        res <<= 8;
        return (res | (b0));
    }
    
    deserialize_int(pos) {
        if ((pos.value + 1) >= this.m_len) 
            return 0;
        let b0 = this.m_array[pos.value++];
        let b1 = this.m_array[pos.value++];
        let b2 = this.m_array[pos.value++];
        let b3 = this.m_array[pos.value++];
        let res = b3;
        res <<= 8;
        res |= (b2);
        res <<= 8;
        res |= (b1);
        res <<= 8;
        return (res | (b0));
    }
    
    deserialize_string(pos) {
        if (pos.value >= this.m_len) 
            return null;
        let len = this.m_array[pos.value++];
        if (len === (0xFF)) 
            return null;
        if (len === (0)) 
            return "";
        if ((pos.value + (len)) > this.m_len) 
            return null;
        let res = Utils.decodeString("UTF-8", this.m_array, pos.value, len);
        pos.value += (len);
        return res;
    }
}


module.exports = ByteArrayWrapper
/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const NumberSpellingType = require("./../../NumberSpellingType");
const Token = require("./../../Token");
const TextToken = require("./../../TextToken");

class SerializerHelper {
    
    static serialize_int(stream, val) {
        stream.write(Utils.objectToBytes(val, 'int'), 0, 4);
    }
    
    static deserialize_int(stream) {
        let buf = new Uint8Array(4);
        stream.read(buf, 0, 4);
        return Utils.bytesToObject(buf, 0, 'int', 4);
    }
    
    static serialize_short(stream, val) {
        stream.write(Utils.objectToBytes(val, 'short'), 0, 2);
    }
    
    static deserialize_short(stream) {
        let buf = new Uint8Array(2);
        stream.read(buf, 0, 2);
        return Utils.bytesToObject(buf, 0, 'short', 2);
    }
    
    static serialize_string(stream, val) {
        if (val === null) {
            SerializerHelper.serialize_int(stream, -1);
            return;
        }
        if (Utils.isNullOrEmpty(val)) {
            SerializerHelper.serialize_int(stream, 0);
            return;
        }
        let data = Utils.encodeString("UTF-8", val);
        SerializerHelper.serialize_int(stream, data.length);
        stream.write(data, 0, data.length);
    }
    
    static deserialize_string(stream) {
        let len = SerializerHelper.deserialize_int(stream);
        if (len < 0) 
            return null;
        if (len === 0) 
            return "";
        let data = new Uint8Array(len);
        stream.read(data, 0, data.length);
        return Utils.decodeString("UTF-8", data, 0, -1);
    }
    
    static serialize_tokens(stream, t, max_char) {
        let cou = 0;
        for (let tt = t; tt !== null; tt = tt.next) {
            if (max_char > 0 && tt.end_char > max_char) 
                break;
            cou++;
        }
        SerializerHelper.serialize_int(stream, cou);
        for (; cou > 0; cou--,t = t.next) {
            SerializerHelper.serialize_token(stream, t);
        }
    }
    
    static deserialize_tokens(stream, kit, vers) {
        const MetaToken = require("./../../MetaToken");
        let cou = SerializerHelper.deserialize_int(stream);
        if (cou === 0) 
            return null;
        let res = null;
        let prev = null;
        for (; cou > 0; cou--) {
            let t = SerializerHelper.deserialize_token(stream, kit, vers);
            if (t === null) 
                continue;
            if (res === null) 
                res = t;
            if (prev !== null) 
                t.previous = prev;
            prev = t;
        }
        for (let t = res; t !== null; t = t.next) {
            if (t instanceof MetaToken) 
                SerializerHelper._corr_prev_next(Utils.as(t, MetaToken), t.previous, t.next);
        }
        return res;
    }
    
    static _corr_prev_next(mt, prev, next) {
        const MetaToken = require("./../../MetaToken");
        mt.begin_token.m_previous = prev;
        mt.end_token.m_next = next;
        for (let t = mt.begin_token; t !== null && t.end_char <= mt.end_char; t = t.next) {
            if (t instanceof MetaToken) 
                SerializerHelper._corr_prev_next(Utils.as(t, MetaToken), t.previous, t.next);
        }
    }
    
    static serialize_token(stream, t) {
        const MetaToken = require("./../../MetaToken");
        const NumberToken = require("./../../NumberToken");
        const ReferentToken = require("./../../ReferentToken");
        let typ = 0;
        if (t instanceof TextToken) 
            typ = 1;
        else if (t instanceof NumberToken) 
            typ = 2;
        else if (t instanceof ReferentToken) 
            typ = 3;
        else if (t instanceof MetaToken) 
            typ = 4;
        SerializerHelper.serialize_short(stream, typ);
        if (typ === (0)) 
            return;
        t.serialize(stream);
        if (t instanceof MetaToken) 
            SerializerHelper.serialize_tokens(stream, (t).begin_token, t.end_char);
    }
    
    static deserialize_token(stream, kit, vers) {
        const MetaToken = require("./../../MetaToken");
        const NumberToken = require("./../../NumberToken");
        const ReferentToken = require("./../../ReferentToken");
        let typ = SerializerHelper.deserialize_short(stream);
        if (typ === (0)) 
            return null;
        let t = null;
        if (typ === (1)) 
            t = new TextToken(null, kit);
        else if (typ === (2)) 
            t = new NumberToken(null, null, null, NumberSpellingType.DIGIT, kit);
        else if (typ === (3)) 
            t = new ReferentToken(null, null, null, kit);
        else 
            t = new MetaToken(null, null, kit);
        t.deserialize(stream, kit, vers);
        if (t instanceof MetaToken) {
            let tt = SerializerHelper.deserialize_tokens(stream, kit, vers);
            if (tt !== null) {
                (t).m_begin_token = tt;
                for (; tt !== null; tt = tt.next) {
                    (t).m_end_token = tt;
                }
            }
        }
        return t;
    }
}


module.exports = SerializerHelper
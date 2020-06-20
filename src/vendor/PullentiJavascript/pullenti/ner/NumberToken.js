/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const RefOutArgWrapper = require("./../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../unisharp/StringBuilder");

const SerializerHelper = require("./core/internal/SerializerHelper");
const MorphGender = require("./../morph/MorphGender");
const MetaToken = require("./MetaToken");
const NumberSpellingType = require("./NumberSpellingType");

/**
 * Числовой токен (числительное)
 */
class NumberToken extends MetaToken {
    
    constructor(begin, end, val, _typ, _kit = null) {
        super(begin, end, _kit);
        this.m_value = null;
        this.m_int_val = null;
        this.m_real_val = 0;
        this.typ = NumberSpellingType.DIGIT;
        this.value = val;
        this.typ = _typ;
    }
    
    /**
     * [Get] Числовое значение (если действительное, то с точкой - разделителем дробных).
     */
    get value() {
        return this.m_value;
    }
    /**
     * [Set] Числовое значение (если действительное, то с точкой - разделителем дробных).
     */
    set value(_value) {
        const NumberHelper = require("./core/NumberHelper");
        this.m_value = (_value != null ? _value : "");
        if (this.m_value.length > 2 && this.m_value.endsWith(".0")) 
            this.m_value = this.m_value.substring(0, 0 + this.m_value.length - 2);
        while (this.m_value.length > 1 && this.m_value[0] === '0' && this.m_value[1] !== '.') {
            this.m_value = this.m_value.substring(1);
        }
        let n = 0;
        let wrapn2823 = new RefOutArgWrapper();
        let inoutres2824 = Utils.tryParseInt(this.m_value, wrapn2823);
        n = wrapn2823.value;
        if (inoutres2824) 
            this.m_int_val = n;
        else 
            this.m_int_val = null;
        let d = NumberHelper.string_to_double(this.m_value);
        if (d === null) 
            this.m_real_val = Number.NaN;
        else 
            this.m_real_val = d;
        return _value;
    }
    
    /**
     * [Get] Целочисленное 32-х битное значение. 
     *  Число может быть большое и не умещаться в Int, тогда вернёт null. 
     *  Если есть дробная часть, то тоже вернёт null. 
     *  Long не используется, так как не поддерживается в Javascript
     */
    get int_value() {
        return this.m_int_val;
    }
    /**
     * [Set] Целочисленное 32-х битное значение. 
     *  Число может быть большое и не умещаться в Int, тогда вернёт null. 
     *  Если есть дробная часть, то тоже вернёт null. 
     *  Long не используется, так как не поддерживается в Javascript
     */
    set int_value(_value) {
        this.value = _value.toString();
        return _value;
    }
    
    /**
     * [Get] Получить действительное значение из Value. Если не удалось, то NaN.
     */
    get real_value() {
        return this.m_real_val;
    }
    /**
     * [Set] Получить действительное значение из Value. Если не удалось, то NaN.
     */
    set real_value(_value) {
        const NumberHelper = require("./core/NumberHelper");
        this.value = NumberHelper.double_to_string(_value);
        return _value;
    }
    
    get is_number() {
        return true;
    }
    
    toString() {
        let res = new StringBuilder();
        res.append(this.value).append(" ").append(this.typ.toString());
        if (this.morph !== null) 
            res.append(" ").append(this.morph.toString());
        return res.toString();
    }
    
    get_normal_case_text(mc = null, single_number = false, gender = MorphGender.UNDEFINED, keep_chars = false) {
        return this.value.toString();
    }
    
    serialize(stream) {
        super.serialize(stream);
        SerializerHelper.serialize_string(stream, this.m_value);
        SerializerHelper.serialize_int(stream, this.typ.value());
    }
    
    deserialize(stream, _kit, vers) {
        super.deserialize(stream, _kit, vers);
        this.value = SerializerHelper.deserialize_string(stream);
        this.typ = NumberSpellingType.of(SerializerHelper.deserialize_int(stream));
    }
    
    static _new576(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new NumberToken(_arg1, _arg2, _arg3, _arg4);
        res.morph = _arg5;
        return res;
    }
}


module.exports = NumberToken
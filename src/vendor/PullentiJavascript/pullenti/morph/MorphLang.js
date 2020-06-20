/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const StringBuilder = require("./../unisharp/StringBuilder");

/**
 * Язык(и)
 */
class MorphLang {
    
    constructor(lng = null) {
        this.value = 0;
        this.value = 0;
        if (lng !== null) 
            this.value = lng.value;
    }
    
    get_value(i) {
        return (((((this.value) >> i)) & 1)) !== 0;
    }
    
    set_value(i, val) {
        if (val) 
            this.value |= ((1 << i));
        else 
            this.value &= (~((1 << i)));
    }
    
    /**
     * [Get] Неопределённый язык
     */
    get is_undefined() {
        return this.value === (0);
    }
    /**
     * [Set] Неопределённый язык
     */
    set is_undefined(_value) {
        this.value = 0;
        return _value;
    }
    
    /**
     * [Get] Русский язык
     */
    get is_ru() {
        return this.get_value(0);
    }
    /**
     * [Set] Русский язык
     */
    set is_ru(_value) {
        this.set_value(0, _value);
        return _value;
    }
    
    /**
     * [Get] Украинский язык
     */
    get is_ua() {
        return this.get_value(1);
    }
    /**
     * [Set] Украинский язык
     */
    set is_ua(_value) {
        this.set_value(1, _value);
        return _value;
    }
    
    /**
     * [Get] Белорусский язык
     */
    get is_by() {
        return this.get_value(2);
    }
    /**
     * [Set] Белорусский язык
     */
    set is_by(_value) {
        this.set_value(2, _value);
        return _value;
    }
    
    /**
     * [Get] Русский, украинский, белорусский или казахский язык
     */
    get is_cyrillic() {
        return (this.is_ru | this.is_ua | this.is_by) | this.is_kz;
    }
    
    /**
     * [Get] Английский язык
     */
    get is_en() {
        return this.get_value(3);
    }
    /**
     * [Set] Английский язык
     */
    set is_en(_value) {
        this.set_value(3, _value);
        return _value;
    }
    
    /**
     * [Get] Итальянский язык
     */
    get is_it() {
        return this.get_value(4);
    }
    /**
     * [Set] Итальянский язык
     */
    set is_it(_value) {
        this.set_value(4, _value);
        return _value;
    }
    
    /**
     * [Get] Казахский язык
     */
    get is_kz() {
        return this.get_value(5);
    }
    /**
     * [Set] Казахский язык
     */
    set is_kz(_value) {
        this.set_value(5, _value);
        return _value;
    }
    
    toString() {
        let tmp_str = new StringBuilder();
        for (let i = 0; i < MorphLang.m_names.length; i++) {
            if (this.get_value(i)) {
                if (tmp_str.length > 0) 
                    tmp_str.append(";");
                tmp_str.append(MorphLang.m_names[i]);
            }
        }
        return tmp_str.toString();
    }
    
    equals(obj) {
        if (!((obj instanceof MorphLang))) 
            return false;
        return this.value === (obj).value;
    }
    
    GetHashCode() {
        return this.value;
    }
    
    /**
     * Преобразовать из строки
     * @param str 
     * @param lang 
     * @return 
     */
    static try_parse(str, lang) {
        lang.value = new MorphLang();
        while (!Utils.isNullOrEmpty(str)) {
            let i = 0;
            for (i = 0; i < MorphLang.m_names.length; i++) {
                if (Utils.startsWithString(str, MorphLang.m_names[i], true)) 
                    break;
            }
            if (i >= MorphLang.m_names.length) 
                break;
            lang.value.value |= ((1 << i));
            for (i = 2; i < str.length; i++) {
                if (Utils.isLetter(str[i])) 
                    break;
            }
            if (i >= str.length) 
                break;
            str = str.substring(i);
        }
        if (lang.value.is_undefined) 
            return false;
        return true;
    }
    
    static ooBitand(arg1, arg2) {
        let val1 = 0;
        let val2 = 0;
        if (arg1 !== null) 
            val1 = arg1.value;
        if (arg2 !== null) 
            val2 = arg2.value;
        return MorphLang._new75(((val1) & (val2)));
    }
    
    static ooBitor(arg1, arg2) {
        let val1 = 0;
        let val2 = 0;
        if (arg1 !== null) 
            val1 = arg1.value;
        if (arg2 !== null) 
            val2 = arg2.value;
        return MorphLang._new75(((val1) | (val2)));
    }
    
    static ooEq(arg1, arg2) {
        let val1 = 0;
        let val2 = 0;
        if (arg1 !== null) 
            val1 = arg1.value;
        if (arg2 !== null) 
            val2 = arg2.value;
        return val1 === val2;
    }
    
    static ooNoteq(arg1, arg2) {
        let val1 = 0;
        let val2 = 0;
        if (arg1 !== null) 
            val1 = arg1.value;
        if (arg2 !== null) 
            val2 = arg2.value;
        return val1 !== val2;
    }
    
    static _new75(_arg1) {
        let res = new MorphLang();
        res.value = _arg1;
        return res;
    }
    
    static _new77(_arg1) {
        let res = new MorphLang();
        res.is_ru = _arg1;
        return res;
    }
    
    static _new78(_arg1) {
        let res = new MorphLang();
        res.is_ua = _arg1;
        return res;
    }
    
    static _new79(_arg1) {
        let res = new MorphLang();
        res.is_by = _arg1;
        return res;
    }
    
    static _new80(_arg1) {
        let res = new MorphLang();
        res.is_en = _arg1;
        return res;
    }
    
    static _new81(_arg1) {
        let res = new MorphLang();
        res.is_it = _arg1;
        return res;
    }
    
    static _new82(_arg1) {
        let res = new MorphLang();
        res.is_kz = _arg1;
        return res;
    }
    
    static static_constructor() {
        MorphLang.m_names = ["RU", "UA", "BY", "EN", "IT", "KZ"];
        MorphLang.UNKNOWN = new MorphLang();
        MorphLang.RU = MorphLang._new77(true);
        MorphLang.UA = MorphLang._new78(true);
        MorphLang.BY = MorphLang._new79(true);
        MorphLang.EN = MorphLang._new80(true);
        MorphLang.IT = MorphLang._new81(true);
        MorphLang.KZ = MorphLang._new82(true);
    }
}


MorphLang.static_constructor();

module.exports = MorphLang
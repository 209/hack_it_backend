/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../unisharp/StringBuilder");

const MorphClass = require("./MorphClass");

/**
 * Информация о символах токена
 */
class CharsInfo {
    
    constructor(ci = null) {
        this.value = 0;
        this.value = 0;
        if (ci !== null) 
            this.value = ci.value;
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
     * [Get] Все символы в верхнем регистре
     */
    get is_all_upper() {
        return this.get_value(0);
    }
    /**
     * [Set] Все символы в верхнем регистре
     */
    set is_all_upper(_value) {
        this.set_value(0, _value);
        return _value;
    }
    
    /**
     * [Get] Все символы в нижнем регистре
     */
    get is_all_lower() {
        return this.get_value(1);
    }
    /**
     * [Set] Все символы в нижнем регистре
     */
    set is_all_lower(_value) {
        this.set_value(1, _value);
        return _value;
    }
    
    /**
     * [Get] ПЕрвый символ в верхнем регистре, остальные в нижнем. 
     *  Для однобуквенной комбинации false.
     */
    get is_capital_upper() {
        return this.get_value(2);
    }
    /**
     * [Set] ПЕрвый символ в верхнем регистре, остальные в нижнем. 
     *  Для однобуквенной комбинации false.
     */
    set is_capital_upper(_value) {
        this.set_value(2, _value);
        return _value;
    }
    
    /**
     * [Get] Все символы в верхнеи регистре, кроме последнего (длина >= 3)
     */
    get is_last_lower() {
        return this.get_value(3);
    }
    /**
     * [Set] Все символы в верхнеи регистре, кроме последнего (длина >= 3)
     */
    set is_last_lower(_value) {
        this.set_value(3, _value);
        return _value;
    }
    
    /**
     * [Get] Это буквы
     */
    get is_letter() {
        return this.get_value(4);
    }
    /**
     * [Set] Это буквы
     */
    set is_letter(_value) {
        this.set_value(4, _value);
        return _value;
    }
    
    /**
     * [Get] Это латиница
     */
    get is_latin_letter() {
        return this.get_value(5);
    }
    /**
     * [Set] Это латиница
     */
    set is_latin_letter(_value) {
        this.set_value(5, _value);
        return _value;
    }
    
    /**
     * [Get] Это кириллица
     */
    get is_cyrillic_letter() {
        return this.get_value(6);
    }
    /**
     * [Set] Это кириллица
     */
    set is_cyrillic_letter(_value) {
        this.set_value(6, _value);
        return _value;
    }
    
    toString() {
        if (!this.is_letter) 
            return "Nonletter";
        let tmp_str = new StringBuilder();
        if (this.is_all_upper) 
            tmp_str.append("AllUpper");
        else if (this.is_all_lower) 
            tmp_str.append("AllLower");
        else if (this.is_capital_upper) 
            tmp_str.append("CapitalUpper");
        else if (this.is_last_lower) 
            tmp_str.append("LastLower");
        else 
            tmp_str.append("Nonstandard");
        if (this.is_latin_letter) 
            tmp_str.append(" Latin");
        else if (this.is_cyrillic_letter) 
            tmp_str.append(" Cyrillic");
        else if (this.is_letter) 
            tmp_str.append(" Letter");
        return tmp_str.toString();
    }
    
    equals(obj) {
        if (!((obj instanceof MorphClass))) 
            return false;
        return this.value === (obj).value;
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
    
    static _new2348(_arg1) {
        let res = new CharsInfo();
        res.is_capital_upper = _arg1;
        return res;
    }
    
    static _new2534(_arg1) {
        let res = new CharsInfo();
        res.is_cyrillic_letter = _arg1;
        return res;
    }
    
    static _new2540(_arg1, _arg2) {
        let res = new CharsInfo();
        res.is_cyrillic_letter = _arg1;
        res.is_capital_upper = _arg2;
        return res;
    }
    
    static _new2545(_arg1, _arg2, _arg3, _arg4) {
        let res = new CharsInfo();
        res.is_capital_upper = _arg1;
        res.is_cyrillic_letter = _arg2;
        res.is_latin_letter = _arg3;
        res.is_letter = _arg4;
        return res;
    }
    
    static _new2568(_arg1) {
        let res = new CharsInfo();
        res.is_latin_letter = _arg1;
        return res;
    }
    
    static _new2815(_arg1) {
        let res = new CharsInfo();
        res.value = _arg1;
        return res;
    }
}


module.exports = CharsInfo
/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const StringBuilder = require("./../unisharp/StringBuilder");

/**
 * Падеж
 */
class MorphCase {
    
    constructor(val = null) {
        this.value = 0;
        this.value = 0;
        if (val !== null) 
            this.value = val.value;
    }
    
    get is_undefined() {
        return this.value === (0);
    }
    set is_undefined(_value) {
        this.value = 0;
        return _value;
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
     * [Get] Количество падежей
     */
    get count() {
        if (this.value === (0)) 
            return 0;
        let cou = 0;
        for (let i = 0; i < 12; i++) {
            if ((((this.value) & ((1 << i)))) !== 0) 
                cou++;
        }
        return cou;
    }
    
    /**
     * [Get] Именительный
     */
    get is_nominative() {
        return this.get_value(0);
    }
    /**
     * [Set] Именительный
     */
    set is_nominative(_value) {
        this.set_value(0, _value);
        return _value;
    }
    
    /**
     * [Get] Родительный
     */
    get is_genitive() {
        return this.get_value(1);
    }
    /**
     * [Set] Родительный
     */
    set is_genitive(_value) {
        this.set_value(1, _value);
        return _value;
    }
    
    /**
     * [Get] Дательный
     */
    get is_dative() {
        return this.get_value(2);
    }
    /**
     * [Set] Дательный
     */
    set is_dative(_value) {
        this.set_value(2, _value);
        return _value;
    }
    
    /**
     * [Get] Винительный
     */
    get is_accusative() {
        return this.get_value(3);
    }
    /**
     * [Set] Винительный
     */
    set is_accusative(_value) {
        this.set_value(3, _value);
        return _value;
    }
    
    /**
     * [Get] Творительный
     */
    get is_instrumental() {
        return this.get_value(4);
    }
    /**
     * [Set] Творительный
     */
    set is_instrumental(_value) {
        this.set_value(4, _value);
        return _value;
    }
    
    /**
     * [Get] Предложный
     */
    get is_prepositional() {
        return this.get_value(5);
    }
    /**
     * [Set] Предложный
     */
    set is_prepositional(_value) {
        this.set_value(5, _value);
        return _value;
    }
    
    /**
     * [Get] Звательный
     */
    get is_vocative() {
        return this.get_value(6);
    }
    /**
     * [Set] Звательный
     */
    set is_vocative(_value) {
        this.set_value(6, _value);
        return _value;
    }
    
    /**
     * [Get] Частичный
     */
    get is_partial() {
        return this.get_value(7);
    }
    /**
     * [Set] Частичный
     */
    set is_partial(_value) {
        this.set_value(7, _value);
        return _value;
    }
    
    /**
     * [Get] Общий (для английского)
     */
    get is_common() {
        return this.get_value(8);
    }
    /**
     * [Set] Общий (для английского)
     */
    set is_common(_value) {
        this.set_value(8, _value);
        return _value;
    }
    
    /**
     * [Get] Притяжательный (для английского)
     */
    get is_possessive() {
        return this.get_value(9);
    }
    /**
     * [Set] Притяжательный (для английского)
     */
    set is_possessive(_value) {
        this.set_value(9, _value);
        return _value;
    }
    
    toString() {
        let tmp_str = new StringBuilder();
        for (let i = 0; i < MorphCase.m_names.length; i++) {
            if (this.get_value(i)) {
                if (tmp_str.length > 0) 
                    tmp_str.append("|");
                tmp_str.append(MorphCase.m_names[i]);
            }
        }
        return tmp_str.toString();
    }
    
    /**
     * Восстановить падежи из строки, полученной ToString
     * @param str 
     * @return 
     */
    static parse(str) {
        let res = new MorphCase();
        if (Utils.isNullOrEmpty(str)) 
            return res;
        for (const s of Utils.splitString(str, '|', false)) {
            for (let i = 0; i < MorphCase.m_names.length; i++) {
                if (s === MorphCase.m_names[i]) {
                    res.set_value(i, true);
                    break;
                }
            }
        }
        return res;
    }
    
    equals(obj) {
        if (!((obj instanceof MorphCase))) 
            return false;
        return this.value === (obj).value;
    }
    
    GetHashCode() {
        return this.value;
    }
    
    static ooBitand(arg1, arg2) {
        let val1 = 0;
        let val2 = 0;
        if (arg1 !== null) 
            val1 = arg1.value;
        if (arg2 !== null) 
            val2 = arg2.value;
        return MorphCase._new48(((val1) & (val2)));
    }
    
    static ooBitor(arg1, arg2) {
        let val1 = 0;
        let val2 = 0;
        if (arg1 !== null) 
            val1 = arg1.value;
        if (arg2 !== null) 
            val2 = arg2.value;
        return MorphCase._new48(((val1) | (val2)));
    }
    
    static ooBitxor(arg1, arg2) {
        let val1 = 0;
        let val2 = 0;
        if (arg1 !== null) 
            val1 = arg1.value;
        if (arg2 !== null) 
            val2 = arg2.value;
        return MorphCase._new48(((val1) ^ (val2)));
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
    
    static _new48(_arg1) {
        let res = new MorphCase();
        res.value = _arg1;
        return res;
    }
    
    static static_constructor() {
        MorphCase.UNDEFINED = MorphCase._new48(0);
        MorphCase.NOMINATIVE = MorphCase._new48(1);
        MorphCase.GENITIVE = MorphCase._new48(2);
        MorphCase.DATIVE = MorphCase._new48(4);
        MorphCase.ACCUSATIVE = MorphCase._new48(8);
        MorphCase.INSTRUMENTAL = MorphCase._new48(0x10);
        MorphCase.PREPOSITIONAL = MorphCase._new48(0x20);
        MorphCase.VOCATIVE = MorphCase._new48(0x40);
        MorphCase.PARTIAL = MorphCase._new48(0x80);
        MorphCase.COMMON = MorphCase._new48(0x100);
        MorphCase.POSSESSIVE = MorphCase._new48(0x200);
        MorphCase.ALL_CASES = MorphCase._new48(0x3FF);
        MorphCase.m_names = ["именит.", "родит.", "дател.", "винит.", "творит.", "предлож.", "зват.", "частич.", "общ.", "притяж."];
    }
}


MorphCase.static_constructor();

module.exports = MorphCase
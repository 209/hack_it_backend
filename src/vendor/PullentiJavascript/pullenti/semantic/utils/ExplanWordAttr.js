/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../../unisharp/StringBuilder");

/**
 * Дополнительные характеристики слова
 */
class ExplanWordAttr {
    
    constructor(val = null) {
        this.value = 0;
        this.value = 0;
        if (val !== null) 
            this.value = val.value;
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
     * [Get] Неопределённый тип
     */
    get is_undefined() {
        return this.value === (0);
    }
    /**
     * [Set] Неопределённый тип
     */
    set is_undefined(_value) {
        this.value = 0;
        return _value;
    }
    
    /**
     * [Get] Одушевлённое
     */
    get is_animated() {
        return this.get_value(0);
    }
    /**
     * [Set] Одушевлённое
     */
    set is_animated(_value) {
        this.set_value(0, _value);
        return _value;
    }
    
    /**
     * [Get] Может иметь собственное имя
     */
    get is_named() {
        return this.get_value(1);
    }
    /**
     * [Set] Может иметь собственное имя
     */
    set is_named(_value) {
        this.set_value(1, _value);
        return _value;
    }
    
    /**
     * [Get] Может иметь номер (например, Олимпиада 80)
     */
    get is_numbered() {
        return this.get_value(2);
    }
    /**
     * [Set] Может иметь номер (например, Олимпиада 80)
     */
    set is_numbered(_value) {
        this.set_value(2, _value);
        return _value;
    }
    
    /**
     * [Get] Может ли иметь числовую характеристику (длина, количество, деньги ...)
     */
    get is_measured() {
        return this.get_value(3);
    }
    /**
     * [Set] Может ли иметь числовую характеристику (длина, количество, деньги ...)
     */
    set is_measured(_value) {
        this.set_value(3, _value);
        return _value;
    }
    
    /**
     * [Get] Позитивная окраска
     */
    get is_emo_positive() {
        return this.get_value(4);
    }
    /**
     * [Set] Позитивная окраска
     */
    set is_emo_positive(_value) {
        this.set_value(4, _value);
        return _value;
    }
    
    /**
     * [Get] Негативная окраска
     */
    get is_emo_negative() {
        return this.get_value(5);
    }
    /**
     * [Set] Негативная окраска
     */
    set is_emo_negative(_value) {
        this.set_value(5, _value);
        return _value;
    }
    
    /**
     * [Get] Это животное, а не человек (для IsAnimated = true)
     */
    get is_animal() {
        return this.get_value(6);
    }
    /**
     * [Set] Это животное, а не человек (для IsAnimated = true)
     */
    set is_animal(_value) {
        this.set_value(6, _value);
        return _value;
    }
    
    /**
     * [Get] Это человек, а не животное (для IsAnimated = true)
     */
    get is_man() {
        return this.get_value(7);
    }
    /**
     * [Set] Это человек, а не животное (для IsAnimated = true)
     */
    set is_man(_value) {
        this.set_value(7, _value);
        return _value;
    }
    
    /**
     * [Get] За словом может быть персона в родительном падеже (слуга Хозяина, отец Ивана ...)
     */
    get is_can_person_after() {
        return this.get_value(8);
    }
    /**
     * [Set] За словом может быть персона в родительном падеже (слуга Хозяина, отец Ивана ...)
     */
    set is_can_person_after(_value) {
        this.set_value(8, _value);
        return _value;
    }
    
    /**
     * [Get] Пространственный объект
     */
    get is_space_object() {
        return this.get_value(9);
    }
    /**
     * [Set] Пространственный объект
     */
    set is_space_object(_value) {
        this.set_value(9, _value);
        return _value;
    }
    
    /**
     * [Get] Временной объект
     */
    get is_time_object() {
        return this.get_value(10);
    }
    /**
     * [Set] Временной объект
     */
    set is_time_object(_value) {
        this.set_value(10, _value);
        return _value;
    }
    
    /**
     * [Get] Временной объект
     */
    get is_verb_noun() {
        return this.get_value(11);
    }
    /**
     * [Set] Временной объект
     */
    set is_verb_noun(_value) {
        this.set_value(11, _value);
        return _value;
    }
    
    toString() {
        let tmp_str = new StringBuilder();
        if (this.is_animated) 
            tmp_str.append("одуш.");
        if (this.is_animal) 
            tmp_str.append("животн.");
        if (this.is_man) 
            tmp_str.append("чел.");
        if (this.is_space_object) 
            tmp_str.append("простр.");
        if (this.is_time_object) 
            tmp_str.append("времен.");
        if (this.is_named) 
            tmp_str.append("именов.");
        if (this.is_numbered) 
            tmp_str.append("нумеруем.");
        if (this.is_measured) 
            tmp_str.append("измеряем.");
        if (this.is_emo_positive) 
            tmp_str.append("позитив.");
        if (this.is_emo_negative) 
            tmp_str.append("негатив.");
        if (this.is_can_person_after) 
            tmp_str.append("персона_за_родит.");
        if (this.is_verb_noun) 
            tmp_str.append("глаг.сущ.");
        return tmp_str.toString();
    }
    
    equals(obj) {
        if (!((obj instanceof ExplanWordAttr))) 
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
        return ExplanWordAttr._new2969(((val1) & (val2)));
    }
    
    static ooBitor(arg1, arg2) {
        let val1 = 0;
        let val2 = 0;
        if (arg1 !== null) 
            val1 = arg1.value;
        if (arg2 !== null) 
            val2 = arg2.value;
        return ExplanWordAttr._new2969(((val1) | (val2)));
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
    
    static _new2969(_arg1) {
        let res = new ExplanWordAttr();
        res.value = _arg1;
        return res;
    }
    
    static static_constructor() {
        ExplanWordAttr.UNDEFINED = new ExplanWordAttr();
    }
}


ExplanWordAttr.static_constructor();

module.exports = ExplanWordAttr
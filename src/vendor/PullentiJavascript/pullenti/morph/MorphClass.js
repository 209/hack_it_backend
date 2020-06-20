/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../unisharp/StringBuilder");

/**
 * Часть речи
 */
class MorphClass {
    
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
     * [Get] Существительное
     */
    get is_noun() {
        return this.get_value(0);
    }
    /**
     * [Set] Существительное
     */
    set is_noun(_value) {
        if (_value) 
            this.value = 0;
        this.set_value(0, _value);
        return _value;
    }
    
    static is_noun_int(val) {
        return ((val & 1)) !== 0;
    }
    
    /**
     * [Get] Прилагательное
     */
    get is_adjective() {
        return this.get_value(1);
    }
    /**
     * [Set] Прилагательное
     */
    set is_adjective(_value) {
        if (_value) 
            this.value = 0;
        this.set_value(1, _value);
        return _value;
    }
    
    static is_adjective_int(val) {
        return ((val & 2)) !== 0;
    }
    
    /**
     * [Get] Глагол
     */
    get is_verb() {
        return this.get_value(2);
    }
    /**
     * [Set] Глагол
     */
    set is_verb(_value) {
        if (_value) 
            this.value = 0;
        this.set_value(2, _value);
        return _value;
    }
    
    static is_verb_int(val) {
        return ((val & 4)) !== 0;
    }
    
    /**
     * [Get] Наречие
     */
    get is_adverb() {
        return this.get_value(3);
    }
    /**
     * [Set] Наречие
     */
    set is_adverb(_value) {
        if (_value) 
            this.value = 0;
        this.set_value(3, _value);
        return _value;
    }
    
    static is_adverb_int(val) {
        return ((val & 8)) !== 0;
    }
    
    /**
     * [Get] Местоимение
     */
    get is_pronoun() {
        return this.get_value(4);
    }
    /**
     * [Set] Местоимение
     */
    set is_pronoun(_value) {
        if (_value) 
            this.value = 0;
        this.set_value(4, _value);
        return _value;
    }
    
    static is_pronoun_int(val) {
        return ((val & 0x10)) !== 0;
    }
    
    /**
     * [Get] Всякая ерунда (частицы, междометия)
     */
    get is_misc() {
        return this.get_value(5);
    }
    /**
     * [Set] Всякая ерунда (частицы, междометия)
     */
    set is_misc(_value) {
        if (_value) 
            this.value = 0;
        this.set_value(5, _value);
        return _value;
    }
    
    static is_misc_int(val) {
        return ((val & 0x20)) !== 0;
    }
    
    /**
     * [Get] Предлог
     */
    get is_preposition() {
        return this.get_value(6);
    }
    /**
     * [Set] Предлог
     */
    set is_preposition(_value) {
        this.set_value(6, _value);
        return _value;
    }
    
    static is_preposition_int(val) {
        return ((val & 0x40)) !== 0;
    }
    
    /**
     * [Get] Союз
     */
    get is_conjunction() {
        return this.get_value(7);
    }
    /**
     * [Set] Союз
     */
    set is_conjunction(_value) {
        this.set_value(7, _value);
        return _value;
    }
    
    static is_conjunction_int(val) {
        return ((val & 0x80)) !== 0;
    }
    
    /**
     * [Get] Собственное имя (фамилия, имя, отчество, геогр.название и др.)
     */
    get is_proper() {
        return this.get_value(8);
    }
    /**
     * [Set] Собственное имя (фамилия, имя, отчество, геогр.название и др.)
     */
    set is_proper(_value) {
        this.set_value(8, _value);
        return _value;
    }
    
    static is_proper_int(val) {
        return ((val & 0x100)) !== 0;
    }
    
    /**
     * [Get] Фамилия
     */
    get is_proper_surname() {
        return this.get_value(9);
    }
    /**
     * [Set] Фамилия
     */
    set is_proper_surname(_value) {
        if (_value) 
            this.is_proper = true;
        this.set_value(9, _value);
        return _value;
    }
    
    static is_proper_surname_int(val) {
        return ((val & 0x200)) !== 0;
    }
    
    /**
     * [Get] Фамилия
     */
    get is_proper_name() {
        return this.get_value(10);
    }
    /**
     * [Set] Фамилия
     */
    set is_proper_name(_value) {
        if (_value) 
            this.is_proper = true;
        this.set_value(10, _value);
        return _value;
    }
    
    static is_proper_name_int(val) {
        return ((val & 0x400)) !== 0;
    }
    
    /**
     * [Get] Отчество
     */
    get is_proper_secname() {
        return this.get_value(11);
    }
    /**
     * [Set] Отчество
     */
    set is_proper_secname(_value) {
        if (_value) 
            this.is_proper = true;
        this.set_value(11, _value);
        return _value;
    }
    
    static is_proper_secname_int(val) {
        return ((val & 0x800)) !== 0;
    }
    
    /**
     * [Get] Географическое название
     */
    get is_proper_geo() {
        return this.get_value(12);
    }
    /**
     * [Set] Географическое название
     */
    set is_proper_geo(_value) {
        if (_value) 
            this.is_proper = true;
        this.set_value(12, _value);
        return _value;
    }
    
    static is_proper_geo_int(val) {
        return ((val & 0x1000)) !== 0;
    }
    
    /**
     * [Get] Личное местоимение (я, мой, ты, он ...)
     */
    get is_personal_pronoun() {
        return this.get_value(13);
    }
    /**
     * [Set] Личное местоимение (я, мой, ты, он ...)
     */
    set is_personal_pronoun(_value) {
        this.set_value(13, _value);
        return _value;
    }
    
    static is_personal_pronoun_int(val) {
        return ((val & 0x2000)) !== 0;
    }
    
    toString() {
        let tmp_str = new StringBuilder();
        for (let i = 0; i < MorphClass.m_names.length; i++) {
            if (this.get_value(i)) {
                if (i === 5) {
                    if (this.is_conjunction || this.is_preposition || this.is_proper) 
                        continue;
                }
                if (tmp_str.length > 0) 
                    tmp_str.append("|");
                tmp_str.append(MorphClass.m_names[i]);
            }
        }
        return tmp_str.toString();
    }
    
    equals(obj) {
        if (!((obj instanceof MorphClass))) 
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
        return MorphClass._new63(((val1) & (val2)));
    }
    
    static ooBitor(arg1, arg2) {
        let val1 = 0;
        let val2 = 0;
        if (arg1 !== null) 
            val1 = arg1.value;
        if (arg2 !== null) 
            val2 = arg2.value;
        return MorphClass._new63(((val1) | (val2)));
    }
    
    static ooBitxor(arg1, arg2) {
        let val1 = 0;
        let val2 = 0;
        if (arg1 !== null) 
            val1 = arg1.value;
        if (arg2 !== null) 
            val2 = arg2.value;
        return MorphClass._new63(((val1) ^ (val2)));
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
    
    static _new63(_arg1) {
        let res = new MorphClass();
        res.value = _arg1;
        return res;
    }
    
    static _new66(_arg1) {
        let res = new MorphClass();
        res.is_undefined = _arg1;
        return res;
    }
    
    static _new67(_arg1) {
        let res = new MorphClass();
        res.is_noun = _arg1;
        return res;
    }
    
    static _new68(_arg1) {
        let res = new MorphClass();
        res.is_pronoun = _arg1;
        return res;
    }
    
    static _new69(_arg1) {
        let res = new MorphClass();
        res.is_personal_pronoun = _arg1;
        return res;
    }
    
    static _new70(_arg1) {
        let res = new MorphClass();
        res.is_verb = _arg1;
        return res;
    }
    
    static _new71(_arg1) {
        let res = new MorphClass();
        res.is_adjective = _arg1;
        return res;
    }
    
    static _new72(_arg1) {
        let res = new MorphClass();
        res.is_adverb = _arg1;
        return res;
    }
    
    static _new73(_arg1) {
        let res = new MorphClass();
        res.is_preposition = _arg1;
        return res;
    }
    
    static _new74(_arg1) {
        let res = new MorphClass();
        res.is_conjunction = _arg1;
        return res;
    }
    
    static _new2560(_arg1) {
        let res = new MorphClass();
        res.is_proper_surname = _arg1;
        return res;
    }
    
    static static_constructor() {
        MorphClass.m_names = ["существ.", "прилаг.", "глагол", "наречие", "местоим.", "разное", "предлог", "союз", "собств.", "фамилия", "имя", "отч.", "геогр.", "личн.местоим."];
        MorphClass.UNDEFINED = MorphClass._new66(true);
        MorphClass.NOUN = MorphClass._new67(true);
        MorphClass.PRONOUN = MorphClass._new68(true);
        MorphClass.PERSONAL_PRONOUN = MorphClass._new69(true);
        MorphClass.VERB = MorphClass._new70(true);
        MorphClass.ADJECTIVE = MorphClass._new71(true);
        MorphClass.ADVERB = MorphClass._new72(true);
        MorphClass.PREPOSITION = MorphClass._new73(true);
        MorphClass.CONJUNCTION = MorphClass._new74(true);
    }
}


MorphClass.static_constructor();

module.exports = MorphClass
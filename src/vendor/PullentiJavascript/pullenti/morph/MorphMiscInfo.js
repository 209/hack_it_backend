/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const StringBuilder = require("./../unisharp/StringBuilder");

const MorphMood = require("./MorphMood");
const MorphVoice = require("./MorphVoice");
const MorphForm = require("./MorphForm");
const MorphPerson = require("./MorphPerson");
const MorphTense = require("./MorphTense");
const MorphAspect = require("./MorphAspect");

/**
 * Дополнительная морфологическая информация
 */
class MorphMiscInfo {
    
    constructor() {
        this.m_attrs = new Array();
        this.m_value = 0;
        this.id = 0;
    }
    
    /**
     * [Get] Дополнительные атрибуты
     */
    get attrs() {
        return this.m_attrs;
    }
    
    get_value(i) {
        return (((((this.m_value) >> i)) & 1)) !== 0;
    }
    
    set_value(i, val) {
        if (val) 
            this.m_value |= ((1 << i));
        else 
            this.m_value &= (~((1 << i)));
    }
    
    _add_attr(attr) {
        if (!this.m_attrs.includes(attr)) 
            this.m_attrs.push(attr);
    }
    
    clone() {
        let res = new MorphMiscInfo();
        res.m_value = this.m_value;
        res.m_attrs.splice(res.m_attrs.length, 0, ...this.m_attrs);
        return res;
    }
    
    /**
     * [Get] Лицо
     */
    get person() {
        let res = MorphPerson.UNDEFINED;
        if (this.m_attrs.includes("1 л.")) 
            res = MorphPerson.of((res.value()) | (MorphPerson.FIRST.value()));
        if (this.m_attrs.includes("2 л.")) 
            res = MorphPerson.of((res.value()) | (MorphPerson.SECOND.value()));
        if (this.m_attrs.includes("3 л.")) 
            res = MorphPerson.of((res.value()) | (MorphPerson.THIRD.value()));
        return res;
    }
    /**
     * [Set] Лицо
     */
    set person(value) {
        if ((((value.value()) & (MorphPerson.FIRST.value()))) !== (MorphPerson.UNDEFINED.value())) 
            this._add_attr("1 л.");
        if ((((value.value()) & (MorphPerson.SECOND.value()))) !== (MorphPerson.UNDEFINED.value())) 
            this._add_attr("2 л.");
        if ((((value.value()) & (MorphPerson.THIRD.value()))) !== (MorphPerson.UNDEFINED.value())) 
            this._add_attr("3 л.");
        return value;
    }
    
    /**
     * [Get] Время (для глаголов)
     */
    get tense() {
        if (this.m_attrs.includes("п.вр.")) 
            return MorphTense.PAST;
        if (this.m_attrs.includes("н.вр.")) 
            return MorphTense.PRESENT;
        if (this.m_attrs.includes("б.вр.")) 
            return MorphTense.FUTURE;
        return MorphTense.UNDEFINED;
    }
    /**
     * [Set] Время (для глаголов)
     */
    set tense(value) {
        if (value === MorphTense.PAST) 
            this._add_attr("п.вр.");
        if (value === MorphTense.PRESENT) 
            this._add_attr("н.вр.");
        if (value === MorphTense.FUTURE) 
            this._add_attr("б.вр.");
        return value;
    }
    
    /**
     * [Get] Аспект (совершенный - несовершенный)
     */
    get aspect() {
        if (this.m_attrs.includes("нес.в.")) 
            return MorphAspect.IMPERFECTIVE;
        if (this.m_attrs.includes("сов.в.")) 
            return MorphAspect.PERFECTIVE;
        return MorphAspect.UNDEFINED;
    }
    /**
     * [Set] Аспект (совершенный - несовершенный)
     */
    set aspect(value) {
        if (value === MorphAspect.IMPERFECTIVE) 
            this._add_attr("нес.в.");
        if (value === MorphAspect.PERFECTIVE) 
            this._add_attr("сов.в.");
        return value;
    }
    
    /**
     * [Get] Наклонение (для глаголов)
     */
    get mood() {
        if (this.m_attrs.includes("пов.накл.")) 
            return MorphMood.IMPERATIVE;
        return MorphMood.UNDEFINED;
    }
    /**
     * [Set] Наклонение (для глаголов)
     */
    set mood(value) {
        if (value === MorphMood.IMPERATIVE) 
            this._add_attr("пов.накл.");
        return value;
    }
    
    /**
     * [Get] Залог (для глаголов)
     */
    get voice() {
        if (this.m_attrs.includes("дейст.з.")) 
            return MorphVoice.ACTIVE;
        if (this.m_attrs.includes("страд.з.")) 
            return MorphVoice.PASSIVE;
        return MorphVoice.UNDEFINED;
    }
    /**
     * [Set] Залог (для глаголов)
     */
    set voice(value) {
        if (value === MorphVoice.ACTIVE) 
            this._add_attr("дейст.з.");
        if (value === MorphVoice.PASSIVE) 
            this._add_attr("страд.з.");
        return value;
    }
    
    /**
     * [Get] Форма (краткая, синонимичная)
     */
    get form() {
        if (this.m_attrs.includes("к.ф.")) 
            return MorphForm.SHORT;
        if (this.m_attrs.includes("синоним.форма")) 
            return MorphForm.SYNONYM;
        if (this.is_synonym_form) 
            return MorphForm.SYNONYM;
        return MorphForm.UNDEFINED;
    }
    
    /**
     * [Get] Синонимическая форма
     */
    get is_synonym_form() {
        return this.get_value(0);
    }
    /**
     * [Set] Синонимическая форма
     */
    set is_synonym_form(value) {
        this.set_value(0, value);
        return value;
    }
    
    toString() {
        if (this.m_attrs.length === 0 && this.m_value === (0)) 
            return "";
        let res = new StringBuilder();
        if (this.is_synonym_form) 
            res.append("синоним.форма ");
        for (let i = 0; i < this.m_attrs.length; i++) {
            res.append(this.m_attrs[i]).append(" ");
        }
        return Utils.trimEndString(res.toString());
    }
}


module.exports = MorphMiscInfo
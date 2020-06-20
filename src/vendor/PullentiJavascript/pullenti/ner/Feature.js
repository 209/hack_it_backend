/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const StringBuilder = require("./../unisharp/StringBuilder");

/**
 * Атрибут класса сущностей
 */
class Feature {
    
    constructor() {
        this._name = null;
        this._caption = null;
        this._lowerbound = 0;
        this._upperbound = 0;
        this._showasparent = false;
        this.inner_values = new Array();
        this.outer_values = new Array();
        this.outer_valuesen = new Array();
        this.outer_valuesua = new Array();
    }
    
    /**
     * [Get] Внутреннее имя
     */
    get name() {
        return this._name;
    }
    /**
     * [Set] Внутреннее имя
     */
    set name(value) {
        this._name = value;
        return this._name;
    }
    
    /**
     * [Get] Заголовок
     */
    get caption() {
        return this._caption;
    }
    /**
     * [Set] Заголовок
     */
    set caption(value) {
        this._caption = value;
        return this._caption;
    }
    
    /**
     * [Get] Минимальное количество
     */
    get lower_bound() {
        return this._lowerbound;
    }
    /**
     * [Set] Минимальное количество
     */
    set lower_bound(value) {
        this._lowerbound = value;
        return this._lowerbound;
    }
    
    /**
     * [Get] Максимальное количество (0 - неограничено)
     */
    get upper_bound() {
        return this._upperbound;
    }
    /**
     * [Set] Максимальное количество (0 - неограничено)
     */
    set upper_bound(value) {
        this._upperbound = value;
        return this._upperbound;
    }
    
    /**
     * [Get] Это для внутреннего использования
     */
    get show_as_parent() {
        return this._showasparent;
    }
    /**
     * [Set] Это для внутреннего использования
     */
    set show_as_parent(value) {
        this._showasparent = value;
        return this._showasparent;
    }
    
    toString() {
        let res = new StringBuilder(Utils.notNull(this.caption, this.name));
        if (this.upper_bound > 0 || this.lower_bound > 0) {
            if (this.upper_bound === 0) 
                res.append("[").append(this.lower_bound).append("..*]");
            else if (this.upper_bound === this.lower_bound) 
                res.append("[").append(this.upper_bound).append("]");
            else 
                res.append("[").append(this.lower_bound).append("..").append(this.upper_bound).append("]");
        }
        return res.toString();
    }
    
    convert_inner_value_to_outer_value(inner_value, lang = null) {
        if (inner_value === null) 
            return null;
        let val = inner_value.toString();
        for (let i = 0; i < this.inner_values.length; i++) {
            if (Utils.compareStrings(this.inner_values[i], val, true) === 0 && (i < this.outer_values.length)) {
                if (lang !== null) {
                    if (lang.is_ua && (i < this.outer_valuesua.length) && this.outer_valuesua[i] !== null) 
                        return this.outer_valuesua[i];
                    if (lang.is_en && (i < this.outer_valuesen.length) && this.outer_valuesen[i] !== null) 
                        return this.outer_valuesen[i];
                }
                return this.outer_values[i];
            }
        }
        return inner_value;
    }
    
    convert_outer_value_to_inner_value(outer_value) {
        let val = Utils.asString(outer_value);
        if (val === null) 
            return outer_value;
        for (let i = 0; i < this.outer_values.length; i++) {
            if (Utils.compareStrings(this.outer_values[i], val, true) === 0 && (i < this.inner_values.length)) 
                return this.inner_values[i];
            else if ((i < this.outer_valuesua.length) && this.outer_valuesua[i] === val) 
                return this.inner_values[i];
        }
        return outer_value;
    }
    
    add_value(int_val, ext_val, ext_val_ua = null, ext_val_eng = null) {
        this.inner_values.push(int_val);
        this.outer_values.push(ext_val);
        this.outer_valuesua.push(ext_val_ua);
        this.outer_valuesen.push(ext_val_eng);
    }
    
    static _new2851(_arg1, _arg2, _arg3, _arg4) {
        let res = new Feature();
        res.name = _arg1;
        res.caption = _arg2;
        res.lower_bound = _arg3;
        res.upper_bound = _arg4;
        return res;
    }
}


module.exports = Feature
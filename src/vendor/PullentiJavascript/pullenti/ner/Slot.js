/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const StringBuilder = require("./../unisharp/StringBuilder");

const Referent = require("./Referent");
const Token = require("./Token");
const MorphLang = require("./../morph/MorphLang");

/**
 * Значение атрибута в конкретном экземпляре сущности
 */
class Slot {
    
    constructor() {
        this._typename = null;
        this._owner = null;
        this.m_value = null;
        this._count = 0;
        this._tag = null;
    }
    
    get type_name() {
        return this._typename;
    }
    set type_name(_value) {
        this._typename = _value;
        return this._typename;
    }
    
    get is_internal() {
        return this.type_name !== null && this.type_name[0] === '@';
    }
    
    get owner() {
        return this._owner;
    }
    set owner(_value) {
        this._owner = _value;
        return this._owner;
    }
    
    get value() {
        return this.m_value;
    }
    set value(_value) {
        this.m_value = _value;
        if (this.m_value !== null) {
            if (this.m_value instanceof Referent) {
            }
            else if (this.m_value instanceof Token) {
            }
            else if ((typeof this.m_value === 'string' || this.m_value instanceof String)) {
            }
            else 
                this.m_value = this.m_value.toString();
        }
        else {
        }
        return _value;
    }
    
    /**
     * [Get] Статистика встречаемости в объектах 
     *  (например, используется для имён организаций, чтобы статистически определить 
     *  правильное написание имени)
     */
    get count() {
        return this._count;
    }
    /**
     * [Set] Статистика встречаемости в объектах 
     *  (например, используется для имён организаций, чтобы статистически определить 
     *  правильное написание имени)
     */
    set count(_value) {
        this._count = _value;
        return this._count;
    }
    
    /**
     * [Get] Ссылка на атрибут метамодели
     */
    get defining_feature() {
        if (this.owner === null) 
            return null;
        if (this.owner.instance_of === null) 
            return null;
        return this.owner.instance_of.find_feature(this.type_name);
    }
    
    toString() {
        return this.to_string(MorphLang.UNKNOWN);
    }
    
    to_string(lang) {
        let res = new StringBuilder();
        let attr = this.defining_feature;
        if (attr !== null) {
            if (this.count > 0) 
                res.append(attr.caption).append(" (").append(this.count).append("): ");
            else 
                res.append(attr.caption).append(": ");
        }
        else 
            res.append(this.type_name).append(": ");
        if (this.value !== null) {
            if (this.value instanceof Referent) 
                res.append((this.value).to_string(false, lang, 0));
            else if (attr === null) 
                res.append(this.value.toString());
            else 
                res.append(attr.convert_inner_value_to_outer_value(this.value, null));
        }
        return res.toString();
    }
    
    convert_value_to_string(lang) {
        if (this.value === null) 
            return null;
        let attr = this.defining_feature;
        if (attr === null) 
            return this.value.toString();
        let v = attr.convert_inner_value_to_outer_value(this.value, lang);
        if (v === null) 
            return null;
        if ((typeof v === 'string' || v instanceof String)) 
            return Utils.asString(v);
        else 
            return v.toString();
    }
    
    /**
     * [Get] Используется произвольным образом
     */
    get tag() {
        return this._tag;
    }
    /**
     * [Set] Используется произвольным образом
     */
    set tag(_value) {
        this._tag = _value;
        return this._tag;
    }
    
    /**
     * Удалить слот из сущности
     */
    delete0() {
        if (this.owner !== null && this.owner.slots.includes(this)) {
            Utils.removeItem(this.owner.slots, this);
            this.owner = null;
        }
    }
    
    static _new1095(_arg1, _arg2, _arg3) {
        let res = new Slot();
        res.type_name = _arg1;
        res.tag = _arg2;
        res.count = _arg3;
        return res;
    }
    
    static _new2849(_arg1, _arg2, _arg3) {
        let res = new Slot();
        res.type_name = _arg1;
        res.value = _arg2;
        res.count = _arg3;
        return res;
    }
}


module.exports = Slot
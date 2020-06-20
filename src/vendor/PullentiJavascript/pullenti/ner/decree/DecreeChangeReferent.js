/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const ReferentEqualType = require("./../ReferentEqualType");
const Referent = require("./../Referent");
const DecreeChangeKind = require("./DecreeChangeKind");
const ReferentClass = require("./../ReferentClass");
const MetaDecreeChange = require("./internal/MetaDecreeChange");
const DecreePartReferent = require("./DecreePartReferent");
const DecreeChangeValueReferent = require("./DecreeChangeValueReferent");

/**
 * Модель изменения структурной части НПА
 */
class DecreeChangeReferent extends Referent {
    
    constructor() {
        super(DecreeChangeReferent.OBJ_TYPENAME);
        this.instance_of = MetaDecreeChange.GLOBAL_META;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let res = new StringBuilder();
        if (this.kind !== DecreeChangeKind.UNDEFINED) 
            res.append(MetaDecreeChange.KIND_FEATURE.convert_inner_value_to_outer_value(this.kind, lang)).append(" ");
        if (this.is_owner_name_and_text) 
            res.append("наименование и текст ");
        else if (this.is_owner_name) 
            res.append("наименование ");
        else if (this.is_only_text) 
            res.append("текст ");
        for (const o of this.owners) {
            res.append("'").append(o.to_string(true, lang, 0)).append("' ");
        }
        if (this.value !== null) 
            res.append(this.value.to_string(true, lang, 0)).append(" ");
        if (this.param !== null) {
            if (this.kind === DecreeChangeKind.APPEND) 
                res.append("после ");
            else if (this.kind === DecreeChangeKind.EXCHANGE) 
                res.append("вместо ");
            res.append(this.param.to_string(true, lang, 0));
        }
        return res.toString().trim();
    }
    
    get parent_referent() {
        return Utils.as(this.get_slot_value(DecreeChangeReferent.ATTR_OWNER), Referent);
    }
    
    /**
     * [Get] Классификатор
     */
    get kind() {
        let s = this.get_string_value(DecreeChangeReferent.ATTR_KIND);
        if (s === null) 
            return DecreeChangeKind.UNDEFINED;
        try {
            if (s === "Add") 
                return DecreeChangeKind.APPEND;
            let res = DecreeChangeKind.of(s);
            if (res instanceof DecreeChangeKind) 
                return DecreeChangeKind.of(res);
        } catch (ex1109) {
        }
        return DecreeChangeKind.UNDEFINED;
    }
    /**
     * [Set] Классификатор
     */
    set kind(_value) {
        if (_value !== DecreeChangeKind.UNDEFINED) 
            this.add_slot(DecreeChangeReferent.ATTR_KIND, _value.toString(), true, 0);
        return _value;
    }
    
    /**
     * [Get] Структурный элемент, в который вносится изменение (м.б. несколько)
     */
    get owners() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === DecreeChangeReferent.ATTR_OWNER && (s.value instanceof Referent)) 
                res.push(Utils.as(s.value, Referent));
        }
        return res;
    }
    
    /**
     * [Get] Внутренние изменения
     */
    get children() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === DecreeChangeReferent.ATTR_CHILD && (s.value instanceof DecreeChangeReferent)) 
                res.push(Utils.as(s.value, DecreeChangeReferent));
        }
        return res;
    }
    
    /**
     * [Get] Значение
     */
    get value() {
        return Utils.as(this.get_slot_value(DecreeChangeReferent.ATTR_VALUE), DecreeChangeValueReferent);
    }
    /**
     * [Set] Значение
     */
    set value(_value) {
        this.add_slot(DecreeChangeReferent.ATTR_VALUE, _value, true, 0);
        return _value;
    }
    
    /**
     * [Get] Дополнительный параметр (для типа Exchange - что заменяется, для Append - после чего)
     */
    get param() {
        return Utils.as(this.get_slot_value(DecreeChangeReferent.ATTR_PARAM), DecreeChangeValueReferent);
    }
    /**
     * [Set] Дополнительный параметр (для типа Exchange - что заменяется, для Append - после чего)
     */
    set param(_value) {
        this.add_slot(DecreeChangeReferent.ATTR_PARAM, _value, true, 0);
        return _value;
    }
    
    /**
     * [Get] Признак того, что изменения касаются наименования структурного элемента
     */
    get is_owner_name() {
        return this.find_slot(DecreeChangeReferent.ATTR_MISC, "NAME", true) !== null;
    }
    /**
     * [Set] Признак того, что изменения касаются наименования структурного элемента
     */
    set is_owner_name(_value) {
        if (_value) 
            this.add_slot(DecreeChangeReferent.ATTR_MISC, "NAME", false, 0);
        return _value;
    }
    
    /**
     * [Get] Признак того, что изменения касаются только текста (без заголовка)
     */
    get is_only_text() {
        return this.find_slot(DecreeChangeReferent.ATTR_MISC, "TEXT", true) !== null;
    }
    /**
     * [Set] Признак того, что изменения касаются только текста (без заголовка)
     */
    set is_only_text(_value) {
        if (_value) 
            this.add_slot(DecreeChangeReferent.ATTR_MISC, "TEXT", false, 0);
        return _value;
    }
    
    /**
     * [Get] Признак того, что изменения касаются наименования и текста структурного элемента
     */
    get is_owner_name_and_text() {
        return this.find_slot(DecreeChangeReferent.ATTR_MISC, "NAMETEXT", true) !== null;
    }
    /**
     * [Set] Признак того, что изменения касаются наименования и текста структурного элемента
     */
    set is_owner_name_and_text(_value) {
        if (_value) 
            this.add_slot(DecreeChangeReferent.ATTR_MISC, "NAMETEXT", false, 0);
        return _value;
    }
    
    can_be_equals(obj, typ = ReferentEqualType.WITHINONETEXT) {
        return obj === this;
    }
    
    check_correct() {
        if (this.kind === DecreeChangeKind.UNDEFINED) 
            return false;
        if (this.kind === DecreeChangeKind.EXPIRE || this.kind === DecreeChangeKind.REMOVE) 
            return true;
        if (this.value === null) 
            return false;
        if (this.kind === DecreeChangeKind.EXCHANGE) {
            if (this.param === null) {
                if (this.owners.length > 0 && this.owners[0].find_slot(DecreePartReferent.ATTR_INDENTION, null, true) !== null) 
                    this.kind = DecreeChangeKind.NEW;
                else 
                    return false;
            }
        }
        return true;
    }
    
    static _new1100(_arg1) {
        let res = new DecreeChangeReferent();
        res.kind = _arg1;
        return res;
    }
    
    static static_constructor() {
        DecreeChangeReferent.OBJ_TYPENAME = "DECREECHANGE";
        DecreeChangeReferent.ATTR_OWNER = "OWNER";
        DecreeChangeReferent.ATTR_KIND = "KIND";
        DecreeChangeReferent.ATTR_CHILD = "CHILD";
        DecreeChangeReferent.ATTR_VALUE = "VALUE";
        DecreeChangeReferent.ATTR_PARAM = "PARAM";
        DecreeChangeReferent.ATTR_MISC = "MISC";
    }
}


DecreeChangeReferent.static_constructor();

module.exports = DecreeChangeReferent
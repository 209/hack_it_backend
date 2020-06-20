/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const ReferentEqualType = require("./../ReferentEqualType");
const ReferentClass = require("./../ReferentClass");
const Referent = require("./../Referent");
const MetaPersonIdentity = require("./internal/MetaPersonIdentity");

/**
 * Удостоверение личности (паспорт и пр.)
 */
class PersonIdentityReferent extends Referent {
    
    constructor() {
        super(PersonIdentityReferent.OBJ_TYPENAME);
        this.instance_of = MetaPersonIdentity.global_meta;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let res = new StringBuilder();
        res.append(Utils.notNull(this.typ, "?"));
        if (this.number !== null) 
            res.append(" №").append(this.number);
        if (this.state !== null) 
            res.append(", ").append(this.state.to_string(true, lang, lev + 1));
        if (!short_variant) {
            let dat = this.get_string_value(PersonIdentityReferent.ATTR_DATE);
            let _org = this.get_string_value(PersonIdentityReferent.ATTR_ORG);
            if (dat !== null || _org !== null) {
                res.append(", выдан");
                if (dat !== null) 
                    res.append(" ").append(dat);
                if (_org !== null) 
                    res.append(" ").append(_org);
            }
        }
        return res.toString();
    }
    
    /**
     * [Get] Тип документа
     */
    get typ() {
        return this.get_string_value(PersonIdentityReferent.ATTR_TYPE);
    }
    /**
     * [Set] Тип документа
     */
    set typ(value) {
        this.add_slot(PersonIdentityReferent.ATTR_TYPE, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Номер (вместе с серией)
     */
    get number() {
        return this.get_string_value(PersonIdentityReferent.ATTR_NUMBER);
    }
    /**
     * [Set] Номер (вместе с серией)
     */
    set number(value) {
        this.add_slot(PersonIdentityReferent.ATTR_NUMBER, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Государство
     */
    get state() {
        return Utils.as(this.get_slot_value(PersonIdentityReferent.ATTR_STATE), Referent);
    }
    /**
     * [Set] Государство
     */
    set state(value) {
        this.add_slot(PersonIdentityReferent.ATTR_STATE, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Адрес регистрации
     */
    get address() {
        return Utils.as(this.get_slot_value(PersonIdentityReferent.ATTR_ADDRESS), Referent);
    }
    /**
     * [Set] Адрес регистрации
     */
    set address(value) {
        this.add_slot(PersonIdentityReferent.ATTR_ADDRESS, value, true, 0);
        return value;
    }
    
    can_be_equals(obj, _typ = ReferentEqualType.WITHINONETEXT) {
        let id = Utils.as(obj, PersonIdentityReferent);
        if (id === null) 
            return false;
        if (this.typ !== id.typ) 
            return false;
        if (this.number !== id.number) 
            return false;
        if (this.state !== null && id.state !== null) {
            if (this.state !== id.state) 
                return false;
        }
        return true;
    }
    
    static static_constructor() {
        PersonIdentityReferent.OBJ_TYPENAME = "PERSONIDENTITY";
        PersonIdentityReferent.ATTR_TYPE = "TYPE";
        PersonIdentityReferent.ATTR_NUMBER = "NUMBER";
        PersonIdentityReferent.ATTR_DATE = "DATE";
        PersonIdentityReferent.ATTR_ORG = "ORG";
        PersonIdentityReferent.ATTR_STATE = "STATE";
        PersonIdentityReferent.ATTR_ADDRESS = "ADDRESS";
    }
}


PersonIdentityReferent.static_constructor();

module.exports = PersonIdentityReferent
/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const ReferentEqualType = require("./../ReferentEqualType");
const MiscHelper = require("./../core/MiscHelper");
const BusinessFactKind = require("./BusinessFactKind");
const ReferentClass = require("./../ReferentClass");
const MetaBusinessFact = require("./internal/MetaBusinessFact");
const Referent = require("./../Referent");

/**
 * Представление бизнес-факта
 */
class BusinessFactReferent extends Referent {
    
    constructor() {
        super(BusinessFactReferent.OBJ_TYPENAME);
        this.instance_of = MetaBusinessFact.GLOBAL_META;
    }
    
    /**
     * [Get] Классификатор бизнес-факта
     */
    get kind() {
        let s = this.get_string_value(BusinessFactReferent.ATTR_KIND);
        if (s === null) 
            return BusinessFactKind.UNDEFINED;
        try {
            let res = BusinessFactKind.of(s);
            if (res instanceof BusinessFactKind) 
                return BusinessFactKind.of(res);
        } catch (ex449) {
        }
        return BusinessFactKind.UNDEFINED;
    }
    /**
     * [Set] Классификатор бизнес-факта
     */
    set kind(value) {
        if (value !== BusinessFactKind.UNDEFINED) 
            this.add_slot(BusinessFactReferent.ATTR_KIND, value.toString(), true, 0);
        return value;
    }
    
    /**
     * [Get] Краткое описание факта
     */
    get typ() {
        let _typ = this.get_string_value(BusinessFactReferent.ATTR_TYPE);
        if (_typ !== null) 
            return _typ;
        let _kind = this.get_string_value(BusinessFactReferent.ATTR_KIND);
        if (_kind !== null) 
            _typ = Utils.asString(MetaBusinessFact.GLOBAL_META.kind_feature.convert_inner_value_to_outer_value(_kind, null));
        if (_typ !== null) 
            return _typ.toLowerCase();
        return null;
    }
    /**
     * [Set] Краткое описание факта
     */
    set typ(value) {
        this.add_slot(BusinessFactReferent.ATTR_TYPE, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Кто (действительный залог)
     */
    get who() {
        return Utils.as(this.get_slot_value(BusinessFactReferent.ATTR_WHO), Referent);
    }
    /**
     * [Set] Кто (действительный залог)
     */
    set who(value) {
        this.add_slot(BusinessFactReferent.ATTR_WHO, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Второй "Кто" (действительный залог)
     */
    get who2() {
        let i = 2;
        for (const s of this.slots) {
            if (s.type_name === BusinessFactReferent.ATTR_WHO) {
                if ((--i) === 0) 
                    return Utils.as(s.value, Referent);
            }
        }
        return null;
    }
    /**
     * [Set] Второй "Кто" (действительный залог)
     */
    set who2(value) {
        this.add_slot(BusinessFactReferent.ATTR_WHO, value, false, 0);
        return value;
    }
    
    /**
     * [Get] Кого (страдательный залог)
     */
    get whom() {
        return Utils.as(this.get_slot_value(BusinessFactReferent.ATTR_WHOM), Referent);
    }
    /**
     * [Set] Кого (страдательный залог)
     */
    set whom(value) {
        this.add_slot(BusinessFactReferent.ATTR_WHOM, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Когда (DateReferent или DateRangeReferent)
     */
    get when() {
        return Utils.as(this.get_slot_value(BusinessFactReferent.ATTR_WHEN), Referent);
    }
    /**
     * [Set] Когда (DateReferent или DateRangeReferent)
     */
    set when(value) {
        this.add_slot(BusinessFactReferent.ATTR_WHEN, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Что (артефакты события)
     */
    get whats() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === BusinessFactReferent.ATTR_WHAT && (s.value instanceof Referent)) 
                res.push(Utils.as(s.value, Referent));
        }
        return res;
    }
    
    add_what(w) {
        if (w instanceof Referent) 
            this.add_slot(BusinessFactReferent.ATTR_WHAT, w, false, 0);
    }
    
    to_string(short_variant, lang, lev = 0) {
        let res = new StringBuilder();
        let _typ = Utils.notNull(this.typ, "Бизнес-факт");
        res.append(MiscHelper.convert_first_char_upper_and_other_lower(_typ));
        let v = null;
        if (((v = this.get_slot_value(BusinessFactReferent.ATTR_WHO))) instanceof Referent) {
            res.append("; Кто: ").append((v).to_string(true, lang, 0));
            if (this.who2 !== null) 
                res.append(" и ").append(this.who2.to_string(true, lang, 0));
        }
        if (((v = this.get_slot_value(BusinessFactReferent.ATTR_WHOM))) instanceof Referent) 
            res.append("; Кого: ").append((v).to_string(true, lang, 0));
        if (!short_variant) {
            if ((((v = this.get_slot_value(BusinessFactReferent.ATTR_WHAT)))) !== null) 
                res.append("; Что: ").append(v);
            if (((v = this.get_slot_value(BusinessFactReferent.ATTR_WHEN))) instanceof Referent) 
                res.append("; Когда: ").append((v).to_string(short_variant, lang, 0));
            for (const s of this.slots) {
                if (s.type_name === BusinessFactReferent.ATTR_MISC) 
                    res.append("; ").append(s.value);
            }
        }
        return res.toString();
    }
    
    can_be_equals(obj, _typ = ReferentEqualType.WITHINONETEXT) {
        let br = Utils.as(obj, BusinessFactReferent);
        if (br === null) 
            return false;
        if (br.kind !== this.kind) 
            return false;
        if (br.typ !== this.typ) 
            return false;
        if (br.who !== this.who || br.whom !== this.whom) 
            return false;
        if (this.when !== null && br.when !== null) {
            if (!this.when.can_be_equals(br.when, ReferentEqualType.WITHINONETEXT)) 
                return false;
        }
        let mi1 = Utils.as(this.get_slot_value(BusinessFactReferent.ATTR_WHAT), Referent);
        let mi2 = Utils.as(br.get_slot_value(BusinessFactReferent.ATTR_WHAT), Referent);
        if (mi1 !== null && mi2 !== null) {
            if (!mi1.can_be_equals(mi2, ReferentEqualType.WITHINONETEXT)) 
                return false;
        }
        return true;
    }
    
    static _new437(_arg1) {
        let res = new BusinessFactReferent();
        res.kind = _arg1;
        return res;
    }
    
    static _new448(_arg1, _arg2) {
        let res = new BusinessFactReferent();
        res.kind = _arg1;
        res.typ = _arg2;
        return res;
    }
    
    static static_constructor() {
        BusinessFactReferent.OBJ_TYPENAME = "BUSINESSFACT";
        BusinessFactReferent.ATTR_KIND = "KIND";
        BusinessFactReferent.ATTR_TYPE = "TYPE";
        BusinessFactReferent.ATTR_WHO = "WHO";
        BusinessFactReferent.ATTR_WHOM = "WHOM";
        BusinessFactReferent.ATTR_WHEN = "WHEN";
        BusinessFactReferent.ATTR_WHAT = "WHAT";
        BusinessFactReferent.ATTR_MISC = "MISC";
    }
}


BusinessFactReferent.static_constructor();

module.exports = BusinessFactReferent
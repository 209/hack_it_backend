/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const ReferentEqualType = require("./../ReferentEqualType");
const Referent = require("./../Referent");
const MiscHelper = require("./../core/MiscHelper");
const ReferentClass = require("./../ReferentClass");
const InstrumentParticipantMeta = require("./internal/InstrumentParticipantMeta");

/**
 * Участник НПА (для договора: продавец, агент, исполнитель и т.п.)
 */
class InstrumentParticipant extends Referent {
    
    constructor() {
        super(InstrumentParticipant.OBJ_TYPENAME);
        this.instance_of = InstrumentParticipantMeta.GLOBAL_META;
    }
    
    /**
     * [Get] Тип участника
     */
    get typ() {
        return this.get_string_value(InstrumentParticipant.ATTR_TYPE);
    }
    /**
     * [Set] Тип участника
     */
    set typ(value) {
        this.add_slot(InstrumentParticipant.ATTR_TYPE, (value === null ? null : value.toUpperCase()), true, 0);
        return value;
    }
    
    /**
     * [Get] Основание
     */
    get ground() {
        return this.get_slot_value(InstrumentParticipant.ATTR_GROUND);
    }
    /**
     * [Set] Основание
     */
    set ground(value) {
        this.add_slot(InstrumentParticipant.ATTR_GROUND, value, false, 0);
        return value;
    }
    
    to_string(short_variant, lang, lev = 0) {
        let res = new StringBuilder();
        res.append(MiscHelper.convert_first_char_upper_and_other_lower(Utils.notNull(this.typ, "?")));
        let org = Utils.as(this.get_slot_value(InstrumentParticipant.ATTR_REF), Referent);
        let del = Utils.as(this.get_slot_value(InstrumentParticipant.ATTR_DELEGATE), Referent);
        if (org !== null) {
            res.append(": ").append(org.to_string(short_variant, lang, 0));
            if (!short_variant && del !== null) 
                res.append(" (в лице ").append(del.to_string(true, lang, lev + 1)).append(")");
        }
        else if (del !== null) 
            res.append(": в лице ").append(del.to_string(short_variant, lang, lev + 1));
        return res.toString();
    }
    
    can_be_equals(obj, _typ = ReferentEqualType.WITHINONETEXT) {
        let p = Utils.as(obj, InstrumentParticipant);
        if (p === null) 
            return false;
        if (this.typ !== p.typ) 
            return false;
        let re1 = Utils.as(this.get_slot_value(InstrumentParticipant.ATTR_REF), Referent);
        let re2 = Utils.as(obj.get_slot_value(InstrumentParticipant.ATTR_REF), Referent);
        if (re1 !== null && re2 !== null) {
            if (!re1.can_be_equals(re2, _typ)) 
                return false;
        }
        return true;
    }
    
    contains_ref(r) {
        for (const s of this.slots) {
            if (((s.type_name === InstrumentParticipant.ATTR_REF || s.type_name === InstrumentParticipant.ATTR_DELEGATE)) && (s.value instanceof Referent)) {
                if (r === s.value || r.can_be_equals(Utils.as(s.value, Referent), ReferentEqualType.WITHINONETEXT)) 
                    return true;
            }
        }
        return false;
    }
    
    static _new1429(_arg1) {
        let res = new InstrumentParticipant();
        res.typ = _arg1;
        return res;
    }
    
    static static_constructor() {
        InstrumentParticipant.OBJ_TYPENAME = "INSTRPARTICIPANT";
        InstrumentParticipant.ATTR_TYPE = "TYPE";
        InstrumentParticipant.ATTR_REF = "REF";
        InstrumentParticipant.ATTR_DELEGATE = "DELEGATE";
        InstrumentParticipant.ATTR_GROUND = "GROUND";
    }
}


InstrumentParticipant.static_constructor();

module.exports = InstrumentParticipant
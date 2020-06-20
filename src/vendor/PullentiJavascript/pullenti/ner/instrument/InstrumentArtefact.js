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
const MiscHelper = require("./../core/MiscHelper");
const InstrumentArtefactMeta = require("./internal/InstrumentArtefactMeta");

/**
 * Участник НПА (для договора: продавец, агент, исполнитель и т.п.)
 */
class InstrumentArtefact extends Referent {
    
    constructor() {
        super(InstrumentArtefact.OBJ_TYPENAME);
        this.instance_of = InstrumentArtefactMeta.GLOBAL_META;
    }
    
    get typ() {
        return this.get_string_value(InstrumentArtefact.ATTR_TYPE);
    }
    set typ(_value) {
        this.add_slot(InstrumentArtefact.ATTR_TYPE, (_value === null ? null : _value.toUpperCase()), true, 0);
        return _value;
    }
    
    get value() {
        return this.get_slot_value(InstrumentArtefact.ATTR_VALUE);
    }
    set value(_value) {
        this.add_slot(InstrumentArtefact.ATTR_VALUE, _value, false, 0);
        return _value;
    }
    
    to_string(short_variant, lang, lev = 0) {
        let res = new StringBuilder();
        res.append(MiscHelper.convert_first_char_upper_and_other_lower(Utils.notNull(this.typ, "?")));
        let val = this.value;
        if (val !== null) 
            res.append(": ").append(val);
        if (!short_variant && (lev < 30)) {
            let re = Utils.as(this.get_slot_value(InstrumentArtefact.ATTR_REF), Referent);
            if (re !== null) 
                res.append(" (").append(re.to_string(short_variant, lang, lev + 1)).append(")");
        }
        return res.toString();
    }
    
    can_be_equals(obj, _typ = ReferentEqualType.WITHINONETEXT) {
        let p = Utils.as(obj, InstrumentArtefact);
        if (p === null) 
            return false;
        if (this.typ !== p.typ) 
            return false;
        if (this.value !== p.value) 
            return false;
        return true;
    }
    
    static _new1443(_arg1) {
        let res = new InstrumentArtefact();
        res.typ = _arg1;
        return res;
    }
    
    static static_constructor() {
        InstrumentArtefact.OBJ_TYPENAME = "INSTRARTEFACT";
        InstrumentArtefact.ATTR_TYPE = "TYPE";
        InstrumentArtefact.ATTR_VALUE = "VALUE";
        InstrumentArtefact.ATTR_REF = "REF";
    }
}


InstrumentArtefact.static_constructor();

module.exports = InstrumentArtefact
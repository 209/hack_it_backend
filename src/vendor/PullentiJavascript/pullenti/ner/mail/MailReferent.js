/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const ReferentEqualType = require("./../ReferentEqualType");
const GeoReferent = require("./../geo/GeoReferent");
const MailKind = require("./MailKind");
const ReferentClass = require("./../ReferentClass");
const Referent = require("./../Referent");
const PersonPropertyReferent = require("./../person/PersonPropertyReferent");
const AddressReferent = require("./../address/AddressReferent");
const MetaLetter = require("./internal/MetaLetter");
const PersonReferent = require("./../person/PersonReferent");

/**
 * Письмо (точнее, блок письма)
 */
class MailReferent extends Referent {
    
    constructor() {
        super(MailReferent.OBJ_TYPENAME);
        this.instance_of = MetaLetter.global_meta;
    }
    
    /**
     * [Get] Тип блока письма
     */
    get kind() {
        let val = this.get_string_value(MailReferent.ATTR_KIND);
        try {
            if (val !== null) 
                return MailKind.of(val);
        } catch (ex1603) {
        }
        return MailKind.UNDEFINED;
    }
    /**
     * [Set] Тип блока письма
     */
    set kind(value) {
        this.add_slot(MailReferent.ATTR_KIND, value.toString().toUpperCase(), true, 0);
        return value;
    }
    
    get text() {
        return this.get_string_value(MailReferent.ATTR_TEXT);
    }
    set text(value) {
        this.add_slot(MailReferent.ATTR_TEXT, value, true, 0);
        return value;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let res = new StringBuilder();
        res.append(String(this.kind)).append(": ");
        for (const s of this.slots) {
            if (s.type_name === MailReferent.ATTR_REF && (s.value instanceof Referent)) 
                res.append((s.value).to_string(true, lang, lev + 1)).append(", ");
        }
        if (res.length < 100) {
            let str = Utils.notNull(this.text, "");
            str = Utils.replaceString(Utils.replaceString(str, '\r', ' '), '\n', ' ');
            if (str.length > 100) 
                str = str.substring(0, 0 + 100) + "...";
            res.append(str);
        }
        return res.toString();
    }
    
    can_be_equals(obj, typ = ReferentEqualType.WITHINONETEXT) {
        return obj === this;
    }
    
    add_ref(r, lev = 0) {
        if (r === null || lev > 4) 
            return;
        if ((((r instanceof PersonReferent) || (r instanceof PersonPropertyReferent) || r.type_name === "ORGANIZATION") || r.type_name === "PHONE" || r.type_name === "URI") || (r instanceof GeoReferent) || (r instanceof AddressReferent)) 
            this.add_slot(MailReferent.ATTR_REF, r, false, 0);
        for (const s of r.slots) {
            if (s.value instanceof Referent) 
                this.add_ref(Utils.as(s.value, Referent), lev + 1);
        }
    }
    
    static _new1599(_arg1) {
        let res = new MailReferent();
        res.kind = _arg1;
        return res;
    }
    
    static static_constructor() {
        MailReferent.OBJ_TYPENAME = "MAIL";
        MailReferent.ATTR_KIND = "TYPE";
        MailReferent.ATTR_TEXT = "TEXT";
        MailReferent.ATTR_REF = "REF";
    }
}


MailReferent.static_constructor();

module.exports = MailReferent
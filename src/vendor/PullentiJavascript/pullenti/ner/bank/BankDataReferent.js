/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const Referent = require("./../Referent");
const ReferentClass = require("./../ReferentClass");
const ReferentEqualType = require("./../ReferentEqualType");
const MetaBank = require("./internal/MetaBank");
const UriReferent = require("./../uri/UriReferent");

/**
 * Банковские данные (реквизиты)
 */
class BankDataReferent extends Referent {
    
    constructor() {
        super(BankDataReferent.OBJ_TYPENAME);
        this.instance_of = MetaBank.global_meta;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let res = new StringBuilder();
        for (const s of this.slots) {
            if (s.value instanceof UriReferent) {
                if ((s.value).scheme === "Р/С") {
                    res.append(s.value.toString());
                    break;
                }
            }
        }
        if (res.length === 0) 
            res.append(Utils.notNull(this.get_string_value(BankDataReferent.ATTR_ITEM), "?"));
        if (this.parent_referent !== null && !short_variant && (lev < 20)) 
            res.append(", ").append(this.parent_referent.to_string(true, lang, lev + 1));
        return res.toString();
    }
    
    get parent_referent() {
        return Utils.as(this.get_slot_value(BankDataReferent.ATTR_BANK), Referent);
    }
    
    find_value(schema) {
        for (const s of this.slots) {
            if (s.value instanceof UriReferent) {
                let ur = Utils.as(s.value, UriReferent);
                if (ur.scheme === schema) 
                    return ur.value;
            }
        }
        return null;
    }
    
    can_be_equals(obj, typ = ReferentEqualType.WITHINONETEXT) {
        let bd = Utils.as(obj, BankDataReferent);
        if (bd === null) 
            return false;
        for (const s of this.slots) {
            if (s.type_name === BankDataReferent.ATTR_ITEM) {
                let ur = Utils.as(s.value, UriReferent);
                let val = bd.find_value(ur.scheme);
                if (val !== null) {
                    if (val !== ur.value) 
                        return false;
                }
            }
            else if (s.type_name === BankDataReferent.ATTR_BANK) {
                let b1 = Utils.as(s.value, Referent);
                let b2 = Utils.as(bd.get_slot_value(BankDataReferent.ATTR_BANK), Referent);
                if (b2 !== null) {
                    if (b1 !== b2 && !b1.can_be_equals(b2, ReferentEqualType.WITHINONETEXT)) 
                        return false;
                }
            }
        }
        return true;
    }
    
    static static_constructor() {
        BankDataReferent.OBJ_TYPENAME = "BANKDATA";
        BankDataReferent.ATTR_ITEM = "ITEM";
        BankDataReferent.ATTR_BANK = "BANK";
        BankDataReferent.ATTR_CORBANK = "CORBANK";
        BankDataReferent.ATTR_MISC = "MISC";
    }
}


BankDataReferent.static_constructor();

module.exports = BankDataReferent
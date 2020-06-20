/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const Termin = require("./../core/Termin");
const IntOntologyItem = require("./../core/IntOntologyItem");
const KeywordType = require("./KeywordType");
const ReferentClass = require("./../ReferentClass");
const ReferentEqualType = require("./../ReferentEqualType");
const Referent = require("./../Referent");
const KeywordMeta = require("./internal/KeywordMeta");

/**
 * Оформление ключевых слов и комбинаций
 */
class KeywordReferent extends Referent {
    
    constructor() {
        super(KeywordReferent.OBJ_TYPENAME);
        this.rank = 0;
        this.instance_of = KeywordMeta.GLOBAL_META;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let _rank = this.rank;
        let val = this.get_string_value(KeywordReferent.ATTR_VALUE);
        if (val === null) {
            let r = Utils.as(this.get_slot_value(KeywordReferent.ATTR_REF), Referent);
            if (r !== null) 
                val = r.to_string(true, lang, lev + 1);
            else 
                val = this.get_string_value(KeywordReferent.ATTR_NORMAL);
        }
        if (short_variant) 
            return (val != null ? val : "?");
        let norm = this.get_string_value(KeywordReferent.ATTR_NORMAL);
        if (norm === null) 
            return (val != null ? val : "?");
        else 
            return (((val != null ? val : "?")) + " [" + norm + "]");
    }
    
    get typ() {
        let str = this.get_string_value(KeywordReferent.ATTR_TYPE);
        if (str === null) 
            return KeywordType.UNDEFINED;
        try {
            return KeywordType.of(str);
        } catch (ex) {
            return KeywordType.UNDEFINED;
        }
    }
    set typ(value) {
        this.add_slot(KeywordReferent.ATTR_TYPE, value.toString(), true, 0);
        return value;
    }
    
    get child_words() {
        return this._get_child_words(this, 0);
    }
    
    _get_child_words(root, lev) {
        if (lev > 5) 
            return 0;
        let res = 0;
        for (const s of this.slots) {
            if (s.type_name === KeywordReferent.ATTR_REF && (s.value instanceof KeywordReferent)) {
                if (s.value === root) 
                    return 0;
                res += (s.value)._get_child_words(root, lev + 1);
            }
        }
        if (res === 0) 
            res = 1;
        return res;
    }
    
    can_be_equals(obj, _typ = ReferentEqualType.WITHINONETEXT) {
        let kw = Utils.as(obj, KeywordReferent);
        if (kw === null) 
            return false;
        let ki = this.typ;
        if (ki !== kw.typ) 
            return false;
        if (ki === KeywordType.REFERENT) {
            let re = Utils.as(this.get_slot_value(KeywordReferent.ATTR_REF), Referent);
            if (re === null) 
                return false;
            let re2 = Utils.as(kw.get_slot_value(KeywordReferent.ATTR_REF), Referent);
            if (re2 === null) 
                return false;
            if (re.can_be_equals(re2, _typ)) 
                return true;
        }
        for (const s of this.slots) {
            if (s.type_name === KeywordReferent.ATTR_NORMAL || s.type_name === KeywordReferent.ATTR_VALUE) {
                if (kw.find_slot(KeywordReferent.ATTR_NORMAL, s.value, true) !== null) 
                    return true;
                if (kw.find_slot(KeywordReferent.ATTR_VALUE, s.value, true) !== null) 
                    return true;
            }
        }
        return false;
    }
    
    merge_slots(obj, merge_statistic = true) {
        let r1 = this.rank + (obj).rank;
        super.merge_slots(obj, merge_statistic);
        if (this.slots.length > 50) {
        }
        this.rank = r1;
    }
    
    union(kw1, kw2, word2) {
        this.typ = kw1.typ;
        let tmp = new Array();
        let tmp2 = new StringBuilder();
        for (const v of kw1.get_string_values(KeywordReferent.ATTR_VALUE)) {
            this.add_slot(KeywordReferent.ATTR_VALUE, (v + " " + word2), false, 0);
        }
        let norms1 = kw1.get_string_values(KeywordReferent.ATTR_NORMAL);
        if (norms1.length === 0 && kw1.child_words === 1) 
            norms1 = kw1.get_string_values(KeywordReferent.ATTR_VALUE);
        let norms2 = kw2.get_string_values(KeywordReferent.ATTR_NORMAL);
        if (norms2.length === 0 && kw2.child_words === 1) 
            norms2 = kw2.get_string_values(KeywordReferent.ATTR_VALUE);
        for (const n1 of norms1) {
            for (const n2 of norms2) {
                tmp.splice(0, tmp.length);
                tmp.splice(tmp.length, 0, ...Utils.splitString(n1, ' ', false));
                for (const n of Utils.splitString(n2, ' ', false)) {
                    if (!tmp.includes(n)) 
                        tmp.push(n);
                }
                tmp.sort();
                tmp2.length = 0;
                for (let i = 0; i < tmp.length; i++) {
                    if (i > 0) 
                        tmp2.append(' ');
                    tmp2.append(tmp[i]);
                }
                this.add_slot(KeywordReferent.ATTR_NORMAL, tmp2.toString(), false, 0);
            }
        }
        this.add_slot(KeywordReferent.ATTR_REF, kw1, false, 0);
        this.add_slot(KeywordReferent.ATTR_REF, kw2, false, 0);
    }
    
    create_ontology_item() {
        let res = new IntOntologyItem(this);
        for (const s of this.slots) {
            if (s.type_name === KeywordReferent.ATTR_NORMAL || s.type_name === KeywordReferent.ATTR_VALUE) 
                res.termins.push(new Termin(String(s.value)));
        }
        return res;
    }
    
    static _new1589(_arg1) {
        let res = new KeywordReferent();
        res.typ = _arg1;
        return res;
    }
    
    static static_constructor() {
        KeywordReferent.OBJ_TYPENAME = "KEYWORD";
        KeywordReferent.ATTR_TYPE = "TYPE";
        KeywordReferent.ATTR_VALUE = "VALUE";
        KeywordReferent.ATTR_NORMAL = "NORMAL";
        KeywordReferent.ATTR_REF = "REF";
    }
}


KeywordReferent.static_constructor();

module.exports = KeywordReferent
/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const MorphLang = require("./../../morph/MorphLang");
const NamedEntityKind = require("./NamedEntityKind");
const Termin = require("./../core/Termin");
const IntOntologyItem = require("./../core/IntOntologyItem");
const MetaNamedEntity = require("./internal/MetaNamedEntity");
const Referent = require("./../Referent");
const ReferentClass = require("./../ReferentClass");
const MiscHelper = require("./../core/MiscHelper");

/**
 * Текоторые мелкие именованные сущности (планеты, памятники, здания, местоположения, планеты и пр.)
 */
class NamedEntityReferent extends Referent {
    
    constructor() {
        super(NamedEntityReferent.OBJ_TYPENAME);
        this.instance_of = MetaNamedEntity.GLOBAL_META;
    }
    
    to_string(short_variant, lang, lev = 0) {
        let res = new StringBuilder();
        let typ = this.get_string_value(NamedEntityReferent.ATTR_TYPE);
        if (typ !== null) 
            res.append(typ);
        let name = this.get_string_value(NamedEntityReferent.ATTR_NAME);
        if (name !== null) {
            if (res.length > 0) 
                res.append(' ');
            res.append(MiscHelper.convert_first_char_upper_and_other_lower(name));
        }
        let re = Utils.as(this.get_slot_value(NamedEntityReferent.ATTR_REF), Referent);
        if (re !== null) {
            if (res.length > 0) 
                res.append("; ");
            res.append(re.to_string(short_variant, lang, lev + 1));
        }
        return res.toString();
    }
    
    /**
     * [Get] Класс сущности
     */
    get kind() {
        let str = this.get_string_value(NamedEntityReferent.ATTR_KIND);
        if (str === null) 
            return NamedEntityKind.UNDEFINED;
        try {
            return NamedEntityKind.of(str);
        } catch (ex1757) {
        }
        return NamedEntityKind.UNDEFINED;
    }
    /**
     * [Set] Класс сущности
     */
    set kind(value) {
        this.add_slot(NamedEntityReferent.ATTR_KIND, value.toString().toLowerCase(), true, 0);
        return value;
    }
    
    to_sort_string() {
        return this.kind.toString() + this.to_string(true, MorphLang.UNKNOWN, 0);
    }
    
    get_compare_strings() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === NamedEntityReferent.ATTR_NAME) {
                let str = s.value.toString();
                if (!res.includes(str)) 
                    res.push(str);
                if (str.indexOf(' ') > 0 || str.indexOf('-') > 0) {
                    str = Utils.replaceString(Utils.replaceString(str, " ", ""), "-", "");
                    if (!res.includes(str)) 
                        res.push(str);
                }
            }
        }
        if (res.length === 0) {
            for (const s of this.slots) {
                if (s.type_name === NamedEntityReferent.ATTR_TYPE) {
                    let t = s.value.toString();
                    if (!res.includes(t)) 
                        res.push(t);
                }
            }
        }
        if (res.length > 0) 
            return res;
        else 
            return super.get_compare_strings();
    }
    
    can_be_equals(obj, typ) {
        let ent = Utils.as(obj, NamedEntityReferent);
        if (ent === null) 
            return false;
        if (ent.kind !== this.kind) 
            return false;
        let names = this.get_string_values(NamedEntityReferent.ATTR_NAME);
        let names2 = obj.get_string_values(NamedEntityReferent.ATTR_NAME);
        let eq_names = false;
        if ((names !== null && names.length > 0 && names2 !== null) && names2.length > 0) {
            for (const n of names) {
                if (names2.includes(n)) 
                    eq_names = true;
            }
            if (!eq_names) 
                return false;
        }
        let typs = this.get_string_values(NamedEntityReferent.ATTR_TYPE);
        let typs2 = obj.get_string_values(NamedEntityReferent.ATTR_TYPE);
        let eq_typs = false;
        if ((typs !== null && typs.length > 0 && typs2 !== null) && typs2.length > 0) {
            for (const ty of typs) {
                if (typs2.includes(ty)) 
                    eq_typs = true;
            }
            if (!eq_typs) 
                return false;
        }
        if (!eq_typs && !eq_names) 
            return false;
        let re1 = Utils.as(this.get_slot_value(NamedEntityReferent.ATTR_REF), Referent);
        let re2 = Utils.as(obj.get_slot_value(NamedEntityReferent.ATTR_REF), Referent);
        if (re1 !== null && re2 !== null) {
            if (!re1.can_be_equals(re2, typ)) 
                return false;
        }
        else if (re1 !== null || re2 !== null) {
        }
        return true;
    }
    
    /**
     * Признак того, что была попытка привязаться к внешней онтологии
     */
    create_ontology_item() {
        return this._create_ontology_item(2, false, false);
    }
    
    _create_ontology_item(min_len, only_names = false, pure_names = false) {
        let oi = new IntOntologyItem(this);
        let vars = new Array();
        let typs = Utils.notNull(this.get_string_values(NamedEntityReferent.ATTR_TYPE), new Array());
        for (const a of this.slots) {
            if (a.type_name === NamedEntityReferent.ATTR_NAME) {
                let s = a.value.toString().toUpperCase();
                if (!vars.includes(s)) 
                    vars.push(s);
                if (!pure_names) {
                    let sp = 0;
                    for (let jj = 0; jj < s.length; jj++) {
                        if (s[jj] === ' ') 
                            sp++;
                    }
                    if (sp === 1) {
                        s = Utils.replaceString(s, " ", "");
                        if (!vars.includes(s)) 
                            vars.push(s);
                    }
                }
            }
        }
        if (!only_names) {
            if (vars.length === 0) {
                for (const t of typs) {
                    let up = t.toUpperCase();
                    if (!vars.includes(up)) 
                        vars.push(up);
                }
            }
        }
        let max = 20;
        let cou = 0;
        for (const v of vars) {
            if (v.length >= min_len) {
                oi.termins.push(new Termin(v));
                if ((++cou) >= max) 
                    break;
            }
        }
        if (oi.termins.length === 0) 
            return null;
        return oi;
    }
    
    static _new1756(_arg1) {
        let res = new NamedEntityReferent();
        res.kind = _arg1;
        return res;
    }
    
    static static_constructor() {
        NamedEntityReferent.OBJ_TYPENAME = "NAMEDENTITY";
        NamedEntityReferent.ATTR_NAME = "NAME";
        NamedEntityReferent.ATTR_KIND = "KIND";
        NamedEntityReferent.ATTR_TYPE = "TYPE";
        NamedEntityReferent.ATTR_REF = "REF";
        NamedEntityReferent.ATTR_MISC = "MISC";
    }
}


NamedEntityReferent.static_constructor();

module.exports = NamedEntityReferent
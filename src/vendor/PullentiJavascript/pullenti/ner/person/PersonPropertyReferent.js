/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const LanguageHelper = require("./../../morph/LanguageHelper");
const Termin = require("./../core/Termin");
const IntOntologyItem = require("./../core/IntOntologyItem");
const GeoReferent = require("./../geo/GeoReferent");
const ReferentClass = require("./../ReferentClass");
const ReferentEqualType = require("./../ReferentEqualType");
const Referent = require("./../Referent");
const MetaPersonProperty = require("./internal/MetaPersonProperty");

/**
 * Сущность, описывающая некоторое свойство физического лица
 */
class PersonPropertyReferent extends Referent {
    
    constructor() {
        super(PersonPropertyReferent.OBJ_TYPENAME);
        this.instance_of = MetaPersonProperty.global_meta;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let res = new StringBuilder();
        if (this.name !== null) 
            res.append(this.name);
        for (const r of this.slots) {
            if (r.type_name === PersonPropertyReferent.ATTR_ATTR && r.value !== null) 
                res.append(", ").append(r.value.toString());
        }
        for (const r of this.slots) {
            if (r.type_name === PersonPropertyReferent.ATTR_REF && (r.value instanceof Referent) && (lev < 10)) 
                res.append("; ").append((r.value).to_string(short_variant, lang, lev + 1));
        }
        let hi = this.higher;
        if (hi !== null && hi !== this && this.check_correct_higher(hi, 0)) 
            res.append("; ").append(hi.to_string(short_variant, lang, lev + 1));
        return res.toString();
    }
    
    get_compare_strings() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === PersonPropertyReferent.ATTR_NAME) 
                res.push(s.value.toString());
        }
        if (res.length > 0) 
            return res;
        else 
            return super.get_compare_strings();
    }
    
    /**
     * [Get] Наименование
     */
    get name() {
        return this.get_string_value(PersonPropertyReferent.ATTR_NAME);
    }
    /**
     * [Set] Наименование
     */
    set name(value) {
        this.add_slot(PersonPropertyReferent.ATTR_NAME, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Вышестоящая должность
     */
    get higher() {
        return this._get_higher(0);
    }
    /**
     * [Set] Вышестоящая должность
     */
    set higher(value) {
        if (this.check_correct_higher(value, 0)) 
            this.add_slot(PersonPropertyReferent.ATTR_HIGHER, value, true, 0);
        return value;
    }
    
    _get_higher(lev) {
        let hi = Utils.as(this.get_slot_value(PersonPropertyReferent.ATTR_HIGHER), PersonPropertyReferent);
        if (hi === null) 
            return null;
        if (!this.check_correct_higher(hi, lev + 1)) 
            return null;
        return hi;
    }
    
    check_correct_higher(hi, lev) {
        if (hi === null) 
            return true;
        if (hi === this) 
            return false;
        if (lev > 20) 
            return false;
        let hii = hi._get_higher(lev + 1);
        if (hii === null) 
            return true;
        if (hii === this) 
            return false;
        let li = new Array();
        li.push(this);
        for (let pr = hi; pr !== null; pr = pr._get_higher(lev + 1)) {
            if (li.includes(pr)) 
                return false;
            else 
                li.push(pr);
        }
        return true;
    }
    
    get parent_referent() {
        return this.higher;
    }
    
    can_be_equals(obj, typ) {
        let pr = Utils.as(obj, PersonPropertyReferent);
        if (pr === null) 
            return false;
        let n1 = this.name;
        let n2 = pr.name;
        if (n1 === null || n2 === null) 
            return false;
        let eq_bosses = false;
        if (n1 !== n2) {
            if (typ === ReferentEqualType.DIFFERENTTEXTS) 
                return false;
            if (PersonPropertyReferent.m_bosses0.includes(n1) && PersonPropertyReferent.m_bosses1.includes(n2)) 
                eq_bosses = true;
            else if (PersonPropertyReferent.m_bosses1.includes(n1) && PersonPropertyReferent.m_bosses0.includes(n2)) 
                eq_bosses = true;
            else {
                if (!n1.startsWith(n2 + " ") && !n2.startsWith(n1 + " ")) 
                    return false;
                eq_bosses = true;
            }
            for (let hi = this.higher; hi !== null; hi = hi.higher) {
                if ((++PersonPropertyReferent._tmp_stack) > 20) {
                }
                else if (hi.can_be_equals(pr, typ)) {
                    PersonPropertyReferent._tmp_stack--;
                    return false;
                }
                PersonPropertyReferent._tmp_stack--;
            }
            for (let hi = pr.higher; hi !== null; hi = hi.higher) {
                if ((++PersonPropertyReferent._tmp_stack) > 20) {
                }
                else if (hi.can_be_equals(this, typ)) {
                    PersonPropertyReferent._tmp_stack--;
                    return false;
                }
                PersonPropertyReferent._tmp_stack--;
            }
        }
        if (this.higher !== null && pr.higher !== null) {
            if ((++PersonPropertyReferent._tmp_stack) > 20) {
            }
            else if (!this.higher.can_be_equals(pr.higher, typ)) {
                PersonPropertyReferent._tmp_stack--;
                return false;
            }
            PersonPropertyReferent._tmp_stack--;
        }
        if (this.find_slot("@GENERAL", null, true) !== null || pr.find_slot("@GENERAL", null, true) !== null) 
            return this.toString() === pr.toString();
        if (this.find_slot(PersonPropertyReferent.ATTR_REF, null, true) !== null || pr.find_slot(PersonPropertyReferent.ATTR_REF, null, true) !== null) {
            let refs1 = new Array();
            let refs2 = new Array();
            for (const s of this.slots) {
                if (s.type_name === PersonPropertyReferent.ATTR_REF) 
                    refs1.push(s.value);
            }
            for (const s of pr.slots) {
                if (s.type_name === PersonPropertyReferent.ATTR_REF) 
                    refs2.push(s.value);
            }
            let eq = false;
            let noeq = false;
            for (let i = 0; i < refs1.length; i++) {
                if (refs2.includes(refs1[i])) {
                    eq = true;
                    continue;
                }
                noeq = true;
                if (refs1[i] instanceof Referent) {
                    for (const rr of refs2) {
                        if (rr instanceof Referent) {
                            if ((rr).can_be_equals(Utils.as(refs1[i], Referent), typ)) {
                                noeq = false;
                                eq = true;
                                break;
                            }
                        }
                    }
                }
            }
            for (let i = 0; i < refs2.length; i++) {
                if (refs1.includes(refs2[i])) {
                    eq = true;
                    continue;
                }
                noeq = true;
                if (refs2[i] instanceof Referent) {
                    for (const rr of refs1) {
                        if (rr instanceof Referent) {
                            if ((rr).can_be_equals(Utils.as(refs2[i], Referent), typ)) {
                                noeq = false;
                                eq = true;
                                break;
                            }
                        }
                    }
                }
            }
            if (eq && !noeq) {
            }
            else if (noeq && ((eq || refs1.length === 0 || refs2.length === 0))) {
                if (typ === ReferentEqualType.DIFFERENTTEXTS || n1 !== n2) 
                    return false;
                if (this.higher !== null || pr.higher !== null) 
                    return false;
            }
            else 
                return false;
        }
        else if (!eq_bosses && n1 !== n2) 
            return false;
        return true;
    }
    
    can_be_general_for(obj) {
        let pr = Utils.as(obj, PersonPropertyReferent);
        if (pr === null) 
            return false;
        let n1 = this.name;
        let n2 = pr.name;
        if (n1 === null || n2 === null) 
            return false;
        if (this.find_slot(PersonPropertyReferent.ATTR_REF, null, true) !== null || this.higher !== null) {
            if (n1 !== n2 && n1.startsWith(n2)) 
                return this.can_be_equals(obj, ReferentEqualType.DIFFERENTTEXTS);
            return false;
        }
        if (n1 === n2) {
            if (pr.find_slot(PersonPropertyReferent.ATTR_REF, null, true) !== null || pr.higher !== null) 
                return true;
            return false;
        }
        if (n2.startsWith(n1)) {
            if (n2.startsWith(n1 + " ")) 
                return this.can_be_equals(obj, ReferentEqualType.WITHINONETEXT);
        }
        return false;
    }
    
    get kind() {
        const PersonAttrToken = require("./internal/PersonAttrToken");
        return PersonAttrToken.check_kind(this);
    }
    
    create_ontology_item() {
        let oi = new IntOntologyItem(this);
        for (const a of this.slots) {
            if (a.type_name === PersonPropertyReferent.ATTR_NAME) 
                oi.termins.push(new Termin(a.value.toString()));
        }
        return oi;
    }
    
    merge_slots(obj, merge_statistic = true) {
        let nam = this.name;
        let nam1 = (obj).name;
        super.merge_slots(obj, merge_statistic);
        if (nam !== nam1 && nam1 !== null && nam !== null) {
            let s = null;
            if (nam.startsWith(nam1)) 
                s = this.find_slot(PersonPropertyReferent.ATTR_NAME, nam1, true);
            else if (nam1.startsWith(nam)) 
                s = this.find_slot(PersonPropertyReferent.ATTR_NAME, nam, true);
            else if (PersonPropertyReferent.m_bosses0.includes(nam) && PersonPropertyReferent.m_bosses1.includes(nam1)) 
                s = this.find_slot(PersonPropertyReferent.ATTR_NAME, nam, true);
            else if (PersonPropertyReferent.m_bosses0.includes(nam1) && PersonPropertyReferent.m_bosses1.includes(nam)) 
                s = this.find_slot(PersonPropertyReferent.ATTR_NAME, nam1, true);
            if (s !== null) 
                Utils.removeItem(this.slots, s);
        }
    }
    
    /**
     * Проверка, что этот референт может выступать в качестве ATTR_REF
     * @param r 
     * @return 
     */
    can_has_ref(r) {
        let nam = this.name;
        if (nam === null || r === null) 
            return false;
        if (r instanceof GeoReferent) {
            let g = Utils.as(r, GeoReferent);
            if (LanguageHelper.ends_with_ex(nam, "президент", "губернатор", null, null)) 
                return g.is_state || g.is_region;
            if (nam === "мэр" || nam === "градоначальник") 
                return g.is_city;
            if (nam === "глава") 
                return true;
            return false;
        }
        if (r.type_name === "ORGANIZATION") {
            if ((LanguageHelper.ends_with(nam, "губернатор") || nam === "мэр" || nam === "градоначальник") || nam === "президент") 
                return false;
            if (nam.includes("министр")) {
                if (r.find_slot(null, "министерство", true) === null) 
                    return false;
            }
            if (nam.endsWith("директор")) {
                if (((r.find_slot(null, "суд", true))) !== null) 
                    return false;
            }
            return true;
        }
        return false;
    }
    
    static _new2435(_arg1) {
        let res = new PersonPropertyReferent();
        res.name = _arg1;
        return res;
    }
    
    static static_constructor() {
        PersonPropertyReferent.OBJ_TYPENAME = "PERSONPROPERTY";
        PersonPropertyReferent.ATTR_NAME = "NAME";
        PersonPropertyReferent.ATTR_ATTR = "ATTR";
        PersonPropertyReferent.ATTR_REF = "REF";
        PersonPropertyReferent.ATTR_HIGHER = "HIGHER";
        PersonPropertyReferent.m_bosses0 = Array.from(["глава", "руководитель"]);
        PersonPropertyReferent.m_bosses1 = Array.from(["президент", "генеральный директор", "директор", "председатель"]);
        PersonPropertyReferent._tmp_stack = 0;
    }
}


PersonPropertyReferent.static_constructor();

module.exports = PersonPropertyReferent
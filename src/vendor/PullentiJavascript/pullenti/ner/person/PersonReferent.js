/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const FioTemplateType = require("./internal/FioTemplateType");
const MorphGender = require("./../../morph/MorphGender");
const MiscHelper = require("./../core/MiscHelper");
const IntOntologyItem = require("./../core/IntOntologyItem");
const Termin = require("./../core/Termin");
const NumberHelper = require("./../core/NumberHelper");
const PersonPropertyKind = require("./PersonPropertyKind");
const ReferentClass = require("./../ReferentClass");
const Referent = require("./../Referent");
const MetaPerson = require("./internal/MetaPerson");
const ReferentEqualType = require("./../ReferentEqualType");
const LanguageHelper = require("./../../morph/LanguageHelper");
const PersonPropertyReferent = require("./PersonPropertyReferent");

/**
 * Сущность, описывающее физическое лицо
 */
class PersonReferent extends Referent {
    
    constructor() {
        super(PersonReferent.OBJ_TYPENAME);
        this.m_person_identity_typ = FioTemplateType.UNDEFINED;
        this.m_surname_occurs = new Array();
        this.m_name_occurs = new Array();
        this.m_sec_occurs = new Array();
        this.m_ident_occurs = new Array();
        this.instance_of = MetaPerson.global_meta;
    }
    
    /**
     * [Get] Это мужчина
     */
    get is_male() {
        return this.get_string_value(PersonReferent.ATTR_SEX) === MetaPerson.ATTR_SEXMALE;
    }
    /**
     * [Set] Это мужчина
     */
    set is_male(value) {
        this.add_slot(PersonReferent.ATTR_SEX, MetaPerson.ATTR_SEXMALE, true, 0);
        return value;
    }
    
    /**
     * [Get] Это женщина
     */
    get is_female() {
        return this.get_string_value(PersonReferent.ATTR_SEX) === MetaPerson.ATTR_SEXFEMALE;
    }
    /**
     * [Set] Это женщина
     */
    set is_female(value) {
        this.add_slot(PersonReferent.ATTR_SEX, MetaPerson.ATTR_SEXFEMALE, true, 0);
        return value;
    }
    
    /**
     * [Get] Возраст
     */
    get age() {
        let i = this.get_int_value(PersonReferent.ATTR_AGE, 0);
        if (i > 0) 
            return i;
        return 0;
    }
    /**
     * [Set] Возраст
     */
    set age(value) {
        this.add_slot(PersonReferent.ATTR_AGE, value.toString(), true, 0);
        return value;
    }
    
    add_contact(contact) {
        for (const s of this.slots) {
            if (s.type_name === PersonReferent.ATTR_CONTACT) {
                let r = Utils.as(s.value, Referent);
                if (r !== null) {
                    if (r.can_be_general_for(contact)) {
                        this.upload_slot(s, contact);
                        return;
                    }
                    if (r.can_be_equals(contact, ReferentEqualType.WITHINONETEXT)) 
                        return;
                }
            }
        }
        this.add_slot(PersonReferent.ATTR_CONTACT, contact, false, 0);
    }
    
    _get_prefix() {
        if (this.is_male) 
            return "г-н ";
        if (this.is_female) 
            return "г-жа ";
        return "";
    }
    
    _find_for_surname(attr_name, surname, find_shortest = false) {
        let rus = LanguageHelper.is_cyrillic_char(surname[0]);
        let res = null;
        for (const a of this.slots) {
            if (a.type_name === attr_name) {
                let v = a.value.toString();
                if (LanguageHelper.is_cyrillic_char(v[0]) !== rus) 
                    continue;
                if (res === null) 
                    res = v;
                else if (find_shortest && (v.length < res.length)) 
                    res = v;
            }
        }
        return res;
    }
    
    _find_shortest_value(attr_name) {
        let res = null;
        for (const a of this.slots) {
            if (a.type_name === attr_name) {
                let v = a.value.toString();
                if (res === null || (v.length < res.length)) 
                    res = v;
            }
        }
        return res;
    }
    
    _find_shortest_king_titul(do_name = false) {
        let res = null;
        for (const s of this.slots) {
            if (s.value instanceof PersonPropertyReferent) {
                let pr = Utils.as(s.value, PersonPropertyReferent);
                if (pr.kind !== PersonPropertyKind.KING) 
                    continue;
                for (const ss of pr.slots) {
                    if (ss.type_name === PersonPropertyReferent.ATTR_NAME) {
                        let n = Utils.asString(ss.value);
                        if (res === null) 
                            res = n;
                        else if (res.length > n.length) 
                            res = n;
                    }
                }
            }
        }
        if (res !== null || !do_name) 
            return res;
        return null;
    }
    
    to_sort_string() {
        let sur = null;
        for (const a of this.slots) {
            if (a.type_name === PersonReferent.ATTR_IDENTITY) 
                return a.value.toString();
            else if (a.type_name === PersonReferent.ATTR_LASTNAME) {
                sur = a.value.toString();
                break;
            }
        }
        if (sur === null) {
            let tit = this._find_shortest_king_titul(false);
            if (tit === null) 
                return "?";
            let s = this.get_string_value(PersonReferent.ATTR_FIRSTNAME);
            if (s === null) 
                return "?";
            return (tit + " " + s);
        }
        let n = this._find_for_surname(PersonReferent.ATTR_FIRSTNAME, sur, false);
        if (n === null) 
            return sur;
        else 
            return (sur + " " + n);
    }
    
    get_compare_strings() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === PersonReferent.ATTR_LASTNAME || s.type_name === PersonReferent.ATTR_IDENTITY) 
                res.push(s.value.toString());
        }
        let tit = this._find_shortest_king_titul(false);
        if (tit !== null) {
            let nam = this.get_string_value(PersonReferent.ATTR_FIRSTNAME);
            if (nam !== null) 
                res.push((tit + " " + nam));
        }
        if (res.length > 0) 
            return res;
        else 
            return super.get_compare_strings();
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        if (short_variant) 
            return this.to_short_string(lang);
        else {
            let res = this.to_full_string(PersonReferent.SHOW_LASTNAME_ON_FIRST_POSITION, lang);
            if (this.find_slot(PersonReferent.ATTR_NICKNAME, null, true) === null) 
                return res;
            let niks = this.get_string_values(PersonReferent.ATTR_NICKNAME);
            if (niks.length === 1) 
                return (res + " (" + MiscHelper.convert_first_char_upper_and_other_lower(niks[0]) + ")");
            let tmp = new StringBuilder();
            tmp.append(res);
            tmp.append(" (");
            for (const s of niks) {
                if (s !== niks[0]) 
                    tmp.append(", ");
                tmp.append(MiscHelper.convert_first_char_upper_and_other_lower(s));
            }
            tmp.append(")");
            return tmp.toString();
        }
    }
    
    to_short_string(lang) {
        let id = null;
        for (const a of this.slots) {
            if (a.type_name === PersonReferent.ATTR_IDENTITY) {
                let s = a.value.toString();
                if (id === null || (s.length < id.length)) 
                    id = s;
            }
        }
        if (id !== null) 
            return MiscHelper.convert_first_char_upper_and_other_lower(id);
        let n = this.get_string_value(PersonReferent.ATTR_LASTNAME);
        if (n !== null) {
            let res = new StringBuilder();
            res.append(n);
            let s = this._find_for_surname(PersonReferent.ATTR_FIRSTNAME, n, true);
            if (s !== null) {
                res.append(" ").append(s[0]).append(".");
                s = this._find_for_surname(PersonReferent.ATTR_MIDDLENAME, n, false);
                if (s !== null) 
                    res.append(s[0]).append(".");
            }
            return MiscHelper.convert_first_char_upper_and_other_lower(res.toString());
        }
        let tit = this._find_shortest_king_titul(true);
        if (tit !== null) {
            let nam = this.get_string_value(PersonReferent.ATTR_FIRSTNAME);
            if (nam !== null) 
                return MiscHelper.convert_first_char_upper_and_other_lower((tit + " " + nam));
        }
        return this.to_full_string(false, lang);
    }
    
    to_full_string(last_name_first, lang) {
        let id = null;
        for (const a of this.slots) {
            if (a.type_name === PersonReferent.ATTR_IDENTITY) {
                let s = a.value.toString();
                if (id === null || s.length > id.length) 
                    id = s;
            }
        }
        if (id !== null) 
            return MiscHelper.convert_first_char_upper_and_other_lower(id);
        let sss = this.get_string_value("NAMETYPE");
        if (sss === "china") 
            last_name_first = true;
        let n = this.get_string_value(PersonReferent.ATTR_LASTNAME);
        if (n !== null) {
            let res = new StringBuilder();
            if (last_name_first) 
                res.append(n).append(" ");
            let s = this._find_for_surname(PersonReferent.ATTR_FIRSTNAME, n, false);
            if (s !== null) {
                res.append(s);
                if (PersonReferent.is_initial(s)) 
                    res.append('.');
                else 
                    res.append(' ');
                s = this._find_for_surname(PersonReferent.ATTR_MIDDLENAME, n, false);
                if (s !== null) {
                    res.append(s);
                    if (PersonReferent.is_initial(s)) 
                        res.append('.');
                    else 
                        res.append(' ');
                }
            }
            if (!last_name_first) 
                res.append(n);
            else if (res.charAt(res.length - 1) === ' ') 
                res.length = res.length - 1;
            if (LanguageHelper.is_cyrillic_char(n[0])) {
                let nl = null;
                for (const sl of this.slots) {
                    if (sl.type_name === PersonReferent.ATTR_LASTNAME) {
                        let ss = Utils.asString(sl.value);
                        if (ss.length > 0 && LanguageHelper.is_latin_char(ss[0])) {
                            nl = ss;
                            break;
                        }
                    }
                }
                if (nl !== null) {
                    let nal = this._find_for_surname(PersonReferent.ATTR_FIRSTNAME, nl, false);
                    if (nal === null) 
                        res.append(" (").append(nl).append(")");
                    else if (PersonReferent.SHOW_LASTNAME_ON_FIRST_POSITION) 
                        res.append(" (").append(nl).append(" ").append(nal).append(")");
                    else 
                        res.append(" (").append(nal).append(" ").append(nl).append(")");
                }
            }
            return MiscHelper.convert_first_char_upper_and_other_lower(res.toString());
        }
        else if ((((n = this.get_string_value(PersonReferent.ATTR_FIRSTNAME)))) !== null) {
            let s = this._find_for_surname(PersonReferent.ATTR_MIDDLENAME, n, false);
            if (s !== null) 
                n = (n + " " + s);
            n = MiscHelper.convert_first_char_upper_and_other_lower(n);
            let nik = this.get_string_value(PersonReferent.ATTR_NICKNAME);
            let tit = this._find_shortest_king_titul(false);
            if (tit !== null) 
                n = (tit + " " + n);
            if (nik !== null) 
                n = (n + " " + nik);
            return n;
        }
        return "?";
    }
    
    add_fio_identity(last_name, first_name, middle_name) {
        const PersonMorphCollection = require("./internal/PersonMorphCollection");
        if (last_name !== null) {
            if (last_name.number > 0) {
                let num = NumberHelper.get_number_roman(last_name.number);
                if (num === null) 
                    num = last_name.number.toString();
                this.add_slot(PersonReferent.ATTR_NICKNAME, num, false, 0);
            }
            else {
                last_name.correct();
                this.m_surname_occurs.push(last_name);
                for (const v of last_name.values) {
                    this.add_slot(PersonReferent.ATTR_LASTNAME, v, false, 0);
                }
            }
        }
        if (first_name !== null) {
            first_name.correct();
            if (first_name.head !== null && first_name.head.length > 2) 
                this.m_name_occurs.push(first_name);
            for (const v of first_name.values) {
                this.add_slot(PersonReferent.ATTR_FIRSTNAME, v, false, 0);
            }
            if ((typeof middle_name === 'string' || middle_name instanceof String)) 
                this.add_slot(PersonReferent.ATTR_MIDDLENAME, middle_name, false, 0);
            else if (middle_name instanceof PersonMorphCollection) {
                let mm = (Utils.as(middle_name, PersonMorphCollection));
                if (mm.head !== null && mm.head.length > 2) 
                    this.m_sec_occurs.push(mm);
                for (const v of mm.values) {
                    this.add_slot(PersonReferent.ATTR_MIDDLENAME, v, false, 0);
                }
            }
        }
        this.correct_data();
    }
    
    add_identity(ident) {
        if (ident === null) 
            return;
        this.m_ident_occurs.push(ident);
        for (const v of ident.values) {
            this.add_slot(PersonReferent.ATTR_IDENTITY, v, false, 0);
        }
        this.correct_data();
    }
    
    static is_initial(str) {
        if (str === null) 
            return false;
        if (str.length === 1) 
            return true;
        if (str === "ДЖ") 
            return true;
        return false;
    }
    
    add_attribute(attr) {
        this.add_slot(PersonReferent.ATTR_ATTR, attr, false, 0);
    }
    
    can_be_equals(obj, typ) {
        let p = Utils.as(obj, PersonReferent);
        if (p === null) 
            return false;
        for (const a of this.slots) {
            if (a.type_name === PersonReferent.ATTR_IDENTITY) {
                for (const aa of p.slots) {
                    if (aa.type_name === a.type_name) {
                        if (PersonReferent._del_surname_end(Utils.asString(a.value)) === PersonReferent._del_surname_end(Utils.asString(aa.value))) 
                            return true;
                    }
                }
            }
        }
        let nick1 = this.get_string_value(PersonReferent.ATTR_NICKNAME);
        let nick2 = obj.get_string_value(PersonReferent.ATTR_NICKNAME);
        if (nick1 !== null && nick2 !== null) {
            if (nick1 !== nick2) 
                return false;
        }
        if (this.find_slot(PersonReferent.ATTR_LASTNAME, null, true) !== null && p.find_slot(PersonReferent.ATTR_LASTNAME, null, true) !== null) {
            if (!this.compare_surnames_pers(p)) 
                return false;
            if (this.find_slot(PersonReferent.ATTR_FIRSTNAME, null, true) !== null && p.find_slot(PersonReferent.ATTR_FIRSTNAME, null, true) !== null) {
                if (!this.check_names(PersonReferent.ATTR_FIRSTNAME, p)) 
                    return false;
                if (this.find_slot(PersonReferent.ATTR_MIDDLENAME, null, true) !== null && p.find_slot(PersonReferent.ATTR_MIDDLENAME, null, true) !== null) {
                    if (!this.check_names(PersonReferent.ATTR_MIDDLENAME, p)) 
                        return false;
                }
                else if (typ === ReferentEqualType.DIFFERENTTEXTS) {
                    if (this.find_slot(PersonReferent.ATTR_MIDDLENAME, null, true) !== null || p.find_slot(PersonReferent.ATTR_MIDDLENAME, null, true) !== null) 
                        return this.toString() === p.toString();
                    let names1 = new Array();
                    let names2 = new Array();
                    for (const s of this.slots) {
                        if (s.type_name === PersonReferent.ATTR_FIRSTNAME) {
                            let nam = s.value.toString();
                            if (!PersonReferent.is_initial(nam)) 
                                names1.push(nam);
                        }
                    }
                    for (const s of p.slots) {
                        if (s.type_name === PersonReferent.ATTR_FIRSTNAME) {
                            let nam = s.value.toString();
                            if (!PersonReferent.is_initial(nam)) {
                                if (names1.includes(nam)) 
                                    return true;
                                names2.push(nam);
                            }
                        }
                    }
                    if (names1.length === 0 && names2.length === 0) 
                        return true;
                    return false;
                }
            }
            else if (typ === ReferentEqualType.DIFFERENTTEXTS && ((this.find_slot(PersonReferent.ATTR_FIRSTNAME, null, true) !== null || p.find_slot(PersonReferent.ATTR_FIRSTNAME, null, true) !== null))) 
                return false;
            return true;
        }
        let tit1 = this._find_shortest_king_titul(false);
        let tit2 = p._find_shortest_king_titul(false);
        if (((tit1 !== null || tit2 !== null)) || ((nick1 !== null && nick1 === nick2))) {
            if (tit1 === null || tit2 === null) {
                if (nick1 !== null && nick1 === nick2) {
                }
                else 
                    return false;
            }
            else if (tit1 !== tit2) {
                if (!tit1.includes(tit2) && !tit2.includes(tit1)) 
                    return false;
            }
            if (this.find_slot(PersonReferent.ATTR_FIRSTNAME, null, true) !== null && p.find_slot(PersonReferent.ATTR_FIRSTNAME, null, true) !== null) {
                if (!this.check_names(PersonReferent.ATTR_FIRSTNAME, p)) 
                    return false;
                return true;
            }
        }
        return false;
    }
    
    can_be_general_for(obj) {
        if (!this.can_be_equals(obj, ReferentEqualType.WITHINONETEXT)) 
            return false;
        let p = Utils.as(obj, PersonReferent);
        if (p === null) 
            return false;
        if (this.find_slot(PersonReferent.ATTR_LASTNAME, null, true) === null || p.find_slot(PersonReferent.ATTR_LASTNAME, null, true) === null) 
            return false;
        if (!this.compare_surnames_pers(p)) 
            return false;
        if (this.find_slot(PersonReferent.ATTR_FIRSTNAME, null, true) === null) {
            if (p.find_slot(PersonReferent.ATTR_FIRSTNAME, null, true) !== null) 
                return true;
            else 
                return false;
        }
        if (p.find_slot(PersonReferent.ATTR_FIRSTNAME, null, true) === null) 
            return false;
        if (!this.check_names(PersonReferent.ATTR_FIRSTNAME, p)) 
            return false;
        if (this.find_slot(PersonReferent.ATTR_MIDDLENAME, null, true) !== null && p.find_slot(PersonReferent.ATTR_MIDDLENAME, null, true) === null) {
            if (!PersonReferent.is_initial(this.get_string_value(PersonReferent.ATTR_FIRSTNAME))) 
                return false;
        }
        let name_inits = 0;
        let name_fulls = 0;
        let sec_inits = 0;
        let sec_fulls = 0;
        let name_inits1 = 0;
        let name_fulls1 = 0;
        let sec_inits1 = 0;
        let sec_fulls1 = 0;
        for (const s of this.slots) {
            if (s.type_name === PersonReferent.ATTR_FIRSTNAME) {
                if (PersonReferent.is_initial(Utils.asString(s.value))) 
                    name_inits++;
                else 
                    name_fulls++;
            }
            else if (s.type_name === PersonReferent.ATTR_MIDDLENAME) {
                if (PersonReferent.is_initial(Utils.asString(s.value))) 
                    sec_inits++;
                else 
                    sec_fulls++;
            }
        }
        for (const s of p.slots) {
            if (s.type_name === PersonReferent.ATTR_FIRSTNAME) {
                if (PersonReferent.is_initial(Utils.asString(s.value))) 
                    name_inits1++;
                else 
                    name_fulls1++;
            }
            else if (s.type_name === PersonReferent.ATTR_MIDDLENAME) {
                if (PersonReferent.is_initial(Utils.asString(s.value))) 
                    sec_inits1++;
                else 
                    sec_fulls1++;
            }
        }
        if (sec_fulls > 0) 
            return false;
        if (name_inits === 0) {
            if (name_inits1 > 0) 
                return false;
        }
        else if (name_inits1 > 0) {
            if ((sec_inits + sec_fulls) > 0) 
                return false;
        }
        if (sec_inits === 0) {
            if ((sec_inits1 + sec_fulls1) === 0) {
                if (name_inits1 === 0 && name_inits > 0) 
                    return true;
                else 
                    return false;
            }
        }
        else if (sec_inits1 > 0) 
            return false;
        return true;
    }
    
    compare_surnames_pers(p) {
        for (const a of this.slots) {
            if (a.type_name === PersonReferent.ATTR_LASTNAME) {
                let s = a.value.toString();
                for (const aa of p.slots) {
                    if (aa.type_name === a.type_name) {
                        let ss = aa.value.toString();
                        if (this.compare_surnames_strs(s, ss)) 
                            return true;
                    }
                }
            }
        }
        return false;
    }
    
    /**
     * Сравнение с учётом возможных окончаний
     * @param s1 
     * @param s2 
     * @return 
     */
    compare_surnames_strs(s1, s2) {
        if (s1.startsWith(s2) || s2.startsWith(s1)) 
            return true;
        if (PersonReferent._del_surname_end(s1) === PersonReferent._del_surname_end(s2)) 
            return true;
        let n1 = MiscHelper.get_absolute_normal_value(s1, false);
        if (n1 !== null) {
            if (n1 === MiscHelper.get_absolute_normal_value(s2, false)) 
                return true;
        }
        if (MiscHelper.can_be_equals(s1, s2, true, true, false)) 
            return true;
        return false;
    }
    
    static _del_surname_end(s) {
        if (s.length < 3) 
            return s;
        if (LanguageHelper.ends_with_ex(s, "А", "У", "Е", null)) 
            return s.substring(0, 0 + s.length - 1);
        if (LanguageHelper.ends_with(s, "ОМ") || LanguageHelper.ends_with(s, "ЫМ")) 
            return s.substring(0, 0 + s.length - 2);
        if (LanguageHelper.ends_with_ex(s, "Я", "Ю", null, null)) {
            let ch1 = s[s.length - 2];
            if (ch1 === 'Н' || ch1 === 'Л') 
                return s.substring(0, 0 + s.length - 1) + "Ь";
        }
        return s;
    }
    
    check_names(attr_name, p) {
        let names1 = new Array();
        let inits1 = new Array();
        let normn1 = new Array();
        for (const s of this.slots) {
            if (s.type_name === attr_name) {
                let n = s.value.toString();
                if (PersonReferent.is_initial(n)) 
                    inits1.push(n);
                else {
                    names1.push(n);
                    let sn = MiscHelper.get_absolute_normal_value(n, false);
                    if (sn !== null) 
                        normn1.push(sn);
                }
            }
        }
        let names2 = new Array();
        let inits2 = new Array();
        let normn2 = new Array();
        for (const s of p.slots) {
            if (s.type_name === attr_name) {
                let n = s.value.toString();
                if (PersonReferent.is_initial(n)) 
                    inits2.push(n);
                else {
                    names2.push(n);
                    let sn = MiscHelper.get_absolute_normal_value(n, false);
                    if (sn !== null) 
                        normn2.push(sn);
                }
            }
        }
        if (names1.length > 0 && names2.length > 0) {
            for (const n of names1) {
                if (names2.includes(n)) 
                    return true;
            }
            for (const n of normn1) {
                if (normn2.includes(n)) 
                    return true;
            }
            return false;
        }
        if (inits1.length > 0) {
            for (const n of inits1) {
                if (inits2.includes(n)) 
                    return true;
                for (const nn of names2) {
                    if (nn.startsWith(n)) 
                        return true;
                }
            }
        }
        if (inits2.length > 0) {
            for (const n of inits2) {
                if (inits1.includes(n)) 
                    return true;
                for (const nn of names1) {
                    if (nn.startsWith(n)) 
                        return true;
                }
            }
        }
        return false;
    }
    
    merge_slots(obj, merge_statistic = true) {
        super.merge_slots(obj, merge_statistic);
        let p = Utils.as(obj, PersonReferent);
        this.m_surname_occurs.splice(this.m_surname_occurs.length, 0, ...p.m_surname_occurs);
        this.m_name_occurs.splice(this.m_name_occurs.length, 0, ...p.m_name_occurs);
        this.m_sec_occurs.splice(this.m_sec_occurs.length, 0, ...p.m_sec_occurs);
        this.m_ident_occurs.splice(this.m_ident_occurs.length, 0, ...p.m_ident_occurs);
        if (p.m_person_identity_typ !== FioTemplateType.UNDEFINED) 
            this.m_person_identity_typ = p.m_person_identity_typ;
        this.correct_data();
    }
    
    correct_data() {
        const PersonMorphCollection = require("./internal/PersonMorphCollection");
        let g = MorphGender.UNDEFINED;
        while (true) {
            let ch = false;
            if (PersonMorphCollection.intersect(this.m_surname_occurs)) 
                ch = true;
            if (PersonMorphCollection.intersect(this.m_name_occurs)) 
                ch = true;
            if (PersonMorphCollection.intersect(this.m_sec_occurs)) 
                ch = true;
            if (PersonMorphCollection.intersect(this.m_ident_occurs)) 
                ch = true;
            if (!ch) 
                break;
            if (g === MorphGender.UNDEFINED && this.m_surname_occurs.length > 0 && this.m_surname_occurs[0].gender !== MorphGender.UNDEFINED) 
                g = this.m_surname_occurs[0].gender;
            if (g === MorphGender.UNDEFINED && this.m_name_occurs.length > 0 && this.m_name_occurs[0].gender !== MorphGender.UNDEFINED) 
                g = this.m_name_occurs[0].gender;
            if (g === MorphGender.UNDEFINED && this.m_ident_occurs.length > 0 && this.m_ident_occurs[0].gender !== MorphGender.UNDEFINED) 
                g = this.m_ident_occurs[0].gender;
            if (g !== MorphGender.UNDEFINED) {
                PersonMorphCollection.set_gender(this.m_surname_occurs, g);
                PersonMorphCollection.set_gender(this.m_name_occurs, g);
                PersonMorphCollection.set_gender(this.m_sec_occurs, g);
                PersonMorphCollection.set_gender(this.m_ident_occurs, g);
            }
        }
        if (g !== MorphGender.UNDEFINED) {
            if (!this.is_female && !this.is_male) {
                if (g === MorphGender.MASCULINE) 
                    this.is_male = true;
                else 
                    this.is_female = true;
            }
        }
        this.correct_surnames();
        this.correct_identifiers();
        this.correct_attrs();
        this.remove_slots(PersonReferent.ATTR_LASTNAME, this.m_surname_occurs);
        this.remove_slots(PersonReferent.ATTR_FIRSTNAME, this.m_name_occurs);
        this.remove_slots(PersonReferent.ATTR_MIDDLENAME, this.m_sec_occurs);
        this.remove_slots(PersonReferent.ATTR_IDENTITY, this.m_ident_occurs);
        this.remove_initials(PersonReferent.ATTR_FIRSTNAME);
        this.remove_initials(PersonReferent.ATTR_MIDDLENAME);
    }
    
    correct_surnames() {
        if (!this.is_male && !this.is_female) 
            return;
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i].type_name === PersonReferent.ATTR_LASTNAME) {
                let s = this.slots[i].value.toString();
                for (let j = i + 1; j < this.slots.length; j++) {
                    if (this.slots[j].type_name === PersonReferent.ATTR_LASTNAME) {
                        let s1 = this.slots[j].value.toString();
                        if (s !== s1 && PersonReferent._del_surname_end(s) === PersonReferent._del_surname_end(s1) && s1.length !== s.length) {
                            if (this.is_male) {
                                this.upload_slot(this.slots[i], (s = PersonReferent._del_surname_end(s)));
                                this.slots.splice(j, 1);
                                j--;
                            }
                            else {
                                this.slots.splice(i, 1);
                                i--;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    
    correct_identifiers() {
        if (this.is_female) 
            return;
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i].type_name === PersonReferent.ATTR_IDENTITY) {
                let s = this.slots[i].value.toString();
                for (let j = i + 1; j < this.slots.length; j++) {
                    if (this.slots[j].type_name === PersonReferent.ATTR_IDENTITY) {
                        let s1 = this.slots[j].value.toString();
                        if (s !== s1 && PersonReferent._del_surname_end(s) === PersonReferent._del_surname_end(s1)) {
                            this.upload_slot(this.slots[i], (s = PersonReferent._del_surname_end(s)));
                            this.slots.splice(j, 1);
                            j--;
                            this.is_male = true;
                        }
                    }
                }
            }
        }
    }
    
    remove_slots(attr_name, cols) {
        let vars = new Array();
        for (const col of cols) {
            for (const v of col.values) {
                if (!vars.includes(v)) 
                    vars.push(v);
            }
        }
        if (vars.length < 1) 
            return;
        for (let i = this.slots.length - 1; i >= 0; i--) {
            if (this.slots[i].type_name === attr_name) {
                let v = this.slots[i].value.toString();
                if (!vars.includes(v)) {
                    for (let j = 0; j < this.slots.length; j++) {
                        if (j !== i && this.slots[j].type_name === this.slots[i].type_name) {
                            if (attr_name === PersonReferent.ATTR_LASTNAME) {
                                let ee = false;
                                for (const vv of vars) {
                                    if (this.compare_surnames_strs(v, vv)) 
                                        ee = true;
                                }
                                if (!ee) 
                                    continue;
                            }
                            this.slots.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }
    }
    
    remove_initials(attr_name) {
        for (const s of this.slots) {
            if (s.type_name === attr_name) {
                if (PersonReferent.is_initial(s.value.toString())) {
                    for (const ss of this.slots) {
                        if (ss.type_name === s.type_name && s !== ss) {
                            let v = ss.value.toString();
                            if (!PersonReferent.is_initial(v) && v.startsWith(s.value.toString())) {
                                if (attr_name === PersonReferent.ATTR_FIRSTNAME && v.length === 2 && this.find_slot(PersonReferent.ATTR_MIDDLENAME, v.substring(1), true) !== null) 
                                    Utils.removeItem(this.slots, ss);
                                else 
                                    Utils.removeItem(this.slots, s);
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
    
    correct_attrs() {
        let attrs = new Array();
        for (const s of this.slots) {
            if (s.type_name === PersonReferent.ATTR_ATTR && (s.value instanceof PersonPropertyReferent)) 
                attrs.push(Utils.as(s.value, PersonPropertyReferent));
        }
        if (attrs.length < 2) 
            return;
        for (const a of attrs) {
            a.tag = null;
        }
        for (let i = 0; i < (attrs.length - 1); i++) {
            for (let j = i + 1; j < attrs.length; j++) {
                if (attrs[i].general_referent === attrs[j] || attrs[j].can_be_general_for(attrs[i])) 
                    attrs[j].tag = attrs[i];
                else if (attrs[j].general_referent === attrs[i] || attrs[i].can_be_general_for(attrs[j])) 
                    attrs[i].tag = attrs[j];
            }
        }
        for (let i = this.slots.length - 1; i >= 0; i--) {
            if (this.slots[i].type_name === PersonReferent.ATTR_ATTR && (this.slots[i].value instanceof PersonPropertyReferent)) {
                if ((this.slots[i].value).tag !== null) {
                    let pr = Utils.as((this.slots[i].value).tag, PersonPropertyReferent);
                    if (pr !== null && pr.general_referent === null) 
                        pr.general_referent = Utils.as(this.slots[i].value, PersonPropertyReferent);
                    this.slots.splice(i, 1);
                }
            }
        }
    }
    
    create_ontology_item() {
        let oi = new IntOntologyItem(this);
        let tit = this._find_shortest_king_titul(false);
        for (const a of this.slots) {
            if (a.type_name === PersonReferent.ATTR_IDENTITY) 
                oi.termins.push(Termin._new2608(a.value.toString(), true));
            else if (a.type_name === PersonReferent.ATTR_LASTNAME) {
                let t = new Termin(a.value.toString());
                if (t.terms.length > 20) {
                }
                if (this.is_male) 
                    t.gender = MorphGender.MASCULINE;
                else if (this.is_female) 
                    t.gender = MorphGender.FEMINIE;
                oi.termins.push(t);
            }
            else if (a.type_name === PersonReferent.ATTR_FIRSTNAME && tit !== null) {
                let t = new Termin((tit + " " + a.value.toString()));
                if (this.is_male) 
                    t.gender = MorphGender.MASCULINE;
                else if (this.is_female) 
                    t.gender = MorphGender.FEMINIE;
                oi.termins.push(t);
            }
        }
        return oi;
    }
    
    static static_constructor() {
        PersonReferent.OBJ_TYPENAME = "PERSON";
        PersonReferent.ATTR_SEX = "SEX";
        PersonReferent.ATTR_IDENTITY = "IDENTITY";
        PersonReferent.ATTR_FIRSTNAME = "FIRSTNAME";
        PersonReferent.ATTR_MIDDLENAME = "MIDDLENAME";
        PersonReferent.ATTR_LASTNAME = "LASTNAME";
        PersonReferent.ATTR_NICKNAME = "NICKNAME";
        PersonReferent.ATTR_ATTR = "ATTRIBUTE";
        PersonReferent.ATTR_AGE = "AGE";
        PersonReferent.ATTR_BORN = "BORN";
        PersonReferent.ATTR_DIE = "DIE";
        PersonReferent.ATTR_CONTACT = "CONTACT";
        PersonReferent.ATTR_IDDOC = "IDDOC";
        PersonReferent.SHOW_LASTNAME_ON_FIRST_POSITION = false;
    }
}


PersonReferent.static_constructor();

module.exports = PersonReferent
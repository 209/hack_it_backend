/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../unisharp/StringBuilder");

const TerminParseAttr = require("./../core/TerminParseAttr");
const MorphLang = require("./../../morph/MorphLang");
const LanguageHelper = require("./../../morph/LanguageHelper");
const OrgProfile = require("./OrgProfile");
const IntOntologyItem = require("./../core/IntOntologyItem");
const GeoReferent = require("./../geo/GeoReferent");
const AddressReferent = require("./../address/AddressReferent");
const ReferentEqualType = require("./../ReferentEqualType");
const ReferentToken = require("./../ReferentToken");
const MetaOrganization = require("./internal/MetaOrganization");
const Morphology = require("./../../morph/Morphology");
const ReferentClass = require("./../ReferentClass");
const TextToken = require("./../TextToken");
const Termin = require("./../core/Termin");
const Referent = require("./../Referent");
const MiscHelper = require("./../core/MiscHelper");
const BracketHelper = require("./../core/BracketHelper");
const OrganizationKind = require("./OrganizationKind");

/**
 * Организация как сущность
 */
class OrganizationReferent extends Referent {
    
    constructor() {
        super(OrganizationReferent.OBJ_TYPENAME);
        this.m_number_calc = false;
        this.m_number = null;
        this.m_parent = null;
        this.m_parent_calc = false;
        this.m_name_single_normal_real = null;
        this.m_name_vars = null;
        this.m_name_hashs = null;
        this.m_level = 0;
        this.m_temp_parent_org = null;
        this.is_from_global_ontos = false;
        this.ext_ontology_attached = false;
        this.m_kind = OrganizationKind.UNDEFINED;
        this.m_kind_calc = false;
        this.instance_of = MetaOrganization.global_meta;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        const OrgItemTypeToken = require("./internal/OrgItemTypeToken");
        let res = new StringBuilder();
        let is_dep = this.kind === OrganizationKind.DEPARTMENT;
        let name = null;
        let altname = null;
        let names_count = 0;
        let len = 0;
        let no_type = false;
        for (const s of this.slots) {
            if (s.type_name === OrganizationReferent.ATTR_NAME) {
                let n = s.value.toString();
                names_count++;
                len += n.length;
            }
        }
        if (names_count > 0) {
            len = Utils.intDiv(len, names_count);
            if (len > 10) 
                len -= ((Utils.intDiv(len, 7)));
            let cou = 0;
            let altcou = 0;
            for (const s of this.slots) {
                if (s.type_name === OrganizationReferent.ATTR_NAME) {
                    let n = s.value.toString();
                    if (n.length >= len) {
                        if (s.count > cou) {
                            name = n;
                            cou = s.count;
                        }
                        else if (s.count === cou) {
                            if (name === null) 
                                name = n;
                            else if (name.length < n.length) 
                                name = n;
                        }
                    }
                    else if (s.count > altcou) {
                        altname = n;
                        altcou = s.count;
                    }
                    else if (s.count === altcou) {
                        if (altname === null) 
                            altname = n;
                        else if (altname.length > n.length) 
                            altname = n;
                    }
                }
            }
        }
        if (name !== null) {
            if (altname !== null) {
                if (Utils.replaceString(name, " ", "").includes(altname)) 
                    altname = null;
            }
            if (altname !== null && ((altname.length > 30 || altname.length > (Utils.intDiv(name.length, 2))))) 
                altname = null;
            if (altname === null) {
                for (const s of this.slots) {
                    if (s.type_name === OrganizationReferent.ATTR_NAME) {
                        if (MiscHelper.can_be_equal_cyr_and_latss(name, String(s.value))) {
                            altname = String(s.value);
                            break;
                        }
                    }
                }
            }
        }
        else {
            for (const s of this.slots) {
                if (s.type_name === OrganizationReferent.ATTR_TYPE) {
                    let nam = Utils.asString(s.value);
                    if (OrgItemTypeToken._get_kind(nam, null, this) === OrganizationKind.UNDEFINED) 
                        continue;
                    if (name === null || nam.length > name.length) 
                        name = nam;
                    no_type = true;
                }
            }
            if (name === null) {
                for (const s of this.slots) {
                    if (s.type_name === OrganizationReferent.ATTR_TYPE) {
                        let nam = Utils.asString(s.value);
                        if (name === null || nam.length > name.length) 
                            name = nam;
                        no_type = true;
                    }
                }
            }
        }
        let out_own_in_name = false;
        if (name !== null) {
            res.append(MiscHelper.convert_first_char_upper_and_other_lower(name));
            if (((!is_dep && names_count === 0 && this.higher !== null) && this.higher.higher === null && this.number === null) && this.eponyms.length === 0) 
                out_own_in_name = true;
        }
        if (this.number !== null) {
            if (OrganizationReferent.SHOW_NUMBER_ON_FIRST_POSITION) 
                res.insert(0, (this.number + " "));
            else 
                res.append(" №").append(this.number);
        }
        let fams = null;
        for (const r of this.slots) {
            if (r.type_name === OrganizationReferent.ATTR_EPONYM && r.value !== null) {
                if (fams === null) 
                    fams = new Array();
                fams.push(r.value.toString());
            }
        }
        if (fams !== null) {
            fams.sort();
            res.append(" имени ");
            for (let i = 0; i < fams.length; i++) {
                if (i > 0 && ((i + 1) < fams.length)) 
                    res.append(", ");
                else if (i > 0) 
                    res.append(" и ");
                res.append(fams[i]);
            }
        }
        if (altname !== null && !is_dep) 
            res.append(" (").append(MiscHelper.convert_first_char_upper_and_other_lower(altname)).append(")");
        if (!short_variant && this.owner !== null) 
            res.append("; ").append(this.owner.to_string(true, lang, lev + 1));
        if (!short_variant) {
            if (!no_type && !is_dep) {
                let typ = null;
                for (const t of this.types) {
                    if (OrgItemTypeToken._get_kind(t, null, this) === OrganizationKind.UNDEFINED) 
                        continue;
                    if (typ === null || typ.length > t.length) 
                        typ = t;
                }
                if (typ === null) {
                    for (const t of this.types) {
                        if (typ === null || typ.length > t.length) 
                            typ = t;
                    }
                }
                if (name !== null && !Utils.isNullOrEmpty(typ) && !Utils.isUpperCase(typ[0])) {
                    if (name.toUpperCase().includes(typ.toUpperCase())) 
                        typ = null;
                }
                if (typ !== null) 
                    res.append(", ").append(typ);
            }
            for (const ss of this.slots) {
                if (ss.type_name === OrganizationReferent.ATTR_GEO && ss.value !== null) 
                    res.append(", ").append(ss.value.toString());
            }
            let kl = this.get_string_value(OrganizationReferent.ATTR_KLADR);
            if (kl !== null) 
                res.append(" (КЛАДР № ").append(kl).append(")");
        }
        if (!short_variant) {
            if (is_dep || out_own_in_name) {
                for (const ss of this.slots) {
                    if (ss.type_name === OrganizationReferent.ATTR_HIGHER && (ss.value instanceof Referent) && (lev < 20)) {
                        let hi = Utils.as(ss.value, OrganizationReferent);
                        if (hi !== null) {
                            let tmp = new Array();
                            tmp.push(this);
                            for (; hi !== null; hi = hi.higher) {
                                if (tmp.includes(hi)) 
                                    break;
                                else 
                                    tmp.push(hi);
                            }
                            if (hi !== null) 
                                continue;
                        }
                        res.append(';');
                        res.append(" ").append((ss.value).to_string(short_variant, lang, lev + 1));
                        break;
                    }
                }
            }
        }
        if (res.length === 0) {
            if (this.inn !== null) 
                res.append("ИНН: ").append(this.inn);
            if (this.ogrn !== null) 
                res.append(" ОГРН: ").append(this.inn);
        }
        return res.toString();
    }
    
    to_sort_string() {
        return this.kind.toString() + this.to_string(true, MorphLang.UNKNOWN, 0);
    }
    
    get_compare_strings() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === OrganizationReferent.ATTR_NAME || s.type_name === OrganizationReferent.ATTR_EPONYM) {
                let str = s.value.toString();
                if (!res.includes(str)) 
                    res.push(str);
                if (str.indexOf(' ') > 0 || str.indexOf('-') > 0) {
                    str = Utils.replaceString(Utils.replaceString(str, " ", ""), "-", "");
                    if (!res.includes(str)) 
                        res.push(str);
                }
            }
            else if (s.type_name === OrganizationReferent.ATTR_NUMBER) 
                res.push((String(this.kind) + " " + s.value.toString()));
        }
        if (res.length === 0) {
            for (const s of this.slots) {
                if (s.type_name === OrganizationReferent.ATTR_TYPE) {
                    let t = s.value.toString();
                    if (!res.includes(t)) 
                        res.push(t);
                }
            }
        }
        if (this.inn !== null) 
            res.push("ИНН:" + this.inn);
        if (this.ogrn !== null) 
            res.push("ОГРН:" + this.ogrn);
        if (res.length > 0) 
            return res;
        else 
            return super.get_compare_strings();
    }
    
    check_correction() {
        if (this.slots.length < 1) 
            return false;
        let s = this.to_string(true, MorphLang.UNKNOWN, 0).toLowerCase();
        if (s.includes("прокуратура") || s.includes("штаб") || s.includes("кабинет")) 
            return true;
        if (this.slots.length === 1) {
            if (this.slots[0].type_name !== OrganizationReferent.ATTR_NAME) {
                if (this.kind === OrganizationKind.GOVENMENT || this.kind === OrganizationKind.JUSTICE) 
                    return true;
                return false;
            }
        }
        if (this.find_slot(OrganizationReferent.ATTR_TYPE, null, true) === null && this.find_slot(OrganizationReferent.ATTR_NAME, null, true) === null) 
            return false;
        if (s === "государственная гражданская служба" || s === "здравоохранения") 
            return false;
        if (this.types.includes("колония")) {
            if (this.number === null) 
                return false;
        }
        if (s.includes("конгресс")) {
            if (this.find_slot(OrganizationReferent.ATTR_GEO, null, true) === null) 
                return false;
        }
        let nams = this.names;
        if (nams.length === 1 && nams[0].length === 1 && (this.types.length < 3)) 
            return false;
        if (nams.includes("ВА")) {
            if (this.kind === OrganizationKind.BANK) 
                return false;
        }
        return true;
    }
    
    /**
     * [Get] Номер ИНН
     */
    get inn() {
        return this._get_misc_value("ИНН:");
    }
    /**
     * [Set] Номер ИНН
     */
    set inn(value) {
        if (value !== null) 
            this.add_slot(OrganizationReferent.ATTR_MISC, "ИНН:" + value, false, 0);
        return value;
    }
    
    /**
     * [Get] Номер ОГРН
     */
    get ogrn() {
        return this._get_misc_value("ОГРН");
    }
    /**
     * [Set] Номер ОГРН
     */
    set ogrn(value) {
        if (value !== null) 
            this.add_slot(OrganizationReferent.ATTR_MISC, "ОГРН:" + value, false, 0);
        return value;
    }
    
    _get_misc_value(pref) {
        for (const s of this.slots) {
            if (s.type_name === OrganizationReferent.ATTR_MISC) {
                if (s.value instanceof Referent) {
                    let r = Utils.as(s.value, Referent);
                    if (r.type_name === "URI") {
                        let val = r.get_string_value("SCHEME");
                        if (val === pref) 
                            return r.get_string_value("VALUE");
                    }
                }
                else if ((typeof s.value === 'string' || s.value instanceof String)) {
                    let str = Utils.asString(s.value);
                    if (str.startsWith(pref) && str.length > (pref.length + 1)) 
                        return str.substring(pref.length + 1);
                }
            }
        }
        return null;
    }
    
    /**
     * [Get] Список имён организации
     */
    get names() {
        let res = null;
        for (const s of this.slots) {
            if (s.type_name === OrganizationReferent.ATTR_NAME) {
                if (res === null) 
                    res = new Array();
                res.push(s.value.toString());
            }
        }
        return (res != null ? res : OrganizationReferent.m_empty_names);
    }
    
    correct_name(name, num) {
        num.value = 0;
        if (name === null || (name.length < 1)) 
            return null;
        if (Utils.isDigit(name[0]) && name.indexOf(' ') > 0) {
            let i = 0;
            let wrapi2379 = new RefOutArgWrapper();
            let inoutres2380 = Utils.tryParseInt(name.substring(0, 0 + name.indexOf(' ')), wrapi2379);
            i = wrapi2379.value;
            if (inoutres2380) {
                if (i > 1) {
                    num.value = i;
                    name = name.substring(name.indexOf(' ')).trim();
                }
            }
        }
        else if (Utils.isDigit(name[name.length - 1])) {
            let i = 0;
            for (i = name.length - 1; i >= 0; i--) {
                if (!Utils.isDigit(name[i])) 
                    break;
            }
            if (i >= 0 && name[i] === '.') {
            }
            else {
                let inoutres2381 = Utils.tryParseInt(name.substring(i + 1), num);
                if (i > 0 && inoutres2381 && num.value > 0) {
                    if (i < 1) 
                        return null;
                    name = name.substring(0, 0 + i).trim();
                    if (name.length > 0 && name[name.length - 1] === '-') 
                        name = name.substring(0, 0 + name.length - 1).trim();
                }
            }
        }
        return this.correct_name0(name);
    }
    
    correct_name0(name) {
        name = name.toUpperCase();
        if (name.length > 2 && !Utils.isLetterOrDigit(name[name.length - 1]) && Utils.isWhitespace(name[name.length - 2])) 
            name = name.substring(0, 0 + name.length - 2) + name.substring(name.length - 1);
        if (name.includes(" НА СТ.")) 
            name = Utils.replaceString(name, " НА СТ.", " НА СТАНЦИИ");
        return this.correct_type(name);
    }
    
    correct_type(name) {
        if (name === null) 
            return null;
        if (name.endsWith(" полок")) 
            name = name.substring(0, 0 + name.length - 5) + "полк";
        else if (name === "полок") 
            name = "полк";
        let tmp = new StringBuilder();
        let not_empty = false;
        for (let i = 0; i < name.length; i++) {
            let ch = name[i];
            if (Utils.isLetterOrDigit(ch)) 
                not_empty = true;
            else if (ch !== '&' && ch !== ',' && ch !== '.') 
                ch = ' ';
            if (Utils.isWhitespace(ch)) {
                if (tmp.length === 0) 
                    continue;
                if (tmp.charAt(tmp.length - 1) !== ' ' && tmp.charAt(tmp.length - 1) !== '.') 
                    tmp.append(' ');
                continue;
            }
            let is_sp_before = tmp.length === 0 || tmp.charAt(tmp.length - 1) === ' ';
            if (ch === '&' && !is_sp_before) 
                tmp.append(' ');
            if (((ch === ',' || ch === '.')) && is_sp_before && tmp.length > 0) 
                tmp.length = tmp.length - 1;
            tmp.append(ch);
        }
        if (!not_empty) 
            return null;
        while (tmp.length > 0) {
            let ch = tmp.charAt(tmp.length - 1);
            if ((ch === ' ' || ch === ',' || ch === '.') || Utils.isWhitespace(ch)) 
                tmp.length = tmp.length - 1;
            else 
                break;
        }
        return tmp.toString();
    }
    
    add_name(name, remove_long_gov_names = true, t = null) {
        let num = 0;
        let wrapnum2382 = new RefOutArgWrapper();
        let s = this.correct_name(name, wrapnum2382);
        num = wrapnum2382.value;
        if (s === null) {
            if (num > 0 && this.number === null) 
                this.number = num.toString();
            return;
        }
        if (s === "УПРАВЛЕНИЕ") {
        }
        let i = s.indexOf(' ');
        if (i === 2 && s[1] === 'К' && ((i + 3) < s.length)) {
            this.add_slot(OrganizationReferent.ATTR_TYPE, s.substring(0, 0 + 2), false, 0);
            s = s.substring(3).trim();
        }
        if (this.kind === OrganizationKind.BANK || s.includes("БАНК")) {
            if (s.startsWith("КБ ")) {
                this.add_type_str("коммерческий банк");
                s = s.substring(3);
            }
            else if (s.startsWith("АКБ ")) {
                this.add_type_str("акционерный коммерческий банк");
                s = s.substring(3);
            }
        }
        if (num > 0) {
            if (s.length > 10) 
                this.number = num.toString();
            else 
                s = (s + num);
        }
        let cou = 1;
        if (t !== null && !t.chars.is_letter && BracketHelper.is_bracket(t, false)) 
            t = t.next;
        if (((t instanceof TextToken) && (s.indexOf(' ') < 0) && s.length > 3) && s === (t).term) {
            let mt = Morphology.process(s, t.morph.language, null);
            if (mt !== null && mt.length === 1) {
                let snorm = mt[0].lemma;
                if (snorm === s) {
                    if (this.m_name_single_normal_real === null) {
                        this.m_name_single_normal_real = s;
                        for (let ii = this.slots.length - 1; ii >= 0; ii--) {
                            if (this.slots[ii].type_name === OrganizationReferent.ATTR_NAME && ((Utils.asString(this.slots[ii].value))) !== s) {
                                mt = Morphology.process(Utils.asString(this.slots[ii].value), t.morph.language, null);
                                if (mt !== null && mt.length === 1) {
                                    if (mt[0].lemma === this.m_name_single_normal_real) {
                                        cou += this.slots[ii].count;
                                        this.slots.splice(ii, 1);
                                        this.m_name_vars = null;
                                        this.m_name_hashs = null;
                                    }
                                }
                            }
                        }
                    }
                }
                else if (snorm === this.m_name_single_normal_real && snorm !== null) 
                    s = snorm;
            }
        }
        for (const a of this.slots) {
            if (a.type_name === OrganizationReferent.ATTR_NAME) {
                let n = a.value.toString();
                if (s === n) {
                    a.count = a.count + cou;
                    return;
                }
            }
            else if (a.type_name === OrganizationReferent.ATTR_TYPE) {
                let n = a.value.toString();
                if (Utils.compareStrings(s, n, true) === 0) 
                    return;
                if (s.startsWith(n + " ")) 
                    s = s.substring(n.length + 1);
            }
        }
        this.add_slot(OrganizationReferent.ATTR_NAME, s, false, 1);
        if (LanguageHelper.ends_with(s, " ПО")) {
            s = s.substring(0, 0 + s.length - 2) + "ПРОГРАММНОГО ОБЕСПЕЧЕНИЯ";
            this.add_slot(OrganizationReferent.ATTR_NAME, s, false, 0);
        }
        this.correct_data(remove_long_gov_names);
    }
    
    add_name_str(name, typ, cou = 1) {
        if (typ !== null && typ.alt_typ !== null && !typ.is_not_typ) 
            this.add_type_str(typ.alt_typ);
        if (name === null) {
            if (typ.is_not_typ) 
                return;
            if (typ.name !== null && Utils.compareStrings(typ.name, typ.typ, true) !== 0 && ((typ.name.length > typ.typ.length || this.find_slot(OrganizationReferent.ATTR_NAME, null, true) === null))) {
                let num = 0;
                let wrapnum2383 = new RefOutArgWrapper();
                let s = this.correct_name(typ.name, wrapnum2383);
                num = wrapnum2383.value;
                this.add_slot(OrganizationReferent.ATTR_NAME, s, false, cou);
                if (num > 0 && typ.is_dep && this.number === null) 
                    this.number = num.toString();
            }
            else if (typ.alt_typ !== null) 
                this.add_slot(OrganizationReferent.ATTR_NAME, this.correct_name0(typ.alt_typ), false, cou);
        }
        else {
            let s = this.correct_name0(name);
            if (typ === null || typ.is_not_typ) 
                this.add_slot(OrganizationReferent.ATTR_NAME, s, false, cou);
            else {
                this.add_slot(OrganizationReferent.ATTR_NAME, (typ.typ.toUpperCase() + " " + s), false, cou);
                if (typ.name !== null) {
                    let num = 0;
                    let wrapnum2384 = new RefOutArgWrapper();
                    let ss = this.correct_name(typ.name, wrapnum2384);
                    num = wrapnum2384.value;
                    if (ss !== null) {
                        this.add_type_str(ss);
                        this.add_slot(OrganizationReferent.ATTR_NAME, (ss + " " + s), false, cou);
                        if (num > 0 && typ.is_dep && this.number === null) 
                            this.number = num.toString();
                    }
                }
            }
            if (LanguageHelper.ends_with_ex(name, " ОБЛАСТИ", " РАЙОНА", " КРАЯ", " РЕСПУБЛИКИ")) {
                let ii = name.lastIndexOf(' ');
                this.add_name_str(name.substring(0, 0 + ii), typ, cou);
            }
        }
        this.correct_data(true);
    }
    
    /**
     * [Get] Профиль деятельности
     */
    get profiles() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === OrganizationReferent.ATTR_PROFILE) {
                try {
                    let str = Utils.asString(s.value);
                    if (str === "Politics") 
                        str = "Policy";
                    else if (str === "PartOf") 
                        str = "Unit";
                    let v = OrgProfile.of(str);
                    res.push(v);
                } catch (ex2385) {
                }
            }
        }
        return res;
    }
    
    add_profile(prof) {
        if (prof !== OrgProfile.UNDEFINED) 
            this.add_slot(OrganizationReferent.ATTR_PROFILE, prof.toString(), false, 0);
    }
    
    contains_profile(prof) {
        return this.find_slot(OrganizationReferent.ATTR_PROFILE, prof.toString(), true) !== null;
    }
    
    /**
     * [Get] Список типов и префиксов организации (ЗАО, компания, институт ...)
     */
    get types() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === OrganizationReferent.ATTR_TYPE) 
                res.push(s.value.toString());
        }
        return res;
    }
    
    _types_contains(substr) {
        for (const s of this.slots) {
            if (s.type_name === OrganizationReferent.ATTR_TYPE) {
                if ((s.value).includes(substr)) 
                    return true;
            }
        }
        return false;
    }
    
    add_type(typ, final_add = false) {
        const OrgItemTypeToken = require("./internal/OrgItemTypeToken");
        if (typ === null) 
            return;
        for (const p of typ.profiles) {
            this.add_profile(p);
        }
        if (typ.is_not_typ) 
            return;
        for (let tt = typ.begin_token; tt !== null && tt.end_char <= typ.end_char; tt = tt.next) {
            let tok = OrgItemTypeToken.m_markers.try_parse(tt, TerminParseAttr.NO);
            if (tok !== null) 
                this.add_slot(OrganizationReferent.ATTR_MARKER, tok.termin.canonic_text, false, 0);
        }
        if (typ.typ === "следственный комитет") {
            this.add_type_str("комитет");
            this.add_name(typ.typ, true, null);
        }
        else {
            this.add_type_str(typ.typ);
            if (typ.number !== null) 
                this.number = typ.number;
            if (typ.typ === "АКБ") 
                this.add_type_str("банк");
            if (typ.name !== null && typ.name !== "ПОЛОК") {
                if (typ.name_is_name) 
                    this.add_name(typ.name, true, null);
                else if (typ.typ === "министерство" && Utils.startsWithString(typ.name, typ.typ + " ", true)) 
                    this.add_name(typ.name, true, null);
                else if (typ.typ.endsWith("электростанция") && Utils.endsWithString(typ.name, " " + typ.typ, true)) 
                    this.add_name(typ.name, true, null);
                else if (this.find_slot(OrganizationReferent.ATTR_NAME, null, true) !== null && this.find_slot(OrganizationReferent.ATTR_NAME, typ.name, true) === null) 
                    this.add_type_str(typ.name.toLowerCase());
                else if (final_add) {
                    let ss = typ.name.toLowerCase();
                    if (LanguageHelper.is_latin(ss) && ss.endsWith(" " + typ.typ)) {
                        if (typ.root !== null && ((typ.root.can_has_latin_name || typ.root.can_has_single_name)) && !typ.root.must_be_partof_name) {
                            let sl = this.find_slot(OrganizationReferent.ATTR_NAME, typ.name, true);
                            if (sl !== null) 
                                Utils.removeItem(this.slots, sl);
                            this.add_name(ss.substring(0, 0 + ss.length - typ.typ.length - 1).toUpperCase(), true, null);
                            this.add_name(ss.toUpperCase(), true, null);
                            ss = null;
                        }
                    }
                    if (ss !== null) 
                        this.add_type_str(ss);
                }
                if (typ.alt_name !== null) 
                    this.add_name(typ.alt_name, true, null);
            }
        }
        if (typ.alt_typ !== null) 
            this.add_type_str(typ.alt_typ);
        if (typ.number !== null) 
            this.number = typ.number;
        if (typ.root !== null) {
            if (typ.root.acronym !== null) {
                if (this.find_slot(OrganizationReferent.ATTR_TYPE, typ.root.acronym, true) === null) 
                    this.add_slot(OrganizationReferent.ATTR_TYPE, typ.root.acronym, false, 0);
            }
            if (typ.root.canonic_text !== null && typ.root.canonic_text !== "СБЕРЕГАТЕЛЬНЫЙ БАНК" && typ.root.canonic_text !== typ.root.acronym) 
                this.add_type_str(typ.root.canonic_text.toLowerCase());
        }
        if (typ.geo !== null) {
            if (((typ.geo.referent instanceof GeoReferent)) && (typ.geo.referent).is_region && this.kind === OrganizationKind.STUDY) {
            }
            else 
                this.add_geo_object(typ.geo);
        }
        if (typ.geo2 !== null) 
            this.add_geo_object(typ.geo2);
        if (final_add) {
            if (this.kind === OrganizationKind.BANK) 
                this.add_slot(OrganizationReferent.ATTR_TYPE, "банк", false, 0);
        }
    }
    
    add_type_str(typ) {
        if (typ === null) 
            return;
        typ = this.correct_type(typ);
        if (typ === null) 
            return;
        let ok = true;
        for (const n of this.names) {
            if (Utils.startsWithString(n, typ, true)) {
                ok = false;
                break;
            }
        }
        if (!ok) 
            return;
        this.add_slot(OrganizationReferent.ATTR_TYPE, typ, false, 0);
        this.correct_data(true);
    }
    
    get_sorted_types(for_ontos) {
        let res = Array.from(this.types);
        res.sort();
        for (let i = 0; i < res.length; i++) {
            if (Utils.isLowerCase(res[i][0])) {
                let into = false;
                for (const r of res) {
                    if (r !== res[i] && r.includes(res[i])) {
                        into = true;
                        break;
                    }
                }
                if (!into && !for_ontos) {
                    let v = res[i].toUpperCase();
                    for (const n of this.names) {
                        if (n.includes(v)) {
                            into = true;
                            break;
                        }
                    }
                }
                if (into) {
                    res.splice(i, 1);
                    i--;
                    continue;
                }
            }
        }
        return res;
    }
    
    /**
     * [Get] Номер (если есть)
     */
    get number() {
        if (!this.m_number_calc) {
            this.m_number = this.get_string_value(OrganizationReferent.ATTR_NUMBER);
            this.m_number_calc = true;
        }
        return this.m_number;
    }
    /**
     * [Set] Номер (если есть)
     */
    set number(value) {
        this.add_slot(OrganizationReferent.ATTR_NUMBER, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Типа владелец - (Аппарат Президента)
     */
    get owner() {
        return Utils.as(this.get_slot_value(OrganizationReferent.ATTR_OWNER), Referent);
    }
    /**
     * [Set] Типа владелец - (Аппарат Президента)
     */
    set owner(value) {
        this.add_slot(OrganizationReferent.ATTR_OWNER, Utils.as(value, Referent), true, 0);
        return value;
    }
    
    /**
     * [Get] Вышестоящая организация
     */
    get higher() {
        if (this.m_parent_calc) 
            return this.m_parent;
        this.m_parent_calc = true;
        this.m_parent = Utils.as(this.get_slot_value(OrganizationReferent.ATTR_HIGHER), OrganizationReferent);
        if (this.m_parent === this || this.m_parent === null) 
            return this.m_parent = null;
        let sl = this.m_parent.find_slot(OrganizationReferent.ATTR_HIGHER, null, true);
        if (sl === null) 
            return this.m_parent;
        let li = new Array();
        li.push(this);
        li.push(this.m_parent);
        for (let oo = Utils.as(sl.value, OrganizationReferent); oo !== null; oo = Utils.as(oo.get_slot_value(OrganizationReferent.ATTR_HIGHER), OrganizationReferent)) {
            if (li.includes(oo)) 
                return this.m_parent = null;
            li.push(oo);
        }
        return this.m_parent;
    }
    /**
     * [Set] Вышестоящая организация
     */
    set higher(value) {
        if (value !== null) {
            let d = value;
            let li = new Array();
            for (; d !== null; d = d.higher) {
                if (d === this) 
                    return value;
                else if (d.toString() === this.toString()) 
                    return value;
                if (li.includes(d)) 
                    return value;
                li.push(d);
            }
        }
        this.add_slot(OrganizationReferent.ATTR_HIGHER, null, true, 0);
        if (value !== null) 
            this.add_slot(OrganizationReferent.ATTR_HIGHER, value, true, 0);
        this.m_parent_calc = false;
        return value;
    }
    
    get parent_referent() {
        let hi = this.higher;
        if (hi !== null) 
            return hi;
        return this.owner;
    }
    
    /**
     * [Get] Список объектов, которым посвящена организации (имени кого)
     */
    get eponyms() {
        let res = null;
        for (const s of this.slots) {
            if (s.type_name === OrganizationReferent.ATTR_EPONYM) {
                if (res === null) 
                    res = new Array();
                res.push(s.value.toString());
            }
        }
        return (res != null ? res : OrganizationReferent.m_empry_eponyms);
    }
    
    add_eponym(rod_padez_surname) {
        if (rod_padez_surname === null) 
            return;
        rod_padez_surname = MiscHelper.convert_first_char_upper_and_other_lower(rod_padez_surname);
        if (this.find_slot(OrganizationReferent.ATTR_EPONYM, rod_padez_surname, true) === null) 
            this.add_slot(OrganizationReferent.ATTR_EPONYM, rod_padez_surname, false, 0);
    }
    
    get geo_objects() {
        let res = null;
        for (const s of this.slots) {
            if (s.type_name === OrganizationReferent.ATTR_GEO && (s.value instanceof GeoReferent)) {
                if (res === null) 
                    res = new Array();
                res.push(Utils.as(s.value, GeoReferent));
            }
        }
        return (res != null ? res : OrganizationReferent.m_empty_geos);
    }
    
    add_geo_object(r) {
        if (r instanceof GeoReferent) {
            let _geo = Utils.as(r, GeoReferent);
            for (const s of this.slots) {
                if (s.type_name === OrganizationReferent.ATTR_GEO && (s.value instanceof GeoReferent)) {
                    let gg = Utils.as(s.value, GeoReferent);
                    if (gg.can_be_equals(_geo, ReferentEqualType.WITHINONETEXT) || gg.higher === _geo) 
                        return true;
                    if (this.find_slot(OrganizationReferent.ATTR_TYPE, "посольство", true) !== null) 
                        break;
                    if (_geo.is_state !== gg.is_state) {
                        if (gg.is_state) {
                            if (this.kind === OrganizationKind.GOVENMENT) 
                                return false;
                            if (!_geo.is_city) 
                                return false;
                        }
                    }
                    if (_geo.is_city === gg.is_city) {
                        let sovm = false;
                        for (const t of this.types) {
                            if (t.includes("совместн") || t.includes("альянс")) 
                                sovm = true;
                        }
                        if (!sovm) 
                            return false;
                    }
                    if (_geo.higher === gg) {
                        this.upload_slot(s, _geo);
                        return true;
                    }
                }
            }
            this.add_slot(OrganizationReferent.ATTR_GEO, r, false, 0);
            return true;
        }
        else if (r instanceof ReferentToken) {
            if ((r).get_referent() instanceof GeoReferent) {
                if (!this.add_geo_object((r).get_referent())) 
                    return false;
                this.add_ext_referent(Utils.as(r, ReferentToken));
                return true;
            }
            if ((r).get_referent() instanceof AddressReferent) 
                return this.add_geo_object((r).begin_token.get_referent());
        }
        return false;
    }
    
    get name_vars() {
        if (this.m_name_vars !== null) 
            return this.m_name_vars;
        this.m_name_vars = new Hashtable();
        this.m_name_hashs = new Array();
        let name_abbr = null;
        let ki = this.kind;
        for (const n of this.names) {
            if (!this.m_name_vars.containsKey(n)) 
                this.m_name_vars.put(n, false);
        }
        for (const n of this.names) {
            let a = null;
            if (ki === OrganizationKind.BANK) {
                if (!n.includes("БАНК")) {
                    a = n + "БАНК";
                    if (!this.m_name_vars.containsKey(a)) 
                        this.m_name_vars.put(a, false);
                }
            }
            if ((((a = MiscHelper.get_abbreviation(n)))) !== null && a.length > 1) {
                if (!this.m_name_vars.containsKey(a)) 
                    this.m_name_vars.put(a, true);
                if (name_abbr === null) 
                    name_abbr = new Array();
                if (!name_abbr.includes(a)) 
                    name_abbr.push(a);
                for (const _geo of this.geo_objects) {
                    let aa = (a + _geo.to_string(true, MorphLang.UNKNOWN, 0)[0]);
                    if (!this.m_name_vars.containsKey(aa)) 
                        this.m_name_vars.put(aa, true);
                    if (!name_abbr.includes(aa)) 
                        name_abbr.push(aa);
                }
            }
            if ((((a = MiscHelper.get_tail_abbreviation(n)))) !== null) {
                if (!this.m_name_vars.containsKey(a)) 
                    this.m_name_vars.put(a, true);
            }
            let i = n.indexOf(' ');
            if (i > 0 && (n.indexOf(' ', i + 1) < 0)) {
                a = Utils.replaceString(n, " ", "");
                if (!this.m_name_vars.containsKey(a)) 
                    this.m_name_vars.put(a, false);
            }
        }
        for (const e of this.eponyms) {
            for (const ty of this.types) {
                let na = (ty + " " + e).toUpperCase();
                if (!this.m_name_vars.containsKey(na)) 
                    this.m_name_vars.put(na, false);
            }
        }
        let new_vars = new Array();
        for (const n of this.types) {
            let a = MiscHelper.get_abbreviation(n);
            if (a === null) 
                continue;
            for (const v of this.m_name_vars.keys) {
                if (!v.startsWith(a)) {
                    new_vars.push(a + v);
                    new_vars.push(a + " " + v);
                }
            }
        }
        for (const v of new_vars) {
            if (!this.m_name_vars.containsKey(v)) 
                this.m_name_vars.put(v, true);
        }
        for (const kp of this.m_name_vars.entries) {
            if (!kp.value) {
                let s = MiscHelper.get_absolute_normal_value(kp.key, false);
                if (s !== null && s.length > 4) {
                    if (!this.m_name_hashs.includes(s)) 
                        this.m_name_hashs.push(s);
                }
            }
        }
        return this.m_name_vars;
    }
    
    can_be_equals(obj, typ) {
        let ret = this.can_be_equals_ex(obj, false, typ);
        return ret;
    }
    
    can_be_general_for(obj) {
        if (this.m_level > 10) 
            return false;
        this.m_level++;
        let b = this.can_be_equals_ex(obj, true, ReferentEqualType.DIFFERENTTEXTS);
        this.m_level--;
        if (!b) 
            return false;
        let geos1 = this.geo_objects;
        let geos2 = (obj).geo_objects;
        if (geos1.length === 0 && geos2.length > 0) {
            if (this._check_eq_eponyms(Utils.as(obj, OrganizationReferent))) 
                return false;
            return true;
        }
        else if (geos1.length === geos2.length) {
            if (this._check_eq_eponyms(Utils.as(obj, OrganizationReferent))) 
                return false;
            if (this.higher !== null && (obj).higher !== null) {
                this.m_level++;
                b = this.higher.can_be_general_for((obj).higher);
                this.m_level--;
                if (b) 
                    return true;
            }
        }
        return false;
    }
    
    _check_eq_eponyms(_org) {
        if (this.find_slot(OrganizationReferent.ATTR_EPONYM, null, true) === null && _org.find_slot(OrganizationReferent.ATTR_EPONYM, null, true) === null) 
            return false;
        let eps = this.eponyms;
        let eps1 = _org.eponyms;
        for (const e of eps) {
            if (eps1.includes(e)) 
                return true;
            if (!LanguageHelper.ends_with(e, "а")) {
                if (eps1.includes(e + "а")) 
                    return true;
            }
        }
        for (const e of eps1) {
            if (eps.includes(e)) 
                return true;
            if (!LanguageHelper.ends_with(e, "а")) {
                if (eps.includes(e + "а")) 
                    return true;
            }
        }
        if (this.find_slot(OrganizationReferent.ATTR_EPONYM, null, true) !== null && _org.find_slot(OrganizationReferent.ATTR_EPONYM, null, true) !== null) 
            return false;
        let s = _org.to_string(true, MorphLang.UNKNOWN, 0);
        for (const e of this.eponyms) {
            if (s.includes(e)) 
                return true;
        }
        s = this.to_string(true, MorphLang.UNKNOWN, 0);
        for (const e of _org.eponyms) {
            if (s.includes(e)) 
                return true;
        }
        return false;
    }
    
    can_be_equals_ex(obj, ignore_geo_objects, typ) {
        if (this.m_level > 10) 
            return false;
        this.m_level++;
        let ret = this._can_be_equals(obj, ignore_geo_objects, typ, 0);
        this.m_level--;
        if (!ret) {
        }
        return ret;
    }
    
    _can_be_equals(obj, ignore_geo_objects, typ, lev) {
        const OrgItemTypeToken = require("./internal/OrgItemTypeToken");
        let _org = Utils.as(obj, OrganizationReferent);
        if (_org === null) 
            return false;
        if (_org === this) 
            return true;
        if (lev > 4) 
            return false;
        let empty = true;
        let geo_not_equals = false;
        let k1 = this.kind;
        let k2 = _org.kind;
        let geos1 = this.geo_objects;
        let geos2 = _org.geo_objects;
        if (geos1.length > 0 && geos2.length > 0) {
            geo_not_equals = true;
            for (const g1 of geos1) {
                let eq = false;
                for (const g2 of geos2) {
                    if (g1.can_be_equals(g2, typ)) {
                        geo_not_equals = false;
                        eq = true;
                        break;
                    }
                }
                if (!eq) 
                    return false;
            }
            if (geos2.length > geos1.length) {
                for (const g1 of geos2) {
                    let eq = false;
                    for (const g2 of geos1) {
                        if (g1.can_be_equals(g2, typ)) {
                            geo_not_equals = false;
                            eq = true;
                            break;
                        }
                    }
                    if (!eq) 
                        return false;
                }
            }
        }
        if (this.find_slot(OrganizationReferent.ATTR_MARKER, null, true) !== null && _org.find_slot(OrganizationReferent.ATTR_MARKER, null, true) !== null) {
            let mrks1 = this.get_string_values(OrganizationReferent.ATTR_MARKER);
            let mrks2 = obj.get_string_values(OrganizationReferent.ATTR_MARKER);
            for (const m of mrks1) {
                if (!mrks2.includes(m)) 
                    return false;
            }
            for (const m of mrks2) {
                if (!mrks1.includes(m)) 
                    return false;
            }
        }
        let _inn = this.inn;
        let inn2 = _org.inn;
        if (_inn !== null && inn2 !== null) 
            return _inn === inn2;
        let _ogrn = this.ogrn;
        let ogrn2 = _org.ogrn;
        if (_ogrn !== null && ogrn2 !== null) 
            return _ogrn === ogrn2;
        let hi1 = Utils.notNull(this.higher, this.m_temp_parent_org);
        let hi2 = Utils.notNull(_org.higher, _org.m_temp_parent_org);
        let hi_eq = false;
        if (hi1 !== null && hi2 !== null) {
            if (_org.find_slot(OrganizationReferent.ATTR_HIGHER, hi1, false) === null) {
                if (hi1._can_be_equals(hi2, ignore_geo_objects, typ, lev + 1)) {
                }
                else 
                    return false;
            }
            hi_eq = true;
        }
        if (this.owner !== null || _org.owner !== null) {
            if (this.owner === null || _org.owner === null) 
                return false;
            if (!this.owner.can_be_equals(_org.owner, typ)) 
                return false;
            if (this.find_slot(OrganizationReferent.ATTR_TYPE, "индивидуальное предприятие", true) !== null || _org.find_slot(OrganizationReferent.ATTR_TYPE, "индивидуальное предприятие", true) !== null) 
                return true;
            hi_eq = true;
        }
        if (typ === ReferentEqualType.DIFFERENTTEXTS && !hi_eq) {
            if (this.higher !== null || _org.higher !== null) 
                return false;
        }
        if (OrgItemTypeToken.is_types_antagonisticoo(this, _org)) 
            return false;
        if (typ === ReferentEqualType.DIFFERENTTEXTS) {
            if (k1 === OrganizationKind.DEPARTMENT || k2 === OrganizationKind.DEPARTMENT) {
                if (hi1 === null && hi2 !== null) 
                    return false;
                if (hi1 !== null && hi2 === null) 
                    return false;
            }
            else if (k1 !== k2) 
                return false;
        }
        let eq_eponyms = this._check_eq_eponyms(_org);
        let eq_number = false;
        if (this.number !== null || _org.number !== null) {
            if (_org.number !== this.number) {
                if (((_org.number === null || this.number === null)) && eq_eponyms) {
                }
                else if (typ === ReferentEqualType.FORMERGING && ((_org.number === null || this.number === null))) {
                }
                else 
                    return false;
            }
            else {
                empty = false;
                for (const a of this.slots) {
                    if (a.type_name === OrganizationReferent.ATTR_TYPE) {
                        if (obj.find_slot(a.type_name, a.value, true) !== null || obj.find_slot(OrganizationReferent.ATTR_NAME, (a.value).toUpperCase(), true) !== null) {
                            eq_number = true;
                            break;
                        }
                    }
                }
            }
        }
        if (typ === ReferentEqualType.DIFFERENTTEXTS) {
            if (this.number !== null || _org.number !== null) {
                if (!eq_number && !eq_eponyms) 
                    return false;
            }
        }
        if (k1 !== OrganizationKind.UNDEFINED && k2 !== OrganizationKind.UNDEFINED) {
            if (k1 !== k2) {
                let oo = false;
                for (const ty1 of this.types) {
                    if (_org.types.includes(ty1)) {
                        oo = true;
                        break;
                    }
                }
                if (!oo) {
                    let has_pr = false;
                    for (const p of this.profiles) {
                        if (_org.contains_profile(p)) {
                            has_pr = true;
                            break;
                        }
                    }
                    if (!has_pr) 
                        return false;
                }
            }
        }
        else {
            if (k1 === OrganizationKind.UNDEFINED) 
                k1 = k2;
            if ((k1 === OrganizationKind.BANK || k1 === OrganizationKind.MEDICAL || k1 === OrganizationKind.PARTY) || k1 === OrganizationKind.CULTURE) {
                if (this.types.length > 0 && _org.types.length > 0) {
                    if (typ !== ReferentEqualType.FORMERGING) 
                        return false;
                    let ok = false;
                    for (const s of this.slots) {
                        if (s.type_name === OrganizationReferent.ATTR_NAME) {
                            if (_org.find_slot(s.type_name, s.value, true) !== null) 
                                ok = true;
                        }
                    }
                    if (!ok) 
                        return false;
                }
            }
        }
        if ((k1 === OrganizationKind.GOVENMENT || k2 === OrganizationKind.GOVENMENT || k1 === OrganizationKind.MILITARY) || k2 === OrganizationKind.MILITARY) {
            let typs = _org.types;
            let ok = false;
            for (const ty of this.types) {
                if (typs.includes(ty)) {
                    ok = true;
                    break;
                }
            }
            if (!ok) 
                return false;
        }
        if (typ === ReferentEqualType.FORMERGING) {
        }
        else if (this.find_slot(OrganizationReferent.ATTR_NAME, null, true) !== null || _org.find_slot(OrganizationReferent.ATTR_NAME, null, true) !== null) {
            if (((eq_number || eq_eponyms)) && ((this.find_slot(OrganizationReferent.ATTR_NAME, null, true) === null || _org.find_slot(OrganizationReferent.ATTR_NAME, null, true) === null))) {
            }
            else {
                empty = false;
                let max_len = 0;
                for (const v of this.name_vars.entries) {
                    if (typ === ReferentEqualType.DIFFERENTTEXTS && v.value) 
                        continue;
                    let b = false;
                    let wrapb2386 = new RefOutArgWrapper();
                    let inoutres2387 = _org.name_vars.tryGetValue(v.key, wrapb2386);
                    b = wrapb2386.value;
                    if (!inoutres2387) 
                        continue;
                    if (typ === ReferentEqualType.DIFFERENTTEXTS && b) 
                        continue;
                    if (b && v.value) 
                        continue;
                    if (b && this.names.length > 1 && (v.key.length < 4)) 
                        continue;
                    if (v.value && _org.names.length > 1 && (v.key.length < 4)) 
                        continue;
                    if (v.key.length > max_len) 
                        max_len = v.key.length;
                }
                if (typ !== ReferentEqualType.DIFFERENTTEXTS) {
                    for (const v of this.m_name_hashs) {
                        if (_org.m_name_hashs.includes(v)) {
                            if (v.length > max_len) 
                                max_len = v.length;
                        }
                    }
                }
                if ((max_len < 2) && ((k1 === OrganizationKind.GOVENMENT || typ === ReferentEqualType.FORMERGING)) && typ !== ReferentEqualType.DIFFERENTTEXTS) {
                    if (geos1.length === geos2.length) {
                        let nams = (typ === ReferentEqualType.FORMERGING ? _org.name_vars.keys : _org.names);
                        let nams0 = (typ === ReferentEqualType.FORMERGING ? this.name_vars.keys : this.names);
                        for (const n of nams0) {
                            for (const nn of nams) {
                                if (n.startsWith(nn)) {
                                    max_len = nn.length;
                                    break;
                                }
                                else if (nn.startsWith(n)) {
                                    max_len = n.length;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (max_len < 2) 
                    return false;
                if (max_len < 4) {
                    let ok = false;
                    if (!ok) {
                        if (this.names.length === 1 && (this.names[0].length < 4)) 
                            ok = true;
                        else if (_org.names.length === 1 && (_org.names[0].length < 4)) 
                            ok = true;
                    }
                    if (!ok) 
                        return false;
                }
            }
        }
        if (eq_eponyms) 
            return true;
        if (this.find_slot(OrganizationReferent.ATTR_EPONYM, null, true) !== null || obj.find_slot(OrganizationReferent.ATTR_EPONYM, null, true) !== null) {
            if (typ === ReferentEqualType.FORMERGING && ((this.find_slot(OrganizationReferent.ATTR_EPONYM, null, true) === null || obj.find_slot(OrganizationReferent.ATTR_EPONYM, null, true) === null))) {
            }
            else {
                let ok = false;
                let eps = this.eponyms;
                let eps1 = _org.eponyms;
                for (const e of eps) {
                    if (eps1.includes(e)) {
                        ok = true;
                        break;
                    }
                    if (!LanguageHelper.ends_with(e, "а")) {
                        if (eps1.includes(e + "а")) {
                            ok = true;
                            break;
                        }
                    }
                }
                if (!ok) {
                    for (const e of eps1) {
                        if (eps.includes(e)) {
                            ok = true;
                            break;
                        }
                        if (!LanguageHelper.ends_with(e, "а")) {
                            if (eps.includes(e + "а")) {
                                ok = true;
                                break;
                            }
                        }
                    }
                }
                if (ok) 
                    return true;
                if (this.find_slot(OrganizationReferent.ATTR_EPONYM, null, true) === null || obj.find_slot(OrganizationReferent.ATTR_EPONYM, null, true) === null) {
                    let s = obj.to_string(true, MorphLang.UNKNOWN, 0);
                    for (const e of this.eponyms) {
                        if (s.includes(e)) {
                            ok = true;
                            break;
                        }
                    }
                    if (!ok) {
                        s = this.to_string(true, MorphLang.UNKNOWN, 0);
                        for (const e of _org.eponyms) {
                            if (s.includes(e)) {
                                ok = true;
                                break;
                            }
                        }
                    }
                    if (ok) 
                        return true;
                    else if (empty) 
                        return false;
                }
                else 
                    return false;
            }
        }
        if (geo_not_equals) {
            if (k1 === OrganizationKind.BANK || k1 === OrganizationKind.GOVENMENT || k1 === OrganizationKind.DEPARTMENT) 
                return false;
        }
        if (k1 !== OrganizationKind.DEPARTMENT) {
            if (!empty) 
                return true;
            if (hi_eq) {
                let typs = _org.types;
                for (const ty of this.types) {
                    if (typs.includes(ty)) 
                        return true;
                }
            }
        }
        if (typ === ReferentEqualType.DIFFERENTTEXTS) 
            return this.toString() === _org.toString();
        if (empty) {
            if (((geos1.length > 0 && geos2.length > 0)) || k1 === OrganizationKind.DEPARTMENT || k1 === OrganizationKind.JUSTICE) {
                let typs = _org.types;
                for (const ty of this.types) {
                    if (typs.includes(ty)) 
                        return true;
                }
            }
            let full_not_eq = false;
            for (const s of this.slots) {
                if (_org.find_slot(s.type_name, s.value, true) === null) {
                    full_not_eq = true;
                    break;
                }
            }
            for (const s of _org.slots) {
                if (this.find_slot(s.type_name, s.value, true) === null) {
                    full_not_eq = true;
                    break;
                }
            }
            if (!full_not_eq) 
                return true;
        }
        else if (k1 === OrganizationKind.DEPARTMENT) 
            return true;
        if (typ === ReferentEqualType.FORMERGING) 
            return true;
        return false;
    }
    
    add_slot(attr_name, attr_value, clear_old_value, stat_count = 0) {
        if (attr_name === OrganizationReferent.ATTR_NAME || attr_name === OrganizationReferent.ATTR_TYPE) {
            this.m_name_vars = null;
            this.m_name_hashs = null;
        }
        else if (attr_name === OrganizationReferent.ATTR_HIGHER) 
            this.m_parent_calc = false;
        else if (attr_name === OrganizationReferent.ATTR_NUMBER) 
            this.m_number_calc = false;
        this.m_kind_calc = false;
        let sl = super.add_slot(attr_name, attr_value, clear_old_value, stat_count);
        return sl;
    }
    
    upload_slot(slot, new_val) {
        this.m_parent_calc = false;
        super.upload_slot(slot, new_val);
    }
    
    merge_slots(obj, merge_statistic) {
        let own_this = this.higher;
        let own_obj = (obj).higher;
        super.merge_slots(obj, merge_statistic);
        for (let i = this.slots.length - 1; i >= 0; i--) {
            if (this.slots[i].type_name === OrganizationReferent.ATTR_HIGHER) 
                this.slots.splice(i, 1);
        }
        if (own_this === null) 
            own_this = own_obj;
        if (own_this !== null) 
            this.higher = own_this;
        if ((obj).is_from_global_ontos) 
            this.is_from_global_ontos = true;
        this.correct_data(true);
    }
    
    correct_data(remove_long_gov_names) {
        for (let i = this.slots.length - 1; i >= 0; i--) {
            if (this.slots[i].type_name === OrganizationReferent.ATTR_TYPE) {
                let ty = this.slots[i].toString().toUpperCase();
                let del = false;
                for (const s of this.slots) {
                    if (s.type_name === OrganizationReferent.ATTR_NAME) {
                        let na = s.value.toString();
                        if (LanguageHelper.ends_with(ty, na)) 
                            del = true;
                    }
                }
                if (del) 
                    this.slots.splice(i, 1);
            }
        }
        for (const t of this.types) {
            let n = this.find_slot(OrganizationReferent.ATTR_NAME, t.toUpperCase(), true);
            if (n !== null) 
                Utils.removeItem(this.slots, n);
        }
        for (const t of this.names) {
            if (t.indexOf('.') > 0) {
                let n = this.find_slot(OrganizationReferent.ATTR_NAME, Utils.replaceString(t, '.', ' '), true);
                if (n === null) 
                    this.add_slot(OrganizationReferent.ATTR_NAME, Utils.replaceString(t, '.', ' '), false, 0);
            }
        }
        let eps = this.eponyms;
        if (eps.length > 1) {
            for (const e of eps) {
                for (const ee of eps) {
                    if (e !== ee && e.startsWith(ee)) {
                        let s = this.find_slot(OrganizationReferent.ATTR_EPONYM, ee, true);
                        if (s !== null) 
                            s.delete0();
                    }
                }
            }
        }
        let typs = this.types;
        let epons = this.eponyms;
        for (const t of typs) {
            for (const e of epons) {
                let n = this.find_slot(OrganizationReferent.ATTR_NAME, (t.toUpperCase() + " " + e.toUpperCase()), true);
                if (n !== null) 
                    Utils.removeItem(this.slots, n);
            }
        }
        if (remove_long_gov_names && this.kind === OrganizationKind.GOVENMENT) {
            let nams = this.names;
            for (let i = this.slots.length - 1; i >= 0; i--) {
                if (this.slots[i].type_name === OrganizationReferent.ATTR_NAME) {
                    let n = this.slots[i].value.toString();
                    for (const nn of nams) {
                        if (n.startsWith(nn) && n.length > nn.length) {
                            this.slots.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }
        if (this.types.includes("фронт")) {
            let uni = false;
            for (const ty of this.types) {
                if (ty.includes("объединение")) 
                    uni = true;
            }
            if (uni || this.profiles.includes(OrgProfile.UNION)) {
                let ss = this.find_slot(OrganizationReferent.ATTR_PROFILE, "ARMY", true);
                if (ss !== null) {
                    Utils.removeItem(this.slots, ss);
                    this.add_profile(OrgProfile.UNION);
                }
                if ((((ss = this.find_slot(OrganizationReferent.ATTR_TYPE, "фронт", true)))) !== null) 
                    Utils.removeItem(this.slots, ss);
            }
        }
        this.m_name_vars = null;
        this.m_name_hashs = null;
        this.m_kind_calc = false;
        this.ext_ontology_attached = false;
    }
    
    final_correction() {
        let typs = this.types;
        if (this.contains_profile(OrgProfile.EDUCATION) && this.contains_profile(OrgProfile.SCIENCE)) {
            if (typs.includes("академия") || typs.includes("академія") || typs.includes("academy")) {
                let is_sci = false;
                for (const n of this.names) {
                    if (n.includes("НАУЧН") || n.includes("НАУК") || n.includes("SCIENC")) {
                        is_sci = true;
                        break;
                    }
                }
                let s = null;
                if (is_sci) 
                    s = this.find_slot(OrganizationReferent.ATTR_PROFILE, OrgProfile.EDUCATION.toString(), true);
                else 
                    s = this.find_slot(OrganizationReferent.ATTR_PROFILE, OrgProfile.SCIENCE.toString(), true);
                if (s !== null) 
                    Utils.removeItem(this.slots, s);
            }
        }
        if (this.find_slot(OrganizationReferent.ATTR_PROFILE, null, true) === null) {
            if (typs.includes("служба") && this.higher !== null) 
                this.add_profile(OrgProfile.UNIT);
        }
        if (typs.length > 0 && LanguageHelper.is_latin(typs[0])) {
            if (this.find_slot(OrganizationReferent.ATTR_NAME, null, true) === null && typs.length > 1) {
                let nam = typs[0];
                for (const v of typs) {
                    if (v.length > nam.length) 
                        nam = v;
                }
                if (nam.indexOf(' ') > 0) {
                    this.add_slot(OrganizationReferent.ATTR_NAME, nam.toUpperCase(), false, 0);
                    let s = this.find_slot(OrganizationReferent.ATTR_TYPE, nam, true);
                    if (s !== null) 
                        Utils.removeItem(this.slots, s);
                }
            }
            if ((this.find_slot(OrganizationReferent.ATTR_NAME, null, true) === null && this.find_slot(OrganizationReferent.ATTR_GEO, null, true) !== null && this.find_slot(OrganizationReferent.ATTR_NUMBER, null, true) === null) && typs.length > 0) {
                let _geo = Utils.as(this.get_slot_value(OrganizationReferent.ATTR_GEO), GeoReferent);
                if (_geo !== null) {
                    let nam = _geo.get_string_value(GeoReferent.ATTR_NAME);
                    if (nam !== null && LanguageHelper.is_latin(nam)) {
                        let nn = false;
                        for (const t of typs) {
                            if (t.toUpperCase().includes(nam)) {
                                this.add_slot(OrganizationReferent.ATTR_NAME, t.toUpperCase(), false, 0);
                                nn = true;
                                if (typs.length > 1) {
                                    let s = this.find_slot(OrganizationReferent.ATTR_TYPE, t, true);
                                    if (s !== null) 
                                        Utils.removeItem(this.slots, s);
                                }
                                break;
                            }
                        }
                        if (!nn) 
                            this.add_slot(OrganizationReferent.ATTR_NAME, (nam + " " + typs[0]).toUpperCase(), false, 0);
                    }
                }
            }
        }
        this.m_name_vars = null;
        this.m_name_hashs = null;
        this.m_kind_calc = false;
        this.ext_ontology_attached = false;
    }
    
    _get_pure_names() {
        let vars = new Array();
        let typs = this.types;
        for (const a of this.slots) {
            if (a.type_name === OrganizationReferent.ATTR_NAME) {
                let s = a.value.toString().toUpperCase();
                if (!vars.includes(s)) 
                    vars.push(s);
                for (const t of typs) {
                    if (Utils.startsWithString(s, t, true)) {
                        if ((s.length < (t.length + 4)) || s[t.length] !== ' ') 
                            continue;
                        let ss = s.substring(t.length + 1);
                        if (!vars.includes(ss)) 
                            vars.push(ss);
                    }
                }
            }
        }
        return vars;
    }
    
    create_ontology_item() {
        return this.create_ontology_item_ex(2, false, false);
    }
    
    create_ontology_item_ex(min_len, only_names = false, pure_names = false) {
        let oi = new IntOntologyItem(this);
        let vars = new Array();
        let typs = this.types;
        for (const a of this.slots) {
            if (a.type_name === OrganizationReferent.ATTR_NAME) {
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
        if (!pure_names) {
            for (const v of this.name_vars.keys) {
                if (!vars.includes(v)) 
                    vars.push(v);
            }
        }
        if (!only_names) {
            if (this.number !== null) {
                for (const a of this.slots) {
                    if (a.type_name === OrganizationReferent.ATTR_TYPE) {
                        let s = a.value.toString().toUpperCase();
                        if (!vars.includes(s)) 
                            vars.push(s);
                    }
                }
            }
            if (vars.length === 0) {
                for (const t of this.types) {
                    let up = t.toUpperCase();
                    if (!vars.includes(up)) 
                        vars.push(up);
                }
            }
            if (this.inn !== null) 
                vars.splice(0, 0, "ИНН:" + this.inn);
            if (this.ogrn !== null) 
                vars.splice(0, 0, "ОГРН:" + this.ogrn);
        }
        let max = 20;
        let cou = 0;
        for (const v of vars) {
            if (v.length >= min_len) {
                let term = null;
                if (pure_names) {
                    term = new Termin();
                    term.init_by_normal_text(v, null);
                }
                else 
                    term = new Termin(v);
                oi.termins.push(term);
                if ((++cou) >= max) 
                    break;
            }
        }
        if (oi.termins.length === 0) 
            return null;
        return oi;
    }
    
    /**
     * [Get] Коласс организации (некоторая экспертная оценка на основе названия и типов)
     */
    get kind() {
        const OrgItemTypeToken = require("./internal/OrgItemTypeToken");
        if (!this.m_kind_calc) {
            this.m_kind = OrgItemTypeToken.check_kind(this);
            if (this.m_kind === OrganizationKind.UNDEFINED) {
                for (const p of this.profiles) {
                    if (p === OrgProfile.UNIT) {
                        this.m_kind = OrganizationKind.DEPARTMENT;
                        break;
                    }
                }
            }
            this.m_kind_calc = true;
        }
        return this.m_kind;
    }
    
    get_string_value(attr_name) {
        if (attr_name === "KIND") {
            let ki = this.kind;
            if (ki === OrganizationKind.UNDEFINED) 
                return null;
            return ki.toString();
        }
        return super.get_string_value(attr_name);
    }
    
    /**
     * Проверка, что организация slave может быть дополнительным описанием основной организации
     * @param master 
     * @param slave 
     * @return 
     */
    static can_be_second_definition(master, slave) {
        if (master === null || slave === null) 
            return false;
        let mtypes = master.types;
        let stypes = slave.types;
        let ok = false;
        for (const t of mtypes) {
            if (stypes.includes(t)) {
                ok = true;
                break;
            }
        }
        if (ok) 
            return true;
        if (master.kind !== OrganizationKind.UNDEFINED && slave.kind !== OrganizationKind.UNDEFINED) {
            if (master.kind !== slave.kind) 
                return false;
        }
        if (stypes.length > 0) 
            return false;
        if (slave.names.length === 1) {
            let acr = slave.names[0];
            if (LanguageHelper.ends_with(acr, "АН")) 
                return true;
            for (const n of master.names) {
                if (OrganizationReferent.check_acronym(acr, n) || OrganizationReferent.check_acronym(n, acr)) 
                    return true;
                if (OrganizationReferent.check_latin_accords(n, acr)) 
                    return true;
                for (const t of mtypes) {
                    if (OrganizationReferent.check_acronym(acr, t.toUpperCase() + n)) 
                        return true;
                }
            }
        }
        return false;
    }
    
    static check_latin_accords(rus_name, lat_name) {
        if (!LanguageHelper.is_cyrillic_char(rus_name[0]) || !LanguageHelper.is_latin_char(lat_name[0])) 
            return false;
        let ru = Utils.splitString(rus_name, ' ', false);
        let la = Utils.splitString(lat_name, ' ', false);
        let i = 0;
        let j = 0;
        while ((i < ru.length) && (j < la.length)) {
            if (Utils.compareStrings(la[j], "THE", true) === 0 || Utils.compareStrings(la[j], "OF", true) === 0) {
                j++;
                continue;
            }
            if (MiscHelper.can_be_equal_cyr_and_latss(ru[i], la[j])) 
                return true;
            i++;
            j++;
        }
        if ((i < ru.length) || (j < la.length)) 
            return false;
        if (i >= 2) 
            return true;
        return false;
    }
    
    static check_acronym(acr, text) {
        let i = 0;
        let j = 0;
        for (i = 0; i < acr.length; i++) {
            for (; j < text.length; j++) {
                if (text[j] === acr[i]) 
                    break;
            }
            if (j >= text.length) 
                break;
            j++;
        }
        return i >= acr.length;
    }
    
    /**
     * Проверка на отношения "вышестоящий - нижестоящий"
     * @param _higher 
     * @param lower 
     * @return 
     */
    static can_be_higher(_higher, lower) {
        const OrgOwnershipHelper = require("./internal/OrgOwnershipHelper");
        return OrgOwnershipHelper.can_be_higher(_higher, lower, false);
    }
    
    static static_constructor() {
        OrganizationReferent.OBJ_TYPENAME = "ORGANIZATION";
        OrganizationReferent.ATTR_NAME = "NAME";
        OrganizationReferent.ATTR_TYPE = "TYPE";
        OrganizationReferent.ATTR_NUMBER = "NUMBER";
        OrganizationReferent.ATTR_EPONYM = "EPONYM";
        OrganizationReferent.ATTR_HIGHER = "HIGHER";
        OrganizationReferent.ATTR_OWNER = "OWNER";
        OrganizationReferent.ATTR_GEO = "GEO";
        OrganizationReferent.ATTR_KLADR = "KLADR";
        OrganizationReferent.ATTR_MISC = "MISC";
        OrganizationReferent.ATTR_PROFILE = "PROFILE";
        OrganizationReferent.ATTR_MARKER = "MARKER";
        OrganizationReferent.SHOW_NUMBER_ON_FIRST_POSITION = false;
        OrganizationReferent.m_empty_names = new Array();
        OrganizationReferent.m_empry_eponyms = new Array();
        OrganizationReferent.m_empty_geos = new Array();
    }
}


OrganizationReferent.static_constructor();

module.exports = OrganizationReferent
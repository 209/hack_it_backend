/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const MorphCase = require("./../../../morph/MorphCase");
const MorphClass = require("./../../../morph/MorphClass");
const MorphForm = require("./../../../morph/MorphForm");
const MorphNumber = require("./../../../morph/MorphNumber");
const NumberSpellingType = require("./../../NumberSpellingType");
const CharsInfo = require("./../../../morph/CharsInfo");
const NumberToken = require("./../../NumberToken");
const Referent = require("./../../Referent");
const PersonAttrTokenPersonAttrAttachAttrs = require("./PersonAttrTokenPersonAttrAttachAttrs");
const FioTemplateType = require("./FioTemplateType");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const GeoReferent = require("./../../geo/GeoReferent");
const ShortNameHelper = require("./ShortNameHelper");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const MorphGender = require("./../../../morph/MorphGender");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const MorphBaseInfo = require("./../../../morph/MorphBaseInfo");
const EpNerPersonInternalResourceHelper = require("./EpNerPersonInternalResourceHelper");
const PersonItemTokenItemType = require("./PersonItemTokenItemType");
const MorphCollection = require("./../../MorphCollection");
const Token = require("./../../Token");
const TextToken = require("./../../TextToken");
const ReferentToken = require("./../../ReferentToken");
const MorphWordForm = require("./../../../morph/MorphWordForm");
const MetaToken = require("./../../MetaToken");
const PersonItemTokenParseAttr = require("./PersonItemTokenParseAttr");
const MiscHelper = require("./../../core/MiscHelper");
const BracketHelper = require("./../../core/BracketHelper");

class PersonItemToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.typ = PersonItemTokenItemType.VALUE;
        this.value = null;
        this.is_in_dictionary = false;
        this.is_hiphen_before = false;
        this.is_hiphen_after = false;
        this.firstname = null;
        this.lastname = null;
        this.middlename = null;
        this.referent = null;
    }
    
    static initialize() {
        PersonItemToken.MorphPersonItem.initialize();
    }
    
    is_asian_item(last) {
        if (this.value === null || this.typ !== PersonItemTokenItemType.VALUE) 
            return false;
        if (this.chars.is_all_lower) 
            return false;
        if (this.chars.is_all_upper && this.length_char > 1) 
            return false;
        let sogl = 0;
        let gl = 0;
        let prev_glas = false;
        for (let i = 0; i < this.value.length; i++) {
            let ch = this.value[i];
            if (!LanguageHelper.is_cyrillic_char(ch)) 
                return false;
            else if (LanguageHelper.is_cyrillic_vowel(ch)) {
                if (!prev_glas) {
                    if (gl > 0) {
                        if (!last) 
                            return false;
                        if (i === (this.value.length - 1) && ((ch === 'А' || ch === 'У' || ch === 'Е'))) 
                            break;
                        else if (i === (this.value.length - 2) && ch === 'О' && this.value[i + 1] === 'М') 
                            break;
                    }
                    gl++;
                }
                prev_glas = true;
            }
            else {
                sogl++;
                prev_glas = false;
            }
        }
        if (gl !== 1) {
            if (last && gl === 2) {
            }
            else 
                return false;
        }
        if (sogl > 4) 
            return false;
        if (this.value.length === 1) {
            if (!this.chars.is_all_upper) 
                return false;
        }
        else if (!this.chars.is_capital_upper) 
            return false;
        return true;
    }
    
    toString() {
        let res = new StringBuilder();
        res.append(this.typ.toString()).append(" ").append(((this.value != null ? this.value : "")));
        if (this.firstname !== null) 
            res.append(" (First: ").append(this.firstname.toString()).append(")");
        if (this.middlename !== null) 
            res.append(" (Middle: ").append(this.middlename.toString()).append(")");
        if (this.lastname !== null) 
            res.append(" (Last: ").append(this.lastname.toString()).append(")");
        if (this.referent !== null) 
            res.append(" Ref: ").append(this.referent);
        return res.toString();
    }
    
    add_postfix_info(postfix, gen) {
        if (this.value !== null) 
            this.value = (this.value + "-" + postfix);
        if (this.lastname !== null) 
            this.lastname.add_postfix(postfix, gen);
        if (this.firstname !== null) 
            this.firstname.add_postfix(postfix, gen);
        else if (this.lastname !== null) 
            this.firstname = this.lastname;
        else {
            this.firstname = PersonItemToken.MorphPersonItem._new2513(true);
            this.firstname.vars.push(new PersonItemToken.MorphPersonItemVariant(this.value, MorphBaseInfo._new2514(gen), false));
            if (this.lastname === null) 
                this.lastname = this.firstname;
        }
        if (this.middlename !== null) 
            this.middlename.add_postfix(postfix, gen);
        else if (this.firstname !== null && !this.chars.is_latin_letter) 
            this.middlename = this.firstname;
        this.is_in_dictionary = false;
    }
    
    merge_with_by_hiphen(pi) {
        this.end_token = pi.end_token;
        this.value = (this.value + "-" + pi.value);
        if (this.lastname !== null) {
            if (pi.lastname === null || pi.lastname.vars.length === 0) 
                this.lastname.add_postfix(pi.value, MorphGender.UNDEFINED);
            else 
                this.lastname.merge_with_by_hiphen(pi.lastname);
        }
        else if (pi.lastname !== null) {
            pi.lastname.add_prefix(this.value + "-");
            this.lastname = pi.lastname;
        }
        if (this.firstname !== null) {
            if (pi.firstname === null || pi.firstname.vars.length === 0) 
                this.firstname.add_postfix(pi.value, MorphGender.UNDEFINED);
            else 
                this.firstname.merge_with_by_hiphen(pi.firstname);
        }
        else if (pi.firstname !== null) {
            pi.firstname.add_prefix(this.value + "-");
            this.firstname = pi.firstname;
        }
        if (this.middlename !== null) {
            if (pi.middlename === null || pi.middlename.vars.length === 0) 
                this.middlename.add_postfix(pi.value, MorphGender.UNDEFINED);
            else 
                this.middlename.merge_with_by_hiphen(pi.middlename);
        }
        else if (pi.middlename !== null) {
            pi.middlename.add_prefix(this.value + "-");
            this.middlename = pi.middlename;
        }
    }
    
    remove_not_genitive() {
        if (this.lastname !== null) 
            this.lastname.remove_not_genitive();
        if (this.firstname !== null) 
            this.firstname.remove_not_genitive();
        if (this.middlename !== null) 
            this.middlename.remove_not_genitive();
    }
    
    static try_attach_latin(t) {
        const PersonReferent = require("./../PersonReferent");
        const MailLine = require("./../../mail/internal/MailLine");
        let tt = Utils.as(t, TextToken);
        if (tt === null) {
            let mt = Utils.as(t, MetaToken);
            if (mt !== null && mt.begin_token === mt.end_token) {
                let res00 = PersonItemToken.try_attach_latin(mt.begin_token);
                if (res00 !== null) {
                    res00.begin_token = res00.end_token = t;
                    return res00;
                }
            }
            return null;
        }
        if (!tt.chars.is_letter) 
            return null;
        if (tt.term === "THE") 
            return null;
        if (tt.term === "JR" || tt.term === "JNR" || tt.term === "JUNIOR") {
            let t1 = tt;
            if (tt.next !== null && tt.next.is_char('.')) 
                t1 = tt.next;
            return PersonItemToken._new2515(tt, t1, PersonItemTokenItemType.SUFFIX, "JUNIOR");
        }
        if ((tt.term === "SR" || tt.term === "SNR" || tt.term === "SENIOR") || tt.term === "FITZ" || tt.term === "FILS") {
            let t1 = tt;
            if (tt.next !== null && tt.next.is_char('.')) 
                t1 = tt.next;
            return PersonItemToken._new2515(tt, t1, PersonItemTokenItemType.SUFFIX, "SENIOR");
        }
        let initials = (tt.term === "YU" || tt.term === "YA" || tt.term === "CH") || tt.term === "SH";
        if (!initials && tt.term.length === 2 && tt.chars.is_capital_upper) {
            if (!LanguageHelper.is_latin_vowel(tt.term[0]) && !LanguageHelper.is_latin_vowel(tt.term[1])) 
                initials = true;
        }
        if (initials) {
            let rii = PersonItemToken._new2517(tt, tt, PersonItemTokenItemType.INITIAL, tt.term, tt.chars);
            if (tt.next !== null && tt.next.is_char('.')) 
                rii.end_token = tt.next;
            return rii;
        }
        if (tt.chars.is_all_lower) {
            if (!PersonItemToken.m_sur_prefixes_lat.includes(tt.term)) 
                return null;
        }
        if (tt.chars.is_cyrillic_letter) 
            return null;
        if (tt.length_char === 1) {
            if (tt.next === null) 
                return null;
            if (tt.next.is_char('.')) 
                return PersonItemToken._new2517(tt, tt.next, PersonItemTokenItemType.INITIAL, tt.term, tt.chars);
            if (!tt.next.is_whitespace_after && !tt.is_whitespace_after && ((tt.term === "D" || tt.term === "O" || tt.term === "M"))) {
                if (BracketHelper.is_bracket(tt.next, false) && (tt.next.next instanceof TextToken)) {
                    if (tt.next.next.chars.is_latin_letter) {
                        let pit0 = PersonItemToken.try_attach_latin(tt.next.next);
                        if (pit0 !== null && pit0.typ === PersonItemTokenItemType.VALUE) {
                            pit0.begin_token = tt;
                            let val = tt.term;
                            if (pit0.value !== null) {
                                if (val === "M" && pit0.value.startsWith("C")) {
                                    pit0.value = "MA" + pit0.value;
                                    val = "MA";
                                }
                                else 
                                    pit0.value = val + pit0.value;
                            }
                            if (pit0.lastname !== null) {
                                pit0.lastname.add_prefix(val);
                                pit0.lastname.is_in_dictionary = true;
                            }
                            else if (pit0.firstname !== null) {
                                pit0.lastname = pit0.firstname;
                                pit0.lastname.add_prefix(val);
                                pit0.lastname.is_in_dictionary = true;
                            }
                            pit0.firstname = (pit0.middlename = null);
                            if (!pit0.chars.is_all_upper && !pit0.chars.is_capital_upper) 
                                pit0.chars.is_capital_upper = true;
                            return pit0;
                        }
                    }
                }
            }
            if (!LanguageHelper.is_latin_vowel(tt.term[0]) || tt.whitespaces_after_count !== 1) {
                let nex = PersonItemToken.try_attach_latin(tt.next);
                if (nex !== null && nex.typ === PersonItemTokenItemType.VALUE) 
                    return PersonItemToken._new2517(tt, tt, PersonItemTokenItemType.INITIAL, tt.term, tt.chars);
                return null;
            }
            if (tt.term === "I") 
                return null;
            return PersonItemToken._new2517(tt, tt, PersonItemTokenItemType.VALUE, tt.term, tt.chars);
        }
        if (!MiscHelper.has_vowel(tt)) 
            return null;
        let res = null;
        if (PersonItemToken.m_sur_prefixes_lat.includes(tt.term)) {
            let te = tt.next;
            if (te !== null && te.is_hiphen) 
                te = te.next;
            res = PersonItemToken.try_attach_latin(te);
            if (res !== null) {
                res.value = (tt.term + "-" + res.value);
                res.begin_token = tt;
                res.lastname = new PersonItemToken.MorphPersonItem();
                res.lastname.vars.push(new PersonItemToken.MorphPersonItemVariant(res.value, new MorphBaseInfo(), true));
                res.lastname.is_lastname_has_hiphen = true;
                return res;
            }
        }
        if (MailLine.is_keyword(tt)) 
            return null;
        res = new PersonItemToken(tt, tt);
        res.value = tt.term;
        let cla = tt.get_morph_class_in_dictionary();
        if (cla.is_proper_name || ((cla.is_proper && ((tt.morph.gender === MorphGender.MASCULINE || tt.morph.gender === MorphGender.FEMINIE))))) {
            res.firstname = PersonItemToken.MorphPersonItem._new2521(res.value);
            for (const wf of tt.morph.items) {
                if ((wf).is_in_dictionary) {
                    if (wf.class0.is_proper_name) 
                        res.firstname.vars.push(new PersonItemToken.MorphPersonItemVariant(res.value, wf, false));
                }
            }
            if (res.firstname.vars.length === 0) 
                res.firstname.vars.push(new PersonItemToken.MorphPersonItemVariant(res.value, null, false));
            res.firstname.is_in_dictionary = true;
        }
        if (cla.is_proper_surname) {
            res.lastname = PersonItemToken.MorphPersonItem._new2521(res.value);
            for (const wf of tt.morph.items) {
                if ((wf).is_in_dictionary) {
                    if (wf.class0.is_proper_surname) 
                        res.lastname.vars.push(new PersonItemToken.MorphPersonItemVariant(res.value, wf, false));
                }
            }
            if (res.lastname.vars.length === 0) 
                res.lastname.vars.push(new PersonItemToken.MorphPersonItemVariant(res.value, null, false));
            res.lastname.is_in_dictionary = true;
        }
        if ((!cla.is_proper_name && !cla.is_proper && !cla.is_proper_surname) && !cla.is_undefined) 
            res.is_in_dictionary = true;
        res.morph = tt.morph;
        let ots = null;
        if (t !== null && t.kit.ontology !== null && ots === null) 
            ots = t.kit.ontology.attach_token(PersonReferent.OBJ_TYPENAME, t);
        if (ots !== null) {
            if (ots[0].termin.ignore_terms_order) 
                return PersonItemToken._new2523(ots[0].begin_token, ots[0].end_token, PersonItemTokenItemType.REFERENT, Utils.as(ots[0].item.tag, PersonReferent), ots[0].morph);
            res.lastname = PersonItemToken.MorphPersonItem._new2524(ots[0].termin.canonic_text, true);
            for (const ot of ots) {
                if (ot.termin !== null) {
                    let mi = ot.morph;
                    if (ot.termin.gender === MorphGender.MASCULINE || ot.termin.gender === MorphGender.FEMINIE) 
                        mi = MorphBaseInfo._new2514(ot.termin.gender);
                    res.lastname.vars.push(new PersonItemToken.MorphPersonItemVariant(ot.termin.canonic_text, mi, true));
                }
            }
        }
        if (res.value.startsWith("MC")) 
            res.value = "MAC" + res.value.substring(2);
        if (res.value.startsWith("MAC")) {
            res.firstname = (res.middlename = null);
            res.lastname = PersonItemToken.MorphPersonItem._new2513(true);
            res.lastname.vars.push(new PersonItemToken.MorphPersonItemVariant(res.value, new MorphBaseInfo(), true));
        }
        return res;
    }
    
    static try_attach(t, loc_ont, attrs = PersonItemTokenParseAttr.NO, prev_list = null) {
        const PersonReferent = require("./../PersonReferent");
        if (t === null) 
            return null;
        if (t instanceof TextToken) {
            let mc = t.get_morph_class_in_dictionary();
            if (mc.is_preposition || mc.is_conjunction || mc.is_misc) {
                if (t.next !== null && (t.next instanceof ReferentToken)) {
                    if ((((attrs.value()) & (PersonItemTokenParseAttr.MUSTBEITEMALWAYS.value()))) !== (PersonItemTokenParseAttr.NO.value()) && !t.chars.is_all_lower) {
                    }
                    else 
                        return null;
                }
            }
        }
        if (t instanceof NumberToken) {
            let nt = Utils.as(t, NumberToken);
            if (nt.begin_token === nt.end_token && nt.typ === NumberSpellingType.WORDS && ((!nt.begin_token.chars.is_all_lower || (((attrs.value()) & (PersonItemTokenParseAttr.MUSTBEITEMALWAYS.value()))) !== (PersonItemTokenParseAttr.NO.value())))) {
                let res00 = PersonItemToken.try_attach(nt.begin_token, loc_ont, attrs, prev_list);
                if (res00 !== null) {
                    res00.begin_token = res00.end_token = t;
                    return res00;
                }
            }
        }
        if (t instanceof ReferentToken) {
            let rt = Utils.as(t, ReferentToken);
            if (rt.begin_token === rt.end_token && rt.begin_token.chars.is_capital_upper) {
                let res00 = PersonItemToken.try_attach(rt.begin_token, loc_ont, attrs, prev_list);
                if (res00 !== null) {
                    let res01 = PersonItemToken.try_attach(t.next, loc_ont, attrs, prev_list);
                    if (res01 !== null && res01.lastname !== null && res01.firstname === null) 
                        return null;
                    res00.begin_token = res00.end_token = t;
                    return res00;
                }
            }
        }
        if ((((t instanceof TextToken) && t.length_char === 2 && (t).term === "JI") && t.chars.is_all_upper && !t.is_whitespace_after) && t.next !== null && t.next.is_char('.')) {
            let re1 = PersonItemToken._new2515(t, t.next, PersonItemTokenItemType.INITIAL, "Л");
            re1.chars.is_cyrillic_letter = true;
            re1.chars.is_all_upper = true;
            return re1;
        }
        if ((((((t instanceof TextToken) && t.length_char === 1 && (t).term === "J") && t.chars.is_all_upper && !t.is_whitespace_after) && (t.next instanceof NumberToken) && (t.next).value === "1") && (t.next).typ === NumberSpellingType.DIGIT && t.next.next !== null) && t.next.next.is_char('.')) {
            let re1 = PersonItemToken._new2515(t, t.next.next, PersonItemTokenItemType.INITIAL, "Л");
            re1.chars.is_cyrillic_letter = true;
            re1.chars.is_all_upper = true;
            return re1;
        }
        if ((((((t instanceof TextToken) && t.length_char === 1 && (t).term === "I") && t.chars.is_all_upper && !t.is_whitespace_after) && (t.next instanceof NumberToken) && (t.next).value === "1") && (t.next).typ === NumberSpellingType.DIGIT && t.next.next !== null) && t.next.next.is_char('.')) {
            if (prev_list !== null && prev_list[0].chars.is_cyrillic_letter) {
                let re1 = PersonItemToken._new2515(t, t.next.next, PersonItemTokenItemType.INITIAL, "П");
                re1.chars.is_cyrillic_letter = true;
                re1.chars.is_all_upper = true;
                return re1;
            }
        }
        if (loc_ont !== null && loc_ont.items.length > 1000) 
            loc_ont = null;
        let res = PersonItemToken._try_attach(t, loc_ont, attrs, prev_list);
        if (res !== null) 
            return res;
        if (t.chars.is_latin_letter && (((attrs.value()) & (PersonItemTokenParseAttr.CANBELATIN.value()))) !== (PersonItemTokenParseAttr.NO.value())) {
            let ots = null;
            if (loc_ont !== null) 
                ots = loc_ont.try_attach(t, PersonReferent.OBJ_TYPENAME, false);
            if (t !== null && t.kit.ontology !== null && ots === null) 
                ots = t.kit.ontology.attach_token(PersonReferent.OBJ_TYPENAME, t);
            if (ots !== null && (t instanceof TextToken)) {
                if (ots[0].termin.ignore_terms_order) 
                    return PersonItemToken._new2523(ots[0].begin_token, ots[0].end_token, PersonItemTokenItemType.REFERENT, Utils.as(ots[0].item.tag, PersonReferent), ots[0].morph);
                res = PersonItemToken._new2531(ots[0].begin_token, ots[0].end_token, (t).term, ots[0].chars);
                res.lastname = PersonItemToken.MorphPersonItem._new2524(ots[0].termin.canonic_text, true);
                for (const ot of ots) {
                    if (ot.termin !== null) {
                        let mi = ot.morph;
                        if (ot.termin.gender === MorphGender.MASCULINE || ot.termin.gender === MorphGender.FEMINIE) 
                            mi = MorphBaseInfo._new2514(ot.termin.gender);
                        res.lastname.vars.push(new PersonItemToken.MorphPersonItemVariant(ot.termin.canonic_text, mi, true));
                    }
                }
                return res;
            }
            res = PersonItemToken.try_attach_latin(t);
            if (res !== null) 
                return res;
        }
        if (((t instanceof NumberToken) && t.length_char === 1 && (((attrs.value()) & (PersonItemTokenParseAttr.CANINITIALBEDIGIT.value()))) !== (PersonItemTokenParseAttr.NO.value())) && t.next !== null && t.next.is_char_of(".„")) {
            if ((t).value === "1") 
                return PersonItemToken._new2517(t, t.next, PersonItemTokenItemType.INITIAL, "І", CharsInfo._new2534(true));
            if ((t).value === "0") 
                return PersonItemToken._new2517(t, t.next, PersonItemTokenItemType.INITIAL, "О", CharsInfo._new2534(true));
            if ((t).value === "3") 
                return PersonItemToken._new2517(t, t.next, PersonItemTokenItemType.INITIAL, "З", CharsInfo._new2534(true));
        }
        if ((((t instanceof NumberToken) && t.length_char === 1 && (((attrs.value()) & (PersonItemTokenParseAttr.CANINITIALBEDIGIT.value()))) !== (PersonItemTokenParseAttr.NO.value())) && t.next !== null && t.next.chars.is_all_lower) && !t.is_whitespace_after && t.next.length_char > 2) {
            let num = (t).value;
            if (num === "3" && t.next.chars.is_cyrillic_letter) 
                return PersonItemToken._new2517(t, t.next, PersonItemTokenItemType.VALUE, "З" + (t.next).term, CharsInfo._new2540(true, true));
            if (num === "0" && t.next.chars.is_cyrillic_letter) 
                return PersonItemToken._new2517(t, t.next, PersonItemTokenItemType.VALUE, "О" + (t.next).term, CharsInfo._new2540(true, true));
        }
        if (((((t instanceof TextToken) && t.length_char === 1 && t.chars.is_letter) && t.chars.is_all_upper && (t.whitespaces_after_count < 2)) && (t.next instanceof TextToken) && t.next.length_char === 1) && t.next.chars.is_all_lower) {
            let cou = 0;
            let t1 = null;
            let lat = 0;
            let cyr = 0;
            let ch = (t).get_source_text()[0];
            if (t.chars.is_cyrillic_letter) {
                cyr++;
                if ((LanguageHelper.get_lat_for_cyr(ch).charCodeAt(0)) !== 0) 
                    lat++;
            }
            else {
                lat++;
                if ((LanguageHelper.get_cyr_for_lat(ch).charCodeAt(0)) !== 0) 
                    cyr++;
            }
            for (let tt = t.next; tt !== null; tt = tt.next) {
                if (tt.whitespaces_before_count > 1) 
                    break;
                if (!((tt instanceof TextToken)) || tt.length_char !== 1 || !tt.chars.is_all_lower) 
                    break;
                t1 = tt;
                cou++;
                ch = (tt).get_source_text()[0];
                if (tt.chars.is_cyrillic_letter) {
                    cyr++;
                    if ((LanguageHelper.get_lat_for_cyr(ch).charCodeAt(0)) !== 0) 
                        lat++;
                }
                else {
                    lat++;
                    if ((LanguageHelper.get_cyr_for_lat(ch).charCodeAt(0)) !== 0) 
                        cyr++;
                }
            }
            if (cou < 2) 
                return null;
            if (cou < 5) {
                if (prev_list !== null && prev_list.length > 0 && prev_list[prev_list.length - 1].typ === PersonItemTokenItemType.INITIAL) {
                }
                else {
                    let ne = PersonItemToken.try_attach(t1.next, loc_ont, attrs, null);
                    if (ne === null || ne.typ !== PersonItemTokenItemType.INITIAL) 
                        return null;
                }
            }
            let is_cyr = cyr >= lat;
            if (cyr === lat && t.chars.is_latin_letter) 
                is_cyr = false;
            let val = new StringBuilder();
            for (let tt = t; tt !== null && tt.end_char <= t1.end_char; tt = tt.next) {
                ch = (tt).get_source_text()[0];
                if (is_cyr && LanguageHelper.is_latin_char(ch)) {
                    let chh = LanguageHelper.get_cyr_for_lat(ch);
                    if ((chh.charCodeAt(0)) !== 0) 
                        ch = chh;
                }
                else if (!is_cyr && LanguageHelper.is_cyrillic_char(ch)) {
                    let chh = LanguageHelper.get_lat_for_cyr(ch);
                    if ((chh.charCodeAt(0)) !== 0) 
                        ch = chh;
                }
                val.append(ch.toUpperCase());
            }
            res = PersonItemToken._new2515(t, t1, PersonItemTokenItemType.VALUE, val.toString());
            res.chars = CharsInfo._new2545(true, is_cyr, !is_cyr, true);
            return res;
        }
        if ((((attrs.value()) & (PersonItemTokenParseAttr.MUSTBEITEMALWAYS.value()))) !== (PersonItemTokenParseAttr.NO.value()) && (t instanceof TextToken) && !t.chars.is_all_lower) {
            res = PersonItemToken._new2546(t, t, (t).term);
            return res;
        }
        if (((t.chars.is_all_upper && t.length_char === 1 && prev_list !== null) && prev_list.length > 0 && (t.whitespaces_before_count < 2)) && prev_list[0].chars.is_capital_upper) {
            let last = prev_list[prev_list.length - 1];
            let ok = false;
            if ((last.typ === PersonItemTokenItemType.VALUE && last.lastname !== null && last.lastname.is_in_dictionary) && prev_list.length === 1) 
                ok = true;
            else if (prev_list.length === 2 && last.typ === PersonItemTokenItemType.INITIAL && prev_list[0].lastname !== null) 
                ok = true;
            if (ok) 
                return PersonItemToken._new2547(t, t, (t).term, PersonItemTokenItemType.INITIAL);
        }
        return null;
    }
    
    static _try_attach(t, loc_ont, attrs, prev_list = null) {
        const PersonReferent = require("./../PersonReferent");
        let tt = Utils.as(t, TextToken);
        if (tt === null) {
            if (t.chars.is_letter && t.chars.is_capital_upper && (t instanceof ReferentToken)) {
                let rt = Utils.as(t, ReferentToken);
                if (rt.begin_token === rt.end_token && !((rt.referent instanceof PersonReferent))) {
                    let res0 = PersonItemToken._try_attach(rt.begin_token, loc_ont, attrs, null);
                    if (res0 === null) {
                        res0 = PersonItemToken._new2548(rt, rt, rt.referent.to_string(true, t.kit.base_language, 0).toUpperCase(), rt.chars, rt.morph);
                        res0.lastname = PersonItemToken.MorphPersonItem._new2521(res0.value);
                    }
                    else 
                        res0.begin_token = res0.end_token = rt;
                    if ((t.next !== null && t.next.is_hiphen && (t.next.next instanceof TextToken)) && t.next.next.get_morph_class_in_dictionary().is_proper_secname) {
                        let res1 = PersonItemToken.try_attach(t.next.next, loc_ont, PersonItemTokenParseAttr.NO, null);
                        if (res1 !== null && res1.middlename !== null) {
                            res1.middlename.add_prefix(res0.value + "-");
                            res1.firstname = res1.middlename;
                            res1.begin_token = t;
                            return res1;
                        }
                    }
                    return res0;
                }
            }
            return null;
        }
        if (!tt.chars.is_letter) 
            return null;
        let can_be_all_lower = false;
        if (tt.chars.is_all_lower && (((attrs.value()) & (PersonItemTokenParseAttr.CANBELOWER.value()))) === (PersonItemTokenParseAttr.NO.value())) {
            if (!PersonItemToken.M_SUR_PREFIXES.includes(tt.term)) {
                let mc0 = tt.get_morph_class_in_dictionary();
                if (((tt.term === "Д" && !tt.is_whitespace_after && BracketHelper.is_bracket(tt.next, true)) && !tt.next.is_whitespace_after && (tt.next.next instanceof TextToken)) && tt.next.next.chars.is_capital_upper) {
                }
                else if (mc0.is_proper_surname && !mc0.is_noun) {
                    if (tt.next !== null && (tt.whitespaces_after_count < 3)) {
                        let mc1 = tt.next.get_morph_class_in_dictionary();
                        if (mc1.is_proper_name) 
                            can_be_all_lower = true;
                    }
                    if (tt.previous !== null && (tt.whitespaces_before_count < 3)) {
                        let mc1 = tt.previous.get_morph_class_in_dictionary();
                        if (mc1.is_proper_name) 
                            can_be_all_lower = true;
                    }
                    if (!can_be_all_lower) 
                        return null;
                }
                else if (mc0.is_proper_secname && !mc0.is_noun) {
                    if (tt.previous !== null && (tt.whitespaces_before_count < 3)) {
                        let mc1 = tt.previous.get_morph_class_in_dictionary();
                        if (mc1.is_proper_name) 
                            can_be_all_lower = true;
                    }
                    if (!can_be_all_lower) 
                        return null;
                }
                else if (mc0.is_proper_name && !mc0.is_noun) {
                    if (tt.next !== null && (tt.whitespaces_after_count < 3)) {
                        let mc1 = tt.next.get_morph_class_in_dictionary();
                        if (mc1.is_proper_surname || mc1.is_proper_secname) 
                            can_be_all_lower = true;
                    }
                    if (tt.previous !== null && (tt.whitespaces_before_count < 3)) {
                        let mc1 = tt.previous.get_morph_class_in_dictionary();
                        if (mc1.is_proper_surname) 
                            can_be_all_lower = true;
                    }
                    if (!can_be_all_lower) 
                        return null;
                }
                else 
                    return null;
            }
        }
        if (tt.length_char === 1 || tt.term === "ДЖ") {
            if (tt.next === null) 
                return null;
            let ini = tt.term;
            let ci = new CharsInfo(tt.chars);
            if (!tt.chars.is_cyrillic_letter) {
                let cyr = LanguageHelper.get_cyr_for_lat(ini[0]);
                if (cyr === (String.fromCharCode(0))) 
                    return null;
                ini = (cyr);
                ci.is_latin_letter = false;
                ci.is_cyrillic_letter = true;
            }
            if (tt.next.is_char('.')) 
                return PersonItemToken._new2517(tt, tt.next, PersonItemTokenItemType.INITIAL, ini, ci);
            if ((tt.next.is_char_of(",;„") && prev_list !== null && prev_list.length > 0) && prev_list[prev_list.length - 1].typ === PersonItemTokenItemType.INITIAL) 
                return PersonItemToken._new2517(tt, tt, PersonItemTokenItemType.INITIAL, ini, ci);
            if ((tt.next.whitespaces_after_count < 2) && (tt.whitespaces_after_count < 2) && ((tt.term === "Д" || tt.term === "О" || tt.term === "Н"))) {
                if (BracketHelper.is_bracket(tt.next, false) && (tt.next.next instanceof TextToken)) {
                    if (tt.next.next.chars.is_cyrillic_letter) {
                        let pit0 = PersonItemToken.try_attach(tt.next.next, loc_ont, PersonItemTokenParseAttr.of((attrs.value()) | (PersonItemTokenParseAttr.CANBELOWER.value())), prev_list);
                        if (pit0 !== null) {
                            pit0.begin_token = tt;
                            if (pit0.value !== null) 
                                pit0.value = ini + pit0.value;
                            if (pit0.lastname !== null) {
                                pit0.lastname.add_prefix(ini);
                                pit0.lastname.is_in_dictionary = true;
                            }
                            else if (pit0.firstname !== null) {
                                pit0.lastname = pit0.firstname;
                                pit0.lastname.add_prefix(ini);
                                pit0.lastname.is_in_dictionary = true;
                            }
                            pit0.firstname = (pit0.middlename = null);
                            if (!pit0.chars.is_all_upper && !pit0.chars.is_capital_upper) 
                                pit0.chars.is_capital_upper = true;
                            return pit0;
                        }
                    }
                }
            }
            if (!LanguageHelper.is_cyrillic_vowel(tt.term[0])) 
                return null;
            if (tt.whitespaces_after_count !== 1) {
                if (tt.next === null) {
                }
                else if ((!tt.is_whitespace_after && (tt.next instanceof TextToken) && !tt.next.is_char('.')) && !tt.next.chars.is_letter) {
                }
                else 
                    return null;
            }
            return PersonItemToken._new2517(tt, tt, PersonItemTokenItemType.VALUE, tt.term, tt.chars);
        }
        if (!tt.chars.is_cyrillic_letter) 
            return null;
        if (!MiscHelper.has_vowel(tt)) 
            return null;
        let ots = null;
        if (loc_ont !== null) 
            ots = loc_ont.try_attach(t, PersonReferent.OBJ_TYPENAME, false);
        if (t !== null && t.kit.ontology !== null && ots === null) 
            ots = t.kit.ontology.attach_token(PersonReferent.OBJ_TYPENAME, t);
        let sur_prefix = null;
        let res = null;
        if (ots !== null) {
            if (ots[0].termin.ignore_terms_order) 
                return PersonItemToken._new2523(ots[0].begin_token, ots[0].end_token, PersonItemTokenItemType.REFERENT, Utils.as(ots[0].item.tag, PersonReferent), ots[0].morph);
            let mc = ots[0].begin_token.get_morph_class_in_dictionary();
            if (ots[0].begin_token === ots[0].end_token && mc.is_proper_name && !mc.is_proper_surname) 
                ots = null;
        }
        if (ots !== null) {
            res = PersonItemToken._new2531(ots[0].begin_token, ots[0].end_token, tt.term, ots[0].chars);
            res.lastname = PersonItemToken.MorphPersonItem._new2555(true);
            res.lastname.term = ots[0].termin.canonic_text;
            for (const ot of ots) {
                if (ot.termin !== null) {
                    let mi = ot.morph;
                    if (ot.termin.gender === MorphGender.MASCULINE) {
                        if ((((t.morph.gender.value()) & (MorphGender.FEMINIE.value()))) !== (MorphGender.UNDEFINED.value())) 
                            continue;
                        mi = MorphBaseInfo._new2514(ot.termin.gender);
                    }
                    else if (ot.termin.gender === MorphGender.FEMINIE) {
                        if ((((t.morph.gender.value()) & (MorphGender.MASCULINE.value()))) !== (MorphGender.UNDEFINED.value())) 
                            continue;
                        mi = MorphBaseInfo._new2514(ot.termin.gender);
                    }
                    else 
                        continue;
                    res.lastname.vars.push(new PersonItemToken.MorphPersonItemVariant(ot.termin.canonic_text, mi, true));
                }
            }
            if (ots[0].termin.canonic_text.includes("-")) 
                return res;
        }
        else {
            res = PersonItemToken._new2548(t, t, tt.term, tt.chars, tt.morph);
            if (PersonItemToken.M_SUR_PREFIXES.includes(tt.term)) {
                if (((tt.is_value("БЕН", null) || tt.is_value("ВАН", null))) && (((attrs.value()) & (PersonItemTokenParseAttr.ALTVAR.value()))) !== (PersonItemTokenParseAttr.NO.value()) && ((tt.next === null || !tt.next.is_hiphen))) {
                }
                else {
                    if (tt.next !== null) {
                        let t1 = tt.next;
                        if (t1.is_hiphen) 
                            tt = Utils.as(t1.next, TextToken);
                        else if ((((attrs.value()) & (PersonItemTokenParseAttr.SURNAMEPREFIXNOTMERGE.value()))) !== (PersonItemTokenParseAttr.NO.value()) && t1.chars.is_all_lower) 
                            tt = null;
                        else 
                            tt = Utils.as(t1, TextToken);
                        if ((tt === null || tt.is_newline_before || tt.chars.is_all_lower) || !tt.chars.is_cyrillic_letter || (tt.length_char < 3)) {
                        }
                        else {
                            sur_prefix = res.value;
                            res.value = (res.value + "-" + tt.term);
                            res.morph = tt.morph;
                            res.chars = tt.chars;
                            res.end_token = tt;
                        }
                    }
                    if (sur_prefix === null) {
                        if (t.chars.is_capital_upper || t.chars.is_all_upper) 
                            return res;
                        return null;
                    }
                }
            }
        }
        if (tt.is_value("ФАМИЛИЯ", "ПРІЗВИЩЕ") || tt.is_value("ИМЯ", "ІМЯ") || tt.is_value("ОТЧЕСТВО", "БАТЬКОВІ")) 
            return null;
        if (tt.morph.class0.is_preposition || tt.morph.class0.is_conjunction) {
            if (tt.get_morph_class_in_dictionary().is_proper_name) {
            }
            else if (tt.next === null || !tt.next.is_char('.')) {
                if (tt.length_char > 1 && tt.chars.is_capital_upper && !MiscHelper.can_be_start_of_sentence(tt)) {
                }
                else 
                    return null;
            }
        }
        if ((((attrs.value()) & (PersonItemTokenParseAttr.MUSTBEITEMALWAYS.value()))) !== (PersonItemTokenParseAttr.NO.value())) {
        }
        else {
            if (tt.term.length > 6 && tt.term.startsWith("ЗД")) {
                if (MiscHelper.is_not_more_than_one_error("ЗДРАВСТВУЙТЕ", tt)) 
                    return null;
                if (MiscHelper.is_not_more_than_one_error("ЗДРАВСТВУЙ", tt)) 
                    return null;
            }
            if (tt.length_char > 6 && tt.term.startsWith("ПР")) {
                if (MiscHelper.is_not_more_than_one_error("ПРИВЕТСТВУЮ", tt)) 
                    return null;
            }
            if (tt.length_char > 6 && tt.term.startsWith("УВ")) {
                if (tt.is_value("УВАЖАЕМЫЙ", null)) 
                    return null;
            }
            if (tt.length_char > 6 && tt.term.startsWith("ДО")) {
                if (tt.is_value("ДОРОГОЙ", null)) 
                    return null;
            }
        }
        if (!tt.chars.is_all_upper && !tt.chars.is_capital_upper && !can_be_all_lower) {
            if ((((attrs.value()) & (PersonItemTokenParseAttr.CANINITIALBEDIGIT.value()))) !== (PersonItemTokenParseAttr.NO.value()) && !tt.chars.is_all_lower) {
            }
            else if ((((attrs.value()) & (PersonItemTokenParseAttr.CANBELOWER.value()))) === (PersonItemTokenParseAttr.NO.value())) 
                return null;
        }
        let adj = null;
        for (const wff of tt.morph.items) {
            let wf = Utils.as(wff, MorphWordForm);
            if (wf === null) 
                continue;
            if (wf.class0.is_adjective && wf.contains_attr("к.ф.", null)) {
                if (wf.is_in_dictionary) {
                    if (LanguageHelper.ends_with(tt.term, "НО") || ((tt.next !== null && tt.next.is_hiphen))) 
                        res.is_in_dictionary = true;
                }
                continue;
            }
            else if ((wf.class0.is_adjective && adj === null && !((wf.normal_full != null ? wf.normal_full : wf.normal_case)).endsWith("ОВ")) && !((wf.normal_full != null ? wf.normal_full : wf.normal_case)).endsWith("ИН") && (((wf.is_in_dictionary || wf.normal_case.endsWith("ЫЙ") || wf.normal_case.endsWith("ИЙ")) || wf.normal_case.endsWith("АЯ") || wf.normal_case.endsWith("ЯЯ")))) 
                adj = wf;
            if (wf.class0.is_verb) {
                if (wf.is_in_dictionary) 
                    res.is_in_dictionary = true;
                continue;
            }
            if (wf.is_in_dictionary) {
                if ((wf.class0.is_adverb || wf.class0.is_preposition || wf.class0.is_conjunction) || wf.class0.is_pronoun || wf.class0.is_personal_pronoun) 
                    res.is_in_dictionary = true;
            }
            if (wf.class0.is_proper_surname || sur_prefix !== null) {
                if (res.lastname === null) 
                    res.lastname = PersonItemToken.MorphPersonItem._new2521(tt.term);
                if (adj !== null) {
                    if (!wf.is_in_dictionary && adj.number === MorphNumber.SINGULAR) {
                        let val = adj.normal_case;
                        res.lastname.vars.push(new PersonItemToken.MorphPersonItemVariant(val, adj, true));
                        if (val === tt.term) 
                            break;
                    }
                    adj = null;
                }
                if ((((attrs.value()) & (PersonItemTokenParseAttr.NOMINATIVECASE.value()))) !== (PersonItemTokenParseAttr.NO.value())) {
                    if (!wf._case.is_undefined && !wf._case.is_nominative) 
                        continue;
                }
                let v = new PersonItemToken.MorphPersonItemVariant(wf.normal_case, wf, true);
                if (wf.normal_case !== tt.term && LanguageHelper.ends_with(tt.term, "ОВ")) {
                    v.value = tt.term;
                    v.gender = MorphGender.MASCULINE;
                }
                else if ((wf.number === MorphNumber.PLURAL && wf.normal_full !== null && wf.normal_full !== wf.normal_case) && wf.normal_full.length > 1) {
                    v.value = wf.normal_full;
                    v.number = MorphNumber.SINGULAR;
                    if (wf.normal_case.length > tt.term.length) 
                        v.value = tt.term;
                }
                res.lastname.vars.push(v);
                if (wf.is_in_dictionary && v.gender === MorphGender.UNDEFINED && wf.gender === MorphGender.UNDEFINED) {
                    v.gender = MorphGender.MASCULINE;
                    let vv = new PersonItemToken.MorphPersonItemVariant(wf.normal_case, wf, true);
                    vv.value = v.value;
                    vv.short_value = v.short_value;
                    vv.gender = MorphGender.FEMINIE;
                    res.lastname.vars.push(vv);
                }
                if (wf.is_in_dictionary) 
                    res.lastname.is_in_dictionary = true;
                if (tt.term.endsWith("ИХ") || tt.term.endsWith("ЫХ")) {
                    if (res.lastname.vars[0].value !== tt.term) 
                        res.lastname.vars.splice(0, 0, new PersonItemToken.MorphPersonItemVariant(tt.term, MorphBaseInfo._new2561(MorphCase.ALL_CASES, MorphGender.of((MorphGender.MASCULINE.value()) | (MorphGender.FEMINIE.value())), MorphClass._new2560(true)), true));
                }
            }
            if (sur_prefix !== null) 
                continue;
            if (wf.class0.is_proper_name && wf.number !== MorphNumber.PLURAL) {
                let ok = true;
                if (t.morph.language.is_ua) {
                }
                else if (wf.normal_case !== null && (wf.normal_case.length < 5)) {
                }
                else {
                    ok = !LanguageHelper.ends_with(wf.normal_case, "ОВ") && wf.normal_case !== "АЛЛ";
                    if (ok) {
                        if (tt.chars.is_all_upper && (tt.length_char < 4)) 
                            ok = false;
                    }
                }
                if (ok) {
                    if (res.firstname === null) 
                        res.firstname = PersonItemToken.MorphPersonItem._new2521(tt.term);
                    res.firstname.vars.push(new PersonItemToken.MorphPersonItemVariant(wf.normal_case, wf, false));
                    if (wf.is_in_dictionary) {
                        if (!tt.chars.is_all_upper || tt.length_char > 4) 
                            res.firstname.is_in_dictionary = true;
                    }
                }
            }
            if (!PersonItemToken.MorphPersonItem.ends_with_std_surname(tt.term)) {
                if (wf.class0.is_proper_secname) {
                    if (res.middlename === null) 
                        res.middlename = PersonItemToken.MorphPersonItem._new2521(tt.term);
                    else if (wf.misc.form === MorphForm.SYNONYM) 
                        continue;
                    let iii = new PersonItemToken.MorphPersonItemVariant(wf.normal_case, wf, false);
                    if (iii.value === tt.term) 
                        res.middlename.vars.splice(0, 0, iii);
                    else 
                        res.middlename.vars.push(iii);
                    if (wf.is_in_dictionary) 
                        res.middlename.is_in_dictionary = true;
                }
                if (!wf.class0.is_proper && wf.is_in_dictionary) 
                    res.is_in_dictionary = true;
            }
            else if (wf.is_in_dictionary && !wf.class0.is_proper && LanguageHelper.ends_with(tt.term, "КО")) 
                res.is_in_dictionary = true;
        }
        if (res.lastname !== null) {
            for (const v of res.lastname.vars) {
                if (PersonItemToken.MorphPersonItem.ends_with_std_surname(v.value)) {
                    res.lastname.is_lastname_has_std_tail = true;
                    break;
                }
            }
            if (!res.lastname.is_in_dictionary) {
                if (((!res.lastname.is_in_dictionary && !res.lastname.is_lastname_has_std_tail)) || PersonItemToken.MorphPersonItem.ends_with_std_surname(tt.term)) {
                    let v = new PersonItemToken.MorphPersonItemVariant(tt.term, null, true);
                    if (LanguageHelper.ends_with_ex(tt.term, "ВА", "НА", null, null)) 
                        res.lastname.vars.splice(0, 0, v);
                    else 
                        res.lastname.vars.push(v);
                    if (PersonItemToken.MorphPersonItem.ends_with_std_surname(v.value) && !res.lastname.is_in_dictionary) 
                        res.lastname.is_lastname_has_std_tail = true;
                }
            }
            res.lastname.correct_lastname_variants();
            if (sur_prefix !== null) {
                res.lastname.is_lastname_has_hiphen = true;
                res.lastname.term = (sur_prefix + "-" + res.lastname.term);
                for (const v of res.lastname.vars) {
                    v.value = (sur_prefix + "-" + v.value);
                }
            }
            if (tt.morph.class0.is_adjective && !res.lastname.is_in_ontology) {
                let std_end = false;
                for (const v of res.lastname.vars) {
                    if (PersonItemToken.MorphPersonItem.ends_with_std_surname(v.value)) {
                        std_end = true;
                        break;
                    }
                }
                if (!std_end && (tt.whitespaces_after_count < 2)) {
                    let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                    if (npt !== null && npt.end_token !== npt.begin_token) {
                        if ((prev_list !== null && prev_list.length === 1 && prev_list[0].firstname !== null) && prev_list[0].firstname.is_in_dictionary && tt.whitespaces_before_count === 1) {
                        }
                        else 
                            res.lastname = null;
                    }
                }
            }
        }
        else if (tt.length_char > 2) {
            res.lastname = new PersonItemToken.MorphPersonItem();
            for (const wf of tt.morph.items) {
                if (!wf.class0.is_verb) {
                    if (wf.contains_attr("к.ф.", null)) 
                        continue;
                    res.lastname.vars.push(new PersonItemToken.MorphPersonItemVariant((wf).normal_case, wf, true));
                    if (!res.lastname.is_lastname_has_std_tail) 
                        res.lastname.is_lastname_has_std_tail = PersonItemToken.MorphPersonItem.ends_with_std_surname((wf).normal_case);
                }
            }
            res.lastname.vars.push(new PersonItemToken.MorphPersonItemVariant(tt.term, null, true));
            if (!res.lastname.is_lastname_has_std_tail) 
                res.lastname.is_lastname_has_std_tail = PersonItemToken.MorphPersonItem.ends_with_std_surname(tt.term);
            if (sur_prefix !== null) {
                res.lastname.add_prefix(sur_prefix + "-");
                res.lastname.is_lastname_has_hiphen = true;
            }
        }
        if (res.begin_token === res.end_token) {
            if (res.begin_token.get_morph_class_in_dictionary().is_verb && res.lastname !== null) {
                if (!res.lastname.is_lastname_has_std_tail && !res.lastname.is_in_dictionary) {
                    if (res.is_newline_before) {
                    }
                    else if (res.begin_token.chars.is_capital_upper && !MiscHelper.can_be_start_of_sentence(res.begin_token)) {
                    }
                    else 
                        res.lastname = null;
                }
            }
            if (res.lastname !== null && res.begin_token.is_value("ЗАМ", null)) 
                return null;
            if (res.firstname !== null && (res.begin_token instanceof TextToken)) {
                if ((res.begin_token).term === "ЛЮБОЙ") 
                    res.firstname = null;
            }
            if (res.begin_token.get_morph_class_in_dictionary().is_adjective && res.lastname !== null) {
                let npt = NounPhraseHelper.try_parse(res.begin_token, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null) {
                    if (npt.begin_token !== npt.end_token) {
                        if (!res.lastname.is_in_ontology && !res.lastname.is_in_dictionary) 
                            res.lastname = null;
                    }
                }
            }
        }
        if (res.firstname !== null) {
            for (let i = 0; i < res.firstname.vars.length; i++) {
                let val = res.firstname.vars[i].value;
                let di = ShortNameHelper.get_names_for_shortname(val);
                if (di === null) 
                    continue;
                let g = res.firstname.vars[i].gender;
                if (g !== MorphGender.MASCULINE && g !== MorphGender.FEMINIE) {
                    let fi = true;
                    for (const kp of di) {
                        if (fi) {
                            res.firstname.vars[i].short_value = val;
                            res.firstname.vars[i].value = kp.name;
                            res.firstname.vars[i].gender = kp.gender;
                            fi = false;
                        }
                        else {
                            let mi = MorphBaseInfo._new2514(kp.gender);
                            res.firstname.vars.push(PersonItemToken.MorphPersonItemVariant._new2565(kp.name, mi, false, val));
                        }
                    }
                }
                else {
                    let cou = 0;
                    for (const kp of di) {
                        if (kp.gender === g) {
                            if ((++cou) < 2) {
                                res.firstname.vars[i].value = kp.name;
                                res.firstname.vars[i].short_value = val;
                            }
                            else 
                                res.firstname.vars.splice(i + 1, 0, PersonItemToken.MorphPersonItemVariant._new2565(kp.name, res.firstname.vars[i], false, val));
                        }
                    }
                }
            }
        }
        if (res !== null && res.is_in_dictionary && res.firstname === null) {
            let wi = res.kit.statistics.get_word_info(res.begin_token);
            if (wi !== null && wi.lower_count > 0) {
                if (((t.morph.class0.is_preposition || t.morph.class0.is_conjunction || t.morph.class0.is_pronoun)) && !MiscHelper.can_be_start_of_sentence(t)) {
                }
                else 
                    return null;
            }
        }
        if (res.end_token.next !== null && res.end_token.next.is_hiphen && (res.end_token.next.next instanceof TextToken)) {
            let ter = (res.end_token.next.next).term;
            if (PersonItemToken.M_ARAB_POSTFIX.includes(ter) || PersonItemToken.M_ARAB_POSTFIX_FEM.includes(ter)) {
                res.end_token = res.end_token.next.next;
                res.add_postfix_info(ter, (PersonItemToken.M_ARAB_POSTFIX_FEM.includes(ter) ? MorphGender.FEMINIE : MorphGender.MASCULINE));
                if (((ter === "ОГЛЫ" || ter === "КЫЗЫ" || ter === "ГЫЗЫ") || ter === "УГЛИ" || ter === "КЗЫ") || ter === "УЛЫ" || ter === "УУЛУ") {
                    if (res.middlename !== null) {
                        res.firstname = null;
                        res.lastname = null;
                    }
                }
            }
            else if ((!res.is_whitespace_after && !res.end_token.next.is_whitespace_after && CharsInfo.ooEq(res.end_token.next.next.chars, res.begin_token.chars)) && res.begin_token === res.end_token) {
                let res1 = PersonItemToken.try_attach(res.end_token.next.next, loc_ont, PersonItemTokenParseAttr.NO, null);
                if (res1 !== null && res1.begin_token === res1.end_token) {
                    if (res1.lastname !== null && res.lastname !== null && ((((res1.lastname.is_has_std_postfix || res1.lastname.is_in_dictionary || res1.lastname.is_in_ontology) || res.lastname.is_has_std_postfix || res.lastname.is_in_dictionary) || res.lastname.is_in_ontology))) {
                        res.lastname.merge_hiphen(res1.lastname);
                        if (res.value !== null && res1.value !== null) 
                            res.value = (res.value + "-" + res1.value);
                        res.firstname = null;
                        res.middlename = null;
                        res.end_token = res1.end_token;
                    }
                    else if (res.firstname !== null && ((res.firstname.is_in_dictionary || res.firstname.is_in_ontology))) {
                        if (res1.firstname !== null) {
                            if (res.value !== null && res1.value !== null) 
                                res.value = (res.value + "-" + res1.value);
                            res.firstname.merge_hiphen(res1.firstname);
                            res.lastname = null;
                            res.middlename = null;
                            res.end_token = res1.end_token;
                        }
                        else if (res1.middlename !== null) {
                            if (res.value !== null && res1.value !== null) 
                                res.value = (res.value + "-" + res1.value);
                            res.end_token = res1.end_token;
                            if (res.middlename !== null) 
                                res.middlename.merge_hiphen(res1.middlename);
                            if (res.firstname !== null) {
                                res.firstname.merge_hiphen(res1.middlename);
                                if (res.middlename === null) 
                                    res.middlename = res.firstname;
                            }
                            if (res.lastname !== null) {
                                res.lastname.merge_hiphen(res1.middlename);
                                if (res.middlename === null) 
                                    res.middlename = res.firstname;
                            }
                        }
                        else if (res1.lastname !== null && !res1.lastname.is_in_dictionary && !res1.lastname.is_in_ontology) {
                            if (res.value !== null && res1.value !== null) 
                                res.value = (res.value + "-" + res1.value);
                            res.firstname.merge_hiphen(res1.lastname);
                            res.lastname = null;
                            res.middlename = null;
                            res.end_token = res1.end_token;
                        }
                    }
                    else if ((res.firstname === null && res.middlename === null && res.lastname !== null) && !res.lastname.is_in_ontology && !res.lastname.is_in_dictionary) {
                        if (res.value !== null && res1.value !== null) 
                            res.value = (res.value + "-" + res1.value);
                        res.end_token = res1.end_token;
                        if (res1.firstname !== null) {
                            res.lastname.merge_hiphen(res1.firstname);
                            res.firstname = res.lastname;
                            res.lastname = (res.middlename = null);
                        }
                        else if (res1.middlename !== null) {
                            res.lastname.merge_hiphen(res1.middlename);
                            res.middlename = res.lastname;
                            res.firstname = null;
                        }
                        else if (res1.lastname !== null) 
                            res.lastname.merge_hiphen(res1.lastname);
                        else if (res1.value !== null) {
                            for (const v of res.lastname.vars) {
                                v.value = (v.value + "-" + res1.value);
                            }
                        }
                    }
                    else if (((res.firstname === null && res.lastname === null && res.middlename === null) && res1.lastname !== null && res.value !== null) && res1.value !== null) {
                        res.lastname = res1.lastname;
                        res.lastname.add_prefix(res.value + "-");
                        res.value = (res.value + "-" + res1.value);
                        res.firstname = null;
                        res.middlename = null;
                        res.end_token = res1.end_token;
                    }
                    else if (((res.firstname === null && res.lastname !== null && res.middlename === null) && res1.lastname === null && res.value !== null) && res1.value !== null) {
                        res.lastname.add_postfix("-" + res1.value, MorphGender.UNDEFINED);
                        res.value = (res.value + "-" + res1.value);
                        res.firstname = null;
                        res.middlename = null;
                        res.end_token = res1.end_token;
                    }
                }
            }
        }
        while ((res.end_token.whitespaces_after_count < 3) && (res.end_token.next instanceof TextToken)) {
            let ter = (res.end_token.next).term;
            if (((ter !== "АЛИ" && ter !== "ПАША")) || res.end_token.next.chars.is_all_lower) {
                if (PersonItemToken.M_ARAB_POSTFIX.includes(ter) || PersonItemToken.M_ARAB_POSTFIX_FEM.includes(ter)) {
                    if (res.end_token.next.next !== null && res.end_token.next.next.is_hiphen) {
                    }
                    else {
                        res.end_token = res.end_token.next;
                        res.add_postfix_info(ter, (PersonItemToken.M_ARAB_POSTFIX_FEM.includes(ter) ? MorphGender.FEMINIE : MorphGender.MASCULINE));
                        if (((ter === "ОГЛЫ" || ter === "КЫЗЫ" || ter === "ГЫЗЫ") || ter === "УГЛИ" || ter === "КЗЫ") || ter === "УЛЫ" || ter === "УУЛУ") {
                            if (res.middlename !== null) {
                                res.firstname = null;
                                res.lastname = null;
                            }
                        }
                        continue;
                    }
                }
            }
            break;
        }
        return res;
    }
    
    static try_attach_list(t, loc_ont, attrs = PersonItemTokenParseAttr.NO, max_count = 10) {
        const PersonAttrToken = require("./PersonAttrToken");
        if (t === null) 
            return null;
        if (((!((t instanceof TextToken)) || !t.chars.is_letter)) && (((attrs.value()) & (PersonItemTokenParseAttr.CANINITIALBEDIGIT.value()))) === (PersonItemTokenParseAttr.NO.value())) {
            if ((t instanceof ReferentToken) && (((t.get_referent() instanceof GeoReferent) || t.get_referent().type_name === "ORGANIZATION" || t.get_referent().type_name === "TRANSPORT"))) {
                if ((t).begin_token === (t).end_token) {
                }
                else 
                    return null;
            }
            else if (t instanceof NumberToken) {
                let nt = Utils.as(t, NumberToken);
                if (nt.begin_token === nt.end_token && nt.typ === NumberSpellingType.WORDS && !nt.begin_token.chars.is_all_lower) {
                }
                else 
                    return null;
            }
            else 
                return null;
        }
        let pit = PersonItemToken.try_attach(t, loc_ont, attrs, null);
        if (pit === null && t.chars.is_latin_letter) {
        }
        if (pit === null) 
            return null;
        let res = new Array();
        res.push(pit);
        t = pit.end_token.next;
        if ((t !== null && t.is_char('.') && pit.typ === PersonItemTokenItemType.VALUE) && pit.length_char > 3) {
            let str = pit.get_source_text();
            if (Utils.isUpperCase(str[0]) && Utils.isUpperCase(str[str.length - 1])) {
                let ok = true;
                for (let i = 1; i < (str.length - 1); i++) {
                    if (!Utils.isLowerCase(str[i])) 
                        ok = false;
                }
                if (ok) {
                    pit.value = pit.value.substring(0, 0 + pit.value.length - 1);
                    pit.firstname = (pit.middlename = (pit.lastname = null));
                    let pit2 = PersonItemToken._new2515(t, t, PersonItemTokenItemType.INITIAL, str.substring(str.length - 1));
                    res.push(pit2);
                    t = t.next;
                }
            }
        }
        let zap = false;
        for (; t !== null; t = (t === null ? null : t.next)) {
            if (t.whitespaces_before_count > 15) 
                break;
            let tt = t;
            if (tt.is_hiphen && tt.next !== null) {
                if (!tt.is_whitespace_after && !tt.is_whitespace_before) 
                    tt = t.next;
                else if (CharsInfo.ooEq(tt.previous.chars, tt.next.chars) && !tt.is_newline_after) 
                    tt = tt.next;
            }
            else if ((tt.is_char(',') && (tt.whitespaces_after_count < 2) && tt.next !== null) && res.length === 1) {
                zap = true;
                tt = tt.next;
            }
            else if ((tt.is_char('(') && (tt.next instanceof TextToken) && CharsInfo.ooEq(tt.next.chars, tt.previous.chars)) && tt.next.next !== null && tt.next.next.is_char(')')) {
                let pit0 = res[res.length - 1];
                let pit11 = PersonItemToken.try_attach(tt.next, loc_ont, attrs, null);
                if (pit0.firstname !== null && pit11 !== null && pit11.firstname !== null) {
                    pit0.firstname.vars.splice(pit0.firstname.vars.length, 0, ...pit11.firstname.vars);
                    tt = tt.next.next;
                    pit0.end_token = tt;
                    tt = tt.next;
                }
                else if (pit0.lastname !== null && ((pit0.lastname.is_in_dictionary || pit0.lastname.is_lastname_has_std_tail || pit0.lastname.is_has_std_postfix))) {
                    if (pit11 !== null && pit11.lastname !== null) {
                        let ok = false;
                        if ((pit11.lastname.is_in_dictionary || pit11.lastname.is_lastname_has_std_tail || pit11.lastname.is_has_std_postfix)) 
                            ok = true;
                        else if (res.length === 1) {
                            let pit22 = PersonItemToken.try_attach(tt.next.next.next, loc_ont, attrs, null);
                            if (pit22 !== null) {
                                if (pit22.firstname !== null) 
                                    ok = true;
                            }
                        }
                        if (ok) {
                            pit0.lastname.vars.splice(pit0.lastname.vars.length, 0, ...pit11.lastname.vars);
                            tt = tt.next.next;
                            pit0.end_token = tt;
                            tt = tt.next;
                        }
                    }
                }
            }
            let pit1 = PersonItemToken.try_attach(tt, loc_ont, attrs, res);
            if (pit1 === null) 
                break;
            if (pit1.chars.is_cyrillic_letter !== pit.chars.is_cyrillic_letter) {
                let ok = false;
                if (pit1.typ === PersonItemTokenItemType.INITIAL) {
                    if (pit1.chars.is_cyrillic_letter) {
                        let v = LanguageHelper.get_lat_for_cyr(pit1.value[0]);
                        if (v !== (String.fromCharCode(0))) {
                            pit1.value = (v);
                            ok = true;
                            pit1.chars = CharsInfo._new2568(true);
                        }
                        else if (pit.typ === PersonItemTokenItemType.INITIAL) {
                            v = LanguageHelper.get_cyr_for_lat(pit.value[0]);
                            if (v !== (String.fromCharCode(0))) {
                                pit.value = (v);
                                ok = true;
                                pit.chars = CharsInfo._new2534(true);
                                pit = pit1;
                            }
                        }
                    }
                    else {
                        let v = LanguageHelper.get_cyr_for_lat(pit1.value[0]);
                        if (v !== (String.fromCharCode(0))) {
                            pit1.value = (v);
                            ok = true;
                            pit1.chars = CharsInfo._new2534(true);
                        }
                        else if (pit.typ === PersonItemTokenItemType.INITIAL) {
                            v = LanguageHelper.get_lat_for_cyr(pit.value[0]);
                            if (v !== (String.fromCharCode(0))) {
                                pit.value = (v);
                                ok = true;
                                pit.chars = CharsInfo._new2568(true);
                                pit = pit1;
                            }
                        }
                    }
                }
                else if (pit.typ === PersonItemTokenItemType.INITIAL) {
                    if (pit.chars.is_cyrillic_letter) {
                        let v = LanguageHelper.get_lat_for_cyr(pit.value[0]);
                        if (v !== (String.fromCharCode(0))) {
                            pit.value = (v);
                            ok = true;
                        }
                        else if (pit1.typ === PersonItemTokenItemType.INITIAL) {
                            v = LanguageHelper.get_cyr_for_lat(pit1.value[0]);
                            if (v !== (String.fromCharCode(0))) {
                                pit1.value = (v);
                                ok = true;
                                pit = pit1;
                            }
                        }
                    }
                    else {
                        let v = LanguageHelper.get_cyr_for_lat(pit.value[0]);
                        if (v !== (String.fromCharCode(0))) {
                            pit.value = (v);
                            ok = true;
                        }
                        else if (pit1.typ === PersonItemTokenItemType.INITIAL) {
                            v = LanguageHelper.get_lat_for_cyr(pit1.value[0]);
                            if (v !== (String.fromCharCode(0))) {
                                pit.value = (v);
                                ok = true;
                                pit = pit1;
                            }
                        }
                    }
                }
                if (!ok) 
                    break;
            }
            if (pit1.typ === PersonItemTokenItemType.VALUE || ((pit1.typ === PersonItemTokenItemType.SUFFIX && pit1.is_newline_before))) {
                if (loc_ont !== null && (((attrs.value()) & (PersonItemTokenParseAttr.IGNOREATTRS.value()))) === (PersonItemTokenParseAttr.NO.value())) {
                    let pat = PersonAttrToken.try_attach(pit1.begin_token, loc_ont, PersonAttrTokenPersonAttrAttachAttrs.NO);
                    if (pat !== null) {
                        if (pit1.is_newline_before) 
                            break;
                        if (pit1.lastname === null || !pit1.lastname.is_lastname_has_std_tail) {
                            let ty = pit1.begin_token.get_morph_class_in_dictionary();
                            if (ty.is_noun) {
                                if (pit1.whitespaces_before_count > 1) 
                                    break;
                                if (pat.chars.is_capital_upper && pat.begin_token === pat.end_token) {
                                }
                                else 
                                    break;
                            }
                        }
                    }
                }
            }
            if (tt !== t) {
                pit1.is_hiphen_before = true;
                res[res.length - 1].is_hiphen_after = true;
            }
            res.push(pit1);
            t = pit1.end_token;
            if (res.length > 10) 
                break;
            if (max_count > 0 && res.length >= max_count) 
                break;
        }
        if (res[0].is_asian_item(false) && res[0].value.length === 1) {
            if ((((attrs.value()) & (PersonItemTokenParseAttr.MUSTBEITEMALWAYS.value()))) === (PersonItemTokenParseAttr.NO.value())) {
                if (res.length < 2) 
                    return null;
                if (!res[1].is_asian_item(false) || res[1].value.length === 1) 
                    return null;
            }
        }
        if (zap && res.length > 1) {
            let ok = false;
            if (res[0].lastname !== null && res.length === 3) {
                if (res[1].typ === PersonItemTokenItemType.INITIAL || res[1].firstname !== null) {
                    if (res[2].typ === PersonItemTokenItemType.INITIAL || res[2].middlename !== null) 
                        ok = true;
                }
            }
            else if ((((attrs.value()) & (PersonItemTokenParseAttr.CANINITIALBEDIGIT.value()))) !== (PersonItemTokenParseAttr.NO.value()) && res[0].typ === PersonItemTokenItemType.VALUE && res[1].typ === PersonItemTokenItemType.INITIAL) {
                if (res.length === 2) 
                    ok = true;
                else if (res.length === 3 && res[2].typ === PersonItemTokenItemType.INITIAL) 
                    ok = true;
                else if (res.length === 3 && res[2].is_in_dictionary) 
                    ok = true;
            }
            if (!ok) 
                res.splice(1, res.length - 1);
        }
        if (res.length === 1 && res[0].is_newline_before && res[0].is_newline_after) {
            if (res[0].lastname !== null && ((res[0].lastname.is_has_std_postfix || res[0].lastname.is_in_dictionary || res[0].lastname.is_lastname_has_std_tail))) {
                let res1 = PersonItemToken.try_attach_list(res[0].end_token.next, loc_ont, PersonItemTokenParseAttr.CANBELATIN, max_count);
                if (res1 !== null && res1.length > 0) {
                    if (res1.length === 2 && ((res1[0].firstname !== null || res1[1].middlename !== null)) && res1[1].is_newline_after) 
                        res.splice(res.length, 0, ...res1);
                    else if (res1.length === 1 && res1[0].is_newline_after) {
                        let res2 = PersonItemToken.try_attach_list(res1[0].end_token.next, loc_ont, PersonItemTokenParseAttr.CANBELATIN, max_count);
                        if (res2 !== null && res2.length === 1 && res2[0].is_newline_after) {
                            if (res1[0].firstname !== null || res2[0].middlename !== null) {
                                res.push(res1[0]);
                                res.push(res2[0]);
                            }
                        }
                    }
                }
            }
        }
        for (let i = 0; i < res.length; i++) {
            if (res[i].firstname !== null && res[i].begin_token.is_value("СВЕТА", null)) {
                if (i > 0 && res[i - 1].lastname !== null) {
                }
                else if (((i + 1) < res.length) && ((res[i + 1].lastname !== null || res[i + 1].middlename !== null))) {
                }
                else 
                    continue;
                res[i].firstname.vars[0].value = "СВЕТЛАНА";
            }
            else if (res[i].typ === PersonItemTokenItemType.VALUE && ((i + 1) < res.length) && res[i + 1].typ === PersonItemTokenItemType.SUFFIX) {
                res[i].add_postfix_info(res[i + 1].value, MorphGender.UNDEFINED);
                res[i].end_token = res[i + 1].end_token;
                if (res[i].lastname === null) {
                    res[i].lastname = PersonItemToken.MorphPersonItem._new2513(true);
                    res[i].lastname.vars.push(new PersonItemToken.MorphPersonItemVariant(res[i].value, new MorphBaseInfo(), true));
                    res[i].firstname = null;
                }
                res.splice(i + 1, 1);
            }
        }
        if (res.length > 1 && res[0].is_in_dictionary && (((attrs.value()) & (PersonItemTokenParseAttr.MUSTBEITEMALWAYS.value()))) === (PersonItemTokenParseAttr.NO.value())) {
            let mc = res[0].begin_token.get_morph_class_in_dictionary();
            if (mc.is_pronoun || mc.is_personal_pronoun) {
                if (res[0].begin_token.is_value("ТОМ", null)) {
                }
                else 
                    return null;
            }
        }
        for (let i = 0; i < (res.length - 1); i++) {
            if (res[i].typ === PersonItemTokenItemType.VALUE && res[i + 1].typ === PersonItemTokenItemType.VALUE && res[i].end_token.next.is_hiphen) {
                let ok = false;
                if (i > 0 && res[i - 1].typ === PersonItemTokenItemType.INITIAL && (i + 2) === res.length) 
                    ok = true;
                else if (i === 0 && ((i + 2) < res.length) && res[i + 2].typ === PersonItemTokenItemType.INITIAL) 
                    ok = true;
                if (!ok) 
                    continue;
                res[i].end_token = res[i + 1].end_token;
                res[i].value = (res[i].value + "-" + res[i + 1].value);
                res[i].firstname = (res[i].lastname = (res[i].middlename = null));
                res[i].is_in_dictionary = false;
                res.splice(i + 1, 1);
                break;
            }
        }
        return res;
    }
    
    /**
     * Это попытка привязать персону со специфического места
     * @param t 
     * @param prev_pers_template шаблон от предыдущей персоны (поможет принять решение в случае ошибки)
     * @return 
     */
    static try_parse_person(t, prev_pers_template = FioTemplateType.UNDEFINED) {
        const PersonReferent = require("./../PersonReferent");
        const PersonAnalyzer = require("./../PersonAnalyzer");
        if (t === null) 
            return null;
        if (t.get_referent() instanceof PersonReferent) {
            let rt = Utils.as(t, ReferentToken);
            if (rt.begin_token === rt.end_token) {
                let tt1 = t.next;
                if (tt1 !== null && tt1.is_comma) 
                    tt1 = tt1.next;
                if (tt1 !== null && (tt1.whitespaces_before_count < 2)) {
                    let pits0 = PersonItemToken.try_attach_list(tt1, null, PersonItemTokenParseAttr.CANINITIALBEDIGIT, 10);
                    if (pits0 !== null && pits0[0].typ === PersonItemTokenItemType.INITIAL) {
                        let str = rt.referent.get_string_value(PersonReferent.ATTR_FIRSTNAME);
                        if (str !== null && str.startsWith(pits0[0].value)) {
                            let res = ReferentToken._new2573(rt.referent, t, pits0[0].end_token, FioTemplateType.SURNAMEI.value());
                            if (pits0.length > 1 && pits0[1].typ === PersonItemTokenItemType.INITIAL) {
                                str = rt.referent.get_string_value(PersonReferent.ATTR_MIDDLENAME);
                                if (str !== null && str.startsWith(pits0[1].value)) {
                                    res.end_token = pits0[1].end_token;
                                    res.misc_attrs = FioTemplateType.SURNAMEII.value();
                                }
                            }
                            return res;
                        }
                    }
                    if (((((tt1 instanceof TextToken) && tt1.length_char === 1 && tt1.chars.is_all_upper) && tt1.chars.is_cyrillic_letter && (tt1.next instanceof TextToken)) && (tt1.whitespaces_after_count < 2) && tt1.next.length_char === 1) && tt1.next.chars.is_all_upper && tt1.next.chars.is_cyrillic_letter) {
                        let str = rt.referent.get_string_value(PersonReferent.ATTR_FIRSTNAME);
                        if (str !== null && str.startsWith((tt1).term)) {
                            let str2 = rt.referent.get_string_value(PersonReferent.ATTR_MIDDLENAME);
                            if (str2 === null || str2.startsWith((tt1.next).term)) {
                                let res = ReferentToken._new2573(rt.referent, t, tt1.next, FioTemplateType.NAMEISURNAME.value());
                                if (str2 === null) 
                                    rt.referent.add_slot(PersonReferent.ATTR_MIDDLENAME, (tt1.next).term, false, 0);
                                if (res.end_token.next !== null && res.end_token.next.is_char('.')) 
                                    res.end_token = res.end_token.next;
                                return res;
                            }
                        }
                    }
                }
            }
            return rt;
        }
        if (t.get_referent() !== null && t.get_referent().type_name === "ORGANIZATION") {
            let rt = Utils.as(t, ReferentToken);
            let ppp = PersonItemToken.try_parse_person(rt.begin_token, FioTemplateType.UNDEFINED);
            if (ppp !== null && ppp.end_char === rt.end_char) {
                ppp.begin_token = ppp.end_token = rt;
                return ppp;
            }
        }
        let pits = PersonItemToken.try_attach_list(t, null, PersonItemTokenParseAttr.of((PersonItemTokenParseAttr.CANINITIALBEDIGIT.value()) | (PersonItemTokenParseAttr.CANBELATIN.value())), 10);
        if ((pits === null && (t instanceof TextToken) && t.chars.is_all_lower) && t.length_char > 3) {
            let pi = PersonItemToken.try_attach(t, null, PersonItemTokenParseAttr.of((PersonItemTokenParseAttr.CANINITIALBEDIGIT.value()) | (PersonItemTokenParseAttr.CANBELATIN.value()) | (PersonItemTokenParseAttr.CANBELOWER.value())), null);
            if (pi !== null && pi.lastname !== null && ((pi.lastname.is_in_dictionary || pi.lastname.is_lastname_has_std_tail))) {
                pits = PersonItemToken.try_attach_list(pi.end_token.next, null, PersonItemTokenParseAttr.of((PersonItemTokenParseAttr.CANINITIALBEDIGIT.value()) | (PersonItemTokenParseAttr.CANBELATIN.value())), 10);
                if (pits !== null && pits[0].typ === PersonItemTokenItemType.INITIAL && pits[0].chars.is_latin_letter === pi.chars.is_latin_letter) 
                    pits.splice(0, 0, pi);
                else 
                    pits = null;
            }
        }
        if (pits !== null && prev_pers_template !== FioTemplateType.UNDEFINED && pits[0].typ === PersonItemTokenItemType.VALUE) {
            let tt1 = null;
            if (pits.length === 1 && prev_pers_template === FioTemplateType.SURNAMEI) 
                tt1 = pits[0].end_token.next;
            if (tt1 !== null && tt1.is_comma) 
                tt1 = tt1.next;
            if (((tt1 instanceof TextToken) && tt1.chars.is_letter && tt1.chars.is_all_upper) && tt1.length_char === 1 && (tt1.whitespaces_before_count < 2)) {
                let ii = PersonItemToken._new2517(tt1, tt1, PersonItemTokenItemType.INITIAL, (tt1).term, tt1.chars);
                pits.push(ii);
            }
            if (pits.length === 1 && pits[0].is_newline_after && ((prev_pers_template === FioTemplateType.SURNAMEI || prev_pers_template === FioTemplateType.SURNAMEII))) {
                let ppp = PersonItemToken.try_attach_list(pits[0].end_token.next, null, PersonItemTokenParseAttr.CANBELATIN, 10);
                if (ppp !== null && ppp[0].typ === PersonItemTokenItemType.INITIAL) {
                    pits.push(ppp[0]);
                    if (ppp.length > 1 && ppp[1].typ === PersonItemTokenItemType.INITIAL) 
                        pits.push(ppp[1]);
                }
            }
        }
        if (pits !== null && pits.length > 1) {
            let tmpls = FioTemplateType.UNDEFINED;
            let first = null;
            let middl = null;
            let last = null;
            if (pits[0].typ === PersonItemTokenItemType.VALUE && pits[1].typ === PersonItemTokenItemType.INITIAL) {
                if ((t.is_value("ГЛАВА", null) || t.is_value("СТАТЬЯ", "СТАТТЯ") || t.is_value("РАЗДЕЛ", "РОЗДІЛ")) || t.is_value("ПОДРАЗДЕЛ", "ПІДРОЗДІЛ") || t.is_value("ЧАСТЬ", "ЧАСТИНА")) 
                    return null;
                if ((t.is_value("CHAPTER", null) || t.is_value("CLAUSE", null) || t.is_value("SECTION", null)) || t.is_value("SUBSECTION", null) || t.is_value("PART", null)) 
                    return null;
                first = pits[1];
                last = pits[0];
                tmpls = FioTemplateType.SURNAMEI;
                if (pits.length > 2 && pits[2].typ === PersonItemTokenItemType.INITIAL) {
                    middl = pits[2];
                    tmpls = FioTemplateType.SURNAMEII;
                }
            }
            else if (pits[0].typ === PersonItemTokenItemType.INITIAL && pits[1].typ === PersonItemTokenItemType.VALUE) {
                first = pits[0];
                last = pits[1];
                tmpls = FioTemplateType.ISURNAME;
            }
            else if ((pits.length > 2 && pits[0].typ === PersonItemTokenItemType.INITIAL && pits[1].typ === PersonItemTokenItemType.INITIAL) && pits[2].typ === PersonItemTokenItemType.VALUE) {
                first = pits[0];
                middl = pits[1];
                last = pits[2];
                tmpls = FioTemplateType.IISURNAME;
            }
            if (pits.length === 2 && pits[0].typ === PersonItemTokenItemType.VALUE && pits[1].typ === PersonItemTokenItemType.VALUE) {
                if (pits[0].chars.is_latin_letter && ((!pits[0].is_in_dictionary || !pits[1].is_in_dictionary))) {
                    if (!MiscHelper.is_eng_article(pits[0].begin_token)) {
                        first = pits[0];
                        last = pits[1];
                        tmpls = FioTemplateType.NAMESURNAME;
                    }
                }
            }
            if (last !== null) {
                let pers = new PersonReferent();
                pers.add_slot(PersonReferent.ATTR_LASTNAME, last.value, false, 0);
                pers.add_slot(PersonReferent.ATTR_FIRSTNAME, first.value, false, 0);
                if (middl !== null) 
                    pers.add_slot(PersonReferent.ATTR_MIDDLENAME, middl.value, false, 0);
                let res = new ReferentToken(pers, t, last.end_token);
                if (first.end_char > last.end_char) 
                    res.end_token = first.end_token;
                if (middl !== null && middl.end_char > res.end_char) 
                    res.end_token = middl.end_token;
                res.data = t.kit.get_analyzer_data_by_analyzer_name(PersonAnalyzer.ANALYZER_NAME);
                res.misc_attrs = tmpls.value();
                if ((res.end_token.whitespaces_after_count < 2) && (res.end_token.next instanceof NumberToken)) {
                    let num = Utils.as(res.end_token.next, NumberToken);
                    if (num.value === "2" || num.value === "3") {
                        if (num.morph.class0.is_adjective) {
                            pers.add_slot(PersonReferent.ATTR_NICKNAME, num.value.toString(), false, 0);
                            res.end_token = res.end_token.next;
                        }
                    }
                }
                return res;
            }
        }
        if (pits !== null && pits.length === 1 && pits[0].typ === PersonItemTokenItemType.VALUE) {
            let tt = pits[0].end_token.next;
            let comma = false;
            if (tt !== null && ((tt.is_comma || tt.is_char('.')))) {
                tt = tt.next;
                comma = true;
            }
            if (((tt instanceof TextToken) && tt.length_char === 2 && tt.chars.is_all_upper) && tt.chars.is_cyrillic_letter) {
                let pers = new PersonReferent();
                pers.add_slot(PersonReferent.ATTR_LASTNAME, pits[0].value, false, 0);
                pers.add_slot(PersonReferent.ATTR_FIRSTNAME, (tt).term[0], false, 0);
                pers.add_slot(PersonReferent.ATTR_MIDDLENAME, (tt).term[1], false, 0);
                let res = ReferentToken._new2573(pers, t, tt, FioTemplateType.SURNAMEII.value());
                if (tt.next !== null && tt.next.is_char('.')) 
                    res.end_token = (tt = tt.next);
                res.data = t.kit.get_analyzer_data_by_analyzer_name(PersonAnalyzer.ANALYZER_NAME);
                return res;
            }
            if ((((((tt instanceof TextToken) && (tt.whitespaces_before_count < 2) && tt.length_char === 1) && tt.chars.is_all_upper && tt.chars.is_cyrillic_letter) && (tt.next instanceof TextToken) && (tt.whitespaces_after_count < 2)) && tt.next.length_char === 1 && tt.next.chars.is_all_upper) && tt.next.chars.is_cyrillic_letter) {
                let pers = new PersonReferent();
                pers.add_slot(PersonReferent.ATTR_LASTNAME, pits[0].value, false, 0);
                pers.add_slot(PersonReferent.ATTR_FIRSTNAME, (tt).term, false, 0);
                pers.add_slot(PersonReferent.ATTR_MIDDLENAME, (tt.next).term, false, 0);
                let res = ReferentToken._new2573(pers, t, tt.next, FioTemplateType.SURNAMEII.value());
                if (tt.next.next !== null && tt.next.next.is_char('.')) 
                    res.end_token = tt.next.next;
                res.data = t.kit.get_analyzer_data_by_analyzer_name(PersonAnalyzer.ANALYZER_NAME);
                return res;
            }
            if (comma && tt !== null && (tt.whitespaces_before_count < 2)) {
                let pits1 = PersonItemToken.try_attach_list(tt, null, PersonItemTokenParseAttr.of((PersonItemTokenParseAttr.CANINITIALBEDIGIT.value()) | (PersonItemTokenParseAttr.CANBELATIN.value())), 10);
                if (pits1 !== null && pits1.length > 0 && pits1[0].typ === PersonItemTokenItemType.INITIAL) {
                    if (prev_pers_template !== FioTemplateType.UNDEFINED) {
                        if (prev_pers_template !== FioTemplateType.SURNAMEI && prev_pers_template !== FioTemplateType.SURNAMEII) 
                            return null;
                    }
                    let pers = new PersonReferent();
                    pers.add_slot(PersonReferent.ATTR_LASTNAME, pits[0].value, false, 0);
                    let nam = pits1[0].value;
                    if (pits1[0].chars.is_cyrillic_letter !== pits[0].chars.is_cyrillic_letter) {
                        let ch = null;
                        if (pits[0].chars.is_cyrillic_letter) 
                            ch = LanguageHelper.get_cyr_for_lat(nam[0]);
                        else 
                            ch = LanguageHelper.get_lat_for_cyr(nam[0]);
                        if (ch !== (String.fromCharCode(0))) 
                            nam = (ch);
                    }
                    pers.add_slot(PersonReferent.ATTR_FIRSTNAME, nam, false, 0);
                    let res = ReferentToken._new2573(pers, t, pits1[0].end_token, FioTemplateType.SURNAMEI.value());
                    if (pits1.length > 1 && pits1[1].typ === PersonItemTokenItemType.INITIAL) {
                        let mid = pits1[1].value;
                        if (pits1[1].chars.is_cyrillic_letter !== pits[0].chars.is_cyrillic_letter) {
                            let ch = null;
                            if (pits[0].chars.is_cyrillic_letter) 
                                ch = LanguageHelper.get_cyr_for_lat(mid[0]);
                            else 
                                ch = LanguageHelper.get_lat_for_cyr(mid[0]);
                            if (ch !== (String.fromCharCode(0))) 
                                mid = (ch);
                        }
                        pers.add_slot(PersonReferent.ATTR_MIDDLENAME, mid, false, 0);
                        res.end_token = pits1[1].end_token;
                        res.misc_attrs = FioTemplateType.SURNAMEII.value();
                    }
                    res.data = t.kit.get_analyzer_data_by_analyzer_name(PersonAnalyzer.ANALYZER_NAME);
                    return res;
                }
            }
        }
        return null;
    }
    
    static _new2515(_arg1, _arg2, _arg3, _arg4) {
        let res = new PersonItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        return res;
    }
    
    static _new2517(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new PersonItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        res.chars = _arg5;
        return res;
    }
    
    static _new2523(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new PersonItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.referent = _arg4;
        res.morph = _arg5;
        return res;
    }
    
    static _new2531(_arg1, _arg2, _arg3, _arg4) {
        let res = new PersonItemToken(_arg1, _arg2);
        res.value = _arg3;
        res.chars = _arg4;
        return res;
    }
    
    static _new2546(_arg1, _arg2, _arg3) {
        let res = new PersonItemToken(_arg1, _arg2);
        res.value = _arg3;
        return res;
    }
    
    static _new2547(_arg1, _arg2, _arg3, _arg4) {
        let res = new PersonItemToken(_arg1, _arg2);
        res.value = _arg3;
        res.typ = _arg4;
        return res;
    }
    
    static _new2548(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new PersonItemToken(_arg1, _arg2);
        res.value = _arg3;
        res.chars = _arg4;
        res.morph = _arg5;
        return res;
    }
    
    static static_constructor() {
        PersonItemToken.M_SUR_PREFIXES = Array.from(["АБД", "АБУ", "АЛ", "АЛЬ", "БИН", "БЕН", "ИБН", "ФОН", "ВАН", "ДЕ", "ДИ", "ДА", "ЛА", "ЛЕ", "ЛЯ", "ЭЛЬ"]);
        PersonItemToken.m_sur_prefixes_lat = Array.from(["ABD", "AL", "BEN", "IBN", "VON", "VAN", "DE", "DI", "LA", "LE", "DA", "DE"]);
        PersonItemToken.M_ARAB_POSTFIX = Array.from(["АГА", "АЛИ", "АР", "АС", "АШ", "БЕЙ", "БЕК", "ЗАДЕ", "ОГЛЫ", "УГЛИ", "ОЛЬ", "ООЛ", "ПАША", "УЛЬ", "УЛЫ", "УУЛУ", "ХАН", "ХАДЖИ", "ШАХ", "ЭД", "ЭЛЬ"]);
        PersonItemToken.M_ARAB_POSTFIX_FEM = Array.from(["АСУ", "АЗУ", "ГЫЗЫ", "ЗУЛЬ", "КЫЗЫ", "КЫС", "КЗЫ"]);
    }
}


PersonItemToken.MorphPersonItemVariant = class  extends MorphBaseInfo {
    
    constructor(v, bi, _lastname) {
        const MorphBaseInfo = require("./../../../morph/MorphBaseInfo");
        super(null);
        this.value = null;
        this.short_value = null;
        this.value = v;
        if (bi !== null) 
            bi.copy_to(this);
    }
    
    toString() {
        return (((this.value != null ? this.value : "?")) + ": " + super.toString());
    }
    
    static _new2565(_arg1, _arg2, _arg3, _arg4) {
        let res = new PersonItemToken.MorphPersonItemVariant(_arg1, _arg2, _arg3);
        res.short_value = _arg4;
        return res;
    }
}


PersonItemToken.MorphPersonItem = class  {
    
    constructor() {
        this.m_morph = null;
        this.vars = new Array();
        this.term = null;
        this.is_in_dictionary = false;
        this.is_in_ontology = false;
        this.is_lastname_has_std_tail = false;
        this.is_lastname_has_hiphen = false;
        this.is_has_std_postfix = false;
    }
    
    get morph() {
        const MorphBaseInfo = require("./../../../morph/MorphBaseInfo");
        const MorphCollection = require("./../../MorphCollection");
        if (this.m_morph !== null && this.m_morph.items_count !== this.vars.length) 
            this.m_morph = null;
        if (this.m_morph === null) {
            this.m_morph = new MorphCollection();
            for (const v of this.vars) {
                this.m_morph.add_item(v);
            }
        }
        return this.m_morph;
    }
    
    get is_china_surname() {
        const PersonReferent = require("./../PersonReferent");
        let _term = this.term;
        if (_term === null && this.vars.length > 0) 
            _term = this.vars[0].value;
        if (_term === null) 
            return false;
        if (PersonItemToken.MorphPersonItem.m_lastname_asian.indexOf(_term) >= 0) 
            return true;
        let tr = PersonReferent._del_surname_end(_term);
        if (PersonItemToken.MorphPersonItem.m_lastname_asian.indexOf(tr) >= 0) 
            return true;
        if (PersonItemToken.MorphPersonItem.m_lastname_asian.indexOf(_term + "Ь") >= 0) 
            return true;
        if (_term[_term.length - 1] === 'Ь') {
            if (PersonItemToken.MorphPersonItem.m_lastname_asian.indexOf(_term.substring(0, 0 + _term.length - 1)) >= 0) 
                return true;
        }
        return false;
    }
    
    toString() {
        let res = new StringBuilder();
        if (this.term !== null) 
            res.append(this.term);
        for (const v of this.vars) {
            res.append("; ").append(v.toString());
        }
        if (this.is_in_dictionary) 
            res.append(" - InDictionary");
        if (this.is_in_ontology) 
            res.append(" - InOntology");
        if (this.is_lastname_has_std_tail) 
            res.append(" - IsLastnameHasStdTail");
        if (this.is_has_std_postfix) 
            res.append(" - IsHasStdPostfix");
        if (this.is_china_surname) 
            res.append(" - IsChinaSurname");
        return res.toString();
    }
    
    merge_hiphen(second) {
        const MorphGender = require("./../../../morph/MorphGender");
        const MorphBaseInfo = require("./../../../morph/MorphBaseInfo");
        let addvars = new Array();
        for (const v of this.vars) {
            let ok = 0;
            for (const vv of second.vars) {
                if ((((vv.gender.value()) & (v.gender.value()))) !== (MorphGender.UNDEFINED.value())) {
                    v.value = (v.value + "-" + vv.value);
                    ok++;
                    break;
                }
            }
            if (ok > 0) 
                continue;
            if (v.gender !== MorphGender.UNDEFINED) {
                for (const vv of second.vars) {
                    if (vv.gender === MorphGender.UNDEFINED) {
                        v.value = (v.value + "-" + vv.value);
                        ok++;
                        break;
                    }
                }
                if (ok > 0) 
                    continue;
            }
            else {
                let val0 = v.value;
                for (const vv of second.vars) {
                    if (vv.gender !== MorphGender.UNDEFINED) {
                        if (ok === 0) {
                            v.value = (val0 + "-" + vv.value);
                            vv.copy_to(v);
                        }
                        else 
                            addvars.push(new PersonItemToken.MorphPersonItemVariant((val0 + "-" + vv.value), vv, false));
                        ok++;
                    }
                }
                if (ok > 0) 
                    continue;
            }
            if (second.vars.length === 0) 
                continue;
            v.value = (v.value + "-" + second.vars[0].value);
        }
        this.vars.splice(this.vars.length, 0, ...addvars);
    }
    
    add_prefix(val) {
        if (this.term !== null) 
            this.term = val + this.term;
        for (const v of this.vars) {
            if (v.value !== null) 
                v.value = val + v.value;
        }
    }
    
    add_postfix(val, gen) {
        const MorphGender = require("./../../../morph/MorphGender");
        if (this.term !== null) 
            this.term = (this.term + "-" + val);
        for (const v of this.vars) {
            if (v.value !== null) {
                v.value = (v.value + "-" + val);
                if (gen !== MorphGender.UNDEFINED) 
                    v.gender = gen;
            }
        }
        this.is_has_std_postfix = true;
        this.is_in_dictionary = false;
    }
    
    merge_with_by_hiphen(pi) {
        const MorphGender = require("./../../../morph/MorphGender");
        const MorphBaseInfo = require("./../../../morph/MorphBaseInfo");
        this.term = (((this.term != null ? this.term : "")) + "-" + ((pi.term != null ? pi.term : "")));
        if (pi.is_in_dictionary) 
            this.is_in_dictionary = true;
        if (pi.is_has_std_postfix) 
            this.is_has_std_postfix = true;
        this.is_lastname_has_hiphen = true;
        if (pi.vars.length === 0) {
            if (pi.term !== null) 
                this.add_postfix(pi.term, MorphGender.UNDEFINED);
            return;
        }
        if (this.vars.length === 0) {
            if (this.term !== null) 
                pi.add_prefix(this.term + "-");
            this.vars = pi.vars;
            return;
        }
        let res = new Array();
        for (const v of this.vars) {
            for (const vv of pi.vars) {
                let vvv = new PersonItemToken.MorphPersonItemVariant((v.value + "-" + vv.value), v, false);
                res.push(vvv);
            }
        }
        this.vars = res;
    }
    
    correct_lastname_variants() {
        const MorphGender = require("./../../../morph/MorphGender");
        const LanguageHelper = require("./../../../morph/LanguageHelper");
        this.is_lastname_has_std_tail = false;
        for (const v of this.vars) {
            if (v.value !== null && (((PersonItemToken.MorphPersonItem.ends_with_std_surname(v.value) || LanguageHelper.ends_with(v.value, "АЯ") || LanguageHelper.ends_with(v.value, "ОЙ")) || LanguageHelper.ends_with(v.value, "ИЙ") || LanguageHelper.ends_with(v.value, "ЫЙ")))) {
                this.is_lastname_has_std_tail = true;
                break;
            }
        }
        if (this.is_lastname_has_std_tail) {
            for (let i = this.vars.length - 1; i >= 0; i--) {
                if ((((this.vars[i].value !== null && !PersonItemToken.MorphPersonItem.ends_with_std_surname(this.vars[i].value) && !LanguageHelper.ends_with(this.vars[i].value, "АЯ")) && !LanguageHelper.ends_with(this.vars[i].value, "ОЙ") && !LanguageHelper.ends_with(this.vars[i].value, "ИЙ")) && !LanguageHelper.ends_with(this.vars[i].value, "ЫЙ") && !LanguageHelper.ends_with(this.vars[i].value, "ИХ")) && !LanguageHelper.ends_with(this.vars[i].value, "ЫХ")) {
                    this.vars.splice(i, 1);
                    continue;
                }
                if (this.vars[i].gender === MorphGender.UNDEFINED) {
                    let del = false;
                    for (let j = 0; j < this.vars.length; j++) {
                        if (j !== i && this.vars[j].value === this.vars[i].value && this.vars[j].gender !== MorphGender.UNDEFINED) {
                            del = true;
                            break;
                        }
                    }
                    if (del) {
                        this.vars.splice(i, 1);
                        continue;
                    }
                    let t = PersonItemToken.MorphPersonItem.find_tail(this.vars[i].value);
                    if (t !== null) {
                        if (t.gender !== MorphGender.UNDEFINED) 
                            this.vars[i].gender = t.gender;
                    }
                    else if (LanguageHelper.ends_with_ex(this.vars[i].value, "А", "Я", null, null)) 
                        this.vars[i].gender = MorphGender.FEMINIE;
                    else 
                        this.vars[i].gender = MorphGender.MASCULINE;
                }
            }
        }
    }
    
    remove_not_genitive() {
        let has_gen = false;
        for (const v of this.vars) {
            if (v._case.is_genitive) 
                has_gen = true;
        }
        if (has_gen) {
            for (let i = this.vars.length - 1; i >= 0; i--) {
                if (!this.vars[i]._case.is_genitive) 
                    this.vars.splice(i, 1);
            }
        }
    }
    
    static initialize() {
        const EpNerPersonInternalResourceHelper = require("./EpNerPersonInternalResourceHelper");
        const MorphGender = require("./../../../morph/MorphGender");
        PersonItemToken.MorphPersonItem.m_lastname_std_tails = new Array();
        PersonItemToken.MorphPersonItem.m_lastname_std_tails.push(new PersonItemToken.SurnameTail("ОВ", MorphGender.MASCULINE));
        PersonItemToken.MorphPersonItem.m_lastname_std_tails.push(new PersonItemToken.SurnameTail("ОВА", MorphGender.FEMINIE));
        PersonItemToken.MorphPersonItem.m_lastname_std_tails.push(new PersonItemToken.SurnameTail("ЕВ", MorphGender.MASCULINE));
        PersonItemToken.MorphPersonItem.m_lastname_std_tails.push(new PersonItemToken.SurnameTail("ЕВА", MorphGender.FEMINIE));
        PersonItemToken.MorphPersonItem.m_lastname_std_tails.push(new PersonItemToken.SurnameTail("ЄВ", MorphGender.MASCULINE));
        PersonItemToken.MorphPersonItem.m_lastname_std_tails.push(new PersonItemToken.SurnameTail("ЄВА", MorphGender.FEMINIE));
        PersonItemToken.MorphPersonItem.m_lastname_std_tails.push(new PersonItemToken.SurnameTail("ИН", MorphGender.MASCULINE));
        PersonItemToken.MorphPersonItem.m_lastname_std_tails.push(new PersonItemToken.SurnameTail("ИНА", MorphGender.FEMINIE));
        PersonItemToken.MorphPersonItem.m_lastname_std_tails.push(new PersonItemToken.SurnameTail("ІН", MorphGender.MASCULINE));
        PersonItemToken.MorphPersonItem.m_lastname_std_tails.push(new PersonItemToken.SurnameTail("ІНА", MorphGender.FEMINIE));
        for (const s of ["ЕР", "РН", "ДЗЕ", "ВИЛИ", "ЯН", "УК", "ЮК", "КО", "МАН", "АНН", "ЙН", "УН", "СКУ", "СКИ", "СЬКІ", "ИЛО", "ІЛО", "АЛО", "ИК", "СОН", "РА", "НДА", "НДО", "ЕС", "АС", "АВА", "ЛС", "ЛЮС", "ЛЬС", "ЙЗ", "ЕРГ", "ИНГ", "OR", "ER", "OV", "IN", "ERG"]) {
            PersonItemToken.MorphPersonItem.m_lastname_std_tails.push(new PersonItemToken.SurnameTail(s));
        }
        PersonItemToken.MorphPersonItem.m_latsname_sex_std_tails = Array.from(["ОВ", "ОВА", "ЕВ", "ЄВ", "ЕВА", "ЄВA", "ИН", "ИНА", "ІН", "ІНА", "ИЙ", "АЯ"]);
        PersonItemToken.MorphPersonItem.m_lastname_asian = new Array();
        for (const s of Utils.splitString(EpNerPersonInternalResourceHelper.get_string("chinasurnames.txt"), '\n', false)) {
            let ss = Utils.replaceString(s.trim().toUpperCase(), "Ё", "Е");
            if (!Utils.isNullOrEmpty(ss)) 
                PersonItemToken.MorphPersonItem.m_lastname_asian.push(ss);
        }
        let m_china_surs = Array.from(Utils.splitString("Чон Чжао Цянь Сунь Ли Чжоу У Чжэн Ван Фэн Чэнь Чу Вэй Цзян Шэнь Хань Ян Чжу Цинь Ю Сюй Хэ Люй Ши Чжан Кун Цао Янь Хуа Цзинь Тао Ци Се Цзоу Юй Бай Шуй Доу Чжан Юнь Су Пань Гэ Си Фань Пэн Лан Лу Чан Ма Мяо Фан Жэнь Юань Лю Бао Ши Тан Фэй Лянь Цэнь Сюэ Лэй Хэ Ни Тэн Инь Ло Би Хао Ань Чан Лэ Фу Пи Бянь Кан Бу Гу Мэн Пин Хуан Му Сяо Яо Шао Чжань Мао Ди Ми Бэй Мин Ху Хван", ' ', false));
        for (const s of m_china_surs) {
            let ss = Utils.replaceString(s.trim().toUpperCase(), "Ё", "Е");
            if (!Utils.isNullOrEmpty(ss)) {
                if (!PersonItemToken.MorphPersonItem.m_lastname_asian.includes(ss)) 
                    PersonItemToken.MorphPersonItem.m_lastname_asian.push(ss);
            }
        }
        PersonItemToken.MorphPersonItem.m_lastname_asian.sort();
    }
    
    static find_tail(val) {
        const LanguageHelper = require("./../../../morph/LanguageHelper");
        if (val === null) 
            return null;
        for (let i = 0; i < PersonItemToken.MorphPersonItem.m_lastname_std_tails.length; i++) {
            if (LanguageHelper.ends_with(val, PersonItemToken.MorphPersonItem.m_lastname_std_tails[i].tail)) 
                return PersonItemToken.MorphPersonItem.m_lastname_std_tails[i];
        }
        return null;
    }
    
    static ends_with_std_surname(val) {
        return PersonItemToken.MorphPersonItem.find_tail(val) !== null;
    }
    
    static _new2513(_arg1) {
        let res = new PersonItemToken.MorphPersonItem();
        res.is_has_std_postfix = _arg1;
        return res;
    }
    
    static _new2521(_arg1) {
        let res = new PersonItemToken.MorphPersonItem();
        res.term = _arg1;
        return res;
    }
    
    static _new2524(_arg1, _arg2) {
        let res = new PersonItemToken.MorphPersonItem();
        res.term = _arg1;
        res.is_in_ontology = _arg2;
        return res;
    }
    
    static _new2555(_arg1) {
        let res = new PersonItemToken.MorphPersonItem();
        res.is_in_ontology = _arg1;
        return res;
    }
    
    static static_constructor() {
        PersonItemToken.MorphPersonItem.m_lastname_std_tails = null;
        PersonItemToken.MorphPersonItem.m_latsname_sex_std_tails = null;
        PersonItemToken.MorphPersonItem.m_lastname_asian = null;
    }
}


PersonItemToken.MorphPersonItem.static_constructor();

PersonItemToken.SurnameTail = class  {
    
    constructor(t, g = MorphGender.UNDEFINED) {
        this.tail = null;
        this.gender = MorphGender.UNDEFINED;
        this.tail = t;
        this.gender = g;
    }
}


PersonItemToken.static_constructor();

module.exports = PersonItemToken
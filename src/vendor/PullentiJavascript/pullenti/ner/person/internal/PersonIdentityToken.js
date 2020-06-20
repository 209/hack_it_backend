/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const PersonAttrTokenPersonAttrAttachAttrs = require("./PersonAttrTokenPersonAttrAttachAttrs");
const MorphClass = require("./../../../morph/MorphClass");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const MorphCollection = require("./../../MorphCollection");
const CharsInfo = require("./../../../morph/CharsInfo");
const GetTextAttr = require("./../../core/GetTextAttr");
const MorphNumber = require("./../../../morph/MorphNumber");
const ReferentToken = require("./../../ReferentToken");
const PersonItemTokenParseAttr = require("./PersonItemTokenParseAttr");
const NumberHelper = require("./../../core/NumberHelper");
const PersonHelper = require("./PersonHelper");
const MorphGender = require("./../../../morph/MorphGender");
const MorphBaseInfo = require("./../../../morph/MorphBaseInfo");
const PersonReferent = require("./../PersonReferent");
const MorphCase = require("./../../../morph/MorphCase");
const NumberToken = require("./../../NumberToken");
const Token = require("./../../Token");
const MetaToken = require("./../../MetaToken");
const FioTemplateType = require("./FioTemplateType");
const PersonMorphCollection = require("./PersonMorphCollection");
const PersonItemTokenItemType = require("./PersonItemTokenItemType");
const ReferentEqualType = require("./../../ReferentEqualType");
const Referent = require("./../../Referent");
const MorphWordForm = require("./../../../morph/MorphWordForm");
const TextToken = require("./../../TextToken");
const MiscHelper = require("./../../core/MiscHelper");
const BracketHelper = require("./../../core/BracketHelper");
const PersonItemToken = require("./PersonItemToken");
const PersonAttrToken = require("./PersonAttrToken");

class PersonIdentityToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.coef = 0;
        this.firstname = null;
        this.lastname = null;
        this.middlename = null;
        this.ontology_person = null;
        this.typ = FioTemplateType.UNDEFINED;
    }
    
    get probable_gender() {
        if (this.morph.gender === MorphGender.FEMINIE || this.morph.gender === MorphGender.MASCULINE) 
            return this.morph.gender;
        let fem = 0;
        let mus = 0;
        for (let i = 0; i < 2; i++) {
            let col = (i === 0 ? this.firstname : this.lastname);
            if (col === null) 
                continue;
            let isf = false;
            let ism = false;
            for (const v of col.items) {
                if ((((v.gender.value()) & (MorphGender.MASCULINE.value()))) !== (MorphGender.UNDEFINED.value())) 
                    ism = true;
                if ((((v.gender.value()) & (MorphGender.FEMINIE.value()))) !== (MorphGender.UNDEFINED.value())) 
                    isf = true;
            }
            if (ism) 
                mus++;
            if (isf) 
                fem++;
        }
        if (mus > fem) 
            return MorphGender.MASCULINE;
        if (fem > mus) 
            return MorphGender.FEMINIE;
        return MorphGender.UNDEFINED;
    }
    
    toString() {
        let res = new StringBuilder();
        res.append(this.coef).append(" ").append(this.typ.toString()).append(": ").append((this.lastname === null ? "" : this.lastname.toString()));
        res.append(" ").append((this.firstname === null ? "" : this.firstname.toString())).append(" ").append((this.middlename === null ? "" : this.middlename.toString())).append("; ").append(this.morph.toString());
        return res.toString();
    }
    
    static create_lastname(pit, inf) {
        let res = new PersonMorphCollection();
        if (pit.lastname === null) 
            PersonIdentityToken.set_value(res, pit.begin_token, inf);
        else 
            PersonIdentityToken.set_value2(res, pit.lastname, inf);
        return res;
    }
    
    static try_attach_latin_surname(pit, ontos) {
        if (pit === null) 
            return null;
        if (pit.lastname !== null && ((pit.lastname.is_in_dictionary || pit.lastname.is_lastname_has_std_tail))) {
            let p = new PersonReferent();
            p.add_slot(PersonReferent.ATTR_LASTNAME, pit.lastname.vars[0].value, false, 0);
            return p;
        }
        return null;
    }
    
    static try_attach_onto_for_single(pit, ontos) {
        if ((pit === null || ontos === null || pit.value === null) || pit.typ === PersonItemTokenItemType.INITIAL) 
            return null;
        if (ontos.items.length > 30) 
            return null;
        let p0 = null;
        let cou = 0;
        let fi = false;
        let sur = true;
        for (const p of ontos.items) {
            if (p.referent instanceof PersonReferent) {
                let p00 = null;
                if (pit.firstname !== null) {
                    for (const v of pit.firstname.vars) {
                        if (p.referent.find_slot(PersonReferent.ATTR_FIRSTNAME, v.value, true) !== null) {
                            p00 = Utils.as(p.referent, PersonReferent);
                            fi = true;
                            break;
                        }
                    }
                }
                if (pit.lastname !== null) {
                    for (const v of pit.lastname.vars) {
                        if (p.referent.find_slot(PersonReferent.ATTR_LASTNAME, v.value, true) !== null) {
                            p00 = Utils.as(p.referent, PersonReferent);
                            sur = true;
                            break;
                        }
                    }
                }
                if (p00 === null) {
                    if (p.referent.find_slot(PersonReferent.ATTR_FIRSTNAME, pit.value, true) !== null) {
                        p00 = Utils.as(p.referent, PersonReferent);
                        fi = true;
                    }
                    else if (p.referent.find_slot(PersonReferent.ATTR_LASTNAME, pit.value, true) !== null) {
                        p00 = Utils.as(p.referent, PersonReferent);
                        sur = true;
                    }
                }
                if (p00 !== null) {
                    p0 = p00;
                    cou++;
                }
            }
        }
        if (p0 !== null && cou === 1) {
            if (fi) {
                let li = new Array();
                li.push(pit);
                let king = PersonIdentityToken.try_attach_king(li, 0, pit.morph, false);
                if (king !== null) 
                    return null;
            }
            return p0;
        }
        return null;
    }
    
    static try_attach_onto_for_duble(pit0, pit1, ontos) {
        if ((pit0 === null || pit0.firstname === null || pit1 === null) || pit1.middlename === null || ontos === null) 
            return null;
        if (ontos.items.length > 100) 
            return null;
        let p0 = null;
        let cou = 0;
        for (const p of ontos.items) {
            if (p.referent !== null) {
                for (const v of pit0.firstname.vars) {
                    if (p.referent.find_slot(PersonReferent.ATTR_FIRSTNAME, v.value, true) === null) 
                        continue;
                    if (p.referent.find_slot(PersonReferent.ATTR_MIDDLENAME, pit1.middlename.vars[0].value, true) === null) 
                        continue;
                    p0 = Utils.as(p.referent, PersonReferent);
                    cou++;
                    break;
                }
            }
        }
        if (p0 !== null && cou === 1) 
            return p0;
        return null;
    }
    
    static try_attach_onto_ext(pits, ind, inf, ontos) {
        if (ind >= pits.length || pits[ind].typ === PersonItemTokenItemType.INITIAL || ontos === null) 
            return null;
        if (ontos.items.length > 1000) 
            return null;
        let otl = ontos.attach_token(PersonReferent.OBJ_TYPENAME, pits[ind].begin_token);
        return PersonIdentityToken._try_attach_onto(pits, ind, inf, otl, false, false);
    }
    
    static try_attach_onto_int(pits, ind, inf, ontos) {
        if (ind >= pits.length || pits[ind].typ === PersonItemTokenItemType.INITIAL) 
            return null;
        if (ontos.items.length > 1000) 
            return null;
        let otl = ontos.try_attach(pits[ind].begin_token, null, false);
        let res = PersonIdentityToken._try_attach_onto(pits, ind, inf, otl, false, false);
        if (res !== null) 
            return res;
        return null;
    }
    
    static _try_attach_onto(pits, ind, inf, otl, is_local, is_attr_before) {
        if (otl === null || otl.length === 0) 
            return null;
        let res = new Array();
        let onto_persons = new Array();
        if (otl !== null) {
            for (const ot of otl) {
                if (ot.end_token === pits[ind].end_token) {
                    let pers = Utils.as(ot.item.referent, PersonReferent);
                    if (pers === null) 
                        continue;
                    if (onto_persons.includes(pers)) 
                        continue;
                    let pit = null;
                    if (ot.termin.ignore_terms_order) {
                        if (ind !== 0) 
                            continue;
                        pit = PersonIdentityToken.try_attach_identity(pits, inf);
                        if (pit === null) 
                            continue;
                        let p = new PersonReferent();
                        p.add_identity(pit.lastname);
                        pit.ontology_person = p;
                        onto_persons.push(pers);
                        res.push(pit);
                        continue;
                    }
                    if (inf.gender === MorphGender.MASCULINE) {
                        if (pers.is_female) 
                            continue;
                    }
                    else if (inf.gender === MorphGender.FEMINIE) {
                        if (pers.is_male) 
                            continue;
                    }
                    let inf0 = MorphBaseInfo._new2478(inf._case, inf.gender);
                    if (!ot.morph._case.is_undefined && MorphCase.ooEq(inf0._case, MorphCase.ALL_CASES) && ot.begin_token === ot.end_token) 
                        inf0._case = ot.morph._case;
                    if (pers.is_male) 
                        inf0.gender = MorphGender.MASCULINE;
                    else if (pers.is_female) 
                        inf0.gender = MorphGender.FEMINIE;
                    let vars = new Array();
                    if (ind > 1) {
                        if ((((pit = PersonIdentityToken.try_attachiisurname(pits, ind - 2, inf0)))) !== null) 
                            vars.push(pit);
                        if ((((pit = PersonIdentityToken.try_attach_name_secname_surname(pits, ind - 2, inf0, false)))) !== null) 
                            vars.push(pit);
                    }
                    if (ind > 0) {
                        if ((((pit = PersonIdentityToken.try_attachiisurname(pits, ind - 1, inf0)))) !== null) 
                            vars.push(pit);
                        if ((((pit = PersonIdentityToken.try_attach_name_surname(pits, ind - 1, inf0, false, is_attr_before)))) !== null) 
                            vars.push(pit);
                    }
                    if ((ind + 2) < pits.length) {
                        if ((((pit = PersonIdentityToken.try_attach_surnameii(pits, ind, inf0)))) !== null) 
                            vars.push(pit);
                        if ((((pit = PersonIdentityToken.try_attach_surname_name_secname(pits, ind, inf0, false, false)))) !== null) 
                            vars.push(pit);
                    }
                    if ((ind + 1) < pits.length) {
                        if ((((pit = PersonIdentityToken.try_attach_surname_name(pits, ind, inf0, false)))) !== null) {
                            let pit0 = null;
                            for (const v of vars) {
                                if (v.typ === FioTemplateType.SURNAMENAMESECNAME) {
                                    pit0 = v;
                                    break;
                                }
                            }
                            if (pit0 === null || (pit0.coef < pit.coef)) 
                                vars.push(pit);
                        }
                    }
                    if ((((pit = PersonIdentityToken.try_attach_asian(pits, ind, inf0, 3, false)))) !== null) 
                        vars.push(pit);
                    else if ((((pit = PersonIdentityToken.try_attach_asian(pits, ind, inf0, 2, false)))) !== null) 
                        vars.push(pit);
                    pit = null;
                    for (const v of vars) {
                        if (v.coef < 0) 
                            continue;
                        let p = new PersonReferent();
                        if (v.ontology_person !== null) 
                            p = v.ontology_person;
                        else {
                            if (v.typ === FioTemplateType.ASIANNAME) 
                                pers.add_identity(v.lastname);
                            else 
                                p.add_fio_identity(v.lastname, v.firstname, v.middlename);
                            v.ontology_person = p;
                        }
                        if (!pers.can_be_equals(p, ReferentEqualType.WITHINONETEXT)) {
                            if (pit !== null && v.coef >= pit.coef) 
                                pit = null;
                        }
                        else if (pit === null) 
                            pit = v;
                        else if (pit.coef < v.coef) 
                            pit = v;
                    }
                    if (pit === null) {
                        pit = PersonIdentityToken.try_attach_single_surname(pits, ind, inf0);
                        if (pit === null || (pit.coef < 2)) 
                            continue;
                        let p = new PersonReferent();
                        p.add_fio_identity(pit.lastname, null, null);
                        pit.ontology_person = p;
                    }
                    onto_persons.push(pers);
                    res.push(pit);
                }
            }
        }
        if (res.length === 0) 
            return null;
        if (res.length === 1) {
            res[0].ontology_person.merge_slots(onto_persons[0], true);
            return res[0];
        }
        return null;
    }
    
    static create_typ(pits, _typ, inf) {
        if (_typ === FioTemplateType.SURNAMENAMESECNAME) 
            return PersonIdentityToken.try_attach_surname_name_secname(pits, 0, inf, false, true);
        return null;
    }
    
    static sort(li) {
        if (li !== null && li.length > 1) {
            for (let k = 0; k < li.length; k++) {
                let ch = false;
                for (let i = 0; i < (li.length - 1); i++) {
                    if (li[i].coef < li[i + 1].coef) {
                        ch = true;
                        let v = li[i];
                        li[i] = li[i + 1];
                        li[i + 1] = v;
                    }
                }
                if (!ch) 
                    break;
            }
        }
    }
    
    static try_attach_for_ext_onto(pits) {
        let pit = null;
        if (pits.length === 3) {
            if (pits[0].typ === PersonItemTokenItemType.VALUE && pits[1].typ === PersonItemTokenItemType.INITIAL && pits[2].typ === PersonItemTokenItemType.VALUE) {
                pit = PersonIdentityToken._new2479(pits[0].begin_token, pits[2].end_token, FioTemplateType.NAMEISURNAME);
                PersonIdentityToken.manage_firstname(pit, pits[0], null);
                PersonIdentityToken.manage_lastname(pit, pits[2], null);
                PersonIdentityToken.manage_middlename(pit, pits[1], null);
                pit.coef = 2;
            }
            else if (pits[0].typ === PersonItemTokenItemType.VALUE && pits[1].typ === PersonItemTokenItemType.VALUE && pits[2].typ === PersonItemTokenItemType.VALUE) {
                let ok = false;
                if (pits[0].firstname === null && pits[1].middlename === null && ((pits[1].firstname !== null || pits[2].middlename !== null))) 
                    ok = true;
                else if (pits[0].firstname !== null && ((pits[0].firstname.is_lastname_has_std_tail || pits[0].firstname.is_in_dictionary))) 
                    ok = true;
                if (ok) {
                    pit = PersonIdentityToken._new2479(pits[0].begin_token, pits[2].end_token, FioTemplateType.SURNAMENAMESECNAME);
                    PersonIdentityToken.manage_firstname(pit, pits[1], null);
                    PersonIdentityToken.manage_lastname(pit, pits[0], null);
                    PersonIdentityToken.manage_middlename(pit, pits[2], null);
                    pit.coef = 2;
                }
            }
        }
        else if (pits.length === 2 && pits[0].typ === PersonItemTokenItemType.VALUE && pits[1].typ === PersonItemTokenItemType.VALUE) {
            let nam = null;
            let sur = null;
            for (let i = 0; i < 2; i++) {
                if (((pits[i].firstname !== null && pits[i].firstname.is_in_dictionary)) || ((pits[i ^ 1].lastname !== null && ((pits[i ^ 1].lastname.is_in_dictionary || pits[i ^ 1].lastname.is_lastname_has_std_tail))))) {
                    nam = pits[i];
                    sur = pits[i ^ 1];
                    break;
                }
            }
            if (nam !== null) {
                pit = PersonIdentityToken._new2479(pits[0].begin_token, pits[1].end_token, (nam === pits[0] ? FioTemplateType.NAMESURNAME : FioTemplateType.SURNAMENAME));
                PersonIdentityToken.manage_firstname(pit, nam, null);
                PersonIdentityToken.manage_lastname(pit, sur, null);
                pit.coef = 2;
            }
        }
        if (pit === null) 
            return null;
        let res = new Array();
        res.push(pit);
        return res;
    }
    
    static try_attach(pits, ind, inf, first_tok, king, is_attr_before) {
        let res = new Array();
        let ty = FioTemplateType.UNDEFINED;
        if (first_tok !== null) {
            for (let t = first_tok.previous; t !== null; t = t.previous) {
                let pf = Utils.as(t.get_referent(), PersonReferent);
                if (pf !== null) {
                    ty = pf.m_person_identity_typ;
                    break;
                }
                if (t.is_newline_before) 
                    break;
                if (t.chars.is_letter && !t.is_and) 
                    break;
            }
        }
        let pit = null;
        let pit1 = null;
        if ((((pit = PersonIdentityToken.try_attach_global(pits, ind, inf)))) !== null) {
            res.push(pit);
            return res;
        }
        if ((((pit = PersonIdentityToken.try_attach_surnameii(pits, ind, inf)))) !== null) 
            res.push(pit);
        if ((((pit = PersonIdentityToken.try_attachiisurname(pits, ind, inf)))) !== null) 
            res.push(pit);
        if ((((pit = PersonIdentityToken.try_attach_asian(pits, ind, inf, 3, ty === FioTemplateType.ASIANNAME)))) !== null) 
            res.push(pit);
        else {
            if ((((pit = PersonIdentityToken.try_attach_name_surname(pits, ind, inf, ty === FioTemplateType.NAMESURNAME, is_attr_before)))) !== null) 
                res.push(pit);
            if ((((pit1 = PersonIdentityToken.try_attach_surname_name(pits, ind, inf, ty === FioTemplateType.SURNAMENAME)))) !== null) {
                res.push(pit1);
                if (pit !== null && (pit.coef + (1)) >= pit1.coef && ty !== FioTemplateType.SURNAMENAME) 
                    pit1.coef -= (0.5);
            }
            if ((((pit = PersonIdentityToken.try_attach_name_secname_surname(pits, ind, inf, ty === FioTemplateType.NAMESECNAMESURNAME)))) !== null) 
                res.push(pit);
            if ((((pit = PersonIdentityToken.try_attach_surname_name_secname(pits, ind, inf, ty === FioTemplateType.SURNAMENAMESECNAME, false)))) !== null) 
                res.push(pit);
            if ((((pit = PersonIdentityToken.try_attach_asian(pits, ind, inf, 2, ty === FioTemplateType.ASIANNAME)))) !== null) 
                res.push(pit);
        }
        if (king) {
            if ((((pit = PersonIdentityToken.try_attach_name_secname(pits, ind, inf, ty === FioTemplateType.NAMESECNAME)))) !== null) {
                res.push(pit);
                for (const r of res) {
                    if (r.typ === FioTemplateType.NAMESURNAME) 
                        r.coef = pit.coef - (1);
                }
            }
        }
        if ((((pit = PersonIdentityToken.try_attach_king(pits, ind, inf, ty === FioTemplateType.KING || king)))) !== null) 
            res.push(pit);
        if (inf.gender === MorphGender.MASCULINE || inf.gender === MorphGender.FEMINIE) {
            for (const p of res) {
                if (p.morph.gender === MorphGender.UNDEFINED || (p.morph.gender.value()) === (((MorphGender.FEMINIE.value()) | (MorphGender.MASCULINE.value())))) {
                    p.morph.gender = inf.gender;
                    if (p.morph._case.is_undefined) 
                        p.morph._case = inf._case;
                }
            }
        }
        for (const r of res) {
            for (let tt = r.begin_token; tt !== r.end_token; tt = tt.next) {
                if (tt.is_newline_after) 
                    r.coef -= (1);
            }
            let ttt = r.begin_token.previous;
            if (ttt !== null && MorphClass.ooEq(ttt.morph.class0, MorphClass.VERB)) {
                let tte = r.end_token.next;
                if (tte === null || tte.is_char('.') || tte.is_newline_before) {
                }
                else 
                    continue;
                r.coef += (1);
            }
            if (r.coef >= 0 && ind === 0 && r.end_token === pits[pits.length - 1].end_token) 
                r.coef += PersonIdentityToken._calc_coef_after(pits[pits.length - 1].end_token.next);
        }
        if (ty !== FioTemplateType.UNDEFINED && ind === 0) {
            for (const r of res) {
                if (r.typ === ty) 
                    r.coef += (1.5);
                else if (((r.typ === FioTemplateType.SURNAMENAME && ty === FioTemplateType.SURNAMENAMESECNAME)) || ((r.typ === FioTemplateType.SURNAMENAMESECNAME && ty === FioTemplateType.SURNAMENAME))) 
                    r.coef += (0.5);
            }
        }
        PersonIdentityToken.sort(res);
        return res;
    }
    
    static manage_lastname(res, pit, inf) {
        if (pit.lastname === null) {
            res.lastname = new PersonMorphCollection();
            PersonIdentityToken.set_value(res.lastname, pit.begin_token, inf);
            if (pit.is_in_dictionary) 
                res.coef--;
            let tt = Utils.as(pit.begin_token, TextToken);
            if ((tt !== null && !tt.chars.is_latin_letter && tt.chars.is_capital_upper) && tt.length_char > 2 && !tt.chars.is_latin_letter) {
                let ok = true;
                for (const wf of tt.morph.items) {
                    if ((wf).is_in_dictionary) {
                        ok = false;
                        break;
                    }
                }
                if (ok) 
                    res.coef += (1);
            }
        }
        else {
            res.coef++;
            if (!PersonIdentityToken.is_accords(pit.lastname, inf)) 
                res.coef--;
            res.lastname = new PersonMorphCollection();
            PersonIdentityToken.set_value2(res.lastname, pit.lastname, inf);
            if (pit.lastname.term !== null) {
                if (res.morph._case.is_undefined || res.morph._case.is_nominative) {
                    if (!pit.lastname.is_in_dictionary && !res.lastname.values.includes(pit.lastname.term)) {
                        if (inf._case.is_nominative || inf._case.is_undefined) {
                            if (pit.lastname.morph.class0.is_adjective && inf.gender === MorphGender.FEMINIE) {
                            }
                            else 
                                res.lastname.add(pit.lastname.term, null, pit.morph.gender, false);
                        }
                    }
                }
            }
            if (pit.is_in_dictionary) 
                res.coef--;
            if (pit.lastname.is_in_dictionary || pit.lastname.is_in_ontology) 
                res.coef++;
            if (pit.lastname.is_lastname_has_hiphen) 
                res.coef += (1);
            if (pit.middlename !== null && pit.middlename.morph.gender === MorphGender.FEMINIE) 
                res.coef--;
        }
        if (pit.firstname !== null && !pit.chars.is_latin_letter) 
            res.coef--;
        if (pit.begin_token instanceof ReferentToken) 
            res.coef--;
    }
    
    static manage_firstname(res, pit, inf) {
        if (pit.firstname === null) {
            if (pit.lastname !== null) 
                res.coef--;
            res.firstname = new PersonMorphCollection();
            PersonIdentityToken.set_value(res.firstname, pit.begin_token, inf);
            if (pit.is_in_dictionary) 
                res.coef--;
        }
        else {
            res.coef++;
            if (!PersonIdentityToken.is_accords(pit.firstname, inf)) 
                res.coef--;
            res.firstname = new PersonMorphCollection();
            PersonIdentityToken.set_value2(res.firstname, pit.firstname, inf);
            if (pit.is_in_dictionary && !pit.firstname.is_in_dictionary) 
                res.coef--;
        }
        if (pit.middlename !== null && pit.middlename !== pit.firstname) 
            res.coef--;
        if (pit.lastname !== null && ((pit.lastname.is_in_dictionary || pit.lastname.is_in_ontology))) 
            res.coef--;
        if (pit.begin_token instanceof ReferentToken) 
            res.coef -= (2);
    }
    
    static manage_middlename(res, pit, inf) {
        let mm = new PersonMorphCollection();
        res.middlename = mm;
        if (pit.middlename === null) 
            PersonIdentityToken.set_value(mm, pit.begin_token, inf);
        else {
            res.coef++;
            if (!PersonIdentityToken.is_accords(pit.middlename, inf)) 
                res.coef--;
            PersonIdentityToken.set_value2(mm, pit.middlename, inf);
        }
    }
    
    static try_attach_single_surname(pits, ind, inf) {
        if (ind >= pits.length || pits[ind].lastname === null) 
            return null;
        let res = new PersonIdentityToken(pits[ind].begin_token, pits[ind].end_token);
        if (ind === 0 && pits.length === 1) 
            res.coef++;
        else {
            if (ind > 0 && ((!pits[ind - 1].is_in_dictionary || pits[ind - 1].typ === PersonItemTokenItemType.INITIAL || pits[ind - 1].firstname !== null))) 
                res.coef--;
            if (((ind + 1) < pits.length) && ((!pits[ind + 1].is_in_dictionary || pits[ind + 1].typ === PersonItemTokenItemType.INITIAL || pits[ind + 1].firstname !== null))) 
                res.coef--;
        }
        res.morph = PersonIdentityToken.accord_morph(inf, pits[ind].lastname, null, null, pits[ind].end_token.next);
        PersonIdentityToken.manage_lastname(res, pits[ind], inf);
        return res;
    }
    
    static try_attach_name_surname(pits, ind, inf, prev_has_this_typ = false, is_attr_before = false) {
        if ((ind + 1) >= pits.length || pits[ind + 1].typ !== PersonItemTokenItemType.VALUE || pits[ind].typ !== PersonItemTokenItemType.VALUE) 
            return null;
        if (pits[ind + 1].lastname === null) {
            if (!prev_has_this_typ) {
                if (pits[ind].chars.is_latin_letter) {
                }
                else {
                    if (pits[ind].firstname === null || pits[ind + 1].middlename !== null) 
                        return null;
                    if (pits[ind + 1].is_newline_after) {
                    }
                    else if (pits[ind + 1].end_token.next !== null && pits[ind + 1].end_token.next.is_char_of(",.)")) {
                    }
                    else 
                        return null;
                }
            }
        }
        if (pits[ind].is_newline_after || pits[ind].is_hiphen_after) 
            return null;
        if (pits[ind + 1].middlename !== null && pits[ind + 1].middlename.is_in_dictionary && pits[ind + 1].middlename.morph.gender === MorphGender.FEMINIE) 
            return null;
        if (PersonIdentityToken.is_both_surnames(pits[ind], pits[ind + 1])) 
            return null;
        let res = PersonIdentityToken._new2479(pits[ind].begin_token, pits[ind + 1].end_token, FioTemplateType.NAMESURNAME);
        res.coef -= (ind);
        res.morph = PersonIdentityToken.accord_morph(inf, pits[ind + 1].lastname, pits[ind].firstname, null, pits[ind + 1].end_token.next);
        if (res.morph.gender === MorphGender.MASCULINE || res.morph.gender === MorphGender.FEMINIE) {
            if (pits[ind + 1].lastname !== null && !pits[ind + 1].lastname.morph._case.is_undefined) {
                if ((pits[ind].lastname !== null && pits[ind].lastname.is_lastname_has_std_tail && pits[ind + 1].firstname !== null) && pits[ind + 1].firstname.is_in_dictionary) 
                    res.coef -= (1);
                else 
                    res.coef += (1);
            }
            inf = res.morph;
        }
        PersonIdentityToken.manage_firstname(res, pits[ind], inf);
        PersonIdentityToken.manage_lastname(res, pits[ind + 1], inf);
        if (pits[ind].firstname !== null && (pits[ind + 1].begin_token instanceof ReferentToken)) 
            res.coef++;
        if (pits[ind].begin_token.get_morph_class_in_dictionary().is_verb) {
            if (pits[ind].begin_token.chars.is_capital_upper && !MiscHelper.can_be_start_of_sentence(pits[ind].begin_token)) {
            }
            else 
                res.coef -= (1);
        }
        if (pits[ind].firstname !== null && ((pits[ind + 1].is_newline_after || ((pits[ind + 1].end_token.next !== null && ((pits[ind + 1].end_token.next.is_char_of(",."))))))) && !pits[ind + 1].is_newline_before) {
            if (pits[ind + 1].firstname === null && pits[ind + 1].middlename === null) 
                res.coef++;
            else if (pits[ind + 1].chars.is_latin_letter && (ind + 2) === pits.length) 
                res.coef++;
        }
        if (pits[ind + 1].middlename !== null) {
            let info = pits[ind].kit.statistics.get_word_info(pits[ind + 1].begin_token);
            if (info !== null && info.not_capital_before_count > 0) {
            }
            else {
                res.coef -= (1 + ind);
                if (res.morph.gender === MorphGender.MASCULINE || res.morph.gender === MorphGender.FEMINIE) {
                    if (pits[ind + 1].lastname !== null && ((pits[ind + 1].lastname.is_in_dictionary || pits[ind + 1].lastname.is_in_ontology))) {
                    }
                    else 
                        for (const v of pits[ind + 1].middlename.vars) {
                            if ((((v.gender.value()) & (res.morph.gender.value()))) !== (MorphGender.UNDEFINED.value())) {
                                res.coef -= (1);
                                break;
                            }
                        }
                }
            }
        }
        if (CharsInfo.ooNoteq(pits[ind].chars, pits[ind + 1].chars)) {
            if (pits[ind].chars.is_capital_upper && pits[ind + 1].chars.is_all_upper) {
            }
            else if (pits[ind].chars.is_all_upper && pits[ind + 1].chars.is_capital_upper && pits[ind].firstname === null) 
                res.coef -= (10);
            else 
                res.coef -= (1);
            if (pits[ind].firstname === null || !pits[ind].firstname.is_in_dictionary || pits[ind].chars.is_all_upper) 
                res.coef -= (1);
        }
        else if (pits[ind].chars.is_all_upper) 
            res.coef -= (0.5);
        if (pits[ind].is_in_dictionary) {
            if (pits[ind + 1].is_in_dictionary) {
                res.coef -= (2);
                if (pits[ind + 1].is_newline_after) 
                    res.coef++;
                else if (pits[ind + 1].end_token.next !== null && pits[ind + 1].end_token.next.is_char_of(".,:")) 
                    res.coef++;
                if (pits[ind].is_in_dictionary && pits[ind].firstname === null) 
                    res.coef--;
            }
            else if (pits[ind].firstname === null || !pits[ind].firstname.is_in_dictionary) {
                if (inf._case.is_undefined) 
                    res.coef -= (1);
                else 
                    for (const mi of pits[ind].begin_token.morph.items) {
                        if (!(MorphCase.ooBitand(mi._case, inf._case)).is_undefined) {
                            if ((mi instanceof MorphWordForm) && (mi).is_in_dictionary) {
                                res.coef -= (1);
                                break;
                            }
                        }
                    }
            }
        }
        if (!pits[ind].chars.is_latin_letter) {
            let npt = NounPhraseHelper.try_parse(pits[ind].begin_token, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null && npt.end_char >= pits[ind + 1].begin_char) {
                if (pits[ind].begin_token.get_morph_class_in_dictionary().is_adjective) 
                    res.coef -= (2);
                else if (pits[ind + 1].begin_token.get_morph_class_in_dictionary().is_noun) 
                    res.coef -= (2);
            }
        }
        PersonIdentityToken.correct_coef_after_lastname(res, pits, ind + 2);
        if (ind > 0 && res.coef > 0 && pits[ind].is_hiphen_before) {
            let b1 = pits[ind].kit.statistics.get_bigramm_info(pits[ind - 1].begin_token, pits[ind].begin_token);
            if (b1 !== null && b1.second_count === b1.pair_count) {
                let res0 = PersonIdentityToken._new2479(pits[ind].begin_token, pits[ind + 1].end_token, FioTemplateType.NAMESURNAME);
                PersonIdentityToken.manage_firstname(res0, pits[ind - 1], inf);
                res.firstname = PersonMorphCollection.add_prefix(res0.firstname, res.firstname);
                res.coef++;
                res.begin_token = pits[ind - 1].begin_token;
            }
        }
        if (BracketHelper.can_be_start_of_sequence(res.begin_token.previous, false, false) && BracketHelper.can_be_end_of_sequence(res.end_token.next, false, null, false)) 
            res.coef -= (2);
        let bi = pits[0].begin_token.kit.statistics.get_initial_info(pits[ind].value, pits[ind + 1].begin_token);
        if (bi !== null && bi.pair_count > 0) 
            res.coef += (2);
        if ((!pits[0].is_in_dictionary && pits[1].lastname !== null && pits[1].lastname.is_lastname_has_std_tail) && !pits[1].is_in_dictionary) 
            res.coef += 0.5;
        if (res.firstname !== null && pits[ind].begin_token.is_value("СЛАВА", null)) 
            res.coef -= (3);
        else if (PersonIdentityToken.check_latin_after(res) !== null) 
            res.coef += (2);
        if (pits[0].firstname === null || ((pits[0].firstname !== null && !pits[0].firstname.is_in_dictionary))) {
            if (pits[0].begin_token.get_morph_class_in_dictionary().is_proper_geo && pits[1].lastname !== null && pits[1].lastname.is_in_ontology) 
                res.coef -= (2);
        }
        if (ind === 0 && pits.length === 2 && pits[0].chars.is_latin_letter) {
            if (pits[0].firstname !== null) {
                if (!is_attr_before && (pits[0].begin_token.previous instanceof TextToken) && pits[0].begin_token.previous.chars.is_capital_upper) 
                    res.coef -= (1);
                else 
                    res.coef += (1);
            }
            if (pits[0].chars.is_all_upper && pits[1].chars.is_capital_upper) 
                res.coef = 0;
        }
        return res;
    }
    
    static try_attach_name_secname_surname(pits, ind, inf, prev_has_this_typ = false) {
        if ((ind + 2) >= pits.length || pits[ind].typ !== PersonItemTokenItemType.VALUE || pits[ind + 2].typ !== PersonItemTokenItemType.VALUE) 
            return null;
        if (pits[ind].is_newline_after) {
            if ((pits.length === 3 && pits[0].firstname !== null && pits[1].middlename !== null) && pits[2].lastname !== null) {
            }
            else 
                return null;
        }
        if (pits[ind + 2].lastname === null && !prev_has_this_typ && !pits[ind].morph.language.is_en) 
            return null;
        let ok = false;
        let need_test_name_surname = false;
        let add_coef = 0;
        if (pits[ind + 1].typ === PersonItemTokenItemType.INITIAL) 
            ok = true;
        else if (pits[ind + 1].typ === PersonItemTokenItemType.VALUE && pits[ind + 1].middlename !== null) 
            ok = true;
        else if (pits[ind + 1].typ === PersonItemTokenItemType.VALUE && pits[ind + 2].firstname === null) {
            let b1 = pits[0].kit.statistics.get_bigramm_info(pits[ind + 1].begin_token, pits[ind + 2].begin_token);
            let b2 = pits[0].kit.statistics.get_bigramm_info(pits[ind].begin_token, pits[ind + 2].begin_token);
            if (b1 !== null) {
                if (b1.pair_count === b1.first_count && b1.pair_count === b1.second_count) {
                    ok = true;
                    let b3 = pits[0].kit.statistics.get_bigramm_info(pits[ind].begin_token, pits[ind + 1].begin_token);
                    if (b3 !== null) {
                        if (b3.second_count > b3.pair_count) 
                            ok = false;
                        else if (b3.second_count === b3.pair_count && pits[ind + 2].is_hiphen_before) 
                            ok = false;
                    }
                }
                else if (b2 !== null && (b2.pair_count + b1.pair_count) === b1.second_count) 
                    ok = true;
            }
            else if ((ind + 3) === pits.length && pits[ind + 2].lastname !== null && !pits[ind + 2].is_in_dictionary) 
                ok = true;
            if (!ok) {
                b1 = pits[0].kit.statistics.get_initial_info(pits[ind].value, pits[ind + 2].begin_token);
                if (b1 !== null && b1.pair_count > 0) {
                    ok = true;
                    add_coef = 2;
                }
            }
            if (!ok) {
                let wi = pits[0].kit.statistics.get_word_info(pits[ind + 2].end_token);
                if (wi !== null && wi.lower_count === 0) {
                    if (wi.male_verbs_after_count > 0 || wi.female_verbs_after_count > 0) {
                        ok = true;
                        add_coef = 2;
                        need_test_name_surname = true;
                        if (pits[ind + 1].firstname !== null && pits[ind + 1].middlename === null) {
                            if (pits[ind].firstname === null && pits[ind].value !== null && pits[ind].is_in_dictionary) 
                                ok = false;
                        }
                        if (pits[ind + 1].lastname !== null && ((pits[ind + 1].lastname.is_in_dictionary || pits[ind + 1].lastname.is_in_ontology))) 
                            ok = false;
                    }
                }
            }
            if (!ok) {
                if ((ind === 0 && pits.length === 3 && pits[0].chars.is_latin_letter) && pits[1].chars.is_latin_letter && pits[2].chars.is_latin_letter) {
                    if (pits[0].firstname !== null && pits[2].lastname !== null) 
                        ok = true;
                }
            }
        }
        if (!ok) 
            return null;
        if (PersonIdentityToken.is_both_surnames(pits[ind], pits[ind + 2])) 
            return null;
        ok = false;
        for (let i = ind; i < (ind + 3); i++) {
            if (pits[i].typ === PersonItemTokenItemType.INITIAL) 
                ok = true;
            else if (!pits[i].is_in_dictionary) {
                let cla = pits[i].begin_token.get_morph_class_in_dictionary();
                if (cla.is_proper_name || cla.is_proper_surname || cla.is_proper_secname) 
                    ok = true;
                else if (cla.is_undefined) 
                    ok = true;
            }
        }
        if (!ok) 
            return null;
        let res = new PersonIdentityToken(pits[ind].begin_token, pits[ind + 2].end_token);
        res.typ = (pits[ind + 1].typ === PersonItemTokenItemType.INITIAL ? FioTemplateType.NAMEISURNAME : FioTemplateType.NAMESECNAMESURNAME);
        res.coef -= (ind);
        res.morph = PersonIdentityToken.accord_morph(inf, pits[ind + 2].lastname, pits[ind].firstname, pits[ind + 1].middlename, pits[ind + 2].end_token.next);
        if (res.morph.gender === MorphGender.MASCULINE || res.morph.gender === MorphGender.FEMINIE) {
            res.coef += (1);
            inf = res.morph;
        }
        PersonIdentityToken.manage_firstname(res, pits[ind], inf);
        PersonIdentityToken.manage_lastname(res, pits[ind + 2], inf);
        if (pits[ind + 1].middlename !== null && pits[ind + 1].middlename.vars.length > 0) {
            res.coef++;
            res.middlename = pits[ind + 1].middlename.vars[0].value;
            if (pits[ind + 1].middlename.vars.length > 1) {
                res.middlename = new PersonMorphCollection();
                PersonIdentityToken.set_value2(Utils.as(res.middlename, PersonMorphCollection), pits[ind + 1].middlename, inf);
            }
            if (pits[ind + 2].lastname !== null) {
                if (pits[ind + 2].lastname.is_in_dictionary || pits[ind + 2].lastname.is_lastname_has_std_tail || pits[ind + 2].lastname.is_has_std_postfix) 
                    res.coef++;
            }
        }
        else if (pits[ind + 1].typ === PersonItemTokenItemType.INITIAL) {
            res.middlename = pits[ind + 1].value;
            res.coef++;
            if (pits[ind + 2].lastname !== null) {
            }
            else {
                let npt = NounPhraseHelper.try_parse(pits[ind + 2].begin_token, NounPhraseParseAttr.of((NounPhraseParseAttr.PARSEPREPOSITION.value()) | (NounPhraseParseAttr.PARSEPRONOUNS.value()) | (NounPhraseParseAttr.PARSEADVERBS.value())), 0, null);
                if (npt !== null && npt.end_char > pits[ind + 2].end_char) 
                    res.coef -= (2);
            }
        }
        else if (pits[ind + 1].firstname !== null && pits[ind + 2].middlename !== null && pits.length === 3) 
            res.coef -= (2);
        else {
            PersonIdentityToken.manage_middlename(res, pits[ind + 1], inf);
            res.coef += (0.5);
        }
        if (CharsInfo.ooNoteq(pits[ind].chars, pits[ind + 2].chars)) {
            res.coef -= (1);
            if (pits[ind].chars.is_all_upper) 
                res.coef -= (1);
        }
        else if (pits[ind + 1].typ !== PersonItemTokenItemType.INITIAL && CharsInfo.ooNoteq(pits[ind].chars, pits[ind + 1].chars)) 
            res.coef -= (1);
        PersonIdentityToken.correct_coef_after_lastname(res, pits, ind + 3);
        res.coef += (add_coef);
        if (pits[ind].is_in_dictionary && pits[ind + 1].is_in_dictionary && pits[ind + 2].is_in_dictionary) 
            res.coef--;
        return res;
    }
    
    static try_attach_name_secname(pits, ind, inf, prev_has_this_typ = false) {
        if ((ind !== 0 || (ind + 2) !== pits.length || pits[ind].typ !== PersonItemTokenItemType.VALUE) || pits[ind + 1].typ !== PersonItemTokenItemType.VALUE) 
            return null;
        if (pits[ind].is_newline_after) 
            return null;
        if (pits[ind].firstname === null || pits[ind + 1].middlename === null) 
            return null;
        let res = new PersonIdentityToken(pits[ind].begin_token, pits[ind + 1].end_token);
        res.typ = FioTemplateType.NAMESECNAME;
        res.morph = PersonIdentityToken.accord_morph(inf, null, pits[ind].firstname, pits[ind + 1].middlename, pits[ind + 1].end_token.next);
        if (res.morph.gender === MorphGender.MASCULINE || res.morph.gender === MorphGender.FEMINIE) {
            res.coef += (1);
            inf = res.morph;
        }
        PersonIdentityToken.manage_firstname(res, pits[ind], inf);
        PersonIdentityToken.manage_middlename(res, pits[ind + 1], inf);
        res.coef = 2;
        return res;
    }
    
    static correct_coef_after_lastname(res, pits, ind) {
        if (!pits[ind - 1].is_newline_after) {
            let pat = PersonAttrToken.try_attach(pits[ind - 1].begin_token, null, PersonAttrTokenPersonAttrAttachAttrs.ONLYKEYWORD);
            if (pat !== null) 
                res.coef -= (1);
        }
        if (ind >= pits.length) {
            if (PersonIdentityToken.check_latin_after(res) !== null) 
                res.coef += (2);
            let te = pits[ind - 1].end_token;
            let stat = te.kit.statistics.get_word_info(te);
            if (stat !== null) {
                if (stat.has_before_person_attr) 
                    res.coef++;
            }
            te = pits[ind - 1].end_token.next;
            if (te === null) 
                return;
            if (PersonHelper.is_person_say_or_attr_after(te)) {
                res.coef++;
                if (res.chars.is_latin_letter && res.typ === FioTemplateType.NAMESURNAME) 
                    res.coef += (2);
            }
            if (!te.chars.is_letter && !te.chars.is_all_lower) 
                return;
            let wi = te.kit.statistics.get_word_info(te);
            if (wi !== null) {
                if (wi.lower_count > 0) 
                    res.coef--;
                else if ((wi.female_verbs_after_count + wi.male_verbs_after_count) > 0) 
                    res.coef++;
            }
            return;
        }
        if (ind === 0) 
            return;
        if (pits[ind].typ === PersonItemTokenItemType.VALUE && ((pits[ind].firstname === null || ind === (pits.length - 1)))) {
            let b1 = pits[0].kit.statistics.get_bigramm_info(pits[ind - 1].begin_token, pits[ind].begin_token);
            if ((b1 !== null && b1.first_count === b1.pair_count && b1.second_count === b1.pair_count) && b1.pair_count > 0) {
                let ok = false;
                if (b1.pair_count > 1 && pits[ind].whitespaces_before_count === 1) 
                    ok = true;
                else if (pits[ind].is_hiphen_before && pits[ind].lastname !== null) 
                    ok = true;
                if (ok) {
                    let res1 = new PersonIdentityToken(pits[ind].begin_token, pits[ind].end_token);
                    PersonIdentityToken.manage_lastname(res1, pits[ind], res.morph);
                    res.lastname = PersonMorphCollection.add_prefix(res.lastname, res1.lastname);
                    res.end_token = pits[ind].end_token;
                    res.coef++;
                    ind++;
                    if (ind >= pits.length) 
                        return;
                }
            }
        }
        if (pits[ind - 1].whitespaces_before_count > pits[ind - 1].whitespaces_after_count) 
            res.coef -= (1);
        else if (pits[ind - 1].whitespaces_before_count === pits[ind - 1].whitespaces_after_count) {
            if (pits[ind].lastname !== null || pits[ind].firstname !== null) {
                if (!pits[ind].is_in_dictionary) 
                    res.coef -= (1);
            }
        }
    }
    
    static correct_coef_for_lastname(pit, it) {
        if (it.begin_token !== it.end_token) 
            return;
        let tt = Utils.as(it.begin_token, TextToken);
        if (tt === null) 
            return;
        let in_dic = false;
        let has_std = false;
        for (const wf of tt.morph.items) {
            if (wf.class0.is_proper_surname) {
            }
            else if ((wf).is_in_dictionary) 
                in_dic = true;
        }
        if (it.lastname !== null) 
            has_std = it.lastname.is_lastname_has_std_tail;
        if (!has_std && in_dic) 
            pit.coef -= 1.5;
    }
    
    static try_attach_surname_name(pits, ind, inf, prev_has_this_typ = false) {
        if ((ind + 1) >= pits.length || pits[ind + 1].typ !== PersonItemTokenItemType.VALUE || pits[ind].typ !== PersonItemTokenItemType.VALUE) 
            return null;
        if (pits[ind].lastname === null && !prev_has_this_typ) 
            return null;
        if (PersonIdentityToken.is_both_surnames(pits[ind], pits[ind + 1])) 
            return null;
        let res = PersonIdentityToken._new2479(pits[ind].begin_token, pits[ind + 1].end_token, FioTemplateType.SURNAMENAME);
        res.coef -= (ind);
        if (pits[ind].is_newline_after) {
            res.coef--;
            if (pits[ind].whitespaces_after_count > 15) 
                res.coef--;
        }
        res.morph = PersonIdentityToken.accord_morph(inf, pits[ind].lastname, pits[ind + 1].firstname, null, pits[ind + 1].end_token.next);
        if (res.morph.gender === MorphGender.MASCULINE || res.morph.gender === MorphGender.FEMINIE) {
            if (pits[ind].lastname !== null && !pits[ind].lastname.morph._case.is_undefined) 
                res.coef += (1);
            inf = res.morph;
        }
        PersonIdentityToken.manage_lastname(res, pits[ind], inf);
        PersonIdentityToken.manage_firstname(res, pits[ind + 1], inf);
        PersonIdentityToken.correct_coef_for_lastname(res, pits[ind]);
        if (CharsInfo.ooNoteq(pits[ind].chars, pits[ind + 1].chars)) {
            res.coef -= (1);
            if (pits[ind + 1].firstname === null || !pits[ind + 1].firstname.is_in_dictionary || pits[ind + 1].chars.is_all_upper) 
                res.coef -= (1);
        }
        else if (pits[ind].chars.is_all_upper) 
            res.coef -= (0.5);
        if (pits[ind + 1].is_in_dictionary && ((pits[ind + 1].firstname === null || !pits[ind + 1].firstname.is_in_dictionary))) 
            res.coef -= (1);
        PersonIdentityToken.correct_coef_after_name(res, pits, ind + 2);
        let npt = NounPhraseHelper.try_parse(pits[ind + 1].end_token, NounPhraseParseAttr.NO, 0, null);
        if (npt !== null && npt.end_token !== pits[ind + 1].end_token) 
            res.coef -= (1);
        if (ind === 0) 
            PersonIdentityToken.correct_coefsns(res, pits, ind + 2);
        if (pits[ind].end_token.next.is_hiphen) 
            res.coef -= (2);
        if (BracketHelper.can_be_start_of_sequence(res.begin_token.previous, false, false) && BracketHelper.can_be_end_of_sequence(res.end_token.next, false, null, false)) 
            res.coef -= (2);
        if (pits[ind].is_in_dictionary) {
            let mc = pits[ind].begin_token.get_morph_class_in_dictionary();
            if (mc.is_pronoun || mc.is_personal_pronoun) 
                return null;
        }
        if (((pits.length === 2 && ind === 0 && pits[0].chars.is_all_upper) && pits[1].chars.is_capital_upper && !pits[1].is_in_dictionary) && (res.coef < 0)) 
            res.coef = 0;
        return res;
    }
    
    static correct_coefsns(res, pits, ind_after) {
        if (ind_after >= pits.length) 
            return;
        if (pits[0].lastname === null || !pits[0].lastname.is_lastname_has_std_tail) {
            let stat = pits[0].kit.statistics.get_word_info(pits[1].begin_token);
            let stata = pits[0].kit.statistics.get_word_info(pits[2].begin_token);
            let statb = pits[0].kit.statistics.get_word_info(pits[0].begin_token);
            if (stat !== null && stata !== null && statb !== null) {
                if (stat.like_chars_after_words !== null && stat.like_chars_before_words !== null) {
                    let coua = 0;
                    let coub = 0;
                    let wrapcoua2486 = new RefOutArgWrapper();
                    stat.like_chars_after_words.tryGetValue(stata, wrapcoua2486);
                    coua = wrapcoua2486.value;
                    let wrapcoub2485 = new RefOutArgWrapper();
                    stat.like_chars_before_words.tryGetValue(statb, wrapcoub2485);
                    coub = wrapcoub2485.value;
                    if (coua === stat.total_count && (coub < stat.total_count)) 
                        res.coef -= (2);
                }
            }
            return;
        }
        if (pits[1].firstname === null) 
            return;
        let middle = null;
        if (ind_after > 2 && pits[2].middlename !== null) 
            middle = pits[2].middlename;
        let inf = new MorphBaseInfo();
        let mi1 = PersonIdentityToken.accord_morph(inf, pits[0].lastname, pits[1].firstname, middle, null);
        if (mi1._case.is_undefined) 
            res.coef -= (1);
        if (pits[ind_after].lastname === null || !pits[ind_after].lastname.is_lastname_has_std_tail) 
            return;
        let mi2 = PersonIdentityToken.accord_morph(inf, pits[ind_after].lastname, pits[1].firstname, middle, pits[ind_after].end_token.next);
        if (!mi2._case.is_undefined) 
            res.coef -= (1);
    }
    
    static try_attach_surname_name_secname(pits, ind, inf, prev_has_this_typ = false, always = false) {
        if ((ind + 2) >= pits.length || pits[ind + 1].typ !== PersonItemTokenItemType.VALUE || pits[ind].typ !== PersonItemTokenItemType.VALUE) 
            return null;
        if (pits[ind].lastname === null && !prev_has_this_typ) {
            if (ind > 0) 
                return null;
            if (pits.length === 3 && !always) {
                let tt1 = pits[2].end_token.next;
                if (tt1 !== null && tt1.is_comma) 
                    tt1 = tt1.next;
                if (tt1 !== null && !tt1.is_newline_before && PersonAttrToken.try_attach(tt1, null, PersonAttrTokenPersonAttrAttachAttrs.ONLYKEYWORD) !== null) {
                }
                else 
                    return null;
            }
        }
        if (!always) {
            if (PersonIdentityToken.is_both_surnames(pits[ind], pits[ind + 2])) 
                return null;
            if (PersonIdentityToken.is_both_surnames(pits[ind], pits[ind + 1])) {
                if (pits.length === 3 && ind === 0 && pits[2].middlename !== null) {
                }
                else 
                    return null;
            }
        }
        let res = PersonIdentityToken._new2479(pits[ind].begin_token, pits[ind + 2].end_token, FioTemplateType.SURNAMENAMESECNAME);
        if (pits[ind + 2].middlename === null) {
            if ((ind + 2) === (pits.length - 1) && prev_has_this_typ) 
                res.coef += (1);
            else if (pits[ind + 1].firstname !== null && pits[ind + 2].firstname !== null) {
            }
            else if (!always) 
                return null;
        }
        res.coef -= (ind);
        if (pits[ind].is_newline_after) {
            if (pits[ind].is_newline_before && pits[ind + 2].is_newline_after) {
            }
            else {
                res.coef--;
                if (pits[ind].whitespaces_after_count > 15) 
                    res.coef--;
            }
        }
        if (pits[ind + 1].is_newline_after) {
            if (pits[ind].is_newline_before && pits[ind + 2].is_newline_after) {
            }
            else {
                res.coef--;
                if (pits[ind + 1].whitespaces_after_count > 15) 
                    res.coef--;
            }
        }
        res.morph = PersonIdentityToken.accord_morph(inf, pits[ind].lastname, pits[ind + 1].firstname, pits[ind + 2].middlename, pits[ind + 2].end_token.next);
        if (res.morph.gender === MorphGender.MASCULINE || res.morph.gender === MorphGender.FEMINIE) {
            res.coef += 1.5;
            inf = res.morph;
        }
        PersonIdentityToken.manage_lastname(res, pits[ind], inf);
        PersonIdentityToken.correct_coef_for_lastname(res, pits[ind]);
        PersonIdentityToken.manage_firstname(res, pits[ind + 1], inf);
        if (pits[ind + 2].middlename !== null && pits[ind + 2].middlename.vars.length > 0) {
            res.coef++;
            res.middlename = pits[ind + 2].middlename.vars[0].value;
            if (pits[ind + 2].middlename.vars.length > 1) {
                res.middlename = new PersonMorphCollection();
                PersonIdentityToken.set_value2(Utils.as(res.middlename, PersonMorphCollection), pits[ind + 2].middlename, inf);
            }
            if (pits[ind + 1].firstname !== null && pits.length === 3 && !pits[ind].is_in_dictionary) 
                res.coef++;
        }
        else 
            PersonIdentityToken.manage_middlename(res, pits[ind + 2], inf);
        if (CharsInfo.ooNoteq(pits[ind].chars, pits[ind + 1].chars) || CharsInfo.ooNoteq(pits[ind].chars, pits[ind + 2].chars)) {
            res.coef -= (1);
            if (pits[ind].chars.is_all_upper && pits[ind + 1].chars.is_capital_upper && pits[ind + 2].chars.is_capital_upper) 
                res.coef += (2);
        }
        let tt = Utils.as(pits[ind].begin_token, TextToken);
        if (tt !== null) {
            if (tt.is_value("УВАЖАЕМЫЙ", null) || tt.is_value("ДОРОГОЙ", null)) 
                res.coef -= (2);
        }
        PersonIdentityToken.correct_coef_after_name(res, pits, ind + 3);
        if (ind === 0) 
            PersonIdentityToken.correct_coefsns(res, pits, ind + 3);
        if (pits[ind].is_in_dictionary && pits[ind + 1].is_in_dictionary && pits[ind + 2].is_in_dictionary) 
            res.coef--;
        return res;
    }
    
    static correct_coef_after_name(res, pits, ind) {
        if (ind >= pits.length) 
            return;
        if (ind === 0) 
            return;
        if (pits[ind - 1].whitespaces_before_count > pits[ind - 1].whitespaces_after_count) 
            res.coef -= (1);
        else if (pits[ind - 1].whitespaces_before_count === pits[ind - 1].whitespaces_after_count) {
            if (pits[ind].lastname !== null || pits[ind].firstname !== null || pits[ind].middlename !== null) 
                res.coef -= (1);
        }
        let t = pits[ind - 1].end_token.next;
        if (t !== null && t.next !== null && t.next.is_char(',')) 
            t = t.next;
        if (t !== null) {
            if (PersonAttrToken.try_attach(t, null, PersonAttrTokenPersonAttrAttachAttrs.ONLYKEYWORD) !== null) 
                res.coef += (1);
        }
    }
    
    static _calc_coef_after(tt) {
        if (tt !== null && tt.is_comma) 
            tt = tt.next;
        let attr = PersonAttrToken.try_attach(tt, null, PersonAttrTokenPersonAttrAttachAttrs.ONLYKEYWORD);
        if (attr !== null && attr.age !== null) 
            return 3;
        if (tt !== null && tt.get_referent() !== null && tt.get_referent().type_name === "DATE") {
            let co = 1;
            if (tt.next !== null && tt.next.is_value("Р", null)) 
                co += (2);
            return co;
        }
        return 0;
    }
    
    static try_attach_surnameii(pits, ind, inf) {
        if ((ind + 1) >= pits.length || pits[ind + 1].typ !== PersonItemTokenItemType.INITIAL || pits[ind].typ === PersonItemTokenItemType.INITIAL) 
            return null;
        if (pits[ind].is_newline_after) 
            return null;
        if (pits[ind].lastname === null) 
            return null;
        let res = PersonIdentityToken._new2479(pits[ind].begin_token, pits[ind + 1].end_token, FioTemplateType.SURNAMEI);
        res.coef -= (ind);
        PersonIdentityToken.manage_lastname(res, pits[ind], inf);
        if (pits[ind].is_asian_item(false) && pits[ind].lastname !== null && pits[ind].lastname.is_china_surname) {
        }
        else if (pits[ind].firstname !== null && pits[ind].firstname.is_in_dictionary) {
            if (pits[ind].lastname === null || !pits[ind].lastname.is_lastname_has_std_tail) {
                if ((ind === 0 && pits.length === 3 && !pits[1].is_newline_after) && !pits[2].is_whitespace_after) {
                }
                else 
                    res.coef -= (2);
            }
        }
        res.morph = (pits[ind].lastname === null ? pits[ind].morph : pits[ind].lastname.morph);
        if (res.lastname.gender !== MorphGender.UNDEFINED) 
            res.morph.gender = res.lastname.gender;
        if (pits[ind].whitespaces_after_count < 2) 
            res.coef += (0.5);
        res.firstname = new PersonMorphCollection();
        res.firstname.add(pits[ind + 1].value, null, MorphGender.UNDEFINED, false);
        let i1 = ind + 2;
        if ((i1 < pits.length) && pits[i1].typ === PersonItemTokenItemType.INITIAL) {
            res.typ = FioTemplateType.SURNAMEII;
            res.end_token = pits[i1].end_token;
            res.middlename = pits[i1].value;
            if (pits[i1].whitespaces_before_count < 2) 
                res.coef += (0.5);
            i1++;
        }
        if (i1 >= pits.length) {
            if (pits[0].lastname !== null && ((pits[0].lastname.is_in_dictionary || pits[0].lastname.is_in_ontology)) && pits[0].firstname === null) 
                res.coef++;
            return res;
        }
        if (pits[ind].whitespaces_after_count > pits[i1].whitespaces_before_count) 
            res.coef--;
        else if (pits[ind].whitespaces_after_count === pits[i1].whitespaces_before_count && pits[i1].lastname !== null) {
            if ((i1 + 3) === pits.length && pits[i1 + 1].typ === PersonItemTokenItemType.INITIAL && pits[i1 + 2].typ === PersonItemTokenItemType.INITIAL) {
            }
            else {
                if (pits[i1].is_in_dictionary && pits[i1].begin_token.get_morph_class_in_dictionary().is_noun) {
                }
                else 
                    res.coef--;
                let ok = true;
                for (let tt = pits[ind].begin_token.previous; tt !== null; tt = tt.previous) {
                    if (tt.is_newline_before) 
                        break;
                    else if (tt.get_referent() !== null && !((tt.get_referent() instanceof PersonReferent))) {
                        ok = false;
                        break;
                    }
                    else if ((tt instanceof TextToken) && tt.chars.is_letter) {
                        ok = false;
                        break;
                    }
                }
                if (ok) 
                    res.coef++;
            }
        }
        return res;
    }
    
    static try_attachiisurname(pits, ind, inf) {
        if ((ind + 1) >= pits.length || pits[ind].typ !== PersonItemTokenItemType.INITIAL) 
            return null;
        if (ind > 0) {
            if (pits[ind - 1].typ === PersonItemTokenItemType.INITIAL) 
                return null;
        }
        if (pits[ind].is_newline_after) 
            return null;
        let res = PersonIdentityToken._new2479(pits[ind].begin_token, pits[ind + 1].end_token, FioTemplateType.ISURNAME);
        res.coef -= (ind);
        res.firstname = new PersonMorphCollection();
        res.firstname.add(pits[ind].value, null, MorphGender.UNDEFINED, false);
        let i1 = ind + 1;
        if (pits[i1].typ === PersonItemTokenItemType.INITIAL) {
            res.typ = FioTemplateType.IISURNAME;
            res.middlename = pits[i1].value;
            if (pits[i1].whitespaces_before_count < 2) 
                res.coef += (0.5);
            i1++;
        }
        if (i1 >= pits.length || pits[i1].typ !== PersonItemTokenItemType.VALUE) 
            return null;
        if (pits[i1].is_newline_before) 
            return null;
        res.end_token = pits[i1].end_token;
        let prev = null;
        if (!pits[ind].is_newline_before) {
            if (ind > 0) 
                prev = pits[ind - 1];
            else {
                prev = PersonItemToken.try_attach(pits[ind].begin_token.previous, null, (pits[i1].chars.is_latin_letter ? PersonItemTokenParseAttr.CANBELATIN : PersonItemTokenParseAttr.NO), null);
                if (prev !== null) {
                    if (PersonAttrToken.try_attach_word(prev.begin_token) !== null) {
                        prev = null;
                        res.coef++;
                    }
                }
            }
        }
        PersonIdentityToken.manage_lastname(res, pits[i1], inf);
        if (pits[i1].lastname !== null && pits[i1].lastname.is_in_ontology) 
            res.coef++;
        if (pits[i1].firstname !== null && pits[i1].firstname.is_in_dictionary) {
            if (pits[i1].lastname === null || ((!pits[i1].lastname.is_lastname_has_std_tail && !pits[i1].lastname.is_in_ontology))) 
                res.coef -= (2);
        }
        if (prev !== null) {
            let mc = prev.begin_token.get_morph_class_in_dictionary();
            if (mc.is_preposition || mc.is_adverb || mc.is_verb) {
                res.coef += (ind);
                if (pits[i1].lastname !== null) {
                    if (pits[i1].lastname.is_in_dictionary || pits[i1].lastname.is_in_ontology) 
                        res.coef += (1);
                }
            }
            if (prev.lastname !== null && ((prev.lastname.is_lastname_has_std_tail || prev.lastname.is_in_dictionary))) 
                res.coef -= (1);
        }
        res.morph = (pits[i1].lastname === null ? pits[i1].morph : pits[i1].lastname.morph);
        if (res.lastname.gender !== MorphGender.UNDEFINED) 
            res.morph.gender = res.lastname.gender;
        if (pits[i1].whitespaces_before_count < 2) {
            if (!pits[ind].is_newline_before && (pits[ind].whitespaces_before_count < 2) && prev !== null) {
            }
            else 
                res.coef += (0.5);
        }
        if (prev === null) {
            if (pits[ind].is_newline_before && pits[i1].is_newline_after) 
                res.coef += (1);
            else if (pits[i1].end_token.next !== null && ((pits[i1].end_token.next.is_char_of(";,.") || pits[i1].end_token.next.morph.class0.is_conjunction))) 
                res.coef += (1);
            return res;
        }
        if (prev.whitespaces_after_count < pits[i1].whitespaces_before_count) 
            res.coef--;
        else if (prev.whitespaces_after_count === pits[i1].whitespaces_before_count && prev.lastname !== null) 
            res.coef--;
        return res;
    }
    
    static try_attach_king(pits, ind, inf, prev_has_this_typ = false) {
        if (ind > 0 || ind >= pits.length) 
            return null;
        if (pits[0].firstname === null || pits[0].is_newline_after) 
            return null;
        if (pits[0].begin_token.is_value("ТОМ", null)) 
            return null;
        let i = 0;
        if (pits.length > 1 && ((pits[1].firstname !== null || pits[1].middlename !== null))) 
            i++;
        if (pits[i].is_newline_after) 
            return null;
        if (pits[i].end_token.whitespaces_after_count > 2) 
            return null;
        let num = 0;
        let roman = false;
        let ok = false;
        let t = pits[i].end_token.next;
        if (t instanceof NumberToken) {
            if (t.chars.is_all_lower || (t).int_value === null) 
                return null;
            num = (t).int_value;
            if (!t.morph.class0.is_adjective) 
                return null;
        }
        else {
            if (((i + 2) < pits.length) && pits[i + 1].typ === PersonItemTokenItemType.INITIAL) 
                return null;
            let nt = NumberHelper.try_parse_roman(t);
            if (nt !== null && nt.int_value !== null) {
                num = nt.int_value;
                roman = true;
                t = nt.end_token;
            }
        }
        if (num < 1) {
            if (pits[0].firstname !== null && prev_has_this_typ) {
                if (pits.length === 1) 
                    ok = true;
                else if (pits.length === 2 && pits[0].end_token.next.is_hiphen) 
                    ok = true;
            }
            if (!ok) 
                return null;
        }
        let res = PersonIdentityToken._new2479(pits[0].begin_token, pits[0].end_token, FioTemplateType.KING);
        res.morph = PersonIdentityToken.accord_morph(inf, null, pits[0].firstname, (pits.length === 2 ? ((pits[1].middlename != null ? pits[1].middlename : pits[1].firstname)) : null), pits[(pits.length === 2 ? 1 : 0)].end_token.next);
        if (res.morph.gender === MorphGender.MASCULINE || res.morph.gender === MorphGender.FEMINIE) 
            inf = res.morph;
        if (inf.gender !== MorphGender.FEMINIE && inf.gender !== MorphGender.MASCULINE && !roman) 
            return null;
        PersonIdentityToken.manage_firstname(res, pits[0], inf);
        if (num > 0) {
            res.lastname = new PersonMorphCollection();
            res.lastname.number = num;
            res.end_token = t;
        }
        if (i > 0) {
            PersonIdentityToken.manage_middlename(res, pits[1], inf);
            res.end_token = pits[1].end_token;
        }
        res.coef = (num > 0 ? 3 : 2);
        return res;
    }
    
    static try_attach_asian(pits, ind, inf, cou, prev_has_this_typ = false) {
        if (ind > 0 || ind >= pits.length || ((pits.length !== cou && pits.length !== (cou * 2)))) 
            return null;
        if (pits[0].lastname !== null && pits[0].lastname.is_china_surname && pits[0].chars.is_capital_upper) {
            if (cou === 3) {
                if (!pits[1].is_asian_item(false)) 
                    return null;
                if (!pits[2].is_asian_item(true)) 
                    return null;
            }
            else if (cou === 2) {
                if (pits[1].typ !== PersonItemTokenItemType.VALUE) 
                    return null;
            }
        }
        else if (cou === 3) {
            if (!pits[0].is_asian_item(false)) 
                return null;
            if (!pits[1].is_asian_item(false)) 
                return null;
            if (!pits[2].is_asian_item(true)) 
                return null;
        }
        else {
            if (!pits[0].is_asian_item(false)) 
                return null;
            if (!pits[1].is_asian_item(true)) 
                return null;
        }
        cou--;
        let is_chine_sur = pits[0].lastname !== null && pits[0].lastname.is_china_surname;
        let res = PersonIdentityToken._new2479(pits[0].begin_token, pits[cou].end_token, FioTemplateType.ASIANNAME);
        if (pits[cou].lastname !== null) 
            res.morph = PersonIdentityToken.accord_morph(inf, pits[cou].lastname, null, null, pits[cou].end_token.next);
        if (!res.morph._case.is_undefined) 
            inf = res.morph;
        if (is_chine_sur) {
            res.typ = FioTemplateType.ASIANSURNAMENAME;
            res.coef = 2;
            if (pits[1].is_asian_item(true)) 
                res.coef += (1);
            PersonIdentityToken.manage_lastname(res, pits[0], inf);
            let tr = PersonReferent._del_surname_end(pits[0].value);
            if (tr !== pits[0].value) 
                res.lastname.add(tr, null, MorphGender.MASCULINE, false);
            res.firstname = new PersonMorphCollection();
            let pref = (cou === 2 ? pits[1].value : "");
            if (pits[cou].is_asian_item(false)) {
                res.firstname.add(pref + pits[cou].value, null, MorphGender.MASCULINE, false);
                res.firstname.add(pref + pits[cou].value, null, MorphGender.FEMINIE, false);
                if (pref.length > 0) {
                    res.firstname.add(pref + "-" + pits[cou].value, null, MorphGender.MASCULINE, false);
                    res.firstname.add(pref + "-" + pits[cou].value, null, MorphGender.FEMINIE, false);
                }
            }
            else {
                let v = PersonReferent._del_surname_end(pits[cou].value);
                res.firstname.add(pref + v, null, MorphGender.MASCULINE, false);
                if (pref.length > 0) 
                    res.firstname.add(pref + "-" + v, null, MorphGender.MASCULINE, false);
                let ss = pits[cou].end_token.get_normal_case_text(MorphClass.NOUN, false, MorphGender.UNDEFINED, false);
                if (ss !== v && ss.length <= v.length) {
                    res.firstname.add(pref + ss, null, MorphGender.MASCULINE, false);
                    if (pref.length > 0) 
                        res.firstname.add(pref + "-" + ss, null, MorphGender.MASCULINE, false);
                }
                inf.gender = MorphGender.MASCULINE;
            }
        }
        else {
            if (inf.gender === MorphGender.MASCULINE) 
                PersonIdentityToken.manage_lastname(res, pits[cou], inf);
            else {
                res.lastname = new PersonMorphCollection();
                if (pits[cou].is_asian_item(false)) {
                    res.lastname.add(pits[cou].value, null, MorphGender.MASCULINE, false);
                    res.lastname.add(pits[cou].value, null, MorphGender.FEMINIE, false);
                }
                else {
                    let v = PersonReferent._del_surname_end(pits[cou].value);
                    res.lastname.add(v, null, MorphGender.MASCULINE, false);
                    let ss = pits[cou].end_token.get_normal_case_text(MorphClass.NOUN, false, MorphGender.UNDEFINED, false);
                    if (ss !== v && ss.length <= v.length) 
                        res.lastname.add(ss, null, MorphGender.MASCULINE, false);
                    inf.gender = MorphGender.MASCULINE;
                }
            }
            if (cou === 2) {
                res.coef = 2;
                if ((res.whitespaces_after_count < 2) && pits.length > 3) 
                    res.coef--;
                res.lastname.add_prefix_str((pits[0].value + " " + pits[1].value + " "));
            }
            else {
                res.coef = 1;
                res.lastname.add_prefix_str(pits[0].value + " ");
            }
            for (let i = 0; i < pits.length; i++) {
                if (pits[i].is_in_dictionary) {
                    let mc = pits[i].begin_token.get_morph_class_in_dictionary();
                    if ((mc.is_conjunction || mc.is_pronoun || mc.is_preposition) || mc.is_personal_pronoun) 
                        res.coef -= 0.5;
                }
            }
        }
        if (pits[0].value === pits[1].value) 
            res.coef -= 0.5;
        if (cou === 2) {
            if (pits[0].value === pits[2].value) 
                res.coef -= 0.5;
            if (pits[1].value === pits[2].value) 
                res.coef -= 0.5;
        }
        if (!pits[cou].is_whitespace_after) {
            let t = pits[cou].end_token.next;
            if (t !== null && t.is_hiphen) 
                res.coef -= 0.5;
            if (BracketHelper.can_be_end_of_sequence(t, false, null, false)) 
                res.coef -= 0.5;
        }
        if (BracketHelper.can_be_start_of_sequence(pits[0].begin_token.previous, false, false)) 
            res.coef -= 0.5;
        return res;
    }
    
    static try_attach_identity(pits, inf) {
        if (pits.length === 1) {
            if (pits[0].typ !== PersonItemTokenItemType.REFERENT) 
                return null;
        }
        else {
            if (pits.length !== 2 && pits.length !== 3) 
                return null;
            for (const p of pits) {
                if (p.typ !== PersonItemTokenItemType.VALUE) 
                    return null;
                if (CharsInfo.ooNoteq(p.chars, pits[0].chars)) 
                    return null;
            }
        }
        let begin = Utils.as(pits[0].begin_token, TextToken);
        let end = Utils.as(pits[pits.length - 1].end_token, TextToken);
        if (begin === null || end === null) 
            return null;
        let res = new PersonIdentityToken(begin, end);
        res.lastname = new PersonMorphCollection();
        let s = MiscHelper.get_text_value(begin, end, GetTextAttr.NO);
        if (s.length > 100) 
            return null;
        let tmp = new StringBuilder();
        for (let t = begin; t !== null && t.previous !== end; t = t.next) {
            let tt = Utils.as(t, TextToken);
            if (tt === null) 
                continue;
            if (tt.is_hiphen) {
                tmp.append('-');
                continue;
            }
            if (tmp.length > 0) {
                if (tmp.charAt(tmp.length - 1) !== '-') 
                    tmp.append(' ');
            }
            if (tt.length_char < 3) {
                tmp.append(tt.term);
                continue;
            }
            let sss = tt.term;
            for (const wff of tt.morph.items) {
                let wf = Utils.as(wff, MorphWordForm);
                if (wf !== null && wf.normal_case !== null && (wf.normal_case.length < sss.length)) 
                    sss = wf.normal_case;
            }
            tmp.append(sss);
        }
        let ss = tmp.toString();
        if (inf._case.is_nominative) {
            res.lastname.add(s, null, MorphGender.UNDEFINED, false);
            if (s !== ss) 
                res.lastname.add(ss, null, MorphGender.UNDEFINED, false);
        }
        else {
            if (s !== ss) 
                res.lastname.add(ss, null, MorphGender.UNDEFINED, false);
            res.lastname.add(s, null, MorphGender.UNDEFINED, false);
        }
        for (const p of pits) {
            if (p !== pits[0]) {
                if (p.is_newline_before) 
                    res.coef -= (1);
                else if (p.whitespaces_before_count > 1) 
                    res.coef -= (0.5);
            }
            res.coef += (0.5);
            if (p.length_char > 4) {
                if (p.is_in_dictionary) 
                    res.coef -= (1.5);
                if (p.lastname !== null && ((p.lastname.is_in_dictionary || p.lastname.is_in_ontology))) 
                    res.coef -= (1);
                if (p.firstname !== null && p.firstname.is_in_dictionary) 
                    res.coef -= (1);
                if (p.middlename !== null) 
                    res.coef -= (1);
                if (p.chars.is_all_upper) 
                    res.coef -= (0.5);
            }
            else if (p.chars.is_all_upper) 
                res.coef -= (1);
        }
        if (pits.length === 2 && pits[1].lastname !== null && ((pits[1].lastname.is_lastname_has_std_tail || pits[1].lastname.is_in_dictionary))) 
            res.coef -= 0.5;
        return res;
    }
    
    static try_attach_global(pits, ind, inf) {
        if (ind > 0 || pits[0].typ !== PersonItemTokenItemType.VALUE) 
            return null;
        if ((pits.length === 4 && pits[0].value === "АУН" && pits[1].value === "САН") && pits[2].value === "СУ" && pits[3].value === "ЧЖИ") {
            let res = new PersonIdentityToken(pits[0].begin_token, pits[3].end_token);
            res.ontology_person = new PersonReferent();
            res.ontology_person.add_slot(PersonReferent.ATTR_IDENTITY, "АУН САН СУ ЧЖИ", false, 0);
            res.ontology_person.is_female = true;
            res.coef = 10;
            return res;
        }
        if (pits.length === 2 && pits[0].firstname !== null && pits[0].firstname.is_in_dictionary) {
            if (pits[0].begin_token.is_value("ИВАН", null) && pits[1].begin_token.is_value("ГРОЗНЫЙ", null)) {
                let res = new PersonIdentityToken(pits[0].begin_token, pits[1].end_token);
                res.ontology_person = new PersonReferent();
                res.ontology_person.add_slot(PersonReferent.ATTR_FIRSTNAME, "ИВАН", false, 0);
                res.ontology_person.add_slot(PersonReferent.ATTR_NICKNAME, "ГРОЗНЫЙ", false, 0);
                res.ontology_person.is_male = true;
                res.coef = 10;
                return res;
            }
            if (pits[0].begin_token.is_value("ЮРИЙ", null) && pits[1].begin_token.is_value("ДОЛГОРУКИЙ", null)) {
                let res = new PersonIdentityToken(pits[0].begin_token, pits[1].end_token);
                res.ontology_person = new PersonReferent();
                res.ontology_person.add_slot(PersonReferent.ATTR_FIRSTNAME, "ЮРИЙ", false, 0);
                res.ontology_person.add_slot(PersonReferent.ATTR_NICKNAME, "ДОЛГОРУКИЙ", false, 0);
                res.ontology_person.is_male = true;
                res.coef = 10;
                return res;
            }
            if (pits[1].begin_token.is_value("ВЕЛИКИЙ", null)) {
                let res = new PersonIdentityToken(pits[0].begin_token, pits[1].end_token);
                res.ontology_person = new PersonReferent();
                if (pits[0].firstname.morph.gender === MorphGender.FEMINIE) 
                    res.ontology_person.is_female = true;
                else if (pits[0].firstname.morph.gender === MorphGender.MASCULINE || (((pits[1].morph.gender.value()) & (MorphGender.MASCULINE.value()))) !== (MorphGender.UNDEFINED.value())) 
                    res.ontology_person.is_male = true;
                else 
                    return null;
                PersonIdentityToken.manage_firstname(res, pits[0], pits[1].morph);
                res.ontology_person.add_fio_identity(null, res.firstname, null);
                res.ontology_person.add_slot(PersonReferent.ATTR_NICKNAME, (res.ontology_person.is_male ? "ВЕЛИКИЙ" : "ВЕЛИКАЯ"), false, 0);
                res.coef = 10;
                return res;
            }
            if (pits[1].begin_token.is_value("СВЯТОЙ", null)) {
                let res = new PersonIdentityToken(pits[0].begin_token, pits[1].end_token);
                res.ontology_person = new PersonReferent();
                if (pits[0].firstname.morph.gender === MorphGender.FEMINIE) 
                    res.ontology_person.is_female = true;
                else if (pits[0].firstname.morph.gender === MorphGender.MASCULINE || (((pits[1].morph.gender.value()) & (MorphGender.MASCULINE.value()))) !== (MorphGender.UNDEFINED.value())) 
                    res.ontology_person.is_male = true;
                else 
                    return null;
                PersonIdentityToken.manage_firstname(res, pits[0], pits[1].morph);
                res.ontology_person.add_fio_identity(null, res.firstname, null);
                res.ontology_person.add_slot(PersonReferent.ATTR_NICKNAME, (res.ontology_person.is_male ? "СВЯТОЙ" : "СВЯТАЯ"), false, 0);
                res.coef = 10;
                return res;
            }
            if (pits[1].begin_token.is_value("ПРЕПОДОБНЫЙ", null)) {
                let res = new PersonIdentityToken(pits[0].begin_token, pits[1].end_token);
                res.ontology_person = new PersonReferent();
                if (pits[0].firstname.morph.gender === MorphGender.FEMINIE) 
                    res.ontology_person.is_female = true;
                else if (pits[0].firstname.morph.gender === MorphGender.MASCULINE || (((pits[1].morph.gender.value()) & (MorphGender.MASCULINE.value()))) !== (MorphGender.UNDEFINED.value())) 
                    res.ontology_person.is_male = true;
                else 
                    return null;
                PersonIdentityToken.manage_firstname(res, pits[0], pits[1].morph);
                res.ontology_person.add_fio_identity(null, res.firstname, null);
                res.ontology_person.add_slot(PersonReferent.ATTR_NICKNAME, (res.ontology_person.is_male ? "ПРЕПОДОБНЫЙ" : "ПРЕПОДОБНАЯ"), false, 0);
                res.coef = 10;
                return res;
            }
            if (pits[1].begin_token.is_value("БЛАЖЕННЫЙ", null)) {
                let res = new PersonIdentityToken(pits[0].begin_token, pits[1].end_token);
                res.ontology_person = new PersonReferent();
                if (pits[0].firstname.morph.gender === MorphGender.FEMINIE) 
                    res.ontology_person.is_female = true;
                else if (pits[0].firstname.morph.gender === MorphGender.MASCULINE || (((pits[1].morph.gender.value()) & (MorphGender.MASCULINE.value()))) !== (MorphGender.UNDEFINED.value())) 
                    res.ontology_person.is_male = true;
                else 
                    return null;
                PersonIdentityToken.manage_firstname(res, pits[0], pits[1].morph);
                res.ontology_person.add_fio_identity(null, res.firstname, null);
                res.ontology_person.add_slot(PersonReferent.ATTR_NICKNAME, (res.ontology_person.is_male ? "БЛАЖЕННЫЙ" : "БЛАЖЕННАЯ"), false, 0);
                res.coef = 10;
                return res;
            }
        }
        if (pits.length === 2 && pits[1].firstname !== null && pits[1].firstname.is_in_dictionary) {
            if (pits[0].begin_token.is_value("СВЯТОЙ", null)) {
                let res = new PersonIdentityToken(pits[0].begin_token, pits[1].end_token);
                res.ontology_person = new PersonReferent();
                if (pits[1].firstname.morph.gender === MorphGender.FEMINIE || pits[0].morph.gender === MorphGender.FEMINIE) 
                    res.ontology_person.is_female = true;
                else if (pits[1].firstname.morph.gender === MorphGender.MASCULINE || (((pits[0].morph.gender.value()) & (MorphGender.MASCULINE.value()))) !== (MorphGender.UNDEFINED.value())) 
                    res.ontology_person.is_male = true;
                else 
                    return null;
                PersonIdentityToken.manage_firstname(res, pits[1], pits[0].morph);
                res.ontology_person.add_fio_identity(null, res.firstname, null);
                res.ontology_person.add_slot(PersonReferent.ATTR_NICKNAME, (res.ontology_person.is_male ? "СВЯТОЙ" : "СВЯТАЯ"), false, 0);
                res.coef = 10;
                return res;
            }
            if (pits[0].begin_token.is_value("ПРЕПОДОБНЫЙ", null)) {
                let res = new PersonIdentityToken(pits[0].begin_token, pits[1].end_token);
                res.ontology_person = new PersonReferent();
                if (pits[1].firstname.morph.gender === MorphGender.FEMINIE) 
                    res.ontology_person.is_female = true;
                else if (pits[1].firstname.morph.gender === MorphGender.MASCULINE || (((pits[0].morph.gender.value()) & (MorphGender.MASCULINE.value()))) !== (MorphGender.UNDEFINED.value())) 
                    res.ontology_person.is_male = true;
                else 
                    return null;
                PersonIdentityToken.manage_firstname(res, pits[1], pits[0].morph);
                res.ontology_person.add_fio_identity(null, res.firstname, null);
                res.ontology_person.add_slot(PersonReferent.ATTR_NICKNAME, (res.ontology_person.is_male ? "ПРЕПОДОБНЫЙ" : "ПРЕПОДОБНАЯ"), false, 0);
                res.coef = 10;
                return res;
            }
            if (pits[0].begin_token.is_value("БЛАЖЕННЫЙ", null)) {
                let res = new PersonIdentityToken(pits[0].begin_token, pits[1].end_token);
                res.ontology_person = new PersonReferent();
                if (pits[1].firstname.morph.gender === MorphGender.FEMINIE) 
                    res.ontology_person.is_female = true;
                else if (pits[1].firstname.morph.gender === MorphGender.MASCULINE || (((pits[0].morph.gender.value()) & (MorphGender.MASCULINE.value()))) !== (MorphGender.UNDEFINED.value())) 
                    res.ontology_person.is_male = true;
                else 
                    return null;
                PersonIdentityToken.manage_firstname(res, pits[1], pits[0].morph);
                res.ontology_person.add_fio_identity(null, res.firstname, null);
                res.ontology_person.add_slot(PersonReferent.ATTR_NICKNAME, (res.ontology_person.is_male ? "БЛАЖЕННЫЙ" : "БЛАЖЕННАЯ"), false, 0);
                res.coef = 10;
                return res;
            }
        }
        return null;
    }
    
    static accord_morph(inf, p1, p2, p3, _next) {
        let res = new MorphCollection();
        let pp = new Array();
        if (p1 !== null) 
            pp.push(p1);
        if (p2 !== null) 
            pp.push(p2);
        if (p3 !== null) 
            pp.push(p3);
        if (pp.length === 0) 
            return res;
        if (inf !== null && p1 !== null && ((p1.is_lastname_has_std_tail || p1.is_in_dictionary))) {
            if ((MorphCase.ooBitand(inf._case, p1.morph._case)).is_undefined) 
                inf = null;
        }
        if (inf !== null && p2 !== null && p2.is_in_dictionary) {
            if ((MorphCase.ooBitand(inf._case, p2.morph._case)).is_undefined) 
                inf = null;
        }
        for (let i = 0; i < 2; i++) {
            let g = (i === 0 ? MorphGender.MASCULINE : MorphGender.FEMINIE);
            if (inf !== null && inf.gender !== MorphGender.UNDEFINED && (((inf.gender.value()) & (g.value()))) === (MorphGender.UNDEFINED.value())) 
                continue;
            let cas = MorphCase.ALL_CASES;
            for (const p of pp) {
                let ca = new MorphCase();
                for (const v of p.vars) {
                    if (v.gender !== MorphGender.UNDEFINED) {
                        if ((((v.gender.value()) & (g.value()))) === (MorphGender.UNDEFINED.value())) 
                            continue;
                    }
                    if (inf !== null && !inf._case.is_undefined && !v._case.is_undefined) {
                        if ((MorphCase.ooBitand(inf._case, v._case)).is_undefined) 
                            continue;
                    }
                    if (!v._case.is_undefined) 
                        ca = MorphCase.ooBitor(ca, v._case);
                    else 
                        ca = MorphCase.ALL_CASES;
                }
                cas = MorphCase.ooBitand(cas, ca);
            }
            if (!cas.is_undefined) {
                if (inf !== null && !inf._case.is_undefined && !(MorphCase.ooBitand(inf._case, cas)).is_undefined) 
                    cas = MorphCase.ooBitand(cas, inf._case);
                res.add_item(MorphBaseInfo._new2492(g, cas));
            }
        }
        let verb_gend = MorphGender.UNDEFINED;
        if ((_next !== null && (_next instanceof TextToken) && _next.chars.is_all_lower) && MorphClass.ooEq(_next.morph.class0, MorphClass.VERB) && _next.morph.number === MorphNumber.SINGULAR) {
            if (_next.morph.gender === MorphGender.FEMINIE || _next.morph.gender === MorphGender.MASCULINE) {
                verb_gend = _next.morph.gender;
                let npt = NounPhraseHelper.try_parse(_next.next, NounPhraseParseAttr.NO, 0, null);
                if ((npt !== null && npt.morph._case.is_nominative && npt.morph.gender === verb_gend) && npt.morph.number === MorphNumber.SINGULAR) 
                    verb_gend = MorphGender.UNDEFINED;
            }
        }
        if (verb_gend !== MorphGender.UNDEFINED && res.items_count > 1) {
            let cou = 0;
            for (const it of res.items) {
                if (it._case.is_nominative && it.gender === verb_gend) 
                    cou++;
            }
            if (cou === 1) {
                for (let i = res.items_count - 1; i >= 0; i--) {
                    if (!res.get_indexer_item(i)._case.is_nominative || res.get_indexer_item(i).gender !== verb_gend) 
                        res.remove_item(i);
                }
            }
        }
        return res;
    }
    
    static is_accords(mt, inf) {
        if (inf === null) 
            return true;
        if (mt.vars.length === 0) 
            return true;
        for (const wf of mt.vars) {
            let ok = true;
            if (!inf._case.is_undefined && !wf._case.is_undefined) {
                if ((MorphCase.ooBitand(wf._case, inf._case)).is_undefined) 
                    ok = false;
            }
            if (inf.gender !== MorphGender.UNDEFINED && wf.gender !== MorphGender.UNDEFINED) {
                if ((((inf.gender.value()) & (wf.gender.value()))) === (MorphGender.UNDEFINED.value())) 
                    ok = false;
            }
            if (ok) 
                return true;
        }
        return false;
    }
    
    static is_both_surnames(p1, p2) {
        if (p1 === null || p2 === null) 
            return false;
        if (p1.lastname === null || p2.lastname === null) 
            return false;
        if (!p1.lastname.is_in_dictionary && !p1.lastname.is_in_ontology && !p1.lastname.is_lastname_has_std_tail) 
            return false;
        if (p1.firstname !== null || p2.middlename !== null) 
            return false;
        if (!p2.lastname.is_in_dictionary && !p2.lastname.is_in_ontology && !p2.lastname.is_lastname_has_std_tail) 
            return false;
        if (p2.firstname !== null || p2.middlename !== null) 
            return false;
        if (!((p1.end_token instanceof TextToken)) || !((p2.end_token instanceof TextToken))) 
            return false;
        let v1 = (p1.end_token).term;
        let v2 = (p2.end_token).term;
        if (v1[v1.length - 1] === v2[v2.length - 1]) 
            return false;
        return true;
    }
    
    static get_value(mt, inf) {
        for (const wf of mt.vars) {
            if (inf !== null) {
                if (!inf._case.is_undefined && !wf._case.is_undefined) {
                    if ((MorphCase.ooBitand(wf._case, inf._case)).is_undefined) 
                        continue;
                }
                if (inf.gender !== MorphGender.UNDEFINED && wf.gender !== MorphGender.UNDEFINED) {
                    if ((((inf.gender.value()) & (wf.gender.value()))) === (MorphGender.UNDEFINED.value())) 
                        continue;
                }
            }
            return wf.value;
        }
        return mt.term;
    }
    
    static set_value2(res, mt, inf) {
        let ok = false;
        for (const wf of mt.vars) {
            if (inf !== null) {
                if (!inf._case.is_undefined && !wf._case.is_undefined) {
                    if ((MorphCase.ooBitand(wf._case, inf._case)).is_undefined) 
                        continue;
                }
                if (inf.gender !== MorphGender.UNDEFINED && wf.gender !== MorphGender.UNDEFINED) {
                    if ((((inf.gender.value()) & (wf.gender.value()))) === (MorphGender.UNDEFINED.value())) 
                        continue;
                }
                ok = true;
            }
            res.add(wf.value, wf.short_value, wf.gender, false);
        }
        if (res.values.length === 0) {
            if ((inf !== null && !inf._case.is_undefined && mt.vars.length > 0) && mt.is_lastname_has_std_tail) {
                for (const wf of mt.vars) {
                    res.add(wf.value, wf.short_value, wf.gender, false);
                }
            }
            res.add(mt.term, null, inf.gender, false);
        }
    }
    
    static set_value(res, t, inf) {
        let tt = Utils.as(t, TextToken);
        if (tt === null && (t instanceof MetaToken) && (t).begin_token === (t).end_token) 
            tt = Utils.as((t).begin_token, TextToken);
        if (tt === null) 
            return;
        for (const wf of tt.morph.items) {
            if (wf.class0.is_verb) 
                continue;
            if (wf.contains_attr("к.ф.", null)) 
                continue;
            if (inf !== null && inf.gender !== MorphGender.UNDEFINED && wf.gender !== MorphGender.UNDEFINED) {
                if ((((wf.gender.value()) & (inf.gender.value()))) === (MorphGender.UNDEFINED.value())) 
                    continue;
            }
            if (inf !== null && !inf._case.is_undefined && !wf._case.is_undefined) {
                if ((MorphCase.ooBitand(wf._case, inf._case)).is_undefined) 
                    continue;
            }
            let str = (t.chars.is_latin_letter ? tt.term : (wf).normal_case);
            res.add(str, null, wf.gender, false);
        }
        res.add(tt.term, null, (inf === null ? MorphGender.UNDEFINED : inf.gender), false);
    }
    
    static correctxfml(pli0, pli1, attrs) {
        let p0 = null;
        let p1 = null;
        for (const p of pli0) {
            if (p.typ === FioTemplateType.SURNAMENAMESECNAME) {
                p0 = p;
                break;
            }
        }
        for (const p of pli1) {
            if (p.typ === FioTemplateType.NAMESECNAMESURNAME) {
                p1 = p;
                break;
            }
        }
        if (p0 === null || p1 === null) {
            for (const p of pli0) {
                if (p.typ === FioTemplateType.SURNAMENAME) {
                    p0 = p;
                    break;
                }
            }
            for (const p of pli1) {
                if (p.typ === FioTemplateType.NAMESURNAME) {
                    p1 = p;
                    break;
                }
            }
        }
        if (p0 === null || p1 === null) 
            return false;
        if (p1.coef > p0.coef) 
            return false;
        for (let tt = p1.begin_token; tt !== p1.end_token; tt = tt.next) {
            if (tt.is_newline_after) 
                return false;
        }
        if (!p1.end_token.is_newline_after) {
            if (PersonItemToken.try_attach(p1.end_token.next, null, PersonItemTokenParseAttr.NO, null) !== null) 
                return false;
        }
        if (p0.lastname === null || p1.lastname === null) 
            return false;
        if (p1.lastname.has_lastname_standard_tail) {
            if (!p0.lastname.has_lastname_standard_tail) {
                p1.coef = p0.coef + (0.1);
                return true;
            }
        }
        if (attrs === null || attrs.length === 0) {
            if (!p1.lastname.has_lastname_standard_tail && p0.lastname.has_lastname_standard_tail) 
                return false;
        }
        let t = p1.end_token.next;
        if (t !== null && !t.chars.is_capital_upper && !t.chars.is_all_upper) {
            let npt = NounPhraseHelper.try_parse(p1.end_token, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null && npt.end_token !== npt.begin_token) 
                return false;
            let cl1 = p0.begin_token.get_morph_class_in_dictionary();
            let cl2 = p1.end_token.get_morph_class_in_dictionary();
            if (cl2.is_noun && !cl1.is_noun) 
                return false;
            p1.coef = p0.coef + (0.1);
            return true;
        }
        return false;
    }
    
    static check_latin_after(pit) {
        if (pit === null) 
            return null;
        let t = pit.end_token.next;
        if (t === null || !t.is_char('(')) 
            return null;
        t = t.next;
        let p1 = PersonItemToken.try_attach_latin(t);
        if (p1 === null) 
            return null;
        let p2 = PersonItemToken.try_attach_latin(p1.end_token.next);
        if (p2 === null) 
            return null;
        if (p2.end_token.next === null) 
            return null;
        let p3 = null;
        let et = p2.end_token.next;
        if (p2.end_token.next.is_char(')')) {
        }
        else {
            p3 = PersonItemToken.try_attach_latin(et);
            if (p3 === null) 
                return null;
            et = p3.end_token.next;
            if (et === null || !et.is_char(')')) 
                return null;
        }
        let sur = null;
        let nam = null;
        let sec = null;
        if (pit.typ === FioTemplateType.NAMESURNAME && pit.firstname !== null && pit.lastname !== null) {
            let eq = 0;
            if (p1.typ === PersonItemTokenItemType.VALUE) {
                if (pit.firstname.check_latin_variant(p1.value)) 
                    eq++;
                nam = p1;
                if (p2.typ === PersonItemTokenItemType.VALUE && p3 === null) {
                    sur = p2;
                    if (pit.lastname.check_latin_variant(p2.value)) 
                        eq++;
                }
                else if (p2.typ === PersonItemTokenItemType.INITIAL && p3 !== null) {
                    if (pit.lastname.check_latin_variant(p3.value)) 
                        eq++;
                    sur = p3;
                }
            }
            if (eq === 0) 
                return null;
        }
        else if ((pit.typ === FioTemplateType.NAMESECNAMESURNAME && pit.firstname !== null && pit.middlename !== null) && pit.lastname !== null && p3 !== null) {
            let eq = 0;
            if (p1.typ === PersonItemTokenItemType.VALUE) {
                if (pit.firstname.check_latin_variant(p1.value)) 
                    eq++;
                nam = p1;
                if (p2.typ === PersonItemTokenItemType.VALUE) {
                    sec = p2;
                    if (pit.middlename instanceof PersonMorphCollection) {
                        if ((pit.middlename).check_latin_variant(p2.value)) 
                            eq++;
                    }
                }
                if (p3.typ === PersonItemTokenItemType.VALUE) {
                    sur = p3;
                    if (pit.lastname.check_latin_variant(p3.value)) 
                        eq++;
                }
            }
            if (eq === 0) 
                return null;
        }
        if (nam === null || sur === null) 
            return null;
        let res = PersonIdentityToken._new2479(t, et, pit.typ);
        res.lastname = new PersonMorphCollection();
        res.lastname.add(sur.value, null, MorphGender.UNDEFINED, false);
        res.firstname = new PersonMorphCollection();
        res.firstname.add(nam.value, null, MorphGender.UNDEFINED, false);
        if (sec !== null) {
            res.middlename = new PersonMorphCollection();
            (res.middlename).add(sec.value, null, MorphGender.UNDEFINED, false);
        }
        return res;
    }
    
    static _new2479(_arg1, _arg2, _arg3) {
        let res = new PersonIdentityToken(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
}


module.exports = PersonIdentityToken
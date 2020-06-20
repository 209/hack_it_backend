/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");

const MorphClass = require("./../../morph/MorphClass");
const MorphGender = require("./../../morph/MorphGender");
const MorphCase = require("./../../morph/MorphCase");
const MorphNumber = require("./../../morph/MorphNumber");
const MorphBaseInfo = require("./../../morph/MorphBaseInfo");
const MorphCollection = require("./../MorphCollection");
const PersonItemTokenParseAttr = require("./internal/PersonItemTokenParseAttr");
const Morphology = require("./../../morph/Morphology");
const BracketHelper = require("./../core/BracketHelper");
const BracketParseAttr = require("./../core/BracketParseAttr");
const LanguageHelper = require("./../../morph/LanguageHelper");
const TextToken = require("./../TextToken");
const ProcessorService = require("./../ProcessorService");
const ShortNameHelper = require("./internal/ShortNameHelper");
const Termin = require("./../core/Termin");
const PersonMorphCollection = require("./internal/PersonMorphCollection");
const FioTemplateType = require("./internal/FioTemplateType");
const PersonPropertyKind = require("./PersonPropertyKind");
const EpNerCoreInternalResourceHelper = require("./../core/internal/EpNerCoreInternalResourceHelper");
const ReferentToken = require("./../ReferentToken");
const ReferentEqualType = require("./../ReferentEqualType");
const MetaPersonIdentity = require("./internal/MetaPersonIdentity");
const MetaPerson = require("./internal/MetaPerson");
const MailLine = require("./../mail/internal/MailLine");
const MetaPersonProperty = require("./internal/MetaPersonProperty");
const Referent = require("./../Referent");
const Token = require("./../Token");
const MiscHelper = require("./../core/MiscHelper");
const PersonAttrTerminType = require("./internal/PersonAttrTerminType");
const PersonAttrTokenPersonAttrAttachAttrs = require("./internal/PersonAttrTokenPersonAttrAttachAttrs");
const PersonItemToken = require("./internal/PersonItemToken");
const PersonPropertyReferent = require("./PersonPropertyReferent");
const AnalyzerData = require("./../core/AnalyzerData");
const Analyzer = require("./../Analyzer");
const MetaToken = require("./../MetaToken");
const AnalyzerDataWithOntology = require("./../core/AnalyzerDataWithOntology");
const PersonReferent = require("./PersonReferent");
const PersonIdentityReferent = require("./PersonIdentityReferent");

/**
 * Анализатор выделения персон
 */
class PersonAnalyzer extends Analyzer {
    
    constructor() {
        super();
        this.nominative_case_always = false;
        this.text_starts_with_lastname_firstname_middlename = false;
        this.m_level = 0;
    }
    
    get name() {
        return PersonAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Персоны";
    }
    
    get description() {
        return "Персоны и их атрибуты";
    }
    
    clone() {
        return new PersonAnalyzer();
    }
    
    get type_system() {
        return [MetaPerson.global_meta, MetaPersonProperty.global_meta, MetaPersonIdentity.global_meta];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(MetaPerson.MAN_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("man.png"));
        res.put(MetaPerson.WOMEN_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("women.png"));
        res.put(MetaPerson.PERSON_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("person.png"));
        res.put(MetaPerson.GENERAL_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("general.png"));
        res.put(MetaPersonProperty.PERSON_PROP_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("personproperty.png"));
        res.put(MetaPersonProperty.PERSON_PROP_BOSS_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("boss.png"));
        res.put(MetaPersonProperty.PERSON_PROP_KING_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("king.png"));
        res.put(MetaPersonProperty.PERSON_PROP_KIN_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("kin.png"));
        res.put(MetaPersonProperty.PERSON_PROP_MILITARY_ID, EpNerCoreInternalResourceHelper.get_bytes("militaryrank.png"));
        res.put(MetaPersonProperty.PERSON_PROP_NATION_ID, EpNerCoreInternalResourceHelper.get_bytes("nationality.png"));
        res.put(MetaPersonIdentity.IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("identity.png"));
        return res;
    }
    
    create_referent(type) {
        if (type === PersonReferent.OBJ_TYPENAME) 
            return new PersonReferent();
        if (type === PersonPropertyReferent.OBJ_TYPENAME) 
            return new PersonPropertyReferent();
        if (type === PersonIdentityReferent.OBJ_TYPENAME) 
            return new PersonIdentityReferent();
        return null;
    }
    
    get used_extern_object_types() {
        return ["ORGANIZATION", "GEO", "ADDRESS", "TRANSPORT"];
    }
    
    get progress_weight() {
        return 35;
    }
    
    create_analyzer_data() {
        return new PersonAnalyzer.PersonAnalyzerData();
    }
    
    process(kit) {
        const PersonAttrToken = require("./internal/PersonAttrToken");
        const PersonIdToken = require("./internal/PersonIdToken");
        let ad = Utils.as(kit.get_analyzer_data(this), PersonAnalyzer.PersonAnalyzerData);
        ad.nominative_case_always = this.nominative_case_always;
        ad.text_starts_with_lastname_firstname_middlename = this.text_starts_with_lastname_firstname_middlename;
        ad.need_second_step = false;
        for (let t = kit.first_token; t !== null; t = t.next) {
            t.inner_bool = false;
        }
        let steps = 2;
        let max = steps;
        let delta = 100000;
        let parts = Utils.intDiv(((kit.sofa.text.length + delta) - 1), delta);
        if (parts === 0) 
            parts = 1;
        max *= parts;
        let cur = 0;
        for (let step = 0; step < steps; step++) {
            let next_pos = delta;
            for (let t = kit.first_token; t !== null; t = t.next) {
                if (t.begin_char > next_pos) {
                    next_pos += delta;
                    cur++;
                    if (!this.on_progress(cur, max, kit)) 
                        return;
                }
                let rts = this.try_attach_persons(t, ad, step);
                if (rts !== null) {
                    if (!MetaToken.check(rts)) {
                    }
                    else 
                        for (const rt of rts) {
                            if (rt.referent === null) 
                                t = rt.end_token;
                            else {
                                let pats = new Array();
                                for (const s of rt.referent.slots) {
                                    if (s.value instanceof PersonAttrToken) {
                                        let pat = Utils.as(s.value, PersonAttrToken);
                                        pats.push(pat);
                                        if (pat.prop_ref === null) 
                                            continue;
                                        for (const ss of pat.prop_ref.slots) {
                                            if (ss.type_name === PersonPropertyReferent.ATTR_REF && (ss.value instanceof ReferentToken)) {
                                                let rt1 = Utils.as(ss.value, ReferentToken);
                                                rt1.referent = ad.register_referent(rt1.referent);
                                                ss.value = rt1.referent;
                                                let rr = ReferentToken._new743(rt1.referent, rt1.begin_token, rt1.end_token, rt1.morph);
                                                kit.embed_token(rr);
                                                if (rr.begin_token === rt.begin_token) 
                                                    rt.begin_token = rr;
                                                if (rr.end_token === rt.end_token) 
                                                    rt.end_token = rr;
                                                if (rr.begin_token === pat.begin_token) 
                                                    pat.begin_token = rr;
                                                if (rr.end_token === pat.end_token) 
                                                    pat.end_token = rr;
                                            }
                                        }
                                    }
                                    else if (s.value instanceof ReferentToken) {
                                        let rt0 = Utils.as(s.value, ReferentToken);
                                        if (rt0.referent !== null) {
                                            for (const s1 of rt0.referent.slots) {
                                                if (s1.value instanceof PersonAttrToken) {
                                                    let pat = Utils.as(s1.value, PersonAttrToken);
                                                    if (pat.prop_ref === null) 
                                                        continue;
                                                    for (const ss of pat.prop_ref.slots) {
                                                        if (ss.type_name === PersonPropertyReferent.ATTR_REF && (ss.value instanceof ReferentToken)) {
                                                            let rt1 = Utils.as(ss.value, ReferentToken);
                                                            rt1.referent = ad.register_referent(rt1.referent);
                                                            ss.value = rt1.referent;
                                                            let rr = ReferentToken._new743(rt1.referent, rt1.begin_token, rt1.end_token, rt1.morph);
                                                            kit.embed_token(rr);
                                                            if (rr.begin_token === rt0.begin_token) 
                                                                rt0.begin_token = rr;
                                                            if (rr.end_token === rt0.end_token) 
                                                                rt0.end_token = rr;
                                                            if (rr.begin_token === pat.begin_token) 
                                                                pat.begin_token = rr;
                                                            if (rr.end_token === pat.end_token) 
                                                                pat.end_token = rr;
                                                        }
                                                    }
                                                    pat.prop_ref = Utils.as(ad.register_referent(pat.prop_ref), PersonPropertyReferent);
                                                    let rt2 = ReferentToken._new743(pat.prop_ref, pat.begin_token, pat.end_token, pat.morph);
                                                    kit.embed_token(rt2);
                                                    if (rt2.begin_token === rt0.begin_token) 
                                                        rt0.begin_token = rt2;
                                                    if (rt2.end_token === rt0.end_token) 
                                                        rt0.end_token = rt2;
                                                    s1.value = pat.prop_ref;
                                                }
                                            }
                                        }
                                        rt0.referent = ad.register_referent(rt0.referent);
                                        if (rt0.begin_char === rt.begin_char) 
                                            rt.begin_token = rt0;
                                        if (rt0.end_char === rt.end_char) 
                                            rt.end_token = rt0;
                                        kit.embed_token(rt0);
                                        s.value = rt0.referent;
                                    }
                                }
                                rt.referent = ad.register_referent(rt.referent);
                                for (const p of pats) {
                                    if (p.prop_ref !== null) {
                                        let rr = ReferentToken._new743(p.prop_ref, p.begin_token, p.end_token, p.morph);
                                        kit.embed_token(rr);
                                        if (rr.begin_token === rt.begin_token) 
                                            rt.begin_token = rr;
                                        if (rr.end_token === rt.end_token) 
                                            rt.end_token = rr;
                                    }
                                }
                                kit.embed_token(rt);
                                t = rt;
                            }
                        }
                }
                else if (step === 0) {
                    let rt = PersonIdToken.try_attach(t);
                    if (rt !== null) {
                        rt.referent = ad.register_referent(rt.referent);
                        let tt = t.previous;
                        if (tt !== null && tt.is_char_of(":,")) 
                            tt = tt.previous;
                        let pers = (tt === null ? null : Utils.as(tt.get_referent(), PersonReferent));
                        if (pers !== null) 
                            pers.add_slot(PersonReferent.ATTR_IDDOC, rt.referent, false, 0);
                        kit.embed_token(rt);
                        t = rt;
                    }
                }
            }
            if (ad.referents.length === 0 && !ad.need_second_step) 
                break;
        }
        let props = new Hashtable();
        for (const r of ad.referents) {
            let p = Utils.as(r, PersonReferent);
            if (p === null) 
                continue;
            for (const s of p.slots) {
                if (s.type_name === PersonReferent.ATTR_ATTR && (s.value instanceof PersonPropertyReferent)) {
                    let pr = Utils.as(s.value, PersonPropertyReferent);
                    let li = [ ];
                    let wrapli2593 = new RefOutArgWrapper();
                    let inoutres2594 = props.tryGetValue(pr, wrapli2593);
                    li = wrapli2593.value;
                    if (!inoutres2594) 
                        props.put(pr, (li = new Array()));
                    if (!li.includes(p)) 
                        li.push(p);
                }
            }
        }
        for (let t = kit.first_token; t !== null; t = t.next) {
            if (t instanceof ReferentToken) {
                if (t.chars.is_latin_letter && MiscHelper.is_eng_adj_suffix(t.next)) {
                }
                else 
                    continue;
            }
            if (!ad.can_be_person_prop_begin_chars.containsKey(t.begin_char)) 
                continue;
            let pat = PersonAttrToken.try_attach(t, ad.local_ontology, PersonAttrTokenPersonAttrAttachAttrs.NO);
            if (pat === null) 
                continue;
            if (pat.prop_ref === null || ((pat.typ !== PersonAttrTerminType.POSITION && pat.typ !== PersonAttrTerminType.KING))) {
                t = pat.end_token;
                continue;
            }
            let pers = new Array();
            for (const kp of props.entries) {
                if (kp.key.can_be_equals(pat.prop_ref, ReferentEqualType.WITHINONETEXT)) {
                    for (const pp of kp.value) {
                        if (!pers.includes(pp)) 
                            pers.push(pp);
                    }
                    if (pers.length > 1) 
                        break;
                }
            }
            if (pers.length === 1) {
                let tt = pat.end_token.next;
                if (tt !== null && ((tt.is_char('_') || tt.is_newline_before || tt.is_table_control_char))) {
                }
                else {
                    pat.data = ad;
                    pat.save_to_local_ontology();
                    kit.embed_token(pat);
                    let rt = ReferentToken._new743(pers[0], pat, pat, pat.morph);
                    kit.embed_token(rt);
                    t = rt;
                    continue;
                }
            }
            if (pat.prop_ref !== null) {
                if (pat.can_be_independent_property || pers.length > 0) {
                    let rt = ReferentToken._new743(ad.register_referent(pat.prop_ref), pat.begin_token, pat.end_token, pat.morph);
                    kit.embed_token(rt);
                    t = rt;
                    continue;
                }
            }
            t = pat.end_token;
        }
    }
    
    process_referent(begin, end) {
        const PersonAttrToken = require("./internal/PersonAttrToken");
        if (begin === null || this.m_level > 2) 
            return null;
        this.m_level++;
        let ad = Utils.as(begin.kit.get_analyzer_data(this), PersonAnalyzer.PersonAnalyzerData);
        let rt = PersonAnalyzer.try_attach_person(begin, ad, false, -1, false);
        this.m_level--;
        if (rt !== null && rt.referent === null) 
            rt = null;
        if (rt !== null) {
            rt.data = begin.kit.get_analyzer_data(this);
            return rt;
        }
        this.m_level++;
        let pat = PersonAttrToken.try_attach(begin, null, PersonAttrTokenPersonAttrAttachAttrs.NO);
        this.m_level--;
        if (pat === null || pat.prop_ref === null) 
            return null;
        rt = ReferentToken._new743(pat.prop_ref, pat.begin_token, pat.end_token, pat.morph);
        rt.data = ad;
        return rt;
    }
    
    try_attach_persons(t, ad, step) {
        let rt = PersonAnalyzer.try_attach_person(t, ad, false, step, false);
        if (rt === null) 
            return null;
        let res = new Array();
        res.push(rt);
        let names = null;
        for (let tt = rt.end_token.next; tt !== null; tt = tt.next) {
            if (!tt.is_comma_and) 
                break;
            let pits = PersonItemToken.try_attach_list(tt.next, null, PersonItemTokenParseAttr.NO, 10);
            if (pits === null || pits.length !== 1) 
                break;
            let rt1 = PersonAnalyzer.try_attach_person(tt.next, ad, false, step, false);
            if (rt1 !== null) 
                break;
            if (pits[0].firstname === null || pits[0].firstname.vars.length === 0) 
                break;
            if (names === null) 
                names = new Array();
            names.push(pits[0]);
            if (tt.is_and) 
                break;
            tt = tt.next;
        }
        if (names !== null) {
            for (const n of names) {
                let pers = new PersonReferent();
                let bi = MorphBaseInfo._new2598(MorphNumber.SINGULAR, t.kit.base_language);
                bi.class0 = MorphClass._new2560(true);
                if (n.firstname.vars[0].gender === MorphGender.FEMINIE) {
                    pers.is_female = true;
                    bi.gender = MorphGender.FEMINIE;
                }
                else if (n.firstname.vars[0].gender === MorphGender.MASCULINE) {
                    pers.is_male = true;
                    bi.gender = MorphGender.MASCULINE;
                }
                for (const v of n.firstname.vars) {
                    pers.add_slot(PersonReferent.ATTR_FIRSTNAME, v.value, false, 0);
                }
                for (const s of rt.referent.slots) {
                    if (s.type_name === PersonReferent.ATTR_ATTR) 
                        pers.add_slot(s.type_name, s.value, false, 0);
                    else if (s.type_name === PersonReferent.ATTR_LASTNAME) {
                        let sur = Utils.asString(s.value);
                        if (bi.gender !== MorphGender.UNDEFINED) {
                            let sur0 = Morphology.get_wordform(sur, bi);
                            if (sur0 !== null) 
                                pers.add_slot(PersonReferent.ATTR_LASTNAME, sur0, false, 0);
                        }
                        pers.add_slot(PersonReferent.ATTR_LASTNAME, sur, false, 0);
                    }
                }
                res.push(ReferentToken._new743(pers, n.begin_token, n.end_token, n.morph));
            }
        }
        return res;
    }
    
    static try_attach_person(t, ad, for_ext_ontos, step, for_attribute = false) {
        const PersonAttrToken = require("./internal/PersonAttrToken");
        const PersonHelper = require("./internal/PersonHelper");
        const PersonIdentityToken = require("./internal/PersonIdentityToken");
        let attrs = null;
        let mi = new MorphBaseInfo();
        mi._case = ((for_ext_ontos || ((ad !== null && ad.nominative_case_always))) ? MorphCase.NOMINATIVE : MorphCase.ALL_CASES);
        mi.gender = MorphGender.of((MorphGender.MASCULINE.value()) | (MorphGender.FEMINIE.value()));
        let t0 = t;
        let and = false;
        let and_was_terminated = false;
        let is_genitive = false;
        let can_attach_to_previous_person = true;
        let is_king = false;
        let after_be_predicate = false;
        for (; t !== null; t = t.next) {
            if (attrs !== null && t.next !== null) {
                if (and) 
                    break;
                if (t.is_char(',')) 
                    t = t.next;
                else if (t.is_and && t.is_whitespace_after && t.chars.is_all_lower) {
                    t = t.next;
                    and = true;
                }
                else if (t.is_hiphen && t.is_newline_after) {
                    t = t.next;
                    and = true;
                }
                else if (t.is_hiphen && t.whitespaces_after_count === 1 && t.whitespaces_before_count === 1) {
                    t = t.next;
                    and = true;
                }
                else if ((t.is_hiphen && t.next !== null && t.next.is_hiphen) && t.next.whitespaces_after_count === 1 && t.whitespaces_before_count === 1) {
                    t = t.next.next;
                    and = true;
                }
                else if (t.is_char(':')) {
                    if (!attrs[attrs.length - 1].morph._case.is_nominative && !attrs[attrs.length - 1].morph._case.is_undefined) {
                    }
                    else {
                        mi._case = MorphCase.NOMINATIVE;
                        mi.gender = MorphGender.of((MorphGender.MASCULINE.value()) | (MorphGender.FEMINIE.value()));
                    }
                    t = t.next;
                    if (!BracketHelper.can_be_start_of_sequence(t, false, false)) 
                        can_attach_to_previous_person = false;
                }
                else if (t.is_char('_')) {
                    let cou = 0;
                    let te = t;
                    for (; te !== null; te = te.next) {
                        if (!te.is_char('_') || ((te.is_whitespace_before && te !== t))) 
                            break;
                        else 
                            cou++;
                    }
                    if (cou > 2 && ((!t.is_newline_before || ((te !== null && !te.is_newline_before))))) {
                        mi._case = MorphCase.NOMINATIVE;
                        mi.gender = MorphGender.of((MorphGender.MASCULINE.value()) | (MorphGender.FEMINIE.value()));
                        can_attach_to_previous_person = false;
                        t = te;
                        if (t !== null && t.is_char('/') && t.next !== null) 
                            t = t.next;
                        break;
                    }
                }
                else if ((t.is_value("ЯВЛЯТЬСЯ", null) || t.is_value("БЫТЬ", null) || t.is_value("Є", null)) || t.is_value("IS", null)) {
                    mi._case = MorphCase.NOMINATIVE;
                    mi.gender = MorphGender.of((MorphGender.MASCULINE.value()) | (MorphGender.FEMINIE.value()));
                    after_be_predicate = true;
                    continue;
                }
                else if (((t.is_value("LIKE", null) || t.is_value("AS", null))) && attrs !== null) {
                    t = t.next;
                    break;
                }
            }
            if (t.chars.is_latin_letter && step === 0) {
                let tt2 = t;
                if (MiscHelper.is_eng_article(t)) 
                    tt2 = t.next;
                let pit0 = PersonItemToken.try_attach(tt2, (ad === null ? null : ad.local_ontology), PersonItemTokenParseAttr.CANBELATIN, null);
                if (pit0 !== null && MiscHelper.is_eng_adj_suffix(pit0.end_token.next) && ad !== null) {
                    let pp = PersonIdentityToken.try_attach_onto_for_single(pit0, ad.local_ontology);
                    if (pp === null) 
                        pp = PersonIdentityToken.try_attach_latin_surname(pit0, ad.local_ontology);
                    if (pp !== null) 
                        return PersonHelper.create_referent_token(pp, pit0.begin_token, pit0.end_token, pit0.morph, attrs, ad, for_attribute, after_be_predicate);
                }
            }
            let a = null;
            if ((step < 1) || t.inner_bool) {
                a = PersonAttrToken.try_attach(t, (ad === null ? null : ad.local_ontology), PersonAttrTokenPersonAttrAttachAttrs.NO);
                if (step === 0 && a !== null) 
                    t.inner_bool = true;
            }
            if ((a !== null && a.begin_token === a.end_token && !a.begin_token.chars.is_all_lower) && (a.whitespaces_after_count < 3)) {
                let pits = PersonItemToken.try_attach_list(t, (ad === null ? null : ad.local_ontology), PersonItemTokenParseAttr.IGNOREATTRS, 10);
                if (pits !== null && pits.length >= 6) {
                    if (pits[2].is_newline_after && pits[5].is_newline_after) 
                        a = null;
                }
            }
            if ((a === null && t.is_value("НА", null) && t.next !== null) && t.next.is_value("ИМЯ", null)) {
                a = PersonAttrToken._new2433(t, t.next, MorphCollection._new2439(MorphCase.GENITIVE));
                is_genitive = true;
            }
            if (a === null) 
                break;
            if (after_be_predicate) 
                return null;
            if (!t.chars.is_all_lower && a.begin_token === a.end_token) {
                let pit = PersonItemToken.try_attach(t, (ad === null ? null : ad.local_ontology), PersonItemTokenParseAttr.CANBELATIN, null);
                if (pit !== null && pit.lastname !== null && ((pit.lastname.is_in_ontology || pit.lastname.is_in_dictionary))) 
                    break;
            }
            if (ad !== null && !ad.can_be_person_prop_begin_chars.containsKey(a.begin_char)) 
                ad.can_be_person_prop_begin_chars.put(a.begin_char, true);
            if (attrs === null) {
                if (a.is_doubt) {
                    if (a.is_newline_after) 
                        break;
                }
                attrs = new Array();
            }
            else if (!a.morph._case.is_undefined && !mi._case.is_undefined) {
                if ((MorphCase.ooBitand(a.morph._case, mi._case)).is_undefined) {
                    attrs.splice(0, attrs.length);
                    mi._case = (for_ext_ontos ? MorphCase.NOMINATIVE : MorphCase.ALL_CASES);
                    mi.gender = MorphGender.of((MorphGender.MASCULINE.value()) | (MorphGender.FEMINIE.value()));
                    is_king = false;
                }
            }
            attrs.push(a);
            if (attrs.length > 5) 
                return new ReferentToken(null, attrs[0].begin_token, a.end_token);
            if (a.typ === PersonAttrTerminType.KING) 
                is_king = true;
            if (a.typ === PersonAttrTerminType.BESTREGARDS) 
                mi._case = MorphCase.NOMINATIVE;
            if (and) 
                and_was_terminated = true;
            if (a.can_has_person_after === 0) {
                if (a.gender !== MorphGender.UNDEFINED) {
                    if (a.typ !== PersonAttrTerminType.POSITION) 
                        mi.gender = MorphGender.of((mi.gender.value()) & (a.gender.value()));
                    else if (a.gender === MorphGender.FEMINIE) 
                        mi.gender = MorphGender.of((mi.gender.value()) & (a.gender.value()));
                }
                if (!a.morph._case.is_undefined) 
                    mi._case = MorphCase.ooBitand(mi._case, a.morph._case);
            }
            t = a.end_token;
        }
        if (attrs !== null && and && !and_was_terminated) {
            if ((t !== null && t.previous !== null && t.previous.is_hiphen) && (t.whitespaces_before_count < 2)) {
            }
            else 
                return null;
        }
        if (attrs !== null) {
            if (t !== null && BracketHelper.can_be_end_of_sequence(t, false, null, false)) 
                t = t.next;
        }
        while (t !== null && ((t.is_table_control_char || t.is_char('_')))) {
            t = t.next;
        }
        if (t === null) {
            if (attrs !== null) {
                let attr = attrs[attrs.length - 1];
                if (attr.can_be_single_person && attr.prop_ref !== null) 
                    return new ReferentToken(attr.prop_ref, attr.begin_token, attr.end_token);
            }
            return null;
        }
        if (attrs !== null && t.is_char('(')) {
            let pr = PersonAnalyzer.try_attach_person(t.next, ad, for_ext_ontos, step, for_attribute);
            if (pr !== null && pr.end_token.next !== null && pr.end_token.next.is_char(')')) {
                let res = PersonHelper.create_referent_token(Utils.as(pr.referent, PersonReferent), t, pr.end_token.next, attrs[0].morph, attrs, ad, true, after_be_predicate);
                if (res !== null) 
                    res.end_token = pr.end_token.next;
                return res;
            }
            let attr = PersonAttrToken.try_attach(t.next, (ad === null ? null : ad.local_ontology), PersonAttrTokenPersonAttrAttachAttrs.NO);
            if (attr !== null && attr.end_token.next !== null && attr.end_token.next.is_char(')')) {
                attrs.push(attr);
                t = attr.end_token.next.next;
                while (t !== null && ((t.is_table_control_char || t.is_char_of("_:")))) {
                    t = t.next;
                }
            }
        }
        let tt0 = t0.previous;
        if (MorphCase.ooEq(mi._case, MorphCase.ALL_CASES) && tt0 !== null) {
            if (tt0 !== null && tt0.is_comma_and) {
                tt0 = tt0.previous;
                if (tt0 !== null && (tt0.get_referent() instanceof PersonReferent)) {
                    if (!tt0.morph._case.is_undefined) 
                        mi._case = MorphCase.ooBitand(mi._case, tt0.morph._case);
                }
            }
        }
        if ((attrs !== null && t !== null && t.previous !== null) && t.previous.is_char(',')) {
            if (attrs[0].typ !== PersonAttrTerminType.BESTREGARDS && !attrs[0].chars.is_latin_letter) {
                if (attrs[0].is_newline_before) {
                }
                else 
                    return null;
            }
        }
        if (step === 1) {
        }
        if (t === null) 
            return null;
        for (let k = 0; k < 2; k++) {
            let pits = null;
            let pattr = PersonItemTokenParseAttr.NO;
            if ((step < 1) || t.inner_bool) {
                if (k === 0) 
                    pattr = PersonItemTokenParseAttr.of((pattr.value()) | (PersonItemTokenParseAttr.ALTVAR.value()));
                if (for_ext_ontos || t.chars.is_latin_letter) 
                    pattr = PersonItemTokenParseAttr.of((pattr.value()) | (PersonItemTokenParseAttr.CANBELATIN.value()));
                pits = PersonItemToken.try_attach_list(t, (ad === null ? null : ad.local_ontology), pattr, 10);
                if (pits !== null && step === 0) 
                    t.inner_bool = true;
                if (pits !== null && is_genitive) {
                    for (const p of pits) {
                        p.remove_not_genitive();
                    }
                }
            }
            if (pits === null) 
                continue;
            if (!for_ext_ontos) {
            }
            if ((step === 0 && pits.length === 1 && attrs !== null) && attrs[attrs.length - 1].end_token === t.previous && pits[0].end_token === t) {
                let stat = t.kit.statistics.get_word_info(t);
                if (stat !== null) 
                    stat.has_before_person_attr = true;
                if (ad !== null) 
                    ad.need_second_step = true;
            }
            if (pits !== null && pits.length === 1 && pits[0].firstname !== null) {
                if (pits[0].end_token.next !== null && pits[0].end_token.next.is_and && (pits[0].end_token.next.next instanceof ReferentToken)) {
                    let pr = Utils.as(pits[0].end_token.next.next.get_referent(), PersonReferent);
                    if (pr !== null) {
                        if (pits[0].firstname.vars.length < 1) 
                            return null;
                        let v = pits[0].firstname.vars[0];
                        let pers = new PersonReferent();
                        let bi = MorphBaseInfo._new2603(v.gender, MorphNumber.SINGULAR, pits[0].kit.base_language);
                        bi.class0 = MorphClass._new2560(true);
                        if (v.gender === MorphGender.MASCULINE) 
                            pers.is_male = true;
                        else if (v.gender === MorphGender.FEMINIE) 
                            pers.is_female = true;
                        for (const s of pr.slots) {
                            if (s.type_name === PersonReferent.ATTR_LASTNAME) {
                                let str = Utils.asString(s.value);
                                let str0 = Morphology.get_wordform(str, bi);
                                pers.add_slot(s.type_name, str0, false, 0);
                                if (str0 !== str) 
                                    pers.add_slot(s.type_name, str, false, 0);
                            }
                        }
                        if (pers.slots.length === 0) 
                            return null;
                        pers.add_slot(PersonReferent.ATTR_FIRSTNAME, v.value, false, 0);
                        return PersonHelper.create_referent_token(pers, pits[0].begin_token, pits[0].end_token, pits[0].firstname.morph, attrs, ad, for_attribute, after_be_predicate);
                    }
                }
                let attr = (attrs !== null && attrs.length > 0 ? attrs[attrs.length - 1] : null);
                if ((attr !== null && attr.prop_ref !== null && attr.prop_ref.kind === PersonPropertyKind.KIN) && attr.gender !== MorphGender.UNDEFINED) {
                    let vvv = attr.prop_ref.get_slot_value(PersonPropertyReferent.ATTR_REF);
                    let pr = Utils.as(vvv, PersonReferent);
                    if (vvv instanceof ReferentToken) 
                        pr = Utils.as((vvv).referent, PersonReferent);
                    if (pr !== null) {
                        let pers = new PersonReferent();
                        let bi = MorphBaseInfo._new2605(MorphNumber.SINGULAR, attr.gender, attr.kit.base_language);
                        bi.class0 = MorphClass._new2560(true);
                        for (const s of pr.slots) {
                            if (s.type_name === PersonReferent.ATTR_LASTNAME) {
                                let sur = Utils.asString(s.value);
                                let sur0 = Morphology.get_wordform(sur, bi);
                                pers.add_slot(s.type_name, sur0, false, 0);
                                if (sur0 !== sur) 
                                    pers.add_slot(s.type_name, sur, false, 0);
                            }
                        }
                        let v = pits[0].firstname.vars[0];
                        pers.add_slot(PersonReferent.ATTR_FIRSTNAME, v.value, false, 0);
                        if (attr.gender === MorphGender.MASCULINE) 
                            pers.is_male = true;
                        else if (attr.gender === MorphGender.FEMINIE) 
                            pers.is_female = true;
                        return PersonHelper.create_referent_token(pers, pits[0].begin_token, pits[0].end_token, pits[0].firstname.morph, attrs, ad, for_attribute, after_be_predicate);
                    }
                }
            }
            if (pits !== null && pits.length === 1 && pits[0].lastname !== null) {
                if (t.morph.number === MorphNumber.PLURAL || ((t.previous !== null && ((t.previous.is_value("БРАТ", null) || t.previous.is_value("СЕСТРА", null)))))) {
                    let t1 = pits[0].end_token.next;
                    if (t1 !== null && ((t1.is_char(':') || t1.is_hiphen))) 
                        t1 = t1.next;
                    let pits1 = PersonItemToken.try_attach_list(t1, (ad === null ? null : ad.local_ontology), pattr, 10);
                    if (pits1 !== null && pits1.length === 1) 
                        pits.splice(pits.length, 0, ...pits1);
                    else if (pits1 !== null && pits1.length === 2 && pits1[1].middlename !== null) 
                        pits.splice(pits.length, 0, ...pits1);
                }
            }
            if (mi._case.is_undefined) {
                if (pits[0].is_newline_before && pits[pits.length - 1].end_token.is_newline_after) 
                    mi._case = MorphCase.NOMINATIVE;
            }
            if (ad !== null) {
                if (pits.length === 1) {
                }
                if (for_attribute && pits.length > 1) {
                    let tmp = new Array();
                    let pit0 = null;
                    for (let i = 0; i < pits.length; i++) {
                        tmp.push(pits[i]);
                        let pit = PersonIdentityToken.try_attach_onto_int(tmp, 0, mi, ad.local_ontology);
                        if (pit !== null) 
                            pit0 = pit;
                    }
                    if (pit0 !== null) 
                        return PersonHelper.create_referent_token(pit0.ontology_person, pit0.begin_token, pit0.end_token, pit0.morph, attrs, ad, for_attribute, after_be_predicate);
                }
                for (let i = 0; (i < pits.length) && (i < 3); i++) {
                    let pit = PersonIdentityToken.try_attach_onto_int(pits, i, mi, ad.local_ontology);
                    if (pit !== null) 
                        return PersonHelper.create_referent_token(pit.ontology_person, pit.begin_token, pit.end_token, pit.morph, (pit.begin_token === pits[0].begin_token ? attrs : null), ad, for_attribute, after_be_predicate);
                }
                if (pits.length === 1 && !for_ext_ontos) {
                    let pp = PersonIdentityToken.try_attach_onto_for_single(pits[0], ad.local_ontology);
                    if (pp !== null) 
                        return PersonHelper.create_referent_token(pp, pits[0].begin_token, pits[0].end_token, pits[0].morph, attrs, ad, for_attribute, after_be_predicate);
                }
                if ((pits.length === 1 && !for_ext_ontos && attrs !== null) && pits[0].chars.is_latin_letter && attrs[0].chars.is_latin_letter) {
                    let pp = PersonIdentityToken.try_attach_latin_surname(pits[0], ad.local_ontology);
                    if (pp !== null) 
                        return PersonHelper.create_referent_token(pp, pits[0].begin_token, pits[0].end_token, pits[0].morph, attrs, ad, for_attribute, after_be_predicate);
                }
                if (pits.length === 2 && !for_ext_ontos) {
                    let pp = PersonIdentityToken.try_attach_onto_for_duble(pits[0], pits[1], ad.local_ontology);
                    if (pp !== null) 
                        return PersonHelper.create_referent_token(pp, pits[0].begin_token, pits[1].end_token, pits[0].morph, attrs, ad, for_attribute, after_be_predicate);
                }
            }
            if (pits[0].begin_token.kit.ontology !== null) {
                for (let i = 0; i < pits.length; i++) {
                    let pit = PersonIdentityToken.try_attach_onto_ext(pits, i, mi, pits[0].begin_token.kit.ontology);
                    if (pit !== null) 
                        return PersonHelper.create_referent_token(pit.ontology_person, pit.begin_token, pit.end_token, pit.morph, attrs, ad, for_attribute, after_be_predicate);
                }
            }
            let pli0 = PersonIdentityToken.try_attach(pits, 0, mi, t0, is_king, attrs !== null);
            if (pli0.length > 0 && pli0[0].typ === FioTemplateType.NAMESURNAME) {
                if ((attrs !== null && attrs.length > 0 && attrs[attrs.length - 1].begin_token === attrs[attrs.length - 1].end_token) && attrs[attrs.length - 1].begin_token.chars.is_capital_upper) {
                    let pits1 = PersonItemToken.try_attach_list(attrs[attrs.length - 1].begin_token, (ad === null ? null : ad.local_ontology), pattr, 10);
                    if (pits1 !== null && pits1[0].lastname !== null) {
                        let pli11 = PersonIdentityToken.try_attach(pits1, 0, mi, t0, is_king, attrs.length > 1);
                        if ((pli11 !== null && pli11.length > 0 && pli11[0].coef > 1) && pli11[0].end_token === pli0[0].end_token) {
                            pli0 = pli11;
                            attrs.splice(attrs.length - 1, 1);
                            if (attrs.length === 0) 
                                attrs = null;
                        }
                    }
                }
            }
            if (t.previous === null && ((ad !== null && ad.text_starts_with_lastname_firstname_middlename)) && pits.length === 3) {
                let exi = false;
                for (const pit of pli0) {
                    if (pit.typ === FioTemplateType.SURNAMENAMESECNAME) {
                        pit.coef += (10);
                        exi = true;
                    }
                }
                if (!exi) {
                    let pit = PersonIdentityToken.create_typ(pits, FioTemplateType.SURNAMENAMESECNAME, mi);
                    if (pit !== null) {
                        pit.coef = 10;
                        pli0.push(pit);
                    }
                }
            }
            if (for_ext_ontos) {
                let te = false;
                if (pli0 === null || pli0.length === 0) 
                    te = true;
                else {
                    PersonIdentityToken.sort(pli0);
                    if (pli0[0].coef < 2) 
                        te = true;
                }
                if (te) 
                    pli0 = PersonIdentityToken.try_attach_for_ext_onto(pits);
            }
            if (for_ext_ontos && pli0 !== null) {
                let et = pits[pits.length - 1].end_token;
                for (const pit of pli0) {
                    if (pit.end_token === et) 
                        pit.coef += (1);
                }
            }
            let pli = pli0;
            let pli1 = null;
            if (!for_ext_ontos && ((attrs === null || attrs[attrs.length - 1].typ === PersonAttrTerminType.POSITION))) {
                if ((pits.length === 4 && pits[0].firstname !== null && pits[1].firstname === null) && pits[2].firstname !== null && pits[3].firstname === null) {
                }
                else {
                    pli1 = PersonIdentityToken.try_attach(pits, 1, mi, t0, is_king, attrs !== null);
                    if (pli0 !== null && pli1 !== null && pli1.length > 0) 
                        PersonIdentityToken.correctxfml(pli0, pli1, attrs);
                }
            }
            if (pli === null) 
                pli = pli1;
            else if (pli1 !== null) 
                pli.splice(pli.length, 0, ...pli1);
            if (((pli === null || pli.length === 0)) && pits.length === 1 && pits[0].firstname !== null) {
                if (is_king) {
                    let first = new PersonIdentityToken(pits[0].begin_token, pits[0].end_token);
                    PersonIdentityToken.manage_firstname(first, pits[0], mi);
                    first.coef = 2;
                    if (first.morph.gender === MorphGender.UNDEFINED && first.firstname !== null) 
                        first.morph.gender = first.firstname.gender;
                    pli.push(first);
                    let sur = ((attrs === null || attrs.length === 0) ? null : attrs[attrs.length - 1].king_surname);
                    if (sur !== null) 
                        PersonIdentityToken.manage_lastname(first, sur, mi);
                }
                else if (attrs !== null) {
                    for (const a of attrs) {
                        if (a.can_be_same_surname && a.referent !== null) {
                            let pr0 = Utils.as(a.referent.get_slot_value(PersonPropertyReferent.ATTR_REF), PersonReferent);
                            if (pr0 !== null) {
                                let first = new PersonIdentityToken(pits[0].begin_token, pits[0].end_token);
                                PersonIdentityToken.manage_firstname(first, pits[0], mi);
                                first.coef = 2;
                                pli.push(first);
                                first.lastname = new PersonMorphCollection();
                                for (const v of pr0.slots) {
                                    if (v.type_name === PersonReferent.ATTR_LASTNAME) 
                                        first.lastname.add(String(v.value), null, (pr0.is_male ? MorphGender.MASCULINE : ((pr0.is_female ? MorphGender.FEMINIE : MorphGender.UNDEFINED))), true);
                                }
                            }
                        }
                    }
                }
            }
            if ((((pli === null || pli.length === 0)) && pits.length === 1 && pits[0].lastname !== null) && attrs !== null && !pits[0].is_in_dictionary) {
                for (const a of attrs) {
                    if (a.prop_ref !== null && ((a.typ === PersonAttrTerminType.PREFIX || a.prop_ref.kind === PersonPropertyKind.BOSS))) {
                        let last = new PersonIdentityToken(pits[0].begin_token, pits[0].end_token);
                        PersonIdentityToken.manage_lastname(last, pits[0], mi);
                        last.coef = 2;
                        pli.push(last);
                        break;
                    }
                }
            }
            if (pli !== null && pli.length > 0) {
                PersonIdentityToken.sort(pli);
                let best = pli[0];
                let min_coef = 2;
                if ((best.coef < min_coef) && ((attrs !== null || for_ext_ontos))) {
                    let pit = PersonIdentityToken.try_attach_identity(pits, mi);
                    if (pit !== null && pit.coef > best.coef && pit.coef > 0) {
                        let pers = new PersonReferent();
                        pers.add_identity(pit.lastname);
                        return PersonHelper.create_referent_token(pers, pit.begin_token, pit.end_token, pit.morph, attrs, ad, for_attribute, after_be_predicate);
                    }
                    if ((best.kit.base_language.is_en && best.typ === FioTemplateType.NAMESURNAME && attrs !== null) && attrs[0].typ === PersonAttrTerminType.BESTREGARDS) 
                        best.coef += (10);
                    if (best.coef >= 0) 
                        best.coef += ((best.chars.is_all_upper ? 1 : 2));
                }
                if (best.coef >= 0 && (best.coef < min_coef)) {
                    let tee = best.end_token.next;
                    let tee1 = null;
                    if (tee !== null && tee.is_char('(')) {
                        let br = BracketHelper.try_parse(tee, BracketParseAttr.NO, 100);
                        if (br !== null && (br.length_char < 100)) {
                            tee1 = br.begin_token.next;
                            tee = br.end_token.next;
                        }
                    }
                    if (tee instanceof TextToken) {
                        if (tee.is_char_of(":,") || tee.is_hiphen || (tee).is_verb_be) 
                            tee = tee.next;
                    }
                    let att = PersonAttrToken.try_attach(tee, (ad === null ? null : ad.local_ontology), PersonAttrTokenPersonAttrAttachAttrs.NO);
                    if (att === null && tee1 !== null) 
                        att = PersonAttrToken.try_attach(tee1, (ad === null ? null : ad.local_ontology), PersonAttrTokenPersonAttrAttachAttrs.NO);
                    if (att !== null) {
                        if (tee === best.end_token.next && !att.morph._case.is_nominative && !att.morph._case.is_undefined) {
                        }
                        else 
                            best.coef += (2);
                    }
                    else if (tee !== null && tee.is_value("АГЕНТ", null)) 
                        best.coef += (1);
                    if (for_attribute) 
                        best.coef += (1);
                }
                if (best.coef >= min_coef) {
                    let i = 0;
                    let gender = MorphGender.UNDEFINED;
                    for (i = 0; i < pli.length; i++) {
                        if (pli[i].coef !== best.coef) {
                            pli.splice(i, pli.length - i);
                            break;
                        }
                        else if (pli[i].probable_gender !== MorphGender.UNDEFINED) 
                            gender = MorphGender.of((gender.value()) | (pli[i].probable_gender.value()));
                    }
                    if (pli.length > 1) 
                        return null;
                    if (gender !== MorphGender.FEMINIE && gender !== MorphGender.MASCULINE) {
                        if ((pli[0].is_newline_before && pli[0].is_newline_after && pli[0].lastname !== null) && pli[0].lastname.has_lastname_standard_tail) {
                            if (pli[0].lastname.values.length === 2) {
                                pli[0].lastname.remove(null, MorphGender.MASCULINE);
                                gender = MorphGender.FEMINIE;
                                if (pli[0].firstname !== null && pli[0].firstname.values.length === 2) 
                                    pli[0].firstname.remove(null, MorphGender.MASCULINE);
                            }
                        }
                    }
                    if (gender === MorphGender.UNDEFINED) {
                        if (pli[0].firstname !== null && pli[0].lastname !== null) {
                            let g = pli[0].firstname.gender;
                            if (pli[0].lastname.gender !== MorphGender.UNDEFINED) 
                                g = MorphGender.of((g.value()) & (pli[0].lastname.gender.value()));
                            if (g === MorphGender.FEMINIE || g === MorphGender.MASCULINE) 
                                gender = g;
                            else if (pli[0].firstname.gender === MorphGender.MASCULINE || pli[0].firstname.gender === MorphGender.FEMINIE) 
                                gender = pli[0].firstname.gender;
                            else if (pli[0].lastname.gender === MorphGender.MASCULINE || pli[0].lastname.gender === MorphGender.FEMINIE) 
                                gender = pli[0].lastname.gender;
                        }
                    }
                    let pers = new PersonReferent();
                    if (gender === MorphGender.MASCULINE) 
                        pers.is_male = true;
                    else if (gender === MorphGender.FEMINIE) 
                        pers.is_female = true;
                    for (const v of pli) {
                        if (v.ontology_person !== null) {
                            for (const s of v.ontology_person.slots) {
                                pers.add_slot(s.type_name, s.value, false, 0);
                            }
                        }
                        else if (v.typ === FioTemplateType.ASIANNAME) 
                            pers.add_identity(v.lastname);
                        else {
                            pers.add_fio_identity(v.lastname, v.firstname, v.middlename);
                            if (v.typ === FioTemplateType.ASIANSURNAMENAME) 
                                pers.add_slot("NAMETYPE", "china", false, 0);
                        }
                    }
                    if (!for_ext_ontos) 
                        pers.m_person_identity_typ = pli[0].typ;
                    if (pli[0].begin_token !== pits[0].begin_token && attrs !== null) {
                        if (pits[0].whitespaces_before_count > 2) 
                            attrs = null;
                        else {
                            let s = pits[0].get_source_text();
                            let pat = attrs[attrs.length - 1];
                            if (pat.typ === PersonAttrTerminType.POSITION && !Utils.isNullOrEmpty(s) && !pat.is_newline_before) {
                                if (pat.value === null && pat.prop_ref !== null) {
                                    for (; pat !== null; pat = pat.higher_prop_ref) {
                                        if (pat.prop_ref === null) 
                                            break;
                                        else if (pat.higher_prop_ref === null) {
                                            let str = s.toLowerCase();
                                            if (pat.prop_ref.name !== null && !LanguageHelper.ends_with(pat.prop_ref.name, str)) 
                                                pat.prop_ref.name = pat.prop_ref.name + (" " + str);
                                            if (pat.add_outer_org_as_ref) {
                                                pat.prop_ref.add_slot(PersonPropertyReferent.ATTR_REF, null, true, 0);
                                                pat.add_outer_org_as_ref = false;
                                            }
                                            break;
                                        }
                                    }
                                }
                                else if (pat.value !== null) 
                                    pat.value = (pat.value + " " + s.toLowerCase());
                                pat.end_token = pits[0].end_token;
                            }
                        }
                    }
                    let latin = PersonIdentityToken.check_latin_after(pli[0]);
                    if (latin !== null) 
                        pers.add_fio_identity(latin.lastname, latin.firstname, latin.middlename);
                    return PersonHelper.create_referent_token(pers, pli[0].begin_token, (latin !== null ? latin.end_token : pli[0].end_token), pli[0].morph, attrs, ad, for_attribute, after_be_predicate);
                }
            }
        }
        if (attrs !== null) {
            let attr = attrs[attrs.length - 1];
            if (attr.can_be_single_person && attr.prop_ref !== null) 
                return ReferentToken._new743(attr.prop_ref, attr.begin_token, attr.end_token, attr.morph);
        }
        return null;
    }
    
    process_ontology_item(begin) {
        const PersonAttrToken = require("./internal/PersonAttrToken");
        if (begin === null) 
            return null;
        let rt = PersonAnalyzer.try_attach_person(begin, null, true, -1, false);
        if (rt === null) {
            let pat = PersonAttrToken.try_attach(begin, null, PersonAttrTokenPersonAttrAttachAttrs.NO);
            if (pat !== null && pat.prop_ref !== null) 
                return new ReferentToken(pat.prop_ref, pat.begin_token, pat.end_token);
            return null;
        }
        let t = rt.end_token.next;
        for (; t !== null; t = t.next) {
            if (t.is_char(';') && t.next !== null) {
                let rt1 = PersonAnalyzer.try_attach_person(t.next, null, true, -1, false);
                if (rt1 !== null && rt1.referent.type_name === rt.referent.type_name) {
                    rt.referent.merge_slots(rt1.referent, true);
                    t = rt.end_token = rt1.end_token;
                }
                else if (rt1 !== null) 
                    t = rt1.end_token;
            }
        }
        return rt;
    }
    
    static initialize() {
        const PersonAttrToken = require("./internal/PersonAttrToken");
        const PersonPropAnalyzer = require("./internal/PersonPropAnalyzer");
        const PersonIdToken = require("./internal/PersonIdToken");
        if (PersonAnalyzer.m_inited) 
            return;
        PersonAnalyzer.m_inited = true;
        try {
            MetaPerson.initialize();
            MetaPersonIdentity.initialize();
            MetaPersonProperty.initialize();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
            PersonItemToken.initialize();
            PersonAttrToken.initialize();
            ShortNameHelper.initialize();
            PersonIdToken.initialize();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
            MailLine.initialize();
        } catch (ex) {
            throw new Error(ex.message);
        }
        Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
        ProcessorService.register_analyzer(new PersonAnalyzer());
        ProcessorService.register_analyzer(new PersonPropAnalyzer());
    }
    
    static static_constructor() {
        PersonAnalyzer.ANALYZER_NAME = "PERSON";
        PersonAnalyzer.m_inited = false;
    }
}


PersonAnalyzer.PersonAnalyzerData = class  extends AnalyzerDataWithOntology {
    
    constructor() {
        super();
        this.nominative_case_always = false;
        this.text_starts_with_lastname_firstname_middlename = false;
        this.need_second_step = false;
        this.can_be_person_prop_begin_chars = new Hashtable();
    }
    
    register_referent(referent) {
        const ReferentEqualType = require("./../ReferentEqualType");
        const Referent = require("./../Referent");
        const AnalyzerData = require("./../core/AnalyzerData");
        const ReferentToken = require("./../ReferentToken");
        const PersonPropertyReferent = require("./PersonPropertyReferent");
        const PersonReferent = require("./PersonReferent");
        const PersonAttrToken = require("./internal/PersonAttrToken");
        if (referent instanceof PersonReferent) {
            let exist_props = null;
            for (let i = 0; i < referent.slots.length; i++) {
                let a = referent.slots[i];
                if (a.type_name === PersonReferent.ATTR_ATTR) {
                    let pat = Utils.as(a.value, PersonAttrToken);
                    if (pat === null || pat.prop_ref === null) {
                        if (a.value instanceof PersonPropertyReferent) {
                            if (exist_props === null) 
                                exist_props = new Array();
                            exist_props.push(Utils.as(a.value, PersonPropertyReferent));
                        }
                        continue;
                    }
                    if (pat.prop_ref !== null) {
                        for (const ss of pat.prop_ref.slots) {
                            if (ss.type_name === PersonPropertyReferent.ATTR_REF) {
                                if (ss.value instanceof ReferentToken) {
                                    if ((ss.value).referent === referent) {
                                        Utils.removeItem(pat.prop_ref.slots, ss);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if (exist_props !== null) {
                        for (const pp of exist_props) {
                            if (pp.can_be_equals(pat.prop_ref, ReferentEqualType.WITHINONETEXT)) {
                                if (pat.prop_ref.can_be_general_for(pp)) {
                                    pat.prop_ref.merge_slots(pp, true);
                                    break;
                                }
                            }
                        }
                    }
                    pat.data = this;
                    pat.save_to_local_ontology();
                    if (pat.prop_ref !== null) {
                        if (referent.find_slot(a.type_name, pat.prop_ref, true) !== null) {
                            referent.slots.splice(i, 1);
                            i--;
                        }
                        else 
                            referent.upload_slot(a, pat.referent);
                    }
                }
            }
        }
        if (referent instanceof PersonPropertyReferent) {
            for (let i = 0; i < referent.slots.length; i++) {
                let a = referent.slots[i];
                if (a.type_name === PersonPropertyReferent.ATTR_REF || a.type_name === PersonPropertyReferent.ATTR_HIGHER) {
                    let pat = Utils.as(a.value, ReferentToken);
                    if (pat !== null) {
                        pat.data = this;
                        pat.save_to_local_ontology();
                        if (pat.referent !== null) 
                            referent.upload_slot(a, pat.referent);
                    }
                    else if (a.value instanceof PersonPropertyReferent) {
                        if (a.value === referent) {
                            referent.slots.splice(i, 1);
                            i--;
                            continue;
                        }
                        referent.upload_slot(a, this.register_referent(Utils.as(a.value, PersonPropertyReferent)));
                    }
                }
            }
        }
        let res = super.register_referent(referent);
        return res;
    }
}


PersonAnalyzer.static_constructor();

module.exports = PersonAnalyzer
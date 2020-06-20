/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const StringBuilder = require("./../../unisharp/StringBuilder");

const NounPhraseParseAttr = require("./../core/NounPhraseParseAttr");
const DefinitionKind = require("./DefinitionKind");
const NumberToken = require("./../NumberToken");
const TerminParseAttr = require("./../core/TerminParseAttr");
const MorphGender = require("./../../morph/MorphGender");
const NounPhraseHelper = require("./../core/NounPhraseHelper");
const NumberSpellingType = require("./../NumberSpellingType");
const ParenthesisToken = require("./internal/ParenthesisToken");
const MorphCase = require("./../../morph/MorphCase");
const SourceOfAnalysis = require("./../SourceOfAnalysis");
const MorphLang = require("./../../morph/MorphLang");
const Explanatory = require("./../../semantic/utils/Explanatory");
const MorphNumber = require("./../../morph/MorphNumber");
const MetaToken = require("./../MetaToken");
const NumberHelper = require("./../core/NumberHelper");
const ProcessorService = require("./../ProcessorService");
const ReferentToken = require("./../ReferentToken");
const AnalyzerData = require("./../core/AnalyzerData");
const MorphClass = require("./../../morph/MorphClass");
const MetaDefin = require("./internal/MetaDefin");
const Analyzer = require("./../Analyzer");
const DefinitionReferent = require("./DefinitionReferent");
const GetTextAttr = require("./../core/GetTextAttr");
const TextToken = require("./../TextToken");
const DefinitionAnalyzerEn = require("./internal/DefinitionAnalyzerEn");
const EpNerBankInternalResourceHelper = require("./../bank/internal/EpNerBankInternalResourceHelper");
const Referent = require("./../Referent");
const BracketParseAttr = require("./../core/BracketParseAttr");
const TerminCollection = require("./../core/TerminCollection");
const MiscHelper = require("./../core/MiscHelper");
const BracketHelper = require("./../core/BracketHelper");
const Termin = require("./../core/Termin");

/**
 * Анализатор определений
 */
class DefinitionAnalyzer extends Analyzer {
    
    get name() {
        return DefinitionAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Тезисы";
    }
    
    get description() {
        return "Утверждения и определения";
    }
    
    clone() {
        return new DefinitionAnalyzer();
    }
    
    get progress_weight() {
        return 1;
    }
    
    get type_system() {
        return [MetaDefin.global_meta];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(MetaDefin.IMAGE_DEF_ID, EpNerBankInternalResourceHelper.get_bytes("defin.png"));
        res.put(MetaDefin.IMAGE_ASS_ID, EpNerBankInternalResourceHelper.get_bytes("assert.png"));
        return res;
    }
    
    create_referent(type) {
        if (type === DefinitionReferent.OBJ_TYPENAME) 
            return new DefinitionReferent();
        return null;
    }
    
    get used_extern_object_types() {
        return ["ALL"];
    }
    
    get is_specific() {
        return true;
    }
    
    create_analyzer_data() {
        return new AnalyzerData();
    }
    
    /**
     * Основная функция выделения объектов
     * @param container 
     * @param lastStage 
     * @return 
     */
    process(kit) {
        let ad = kit.get_analyzer_data(this);
        if (MorphLang.ooEq(kit.base_language, MorphLang.EN)) {
            DefinitionAnalyzerEn.process(kit, ad);
            return;
        }
        let glos_regime = false;
        let onto = null;
        let oh = new Hashtable();
        if (kit.ontology !== null) {
            onto = new TerminCollection();
            for (const it of kit.ontology.items) {
                if (it.referent instanceof DefinitionReferent) {
                    let termin = it.referent.get_string_value(DefinitionReferent.ATTR_TERMIN);
                    if (!oh.containsKey(termin)) {
                        oh.put(termin, true);
                        onto.add(Termin._new1114(termin, termin));
                    }
                }
            }
            if (onto.termins.length === 0) 
                onto = null;
        }
        for (let t = kit.first_token; t !== null; t = t.next) {
            if (!glos_regime && t.is_newline_before) {
                let tt = DefinitionAnalyzer._try_attach_glossary(t);
                if (tt !== null) {
                    t = tt;
                    glos_regime = true;
                    continue;
                }
            }
            let max_char = 0;
            let ok = false;
            if (MiscHelper.can_be_start_of_sentence(t)) 
                ok = true;
            else if (((t.is_value("ЧТО", null) && t.next !== null && t.previous !== null) && t.previous.is_comma && t.previous.previous !== null) && MorphClass.ooEq(t.previous.previous.morph.class0, MorphClass.VERB)) {
                ok = true;
                t = t.next;
                if (BracketHelper.can_be_start_of_sequence(t, true, false)) 
                    t = t.next;
            }
            else if (t.is_newline_before && glos_regime) 
                ok = true;
            else if (BracketHelper.can_be_start_of_sequence(t, true, false) && t.previous !== null && t.previous.is_char(':')) {
                ok = true;
                t = t.next;
                for (let tt = t.next; tt !== null; tt = tt.next) {
                    if (BracketHelper.can_be_end_of_sequence(tt, true, t, false)) {
                        max_char = tt.previous.end_char;
                        break;
                    }
                }
            }
            else if (t.is_newline_before && t.previous !== null && t.previous.is_char_of(";:")) 
                ok = true;
            if (!ok) 
                continue;
            let prs = DefinitionAnalyzer.try_attach(t, glos_regime, onto, max_char, false);
            if (prs === null) 
                prs = this.try_attach_end(t, onto, max_char);
            if (prs !== null) {
                for (const pr of prs) {
                    if (pr.referent !== null) {
                        pr.referent = ad.register_referent(pr.referent);
                        pr.referent.add_occurence_of_ref_tok(pr);
                    }
                    t = pr.end_token;
                }
            }
            else {
                if (t.is_char('(')) {
                    let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                    if (br !== null) {
                        t = br.end_token;
                        continue;
                    }
                }
                let ign = false;
                for (let tt = t.next; tt !== null; tt = tt.next) {
                    if (MiscHelper.can_be_start_of_sentence(tt)) {
                        if (tt.previous.is_char(';')) 
                            ign = true;
                        break;
                    }
                }
                if (glos_regime && !t.is_newline_before) {
                }
                else if (!ign) 
                    glos_regime = false;
            }
        }
    }
    
    static _try_attach_glossary(t) {
        if (t === null || !t.is_newline_before) 
            return null;
        for (; t !== null; t = t.next) {
            if ((t instanceof TextToken) && t.chars.is_letter) 
                break;
        }
        if (t === null) 
            return null;
        if (t.is_value("ГЛОССАРИЙ", null) || t.is_value("ОПРЕДЕЛЕНИЕ", null)) 
            t = t.next;
        else if (t.is_value("СПИСОК", null) && t.next !== null && t.next.is_value("ОПРЕДЕЛЕНИЕ", null)) 
            t = t.next.next;
        else {
            let use = false;
            let ponat = false;
            let t0 = t;
            for (; t !== null; t = t.next) {
                if (t.is_value("ИСПОЛЬЗОВАТЬ", null)) 
                    use = true;
                else if (t.is_value("ПОНЯТИЕ", null) || t.is_value("ОПРЕДЕЛЕНИЕ", null)) 
                    ponat = true;
                else if (t.is_char(':')) {
                    if (use && ponat && t.is_newline_after) 
                        return t;
                }
                else if (t !== t0 && MiscHelper.can_be_start_of_sentence(t)) 
                    break;
            }
            return null;
        }
        if (t === null) 
            return null;
        if (t.is_and && t.next !== null && t.next.is_value("СОКРАЩЕНИЕ", null)) 
            t = t.next.next;
        if (t !== null && t.is_char_of(":.")) 
            t = t.next;
        if (t !== null && t.is_newline_before) 
            return t.previous;
        return null;
    }
    
    process_referent(begin, end) {
        let li = DefinitionAnalyzer.try_attach(begin, false, null, 0, false);
        if (li === null || li.length === 0) 
            return null;
        return li[0];
    }
    
    process_ontology_item(begin) {
        if (begin === null) 
            return null;
        let t1 = null;
        for (let t = begin; t !== null; t = t.next) {
            if (t.is_hiphen && ((t.is_whitespace_before || t.is_whitespace_after))) 
                break;
            else 
                t1 = t;
        }
        if (t1 === null) 
            return null;
        let dre = new DefinitionReferent();
        dre.add_slot(DefinitionReferent.ATTR_TERMIN, MiscHelper.get_text_value(begin, t1, GetTextAttr.NO), false, 0);
        return new ReferentToken(dre, begin, t1);
    }
    
    static _ignore_list_prefix(t) {
        for (; t !== null; t = t.next) {
            if (t.is_newline_after) 
                break;
            if (t instanceof NumberToken) {
                if ((t).typ === NumberSpellingType.WORDS) 
                    break;
                let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.PARSENUMERICASADJECTIVE, 0, null);
                if (npt !== null && npt.end_char > t.end_char) 
                    break;
                continue;
            }
            if (!((t instanceof TextToken))) 
                break;
            if (!t.chars.is_letter) {
                if (BracketHelper.can_be_start_of_sequence(t, true, false)) 
                    break;
                continue;
            }
            if (t.length_char === 1 && t.next !== null && t.next.is_char_of(").")) 
                continue;
            break;
        }
        return t;
    }
    
    static try_attach(t, glos_regime, onto, max_char, this_is_def = false) {
        if (t === null) 
            return null;
        let t0 = t;
        t = DefinitionAnalyzer._ignore_list_prefix(t);
        if (t === null) 
            return null;
        let has_prefix = false;
        if (t0 !== t) 
            has_prefix = true;
        t0 = t;
        let _decree = null;
        let pt = ParenthesisToken.try_attach(t);
        if (pt !== null) {
            _decree = pt.ref;
            t = pt.end_token.next;
            if (t !== null && t.is_char(',')) 
                t = t.next;
        }
        if (t === null) 
            return null;
        let l0 = null;
        let l1 = null;
        let alt_name = null;
        let name0 = null;
        let normal_left = false;
        let can_next_sent = false;
        let coef = DefinitionKind.UNDEFINED;
        if (glos_regime) 
            coef = DefinitionKind.DEFINITION;
        let is_onto_termin = false;
        let onto_prefix = null;
        if (t.is_value("ПОД", null)) {
            t = t.next;
            normal_left = true;
        }
        else if (t.is_value("ИМЕННО", null)) 
            t = t.next;
        if ((t !== null && t.is_value("УТРАТИТЬ", null) && t.next !== null) && t.next.is_value("СИЛА", null)) {
            for (; t !== null; t = t.next) {
                if (t.is_newline_after) {
                    let re0 = new Array();
                    re0.push(new ReferentToken(null, t0, t));
                    return re0;
                }
            }
            return null;
        }
        let misc_token = null;
        for (; t !== null; t = t.next) {
            if (t !== t0 && MiscHelper.can_be_start_of_sentence(t)) 
                break;
            if (max_char > 0 && t.end_char > max_char) 
                break;
            let mt = DefinitionAnalyzer._try_attach_misc_token(t);
            if (mt !== null) {
                misc_token = mt;
                t = mt.end_token;
                normal_left = mt.morph._case.is_nominative;
                continue;
            }
            if (!((t instanceof TextToken))) {
                let r = t.get_referent();
                if (r !== null && ((r.type_name === "DECREE" || r.type_name === "DECREEPART"))) {
                    _decree = r;
                    if (l0 === null) {
                        if ((t.next !== null && MorphClass.ooEq(t.next.get_morph_class_in_dictionary(), MorphClass.VERB) && t.next.next !== null) && t.next.next.is_comma) {
                            t = t.next.next;
                            if (t.next !== null && t.next.is_value("ЧТО", null)) 
                                t = t.next;
                            continue;
                        }
                        l0 = t;
                    }
                    l1 = t;
                    continue;
                }
                if (r !== null && (((r.type_name === "ORGANIZATION" || r.type_name === "PERSONPROPERTY" || r.type_name === "STREET") || r.type_name === "GEO"))) {
                    if (l0 === null) 
                        l0 = t;
                    l1 = t;
                    continue;
                }
                if ((t instanceof NumberToken) && NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null) !== null) {
                }
                else 
                    break;
            }
            pt = ParenthesisToken.try_attach(t);
            if (pt !== null && pt.ref !== null) {
                if (pt.ref.type_name === "DECREE" || pt.ref.type_name === "DECREEPART") 
                    _decree = pt.ref;
                t = pt.end_token.next;
                if (l0 === null) 
                    continue;
                break;
            }
            if (!t.chars.is_letter) {
                if (t.is_hiphen) {
                    if (t.is_whitespace_after || t.is_whitespace_before) 
                        break;
                    continue;
                }
                if (t.is_char('(')) {
                    if (l1 === null) 
                        break;
                    let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                    if (br === null) 
                        break;
                    let tt1 = t.next;
                    if (tt1.is_value("ДАЛЕЕ", null)) {
                        tt1 = tt1.next;
                        if (!tt1.chars.is_letter) 
                            tt1 = tt1.next;
                        if (tt1 === null) 
                            return null;
                    }
                    alt_name = MiscHelper.get_text_value(tt1, br.end_token.previous, GetTextAttr.NO);
                    if (br.begin_token.next === br.end_token.previous) {
                        t = br.end_token;
                        continue;
                    }
                    t = br.end_token.next;
                    break;
                }
                if (BracketHelper.can_be_start_of_sequence(t, true, false)) {
                    let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                    if (br !== null && l0 === null && NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null) !== null) {
                        l0 = t.next;
                        l1 = br.end_token.previous;
                        alt_name = null;
                        t = br.end_token.next;
                    }
                    else if (br !== null && l0 !== null) {
                        l1 = br.end_token;
                        alt_name = null;
                        t = br.end_token;
                        continue;
                    }
                }
                break;
            }
            if (t.is_value("ЭТО", null)) 
                break;
            if (t.morph.class0.is_conjunction) {
                if (!glos_regime || !t.is_and) 
                    break;
                continue;
            }
            let npt = null;
            if (t.is_value("ДАВАТЬ", null) || t.is_value("ДАТЬ", null) || t.is_value("ФОРМУЛИРОВАТЬ", null)) {
                npt = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null && npt.noun.is_value("ОПРЕДЕЛЕНИЕ", null)) {
                    t = npt.end_token;
                    if (t.next !== null && t.next.is_value("ПОНЯТИЕ", null)) 
                        t = t.next;
                    l0 = null;
                    l1 = null;
                    normal_left = true;
                    can_next_sent = true;
                    coef = DefinitionKind.DEFINITION;
                    continue;
                }
            }
            alt_name = null;
            if (onto !== null) {
                let took = onto.try_parse(t, TerminParseAttr.NO);
                if (took !== null) {
                    if (l0 !== null) {
                        if (onto_prefix !== null) 
                            break;
                        onto_prefix = MiscHelper.get_text_value(l0, l1, GetTextAttr.KEEPREGISTER);
                    }
                    if (!is_onto_termin) {
                        is_onto_termin = true;
                        l0 = t;
                    }
                    name0 = took.termin.canonic_text;
                    t = (l1 = took.end_token);
                    continue;
                }
            }
            npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.PARSEPREPOSITION, 0, null);
            if (npt !== null && npt.internal_noun !== null) 
                break;
            if (npt === null) {
                if (l0 !== null) 
                    break;
                if (t.morph.class0.is_preposition || t.morph.class0.is_verb) 
                    break;
                if (t.morph.class0.is_adjective) {
                    let tt = null;
                    let ve = 0;
                    for (tt = t.next; tt !== null; tt = tt.next) {
                        if (tt.get_morph_class_in_dictionary().is_verb) 
                            ve++;
                        else 
                            break;
                    }
                    if ((ve > 0 && tt !== null && tt.is_value("ТАКОЙ", null)) && NounPhraseHelper.try_parse(tt.next, NounPhraseParseAttr.NO, 0, null) !== null) {
                        l0 = (l1 = t);
                        t = t.next;
                        break;
                    }
                }
                if (!t.chars.is_all_lower && t.length_char > 2 && t.get_morph_class_in_dictionary().is_undefined) {
                }
                else 
                    continue;
            }
            if (l0 === null) {
                if (t.morph.class0.is_preposition) 
                    break;
                if (DefinitionAnalyzer.m_verbot_first_words.try_parse(t, TerminParseAttr.NO) !== null && onto === null) 
                    break;
                l0 = t;
            }
            else if (t.morph.class0.is_preposition) {
                if (DefinitionAnalyzer.m_verbot_last_words.try_parse(npt.noun.begin_token, TerminParseAttr.NO) !== null || DefinitionAnalyzer.m_verbot_last_words.try_parse(npt.begin_token, TerminParseAttr.NO) !== null) {
                    t = npt.end_token.next;
                    break;
                }
            }
            if (npt !== null) {
                if (DefinitionAnalyzer.m_verbot_first_words.try_parse(npt.noun.begin_token, TerminParseAttr.NO) !== null && onto === null) 
                    break;
                let ok1 = true;
                if (!glos_regime) {
                    for (let tt = npt.begin_token; tt !== null && tt.end_char <= npt.end_char; tt = tt.next) {
                        if (tt.morph.class0.is_pronoun || tt.morph.class0.is_personal_pronoun) {
                            if (tt.is_value("ИНОЙ", null)) {
                            }
                            else {
                                ok1 = false;
                                break;
                            }
                        }
                    }
                }
                if (!ok1) 
                    break;
                t = (l1 = npt.end_token);
            }
            else 
                l1 = t;
        }
        if (!((t instanceof TextToken)) || ((l1 === null && !is_onto_termin)) || t.next === null) 
            return null;
        if (onto !== null && name0 === null) 
            return null;
        let is_not = false;
        let r0 = t;
        let r1 = null;
        if (t.is_value("НЕ", null)) {
            t = t.next;
            if (t === null) 
                return null;
            is_not = true;
        }
        let normal_right = false;
        let ok = 0;
        let hasthis = false;
        if (t.is_hiphen || t.is_char_of(":") || ((can_next_sent && t.is_char('.')))) {
            if ((t.next instanceof TextToken) && (t.next).term === "ЭТО") {
                ok = 2;
                t = t.next.next;
                hasthis = true;
            }
            else if (glos_regime) {
                ok = 2;
                t = t.next;
            }
            else if (is_onto_termin) {
                ok = 1;
                t = t.next;
            }
            else if (t.is_hiphen && t.is_whitespace_before && t.is_whitespace_after) {
                let tt = t.next;
                if (tt !== null && tt.is_value("НЕ", null)) {
                    is_not = true;
                    tt = tt.next;
                }
                let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null && npt.morph._case.is_nominative) {
                    ok = 2;
                    t = tt;
                }
                else if ((tt !== null && tt.morph._case.is_nominative && tt.morph.class0.is_verb) && tt.morph.class0.is_adjective) {
                    ok = 2;
                    t = tt;
                }
            }
            else {
                let rt0 = DefinitionAnalyzer.try_attach(t.next, false, null, max_char, false);
                if (rt0 !== null) {
                    for (const rt of rt0) {
                        if (coef === DefinitionKind.DEFINITION && (rt.referent).kind === DefinitionKind.ASSERTATION) 
                            (rt.referent).kind = coef;
                    }
                    return rt0;
                }
            }
        }
        else if ((t).term === "ЭТО") {
            let npt = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) {
                ok = 1;
                t = t.next;
                hasthis = true;
            }
        }
        else if (t.is_value("ЯВЛЯТЬСЯ", null) || t.is_value("ПРИЗНАВАТЬСЯ", null) || t.is_value("ЕСТЬ", null)) {
            if (t.is_value("ЯВЛЯТЬСЯ", null)) 
                normal_right = true;
            let t11 = t.next;
            for (; t11 !== null; t11 = t11.next) {
                if (t11.is_comma || t11.morph.class0.is_preposition || t11.morph.class0.is_conjunction) {
                }
                else 
                    break;
            }
            let npt = NounPhraseHelper.try_parse(t11, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null || t11.get_morph_class_in_dictionary().is_adjective) {
                ok = 1;
                t = t11;
                normal_left = true;
            }
            else if ((t11 !== null && t11.is_value("ОДИН", null) && t11.next !== null) && t11.next.is_value("ИЗ", null)) {
                ok = 1;
                t = t11;
                normal_left = true;
            }
            if (is_onto_termin) 
                ok = 1;
            else if (l0 === l1 && npt !== null && l0.morph.class0.is_adjective) {
                if ((((l0.morph.gender.value()) & (npt.morph.gender.value()))) !== (MorphGender.UNDEFINED.value()) || (((l0.morph.number.value()) & (npt.morph.number.value()))) === (MorphNumber.PLURAL.value())) 
                    name0 = (l0.get_normal_case_text(MorphClass.ADJECTIVE, true, npt.morph.gender, false) + " " + npt.noun.get_normal_case_text(MorphClass.NOUN, true, npt.morph.gender, false));
                else 
                    ok = 0;
            }
        }
        else if (t.is_value("ОЗНАЧАТЬ", null) || t.is_value("НЕСТИ", null)) {
            let t11 = t.next;
            if (t11 !== null && t11.is_char(':')) 
                t11 = t11.next;
            if (t11.is_value("НЕ", null) && t11.next !== null) {
                is_not = true;
                t11 = t11.next;
            }
            let npt = NounPhraseHelper.try_parse(t11, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null || is_onto_termin) {
                ok = 1;
                t = t11;
            }
        }
        else if (t.is_value("ВЫРАЖАТЬ", null)) {
            let t11 = t.next;
            for (; t11 !== null; t11 = t11.next) {
                if ((t11.morph.class0.is_pronoun || t11.is_comma || t11.morph.class0.is_preposition) || t11.morph.class0.is_conjunction) {
                }
                else 
                    break;
            }
            let npt = NounPhraseHelper.try_parse(t11, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null || is_onto_termin) {
                ok = 1;
                t = t11;
            }
        }
        else if (((t.is_value("СЛЕДОВАТЬ", null) || t.is_value("МОЖНО", null))) && t.next !== null && ((t.next.is_value("ПОНИМАТЬ", null) || t.next.is_value("ОПРЕДЕЛИТЬ", null) || t.next.is_value("СЧИТАТЬ", null)))) {
            let t11 = t.next.next;
            if (t11 === null) 
                return null;
            if (t11.is_value("КАК", null)) 
                t11 = t11.next;{
                    ok = 2;
                    t = t11;
                }
        }
        else if (t.is_value("ПРЕДСТАВЛЯТЬ", null) && t.next !== null && t.next.is_value("СОБОЙ", null)) {
            let t11 = t.next.next;
            if (t11 === null) 
                return null;
            let npt = NounPhraseHelper.try_parse(t11, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null || t11.morph.class0.is_adjective || is_onto_termin) {
                ok = 1;
                t = t11;
            }
        }
        else if ((((t.is_value("ДОЛЖЕН", null) || t.is_value("ДОЛЖНЫЙ", null))) && t.next !== null && t.next.is_value("ПРЕДСТАВЛЯТЬ", null)) && t.next.next !== null && t.next.next.is_value("СОБОЙ", null)) {
            let t11 = t.next.next.next;
            if (t11 === null) 
                return null;
            let npt = NounPhraseHelper.try_parse(t11, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null || t11.morph.class0.is_adjective || is_onto_termin) {
                ok = 1;
                t = t11;
            }
        }
        else if (t.is_value("ДОЛЖНЫЙ", null)) {
            if (t.next !== null && t.next.morph.class0.is_verb) 
                t = t.next;
            ok = 1;
        }
        else if (((((((((t.is_value("МОЖЕТ", null) || t.is_value("МОЧЬ", null) || t.is_value("ВПРАВЕ", null)) || t.is_value("ЗАПРЕЩЕНО", null) || t.is_value("РАЗРЕШЕНО", null)) || t.is_value("ОТВЕЧАТЬ", null) || t.is_value("ПРИЗНАВАТЬ", null)) || t.is_value("ОСВОБОЖДАТЬ", null) || t.is_value("ОСУЩЕСТВЛЯТЬ", null)) || t.is_value("ПРОИЗВОДИТЬ", null) || t.is_value("ПОДЛЕЖАТЬ", null)) || t.is_value("ПРИНИМАТЬ", null) || t.is_value("СЧИТАТЬ", null)) || t.is_value("ИМЕТЬ", null) || t.is_value("ВПРАВЕ", null)) || t.is_value("ОБЯЗАН", null) || t.is_value("ОБЯЗАТЬ", null))) 
            ok = 1;
        if (ok === 0) 
            return null;
        if (t === null) 
            return null;
        if (t.is_value("НЕ", null)) {
            if (!is_onto_termin) 
                return null;
        }
        let dr = new DefinitionReferent();
        normal_left = true;
        let nam = (name0 != null ? name0 : MiscHelper.get_text_value(l0, l1, (normal_left ? GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE : GetTextAttr.NO)));
        if (nam === null) 
            return null;
        if (name0 === null) {
        }
        if (name0 === null) 
            dr.tag = MetaToken._new834(l0, l1, normal_left);
        if (l0 === l1 && l0.morph.class0.is_adjective && l0.morph._case.is_instrumental) {
            if (t !== null && t.is_value("ТАКОЙ", null)) {
                let npt = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null && npt.morph._case.is_nominative) {
                    let str = l0.get_normal_case_text(MorphClass.ADJECTIVE, npt.morph.number === MorphNumber.PLURAL, npt.morph.gender, false);
                    if (str === null) 
                        str = l0.get_normal_case_text(MorphClass.ADJECTIVE, true, MorphGender.UNDEFINED, false);
                    nam = (str + " " + npt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false));
                }
            }
        }
        if (_decree !== null) {
            for (let tt = l0; tt !== null && tt.end_char <= l1.end_char; tt = tt.next) {
                if (tt.get_referent() === _decree) {
                    _decree = null;
                    break;
                }
            }
        }
        if (nam.endsWith(")") && alt_name === null) {
            let ii = nam.lastIndexOf('(');
            if (ii > 0) {
                alt_name = nam.substring(ii + 1, ii + 1 + nam.length - ii - 2).trim();
                nam = nam.substring(0, 0 + ii).trim();
            }
        }
        dr.add_slot(DefinitionReferent.ATTR_TERMIN, nam, false, 0);
        if (alt_name !== null) 
            dr.add_slot(DefinitionReferent.ATTR_TERMIN, alt_name, false, 0);
        if (!is_onto_termin) {
            let npt2 = NounPhraseHelper.try_parse(l0, NounPhraseParseAttr.NO, 0, null);
            if (npt2 !== null && npt2.morph.number === MorphNumber.PLURAL) {
                nam = MiscHelper.get_text_value(l0, l1, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE);
                if (nam !== null) 
                    dr.add_slot(DefinitionReferent.ATTR_TERMIN, nam, false, 0);
            }
        }
        if (misc_token !== null) {
            if (misc_token.morph.class0.is_noun) 
                dr.add_slot(DefinitionReferent.ATTR_TERMIN_ADD, Utils.asString(misc_token.tag), false, 0);
            else 
                dr.add_slot(DefinitionReferent.ATTR_MISC, Utils.asString(misc_token.tag), false, 0);
        }
        let t1 = null;
        let multi_parts = null;
        for (; t !== null; t = t.next) {
            if (MiscHelper.can_be_start_of_sentence(t)) 
                break;
            if (max_char > 0 && t.end_char > max_char) 
                break;
            t1 = t;
            if (t.is_char('(') && (t.next instanceof ReferentToken)) {
                let r = t.next.get_referent();
                if (r.type_name === "DECREE" || r.type_name === "DECREEPART") {
                    _decree = r;
                    t1 = (t = t.next);
                    while (t.next !== null) {
                        if (t.next.is_comma_and && (t.next.next instanceof ReferentToken) && ((t.next.next.get_referent().type_name === "DECREE" || t.next.next.get_referent().type_name === "DECREEPART"))) 
                            t1 = (t = t.next.next);
                        else 
                            break;
                    }
                    if (t1.next !== null && t1.next.is_char(')')) 
                        t = (t1 = t1.next);
                    continue;
                }
            }
            if (t.is_char('(') && t.next !== null && t.next.is_value("ДАЛЕЕ", null)) {
                let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (br !== null) {
                    t = (t1 = br.end_token);
                    continue;
                }
            }
            if (t.is_char(':') && t.is_whitespace_after) {
                let mt = DefinitionAnalyzer._try_parse_list_item(t.next);
                if (mt !== null) {
                    multi_parts = new Array();
                    multi_parts.push(mt);
                    for (let tt = mt.end_token.next; tt !== null; tt = tt.next) {
                        if (max_char > 0 && tt.end_char > max_char) 
                            break;
                        mt = DefinitionAnalyzer._try_parse_list_item(tt);
                        if (mt === null) 
                            break;
                        multi_parts.push(mt);
                        tt = mt.end_token;
                    }
                    break;
                }
            }
            if (!t.is_char_of(";.")) 
                r1 = t;
        }
        if (r1 === null) 
            return null;
        if (r0.next !== null && (r0 instanceof TextToken) && !r0.chars.is_letter) 
            r0 = r0.next;
        normal_right = false;
        let df = MiscHelper.get_text_value(r0, r1, GetTextAttr.of((((normal_right ? GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE : GetTextAttr.NO)).value()) | (GetTextAttr.KEEPREGISTER.value())));
        if (multi_parts !== null) {
            let res1 = new Array();
            dr.kind = (is_not ? DefinitionKind.NEGATION : DefinitionKind.ASSERTATION);
            for (const mp of multi_parts) {
                let dr1 = dr.clone();
                let tmp = new StringBuilder();
                if (df !== null) {
                    tmp.append(df);
                    if (tmp.length > 0 && tmp.charAt(tmp.length - 1) === ':') 
                        tmp.length = tmp.length - 1;
                    tmp.append(": ");
                    tmp.append(MiscHelper.get_text_value(mp.begin_token, mp.end_token, GetTextAttr.KEEPREGISTER));
                }
                dr1.add_slot(DefinitionReferent.ATTR_VALUE, tmp.toString(), false, 0);
                res1.push(new ReferentToken(dr1, (res1.length === 0 ? t0 : mp.begin_token), mp.end_token));
            }
            return res1;
        }
        if (df === null || (df.length < 20)) 
            return null;
        if (onto_prefix !== null) 
            df = (onto_prefix + " " + df);
        if ((coef === DefinitionKind.UNDEFINED && ok > 1 && !is_not) && multi_parts === null) {
            let all_nps = true;
            let cou_npt = 0;
            for (let tt = l0; tt !== null && tt.end_char <= l1.end_char; tt = tt.next) {
                let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.REFERENTCANBENOUN, 0, null);
                if (npt === null && tt.morph.class0.is_preposition) 
                    npt = NounPhraseHelper.try_parse(tt.next, NounPhraseParseAttr.NO, 0, null);
                if (npt === null) {
                    all_nps = false;
                    break;
                }
                cou_npt++;
                tt = npt.end_token;
            }
            if (all_nps && (cou_npt < 5)) {
                if ((Utils.intDiv(df.length, 3)) > nam.length) 
                    coef = DefinitionKind.DEFINITION;
            }
        }
        if ((t1.is_char(';') && t1.is_newline_after && onto !== null) && !has_prefix && multi_parts === null) {
            let tmp = new StringBuilder();
            tmp.append(df);
            for (t = t1.next; t !== null; t = t.next) {
                if (t.is_char('(')) {
                    let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                    if (br !== null) {
                        t = br.end_token;
                        continue;
                    }
                }
                let tt = DefinitionAnalyzer._ignore_list_prefix(t);
                if (tt === null) 
                    break;
                let tt1 = null;
                for (let ttt1 = tt; ttt1 !== null; ttt1 = ttt1.next) {
                    if (ttt1.is_newline_after) {
                        tt1 = ttt1;
                        break;
                    }
                }
                if (tt1 === null) 
                    break;
                let df1 = MiscHelper.get_text_value(tt, (tt1.is_char_of(".;") ? tt1.previous : tt1), GetTextAttr.KEEPREGISTER);
                if (df1 === null) 
                    break;
                tmp.append(";\n ").append(df1);
                t = (t1 = tt1);
                if (!tt1.is_char(';')) 
                    break;
            }
            df = tmp.toString();
        }
        dr.add_slot(DefinitionReferent.ATTR_VALUE, df, false, 0);
        if (is_not) 
            coef = DefinitionKind.NEGATION;
        else if (hasthis && this_is_def) 
            coef = DefinitionKind.DEFINITION;
        else if (misc_token !== null && !misc_token.morph.class0.is_noun) 
            coef = DefinitionKind.ASSERTATION;
        if (coef === DefinitionKind.UNDEFINED) 
            coef = DefinitionKind.ASSERTATION;
        if (_decree !== null) 
            dr.add_slot(DefinitionReferent.ATTR_DECREE, _decree, false, 0);
        dr.kind = coef;
        let res = new Array();
        res.push(new ReferentToken(dr, t0, t1));
        return res;
    }
    
    /**
     * Это распознавание случая, когда термин находится в конце
     * @param t 
     * @param onto 
     * @param max_char 
     * @return 
     */
    try_attach_end(t, onto, max_char) {
        if (t === null) 
            return null;
        let t0 = t;
        t = DefinitionAnalyzer._ignore_list_prefix(t);
        if (t === null) 
            return null;
        let has_prefix = false;
        if (t0 !== t) 
            has_prefix = true;
        t0 = t;
        let _decree = null;
        let pt = ParenthesisToken.try_attach(t);
        if (pt !== null) {
            _decree = pt.ref;
            t = pt.end_token.next;
            if (t !== null && t.is_char(',')) 
                t = t.next;
        }
        if (t === null) 
            return null;
        let r0 = t0;
        let r1 = null;
        let l0 = null;
        for (; t !== null; t = t.next) {
            if (t !== t0 && MiscHelper.can_be_start_of_sentence(t)) 
                break;
            if (max_char > 0 && t.end_char > max_char) 
                break;
            if (t.is_value("НАЗЫВАТЬ", null) || t.is_value("ИМЕНОВАТЬ", null)) {
            }
            else 
                continue;
            r1 = t.previous;
            for (let tt = r1; tt !== null; tt = tt.previous) {
                if ((tt.is_value("БУДЕМ", null) || tt.is_value("ДАЛЬНЕЙШИЙ", null) || tt.is_value("ДАЛЕЕ", null)) || tt.is_value("В", null)) 
                    r1 = tt.previous;
                else 
                    break;
            }
            l0 = t.next;
            for (let tt = l0; tt !== null; tt = tt.next) {
                if ((tt.is_value("БУДЕМ", null) || tt.is_value("ДАЛЬНЕЙШИЙ", null) || tt.is_value("ДАЛЕЕ", null)) || tt.is_value("В", null)) 
                    l0 = tt.next;
                else 
                    break;
            }
            break;
        }
        if (l0 === null || r1 === null) 
            return null;
        let l1 = null;
        let cou = 0;
        for (t = l0; t !== null; t = t.next) {
            let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
            if (npt === null && t !== l0 && t.morph.class0.is_preposition) 
                npt = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
            if (npt === null) 
                break;
            l1 = (t = npt.end_token);
            cou++;
        }
        if (l1 === null || cou > 3) 
            return null;
        if ((((l1.end_char - l0.end_char)) * 2) > ((r1.end_char - r0.end_char))) 
            return null;
        let dr = DefinitionReferent._new1116(DefinitionKind.DEFINITION);
        let nam = MiscHelper.get_text_value(l0, l1, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE);
        if (nam === null) 
            return null;
        dr.add_slot(DefinitionReferent.ATTR_TERMIN, nam, false, 0);
        let df = MiscHelper.get_text_value(r0, r1, GetTextAttr.KEEPREGISTER);
        dr.add_slot(DefinitionReferent.ATTR_VALUE, df, false, 0);
        t = l1.next;
        if (t === null) {
        }
        else if (t.is_char_of(".;")) 
            l1 = t;
        else if (t.is_comma) 
            l1 = t;
        else if (MiscHelper.can_be_start_of_sentence(t)) {
        }
        else 
            return null;
        let res = new Array();
        res.push(new ReferentToken(dr, r0, l1));
        return res;
    }
    
    static _try_attach_misc_token(t) {
        if (t === null) 
            return null;
        if (t.is_char('(')) {
            let mt = DefinitionAnalyzer._try_attach_misc_token(t.next);
            if (mt !== null && mt.end_token.next !== null && mt.end_token.next.is_char(')')) {
                mt.begin_token = t;
                mt.end_token = mt.end_token.next;
                return mt;
            }
            return null;
        }
        if (t.is_value("КАК", null)) {
            let t1 = null;
            for (let tt = t.next; tt !== null; tt = tt.next) {
                if (tt.is_newline_before) 
                    break;
                let npt1 = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                if (npt1 === null) 
                    break;
                if (t1 === null || npt1.morph._case.is_genitive) {
                    t1 = (tt = npt1.end_token);
                    continue;
                }
                break;
            }
            if (t1 !== null) {
                let res = MetaToken._new834(t, t1, MiscHelper.get_text_value(t, t1, GetTextAttr.KEEPQUOTES));
                res.morph.class0 = MorphClass.NOUN;
                return res;
            }
            return null;
        }
        let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.PARSENUMERICASADJECTIVE, 0, null);
        if (npt !== null) {
            if (DefinitionAnalyzer.m_misc_first_words.try_parse(npt.noun.begin_token, TerminParseAttr.NO) !== null) {
                let res = MetaToken._new834(t, npt.end_token, npt.get_normal_case_text(null, true, MorphGender.UNDEFINED, false));
                res.morph._case = MorphCase.NOMINATIVE;
                return res;
            }
        }
        if (t.is_value("В", null)) {
            npt = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) {
                if (npt.noun.is_value("СМЫСЛ", null)) {
                    let res = MetaToken._new834(t, npt.end_token, MiscHelper.get_text_value(t, npt.end_token, GetTextAttr.NO));
                    res.morph.class0 = MorphClass.NOUN;
                    return res;
                }
            }
        }
        return null;
    }
    
    static _try_parse_list_item(t) {
        if (t === null || !t.is_whitespace_before) 
            return null;
        let tt = null;
        let pr = 0;
        for (tt = t; tt !== null; tt = tt.next) {
            if (tt.is_whitespace_before && tt !== t) 
                break;
            if (tt instanceof NumberToken) {
                pr++;
                continue;
            }
            let nex = NumberHelper.try_parse_roman(tt);
            if (nex !== null) {
                pr++;
                tt = nex.end_token;
                continue;
            }
            if (!((tt instanceof TextToken))) 
                break;
            if (!tt.chars.is_letter) {
                if (!tt.is_char('(')) 
                    pr++;
            }
            else if (tt.length_char > 1 || tt.is_whitespace_after) 
                break;
            else 
                pr++;
        }
        if (tt === null) 
            return null;
        if (pr === 0) {
            if (t.is_char('(')) 
                return null;
            if ((tt instanceof TextToken) && tt.chars.is_all_lower) 
                pr++;
        }
        if (pr === 0) 
            return null;
        let res = new MetaToken(tt, tt);
        for (; tt !== null; tt = tt.next) {
            if (tt.is_newline_before && tt !== t) 
                break;
            else 
                res.end_token = tt;
        }
        return res;
    }
    
    static initialize() {
        if (DefinitionAnalyzer.m_proc0 !== null) 
            return;
        MetaDefin.initialize();
        try {
            DefinitionAnalyzer.m_proc0 = ProcessorService.create_empty_processor();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
            DefinitionAnalyzer.m_misc_first_words = new TerminCollection();
            for (const s of ["ЧЕРТА", "ХАРАКТЕРИСТИКА", "ОСОБЕННОСТЬ", "СВОЙСТВО", "ПРИЗНАК", "ПРИНЦИП", "РАЗНОВИДНОСТЬ", "ВИД", "ПОКАЗАТЕЛЬ", "ЗНАЧЕНИЕ"]) {
                DefinitionAnalyzer.m_misc_first_words.add(new Termin(s, MorphLang.RU, true));
            }
            DefinitionAnalyzer.m_verbot_first_words = new TerminCollection();
            for (const s of ["ЦЕЛЬ", "БОЛЬШИНСТВО", "ЧАСТЬ", "ЗАДАЧА", "ИСКЛЮЧЕНИЕ", "ПРИМЕР", "ЭТАП", "ШАГ", "СЛЕДУЮЩИЙ", "ПОДОБНЫЙ", "АНАЛОГИЧНЫЙ", "ПРЕДЫДУЩИЙ", "ПОХОЖИЙ", "СХОЖИЙ", "НАЙДЕННЫЙ", "НАИБОЛЕЕ", "НАИМЕНЕЕ", "ВАЖНЫЙ", "РАСПРОСТРАНЕННЫЙ"]) {
                DefinitionAnalyzer.m_verbot_first_words.add(new Termin(s, MorphLang.RU, true));
            }
            DefinitionAnalyzer.m_verbot_last_words = new TerminCollection();
            for (const s of ["СТАТЬЯ", "ГЛАВА", "РАЗДЕЛ", "КОДЕКС", "ЗАКОН", "ФОРМУЛИРОВКА", "НАСТОЯЩИЙ", "ВЫШЕУКАЗАННЫЙ", "ДАННЫЙ"]) {
                DefinitionAnalyzer.m_verbot_last_words.add(new Termin(s, MorphLang.RU, true));
            }
            ParenthesisToken.initialize();
        } catch (ex) {
            throw new Error(ex.message);
        }
        Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
        ProcessorService.register_analyzer(new DefinitionAnalyzer());
    }
    
    /**
     * Вычисление коэффициента семантической близости 2-х текстов. 
     *  Учитываются именные группы (существительные с возможными прилагательными).
     * @param text1 первый текст
     * @param text2 второй текст
     * @return 0 - ничего общего, 100 - полное соответствие (тождество)
     */
    static calc_semantic_coef(text1, text2) {
        let ar1 = DefinitionAnalyzer.m_proc0.process(new SourceOfAnalysis(text1), null, null);
        if (ar1 === null || ar1.first_token === null) 
            return 0;
        let ar2 = DefinitionAnalyzer.m_proc0.process(new SourceOfAnalysis(text2), null, null);
        if (ar2 === null || ar2.first_token === null) 
            return 0;
        let terms1 = new Array();
        let terms2 = new Array();
        for (let k = 0; k < 2; k++) {
            let terms = (k === 0 ? terms1 : terms2);
            for (let t = ((k === 0 ? ar1.first_token : ar2.first_token)); t !== null; t = t.next) {
                let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null) {
                    let term = npt.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
                    if (term === null) 
                        continue;
                    if (!terms.includes(term)) 
                        terms.push(term);
                    continue;
                }
            }
        }
        if (terms2.length === 0 || terms1.length === 0) 
            return 0;
        let coef = 0;
        for (const w of terms1) {
            if (terms2.includes(w)) 
                coef += 2;
        }
        return Utils.intDiv(coef * 100, (terms1.length + terms2.length));
    }
    
    /**
     * Выделить ключевые концепты из текста. 
     *  Концепт - это нормализованная комбинация ключевых слов, причём дериватная нормализация 
     *  (СЛУЖИТЬ -> СЛУЖБА).
     * @param txt текст
     * @param do_normalize_for_english делать ли для английского языка нормализацию по дериватам
     * @return список концептов
     */
    static get_concepts(txt, do_normalize_for_english = false) {
        let ar = DefinitionAnalyzer.m_proc0.process(new SourceOfAnalysis(txt), null, null);
        let res = new Array();
        let tmp = new Array();
        let tmp2 = new StringBuilder();
        if (ar !== null) {
            for (let t = ar.first_token; t !== null; t = t.next) {
                let t1 = null;
                let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.PARSENUMERICASADJECTIVE, 0, null);
                if (npt !== null) 
                    t1 = npt.end_token;
                else if ((t instanceof TextToken) && (t).is_pure_verb) 
                    t1 = t;
                if (t1 === null) 
                    continue;
                for (let tt = t1.next; tt !== null; tt = tt.next) {
                    let npt2 = null;
                    if (tt.is_and) {
                        npt2 = NounPhraseHelper.try_parse(tt.next, NounPhraseParseAttr.of((NounPhraseParseAttr.PARSENUMERICASADJECTIVE.value()) | (NounPhraseParseAttr.PARSEPREPOSITION.value())), 0, null);
                        if (npt2 !== null) {
                            tt = (t1 = npt2.end_token);
                            continue;
                        }
                        break;
                    }
                    npt2 = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.of((NounPhraseParseAttr.PARSENUMERICASADJECTIVE.value()) | (NounPhraseParseAttr.PARSEPREPOSITION.value())), 0, null);
                    if (npt2 !== null) {
                        if (npt2.preposition !== null) {
                            tt = (t1 = npt2.end_token);
                            continue;
                        }
                        else if (npt2.morph._case.is_genitive || npt2.morph._case.is_instrumental) {
                            tt = (t1 = npt2.end_token);
                            continue;
                        }
                    }
                    break;
                }
                let vars = new Array();
                for (let tt = t; tt !== null && tt.end_char <= t1.end_char; tt = tt.next) {
                    if (!((tt instanceof TextToken))) 
                        continue;
                    if (tt.is_comma_and || t.morph.class0.is_preposition) 
                        continue;
                    let w = (tt).get_lemma();
                    if (w.length < 3) 
                        continue;
                    if (tt.chars.is_latin_letter && !do_normalize_for_english) {
                    }
                    else {
                        let dg = Explanatory.find_derivates(w, true, null);
                        if (dg !== null && dg.length === 1) {
                            if (dg[0].words.length > 0) 
                                w = dg[0].words[0].spelling.toUpperCase();
                        }
                    }
                    if (tt.previous !== null && tt.previous.is_comma_and && vars.length > 0) 
                        vars[vars.length - 1].push(w);
                    else {
                        let li = new Array();
                        li.push(w);
                        vars.push(li);
                    }
                }
                t = t1;
                if (vars.length === 0) 
                    continue;
                let inds = new Int32Array(vars.length);
                while (true) {
                    tmp.splice(0, tmp.length);
                    for (let i = 0; i < vars.length; i++) {
                        let w = vars[i][inds[i]];
                        if (!tmp.includes(w)) 
                            tmp.push(w);
                    }
                    tmp.sort();
                    tmp2.length = 0;
                    for (let i = 0; i < tmp.length; i++) {
                        if (tmp2.length > 0) 
                            tmp2.append(' ');
                        tmp2.append(tmp[i]);
                    }
                    let ww = tmp2.toString();
                    if (!res.includes(ww)) 
                        res.push(ww);
                    let j = 0;
                    for (j = vars.length - 1; j >= 0; j--) {
                        if ((inds[j] + 1) < vars[j].length) {
                            inds[j]++;
                            break;
                        }
                        else 
                            inds[j] = 0;
                    }
                    if (j < 0) 
                        break;
                }
            }
        }
        return res;
    }
    
    static static_constructor() {
        DefinitionAnalyzer.ANALYZER_NAME = "THESIS";
        DefinitionAnalyzer.m_misc_first_words = null;
        DefinitionAnalyzer.m_verbot_first_words = null;
        DefinitionAnalyzer.m_verbot_last_words = null;
        DefinitionAnalyzer.m_proc0 = null;
    }
}


DefinitionAnalyzer.static_constructor();

module.exports = DefinitionAnalyzer
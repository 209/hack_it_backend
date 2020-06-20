/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const StringBuilder = require("./../../unisharp/StringBuilder");

const Referent = require("./../Referent");
const ReferentToken = require("./../ReferentToken");
const MorphGender = require("./../../morph/MorphGender");
const Explanatory = require("./../../semantic/utils/Explanatory");
const Token = require("./../Token");
const GetTextAttr = require("./../core/GetTextAttr");
const MetaToken = require("./../MetaToken");
const ProcessorService = require("./../ProcessorService");
const Termin = require("./../core/Termin");
const AutoannoSentToken = require("./internal/AutoannoSentToken");
const MorphClass = require("./../../morph/MorphClass");
const UriReferent = require("./../uri/UriReferent");
const BankDataReferent = require("./../bank/BankDataReferent");
const DenominationReferent = require("./../denomination/DenominationReferent");
const PhoneReferent = require("./../phone/PhoneReferent");
const AnalyzerDataWithOntology = require("./../core/AnalyzerDataWithOntology");
const KeywordType = require("./KeywordType");
const KeywordMeta = require("./internal/KeywordMeta");
const MoneyReferent = require("./../money/MoneyReferent");
const EpNerCoreInternalResourceHelper = require("./../core/internal/EpNerCoreInternalResourceHelper");
const TextToken = require("./../TextToken");
const NounPhraseParseAttr = require("./../core/NounPhraseParseAttr");
const Analyzer = require("./../Analyzer");
const NounPhraseHelper = require("./../core/NounPhraseHelper");
const KeywordReferent = require("./KeywordReferent");
const MiscHelper = require("./../core/MiscHelper");
const DenominationAnalyzer = require("./../denomination/DenominationAnalyzer");

/**
 * Анализатор ключевых комбинаций
 */
class KeywordAnalyzer extends Analyzer {
    
    constructor() {
        super();
        this.annotation_max_sentences = 3;
    }
    
    get name() {
        return KeywordAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Ключевые слова";
    }
    
    get description() {
        return "Ключевые слова для различных аналитических систем";
    }
    
    clone() {
        return new KeywordAnalyzer();
    }
    
    get used_extern_object_types() {
        return ["ALL"];
    }
    
    get is_specific() {
        return true;
    }
    
    create_analyzer_data() {
        return new AnalyzerDataWithOntology();
    }
    
    get type_system() {
        return [KeywordMeta.GLOBAL_META];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(KeywordMeta.IMAGE_OBJ, EpNerCoreInternalResourceHelper.get_bytes("kwobject.png"));
        res.put(KeywordMeta.IMAGE_PRED, EpNerCoreInternalResourceHelper.get_bytes("kwpredicate.png"));
        res.put(KeywordMeta.IMAGE_REF, EpNerCoreInternalResourceHelper.get_bytes("kwreferent.png"));
        return res;
    }
    
    create_referent(type) {
        if (type === KeywordReferent.OBJ_TYPENAME) 
            return new KeywordReferent();
        return null;
    }
    
    get progress_weight() {
        return 1;
    }
    
    /**
     * Основная функция выделения телефонов
     * @param cnt 
     * @param stage 
     * @return 
     */
    process(kit) {
        let ad = kit.get_analyzer_data(this);
        let has_denoms = false;
        for (const a of kit.processor.analyzers) {
            if ((a instanceof DenominationAnalyzer) && !a.ignore_this_analyzer) 
                has_denoms = true;
        }
        if (!has_denoms) {
            let a = new DenominationAnalyzer();
            a.process(kit);
        }
        let li = new Array();
        let tmp = new StringBuilder();
        let tmp2 = new Array();
        let max = 0;
        for (let t = kit.first_token; t !== null; t = t.next) {
            max++;
        }
        let cur = 0;
        for (let t = kit.first_token; t !== null; t = t.next,cur++) {
            let r = t.get_referent();
            if (r !== null) {
                t = this._add_referents(ad, t, cur, max);
                continue;
            }
            if (!((t instanceof TextToken))) 
                continue;
            if (!t.chars.is_letter || (t.length_char < 3)) 
                continue;
            let term = (t).term;
            if (term === "ЕСТЬ") {
                if ((t.previous instanceof TextToken) && t.previous.morph.class0.is_verb) {
                }
                else 
                    continue;
            }
            let npt = null;
            npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.of((NounPhraseParseAttr.ADJECTIVECANBELAST.value()) | (NounPhraseParseAttr.PARSEPREPOSITION.value())), 0, null);
            if (npt === null) {
                let mc = t.get_morph_class_in_dictionary();
                if (mc.is_verb && !mc.is_preposition) {
                    if ((t).is_verb_be) 
                        continue;
                    if (t.is_value("МОЧЬ", null) || t.is_value("WOULD", null)) 
                        continue;
                    let kref = KeywordReferent._new1589(KeywordType.PREDICATE);
                    let norm = t.get_normal_case_text(MorphClass.VERB, true, MorphGender.UNDEFINED, false);
                    if (norm === null) 
                        norm = (t).get_lemma();
                    if (norm.endsWith("ЬСЯ")) 
                        norm = norm.substring(0, 0 + norm.length - 2);
                    kref.add_slot(KeywordReferent.ATTR_VALUE, norm, false, 0);
                    let drv = Explanatory.find_derivates(norm, true, t.morph.language);
                    KeywordAnalyzer._add_normals(kref, drv, norm);
                    kref = Utils.as(ad.register_referent(kref), KeywordReferent);
                    KeywordAnalyzer._set_rank(kref, cur, max);
                    let rt1 = ReferentToken._new743(ad.register_referent(kref), t, t, t.morph);
                    kit.embed_token(rt1);
                    t = rt1;
                    continue;
                }
                continue;
            }
            if (npt.internal_noun !== null) 
                continue;
            if (npt.end_token.is_value("ЦЕЛОМ", null) || npt.end_token.is_value("ЧАСТНОСТИ", null)) {
                if (npt.preposition !== null) {
                    t = npt.end_token;
                    continue;
                }
            }
            if (npt.end_token.is_value("СТОРОНЫ", null) && npt.preposition !== null && npt.preposition.normal === "С") {
                t = npt.end_token;
                continue;
            }
            if (npt.begin_token === npt.end_token) {
                let mc = t.get_morph_class_in_dictionary();
                if (mc.is_preposition) 
                    continue;
                else if (mc.is_adverb) {
                    if (t.is_value("ПОТОМ", null)) 
                        continue;
                }
            }
            else {
            }
            li.splice(0, li.length);
            let t0 = t;
            for (let tt = t; tt !== null && tt.end_char <= npt.end_char; tt = tt.next) {
                if (!((tt instanceof TextToken))) 
                    continue;
                if (tt.is_value("NATURAL", null)) {
                }
                if ((tt.length_char < 3) || !tt.chars.is_letter) 
                    continue;
                let mc = tt.get_morph_class_in_dictionary();
                if ((mc.is_preposition || mc.is_pronoun || mc.is_personal_pronoun) || mc.is_conjunction) {
                    if (tt.is_value("ОТНОШЕНИЕ", null)) {
                    }
                    else 
                        continue;
                }
                if (mc.is_misc) {
                    if (MiscHelper.is_eng_article(tt)) 
                        continue;
                }
                let kref = KeywordReferent._new1589(KeywordType.OBJECT);
                let norm = (tt).get_lemma();
                kref.add_slot(KeywordReferent.ATTR_VALUE, norm, false, 0);
                if (norm !== "ЕСТЬ") {
                    let drv = Explanatory.find_derivates(norm, true, tt.morph.language);
                    KeywordAnalyzer._add_normals(kref, drv, norm);
                }
                kref = Utils.as(ad.register_referent(kref), KeywordReferent);
                KeywordAnalyzer._set_rank(kref, cur, max);
                let rt1 = ReferentToken._new743(kref, tt, tt, tt.morph);
                kit.embed_token(rt1);
                if (tt === t && li.length === 0) 
                    t0 = rt1;
                t = rt1;
                li.push(kref);
            }
            if (li.length > 1) {
                let kref = KeywordReferent._new1589(KeywordType.OBJECT);
                tmp.length = 0;
                tmp2.splice(0, tmp2.length);
                let has_norm = false;
                for (const kw of li) {
                    let s = kw.get_string_value(KeywordReferent.ATTR_VALUE);
                    if (tmp.length > 0) 
                        tmp.append(' ');
                    tmp.append(s);
                    let n = kw.get_string_value(KeywordReferent.ATTR_NORMAL);
                    if (n !== null) {
                        has_norm = true;
                        tmp2.push(n);
                    }
                    else 
                        tmp2.push(s);
                    kref.add_slot(KeywordReferent.ATTR_REF, kw, false, 0);
                }
                let val = npt.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
                kref.add_slot(KeywordReferent.ATTR_VALUE, val, false, 0);
                tmp.length = 0;
                tmp2.sort();
                for (const s of tmp2) {
                    if (tmp.length > 0) 
                        tmp.append(' ');
                    tmp.append(s);
                }
                let norm = tmp.toString();
                if (norm !== val) 
                    kref.add_slot(KeywordReferent.ATTR_NORMAL, norm, false, 0);
                kref = Utils.as(ad.register_referent(kref), KeywordReferent);
                KeywordAnalyzer._set_rank(kref, cur, max);
                let rt1 = ReferentToken._new743(kref, t0, t, npt.morph);
                kit.embed_token(rt1);
                t = rt1;
            }
        }
        cur = 0;
        for (let t = kit.first_token; t !== null; t = t.next,cur++) {
            let kw = Utils.as(t.get_referent(), KeywordReferent);
            if (kw === null || kw.typ !== KeywordType.OBJECT) 
                continue;
            if (t.next === null || kw.child_words > 2) 
                continue;
            let t1 = t.next;
            if (t1.is_value("OF", null) && (t1.whitespaces_after_count < 3) && t1.next !== null) {
                t1 = t1.next;
                if ((t1 instanceof TextToken) && MiscHelper.is_eng_article(t1) && t1.next !== null) 
                    t1 = t1.next;
            }
            else if (!t1.morph._case.is_genitive || t.whitespaces_after_count > 1) 
                continue;
            let kw2 = Utils.as(t1.get_referent(), KeywordReferent);
            if (kw2 === null) 
                continue;
            if (kw2.typ !== KeywordType.OBJECT || (kw.child_words + kw2.child_words) > 3) 
                continue;
            let kw_un = new KeywordReferent();
            kw_un.union(kw, kw2, MiscHelper.get_text_value(t1, t1, GetTextAttr.NO));
            kw_un = Utils.as(ad.register_referent(kw_un), KeywordReferent);
            KeywordAnalyzer._set_rank(kw_un, cur, max);
            let rt1 = ReferentToken._new743(kw_un, t, t1, t.morph);
            kit.embed_token(rt1);
            t = rt1;
        }
        if (KeywordAnalyzer.SORT_KEYWORDS_BY_RANK) {
            let all = Array.from(ad.referents);
            all.sort((new KeywordAnalyzer.CompByRank()).compare);
            ad.referents = all;
        }
        if (this.annotation_max_sentences > 0) {
            let ano = AutoannoSentToken.create_annotation(kit, this.annotation_max_sentences);
            if (ano !== null) 
                ad.register_referent(ano);
        }
    }
    
    static _calc_rank(gr) {
        if (gr.is_dummy) 
            return 0;
        let res = 0;
        for (const w of gr.words) {
            if (w.lang.is_ru && w.class0 !== null) {
                if (w.class0.is_verb && w.class0.is_adjective) {
                }
                else 
                    res++;
            }
        }
        if (gr.prefix === null) 
            res += 3;
        return res;
    }
    
    static _add_normals(kref, grs, norm) {
        if (grs === null || grs.length === 0) 
            return;
        for (let k = 0; k < grs.length; k++) {
            let ch = false;
            for (let i = 0; i < (grs.length - 1); i++) {
                if (KeywordAnalyzer._calc_rank(grs[i]) < KeywordAnalyzer._calc_rank(grs[i + 1])) {
                    let gr = grs[i];
                    grs[i] = grs[i + 1];
                    grs[i + 1] = gr;
                    ch = true;
                }
            }
            if (!ch) 
                break;
        }
        for (let i = 0; (i < 3) && (i < grs.length); i++) {
            if (!grs[i].is_dummy && grs[i].words.length > 0) {
                if (grs[i].words[0].spelling !== norm) 
                    kref.add_slot(KeywordReferent.ATTR_NORMAL, grs[i].words[0].spelling, false, 0);
            }
        }
    }
    
    _add_referents(ad, t, cur, max) {
        if (!((t instanceof ReferentToken))) 
            return t;
        let r = t.get_referent();
        if (r === null) 
            return t;
        if (r instanceof DenominationReferent) {
            let dr = Utils.as(r, DenominationReferent);
            let kref0 = KeywordReferent._new1589(KeywordType.REFERENT);
            for (const s of dr.slots) {
                if (s.type_name === DenominationReferent.ATTR_VALUE) 
                    kref0.add_slot(KeywordReferent.ATTR_NORMAL, s.value, false, 0);
            }
            kref0.add_slot(KeywordReferent.ATTR_REF, dr, false, 0);
            let rt0 = new ReferentToken(ad.register_referent(kref0), t, t);
            t.kit.embed_token(rt0);
            return rt0;
        }
        if ((r instanceof PhoneReferent) || (r instanceof UriReferent) || (r instanceof BankDataReferent)) 
            return t;
        if (r instanceof MoneyReferent) {
            let mr = Utils.as(r, MoneyReferent);
            let kref0 = KeywordReferent._new1589(KeywordType.OBJECT);
            kref0.add_slot(KeywordReferent.ATTR_NORMAL, mr.currency, false, 0);
            let rt0 = new ReferentToken(ad.register_referent(kref0), t, t);
            t.kit.embed_token(rt0);
            return rt0;
        }
        if (r.type_name === "DATE" || r.type_name === "DATERANGE" || r.type_name === "BOOKLINKREF") 
            return t;
        for (let tt = (t).begin_token; tt !== null && tt.end_char <= t.end_char; tt = tt.next) {
            if (tt instanceof ReferentToken) 
                this._add_referents(ad, tt, cur, max);
        }
        let kref = KeywordReferent._new1589(KeywordType.REFERENT);
        let norm = null;
        if (r.type_name === "GEO") 
            norm = r.get_string_value("ALPHA2");
        if (norm === null) 
            norm = r.to_string(true, null, 0);
        if (norm !== null) 
            kref.add_slot(KeywordReferent.ATTR_NORMAL, norm.toUpperCase(), false, 0);
        kref.add_slot(KeywordReferent.ATTR_REF, t.get_referent(), false, 0);
        KeywordAnalyzer._set_rank(kref, cur, max);
        let rt1 = new ReferentToken(ad.register_referent(kref), t, t);
        t.kit.embed_token(rt1);
        return rt1;
    }
    
    static _set_rank(kr, cur, max) {
        let rank = 1;
        let ty = kr.typ;
        if (ty === KeywordType.PREDICATE) 
            rank = 1;
        else if (ty === KeywordType.OBJECT) {
            let v = Utils.notNull(kr.get_string_value(KeywordReferent.ATTR_VALUE), kr.get_string_value(KeywordReferent.ATTR_NORMAL));
            if (v !== null) {
                for (let i = 0; i < v.length; i++) {
                    if (v[i] === ' ' || v[i] === '-') 
                        rank++;
                }
            }
        }
        else if (ty === KeywordType.REFERENT) {
            rank = 3;
            let r = Utils.as(kr.get_slot_value(KeywordReferent.ATTR_REF), Referent);
            if (r !== null) {
                if (r.type_name === "PERSON") 
                    rank = 4;
            }
        }
        if (max > 0) 
            rank *= (((1) - (((0.5 * (cur)) / (max)))));
        kr.rank += rank;
    }
    
    static initialize() {
        if (KeywordAnalyzer.m_initialized) 
            return;
        KeywordAnalyzer.m_initialized = true;
        try {
            KeywordMeta.initialize();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
            DenominationAnalyzer.initialize();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
            ProcessorService.register_analyzer(new KeywordAnalyzer());
        } catch (ex) {
            throw new Error(ex.message);
        }
    }
    
    static static_constructor() {
        KeywordAnalyzer.ANALYZER_NAME = "KEYWORD";
        KeywordAnalyzer.SORT_KEYWORDS_BY_RANK = true;
        KeywordAnalyzer.m_initialized = false;
    }
}


KeywordAnalyzer.CompByRank = class  {
    
    compare(x, y) {
        const KeywordReferent = require("./KeywordReferent");
        let d1 = (x).rank;
        let d2 = (y).rank;
        if (d1 > d2) 
            return -1;
        if (d1 < d2) 
            return 1;
        return 0;
    }
}


KeywordAnalyzer.static_constructor();

module.exports = KeywordAnalyzer
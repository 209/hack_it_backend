/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");

const SentimentKind = require("./SentimentKind");
const GetTextAttr = require("./../core/GetTextAttr");
const ReferentToken = require("./../ReferentToken");
const Token = require("./../Token");
const TerminCollection = require("./../core/TerminCollection");
const Referent = require("./../Referent");
const TerminParseAttr = require("./../core/TerminParseAttr");
const EpNerBusinessInternalResourceHelper = require("./../business/internal/EpNerBusinessInternalResourceHelper");
const MetaToken = require("./../MetaToken");
const Termin = require("./../core/Termin");
const ProcessorService = require("./../ProcessorService");
const MetaSentiment = require("./internal/MetaSentiment");
const TextToken = require("./../TextToken");
const SentimentReferent = require("./SentimentReferent");
const Analyzer = require("./../Analyzer");
const AnalyzerDataWithOntology = require("./../core/AnalyzerDataWithOntology");
const MiscHelper = require("./../core/MiscHelper");

/**
 * Анализатор для сентиментов (эмоциональная оценка)
 */
class SentimentAnalyzer extends Analyzer {
    
    get name() {
        return SentimentAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Сентиментный анализ";
    }
    
    get description() {
        return "Выделение тональных объектов";
    }
    
    clone() {
        return new SentimentAnalyzer();
    }
    
    get type_system() {
        return [MetaSentiment.global_meta];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(MetaSentiment.IMAGE_ID, EpNerBusinessInternalResourceHelper.get_bytes("neutral.png"));
        res.put(MetaSentiment.IMAGE_ID_GOOD, EpNerBusinessInternalResourceHelper.get_bytes("good.png"));
        res.put(MetaSentiment.IMAGE_ID_BAD, EpNerBusinessInternalResourceHelper.get_bytes("bad.png"));
        return res;
    }
    
    get used_extern_object_types() {
        return ["ALL"];
    }
    
    create_referent(type) {
        if (type === SentimentReferent.OBJ_TYPENAME) 
            return new SentimentReferent();
        return null;
    }
    
    get is_specific() {
        return true;
    }
    
    get progress_weight() {
        return 1;
    }
    
    create_analyzer_data() {
        return new AnalyzerDataWithOntology();
    }
    
    process(kit) {
        let ad = kit.get_analyzer_data(this);
        for (let t = kit.first_token; t !== null; t = t.next) {
            if (!((t instanceof TextToken))) 
                continue;
            if (!t.chars.is_letter) 
                continue;
            let tok = SentimentAnalyzer.m_termins.try_parse(t, TerminParseAttr.NO);
            if (tok === null) 
                continue;
            let coef = tok.termin.tag;
            if (coef === 0) 
                continue;
            let t0 = t;
            let t1 = tok.end_token;
            for (let tt = t.previous; tt !== null; tt = tt.previous) {
                let tok0 = SentimentAnalyzer.m_termins.try_parse(tt, TerminParseAttr.NO);
                if (tok0 !== null) {
                    if ((tok0.termin.tag) === 0) {
                        coef *= 2;
                        t0 = tt;
                        continue;
                    }
                    break;
                }
                if ((tt instanceof TextToken) && (tt).term === "НЕ") {
                    coef = -coef;
                    t0 = tt;
                    continue;
                }
                break;
            }
            for (let tt = t1.next; tt !== null; tt = tt.next) {
                if (!((tt instanceof TextToken))) 
                    break;
                if (!tt.chars.is_letter) 
                    continue;
                let tok0 = SentimentAnalyzer.m_termins.try_parse(tt, TerminParseAttr.NO);
                if (tok0 === null) 
                    break;
                coef += (tok0.termin.tag);
                tt = (t1 = tok0.end_token);
            }
            if (coef === 0) 
                continue;
            let sr = new SentimentReferent();
            sr.kind = (coef > 0 ? SentimentKind.POSITIVE : SentimentKind.NEGATIVE);
            sr.coef = (coef > 0 ? coef : -coef);
            sr.spelling = MiscHelper.get_text_value(t0, t1, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE);
            sr = Utils.as(ad.register_referent(sr), SentimentReferent);
            let rt = new ReferentToken(sr, t0, t1);
            kit.embed_token(rt);
            t = rt;
        }
    }
    
    static initialize() {
        if (SentimentAnalyzer.m_inited) 
            return;
        SentimentAnalyzer.m_inited = true;
        MetaSentiment.initialize();
        Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
        try {
            for (let i = 0; i < 2; i++) {
                let str = EpNerBusinessInternalResourceHelper.get_string((i === 0 ? "Positives.txt" : "Negatives.txt"));
                if (str === null) 
                    continue;
                for (const line0 of Utils.splitString(str, '\n', false)) {
                    let line = line0.trim();
                    if (Utils.isNullOrEmpty(line)) 
                        continue;
                    let coef = (i === 0 ? 1 : -1);
                    SentimentAnalyzer.m_termins.add(Termin._new119(line, coef));
                }
            }
        } catch (ex) {
        }
        for (const s of ["ОЧЕНЬ", "СИЛЬНО"]) {
            SentimentAnalyzer.m_termins.add(Termin._new119(s, 0));
        }
        Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
        ProcessorService.register_analyzer(new SentimentAnalyzer());
    }
    
    static static_constructor() {
        SentimentAnalyzer.ANALYZER_NAME = "SENTIMENT";
        SentimentAnalyzer.m_termins = new TerminCollection();
        SentimentAnalyzer.m_inited = false;
    }
}


SentimentAnalyzer.static_constructor();

module.exports = SentimentAnalyzer
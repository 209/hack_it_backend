/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const MorphCase = require("./../../morph/MorphCase");
const MorphGender = require("./../../morph/MorphGender");
const MorphClass = require("./../../morph/MorphClass");
const LanguageHelper = require("./../../morph/LanguageHelper");
const MorphLang = require("./../../morph/MorphLang");
const TerminParseAttr = require("./TerminParseAttr");
const TextToken = require("./../TextToken");
const Termin = require("./Termin");
const TerminCollection = require("./TerminCollection");
const PrepositionToken = require("./PrepositionToken");

/**
 * Поддержка работы с предлогами
 */
class PrepositionHelper {
    
    /**
     * Попытаться выделить предлог с указанного токена
     * @param t начальный токен
     * @return результат или null
     */
    static try_parse(t) {
        if (!((t instanceof TextToken))) 
            return null;
        let tok = PrepositionHelper.m_ontology.try_parse(t, TerminParseAttr.NO);
        if (tok !== null) 
            return PrepositionToken._new601(t, tok.end_token, tok.termin.canonic_text, tok.termin.tag);
        let mc = t.get_morph_class_in_dictionary();
        if (!mc.is_preposition) 
            return null;
        let res = new PrepositionToken(t, t);
        res.normal = t.get_normal_case_text(MorphClass.PREPOSITION, false, MorphGender.UNDEFINED, false);
        res.next_case = LanguageHelper.get_case_after_preposition(res.normal);
        if ((t.next !== null && t.next.is_hiphen && !t.is_whitespace_after) && (t.next.next instanceof TextToken) && t.next.next.get_morph_class_in_dictionary().is_preposition) 
            res.end_token = t.next.next;
        return res;
    }
    
    static initialize() {
        if (PrepositionHelper.m_ontology !== null) 
            return;
        PrepositionHelper.m_ontology = new TerminCollection();
        for (const s of ["близко от", "в виде", "в зависимости от", "в интересах", "в качестве", "в лице", "в отличие от", "в отношении", "в пандан", "в пользу", "в преддверии", "в продолжение", "в результате", "в роли", "в силу", "в случае", "в течение", "в целях", "в честь", "во имя", "вплоть до", "впредь до", "за вычетом", "за исключением", "за счет", "исходя из", "на благо", "на виду у", "на глазах у", "начиная с", "невзирая на", "недалеко от", "независимо от", "от имени", "от лица", "по линии", "по мере", "по поводу", "по причине", "по случаю", "поблизости от", "под видом", "под эгидой", "при помощи", "с ведома", "с помощью", "с точки зрения", "с целью"]) {
            PrepositionHelper.m_ontology.add(Termin._new602(s.toUpperCase(), MorphLang.RU, true, MorphCase.GENITIVE));
        }
        for (const s of ["вдоль по", "по направлению к", "применительно к", "смотря по", "судя по"]) {
            PrepositionHelper.m_ontology.add(Termin._new602(s.toUpperCase(), MorphLang.RU, true, MorphCase.DATIVE));
        }
        for (const s of ["несмотря на", "с прицелом на"]) {
            PrepositionHelper.m_ontology.add(Termin._new602(s.toUpperCase(), MorphLang.RU, true, MorphCase.ACCUSATIVE));
        }
        for (const s of ["во славу"]) {
            PrepositionHelper.m_ontology.add(Termin._new602(s.toUpperCase(), MorphLang.RU, true, (MorphCase.ooBitor(MorphCase.GENITIVE, MorphCase.DATIVE))));
        }
        for (const s of ["не считая"]) {
            PrepositionHelper.m_ontology.add(Termin._new602(s.toUpperCase(), MorphLang.RU, true, (MorphCase.ooBitor(MorphCase.GENITIVE, MorphCase.ACCUSATIVE))));
        }
        for (const s of ["в связи с", "в соответствии с", "вслед за", "лицом к лицу с", "наряду с", "по сравнению с", "рядом с", "следом за"]) {
            PrepositionHelper.m_ontology.add(Termin._new602(s.toUpperCase(), MorphLang.RU, true, MorphCase.INSTRUMENTAL));
        }
    }
    
    static static_constructor() {
        PrepositionHelper.m_ontology = null;
    }
}


PrepositionHelper.static_constructor();

module.exports = PrepositionHelper
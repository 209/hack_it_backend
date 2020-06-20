/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");

const Token = require("./../Token");
const GeoReferent = require("./../geo/GeoReferent");
const TextAnnotation = require("./../TextAnnotation");
const MetaToken = require("./../MetaToken");
const TerminParseAttr = require("./../core/TerminParseAttr");
const TextToken = require("./../TextToken");
const Termin = require("./../core/Termin");
const TitleItemToken = require("./internal/TitleItemToken");
const MorphLang = require("./../../morph/MorphLang");
const OrganizationKind = require("./../org/OrganizationKind");
const UriReferent = require("./../uri/UriReferent");
const ReferentToken = require("./../ReferentToken");
const PersonReferent = require("./../person/PersonReferent");
const DateReferent = require("./../date/DateReferent");
const OrganizationReferent = require("./../org/OrganizationReferent");
const TitleItemTokenTypes = require("./internal/TitleItemTokenTypes");
const EpNerBooklinkInternalResourceHelper = require("./../booklink/internal/EpNerBooklinkInternalResourceHelper");
const ProcessorService = require("./../ProcessorService");
const Referent = require("./../Referent");
const MetaTitleInfo = require("./internal/MetaTitleInfo");
const Analyzer = require("./../Analyzer");
const PersonRelations = require("./internal/PersonRelations");
const BracketHelper = require("./../core/BracketHelper");
const Line = require("./internal/Line");
const DateAnalyzer = require("./../date/DateAnalyzer");
const TitlePageReferent = require("./TitlePageReferent");
const TitleNameToken = require("./internal/TitleNameToken");

/**
 * Анализатор заголовочной информации
 */
class TitlePageAnalyzer extends Analyzer {
    
    get name() {
        return TitlePageAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Титульный лист";
    }
    
    get description() {
        return "Информация из титульных страниц и из заголовков статей, научных работ, дипломов и т.д.";
    }
    
    clone() {
        return new TitlePageAnalyzer();
    }
    
    /**
     * [Get] Этот анализатор является специфическим
     */
    get is_specific() {
        return true;
    }
    
    get progress_weight() {
        return 1;
    }
    
    get type_system() {
        return [MetaTitleInfo.global_meta];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(MetaTitleInfo.TITLE_INFO_IMAGE_ID, EpNerBooklinkInternalResourceHelper.get_bytes("titleinfo.png"));
        return res;
    }
    
    create_referent(type) {
        if (type === TitlePageReferent.OBJ_TYPENAME) 
            return new TitlePageReferent();
        return null;
    }
    
    process_referent1(begin, end) {
        let et = null;
        let wrapet2664 = new RefOutArgWrapper();
        let tpr = TitlePageAnalyzer._process(begin, (end === null ? 0 : end.end_char), begin.kit, wrapet2664);
        et = wrapet2664.value;
        if (tpr === null) 
            return null;
        return new ReferentToken(tpr, begin, et);
    }
    
    process(kit) {
        let ad = kit.get_analyzer_data(this);
        let et = null;
        let wrapet2665 = new RefOutArgWrapper();
        let tpr = TitlePageAnalyzer._process(kit.first_token, 0, kit, wrapet2665);
        et = wrapet2665.value;
        if (tpr !== null) 
            ad.register_referent(tpr);
    }
    
    static _process(begin, max_char_pos, kit, end_token) {
        end_token.value = begin;
        let res = new TitlePageReferent();
        let term = null;
        let lines = Line.parse(begin, 30, 1500, max_char_pos);
        if (lines.length < 1) 
            return null;
        let cou = lines.length;
        let min_newlines_count = 10;
        let lines_count_stat = new Hashtable();
        for (let i = 0; i < lines.length; i++) {
            if (TitleNameToken.can_be_start_of_text_or_content(lines[i].begin_token, lines[i].end_token)) {
                cou = i;
                break;
            }
            let j = lines[i].newlines_before_count;
            if (i > 0 && j > 0) {
                if (!lines_count_stat.containsKey(j)) 
                    lines_count_stat.put(j, 1);
                else 
                    lines_count_stat.put(j, lines_count_stat.get(j) + 1);
            }
        }
        let max = 0;
        for (const kp of lines_count_stat.entries) {
            if (kp.value > max) {
                max = kp.value;
                min_newlines_count = kp.key;
            }
        }
        let end_char = (cou > 0 ? lines[cou - 1].end_char : 0);
        if (max_char_pos > 0 && end_char > max_char_pos) 
            end_char = max_char_pos;
        let names = new Array();
        for (let i = 0; i < cou; i++) {
            if (i === 6) {
            }
            for (let j = i; (j < cou) && (j < (i + 5)); j++) {
                if (i === 6 && j === 8) {
                }
                if (j > i) {
                    if (lines[j - 1].is_pure_en && lines[j].is_pure_ru) 
                        break;
                    if (lines[j - 1].is_pure_ru && lines[j].is_pure_en) 
                        break;
                    if (lines[j].newlines_before_count >= (min_newlines_count * 2)) 
                        break;
                }
                let ttt = TitleNameToken.try_parse(lines[i].begin_token, lines[j].end_token, min_newlines_count);
                if (ttt !== null) {
                    if (lines[i].is_pure_en) 
                        ttt.morph.language = MorphLang.EN;
                    else if (lines[i].is_pure_ru) 
                        ttt.morph.language = MorphLang.RU;
                    names.push(ttt);
                }
            }
        }
        TitleNameToken.sort(names);
        let name_rt = null;
        if (names.length > 0) {
            let i0 = 0;
            if (names[i0].morph.language.is_en) {
                for (let ii = 1; ii < names.length; ii++) {
                    if (names[ii].morph.language.is_ru && names[ii].rank > 0) {
                        i0 = ii;
                        break;
                    }
                }
            }
            term = res.add_name(names[i0].begin_name_token, names[i0].end_name_token);
            if (names[i0].type_value !== null) 
                res.add_type(names[i0].type_value);
            if (names[i0].speciality !== null) 
                res.speciality = names[i0].speciality;
            let rt = new ReferentToken(res, names[i0].begin_token, names[i0].end_token);
            if (kit !== null) 
                kit.embed_token(rt);
            else 
                res.add_occurence(new TextAnnotation(rt.begin_token, rt.end_token));
            end_token.value = rt.end_token;
            name_rt = rt;
            if (begin.begin_char === rt.begin_char) 
                begin = rt;
        }
        if (term !== null && kit !== null) {
            for (let t = kit.first_token; t !== null; t = t.next) {
                let tok = term.try_parse(t, TerminParseAttr.NO, 0);
                if (tok === null) 
                    continue;
                let t0 = t;
                let t1 = tok.end_token;
                if (t1.next !== null && t1.next.is_char('.')) 
                    t1 = t1.next;
                if (BracketHelper.can_be_start_of_sequence(t0.previous, false, false) && BracketHelper.can_be_end_of_sequence(t1.next, false, null, false)) {
                    t0 = t0.previous;
                    t1 = t1.next;
                }
                let rt = new ReferentToken(res, t0, t1);
                kit.embed_token(rt);
                t = rt;
            }
        }
        let pr = new PersonRelations();
        let pers_typ = TitleItemTokenTypes.UNDEFINED;
        let pers_types = pr.rel_types;
        for (let t = begin; t !== null; t = t.next) {
            if (max_char_pos > 0 && t.begin_char > max_char_pos) 
                break;
            if (t === name_rt) 
                continue;
            let tpt = TitleItemToken.try_attach(t);
            if (tpt !== null) {
                pers_typ = TitleItemTokenTypes.UNDEFINED;
                if (tpt.typ === TitleItemTokenTypes.TYP) {
                    if (res.types.length === 0) 
                        res.add_type(tpt.value);
                    else if (res.types.length === 1) {
                        let ty = res.types[0].toUpperCase();
                        if (ty === "РЕФЕРАТ") 
                            res.add_type(tpt.value);
                        else if (ty === "АВТОРЕФЕРАТ") {
                            if (tpt.value === "КАНДИДАТСКАЯ ДИССЕРТАЦИЯ") 
                                res.add_slot(TitlePageReferent.ATTR_TYPE, "автореферат кандидатской диссертации", true, 0);
                            else if (tpt.value === "ДОКТОРСКАЯ ДИССЕРТАЦИЯ") 
                                res.add_slot(TitlePageReferent.ATTR_TYPE, "автореферат докторской диссертации", true, 0);
                            else if (tpt.value === "МАГИСТЕРСКАЯ ДИССЕРТАЦИЯ") 
                                res.add_slot(TitlePageReferent.ATTR_TYPE, "автореферат магистерской диссертации", true, 0);
                            else if (tpt.value === "КАНДИДАТСЬКА ДИСЕРТАЦІЯ") 
                                res.add_slot(TitlePageReferent.ATTR_TYPE, "автореферат кандидатської дисертації", true, 0);
                            else if (tpt.value === "ДОКТОРСЬКА ДИСЕРТАЦІЯ") 
                                res.add_slot(TitlePageReferent.ATTR_TYPE, "автореферат докторської дисертації", true, 0);
                            else if (tpt.value === "МАГІСТЕРСЬКА ДИСЕРТАЦІЯ") 
                                res.add_slot(TitlePageReferent.ATTR_TYPE, "автореферат магістерської дисертації", true, 0);
                            else 
                                res.add_type(tpt.value);
                        }
                        else if (tpt.value === "РЕФЕРАТ" || tpt.value === "АВТОРЕФЕРАТ") {
                            if (!ty.includes(tpt.value)) 
                                res.add_type(tpt.value);
                        }
                    }
                }
                else if (tpt.typ === TitleItemTokenTypes.SPECIALITY) {
                    if (res.speciality === null) 
                        res.speciality = tpt.value;
                }
                else if (pers_types.includes(tpt.typ)) 
                    pers_typ = tpt.typ;
                t = tpt.end_token;
                if (t.end_char > end_token.value.end_char) 
                    end_token.value = t;
                if (t.next !== null && t.next.is_char_of(":-")) 
                    t = t.next;
                continue;
            }
            if (t.end_char > end_char) 
                break;
            let rli = t.get_referents();
            if (rli === null) 
                continue;
            if (!t.is_newline_before && (t.previous instanceof TextToken)) {
                let s = (t.previous).term;
                if (s === "ИМЕНИ" || s === "ИМ") 
                    continue;
                if (s === "." && t.previous.previous !== null && t.previous.previous.is_value("ИМ", null)) 
                    continue;
            }
            for (const r of rli) {
                if (r instanceof PersonReferent) {
                    if (r !== rli[0]) 
                        continue;
                    let p = Utils.as(r, PersonReferent);
                    if (pers_typ !== TitleItemTokenTypes.UNDEFINED) {
                        if (t.previous !== null && t.previous.is_char('.')) 
                            pers_typ = TitleItemTokenTypes.UNDEFINED;
                    }
                    let typ = pr.calc_typ_from_attrs(p);
                    if (typ !== TitleItemTokenTypes.UNDEFINED) {
                        pr.add(p, typ, 1);
                        pers_typ = typ;
                    }
                    else if (pers_typ !== TitleItemTokenTypes.UNDEFINED) 
                        pr.add(p, pers_typ, 1);
                    else if (t.previous !== null && t.previous.is_char('©')) {
                        pers_typ = TitleItemTokenTypes.WORKER;
                        pr.add(p, pers_typ, 1);
                    }
                    else {
                        for (let tt = t.next; tt !== null; tt = tt.next) {
                            let rr = tt.get_referent();
                            if (rr === res) {
                                pers_typ = TitleItemTokenTypes.WORKER;
                                break;
                            }
                            if (rr instanceof PersonReferent) {
                                if (pr.calc_typ_from_attrs(Utils.as(r, PersonReferent)) !== TitleItemTokenTypes.UNDEFINED) 
                                    break;
                                else 
                                    continue;
                            }
                            if (rr !== null) 
                                break;
                            tpt = TitleItemToken.try_attach(tt);
                            if (tpt !== null) {
                                if (tpt.typ !== TitleItemTokenTypes.TYP && tpt.typ !== TitleItemTokenTypes.TYPANDTHEME) 
                                    break;
                                tt = tpt.end_token;
                                if (tt.end_char > end_token.value.end_char) 
                                    end_token.value = tt;
                                continue;
                            }
                        }
                        if (pers_typ === TitleItemTokenTypes.UNDEFINED) {
                            for (let tt = t.previous; tt !== null; tt = tt.previous) {
                                let rr = tt.get_referent();
                                if (rr === res) {
                                    pers_typ = TitleItemTokenTypes.WORKER;
                                    break;
                                }
                                if (rr !== null) 
                                    break;
                                if ((tt.is_value("СТУДЕНТ", null) || tt.is_value("СТУДЕНТКА", null) || tt.is_value("СЛУШАТЕЛЬ", null)) || tt.is_value("ДИПЛОМНИК", null) || tt.is_value("ИСПОЛНИТЕЛЬ", null)) {
                                    pers_typ = TitleItemTokenTypes.WORKER;
                                    break;
                                }
                                tpt = TitleItemToken.try_attach(tt);
                                if (tpt !== null && tpt.typ !== TitleItemTokenTypes.TYP) 
                                    break;
                            }
                        }
                        if (pers_typ !== TitleItemTokenTypes.UNDEFINED) 
                            pr.add(p, pers_typ, 1);
                        else 
                            pr.add(p, pers_typ, 0.5);
                        if (t.end_char > end_token.value.end_char) 
                            end_token.value = t;
                    }
                    continue;
                }
                if (r === rli[0]) 
                    pers_typ = TitleItemTokenTypes.UNDEFINED;
                if (r instanceof DateReferent) {
                    if (res.date === null) {
                        res.date = Utils.as(r, DateReferent);
                        if (t.end_char > end_token.value.end_char) 
                            end_token.value = t;
                    }
                }
                else if (r instanceof GeoReferent) {
                    if (res.city === null && (r).is_city) {
                        res.city = Utils.as(r, GeoReferent);
                        if (t.end_char > end_token.value.end_char) 
                            end_token.value = t;
                    }
                }
                if (r instanceof OrganizationReferent) {
                    let _org = Utils.as(r, OrganizationReferent);
                    if (_org.types.includes("курс") && _org.number !== null) {
                        let i = 0;
                        let wrapi2666 = new RefOutArgWrapper();
                        let inoutres2667 = Utils.tryParseInt(_org.number, wrapi2666);
                        i = wrapi2666.value;
                        if (inoutres2667) {
                            if (i > 0 && (i < 8)) 
                                res.student_year = i;
                        }
                    }
                    for (; _org.higher !== null; _org = _org.higher) {
                        if (_org.kind !== OrganizationKind.DEPARTMENT) 
                            break;
                    }
                    if (_org.kind !== OrganizationKind.DEPARTMENT) {
                        if (res.org === null) 
                            res.org = _org;
                        else if (OrganizationReferent.can_be_higher(res.org, _org)) 
                            res.org = _org;
                    }
                    if (t.end_char > end_token.value.end_char) 
                        end_token.value = t;
                }
                if ((r instanceof UriReferent) || (r instanceof GeoReferent)) {
                    if (t.end_char > end_token.value.end_char) 
                        end_token.value = t;
                }
            }
        }
        for (const ty of pers_types) {
            for (const p of pr.get_persons(ty)) {
                if (pr.get_attr_name_for_type(ty) !== null) 
                    res.add_slot(pr.get_attr_name_for_type(ty), p, false, 0);
            }
        }
        if (res.get_slot_value(TitlePageReferent.ATTR_AUTHOR) === null) {
            for (const p of pr.get_persons(TitleItemTokenTypes.UNDEFINED)) {
                res.add_slot(TitlePageReferent.ATTR_AUTHOR, p, false, 0);
                break;
            }
        }
        if (res.city === null && res.org !== null) {
            let s = res.org.find_slot(OrganizationReferent.ATTR_GEO, null, true);
            if (s !== null && (s.value instanceof GeoReferent)) {
                if ((s.value).is_city) 
                    res.city = Utils.as(s.value, GeoReferent);
            }
        }
        if (res.date === null) {
            for (let t = begin; t !== null && t.end_char <= end_char; t = t.next) {
                let city = Utils.as(t.get_referent(), GeoReferent);
                if (city === null) 
                    continue;
                if (t.next instanceof TextToken) {
                    if (t.next.is_char_of(":,") || t.next.is_hiphen) 
                        t = t.next;
                }
                let rt = t.kit.process_referent(DateAnalyzer.ANALYZER_NAME, t.next);
                if (rt !== null) {
                    rt.save_to_local_ontology();
                    res.date = Utils.as(rt.referent, DateReferent);
                    if (kit !== null) 
                        kit.embed_token(rt);
                    break;
                }
            }
        }
        if (res.slots.length === 0) 
            return null;
        else 
            return res;
    }
    
    static initialize() {
        MetaTitleInfo.initialize();
        try {
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
            TitleItemToken.initialize();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
        } catch (ex) {
            throw new Error(ex.message);
        }
        ProcessorService.register_analyzer(new TitlePageAnalyzer());
    }
    
    static static_constructor() {
        TitlePageAnalyzer.ANALYZER_NAME = "TITLEPAGE";
    }
}


TitlePageAnalyzer.static_constructor();

module.exports = TitlePageAnalyzer
/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");

const Token = require("./../Token");
const MetaToken = require("./../MetaToken");
const DateItemTokenDateItemType = require("./internal/DateItemTokenDateItemType");
const TextAnnotation = require("./../TextAnnotation");
const MorphLang = require("./../../morph/MorphLang");
const Referent = require("./../Referent");
const DatePointerType = require("./DatePointerType");
const TerminParseAttr = require("./../core/TerminParseAttr");
const TextToken = require("./../TextToken");
const ReferentToken = require("./../ReferentToken");
const BracketHelper = require("./../core/BracketHelper");
const NumberHelper = require("./../core/NumberHelper");
const MetaDateRange = require("./internal/MetaDateRange");
const MetaDate = require("./internal/MetaDate");
const NumberToken = require("./../NumberToken");
const Termin = require("./../core/Termin");
const ProcessorService = require("./../ProcessorService");
const DateRangeReferent = require("./DateRangeReferent");
const AnalyzerData = require("./../core/AnalyzerData");
const Analyzer = require("./../Analyzer");
const MeasureAnalyzer = require("./../measure/MeasureAnalyzer");
const DateItemToken = require("./internal/DateItemToken");
const EpNerCoreInternalResourceHelper = require("./../core/internal/EpNerCoreInternalResourceHelper");
const DateReferent = require("./DateReferent");

/**
 * Анализатор для дат и диапазонов дат
 */
class DateAnalyzer extends Analyzer {
    
    get name() {
        return DateAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Даты";
    }
    
    get description() {
        return "Даты и диапазоны дат";
    }
    
    clone() {
        return new DateAnalyzer();
    }
    
    get type_system() {
        return [MetaDate.GLOBAL_META, MetaDateRange.GLOBAL_META];
    }
    
    get used_extern_object_types() {
        return ["PHONE"];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(MetaDate.DATE_FULL_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("datefull.png"));
        res.put(MetaDate.DATE_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("date.png"));
        res.put(MetaDateRange.DATE_RANGE_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("daterange.png"));
        return res;
    }
    
    create_referent(type) {
        if (type === DateReferent.OBJ_TYPENAME) 
            return new DateReferent();
        if (type === DateRangeReferent.OBJ_TYPENAME) 
            return new DateRangeReferent();
        return null;
    }
    
    get progress_weight() {
        return 10;
    }
    
    create_analyzer_data() {
        return new DateAnalyzer.DateAnalizerData();
    }
    
    /**
     * Основная функция выделения дат
     * @param cnt 
     * @param stage 
     * @return 
     */
    process(kit) {
        let ad = Utils.as(kit.get_analyzer_data(this), DateAnalyzer.DateAnalizerData);
        for (let t = kit.first_token; t !== null; t = t.next) {
            let pli = DateItemToken.try_attach_list(t, 20);
            if (pli === null || pli.length === 0) 
                continue;
            let high = false;
            for (let tt = t.previous; tt !== null; tt = tt.previous) {
                if (tt.is_value("ДАТА", null) || tt.is_value("DATE", null)) {
                    high = true;
                    break;
                }
                if (tt.is_char(':') || tt.is_hiphen) 
                    continue;
                if (tt.get_referent() instanceof DateReferent) {
                    high = true;
                    break;
                }
                if (!((tt instanceof TextToken))) 
                    break;
                if (!((tt.morph._case.is_genitive))) 
                    break;
            }
            let about = null;
            if (pli.length > 1 && pli[0].typ === DateItemTokenDateItemType.POINTER && pli[0].string_value === "около") {
                about = pli[0];
                pli.splice(0, 1);
            }
            let rts = this.try_attach(pli, high);
            if (rts !== null) {
                let dat = null;
                let hi = null;
                for (let i = 0; i < rts.length; i++) {
                    let rt = rts[i];
                    if (rt.referent instanceof DateRangeReferent) {
                        let dr = Utils.as(rt.referent, DateRangeReferent);
                        if (dr.date_from !== null) 
                            dr.date_from = Utils.as(ad.register_referent(dr.date_from), DateReferent);
                        if (dr.date_to !== null) 
                            dr.date_to = Utils.as(ad.register_referent(dr.date_to), DateReferent);
                        rt.referent = ad.register_referent(rt.referent);
                        if (rt.begin_token.previous !== null && rt.begin_token.previous.is_value("ПЕРИОД", null)) 
                            rt.begin_token = rt.begin_token.previous;
                        kit.embed_token(rt);
                        t = rt;
                        break;
                    }
                    let dt = Utils.as(rt.referent, DateReferent);
                    if (dt.higher !== null) 
                        dt.higher = Utils.as(ad.register_referent(dt.higher), DateReferent);
                    rt.referent = ad.register_referent(dt);
                    hi = Utils.as(rt.referent, DateReferent);
                    if ((i < (rts.length - 1)) && rt.tag === null) 
                        rt.referent.add_occurence(TextAnnotation._new723(kit.sofa, rt.begin_char, rt.end_char, rt.referent));
                    else {
                        dat = Utils.as(rt.referent, DateReferent);
                        if (about !== null) {
                            if (rt.begin_char > about.begin_char) 
                                rt.begin_token = about.begin_token;
                            dat.pointer = DatePointerType.ABOUT;
                        }
                        kit.embed_token(rt);
                        t = rt;
                        for (let j = i + 1; j < rts.length; j++) {
                            if (rts[j].begin_char === t.begin_char) 
                                rts[j].begin_token = t;
                            if (rts[j].end_char === t.end_char) 
                                rts[j].end_token = t;
                        }
                    }
                }
                if ((dat !== null && t.previous !== null && t.previous.is_hiphen) && t.previous.previous !== null && (t.previous.previous.get_referent() instanceof DateReferent)) {
                    let dat0 = Utils.as(t.previous.previous.get_referent(), DateReferent);
                    let dr = Utils.as(ad.register_referent(DateRangeReferent._new724(dat0, dat)), DateRangeReferent);
                    let diap = new ReferentToken(dr, t.previous.previous, t);
                    kit.embed_token(diap);
                    t = diap;
                    continue;
                }
                if ((dat !== null && t.previous !== null && ((t.previous.is_hiphen || t.previous.is_value("ПО", null) || t.previous.is_value("И", null)))) && (t.previous.previous instanceof NumberToken) && (t.previous.previous).int_value !== null) {
                    let t0 = t.previous.previous;
                    let dat0 = null;
                    let num = (t0).int_value;
                    if (dat.day > 0 && (num < dat.day) && num > 0) {
                        if (dat.higher !== null) 
                            dat0 = DateReferent._new725(dat.higher, num);
                        else if (dat.month > 0) 
                            dat0 = DateReferent._new726(dat.month, num);
                    }
                    else if (dat.year > 0 && (num < dat.year) && ((num > 1000 || ((t.previous.previous.previous !== null && t.previous.previous.previous.is_value("С", null)))))) 
                        dat0 = DateReferent._new727(num);
                    else if ((dat.year < 0) && num > (-dat.year)) 
                        dat0 = DateReferent._new727(-num);
                    if (dat0 !== null) {
                        let rt0 = new ReferentToken(ad.register_referent(dat0), t0, t0);
                        kit.embed_token(rt0);
                        if (!t.previous.is_hiphen) 
                            continue;
                        dat0 = Utils.as(rt0.referent, DateReferent);
                        let dr = Utils.as(ad.register_referent(DateRangeReferent._new724(dat0, dat)), DateRangeReferent);
                        let diap = new ReferentToken(dr, rt0, t);
                        if (diap.begin_token.previous !== null && diap.begin_token.previous.is_value("С", null)) 
                            diap.begin_token = diap.begin_token.previous;
                        kit.embed_token(diap);
                        t = diap;
                        continue;
                    }
                }
                continue;
            }
            t = pli[pli.length - 1].end_token;
        }
        this.apply_date_range0(kit, ad);
    }
    
    process_referent(begin, end) {
        if (begin === null) 
            return null;
        if (begin.is_value("ДО", null) && (begin.next instanceof ReferentToken) && (begin.next.get_referent() instanceof DateReferent)) {
            let drr = DateRangeReferent._new730(Utils.as(begin.next.get_referent(), DateReferent));
            let res1 = new ReferentToken(drr, begin, begin.next);
            res1.data = Utils.as(begin.kit.get_analyzer_data(this), DateAnalyzer.DateAnalizerData);
            return res1;
        }
        let pli = DateItemToken.try_attach_list(begin, 20);
        if (end !== null && pli !== null) {
            for (let i = 0; i < pli.length; i++) {
                if (pli[i].begin_char > end.end_char) {
                    pli.splice(i, pli.length - i);
                    break;
                }
            }
        }
        if (pli === null || pli.length === 0) 
            return null;
        let rts = this.try_attach(pli, true);
        if (rts === null || rts.length === 0) 
            return null;
        let ad = Utils.as(begin.kit.get_analyzer_data(this), DateAnalyzer.DateAnalizerData);
        let res = rts[rts.length - 1];
        for (let i = 0; i < (rts.length - 1); i++) {
            if ((res.referent instanceof DateReferent) && (rts[i].referent instanceof DateReferent)) 
                res.referent.merge_slots(rts[i].referent, true);
            else 
                rts[i].data = ad;
        }
        res.referent.add_slot(DateReferent.ATTR_HIGHER, null, true, 0);
        res.data = ad;
        return res;
    }
    
    try_attach(dts, high) {
        if (dts === null || dts.length === 0) 
            return null;
        if ((dts[0].can_be_hour && dts.length > 2 && dts[1].typ === DateItemTokenDateItemType.DELIM) && dts[2].int_value >= 0 && (dts[2].int_value < 60)) {
            if (dts[0].typ === DateItemTokenDateItemType.HOUR || ((dts[0].typ === DateItemTokenDateItemType.NUMBER && ((dts[2].typ === DateItemTokenDateItemType.HOUR || dts[2].typ === DateItemTokenDateItemType.NUMBER))))) {
                if (dts.length > 3 && dts[3].typ === DateItemTokenDateItemType.DELIM && dts[3].string_value === dts[1].string_value) {
                }
                else {
                    let dts1 = Array.from(dts);
                    dts1.splice(0, 3);
                    let res1 = this.try_attach(dts1, false);
                    if (res1 !== null && (res1[res1.length - 1].referent instanceof DateReferent) && (res1[res1.length - 1].referent).day > 0) {
                        let time = DateReferent._new731(dts[0].int_value, dts[2].int_value);
                        time.higher = Utils.as(res1[res1.length - 1].referent, DateReferent);
                        res1.push(new ReferentToken(time, dts[0].begin_token, res1[res1.length - 1].end_token));
                        return res1;
                    }
                }
            }
        }
        let year = null;
        let mon = null;
        let day = null;
        let cent = null;
        let point = null;
        let year_is_dif = false;
        let b = false;
        let wrapyear777 = new RefOutArgWrapper();
        let wrapmon778 = new RefOutArgWrapper();
        let wrapday779 = new RefOutArgWrapper();
        b = this.apply_rule_formal(dts, high, wrapyear777, wrapmon778, wrapday779);
        year = wrapyear777.value;
        mon = wrapmon778.value;
        day = wrapday779.value;
        if (b) {
            let tt = dts[0].begin_token.previous;
            if (tt !== null) {
                if (tt.is_value("№", null) || tt.is_value("N", null)) 
                    b = false;
            }
        }
        if (dts[0].typ === DateItemTokenDateItemType.CENTURY) {
            if (dts.length === 1) {
                if (dts[0].begin_token instanceof NumberToken) 
                    return null;
                if (NumberHelper.try_parse_roman(dts[0].begin_token) === null) 
                    return null;
            }
            cent = dts[0];
            b = true;
        }
        if (dts.length === 1 && dts[0].typ === DateItemTokenDateItemType.POINTER && dts[0].string_value === "сегодня") {
            let res0 = new Array();
            res0.push(new ReferentToken(DateReferent._new732(DatePointerType.TODAY), dts[0].begin_token, dts[0].end_token));
            return res0;
        }
        if (dts.length === 1 && dts[0].typ === DateItemTokenDateItemType.YEAR && dts[0].year <= 0) {
            let res0 = new Array();
            res0.push(new ReferentToken(DateReferent._new732(DatePointerType.UNDEFINED), dts[0].begin_token, dts[0].end_token));
            return res0;
        }
        if (!b && dts[0].typ === DateItemTokenDateItemType.POINTER && dts.length > 1) {
            if (dts[1].typ === DateItemTokenDateItemType.YEAR) {
                year = dts[1];
                point = dts[0];
                b = true;
            }
            else if (dts[1].typ === DateItemTokenDateItemType.CENTURY) {
                cent = dts[1];
                point = dts[0];
                b = true;
            }
            else if (dts[1].typ === DateItemTokenDateItemType.MONTH) {
                mon = dts[1];
                point = dts[0];
                if (dts.length > 2 && ((dts[2].typ === DateItemTokenDateItemType.YEAR || dts[2].can_be_year))) 
                    year = dts[2];
                b = true;
            }
        }
        if (!b) {
            let wrapyear734 = new RefOutArgWrapper();
            let wrapmon735 = new RefOutArgWrapper();
            let wrapday736 = new RefOutArgWrapper();
            let wrapyear_is_dif737 = new RefOutArgWrapper();
            b = this.apply_rule_with_month(dts, high, wrapyear734, wrapmon735, wrapday736, wrapyear_is_dif737);
            year = wrapyear734.value;
            mon = wrapmon735.value;
            day = wrapday736.value;
            year_is_dif = wrapyear_is_dif737.value;
        }
        if (!b) {
            let wrapyear738 = new RefOutArgWrapper();
            let wrapmon739 = new RefOutArgWrapper();
            let wrapday740 = new RefOutArgWrapper();
            b = this.apply_rule_year_only(dts, wrapyear738, wrapmon739, wrapday740);
            year = wrapyear738.value;
            mon = wrapmon739.value;
            day = wrapday740.value;
        }
        if (!b) {
            if (dts.length === 2 && dts[0].typ === DateItemTokenDateItemType.HOUR && dts[1].typ === DateItemTokenDateItemType.MINUTE) {
                let t00 = dts[0].begin_token.previous;
                if (t00 !== null && (((t00.is_value("ТЕЧЕНИЕ", null) || t00.is_value("ПРОТЯГОМ", null) || t00.is_value("ЧЕРЕЗ", null)) || t00.is_value("ТЕЧІЮ", null)))) {
                }
                else {
                    let res0 = new Array();
                    let time = DateReferent._new731(dts[0].int_value, dts[1].int_value);
                    res0.push(new ReferentToken(time, dts[0].begin_token, dts[1].end_token));
                    let cou = 0;
                    for (let tt = dts[0].begin_token.previous; tt !== null && (cou < 1000); tt = tt.previous,cou++) {
                        if (tt.get_referent() instanceof DateReferent) {
                            let dr = Utils.as(tt.get_referent(), DateReferent);
                            if (dr.find_slot(DateReferent.ATTR_DAY, null, true) === null && dr.higher !== null) 
                                dr = dr.higher;
                            if (dr.find_slot(DateReferent.ATTR_DAY, null, true) !== null) {
                                time.higher = dr;
                                break;
                            }
                        }
                    }
                    return res0;
                }
            }
            if ((dts.length === 4 && dts[0].typ === DateItemTokenDateItemType.MONTH && dts[1].typ === DateItemTokenDateItemType.DELIM) && dts[2].typ === DateItemTokenDateItemType.MONTH && dts[3].typ === DateItemTokenDateItemType.YEAR) {
                let res0 = new Array();
                let yea = DateReferent._new727(dts[3].int_value);
                res0.push(ReferentToken._new743(yea, dts[3].begin_token, dts[3].end_token, dts[3].morph));
                let mon1 = DateReferent._new744(dts[0].int_value, yea);
                res0.push(ReferentToken._new745(mon1, dts[0].begin_token, dts[0].end_token, mon1));
                let mon2 = DateReferent._new744(dts[2].int_value, yea);
                res0.push(new ReferentToken(mon2, dts[2].begin_token, dts[3].end_token));
                return res0;
            }
            if (((dts.length >= 4 && dts[0].typ === DateItemTokenDateItemType.NUMBER && dts[0].can_be_day) && dts[1].typ === DateItemTokenDateItemType.DELIM && dts[2].typ === DateItemTokenDateItemType.NUMBER) && dts[2].can_be_day && dts[3].typ === DateItemTokenDateItemType.MONTH) {
                if (dts.length === 4 || ((dts.length === 5 && dts[4].can_be_year))) {
                    let res0 = new Array();
                    let yea = null;
                    if (dts.length === 5) 
                        res0.push(new ReferentToken((yea = DateReferent._new727(dts[4].year)), dts[4].begin_token, dts[4].end_token));
                    let mo = DateReferent._new744(dts[3].int_value, yea);
                    res0.push(new ReferentToken(mo, dts[3].begin_token, dts[dts.length - 1].end_token));
                    let da1 = DateReferent._new749(dts[0].int_value, mo);
                    res0.push(new ReferentToken(da1, dts[0].begin_token, dts[0].end_token));
                    let da2 = DateReferent._new749(dts[2].int_value, mo);
                    res0.push(new ReferentToken(da2, dts[2].begin_token, dts[dts.length - 1].end_token));
                    let dr = new DateRangeReferent();
                    dr.date_from = da1;
                    dr.date_to = da2;
                    res0.push(new ReferentToken(dr, dts[0].begin_token, dts[dts.length - 1].end_token));
                    return res0;
                }
            }
            if ((dts[0].typ === DateItemTokenDateItemType.MONTH && dts.length === 1 && dts[0].end_token.next !== null) && ((dts[0].end_token.next.is_hiphen || dts[0].end_token.next.is_value("ПО", null) || dts[0].end_token.next.is_value("НА", null)))) {
                let rt = dts[0].kit.process_referent(DateAnalyzer.ANALYZER_NAME, dts[0].end_token.next.next);
                if (rt !== null) {
                    let dr0 = Utils.as(rt.referent, DateReferent);
                    if ((dr0 !== null && dr0.year > 0 && dr0.month > 0) && dr0.day === 0 && dr0.month > dts[0].int_value) {
                        let dr_year0 = DateReferent._new727(dr0.year);
                        let res0 = new Array();
                        res0.push(new ReferentToken(dr_year0, dts[0].end_token, dts[0].end_token));
                        let dr_mon0 = DateReferent._new744(dts[0].int_value, dr_year0);
                        res0.push(new ReferentToken(dr_mon0, dts[0].begin_token, dts[0].end_token));
                        return res0;
                    }
                }
            }
            if (((dts.length === 3 && dts[1].typ === DateItemTokenDateItemType.DELIM && dts[1].begin_token.is_hiphen) && dts[0].can_be_year && dts[2].can_be_year) && (dts[0].int_value < dts[2].int_value)) {
                let ok = false;
                if (dts[2].typ === DateItemTokenDateItemType.YEAR) 
                    ok = true;
                else if (dts[0].length_char === 4 && dts[2].length_char === 4 && dts[0].begin_token.previous !== null) {
                    let tt0 = dts[0].begin_token.previous;
                    if (tt0.is_char('(') && dts[2].end_token.next !== null && dts[2].end_token.next.is_char(')')) 
                        ok = true;
                    else if (tt0.is_value("IN", null) || tt0.is_value("SINCE", null) || tt0.is_value("В", "У")) 
                        ok = true;
                }
                if (ok) {
                    let res0 = new Array();
                    res0.push(new ReferentToken(DateReferent._new727(dts[0].year), dts[0].begin_token, dts[0].end_token));
                    res0.push(new ReferentToken(DateReferent._new727(dts[2].year), dts[2].begin_token, dts[2].end_token));
                    return res0;
                }
            }
            if (dts.length > 1 && dts[0].typ === DateItemTokenDateItemType.YEAR) {
                let res0 = new Array();
                res0.push(new ReferentToken(DateReferent._new727(dts[0].year), dts[0].begin_token, dts[0].end_token));
                return res0;
            }
            if (high) {
                if (dts.length === 1 && dts[0].can_be_year && dts[0].typ === DateItemTokenDateItemType.NUMBER) {
                    let res0 = new Array();
                    res0.push(new ReferentToken(DateReferent._new727(dts[0].year), dts[0].begin_token, dts[0].end_token));
                    return res0;
                }
                if ((((dts.length === 3 && dts[0].can_be_year && dts[0].typ === DateItemTokenDateItemType.NUMBER) && dts[2].can_be_year && dts[2].typ === DateItemTokenDateItemType.NUMBER) && (dts[0].year < dts[2].year) && dts[1].typ === DateItemTokenDateItemType.DELIM) && dts[1].begin_token.is_hiphen) {
                    let res0 = new Array();
                    let y1 = DateReferent._new727(dts[0].year);
                    res0.push(new ReferentToken(y1, dts[0].begin_token, dts[0].end_token));
                    let y2 = DateReferent._new727(dts[2].year);
                    res0.push(new ReferentToken(y1, dts[2].begin_token, dts[2].end_token));
                    let ra = DateRangeReferent._new724(y1, y2);
                    res0.push(new ReferentToken(ra, dts[0].begin_token, dts[2].end_token));
                    return res0;
                }
            }
            if (dts[0].typ === DateItemTokenDateItemType.QUARTAL || dts[0].typ === DateItemTokenDateItemType.HALFYEAR) {
                if (dts.length === 1 || dts[1].typ === DateItemTokenDateItemType.YEAR) {
                    let res0 = new Array();
                    let ii = 0;
                    let yea = null;
                    if (dts.length > 1) {
                        ii = 1;
                        yea = DateReferent._new727(dts[1].int_value);
                        res0.push(ReferentToken._new743(yea, dts[1].begin_token, dts[1].end_token, dts[1].morph));
                    }
                    else {
                        let cou = 0;
                        for (let tt = dts[0].begin_token; tt !== null; tt = tt.previous) {
                            if ((++cou) > 200) 
                                break;
                            if (tt instanceof ReferentToken) {
                                if ((((yea = DateAnalyzer._find_year_(tt.get_referent())))) !== null) 
                                    break;
                            }
                            if (tt.is_newline_before) 
                                break;
                        }
                    }
                    if (yea === null) 
                        return null;
                    let m1 = 0;
                    let m2 = 0;
                    if (dts[0].typ === DateItemTokenDateItemType.HALFYEAR) {
                        if (dts[0].int_value === 1) {
                            m1 = 1;
                            m2 = 6;
                        }
                        else if (dts[0].int_value === 2) {
                            m1 = 7;
                            m2 = 12;
                        }
                        else 
                            return null;
                    }
                    else if (dts[0].typ === DateItemTokenDateItemType.QUARTAL) {
                        if (dts[0].int_value === 1) {
                            m1 = 1;
                            m2 = 3;
                        }
                        else if (dts[0].int_value === 2) {
                            m1 = 4;
                            m2 = 6;
                        }
                        else if (dts[0].int_value === 3) {
                            m1 = 7;
                            m2 = 9;
                        }
                        else if (dts[0].int_value === 4) {
                            m1 = 10;
                            m2 = 12;
                        }
                        else 
                            return null;
                    }
                    else 
                        return null;
                    let mon1 = DateReferent._new744(m1, yea);
                    res0.push(new ReferentToken(mon1, dts[0].begin_token, dts[0].begin_token));
                    let mon2 = DateReferent._new744(m2, yea);
                    res0.push(new ReferentToken(mon2, dts[0].end_token, dts[0].end_token));
                    let dr = new DateRangeReferent();
                    dr.date_from = mon1;
                    dr.date_to = mon2;
                    res0.push(new ReferentToken(dr, dts[0].begin_token, dts[ii].end_token));
                    return res0;
                }
            }
            if ((dts.length === 3 && dts[1].typ === DateItemTokenDateItemType.DELIM && ((dts[1].string_value === "." || dts[1].string_value === ":"))) && dts[0].can_be_hour && dts[2].can_be_minute) {
                let ok = false;
                if (dts[0].begin_token.previous !== null && dts[0].begin_token.previous.is_value("В", null)) 
                    ok = true;
                if (ok) {
                    let time = DateReferent._new731(dts[0].int_value, dts[2].int_value);
                    let cou = 0;
                    for (let tt = dts[0].begin_token.previous; tt !== null && (cou < 1000); tt = tt.previous,cou++) {
                        if (tt.get_referent() instanceof DateReferent) {
                            let dr = Utils.as(tt.get_referent(), DateReferent);
                            if (dr.find_slot(DateReferent.ATTR_DAY, null, true) === null && dr.higher !== null) 
                                dr = dr.higher;
                            if (dr.find_slot(DateReferent.ATTR_DAY, null, true) !== null) {
                                time.higher = dr;
                                break;
                            }
                        }
                    }
                    let tt1 = dts[2].end_token;
                    if (tt1.next !== null && tt1.next.is_value("ЧАС", null)) {
                        tt1 = tt1.next;
                        let dtsli = DateItemToken.try_attach_list(tt1.next, 20);
                        if (dtsli !== null) {
                            let res1 = this.try_attach(dtsli, true);
                            if (res1 !== null && (res1[res1.length - 1].referent).day > 0) {
                                time.higher = Utils.as(res1[res1.length - 1].referent, DateReferent);
                                res1.push(new ReferentToken(time, dts[0].begin_token, tt1));
                                return res1;
                            }
                        }
                    }
                    let res0 = new Array();
                    res0.push(new ReferentToken(time, dts[0].begin_token, tt1));
                    return res0;
                }
            }
            if ((dts.length === 1 && dts[0].typ === DateItemTokenDateItemType.MONTH && dts[0].begin_token.previous !== null) && dts[0].begin_token.previous.morph.class0.is_preposition) {
                if (dts[0].chars.is_latin_letter && dts[0].chars.is_all_lower) {
                }
                else {
                    let res0 = new Array();
                    res0.push(new ReferentToken(DateReferent._new765(dts[0].int_value), dts[0].begin_token, dts[0].end_token));
                    return res0;
                }
            }
            return null;
        }
        let res = new Array();
        let dr_year = null;
        let dr_mon = null;
        let dr_day = null;
        let t0 = null;
        let t1 = null;
        if (cent !== null) {
            let ce = DateReferent._new766((cent.new_age < 0 ? -cent.int_value : cent.int_value));
            let rt = new ReferentToken(ce, cent.begin_token, (t1 = cent.end_token));
            res.push(rt);
        }
        if (year !== null && year.year > 0) {
            dr_year = DateReferent._new727((year.new_age < 0 ? -year.year : year.year));
            if (!year_is_dif) {
                t1 = year.end_token;
                if (t1.next !== null && t1.next.is_value("ГОРОД", null)) {
                    let tt2 = t1.next.next;
                    if (tt2 === null) 
                        year.end_token = (t1 = t1.next);
                    else if ((tt2.whitespaces_before_count < 3) && ((tt2.morph.class0.is_preposition || tt2.chars.is_all_lower))) 
                        year.end_token = (t1 = t1.next);
                }
            }
            res.push(ReferentToken._new743(dr_year, (t0 = year.begin_token), year.end_token, year.morph));
            if (((dts.length === 3 && year === dts[2] && mon === null) && day === null && dts[0].year > 0) && dts[1].typ === DateItemTokenDateItemType.DELIM && dts[1].end_token.is_hiphen) {
                let dr_year0 = DateReferent._new727((year.new_age < 0 ? -dts[0].year : dts[0].year));
                res.push(new ReferentToken(dr_year0, (t0 = dts[0].begin_token), dts[0].end_token));
            }
        }
        if (mon !== null) {
            dr_mon = DateReferent._new765(mon.int_value);
            if (dr_year !== null) 
                dr_mon.higher = dr_year;
            if (t0 === null || (mon.begin_char < t0.begin_char)) 
                t0 = mon.begin_token;
            if (t1 === null || mon.end_char > t1.end_char) 
                t1 = mon.end_token;
            if (dr_year === null && t1.next !== null && ((t1.next.is_value("ПО", null) || t1.next.is_value("НА", null)))) {
                let rt = t1.kit.process_referent(DateAnalyzer.ANALYZER_NAME, t1.next.next);
                if (rt !== null) {
                    let dr0 = Utils.as(rt.referent, DateReferent);
                    if (dr0 !== null && dr0.year > 0 && dr0.month > 0) {
                        dr_year = DateReferent._new727(dr0.year);
                        res.push(new ReferentToken(dr_year, (t0 = t1), t1));
                        dr_mon.higher = dr_year;
                    }
                }
            }
            res.push(ReferentToken._new743(dr_mon, t0, t1, mon.morph));
            if (day !== null) {
                dr_day = DateReferent._new773(day.int_value);
                dr_day.higher = dr_mon;
                if (day.begin_char < t0.begin_char) 
                    t0 = day.begin_token;
                if (day.end_char > t1.end_char) 
                    t1 = day.end_token;
                let tt = null;
                for (tt = t0.previous; tt !== null; tt = tt.previous) {
                    if (!tt.is_char_of(",.")) 
                        break;
                }
                let dow = DateItemToken.DAYS_OF_WEEK.try_parse(tt, TerminParseAttr.NO);
                if (dow !== null) {
                    t0 = tt;
                    dr_day.day_of_week = dow.termin.tag;
                }
                res.push(ReferentToken._new743(dr_day, t0, t1, day.morph));
                if (dts[0].typ === DateItemTokenDateItemType.HOUR && dts[1].typ === DateItemTokenDateItemType.MINUTE) {
                    let hou = DateReferent._new775(dr_day);
                    hou.hour = dts[0].int_value;
                    hou.minute = dts[1].int_value;
                    if (dts[2].typ === DateItemTokenDateItemType.SECOND) 
                        hou.second = dts[2].int_value;
                    res.push(new ReferentToken(hou, dts[0].begin_token, t1));
                    return res;
                }
            }
        }
        if (point !== null && res.length > 0) {
            let poi = new DateReferent();
            if (point.string_value === "начало") 
                poi.pointer = DatePointerType.BEGIN;
            else if (point.string_value === "середина") 
                poi.pointer = DatePointerType.CENTER;
            else if (point.string_value === "конец") 
                poi.pointer = DatePointerType.END;
            else if (point.int_value !== 0) 
                poi.pointer = DatePointerType.of(point.int_value);
            poi.higher = Utils.as(res[res.length - 1].referent, DateReferent);
            res.push(new ReferentToken(poi, point.begin_token, t1));
            return res;
        }
        if (dr_day !== null && !year_is_dif) {
            let rt = this.try_attach_time(t1.next, true);
            if (rt !== null) {
                (rt.referent).higher = dr_day;
                rt.begin_token = t0;
                res.push(rt);
            }
            else 
                for (let i = 1; i < dts.length; i++) {
                    if (t0.begin_char === dts[i].begin_char) {
                        if (i > 2) {
                            dts.splice(i, dts.length - i);
                            rt = this.try_attach_time_li(dts, true);
                            if (rt !== null) {
                                (rt.referent).higher = dr_day;
                                rt.end_token = t1;
                                res.push(rt);
                            }
                            break;
                        }
                    }
                }
        }
        if (res.length === 1) {
            let dt0 = Utils.as(res[0].referent, DateReferent);
            if (dt0.month === 0) {
                let tt = res[0].begin_token.previous;
                if (tt !== null && tt.is_char('_') && !tt.is_newline_after) {
                    for (; tt !== null; tt = tt.previous) {
                        if (!tt.is_char('_')) 
                            break;
                        else 
                            res[0].begin_token = tt;
                    }
                    if (BracketHelper.can_be_end_of_sequence(tt, true, null, false)) {
                        for (tt = tt.previous; tt !== null; tt = tt.previous) {
                            if (tt.is_newline_after) 
                                break;
                            else if (tt.is_char('_')) {
                            }
                            else {
                                if (BracketHelper.can_be_start_of_sequence(tt, true, false)) 
                                    res[0].begin_token = tt;
                                break;
                            }
                        }
                    }
                }
                tt = res[0].end_token.next;
                if (tt !== null && tt.is_char_of("(,")) {
                    let dit = DateItemToken.try_attach(tt.next, null, false);
                    if (dit !== null && dit.typ === DateItemTokenDateItemType.MONTH) {
                        dr_mon = DateReferent._new776(dt0, dit.int_value);
                        let pr_mon = new ReferentToken(dr_mon, res[0].begin_token, dit.end_token);
                        if (tt.is_char('(') && pr_mon.end_token.next !== null && pr_mon.end_token.next.is_char(')')) 
                            pr_mon.end_token = pr_mon.end_token.next;
                        res.push(pr_mon);
                    }
                }
            }
        }
        if (res.length > 0 && dr_day !== null) {
            let la = res[res.length - 1];
            let tt = la.end_token.next;
            if (tt !== null && tt.is_char(',')) 
                tt = tt.next;
            let tok = DateItemToken.DAYS_OF_WEEK.try_parse(tt, TerminParseAttr.NO);
            if (tok !== null) {
                la.end_token = tok.end_token;
                dr_day.day_of_week = tok.termin.tag;
            }
        }
        return res;
    }
    
    static _find_year_(r) {
        let dr = Utils.as(r, DateReferent);
        if (dr !== null) {
            for (; dr !== null; dr = dr.higher) {
                if (dr.higher === null && dr.year > 0) 
                    return dr;
            }
            return null;
        }
        let drr = Utils.as(r, DateRangeReferent);
        if (drr !== null) {
            if ((((dr = DateAnalyzer._find_year_(drr.date_from)))) !== null) 
                return dr;
            if ((((dr = DateAnalyzer._find_year_(drr.date_to)))) !== null) 
                return dr;
        }
        return null;
    }
    
    try_attach_time(t, after_date) {
        if (t === null) 
            return null;
        if (t.is_value("ГОРОД", null) && t.next !== null) 
            t = t.next;
        while (t !== null && ((t.morph.class0.is_preposition || t.morph.class0.is_adverb || t.is_comma))) {
            if (t.morph.language.is_ru) {
                if (!t.is_value("ПО", null) && !t.is_value("НА", null)) 
                    t = t.next;
                else 
                    break;
            }
            else 
                t = t.next;
        }
        if (t === null) 
            return null;
        let dts = DateItemToken.try_attach_list(t, 10);
        return this.try_attach_time_li(dts, after_date);
    }
    
    _corr_time(t0, time) {
        let t1 = null;
        for (let t = t0; t !== null; t = t.next) {
            if (!((t instanceof TextToken))) 
                break;
            let term = (t).term;
            if (term === "МСК") {
                t1 = t;
                continue;
            }
            if ((t.is_char_of("(") && t.next !== null && t.next.is_value("МСК", null)) && t.next.next !== null && t.next.next.is_char(')')) {
                t1 = (t = t.next.next);
                continue;
            }
            if ((term === "PM" || term === "РМ" || t.is_value("ВЕЧЕР", "ВЕЧІР")) || t.is_value("ДЕНЬ", null)) {
                if (time.hour < 12) 
                    time.hour = time.hour + 12;
                t1 = t;
                continue;
            }
            if ((term === "AM" || term === "АМ" || term === "Ч") || t.is_value("ЧАС", null)) {
                t1 = t;
                continue;
            }
            if (t.is_char('+')) {
                let ddd = DateItemToken.try_attach_list(t.next, 20);
                if ((ddd !== null && ddd.length === 3 && ddd[0].typ === DateItemTokenDateItemType.NUMBER) && ddd[1].typ === DateItemTokenDateItemType.DELIM && ddd[2].typ === DateItemTokenDateItemType.NUMBER) {
                    t1 = ddd[2].end_token;
                    continue;
                }
            }
            if (t.is_char_of(",.")) 
                continue;
            break;
        }
        return t1;
    }
    
    try_attach_time_li(dts, after_date) {
        if (dts === null || (dts.length < 1)) 
            return null;
        let t0 = dts[0].begin_token;
        let t1 = null;
        let time = null;
        if (dts.length === 1) {
            if (dts[0].typ === DateItemTokenDateItemType.HOUR && after_date) {
                time = DateReferent._new731(dts[0].int_value, 0);
                t1 = dts[0].end_token;
            }
            else 
                return null;
        }
        else if (dts[0].typ === DateItemTokenDateItemType.HOUR && dts[1].typ === DateItemTokenDateItemType.MINUTE) {
            time = DateReferent._new731(dts[0].int_value, dts[1].int_value);
            t1 = dts[1].end_token;
            if (dts.length > 2 && dts[2].typ === DateItemTokenDateItemType.SECOND) {
                t1 = dts[2].end_token;
                time.second = dts[2].int_value;
            }
        }
        else if ((((dts.length > 2 && dts[0].typ === DateItemTokenDateItemType.NUMBER && dts[1].typ === DateItemTokenDateItemType.DELIM) && ((dts[1].string_value === ":" || dts[1].string_value === "." || dts[1].string_value === "-")) && dts[2].typ === DateItemTokenDateItemType.NUMBER) && (dts[0].int_value < 24) && (dts[2].int_value < 60)) && dts[2].length_char === 2 && after_date) {
            time = DateReferent._new731(dts[0].int_value, dts[2].int_value);
            t1 = dts[2].end_token;
            if ((dts.length > 4 && dts[3].string_value === dts[1].string_value && dts[4].typ === DateItemTokenDateItemType.NUMBER) && (dts[4].int_value < 60)) {
                time.second = dts[4].int_value;
                t1 = dts[4].end_token;
            }
        }
        if (time === null) 
            return null;
        let tt = this._corr_time(t1.next, time);
        if (tt !== null) 
            t1 = tt;
        let cou = 0;
        for (tt = t0.previous; tt !== null && (cou < 1000); tt = tt.previous,cou++) {
            if (tt.get_referent() instanceof DateReferent) {
                let dr = Utils.as(tt.get_referent(), DateReferent);
                if (dr.find_slot(DateReferent.ATTR_DAY, null, true) === null && dr.higher !== null) 
                    dr = dr.higher;
                if (dr.find_slot(DateReferent.ATTR_DAY, null, true) !== null) {
                    time.higher = dr;
                    break;
                }
            }
        }
        if (t1.next !== null) {
            if (t1.next.is_value("ЧАС", null)) 
                t1 = t1.next;
        }
        return new ReferentToken(time, t0, t1);
    }
    
    apply_rule_formal(its, high, year, mon, day) {
        year.value = null;
        mon.value = null;
        day.value = null;
        let i = 0;
        let j = 0;
        for (i = 0; i < (its.length - 4); i++) {
            if (its[i].begin_token.previous !== null && its[i].begin_token.previous.is_char(')') && (its[i].whitespaces_before_count < 2)) 
                return false;
            if (!its[i].can_be_day && !its[i].can_be_year && !its[i].can_by_month) 
                continue;
            if (!its[i].is_whitespace_before) {
                if (its[i].begin_token.previous !== null && ((its[i].begin_token.previous.is_char_of("(;,") || its[i].begin_token.previous.morph.class0.is_preposition || its[i].begin_token.previous.is_table_control_char))) {
                }
                else 
                    continue;
            }
            for (j = i; j < (i + 4); j++) {
                if (its[j].is_whitespace_after) {
                    if (high && !its[j].is_newline_after) 
                        continue;
                    if (i === 0 && its.length === 5 && ((j === 1 || j === 3))) {
                        if (its[j].whitespaces_after_count < 2) 
                            continue;
                    }
                    break;
                }
            }
            if (j < (i + 4)) 
                continue;
            if (its[i + 1].typ !== DateItemTokenDateItemType.DELIM || its[i + 3].typ !== DateItemTokenDateItemType.DELIM || its[i + 1].string_value !== its[i + 3].string_value) 
                continue;
            j = i + 5;
            if ((j < its.length) && !its[j].is_whitespace_before) {
                if (its[j].typ === DateItemTokenDateItemType.DELIM && its[j].is_whitespace_after) {
                }
                else 
                    continue;
            }
            mon.value = (its[i + 2].can_by_month ? its[i + 2] : null);
            if (!its[i].can_be_day) {
                if (!its[i].can_be_year) 
                    continue;
                year.value = its[i];
                if (mon.value !== null && its[i + 4].can_be_day) 
                    day.value = its[i + 4];
                else if (its[i + 2].can_be_day && its[i + 4].can_by_month) {
                    day.value = its[i + 2];
                    mon.value = its[i + 4];
                }
                else 
                    continue;
            }
            else if (!its[i].can_be_year) {
                if (!its[i + 4].can_be_year) {
                    if (!high) 
                        continue;
                }
                year.value = its[i + 4];
                if (mon.value !== null && its[i].can_be_day) 
                    day.value = its[i];
                else if (its[i].can_by_month && its[i + 2].can_be_day) {
                    mon.value = its[i];
                    day.value = its[i + 2];
                }
                else 
                    continue;
            }
            else 
                continue;
            if ((mon.value.int_value < 10) && !mon.value.is_zero_headed) {
                if (year.value.int_value < 1980) 
                    continue;
            }
            let delim = its[i + 1].string_value[0];
            if ((delim !== '/' && delim !== '\\' && delim !== '.') && delim !== '-') 
                continue;
            if (delim === '.' || delim === '-') {
                if (year.value === its[i] && (year.value.int_value < 1900)) 
                    continue;
            }
            if ((i + 5) < its.length) 
                its.splice(i + 5, its.length - i - 5);
            if (i > 0) 
                its.splice(0, i);
            return true;
        }
        if (its.length >= 5 && its[0].is_whitespace_before && its[4].is_whitespace_after) {
            if (its[1].typ === DateItemTokenDateItemType.DELIM && its[2].typ === DateItemTokenDateItemType.DELIM) {
                if (its[0].length_char === 2 && its[2].length_char === 2 && ((its[4].length_char === 2 || its[4].length_char === 4))) {
                    if (its[0].can_be_day && its[2].can_by_month && its[4].typ === DateItemTokenDateItemType.NUMBER) {
                        if ((!its[0].is_whitespace_after && !its[1].is_whitespace_after && !its[2].is_whitespace_after) && !its[3].is_whitespace_after) {
                            let iyear = 0;
                            let y = its[4].int_value;
                            if (y > 80 && (y < 100)) 
                                iyear = 1900 + y;
                            else if (y <= (Utils.getDate(Utils.now()).getFullYear() - 2000)) 
                                iyear = y + 2000;
                            else 
                                return false;
                            its[4].year = iyear;
                            year.value = its[4];
                            mon.value = its[2];
                            day.value = its[0];
                            return true;
                        }
                    }
                }
            }
        }
        if (high && its[0].can_be_year && its.length === 1) {
            year.value = its[0];
            return true;
        }
        if (its[0].begin_token.previous !== null && its[0].begin_token.previous.is_value("ОТ", null) && its.length === 4) {
            if (its[0].can_be_day && its[3].can_be_year) {
                if (its[1].typ === DateItemTokenDateItemType.DELIM && its[2].can_by_month) {
                    year.value = its[3];
                    mon.value = its[2];
                    day.value = its[0];
                    return true;
                }
                if (its[2].typ === DateItemTokenDateItemType.DELIM && its[1].can_by_month) {
                    year.value = its[3];
                    mon.value = its[1];
                    day.value = its[0];
                    return true;
                }
            }
        }
        if ((its.length === 3 && its[0].typ === DateItemTokenDateItemType.NUMBER && its[0].can_be_day) && its[2].typ === DateItemTokenDateItemType.YEAR && its[1].can_by_month) {
            if (BracketHelper.is_bracket(its[0].begin_token, false) && BracketHelper.is_bracket(its[0].end_token, false)) {
                year.value = its[2];
                mon.value = its[1];
                day.value = its[0];
                return true;
            }
        }
        return false;
    }
    
    apply_rule_with_month(its, high, year, mon, day, year_is_diff) {
        year.value = null;
        mon.value = null;
        day.value = null;
        year_is_diff.value = false;
        let i = 0;
        if (its.length === 2) {
            if (its[0].typ === DateItemTokenDateItemType.MONTH && its[1].typ === DateItemTokenDateItemType.YEAR) {
                year.value = its[1];
                mon.value = its[0];
                return true;
            }
            if (its[0].can_be_day && its[1].typ === DateItemTokenDateItemType.MONTH) {
                mon.value = its[1];
                day.value = its[0];
                return true;
            }
        }
        for (i = 0; i < its.length; i++) {
            if (its[i].typ === DateItemTokenDateItemType.MONTH) 
                break;
        }
        if (i >= its.length) 
            return false;
        let lang = its[i].lang;
        year.value = null;
        day.value = null;
        mon.value = its[i];
        let i0 = i;
        let i1 = i;
        let year_val = 0;
        if (MorphLang.ooNoteq((MorphLang.ooBitand(lang, (MorphLang.ooBitor(MorphLang.ooBitor(MorphLang.RU, MorphLang.ooBitor(MorphLang.IT, MorphLang.BY)), MorphLang.UA)))), MorphLang.UNKNOWN)) {
            if (((i + 1) < its.length) && its[i + 1].typ === DateItemTokenDateItemType.YEAR) {
                year.value = its[i + 1];
                i1 = i + 1;
                if (i > 0 && its[i - 1].can_be_day) {
                    day.value = its[i - 1];
                    i0 = i - 1;
                }
            }
            else if (i > 0 && its[i - 1].typ === DateItemTokenDateItemType.YEAR) {
                year.value = its[i - 1];
                i0 = i - 1;
                if (((i + 1) < its.length) && its[i + 1].can_be_day) {
                    day.value = its[i + 1];
                    i1 = i + 1;
                }
            }
            else if (((i + 1) < its.length) && its[i + 1].can_be_year) {
                if (its[i + 1].typ === DateItemTokenDateItemType.NUMBER) {
                    let t00 = its[0].begin_token;
                    if (t00.previous !== null && t00.previous.is_char_of(".,")) 
                        t00 = t00.previous.previous;
                    if (t00 !== null && (t00.whitespaces_after_count < 3)) {
                        if (((t00.is_value("УЛИЦА", null) || t00.is_value("УЛ", null) || t00.is_value("ПРОСПЕКТ", null)) || t00.is_value("ПРОСП", null) || t00.is_value("ПР", null)) || t00.is_value("ПЕРЕУЛОК", null) || t00.is_value("ПЕР", null)) 
                            return false;
                    }
                }
                year.value = its[i + 1];
                i1 = i + 1;
                if (i > 0 && its[i - 1].can_be_day) {
                    day.value = its[i - 1];
                    i0 = i - 1;
                }
            }
            else if ((i === 0 && its[0].typ === DateItemTokenDateItemType.MONTH && its.length === 3) && its[i + 1].typ === DateItemTokenDateItemType.DELIM && its[i + 2].can_be_year) {
                year.value = its[i + 2];
                i1 = i + 2;
            }
            else if (i > 1 && its[i - 2].can_be_year && its[i - 1].can_be_day) {
                year.value = its[i - 2];
                day.value = its[i - 1];
                i0 = i - 2;
            }
            else if (i > 0 && its[i - 1].can_be_year) {
                year.value = its[i - 1];
                i0 = i - 1;
                if (((i + 1) < its.length) && its[i + 1].can_be_day) {
                    day.value = its[i + 1];
                    i1 = i + 1;
                }
            }
            if (year.value === null && i === 1 && its[i - 1].can_be_day) {
                for (let j = i + 1; j < its.length; j++) {
                    if (its[j].typ === DateItemTokenDateItemType.DELIM) {
                        if ((++j) >= its.length) 
                            break;
                    }
                    if (its[j].typ === DateItemTokenDateItemType.YEAR) {
                        year.value = its[j];
                        day.value = its[i - 1];
                        i0 = i - 1;
                        i1 = i;
                        year_is_diff.value = true;
                        break;
                    }
                    if (!its[j].can_be_day) 
                        break;
                    if ((++j) >= its.length) 
                        break;
                    if (its[j].typ !== DateItemTokenDateItemType.MONTH) 
                        break;
                }
            }
        }
        else if (MorphLang.ooEq(lang, MorphLang.EN)) {
            if (i === 1 && its[0].can_be_day) {
                i1 = 2;
                day.value = its[0];
                i0 = 0;
                if ((i1 < its.length) && its[i1].typ === DateItemTokenDateItemType.DELIM) 
                    i1++;
                if ((i1 < its.length) && its[i1].can_be_year) 
                    year.value = its[i1];
                if (year.value === null) {
                    i1 = 1;
                    year_val = this.find_year(its[0].begin_token);
                }
            }
            else if (i === 0) {
                if (its.length > 1 && its[1].can_be_year && !its[1].can_be_day) {
                    i1 = 2;
                    year.value = its[1];
                }
                else if (its.length > 1 && its[1].can_be_day) {
                    day.value = its[1];
                    i1 = 2;
                    if ((i1 < its.length) && its[i1].typ === DateItemTokenDateItemType.DELIM) 
                        i1++;
                    if ((i1 < its.length) && its[i1].can_be_year) 
                        year.value = its[i1];
                    if (year.value === null) {
                        i1 = 1;
                        year_val = this.find_year(its[0].begin_token);
                    }
                }
            }
        }
        if (year.value === null && year_val === 0 && its.length === 3) {
            if (its[0].typ === DateItemTokenDateItemType.YEAR && its[1].can_be_day && its[2].typ === DateItemTokenDateItemType.MONTH) {
                i1 = 2;
                year.value = its[0];
                day.value = its[1];
            }
        }
        if (year.value !== null || year_val > 0) 
            return true;
        if (day.value !== null && its.length === 2) 
            return true;
        return false;
    }
    
    find_year(t) {
        let year = 0;
        let prevdist = 0;
        for (let tt = t; tt !== null; tt = tt.previous) {
            if (tt.is_newline_before) 
                prevdist += 10;
            prevdist++;
            if (tt instanceof ReferentToken) {
                if ((tt).referent instanceof DateReferent) {
                    year = ((tt).referent).year;
                    break;
                }
            }
        }
        let dist = 0;
        for (let tt = t; tt !== null; tt = tt.next) {
            if (tt.is_newline_after) 
                dist += 10;
            dist++;
            if (tt instanceof ReferentToken) {
                if ((tt).referent instanceof DateReferent) {
                    if (year > 0 && (prevdist < dist)) 
                        return year;
                    else 
                        return ((tt).referent).year;
                }
            }
        }
        return year;
    }
    
    apply_rule_year_only(its, year, mon, day) {
        year.value = null;
        mon.value = null;
        day.value = null;
        let i = 0;
        let doubt = false;
        for (i = 0; i < its.length; i++) {
            if (its[i].typ === DateItemTokenDateItemType.YEAR) 
                break;
            else if (its[i].typ === DateItemTokenDateItemType.NUMBER) 
                doubt = true;
            else if (its[i].typ !== DateItemTokenDateItemType.DELIM) 
                return false;
        }
        if (i >= its.length) {
            if (((its.length === 1 && its[0].can_be_year && its[0].int_value > 1900) && its[0].can_be_year && (its[0].int_value < 2100)) && its[0].begin_token.previous !== null) {
                if (((its[0].begin_token.previous.is_value("В", null) || its[0].begin_token.previous.is_value("У", null) || its[0].begin_token.previous.is_value("З", null)) || its[0].begin_token.previous.is_value("IN", null) || its[0].begin_token.previous.is_value("SINCE", null))) {
                    if (its[0].length_char === 4 || its[0].begin_token.morph.class0.is_adjective) {
                        year.value = its[0];
                        return true;
                    }
                }
            }
            return false;
        }
        if ((i + 1) === its.length) {
            if (its[i].int_value > 1900 || its[i].new_age !== 0) {
                year.value = its[i];
                return true;
            }
            if (doubt) 
                return false;
            if (its[i].int_value > 10 && (its[i].int_value < 100)) {
                if (its[i].begin_token.previous !== null) {
                    if (its[i].begin_token.previous.is_value("В", null) || its[i].begin_token.previous.is_value("IN", null) || its[i].begin_token.previous.is_value("У", null)) {
                        year.value = its[i];
                        return true;
                    }
                }
                if (its[i].begin_token.is_value("В", null) || its[i].begin_token.is_value("У", null) || its[i].begin_token.is_value("IN", null)) {
                    year.value = its[i];
                    return true;
                }
            }
            if (its[i].int_value >= 100) {
                year.value = its[i];
                return true;
            }
            return false;
        }
        if (its.length === 1 && its[0].typ === DateItemTokenDateItemType.YEAR && its[0].year <= 0) {
            year.value = its[0];
            return true;
        }
        if (((its.length > 2 && its[0].can_be_year && its[1].typ === DateItemTokenDateItemType.DELIM) && its[1].begin_token.is_hiphen && its[2].typ === DateItemTokenDateItemType.YEAR) && (its[0].year0 < its[2].year0)) {
            year.value = its[0];
            return true;
        }
        if (its[0].typ === DateItemTokenDateItemType.YEAR) {
            if ((its[0].begin_token.previous !== null && its[0].begin_token.previous.is_hiphen && (its[0].begin_token.previous.previous instanceof ReferentToken)) && (its[0].begin_token.previous.previous.get_referent() instanceof DateReferent)) {
                year.value = its[0];
                return true;
            }
        }
        return false;
    }
    
    apply_date_range(ad, its, lang) {
        lang.value = new MorphLang();
        if (its === null || (its.length < 3)) 
            return null;
        if ((its[0].can_be_year && its[1].string_value === "-" && its[2].typ === DateItemTokenDateItemType.YEAR) && (its[0].year < its[2].year)) {
            let res = new DateRangeReferent();
            res.date_from = Utils.as(ad.register_referent(DateReferent._new727(its[0].year)), DateReferent);
            let rt1 = new ReferentToken(res.date_from, its[0].begin_token, its[0].end_token);
            res.date_to = Utils.as(ad.register_referent(DateReferent._new727(its[2].year)), DateReferent);
            let rt2 = new ReferentToken(res.date_to, its[2].begin_token, its[2].end_token);
            lang.value = its[2].lang;
            return res;
        }
        return null;
    }
    
    apply_date_range0(kit, ad) {
        for (let t = kit.first_token; t !== null; t = t.next) {
            if (!((t instanceof TextToken))) 
                continue;
            let year_val1 = 0;
            let year_val2 = 0;
            let date1 = null;
            let date2 = null;
            let lang = new MorphLang();
            let t0 = t.next;
            let str = (t).term;
            if (str === "ON" && (t0 instanceof TextToken)) {
                let tok = DateItemToken.DAYS_OF_WEEK.try_parse(t0, TerminParseAttr.NO);
                if (tok !== null) {
                    let dow = DateReferent._new785(tok.termin.tag);
                    let rtd = new ReferentToken(ad.register_referent(dow), t, tok.end_token);
                    kit.embed_token(rtd);
                    t = rtd;
                    continue;
                }
            }
            if (str === "С" || str === "C") 
                lang = MorphLang.RU;
            else if (str === "З") 
                lang = MorphLang.UA;
            else if (str === "BETWEEN") 
                lang = MorphLang.EN;
            else if (str === "IN") {
                lang = MorphLang.EN;
                if ((t0 !== null && t0.is_value("THE", null) && t0.next !== null) && t0.next.is_value("PERIOD", null)) 
                    t0 = t0.next.next;
            }
            else if (str === "ПО" || str === "ДО") {
                if ((t.next instanceof ReferentToken) && (t.next.get_referent() instanceof DateReferent)) {
                    let dr = DateRangeReferent._new730(Utils.as(t.next.get_referent(), DateReferent));
                    let rt0 = new ReferentToken(ad.register_referent(dr), t, t.next);
                    kit.embed_token(rt0);
                    t = rt0;
                    continue;
                }
            }
            else 
                continue;
            if (t0 === null) 
                continue;
            if (t0 instanceof ReferentToken) 
                date1 = Utils.as((t0).referent, DateReferent);
            if (date1 === null) {
                if ((t0 instanceof NumberToken) && (t0).int_value !== null) {
                    let v = (t0).int_value;
                    if ((v < 1000) || v >= 2100) 
                        continue;
                    year_val1 = v;
                }
                else 
                    continue;
            }
            else 
                year_val1 = date1.year;
            let t1 = t0.next;
            if (t1 === null) 
                continue;
            if (t1.is_value("ПО", "ДО") || t1.is_value("ДО", null)) 
                lang = t1.morph.language;
            else if (t1.is_value("AND", null)) 
                lang = MorphLang.EN;
            else if (t1.is_hiphen && MorphLang.ooEq(lang, MorphLang.EN)) {
            }
            else if (lang.is_ua && t1.is_value("І", null)) {
            }
            else 
                continue;
            t1 = t1.next;
            if (t1 === null) 
                continue;
            if (t1 instanceof ReferentToken) 
                date2 = Utils.as((t1).referent, DateReferent);
            if (date2 === null) {
                if ((t1 instanceof NumberToken) && (t1).int_value !== null) {
                    let nt1 = NumberHelper.try_parse_number_with_postfix(t1);
                    if (nt1 !== null) 
                        continue;
                    let v = (t1).int_value;
                    if (v > 0 && (v < year_val1)) {
                        let yy = year_val1 % 100;
                        if (yy < v) 
                            v += (((Utils.intDiv(year_val1, 100))) * 100);
                    }
                    if ((v < 1000) || v >= 2100) 
                        continue;
                    year_val2 = v;
                }
                else 
                    continue;
            }
            else 
                year_val2 = date2.year;
            if (year_val1 > year_val2 && year_val2 > 0) 
                continue;
            if (year_val1 === year_val2) {
                if (date1 === null || date2 === null) 
                    continue;
                if (DateReferent.compare(date1, date2) >= 0) 
                    continue;
            }
            if (date1 === null) {
                date1 = Utils.as(ad.register_referent(DateReferent._new727(year_val1)), DateReferent);
                let rt0 = new ReferentToken(date1, t0, t0);
                kit.embed_token(rt0);
                if (t0 === t) 
                    t = rt0;
            }
            if (date2 === null) {
                date2 = Utils.as(ad.register_referent(DateReferent._new727(year_val2)), DateReferent);
                let rt1 = new ReferentToken(date2, t1, t1);
                kit.embed_token(rt1);
                t1 = rt1;
            }
            t = new ReferentToken(ad.register_referent(DateRangeReferent._new724(date1, date2)), t, t1);
            kit.embed_token(Utils.as(t, ReferentToken));
        }
    }
    
    static initialize() {
        /* this is synchronized block by DateAnalyzer.m_lock, but this feature isn't supported in JS */ {
            if (DateAnalyzer.m_inited) 
                return;
            DateAnalyzer.m_inited = true;
            MeasureAnalyzer.initialize();
            MetaDate.initialize();
            MetaDateRange.initialize();
            try {
                Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
                DateItemToken.initialize();
                Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
            } catch (ex) {
                throw new Error(ex.message);
            }
            ProcessorService.register_analyzer(new DateAnalyzer());
        }
        MeasureAnalyzer.initialize();
    }
    
    static static_constructor() {
        DateAnalyzer.ANALYZER_NAME = "DATE";
        DateAnalyzer.m_lock = new Object();
        DateAnalyzer.m_inited = false;
    }
}


DateAnalyzer.DateAnalizerData = class  extends AnalyzerData {
    
    constructor() {
        super();
        this.m_hash = new Hashtable();
    }
    
    get referents() {
        return this.m_hash.values;
    }
    
    register_referent(referent) {
        let key = referent.toString();
        let dr = null;
        let wrapdr721 = new RefOutArgWrapper();
        let inoutres722 = this.m_hash.tryGetValue(key, wrapdr721);
        dr = wrapdr721.value;
        if (inoutres722) 
            return dr;
        this.m_hash.put(key, referent);
        return referent;
    }
}


DateAnalyzer.static_constructor();

module.exports = DateAnalyzer
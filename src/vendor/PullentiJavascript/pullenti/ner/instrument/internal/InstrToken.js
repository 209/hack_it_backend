/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const UriReferent = require("./../../uri/UriReferent");
const DecreePartReferent = require("./../../decree/DecreePartReferent");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const BankDataReferent = require("./../../bank/BankDataReferent");
const GeoReferent = require("./../../geo/GeoReferent");
const DecreeTokenItemType = require("./../../decree/internal/DecreeTokenItemType");
const DateReferent = require("./../../date/DateReferent");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const MorphLang = require("./../../../morph/MorphLang");
const MorphClass = require("./../../../morph/MorphClass");
const MorphGender = require("./../../../morph/MorphGender");
const DecreeKind = require("./../../decree/DecreeKind");
const NumberToken = require("./../../NumberToken");
const MiscHelper = require("./../../core/MiscHelper");
const Termin = require("./../../core/Termin");
const MetaToken = require("./../../MetaToken");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const PersonPropertyReferent = require("./../../person/PersonPropertyReferent");
const TextToken = require("./../../TextToken");
const PersonReferent = require("./../../person/PersonReferent");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const ILTypes = require("./ILTypes");
const ReferentToken = require("./../../ReferentToken");
const TerminCollection = require("./../../core/TerminCollection");
const BracketHelper = require("./../../core/BracketHelper");
const DecreeReferent = require("./../../decree/DecreeReferent");
const OrganizationReferent = require("./../../org/OrganizationReferent");
const InstrToken1Types = require("./InstrToken1Types");
const DecreeToken = require("./../../decree/internal/DecreeToken");
const InstrumentParticipant = require("./../InstrumentParticipant");
const PersonAnalyzer = require("./../../person/PersonAnalyzer");

class InstrToken extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.typ = ILTypes.UNDEFINED;
        this.value = null;
        this.ref = null;
        this.has_verb = false;
        this.no_words = false;
    }
    
    static initialize() {
        if (InstrToken.m_ontology !== null) 
            return;
        InstrToken.m_ontology = new TerminCollection();
        let t = null;
        t = new Termin("МЕСТО ПЕЧАТИ");
        t.add_abridge("М.П.");
        t.add_abridge("M.П.");
        InstrToken.m_ontology.add(t);
        t = new Termin("МІСЦЕ ПЕЧАТКИ", MorphLang.UA);
        t.add_abridge("М.П.");
        t.add_abridge("M.П.");
        InstrToken.m_ontology.add(t);
        t = new Termin("ПОДПИСЬ");
        InstrToken.m_ontology.add(t);
        t = new Termin("ПІДПИС", MorphLang.UA);
        InstrToken.m_ontology.add(t);
        t = Termin._new114("ФАМИЛИЯ ИМЯ ОТЧЕСТВО", "ФИО");
        t.add_abridge("Ф.И.О.");
        InstrToken.m_ontology.add(t);
        t = Termin._new1504("ПРІЗВИЩЕ ІМЯ ПО БАТЬКОВІ", MorphLang.UA, "ФИО");
        InstrToken.m_ontology.add(t);
        t = new Termin("ФАМИЛИЯ");
        t.add_abridge("ФАМ.");
        InstrToken.m_ontology.add(t);
        t = new Termin("ПРІЗВИЩЕ", MorphLang.UA);
        t.add_abridge("ФАМ.");
        InstrToken.m_ontology.add(t);
        InstrToken.m_ontology.add(new Termin("ИМЯ"));
        InstrToken.m_ontology.add(new Termin("ІМЯ", MorphLang.UA));
    }
    
    get is_pure_person() {
        if (this.ref instanceof ReferentToken) {
            let rt = Utils.as(this.ref, ReferentToken);
            if ((rt.referent instanceof PersonReferent) || (rt.referent instanceof PersonPropertyReferent)) 
                return true;
            if (rt.referent instanceof InstrumentParticipant) {
                for (let t = rt.begin_token; t !== null && t.end_char <= rt.end_char; t = t.next) {
                    if ((t.get_referent() instanceof PersonReferent) || (t.get_referent() instanceof PersonPropertyReferent)) 
                        return true;
                    else if ((t instanceof TextToken) && t.chars.is_letter) 
                        break;
                }
                return false;
            }
        }
        return this.ref instanceof PersonReferent;
    }
    
    get is_podpis_storon() {
        if (!this.is_newline_before || !this.is_newline_after) 
            return false;
        if (!this.begin_token.is_value("ПОДПИСЬ", "ПІДПИС")) 
            return false;
        let t = this.begin_token.next;
        if (t !== null && t.is_value("СТОРОНА", null)) 
            t = t.next;
        if (t !== null && t.is_char_of(":.")) 
            t = t.next;
        if (this.end_token.next === t) 
            return true;
        return false;
    }
    
    get has_table_chars() {
        for (let t = this.begin_token; t !== null && t.end_char <= this.end_char; t = t.next) {
            if (t.is_table_control_char) 
                return true;
        }
        if (this.end_token.next !== null && this.end_token.next.is_table_control_char && !this.end_token.next.is_char(String.fromCharCode(0x1E))) 
            return true;
        if (this.begin_token.previous !== null && this.begin_token.previous.is_table_control_char && !this.begin_token.previous.is_char(String.fromCharCode(0x1F))) 
            return true;
        return false;
    }
    
    toString() {
        let tmp = new StringBuilder();
        if (this.is_newline_before) 
            tmp.append("<<");
        tmp.append(this.typ.toString());
        if (this.value !== null) 
            tmp.append(" '").append(this.value).append("'");
        if (this.ref !== null) 
            tmp.append(" -> ").append(this.ref.toString());
        if (this.has_verb) 
            tmp.append(" HasVerb");
        if (this.no_words) 
            tmp.append(" NoWords");
        if (this.has_table_chars) 
            tmp.append(" HasTableChars");
        if (this.is_newline_after) 
            tmp.append(">>");
        tmp.append(": ").append(this.get_source_text());
        return tmp.toString();
    }
    
    static parse_list(t0, max_char = 0) {
        const InstrToken1 = require("./InstrToken1");
        let res = new Array();
        for (let t = t0; t !== null; t = t.next) {
            if (max_char > 0) {
                if (t.begin_char > max_char) 
                    break;
            }
            if (res.length === 272) {
            }
            let it = InstrToken.parse(t, max_char, (res.length > 0 ? res[res.length - 1] : null));
            if (it === null) 
                break;
            if (res.length === 286) {
            }
            if (it.typ === ILTypes.APPENDIX) {
            }
            if (it.typ === ILTypes.TYP) {
            }
            if (res.length > 0) {
                if (res[res.length - 1].end_char > it.begin_char) 
                    break;
            }
            if ((it.end_token.next instanceof TextToken) && it.end_token.next.is_char('.')) 
                it.end_token = it.end_token.next;
            if (it.typ === ILTypes.UNDEFINED && t.is_newline_before) {
                let it1 = InstrToken1.parse(t, true, null, 0, null, false, 0, false, false);
                if (it1 !== null && it1.has_changes && it1.end_char > it.end_char) 
                    it.end_token = it1.end_token;
            }
            res.push(it);
            if (it.end_char > t.begin_char) 
                t = it.end_token;
        }
        return res;
    }
    
    static _correct_person(res) {
        let spec_chars = 0;
        if (!res.is_pure_person) {
            res.typ = ILTypes.UNDEFINED;
            return res;
        }
        for (let t = res.end_token.next; t !== null; t = t.next) {
            if ((t instanceof ReferentToken) && (res.ref instanceof ReferentToken)) {
                let ok = false;
                if (t.get_referent() === (res.ref).referent) 
                    ok = true;
                let ip = Utils.as((res.ref).referent, InstrumentParticipant);
                if (ip !== null && ip.contains_ref(t.get_referent())) 
                    ok = true;
                if (!ok && t.previous !== null && t.previous.is_table_control_char) {
                    if (((res.ref).referent instanceof PersonPropertyReferent) && (t.get_referent() instanceof PersonReferent)) {
                        ok = true;
                        res.ref = t;
                    }
                }
                if (ok) {
                    res.end_token = t;
                    continue;
                }
            }
            let tok = InstrToken.m_ontology.try_parse(t, TerminParseAttr.NO);
            if (tok !== null) {
                if ((((tok.termin.canonic_text === "ПОДПИСЬ" || tok.termin.canonic_text === "ПІДПИС")) && t.is_newline_before && t.next !== null) && t.next.is_value("СТОРОНА", null)) 
                    break;
                res.end_token = (t = tok.end_token);
                continue;
            }
            if (t.is_char(',')) 
                continue;
            if (t.is_table_control_char && !t.is_newline_before) 
                continue;
            if (t.is_char_of("_/\\")) {
                res.end_token = t;
                spec_chars++;
                continue;
            }
            if (t.is_char('(') && t.next !== null) {
                if ((((tok = InstrToken.m_ontology.try_parse(t.next, TerminParseAttr.NO)))) !== null) {
                    let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                    if (br !== null) {
                        res.end_token = (t = br.end_token);
                        continue;
                    }
                }
            }
            break;
        }
        let rt0 = Utils.as(res.ref, ReferentToken);
        if (rt0 !== null && (rt0.referent instanceof InstrumentParticipant)) {
            for (let tt = res.begin_token; tt !== null && tt.end_char <= res.end_char; tt = tt.next) {
                if ((tt.get_referent() instanceof PersonReferent) || (tt.get_referent() instanceof PersonPropertyReferent)) {
                    res.ref = tt;
                    return res;
                }
                else if ((tt instanceof TextToken) && tt.is_char_of("_/\\")) 
                    spec_chars++;
                else if (tt instanceof MetaToken) {
                    for (let ttt = (tt).begin_token; ttt !== null && ttt.end_char <= tt.end_char; ttt = ttt.next) {
                        if ((ttt.get_referent() instanceof PersonReferent) || (ttt.get_referent() instanceof PersonPropertyReferent)) {
                            res.ref = ttt;
                            return res;
                        }
                        else if ((ttt instanceof TextToken) && ttt.is_char_of("_/\\")) 
                            spec_chars++;
                    }
                }
            }
            if (spec_chars < 10) 
                res.typ = ILTypes.UNDEFINED;
        }
        return res;
    }
    
    static parse(t, max_char = 0, prev = null) {
        const InstrToken1 = require("./InstrToken1");
        let is_start_of_line = false;
        let t00 = t;
        if (t !== null) {
            is_start_of_line = t00.is_newline_before;
            while (t !== null) {
                if (t.is_table_control_char && !t.is_char(String.fromCharCode(0x1F))) {
                    if (t.is_newline_after && !is_start_of_line) 
                        is_start_of_line = true;
                    t = t.next;
                }
                else 
                    break;
            }
        }
        if (t === null) 
            return null;
        if (t.is_newline_before) 
            is_start_of_line = true;
        if (is_start_of_line) {
            if ((t.is_value("СОДЕРЖИМОЕ", "ВМІСТ") || t.is_value("СОДЕРЖАНИЕ", "ЗМІСТ") || t.is_value("ОГЛАВЛЕНИЕ", "ЗМІСТ")) || ((t.is_value("СПИСОК", null) && t.next !== null && t.next.is_value("РАЗДЕЛ", null)))) {
                let cont = InstrToken1.parse(t, true, null, 0, null, false, 0, false, false);
                if (cont !== null && cont.typ === InstrToken1Types.INDEX) 
                    return new InstrToken(t, cont.end_token);
            }
        }
        let t0 = t;
        let t1 = null;
        let has_word = false;
        for (; t !== null; t = t.next) {
            if (t.is_newline_before && t !== t0) 
                break;
            if (max_char > 0 && t.begin_char > max_char) 
                break;
            if (is_start_of_line && t === t0) {
                if (t.is_value("ГЛАВА", null)) {
                    let _next = InstrToken.parse(t.next, 0, null);
                    if (_next !== null && _next.typ === ILTypes.PERSON) {
                        _next.begin_token = t;
                        return _next;
                    }
                }
                let tt = null;
                if ((t.get_referent() instanceof PersonReferent) || (t.get_referent() instanceof PersonPropertyReferent) || (t.get_referent() instanceof InstrumentParticipant)) 
                    return InstrToken._correct_person(InstrToken._new1505(t00, t, ILTypes.PERSON, t));
                let is_ref = false;
                if (t.get_referent() instanceof PersonPropertyReferent) {
                    tt = t.next;
                    is_ref = true;
                }
                else if (prev !== null && prev.typ === ILTypes.PERSON) {
                    let rt = t.kit.process_referent(PersonAnalyzer.ANALYZER_NAME, t);
                    if (rt !== null) {
                        if (rt.referent instanceof PersonReferent) 
                            return InstrToken._new1506(t00, rt.end_token, ILTypes.PERSON);
                        tt = rt.end_token.next;
                    }
                }
                let cou = 0;
                let t11 = (tt === null ? null : tt.previous);
                for (; tt !== null; tt = tt.next) {
                    if (tt.is_table_control_char) 
                        continue;
                    let re = tt.get_referent();
                    if (re instanceof PersonReferent) 
                        return InstrToken._new1505(t00, tt, ILTypes.PERSON, tt);
                    if (re instanceof GeoReferent) {
                        t11 = tt;
                        continue;
                    }
                    if (re !== null) 
                        break;
                    if (DecreeToken.is_keyword(tt, false) !== null) 
                        break;
                    if (tt.is_newline_before) {
                        if ((++cou) > 4) 
                            break;
                    }
                }
                if (tt === null && is_ref) 
                    return InstrToken._new1505(t00, (t11 != null ? t11 : t), ILTypes.PERSON, t);
            }
            let dt = DecreeToken.try_attach(t, null, false);
            if (dt !== null) {
                if (dt.typ === DecreeTokenItemType.TYP && !t.chars.is_all_lower) {
                    if (t !== t0) 
                        break;
                    let _has_verb = false;
                    for (let tt = dt.end_token; tt !== null; tt = tt.next) {
                        if (tt.is_newline_before) 
                            break;
                        else if ((tt instanceof TextToken) && (tt).is_pure_verb) {
                            _has_verb = true;
                            break;
                        }
                    }
                    if (!_has_verb) {
                        let res2 = InstrToken._new1509(t0, dt.end_token, ILTypes.TYP, (dt.full_value != null ? dt.full_value : dt.value));
                        if (res2.value === "ДОПОЛНИТЕЛЬНОЕ СОГЛАШЕНИЕ" || res2.value === "ДОДАТКОВА УГОДА") {
                            if (res2.begin_char > 500 && res2.newlines_before_count > 1) 
                                res2.typ = ILTypes.APPENDIX;
                        }
                        return res2;
                    }
                }
                if (dt.typ === DecreeTokenItemType.NUMBER) {
                    if (t !== t0) 
                        break;
                    return InstrToken._new1509(t0, dt.end_token, ILTypes.REGNUMBER, dt.value);
                }
                if (dt.typ === DecreeTokenItemType.ORG) {
                    if (t !== t0) 
                        break;
                    return InstrToken._new1511(t0, dt.end_token, ILTypes.ORGANIZATION, dt.ref, dt.value);
                }
                if (dt.typ === DecreeTokenItemType.TERR) {
                    if (t !== t0) 
                        break;
                    let re = InstrToken._new1511(t0, dt.end_token, ILTypes.GEO, dt.ref, dt.value);
                    t1 = re.end_token.next;
                    if (t1 !== null && t1.is_char(',')) 
                        t1 = t1.next;
                    if (t1 !== null && t1.is_value("КРЕМЛЬ", null)) 
                        re.end_token = t1;
                    else if ((t1 !== null && t1.is_value("ДОМ", "БУДИНОК") && t1.next !== null) && t1.next.is_value("СОВЕТ", "РАД")) {
                        re.end_token = t1.next;
                        if (t1.next.next !== null && (t1.next.next.get_referent() instanceof GeoReferent)) 
                            re.end_token = t1.next.next;
                    }
                    return re;
                }
                if (dt.typ === DecreeTokenItemType.OWNER) {
                    if (t !== t0) 
                        break;
                    if (dt.ref !== null && dt.ref.referent.toString().startsWith("агент")) 
                        dt = null;
                    if (dt !== null) {
                        let res1 = InstrToken._new1511(t0, dt.end_token, ILTypes.PERSON, dt.ref, dt.value);
                        return InstrToken._correct_person(res1);
                    }
                }
            }
            if (BracketHelper.can_be_start_of_sequence(t, false, false)) {
                let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (br !== null) {
                    t = (t1 = br.end_token);
                    continue;
                }
                if (t.next !== null && BracketHelper.can_be_end_of_sequence(t.next, false, null, false)) {
                    t = (t1 = t.next);
                    continue;
                }
            }
            if (t instanceof TextToken) {
                if (t.is_char('_')) {
                    t1 = t;
                    continue;
                }
            }
            let r = t.get_referent();
            if (r instanceof DateReferent) {
                let tt = t;
                if (tt.next !== null && tt.next.is_char_of(",;")) 
                    tt = tt.next;
                if (!t.is_newline_before && !tt.is_newline_after) {
                    t1 = tt;
                    continue;
                }
                if (!has_word) 
                    return InstrToken._new1505(t, tt, ILTypes.DATE, t);
                if (t !== t0) 
                    break;
            }
            has_word = true;
            if (r instanceof InstrumentParticipant) {
                for (let tt = (t).begin_token; tt !== null && (tt.end_char < t.end_char); tt = tt.next) {
                    let rr = tt.get_referent();
                    if (rr === null) 
                        continue;
                    if ((rr instanceof OrganizationReferent) || (rr instanceof BankDataReferent) || (rr instanceof UriReferent)) {
                        r = null;
                        break;
                    }
                }
            }
            if ((r instanceof PersonReferent) || (r instanceof PersonPropertyReferent) || (r instanceof InstrumentParticipant)) {
                if (t !== t0) 
                    break;
                if (r instanceof InstrumentParticipant) {
                }
                let res1 = InstrToken._new1505(t, t, ILTypes.PERSON, t);
                return InstrToken._correct_person(res1);
            }
            if (r instanceof OrganizationReferent) {
                if (t !== t0) 
                    break;
                return InstrToken._new1505(t, t, ILTypes.ORGANIZATION, t);
            }
            if (r instanceof DecreePartReferent) {
                let dpr = Utils.as(r, DecreePartReferent);
                if (dpr.appendix !== null) {
                    if (t.is_newline_before || is_start_of_line) {
                        if (t.is_newline_after || t.whitespaces_before_count > 30) 
                            return InstrToken._new1509(t, t, ILTypes.APPENDIX, "ПРИЛОЖЕНИЕ");
                        let ok = true;
                        for (let tt = t.next; tt !== null; tt = tt.next) {
                            if (tt.is_newline_before) 
                                break;
                            let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                            if (npt !== null) {
                                tt = npt.end_token;
                                continue;
                            }
                            ok = false;
                            break;
                        }
                        if (ok) 
                            return InstrToken._new1509(t, t, ILTypes.APPENDIX, "ПРИЛОЖЕНИЕ");
                    }
                }
            }
            if ((r instanceof DecreeReferent) && (r).kind === DecreeKind.PUBLISHER && t === t0) {
                let res1 = InstrToken._new1506(t, t, ILTypes.APPROVED);
                for (let tt = t.next; tt !== null; tt = tt.next) {
                    if (tt.is_char_of(",;")) 
                        continue;
                    if ((tt.get_referent() instanceof DecreeReferent) && (tt.get_referent()).kind === DecreeKind.PUBLISHER) 
                        res1.end_token = t;
                    else 
                        break;
                }
                return res1;
            }
            if (t.is_value("ЗА", null) && t.next !== null && t.is_newline_before) {
                let rr = t.next.get_referent();
                if ((rr instanceof PersonReferent) || (rr instanceof PersonPropertyReferent) || (rr instanceof InstrumentParticipant)) {
                    if (t !== t0) 
                        break;
                    let res1 = InstrToken._new1505(t, t.next, ILTypes.PERSON, t.next);
                    t = t.next.next;
                    if ((rr instanceof InstrumentParticipant) && t !== null) {
                        if ((((r = t.get_referent()))) !== null) {
                            if ((r instanceof PersonReferent) || (r instanceof PersonPropertyReferent)) {
                                res1.end_token = t;
                                res1.ref = t;
                            }
                        }
                    }
                    return res1;
                }
            }
            for (let ii = 0; ii < InstrToken.m_directives.length; ii++) {
                if (t.is_value(InstrToken.m_directives[ii], null)) {
                    if (t.next !== null && t.next.is_value("СЛЕДУЮЩЕЕ", "НАСТУПНЕ")) {
                        if (t !== t0) 
                            break;
                        let t11 = t.next;
                        let ok = false;
                        if (t11.next !== null && t11.next.is_char_of(":.") && t11.next.is_newline_after) {
                            ok = true;
                            t11 = t11.next;
                        }
                        if (ok) 
                            return InstrToken._new1509(t, t11, ILTypes.DIRECTIVE, InstrToken.m_directives_norm[ii]);
                    }
                    if (t.is_newline_after || ((t.next !== null && t.next.is_char(':') && t.next.is_newline_after))) {
                        if (t !== t0) 
                            break;
                        if (!t.is_newline_before) {
                            if ((InstrToken.m_directives_norm[ii] !== "ПРИКАЗ" && InstrToken.m_directives_norm[ii] !== "ПОСТАНОВЛЕНИЕ" && InstrToken.m_directives_norm[ii] !== "НАКАЗ") && InstrToken.m_directives_norm[ii] !== "ПОСТАНОВУ") 
                                break;
                        }
                        return InstrToken._new1509(t, (t.is_newline_after ? t : t.next), ILTypes.DIRECTIVE, InstrToken.m_directives_norm[ii]);
                    }
                    break;
                }
            }
            if (t.is_newline_before && t.chars.is_letter && t.length_char === 1) {
                for (const d of InstrToken.m_directives) {
                    let t11 = MiscHelper.try_attach_word_by_letters(d, t, true);
                    if (t11 !== null) {
                        if (t11.next !== null && t11.next.is_char(':')) 
                            t11 = t11.next;
                        return InstrToken._new1506(t, t11, ILTypes.DIRECTIVE);
                    }
                }
            }
            let tte = ((t instanceof MetaToken) ? (t).begin_token : t);
            let term = (tte instanceof TextToken ? (tte).term : null);
            if (is_start_of_line && !tte.chars.is_all_lower && t === t0) {
                let npt = NounPhraseHelper.try_parse(tte, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null && ((term === "ПРИЛОЖЕНИЯ" || term === "ДОДАТКИ"))) 
                    // if (tte.Next != null && tte.Next.IsChar(':'))
                    npt = null;
                if (npt !== null && npt.morph._case.is_nominative && (npt.end_token instanceof TextToken)) {
                    let term1 = (npt.end_token).term;
                    if (((term1 === "ПРИЛОЖЕНИЕ" || term1 === "ДОДАТОК" || term1 === "МНЕНИЕ") || term1 === "ДУМКА" || term1 === "АКТ") || term1 === "ФОРМА" || term === "ЗАЯВКА") {
                        let tt1 = npt.end_token.next;
                        let dt1 = DecreeToken.try_attach(tt1, null, false);
                        if (dt1 !== null && dt1.typ === DecreeTokenItemType.NUMBER) 
                            tt1 = dt1.end_token.next;
                        else if (tt1 instanceof NumberToken) 
                            tt1 = tt1.next;
                        else if ((tt1 instanceof TextToken) && tt1.length_char === 1 && tt1.chars.is_letter) 
                            tt1 = tt1.next;
                        let ok = true;
                        if (tt1 === null) 
                            ok = false;
                        else if (tt1.is_value("В", "У")) 
                            ok = false;
                        else if (tt1.is_value("К", null) && tt1.is_newline_before) 
                            return InstrToken._new1509(t, t, ILTypes.APPENDIX, term1);
                        else if (!tt1.is_newline_before && InstrToken._check_entered(tt1) !== null) 
                            ok = false;
                        else if (tt1 === t.next && ((tt1.is_char(':') || ((tt1.is_value("НА", null) && term1 !== "ЗАЯВКА"))))) 
                            ok = false;
                        if (ok) {
                            let br = BracketHelper.try_parse(tt1, BracketParseAttr.NO, 100);
                            if (br !== null) {
                                tt1 = br.end_token.next;
                                if (br.end_token.next === null || !br.end_token.is_newline_after || br.end_token.next.is_char_of(";,")) 
                                    ok = false;
                                if (tt1 !== null && tt1.is_value("ПРИЛОЖЕНИЕ", "ДОДАТОК")) 
                                    ok = false;
                            }
                        }
                        if (prev !== null && prev.typ === ILTypes.APPENDIX) 
                            ok = false;
                        if (ok) {
                            let cou = 0;
                            for (let ttt = tte.previous; ttt !== null && (cou < 300); ttt = ttt.previous,cou++) {
                                if (ttt.is_table_control_char) {
                                    if (!ttt.is_char(String.fromCharCode(0x1F))) {
                                        if (ttt === tte.previous && ttt.is_char(String.fromCharCode(0x1E))) {
                                        }
                                        else 
                                            ok = false;
                                    }
                                    break;
                                }
                            }
                        }
                        if (ok) {
                            let it1 = InstrToken1.parse(t, true, null, 0, null, false, 0, false, false);
                            if (it1 !== null) {
                                if (it1.has_verb) 
                                    ok = false;
                            }
                        }
                        if (ok && t.previous !== null) {
                            for (let ttp = t.previous; ttp !== null; ttp = ttp.previous) {
                                if (ttp.is_table_control_char && !ttp.is_char(String.fromCharCode(0x1F))) 
                                    continue;
                                if (BracketHelper.is_bracket(ttp, false) && !BracketHelper.can_be_end_of_sequence(ttp, false, null, false)) 
                                    continue;
                                if (ttp.is_char_of(";:")) 
                                    ok = false;
                                break;
                            }
                        }
                        if ((ok && t.previous !== null && (t.newlines_before_count < 3)) && !t.is_newline_after) {
                            let lines = 0;
                            for (let ttp = t.previous; ttp !== null; ttp = ttp.previous) {
                                if (!ttp.is_newline_before) 
                                    continue;
                                for (; ttp !== null && (ttp.end_char < t.begin_char); ttp = ttp.next) {
                                    if (ttp instanceof NumberToken) {
                                    }
                                    else if ((ttp instanceof TextToken) && ttp.length_char > 1) {
                                        if (ttp.is_value("ПРИЛОЖЕНИЕ", "ДОДАТОК")) 
                                            ok = false;
                                        break;
                                    }
                                    else 
                                        break;
                                }
                                if ((++lines) > 1) 
                                    break;
                            }
                        }
                        if (ok && ((term1 !== "ПРИЛОЖЕНИЕ" && term1 !== "ДОДАТОК" && term1 !== "МНЕНИЕ"))) {
                            if (t.newlines_before_count < 3) 
                                ok = false;
                        }
                        if (ok) 
                            return InstrToken._new1509(t, t, ILTypes.APPENDIX, term1);
                    }
                }
            }
            let app = false;
            if ((((term === "ОСОБОЕ" || term === "ОСОБЛИВЕ")) && t.next !== null && t.next.is_value("МНЕНИЕ", "ДУМКА")) && t === t0 && is_start_of_line) 
                app = true;
            if ((((term === "ДОПОЛНИТЕЛЬНОЕ" || term === "ДОДАТКОВА")) && t.next !== null && t.next.is_value("СОГЛАШЕНИЕ", "УГОДА")) && t === t0 && is_start_of_line) 
                app = true;
            if (app) {
                for (let tt = t.next; tt !== null; tt = tt.next) {
                    if (tt.is_newline_before) 
                        break;
                    else if (MorphClass.ooEq(tt.get_morph_class_in_dictionary(), MorphClass.VERB)) {
                        app = false;
                        break;
                    }
                }
                if (app) 
                    return InstrToken._new1506(t, t.next, ILTypes.APPENDIX);
            }
            if (!t.chars.is_all_lower && t === t0) {
                let tt = InstrToken._check_approved(t);
                if (tt !== null) {
                    if (tt.next !== null && (tt.next.get_referent() instanceof DecreeReferent)) 
                        return InstrToken._new1505(t, tt, ILTypes.APPROVED, tt.next.get_referent());
                    let dt1 = DecreeToken.try_attach(tt.next, null, false);
                    if (dt1 !== null && dt1.typ === DecreeTokenItemType.TYP) 
                        return InstrToken._new1506(t, tt, ILTypes.APPROVED);
                }
            }
            t1 = t;
            is_start_of_line = false;
        }
        if (t1 === null) 
            return null;
        let res = InstrToken._new1506(t00, t1, ILTypes.UNDEFINED);
        res.no_words = true;
        for (t = t0; t !== null && t.end_char <= t1.end_char; t = t.next) {
            if (!((t instanceof TextToken))) {
                if (t instanceof ReferentToken) 
                    res.no_words = false;
                continue;
            }
            if (!t.chars.is_letter) 
                continue;
            res.no_words = false;
            if ((t).is_pure_verb) 
                res.has_verb = true;
        }
        if (t0.is_value("ВОПРОС", "ПИТАННЯ") && t0.next !== null && t0.next.is_char_of(":.")) 
            res.typ = ILTypes.QUESTION;
        return res;
    }
    
    static _check_approved(t) {
        if (t === null) 
            return null;
        if (((!t.is_value("УТВЕРЖДЕН", "ЗАТВЕРДЖЕНИЙ") && !t.is_value("УТВЕРЖДАТЬ", "СТВЕРДЖУВАТИ") && !t.is_value("УТВЕРДИТЬ", "ЗАТВЕРДИТИ")) && !t.is_value("ВВЕСТИ", null) && !t.is_value("СОГЛАСОВАНО", "ПОГОДЖЕНО")) && !t.is_value("СОГЛАСОВАТЬ", "ПОГОДИТИ")) 
            return null;
        if (t.morph.contains_attr("инф.", null) && t.morph.contains_attr("сов.в.", null)) 
            return null;
        if (t.morph.contains_attr("возвр.", null)) 
            return null;
        let t0 = t;
        let t1 = t;
        for (t = t.next; t !== null; t = t.next) {
            if (t.morph.class0.is_preposition || t.morph.class0.is_conjunction) 
                continue;
            if (t.is_char(':')) 
                continue;
            if (t.is_value("ДЕЙСТВИЕ", "ДІЯ") || t.is_value("ВВЕСТИ", null) || t.is_value("ВВОДИТЬ", "ВВОДИТИ")) {
                t1 = t;
                continue;
            }
            let tt = InstrToken._check_approved(t);
            if (tt !== null) {
                if (!tt.is_newline_before && tt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false) !== t0.get_normal_case_text(null, false, MorphGender.UNDEFINED, false)) {
                    t1 = (tt = t);
                    continue;
                }
            }
            break;
        }
        return t1;
    }
    
    static _check_entered(t) {
        if (t === null) 
            return null;
        if ((((t.is_value("ВСТУПАТЬ", "ВСТУПАТИ") || t.is_value("ВСТУПИТЬ", "ВСТУПИТИ"))) && t.next !== null && t.next.is_value("В", "У")) && t.next.next !== null && t.next.next.is_value("СИЛА", "ЧИННІСТЬ")) 
            return t.next.next;
        if (t.is_value("УТРАТИТЬ", "ВТРАТИТИ") && t.next !== null && t.next.is_value("СИЛА", "ЧИННІСТЬ")) 
            return t.next;
        if (t.is_value("ДЕЙСТВОВАТЬ", "ДІЯТИ") && t.next !== null && t.next.is_value("ДО", null)) 
            return t.next;
        if (((t.is_value("В", null) || t.is_value("B", null))) && t.next !== null) {
            if (t.next.is_value("РЕДАКЦИЯ", "РЕДАКЦІЯ")) 
                return t.next;
            if (t.next.is_value("РЕД", null)) {
                if (t.next.next !== null && t.next.next.is_char('.')) 
                    return t.next.next;
                return t.next;
            }
        }
        if (t.is_value("РЕДАКЦИЯ", "РЕДАКЦІЯ")) 
            return t.next;
        if (t.is_value("РЕД", null)) {
            if (t.next !== null && t.next.is_char('.')) 
                return t.next;
            return t;
        }
        return InstrToken._check_approved(t);
    }
    
    static _new1505(_arg1, _arg2, _arg3, _arg4) {
        let res = new InstrToken(_arg1, _arg2);
        res.typ = _arg3;
        res.ref = _arg4;
        return res;
    }
    
    static _new1506(_arg1, _arg2, _arg3) {
        let res = new InstrToken(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
    
    static _new1509(_arg1, _arg2, _arg3, _arg4) {
        let res = new InstrToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        return res;
    }
    
    static _new1511(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new InstrToken(_arg1, _arg2);
        res.typ = _arg3;
        res.ref = _arg4;
        res.value = _arg5;
        return res;
    }
    
    static static_constructor() {
        InstrToken.m_ontology = null;
        InstrToken.m_directives = Array.from(["ПРИКАЗЫВАТЬ", "ПРИКАЗАТЬ", "ОПРЕДЕЛЯТЬ", "ОПРЕДЕЛИТЬ", "ПОСТАНОВЛЯТЬ", "ПОСТАНОВИТЬ", "УСТАНОВИТЬ", "РЕШИЛ", "РЕШИТЬ", "ПРОСИТЬ", "ПРИГОВАРИВАТЬ", "ПРИГОВОРИТЬ", "НАКАЗУВАТИ", "ВИЗНАЧАТИ", "ВИЗНАЧИТИ", "УХВАЛЮВАТИ", "ПОСТАНОВЛЯТИ", "ПОСТАНОВИТИ", "ВСТАНОВИТИ", "ВИРІШИВ", "ВИРІШИТИ", "ПРОСИТИ", "ПРИМОВЛЯТИ", "ЗАСУДИТИ"]);
        InstrToken.m_directives_norm = Array.from(["ПРИКАЗ", "ПРИКАЗ", "ОПРЕДЕЛЕНИЕ", "ОПРЕДЕЛЕНИЕ", "ПОСТАНОВЛЕНИЕ", "ПОСТАНОВЛЕНИЕ", "УСТАНОВЛЕНИЕ", "РЕШЕНИЕ", "РЕШЕНИЕ", "ЗАЯВЛЕНИЕ", "ПРИГОВОР", "ПРИГОВОР", "НАКАЗ", "УХВАЛА", "УХВАЛА", "ПОСТАНОВА", "ПОСТАНОВА", "ПОСТАНОВА", "ВСТАНОВЛЕННЯ", "РІШЕННЯ", "РІШЕННЯ", "ЗАЯВА", "ВИРОК", "ВИРОК"]);
    }
}


InstrToken.static_constructor();

module.exports = InstrToken
/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const GetTextAttr = require("./../../core/GetTextAttr");
const MetaToken = require("./../../MetaToken");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const PartTokenItemType = require("./../../decree/internal/PartTokenItemType");
const DecreeTokenItemType = require("./../../decree/internal/DecreeTokenItemType");
const DecreeKind = require("./../../decree/DecreeKind");
const NumberHelper = require("./../../core/NumberHelper");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const MiscHelper = require("./../../core/MiscHelper");
const Token = require("./../../Token");
const OrganizationReferent = require("./../../org/OrganizationReferent");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const ParticipantTokenKinds = require("./ParticipantTokenKinds");
const NumberSpellingType = require("./../../NumberSpellingType");
const MorphBaseInfo = require("./../../../morph/MorphBaseInfo");
const InstrumentKind = require("./../InstrumentKind");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const BracketHelper = require("./../../core/BracketHelper");
const PersonReferent = require("./../../person/PersonReferent");
const TextToken = require("./../../TextToken");
const InstrToken1StdTitleType = require("./InstrToken1StdTitleType");
const NumberTypes = require("./NumberTypes");
const InstrToken1Types = require("./InstrToken1Types");
const TableHelper = require("./../../core/internal/TableHelper");
const PartToken = require("./../../decree/internal/PartToken");
const DecreeChangeReferent = require("./../../decree/DecreeChangeReferent");
const DecreeReferent = require("./../../decree/DecreeReferent");
const NumberToken = require("./../../NumberToken");
const NumberingHelper = require("./NumberingHelper");
const MorphNumber = require("./../../../morph/MorphNumber");
const InstrumentParticipant = require("./../InstrumentParticipant");
const DecreePartReferent = require("./../../decree/DecreePartReferent");
const ReferentToken = require("./../../ReferentToken");
const DecreeToken = require("./../../decree/internal/DecreeToken");
const InstrToken = require("./InstrToken");
const ParticipantToken = require("./ParticipantToken");

class InstrToken1 extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.iref = null;
        this.is_expired = false;
        this.numbers = new Array();
        this.min_number = null;
        this.num_typ = NumberTypes.UNDEFINED;
        this.num_suffix = null;
        this.num_begin_token = null;
        this.num_end_token = null;
        this.is_num_doubt = false;
        this.typ = InstrToken1Types.LINE;
        this.sign_values = new Array();
        this.value = null;
        this.all_upper = false;
        this.has_verb = false;
        this.has_many_spec_chars = false;
        this.title_typ = InstrToken1StdTitleType.UNDEFINED;
        this.index_no_keyword = false;
    }
    
    get last_number() {
        if (this.numbers.length < 1) 
            return 0;
        return PartToken.get_number(this.numbers[this.numbers.length - 1]);
    }
    
    get first_number() {
        if (this.numbers.length < 1) 
            return 0;
        return PartToken.get_number(this.numbers[0]);
    }
    
    get middle_number() {
        if (this.numbers.length < 2) 
            return 0;
        return PartToken.get_number(this.numbers[1]);
    }
    
    get last_min_number() {
        if (this.min_number === null) 
            return 0;
        return PartToken.get_number(this.min_number);
    }
    
    get has_changes() {
        for (let t = (this.num_end_token != null ? this.num_end_token : this.begin_token); t !== null; t = t.next) {
            if (t.get_referent() instanceof DecreeChangeReferent) 
                return true;
            if (t.end_char > this.end_char) 
                break;
        }
        return false;
    }
    
    toString() {
        let res = new StringBuilder();
        res.append(String(this.typ)).append(" ").append(String(this.num_typ)).append(" ");
        if (this.is_num_doubt) 
            res.append("(?) ");
        if (this.is_expired) 
            res.append("(Expired) ");
        if (this.has_changes) 
            res.append("(HasChanges) ");
        for (let i = 0; i < this.numbers.length; i++) {
            res.append((i > 0 ? "." : "")).append(this.numbers[i]);
        }
        if (this.num_suffix !== null) 
            res.append(" Suf='").append(this.num_suffix).append("'");
        if (this.value !== null) 
            res.append(" '").append(this.value).append("'");
        for (const s of this.sign_values) {
            res.append(" [").append(s.toString()).append("]");
        }
        if (this.all_upper) 
            res.append(" AllUpper");
        if (this.has_verb) 
            res.append(" HasVerb");
        if (this.has_many_spec_chars) 
            res.append(" HasManySpecChars");
        if (this.title_typ !== InstrToken1StdTitleType.UNDEFINED) 
            res.append(" ").append(String(this.title_typ));
        if (this.value === null) 
            res.append(": ").append(this.get_source_text());
        return res.toString();
    }
    
    static parse(t, ignore_directives, cur = null, lev = 0, prev = null, is_citat = false, max_char = 0, can_be_table_cell = false, is_in_index = false) {
        const FragToken = require("./FragToken");
        if (t === null) 
            return null;
        if (t.is_char('(')) {
            let edt = null;
            let fr = FragToken._create_editions(t);
            if (fr !== null) 
                edt = InstrToken1._new1530(fr.begin_token, fr.end_token, InstrToken1Types.EDITIONS);
            else {
                let t2 = InstrToken1._create_edition(t);
                if (t2 !== null) 
                    edt = InstrToken1._new1530(t, t2, InstrToken1Types.EDITIONS);
            }
            if (edt !== null) {
                if (edt.end_token.next !== null && edt.end_token.next.is_char('.')) 
                    edt.end_token = edt.end_token.next;
                return edt;
            }
        }
        let t0 = t;
        let t00 = null;
        let res = InstrToken1._new1532(t0, t, true);
        for (; t !== null; t = (t === null ? null : t.next)) {
            if (!t.is_table_control_char) 
                break;
            else {
                if (t.is_char(String.fromCharCode(0x1E))) {
                    let is_table = false;
                    let rows = TableHelper.try_parse_rows(t, 0, true);
                    if (rows !== null && rows.length > 0) {
                        is_table = true;
                        if (rows[0].cells.length > 2 || rows[0].cells.length === 0) {
                        }
                        else if (lev >= 10) 
                            is_table = false;
                        else {
                            let it11 = InstrToken1.parse(rows[0].begin_token, true, null, 10, null, false, max_char, can_be_table_cell, false);
                            if (can_be_table_cell) {
                                if (it11 !== null) 
                                    return it11;
                            }
                            if (it11 !== null && it11.numbers.length > 0) {
                                if (it11.typ_container_rank > 0 || it11.last_number === 1 || it11.title_typ !== InstrToken1StdTitleType.UNDEFINED) 
                                    is_table = false;
                            }
                        }
                    }
                    if (is_table) {
                        let le = 1;
                        for (t = t.next; t !== null; t = t.next) {
                            if (t.is_char(String.fromCharCode(0x1E))) 
                                le++;
                            else if (t.is_char(String.fromCharCode(0x1F))) {
                                if ((--le) === 0) {
                                    res.end_token = t;
                                    res.has_verb = true;
                                    res.all_upper = false;
                                    return res;
                                }
                            }
                        }
                    }
                }
                if (t !== null) 
                    res.end_token = t;
            }
        }
        if (t === null) {
            if (t0 instanceof TextToken) 
                return null;
            t = res.end_token;
        }
        let dt = DecreeToken.try_attach(t, null, false);
        if (dt === null && (((t.get_referent() instanceof PersonReferent) || (t.get_referent() instanceof InstrumentParticipant)))) {
            dt = DecreeToken._new840(t, t, DecreeTokenItemType.OWNER);
            dt.ref = Utils.as(t, ReferentToken);
        }
        if (dt !== null && dt.end_token.is_newline_after) {
            if (dt.typ === DecreeTokenItemType.DATE || dt.typ === DecreeTokenItemType.NUMBER || dt.typ === DecreeTokenItemType.OWNER) {
                res.typ = InstrToken1Types.SIGNS;
                res.sign_values.push(dt);
                res.end_token = dt.end_token;
                res.all_upper = false;
                return res;
            }
        }
        if (t.is_value("ПРИЛОЖЕНИЕ", "ДОДАТОК") && t.morph._case.is_nominative && t.morph.number === MorphNumber.SINGULAR) {
            if (t.next !== null && ((t.next.is_value("В", null) || t.next.is_char(':')))) {
            }
            else {
                res.typ = InstrToken1Types.APPENDIX;
                if (t.get_referent() instanceof DecreePartReferent) 
                    t = t.kit.debed_token(t);
                for (t = t.next; t !== null; t = t.next) {
                    if (res.num_end_token === null) {
                        let ttt = Utils.notNull(MiscHelper.check_number_prefix(t), t);
                        NumberingHelper.parse_number(ttt, res, prev);
                        if (res.num_end_token !== null) {
                            res.end_token = (t = res.num_end_token);
                            continue;
                        }
                    }
                    dt = DecreeToken.try_attach(t, null, false);
                    if (dt !== null) {
                        if (dt.typ === DecreeTokenItemType.NUMBER) {
                            res.num_begin_token = dt.begin_token;
                            res.num_end_token = dt.end_token;
                            if (dt.value !== null) 
                                res.numbers.push(dt.value.toUpperCase());
                        }
                        t = res.end_token = dt.end_token;
                        continue;
                    }
                    if ((t instanceof NumberToken) && ((t.is_newline_after || ((t.next !== null && t.next.is_char('.') && t.next.is_newline_after))))) {
                        res.num_begin_token = t;
                        res.numbers.push((t).value.toString());
                        if (t.next !== null && t.next.is_char('.')) 
                            t = t.next;
                        res.num_end_token = t;
                        res.end_token = t;
                        continue;
                    }
                    if (((t instanceof NumberToken) && (t.next instanceof TextToken) && t.next.length_char === 1) && ((t.next.is_newline_after || ((t.next.next !== null && t.next.next.is_char('.')))))) {
                        res.num_begin_token = t;
                        res.numbers.push((t).value.toString());
                        res.numbers.push((t.next).term);
                        res.num_typ = NumberTypes.COMBO;
                        t = t.next;
                        if (t.next !== null && t.next.is_char('.')) 
                            t = t.next;
                        res.num_end_token = t;
                        res.end_token = t;
                        continue;
                    }
                    if (res.num_end_token === null) {
                        NumberingHelper.parse_number(t, res, prev);
                        if (res.num_end_token !== null) {
                            res.end_token = (t = res.num_end_token);
                            continue;
                        }
                    }
                    if (t.is_value("К", "ДО") && t.next !== null && (t.next.get_referent() instanceof DecreeReferent)) 
                        break;
                    if (t.chars.is_letter) {
                        let lat = NumberHelper.try_parse_roman(t);
                        if (lat !== null && !t.is_value("C", null) && !t.is_value("С", null)) {
                            res.num_begin_token = t;
                            res.numbers.push(lat.value.toString());
                            res.num_typ = NumberTypes.ROMAN;
                            t = lat.end_token;
                            if (t.next !== null && ((t.next.is_char('.') || t.next.is_char(')')))) 
                                t = t.next;
                            res.num_end_token = t;
                            res.end_token = t;
                            continue;
                        }
                        if (t.length_char === 1 && t.chars.is_all_upper) {
                            res.num_begin_token = t;
                            res.numbers.push((t).term);
                            res.num_typ = NumberTypes.LETTER;
                            if (t.next !== null && ((t.next.is_char('.') || t.next.is_char(')')))) 
                                t = t.next;
                            res.num_end_token = t;
                            res.end_token = t;
                            continue;
                        }
                    }
                    if (InstrToken._check_entered(t) !== null) 
                        break;
                    if (t instanceof TextToken) {
                        if ((t).is_pure_verb) {
                            res.typ = InstrToken1Types.LINE;
                            break;
                        }
                    }
                    break;
                }
                if (res.typ !== InstrToken1Types.LINE) 
                    return res;
            }
        }
        if (t.is_newline_before) {
            if (t.is_value("МНЕНИЕ", "ДУМКА") || ((t.is_value("ОСОБОЕ", "ОСОБЛИВА") && t.next !== null && t.next.is_value("МНЕНИЕ", "ДУМКА")))) {
                let t1 = t.next;
                if (t1 !== null && t1.is_value("МНЕНИЕ", "ДУМКА")) 
                    t1 = t1.next;
                let ok = false;
                if (t1 !== null) {
                    if (t1.is_newline_before || (t1.get_referent() instanceof PersonReferent)) 
                        ok = true;
                }
                if (ok) {
                    res.typ = InstrToken1Types.APPENDIX;
                    res.end_token = t1.previous;
                    return res;
                }
            }
            if ((t.get_referent() instanceof DecreeReferent) && (t.get_referent()).kind === DecreeKind.PUBLISHER) 
                res.typ = InstrToken1Types.APPROVED;
        }
        if (t.is_value("КОНСУЛЬТАНТПЛЮС", null) || t.is_value("ГАРАНТ", null) || ((t.is_value("ИНФОРМАЦИЯ", null) && t.is_newline_before))) {
            let t1 = t.next;
            let ok = false;
            if (t.is_value("ИНФОРМАЦИЯ", null)) {
                if (((t.next !== null && t.next.is_value("О", null) && t.next.next !== null) && t.next.next.is_value("ИЗМЕНЕНИЕ", null) && t.next.next.next !== null) && t.next.next.next.is_char(':')) {
                    t1 = t.next.next.next.next;
                    ok = true;
                }
            }
            else if (t1 !== null && t1.is_char(':')) {
                t1 = t1.next;
                ok = true;
            }
            if (t1 !== null && ((t1.is_value("ПРИМЕЧАНИЕ", null) || ok))) {
                if (t1.next !== null && t1.next.is_char('.')) 
                    t1 = t1.next;
                let re = InstrToken1._new1530(t, t1, InstrToken1Types.COMMENT);
                let hiph = false;
                for (t1 = t1.next; t1 !== null; t1 = t1.next) {
                    re.end_token = t1;
                    if (!t1.is_newline_after) 
                        continue;
                    if (t1.next === null) 
                        break;
                    if (t1.next.is_value("СМ", null) || t1.next.is_value("ПУНКТ", null)) 
                        continue;
                    if (!t1.next.is_hiphen) 
                        hiph = false;
                    else if (t1.next.is_hiphen) {
                        if (t1.is_char(':')) 
                            hiph = true;
                        if (hiph) 
                            continue;
                    }
                    break;
                }
                return re;
            }
        }
        let check_comment = 0;
        for (let ttt = t; ttt !== null; ttt = ttt.next) {
            if (((ttt.is_newline_before || ttt.is_table_control_char)) && ttt !== t) 
                break;
            if (ttt.morph.class0.is_preposition) 
                continue;
            let npt = NounPhraseHelper.try_parse(ttt, NounPhraseParseAttr.NO, 0, null);
            if (npt === null) 
                break;
            if (npt.noun.is_value("ПРИМЕНЕНИЕ", "ЗАСТОСУВАННЯ") || npt.noun.is_value("ВОПРОС", "ПИТАННЯ")) {
                check_comment++;
                ttt = npt.end_token;
            }
            else 
                break;
        }
        if (check_comment > 0 || t.is_value("О", "ПРО")) {
            let t1 = null;
            let ok = false;
            let dref = null;
            for (let ttt = t.next; ttt !== null; ttt = ttt.next) {
                t1 = ttt;
                if (t1.is_value("СМ", null) && t1.next !== null && t1.next.is_char('.')) {
                    if (check_comment > 0) 
                        ok = true;
                    if ((t1.next.next instanceof ReferentToken) && (((t1.next.next.get_referent() instanceof DecreeReferent) || (t1.next.next.get_referent() instanceof DecreePartReferent)))) {
                        ok = true;
                        dref = Utils.as(t1.next.next.get_referent(), DecreeReferent);
                    }
                }
                if (ttt.is_newline_after) 
                    break;
            }
            if (ok) {
                let cmt = InstrToken1._new1530(t, t1, InstrToken1Types.COMMENT);
                if (dref !== null && t1.next !== null && t1.next.get_referent() === dref) {
                    if (t1.next.next !== null && t1.next.next.is_value("УТРАТИТЬ", "ВТРАТИТИ")) {
                        for (let ttt = t1.next.next; ttt !== null; ttt = ttt.next) {
                            if (ttt.is_newline_before) 
                                break;
                            cmt.end_token = ttt;
                        }
                    }
                }
                return cmt;
            }
        }
        let tt = InstrToken._check_approved(t);
        if (tt !== null) {
            res.end_token = tt;
            if (tt.next !== null && (tt.next.get_referent() instanceof DecreeReferent)) {
                res.typ = InstrToken1Types.APPROVED;
                res.end_token = tt.next;
                return res;
            }
            let tt1 = tt;
            if (tt1.is_char(':') && tt1.next !== null) 
                tt1 = tt1.next;
            if ((tt1.get_referent() instanceof PersonReferent) || (tt1.get_referent() instanceof InstrumentParticipant)) {
                res.typ = InstrToken1Types.APPROVED;
                res.end_token = tt1;
                return res;
            }
            let dt1 = DecreeToken.try_attach(tt.next, null, false);
            if (dt1 !== null && dt1.typ === DecreeTokenItemType.TYP) {
                res.typ = InstrToken1Types.APPROVED;
                let err = 0;
                for (let ttt = dt1.end_token.next; ttt !== null; ttt = ttt.next) {
                    if (DecreeToken.is_keyword(ttt, false) !== null) 
                        break;
                    dt1 = DecreeToken.try_attach(ttt, null, false);
                    if (dt1 !== null) {
                        if (dt1.typ === DecreeTokenItemType.TYP || dt1.typ === DecreeTokenItemType.NAME) 
                            break;
                        res.end_token = (ttt = dt1.end_token);
                        continue;
                    }
                    if (ttt.morph.class0.is_preposition || ttt.morph.class0.is_conjunction) 
                        continue;
                    if (ttt.whitespaces_before_count > 15) 
                        break;
                    if ((++err) > 10) 
                        break;
                }
                return res;
            }
        }
        let val = null;
        let wrapval1541 = new RefOutArgWrapper();
        let tt2 = InstrToken1._check_directive(t, wrapval1541);
        val = wrapval1541.value;
        if (tt2 !== null) {
            if (tt2.is_newline_after || ((tt2.next !== null && ((tt2.next.is_char_of(":") || ((tt2.next.is_char('.') && tt2 !== t)))) && ((tt2.next.is_newline_after || t.chars.is_all_upper))))) 
                return InstrToken1._new1536(t, (tt2.is_newline_after ? tt2 : tt2.next), InstrToken1Types.DIRECTIVE, val);
        }
        if ((lev < 3) && t !== null) {
            if ((t.is_value("СОДЕРЖИМОЕ", "ВМІСТ") || t.is_value("СОДЕРЖАНИЕ", "ЗМІСТ") || t.is_value("ОГЛАВЛЕНИЕ", "ЗМІСТ")) || ((t.is_value("СПИСОК", null) && t.next !== null && t.next.is_value("РАЗДЕЛ", null)))) {
                let t11 = t.next;
                if (t.is_value("СПИСОК", null)) 
                    t11 = t11.next;
                if (t11 !== null && !t11.is_newline_after) {
                    let npt = NounPhraseHelper.try_parse(t11, NounPhraseParseAttr.NO, 0, null);
                    if (npt !== null && npt.morph._case.is_genitive) 
                        t11 = npt.end_token.next;
                }
                if (t11 !== null && t11.is_char_of(":.;")) 
                    t11 = t11.next;
                if (t11 !== null && t11.is_newline_before) {
                    let first = InstrToken1.parse(t11, ignore_directives, null, lev + 1, null, false, 0, false, true);
                    if (first !== null && (first.length_char < 4)) 
                        first = InstrToken1.parse(first.end_token.next, ignore_directives, null, lev + 1, null, false, 0, false, false);
                    let fstr = MiscHelper.get_text_value_of_meta_token(first, GetTextAttr.NO);
                    if (first !== null) {
                        let cou = 0;
                        let itprev = null;
                        let has_app = false;
                        for (tt = first.end_token.next; tt !== null; tt = tt.next) {
                            if (tt.is_value("ПРИЛОЖЕНИЕ", null)) {
                            }
                            if (tt.is_newline_before) {
                                if ((++cou) > 400) 
                                    break;
                            }
                            let it = InstrToken1.parse(tt, ignore_directives, null, lev + 1, null, false, 0, false, true);
                            if (it === null) 
                                break;
                            let ok = false;
                            if (first.numbers.length === 1 && it.numbers.length === 1) {
                                if (it.typ === InstrToken1Types.APPENDIX && first.typ !== InstrToken1Types.APPENDIX) {
                                }
                                else if (first.numbers[0] === it.numbers[0]) 
                                    ok = true;
                            }
                            else if (first.value !== null && it.value !== null && first.value.startsWith(it.value)) 
                                ok = true;
                            else {
                                let str = MiscHelper.get_text_value_of_meta_token(it, GetTextAttr.NO);
                                if (str === fstr) 
                                    ok = true;
                            }
                            if ((ok && first.typ !== InstrToken1Types.APPENDIX && itprev !== null) && itprev.typ === InstrToken1Types.APPENDIX) {
                                let it2 = InstrToken1.parse(it.end_token.next, ignore_directives, null, lev + 1, null, false, 0, false, true);
                                if (it2 !== null && it2.typ === InstrToken1Types.APPENDIX) 
                                    ok = false;
                            }
                            if (!ok && cou > 4 && first.numbers.length > 0) {
                                if (it.numbers.length === 1 && it.numbers[0] === "1") {
                                    if (it.title_typ === InstrToken1StdTitleType.OTHERS) 
                                        ok = true;
                                }
                            }
                            if (ok) {
                                if (t.previous === null) 
                                    return null;
                                res.end_token = tt.previous;
                                res.typ = InstrToken1Types.INDEX;
                                return res;
                            }
                            if (it.typ === InstrToken1Types.APPENDIX) 
                                has_app = true;
                            tt = it.end_token;
                            itprev = it;
                        }
                        cou = 0;
                        for (tt = first.begin_token; tt !== null && tt.end_char <= first.end_char; tt = tt.next) {
                            if (tt.is_table_control_char) 
                                cou++;
                        }
                        if (cou > 5) {
                            res.end_token = first.end_token;
                            res.typ = InstrToken1Types.INDEX;
                            return res;
                        }
                    }
                }
            }
        }
        let pts = (t === null ? null : PartToken.try_attach_list((t.is_value("ПОЛОЖЕНИЕ", "ПОЛОЖЕННЯ") ? t.next : t), false, 40));
        if ((pts !== null && pts.length > 0 && pts[0].typ !== PartTokenItemType.PREFIX) && pts[0].values.length > 0 && !pts[0].is_newline_after) {
            let ok = false;
            tt = pts[pts.length - 1].end_token.next;
            if (tt !== null && tt.is_char_of(".)]")) {
            }
            else 
                for (; tt !== null; tt = tt.next) {
                    if (tt.is_value("ПРИМЕНЯТЬСЯ", "ЗАСТОСОВУВАТИСЯ")) 
                        ok = true;
                    if ((tt.is_value("ВСТУПАТЬ", "ВСТУПАТИ") && tt.next !== null && tt.next.next !== null) && tt.next.next.is_value("СИЛА", "ЧИННІСТЬ")) 
                        ok = true;
                    if (tt.is_newline_after) {
                        if (ok) 
                            return InstrToken1._new1530(t, tt, InstrToken1Types.COMMENT);
                        break;
                    }
                }
        }
        if (t !== null && (((t.is_newline_before || is_in_index || is_citat) || ((t.previous !== null && t.previous.is_table_control_char)))) && !t.is_table_control_char) {
            let ok = true;
            if (t.next !== null && t.chars.is_all_lower) {
                if (!t.morph._case.is_nominative) 
                    ok = false;
                else if (t.next !== null && t.next.is_char_of(",:;.")) 
                    ok = false;
                else {
                    let npt = NounPhraseHelper.try_parse(t.previous, NounPhraseParseAttr.NO, 0, null);
                    if (npt !== null && npt.end_token === t) 
                        ok = false;
                }
            }
            if (ok && (t instanceof TextToken)) {
                ok = false;
                let s = (t).term;
                if (s === "ГЛАВА" || s === "ГОЛОВА") {
                    res.typ = InstrToken1Types.CHAPTER;
                    t = t.next;
                    ok = true;
                }
                else if (s === "СТАТЬЯ" || s === "СТАТТЯ") {
                    res.typ = InstrToken1Types.CLAUSE;
                    t = t.next;
                    ok = true;
                }
                else if (s === "РАЗДЕЛ" || s === "РОЗДІЛ") {
                    res.typ = InstrToken1Types.SECTION;
                    t = t.next;
                    ok = true;
                }
                else if (s === "ЧАСТЬ" || s === "ЧАСТИНА") {
                    res.typ = InstrToken1Types.DOCPART;
                    t = t.next;
                    ok = true;
                }
                else if (s === "ПОДРАЗДЕЛ" || s === "ПІДРОЗДІЛ") {
                    res.typ = InstrToken1Types.SUBSECTION;
                    t = t.next;
                    ok = true;
                }
                else if ((s === "ПРИМЕЧАНИЕ" || s === "ПРИМІТКА" || s === "ПРИМЕЧАНИЯ") || s === "ПРИМІТКИ") {
                    res.typ = InstrToken1Types.NOTICE;
                    t = t.next;
                    if (t !== null && t.is_char_of(".:")) 
                        t = t.next;
                    ok = true;
                }
                else if (s === "§" || s === "ПАРАГРАФ") {
                    res.typ = InstrToken1Types.PARAGRAPH;
                    t = t.next;
                    ok = true;
                }
                if (ok) {
                    let ttt = t;
                    if (ttt !== null && (ttt instanceof NumberToken)) 
                        ttt = ttt.next;
                    if (ttt !== null && !ttt.is_newline_before) {
                        if (PartToken.try_attach(ttt, null, false, false) !== null) 
                            res.typ = InstrToken1Types.LINE;
                        else if (InstrToken._check_entered(ttt) !== null) {
                            res.typ = InstrToken1Types.EDITIONS;
                            t00 = res.begin_token;
                        }
                        else if (res.begin_token.chars.is_all_lower) {
                            if (res.begin_token.newlines_before_count > 3) {
                            }
                            else 
                                res.typ = InstrToken1Types.LINE;
                        }
                    }
                }
            }
        }
        let num = res.typ !== InstrToken1Types.EDITIONS;
        let has_letters = false;
        let is_app = cur !== null && ((cur.kind === InstrumentKind.APPENDIX || cur.kind === InstrumentKind.INTERNALDOCUMENT));
        for (; t !== null; t = t.next) {
            if (max_char > 0 && t.begin_char > max_char) 
                break;
            if (t.is_newline_before && t !== res.begin_token) {
                if (res.numbers.length === 2) {
                    if (res.numbers[0] === "3" && res.numbers[1] === "4") {
                    }
                }
                let is_new_line = true;
                if (t.newlines_before_count === 1 && t.previous !== null && t.previous.chars.is_letter) {
                    let npt = NounPhraseHelper.try_parse(t.previous, NounPhraseParseAttr.NO, 0, null);
                    if (npt !== null && npt.end_char > t.begin_char) 
                        is_new_line = false;
                    else if (t.previous.get_morph_class_in_dictionary().is_adjective) {
                        npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
                        if (npt !== null && npt.morph.check_accord(t.previous.morph, false, false)) 
                            is_new_line = false;
                    }
                    if (!is_new_line) {
                        let tes = InstrToken1.parse(t, true, null, 0, null, false, 0, false, false);
                        if (tes !== null && tes.numbers.length > 0) 
                            break;
                    }
                    else if (res.numbers.length > 0) {
                        let tes = InstrToken1.parse(t, true, null, 0, null, false, 0, false, false);
                        if (tes !== null && tes.numbers.length > 0) 
                            break;
                    }
                }
                if (is_new_line && t.chars.is_letter) {
                    if (!MiscHelper.can_be_start_of_sentence(t)) {
                        if (t.previous !== null && t.previous.is_char_of(":;.")) {
                        }
                        else if (t.is_value("НЕТ", null) || t.is_value("НЕ", null) || t.is_value("ОТСУТСТВОВАТЬ", null)) {
                        }
                        else if ((res.numbers.length > 0 && t.previous !== null && t.previous.chars.is_all_upper) && !t.chars.is_all_upper) {
                        }
                        else if (t.previous !== null && ((t.previous.is_value("ИЛИ", null) || t.previous.is_comma_and)) && res.numbers.length > 0) {
                            let vvv = InstrToken1.parse(t, true, null, 0, null, false, 0, false, false);
                            if (vvv !== null && vvv.numbers.length > 0) 
                                is_new_line = true;
                        }
                        else 
                            is_new_line = false;
                    }
                }
                if (is_new_line) 
                    break;
                else {
                }
            }
            if (t.is_table_control_char && t !== res.begin_token) {
                if (can_be_table_cell || t.is_char(String.fromCharCode(0x1E)) || t.is_char(String.fromCharCode(0x1F))) 
                    break;
                if (num && res.numbers.length > 0) 
                    num = false;
                else if (t.previous === res.num_end_token) {
                }
                else if (!t.is_newline_after) 
                    continue;
                else 
                    break;
            }
            if (is_in_index && !t.is_newline_before && !t.chars.is_all_lower) {
                let _typ = PartToken.try_attach(t, null, false, false);
                if (_typ !== null) {
                    if (((_typ.typ === PartTokenItemType.CHAPTER || _typ.typ === PartTokenItemType.CLAUSE || _typ.typ === PartTokenItemType.SECTION) || _typ.typ === PartTokenItemType.SUBSECTION || _typ.typ === PartTokenItemType.PARAGRAPH) || _typ.typ === PartTokenItemType.APPENDIX) {
                        if (_typ.values.length === 1) 
                            break;
                    }
                }
                let dp = Utils.as(t.get_referent(), DecreePartReferent);
                if (dp !== null) {
                    if (((dp.get_slot_value(DecreePartReferent.ATTR_CHAPTER) !== null || dp.get_slot_value(DecreePartReferent.ATTR_CLAUSE) !== null || dp.get_slot_value(DecreePartReferent.ATTR_SECTION) !== null) || dp.get_slot_value(DecreePartReferent.ATTR_SUBSECTION) !== null || dp.get_slot_value(DecreePartReferent.ATTR_PARAGRAPH) !== null) || dp.get_slot_value(DecreePartReferent.ATTR_APPENDIX) !== null) {
                        t = t.kit.debed_token(t);
                        break;
                    }
                }
            }
            if ((t.is_char('[') && t === t0 && (t.next instanceof NumberToken)) && t.next.next !== null && t.next.next.is_char(']')) {
                num = false;
                res.numbers.push((t.next).value.toString());
                res.num_typ = NumberTypes.DIGIT;
                res.num_suffix = "]";
                res.num_begin_token = t;
                res.num_end_token = t.next.next;
                t = res.num_end_token;
                continue;
            }
            if (t.is_char('(')) {
                num = false;
                if (FragToken._create_editions(t) !== null) 
                    break;
                if (InstrToken1._create_edition(t) !== null) 
                    break;
                let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (br !== null) {
                    if (t === res.begin_token) {
                        let lat = NumberHelper.try_parse_roman(t.next);
                        if (lat !== null && lat.end_token.next === br.end_token) {
                            res.numbers.push(lat.value.toString());
                            res.num_suffix = ")";
                            res.num_begin_token = t;
                            res.num_end_token = br.end_token;
                            res.num_typ = (lat.typ === NumberSpellingType.ROMAN ? NumberTypes.ROMAN : NumberTypes.DIGIT);
                        }
                        else if (((t === t0 && t.is_newline_before && br.length_char === 3) && br.end_token === t.next.next && (t.next instanceof TextToken)) && t.next.chars.is_latin_letter) {
                            res.num_begin_token = t;
                            res.num_typ = NumberTypes.LETTER;
                            res.numbers.push((t.next).term);
                            res.end_token = (res.num_end_token = t.next.next);
                        }
                    }
                    t = res.end_token = br.end_token;
                    continue;
                }
            }
            if (num) {
                NumberingHelper.parse_number(t, res, prev);
                num = false;
                if (res.numbers.length > 0) {
                }
                if (res.num_end_token !== null && res.num_end_token.end_char >= t.end_char) {
                    t = res.num_end_token;
                    continue;
                }
            }
            if (res.numbers.length === 0) 
                num = false;
            if ((t instanceof TextToken) && t.chars.is_letter) {
                has_letters = true;
                if (t00 === null) 
                    t00 = t;
                num = false;
                if (t.chars.is_capital_upper && res.length_char > 20) {
                    if (t.is_value("РУКОВОДСТВУЯСЬ", null)) {
                        if (MiscHelper.can_be_start_of_sentence(t) || t.previous.is_comma) 
                            break;
                    }
                    else if (t.is_value("НА", null) && t.next !== null && t.next.is_value("ОСНОВАНИЕ", null)) {
                        let ttt = InstrToken1.parse(t, true, null, 0, null, false, 0, false, false);
                        if (ttt !== null && ttt.toString().toUpperCase().includes("РУКОВОДСТВУЯСЬ")) {
                            if (MiscHelper.can_be_start_of_sentence(t)) 
                                break;
                        }
                    }
                }
                if (!t.chars.is_all_upper) 
                    res.all_upper = false;
                if ((t).is_pure_verb) {
                    if (t.chars.is_cyrillic_letter) {
                        let npt = NounPhraseHelper.try_parse((t.morph.class0.is_preposition ? t.next : t), NounPhraseParseAttr.NO, 0, null);
                        if (npt !== null) {
                        }
                        else 
                            res.has_verb = true;
                    }
                }
            }
            else if (t instanceof ReferentToken) {
                has_letters = true;
                if (t00 === null) 
                    t00 = t;
                num = false;
                if (t.get_referent() instanceof DecreeChangeReferent) {
                    res.has_verb = true;
                    res.all_upper = false;
                }
                if (t.get_referent() instanceof InstrumentParticipant) {
                    if (!t.chars.is_all_upper) 
                        res.all_upper = false;
                }
            }
            if (t !== res.begin_token && InstrToken1._is_first_line(t)) 
                break;
            let tmp = null;
            let wraptmp1538 = new RefOutArgWrapper();
            tt2 = InstrToken1._check_directive(t, wraptmp1538);
            tmp = wraptmp1538.value;
            if (tt2 !== null) {
                if (tt2.next !== null && tt2.next.is_char_of(":.") && tt2.next.is_newline_after) {
                    if (ignore_directives && !t.is_newline_before) 
                        t = tt2;
                    else 
                        break;
                }
            }
            res.end_token = t;
        }
        if (res.typ_container_rank > 0 && t00 !== null) {
            if (t00.chars.is_all_lower) {
                res.typ = InstrToken1Types.LINE;
                res.numbers.splice(0, res.numbers.length);
                res.num_typ = NumberTypes.UNDEFINED;
            }
        }
        if (t00 !== null) {
            let len = res.end_char - t00.begin_char;
            if (len < 1000) {
                res.value = MiscHelper.get_text_value(t00, res.end_token, GetTextAttr.NO);
                if (LanguageHelper.ends_with(res.value, ".")) 
                    res.value = res.value.substring(0, 0 + res.value.length - 1);
            }
        }
        if (!has_letters) 
            res.all_upper = false;
        if (res.num_typ !== NumberTypes.UNDEFINED && res.begin_token === res.num_begin_token && res.end_token === res.num_end_token) {
            let ok = false;
            if (prev !== null) {
                if (NumberingHelper.calc_delta(prev, res, true) === 1) 
                    ok = true;
            }
            if (!ok) {
                let res1 = InstrToken1.parse(res.end_token.next, true, null, 0, null, false, 0, false, false);
                if (res1 !== null) {
                    if (NumberingHelper.calc_delta(res, res1, true) === 1) 
                        ok = true;
                }
            }
            if (!ok) {
                res.num_typ = NumberTypes.UNDEFINED;
                res.numbers.splice(0, res.numbers.length);
            }
        }
        if (res.typ === InstrToken1Types.APPENDIX || res.typ_container_rank > 0) {
            if (res.typ === InstrToken1Types.CLAUSE && res.last_number === 17) {
            }
            tt = ((res.num_end_token != null ? res.num_end_token : res.begin_token)).next;
            if (tt !== null) {
                let ttt = InstrToken._check_entered(tt);
                if (ttt !== null) {
                    if (tt.is_value("УТРАТИТЬ", null) && tt.previous !== null && tt.previous.is_char('.')) {
                        res.value = null;
                        res.end_token = tt.previous;
                        res.is_expired = true;
                    }
                    else {
                        res.typ = InstrToken1Types.EDITIONS;
                        res.numbers.splice(0, res.numbers.length);
                        res.num_typ = NumberTypes.UNDEFINED;
                        res.value = null;
                    }
                }
            }
        }
        if (res.typ === InstrToken1Types.DOCPART) {
        }
        let bad_number = false;
        if ((res.typ_container_rank > 0 && res.num_typ !== NumberTypes.UNDEFINED && res.num_end_token !== null) && !res.num_end_token.is_newline_after && res.num_end_token.next !== null) {
            let t1 = res.num_end_token.next;
            let bad = false;
            if (t1.chars.is_all_lower) 
                bad = true;
            if (bad) 
                bad_number = true;
        }
        if (res.num_typ !== NumberTypes.UNDEFINED && !is_citat) {
            if (res.is_newline_before || is_in_index) {
            }
            else if (res.begin_token.previous !== null && res.begin_token.previous.is_table_control_char) {
            }
            else 
                bad_number = true;
            if (res.num_suffix === "-") 
                bad_number = true;
        }
        if (res.typ === InstrToken1Types.LINE && res.numbers.length > 0 && is_citat) {
            let tt0 = res.begin_token.previous;
            if (BracketHelper.can_be_start_of_sequence(tt0, true, true)) 
                tt0 = tt0.previous;
            if (tt0 !== null) 
                tt0 = tt0.previous;
            for (; tt0 !== null; tt0 = tt0.previous) {
                if (tt0.is_value("ГЛАВА", "ГОЛОВА")) 
                    res.typ = InstrToken1Types.CHAPTER;
                else if (tt0.is_value("СТАТЬЯ", "СТАТТЯ")) 
                    res.typ = InstrToken1Types.CLAUSE;
                else if (tt0.is_value("РАЗДЕЛ", "РОЗДІЛ")) 
                    res.typ = InstrToken1Types.SECTION;
                else if (tt0.is_value("ЧАСТЬ", "ЧАСТИНА")) 
                    res.typ = InstrToken1Types.DOCPART;
                else if (tt0.is_value("ПОДРАЗДЕЛ", "ПІДРОЗДІЛ")) 
                    res.typ = InstrToken1Types.SUBSECTION;
                else if (tt0.is_value("ПАРАГРАФ", null)) 
                    res.typ = InstrToken1Types.PARAGRAPH;
                else if (tt0.is_value("ПРИМЕЧАНИЕ", "ПРИМІТКА")) 
                    res.typ = InstrToken1Types.NOTICE;
                if (tt0.is_newline_before) 
                    break;
            }
        }
        if (bad_number) {
            res.typ = InstrToken1Types.LINE;
            res.num_typ = NumberTypes.UNDEFINED;
            res.value = null;
            res.numbers.splice(0, res.numbers.length);
            res.num_begin_token = (res.num_end_token = null);
        }
        if ((res.typ === InstrToken1Types.SECTION || res.typ === InstrToken1Types.PARAGRAPH || res.typ === InstrToken1Types.CHAPTER) || res.typ === InstrToken1Types.CLAUSE) {
            if (res.numbers.length === 0) 
                res.typ = InstrToken1Types.LINE;
        }
        if (res.end_token.is_char('>') && res.begin_token.is_value("ПУТЕВОДИТЕЛЬ", null)) {
            res.typ = InstrToken1Types.COMMENT;
            for (let ttt = res.end_token.next; ttt !== null; ttt = ttt.next) {
                let li2 = InstrToken1.parse(ttt, true, null, 0, null, false, 0, false, false);
                if (li2 !== null && li2.end_token.is_char('>')) {
                    res.end_token = (ttt = li2.end_token);
                    continue;
                }
                break;
            }
            return res;
        }
        if (res.typ === InstrToken1Types.LINE) {
            if (res.num_typ !== NumberTypes.UNDEFINED) {
                let ttt = res.begin_token.previous;
                if (ttt instanceof TextToken) {
                    if (ttt.is_value("ПУНКТ", null)) {
                        res.num_typ = NumberTypes.UNDEFINED;
                        res.value = null;
                        res.numbers.splice(0, res.numbers.length);
                    }
                }
                for (const nn of res.numbers) {
                    let vv = 0;
                    let wrapvv1539 = new RefOutArgWrapper();
                    let inoutres1540 = Utils.tryParseInt(nn, wrapvv1539);
                    vv = wrapvv1539.value;
                    if (inoutres1540) {
                        if (vv > 1000 && res.num_begin_token === res.begin_token) {
                            res.num_typ = NumberTypes.UNDEFINED;
                            res.value = null;
                            res.numbers.splice(0, res.numbers.length);
                            break;
                        }
                    }
                }
            }
            if (InstrToken1._is_first_line(res.begin_token)) 
                res.typ = InstrToken1Types.FIRSTLINE;
            if (res.num_typ === NumberTypes.DIGIT) {
                if (res.num_suffix === null) 
                    res.is_num_doubt = true;
            }
            if (res.numbers.length === 0) {
                let pt = PartToken.try_attach(res.begin_token, null, false, false);
                if (pt !== null && pt.typ !== PartTokenItemType.PREFIX) {
                    tt = pt.end_token.next;
                    if (tt !== null && ((tt.is_char_of(".") || tt.is_hiphen))) 
                        tt = tt.next;
                    tt = InstrToken._check_entered(tt);
                    if (tt !== null) {
                        res.typ = InstrToken1Types.EDITIONS;
                        res.is_expired = tt.is_value("УТРАТИТЬ", "ВТРАТИТИ");
                    }
                }
                else {
                    tt = InstrToken._check_entered(res.begin_token);
                    if (tt !== null && tt.next !== null && (tt.next.get_referent() instanceof DecreeReferent)) 
                        res.typ = InstrToken1Types.EDITIONS;
                    else if (res.begin_token.is_value("АБЗАЦ", null) && res.begin_token.next !== null && res.begin_token.next.is_value("УТРАТИТЬ", "ВТРАТИТИ")) 
                        res.is_expired = true;
                }
            }
        }
        if (res.typ === InstrToken1Types.LINE && res.num_typ === NumberTypes.ROMAN) {
            let res1 = InstrToken1.parse(res.end_token.next, true, cur, lev + 1, null, false, 0, false, false);
            if (res1 !== null && res1.typ === InstrToken1Types.CLAUSE) 
                res.typ = InstrToken1Types.CHAPTER;
        }
        let specs = 0;
        let _chars = 0;
        if (res.numbers.length === 2 && res.numbers[0] === "2" && res.numbers[1] === "3") {
        }
        for (tt = (res.num_end_token === null ? res.begin_token : res.num_end_token.next); tt !== null; tt = tt.next) {
            if (tt.end_char > res.end_token.end_char) 
                break;
            let tto = Utils.as(tt, TextToken);
            if (tto === null) 
                continue;
            if (!tto.chars.is_letter) {
                if (!tto.is_char_of(",;.():") && !BracketHelper.is_bracket(tto, false)) 
                    specs += tto.length_char;
            }
            else 
                _chars += tto.length_char;
        }
        if ((specs + _chars) > 0) {
            if (((Utils.intDiv(specs * 100, (specs + _chars)))) > 10) 
                res.has_many_spec_chars = true;
        }
        res.title_typ = InstrToken1StdTitleType.UNDEFINED;
        let words = 0;
        for (tt = (res.num_begin_token === null ? res.begin_token : res.num_begin_token.next); tt !== null && tt.end_char <= res.end_char; tt = tt.next) {
            if (!((tt instanceof TextToken)) || tt.is_char('_')) {
                res.title_typ = InstrToken1StdTitleType.UNDEFINED;
                break;
            }
            if (!tt.chars.is_letter || tt.morph.class0.is_conjunction || tt.morph.class0.is_preposition) 
                continue;
            let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) {
                words++;
                let ii = 0;
                for (ii = 0; ii < InstrToken1.m_std_req_words.length; ii++) {
                    if (npt.noun.is_value(InstrToken1.m_std_req_words[ii], null)) 
                        break;
                }
                if (ii < InstrToken1.m_std_req_words.length) {
                    tt = npt.end_token;
                    res.title_typ = InstrToken1StdTitleType.REQUISITES;
                    continue;
                }
                if (npt.noun.is_value("ВВЕДЕНИЕ", "ВВЕДЕННЯ") || npt.noun.is_value("ВСТУПЛЕНИЕ", "ВСТУП")) {
                    words++;
                    tt = npt.end_token;
                    res.title_typ = InstrToken1StdTitleType.OTHERS;
                    continue;
                }
                if (((npt.noun.is_value("ПОЛОЖЕНИЕ", "ПОЛОЖЕННЯ") || npt.noun.is_value("СОКРАЩЕНИЕ", "СКОРОЧЕННЯ") || npt.noun.is_value("ТЕРМИН", "ТЕРМІН")) || npt.noun.is_value("ОПРЕДЕЛЕНИЕ", "ВИЗНАЧЕННЯ") || npt.noun.is_value("АББРЕВИАТУРА", "АБРЕВІАТУРА")) || npt.noun.is_value("ЛИТЕРАТУРА", "ЛІТЕРАТУРА") || npt.noun.is_value("НАЗВАНИЕ", "НАЗВА")) {
                    tt = npt.end_token;
                    res.title_typ = InstrToken1StdTitleType.OTHERS;
                    continue;
                }
                if (npt.noun.is_value("ПАСПОРТ", null)) {
                    tt = npt.end_token;
                    res.title_typ = InstrToken1StdTitleType.OTHERS;
                    let npt2 = NounPhraseHelper.try_parse(npt.end_token.next, NounPhraseParseAttr.NO, 0, null);
                    if (npt2 !== null && npt2.morph._case.is_genitive && (npt2.whitespaces_before_count < 3)) 
                        tt = npt2.end_token;
                    continue;
                }
                if (npt.noun.is_value("ПРЕДМЕТ", null)) {
                    tt = npt.end_token;
                    res.title_typ = InstrToken1StdTitleType.SUBJECT;
                    continue;
                }
                if (npt.end_token instanceof TextToken) {
                    let term = (npt.end_token).term;
                    if (term === "ПРИЛОЖЕНИЯ" || term === "ПРИЛОЖЕНИЙ") {
                        tt = npt.end_token;
                        res.title_typ = InstrToken1StdTitleType.OTHERS;
                        continue;
                    }
                }
                if (((npt.noun.is_value("МОМЕНТ", null) || npt.noun.is_value("ЗАКЛЮЧЕНИЕ", "ВИСНОВОК") || npt.noun.is_value("ДАННЫЕ", null)) || npt.is_value("ДОГОВОР", "ДОГОВІР") || npt.is_value("КОНТРАКТ", null)) || npt.is_value("СПИСОК", null) || npt.is_value("ПЕРЕЧЕНЬ", "ПЕРЕЛІК")) {
                    tt = npt.end_token;
                    continue;
                }
            }
            let pp = ParticipantToken.try_attach(tt, null, null, false);
            if (pp !== null && pp.kind === ParticipantTokenKinds.PURE) {
                tt = pp.end_token;
                continue;
            }
            res.title_typ = InstrToken1StdTitleType.UNDEFINED;
            break;
        }
        if (res.title_typ !== InstrToken1StdTitleType.UNDEFINED && res.numbers.length === 0) {
            t = res.begin_token;
            if (!((t instanceof TextToken)) || !t.chars.is_letter || t.chars.is_all_lower) 
                res.title_typ = InstrToken1StdTitleType.UNDEFINED;
        }
        if ((res.numbers.length === 0 && !res.is_newline_before && res.begin_token.previous !== null) && res.begin_token.previous.is_table_control_char) 
            res.title_typ = InstrToken1StdTitleType.UNDEFINED;
        for (t = res.end_token.next; t !== null; t = t.next) {
            if (!t.is_table_control_char) 
                break;
            else if (t.is_char(String.fromCharCode(0x1E))) 
                break;
            else 
                res.end_token = t;
        }
        return res;
    }
    
    static _is_first_line(t) {
        let tt = Utils.as(t, TextToken);
        if (tt === null) 
            return false;
        let v = tt.term;
        if ((((v === "ИСХОДЯ" || v === "ВИХОДЯЧИ")) && t.next !== null && t.next.is_value("ИЗ", "З")) && t.next.next !== null && t.next.next.is_value("ИЗЛОЖЕННОЕ", "ВИКЛАДЕНЕ")) 
            return true;
        if ((((v === "НА" || v === "HA")) && t.next !== null && t.next.is_value("ОСНОВАНИЕ", "ПІДСТАВА")) && t.next.next !== null && t.next.next.is_value("ИЗЛОЖЕННОЕ", "ВИКЛАДЕНЕ")) 
            return true;
        if (((v === "УЧИТЫВАЯ" || v === "ВРАХОВУЮЧИ")) && t.next !== null && t.next.is_value("ИЗЛОЖЕННОЕ", "ВИКЛАДЕНЕ")) 
            return true;
        if ((v === "ЗАСЛУШАВ" || v === "РАССМОТРЕВ" || v === "ЗАСЛУХАВШИ") || v === "РОЗГЛЯНУВШИ") 
            return true;
        if (v === "РУКОВОДСТВУЯСЬ" || v === "КЕРУЮЧИСЬ") 
            return tt.is_newline_before;
        return false;
    }
    
    static _create_edition(t) {
        if (t === null || t.next === null) 
            return null;
        let ok = false;
        let t1 = t;
        let br = 0;
        if (t.is_char('(') && t.is_newline_before) {
            ok = true;
            br = 1;
            t1 = t.next;
        }
        if (!ok || t1 === null) 
            return null;
        ok = false;
        let dts = PartToken.try_attach_list(t1, true, 40);
        if (dts !== null && dts.length > 0) 
            t1 = dts[dts.length - 1].end_token.next;
        let t2 = InstrToken._check_entered(t1);
        if (t2 === null && t1 !== null) 
            t2 = InstrToken._check_entered(t1.next);
        if (t2 !== null) 
            ok = true;
        if (!ok) 
            return null;
        for (t1 = t2; t1 !== null; t1 = t1.next) {
            if (t1.is_char(')')) {
                if ((--br) === 0) 
                    return t1;
            }
            else if (t1.is_char('(')) 
                br++;
            else if (t1.is_newline_after) 
                break;
        }
        return null;
    }
    
    static _check_directive(t, val) {
        val.value = null;
        if (t === null || t.morph.class0.is_adjective) 
            return null;
        for (let ii = 0; ii < InstrToken.m_directives.length; ii++) {
            if (t.is_value(InstrToken.m_directives[ii], null)) {
                val.value = InstrToken.m_directives_norm[ii];
                if (t.whitespaces_before_count < 7) {
                    if (((((val.value !== "ПРИКАЗ" && val.value !== "ПОСТАНОВЛЕНИЕ" && val.value !== "УСТАНОВЛЕНИЕ") && val.value !== "РЕШЕНИЕ" && val.value !== "ЗАЯВЛЕНИЕ") && val.value !== "НАКАЗ" && val.value !== "ПОСТАНОВА") && val.value !== "ВСТАНОВЛЕННЯ" && val.value !== "РІШЕННЯ") && val.value !== "ЗАЯВУ") {
                        if ((t.next !== null && t.next.is_char(':') && t.next.is_newline_after) && t.chars.is_all_upper) {
                        }
                        else 
                            break;
                    }
                }
                if (t.next !== null && t.next.is_value("СЛЕДУЮЩЕЕ", "НАСТУПНЕ")) 
                    return t.next;
                if (((val.value === "ЗАЯВЛЕНИЕ" || val.value === "ЗАЯВА")) && t.next !== null && (t.next.get_referent() instanceof OrganizationReferent)) 
                    t = t.next;
                return t;
            }
        }
        if (t.chars.is_letter && t.length_char === 1) {
            if (t.is_newline_before || ((t.next !== null && t.next.chars.is_letter && t.next.length_char === 1))) {
                for (let ii = 0; ii < InstrToken.m_directives.length; ii++) {
                    let res = MiscHelper.try_attach_word_by_letters(InstrToken.m_directives[ii], t, true);
                    if (res !== null) {
                        val.value = InstrToken.m_directives_norm[ii];
                        return res;
                    }
                }
            }
        }
        return null;
    }
    
    get typ_container_rank() {
        let res = InstrToken1._calc_rank(this.typ);
        return res;
    }
    
    static _calc_rank(ty) {
        if (ty === InstrToken1Types.DOCPART) 
            return 1;
        if (ty === InstrToken1Types.SECTION) 
            return 2;
        if (ty === InstrToken1Types.SUBSECTION) 
            return 3;
        if (ty === InstrToken1Types.CHAPTER) 
            return 4;
        if (ty === InstrToken1Types.PARAGRAPH) 
            return 5;
        if (ty === InstrToken1Types.SUBPARAGRAPH) 
            return 6;
        if (ty === InstrToken1Types.CLAUSE) 
            return 7;
        return 0;
    }
    
    can_be_container_for(lt) {
        let r = InstrToken1._calc_rank(this.typ);
        let r1 = InstrToken1._calc_rank(lt.typ);
        if (r > 0 && r1 > 0) 
            return r < r1;
        return false;
    }
    
    static _new1530(_arg1, _arg2, _arg3) {
        let res = new InstrToken1(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
    
    static _new1532(_arg1, _arg2, _arg3) {
        let res = new InstrToken1(_arg1, _arg2);
        res.all_upper = _arg3;
        return res;
    }
    
    static _new1536(_arg1, _arg2, _arg3, _arg4) {
        let res = new InstrToken1(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        return res;
    }
    
    static _new1549(_arg1, _arg2, _arg3, _arg4) {
        let res = new InstrToken1(_arg1, _arg2);
        res.index_no_keyword = _arg3;
        res.typ = _arg4;
        return res;
    }
    
    static static_constructor() {
        InstrToken1.m_std_req_words = Array.from(["РЕКВИЗИТ", "ПОДПИСЬ", "СТОРОНА", "АДРЕС", "ТЕЛЕФОН", "МЕСТО", "НАХОЖДЕНИЕ", "МЕСТОНАХОЖДЕНИЕ", "ТЕРМИН", "ОПРЕДЕЛЕНИЕ", "СЧЕТ", "РЕКВІЗИТ", "ПІДПИС", "СТОРОНА", "АДРЕСА", "МІСЦЕ", "ЗНАХОДЖЕННЯ", "МІСЦЕЗНАХОДЖЕННЯ", "ТЕРМІН", "ВИЗНАЧЕННЯ", "РАХУНОК"]);
    }
}


InstrToken1.static_constructor();

module.exports = InstrToken1
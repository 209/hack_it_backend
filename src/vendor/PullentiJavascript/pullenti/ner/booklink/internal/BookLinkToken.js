/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");

const TerminParseAttr = require("./../../core/TerminParseAttr");
const TextToken = require("./../../TextToken");
const NumberSpellingType = require("./../../NumberSpellingType");
const DateReferent = require("./../../date/DateReferent");
const OrganizationKind = require("./../../org/OrganizationKind");
const UriReferent = require("./../../uri/UriReferent");
const MorphLang = require("./../../../morph/MorphLang");
const Termin = require("./../../core/Termin");
const BlkTyps = require("./../../core/internal/BlkTyps");
const BlockLine = require("./../../core/internal/BlockLine");
const BookLinkRefReferent = require("./../BookLinkRefReferent");
const TerminCollection = require("./../../core/TerminCollection");
const MiscHelper = require("./../../core/MiscHelper");
const ReferentToken = require("./../../ReferentToken");
const FioTemplateType = require("./../../person/internal/FioTemplateType");
const GetTextAttr = require("./../../core/GetTextAttr");
const PersonPropertyReferent = require("./../../person/PersonPropertyReferent");
const BookLinkTyp = require("./BookLinkTyp");
const PersonItemToken = require("./../../person/internal/PersonItemToken");
const OrganizationReferent = require("./../../org/OrganizationReferent");
const PersonReferent = require("./../../person/PersonReferent");
const GeoReferent = require("./../../geo/GeoReferent");
const MetaToken = require("./../../MetaToken");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const NumberToken = require("./../../NumberToken");
const BracketHelper = require("./../../core/BracketHelper");

class BookLinkToken extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.typ = BookLinkTyp.UNDEFINED;
        this.value = null;
        this.tok = null;
        this.ref = null;
        this.add_coef = 0;
        this.person_template = FioTemplateType.UNDEFINED;
        this.start_of_name = null;
    }
    
    static try_parse_author(t, prev_pers_template = FioTemplateType.UNDEFINED) {
        if (t === null) 
            return null;
        let rtp = PersonItemToken.try_parse_person(t, prev_pers_template);
        if (rtp !== null) {
            let re = null;
            if (rtp.data === null) 
                re = BookLinkToken._new344(t, (rtp === t ? t : rtp.end_token), BookLinkTyp.PERSON, rtp.referent);
            else 
                re = BookLinkToken._new345(t, rtp.end_token, BookLinkTyp.PERSON, rtp);
            re.person_template = FioTemplateType.of(rtp.misc_attrs);
            for (let tt = rtp.begin_token; tt !== null && tt.end_char <= rtp.end_char; tt = tt.next) {
                if (!((tt.get_referent() instanceof PersonPropertyReferent))) 
                    continue;
                let rt = Utils.as(tt, ReferentToken);
                if (rt.begin_token.chars.is_capital_upper && tt !== rtp.begin_token) {
                    re.start_of_name = MiscHelper.get_text_value_of_meta_token(rt, GetTextAttr.KEEPREGISTER);
                    break;
                }
                return null;
            }
            return re;
        }
        if (t.is_char('[')) {
            let re = BookLinkToken.try_parse_author(t.next, FioTemplateType.UNDEFINED);
            if (re !== null && re.end_token.next !== null && re.end_token.next.is_char(']')) {
                re.begin_token = t;
                re.end_token = re.end_token.next;
                return re;
            }
        }
        if (((t.is_value("И", null) || t.is_value("ET", null))) && t.next !== null) {
            if (t.next.is_value("ДРУГИЕ", null) || t.next.is_value("ДР", null) || t.next.is_value("AL", null)) {
                let res = BookLinkToken._new346(t, t.next, BookLinkTyp.ANDOTHERS);
                if (t.next.next !== null && t.next.next.is_char('.')) 
                    res.end_token = res.end_token.next;
                return res;
            }
        }
        return null;
    }
    
    static try_parse(t, lev = 0) {
        if (t === null || lev > 3) 
            return null;
        let res = BookLinkToken._try_parse(t, lev + 1);
        if (res === null) {
            if (t.is_hiphen) 
                res = BookLinkToken._try_parse(t.next, lev + 1);
            if (res === null) 
                return null;
        }
        if (res.end_token.next !== null && res.end_token.next.is_char('.')) 
            res.end_token = res.end_token.next;
        t = res.end_token.next;
        if (t !== null && t.is_comma) 
            t = t.next;
        if (res.typ === BookLinkTyp.GEO || res.typ === BookLinkTyp.PRESS) {
            let re2 = BookLinkToken._try_parse(t, lev + 1);
            if (re2 !== null && ((re2.typ === BookLinkTyp.PRESS || re2.typ === BookLinkTyp.YEAR))) 
                res.add_coef += (1);
        }
        return res;
    }
    
    static _try_parse(t, lev) {
        if (t === null || lev > 3) 
            return null;
        if (t.is_char('[')) {
            let re = BookLinkToken._try_parse(t.next, lev + 1);
            if (re !== null && re.end_token.next !== null && re.end_token.next.is_char(']')) {
                re.begin_token = t;
                re.end_token = re.end_token.next;
                return re;
            }
            if (re !== null && re.end_token.is_char(']')) {
                re.begin_token = t;
                return re;
            }
            if (re !== null) {
                if (re.typ === BookLinkTyp.SOSTAVITEL || re.typ === BookLinkTyp.EDITORS) 
                    return re;
            }
            let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
            if (br !== null) {
                if ((br.end_token.previous instanceof NumberToken) && (br.length_char < 30)) 
                    return BookLinkToken._new347(t, br.end_token, BookLinkTyp.NUMBER, MiscHelper.get_text_value(br.begin_token.next, br.end_token.previous, GetTextAttr.NO));
            }
        }
        let t0 = t;
        if (t instanceof ReferentToken) {
            if (t.get_referent() instanceof PersonReferent) 
                return BookLinkToken.try_parse_author(t, FioTemplateType.UNDEFINED);
            if (t.get_referent() instanceof GeoReferent) 
                return BookLinkToken._new344(t, t, BookLinkTyp.GEO, t.get_referent());
            if (t.get_referent() instanceof DateReferent) {
                let dr = Utils.as(t.get_referent(), DateReferent);
                if (dr.slots.length === 1 && dr.year > 0) 
                    return BookLinkToken._new347(t, t, BookLinkTyp.YEAR, dr.year.toString());
                if (dr.year > 0 && t.previous !== null && t.previous.is_comma) 
                    return BookLinkToken._new347(t, t, BookLinkTyp.YEAR, dr.year.toString());
            }
            if (t.get_referent() instanceof OrganizationReferent) {
                let org = Utils.as(t.get_referent(), OrganizationReferent);
                if (org.kind === OrganizationKind.PRESS) 
                    return BookLinkToken._new344(t, t, BookLinkTyp.PRESS, org);
            }
            if (t.get_referent() instanceof UriReferent) {
                let uri = Utils.as(t.get_referent(), UriReferent);
                if ((uri.scheme === "http" || uri.scheme === "https" || uri.scheme === "ftp") || uri.scheme === null) 
                    return BookLinkToken._new344(t, t, BookLinkTyp.URL, uri);
            }
        }
        let _tok = BookLinkToken.m_termins.try_parse(t, TerminParseAttr.NO);
        if (_tok !== null) {
            let _typ = BookLinkTyp.of(_tok.termin.tag);
            let ok = true;
            if (_typ === BookLinkTyp.TYPE || _typ === BookLinkTyp.NAMETAIL || _typ === BookLinkTyp.ELECTRONRES) {
                if (t.previous !== null && ((t.previous.is_char_of(".:[") || t.previous.is_hiphen))) {
                }
                else 
                    ok = false;
            }
            if (ok) 
                return BookLinkToken._new347(t, _tok.end_token, _typ, _tok.termin.canonic_text);
            if (_typ === BookLinkTyp.ELECTRONRES) {
                for (let tt = _tok.end_token.next; tt !== null; tt = tt.next) {
                    if ((tt instanceof TextToken) && !tt.chars.is_letter) 
                        continue;
                    if (tt.get_referent() instanceof UriReferent) 
                        return BookLinkToken._new344(t, tt, BookLinkTyp.ELECTRONRES, tt.get_referent());
                    break;
                }
            }
        }
        if (t.is_char('/')) {
            let res = BookLinkToken._new347(t, t, BookLinkTyp.DELIMETER, "/");
            if (t.next !== null && t.next.is_char('/')) {
                res.end_token = t.next;
                res.value = "//";
            }
            if (!t.is_whitespace_before && !t.is_whitespace_after) {
                let coo = 3;
                let no = true;
                for (let tt = t.next; tt !== null && coo > 0; tt = tt.next,coo--) {
                    let vvv = BookLinkToken.try_parse(tt, lev + 1);
                    if (vvv !== null && vvv.typ !== BookLinkTyp.NUMBER) {
                        no = false;
                        break;
                    }
                }
                if (no) 
                    return null;
            }
            return res;
        }
        if ((t instanceof NumberToken) && (t).int_value !== null && (t).typ === NumberSpellingType.DIGIT) {
            let res = BookLinkToken._new347(t, t, BookLinkTyp.NUMBER, (t).value.toString());
            let val = (t).int_value;
            if (val >= 1930 && (val < 2030)) 
                res.typ = BookLinkTyp.YEAR;
            if (t.next !== null && t.next.is_char('.')) 
                res.end_token = t.next;
            else if ((t.next !== null && t.next.length_char === 1 && !t.next.chars.is_letter) && t.next.is_whitespace_after) 
                res.end_token = t.next;
            else if (t.next instanceof TextToken) {
                let term = (t.next).term;
                if (((term === "СТР" || term === "C" || term === "С") || term === "P" || term === "S") || term === "PAGES") {
                    res.end_token = t.next;
                    res.typ = BookLinkTyp.PAGES;
                    res.value = (t).value.toString();
                }
            }
            return res;
        }
        if (t instanceof TextToken) {
            let term = (t).term;
            if (((((((term === "СТР" || term === "C" || term === "С") || term === "ТОМ" || term === "T") || term === "Т" || term === "P") || term === "PP" || term === "V") || term === "VOL" || term === "S") || term === "СТОР" || t.is_value("PAGE", null)) || t.is_value("СТРАНИЦА", "СТОРІНКА")) {
                let tt = t.next;
                while (tt !== null) {
                    if (tt.is_char_of(".:~")) 
                        tt = tt.next;
                    else 
                        break;
                }
                if (tt instanceof NumberToken) {
                    let res = BookLinkToken._new346(t, tt, BookLinkTyp.PAGERANGE);
                    let tt0 = tt;
                    let tt1 = tt;
                    for (tt = tt.next; tt !== null; tt = tt.next) {
                        if (tt.is_char_of(",") || tt.is_hiphen) {
                            if (tt.next instanceof NumberToken) {
                                tt = tt.next;
                                res.end_token = tt;
                                tt1 = tt;
                                continue;
                            }
                        }
                        break;
                    }
                    res.value = MiscHelper.get_text_value(tt0, tt1, GetTextAttr.NO);
                    return res;
                }
            }
            if ((term === "M" || term === "М" || term === "СПБ") || term === "K" || term === "К") {
                if (t.next !== null && t.next.is_char_of(":;")) {
                    let re = BookLinkToken._new346(t, t.next, BookLinkTyp.GEO);
                    return re;
                }
                if (t.next !== null && t.next.is_char_of(".")) {
                    let res = BookLinkToken._new346(t, t.next, BookLinkTyp.GEO);
                    if (t.next.next !== null && t.next.next.is_char_of(":;")) 
                        res.end_token = t.next.next;
                    else if (t.next.next !== null && (t.next.next instanceof NumberToken)) {
                    }
                    else if (t.next.next !== null && t.next.next.is_comma && (t.next.next.next instanceof NumberToken)) {
                    }
                    else 
                        return null;
                    return res;
                }
            }
            if (term === "ПЕР" || term === "ПЕРЕВ" || term === "ПЕРЕВОД") {
                let tt = t;
                if (tt.next !== null && tt.next.is_char('.')) 
                    tt = tt.next;
                if (tt.next !== null && ((tt.next.is_value("C", null) || tt.next.is_value("С", null)))) {
                    tt = tt.next;
                    if (tt.next === null || tt.whitespaces_after_count > 2) 
                        return null;
                    let re = BookLinkToken._new346(t, tt.next, BookLinkTyp.TRANSLATE);
                    return re;
                }
            }
            if (term === "ТАМ" || term === "ТАМЖЕ") {
                let res = BookLinkToken._new346(t, t, BookLinkTyp.TAMZE);
                if (t.next !== null && t.next.is_value("ЖЕ", null)) 
                    res.end_token = t.next;
                return res;
            }
            if (((term === "СМ" || term === "CM" || term === "НАПР") || term === "НАПРИМЕР" || term === "SEE") || term === "ПОДРОБНЕЕ" || term === "ПОДРОБНО") {
                let res = BookLinkToken._new346(t, t, BookLinkTyp.SEE);
                for (t = t.next; t !== null; t = t.next) {
                    if (t.is_char_of(".:") || t.is_value("ALSO", null)) {
                        res.end_token = t;
                        continue;
                    }
                    if (t.is_value("В", null) || t.is_value("IN", null)) {
                        res.end_token = t;
                        continue;
                    }
                    let vvv = BookLinkToken._try_parse(t, lev + 1);
                    if (vvv !== null && vvv.typ === BookLinkTyp.SEE) {
                        res.end_token = vvv.end_token;
                        break;
                    }
                    break;
                }
                return res;
            }
            if (term === "БОЛЕЕ") {
                let vvv = BookLinkToken._try_parse(t.next, lev + 1);
                if (vvv !== null && vvv.typ === BookLinkTyp.SEE) {
                    vvv.begin_token = t;
                    return vvv;
                }
            }
            let no = MiscHelper.check_number_prefix(t);
            if (no instanceof NumberToken) 
                return BookLinkToken._new346(t, no, BookLinkTyp.N);
            if (((term === "B" || term === "В")) && (t.next instanceof NumberToken) && (t.next.next instanceof TextToken)) {
                let term2 = (t.next.next).term;
                if (((term2 === "Т" || term2 === "T" || term2.startsWith("ТОМ")) || term2 === "TT" || term2 === "ТТ") || term2 === "КН" || term2.startsWith("КНИГ")) 
                    return BookLinkToken._new346(t, t.next.next, BookLinkTyp.VOLUME);
            }
        }
        if (t.is_char('(')) {
            if (((t.next instanceof NumberToken) && (t.next).int_value !== null && t.next.next !== null) && t.next.next.is_char(')')) {
                let num = (t.next).int_value;
                if (num > 1900 && num <= 2040) {
                    if (num <= Utils.now().getFullYear()) 
                        return BookLinkToken._new347(t, t.next.next, BookLinkTyp.YEAR, num.toString());
                }
            }
            if (((t.next instanceof ReferentToken) && (t.next.get_referent() instanceof DateReferent) && t.next.next !== null) && t.next.next.is_char(')')) {
                let num = (t.next.get_referent()).year;
                if (num > 0) 
                    return BookLinkToken._new347(t, t.next.next, BookLinkTyp.YEAR, num.toString());
            }
        }
        return null;
    }
    
    static check_link_before(t0, num) {
        if (num === null || t0 === null) 
            return false;
        let nn = 0;
        if (t0.previous !== null && (t0.previous.get_referent() instanceof BookLinkRefReferent)) {
            let wrapnn367 = new RefOutArgWrapper();
            let inoutres368 = Utils.tryParseInt(Utils.notNull((t0.previous.get_referent()).number, ""), wrapnn367);
            nn = wrapnn367.value;
            if (inoutres368) {
                if ((nn + 1).toString() === num) 
                    return true;
            }
        }
        return false;
    }
    
    static check_link_after(t1, num) {
        if (num === null || t1 === null) 
            return false;
        if (t1.is_newline_after) {
            let bbb = BookLinkToken.try_parse(t1.next, 0);
            let nn = 0;
            if (bbb !== null && bbb.typ === BookLinkTyp.NUMBER) {
                let wrapnn369 = new RefOutArgWrapper();
                let inoutres370 = Utils.tryParseInt((bbb.value != null ? bbb.value : ""), wrapnn369);
                nn = wrapnn369.value;
                if (inoutres370) {
                    if ((nn - 1).toString() === num) 
                        return true;
                }
            }
        }
        return false;
    }
    
    static initialize() {
        if (BookLinkToken.m_termins !== null) 
            return;
        BookLinkToken.m_termins = new TerminCollection();
        let tt = null;
        tt = Termin._new119("ТЕКСТ", BookLinkTyp.NAMETAIL);
        BookLinkToken.m_termins.add(tt);
        tt = Termin._new119("ЭЛЕКТРОННЫЙ РЕСУРС", BookLinkTyp.ELECTRONRES);
        tt.add_variant("ЕЛЕКТРОННИЙ РЕСУРС", false);
        tt.add_variant("MODE OF ACCESS", false);
        tt.add_variant("URL", false);
        tt.add_variant("URLS", false);
        tt.add_variant("ELECTRONIC RESOURCE", false);
        tt.add_variant("ON LINE", false);
        tt.add_variant("ONLINE", false);
        BookLinkToken.m_termins.add(tt);
        tt = Termin._new119("РЕЖИМ ДОСТУПА", BookLinkTyp.MISC);
        tt.add_variant("РЕЖИМ ДОСТУПУ", false);
        tt.add_variant("AVAILABLE", false);
        BookLinkToken.m_termins.add(tt);
        tt = Termin._new119("МОНОГРАФИЯ", BookLinkTyp.TYPE);
        tt.add_variant("МОНОГРАФІЯ", false);
        BookLinkToken.m_termins.add(tt);
        tt = Termin._new119("УЧЕБНОЕ ПОСОБИЕ", BookLinkTyp.TYPE);
        tt.add_abridge("УЧ.ПОСОБИЕ");
        tt.add_abridge("УЧЕБ.");
        tt.add_abridge("УЧЕБН.");
        tt.add_variant("УЧЕБНИК", false);
        tt.add_variant("ПОСОБИЕ", false);
        BookLinkToken.m_termins.add(tt);
        tt = Termin._new120("НАВЧАЛЬНИЙ ПОСІБНИК", BookLinkTyp.TYPE, MorphLang.UA);
        tt.add_abridge("НАВЧ.ПОСІБНИК");
        tt.add_abridge("НАВЧ.ПОСІБ");
        tt.add_variant("ПІДРУЧНИК", false);
        tt.add_variant("ПІДРУЧ", false);
        BookLinkToken.m_termins.add(tt);
        tt = Termin._new119("АВТОРЕФЕРАТ", BookLinkTyp.TYPE);
        tt.add_abridge("АВТОРЕФ.");
        BookLinkToken.m_termins.add(tt);
        tt = Termin._new119("ДИССЕРТАЦИЯ", BookLinkTyp.TYPE);
        tt.add_variant("ДИСС", false);
        tt.add_abridge("ДИС.");
        tt.add_variant("ДИСЕРТАЦІЯ", false);
        tt.add_variant("DISSERTATION", false);
        BookLinkToken.m_termins.add(tt);
        tt = Termin._new119("ДОКЛАД", BookLinkTyp.TYPE);
        tt.add_variant("ДОКЛ", false);
        tt.add_abridge("ДОКЛ.");
        tt.add_variant("ДОПОВІДЬ", false);
        BookLinkToken.m_termins.add(tt);
        tt = Termin._new119("ПОД РЕДАКЦИЕЙ", BookLinkTyp.EDITORS);
        tt.add_abridge("ПОД РЕД");
        tt.add_abridge("ОТВ.РЕД");
        tt.add_abridge("ОТВ.РЕДАКТОР");
        tt.add_variant("ПОД ОБЩЕЙ РЕДАКЦИЕЙ", false);
        tt.add_abridge("ОТВ.РЕД");
        tt.add_abridge("ОТВ.РЕДАКТОР");
        tt.add_abridge("ПОД ОБЩ. РЕД");
        tt.add_abridge("ПОД ОБЩЕЙ РЕД");
        BookLinkToken.m_termins.add(tt);
        tt = Termin._new120("ПІД РЕДАКЦІЄЮ", BookLinkTyp.EDITORS, MorphLang.UA);
        tt.add_abridge("ПІД РЕД");
        tt.add_abridge("ОТВ.РЕД");
        tt.add_abridge("ВІД. РЕДАКТОР");
        tt.add_variant("ЗА ЗАГ.РЕД", false);
        tt.add_abridge("ВІДПОВІДАЛЬНИЙ РЕДАКТОР");
        BookLinkToken.m_termins.add(tt);
        tt = Termin._new119("СОСТАВИТЕЛЬ", BookLinkTyp.SOSTAVITEL);
        tt.add_abridge("СОСТ.");
        BookLinkToken.m_termins.add(tt);
        tt = Termin._new120("УКЛАДАЧ", BookLinkTyp.SOSTAVITEL, MorphLang.UA);
        tt.add_abridge("УКЛ.");
        BookLinkToken.m_termins.add(tt);
        for (const s of ["Политиздат", "Прогресс", "Мысль", "Просвещение", "Наука", "Физматлит", "Физматкнига", "Инфра-М", "Питер", "Интеллект", "Аспект пресс", "Аспект-пресс", "АСВ", "Радиотехника", "Радио и связь", "Лань", "Академия", "Академкнига", "URSS", "Академический проект", "БИНОМ", "БВХ", "Вильямс", "Владос", "Волтерс Клувер", "Wolters Kluwer", "Восток-Запад", "Высшая школа", "ГЕО", "Дашков и К", "Кнорус", "Когито-Центр", "КолосС", "Проспект", "РХД", "Статистика", "Финансы и статистика", "Флинта", "Юнити-дана"]) {
            BookLinkToken.m_termins.add(Termin._new119(s.toUpperCase(), BookLinkTyp.PRESS));
        }
        tt = Termin._new119("ИЗДАТЕЛЬСТВО", BookLinkTyp.PRESS);
        tt.add_abridge("ИЗ-ВО");
        tt.add_abridge("ИЗД-ВО");
        tt.add_abridge("ИЗДАТ-ВО");
        tt.add_variant("ISSN", false);
        tt.add_variant("PRESS", false);
        tt.add_variant("VERLAG", false);
        tt.add_variant("JOURNAL", false);
        BookLinkToken.m_termins.add(tt);
    }
    
    static parse_start_of_lit_block(t) {
        if (t === null) 
            return null;
        let bl = BlockLine.create(t, null);
        if (bl !== null && bl.typ === BlkTyps.LITERATURE) 
            return bl.end_token;
        return null;
    }
    
    static _new344(_arg1, _arg2, _arg3, _arg4) {
        let res = new BookLinkToken(_arg1, _arg2);
        res.typ = _arg3;
        res.ref = _arg4;
        return res;
    }
    
    static _new345(_arg1, _arg2, _arg3, _arg4) {
        let res = new BookLinkToken(_arg1, _arg2);
        res.typ = _arg3;
        res.tok = _arg4;
        return res;
    }
    
    static _new346(_arg1, _arg2, _arg3) {
        let res = new BookLinkToken(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
    
    static _new347(_arg1, _arg2, _arg3, _arg4) {
        let res = new BookLinkToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        return res;
    }
    
    static static_constructor() {
        BookLinkToken.m_termins = null;
    }
}


BookLinkToken.static_constructor();

module.exports = BookLinkToken
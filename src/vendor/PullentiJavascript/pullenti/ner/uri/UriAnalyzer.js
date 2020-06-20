/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const StringBuilder = require("./../../unisharp/StringBuilder");

const NounPhraseHelper = require("./../core/NounPhraseHelper");
const Token = require("./../Token");
const NounPhraseParseAttr = require("./../core/NounPhraseParseAttr");
const TextToken = require("./../TextToken");
const NumberSpellingType = require("./../NumberSpellingType");
const CharsInfo = require("./../../morph/CharsInfo");
const MorphLang = require("./../../morph/MorphLang");
const BracketParseAttr = require("./../core/BracketParseAttr");
const GetTextAttr = require("./../core/GetTextAttr");
const TerminParseAttr = require("./../core/TerminParseAttr");
const Termin = require("./../core/Termin");
const TerminCollection = require("./../core/TerminCollection");
const EpNerBankInternalResourceHelper = require("./../bank/internal/EpNerBankInternalResourceHelper");
const MetaToken = require("./../MetaToken");
const ReferentToken = require("./../ReferentToken");
const NumberToken = require("./../NumberToken");
const MetaUri = require("./internal/MetaUri");
const UriReferent = require("./UriReferent");
const UriItemToken = require("./internal/UriItemToken");
const Referent = require("./../Referent");
const BracketHelper = require("./../core/BracketHelper");
const ProcessorService = require("./../ProcessorService");
const MiscHelper = require("./../core/MiscHelper");
const Analyzer = require("./../Analyzer");

/**
 * Анализатор для выделения URI-объектов (схема:значение)
 */
class UriAnalyzer extends Analyzer {
    
    get name() {
        return UriAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "URI";
    }
    
    get description() {
        return "URI (URL, EMail), ISBN, УДК, ББК ...";
    }
    
    clone() {
        return new UriAnalyzer();
    }
    
    get progress_weight() {
        return 2;
    }
    
    get type_system() {
        return [MetaUri.global_meta];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(MetaUri.MAIL_IMAGE_ID, EpNerBankInternalResourceHelper.get_bytes("email.png"));
        res.put(MetaUri.URI_IMAGE_ID, EpNerBankInternalResourceHelper.get_bytes("uri.png"));
        return res;
    }
    
    get used_extern_object_types() {
        return ["PHONE"];
    }
    
    create_referent(type) {
        if (type === UriReferent.OBJ_TYPENAME) 
            return new UriReferent();
        return null;
    }
    
    /**
     * Основная функция выделения объектов
     * @param container 
     * @param lastStage 
     * @return 
     */
    process(kit) {
        let ad = kit.get_analyzer_data(this);
        for (let t = kit.first_token; t !== null; t = t.next) {
            let tt = t;
            let i = 0;
            let tok = UriAnalyzer.m_schemes.try_parse(t, TerminParseAttr.NO);
            if (tok !== null) {
                i = tok.termin.tag;
                tt = tok.end_token;
                if (tt.next !== null && tt.next.is_char('(')) {
                    let tok1 = UriAnalyzer.m_schemes.try_parse(tt.next.next, TerminParseAttr.NO);
                    if ((tok1 !== null && tok1.termin.canonic_text === tok.termin.canonic_text && tok1.end_token.next !== null) && tok1.end_token.next.is_char(')')) 
                        tt = tok1.end_token.next;
                }
                if (i === 0) {
                    if ((tt.next === null || ((!tt.next.is_char_of(":|") && !tt.is_table_control_char)) || tt.next.is_whitespace_before) || tt.next.whitespaces_after_count > 2) 
                        continue;
                    let t1 = tt.next.next;
                    while (t1 !== null && t1.is_char_of("/\\")) {
                        t1 = t1.next;
                    }
                    if (t1 === null || t1.whitespaces_before_count > 2) 
                        continue;
                    let ut = UriItemToken.attach_uri_content(t1, false);
                    if (ut === null) 
                        continue;
                    let ur = Utils.as(ad.register_referent(UriReferent._new2707(tok.termin.canonic_text.toLowerCase(), ut.value)), UriReferent);
                    let rt = new ReferentToken(ad.register_referent(ur), t, ut.end_token);
                    rt.begin_token = Utils.notNull(UriAnalyzer._site_before(t.previous), t);
                    if (rt.end_token.next !== null && rt.end_token.next.is_char_of("/\\")) 
                        rt.end_token = rt.end_token.next;
                    kit.embed_token(rt);
                    t = rt;
                    continue;
                }
                if (i === 10) {
                    tt = tt.next;
                    if (tt === null || !tt.is_char(':')) 
                        continue;
                    for (tt = tt.next; tt !== null; tt = tt.next) {
                        if (tt.is_char_of("/\\")) {
                        }
                        else 
                            break;
                    }
                    if (tt === null) 
                        continue;
                    if (tt.is_value("WWW", null) && tt.next !== null && tt.next.is_char('.')) 
                        tt = tt.next.next;
                    if (tt === null || tt.is_newline_before) 
                        continue;
                    let ut = UriItemToken.attach_uri_content(tt, true);
                    if (ut === null) 
                        continue;
                    if (ut.value.length < 4) 
                        continue;
                    let ur = Utils.as(ad.register_referent(UriReferent._new2707(tok.termin.canonic_text.toLowerCase(), ut.value)), UriReferent);
                    let rt = new ReferentToken(ad.register_referent(ur), t, ut.end_token);
                    rt.begin_token = Utils.notNull(UriAnalyzer._site_before(t.previous), t);
                    if (rt.end_token.next !== null && rt.end_token.next.is_char_of("/\\")) 
                        rt.end_token = rt.end_token.next;
                    kit.embed_token(rt);
                    t = rt;
                    continue;
                }
                if (i === 2) {
                    if (tt.next === null || !tt.next.is_char('.') || tt.next.is_whitespace_before) 
                        continue;
                    if (tt.next.is_whitespace_after && tok.termin.canonic_text !== "WWW") 
                        continue;
                    let ut = UriItemToken.attach_uri_content(tt.next.next, true);
                    if (ut === null) 
                        continue;
                    let ur = Utils.as(ad.register_referent(UriReferent._new2707("http", ut.value)), UriReferent);
                    let rt = new ReferentToken(ur, t, ut.end_token);
                    rt.begin_token = Utils.notNull(UriAnalyzer._site_before(t.previous), t);
                    if (rt.end_token.next !== null && rt.end_token.next.is_char_of("/\\")) 
                        rt.end_token = rt.end_token.next;
                    kit.embed_token(rt);
                    t = rt;
                    continue;
                }
                if (i === 1) {
                    let sch = tok.termin.canonic_text;
                    let ut = null;
                    if (sch === "ISBN") {
                        ut = UriItemToken.attachisbn(tt.next);
                        if ((ut === null && t.previous !== null && t.previous.is_char('(')) && t.next !== null && t.next.is_char(')')) {
                            for (let tt0 = t.previous.previous; tt0 !== null; tt0 = tt0.previous) {
                                if (tt0.whitespaces_after_count > 2) 
                                    break;
                                if (tt0.is_whitespace_before) {
                                    ut = UriItemToken.attachisbn(tt0);
                                    if (ut !== null && ut.end_token.next !== t.previous) 
                                        ut = null;
                                    break;
                                }
                            }
                        }
                    }
                    else if ((sch === "RFC" || sch === "ISO" || sch === "ОКФС") || sch === "ОКОПФ") 
                        ut = UriItemToken.attachisocontent(tt.next, ":");
                    else if (sch === "ГОСТ") 
                        ut = UriItemToken.attachisocontent(tt.next, "-.");
                    else if (sch === "ТУ") {
                        if (tok.chars.is_all_upper) {
                            ut = UriItemToken.attachisocontent(tt.next, "-.");
                            if (ut !== null && (ut.length_char < 10)) 
                                ut = null;
                        }
                    }
                    else 
                        ut = UriItemToken.attachbbk(tt.next);
                    if (ut === null) 
                        continue;
                    let ur = Utils.as(ad.register_referent(UriReferent._new2710(ut.value, sch)), UriReferent);
                    let rt = null;
                    if (ut.begin_char < t.begin_char) {
                        rt = new ReferentToken(ur, ut.begin_token, t);
                        if (t.next !== null && t.next.is_char(')')) 
                            rt.end_token = t.next;
                    }
                    else 
                        rt = new ReferentToken(ur, t, ut.end_token);
                    if (t.previous !== null && t.previous.is_value("КОД", null)) 
                        rt.begin_token = t.previous;
                    if (ur.scheme.startsWith("ОК")) 
                        UriAnalyzer._check_detail(rt);
                    kit.embed_token(rt);
                    t = rt;
                    if (ur.scheme.startsWith("ОК")) {
                        while (t.next !== null) {
                            if (t.next.is_comma_and && (t.next.next instanceof NumberToken)) {
                            }
                            else 
                                break;
                            ut = UriItemToken.attachbbk(t.next.next);
                            if (ut === null) 
                                break;
                            ur = Utils.as(ad.register_referent(UriReferent._new2710(ut.value, sch)), UriReferent);
                            rt = new ReferentToken(ur, t.next.next, ut.end_token);
                            UriAnalyzer._check_detail(rt);
                            kit.embed_token(rt);
                            t = rt;
                        }
                    }
                    continue;
                }
                if (i === 3) {
                    let t0 = tt.next;
                    while (t0 !== null) {
                        if (t0.is_char_of(":|") || t0.is_table_control_char || t0.is_hiphen) 
                            t0 = t0.next;
                        else 
                            break;
                    }
                    if (t0 === null) 
                        continue;
                    let ut = UriItemToken.attach_skype(t0);
                    if (ut === null) 
                        continue;
                    let ur = Utils.as(ad.register_referent(UriReferent._new2710(ut.value.toLowerCase(), (tok.termin.canonic_text === "SKYPE" ? "skype" : tok.termin.canonic_text))), UriReferent);
                    let rt = new ReferentToken(ur, t, ut.end_token);
                    kit.embed_token(rt);
                    t = rt;
                    continue;
                }
                if (i === 4) {
                    let t0 = tt.next;
                    if (t0 !== null && ((t0.is_char(':') || t0.is_hiphen))) 
                        t0 = t0.next;
                    if (t0 === null) 
                        continue;
                    let ut = UriItemToken.attach_icq_content(t0);
                    if (ut === null) 
                        continue;
                    let ur = Utils.as(ad.register_referent(UriReferent._new2710(ut.value, "ICQ")), UriReferent);
                    let rt = new ReferentToken(ur, t, t0);
                    kit.embed_token(rt);
                    t = rt;
                    continue;
                }
                if (i === 5 || i === 6) {
                    let t0 = tt.next;
                    let has_tab_cel = false;
                    let is_iban = false;
                    for (; t0 !== null; t0 = t0.next) {
                        if ((((t0.is_value("БАНК", null) || t0.morph.class0.is_preposition || t0.is_hiphen) || t0.is_char_of(".:") || t0.is_value("РУБЛЬ", null)) || t0.is_value("РУБ", null) || t0.is_value("ДОЛЛАР", null)) || t0.is_value("№", null) || t0.is_value("N", null)) {
                        }
                        else if (t0.is_table_control_char) 
                            has_tab_cel = true;
                        else if (t0.is_char_of("\\/") && t0.next !== null && t0.next.is_value("IBAN", null)) {
                            is_iban = true;
                            t0 = t0.next;
                        }
                        else if (t0.is_value("IBAN", null)) 
                            is_iban = true;
                        else if (t0 instanceof TextToken) {
                            let npt = NounPhraseHelper.try_parse(t0, NounPhraseParseAttr.NO, 0, null);
                            if (npt !== null && npt.morph._case.is_genitive) {
                                t0 = npt.end_token;
                                continue;
                            }
                            break;
                        }
                        else 
                            break;
                    }
                    if (t0 === null) 
                        continue;
                    let ur2 = null;
                    let ur2begin = null;
                    let ur2end = null;
                    let t00 = t0;
                    let val = t0.get_source_text();
                    if (Utils.isDigit(val[0]) && ((((i === 6 || tok.termin.canonic_text === "ИНН" || tok.termin.canonic_text === "БИК") || tok.termin.canonic_text === "ОГРН" || tok.termin.canonic_text === "СНИЛС") || tok.termin.canonic_text === "ОКПО"))) {
                        if (t0.chars.is_letter) 
                            continue;
                        if (Utils.isNullOrEmpty(val) || !Utils.isDigit(val[0])) 
                            continue;
                        if (t0.length_char < 9) {
                            let tmp = new StringBuilder();
                            tmp.append(val);
                            for (let ttt = t0.next; ttt !== null; ttt = ttt.next) {
                                if (ttt.whitespaces_before_count > 1) 
                                    break;
                                if (ttt instanceof NumberToken) {
                                    tmp.append(ttt.get_source_text());
                                    t0 = ttt;
                                    continue;
                                }
                                if (ttt.is_hiphen || ttt.is_char('.')) {
                                    if (ttt.next === null || !((ttt.next instanceof NumberToken))) 
                                        break;
                                    if (ttt.is_whitespace_after || ttt.is_whitespace_before) 
                                        break;
                                    continue;
                                }
                                break;
                            }
                            val = null;
                            if (tmp.length === 20) 
                                val = tmp.toString();
                            else if (tmp.length === 9 && tok.termin.canonic_text === "БИК") 
                                val = tmp.toString();
                            else if (((tmp.length === 10 || tmp.length === 12)) && tok.termin.canonic_text === "ИНН") 
                                val = tmp.toString();
                            else if (tmp.length >= 15 && tok.termin.canonic_text === "Л/С") 
                                val = tmp.toString();
                            else if (tmp.length >= 11 && ((tok.termin.canonic_text === "ОГРН" || tok.termin.canonic_text === "СНИЛС"))) 
                                val = tmp.toString();
                            else if (tok.termin.canonic_text === "ОКПО") 
                                val = tmp.toString();
                        }
                        if (val === null) 
                            continue;
                    }
                    else if (!((t0 instanceof NumberToken))) {
                        if ((t0 instanceof TextToken) && is_iban) {
                            let tmp1 = new StringBuilder();
                            let t1 = null;
                            for (let ttt = t0; ttt !== null; ttt = ttt.next) {
                                if (ttt.is_newline_before && ttt !== t0) 
                                    break;
                                if (ttt.is_hiphen) 
                                    continue;
                                if (!((ttt instanceof NumberToken))) {
                                    if (!((ttt instanceof TextToken)) || !ttt.chars.is_latin_letter) 
                                        break;
                                }
                                tmp1.append(ttt.get_source_text());
                                t1 = ttt;
                                if (tmp1.length >= 34) 
                                    break;
                            }
                            if (tmp1.length < 10) 
                                continue;
                            let ur1 = UriReferent._new2710(tmp1.toString(), tok.termin.canonic_text);
                            ur1.add_slot(UriReferent.ATTR_DETAIL, "IBAN", false, 0);
                            let rt1 = new ReferentToken(ad.register_referent(ur1), t, t1);
                            kit.embed_token(rt1);
                            t = rt1;
                            continue;
                        }
                        if (!t0.is_char_of("/\\") || t0.next === null) 
                            continue;
                        let tok2 = UriAnalyzer.m_schemes.try_parse(t0.next, TerminParseAttr.NO);
                        if (tok2 === null || !(((typeof tok2.termin.tag === 'number' || tok2.termin.tag instanceof Number))) || (tok2.termin.tag) !== i) 
                            continue;
                        t0 = tok2.end_token.next;
                        while (t0 !== null) {
                            if (t0.is_char_of(":N№")) 
                                t0 = t0.next;
                            else if (t0.is_table_control_char) {
                                t0 = t0.next;
                                t00 = t0;
                                has_tab_cel = true;
                            }
                            else 
                                break;
                        }
                        if (!((t0 instanceof NumberToken))) 
                            continue;
                        let tmp = new StringBuilder();
                        for (; t0 !== null; t0 = t0.next) {
                            if (!((t0 instanceof NumberToken))) 
                                break;
                            tmp.append(t0.get_source_text());
                        }
                        if (t0 === null || !t0.is_char_of("/\\,") || !((t0.next instanceof NumberToken))) 
                            continue;
                        val = tmp.toString();
                        tmp.length = 0;
                        ur2begin = t0.next;
                        for (t0 = t0.next; t0 !== null; t0 = t0.next) {
                            if (!((t0 instanceof NumberToken))) 
                                break;
                            if (t0.whitespaces_before_count > 4 && tmp.length > 0) 
                                break;
                            tmp.append(t0.get_source_text());
                            ur2end = t0;
                        }
                        ur2 = Utils.as(ad.register_referent(UriReferent._new2707(tok2.termin.canonic_text, tmp.toString())), UriReferent);
                    }
                    if (val.length < 5) 
                        continue;
                    let ur = Utils.as(ad.register_referent(UriReferent._new2710(val, tok.termin.canonic_text)), UriReferent);
                    let rt = new ReferentToken(ur, t, (ur2begin === null ? t0 : ur2begin.previous));
                    if (has_tab_cel) 
                        rt.begin_token = t00;
                    if (ur.scheme.startsWith("ОК")) 
                        UriAnalyzer._check_detail(rt);
                    for (let ttt = t.previous; ttt !== null; ttt = ttt.previous) {
                        if (ttt.is_table_control_char) 
                            break;
                        if (ttt.morph.class0.is_preposition) 
                            continue;
                        if (ttt.is_value("ОРГАНИЗАЦИЯ", null)) 
                            continue;
                        if (ttt.is_value("НОМЕР", null) || ttt.is_value("КОД", null)) 
                            t = rt.begin_token = ttt;
                        break;
                    }
                    kit.embed_token(rt);
                    t = rt;
                    if (ur2 !== null) {
                        let rt2 = new ReferentToken(ur2, ur2begin, ur2end);
                        kit.embed_token(rt2);
                        t = rt2;
                    }
                    while ((t.next !== null && t.next.is_comma_and && (t.next.next instanceof NumberToken)) && t.next.next.length_char === val.length && (t.next.next).typ === NumberSpellingType.DIGIT) {
                        let val2 = t.next.next.get_source_text();
                        ur2 = new UriReferent();
                        ur2.scheme = ur.scheme;
                        ur2.value = val2;
                        ur2 = Utils.as(ad.register_referent(ur2), UriReferent);
                        let rt2 = new ReferentToken(ur2, t.next, t.next.next);
                        kit.embed_token(rt2);
                        t = rt2;
                    }
                    continue;
                }
                continue;
            }
            if (t.is_char('@')) {
                let u1s = UriItemToken.attach_mail_users(t.previous);
                if (u1s === null) 
                    continue;
                let u2 = UriItemToken.attach_domain_name(t.next, false, true);
                if (u2 === null) 
                    continue;
                for (let ii = u1s.length - 1; ii >= 0; ii--) {
                    let ur = Utils.as(ad.register_referent(UriReferent._new2710((u1s[ii].value + "@" + u2.value).toLowerCase(), "mailto")), UriReferent);
                    let b = u1s[ii].begin_token;
                    let t0 = b.previous;
                    if (t0 !== null && t0.is_char(':')) 
                        t0 = t0.previous;
                    if (t0 !== null && ii === 0) {
                        let br = false;
                        for (let ttt = t0; ttt !== null; ttt = ttt.previous) {
                            if (!((ttt instanceof TextToken))) 
                                break;
                            if (ttt !== t0 && ttt.whitespaces_after_count > 1) 
                                break;
                            if (ttt.is_char(')')) {
                                br = true;
                                continue;
                            }
                            if (ttt.is_char('(')) {
                                if (!br) 
                                    break;
                                br = false;
                                continue;
                            }
                            if (ttt.is_value("EMAIL", null) || ttt.is_value("MAILTO", null)) {
                                b = ttt;
                                break;
                            }
                            if (ttt.is_value("MAIL", null)) {
                                b = ttt;
                                if ((ttt.previous !== null && ttt.previous.is_hiphen && ttt.previous.previous !== null) && ((ttt.previous.previous.is_value("E", null) || ttt.previous.previous.is_value("Е", null)))) 
                                    b = ttt.previous.previous;
                                break;
                            }
                            if (ttt.is_value("ПОЧТА", null) || ttt.is_value("АДРЕС", null)) {
                                b = t0;
                                ttt = ttt.previous;
                                if (ttt !== null && ttt.is_char('.')) 
                                    ttt = ttt.previous;
                                if (ttt !== null && ((t0.is_value("ЭЛ", null) || ttt.is_value("ЭЛЕКТРОННЫЙ", null)))) 
                                    b = ttt;
                                if (b.previous !== null && b.previous.is_value("АДРЕС", null)) 
                                    b = b.previous;
                                break;
                            }
                            if (ttt.morph.class0.is_preposition) 
                                continue;
                        }
                    }
                    let rt = new ReferentToken(ur, b, (ii === (u1s.length - 1) ? u2.end_token : u1s[ii].end_token));
                    kit.embed_token(rt);
                    t = rt;
                }
                continue;
            }
            if (!t.chars.is_cyrillic_letter) {
                if (t.is_whitespace_before || ((t.previous !== null && t.previous.is_char_of(",(")))) {
                    let u1 = UriItemToken.attach_url(t);
                    if (u1 !== null) {
                        if (u1.is_whitespace_after || u1.end_token.next === null || !u1.end_token.next.is_char('@')) {
                            if (u1.end_token.next !== null && u1.end_token.next.is_char_of("\\/")) {
                                let u2 = UriItemToken.attach_uri_content(t, false);
                                if (u2 !== null) 
                                    u1 = u2;
                            }
                            let ur = Utils.as(ad.register_referent(UriReferent._new2707("http", u1.value)), UriReferent);
                            let rt = new ReferentToken(ur, u1.begin_token, u1.end_token);
                            rt.begin_token = Utils.notNull(UriAnalyzer._site_before(u1.begin_token.previous), u1.begin_token);
                            kit.embed_token(rt);
                            t = rt;
                            continue;
                        }
                    }
                }
            }
            if ((t instanceof TextToken) && !t.is_whitespace_after && t.length_char > 2) {
                if (UriAnalyzer._site_before(t.previous) !== null) {
                    let ut = UriItemToken.attach_uri_content(t, true);
                    if (ut === null || ut.value.indexOf('.') <= 0 || ut.value.indexOf('@') > 0) 
                        continue;
                    let ur = Utils.as(ad.register_referent(UriReferent._new2707("http", ut.value)), UriReferent);
                    let rt = new ReferentToken(ur, t, ut.end_token);
                    rt.begin_token = UriAnalyzer._site_before(t.previous);
                    if (rt.end_token.next !== null && rt.end_token.next.is_char_of("/\\")) 
                        rt.end_token = rt.end_token.next;
                    kit.embed_token(rt);
                    t = rt;
                    continue;
                }
            }
            if ((t.chars.is_latin_letter && !t.chars.is_all_lower && t.next !== null) && !t.is_whitespace_after) {
                if (t.next.is_char('/')) {
                    let rt = UriAnalyzer._try_attach_lotus(Utils.as(t, TextToken));
                    if (rt !== null) {
                        rt.referent = ad.register_referent(rt.referent);
                        kit.embed_token(rt);
                        t = rt;
                        continue;
                    }
                }
            }
        }
    }
    
    static _check_detail(rt) {
        if (rt.end_token.whitespaces_after_count > 2 || rt.end_token.next === null) 
            return;
        if (rt.end_token.next.is_char('(')) {
            let br = BracketHelper.try_parse(rt.end_token.next, BracketParseAttr.NO, 100);
            if (br !== null) {
                (rt.referent).detail = MiscHelper.get_text_value(br.begin_token.next, br.end_token.previous, GetTextAttr.NO);
                rt.end_token = br.end_token;
            }
        }
    }
    
    static _site_before(t) {
        if (t !== null && t.is_char(':')) 
            t = t.previous;
        if (t === null) 
            return null;
        if ((t.is_value("ВЕБСАЙТ", null) || t.is_value("WEBSITE", null) || t.is_value("WEB", null)) || t.is_value("WWW", null)) 
            return t;
        let t0 = null;
        if (t.is_value("САЙТ", null) || t.is_value("SITE", null)) {
            t0 = t;
            t = t.previous;
        }
        else if (t.is_value("АДРЕС", null)) {
            t0 = t.previous;
            if (t0 !== null && t0.is_char('.')) 
                t0 = t0.previous;
            if (t0 !== null) {
                if (t0.is_value("ЭЛ", null) || t0.is_value("ЭЛЕКТРОННЫЙ", null)) 
                    return t0;
            }
            return null;
        }
        else 
            return null;
        if (t !== null && t.is_hiphen) 
            t = t.previous;
        if (t === null) 
            return t0;
        if (t.is_value("WEB", null) || t.is_value("ВЕБ", null)) 
            t0 = t;
        if (t0.previous !== null && t0.previous.morph.class0.is_adjective && (t0.whitespaces_before_count < 3)) {
            let npt = NounPhraseHelper.try_parse(t0.previous, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) 
                t0 = npt.begin_token;
        }
        return t0;
    }
    
    static _try_attach_lotus(t) {
        if (t === null || t.next === null) 
            return null;
        let t1 = t.next.next;
        let tails = null;
        for (let tt = t1; tt !== null; tt = tt.next) {
            if (tt.is_whitespace_before) {
                if (!tt.is_newline_before) 
                    break;
                if (tails === null || (tails.length < 2)) 
                    break;
            }
            if (!tt.is_letters || tt.chars.is_all_lower) 
                return null;
            if (!((tt instanceof TextToken))) 
                return null;
            if (tails === null) 
                tails = new Array();
            tails.push((tt).term);
            t1 = tt;
            if (tt.is_whitespace_after || tt.next === null) 
                break;
            tt = tt.next;
            if (!tt.is_char('/')) 
                break;
        }
        if (tails === null || (tails.length < 3)) 
            return null;
        let heads = new Array();
        heads.push(t.term);
        let t0 = t;
        let ok = true;
        for (let k = 0; k < 2; k++) {
            if (!((t0.previous instanceof TextToken))) 
                break;
            if (t0.whitespaces_before_count !== 1) {
                if (!t0.is_newline_before || k > 0) 
                    break;
            }
            if (!t0.is_whitespace_before && t0.previous.is_char('/')) 
                break;
            if (CharsInfo.ooEq(t0.previous.chars, t.chars)) {
                t0 = t0.previous;
                heads.splice(0, 0, (t0).term);
                ok = true;
                continue;
            }
            if ((t0.previous.chars.is_latin_letter && t0.previous.chars.is_all_upper && t0.previous.length_char === 1) && k === 0) {
                t0 = t0.previous;
                heads.splice(0, 0, (t0).term);
                ok = false;
                continue;
            }
            break;
        }
        if (!ok) 
            heads.splice(0, 1);
        let tmp = new StringBuilder();
        for (let i = 0; i < heads.length; i++) {
            if (i > 0) 
                tmp.append(' ');
            tmp.append(MiscHelper.convert_first_char_upper_and_other_lower(heads[i]));
        }
        for (const tail of tails) {
            tmp.append("/").append(tail);
        }
        if (((t1.next !== null && t1.next.is_char('@') && t1.next.next !== null) && t1.next.next.chars.is_latin_letter && !t1.next.is_whitespace_after) && !t1.is_whitespace_after) 
            t1 = t1.next.next;
        let _uri = UriReferent._new2707("lotus", tmp.toString());
        return new ReferentToken(_uri, t0, t1);
    }
    
    static initialize() {
        if (UriAnalyzer.m_schemes !== null) 
            return;
        Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
        MetaUri.initialize();
        try {
            UriAnalyzer.m_schemes = new TerminCollection();
            let obj = EpNerBankInternalResourceHelper.get_string("UriSchemes.csv");
            if (obj === null) 
                throw new Error(("Can't file resource file " + "UriSchemes.csv" + " in Organization analyzer"));
            for (const line0 of Utils.splitString(obj, '\n', false)) {
                let line = line0.trim();
                if (Utils.isNullOrEmpty(line)) 
                    continue;
                UriAnalyzer.m_schemes.add(Termin._new602(line, MorphLang.UNKNOWN, true, 0));
            }
            for (const s of ["ISBN", "УДК", "ББК", "ТНВЭД", "ОКВЭД"]) {
                UriAnalyzer.m_schemes.add(Termin._new602(s, MorphLang.UNKNOWN, true, 1));
            }
            UriAnalyzer.m_schemes.add(Termin._new2723("Общероссийский классификатор форм собственности", "ОКФС", 1, "ОКФС"));
            UriAnalyzer.m_schemes.add(Termin._new2723("Общероссийский классификатор организационно правовых форм", "ОКОПФ", 1, "ОКОПФ"));
            let t = null;
            UriAnalyzer.m_schemes.add(Termin._new602("WWW", MorphLang.UNKNOWN, true, 2));
            UriAnalyzer.m_schemes.add(Termin._new602("HTTP", MorphLang.UNKNOWN, true, 10));
            UriAnalyzer.m_schemes.add(Termin._new602("HTTPS", MorphLang.UNKNOWN, true, 10));
            UriAnalyzer.m_schemes.add(Termin._new602("SHTTP", MorphLang.UNKNOWN, true, 10));
            UriAnalyzer.m_schemes.add(Termin._new602("FTP", MorphLang.UNKNOWN, true, 10));
            t = Termin._new602("SKYPE", MorphLang.UNKNOWN, true, 3);
            t.add_variant("СКАЙП", true);
            t.add_variant("SKYPEID", true);
            t.add_variant("SKYPE ID", true);
            UriAnalyzer.m_schemes.add(t);
            t = Termin._new602("SWIFT", MorphLang.UNKNOWN, true, 3);
            t.add_variant("СВИФТ", true);
            UriAnalyzer.m_schemes.add(t);
            UriAnalyzer.m_schemes.add(Termin._new602("ICQ", MorphLang.UNKNOWN, true, 4));
            UriAnalyzer.m_schemes.add(Termin._new2733("International Mobile Equipment Identity", "IMEI", 5, "IMEI", true));
            t = Termin._new2733("основной государственный регистрационный номер", "ОГРН", 5, "ОГРН", true);
            t.add_variant("ОГРН ИП", true);
            UriAnalyzer.m_schemes.add(t);
            UriAnalyzer.m_schemes.add(Termin._new2733("Индивидуальный идентификационный номер", "ИИН", 5, "ИИН", true));
            UriAnalyzer.m_schemes.add(Termin._new2733("Индивидуальный номер налогоплательщика", "ИНН", 5, "ИНН", true));
            UriAnalyzer.m_schemes.add(Termin._new2733("Код причины постановки на учет", "КПП", 5, "КПП", true));
            UriAnalyzer.m_schemes.add(Termin._new2733("Банковский идентификационный код", "БИК", 5, "БИК", true));
            UriAnalyzer.m_schemes.add(Termin._new2733("основной государственный регистрационный номер индивидуального предпринимателя", "ОГРНИП", 5, "ОГРНИП", true));
            t = Termin._new2733("Страховой номер индивидуального лицевого счёта", "СНИЛС", 5, "СНИЛС", true);
            t.add_variant("Свидетельство пенсионного страхования", false);
            t.add_variant("Страховое свидетельство обязательного пенсионного страхования", false);
            t.add_variant("Страховое свидетельство", false);
            UriAnalyzer.m_schemes.add(t);
            UriAnalyzer.m_schemes.add(Termin._new2733("Общероссийский классификатор предприятий и организаций", "ОКПО", 5, "ОКПО", true));
            UriAnalyzer.m_schemes.add(Termin._new2733("Общероссийский классификатор объектов административно-территориального деления", "ОКАТО", 5, "ОКАТО", true));
            UriAnalyzer.m_schemes.add(Termin._new2733("Общероссийский классификатор территорий муниципальных образований", "ОКТМО", 5, "ОКТМО", true));
            UriAnalyzer.m_schemes.add(Termin._new2733("Общероссийский классификатор органов государственной власти и управления", "ОКОГУ", 5, "ОКОГУ", true));
            UriAnalyzer.m_schemes.add(Termin._new2733("Общероссийский классификатор Отрасли народного хозяйства", "ОКОНХ", 5, "ОКОНХ", true));
            t = Termin._new2746("РАСЧЕТНЫЙ СЧЕТ", MorphLang.UNKNOWN, true, "Р/С", 6, 20);
            t.add_abridge("Р.С.");
            t.add_abridge("Р.СЧ.");
            t.add_abridge("P.C.");
            t.add_abridge("РАСЧ.СЧЕТ");
            t.add_abridge("РАС.СЧЕТ");
            t.add_abridge("РАСЧ.СЧ.");
            t.add_abridge("РАС.СЧ.");
            t.add_abridge("Р.СЧЕТ");
            t.add_variant("СЧЕТ ПОЛУЧАТЕЛЯ", false);
            t.add_variant("СЧЕТ ОТПРАВИТЕЛЯ", false);
            t.add_variant("СЧЕТ", false);
            UriAnalyzer.m_schemes.add(t);
            t = Termin._new2747("ЛИЦЕВОЙ СЧЕТ", "Л/С", 6, 20);
            t.add_abridge("Л.С.");
            t.add_abridge("Л.СЧ.");
            t.add_abridge("Л/С");
            t.add_abridge("ЛИЦ.СЧЕТ");
            t.add_abridge("ЛИЦ.СЧ.");
            t.add_abridge("Л.СЧЕТ");
            UriAnalyzer.m_schemes.add(t);
            t = Termin._new2746("СПЕЦИАЛЬНЫЙ ЛИЦЕВОЙ СЧЕТ", MorphLang.UNKNOWN, true, "СПЕЦ/С", 6, 20);
            t.add_abridge("СПЕЦ.С.");
            t.add_abridge("СПЕЦ.СЧЕТ");
            t.add_abridge("СПЕЦ.СЧ.");
            t.add_variant("СПЕЦСЧЕТ", true);
            t.add_variant("СПЕЦИАЛЬНЫЙ СЧЕТ", true);
            UriAnalyzer.m_schemes.add(t);
            t = Termin._new2746("КОРРЕСПОНДЕНТСКИЙ СЧЕТ", MorphLang.UNKNOWN, true, "К/С", 6, 20);
            t.add_abridge("КОРР.СЧЕТ");
            t.add_abridge("КОР.СЧЕТ");
            t.add_abridge("КОРР.СЧ.");
            t.add_abridge("КОР.СЧ.");
            t.add_abridge("К.СЧЕТ");
            t.add_abridge("КОР.С.");
            t.add_abridge("К.С.");
            t.add_abridge("K.C.");
            t.add_abridge("К-С");
            t.add_abridge("К/С");
            t.add_abridge("К.СЧ.");
            t.add_abridge("К/СЧ");
            UriAnalyzer.m_schemes.add(t);
            t = Termin._new2750("КОД БЮДЖЕТНОЙ КЛАССИФИКАЦИИ", "КБК", "КБК", 6, 20, true);
            UriAnalyzer.m_schemes.add(t);
            UriItemToken.initialize();
        } catch (ex) {
            throw new Error(ex.message);
        }
        Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
        ProcessorService.register_analyzer(new UriAnalyzer());
    }
    
    static static_constructor() {
        UriAnalyzer.ANALYZER_NAME = "URI";
        UriAnalyzer.m_schemes = null;
    }
}


UriAnalyzer.static_constructor();

module.exports = UriAnalyzer
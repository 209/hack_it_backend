/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const BracketParseAttr = require("./../../core/BracketParseAttr");
const DateRangeReferent = require("./../../date/DateRangeReferent");
const MorphNumber = require("./../../../morph/MorphNumber");
const MorphClass = require("./../../../morph/MorphClass");
const MorphGender = require("./../../../morph/MorphGender");
const MorphCase = require("./../../../morph/MorphCase");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const MorphLang = require("./../../../morph/MorphLang");
const Termin = require("./../../core/Termin");
const DenominationReferent = require("./../../denomination/DenominationReferent");
const Referent = require("./../../Referent");
const TerminCollection = require("./../../core/TerminCollection");
const MailLineTypes = require("./../../mail/internal/MailLineTypes");
const PartTokenItemType = require("./PartTokenItemType");
const Explanatory = require("./../../../semantic/utils/Explanatory");
const DecreeAnalyzer = require("./../DecreeAnalyzer");
const NumberHelper = require("./../../core/NumberHelper");
const DecreePartReferent = require("./../DecreePartReferent");
const PartToken = require("./PartToken");
const MailLine = require("./../../mail/internal/MailLine");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const MetaToken = require("./../../MetaToken");
const DateReferent = require("./../../date/DateReferent");
const GetTextAttr = require("./../../core/GetTextAttr");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const DecreeTokenItemType = require("./DecreeTokenItemType");
const DecreeKind = require("./../DecreeKind");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const TextToken = require("./../../TextToken");
const PersonReferent = require("./../../person/PersonReferent");
const BracketHelper = require("./../../core/BracketHelper");
const DecreeReferent = require("./../DecreeReferent");
const PersonPropertyKind = require("./../../person/PersonPropertyKind");
const PersonPropertyReferent = require("./../../person/PersonPropertyReferent");
const OrgProfile = require("./../../org/OrgProfile");
const ReferentToken = require("./../../ReferentToken");
const NumberToken = require("./../../NumberToken");
const MiscHelper = require("./../../core/MiscHelper");
const GeoReferent = require("./../../geo/GeoReferent");
const OrganizationReferent = require("./../../org/OrganizationReferent");

/**
 * Примитив, из которых состоит декрет
 */
class DecreeToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.typ = DecreeTokenItemType.TYP;
        this.value = null;
        this.full_value = null;
        this.ref = null;
        this.children = null;
        this.is_doubtful = false;
        this.typ_kind = DecreeKind.UNDEFINED;
        this.num_year = 0;
        this.alias_token = null;
    }
    
    get is_delo() {
        if (this.begin_token.is_value("ДЕЛО", "СПРАВА")) 
            return true;
        if (this.begin_token.next !== null && this.begin_token.next.is_value("ДЕЛО", "СПРАВА")) 
            return true;
        return false;
    }
    
    toString() {
        let v = this.value;
        if (v === null) 
            v = this.ref.referent.to_string(true, this.kit.base_language, 0);
        return (this.typ.toString() + " " + v + " " + ((this.full_value != null ? this.full_value : "")));
    }
    
    /**
     * Привязать с указанной позиции один примитив
     * @param cnt 
     * @param indFrom 
     * @return 
     */
    static try_attach(t, prev = null, must_by_typ = false) {
        const DecreeChangeToken = require("./DecreeChangeToken");
        if (t === null) 
            return null;
        if (t.is_value("НАЗВАННЫЙ", null)) {
        }
        if (t.kit.is_recurce_overflow) 
            return null;
        t.kit.recurse_level++;
        let res = DecreeToken._try_attach(t, prev, 0, must_by_typ);
        t.kit.recurse_level--;
        if (res === null) {
            if (t.is_hiphen) {
                res = DecreeToken._try_attach(t.next, prev, 0, must_by_typ);
                if (res !== null && res.typ === DecreeTokenItemType.NAME) {
                    res.begin_token = t;
                    return res;
                }
            }
            if (t.is_value("ПРОЕКТ", null)) {
                res = DecreeToken._try_attach(t.next, prev, 0, false);
                if (res !== null && res.typ === DecreeTokenItemType.TYP && res.value !== null) {
                    if (res.value.includes("ЗАКОН") || !((res.end_token instanceof TextToken))) 
                        res.value = "ПРОЕКТ ЗАКОНА";
                    else 
                        res.value = "ПРОЕКТ " + (res.end_token).term;
                    res.begin_token = t;
                    return res;
                }
                else if (res !== null && res.typ === DecreeTokenItemType.NUMBER) {
                    let res1 = DecreeToken._try_attach(res.end_token.next, prev, 0, false);
                    if (res1 !== null && res1.typ === DecreeTokenItemType.TYP && (res1.end_token instanceof TextToken)) {
                        res = DecreeToken._new840(t, t, DecreeTokenItemType.TYP);
                        res.value = "ПРОЕКТ " + (res1.end_token).term;
                        return res;
                    }
                }
            }
            if (t.is_value("ИНФОРМАЦИЯ", "ІНФОРМАЦІЯ") && (t.whitespaces_after_count < 3)) {
                let dts = DecreeToken.try_attach_list(t.next, null, 10, false);
                if (dts === null || (dts.length < 2)) 
                    return null;
                let has_num = false;
                let has_own = false;
                let has_date = false;
                let has_name = false;
                for (const dt of dts) {
                    if (dt.typ === DecreeTokenItemType.NUMBER) 
                        has_num = true;
                    else if (dt.typ === DecreeTokenItemType.OWNER || dt.typ === DecreeTokenItemType.ORG) 
                        has_own = true;
                    else if (dt.typ === DecreeTokenItemType.DATE) 
                        has_date = true;
                    else if (dt.typ === DecreeTokenItemType.NAME) 
                        has_name = true;
                }
                if (has_own && ((has_num || ((has_date && has_name))))) {
                    res = DecreeToken._new840(t, t, DecreeTokenItemType.TYP);
                    res.value = "ИНФОРМАЦИЯ";
                    return res;
                }
            }
            let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) {
                if ((npt.end_token.is_value("СОБРАНИЕ", null) || npt.end_token.is_value("УЧАСТНИК", null) || npt.end_token.is_value("СОБСТВЕННИК", null)) || npt.end_token.is_value("УЧРЕДИТЕЛЬ", null)) {
                    res = DecreeToken._new840(t, npt.end_token, DecreeTokenItemType.OWNER);
                    let npt2 = NounPhraseHelper.try_parse(res.end_token.next, NounPhraseParseAttr.NO, 0, null);
                    if (npt2 !== null && npt2.morph._case.is_genitive) 
                        res.end_token = npt2.end_token;
                    res.value = MiscHelper.get_text_value(t, res.end_token, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE);
                    return res;
                }
            }
            return null;
        }
        if (res.typ === DecreeTokenItemType.DATE) {
            if (res.ref === null) 
                return null;
            let dre = Utils.as(res.ref.referent, DateReferent);
            if (dre === null) 
                return null;
        }
        if (res.begin_token.begin_char > res.end_token.end_char) {
        }
        if (res.typ === DecreeTokenItemType.NUMBER) {
            for (let tt = res.end_token.next; tt !== null; tt = tt.next) {
                if (!tt.is_comma_and || tt.is_newline_before) 
                    break;
                tt = tt.next;
                if (!((tt instanceof NumberToken))) 
                    break;
                if (tt.whitespaces_before_count > 2) 
                    break;
                let ddd = DecreeToken._try_attach(tt, res, 0, false);
                if (ddd !== null) {
                    if (ddd.typ !== DecreeTokenItemType.NUMBER) 
                        break;
                    if (res.children === null) 
                        res.children = new Array();
                    res.children.push(ddd);
                    res.end_token = ddd.end_token;
                    continue;
                }
                if ((tt).int_value !== null && (tt).int_value > 1970) 
                    break;
                if (tt.is_whitespace_after) {
                }
                else if (!tt.next.is_char_of(",.")) {
                }
                else 
                    break;
                let tmp = new StringBuilder();
                let tee = DecreeToken._try_attach_number(tt, tmp, true);
                if (res.children === null) 
                    res.children = new Array();
                let add = DecreeToken._new843(tt, tee, DecreeTokenItemType.NUMBER, tmp.toString());
                res.children.push(add);
                res.end_token = (tt = tee);
            }
        }
        if (res.typ !== DecreeTokenItemType.TYP) 
            return res;
        if (res.begin_token === res.end_token) {
            let tok = DecreeToken.m_termins.try_parse(res.begin_token.previous, TerminParseAttr.NO);
            if (tok !== null && (tok.termin.tag instanceof DecreeTokenItemType) && tok.end_token === res.end_token) {
                if ((DecreeTokenItemType.of(tok.termin.tag)) === DecreeTokenItemType.TYP) 
                    return null;
            }
        }
        if (((prev !== null && prev.typ === DecreeTokenItemType.TYP && prev.value !== null) && ((prev.value.includes("ДОГОВОР") || prev.value.includes("ДОГОВІР"))) && res.value !== null) && !res.value.includes("ДОГОВОР") && !res.value.includes("ДОГОВІР")) 
            return null;
        for (const e of DecreeToken.m_empty_adjectives) {
            if (t.is_value(e, null)) {
                res = DecreeToken._try_attach(t.next, prev, 0, false);
                if (res === null || res.typ !== DecreeTokenItemType.TYP) 
                    return null;
                break;
            }
        }
        if (res.end_token.next !== null && res.end_token.next.is_char('(')) {
            let res1 = DecreeToken._try_attach(res.end_token.next, prev, 0, false);
            if (res1 !== null && res1.end_token.is_char(')')) {
                if (res1.value === res.value && res.typ === DecreeTokenItemType.TYP) 
                    res.end_token = res1.end_token;
                else if (res.value === "ЕДИНЫЙ ОТРАСЛЕВОЙ СТАНДАРТ ЗАКУПОК" && res1.value !== null && res1.value.startsWith("ПОЛОЖЕНИЕ О ЗАКУПК")) 
                    res.end_token = res1.end_token;
            }
        }
        if (res.value !== null && res.value.includes(" ")) {
            for (const s of DecreeToken.m_all_typesru) {
                if (res.value.includes(s) && res.value !== s) {
                    if (s === "КОДЕКС") {
                        res.full_value = res.value;
                        res.value = s;
                        break;
                    }
                }
            }
        }
        if (res.value === "КОДЕКС" && res.full_value === null) {
            let t1 = res.end_token;
            for (let tt = t1.next; tt !== null; tt = tt.next) {
                if (tt.is_newline_before) 
                    break;
                let cha = DecreeChangeToken.try_attach(tt, null, false, null, false);
                if (cha !== null) 
                    break;
                if (tt === t1.next && res.begin_token.previous !== null && res.begin_token.previous.is_value("НАСТОЯЩИЙ", "СПРАВЖНІЙ")) 
                    break;
                if (!((tt instanceof TextToken))) 
                    break;
                if (tt === t1.next && tt.is_value("ЗАКОН", null)) {
                    if (tt.next !== null && ((tt.next.is_value("О", null) || tt.next.is_value("ПРО", null)))) {
                        let npt0 = NounPhraseHelper.try_parse(tt.next.next, NounPhraseParseAttr.NO, 0, null);
                        if (npt0 === null || !npt0.morph._case.is_prepositional) 
                            break;
                        t1 = npt0.end_token;
                        break;
                    }
                }
                let ooo = false;
                if (tt.morph.class0.is_preposition && tt.next !== null) {
                    if (tt.is_value("ПО", null)) 
                        tt = tt.next;
                    else if (tt.is_value("О", null) || tt.is_value("ОБ", null) || tt.is_value("ПРО", null)) {
                        ooo = true;
                        tt = tt.next;
                    }
                }
                let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                if (npt === null) 
                    break;
                if (tt === t1.next && npt.morph._case.is_genitive) 
                    t1 = (tt = npt.end_token);
                else if (ooo && npt.morph._case.is_prepositional) {
                    t1 = (tt = npt.end_token);
                    for (let ttt = tt.next; ttt !== null; ttt = ttt.next) {
                        if (!ttt.is_comma_and) 
                            break;
                        npt = NounPhraseHelper.try_parse(ttt.next, NounPhraseParseAttr.NO, 0, null);
                        if (npt === null || !npt.morph._case.is_prepositional) 
                            break;
                        t1 = (tt = npt.end_token);
                        if (ttt.is_and) 
                            break;
                        ttt = npt.end_token;
                    }
                }
                else 
                    break;
            }
            if (t1 !== res.end_token) {
                res.end_token = t1;
                res.full_value = MiscHelper.get_text_value_of_meta_token(res, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE);
            }
        }
        if (res.value !== null && ((res.value.startsWith("ВЕДОМОСТИ СЪЕЗДА") || res.value.startsWith("ВІДОМОСТІ ЗЇЗДУ")))) {
            let tt = res.end_token.next;
            if (tt !== null && (tt.get_referent() instanceof GeoReferent)) {
                res.ref = Utils.as(tt, ReferentToken);
                res.end_token = tt;
                tt = tt.next;
            }
            if (tt !== null && tt.is_and) 
                tt = tt.next;
            if (tt !== null && (tt.get_referent() instanceof OrganizationReferent)) {
                res.end_token = tt;
                tt = tt.next;
            }
        }
        return res;
    }
    
    static _try_attach(t, prev, lev, must_by_typ = false) {
        if (t === null || lev > 4) 
            return null;
        if (prev !== null && prev.typ === DecreeTokenItemType.TYP) {
            while (t.is_char_of(":-") && t.next !== null && !t.is_newline_after) {
                t = t.next;
            }
        }
        if (prev !== null) {
            if (t.is_value("ПРИ", "ЗА") && t.next !== null) 
                t = t.next;
        }
        if ((!must_by_typ && t.is_value("МЕЖДУ", "МІЖ") && (t.next instanceof ReferentToken)) && t.next.next !== null) {
            let t11 = t.next.next;
            let is_br = false;
            if ((t11.is_char('(') && (t11.next instanceof TextToken) && t11.next.next !== null) && t11.next.next.is_char(')')) {
                t11 = t11.next.next.next;
                is_br = true;
            }
            if (t11 !== null && t11.is_comma_and && (t11.next instanceof ReferentToken)) {
                let rr = DecreeToken._new840(t, t11.next, DecreeTokenItemType.BETWEEN);
                rr.children = new Array();
                rr.children.push(DecreeToken._new845(t.next, t.next, DecreeTokenItemType.OWNER, Utils.as(t.next, ReferentToken)));
                rr.children.push(DecreeToken._new845(t11.next, t11.next, DecreeTokenItemType.OWNER, Utils.as(t11.next, ReferentToken)));
                for (t = rr.end_token.next; t !== null; t = t.next) {
                    if ((is_br && t.is_char('(') && (t.next instanceof TextToken)) && t.next.next !== null && t.next.next.is_char(')')) {
                        t = t.next.next;
                        rr.end_token = t;
                        rr.children[rr.children.length - 1].end_token = t;
                        continue;
                    }
                    if ((t.is_comma_and && t.next !== null && (t.next instanceof ReferentToken)) && !((t.next.get_referent() instanceof DateReferent))) {
                        rr.children.push(DecreeToken._new845(t.next, t.next, DecreeTokenItemType.OWNER, Utils.as(t.next, ReferentToken)));
                        t = rr.end_token = t.next;
                        continue;
                    }
                    break;
                }
                return rr;
            }
        }
        let r = t.get_referent();
        if (r instanceof OrganizationReferent) {
            let rt = Utils.as(t, ReferentToken);
            let org = Utils.as(r, OrganizationReferent);
            let res1 = null;
            if (org.contains_profile(OrgProfile.MEDIA)) {
                let tt1 = rt.begin_token;
                if (BracketHelper.can_be_start_of_sequence(tt1, false, false)) 
                    tt1 = tt1.next;
                res1 = DecreeToken._try_attach(tt1, prev, lev + 1, false);
                if (res1 !== null && res1.typ === DecreeTokenItemType.TYP) 
                    res1.begin_token = res1.end_token = t;
                else 
                    res1 = null;
            }
            if (res1 === null && org.contains_profile(OrgProfile.PRESS)) {
                res1 = DecreeToken._new840(t, t, DecreeTokenItemType.TYP);
                res1.value = MiscHelper.get_text_value_of_meta_token((Utils.as(t, ReferentToken)), GetTextAttr.NO);
            }
            if (res1 !== null) {
                let t11 = res1.end_token;
                if (t11.get_referent() instanceof GeoReferent) 
                    res1.ref = Utils.as(t11, ReferentToken);
                else if (t11 instanceof MetaToken) 
                    t11 = (t11).end_token;
                if (t11.get_referent() instanceof GeoReferent) 
                    res1.ref = Utils.as(t11, ReferentToken);
                else if (BracketHelper.is_bracket(t11, false) && (t11.previous.get_referent() instanceof GeoReferent)) 
                    res1.ref = Utils.as(t11.previous, ReferentToken);
                return res1;
            }
        }
        if (r !== null && !must_by_typ) {
            if (r instanceof GeoReferent) 
                return DecreeToken._new849(t, t, DecreeTokenItemType.TERR, Utils.as(t, ReferentToken), r.to_string(true, t.kit.base_language, 0));
            if (r instanceof DateReferent) {
                if (prev !== null && prev.typ === DecreeTokenItemType.TYP && prev.typ_kind === DecreeKind.STANDARD) {
                    let ree = DecreeToken.try_attach((t).begin_token, prev, false);
                    if ((ree !== null && ree.typ === DecreeTokenItemType.NUMBER && ree.num_year > 0) && ((ree.end_token === (t).end_token || ree.end_token.is_char('*')))) {
                        if ((t.next instanceof TextToken) && t.next.is_char('*')) 
                            t = t.next;
                        ree.begin_token = ree.end_token = t;
                        return ree;
                    }
                }
                if (t.previous !== null && t.previous.morph.class0.is_preposition && t.previous.is_value("ДО", null)) 
                    return null;
                return DecreeToken._new845(t, t, DecreeTokenItemType.DATE, Utils.as(t, ReferentToken));
            }
            if (r instanceof OrganizationReferent) {
                if ((t.next !== null && t.next.is_value("В", "У") && t.next.next !== null) && t.next.next.is_value("СОСТАВ", "СКЛАДІ")) 
                    return null;
                return DecreeToken._new849(t, t, DecreeTokenItemType.ORG, Utils.as(t, ReferentToken), r.toString());
            }
            if (r instanceof PersonReferent) {
                let ok = false;
                if (prev !== null && ((prev.typ === DecreeTokenItemType.TYP || prev.typ === DecreeTokenItemType.DATE))) 
                    ok = true;
                else if (t.next !== null && (t.next.get_referent() instanceof DecreeReferent)) 
                    ok = true;
                else {
                    let ne = DecreeToken._try_attach(t.next, null, lev + 1, false);
                    if (ne !== null && ((ne.typ === DecreeTokenItemType.TYP || ne.typ === DecreeTokenItemType.DATE || ne.typ === DecreeTokenItemType.OWNER))) 
                        ok = true;
                }
                if (ok) {
                    let prop = Utils.as(r.get_slot_value(PersonReferent.ATTR_ATTR), PersonPropertyReferent);
                    if (prop !== null && ((prop.kind === PersonPropertyKind.BOSS || (Utils.notNull(prop.name, "")).startsWith("глава")))) 
                        return DecreeToken._new845(t, t, DecreeTokenItemType.OWNER, new ReferentToken(prop, t, t));
                }
            }
            if (r instanceof PersonPropertyReferent) 
                return DecreeToken._new845(t, t, DecreeTokenItemType.OWNER, new ReferentToken(r, t, t));
            if (r instanceof DenominationReferent) {
                let s = r.toString();
                if (s.length > 1 && ((s[0] === 'A' || s[0] === 'А')) && Utils.isDigit(s[1])) 
                    return DecreeToken._new843(t, t, DecreeTokenItemType.NUMBER, s);
            }
            return null;
        }
        if (!must_by_typ) {
            let tdat = null;
            if (t.is_value("ОТ", "ВІД") || t.is_value("ПРИНЯТЬ", "ПРИЙНЯТИ")) 
                tdat = t.next;
            else if (t.is_value("ВВЕСТИ", null) || t.is_value("ВВОДИТЬ", "ВВОДИТИ")) {
                tdat = t.next;
                if (tdat !== null && tdat.is_value("В", "У")) 
                    tdat = tdat.next;
                if (tdat !== null && tdat.is_value("ДЕЙСТВИЕ", "ДІЯ")) 
                    tdat = tdat.next;
            }
            if (tdat !== null) {
                if (tdat.next !== null && tdat.morph.class0.is_preposition) 
                    tdat = tdat.next;
                if (tdat.get_referent() instanceof DateReferent) 
                    return DecreeToken._new845(t, tdat, DecreeTokenItemType.DATE, Utils.as(tdat, ReferentToken));
                let dr = t.kit.process_referent("DATE", tdat);
                if (dr !== null) 
                    return DecreeToken._new845(t, dr.end_token, DecreeTokenItemType.DATE, dr);
            }
            if (t.is_value("НА", null) && t.next !== null && (t.next.get_referent() instanceof DateRangeReferent)) 
                return DecreeToken._new845(t, t.next, DecreeTokenItemType.DATERANGE, Utils.as(t.next, ReferentToken));
            if (t.is_char('(')) {
                let tt = DecreeToken._is_edition(t.next);
                if (tt !== null) {
                    let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                    if (br !== null) 
                        return DecreeToken._new840(t, br.end_token, DecreeTokenItemType.EDITION);
                }
                if (t.next !== null && t.next.is_value("ПРОЕКТ", null)) 
                    return DecreeToken._new843(t.next, t.next, DecreeTokenItemType.TYP, "ПРОЕКТ");
                if ((t.next !== null && (t.next.get_referent() instanceof DateRangeReferent) && t.next.next !== null) && t.next.next.is_char(')')) 
                    return DecreeToken._new845(t, t.next.next, DecreeTokenItemType.DATERANGE, Utils.as(t.next, ReferentToken));
            }
            else {
                let tt = DecreeToken._is_edition(t);
                if (tt !== null) 
                    tt = tt.next;
                if (tt !== null) {
                    let xxx = DecreeToken.try_attach(tt, null, false);
                    if (xxx !== null) 
                        return DecreeToken._new840(t, tt.previous, DecreeTokenItemType.EDITION);
                }
            }
            if (t instanceof NumberToken) {
                if (prev !== null && ((prev.typ === DecreeTokenItemType.TYP || prev.typ === DecreeTokenItemType.DATE))) {
                    let tmp = new StringBuilder();
                    let t11 = DecreeToken._try_attach_number(t, tmp, false);
                    if (t11 !== null) {
                        let ne = DecreeToken._try_attach(t11.next, null, lev + 1, false);
                        let valnum = tmp.toString();
                        if (ne !== null && ((ne.typ === DecreeTokenItemType.DATE || ne.typ === DecreeTokenItemType.OWNER || ne.typ === DecreeTokenItemType.NAME))) 
                            return DecreeToken._new843(t, t11, DecreeTokenItemType.NUMBER, valnum);
                        if (LanguageHelper.ends_with_ex(valnum, "ФЗ", "ФКЗ", null, null)) 
                            return DecreeToken._new843(t, t11, DecreeTokenItemType.NUMBER, valnum);
                        let year = 0;
                        if (prev.typ === DecreeTokenItemType.TYP) {
                            let ok = false;
                            if (prev.typ_kind === DecreeKind.STANDARD) {
                                ok = true;
                                if (t11.next !== null && t11.next.is_char('*')) 
                                    t11 = t11.next;
                                if (Utils.endsWithString(valnum, "(E)", true)) 
                                    valnum = valnum.substring(0, 0 + valnum.length - 3).trim();
                                while (true) {
                                    if ((t11.whitespaces_after_count < 2) && (t11.next instanceof NumberToken)) {
                                        tmp.length = 0;
                                        let t22 = DecreeToken._try_attach_number(t11.next, tmp, false);
                                        if (t22 === null) 
                                            break;
                                        valnum = (valnum + "." + tmp.toString());
                                        t11 = t22;
                                    }
                                    else 
                                        break;
                                }
                                for (let ii = valnum.length - 1; ii >= 0; ii--) {
                                    if (!Utils.isDigit(valnum[ii])) {
                                        if (ii === valnum.length || ii === 0) 
                                            break;
                                        if ((valnum[ii] !== '-' && valnum[ii] !== ':' && valnum[ii] !== '.') && valnum[ii] !== '/' && valnum[ii] !== '\\') 
                                            break;
                                        let nn = 0;
                                        let ss = valnum.substring(ii + 1);
                                        if (ss.length !== 2 && ss.length !== 4) 
                                            break;
                                        if (ss[0] === '0' && ss.length === 2) 
                                            nn = 2000 + (((ss.charCodeAt(1)) - ('0'.charCodeAt(0))));
                                        else {
                                            let wrapnn864 = new RefOutArgWrapper();
                                            let inoutres865 = Utils.tryParseInt(ss, wrapnn864);
                                            nn = wrapnn864.value;
                                            if (inoutres865) {
                                                if (nn > 50 && nn <= 99) 
                                                    nn += 1900;
                                                else if (ss.length === 2 && (((2000 + nn) <= Utils.now().getFullYear()))) 
                                                    nn += 2000;
                                            }
                                        }
                                        if (nn >= 1950 && nn <= Utils.now().getFullYear()) {
                                            year = nn;
                                            valnum = valnum.substring(0, 0 + ii);
                                        }
                                        break;
                                    }
                                }
                                valnum = Utils.replaceString(valnum, '-', '.');
                                if (year < 1) {
                                    if (t11.next !== null && t11.next.is_hiphen) {
                                        if ((t11.next.next instanceof NumberToken) && (t11.next.next).int_value !== null) {
                                            let nn = (t11.next.next).int_value;
                                            if (nn > 50 && nn <= 99) 
                                                nn += 1900;
                                            if (nn >= 1950 && nn <= Utils.now().getFullYear()) {
                                                year = nn;
                                                t11 = t11.next.next;
                                            }
                                        }
                                    }
                                }
                            }
                            else if (prev.begin_token === prev.end_token && prev.begin_token.chars.is_all_upper && ((prev.begin_token.is_value("ФЗ", null) || prev.begin_token.is_value("ФКЗ", null)))) 
                                ok = true;
                            if (ok) 
                                return DecreeToken._new866(t, t11, DecreeTokenItemType.NUMBER, valnum, year);
                        }
                    }
                    if ((t).int_value !== null) {
                        let val = (t).int_value;
                        if (val > 1910 && (val < 2030)) 
                            return DecreeToken._new843(t, t, DecreeTokenItemType.DATE, val.toString());
                    }
                }
                let rt = t.kit.process_referent("PERSON", t);
                if (rt !== null) {
                    let pr = Utils.as(rt.referent, PersonPropertyReferent);
                    if (pr !== null) 
                        return DecreeToken._new868(rt.begin_token, rt.end_token, DecreeTokenItemType.OWNER, rt, rt.morph);
                }
                if (t.next !== null && t.next.chars.is_letter) {
                    let res1 = DecreeToken._try_attach(t.next, prev, lev + 1, false);
                    if (res1 !== null && res1.typ === DecreeTokenItemType.OWNER) {
                        res1.begin_token = t;
                        return res1;
                    }
                }
            }
        }
        let toks = null;
        if (!((t instanceof TextToken))) {
            if ((t instanceof NumberToken) && (t).value === "100") {
                if ((t).begin_token.is_value("СТО", null) && (t).begin_token.chars.is_all_upper) {
                    toks = DecreeToken.m_termins.try_parse_all((t).begin_token, TerminParseAttr.NO, 0);
                    if (toks !== null && toks.length === 1) 
                        toks[0].begin_token = toks[0].end_token = t;
                }
            }
            if (toks === null) 
                return null;
        }
        else 
            toks = DecreeToken.m_termins.try_parse_all(t, TerminParseAttr.NO, 0);
        if (toks !== null) {
            for (const tok of toks) {
                if (tok.end_token.is_char('.') && tok.begin_token !== tok.end_token) 
                    tok.end_token = tok.end_token.previous;
                if (tok.termin.canonic_text === "РЕГИСТРАЦИЯ" || tok.termin.canonic_text === "РЕЄСТРАЦІЯ") {
                    if (tok.end_token.next !== null && ((tok.end_token.next.is_value("В", null) || tok.end_token.next.is_value("ПО", null)))) 
                        tok.end_token = tok.end_token.next;
                }
                let doubt = false;
                if ((tok.end_char - tok.begin_char) < 3) {
                    if (t.is_value("СП", null)) {
                        if (!((t.next instanceof NumberToken))) {
                            if (MiscHelper.check_number_prefix(t.next) === null) 
                                return null;
                        }
                    }
                    doubt = true;
                    if (tok.end_token.next === null || !tok.chars.is_all_upper) {
                    }
                    else {
                        r = tok.end_token.next.get_referent();
                        if (r instanceof GeoReferent) 
                            doubt = false;
                    }
                }
                if (tok.begin_token === tok.end_token && (tok.length_char < 4) && toks.length > 1) {
                    let cou = 0;
                    for (let tt = t.previous; tt !== null && (cou < 500); tt = tt.previous,cou++) {
                        let dr = Utils.as(tt.get_referent(), DecreeReferent);
                        if (dr === null) 
                            continue;
                        for (const tok1 of toks) {
                            if (dr.find_slot(DecreeReferent.ATTR_NAME, tok1.termin.canonic_text, true) !== null) 
                                return DecreeToken._new869(tok.begin_token, tok.end_token, DecreeTokenItemType.of(tok1.termin.tag), tok1.termin.canonic_text, tok1.morph);
                        }
                    }
                    if (tok.begin_token.is_value("ТК", null) && tok.termin.canonic_text.startsWith("ТРУД")) {
                        let has_tamoz = false;
                        cou = 0;
                        for (let tt = t.previous; tt !== null && (cou < 500); tt = tt.previous,cou++) {
                            if (tt.is_value("ТАМОЖНЯ", null) || tt.is_value("ТАМОЖЕННЫЙ", null) || tt.is_value("ГРАНИЦА", null)) {
                                has_tamoz = true;
                                break;
                            }
                        }
                        if (has_tamoz) 
                            continue;
                        cou = 0;
                        for (let tt = t.next; tt !== null && (cou < 500); tt = tt.next,cou++) {
                            if (tt.is_value("ТАМОЖНЯ", null) || tt.is_value("ТАМОЖЕННЫЙ", null) || tt.is_value("ГРАНИЦА", null)) {
                                has_tamoz = true;
                                break;
                            }
                        }
                        if (has_tamoz) 
                            continue;
                    }
                }
                if (doubt && tok.chars.is_all_upper) {
                    if (PartToken.is_part_before(tok.begin_token)) 
                        doubt = false;
                    else if (tok.get_source_text().endsWith("ТС")) 
                        doubt = false;
                }
                let res = DecreeToken._new870(tok.begin_token, tok.end_token, DecreeTokenItemType.of(tok.termin.tag), tok.termin.canonic_text, tok.morph, doubt);
                if (tok.termin.tag2 instanceof DecreeKind) 
                    res.typ_kind = DecreeKind.of(tok.termin.tag2);
                if (res.value === "ГОСТ" && tok.end_token.next !== null) {
                    if (tok.end_token.next.is_value("Р", null) || tok.end_token.next.is_value("P", null)) 
                        res.end_token = tok.end_token.next;
                    else {
                        let g = Utils.as(tok.end_token.next.get_referent(), GeoReferent);
                        if (g !== null && ((g.alpha2 === "RU" || g.alpha2 === "SU"))) 
                            res.end_token = tok.end_token.next;
                    }
                }
                if (res.value === "КОНСТИТУЦИЯ" && tok.end_token.next !== null && tok.end_token.next.is_char('(')) {
                    let npt = NounPhraseHelper.try_parse(tok.end_token.next.next, NounPhraseParseAttr.NO, 0, null);
                    if ((npt !== null && npt.end_token.is_value("ЗАКОН", null) && npt.end_token.next !== null) && npt.end_token.next.is_char(')')) 
                        res.end_token = npt.end_token.next;
                }
                if (((typeof tok.termin.tag2 === 'string' || tok.termin.tag2 instanceof String)) && res.typ === DecreeTokenItemType.TYP) {
                    res.full_value = tok.termin.canonic_text;
                    res.value = Utils.asString(tok.termin.tag2);
                    res.is_doubtful = false;
                }
                if (res.typ_kind === DecreeKind.STANDARD) {
                    let cou = 0;
                    for (let tt = res.end_token.next; tt !== null && (cou < 3); tt = tt.next,cou++) {
                        if (tt.whitespaces_before_count > 2) 
                            break;
                        let tok2 = DecreeToken.m_termins.try_parse(tt, TerminParseAttr.NO);
                        if (tok2 !== null) {
                            if ((tok2.termin.tag2 instanceof DecreeKind) && (DecreeKind.of(tok2.termin.tag2)) === DecreeKind.STANDARD) {
                                tt = res.end_token = tok2.end_token;
                                res.is_doubtful = false;
                                if (res.value === "СТАНДАРТ") 
                                    res.value = tok2.termin.canonic_text;
                                continue;
                            }
                        }
                        if ((tt instanceof TextToken) && (tt.length_char < 4) && tt.chars.is_all_upper) {
                            res.end_token = tt;
                            continue;
                        }
                        if (((tt.is_char_of("/\\") || tt.is_hiphen)) && (tt.next instanceof TextToken) && tt.next.chars.is_all_upper) {
                            tt = tt.next;
                            res.end_token = tt;
                            continue;
                        }
                        break;
                    }
                    if (res.value === "СТАНДАРТ") 
                        res.is_doubtful = true;
                    if (res.is_doubtful && !res.is_newline_after) {
                        let num1 = DecreeToken.try_attach(res.end_token.next, res, false);
                        if (num1 !== null && num1.typ === DecreeTokenItemType.NUMBER) {
                            if (num1.num_year > 0) 
                                res.is_doubtful = false;
                        }
                    }
                    if (res.value === "СТАНДАРТ" && res.is_doubtful) 
                        return null;
                }
                return res;
            }
        }
        if (((t.morph.class0.is_adjective && ((t.is_value("УКАЗАННЫЙ", "ЗАЗНАЧЕНИЙ") || t.is_value("ВЫШЕУКАЗАННЫЙ", "ВИЩЕВКАЗАНИЙ") || t.is_value("НАЗВАННЫЙ", "НАЗВАНИЙ"))))) || ((t.morph.class0.is_pronoun && (((t.is_value("ЭТОТ", "ЦЕЙ") || t.is_value("ТОТ", "ТОЙ") || t.is_value("ДАННЫЙ", "ДАНИЙ")) || t.is_value("САМЫЙ", "САМИЙ")))))) {
            let t11 = t.next;
            if (t11 !== null && t11.is_value("ЖЕ", null)) 
                t11 = t11.next;
            let nnn = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
            let tok = null;
            if ((((tok = DecreeToken.m_termins.try_parse(t11, TerminParseAttr.NO)))) !== null) {
                if ((((tok.morph.number.value()) & (MorphNumber.PLURAL.value()))) === (MorphNumber.UNDEFINED.value()) || ((nnn !== null && nnn.morph.number === MorphNumber.SINGULAR))) {
                    let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
                    if (npt !== null && (((npt.morph.number.value()) & (MorphNumber.PLURAL.value()))) !== (MorphNumber.UNDEFINED.value())) {
                    }
                    else {
                        let te = DecreeToken._find_back_typ(t.previous, tok.termin.canonic_text);
                        if (te !== null) 
                            return DecreeToken._new845(t, tok.end_token, DecreeTokenItemType.DECREEREF, te);
                    }
                }
            }
        }
        if (t.morph.class0.is_adjective && t.is_value("НАСТОЯЩИЙ", "СПРАВЖНІЙ")) {
            let tok = null;
            if ((((tok = DecreeToken.m_termins.try_parse(t.next, TerminParseAttr.NO)))) !== null) 
                return DecreeToken._new845(t, tok.end_token, DecreeTokenItemType.DECREEREF, null);
        }
        if (must_by_typ) 
            return null;
        if ((((t instanceof TextToken) && prev !== null && prev.typ === DecreeTokenItemType.TYP) && t.chars.is_all_upper && t.length_char >= 2) && t.length_char <= 5) {
            if (((prev.value === "ТЕХНИЧЕСКИЕ УСЛОВИЯ" && t.next !== null && t.next.is_char('.')) && (t.next.next instanceof NumberToken) && t.next.next.next !== null) && t.next.next.next.is_char('.') && (t.next.next.next.next instanceof NumberToken)) {
                let res = DecreeToken._new843(t, t, DecreeTokenItemType.NUMBER, (t).term);
                t = t.next.next;
                res.value = (res.value + "." + t.get_source_text() + "." + t.next.next.get_source_text());
                res.end_token = (t = t.next.next);
                if ((t.whitespaces_after_count < 2) && t.next !== null && t.next.is_value("ТУ", null)) 
                    res.end_token = res.end_token.next;
                return res;
            }
        }
        if ((((((t instanceof TextToken) && t.length_char === 4 && t.chars.is_all_upper) && t.next !== null && !t.is_whitespace_after) && t.next.is_char('.') && (t.next.next instanceof NumberToken)) && !t.next.is_whitespace_after && t.next.next.next !== null) && t.next.next.next.is_char('.') && (t.next.next.next.next instanceof NumberToken)) {
            if (t.next.next.next.next.next !== null && t.next.next.next.next.next.is_value("ТУ", null)) {
                let res = DecreeToken._new843(t, t.next.next.next.next, DecreeTokenItemType.NUMBER, (t).term);
                res.value = (t.get_source_text() + "." + t.next.next.get_source_text() + "." + t.next.next.next.next.get_source_text());
                return res;
            }
        }
        if (t.morph.class0.is_adjective) {
            let dt = DecreeToken._try_attach(t.next, prev, lev + 1, false);
            if (dt !== null && dt.ref === null) {
                let rt = t.kit.process_referent("GEO", t);
                if (rt !== null) {
                    dt.ref = rt;
                    dt.begin_token = t;
                    return dt;
                }
            }
            let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null && npt.internal_noun !== null) 
                npt = null;
            if ((npt !== null && dt !== null && dt.typ === DecreeTokenItemType.TYP) && dt.value === "КОДЕКС") {
                dt.value = npt.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
                dt.begin_token = t;
                dt.is_doubtful = true;
                return dt;
            }
            if (npt !== null && ((npt.end_token.is_value("ДОГОВОР", null) || npt.end_token.is_value("КОНТРАКТ", null)))) {
                dt = DecreeToken._new840(t, npt.end_token, DecreeTokenItemType.TYP);
                dt.value = npt.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
                if (t.get_morph_class_in_dictionary().is_verb) 
                    dt.value = npt.end_token.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
                return dt;
            }
            let try_npt = false;
            let tok = null;
            if (!t.chars.is_all_lower) 
                try_npt = true;
            else 
                for (const a of DecreeToken.m_std_adjectives) {
                    if (t.is_value(a, null)) {
                        try_npt = true;
                        break;
                    }
                }
            if (try_npt) {
                if (npt !== null) {
                    if (npt.end_token.is_value("ГАЗЕТА", null) || npt.end_token.is_value("БЮЛЛЕТЕНЬ", "БЮЛЕТЕНЬ")) 
                        return DecreeToken._new869(t, npt.end_token, DecreeTokenItemType.TYP, npt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false), npt.morph);
                    if (npt.adjectives.length > 0 && npt.end_token.get_morph_class_in_dictionary().is_noun) {
                        if ((((tok = DecreeToken.m_termins.try_parse(npt.end_token, TerminParseAttr.NO)))) !== null) {
                            if (npt.begin_token.is_value("ОБЩИЙ", "ЗАГАЛЬНИЙ")) 
                                return null;
                            return DecreeToken._new877(npt.begin_token, tok.end_token, npt.get_normal_case_text(null, true, MorphGender.UNDEFINED, false), npt.morph);
                        }
                    }
                    if (prev !== null && prev.typ === DecreeTokenItemType.TYP) {
                        if (npt.end_token.is_value("КОЛЛЕГИЯ", "КОЛЕГІЯ")) {
                            let res1 = DecreeToken._new869(t, npt.end_token, DecreeTokenItemType.OWNER, npt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false), npt.morph);
                            for (t = npt.end_token.next; t !== null; t = t.next) {
                                if (t.is_and || t.morph.class0.is_preposition) 
                                    continue;
                                let re = t.get_referent();
                                if ((re instanceof GeoReferent) || (re instanceof OrganizationReferent)) {
                                    res1.end_token = t;
                                    continue;
                                }
                                else if (re !== null) 
                                    break;
                                let dt1 = DecreeToken._try_attach(t, res1, lev + 1, false);
                                if (dt1 !== null && dt1.typ !== DecreeTokenItemType.UNKNOWN) {
                                    if (dt1.typ !== DecreeTokenItemType.OWNER) 
                                        break;
                                    t = res1.end_token = dt1.end_token;
                                    continue;
                                }
                                let npt1 = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
                                if (npt1 === null) 
                                    break;
                                t = res1.end_token = npt1.end_token;
                            }
                            if (res1.end_token !== npt.end_token) 
                                res1.value = (res1.value + " " + MiscHelper.get_text_value(npt.end_token.next, res1.end_token, GetTextAttr.KEEPQUOTES));
                            return res1;
                        }
                    }
                }
            }
        }
        let t1 = null;
        let t0 = t;
        let num = false;
        if ((((t1 = MiscHelper.check_number_prefix(t)))) !== null) 
            num = true;
        else if (DecreeToken._is_jus_number(t)) 
            t1 = t;
        if (t1 !== null) {
            if ((t1.whitespaces_before_count < 15) && ((!t1.is_newline_before || (t1 instanceof NumberToken) || DecreeToken._is_jus_number(t1)))) {
                let tmp = new StringBuilder();
                let t11 = DecreeToken._try_attach_number(t1, tmp, num);
                if (t11 !== null) {
                    if (t11.next !== null && t11.next.is_value("ДСП", null)) {
                        t11 = t11.next;
                        tmp.append("ДСП");
                    }
                    return DecreeToken._new843(t0, t11, DecreeTokenItemType.NUMBER, tmp.toString());
                }
            }
            if (t1.is_newline_before && num) 
                return DecreeToken._new840(t0, t1.previous, DecreeTokenItemType.NUMBER);
        }
        if (BracketHelper.can_be_start_of_sequence(t, false, false)) {
            if (BracketHelper.can_be_start_of_sequence(t, true, false) && ((((t.next.is_value("О", null) || t.next.is_value("ОБ", null) || t.next.is_value("ПРО", null)) || t.next.is_value("ПО", null) || t.chars.is_capital_upper) || ((prev !== null && (t.next instanceof TextToken) && ((prev.typ === DecreeTokenItemType.DATE || prev.typ === DecreeTokenItemType.NUMBER))))))) {
                let br = BracketHelper.try_parse(t, BracketParseAttr.CANCONTAINSVERBS, 200);
                if (br !== null) {
                    let tt = br.end_token;
                    if (tt.previous !== null && tt.previous.is_char('>')) 
                        tt = tt.previous;
                    if ((tt.is_char('>') && (tt.previous instanceof NumberToken) && tt.previous.previous !== null) && tt.previous.previous.is_char('<')) {
                        tt = tt.previous.previous.previous;
                        if (tt === null || tt.begin_char <= br.begin_char) 
                            return null;
                        br.end_token = tt;
                    }
                    let tt1 = DecreeToken._try_attach_std_change_name(t.next);
                    if (tt1 !== null && tt1.end_char > br.end_char) 
                        br.end_token = tt1;
                    else 
                        for (tt = br.begin_token.next; tt !== null && (tt.end_char < br.end_char); tt = tt.next) {
                            if (tt.is_char('(')) {
                                let dt = DecreeToken.try_attach(tt.next, null, false);
                                if (dt === null && BracketHelper.can_be_start_of_sequence(tt.next, true, false)) 
                                    dt = DecreeToken.try_attach(tt.next.next, null, false);
                                if (dt !== null && dt.typ === DecreeTokenItemType.TYP) {
                                    if (DecreeToken.get_kind(dt.value) === DecreeKind.PUBLISHER) {
                                        br.end_token = tt.previous;
                                        break;
                                    }
                                }
                            }
                        }
                    return DecreeToken._new843(br.begin_token, br.end_token, DecreeTokenItemType.NAME, MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO));
                }
                else {
                    let tt1 = DecreeToken._try_attach_std_change_name(t.next);
                    if (tt1 !== null) 
                        return DecreeToken._new843(t, tt1, DecreeTokenItemType.NAME, MiscHelper.get_text_value(t, tt1, GetTextAttr.NO));
                }
            }
            else if (t.is_char('(')) {
                let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (br !== null) {
                    if (!t.next.is_value("ДАЛЕЕ", "ДАЛІ")) {
                        if ((br.end_char - br.begin_char) < 30) 
                            return DecreeToken._new843(br.begin_token, br.end_token, DecreeTokenItemType.MISC, MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO));
                    }
                }
            }
        }
        if (t.inner_bool) {
            let rt = t.kit.process_referent("PERSON", t);
            if (rt !== null) {
                let pr = Utils.as(rt.referent, PersonPropertyReferent);
                if (pr === null) 
                    return null;
                if (pr.kind !== PersonPropertyKind.UNDEFINED) {
                }
                else if (Utils.startsWithString(pr.name, "ГРАЖДАН", true) || Utils.startsWithString(pr.name, "ГРОМАДЯН", true)) 
                    return null;
                return DecreeToken._new868(rt.begin_token, rt.end_token, DecreeTokenItemType.OWNER, rt, rt.morph);
            }
        }
        if (t.is_value("О", null) || t.is_value("ОБ", null) || t.is_value("ПРО", null)) {
            let et = null;
            if ((t.next !== null && t.next.is_value("ВНЕСЕНИЕ", "ВНЕСЕННЯ") && t.next.next !== null) && t.next.next.is_value("ИЗМЕНЕНИЕ", "ЗМІНА")) 
                et = t.next;
            else if (t.next !== null && t.next.is_value("ПОПРАВКА", null)) 
                et = t.next;
            else if (t.next !== null && (t.next.get_referent() instanceof OrganizationReferent)) 
                et = t.next;
            if (et !== null && et.next !== null && et.next.morph.class0.is_preposition) 
                et = et.next;
            if (et !== null && et.next !== null) {
                let dts2 = DecreeToken.try_attach_list(et.next, null, 10, false);
                if (dts2 !== null && dts2[0].typ === DecreeTokenItemType.TYP) {
                    et = dts2[0].end_token;
                    if (dts2.length > 1 && dts2[1].typ === DecreeTokenItemType.TERR) 
                        et = dts2[1].end_token;
                    return DecreeToken._new843(t, et, DecreeTokenItemType.NAME, MiscHelper.get_text_value(t, et, GetTextAttr.NO));
                }
                if (et.next.is_char_of(",(") || (et instanceof ReferentToken)) 
                    return DecreeToken._new843(t, et, DecreeTokenItemType.NAME, MiscHelper.get_text_value(t, et, GetTextAttr.NO));
            }
            else if (et !== null) 
                return DecreeToken._new843(t, et, DecreeTokenItemType.NAME, MiscHelper.get_text_value(t, et, GetTextAttr.NO));
            return null;
        }
        if (t.is_value("ПРИЛОЖЕНИЕ", "ДОДАТОК")) 
            return null;
        if (prev !== null && prev.typ === DecreeTokenItemType.TYP) {
            if (t.is_value("ПРАВИТЕЛЬСТВО", "УРЯД") || t.is_value("ПРЕЗИДЕНТ", null)) 
                return DecreeToken._new888(t, t, DecreeTokenItemType.OWNER, t.morph, t.get_normal_case_text(null, false, MorphGender.UNDEFINED, false));
        }
        let npt2 = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.PARSEPREPOSITION, 0, null);
        if (npt2 !== null) {
            if (npt2.end_token.is_value("ПОЗИЦИЯ", null)) 
                return null;
        }
        if ((((t.chars.is_cyrillic_letter && ((!t.chars.is_all_lower || ((prev !== null && prev.typ === DecreeTokenItemType.UNKNOWN))))) || t.is_value("ЗАСЕДАНИЕ", "ЗАСІДАННЯ") || t.is_value("СОБРАНИЕ", "ЗБОРИ")) || t.is_value("ПЛЕНУМ", null) || t.is_value("КОЛЛЕГИЯ", "КОЛЕГІЯ")) || t.is_value("АДМИНИСТРАЦИЯ", "АДМІНІСТРАЦІЯ")) {
            let ok = false;
            if (prev !== null && ((prev.typ === DecreeTokenItemType.TYP || prev.typ === DecreeTokenItemType.OWNER || prev.typ === DecreeTokenItemType.ORG))) 
                ok = true;
            else if (prev !== null && prev.typ === DecreeTokenItemType.UNKNOWN && !t.morph.class0.is_verb) 
                ok = true;
            else if (t.next !== null && (t.next.get_referent() instanceof GeoReferent) && !t.is_value("ИМЕНЕМ", null)) 
                ok = true;
            else if ((t.previous !== null && t.previous.is_char(',') && t.previous.previous !== null) && (t.previous.previous.get_referent() instanceof DecreeReferent)) 
                ok = true;
            if (ok) {
                if (PartToken.try_attach(t, null, false, false) !== null) 
                    ok = false;
            }
            if (ok) {
                t1 = t;
                let ty = DecreeTokenItemType.UNKNOWN;
                let tmp = new StringBuilder();
                for (let tt = t; tt !== null; tt = tt.next) {
                    if (!((tt instanceof TextToken))) {
                        let org = Utils.as(tt.get_referent(), OrganizationReferent);
                        if (org !== null && tt.previous === t1) {
                            ty = DecreeTokenItemType.OWNER;
                            if (tmp.length > 0) 
                                tmp.append(' ');
                            tmp.append(tt.get_source_text().toUpperCase());
                            t1 = tt;
                            break;
                        }
                        break;
                    }
                    if (tt.is_newline_before && tt !== t1) 
                        break;
                    if (!tt.chars.is_cyrillic_letter) 
                        break;
                    if (tt !== t) {
                        if (DecreeToken._try_attach(tt, null, lev + 1, false) !== null) 
                            break;
                    }
                    let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                    if (tt.chars.is_all_lower && tt !== t) {
                        if (npt !== null && npt.morph._case.is_genitive) {
                        }
                        else 
                            break;
                    }
                    if (npt !== null) {
                        if (tmp.length > 0) 
                            tmp.append(" ").append(npt.get_source_text());
                        else 
                            tmp.append(npt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false));
                        t1 = (tt = npt.end_token);
                    }
                    else if (tmp.length > 0) {
                        tmp.append(" ").append(tt.get_source_text());
                        t1 = tt;
                    }
                    else {
                        let s = null;
                        if (tt === t) 
                            s = tt.get_normal_case_text(MorphClass.NOUN, false, MorphGender.UNDEFINED, false);
                        if (s === null) 
                            s = (tt).term;
                        tmp.append(s);
                        t1 = tt;
                    }
                }
                let ss = MiscHelper.convert_first_char_upper_and_other_lower(tmp.toString());
                return DecreeToken._new843(t, t1, ty, ss);
            }
        }
        if (t.is_value("ДАТА", null)) {
            t1 = t.next;
            if (t1 !== null && t1.morph._case.is_genitive) 
                t1 = t1.next;
            if (t1 !== null && t1.is_char(':')) 
                t1 = t1.next;
            let res1 = DecreeToken._try_attach(t1, prev, lev + 1, false);
            if (res1 !== null && res1.typ === DecreeTokenItemType.DATE) {
                res1.begin_token = t;
                return res1;
            }
        }
        if (t.is_value("ВЕСТНИК", "ВІСНИК") || t.is_value("БЮЛЛЕТЕНЬ", "БЮЛЕТЕНЬ")) {
            let npt = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) 
                return DecreeToken._new843(t, npt.end_token, DecreeTokenItemType.TYP, MiscHelper.get_text_value(t, npt.end_token, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE));
            else if (t.next !== null && (t.next.get_referent() instanceof OrganizationReferent)) 
                return DecreeToken._new843(t, t.next, DecreeTokenItemType.TYP, MiscHelper.get_text_value(t, t.next, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE));
        }
        if ((prev !== null && prev.typ === DecreeTokenItemType.TYP && prev.value !== null) && ((prev.value.includes("ДОГОВОР") || prev.value.includes("ДОГОВІР")))) {
            let nn = DecreeToken.try_attach_name(t, prev.value, false, false);
            if (nn !== null) 
                return nn;
            t1 = null;
            for (let ttt = t; ttt !== null; ttt = ttt.next) {
                if (ttt.is_newline_before) 
                    break;
                let ddt1 = DecreeToken._try_attach(ttt, null, lev + 1, false);
                if (ddt1 !== null) 
                    break;
                if (ttt.morph.class0.is_preposition || ttt.morph.class0.is_conjunction) 
                    continue;
                let npt = NounPhraseHelper.try_parse(ttt, NounPhraseParseAttr.NO, 0, null);
                if (npt === null) 
                    break;
                ttt = (t1 = npt.end_token);
            }
            if (t1 !== null) {
                nn = DecreeToken._new840(t, t1, DecreeTokenItemType.NAME);
                nn.value = MiscHelper.get_text_value(t, t1, GetTextAttr.NO);
                return nn;
            }
        }
        if ((t instanceof TextToken) && t.length_char === 1 && t.next !== null) {
            if (((t).term === "Б" && t.next.is_char_of("\\/") && (t.next.next instanceof TextToken)) && (t.next.next).term === "Н") 
                return DecreeToken._new843(t, t.next.next, DecreeTokenItemType.NUMBER, "Б/Н");
        }
        return null;
    }
    
    static _is_jus_number(t) {
        let tt = Utils.as(t, TextToken);
        if (tt === null) 
            return false;
        if (tt.term !== "A" && tt.term !== "А") 
            return false;
        if ((t.next instanceof NumberToken) && (t.whitespaces_after_count < 2)) {
            if ((t.next).int_value !== null && (t.next).int_value > 20) 
                return true;
            return false;
        }
        return false;
    }
    
    static _is_edition(t) {
        if (t === null) 
            return null;
        if (t.morph.class0.is_preposition && t.next !== null) 
            t = t.next;
        if (t.is_value("РЕДАКЦИЯ", "РЕДАКЦІЯ") || t.is_value("РЕД", null)) {
            if (t.next !== null && t.next.is_char('.')) 
                return t.next;
            else 
                return t;
        }
        if (t.is_value("ИЗМЕНЕНИЕ", "ЗМІНА") || t.is_value("ИЗМ", null)) {
            if (t.next !== null && t.next.is_char('.')) 
                t = t.next;
            if ((t.next !== null && t.next.is_comma && t.next.next !== null) && t.next.next.is_value("ВНЕСЕННЫЙ", "ВНЕСЕНИЙ")) 
                return t.next.next;
            return t;
        }
        if ((t instanceof NumberToken) && t.next !== null && t.next.is_value("ЧТЕНИЕ", "ЧИТАННЯ")) 
            return t.next.next;
        return null;
    }
    
    static _find_back_typ(t, type_name) {
        if (t === null) 
            return null;
        if (t.is_value("НАСТОЯЩИЙ", "СПРАВЖНІЙ")) 
            return null;
        let cou = 0;
        for (let tt = t; tt !== null; tt = tt.previous) {
            cou++;
            if (tt.is_newline_before) 
                cou += 10;
            if (cou > 500) 
                break;
            let d = Utils.as(tt.get_referent(), DecreeReferent);
            if (d === null && (tt.get_referent() instanceof DecreePartReferent)) 
                d = (tt.get_referent()).owner;
            if (d === null) 
                continue;
            if (d.typ0 === type_name || d.typ === type_name) 
                return Utils.as(tt, ReferentToken);
        }
        return null;
    }
    
    static _try_attach_number(t, tmp, after_num) {
        let t2 = t;
        let res = null;
        let digs = false;
        let br = false;
        for (; t2 !== null; t2 = t2.next) {
            if (t2.is_char_of("(),;")) 
                break;
            if (t2.is_table_control_char) 
                break;
            if (t2.is_char('.') && t2.is_whitespace_after) 
                break;
            if (t2 !== t && t2.whitespaces_before_count > 1) 
                break;
            if (BracketHelper.is_bracket(t2, false)) {
                if (!after_num) 
                    break;
                if (!br && t2 !== t) 
                    break;
                res = t2;
                if (br) 
                    break;
                br = true;
                continue;
            }
            if (!((t2 instanceof NumberToken)) && !((t2 instanceof TextToken))) {
                let dr = Utils.as(t2.get_referent(), DateReferent);
                if (dr !== null && ((t2 === t || !t2.is_whitespace_before))) {
                    if (dr.year > 0 && t2.length_char === 4) {
                        res = t2;
                        tmp.append(dr.year);
                        digs = true;
                        continue;
                    }
                }
                let den = Utils.as(t2.get_referent(), DenominationReferent);
                if (den !== null) {
                    res = t2;
                    tmp.append(t2.get_source_text().toUpperCase());
                    for (const c of den.value) {
                        if (Utils.isDigit(c)) 
                            digs = true;
                    }
                    if (t2.is_whitespace_after) 
                        break;
                    continue;
                }
                if ((t2.length_char < 10) && after_num && !t2.is_whitespace_before) {
                }
                else 
                    break;
            }
            let s = t2.get_source_text();
            if (s === null) 
                break;
            if (t2.is_hiphen) 
                s = "-";
            if (t2.is_value("ОТ", "ВІД")) 
                break;
            if (s === "\\") 
                s = "/";
            if (Utils.isDigit(s[0])) {
                for (const d of s) {
                    digs = true;
                }
            }
            if (!t2.is_char_of("_@")) 
                tmp.append(s);
            res = t2;
            if (t2.is_whitespace_after) {
                if (t2.whitespaces_after_count > 1) 
                    break;
                if (digs) {
                    if ((t2.next !== null && ((t2.next.is_hiphen || t2.next.is_char_of(".:"))) && !t2.next.is_whitespace_after) && (t2.next.next instanceof NumberToken)) 
                        continue;
                }
                if (!after_num) 
                    break;
                if (t2.is_hiphen) {
                    if (t2.next !== null && t2.next.is_value("СМ", null)) 
                        break;
                    continue;
                }
                if (t2.is_char('/')) 
                    continue;
                if (t2.next !== null) {
                    if (((t2.next.is_hiphen || (t2.next instanceof NumberToken))) && !digs) 
                        continue;
                }
                if (t2 === t && t2.chars.is_all_upper) 
                    continue;
                if (t2.next instanceof NumberToken) {
                    if (t2 instanceof NumberToken) 
                        tmp.append(" ");
                    continue;
                }
                break;
            }
        }
        if (tmp.length === 0) {
            if (t !== null && t.is_char('_')) {
                for (t2 = t; t2 !== null; t2 = t2.next) {
                    if (!t2.is_char('_') || ((t2 !== t && t2.is_whitespace_before))) {
                        tmp.append('?');
                        return t2.previous;
                    }
                }
            }
            return null;
        }
        if (!digs && !after_num) 
            return null;
        let ch = tmp.charAt(tmp.length - 1);
        if (!Utils.isLetterOrDigit(ch) && (res instanceof TextToken) && !res.is_char('_')) {
            tmp.length = tmp.length - 1;
            res = res.previous;
        }
        if ((res.next !== null && res.next.is_hiphen && (res.next.next instanceof NumberToken)) && (res.next.next).int_value !== null) {
            let min = 0;
            let wrapmin894 = new RefOutArgWrapper();
            let inoutres895 = Utils.tryParseInt(tmp.toString(), wrapmin894);
            min = wrapmin894.value;
            if (inoutres895) {
                if (min < (res.next.next).int_value) {
                    res = res.next.next;
                    tmp.append("-").append((res).value);
                }
            }
        }
        if (res.next !== null && !res.is_whitespace_after && res.next.is_char('(')) {
            let cou = 0;
            let tmp2 = new StringBuilder();
            for (let tt = res.next.next; tt !== null; tt = tt.next) {
                if (tt.is_char(')')) {
                    tmp.append("(").append(tmp2.toString()).append(")");
                    res = tt;
                    break;
                }
                if ((++cou) > 5) 
                    break;
                if (tt.is_whitespace_before || tt.is_whitespace_after) 
                    break;
                if (tt instanceof ReferentToken) 
                    break;
                tmp2.append(tt.get_source_text());
            }
        }
        if (tmp.length > 2) {
            if (tmp.charAt(tmp.length - 1) === '3') {
                if (tmp.charAt(tmp.length - 2) === 'К' || tmp.charAt(tmp.length - 2) === 'Ф') 
                    tmp.setCharAt(tmp.length - 1, 'З');
            }
        }
        if ((res.next instanceof TextToken) && (res.whitespaces_after_count < 2) && res.next.chars.is_all_upper) {
            if (res.next.is_value("РД", null) || res.next.is_value("ПД", null)) {
                tmp.append(" ").append((res.next).term);
                res = res.next;
            }
        }
        if ((res.next instanceof TextToken) && res.next.is_char('*')) 
            res = res.next;
        return res;
    }
    
    /**
     * Привязать примитивы в контейнере с указанной позиции
     * @param cnt 
     * @param indFrom 
     * @return Список примитивов
     */
    static try_attach_list(t, prev = null, max_count = 10, must_start_by_typ = false) {
        let p = DecreeToken.try_attach(t, prev, must_start_by_typ);
        if (p === null) 
            return null;
        if (p.typ === DecreeTokenItemType.ORG || p.typ === DecreeTokenItemType.OWNER) {
            if (t.previous !== null && t.previous.is_value("РАССМОТРЕНИЕ", "РОЗГЛЯД")) 
                return null;
        }
        let res = new Array();
        res.push(p);
        let tt = p.end_token.next;
        if (tt !== null && t.previous !== null) {
            if (BracketHelper.can_be_start_of_sequence(t.previous, false, false) && BracketHelper.can_be_end_of_sequence(tt, false, null, false)) {
                p.begin_token = t.previous;
                p.end_token = tt;
                tt = tt.next;
            }
        }
        for (; tt !== null; tt = tt.next) {
            let ws = false;
            if (tt.whitespaces_before_count > 15) 
                ws = true;
            if (max_count > 0 && res.length >= max_count) {
                let la = res[res.length - 1];
                if (la.typ !== DecreeTokenItemType.TYP && la.typ !== DecreeTokenItemType.DATE && la.typ !== DecreeTokenItemType.NUMBER) 
                    break;
                if (res.length > (max_count * 3)) 
                    break;
            }
            let p0 = DecreeToken.try_attach(tt, (prev != null ? prev : p), false);
            if (ws) {
                if (p0 === null || p === null) 
                    break;
                if (((p.typ === DecreeTokenItemType.TYP && p0.typ === DecreeTokenItemType.NUMBER)) || ((p0.typ === DecreeTokenItemType.NAME && p.typ !== DecreeTokenItemType.NAME)) || ((p0.typ === DecreeTokenItemType.ORG && p.typ === DecreeTokenItemType.ORG))) {
                }
                else if ((((p0.typ === DecreeTokenItemType.DATE || p0.typ === DecreeTokenItemType.NUMBER)) && p.typ === DecreeTokenItemType.ORG && res.length === 2) && res[0].typ === DecreeTokenItemType.TYP) {
                }
                else 
                    break;
            }
            if (p0 === null) {
                if (tt.is_newline_before) 
                    break;
                if (tt.morph.class0.is_preposition && res[0].typ === DecreeTokenItemType.TYP) 
                    continue;
                if (tt.is_char('.') && p.typ === DecreeTokenItemType.NUMBER && (tt.whitespaces_after_count < 3)) {
                    p0 = DecreeToken._try_attach(tt.next, p, 0, false);
                    if (p0 !== null && ((p0.typ === DecreeTokenItemType.NAME || p0.typ === DecreeTokenItemType.DATE))) 
                        continue;
                    p0 = null;
                }
                if (((tt.is_comma_and || tt.is_hiphen)) && res[0].typ === DecreeTokenItemType.TYP) {
                    p0 = DecreeToken.try_attach(tt.next, p, false);
                    if (p0 !== null) {
                        let ty0 = p0.typ;
                        if (ty0 === DecreeTokenItemType.ORG || ty0 === DecreeTokenItemType.OWNER) 
                            ty0 = DecreeTokenItemType.UNKNOWN;
                        let ty = p.typ;
                        if (ty === DecreeTokenItemType.ORG || ty === DecreeTokenItemType.OWNER) 
                            ty = DecreeTokenItemType.UNKNOWN;
                        if (ty0 === ty || p0.typ === DecreeTokenItemType.EDITION) {
                            p = p0;
                            res.push(p);
                            tt = p.end_token;
                            continue;
                        }
                    }
                    p0 = null;
                }
                if (tt.is_char(':')) {
                    p0 = DecreeToken.try_attach(tt.next, p, false);
                    if (p0 !== null) {
                        if (p0.typ === DecreeTokenItemType.NUMBER || p0.typ === DecreeTokenItemType.DATE) {
                            p = p0;
                            res.push(p);
                            tt = p.end_token;
                            continue;
                        }
                    }
                }
                if (tt.is_comma && p.typ === DecreeTokenItemType.NUMBER) {
                    p0 = DecreeToken.try_attach(tt.next, p, false);
                    if (p0 !== null && p0.typ === DecreeTokenItemType.DATE) {
                        p = p0;
                        res.push(p);
                        tt = p.end_token;
                        continue;
                    }
                    let cou = 0;
                    if (res[0].typ === DecreeTokenItemType.TYP) {
                        for (let ii = 1; ii < res.length; ii++) {
                            if ((res[ii].typ === DecreeTokenItemType.ORG || res[ii].typ === DecreeTokenItemType.TERR || res[ii].typ === DecreeTokenItemType.UNKNOWN) || res[ii].typ === DecreeTokenItemType.OWNER) 
                                cou++;
                            else 
                                break;
                        }
                        if (cou > 1) {
                            let num = new StringBuilder(p.value);
                            let tmp = new StringBuilder();
                            let tend = null;
                            for (let tt1 = tt; tt1 !== null; tt1 = tt1.next) {
                                if (!tt1.is_comma_and) 
                                    break;
                                let pp = DecreeToken.try_attach(tt1.next, p, false);
                                if (pp !== null) 
                                    break;
                                if (!((tt1.next instanceof NumberToken))) 
                                    break;
                                tmp.length = 0;
                                let tt2 = DecreeToken._try_attach_number(tt1.next, tmp, true);
                                if (tt2 === null) 
                                    break;
                                num.append(",").append(tmp.toString());
                                cou--;
                                tt1 = (tend = tt2);
                            }
                            if (cou === 1) {
                                p.value = num.toString();
                                tt = p.end_token = tend;
                                continue;
                            }
                        }
                    }
                    p0 = null;
                }
                if (tt.is_comma && p.typ === DecreeTokenItemType.DATE) {
                    p0 = DecreeToken.try_attach(tt.next, p, false);
                    if (p0 !== null && p0.typ === DecreeTokenItemType.NUMBER) {
                        p = p0;
                        res.push(p);
                        tt = p.end_token;
                        continue;
                    }
                    p0 = null;
                }
                if (tt.is_comma_and && ((p.typ === DecreeTokenItemType.ORG || p.typ === DecreeTokenItemType.OWNER))) {
                    p0 = DecreeToken.try_attach(tt.next, p, false);
                    if (p0 !== null && ((p0.typ === DecreeTokenItemType.ORG || p.typ === DecreeTokenItemType.OWNER))) {
                        p = p0;
                        res.push(p);
                        tt = p.end_token;
                        continue;
                    }
                    p0 = null;
                }
                if (res[0].typ === DecreeTokenItemType.TYP) {
                    if (DecreeToken.get_kind(res[0].value) === DecreeKind.PUBLISHER) {
                        if (tt.is_char_of(",;")) 
                            continue;
                        if ((((p = DecreeToken.try_attach(tt, (prev != null ? prev : res[0]), false)))) !== null) {
                            res.push(p);
                            tt = p.end_token;
                            continue;
                        }
                    }
                }
                if (res[res.length - 1].typ === DecreeTokenItemType.UNKNOWN && prev !== null) {
                    p0 = DecreeToken.try_attach(tt, res[res.length - 1], false);
                    if (p0 !== null) {
                        p = p0;
                        res.push(p);
                        tt = p.end_token;
                        continue;
                    }
                }
                if ((((tt instanceof TextToken) && tt.chars.is_all_upper && BracketHelper.can_be_start_of_sequence(tt.next, false, false)) && res.length > 1 && res[res.length - 1].typ === DecreeTokenItemType.NUMBER) && res[res.length - 2].typ === DecreeTokenItemType.TYP && res[res.length - 2].typ_kind === DecreeKind.STANDARD) 
                    continue;
                if (tt.is_char('(')) {
                    p = DecreeToken.try_attach(tt.next, null, false);
                    if (p !== null && p.typ === DecreeTokenItemType.EDITION) {
                        let br = BracketHelper.try_parse(tt, BracketParseAttr.NO, 100);
                        if (br !== null) {
                            res.push(p);
                            for (tt = p.end_token.next; tt !== null; tt = tt.next) {
                                if (tt.end_char >= br.end_char) 
                                    break;
                                p = DecreeToken.try_attach(tt, null, false);
                                if (p !== null) {
                                    res.push(p);
                                    tt = p.end_token;
                                }
                            }
                            tt = res[res.length - 1].end_token = br.end_token;
                            continue;
                        }
                    }
                }
                if ((tt instanceof NumberToken) && res[res.length - 1].typ === DecreeTokenItemType.DATE) {
                    if (tt.previous !== null && tt.previous.morph.class0.is_preposition) {
                    }
                    else if (NumberHelper.try_parse_number_with_postfix(tt) !== null) {
                    }
                    else {
                        let tmp = new StringBuilder();
                        let t11 = DecreeToken._try_attach_number(tt, tmp, false);
                        if (t11 !== null) 
                            p0 = DecreeToken._new843(tt, t11, DecreeTokenItemType.NUMBER, tmp.toString());
                    }
                }
                if (p0 === null) 
                    break;
            }
            p = p0;
            res.push(p);
            tt = p.end_token;
        }
        for (let i = 0; i < (res.length - 1); i++) {
            if (res[i].end_token.next.is_comma) 
                continue;
            if (res[i].typ === DecreeTokenItemType.UNKNOWN && res[i + 1].typ === DecreeTokenItemType.UNKNOWN) {
                res[i].value = (res[i].value + " " + res[i + 1].value);
                res[i].end_token = res[i + 1].end_token;
                res.splice(i + 1, 1);
                i--;
            }
            else if (((res[i].typ === DecreeTokenItemType.ORG || res[i].typ === DecreeTokenItemType.OWNER)) && res[i + 1].typ === DecreeTokenItemType.UNKNOWN) {
                let ok = false;
                if (res[i + 1].begin_token.previous.is_comma) {
                }
                else if (((i + 2) < res.length) && res[i + 2].typ === DecreeTokenItemType.DATE) 
                    ok = true;
                if (ok) {
                    res[i].typ = DecreeTokenItemType.OWNER;
                    res[i].value = (res[i].value + " " + res[i + 1].value);
                    res[i].end_token = res[i + 1].end_token;
                    res[i].ref = null;
                    res.splice(i + 1, 1);
                    i--;
                }
            }
            else if (((res[i].typ === DecreeTokenItemType.UNKNOWN || res[i].typ === DecreeTokenItemType.OWNER)) && ((res[i + 1].typ === DecreeTokenItemType.ORG || res[i + 1].typ === DecreeTokenItemType.OWNER))) {
                let ok = false;
                if ((res[i].typ === DecreeTokenItemType.OWNER || res[i + 1].typ === DecreeTokenItemType.OWNER || res[i].value === "Пленум") || res[i].value === "Сессия" || res[i].value === "Съезд") 
                    ok = true;
                if (ok) {
                    res[i].typ = DecreeTokenItemType.OWNER;
                    res[i].end_token = res[i + 1].end_token;
                    if (res[i].value !== null) {
                        let s1 = res[i + 1].value;
                        if (s1 === null) 
                            s1 = res[i + 1].ref.referent.toString();
                        res[i].value = (res[i].value + ", " + s1);
                    }
                    res.splice(i + 1, 1);
                    i--;
                }
            }
            else if ((res[i].typ === DecreeTokenItemType.TYP && res[i + 1].typ === DecreeTokenItemType.TERR && ((i + 2) < res.length)) && res[i + 2].typ === DecreeTokenItemType.STDNAME) {
                res[i].full_value = (res[i].value + " " + res[i + 2].value);
                res[i + 1].end_token = res[i + 2].end_token;
                res.splice(i + 2, 1);
                i--;
            }
            else {
                let ok = false;
                if (res[i].typ === DecreeTokenItemType.UNKNOWN && ((((res[i + 1].typ === DecreeTokenItemType.TERR && prev !== null)) || res[i + 1].typ === DecreeTokenItemType.OWNER))) 
                    ok = true;
                else if (((res[i].typ === DecreeTokenItemType.UNKNOWN || res[i].typ === DecreeTokenItemType.ORG || res[i].typ === DecreeTokenItemType.OWNER)) && res[i + 1].typ === DecreeTokenItemType.TERR) 
                    ok = true;
                if (ok) {
                    res[i].typ = DecreeTokenItemType.OWNER;
                    res[i].end_token = res[i + 1].end_token;
                    let s1 = res[i + 1].value;
                    if (s1 === null) 
                        s1 = res[i + 1].ref.referent.toString();
                    res[i].value = (res[i].value + ", " + s1);
                    res.splice(i + 1, 1);
                    i--;
                }
            }
        }
        for (let i = 0; i < (res.length - 1); i++) {
            if (res[i].typ === DecreeTokenItemType.UNKNOWN) {
                let j = 0;
                let ok = false;
                for (j = i + 1; j < res.length; j++) {
                    if (res[j].begin_token.previous.is_comma) 
                        break;
                    else if (res[j].typ === DecreeTokenItemType.DATE || res[j].typ === DecreeTokenItemType.NUMBER) {
                        ok = true;
                        break;
                    }
                    else if (res[j].typ === DecreeTokenItemType.TERR || res[j].typ === DecreeTokenItemType.ORG || res[j].typ === DecreeTokenItemType.UNKNOWN) {
                    }
                    else 
                        break;
                }
                if (!ok) 
                    continue;
                if (j === (i + 1)) {
                    if (res[i].begin_token.previous.is_comma) 
                        res[i].typ = DecreeTokenItemType.OWNER;
                    continue;
                }
                let tmp = new StringBuilder();
                for (let ii = i; ii < j; ii++) {
                    if (ii > i) {
                        if (res[ii].typ === DecreeTokenItemType.TERR) 
                            tmp.append(", ");
                        else 
                            tmp.append(' ');
                    }
                    if (res[ii].value !== null) 
                        tmp.append(res[ii].value);
                    else if (res[ii].ref !== null && res[ii].ref.referent !== null) 
                        tmp.append(res[ii].ref.referent.toString());
                }
                res[i].value = tmp.toString();
                res[i].end_token = res[j - 1].end_token;
                res[i].typ = DecreeTokenItemType.OWNER;
                res.splice(i + 1, j - i - 1);
            }
        }
        if ((res.length === 3 && res[0].typ === DecreeTokenItemType.TYP && ((res[1].typ === DecreeTokenItemType.OWNER || res[1].typ === DecreeTokenItemType.ORG || res[1].typ === DecreeTokenItemType.TERR))) && res[2].typ === DecreeTokenItemType.NUMBER) {
            let te = res[2].end_token.next;
            for (; te !== null; te = te.next) {
                if (!te.is_char(',') || te.next === null) 
                    break;
                let res1 = DecreeToken.try_attach_list(te.next, res[0], 10, false);
                if (res1 === null || (res1.length < 2)) 
                    break;
                if (((res1[0].typ === DecreeTokenItemType.OWNER || res1[0].typ === DecreeTokenItemType.ORG || res1[0].typ === DecreeTokenItemType.TERR)) && res1[1].typ === DecreeTokenItemType.NUMBER) {
                    res.splice(res.length, 0, ...res1);
                    te = res1[res1.length - 1].end_token;
                }
                else 
                    break;
            }
        }
        if (res.length > 1 && ((res[res.length - 1].typ === DecreeTokenItemType.OWNER || res[res.length - 1].typ === DecreeTokenItemType.ORG))) {
            let te = res[res.length - 1].end_token.next;
            if (te !== null && te.is_comma_and) {
                let res1 = DecreeToken.try_attach_list(te.next, res[0], 10, false);
                if (res1 !== null && res1.length > 0) {
                    if (res1[0].typ === DecreeTokenItemType.OWNER || res1[0].typ === DecreeTokenItemType.ORG) 
                        res.splice(res.length, 0, ...res1);
                }
            }
        }
        return res;
    }
    
    static try_attach_name(t, _typ, very_probable = false, in_title_doc_ref = false) {
        if (t === null) 
            return null;
        if (t.is_char(';')) 
            t = t.next;
        if (t === null) 
            return null;
        let li = MailLine.parse(t, 0);
        if (li !== null) {
            if (li.typ === MailLineTypes.HELLO) 
                return null;
        }
        let t0 = t;
        let t1 = t;
        let abou = false;
        let ty = DecreeToken.get_kind(_typ);
        if (t.is_value("О", null) || t.is_value("ОБ", null) || t.is_value("ПРО", null)) {
            t = t.next;
            abou = true;
        }
        else if (t.is_value("ПО", null)) {
            if (LanguageHelper.ends_with(_typ, "ЗАКОН")) 
                return null;
            t = t.next;
            abou = true;
            if (t !== null) {
                if (t.is_value("ПОЗИЦИЯ", null)) 
                    return null;
            }
        }
        else if (t.next !== null) {
            if (BracketHelper.can_be_start_of_sequence(t, true, false)) {
                let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (br !== null && br.is_quote_type) {
                    let re = t.next.get_referent();
                    if (re !== null && re.type_name === "URI") 
                        return null;
                    if (t.next.chars.is_letter) {
                        if (t.next.chars.is_all_lower || (((t.next instanceof TextToken) && (t.next).is_pure_verb))) 
                            return null;
                    }
                    t1 = br.end_token;
                    let tt1 = DecreeToken._try_attach_std_change_name(t.next);
                    if (tt1 !== null) 
                        t1 = tt1;
                    let s0 = MiscHelper.get_text_value(t0, t1, GetTextAttr.KEEPREGISTER);
                    if (Utils.isNullOrEmpty(s0)) 
                        return null;
                    if ((s0.length < 10) && _typ !== "ПРОГРАММА" && _typ !== "ПРОГРАМА") 
                        return null;
                    return DecreeToken._new843(t, t1, DecreeTokenItemType.NAME, s0);
                }
                let dt = DecreeToken.try_attach_name(t.next, _typ, false, false);
                if (dt !== null) {
                    dt.begin_token = t;
                    return dt;
                }
            }
            if (ty !== DecreeKind.KONVENTION && ty !== DecreeKind.PROGRAM) 
                return null;
        }
        if (t === null) 
            return null;
        if (t.is_value("ЗАЯВЛЕНИЕ", "ЗАЯВА")) 
            return null;
        let tt = null;
        let cou = 0;
        for (tt = t; tt !== null; tt = tt.next) {
            if (tt.is_newline_before && tt !== t) {
                if (tt.whitespaces_before_count > 15 || !abou) 
                    break;
                if (tt.is_value("ИСТОЧНИК", null)) 
                    break;
                if ((tt instanceof TextToken) && tt.chars.is_letter && tt.chars.is_all_lower) {
                }
                else 
                    break;
            }
            if (tt.is_char_of("(,") && tt.next !== null) {
                if (tt.next.is_value("УТВЕРЖДЕННЫЙ", "ЗАТВЕРДЖЕНИЙ") || tt.next.is_value("ПРИНЯТЫЙ", "ПРИЙНЯТИЙ") || tt.next.is_value("УТВ", "ЗАТВ")) {
                    let ttt = tt.next.next;
                    if (ttt !== null && ttt.is_char('.') && tt.next.is_value("УТВ", null)) 
                        ttt = ttt.next;
                    let dt = DecreeToken.try_attach(ttt, null, false);
                    if (dt !== null && dt.typ === DecreeTokenItemType.TYP) 
                        break;
                    if (dt !== null && ((dt.typ === DecreeTokenItemType.ORG || dt.typ === DecreeTokenItemType.OWNER))) {
                        let dt2 = DecreeToken.try_attach(dt.end_token.next, null, false);
                        if (dt2 !== null && dt2.typ === DecreeTokenItemType.DATE) 
                            break;
                    }
                }
            }
            if (very_probable && abou && !tt.is_newline_before) {
                t1 = tt;
                continue;
            }
            if (tt.is_value("ОТ", "ВІД")) {
                let dt = DecreeToken.try_attach(tt, null, false);
                if (dt !== null) 
                    break;
            }
            if (tt.morph.class0.is_preposition && tt.next !== null && (((tt.next.get_referent() instanceof DateReferent) || (tt.next.get_referent() instanceof DateRangeReferent)))) 
                break;
            if (in_title_doc_ref) {
                t1 = tt;
                continue;
            }
            if (tt.morph.class0.is_preposition || tt.morph.class0.is_conjunction) {
                if (cou === 0) 
                    break;
                if (tt.next === null) 
                    break;
                continue;
            }
            if (!tt.chars.is_cyrillic_letter) 
                break;
            if (tt.morph.class0.is_personal_pronoun || tt.morph.class0.is_pronoun) {
                if (!tt.is_value("ВСЕ", "ВСІ") && !tt.is_value("ВСЯКИЙ", null) && !tt.is_value("ДАННЫЙ", "ДАНИЙ")) 
                    break;
            }
            if (tt instanceof NumberToken) 
                break;
            let pit = PartToken.try_attach(tt, null, false, false);
            if (pit !== null) 
                break;
            let r = tt.get_referent();
            if (r !== null) {
                if (((r instanceof DecreeReferent) || (r instanceof DateReferent) || (r instanceof OrganizationReferent)) || (r instanceof GeoReferent) || r.type_name === "NAMEDENTITY") {
                    if (tt.is_newline_before) 
                        break;
                    t1 = tt;
                    continue;
                }
            }
            let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.of((NounPhraseParseAttr.PARSENUMERICASADJECTIVE.value()) | (NounPhraseParseAttr.PARSEPREPOSITION.value()) | (NounPhraseParseAttr.PARSEVERBS.value())), 0, null);
            if (npt === null) 
                break;
            let dd = npt.end_token.get_morph_class_in_dictionary();
            if (dd.is_verb && npt.end_token === npt.begin_token) {
                if (!dd.is_noun) 
                    break;
                if (tt.is_value("БЫТЬ", "БУТИ")) 
                    break;
            }
            if (!npt.morph._case.is_genitive) {
                if (cou > 0) {
                    if ((npt.morph._case.is_instrumental && tt.previous !== null && tt.previous.previous !== null) && ((tt.previous.previous.is_value("РАБОТА", "РОБОТА")))) {
                    }
                    else if (abou && very_probable) {
                    }
                    else if (npt.noun.is_value("ГОД", "РІК") || npt.noun.is_value("ПЕРИОД", "ПЕРІОД")) {
                    }
                    else {
                        let tt0 = tt.previous;
                        let prep = "";
                        if (tt0 !== null && tt0.morph.class0.is_preposition) {
                            prep = tt0.get_normal_case_text(MorphClass.PREPOSITION, false, MorphGender.UNDEFINED, false);
                            tt0 = tt0.previous;
                        }
                        let ok = false;
                        if (tt0 instanceof TextToken) {
                            let norm = tt0.get_normal_case_text(MorphClass.NOUN, true, MorphGender.UNDEFINED, false);
                            let exps = Explanatory.find_derivates(norm, true, tt0.morph.language);
                            if (exps !== null) {
                                for (const ex of exps) {
                                    if (ex.cm.nexts !== null) {
                                        if (prep.length > 0 && ex.cm.nexts.containsKey(prep)) {
                                            ok = true;
                                            break;
                                        }
                                        if (prep.length === 0 && ex.cm.nexts.containsKey(prep)) {
                                            if (!(MorphCase.ooBitand(ex.cm.nexts.get(prep), npt.morph._case)).is_undefined) {
                                                ok = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (ex.cm.transitive) {
                                        if (npt.morph._case.is_genitive) {
                                            ok = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        if (!ok) 
                            break;
                    }
                }
                if (!abou) 
                    break;
            }
            cou++;
            tt = (t1 = npt.end_token);
            if (npt.noun.is_value("НАЛОГОПЛАТЕЛЬЩИК", null)) {
                let ttn = MiscHelper.check_number_prefix(tt.next);
                if ((ttn instanceof NumberToken) && (ttn).value === "1") 
                    tt = (t1 = ttn);
            }
        }
        if (tt === t) 
            return null;
        if (abou) {
            let tt1 = DecreeToken._try_attach_std_change_name(t0);
            if (tt1 !== null && tt1.end_char > t1.end_char) 
                t1 = tt1;
        }
        let s = MiscHelper.get_text_value(t0, t1, GetTextAttr.of((GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE.value()) | (GetTextAttr.KEEPREGISTER.value())));
        if (Utils.isNullOrEmpty(s) || (s.length < 10)) 
            return null;
        return DecreeToken._new843(t, t1, DecreeTokenItemType.NAME, s);
    }
    
    static _try_attach_std_change_name(t) {
        if (!((t instanceof TextToken)) || t.next === null) 
            return null;
        let t0 = t;
        let term = (t).term;
        if ((term !== "О" && term !== "O" && term !== "ОБ") && term !== "ПРО") 
            return null;
        t = t.next;
        if (((t.is_value("ВНЕСЕНИЕ", "ВНЕСЕННЯ") || t.is_value("УТВЕРЖДЕНИЕ", "ТВЕРДЖЕННЯ") || t.is_value("ПРИНЯТИЕ", "ПРИЙНЯТТЯ")) || t.is_value("ВВЕДЕНИЕ", "ВВЕДЕННЯ") || t.is_value("ПРИОСТАНОВЛЕНИЕ", "ПРИЗУПИНЕННЯ")) || t.is_value("ОТМЕНА", "СКАСУВАННЯ") || t.is_value("МЕРА", "ЗАХІД")) {
        }
        else if (t.is_value("ПРИЗНАНИЕ", "ВИЗНАННЯ") && t.next !== null && t.next.is_value("УТРАТИТЬ", "ВТРАТИТИ")) {
        }
        else 
            return null;
        let t1 = t;
        for (let tt = t.next; tt !== null; tt = tt.next) {
            if (tt.is_newline_before) {
            }
            if (tt.whitespaces_before_count > 15) 
                break;
            if (MiscHelper.can_be_start_of_sentence(tt)) 
                break;
            if (tt.morph.class0.is_conjunction || tt.morph.class0.is_preposition) 
                continue;
            if (tt.is_comma) 
                continue;
            let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) {
                if ((((((npt.noun.is_value("ВВЕДЕНИЕ", "ВВЕДЕННЯ") || npt.noun.is_value("ПРИОСТАНОВЛЕНИЕ", "ПРИЗУПИНЕННЯ") || npt.noun.is_value("ВНЕСЕНИЕ", "ВНЕСЕННЯ")) || npt.noun.is_value("ИЗМЕНЕНИЕ", "ЗМІНА") || npt.noun.is_value("ДОПОЛНЕНИЕ", "ДОДАТОК")) || npt.noun.is_value("АКТ", null) || npt.noun.is_value("ПРИЗНАНИЕ", "ВИЗНАННЯ")) || npt.noun.is_value("ПРИНЯТИЕ", "ПРИЙНЯТТЯ") || npt.noun.is_value("СИЛА", "ЧИННІСТЬ")) || npt.noun.is_value("ДЕЙСТВИЕ", "ДІЯ") || npt.noun.is_value("СВЯЗЬ", "ЗВЯЗОК")) || npt.noun.is_value("РЕАЛИЗАЦИЯ", "РЕАЛІЗАЦІЯ") || npt.noun.is_value("РЯД", null)) {
                    t1 = (tt = npt.end_token);
                    continue;
                }
            }
            if (tt.is_value("ТАКЖЕ", "ТАКОЖ") || tt.is_value("НЕОБХОДИМЫЙ", "НЕОБХІДНИЙ")) 
                continue;
            let r = tt.get_referent();
            if ((r instanceof GeoReferent) || (r instanceof DecreeReferent) || (r instanceof DecreePartReferent)) {
                t1 = tt;
                continue;
            }
            if ((r instanceof OrganizationReferent) && tt.is_newline_after) {
                t1 = tt;
                continue;
            }
            let pts = PartToken.try_attach_list(tt, false, 40);
            while (pts !== null && pts.length > 0) {
                if (pts[0].typ === PartTokenItemType.PREFIX) 
                    pts.splice(0, 1);
                else 
                    break;
            }
            if (pts !== null && pts.length > 0) {
                t1 = (tt = pts[pts.length - 1].end_token);
                continue;
            }
            let dts = DecreeToken.try_attach_list(tt, null, 10, false);
            if (dts !== null && dts.length > 0) {
                let rts = DecreeAnalyzer.try_attach(dts, null, null);
                if (rts !== null) {
                    t1 = (tt = rts[0].end_token);
                    continue;
                }
                if (dts[0].typ === DecreeTokenItemType.TYP) {
                    let rt = DecreeAnalyzer.try_attach_approved(tt, null);
                    if (rt !== null) {
                        t1 = (tt = rt.end_token);
                        continue;
                    }
                }
            }
            let tt1 = DecreeToken.is_keyword(tt, false);
            if (tt1 !== null) {
                t1 = (tt = tt1);
                continue;
            }
            if (tt instanceof NumberToken) 
                continue;
            if (!tt.chars.is_all_lower && tt.length_char > 2 && tt.get_morph_class_in_dictionary().is_undefined) {
                t1 = tt;
                continue;
            }
            break;
        }
        if (BracketHelper.can_be_start_of_sequence(t0.previous, true, false)) {
            if (BracketHelper.can_be_end_of_sequence(t1.next, true, t0.previous, false)) 
                t1 = t1.next;
        }
        return t1;
    }
    
    static initialize() {
        if (DecreeToken.m_termins !== null) 
            return;
        DecreeToken.m_termins = new TerminCollection();
        DecreeToken.m_keywords = new TerminCollection();
        for (const s of DecreeToken.m_misc_typesru) {
            DecreeToken.m_keywords.add(new Termin(s));
        }
        for (const s of DecreeToken.m_misc_typesua) {
            DecreeToken.m_keywords.add(Termin._new899(s, MorphLang.UA));
        }
        let t = Termin._new114("ТЕХНИЧЕСКОЕ ЗАДАНИЕ", "ТЗ");
        t.add_variant("ТЕХЗАДАНИЕ", false);
        t.add_abridge("ТЕХ. ЗАДАНИЕ");
        DecreeToken.m_keywords.add(t);
        t = Termin._new114("ТЕХНИКО КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ", "ТКП");
        t.add_variant("КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ", false);
        DecreeToken.m_keywords.add(t);
        for (const s of DecreeToken.m_all_typesru) {
            DecreeToken.m_termins.add(Termin._new119(s, DecreeTokenItemType.TYP));
            DecreeToken.m_keywords.add(Termin._new119(s, DecreeTokenItemType.TYP));
        }
        for (const s of DecreeToken.m_all_typesua) {
            DecreeToken.m_termins.add(Termin._new120(s, DecreeTokenItemType.TYP, MorphLang.UA));
            DecreeToken.m_keywords.add(Termin._new120(s, DecreeTokenItemType.TYP, MorphLang.UA));
        }
        DecreeToken.m_termins.add(Termin._new119("ОТРАСЛЕВОЕ СОГЛАШЕНИЕ", DecreeTokenItemType.TYP));
        DecreeToken.m_termins.add(Termin._new456("ГАЛУЗЕВА УГОДА", MorphLang.UA, DecreeTokenItemType.TYP));
        DecreeToken.m_termins.add(Termin._new119("МЕЖОТРАСЛЕВОЕ СОГЛАШЕНИЕ", DecreeTokenItemType.TYP));
        DecreeToken.m_termins.add(Termin._new456("МІЖГАЛУЗЕВА УГОДА", MorphLang.UA, DecreeTokenItemType.TYP));
        DecreeToken.m_termins.add(Termin._new121("ОСНОВЫ ЗАКОНОДАТЕЛЬСТВА", DecreeTokenItemType.TYP, DecreeKind.KODEX));
        DecreeToken.m_termins.add(Termin._new911("ОСНОВИ ЗАКОНОДАВСТВА", MorphLang.UA, DecreeTokenItemType.TYP, DecreeKind.KODEX));
        DecreeToken.m_termins.add(Termin._new121("ОСНОВЫ ГРАЖДАНСКОГО ЗАКОНОДАТЕЛЬСТВА", DecreeTokenItemType.TYP, DecreeKind.KODEX));
        DecreeToken.m_termins.add(Termin._new911("ОСНОВИ ЦИВІЛЬНОГО ЗАКОНОДАВСТВА", MorphLang.UA, DecreeTokenItemType.TYP, DecreeKind.KODEX));
        t = Termin._new145("ФЕДЕРАЛЬНЫЙ ЗАКОН", DecreeTokenItemType.TYP, "ФЗ");
        DecreeToken.m_termins.add(t);
        t = Termin._new915("ФЕДЕРАЛЬНИЙ ЗАКОН", MorphLang.UA, DecreeTokenItemType.TYP, "ФЗ");
        DecreeToken.m_termins.add(t);
        t = Termin._new119("ПРОЕКТ ЗАКОНА", DecreeTokenItemType.TYP);
        t.add_variant("ЗАКОНОПРОЕКТ", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new119("ПАСПОРТ ПРОЕКТА", DecreeTokenItemType.TYP);
        DecreeToken.m_termins.add(t);
        t = Termin._new456("ПРОЕКТ ЗАКОНУ", MorphLang.UA, DecreeTokenItemType.TYP);
        t.add_variant("ЗАКОНОПРОЕКТ", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new456("ПАСПОРТ ПРОЕКТУ", MorphLang.UA, DecreeTokenItemType.TYP);
        DecreeToken.m_termins.add(t);
        t = Termin._new143("ГОСУДАРСТВЕННАЯ ПРОГРАММА", "ПРОГРАММА", DecreeTokenItemType.TYP);
        t.add_variant("ГОСУДАРСТВЕННАЯ ЦЕЛЕВАЯ ПРОГРАММА", false);
        t.add_variant("ФЕДЕРАЛЬНАЯ ЦЕЛЕВАЯ ПРОГРАММА", false);
        t.add_abridge("ФЕДЕРАЛЬНАЯ ПРОГРАММА");
        t.add_variant("МЕЖГОСУДАРСТВЕННАЯ ЦЕЛЕВАЯ ПРОГРАММА", false);
        t.add_abridge("МЕЖГОСУДАРСТВЕННАЯ ПРОГРАММА");
        t.add_variant("ГОСПРОГРАММА", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new921("ДЕРЖАВНА ПРОГРАМА", "ПРОГРАМА", MorphLang.UA, DecreeTokenItemType.TYP);
        t.add_variant("ДЕРЖАВНА ЦІЛЬОВА ПРОГРАМА", false);
        t.add_variant("ФЕДЕРАЛЬНА ЦІЛЬОВА ПРОГРАМА", false);
        t.add_abridge("ФЕДЕРАЛЬНА ПРОГРАМА");
        t.add_variant("ДЕРЖПРОГРАМА", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new145("ФЕДЕРАЛЬНЫЙ КОНСТИТУЦИОННЫЙ ЗАКОН", DecreeTokenItemType.TYP, "ФКЗ");
        t.add_variant("КОНСТИТУЦИОННЫЙ ЗАКОН", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new915("ФЕДЕРАЛЬНИЙ КОНСТИТУЦІЙНИЙ ЗАКОН", MorphLang.UA, DecreeTokenItemType.TYP, "ФКЗ");
        DecreeToken.m_termins.add(t);
        t = Termin._new924("УГОЛОВНЫЙ КОДЕКС", DecreeTokenItemType.TYP, "УК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("КРИМИНАЛЬНЫЙ КОДЕКС", DecreeTokenItemType.TYP, "КК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("КРИМІНАЛЬНИЙ КОДЕКС", MorphLang.UA, DecreeTokenItemType.TYP, "КК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("УГОЛОВНО-ПРОЦЕССУАЛЬНЫЙ КОДЕКС", DecreeTokenItemType.TYP, "УПК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("КРИМІНАЛЬНО-ПРОЦЕСУАЛЬНИЙ КОДЕКС", MorphLang.UA, DecreeTokenItemType.TYP, "КПК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("УГОЛОВНО-ИСПОЛНИТЕЛЬНЫЙ КОДЕКС", DecreeTokenItemType.TYP, "УИК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("КРИМІНАЛЬНО-ВИКОНАВЧИЙ КОДЕКС", MorphLang.UA, DecreeTokenItemType.TYP, "КВК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("ГРАЖДАНСКИЙ КОДЕКС", DecreeTokenItemType.TYP, "ГК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("ЦИВІЛЬНИЙ КОДЕКС", MorphLang.UA, DecreeTokenItemType.TYP, "ЦК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("ГРАЖДАНСКИЙ ПРОЦЕССУАЛЬНЫЙ КОДЕКС", DecreeTokenItemType.TYP, "ГПК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("ЦИВІЛЬНИЙ ПРОЦЕСУАЛЬНИЙ КОДЕКС", MorphLang.UA, DecreeTokenItemType.TYP, "ЦПК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("ГРАДОСТРОИТЕЛЬНЫЙ КОДЕКС", DecreeTokenItemType.TYP, "ГРК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("МІСТОБУДІВНИЙ КОДЕКС", MorphLang.UA, DecreeTokenItemType.TYP, "МБК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("ХОЗЯЙСТВЕННЫЙ КОДЕКС", DecreeTokenItemType.TYP, "ХК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("ГОСПОДАРСЬКИЙ КОДЕКС", MorphLang.UA, DecreeTokenItemType.TYP, "ГК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("ХОЗЯЙСТВЕННЫЙ ПРОЦЕССУАЛЬНЫЙ КОДЕКС", DecreeTokenItemType.TYP, "ХПК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("ГОСПОДАРСЬКИЙ ПРОЦЕСУАЛЬНИЙ КОДЕКС", MorphLang.UA, DecreeTokenItemType.TYP, "ГПК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new121("АРБИТРАЖНЫЙ ПРОЦЕССУАЛЬНЫЙ КОДЕКС", DecreeTokenItemType.TYP, DecreeKind.KODEX);
        t.add_abridge("АПК");
        DecreeToken.m_termins.add(t);
        t = Termin._new911("АРБІТРАЖНИЙ ПРОЦЕСУАЛЬНИЙ КОДЕКС", MorphLang.UA, DecreeTokenItemType.TYP, DecreeKind.KODEX);
        t.add_abridge("АПК");
        DecreeToken.m_termins.add(t);
        t = Termin._new924("КОДЕКС ВНУТРЕННЕГО ВОДНОГО ТРАНСПОРТА", DecreeTokenItemType.TYP, "КВВТ", DecreeKind.KODEX);
        t.add_variant("КВ ВТ", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("ТРУДОВОЙ КОДЕКС", DecreeTokenItemType.TYP, "ТК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("ТРУДОВИЙ КОДЕКС", MorphLang.UA, DecreeTokenItemType.TYP, "ТК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("КОДЕКС ЗАКОНОВ О ТРУДЕ", "КЗОТ", DecreeTokenItemType.TYP, DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("КОДЕКС ЗАКОНІВ ПРО ПРАЦЮ", MorphLang.UA, DecreeTokenItemType.TYP, "КЗПП", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("ЖИЛИЩНЫЙ КОДЕКС", DecreeTokenItemType.TYP, "ЖК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("ЖИТЛОВИЙ КОДЕКС", MorphLang.UA, DecreeTokenItemType.TYP, "ЖК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("ЗЕМЕЛЬНЫЙ КОДЕКС", DecreeTokenItemType.TYP, "ЗК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("ЗЕМЕЛЬНИЙ КОДЕКС", MorphLang.UA, DecreeTokenItemType.TYP, "ЗК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("ЛЕСНОЙ КОДЕКС", DecreeTokenItemType.TYP, "ЛК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("ЛІСОВИЙ КОДЕКС", MorphLang.UA, DecreeTokenItemType.TYP, "ЛК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("БЮДЖЕТНЫЙ КОДЕКС", DecreeTokenItemType.TYP, "БК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("БЮДЖЕТНИЙ КОДЕКС", MorphLang.UA, DecreeTokenItemType.TYP, "БК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("НАЛОГОВЫЙ КОДЕКС", DecreeTokenItemType.TYP, "НК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("ПОДАТКОВИЙ КОДЕКС", MorphLang.UA, DecreeTokenItemType.TYP, "ПК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("СЕМЕЙНЫЙ КОДЕКС", DecreeTokenItemType.TYP, "СК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("СІМЕЙНИЙ КОДЕКС", MorphLang.UA, DecreeTokenItemType.TYP, "СК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("ВОДНЫЙ КОДЕКС", DecreeTokenItemType.TYP, "ВК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("ВОДНИЙ КОДЕКС", MorphLang.UA, DecreeTokenItemType.TYP, "ВК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("ВОЗДУШНЫЙ КОДЕКС", DecreeTokenItemType.TYP, "ВК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("ПОВІТРЯНИЙ КОДЕКС", MorphLang.UA, DecreeTokenItemType.TYP, "ПК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("КОДЕКС ОБ АДМИНИСТРАТИВНЫХ ПРАВОНАРУШЕНИЯХ", DecreeTokenItemType.TYP, "КОАП", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("КОДЕКС ПРО АДМІНІСТРАТИВНІ ПРАВОПОРУШЕННЯ", MorphLang.UA, DecreeTokenItemType.TYP, "КОАП", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new119("ОБ АДМИНИСТРАТИВНЫХ ПРАВОНАРУШЕНИЯХ", DecreeTokenItemType.STDNAME);
        DecreeToken.m_termins.add(t);
        t = Termin._new456("ПРО АДМІНІСТРАТИВНІ ПРАВОПОРУШЕННЯ", MorphLang.UA, DecreeTokenItemType.STDNAME);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("КОДЕКС ОБ АДМИНИСТРАТИВНЫХ ПРАВОНАРУШЕНИЯХ", DecreeTokenItemType.TYP, "КРКОАП", DecreeKind.KODEX);
        t.add_variant("КРК ОБ АП", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("КОДЕКС АДМИНИСТРАТИВНОГО СУДОПРОИЗВОДСТВА", DecreeTokenItemType.TYP, "КАС", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("КОДЕКС АДМІНІСТРАТИВНОГО СУДОЧИНСТВА", MorphLang.UA, DecreeTokenItemType.TYP, "КАС", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("ТАМОЖЕННЫЙ КОДЕКС", DecreeTokenItemType.TYP, "ТК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("МИТНИЙ КОДЕКС", MorphLang.UA, DecreeTokenItemType.TYP, "МК", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("КОДЕКС ТОРГОВОГО МОРЕПЛАВАНИЯ", DecreeTokenItemType.TYP, "КТМ", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new926("КОДЕКС ТОРГОВЕЛЬНОГО МОРЕПЛАВСТВА", MorphLang.UA, DecreeTokenItemType.TYP, "КТМ", DecreeKind.KODEX);
        DecreeToken.m_termins.add(t);
        t = Termin._new924("ПРАВИЛА ДОРОЖНОГО ДВИЖЕНИЯ", DecreeTokenItemType.TYP, "ПДД", "ПРАВИЛА");
        DecreeToken.m_termins.add(t);
        t = Termin._new926("ПРАВИЛА ДОРОЖНЬОГО РУХУ", MorphLang.UA, DecreeTokenItemType.TYP, "ПДР", "ПРАВИЛА");
        DecreeToken.m_termins.add(t);
        t = Termin._new119("СОБРАНИЕ ЗАКОНОДАТЕЛЬСТВА", DecreeTokenItemType.TYP);
        t.add_abridge("СЗ");
        DecreeToken.m_termins.add(t);
        t = Termin._new119("ОФИЦИАЛЬНЫЙ ВЕСТНИК", DecreeTokenItemType.TYP);
        DecreeToken.m_termins.add(t);
        t = Termin._new456("ОФІЦІЙНИЙ ВІСНИК", MorphLang.UA, DecreeTokenItemType.TYP);
        DecreeToken.m_termins.add(t);
        t = Termin._new119("СВОД ЗАКОНОВ", DecreeTokenItemType.TYP);
        DecreeToken.m_termins.add(t);
        t = Termin._new119("БЮЛЛЕТЕНЬ НОРМАТИВНЫХ АКТОВ ФЕДЕРАЛЬНЫХ ОРГАНОВ ИСПОЛНИТЕЛЬНОЙ ВЛАСТИ", DecreeTokenItemType.TYP);
        DecreeToken.m_termins.add(t);
        t = Termin._new119("БЮЛЛЕТЕНЬ МЕЖДУНАРОДНЫХ ДОГОВОРОВ", DecreeTokenItemType.TYP);
        DecreeToken.m_termins.add(t);
        t = Termin._new119("БЮЛЛЕТЕНЬ ВЕРХОВНОГО СУДА", DecreeTokenItemType.TYP);
        t.add_variant("БЮЛЛЕТЕНЬ ВС", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new119("ВЕСТНИК ВЫСШЕГО АРБИТРАЖНОГО СУДА", DecreeTokenItemType.TYP);
        DecreeToken.m_termins.add(t);
        t = Termin._new119("ВЕСТНИК БАНКА РОССИИ", DecreeTokenItemType.TYP);
        DecreeToken.m_termins.add(t);
        t = Termin._new119("РОССИЙСКАЯ ГАЗЕТА", DecreeTokenItemType.TYP);
        DecreeToken.m_termins.add(t);
        t = Termin._new119("РОССИЙСКИЕ ВЕСТИ", DecreeTokenItemType.TYP);
        DecreeToken.m_termins.add(t);
        t = Termin._new119("СОБРАНИЕ АКТОВ ПРЕЗИДЕНТА И ПРАВИТЕЛЬСТВА", DecreeTokenItemType.TYP);
        DecreeToken.m_termins.add(t);
        t = Termin._new119("ВЕДОМОСТИ ВЕРХОВНОГО СОВЕТА", DecreeTokenItemType.TYP);
        t.add_variant("ВЕДОМОСТИ ВС", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new119("ВЕДОМОСТИ СЪЕЗДА НАРОДНЫХ ДЕПУТАТОВ И ВЕРХОВНОГО СОВЕТА", DecreeTokenItemType.TYP);
        t.add_variant("ВЕДОМОСТИ СЪЕЗДА НАРОДНЫХ ДЕПУТАТОВ РФ И ВЕРХОВНОГО СОВЕТА", false);
        t.add_variant("ВЕДОМОСТИ СЪЕЗДА НАРОДНЫХ ДЕПУТАТОВ", false);
        t.add_variant("ВЕДОМОСТИ СНД РФ И ВС", false);
        t.add_variant("ВЕДОМОСТИ СНД И ВС", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new119("БЮЛЛЕТЕНЬ НОРМАТИВНЫХ АКТОВ МИНИСТЕРСТВ И ВЕДОМСТВ", DecreeTokenItemType.TYP);
        DecreeToken.m_termins.add(t);
        DecreeToken.m_termins.add(Termin._new119("СВОД ЗАКОНОВ", DecreeTokenItemType.TYP));
        DecreeToken.m_termins.add(Termin._new119("ВЕДОМОСТИ", DecreeTokenItemType.TYP));
        t = Termin._new143("ЗАРЕГИСТРИРОВАТЬ", "РЕГИСТРАЦИЯ", DecreeTokenItemType.TYP);
        DecreeToken.m_termins.add(t);
        t = Termin._new995("ЗАРЕЄСТРУВАТИ", MorphLang.UA, "РЕЄСТРАЦІЯ", DecreeTokenItemType.TYP);
        DecreeToken.m_termins.add(t);
        t = Termin._new121("СТАНДАРТ", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        t.add_variant("МЕЖДУНАРОДНЫЙ СТАНДАРТ", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new145("ЕДИНЫЙ ОТРАСЛЕВОЙ СТАНДАРТ ЗАКУПОК", DecreeTokenItemType.TYP, "ЕОСЗ");
        DecreeToken.m_termins.add(t);
        t = Termin._new119("ЕДИНЫЙ ОТРАСЛЕВОЙ ПОРЯДОК", DecreeTokenItemType.TYP);
        DecreeToken.m_termins.add(t);
        t = Termin._new121("ГОСТ", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        t.add_variant("ГОСУДАРСТВЕННЫЙ СТАНДАРТ", false);
        t.add_variant("ГОССТАНДАРТ", false);
        t.add_variant("НАЦИОНАЛЬНЫЙ СТАНДАРТ", false);
        t.add_variant("МЕЖГОСУДАРСТВЕННЫЙ СТАНДАРТ", false);
        t.add_variant("ДЕРЖАВНИЙ СТАНДАРТ", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new121("ОСТ", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        t.add_variant("ОТРАСЛЕВОЙ СТАНДАРТ", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new121("ПНСТ", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        t.add_variant("ПРЕДВАРИТЕЛЬНЫЙ НАЦИОНАЛЬНЫЙ СТАНДАРТ", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new121("РСТ", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        t.add_variant("РЕСПУБЛИКАНСКИЙ СТАНДАРТ", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new121("ПБУ", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        t.add_variant("ПОЛОЖЕНИЕ ПО БУХГАЛТЕРСКОМУ УЧЕТУ", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new121("ISO", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        t.add_variant("ИСО", false);
        t.add_variant("ISO/IEC", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("ТЕХНИЧЕСКИЕ УСЛОВИЯ", "ТУ", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        t.add_variant("ТЕХУСЛОВИЯ", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("ФЕДЕРАЛЬНЫЕ НОРМЫ И ПРАВИЛА", "ФНП", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("НОРМАТИВНЫЕ ПРАВИЛА", "НП", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        DecreeToken.m_termins.add(t);
        t = Termin._new121("СТРОИТЕЛЬНЫЕ НОРМЫ И ПРАВИЛА", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        t.add_variant("СНИП", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("СТРОИТЕЛЬНЫЕ НОРМЫ", "СН", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        t.add_variant("CH", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("ВЕДОМСТВЕННЫЕ СТРОИТЕЛЬНЫЕ НОРМЫ", "ВСН", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        t.add_variant("BCH", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("РЕСПУБЛИКАНСКИЕ СТРОИТЕЛЬНЫЕ НОРМЫ", "РСН", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        t.add_variant("PCH", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("ПРАВИЛА БЕЗОПАСНОСТИ", "ПБ", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("НОРМЫ РАДИАЦИОННОЙ БЕЗОПАСНОСТИ", "НРБ", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("ПРАВИЛА РАДИАЦИОННОЙ БЕЗОПАСНОСТИ", "ПРБ", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("НОРМЫ ПОЖАРНОЙ БЕЗОПАСНОСТИ", "НПБ", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("ПРАВИЛА ПОЖАРНОЙ БЕЗОПАСНОСТИ", "ППБ", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("СТРОИТЕЛЬНЫЕ ПРАВИЛА", "СП", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("МОСКОВСКИЕ ГОРОДСКИЕ СТРОИТЕЛЬНЫЕ НОРМЫ", "МГСН", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        DecreeToken.m_termins.add(t);
        t = Termin._new121("АВОК", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        t.add_variant("ABOK", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("ТЕХНИЧЕСКИЙ РЕГЛАМЕНТ", "ТР", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("ОБЩИЕ ПРАВИЛА БЕЗОПАСНОСТИ", "ОПБ", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("ПРАВИЛА ЯДЕРНОЙ БЕЗОПАСНОСТИ", "ПБЯ", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        DecreeToken.m_termins.add(t);
        t = Termin._new121("СТАНДАРТ ОРГАНИЗАЦИИ", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        t.add_variant("СТО", false);
        t.add_variant("STO", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("ПРАВИЛА ПО ОХРАНЕ ТРУДА", "ПОТ", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        t.add_variant("ПРАВИЛА ОХРАНЫ ТРУДА", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("ИНСТРУКЦИЯ ПО ОХРАНЕ ТРУДА", "ИОТ", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        t.add_variant("ИНСТРУКЦИЯ ОХРАНЫ ТРУДА", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new946("РУКОВОДЯЩИЙ ДОКУМЕНТ", "РД", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        DecreeToken.m_termins.add(t);
        t = Termin._new121("САНИТАРНЫЕ НОРМЫ И ПРАВИЛА", DecreeTokenItemType.TYP, DecreeKind.STANDARD);
        t.add_variant("САНПИН", false);
        DecreeToken.m_termins.add(t);
        t = Termin._new145("ТЕХНИЧЕСКОЕ ЗАДАНИЕ", DecreeTokenItemType.TYP, "ТЗ");
        t.add_variant("ТЕХЗАДАНИЕ", false);
        t.add_abridge("ТЕХ. ЗАДАНИЕ");
        DecreeToken.m_termins.add(t);
        t = Termin._new114("ТЕХНИКО КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ", "ТКП");
        t.add_variant("КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ", false);
        DecreeToken.m_keywords.add(t);
    }
    
    static is_keyword(t, is_misc_type_only = false) {
        if (t === null) 
            return null;
        let tok = DecreeToken.m_keywords.try_parse(t, TerminParseAttr.NO);
        if (tok !== null) {
            if (is_misc_type_only && tok.termin.tag !== null) 
                return null;
            tok.end_token.tag = tok.termin.canonic_text;
            return tok.end_token;
        }
        if (!t.morph.class0.is_adjective && !t.morph.class0.is_pronoun) 
            return null;
        let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
        if (npt === null || npt.begin_token === npt.end_token) {
            if ((t.is_value("НАСТОЯЩИЙ", "СПРАВЖНІЙ") || t.is_value("НАЗВАННЫЙ", "НАЗВАНИЙ") || t.is_value("ДАННЫЙ", "ДАНИЙ")) || ((t.get_morph_class_in_dictionary().is_verb && t.get_morph_class_in_dictionary().is_adjective))) {
                if ((((tok = DecreeToken.m_keywords.try_parse(t.next, TerminParseAttr.NO)))) !== null) {
                    tok.end_token.tag = tok.termin.canonic_text;
                    return tok.end_token;
                }
            }
            return null;
        }
        if ((((tok = DecreeToken.m_keywords.try_parse(npt.end_token, TerminParseAttr.NO)))) !== null) {
            if (is_misc_type_only && tok.termin.tag !== null) 
                return null;
            tok.end_token.tag = tok.termin.canonic_text;
            return tok.end_token;
        }
        let pp = PartToken.try_attach(npt.end_token, null, false, true);
        if (pp !== null) 
            return pp.end_token;
        return null;
    }
    
    static is_keyword_str(word, is_misc_type_only = false) {
        if (!is_misc_type_only) {
            if (DecreeToken.m_all_typesru.includes(word) || DecreeToken.m_all_typesua.includes(word)) 
                return true;
        }
        if (DecreeToken.m_misc_typesru.includes(word) || DecreeToken.m_misc_typesua.includes(word)) 
            return true;
        return false;
    }
    
    /**
     * Добавить новый тип НПА
     * @param _typ 
     * @param acronym 
     */
    static add_new_type(_typ, acronym = null) {
        let t = Termin._new145(_typ, DecreeTokenItemType.TYP, acronym);
        DecreeToken.m_termins.add(t);
        DecreeToken.m_keywords.add(Termin._new119(_typ, DecreeTokenItemType.TYP));
    }
    
    static get_kind(_typ) {
        if (_typ === null) 
            return DecreeKind.UNDEFINED;
        if (LanguageHelper.ends_with_ex(_typ, "КОНСТИТУЦИЯ", "КОНСТИТУЦІЯ", "КОДЕКС", null)) 
            return DecreeKind.KODEX;
        if (_typ.startsWith("ОСНОВ") && LanguageHelper.ends_with_ex(_typ, "ЗАКОНОДАТЕЛЬСТВА", "ЗАКОНОДАВСТВА", null, null)) 
            return DecreeKind.KODEX;
        if ((_typ === "УСТАВ" || _typ === "СТАТУТ" || _typ === "ХАРТИЯ") || _typ === "ХАРТІЯ" || _typ === "РЕГЛАМЕНТ") 
            return DecreeKind.USTAV;
        if ((_typ.includes("ДОГОВОР") || _typ.includes("ДОГОВІР") || _typ.includes("КОНТРАКТ")) || _typ.includes("СОГЛАШЕНИЕ") || _typ.includes("ПРОТОКОЛ")) 
            return DecreeKind.CONTRACT;
        if (_typ.startsWith("ПРОЕКТ")) 
            return DecreeKind.PROJECT;
        if (_typ === "ПРОГРАММА" || _typ === "ПРОГРАМА") 
            return DecreeKind.PROGRAM;
        if (((((_typ === "ГОСТ" || _typ === "ОСТ" || _typ === "ISO") || _typ === "СНИП" || _typ === "RFC") || _typ.includes("НОРМЫ") || _typ.includes("ПРАВИЛА")) || _typ.includes("УСЛОВИЯ") || _typ.includes("СТАНДАРТ")) || _typ === "РУКОВОДЯЩИЙ ДОКУМЕНТ" || _typ === "АВОК") 
            return DecreeKind.STANDARD;
        if ((LanguageHelper.ends_with_ex(_typ, "КОНВЕНЦИЯ", "КОНВЕНЦІЯ", null, null) || LanguageHelper.ends_with_ex(_typ, "ДОГОВОР", "ДОГОВІР", null, null) || LanguageHelper.ends_with_ex(_typ, "ПАКТ", "БИЛЛЬ", "БІЛЛЬ", null)) || LanguageHelper.ends_with_ex(_typ, "ДЕКЛАРАЦИЯ", "ДЕКЛАРАЦІЯ", null, null)) 
            return DecreeKind.KONVENTION;
        if ((((((_typ.startsWith("СОБРАНИЕ") || _typ.startsWith("ЗБОРИ") || _typ.startsWith("РЕГИСТРАЦИЯ")) || _typ.startsWith("РЕЄСТРАЦІЯ") || _typ.includes("БЮЛЛЕТЕНЬ")) || _typ.includes("БЮЛЕТЕНЬ") || _typ.includes("ВЕДОМОСТИ")) || _typ.includes("ВІДОМОСТІ") || _typ.startsWith("СВОД")) || _typ.startsWith("ЗВЕДЕННЯ") || LanguageHelper.ends_with_ex(_typ, "ГАЗЕТА", "ВЕСТИ", "ВІСТІ", null)) || _typ.includes("ВЕСТНИК") || LanguageHelper.ends_with(_typ, "ВІСНИК")) 
            return DecreeKind.PUBLISHER;
        return DecreeKind.UNDEFINED;
    }
    
    static is_law(_typ) {
        if (_typ === null) 
            return false;
        let ki = DecreeToken.get_kind(_typ);
        if (ki === DecreeKind.KODEX) 
            return true;
        if (LanguageHelper.ends_with(_typ, "ЗАКОН")) 
            return true;
        return false;
    }
    
    static _new840(_arg1, _arg2, _arg3) {
        let res = new DecreeToken(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
    
    static _new843(_arg1, _arg2, _arg3, _arg4) {
        let res = new DecreeToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        return res;
    }
    
    static _new845(_arg1, _arg2, _arg3, _arg4) {
        let res = new DecreeToken(_arg1, _arg2);
        res.typ = _arg3;
        res.ref = _arg4;
        return res;
    }
    
    static _new849(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new DecreeToken(_arg1, _arg2);
        res.typ = _arg3;
        res.ref = _arg4;
        res.value = _arg5;
        return res;
    }
    
    static _new866(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new DecreeToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        res.num_year = _arg5;
        return res;
    }
    
    static _new868(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new DecreeToken(_arg1, _arg2);
        res.typ = _arg3;
        res.ref = _arg4;
        res.morph = _arg5;
        return res;
    }
    
    static _new869(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new DecreeToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        res.morph = _arg5;
        return res;
    }
    
    static _new870(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new DecreeToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        res.morph = _arg5;
        res.is_doubtful = _arg6;
        return res;
    }
    
    static _new877(_arg1, _arg2, _arg3, _arg4) {
        let res = new DecreeToken(_arg1, _arg2);
        res.value = _arg3;
        res.morph = _arg4;
        return res;
    }
    
    static _new888(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new DecreeToken(_arg1, _arg2);
        res.typ = _arg3;
        res.morph = _arg4;
        res.value = _arg5;
        return res;
    }
    
    static static_constructor() {
        DecreeToken.m_termins = null;
        DecreeToken.m_keywords = null;
        DecreeToken.m_all_typesru = Array.from(["УКАЗ", "УКАЗАНИЕ", "ПОСТАНОВЛЕНИЕ", "РАСПОРЯЖЕНИЕ", "ПРИКАЗ", "ДИРЕКТИВА", "ПИСЬМО", "ЗАПИСКА", "ИНФОРМАЦИОННОЕ ПИСЬМО", "ИНСТРУКЦИЯ", "ЗАКОН", "КОДЕКС", "КОНСТИТУЦИЯ", "РЕШЕНИЕ", "ПОЛОЖЕНИЕ", "РАСПОРЯЖЕНИЕ", "ПОРУЧЕНИЕ", "РЕЗОЛЮЦИЯ", "ДОГОВОР", "СУБДОГОВОР", "АГЕНТСКИЙ ДОГОВОР", "ДОВЕРЕННОСТЬ", "КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ", "КОНТРАКТ", "ГОСУДАРСТВЕННЫЙ КОНТРАКТ", "ОПРЕДЕЛЕНИЕ", "ПРИГОВОР", "СОГЛАШЕНИЕ", "ПРОТОКОЛ", "ЗАЯВЛЕНИЕ", "УВЕДОМЛЕНИЕ", "РАЗЪЯСНЕНИЕ", "УСТАВ", "ХАРТИЯ", "КОНВЕНЦИЯ", "ПАКТ", "БИЛЛЬ", "ДЕКЛАРАЦИЯ", "РЕГЛАМЕНТ", "ТЕЛЕГРАММА", "ТЕЛЕФОНОГРАММА", "ТЕЛЕФАКСОГРАММА", "ТЕЛЕТАЙПОГРАММА", "ФАКСОГРАММА", "ОТВЕТЫ НА ВОПРОСЫ", "ВЫПИСКА ИЗ ПРОТОКОЛА", "ЗАКЛЮЧЕНИЕ", "ДЕКРЕТ"]);
        DecreeToken.m_all_typesua = Array.from(["УКАЗ", "НАКАЗ", "ПОСТАНОВА", "РОЗПОРЯДЖЕННЯ", "НАКАЗ", "ДИРЕКТИВА", "ЛИСТ", "ЗАПИСКА", "ІНФОРМАЦІЙНИЙ ЛИСТ", "ІНСТРУКЦІЯ", "ЗАКОН", "КОДЕКС", "КОНСТИТУЦІЯ", "РІШЕННЯ", "ПОЛОЖЕННЯ", "РОЗПОРЯДЖЕННЯ", "ДОРУЧЕННЯ", "РЕЗОЛЮЦІЯ", "ДОГОВІР", "СУБКОНТРАКТ", "АГЕНТСЬКИЙ ДОГОВІР", "ДОРУЧЕННЯ", "КОМЕРЦІЙНА ПРОПОЗИЦІЯ", "КОНТРАКТ", "ДЕРЖАВНИЙ КОНТРАКТ", "ВИЗНАЧЕННЯ", "ВИРОК", "УГОДА", "ПРОТОКОЛ", "ЗАЯВА", "ПОВІДОМЛЕННЯ", "РОЗ'ЯСНЕННЯ", "СТАТУТ", "ХАРТІЯ", "КОНВЕНЦІЯ", "ПАКТ", "БІЛЛЬ", "ДЕКЛАРАЦІЯ", "РЕГЛАМЕНТ", "ТЕЛЕГРАМА", "ТЕЛЕФОНОГРАМА", "ТЕЛЕФАКСОГРАММА", "ТЕЛЕТАЙПОГРАМА", "ФАКСОГРАМА", "ВІДПОВІДІ НА ЗАПИТАННЯ", "ВИТЯГ З ПРОТОКОЛУ", "ВИСНОВОК", "ДЕКРЕТ"]);
        DecreeToken.m_misc_typesru = Array.from(["ПРАВИЛО", "ПРОГРАММА", "ПЕРЕЧЕНЬ", "ПОСОБИЕ", "РЕКОМЕНДАЦИЯ", "НАСТАВЛЕНИЕ", "СТАНДАРТ", "СОГЛАШЕНИЕ", "МЕТОДИКА", "ТРЕБОВАНИЕ", "ПОЛОЖЕНИЕ", "СПИСОК", "ЛИСТ", "ТАБЛИЦА", "ЗАЯВКА", "АКТ", "ФОРМА", "НОРМАТИВ", "ПОРЯДОК", "ИНФОРМАЦИЯ", "НОМЕНКЛАТУРА", "ОСНОВА", "ОБЗОР", "КОНЦЕПЦИЯ", "СТРАТЕГИЯ", "СТРУКТУРА", "УСЛОВИЕ", "КЛАССИФИКАТОР", "ОБЩЕРОССИЙСКИЙ КЛАССИФИКАТОР", "СПЕЦИФИКАЦИЯ", "ОБРАЗЕЦ"]);
        DecreeToken.m_misc_typesua = Array.from(["ПРАВИЛО", "ПРОГРАМА", "ПЕРЕЛІК", "ДОПОМОГА", "РЕКОМЕНДАЦІЯ", "ПОВЧАННЯ", "СТАНДАРТ", "УГОДА", "МЕТОДИКА", "ВИМОГА", "ПОЛОЖЕННЯ", "СПИСОК", "ТАБЛИЦЯ", "ЗАЯВКА", "АКТ", "ФОРМА", "НОРМАТИВ", "ПОРЯДОК", "ІНФОРМАЦІЯ", "НОМЕНКЛАТУРА", "ОСНОВА", "ОГЛЯД", "КОНЦЕПЦІЯ", "СТРАТЕГІЯ", "СТРУКТУРА", "УМОВА", "КЛАСИФІКАТОР", "ЗАГАЛЬНОРОСІЙСЬКИЙ КЛАСИФІКАТОР", "СПЕЦИФІКАЦІЯ", "ЗРАЗОК"]);
        DecreeToken.m_std_adjectives = Array.from(["ВСЕОБЩИЙ", "МЕЖДУНАРОДНЫЙ", "ЗАГАЛЬНИЙ", "МІЖНАРОДНИЙ", "НОРМАТИВНЫЙ", "НОРМАТИВНИЙ", "КАССАЦИОННЫЙ", "АПЕЛЛЯЦИОННЫЙ", "КАСАЦІЙНИЙ", "АПЕЛЯЦІЙНИЙ"]);
        DecreeToken.m_empty_adjectives = Array.from(["НЫНЕШНИЙ", "ПРЕДЫДУЩИЙ", "ДЕЙСТВУЮЩИЙ", "НАСТОЯЩИЙ", "НИНІШНІЙ", "ПОПЕРЕДНІЙ", "СПРАВЖНІЙ"]);
    }
}


DecreeToken.static_constructor();

module.exports = DecreeToken
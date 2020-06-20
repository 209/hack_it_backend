/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");

const ReferentToken = require("./../ReferentToken");
const FioTemplateType = require("./../person/internal/FioTemplateType");
const BookLinkAnalyzerRegionTyp = require("./BookLinkAnalyzerRegionTyp");
const BookLinkTyp = require("./internal/BookLinkTyp");
const TextToken = require("./../TextToken");
const BookLinkRefType = require("./BookLinkRefType");
const Token = require("./../Token");
const GetTextAttr = require("./../core/GetTextAttr");
const PersonItemTokenParseAttr = require("./../person/internal/PersonItemTokenParseAttr");
const PersonItemTokenItemType = require("./../person/internal/PersonItemTokenItemType");
const UriReferent = require("./../uri/UriReferent");
const TitleItemTokenTypes = require("./../titlepage/internal/TitleItemTokenTypes");
const NounPhraseParseAttr = require("./../core/NounPhraseParseAttr");
const NounPhraseHelper = require("./../core/NounPhraseHelper");
const MetaBookLink = require("./internal/MetaBookLink");
const MiscHelper = require("./../core/MiscHelper");
const Referent = require("./../Referent");
const MetaBookLinkRef = require("./internal/MetaBookLinkRef");
const Termin = require("./../core/Termin");
const GeoReferent = require("./../geo/GeoReferent");
const PersonItemToken = require("./../person/internal/PersonItemToken");
const DateReferent = require("./../date/DateReferent");
const OrganizationReferent = require("./../org/OrganizationReferent");
const PersonReferent = require("./../person/PersonReferent");
const EpNerCoreInternalResourceHelper = require("./../core/internal/EpNerCoreInternalResourceHelper");
const BracketParseAttr = require("./../core/BracketParseAttr");
const MetaToken = require("./../MetaToken");
const ProcessorService = require("./../ProcessorService");
const BracketHelper = require("./../core/BracketHelper");
const BookLinkToken = require("./internal/BookLinkToken");
const BookLinkReferent = require("./BookLinkReferent");
const TitleItemToken = require("./../titlepage/internal/TitleItemToken");
const BookLinkRefReferent = require("./BookLinkRefReferent");
const Analyzer = require("./../Analyzer");
const NumberToken = require("./../NumberToken");

/**
 * Анализатор ссылок на внешнюю литературу
 */
class BookLinkAnalyzer extends Analyzer {
    
    get name() {
        return BookLinkAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Ссылки на литературу";
    }
    
    get description() {
        return "Ссылки из списка литературы";
    }
    
    /**
     * [Get] Этот анализатор является специфическим
     */
    get is_specific() {
        return false;
    }
    
    get progress_weight() {
        return 1;
    }
    
    clone() {
        return new BookLinkAnalyzer();
    }
    
    get used_extern_object_types() {
        return [DateReferent.OBJ_TYPENAME, GeoReferent.OBJ_TYPENAME, OrganizationReferent.OBJ_TYPENAME, PersonReferent.OBJ_TYPENAME];
    }
    
    get type_system() {
        return [MetaBookLink.global_meta, MetaBookLinkRef.global_meta];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(MetaBookLink.IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("booklink.png"));
        res.put(MetaBookLinkRef.IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("booklinkref.png"));
        res.put(MetaBookLinkRef.IMAGE_ID_INLINE, EpNerCoreInternalResourceHelper.get_bytes("booklinkrefinline.png"));
        res.put(MetaBookLinkRef.IMAGE_ID_LAST, EpNerCoreInternalResourceHelper.get_bytes("booklinkreflast.png"));
        return res;
    }
    
    create_referent(type) {
        if (type === BookLinkReferent.OBJ_TYPENAME) 
            return new BookLinkReferent();
        if (type === BookLinkRefReferent.OBJ_TYPENAME) 
            return new BookLinkRefReferent();
        return null;
    }
    
    process(kit) {
        let ad = kit.get_analyzer_data(this);
        let is_lit_block = 0;
        let refs_by_num = new Hashtable();
        let rts = [ ];
        for (let t = kit.first_token; t !== null; t = t.next) {
            if (t.is_char('(')) {
                let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (br !== null && br.length_char > 70 && (br.length_char < 400)) {
                    if (br.is_newline_after || ((br.end_token.next !== null && br.end_token.next.is_char_of(".;")))) {
                        rts = BookLinkAnalyzer.try_parse(t.next, false, br.end_char);
                        if (rts !== null && rts.length >= 1) {
                            if (rts.length > 1) {
                                rts[1].referent = ad.register_referent(rts[1].referent);
                                kit.embed_token(rts[1]);
                                (rts[0].referent).book = Utils.as(rts[1].referent, BookLinkReferent);
                                if (rts[0].begin_char === rts[1].begin_char) 
                                    rts[0].begin_token = rts[1];
                                if (rts[0].end_char === rts[1].end_char) 
                                    rts[0].end_token = rts[1];
                            }
                            rts[0].begin_token = t;
                            rts[0].end_token = br.end_token;
                            (rts[0].referent).typ = BookLinkRefType.INLINE;
                            rts[0].referent = ad.register_referent(rts[0].referent);
                            kit.embed_token(rts[0]);
                            t = rts[0];
                            continue;
                        }
                    }
                }
            }
            if (!t.is_newline_before) 
                continue;
            if (is_lit_block <= 0) {
                let tt = BookLinkToken.parse_start_of_lit_block(t);
                if (tt !== null) {
                    is_lit_block = 5;
                    t = tt;
                    continue;
                }
            }
            rts = BookLinkAnalyzer.try_parse(t, is_lit_block > 0, 0);
            if (rts === null || (rts.length < 1)) {
                if ((--is_lit_block) < 0) 
                    is_lit_block = 0;
                continue;
            }
            if ((++is_lit_block) > 5) 
                is_lit_block = 5;
            if (rts.length > 1) {
                rts[1].referent = ad.register_referent(rts[1].referent);
                kit.embed_token(rts[1]);
                (rts[0].referent).book = Utils.as(rts[1].referent, BookLinkReferent);
                if (rts[0].begin_char === rts[1].begin_char) 
                    rts[0].begin_token = rts[1];
                if (rts[0].end_char === rts[1].end_char) 
                    rts[0].end_token = rts[1];
            }
            let re = Utils.as(rts[0].referent, BookLinkRefReferent);
            re = Utils.as(ad.register_referent(re), BookLinkRefReferent);
            rts[0].referent = re;
            kit.embed_token(rts[0]);
            t = rts[0];
            if (re.number !== null) {
                let li = [ ];
                let wrapli386 = new RefOutArgWrapper();
                let inoutres387 = refs_by_num.tryGetValue(re.number, wrapli386);
                li = wrapli386.value;
                if (!inoutres387) 
                    refs_by_num.put(re.number, (li = new Array()));
                li.push(re);
            }
        }
        for (let t = kit.first_token; t !== null; t = t.next) {
            if (!((t instanceof TextToken))) 
                continue;
            let rt = BookLinkAnalyzer.try_parse_short_inline(t);
            if (rt === null) 
                continue;
            let re = Utils.as(rt.referent, BookLinkRefReferent);
            let li = [ ];
            let wrapli388 = new RefOutArgWrapper();
            let inoutres389 = refs_by_num.tryGetValue(Utils.notNull(re.number, ""), wrapli388);
            li = wrapli388.value;
            if (!inoutres389) 
                continue;
            let i = 0;
            for (i = 0; i < li.length; i++) {
                if (t.begin_char < li[i].occurrence[0].begin_char) 
                    break;
            }
            if (i >= li.length) 
                continue;
            re.book = li[i].book;
            if (re.pages === null) 
                re.pages = li[i].pages;
            re.typ = BookLinkRefType.INLINE;
            re = Utils.as(ad.register_referent(re), BookLinkRefReferent);
            rt.referent = re;
            kit.embed_token(rt);
            t = rt;
        }
    }
    
    static try_parse_short_inline(t) {
        if (t === null) 
            return null;
        let re = null;
        if (t.is_char('[') && !t.is_newline_before) {
            let bb = BookLinkToken.try_parse(t, 0);
            if (bb !== null && bb.typ === BookLinkTyp.NUMBER) {
                re = new BookLinkRefReferent();
                re.number = bb.value;
                return new ReferentToken(re, t, bb.end_token);
            }
        }
        if (t.is_char('(')) {
            let bbb = BookLinkToken.try_parse(t.next, 0);
            if (bbb === null) 
                return null;
            if (bbb.typ === BookLinkTyp.SEE) {
                for (let tt = bbb.end_token.next; tt !== null; tt = tt.next) {
                    if (tt.is_char_of(",:.")) 
                        continue;
                    if (tt.is_char('[')) {
                        if (((tt.next instanceof NumberToken) && tt.next.next !== null && tt.next.next.is_char(']')) && tt.next.next !== null && tt.next.next.next.is_char(')')) {
                            re = new BookLinkRefReferent();
                            re.number = (tt.next).value.toString();
                            return new ReferentToken(re, t, tt.next.next.next);
                        }
                    }
                    if ((tt instanceof NumberToken) && tt.next !== null && tt.next.is_char(')')) {
                        re = new BookLinkRefReferent();
                        re.number = (tt).value.toString();
                        return new ReferentToken(re, t, tt.next);
                    }
                    break;
                }
                return null;
            }
            if (bbb.typ === BookLinkTyp.NUMBER) {
                let tt1 = bbb.end_token.next;
                if (tt1 !== null && tt1.is_comma) 
                    tt1 = tt1.next;
                let bbb2 = BookLinkToken.try_parse(tt1, 0);
                if ((bbb2 !== null && bbb2.typ === BookLinkTyp.PAGERANGE && bbb2.end_token.next !== null) && bbb2.end_token.next.is_char(')')) {
                    re = new BookLinkRefReferent();
                    re.number = bbb.value;
                    re.pages = bbb2.value;
                    return new ReferentToken(re, t, bbb2.end_token.next);
                }
            }
        }
        return null;
    }
    
    static try_parse(t, is_in_lit, max_char = 0) {
        if (t === null) 
            return null;
        let is_bracket_regime = false;
        if (t.previous !== null && t.previous.is_char('(')) 
            is_bracket_regime = true;
        let blt = BookLinkToken.try_parse(t, 0);
        if (blt === null) 
            blt = BookLinkToken.try_parse_author(t, FioTemplateType.UNDEFINED);
        if (blt === null && !is_bracket_regime) 
            return null;
        let t0 = t;
        let coef = 0;
        let is_electr_res = false;
        let decree = null;
        let regtyp = BookLinkAnalyzerRegionTyp.UNDEFINED;
        let num = null;
        let spec_see = null;
        let book_prev = null;
        if (is_bracket_regime) 
            regtyp = BookLinkAnalyzerRegionTyp.AUTHORS;
        else if (blt.typ === BookLinkTyp.PERSON) {
            if (!is_in_lit) 
                return null;
            regtyp = BookLinkAnalyzerRegionTyp.AUTHORS;
        }
        else if (blt.typ === BookLinkTyp.NUMBER) {
            num = blt.value;
            t = blt.end_token.next;
            if (t === null || t.is_newline_before) 
                return null;
            if (!t.is_whitespace_before) {
                if (t instanceof NumberToken) {
                    let n = (t).value;
                    if ((((n === "3" || n === "0")) && !t.is_whitespace_after && (t.next instanceof TextToken)) && t.next.chars.is_all_lower) {
                    }
                    else 
                        return null;
                }
                else if (!((t instanceof TextToken)) || t.chars.is_all_lower) {
                    let r = t.get_referent();
                    if (r instanceof PersonReferent) {
                    }
                    else if (is_in_lit && r !== null && r.type_name === "DECREE") {
                    }
                    else 
                        return null;
                }
            }
            for (; t !== null; t = t.next) {
                if (t instanceof NumberToken) 
                    break;
                if (!((t instanceof TextToken))) 
                    break;
                if (BracketHelper.can_be_start_of_sequence(t, true, false)) 
                    break;
                if (!t.chars.is_letter) 
                    continue;
                let bbb = BookLinkToken.try_parse(t, 0);
                if (bbb !== null) {
                    if (bbb.typ === BookLinkTyp.TAMZE) {
                        spec_see = bbb;
                        t = bbb.end_token.next;
                        break;
                    }
                    if (bbb.typ === BookLinkTyp.SEE) {
                        t = bbb.end_token;
                        continue;
                    }
                }
                break;
            }
            if (spec_see !== null && spec_see.typ === BookLinkTyp.TAMZE) {
                coef++;
                let max = 1000;
                for (let tt = t0; tt !== null && max > 0; tt = tt.previous,max--) {
                    if (tt.get_referent() instanceof BookLinkRefReferent) {
                        book_prev = (tt.get_referent()).book;
                        break;
                    }
                }
            }
            let blt1 = BookLinkToken.try_parse_author(t, FioTemplateType.UNDEFINED);
            if (blt1 !== null && blt1.typ === BookLinkTyp.PERSON) 
                regtyp = BookLinkAnalyzerRegionTyp.AUTHORS;
            else {
                let ok = false;
                for (let tt = t; tt !== null; tt = (tt === null ? null : tt.next)) {
                    if (tt.is_newline_before) 
                        break;
                    if (is_in_lit && tt.get_referent() !== null && tt.get_referent().type_name === "DECREE") {
                        ok = true;
                        decree = tt;
                        break;
                    }
                    let bbb = BookLinkToken.try_parse(tt, 0);
                    if (bbb === null) 
                        continue;
                    if (bbb.typ === BookLinkTyp.ELECTRONRES) {
                        is_electr_res = true;
                        ok = true;
                        break;
                    }
                    if (bbb.typ === BookLinkTyp.DELIMETER) {
                        tt = bbb.end_token.next;
                        if (BookLinkToken.try_parse_author(tt, FioTemplateType.UNDEFINED) !== null) {
                            ok = true;
                            break;
                        }
                        bbb = BookLinkToken.try_parse(tt, 0);
                        if (bbb !== null) {
                            if (bbb.typ === BookLinkTyp.EDITORS || bbb.typ === BookLinkTyp.TRANSLATE || bbb.typ === BookLinkTyp.SOSTAVITEL) {
                                ok = true;
                                break;
                            }
                        }
                    }
                }
                if (!ok && !is_in_lit) {
                    if (BookLinkToken.check_link_before(t0, num)) {
                    }
                    else 
                        return null;
                }
                regtyp = BookLinkAnalyzerRegionTyp.NAME;
            }
        }
        else 
            return null;
        let res = new BookLinkReferent();
        let corr_authors = new Array();
        let t00 = t;
        let blt00 = null;
        let start_of_name = null;
        let prev_pers_templ = FioTemplateType.UNDEFINED;
        if (regtyp === BookLinkAnalyzerRegionTyp.AUTHORS) {
            for (; t !== null; t = t.next) {
                if (max_char > 0 && t.begin_char >= max_char) 
                    break;
                if (t.is_char_of(".;") || t.is_comma_and) 
                    continue;
                if (t.is_char('/')) 
                    break;
                if ((t.is_char('(') && t.next !== null && t.next.is_value("EDS", null)) && t.next.next !== null && t.next.next.is_char(')')) {
                    t = t.next.next.next;
                    break;
                }
                blt = BookLinkToken.try_parse_author(t, prev_pers_templ);
                if (blt === null && t.previous !== null && t.previous.is_and) 
                    blt = BookLinkToken.try_parse_author(t.previous, FioTemplateType.UNDEFINED);
                if (blt === null) {
                    if ((t.get_referent() instanceof OrganizationReferent) && blt00 !== null) {
                        let bbb2 = BookLinkToken.try_parse(t.next, 0);
                        if (bbb2 !== null) {
                            if (bbb2.typ === BookLinkTyp.YEAR) {
                                res.add_slot(BookLinkReferent.ATTR_AUTHOR, t.get_referent(), false, 0);
                                res.year = Utils.parseInt(bbb2.value);
                                coef += 0.5;
                                t = bbb2.end_token.next;
                            }
                        }
                    }
                    break;
                }
                if (blt.typ === BookLinkTyp.PERSON) {
                    let tt2 = blt.end_token.next;
                    let bbb2 = BookLinkToken.try_parse(tt2, 0);
                    if (bbb2 !== null) {
                        if (bbb2.typ === BookLinkTyp.YEAR) {
                            res.year = Utils.parseInt(bbb2.value);
                            coef += 0.5;
                            blt.end_token = bbb2.end_token;
                            blt00 = null;
                        }
                    }
                    if (blt00 !== null && ((blt00.end_token.next === blt.begin_token || blt.begin_token.previous.is_char('.')))) {
                        let tt11 = blt.end_token.next;
                        let nex = BookLinkToken.try_parse(tt11, 0);
                        if (nex !== null && nex.typ === BookLinkTyp.ANDOTHERS) {
                        }
                        else {
                            if (tt11 === null) 
                                break;
                            if (tt11.is_char('/') && tt11.next !== null && tt11.next.is_char('/')) 
                                break;
                            if (tt11.is_char(':')) 
                                break;
                            if ((blt.toString().indexOf('.') < 0) && blt00.toString().indexOf('.') > 0) 
                                break;
                            if ((tt11 instanceof TextToken) && tt11.chars.is_all_lower) 
                                break;
                            if (tt11.is_char_of(",.;") && tt11.next !== null) 
                                tt11 = tt11.next;
                            nex = BookLinkToken.try_parse(tt11, 0);
                            if (nex !== null && nex.typ !== BookLinkTyp.PERSON && nex.typ !== BookLinkTyp.ANDOTHERS) 
                                break;
                        }
                    }
                    else if ((blt00 !== null && blt00.person_template !== FioTemplateType.UNDEFINED && blt.person_template !== blt00.person_template) && blt.person_template === FioTemplateType.NAMESURNAME) {
                        if (blt.end_token.next === null || !blt.end_token.next.is_comma_and) 
                            break;
                        if (BookLinkToken.try_parse_author(blt.end_token.next.next, FioTemplateType.UNDEFINED) !== null) {
                        }
                        else 
                            break;
                    }
                    if (blt00 === null && blt.person_template === FioTemplateType.NAMESURNAME) {
                        let tt = blt.end_token.next;
                        if (tt !== null && tt.is_hiphen) 
                            tt = tt.next;
                        if (tt instanceof NumberToken) 
                            break;
                    }
                    BookLinkAnalyzer._add_author(res, blt);
                    coef++;
                    t = blt.end_token;
                    if (t.get_referent() instanceof PersonReferent) 
                        corr_authors.push(Utils.as(t, ReferentToken));
                    blt00 = blt;
                    prev_pers_templ = blt.person_template;
                    if ((((start_of_name = blt.start_of_name))) !== null) {
                        t = t.next;
                        break;
                    }
                    continue;
                }
                if (blt.typ === BookLinkTyp.ANDOTHERS) {
                    coef += 0.5;
                    t = blt.end_token.next;
                    res.authors_and_other = true;
                    break;
                }
                break;
            }
        }
        if (t === null) 
            return null;
        if ((t.is_newline_before && t !== t0 && num === null) && res.find_slot(BookLinkReferent.ATTR_AUTHOR, null, true) === null) 
            return null;
        if (start_of_name === null) {
            if (t.chars.is_all_lower) 
                coef -= (1);
            if (t.chars.is_latin_letter && !is_electr_res && num === null) {
                if (res.get_slot_value(BookLinkReferent.ATTR_AUTHOR) === null) 
                    return null;
            }
        }
        let tn0 = t;
        let tn1 = null;
        let uri = null;
        let next_num = null;
        let nn = 0;
        let wrapnn394 = new RefOutArgWrapper();
        let inoutres395 = Utils.tryParseInt((num != null ? num : ""), wrapnn394);
        nn = wrapnn394.value;
        if (inoutres395) 
            next_num = (nn + 1).toString();
        let br = (BracketHelper.can_be_start_of_sequence(t, true, false) ? BracketHelper.try_parse(t, BracketParseAttr.of((BracketParseAttr.CANCONTAINSVERBS.value()) | (BracketParseAttr.CANBEMANYLINES.value())), 100) : null);
        if (br !== null) 
            t = t.next;
        let pages = null;
        for (; t !== null; t = t.next) {
            if (max_char > 0 && t.begin_char >= max_char) 
                break;
            if (br !== null && br.end_token === t) {
                tn1 = t;
                break;
            }
            let tit = TitleItemToken.try_attach(t);
            if (tit !== null) {
                if ((tit.typ === TitleItemTokenTypes.TYP && tn0 === t && br === null) && BracketHelper.can_be_start_of_sequence(tit.end_token.next, true, false)) {
                    br = BracketHelper.try_parse(tit.end_token.next, BracketParseAttr.NO, 100);
                    if (br !== null) {
                        coef += (1);
                        if (num !== null) 
                            coef++;
                        tn0 = br.begin_token;
                        tn1 = br.end_token;
                        res.typ = tit.value.toLowerCase();
                        t = br.end_token.next;
                        break;
                    }
                }
            }
            if (t.is_newline_before && t !== tn0) {
                if (br !== null && (t.end_char < br.end_char)) {
                }
                else if (!MiscHelper.can_be_start_of_sentence(t)) {
                }
                else {
                    if (t.newlines_before_count > 1) 
                        break;
                    if ((t instanceof NumberToken) && num !== null && (t).int_value !== null) {
                        if (num === ((t).int_value - 1).toString()) 
                            break;
                    }
                    else if (num !== null) {
                    }
                    else {
                        let nnn = NounPhraseHelper.try_parse(t.previous, NounPhraseParseAttr.of(((NounPhraseParseAttr.PARSEPREPOSITION.value()) | (NounPhraseParseAttr.PARSEADVERBS.value()) | (NounPhraseParseAttr.PARSENUMERICASADJECTIVE.value())) | (NounPhraseParseAttr.MULTILINES.value())), 0, null);
                        if (nnn !== null && nnn.end_char >= t.end_char) {
                        }
                        else 
                            break;
                    }
                }
            }
            if (t.is_char_of(".;") && t.whitespaces_after_count > 0) {
                if ((((tit = TitleItemToken.try_attach(t.next)))) !== null) {
                    if (tit.typ === TitleItemTokenTypes.TYP) 
                        break;
                }
                let stop = true;
                let words = 0;
                let notwords = 0;
                for (let tt = t.next; tt !== null; tt = tt.next) {
                    let blt0 = BookLinkToken.try_parse(tt, 0);
                    if (blt0 === null) {
                        if (tt.is_newline_before) 
                            break;
                        if ((tt instanceof TextToken) && !tt.get_morph_class_in_dictionary().is_undefined) 
                            words++;
                        else 
                            notwords++;
                        if (words > 6 && words > (notwords * 4)) {
                            stop = false;
                            break;
                        }
                        continue;
                    }
                    if ((blt0.typ === BookLinkTyp.DELIMETER || blt0.typ === BookLinkTyp.TRANSLATE || blt0.typ === BookLinkTyp.TYPE) || blt0.typ === BookLinkTyp.GEO || blt0.typ === BookLinkTyp.PRESS) 
                        stop = false;
                    break;
                }
                if (br !== null && br.end_token.previous.end_char > t.end_char) 
                    stop = false;
                if (stop) 
                    break;
            }
            if (t === decree) {
                t = t.next;
                break;
            }
            blt = BookLinkToken.try_parse(t, 0);
            if (blt === null) {
                tn1 = t;
                continue;
            }
            if (blt.typ === BookLinkTyp.DELIMETER) 
                break;
            if (((blt.typ === BookLinkTyp.MISC || blt.typ === BookLinkTyp.TRANSLATE || blt.typ === BookLinkTyp.NAMETAIL) || blt.typ === BookLinkTyp.TYPE || blt.typ === BookLinkTyp.VOLUME) || blt.typ === BookLinkTyp.PAGERANGE || blt.typ === BookLinkTyp.PAGES) {
                coef++;
                break;
            }
            if (blt.typ === BookLinkTyp.GEO || blt.typ === BookLinkTyp.PRESS) {
                if (t.previous.is_hiphen || t.previous.is_char_of(".;") || blt.add_coef > 0) 
                    break;
            }
            if (blt.typ === BookLinkTyp.YEAR) {
                if (t.previous !== null && t.previous.is_comma) 
                    break;
            }
            if (blt.typ === BookLinkTyp.ELECTRONRES) {
                is_electr_res = true;
                break;
            }
            if (blt.typ === BookLinkTyp.URL) {
                if (t === tn0 || t.previous.is_char_of(":.")) {
                    is_electr_res = true;
                    break;
                }
            }
            tn1 = t;
        }
        if (tn1 === null && start_of_name === null) {
            if (is_electr_res) {
                let uri_re = new BookLinkReferent();
                let rt0 = new ReferentToken(uri_re, t00, t);
                let rts0 = new Array();
                let bref0 = BookLinkRefReferent._new390(uri_re);
                if (num !== null) 
                    bref0.number = num;
                let rt01 = new ReferentToken(bref0, t0, rt0.end_token);
                let ok = false;
                for (; t !== null; t = t.next) {
                    if (t.is_newline_before) 
                        break;
                    let blt0 = BookLinkToken.try_parse(t, 0);
                    if (blt0 !== null) {
                        if (blt0.ref instanceof UriReferent) {
                            uri_re.add_slot(BookLinkReferent.ATTR_URL, Utils.as(blt0.ref, UriReferent), false, 0);
                            ok = true;
                        }
                        t = blt0.end_token;
                    }
                    rt0.end_token = rt01.end_token = t;
                }
                if (ok) {
                    rts0.push(rt01);
                    rts0.push(rt0);
                    return rts0;
                }
            }
            if (decree !== null && num !== null) {
                let rts0 = new Array();
                let bref0 = BookLinkRefReferent._new390(decree.get_referent());
                if (num !== null) 
                    bref0.number = num;
                let rt01 = new ReferentToken(bref0, t0, decree);
                for (t = decree.next; t !== null; t = t.next) {
                    if (t.is_newline_before) 
                        break;
                    if (t instanceof TextToken) {
                        if ((t).is_pure_verb) 
                            return null;
                    }
                    rt01.end_token = t;
                }
                rts0.push(rt01);
                return rts0;
            }
            if (book_prev !== null) {
                let tt = t;
                while (tt !== null && ((tt.is_char_of(",.") || tt.is_hiphen))) {
                    tt = tt.next;
                }
                let blt0 = BookLinkToken.try_parse(tt, 0);
                if (blt0 !== null && blt0.typ === BookLinkTyp.PAGERANGE) {
                    let rts0 = new Array();
                    let bref0 = BookLinkRefReferent._new390(book_prev);
                    if (num !== null) 
                        bref0.number = num;
                    bref0.pages = blt0.value;
                    let rt00 = new ReferentToken(bref0, t0, blt0.end_token);
                    rts0.push(rt00);
                    return rts0;
                }
            }
            return null;
        }
        if (br !== null && ((tn1 === br.end_token || tn1 === br.end_token.previous))) {
            tn0 = tn0.next;
            tn1 = tn1.previous;
        }
        if (start_of_name === null) {
            while (tn0 !== null) {
                if (tn0.is_char_of(":,~")) 
                    tn0 = tn0.next;
                else 
                    break;
            }
        }
        for (; tn1 !== null && tn1.begin_char > tn0.begin_char; tn1 = tn1.previous) {
            if (tn1.is_char_of(".;,:(~") || tn1.is_hiphen || tn1.is_value("РЕД", null)) {
            }
            else 
                break;
        }
        let nam = MiscHelper.get_text_value(tn0, tn1, GetTextAttr.of((GetTextAttr.KEEPQUOTES.value()) | (GetTextAttr.KEEPREGISTER.value())));
        if (start_of_name !== null) {
            if (nam === null || (nam.length < 3)) 
                nam = start_of_name;
            else 
                nam = (start_of_name + (tn0.is_whitespace_before ? " " : "") + nam);
        }
        if (nam === null) 
            return null;
        res.name = nam;
        if (num === null && !is_in_lit) {
            if (nam.length < 20) 
                return null;
            coef -= (2);
        }
        if (nam.length > 500) 
            coef -= (Utils.intDiv(nam.length, 500));
        if (is_bracket_regime) 
            coef--;
        if (nam.length > 200) {
            if (num === null) 
                return null;
            if (res.find_slot(BookLinkReferent.ATTR_AUTHOR, null, true) === null && !BookLinkToken.check_link_before(t0, num)) 
                return null;
        }
        let en = 0;
        let ru = 0;
        let ua = 0;
        let cha = 0;
        let nocha = 0;
        let chalen = 0;
        let lt0 = tn0;
        let lt1 = tn1;
        if (tn1 === null) {
            if (t === null) 
                return null;
            lt0 = t0;
            lt1 = t;
            tn1 = t.previous;
        }
        for (let tt = lt0; tt !== null && tt.end_char <= lt1.end_char; tt = tt.next) {
            if ((tt instanceof TextToken) && tt.chars.is_letter) {
                if (tt.chars.is_latin_letter) 
                    en++;
                else if (tt.morph.language.is_ua) 
                    ua++;
                else if (tt.morph.language.is_ru) 
                    ru++;
                if (tt.length_char > 2) {
                    cha++;
                    chalen += tt.length_char;
                }
            }
            else if (!((tt instanceof ReferentToken))) 
                nocha++;
        }
        if (ru > (ua + en)) 
            res.lang = "RU";
        else if (ua > (ru + en)) 
            res.lang = "UA";
        else if (en > (ru + ua)) 
            res.lang = "EN";
        if (nocha > 3 && nocha > cha && start_of_name === null) {
            if (nocha > (Utils.intDiv(chalen, 3))) 
                coef -= (2);
        }
        if (res.lang === "EN") {
            for (let tt = tn0.next; tt !== null && (tt.end_char < tn1.end_char); tt = tt.next) {
                if (tt.is_comma && tt.next !== null && ((!tt.next.chars.is_all_lower || (tt.next instanceof ReferentToken)))) {
                    if (tt.next.next !== null && tt.next.next.is_comma_and) {
                        if (tt.next instanceof ReferentToken) {
                        }
                        else 
                            continue;
                    }
                    nam = MiscHelper.get_text_value(tn0, tt.previous, GetTextAttr.of((GetTextAttr.KEEPQUOTES.value()) | (GetTextAttr.KEEPREGISTER.value())));
                    if (nam !== null && nam.length > 15) {
                        res.name = nam;
                        break;
                    }
                }
            }
        }
        let rt = new ReferentToken(res, t00, tn1);
        let authors = true;
        let edits = false;
        br = null;
        for (; t !== null; t = t.next) {
            if (max_char > 0 && t.begin_char >= max_char) 
                break;
            if (BracketHelper.can_be_start_of_sequence(t, false, false)) {
                br = BracketHelper.try_parse(t, BracketParseAttr.CANBEMANYLINES, 100);
                if (br !== null && br.length_char > 300) 
                    br = null;
            }
            blt = BookLinkToken.try_parse(t, 0);
            if (t.is_newline_before && !t.is_char('/') && !t.previous.is_char('/')) {
                if (blt !== null && blt.typ === BookLinkTyp.NUMBER) 
                    break;
                if (t.previous.is_char_of(":")) {
                }
                else if (blt !== null && ((((blt.typ === BookLinkTyp.DELIMETER || blt.typ === BookLinkTyp.PAGERANGE || blt.typ === BookLinkTyp.PAGES) || blt.typ === BookLinkTyp.GEO || blt.typ === BookLinkTyp.PRESS) || blt.typ === BookLinkTyp.N))) {
                }
                else if (num !== null && BookLinkToken.try_parse_author(t, FioTemplateType.UNDEFINED) !== null) {
                }
                else if (num !== null && blt !== null && blt.typ !== BookLinkTyp.NUMBER) {
                }
                else if (br !== null && (t.end_char < br.end_char) && t.begin_char > br.begin_char) {
                }
                else {
                    let ok = false;
                    let mmm = 50;
                    for (let tt = t.next; tt !== null && mmm > 0; tt = tt.next,mmm--) {
                        if (tt.is_newline_before) {
                            let blt2 = BookLinkToken.try_parse(tt, 0);
                            if (blt2 !== null && blt2.typ === BookLinkTyp.NUMBER && blt2.value === next_num) {
                                ok = true;
                                break;
                            }
                            if (blt2 !== null) {
                                if (blt2.typ === BookLinkTyp.PAGES || blt2.typ === BookLinkTyp.GEO || blt2.typ === BookLinkTyp.PRESS) {
                                    ok = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (!ok) {
                        let npt = NounPhraseHelper.try_parse(t.previous, NounPhraseParseAttr.of(((NounPhraseParseAttr.MULTILINES.value()) | (NounPhraseParseAttr.PARSEADVERBS.value()) | (NounPhraseParseAttr.PARSEPREPOSITION.value())) | (NounPhraseParseAttr.PARSEVERBS.value()) | (NounPhraseParseAttr.PARSEPRONOUNS.value())), 0, null);
                        if (npt !== null && npt.end_char >= t.end_char) 
                            ok = true;
                    }
                    if (!ok) 
                        break;
                }
            }
            rt.end_token = t;
            if (blt !== null) 
                rt.end_token = blt.end_token;
            if (t.is_char_of(".,") || t.is_hiphen) 
                continue;
            if (t.is_value("С", null)) {
            }
            if (regtyp === BookLinkAnalyzerRegionTyp.FIRST && blt !== null && blt.typ === BookLinkTyp.EDITORS) {
                edits = true;
                t = blt.end_token;
                coef++;
                continue;
            }
            if (regtyp === BookLinkAnalyzerRegionTyp.FIRST && blt !== null && blt.typ === BookLinkTyp.SOSTAVITEL) {
                edits = false;
                t = blt.end_token;
                coef++;
                continue;
            }
            if (regtyp === BookLinkAnalyzerRegionTyp.FIRST && authors) {
                let blt2 = BookLinkToken.try_parse_author(t, prev_pers_templ);
                if (blt2 !== null && blt2.typ === BookLinkTyp.PERSON) {
                    prev_pers_templ = blt2.person_template;
                    if (!edits) 
                        BookLinkAnalyzer._add_author(res, blt2);
                    coef++;
                    t = blt2.end_token;
                    continue;
                }
                if (blt2 !== null && blt2.typ === BookLinkTyp.ANDOTHERS) {
                    if (!edits) 
                        res.authors_and_other = true;
                    coef++;
                    t = blt2.end_token;
                    continue;
                }
                authors = false;
            }
            if (blt === null) 
                continue;
            if (blt.typ === BookLinkTyp.ELECTRONRES || blt.typ === BookLinkTyp.URL) {
                is_electr_res = true;
                if (blt.typ === BookLinkTyp.ELECTRONRES) 
                    coef += 1.5;
                else 
                    coef += 0.5;
                if (blt.ref instanceof UriReferent) 
                    res.add_slot(BookLinkReferent.ATTR_URL, Utils.as(blt.ref, UriReferent), false, 0);
            }
            else if (blt.typ === BookLinkTyp.YEAR) {
                if (res.year === 0) {
                    res.year = Utils.parseInt(blt.value);
                    coef += 0.5;
                }
            }
            else if (blt.typ === BookLinkTyp.DELIMETER) {
                coef++;
                if (blt.length_char === 2) 
                    regtyp = BookLinkAnalyzerRegionTyp.SECOND;
                else 
                    regtyp = BookLinkAnalyzerRegionTyp.FIRST;
            }
            else if ((((blt.typ === BookLinkTyp.MISC || blt.typ === BookLinkTyp.TYPE || blt.typ === BookLinkTyp.PAGES) || blt.typ === BookLinkTyp.NAMETAIL || blt.typ === BookLinkTyp.TRANSLATE) || blt.typ === BookLinkTyp.PRESS || blt.typ === BookLinkTyp.VOLUME) || blt.typ === BookLinkTyp.N) 
                coef++;
            else if (blt.typ === BookLinkTyp.PAGERANGE) {
                pages = blt;
                coef++;
                if (is_bracket_regime && blt.end_token.next !== null && blt.end_token.next.is_char(')')) {
                    coef += (2);
                    if (res.name !== null && res.find_slot(BookLinkReferent.ATTR_AUTHOR, null, true) !== null) 
                        coef = 10;
                }
            }
            else if (blt.typ === BookLinkTyp.GEO && ((regtyp === BookLinkAnalyzerRegionTyp.SECOND || regtyp === BookLinkAnalyzerRegionTyp.FIRST))) 
                coef++;
            else if (blt.typ === BookLinkTyp.GEO && t.previous !== null && t.previous.is_char('.')) 
                coef++;
            else if (blt.typ === BookLinkTyp.ANDOTHERS) {
                coef++;
                if (authors) 
                    res.authors_and_other = true;
            }
            coef += blt.add_coef;
            t = blt.end_token;
        }
        if ((coef < 2.5) && num !== null) {
            if (BookLinkToken.check_link_before(t0, num)) 
                coef += (2);
            else if (BookLinkToken.check_link_after(rt.end_token, num)) 
                coef += (1);
        }
        if (rt.length_char > 500) 
            return null;
        if (is_in_lit) 
            coef++;
        if (coef < 2.5) {
            if (is_electr_res && uri !== null) {
            }
            else if (coef >= 2 && is_in_lit) {
            }
            else 
                return null;
        }
        for (const rr of corr_authors) {
            let pits0 = PersonItemToken.try_attach_list(rr.begin_token, null, PersonItemTokenParseAttr.CANINITIALBEDIGIT, 10);
            if (pits0 === null || (pits0.length < 2)) 
                continue;
            if (pits0[0].typ === PersonItemTokenItemType.VALUE) {
                let exi = false;
                for (let i = rr.referent.slots.length - 1; i >= 0; i--) {
                    let s = rr.referent.slots[i];
                    if (s.type_name === PersonReferent.ATTR_LASTNAME) {
                        let ln = Utils.asString(s.value);
                        if (ln === null) 
                            continue;
                        if (ln === pits0[0].value) {
                            exi = true;
                            continue;
                        }
                        if (ln.indexOf('-') > 0) 
                            ln = ln.substring(0, 0 + ln.indexOf('-'));
                        if (pits0[0].begin_token.is_value(ln, null)) 
                            rr.referent.slots.splice(i, 1);
                    }
                }
                if (!exi) 
                    rr.referent.add_slot(PersonReferent.ATTR_LASTNAME, pits0[0].value, false, 0);
            }
        }
        let rts = new Array();
        let bref = BookLinkRefReferent._new390(res);
        if (num !== null) 
            bref.number = num;
        let rt1 = new ReferentToken(bref, t0, rt.end_token);
        if (pages !== null) {
            if (pages.value !== null) 
                bref.pages = pages.value;
            rt.end_token = pages.begin_token.previous;
        }
        rts.push(rt1);
        rts.push(rt);
        return rts;
    }
    
    static _add_author(blr, tok) {
        if (tok.ref !== null) 
            blr.add_slot(BookLinkReferent.ATTR_AUTHOR, tok.ref, false, 0);
        else if (tok.tok !== null) {
            blr.add_slot(BookLinkReferent.ATTR_AUTHOR, tok.tok.referent, false, 0);
            blr.add_ext_referent(tok.tok);
        }
        else if (tok.value !== null) 
            blr.add_slot(BookLinkReferent.ATTR_AUTHOR, tok.value, false, 0);
    }
    
    static initialize() {
        MetaBookLink.initialize2();
        MetaBookLinkRef.initialize();
        try {
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
            BookLinkToken.initialize();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
        } catch (ex) {
            throw new Error(ex.message);
        }
        ProcessorService.register_analyzer(new BookLinkAnalyzer());
    }
    
    static static_constructor() {
        BookLinkAnalyzer.ANALYZER_NAME = "BOOKLINK";
    }
}


BookLinkAnalyzer.static_constructor();

module.exports = BookLinkAnalyzer
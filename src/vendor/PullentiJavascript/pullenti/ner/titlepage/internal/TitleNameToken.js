/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const DenominationReferent = require("./../../denomination/DenominationReferent");
const DateReferent = require("./../../date/DateReferent");
const NumberToken = require("./../../NumberToken");
const GeoReferent = require("./../../geo/GeoReferent");
const PersonReferent = require("./../../person/PersonReferent");
const BracketHelper = require("./../../core/BracketHelper");
const UriReferent = require("./../../uri/UriReferent");
const MorphNumber = require("./../../../morph/MorphNumber");
const TextToken = require("./../../TextToken");
const PersonAttrTokenPersonAttrAttachAttrs = require("./../../person/internal/PersonAttrTokenPersonAttrAttachAttrs");
const PhoneReferent = require("./../../phone/PhoneReferent");
const NumberSpellingType = require("./../../NumberSpellingType");
const PersonAttrToken = require("./../../person/internal/PersonAttrToken");
const TitleItemTokenTypes = require("./TitleItemTokenTypes");
const BookLinkTyp = require("./../../booklink/internal/BookLinkTyp");
const MetaToken = require("./../../MetaToken");
const OrgItemTypeToken = require("./../../org/internal/OrgItemTypeToken");
const TitleItemToken = require("./TitleItemToken");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const OrganizationReferent = require("./../../org/OrganizationReferent");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const FioTemplateType = require("./../../person/internal/FioTemplateType");
const BookLinkToken = require("./../../booklink/internal/BookLinkToken");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");

/**
 * Название статьи
 */
class TitleNameToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.rank = 0;
        this.begin_name_token = null;
        this.end_name_token = null;
        this.type_value = null;
        this.speciality = null;
    }
    
    toString() {
        if (this.begin_name_token === null || this.end_name_token === null) 
            return "?";
        let mt = new MetaToken(this.begin_name_token, this.end_name_token);
        if (this.type_value === null) 
            return (String(this.rank) + ": " + mt.toString());
        else 
            return (String(this.rank) + ": " + mt.toString() + " (" + this.type_value + ")");
    }
    
    static sort(li) {
        for (let k = 0; k < li.length; k++) {
            let ch = false;
            for (let i = 0; i < (li.length - 1); i++) {
                if (li[i].rank < li[i + 1].rank) {
                    ch = true;
                    let v = li[i];
                    li[i] = li[i + 1];
                    li[i + 1] = v;
                }
            }
            if (!ch) 
                break;
        }
    }
    
    static can_be_start_of_text_or_content(begin, end) {
        let t = null;
        if (begin.is_value("СОДЕРЖАНИЕ", "ЗМІСТ") || begin.is_value("ОГЛАВЛЕНИЕ", null) || begin.is_value("СОДЕРЖИМОЕ", null)) {
            t = begin;
            if (t.next !== null && t.next.is_char_of(":.")) 
                t = t.next;
            if (t === end) 
                return true;
        }
        if (begin.is_value("ОТ", "ВІД") && begin.next !== null && begin.next.is_value("РЕДАКЦИЯ", "РЕДАКЦІЯ")) {
            if (begin.next.next !== null && begin.next.next.is_char(':')) 
                return true;
        }
        let words = 0;
        let verbs = 0;
        for (t = begin; t !== end.next; t = t.next) {
            if (t instanceof TextToken) {
                if (t.chars.is_letter) 
                    words++;
                if (t.chars.is_all_lower && (t).is_pure_verb) 
                    verbs++;
            }
        }
        if (words > 10 && verbs > 1) 
            return true;
        return false;
    }
    
    static try_parse(begin, end, min_newlines_count) {
        let res = new TitleNameToken(begin, end);
        if (!res.calc_rank_and_value(min_newlines_count)) 
            return null;
        if (res.begin_name_token === null || res.end_name_token === null) 
            return null;
        return res;
    }
    
    calc_rank_and_value(min_newlines_count) {
        this.rank = 0;
        if (this.begin_token.chars.is_all_lower) 
            this.rank -= 30;
        let words = 0;
        let up_words = 0;
        let notwords = 0;
        let line_number = 0;
        let tstart = this.begin_token;
        let tend = this.end_token;
        for (let t = this.begin_token; t !== this.end_token.next && t !== null && t.end_char <= this.end_token.end_char; t = t.next) {
            if (t.is_newline_before) {
            }
            let tit = TitleItemToken.try_attach(t);
            if (tit !== null) {
                if (tit.typ === TitleItemTokenTypes.THEME || tit.typ === TitleItemTokenTypes.TYPANDTHEME) {
                    if (t !== this.begin_token) {
                        if (line_number > 0) 
                            return false;
                        words = (up_words = (notwords = 0));
                        tstart = tit.end_token.next;
                    }
                    t = tit.end_token;
                    if (t.next === null) 
                        return false;
                    if (t.next.chars.is_letter && t.next.chars.is_all_lower) 
                        this.rank += 20;
                    else 
                        this.rank += 100;
                    tstart = t.next;
                    if (tit.typ === TitleItemTokenTypes.TYPANDTHEME) 
                        this.type_value = tit.value;
                    continue;
                }
                if (tit.typ === TitleItemTokenTypes.TYP) {
                    if (t === this.begin_token) {
                        if (tit.end_token.is_newline_after) {
                            this.type_value = tit.value;
                            this.rank += 5;
                            tstart = tit.end_token.next;
                        }
                    }
                    t = tit.end_token;
                    words++;
                    if (tit.begin_token !== tit.end_token) 
                        words++;
                    if (tit.chars.is_all_upper) 
                        up_words++;
                    continue;
                }
                if (tit.typ === TitleItemTokenTypes.DUST || tit.typ === TitleItemTokenTypes.SPECIALITY) {
                    if (t === this.begin_token) 
                        return false;
                    this.rank -= 20;
                    if (tit.typ === TitleItemTokenTypes.SPECIALITY) 
                        this.speciality = tit.value;
                    t = tit.end_token;
                    continue;
                }
                if (tit.typ === TitleItemTokenTypes.CONSULTANT || tit.typ === TitleItemTokenTypes.BOSS || tit.typ === TitleItemTokenTypes.EDITOR) {
                    t = tit.end_token;
                    if (t.next !== null && ((t.next.is_char_of(":") || t.next.is_hiphen || t.whitespaces_after_count > 4))) 
                        this.rank -= 10;
                    else 
                        this.rank -= 2;
                    continue;
                }
                return false;
            }
            let blt = BookLinkToken.try_parse(t, 0);
            if (blt !== null) {
                if (blt.typ === BookLinkTyp.MISC || blt.typ === BookLinkTyp.N || blt.typ === BookLinkTyp.PAGES) 
                    this.rank -= 10;
                else if (blt.typ === BookLinkTyp.N || blt.typ === BookLinkTyp.PAGERANGE) 
                    this.rank -= 20;
            }
            if (t === this.begin_token && BookLinkToken.try_parse_author(t, FioTemplateType.UNDEFINED) !== null) 
                this.rank -= 20;
            if (t.is_newline_before && t !== this.begin_token) {
                line_number++;
                if (line_number > 4) 
                    return false;
                if (t.chars.is_all_lower) 
                    this.rank += 10;
                else if (t.previous.is_char('.')) 
                    this.rank -= 10;
                else if (t.previous.is_char_of(",-")) 
                    this.rank += 10;
                else {
                    let npt = NounPhraseHelper.try_parse(t.previous, NounPhraseParseAttr.NO, 0, null);
                    if (npt !== null && npt.end_char >= t.end_char) 
                        this.rank += 10;
                }
            }
            if (t !== this.begin_token && t.newlines_before_count > min_newlines_count) 
                this.rank -= (t.newlines_before_count - min_newlines_count);
            let bst = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
            if (bst !== null && bst.is_quote_type && bst.end_token.end_char <= this.end_token.end_char) {
                if (words === 0) {
                    tstart = bst.begin_token;
                    this.rank += 10;
                    if (bst.end_token === this.end_token) {
                        tend = this.end_token;
                        this.rank += 10;
                    }
                }
            }
            let rli = t.get_referents();
            if (rli !== null) {
                for (const r of rli) {
                    if (r instanceof OrganizationReferent) {
                        if (t.is_newline_before) 
                            this.rank -= 10;
                        else 
                            this.rank -= 4;
                        continue;
                    }
                    if ((r instanceof GeoReferent) || (r instanceof PersonReferent)) {
                        if (t.is_newline_before) {
                            this.rank -= 5;
                            if (t.is_newline_after || t.next === null) 
                                this.rank -= 20;
                            else if (t.next.is_hiphen || (t.next instanceof NumberToken) || (t.next.get_referent() instanceof DateReferent)) 
                                this.rank -= 20;
                            else if (t !== this.begin_token) 
                                this.rank -= 20;
                        }
                        continue;
                    }
                    if ((r instanceof GeoReferent) || (r instanceof DenominationReferent)) 
                        continue;
                    if ((r instanceof UriReferent) || (r instanceof PhoneReferent)) 
                        return false;
                    if (t.is_newline_before) 
                        this.rank -= 4;
                    else 
                        this.rank -= 2;
                    if (t === this.begin_token && (this.end_token.get_referent() instanceof PersonReferent)) 
                        this.rank -= 10;
                }
                words++;
                if (t.chars.is_all_upper) 
                    up_words++;
                if (t === this.begin_token) {
                    if (t.is_newline_after) 
                        this.rank -= 10;
                    else if (t.next !== null && t.next.is_char('.') && t.next.is_newline_after) 
                        this.rank -= 10;
                }
                continue;
            }
            if (t instanceof NumberToken) {
                if ((t).typ === NumberSpellingType.WORDS) {
                    words++;
                    if (t.chars.is_all_upper) 
                        up_words++;
                }
                else 
                    notwords++;
                continue;
            }
            let pat = PersonAttrToken.try_attach(t, null, PersonAttrTokenPersonAttrAttachAttrs.NO);
            if (pat !== null) {
                if (t.is_newline_before) {
                    if (!pat.morph._case.is_undefined && !pat.morph._case.is_nominative) {
                    }
                    else if (pat.chars.is_all_upper) {
                    }
                    else 
                        this.rank -= 20;
                }
                else if (t.chars.is_all_lower) 
                    this.rank--;
                for (; t !== null; t = t.next) {
                    words++;
                    if (t.chars.is_all_upper) 
                        up_words++;
                    if (t === pat.end_token) 
                        break;
                }
                continue;
            }
            let oitt = OrgItemTypeToken.try_attach(t, true, null);
            if (oitt !== null) {
                if (oitt.morph.number !== MorphNumber.PLURAL && !oitt.is_doubt_root_word) {
                    if (!oitt.morph._case.is_undefined && !oitt.morph._case.is_nominative) {
                        words++;
                        if (t.chars.is_all_upper) 
                            up_words++;
                    }
                    else {
                        this.rank -= 4;
                        if (t === this.begin_token) 
                            this.rank -= 5;
                    }
                }
                else {
                    words += 1;
                    if (t.chars.is_all_upper) 
                        up_words++;
                }
                t = oitt.end_token;
                continue;
            }
            let tt = Utils.as(t, TextToken);
            if (tt !== null) {
                if (tt.is_char('©')) 
                    this.rank -= 10;
                if (tt.is_char('_')) 
                    this.rank--;
                if (tt.chars.is_letter) {
                    if (tt.length_char > 2) {
                        words++;
                        if (t.chars.is_all_upper) 
                            up_words++;
                    }
                }
                else if (!tt.is_char(',')) 
                    notwords++;
                if (tt.is_pure_verb) {{
                            this.rank -= 30;
                            words--;
                        }
                    break;
                }
                if (tt === this.end_token) {
                    if (tt.morph.class0.is_preposition || tt.morph.class0.is_conjunction) 
                        this.rank -= 10;
                    else if (tt.is_char('.')) 
                        this.rank += 5;
                }
                else if (tt.is_char_of("._")) 
                    this.rank -= 5;
            }
        }
        this.rank += words;
        this.rank -= notwords;
        if ((words < 1) && (this.rank < 50)) 
            return false;
        if (tstart === null || tend === null) 
            return false;
        if (tstart.end_char > tend.end_char) 
            return false;
        let tit1 = TitleItemToken.try_attach(this.end_token.next);
        if (tit1 !== null && ((tit1.typ === TitleItemTokenTypes.TYP || tit1.typ === TitleItemTokenTypes.SPECIALITY))) {
            if (tit1.end_token.is_newline_after) 
                this.rank += 15;
            else 
                this.rank += 10;
            if (tit1.typ === TitleItemTokenTypes.SPECIALITY) 
                this.speciality = tit1.value;
        }
        if (up_words > 4 && up_words > (Math.floor((0.8 * (words))))) {
            if (tstart.previous !== null && (tstart.previous.get_referent() instanceof PersonReferent)) 
                this.rank += (5 + up_words);
        }
        this.begin_name_token = tstart;
        this.end_name_token = tend;
        return true;
    }
}


module.exports = TitleNameToken
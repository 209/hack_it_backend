/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const MorphClass = require("./../../../morph/MorphClass");
const MorphGender = require("./../../../morph/MorphGender");
const Token = require("./../../Token");
const GetTextAttr = require("./../../core/GetTextAttr");
const MetaToken = require("./../../MetaToken");
const MorphNumber = require("./../../../morph/MorphNumber");
const Explanatory = require("./../../../semantic/utils/Explanatory");
const EpNerOrgInternalResourceHelper = require("./EpNerOrgInternalResourceHelper");
const MorphLang = require("./../../../morph/MorphLang");
const CharsInfo = require("./../../../morph/CharsInfo");
const MorphBaseInfo = require("./../../../morph/MorphBaseInfo");
const MorphWordForm = require("./../../../morph/MorphWordForm");
const TerminCollection = require("./../../core/TerminCollection");
const TextToken = require("./../../TextToken");
const NumberToken = require("./../../NumberToken");
const GeoReferent = require("./../../geo/GeoReferent");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const OrgProfile = require("./../OrgProfile");
const MiscHelper = require("./../../core/MiscHelper");
const Termin = require("./../../core/Termin");
const BracketHelper = require("./../../core/BracketHelper");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const OrgItemTypeToken = require("./OrgItemTypeToken");
const MorphCase = require("./../../../morph/MorphCase");
const OrgItemEponymToken = require("./OrgItemEponymToken");
const OrganizationAnalyzer = require("./../OrganizationAnalyzer");
const OrgItemEngItem = require("./OrgItemEngItem");

class OrgItemNameToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.value = null;
        this.is_noun_phrase = false;
        this.is_denomination = false;
        this.is_in_dictionary = false;
        this.is_std_tail = false;
        this.is_std_name = false;
        this.is_empty_word = false;
        this.is_ignored_part = false;
        this.std_org_name_nouns = 0;
        this.org_std_prof = OrgProfile.UNDEFINED;
        this.is_after_conjunction = false;
        this.preposition = null;
    }
    
    toString() {
        let res = new StringBuilder(this.value);
        if (this.is_noun_phrase) 
            res.append(" NounPrase");
        if (this.is_denomination) 
            res.append(" Denom");
        if (this.is_in_dictionary) 
            res.append(" InDictionary");
        if (this.is_after_conjunction) 
            res.append(" IsAfterConjunction");
        if (this.is_std_tail) 
            res.append(" IsStdTail");
        if (this.is_std_name) 
            res.append(" IsStdName");
        if (this.is_ignored_part) 
            res.append(" IsIgnoredPart");
        if (this.preposition !== null) 
            res.append(" IsAfterPreposition '").append(this.preposition).append("'");
        res.append(" ").append(this.chars.toString()).append(" (").append(this.get_source_text()).append(")");
        return res.toString();
    }
    
    static try_attach(t, prev, ext_onto, first) {
        if (t === null) 
            return null;
        if (t.is_value("ОРДЕНА", null) && t.next !== null) {
            let npt = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) {
                let t1 = npt.end_token;
                if (((t1.is_value("ЗНАК", null) || t1.is_value("ДРУЖБА", null))) && (t1.whitespaces_after_count < 2)) {
                    npt = NounPhraseHelper.try_parse(t1.next, NounPhraseParseAttr.NO, 0, null);
                    if (npt !== null) 
                        t1 = npt.end_token;
                }
                return OrgItemNameToken._new1798(t, t1, true);
            }
            if (t.next.get_morph_class_in_dictionary().is_proper_surname) 
                return OrgItemNameToken._new1798(t, t.next, true);
            let ppp = t.kit.process_referent("PERSON", t.next);
            if (ppp !== null) 
                return OrgItemNameToken._new1798(t, ppp.end_token, true);
            if ((t.whitespaces_after_count < 2) && BracketHelper.can_be_start_of_sequence(t.next, true, false)) {
                let br = BracketHelper.try_parse(t.next, BracketParseAttr.NEARCLOSEBRACKET, 10);
                if (br !== null && (br.length_char < 40)) 
                    return OrgItemNameToken._new1798(t, br.end_token, true);
            }
        }
        if (first && t.chars.is_cyrillic_letter && t.morph.class0.is_preposition) {
            if (!t.is_value("ПО", null) && !t.is_value("ПРИ", null)) 
                return null;
        }
        let res = OrgItemNameToken._try_attach(t, prev, ext_onto);
        if (res === null) {
            if (ext_onto) {
                if (((t.get_referent() instanceof GeoReferent)) || (((t instanceof TextToken) && !t.is_char(';')))) 
                    return OrgItemNameToken._new1802(t, t, t.get_source_text());
            }
            return null;
        }
        if (prev === null && !ext_onto) {
            if (t.kit.ontology !== null) {
                let ad = Utils.as(t.kit.ontology._get_analyzer_data(OrganizationAnalyzer.ANALYZER_NAME), OrganizationAnalyzer.OrgAnalyzerData);
                if (ad !== null) {
                    let tok = ad.org_pure_names.try_parse(t, TerminParseAttr.NO);
                    if (tok !== null && tok.end_char > res.end_char) 
                        res.end_token = tok.end_token;
                }
            }
        }
        if (prev !== null && !ext_onto) {
            if ((prev.chars.is_all_lower && !res.chars.is_all_lower && !res.is_std_tail) && !res.is_std_name) {
                if (prev.chars.is_latin_letter && res.chars.is_latin_letter) {
                }
                else if (OrgItemNameToken.m_std_nouns.try_parse(res.begin_token, TerminParseAttr.NO) !== null) {
                }
                else 
                    return null;
            }
        }
        if ((res.end_token.next !== null && !res.end_token.is_whitespace_after && res.end_token.next.is_hiphen) && !res.end_token.next.is_whitespace_after) {
            let tt = Utils.as(res.end_token.next.next, TextToken);
            if (tt !== null) {
                if (CharsInfo.ooEq(tt.chars, res.chars) || tt.chars.is_all_upper) {
                    res.end_token = tt;
                    res.value = (res.value + "-" + tt.term);
                }
            }
        }
        if ((res.end_token.next !== null && res.end_token.next.is_and && res.end_token.whitespaces_after_count === 1) && res.end_token.next.whitespaces_after_count === 1) {
            let res1 = OrgItemNameToken._try_attach(res.end_token.next.next, prev, ext_onto);
            if (res1 !== null && CharsInfo.ooEq(res1.chars, res.chars) && OrgItemTypeToken.try_attach(res.end_token.next.next, false, null) === null) {
                if (!(MorphCase.ooBitand(res1.morph._case, res.morph._case)).is_undefined) {
                    res.end_token = res1.end_token;
                    res.value = (res.value + " " + (res.kit.base_language.is_ua ? "ТА" : "И") + " " + res1.value);
                }
            }
        }
        for (let tt = res.begin_token; tt !== null && tt.end_char <= res.end_char; tt = tt.next) {
            if (OrgItemNameToken.m_std_nouns.try_parse(tt, TerminParseAttr.NO) !== null) 
                res.std_org_name_nouns++;
        }
        if (OrgItemNameToken.m_std_nouns.try_parse(res.end_token, TerminParseAttr.NO) !== null) {
            let cou = 1;
            let non = false;
            let et = res.end_token;
            if (!OrgItemNameToken._is_not_term_noun(res.end_token)) 
                non = true;
            let br = false;
            for (let tt = res.end_token.next; tt !== null; tt = tt.next) {
                if (tt.is_table_control_char) 
                    break;
                if (tt.is_char('(')) {
                    if (!non) 
                        break;
                    br = true;
                    continue;
                }
                if (tt.is_char(')')) {
                    br = false;
                    et = tt;
                    break;
                }
                if (!((tt instanceof TextToken))) 
                    break;
                if (tt.whitespaces_before_count > 1) {
                    if (tt.newlines_before_count > 1) 
                        break;
                    if (CharsInfo.ooNoteq(tt.chars, res.end_token.chars)) 
                        break;
                }
                if (tt.morph.class0.is_preposition || tt.is_comma_and) 
                    continue;
                let dd = tt.get_morph_class_in_dictionary();
                if (!dd.is_noun && !dd.is_adjective) 
                    break;
                let npt2 = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                if (npt2 === null) {
                    if (MorphClass.ooEq(dd, MorphClass.ADJECTIVE)) 
                        continue;
                    break;
                }
                if (OrgItemNameToken.m_std_nouns.try_parse(npt2.end_token, TerminParseAttr.NO) === null) 
                    break;
                if (CharsInfo.ooNoteq(npt2.end_token.chars, res.end_token.chars)) 
                    break;
                if ((npt2.end_token.is_value("УПРАВЛЕНИЕ", null) || npt2.end_token.is_value("ИНСТИТУТ", null) || npt2.end_token.is_value("УПРАВЛІННЯ", null)) || npt2.end_token.is_value("ІНСТИТУТ", null) || tt.previous.is_value("ПРИ", null)) {
                    let rt = tt.kit.process_referent(OrganizationAnalyzer.ANALYZER_NAME, tt);
                    if (rt !== null) 
                        break;
                }
                cou++;
                tt = npt2.end_token;
                if (!OrgItemNameToken._is_not_term_noun(tt)) {
                    non = true;
                    et = tt;
                }
            }
            if (non && !br) {
                res.std_org_name_nouns += cou;
                res.end_token = et;
            }
        }
        return res;
    }
    
    static _is_not_term_noun(t) {
        if (!((t instanceof TextToken))) 
            return false;
        if (!((t.previous instanceof TextToken))) 
            return false;
        if ((t.previous).term !== "ПО") 
            return false;
        for (const v of OrgItemNameToken.m_not_terminate_nouns) {
            if (t.is_value(v, null)) 
                return true;
        }
        return false;
    }
    
    static _try_attach(t, prev, ext_onto) {
        if (t === null) 
            return null;
        let r = t.get_referent();
        if (r !== null) {
            if (r.type_name === "DENOMINATION") 
                return OrgItemNameToken._new1803(t, t, r.to_string(true, t.kit.base_language, 0), true);
            if ((r instanceof GeoReferent) && t.chars.is_latin_letter) {
                let res2 = OrgItemNameToken._try_attach(t.next, prev, ext_onto);
                if (res2 !== null && res2.chars.is_latin_letter) {
                    res2.begin_token = t;
                    res2.value = (MiscHelper.get_text_value_of_meta_token(Utils.as(t, MetaToken), GetTextAttr.NO) + " " + res2.value);
                    res2.is_in_dictionary = false;
                    return res2;
                }
            }
            return null;
        }
        let tt = Utils.as(t, TextToken);
        if (tt === null) 
            return null;
        let res = null;
        let tok = OrgItemNameToken.m_std_tails.try_parse(t, TerminParseAttr.NO);
        if (tok === null && t.is_char(',')) 
            tok = OrgItemNameToken.m_std_tails.try_parse(t.next, TerminParseAttr.NO);
        if (tok !== null) 
            return OrgItemNameToken._new1804(t, tok.end_token, tok.termin.canonic_text, tok.termin.tag === null, tok.termin.tag !== null, tok.morph);
        if ((((tok = OrgItemNameToken.m_std_names.try_parse(t, TerminParseAttr.NO)))) !== null) 
            return OrgItemNameToken._new1805(t, tok.end_token, tok.termin.canonic_text, true);
        let eng = OrgItemEngItem.try_attach(t, false);
        if (eng === null && t.is_char(',')) 
            eng = OrgItemEngItem.try_attach(t.next, false);
        if (eng !== null) 
            return OrgItemNameToken._new1806(t, eng.end_token, eng.full_value, true);
        if (tt.chars.is_all_lower && prev !== null) {
            if (!prev.chars.is_all_lower && !prev.chars.is_capital_upper) 
                return null;
        }
        if (tt.is_char(',') && prev !== null) {
            let npt1 = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
            if (npt1 === null || CharsInfo.ooNoteq(npt1.chars, prev.chars) || (MorphCase.ooBitand(npt1.morph._case, prev.morph._case)).is_undefined) 
                return null;
            let ty = OrgItemTypeToken.try_attach(t.next, false, null);
            if (ty !== null) 
                return null;
            if (npt1.end_token.next === null || !npt1.end_token.next.is_value("И", null)) 
                return null;
            let t1 = npt1.end_token.next;
            let npt2 = NounPhraseHelper.try_parse(t1.next, NounPhraseParseAttr.NO, 0, null);
            if (npt2 === null || CharsInfo.ooNoteq(npt2.chars, prev.chars) || (MorphCase.ooBitand(npt2.morph._case, MorphCase.ooBitand(npt1.morph._case, prev.morph._case))).is_undefined) 
                return null;
            ty = OrgItemTypeToken.try_attach(t1.next, false, null);
            if (ty !== null) 
                return null;
            res = OrgItemNameToken._new1807(npt1.begin_token, npt1.end_token, npt1.morph, npt1.get_normal_case_text(null, false, MorphGender.UNDEFINED, false));
            res.is_noun_phrase = true;
            res.is_after_conjunction = true;
            if (prev.preposition !== null) 
                res.preposition = prev.preposition;
            return res;
        }
        if (((tt.is_char('&') || tt.is_value("AND", null) || tt.is_value("UND", null))) && prev !== null) {
            if ((tt.next instanceof TextToken) && tt.length_char === 1 && tt.next.chars.is_latin_letter) {
                res = OrgItemNameToken._new1808(tt, tt.next, tt.next.chars);
                res.is_after_conjunction = true;
                res.value = "& " + (tt.next).term;
                return res;
            }
            res = OrgItemNameToken.try_attach(tt.next, null, ext_onto, false);
            if (res === null || CharsInfo.ooNoteq(res.chars, prev.chars)) 
                return null;
            res.is_after_conjunction = true;
            res.value = "& " + res.value;
            return res;
        }
        if (!tt.chars.is_letter) 
            return null;
        let expinf = null;
        if (prev !== null && prev.end_token.get_morph_class_in_dictionary().is_noun) {
            let wo = prev.end_token.get_normal_case_text(MorphClass.NOUN, true, MorphGender.UNDEFINED, false);
            expinf = Explanatory.find_derivates(wo, true, prev.end_token.morph.language);
        }
        let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
        if (npt !== null && npt.internal_noun !== null) 
            npt = null;
        let expl_ok = false;
        if (npt !== null && expinf !== null) {
            for (const ei of expinf) {
                if (ei.cm.nexts !== null && ei.cm.nexts.containsKey("")) {
                    let mc = ei.cm.nexts.get("");
                    if (!(MorphCase.ooBitand(mc, npt.morph._case)).is_undefined) {
                        expl_ok = true;
                        break;
                    }
                }
                if (ei.cm.transitive) {
                    if (npt.morph._case.is_genitive) {
                        expl_ok = true;
                        break;
                    }
                }
            }
        }
        if (npt !== null && ((expl_ok || npt.morph._case.is_genitive || ((prev !== null && !(MorphCase.ooBitand(prev.morph._case, npt.morph._case)).is_undefined))))) {
            let mc = npt.begin_token.get_morph_class_in_dictionary();
            if (mc.is_verb || mc.is_pronoun) 
                return null;
            if (mc.is_adverb) {
                if (npt.begin_token.next !== null && npt.begin_token.next.is_hiphen) {
                }
                else 
                    return null;
            }
            if (mc.is_preposition) 
                return null;
            if (mc.is_noun && npt.chars.is_all_lower) {
                let ca = npt.morph._case;
                if ((!ca.is_dative && !ca.is_genitive && !ca.is_instrumental) && !ca.is_prepositional) 
                    return null;
            }
            res = OrgItemNameToken._new1807(npt.begin_token, npt.end_token, npt.morph, npt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false));
            res.is_noun_phrase = true;
            if ((npt.end_token.whitespaces_after_count < 2) && (npt.end_token.next instanceof TextToken)) {
                let npt2 = NounPhraseHelper.try_parse(npt.end_token.next, NounPhraseParseAttr.NO, 0, null);
                if (npt2 !== null && npt2.morph._case.is_genitive && npt2.chars.is_all_lower) {
                    let typ = OrgItemTypeToken.try_attach(npt.end_token.next, true, null);
                    let epo = OrgItemEponymToken.try_attach(npt.end_token.next, false);
                    let rtt = t.kit.process_referent("PERSONPROPERTY", npt.end_token.next);
                    if (typ === null && epo === null && ((rtt === null || rtt.morph.number === MorphNumber.PLURAL))) {
                        res.end_token = npt2.end_token;
                        res.value = (res.value + " " + MiscHelper.get_text_value_of_meta_token(npt2, GetTextAttr.NO));
                    }
                }
                else if (npt.end_token.next.is_comma && (npt.end_token.next.next instanceof TextToken)) {
                    let tt2 = npt.end_token.next.next;
                    let mv2 = tt2.get_morph_class_in_dictionary();
                    if (mv2.is_adjective && mv2.is_verb) {
                        let bi = MorphBaseInfo._new1810(npt.morph._case, npt.morph.gender, npt.morph.number);
                        if (tt2.morph.check_accord(bi, false, false)) {
                            npt2 = NounPhraseHelper.try_parse(tt2.next, NounPhraseParseAttr.NO, 0, null);
                            if (npt2 !== null && ((npt2.morph._case.is_dative || npt2.morph._case.is_genitive)) && npt2.chars.is_all_lower) {
                                res.end_token = npt2.end_token;
                                res.value = (res.value + " " + MiscHelper.get_text_value(npt.end_token.next, res.end_token, GetTextAttr.NO));
                            }
                        }
                    }
                }
            }
            if (expl_ok) 
                res.is_after_conjunction = true;
        }
        else if (npt !== null && ((((prev !== null && prev.is_noun_phrase && npt.morph._case.is_instrumental)) || ext_onto))) {
            res = OrgItemNameToken._new1807(npt.begin_token, npt.end_token, npt.morph, npt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false));
            res.is_noun_phrase = true;
        }
        else if (tt.is_and) {
            res = OrgItemNameToken.try_attach(tt.next, prev, ext_onto, false);
            if (res === null || !res.is_noun_phrase || prev === null) 
                return null;
            if ((MorphCase.ooBitand(prev.morph._case, res.morph._case)).is_undefined) 
                return null;
            if (prev.morph.number !== MorphNumber.UNDEFINED && res.morph.number !== MorphNumber.UNDEFINED) {
                if ((((prev.morph.number.value()) & (res.morph.number.value()))) === (MorphNumber.UNDEFINED.value())) {
                    if (CharsInfo.ooNoteq(prev.chars, res.chars)) 
                        return null;
                    let ty = OrgItemTypeToken.try_attach(res.end_token.next, false, null);
                    if (ty !== null) 
                        return null;
                }
            }
            let ci = res.chars;
            res.chars = ci;
            res.is_after_conjunction = true;
            return res;
        }
        else if (((tt.term === "ПО" || tt.term === "ПРИ" || tt.term === "ЗА") || tt.term === "С" || tt.term === "В") || tt.term === "НА") {
            npt = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) {
                if (OrgItemNameToken.m_vervot_words.try_parse(npt.end_token, TerminParseAttr.NO) !== null) 
                    return null;
                let ok = false;
                if (tt.term === "ПО") 
                    ok = npt.morph._case.is_dative;
                else if (tt.term === "С") 
                    ok = npt.morph._case.is_instrumental;
                else if (tt.term === "ЗА") 
                    ok = npt.morph._case.is_genitive | npt.morph._case.is_instrumental;
                else if (tt.term === "НА") 
                    ok = npt.morph._case.is_prepositional;
                else if (tt.term === "В") {
                    ok = npt.morph._case.is_dative | npt.morph._case.is_prepositional;
                    if (ok) {
                        ok = false;
                        if (t.next.is_value("СФЕРА", null) || t.next.is_value("ОБЛАСТЬ", null)) 
                            ok = true;
                    }
                }
                else if (tt.term === "ПРИ") {
                    ok = npt.morph._case.is_prepositional;
                    if (ok) {
                        if (OrgItemTypeToken.try_attach(tt.next, true, null) !== null) 
                            ok = false;
                        else {
                            let rt = tt.kit.process_referent(OrganizationAnalyzer.ANALYZER_NAME, tt.next);
                            if (rt !== null) 
                                ok = false;
                        }
                    }
                    let s = npt.noun.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
                    if (s === "ПОДДЕРЖКА" || s === "УЧАСТИЕ") 
                        ok = false;
                }
                else 
                    ok = npt.morph._case.is_prepositional;
                if (ok) {
                    res = OrgItemNameToken._new1812(t, npt.end_token, npt.morph, npt.get_normal_case_text(null, true, MorphGender.UNDEFINED, false), npt.chars);
                    res.is_noun_phrase = true;
                    res.preposition = tt.term;
                    if (((res.value === "ДЕЛО" || res.value === "ВОПРОС")) && !res.is_newline_after) {
                        let res2 = OrgItemNameToken._try_attach(res.end_token.next, res, ext_onto);
                        if (res2 !== null && res2.morph._case.is_genitive) {
                            res.value = (res.value + " " + res2.value);
                            res.end_token = res2.end_token;
                            for (let ttt = res2.end_token.next; ttt !== null; ttt = ttt.next) {
                                if (!ttt.is_comma_and) 
                                    break;
                                let res3 = OrgItemNameToken._try_attach(ttt.next, res2, ext_onto);
                                if (res3 === null) 
                                    break;
                                res.value = (res.value + " " + res3.value);
                                res.end_token = res3.end_token;
                                if (ttt.is_and) 
                                    break;
                                ttt = res.end_token;
                            }
                        }
                    }
                }
            }
            if (res === null) 
                return null;
        }
        else if (tt.term === "OF") {
            let t1 = tt.next;
            if (t1 !== null && MiscHelper.is_eng_article(t1)) 
                t1 = t1.next;
            if (t1 !== null && t1.chars.is_latin_letter && !t1.chars.is_all_lower) {
                res = OrgItemNameToken._new1813(t, t1, t1.chars, t1.morph);
                for (let ttt = t1.next; ttt !== null; ttt = ttt.next) {
                    if (ttt.whitespaces_before_count > 2) 
                        break;
                    if (MiscHelper.is_eng_adj_suffix(ttt)) {
                        ttt = ttt.next;
                        continue;
                    }
                    if (!ttt.chars.is_latin_letter) 
                        break;
                    if (ttt.morph.class0.is_preposition) 
                        break;
                    t1 = res.end_token = ttt;
                }
                res.value = MiscHelper.get_text_value(t, t1, GetTextAttr.IGNOREARTICLES);
                res.preposition = tt.term;
                return res;
            }
        }
        if (res === null) {
            if (tt.chars.is_latin_letter && tt.length_char === 1) {
            }
            else if (tt.chars.is_all_lower || (tt.length_char < 2)) {
                if (!tt.chars.is_latin_letter || prev === null || !prev.chars.is_latin_letter) 
                    return null;
            }
            if (tt.chars.is_cyrillic_letter) {
                let mc = tt.get_morph_class_in_dictionary();
                if (mc.is_verb || mc.is_adverb) 
                    return null;
            }
            else if (tt.chars.is_latin_letter && !tt.is_whitespace_after) {
                if (!tt.is_whitespace_after && (tt.length_char < 5)) {
                    if (tt.next instanceof NumberToken) 
                        return null;
                }
            }
            res = OrgItemNameToken._new1814(tt, tt, tt.term, tt.morph);
            for (t = tt.next; t !== null; t = t.next) {
                if ((((t.is_hiphen || t.is_char_of("\\/"))) && t.next !== null && (t.next instanceof TextToken)) && !t.is_whitespace_before && !t.is_whitespace_after) {
                    t = t.next;
                    res.end_token = t;
                    res.value = (res.value + (t.previous.is_char('.') ? '.' : '-') + (t).term);
                }
                else if (t.is_char('.')) {
                    if (!t.is_whitespace_after && !t.is_whitespace_before && (t.next instanceof TextToken)) {
                        res.end_token = t.next;
                        t = t.next;
                        res.value = (res.value + "." + (t).term);
                    }
                    else if ((t.next !== null && !t.is_newline_after && t.next.chars.is_latin_letter) && tt.chars.is_latin_letter) 
                        res.end_token = t;
                    else 
                        break;
                }
                else 
                    break;
            }
        }
        for (let t0 = res.begin_token; t0 !== null; t0 = t0.next) {
            if ((((tt = Utils.as(t0, TextToken)))) !== null && tt.is_letters) {
                if (!tt.morph.class0.is_conjunction && !tt.morph.class0.is_preposition) {
                    for (const mf of tt.morph.items) {
                        if ((mf).is_in_dictionary) 
                            res.is_in_dictionary = true;
                    }
                }
            }
            if (t0 === res.end_token) 
                break;
        }
        if (res.begin_token === res.end_token && res.begin_token.chars.is_all_upper) {
            if (res.end_token.next !== null && !res.end_token.is_whitespace_after) {
                let t1 = res.end_token.next;
                if (t1.next !== null && !t1.is_whitespace_after && t1.is_hiphen) 
                    t1 = t1.next;
                if (t1 instanceof NumberToken) {
                    res.value += (t1).value.toString();
                    res.end_token = t1;
                }
            }
        }
        if (res.begin_token === res.end_token && res.begin_token.chars.is_last_lower) {
            let src = res.begin_token.get_source_text();
            for (let i = src.length - 1; i >= 0; i--) {
                if (Utils.isUpperCase(src[i])) {
                    res.value = src.substring(0, 0 + i + 1);
                    break;
                }
            }
        }
        return res;
    }
    
    static initialize() {
        OrgItemNameToken.m_std_tails = new TerminCollection();
        OrgItemNameToken.m_std_names = new TerminCollection();
        OrgItemNameToken.m_vervot_words = new TerminCollection();
        let t = null;
        t = new Termin("INCORPORATED");
        t.add_abridge("INC.");
        OrgItemNameToken.m_std_tails.add(t);
        t = new Termin("CORPORATION");
        t.add_abridge("CORP.");
        OrgItemNameToken.m_std_tails.add(t);
        t = new Termin("LIMITED");
        t.add_abridge("LTD.");
        OrgItemNameToken.m_std_tails.add(t);
        t = new Termin("AG");
        OrgItemNameToken.m_std_tails.add(t);
        t = new Termin("GMBH");
        OrgItemNameToken.m_std_tails.add(t);
        for (const s of ["ЗАКАЗЧИК", "ИСПОЛНИТЕЛЬ", "РАЗРАБОТЧИК", "БЕНЕФИЦИАР", "ПОЛУЧАТЕЛЬ", "ОТПРАВИТЕЛЬ", "ИЗГОТОВИТЕЛЬ", "ПРОИЗВОДИТЕЛЬ", "ПОСТАВЩИК", "АБОНЕНТ", "КЛИЕНТ", "ВКЛАДЧИК", "СУБЪЕКТ", "ПРОДАВЕЦ", "ПОКУПАТЕЛЬ", "АРЕНДОДАТЕЛЬ", "АРЕНДАТОР", "СУБАРЕНДАТОР", "НАЙМОДАТЕЛЬ", "НАНИМАТЕЛЬ", "АГЕНТ", "ПРИНЦИПАЛ", "ПРОДАВЕЦ", "ПОСТАВЩИК", "ПОДРЯДЧИК", "СУБПОДРЯДЧИК"]) {
            OrgItemNameToken.m_std_tails.add(Termin._new119(s, s));
        }
        for (const s of ["ЗАМОВНИК", "ВИКОНАВЕЦЬ", "РОЗРОБНИК", "БЕНЕФІЦІАР", "ОДЕРЖУВАЧ", "ВІДПРАВНИК", "ВИРОБНИК", "ВИРОБНИК", "ПОСТАЧАЛЬНИК", "АБОНЕНТ", "КЛІЄНТ", "ВКЛАДНИК", "СУБ'ЄКТ", "ПРОДАВЕЦЬ", "ПОКУПЕЦЬ", "ОРЕНДОДАВЕЦЬ", "ОРЕНДАР", "СУБОРЕНДАР", "НАЙМОДАВЕЦЬ", "НАЙМАЧ", "АГЕНТ", "ПРИНЦИПАЛ", "ПРОДАВЕЦЬ", "ПОСТАЧАЛЬНИК", "ПІДРЯДНИК", "СУБПІДРЯДНИК"]) {
            OrgItemNameToken.m_std_tails.add(Termin._new456(s, MorphLang.UA, s));
        }
        t = new Termin("РАЗРАБОТКА ПРОГРАММНОГО ОБЕСПЕЧЕНИЯ");
        t.add_abridge("РАЗРАБОТКИ ПО");
        OrgItemNameToken.m_std_names.add(t);
        for (const s of ["СПЕЦИАЛЬНОСТЬ", "ДИАГНОЗ"]) {
            OrgItemNameToken.m_vervot_words.add(new Termin(s));
        }
        for (const s of ["СПЕЦІАЛЬНІСТЬ", "ДІАГНОЗ"]) {
            OrgItemNameToken.m_vervot_words.add(new Termin(s, MorphLang.UA));
        }
        OrgItemNameToken.m_std_nouns = new TerminCollection();
        for (let k = 0; k < 2; k++) {
            let name = (k === 0 ? "NameNouns_ru.dat" : "NameNouns_ua.dat");
            let dat = EpNerOrgInternalResourceHelper.get_bytes(name);
            if (dat === null) 
                throw new Error(("Can't file resource file " + name + " in Organization analyzer"));
            let str = Utils.decodeString("UTF-8", OrgItemTypeToken.deflate(dat), 0, -1);
            for (const line0 of Utils.splitString(str, '\n', false)) {
                let line = line0.trim();
                if (Utils.isNullOrEmpty(line)) 
                    continue;
                if (k === 0) 
                    OrgItemNameToken.m_std_nouns.add(new Termin(line));
                else 
                    OrgItemNameToken.m_std_nouns.add(Termin._new899(line, MorphLang.UA));
            }
        }
    }
    
    static _new1798(_arg1, _arg2, _arg3) {
        let res = new OrgItemNameToken(_arg1, _arg2);
        res.is_ignored_part = _arg3;
        return res;
    }
    
    static _new1802(_arg1, _arg2, _arg3) {
        let res = new OrgItemNameToken(_arg1, _arg2);
        res.value = _arg3;
        return res;
    }
    
    static _new1803(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemNameToken(_arg1, _arg2);
        res.value = _arg3;
        res.is_denomination = _arg4;
        return res;
    }
    
    static _new1804(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new OrgItemNameToken(_arg1, _arg2);
        res.value = _arg3;
        res.is_std_tail = _arg4;
        res.is_empty_word = _arg5;
        res.morph = _arg6;
        return res;
    }
    
    static _new1805(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemNameToken(_arg1, _arg2);
        res.value = _arg3;
        res.is_std_name = _arg4;
        return res;
    }
    
    static _new1806(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemNameToken(_arg1, _arg2);
        res.value = _arg3;
        res.is_std_tail = _arg4;
        return res;
    }
    
    static _new1807(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemNameToken(_arg1, _arg2);
        res.morph = _arg3;
        res.value = _arg4;
        return res;
    }
    
    static _new1808(_arg1, _arg2, _arg3) {
        let res = new OrgItemNameToken(_arg1, _arg2);
        res.chars = _arg3;
        return res;
    }
    
    static _new1812(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new OrgItemNameToken(_arg1, _arg2);
        res.morph = _arg3;
        res.value = _arg4;
        res.chars = _arg5;
        return res;
    }
    
    static _new1813(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemNameToken(_arg1, _arg2);
        res.chars = _arg3;
        res.morph = _arg4;
        return res;
    }
    
    static _new1814(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemNameToken(_arg1, _arg2);
        res.value = _arg3;
        res.morph = _arg4;
        return res;
    }
    
    static _new2347(_arg1, _arg2, _arg3) {
        let res = new OrgItemNameToken(_arg1, _arg2);
        res.is_std_name = _arg3;
        return res;
    }
    
    static _new2349(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemNameToken(_arg1, _arg2);
        res.value = _arg3;
        res.chars = _arg4;
        return res;
    }
    
    static static_constructor() {
        OrgItemNameToken.m_not_terminate_nouns = Array.from(["РАБОТА", "ВОПРОС", "ДЕЛО", "УПРАВЛЕНИЕ", "ОРГАНИЗАЦИЯ", "ОБЕСПЕЧЕНИЕ", "РОБОТА", "ПИТАННЯ", "СПРАВА", "УПРАВЛІННЯ", "ОРГАНІЗАЦІЯ", "ЗАБЕЗПЕЧЕННЯ"]);
        OrgItemNameToken.m_std_names = null;
        OrgItemNameToken.m_std_tails = null;
        OrgItemNameToken.m_vervot_words = null;
        OrgItemNameToken.m_std_nouns = null;
        OrgItemNameToken.m_dep_std_names = null;
    }
}


OrgItemNameToken.static_constructor();

module.exports = OrgItemNameToken
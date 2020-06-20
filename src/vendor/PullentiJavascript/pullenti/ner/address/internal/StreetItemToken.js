/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const Hashtable = require("./../../../unisharp/Hashtable");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const GeoReferent = require("./../../geo/GeoReferent");
const MorphClass = require("./../../../morph/MorphClass");
const MorphCase = require("./../../../morph/MorphCase");
const MetaToken = require("./../../MetaToken");
const MorphBaseInfo = require("./../../../morph/MorphBaseInfo");
const MorphLang = require("./../../../morph/MorphLang");
const StreetReferent = require("./../StreetReferent");
const ReferentToken = require("./../../ReferentToken");
const MorphWordForm = require("./../../../morph/MorphWordForm");
const Morphology = require("./../../../morph/Morphology");
const CityItemTokenItemType = require("./../../geo/internal/CityItemTokenItemType");
const Termin = require("./../../core/Termin");
const EpNerAddressInternalResourceHelper = require("./EpNerAddressInternalResourceHelper");
const TerminCollection = require("./../../core/TerminCollection");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const DateReferent = require("./../../date/DateReferent");
const MiscHelper = require("./../../core/MiscHelper");
const AddressDetailType = require("./../AddressDetailType");
const BracketHelper = require("./../../core/BracketHelper");
const NumberExType = require("./../../core/NumberExType");
const NumberToken = require("./../../NumberToken");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const TextToken = require("./../../TextToken");
const AddressItemTokenItemType = require("./AddressItemTokenItemType");
const Token = require("./../../Token");
const StreetItemType = require("./StreetItemType");
const NumberHelper = require("./../../core/NumberHelper");
const MorphGender = require("./../../../morph/MorphGender");
const GetTextAttr = require("./../../core/GetTextAttr");
const AddressReferent = require("./../AddressReferent");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const MorphNumber = require("./../../../morph/MorphNumber");
const NumberSpellingType = require("./../../NumberSpellingType");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const AddressItemToken = require("./AddressItemToken");

/**
 * Токен для поддержки выделения улиц
 */
class StreetItemToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.typ = StreetItemType.NOUN;
        this.termin = null;
        this.alt_termin = null;
        this.exist_street = null;
        this.number = null;
        this.number_has_prefix = false;
        this.is_number_km = false;
        this.value = null;
        this.alt_value = null;
        this.alt_value2 = null;
        this.is_abridge = false;
        this.is_in_dictionary = false;
        this.is_in_brackets = false;
        this.has_std_suffix = false;
        this.noun_is_doubt_coef = 0;
    }
    
    get is_road() {
        if (this.termin === null) 
            return false;
        if ((this.termin.canonic_text === "АВТОДОРОГА" || this.termin.canonic_text === "ШОССЕ" || this.termin.canonic_text === "АВТОШЛЯХ") || this.termin.canonic_text === "ШОСЕ") 
            return true;
        return false;
    }
    
    toString() {
        let res = new StringBuilder();
        res.append(this.typ.toString());
        if (this.value !== null) {
            res.append(" ").append(this.value);
            if (this.alt_value !== null) 
                res.append("/").append(this.alt_value);
        }
        if (this.exist_street !== null) 
            res.append(" ").append(this.exist_street.toString());
        if (this.termin !== null) {
            res.append(" ").append(this.termin.toString());
            if (this.alt_termin !== null) 
                res.append("/").append(this.alt_termin.toString());
        }
        else if (this.number !== null) 
            res.append(" ").append(this.number.toString());
        else 
            res.append(" ").append(super.toString());
        if (this.is_abridge) 
            res.append(" (?)");
        return res.toString();
    }
    
    _is_surname() {
        if (this.typ !== StreetItemType.NAME) 
            return false;
        if (!((this.end_token instanceof TextToken))) 
            return false;
        let nam = (this.end_token).term;
        if (nam.length > 4) {
            if (LanguageHelper.ends_with_ex(nam, "А", "Я", "КО", "ЧУКА")) {
                if (!LanguageHelper.ends_with_ex(nam, "АЯ", "ЯЯ", null, null)) 
                    return true;
            }
        }
        return false;
    }
    
    static try_parse(t, loc_streets, recurse = false, prev = null, ignore_onto = false) {
        if (t === null) 
            return null;
        if (t.kit.is_recurce_overflow) 
            return null;
        t.kit.recurse_level++;
        let res = StreetItemToken._try_parse(t, loc_streets, recurse, prev, ignore_onto);
        t.kit.recurse_level--;
        return res;
    }
    
    static _try_parse(t, loc_streets, recurse, prev, ignore_onto) {
        const MiscLocationHelper = require("./../../geo/internal/MiscLocationHelper");
        if (t === null) 
            return null;
        let tn = null;
        if (t.is_value("ИМЕНИ", null) || t.is_value("ІМЕНІ", null)) 
            tn = t;
        else if (t.is_value("ИМ", null) || t.is_value("ІМ", null)) {
            tn = t;
            if (tn.next !== null && tn.next.is_char('.')) 
                tn = tn.next;
        }
        if (tn !== null) {
            if (tn.next === null || tn.whitespaces_after_count > 2) 
                return null;
            t = tn.next;
        }
        let nt = NumberHelper.try_parse_age(t);
        if (nt !== null && nt.int_value !== null) 
            return StreetItemToken._new219(nt.begin_token, nt.end_token, StreetItemType.AGE, nt);
        if ((((nt = Utils.as(t, NumberToken)))) !== null) {
            if ((nt).int_value === null || (nt).int_value === 0) 
                return null;
            let res = StreetItemToken._new220(nt, nt, StreetItemType.NUMBER, nt, nt.morph);
            if ((t.next !== null && t.next.is_hiphen && t.next.next !== null) && t.next.next.is_value("Я", null)) 
                res.end_token = t.next.next;
            let nex = NumberHelper.try_parse_number_with_postfix(t);
            if (nex !== null) {
                if (nex.ex_typ === NumberExType.KILOMETER) {
                    res.is_number_km = true;
                    res.end_token = nex.end_token;
                }
                else 
                    return null;
            }
            let aaa = AddressItemToken.try_parse(t, null, false, true, null);
            if (aaa !== null && aaa.typ === AddressItemTokenItemType.NUMBER && aaa.end_char > t.end_char) {
                if (prev !== null && prev.typ === StreetItemType.NOUN && prev.termin.canonic_text === "КВАРТАЛ") {
                    res.end_token = aaa.end_token;
                    res.value = aaa.value;
                    res.number = null;
                }
                else 
                    return null;
            }
            if (nt.typ === NumberSpellingType.WORDS && nt.morph.class0.is_adjective) {
                let npt2 = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
                if (npt2 !== null && npt2.end_char > t.end_char && npt2.morph.number !== MorphNumber.SINGULAR) {
                    if (t.next !== null && !t.next.chars.is_all_lower) {
                    }
                    else 
                        return null;
                }
            }
            return res;
        }
        let ntt = MiscHelper.check_number_prefix(t);
        if ((ntt !== null && (ntt instanceof NumberToken) && prev !== null) && (ntt).int_value !== null) 
            return StreetItemToken._new221(t, ntt, StreetItemType.NUMBER, Utils.as(ntt, NumberToken), true);
        let tt = Utils.as(t, TextToken);
        if (tt !== null && tt.morph.class0.is_adjective) {
            if (tt.chars.is_capital_upper || ((prev !== null && prev.typ === StreetItemType.NUMBER && tt.is_value("ТРАНСПОРТНЫЙ", null)))) {
                let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null && MiscHelper.get_text_value_of_meta_token(npt.noun, GetTextAttr.NO).includes("-")) 
                    npt = null;
                let tte = tt.next;
                if (npt !== null && npt.adjectives.length === 1) 
                    tte = npt.end_token;
                if (tte !== null) {
                    if ((((((((((tte.is_value("ВАЛ", null) || tte.is_value("ТРАКТ", null) || tte.is_value("ПОЛЕ", null)) || tte.is_value("МАГИСТРАЛЬ", null) || tte.is_value("СПУСК", null)) || tte.is_value("ВЗВОЗ", null) || tte.is_value("РЯД", null)) || tte.is_value("СЛОБОДА", null) || tte.is_value("РОЩА", null)) || tte.is_value("ПРУД", null) || tte.is_value("СЪЕЗД", null)) || tte.is_value("КОЛЬЦО", null) || tte.is_value("МАГІСТРАЛЬ", null)) || tte.is_value("УЗВІЗ", null) || tte.is_value("ЛІНІЯ", null)) || tte.is_value("УЗВІЗ", null) || tte.is_value("ГАЙ", null)) || tte.is_value("СТАВОК", null) || tte.is_value("ЗЇЗД", null)) || tte.is_value("КІЛЬЦЕ", null)) {
                        let sit = StreetItemToken._new222(tt, tte, true);
                        sit.typ = StreetItemType.NAME;
                        if (npt === null || npt.adjectives.length === 0) 
                            sit.value = MiscHelper.get_text_value(tt, tte, GetTextAttr.NO);
                        else 
                            sit.value = npt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
                        let tok2 = StreetItemToken.m_ontology.try_parse(tt, TerminParseAttr.NO);
                        if (tok2 !== null && tok2.termin !== null && tok2.end_token === tte) 
                            sit.termin = tok2.termin;
                        return sit;
                    }
                }
                if (npt !== null && npt.begin_token !== npt.end_token && npt.adjectives.length <= 1) {
                    let tt1 = npt.end_token.next;
                    if (tt1 !== null && tt1.is_comma) 
                        tt1 = tt1.next;
                    let ok = false;
                    let sti1 = (recurse ? null : StreetItemToken.try_parse(tt1, loc_streets, true, null, false));
                    if (sti1 !== null && sti1.typ === StreetItemType.NOUN) 
                        ok = true;
                    else {
                        let ait = AddressItemToken.try_parse(tt1, loc_streets, false, true, null);
                        if (ait !== null) {
                            if (ait.typ === AddressItemTokenItemType.HOUSE) 
                                ok = true;
                            else if (ait.typ === AddressItemTokenItemType.NUMBER) {
                                let ait2 = AddressItemToken.try_parse(npt.end_token, loc_streets, false, true, null);
                                if (ait2 === null) 
                                    ok = true;
                            }
                        }
                    }
                    if (ok) {
                        sti1 = StreetItemToken.try_parse(npt.end_token, loc_streets, false, null, false);
                        if (sti1 !== null && sti1.typ === StreetItemType.NOUN) 
                            ok = false;
                        else {
                            let tok2 = StreetItemToken.m_ontology.try_parse(npt.end_token, TerminParseAttr.NO);
                            if (tok2 !== null) {
                                let _typ = StreetItemType.of(tok2.termin.tag);
                                if (_typ === StreetItemType.NOUN || _typ === StreetItemType.STDPARTOFNAME) 
                                    ok = false;
                            }
                        }
                    }
                    if (ok) {
                        let sit = new StreetItemToken(tt, npt.end_token);
                        sit.typ = StreetItemType.NAME;
                        sit.value = MiscHelper.get_text_value(tt, npt.end_token, GetTextAttr.NO);
                        sit.alt_value = npt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
                        return sit;
                    }
                }
            }
        }
        if ((tt !== null && (tt.next instanceof TextToken) && tt.next.chars.is_capital_upper) && !recurse) {
            if ((tt.is_value("ВАЛ", null) || tt.is_value("ТРАКТ", null) || tt.is_value("ПОЛЕ", null)) || tt.is_value("КОЛЬЦО", null) || tt.is_value("КІЛЬЦЕ", null)) {
                let sit = StreetItemToken.try_parse(tt.next, loc_streets, true, null, false);
                if (sit !== null && sit.typ === StreetItemType.NAME) {
                    if (sit.value !== null) 
                        sit.value = (sit.value + " " + tt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false));
                    else 
                        sit.value = (sit.get_source_text().toUpperCase() + " " + tt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false));
                    if (sit.alt_value !== null) 
                        sit.alt_value = (sit.alt_value + " " + tt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false));
                    sit.begin_token = tt;
                    return sit;
                }
            }
        }
        if (((tt !== null && tt.length_char === 1 && tt.chars.is_all_lower) && tt.next !== null && tt.next.is_char('.')) && tt.kit.base_language.is_ru) {
            if (tt.is_value("М", null) || tt.is_value("M", null)) {
                if (prev !== null && prev.typ === StreetItemType.NOUN) {
                }
                else 
                    return StreetItemToken._new223(tt, tt.next, StreetItemToken.m_metro, StreetItemType.NOUN, true);
            }
        }
        let ot = null;
        if (loc_streets !== null) {
            let ots = loc_streets.try_attach(t, null, false);
            if (ots !== null) 
                ot = ots[0];
        }
        if (t.kit.ontology !== null && ot === null) {
            let ots = t.kit.ontology.attach_token(AddressReferent.OBJ_TYPENAME, t);
            if (ots !== null) 
                ot = ots[0];
        }
        if (ot !== null && ot.begin_token === ot.end_token && ot.morph.class0.is_adjective) {
            let tok0 = StreetItemToken.m_ontology.try_parse(t, TerminParseAttr.NO);
            if (tok0 !== null) {
                if ((StreetItemType.of(tok0.termin.tag)) === StreetItemType.STDADJECTIVE) 
                    ot = null;
            }
        }
        if (ot !== null) {
            let res0 = StreetItemToken._new224(ot.begin_token, ot.end_token, StreetItemType.NAME, Utils.as(ot.item.referent, StreetReferent), ot.morph, true);
            return res0;
        }
        let tok = StreetItemToken.m_ontology.try_parse(t, TerminParseAttr.NO);
        if (tok !== null && tok.termin.canonic_text === "НАБЕРЕЖНАЯ" && !tok.chars.is_all_lower) {
            let nex = StreetItemToken.try_parse(tok.end_token.next, null, false, null, false);
            if (nex !== null && ((nex.typ === StreetItemType.NOUN || nex.typ === StreetItemType.STDADJECTIVE))) 
                tok = null;
            else if ((((t.morph.gender.value()) & (MorphGender.FEMINIE.value()))) === (MorphGender.UNDEFINED.value()) && t.length_char > 7) 
                tok = null;
        }
        if (((tok !== null && t.length_char === 1 && t.is_value("Б", null)) && prev !== null && prev.number !== null) && prev.number.value === "26") 
            tok = null;
        if (tok !== null && !ignore_onto) {
            if ((StreetItemType.of(tok.termin.tag)) === StreetItemType.NUMBER) {
                if ((tok.end_token.next instanceof NumberToken) && (tok.end_token.next).int_value !== null) 
                    return StreetItemToken._new225(t, tok.end_token.next, StreetItemType.NUMBER, Utils.as(tok.end_token.next, NumberToken), true, tok.morph);
                return null;
            }
            if (tt === null) 
                return null;
            let abr = true;
            switch (StreetItemType.of(tok.termin.tag)) { 
            case StreetItemType.STDADJECTIVE:{
                if (tt.chars.is_all_lower && prev === null) 
                    return null;
                else if (tt.is_value(tok.termin.canonic_text, null)) 
                    abr = false;
                else if (tt.length_char === 1) {
                    if (!tt.is_whitespace_before && !tt.previous.is_char_of(":,.")) 
                        break;
                    if (!tok.end_token.is_char('.')) {
                        if (!tt.chars.is_all_upper) 
                            break;
                        let oo2 = false;
                        if (tok.end_token.is_newline_after && prev !== null) 
                            oo2 = true;
                        else {
                            let _next = StreetItemToken.try_parse(tok.end_token.next, null, false, null, false);
                            if (_next !== null && ((_next.typ === StreetItemType.NAME || _next.typ === StreetItemType.NOUN))) 
                                oo2 = true;
                            else if (AddressItemToken.check_house_after(tok.end_token.next, false, true) && prev !== null) 
                                oo2 = true;
                        }
                        if (oo2) 
                            return StreetItemToken._new226(tok.begin_token, tok.end_token, StreetItemType.STDADJECTIVE, tok.termin, abr, tok.morph);
                        break;
                    }
                    let tt2 = tok.end_token.next;
                    if (tt2 !== null && tt2.is_hiphen) 
                        tt2 = tt2.next;
                    if (tt2 instanceof TextToken) {
                        if (tt2.length_char === 1 && tt2.chars.is_all_upper) 
                            break;
                        if (tt2.chars.is_capital_upper) {
                            let is_sur = false;
                            let txt = (tt2).term;
                            if (txt.endsWith("ОГО")) 
                                is_sur = true;
                            else 
                                for (const wf of tt2.morph.items) {
                                    if (wf.class0.is_proper_surname && (wf).is_in_dictionary) {
                                        if (wf._case.is_genitive) {
                                            is_sur = true;
                                            break;
                                        }
                                    }
                                }
                            if (is_sur) 
                                break;
                        }
                    }
                }
                return StreetItemToken._new226(tok.begin_token, tok.end_token, StreetItemType.STDADJECTIVE, tok.termin, abr, tok.morph);
            }
            case StreetItemType.NOUN:{
                if (tt.is_value(tok.termin.canonic_text, null) || tok.end_token.is_value(tok.termin.canonic_text, null) || tt.is_value("УЛ", null)) 
                    abr = false;
                else if (tok.begin_token !== tok.end_token && ((tok.begin_token.next.is_hiphen || tok.begin_token.next.is_char_of("/\\")))) {
                }
                else if (!tt.chars.is_all_lower && tt.length_char === 1) 
                    break;
                else if (tt.length_char === 1) {
                    if (!tt.is_whitespace_before) {
                        if (tt.previous !== null && tt.previous.is_char_of(",")) {
                        }
                        else 
                            return null;
                    }
                    if (tok.end_token.is_char('.')) {
                    }
                    else if (tok.begin_token !== tok.end_token && tok.begin_token.next !== null && ((tok.begin_token.next.is_hiphen || tok.begin_token.next.is_char_of("/\\")))) {
                    }
                    else if (tok.length_char > 5) {
                    }
                    else if (tok.begin_token === tok.end_token && tt.is_value("Ш", null) && tt.chars.is_all_lower) {
                        if (prev !== null && ((prev.typ === StreetItemType.NAME || prev.typ === StreetItemType.STDNAME || prev.typ === StreetItemType.STDPARTOFNAME))) {
                        }
                        else {
                            let sii = StreetItemToken.try_parse(tt.next, null, false, null, false);
                            if (sii !== null && (((sii.typ === StreetItemType.NAME || sii.typ === StreetItemType.STDNAME || sii.typ === StreetItemType.STDPARTOFNAME) || sii.typ === StreetItemType.AGE))) {
                            }
                            else 
                                return null;
                        }
                    }
                    else 
                        return null;
                }
                else if (((tt.term === "КВ" || tt.term === "КВАРТ")) && !tok.end_token.is_value("Л", null)) {
                }
                if (!t.chars.is_all_lower && t.morph.class0.is_proper_surname && t.chars.is_cyrillic_letter) {
                    if ((((t.morph.number.value()) & (MorphNumber.PLURAL.value()))) !== (MorphNumber.UNDEFINED.value())) 
                        return null;
                }
                if (tt.term === "ДОРОГОЙ") 
                    return null;
                let alt = null;
                if (tok.begin_token.is_value("ПР", null) && ((tok.begin_token === tok.end_token || tok.begin_token.next.is_char('.')))) 
                    alt = StreetItemToken.m_prospect;
                return StreetItemToken._new228(tok.begin_token, tok.end_token, StreetItemType.NOUN, tok.termin, alt, abr, tok.morph, ((typeof tok.termin.tag2 === 'number' || tok.termin.tag2 instanceof Number) ? tok.termin.tag2 : 0));
            }
            case StreetItemType.STDNAME:{
                let is_post_off = tok.termin.canonic_text === "ПОЧТОВОЕ ОТДЕЛЕНИЕ";
                if (tok.begin_token.chars.is_all_lower && !is_post_off && tok.end_token.chars.is_all_lower) 
                    return null;
                let sits = StreetItemToken._new229(tok.begin_token, tok.end_token, StreetItemType.STDNAME, tok.morph, tok.termin.canonic_text);
                if (tok.begin_token !== tok.end_token && !is_post_off) {
                    let vv = MiscHelper.get_text_value(tok.begin_token, tok.end_token, GetTextAttr.NO);
                    if (vv !== sits.value) {
                        if (vv.length < sits.value.length) 
                            sits.alt_value = vv;
                        else {
                            sits.alt_value = sits.value;
                            sits.value = vv;
                        }
                    }
                    if (((StreetItemToken.m_std_ont_misc.try_parse(tok.begin_token, TerminParseAttr.NO) !== null || tok.begin_token.get_morph_class_in_dictionary().is_proper_name || (tok.begin_token.length_char < 4))) && ((tok.end_token.morph.class0.is_proper_surname || !tok.end_token.get_morph_class_in_dictionary().is_proper_name))) 
                        sits.alt_value2 = MiscHelper.get_text_value(tok.end_token, tok.end_token, GetTextAttr.NO);
                    else if (((tok.end_token.get_morph_class_in_dictionary().is_proper_name || StreetItemToken.m_std_ont_misc.try_parse(tok.end_token, TerminParseAttr.NO) !== null)) && ((tok.begin_token.morph.class0.is_proper_surname || !tok.begin_token.get_morph_class_in_dictionary().is_proper_name))) 
                        sits.alt_value2 = MiscHelper.get_text_value(tok.begin_token, tok.begin_token, GetTextAttr.NO);
                }
                return sits;
            }
            case StreetItemType.STDPARTOFNAME:{
                if (prev !== null && prev.typ === StreetItemType.NAME) {
                    let nam = (prev.value != null ? prev.value : MiscHelper.get_text_value_of_meta_token(prev, GetTextAttr.NO));
                    if (prev.alt_value === null) 
                        prev.alt_value = (tok.termin.canonic_text + " " + nam);
                    else 
                        prev.alt_value = (tok.termin.canonic_text + " " + prev.alt_value);
                    prev.end_token = tok.end_token;
                    prev.value = nam;
                    return StreetItemToken.try_parse(tok.end_token.next, loc_streets, recurse, prev, false);
                }
                let sit = StreetItemToken.try_parse(tok.end_token.next, loc_streets, false, null, false);
                if (sit === null) {
                    if (tok.morph.number === MorphNumber.PLURAL) 
                        return StreetItemToken._new229(tok.begin_token, tok.end_token, StreetItemType.NAME, tok.morph, MiscHelper.get_text_value_of_meta_token(tok, GetTextAttr.NO));
                    return null;
                }
                if (sit.typ !== StreetItemType.NAME && sit.typ !== StreetItemType.NOUN) 
                    return null;
                if (sit.typ === StreetItemType.NOUN) {
                    if (tok.morph.number === MorphNumber.PLURAL) 
                        return StreetItemToken._new229(tok.begin_token, tok.end_token, StreetItemType.NAME, tok.morph, MiscHelper.get_text_value_of_meta_token(tok, GetTextAttr.NO));
                    else 
                        return StreetItemToken._new232(tok.begin_token, tok.end_token, StreetItemType.NAME, tok.morph, tok.termin);
                }
                if (sit.value !== null) {
                    if (sit.alt_value === null) 
                        sit.alt_value = (tok.termin.canonic_text + " " + sit.value);
                    else 
                        sit.value = (tok.termin.canonic_text + " " + sit.value);
                }
                else if (sit.exist_street === null) {
                    sit.alt_value = (sit.begin_token).term;
                    sit.value = (tok.termin.canonic_text + " " + (sit.begin_token).term);
                }
                sit.begin_token = tok.begin_token;
                return sit;
            }
            case StreetItemType.NAME:{
                if (tok.begin_token.chars.is_all_lower) {
                    if (prev !== null && prev.typ === StreetItemType.STDADJECTIVE) {
                    }
                    else if (prev !== null && prev.typ === StreetItemType.NOUN && AddressItemToken.check_house_after(tok.end_token.next, true, false)) {
                    }
                    else if (t.is_value("ПРОЕКТИРУЕМЫЙ", null) || t.is_value("МИРА", null)) {
                    }
                    else {
                        let nex = StreetItemToken.try_parse(tok.end_token.next, null, true, null, false);
                        if (nex !== null && nex.typ === StreetItemType.NOUN) {
                            let tt2 = nex.end_token.next;
                            while (tt2 !== null && tt2.is_char_of(",.")) {
                                tt2 = tt2.next;
                            }
                            if (tt2 === null || tt2.whitespaces_before_count > 1) 
                                return null;
                            if (AddressItemToken.check_house_after(tt2, false, true)) {
                            }
                            else 
                                return null;
                        }
                        else 
                            return null;
                    }
                }
                let sit0 = StreetItemToken.try_parse(tok.begin_token, null, false, prev, true);
                if (sit0 !== null && sit0.typ === StreetItemType.NAME && sit0.end_char > tok.end_char) {
                    sit0.is_in_dictionary = true;
                    return sit0;
                }
                let sit1 = StreetItemToken._new233(tok.begin_token, tok.end_token, StreetItemType.NAME, tok.morph, true);
                if ((!tok.is_whitespace_after && tok.end_token.next !== null && tok.end_token.next.is_hiphen) && !tok.end_token.next.is_whitespace_after) {
                    let sit2 = StreetItemToken.try_parse(tok.end_token.next.next, loc_streets, false, null, false);
                    if (sit2 !== null && ((sit2.typ === StreetItemType.NAME || sit2.typ === StreetItemType.STDPARTOFNAME || sit2.typ === StreetItemType.STDNAME))) 
                        sit1.end_token = sit2.end_token;
                }
                return sit1;
            }
            case StreetItemType.FIX:{
                return StreetItemToken._new234(tok.begin_token, tok.end_token, StreetItemType.FIX, tok.morph, true, tok.termin);
            }
            }
        }
        if (tt !== null) {
            if ((prev !== null && prev.typ === StreetItemType.NUMBER && prev.number !== null) && prev.number.int_value === 26) {
                if (tt.is_value("БАКИНСКИЙ", null) || "БАКИНСК".startsWith((tt).term)) {
                    let tt2 = tt;
                    if (tt2.next !== null && tt2.next.is_char('.')) 
                        tt2 = tt2.next;
                    if (tt2.next instanceof TextToken) {
                        tt2 = tt2.next;
                        if (tt2.is_value("КОМИССАР", null) || tt2.is_value("КОММИССАР", null) || "КОМИС".startsWith((tt2).term)) {
                            if (tt2.next !== null && tt2.next.is_char('.')) 
                                tt2 = tt2.next;
                            let sit = StreetItemToken._new235(tt, tt2, StreetItemType.STDNAME, true, "БАКИНСКИХ КОМИССАРОВ", tt2.morph);
                            return sit;
                        }
                    }
                }
            }
            if ((tt.next !== null && tt.next.is_char('.') && !tt.chars.is_all_lower) && (tt.next.whitespaces_after_count < 3) && (tt.next.next instanceof TextToken)) {
                let tt1 = tt.next.next;
                if (tt1 !== null && tt1.is_hiphen) 
                    tt1 = tt1.next;
                if (tt.length_char === 1 && tt1.length_char === 1 && (tt1.next instanceof TextToken)) {
                    if (tt1.is_and && tt1.next.chars.is_all_upper && tt1.next.length_char === 1) 
                        tt1 = tt1.next;
                    if ((tt1.chars.is_all_upper && tt1.next.is_char('.') && (tt1.next.whitespaces_after_count < 3)) && (tt1.next.next instanceof TextToken)) 
                        tt1 = tt1.next.next;
                }
                let sit = StreetItemToken.try_parse(tt1, loc_streets, false, null, false);
                if (sit !== null && (tt1 instanceof TextToken)) {
                    let str = (tt1).term;
                    let ok = false;
                    let cla = tt.next.next.get_morph_class_in_dictionary();
                    if (sit.is_in_dictionary) 
                        ok = true;
                    else if (sit._is_surname() || cla.is_proper_surname) 
                        ok = true;
                    else if (LanguageHelper.ends_with(str, "ОЙ") && ((cla.is_proper_surname || ((sit.typ === StreetItemType.NAME && sit.is_in_dictionary))))) 
                        ok = true;
                    else if (LanguageHelper.ends_with_ex(str, "ГО", "ИХ", null, null)) 
                        ok = true;
                    else if (tt1.is_whitespace_before && !tt1.get_morph_class_in_dictionary().is_undefined) {
                    }
                    else if (prev !== null && prev.typ === StreetItemType.NOUN && ((!prev.is_abridge || prev.length_char > 2))) 
                        ok = true;
                    else if ((prev !== null && prev.typ === StreetItemType.NAME && sit.typ === StreetItemType.NOUN) && AddressItemToken.check_house_after(sit.end_token.next, false, true)) 
                        ok = true;
                    else if (sit.typ === StreetItemType.NAME && AddressItemToken.check_house_after(sit.end_token.next, false, true)) {
                        if (MiscLocationHelper.check_geo_object_before(tt)) 
                            ok = true;
                    }
                    if (ok) {
                        sit.begin_token = tt;
                        sit.value = str;
                        sit.alt_value = MiscHelper.get_text_value(tt, sit.end_token, GetTextAttr.NO);
                        if (sit.alt_value !== null) 
                            sit.alt_value = Utils.replaceString(sit.alt_value, "-", "");
                        return sit;
                    }
                }
            }
            if (tt.chars.is_cyrillic_letter && tt.length_char > 1 && !tt.morph.class0.is_preposition) {
                if (tt.is_value("ГЕРОЙ", null) || tt.is_value("ЗАЩИТНИК", "ЗАХИСНИК")) {
                    if ((tt.next instanceof ReferentToken) && (tt.next.get_referent() instanceof GeoReferent)) {
                        let re = StreetItemToken._new236(tt, tt.next, StreetItemType.STDPARTOFNAME, MiscHelper.get_text_value(tt, tt.next, GetTextAttr.NO));
                        let sit = StreetItemToken.try_parse(tt.next.next, loc_streets, false, null, false);
                        if (sit === null || sit.typ !== StreetItemType.NAME) {
                            let ok2 = false;
                            if (sit !== null && ((sit.typ === StreetItemType.STDADJECTIVE || sit.typ === StreetItemType.NOUN))) 
                                ok2 = true;
                            else if (AddressItemToken.check_house_after(tt.next.next, false, true)) 
                                ok2 = true;
                            else if (tt.next.is_newline_after) 
                                ok2 = true;
                            if (ok2) {
                                sit = StreetItemToken._new237(tt, tt.next, StreetItemType.NAME);
                                sit.value = MiscHelper.get_text_value(tt, tt.next, GetTextAttr.NO);
                                return sit;
                            }
                            return re;
                        }
                        if (sit.value === null) 
                            sit.value = MiscHelper.get_text_value_of_meta_token(sit, GetTextAttr.NO);
                        if (sit.alt_value === null) {
                            sit.alt_value = sit.value;
                            sit.value = (re.value + " " + sit.value);
                        }
                        else 
                            sit.value = (re.value + " " + sit.value);
                        sit.begin_token = tt;
                        return sit;
                    }
                }
                let ani = NumberHelper.try_parse_anniversary(t);
                if (ani !== null) 
                    return StreetItemToken._new238(t, ani.end_token, StreetItemType.AGE, ani, ani.value.toString());
                let ok1 = false;
                if (!tt.chars.is_all_lower) {
                    let ait = AddressItemToken.try_parse(tt, null, false, true, null);
                    if (ait !== null) {
                    }
                    else 
                        ok1 = true;
                }
                else if (prev !== null && prev.typ === StreetItemType.NOUN) {
                    let tt1 = prev.begin_token.previous;
                    if (tt1 !== null && tt1.is_comma) 
                        tt1 = tt1.previous;
                    if (tt1 !== null && (tt1.get_referent() instanceof GeoReferent)) 
                        ok1 = true;
                    else if (AddressItemToken.check_house_after(tt.next, false, false)) {
                        if (!AddressItemToken.check_house_after(tt, false, false)) 
                            ok1 = true;
                    }
                }
                else if (tt.whitespaces_after_count < 2) {
                    let nex = StreetItemToken.try_parse(tt.next, null, true, null, false);
                    if (nex !== null && nex.typ === StreetItemType.NOUN) {
                        if (nex.termin.canonic_text === "ПЛОЩАДЬ") {
                            if (tt.is_value("ОБЩИЙ", null)) 
                                return null;
                        }
                        let tt1 = tt.previous;
                        if (tt1 !== null && tt1.is_comma) 
                            tt1 = tt1.previous;
                        if (tt1 !== null && (tt1.get_referent() instanceof GeoReferent)) 
                            ok1 = true;
                        else if (AddressItemToken.check_house_after(nex.end_token.next, false, false)) 
                            ok1 = true;
                    }
                }
                if (ok1) {
                    let dc = tt.get_morph_class_in_dictionary();
                    if (dc.is_adverb) {
                        if (!((dc.is_proper))) 
                            return null;
                    }
                    let res = StreetItemToken._new239(tt, tt, StreetItemType.NAME, tt.morph);
                    if ((tt.next !== null && ((tt.next.is_hiphen || tt.next.is_char_of("\\/"))) && (tt.next.next instanceof TextToken)) && !tt.is_whitespace_after && !tt.next.is_whitespace_after) {
                        let ok2 = AddressItemToken.check_house_after(tt.next.next.next, false, false) || tt.next.next.is_newline_after;
                        if (!ok2) {
                            let te2 = StreetItemToken.try_parse(tt.next.next.next, null, false, null, false);
                            if (te2 !== null && te2.typ === StreetItemType.NOUN) 
                                ok2 = true;
                        }
                        if (ok2) {
                            res.end_token = tt.next.next;
                            res.value = (MiscHelper.get_text_value(res.begin_token, res.begin_token, GetTextAttr.NO) + " " + MiscHelper.get_text_value(res.end_token, res.end_token, GetTextAttr.NO));
                        }
                    }
                    else if ((tt.whitespaces_after_count < 2) && (tt.next instanceof TextToken) && tt.next.chars.is_letter) {
                        if (!AddressItemToken.check_house_after(tt.next, false, false) || tt.next.is_newline_after) {
                            let tt1 = tt.next;
                            let is_pref = false;
                            if ((tt1 instanceof TextToken) && tt1.chars.is_all_lower) {
                                if (tt1.is_value("ДЕ", null) || tt1.is_value("ЛА", null)) {
                                    tt1 = tt1.next;
                                    is_pref = true;
                                }
                            }
                            let nn = StreetItemToken.try_parse(tt1, loc_streets, false, null, false);
                            if (nn === null || nn.typ === StreetItemType.NAME) {
                                let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                                if (npt !== null) {
                                    if (npt.begin_token === npt.end_token) 
                                        npt = null;
                                    else if (StreetItemToken.m_ontology.try_parse(npt.end_token, TerminParseAttr.NO) !== null) 
                                        npt = null;
                                }
                                if (npt !== null && ((npt.is_newline_after || AddressItemToken.check_house_after(npt.end_token.next, false, false)))) {
                                    res.end_token = npt.end_token;
                                    if (npt.morph._case.is_genitive) {
                                        res.value = MiscHelper.get_text_value_of_meta_token(npt, GetTextAttr.NO);
                                        res.alt_value = npt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
                                    }
                                    else {
                                        res.value = npt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
                                        res.alt_value = MiscHelper.get_text_value_of_meta_token(npt, GetTextAttr.NO);
                                    }
                                }
                                else if (AddressItemToken.check_house_after(tt1.next, false, false) && tt1.chars.is_cyrillic_letter === tt.chars.is_cyrillic_letter && (t.whitespaces_after_count < 2)) {
                                    if (tt1.morph.class0.is_verb && !tt1.is_value("ДАЛИ", null)) {
                                    }
                                    else if (npt === null && !tt1.chars.is_all_lower && !is_pref) {
                                    }
                                    else {
                                        res.end_token = tt1;
                                        res.value = (MiscHelper.get_text_value(res.begin_token, res.begin_token, GetTextAttr.NO) + " " + MiscHelper.get_text_value(res.end_token, res.end_token, GetTextAttr.NO));
                                    }
                                }
                            }
                            else if (nn.typ === StreetItemType.NOUN) {
                                let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                                if (npt !== null && npt.end_token === nn.end_token) {
                                    res.value = MiscHelper.get_text_value(res.begin_token, res.end_token, GetTextAttr.NO);
                                    let var0 = Morphology.get_wordform(res.value, MorphBaseInfo._new240(MorphCase.NOMINATIVE, MorphClass.ADJECTIVE, MorphNumber.SINGULAR, npt.morph.gender));
                                    if (var0 !== null && var0 !== res.value) {
                                        res.alt_value = res.value;
                                        res.value = var0;
                                    }
                                }
                            }
                        }
                    }
                    return res;
                }
            }
            if (((tt.is_value("РЕКА", null) || tt.is_value("РІЧКА", null))) && tt.next !== null && tt.next.chars.is_capital_upper) 
                return StreetItemToken._new241(tt, tt.next, StreetItemType.NAME, tt.morph, tt.next.get_source_text().toUpperCase());
            if (tt.is_value("№", null) || tt.is_value("НОМЕР", null) || tt.is_value("НОМ", null)) {
                let tt1 = tt.next;
                if (tt1 !== null && tt1.is_char('.')) 
                    tt1 = tt1.next;
                if ((tt1 instanceof NumberToken) && (tt1).int_value !== null) 
                    return StreetItemToken._new221(tt, tt1, StreetItemType.NUMBER, Utils.as(tt1, NumberToken), true);
            }
            if (tt.is_hiphen && (tt.next instanceof NumberToken) && (tt.next).int_value !== null) {
                if (prev !== null && prev.typ === StreetItemType.NOUN) {
                    if (prev.termin.canonic_text === "МИКРОРАЙОН" || LanguageHelper.ends_with(prev.termin.canonic_text, "ГОРОДОК")) 
                        return StreetItemToken._new221(tt, tt.next, StreetItemType.NUMBER, Utils.as(tt.next, NumberToken), true);
                }
            }
        }
        let r = (t === null ? null : t.get_referent());
        if (r instanceof GeoReferent) {
            let geo = Utils.as(r, GeoReferent);
            if (prev !== null && prev.typ === StreetItemType.NOUN) {
                if (AddressItemToken.check_house_after(t.next, false, false)) 
                    return StreetItemToken._new236(t, t, StreetItemType.NAME, MiscHelper.get_text_value(t, t, GetTextAttr.NO));
            }
        }
        if (((tt instanceof TextToken) && tt.chars.is_capital_upper && tt.chars.is_latin_letter) && (tt.whitespaces_after_count < 2)) {
            if (MiscHelper.is_eng_article(tt)) 
                return null;
            let tt2 = tt.next;
            if (MiscHelper.is_eng_adj_suffix(tt2)) 
                tt2 = tt2.next.next;
            let tok1 = StreetItemToken.m_ontology.try_parse(tt2, TerminParseAttr.NO);
            if (tok1 !== null) 
                return StreetItemToken._new229(tt, tt2.previous, StreetItemType.NAME, tt.morph, (tt).term);
        }
        return null;
    }
    
    static try_parse_spec(t, prev) {
        if (t === null) 
            return null;
        let res = null;
        let sit = null;
        if (t.get_referent() instanceof DateReferent) {
            let dr = Utils.as(t.get_referent(), DateReferent);
            if (!(((t).begin_token instanceof NumberToken))) 
                return null;
            if (dr.year === 0 && dr.day > 0 && dr.month > 0) {
                res = new Array();
                res.push(StreetItemToken._new219(t, t, StreetItemType.NUMBER, new NumberToken(t, t, dr.day.toString(), NumberSpellingType.DIGIT)));
                let tmp = dr.to_string(false, t.morph.language, 0);
                let i = tmp.indexOf(' ');
                res.push((sit = StreetItemToken._new236(t, t, StreetItemType.STDNAME, tmp.substring(i + 1).toUpperCase())));
                sit.chars.is_capital_upper = true;
                return res;
            }
            if (dr.year > 0 && dr.month === 0) {
                res = new Array();
                res.push(StreetItemToken._new219(t, t, StreetItemType.NUMBER, new NumberToken(t, t, dr.year.toString(), NumberSpellingType.DIGIT)));
                res.push((sit = StreetItemToken._new236(t, t, StreetItemType.STDNAME, (t.morph.language.is_ua ? "РОКУ" : "ГОДА"))));
                sit.chars.is_capital_upper = true;
                return res;
            }
            return null;
        }
        if (prev !== null && prev.typ === StreetItemType.AGE) {
            res = new Array();
            if (t.get_referent() instanceof GeoReferent) 
                res.push((sit = StreetItemToken._new250(t, t, StreetItemType.NAME, t.get_source_text().toUpperCase(), t.get_referent().to_string(true, t.kit.base_language, 0).toUpperCase())));
            else if (t.is_value("ГОРОД", null) || t.is_value("МІСТО", null)) 
                res.push((sit = StreetItemToken._new236(t, t, StreetItemType.NAME, "ГОРОДА")));
            else 
                return null;
            return res;
        }
        if (prev !== null && prev.typ === StreetItemType.NOUN) {
            let num = NumberHelper.try_parse_roman(t);
            if (num !== null && num.int_value !== null) {
                res = new Array();
                res.push((sit = StreetItemToken._new219(num.begin_token, num.end_token, StreetItemType.NUMBER, num)));
                t = num.end_token.next;
                if ((num.typ === NumberSpellingType.DIGIT && (t instanceof TextToken) && !t.is_whitespace_before) && t.length_char === 1) {
                    sit.end_token = t;
                    sit.value = (num.value + (t).term);
                    sit.number = null;
                }
                return res;
            }
        }
        return null;
    }
    
    static try_parse_list(t, loc_streets, max_count = 10) {
        if (t === null) 
            return null;
        if (t.kit.is_recurce_overflow) 
            return null;
        t.kit.recurse_level++;
        let res = StreetItemToken._try_parse_list(t, loc_streets, max_count);
        t.kit.recurse_level--;
        return res;
    }
    
    static _try_parse_list(t, loc_streets, max_count) {
        const CityItemToken = require("./../../geo/internal/CityItemToken");
        const MiscLocationHelper = require("./../../geo/internal/MiscLocationHelper");
        let res = null;
        let sit = StreetItemToken.try_parse(t, loc_streets, false, null, false);
        if (sit !== null) {
            res = new Array();
            res.push(sit);
            t = sit.end_token.next;
        }
        else {
            res = StreetItemToken.try_parse_spec(t, null);
            if (res === null) 
                return null;
            sit = res[res.length - 1];
            t = sit.end_token.next;
            let sit2 = StreetItemToken.try_parse(t, loc_streets, false, null, false);
            if (sit2 !== null && sit2.typ === StreetItemType.NOUN) {
            }
            else if (AddressItemToken.check_house_after(t, false, true)) {
            }
            else 
                return null;
        }
        for (; t !== null; t = t.next) {
            if (max_count > 0 && res.length >= max_count) 
                break;
            if (t.is_newline_before) {
                if (t.newlines_before_count > 1) 
                    break;
                if (((t.whitespaces_after_count < 15) && sit !== null && sit.typ === StreetItemType.NOUN) && t.chars.is_capital_upper) {
                }
                else 
                    break;
            }
            if (t.is_hiphen && sit !== null && ((sit.typ === StreetItemType.NAME || ((sit.typ === StreetItemType.STDADJECTIVE && !sit.is_abridge))))) {
                let sit1 = StreetItemToken.try_parse(t.next, loc_streets, false, sit, false);
                if (sit1 === null) 
                    break;
                if (sit1.typ === StreetItemType.NUMBER) {
                    let tt = sit1.end_token.next;
                    if (tt !== null && tt.is_comma) 
                        tt = tt.next;
                    let ok = false;
                    let ait = AddressItemToken.try_parse(tt, loc_streets, false, true, null);
                    if (ait !== null) {
                        if (ait.typ === AddressItemTokenItemType.HOUSE) 
                            ok = true;
                    }
                    if (!ok) {
                        if (res.length === 2 && res[0].typ === StreetItemType.NOUN) {
                            if (res[0].termin.canonic_text === "МИКРОРАЙОН") 
                                ok = true;
                        }
                    }
                    if (ok) {
                        sit = sit1;
                        res.push(sit);
                        t = sit.end_token;
                        sit.number_has_prefix = true;
                        continue;
                    }
                }
                if (sit1.typ !== StreetItemType.NAME && sit1.typ !== StreetItemType.NAME) 
                    break;
                if (t.is_whitespace_before && t.is_whitespace_after) 
                    break;
                if (res[0].begin_token.previous !== null) {
                    let aaa = AddressItemToken.try_parse(res[0].begin_token.previous, null, false, true, null);
                    if (aaa !== null && aaa.typ === AddressItemTokenItemType.DETAIL && aaa.detail_type === AddressDetailType.CROSS) 
                        break;
                }
                sit = sit1;
                res.push(sit);
                t = sit.end_token;
                continue;
            }
            else if (t.is_hiphen && sit !== null && sit.typ === StreetItemType.NUMBER) {
                let sit1 = StreetItemToken.try_parse(t.next, loc_streets, false, null, false);
                if (sit1 !== null && ((sit1.typ === StreetItemType.STDADJECTIVE || sit1.typ === StreetItemType.STDNAME || sit1.typ === StreetItemType.NAME))) {
                    sit.number_has_prefix = true;
                    sit = sit1;
                    res.push(sit);
                    t = sit.end_token;
                    continue;
                }
            }
            if (t.is_char('.') && sit !== null && sit.typ === StreetItemType.NOUN) {
                if (t.whitespaces_after_count > 1) 
                    break;
                sit = StreetItemToken.try_parse(t.next, loc_streets, false, null, false);
                if (sit === null) 
                    break;
                if (sit.typ === StreetItemType.NUMBER || sit.typ === StreetItemType.STDADJECTIVE) {
                    let sit1 = StreetItemToken.try_parse(sit.end_token.next, null, false, null, false);
                    if (sit1 !== null && ((sit1.typ === StreetItemType.STDADJECTIVE || sit1.typ === StreetItemType.STDNAME || sit1.typ === StreetItemType.NAME))) {
                    }
                    else 
                        break;
                }
                else if (sit.typ !== StreetItemType.NAME && sit.typ !== StreetItemType.STDNAME && sit.typ !== StreetItemType.AGE) 
                    break;
                if (t.previous.get_morph_class_in_dictionary().is_noun) {
                    if (!sit.is_in_dictionary) {
                        let tt = sit.end_token.next;
                        let has_house = false;
                        for (; tt !== null; tt = tt.next) {
                            if (tt.is_newline_before) 
                                break;
                            if (tt.is_comma) 
                                continue;
                            let ai = AddressItemToken.try_parse(tt, null, false, true, null);
                            if (ai !== null && ((ai.typ === AddressItemTokenItemType.HOUSE || ai.typ === AddressItemTokenItemType.BUILDING || ai.typ === AddressItemTokenItemType.CORPUS))) {
                                has_house = true;
                                break;
                            }
                            let vv = StreetItemToken.try_parse(tt, null, false, null, false);
                            if (vv === null || vv.typ === StreetItemType.NOUN) 
                                break;
                            tt = vv.end_token;
                        }
                        if (!has_house) 
                            break;
                    }
                    if (t.previous.previous !== null) {
                        let npt11 = NounPhraseHelper.try_parse(t.previous.previous, NounPhraseParseAttr.NO, 0, null);
                        if (npt11 !== null && npt11.end_token === t.previous) 
                            break;
                    }
                }
                res.push(sit);
            }
            else {
                sit = StreetItemToken.try_parse(t, loc_streets, false, res[res.length - 1], false);
                if (sit === null) {
                    let spli = StreetItemToken.try_parse_spec(t, res[res.length - 1]);
                    if (spli !== null && spli.length > 0) {
                        res.splice(res.length, 0, ...spli);
                        t = spli[spli.length - 1].end_token;
                        continue;
                    }
                    if (((t instanceof TextToken) && ((res.length === 2 || res.length === 3)) && res[0].typ === StreetItemType.NOUN) && res[1].typ === StreetItemType.NUMBER && ((((t).term === "ГОДА" || (t).term === "МАЯ" || (t).term === "МАРТА") || (t).term === "СЪЕЗДА"))) {
                        res.push((sit = StreetItemToken._new236(t, t, StreetItemType.STDNAME, (t).term)));
                        continue;
                    }
                    sit = res[res.length - 1];
                    if (t === null) 
                        break;
                    if (sit.typ === StreetItemType.NOUN && ((sit.termin.canonic_text === "МИКРОРАЙОН" || sit.termin.canonic_text === "МІКРОРАЙОН")) && (t.whitespaces_before_count < 2)) {
                        let tt1 = t;
                        if (tt1.is_hiphen && tt1.next !== null) 
                            tt1 = tt1.next;
                        if (BracketHelper.is_bracket(tt1, true) && tt1.next !== null) 
                            tt1 = tt1.next;
                        let tt2 = tt1.next;
                        let br = false;
                        if (BracketHelper.is_bracket(tt2, true)) {
                            tt2 = tt2.next;
                            br = true;
                        }
                        if (((tt1 instanceof TextToken) && tt1.length_char === 1 && tt1.chars.is_letter) && ((AddressItemToken.check_house_after(tt2, false, true) || tt2 === null))) {
                            sit = StreetItemToken._new236(t, (br ? tt1.next : tt1), StreetItemType.NAME, (tt1).term);
                            let ch1 = AddressItemToken.correct_char(sit.value[0]);
                            if ((ch1.charCodeAt(0)) !== 0 && ch1 !== sit.value[0]) 
                                sit.alt_value = (ch1);
                            res.push(sit);
                            break;
                        }
                    }
                    if (t.is_comma && (((sit.typ === StreetItemType.NAME || sit.typ === StreetItemType.STDNAME || sit.typ === StreetItemType.STDPARTOFNAME) || sit.typ === StreetItemType.STDADJECTIVE || ((sit.typ === StreetItemType.NUMBER && res.length > 1 && (((res[res.length - 2].typ === StreetItemType.NAME || res[res.length - 2].typ === StreetItemType.STDNAME || res[res.length - 2].typ === StreetItemType.STDADJECTIVE) || res[res.length - 2].typ === StreetItemType.STDPARTOFNAME))))))) {
                        sit = StreetItemToken.try_parse(t.next, null, false, null, false);
                        if (sit !== null && sit.typ === StreetItemType.NOUN) {
                            let ttt = sit.end_token.next;
                            if (ttt !== null && ttt.is_comma) 
                                ttt = ttt.next;
                            let add = AddressItemToken.try_parse(ttt, null, false, true, null);
                            if (add !== null && ((add.typ === AddressItemTokenItemType.HOUSE || add.typ === AddressItemTokenItemType.CORPUS || add.typ === AddressItemTokenItemType.BUILDING))) {
                                res.push(sit);
                                t = sit.end_token;
                                continue;
                            }
                        }
                    }
                    if (BracketHelper.can_be_start_of_sequence(t, true, false)) {
                        let sit1 = res[res.length - 1];
                        if (sit1.typ === StreetItemType.NOUN && ((sit1.noun_is_doubt_coef === 0 || (((t.next instanceof TextToken) && !t.next.chars.is_all_lower))))) {
                            let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                            if (br !== null && (br.length_char < 50)) {
                                let sit2 = StreetItemToken.try_parse(t.next, loc_streets, false, null, false);
                                if (sit2 !== null && sit2.end_token.next === br.end_token) {
                                    if (sit2.value === null && sit2.typ === StreetItemType.NAME) 
                                        sit2.value = MiscHelper.get_text_value(sit2.begin_token, sit2.end_token, GetTextAttr.NO);
                                    sit2.begin_token = t;
                                    sit2.is_in_brackets = true;
                                    t = sit2.end_token = br.end_token;
                                    res.push(sit2);
                                    continue;
                                }
                                res.push(StreetItemToken._new255(t, br.end_token, StreetItemType.NAME, MiscHelper.get_text_value(t, br.end_token, GetTextAttr.NO), true));
                                t = br.end_token;
                                continue;
                            }
                        }
                    }
                    if (t.is_hiphen && (t.next instanceof NumberToken) && (t.next).int_value !== null) {
                        sit = res[res.length - 1];
                        if (sit.typ === StreetItemType.NOUN && (((sit.termin.canonic_text === "КВАРТАЛ" || sit.termin.canonic_text === "МИКРОРАЙОН" || sit.termin.canonic_text === "ГОРОДОК") || sit.termin.canonic_text === "МІКРОРАЙОН"))) {
                            sit = StreetItemToken._new221(t, t.next, StreetItemType.NUMBER, Utils.as(t.next, NumberToken), true);
                            res.push(sit);
                            t = t.next;
                            continue;
                        }
                    }
                    break;
                }
                res.push(sit);
                if (sit.typ === StreetItemType.NAME) {
                    let cou = 0;
                    let jj = 0;
                    for (jj = res.length - 1; jj >= 0; jj--) {
                        if (sit.typ === StreetItemType.NAME) 
                            cou++;
                        else 
                            break;
                    }
                    if (cou > 4) {
                        if (jj < 0) 
                            return null;
                        res.splice(jj, res.length - jj);
                        break;
                    }
                }
            }
            t = sit.end_token;
        }
        for (let i = 0; i < (res.length - 1); i++) {
            if (res[i].typ === StreetItemType.NAME && res[i + 1].typ === StreetItemType.NAME && (res[i].whitespaces_after_count < 3)) {
                let is_prop = false;
                let is_pers = false;
                if (res[i].begin_token.morph.class0.is_noun) {
                    let rt = res[i].kit.process_referent("PERSON", res[i].begin_token);
                    if (rt !== null) {
                        if (rt.referent.type_name === "PERSONPROPERTY") 
                            is_prop = true;
                        else if (rt.end_token === res[i + 1].end_token) 
                            is_pers = true;
                    }
                }
                if ((i === 0 && ((!is_prop && !is_pers)) && ((i + 2) < res.length)) && res[i + 2].typ === StreetItemType.NOUN && !res[i].begin_token.morph.class0.is_adjective) {
                    if (MiscLocationHelper.check_geo_object_before(res[0].begin_token) && res[0].end_token.next === res[1].begin_token && (res[0].whitespaces_after_count < 2)) {
                    }
                    else {
                        res.splice(i, 1);
                        i--;
                        continue;
                    }
                }
                if (res[i].morph.class0.is_adjective && res[i + 1].morph.class0.is_adjective) {
                    if (res[i].end_token.next.is_hiphen) {
                    }
                    else if (i === 1 && res[0].typ === StreetItemType.NOUN && res.length === 3) {
                    }
                    else if (i === 0 && res.length === 3 && res[2].typ === StreetItemType.NOUN) {
                    }
                    else 
                        continue;
                }
                res[i].value = MiscHelper.get_text_value(res[i].begin_token, res[i + 1].end_token, GetTextAttr.NO);
                if (res[i].value.includes("-")) 
                    res[i].value = Utils.replaceString(res[i].value, '-', ' ');
                if (!res[i + 1].begin_token.previous.is_hiphen && ((!res[i].begin_token.morph.class0.is_adjective || is_prop || is_pers))) {
                    if (is_pers && res[i + 1].end_token.get_morph_class_in_dictionary().is_proper_name) 
                        res[i].alt_value = MiscHelper.get_text_value(res[i].begin_token, res[i].end_token, GetTextAttr.NO);
                    else 
                        res[i].alt_value = MiscHelper.get_text_value(res[i + 1].begin_token, res[i + 1].end_token, GetTextAttr.NO);
                    if (res[i].alt_value.includes("-")) 
                        res[i].alt_value = Utils.replaceString(res[i].alt_value, '-', ' ');
                }
                res[i].end_token = res[i + 1].end_token;
                res[i].exist_street = null;
                res[i].is_in_dictionary = res[i + 1].is_in_dictionary || res[i].is_in_dictionary;
                res.splice(i + 1, 1);
                i--;
            }
        }
        for (let i = 0; i < (res.length - 1); i++) {
            if (res[i].typ === StreetItemType.STDADJECTIVE && res[i].end_token.is_char('.') && res[i + 1]._is_surname()) {
                res[i + 1].value = (res[i + 1].begin_token).term;
                res[i + 1].alt_value = MiscHelper.get_text_value(res[i].begin_token, res[i + 1].end_token, GetTextAttr.NO);
                res[i + 1].begin_token = res[i].begin_token;
                res.splice(i, 1);
                break;
            }
        }
        for (let i = 0; i < (res.length - 1); i++) {
            if ((res[i + 1].typ === StreetItemType.STDADJECTIVE && res[i + 1].end_token.is_char('.') && res[i + 1].begin_token.length_char === 1) && !res[i].begin_token.chars.is_all_lower) {
                if (res[i]._is_surname()) {
                    if (i === (res.length - 2) || res[i + 2].typ !== StreetItemType.NOUN) {
                        res[i].end_token = res[i + 1].end_token;
                        res.splice(i + 1, 1);
                        break;
                    }
                }
            }
        }
        for (let i = 0; i < (res.length - 1); i++) {
            if (res[i].typ === StreetItemType.NAME || res[i].typ === StreetItemType.STDNAME || res[i].typ === StreetItemType.STDADJECTIVE) {
                if (res[i + 1].typ === StreetItemType.NOUN && !res[i + 1].is_abridge) {
                    let i0 = -1;
                    if (i === 1 && res[0].typ === StreetItemType.NOUN && res.length === 3) 
                        i0 = 0;
                    else if (i === 0 && res.length === 3 && res[2].typ === StreetItemType.NOUN) 
                        i0 = 2;
                    if (i0 < 0) 
                        continue;
                    if (res[i0].termin === res[i + 1].termin) 
                        continue;
                    res[i].alt_value = (res[i].value != null ? res[i].value : MiscHelper.get_text_value(res[i].begin_token, res[i].end_token, GetTextAttr.NO));
                    if (res[i].typ === StreetItemType.STDADJECTIVE) {
                        let adjs = MiscLocationHelper.get_std_adj_full(res[i].begin_token, res[i + 1].morph.gender, res[i + 1].morph.number, true);
                        if (adjs !== null && adjs.length > 0) 
                            res[i].alt_value = adjs[0];
                    }
                    res[i].value = (res[i].alt_value + " " + res[i + 1].termin.canonic_text);
                    res[i].typ = StreetItemType.STDNAME;
                    res[i0].alt_termin = res[i + 1].termin;
                    res[i].end_token = res[i + 1].end_token;
                    res.splice(i + 1, 1);
                    i--;
                }
            }
        }
        if ((res.length >= 3 && res[0].typ === StreetItemType.NOUN && res[0].termin.canonic_text === "КВАРТАЛ") && ((res[1].typ === StreetItemType.NAME || res[1].typ === StreetItemType.STDNAME)) && res[2].typ === StreetItemType.NOUN) {
            if (res.length === 3 || res[3].typ === StreetItemType.NUMBER) {
                res[1].value = (MiscHelper.get_text_value_of_meta_token(res[1], GetTextAttr.NO) + " " + res[2].termin.canonic_text);
                res[1].end_token = res[2].end_token;
                res.splice(2, 1);
            }
        }
        if ((res.length >= 3 && res[0].typ === StreetItemType.NOUN && res[0].termin.canonic_text === "КВАРТАЛ") && ((res[2].typ === StreetItemType.NAME || res[2].typ === StreetItemType.STDNAME)) && res[1].typ === StreetItemType.NOUN) {
            if (res.length === 3 || res[3].typ === StreetItemType.NUMBER) {
                res[1].value = (MiscHelper.get_text_value_of_meta_token(res[2], GetTextAttr.NO) + " " + res[1].termin.canonic_text);
                res[1].end_token = res[2].end_token;
                res[1].typ = StreetItemType.NAME;
                res.splice(2, 1);
            }
        }
        if (res.length >= 3 && res[0].typ === StreetItemType.NUMBER && res[1].typ === StreetItemType.NOUN) {
            let nt = Utils.as(res[0].begin_token, NumberToken);
            if (nt !== null && nt.typ === NumberSpellingType.DIGIT && nt.morph.class0.is_undefined) 
                return null;
        }
        let ii0 = -1;
        let ii1 = -1;
        if (res[0].typ === StreetItemType.NOUN && res[0].is_road) {
            ii0 = (ii1 = 0);
            if (((ii0 + 1) < res.length) && res[ii0 + 1].typ === StreetItemType.NUMBER && res[ii0 + 1].is_number_km) 
                ii0++;
        }
        else if ((res.length > 1 && res[0].typ === StreetItemType.NUMBER && res[0].is_number_km) && res[1].typ === StreetItemType.NOUN && res[1].is_road) 
            ii0 = (ii1 = 1);
        if (ii0 >= 0) {
            if (res.length === (ii0 + 1)) {
                let tt = res[ii0].end_token.next;
                let num = StreetItemToken._try_attach_road_num(tt);
                if (num !== null) {
                    res.push(num);
                    tt = num.end_token.next;
                    res[0].is_abridge = false;
                }
                if (tt !== null && (tt.get_referent() instanceof GeoReferent)) {
                    let g1 = Utils.as(tt.get_referent(), GeoReferent);
                    tt = tt.next;
                    if (tt !== null && tt.is_hiphen) 
                        tt = tt.next;
                    let g2 = (tt === null ? null : Utils.as(tt.get_referent(), GeoReferent));
                    if (g2 !== null) {
                        if (g1.is_city && g2.is_city) {
                            let nam = StreetItemToken._new237(res[0].end_token.next, tt, StreetItemType.NAME);
                            nam.value = (g1.to_string(true, tt.kit.base_language, 0) + " - " + g2.to_string(true, tt.kit.base_language, 0)).toUpperCase();
                            nam.alt_value = (g2.to_string(true, tt.kit.base_language, 0) + " - " + g1.to_string(true, tt.kit.base_language, 0)).toUpperCase();
                            res.push(nam);
                        }
                    }
                }
                else if (BracketHelper.is_bracket(tt, false)) {
                    let br = BracketHelper.try_parse(tt, BracketParseAttr.NO, 100);
                    if (br !== null) {
                        let nam = StreetItemToken._new258(tt, br.end_token, StreetItemType.NAME, true);
                        nam.value = MiscHelper.get_text_value(tt.next, br.end_token, GetTextAttr.NO);
                        res.push(nam);
                    }
                }
            }
            else if ((res.length === (ii0 + 2) && res[ii0 + 1].typ === StreetItemType.NAME && res[ii0 + 1].end_token.next !== null) && res[ii0 + 1].end_token.next.is_hiphen) {
                let tt = res[ii0 + 1].end_token.next.next;
                let g2 = (tt === null ? null : Utils.as(tt.get_referent(), GeoReferent));
                let te = null;
                let name2 = null;
                if (g2 === null && tt !== null) {
                    let rt = tt.kit.process_referent("GEO", tt);
                    if (rt !== null) {
                        te = rt.end_token;
                        name2 = rt.referent.to_string(true, te.kit.base_language, 0);
                    }
                    else {
                        let cits2 = CityItemToken.try_parse_list(tt, null, 2);
                        if (cits2 !== null) {
                            if (cits2.length === 1 && cits2[0].typ === CityItemTokenItemType.PROPERNAME) {
                                name2 = cits2[0].value;
                                te = cits2[0].end_token;
                            }
                        }
                    }
                }
                else {
                    te = tt;
                    name2 = g2.to_string(true, te.kit.base_language, 0);
                }
                if (((g2 !== null && g2.is_city)) || ((g2 === null && name2 !== null))) {
                    res[ii0 + 1].alt_value = (name2 + " - " + ((res[ii0 + 1].value != null ? res[ii0 + 1].value : res[ii0 + 1].get_source_text()))).toUpperCase();
                    res[ii0 + 1].value = (((res[ii0 + 1].value != null ? res[ii0 + 1].value : res[ii0 + 1].get_source_text())) + " - " + name2).toUpperCase();
                    res[ii0 + 1].end_token = te;
                }
            }
            let nn = StreetItemToken._try_attach_road_num(res[res.length - 1].end_token.next);
            if (nn !== null) {
                res.push(nn);
                res[ii1].is_abridge = false;
            }
            if (res.length > (ii0 + 1) && res[ii0 + 1].typ === StreetItemType.NAME && res[ii1].termin.canonic_text === "АВТОДОРОГА") {
                let npt = NounPhraseHelper.try_parse(res[ii0 + 1].begin_token, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null && npt.adjectives.length > 0) 
                    return null;
            }
        }
        if (res.length > 0) {
            let it = res[res.length - 1];
            let it0 = (res.length > 1 ? res[res.length - 2] : null);
            if (it.typ === StreetItemType.NUMBER && !it.number_has_prefix) {
                if (it.begin_token instanceof NumberToken) {
                    if (!it.begin_token.morph.class0.is_adjective || it.begin_token.morph.class0.is_noun) {
                        if (AddressItemToken.check_house_after(it.end_token.next, false, true)) 
                            it.number_has_prefix = true;
                        else if (it0 !== null && it0.typ === StreetItemType.NOUN && (((it0.termin.canonic_text === "МИКРОРАЙОН" || it0.termin.canonic_text === "МІКРОРАЙОН" || it0.termin.canonic_text === "КВАРТАЛ") || it0.termin.canonic_text === "ГОРОДОК"))) {
                            let ait = AddressItemToken.try_parse(it.begin_token, loc_streets, false, true, null);
                            if (ait !== null && ait.typ === AddressItemTokenItemType.NUMBER && ait.end_char > it.end_char) {
                                it.number = null;
                                it.value = ait.value;
                                it.end_token = ait.end_token;
                                it.typ = StreetItemType.NAME;
                            }
                        }
                        else if (it0 !== null && it0.termin !== null && it0.termin.canonic_text === "ПОЧТОВОЕ ОТДЕЛЕНИЕ") 
                            it.number_has_prefix = true;
                        else if (res.length === 2 && res[0].typ === StreetItemType.NOUN && (res[0].whitespaces_after_count < 2)) {
                        }
                        else 
                            res.splice(res.length - 1, 1);
                    }
                    else 
                        it.number_has_prefix = true;
                }
            }
        }
        if (res.length === 0) 
            return null;
        for (let i = 0; i < res.length; i++) {
            if ((res[i].typ === StreetItemType.NOUN && res[i].chars.is_capital_upper && (((res[i].termin.canonic_text === "НАБЕРЕЖНАЯ" || res[i].termin.canonic_text === "МИКРОРАЙОН" || res[i].termin.canonic_text === "НАБЕРЕЖНА") || res[i].termin.canonic_text === "МІКРОРАЙОН" || res[i].termin.canonic_text === "ГОРОДОК"))) && res[i].begin_token.is_value(res[i].termin.canonic_text, null)) {
                let ok = false;
                if (i > 0 && ((res[i - 1].typ === StreetItemType.NOUN || res[i - 1].typ === StreetItemType.STDADJECTIVE))) 
                    ok = true;
                else if (i > 1 && ((res[i - 1].typ === StreetItemType.STDADJECTIVE || res[i - 1].typ === StreetItemType.NUMBER)) && res[i - 2].typ === StreetItemType.NOUN) 
                    ok = true;
                if (ok) {
                    res[i].termin = null;
                    res[i].typ = StreetItemType.NAME;
                }
            }
        }
        let last = res[res.length - 1];
        for (let kk = 0; kk < 2; kk++) {
            let ttt = last.end_token.next;
            if (((last.typ === StreetItemType.NAME && ttt !== null && ttt.length_char === 1) && ttt.chars.is_all_upper && (ttt.whitespaces_before_count < 2)) && ttt.next !== null && ttt.next.is_char('.')) 
                last.end_token = ttt.next;
        }
        return res;
    }
    
    static _try_attach_road_num(t) {
        if (t === null) 
            return null;
        if (!t.chars.is_letter || t.length_char !== 1) 
            return null;
        let tt = t.next;
        if (tt !== null && tt.is_hiphen) 
            tt = tt.next;
        if (!((tt instanceof NumberToken))) 
            return null;
        let res = StreetItemToken._new237(t, tt, StreetItemType.NAME);
        res.value = (t.get_source_text().toUpperCase() + (tt).value);
        return res;
    }
    
    static initialize() {
        const MiscLocationHelper = require("./../../geo/internal/MiscLocationHelper");
        if (StreetItemToken.m_ontology !== null) 
            return;
        StreetItemToken.m_ontology = new TerminCollection();
        StreetItemToken.m_std_ont_misc = new TerminCollection();
        let t = null;
        t = Termin._new260("УЛИЦА", StreetItemType.NOUN, MorphGender.FEMINIE);
        t.add_abridge("УЛ.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new261("ВУЛИЦЯ", StreetItemType.NOUN, MorphLang.UA, MorphGender.FEMINIE);
        t.add_abridge("ВУЛ.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new119("STREET", StreetItemType.NOUN);
        t.add_abridge("ST.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("ПЛОЩАДЬ", StreetItemType.NOUN, 1, MorphGender.FEMINIE);
        t.add_abridge("ПЛ.");
        t.add_abridge("ПЛОЩ.");
        t.add_abridge("ПЛ-ДЬ");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new264("ПЛОЩА", StreetItemType.NOUN, MorphLang.UA, 1, MorphGender.FEMINIE);
        t.add_abridge("ПЛ.");
        t.add_abridge("ПЛОЩ.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("МАЙДАН", StreetItemType.NOUN, 0, MorphGender.MASCULINE);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new119("SQUARE", StreetItemType.NOUN);
        t.add_abridge("SQ.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("ПРОЕЗД", StreetItemType.NOUN, 1, MorphGender.MASCULINE);
        t.add_abridge("ПР.");
        t.add_abridge("П-Д");
        t.add_abridge("ПР-Д");
        t.add_abridge("ПР-ЗД");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("ЛИНИЯ", StreetItemType.NOUN, 2, MorphGender.FEMINIE);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new264("ЛІНІЯ", StreetItemType.NOUN, MorphLang.UA, 2, MorphGender.FEMINIE);
        StreetItemToken.m_ontology.add(t);
        StreetItemToken.m_prospect = (t = Termin._new263("ПРОСПЕКТ", StreetItemType.NOUN, 0, MorphGender.MASCULINE));
        t.add_abridge("ПРОС.");
        t.add_abridge("ПРКТ");
        t.add_abridge("ПРОСП.");
        t.add_abridge("ПР-Т");
        t.add_abridge("ПР-КТ");
        t.add_abridge("П-Т");
        t.add_abridge("П-КТ");
        t.add_abridge("ПР Т");
        t.add_abridge("ПР-ТЕ");
        t.add_abridge("ПР-КТЕ");
        t.add_abridge("П-ТЕ");
        t.add_abridge("П-КТЕ");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("ПЕРЕУЛОК", StreetItemType.NOUN, 0, MorphGender.MASCULINE);
        t.add_abridge("ПЕР.");
        t.add_abridge("ПЕР-К");
        t.add_variant("ПРЕУЛОК", false);
        t.add_variant("ПРОУЛОК", false);
        t.add_abridge("ПРОУЛ.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new264("ПРОВУЛОК", StreetItemType.NOUN, MorphLang.UA, 0, MorphGender.MASCULINE);
        t.add_abridge("ПРОВ.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new121("LANE", StreetItemType.NOUN, 0);
        t.add_abridge("LN.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("ТУПИК", StreetItemType.NOUN, 1, MorphGender.MASCULINE);
        t.add_abridge("ТУП.");
        t.add_abridge("Т.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("БУЛЬВАР", StreetItemType.NOUN, 0, MorphGender.MASCULINE);
        t.add_abridge("БУЛЬВ.");
        t.add_abridge("БУЛ.");
        t.add_abridge("Б-Р");
        t.add_abridge("Б-РЕ");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new121("BOULEVARD", StreetItemType.NOUN, 0);
        t.add_abridge("BLVD");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new121("СКВЕР", StreetItemType.NOUN, 1);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("НАБЕРЕЖНАЯ", StreetItemType.NOUN, 0, MorphGender.FEMINIE);
        t.add_abridge("НАБ.");
        t.add_abridge("НАБЕР.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new264("НАБЕРЕЖНА", StreetItemType.NOUN, MorphLang.UA, 0, MorphGender.FEMINIE);
        t.add_abridge("НАБ.");
        t.add_abridge("НАБЕР.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("АЛЛЕЯ", StreetItemType.NOUN, 0, MorphGender.FEMINIE);
        t.add_abridge("АЛ.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new264("АЛЕЯ", StreetItemType.NOUN, MorphLang.UA, 0, MorphGender.FEMINIE);
        t.add_abridge("АЛ.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new121("ALLEY", StreetItemType.NOUN, 0);
        t.add_abridge("ALY.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("ПРОСЕКА", StreetItemType.NOUN, 1, MorphGender.FEMINIE);
        t.add_variant("ПРОСЕК", false);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new264("ПРОСІКА", StreetItemType.NOUN, MorphLang.UA, 1, MorphGender.FEMINIE);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("ШОССЕ", StreetItemType.NOUN, 1, MorphGender.NEUTER);
        t.add_abridge("Ш.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new264("ШОСЕ", StreetItemType.NOUN, MorphLang.UA, 1, MorphGender.NEUTER);
        t.add_abridge("Ш.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new121("ROAD", StreetItemType.NOUN, 1);
        t.add_abridge("RD.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("МИКРОРАЙОН", StreetItemType.NOUN, 0, MorphGender.MASCULINE);
        t.add_abridge("МКР.");
        t.add_abridge("МИКР-Н");
        t.add_abridge("МКР-Н");
        t.add_abridge("МКРН.");
        t.add_abridge("М-Н");
        t.add_abridge("М-ОН");
        t.add_abridge("М/Р");
        t.add_variant("МІКРОРАЙОН", false);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("КВАРТАЛ", StreetItemType.NOUN, 2, MorphGender.MASCULINE);
        t.add_abridge("КВАРТ.");
        t.add_abridge("КВ-Л");
        t.add_abridge("КВ.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new290("ЖИЛОЙ КОМПЛЕКС", StreetItemType.NOUN, "ЖК", 0, MorphGender.MASCULINE);
        t.add_variant("ЖИЛКОМПЛЕКС", false);
        t.add_abridge("ЖИЛ.К.");
        t.add_abridge("Ж/К");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("ГОРОДОК", StreetItemType.NOUN, 0, MorphGender.MASCULINE);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new264("МІСТЕЧКО", StreetItemType.NOUN, MorphLang.UA, 0, MorphGender.NEUTER);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new121("HILL", StreetItemType.NOUN, 0);
        t.add_abridge("HL.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("ВОЕННЫЙ ГОРОДОК", StreetItemType.NOUN, 0, MorphGender.MASCULINE);
        t.add_abridge("В.ГОРОДОК");
        t.add_abridge("В/Г");
        t.add_abridge("В/ГОРОДОК");
        t.add_abridge("В/ГОР");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("ПРОМЗОНА", StreetItemType.NOUN, 1, MorphGender.FEMINIE);
        t.add_variant("ПРОМЫШЛЕННАЯ ЗОНА", false);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("ЖИЛАЯ ЗОНА", StreetItemType.NOUN, 1, MorphGender.FEMINIE);
        t.add_variant("ЖИЛЗОНА", false);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("КОММУНАЛЬНАЯ ЗОНА", StreetItemType.NOUN, 1, MorphGender.FEMINIE);
        t.add_variant("КОМЗОНА", false);
        t.add_abridge("КОММУН. ЗОНА");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("МАССИВ", StreetItemType.NOUN, 2, MorphGender.MASCULINE);
        t.add_variant("ЖИЛОЙ МАССИВ", false);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("МОСТ", StreetItemType.NOUN, 2, MorphGender.MASCULINE);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new264("МІСТ", StreetItemType.NOUN, MorphLang.UA, 2, MorphGender.MASCULINE);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new263("ПАРК", StreetItemType.NOUN, 2, MorphGender.MASCULINE);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new121("PLAZA", StreetItemType.NOUN, 1);
        t.add_abridge("PLZ");
        StreetItemToken.m_ontology.add(t);
        StreetItemToken.m_metro = (t = Termin._new303("СТАНЦИЯ МЕТРО", "МЕТРО", StreetItemType.NOUN, 0, MorphGender.FEMINIE));
        t.add_variant("СТАНЦІЯ МЕТРО", false);
        t.add_abridge("СТ.МЕТРО");
        t.add_abridge("СТ.М.");
        t.add_abridge("МЕТРО");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new290("АВТОДОРОГА", StreetItemType.NOUN, "ФАД", 0, MorphGender.FEMINIE);
        t.add_variant("ФЕДЕРАЛЬНАЯ АВТОДОРОГА", false);
        t.add_variant("АВТОМОБИЛЬНАЯ ДОРОГА", false);
        t.add_variant("АВТОТРАССА", false);
        t.add_variant("ФЕДЕРАЛЬНАЯ ТРАССА", false);
        t.add_variant("АВТОМАГИСТРАЛЬ", false);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new303("ДОРОГА", "АВТОДОРОГА", StreetItemType.NOUN, 1, MorphGender.FEMINIE);
        t.add_variant("ТРАССА", false);
        t.add_variant("МАГИСТРАЛЬ", false);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new264("АВТОДОРОГА", StreetItemType.NOUN, MorphLang.UA, 0, MorphGender.FEMINIE);
        t.add_variant("ФЕДЕРАЛЬНА АВТОДОРОГА", false);
        t.add_variant("АВТОМОБІЛЬНА ДОРОГА", false);
        t.add_variant("АВТОТРАСА", false);
        t.add_variant("ФЕДЕРАЛЬНА ТРАСА", false);
        t.add_variant("АВТОМАГІСТРАЛЬ", false);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new307("ДОРОГА", "АВТОДОРОГА", StreetItemType.NOUN, MorphLang.UA, 1, MorphGender.FEMINIE);
        t.add_variant("ТРАСА", false);
        t.add_variant("МАГІСТРАЛЬ", false);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new308("МОСКОВСКАЯ КОЛЬЦЕВАЯ АВТОМОБИЛЬНАЯ ДОРОГА", "МКАД", StreetItemType.FIX, MorphGender.FEMINIE);
        t.add_variant("МОСКОВСКАЯ КОЛЬЦЕВАЯ АВТОДОРОГА", false);
        StreetItemToken.m_ontology.add(t);
        StreetItemToken.m_ontology.add(Termin._new119("САДОВОЕ КОЛЬЦО", StreetItemType.FIX));
        StreetItemToken.m_ontology.add(Termin._new119("БУЛЬВАРНОЕ КОЛЬЦО", StreetItemType.FIX));
        StreetItemToken.m_ontology.add(Termin._new119("ТРАНСПОРТНОЕ КОЛЬЦО", StreetItemType.FIX));
        t = Termin._new312("ПОЧТОВОЕ ОТДЕЛЕНИЕ", StreetItemType.STDNAME, "ОПС", MorphGender.NEUTER);
        t.add_abridge("П.О.");
        t.add_abridge("ПОЧТ.ОТД.");
        t.add_abridge("ПОЧТОВ.ОТД.");
        t.add_abridge("ПОЧТОВОЕ ОТД.");
        t.add_variant("ОТДЕЛЕНИЕ ПОЧТОВОЙ СВЯЗИ", false);
        t.add_variant("ПОЧТАМТ", false);
        t.add_variant("ГЛАВПОЧТАМТ", false);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new119("БОЛЬШОЙ", StreetItemType.STDADJECTIVE);
        t.add_abridge("БОЛ.");
        t.add_abridge("Б.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new120("ВЕЛИКИЙ", StreetItemType.STDADJECTIVE, MorphLang.UA);
        t.add_abridge("ВЕЛ.");
        t.add_abridge("В.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new119("МАЛЫЙ", StreetItemType.STDADJECTIVE);
        t.add_abridge("МАЛ.");
        t.add_abridge("М.");
        t.add_variant("МАЛИЙ", false);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new119("СРЕДНИЙ", StreetItemType.STDADJECTIVE);
        t.add_abridge("СРЕД.");
        t.add_abridge("СР.");
        t.add_abridge("С.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new120("СЕРЕДНІЙ", StreetItemType.STDADJECTIVE, MorphLang.UA);
        t.add_abridge("СЕРЕД.");
        t.add_abridge("СЕР.");
        t.add_abridge("С.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new119("ВЕРХНИЙ", StreetItemType.STDADJECTIVE);
        t.add_abridge("ВЕРХН.");
        t.add_abridge("ВЕРХ.");
        t.add_abridge("ВЕР.");
        t.add_abridge("В.");
        t.add_variant("ВЕРХНІЙ", false);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new119("НИЖНИЙ", StreetItemType.STDADJECTIVE);
        t.add_abridge("НИЖН.");
        t.add_abridge("НИЖ.");
        t.add_abridge("Н.");
        t.add_variant("НИЖНІЙ", false);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new119("СТАРЫЙ", StreetItemType.STDADJECTIVE);
        t.add_abridge("СТАР.");
        t.add_abridge("СТ.");
        t.add_variant("СТАРИЙ", false);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new119("НОВЫЙ", StreetItemType.STDADJECTIVE);
        t.add_abridge("НОВ.");
        t.add_variant("НОВИЙ", false);
        StreetItemToken.m_ontology.add(t);
        t = Termin._new119("НОМЕР", StreetItemType.STDADJECTIVE);
        t.add_abridge("N");
        t.add_abridge("№");
        t.add_abridge("НОМ.");
        StreetItemToken.m_ontology.add(t);
        for (const s of ["ФРИДРИХА ЭНГЕЛЬСА", "КАРЛА МАРКСА", "РОЗЫ ЛЮКСЕМБУРГ"]) {
            t = Termin._new119(s, StreetItemType.STDNAME);
            t.add_all_abridges(0, 0, 0);
            StreetItemToken.m_ontology.add(t);
        }
        for (const s of ["МАРТА", "МАЯ", "ОКТЯБРЯ", "НОЯБРЯ", "БЕРЕЗНЯ", "ТРАВНЯ", "ЖОВТНЯ", "ЛИСТОПАДА"]) {
            StreetItemToken.m_ontology.add(Termin._new119(s, StreetItemType.STDNAME));
        }
        for (const s of ["МАРШАЛА", "ГЕНЕРАЛА", "АДМИРАЛА", "КОСМОНАВТА", "ЛЕТЧИКА", "АВИАКОНСТРУКТОРА", "АРХИТЕКТОРА", "СКУЛЬПТОРА", "ХУДОЖНИКА", "КОНСТРУКТОРА", "АКАДЕМИКА", "ПРОФЕССОРА", "ЛЕЙТЕНАНТА", "КАПИТАНА", "МАЙОРА", "ПОДПОЛКОВНИКА", "ПОЛКОВНИКА", "ПОЛИЦИИ", "МИЛИЦИИ"]) {
            StreetItemToken.m_std_ont_misc.add(new Termin(s));
            t = Termin._new119(s, StreetItemType.STDPARTOFNAME);
            t.add_all_abridges(0, 0, 2);
            t.add_all_abridges(2, 5, 0);
            t.add_abridge("ГЛ." + s);
            t.add_abridge("ГЛАВ." + s);
            StreetItemToken.m_ontology.add(t);
        }
        for (const s of ["МАРШАЛА", "ГЕНЕРАЛА", "АДМІРАЛА", "КОСМОНАВТА", "ЛЬОТЧИКА", "АВІАКОНСТРУКТОРА", "АРХІТЕКТОРА", "СКУЛЬПТОРА", "ХУДОЖНИКА", "КОНСТРУКТОРА", "АКАДЕМІКА", "ПРОФЕСОРА", "ЛЕЙТЕНАНТА", "КАПІТАН", "МАЙОР", "ПІДПОЛКОВНИК", "ПОЛКОВНИК", "ПОЛІЦІЇ", "МІЛІЦІЇ"]) {
            StreetItemToken.m_std_ont_misc.add(new Termin(s));
            t = Termin._new120(s, StreetItemType.STDPARTOFNAME, MorphLang.UA);
            t.add_all_abridges(0, 0, 2);
            t.add_all_abridges(2, 5, 0);
            t.add_abridge("ГЛ." + s);
            t.add_abridge("ГЛАВ." + s);
            StreetItemToken.m_ontology.add(t);
        }
        t = Termin._new119("ВАСИЛЬЕВСКОГО ОСТРОВА", StreetItemType.STDNAME);
        t.add_abridge("В.О.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new119("ПЕТРОГРАДСКОЙ СТОРОНЫ", StreetItemType.STDNAME);
        t.add_abridge("П.С.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new119("ОЛИМПИЙСКАЯ ДЕРЕВНЯ", StreetItemType.FIX);
        t.add_abridge("ОЛИМП. ДЕРЕВНЯ");
        t.add_abridge("ОЛИМП. ДЕР.");
        StreetItemToken.m_ontology.add(t);
        t = Termin._new119("ЛЕНИНСКИЕ ГОРЫ", StreetItemType.FIX);
        StreetItemToken.m_ontology.add(t);
        let obj = EpNerAddressInternalResourceHelper.get_bytes("s.dat");
        if (obj === null) 
            throw new Error("Can't file resource file s.dat in Location analyzer");
        let streets = Utils.decodeString("UTF-8", MiscLocationHelper.deflate(obj), 0, -1);
        let name = new StringBuilder();
        let names = new Hashtable();
        for (const line0 of Utils.splitString(streets, '\n', false)) {
            let line = line0.trim();
            if (Utils.isNullOrEmpty(line)) 
                continue;
            if (line.indexOf(';') >= 0) {
                let parts = Utils.splitString(line, ';', false);
                t = Termin._new331(StreetItemType.NAME, true);
                t.init_by_normal_text(parts[0], null);
                for (let j = 1; j < parts.length; j++) {
                    t.add_variant(parts[j], true);
                }
            }
            else {
                t = Termin._new331(StreetItemType.NAME, true);
                t.init_by_normal_text(line, null);
            }
            if (t.terms.length > 1) 
                t.tag = StreetItemType.STDNAME;
            StreetItemToken.m_ontology.add(t);
        }
    }
    
    static _new219(_arg1, _arg2, _arg3, _arg4) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.number = _arg4;
        return res;
    }
    
    static _new220(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.number = _arg4;
        res.morph = _arg5;
        return res;
    }
    
    static _new221(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.number = _arg4;
        res.number_has_prefix = _arg5;
        return res;
    }
    
    static _new222(_arg1, _arg2, _arg3) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.has_std_suffix = _arg3;
        return res;
    }
    
    static _new223(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.termin = _arg3;
        res.typ = _arg4;
        res.is_abridge = _arg5;
        return res;
    }
    
    static _new224(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.exist_street = _arg4;
        res.morph = _arg5;
        res.is_in_dictionary = _arg6;
        return res;
    }
    
    static _new225(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.number = _arg4;
        res.number_has_prefix = _arg5;
        res.morph = _arg6;
        return res;
    }
    
    static _new226(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.termin = _arg4;
        res.is_abridge = _arg5;
        res.morph = _arg6;
        return res;
    }
    
    static _new228(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7, _arg8) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.termin = _arg4;
        res.alt_termin = _arg5;
        res.is_abridge = _arg6;
        res.morph = _arg7;
        res.noun_is_doubt_coef = _arg8;
        return res;
    }
    
    static _new229(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.morph = _arg4;
        res.value = _arg5;
        return res;
    }
    
    static _new232(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.morph = _arg4;
        res.termin = _arg5;
        return res;
    }
    
    static _new233(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.morph = _arg4;
        res.is_in_dictionary = _arg5;
        return res;
    }
    
    static _new234(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.morph = _arg4;
        res.is_in_dictionary = _arg5;
        res.termin = _arg6;
        return res;
    }
    
    static _new235(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.is_in_dictionary = _arg4;
        res.value = _arg5;
        res.morph = _arg6;
        return res;
    }
    
    static _new236(_arg1, _arg2, _arg3, _arg4) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        return res;
    }
    
    static _new237(_arg1, _arg2, _arg3) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
    
    static _new238(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.number = _arg4;
        res.value = _arg5;
        return res;
    }
    
    static _new239(_arg1, _arg2, _arg3, _arg4) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.morph = _arg4;
        return res;
    }
    
    static _new241(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.morph = _arg4;
        res.alt_value = _arg5;
        return res;
    }
    
    static _new250(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        res.alt_value = _arg5;
        return res;
    }
    
    static _new255(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        res.is_in_brackets = _arg5;
        return res;
    }
    
    static _new258(_arg1, _arg2, _arg3, _arg4) {
        let res = new StreetItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.is_in_brackets = _arg4;
        return res;
    }
    
    static static_constructor() {
        StreetItemToken.m_ontology = null;
        StreetItemToken.m_std_ont_misc = null;
        StreetItemToken.m_prospect = null;
        StreetItemToken.m_metro = null;
    }
}


StreetItemToken.static_constructor();

module.exports = StreetItemToken
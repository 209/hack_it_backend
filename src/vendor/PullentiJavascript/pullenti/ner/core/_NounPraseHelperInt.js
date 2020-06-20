/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");

const MorphCase = require("./../../morph/MorphCase");
const MorphGender = require("./../../morph/MorphGender");
const MorphNumber = require("./../../morph/MorphNumber");
const NounPhraseItemTextVar = require("./internal/NounPhraseItemTextVar");
const MorphCollection = require("./../MorphCollection");
const GetTextAttr = require("./GetTextAttr");
const Token = require("./../Token");
const MorphClass = require("./../../morph/MorphClass");
const NounPhraseParseAttr = require("./NounPhraseParseAttr");
const MorphWordForm = require("./../../morph/MorphWordForm");
const NounPhraseToken = require("./NounPhraseToken");
const Explanatory = require("./../../semantic/utils/Explanatory");
const TextToken = require("./../TextToken");
const MetaToken = require("./../MetaToken");
const BracketParseAttr = require("./BracketParseAttr");
const CharsInfo = require("./../../morph/CharsInfo");
const ReferentToken = require("./../ReferentToken");
const PrepositionHelper = require("./PrepositionHelper");
const NounPhraseHelper = require("./NounPhraseHelper");
const MorphBaseInfo = require("./../../morph/MorphBaseInfo");
const NumberToken = require("./../NumberToken");
const MiscHelper = require("./MiscHelper");
const NounPhraseItem = require("./internal/NounPhraseItem");
const BracketHelper = require("./BracketHelper");

class _NounPraseHelperInt {
    
    static try_parse(first, typ, max_char_pos, noun) {
        if (first === null) 
            return null;
        if (first.not_noun_phrase) {
            if ((((typ.value()) & (((((NounPhraseParseAttr.IGNOREPARTICIPLES.value()) | (NounPhraseParseAttr.REFERENTCANBENOUN.value()) | (NounPhraseParseAttr.PARSEPRONOUNS.value())) | (NounPhraseParseAttr.PARSEADVERBS.value()) | (NounPhraseParseAttr.PARSENUMERICASADJECTIVE.value())) | (NounPhraseParseAttr.IGNOREBRACKETS.value()))))) === (NounPhraseParseAttr.NO.value())) 
                return null;
        }
        let cou = 0;
        for (let t = first; t !== null; t = t.next) {
            if (max_char_pos > 0 && t.begin_char > max_char_pos) 
                break;
            if (t.morph.language.is_cyrillic || (((t instanceof NumberToken) && t.morph.class0.is_adjective && !t.chars.is_latin_letter)) || (((t instanceof ReferentToken) && (((typ.value()) & (NounPhraseParseAttr.REFERENTCANBENOUN.value()))) !== (NounPhraseParseAttr.NO.value()) && !t.chars.is_latin_letter))) {
                let res = _NounPraseHelperInt.try_parse_ru(first, typ, max_char_pos, noun);
                if (res === null) 
                    first.not_noun_phrase = true;
                return res;
            }
            else if (t.chars.is_latin_letter) {
                let res = _NounPraseHelperInt.try_parse_en(first, typ, max_char_pos);
                if (res === null) 
                    first.not_noun_phrase = true;
                return res;
            }
            else if ((++cou) > 0) 
                break;
        }
        return null;
    }
    
    static try_parse_ru(first, typ, max_char_pos, def_noun = null) {
        if (first === null) 
            return null;
        let items = null;
        let adverbs = null;
        let prep = null;
        let kak = false;
        let t0 = first;
        if ((((typ.value()) & (NounPhraseParseAttr.PARSEPREPOSITION.value()))) !== (NounPhraseParseAttr.NO.value()) && t0.is_value("КАК", null)) {
            t0 = t0.next;
            prep = PrepositionHelper.try_parse(t0);
            if (prep !== null) 
                t0 = prep.end_token.next;
            kak = true;
        }
        let internal_noun_prase = null;
        let conj_before = false;
        for (let t = t0; t !== null; t = t.next) {
            if (max_char_pos > 0 && t.begin_char > max_char_pos) 
                break;
            if ((t.morph.class0.is_conjunction && !t.morph.class0.is_adjective && !t.morph.class0.is_pronoun) && !t.morph.class0.is_noun) {
                if (conj_before) 
                    break;
                if ((((typ.value()) & (NounPhraseParseAttr.CANNOTHASCOMMAAND.value()))) !== (NounPhraseParseAttr.NO.value())) 
                    break;
                if (items !== null && ((t.is_and || t.is_or))) {
                    conj_before = true;
                    if ((t.next !== null && t.next.is_char_of("\\/") && t.next.next !== null) && t.next.next.is_or) 
                        t = t.next.next;
                    if (((t.next !== null && t.next.is_char('(') && t.next.next !== null) && t.next.next.is_or && t.next.next.next !== null) && t.next.next.next.is_char(')')) 
                        t = t.next.next.next;
                    continue;
                }
                break;
            }
            else if (t.is_comma) {
                if (conj_before || items === null) 
                    break;
                if ((((typ.value()) & (NounPhraseParseAttr.CANNOTHASCOMMAAND.value()))) !== (NounPhraseParseAttr.NO.value())) 
                    break;
                let mc = t.previous.get_morph_class_in_dictionary();
                if (mc.is_proper_surname || mc.is_proper_secname) 
                    break;
                conj_before = true;
                if (kak && t.next !== null && t.next.is_value("ТАК", null)) {
                    t = t.next;
                    if (t.next !== null && t.next.is_and) 
                        t = t.next;
                    let pr = PrepositionHelper.try_parse(t.next);
                    if (pr !== null) 
                        t = pr.end_token;
                }
                if (items[items.length - 1].can_be_noun && items[items.length - 1].end_token.morph.class0.is_pronoun) 
                    break;
                continue;
            }
            else if (t.is_char('(')) {
                if (items === null) 
                    return null;
                let brr = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (brr === null) 
                    break;
                if (brr.length_char > 100) 
                    break;
                t = brr.end_token;
                continue;
            }
            if (t instanceof ReferentToken) {
                if ((((typ.value()) & (NounPhraseParseAttr.REFERENTCANBENOUN.value()))) === (NounPhraseParseAttr.NO.value())) 
                    break;
            }
            else if (t.chars.is_latin_letter) 
                break;
            let it = NounPhraseItem.try_parse(t, items, typ);
            if (it === null || ((!it.can_be_adj && !it.can_be_noun))) {
                if (((it !== null && items !== null && t.chars.is_capital_upper) && (t.whitespaces_before_count < 3) && t.length_char > 3) && !t.get_morph_class_in_dictionary().is_noun) {
                    it.can_be_noun = true;
                    items.push(it);
                    break;
                }
                if ((((typ.value()) & (NounPhraseParseAttr.PARSEADVERBS.value()))) !== (NounPhraseParseAttr.NO.value()) && (t instanceof TextToken) && t.morph.class0.is_adverb) {
                    if (items === null) {
                        if (t.previous !== null && t.previous.morph.class0.is_preposition) {
                        }
                        else 
                            return null;
                    }
                    if (adverbs === null) 
                        adverbs = new Array();
                    adverbs.push(Utils.as(t, TextToken));
                    continue;
                }
                break;
            }
            it.conj_before = conj_before;
            conj_before = false;
            if (!it.can_be_adj && !it.can_be_noun) 
                break;
            if (t.is_newline_before && t !== first) {
                if ((((typ.value()) & (NounPhraseParseAttr.MULTILINES.value()))) !== (NounPhraseParseAttr.NO.value())) {
                }
                else if (items !== null && CharsInfo.ooNoteq(t.chars, items[items.length - 1].chars)) {
                    if (t.chars.is_all_lower && items[items.length - 1].chars.is_capital_upper) {
                    }
                    else 
                        break;
                }
            }
            if (items === null) 
                items = new Array();
            else {
                let it0 = items[items.length - 1];
                if (it0.can_be_noun && it0.is_personal_pronoun) {
                    if (it.is_pronoun) 
                        break;
                    if ((it0.begin_token.previous !== null && it0.begin_token.previous.get_morph_class_in_dictionary().is_verb && !it0.begin_token.previous.get_morph_class_in_dictionary().is_adjective) && !it0.begin_token.previous.get_morph_class_in_dictionary().is_preposition) {
                        if (t.morph._case.is_nominative || t.morph._case.is_accusative) {
                        }
                        else 
                            break;
                    }
                    if (it.can_be_noun && it.is_verb) {
                        if (it0.previous === null) {
                        }
                        else if ((it0.previous instanceof TextToken) && !it0.previous.chars.is_letter) {
                        }
                        else 
                            break;
                    }
                }
            }
            items.push(it);
            t = it.end_token;
            if (t.is_newline_after && !t.chars.is_all_lower) {
                let mc = t.get_morph_class_in_dictionary();
                if (mc.is_proper_surname) 
                    break;
                if (t.morph.class0.is_proper_surname && mc.is_undefined) 
                    break;
            }
        }
        if (items === null) 
            return null;
        let tt1 = null;
        if (items.length === 1 && items[0].can_be_adj) {
            let and = false;
            for (tt1 = items[0].end_token.next; tt1 !== null; tt1 = tt1.next) {
                if (tt1.is_and || tt1.is_or) {
                    and = true;
                    break;
                }
                if (tt1.is_comma || tt1.is_value("НО", null) || tt1.is_value("ТАК", null)) 
                    continue;
                break;
            }
            if (and) {
                if (items[0].can_be_noun && items[0].is_personal_pronoun) 
                    and = false;
            }
            if (and) {
                let tt2 = tt1.next;
                if (tt2 !== null && tt2.morph.class0.is_preposition) 
                    tt2 = tt2.next;
                let npt1 = _NounPraseHelperInt.try_parse_ru(tt2, typ, max_char_pos, null);
                if (npt1 !== null && npt1.adjectives.length > 0) {
                    let ok1 = false;
                    for (const av of items[0].adj_morph) {
                        for (const v of (npt1.noun).noun_morph) {
                            if (v.check_accord(av, false, false)) {
                                items[0].morph.add_item(av);
                                ok1 = true;
                            }
                        }
                    }
                    if (ok1) {
                        npt1.begin_token = items[0].begin_token;
                        npt1.end_token = tt1.previous;
                        npt1.adjectives.splice(0, npt1.adjectives.length);
                        npt1.adjectives.push(items[0]);
                        return npt1;
                    }
                }
            }
        }
        if (def_noun !== null) 
            items.push(def_noun);
        let last1 = items[items.length - 1];
        let check = true;
        for (const it of items) {
            if (!it.can_be_adj) {
                check = false;
                break;
            }
            else if (it.can_be_noun && it.is_personal_pronoun) {
                check = false;
                break;
            }
        }
        tt1 = last1.end_token.next;
        if ((tt1 !== null && check && ((tt1.morph.class0.is_preposition || tt1.morph._case.is_instrumental))) && (tt1.whitespaces_before_count < 2)) {
            let inp = NounPhraseHelper.try_parse(tt1, NounPhraseParseAttr.of((typ.value()) | (NounPhraseParseAttr.PARSEPREPOSITION.value())), max_char_pos, null);
            if (inp !== null) {
                tt1 = inp.end_token.next;
                let npt1 = _NounPraseHelperInt.try_parse_ru(tt1, typ, max_char_pos, null);
                if (npt1 !== null) {
                    let ok = true;
                    for (let ii = 0; ii < items.length; ii++) {
                        let it = items[ii];
                        if (NounPhraseItem.try_accord_adj_and_noun(it, Utils.as(npt1.noun, NounPhraseItem))) 
                            continue;
                        if (ii > 0) {
                            let inp2 = NounPhraseHelper.try_parse(it.begin_token, typ, max_char_pos, null);
                            if (inp2 !== null && inp2.end_token === inp.end_token) {
                                items.splice(ii, items.length - ii);
                                inp = inp2;
                                break;
                            }
                        }
                        ok = false;
                        break;
                    }
                    if (ok) {
                        if (npt1.morph._case.is_genitive && !inp.morph._case.is_instrumental) 
                            ok = false;
                    }
                    if (ok) {
                        for (let i = 0; i < items.length; i++) {
                            npt1.adjectives.splice(i, 0, items[i]);
                        }
                        npt1.internal_noun = inp;
                        let mmm = new MorphCollection(npt1.morph);
                        for (const it of items) {
                            mmm.remove_items(it.adj_morph[0], false);
                        }
                        if (mmm.gender !== MorphGender.UNDEFINED || mmm.number !== MorphNumber.UNDEFINED || !mmm._case.is_undefined) 
                            npt1.morph = mmm;
                        if (adverbs !== null) {
                            if (npt1.adverbs === null) 
                                npt1.adverbs = adverbs;
                            else 
                                npt1.adverbs.splice(0, 0, ...adverbs);
                        }
                        npt1.begin_token = first;
                        return npt1;
                    }
                }
                if (tt1 !== null && tt1.morph.class0.is_noun && !tt1.morph._case.is_genitive) {
                    let it = NounPhraseItem.try_parse(tt1, items, typ);
                    if (it !== null && it.can_be_noun) {
                        internal_noun_prase = inp;
                        inp.begin_token = items[0].end_token.next;
                        items.push(it);
                    }
                }
            }
        }
        for (let i = 0; i < items.length; i++) {
            if (items[i].can_be_adj && items[i].begin_token.morph.class0.is_verb) {
                let it = items[i].begin_token;
                if (!it.get_morph_class_in_dictionary().is_verb) 
                    continue;
                if (it.is_value("УПОЛНОМОЧЕННЫЙ", null)) 
                    continue;
                if ((((typ.value()) & (NounPhraseParseAttr.PARSEVERBS.value()))) === (NounPhraseParseAttr.NO.value())) 
                    continue;
                let inp = _NounPraseHelperInt.try_parse_ru(items[i].end_token.next, NounPhraseParseAttr.NO, max_char_pos, null);
                if (inp === null) 
                    continue;
                if (inp.end_token.whitespaces_after_count > 3) 
                    continue;
                let npt1 = _NounPraseHelperInt.try_parse_ru(inp.end_token.next, NounPhraseParseAttr.NO, max_char_pos, null);
                if (npt1 === null) 
                    continue;
                let ok = true;
                for (let j = 0; j <= i; j++) {
                    if (!NounPhraseItem.try_accord_adj_and_noun(items[j], Utils.as(npt1.noun, NounPhraseItem))) {
                        ok = false;
                        break;
                    }
                }
                if (!ok) 
                    continue;
                for (let j = 0; j <= i; j++) {
                    npt1.adjectives.splice(j, 0, items[j]);
                }
                items[i].end_token = inp.end_token;
                let mmm = new MorphCollection(npt1.morph);
                let bil = new Array();
                for (let j = 0; j <= i; j++) {
                    bil.splice(0, bil.length);
                    for (const m of items[j].adj_morph) {
                        bil.push(m);
                    }
                    mmm.remove_items_list_cla(bil, null);
                }
                if (mmm.gender !== MorphGender.UNDEFINED || mmm.number !== MorphNumber.UNDEFINED || !mmm._case.is_undefined) 
                    npt1.morph = mmm;
                if (adverbs !== null) {
                    if (npt1.adverbs === null) 
                        npt1.adverbs = adverbs;
                    else 
                        npt1.adverbs.splice(0, 0, ...adverbs);
                }
                npt1.begin_token = first;
                return npt1;
            }
        }
        let ok2 = false;
        if ((items.length === 1 && (((typ.value()) & (NounPhraseParseAttr.ADJECTIVECANBELAST.value()))) !== (NounPhraseParseAttr.NO.value()) && (items[0].whitespaces_after_count < 3)) && !items[0].is_adverb) {
            if (!items[0].can_be_adj) 
                ok2 = true;
            else if (items[0].is_personal_pronoun && items[0].can_be_noun) 
                ok2 = true;
        }
        if (ok2) {
            let it = NounPhraseItem.try_parse(items[0].end_token.next, null, typ);
            if (it !== null && it.can_be_adj && it.begin_token.chars.is_all_lower) {
                ok2 = true;
                if (it.is_adverb || it.is_verb) 
                    ok2 = false;
                if (it.is_pronoun && items[0].is_pronoun) {
                    ok2 = false;
                    if (it.can_be_adj_for_personal_pronoun && items[0].is_personal_pronoun) 
                        ok2 = true;
                }
                if (ok2 && NounPhraseItem.try_accord_adj_and_noun(it, items[0])) {
                    let npt1 = _NounPraseHelperInt.try_parse_ru(it.begin_token, typ, max_char_pos, null);
                    if (npt1 !== null && ((npt1.end_char > it.end_char || npt1.adjectives.length > 0))) {
                    }
                    else 
                        items.splice(0, 0, it);
                }
            }
        }
        let noun = null;
        let adj_after = null;
        for (let i = items.length - 1; i >= 0; i--) {
            if (items[i].can_be_noun) {
                if (items[i].conj_before) 
                    continue;
                if (i > 0 && !items[i - 1].can_be_adj) 
                    continue;
                if (i > 0 && items[i - 1].can_be_noun) {
                    if (items[i - 1].is_doubt_adjective) 
                        continue;
                    if (items[i - 1].is_pronoun && items[i].is_pronoun) {
                        if (items[i].is_pronoun && items[i - 1].can_be_adj_for_personal_pronoun) {
                        }
                        else 
                            continue;
                    }
                }
                noun = items[i];
                items.splice(i, items.length - i);
                if (adj_after !== null) 
                    items.push(adj_after);
                else if (items.length > 0 && items[0].can_be_noun && !items[0].can_be_adj) {
                    noun = items[0];
                    items.splice(0, items.length);
                }
                break;
            }
        }
        if (noun === null) 
            return null;
        let res = NounPhraseToken._new536(first, noun.end_token, prep);
        if (adverbs !== null) {
            for (const a of adverbs) {
                if (a.begin_char < noun.begin_char) {
                    if (res.adverbs === null) 
                        res.adverbs = new Array();
                    res.adverbs.push(a);
                }
            }
        }
        res.noun = noun;
        res.multi_nouns = noun.multi_nouns;
        if (kak) 
            res.multi_nouns = true;
        res.internal_noun = internal_noun_prase;
        for (const v of noun.noun_morph) {
            noun.morph.add_item(v);
        }
        res.morph = noun.morph;
        if (res.morph._case.is_nominative && first.previous !== null && first.previous.morph.class0.is_preposition) 
            res.morph._case = MorphCase.ooBitxor(res.morph._case, MorphCase.NOMINATIVE);
        if ((((typ.value()) & (NounPhraseParseAttr.PARSEPRONOUNS.value()))) === (NounPhraseParseAttr.NO.value()) && ((res.morph.class0.is_pronoun || res.morph.class0.is_personal_pronoun))) 
            return null;
        let stat = null;
        if (items.length > 1) 
            stat = new Hashtable();
        let need_update_morph = false;
        if (items.length > 0) {
            let ok_list = new Array();
            let is_num_not = false;
            for (const vv of noun.noun_morph) {
                let i = 0;
                let v = vv;
                for (i = 0; i < items.length; i++) {
                    let ok = false;
                    for (const av of items[i].adj_morph) {
                        if (v.check_accord(av, false, false)) {
                            ok = true;
                            if (!(MorphCase.ooBitand(av._case, v._case)).is_undefined && MorphCase.ooNoteq(av._case, v._case)) 
                                v._case = av._case = MorphCase.ooBitand(av._case, v._case);
                            break;
                        }
                    }
                    if (!ok) {
                        if (items[i].can_be_numeric_adj && items[i].try_accord_var(v, false)) {
                            ok = true;
                            v = Utils.as(v.clone(), NounPhraseItemTextVar);
                            v.number = MorphNumber.PLURAL;
                            is_num_not = true;
                            v._case = new MorphCase();
                            for (const a of items[i].adj_morph) {
                                v._case = MorphCase.ooBitor(v._case, a._case);
                            }
                        }
                        else 
                            break;
                    }
                }
                if (i >= items.length) 
                    ok_list.push(v);
            }
            if (ok_list.length > 0 && (((ok_list.length < res.morph.items_count) || is_num_not))) {
                res.morph = new MorphCollection();
                for (const v of ok_list) {
                    res.morph.add_item(v);
                }
                if (!is_num_not) 
                    noun.morph = res.morph;
            }
        }
        for (let i = 0; i < items.length; i++) {
            for (const av of items[i].adj_morph) {
                for (const v of noun.noun_morph) {
                    if (v.check_accord(av, false, false)) {
                        if (!(MorphCase.ooBitand(av._case, v._case)).is_undefined && MorphCase.ooNoteq(av._case, v._case)) {
                            v._case = av._case = MorphCase.ooBitand(av._case, v._case);
                            need_update_morph = true;
                        }
                        items[i].morph.add_item(av);
                        if (stat !== null && av.normal_value.length > 1) {
                            let last = av.normal_value[av.normal_value.length - 1];
                            if (!stat.containsKey(last)) 
                                stat.put(last, 1);
                            else 
                                stat.put(last, stat.get(last) + 1);
                        }
                    }
                }
            }
            if (items[i].is_pronoun || items[i].is_personal_pronoun) {
                res.anafor = items[i].begin_token;
                if ((((typ.value()) & (NounPhraseParseAttr.PARSEPRONOUNS.value()))) === (NounPhraseParseAttr.NO.value())) 
                    continue;
            }
            let tt = Utils.as(items[i].begin_token, TextToken);
            if (tt !== null && !tt.term.startsWith("ВЫСШ")) {
                let err = false;
                for (const wf of tt.morph.items) {
                    if (wf.class0.is_adjective) {
                        if (wf.contains_attr("прев.", null)) {
                            if ((((typ.value()) & (NounPhraseParseAttr.IGNOREADJBEST.value()))) !== (NounPhraseParseAttr.NO.value())) 
                                err = true;
                        }
                        if (wf.contains_attr("к.ф.", null) && tt.morph.class0.is_personal_pronoun) 
                            return null;
                    }
                }
                if (err) 
                    continue;
            }
            if (res.morph._case.is_nominative) {
                let v = MiscHelper.get_text_value_of_meta_token(items[i], GetTextAttr.KEEPQUOTES);
                if (!Utils.isNullOrEmpty(v)) {
                    if (items[i].get_normal_case_text(null, false, MorphGender.UNDEFINED, false) !== v) {
                        let wf = new NounPhraseItemTextVar(items[i].morph, null);
                        wf.normal_value = v;
                        wf.class0 = MorphClass.ADJECTIVE;
                        wf._case = res.morph._case;
                        if (res.morph._case.is_prepositional || res.morph.gender === MorphGender.NEUTER || res.morph.gender === MorphGender.FEMINIE) 
                            items[i].morph.add_item(wf);
                        else 
                            items[i].morph.insert_item(0, wf);
                    }
                }
            }
            res.adjectives.push(items[i]);
            if (items[i].end_char > res.end_char) 
                res.end_token = items[i].end_token;
        }
        for (let i = 0; i < (res.adjectives.length - 1); i++) {
            if (res.adjectives[i].whitespaces_after_count > 5) {
                if (CharsInfo.ooNoteq(res.adjectives[i].chars, res.adjectives[i + 1].chars)) {
                    if (!res.adjectives[i + 1].chars.is_all_lower) 
                        return null;
                    if (res.adjectives[i].chars.is_all_upper && res.adjectives[i + 1].chars.is_capital_upper) 
                        return null;
                    if (res.adjectives[i].chars.is_capital_upper && res.adjectives[i + 1].chars.is_all_upper) 
                        return null;
                }
                if (res.adjectives[i].whitespaces_after_count > 10) {
                    if (res.adjectives[i].newlines_after_count === 1) {
                        if (res.adjectives[i].chars.is_capital_upper && i === 0 && res.adjectives[i + 1].chars.is_all_lower) 
                            continue;
                        if (CharsInfo.ooEq(res.adjectives[i].chars, res.adjectives[i + 1].chars)) 
                            continue;
                    }
                    return null;
                }
            }
        }
        if (need_update_morph) {
            noun.morph = new MorphCollection();
            for (const v of noun.noun_morph) {
                noun.morph.add_item(v);
            }
            res.morph = noun.morph;
        }
        if (res.adjectives.length > 0) {
            if (noun.begin_token.previous !== null) {
                if (noun.begin_token.previous.is_comma_and) {
                    if (res.adjectives[0].begin_char > noun.begin_char) {
                    }
                    else 
                        return null;
                }
            }
            let zap = 0;
            let and = 0;
            let cou = 0;
            let last_and = false;
            for (let i = 0; i < (res.adjectives.length - 1); i++) {
                let te = res.adjectives[i].end_token.next;
                if (te === null) 
                    return null;
                if (te.is_char('(')) {
                }
                else if (te.is_comma) {
                    zap++;
                    last_and = false;
                }
                else if (te.is_and || te.is_or) {
                    and++;
                    last_and = true;
                }
                if (!res.adjectives[i].begin_token.morph.class0.is_pronoun) 
                    cou++;
            }
            if ((zap + and) > 0) {
                if (and > 1) 
                    return null;
                else if (and === 1 && !last_and) 
                    return null;
                if ((zap + and) !== cou) {
                    if (and === 1) {
                    }
                    else 
                        return null;
                }
                let last = Utils.as(res.adjectives[res.adjectives.length - 1], NounPhraseItem);
                if (last.is_pronoun && !last_and) 
                    return null;
            }
        }
        if (stat !== null) {
            for (const adj of items) {
                if (adj.morph.items_count > 1) {
                    let w1 = Utils.as(adj.morph.get_indexer_item(0), NounPhraseItemTextVar);
                    let w2 = Utils.as(adj.morph.get_indexer_item(1), NounPhraseItemTextVar);
                    if ((w1.normal_value.length < 2) || (w2.normal_value.length < 2)) 
                        break;
                    let l1 = w1.normal_value[w1.normal_value.length - 1];
                    let l2 = w2.normal_value[w2.normal_value.length - 1];
                    let i1 = 0;
                    let i2 = 0;
                    let wrapi1538 = new RefOutArgWrapper();
                    stat.tryGetValue(l1, wrapi1538);
                    i1 = wrapi1538.value;
                    let wrapi2537 = new RefOutArgWrapper();
                    stat.tryGetValue(l2, wrapi2537);
                    i2 = wrapi2537.value;
                    if (i1 < i2) {
                        adj.morph.remove_item(1);
                        adj.morph.insert_item(0, w2);
                    }
                }
            }
        }
        if (res.begin_token.get_morph_class_in_dictionary().is_verb && items.length > 0) {
            if (!res.begin_token.chars.is_all_lower || res.begin_token.previous === null) {
            }
            else if (res.begin_token.previous.morph.class0.is_preposition) {
            }
            else {
                let comma = false;
                for (let tt = res.begin_token.previous; tt !== null; tt = tt.previous) {
                    if (tt.morph.class0.is_adverb) 
                        continue;
                    if (tt.is_char_of(".;")) 
                        break;
                    if (tt.is_comma) {
                        comma = true;
                        continue;
                    }
                    if (tt.is_value("НЕ", null)) 
                        continue;
                    if (((tt.morph.class0.is_noun || tt.morph.class0.is_proper)) && comma) {
                        for (const it of res.begin_token.morph.items) {
                            if (it.class0.is_verb && (it instanceof MorphWordForm)) {
                                if (tt.morph.check_accord(it, false, false)) {
                                    if (res.morph._case.is_instrumental) 
                                        return null;
                                    let ews = Explanatory.find_derivates((it).normal_case, true, tt.morph.language);
                                    if (ews !== null) {
                                        for (const ew of ews) {
                                            if (ew.cm.transitive) {
                                                if (res.morph._case.is_genitive) 
                                                    return null;
                                            }
                                            if (ew.cm.nexts !== null) {
                                                let cm = null;
                                                let wrapcm539 = new RefOutArgWrapper();
                                                let inoutres540 = ew.cm.nexts.tryGetValue("", wrapcm539);
                                                cm = wrapcm539.value;
                                                if (inoutres540) {
                                                    if (!(MorphCase.ooBitand(cm, res.morph._case)).is_undefined) 
                                                        return null;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break;
                }
            }
        }
        if (res.begin_token === res.end_token) {
            let mc = res.begin_token.get_morph_class_in_dictionary();
            if (mc.is_adverb) {
                if (res.begin_token.previous !== null && res.begin_token.previous.morph.class0.is_preposition) {
                }
                else if (mc.is_noun && !mc.is_preposition && !mc.is_conjunction) {
                }
                else if (res.begin_token.is_value("ВЕСЬ", null)) {
                }
                else 
                    return null;
            }
        }
        if (def_noun !== null && def_noun.end_token === res.end_token && res.adjectives.length > 0) 
            res.end_token = res.adjectives[res.adjectives.length - 1].end_token;
        return res;
    }
    
    static try_parse_en(first, typ, max_char_pos) {
        if (first === null) 
            return null;
        let items = null;
        let has_article = false;
        let has_prop = false;
        let has_misc = false;
        if (first.previous !== null && first.previous.morph.class0.is_preposition && (first.whitespaces_before_count < 3)) 
            has_prop = true;
        for (let t = first; t !== null; t = t.next) {
            if (max_char_pos > 0 && t.begin_char > max_char_pos) 
                break;
            if (!t.chars.is_latin_letter) 
                break;
            if (t !== first && t.whitespaces_before_count > 2) {
                if ((((typ.value()) & (NounPhraseParseAttr.MULTILINES.value()))) !== (NounPhraseParseAttr.NO.value())) {
                }
                else if (MiscHelper.is_eng_article(t.previous)) {
                }
                else 
                    break;
            }
            let tt = Utils.as(t, TextToken);
            if (t === first && tt !== null) {
                if (MiscHelper.is_eng_article(tt)) {
                    has_article = true;
                    continue;
                }
            }
            if (t instanceof ReferentToken) {
                if ((((typ.value()) & (NounPhraseParseAttr.REFERENTCANBENOUN.value()))) === (NounPhraseParseAttr.NO.value())) 
                    break;
            }
            else if (tt === null) 
                break;
            if ((t.is_value("SO", null) && t.next !== null && t.next.is_hiphen) && t.next.next !== null) {
                if (t.next.next.is_value("CALL", null)) {
                    t = t.next.next;
                    continue;
                }
            }
            let mc = t.get_morph_class_in_dictionary();
            if (mc.is_conjunction || mc.is_preposition) 
                break;
            if (mc.is_pronoun || mc.is_personal_pronoun) {
                if ((((typ.value()) & (NounPhraseParseAttr.PARSEPRONOUNS.value()))) === (NounPhraseParseAttr.NO.value())) 
                    break;
            }
            else if (mc.is_misc) {
                if (t.is_value("THIS", null) || t.is_value("THAT", null)) {
                    has_misc = true;
                    if ((((typ.value()) & (NounPhraseParseAttr.PARSEPRONOUNS.value()))) === (NounPhraseParseAttr.NO.value())) 
                        break;
                }
            }
            let is_adj = false;
            if (((has_article || has_prop || has_misc)) && items === null) {
            }
            else if (t instanceof ReferentToken) {
            }
            else {
                if (!mc.is_noun && !mc.is_adjective) {
                    if (mc.is_undefined && has_article) {
                    }
                    else if (items === null && mc.is_undefined && t.chars.is_capital_upper) {
                    }
                    else if (mc.is_pronoun) {
                    }
                    else if (tt.term.endsWith("EAN")) 
                        is_adj = true;
                    else if (MiscHelper.is_eng_adj_suffix(tt.next)) {
                    }
                    else 
                        break;
                }
                if (mc.is_verb) {
                    if (t.next !== null && t.next.morph.class0.is_verb && (t.whitespaces_after_count < 2)) {
                    }
                    else if (t.chars.is_capital_upper && !MiscHelper.can_be_start_of_sentence(t)) {
                    }
                    else if ((t.chars.is_capital_upper && mc.is_noun && (t.next instanceof TextToken)) && t.next.chars.is_capital_upper) {
                    }
                    else if (t instanceof ReferentToken) {
                    }
                    else 
                        break;
                }
            }
            if (items === null) 
                items = new Array();
            let it = new NounPhraseItem(t, t);
            if (mc.is_noun) 
                it.can_be_noun = true;
            if (mc.is_adjective || mc.is_pronoun || is_adj) 
                it.can_be_adj = true;
            items.push(it);
            t = it.end_token;
            if (items.length === 1) {
                if (MiscHelper.is_eng_adj_suffix(t.next)) {
                    mc.is_noun = false;
                    mc.is_adjective = true;
                    t = t.next.next;
                }
            }
        }
        if (items === null) 
            return null;
        let noun = items[items.length - 1];
        let res = new NounPhraseToken(first, noun.end_token);
        res.noun = noun;
        res.morph = new MorphCollection();
        for (const v of noun.end_token.morph.items) {
            if (v.class0.is_verb) 
                continue;
            if (v.class0.is_proper && noun.begin_token.chars.is_all_lower) 
                continue;
            let vv = Utils.as(v.clone(), MorphBaseInfo);
            if (has_article && vv.number !== MorphNumber.SINGULAR) 
                vv.number = MorphNumber.SINGULAR;
            res.morph.add_item(vv);
        }
        if (res.morph.items_count === 0 && has_article) 
            res.morph.add_item(MorphBaseInfo._new211(MorphClass.NOUN, MorphNumber.SINGULAR));
        for (let i = 0; i < (items.length - 1); i++) {
            res.adjectives.push(items[i]);
        }
        return res;
    }
}


module.exports = _NounPraseHelperInt
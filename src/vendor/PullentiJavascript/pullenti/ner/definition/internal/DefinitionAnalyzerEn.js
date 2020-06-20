/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const GetTextAttr = require("./../../core/GetTextAttr");
const TextToken = require("./../../TextToken");
const DefinitionKind = require("./../DefinitionKind");
const DefinitionReferent = require("./../DefinitionReferent");
const MetaToken = require("./../../MetaToken");
const Referent = require("./../../Referent");
const ReferentToken = require("./../../ReferentToken");
const Token = require("./../../Token");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const MiscHelper = require("./../../core/MiscHelper");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const BracketHelper = require("./../../core/BracketHelper");
const NounPhraseToken = require("./../../core/NounPhraseToken");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");

class DefinitionAnalyzerEn {
    
    static process(kit, ad) {
        for (let t = kit.first_token; t !== null; t = t.next) {
            if (!MiscHelper.can_be_start_of_sentence(t)) 
                continue;
            let rt = DefinitionAnalyzerEn.try_parse_thesis(t);
            if (rt === null) 
                continue;
            rt.referent = ad.register_referent(rt.referent);
            kit.embed_token(rt);
            t = rt;
        }
    }
    
    static try_parse_thesis(t) {
        if (t === null) 
            return null;
        let t0 = t;
        let tt = t;
        let mc = tt.get_morph_class_in_dictionary();
        let preamb = null;
        if (mc.is_conjunction) 
            return null;
        if (t.is_value("LET", null)) 
            return null;
        if (mc.is_preposition || mc.is_misc || mc.is_adverb) {
            if (!MiscHelper.is_eng_article(tt)) {
                for (tt = tt.next; tt !== null; tt = tt.next) {
                    if (tt.is_comma) 
                        break;
                    if (tt.is_char('(')) {
                        let br = BracketHelper.try_parse(tt, BracketParseAttr.NO, 100);
                        if (br !== null) {
                            tt = br.end_token;
                            continue;
                        }
                    }
                    if (MiscHelper.can_be_start_of_sentence(tt)) 
                        break;
                    let npt0 = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.of((NounPhraseParseAttr.PARSENUMERICASADJECTIVE.value()) | (NounPhraseParseAttr.REFERENTCANBENOUN.value())), 0, null);
                    if (npt0 !== null) {
                        tt = npt0.end_token;
                        continue;
                    }
                    if (tt.get_morph_class_in_dictionary().is_verb) 
                        break;
                }
                if (tt === null || !tt.is_comma || tt.next === null) 
                    return null;
                preamb = new MetaToken(t0, tt.previous);
                tt = tt.next;
            }
        }
        let t1 = tt;
        mc = tt.get_morph_class_in_dictionary();
        let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.of((NounPhraseParseAttr.PARSENUMERICASADJECTIVE.value()) | (NounPhraseParseAttr.REFERENTCANBENOUN.value()) | (NounPhraseParseAttr.PARSEADVERBS.value())), 0, null);
        if (npt === null && (tt instanceof TextToken)) {
            if (tt.chars.is_all_upper) 
                npt = new NounPhraseToken(tt, tt);
            else if (!tt.chars.is_all_lower) {
                if (mc.is_proper || preamb !== null) 
                    npt = new NounPhraseToken(tt, tt);
            }
        }
        if (npt === null) 
            return null;
        if (mc.is_personal_pronoun) 
            return null;
        let t2 = npt.end_token.next;
        if (t2 === null || MiscHelper.can_be_start_of_sentence(t2) || !((t2 instanceof TextToken))) 
            return null;
        if (!t2.get_morph_class_in_dictionary().is_verb) 
            return null;
        let t3 = t2;
        for (tt = t2.next; tt !== null; tt = tt.next) {
            if (!tt.get_morph_class_in_dictionary().is_verb) 
                break;
        }
        for (; tt !== null; tt = tt.next) {
            if (tt.next === null) {
                t3 = tt;
                break;
            }
            if (tt.is_char_of(".;!?")) {
                if (MiscHelper.can_be_start_of_sentence(tt.next)) {
                    t3 = tt;
                    break;
                }
            }
            if (!((tt instanceof TextToken))) 
                continue;
            if (BracketHelper.can_be_start_of_sequence(tt, false, false)) {
                let br = BracketHelper.try_parse(tt, BracketParseAttr.NO, 100);
                if (br !== null) {
                    tt = br.end_token;
                    continue;
                }
            }
        }
        tt = t3;
        if (t3.is_char_of(";.!?")) 
            tt = tt.previous;
        let txt = MiscHelper.get_text_value(t2, tt, GetTextAttr.of((GetTextAttr.KEEPREGISTER.value()) | (GetTextAttr.KEEPQUOTES.value())));
        if (txt === null || (txt.length < 15)) 
            return null;
        if (t0 !== t1) {
            tt = t1.previous;
            if (tt.is_comma) 
                tt = tt.previous;
            let txt0 = MiscHelper.get_text_value(t0, tt, GetTextAttr.of((GetTextAttr.KEEPREGISTER.value()) | (GetTextAttr.KEEPQUOTES.value())));
            if (txt0 !== null && txt0.length > 10) {
                if (t0.chars.is_capital_upper) 
                    txt0 = (txt0[0].toLowerCase()) + txt0.substring(1);
                txt = (txt + ", " + txt0);
            }
        }
        tt = t1;
        if (MiscHelper.is_eng_article(tt)) 
            tt = tt.next;
        let nam = MiscHelper.get_text_value(tt, t2.previous, GetTextAttr.KEEPQUOTES);
        if (nam.startsWith("SO-CALLED")) 
            nam = nam.substring(9).trim();
        let dr = new DefinitionReferent();
        dr.kind = DefinitionKind.ASSERTATION;
        dr.add_slot(DefinitionReferent.ATTR_TERMIN, nam, false, 0);
        dr.add_slot(DefinitionReferent.ATTR_VALUE, txt, false, 0);
        return new ReferentToken(dr, t0, t3);
    }
}


module.exports = DefinitionAnalyzerEn
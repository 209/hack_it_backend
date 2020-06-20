/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");

const MetaToken = require("./../../ner/MetaToken");
const MorphLang = require("./../../morph/MorphLang");
const MorphCase = require("./../../morph/MorphCase");
const MorphNumber = require("./../../morph/MorphNumber");
const AdverbToken = require("./AdverbToken");
const Quantity = require("./../Quantity");
const LanguageHelper = require("./../../morph/LanguageHelper");
const SemLinkType = require("./../SemLinkType");
const MorphAspect = require("./../../morph/MorphAspect");
const SemObjectType = require("./../SemObjectType");
const SemAttributeType = require("./../SemAttributeType");
const MorphWordForm = require("./../../morph/MorphWordForm");
const SemAttribute = require("./../SemAttribute");
const MeasureReferent = require("./../../ner/measure/MeasureReferent");
const MorphClass = require("./../../morph/MorphClass");
const MorphGender = require("./../../morph/MorphGender");
const MorphBaseInfo = require("./../../morph/MorphBaseInfo");
const TextToken = require("./../../ner/TextToken");
const Explanatory = require("./../utils/Explanatory");
const SemObject = require("./../SemObject");
const NumberToken = require("./../../ner/NumberToken");
const ReferentToken = require("./../../ner/ReferentToken");
const NumberHelper = require("./../../ner/core/NumberHelper");

class CreateHelper {
    
    static _set_morph(obj, wf) {
        if (wf === null) 
            return;
        obj.morph.normal_case = wf.normal_case;
        obj.morph.normal_full = (wf.normal_full != null ? wf.normal_full : wf.normal_case);
        obj.morph.number = wf.number;
        obj.morph.gender = wf.gender;
        obj.morph.misc = wf.misc;
    }
    
    static _set_morph0(obj, bi) {
        obj.morph.number = bi.number;
        obj.morph.gender = bi.gender;
    }
    
    static create_noun_group(gr, npt) {
        let noun = npt.noun.begin_token;
        let sem = new SemObject(gr);
        sem.tokens.push(npt.noun);
        sem.typ = SemObjectType.NOUN;
        if (npt.noun.morph.class0.is_personal_pronoun) 
            sem.typ = SemObjectType.PERSONALPRONOUN;
        else if (npt.noun.morph.class0.is_pronoun) 
            sem.typ = SemObjectType.PRONOUN;
        if (npt.noun.begin_token !== npt.noun.end_token) {
            sem.morph.normal_case = npt.noun.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
            sem.morph.normal_full = npt.noun.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
            sem.morph.class0 = MorphClass.NOUN;
            sem.morph.number = npt.morph.number;
            sem.morph.gender = npt.morph.gender;
            sem.morph._case = npt.morph._case;
        }
        else if (noun instanceof TextToken) {
            for (const wf of noun.morph.items) {
                if (wf.check_accord(npt.morph, false, false) && (wf instanceof MorphWordForm)) {
                    CreateHelper._set_morph(sem, Utils.as(wf, MorphWordForm));
                    break;
                }
            }
            if (sem.morph.normal_case === null) {
                sem.morph.normal_case = noun.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
                sem.morph.normal_full = noun.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
            }
            let grs = Explanatory.find_derivates(sem.morph.normal_full, true, null);
            if (grs !== null && grs.length > 0) 
                sem.concept = grs[0];
        }
        else if (noun instanceof ReferentToken) {
            let r = (noun).referent;
            if (r === null) 
                return null;
            sem.morph.normal_full = (sem.morph.normal_case = r.toString());
            sem.concept = r;
        }
        else if (noun instanceof NumberToken) {
            let num = Utils.as(noun, NumberToken);
            sem.morph.gender = noun.morph.gender;
            sem.morph.number = noun.morph.number;
            if (num.int_value !== null) {
                sem.morph.normal_case = NumberHelper.get_number_adjective(num.int_value, noun.morph.gender, noun.morph.number);
                sem.morph.normal_full = NumberHelper.get_number_adjective(num.int_value, MorphGender.MASCULINE, MorphNumber.SINGULAR);
            }
            else 
                sem.morph.normal_full = (sem.morph.normal_case = noun.get_source_text().toUpperCase());
        }
        noun.tag = sem;
        if (npt.adjectives.length > 0) {
            for (const a of npt.adjectives) {
                if (npt.multi_nouns && a !== npt.adjectives[0]) 
                    break;
                let asem = CreateHelper.create_npt_adj(gr, npt, a);
                if (asem !== null) 
                    gr.add_link(SemLinkType.DETAIL, sem, asem, "какой", false, null);
            }
        }
        if (npt.internal_noun !== null) {
            let intsem = CreateHelper.create_noun_group(gr, npt.internal_noun);
            if (intsem !== null) 
                gr.add_link(SemLinkType.DETAIL, sem, intsem, null, false, null);
        }
        gr.objects.push(sem);
        return sem;
    }
    
    static create_number(gr, num) {
        let rs = num.create_refenets_tokens_with_register(null, null, false);
        if (rs === null || rs.length === 0) 
            return null;
        let mr = Utils.as(rs[rs.length - 1].referent, MeasureReferent);
        let sem = new SemObject(gr);
        gr.objects.push(sem);
        sem.tokens.push(num);
        sem.morph.normal_full = (sem.morph.normal_case = mr.to_string(true, null, 0));
        sem.typ = SemObjectType.NOUN;
        sem.measure = mr.kind;
        for (let i = 0; i < sem.morph.normal_case.length; i++) {
            let ch = sem.morph.normal_case[i];
            if (Utils.isDigit(ch) || Utils.isWhitespace(ch) || "[].+-".indexOf(ch) >= 0) 
                continue;
            sem.quantity = new Quantity(sem.morph.normal_case.substring(0, 0 + i).trim(), num.begin_token, num.end_token);
            sem.morph.normal_case = sem.morph.normal_case.substring(i).trim();
            if (num.units.length === 1 && num.units[0].unit !== null) {
                sem.morph.normal_full = num.units[0].unit.fullname_cyr;
                if (sem.morph.normal_full === "%") 
                    sem.morph.normal_full = "процент";
            }
            break;
        }
        sem.concept = mr;
        return sem;
    }
    
    static create_adverb(gr, adv) {
        let res = new SemObject(gr);
        gr.objects.push(res);
        res.tokens.push(adv);
        res.typ = SemObjectType.ADVERB;
        res.not = adv.not;
        res.morph.normal_case = (res.morph.normal_full = adv.spelling);
        let grs = Explanatory.find_derivates(res.morph.normal_full, true, null);
        if (grs !== null && grs.length > 0) 
            res.concept = grs[0];
        return res;
    }
    
    static create_npt_adj(gr, npt, a) {
        if (a.morph.class0.is_pronoun) {
            let asem = new SemObject(gr);
            gr.objects.push(asem);
            asem.tokens.push(a);
            asem.typ = (a.begin_token.morph.class0.is_personal_pronoun ? SemObjectType.PERSONALPRONOUN : SemObjectType.PRONOUN);
            for (const it of a.begin_token.morph.items) {
                let wf = Utils.as(it, MorphWordForm);
                if (wf === null) 
                    continue;
                if (!npt.morph._case.is_undefined) {
                    if ((MorphCase.ooBitand(npt.morph._case, wf._case)).is_undefined) 
                        continue;
                }
                CreateHelper._set_morph(asem, wf);
                if (asem.morph.normal_full === "КАКОВ") 
                    asem.morph.normal_full = "КАКОЙ";
                break;
            }
            if (asem.morph.normal_full === null) 
                asem.morph.normal_full = (asem.morph.normal_case = a.get_normal_case_text(null, false, MorphGender.UNDEFINED, false));
            return asem;
        }
        if (!a.morph.class0.is_verb) {
            let asem = new SemObject(gr);
            gr.objects.push(asem);
            asem.tokens.push(a);
            asem.typ = SemObjectType.ADJECTIVE;
            for (const wf of a.begin_token.morph.items) {
                if (wf.check_accord(npt.morph, false, false) && wf.class0.is_adjective && (wf instanceof MorphWordForm)) {
                    CreateHelper._set_morph(asem, Utils.as(wf, MorphWordForm));
                    break;
                }
            }
            if (asem.morph.normal_case === null) {
                asem.morph.normal_case = a.get_normal_case_text(MorphClass.ADJECTIVE, false, MorphGender.UNDEFINED, false);
                asem.morph.normal_full = a.get_normal_case_text(MorphClass.ADJECTIVE, true, MorphGender.MASCULINE, false);
                CreateHelper._set_morph0(asem, a.begin_token.morph);
            }
            let grs = Explanatory.find_derivates(asem.morph.normal_full, true, null);
            if (grs !== null && grs.length > 0) 
                asem.concept = grs[0];
            return asem;
        }
        return null;
    }
    
    static create_verb_group(gr, vpt) {
        let sems = new Array();
        let attrs = new Array();
        let adverbs = new Array();
        for (let i = 0; i < vpt.items.length; i++) {
            let v = vpt.items[i];
            if (v.is_adverb) {
                let adv = AdverbToken.try_parse(v.begin_token);
                if (adv === null) 
                    continue;
                if (adv.typ !== SemAttributeType.UNDEFINED) {
                    attrs.push(SemAttribute._new2899(adv.not, adv.typ, adv.spelling));
                    continue;
                }
                let adverb = CreateHelper.create_adverb(gr, adv);
                if (attrs.length > 0) {
                    adverb.attrs.splice(adverb.attrs.length, 0, ...attrs);
                    attrs.splice(0, attrs.length);
                }
                adverbs.push(adverb);
                continue;
            }
            if (v.normal === "БЫТЬ") {
                let j = 0;
                for (j = i + 1; j < vpt.items.length; j++) {
                    if (!vpt.items[j].is_adverb) 
                        break;
                }
                if (j < vpt.items.length) 
                    continue;
            }
            let sem = new SemObject(gr);
            gr.objects.push(sem);
            sem.tokens.push(v);
            v.tag = sem;
            CreateHelper._set_morph(sem, v.verb_morph);
            sem.morph.normal_case = (sem.morph.normal_full = v.normal);
            if (v.is_participle || v.is_dee_participle) {
                sem.typ = SemObjectType.PARTICIPLE;
                sem.morph.normal_full = Utils.notNull(v.end_token.get_normal_case_text(MorphClass.VERB, false, MorphGender.UNDEFINED, false), (sem !== null && sem.morph !== null ? sem.morph.normal_case : null));
                sem.morph.normal_case = v.end_token.get_normal_case_text(MorphClass.ADJECTIVE, false, MorphGender.UNDEFINED, false);
                if (sem.morph.normal_case === sem.morph.normal_full && v.normal.endsWith("Й")) {
                    let grs2 = Explanatory.find_derivates(v.normal, true, null);
                    if (grs2 !== null) {
                        for (const g of grs2) {
                            for (const w of g.words) {
                                if (MorphLang.ooEq(w.lang, v.end_token.morph.language) && w.class0.is_verb && !w.class0.is_adjective) {
                                    sem.morph.normal_full = w.spelling;
                                    break;
                                }
                            }
                        }
                    }
                }
                else if (sem.morph.normal_case === sem.morph.normal_full && v.is_participle && sem.morph.normal_full.endsWith("Ь")) {
                    for (const it of v.end_token.morph.items) {
                        let wf = Utils.as(it, MorphWordForm);
                        if (wf === null) 
                            continue;
                        if (wf.normal_case.endsWith("Й") || ((wf.normal_full !== null && wf.normal_full.endsWith("Й")))) {
                            sem.morph.normal_case = (wf.normal_full != null ? wf.normal_full : wf.normal_case);
                            break;
                        }
                    }
                    if (sem.morph.normal_case === sem.morph.normal_full) {
                        let grs2 = Explanatory.find_derivates(sem.morph.normal_case, true, null);
                        if (grs2 !== null) {
                            for (const g of grs2) {
                                for (const w of g.words) {
                                    if (MorphLang.ooEq(w.lang, v.end_token.morph.language) && w.class0.is_verb && w.class0.is_adjective) {
                                        sem.morph.normal_case = w.spelling;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            }
            else 
                sem.typ = SemObjectType.VERB;
            if (v.verb_morph !== null && v.verb_morph.contains_attr("возвр.", null)) {
                if (sem.morph.normal_full.endsWith("СЯ") || sem.morph.normal_full.endsWith("СЬ")) 
                    sem.morph.normal_full = sem.morph.normal_full.substring(0, 0 + sem.morph.normal_full.length - 2);
            }
            let grs = Explanatory.find_derivates(sem.morph.normal_full, true, null);
            if (grs !== null && grs.length > 0) {
                sem.concept = grs[0];
                if (v.verb_morph !== null && v.verb_morph.misc.aspect === MorphAspect.IMPERFECTIVE) {
                    for (const w of grs[0].words) {
                        if (w.class0.is_verb && !w.class0.is_adjective) {
                            if (w.aspect === MorphAspect.PERFECTIVE) {
                                sem.morph.normal_full = w.spelling;
                                break;
                            }
                        }
                    }
                }
            }
            sem.not = v.not;
            sems.push(sem);
            if (attrs.length > 0) {
                sem.attrs.splice(sem.attrs.length, 0, ...attrs);
                attrs.splice(0, attrs.length);
            }
            if (adverbs.length > 0) {
                for (const a of adverbs) {
                    gr.add_link(SemLinkType.DETAIL, sem, a, "как", false, null);
                }
            }
            adverbs.splice(0, adverbs.length);
        }
        if (sems.length === 0) 
            return null;
        if (attrs.length > 0) 
            sems[sems.length - 1].attrs.splice(sems[sems.length - 1].attrs.length, 0, ...attrs);
        if (adverbs.length > 0) {
            let sem = sems[sems.length - 1];
            for (const a of adverbs) {
                gr.add_link(SemLinkType.DETAIL, sem, a, "как", false, null);
            }
        }
        for (let i = sems.length - 1; i > 0; i--) {
            gr.add_link(SemLinkType.DETAIL, sems[i - 1], sems[i], "что делать", false, null);
        }
        return sems[0];
    }
    
    static create_question(li) {
        let res = ((li.source.prep != null ? li.source.prep : "")).toLowerCase();
        if (res.length > 0) 
            res += " ";
        let cas = li.source.source.morph._case;
        if (!Utils.isNullOrEmpty(li.source.prep)) {
            let cas1 = LanguageHelper.get_case_after_preposition(li.source.prep);
            if (!cas1.is_undefined) {
                if (!(MorphCase.ooBitand(cas1, cas)).is_undefined) 
                    cas = MorphCase.ooBitand(cas, cas1);
            }
        }
        if (cas.is_genitive) 
            res += "чего";
        else if (cas.is_instrumental) 
            res += "чем";
        else if (cas.is_dative) 
            res += "чему";
        else if (cas.is_accusative) 
            res += "что";
        else if (cas.is_prepositional) 
            res += "чём";
        return res;
    }
}


module.exports = CreateHelper
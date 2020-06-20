/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const MorphCase = require("./../../morph/MorphCase");
const NounPhraseHelper = require("./../../ner/core/NounPhraseHelper");
const MorphCollection = require("./../../ner/MorphCollection");
const TextToken = require("./../../ner/TextToken");
const NumberToken = require("./../../ner/NumberToken");
const ConjunctionType = require("./../../ner/core/ConjunctionType");
const MorphNumber = require("./../../morph/MorphNumber");
const PrepositionHelper = require("./../../ner/core/PrepositionHelper");
const MorphMood = require("./../../morph/MorphMood");
const SemAttributeType = require("./../SemAttributeType");
const MorphWordForm = require("./../../morph/MorphWordForm");
const NGItem = require("./NGItem");
const NounPhraseParseAttr = require("./../../ner/core/NounPhraseParseAttr");
const Quantity = require("./../Quantity");
const NGLink = require("./NGLink");
const VerbPhraseHelper = require("./../../ner/core/VerbPhraseHelper");
const MorphClass = require("./../../morph/MorphClass");
const MorphGender = require("./../../morph/MorphGender");
const MetaToken = require("./../../ner/MetaToken");
const ReferentToken = require("./../../ner/ReferentToken");
const NumbersWithUnitToken = require("./../../ner/measure/internal/NumbersWithUnitToken");
const AdverbToken = require("./AdverbToken");
const SentItemType = require("./SentItemType");
const NounPhraseToken = require("./../../ner/core/NounPhraseToken");
const Explanatory = require("./../utils/Explanatory");
const SemAttribute = require("./../SemAttribute");
const NGLinkType = require("./NGLinkType");
const SemAttributeEx = require("./SemAttributeEx");
const ConjunctionHelper = require("./../../ner/core/ConjunctionHelper");
const ConjunctionToken = require("./../../ner/core/ConjunctionToken");
const DelimToken = require("./DelimToken");
const SentItemSubtype = require("./SentItemSubtype");
const VerbPhraseToken = require("./../../ner/core/VerbPhraseToken");
const Sentence = require("./Sentence");

class SentItem {
    
    constructor(mt) {
        this.source = null;
        this.prep = null;
        this.typ = SentItemType.UNDEFINED;
        this.sub_typ = SentItemSubtype.UNDEFINED;
        this.sub_sent = null;
        this.plural = -1;
        this.dr_groups = null;
        this.dr_groups2 = null;
        this.part_verb_typ = NGLinkType.UNDEFINED;
        this.participle_coef = 1;
        this.quant = null;
        this.attrs = null;
        this.can_be_question = false;
        this.result = null;
        this.result_verb_last = null;
        this.m_res_graph = null;
        this.res_frag = null;
        this.result_list = null;
        this.result_list_or = false;
        this.m_begin_token = null;
        this.m_end_token = null;
        this.source = mt;
        if (mt instanceof NounPhraseToken) {
            let npt = Utils.as(mt, NounPhraseToken);
            if (npt.preposition !== null) 
                this.prep = npt.preposition.normal;
            else 
                this.prep = "";
            this.typ = SentItemType.NOUN;
            let normal = npt.noun.get_normal_case_text(MorphClass.NOUN, true, MorphGender.MASCULINE, false);
            if (normal !== null) 
                this.dr_groups = Explanatory.find_derivates(normal, true, null);
        }
        else if ((mt instanceof ReferentToken) || (mt instanceof NumbersWithUnitToken)) 
            this.typ = SentItemType.NOUN;
        else if (mt instanceof AdverbToken) 
            this.typ = SentItemType.ADVERB;
        else if (mt instanceof ConjunctionToken) 
            this.typ = SentItemType.CONJ;
        else if (mt instanceof DelimToken) 
            this.typ = SentItemType.DELIM;
        else if (mt instanceof VerbPhraseToken) {
            let vpt = Utils.as(mt, VerbPhraseToken);
            let normal = (vpt.first_verb.verb_morph === null ? null : (vpt.first_verb.verb_morph.normal_full != null ? vpt.first_verb.verb_morph.normal_full : vpt.first_verb.verb_morph.normal_case));
            if (normal !== null) 
                this.dr_groups = Explanatory.find_derivates(normal, true, null);
            if (vpt.first_verb !== vpt.last_verb) {
                normal = (vpt.last_verb.verb_morph === null ? vpt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false) : (vpt.last_verb.verb_morph.normal_full != null ? vpt.last_verb.verb_morph.normal_full : vpt.last_verb.verb_morph.normal_case));
                this.dr_groups2 = Explanatory.find_derivates(normal, true, null);
            }
            else 
                this.dr_groups2 = this.dr_groups;
            this.prep = (vpt.preposition === null ? "" : vpt.preposition.normal);
            this.typ = SentItemType.VERB;
        }
    }
    
    copy_from(it) {
        this.source = it.source;
        this.typ = it.typ;
        this.sub_typ = it.sub_typ;
        this.prep = it.prep;
        this.participle_coef = it.participle_coef;
        this.dr_groups = it.dr_groups;
        this.dr_groups2 = it.dr_groups2;
        this.part_verb_typ = it.part_verb_typ;
        this.m_begin_token = it.m_begin_token;
        this.m_end_token = it.m_end_token;
        this.plural = it.plural;
        this.sub_sent = it.sub_sent;
        this.quant = it.quant;
        this.attrs = it.attrs;
        this.can_be_question = it.can_be_question;
        this.result = it.result;
        this.result_list = it.result_list;
        this.result_list_or = it.result_list_or;
        this.result_verb_last = it.result_verb_last;
        this.res_graph = it.res_graph;
        this.res_frag = it.res_frag;
    }
    
    get res_graph() {
        return this.m_res_graph;
    }
    set res_graph(value) {
        if (this.m_res_graph === null) 
            this.m_res_graph = value;
        else if (value !== null && this.m_res_graph !== value) 
            this.m_res_graph = value;
        return value;
    }
    
    add_attr(adv) {
        let sa = SemAttribute._new2938(adv.spelling, adv.typ, adv.not);
        if (this.attrs === null) 
            this.attrs = new Array();
        this.attrs.push(SemAttributeEx._new2939(adv, sa));
    }
    
    get begin_token() {
        if (this.m_begin_token !== null) 
            return this.m_begin_token;
        if (this.source !== null) 
            return this.source.begin_token;
        return null;
    }
    set begin_token(value) {
        this.m_begin_token = value;
        return value;
    }
    
    get end_token() {
        if (this.m_end_token !== null) 
            return this.m_end_token;
        if (this.source !== null) {
            let ret = this.source.end_token;
            if (this.attrs !== null) {
                for (const a of this.attrs) {
                    if (a.token.end_char > ret.end_char) 
                        ret = a.token.end_token;
                }
            }
            return ret;
        }
        return null;
    }
    set end_token(value) {
        this.m_end_token = value;
        return value;
    }
    
    get can_be_noun() {
        if (((this.typ === SentItemType.NOUN || this.typ === SentItemType.DEEPART || this.typ === SentItemType.PARTAFTER) || this.typ === SentItemType.PARTBEFORE || this.typ === SentItemType.SUBSENT) || this.typ === SentItemType.FORMULA) 
            return true;
        if (this.source instanceof VerbPhraseToken) {
            if ((this.source).first_verb.verb_morph !== null && (this.source).first_verb.verb_morph.contains_attr("инф.", null)) 
                return true;
        }
        return false;
    }
    
    get can_be_comma_end() {
        let cnj = Utils.as(this.source, ConjunctionToken);
        if (cnj === null) 
            return false;
        return cnj.typ === ConjunctionType.COMMA || cnj.typ === ConjunctionType.AND || cnj.typ === ConjunctionType.OR;
    }
    
    toString() {
        let res = new StringBuilder();
        if (!Utils.isNullOrEmpty(this.prep)) 
            res.append(this.prep).append(" ");
        res.append(this.typ.toString()).append("(");
        if (this.sub_typ !== SentItemSubtype.UNDEFINED) 
            res.append(String(this.sub_typ)).append(":");
        if (this.source !== null) {
            res.append(this.source.toString());
            if (this.sub_sent !== null) 
                res.append(" <= ").append(this.sub_sent.toString());
        }
        else if (this.sub_sent !== null) 
            res.append(this.sub_sent.toString());
        res.append(')');
        return res.toString();
    }
    
    static parse_near_items(t, t1, lev, prev) {
        if (lev > 100) 
            return null;
        if (t === null || t.begin_char > t1.end_char) 
            return null;
        let res = new Array();
        if (t instanceof ReferentToken) {
            res.push(new SentItem(Utils.as(t, MetaToken)));
            return res;
        }
        let delim = DelimToken.try_parse(t);
        if (delim !== null) {
            res.push(new SentItem(delim));
            return res;
        }
        let conj = ConjunctionHelper.try_parse(t);
        if (conj !== null) {
            res.push(new SentItem(conj));
            return res;
        }
        let _prep = PrepositionHelper.try_parse(t);
        let t111 = (_prep === null ? t : _prep.end_token.next);
        if ((t111 instanceof NumberToken) && ((t111.morph.class0.is_adjective && !t111.morph.class0.is_noun))) 
            t111 = null;
        let num = (t111 === null ? null : NumbersWithUnitToken.try_parse(t111, null, false, false, false, false));
        if (num !== null) {
            if (num.units.length === 0) {
                let npt1 = NounPhraseHelper.try_parse(num.end_token.next, SentItem.m_npt_attrs, 0, null);
                if (npt1 === null && num.end_token.next !== null && num.end_token.next.is_value("РАЗ", null)) {
                    npt1 = new NounPhraseToken(num.end_token.next, num.end_token.next);
                    npt1.noun = new MetaToken(num.end_token.next, num.end_token.next);
                }
                if (npt1 !== null && _prep !== null) {
                    if (npt1.noun.end_token.is_value("РАЗ", null)) 
                        npt1.morph.remove_items(_prep.next_case, false);
                    else if ((MorphCase.ooBitand(npt1.morph._case, _prep.next_case)).is_undefined) 
                        npt1 = null;
                    else 
                        npt1.morph.remove_items(_prep.next_case, false);
                }
                if ((npt1 !== null && npt1.end_token.is_value("ОНИ", null) && npt1.preposition !== null) && npt1.preposition.normal === "ИЗ") {
                    npt1.morph = new MorphCollection(num.end_token.morph);
                    npt1.preposition = null;
                    let nn = num.toString();
                    let si1 = new SentItem(npt1);
                    if (nn === "1" && (num.end_token instanceof NumberToken) && (num.end_token).end_token.is_value("ОДИН", null)) {
                        let a = SemAttribute._new2940(SemAttributeType.ONEOF, (num.end_token).end_token.get_normal_case_text(null, true, MorphGender.UNDEFINED, false));
                        let aex = SemAttributeEx._new2939(num, a);
                        si1.attrs = new Array();
                        si1.attrs.push(aex);
                    }
                    else 
                        si1.quant = new Quantity(nn, num.begin_token, num.end_token);
                    if (_prep !== null) 
                        si1.prep = _prep.normal;
                    res.push(si1);
                    return res;
                }
                if (npt1 !== null) {
                    let si1 = SentItem._new2942(npt1, new Quantity(num.toString(), num.begin_token, num.end_token));
                    if (_prep !== null) 
                        si1.prep = _prep.normal;
                    if (npt1.end_token.is_value("РАЗ", null)) 
                        si1.typ = SentItemType.FORMULA;
                    if ((((npt1.morph.number.value()) & (MorphNumber.PLURAL.value()))) === (MorphNumber.UNDEFINED.value()) && si1.quant.spelling !== "1") {
                        let ok = false;
                        if (si1.quant.spelling.endsWith("1")) 
                            ok = true;
                        else if (si1.typ === SentItemType.FORMULA) 
                            ok = true;
                        else if (si1.quant.spelling.endsWith("2") && npt1.morph._case.is_genitive) 
                            ok = true;
                        else if (si1.quant.spelling.endsWith("3") && npt1.morph._case.is_genitive) 
                            ok = true;
                        else if (si1.quant.spelling.endsWith("4") && npt1.morph._case.is_genitive) 
                            ok = true;
                        if (ok) {
                            npt1.morph = new MorphCollection();
                            npt1.morph.number = MorphNumber.PLURAL;
                        }
                    }
                    res.push(si1);
                    return res;
                }
            }
            num.begin_token = t;
            num.morph = new MorphCollection(num.end_token.morph);
            let si = new SentItem(num);
            if (_prep !== null) 
                si.prep = _prep.normal;
            res.push(si);
            if (si.prep === "НА") {
                let aa = AdverbToken.try_parse(si.end_token.next);
                if (aa !== null && ((aa.typ === SemAttributeType.LESS || aa.typ === SemAttributeType.GREAT))) {
                    si.add_attr(aa);
                    si.end_token = aa.end_token;
                }
            }
            return res;
        }
        let mc = t.get_morph_class_in_dictionary();
        let adv = AdverbToken.try_parse(t);
        let npt = NounPhraseHelper.try_parse(t, SentItem.m_npt_attrs, 0, null);
        if (npt !== null && (npt.end_token instanceof TextToken) && (npt.end_token).term === "БЫЛИ") 
            npt = null;
        if (npt !== null && adv !== null) {
            if (adv.end_char > npt.end_char) 
                npt = null;
            else if (adv.end_char === npt.end_char) {
                res.push(new SentItem(npt));
                res.push(new SentItem(adv));
                return res;
            }
        }
        if (npt !== null && npt.adjectives.length === 0) {
            if (npt.end_token.is_value("КОТОРЫЙ", null) && t.previous !== null && t.previous.is_comma_and) {
                let res1 = SentItem.parse_subsent(npt, t1, lev + 1, prev);
                if (res1 !== null) 
                    return res1;
            }
            if (npt.end_token.is_value("СКОЛЬКО", null)) {
                let tt1 = npt.end_token.next;
                if (tt1 !== null && tt1.is_value("ВСЕГО", null)) 
                    tt1 = tt1.next;
                let npt1 = NounPhraseHelper.try_parse(tt1, NounPhraseParseAttr.NO, 0, null);
                if (npt1 !== null && !npt1.morph._case.is_undefined && _prep !== null) {
                    if ((MorphCase.ooBitand(_prep.next_case, npt1.morph._case)).is_undefined) 
                        npt1 = null;
                    else 
                        npt1.morph.remove_items(_prep.next_case, false);
                }
                if (npt1 !== null) {
                    npt1.begin_token = npt.begin_token;
                    npt1.preposition = npt.preposition;
                    npt1.adjectives.push(new MetaToken(npt.end_token, npt.end_token));
                    npt = npt1;
                }
            }
            if (npt.end_token.morph.class0.is_adjective) {
                if (VerbPhraseHelper.try_parse(t, true, false, false) !== null) 
                    npt = null;
            }
        }
        let vrb = null;
        if (npt !== null && npt.adjectives.length > 0) {
            vrb = VerbPhraseHelper.try_parse(t, true, false, false);
            if (vrb !== null && vrb.first_verb.is_participle) 
                npt = null;
        }
        else if (adv === null || npt !== null) 
            vrb = VerbPhraseHelper.try_parse(t, true, false, false);
        if (npt !== null) 
            res.push(new SentItem(npt));
        if (vrb !== null && !vrb.first_verb.is_participle && !vrb.first_verb.is_dee_participle) {
            let vars = new Array();
            for (const wf of vrb.first_verb.morph.items) {
                if (wf.class0.is_verb && (wf instanceof MorphWordForm) && (wf).is_in_dictionary) 
                    vars.push(Utils.as(wf, MorphWordForm));
            }
            if (vars.length < 2) 
                res.push(new SentItem(vrb));
            else {
                vrb.first_verb.verb_morph = vars[0];
                res.push(new SentItem(vrb));
                for (let i = 1; i < vars.length; i++) {
                    vrb = VerbPhraseHelper.try_parse(t, false, false, false);
                    if (vrb === null) 
                        break;
                    vrb.first_verb.verb_morph = vars[i];
                    res.push(new SentItem(vrb));
                }
                if (vars[0].misc.mood === MorphMood.IMPERATIVE && vars[1].misc.mood !== MorphMood.IMPERATIVE) {
                    let rr = res[0];
                    res[0] = res[1];
                    res[1] = rr;
                }
            }
            return res;
        }
        if (vrb !== null) {
            let res1 = SentItem.parse_participles(vrb, t1, lev + 1);
            if (res1 !== null) 
                res.splice(res.length, 0, ...res1);
        }
        if (res.length > 0) 
            return res;
        if (adv !== null) {
            if (adv.typ === SemAttributeType.OTHER) {
                let npt1 = NounPhraseHelper.try_parse(adv.end_token.next, SentItem.m_npt_attrs, 0, null);
                if (npt1 !== null && npt1.end_token.is_value("ОНИ", null) && npt1.preposition !== null) {
                    let si1 = new SentItem(npt1);
                    let a = SemAttribute._new2940(SemAttributeType.OTHER, adv.end_token.get_normal_case_text(null, false, MorphGender.UNDEFINED, false));
                    let aex = SemAttributeEx._new2939(num, a);
                    si1.attrs = new Array();
                    si1.attrs.push(aex);
                    if (_prep !== null) 
                        si1.prep = _prep.normal;
                    res.push(si1);
                    return res;
                }
                for (let i = prev.length - 1; i >= 0; i--) {
                    if (prev[i].attrs !== null) {
                        for (const a of prev[i].attrs) {
                            if (a.attr.typ === SemAttributeType.ONEOF) {
                                let si1 = new SentItem(prev[i].source);
                                let aa = SemAttribute._new2940(SemAttributeType.OTHER, adv.end_token.get_normal_case_text(null, false, MorphGender.UNDEFINED, false));
                                let aex = SemAttributeEx._new2939(adv, aa);
                                si1.attrs = new Array();
                                si1.attrs.push(aex);
                                if (_prep !== null) 
                                    si1.prep = _prep.normal;
                                si1.begin_token = adv.begin_token;
                                si1.end_token = adv.end_token;
                                res.push(si1);
                                return res;
                            }
                        }
                    }
                }
            }
            res.push(new SentItem(adv));
            return res;
        }
        if (mc.is_adjective) {
            npt = NounPhraseToken._new2947(t, t, new MorphCollection(t.morph));
            npt.noun = new MetaToken(t, t);
            res.push(new SentItem(npt));
            return res;
        }
        return null;
    }
    
    static parse_subsent(npt, t1, lev, prev) {
        let ok = false;
        if (prev !== null) {
            for (let i = prev.length - 1; i >= 0; i--) {
                let it = prev[i];
                if (it.typ === SentItemType.CONJ || it.typ === SentItemType.DELIM) {
                    ok = true;
                    break;
                }
                if (it.typ === SentItemType.VERB) 
                    break;
            }
        }
        if (!ok) 
            return null;
        let sents = Utils.notNull(Sentence.parse_variants(npt.end_token.next, t1, lev + 1, 20, SentItemType.SUBSENT), new Array());
        let endpos = new Array();
        let res = new Array();
        for (const s of sents) {
            s.items.splice(0, 0, new SentItem(npt));
            s.calc_coef(true);
            s.trunc_oborot(false);
            let end = s.items[s.items.length - 1].end_token.end_char;
            if (endpos.includes(end)) 
                continue;
            endpos.push(end);
            s.calc_coef(false);
            let part = new SentItem(npt);
            part.typ = SentItemType.SUBSENT;
            part.sub_typ = SentItemSubtype.WICH;
            part.sub_sent = s;
            part.result = s.items[0].result;
            part.end_token = s.items[s.items.length - 1].end_token;
            res.push(part);
        }
        return res;
    }
    
    static parse_participles(vb, t1, lev) {
        let sents = Utils.notNull(Sentence.parse_variants(vb.end_token.next, t1, lev + 1, 20, SentItemType.PARTBEFORE), new Array());
        let _typ = NGLinkType.AGENT;
        if (vb.first_verb.morph.contains_attr("страд.з.", null)) 
            _typ = NGLinkType.PACIENT;
        else if (vb.first_verb.morph.contains_attr("возвр.", null)) 
            _typ = NGLinkType.PACIENT;
        let endpos = new Array();
        let res = new Array();
        let changed = false;
        for (const s of sents) {
            if (vb.first_verb.is_dee_participle) 
                break;
            for (let i = 0; i < s.items.length; i++) {
                let it = s.items[i];
                if (!it.can_be_noun || it.typ === SentItemType.VERB) 
                    continue;
                if (!Utils.isNullOrEmpty(it.prep)) 
                    continue;
                if (it.typ === SentItemType.PARTBEFORE || it.typ === SentItemType.PARTAFTER) 
                    continue;
                let li = NGLink._new2949(_typ, NGItem._new2920(it), vb);
                li.calc_coef(true);
                if (li.coef < 0) 
                    continue;
                if (endpos.includes(it.end_token.end_char)) 
                    continue;
                let ss = Sentence._new2950(_typ);
                ss.items.push(new SentItem(vb));
                for (let j = 0; j <= i; j++) {
                    let si = new SentItem(null);
                    si.copy_from(s.items[j]);
                    ss.items.push(si);
                }
                ss.calc_coef(false);
                changed = true;
                if (ss.coef < 0) 
                    continue;
                let part = new SentItem(it.source);
                part.typ = SentItemType.PARTAFTER;
                part.sub_sent = ss;
                if (vb.preposition !== null) 
                    part.prep = vb.preposition.normal;
                part.begin_token = vb.begin_token;
                part.end_token = it.source.end_token;
                if ((i + 1) < ss.items.length) 
                    part.result = ss.items[i + 1].result;
                endpos.push(it.end_token.end_char);
                res.push(part);
            }
        }
        endpos.splice(0, endpos.length);
        if (changed) 
            sents = Utils.notNull(Sentence.parse_variants(vb.end_token.next, t1, lev + 1, 20, SentItemType.PARTBEFORE), new Array());
        for (const s of sents) {
            s.items.splice(0, 0, new SentItem(vb));
            s.calc_coef(true);
            s.trunc_oborot(true);
            let end = s.items[s.items.length - 1].end_token.end_char;
            endpos.push(end);
            s.not_last_noun_to_first_verb = _typ;
            s.calc_coef(false);
            let part = new SentItem(vb);
            part.part_verb_typ = _typ;
            part.typ = (vb.first_verb.is_dee_participle ? SentItemType.DEEPART : SentItemType.PARTBEFORE);
            part.sub_sent = s;
            part.result = s.items[0].result;
            part.result_verb_last = s.items[0].result_verb_last;
            part.end_token = s.items[s.items.length - 1].end_token;
            res.push(part);
        }
        if (res.length === 0 && sents.length === 0) {
            let part = new SentItem(vb);
            part.part_verb_typ = _typ;
            part.typ = (vb.first_verb.is_dee_participle ? SentItemType.DEEPART : SentItemType.PARTBEFORE);
            res.push(part);
        }
        return res;
    }
    
    static _new2942(_arg1, _arg2) {
        let res = new SentItem(_arg1);
        res.quant = _arg2;
        return res;
    }
    
    static static_constructor() {
        SentItem.m_npt_attrs = NounPhraseParseAttr.of(((((NounPhraseParseAttr.ADJECTIVECANBELAST.value()) | (NounPhraseParseAttr.IGNOREBRACKETS.value()) | (NounPhraseParseAttr.PARSEADVERBS.value())) | (NounPhraseParseAttr.PARSENUMERICASADJECTIVE.value()) | (NounPhraseParseAttr.PARSEPREPOSITION.value())) | (NounPhraseParseAttr.PARSEPRONOUNS.value()) | (NounPhraseParseAttr.PARSEVERBS.value())) | (NounPhraseParseAttr.REFERENTCANBENOUN.value()) | (NounPhraseParseAttr.MULTINOUNS.value()));
    }
}


SentItem.static_constructor();

module.exports = SentItem
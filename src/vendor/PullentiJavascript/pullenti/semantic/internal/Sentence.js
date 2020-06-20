/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../unisharp/StringBuilder");

const NGItem = require("./NGItem");
const BracketParseAttr = require("./../../ner/core/BracketParseAttr");
const SemAttributeType = require("./../SemAttributeType");
const VerbPhraseToken = require("./../../ner/core/VerbPhraseToken");
const AdverbToken = require("./AdverbToken");
const BracketHelper = require("./../../ner/core/BracketHelper");
const SemFraglinkType = require("./../SemFraglinkType");
const SemFragment = require("./../SemFragment");
const SemBlock = require("./../SemBlock");
const SentenceVariant = require("./SentenceVariant");
const Subsent = require("./Subsent");
const SemLinkType = require("./../SemLinkType");
const SentItemType = require("./SentItemType");
const SemObjectType = require("./../SemObjectType");
const SentItemSubtype = require("./SentItemSubtype");
const MorphNumber = require("./../../morph/MorphNumber");
const MorphWordForm = require("./../../morph/MorphWordForm");
const NGLinkType = require("./NGLinkType");
const NumbersWithUnitToken = require("./../../ner/measure/internal/NumbersWithUnitToken");
const CreateHelper = require("./CreateHelper");
const NounPhraseToken = require("./../../ner/core/NounPhraseToken");
const NGLink = require("./NGLink");
const SemObject = require("./../SemObject");

class Sentence {
    
    constructor() {
        this.items = new Array();
        this.coef = 0;
        this.best_var = null;
        this.subs = new Array();
        this.res_block = null;
        this.last_noun_to_first_verb = NGLinkType.UNDEFINED;
        this.not_last_noun_to_first_verb = NGLinkType.UNDEFINED;
        this.last_char = null;
    }
    
    _create_lists(s) {
        for (let i = 0; i < s.links.length; i++) {
            let list = s.get_list(i);
            if (list === null) 
                continue;
            if (list[0].source.result === null) 
                continue;
            let root = list[0].source;
            root.result_list = new Array();
            for (const li of list) {
                if (li.source.result !== null) 
                    root.result_list.push(li.source.result);
                if (li !== list[0] && li.or_before) 
                    root.result_list_or = true;
            }
        }
    }
    
    _set_last_alt_links(fr) {
        if (fr.links.length > 1) {
            let li0 = fr.links[fr.links.length - 2];
            let li1 = fr.links[fr.links.length - 1];
            li0.alt_link = li1;
            li1.alt_link = li0;
        }
    }
    
    _create_links(s) {
        for (let i = 0; i < s.links.length; i++) {
            let link0 = s.links[i];
            if (link0 === null) 
                continue;
            if (link0.typ === NGLinkType.LIST) 
                continue;
            for (let k = 0; k < 2; k++) {
                let li = link0;
                if (k === 1) 
                    li = li.alt_link;
                if (li === null) 
                    break;
                if (li.from.res_object === null) 
                    continue;
                if (k === 1) {
                }
                let gr = li.from.res_object.graph;
                if (li.to !== null && li.to.res_object !== null) {
                    let link = null;
                    if (li.typ === NGLinkType.PARTICIPLE && li.from.source.sub_typ === SentItemSubtype.WICH) {
                        link = gr.add_link(SemLinkType.ANAFOR, li.from.res_object, li.to.res_object, null, false, null);
                        if (k > 0) 
                            this._set_last_alt_links(gr);
                        continue;
                    }
                    if (li.typ === NGLinkType.PARTICIPLE && li.from.source.typ === SentItemType.PARTBEFORE) {
                        link = gr.add_link(SemLinkType.PARTICIPLE, li.to.res_object, li.from.res_object, "какой", false, null);
                        if (k > 0) 
                            this._set_last_alt_links(gr);
                        if (li.from.source.result_list !== null && li.typ === NGLinkType.PARTICIPLE) {
                            link.is_or = li.from.source.result_list_or;
                            for (let ii = 1; ii < li.from.source.result_list.length; ii++) {
                                gr.add_link(link.typ, link.source, li.from.source.result_list[ii], link.question, link.is_or, null);
                            }
                        }
                        continue;
                    }
                    if (li.typ === NGLinkType.BE) {
                        if ((li.from.source.source instanceof NumbersWithUnitToken) && li.to !== null) {
                            gr.add_link(SemLinkType.DETAIL, li.to.res_object, li.from.res_object, "какой", false, li.from_prep);
                            continue;
                        }
                        let be = SemObject._new2927(gr, SemObjectType.VERB);
                        be.tokens.push(li.from.source.source);
                        be.morph.normal_case = (be.morph.normal_full = "БЫТЬ");
                        gr.objects.push(be);
                        gr.add_link(SemLinkType.AGENT, be, li.to.res_object, null, false, null);
                        gr.add_link(SemLinkType.PACIENT, be, li.from.res_object, null, false, null);
                        continue;
                    }
                    let ty = SemLinkType.UNDEFINED;
                    let ques = null;
                    if (li.typ === NGLinkType.GENETIVE) {
                        if (li.can_be_pacient) 
                            ty = SemLinkType.PACIENT;
                        else {
                            ty = SemLinkType.DETAIL;
                            ques = "чего";
                        }
                        if (!Utils.isNullOrEmpty(li.from_prep)) 
                            ques = CreateHelper.create_question(li.from);
                    }
                    else if (li.typ === NGLinkType.NAME) 
                        ty = SemLinkType.NAMING;
                    link = gr.add_link(ty, li.to.res_object, li.from.res_object, ques, false, li.from_prep);
                    if (li.from.source.result_list !== null) {
                        link.is_or = li.from.source.result_list_or;
                        for (let ii = 1; ii < li.from.source.result_list.length; ii++) {
                            let link1 = gr.add_link(ty, link.source, li.from.source.result_list[ii], ques, link.is_or, null);
                            link1.preposition = link.preposition;
                        }
                    }
                    let list = null;
                    if (li.to_all_list_items) {
                        list = s.get_list_by_last_item(li.to);
                        if (list !== null) {
                            let ok = true;
                            for (let j = 0; j < (list.length - 1); j++) {
                                if (list[j].res_object !== null && list[j].res_object.links_from.length > 0) {
                                    ok = false;
                                    break;
                                }
                            }
                            if (ok) {
                                for (let j = 0; j < (list.length - 1); j++) {
                                    gr.add_link(link.typ, list[j].res_object, link.target, link.question, false, link.preposition);
                                }
                            }
                        }
                    }
                    if (k > 0) 
                        this._set_last_alt_links(gr);
                }
                if (li.to_verb !== null && li.from.res_object !== null) {
                    let link = null;
                    let vitem = null;
                    for (const iii of this.items) {
                        if (iii.source === li.to_verb) {
                            vitem = iii;
                            break;
                        }
                    }
                    if (li.typ === NGLinkType.AGENT && vitem !== null && vitem.result !== null) {
                        let verb = vitem.result;
                        if (verb.typ === SemObjectType.PARTICIPLE && li.can_be_participle) 
                            link = gr.add_link(SemLinkType.PARTICIPLE, li.from.res_object, verb, "какой", false, null);
                        else 
                            link = gr.add_link(SemLinkType.AGENT, verb, li.from.res_object, null, false, null);
                        if (k > 0) 
                            this._set_last_alt_links(gr);
                    }
                    else if (((li.typ === NGLinkType.PACIENT || li.typ === NGLinkType.ACTANT)) && vitem !== null && vitem.result_verb_last !== null) {
                        let verb = vitem.result_verb_last;
                        let ques = null;
                        if (li.typ === NGLinkType.ACTANT) 
                            ques = CreateHelper.create_question(li.from);
                        if (verb.typ === SemObjectType.PARTICIPLE && li.typ === NGLinkType.PACIENT && li.can_be_participle) 
                            link = gr.add_link(SemLinkType.PARTICIPLE, li.from.res_object, verb, "какой", false, null);
                        else 
                            link = gr.add_link((li.typ === NGLinkType.PACIENT ? SemLinkType.PACIENT : SemLinkType.DETAIL), verb, li.from.res_object, ques, false, li.from_prep);
                        if (k > 0) 
                            this._set_last_alt_links(gr);
                    }
                    if (link === null) 
                        continue;
                    if (li.from.source.result_list !== null) {
                        link.is_or = li.from.source.result_list_or;
                        for (let jj = 1; jj < li.from.source.result_list.length; jj++) {
                            if (link.typ === SemLinkType.PARTICIPLE) 
                                gr.add_link(link.typ, li.from.source.result_list[jj], link.target, link.question, link.is_or, null);
                            else 
                                gr.add_link(link.typ, link.source, li.from.source.result_list[jj], link.question, link.is_or, null);
                        }
                    }
                }
            }
        }
    }
    
    create_result(blk) {
        if (this.best_var !== null) {
            for (const s of this.best_var.segs) {
                if (s !== null) 
                    s.correct_morph();
            }
            this.best_var.create_alt_links();
        }
        let all_items = new Array();
        for (const it of this.items) {
            if (it.res_graph === null) 
                continue;
            if (it.result === null) {
                if (it.source instanceof NounPhraseToken) {
                    let npt = Utils.as(it.source, NounPhraseToken);
                    if (it.plural === 1 && (((it.source.morph.number.value()) & (MorphNumber.PLURAL.value()))) !== (MorphNumber.UNDEFINED.value())) 
                        it.source.morph.remove_items(MorphNumber.PLURAL, false);
                    it.result = CreateHelper.create_noun_group(it.res_graph, npt);
                    if (npt.multi_nouns && it.result.quantity === null) {
                        it.result_list = new Array();
                        it.result_list.push(it.result);
                        if (npt.adjectives.length > 0 && (((npt.adjectives[0].begin_token.morph.number.value()) & (MorphNumber.SINGULAR.value()))) === (MorphNumber.SINGULAR.value())) {
                            it.result.morph.number = MorphNumber.SINGULAR;
                            if (it.result.morph.normal_full !== null) 
                                it.result.morph.normal_case = it.result.morph.normal_full;
                        }
                        for (let i = 1; i < npt.adjectives.length; i++) {
                            let so = SemObject._new2927(it.res_graph, it.result.typ);
                            so.tokens.push(npt.noun);
                            so.morph = Utils.as(it.result.morph.clone(), MorphWordForm);
                            for (const a of it.result.attrs) {
                                so.attrs.push(a);
                            }
                            so.concept = it.result.concept;
                            so.not = it.result.not;
                            let asem = CreateHelper.create_npt_adj(it.res_graph, npt, npt.adjectives[i]);
                            if (asem !== null) 
                                it.res_graph.add_link(SemLinkType.DETAIL, so, asem, "какой", false, null);
                            it.result_list.push(so);
                            it.res_graph.objects.push(so);
                        }
                    }
                }
                else if (it.source instanceof VerbPhraseToken) {
                    it.result = CreateHelper.create_verb_group(it.res_graph, Utils.as(it.source, VerbPhraseToken));
                    it.result_verb_last = Utils.as((it.source).last_verb.tag, SemObject);
                }
                else if (it.source instanceof NumbersWithUnitToken) 
                    it.result = CreateHelper.create_number(it.res_graph, Utils.as(it.source, NumbersWithUnitToken));
                if (it.result !== null && it.quant !== null) 
                    it.result.quantity = it.quant;
                if (it.result !== null && it.attrs !== null) {
                    for (const a of it.attrs) {
                        it.result.attrs.push(a.attr);
                        it.result.tokens.push(a.token);
                    }
                }
            }
            if (it.result !== null) {
                if (it.result.graph !== it.res_graph) {
                }
                all_items.push(it);
            }
        }
        if (this.best_var !== null) {
            for (const s of this.best_var.segs) {
                if (s !== null) 
                    this._create_lists(s);
            }
        }
        if (this.best_var !== null) {
            for (const s of this.best_var.segs) {
                if (s !== null) 
                    this._create_links(s);
            }
        }
        for (let i = 0; i < this.items.length; i++) {
            let it = this.items[i];
            if (it.typ !== SentItemType.ADVERB || it.res_graph === null) 
                continue;
            let adv = Utils.as(it.source, AdverbToken);
            if (adv.typ !== SemAttributeType.UNDEFINED) 
                continue;
            let before = null;
            let after = null;
            for (let ii = i - 1; ii >= 0; ii--) {
                let it0 = this.items[ii];
                if (it0.typ === SentItemType.VERB) {
                    before = it0;
                    break;
                }
                else if (it0.typ === SentItemType.ADVERB || it0.typ === SentItemType.NOUN) {
                }
                else 
                    break;
            }
            if (before === null) {
                for (let ii = i - 1; ii >= 0; ii--) {
                    let it0 = this.items[ii];
                    if (it0.typ === SentItemType.VERB || it0.typ === SentItemType.NOUN) {
                        before = it0;
                        break;
                    }
                    else if (it0.typ === SentItemType.ADVERB) {
                    }
                    else 
                        break;
                }
            }
            let comma_after = false;
            for (let ii = i + 1; ii < this.items.length; ii++) {
                let it0 = this.items[ii];
                if (it0.typ === SentItemType.VERB || it0.typ === SentItemType.NOUN) {
                    after = it0;
                    break;
                }
                else if (it0.typ === SentItemType.ADVERB) {
                }
                else if (it0.can_be_comma_end) {
                    if (before !== null && before.typ === SentItemType.VERB) 
                        break;
                    if (((ii + 1) < this.items.length) && ((this.items[ii + 1].typ === SentItemType.ADVERB || this.items[ii + 1].typ === SentItemType.VERB))) {
                    }
                    else 
                        comma_after = true;
                }
                else 
                    break;
            }
            if (before !== null && after !== null) {
                if (comma_after) 
                    after = null;
                else if (before.typ === SentItemType.NOUN && after.typ === SentItemType.VERB) 
                    before = null;
                else if (before.typ === SentItemType.VERB && after.typ === SentItemType.NOUN) 
                    after = null;
            }
            it.result = CreateHelper.create_adverb(it.res_graph, adv);
            if (it.attrs !== null) {
                for (const a of it.attrs) {
                    it.result.attrs.push(a.attr);
                    it.result.tokens.push(a.token);
                }
            }
            if (after !== null || before !== null) 
                it.res_graph.add_link(SemLinkType.DETAIL, (after === null ? before.result : after.result), it.result, "как", false, null);
        }
        let preds = new Array();
        let agent = null;
        for (const it of this.items) {
            if (it.result !== null && it.typ === SentItemType.VERB && (it.source instanceof VerbPhraseToken)) {
                if (agent !== null) {
                    let has_pac = false;
                    for (const li of it.res_graph.links) {
                        if (li.typ === SemLinkType.PACIENT && li.source === it.result) {
                            has_pac = true;
                            break;
                        }
                    }
                    if (!has_pac) {
                        let ni0 = NGItem._new2920(agent);
                        let gli0 = NGLink._new2933(ni0, Utils.as(it.source, VerbPhraseToken), NGLinkType.PACIENT);
                        if (agent.result_list !== null) {
                            gli0.from_is_plural = true;
                            gli0.calc_coef(false);
                            if (gli0.coef > 0 && gli0.plural === 1) {
                                for (const ii of agent.result_list) {
                                    it.res_graph.add_link(SemLinkType.PACIENT, it.result, ii, null, false, null);
                                }
                                this.coef += (1);
                            }
                        }
                        else {
                            gli0.calc_coef(true);
                            if (gli0.coef > 0) {
                                it.res_graph.add_link(SemLinkType.PACIENT, it.result, agent.result, null, false, null);
                                this.coef += (1);
                            }
                        }
                    }
                }
                let ali = null;
                for (const li of it.res_graph.links) {
                    if (li.typ === SemLinkType.AGENT && li.source === it.result) {
                        ali = li;
                        break;
                    }
                }
                if (ali !== null) {
                    agent = this._find_item_by_res(ali.target);
                    continue;
                }
                if (agent === null) 
                    continue;
                let ni = NGItem._new2920(agent);
                let gli = NGLink._new2933(ni, Utils.as(it.source, VerbPhraseToken), NGLinkType.AGENT);
                if (agent.result_list !== null) {
                    gli.from_is_plural = true;
                    gli.calc_coef(false);
                    if (gli.coef > 0 && gli.plural === 1) {
                        for (const ii of agent.result_list) {
                            it.res_graph.add_link(SemLinkType.AGENT, it.result, ii, null, false, null);
                        }
                        this.coef += (1);
                    }
                }
                else {
                    gli.calc_coef(true);
                    if (gli.coef > 0) {
                        it.res_graph.add_link(SemLinkType.AGENT, it.result, agent.result, null, false, null);
                        this.coef += (1);
                    }
                }
            }
        }
        agent = null;
        for (let i = 0; i < this.items.length; i++) {
            let it = this.items[i];
            if (it.result !== null && it.typ === SentItemType.DEEPART) {
            }
            else 
                continue;
            let link = null;
            for (let j = i - 1; j >= 0; j--) {
                let itt = this.items[j];
                if (itt.typ !== SentItemType.NOUN) 
                    continue;
                if (!((itt.source.morph._case.is_nominative))) 
                    continue;
                let ispacad = false;
                for (const li of itt.res_graph.links) {
                    if (((li.typ === SemLinkType.AGENT || li.typ === SemLinkType.PACIENT)) && li.target === itt.result) 
                        ispacad = true;
                }
                if (!ispacad) 
                    continue;
                if (link === null) 
                    link = itt.res_graph.add_link(SemLinkType.AGENT, it.result, itt.result, null, false, null);
                else if (link.alt_link === null) {
                    link.alt_link = itt.res_graph.add_link(SemLinkType.AGENT, it.result, itt.result, null, false, null);
                    link.alt_link.alt_link = link;
                    break;
                }
            }
            if (link === null) {
                for (let j = i + 1; j < this.items.length; j++) {
                    let itt = this.items[j];
                    if (itt.typ !== SentItemType.NOUN) 
                        continue;
                    if (!((itt.source.morph._case.is_nominative))) 
                        continue;
                    let ispacad = false;
                    for (const li of itt.res_graph.links) {
                        if (((li.typ === SemLinkType.AGENT || li.typ === SemLinkType.PACIENT)) && li.target === itt.result) 
                            ispacad = true;
                    }
                    if (!ispacad) 
                        continue;
                    if (link === null) 
                        link = itt.res_graph.add_link(SemLinkType.AGENT, it.result, itt.result, null, false, null);
                    else if (link.alt_link === null) {
                        link.alt_link = itt.res_graph.add_link(SemLinkType.AGENT, it.result, itt.result, null, false, null);
                        link.alt_link.alt_link = link;
                        break;
                    }
                }
            }
            if (link !== null) 
                this.coef++;
        }
        for (const fr of this.res_block.fragments) {
            if (fr.can_be_error_structure) 
                this.coef /= (2);
        }
        if (this.res_block.fragments.length > 0 && this.res_block.fragments[0].graph.objects.length > 0) {
            let it = this.res_block.fragments[0].graph.objects[0];
            if (this.last_char !== null && this.last_char.is_char('?')) {
                if (it.morph.normal_full === "КАКОЙ" || it.morph.normal_full === "СКОЛЬКО") 
                    it.typ = SemObjectType.QUESTION;
            }
        }
    }
    
    _find_item_by_res(s) {
        for (const it of this.items) {
            if (it.result === s) 
                return it;
        }
        return null;
    }
    
    toString() {
        let res = new StringBuilder();
        if (this.coef > 0) 
            res.append(this.coef).append(": ");
        for (const it of this.items) {
            if (it !== this.items[0]) 
                res.append("; \r\n");
            res.append(it.toString());
        }
        return res.toString();
    }
    
    add_to_block(blk, gr = null) {
        if (this.res_block !== null) {
            if (gr === null) 
                blk.add_fragments(this.res_block);
            else 
                for (const fr of this.res_block.fragments) {
                    gr.objects.splice(gr.objects.length, 0, ...fr.graph.objects);
                    gr.links.splice(gr.links.length, 0, ...fr.graph.links);
                }
        }
        for (const it of this.items) {
            if (it.sub_sent !== null) 
                it.sub_sent.add_to_block(blk, (gr != null ? gr : it.res_frag.graph));
        }
    }
    
    static parse_variants(t0, t1, lev, max_count = 0, regime = SentItemType.UNDEFINED) {
        const SentItem = require("./SentItem");
        if ((t0 === null || t1 === null || t0.end_char > t1.end_char) || lev > 100) 
            return null;
        let res = new Array();
        let sent = new Sentence();
        for (let t = t0; t !== null && t.end_char <= t1.end_char; t = t.next) {
            if (t.is_char('(')) {
                let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (br !== null) {
                    t = br.end_token;
                    continue;
                }
            }
            let _items = SentItem.parse_near_items(t, t1, lev + 1, sent.items);
            if (_items === null || _items.length === 0) 
                continue;
            if (_items.length === 1 || ((max_count > 0 && res.length > max_count))) {
                sent.items.push(_items[0]);
                t = _items[0].end_token;
                if (regime !== SentItemType.UNDEFINED) {
                    let it = _items[0];
                    if (it.can_be_noun) {
                    }
                    else if (it.typ === SentItemType.DELIM) 
                        break;
                    else if (it.typ === SentItemType.VERB) {
                        if (regime === SentItemType.PARTBEFORE) 
                            break;
                    }
                }
                continue;
            }
            let m_nexts = new Hashtable();
            for (const it of _items) {
                let nexts = null;
                let wrapnexts2936 = new RefOutArgWrapper();
                let inoutres2937 = m_nexts.tryGetValue(it.end_token.end_char, wrapnexts2936);
                nexts = wrapnexts2936.value;
                if (!inoutres2937) {
                    nexts = Sentence.parse_variants(it.end_token.next, t1, lev + 1, max_count, SentItemType.UNDEFINED);
                    m_nexts.put(it.end_token.end_char, nexts);
                }
                if (nexts === null || nexts.length === 0) {
                    let se = new Sentence();
                    for (const itt of sent.items) {
                        let itt1 = new SentItem(null);
                        itt1.copy_from(itt);
                        se.items.push(itt1);
                    }
                    let itt0 = new SentItem(null);
                    itt0.copy_from(it);
                    se.items.push(itt0);
                    res.push(se);
                }
                else 
                    for (const sn of nexts) {
                        let se = new Sentence();
                        for (const itt of sent.items) {
                            let itt1 = new SentItem(null);
                            itt1.copy_from(itt);
                            se.items.push(itt1);
                        }
                        let itt0 = new SentItem(null);
                        itt0.copy_from(it);
                        se.items.push(itt0);
                        for (const itt of sn.items) {
                            let itt1 = new SentItem(null);
                            itt1.copy_from(itt);
                            se.items.push(itt1);
                        }
                        res.push(se);
                    }
            }
            return res;
        }
        if (sent.items.length === 0) 
            return null;
        res.push(sent);
        return res;
    }
    
    compareTo(other) {
        if (this.coef > other.coef) 
            return -1;
        if (this.coef < other.coef) 
            return 1;
        return 0;
    }
    
    calc_coef(no_result) {
        const NGSegment = require("./NGSegment");
        this.coef = 0;
        for (let i = 0; i < this.items.length; i++) {
            let it = this.items[i];
            if (it.typ !== SentItemType.ADVERB) 
                continue;
            let adv = Utils.as(it.source, AdverbToken);
            if (adv.typ === SemAttributeType.UNDEFINED) 
                continue;
            let before = null;
            let after = null;
            for (let ii = i - 1; ii >= 0; ii--) {
                let it0 = this.items[ii];
                if (it0.typ === SentItemType.VERB) {
                    before = it0;
                    break;
                }
                else if (it0.typ === SentItemType.ADVERB) {
                    if ((it0.source).typ === SemAttributeType.UNDEFINED) {
                        before = it0;
                        break;
                    }
                }
                else if (it0.can_be_comma_end) 
                    break;
                else if (it0.typ === SentItemType.FORMULA && ((adv.typ === SemAttributeType.GREAT || adv.typ === SemAttributeType.LESS))) {
                    before = it0;
                    break;
                }
            }
            let comma_after = false;
            for (let ii = i + 1; ii < this.items.length; ii++) {
                let it0 = this.items[ii];
                if (it0.typ === SentItemType.VERB) {
                    after = it0;
                    break;
                }
                else if (it0.typ === SentItemType.ADVERB) {
                    if ((it0.source).typ === SemAttributeType.UNDEFINED) {
                        after = it0;
                        break;
                    }
                }
                else if (it0.can_be_comma_end) 
                    comma_after = true;
                else if (it0.typ === SentItemType.FORMULA && ((adv.typ === SemAttributeType.GREAT || adv.typ === SemAttributeType.LESS))) {
                    before = it0;
                    break;
                }
                else if (it0.typ === SentItemType.NOUN) 
                    comma_after = true;
                else 
                    break;
            }
            if (before !== null && after !== null) {
                if (before.typ === SentItemType.FORMULA) 
                    after = null;
                else if (after.typ === SentItemType.FORMULA) 
                    before = null;
                else if (comma_after) 
                    after = null;
            }
            if (after !== null) {
                after.add_attr(adv);
                this.items.splice(i, 1);
                i--;
                continue;
            }
            if (before !== null) {
                before.add_attr(adv);
                this.items.splice(i, 1);
                i--;
                continue;
            }
        }
        let segs = NGSegment.create_segments(this);
        if (this.last_noun_to_first_verb !== NGLinkType.UNDEFINED || this.not_last_noun_to_first_verb !== NGLinkType.UNDEFINED) {
            if (segs.length !== 1 || segs[0].items.length === 0) {
                if (this.last_noun_to_first_verb !== NGLinkType.UNDEFINED) {
                    this.coef = -1;
                    return;
                }
            }
            else {
                let last = segs[0].items[segs[0].items.length - 1];
                for (let i = last.links.length - 1; i >= 0; i--) {
                    let li = last.links[i];
                    if (this.last_noun_to_first_verb !== NGLinkType.UNDEFINED) {
                        if (li.typ === this.last_noun_to_first_verb && li.to_verb === segs[0].before_verb) 
                            li.can_be_participle = true;
                        else 
                            last.links.splice(i, 1);
                    }
                    else if (this.not_last_noun_to_first_verb !== NGLinkType.UNDEFINED) {
                        if (li.typ === this.not_last_noun_to_first_verb && li.to_verb === segs[0].before_verb) {
                            last.links.splice(i, 1);
                            break;
                        }
                    }
                }
                if (last.links.length === 0) {
                    this.coef = -1;
                    return;
                }
            }
        }
        for (const seg of segs) {
            seg.ind = 0;
            seg.create_variants(100);
        }
        let svars = new Array();
        let svar = null;
        for (let kkk = 0; kkk < 1000; kkk++) {
            if (svar === null) 
                svar = new SentenceVariant();
            else 
                svar.segs.splice(0, svar.segs.length);
            for (let i = 0; i < segs.length; i++) {
                let it = segs[i];
                if (it.ind < it.variants.length) 
                    svar.segs.push(it.variants[it.ind]);
                else 
                    svar.segs.push(null);
            }
            svar.calc_coef();
            if (svar.coef >= 0) {
                svars.push(svar);
                svar = null;
                if (svars.length > 100) {
                    this._sort_vars(svars);
                    svars.splice(10, svars.length - 10);
                }
            }
            let j = 0;
            for (j = segs.length - 1; j >= 0; j--) {
                let it = segs[j];
                if ((++it.ind) >= it.variants.length) 
                    it.ind = 0;
                else 
                    break;
            }
            if (j < 0) 
                break;
        }
        this._sort_vars(svars);
        if (svars.length > 0) {
            this.best_var = svars[0];
            this.coef = this.best_var.coef;
        }
        else {
        }
        for (const it of this.items) {
            if (it.sub_sent !== null) 
                this.coef += it.sub_sent.coef;
        }
        for (const it of this.items) {
            if (it.participle_coef > 0) 
                this.coef *= it.participle_coef;
        }
        this.subs = Subsent.create_subsents(this);
        if (this.items.length === 0) 
            return;
        if (no_result) 
            return;
        this.res_block = new SemBlock(null);
        for (const sub of this.subs) {
            sub.res_frag = new SemFragment(this.res_block);
            this.res_block.fragments.push(sub.res_frag);
            sub.res_frag.is_or = sub.is_or;
            for (const it of sub.items) {
                if (sub.res_frag.begin_token === null) 
                    sub.res_frag.begin_token = it.begin_token;
                sub.res_frag.end_token = it.end_token;
                if (it.res_graph !== null) {
                }
                it.res_graph = sub.res_frag.graph;
                it.res_frag = sub.res_frag;
            }
        }
        for (const sub of this.subs) {
            if (sub.res_frag === null || sub.owner === null || sub.owner.res_frag === null) 
                continue;
            if (sub.typ === SemFraglinkType.UNDEFINED) 
                continue;
            this.res_block.add_link(sub.typ, sub.res_frag, sub.owner.res_frag, sub.question);
        }
        this.create_result(this.res_block);
    }
    
    _sort_vars(vars) {
        vars.sort((a, b) => a.compareTo(b));
    }
    
    trunc_oborot(is_participle) {
        if (this.best_var === null || this.best_var.segs.length === 0) {
            if (this.items.length > 1) {
                this.items.splice(1, this.items.length - 1);
                return true;
            }
            return false;
        }
        let ret = false;
        let ind = 0;
        if (this.best_var.segs[0] === null && !is_participle) {
            for (ind = 1; ind < this.items.length; ind++) {
                if (this.items[ind].can_be_comma_end) 
                    break;
            }
        }
        else 
            for (const seg of this.best_var.segs) {
                if (seg === null) 
                    break;
                for (const li of seg.links) {
                    if (li === null) 
                        continue;
                    ret = true;
                    let ii = this.items.indexOf(li.from.source);
                    if (ii < 0) 
                        continue;
                    if (li.to_verb !== null) {
                        if (li.to_verb === seg.source.before_verb) 
                            ind = ii + 1;
                        else if (!is_participle && seg === this.best_var.segs[0] && li.to_verb === seg.source.after_verb) {
                            for (ii = ind; ii < this.items.length; ii++) {
                                if (this.items[ii].source === li.to_verb) {
                                    ind = ii + 1;
                                    break;
                                }
                            }
                        }
                        else 
                            break;
                    }
                    else {
                        let jj = this.items.indexOf(li.to.source);
                        if (jj < 0) 
                            continue;
                        if (jj < ii) 
                            ind = ii + 1;
                        else 
                            break;
                    }
                }
                if (!is_participle && seg === this.best_var.segs[0]) {
                }
                else 
                    break;
            }
        if (!ret && ind === 0) {
            for (ind = 1; ind < this.items.length; ind++) {
                if (this.items[ind].can_be_comma_end) 
                    break;
            }
        }
        if (ind > 0 && (ind < (this.items.length - 1))) 
            this.items.splice(ind, this.items.length - ind);
        return ret;
    }
    
    static _new2950(_arg1) {
        let res = new Sentence();
        res.last_noun_to_first_verb = _arg1;
        return res;
    }
}


module.exports = Sentence
/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const ConjunctionType = require("./../../ner/core/ConjunctionType");
const NGLinkType = require("./NGLinkType");
const NGLink = require("./NGLink");
const ConjunctionToken = require("./../../ner/core/ConjunctionToken");
const SentItemType = require("./SentItemType");
const NGItem = require("./NGItem");
const VerbPhraseToken = require("./../../ner/core/VerbPhraseToken");
const NGSegmentVariant = require("./NGSegmentVariant");

class NGSegment {
    
    constructor() {
        this.before_verb = null;
        this.items = new Array();
        this.after_verb = null;
        this.variants = new Array();
        this.ind = 0;
    }
    
    toString() {
        let tmp = new StringBuilder();
        if (this.before_verb !== null) 
            tmp.append("<").append(this.before_verb.toString()).append(">: ");
        for (const it of this.items) {
            if (it !== this.items[0]) 
                tmp.append("; \r\n");
            tmp.append(it.toString());
        }
        if (this.after_verb !== null) 
            tmp.append(" :<").append(this.after_verb.toString()).append(">");
        return tmp.toString();
    }
    
    static create_segments(s) {
        let res = new Array();
        for (let i = 0; i < s.items.length; i++) {
            let it = s.items[i];
            if (it.typ === SentItemType.VERB || it.typ === SentItemType.DELIM) 
                continue;
            let seg = new NGSegment();
            let nit = NGItem._new2920(it);
            for (let j = i - 1; j >= 0; j--) {
                it = s.items[j];
                if (it.typ === SentItemType.VERB) {
                    seg.before_verb = Utils.as(it.source, VerbPhraseToken);
                    break;
                }
                if (it.typ === SentItemType.DELIM) 
                    break;
                if (it.can_be_comma_end) {
                    if ((it.source).typ === ConjunctionType.COMMA) 
                        nit.comma_before = true;
                    else {
                        nit.and_before = true;
                        if ((it.source).typ === ConjunctionType.OR) 
                            nit.or_before = true;
                    }
                }
                if (it.typ === SentItemType.CONJ || it.can_be_noun) 
                    break;
            }
            let comma = false;
            let and = false;
            let or = false;
            for (; i < s.items.length; i++) {
                it = s.items[i];
                if (it.can_be_comma_end) {
                    comma = false;
                    and = false;
                    or = false;
                    if ((it.source).typ === ConjunctionType.COMMA) 
                        comma = true;
                    else {
                        and = true;
                        if ((it.source).typ === ConjunctionType.OR) 
                            or = true;
                    }
                    if (seg.items.length > 0) {
                        if (comma) 
                            seg.items[seg.items.length - 1].comma_after = true;
                        else {
                            seg.items[seg.items.length - 1].and_after = true;
                            if (or) 
                                seg.items[seg.items.length - 1].or_after = true;
                        }
                    }
                    continue;
                }
                if (it.can_be_noun || it.typ === SentItemType.ADVERB) {
                    nit = NGItem._new2921(it, comma, and, or);
                    seg.items.push(nit);
                    comma = false;
                    and = false;
                    or = false;
                }
                else if (it.typ === SentItemType.VERB || it.typ === SentItemType.CONJ || it.typ === SentItemType.DELIM) 
                    break;
            }
            for (let j = i; j < s.items.length; j++) {
                it = s.items[j];
                if (it.typ === SentItemType.VERB) {
                    seg.after_verb = Utils.as(it.source, VerbPhraseToken);
                    break;
                }
                if ((it.typ === SentItemType.CONJ || it.can_be_noun || it.typ === SentItemType.DELIM) || it.typ === SentItemType.ADVERB) 
                    break;
            }
            res.push(seg);
        }
        for (const ss of res) {
            ss.create_links(false);
        }
        return res;
    }
    
    /**
     * А это создание вариантов связей между элементами
     */
    create_links(after_part = false) {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].order = i;
            this.items[i].prepare();
        }
        let li = null;
        for (let i = 0; i < this.items.length; i++) {
            let it = this.items[i];
            if (it.source.typ === SentItemType.ADVERB) 
                continue;
            let ignore_before = false;
            let mult = 1;
            if (it.comma_before || it.and_before) {
                for (let j = i - 1; j >= 0; j--) {
                    if (li === null) 
                        li = new NGLink();
                    li.typ = NGLinkType.LIST;
                    li.from = it;
                    li.to = this.items[j];
                    li.to_verb = null;
                    li.calc_coef(false);
                    if (li.coef >= 0) {
                        it.links.push(li);
                        li = null;
                    }
                    if (it.source.typ === SentItemType.PARTBEFORE || it.source.typ === SentItemType.SUBSENT || it.source.typ === SentItemType.DEEPART) {
                        if (it.comma_before) {
                            if (li === null) 
                                li = new NGLink();
                            li.typ = NGLinkType.PARTICIPLE;
                            li.from = it;
                            li.to = this.items[j];
                            li.to_verb = null;
                            li.calc_coef(false);
                            if (li.coef >= 0) {
                                it.links.push(li);
                                li = null;
                            }
                        }
                    }
                    if ((!it.and_before && it.source.typ === SentItemType.NOUN && this.items[j].source.typ === SentItemType.NOUN) && this.items[i - 1].source.typ === SentItemType.PARTBEFORE) {
                        let ok = true;
                        for (let jj = j + 1; jj < i; jj++) {
                            if ((this.items[jj].source.typ === SentItemType.DELIM || this.items[jj].source.typ === SentItemType.NOUN || this.items[jj].source.typ === SentItemType.SUBSENT) || this.items[jj].source.typ === SentItemType.PARTBEFORE) {
                            }
                            else {
                                ok = false;
                                break;
                            }
                        }
                        if (ok) {
                            if (li === null) 
                                li = new NGLink();
                            li.typ = NGLinkType.GENETIVE;
                            li.from = it;
                            li.to = this.items[j];
                            li.to_verb = null;
                            li.calc_coef(false);
                            if (li.coef >= 0) {
                                it.links.push(li);
                                li = null;
                            }
                        }
                    }
                }
                ignore_before = true;
            }
            else {
                for (let j = i - 1; j >= 0; j--) {
                    if (this.items[j].source.typ === SentItemType.SUBSENT) 
                        continue;
                    if (li === null) 
                        li = new NGLink();
                    li.typ = NGLinkType.GENETIVE;
                    li.from = it;
                    li.to = this.items[j];
                    li.to_verb = null;
                    li.calc_coef(false);
                    if (li.coef >= 0) {
                        it.links.push(li);
                        li = null;
                    }
                    if (li === null) 
                        li = new NGLink();
                    li.typ = NGLinkType.NAME;
                    li.from = it;
                    li.to = this.items[j];
                    li.to_verb = null;
                    li.calc_coef(false);
                    if (li.coef >= 0) {
                        it.links.push(li);
                        li = null;
                    }
                    let nodelim = true;
                    for (let jj = j + 1; jj <= i; jj++) {
                        if (this.items[jj].comma_before || this.items[jj].and_before) {
                            nodelim = false;
                            break;
                        }
                    }
                    if (nodelim) {
                        if (li === null) 
                            li = new NGLink();
                        li.typ = NGLinkType.BE;
                        li.from = it;
                        li.to = this.items[j];
                        li.to_verb = null;
                        li.calc_coef(false);
                        if (li.coef >= 0) {
                            it.links.push(li);
                            li = null;
                        }
                    }
                    if (it.source.typ === SentItemType.PARTBEFORE || it.source.typ === SentItemType.SUBSENT || it.source.typ === SentItemType.DEEPART) {
                        let has_delim = false;
                        for (let jj = i - 1; jj > j; jj--) {
                            if (this.items[jj].source.can_be_comma_end) {
                                has_delim = true;
                                break;
                            }
                        }
                        if (has_delim) {
                            if (li === null) 
                                li = new NGLink();
                            li.typ = NGLinkType.PARTICIPLE;
                            li.from = it;
                            li.to = this.items[j];
                            li.to_verb = null;
                            li.calc_coef(false);
                            if (li.coef >= 0) {
                                it.links.push(li);
                                li = null;
                            }
                        }
                    }
                    if (this.items[j].source.typ === SentItemType.PARTBEFORE) 
                        mult *= 0.5;
                    if (this.items[j].source.typ === SentItemType.VERB) {
                        ignore_before = true;
                        break;
                    }
                }
                if (this.before_verb !== null && !ignore_before && it.source.typ !== SentItemType.DEEPART) {
                    let ok = false;
                    if (li === null) 
                        li = new NGLink();
                    li.typ = NGLinkType.AGENT;
                    li.from = it;
                    li.to = null;
                    li.to_verb = this.before_verb;
                    li.calc_coef(false);
                    li.coef *= mult;
                    if (li.coef >= 0) {
                        it.links.push(li);
                        ok = true;
                        li = null;
                    }
                    if (li === null) 
                        li = new NGLink();
                    li.typ = NGLinkType.PACIENT;
                    li.from = it;
                    li.to = null;
                    li.to_verb = this.before_verb;
                    li.calc_coef(false);
                    li.coef *= mult;
                    if (li.coef >= 0) {
                        it.links.push(li);
                        ok = true;
                        li = null;
                    }{
                            if (li === null) 
                                li = new NGLink();
                            li.typ = NGLinkType.ACTANT;
                            li.from = it;
                            li.to = null;
                            li.to_verb = this.before_verb;
                            li.calc_coef(false);
                            li.coef *= mult;
                            if (ok) 
                                li.coef /= (2);
                            if (li.coef >= 0) {
                                it.links.push(li);
                                ok = true;
                                li = null;
                            }
                        }
                }
            }
            if (this.after_verb !== null && it.source.typ !== SentItemType.DEEPART) {
                let ok = false;
                if (after_part && this.before_verb !== null) {
                    for (const l_ of it.links) {
                        if (l_.to_verb === this.before_verb && ((l_.typ === NGLinkType.AGENT || l_.typ === NGLinkType.PACIENT))) 
                            ok = true;
                    }
                    if (ok) 
                        continue;
                }
                if (li === null) 
                    li = new NGLink();
                li.typ = NGLinkType.AGENT;
                li.from = it;
                li.to = null;
                li.to_verb = this.after_verb;
                li.calc_coef(false);
                if (li.coef >= 0) {
                    it.links.push(li);
                    ok = true;
                    li = null;
                }
                if (li === null) 
                    li = new NGLink();
                li.typ = NGLinkType.PACIENT;
                li.from = it;
                li.to = null;
                li.to_verb = this.after_verb;
                li.calc_coef(false);
                if (li.coef >= 0) {
                    it.links.push(li);
                    ok = true;
                    li = null;
                }
                if (li === null) 
                    li = new NGLink();
                li.typ = NGLinkType.ACTANT;
                li.from = it;
                li.to = null;
                li.to_verb = this.after_verb;
                li.calc_coef(false);
                if (li.coef >= 0) {
                    it.links.push(li);
                    ok = true;
                    li = null;
                }
            }
        }
        for (let i = 1; i < this.items.length; i++) {
            let it = this.items[i];
            if (it.source.typ !== SentItemType.NOUN) 
                continue;
            let it0 = this.items[i - 1];
            if (it0.source.typ !== SentItemType.NOUN) 
                continue;
            if (it0.links.length > 0) 
                continue;
            li = NGLink._new2922(NGLinkType.GENETIVE, it0, it, true);
            li.calc_coef(true);
            if (li.coef > 0) 
                it0.links.push(li);
        }
    }
    
    create_variants(max_count = 5) {
        this.variants.splice(0, this.variants.length);
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].ind = 0;
        }
        let var0 = null;
        for (let kkk = 0; kkk < 1000; kkk++) {
            if (var0 === null) 
                var0 = NGSegmentVariant._new2923(this);
            else 
                var0.links.splice(0, var0.links.length);
            for (let i = 0; i < this.items.length; i++) {
                let it = this.items[i];
                if (it.ind < it.links.length) 
                    var0.links.push(it.links[it.ind]);
                else 
                    var0.links.push(null);
            }
            var0.calc_coef();
            if (var0.coef >= 0) {
                this.variants.push(var0);
                var0 = null;
                if (this.variants.length > (max_count * 5)) {
                    NGSegment._sort_vars(this.variants);
                    this.variants.splice(max_count, this.variants.length - max_count);
                }
            }
            let j = 0;
            for (j = this.items.length - 1; j >= 0; j--) {
                let it = this.items[j];
                if ((++it.ind) >= it.links.length) 
                    it.ind = 0;
                else 
                    break;
            }
            if (j < 0) 
                break;
        }
        NGSegment._sort_vars(this.variants);
        if (this.variants.length > max_count) 
            this.variants.splice(max_count, this.variants.length - max_count);
    }
    
    static _sort_vars(vars) {
        vars.sort((a, b) => a.compareTo(b));
    }
}


module.exports = NGSegment
/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const SentItemType = require("./SentItemType");
const MetaToken = require("./../../ner/MetaToken");
const TextToken = require("./../../ner/TextToken");
const NGItem = require("./NGItem");
const SentItem = require("./SentItem");
const SemanticService = require("./../SemanticService");
const MorphGender = require("./../../morph/MorphGender");
const MorphNumber = require("./../../morph/MorphNumber");
const MorphCase = require("./../../morph/MorphCase");
const NGLinkType = require("./NGLinkType");
const NGLink = require("./NGLink");

class NGSegmentVariant {
    
    constructor() {
        this.coef = 0;
        this.source = null;
        this.links = new Array();
    }
    
    toString() {
        let res = new StringBuilder();
        res.append(this.coef).append(" = ");
        for (const it of this.links) {
            if (it !== this.links[0]) 
                res.append("; \r\n");
            if (it === null) 
                res.append("<null>");
            else 
                res.append(it.toString());
        }
        return res.toString();
    }
    
    static _compare_list_item_tails(mt1, mt2) {
        let t1 = Utils.as(mt1.end_token, TextToken);
        let t2 = Utils.as(mt2.end_token, TextToken);
        if (t1 === null || t2 === null) 
            return true;
        let k = 0;
        let i1 = t1.term.length - 1;
        let i2 = t2.term.length - 1;
        for (; i1 > 0 && i2 > 0; i1--,i2--,k++) {
            if (t1.term[i1] !== t2.term[i2]) 
                break;
        }
        if (k >= 2) 
            return true;
        let nn = t2.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
        if (t1.is_value(nn, null)) 
            return true;
        if ((((t1.morph.number.value()) & (t2.morph.number.value()))) === (MorphNumber.UNDEFINED.value())) 
            return false;
        if ((MorphCase.ooBitand(t1.morph._case, t2.morph._case)).is_undefined) 
            return false;
        if (t1.morph.class0.is_verb !== t2.morph.class0.is_verb && t1.morph.class0.is_adjective !== t2.morph.class0.is_adjective) 
            return false;
        return true;
    }
    
    calc_coef() {
        this.coef = 0;
        for (const it of this.links) {
            if (it !== null) 
                this.coef += it.coef;
        }
        for (let i = 0; i < this.links.length; i++) {
            let li1 = this.links[i];
            if (li1 === null || li1.to === null) 
                continue;
            if (li1.reverce) 
                continue;
            let i0 = li1.to.order;
            if (i0 >= li1.from.order) 
                return this.coef = -1;
            for (let k = i0 + 1; k < i; k++) {
                let li = this.links[k];
                if (li === null) 
                    continue;
                if (li.to_verb !== null) 
                    return this.coef = -1;
                let i1 = li.to.order;
                if ((i1 < i0) || i1 > i) 
                    return this.coef = -1;
                if (li.typ === NGLinkType.LIST && li1.typ === NGLinkType.LIST && i0 === i1) 
                    return this.coef = -1;
            }
        }
        for (let i = 0; i < this.links.length; i++) {
            let list = this.get_list(i);
            if (list === null) 
                continue;
            let k = 0;
            for (k = 1; k < (list.length - 1); k++) {
                if (list[k].and_before) 
                    break;
            }
            if (k >= (list.length - 1) && list[k].and_before) 
                this.coef += SemanticService.PARAMS.list;
            else {
                let ors = 0;
                let ands = 0;
                for (k = 1; k < list.length; k++) {
                    if (list[k].or_before) 
                        ors++;
                    else if (list[k].and_before) 
                        ands++;
                }
                if (ands > 0 && ors > 0) 
                    return this.coef = -1;
                for (k = 1; k < list.length; k++) {
                    if (!list[k].and_before) 
                        break;
                }
                if (k >= list.length) {
                }
                else 
                    return this.coef = -1;
            }
            let ngli = NGLink._new2924(NGLinkType.LIST);
            for (k = 0; k < (list.length - 2); k++) {
                for (let kk = k + 2; kk < list.length; kk++) {
                    ngli.from = list[kk];
                    ngli.to = list[k];
                    ngli.calc_coef(false);
                    if (ngli.coef < 0) 
                        return this.coef = -1;
                }
            }
            let prep_is_not_exi_all = false;
            for (k = 0; k < (list.length - 1); k++) {
                for (let kk = k + 1; kk < list.length; kk++) {
                    if (!NGSegmentVariant._compare_list_item_tails(list[k].source.source, list[kk].source.source)) 
                        this.coef /= (2);
                    if (Utils.isNullOrEmpty(list[k].source.prep) !== Utils.isNullOrEmpty(list[kk].source.prep)) {
                        let str1 = list[k].source.end_token.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
                        let str2 = list[kk].source.end_token.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
                        if (str1 !== str2) 
                            prep_is_not_exi_all = true;
                    }
                }
            }
            if (prep_is_not_exi_all) 
                this.coef /= (2);
            let last = list[list.length - 1];
            let ok = true;
            let lalink = null;
            for (const ll of this.links) {
                if (ll !== null && ll.typ === NGLinkType.GENETIVE) {
                    if (ll.to === last) 
                        lalink = ll;
                    else if (list.includes(ll.to)) {
                        ok = false;
                        break;
                    }
                }
            }
            if (!ok || lalink === null) 
                continue;
            let test = NGLink._new2925(lalink.from, lalink.typ);
            let j = 0;
            for (j = 0; j < (list.length - 1); j++) {
                test.to = list[j];
                let ord = test.to.order;
                test.to.order = last.order;
                test.calc_coef(false);
                test.to.order = ord;
                if (test.coef < 0) 
                    break;
            }
            if (j >= (list.length - 1)) 
                lalink.to_all_list_items = true;
        }
        let bef_ag = 0;
        let bef_pac = 0;
        let aft_ag = 0;
        let aft_pac = 0;
        for (let i = 0; i < this.links.length; i++) {
            let li = this.links[i];
            if (li === null) 
                continue;
            if (li.typ === NGLinkType.LIST) 
                continue;
            if (li.typ === NGLinkType.PARTICIPLE) {
                if (li.from.source.part_verb_typ !== NGLinkType.UNDEFINED) {
                }
            }
            if ((li.typ === NGLinkType.AGENT || li.typ === NGLinkType.PACIENT || li.typ === NGLinkType.GENETIVE) || li.typ === NGLinkType.PARTICIPLE) {
                if (li.plural === 1) {
                    let ok = false;
                    if (li.typ === NGLinkType.PARTICIPLE && li.to !== null && this.get_list(li.to.order) !== null) 
                        ok = true;
                    else if (li.typ !== NGLinkType.PARTICIPLE && this.get_list(i) !== null) 
                        ok = true;
                    else {
                        let co = li.coef;
                        li.calc_coef(true);
                        if (li.coef > 0) 
                            ok = true;
                        li.coef = co;
                        li.plural = 1;
                    }
                    if (!ok) 
                        return this.coef = -1;
                }
                else if (li.plural === 0) {
                    if (li.typ !== NGLinkType.PARTICIPLE && this.get_list(i) !== null) 
                        return this.coef = -1;
                    if (li.typ === NGLinkType.PARTICIPLE && li.to !== null && this.get_list(li.to.order) !== null) 
                        return this.coef = -1;
                }
            }
            if (li.typ === NGLinkType.AGENT || li.typ === NGLinkType.PACIENT || li.typ === NGLinkType.ACTANT) {
            }
            else 
                continue;
            if (li.to_verb !== null && li.to_verb === this.source.before_verb) {
                if (this.source.after_verb !== null && !this.source.before_verb.first_verb.is_participle) {
                    let has_delim = false;
                    let ind = li.from.order;
                    let list = this.get_list(ind);
                    if (list !== null) 
                        ind = list[list.length - 1].order;
                    for (let ii = ind; ii < this.source.items.length; ii++) {
                        if (this.source.items[ii].and_after || this.source.items[ii].comma_after) 
                            has_delim = true;
                    }
                    if (!has_delim) 
                        return this.coef = -1;
                }
                if (li.typ === NGLinkType.AGENT && li.to_verb.first_verb.is_dee_participle) {
                    let has_delim = false;
                    for (let ii = 0; ii <= li.from.order; ii++) {
                        if (this.source.items[ii].and_before || this.source.items[ii].comma_before) 
                            has_delim = true;
                    }
                    if (!has_delim) 
                        return this.coef = -1;
                }
                if (li.typ === NGLinkType.AGENT) 
                    bef_ag++;
                else if (li.typ === NGLinkType.PACIENT) 
                    bef_pac++;
                if (li.from.source.sub_sent !== null) 
                    continue;
            }
            else if (li.to_verb !== null && li.to_verb === this.source.after_verb) {
                if (this.source.before_verb !== null && !this.source.before_verb.first_verb.is_participle) {
                    let has_delim = false;
                    for (let ii = 0; ii <= li.from.order; ii++) {
                        if (this.source.items[ii].and_before || this.source.items[ii].comma_before) 
                            has_delim = true;
                    }
                    if (!has_delim) 
                        return this.coef = -1;
                }
                if (li.from.source.sub_sent !== null) 
                    continue;
                if (li.typ === NGLinkType.AGENT) 
                    aft_ag++;
                else if (li.typ === NGLinkType.PACIENT) 
                    aft_pac++;
            }
            if (li.typ === NGLinkType.ACTANT) 
                continue;
        }
        if ((bef_ag > 1 || bef_pac > 1 || aft_ag > 1) || aft_pac > 1) 
            return this.coef = -1;
        for (let i = 0; i < this.links.length; i++) {
            let li = this.links[i];
            if (li === null) 
                continue;
            if (li.typ !== NGLinkType.ACTANT || li.to_verb === null) 
                continue;
        }
        for (let i = 0; i < this.links.length; i++) {
            let li = this.links[i];
            if (li === null) 
                continue;
            if (li.typ !== NGLinkType.GENETIVE || li.to === null) 
                continue;
            if (li.from.source.typ === SentItemType.FORMULA) {
                for (const li0 of this.links) {
                    if ((li0 !== null && li0 !== li && li0.typ === NGLinkType.GENETIVE) && li0.from === li.to) 
                        this.coef /= (2);
                }
            }
            if (li.to.source.typ === SentItemType.FORMULA) {
                for (const li0 of this.links) {
                    if ((li0 !== null && li0 !== li && li0.typ === NGLinkType.GENETIVE) && li0.to === li.to) {
                        if (li0.from.order < li.from.order) 
                            this.coef /= (2);
                    }
                }
            }
        }
        return this.coef;
    }
    
    compareTo(other) {
        if (this.coef > other.coef) 
            return -1;
        if (this.coef < other.coef) 
            return 1;
        return 0;
    }
    
    get_list_by_last_item(it) {
        let res = new Array();
        res.push(it);
        for (let i = this.links.length - 1; i >= 0; i--) {
            if ((this.links[i] !== null && this.links[i].from === it && this.links[i].typ === NGLinkType.LIST) && this.links[i].to !== null) {
                it = this.links[i].to;
                res.splice(0, 0, it);
            }
        }
        if (res.length > 1) 
            return res;
        return null;
    }
    
    get_list(ord) {
        if (ord >= this.source.items.length) 
            return null;
        let li = this.links[ord];
        if (li === null) 
            return null;
        let res = null;
        let ngit = this.source.items[ord];
        if (li.typ === NGLinkType.LIST) {
            if (li.to_verb === null) 
                return null;
            res = new Array();
            res.push(NGItem._new2926(new SentItem(li.to_verb), ord - 1));
            res.push(ngit);
        }
        for (let i = ord + 1; i < this.links.length; i++) {
            li = this.links[i];
            if (li === null || li.typ !== NGLinkType.LIST || li.to === null) 
                continue;
            if (li.to === ngit) {
                if (res === null) {
                    res = new Array();
                    res.push(ngit);
                }
                ngit = this.source.items[i];
                res.push(ngit);
            }
        }
        return res;
    }
    
    correct_morph() {
        for (let i = 0; i < this.links.length; i++) {
            let li = this.links[i];
            if (li === null) 
                continue;
            if (li.typ === NGLinkType.AGENT || li.typ === NGLinkType.PACIENT) {
                if (li.plural === 1) {
                    let list = this.get_list(i);
                    if (list !== null) 
                        continue;
                    li.from.source.plural = 1;
                }
            }
        }
    }
    
    static _new2923(_arg1) {
        let res = new NGSegmentVariant();
        res.source = _arg1;
        return res;
    }
}


module.exports = NGSegmentVariant
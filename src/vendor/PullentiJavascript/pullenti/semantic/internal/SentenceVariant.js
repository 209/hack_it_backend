/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../../unisharp/StringBuilder");

const SentItemType = require("./SentItemType");
const NGLinkType = require("./NGLinkType");

class SentenceVariant {
    
    constructor() {
        this.coef = 0;
        this.segs = new Array();
    }
    
    toString() {
        let tmp = new StringBuilder();
        tmp.append(this.coef).append(": ");
        for (const s of this.segs) {
            if (s !== this.segs[0]) 
                tmp.append("; \r\n");
            if (s !== null) 
                tmp.append(s.toString());
            else 
                tmp.append("null");
        }
        return tmp.toString();
    }
    
    calc_coef() {
        this.coef = 0;
        for (let i = 0; i < this.segs.length; i++) {
            if (this.segs[i] !== null) 
                this.coef += this.segs[i].coef;
        }
        for (let i = 0; i < (this.segs.length - 1); i++) {
            let seg0 = this.segs[i];
            if (seg0 === null) 
                continue;
            let seg1 = this.segs[i + 1];
            if (seg1 === null) 
                continue;
            let has_agent = false;
            let has_pacient = false;
            for (const li of seg0.links) {
                if (li !== null && li.to_verb === seg1.source.before_verb) {
                    if (li.typ === NGLinkType.AGENT) 
                        has_agent = true;
                    else if (li.typ === NGLinkType.PACIENT) {
                        has_pacient = true;
                        for (const lii of li.from.links) {
                            if ((lii !== null && lii.typ === NGLinkType.AGENT && lii.coef >= li.coef) && lii.to_verb === li.to_verb) {
                                for (const liii of seg1.links) {
                                    if (liii !== null && liii.to_verb === li.to_verb && liii.typ === NGLinkType.AGENT) {
                                        if (liii.coef < ((lii.coef / (3)))) 
                                            return this.coef = -1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (const li of seg1.links) {
                if (li !== null && li.to_verb === seg1.source.before_verb) {
                    if (li.typ === NGLinkType.AGENT && has_agent) 
                        return this.coef = -1;
                    else if (li.typ === NGLinkType.PACIENT && has_pacient) 
                        return this.coef = -1;
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
    
    create_alt_links() {
        let coef0 = this.coef;
        for (let i = 0; i < this.segs.length; i++) {
            let seg = this.segs[i];
            if (seg === null) 
                continue;
            for (let j = 0; j < seg.links.length; j++) {
                let li = seg.links[j];
                if (li === null || li.typ === NGLinkType.LIST) 
                    continue;
                if (li.from.links.length < 2) 
                    continue;
                if (li.from.source.typ === SentItemType.FORMULA) 
                    continue;
                if (li.to !== null && li.to.source.typ === SentItemType.FORMULA) 
                    continue;
                for (const l_ of li.from.links) {
                    if (l_ !== li && l_.typ !== NGLinkType.LIST) {
                        if (l_.to !== null && l_.to.source.typ === SentItemType.FORMULA) 
                            continue;
                        if (l_.typ === NGLinkType.ACTANT) {
                            if (li.typ === NGLinkType.AGENT || li.typ === NGLinkType.PACIENT) 
                                continue;
                        }
                        seg.links[j] = l_;
                        seg.calc_coef();
                        let _coef = coef0 - (100);
                        if (seg.coef > 0) {
                            this.calc_coef();
                            _coef = this.coef;
                        }
                        this.coef = coef0;
                        seg.links[j] = li;
                        seg.calc_coef();
                        if (_coef >= this.coef) {
                            li.alt_link = l_;
                            break;
                        }
                    }
                }
            }
        }
    }
}


module.exports = SentenceVariant
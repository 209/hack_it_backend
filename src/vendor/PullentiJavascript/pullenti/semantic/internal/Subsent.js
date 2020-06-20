/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../../unisharp/StringBuilder");

const ConjunctionType = require("./../../ner/core/ConjunctionType");
const SentItemType = require("./SentItemType");
const NGLinkType = require("./NGLinkType");
const ConjunctionToken = require("./../../ner/core/ConjunctionToken");
const SemFraglinkType = require("./../SemFraglinkType");
const DelimType = require("./DelimType");
const DelimToken = require("./DelimToken");

class Subsent {
    
    constructor() {
        this.owner = null;
        this.items = new Array();
        this.delims = new Array();
        this.res_frag = null;
        this.is_or = false;
        this.question = null;
        this.is_then_else_root = false;
        this.typ = SemFraglinkType.UNDEFINED;
    }
    
    get owner_root() {
        let k = 0;
        for (let s = this.owner; s !== null && (k < 100); s = this.owner,k++) {
            if (s.owner === null) 
                return s;
        }
        return null;
    }
    
    check(_typ) {
        for (const d of this.delims) {
            if ((d instanceof DelimToken) && ((((d).typ.value()) & (_typ.value()))) !== (DelimType.UNDEFINED.value())) 
                return true;
            else if ((d instanceof ConjunctionToken) && _typ === DelimType.AND) 
                return true;
        }
        return false;
    }
    
    check_or() {
        for (const d of this.delims) {
            if ((d instanceof ConjunctionToken) && (d).typ === ConjunctionType.OR) 
                return true;
        }
        return false;
    }
    
    only_conj() {
        for (const d of this.delims) {
            if (d instanceof DelimToken) 
                return false;
        }
        return true;
    }
    
    can_be_next_in_list(next) {
        if (next.delims.length === 0) 
            return true;
        for (const d of next.delims) {
            if (d instanceof DelimToken) {
                if (!this.check((d).typ)) 
                    return false;
            }
        }
        return true;
    }
    
    toString() {
        let tmp = new StringBuilder();
        if (this.is_or) 
            tmp.append("OR ");
        if (this.question !== null) 
            tmp.append("(").append(this.question).append("?) ");
        for (const it of this.delims) {
            tmp.append("<").append(it).append("> ");
        }
        tmp.append('[');
        for (const it of this.items) {
            if (it !== this.items[0]) 
                tmp.append(", ");
            tmp.append(it);
        }
        tmp.append("]");
        if (this.owner !== null) 
            tmp.append(" -> ").append(this.owner);
        return tmp.toString();
    }
    
    has_comma_and(b, e) {
        for (const it of this.items) {
            if (it.typ === SentItemType.CONJ) {
                if (it.source.begin_token.begin_char >= b && it.source.end_token.end_char <= e) 
                    return true;
            }
        }
        return false;
    }
    
    static create_subsents(sent) {
        if (sent.items.length === 0) 
            return null;
        let res = new Array();
        let begin = sent.items[0].begin_token.begin_char;
        let end = sent.items[sent.items.length - 1].end_token.end_char;
        let map = new Uint8Array((end + 1) - begin);
        if (sent.best_var !== null) {
            for (const seg of sent.best_var.segs) {
                if (seg !== null) {
                    for (const li of seg.links) {
                        if (li !== null && li.typ === NGLinkType.LIST) {
                            for (let i = (li.to === null ? li.to_verb.begin_char : li.to.source.begin_token.begin_char); i <= li.from.source.end_token.end_char; i++) {
                                let po = i - begin;
                                if (po >= 0 && (po < map.length)) 
                                    map[po] = 1;
                            }
                        }
                    }
                }
            }
        }
        let ss = new Subsent();
        let has_verb = false;
        for (let i = 0; i < sent.items.length; i++) {
            let it = sent.items[i];
            let delim = false;
            if (it.typ === SentItemType.DELIM) 
                delim = true;
            else if (it.typ === SentItemType.CONJ && map[it.begin_token.begin_char - begin] === (0)) {
                delim = true;
                if ((it.source).typ === ConjunctionType.COMMA) {
                    if (!has_verb) 
                        delim = false;
                }
            }
            if (!delim) {
                if (it.typ === SentItemType.VERB) 
                    has_verb = true;
                ss.items.push(it);
                continue;
            }
            if (ss.items.length === 0) {
                ss.delims.push(it.source);
                continue;
            }
            if (ss.items.length > 0) 
                res.push(ss);
            ss = new Subsent();
            has_verb = false;
            ss.delims.push(it.source);
        }
        if (ss.items.length > 0) 
            res.push(ss);
        for (let i = 0; i < res.length; i++) {
            let r = res[i];
            let j = 0;
            if (r.check(DelimType.IF)) {
                let has_then = false;
                let has_else = false;
                for (j = i + 1; j < res.length; j++) {
                    if (res[j].check(DelimType.THEN)) {
                        if (has_then) 
                            break;
                        res[j].owner = r;
                        res[j].question = "если";
                        res[j].typ = SemFraglinkType.IFTHEN;
                        has_then = true;
                        r.is_then_else_root = true;
                    }
                    else if (res[j].check(DelimType.ELSE)) {
                        if (has_else) 
                            break;
                        res[j].owner = r;
                        res[j].question = "иначе";
                        res[j].typ = SemFraglinkType.IFELSE;
                        has_else = true;
                        r.is_then_else_root = true;
                    }
                    else if (res[j].check(DelimType.IF)) {
                        if (res[j].check(DelimType.AND)) 
                            res[j].owner = r;
                        else 
                            break;
                    }
                }
                if (!has_then && i > 0) {
                    if (res[0].owner === null && res[0].only_conj()) {
                        res[0].owner = r;
                        res[0].question = "если";
                        r.is_then_else_root = true;
                        res[0].typ = SemFraglinkType.IFTHEN;
                    }
                    else if (res[0].owner !== null) {
                        r.owner = res[0];
                        r.question = "если";
                        r.typ = SemFraglinkType.IFTHEN;
                    }
                }
                continue;
            }
            if (r.check(DelimType.BECAUSE)) {
                let has_then = false;
                for (j = i + 1; j < res.length; j++) {
                    if (res[j].check(DelimType.THEN)) {
                        if (has_then) 
                            break;
                        res[j].owner = r;
                        res[j].question = "по причине";
                        res[j].typ = SemFraglinkType.BECAUSE;
                        has_then = true;
                        r.is_then_else_root = true;
                    }
                }
                if (!has_then && i > 0) {
                    if (res[0].owner === null && res[0].only_conj()) {
                        res[0].owner = r;
                        res[0].question = "по причине";
                        r.is_then_else_root = true;
                        res[0].typ = SemFraglinkType.BECAUSE;
                        continue;
                    }
                }
                if (!has_then && ((i + 1) < res.length)) {
                    if (res[i + 1].owner === null && res[i + 1].only_conj()) {
                        res[i + 1].owner = r;
                        res[i + 1].question = "по причине";
                        r.is_then_else_root = true;
                        res[i + 1].typ = SemFraglinkType.BECAUSE;
                        continue;
                    }
                }
                continue;
            }
            if (r.check(DelimType.BUT)) {
                if (i > 0) {
                    if (res[i - 1].owner === null && res[i - 1].only_conj()) {
                        res[i - 1].owner = r;
                        res[i - 1].question = "но";
                        r.is_then_else_root = true;
                        res[i - 1].typ = SemFraglinkType.BUT;
                        continue;
                    }
                }
            }
            if (r.check(DelimType.WHAT)) {
                if (i > 0) {
                    if (res[i - 1].owner === null && res[i - 1].only_conj()) {
                        res[i - 1].owner = r;
                        res[i - 1].question = "что";
                        r.is_then_else_root = true;
                        res[i - 1].typ = SemFraglinkType.WHAT;
                        continue;
                    }
                }
            }
            if (r.check(DelimType.FOR)) {
                if ((i + 1) < res.length) {
                    if (res[i + 1].owner === null && res[i + 1].only_conj()) {
                        res[i + 1].owner = r;
                        res[i + 1].question = "чтобы";
                        r.is_then_else_root = true;
                        res[i + 1].typ = SemFraglinkType.FOR;
                        continue;
                    }
                }
                if (i > 0) {
                    if (res[i - 1].owner === null && res[i - 1].only_conj()) {
                        res[i - 1].owner = r;
                        res[i - 1].question = "чтобы";
                        r.is_then_else_root = true;
                        res[i - 1].typ = SemFraglinkType.FOR;
                        continue;
                    }
                }
            }
        }
        for (let i = 1; i < res.length; i++) {
            let r = res[i];
            if (!r.check(DelimType.AND) || r.owner !== null) 
                continue;
            for (let j = i - 1; j >= 0; j--) {
                let rr = res[j];
                if (rr.can_be_next_in_list(r) && ((rr.owner === null || ((rr.owner_root !== null && rr.owner_root.can_be_next_in_list(r)))))) {
                    if (r.check_or()) 
                        rr.is_or = true;
                    rr.items.splice(rr.items.length, 0, ...r.items);
                    res.splice(i, 1);
                    i--;
                    break;
                }
            }
        }
        return res;
    }
}


module.exports = Subsent
/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const TextToken = require("./../../TextToken");
const GetTextAttr = require("./../GetTextAttr");
const MetaToken = require("./../../MetaToken");
const MiscHelper = require("./../MiscHelper");
const BlkTyps = require("./BlkTyps");
const TerminCollection = require("./../TerminCollection");
const BlockLine = require("./BlockLine");

class BlockTitleToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.typ = BlkTyps.UNDEFINED;
        this.value = null;
    }
    
    toString() {
        return (String(this.typ) + " " + ((this.value != null ? this.value : "")) + " " + this.get_source_text());
    }
    
    static try_attach_list(t) {
        let content = null;
        let intro = null;
        let lits = null;
        for (let tt = t; tt !== null; tt = tt.next) {
            if (tt.is_newline_before) {
                let btt = BlockTitleToken.try_attach(tt, false, null);
                if (btt === null) 
                    continue;
                if (btt.typ === BlkTyps.INDEX) {
                    content = btt;
                    break;
                }
                if (btt.typ === BlkTyps.INTRO) {
                    let tt2 = btt.end_token.next;
                    for (let k = 0; k < 5; k++) {
                        let li = BlockLine.create(tt2, null);
                        if (li === null) 
                            break;
                        if (li.has_content_item_tail || li.typ === BlkTyps.INDEXITEM) {
                            content = btt;
                            break;
                        }
                        if (li.has_verb) 
                            break;
                        if (li.typ !== BlkTyps.UNDEFINED) {
                            if ((li.begin_char - btt.end_char) < 400) {
                                content = btt;
                                break;
                            }
                        }
                        tt2 = li.end_token.next;
                    }
                    if (content === null) 
                        intro = btt;
                    break;
                }
                if (btt.typ === BlkTyps.LITERATURE) {
                    if (lits === null) 
                        lits = new Array();
                    lits.push(btt);
                }
            }
        }
        if (content === null && intro === null && ((lits === null || lits.length !== 1))) 
            return null;
        let res = new Array();
        let chapter_names = new TerminCollection();
        let t0 = null;
        if (content !== null) {
            res.push(content);
            let cou = 0;
            let err = 0;
            for (let tt = content.end_token.next; tt !== null; tt = tt.next) {
                if (!tt.is_newline_before) 
                    continue;
                let li = BlockLine.create(tt, null);
                if (li === null) 
                    break;
                if (li.has_verb) {
                    if (li.end_token.is_char('.')) 
                        break;
                    if (li.length_char > 100) 
                        break;
                }
                let btt = BlockTitleToken.try_attach(tt, true, null);
                if (btt === null) 
                    continue;
                err = 0;
                if (btt.typ === BlkTyps.INTRO) {
                    if (content.typ === BlkTyps.INTRO || cou > 2) 
                        break;
                }
                cou++;
                tt = content.end_token = btt.end_token;
                if (btt.value !== null) 
                    chapter_names.add_str(btt.value, null, null, false);
            }
            content.typ = BlkTyps.INDEX;
            t0 = content.end_token.next;
        }
        else if (intro !== null) 
            t0 = intro.begin_token;
        else if (lits !== null) 
            t0 = t;
        else 
            return null;
        let first = true;
        for (let tt = t0; tt !== null; tt = tt.next) {
            if (!tt.is_newline_before) 
                continue;
            if (tt.is_value("СЛАБОЕ", null)) {
            }
            let btt = BlockTitleToken.try_attach(tt, false, chapter_names);
            if (btt === null) 
                continue;
            if (res.length === 104) {
            }
            tt = btt.end_token;
            if (content !== null && btt.typ === BlkTyps.INDEX) 
                continue;
            if (res.length > 0 && res[res.length - 1].typ === BlkTyps.LITERATURE) {
                if (btt.typ !== BlkTyps.APPENDIX && btt.typ !== BlkTyps.MISC && btt.typ !== BlkTyps.LITERATURE) {
                    if (btt.typ === BlkTyps.CHAPTER && (res[res.length - 1].end_char < (Utils.intDiv(tt.kit.sofa.text.length * 3, 4)))) {
                    }
                    else 
                        continue;
                }
            }
            if (first) {
                if ((tt.begin_char - t0.begin_char) > 300) {
                    let btt0 = new BlockTitleToken(t0, (t0.previous === null ? t0 : t0.previous));
                    btt0.typ = BlkTyps.CHAPTER;
                    btt0.value = "Похоже на начало";
                    res.push(btt0);
                }
            }
            res.push(btt);
            tt = btt.end_token;
            first = false;
        }
        for (let i = 0; i < (res.length - 1); i++) {
            if (res[i].typ === BlkTyps.LITERATURE && res[i + 1].typ === res[i].typ) {
                res.splice(i + 1, 1);
                i--;
            }
        }
        return res;
    }
    
    static try_attach(t, is_content_item = false, names = null) {
        if (t === null) 
            return null;
        if (!t.is_newline_before) 
            return null;
        if (t.chars.is_all_lower) 
            return null;
        let li = BlockLine.create(t, names);
        if (li === null) 
            return null;
        if (li.words === 0 && li.typ === BlkTyps.UNDEFINED) 
            return null;
        if (li.typ === BlkTyps.INDEX) {
        }
        if (li.is_exist_name) 
            return BlockTitleToken._new460(t, li.end_token, li.typ);
        if (li.end_token === li.number_end || ((li.end_token.is_char_of(".:") && li.end_token.previous === li.number_end))) {
            let res2 = BlockTitleToken._new460(t, li.end_token, li.typ);
            if (li.typ === BlkTyps.CHAPTER || li.typ === BlkTyps.APPENDIX) {
                let li2 = BlockLine.create(li.end_token.next, names);
                if ((li2 !== null && li2.typ === BlkTyps.UNDEFINED && li2.is_all_upper) && li2.words > 0) {
                    res2.end_token = li2.end_token;
                    for (let tt = res2.end_token.next; tt !== null; tt = tt.next) {
                        li2 = BlockLine.create(tt, names);
                        if (li2 === null) 
                            break;
                        if (li2.typ !== BlkTyps.UNDEFINED || !li2.is_all_upper || li2.words === 0) 
                            break;
                        tt = res2.end_token = li2.end_token;
                    }
                }
            }
            return res2;
        }
        if (li.number_end === null) 
            return null;
        let res = BlockTitleToken._new460(t, li.end_token, li.typ);
        if (res.typ === BlkTyps.UNDEFINED) {
            if (li.words < 1) 
                return null;
            if (li.has_verb) 
                return null;
            if (!is_content_item) {
                if (!li.is_all_upper || li.not_words > (Utils.intDiv(li.words, 2))) 
                    return null;
            }
            res.typ = BlkTyps.CHAPTER;
            if ((li.number_end.end_char - t.begin_char) === 7 && li.number_end.next !== null && li.number_end.next.is_hiphen) 
                res.typ = BlkTyps.UNDEFINED;
        }
        if (li.has_content_item_tail && is_content_item) 
            res.typ = BlkTyps.INDEXITEM;
        if (res.typ === BlkTyps.CHAPTER || res.typ === BlkTyps.APPENDIX) {
            if (li.has_verb) 
                return null;
            if (li.not_words > li.words && !is_content_item) 
                return null;
            for (t = li.end_token.next; t !== null; t = t.next) {
                let li2 = BlockLine.create(t, names);
                if (li2 === null) 
                    break;
                if (li2.has_verb || (li2.words < 1)) 
                    break;
                if (!li2.is_all_upper && !is_content_item) 
                    break;
                if (li2.typ !== BlkTyps.UNDEFINED || li2.number_end !== null) 
                    break;
                t = res.end_token = li2.end_token;
                if (is_content_item && li2.has_content_item_tail) {
                    res.typ = BlkTyps.INDEXITEM;
                    break;
                }
            }
        }
        for (let tt = res.end_token; tt !== null && tt.begin_char > li.number_end.end_char; tt = tt.previous) {
            if ((tt instanceof TextToken) && tt.chars.is_letter) {
                res.value = MiscHelper.get_text_value(li.number_end.next, tt, GetTextAttr.NO);
                break;
            }
        }
        if ((res.typ === BlkTyps.INDEX || res.typ === BlkTyps.INTRO || res.typ === BlkTyps.CONSLUSION) || res.typ === BlkTyps.LITERATURE) {
            if (res.value !== null && res.value.length > 100) 
                return null;
            if (li.words < li.not_words) 
                return null;
        }
        return res;
    }
    
    static _new460(_arg1, _arg2, _arg3) {
        let res = new BlockTitleToken(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
}


module.exports = BlockTitleToken
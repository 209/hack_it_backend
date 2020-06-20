/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");

const BracketParseAttr = require("./../../core/BracketParseAttr");
const NumberToken = require("./../../NumberToken");
const PartTokenItemType = require("./../../decree/internal/PartTokenItemType");
const DecreeReferent = require("./../../decree/DecreeReferent");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const NumberTypes = require("./NumberTypes");
const CanBeEqualsAttrs = require("./../../core/CanBeEqualsAttrs");
const MetaToken = require("./../../MetaToken");
const InstrToken1Types = require("./InstrToken1Types");
const TextToken = require("./../../TextToken");
const DecreePartReferent = require("./../../decree/DecreePartReferent");
const MiscHelper = require("./../../core/MiscHelper");
const BracketHelper = require("./../../core/BracketHelper");
const InstrumentKind = require("./../InstrumentKind");
const DecreeChangeKind = require("./../../decree/DecreeChangeKind");
const PartToken = require("./../../decree/internal/PartToken");
const DecreeChangeReferent = require("./../../decree/DecreeChangeReferent");
const InstrToken1 = require("./InstrToken1");
const FragToken = require("./FragToken");
const ContentAnalyzeWhapper = require("./ContentAnalyzeWhapper");

class ListHelper {
    
    static analyze(res) {
        if (res.number === 4) {
        }
        if (res.children.length === 0) {
            let ki = res.kind;
            if (((ki === InstrumentKind.CHAPTER || ki === InstrumentKind.CLAUSE || ki === InstrumentKind.CONTENT) || ki === InstrumentKind.ITEM || ki === InstrumentKind.SUBITEM) || ki === InstrumentKind.CLAUSEPART || ki === InstrumentKind.INDENTION) {
                let tmp = new Array();
                tmp.push(res);
                ListHelper._analize_list_items(tmp, 0);
            }
            return;
        }
        if (res.kind === InstrumentKind.CLAUSE && res.number === 12) {
        }
        for (let i = 0; i < res.children.length; i++) {
            if (res.children[i].kind === InstrumentKind.INDENTION && ((res.children[i].end_token.is_char_of(":;") || ((((i + 1) < res.children.length) && res.children[i + 1].kind === InstrumentKind.EDITIONS && res.children[i + 1].end_token.is_char_of(":;")))))) {
                let j = 0;
                let cou = 1;
                let list_bullet = String.fromCharCode(0);
                for (j = i + 1; j < res.children.length; j++) {
                    let ch = res.children[j];
                    if (ch.kind === InstrumentKind.COMMENT || ch.kind === InstrumentKind.EDITIONS) 
                        continue;
                    if (ch.kind !== InstrumentKind.INDENTION) 
                        break;
                    if (ch.end_token.is_char_of(";") || ((((j + 1) < res.children.length) && res.children[j + 1].kind === InstrumentKind.EDITIONS && res.children[j + 1].end_token.is_char(';')))) {
                        cou++;
                        if ((ch.begin_token instanceof TextToken) && !ch.chars.is_letter) 
                            list_bullet = ch.kit.get_text_character(ch.begin_char);
                        continue;
                    }
                    if (ch.end_token.is_char_of(".")) {
                        cou++;
                        j++;
                        break;
                    }
                    if (ch.end_token.is_char_of(":")) {
                        if ((list_bullet.charCodeAt(0)) !== 0 && ch.begin_token.is_char(list_bullet)) {
                            for (let tt = ch.begin_token.next; tt !== null && (tt.end_char < ch.end_char); tt = tt.next) {
                                if (tt.previous.is_char('.') && MiscHelper.can_be_start_of_sentence(tt)) {
                                    let ch2 = FragToken._new1355(tt, ch.end_token, InstrumentKind.INDENTION, ch.number);
                                    ch.end_token = tt.previous;
                                    res.children.splice(j + 1, 0, ch2);
                                    for (let k = j + 1; k < res.children.length; k++) {
                                        if (res.children[k].kind === InstrumentKind.INDENTION) 
                                            res.children[k].number++;
                                    }
                                    cou++;
                                    j++;
                                    break;
                                }
                            }
                        }
                        break;
                    }
                    cou++;
                    j++;
                    break;
                }
                if (cou < 3) {
                    i = j;
                    continue;
                }
                if ((i > 0 && !res.children[i].end_token.is_char(':') && res.children[i - 1].kind2 === InstrumentKind.UNDEFINED) && res.children[i - 1].end_token.is_char(':')) 
                    res.children[i - 1].kind2 = InstrumentKind.LISTHEAD;
                for (; i < j; i++) {
                    let ch = res.children[i];
                    if (ch.kind !== InstrumentKind.INDENTION) 
                        continue;
                    if (ch.end_token.is_char(':')) 
                        ch.kind2 = InstrumentKind.LISTHEAD;
                    else if (((i + 1) < j) && res.children[i + 1].kind === InstrumentKind.EDITIONS && res.children[i + 1].end_token.is_char(':')) 
                        ch.kind2 = InstrumentKind.LISTHEAD;
                    else 
                        ch.kind2 = InstrumentKind.LISTITEM;
                }
            }
        }
        let changed = new Array();
        for (let i = 0; i < res.children.length; i++) {
            if (res.number === 7) {
            }
            if (res.children[i].children.length > 0) 
                ListHelper.analyze(res.children[i]);
            else {
                let co = ListHelper._analize_list_items(res.children, i);
                if (co > 0) {
                    changed.push(res.children[i]);
                    if (co > 1) 
                        res.children.splice(i + 1, co - 1);
                    i += (co - 1);
                }
            }
        }
        for (let i = changed.length - 1; i >= 0; i--) {
            if (changed[i].kind === InstrumentKind.CONTENT) {
                let j = res.children.indexOf(changed[i]);
                if (j < 0) 
                    continue;
                res.children.splice(j, 1);
                res.children.splice(j, 0, ...changed[i].children);
            }
        }
    }
    
    static _analize_list_items(chi, ind) {
        if (ind >= chi.length) 
            return -1;
        let res = chi[ind];
        let ki = res.kind;
        if (((ki === InstrumentKind.CHAPTER || ki === InstrumentKind.CLAUSE || ki === InstrumentKind.CONTENT) || ki === InstrumentKind.ITEM || ki === InstrumentKind.SUBITEM) || ki === InstrumentKind.CLAUSEPART || ki === InstrumentKind.INDENTION) {
        }
        else 
            return -1;
        if (res.has_changes && res.multiline_changes_value !== null) {
            let ci = res.multiline_changes_value;
            let cit = FragToken._new1338(ci.begin_token, ci.end_token, InstrumentKind.CITATION);
            res.children.push(cit);
            if (BracketHelper.is_bracket(cit.begin_token.previous, true)) 
                cit.begin_token = cit.begin_token.previous;
            if (BracketHelper.is_bracket(cit.end_token.next, true)) {
                cit.end_token = cit.end_token.next;
                if (cit.end_token.next !== null && cit.end_token.next.is_char_of(";.")) 
                    cit.end_token = cit.end_token.next;
            }
            res.fill_by_content_children();
            if (res.children[0].has_changes) {
            }
            let cit_kind = InstrumentKind.UNDEFINED;
            if (ci.tag instanceof DecreeChangeReferent) {
                let dcr = Utils.as(ci.tag, DecreeChangeReferent);
                if (dcr.value !== null && dcr.value.new_items.length > 0) {
                    let mnem = dcr.value.new_items[0];
                    let i = 0;
                    if ((((i = mnem.indexOf(' ')))) > 0) 
                        mnem = mnem.substring(0, 0 + i);
                    cit_kind = PartToken._get_instr_kind_by_typ(PartToken._get_type_by_attr_name(mnem));
                }
                else if (dcr.owners.length > 0 && (dcr.owners[0] instanceof DecreePartReferent) && dcr.kind === DecreeChangeKind.NEW) {
                    let pat = Utils.as(dcr.owners[0], DecreePartReferent);
                    let min = 0;
                    for (const s of pat.slots) {
                        let ty = PartToken._get_type_by_attr_name(s.type_name);
                        if (ty === PartTokenItemType.UNDEFINED) 
                            continue;
                        let l_ = PartToken._get_rank(ty);
                        if (l_ === 0) 
                            continue;
                        if (l_ > min || min === 0) {
                            min = l_;
                            cit_kind = PartToken._get_instr_kind_by_typ(ty);
                        }
                    }
                }
            }
            let sub = null;
            if (cit_kind !== InstrumentKind.UNDEFINED && cit_kind !== InstrumentKind.APPENDIX) {
                sub = new FragToken(ci.begin_token, ci.end_token);
                let wr = new ContentAnalyzeWhapper();
                wr.analyze(sub, null, true, cit_kind);
                sub.kind = InstrumentKind.CONTENT;
            }
            else 
                sub = FragToken.create_document(ci.begin_token, ci.end_char, cit_kind);
            if (sub === null || sub.children.length === 0) {
            }
            else if ((sub.kind === InstrumentKind.CONTENT && sub.children.length > 0 && sub.children[0].begin_token === sub.begin_token) && sub.children[sub.children.length - 1].end_token === sub.end_token) 
                cit.children.splice(cit.children.length, 0, ...sub.children);
            else 
                cit.children.push(sub);
            return 1;
        }
        let end_char = res.end_char;
        if (res.itok === null) 
            res.itok = InstrToken1.parse(res.begin_token, true, null, 0, null, false, res.end_char, false, false);
        let lines = ListHelper.LineToken.parse_list(res.begin_token, end_char, null);
        if (lines === null || (lines.length < 1)) 
            return -1;
        let ret = 1;
        if (res.kind === InstrumentKind.CONTENT) {
            for (let j = ind + 1; j < chi.length; j++) {
                if (chi[j].kind === InstrumentKind.CONTENT) {
                    let lines2 = ListHelper.LineToken.parse_list(chi[j].begin_token, chi[j].end_char, lines[lines.length - 1]);
                    if (lines2 === null || (lines2.length < 1)) 
                        break;
                    if (!lines2[0].is_list_item) {
                        if ((lines2.length > 1 && lines2[1].is_list_item && lines2[0].end_token.is_char_of(":")) && !lines2[0].begin_token.chars.is_capital_upper) 
                            lines2[0].is_list_item = true;
                        else 
                            break;
                    }
                    lines.splice(lines.length, 0, ...lines2);
                    ret = (j - ind) + 1;
                }
                else if (chi[j].kind !== InstrumentKind.EDITIONS && chi[j].kind !== InstrumentKind.COMMENT) 
                    break;
            }
        }
        if (lines.length < 2) 
            return -1;
        if ((lines.length > 1 && lines[0].is_list_item && lines[1].is_list_item) && lines[0].number !== 1) {
            if (lines.length === 2 || !lines[2].is_list_item) 
                lines[0].is_list_item = (lines[1].is_list_item = false);
        }
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].is_list_item) {
                if (i > 0 && lines[i - 1].is_list_item) 
                    continue;
                if (((i + 1) < lines.length) && lines[i + 1].is_list_item) {
                }
                else {
                    lines[i].is_list_item = false;
                    continue;
                }
                let j = 0;
                let new_line = false;
                for (j = i + 1; j < lines.length; j++) {
                    if (!lines[j].is_list_item) 
                        break;
                    else if (lines[j].is_newline_before) 
                        new_line = true;
                }
                if (new_line) 
                    continue;
                if (i > 0 && lines[i - 1].end_token.is_char(':')) 
                    continue;
                for (j = i; j < lines.length; j++) {
                    if (!lines[j].is_list_item) 
                        break;
                    else 
                        lines[j].is_list_item = false;
                }
            }
        }
        if (lines.length > 2) {
            let last = lines[lines.length - 1];
            let last2 = lines[lines.length - 2];
            if ((!last.is_list_item && last.end_token.is_char('.') && last2.is_list_item) && last2.end_token.is_char(';')) {
                if ((last.length_char < (last2.length_char * 2)) || last.begin_token.chars.is_all_lower) 
                    last.is_list_item = true;
            }
        }
        for (let i = 0; i < (lines.length - 1); i++) {
            if (!lines[i].is_list_item && !lines[i + 1].is_list_item) {
                if (((i + 2) < lines.length) && lines[i + 2].is_list_item && lines[i + 1].end_token.is_char(':')) {
                }
                else {
                    lines[i].end_token = lines[i + 1].end_token;
                    lines.splice(i + 1, 1);
                    i--;
                }
            }
        }
        for (let i = 0; i < (lines.length - 1); i++) {
            if (lines[i].is_list_item) {
                if (lines[i].number === 1) {
                    let ok = true;
                    let num = 1;
                    let nonum = 0;
                    for (let j = i + 1; j < lines.length; j++) {
                        if (!lines[j].is_list_item) {
                            ok = false;
                            break;
                        }
                        else if (lines[j].number > 0) {
                            num++;
                            if (lines[j].number !== num) {
                                ok = false;
                                break;
                            }
                        }
                        else 
                            nonum++;
                    }
                    if (!ok || nonum === 0 || (num < 2)) 
                        break;
                    let lt = lines[i];
                    for (let j = i + 1; j < lines.length; j++) {
                        if (lines[j].number > 0) 
                            lt = lines[j];
                        else {
                            let chli = Utils.as(lt.tag, Array);
                            if (chli === null) 
                                lt.tag = (chli = new Array());
                            lt.end_token = lines[j].end_token;
                            chli.push(lines[j]);
                            lines.splice(j, 1);
                            j--;
                        }
                    }
                }
            }
        }
        let cou = 0;
        for (const li of lines) {
            if (li.is_list_item) 
                cou++;
        }
        if (cou < 2) 
            return -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].is_list_item) {
                let i0 = i;
                let ok = true;
                cou = 1;
                for (; i < lines.length; i++,cou++) {
                    if (!lines[i].is_list_item) 
                        break;
                    else if (lines[i].number !== cou) 
                        ok = false;
                }
                if (!ok) {
                    for (i = i0; i < lines.length; i++) {
                        if (!lines[i].is_list_item) 
                            break;
                        else 
                            lines[i].number = 0;
                    }
                }
                if (cou > 3 && lines[i0].begin_token.get_source_text() !== lines[i0 + 1].begin_token.get_source_text() && lines[i0 + 1].begin_token.get_source_text() === lines[i0 + 2].begin_token.get_source_text()) {
                    let pref = lines[i0 + 1].begin_token.get_source_text();
                    ok = true;
                    for (let j = i0 + 2; j < i; j++) {
                        if (pref !== lines[j].begin_token.get_source_text()) {
                            ok = false;
                            break;
                        }
                    }
                    if (!ok) 
                        continue;
                    let tt = null;
                    ok = false;
                    for (tt = lines[i0].end_token.previous; tt !== null && tt !== lines[i0].begin_token; tt = tt.previous) {
                        if (tt.get_source_text() === pref) {
                            ok = true;
                            break;
                        }
                    }
                    if (ok) {
                        let li0 = new ListHelper.LineToken(lines[i0].begin_token, tt.previous);
                        lines[i0].begin_token = tt;
                        lines.splice(i0, 0, li0);
                        i++;
                    }
                }
            }
        }
        for (const li of lines) {
            li.correct_begin_token();
            let ch = FragToken._new1355(li.begin_token, li.end_token, (li.is_list_item ? InstrumentKind.LISTITEM : InstrumentKind.CONTENT), li.number);
            if (ch.kind === InstrumentKind.CONTENT && ch.end_token.is_char(':')) 
                ch.kind = InstrumentKind.LISTHEAD;
            res.children.push(ch);
            let chli = Utils.as(li.tag, Array);
            if (chli !== null) {
                for (const lt of chli) {
                    ch.children.push(FragToken._new1338(lt.begin_token, lt.end_token, InstrumentKind.LISTITEM));
                }
                if (ch.begin_char < ch.children[0].begin_char) 
                    ch.children.splice(0, 0, FragToken._new1338(ch.begin_token, ch.children[0].begin_token.previous, InstrumentKind.CONTENT));
            }
        }
        return ret;
    }
    
    static correct_app_list(lines) {
        for (let i = 0; i < (lines.length - 1); i++) {
            if ((lines[i].typ === InstrToken1Types.LINE && lines[i].numbers.length === 0 && lines[i].begin_token.is_value("ПРИЛОЖЕНИЯ", "ДОДАТОК")) && lines[i + 1].numbers.length > 0 && lines[i].end_token.is_char(':')) {
                let num = 1;
                for (++i; i < lines.length; i++) {
                    if (lines[i].numbers.length === 0) {{
                                if (((i + 1) < lines.length) && lines[i + 1].numbers.length === 1 && lines[i + 1].numbers[0] === num.toString()) {
                                    lines[i - 1].end_token = lines[i].end_token;
                                    lines.splice(i, 1);
                                    i--;
                                    continue;
                                }
                            }
                        break;
                    }
                    else {
                        let nn = 0;
                        let wrapnn1547 = new RefOutArgWrapper();
                        let inoutres1548 = Utils.tryParseInt(lines[i].numbers[0], wrapnn1547);
                        nn = wrapnn1547.value;
                        if (inoutres1548) 
                            num = nn + 1;
                        lines[i].num_typ = NumberTypes.UNDEFINED;
                        lines[i].numbers.splice(0, lines[i].numbers.length);
                    }
                }
            }
        }
    }
    
    static correct_index(lines) {
        if (lines.length < 10) 
            return;
        if (lines[0].typ === InstrToken1Types.CLAUSE || lines[0].typ === InstrToken1Types.CHAPTER) {
        }
        else 
            return;
        let index = new Array();
        index.push(lines[0]);
        let content = new Array();
        let i = 0;
        let ind_text = 0;
        let con_text = 0;
        for (i = 1; i < lines.length; i++) {
            if (lines[i].typ === lines[0].typ) {
                if (ListHelper._can_be_equals(lines[i], lines[0])) 
                    break;
                else 
                    index.push(lines[i]);
            }
            else 
                ind_text += lines[i].length_char;
        }
        let cind = i;
        for (; i < lines.length; i++) {
            if (lines[i].typ === lines[0].typ) 
                content.push(lines[i]);
            else 
                con_text += lines[i].length_char;
        }
        if (index.length === content.length && index.length > 2) {
            if ((ind_text * 10) < con_text) {
                lines[0] = InstrToken1._new1549(lines[0].begin_token, lines[cind - 1].end_token, true, InstrToken1Types.INDEX);
                lines.splice(1, cind - 1);
            }
        }
    }
    
    static _can_be_equals(i1, i2) {
        if (i1.typ !== i2.typ) 
            return false;
        if (i1.numbers.length > 0 && i2.numbers.length > 0) {
            if (i1.numbers.length !== i2.numbers.length) 
                return false;
            for (let i = 0; i < i1.numbers.length; i++) {
                if (i1.numbers[i] !== i2.numbers[i]) 
                    return false;
            }
        }
        if (!MiscHelper.can_be_equals_ex(i1.value, i2.value, CanBeEqualsAttrs.of((CanBeEqualsAttrs.IGNORENONLETTERS.value()) | (CanBeEqualsAttrs.IGNOREUPPERCASE.value())))) 
            return false;
        return true;
    }
}


ListHelper.LineToken = class  extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.is_list_item = false;
        this.is_list_head = false;
        this.number = 0;
    }
    
    correct_begin_token() {
        if (!this.is_list_item) 
            return;
        if (this.begin_token.is_hiphen && this.begin_token.next !== null) 
            this.begin_token = this.begin_token.next;
        else if ((this.number > 0 && this.begin_token.next !== null && this.begin_token.next.is_char(')')) && this.begin_token.next.next !== null) 
            this.begin_token = this.begin_token.next.next;
    }
    
    toString() {
        return ((this.is_list_item ? "LISTITEM" : "TEXT") + ": " + this.get_source_text());
    }
    
    static parse(t, max_char, prev) {
        const LanguageHelper = require("./../../../morph/LanguageHelper");
        const NumberToken = require("./../../NumberToken");
        const TextToken = require("./../../TextToken");
        const BracketHelper = require("./../../core/BracketHelper");
        const BracketParseAttr = require("./../../core/BracketParseAttr");
        const DecreeReferent = require("./../../decree/DecreeReferent");
        if (t === null || t.end_char > max_char) 
            return null;
        let res = new ListHelper.LineToken(t, t);
        for (; t !== null && t.end_char <= max_char; t = t.next) {
            if (t.is_char(':')) {
                if (res.is_newline_before && res.begin_token.is_value("ПРИЛОЖЕНИЕ", "ДОДАТОК")) 
                    res.is_list_head = true;
                res.end_token = t;
                break;
            }
            if (t.is_char(';')) {
                if (!t.is_whitespace_after) {
                }
                if (t.previous !== null && (t.previous.get_referent() instanceof DecreeReferent)) {
                    if (!t.is_whitespace_after) 
                        continue;
                    if (t.next !== null && (t.next.get_referent() instanceof DecreeReferent)) 
                        continue;
                }
                res.is_list_item = true;
                res.end_token = t;
                break;
            }
            if (t.is_char('(')) {
                let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (br !== null) {
                    res.end_token = (t = br.end_token);
                    continue;
                }
            }
            if (t.is_newline_before && t !== res.begin_token) {
                let _next = true;
                if (t.previous.is_comma || t.previous.is_and || t.is_char_of("(")) 
                    _next = false;
                else if (t.chars.is_letter || (t instanceof NumberToken)) {
                    if (t.chars.is_all_lower) 
                        _next = false;
                    else if (t.previous.chars.is_letter) 
                        _next = false;
                }
                if (_next) 
                    break;
            }
            res.end_token = t;
        }
        if (res.begin_token.is_hiphen) 
            res.is_list_item = res.begin_token.next !== null && !res.begin_token.next.is_hiphen;
        else if (res.begin_token.is_char_of("·")) {
            res.is_list_item = true;
            res.begin_token = res.begin_token.next;
        }
        else if (res.begin_token.next !== null && ((res.begin_token.next.is_char(')') || ((prev !== null && ((prev.is_list_item || prev.is_list_head))))))) {
            if (res.begin_token.length_char === 1 || (res.begin_token instanceof NumberToken)) {
                res.is_list_item = true;
                if ((res.begin_token instanceof NumberToken) && (res.begin_token).int_value !== null) 
                    res.number = (res.begin_token).int_value;
                else if ((res.begin_token instanceof TextToken) && res.begin_token.length_char === 1) {
                    let te = (res.begin_token).term;
                    if (LanguageHelper.is_cyrillic_char(te[0])) 
                        res.number = (te.charCodeAt(0)) - ('А'.charCodeAt(0));
                    else if (LanguageHelper.is_latin_char(te[0])) 
                        res.number = (te.charCodeAt(0)) - ('A'.charCodeAt(0));
                }
            }
        }
        return res;
    }
    
    static parse_list(t, max_char, prev) {
        let lt = ListHelper.LineToken.parse(t, max_char, prev);
        if (lt === null) 
            return null;
        let res = new Array();
        res.push(lt);
        let ss = lt.toString();
        for (t = lt.end_token.next; t !== null; t = t.next) {
            let lt0 = ListHelper.LineToken.parse(t, max_char, lt);
            if (lt0 === null) 
                break;
            res.push((lt = lt0));
            t = lt0.end_token;
        }
        if ((res.length < 2) && !res[0].is_list_item) {
            if ((prev !== null && prev.is_list_item && res[0].end_token.is_char('.')) && !res[0].begin_token.chars.is_capital_upper) {
                res[0].is_list_item = true;
                return res;
            }
            return null;
        }
        let i = 0;
        for (i = 0; i < res.length; i++) {
            if (res[i].is_list_item) 
                break;
        }
        if (i >= res.length) 
            return null;
        let j = 0;
        let cou = 0;
        for (j = i; j < res.length; j++) {
            if (!res[j].is_list_item) {
                if (res[j - 1].is_list_item && res[j].end_token.is_char('.')) {
                    if (res[j].begin_token.get_source_text() === res[i].begin_token.get_source_text() || res[j].begin_token.chars.is_all_lower) {
                        res[j].is_list_item = true;
                        j++;
                        cou++;
                    }
                }
            }
            else 
                cou++;
        }
        return res;
    }
}


module.exports = ListHelper
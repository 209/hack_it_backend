/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const Token = require("./../../Token");
const MetaToken = require("./../../MetaToken");
const TextToken = require("./../../TextToken");
const NumberToken = require("./../../NumberToken");
const NumberHelper = require("./../../core/NumberHelper");
const MiscHelper = require("./../../core/MiscHelper");

class OrgItemNumberToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.number = null;
    }
    
    toString() {
        return ("№ " + ((this.number != null ? this.number : "?")));
    }
    
    static try_attach(t, can_be_pure_number = false, typ = null) {
        if (t === null) 
            return null;
        let tt = Utils.as(t, TextToken);
        if (tt !== null) {
            let t1 = MiscHelper.check_number_prefix(tt);
            if ((t1 instanceof NumberToken) && !t1.is_newline_before) {
                let res = OrgItemNumberToken._new1818(tt, t1, (t1).value.toString());
                if (t1.next !== null && t1.next.is_char_of("\\/") && (t1.next.next instanceof NumberToken)) {
                    if (typ !== null && typ.typ === "офис") {
                        res.end_token = res.end_token.next.next;
                        res.number = (res.number + "/" + (res.end_token).value);
                    }
                }
                return res;
            }
        }
        if ((t.is_hiphen && (t.next instanceof NumberToken) && !t.is_whitespace_before) && !t.is_whitespace_after) {
            if (NumberHelper.try_parse_age(t.next) === null) 
                return OrgItemNumberToken._new1818(t, t.next, (t.next).value.toString());
        }
        if (t instanceof NumberToken) {
            if ((!t.is_whitespace_before && t.previous !== null && t.previous.is_hiphen)) 
                return OrgItemNumberToken._new1818(t, t, (t).value.toString());
            if (typ !== null && typ.typ !== null && (((typ.typ === "войсковая часть" || typ.typ === "військова частина" || typ.typ.includes("колония")) || typ.typ.includes("колонія") || typ.typ.includes("школа")))) {
                if (t.length_char >= 4 || t.length_char <= 6) {
                    let res = OrgItemNumberToken._new1818(t, t, (t).value.toString());
                    if (t.next !== null && ((t.next.is_hiphen || t.next.is_char_of("\\/"))) && !t.next.is_whitespace_after) {
                        if ((t.next.next instanceof NumberToken) && ((t.length_char + t.next.next.length_char) < 9)) {
                            res.end_token = t.next.next;
                            res.number = (res.number + "-" + (res.end_token).value);
                        }
                        else if ((t.next.next instanceof TextToken) && t.next.next.length_char === 1 && t.next.next.chars.is_letter) {
                            res.end_token = t.next.next;
                            res.number = (res.number + (res.end_token).term);
                        }
                    }
                    else if (((t.next instanceof TextToken) && t.next.length_char === 1 && t.next.chars.is_letter) && !t.is_whitespace_after) {
                        res.end_token = t.next;
                        res.number = (res.number + (res.end_token).term);
                    }
                    return res;
                }
            }
        }
        if (((t instanceof TextToken) && t.length_char === 1 && t.chars.is_letter) && ((!t.is_whitespace_after || (((t.whitespaces_after_count < 2) && t.chars.is_all_upper))))) {
            if (typ !== null && typ.typ !== null && (((typ.typ === "войсковая часть" || typ.typ === "військова частина" || typ.typ.includes("колония")) || typ.typ.includes("колонія")))) {
                let tt1 = t.next;
                if (tt1 !== null && tt1.is_hiphen) 
                    tt1 = tt1.next;
                if (tt1 instanceof NumberToken) {
                    let res = new OrgItemNumberToken(t, tt1);
                    res.number = ((t).term + (tt1).value);
                    return res;
                }
            }
        }
        return null;
    }
    
    static _new1818(_arg1, _arg2, _arg3) {
        let res = new OrgItemNumberToken(_arg1, _arg2);
        res.number = _arg3;
        return res;
    }
}


module.exports = OrgItemNumberToken
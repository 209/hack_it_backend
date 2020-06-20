/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const TextToken = require("./../../TextToken");
const NumberToken = require("./../../NumberToken");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const InstrumentKind = require("./../InstrumentKind");
const BracketHelper = require("./../../core/BracketHelper");

class ContractHelper {
    
    /**
     * Объединение абзацев в один фрагмент, если переход на новую строку 
     *  является сомнительным (для договоров обычно кривые документы)
     * @param fr 
     */
    static correct_dummy_newlines(fr) {
        let i = 0;
        for (i = 0; i < fr.children.length; i++) {
            let ch = fr.children[i];
            if ((ch.kind === InstrumentKind.KEYWORD || ch.kind === InstrumentKind.NUMBER || ch.kind === InstrumentKind.NAME) || ch.kind === InstrumentKind.EDITIONS || ch.kind === InstrumentKind.COMMENT) {
            }
            else 
                break;
        }
        if ((i < fr.children.length) && fr.children[i].kind === InstrumentKind.INDENTION) {
            let j = 0;
            for (j = i + 1; j < fr.children.length; j++) {
                if (fr.children[j].kind !== InstrumentKind.INDENTION) 
                    break;
                else if (ContractHelper._calc_newline_between_coef(fr.children[j - 1], fr.children[j]) > 0) 
                    break;
            }
            if (j >= fr.children.length) {
                j--;
                fr.children[i].kind = InstrumentKind.CONTENT;
                fr.children[i].number = 0;
                fr.children[i].end_token = fr.children[j].end_token;
                if ((i + 1) < fr.children.length) 
                    fr.children.splice(i + 1, fr.children.length - i - 1);
                if (fr.kind === InstrumentKind.PREAMBLE && fr.children.length === 1) 
                    fr.children.splice(0, fr.children.length);
            }
            else {
                let ch = false;
                for (j = i + 1; j < fr.children.length; j++) {
                    if (fr.children[j - 1].kind === InstrumentKind.INDENTION && fr.children[j].kind === InstrumentKind.INDENTION && (ContractHelper._calc_newline_between_coef(fr.children[j - 1], fr.children[j]) < 0)) {
                        fr.children[j - 1].end_token = fr.children[j].end_token;
                        fr.children.splice(j, 1);
                        j--;
                        ch = true;
                    }
                }
                if (ch) {
                    let num = 1;
                    for (j = i; j < fr.children.length; j++) {
                        if (fr.children[j].kind === InstrumentKind.INDENTION) 
                            fr.children[j].number = num++;
                    }
                }
            }
        }
        for (const ch of fr.children) {
            ContractHelper.correct_dummy_newlines(ch);
        }
    }
    
    static _calc_newline_between_coef(fr1, fr2) {
        if (fr1.newlines_after_count > 1) 
            return 1;
        for (let tt = fr1.begin_token; tt !== null && tt.end_char <= fr1.end_char; tt = tt.next) {
            if (BracketHelper.can_be_start_of_sequence(tt, false, false)) {
                let br = BracketHelper.try_parse(tt, BracketParseAttr.CANBEMANYLINES, 100);
                if (br !== null && br.end_char >= fr2.begin_char) 
                    return -1;
            }
        }
        let t = fr1.end_token;
        if (t.is_char_of(":;.")) 
            return 1;
        if ((t instanceof TextToken) && ((t.morph.class0.is_preposition || t.morph.class0.is_conjunction))) 
            return -1;
        let t1 = fr2.begin_token;
        if (t1 instanceof TextToken) {
            if (t1.chars.is_all_lower) 
                return -1;
            if (BracketHelper.can_be_start_of_sequence(t1, false, false)) {
                if (t.chars.is_all_lower) 
                    return -1;
            }
        }
        else if (t1 instanceof NumberToken) {
            if (t.chars.is_all_lower) 
                return -1;
        }
        if (t.chars.is_all_lower) {
            if (fr2.end_token.is_char(';')) 
                return -1;
        }
        return 0;
    }
}


module.exports = ContractHelper
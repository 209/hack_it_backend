/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const ProgressEventArgs = require("./../../unisharp/ProgressEventArgs");

const SentItemType = require("./SentItemType");
const TextToken = require("./../../ner/TextToken");
const SemDocument = require("./../SemDocument");
const SemBlock = require("./../SemBlock");
const MiscHelper = require("./../../ner/core/MiscHelper");
const Sentence = require("./Sentence");
const OptimizerHelper = require("./OptimizerHelper");

class AnalyzeHelper {
    
    static process(ar, pars) {
        let txt = new SemDocument();
        for (let t = ar.first_token; t !== null; t = t.next) {
            t.tag = null;
        }
        if (pars.progress !== null) 
            pars.progress.call(null, new ProgressEventArgs(0, null));
        let pers0 = 0;
        for (let t = ar.first_token; t !== null; t = t.next) {
            if (pars.progress !== null) {
                let p = t.begin_char;
                if (ar.sofas[0].text.length < 100000) 
                    p = Utils.intDiv(p * 100, ar.sofas[0].text.length);
                else 
                    p = Utils.intDiv(p, (Utils.intDiv(ar.sofas[0].text.length, 100)));
                if (p !== pers0) {
                    pers0 = p;
                    pars.progress.call(null, new ProgressEventArgs(p, null));
                }
            }
            let t1 = t;
            for (let tt = t.next; tt !== null; tt = tt.next) {
                if (tt.is_newline_before) {
                    if (MiscHelper.can_be_start_of_sentence(tt)) 
                        break;
                }
                t1 = tt;
            }
            try {
                AnalyzeHelper._process_block(txt, ar, t, t1);
            } catch (ex) {
            }
            t = t1;
            if (pars.max_char > 0 && t.end_char > pars.max_char) 
                break;
        }
        OptimizerHelper.optimize(txt, pars);
        if (pars.progress !== null) 
            pars.progress.call(null, new ProgressEventArgs(100, null));
        return txt;
    }
    
    static _process_block(res, ar, t0, t1) {
        let blk = new SemBlock(res);
        for (let t = t0; t !== null && t.end_char <= t1.end_char; t = t.next) {
            let te = t;
            for (let tt = t.next; tt !== null && tt.end_char <= t1.end_char; tt = tt.next) {
                if (MiscHelper.can_be_start_of_sentence(tt)) 
                    break;
                else 
                    te = tt;
            }
            AnalyzeHelper._process_sentence(blk, ar, t, te);
            t = te;
        }
        if (blk.fragments.length > 0) 
            res.blocks.push(blk);
    }
    
    static _process_sentence(blk, ar, t0, t1) {
        let cou = 0;
        for (let t = t0; t !== null && (t.end_char < t1.end_char); t = t.next,cou++) {
        }
        if (cou > 70) {
            let cou2 = 0;
            for (let t = t0; t !== null && (t.end_char < t1.end_char); t = t.next,cou2++) {
                if (cou2 >= 70) {
                    t1 = t;
                    break;
                }
            }
        }
        let sents = Sentence.parse_variants(t0, t1, 0, 100, SentItemType.UNDEFINED);
        if (sents === null) 
            return;
        let max = -1;
        let best = null;
        let alt = null;
        for (const s of sents) {
            if ((t1 instanceof TextToken) && !t1.chars.is_letter) 
                s.last_char = Utils.as(t1, TextToken);
            s.calc_coef(false);
            if (s.coef > max) {
                max = s.coef;
                best = s;
                alt = null;
            }
            else if (s.coef === max && max > 0) 
                alt = s;
        }
        if (best !== null && best.res_block !== null) 
            best.add_to_block(blk, null);
    }
}


module.exports = AnalyzeHelper
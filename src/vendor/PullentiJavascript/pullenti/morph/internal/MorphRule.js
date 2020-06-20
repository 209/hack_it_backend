/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../unisharp/StringBuilder");

const LanguageHelper = require("./../LanguageHelper");
const MorphWordForm = require("./../MorphWordForm");

class MorphRule {
    
    constructor() {
        this.id = 0;
        this.variants = new Hashtable();
        this.variants_list = new Array();
        this.variants_key = new Array();
        this.lazy_pos = 0;
    }
    
    refresh_variants() {
        let vars = new Array();
        for (const v of this.variants_list) {
            vars.splice(vars.length, 0, ...v);
        }
        this.variants.clear();
        this.variants_key.splice(0, this.variants_key.length);
        this.variants_list.splice(0, this.variants_list.length);
        for (const v of vars) {
            let li = [ ];
            let wrapli28 = new RefOutArgWrapper();
            let inoutres29 = this.variants.tryGetValue((v.tail != null ? v.tail : ""), wrapli28);
            li = wrapli28.value;
            if (!inoutres29) 
                this.variants.put((v.tail != null ? v.tail : ""), (li = new Array()));
            li.push(v);
        }
        for (const kp of this.variants.entries) {
            this.variants_key.push(kp.key);
            this.variants_list.push(kp.value);
        }
    }
    
    toString() {
        let res = new StringBuilder();
        for (let i = 0; i < this.variants_key.length; i++) {
            if (res.length > 0) 
                res.append(", ");
            res.append("-").append(this.variants_key[i]);
        }
        return res.toString();
    }
    
    add(tail, var0) {
        tail = LanguageHelper.correct_word(tail);
        if (var0.class0.is_undefined) {
        }
        let li = [ ];
        let wrapli30 = new RefOutArgWrapper();
        let inoutres31 = this.variants.tryGetValue(tail, wrapli30);
        li = wrapli30.value;
        if (!inoutres31) {
            li = new Array();
            this.variants.put(tail, li);
        }
        var0.tail = tail;
        li.push(var0);
        var0.rule = this;
    }
    
    process_result(res, word_begin, mvs) {
        for (const mv of mvs) {
            let r = new MorphWordForm(mv, null);{
                    if (mv.normal_tail !== null && mv.normal_tail.length > 0 && mv.normal_tail[0] !== '-') 
                        r.normal_case = word_begin + mv.normal_tail;
                    else 
                        r.normal_case = word_begin;
                }
            if (mv.full_normal_tail !== null) {
                if (mv.full_normal_tail.length > 0 && mv.full_normal_tail[0] !== '-') 
                    r.normal_full = word_begin + mv.full_normal_tail;
                else 
                    r.normal_full = word_begin;
            }
            if (!MorphWordForm.has_morph_equals(res, r)) {
                r.undef_coef = 0;
                res.push(r);
            }
        }
    }
}


module.exports = MorphRule
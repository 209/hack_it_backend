/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../../unisharp/StringBuilder");

const GetTextAttr = require("./GetTextAttr");
const ReferentToken = require("./../ReferentToken");
const MorphGender = require("./../../morph/MorphGender");
const MetaToken = require("./../MetaToken");
const MorphClass = require("./../../morph/MorphClass");
const MiscHelper = require("./MiscHelper");

/**
 * Вариант расщепления именной группы, у которой слиплись существительные
 */
class NounPhraseMultivarToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.source = null;
        this.adj_index1 = 0;
        this.adj_index2 = 0;
    }
    
    toString() {
        return (String(this.source.adjectives[this.adj_index1]) + " " + this.source.noun);
    }
    
    get_normal_case_text(mc = null, single_number = false, gender = MorphGender.UNDEFINED, keep_chars = false) {
        if (gender === MorphGender.UNDEFINED) 
            gender = this.source.morph.gender;
        let res = new StringBuilder();
        for (let k = this.adj_index1; k <= this.adj_index2; k++) {
            let adj = this.source.adjectives[k].get_normal_case_text(MorphClass.ooBitor(MorphClass.ADJECTIVE, MorphClass.PRONOUN), single_number, gender, keep_chars);
            if (adj === null || adj === "?") 
                adj = MiscHelper.get_text_value_of_meta_token(this.source.adjectives[k], (keep_chars ? GetTextAttr.KEEPREGISTER : GetTextAttr.NO));
            res.append(((adj != null ? adj : "?"))).append(" ");
        }
        let noun = null;
        if ((this.source.noun.begin_token instanceof ReferentToken) && this.source.begin_token === this.source.noun.end_token) 
            noun = this.source.noun.begin_token.get_normal_case_text(null, single_number, gender, keep_chars);
        else {
            let cas = MorphClass.ooBitor(MorphClass.NOUN, MorphClass.PRONOUN);
            if (mc !== null && !mc.is_undefined) 
                cas = mc;
            noun = this.source.noun.get_normal_case_text(cas, single_number, gender, keep_chars);
        }
        if (noun === null || noun === "?") 
            noun = this.source.noun.get_normal_case_text(null, single_number, MorphGender.UNDEFINED, false);
        res.append((noun != null ? noun : "?"));
        return res.toString();
    }
    
    static _new570(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new NounPhraseMultivarToken(_arg1, _arg2);
        res.source = _arg3;
        res.adj_index1 = _arg4;
        res.adj_index2 = _arg5;
        return res;
    }
}


module.exports = NounPhraseMultivarToken
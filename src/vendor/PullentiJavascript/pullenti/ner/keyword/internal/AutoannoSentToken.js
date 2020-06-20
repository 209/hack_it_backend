/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const TextAnnotation = require("./../../TextAnnotation");
const GetTextAttr = require("./../../core/GetTextAttr");
const MetaToken = require("./../../MetaToken");
const MiscHelper = require("./../../core/MiscHelper");
const KeywordType = require("./../KeywordType");
const TextToken = require("./../../TextToken");
const KeywordReferent = require("./../KeywordReferent");

class AutoannoSentToken extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.rank = 0;
        this.value = null;
    }
    
    toString() {
        return (String(this.rank) + ": " + this.value);
    }
    
    static try_parse(t) {
        if (t === null || !MiscHelper.can_be_start_of_sentence(t)) 
            return null;
        let res = new AutoannoSentToken(t, t);
        let has_verb = false;
        for (; t !== null; t = t.next) {
            if (MiscHelper.can_be_start_of_sentence(t) && t !== res.begin_token) 
                break;
            let r = t.get_referent();
            if (r instanceof KeywordReferent) {
                res.rank += (r).rank;
                if ((r).typ === KeywordType.PREDICATE) 
                    has_verb = true;
            }
            else if (t instanceof TextToken) {
                let mc = t.get_morph_class_in_dictionary();
                if (mc.is_pronoun || mc.is_personal_pronoun) 
                    res.rank -= (1);
                else if (t.length_char > 1) 
                    res.rank -= 0.1;
            }
            res.end_token = t;
        }
        if (!has_verb) 
            res.rank /= (3);
        res.value = MiscHelper.get_text_value_of_meta_token(res, GetTextAttr.of((GetTextAttr.KEEPREGISTER.value()) | (GetTextAttr.KEEPQUOTES.value())));
        return res;
    }
    
    static create_annotation(_kit, max_sents) {
        let sents = new Array();
        for (let t = _kit.first_token; t !== null; t = t.next) {
            let sent = AutoannoSentToken.try_parse(t);
            if (sent === null) 
                continue;
            if (sent.rank > 0) 
                sents.push(sent);
            t = sent.end_token;
        }
        if (sents.length < 2) 
            return null;
        for (let i = 0; i < sents.length; i++) {
            sents[i].rank *= ((((sents.length - i))) / (sents.length));
        }
        if ((max_sents * 3) > sents.length) {
            max_sents = Utils.intDiv(sents.length, 3);
            if (max_sents === 0) 
                max_sents = 1;
        }
        while (sents.length > max_sents) {
            let mini = 0;
            let min = sents[0].rank;
            for (let i = 1; i < sents.length; i++) {
                if (sents[i].rank <= min) {
                    min = sents[i].rank;
                    mini = i;
                }
            }
            sents.splice(mini, 1);
        }
        let ano = new KeywordReferent();
        ano.typ = KeywordType.ANNOTATION;
        let tmp = new StringBuilder();
        for (const s of sents) {
            if (tmp.length > 0) 
                tmp.append(' ');
            tmp.append(s.value);
            ano.occurrence.push(TextAnnotation._new1588(s.begin_char, s.end_char, ano, _kit.sofa));
        }
        ano.add_slot(KeywordReferent.ATTR_VALUE, tmp.toString(), true, 0);
        return ano;
    }
}


module.exports = AutoannoSentToken
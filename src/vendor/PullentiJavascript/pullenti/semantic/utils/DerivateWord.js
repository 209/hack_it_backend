/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../../unisharp/StringBuilder");

const MorphVoice = require("./../../morph/MorphVoice");
const MorphTense = require("./../../morph/MorphTense");
const ExplanWordAttr = require("./ExplanWordAttr");
const MorphAspect = require("./../../morph/MorphAspect");

/**
 * Слово толкового словаря
 */
class DerivateWord {
    
    constructor(gr) {
        this.group = null;
        this.spelling = null;
        this.class0 = null;
        this.aspect = MorphAspect.UNDEFINED;
        this.voice = MorphVoice.UNDEFINED;
        this.tense = MorphTense.UNDEFINED;
        this.reflexive = false;
        this.lang = null;
        this.attrs = new ExplanWordAttr();
        this.tag = null;
        this.group = gr;
    }
    
    toString() {
        let tmp = new StringBuilder();
        tmp.append(this.spelling);
        if (this.class0 !== null && !this.class0.is_undefined) 
            tmp.append(", ").append(this.class0.toString());
        if (this.aspect !== MorphAspect.UNDEFINED) 
            tmp.append(", ").append((this.aspect === MorphAspect.PERFECTIVE ? "соверш." : "несоверш."));
        if (this.voice !== MorphVoice.UNDEFINED) 
            tmp.append(", ").append((this.voice === MorphVoice.ACTIVE ? "действ." : (this.voice === MorphVoice.PASSIVE ? "страдат." : "средн.")));
        if (this.tense !== MorphTense.UNDEFINED) 
            tmp.append(", ").append((this.tense === MorphTense.PAST ? "прош." : (this.tense === MorphTense.PRESENT ? "настоящ." : "будущ.")));
        if (this.reflexive) 
            tmp.append(", возвр.");
        if (this.attrs.value !== (0)) 
            tmp.append(", ").append(this.attrs.toString());
        return tmp.toString();
    }
    
    static _new2968(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7, _arg8, _arg9) {
        let res = new DerivateWord(_arg1);
        res.spelling = _arg2;
        res.lang = _arg3;
        res.class0 = _arg4;
        res.aspect = _arg5;
        res.reflexive = _arg6;
        res.tense = _arg7;
        res.voice = _arg8;
        res.attrs = _arg9;
        return res;
    }
}


module.exports = DerivateWord
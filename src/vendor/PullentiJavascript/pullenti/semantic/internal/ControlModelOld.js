/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../unisharp/StringBuilder");

const MorphCase = require("./../../morph/MorphCase");
const QuestionType = require("./../utils/QuestionType");

/**
 * Модель управления группы (всей группы, а не только глаголов) 
 *  СТАРАЯ. Осталась временно, пока не переведём всё на новую
 */
class ControlModelOld {
    
    constructor() {
        this.transitive = false;
        this.nexts = null;
        this.questions = QuestionType.UNDEFINED;
        this.agent = null;
        this.pacient = null;
        this.instrument = null;
    }
    
    toString() {
        let res = new StringBuilder();
        if (this.transitive) 
            res.append("Перех.");
        if (this.agent !== null) 
            res.append(" Агент:").append(this.agent);
        if (this.pacient !== null) 
            res.append(" Пациент:").append(this.pacient);
        if (this.instrument !== null) 
            res.append(" Инстр.:").append(this.instrument);
        if (this.nexts !== null) {
            for (const kp of this.nexts.entries) {
                res.append(" [").append((Utils.notNull(kp.key, ""))).append(" ").append(kp.value).append("]");
            }
        }
        if ((((this.questions.value()) & (QuestionType.WHERE.value()))) !== (QuestionType.UNDEFINED.value())) 
            res.append(" ГДЕ?");
        if ((((this.questions.value()) & (QuestionType.WHEREFROM.value()))) !== (QuestionType.UNDEFINED.value())) 
            res.append(" ОТКУДА?");
        if ((((this.questions.value()) & (QuestionType.WHERETO.value()))) !== (QuestionType.UNDEFINED.value())) 
            res.append(" КУДА?");
        if ((((this.questions.value()) & (QuestionType.WHEN.value()))) !== (QuestionType.UNDEFINED.value())) 
            res.append(" КОГДА?");
        if ((((this.questions.value()) & (QuestionType.WHATTODO.value()))) !== (QuestionType.UNDEFINED.value())) 
            res.append(" ЧТО ДЕЛАТЬ?");
        return res.toString().trim();
    }
    
    check_next(prep, cas) {
        if (this.nexts === null) 
            return false;
        let cas0 = null;
        let wrapcas02897 = new RefOutArgWrapper();
        let inoutres2898 = this.nexts.tryGetValue((prep != null ? prep : ""), wrapcas02897);
        cas0 = wrapcas02897.value;
        if (!inoutres2898) 
            return false;
        return !(MorphCase.ooBitand(cas0, cas)).is_undefined;
    }
}


module.exports = ControlModelOld
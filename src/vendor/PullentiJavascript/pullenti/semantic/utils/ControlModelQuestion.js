/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");

const MorphCase = require("./../../morph/MorphCase");
const QuestionType = require("./QuestionType");

class ControlModelQuestion {
    
    toString() {
        return this.spelling;
    }
    
    check(prep, cas) {
        if (this.is_abstract) {
            if (this.subquestions !== null) {
                for (const q of this.subquestions) {
                    if (q.check(prep, cas)) 
                        return true;
                }
            }
            return false;
        }
        if ((MorphCase.ooBitand(cas, this._case)).is_undefined) 
            return false;
        if (prep !== null && this.preposition !== null) 
            return prep === this.preposition;
        return Utils.isNullOrEmpty(prep) && Utils.isNullOrEmpty(this.preposition);
    }
    
    constructor(prep, cas, typ = QuestionType.UNDEFINED) {
        this.question = QuestionType.UNDEFINED;
        this.preposition = null;
        this._case = null;
        this.spelling = null;
        this.spelling_ex = null;
        this.is_base = false;
        this.is_abstract = false;
        this.subquestions = null;
        this.preposition = prep;
        this._case = cas;
        this.question = typ;
        if (prep !== null) {
            if (cas.is_genitive) 
                this.spelling = (prep.toLowerCase() + " чего");
            else if (cas.is_dative) 
                this.spelling = (prep.toLowerCase() + " чему");
            else if (cas.is_accusative) 
                this.spelling = (prep.toLowerCase() + " что");
            else if (cas.is_instrumental) 
                this.spelling = (prep.toLowerCase() + " чем");
            else if (cas.is_prepositional) 
                this.spelling = (prep.toLowerCase() + " чём");
            this.spelling_ex = this.spelling;
            if (typ === QuestionType.WHEN) 
                this.spelling_ex = (this.spelling + "/когда");
            else if (typ === QuestionType.WHERE) 
                this.spelling_ex = (this.spelling + "/где");
            else if (typ === QuestionType.WHEREFROM) 
                this.spelling_ex = (this.spelling + "/откуда");
            else if (typ === QuestionType.WHERETO) 
                this.spelling_ex = (this.spelling + "/куда");
        }
        else if (cas !== null) {
            if (cas.is_nominative) {
                this.spelling = "кто";
                this.spelling_ex = "кто/что";
            }
            else if (cas.is_genitive) {
                this.spelling = "чего";
                this.spelling_ex = "кого/чего";
            }
            else if (cas.is_dative) {
                this.spelling = "чему";
                this.spelling_ex = "кому/чему";
            }
            else if (cas.is_accusative) {
                this.spelling = "что";
                this.spelling_ex = "кого/что";
            }
            else if (cas.is_instrumental) {
                this.spelling = "чем";
                this.spelling_ex = "кем/чем";
            }
        }
        else if (typ === QuestionType.WHATTODO) 
            this.spelling = (this.spelling_ex = "что делать");
        else if (typ === QuestionType.WHEN) 
            this.spelling = (this.spelling_ex = "когда");
        else if (typ === QuestionType.WHERE) 
            this.spelling = (this.spelling_ex = "где");
        else if (typ === QuestionType.WHEREFROM) 
            this.spelling = (this.spelling_ex = "откуда");
        else if (typ === QuestionType.WHERETO) 
            this.spelling = (this.spelling_ex = "куда");
    }
    
    static initialize() {
        if (ControlModelQuestion.ITEMS !== null) 
            return;
        ControlModelQuestion.ITEMS = new Array();
        for (const s of ["ИЗ", "ОТ", "С", "ИЗНУТРИ"]) {
            ControlModelQuestion.ITEMS.push(new ControlModelQuestion(s, MorphCase.GENITIVE, QuestionType.WHEREFROM));
        }
        ControlModelQuestion.ITEMS.push(new ControlModelQuestion("В", MorphCase.ACCUSATIVE, QuestionType.WHERETO));
        ControlModelQuestion.ITEMS.push(new ControlModelQuestion("НА", MorphCase.ACCUSATIVE, QuestionType.WHERETO));
        ControlModelQuestion.ITEMS.push(new ControlModelQuestion("ПО", MorphCase.ACCUSATIVE, QuestionType.WHERETO));
        ControlModelQuestion.ITEMS.push(new ControlModelQuestion("К", MorphCase.DATIVE, QuestionType.WHERETO));
        ControlModelQuestion.ITEMS.push(new ControlModelQuestion("НАВСТРЕЧУ", MorphCase.DATIVE, QuestionType.WHERETO));
        ControlModelQuestion.ITEMS.push(new ControlModelQuestion("ДО", MorphCase.GENITIVE, QuestionType.WHERETO));
        for (const s of ["У", "ОКОЛО", "ВОКРУГ", "ВОЗЛЕ", "ВБЛИЗИ", "МИМО", "ПОЗАДИ", "ВПЕРЕДИ", "ВГЛУБЬ", "ВДОЛЬ", "ВНЕ", "КРОМЕ", "МЕЖДУ", "НАПРОТИВ", "ПОВЕРХ", "ПОДЛЕ", "ПОПЕРЕК", "ПОСЕРЕДИНЕ", "СВЕРХ", "СРЕДИ", "СНАРУЖИ", "ВНУТРИ"]) {
            ControlModelQuestion.ITEMS.push(new ControlModelQuestion(s, MorphCase.GENITIVE, QuestionType.WHERE));
        }
        for (const s of ["ПАРАЛЛЕЛЬНО"]) {
            ControlModelQuestion.ITEMS.push(new ControlModelQuestion(s, MorphCase.DATIVE, QuestionType.WHERE));
        }
        for (const s of ["СКВОЗЬ", "ЧЕРЕЗ", "ПОД"]) {
            ControlModelQuestion.ITEMS.push(new ControlModelQuestion(s, MorphCase.ACCUSATIVE, QuestionType.WHERE));
        }
        for (const s of ["МЕЖДУ", "НАД", "ПОД", "ПЕРЕД", "ЗА"]) {
            ControlModelQuestion.ITEMS.push(new ControlModelQuestion(s, MorphCase.INSTRUMENTAL, QuestionType.WHERE));
        }
        for (const s of ["В", "НА", "ПРИ"]) {
            ControlModelQuestion.ITEMS.push(new ControlModelQuestion(s, MorphCase.PREPOSITIONAL, QuestionType.WHERE));
        }
        ControlModelQuestion.ITEMS.push(new ControlModelQuestion("ПРЕЖДЕ", MorphCase.GENITIVE, QuestionType.WHEN));
        ControlModelQuestion.ITEMS.push(new ControlModelQuestion("ПОСЛЕ", MorphCase.GENITIVE, QuestionType.WHEN));
        ControlModelQuestion.ITEMS.push(new ControlModelQuestion("НАКАНУНЕ", MorphCase.GENITIVE, QuestionType.WHEN));
        ControlModelQuestion.ITEMS.push(new ControlModelQuestion("СПУСТЯ", MorphCase.ACCUSATIVE, QuestionType.WHEN));
        for (const s of ["БЕЗ", "ДЛЯ", "РАДИ", "ИЗЗА", "ВВИДУ", "ВЗАМЕН", "ВМЕСТО", "ПРОТИВ", "СВЫШЕ", "ВСЛЕДСТВИЕ", "ПОМИМО", "ПОСРЕДСТВОМ"]) {
            ControlModelQuestion.ITEMS.push(new ControlModelQuestion(s, MorphCase.GENITIVE));
        }
        for (const s of ["ПО", "ПОДОБНО", "СОГЛАСНО", "СООТВЕТСТВЕННО", "СОРАЗМЕРНО", "ВОПРЕКИ"]) {
            ControlModelQuestion.ITEMS.push(new ControlModelQuestion(s, MorphCase.DATIVE));
        }
        for (const s of ["ПРО", "О", "ЗА", "ВКЛЮЧАЯ", "С"]) {
            ControlModelQuestion.ITEMS.push(new ControlModelQuestion(s, MorphCase.ACCUSATIVE));
        }
        for (const s of ["С"]) {
            ControlModelQuestion.ITEMS.push(new ControlModelQuestion(s, MorphCase.INSTRUMENTAL));
        }
        for (const s of ["О", "ПО"]) {
            ControlModelQuestion.ITEMS.push(new ControlModelQuestion(s, MorphCase.PREPOSITIONAL));
        }
        for (let i = 0; i < ControlModelQuestion.ITEMS.length; i++) {
            for (let j = 0; j < (ControlModelQuestion.ITEMS.length - 1); j++) {
                if (ControlModelQuestion.ITEMS[j].compare_to(ControlModelQuestion.ITEMS[j + 1]) > 0) {
                    let it = ControlModelQuestion.ITEMS[j];
                    ControlModelQuestion.ITEMS[j] = ControlModelQuestion.ITEMS[j + 1];
                    ControlModelQuestion.ITEMS[j + 1] = it;
                }
            }
        }
        ControlModelQuestion.ITEMS.splice(0, 0, (ControlModelQuestion.BASE_NOMINATIVE = ControlModelQuestion._new2955(null, MorphCase.NOMINATIVE, true)));
        ControlModelQuestion.ITEMS.splice(1, 0, (ControlModelQuestion.BASE_GENETIVE = ControlModelQuestion._new2955(null, MorphCase.GENITIVE, true)));
        ControlModelQuestion.ITEMS.splice(2, 0, (ControlModelQuestion.BASE_ACCUSATIVE = ControlModelQuestion._new2955(null, MorphCase.ACCUSATIVE, true)));
        ControlModelQuestion.ITEMS.splice(3, 0, (ControlModelQuestion.BASE_INSTRUMENTAL = ControlModelQuestion._new2955(null, MorphCase.INSTRUMENTAL, true)));
        ControlModelQuestion.ITEMS.splice(4, 0, (ControlModelQuestion.DATIVE = new ControlModelQuestion(null, MorphCase.DATIVE)));
        ControlModelQuestion.ITEMS.splice(5, 0, new ControlModelQuestion(null, null, QuestionType.WHATTODO));
        ControlModelQuestion.ITEMS.splice(6, 0, ControlModelQuestion._new2959(null, null, QuestionType.WHERE, true));
        ControlModelQuestion.ITEMS.splice(7, 0, ControlModelQuestion._new2959(null, null, QuestionType.WHERETO, true));
        ControlModelQuestion.ITEMS.splice(8, 0, ControlModelQuestion._new2959(null, null, QuestionType.WHEREFROM, true));
        ControlModelQuestion.ITEMS.splice(9, 0, ControlModelQuestion._new2959(null, null, QuestionType.WHEN, true));
        ControlModelQuestion.m_hash_by_spel = new Hashtable();
        ControlModelQuestion.m_hash_by_type = new Hashtable();
        for (const it of ControlModelQuestion.ITEMS) {
            ControlModelQuestion.m_hash_by_spel.put(it.spelling, it);
            if (it.question !== QuestionType.UNDEFINED) {
                let li = [ ];
                let wrapli2963 = new RefOutArgWrapper();
                let inoutres2964 = ControlModelQuestion.m_hash_by_type.tryGetValue(it.question, wrapli2963);
                li = wrapli2963.value;
                if (!inoutres2964) 
                    ControlModelQuestion.m_hash_by_type.put(it.question, (li = new Array()));
                li.push(it);
            }
        }
        for (const a of ControlModelQuestion.ITEMS) {
            if (a.is_abstract) {
                for (const q of ControlModelQuestion.ITEMS) {
                    if (!q.is_abstract && q.question === a.question) {
                        if (a.subquestions === null) 
                            a.subquestions = new Array();
                        a.subquestions.push(q);
                    }
                }
            }
        }
    }
    
    compare_to(other) {
        let i = Utils.compareStrings(this.preposition, other.preposition, false);
        if (i !== 0) 
            return i;
        if (this._cas_rank() < other._cas_rank()) 
            return -1;
        if (this._cas_rank() > other._cas_rank()) 
            return 1;
        return 0;
    }
    
    _cas_rank() {
        if (this._case.is_genitive) 
            return 1;
        if (this._case.is_dative) 
            return 2;
        if (this._case.is_accusative) 
            return 3;
        if (this._case.is_instrumental) 
            return 4;
        if (this._case.is_prepositional) 
            return 5;
        return 0;
    }
    
    static find_by_spel(spel) {
        let res = null;
        let wrapres2965 = new RefOutArgWrapper();
        let inoutres2966 = ControlModelQuestion.m_hash_by_spel.tryGetValue(spel, wrapres2965);
        res = wrapres2965.value;
        if (!inoutres2966) 
            return null;
        return res;
    }
    
    static find_by_prep_case(prep, cas) {
        if (Utils.isNullOrEmpty(prep)) 
            prep = null;
        for (const it of ControlModelQuestion.ITEMS) {
            if (it.preposition === prep && MorphCase.ooEq(it._case, cas)) 
                return it;
        }
        return null;
    }
    
    static find_by_type(ty) {
        for (const it of ControlModelQuestion.ITEMS) {
            if (it.question === ty) 
                return it;
        }
        return null;
    }
    
    static find_list_by_type(ty) {
        if (ControlModelQuestion.m_hash_by_type.containsKey(ty)) 
            return ControlModelQuestion.m_hash_by_type.get(ty);
        return null;
    }
    
    static _new2955(_arg1, _arg2, _arg3) {
        let res = new ControlModelQuestion(_arg1, _arg2);
        res.is_base = _arg3;
        return res;
    }
    
    static _new2959(_arg1, _arg2, _arg3, _arg4) {
        let res = new ControlModelQuestion(_arg1, _arg2, _arg3);
        res.is_abstract = _arg4;
        return res;
    }
    
    static static_constructor() {
        ControlModelQuestion.BASE_NOMINATIVE = null;
        ControlModelQuestion.BASE_GENETIVE = null;
        ControlModelQuestion.BASE_ACCUSATIVE = null;
        ControlModelQuestion.BASE_INSTRUMENTAL = null;
        ControlModelQuestion.DATIVE = null;
        ControlModelQuestion.ITEMS = null;
        ControlModelQuestion.m_hash_by_spel = null;
        ControlModelQuestion.m_hash_by_type = null;
    }
}


ControlModelQuestion.static_constructor();

module.exports = ControlModelQuestion
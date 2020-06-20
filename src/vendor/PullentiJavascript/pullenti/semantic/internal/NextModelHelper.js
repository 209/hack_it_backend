/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");

const QuestionType = require("./../utils/QuestionType");
const MorphCase = require("./../../morph/MorphCase");
const NextModelItem = require("./NextModelItem");

class NextModelHelper {
    
    static initialize() {
        if (NextModelHelper.ITEMS !== null) 
            return;
        NextModelHelper.ITEMS = new Array();
        NextModelHelper.ITEMS.push(new NextModelItem("", MorphCase.NOMINATIVE));
        NextModelHelper.ITEMS.push(new NextModelItem("", MorphCase.GENITIVE));
        NextModelHelper.ITEMS.push(new NextModelItem("", MorphCase.DATIVE));
        NextModelHelper.ITEMS.push(new NextModelItem("", MorphCase.ACCUSATIVE));
        NextModelHelper.ITEMS.push(new NextModelItem("", MorphCase.INSTRUMENTAL));
        NextModelHelper.ITEMS.push(new NextModelItem("", MorphCase.PREPOSITIONAL));
        for (const s of ["ИЗ", "ОТ", "С", "ИЗНУТРИ"]) {
            NextModelHelper.ITEMS.push(new NextModelItem(s, MorphCase.GENITIVE, null, QuestionType.WHEREFROM));
        }
        NextModelHelper.ITEMS.push(new NextModelItem("В", MorphCase.ACCUSATIVE, null, QuestionType.WHERETO));
        NextModelHelper.ITEMS.push(new NextModelItem("НА", MorphCase.ACCUSATIVE, null, QuestionType.WHERETO));
        NextModelHelper.ITEMS.push(new NextModelItem("ПО", MorphCase.ACCUSATIVE, null, QuestionType.WHERETO));
        NextModelHelper.ITEMS.push(new NextModelItem("К", MorphCase.DATIVE, null, QuestionType.WHERETO));
        NextModelHelper.ITEMS.push(new NextModelItem("НАВСТРЕЧУ", MorphCase.DATIVE, null, QuestionType.WHERETO));
        NextModelHelper.ITEMS.push(new NextModelItem("ДО", MorphCase.GENITIVE, null, QuestionType.WHERETO));
        for (const s of ["У", "ОКОЛО", "ВОКРУГ", "ВОЗЛЕ", "ВБЛИЗИ", "МИМО", "ПОЗАДИ", "ВПЕРЕДИ", "ВГЛУБЬ", "ВДОЛЬ", "ВНЕ", "КРОМЕ", "МЕЖДУ", "НАПРОТИВ", "ПОВЕРХ", "ПОДЛЕ", "ПОПЕРЕК", "ПОСЕРЕДИНЕ", "СВЕРХ", "СРЕДИ", "СНАРУЖИ", "ВНУТРИ"]) {
            NextModelHelper.ITEMS.push(new NextModelItem(s, MorphCase.GENITIVE, null, QuestionType.WHERE));
        }
        for (const s of ["ПАРАЛЛЕЛЬНО"]) {
            NextModelHelper.ITEMS.push(new NextModelItem(s, MorphCase.DATIVE, null, QuestionType.WHERE));
        }
        for (const s of ["СКВОЗЬ", "ЧЕРЕЗ", "ПОД"]) {
            NextModelHelper.ITEMS.push(new NextModelItem(s, MorphCase.ACCUSATIVE, null, QuestionType.WHERE));
        }
        for (const s of ["МЕЖДУ", "НАД", "ПОД", "ПЕРЕД", "ЗА"]) {
            NextModelHelper.ITEMS.push(new NextModelItem(s, MorphCase.INSTRUMENTAL, null, QuestionType.WHERE));
        }
        for (const s of ["В", "НА", "ПРИ"]) {
            NextModelHelper.ITEMS.push(new NextModelItem(s, MorphCase.PREPOSITIONAL, null, QuestionType.WHERE));
        }
        NextModelHelper.ITEMS.push(new NextModelItem("ПРЕЖДЕ", MorphCase.GENITIVE, null, QuestionType.WHEN));
        NextModelHelper.ITEMS.push(new NextModelItem("ПОСЛЕ", MorphCase.GENITIVE, null, QuestionType.WHEN));
        NextModelHelper.ITEMS.push(new NextModelItem("НАКАНУНЕ", MorphCase.GENITIVE, null, QuestionType.WHEN));
        NextModelHelper.ITEMS.push(new NextModelItem("СПУСТЯ", MorphCase.ACCUSATIVE, null, QuestionType.WHEN));
        for (const s of ["БЕЗ", "ДЛЯ", "РАДИ", "ИЗЗА", "ВВИДУ", "ВЗАМЕН", "ВМЕСТО", "ПРОТИВ", "СВЫШЕ", "ВСЛЕДСТВИЕ", "ПОМИМО", "ПОСРЕДСТВОМ"]) {
            NextModelHelper.ITEMS.push(new NextModelItem(s, MorphCase.GENITIVE));
        }
        for (const s of ["ПО", "ПОДОБНО", "СОГЛАСНО", "СООТВЕТСТВЕННО", "СОРАЗМЕРНО", "ВОПРЕКИ"]) {
            NextModelHelper.ITEMS.push(new NextModelItem(s, MorphCase.DATIVE));
        }
        for (const s of ["ПРО", "О", "ЗА", "ВКЛЮЧАЯ", "С"]) {
            NextModelHelper.ITEMS.push(new NextModelItem(s, MorphCase.ACCUSATIVE));
        }
        for (const s of ["С"]) {
            NextModelHelper.ITEMS.push(new NextModelItem(s, MorphCase.INSTRUMENTAL));
        }
        for (const s of ["О", "ПО"]) {
            NextModelHelper.ITEMS.push(new NextModelItem(s, MorphCase.PREPOSITIONAL));
        }
        for (let i = 0; i < NextModelHelper.ITEMS.length; i++) {
            for (let j = 0; j < (NextModelHelper.ITEMS.length - 1); j++) {
                if (NextModelHelper.ITEMS[j].compareTo(NextModelHelper.ITEMS[j + 1]) > 0) {
                    let it = NextModelHelper.ITEMS[j];
                    NextModelHelper.ITEMS[j] = NextModelHelper.ITEMS[j + 1];
                    NextModelHelper.ITEMS[j + 1] = it;
                }
            }
        }
        NextModelHelper.m_hash_by_spel = new Hashtable();
        for (const it of NextModelHelper.ITEMS) {
            NextModelHelper.m_hash_by_spel.put(it.spelling, it);
        }
    }
    
    static find_by_spel(spel) {
        let res = null;
        let wrapres2918 = new RefOutArgWrapper();
        let inoutres2919 = NextModelHelper.m_hash_by_spel.tryGetValue(spel, wrapres2918);
        res = wrapres2918.value;
        if (!inoutres2919) 
            return null;
        return res;
    }
    
    static static_constructor() {
        NextModelHelper.ITEMS = null;
        NextModelHelper.m_hash_by_spel = null;
    }
}


NextModelHelper.static_constructor();

module.exports = NextModelHelper
/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const TextsCompareType = require("./core/internal/TextsCompareType");

/**
 * Аннотация слитного фрагмента текста
 */
class TextAnnotation {
    
    constructor(begin = null, end = null, r = null) {
        this.sofa = null;
        this.begin_char = 0;
        this.end_char = 0;
        this.m_occurence_of = null;
        this.essential_for_occurence = false;
        this.tag = null;
        if (begin !== null) {
            this.sofa = begin.kit.sofa;
            this.begin_char = begin.begin_char;
        }
        if (end !== null) 
            this.end_char = end.end_char;
        this.occurence_of = r;
    }
    
    /**
     * [Get] Ссылка на сущность
     */
    get occurence_of() {
        return this.m_occurence_of;
    }
    /**
     * [Set] Ссылка на сущность
     */
    set occurence_of(value) {
        this.m_occurence_of = value;
        return value;
    }
    
    toString() {
        if (this.sofa === null) 
            return (String(this.begin_char) + ":" + this.end_char);
        return this.get_text();
    }
    
    /**
     * Извлечь фрагмент исходного текста, соответствующий аннотации
     * @return 
     */
    get_text() {
        if (this.sofa === null || this.sofa.text === null) 
            return null;
        return this.sofa.text.substring(this.begin_char, this.begin_char + (this.end_char + 1) - this.begin_char);
    }
    
    compare_with(loc) {
        if (loc.sofa !== this.sofa) 
            return TextsCompareType.NONCOMPARABLE;
        return this.compare(loc.begin_char, loc.end_char);
    }
    
    compare(pos, pos1) {
        if (this.end_char < pos) 
            return TextsCompareType.EARLY;
        if (pos1 < this.begin_char) 
            return TextsCompareType.LATER;
        if (this.begin_char === pos && this.end_char === pos1) 
            return TextsCompareType.EQUIVALENT;
        if (this.begin_char >= pos && this.end_char <= pos1) 
            return TextsCompareType.IN;
        if (pos >= this.begin_char && pos1 <= this.end_char) 
            return TextsCompareType.CONTAINS;
        return TextsCompareType.INTERSECT;
    }
    
    merge(loc) {
        if (loc.sofa !== this.sofa) 
            return;
        if (loc.begin_char < this.begin_char) 
            this.begin_char = loc.begin_char;
        if (this.end_char < loc.end_char) 
            this.end_char = loc.end_char;
        if (loc.essential_for_occurence) 
            this.essential_for_occurence = true;
    }
    
    static _new546(_arg1, _arg2, _arg3) {
        let res = new TextAnnotation();
        res.sofa = _arg1;
        res.begin_char = _arg2;
        res.end_char = _arg3;
        return res;
    }
    
    static _new723(_arg1, _arg2, _arg3, _arg4) {
        let res = new TextAnnotation();
        res.sofa = _arg1;
        res.begin_char = _arg2;
        res.end_char = _arg3;
        res.occurence_of = _arg4;
        return res;
    }
    
    static _new1588(_arg1, _arg2, _arg3, _arg4) {
        let res = new TextAnnotation();
        res.begin_char = _arg1;
        res.end_char = _arg2;
        res.occurence_of = _arg3;
        res.sofa = _arg4;
        return res;
    }
    
    static _new2848(_arg1, _arg2, _arg3) {
        let res = new TextAnnotation();
        res.begin_char = _arg1;
        res.end_char = _arg2;
        res.sofa = _arg3;
        return res;
    }
    
    static _new2850(_arg1, _arg2) {
        let res = new TextAnnotation();
        res.sofa = _arg1;
        res.occurence_of = _arg2;
        return res;
    }
}


module.exports = TextAnnotation
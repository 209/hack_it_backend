/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../../unisharp/StringBuilder");

const LanguageHelper = require("./../../morph/LanguageHelper");

/**
 * Элемент онтологического словаря
 */
class IntOntologyItem {
    
    constructor(r) {
        this.termins = new Array();
        this.m_canonic_text = null;
        this.typ = null;
        this.misc_attr = null;
        this.owner = null;
        this.referent = null;
        this.tag = null;
        this.referent = r;
    }
    
    /**
     * [Get] Каноноический текст
     */
    get canonic_text() {
        if (this.m_canonic_text === null && this.termins.length > 0) 
            this.m_canonic_text = this.termins[0].canonic_text;
        return (this.m_canonic_text != null ? this.m_canonic_text : "?");
    }
    /**
     * [Set] Каноноический текст
     */
    set canonic_text(value) {
        this.m_canonic_text = value;
        return value;
    }
    
    /**
     * В качестве канонического текста установить самый короткий среди терминов
     * @param ignore_termins_with_notnull_tags 
     */
    set_shortest_canonical_text(ignore_termins_with_notnull_tags = false) {
        this.m_canonic_text = null;
        for (const t of this.termins) {
            if (ignore_termins_with_notnull_tags && t.tag !== null) 
                continue;
            if (t.terms.length === 0) 
                continue;
            let s = t.canonic_text;
            if (!LanguageHelper.is_cyrillic_char(s[0])) 
                continue;
            if (this.m_canonic_text === null) 
                this.m_canonic_text = s;
            else if (s.length < this.m_canonic_text.length) 
                this.m_canonic_text = s;
        }
    }
    
    toString() {
        let res = new StringBuilder();
        if (this.typ !== null) 
            res.append(this.typ).append(": ");
        res.append(this.canonic_text);
        for (const t of this.termins) {
            let tt = t.toString();
            if (tt === this.canonic_text) 
                continue;
            res.append("; ");
            res.append(tt);
        }
        if (this.referent !== null) 
            res.append(" [").append(this.referent).append("]");
        return res.toString();
    }
}


module.exports = IntOntologyItem
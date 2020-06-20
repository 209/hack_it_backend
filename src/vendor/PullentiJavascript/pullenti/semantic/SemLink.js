/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../unisharp/StringBuilder");

const SemLinkType = require("./SemLinkType");

/**
 * Семантическая связь между объектами
 */
class SemLink {
    
    constructor(gr, src, tgt) {
        this.graph = null;
        this.typ = SemLinkType.UNDEFINED;
        this.m_source = null;
        this.m_target = null;
        this.alt_link = null;
        this.question = null;
        this.preposition = null;
        this.is_or = false;
        this.tag = null;
        this.graph = gr;
        this.m_source = src;
        this.m_target = tgt;
        src.links_from.push(this);
        tgt.links_to.push(this);
    }
    
    /**
     * [Get] Объект начала связи
     */
    get source() {
        return this.m_source;
    }
    
    /**
     * [Get] Объект конца связи
     */
    get target() {
        return this.m_target;
    }
    
    toString() {
        let tmp = new StringBuilder();
        if (this.alt_link !== null) 
            tmp.append("??? ");
        if (this.is_or) 
            tmp.append("OR ");
        if (this.typ !== SemLinkType.UNDEFINED) 
            tmp.append(this.typ.toString());
        if (this.question !== null) 
            tmp.append(" ").append(this.question).append("?");
        if (this.source !== null) 
            tmp.append(" ").append(this.source.toString());
        if (this.target !== null) 
            tmp.append(" -> ").append(this.target.toString());
        return tmp.toString();
    }
    
    static _new2972(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new SemLink(_arg1, _arg2, _arg3);
        res.typ = _arg4;
        res.question = _arg5;
        res.is_or = _arg6;
        res.preposition = _arg7;
        return res;
    }
}


module.exports = SemLink
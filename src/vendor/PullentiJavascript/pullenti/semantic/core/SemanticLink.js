/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../../unisharp/StringBuilder");

const SemanticRole = require("./SemanticRole");
const QuestionType = require("./../utils/QuestionType");

/**
 * Семантическая связь двух элементов
 */
class SemanticLink {
    
    constructor() {
        this.master = null;
        this.slave = null;
        this.slave_case = null;
        this.slave_preposition = null;
        this.question = null;
        this.qkind = QuestionType.UNDEFINED;
        this.role = SemanticRole.UNDEFINED;
        this.rank = 0;
    }
    
    toString() {
        let res = new StringBuilder();
        if (this.role !== SemanticRole.UNDEFINED) 
            res.append(String(this.role)).append(": ");
        if (this.rank > 0) 
            res.append(this.rank).append(" ");
        if (this.qkind !== QuestionType.UNDEFINED) 
            res.append(String(this.qkind)).append("? ");
        if (this.question !== null) 
            res.append(this.question).append("? ");
        res.append("[").append((this.master === null ? "?" : this.master.toString())).append("] <- [").append((this.slave === null ? "?" : this.slave.toString())).append("]");
        if (this.slave_preposition !== null) 
            res.append(", <").append(this.slave_preposition).append(">");
        if (this.slave_case !== null && !this.slave_case.is_undefined) 
            res.append(", ").append(this.slave_case);
        return res.toString();
    }
    
    compareTo(other) {
        if (this.rank > other.rank) 
            return -1;
        if (this.rank < other.rank) 
            return 1;
        return 0;
    }
    
    static _new2862(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new SemanticLink();
        res.master = _arg1;
        res.slave = _arg2;
        res.rank = _arg3;
        res.slave_case = _arg4;
        res.question = _arg5;
        return res;
    }
    
    static _new2863(_arg1, _arg2, _arg3) {
        let res = new SemanticLink();
        res.master = _arg1;
        res.slave = _arg2;
        res.rank = _arg3;
        return res;
    }
    
    static _new2864(_arg1, _arg2, _arg3) {
        let res = new SemanticLink();
        res.role = _arg1;
        res.rank = _arg2;
        res.slave_case = _arg3;
        return res;
    }
    
    static _new2865(_arg1, _arg2, _arg3) {
        let res = new SemanticLink();
        res.qkind = _arg1;
        res.rank = _arg2;
        res.question = _arg3;
        return res;
    }
    
    static _new2872(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new SemanticLink();
        res.role = _arg1;
        res.rank = _arg2;
        res.question = _arg3;
        res.qkind = _arg4;
        res.slave_case = _arg5;
        res.slave_preposition = _arg6;
        return res;
    }
}


module.exports = SemanticLink
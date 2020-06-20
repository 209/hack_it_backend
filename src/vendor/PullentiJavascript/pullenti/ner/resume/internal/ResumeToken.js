/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const MetaToken = require("./../../MetaToken");
const ResumeTokenType = require("./ResumeTokenType");

/**
 * Это для поддержки резюме
 */
class ResumeToken extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.typ = ResumeTokenType.UNDEFINED;
        this.refs = new Array();
    }
    
    static try_parse(t, prev = null) {
        if (t === null) 
            return null;
        return null;
    }
}


module.exports = ResumeToken
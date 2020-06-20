/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../../unisharp/Hashtable");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const MorphLang = require("./../../../morph/MorphLang");
const TitleItemTokenTypes = require("./TitleItemTokenTypes");

class PersonRelation {
    
    constructor() {
        this.person = null;
        this.coefs = new Hashtable();
    }
    
    get best() {
        let res = TitleItemTokenTypes.UNDEFINED;
        let max = 0;
        for (const v of this.coefs.entries) {
            if (v.value > max) {
                res = v.key;
                max = v.value;
            }
            else if (v.value === max) 
                res = TitleItemTokenTypes.UNDEFINED;
        }
        return res;
    }
    
    toString() {
        let res = new StringBuilder();
        res.append(this.person.to_string(true, MorphLang.UNKNOWN, 0)).append(" ").append(String(this.best));
        for (const v of this.coefs.entries) {
            res.append(" ").append(v.value).append("(").append(v.key.toString()).append(")");
        }
        return res.toString();
    }
    
    static _new2647(_arg1) {
        let res = new PersonRelation();
        res.person = _arg1;
        return res;
    }
}


module.exports = PersonRelation
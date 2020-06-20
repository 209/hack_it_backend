/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const MorphGender = require("./../../morph/MorphGender");
const MetaToken = require("./../MetaToken");
const MiscHelper = require("./MiscHelper");

/**
 * Представление предлогов (они могут быть из нескольких токенов, например,  
 *  "несмотря на", "в соответствии с"). 
 *  Получить можно с помощью PrepositionHelper.TryParse(t)
 */
class PrepositionToken extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.normal = null;
        this.next_case = null;
    }
    
    toString() {
        return this.normal;
    }
    
    get_normal_case_text(mc = null, single_number = false, gender = MorphGender.UNDEFINED, keep_chars = false) {
        let res = this.normal;
        if (keep_chars) {
            if (this.chars.is_all_lower) 
                res = res.toLowerCase();
            else if (this.chars.is_all_upper) {
            }
            else if (this.chars.is_capital_upper) 
                res = MiscHelper.convert_first_char_upper_and_other_lower(res);
        }
        return res;
    }
    
    static _new601(_arg1, _arg2, _arg3, _arg4) {
        let res = new PrepositionToken(_arg1, _arg2);
        res.normal = _arg3;
        res.next_case = _arg4;
        return res;
    }
}


module.exports = PrepositionToken
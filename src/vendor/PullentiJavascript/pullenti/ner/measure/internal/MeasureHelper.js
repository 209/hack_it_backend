/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const TextToken = require("./../../TextToken");

class MeasureHelper {
    
    static try_parse_double(val, f) {
        f.value = 0;
        if (Utils.isNullOrEmpty(val)) 
            return false;
        let inoutres1605 = Utils.tryParseFloat(Utils.replaceString(val, ',', '.'), f);
        if (val.indexOf(',') >= 0 && inoutres1605) 
            return true;
        let inoutres1604 = Utils.tryParseFloat(val, f);
        if (inoutres1604) 
            return true;
        return false;
    }
    
    static is_mult_char(t) {
        let tt = Utils.as(t, TextToken);
        if (tt === null) 
            return false;
        if (tt.length_char === 1) {
            if (tt.is_char_of("*xXхХ·×◦∙•")) 
                return true;
        }
        return false;
    }
    
    static is_mult_char_end(t) {
        let tt = Utils.as(t, TextToken);
        if (tt === null) 
            return false;
        let term = tt.term;
        if (term.endsWith("X") || term.endsWith("Х")) 
            return true;
        return false;
    }
}


module.exports = MeasureHelper
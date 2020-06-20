/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const MetaToken = require("./../ner/MetaToken");

/**
 * Количественная характеристика. 
 *  Тут предстоит очень много сделать (сложная модель диапазонов, составных значений и пр.)
 */
class Quantity extends MetaToken {
    
    constructor(_spelling, b, e) {
        super(b, e, null);
        this.spelling = null;
        this.spelling = _spelling;
    }
    
    toString() {
        return this.spelling;
    }
}


module.exports = Quantity
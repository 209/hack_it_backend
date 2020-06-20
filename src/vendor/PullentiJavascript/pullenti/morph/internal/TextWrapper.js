/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const UnicodeInfo = require("./UnicodeInfo");

/**
 * Введено для ускорения Питона!
 */
class TextWrapper {
    
    constructor(txt, to_upper) {
        this.chars = new Array();
        this.text = null;
        this.length = 0;
        this.text = txt;
        if (to_upper && txt !== null) 
            this.text = txt.toUpperCase();
        this.length = (txt === null ? 0 : txt.length);
        let _chars = UnicodeInfo.ALL_CHARS;
        if (txt !== null) {
            for (let i = 0; i < txt.length; i++) {
                this.chars.push(_chars[txt.charCodeAt(i)]);
            }
        }
    }
    
    toString() {
        return this.text.toString();
    }
}


module.exports = TextWrapper
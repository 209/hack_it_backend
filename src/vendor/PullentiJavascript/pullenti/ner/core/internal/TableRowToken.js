/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const MetaToken = require("./../../MetaToken");

/**
 * Токен - строка таблицы из текста
 */
class TableRowToken extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.cells = new Array();
        this.eor = false;
        this.last_row = false;
    }
    
    toString() {
        return ("ROW (" + this.cells.length + " cells) : " + this.get_source_text());
    }
}


module.exports = TableRowToken
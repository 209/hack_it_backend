/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const MetaToken = require("./../../MetaToken");

/**
 * Токен - ячейка таблицы
 */
class TableCellToken extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.col_span = 1;
        this.row_span = 1;
        this.eoc = false;
    }
    
    get lines() {
        let res = new Array();
        for (let t = this.begin_token; t !== null && t.end_char <= this.end_char; t = t.next) {
            let t0 = t;
            let t1 = t;
            for (; t !== null && t.end_char <= this.end_char; t = t.next) {
                t1 = t;
                if (t.is_newline_after) {
                    if ((t.next !== null && t.next.end_char <= this.end_char && t.next.chars.is_letter) && t.next.chars.is_all_lower && !t0.chars.is_all_lower) 
                        continue;
                    break;
                }
            }
            res.push(new TableCellToken(t0, t1));
            t = t1;
        }
        return res;
    }
    
    static _new533(_arg1, _arg2, _arg3, _arg4) {
        let res = new TableCellToken(_arg1, _arg2);
        res.row_span = _arg3;
        res.col_span = _arg4;
        return res;
    }
}


module.exports = TableCellToken
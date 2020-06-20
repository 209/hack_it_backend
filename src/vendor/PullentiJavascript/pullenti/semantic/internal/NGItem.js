/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../../unisharp/StringBuilder");

class NGItem {
    
    constructor() {
        this.source = null;
        this.order = 0;
        this.comma_before = false;
        this.comma_after = false;
        this.and_before = false;
        this.and_after = false;
        this.or_before = false;
        this.or_after = false;
        this.links = new Array();
        this.ind = 0;
    }
    
    get res_object() {
        return (this.source === null ? null : this.source.result);
    }
    
    toString() {
        let tmp = new StringBuilder();
        if (this.comma_before) 
            tmp.append("[,] ");
        else if (this.or_before) 
            tmp.append("[|] ");
        else if (this.and_before) 
            tmp.append("[&] ");
        tmp.append(this.source.toString());
        if (this.comma_after) 
            tmp.append(" [,]");
        else if (this.or_after) 
            tmp.append(" [|]");
        else if (this.and_after) 
            tmp.append(" [&]");
        return tmp.toString();
    }
    
    prepare() {
        this.links.splice(0, this.links.length);
    }
    
    static _new2920(_arg1) {
        let res = new NGItem();
        res.source = _arg1;
        return res;
    }
    
    static _new2921(_arg1, _arg2, _arg3, _arg4) {
        let res = new NGItem();
        res.source = _arg1;
        res.comma_before = _arg2;
        res.and_before = _arg3;
        res.or_before = _arg4;
        return res;
    }
    
    static _new2926(_arg1, _arg2) {
        let res = new NGItem();
        res.source = _arg1;
        res.order = _arg2;
        return res;
    }
}


module.exports = NGItem
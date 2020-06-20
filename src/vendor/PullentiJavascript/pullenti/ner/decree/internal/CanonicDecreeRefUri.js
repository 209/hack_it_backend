/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


class CanonicDecreeRefUri {
    
    constructor(txt) {
        this.ref = null;
        this.begin_char = 0;
        this.end_char = 0;
        this.is_diap = false;
        this.is_adopted = false;
        this.type_with_geo = null;
        this.text = null;
        this.text = txt;
    }
    
    toString() {
        return (this.text === null ? "?" : this.text.substring(this.begin_char, this.begin_char + (this.end_char + 1) - this.begin_char));
    }
    
    static _new831(_arg1, _arg2, _arg3, _arg4) {
        let res = new CanonicDecreeRefUri(_arg1);
        res.ref = _arg2;
        res.begin_char = _arg3;
        res.end_char = _arg4;
        return res;
    }
    
    static _new833(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new CanonicDecreeRefUri(_arg1);
        res.ref = _arg2;
        res.begin_char = _arg3;
        res.end_char = _arg4;
        res.is_diap = _arg5;
        return res;
    }
}


module.exports = CanonicDecreeRefUri
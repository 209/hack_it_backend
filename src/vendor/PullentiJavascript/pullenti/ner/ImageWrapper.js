/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


/**
 * Приходится работать через обёртку, так как некоторые реализации .NET не содержат System.Drawing 
 *  (например, для Андроида)
 */
class ImageWrapper {
    
    constructor() {
        this.id = null;
        this.content = null;
        this.image = null;
    }
    
    static _new2840(_arg1, _arg2) {
        let res = new ImageWrapper();
        res.id = _arg1;
        res.content = _arg2;
        return res;
    }
}


module.exports = ImageWrapper
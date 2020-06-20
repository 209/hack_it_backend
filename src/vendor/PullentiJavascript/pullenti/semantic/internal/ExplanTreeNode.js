/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");

const DerivateGroup = require("./../utils/DerivateGroup");

class ExplanTreeNode {
    
    constructor() {
        this.nodes = null;
        this.groups = null;
        this.lazy_pos = 0;
    }
    
    add_group(gr) {
        if (this.groups === null) {
            this.groups = gr;
            return;
        }
        let li = Utils.as(this.groups, Array);
        if (li === null) {
            li = new Array();
            if (this.groups instanceof DerivateGroup) 
                li.push(Utils.as(this.groups, DerivateGroup));
        }
        if (!li.includes(gr)) 
            li.push(gr);
        this.groups = li;
    }
}


module.exports = ExplanTreeNode
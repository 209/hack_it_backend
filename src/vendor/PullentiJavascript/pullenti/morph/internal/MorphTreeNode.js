/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


class MorphTreeNode {
    
    constructor() {
        this.nodes = null;
        this.rules = null;
        this.reverce_variants = null;
        this.lazy_pos = 0;
    }
    
    calc_total_nodes() {
        let res = 0;
        if (this.nodes !== null) {
            for (const v of this.nodes.entries) {
                res += (v.value.calc_total_nodes() + 1);
            }
        }
        return res;
    }
    
    toString() {
        return ("?" + " (" + this.calc_total_nodes() + ", " + (this.rules === null ? 0 : this.rules.length) + ")");
    }
}


module.exports = MorphTreeNode
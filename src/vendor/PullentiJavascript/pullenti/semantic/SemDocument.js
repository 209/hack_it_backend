/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ISemContainer = require("./ISemContainer");
const SemGraph = require("./SemGraph");

/**
 * Документ
 */
class SemDocument extends ISemContainer {
    
    constructor() {
        super();
        this.m_graph = new SemGraph();
        this.blocks = new Array();
    }
    
    /**
     * [Get] Семантические объекты уровня документа
     */
    get graph() {
        return this.m_graph;
    }
    
    get higher() {
        return null;
    }
    
    get begin_char() {
        return (this.blocks.length === 0 ? 0 : this.blocks[0].begin_char);
    }
    
    get end_char() {
        return (this.blocks.length === 0 ? 0 : this.blocks[this.blocks.length - 1].end_char);
    }
    
    merge_all_blocks() {
        if (this.blocks.length < 2) 
            return;
        for (let i = 1; i < this.blocks.length; i++) {
            this.blocks[0].merge_with(this.blocks[i]);
        }
        this.blocks.splice(1, this.blocks.length - 1);
    }
}


module.exports = SemDocument
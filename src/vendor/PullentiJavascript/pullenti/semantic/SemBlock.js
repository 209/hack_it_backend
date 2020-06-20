/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const StringBuilder = require("./../unisharp/StringBuilder");

const SemFraglink = require("./SemFraglink");
const ISemContainer = require("./ISemContainer");
const SemGraph = require("./SemGraph");
const SemDocument = require("./SemDocument");

/**
 * Блок документа (абзац)
 */
class SemBlock extends ISemContainer {
    
    constructor(blk) {
        super();
        this.m_graph = new SemGraph();
        this.m_higher = null;
        this.fragments = new Array();
        this.links = new Array();
        this.m_higher = blk;
    }
    
    get graph() {
        return this.m_graph;
    }
    
    get higher() {
        return this.m_higher;
    }
    
    get document() {
        return Utils.as(this.m_higher, SemDocument);
    }
    
    get begin_char() {
        return (this.fragments.length === 0 ? 0 : this.fragments[0].begin_char);
    }
    
    get end_char() {
        return (this.fragments.length === 0 ? 0 : this.fragments[this.fragments.length - 1].end_char);
    }
    
    add_fragments(blk) {
        for (const fr of blk.fragments) {
            fr.m_higher = this;
            this.fragments.push(fr);
        }
        for (const li of blk.links) {
            this.links.push(li);
        }
    }
    
    add_link(typ, src, tgt, ques = null) {
        for (const li of this.links) {
            if (li.typ === typ && li.source === src && li.target === tgt) 
                return li;
        }
        let res = SemFraglink._new2971(typ, src, tgt, ques);
        this.links.push(res);
        return res;
    }
    
    merge_with(blk) {
        this.graph.merge_with(blk.graph);
        for (const fr of blk.fragments) {
            this.fragments.push(fr);
            fr.m_higher = this;
        }
        for (const li of blk.links) {
            this.links.push(li);
        }
    }
    
    toString() {
        let tmp = new StringBuilder();
        for (const fr of this.fragments) {
            let spel = fr.spelling;
            if (spel.length > 20) 
                spel = spel.substring(0, 0 + 20) + "...";
            tmp.append("[").append(spel).append("] ");
        }
        return tmp.toString();
    }
}


module.exports = SemBlock
/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const StringBuilder = require("./../unisharp/StringBuilder");

const SemLink = require("./SemLink");

/**
 * Семантический граф
 */
class SemGraph {
    
    constructor() {
        this.owner = null;
        this.objects = new Array();
        this.links = new Array();
    }
    
    /**
     * [Get] Вышележащий граф (граф у вышележащего владельца)
     */
    get higher() {
        if (this.owner !== null && this.owner.higher !== null) 
            return this.owner.higher.graph;
        else 
            return null;
    }
    
    toString() {
        let tmp = new StringBuilder();
        tmp.append(this.objects.length).append("obj ").append(this.links.length).append("links: ");
        for (const li of this.links) {
            if (li !== this.links[0]) 
                tmp.append("; ");
            tmp.append(li);
            if (tmp.length > 100) 
                break;
        }
        if (this.links.length === 0) {
            for (const o of this.objects) {
                if (o !== this.objects[0]) 
                    tmp.append("; ");
                tmp.append(o);
                if (tmp.length > 100) 
                    break;
            }
        }
        return tmp.toString();
    }
    
    add_link(typ, src, tgt, ques = null, or = false, prep = null) {
        if (src === null || tgt === null) 
            return null;
        for (const li of src.graph.links) {
            if (li.typ === typ && li.source === src && li.target === tgt) 
                return li;
        }
        if (src.graph !== tgt.graph) {
            for (const li of tgt.graph.links) {
                if (li.typ === typ && li.source === src && li.target === tgt) 
                    return li;
            }
        }
        if (tgt.morph.normal_case === "ДОМ") {
        }
        let res = SemLink._new2972(this, src, tgt, typ, ques, or, prep);
        this.links.push(res);
        return res;
    }
    
    remove_link(li) {
        if (this.links.includes(li)) 
            Utils.removeItem(this.links, li);
        if (li.source.links_from.includes(li)) 
            Utils.removeItem(li.source.links_from, li);
        if (li.target.links_to.includes(li)) 
            Utils.removeItem(li.target.links_to, li);
        if (li.alt_link !== null && li.alt_link.alt_link === li) 
            li.alt_link.alt_link = null;
    }
    
    merge_with(gr) {
        for (const o of gr.objects) {
            if (!this.objects.includes(o)) {
                this.objects.push(o);
                o.graph = this;
            }
        }
        for (const li of gr.links) {
            if (!this.links.includes(li)) 
                this.links.push(li);
        }
    }
    
    remove_object(obj) {
        for (const li of obj.links_from) {
            if (li.target.links_to.includes(li)) 
                Utils.removeItem(li.target.links_to, li);
            if (this.links.includes(li)) 
                Utils.removeItem(this.links, li);
            else if (li.target.graph.links.includes(li)) 
                Utils.removeItem(li.target.graph.links, li);
        }
        for (const li of obj.links_to) {
            if (li.source.links_from.includes(li)) 
                Utils.removeItem(li.source.links_from, li);
            if (this.links.includes(li)) 
                Utils.removeItem(this.links, li);
            else if (li.source.graph.links.includes(li)) 
                Utils.removeItem(li.source.graph.links, li);
        }
        if (this.objects.includes(obj)) 
            Utils.removeItem(this.objects, obj);
    }
}


module.exports = SemGraph
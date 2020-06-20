/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../../unisharp/StringBuilder");
const XmlWriter = require("./../../unisharp/XmlWriter");
const XmlDocument = require("./../../unisharp/XmlDocument");

const ControlModelItemType = require("./ControlModelItemType");
const ControlModelItem = require("./ControlModelItem");

/**
 * Новая модель управления
 */
class ControlModel {
    
    constructor() {
        this.items = new Array();
        this.next_words = new Array();
    }
    
    find_item_by_typ(typ) {
        for (const it of this.items) {
            if (it.typ === typ) 
                return it;
        }
        return null;
    }
    
    find_item(w) {
        for (const it of this.items) {
            if (it.check(w)) 
                return it;
        }
        return null;
    }
    
    get is_empty() {
        for (const it of this.items) {
            if (!it.ignorable && it.links.length > 0) 
                return false;
        }
        if (this.next_words.length > 0) 
            return false;
        return true;
    }
    
    toString() {
        let res = new StringBuilder();
        for (const it of this.items) {
            if (it.ignorable) 
                continue;
            if (res.length > 0) 
                res.append("; ");
            res.append((it.typ === ControlModelItemType.WORD ? it.word : it.typ.toString())).append(" = ").append(it.links.length);
        }
        return res.toString();
    }
    
    correct(gr) {
        let has = false;
        let it = this.find_item_by_typ(ControlModelItemType.VERB);
        if (it !== null) 
            has = true;
        else if (this.find_item_by_typ(ControlModelItemType.REFLEXIVE) !== null) 
            has = true;
        if (has) {
            for (let i = this.items.length - 1; i >= 0; i--) {
                if (this.items[i].typ === ControlModelItemType.WORD) 
                    this.items[i].links.clear();
            }
        }
    }
    
    serialize_string() {
        let res = new StringBuilder();
        let xml = XmlWriter.createString(res, NULL); 
        try {
            xml.writeStartElement("model");
            for (const it of this.items) {
                if (!it.ignorable) 
                    it.serialize_xml(xml);
            }
            for (const w of this.next_words) {
                xml.writeElementString("nextword", w);
            }
            xml.writeEndElement();
        }
        finally {
            xml.close();
        }
        let i = res.toString().indexOf('>');
        if (i > 10 && res.charAt(1) === '?') 
            res.remove(0, i + 1);
        let str = res.toString();
        return str;
    }
    
    deserialize_string(str) {
        let doc = new XmlDocument();
        doc.loadXml(str);
        for (const x of doc.document_element.child_nodes) {
            if (x.local_name === "nextword") 
                this.next_words.push(x.inner_text);
            else if (x.local_name === "item") {
                let it = new ControlModelItem();
                it.deserialize_xml(x);
                this.items.push(it);
            }
        }
    }
}


module.exports = ControlModel
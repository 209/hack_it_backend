/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");
const StringBuilder = require("./../../unisharp/StringBuilder");

const QuestionType = require("./QuestionType");
const ControlModelQuestion = require("./ControlModelQuestion");
const ControlModelItemType = require("./ControlModelItemType");
const SemanticRole = require("./../core/SemanticRole");

class ControlModelItem {
    
    constructor() {
        this.typ = ControlModelItemType.WORD;
        this.word = null;
        this.links = new Hashtable();
        this.ignorable = false;
    }
    
    toString() {
        let res = new StringBuilder();
        if (this.ignorable) 
            res.append("IGNORE ");
        if (this.typ !== ControlModelItemType.WORD) 
            res.append(String(this.typ)).append(": ");
        else 
            res.append(((this.word != null ? this.word : "?"))).append(": ");
        for (const l_ of this.links.entries) {
            if (l_.value === SemanticRole.AGENT) 
                res.append("аг:");
            else if (l_.value === SemanticRole.PACIENT) 
                res.append("пац:");
            else if (l_.value === SemanticRole.INSTRUMENT) 
                res.append("инс:");
            res.append(l_.key.spelling).append("? ");
        }
        return res.toString();
    }
    
    check(w) {
        if (this.typ === ControlModelItemType.WORD) 
            return w.class0.is_noun && w.spelling === this.word;
        if (w.class0.is_verb) {
            if (this.typ === ControlModelItemType.REFLEXIVE) 
                return w.reflexive;
            if (this.typ === ControlModelItemType.VERB) 
                return !w.reflexive;
        }
        return false;
    }
    
    check_inf() {
        for (const kp of this.links.entries) {
            if (kp.key.preposition === null && kp.key.question === QuestionType.WHATTODO && kp.key._case === null) 
                return true;
        }
        return false;
    }
    
    serialize_xml(xml) {
        xml.writeStartElement("item");
        xml.writeAttributeString("typ", this.typ.toString().toUpperCase());
        if (this.word !== null) 
            xml.writeAttributeString("word", this.word);
        for (const li of this.links.entries) {
            xml.writeStartElement("li");
            xml.writeAttributeString("q", li.key.spelling);
            if (li.value !== SemanticRole.UNDEFINED) 
                xml.writeAttributeString("r", li.value.toString());
            xml.writeEndElement();
        }
        xml.writeEndElement();
    }
    
    deserialize_xml(xml) {
        for (const a of xml.attributes) {
            if (a.local_name === "word") 
                this.word = a.value;
            else if (a.local_name === "typ") {
                try {
                    this.typ = ControlModelItemType.of(a.value);
                } catch (ex2951) {
                }
            }
        }
        for (const x of xml.child_nodes) {
            if (x.local_name === "li") {
                let r = SemanticRole.UNDEFINED;
                let q = null;
                for (const a of x.attributes) {
                    if (a.local_name === "q") 
                        q = ControlModelQuestion.find_by_spel(a.value);
                    else if (a.local_name === "r") {
                        try {
                            r = SemanticRole.of(a.value);
                        } catch (ex2952) {
                        }
                    }
                }
                if (q !== null && !this.links.containsKey(q)) 
                    this.links.put(q, r);
            }
        }
    }
}


module.exports = ControlModelItem
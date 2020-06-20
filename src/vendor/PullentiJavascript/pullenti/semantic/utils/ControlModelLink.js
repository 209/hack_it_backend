/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");

const MorphCase = require("./../../morph/MorphCase");
const SemanticRole = require("./../core/SemanticRole");
const QuestionType = require("./QuestionType");

class ControlModelLink {
    
    toString() {
        if (this.role === SemanticRole.UNDEFINED) 
            return this.spelling;
        return (this.spelling + " (" + String(this.role) + ")");
    }
    
    constructor(prep, cas, spel = null, typ = QuestionType.UNDEFINED) {
        this.question = QuestionType.UNDEFINED;
        this.preposition = null;
        this._case = null;
        this.role = SemanticRole.UNDEFINED;
        this.spelling = null;
        this.preposition = prep;
        this._case = cas;
        this.spelling = spel;
        this.question = typ;
        if (spel !== null) 
            return;
        if (!Utils.isNullOrEmpty(prep)) {
            if (cas.is_genitive) 
                spel = (prep.toLowerCase() + " чего");
            else if (cas.is_dative) 
                spel = (prep.toLowerCase() + " чему");
            else if (cas.is_accusative) 
                spel = (prep.toLowerCase() + " что");
            else if (cas.is_instrumental) 
                spel = (prep.toLowerCase() + " чем");
            else if (cas.is_prepositional) 
                spel = (prep.toLowerCase() + " чём");
        }
        else {
            this.preposition = null;
            if (cas !== null) {
                if (cas.is_nominative) 
                    spel = "кто";
                else if (cas.is_genitive) 
                    spel = "чего";
                else if (cas.is_dative) 
                    spel = "чему";
                else if (cas.is_accusative) 
                    spel = "что";
                else if (cas.is_instrumental) 
                    spel = "чем";
                else if (cas.is_prepositional) 
                    spel = "чём";
            }
        }
        this.spelling = spel;
    }
    
    is_equals(li) {
        if (li.preposition !== this.preposition || MorphCase.ooNoteq(li._case, this._case)) 
            return false;
        if (li.preposition === null && ((li._case === null || li._case.is_undefined))) 
            return this.question === li.question;
        return true;
    }
    
    serialize_xml(xml) {
        xml.writeStartElement("li");
        if (this.spelling !== null) 
            xml.writeAttributeString("s", this.spelling);
        if (this.preposition !== null) 
            xml.writeAttributeString("p", this.preposition);
        if (this._case !== null && !this._case.is_undefined) 
            xml.writeAttributeString("c", this._case.toString());
        if (this.question !== QuestionType.UNDEFINED) 
            xml.writeAttributeString("q", this.question.toString().toUpperCase());
        if (this.role !== SemanticRole.UNDEFINED) 
            xml.writeAttributeString("r", this.role.toString().toUpperCase());
        xml.writeEndElement();
    }
    
    deserialize_xml(xml) {
        for (const a of xml.attributes) {
            if (a.local_name === "p") 
                this.preposition = a.value;
            else if (a.local_name === "c") 
                this._case = MorphCase.parse(a.value);
            else if (a.local_name === "s") 
                this.spelling = a.value;
            else if (a.local_name === "q") {
                try {
                    this.question = QuestionType.of(a.value);
                } catch (ex2953) {
                }
            }
            else if (a.local_name === "r") {
                try {
                    this.role = SemanticRole.of(a.value);
                } catch (ex2954) {
                }
            }
        }
    }
}


module.exports = ControlModelLink
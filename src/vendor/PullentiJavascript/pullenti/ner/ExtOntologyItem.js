/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const SerializerHelper = require("./core/internal/SerializerHelper");
const ProcessorService = require("./ProcessorService");

/**
 * Элемент внешней онтологии
 */
class ExtOntologyItem {
    
    constructor(caption = null) {
        this.ext_id = null;
        this.type_name = null;
        this.referent = null;
        this.refs = null;
        this.m_caption = null;
        this.m_caption = caption;
    }
    
    toString() {
        if (this.m_caption !== null) 
            return this.m_caption;
        else if (this.referent === null) 
            return (((this.type_name != null ? this.type_name : "?")) + ": ?");
        else {
            let res = this.referent.toString();
            if (this.referent.parent_referent !== null) {
                let str1 = this.referent.parent_referent.toString();
                if (!res.includes(str1)) 
                    res = res + "; " + str1;
            }
            return res;
        }
    }
    
    serialize(stream) {
        SerializerHelper.serialize_string(stream, (this.ext_id === null ? null : this.ext_id.toString()));
        SerializerHelper.serialize_string(stream, this.m_caption);
        if (this.refs === null) 
            SerializerHelper.serialize_int(stream, 0);
        else {
            SerializerHelper.serialize_int(stream, this.refs.length);
            let id = 1;
            for (const r of this.refs) {
                r.tag = id++;
            }
            for (const r of this.refs) {
                r.occurrence.splice(0, r.occurrence.length);
                SerializerHelper.serialize_string(stream, r.type_name);
                r.serialize(stream);
            }
        }
        this.referent.occurrence.splice(0, this.referent.occurrence.length);
        SerializerHelper.serialize_string(stream, this.type_name);
        this.referent.serialize(stream);
    }
    
    deserialize(stream) {
        this.ext_id = SerializerHelper.deserialize_string(stream);
        this.m_caption = SerializerHelper.deserialize_string(stream);
        let cou = SerializerHelper.deserialize_int(stream);
        if (cou > 0) {
            this.refs = new Array();
            for (; cou > 0; cou--) {
                let typ = SerializerHelper.deserialize_string(stream);
                let r = ProcessorService.create_referent(typ);
                r.deserialize(stream, this.refs, null);
                this.refs.push(r);
            }
        }
        this.type_name = SerializerHelper.deserialize_string(stream);
        this.referent = ProcessorService.create_referent(this.type_name);
        this.referent.deserialize(stream, this.refs, null);
    }
    
    static _new2800(_arg1, _arg2, _arg3) {
        let res = new ExtOntologyItem();
        res.ext_id = _arg1;
        res.referent = _arg2;
        res.type_name = _arg3;
        return res;
    }
}


module.exports = ExtOntologyItem
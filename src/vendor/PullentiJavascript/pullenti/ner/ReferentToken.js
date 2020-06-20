/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../unisharp/StringBuilder");

const SerializerHelper = require("./core/internal/SerializerHelper");
const MetaToken = require("./MetaToken");
const MorphCollection = require("./MorphCollection");
const TextAnnotation = require("./TextAnnotation");

/**
 * Токен, соответствующий сущности
 */
class ReferentToken extends MetaToken {
    
    constructor(entity, begin, end, _kit = null) {
        super(begin, end, _kit);
        this.referent = null;
        this.data = null;
        this.misc_attrs = 0;
        this.referent = entity;
        if (this.morph === null) 
            this.morph = new MorphCollection();
    }
    
    toString() {
        let res = new StringBuilder((this.referent === null ? "Null" : this.referent.toString()));
        if (this.morph !== null) 
            res.append(" ").append(this.morph.toString());
        return res.toString();
    }
    
    get is_referent() {
        return true;
    }
    
    get_referent() {
        return this.referent;
    }
    
    get_referents() {
        let res = new Array();
        if (this.referent !== null) 
            res.push(this.referent);
        let ri = super.get_referents();
        if (ri !== null) 
            res.splice(res.length, 0, ...ri);
        return res;
    }
    
    save_to_local_ontology() {
        if (this.data === null) 
            return;
        let r = this.data.register_referent(this.referent);
        this.data = null;
        if (r !== null) {
            this.referent = r;
            let anno = new TextAnnotation();
            anno.sofa = this.kit.sofa;
            anno.occurence_of = this.referent;
            anno.begin_char = this.begin_char;
            anno.end_char = this.end_char;
            this.referent.add_occurence(anno);
        }
    }
    
    set_default_local_onto(proc) {
        if (this.referent === null || this.kit === null || proc === null) 
            return;
        for (const a of proc.analyzers) {
            if (a.create_referent(this.referent.type_name) !== null) {
                this.data = this.kit.get_analyzer_data(a);
                break;
            }
        }
    }
    
    replace_referent(old_referent, new_referent) {
        if (this.referent === old_referent) 
            this.referent = new_referent;
        if (this.end_token === null) 
            return;
        for (let t = this.begin_token; t !== null; t = t.next) {
            if (t.end_char > this.end_char) 
                break;
            if (t instanceof ReferentToken) 
                (t).replace_referent(old_referent, new_referent);
            if (t === this.end_token) 
                break;
        }
    }
    
    serialize(stream) {
        super.serialize(stream);
        let id = 0;
        if (this.referent !== null && ((typeof this.referent.tag === 'number' || this.referent.tag instanceof Number))) 
            id = this.referent.tag;
        SerializerHelper.serialize_int(stream, id);
    }
    
    deserialize(stream, _kit, vers) {
        super.deserialize(stream, _kit, vers);
        let id = SerializerHelper.deserialize_int(stream);
        if (id > 0) 
            this.referent = _kit.entities[id - 1];
    }
    
    static _new116(_arg1, _arg2, _arg3, _arg4) {
        let res = new ReferentToken(_arg1, _arg2, _arg3);
        res.data = _arg4;
        return res;
    }
    
    static _new743(_arg1, _arg2, _arg3, _arg4) {
        let res = new ReferentToken(_arg1, _arg2, _arg3);
        res.morph = _arg4;
        return res;
    }
    
    static _new745(_arg1, _arg2, _arg3, _arg4) {
        let res = new ReferentToken(_arg1, _arg2, _arg3);
        res.tag = _arg4;
        return res;
    }
    
    static _new1268(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new ReferentToken(_arg1, _arg2, _arg3);
        res.morph = _arg4;
        res.data = _arg5;
        return res;
    }
    
    static _new2473(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new ReferentToken(_arg1, _arg2, _arg3);
        res.morph = _arg4;
        res.misc_attrs = _arg5;
        return res;
    }
    
    static _new2573(_arg1, _arg2, _arg3, _arg4) {
        let res = new ReferentToken(_arg1, _arg2, _arg3);
        res.misc_attrs = _arg4;
        return res;
    }
    
    static _new2583(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new ReferentToken(_arg1, _arg2, _arg3);
        res.morph = _arg4;
        res.tag = _arg5;
        return res;
    }
}


module.exports = ReferentToken
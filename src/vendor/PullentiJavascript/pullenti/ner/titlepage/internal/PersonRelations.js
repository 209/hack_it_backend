/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const PersonReferent = require("./../../person/PersonReferent");
const TitleItemTokenTypes = require("./TitleItemTokenTypes");
const TitlePageReferent = require("./../TitlePageReferent");
const PersonRelation = require("./PersonRelation");

class PersonRelations {
    
    constructor() {
        this.rels = new Array();
    }
    
    add(pers, typ, coef) {
        let r = null;
        for (const rr of this.rels) {
            if (rr.person === pers) {
                r = rr;
                break;
            }
        }
        if (r === null) 
            this.rels.push((r = PersonRelation._new2647(pers)));
        if (!r.coefs.containsKey(typ)) 
            r.coefs.put(typ, coef);
        else 
            r.coefs.put(typ, r.coefs.get(typ) + coef);
    }
    
    get_persons(typ) {
        let res = new Array();
        for (const v of this.rels) {
            if (v.best === typ) 
                res.push(v.person);
        }
        return res;
    }
    
    get rel_types() {
        let res = new Array();
        res.push(TitleItemTokenTypes.WORKER);
        res.push(TitleItemTokenTypes.BOSS);
        res.push(TitleItemTokenTypes.EDITOR);
        res.push(TitleItemTokenTypes.OPPONENT);
        res.push(TitleItemTokenTypes.CONSULTANT);
        res.push(TitleItemTokenTypes.ADOPT);
        res.push(TitleItemTokenTypes.TRANSLATE);
        return res;
    }
    
    get_attr_name_for_type(typ) {
        if (typ === TitleItemTokenTypes.WORKER) 
            return TitlePageReferent.ATTR_AUTHOR;
        if (typ === TitleItemTokenTypes.BOSS) 
            return TitlePageReferent.ATTR_SUPERVISOR;
        if (typ === TitleItemTokenTypes.EDITOR) 
            return TitlePageReferent.ATTR_EDITOR;
        if (typ === TitleItemTokenTypes.OPPONENT) 
            return TitlePageReferent.ATTR_OPPONENT;
        if (typ === TitleItemTokenTypes.CONSULTANT) 
            return TitlePageReferent.ATTR_CONSULTANT;
        if (typ === TitleItemTokenTypes.ADOPT) 
            return TitlePageReferent.ATTR_AFFIRMANT;
        if (typ === TitleItemTokenTypes.TRANSLATE) 
            return TitlePageReferent.ATTR_TRANSLATOR;
        return null;
    }
    
    calc_typ_from_attrs(pers) {
        for (const a of pers.slots) {
            if (a.type_name === PersonReferent.ATTR_ATTR) {
                let s = a.value.toString();
                if (s.includes("руководител")) 
                    return TitleItemTokenTypes.BOSS;
                if (s.includes("студент") || s.includes("слушател")) 
                    return TitleItemTokenTypes.WORKER;
                if (s.includes("редактор") || s.includes("рецензент")) 
                    return TitleItemTokenTypes.EDITOR;
                if (s.includes("консультант")) 
                    return TitleItemTokenTypes.CONSULTANT;
                if (s.includes("исполнитель")) 
                    return TitleItemTokenTypes.WORKER;
            }
        }
        return TitleItemTokenTypes.UNDEFINED;
    }
}


module.exports = PersonRelations
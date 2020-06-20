/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const MorphGender = require("./../../morph/MorphGender");
const SemObject = require("./../SemObject");
const MorphClass = require("./../../morph/MorphClass");
const SemObjectType = require("./../SemObjectType");
const SemLinkType = require("./../SemLinkType");
const MorphWordForm = require("./../../morph/MorphWordForm");
const AnaforHelper = require("./AnaforHelper");
const Token = require("./../../ner/Token");
const MetaToken = require("./../../ner/MetaToken");

class OptimizerHelper {
    
    static optimize(doc, pars) {
        for (const blk of doc.blocks) {
            for (const fr of blk.fragments) {
                OptimizerHelper._optimize_graph(fr.graph);
            }
            let objs = new Array();
            objs.splice(objs.length, 0, ...blk.graph.objects);
            for (const fr of blk.fragments) {
                objs.splice(objs.length, 0, ...fr.graph.objects);
            }
            for (const fr of blk.fragments) {
                for (let i = fr.graph.links.length - 1; i >= 0; i--) {
                    let li = fr.graph.links[i];
                    if (!objs.includes(li.source) || !objs.includes(li.target)) 
                        fr.graph.remove_link(li);
                }
                OptimizerHelper._process_participles(fr.graph);
                OptimizerHelper._process_links(fr.graph);
            }
            OptimizerHelper._sort_objects(objs);
            OptimizerHelper._process_pointers(objs);
            OptimizerHelper._process_formulas(objs);
            if (pars.dont_create_anafor) {
            }
            else {
                AnaforHelper.process_anafors(objs);
                for (const fr of blk.fragments) {
                    OptimizerHelper._collapse_anafors(fr.graph);
                }
            }
        }
    }
    
    static _optimize_graph(gr) {
        for (const o of gr.objects) {
            OptimizerHelper._optimize_tokens(o);
        }
        OptimizerHelper._sort_objects(gr.objects);
    }
    
    static _compare_toks(t1, t2) {
        if (t1.begin_char < t2.begin_char) 
            return -1;
        if (t1.begin_char > t2.begin_char) 
            return 1;
        if (t1.end_char < t2.end_char) 
            return -1;
        if (t1.end_char > t2.end_char) 
            return 1;
        return 0;
    }
    
    static _optimize_tokens(o) {
        for (let i = 0; i < o.tokens.length; i++) {
            let ch = false;
            for (let j = 0; j < (o.tokens.length - 1); j++) {
                if (OptimizerHelper._compare_toks(o.tokens[j], o.tokens[j + 1]) > 0) {
                    let t = o.tokens[j];
                    o.tokens[j] = o.tokens[j + 1];
                    o.tokens[j + 1] = t;
                    ch = true;
                }
            }
            if (!ch) 
                break;
        }
        for (let i = 0; i < (o.tokens.length - 1); i++) {
            if (o.tokens[i].end_token.next === o.tokens[i + 1].begin_token) {
                o.tokens[i] = new MetaToken(o.tokens[i].begin_token, o.tokens[i + 1].end_token);
                o.tokens.splice(i + 1, 1);
                i--;
            }
        }
    }
    
    static _sort_objects(objs) {
        for (let i = 0; i < objs.length; i++) {
            let ch = false;
            for (let j = 0; j < (objs.length - 1); j++) {
                if (objs[j].compareTo(objs[j + 1]) > 0) {
                    let o = objs[j];
                    objs[j] = objs[j + 1];
                    objs[j + 1] = o;
                    ch = true;
                }
            }
            if (!ch) 
                break;
        }
    }
    
    static _process_participles(gr) {
        let ret = false;
        for (let i = 0; i < gr.objects.length; i++) {
            let obj = gr.objects[i];
            if (obj.typ !== SemObjectType.PARTICIPLE) 
                continue;
            let own = null;
            let has = false;
            for (const li of obj.links_to) {
                if (li.typ === SemLinkType.PARTICIPLE) 
                    own = li;
                else 
                    has = true;
            }
            if (!has) 
                continue;
            if (own === null) {
                let dum = SemObject._new2927(gr, SemObjectType.NOUN);
                if (obj.morph !== null) 
                    dum.morph = MorphWordForm._new2928(MorphClass.NOUN, obj.morph.number, obj.morph.gender, obj.morph._case);
                gr.objects.push(dum);
                own = gr.add_link(SemLinkType.PARTICIPLE, dum, obj, "какой", false, null);
                ret = true;
            }
            for (let j = obj.links_to.length - 1; j >= 0; j--) {
                let li = obj.links_to[j];
                if (li.typ === SemLinkType.PARTICIPLE) 
                    continue;
                let exi = false;
                for (const ll of li.source.links_from) {
                    if (ll.target === own.source) 
                        exi = true;
                }
                if (exi) 
                    gr.remove_link(li);
                else {
                    obj.links_to.splice(j, 1);
                    li.m_target = own.source;
                }
                ret = true;
            }
        }
        return ret;
    }
    
    static _process_links(gr) {
        let ret = false;
        for (let i = 0; i < gr.objects.length; i++) {
            let obj = gr.objects[i];
            for (let j = obj.links_from.length - 1; j >= 0; j--) {
                let li = obj.links_from[j];
                if (li.typ !== SemLinkType.PACIENT) 
                    continue;
                let exi = false;
                for (const ll of obj.links_from) {
                    if (ll !== li && ll.typ === SemLinkType.AGENT && ll.target === li.target) 
                        exi = true;
                }
                if (exi) {
                    if (obj.begin_char > li.target.begin_char) {
                        gr.remove_link(li);
                        ret = true;
                    }
                }
            }
        }
        return ret;
    }
    
    static _collapse_anafors(gr) {
        let ret = false;
        for (let i = 0; i < gr.objects.length; i++) {
            let obj = gr.objects[i];
            if (obj.typ === SemObjectType.PERSONALPRONOUN || obj.morph.normal_full === "КОТОРЫЙ") {
            }
            else 
                continue;
            if (obj.attrs.length > 0 || obj.quantity !== null) 
                continue;
            if (obj.links_from.length === 1 && obj.links_from[0].typ === SemLinkType.ANAFOR) {
            }
            else if (obj.links_from.length === 2 && obj.links_from[0].typ === SemLinkType.ANAFOR && obj.links_from[0].alt_link === obj.links_from[1]) {
            }
            else 
                continue;
            let alink = obj.links_from[0];
            for (const li of obj.links_to) {
                let nli = gr.add_link(li.typ, li.source, alink.target, li.question, li.is_or, li.preposition);
                if (alink.alt_link !== null) {
                    let nli2 = gr.add_link(li.typ, li.source, alink.alt_link.target, li.question, li.is_or, li.preposition);
                    nli2.alt_link = nli;
                    nli.alt_link = nli2;
                }
            }
            gr.remove_object(obj);
            i--;
            ret = true;
        }
        return ret;
    }
    
    static _process_formulas(objs) {
        let ret = false;
        for (let i = 0; i < objs.length; i++) {
            let o = objs[i];
            if (o.typ !== SemObjectType.NOUN || !o.is_value("РАЗ", SemObjectType.UNDEFINED)) 
                continue;
            if (o.quantity === null) 
                continue;
            if (o.links_from.length === 0 && o.links_to.length === 1) {
            }
            else 
                continue;
            let frm = o.links_to[0].source;
            for (let k = 0; k < 5; k++) {
                let brek = false;
                for (const li of frm.links_from) {
                    if (((li.typ === SemLinkType.DETAIL || li.typ === SemLinkType.PACIENT)) && li.target !== o) {
                        if (o.begin_char > frm.end_char && (o.begin_char < li.target.begin_char)) {
                            brek = true;
                            o.graph.add_link(SemLinkType.DETAIL, o, li.target, "чего", false, null);
                            o.graph.remove_link(li);
                        }
                        else 
                            frm = li.target;
                        break;
                    }
                }
                if (brek) 
                    break;
            }
        }
        return ret;
    }
    
    static _process_pointers(objs) {
        let ret = false;
        for (let i = 0; i < objs.length; i++) {
            let o = objs[i];
            if (o.typ !== SemObjectType.NOUN) 
                continue;
            if (o.quantity !== null && o.quantity.spelling === "1") {
            }
            else 
                continue;
            if (o.links_from.length > 0) 
                continue;
            let ok = false;
            for (let j = i - 1; j >= 0; j--) {
                let oo = objs[j];
                if (oo.typ !== SemObjectType.NOUN) 
                    continue;
                if (oo.morph.normal_full !== o.morph.normal_full) 
                    continue;
                if (oo.quantity !== null && oo.quantity.spelling !== "1") {
                    ok = true;
                    break;
                }
            }
            if (!ok) {
                for (let j = i + 1; j < objs.length; j++) {
                    let oo = objs[j];
                    if (oo.typ !== SemObjectType.NOUN) 
                        continue;
                    if (oo.morph.normal_full !== o.morph.normal_full) 
                        continue;
                    if (oo.find_from_object("ДРУГОЙ", SemLinkType.UNDEFINED, SemObjectType.UNDEFINED) !== null || oo.find_from_object("ВТОРОЙ", SemLinkType.UNDEFINED, SemObjectType.UNDEFINED) !== null) {
                        ok = true;
                        break;
                    }
                }
            }
            if (!ok) 
                continue;
            let first = SemObject._new2927(o.graph, SemObjectType.ADJECTIVE);
            first.tokens.push(o.tokens[0]);
            first.morph.normal_full = "ПЕРВЫЙ";
            first.morph.normal_case = ((((o.morph.gender.value()) & (MorphGender.FEMINIE.value()))) !== (MorphGender.UNDEFINED.value()) ? "ПЕРВАЯ" : ((((o.morph.gender.value()) & (MorphGender.NEUTER.value()))) !== (MorphGender.UNDEFINED.value()) ? "ПЕРВОЕ" : "ПЕРВЫЙ"));
            first.morph.gender = o.morph.gender;
            o.graph.objects.push(first);
            o.graph.add_link(SemLinkType.DETAIL, o, first, "какой", false, null);
            o.quantity = null;
            ret = true;
        }
        for (let i = 0; i < objs.length; i++) {
            let o = objs[i];
            if (o.typ !== SemObjectType.NOUN) 
                continue;
            if (o.quantity !== null && o.quantity.spelling === "1") {
            }
            else 
                continue;
            let other = o.find_from_object("ДРУГОЙ", SemLinkType.UNDEFINED, SemObjectType.UNDEFINED);
            if (other === null) 
                continue;
            let ok = false;
            for (let j = i - 1; j >= 0; j--) {
                let oo = objs[j];
                if (oo.typ !== SemObjectType.NOUN) 
                    continue;
                if (oo.morph.normal_full !== o.morph.normal_full) 
                    continue;
                if (oo.find_from_object("ПЕРВЫЙ", SemLinkType.UNDEFINED, SemObjectType.UNDEFINED) !== null) {
                    ok = true;
                    break;
                }
            }
            if (ok) {
                other.morph.normal_full = "ВТОРОЙ";
                other.morph.normal_case = ((((o.morph.gender.value()) & (MorphGender.FEMINIE.value()))) !== (MorphGender.UNDEFINED.value()) ? "ВТОРАЯ" : ((((o.morph.gender.value()) & (MorphGender.NEUTER.value()))) !== (MorphGender.UNDEFINED.value()) ? "ВТОРОЕ" : "ВТОРОЙ"));
            }
        }
        return ret;
    }
}


module.exports = OptimizerHelper
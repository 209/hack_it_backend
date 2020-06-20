/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const Hashtable = require("./../../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");

const ReferentToken = require("./../../ReferentToken");
const Referent = require("./../../Referent");

class GeneralRelationHelper {
    
    static refresh_generals(proc, kit) {
        let all = new Hashtable();
        let all_refs = new Array();
        for (const a of proc.analyzers) {
            let ad = kit.get_analyzer_data(a);
            if (ad === null) 
                continue;
            for (const r of ad.referents) {
                let nod = GeneralRelationHelper.Node._new463(r, ad);
                all_refs.push(nod);
                r.tag = nod;
                let si = null;
                let wrapsi466 = new RefOutArgWrapper();
                let inoutres467 = all.tryGetValue(a.name, wrapsi466);
                si = wrapsi466.value;
                if (!inoutres467) 
                    all.put(a.name, (si = new Hashtable()));
                let strs = r.get_compare_strings();
                if (strs === null || strs.length === 0) 
                    continue;
                for (const s of strs) {
                    if (s === null) 
                        continue;
                    let li = [ ];
                    let wrapli464 = new RefOutArgWrapper();
                    let inoutres465 = si.tryGetValue(s, wrapli464);
                    li = wrapli464.value;
                    if (!inoutres465) 
                        si.put(s, (li = new Array()));
                    li.push(r);
                }
            }
        }
        for (const r of all_refs) {
            for (const s of r.ref.slots) {
                if (s.value instanceof Referent) {
                    let to = Utils.as(s.value, Referent);
                    let tn = Utils.as(to.tag, GeneralRelationHelper.Node);
                    if (tn === null) 
                        continue;
                    if (tn.refs_from === null) 
                        tn.refs_from = new Array();
                    tn.refs_from.push(r);
                    if (r.refs_to === null) 
                        r.refs_to = new Array();
                    r.refs_to.push(tn);
                }
            }
        }
        for (const ty of all.values) {
            for (const li of ty.values) {
                if (li.length < 2) 
                    continue;
                if (li.length > 3000) 
                    continue;
                for (let i = 0; i < li.length; i++) {
                    for (let j = i + 1; j < li.length; j++) {
                        let n1 = null;
                        let n2 = null;
                        if (li[i].can_be_general_for(li[j]) && !li[j].can_be_general_for(li[i])) {
                            n1 = Utils.as(li[i].tag, GeneralRelationHelper.Node);
                            n2 = Utils.as(li[j].tag, GeneralRelationHelper.Node);
                        }
                        else if (li[j].can_be_general_for(li[i]) && !li[i].can_be_general_for(li[j])) {
                            n1 = Utils.as(li[j].tag, GeneralRelationHelper.Node);
                            n2 = Utils.as(li[i].tag, GeneralRelationHelper.Node);
                        }
                        if (n1 !== null && n2 !== null) {
                            if (n1.gen_from === null) 
                                n1.gen_from = new Array();
                            if (!n1.gen_from.includes(n2)) 
                                n1.gen_from.push(n2);
                            if (n2.gen_to === null) 
                                n2.gen_to = new Array();
                            if (!n2.gen_to.includes(n1)) 
                                n2.gen_to.push(n1);
                        }
                    }
                }
            }
        }
        for (const n of all_refs) {
            if (n.gen_to !== null && n.gen_to.length > 1) {
                for (let i = n.gen_to.length - 1; i >= 0; i--) {
                    let p = n.gen_to[i];
                    let del = false;
                    for (let j = 0; j < n.gen_to.length; j++) {
                        if (j !== i && n.gen_to[j].is_in_gen_parents_or_higher(p)) 
                            del = true;
                    }
                    if (del) {
                        Utils.removeItem(p.gen_from, n);
                        n.gen_to.splice(i, 1);
                    }
                }
            }
        }
        for (const n of all_refs) {
            if (!n.deleted && n.gen_to !== null && n.gen_to.length === 1) {
                let p = n.gen_to[0];
                if (p.gen_from.length === 1) {
                    n.ref.merge_slots(p.ref, true);
                    p.ref.tag = n.ref;
                    p.replace_values(n);
                    for (const o of p.ref.occurrence) {
                        n.ref.add_occurence(o);
                    }
                    p.deleted = true;
                }
                else 
                    n.ref.general_referent = p.ref;
            }
        }
        for (let t = kit.first_token; t !== null; t = t.next) {
            GeneralRelationHelper._correct_referents(t);
        }
        for (const n of all_refs) {
            if (n.deleted) 
                n.ad.remove_referent(n.ref);
            n.ref.tag = null;
        }
    }
    
    static _correct_referents(t) {
        let rt = Utils.as(t, ReferentToken);
        if (rt === null) 
            return;
        if (rt.referent !== null && (rt.referent.tag instanceof Referent)) 
            rt.referent = Utils.as(rt.referent.tag, Referent);
        for (let tt = rt.begin_token; tt !== null && tt.end_char <= rt.end_char; tt = tt.next) {
            GeneralRelationHelper._correct_referents(tt);
        }
    }
}


GeneralRelationHelper.Node = class  {
    
    constructor() {
        this.ref = null;
        this.ad = null;
        this.refs_to = null;
        this.refs_from = null;
        this.gen_to = null;
        this.gen_from = null;
        this.deleted = false;
    }
    
    toString() {
        return this.ref.toString();
    }
    
    is_in_gen_parents_or_higher(n) {
        if (this.gen_to === null) 
            return false;
        for (const p of this.gen_to) {
            if (p === n) 
                return true;
            else if (p.is_in_gen_parents_or_higher(n)) 
                return true;
        }
        return false;
    }
    
    replace_values(new_node) {
        if (this.refs_from !== null) {
            for (const fr of this.refs_from) {
                let ch = false;
                for (const s of fr.ref.slots) {
                    if (s.value === this.ref) {
                        fr.ref.upload_slot(s, new_node.ref);
                        ch = true;
                    }
                }
                if (!ch) 
                    continue;
                for (let i = 0; i < (fr.ref.slots.length - 1); i++) {
                    for (let j = i + 1; j < fr.ref.slots.length; j++) {
                        if (fr.ref.slots[i].type_name === fr.ref.slots[j].type_name && fr.ref.slots[i].value === fr.ref.slots[j].value) {
                            fr.ref.slots.splice(j, 1);
                            j--;
                        }
                    }
                }
            }
        }
    }
    
    static _new463(_arg1, _arg2) {
        let res = new GeneralRelationHelper.Node();
        res.ref = _arg1;
        res.ad = _arg2;
        return res;
    }
}


module.exports = GeneralRelationHelper
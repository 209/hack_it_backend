/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const Stream = require("./../../unisharp/Stream");
const MemoryStream = require("./../../unisharp/MemoryStream");

const MorphClass = require("./../MorphClass");
const MorphCase = require("./../MorphCase");
const MorphNumber = require("./../MorphNumber");
const MorphGender = require("./../MorphGender");
const ByteArrayWrapper = require("./ByteArrayWrapper");
const MorphRuleVariant = require("./MorphRuleVariant");
const MorphTreeNode = require("./MorphTreeNode");
const MorphRule = require("./MorphRule");
const MorphMiscInfo = require("./../MorphMiscInfo");

class MorphSerializeHelper {
    
    static deflate_gzip(str, res) {
        let deflate = Utils.gzipWrapper(str, 'r'); 
        try {
            let buf = new Uint8Array(100000);
            while (true) {
                let i = -1;
                try {
                    for (let ii = 0; ii < buf.length; ii++) {
                        buf[ii] = 0;
                    }
                    i = deflate.read(buf, 0, buf.length);
                } catch (ex) {
                    for (i = buf.length - 1; i >= 0; i--) {
                        if (buf[i] !== (0)) {
                            res.write(buf, 0, i + 1);
                            break;
                        }
                    }
                    break;
                }
                if (i < 1) 
                    break;
                res.write(buf, 0, i);
            }
        }
        finally {
            deflate.close();
        }
    }
    
    static deserialize_all(str0, me, ignore_rev_tree, lazy_load) {
        let tmp = new MemoryStream();
        MorphSerializeHelper.deflate_gzip(str0, tmp);
        let buf = new ByteArrayWrapper(tmp.toByteArray());
        me.m_vars.splice(0, me.m_vars.length);
        me.m_rules.splice(0, me.m_rules.length);
        me.m_root = new MorphTreeNode();
        me.m_root_reverce = new MorphTreeNode();
        let pos = 0;
        let wrappos40 = new RefOutArgWrapper(pos);
        let cou = buf.deserialize_int(wrappos40);
        pos = wrappos40.value;
        for (; cou > 0; cou--) {
            let mi = new MorphMiscInfo();
            let wrappos32 = new RefOutArgWrapper(pos);
            MorphSerializeHelper.deserialize_morph_misc_info(buf, mi, wrappos32);
            pos = wrappos32.value;
            me.m_vars.push(mi);
        }
        let wrappos39 = new RefOutArgWrapper(pos);
        cou = buf.deserialize_int(wrappos39);
        pos = wrappos39.value;
        for (; cou > 0; cou--) {
            let wrappos34 = new RefOutArgWrapper(pos);
            let p1 = buf.deserialize_int(wrappos34);
            pos = wrappos34.value;
            let r = new MorphRule();
            if (lazy_load) {
                r.lazy_pos = pos;
                pos = p1;
            }
            else {
                let wrappos33 = new RefOutArgWrapper(pos);
                MorphSerializeHelper.deserialize_morph_rule(buf, r, me, wrappos33);
                pos = wrappos33.value;
            }
            me.m_rules.push(r);
        }
        if (lazy_load) {
            let wrappos35 = new RefOutArgWrapper(pos);
            MorphSerializeHelper.deserialize_morph_tree_node_lazy(buf, me.m_root, me, wrappos35);
            pos = wrappos35.value;
        }
        else {
            let wrappos36 = new RefOutArgWrapper(pos);
            MorphSerializeHelper.deserialize_morph_tree_node(buf, me.m_root, me, wrappos36);
            pos = wrappos36.value;
        }
        if (!ignore_rev_tree) {
            if (lazy_load) {
                let wrappos37 = new RefOutArgWrapper(pos);
                MorphSerializeHelper.deserialize_morph_tree_node_lazy(buf, me.m_root_reverce, me, wrappos37);
                pos = wrappos37.value;
            }
            else {
                let wrappos38 = new RefOutArgWrapper(pos);
                MorphSerializeHelper.deserialize_morph_tree_node(buf, me.m_root_reverce, me, wrappos38);
                pos = wrappos38.value;
            }
        }
        tmp.close();
        return buf;
    }
    
    static serialize_morph_misc_info(res, mi) {
        MorphSerializeHelper.serialize_short(res, mi.m_value);
        for (const a of mi.attrs) {
            MorphSerializeHelper.serialize_string(res, a);
        }
        res.writeByte(0xFF);
    }
    
    static deserialize_morph_misc_info(str, mi, pos) {
        mi.m_value = str.deserialize_short(pos);
        while (true) {
            let s = str.deserialize_string(pos);
            if (Utils.isNullOrEmpty(s)) 
                break;
            mi.attrs.push(s);
        }
    }
    
    static serialize_byte(res, val) {
        res.writeByte(val);
    }
    
    static serialize_short(res, val) {
        res.writeByte(val);
        res.writeByte((val >> 8));
    }
    
    static serialize_int(res, val) {
        res.writeByte(val);
        res.writeByte((val >> 8));
        res.writeByte((val >> 16));
        res.writeByte((val >> 24));
    }
    
    static serialize_string(res, s) {
        if (s === null) 
            res.writeByte(0xFF);
        else if (s.length === 0) 
            res.writeByte(0);
        else {
            let data = Utils.encodeString("UTF-8", s);
            res.writeByte(data.length);
            res.write(data, 0, data.length);
        }
    }
    
    static serialize_morph_rule(res, r) {
        MorphSerializeHelper.serialize_short(res, r.id);
        for (const v of r.variants.entries) {
            MorphSerializeHelper.serialize_string(res, v.key);
            for (const m of v.value) {
                MorphSerializeHelper.serialize_morph_rule_variant(res, m);
            }
            MorphSerializeHelper.serialize_short(res, 0);
        }
        res.writeByte(0xFF);
    }
    
    static deserialize_morph_rule(str, r, me, pos) {
        r.id = str.deserialize_short(pos);
        while (!str.iseof(pos.value)) {
            let b = str.deserialize_byte(pos);
            if (b === (0xFF)) 
                break;
            pos.value--;
            let key = Utils.notNull(str.deserialize_string(pos), "");
            let li = new Array();
            r.variants.put(key, li);
            r.variants_key.push(key);
            r.variants_list.push(li);
            while (!str.iseof(pos.value)) {
                let mrv = MorphSerializeHelper.deserialize_morph_rule_variant(str, me, pos);
                if (mrv === null) 
                    break;
                mrv.tail = key;
                mrv.rule = r;
                li.push(mrv);
            }
        }
    }
    
    static serialize_morph_rule_variant(res, v) {
        MorphSerializeHelper.serialize_short(res, v.misc_info.id);
        MorphSerializeHelper.serialize_short(res, v.class0.value);
        MorphSerializeHelper.serialize_byte(res, v.gender.value());
        MorphSerializeHelper.serialize_byte(res, v.number.value());
        MorphSerializeHelper.serialize_byte(res, v._case.value);
        MorphSerializeHelper.serialize_string(res, v.normal_tail);
        MorphSerializeHelper.serialize_string(res, v.full_normal_tail);
    }
    
    static deserialize_morph_rule_variant(str, me, pos) {
        let id = str.deserialize_short(pos) - 1;
        if ((id < 0) || id >= me.m_vars.length) 
            return null;
        let mrv = MorphRuleVariant._new41(me.m_vars[id]);
        let mc = new MorphClass();
        mc.value = str.deserialize_short(pos);
        if (mc.is_misc && mc.is_proper) 
            mc.is_misc = false;
        mrv.class0 = mc;
        mrv.gender = MorphGender.of(str.deserialize_byte(pos));
        mrv.number = MorphNumber.of(str.deserialize_byte(pos));
        let mca = new MorphCase();
        mca.value = str.deserialize_byte(pos);
        mrv._case = mca;
        mrv.normal_tail = str.deserialize_string(pos);
        mrv.full_normal_tail = str.deserialize_string(pos);
        return mrv;
    }
    
    static serialize_morph_tree_node(res, tn) {
        if (tn.rules !== null) {
            for (const r of tn.rules) {
                MorphSerializeHelper.serialize_short(res, r.id);
            }
        }
        MorphSerializeHelper.serialize_short(res, 0);
        if (tn.reverce_variants !== null) {
            for (const v of tn.reverce_variants) {
                MorphSerializeHelper.serialize_string(res, (v.tail != null ? v.tail : ""));
                if (v.rule !== null) {
                }
                MorphSerializeHelper.serialize_short(res, (v.rule === null ? 0 : v.rule.id));
                MorphSerializeHelper.serialize_short(res, v.coef);
                MorphSerializeHelper.serialize_morph_rule_variant(res, v);
            }
        }
        MorphSerializeHelper.serialize_string(res, null);
        if (tn.nodes !== null) {
            for (const n of tn.nodes.entries) {
                MorphSerializeHelper.serialize_short(res, n.key);
                let p0 = res.position;
                MorphSerializeHelper.serialize_int(res, 0);
                MorphSerializeHelper.serialize_morph_tree_node(res, n.value);
                let p1 = res.position;
                res.position = p0;
                MorphSerializeHelper.serialize_int(res, p1);
                res.position = p1;
            }
        }
        MorphSerializeHelper.serialize_short(res, 0xFFFF);
    }
    
    static deserialize_morph_tree_node_base(str, tn, me, pos) {
        while (!str.iseof(pos.value)) {
            let i = str.deserialize_short(pos);
            i--;
            if ((i < 0) || i >= me.m_rules.length) 
                break;
            let r = me.m_rules[i];
            if (tn.rules === null) 
                tn.rules = new Array();
            tn.rules.push(r);
        }
        while (!str.iseof(pos.value)) {
            let tail = str.deserialize_string(pos);
            if (tail === null) 
                break;
            let rule_id = str.deserialize_short(pos);
            let coef = str.deserialize_short(pos);
            let v = MorphSerializeHelper.deserialize_morph_rule_variant(str, me, pos);
            if (v === null) 
                break;
            v.tail = tail;
            if (rule_id > 0 && rule_id <= me.m_rules.length) 
                v.rule = me.m_rules[rule_id - 1];
            else {
            }
            if (tn.reverce_variants === null) 
                tn.reverce_variants = new Array();
            v.coef = coef;
            tn.reverce_variants.push(v);
        }
    }
    
    static deserialize_morph_tree_node_lazy(str, tn, me, pos) {
        MorphSerializeHelper.deserialize_morph_tree_node_base(str, tn, me, pos);
        while (!str.iseof(pos.value)) {
            let i = str.deserialize_short(pos);
            if (i === 0xFFFF) 
                break;
            let pp = str.deserialize_int(pos);
            let child = new MorphTreeNode();
            child.lazy_pos = pos.value;
            if (tn.nodes === null) 
                tn.nodes = new Hashtable();
            tn.nodes.put(i, child);
            pos.value = pp;
        }
        let p = pos.value;
        if (tn.rules !== null) {
            for (const r of tn.rules) {
                if (r.lazy_pos > 0) {
                    pos.value = r.lazy_pos;
                    MorphSerializeHelper.deserialize_morph_rule(str, r, me, pos);
                    r.lazy_pos = 0;
                }
            }
            pos.value = p;
        }
    }
    
    static deserialize_morph_tree_node(str, tn, me, pos) {
        let res = 0;
        MorphSerializeHelper.deserialize_morph_tree_node_base(str, tn, me, pos);
        while (!str.iseof(pos.value)) {
            let i = str.deserialize_short(pos);
            if (i === 0xFFFF) 
                break;
            let pp = str.deserialize_int(pos);
            let child = new MorphTreeNode();
            if (tn.nodes === null) 
                tn.nodes = new Hashtable();
            tn.nodes.put(i, child);
            res++;
            res += MorphSerializeHelper.deserialize_morph_tree_node(str, child, me, pos);
        }
        return res;
    }
    
    static _manage_reverce_nodes(root, tn, term) {
        if (tn.rules !== null) {
            for (const r of tn.rules) {
                for (const v of r.variants.entries) {
                    let wf = term + v.key;
                    if (wf.length <= MorphSerializeHelper.min_tail_len) 
                        continue;
                    let rtn = root;
                    for (let lev = 0; lev < MorphSerializeHelper.max_tail_len; lev++) {
                        let i = wf.length - 1 - lev;
                        if (i < 0) 
                            break;
                        let ch = wf.charCodeAt(i);
                        if (rtn.nodes === null) 
                            rtn.nodes = new Hashtable();
                        let next = null;
                        let wrapnext42 = new RefOutArgWrapper();
                        let inoutres43 = rtn.nodes.tryGetValue(ch, wrapnext42);
                        next = wrapnext42.value;
                        if (!inoutres43) {
                            next = new MorphTreeNode();
                            rtn.nodes.put(ch, next);
                        }
                        rtn = next;
                        if ((lev + 1) < MorphSerializeHelper.min_tail_len) 
                            continue;
                        if (rtn.reverce_variants === null) 
                            rtn.reverce_variants = new Array();
                        for (const mrf of v.value) {
                            let has = false;
                            for (const mfv0 of rtn.reverce_variants) {
                                if (mfv0.compare(mrf)) {
                                    mfv0.coef++;
                                    has = true;
                                    break;
                                }
                            }
                            if (!has) {
                                let mrf0 = new MorphRuleVariant(mrf);
                                mrf0.coef = 1;
                                rtn.reverce_variants.push(mrf0);
                            }
                        }
                        break;
                    }
                }
            }
        }
        if (tn.nodes !== null) {
            for (const tch of tn.nodes.entries) {
                MorphSerializeHelper._manage_reverce_nodes(root, tch.value, (term + ((String.fromCharCode(tch.key)))));
            }
        }
    }
    
    static static_constructor() {
        MorphSerializeHelper.MAX_VARIANTS = 0;
        MorphSerializeHelper.min_tail_len = 4;
        MorphSerializeHelper.max_tail_len = 7;
    }
}


MorphSerializeHelper.static_constructor();

module.exports = MorphSerializeHelper
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

const MorphAspect = require("./../../morph/MorphAspect");
const ControlModelQuestion = require("./../utils/ControlModelQuestion");
const SemanticRole = require("./../core/SemanticRole");
const ControlModelItemType = require("./../utils/ControlModelItemType");
const MorphVoice = require("./../../morph/MorphVoice");
const MorphClass = require("./../../morph/MorphClass");
const MorphTense = require("./../../morph/MorphTense");
const MorphCase = require("./../../morph/MorphCase");
const QuestionType = require("./../utils/QuestionType");
const ByteArrayWrapper = require("./../../morph/internal/ByteArrayWrapper");
const NextModelItem = require("./NextModelItem");
const MorphLang = require("./../../morph/MorphLang");
const DerivateWord = require("./../utils/DerivateWord");
const ControlModelItem = require("./../utils/ControlModelItem");
const DerivateGroup = require("./../utils/DerivateGroup");
const ExplanTreeNode = require("./ExplanTreeNode");
const MorphSerializeHelper = require("./../../morph/internal/MorphSerializeHelper");

class DeserializeHelper {
    
    static deserializedd(str, dic, lazy_load) {
        let wr = null;
        let tmp = new MemoryStream(); 
        try {
            MorphSerializeHelper.deflate_gzip(str, tmp);
            wr = new ByteArrayWrapper(tmp.toByteArray());
            let pos = 0;
            let wrappos2916 = new RefOutArgWrapper(pos);
            let cou = wr.deserialize_int(wrappos2916);
            pos = wrappos2916.value;
            for (; cou > 0; cou--) {
                let wrappos2914 = new RefOutArgWrapper(pos);
                let p1 = wr.deserialize_int(wrappos2914);
                pos = wrappos2914.value;
                let ew = new DerivateGroup();
                if (lazy_load) {
                    ew.lazy_pos = pos;
                    pos = p1;
                }
                else {
                    let wrappos2913 = new RefOutArgWrapper(pos);
                    DeserializeHelper.deserialize_derivate_group(wr, ew, wrappos2913);
                    pos = wrappos2913.value;
                }
                dic.m_all_groups.push(ew);
            }
            dic.m_root = new ExplanTreeNode();
            let wrappos2915 = new RefOutArgWrapper(pos);
            DeserializeHelper.deserialize_tree_node(wr, dic, dic.m_root, lazy_load, wrappos2915);
            pos = wrappos2915.value;
        }
        finally {
            tmp.close();
        }
        return wr;
    }
    
    static deserialize_derivate_group(str, dg, pos) {
        let attr = str.deserialize_short(pos);
        if (((attr & 1)) !== 0) 
            dg.is_dummy = true;
        if (((attr & 2)) !== 0) 
            dg.not_generate = true;
        dg.prefix = str.deserialize_string(pos);
        DeserializeHelper.deserialize_control_model(str, dg.model, pos);
        DeserializeHelper.deserialize_old_control_model(str, dg.cm, pos);
        DeserializeHelper.deserialize_old_control_model(str, dg.cm_rev, pos);
        let cou = str.deserialize_short(pos);
        for (; cou > 0; cou--) {
            let w = new DerivateWord(dg);
            w.spelling = str.deserialize_string(pos);
            w.class0 = new MorphClass();
            w.class0.value = str.deserialize_short(pos);
            w.lang = MorphLang._new75(str.deserialize_short(pos));
            w.attrs.value = str.deserialize_short(pos);
            w.aspect = MorphAspect.of(str.deserialize_byte(pos));
            w.tense = MorphTense.of(str.deserialize_byte(pos));
            w.voice = MorphVoice.of(str.deserialize_byte(pos));
            dg.words.push(w);
        }
    }
    
    static deserialize_control_model(str, cm, pos) {
        let cou = str.deserialize_short(pos);
        for (; cou > 0; cou--) {
            let it = new ControlModelItem();
            cm.items.push(it);
            it.typ = ControlModelItemType.of(str.deserialize_byte(pos));
            if (it.typ === ControlModelItemType.WORD) 
                it.word = str.deserialize_string(pos);
            let licou = str.deserialize_short(pos);
            for (; licou > 0; licou--) {
                let i = str.deserialize_byte(pos);
                let r = SemanticRole.of(str.deserialize_byte(pos));
                if (r === SemanticRole.AGENTORINSTRUMENT) {
                }
                if (i >= 0 && (i < ControlModelQuestion.ITEMS.length)) 
                    it.links.put(ControlModelQuestion.ITEMS[i], r);
            }
        }
        cou = str.deserialize_short(pos);
        for (; cou > 0; cou--) {
            cm.next_words.push(str.deserialize_string(pos));
        }
    }
    
    static deserialize_old_control_model(str, cm, pos) {
        cm.transitive = str.deserialize_byte(pos) !== (0);
        cm.questions = QuestionType.of(str.deserialize_short(pos));
        let sh = str.deserialize_short(pos);
        if (sh !== 0) {
            let pr = str.deserialize_string(pos);
            let cas = new MorphCase();
            cas.value = sh;
            cm.agent = new NextModelItem(pr, cas);
        }
        sh = str.deserialize_short(pos);
        if (sh !== 0) {
            let pr = str.deserialize_string(pos);
            let cas = new MorphCase();
            cas.value = sh;
            cm.pacient = new NextModelItem(pr, cas);
        }
        sh = str.deserialize_short(pos);
        if (sh !== 0) {
            let pr = str.deserialize_string(pos);
            let cas = new MorphCase();
            cas.value = sh;
            cm.instrument = new NextModelItem(pr, cas);
        }
        let cou = str.deserialize_short(pos);
        for (; cou > 0; cou--) {
            let pref = Utils.notNull(str.deserialize_string(pos), "");
            let cas = new MorphCase();
            cas.value = str.deserialize_short(pos);
            if (cm.nexts === null) 
                cm.nexts = new Hashtable();
            cm.nexts.put(pref, cas);
        }
    }
    
    static deserialize_tree_node(str, dic, tn, lazy_load, pos) {
        let cou = str.deserialize_short(pos);
        let li = (cou > 1 ? new Array() : null);
        for (; cou > 0; cou--) {
            let id = str.deserialize_int(pos);
            if (id > 0 && id <= dic.m_all_groups.length) {
                let gr = dic.m_all_groups[id - 1];
                if (gr.lazy_pos > 0) {
                    let p0 = pos.value;
                    pos.value = gr.lazy_pos;
                    DeserializeHelper.deserialize_derivate_group(str, gr, pos);
                    gr.lazy_pos = 0;
                    pos.value = p0;
                }
                if (li !== null) 
                    li.push(gr);
                else 
                    tn.groups = gr;
            }
        }
        if (li !== null) 
            tn.groups = li;
        cou = str.deserialize_short(pos);
        if (cou === 0) 
            return;
        for (; cou > 0; cou--) {
            let ke = str.deserialize_short(pos);
            let p1 = str.deserialize_int(pos);
            let tn1 = new ExplanTreeNode();
            if (tn.nodes === null) 
                tn.nodes = new Hashtable();
            if (!tn.nodes.containsKey(ke)) 
                tn.nodes.put(ke, tn1);
            if (lazy_load) {
                tn1.lazy_pos = pos.value;
                pos.value = p1;
            }
            else 
                DeserializeHelper.deserialize_tree_node(str, dic, tn1, false, pos);
        }
    }
}


module.exports = DeserializeHelper
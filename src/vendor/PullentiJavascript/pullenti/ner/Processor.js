/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const Hashtable = require("./../unisharp/Hashtable");
const RefOutArgWrapper = require("./../unisharp/RefOutArgWrapper");
const EventHandler = require("./../unisharp/EventHandler");
const ProgressEventArgs = require("./../unisharp/ProgressEventArgs");
const Stopwatch = require("./../unisharp/Stopwatch");
const XmlDocument = require("./../unisharp/XmlDocument");

const ProgressPeace = require("./core/internal/ProgressPeace");
const ProxyReferent = require("./ProxyReferent");
const GeneralRelationHelper = require("./core/internal/GeneralRelationHelper");
const AnalysisResult = require("./AnalysisResult");
const AnalysisKit = require("./core/AnalysisKit");

/**
 * Семантический процессор
 */
class Processor {
    
    constructor() {
        this.m_analyzers = new Array();
        this.m_analyzers_hash = new Hashtable();
        this.progress = new Array();
        this.m_progress_peaces = new Hashtable();
        this.m_progress_peaces_lock = new Object();
        this.m_breaked = false;
        this.timeout_seconds = 0;
        this.last_percent = 0;
        this.m_links = null;
        this.m_links2 = null;
        this.m_refs = null;
        this.tag = null;
        this._progress_changed_event_handler_on_progress_handler = new Processor.ProgressChangedEventHandler_OnProgressHandler(this);
        this._cancel_event_handler_on_cancel = new Processor.CancelEventHandler_OnCancel(this);
    }
    
    /**
     * Добавить анализатор, если его ещё нет
     * @param a экземпляр анализатора
     */
    add_analyzer(a) {
        if (a === null || a.name === null || this.m_analyzers_hash.containsKey(a.name)) 
            return;
        this.m_analyzers_hash.put(a.name, a);
        this.m_analyzers.push(a);
        a.progress.push(this._progress_changed_event_handler_on_progress_handler);
        a.cancel.push(this._cancel_event_handler_on_cancel);
    }
    
    /**
     * Удалить анализатор
     * @param a 
     */
    del_analyzer(a) {
        if (!this.m_analyzers_hash.containsKey(a.name)) 
            return;
        this.m_analyzers_hash.remove(a.name);
        Utils.removeItem(this.m_analyzers, a);
        Utils.removeItem(a.progress, this._progress_changed_event_handler_on_progress_handler);
        Utils.removeItem(a.cancel, this._cancel_event_handler_on_cancel);
    }
    
    close() {
        for (const w of this.analyzers) {
            Utils.removeItem(w.progress, this._progress_changed_event_handler_on_progress_handler);
            Utils.removeItem(w.cancel, this._cancel_event_handler_on_cancel);
        }
    }
    
    /**
     * [Get] Последовательность обработки данных (анализаторы)
     */
    get analyzers() {
        return this.m_analyzers;
    }
    
    /**
     * Найти анализатор по его имени
     * @param name 
     * @return 
     */
    find_analyzer(name) {
        let a = null;
        let wrapa2825 = new RefOutArgWrapper();
        let inoutres2826 = this.m_analyzers_hash.tryGetValue((name != null ? name : ""), wrapa2825);
        a = wrapa2825.value;
        if (!inoutres2826) 
            return null;
        else 
            return a;
    }
    
    /**
     * Обработать текст
     * @param text входной контейнер текста
     * @param ext_ontology внешняя онтология (null - не используется)
     * @param lang язык (если не задан, то будет определён автоматически)
     * @return аналитический контейнер с результатом
     */
    process(text, ext_ontology = null, lang = null) {
        return this._process(text, false, false, ext_ontology, lang);
    }
    
    /**
     * Доделать результат, который был сделан другим процессором
     * @param ar то, что было сделано другим процессором
     */
    process_next(ar) {
        if (ar === null) 
            return;
        let kit = AnalysisKit._new2827(this, ar.ontology);
        kit.init_from(ar);
        this._process2(kit, ar, false);
        this._create_res(kit, ar, ar.ontology, false);
        ar.first_token = kit.first_token;
    }
    
    _process(text, onto_regine, no_log, ext_ontology = null, lang = null) {
        this.m_breaked = false;
        this.prepare_progress();
        let sw0 = new Stopwatch();
        this.manage_referent_links();
        if (!no_log) 
            this.on_progress_handler(this, new ProgressEventArgs(0, "Морфологический анализ"));
        let kit = AnalysisKit._new2828(text, false, lang, this._progress_changed_event_handler_on_progress_handler, ext_ontology, this, onto_regine);
        let ar = new AnalysisResult();
        sw0.stop();
        let msg = null;
        this.on_progress_handler(this, new ProgressEventArgs(100, "Морфологический анализ завершён"));
        let k = 0;
        for (let t = kit.first_token; t !== null; t = t.next) {
            k++;
        }
        if (!no_log) {
            msg = ("Из " + text.text.length + " символов текста выделено " + k + " термов за " + sw0.elapsedMilliseconds + " ms");
            if (!kit.base_language.is_undefined) 
                msg += (", базовый язык " + kit.base_language.toString());
            this.on_message(msg);
            ar.log.push(msg);
            if (text.crlf_corrected_count > 0) 
                ar.log.push((String(text.crlf_corrected_count) + " переходов на новую строку заменены на пробел"));
            if (kit.first_token === null) 
                ar.log.push("Пустой текст");
        }
        sw0.start();
        if (kit.first_token !== null) 
            this._process2(kit, ar, no_log);
        if (!onto_regine) 
            this._create_res(kit, ar, ext_ontology, no_log);
        sw0.stop();
        if (!no_log) {
            if (sw0.elapsedMilliseconds > (5000)) {
                let f = text.text.length;
                f /= (sw0.elapsedMilliseconds);
                msg = ("Обработка " + text.text.length + " знаков выполнена за " + Processor.out_secs(sw0.elapsedMilliseconds) + " (" + f + " Kb/sec)");
            }
            else 
                msg = ("Обработка " + text.text.length + " знаков выполнена за " + Processor.out_secs(sw0.elapsedMilliseconds));
            this.on_message(msg);
            ar.log.push(msg);
        }
        ar.sofas.push(text);
        if (!onto_regine) 
            ar.entities.splice(ar.entities.length, 0, ...kit.entities);
        ar.first_token = kit.first_token;
        ar.ontology = ext_ontology;
        ar.base_language = kit.base_language;
        return ar;
    }
    
    _process2(kit, ar, no_log) {
        let msg = null;
        let sw = new Stopwatch();
        let stop_by_timeout = false;
        let anals = Array.from(this.m_analyzers);
        for (let ii = 0; ii < anals.length; ii++) {
            let c = anals[ii];
            if (c.ignore_this_analyzer) 
                continue;
            if (this.m_breaked) {
                if (!no_log) {
                    msg = "Процесс прерван пользователем";
                    this.on_message(msg);
                    ar.log.push(msg);
                }
                break;
            }
            if (!no_log) 
                this.on_progress_handler(c, new ProgressEventArgs(0, ("Работа \"" + c.caption + "\"")));
            sw.reset();
            sw.start();
            c.process(kit);
            sw.stop();
            let dat = kit.get_analyzer_data(c);
            if (!no_log) {
                msg = ("Анализатор \"" + c.caption + "\" выделил " + (dat === null ? 0 : dat.referents.length) + " объект(ов) за " + Processor.out_secs(sw.elapsedMilliseconds));
                this.on_message(msg);
                ar.log.push(msg);
            }
        }
        if (!no_log) 
            this.on_progress_handler(null, new ProgressEventArgs(0, "Пересчёт отношений обобщения"));
        try {
            sw.reset();
            sw.start();
            GeneralRelationHelper.refresh_generals(this, kit);
            sw.stop();
            if (!no_log) {
                msg = ("Отношение обобщение пересчитано за " + Processor.out_secs(sw.elapsedMilliseconds));
                this.on_message(msg);
                ar.log.push(msg);
            }
        } catch (ex) {
            if (!no_log) {
                ex = new Error("Ошибка пересчёта отношения обобщения");
                this.on_message(ex);
                ar.add_exception(ex);
            }
        }
    }
    
    _create_res(kit, ar, ext_ontology, no_log) {
        let sw = new Stopwatch();
        let onto_attached = 0;
        for (let k = 0; k < 2; k++) {
            for (const c of this.analyzers) {
                if (k === 0) {
                    if (!c.is_specific) 
                        continue;
                }
                else if (c.is_specific) 
                    continue;
                let dat = kit.get_analyzer_data(c);
                if (dat !== null && dat.referents.length > 0) {
                    if (ext_ontology !== null) {
                        for (const r of dat.referents) {
                            if (r.ontology_items === null) {
                                if ((((r.ontology_items = ext_ontology.attach_referent(r)))) !== null) 
                                    onto_attached++;
                            }
                        }
                    }
                    ar.entities.splice(ar.entities.length, 0, ...dat.referents);
                }
            }
        }
        sw.stop();
        if (ext_ontology !== null && !no_log) {
            let msg = ("Привязано " + onto_attached + " объектов к внешней отнологии (" + ext_ontology.items.length + " элементов) за " + Processor.out_secs(sw.elapsedMilliseconds));
            this.on_message(msg);
            ar.log.push(msg);
        }
    }
    
    static out_secs(ms) {
        if (ms < 4000) 
            return (String(ms) + "ms");
        ms = Utils.intDiv(ms, 1000);
        if (ms < 120) 
            return (String(ms) + "sec");
        return ((String(Utils.intDiv(ms, 60))) + "min " + (ms % 60) + "sec");
    }
    
    /**
     * Прервать процесс анализа
     */
    break0() {
        this.m_breaked = true;
    }
    
    prepare_progress() {
        /* this is synchronized block by this.m_progress_peaces_lock, but this feature isn't supported in JS */ {
            this.last_percent = -1;
            let co = Processor.morph_coef;
            let total = co;
            for (const wf of this.analyzers) {
                total += (wf.progress_weight > 0 ? wf.progress_weight : 1);
            }
            this.m_progress_peaces.clear();
            let max = co * 100;
            max /= (total);
            this.m_progress_peaces.put(this, ProgressPeace._new2829(0, max));
            for (const wf of this.analyzers) {
                let min = max;
                co += (wf.progress_weight > 0 ? wf.progress_weight : 1);
                max = co * 100;
                max /= (total);
                if (!this.m_progress_peaces.containsKey(wf)) 
                    this.m_progress_peaces.put(wf, ProgressPeace._new2829(min, max));
            }
        }
    }
    
    on_progress_handler(sender, e) {
        if (this.progress.length == 0) 
            return;
        if (e.progressPercentage >= 0) {
            let pi = null;
            /* this is synchronized block by this.m_progress_peaces_lock, but this feature isn't supported in JS */ {
                let wrappi2831 = new RefOutArgWrapper();
                let inoutres2832 = this.m_progress_peaces.tryGetValue((sender != null ? sender : this), wrappi2831);
                pi = wrappi2831.value;
                if (inoutres2832) {
                    let p = ((e.progressPercentage) * ((pi.max - pi.min))) / (100);
                    p += pi.min;
                    let pers = Math.floor(p);
                    if (pers === this.last_percent && e.userState === null && !this.m_breaked) 
                        return;
                    e = new ProgressEventArgs(Math.floor(p), e.userState);
                    this.last_percent = pers;
                }
            }
        }
        for(const eventitem of this.progress) eventitem.call(this, e);
    }
    
    on_cancel(sender, e) {
        e.cancel = this.m_breaked;
    }
    
    on_message(message) {
        if (this.progress.length > 0) 
            for(const eventitem of this.progress) eventitem.call(this, new ProgressEventArgs(-1, message));
    }
    
    manage_referent_links() {
        if (this.m_refs !== null) {
            for (const pr of this.m_refs) {
                let r = null;
                let wrapr2835 = new RefOutArgWrapper();
                let inoutres2836 = this.m_links2.tryGetValue(pr.identity, wrapr2835);
                r = wrapr2835.value;
                if (pr.identity !== null && this.m_links2 !== null && inoutres2836) 
                    pr.owner_referent.upload_slot(pr.owner_slot, r);
                else {
                    let wrapr2833 = new RefOutArgWrapper();
                    let inoutres2834 = this.m_links.tryGetValue(pr.value, wrapr2833);
                    r = wrapr2833.value;
                    if (this.m_links !== null && inoutres2834) 
                        pr.owner_referent.upload_slot(pr.owner_slot, r);
                    else {
                    }
                }
            }
        }
        this.m_links = (this.m_links2 = null);
        this.m_refs = null;
    }
    
    /**
     * Десериализация сущности
     * @param data результат сериализации, см. Referent.Serialize()
     * @param ontologyElement если не null, то элемент будет добавляться к внутренней онтологии, 
     *  и при привязке к нему у сущности будет устанавливаться соответствующее свойство (Referent.OntologyElement)
     * @return 
     */
    deserialize_referent(data, identity, create_links1 = true) {
        try {
            let xml = new XmlDocument();
            xml.loadXml(data);
            return this.deserialize_referent_from_xml(xml.document_element, identity, create_links1);
        } catch (ex) {
            return null;
        }
    }
    
    /**
     * Десериализация сущности из узла XML
     * @param xml 
     * @param identity 
     * @return 
     */
    deserialize_referent_from_xml(xml, identity, create_links1 = true) {
        try {
            let res = null;
            for (const a of this.analyzers) {
                if ((((res = a.create_referent(xml.name)))) !== null) 
                    break;
            }
            if (res === null) 
                return null;
            for (const x of xml.child_nodes) {
                if (x.local_name === "#text") 
                    continue;
                let nam = x.name;
                if (nam.startsWith("ATCOM_")) 
                    nam = "@" + nam.substring(6);
                let att = Utils.getXmlAttrByName(x.attributes, "ref");
                let slot = null;
                if (att !== null && att.value === "true") {
                    let pr = ProxyReferent._new2837(x.inner_text, res);
                    slot = (pr.owner_slot = res.add_slot(nam, pr, false, 0));
                    if ((((att = Utils.getXmlAttrByName(x.attributes, "id")))) !== null) 
                        pr.identity = att.value;
                    if (this.m_refs === null) 
                        this.m_refs = new Array();
                    this.m_refs.push(pr);
                }
                else 
                    slot = res.add_slot(nam, x.inner_text, false, 0);
                if ((((att = Utils.getXmlAttrByName(x.attributes, "count")))) !== null) {
                    let cou = 0;
                    let wrapcou2838 = new RefOutArgWrapper();
                    let inoutres2839 = Utils.tryParseInt(att.value, wrapcou2838);
                    cou = wrapcou2838.value;
                    if (inoutres2839) 
                        slot.count = cou;
                }
            }
            if (this.m_links === null) 
                this.m_links = new Hashtable();
            if (this.m_links2 === null) 
                this.m_links2 = new Hashtable();
            if (create_links1) {
                let key = res.toString();
                if (!this.m_links.containsKey(key)) 
                    this.m_links.put(key, res);
            }
            if (!Utils.isNullOrEmpty(identity)) {
                res.tag = identity;
                if (!this.m_links2.containsKey(identity)) 
                    this.m_links2.put(identity, res);
            }
            return res;
        } catch (ex) {
            return null;
        }
    }
    
    static static_constructor() {
        Processor.morph_coef = 10;
    }
}


Processor.ProgressChangedEventHandler_OnProgressHandler = class  extends EventHandler {
    
    constructor(src) {
        super();
        this.m_source = null;
        this.m_source = src;
    }
    
    call(sender, e) {
        this.m_source.on_progress_handler(sender, e);
    }
}


Processor.CancelEventHandler_OnCancel = class  extends EventHandler {
    
    constructor(src) {
        super();
        this.m_source = null;
        this.m_source = src;
    }
    
    call(sender, e) {
        this.m_source.on_cancel(sender, e);
    }
}


Processor.static_constructor();

module.exports = Processor
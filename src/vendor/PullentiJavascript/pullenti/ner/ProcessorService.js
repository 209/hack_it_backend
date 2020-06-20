/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const Hashtable = require("./../unisharp/Hashtable");
const RefOutArgWrapper = require("./../unisharp/RefOutArgWrapper");

const ImageWrapper = require("./ImageWrapper");
const EpNerCoreInternalResourceHelper = require("./core/internal/EpNerCoreInternalResourceHelper");
const Morphology = require("./../morph/Morphology");
const Explanatory = require("./../semantic/utils/Explanatory");
const Termin = require("./core/Termin");
const NumberHelper = require("./core/NumberHelper");

/**
 * Глобальная служба семантического процессора
 */
class ProcessorService {
    
    /**
     * [Get] Версия системы
     */
    static get_version() {
        return "3.22";
    }
    
    /**
     * [Get] Дата-время текущей версии
     */
    static get_version_date() {
        return new Date(2020, 5 - 1, 16, 0, 0, 0);
    }
    
    /**
     * Инициализация сервиса.   
     *  Внимание! После этого нужно инициализровать анализаторы (см. документацию) 
     *  <param name="lang">необходимые языки (по умолчанию, русский и английский)</param>
     */
    static initialize(lang = null) {
        const NumberExHelper = require("./core/internal/NumberExHelper");
        const BlockLine = require("./core/internal/BlockLine");
        const NounPhraseItem = require("./core/internal/NounPhraseItem");
        const PrepositionHelper = require("./core/PrepositionHelper");
        const ConjunctionHelper = require("./core/ConjunctionHelper");
        if (ProcessorService.m_inited) 
            return;
        ProcessorService.m_inited = true;
        Morphology.initialize(lang);
        Explanatory.initialize(lang);
        Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
        PrepositionHelper.initialize();
        ConjunctionHelper.initialize();
        NounPhraseItem.initialize();
        NumberHelper.initialize();
        NumberExHelper.initialize();
        BlockLine.initialize();
        Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
    }
    
    /**
     * [Get] Признак того, что инициализация сервиса уже была
     */
    static is_initialized() {
        return ProcessorService.m_inited;
    }
    
    /**
     * Создать процессор со стандартным списком анализаторов (у которых свойство IsSpecific = false)
     * @return экземпляр процессора
     */
    static create_processor() {
        const Processor = require("./Processor");
        if (!ProcessorService.m_inited) 
            return null;
        let proc = new Processor();
        for (const t of ProcessorService.m_analizer_instances) {
            let a = t.clone();
            if (a !== null && !a.is_specific) 
                proc.add_analyzer(a);
        }
        return proc;
    }
    
    /**
     * Создать процессор с набором стандартных и указанных параметром специфических 
     *  анализаторов.
     * @param spec_analyzer_names можно несколько, разделённые запятой или точкой с запятой.  
     *  Если список пустой, то эквивалентно CreateProcessor()
     * @return 
     */
    static create_specific_processor(spec_analyzer_names) {
        const Processor = require("./Processor");
        if (!ProcessorService.m_inited) 
            return null;
        let proc = new Processor();
        let names = Array.from(Utils.splitString(((spec_analyzer_names != null ? spec_analyzer_names : "")), ',' + ';' + ' ', false));
        for (const t of ProcessorService.m_analizer_instances) {
            let a = t.clone();
            if (a !== null) {
                if (!a.is_specific || names.includes(a.name)) 
                    proc.add_analyzer(a);
            }
        }
        return proc;
    }
    
    /**
     * Создать экземпляр процессора с пустым списком анализаторов
     * @return 
     */
    static create_empty_processor() {
        const Processor = require("./Processor");
        return new Processor();
    }
    
    /**
     * Регистрация аналозатора. Вызывается при инициализации из инициализируемой сборки 
     *  (она сама знает, какие содержит анализаторы, и регистрирует их)
     * @param analyzer 
     */
    static register_analyzer(analyzer) {
        try {
            ProcessorService.m_analizer_instances.push(analyzer);
            let img = analyzer.images;
            if (img !== null) {
                for (const kp of img.entries) {
                    if (!ProcessorService.m_images.containsKey(kp.key)) 
                        ProcessorService.m_images.put(kp.key, ImageWrapper._new2840(kp.key, kp.value));
                }
            }
        } catch (ex) {
        }
        ProcessorService._reorder_cartridges();
    }
    
    static _reorder_cartridges() {
        if (ProcessorService.m_analizer_instances.length === 0) 
            return;
        for (let k = 0; k < ProcessorService.m_analizer_instances.length; k++) {
            for (let i = 0; i < (ProcessorService.m_analizer_instances.length - 1); i++) {
                let max_ind = -1;
                let li = ProcessorService.m_analizer_instances[i].used_extern_object_types;
                if (li !== null) {
                    for (const v of ProcessorService.m_analizer_instances[i].used_extern_object_types) {
                        for (let j = i + 1; j < ProcessorService.m_analizer_instances.length; j++) {
                            if (ProcessorService.m_analizer_instances[j].type_system !== null) {
                                for (const st of ProcessorService.m_analizer_instances[j].type_system) {
                                    if (st.name === v) {
                                        if ((max_ind < 0) || (max_ind < j)) 
                                            max_ind = j;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                if (max_ind <= i) {
                    if (ProcessorService.m_analizer_instances[i].is_specific && !ProcessorService.m_analizer_instances[i + 1].is_specific) {
                    }
                    else 
                        continue;
                }
                let cart = ProcessorService.m_analizer_instances[i];
                ProcessorService.m_analizer_instances.splice(i, 1);
                ProcessorService.m_analizer_instances.push(cart);
            }
        }
    }
    
    /**
     * [Get] Экземпляры доступных анализаторов
     */
    static get_analyzers() {
        return ProcessorService.m_analizer_instances;
    }
    
    /**
     * Создать экземпляр объекта заданного типа
     * @param type_name имя типа
     * @return результат
     */
    static create_referent(type_name) {
        const Referent = require("./Referent");
        for (const cart of ProcessorService.m_analizer_instances) {
            let obj = cart.create_referent(type_name);
            if (obj !== null) 
                return obj;
        }
        return new Referent(type_name);
    }
    
    /**
     * Получить иконку по идентификатору иконки
     * @param image_id 
     * @return 
     */
    static get_image_by_id(image_id) {
        if (image_id !== null) {
            let res = null;
            let wrapres2841 = new RefOutArgWrapper();
            let inoutres2842 = ProcessorService.m_images.tryGetValue(image_id, wrapres2841);
            res = wrapres2841.value;
            if (inoutres2842) 
                return res;
        }
        if (ProcessorService.m_unknown_image === null) 
            ProcessorService.m_unknown_image = ImageWrapper._new2840("unknown", EpNerCoreInternalResourceHelper.get_bytes("unknown.png"));
        return ProcessorService.m_unknown_image;
    }
    
    /**
     * Добавить специфическую иконку
     * @param image_id идентификатор (возвращаемый Referent.getImageId())
     * @param content содержимое иконки
     */
    static add_image(image_id, content) {
        if (image_id === null) 
            return;
        let wr = ImageWrapper._new2840(image_id, content);
        if (ProcessorService.m_images.containsKey(image_id)) 
            ProcessorService.m_images.put(image_id, wr);
        else 
            ProcessorService.m_images.put(image_id, wr);
    }
    
    /**
     * [Get] Экземпляр процессора с пустым множеством анализаторов (используется для 
     *  разных лингвистических процедур, где не нужны сущности)
     */
    static get_empty_processor() {
        if (ProcessorService.m_empty_processor === null) 
            ProcessorService.m_empty_processor = ProcessorService.create_empty_processor();
        return ProcessorService.m_empty_processor;
    }
    
    static static_constructor() {
        ProcessorService.m_inited = false;
        ProcessorService.m_analizer_instances = new Array();
        ProcessorService.m_images = new Hashtable();
        ProcessorService.m_unknown_image = null;
        ProcessorService.m_empty_processor = null;
    }
}


ProcessorService.static_constructor();

module.exports = ProcessorService
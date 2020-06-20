/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const ProgressEventArgs = require("./../unisharp/ProgressEventArgs");
const CancelEventArgs = require("./../unisharp/CancelEventArgs");

const AnalyzerData = require("./core/AnalyzerData");

/**
 * Базовый класс для всех семантических анализаторов
 */
class Analyzer {
    
    constructor() {
        this.progress = new Array();
        this.cancel = new Array();
        this.last_percent = 0;
        this._persistreferentsregim = false;
        this._ignorethisanalyzer = false;
        this.persist_analizer_data = null;
    }
    
    /**
     * Запустить анализ
     * @param kit контейнер с данными
     */
    process(kit) {
        
    }
    
    /**
     * [Get] Уникальное наименование анализатора
     */
    get name() {
        return null;
    }
    
    /**
     * [Get] Заголовок анализатора
     */
    get caption() {
        return null;
    }
    
    /**
     * [Get] Описание анализатора
     */
    get description() {
        return null;
    }
    
    toString() {
        return (this.caption + " (" + this.name + ")");
    }
    
    clone() {
        return null;
    }
    
    /**
     * [Get] Список поддерживаемых типов объектов (сущностей), которые выделяет анализатор
     */
    get type_system() {
        return new Array();
    }
    
    /**
     * [Get] Список изображений объектов
     */
    get images() {
        return null;
    }
    
    /**
     * [Get] Признак специфического анализатора (предназначенного для конкретной предметной области). 
     *  Специфические анализаторы по умолчанию не добавляются в процессор (Processor)
     */
    get is_specific() {
        return false;
    }
    
    /**
     * Создать объект указанного типа
     * @param type 
     * @return 
     */
    create_referent(type) {
        return null;
    }
    
    /**
     * [Get] Список имён типов объектов из других картриджей, которые желательно предварительно выделить (для управления приоритетом применения правил)
     */
    get used_extern_object_types() {
        return Analyzer.empty_list;
    }
    
    /**
     * [Get] Сколько примерно времени работает анализатор по сравнению с другими (в условных единицах)
     */
    get progress_weight() {
        return 0;
    }
    
    on_progress(pos, max, kit) {
        let ret = true;
        if (this.progress.length > 0) {
            if (pos >= 0 && pos <= max && max > 0) {
                let percent = pos;
                if (max > 1000000) 
                    percent = Utils.intDiv(percent, (Utils.intDiv(max, 1000)));
                else 
                    percent = Utils.intDiv((100 * percent), max);
                if (percent !== this.last_percent) {
                    let arg = new ProgressEventArgs(percent, null);
                    for(const eventitem of this.progress) eventitem.call(this, arg);
                    if (this.cancel.length > 0) {
                        let cea = new CancelEventArgs();
                        for(const eventitem of this.cancel) eventitem.call(kit, cea);
                        ret = !cea.cancel;
                    }
                }
                this.last_percent = percent;
            }
        }
        return ret;
    }
    
    on_message(message) {
        if (this.progress.length > 0) 
            for(const eventitem of this.progress) eventitem.call(this, new ProgressEventArgs(-1, message));
        return true;
    }
    
    /**
     * [Get] Включить режим накопления выделяемых сущностей при обработке разных SourceOfText 
     *  (то есть локальные сущности будут накапливаться)
     */
    get persist_referents_regim() {
        return this._persistreferentsregim;
    }
    /**
     * [Set] Включить режим накопления выделяемых сущностей при обработке разных SourceOfText 
     *  (то есть локальные сущности будут накапливаться)
     */
    set persist_referents_regim(value) {
        this._persistreferentsregim = value;
        return this._persistreferentsregim;
    }
    
    /**
     * [Get] При установке в true будет игнорироваться при обработке (для отладки)
     */
    get ignore_this_analyzer() {
        return this._ignorethisanalyzer;
    }
    /**
     * [Set] При установке в true будет игнорироваться при обработке (для отладки)
     */
    set ignore_this_analyzer(value) {
        this._ignorethisanalyzer = value;
        return this._ignorethisanalyzer;
    }
    
    /**
     * Используется внутренним образом
     * @return 
     */
    create_analyzer_data() {
        return new AnalyzerData();
    }
    
    /**
     * Попытаться выделить сущность в указанном диапазоне (используется внутренним образом). 
     *  Кстати, выделенная сущность не сохраняется в локальной онтологии.
     * @param begin начало диапазона
     * @param end конец диапазона (если null, то до конца)
     * @return результат
     */
    process_referent(begin, end) {
        return null;
    }
    
    /**
     * Это используется внутренним образом для обработки внешних онтологий
     * @param begin 
     * @return 
     */
    process_ontology_item(begin) {
        return null;
    }
    
    static static_constructor() {
        Analyzer.empty_list = new Array();
    }
}


Analyzer.static_constructor();

module.exports = Analyzer
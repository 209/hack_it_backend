/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");

const Analyzer = require("./../Analyzer");
const Termin = require("./../core/Termin");
const InstrumentArtefact = require("./InstrumentArtefact");
const InstrumentKind = require("./InstrumentKind");
const MetaInstrumentBlock = require("./internal/MetaInstrumentBlock");
const InstrumentBlockReferent = require("./InstrumentBlockReferent");
const InstrToken = require("./internal/InstrToken");
const ProcessorService = require("./../ProcessorService");
const InstrumentArtefactMeta = require("./internal/InstrumentArtefactMeta");
const MetaInstrument = require("./internal/MetaInstrument");
const InstrumentParticipant = require("./InstrumentParticipant");
const EpNerCoreInternalResourceHelper = require("./../core/internal/EpNerCoreInternalResourceHelper");
const InstrumentParticipantMeta = require("./internal/InstrumentParticipantMeta");
const InstrumentReferent = require("./InstrumentReferent");

/**
 * Анализатор структуры нормативных актов и договоров
 */
class InstrumentAnalyzer extends Analyzer {
    
    get name() {
        return InstrumentAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Структура нормативно-правовых документов (НПА)";
    }
    
    get description() {
        return "Разбор структуры НПА на разделы и подразделы";
    }
    
    clone() {
        return new InstrumentAnalyzer();
    }
    
    /**
     * [Get] Этот анализатор является специфическим
     */
    get is_specific() {
        return true;
    }
    
    get progress_weight() {
        return 1;
    }
    
    get type_system() {
        return [MetaInstrument.GLOBAL_META, MetaInstrumentBlock.GLOBAL_META, InstrumentParticipantMeta.GLOBAL_META, InstrumentArtefactMeta.GLOBAL_META];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(MetaInstrument.DOC_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("decree.png"));
        res.put(MetaInstrumentBlock.PART_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("part.png"));
        res.put(InstrumentParticipantMeta.IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("participant.png"));
        res.put(InstrumentArtefactMeta.IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("artefact.png"));
        return res;
    }
    
    create_referent(type) {
        if (type === InstrumentReferent.OBJ_TYPENAME) 
            return new InstrumentReferent();
        if (type === InstrumentBlockReferent.OBJ_TYPENAME) 
            return new InstrumentBlockReferent();
        if (type === InstrumentParticipant.OBJ_TYPENAME) 
            return new InstrumentParticipant();
        if (type === InstrumentArtefact.OBJ_TYPENAME) 
            return new InstrumentArtefact();
        return null;
    }
    
    process(kit) {
        const FragToken = require("./internal/FragToken");
        let t = kit.first_token;
        let t1 = t;
        if (t === null) 
            return;
        let dfr = FragToken.create_document(t, 0, InstrumentKind.UNDEFINED);
        if (dfr === null) 
            return;
        let ad = kit.get_analyzer_data(this);
        let res = dfr.create_referent(ad);
    }
    
    static initialize() {
        const ParticipantToken = require("./internal/ParticipantToken");
        if (InstrumentAnalyzer.m_inited) 
            return;
        InstrumentAnalyzer.m_inited = true;
        InstrumentArtefactMeta.initialize();
        MetaInstrumentBlock.initialize();
        MetaInstrument.initialize();
        InstrumentParticipantMeta.initialize();
        try {
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
            InstrToken.initialize();
            ParticipantToken.initialize();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
        } catch (ex) {
            throw new Error(ex.message);
        }
        ProcessorService.register_analyzer(new InstrumentAnalyzer());
    }
    
    static static_constructor() {
        InstrumentAnalyzer.ANALYZER_NAME = "INSTRUMENT";
        InstrumentAnalyzer.m_inited = false;
    }
}


InstrumentAnalyzer.static_constructor();

module.exports = InstrumentAnalyzer
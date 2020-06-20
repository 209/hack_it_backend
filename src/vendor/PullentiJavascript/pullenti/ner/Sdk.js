/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ProcessorService = require("./ProcessorService");
const DecreeAnalyzer = require("./decree/DecreeAnalyzer");
const InstrumentAnalyzer = require("./instrument/InstrumentAnalyzer");
const TransportAnalyzer = require("./transport/TransportAnalyzer");
const PersonAnalyzer = require("./person/PersonAnalyzer");
const MailAnalyzer = require("./mail/MailAnalyzer");
const TitlePageAnalyzer = require("./titlepage/TitlePageAnalyzer");
const NamedEntityAnalyzer = require("./named/NamedEntityAnalyzer");
const WeaponAnalyzer = require("./weapon/WeaponAnalyzer");
const GoodsAnalyzer = require("./goods/GoodsAnalyzer");
const BookLinkAnalyzer = require("./booklink/BookLinkAnalyzer");
const BusinessAnalyzer = require("./business/BusinessAnalyzer");
const OrganizationAnalyzer = require("./org/OrganizationAnalyzer");
const DateAnalyzer = require("./date/DateAnalyzer");
const UriAnalyzer = require("./uri/UriAnalyzer");
const KeywordAnalyzer = require("./keyword/KeywordAnalyzer");
const MoneyAnalyzer = require("./money/MoneyAnalyzer");
const PhoneAnalyzer = require("./phone/PhoneAnalyzer");
const DefinitionAnalyzer = require("./definition/DefinitionAnalyzer");
const AddressAnalyzer = require("./address/AddressAnalyzer");
const GeoAnalyzer = require("./geo/GeoAnalyzer");
const BankAnalyzer = require("./bank/BankAnalyzer");
const DenominationAnalyzer = require("./denomination/DenominationAnalyzer");
const MeasureAnalyzer = require("./measure/MeasureAnalyzer");

/**
 * Инициализация SDK
 */
class Sdk {
    
    static get_version() {
        return ProcessorService.get_version();
    }
    
    /**
     * Вызывать инициализацию в самом начале
     * @param lang по умолчанию, русский и английский
     */
    static initialize(lang = null) {
        // сначала инициализация всего сервиса
        ProcessorService.initialize(lang);
        // а затем конкретные анализаторы (какие нужно, в данном случае - все)
        MoneyAnalyzer.initialize();
        UriAnalyzer.initialize();
        PhoneAnalyzer.initialize();
        DateAnalyzer.initialize();
        KeywordAnalyzer.initialize();
        DefinitionAnalyzer.initialize();
        DenominationAnalyzer.initialize();
        MeasureAnalyzer.initialize();
        BankAnalyzer.initialize();
        GeoAnalyzer.initialize();
        AddressAnalyzer.initialize();
        OrganizationAnalyzer.initialize();
        PersonAnalyzer.initialize();
        MailAnalyzer.initialize();
        TransportAnalyzer.initialize();
        DecreeAnalyzer.initialize();
        InstrumentAnalyzer.initialize();
        TitlePageAnalyzer.initialize();
        BookLinkAnalyzer.initialize();
        BusinessAnalyzer.initialize();
        GoodsAnalyzer.initialize();
        NamedEntityAnalyzer.initialize();
        WeaponAnalyzer.initialize();
    }
}


module.exports = Sdk
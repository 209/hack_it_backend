/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const Hashtable = require("./../../../unisharp/Hashtable");

const MorphGender = require("./../../../morph/MorphGender");
const MorphClass = require("./../../../morph/MorphClass");
const Unit = require("./Unit");
const TerminCollection = require("./../../core/TerminCollection");
const Termin = require("./../../core/Termin");
const UnitsFactors = require("./UnitsFactors");
const MeasureKind = require("./../MeasureKind");
const TextToken = require("./../../TextToken");
const MetaToken = require("./../../MetaToken");

class UnitsHelper {
    
    static find_unit(v, fact) {
        if (fact !== UnitsFactors.NO) {
            for (const u of UnitsHelper.UNITS) {
                if (u.base_unit !== null && u.factor === fact) {
                    if ((u.base_unit.fullname_cyr === v || u.base_unit.fullname_lat === v || u.base_unit.name_cyr === v) || u.base_unit.name_lat === v) 
                        return u;
                }
            }
        }
        for (const u of UnitsHelper.UNITS) {
            if ((u.fullname_cyr === v || u.fullname_lat === v || u.name_cyr === v) || u.name_lat === v) 
                return u;
        }
        return null;
    }
    
    static check_keyword(ki, t) {
        if (t === null || ki === MeasureKind.UNDEFINED) 
            return false;
        if (t instanceof MetaToken) {
            for (let tt = (t).begin_token; tt !== null && tt.end_char <= t.end_char; tt = tt.next) {
                if (UnitsHelper.check_keyword(ki, tt)) 
                    return true;
            }
            return false;
        }
        if (!((t instanceof TextToken))) 
            return false;
        let term = t.get_normal_case_text(MorphClass.NOUN, true, MorphGender.UNDEFINED, false);
        for (const u of UnitsHelper.UNITS) {
            if (u.kind === ki) {
                if (u.keywords.includes(term)) 
                    return true;
            }
        }
        if (UnitsHelper.m_kinds_keywords.containsKey(ki)) {
            if (UnitsHelper.m_kinds_keywords.get(ki).includes(term)) 
                return true;
        }
        return false;
    }
    
    static initialize() {
        if (UnitsHelper.m_inited) 
            return;
        UnitsHelper.m_inited = true;
        UnitsHelper.UNITS = new Array();
        UnitsHelper.TERMINS = new TerminCollection();
        UnitsHelper.m_kinds_keywords = new Hashtable();
        UnitsHelper.m_kinds_keywords.put(MeasureKind.SPEED, Array.from(["СКОРОСТЬ", "SPEED", "ШВИДКІСТЬ"]));
        Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
        let u = null;
        let uu = null;
        let t = null;
        u = Unit._new1641("м", "m", "метр", "meter", MeasureKind.LENGTH);
        u.keywords.splice(u.keywords.length, 0, ...["ДЛИНА", "ДЛИННА", "ШИРИНА", "ГЛУБИНА", "ВЫСОТА", "РАЗМЕР", "ГАБАРИТ", "РАССТОЯНИЕ", "РАДИУС", "ПЕРИМЕТР", "ДИАМЕТР", "ТОЛЩИНА", "ПОДАЧА", "НАПОР", "ДАЛЬНОСТЬ", "ТИПОРАЗМЕР", "КАЛИБР", "LENGTH", "WIDTH", "DEPTH", "HEIGHT", "SIZE", "ENVELOPE", "DISTANCE", "RADIUS", "PERIMETER", "DIAMETER", "FLOW", "PRESSURE", "CALIBER", "ДОВЖИНА", "ШИРИНА", "ГЛИБИНА", "ВИСОТА", "РОЗМІР", "ГАБАРИТ", "ВІДСТАНЬ", "РАДІУС", "ДІАМЕТР", "НАТИСК", "КАЛІБР"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("МЕТР", u);
        t.add_variant("МЕТРОВЫЙ", false);
        t.add_variant("МЕТРОВИЙ", false);
        t.add_variant("METER", false);
        t.add_abridge("М.");
        t.add_abridge("M.");
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.KILO, UnitsFactors.DECI, UnitsFactors.CENTI, UnitsFactors.MILLI, UnitsFactors.MICRO, UnitsFactors.NANO]) {
            UnitsHelper._add_factor(f, u, "М.", "M.", "МЕТР;МЕТРОВЫЙ", "МЕТР;МЕТРОВИЙ", "METER;METRE");
        }
        uu = Unit._new1641("миль", "mile", "морская миля", "mile", MeasureKind.LENGTH);
        uu.base_unit = u;
        uu.base_multiplier = 1852;
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("МИЛЯ", uu);
        t.add_variant("МОРСКАЯ МИЛЯ", false);
        t.add_abridge("NMI");
        t.add_variant("MILE", false);
        t.add_variant("NAUTICAL MILE", false);
        UnitsHelper.TERMINS.add(t);
        uu = Unit._new1645("фут", "ft", "фут", "foot", u, 0.304799472, MeasureKind.LENGTH);
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("ФУТ", uu);
        t.add_abridge("FT.");
        t.add_variant("FOOT", false);
        UnitsHelper.TERMINS.add(t);
        uu = Unit._new1645("дюйм", "in", "дюйм", "inch", u, 0.0254, MeasureKind.LENGTH);
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("ДЮЙМ", uu);
        t.add_abridge("IN");
        t.add_variant("INCH", false);
        UnitsHelper.TERMINS.add(t);
        u = Unit._new1641("ар", "are", "ар", "are", MeasureKind.AREA);
        u.keywords.splice(u.keywords.length, 0, ...["ПЛОЩАДЬ", "ПРОЩИНА", "AREA", "SQWARE", "SPACE"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("АР", u);
        t.add_variant("ARE", false);
        t.add_variant("СОТКА", false);
        UnitsHelper.TERMINS.add(t);
        uu = Unit._new1641("га", "ga", "гектар", "hectare", MeasureKind.AREA);
        uu.base_unit = u;
        uu.base_multiplier = 100;
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("ГЕКТАР", uu);
        t.add_variant("HECTARE", false);
        t.add_abridge("ГА");
        t.add_abridge("GA");
        UnitsHelper.TERMINS.add(t);
        u = Unit._new1641("г", "g", "грамм", "gram", MeasureKind.WEIGHT);
        u.keywords.splice(u.keywords.length, 0, ...["ВЕС", "ТЯЖЕСТЬ", "НЕТТО", "БРУТТО", "МАССА", "НАГРУЗКА", "ЗАГРУЗКА", "УПАКОВКА", "WEIGHT", "NET", "GROSS", "MASS", "ВАГА", "ТЯЖКІСТЬ", "МАСА"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("ГРАММ", u);
        t.add_abridge("Г.");
        t.add_abridge("ГР.");
        t.add_abridge("G.");
        t.add_abridge("GR.");
        t.add_variant("ГРАММОВЫЙ", false);
        t.add_variant("ГРАММНЫЙ", false);
        t.add_variant("ГРАМОВИЙ", false);
        t.add_variant("GRAM", false);
        t.add_variant("GRAMME", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.KILO, UnitsFactors.MILLI]) {
            UnitsHelper._add_factor(f, u, "Г.;ГР;", "G.;GR.", "ГРАМ;ГРАММ;ГРАММНЫЙ", "ГРАМ;ГРАМОВИЙ", "GRAM;GRAMME");
        }
        uu = Unit._new1645("ц", "centner", "центнер", "centner", u, 100000, MeasureKind.WEIGHT);
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("ЦЕНТНЕР", uu);
        t.add_variant("CENTNER", false);
        t.add_variant("QUINTAL", false);
        t.add_abridge("Ц.");
        UnitsHelper.TERMINS.add(t);
        uu = Unit._new1645("т", "t", "тонна", "tonne", u, 1000000, MeasureKind.WEIGHT);
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("ТОННА", uu);
        t.add_variant("TONNE", false);
        t.add_variant("TON", false);
        t.add_abridge("Т.");
        t.add_abridge("T.");
        UnitsHelper.TERMINS.add(t);
        UnitsHelper._add_factor(UnitsFactors.MEGA, uu, "Т", "T", "ТОННА;ТОННЫЙ", "ТОННА;ТОННИЙ", "TONNE;TON");
        u = Unit._new1641("л", "l", "литр", "liter", MeasureKind.VOLUME);
        u.keywords.splice(u.keywords.length, 0, ...["ОБЪЕМ", "ЕМКОСТЬ", "ВМЕСТИМОСЬ", "ОБСЯГ", "ЄМНІСТЬ", "МІСТКІСТЬ", "VOLUME", "CAPACITY"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("ЛИТР", u);
        t.add_abridge("Л.");
        t.add_abridge("L.");
        t.add_variant("LITER", false);
        t.add_variant("LITRE", false);
        t.add_variant("ЛІТР", false);
        t.add_variant("ЛІТРОВИЙ", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.MILLI, UnitsFactors.CENTI]) {
            UnitsHelper._add_factor(f, u, "Л.", "L.", "ЛИТР;ЛИТРОВЫЙ", "ЛІТР;ЛІТРОВИЙ", "LITER;LITRE");
        }
        uu = Unit._new1645("галлон", "gallon", "галлон", "gallon", u, 4.5461, MeasureKind.VOLUME);
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("ГАЛЛОН", u);
        t.add_variant("ГАЛОН", false);
        t.add_variant("GALLON", false);
        t.add_abridge("ГАЛ");
        UnitsHelper.TERMINS.add(t);
        uu = Unit._new1645("баррель", "bbls", "баррель нефти", "barrel", u, 158.987, MeasureKind.VOLUME);
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("БАРРЕЛЬ", uu);
        t.add_abridge("BBLS");
        t.add_variant("БАРРЕЛЬ НЕФТИ", false);
        t.add_variant("BARRREL", false);
        UnitsHelper.TERMINS.add(t);
        UnitsHelper.USEC = (u = Unit._new1641("сек", "sec", "секунда", "second", MeasureKind.TIME));
        u.keywords.splice(u.keywords.length, 0, ...["ВРЕМЯ", "ПРОДОЛЖИТЕЛЬНОСТЬ", "ЗАДЕРЖКА", "ДЛИТЕЛЬНОСТЬ", "ДОЛГОТА", "TIME", "DURATION", "DELAY", "ЧАС", "ТРИВАЛІСТЬ", "ЗАТРИМКА"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("СЕКУНДА", u);
        t.add_abridge("С.");
        t.add_abridge("C.");
        t.add_abridge("СЕК");
        t.add_abridge("СЕК");
        t.add_abridge("S.");
        t.add_abridge("SEC");
        t.add_variant("СЕКУНДНЫЙ", false);
        t.add_variant("СЕКУНДНИЙ", false);
        t.add_variant("SECOND", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.MILLI, UnitsFactors.MICRO]) {
            UnitsHelper._add_factor(f, u, "С.;СЕК", "C;S.;SEC;", "СЕКУНДА;СЕКУНДНЫЙ", "СЕКУНДА;СЕКУНДНИЙ", "SECOND");
        }
        UnitsHelper.UMINUTE = (uu = Unit._new1641("мин", "min", "минута", "minute", MeasureKind.TIME));
        uu.base_unit = u;
        uu.base_multiplier = 60;
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("МИНУТА", uu);
        t.add_abridge("МИН.");
        t.add_abridge("MIN.");
        t.add_variant("МИНУТНЫЙ", false);
        t.add_variant("ХВИЛИННИЙ", false);
        t.add_variant("ХВИЛИНА", false);
        t.add_variant("МІНУТА", false);
        t.add_variant("MINUTE", false);
        UnitsHelper.TERMINS.add(t);
        u = uu;
        UnitsHelper.UHOUR = (uu = Unit._new1645("ч", "h", "час", "hour", u, 60, MeasureKind.TIME));
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("ЧАС", uu);
        t.add_abridge("Ч.");
        t.add_abridge("H.");
        t.add_variant("ЧАСОВОЙ", false);
        t.add_variant("HOUR", false);
        t.add_variant("ГОДИННИЙ", false);
        t.add_variant("ГОДИНА", false);
        UnitsHelper.TERMINS.add(t);
        u = Unit._new1641("дн", "d", "день", "day", MeasureKind.TIME);
        u.keywords.splice(u.keywords.length, 0, ...UnitsHelper.USEC.keywords);
        u.keywords.splice(u.keywords.length, 0, ...["ПОСТАВКА", "СРОК", "РАБОТА", "ЗАВЕРШЕНИЕ"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("ДЕНЬ", u);
        t.add_abridge("ДН.");
        t.add_abridge("Д.");
        t.add_variant("DAY", false);
        UnitsHelper.TERMINS.add(t);
        uu = Unit._new1641("сут", "d", "сутки", "day", MeasureKind.TIME);
        uu.keywords.splice(uu.keywords.length, 0, ...uu.keywords);
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("СУТКИ", uu);
        t.add_abridge("СУТ.");
        t.add_variant("DAY", false);
        UnitsHelper.TERMINS.add(t);
        uu = Unit._new1645("нед", "week", "неделя", "week", u, 7, MeasureKind.TIME);
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("НЕДЕЛЯ", uu);
        t.add_abridge("НЕД");
        t.add_variant("WEEK", false);
        t.add_variant("ТИЖДЕНЬ", false);
        UnitsHelper.TERMINS.add(t);
        uu = Unit._new1645("мес", "mon", "месяц", "month", u, 30, MeasureKind.TIME);
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("МЕСЯЦ", uu);
        t.add_abridge("МЕС");
        t.add_abridge("MON");
        t.add_variant("MONTH", false);
        t.add_variant("МІСЯЦЬ", false);
        UnitsHelper.TERMINS.add(t);
        uu = Unit._new1645("г", "year", "год", "year", u, 365, MeasureKind.TIME);
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("ГОД", uu);
        t.add_abridge("Г.");
        t.add_abridge("ГД");
        t.add_variant("YEAR", false);
        t.add_variant("РІК", false);
        t.add_variant("ЛЕТ", false);
        UnitsHelper.TERMINS.add(t);
        UnitsHelper.UGRADUS = new Unit("°", "°", "градус", "degree");
        UnitsHelper.UGRADUS.keywords.splice(UnitsHelper.UGRADUS.keywords.length, 0, ...["ТЕМПЕРАТУРА", "ШИРОТА", "ДОЛГОТА", "АЗИМУТ", "ДОВГОТА", "TEMPERATURE", "LATITUDE", "LONGITUDE", "AZIMUTH"]);
        UnitsHelper.UNITS.push(UnitsHelper.UGRADUS);
        t = Termin._new119("ГРАДУС", UnitsHelper.UGRADUS);
        t.add_variant("DEGREE", false);
        UnitsHelper.TERMINS.add(t);
        UnitsHelper.UGRADUSC = Unit._new1641("°C", "°C", "градус Цельсия", "celsius degree", MeasureKind.TEMPERATURE);
        UnitsHelper.UGRADUSC.keywords.push("ТЕМПЕРАТУРА");
        UnitsHelper.UGRADUS.keywords.push("TEMPERATURE");
        UnitsHelper.UGRADUS.psevdo.push(UnitsHelper.UGRADUSC);
        UnitsHelper.UNITS.push(UnitsHelper.UGRADUSC);
        t = Termin._new119("ГРАДУС ЦЕЛЬСИЯ", UnitsHelper.UGRADUSC);
        t.add_variant("ГРАДУС ПО ЦЕЛЬСИЮ", false);
        t.add_variant("CELSIUS DEGREE", false);
        UnitsHelper.TERMINS.add(t);
        UnitsHelper.UGRADUSF = Unit._new1641("°F", "°F", "градус Фаренгейта", "Fahrenheit degree", MeasureKind.TEMPERATURE);
        UnitsHelper.UGRADUSF.keywords = UnitsHelper.UGRADUSC.keywords;
        UnitsHelper.UGRADUS.psevdo.push(UnitsHelper.UGRADUSF);
        UnitsHelper.UNITS.push(UnitsHelper.UGRADUSF);
        t = Termin._new119("ГРАДУС ФАРЕНГЕЙТА", UnitsHelper.UGRADUSF);
        t.add_variant("ГРАДУС ПО ФАРЕНГЕЙТУ", false);
        t.add_variant("FAHRENHEIT DEGREE", false);
        UnitsHelper.TERMINS.add(t);
        UnitsHelper.UPERCENT = Unit._new1641("%", "%", "процент", "percent", MeasureKind.PERCENT);
        UnitsHelper.UNITS.push(UnitsHelper.UPERCENT);
        t = Termin._new119("ПРОЦЕНТ", UnitsHelper.UPERCENT);
        t.add_variant("ПРОЦ", false);
        t.add_variant("PERC", false);
        t.add_variant("PERCENT", false);
        UnitsHelper.TERMINS.add(t);
        UnitsHelper.UALCO = new Unit("%(об)", "%(vol)", "объёмный процент", "volume percent");
        UnitsHelper.UALCO.keywords.splice(UnitsHelper.UALCO.keywords.length, 0, ...["КРЕПОСТЬ", "АЛКОГОЛЬ", "ALCOHOL", "СПИРТ", "АЛКОГОЛЬНЫЙ", "SPIRIT"]);
        UnitsHelper.UPERCENT.psevdo.push(UnitsHelper.UALCO);
        UnitsHelper.UGRADUS.psevdo.push(UnitsHelper.UALCO);
        UnitsHelper.UNITS.push(UnitsHelper.UALCO);
        t = Termin._new119("ОБЪЕМНЫЙ ПРОЦЕНТ", UnitsHelper.UALCO);
        t.add_variant("ГРАДУС", false);
        UnitsHelper.TERMINS.add(t);
        u = new Unit("об", "rev", "оборот", "revolution");
        UnitsHelper.UGRADUS.keywords.splice(UnitsHelper.UGRADUS.keywords.length, 0, ...["ЧАСТОТА", "ВРАЩЕНИЕ", "ВРАЩАТЕЛЬНЫЙ", "СКОРОСТЬ", "ОБОРОТ", "FREQUENCY", "ROTATION", "ROTATIONAL", "SPEED", "ОБЕРТАННЯ", "ОБЕРТАЛЬНИЙ"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("ОБОРОТ", u);
        t.add_abridge("ОБ.");
        t.add_abridge("ROT.");
        t.add_abridge("REV.");
        t.add_variant("ROTATION", false);
        t.add_variant("REVOLUTION", false);
        UnitsHelper.TERMINS.add(t);
        u = new Unit("В", "V", "вольт", "volt");
        u.keywords.splice(u.keywords.length, 0, ...["ЭЛЕКТРИЧЕСКИЙ", "ПОТЕНЦИАЛ", "НАПРЯЖЕНИЕ", "ЭЛЕКТРОДВИЖУЩИЙ", "ПИТАНИЕ", "ТОК", "ПОСТОЯННЫЙ", "ПЕРЕМЕННЫЙ", "ЕЛЕКТРИЧНИЙ", "ПОТЕНЦІАЛ", "НАПРУГА", "ЕЛЕКТРОРУШІЙНОЇ", "ХАРЧУВАННЯ", "СТРУМ", "ПОСТІЙНИЙ", "ЗМІННИЙ", "ELECTRIC", "POTENTIAL", "TENSION", "ELECTROMOTIVE", "FOOD", "CURRENT", "CONSTANT", "VARIABLE"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("ВОЛЬТ", u);
        t.add_variant("VOLT", false);
        t.add_abridge("V");
        t.add_abridge("В.");
        t.add_abridge("B.");
        t.add_variant("VAC", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.KILO, UnitsFactors.MEGA, UnitsFactors.MILLI, UnitsFactors.MILLI, UnitsFactors.MICRO]) {
            UnitsHelper._add_factor(f, u, "В.", "V.", "ВОЛЬТ;ВОЛЬТНЫЙ", "ВОЛЬТ;ВОЛЬТНІ", "VOLT");
        }
        u = new Unit("Вт", "W", "ватт", "watt");
        u.keywords.splice(u.keywords.length, 0, ...["МОЩНОСТЬ", "ЭНЕРГИЯ", "ПОТОК", "ИЗЛУЧЕНИЕ", "ЭНЕРГОПОТРЕБЛЕНИЕ", "ПОТУЖНІСТЬ", "ЕНЕРГІЯ", "ПОТІК", "ВИПРОМІНЮВАННЯ", "POWER", "ENERGY", "FLOW", "RADIATION"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("ВАТТ", u);
        t.add_abridge("Вт");
        t.add_abridge("W");
        t.add_variant("WATT", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.KILO, UnitsFactors.MEGA, UnitsFactors.GIGA, UnitsFactors.MILLI]) {
            UnitsHelper._add_factor(f, u, "ВТ.", "W.", "ВАТТ;ВАТТНЫЙ", "ВАТ;ВАТНИЙ", "WATT;WATTS");
        }
        uu = Unit._new1692("л.с.", "hp", "лошадиная сила", "horsepower", u, 735.49875);
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("ЛОШАДИНАЯ СИЛА", uu);
        t.add_abridge("Л.С.");
        t.add_abridge("ЛОШ.С.");
        t.add_abridge("ЛОШ.СИЛА");
        t.add_abridge("HP");
        t.add_abridge("PS");
        t.add_abridge("SV");
        t.add_variant("HORSEPOWER", false);
        UnitsHelper.TERMINS.add(t);
        u = new Unit("Дж", "J", "джоуль", "joule");
        u.keywords.splice(u.keywords.length, 0, ...["РАБОТА", "ЭНЕРГИЯ", "ТЕПЛОТА", "ТЕПЛОВОЙ", "ТЕПЛОВЫДЕЛЕНИЕ", "МОЩНОСТЬ", "ХОЛОДИЛЬНЫЙ"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("ДЖОУЛЬ", u);
        t.add_abridge("ДЖ");
        t.add_abridge("J");
        t.add_variant("JOULE", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.KILO, UnitsFactors.MEGA, UnitsFactors.GIGA, UnitsFactors.TERA, UnitsFactors.MILLI]) {
            UnitsHelper._add_factor(f, u, "ДЖ.", "J.", "ДЖОУЛЬ", "ДЖОУЛЬ", "JOULE");
        }
        uu = new Unit("БТЕ", "BTU", "британская терминальная единица", "british terminal unit");
        uu.keywords = u.keywords;
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("БРИТАНСКАЯ ТЕРМИНАЛЬНАЯ ЕДИНИЦА", uu);
        t.add_abridge("БТЕ");
        t.add_abridge("BTU");
        t.add_variant("BRITISH TERMINAL UNIT", false);
        UnitsHelper.TERMINS.add(t);
        u = new Unit("К", "K", "кельвин", "kelvin");
        u.keywords.splice(u.keywords.length, 0, ...UnitsHelper.UGRADUSC.keywords);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("КЕЛЬВИН", u);
        t.add_abridge("К.");
        t.add_abridge("K.");
        t.add_variant("KELVIN", false);
        t.add_variant("КЕЛЬВІН", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.KILO, UnitsFactors.MEGA, UnitsFactors.GIGA, UnitsFactors.MILLI]) {
            UnitsHelper._add_factor(f, u, "К.", "K.", "КЕЛЬВИН", "КЕЛЬВІН", "KELVIN");
        }
        u = new Unit("Гц", "Hz", "герц", "herz");
        u.keywords.splice(u.keywords.length, 0, ...["ЧАСТОТА", "ЧАСТОТНЫЙ", "ПЕРИОДИЧНОСТЬ", "ПИТАНИЕ", "ЧАСТОТНИЙ", "ПЕРІОДИЧНІСТЬ", "FREQUENCY"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("ГЕРЦ", u);
        t.add_abridge("HZ");
        t.add_abridge("ГЦ");
        t.add_variant("ГЕРЦОВЫЙ", false);
        t.add_variant("ГЕРЦОВИЙ", false);
        t.add_variant("HERZ", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.KILO, UnitsFactors.MEGA, UnitsFactors.GIGA, UnitsFactors.MICRO]) {
            UnitsHelper._add_factor(f, u, "ГЦ.", "W.", "ГЕРЦ;ГЕРЦОВЫЙ", "ГЕРЦ;ГЕРЦОВИЙ", "HERZ");
        }
        UnitsHelper.UOM = (u = new Unit("Ом", "Ω", "Ом", "Ohm"));
        u.keywords.splice(u.keywords.length, 0, ...["СОПРОТИВЛЕНИЕ", "РЕЗИСТОР", "РЕЗИСТНЫЙ", "ИМПЕДАНС", "РЕЗИСТОРНЫЙ", "ОПІР", "РЕЗИСТИВНИЙ", "ІМПЕДАНС", "RESISTANCE", "RESISTOR", "RESISTIVE", "IMPEDANCE"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("ОМ", UnitsHelper.UOM);
        t.add_variant("OHM", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.KILO, UnitsFactors.MEGA, UnitsFactors.GIGA, UnitsFactors.MICRO, UnitsFactors.MILLI]) {
            UnitsHelper._add_factor(f, u, "ОМ", "Ω", "ОМ", "ОМ", "OHM");
        }
        u = new Unit("А", "A", "ампер", "ampere");
        u.keywords.splice(u.keywords.length, 0, ...["ТОК", "СИЛА", "ЭЛЕКТРИЧЕСКИЙ", "ЭЛЕКТРИЧЕСТВО", "МАГНИТ", "МАГНИТОДВИЖУЩИЙ", "ПОТРЕБЛЕНИЕ", "CURRENT", "POWER", "ELECTRICAL", "ELECTRICITY", "MAGNET", "MAGNETOMOTIVE", "CONSUMPTION", "СТРУМ", "ЕЛЕКТРИЧНИЙ", "ЕЛЕКТРИКА", "МАГНІТ", "МАГНИТОДВИЖУЩИЙ", "СПОЖИВАННЯ"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("АМПЕР", u);
        t.add_abridge("A");
        t.add_abridge("А");
        t.add_variant("АМПЕРНЫЙ", false);
        t.add_variant("AMP", false);
        t.add_variant("AMPERE", false);
        UnitsHelper.TERMINS.add(t);
        uu = Unit._new1700("Ач", "Ah", "ампер-час", "ampere-hour", u, UnitsHelper.UHOUR);
        uu.keywords.splice(uu.keywords.length, 0, ...["ЗАРЯД", "АККУМУЛЯТОР", "АККУМУЛЯТОРНЫЙ", "ЗАРЯДКА", "БАТАРЕЯ", "CHARGE", "BATTERY", "CHARGING", "АКУМУЛЯТОР", "АКУМУЛЯТОРНИЙ"]);
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("АМПЕР ЧАС", uu);
        t.add_abridge("АЧ");
        t.add_abridge("AH");
        t.add_variant("AMPERE HOUR", false);
        t.add_variant("АМПЕРЧАС", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.KILO, UnitsFactors.MEGA, UnitsFactors.GIGA, UnitsFactors.MICRO, UnitsFactors.MILLI]) {
            let u1 = UnitsHelper._add_factor(f, u, "А", "A", "АМПЕР;АМПЕРНЫЙ", "АМПЕР;АМПЕРНИЙ", "AMPERE;AMP");
            let uu1 = UnitsHelper._add_factor(f, uu, "АЧ", "AH", "АМПЕР ЧАС", "АМПЕР ЧАС", "AMPERE HOUR");
            uu1.base_unit = u1;
            uu1.mult_unit = UnitsHelper.UHOUR;
        }
        uu = new Unit("ВА", "VA", "вольт-ампер", "volt-ampere");
        uu.mult_unit = u;
        uu.base_unit = UnitsHelper.find_unit("V", UnitsFactors.NO);
        uu.keywords.splice(uu.keywords.length, 0, ...["ТОК", "СИЛА", "МОЩНОСТЬ", "ЭЛЕКТРИЧЕСКИЙ", "ПЕРЕМЕННЫЙ"]);
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("ВОЛЬТ-АМПЕР", uu);
        t.add_abridge("BA");
        t.add_abridge("BA");
        t.add_variant("VA", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.KILO, UnitsFactors.MEGA, UnitsFactors.GIGA, UnitsFactors.MICRO, UnitsFactors.MILLI]) {
            let u1 = UnitsHelper._add_factor(f, uu, "ВА;BA", "VA", "ВОЛЬТ-АМПЕР", "ВОЛЬТ-АМПЕР", "VOLT-AMPERE");
        }
        u = new Unit("лк", "lx", "люкс", "lux");
        u.keywords.splice(u.keywords.length, 0, ...["СВЕТ", "ОСВЕЩЕННОСТЬ", "ILLUMINANCE", "СВІТЛО", " ОСВІТЛЕНІСТЬ"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("ЛЮКС", u);
        t.add_abridge("ЛК");
        t.add_abridge("LX");
        t.add_variant("LUX", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.KILO, UnitsFactors.MEGA, UnitsFactors.GIGA, UnitsFactors.DECI, UnitsFactors.CENTI, UnitsFactors.MICRO, UnitsFactors.MILLI, UnitsFactors.NANO]) {
            let u1 = UnitsHelper._add_factor(f, u, "ЛК", "LX", "ЛЮКС", "ЛЮКС", "LUX");
        }
        u = new Unit("Б", "B", "белл", "bell");
        u.keywords.splice(u.keywords.length, 0, ...["ЗВУК", "ЗВУКОВОЙ", "ШУМ", "ШУМОВОЙ", "ГРОМКОСТЬ", "ГРОМКИЙ", "СИГНАЛ", "УСИЛЕНИЕ", "ЗАТУХАНИЕ", "ГАРМОНИЧЕСКИЙ", "ПОДАВЛЕНИЕ", "ЗВУКОВИЙ", "ШУМОВИЙ", "ГУЧНІСТЬ", "ГУЧНИЙ", "ПОСИЛЕННЯ", "ЗАГАСАННЯ", "ГАРМОНІЙНИЙ", "ПРИДУШЕННЯ", "SOUND", "NOISE", "VOLUME", "LOUD", "SIGNAL", "STRENGTHENING", "ATTENUATION", "HARMONIC", "SUPPRESSION"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("БЕЛЛ", u);
        t.add_abridge("Б.");
        t.add_abridge("B.");
        t.add_abridge("В.");
        t.add_variant("БЕЛ", false);
        t.add_variant("BELL", false);
        UnitsHelper.TERMINS.add(t);
        UnitsHelper._add_factor(UnitsFactors.DECI, u, "Б", "B", "БЕЛЛ;БЕЛ", "БЕЛЛ;БЕЛ", "BELL");
        u = new Unit("дБи", "dBi", "коэффициент усиления антенны", "dBi");
        u.keywords.splice(u.keywords.length, 0, ...["УСИЛЕНИЕ", "АНТЕННА", "АНТЕНА", "ПОСИЛЕННЯ", "GAIN", "ANTENNA"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("DBI", u);
        t.add_variant("ДБИ", false);
        UnitsHelper.TERMINS.add(t);
        u = new Unit("дБм", "dBm", "опорная мощность", "dBm");
        u.keywords.splice(u.keywords.length, 0, ...["МОЩНОСТЬ"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("DBM", u);
        t.add_variant("ДБМ", false);
        t.add_variant("ДВМ", false);
        UnitsHelper.TERMINS.add(t);
        u = new Unit("Ф", "F", "фарад", "farad");
        u.keywords.splice(u.keywords.length, 0, ...["ЕМКОСТЬ", "ЭЛЕКТРИЧНСКИЙ", "КОНДЕНСАТОР"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("ФАРАД", u);
        t.add_abridge("Ф.");
        t.add_abridge("ФА");
        t.add_abridge("F");
        t.add_variant("FARAD", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.KILO, UnitsFactors.MICRO, UnitsFactors.MILLI, UnitsFactors.NANO, UnitsFactors.PICO]) {
            UnitsHelper._add_factor(f, u, "Ф.;ФА.", "F", "ФАРАД", "ФАРАД", "FARAD");
        }
        u = new Unit("Н", "N", "ньютон", "newton");
        u.keywords.splice(u.keywords.length, 0, ...["СИЛА", "МОМЕНТ", "НАГРУЗКА"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("НЬЮТОН", u);
        t.add_abridge("Н.");
        t.add_abridge("H.");
        t.add_abridge("N.");
        t.add_variant("NEWTON", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.MEGA, UnitsFactors.KILO, UnitsFactors.MICRO, UnitsFactors.MILLI]) {
            UnitsHelper._add_factor(f, u, "Н.", "N.", "НЬЮТОН", "НЬЮТОН", "NEWTON");
        }
        u = new Unit("моль", "mol", "моль", "mol");
        u.keywords.splice(u.keywords.length, 0, ...["МОЛЕКУЛА", "МОЛЕКУЛЯРНЫЙ", "КОЛИЧЕСТВО", "ВЕЩЕСТВО"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("МОЛЬ", u);
        t.add_abridge("МЛЬ");
        t.add_variant("МОЛ", false);
        t.add_variant("MOL", false);
        t.add_variant("ГРАММ МОЛЕКУЛА", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.MEGA, UnitsFactors.KILO, UnitsFactors.MICRO, UnitsFactors.MILLI, UnitsFactors.NANO]) {
            UnitsHelper._add_factor(f, u, "МЛЬ", "MOL", "МОЛЬ", "МОЛЬ", "MOL");
        }
        u = new Unit("Бк", "Bq", "беккерель", "becquerel");
        u.keywords.splice(u.keywords.length, 0, ...["АКТИВНОСТЬ", "РАДИОАКТИВНЫЙ", "ИЗЛУЧЕНИЕ", "ИСТОЧНИК"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("БЕККЕРЕЛЬ", u);
        t.add_abridge("БК.");
        t.add_variant("BQ.", false);
        t.add_variant("БЕК", false);
        t.add_variant("БЕКЕРЕЛЬ", false);
        t.add_variant("BECQUEREL", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.MEGA, UnitsFactors.KILO, UnitsFactors.MICRO, UnitsFactors.MILLI, UnitsFactors.NANO]) {
            UnitsHelper._add_factor(f, u, "БК.", "BQ.", "БЕККЕРЕЛЬ;БЕК", "БЕКЕРЕЛЬ", "BECQUEREL");
        }
        u = new Unit("См", "S", "сименс", "siemens");
        u.keywords.splice(u.keywords.length, 0, ...["ПРОВОДИМОСТЬ", "ЭЛЕКТРИЧЕСКИЙ", "ПРОВОДНИК"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("СИМЕНС", u);
        t.add_abridge("СМ.");
        t.add_abridge("CM.");
        t.add_variant("S.", false);
        t.add_variant("SIEMENS", false);
        t.add_variant("СІМЕНС", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.MEGA, UnitsFactors.KILO, UnitsFactors.MICRO, UnitsFactors.MILLI, UnitsFactors.NANO]) {
            UnitsHelper._add_factor(f, u, "СМ.", "S.", "СИМЕНС", "СІМЕНС", "SIEMENS");
        }
        u = new Unit("кд", "cd", "кандела", "candela");
        u.keywords.splice(u.keywords.length, 0, ...["СВЕТ", "СВЕТОВОЙ", "ПОТОК", "ИСТОЧНИК"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("КАНДЕЛА", u);
        t.add_abridge("КД.");
        t.add_variant("CD.", false);
        t.add_variant("КАНДЕЛА", false);
        t.add_variant("CANDELA", false);
        UnitsHelper.TERMINS.add(t);
        u = new Unit("Па", "Pa", "паскаль", "pascal");
        u.keywords.splice(u.keywords.length, 0, ...["ДАВЛЕНИЕ", "НАПРЯЖЕНИЕ", "ТЯЖЕСТЬ", "PRESSURE", "STRESS", "ТИСК", "НАПРУГА"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("ПАСКАЛЬ", u);
        t.add_abridge("ПА");
        t.add_abridge("РА");
        t.add_variant("PA", false);
        t.add_variant("PASCAL", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.KILO, UnitsFactors.MEGA, UnitsFactors.GIGA, UnitsFactors.MICRO, UnitsFactors.MILLI]) {
            UnitsHelper._add_factor(f, u, "ПА", "PA", "ПАСКАЛЬ", "ПАСКАЛЬ", "PASCAL");
        }
        uu = Unit._new1692("бар", "bar", "бар", "bar", u, 100000);
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("БАР", uu);
        t.add_variant("BAR", false);
        UnitsHelper.TERMINS.add(t);
        uu = Unit._new1692("мм.рт.ст.", "mm Hg", "миллиметр ртутного столба", "millimeter of mercury", u, 133.332);
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("МИЛЛИМЕТР РТУТНОГО СТОЛБА", uu);
        t.add_abridge("ММ.РТ.СТ.");
        t.add_abridge("MM.PT.CT");
        t.add_abridge("MM HG");
        t.add_variant("MMGH", false);
        t.add_variant("ТОРР", false);
        t.add_variant("TORR", false);
        t.add_variant("MILLIMETER OF MERCURY", false);
        UnitsHelper.TERMINS.add(t);
        u = new Unit("бит", "bit", "бит", "bit");
        u.keywords.splice(u.keywords.length, 0, ...["ОБЪЕМ", "РАЗМЕР", "ПАМЯТЬ", "ЕМКОСТЬ", "ПЕРЕДАЧА", "ПРИЕМ", "ОТПРАВКА", "ОП", "ДИСК", "НАКОПИТЕЛЬ", "КЭШ", "ОБСЯГ", "РОЗМІР", "ВІДПРАВЛЕННЯ", "VOLUME", "SIZE", "MEMORY", "TRANSFER", "SEND", "RECEPTION", "RAM", "DISK", "HDD", "RAM", "ROM", "CD-ROM", "CASHE"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("БИТ", u);
        t.add_variant("BIT", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.KILO, UnitsFactors.MEGA, UnitsFactors.GIGA, UnitsFactors.TERA]) {
            UnitsHelper._add_factor(f, u, "БИТ", "BIT", "БИТ", "БИТ", "BIT");
        }
        uu = new Unit("б", "b", "байт", "byte");
        uu.keywords = u.keywords;
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("БАЙТ", uu);
        t.add_variant("BYTE", false);
        t.add_abridge("B.");
        t.add_abridge("Б.");
        t.add_abridge("В.");
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.KILO, UnitsFactors.MEGA, UnitsFactors.GIGA, UnitsFactors.TERA]) {
            UnitsHelper._add_factor(f, uu, "Б.", "B.", "БАЙТ", "БАЙТ", "BYTE");
        }
        u = new Unit("бод", "Bd", "бод", "baud");
        u.keywords.splice(u.keywords.length, 0, ...["СКОРОСТЬ", "ПЕРЕДАЧА", "ПРИЕМ", "ДАННЫЕ", "ОТПРАВКА"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("БОД", u);
        t.add_abridge("BD");
        t.add_variant("BAUD", false);
        UnitsHelper.TERMINS.add(t);
        for (const f of [UnitsFactors.KILO, UnitsFactors.MEGA, UnitsFactors.GIGA, UnitsFactors.TERA]) {
            UnitsHelper._add_factor(f, uu, "БОД", "BD.", "БОД", "БОД", "BAUD");
        }
        u = new Unit("гс", "gf", "грамм-сила", "gram-force");
        u.keywords.splice(u.keywords.length, 0, ...["СИЛА", "ДАВЛЕНИЕ"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("ГРАММ СИЛА", u);
        t.add_abridge("ГС");
        t.add_variant("POND", false);
        t.add_variant("ГРАМ СИЛА", false);
        t.add_abridge("GP.");
        t.add_variant("GRAM POND", false);
        t.add_variant("GRAM FORCE", false);
        UnitsHelper.TERMINS.add(t);
        uu = Unit._new1692("кгс", "kgf", "килограмм-сила", "kilogram-force", u, 1000);
        UnitsHelper.UNITS.push(uu);
        t = Termin._new119("КИЛОГРАММ СИЛА", uu);
        t.add_abridge("КГС");
        t.add_variant("KILOPOND", false);
        t.add_variant("КІЛОГРАМ СИЛА", false);
        t.add_abridge("KP.");
        t.add_variant("KILOGRAM POND", false);
        UnitsHelper.TERMINS.add(t);
        u = new Unit("dpi", "точек на дюйм", "dpi", "dots per inch");
        u.keywords.splice(u.keywords.length, 0, ...["РАЗРЕШЕНИЕ", "ЭКРАН", "МОНИТОР"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("DOTS PER INCH", u);
        t.add_variant("DPI", false);
        UnitsHelper.TERMINS.add(t);
        u = Unit._new1641("IP", "IP", "IP", "IP", MeasureKind.IP);
        u.keywords.splice(u.keywords.length, 0, ...["ЗАЩИТА", "КЛАСС ЗАЩИТЫ", "PROTECTION", "PROTACTION RATING"]);
        UnitsHelper.UNITS.push(u);
        t = Termin._new119("IP", u);
        UnitsHelper.TERMINS.add(t);
        Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
    }
    
    static _add_factor(f, u0, abbr_cyr, abbr_lat, names_ru, names_ua, names_en) {
        let pref_cyr = null;
        let pref_lat = null;
        let pref_ru = null;
        let pref_ua = null;
        let pref_en = null;
        let mult = 1;
        switch (f) { 
        case UnitsFactors.CENTI:{
            pref_cyr = "С";
            pref_lat = "C";
            pref_ru = "САНТИ";
            pref_ua = "САНТИ";
            pref_en = "CENTI";
            mult = 0.1;
            break;
        }
        case UnitsFactors.DECI:{
            pref_cyr = "Д";
            pref_lat = "D";
            pref_ru = "ДЕЦИ";
            pref_ua = "ДЕЦИ";
            pref_en = "DECI";
            mult = 0.01;
            break;
        }
        case UnitsFactors.GIGA:{
            pref_cyr = "Г";
            pref_lat = "G";
            pref_ru = "ГИГА";
            pref_ua = "ГІГА";
            pref_en = "GIGA";
            mult = 1000000000;
            break;
        }
        case UnitsFactors.KILO:{
            pref_cyr = "К";
            pref_lat = "K";
            pref_ru = "КИЛО";
            pref_ua = "КІЛО";
            pref_en = "KILO";
            mult = 1000;
            break;
        }
        case UnitsFactors.MEGA:{
            pref_cyr = "М";
            pref_lat = "M";
            pref_ru = "МЕГА";
            pref_ua = "МЕГА";
            pref_en = "MEGA";
            mult = 1000000;
            break;
        }
        case UnitsFactors.MICRO:{
            pref_cyr = "МК";
            pref_lat = "MK";
            pref_ru = "МИКРО";
            pref_ua = "МІКРО";
            pref_en = "MICRO";
            mult = 0.0001;
            break;
        }
        case UnitsFactors.MILLI:{
            pref_cyr = "М";
            pref_lat = "M";
            pref_ru = "МИЛЛИ";
            pref_ua = "МІЛІ";
            pref_en = "MILLI";
            mult = 0.001;
            break;
        }
        case UnitsFactors.NANO:{
            pref_cyr = "Н";
            pref_lat = "N";
            pref_ru = "НАНО";
            pref_ua = "НАНО";
            pref_en = "NANO";
            mult = 0.0000000001;
            break;
        }
        case UnitsFactors.PICO:{
            pref_cyr = "П";
            pref_lat = "P";
            pref_ru = "ПИКО";
            pref_ua = "ПІКО";
            pref_en = "PICO";
            mult = 0.0000000000001;
            break;
        }
        case UnitsFactors.TERA:{
            pref_cyr = "Т";
            pref_lat = "T";
            pref_ru = "ТЕРА";
            pref_ua = "ТЕРА";
            pref_en = "TERA";
            mult = 1000000000000;
            break;
        }
        }
        let u = Unit._new1727(pref_cyr.toLowerCase() + u0.name_cyr, pref_lat.toLowerCase() + u0.name_lat, pref_ru.toLowerCase() + u0.fullname_cyr, pref_en.toLowerCase() + u0.fullname_lat, f, mult, u0, u0.kind, u0.keywords);
        if (f === UnitsFactors.MEGA || f === UnitsFactors.TERA || f === UnitsFactors.GIGA) {
            u.name_cyr = pref_cyr + u0.name_cyr;
            u.name_lat = pref_lat + u0.name_lat;
        }
        UnitsHelper.UNITS.push(u);
        let nams = Utils.splitString(names_ru, ';', false);
        let t = Termin._new119(pref_ru + nams[0], u);
        for (let i = 1; i < nams.length; i++) {
            if (!Utils.isNullOrEmpty(nams[i])) 
                t.add_variant(pref_ru + nams[i], false);
        }
        for (const n of nams) {
            if (!Utils.isNullOrEmpty(n)) 
                t.add_variant(pref_cyr + n, false);
        }
        for (const n of Utils.splitString(names_ua, ';', false)) {
            if (!Utils.isNullOrEmpty(n)) {
                t.add_variant(pref_ua + n, false);
                t.add_variant(pref_cyr + n, false);
            }
        }
        for (const n of Utils.splitString(names_en, ';', false)) {
            if (!Utils.isNullOrEmpty(n)) {
                t.add_variant(pref_en + n, false);
                t.add_variant(pref_lat + n, false);
            }
        }
        for (const n of Utils.splitString(abbr_cyr, ';', false)) {
            if (!Utils.isNullOrEmpty(n)) 
                t.add_abridge(pref_cyr + n);
        }
        for (const n of Utils.splitString(abbr_lat, ';', false)) {
            if (!Utils.isNullOrEmpty(n)) 
                t.add_abridge(pref_lat + n);
        }
        UnitsHelper.TERMINS.add(t);
        return u;
    }
    
    static static_constructor() {
        UnitsHelper.UNITS = new Array();
        UnitsHelper.TERMINS = new TerminCollection();
        UnitsHelper.UGRADUS = null;
        UnitsHelper.UGRADUSC = null;
        UnitsHelper.UGRADUSF = null;
        UnitsHelper.UPERCENT = null;
        UnitsHelper.UALCO = null;
        UnitsHelper.UOM = null;
        UnitsHelper.UHOUR = null;
        UnitsHelper.UMINUTE = null;
        UnitsHelper.USEC = null;
        UnitsHelper.m_inited = false;
        UnitsHelper.m_kinds_keywords = null;
    }
}


UnitsHelper.static_constructor();

module.exports = UnitsHelper
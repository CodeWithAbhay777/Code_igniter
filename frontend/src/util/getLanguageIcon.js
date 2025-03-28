import { FaPython, FaJava, FaRust, FaSwift, FaGolang } from "react-icons/fa6";
import { IoLogoJavascript } from "react-icons/io5";
import { TbBrandCpp } from "react-icons/tb";
import { DiRuby } from "react-icons/di";
import { SiPhp, SiKotlin, SiDart , SiC } from "react-icons/si";


const languageIcons = {
    python: FaPython,
    javascript: IoLogoJavascript,
    java: FaJava,
    c: SiC,
    cpp: TbBrandCpp,
    go: FaGolang,
    rust: FaRust,
    ruby: DiRuby,
    php: SiPhp,
    swift: FaSwift,
    kotlin: SiKotlin,
    dart: SiDart
};

export const getLanguageIcon = (language) => {
    return languageIcons[language.toLowerCase()] || FaPython; 
};
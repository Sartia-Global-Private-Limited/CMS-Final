import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import English from './en.json';
import Hindi from './hi.json';

const resources = {

    en: {

        translation: English,

    },

    hi: {

        translation: Hindi,

    },

};

i18next

    .use(initReactI18next)

    .init({

        resources,

        lng: "en",

        interpolation: {

            escapeValue: false,

        },

        // debug: true,
    });



export default i18next;
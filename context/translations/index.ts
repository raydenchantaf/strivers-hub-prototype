import { nav }        from "./nav";
import { home }       from "./home";
import { assessment } from "./assessment";
import { resources }  from "./resources";
import { financing }  from "./financing";
import { events }     from "./events";
import { mentorship } from "./mentorship";
import { about }      from "./about";
import { register }   from "./register";
import { login }      from "./login";
import { privacy }    from "./privacy";
import { footer }     from "./footer";
import { dashboard }      from "./dashboard";
import { forgotPassword } from "./forgotPassword";
import { profile }        from "./profile";

import type { Language } from "../LanguageContext";

const modules = [
  nav, home, assessment, resources, financing,
  events, mentorship, about, register, login, privacy, footer, dashboard, forgotPassword, profile,
];

export const translations: Record<Language, Record<string, string>> = {
  en: Object.assign({}, ...modules.map((m) => m.en)),
  bm: Object.assign({}, ...modules.map((m) => m.bm)),
};

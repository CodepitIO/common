let C = module.exports;

C.CONN = {
  MONGO: {
    HOST: 'mongo',
    PORT: 27017,
    DB: 'maratonando',
    GET_URL: () => {
      return `mongodb://${C.CONN.MONGO.HOST}:${C.CONN.MONGO.PORT}/${C.CONN.MONGO.DB}`;
    },
  },
  REDIS: {
    HOST: 'redis',
    PORT: 6379,
  },
  MAILER: {
    SES_REGION: 'us-west-2',
    RATE_LIMIT: 5,
    MAX_CONN: 5,
    TIMELIMIT_PER_USER: 1800
  },
  GET_S3_BUCKET: function() {
    return (process.env.NODE_ENV !== 'development') ? 'codepit' : 'codepit-dev';
  },
  GET_DOMAIN: function() {
    return (process.env.NODE_ENV === 'development') ? 'http://localhost' :
      'https://www.codepit.io';
  },
};

C.STATIC_ASSETS_DOMAIN = (process.env.NODE_ENV !== 'development') ?
  'https://cdn.codepit.io' : 'https://cdn-dev.codepit.io';

C.LANGUAGES = ['c', 'cpp', 'cpp11', 'java', 'python2.7', 'python3'];
C.OJS = [
  // 'cf',
  'cfgym',
  // 'codechef',
  // 'huxley',
  // 'kattis',
  // 'la',
  // 'poj',
  // 'spoj',
  // 'spojbr',
  // 'timus',
  // 'toj',
  // 'uri',
  // 'uva',
  // 'zoj',
];

C.JUDGE = {
  STATUS: {
    'COMPILING': -4,
  	'RUNNING': -3,
  	'LINKING': -2,
  	'ON_JUDGE_QUEUE': -1,
  	'PENDING': 0,
  	'ACCEPTED': 1,
  	'WRONG_ANSWER': 2,
  	'TIME_LIMIT': 3,
  	'COMPILE_ERROR': 4,
  	'RUNTIME_ERROR': 5,
  	'MEMORY_LIMIT': 6,
  	'OUTPUT_LIMIT': 7,
  	'PRESENTATION_ERROR': 8,
    'UNKNOWN_ERROR': 9, // DEPRECATED
    'RESTRICTED_FUNCTION': 10,
    'INTERNAL_ERROR': 11, // no retry, no penalty
    'SUBMISSION_ERROR': 12, // retry, no penalty
  },

  VERDICT: {
    '-4': 'Compilando...',
    '-3': 'Executando...',
    '-2': 'Compilando...',
    '-1': 'Enviado para Correção',
    '0': 'Pendendo',
    '1': 'Aceito',
    '2': 'Resposta Errada',
    '3': 'Tempo Limite Excedido',
    '4': 'Erro de Compilação',
    '5': 'Erro durante Execução',
    '6': 'Limite de Memória Excedido',
    '7': 'Limite de Escrita Excedido',
    '8': 'Erro de Apresentação',
    '9': 'Erro Desconhecido', // DEPRECATED
    '10': 'Uso de função restrita',
    '11': 'Erro Interno',
    '12': 'Erro de submissão',
  },
};

C.SITE_VARS = {
  ACCESS: {
    MEMBER: 0,
    ADMIN: 10,
  },

  COUNTRIES: {"af":{"Name":"Afghanistan"},"ax":{"Name":"Åland Islands"},"al":{"Name":"Albania"},"dz":{"Name":"Algeria"},"as":{"Name":"American Samoa"},"ad":{"Name":"Andorra"},"ao":{"Name":"Angola"},"ai":{"Name":"Anguilla"},"aq":{"Name":"Antarctica"},"ag":{"Name":"Antigua and Barbuda"},"ar":{"Name":"Argentina"},"am":{"Name":"Armenia"},"aw":{"Name":"Aruba"},"au":{"Name":"Australia"},"at":{"Name":"Austria"},"az":{"Name":"Azerbaijan"},"bs":{"Name":"Bahamas"},"bh":{"Name":"Bahrain"},"bd":{"Name":"Bangladesh"},"bb":{"Name":"Barbados"},"by":{"Name":"Belarus"},"be":{"Name":"Belgium"},"bz":{"Name":"Belize"},"bj":{"Name":"Benin"},"bm":{"Name":"Bermuda"},"bt":{"Name":"Bhutan"},"bo":{"Name":"Bolivia, Plurinational State of"},"bq":{"Name":"Bonaire, Sint Eustatius and Saba"},"ba":{"Name":"Bosnia and Herzegovina"},"bw":{"Name":"Botswana"},"bv":{"Name":"Bouvet Island"},"br":{"Name":"Brazil"},"io":{"Name":"British Indian Ocean Territory"},"bn":{"Name":"Brunei Darussalam"},"bg":{"Name":"Bulgaria"},"bf":{"Name":"Burkina Faso"},"bi":{"Name":"Burundi"},"kh":{"Name":"Cambodia"},"cm":{"Name":"Cameroon"},"ca":{"Name":"Canada"},"cv":{"Name":"Cape Verde"},"ky":{"Name":"Cayman Islands"},"cf":{"Name":"Central African Republic"},"td":{"Name":"Chad"},"cl":{"Name":"Chile"},"cn":{"Name":"China"},"cx":{"Name":"Christmas Island"},"cc":{"Name":"Cocos (Keeling) Islands"},"co":{"Name":"Colombia"},"km":{"Name":"Comoros"},"cg":{"Name":"Congo"},"cd":{"Name":"Congo, the Democratic Republic of the"},"ck":{"Name":"Cook Islands"},"cr":{"Name":"Costa Rica"},"ci":{"Name":"Côte d\'Ivoire"},"hr":{"Name":"Croatia"},"cu":{"Name":"Cuba"},"cw":{"Name":"Curaçao"},"cy":{"Name":"Cyprus"},"cz":{"Name":"Czech Republic"},"dk":{"Name":"Denmark"},"dj":{"Name":"Djibouti"},"dm":{"Name":"Dominica"},"do":{"Name":"Dominican Republic"},"ec":{"Name":"Ecuador"},"eg":{"Name":"Egypt"},"sv":{"Name":"El Salvador"},"gq":{"Name":"Equatorial Guinea"},"er":{"Name":"Eritrea"},"ee":{"Name":"Estonia"},"et":{"Name":"Ethiopia"},"fk":{"Name":"Falkland Islands (Malvinas)"},"fo":{"Name":"Faroe Islands"},"fj":{"Name":"Fiji"},"fi":{"Name":"Finland"},"fr":{"Name":"France"},"gf":{"Name":"French Guiana"},"pf":{"Name":"French Polynesia"},"tf":{"Name":"French Southern Territories"},"ga":{"Name":"Gabon"},"gm":{"Name":"Gambia"},"ge":{"Name":"Georgia"},"de":{"Name":"Germany"},"gh":{"Name":"Ghana"},"gi":{"Name":"Gibraltar"},"gr":{"Name":"Greece"},"gl":{"Name":"Greenland"},"gd":{"Name":"Grenada"},"gp":{"Name":"Guadeloupe"},"gu":{"Name":"Guam"},"gt":{"Name":"Guatemala"},"gg":{"Name":"Guernsey"},"gn":{"Name":"Guinea"},"gw":{"Name":"Guinea-Bissau"},"gy":{"Name":"Guyana"},"ht":{"Name":"Haiti"},"hm":{"Name":"Heard Island and McDonald Islands"},"va":{"Name":"Holy See (Vatican City State)"},"hn":{"Name":"Honduras"},"hk":{"Name":"Hong Kong"},"hu":{"Name":"Hungary"},"is":{"Name":"Iceland"},"in":{"Name":"India"},"id":{"Name":"Indonesia"},"ir":{"Name":"Iran, Islamic Republic of"},"iq":{"Name":"Iraq"},"ie":{"Name":"Ireland"},"im":{"Name":"Isle of Man"},"il":{"Name":"Israel"},"it":{"Name":"Italy"},"jm":{"Name":"Jamaica"},"jp":{"Name":"Japan"},"je":{"Name":"Jersey"},"jo":{"Name":"Jordan"},"kz":{"Name":"Kazakhstan"},"ke":{"Name":"Kenya"},"ki":{"Name":"Kiribati"},"kp":{"Name":"Korea, Democratic People\'s Republic of"},"kr":{"Name":"Korea, Republic of"},"kw":{"Name":"Kuwait"},"kg":{"Name":"Kyrgyzstan"},"la":{"Name":"Lao People\'s Democratic Republic"},"lv":{"Name":"Latvia"},"lb":{"Name":"Lebanon"},"ls":{"Name":"Lesotho"},"lr":{"Name":"Liberia"},"ly":{"Name":"Libya"},"li":{"Name":"Liechtenstein"},"lt":{"Name":"Lithuania"},"lu":{"Name":"Luxembourg"},"mo":{"Name":"Macao"},"mk":{"Name":"Macedonia, the Former Yugoslav Republic of"},"mg":{"Name":"Madagascar"},"mw":{"Name":"Malawi"},"my":{"Name":"Malaysia"},"mv":{"Name":"Maldives"},"ml":{"Name":"Mali"},"mt":{"Name":"Malta"},"mh":{"Name":"Marshall Islands"},"mq":{"Name":"Martinique"},"mr":{"Name":"Mauritania"},"mu":{"Name":"Mauritius"},"yt":{"Name":"Mayotte"},"mx":{"Name":"Mexico"},"fm":{"Name":"Micronesia, Federated States of"},"md":{"Name":"Moldova, Republic of"},"mc":{"Name":"Monaco"},"mn":{"Name":"Mongolia"},"me":{"Name":"Montenegro"},"ms":{"Name":"Montserrat"},"ma":{"Name":"Morocco"},"mz":{"Name":"Mozambique"},"mm":{"Name":"Myanmar"},"na":{"Name":"Namibia"},"nr":{"Name":"Nauru"},"np":{"Name":"Nepal"},"nl":{"Name":"Netherlands"},"nc":{"Name":"New Caledonia"},"nz":{"Name":"New Zealand"},"ni":{"Name":"Nicaragua"},"ne":{"Name":"Niger"},"ng":{"Name":"Nigeria"},"nu":{"Name":"Niue"},"nf":{"Name":"Norfolk Island"},"mp":{"Name":"Northern Mariana Islands"},"no":{"Name":"Norway"},"om":{"Name":"Oman"},"pk":{"Name":"Pakistan"},"pw":{"Name":"Palau"},"ps":{"Name":"Palestine, State of"},"pa":{"Name":"Panama"},"pg":{"Name":"Papua New Guinea"},"py":{"Name":"Paraguay"},"pe":{"Name":"Peru"},"ph":{"Name":"Philippines"},"pn":{"Name":"Pitcairn"},"pl":{"Name":"Poland"},"pt":{"Name":"Portugal"},"pr":{"Name":"Puerto Rico"},"qa":{"Name":"Qatar"},"re":{"Name":"Réunion"},"ro":{"Name":"Romania"},"ru":{"Name":"Russian Federation"},"rw":{"Name":"Rwanda"},"bl":{"Name":"Saint Barthélemy"},"sh":{"Name":"Saint Helena, Ascension and Tristan da Cunha"},"kn":{"Name":"Saint Kitts and Nevis"},"lc":{"Name":"Saint Lucia"},"mf":{"Name":"Saint Martin (French part)"},"pm":{"Name":"Saint Pierre and Miquelon"},"vc":{"Name":"Saint Vincent and the Grenadines"},"ws":{"Name":"Samoa"},"sm":{"Name":"San Marino"},"st":{"Name":"Sao Tome and Principe"},"sa":{"Name":"Saudi Arabia"},"sn":{"Name":"Senegal"},"rs":{"Name":"Serbia"},"sc":{"Name":"Seychelles"},"sl":{"Name":"Sierra Leone"},"sg":{"Name":"Singapore"},"sx":{"Name":"Sint Maarten (Dutch part)"},"sk":{"Name":"Slovakia"},"si":{"Name":"Slovenia"},"sb":{"Name":"Solomon Islands"},"so":{"Name":"Somalia"},"za":{"Name":"South Africa"},"gs":{"Name":"South Georgia and the South Sandwich Islands"},"ss":{"Name":"South Sudan"},"es":{"Name":"Spain"},"lk":{"Name":"Sri Lanka"},"sd":{"Name":"Sudan"},"sr":{"Name":"Suriname"},"sj":{"Name":"Svalbard and Jan Mayen"},"sz":{"Name":"Swaziland"},"se":{"Name":"Sweden"},"ch":{"Name":"Switzerland"},"sy":{"Name":"Syrian Arab Republic"},"tw":{"Name":"Taiwan, Province of China"},"tj":{"Name":"Tajikistan"},"tz":{"Name":"Tanzania, United Republic of"},"th":{"Name":"Thailand"},"tl":{"Name":"Timor-Leste"},"tg":{"Name":"Togo"},"tk":{"Name":"Tokelau"},"to":{"Name":"Tonga"},"tt":{"Name":"Trinidad and Tobago"},"tn":{"Name":"Tunisia"},"tr":{"Name":"Turkey"},"tm":{"Name":"Turkmenistan"},"tc":{"Name":"Turks and Caicos Islands"},"tv":{"Name":"Tuvalu"},"ug":{"Name":"Uganda"},"ua":{"Name":"Ukraine"},"ae":{"Name":"United Arab Emirates"},"gb":{"Name":"United Kingdom"},"us":{"Name":"United States"},"um":{"Name":"United States Minor Outlying Islands"},"uy":{"Name":"Uruguay"},"uz":{"Name":"Uzbekistan"},"vu":{"Name":"Vanuatu"},"ve":{"Name":"Venezuela, Bolivarian Republic of"},"vn":{"Name":"Viet Nam"},"vg":{"Name":"Virgin Islands, British"},"vi":{"Name":"Virgin Islands, U.S."},"wf":{"Name":"Wallis and Futuna"},"eh":{"Name":"Western Sahara"},"ye":{"Name":"Yemen"},"zm":{"Name":"Zambia"},"zw":{"Name":"Zimbabwe"}},
}
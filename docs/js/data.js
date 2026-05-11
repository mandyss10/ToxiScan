// ═══════════════════════════════════════════════════
//  Base de datos toxicológica y categorización
// ═══════════════════════════════════════════════════

export const TOXIN_DB = {
  pescado: {
    nombre: 'Pescado', emoji: '🐟',
    toxinas: [
      { nombre: 'Mercurio (MeHg)', tipo: 'Metal pesado', riesgo: 'alto',
        efecto: 'Neurotóxico. Daño al sistema nervioso central, especialmente grave en fetos y niños pequeños.',
        fuente: 'Bioacumulación en la cadena trófica marina. Máximo en atún, pez espada y tiburón.',
        recomendacion: 'Máx. 2 raciones/semana. Embarazadas y niños <10 años deben evitar especies grandes.' },
      { nombre: 'PCB (Bifenilos Policlorados)', tipo: 'Contaminante orgánico persistente', riesgo: 'alto',
        efecto: 'Disruptor endocrino. Posiblemente cancerígeno (Grupo 2A IARC). Daño hepático.',
        fuente: 'Vertidos industriales históricos acumulados en sedimentos marinos.',
        recomendacion: 'Preferir pescado de aguas limpias certificadas. Retirar piel y grasa visible.' },
      { nombre: 'Anisakis simplex', tipo: 'Parásito', riesgo: 'medio',
        efecto: 'Anisakiasis: dolor abdominal agudo, náuseas y reacciones alérgicas severas.',
        fuente: 'Larvas en músculo de pescado crudo o poco cocinado.',
        recomendacion: 'Cocinar a >60 °C o congelar a −20 °C durante mínimo 7 días antes de consumir crudo.' },
      { nombre: 'Microplásticos', tipo: 'Contaminante emergente', riesgo: 'bajo',
        efecto: 'Efectos crónicos en estudio. Posibles disruptores endocrinos a largo plazo.',
        fuente: 'Contaminación plástica oceánica ingerida por el pez.',
        recomendacion: 'Consumir pescado de zonas certificadas. Investigación en curso.' },
    ]
  },
  arroz: {
    nombre: 'Arroz', emoji: '🍚',
    toxinas: [
      { nombre: 'Arsénico inorgánico (iAs)', tipo: 'Metaloide tóxico', riesgo: 'alto',
        efecto: 'Cancerígeno Grupo 1 (IARC). Daño renal, cardiovascular y pulmonar crónico.',
        fuente: 'El arroz absorbe arsénico del suelo y del agua de riego de forma muy eficiente.',
        recomendacion: 'Lavar abundantemente antes de cocer. Cocer con agua extra y escurrir. Variar cereales.' },
      { nombre: 'Cadmio', tipo: 'Metal pesado', riesgo: 'medio',
        efecto: 'Nefrotóxico crónico. Daño renal acumulativo e irreversible.',
        fuente: 'Suelos contaminados por fertilizantes fosfatados y residuos industriales.',
        recomendacion: 'Diversificar la dieta. Preferir arroz de origen certificado con controles de metales.' },
      { nombre: 'Plomo (Pb)', tipo: 'Metal pesado', riesgo: 'medio',
        efecto: 'Neurotóxico. Especialmente dañino en el desarrollo infantil y cognitivo.',
        fuente: 'Suelos agrícolas próximos a zonas industriales o de tráfico intenso.',
        recomendacion: 'Preferir arroz con etiquetado de trazabilidad y controles de calidad.' },
      { nombre: 'Aflatoxinas (B1, B2)', tipo: 'Micotoxina', riesgo: 'alto',
        efecto: 'Hepatotóxico y cancerígeno hepático (Grupo 1 IARC). Inmunosupresor.',
        fuente: 'Hongos Aspergillus en almacenamiento con humedad elevada.',
        recomendacion: 'Almacenar en lugar fresco, seco y ventilado. Descartar si hay manchas o mal olor.' },
    ]
  },
  verduras: {
    nombre: 'Verduras', emoji: '🥬',
    toxinas: [
      { nombre: 'Pesticidas organofosforados', tipo: 'Plaguicida residual', riesgo: 'medio',
        efecto: 'Inhibición de acetilcolinesterasa. Neurotóxico. Posible disruptor endocrino.',
        fuente: 'Uso agrícola convencional. Residuos en superficie y tejidos.',
        recomendacion: 'Lavar con agua abundante. Pelar cuando sea posible. Preferir ecológico.' },
      { nombre: 'Nitratos (NO₃⁻)', tipo: 'Compuesto inorgánico', riesgo: 'medio',
        efecto: 'Se convierten en nitritos en el organismo → metahemoglobinemia en bebés.',
        fuente: 'Fertilizantes nitrogenados. Muy altos en espinacas, rúcula, lechuga y remolacha.',
        recomendacion: 'No dar espinacas a bebés <6 meses. Consumir frescos. No recalentar purés.' },
      { nombre: 'Cadmio', tipo: 'Metal pesado', riesgo: 'bajo',
        efecto: 'Acumulación renal crónica en consumo elevado.',
        fuente: 'Suelos con historial de abonos fosfatados. Más en raíces y hojas.',
        recomendacion: 'Rotar cultivos. Lavar bien y pelar raíces.' },
      { nombre: 'Listeria monocytogenes', tipo: 'Patógeno bacteriano', riesgo: 'medio',
        efecto: 'Listeriosis: infección grave en embarazadas, ancianos e inmunodeprimidos.',
        fuente: 'Suelo y agua. Brotes y germinados crudos de alto riesgo.',
        recomendacion: 'Lavar meticulosamente. Embarazadas deben evitar germinados y vegetales crudos sin lavar.' },
    ]
  },
  carne: {
    nombre: 'Carne', emoji: '🥩',
    toxinas: [
      { nombre: 'Hormonas de crecimiento', tipo: 'Residuo veterinario', riesgo: 'medio',
        efecto: 'Posibles efectos en sistema hormonal humano. Prohibidas en UE pero no en EE. UU.',
        fuente: 'Uso en ganadería intensiva para acelerar el engorde.',
        recomendacion: 'Preferir carne con sello de calidad europeo. Elegir ganadería extensiva.' },
      { nombre: 'Antibióticos residuales', tipo: 'Residuo veterinario', riesgo: 'medio',
        efecto: 'Contribuye a la resistencia antimicrobiana. Posibles alergias.',
        fuente: 'Uso preventivo y terapéutico en ganadería intensiva.',
        recomendacion: 'Preferir sellos sin uso preventivo de antibióticos. Variar fuentes de proteína.' },
      { nombre: 'Dioxinas y furanos', tipo: 'Contaminante orgánico persistente', riesgo: 'alto',
        efecto: 'Cancerígeno (Grupo 1 IARC). Disruptor endocrino severo. Se acumula en grasa.',
        fuente: 'Contaminación ambiental industrial. Se acumula en tejido graso animal.',
        recomendacion: 'Retirar grasa visible. Preferir carnes magras. No quemar grasas al cocinar.' },
      { nombre: 'Acrilamida (carnes procesadas)', tipo: 'Neoformado por calor', riesgo: 'medio',
        efecto: 'Posiblemente cancerígeno (Grupo 2A IARC). Neurotóxico en dosis altas.',
        fuente: 'Se forma al cocinar a altas temperaturas: fritura, parrilla y ahumado.',
        recomendacion: 'Evitar carbonizado. Preferir cocción en agua o vapor. Reducir embutidos ahumados.' },
    ]
  },
  lacteos: {
    nombre: 'Lácteos', emoji: '🥛',
    toxinas: [
      { nombre: 'Dioxinas y PCB', tipo: 'Contaminante orgánico persistente', riesgo: 'medio',
        efecto: 'Disruptores endocrinos. Cancerígenos. Se concentran en la grasa láctea.',
        fuente: 'Contaminación ambiental en pastos y piensos.',
        recomendacion: 'Preferir lácteos desnatados o semidesnatados. Control de origen.' },
      { nombre: 'Aflatoxina M1', tipo: 'Micotoxina', riesgo: 'medio',
        efecto: 'Metabolito cancerígeno (Grupo 1 IARC) derivado de aflatoxina B1 en piensos.',
        fuente: 'Piensos contaminados con Aspergillus que el animal metaboliza a la leche.',
        recomendacion: 'Control estricto de piensos. La pasteurización no destruye las aflatoxinas.' },
      { nombre: 'Antibióticos residuales', tipo: 'Residuo veterinario', riesgo: 'bajo',
        efecto: 'Resistencia antimicrobiana. Reacciones alérgicas en personas sensibles.',
        fuente: 'Tratamientos veterinarios en vacas lecheras.',
        recomendacion: 'Los controles europeos son estrictos. Riesgo bajo con productos certificados UE.' },
      { nombre: 'Radionúclidos (Cs-137, Sr-90)', tipo: 'Contaminante radiactivo', riesgo: 'bajo',
        efecto: 'Riesgo cancerígeno a largo plazo en zonas afectadas por Chernóbil o Fukushima.',
        fuente: 'Pastos contaminados en zonas de fallout nuclear.',
        recomendacion: 'Riesgo mínimo en UE. Monitorización continua garantiza seguridad.' },
    ]
  },
  frutas: {
    nombre: 'Frutas', emoji: '🍎',
    toxinas: [
      { nombre: 'Pesticidas (múltiple residuo)', tipo: 'Plaguicida residual', riesgo: 'medio',
        efecto: 'Efecto cóctel: mezcla de residuos puede tener efecto sinérgico disruptor.',
        fuente: 'Uso agrícola convencional. Fresas, manzanas, uvas y melocotones son los más afectados.',
        recomendacion: 'Lavar con agua corriente mínimo 30 s. Pelar cuando sea posible. Priorizar ecológico.' },
      { nombre: 'Fungicidas post-cosecha', tipo: 'Plaguicida residual', riesgo: 'bajo',
        efecto: 'Irritación digestiva en altas dosis. Algunos con sospecha de disrupción hormonal.',
        fuente: 'Aplicados tras la recolección para alargar vida útil en transporte.',
        recomendacion: 'Lavar bien la piel incluso en frutas que se pelan.' },
      { nombre: 'Ceras sintéticas', tipo: 'Aditivo tecnológico', riesgo: 'bajo',
        efecto: 'Generalmente reconocidas como seguras (GRAS). Posibles residuos de fungicidas adheridos.',
        fuente: 'Aplicadas en manzanas, peras, cítricos y pepinos para mejorar apariencia.',
        recomendacion: 'Lavar con agua caliente y cepillo. Pelar si se desea eliminar completamente.' },
      { nombre: 'Patulina (manzanas dañadas)', tipo: 'Micotoxina', riesgo: 'medio',
        efecto: 'Nefrotóxico y genotóxico. Presente en zonas con moho (podredumbre marrón).',
        fuente: 'Hongos Penicillium expansum en fruta dañada. Pasa a zumos si hay fruta podrida.',
        recomendacion: 'Desechar zonas con moho (la toxina penetra la pulpa). Usar solo fruta sana para zumos.' },
    ]
  },
  mariscos: {
    nombre: 'Mariscos', emoji: '🦐',
    toxinas: [
      { nombre: 'Biotoxinas marinas (PSP, ASP, DSP)', tipo: 'Toxina natural', riesgo: 'alto',
        efecto: 'PSP: parálisis muscular potencialmente mortal. ASP: daño neurológico. DSP: diarrea severa.',
        fuente: 'Algas tóxicas filtradas por moluscos bivalvos (mejillones, ostras, almejas).',
        recomendacion: 'Solo consumir de zonas habilitadas con control oficial. No recolectar tras avisos sanitarios.' },
      { nombre: 'Mercurio y Cadmio', tipo: 'Metales pesados', riesgo: 'medio',
        efecto: 'Acumulación en hígado y riñones. Neurotóxico (mercurio), nefrotóxico (cadmio).',
        fuente: 'Bioacumulación. Más elevado en cefalópodos (pulpo, calamar) y crustáceos.',
        recomendacion: 'Evitar las vísceras en crustáceos. Limitar consumo en embarazadas y niños.' },
      { nombre: 'Vibrio parahaemolyticus', tipo: 'Patógeno bacteriano', riesgo: 'alto',
        efecto: 'Gastroenteritis aguda severa. Infecciones sistémicas en inmunodeprimidos.',
        fuente: 'Bacterias naturales en agua marina caliente. Riesgo alto en verano.',
        recomendacion: 'No consumir mariscos crudos en verano o procedentes de agua templada sin certificar.' },
      { nombre: 'Microplásticos y nanoplásticos', tipo: 'Contaminante emergente', riesgo: 'bajo',
        efecto: 'Los bivalvos filtran agua y concentran plásticos. Efectos crónicos en estudio.',
        fuente: 'Contaminación plástica marina.',
        recomendacion: 'Consumir de zonas con agua certificada. Investigación activa sobre efectos.' },
    ]
  },
  cereales: {
    nombre: 'Cereales y Pan', emoji: '🌾',
    toxinas: [
      { nombre: 'Ocratoxina A (OTA)', tipo: 'Micotoxina', riesgo: 'alto',
        efecto: 'Nefrotóxico crónico. Posiblemente cancerígeno (Grupo 2B IARC). Inmunosupresor.',
        fuente: 'Hongos Aspergillus y Penicillium en cereales almacenados. Más en trigo y maíz.',
        recomendacion: 'No consumir cereales con moho visible. Almacenar en seco. Diversificar.' },
      { nombre: 'Acrilamida', tipo: 'Neoformado por calor', riesgo: 'medio',
        efecto: 'Posiblemente cancerígeno (Grupo 2A IARC). Se forma en almidón + calor seco.',
        fuente: 'Pan muy tostado, galletas, cereales de desayuno tostados y patatas fritas.',
        recomendacion: 'Tostar a color dorado, no marrón oscuro. Evitar partes carbonizadas.' },
      { nombre: 'Deoxinivalenol (DON/Vomitoxina)', tipo: 'Micotoxina', riesgo: 'medio',
        efecto: 'Náuseas, vómitos y supresión inmune.',
        fuente: 'Fusarium en trigo y maíz húmedos.',
        recomendacion: 'Control de calidad en compra. La cocción reduce pero no elimina completamente.' },
      { nombre: 'Arsénico inorgánico', tipo: 'Metaloide tóxico', riesgo: 'bajo',
        efecto: 'Cancerígeno acumulativo. Menor que en arroz pero presente.',
        fuente: 'Suelos contaminados. Presente en avena integral y cereales integrales.',
        recomendacion: 'Diversificar cereales. Mayor riesgo en dieta muy basada en un solo cereal.' },
    ]
  },
  huevos: {
    nombre: 'Huevos', emoji: '🥚',
    toxinas: [
      { nombre: 'Salmonella spp.', tipo: 'Patógeno bacteriano', riesgo: 'alto',
        efecto: 'Salmonelosis: gastroenteritis con fiebre alta. Grave en ancianos, niños y embarazadas.',
        fuente: 'Contaminación de cáscara o interior. Huevos crudos o poco cocinados.',
        recomendacion: 'Cocinar completamente (yema sólida). Refrigerar. Lavar manos tras manipular.' },
      { nombre: 'Dioxinas y PCB', tipo: 'Contaminante orgánico persistente', riesgo: 'medio',
        efecto: 'Disruptores endocrinos. Se concentran en la yema por ser lipófilos.',
        fuente: 'Piensos y tierra contaminada en gallinas camperas en zonas industriales.',
        recomendacion: 'Los sistemas intensivos europeos tienen menores niveles que camperas en suelos contaminados.' },
      { nombre: 'Residuos de pesticidas', tipo: 'Plaguicida residual', riesgo: 'bajo',
        efecto: 'Posibles efectos hormonales en exposición crónica.',
        fuente: 'Piensos tratados con pesticidas que pasan a la yema.',
        recomendacion: 'Control europeo estricto. Riesgo bajo con productos certificados UE.' },
      { nombre: 'Fipronil', tipo: 'Insecticida', riesgo: 'medio',
        efecto: 'Posiblemente nocivo para hígado, riñones y tiroides en exposición elevada.',
        fuente: 'Uso ilegal como antiparasitario en granjas avícolas (escándalo europeo 2017).',
        recomendacion: 'Verificar código de origen del huevo. Preferir productores certificados.' },
    ]
  },
  legumbres: {
    nombre: 'Legumbres', emoji: '🫘',
    toxinas: [
      { nombre: 'Lectinas', tipo: 'Antinutriente natural', riesgo: 'medio',
        efecto: 'Crudas: náuseas, vómitos severos y daño intestinal. Especialmente alubias rojas.',
        fuente: 'Proteínas naturales de defensa de la planta. Muy altas en judías rojas crudas.',
        recomendacion: 'NUNCA consumir crudas. Remojar 8-12 h y cocer mínimo 15 min a 100 °C.' },
      { nombre: 'Aflatoxinas', tipo: 'Micotoxina', riesgo: 'medio',
        efecto: 'Hepatotóxico y cancerígeno (Grupo 1 IARC). Inmunosupresor.',
        fuente: 'Aspergillus en almacenamiento húmedo. Frecuente en cacahuetes.',
        recomendacion: 'Almacenar en fresco y seco. Desechar si hay moho.' },
      { nombre: 'Fitoestrógenos (soja)', tipo: 'Compuesto bioactivo', riesgo: 'bajo',
        efecto: 'Debate científico activo. Posible interferencia hormonal en consumo excesivo.',
        fuente: 'Isoflavonas naturales en soja: genisteína, daidzeína.',
        recomendacion: 'Consumo moderado sin problema. Precaución con ciertos tratamientos hormonales.' },
      { nombre: 'Residuos de glifosato', tipo: 'Herbicida residual', riesgo: 'medio',
        efecto: 'Posiblemente cancerígeno (Grupo 2A IARC — debate activo). Disbiosis intestinal.',
        fuente: 'Uso como desecante pre-cosecha en soja y legumbres convencionales.',
        recomendacion: 'Preferir legumbres ecológicas. Lavar bien antes de cocer.' },
    ]
  },
  procesado: {
    nombre: 'Alimento procesado', emoji: '🍟',
    toxinas: [
      { nombre: 'Acrilamida', tipo: 'Neoformado por calor', riesgo: 'alto',
        efecto: 'Posiblemente cancerígeno (Grupo 2A IARC). Muy alto en fritos y horneados.',
        fuente: 'Reacción de Maillard: almidón + aminoácidos + calor seco >120 °C.',
        recomendacion: 'Minimizar patatas fritas, snacks de maíz y galletas muy tostadas.' },
      { nombre: 'Nitritos (E249-E252)', tipo: 'Aditivo alimentario', riesgo: 'medio',
        efecto: 'Los nitritos forman nitrosaminas cancerígenas (Grupo 1 IARC) en el organismo.',
        fuente: 'Conservantes en embutidos, carnes curadas, bacon y jamón tratado.',
        recomendacion: 'Limitar embutidos procesados. Preferir jamón ibérico curado naturalmente.' },
      { nombre: 'Ácidos grasos trans (AGT)', tipo: 'Grasa industrial', riesgo: 'alto',
        efecto: 'Aumenta LDL, reduce HDL. Factor de riesgo cardiovascular demostrado.',
        fuente: 'Aceites vegetales parcialmente hidrogenados en bollería industrial.',
        recomendacion: "Evitar 'aceite vegetal parcialmente hidrogenado' en etiquetas. La UE los limita al 2%." },
      { nombre: 'PFAS (químicos eternos)', tipo: 'Contaminante emergente', riesgo: 'medio',
        efecto: 'Disruptores endocrinos, inmunosupresores y cancerígenos sospechados.',
        fuente: 'Envases con recubrimientos antiadherentes (cajas pizza, envases fast food).',
        recomendacion: 'Evitar calentar en envases de fast food. Preferir vidrio o papel sin recubrimiento.' },
    ]
  },
};

const CATEGORY_KEYWORDS = {
  pescado:  ['pescado','salmón','atún','bacalao','sardina','merluza','trucha','lubina','dorada','boquerón','anchoa','lenguado','pez','fish','salmon','tuna','cod','tilapia','besugo'],
  arroz:    ['arroz','rice'],
  verduras: ['verdura','lechuga','espinaca','brócoli','coliflor','zanahoria','tomate','pepino','pimiento','calabacín','berenjena','apio','vegetable','vegetal','hortaliza','ensalada','rúcula','col','repollo','acelga'],
  carne:    ['carne','ternera','cerdo','pollo','pavo','cordero','buey','beef','chicken','pork','lamb','filete','chuleta','hamburguesa','burger','embutido','salchicha','jamón','chorizo','bacon','meat'],
  lacteos:  ['leche','queso','yogur','mantequilla','nata','lácteo','milk','cheese','yogurt','butter','cream','dairy','kefir'],
  frutas:   ['fruta','manzana','pera','naranja','plátano','uva','fresa','melocotón','cereza','kiwi','mango','piña','fruit','apple','orange','banana','berry','melón','sandía','ciruela','albaricoque','aguacate'],
  mariscos: ['marisco','gamba','langosta','cangrejo','mejillón','ostra','almeja','calamar','pulpo','sepia','shrimp','lobster','crab','mussel','oyster','clam','squid','octopus','langostino','berberecho'],
  cereales: ['pan','pasta','trigo','maíz','avena','cebada','centeno','bread','wheat','corn','oat','cereal','harina','galleta','tostada','biscuit'],
  huevos:   ['huevo','egg','tortilla','omelette'],
  legumbres:['lenteja','garbanzo','judía','alubia','soja','guisante','haba','legumbre','bean','lentil','chickpea','soybean','pea','tofu','tempeh'],
  procesado:['procesado','frito','snack','chips','galleta','bollería','pizza','nuggets','comida rápida','ultraprocesado','processed','instant','precocinado','congelado','conserva'],
};

export function resolveCategory(foodInfo) {
  const cat = (foodInfo.categoria || '').toLowerCase().trim();
  if (TOXIN_DB[cat]) return cat;
  const name = (foodInfo.alimento_detectado || '').toLowerCase();
  for (const [key, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    if (kws.some(kw => name.includes(kw))) return key;
  }
  return null;
}

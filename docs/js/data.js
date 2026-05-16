// ═══════════════════════════════════════════════════
//  Base de datos toxicológica y categorización
//
//  Estructura de una toxina:
//   { nombre, tipo, riesgo, efecto, fuente, recomendacion,
//     aplica_a?: string[]   // opcional. Lista de stems
//                           //   (en minúsculas, sin tilde no es necesario).
//                           //   Si NO existe → la toxina aplica a todo
//                           //   el grupo. Si existe → solo se muestra
//                           //   cuando alimento_detectado incluye alguno
//                           //   de esos stems (case-insensitive).
//   }
//
//  Esto resuelve la granularidad "grupo vs alimento concreto":
//  por ejemplo la patulina solo aparece para manzana/pera/uva, y no
//  cuando el usuario fotografía un plátano.
// ═══════════════════════════════════════════════════

export const TOXIN_DB = {
  pescado: {
    nombre: 'Pescado', emoji: '🐟',
    toxinas: [
      { nombre: 'Mercurio (MeHg)', tipo: 'Metal pesado', riesgo: 'alto',
        aplica_a: ['atún','atun','pez espada','emperador','tiburón','tiburon','marlin','bonito','caballa','lucio','panga','perca','reloj anaranjado'],
        efecto: 'Neurotóxico. Daño al sistema nervioso central, especialmente grave en fetos y niños pequeños.',
        fuente: 'Bioacumulación en la cadena trófica marina. Máximo en grandes depredadores (atún rojo, pez espada, tiburón). Salmón, merluza o sardina presentan niveles bajos.',
        recomendacion: 'Máx. 2 raciones/semana. Embarazadas y niños <10 años deben evitar especies grandes.' },
      { nombre: 'PCB (Bifenilos Policlorados)', tipo: 'Contaminante orgánico persistente', riesgo: 'alto',
        efecto: 'Disruptor endocrino. Posiblemente cancerígeno (Grupo 2A IARC). Daño hepático.',
        fuente: 'Vertidos industriales históricos acumulados en sedimentos marinos. Más concentrado en pescados grasos (salmón, sardina, caballa).',
        recomendacion: 'Preferir pescado de aguas limpias certificadas. Retirar piel y grasa visible.' },
      { nombre: 'Anisakis simplex', tipo: 'Parásito', riesgo: 'medio',
        aplica_a: ['crudo','cruda','sushi','sashimi','ceviche','boquerón','boqueron','vinagre','marinado','tartar','tartare','poke','poké'],
        efecto: 'Anisakiasis: dolor abdominal agudo, náuseas y reacciones alérgicas severas.',
        fuente: 'Larvas en músculo de pescado crudo o poco cocinado.',
        recomendacion: 'Cocinar a >60 °C o congelar a −20 °C durante mínimo 7 días antes de consumir crudo.' },
      { nombre: 'HAP del ahumado', tipo: 'Neoformado por calor', riesgo: 'medio',
        aplica_a: ['ahumado','ahumada','smoked','curado','curada'],
        efecto: 'Hidrocarburos aromáticos policíclicos (benzo[a]pireno, etc.). Algunos clasificados como probables cancerígenos (Grupo 2A IARC).',
        fuente: 'Combustión incompleta de la madera durante el proceso de ahumado tradicional.',
        recomendacion: 'Limitar consumo frecuente. Preferir productos con humo líquido filtrado o ahumado en caliente controlado.' },
      { nombre: 'Listeria monocytogenes (ahumado en frío)', tipo: 'Patógeno bacteriano', riesgo: 'alto',
        aplica_a: ['ahumado','ahumada','smoked','gravlax','marinado','curado','curada','lonchas listo','listo para consumir'],
        efecto: 'Listeriosis: infección grave en embarazadas (cruza placenta), ancianos e inmunodeprimidos. Letalidad ≈ 20-30 %.',
        fuente: 'Pescado curado o ahumado en frío sin tratamiento térmico (T < 30 °C). Crece a temperatura de nevera.',
        recomendacion: 'Embarazadas: evitar pescado ahumado en frío. Consumir antes de fecha y mantener bien refrigerado.' },
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
        aplica_a: ['espinaca','rúcula','rucula','lechuga','acelga','remolacha','col','repollo','canónigo','berro'],
        efecto: 'Se convierten en nitritos en el organismo → metahemoglobinemia en bebés.',
        fuente: 'Fertilizantes nitrogenados. Muy altos en espinacas, rúcula, lechuga y remolacha.',
        recomendacion: 'No dar espinacas a bebés <6 meses. Consumir frescos. No recalentar purés.' },
      { nombre: 'Cadmio', tipo: 'Metal pesado', riesgo: 'bajo',
        efecto: 'Acumulación renal crónica en consumo elevado.',
        fuente: 'Suelos con historial de abonos fosfatados. Más en raíces y hojas.',
        recomendacion: 'Rotar cultivos. Lavar bien y pelar raíces.' },
      { nombre: 'Listeria monocytogenes', tipo: 'Patógeno bacteriano', riesgo: 'medio',
        aplica_a: ['brote','germinado','ensalada','lechuga','rúcula','rucula','espinaca','canónigo','col','repollo'],
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
      { nombre: 'Acrilamida y HCA (carnes procesadas)', tipo: 'Neoformado por calor', riesgo: 'medio',
        aplica_a: ['embutido','salchicha','jamón','jamon','chorizo','bacon','salami','mortadela','ahumado','frito','parrilla','barbacoa','asado','curado','frankfurt'],
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
      { nombre: 'Listeria monocytogenes (quesos)', tipo: 'Patógeno bacteriano', riesgo: 'medio',
        aplica_a: ['queso','quesito','brie','camembert','roquefort','feta','mozzarella','fresco','cheese'],
        efecto: 'Listeriosis: grave en embarazadas, ancianos e inmunodeprimidos. Mortalidad ≈ 20–30 %.',
        fuente: 'Quesos blandos o frescos sin pasteurizar.',
        recomendacion: 'Embarazadas: evitar quesos blandos sin pasteurizar. Conservar < 4 °C.' },
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
        fuente: 'Uso agrícola convencional. Mayor concentración en fresas, manzanas, uvas y melocotones (frutas con piel comestible). Frutas de piel gruesa como plátano o cítricos presentan niveles menores.',
        recomendacion: 'Lavar con agua corriente mínimo 30 s. Pelar cuando sea posible. Priorizar ecológico.' },
      { nombre: 'Fungicidas post-cosecha', tipo: 'Plaguicida residual', riesgo: 'bajo',
        efecto: 'Irritación digestiva en altas dosis. Algunos con sospecha de disrupción hormonal.',
        fuente: 'Aplicados tras la recolección para alargar la vida útil durante el transporte (especialmente en fruta importada como plátano, mango o cítricos).',
        recomendacion: 'Lavar bien la piel incluso en frutas que se pelan. Lavarse las manos tras pelar.' },
      { nombre: 'Ceras sintéticas', tipo: 'Aditivo tecnológico', riesgo: 'bajo',
        aplica_a: ['manzana','pera','naranja','limón','limon','mandarina','cítrico','citrico','pomelo','lima','clementina'],
        efecto: 'Generalmente reconocidas como seguras (GRAS). Posibles residuos de fungicidas adheridos.',
        fuente: 'Aplicadas en manzanas, peras, cítricos y pepinos para mejorar apariencia.',
        recomendacion: 'Lavar con agua caliente y cepillo. Pelar si se desea eliminar completamente.' },
      { nombre: 'Patulina (manzanas dañadas)', tipo: 'Micotoxina', riesgo: 'medio',
        aplica_a: ['manzana','pera','uva','zumo de manzana','sidra'],
        efecto: 'Nefrotóxico y genotóxico. Presente en zonas con moho (podredumbre marrón).',
        fuente: 'Hongos Penicillium expansum en fruta dañada. Pasa a zumos si hay fruta podrida.',
        recomendacion: 'Desechar zonas con moho (la toxina penetra la pulpa). Usar solo fruta sana para zumos.' },
    ]
  },
  mariscos: {
    nombre: 'Mariscos', emoji: '🦐',
    toxinas: [
      { nombre: 'Biotoxinas marinas (PSP, ASP, DSP)', tipo: 'Toxina natural', riesgo: 'alto',
        aplica_a: ['mejillón','mejillon','ostra','almeja','berberecho','vieira','navaja','bivalvo','molusco'],
        efecto: 'PSP: parálisis muscular potencialmente mortal. ASP: daño neurológico. DSP: diarrea severa.',
        fuente: 'Algas tóxicas filtradas por moluscos bivalvos (mejillones, ostras, almejas).',
        recomendacion: 'Solo consumir de zonas habilitadas con control oficial. No recolectar tras avisos sanitarios.' },
      { nombre: 'Mercurio y Cadmio', tipo: 'Metales pesados', riesgo: 'medio',
        aplica_a: ['pulpo','calamar','sepia','gamba','langostino','langosta','cangrejo','centollo','nécora','necora','cefalópodo','cefalopodo','crustáceo','crustaceo'],
        efecto: 'Acumulación en hígado y riñones. Neurotóxico (mercurio), nefrotóxico (cadmio).',
        fuente: 'Bioacumulación. Más elevado en cefalópodos (pulpo, calamar) y crustáceos.',
        recomendacion: 'Evitar las vísceras en crustáceos. Limitar consumo en embarazadas y niños.' },
      { nombre: 'Vibrio parahaemolyticus', tipo: 'Patógeno bacteriano', riesgo: 'alto',
        efecto: 'Gastroenteritis aguda severa. Infecciones sistémicas en inmunodeprimidos.',
        fuente: 'Bacterias naturales en agua marina caliente. Riesgo alto en verano.',
        recomendacion: 'No consumir mariscos crudos en verano o procedentes de agua templada sin certificar.' },
      { nombre: 'Microplásticos y nanoplásticos', tipo: 'Contaminante emergente', riesgo: 'bajo',
        aplica_a: ['mejillón','mejillon','ostra','almeja','berberecho','vieira','bivalvo','molusco'],
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
        aplica_a: ['pan','tostada','galleta','bizcocho','cereales','muesli','crujiente','frito','horneado','tostado'],
        efecto: 'Posiblemente cancerígeno (Grupo 2A IARC). Se forma en almidón + calor seco.',
        fuente: 'Pan muy tostado, galletas, cereales de desayuno tostados y patatas fritas.',
        recomendacion: 'Tostar a color dorado, no marrón oscuro. Evitar partes carbonizadas.' },
      { nombre: 'Deoxinivalenol (DON/Vomitoxina)', tipo: 'Micotoxina', riesgo: 'medio',
        aplica_a: ['trigo','pan','pasta','maíz','maiz','harina','sémola','semola','cereales','galleta','espagueti','macarrón','macarron'],
        efecto: 'Náuseas, vómitos y supresión inmune.',
        fuente: 'Fusarium en trigo y maíz húmedos.',
        recomendacion: 'Control de calidad en compra. La cocción reduce pero no elimina completamente.' },
      { nombre: 'Arsénico inorgánico', tipo: 'Metaloide tóxico', riesgo: 'bajo',
        aplica_a: ['avena','integral','centeno','salvado','copo','muesli','granola'],
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
      { nombre: 'Lectinas (alubias y judías)', tipo: 'Antinutriente natural', riesgo: 'medio',
        aplica_a: ['judía','judia','alubia','frijol','bean','poroto','soja','soybean','tofu','tempeh'],
        efecto: 'Crudas: náuseas, vómitos severos y daño intestinal. Especialmente alubias rojas.',
        fuente: 'Proteínas naturales de defensa de la planta. Muy altas en judías rojas crudas.',
        recomendacion: 'NUNCA consumir crudas. Remojar 8-12 h y cocer mínimo 15 min a 100 °C.' },
      { nombre: 'Aflatoxinas (cacahuetes)', tipo: 'Micotoxina', riesgo: 'medio',
        aplica_a: ['cacahuete','cacahuate','maní','mani','peanut'],
        efecto: 'Hepatotóxico y cancerígeno (Grupo 1 IARC). Inmunosupresor.',
        fuente: 'Aspergillus en almacenamiento húmedo. Frecuente en cacahuetes.',
        recomendacion: 'Almacenar en fresco y seco. Desechar si hay moho.' },
      { nombre: 'Fitoestrógenos (soja)', tipo: 'Compuesto bioactivo', riesgo: 'bajo',
        aplica_a: ['soja','soybean','tofu','tempeh','edamame','miso','natto'],
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
        aplica_a: ['frito','chip','patata','galleta','snack','horneado','bollería','bolleria','tostado','crujiente','nugget','dorito','frita'],
        efecto: 'Posiblemente cancerígeno (Grupo 2A IARC). Muy alto en fritos y horneados a >120 °C.',
        fuente: 'Reacción de Maillard: almidón + aminoácidos + calor seco >120 °C. Máximo en patatas fritas y galletas muy tostadas.',
        recomendacion: 'Minimizar patatas fritas, snacks de maíz y galletas muy tostadas. Tostar a dorado, no marrón oscuro.' },
      { nombre: 'Nitritos (E249-E252)', tipo: 'Aditivo alimentario', riesgo: 'medio',
        aplica_a: ['embutido','salchicha','jamón','jamon','bacon','chorizo','salami','mortadela','curado','frankfurt','york','salchichón','salchichon','fuet','fiambre'],
        efecto: 'Los nitritos forman nitrosaminas cancerígenas (Grupo 1 IARC) en el organismo, especialmente al cocinarse a alta temperatura.',
        fuente: 'Conservantes (E249–E252) en embutidos, carnes curadas, bacon y jamón tratado.',
        recomendacion: 'Limitar embutidos procesados. Preferir jamón ibérico curado naturalmente sin nitritos añadidos.' },
      { nombre: 'Ácidos grasos trans (AGT)', tipo: 'Grasa industrial', riesgo: 'alto',
        aplica_a: ['bollería','bolleria','galleta','margarina','bizcocho','dónut','donut','croissant','pizza','frito','industrial','muffin','cupcake','hojaldre','palomita','popcorn'],
        efecto: 'Aumenta LDL, reduce HDL. Factor de riesgo cardiovascular demostrado. Sin umbral seguro.',
        fuente: 'Aceites vegetales parcialmente hidrogenados en bollería industrial y margarinas.',
        recomendacion: "Leer etiquetas: evitar 'aceite vegetal parcialmente hidrogenado'. La UE limita al 2 % en producto final." },
      { nombre: 'PFAS (químicos eternos)', tipo: 'Contaminante emergente', riesgo: 'medio',
        aplica_a: ['pizza','fast food','envasado','envase','microondas','take away','take-away','envuelto','caja','palomita','popcorn','papel grasa'],
        efecto: 'Disruptores endocrinos, inmunosupresores y posiblemente cancerígenos (IARC 2023: Grupo 1 para PFOA). Persistentes en sangre décadas.',
        fuente: 'Recubrimientos antiadherentes de cajas de pizza, envases de fast food y bolsas de microondas.',
        recomendacion: 'No calentar comida en su envase de fast food. Preferir vidrio, acero o papel sin recubrimiento fluorado.' },
      { nombre: 'Clostridium botulinum (botulismo)', tipo: 'Patógeno bacteriano', riesgo: 'alto',
        aplica_a: ['conserva','enlatado','enlata','bote','tarro','escabech','paté','pate','foie','anchoa en lata','atún en lata','atun en lata','aceite casero','ajo en aceite'],
        efecto: 'La toxina botulínica bloquea la transmisión neuromuscular. Parálisis flácida descendente. Mortalidad sin tratamiento ≈ 5–10 %.',
        fuente: 'Esporas de C. botulinum en conservas mal esterilizadas, caseras o de baja acidez (pH >4,6). Crecen en anaerobiosis.',
        recomendacion: 'Desechar latas abombadas, con mal olor o que silban al abrirse. Las conservas caseras deben autoclavarse correctamente.' },
      { nombre: 'BPA (Bisfenol A)', tipo: 'Disruptor endocrino', riesgo: 'medio',
        aplica_a: ['lata','enlatado','bote','conserva','plástico','plastico','tetrabrik','brick','envase'],
        efecto: 'Imita al estrógeno. Altera el sistema hormonal. Asociado a infertilidad, obesidad y cáncer hormono-dependiente. Especialmente sensibles fetos y lactantes.',
        fuente: 'Revestimiento epoxi interior de latas y tapas metálicas. También en plásticos policarbonato (PC) reutilizables.',
        recomendacion: 'Preferir conservas en tarro de vidrio. Evitar calentar comida en envases plásticos. Buscar "BPA free" aunque los sustitutos (BPS, BPF) también generan controversia.' },
      { nombre: 'Colorantes azoicos (E102, E110, E122, E129…)', tipo: 'Aditivo alimentario', riesgo: 'medio',
        aplica_a: ['refresco','chuche','gominola','caramelo','bebida','snack','gelatina','helado','salsas','ketchup','fanta','naranjada'],
        efecto: 'El "pack de Southampton" (6 colorantes) se asocia a hiperactividad y déficit de atención en niños. Posibles reacciones alérgicas.',
        fuente: 'Colorantes sintéticos en bebidas, chuches, snacks y salsas de colores intensos.',
        recomendacion: 'Leer etiquetas. En la UE los productos con estos 6 colorantes deben incluir el aviso "puede afectar a la actividad y atención de los niños".' },
      { nombre: 'Benceno (benzoato + vitamina C)', tipo: 'Neoformado por reacción química', riesgo: 'medio',
        aplica_a: ['refresco','zumo','bebida','naranjada','limonada','energética','isotónica','soda'],
        efecto: 'Cancerígeno Grupo 1 (IARC). Se forma espontáneamente cuando E211 (benzoato sódico) reacciona con ácido ascórbico (vit. C) en presencia de luz o calor.',
        fuente: 'Refrescos que combinan conservante E211 con vitamina C añadida o zumo de frutas.',
        recomendacion: 'Revisar etiquetas: si llevan E211 y vitamina C juntos, el riesgo existe. Preferir bebidas sin benzoato.' },
      { nombre: 'Aspartamo (E951)', tipo: 'Edulcorante artificial', riesgo: 'bajo',
        aplica_a: ['zero','sin azúcar','sin azucar','light','diet','edulcor','refresco','yogur','postre'],
        efecto: 'Clasificado como posiblemente cancerígeno (Grupo 2B IARC, 2023). Debate científico activo. Se metaboliza en fenilalanina (contraindicado en fenilcetonuria).',
        fuente: 'Edulcorante intensivo en bebidas "zero", yogures light y productos sin azúcar.',
        recomendacion: 'Consumo moderado dentro de la IDA (40 mg/kg/día). Personas con fenilcetonuria deben evitarlo. Seguir las novedades regulatorias.' },
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
  procesado:['procesado','frito','snack','chips','bollería','pizza','nuggets','comida rápida','ultraprocesado','processed','instant','precocinado','congelado','conserva','lata','enlatado','bote','refresco','bebida','chuche','gominola','margarina','bolleria','dónut','donut','palomita','popcorn'],
};

export function resolveCategory(foodInfo) {
  const cat = (foodInfo.categoria || '').toLowerCase().trim();
  const name = (foodInfo.alimento_detectado || '').toLowerCase();

  // Si la IA dice "procesado", comprobar primero si el alimento encaja en una
  // categoría más específica (hamburguesa → carne, salmón ahumado → pescado…).
  // Solo se mantiene "procesado" si ninguna categoría específica lo reclama.
  if (cat === 'procesado' && name) {
    for (const [key, kws] of Object.entries(CATEGORY_KEYWORDS)) {
      if (key !== 'procesado' && kws.some(kw => name.includes(kw))) return key;
    }
  }

  if (TOXIN_DB[cat]) return cat;

  for (const [key, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    if (kws.some(kw => name.includes(kw))) return key;
  }
  return null;
}

// ═══════════════════════════════════════════════════
//  Filtro por alimento concreto
//
//  Reduce la lista de toxinas de un grupo a las que aplican
//  al alimento detectado por Gemini. Las toxinas SIN campo
//  `aplica_a` se consideran universales en el grupo y siempre
//  se devuelven. Las que SÍ lo tienen solo aparecen si alguno
//  de sus stems está contenido en `alimento_detectado`.
//
//  Devuelve además metadatos útiles para la UI:
//   - total:     nº de toxinas del grupo
//   - mostradas: nº de toxinas tras el filtro
//   - filtrado:  true si se descartó al menos una
// ═══════════════════════════════════════════════════
export function filterToxinasForFood(toxinas, alimentoDetectado = '') {
  const food = (alimentoDetectado || '').toLowerCase();
  const result = toxinas.filter(t => {
    if (!t.aplica_a || t.aplica_a.length === 0) return true;
    return t.aplica_a.some(stem => food.includes(stem.toLowerCase()));
  });
  return {
    toxinas: result,
    total: toxinas.length,
    mostradas: result.length,
    filtrado: result.length < toxinas.length,
  };
}

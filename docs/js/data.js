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
        efecto: 'Cancerígeno Grupo 1 (IARC). Daño renal, cardiovascular y pulmonar crónico. Sin umbral seguro de exposición.',
        fuente: 'El arroz absorbe arsénico del suelo y agua de riego mucho más que otros cereales. El arroz integral tiene 2–3× más que el blanco (el salvado concentra el metal). Tortitas y bebida de arroz alcanzan niveles especialmente altos.',
        recomendacion: 'Lavar con abundante agua y cocer con exceso de agua (escurrir al final). Limitar tortitas y bebida de arroz en niños <5 años. Alternar con otros cereales.' },
      { nombre: 'Arsénico en productos de arroz', tipo: 'Metaloide tóxico', riesgo: 'alto',
        aplica_a: ['tortita','cracker','bebida de arroz','leche de arroz','harina de arroz','integral','inflado','puffed'],
        efecto: 'Concentración de arsénico inorgánico 2–5× superior al grano cocido. Especialmente preocupante en dieta infantil.',
        fuente: 'El procesado concentra el salvado (tortitas, harina integral) o elimina la dilución del agua de cocción (bebida de arroz). La EFSA recomienda limitar estos productos en niños.',
        recomendacion: 'No usar tortitas de arroz como snack habitual en menores de 5 años. Rotar con otras bebidas vegetales (avena, soja) para reducir exposición.' },
      { nombre: 'Cadmio', tipo: 'Metal pesado', riesgo: 'medio',
        efecto: 'Nefrotóxico crónico. Daño renal acumulativo e irreversible. Mayor absorción en personas con déficit de hierro.',
        fuente: 'Suelos contaminados por fertilizantes fosfatados y residuos industriales. Mayor concentración en arroz integral (salvado).',
        recomendacion: 'Diversificar la dieta. Preferir arroz de origen certificado. El arroz integral tiene más cadmio que el blanco.' },
      { nombre: 'Plomo (Pb)', tipo: 'Metal pesado', riesgo: 'bajo',
        efecto: 'Neurotóxico acumulativo. Especialmente dañino en desarrollo infantil y cognitivo.',
        fuente: 'Suelos agrícolas próximos a zonas industriales. Niveles en arroz generalmente bajos en la UE.',
        recomendacion: 'Preferir arroz con trazabilidad certificada. El riesgo es bajo con arroz de origen europeo controlado.' },
      { nombre: 'Aflatoxinas (B1, B2)', tipo: 'Micotoxina', riesgo: 'medio',
        aplica_a: ['manchado','húmedo','deteriorado','dañado','viejo','mal olor','moho','grano partido'],
        efecto: 'Hepatotóxico y cancerígeno hepático (Grupo 1 IARC). Inmunosupresor.',
        fuente: 'Hongos Aspergillus flavus en almacenamiento con humedad >14 % y temperatura elevada. Arroz correctamente almacenado presenta riesgo bajo.',
        recomendacion: 'Almacenar en recipiente hermético en lugar fresco y seco. Desechar si hay manchas oscuras, mal olor o grano apelmazado.' },
      { nombre: 'Ocratoxina A (OTA)', tipo: 'Micotoxina', riesgo: 'medio',
        aplica_a: ['manchado','húmedo','deteriorado','dañado','viejo','mal olor','moho','integral'],
        efecto: 'Nefrotóxico crónico. Posiblemente cancerígeno (Grupo 2B IARC). Inmunosupresor.',
        fuente: 'Hongos Aspergillus y Penicillium en arroz almacenado en condiciones húmedas. Detectada esporádicamente en arroz integral.',
        recomendacion: 'Mismo vector que las aflatoxinas: almacenamiento seco y fresco. No consumir arroz con signos de deterioro.' },
    ]
  },
  verduras: {
    nombre: 'Verduras', emoji: '🥬',
    toxinas: [
      { nombre: 'Pesticidas organofosforados', tipo: 'Plaguicida residual', riesgo: 'medio',
        aplica_a: ['pimiento','apio','espinaca','pepino','lechuga','rúcula','rucula','judía','judia','tomate','col','kale','patata','papa','fresa'],
        efecto: 'Inhibición de acetilcolinesterasa. Neurotóxico. Posible disruptor endocrino.',
        fuente: 'Uso agrícola convencional. Mayor carga en pimiento, apio, espinaca, pepino y lechuga (lista "Dirty Dozen" EEUU). Menor en verduras de piel gruesa.',
        recomendacion: 'Lavar con agua abundante al menos 30 s. Pelar cuando sea posible. Priorizar ecológico en pimiento, espinaca y lechuga.' },
      { nombre: 'Nitratos (NO₃⁻)', tipo: 'Compuesto inorgánico', riesgo: 'medio',
        aplica_a: ['espinaca','rúcula','rucula','lechuga','acelga','remolacha','col','repollo','canónigo','berro','apio','rábano','rabano'],
        efecto: 'Se convierten en nitritos en el organismo → metahemoglobinemia en bebés. En adultos, exposición crónica elevada asociada a riesgo gástrico.',
        fuente: 'Fertilizantes nitrogenados. Niveles más altos en espinaca, rúcula, remolacha y apio. Se reducen con cocción y escurrido del agua.',
        recomendacion: 'No dar espinacas ni remolacha a bebés <6 meses. Consumir frescos. No recalentar purés de espinacas.' },
      { nombre: 'Cadmio', tipo: 'Metal pesado', riesgo: 'bajo',
        aplica_a: ['zanahoria','remolacha','rábano','rabano','patata','papa','apio','espinaca','acelga','lechuga'],
        efecto: 'Acumulación renal crónica e irreversible en consumo elevado durante años.',
        fuente: 'Suelos con historial de abonos fosfatados. Se concentra especialmente en raíces (zanahoria, remolacha, rábano) y hojas (espinaca, acelga).',
        recomendacion: 'Lavar bien y pelar raíces. Rotar fuentes de verduras. Riesgo bajo con dieta variada.' },
      { nombre: 'Solanina', tipo: 'Toxina natural', riesgo: 'medio',
        aplica_a: ['patata','papa','berenjena','tomate verde','patata verde','patata germinada','papa verde','papa germinada'],
        efecto: 'Glucoalcaloide tóxico. Náuseas, vómitos, diarrea y en dosis altas alteraciones neurológicas. Resistente a la cocción.',
        fuente: 'Se forma en patatas expuestas a luz (zonas verdes) o germinadas. También presente en berenjena cruda y tomates muy verdes, aunque en menor cantidad.',
        recomendacion: 'Desechar partes verdes o brotes de la patata (la toxina no se elimina cocinando). Almacenar patatas en oscuridad y lugar fresco.' },
      { nombre: 'Oxalatos', tipo: 'Antinutriente natural', riesgo: 'bajo',
        aplica_a: ['espinaca','acelga','remolacha','rúcula','rucula','berro','canónigo','col rizada','kale','perifollo'],
        efecto: 'Reducen la absorción de calcio y hierro. En consumo muy elevado y con predisposición: cálculos renales de oxalato cálcico.',
        fuente: 'Compuesto natural de defensa en hojas. Muy alto en espinacas (970 mg/100 g) y acelgas. Se reduce significativamente al hervir y escurrir.',
        recomendacion: 'Hervir y escurrir el agua de cocción reduce los oxalatos hasta un 50 %. Personas con historial de cálculos renales deben moderar el consumo crudo.' },
      { nombre: 'E. coli STEC (O157:H7)', tipo: 'Patógeno bacteriano', riesgo: 'alto',
        aplica_a: ['germinado','germinada','germinados','germinadas','brote','brotes','espinaca','lechuga','rúcula','rucula','canónigo','ensalada','crudo','cruda'],
        efecto: 'Síndrome hemolítico urémico (SHU): insuficiencia renal aguda, anemia hemolítica. Mortalidad significativa en niños y ancianos. Dosis infectiva muy baja.',
        fuente: 'Contaminación fecal en agua de riego. Brotes y espinacas crudas son los vectores más frecuentes (brotes graves en EE.UU. 2006, Europa 2011).',
        recomendacion: 'Lavar meticulosamente con agua corriente. Evitar germinados crudos en grupos vulnerables. La cocción elimina el patógeno completamente.' },
      { nombre: 'Listeria monocytogenes', tipo: 'Patógeno bacteriano', riesgo: 'medio',
        aplica_a: ['germinado','germinada','germinados','germinadas','brote','brotes','ensalada','lechuga','rúcula','rucula','espinaca','canónigo','bolsa','listo para consumir','IV gama'],
        efecto: 'Listeriosis: infección grave en embarazadas (cruza placenta), ancianos e inmunodeprimidos. Mortalidad ≈ 20–30 %.',
        fuente: 'Suelo y agua. Crece a temperatura de nevera. Mayor riesgo en verduras de IV gama (bolsas lavadas y listas para consumir) y germinados.',
        recomendacion: 'Lavar aunque el envase diga "lavado". Embarazadas: evitar germinados crudos y ensaladas prelavadas. Consumir antes de la fecha límite.' },
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
        aplica_a: ['embutido','salchicha','jamón','jamon','chorizo','bacon','salami','mortadela','ahumado','frito','parrilla','barbacoa','asado','curado','frankfurt','fuet','loncha','lomo','cecina','hamburguesa','burger'],
        efecto: 'Posiblemente cancerígeno (Grupo 2A IARC). Neurotóxico en dosis altas. Las aminas heterocíclicas (HCA) se forman en la superficie chamuscada de la carne.',
        fuente: 'Se forma al cocinar a altas temperaturas: fritura, parrilla y ahumado. Máximo en carne muy hecha o carbonizada.',
        recomendacion: 'Evitar carbonizado. Preferir cocción en agua o vapor. Retirar partes chamuscadas antes de comer.' },
      { nombre: 'Nitritos (E249–E252) y Nitrosaminas', tipo: 'Aditivo alimentario', riesgo: 'alto',
        aplica_a: ['embutido','salchicha','jamón','jamon','bacon','chorizo','salami','mortadela','frankfurt','york','salchichón','salchichon','fuet','fiambre','loncha','cecina','curado','curada'],
        efecto: 'La OMS clasifica las carnes procesadas como cancerígenas Grupo 1 (IARC). Los nitritos forman nitrosaminas en el organismo, especialmente al cocinar a alta temperatura.',
        fuente: 'Conservantes E249–E252 usados en embutidos y carnes curadas para inhibir Clostridium botulinum y dar el color rosado característico.',
        recomendacion: 'Limitar el consumo a ocasional. No quemar bacon ni salchichas. Preferir jamón ibérico curado sin nitritos añadidos (buscar "sin conservantes E249-E252").' },
      { nombre: 'Salmonella / Campylobacter', tipo: 'Patógeno bacteriano', riesgo: 'alto',
        aplica_a: ['pollo','pavo','chicken','turkey','ave','avícola','pechuga','muslo','alita','ala','gallina','codorniz'],
        efecto: 'Campylobacter es la zoonosis más frecuente en la UE. Salmonella: gastroenteritis con fiebre alta. Ambas graves en niños, embarazadas y ancianos.',
        fuente: 'Contaminación fecal en aves de corral. Mayor riesgo en pollo y pavo crudos o poco cocinados. El jugo de pollo crudo contamina superficies y otros alimentos.',
        recomendacion: 'Cocinar a >75 °C en el punto más grueso. NUNCA lavar el pollo crudo (dispersa bacterias). Usar tablas separadas para carne cruda y cocinada.' },
      { nombre: 'E. coli O157:H7 (carne picada)', tipo: 'Patógeno bacteriano', riesgo: 'alto',
        aplica_a: ['hamburguesa','burger','picada','picado','tartar','tartare','molida','molido','kebab','albóndiga','albondiga','filete ruso'],
        efecto: 'Puede causar Síndrome Urémico Hemolítico (SHU): insuficiencia renal aguda potencialmente mortal, especialmente en niños menores de 5 años. Dosis infectiva muy baja.',
        fuente: 'La molienda distribuye bacterias superficiales a toda la masa de carne. La contaminación interior no se elimina sin cocción completa.',
        recomendacion: 'Cocinar hamburguesas hasta que desaparezca el color rosa en el interior (>71 °C). Nunca consumir carne picada cruda o poco hecha, aunque sea de calidad.' },
    ]
  },
  lacteos: {
    nombre: 'Lácteos', emoji: '🥛',
    toxinas: [
      { nombre: 'Dioxinas y PCB', tipo: 'Contaminante orgánico persistente', riesgo: 'medio',
        aplica_a: ['queso','mantequilla','nata','crema','crème','helado','leche entera','entera','entero','manchego','cheddar','parmesano','parmigiano','curado','curada','requesón','requeson','mascarpone','mozzarella','ricotta','burrata','edam','raclette','brie','camembert','roquefort','feta','gouda','emmental','gruyère','gruyere','azul'],
        efecto: 'Disruptores endocrinos. Cancerígenos. Lipófilos: se concentran en la grasa láctea.',
        fuente: 'Contaminación ambiental en pastos y piensos. Mayor riesgo en quesos curados, mantequilla, nata y leche entera por su contenido graso.',
        recomendacion: 'Preferir lácteos desnatados o semidesnatados. Control de origen.' },
      { nombre: 'Aflatoxina M1', tipo: 'Micotoxina', riesgo: 'medio',
        efecto: 'Metabolito cancerígeno (Grupo 1 IARC) derivado de aflatoxina B1 en piensos.',
        fuente: 'Piensos contaminados con Aspergillus que el animal metaboliza a la leche.',
        recomendacion: 'Control estricto de piensos. La pasteurización no destruye las aflatoxinas.' },
      { nombre: 'Antibióticos residuales', tipo: 'Residuo veterinario', riesgo: 'bajo',
        efecto: 'Resistencia antimicrobiana. Reacciones alérgicas en personas sensibles.',
        fuente: 'Tratamientos veterinarios en vacas lecheras.',
        recomendacion: 'Los controles europeos son estrictos. Riesgo bajo con productos certificados UE.' },
      { nombre: 'Listeria monocytogenes (lácteos sin pasteurizar)', tipo: 'Patógeno bacteriano', riesgo: 'medio',
        aplica_a: ['queso','quesito','brie','camembert','roquefort','feta','mozzarella','fresco','cheese','azul','burrata','leche cruda','sin pasteurizar','ricotta','requesón','requeson'],
        efecto: 'Listeriosis: grave en embarazadas (cruza placenta), ancianos e inmunodeprimidos. Mortalidad ≈ 20–30 %.',
        fuente: 'Quesos blandos o frescos sin pasteurizar. Crece a temperatura de nevera.',
        recomendacion: 'Embarazadas: evitar quesos blandos sin pasteurizar. Conservar < 4 °C.' },
      { nombre: 'Aminas biógenas (histamina, tiramina)', tipo: 'Compuesto bioactivo', riesgo: 'bajo',
        aplica_a: ['curado','curada','parmesano','parmigiano','manchego','azul','roquefort','cabrales','gorgonzola','stilton','cheddar','gouda','emmental','gruyère','gruyere','viejo','añejo','anejo','reserva'],
        efecto: 'Cefalea, enrojecimiento y palpitaciones en personas sensibles. Grave si se combinan con IMAOs.',
        fuente: 'Fermentación prolongada en quesos curados y madurados. Aumentan con el tiempo de maduración.',
        recomendacion: 'Limitar en migrañas, intolerancia a histamina o tratamiento con IMAOs.' },
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
        aplica_a: ['mejillón','mejillon','ostra','almeja','berberecho','vieira','navaja','chirla','bivalvo','molusco'],
        efecto: 'PSP: parálisis muscular potencialmente mortal. ASP: daño neurológico permanente. DSP: diarrea severa y calambres.',
        fuente: 'Algas tóxicas (dinoflagelados) filtradas por moluscos bivalvos. Se acumulan en las vísceras. Las toxinas PSP son resistentes al calor.',
        recomendacion: 'Solo consumir de zonas habilitadas con control oficial. No recolectar tras avisos sanitarios. La cocción NO elimina la toxina PSP.' },
      { nombre: 'Mercurio (MeHg)', tipo: 'Metal pesado', riesgo: 'medio',
        aplica_a: ['pulpo','calamar','sepia','langosta','bogavante','cangrejo','centollo','nécora','necora','cigala','cefalópodo','cefalopodo','crustáceo','crustaceo'],
        efecto: 'Neurotóxico. Daño al sistema nervioso central. Especialmente grave en fetos y niños.',
        fuente: 'Bioacumulación en la cadena trófica marina. Mayor concentración en cefalópodos (pulpo, calamar) y grandes crustáceos. Evitar las vísceras.',
        recomendacion: 'Evitar vísceras en crustáceos grandes. Limitar consumo de pulpo y calamar en embarazadas y niños.' },
      { nombre: 'Cadmio', tipo: 'Metal pesado', riesgo: 'medio',
        aplica_a: ['mejillón','mejillon','ostra','almeja','berberecho','vieira','chirla','bivalvo','molusco','pulpo','calamar','sepia'],
        efecto: 'Nefrotóxico crónico. Daño renal acumulativo e irreversible. Mayor riesgo en consumo frecuente.',
        fuente: 'Bivalvos (mejillones, ostras) y cefalópodos acumulan cadmio en glándula digestiva. Los mejillones son uno de los alimentos con mayor contenido de cadmio en la dieta.',
        recomendacion: 'Limitar el consumo de vísceras de bivalvos. Moderar la frecuencia en embarazadas y niños.' },
      { nombre: 'Arsénico inorgánico', tipo: 'Metaloide tóxico', riesgo: 'bajo',
        aplica_a: ['gamba','langostino','camarón','cigala','langosta','bogavante','crustáceo','crustaceo','mejillón','mejillon','almeja','berberecho','chirla'],
        efecto: 'Cancerígeno Grupo 1 (IARC). En marisco predomina el arsénico orgánico (menos tóxico), pero la fracción inorgánica está presente y es relevante en consumo elevado.',
        fuente: 'El marisco concentra arsénico del agua marina. La mayoría es arsénico orgánico (arsenobetaína), pero gambas y bivalvos contienen una fracción inorgánica no despreciable.',
        recomendacion: 'Riesgo bajo con consumo moderado. Evitar consumo diario en niños pequeños. Preferir marisco de aguas certificadas.' },
      { nombre: 'Norovirus', tipo: 'Patógeno vírico', riesgo: 'alto',
        aplica_a: ['ostra','almeja','mejillón','mejillon','berberecho','vieira','chirla','navaja','bivalvo','molusco','crudo','cruda'],
        efecto: 'Gastroenteritis aguda: vómitos explosivos, diarrea y fiebre. Altamente contagioso. Principal causa de intoxicación alimentaria por marisco en España y Europa.',
        fuente: 'Bivalvos filtran y concentran norovirus de aguas contaminadas con aguas residuales. El virus persiste en el marisco y resiste temperaturas de cocción insuficientes.',
        recomendacion: 'Cocinar bivalvos a >85 °C durante al menos 1 minuto. Evitar ostras crudas en grupos vulnerables. Verificar origen certificado.' },
      { nombre: 'Hepatitis A (VHA)', tipo: 'Patógeno vírico', riesgo: 'alto',
        aplica_a: ['ostra','almeja','mejillón','mejillon','berberecho','vieira','chirla','navaja','bivalvo','molusco','crudo','cruda'],
        efecto: 'Hepatitis aguda: ictericia, fatiga intensa y daño hepático. Incubación 2–6 semanas. Graves consecuencias en personas sin vacuna o con hepatopatía previa.',
        fuente: 'Mismo vector que el norovirus: bivalvos filtran el virus de aguas contaminadas. Brotes documentados por ostras y almejas crudas en España.',
        recomendacion: 'Cocinar completamente. Vacunación disponible y recomendada. Embarazadas e inmunodeprimidos deben evitar bivalvos crudos.' },
      { nombre: 'Vibrio parahaemolyticus', tipo: 'Patógeno bacteriano', riesgo: 'alto',
        aplica_a: ['crudo','cruda','ostra','almeja','mejillón','mejillon','gamba','langostino','chirla','berberecho','sushi','ceviche'],
        efecto: 'Gastroenteritis aguda severa: diarrea acuosa, calambres y vómitos. Infecciones sistémicas graves en inmunodeprimidos.',
        fuente: 'Bacteria natural en agua marina caliente. Prolifera en verano. Riesgo alto en marisco crudo o poco cocinado procedente de aguas cálidas.',
        recomendacion: 'No consumir marisco crudo en verano. Cocinar a >65 °C. Refrigerar inmediatamente tras la compra.' },
      { nombre: 'Microplásticos y nanoplásticos', tipo: 'Contaminante emergente', riesgo: 'bajo',
        aplica_a: ['mejillón','mejillon','ostra','almeja','berberecho','vieira','chirla','bivalvo','molusco'],
        efecto: 'Los bivalvos se consumen enteros (vísceras incluidas), concentrando plásticos. Efectos crónicos en estudio: posibles disruptores endocrinos.',
        fuente: 'Contaminación plástica marina. Los bivalvos filtran hasta 11.000 microplásticos/día. Son el vector de mayor exposición humana a microplásticos por vía alimentaria.',
        recomendacion: 'Consumir de zonas certificadas con baja contaminación. Investigación activa sobre efectos a largo plazo.' },
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
        efecto: 'Salmonelosis: diarrea, vómitos y fiebre alta. Grave en embarazadas, ancianos e inmunodeprimidos. Incubación 6–72 h.',
        fuente: 'Contaminación de cáscara o del interior del huevo. Mayor riesgo en preparaciones crudas o poco cocinadas: mayonesa casera, tortilla poco cuajada, mousse de huevo, tiramisú y salsas césar.',
        recomendacion: 'Cocinar hasta yema sólida (>70 °C). Usar huevo pasteurizado en preparaciones frías. Refrigerar siempre. Lavar manos y superficies tras manipular.' },
      { nombre: 'Campylobacter', tipo: 'Patógeno bacteriano', riesgo: 'medio',
        aplica_a: ['crudo','cruda','cáscara','cascara','manipulado','sin lavar'],
        efecto: 'Campilobacteriosis: diarrea intensa (a veces con sangre), fiebre y calambres. Causa bacteriana de gastroenteritis más frecuente en Europa. Puede provocar síndrome de Guillain-Barré en casos raros.',
        fuente: 'Bacteria en la cáscara y superficies en contacto con huevos sin lavar. También por contaminación cruzada en cocina con otros productos avícolas.',
        recomendacion: 'Lavar manos tras tocar cáscaras. No lavar el huevo antes de guardarlo (daña la cutícula protectora). Evitar contaminación cruzada con utensilios.' },
      { nombre: 'Dioxinas y PCB', tipo: 'Contaminante orgánico persistente', riesgo: 'medio',
        efecto: 'Disruptores endocrinos y posiblemente cancerígenos (Grupo 1 IARC). Se acumulan en la yema al ser lipófilos.',
        fuente: 'Piensos contaminados y suelos con historial industrial en gallinas camperas. Las gallinas en libertad que picotean suelos contaminados acumulan más que las de sistemas cerrados.',
        recomendacion: 'Preferir huevos camperos de zonas rurales certificadas. Los huevos de código "1" (campero) y "0" (ecológico) pueden tener más contaminantes si los suelos no están monitorizados.' },
      { nombre: 'Residuos de pesticidas', tipo: 'Plaguicida residual', riesgo: 'bajo',
        efecto: 'Posibles efectos hormonales en exposición crónica.',
        fuente: 'Piensos tratados con pesticidas que se transfieren a la yema a través del metabolismo de la gallina.',
        recomendacion: 'Control europeo estricto (RASFF). Riesgo bajo con productos certificados UE.' },
      { nombre: 'Fipronil y otros insecticidas ilegales', tipo: 'Insecticida', riesgo: 'medio',
        efecto: 'Hepatotóxico, nefrotóxico y posible disruptor tiroideo en exposición elevada.',
        fuente: 'Uso ilegal de insecticidas como antiparasitarios en granjas avícolas. El escándalo de 2017 afectó a 17 países europeos; el riesgo de uso ilegal persiste y se detecta periódicamente.',
        recomendacion: 'Verificar el código impreso en el huevo: el número de país y granja permite rastrear el origen. Preferir productores con auditorías externas.' },
    ]
  },
  legumbres: {
    nombre: 'Legumbres', emoji: '🫘',
    toxinas: [
      { nombre: 'Lectinas (fitohemaglutinina)', tipo: 'Antinutriente natural', riesgo: 'alto',
        aplica_a: ['judía','judia','alubia','frijol','bean','poroto','soja','soybean','kidney','roja','pinta','borlotti'],
        efecto: 'Crudas o mal cocinadas: náuseas y vómitos violentos en 1–3 h, diarrea y daño intestinal. Las alubias rojas crudas contienen hasta 70.000 UH de fitohemaglutinina — 4–5 alubias crudas pueden causar intoxicación.',
        fuente: 'Proteínas de defensa de la planta. Concentración máxima en alubias rojas y pintas crudas. La cocción en olla lenta (slow cooker) a <100 °C puede ser insuficiente.',
        recomendacion: 'NUNCA consumir crudas ni cocinadas en slow cooker sin hervir antes. Remojar 8–12 h, descartar el agua y hervir mínimo 15 min a fuego vivo.' },
      { nombre: 'Glucósidos cianogénicos', tipo: 'Toxina natural', riesgo: 'medio',
        aplica_a: ['haba','habas','alubia lima','judía lima','butter bean','haba tonka','judía de Lima'],
        efecto: 'Liberan cianuro de hidrógeno (HCN) al masticar o cocinar. Síntomas: náuseas, mareo, dificultad respiratoria. Las variedades silvestres o importadas de zonas tropicales tienen mayor concentración.',
        fuente: 'Linamarina en habas y alubias lima. Las variedades europeas cultivadas tienen niveles bajos; las importadas o silvestres pueden ser peligrosas sin cocción adecuada.',
        recomendacion: 'Remojar en agua abundante (cambiar el agua) y cocer con la olla destapada para volatilizar el HCN. Las habas frescas europeas son seguras consumidas normalmente.' },
      { nombre: 'Aflatoxinas', tipo: 'Micotoxina', riesgo: 'medio',
        aplica_a: ['cacahuete','cacahuate','maní','mani','peanut','mantequilla de cacahuete','lenteja','garbanzo','alubia'],
        efecto: 'Hepatotóxico y cancerígeno hepático (Grupo 1 IARC). Inmunosupresor. Mayor riesgo en cacahuetes que en otras legumbres.',
        fuente: 'Hongos Aspergillus flavus en almacenamiento húmedo. Muy frecuente en cacahuetes y sus derivados (mantequilla de cacahuete). También detectado en lentejas y garbanzos mal almacenados.',
        recomendacion: 'Almacenar en lugar fresco y seco. Desechar si hay moho, manchas oscuras o mal olor. En cacahuetes, preferir marcas con controles de aflatoxinas.' },
      { nombre: 'Ácido fítico (fitatos)', tipo: 'Antinutriente natural', riesgo: 'bajo',
        efecto: 'Reduce la absorción de hierro, zinc, calcio y magnesio hasta un 50–80 %. Relevante en dietas vegetarianas/veganas donde las legumbres son la principal fuente de estos minerales.',
        fuente: 'Compuesto natural presente en todas las legumbres, concentrado en la cubierta de la semilla. Se reduce significativamente con remojo, germinación y fermentación.',
        recomendacion: 'Remojar las legumbres 8–12 h y descartar el agua antes de cocer. La germinación y la fermentación (tempeh, miso) eliminan hasta el 90 % del ácido fítico.' },
      { nombre: 'Fitoestrógenos (soja)', tipo: 'Compuesto bioactivo', riesgo: 'bajo',
        aplica_a: ['soja','soybean','tofu','tempeh','edamame','miso','natto','bebida de soja','leche de soja'],
        efecto: 'Debate científico activo. Las isoflavonas imitan débilmente al estrógeno. Consumo excesivo puede interferir con tratamientos hormonales y función tiroidea.',
        fuente: 'Isoflavonas naturales en soja: genisteína y daidzeína. Concentración mayor en soja entera y edamame que en tofu o bebida de soja.',
        recomendacion: 'Consumo moderado (1–2 raciones/día) sin problema para adultos sanos. Precaución con suplementos de isoflavonas concentradas o tratamientos oncológicos hormonodependientes.' },
      { nombre: 'Residuos de glifosato', tipo: 'Herbicida residual', riesgo: 'medio',
        aplica_a: ['soja','soybean','lenteja','garbanzo','alubia','judía','judia','guisante'],
        efecto: 'Posiblemente cancerígeno (Grupo 2A IARC — debate activo). Posible disbiosis intestinal en exposición crónica.',
        fuente: 'Usado como herbicida y desecante pre-cosecha en soja y legumbres convencionales. Los residuos persisten en el grano seco.',
        recomendacion: 'Preferir legumbres ecológicas certificadas. El remojo y la cocción reducen pero no eliminan completamente los residuos.' },
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
  arroz:    ['arroz','rice','paella','risotto','tortita de arroz','bebida de arroz','leche de arroz','harina de arroz','arroz con leche','arroz integral','sushi rice'],
  verduras: ['verdura','lechuga','espinaca','brócoli','broccoli','coliflor','zanahoria','tomate','pepino','pimiento','calabacín','berenjena','apio','vegetable','vegetal','hortaliza','ensalada','rúcula','col','repollo','acelga','patata','papa','remolacha','germinado','brote','cebolla','ajo','puerro','champiñón','seta','judía verde','alcachofa','rábano','berro','canónigo','kale','col rizada'],
  carne:    ['carne','ternera','cerdo','pollo','pavo','cordero','buey','beef','chicken','pork','lamb','filete','chuleta','hamburguesa','burger','embutido','salchicha','jamón','chorizo','bacon','meat'],
  lacteos:  ['leche','queso','yogur','mantequilla','nata','lácteo','milk','cheese','yogurt','butter','cream','dairy','kefir'],
  frutas:   ['fruta','manzana','pera','naranja','plátano','uva','fresa','melocotón','cereza','kiwi','mango','piña','fruit','apple','orange','banana','berry','melón','sandía','ciruela','albaricoque','aguacate'],
  mariscos: ['marisco','gamba','langosta','cangrejo','mejillón','ostra','almeja','calamar','pulpo','sepia','shrimp','lobster','crab','mussel','oyster','clam','squid','octopus','langostino','berberecho','chirla','bogavante','cigala','camarón','percebe','nécora','necora','vieira','navaja','centollo','zamburiña','erizo','bivalvo','molusco','cefalópodo'],
  cereales: ['pan','pasta','trigo','maíz','avena','cebada','centeno','bread','wheat','corn','oat','cereal','harina','galleta','tostada','biscuit'],
  huevos:   ['huevo','egg','tortilla','omelette','revuelto','mayonesa','clara','yema','huevo frito','huevo cocido','huevo pasado','huevo poché','mousse','tiramisú','tiramisu'],
  legumbres:['lenteja','garbanzo','judía','alubia','soja','guisante','haba','legumbre','bean','lentil','chickpea','soybean','pea','tofu','tempeh','cacahuete','cacahuate','maní','mani','peanut','edamame','miso','natto','lupino','frijol','poroto','butter bean'],
  procesado:['procesado','frito','snack','chips','bollería','pizza','nuggets','comida rápida','ultraprocesado','processed','instant','precocinado','congelado','conserva','lata','enlatado','bote','refresco','bebida','chuche','gominola','margarina','bolleria','dónut','donut','palomita','popcorn'],
};

export function resolveCategory(foodInfo) {
  const cat = (foodInfo.categoria || '').toLowerCase().trim();
  const name = (foodInfo.alimento_detectado || '').toLowerCase();

  // Categorías genéricas que la IA tiende a usar en exceso. Si el nombre del
  // alimento encaja en una categoría más específica, se prefiere esta última.
  // Ejemplos: hamburguesa → carne, bebida de arroz → arroz.
  const GENERIC_CATS = new Set(['procesado', 'cereales']);
  if (GENERIC_CATS.has(cat) && name) {
    for (const [key, kws] of Object.entries(CATEGORY_KEYWORDS)) {
      if (!GENERIC_CATS.has(key) && kws.some(kw => name.includes(kw))) return key;
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
// Comprueba si `stem` aparece como palabra completa dentro de `text`.
// Necesario para evitar falsos positivos como `desnatado`.includes(`nata`) → true.
// Trata como límite de palabra cualquier carácter que NO sea alfanumérico latino
// (incluye letras con tilde y la ñ).
// Acepta plurales españoles/ingleses: salchicha → salchichas, hamburguesa → hamburguesas.
function matchStem(text, stem) {
  const escaped = stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(^|[^a-z0-9áéíóúüñ])${escaped}(s|as|es)?([^a-z0-9áéíóúüñ]|$)`, 'i');
  return re.test(text);
}

export function filterToxinasForFood(toxinas, alimentoDetectado = '') {
  const food = (alimentoDetectado || '').toLowerCase();
  const result = toxinas.filter(t => {
    if (!t.aplica_a || t.aplica_a.length === 0) return true;
    return t.aplica_a.some(stem => matchStem(food, stem.toLowerCase()));
  });
  return {
    toxinas: result,
    total: toxinas.length,
    mostradas: result.length,
    filtrado: result.length < toxinas.length,
  };
}

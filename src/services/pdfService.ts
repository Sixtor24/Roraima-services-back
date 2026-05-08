import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

interface ContratoConRelaciones {
  id: number;
  fechaInicio: Date;
  fechaFin: Date;
  dias: number;
  canonDiarioUsd: number;
  depositoUsd: number;
  kilometrajeInicio: number;
  kilometrajeFin: number | null;
  estado: string;
  observaciones: string | null;
  vehiculo: {
    marca: string;
    tipo: string;
    ano: number;
    modelo: string;
    color: string;
    placa: string;
    serialMotor: string;
  };
  cliente: {
    nombreCompleto: string;
    cedula: string;
    direccion: string | null;
    telefono: string | null;
  };
}

function formatDate(date: Date): string {
  const d = new Date(date);
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

function formatDateShort(date: Date): string {
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function numberToWords(n: number): string {
  const units = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const teens = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
  const tens = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];

  if (n === 0) return 'cero';
  if (n < 10) return units[n];
  if (n < 20) return teens[n - 10];
  if (n < 30) return n === 20 ? 'veinte' : 'veinti' + units[n - 20];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    return u === 0 ? tens[t] : `${tens[t]} y ${units[u]}`;
  }
  return String(n);
}

function generateHtml(contrato: ContratoConRelaciones): string {
  const { vehiculo, cliente } = contrato;

  // Try to load logo as base64
  let logoHtml = '';
  const logoPath = path.join(__dirname, '..', '..', 'public', 'logo-pdf.png');
  if (fs.existsSync(logoPath)) {
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');
    logoHtml = `<img src="data:image/png;base64,${logoBase64}" style="width: 180px; height: auto;" />`;
  } else {
    logoHtml = `<div style="font-size: 18px; font-weight: bold; color: #c00c22;">RORAIMA SERVICES, C.A.</div>`;
  }

  const diasEnLetras = numberToWords(contrato.dias).toUpperCase();
  const fechaInicioStr = formatDate(contrato.fechaInicio);
  const fechaFinStr = formatDate(contrato.fechaFin);
  const fechaInicioShort = formatDateShort(contrato.fechaInicio);
  const fechaFinShort = formatDateShort(contrato.fechaFin);
  const totalUsd = contrato.canonDiarioUsd * contrato.dias;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    @page {
      size: letter;
      margin: 25mm 20mm 20mm 20mm;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12px;
      line-height: 1.6;
      color: #000;
      margin: 0;
      padding: 0;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      border-bottom: 2px solid #c00c22;
      padding-bottom: 10px;
    }
    .header-right {
      text-align: right;
      font-size: 10px;
      color: #555;
    }
    .title {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      text-transform: uppercase;
      margin: 25px 0 20px 0;
      letter-spacing: 2px;
    }
    .clause-title {
      font-weight: bold;
      text-decoration: underline;
      margin-top: 16px;
      margin-bottom: 6px;
    }
    .body-text {
      text-align: justify;
      margin-bottom: 8px;
    }
    .data-highlight {
      font-weight: bold;
    }
    .signature-section {
      margin-top: 60px;
      display: flex;
      justify-content: space-between;
    }
    .signature-block {
      text-align: center;
      width: 40%;
    }
    .signature-line {
      border-top: 1px solid #000;
      margin-top: 60px;
      padding-top: 5px;
      font-size: 11px;
    }
    .vehicle-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
    }
    .vehicle-table td {
      padding: 4px 8px;
      border: 1px solid #ccc;
      font-size: 11px;
    }
    .vehicle-table td:first-child {
      font-weight: bold;
      width: 35%;
      background: #f5f5f5;
    }
  </style>
</head>
<body>

  <div class="header">
    <div>${logoHtml}</div>
    <div class="header-right">
      RIF: J-50300741-0<br/>
      Puerto Ordaz, Edo. Bolívar<br/>
      Venezuela
    </div>
  </div>

  <div class="title">CONTRATO DE ARRENDAMIENTO DE VEH&Iacute;CULO</div>

  <p class="body-text">
    Entre <span class="data-highlight">RORAIMA SERVICES, C.A.</span>, inscrita por ante el Registro Mercantil Primero de la
    Circunscripción Judicial del Estado Bolívar, bajo el N° 32, Tomo 23-A-Pro, de fecha 15 de marzo de 2022, con RIF J-50300741-0,
    representada por su Director <span class="data-highlight">SIXTO RAFAEL TORREALBA FIGUEREDO</span>, titular de la cédula de
    identidad N° V-13.457.589, quien en lo adelante se denominará <span class="data-highlight">"LA ARRENDADORA"</span>; y por
    la otra parte, el(la) ciudadano(a) <span class="data-highlight">${cliente.nombreCompleto}</span>, titular de la cédula de
    identidad N° <span class="data-highlight">${cliente.cedula}</span>${cliente.direccion ? `, domiciliado(a) en ${cliente.direccion}` : ''}${cliente.telefono ? `, teléfono ${cliente.telefono}` : ''},
    quien en lo adelante se denominará <span class="data-highlight">"EL ARRENDATARIO"</span>, se ha convenido en celebrar
    el presente contrato de arrendamiento de vehículo, el cual se regirá por las siguientes cláusulas:
  </p>

  <p class="clause-title">CLÁUSULA PRIMERA: OBJETO DEL CONTRATO</p>
  <p class="body-text">
    LA ARRENDADORA da en arrendamiento a EL ARRENDATARIO, un vehículo de su propiedad con las siguientes características:
  </p>

  <table class="vehicle-table">
    <tr><td>Marca</td><td>${vehiculo.marca}</td></tr>
    <tr><td>Tipo</td><td>${vehiculo.tipo}</td></tr>
    <tr><td>Año</td><td>${vehiculo.ano}</td></tr>
    <tr><td>Modelo</td><td>${vehiculo.modelo}</td></tr>
    <tr><td>Color</td><td>${vehiculo.color}</td></tr>
    <tr><td>Placa</td><td>${vehiculo.placa}</td></tr>
    <tr><td>Serial del Motor</td><td>${vehiculo.serialMotor}</td></tr>
    <tr><td>Kilometraje de Inicio</td><td>${contrato.kilometrajeInicio.toLocaleString()} Km</td></tr>
  </table>

  <p class="clause-title">CLÁUSULA SEGUNDA: DURACIÓN</p>
  <p class="body-text">
    El presente contrato tendrá una duración de <span class="data-highlight">${diasEnLetras} (${contrato.dias}) días</span>,
    contados a partir del día <span class="data-highlight">${fechaInicioStr}</span> hasta el día
    <span class="data-highlight">${fechaFinStr}</span>. Si EL ARRENDATARIO no devuelve el vehículo en la fecha pactada,
    se aplicará un recargo adicional equivalente al canon diario más un 50% por cada día de retraso.
  </p>

  <p class="clause-title">CLÁUSULA TERCERA: CANON DE ARRENDAMIENTO</p>
  <p class="body-text">
    EL ARRENDATARIO se compromete a pagar a LA ARRENDADORA la cantidad de
    <span class="data-highlight">${contrato.canonDiarioUsd.toFixed(2)} USD (dólares americanos) diarios</span>,
    lo que totaliza la cantidad de <span class="data-highlight">${totalUsd.toFixed(2)} USD</span> por el período completo
    de ${contrato.dias} días. El pago se realizará al momento de la firma del presente contrato.
  </p>

  <p class="clause-title">CLÁUSULA CUARTA: DEPÓSITO EN GARANTÍA</p>
  <p class="body-text">
    EL ARRENDATARIO entrega en calidad de depósito la cantidad de
    <span class="data-highlight">${contrato.depositoUsd.toFixed(2)} USD (dólares americanos)</span>,
    la cual será reembolsada al finalizar el contrato, siempre y cuando el vehículo sea devuelto en las mismas condiciones
    en que fue entregado, salvo el desgaste normal por uso. En caso de daños, LA ARRENDADORA descontará del depósito
    el monto correspondiente a las reparaciones.
  </p>

  <p class="clause-title">CLÁUSULA QUINTA: ENTREGA Y DEVOLUCIÓN</p>
  <p class="body-text">
    El vehículo será entregado y deberá ser devuelto en la sede de LA ARRENDADORA, ubicada en Torre Colón, Puerto Ordaz,
    Estado Bolívar. EL ARRENDATARIO recibirá el vehículo en perfectas condiciones mecánicas y de carrocería, con el tanque
    de combustible lleno, y se compromete a devolverlo en las mismas condiciones.
  </p>

  <p class="clause-title">CLÁUSULA SEXTA: USO DEL VEHÍCULO</p>
  <p class="body-text">
    EL ARRENDATARIO se compromete a utilizar el vehículo de manera responsable y conforme a las leyes de tránsito vigentes
    en la República Bolivariana de Venezuela. Queda expresamente prohibido: a) Utilizar el vehículo para carreras,
    competencias o pruebas de velocidad; b) Transportar materiales peligrosos, inflamables o ilegales; c) Subarrendar
    el vehículo a terceros; d) Conducir bajo los efectos de alcohol o sustancias estupefacientes; e) Trasladar el vehículo
    fuera del territorio nacional sin autorización expresa y por escrito de LA ARRENDADORA.
  </p>

  <p class="clause-title">CLÁUSULA SÉPTIMA: RESPONSABILIDADES</p>
  <p class="body-text">
    EL ARRENDATARIO será responsable de: a) Cualquier multa, infracción o sanción de tránsito generada durante el período
    de arrendamiento; b) Los daños y perjuicios causados al vehículo por negligencia, imprudencia o uso indebido;
    c) El pago de combustible, peajes y estacionamiento; d) Notificar inmediatamente a LA ARRENDADORA en caso de accidente,
    robo, hurto o cualquier incidente que involucre al vehículo; e) No realizar modificaciones o alteraciones al vehículo
    sin autorización de LA ARRENDADORA.
  </p>

  <p class="clause-title">CLÁUSULA OCTAVA: CAUSAS DE TERMINACIÓN</p>
  <p class="body-text">
    El presente contrato podrá ser terminado anticipadamente por: a) Mutuo acuerdo entre las partes; b) Incumplimiento
    de cualquiera de las cláusulas por parte de EL ARRENDATARIO; c) Uso indebido del vehículo; d) Falta de pago.
    En caso de terminación anticipada por causa imputable a EL ARRENDATARIO, este no tendrá derecho a la devolución
    del depósito ni al reembolso proporcional del canon de arrendamiento.
  </p>

  <p class="clause-title">CLÁUSULA NOVENA: JURISDICCIÓN</p>
  <p class="body-text">
    Para todos los efectos derivados del presente contrato, las partes eligen como domicilio especial la ciudad de
    Puerto Ordaz, Municipio Caroní del Estado Bolívar, y se someten a la jurisdicción de los tribunales competentes
    de dicha localidad. Todo lo no previsto en el presente contrato se regirá por las disposiciones del Código Civil
    de la República Bolivariana de Venezuela.
  </p>

  <p class="body-text" style="margin-top: 20px;">
    Se firman dos (2) ejemplares de un mismo tenor y a un solo efecto, en Puerto Ordaz, a los ${formatDate(contrato.fechaInicio)}.
  </p>

  <div class="signature-section">
    <div class="signature-block">
      <div class="signature-line">
        <strong>LA ARRENDADORA</strong><br/>
        RORAIMA SERVICES, C.A.<br/>
        SIXTO RAFAEL TORREALBA FIGUEREDO<br/>
        C.I.: V-13.457.589
      </div>
    </div>
    <div class="signature-block">
      <div class="signature-line">
        <strong>EL ARRENDATARIO</strong><br/>
        ${cliente.nombreCompleto}<br/>
        C.I.: ${cliente.cedula}
      </div>
    </div>
  </div>

</body>
</html>`;
}

export async function generateContratoPdf(contrato: ContratoConRelaciones): Promise<Buffer> {
  const html = generateHtml(contrato);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfUint8 = await page.pdf({
    format: 'Letter',
    printBackground: true,
    margin: { top: '25mm', right: '20mm', bottom: '20mm', left: '20mm' },
  });

  await browser.close();

  return Buffer.from(pdfUint8);
}

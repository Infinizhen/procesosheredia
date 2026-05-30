import type { LocaleCode } from '../i18n/locales'

interface LegalSection {
  heading: string
  body: Array<string | { list: string[] }>
}

export interface LegalDoc {
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
  /** Optional note (e.g. "the Spanish version prevails"). */
  note?: string
}

const EMAIL = 'antonio@procesosheredia.com'

/**
 * Privacy & cookies content per locale. Deliberately minimal: this is a
 * personal artist site with no analytics, no profiling and no tracking cookies.
 * The Spanish text is the legally operative one (controller based in Spain).
 */
export const LEGAL: Record<LocaleCode, LegalDoc> = {
  es: {
    title: 'Privacidad y cookies',
    updated: 'Última actualización: 30 de mayo de 2026.',
    intro:
      'Esta es la web personal del artista Antonio Procesos Heredia. Está diseñada para recoger los mínimos datos posibles: no usa analítica, no elabora perfiles y no instala cookies de seguimiento.',
    sections: [
      {
        heading: 'Responsable',
        body: [
          `Responsable del tratamiento: el titular de procesosheredia.com (Antonio Procesos Heredia). Contacto: ${EMAIL}.`,
        ],
      },
      {
        heading: 'Qué datos tratamos y por qué',
        body: [
          {
            list: [
              'Datos de conexión (incluida la dirección IP): cuando visitas la web, el proveedor de alojamiento (Cloudflare) registra datos técnicos de la conexión para prestar el servicio y garantizar su seguridad. Base jurídica: interés legítimo (seguridad y funcionamiento del sitio).',
              `Correo electrónico: si nos escribes a ${EMAIL}, trataremos los datos de tu mensaje con la única finalidad de responderte. Base jurídica: tu consentimiento al contactarnos.`,
            ],
          },
          'No recopilamos datos para publicidad, analítica ni elaboración de perfiles.',
        ],
      },
      {
        heading: 'Proveedores y transferencias',
        body: [
          'Alojamiento y distribución: Cloudflare. Puede implicar el tratamiento de datos en servidores fuera del Espacio Económico Europeo (p. ej. EE. UU.) con las garantías adecuadas previstas en el RGPD (cláusulas contractuales tipo / marco de privacidad de datos UE-EE. UU.).',
          'Reproductor de música: si pulsas «Escuchar en Spotify», se carga un reproductor de Spotify que puede instalar sus propias cookies (ver «Cookies»).',
        ],
      },
      {
        heading: 'Conservación',
        body: [
          'Los registros técnicos se conservan el tiempo necesario para la seguridad del servicio. Los correos, mientras dure la comunicación y el plazo legalmente exigible.',
        ],
      },
      {
        heading: 'Tus derechos',
        body: [
          `Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a ${EMAIL}.`,
          'Si consideras que no se han atendido correctamente, puedes reclamar ante la Agencia Española de Protección de Datos (AEPD), www.aepd.es.',
        ],
      },
      {
        heading: 'Cookies',
        body: [
          'Una cookie es un pequeño archivo que un sitio guarda en tu navegador. Esta web no instala cookies propias de seguimiento ni de analítica.',
          {
            list: [
              'Cookies técnicas (Cloudflare): el proveedor puede usar cookies estrictamente necesarias para la seguridad y el funcionamiento del sitio. Están exentas de consentimiento.',
              'Cookies de terceros (Spotify): solo se cargan si pulsas «Escuchar en Spotify». En ese momento, Spotify puede instalar sus propias cookies conforme a su política de privacidad.',
            ],
          },
          'Por eso no mostramos un aviso de cookies: no instalamos cookies no esenciales sin tu acción. Puedes bloquear o eliminar las cookies desde la configuración de tu navegador.',
        ],
      },
      {
        heading: 'Cambios',
        body: [
          'Podemos actualizar esta política. Publicaremos cualquier cambio en esta misma página, indicando su fecha.',
        ],
      },
    ],
  },

  en: {
    title: 'Privacy & cookies',
    updated: 'Last updated: 30 May 2026.',
    intro:
      'This is the personal website of the artist Antonio Procesos Heredia. It is built to collect as little data as possible: no analytics, no profiling and no tracking cookies.',
    sections: [
      {
        heading: 'Data controller',
        body: [
          `Controller: the owner of procesosheredia.com (Antonio Procesos Heredia). Contact: ${EMAIL}.`,
        ],
      },
      {
        heading: 'What data we process, and why',
        body: [
          {
            list: [
              'Connection data (including your IP address): when you visit, the hosting provider (Cloudflare) logs technical connection data to deliver the service and keep it secure. Legal basis: legitimate interest (security and operation of the site).',
              `Email: if you write to ${EMAIL}, we process the data in your message solely to reply. Legal basis: your consent in contacting us.`,
            ],
          },
          'We do not collect data for advertising, analytics or profiling.',
        ],
      },
      {
        heading: 'Providers & transfers',
        body: [
          'Hosting and delivery: Cloudflare. This may involve processing on servers outside the European Economic Area (e.g. the USA) under the appropriate GDPR safeguards (standard contractual clauses / EU–US Data Privacy Framework).',
          'Music player: if you click “Listen on Spotify”, a Spotify player loads which may set its own cookies (see “Cookies”).',
        ],
      },
      {
        heading: 'Retention',
        body: [
          'Technical logs are kept for as long as needed for the security of the service. Emails are kept for the duration of the exchange and any legally required period.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          `You can exercise your rights of access, rectification, erasure, objection, restriction and portability by writing to ${EMAIL}.`,
          'If you believe your request was not handled properly, you may lodge a complaint with the Spanish Data Protection Agency (AEPD), www.aepd.es.',
        ],
      },
      {
        heading: 'Cookies',
        body: [
          'A cookie is a small file a site stores in your browser. This site sets no first-party tracking or analytics cookies.',
          {
            list: [
              'Technical cookies (Cloudflare): the provider may use strictly necessary cookies for the security and operation of the site. These are exempt from consent.',
              'Third-party cookies (Spotify): these load only if you click “Listen on Spotify”. Spotify may then set its own cookies under its privacy policy.',
            ],
          },
          'That is why we show no cookie banner: we set no non-essential cookies without your action. You can block or delete cookies in your browser settings.',
        ],
      },
      {
        heading: 'Changes',
        body: [
          'We may update this policy. Any changes will be posted on this page with their date.',
        ],
      },
    ],
    note: 'The Spanish version is the legally binding one.',
  },

  ja: {
    title: 'プライバシーとクッキー',
    updated: '最終更新日：2026年5月30日',
    intro:
      '本サイトはアーティスト Antonio Procesos Heredia の個人サイトです。データ収集は最小限に設計されており、アクセス解析・プロファイリング・トラッキングクッキーは使用していません。',
    sections: [
      {
        heading: '管理者',
        body: [
          `管理者：procesosheredia.com の運営者（Antonio Procesos Heredia）。連絡先：${EMAIL}`,
        ],
      },
      {
        heading: '取得するデータと目的',
        body: [
          {
            list: [
              '接続データ（IPアドレスを含む）：サイト閲覧時、ホスティング事業者（Cloudflare）がサービスの提供と安全確保のために技術的な接続データを記録します。法的根拠：正当な利益（サイトのセキュリティと運用）。',
              `メール：${EMAIL} にご連絡いただいた場合、返信のためにメッセージの内容のみを取り扱います。法的根拠：お問い合わせによる同意。`,
            ],
          },
          '広告・解析・プロファイリングのためのデータ収集は行いません。',
        ],
      },
      {
        heading: '提供事業者と国外移転',
        body: [
          'ホスティングおよび配信：Cloudflare。欧州経済領域（EEA）外（例：米国）のサーバーでの処理を伴う場合がありますが、GDPR が定める適切な保護措置（標準契約条項／EU・米国データプライバシーフレームワーク）に基づきます。',
          '音楽プレーヤー：「Spotify で聴く」を押すと Spotify のプレーヤーが読み込まれ、独自のクッキーが設定される場合があります（「クッキー」参照）。',
        ],
      },
      {
        heading: '保存期間',
        body: [
          '技術ログはサービスの安全確保に必要な期間保存します。メールはやり取りの期間および法令上必要な期間保存します。',
        ],
      },
      {
        heading: 'あなたの権利',
        body: [
          `アクセス・訂正・削除・異議・制限・ポータビリティの各権利は、${EMAIL} への連絡により行使できます。`,
          '対応が適切でないと考える場合、スペインデータ保護庁（AEPD、www.aepd.es）に苦情を申し立てることができます。',
        ],
      },
      {
        heading: 'クッキー',
        body: [
          'クッキーとは、サイトがブラウザに保存する小さなファイルです。本サイトは自社のトラッキング／解析クッキーを使用しません。',
          {
            list: [
              '技術的クッキー（Cloudflare）：提供事業者がサイトの安全と動作に必要不可欠なクッキーを使用する場合があります。これらは同意が不要です。',
              '第三者クッキー（Spotify）：「Spotify で聴く」を押した場合のみ読み込まれ、その際 Spotify が自社のポリシーに基づきクッキーを設定する場合があります。',
            ],
          },
          'そのため、クッキーのバナーは表示していません。あなたの操作なしに不要なクッキーを設定することはありません。クッキーはブラウザの設定でブロック・削除できます。',
        ],
      },
      {
        heading: '変更',
        body: [
          '本ポリシーは更新される場合があります。変更はこのページに更新日とともに掲載します。',
        ],
      },
    ],
    note: '法的にはスペイン語版が優先されます。',
  },
}

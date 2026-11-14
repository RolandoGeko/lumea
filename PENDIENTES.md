# Pendientes para el lanzamiento comercial

## Negocio y operación
- [ ] Confirmar el nombre definitivo y registrar la marca (INDECOPI).
- [ ] Definir precios reales por diseño, tamaño y recipiente; costos de entrega por distrito.
- [ ] Definir la cobertura real de distritos, los horarios y los tiempos mínimos de anticipación.
- [ ] Definir proveedores florales y la disponibilidad por temporada (actualizar `flowerOptions`).
- [ ] Redactar las políticas de cambios, cancelaciones y sustitución de flores.
- [ ] Definir las condiciones comerciales B2B: convenios, crédito, facturación y volúmenes.

## Contenido y marca
- [ ] Sesión fotográfica propia de los 12 diseños (reemplazar las fotos de referencia de Unsplash en `src/data/photos.ts` / `catalog.ts`).
- [ ] Logo definitivo (`brand.logoSrc`) y favicon.
- [ ] Revisar los textos con el equipo y validar el tono con clientes reales.
- [ ] Testimonios **solo** cuando existan clientes reales y con su autorización.

## Legal y datos personales (Perú)
- [ ] Política de privacidad conforme a la Ley N.º 29733 y su reglamento; registrar el banco de datos si corresponde.
- [ ] Términos y condiciones de venta y Libro de Reclamaciones virtual (obligatorio para comercio electrónico).
- [ ] Consentimiento explícito para el tratamiento de los datos de contacto y de la información sobre la persona homenajeada.
- [ ] Emisión de comprobantes electrónicos (boleta/factura, SUNAT).

## Tecnología
- [ ] Dominio y hosting (con *SPA fallback*), HTTPS y analítica respetuosa de la privacidad.
- [ ] Número de WhatsApp Business real en `brand.whatsappNumber`.
- [ ] Backend o servicio de formularios para recibir las solicitudes (hoy solo hay demo).
- [ ] Pasarela de pagos (cuando el negocio lo requiera) y confirmación de pedidos.
- [ ] Panel interno para gestionar solicitudes, disponibilidad y estados.
- [ ] Cuentas corporativas, pedidos recurrentes y listas de destinatarios (B2B).
- [ ] SEO: metadatos por página, sitemap, Open Graph y datos estructurados.
- [ ] Pruebas automatizadas (unitarias para precios y mensaje, E2E para configurador y carrito).
- [ ] Auditoría de accesibilidad (WCAG 2.1 AA) y de rendimiento en móviles de gama media.
- [ ] Optimizar las fuentes (autoalojarlas) y las imágenes reales (WebP/AVIF, tamaños responsivos).

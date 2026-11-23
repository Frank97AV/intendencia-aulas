-- =====================================================================
-- Intendencia de Aulas - esquema inicial (MVP)
-- Basado en el Anexo A de la Documentación Integral, con los ajustes
-- registrados en memory/decisiones.md (ADR-001..ADR-006).
-- =====================================================================

CREATE TABLE IF NOT EXISTS unidades_academicas (
    id_unidad BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario BIGSERIAL PRIMARY KEY,
    correo_google VARCHAR(255) NOT NULL,
    nombre VARCHAR(180) NOT NULL,
    id_unidad BIGINT REFERENCES unidades_academicas(id_unidad),
    rol VARCHAR(30) NOT NULL,
    autorizado BOOLEAN NOT NULL DEFAULT FALSE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT ck_usuarios_rol CHECK (rol IN ('ADMIN', 'SOLICITANTE'))
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_usuarios_correo_lower
    ON usuarios (lower(correo_google));
CREATE INDEX IF NOT EXISTS ix_usuarios_unidad
    ON usuarios (id_unidad);

CREATE TABLE IF NOT EXISTS ciclos (
    id_ciclo BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    inicio_solicitudes TIMESTAMPTZ NOT NULL,
    fin_solicitudes TIMESTAMPTZ NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT ck_ciclos_fechas CHECK (fecha_fin >= fecha_inicio),
    CONSTRAINT ck_ciclos_ventana CHECK (fin_solicitudes >= inicio_solicitudes)
);

-- Solo puede existir un ciclo activo a la vez (ADR-003).
CREATE UNIQUE INDEX IF NOT EXISTS ux_ciclos_unico_activo
    ON ciclos (activo) WHERE activo;

CREATE TABLE IF NOT EXISTS cursos (
    id_curso BIGSERIAL PRIMARY KEY,
    clave VARCHAR(50) NOT NULL UNIQUE,
    nombre_curso VARCHAR(250) NOT NULL,
    id_unidad BIGINT REFERENCES unidades_academicas(id_unidad),
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS ix_cursos_unidad
    ON cursos (id_unidad);

CREATE TABLE IF NOT EXISTS aulas (
    id_aula BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    capacidad INTEGER NOT NULL,
    tipo_aula VARCHAR(30) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT ck_aulas_capacidad CHECK (capacidad >= 0),
    CONSTRAINT ck_aulas_tipo CHECK (tipo_aula IN ('Normal', 'Híbrido'))
);

CREATE TABLE IF NOT EXISTS solicitudes (
    id_solicitud BIGSERIAL PRIMARY KEY,
    id_unidad BIGINT NOT NULL REFERENCES unidades_academicas(id_unidad),
    id_ciclo BIGINT NOT NULL REFERENCES ciclos(id_ciclo),
    estado VARCHAR(30) NOT NULL,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_solicitudes_estado CHECK (
        estado IN ('BORRADOR', 'REGISTRADA', 'CERRADA')
    ),
    CONSTRAINT ux_solicitudes_unidad_ciclo UNIQUE (id_unidad, id_ciclo)
);

CREATE TABLE IF NOT EXISTS versiones (
    id_version BIGSERIAL PRIMARY KEY,
    id_solicitud BIGINT NOT NULL REFERENCES solicitudes(id_solicitud),
    numero_version INTEGER NOT NULL,
    id_usuario BIGINT NOT NULL REFERENCES usuarios(id_usuario),
    fecha_version TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observacion TEXT,
    CONSTRAINT ck_versiones_numero CHECK (numero_version > 0),
    CONSTRAINT ux_versiones_solicitud_numero UNIQUE (id_solicitud, numero_version)
);

CREATE TABLE IF NOT EXISTS detalle_version (
    id_detalle BIGSERIAL PRIMARY KEY,
    id_version BIGINT NOT NULL REFERENCES versiones(id_version),
    id_curso BIGINT REFERENCES cursos(id_curso),
    clave_curso VARCHAR(50) NOT NULL,
    nombre_curso VARCHAR(200),
    secuencia VARCHAR(30),
    horario VARCHAR(50),
    vacantes INTEGER NOT NULL,
    docentes TEXT,
    dia VARCHAR(20),
    hora_inicio TIME,
    hora_fin TIME,
    formato_curso VARCHAR(30),
    tipo_aula_solicitado VARCHAR(30),
    facultad_programa VARCHAR(180),
    observaciones_facultad TEXT,
    id_aula BIGINT REFERENCES aulas(id_aula),
    observaciones_intendencia TEXT,
    CONSTRAINT ck_detalle_vacantes CHECK (vacantes >= 1),
    CONSTRAINT ck_detalle_horas CHECK (
        hora_inicio IS NULL OR hora_fin IS NULL OR hora_fin > hora_inicio
    ),
    CONSTRAINT ck_detalle_formato CHECK (
        formato_curso IS NULL OR formato_curso IN ('Presencial', 'Semipresencial')
    ),
    CONSTRAINT ck_detalle_tipo_aula CHECK (
        tipo_aula_solicitado IS NULL OR tipo_aula_solicitado IN ('Normal', 'Híbrido')
    )
);

CREATE INDEX IF NOT EXISTS idx_solicitudes_ciclo_unidad
    ON solicitudes (id_ciclo, id_unidad);
CREATE INDEX IF NOT EXISTS idx_versiones_solicitud_numero
    ON versiones (id_solicitud, numero_version DESC);
CREATE INDEX IF NOT EXISTS idx_detalle_version_version
    ON detalle_version (id_version);

/**
 * Contrato común de los modelos 3D: el usuario no interactúa con ellos,
 * solo cambian según el progreso del scroll. Las implementaciones
 * (PlaceholderModel, GltfModel) son intercambiables.
 */
export interface ModelController {
  /** Progreso normalizado por secciones (0–1), ya amortiguado. */
  setProgress(progress: number): void
}

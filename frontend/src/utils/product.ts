export interface Product {
  id?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  estado: boolean;
}

export interface ProductDetail extends Product {
  usuarioCreacion?: string | null;
  fechaCreacion?: string | null;
  usuarioModificacion?: string | null;
  fechaModificacion?: string | null;
}

export function normalizeProduct(raw: Record<string, unknown>): Product {
  return {
    id: String(raw.id ?? ""),
    nombre: String(raw.nombre ?? raw.Nombre ?? ""),
    descripcion: String(
      raw.description ?? raw.descripcion ?? raw.Description ?? ""
    ),
    precio: Number(raw.precio ?? raw.Precio ?? 0),
    estado: Boolean(raw.estado ?? raw.Estado),
  };
}

export function normalizeProductDetail(raw: Record<string, unknown>): ProductDetail {
  const base = normalizeProduct(raw);
  return {
    ...base,
    usuarioCreacion: (raw.usuarioCreacion ?? null) as string | null,
    fechaCreacion: (raw.fechaCreacion ?? null) as string | null,
    usuarioModificacion: (raw.usuarioModificacion ?? null) as string | null,
    fechaModificacion: (raw.fechaModificacion ?? null) as string | null,
  };
}

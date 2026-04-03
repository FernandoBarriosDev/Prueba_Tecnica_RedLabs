using Prueba_Tecnica_RedLab.Domain.Entities;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using QDocument = QuestPDF.Fluent.Document;

namespace Prueba_Tecnica_RedLab.Application.Services
{
    public class PdfService
    {
        private static TextStyle CellBodyStyle =>
            TextStyle.Default
                .FontSize(9)
                .LineHeight(1.25f);

        public byte[] GenerateProductsPdf(List<Product> products)
        {
            var pdf = QDocument.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(20);
                    // Header 
                    page.Header().PaddingBottom(10).Text("Reporte de Productos")
                        .SemiBold()
                        .FontSize(20)
                        .AlignCenter();
                    page.Content().Table(table =>
                    {
                        // Columnas (más ancho a descripción para textos largos)
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(3); 
                            columns.RelativeColumn(5); 
                            columns.RelativeColumn(2); 
                            columns.RelativeColumn(2); 
                            columns.RelativeColumn(2); 
                        });
                        table.Header(header =>
                        {
                            string[] titles = { "Nombre", "Descripción", "Precio", "Estado", "Creado Por" };
                            foreach (var title in titles)
                            {
                                header.Cell()
                                    .Background("#e0e0e0")
                                    .Border(1)
                                    .Padding(5)
                                    .AlignCenter()
                                    .Text(title)
                                    .SemiBold();
                            }
                        });
                        foreach (var p in products)
                        {
                            table.Cell().Border(1).Padding(5).Text(t =>
                            {
                                t.DefaultTextStyle(CellBodyStyle);
                                t.Span(p.Nombre);
                            });
                            table.Cell().Border(1).Padding(5).Text(t =>
                            {
                                t.DefaultTextStyle(CellBodyStyle);
                                t.Span(string.IsNullOrEmpty(p.Description) ? "-" : p.Description);
                            });
                            table.Cell().Border(1).Padding(5).AlignRight().Text(p.Precio.ToString("C"));
                            table.Cell().Border(1).Padding(5).AlignCenter().Text(p.Estado ? "Activo" : "Inactivo");
                            table.Cell().Border(1).Padding(5).Text(tx =>
                            {
                                tx.DefaultTextStyle(CellBodyStyle);
                                tx.Span(p.UsuarioCreacion ?? "-");
                            });
                        }
                    });
                    page.Footer().AlignCenter().Text(text =>
                    {
                        text.Span("Página ");
                        text.CurrentPageNumber();
                        text.Span(" de ");
                        text.TotalPages();
                    });
                });
            });

            return pdf.GeneratePdf();
        }
    }
}
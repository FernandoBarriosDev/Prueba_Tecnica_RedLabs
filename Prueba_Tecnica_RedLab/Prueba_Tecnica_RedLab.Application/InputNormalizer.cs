namespace Prueba_Tecnica_RedLab.Application
{

    public static class InputNormalizer
    {
        public const int UsernameMaxLength = 100;
        public const int ProductNombreMaxLength = 200;
        public const int ProductDescriptionMaxLength = 2000;

        public static string NormalizeUsername(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
                return string.Empty;

            var trimmed = username.Trim();
            var chars = trimmed.Where(c => !char.IsControl(c)).ToArray();
            var s = new string(chars);
            return s.Length <= UsernameMaxLength ? s : s[..UsernameMaxLength];
        }

        public static string NormalizeProductNombre(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return string.Empty;

            var trimmed = value.Trim();
            var s = new string(trimmed.Where(c => !char.IsControl(c)).ToArray());
            return s.Length <= ProductNombreMaxLength ? s : s[..ProductNombreMaxLength];
        }

        public static string? NormalizeProductDescription(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;

            var trimmed = value.Trim();
            var s = new string(trimmed.Where(c => !char.IsControl(c) || c is '\n' or '\r' or '\t').ToArray());
            if (s.Length > ProductDescriptionMaxLength)
                s = s[..ProductDescriptionMaxLength];
            return string.IsNullOrWhiteSpace(s) ? null : s;
        }
    }
}
